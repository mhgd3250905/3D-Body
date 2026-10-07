"""Derive the gender-neutral shop-window mannequin body for the muscle viewer.

Input : public/anatomy/fitness-reference.glb (body + shorts). Left unchanged:
        the movement inspector still uses the dressed reference.
Output: public/anatomy/mannequin-reference.glb (+ .json), muscle viewer only.

Steps (all offline, numpy/scipy, no Blender needed):
 1. drop the shorts mesh and the unused UVs; weld UV-seam duplicates
 2. groin / perineum: biharmonic fairing of a masked patch -> one smooth,
    continuous surface without sex features (clothing-store mannequin)
 3. head: face (nose, lips, brows, eye caps) and both ears (incl. canals)
    re-filled radially: membrane directions + harmonic radius about a head
    ellipsoid -> smooth faceless head; skull, jaw and neck kept
 4. gentle Taubin smoothing of the whole body (hands/feet protected) and a
    soft blend band around each faired patch; recompute smooth normals
Usage: python3 tools/mannequin/build_mannequin.py
"""
import sys, os, json, hashlib
sys.path.insert(0, os.path.dirname(__file__))
import numpy as np
import scipy.sparse as sp
import scipy.sparse.linalg as spla
from glbio import read_glb, write_glb, weld
from meshops import vertex_normals, adjacency, umbrella, smooth, laplace, smoothstep

ROOT = os.path.join(os.path.dirname(__file__), '..', '..')
SRC = os.path.join(ROOT, 'public/anatomy/fitness-reference.glb')
RADIUS_ORDER = 1
HEAD_C = np.array([0.0, 1.575, 0.035]); HEAD_AX = np.array([0.085, 0.115, 0.105])
DST = os.path.join(ROOT, 'public/anatomy/mannequin-reference.glb')


def biharmonic_fill(p, A, region):
    """Replace positions of `region` vertices by the biharmonic (thin-plate)
    interpolant of the surrounding fixed surface (uniform graph Laplacian)."""
    n = len(p); d = np.asarray(A.sum(1)).ravel()
    L = sp.diags(d) - A
    M = (L @ L).tocsr()
    R = np.where(region)[0]; F = np.where(~region)[0]
    MRR = M[R][:, R].tocsc(); MRF = M[R][:, F]
    rhs = -(MRF @ p[F])
    lu = spla.splu(MRR)
    q = p.copy(); q[R] = np.column_stack([lu.solve(rhs[:, k]) for k in range(3)])
    return q


def _solve(A, region, values, order):
    n = A.shape[0]; d = np.asarray(A.sum(1)).ravel()
    L = (sp.diags(d) - A).tocsr()
    M = (L @ L).tocsr() if order == 2 else L
    R = np.where(region)[0]; F = np.where(~region)[0]
    lu = spla.splu(M[R][:, R].tocsc())
    rhs = -(M[R][:, F] @ values[F])
    out = values.copy()
    out[R] = np.column_stack([lu.solve(rhs[:, k]) for k in range(values.shape[1])]) if values.ndim > 1 else lu.solve(rhs)
    return out


def radial_fill(p, A, region, centre, axes):
    """Fill a patch of a roughly ellipsoidal part (the head): the direction of
    each vertex from `centre` comes from a harmonic (membrane, fold-free)
    fill, its ellipsoid-normalised radius from a biharmonic fill of the
    surrounding radii -> a smooth, convex continuation of the skull."""
    q = (p - centre) / axes
    r = np.linalg.norm(q, axis=1)
    m = _solve(A, region, q, 1)                       # membrane positions
    dirs = m / np.maximum(np.linalg.norm(m, axis=1, keepdims=True), 1e-9)
    rr = _solve(A, region, r, RADIUS_ORDER)           # smooth radius field
    out = p.copy(); out[region] = centre + (dirs * rr[:, None])[region] * axes
    return out


def fit_ellipsoid(pts):
    """Axis-aligned ellipsoid a x^2 + b y^2 + c z^2 + d x + e y + g z = 1 (least squares)."""
    x, y, z = pts.T
    D = np.column_stack([x * x, y * y, z * z, x, y, z])
    a, b, c, d, e, g = np.linalg.lstsq(D, np.ones(len(pts)), rcond=None)[0]
    centre = np.array([-d / (2 * a), -e / (2 * b), -g / (2 * c)])
    k = 1 + a * centre[0] ** 2 + b * centre[1] ** 2 + c * centre[2] ** 2
    return centre, np.sqrt(k / np.array([a, b, c]))


def grow(A, mask, rings):
    m = mask.copy()
    for _ in range(rings): m = m | (A @ m.astype(float) > 0)
    return m


