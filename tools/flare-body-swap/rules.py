# Flare rule check over a render's per-frame metrics (met-*.json from render.mjs --mode new).
# python3 rules.py <met.json> <out.json>
import json,sys,math
m=[r for r in json.load(open(sys.argv[1])) if r['f']>=0]
def sub(a,b):return [a[i]-b[i] for i in range(3)]
def segd(p1,q1,p2,q2):
    best=9
    for i in range(21):
        s=i/20;a=[p1[k]+(q1[k]-p1[k])*s for k in range(3)]
        for j in range(21):
            t=j/20;b=[p2[k]+(q2[k]-p2[k])*t for k in range(3)];best=min(best,math.dist(a,b))
    return best
rows=[]
for r in m:
    J=r['J'];leg=lambda s:[(J[s+'Hip'],J[s+'Knee']),(J[s+'Knee'],J[s+'Ankle'])]
    arm=lambda s:[(J[s+'Shoulder'],J[s+'Elbow']),(J[s+'Elbow'],J[s+'Wrist'])]
    ll=min(segd(*a,*b) for a in leg('left') for b in leg('right'))
    al=min(segd(*a,*b) for s in ['left','right'] for a in arm(s) for l in ['left','right'] for b in leg(l))
    floor=[s for s in ['left','right'] if r['handContact'][s]['mode']=='floor']
    rows.append(dict(f=r['f'],phase=r['bakedClip']['phaseId'],kneeL=r['knee']['left'],kneeR=r['knee']['right'],
      legLegAxisMm=ll*1000,armLegAxisMm=al*1000,capsuleWorstMm=r['clip']['worstGapMm'],capsuleWorstPair=r['clip']['worstPair'],
      overlaps=[p for p in r['clip']['near'] if p.get('gapMm',1)<0] if isinstance(r['clip']['near'],list) else [],
      handClipMm=min(r['handClip']['left'],r['handClip']['right']),
      floorPalmY=[r['handContact'][s]['palmY']*1000 for s in floor],floorWristY=[r['handContact'][s]['wristY']*1000 for s in floor],
      minYmm=r['minY']*1000,minYMesh=r['minYMesh'],profile=r.get('profile')))
def rng(k):v=[x[k] for x in rows];return [round(min(v),1),round(max(v),1)]
fp=[y for x in rows for y in x['floorPalmY']];fw=[y for x in rows for y in x['floorWristY']]
legpairs=[x for x in rows if any(k in x['capsuleWorstPair'] for k in ['thigh','shin','calf','foot']) and x['capsuleWorstMm']<0]
S=dict(frames=len(rows),profile=sorted(set(x['profile'] for x in rows)),
  kneeDegMin=round(min(min(x['kneeL'],x['kneeR']) for x in rows),1),
  legLegAxisMmMin=round(min(x['legLeg'+'AxisMm'] for x in rows),1),armLegAxisMmMin=round(min(x['armLegAxisMm'] for x in rows),1),
  capsuleWorstGapMm=rng('capsuleWorstMm'),capsuleOverlapFrames=sum(1 for x in rows if x['capsuleWorstMm']<0),
  capsuleOverlapPairs=sorted(set(x['capsuleWorstPair'] for x in rows if x['capsuleWorstMm']<0)),
  handClipMmMin=round(min(x['handClipMm'] for x in rows),1),
  floorHandFrames=sum(len(x['floorPalmY']) for x in rows),floorPalmYmm=[round(min(fp),1),round(max(fp),1)],floorWristYmm=[round(min(fw),1),round(max(fw),1)],
  minYmm=round(min(x['minYmm'] for x in rows),1))
cf=[r['crotchFold'] for r in m if r.get('crotchFold')]
if cf:  # crotch-region surface quality of the shorts (crotch-smooth QA): folded = triangles turned inside out, pinched = area < 35% of rest
    S['crotchSmooth']=sorted(set(r.get('crotchSmooth') for r in m))
    S['crotchFoldedTrisMax']=max(c['folded'] for c in cf);S['crotchFoldedTrisSum']=sum(c['folded'] for c in cf)
    S['crotchPinchedTrisMax']=max(c['pinched'] for c in cf);S['crotchPinchedTrisSum']=sum(c['pinched'] for c in cf)
    S['crotchMinAreaRatio']=min(c['minAreaRatio'] for c in cf);S['crotchRegionTris']=cf[0]['tris']
json.dump(dict(summary=S,frames=rows),open(sys.argv[2],'w'),indent=1);print(json.dumps(S,indent=1))
