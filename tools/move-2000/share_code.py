#!/usr/bin/env python3
"""Decode an editor share code ("B2K1." + base64url(deflate-raw(JSON))) back into the full animation backup.

Mirror of src/share-code.js: the code keeps only the original frames that differ from the bundled keyframes
(public/coach/move-2000-sequence.json), all K frames / curves / routes / settings, and drops the transition
document's `base` when it equals the sequence's own frames. Restoring against the same bundled keyframes gives the
exact backup that "生成完整备份" writes.
Usage: share_code.py <code-or-file> [--base move-2000-sequence.json] [--out backup.json]"""
import argparse, base64, copy, json, os, sys, zlib

PREFIX = 'B2K1.'
DEFAULT_BASE = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', '..', 'public', 'coach', 'move-2000-sequence.json')


def is_share_code(text):
    return isinstance(text, str) and ''.join(text.split()).startswith(PREFIX)


def decode_payload(code):
    body = ''.join(code.split())
    if not body.startswith(PREFIX): raise ValueError('not a share code')
    raw = body[len(PREFIX):]; raw += '=' * (-len(raw) % 4)
    return json.loads(zlib.decompress(base64.urlsafe_b64decode(raw), -15).decode('utf-8'))


def _patch(base, diff):
    out = copy.deepcopy(base)
    for key in (diff or {}).get('d', []): out.pop(key, None)
    for key, value in (diff or {}).get('s', {}).items(): out[key] = copy.deepcopy(value)
    return out


def _base_of(seq):
    return {'period': seq['period'], 'steps': [{'id': st.get('id'), 'pose': copy.deepcopy(st['pose'])} for st in seq['steps']]}


def restore(payload, bundled):
    if payload.get('f') != 'b2k-share' or payload.get('v') != 1: raise ValueError('unknown share code format')
    expected = (bundled.get('source') or {}).get('revision')
    if payload.get('base') != expected:
        raise ValueError(f"share code is based on {payload.get('base')} keyframes, base file is {expected}; pass --base with the matching move-2000-sequence.json")
    base_top = {k: v for k, v in bundled.items() if k != 'steps'}
    if 'fullSteps' in payload: steps = copy.deepcopy(payload['fullSteps'])
    else: steps = [_patch(st, (payload.get('steps') or {}).get(str(i))) for i, st in enumerate(bundled['steps'])]
    top = _patch(base_top, payload.get('seq')); seq = {}
    for key in bundled:
        if key == 'steps': seq['steps'] = steps
        elif key in top: seq[key] = top[key]
    for key in top:
        if key not in seq: seq[key] = top[key]
    doc = copy.deepcopy(payload.get('doc') or {})
    if payload.get('docBase'):
        rebuilt, placed = {}, False
        for key, value in doc.items():
            rebuilt[key] = value
            if key == 'version': rebuilt['base'] = _base_of(seq); placed = True
        if not placed: rebuilt['base'] = _base_of(seq)
        doc = rebuilt
    doc['sequence'] = seq
    if payload.get('move'): doc['move'] = payload['move']
    return doc


def load_any(src, base_path=None):
    """Read a backup from a path or a literal string: full JSON (any editor format) or a share code."""
    text = open(src, encoding='utf-8-sig').read() if os.path.exists(src) else src
    if is_share_code(text):
        bundled = json.load(open(base_path or DEFAULT_BASE, encoding='utf-8'))
        return restore(decode_payload(text), bundled)
    return json.loads(text)


if __name__ == '__main__':
    ap = argparse.ArgumentParser(); ap.add_argument('src'); ap.add_argument('--base'); ap.add_argument('--out')
    A = ap.parse_args()
    data = load_any(A.src, A.base)
    text = json.dumps(data, ensure_ascii=False, separators=(',', ':'))
    if A.out: open(A.out, 'w', encoding='utf-8').write(text); print('restored ->', A.out, file=sys.stderr)
    else: print(text)