def main():
    _, meshes = read_glb(SRC)
    body = next(m for m in meshes if m['extras'].get('partRole') == 'body-surface')
    p, f, _ = weld(body['position'], body['indices'])
    # keep only the main closed surface (drops a 63-vertex loose mouth-cap shell)
    from scipy.sparse.csgraph import connected_components
    _, lab = connected_components(adjacency(len(p), f))
    main_c = np.bincount(lab).argmax(); f = f[lab[f[:, 0]] == main_c]
    used = np.unique(f); remap = -np.ones(len(p), np.int64); remap[used] = np.arange(len(used))
    p, f = p[used], remap[f]  # drop vertices orphaned by the old eye/mouth caps
    A = adjacency(len(p), f); W = umbrella(A)
    x, y, z = p[:, 0], p[:, 1], p[:, 2]; ax = np.abs(x)

    # --- groin: front genital area + perineum between the thighs ------------
    groin = (ax < 0.075) & (y > 0.68) & (y < 0.93) & (z > -0.075) & (z < 0.14)
    groin &= ~((y > 0.86) & (z < 0.0))  # keep the buttock cleft above the perineum
    # --- face: nose, lips, brows, eye caps, chin detail ----------------------
    face = (y > 1.455) & (y < 1.66) & (z > 0.068) & (ax < 0.082) & ~((y < 1.48) & (z < 0.095))
    # --- ears ----------------------------------------------------------------
    ears = (ax > 0.030) & (y > 1.495) & (y < 1.64) & (z > -0.028) & (z < 0.075)
    region = groin | face | ears
    p = biharmonic_fill(p, A, groin)
    hc, hax = HEAD_C, HEAD_AX
    p = radial_fill(p, A, face | ears, hc, hax)

    # soft blend band around each faired patch, then a gentle whole-body pass
    band = grow(A, region, 6) & ~region
    p = smooth(p, W, band.astype(float), iters=10)
    y = p[:, 1]; ax = np.abs(p[:, 0])
    # soft local passes: jaw/neck junction and the lower belly / pubic area
    def blob(c, r):
        d = np.linalg.norm((p - np.array(c)) / np.array(r), axis=1)
        return smoothstep(1.0, 0.45, d)
    # head/neck junction: a tilted ring (lower under the chin, higher at the nape)
    yj = 1.49 - 0.35 * (p[:, 2] - 0.03)
    ring = smoothstep(0.04, 0.0, np.abs(p[:, 1] - yj)) * smoothstep(0.11, 0.08, np.abs(p[:, 0]))
    p = laplace(p, W, 0.8 * ring, iters=40)  # plain Laplacian: fills the concave crease
    p = smooth(p, W, blob([0.0, 0.84, 0.05], [0.10, 0.08, 0.09]), iters=25)
    # neck: soften the tendon/collarbone relief into a clean mannequin column
    p = smooth(p, W, 0.7 * blob([0.0, 1.42, 0.03], [0.10, 0.07, 0.10]), iters=20)
    # torso front: soften the sculpted chest/abdominal relief toward a neutral mannequin
    p = smooth(p, W, 0.7 * blob([0.0, 1.20, 0.10], [0.20, 0.20, 0.12]), iters=15)
    y = p[:, 1]; ax = np.abs(p[:, 0])
    protect = np.maximum(smoothstep(0.30, 0.36, ax) * smoothstep(1.05, 0.98, y),  # hands
                         smoothstep(0.10, 0.06, y))                               # feet
    p = smooth(p, W, 0.6 * (1 - protect), iters=4)

    nrm = vertex_normals(p, f)
    mat = {'name': 'Matte mannequin', 'pbrMetallicRoughness': {'baseColorFactor': [0.66, 0.68, 0.71, 1], 'metallicFactor': 0, 'roughnessFactor': 0.62}}
    extras = {**body['extras'], 'derivation': 'Gender-neutral mannequin: shorts removed, groin/face/ears biharmonically faired, gentle Taubin smoothing (tools/mannequin/build_mannequin.py).'}
    size = write_glb(DST, [{'name': 'Fitness_Body_Surface', 'extras': extras, 'position': p, 'normal': nrm, 'indices': f, 'material': mat}], scene_name='Mannequin fitness reference')
    stats = {'vertices': int(len(p)), 'triangles': int(len(f)), 'glbBytes': size, 'faired': {'groin': int(groin.sum()), 'face': int(face.sum()), 'ears': int(ears.sum())},
             'glbSha256': hashlib.sha256(open(DST, 'rb').read()).hexdigest(), 'bounds': {'min': p.min(0).tolist(), 'max': p.max(0).tolist()}}
    stats['headEllipsoid'] = {'centre': hc.round(4).tolist(), 'axes': hax.round(4).tolist()}
    meta = {
        'source': 'Blender Studio Human Base Meshes (via public/anatomy/fitness-reference.glb)', 'sourceId': 'GEO-body_male_realistic',
        'license': 'CC0-1.0', 'units': 'meters', 'upAxis': '+Y', 'frontAxis': '+Z', 'usedBy': 'muscle viewer (src/muscle-viewer.js)',
        'look': 'gender-neutral shop-window mannequin: no clothing, smooth one-piece groin without sex features, faceless head, clean matte surface',
        'parts': [{'name': 'Fitness_Body_Surface', 'partRole': 'body-surface', 'vertices': stats['vertices'], 'triangles': stats['triangles']}],
        'bounds': stats['bounds'], 'glbBytes': size, 'glbSha256': stats['glbSha256'],
        'modifications': [
            'Shorts mesh and unused UVs removed; UV-seam duplicates welded; a loose 63-vertex mouth-cap shell dropped.',
            f"Groin/perineum: biharmonic fairing of {stats['faired']['groin']} vertices -> smooth continuous mannequin surface.",
            f"Face ({stats['faired']['face']} vertices) and ears incl. canals ({stats['faired']['ears']} vertices): radial re-fill about a head ellipsoid (membrane directions, harmonic radius) -> faceless head.",
            'Soft blend band around faired patches, Laplacian smoothing of the head/neck junction, Taubin smoothing of the lower belly and a gentle whole-body Taubin pass (hands/feet protected); smooth vertex normals.',
        ],
        'limits': ['Static reference pose; proportions remain those of the source base mesh (broad shoulders).', 'Muscle panels are drawn per pixel by src/muscle-map.js: location only, never EMG or effort.'],
        'tool': 'tools/mannequin/build_mannequin.py',
    }
    open(DST.replace('.glb', '.json'), 'w').write(json.dumps(meta, indent=2, ensure_ascii=False) + '\n')
    print(json.dumps(stats))
    return stats

if __name__ == '__main__':
    main()
