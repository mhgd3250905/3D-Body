import{Q as ae,l as $,h as it,V as O,k as Q,N as re,e as Ue,ad as Tt,q as Rt,_ as st,g as fe,ae as Jt,af as eo,o as Xe,D as Nt,$ as to,G as Lt,n as tt,a7 as Be,a as Ot,a8 as oo,v as no,a6 as ao,ag as ro,ab as io,ah as so,ac as lo,p as St,ai as co,b as De,j as fo,c as uo,aj as mo,W as po,r as ho}from"./meshopt_decoder.module-BxcarpM8.js";function go({bones:t,renderer:c}){const n=["left","right"].filter(p=>t[p+"ForearmTwist1"]&&t[p+"Hand"]&&t[p+"Forearm"]);if(!n.length)return null;const x={};for(const p of n){const e=t[p+"Forearm"],o=t[p+"Hand"],l=[],w=[];for(let r=1;t[p+"ForearmTwist"+r];r++)l.push(t[p+"ForearmTwist"+r]);for(let r=1;t[p+"WristBend"+r];r++)w.push(t[p+"WristBend"+r]);for(const r of[...l,...w])r.parent!==e&&e.attach(r);x[p]={a:o.position.clone().normalize(),fa:e,hand:o,tw:l,bd:w,prev:null,snapF:new ae,snapH:new ae}}const y=new ae,S=new ae,d=new ae,i=new ae,A=new ae,g=new ae,a={theta:{},swing:{},wraps:0,seeks:0,hubUndone:0},_=1.5*Math.PI,f=Math.PI/2;function m(){for(const p of n){const e=x[p],o=e.a;i.copy(e.hand.quaternion).normalize(),i.w<0&&i.set(-i.x,-i.y,-i.z,-i.w);const l=2*Math.atan2(i.x*o.x+i.y*o.y+i.z*o.z,i.w);let w=l;if(e.prev!=null){for(;w-e.prev>Math.PI;)w-=2*Math.PI;for(;w-e.prev<-Math.PI;)w+=2*Math.PI;Math.abs(w-e.prev)>f?(w=l,a.seeks++):Math.abs(w)>_&&(w=l,a.wraps++)}e.prev=w,y.setFromAxisAngle(o,w),S.copy(y).invert(),d.copy(i).multiply(S);const r=e.tw.length,b=e.bd.length+1;e.tw.forEach((R,B)=>R.quaternion.setFromAxisAngle(o,w*(B+1)/r)),e.bd.forEach((R,B)=>R.quaternion.copy(A).slerp(d,(B+1)/b).multiply(y)),a.theta[p]=+(w*180/Math.PI).toFixed(1),a.swing[p]=+(2*Math.acos(Math.min(1,Math.abs(d.w)))*180/Math.PI).toFixed(1)}}const W=()=>{const p=window.__drill;return!!(p&&(p.__wristTwistR5||p.__wristTwistR6)&&window.__wristTwistStats)};function h(){for(const p of n){const e=x[p];if(!e.fa.quaternion.equals(e.snapF)||!e.hand.quaternion.equals(e.snapH))e.fa.quaternion.copy(e.snapF),e.hand.quaternion.copy(e.snapH),a.hubUndone++;else{const o=(window.__wristTwistStats.applied?.[p]||0)*Math.PI/180;if(!o)continue;g.setFromAxisAngle(e.a,o),e.fa.quaternion.multiply(S.copy(g).invert()),e.hand.quaternion.premultiply(g),a.hubUndone++}}}let F=!1;function s(p){const e=p.onBeforeRender;p.onBeforeRender=function(...o){p.onBeforeRender=e;try{if(F){F=!1,W()&&h(),m();for(const l of n)x[l].fa.updateMatrixWorld(!0)}}finally{return e.apply(this,o)}}}const N=c.render.bind(c);return c.render=function(p,e){if(!W())return m(),N(p,e);for(const o of n)x[o].snapF.copy(x[o].fa.quaternion),x[o].snapH.copy(x[o].hand.quaternion);F=!0,s(p);try{return N(p,e)}finally{F=!1}},{update:m,stats:a,sides:n}}const ot={base:["#f7d9c4","#3f6fd8","#2b2f45","#f3f1ee"],shade:["#d99a8e","#2a3f8f","#1a1c2e","#b9b3c4"]},Y=new URLSearchParams("hair=spiky"),Bt={default:{base:ot.base,shade:ot.shade,sock:null,cap:["#d8343a","#8e1d2c"]},mono:{base:["#f7d9c4","#f2f0ec","#26242c","#2a2830"],shade:["#d99a8e","#b6b0c2","#121016","#141219"],sock:["#f2f0ec","#b6b0c2"],cap:["#2a2830","#141219"]},redblack:{base:["#f7d9c4","#d8343a","#26242c","#d8343a"],shade:["#d99a8e","#8e1d2c","#121016","#8e1d2c"],sock:["#26242c","#121016"],cap:["#26242c","#121016"]}},At={black:["#363044","#18141f","#6f6c8e"],brown:["#5a3a2c","#2c1a16","#a77a5e"]},ze=["spiky","mid","beanie"].includes(Y.get("hair"))?Y.get("hair"):"none",kt=Bt[Y.get("outfit")]?Y.get("outfit"):"default",ge=Y.get("ol")!=="0",je=Y.get("rim")==="1",Ee=(()=>{const t=Y.get("tsm");return t!=null&&isFinite(+t)?Math.max(0,Math.round(+t)):48})(),Ze=(t,c)=>Y.has(t)&&isFinite(+Y.get(t))?+Y.get(t):c,G={frac:Ze("olw",.0048),k:Ze("olk",.5),refP11:1/Math.tan(15*Math.PI/180),refZ:4.95,push:Ze("olpush",.012),hand:.5,head:.7,shoe:.8,hair:.78,ink:"#2a1d33",hairInk:"#1a1430"},Vt="#2b2230",vo=.0045,wo="#231c26",xo="#f4efe6",pe=0,Fe=1,Qe=2,_t=3,yo=["Coach_Body","Coach_Shoe_Details","Coach_Sneakers","Coach_Soles","Coach_Training_Shorts","Mesh005","Mesh005_1","V2P_Base_Limbs","V3_Head_Neck_Torso_Shared_R26","V2P_Base_Hands"],bo=.305,Ft=1,Mo=`
attribute vec4 toonW;
#ifdef TOONN
attribute vec3 toonN;
#endif
varying vec4 vW;
varying vec3 vN;
varying vec3 vV;
#include <common>
#include <skinning_pars_vertex>
void main() {
  vW = toonW;
  #include <beginnormal_vertex>
  #ifdef TOONN
  objectNormal = toonN;   // r4：明暗用更平滑的法线（描边仍用原法线）→ 暗部形状干净
  #endif
  #include <skinbase_vertex>
  #include <skinnormal_vertex>
  #include <defaultnormal_vertex>
  vN = normalize(transformedNormal);
  #include <begin_vertex>
  #include <skinning_vertex>
  #ifdef INFLATE
  transformed += normalize(objectNormal) * INFLATE;   // 领口/袖口罗纹略微外浮，避免与身体共面闪烁
  #endif
  #include <project_vertex>
  vV = -mvPosition.xyz;
}`,Et=`
int dominantRegion(vec4 weights) {
  int region = 0;
  float weight = weights.x;
  if (weights.y > weight) { weight = weights.y; region = 1; }
  if (weights.z > weight) { weight = weights.z; region = 2; }
  if (weights.w > weight) region = 3;
  return region;
}`;function nt(t,c){const[n,x,y,S]=c.map(d=>{const{r:i,g:A,b:g}=new $(d);return`vec3(${[i,A,g].map(_=>Math.fround(_).toPrecision(9)).join(", ")})`});return`
vec3 ${t}(int region) {
  if (region == 1) return ${x};
  if (region == 2) return ${y};
  if (region == 3) return ${S};
  return ${n};
}`}const So=`
uniform vec3 uLight;
varying vec4 vW;
varying vec3 vN;
varying vec3 vV;
${Et}
void main() {
  // 部位：取插值后权重最大的那一项，边界落在三角形中线上，不会糊
  int r = dominantRegion(vW);
  vec3 alb = baseColor(r), shc = shadeColor(r);
  vec3 n = normalize(vN); if (!gl_FrontFacing) n = -n;
  vec3 v = normalize(vV);
  float nl = dot(n, normalize(uLight));
  float aB = max(fwidth(nl), 1e-4);
  float b = smoothstep(0.10 - aB, 0.10 + aB, nl);          // 硬色阶两段
  shc = mix(shc, alb * vec3(0.78, 0.64, 0.70), 0.55);        // 暖色阴影
  #if defined(STYLE2) && !defined(RIM)
  vec3 lit = mix(shc, alb * 1.04, b);                          // r4：纯两阶平涂（亮/暗硬边），无边缘光
  #elif defined(STYLE2)
  float b2 = smoothstep(-0.42 - aB, -0.42 + aB, nl);          // 第三阶：背光深影（冷一点）
  vec3 deep = shc * vec3(0.80, 0.80, 0.93);
  vec3 lit = mix(mix(deep, shc, b2), alb * 1.04, b);
  float fr = pow(1.0 - clamp(dot(n, v), 0.0, 1.0), 2.6);
  float aR = max(fwidth(fr), 1e-4);
  lit += mix(alb, vec3(1.0), 0.5) * smoothstep(0.62 - aR, 0.62 + aR, fr) * 0.35 * b;   // 原受光侧硬边缘光
  // 侧逆光 rim：屏幕右侧轮廓一条暖白硬边高光（与左上主光相对），暗面也有
  float rd = dot(normalize(n.xy + 1e-5), normalize(vec2(0.85, 0.35)));
  float rm = smoothstep(0.50 - aR, 0.50 + aR, fr) * smoothstep(0.30, 0.36, rd);
  float lum = dot(alb, vec3(0.2126, 0.7152, 0.0722));
  lit = mix(lit, mix(alb, vec3(1.0, 0.96, 0.90), 0.55), rm * 0.72 * mix(0.28, 1.0, smoothstep(0.03, 0.30, lum)));   // 深色（裤）只留淡蓝灰一线
  #else
  vec3 lit = mix(shc, alb * 1.04, b);
  float fr = pow(1.0 - clamp(dot(n, v), 0.0, 1.0), 2.6);   // 与 hub toon 相同的菲涅尔
  float aR = max(fwidth(fr), 1e-4);
  lit += mix(alb, vec3(1.0), 0.5) * smoothstep(0.62 - aR, 0.62 + aR, fr) * 0.35 * b;   // 硬边缘光
  #endif
  gl_FragColor = vec4(lit, 1.0);
  #include <colorspace_fragment>
}`,Ao=`
#include <common>
#include <skinning_pars_vertex>
void main() {
  #include <beginnormal_vertex>
  #include <skinbase_vertex>
  #include <skinnormal_vertex>
  #include <begin_vertex>
  #include <skinning_vertex>
  transformed += normalize(objectNormal) * ${vo.toFixed(4)};   // 蒙皮后（米）沿法线外扩
  #include <project_vertex>
}`,at=`
uniform vec3 uColor;
void main() { gl_FragColor = vec4(uColor, 1.0);
  #include <colorspace_fragment>
}`,qt=`
uniform float uF; uniform float uW0; uniform float uK; uniform float uPush;
vec4 ol2Clip(vec4 mv, vec3 nv, float mult) {
  float z = max(0.05, -mv.z);
  float P11 = projectionMatrix[1][1], asp = projectionMatrix[1][1] / projectionMatrix[0][0];
  float wf = uW0 * P11 / (2.0 * z);
  float frac = clamp(uF * pow(wf / uF, uK), uF * 0.4, uF * 3.0) * mult;
  vec2 d = nv.xy; float l = length(d); d = l > 1e-4 ? d / l : vec2(0.0);
  mv.z -= uPush * (z / 4.95);
  vec4 c = projectionMatrix * mv;
  c.xy += d * vec2(1.0 / asp, 1.0) * 2.0 * frac * c.w;
  return c;
}`,ko=`
attribute float olW; attribute vec4 toonW; varying vec4 vW;
#include <common>
#include <skinning_pars_vertex>
${qt}
void main() {
  vW = toonW;
  #include <beginnormal_vertex>
  #include <skinbase_vertex>
  #include <skinnormal_vertex>
  #include <begin_vertex>
  #include <skinning_vertex>
  vec4 mv = modelViewMatrix * vec4(transformed, 1.0);
  gl_Position = ol2Clip(mv, normalize(normalMatrix * objectNormal), olW);
}`,_o=`
uniform vec3 uInk; varying vec4 vW;
${Et}
void main() {
  vec3 s = shadeColor(dominantRegion(vW));
  gl_FragColor = vec4(mix(s * 0.42, uInk, 0.38), 1.0);    // 色线：各部位暗色 + 深紫墨（不是纯黑）
  #include <colorspace_fragment>
}`,Ht=()=>({uF:{value:G.frac},uW0:{value:G.frac/(G.refP11/(2*G.refZ))},uK:{value:G.k},uPush:{value:G.push}});function Ke(t=ot){return new re({...ge?{defines:je?{STYLE2:"",RIM:""}:{STYLE2:"",...Ee>0?{TOONN:""}:{}}}:{},name:"toon3r2",uniforms:{uLight:{value:new O(-.45,.75,.55)}},vertexShader:Mo,fragmentShader:nt("baseColor",t.base)+nt("shadeColor",t.shade)+So})}function Fo(t){const n=new Array(24).fill(-9),x=new Array(24).fill(0);let y=0;for(const d of t)y+=d.z;y/=t.length;for(const d of t){const i=Math.floor((Math.atan2(d.x,d.z-y)/Math.PI+1)/2*24)%24,A=Math.hypot(d.x,d.z-y);n[i]=Math.max(n[i],d.y),x[i]=Math.max(x[i],A)}const S=(d,i)=>{const A=(Math.atan2(i.x,i.z-y)/Math.PI+1)/2*24-.5,g=Math.floor(A),a=A-g,_=(g%24+24)%24,f=(_+1)%24;return d[_]*(1-a)+d[f]*a};return{zc:y,top:d=>S(n,d),rad:d=>S(x,d)}}const ne=t=>{const c=[0,0,0,0];return c[t]=1,c},Ve=(t,c,n)=>{const x=Math.min(1,Math.max(0,.5+n/.02)),y=[0,0,0,0];return y[t]+=1-x,y[c]+=x,y};function Co(t,c,n,x){if(t===1||t===2||t===3)return ne(_t);if(t===5||t===6)return ne(Fe);if(t===9)return ne(pe);if(/Foot/.test(c))return ne(_t);if(/Hand|Forearm/.test(c))return ne(pe);if(/Thigh|Shin|Patella/.test(c))return ne(Qe);if(t===4)return Ve(Fe,Qe,Ft-n.y);if(c==="head")return ne(pe);if(x){if(Math.hypot(n.x,n.z-x.zc)<x.rad(n)+.005)return Ve(Fe,pe,n.y-x.top(n)-.002);if(c==="neck")return ne(pe)}else if(c==="neck")return ne(pe);return/UpperArm|Scapula/.test(c)?Ve(Fe,pe,Math.abs(n.x)-bo):Ve(Fe,Qe,Ft-n.y)}function Ct(t,c){const n=t.skeleton,x=n.bones.findIndex(y=>y.name===c);return new st().multiplyMatrices(n.bones[x].matrixWorld,n.boneInverses[x]).multiply(t.bindMatrix)}function rt(t,c=12){const n=t.attributes.position,x=n.count,y=new O,S=e=>(y.fromBufferAttribute(n,e),Math.round(y.x*2e4)+","+Math.round(y.y*2e4)+","+Math.round(y.z*2e4)),d=new Map,i=new Int32Array(x);for(let e=0;e<x;e++){const o=S(e);d.has(o)||d.set(o,d.size),i[e]=d.get(o)}const A=new Float32Array(d.size*3),g=t.index?t.index.array:null,a=g?g.length:x,_=new O,f=new O,m=new O;for(let e=0;e<a;e+=3){const o=g?g[e]:e,l=g?g[e+1]:e+1,w=g?g[e+2]:e+2;_.fromBufferAttribute(n,o),f.fromBufferAttribute(n,l),m.fromBufferAttribute(n,w),m.sub(f),_.sub(f),m.cross(_);for(const r of[o,l,w]){const b=i[r]*3;A[b]+=m.x,A[b+1]+=m.y,A[b+2]+=m.z}}const W=d.size,h=[],F=new Int32Array(W+1);{const e=Array.from({length:W},()=>new Set);for(let o=0;o<a;o+=3){const l=i[g?g[o]:o],w=i[g?g[o+1]:o+1],r=i[g?g[o+2]:o+2];e[l].add(w).add(r),e[w].add(l).add(r),e[r].add(l).add(w)}for(let o=0;o<W;o++){F[o+1]=F[o]+e[o].size;for(const l of e[o])h.push(l)}}let s=new Float32Array(A),N=new Float32Array(W*3);for(let e=0;e<W;e++){const o=Math.hypot(s[3*e],s[3*e+1],s[3*e+2])||1;s[3*e]/=o,s[3*e+1]/=o,s[3*e+2]/=o}for(let e=0;e<c;e++){for(let o=0;o<W;o++){let l=s[3*o],w=s[3*o+1],r=s[3*o+2];for(let R=F[o];R<F[o+1];R++){const B=h[R];l+=s[3*B],w+=s[3*B+1],r+=s[3*B+2]}const b=Math.hypot(l,w,r)||1;N[3*o]=l/b,N[3*o+1]=w/b,N[3*o+2]=r/b}[s,N]=[N,s]}const p=t.attributes.normal;for(let e=0;e<x;e++){const o=i[e]*3;p.setXYZ(e,s[o],s[o+1],s[o+2])}p.needsUpdate=!0}function zo(t,c,n){const x=t.skeleton,y=x.bones.indexOf(c),S=new st().multiplyMatrices(x.boneInverses[y],t.bindMatrix),d=S.clone().invert(),i=t.geometry,A=i.attributes.position;i.attributes.normal;const g=A.count,a=new O,_=[];for(let r=0;r<g;r++)_.push(a.fromBufferAttribute(A,r).applyMatrix4(S).clone());const f=(r,b,R)=>{const B=Math.min(1,Math.max(0,(R-r)/(b-r)));return B*B*(3-2*B)},m=_.map(r=>r.z<.06?0:(1-f(n.hx,n.hx+n.f,Math.abs(r.x)))*f(n.y0-n.f,n.y0,r.y)*(1-f(n.y1,n.y1+n.f,r.y))),W=r=>Math.round(r.x*1e5)+","+Math.round(r.y*1e5)+","+Math.round(r.z*1e5),h=new Map,F=[];for(let r=0;r<g;r++){const b=W(_[r]);h.has(b)||h.set(b,h.size),F.push(h.get(b))}const s=h.size,N=new Array(s),p=new Float32Array(s),e=Array.from({length:s},()=>new Set);for(let r=0;r<g;r++)N[F[r]]=_[r].clone(),p[F[r]]=Math.max(p[F[r]],m[r]);const o=i.index?i.index.array:null,l=o?o.length:g;for(let r=0;r<l;r+=3){const b=F[o?o[r]:r],R=F[o?o[r+1]:r+1],B=F[o?o[r+2]:r+2];e[b].add(R).add(B),e[R].add(b).add(B),e[B].add(b).add(R)}let w=0;for(let r=0;r<s;r++)p[r]>0&&w++;for(let r=0;r<n.iters;r++){const b=N.map(R=>R.clone());for(let R=0;R<s;R++){if(!(p[R]>0))continue;const B=new O;for(const Z of e[R])B.add(N[Z]);B.multiplyScalar(1/e[R].size),b[R].lerp(B,.6*p[R])}for(let R=0;R<s;R++)N[R]=b[R]}for(let r=0;r<g;r++)p[F[r]]>0&&(a.copy(N[F[r]]).applyMatrix4(d),A.setXYZ(r,a.x,a.y,a.z));return A.needsUpdate=!0,rt(i),i.computeBoundingSphere(),{verts:g,welded:s,active:w}}function Po(t,c){const n=t.skeleton,x=n.bones.indexOf(c),y=new st().multiplyMatrices(n.boneInverses[x],t.bindMatrix),S=new Xe,d=t.geometry.attributes.position,i=new Float32Array(d.count*3),A=new O;for(let _=0;_<d.count;_++)A.fromBufferAttribute(d,_).applyMatrix4(y),i.set([A.x,A.y,A.z],3*_);S.setAttribute("position",new Q(i,3)),S.setIndex(t.geometry.index),S.computeBoundingSphere();const g=new fe(S,new it({side:Nt}));g.updateMatrixWorld(!0);const a=new to;return(_,f)=>{a.set(new O(_,f,.4),new O(0,0,-1));const m=a.intersectObject(g,!1)[0];return m?m.point.z:null}}function Io(t,c){const n=new it({color:wo}),x={eyes:[],brows:[]};for(const a of[-1,1]){const _=a*.032,f=.069,m=c(_,f),W=new fe(new Jt(1,24,16),n);W.position.set(_,f,m!=null?m+.002:.1045),W.quaternion.set(-.020044549351510503,0,0,.9997990878377991),W.scale.set(.00819,.013125,.00315),W.userData.__face=!0,t.add(W),x.eyes.push({p:W.position.toArray().map(h=>+h.toFixed(4)),surf:m})}const y=.0105,S=.046,d=.104,i=.034,A=.004,g=6;for(const a of[-1,1]){const _=a*i,f=new eo(y/2,S-y,6,12);f.rotateZ(Math.PI/2),f.scale(1,1,.25);const m=[-y/2,0,y/2].map(s=>Array.from({length:g+1},(N,p)=>c(_-S/2-.002+(S+.004)*p/g,d+s))),W=(s,N)=>{const p=Math.min(g,Math.max(0,(s+S/2+.002)/(S+.004)*g)),e=Math.min(g-1,Math.floor(p)),o=p-e,l=Math.min(2,Math.max(0,(N+y/2)/(y/2))),w=Math.min(1,Math.floor(l)),r=l-w,b=R=>(m[R][e]??.1)*(1-o)+(m[R][e+1]??.1)*o;return b(w)*(1-r)+b(w+1)*r},h=f.attributes.position;for(let s=0;s<h.count;s++){const N=h.getX(s),p=Math.max(W(N,-y/2),W(N,0),W(N,y/2));h.setZ(s,h.getZ(s)+p+A)}h.needsUpdate=!0,f.computeVertexNormals();const F=new fe(f,n);F.position.set(_,d,0),F.userData.__face=!0,t.add(F),x.brows.push({xc:_,z:m[1].map(s=>s==null?null:+s.toFixed(4))})}return x}function Wo({scene:t,root:c,bones:n,skinned:x,grid:y,floor:S,renderer:d,camera:i}){c.updateMatrixWorld(!0);const A={prims:[],counts:[0,0,0,0]};t.background=new $(xo),y&&y.removeFromParent(),S&&(S.material=new it({color:15129805,transparent:!0,opacity:.6}));const g=n.head,a=x.slice(),_=new Map(a.map((e,o)=>[e,o]));let f=null;{const e=a[5];if(e){const o=Ct(e,"torso"),l=e.geometry.attributes.position,w=new O,r=[];for(let b=0;b<l.count;b++)r.push(w.fromBufferAttribute(l,b).applyMatrix4(o).clone());f=Fo(r)}}const m=Bt[kt],W=Ke(m),h=Ke(m);h.defines={...h.defines||{},INFLATE:"0.0015"};let F=null;m.sock&&(F=Ke({base:m.base.map((e,o)=>o===3?m.sock[0]:e),shade:m.shade.map((e,o)=>o===3?m.sock[1]:e)})),A.outfit=kt,A.hair=ze;for(const e of a){const o=_.get(e),l=e.geometry,w=l.attributes.position,r=l.attributes.skinIndex,b=l.attributes.skinWeight,R=Ct(e,"pelvis"),B=new O,Z=new Float32Array(w.count*4),E=e.skeleton.bones.map(H=>H.name);for(let H=0;H<w.count;H++){let D=0,j=-1;for(let J=0;J<4;J++){const Me=b.getComponent(H,J);Me>j&&(j=Me,D=r.getComponent(H,J))}B.fromBufferAttribute(w,H).applyMatrix4(R);const se=l.attributes._region,K=se?ne(Math.round(se.getX(H))):Co(o,E[D],B,f);Z.set(K,4*H),A.counts[K.indexOf(Math.max(...K))]++}l.setAttribute("toonW",new Q(Z,4)),rt(l);const X=e.material&&e.material.name;e.material=!l.attributes._region&&(o===5||o===6)?h:F&&X==="sock"?F:W,A.prims.push({prim:o,name:yo[o],verts:w.count})}const s=a.find(e=>e.geometry.attributes._region&&e.name.includes("skin"))||a.find(e=>e.geometry.attributes._region&&Math.round(e.geometry.attributes._region.getX(0))===0&&e.geometry.attributes.position.count>2e4)||a[8];s&&g&&(A.faceFix=zo(s,g,{hx:.026,y0:-.036,y1:.045,f:.012,iters:60}),A.face=Io(g,Po(s,g)));const N=performance.now();if(ge&&!je&&Ee>0)for(const e of a){const o=e.geometry,l=o.attributes.normal,w=new Float32Array(l.count*3);for(let b=0;b<l.count;b++)w[3*b]=l.getX(b),w[3*b+1]=l.getY(b),w[3*b+2]=l.getZ(b);rt(o,12+Ee);const r=new Float32Array(l.count*3);for(let b=0;b<l.count;b++)r[3*b]=l.getX(b),r[3*b+1]=l.getY(b),r[3*b+2]=l.getZ(b),l.setXYZ(b,w[3*b],w[3*b+1],w[3*b+2]);l.needsUpdate=!0,o.setAttribute("toonN",new Q(r,3))}A.toonN={iters:ge&&!je?Ee:0,ms:+(performance.now()-N).toFixed(0)};const p=ge?new re({name:"toon-outline-r2",uniforms:{...Ht(),uInk:{value:new $(G.ink)}},vertexShader:ko,fragmentShader:nt("shadeColor",m.shade)+_o,side:Ue}):new re({name:"toon3r2-outline",uniforms:{uColor:{value:new $(Vt)}},vertexShader:Ao,fragmentShader:at,side:Ue});if(ge)for(const e of a){const o=e.geometry,l=o.attributes.skinIndex,w=o.attributes.skinWeight,r=o.attributes._region,b=l.count,R=new Float32Array(b),B=e.skeleton.bones.map(E=>E.name),Z=B.filter(E=>/^leftWristBend\d+$/.test(E)).length+1;for(let E=0;E<b;E++){let X=0,H=0;for(let j=0;j<4;j++){const se=B[l.getComponent(E,j)],K=w.getComponent(E,j);let J;/Hand$/.test(se)?X+=K:(J=/WristBend(\d+)$/.exec(se))?X+=K*+J[1]/Z:se==="head"&&(H+=K)}const D=r?Math.round(r.getX(E))===3:!1;R[E]=Math.min(D?G.shoe:1,1+(G.hand-1)*Math.min(1,X*1.2),1+(G.head-1)*Math.min(1,H*1.2))}o.setAttribute("olW",new Q(R,1))}for(const e of a){const o=new Tt(e.geometry,p);o.bind(e.skeleton,e.bindMatrix),o.userData.__outline=!0,o.frustumCulled=!1,o.renderOrder=-1,o.raycast=()=>{},e.add(o)}return A.outlines=a.length,A.faceSnap=(e=0,o=500,l=500,w)=>{c.updateMatrixWorld(!0);const r=g.getWorldPosition(new O),b=g.getWorldQuaternion(new ae),R=new O(0,.07,.03).applyQuaternion(b).add(r),B=new O(e,.05,1).applyQuaternion(b).normalize(),Z=new O(0,1,0).applyQuaternion(b),E=new Rt(12,o/l,.05,50);E.up.copy(Z),E.position.copy(R).addScaledVector(B,1.6),E.lookAt(R),E.updateMatrixWorld();const X=d.domElement.width,H=d.domElement.height,D=d.getPixelRatio();d.setPixelRatio(1),d.setSize(o,l,!1),w&&w(!0),d.render(t,E);const j=d.domElement.toDataURL("image/png");return w&&w(!1),d.setPixelRatio(D),d.setSize(X/D,H/D,!1),j},ze!=="none"&&g&&(A.hairReady=Bo(g,A,m)),A}const To=`
varying vec3 vN;
varying vec3 vV;
varying vec3 vL;
varying vec3 vNL;
void main() {
  vN = normalize(normalMatrix * normal);
  vL = position; vNL = normal;
  vec4 mv = modelViewMatrix * vec4(position, 1.0);
  vV = -mv.xyz;
  gl_Position = projectionMatrix * mv;
}`,Ro=`
uniform vec3 uBase;
uniform vec3 uShade;
uniform vec3 uHi;
uniform vec3 uLight;
uniform float uRib;
varying vec3 vN;
varying vec3 vV;
varying vec3 vL;
varying vec3 vNL;
void main() {
  vec3 n = normalize(vN); if (!gl_FrontFacing) n = -n;
  vec3 v = normalize(vV), l = normalize(uLight);
  float nl = dot(n, l);
  float aB = max(fwidth(nl), 1e-4);
  float b = smoothstep(0.10 - aB, 0.10 + aB, nl);           // 两阶明暗（与身体同阈值）
  vec3 lit = mix(uShade, uBase, b);
  if (uRib > 0.0) {                                           // 毛线帽竖向罗纹：细的暗条
    float a = atan(vL.x, vL.z) * uRib / 6.2831853;
    float fr = abs(fract(a) - 0.5); float aw = max(fwidth(a), 1e-4);
    lit *= 1.0 - 0.10 * smoothstep(0.36 - aw, 0.36 + aw, fr);
  } else {                                                    // 头发高光（硬边小色块）
    // 天使环：头部局部法线的仰角落在一条窄带里（随头转），只在受光面；被发片几何打碎成一段段
    float ny = normalize(vNL).y; float aS = max(fwidth(ny), 1e-4);
    float ring = smoothstep(0.50 - aS, 0.50 + aS, ny) * (1.0 - smoothstep(0.66 - aS, 0.66 + aS, ny));
    float face = smoothstep(0.25, 0.35, nl);
    lit = mix(lit, uHi, ring * face * 0.6);
  }
  #ifndef NORIM
  float fr2 = pow(1.0 - clamp(dot(n, v), 0.0, 1.0), 2.6); float aR = max(fwidth(fr2), 1e-4);
  lit += mix(uBase, vec3(1.0), 0.5) * smoothstep(0.62 - aR, 0.62 + aR, fr2) * 0.25 * b;   // 硬边缘光（弱于身体）
  #endif
  gl_FragColor = vec4(lit, 1.0);
  #include <colorspace_fragment>
}`,No=.0035,Lo=`
attribute vec3 _oln;
${qt}
void main() { gl_Position = ol2Clip(modelViewMatrix * vec4(position, 1.0), normalize(normalMatrix * _oln), ${G.hair.toFixed(3)}); }`,Oo=`
attribute vec3 _oln;
void main() { gl_Position = projectionMatrix * modelViewMatrix * vec4(position + normalize(_oln) * ${No.toFixed(4)}, 1.0); }`;async function Bo(t,c,n){const x=await new Lt().loadAsync(new URL("./v5/hair-v3r5.glb",document.baseURI).href),y=At[Y.get("hairc")]||At.black,S=/^[0-9a-f]{6}$/i.test(Y.get("cap")||"")?["#"+Y.get("cap"),"#"+new $("#"+Y.get("cap")).multiplyScalar(.55).getHexString()]:n.cap,d=new O(-.45,.75,.55),i=(f,m,W,h)=>new re({name:"toon-hair",...ge&&!je?{defines:{NORIM:""}}:{},uniforms:{uBase:{value:new $(f)},uShade:{value:new $(m)},uHi:{value:new $(W)},uLight:{value:d},uRib:{value:h}},vertexShader:To,fragmentShader:Ro}),A={hair:i(y[0],y[1],y[2],0),beanie:i(S[0],S[1],S[0],46)},g=ge?new re({name:"toon-hair-outline-r2",uniforms:{...Ht(),uColor:{value:new $(G.hairInk)}},vertexShader:Lo,fragmentShader:at,side:Ue}):new re({name:"toon-hair-outline",uniforms:{uColor:{value:new $(Vt)}},vertexShader:Oo,fragmentShader:at,side:Ue}),a=new tt;a.name="hair-"+ze,a.userData.__hair=!0;const _={style:ze,meshes:[]};return x.scene.traverse(f=>{if(!f.isMesh||(f.parent&&f.parent.name.startsWith("hair_")?f.parent.name:f.name).replace(/^hair_/,"").replace(/_\d+$/,"")!==ze)return;const W=f.material.userData&&f.material.userData.region||f.material.name,h=new fe(f.geometry,A[W]||A.hair);h.name=f.name,h.userData.region=W,h.frustumCulled=!1,h.raycast=()=>{};const F=new fe(f.geometry,g);F.userData.__outline=!0,F.frustumCulled=!1,F.renderOrder=-1,F.raycast=()=>{},h.add(F),a.add(h),_.meshes.push({name:f.name,region:W,verts:f.geometry.attributes.position.count,tris:f.geometry.index.count/3})}),t.add(a),c.hairInfo=_,_}const Je=new URLSearchParams,ce=(t,c)=>Je.has(t)&&isFinite(+Je.get(t))?+Je.get(t):c,Vo={samples:720,trailSeconds:.95,segments:56,rippleSeconds:.9,refTurn:8.991662288,width:.024,motes:18,moteLife:.8,plantDrop:.025,plantDelay:6,ripples:4,old:ce("fxold",0)===1,halo:2.8,wide:ce("fxwide",1.6),glow:ce("fxglow",1),flick:ce("fxflick",1),core:ce("fxcore",1),shadow:ce("fxshadow",1)!==0,ring:ce("fxring",1)!==0,spark:ce("fxspark",1)!==0,shadowCell:ce("fxcell",.022),palette:{head:"#ff8a3a",mid:"#ff6a55",tail:"#ff8f9a",ripple:"#ff9348",gold:"#ffe6a8"},colors:{core:"#fffaf2",ink:"#3a1f3c",ringInk:"#b8462a",shadow1:"#d9cbbd",shadow2:"#c3b2a5"}},Eo=`
  uniform float uOpacity; uniform vec3 uHead; uniform vec3 uMid; uniform vec3 uTail;
  varying float vAge; varying float vSide; varying float vSpeed;
  void main() {
    vec3 c = vAge < 0.5 ? mix(uHead, uMid, vAge * 2.0) : mix(uMid, uTail, vAge * 2.0 - 1.0);
    float edge = 1.0 - smoothstep(0.35, 1.0, abs(vSide));
    float fade = pow(1.0 - vAge, 1.15) * smoothstep(0.0, 0.04, vAge + 0.02);
    float core = smoothstep(0.55, 0.0, abs(vSide)) * (0.9 - 0.6 * vAge);
    float a = uOpacity * fade * edge * clamp(vSpeed, 0.0, 1.0);
    gl_FragColor = vec4(c * 1.25 + vec3(core * 0.55), a);
    #include <colorspace_fragment>
  }`,qo=`
  uniform float uOpacity; uniform float uProgress; uniform vec3 uColor; varying vec2 vUv;
  void main() {
    float r = length(vUv - 0.5) * 2.0; float ring = uProgress * 0.92 + 0.06; float w = 0.05 + 0.05 * uProgress;
    float band = exp(-pow((r - ring) / w, 2.0));
    float glow = exp(-pow(r / max(ring, 0.05), 2.0) * 3.0) * 0.18 * (1.0 - uProgress);
    float a = uOpacity * (band * 0.85 + glow) * pow(1.0 - uProgress, 1.4);
    gl_FragColor = vec4(uColor, a);
    #include <colorspace_fragment>
  }`,Ho=`uniform float uOpacity; uniform vec3 uHead; uniform vec3 uTail; uniform vec3 uCore; uniform vec3 uEdge; varying float vAge;
  void main(){ vec2 q = gl_PointCoord - 0.5; float d = length(q) * 2.0; if (d > 1.0) discard;
    float a = uOpacity * pow(1.0 - vAge, 2.0) * exp(-d * d * 4.0);
    gl_FragColor = vec4(mix(uHead, uTail, vAge) * 1.4 + 0.25, a);
    #include <colorspace_fragment>
  }`,Uo=`
attribute float aAge; attribute float aSide; attribute float aSpeed;
varying float vAge; varying float vSide; varying float vSpeed;
void main(){ vAge = aAge; vSide = aSide; vSpeed = aSpeed; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }`,Xo=`
float h11(float x){ return fract(sin(x * 127.1 + uSeed * 31.7) * 43758.5453); }
float n1(float x){ float i = floor(x), f = fract(x); f = f * f * (3.0 - 2.0 * f); return mix(h11(i), h11(i + 1.0), f) * 2.0 - 1.0; }
float h21(vec2 p){ return fract(sin(dot(p, vec2(127.1, 311.7)) + uSeed * 17.0) * 43758.5453); }
float n2(vec2 p){ vec2 i = floor(p), f = fract(p); f = f * f * (3.0 - 2.0 * f);
  return mix(mix(h21(i), h21(i + vec2(1, 0)), f.x), mix(h21(i + vec2(0, 1)), h21(i + vec2(1, 1)), f.x), f.y); }
vec3 toS(vec3 c){ return pow(max(c, 0.0), vec3(1.0 / 2.2)); }   // 线性 → sRGB（预乘输出不走 colorspace_fragment）
`,Do=`
uniform float uOpacity; uniform float uHalo; uniform float uWide; uniform float uSeed; uniform vec3 uShoe; uniform float uTime; uniform float uFlick; uniform float uCoreK;
uniform vec3 uHead; uniform vec3 uMid; uniform vec3 uTail; uniform vec3 uCore; uniform vec3 uGold;
varying float vAge; varying float vSide; varying float vSpeed;
${Xo}
void main(){
  // 沿长度的强度：照 r2/旧版 —— (1−age)^1.15 渐隐 × 头部 0.04 渐入 × 脚速
  float k = pow(1.0 - vAge, 1.15) * smoothstep(0.0, 0.04, vAge + 0.02) * clamp(vSpeed, 0.0, 1.0);
  if (k < 0.004) discard;
  float t = uTime, A = vAge;
  // 火焰舌：沿轨迹的确定性噪声（按帧号 → uTime），越靠尾端越摇曳
  float tail = smoothstep(0.06, 0.7, A) * uFlick;
  float wob = n1(A * 7.0 - t * 5.0) * 0.6 + n1(A * 15.0 - t * 9.0) * 0.4;
  float wid = 1.0 + 0.40 * tail * wob;                                   // 宽度起伏
  float off = 0.32 * tail * n1(A * 5.0 - t * 4.0 + 7.3);                  // 中线左右摆
  float x = (vSide * uHalo / uWide - off) / max(0.35, wid * mix(0.5, 1.0, smoothstep(0.0, 0.08, A)));   // 头端收尖
  float ax = abs(x);
  // 分缕：尾段沿宽度切成几缕火舌，缕的位置随时间流动
  float strands = n2(vec2(x * 2.4 + 3.0, A * 6.0 - t * 4.0));
  float split = mix(1.0, smoothstep(0.25, 0.75, strands), smoothstep(0.25, 0.8, A) * uFlick);
  float flick = 1.0 + 0.22 * uFlick * n1(A * 11.0 - t * 7.0 + 2.1);        // 亮度闪烁
  // 横向两层柔边色阶：外焰（宽、柔）+ 白芯（窄、边稍收）+ 极淡外辉光（高斯）
  float flame = 1.0 - smoothstep(0.20, 1.0, ax);
  float core = (1.0 - smoothstep(0.14, 0.34, ax)) * (1.0 - smoothstep(0.25, 0.75, A)) * uCoreK;
  float glow = exp(-ax * ax * 0.55) * (1.0 - smoothstep(0.0, 0.6, A));
  flame *= split;
  // 鞋面上压低（白鞋上不叠白块）：鞋屏幕圆内淡掉，边缘柔过渡
  float shoe = 1.0;
  if (uShoe.z > 0.0) shoe = mix(1.0, smoothstep(uShoe.z * 0.55, uShoe.z * 1.1, length(gl_FragCoord.xy - uShoe.xy)), 1.0 - smoothstep(0.25, 0.55, A));
  vec3 fc = A < 0.5 ? mix(uHead, uMid, A * 2.0) : mix(uMid, uTail, A * 2.0 - 1.0);
  vec3 cc = mix(uCore, uGold, smoothstep(0.0, 0.5, A));
  float kk = k * flick * shoe * uOpacity;
  // 预乘输出：染色部分（over，给出暖色相）+ 发光部分（加色）
  float aT = clamp(kk * (0.50 * flame + 0.14 * glow + 0.10 * core), 0.0, 0.55);
  vec3 tint = toS(mix(fc, cc, core * 0.8));
  vec3 add = toS(fc) * kk * (0.28 * flame + 0.14 * glow) + toS(cc) * kk * 0.5 * core;
  if (aT < 0.003 && max(add.r, max(add.g, add.b)) < 0.004) discard;
  gl_FragColor = vec4(tint * aT + add, aT);
}`,jo=`attribute float aAge; attribute float aSize; uniform float uScale; uniform float uStar; varying float vAge;
void main(){ vAge = aAge; vec4 mv = modelViewMatrix * vec4(position, 1.0); gl_Position = projectionMatrix * mv;
  gl_PointSize = aAge >= 1.0 ? 0.0 : aSize * uStar * (1.0 - 0.6 * aAge) * uScale / max(0.1, -mv.z); }`,Yo=`uniform float uOpacity; uniform vec3 uCore; uniform vec3 uEdge; varying float vAge;
vec3 toS(vec3 c){ return pow(max(c, 0.0), vec3(1.0 / 2.2)); }
void main(){ if (vAge >= 1.0) discard; vec2 q = (gl_PointCoord - 0.5) * 2.0; float r = length(q); if (r > 1.0) discard;
  // 柔光点：高斯光斑 + 很淡的四向细芒，无描边
  float spot = exp(-r * r * 9.0);
  float ray = exp(-abs(q.x) * 18.0) * exp(-abs(q.y) * 2.6) + exp(-abs(q.y) * 18.0) * exp(-abs(q.x) * 2.6);
  float k = pow(1.0 - vAge, 2.0) * uOpacity;
  float i = k * (spot + 0.35 * ray * (1.0 - r));
  vec3 c = toS(mix(uCore, uEdge, smoothstep(0.0, 0.5, r)));
  float aT = clamp(i * 0.45, 0.0, 0.5);
  gl_FragColor = vec4(c * aT + c * i * 0.4, aT);
}`,$o=`
uniform float uOpacity; uniform float uProgress; uniform vec3 uColor; uniform vec3 uInk; varying vec2 vUv;
vec3 toS(vec3 c){ return pow(max(c, 0.0), vec3(1.0 / 2.2)); }
void main(){
  float r = length(vUv - 0.5) * 2.0;
  float ring = uProgress * 0.92 + 0.06, w = 0.05 + 0.05 * uProgress;   // 旧版环半径 / 宽度
  float fall = pow(1.0 - uProgress, 1.4);
  // r3：柔光环（高斯）+ 极淡内光，无墨线；两层柔边：亮的环心 + 外层淡晕
  float d = (r - ring) / w;
  float band = exp(-d * d * 1.6) * 0.75 + exp(-d * d * 0.35) * 0.25;
  float inner = exp(-pow(r / max(ring, 0.05), 2.0) * 3.0) * 0.15 * (1.0 - uProgress);
  float i = uOpacity * fall * (band + inner);
  if (i < 0.003) discard;
  vec3 c = toS(uColor);
  float aT = clamp(i * 0.85, 0.0, 0.5);
  gl_FragColor = vec4(c * aT + c * i * 0.22, aT);
}`,Go=`
#include <common>
#include <skinning_pars_vertex>
uniform vec3 uL; uniform float uCut; varying float vH;
void main(){
  #include <skinbase_vertex>
  #include <begin_vertex>
  #include <skinning_vertex>
  vec4 w = modelMatrix * vec4(transformed, 1.0);
  vH = w.y;
  w.xyz -= uL * (w.y / uL.y);
  w.y = vH < uCut ? 0.0026 : 0.0014;
  gl_Position = projectionMatrix * viewMatrix * w;
}`,Zo=`
uniform vec3 uC1; uniform vec3 uC2; uniform float uCut; varying float vH;
void main(){ gl_FragColor = vec4(vH < uCut ? uC2 : uC1, 1.0);
  #include <colorspace_fragment>
}`;function zt(t,c,n){const x=t.attributes.position,y=x.count,S=new Int32Array(y),d=new Map,i=[],A=[],g=[],a=[],_=t.attributes.skinIndex,f=t.attributes.skinWeight;for(let s=0;s<y;s++){const N=x.getX(s),p=x.getY(s),e=x.getZ(s),o=Math.floor(N/c)+","+Math.floor(p/c)+","+Math.floor(e/c);let l=d.get(o);l===void 0&&(l=a.length,d.set(o,l),a.push(0),i.push(0,0,0),n&&(A.push(_.getX(s),_.getY(s),_.getZ(s),_.getW(s)),g.push(f.getX(s),f.getY(s),f.getZ(s),f.getW(s)))),i[l*3]+=N,i[l*3+1]+=p,i[l*3+2]+=e,a[l]++,S[s]=l}for(let s=0;s<a.length;s++)i[s*3]/=a[s],i[s*3+1]/=a[s],i[s*3+2]/=a[s];const m=t.index,W=m?m.count:y,h=[];for(let s=0;s<W;s+=3){const N=S[m?m.getX(s):s],p=S[m?m.getX(s+1):s+1],e=S[m?m.getX(s+2):s+2];N!==p&&p!==e&&N!==e&&h.push(N,p,e)}const F=new Xe;return F.setAttribute("position",new St(i,3)),n&&(F.setAttribute("skinIndex",new co(A,4)),F.setAttribute("skinWeight",new St(g,4))),F.setIndex(h),F}const Ce=t=>t-Math.floor(t);function Qo({scene:t,root:c,bones:n,skinned:x,renderer:y,anim:S,getFrame:d,getFrames:i,jointIds:A,params:g={}}){const a={...Vo,...g},_=a.colors,f=a.palette,m=S.count,W=S.fps||120,h=a.samples,F=m/W,s=F/a.refTurn,N=a.trailSeconds*s,p=a.rippleSeconds*s,e=new tt;e.name="v3r7-fx3",t.add(e);const o=x.filter(k=>!k.userData.__outline),l={params:{old:a.old,trailSeconds:N,trailFrames:N*W,rippleFrames:p*W,moteFrames:a.moteLife*W,shadow:a.shadow,ring:a.ring,spark:a.spark}};c.updateMatrixWorld(!0);const w=new O,r=k=>{const M=k.geometry.attributes._region;if(!M)return-1;const z=[0,0,0,0];for(let u=0;u<M.count;u+=7)z[Math.round(M.getX(u))]++;return z.indexOf(Math.max(...z))},b=o.filter(k=>/Sneaker|Sole/i.test(k.name)||r(k)===3),R=k=>{const M=n[k+"Foot"],z=M.getWorldPosition(new O);let u=null,I=-1;for(const v of b.length?b:o){const P=v.skeleton.bones.indexOf(M);if(P<0)continue;const T=v.geometry.attributes.skinIndex,L=v.geometry.attributes.skinWeight;for(let C=0;C<T.count;C++){let q=0;for(let U=0;U<4;U++)T.getComponent(C,U)===P&&(q+=L.getComponent(C,U));if(q<.95)continue;v.getVertexPosition(C,w).applyMatrix4(v.matrixWorld);const V=w.distanceTo(z);V>I&&(I=V,u={m:v,i:C})}}return u},B={left:R("left"),right:R("right")};l.toe={left:B.left?.i??-1,right:B.right?.i??-1,mesh:B.left?.m.name};const Z={left:new Float32Array(m*3),right:new Float32Array(m*3)},E={left:new Float32Array(m*3),right:new Float32Array(m*3)},X={left:new Float32Array(h*3),right:new Float32Array(h*3)},H={left:new Float32Array(h*3),right:new Float32Array(h*3)},D={left:new Float32Array(h),right:new Float32Array(h)};let j=[],se=null;const K=(k,M,z)=>{const u=Math.floor(M),I=M-u,v=U=>(U%m+m)%m,P=v(u-1),T=v(u),L=v(u+1),C=v(u+2),q=I*I,V=q*I;for(let U=0;U<3;U++){const ke=k[P*3+U],xe=k[T*3+U],oe=k[L*3+U],_e=k[C*3+U];z.setComponent(U,.5*(2*xe+(-ke+oe)*I+(2*ke-5*xe+4*oe-_e)*q+(-ke+3*xe-3*oe+_e)*V))}return z};function J(k){const M=A.map(v=>n[v].quaternion.clone()),z=n.pelvis.position.clone(),u=new ae;for(let v=0;v<m;v++){const P=k[v];for(const T of A)n[T].quaternion.copy(u.fromArray(P.q[T]||[0,0,0,1]).normalize());n.pelvis.position.fromArray(P.p),c.updateMatrixWorld(!0);for(const T of["left","right"]){const L=B[T];L?L.m.getVertexPosition(L.i,w).applyMatrix4(L.m.matrixWorld):n[T+"Foot"].getWorldPosition(w),w.toArray(Z[T],v*3),n[T+"Hand"].getWorldPosition(w).toArray(E[T],v*3)}}A.forEach((v,P)=>n[v].quaternion.copy(M[P])),n.pelvis.position.copy(z),c.updateMatrixWorld(!0);for(const v of["left","right"])for(let P=0;P<h;P++)K(Z[v],P/h*m,w).toArray(X[v],P*3),K(E[v],P/h*m,w).toArray(H[v],P*3);const I=F/h;for(const v of["left","right"]){const P=X[v],T=new Float32Array(h);for(let C=0;C<h;C++){const q=(C+1)%h;T[C]=Math.hypot(P[q*3]-P[C*3],P[q*3+1]-P[C*3+1],P[q*3+2]-P[C*3+2])/I}const L=[...T].sort((C,q)=>C-q)[Math.floor(h*.8)]||1;for(let C=0;C<h;C++)D[v][C]=Math.min(1,T[C]/L)}j=[];for(const v of["left","right"]){const P=C=>H[v][C*3+1];let T=1/0;for(let C=0;C<h;C++)T=Math.min(T,P(C));const L=C=>P(C)<T+a.plantDrop;for(let C=0;C<h;C++)if(L(C)&&!L((C-1+h)%h)){const q=(C+a.plantDelay)%h;j.push({side:v,wall:C/h*F,x:H[v][q*3],z:H[v][q*3+2]})}}l.plants=j.map(v=>({side:v.side,frame:+(v.wall*W).toFixed(1)})),se=k}J(i());const Me=(k,M,z)=>{const u=(M/F%1+1)%1*h,I=Math.floor(u),v=(I+1)%h,P=u-I;return z.set(k[I*3]+(k[v*3]-k[I*3])*P,k[I*3+1]+(k[v*3+1]-k[I*3+1])*P,k[I*3+2]+(k[v*3+2]-k[I*3+2])*P)},ct=(k,M)=>{const z=(M/F%1+1)%1*h,u=Math.floor(z),I=(u+1)%h,v=z-u;return k[u]+(k[I]-k[u])*v},le=k=>new $(k),ft=a.old?1:a.halo,ee=a.segments,jt={blending:lo,blendEquation:so,blendSrc:io,blendDst:ro,premultipliedAlpha:!0},$e=()=>a.old?{blending:ao}:jt,ut={value:le(f.head)},dt={value:le(f.mid)},mt={value:le(f.tail)},pt={value:le(_.core)},ht=[0,1].map(k=>new re({name:"fx2-ribbon",vertexShader:Uo,fragmentShader:a.old?Eo:Do,transparent:!0,depthWrite:!1,side:Nt,...$e(),uniforms:{uOpacity:{value:a.old?1:a.glow},uHalo:{value:ft},uWide:{value:a.wide},uSeed:{value:k*3.7+1.3},uShoe:{value:new O(-1e4,-1e4,0)},uTime:{value:0},uFlick:{value:a.flick},uCoreK:{value:a.core},uHead:ut,uMid:dt,uTail:mt,uCore:pt,uGold:{value:le(f.gold)},uInk:{value:le(_.ink)}}})),Yt=["left","right"].map((k,M)=>{const z=(ee+1)*2,u=new Xe;u.setAttribute("position",new Q(new Float32Array(z*3),3).setUsage(Be));const I=new Float32Array(z),v=new Float32Array(z);for(let L=0;L<=ee;L++)I[L*2]=I[L*2+1]=L/ee,v[L*2]=-1,v[L*2+1]=1;u.setAttribute("aAge",new Q(I,1)),u.setAttribute("aSide",new Q(v,1)),u.setAttribute("aSpeed",new Q(new Float32Array(z),1).setUsage(Be));const P=[];for(let L=0;L<ee;L++){const C=L*2;P.push(C,C+1,C+2,C+1,C+3,C+2)}u.setIndex(P);const T=new fe(u,ht[M]);return T.frustumCulled=!1,T.renderOrder=3,e.add(T),{side:k,mesh:T,geometry:u}}),te=Array.from({length:ee+1},()=>new O),Re=new O,gt=new O,me=new O,ue=new O,Ge=new O,Ne=new Ot;function $t(k,M,z){const u=N;for(const I of ht)I.uniforms.uTime.value=k;z.getDrawingBufferSize(Ne);for(const I of Yt){const v=B[I.side];v&&v.m.getVertexPosition(v.i,Ge).applyMatrix4(v.m.matrixWorld),n[I.side+"Foot"].getWorldPosition(ue);const P=ue.distanceTo(Ge)*.46;ue.lerp(Ge,.45);const T=M.position.distanceTo(ue);ue.project(M);const L=M.isPerspectiveCamera?P/(T*Math.tan(De.degToRad(M.fov)/2))*Ne.y/2:0;I.mesh.material.uniforms.uShoe.value.set((ue.x*.5+.5)*Ne.x,(ue.y*.5+.5)*Ne.y,!a.old&&ue.z<1?L:0);const C=I.geometry.attributes.position,q=I.geometry.attributes.aSpeed;for(let V=0;V<=ee;V++)Me(X[I.side],k-u*V/ee,te[V]);for(let V=0;V<=ee;V++){const U=te[Math.max(0,V-1)],ke=te[Math.min(ee,V+1)];Re.subVectors(U,ke),Re.lengthSq()<1e-10&&Re.set(1,0,0),gt.subVectors(M.position,te[V]),me.crossVectors(Re,gt).normalize();const xe=V/ee,oe=a.width*(1-xe*.75)*ft;C.setXYZ(V*2,te[V].x-me.x*oe,te[V].y-me.y*oe,te[V].z-me.z*oe),C.setXYZ(V*2+1,te[V].x+me.x*oe,te[V].y+me.y*oe,te[V].z+me.z*oe);const _e=ct(D[I.side],k-u*xe);q.setX(V*2,_e),q.setX(V*2+1,_e)}C.needsUpdate=!0,q.needsUpdate=!0}}const we=a.motes,vt=new re({name:"fx2-mote",transparent:!0,depthWrite:!1,...$e(),uniforms:{uOpacity:{value:a.old?.9:.9*a.glow},uScale:{value:400},uStar:{value:a.old?1:2.6},uHead:ut,uMid:dt,uTail:mt,uCore:pt,uEdge:{value:le(f.ripple)}},vertexShader:jo,fragmentShader:a.old?Ho:Yo}),wt=["left","right"].map((k,M)=>{const z=new Xe;z.setAttribute("position",new Q(new Float32Array(we*3),3).setUsage(Be)),z.setAttribute("aAge",new Q(new Float32Array(we),1).setUsage(Be));const u=new Float32Array(we),I=[];for(let P=0;P<we;P++){const T=Ce(Math.sin((P+1)*12.9898+M*78.233)*43758.5453);u[P]=.01+.012*T,I.push(new O(Ce(T*7.13)-.5,Ce(T*3.71)-.2,Ce(T*5.29)-.5).normalize())}z.setAttribute("aSize",new Q(u,1));const v=new oo(z,vt);return v.frustumCulled=!1,v.renderOrder=4,e.add(v),{side:k,mesh:v,geometry:z,seed:I}}),Le=new O;function Gt(k,M){vt.uniforms.uScale.value=y.domElement.height/(2*Math.tan(De.degToRad(M.fov||35)/2));const z=a.moteLife;for(const u of wt){const I=u.geometry.attributes.position,v=u.geometry.attributes.aAge;for(let P=0;P<we;P++){const T=Ce(k/z+P/we),L=k-T*z;Me(X[u.side],L,Le);const C=.05*T+.02*T*T,q=ct(D[u.side],L);I.setXYZ(P,Le.x+u.seed[P].x*C,Le.y+u.seed[P].y*C+.015*T,Le.z+u.seed[P].z*C),v.setX(P,q>.35?T:1)}I.needsUpdate=!0,v.needsUpdate=!0}}const Se=Array.from({length:a.ripples},()=>{const k=new re({name:"fx2-ripple",vertexShader:"varying vec2 vUv; void main(){ vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0); }",fragmentShader:a.old?qo:$o,transparent:!0,depthWrite:!1,...$e(),uniforms:{uOpacity:{value:0},uProgress:{value:0},uColor:{value:le(f.ripple)},uInk:{value:le(_.ringInk)}}}),M=new fe(new no(.5,.5),k);return M.rotation.x=-Math.PI/2,M.position.y=.0036,M.visible=!1,M.renderOrder=1,M.frustumCulled=!1,e.add(M),M});function Zt(k){let M=0;for(const z of j){let u=k-z.wall;if(u<0&&(u+=F),u>p||M>=Se.length)continue;const I=Se[M++];I.visible=!0,I.position.x=z.x,I.position.z=z.z,I.material.uniforms.uProgress.value=u/p,I.material.uniforms.uOpacity.value=a.old?.75:.75*a.glow}for(let z=M;z<Se.length;z++)Se[z].visible=!1}const xt={uL:{value:new O(.4,1,-.2).normalize()},uCut:{value:.16},uC1:{value:new $(_.shadow1)},uC2:{value:new $(_.shadow2)}},Ae=[],yt=[];l.shadowVerts=0;const Oe=new tt;if(Oe.name="v3r7-fx-shadow",t.add(Oe),a.shadow){const k=new re({name:"fx-shadow",uniforms:xt,vertexShader:Go,fragmentShader:Zo});for(const M of o){const z=zt(M.geometry,a.shadowCell,!0);l.shadowVerts+=z.attributes.position.count;const u=new Tt(z,k);u.bind(M.skeleton,M.bindMatrix),u.frustumCulled=!1,u.renderOrder=-2,u.raycast=()=>{},Oe.add(u),Ae.push(u)}n.head?.traverse(M=>{if(M.isMesh&&M.name.startsWith("hair")&&!M.userData.__outline){const z=zt(M.geometry,a.shadowCell,!1);l.shadowVerts+=z.attributes.position.count;const u=new fe(z,k);u.matrixAutoUpdate=!1,u.frustumCulled=!1,u.renderOrder=-2,u.raycast=()=>{},Oe.add(u),Ae.push(u),yt.push([u,M])}})}const Qt=new O(-.45,.75,.55);function Kt(k){const M=xt.uL.value.copy(Qt).applyQuaternion(k.quaternion);if(M.y=Math.max(M.y,.2),M.normalize(),M.y<.62){const z=Math.hypot(M.x,M.z),u=Math.sqrt(1-.62*.62)/(z||1);M.set(M.x*u,.62,M.z*u)}}let bt=null;const Mt=t.onBeforeRender;return t.onBeforeRender=(k,M,z,u)=>{Mt&&Mt.call(t,k,M,z,u);const I=d(),v=i();if(v&&v!==se&&v.length===m&&J(v),Ae.length){Kt(z);for(const[L,C]of yt)L.matrix.copy(C.matrixWorld),L.matrixWorld.copy(C.matrixWorld)}const P=I!=null;if(e.visible=P,!P)return;const T=I/W;$t(T,z,k);for(const L of wt)L.mesh.visible=a.spark;a.spark&&Gt(T,z),a.ring?Zt(T):Se.forEach(L=>L.visible=!1),bt=I},l.casters=Ae.length,l.shadowTris=Ae.reduce((k,M)=>k+M.geometry.index.count/3,0),l.group=e,l.debug=()=>({last:bt,speed:{left:Array.from(D.left),right:Array.from(D.right)},paths:{left:Array.from(X.left),right:Array.from(X.right)}}),l}const et=[[1,0,0],[-1,0,0],[0,1,0],[0,-1,0],[0,0,1],[0,0,-1],...[-1,1].flatMap(t=>[-1,1].flatMap(c=>[-1,1].map(n=>[t,c,n])))];function Ko(t){const{position:c,skinIndex:n,skinWeight:x}=t.geometry.attributes,y=new Map;for(let S=0;S<c.count;S++){let d=0;if(x)for(let f=1;f<4;f++)x.getComponent(S,f)>x.getComponent(S,d)&&(d=f);const i=n?.getComponent(S,d)??0;y.has(i)||y.set(i,et.map(()=>({value:-1/0,index:0})));const A=y.get(i),g=c.getX(S),a=c.getY(S),_=c.getZ(S);for(let f=0;f<et.length;f++){const[m,W,h]=et[f],F=g*m+a*W+_*h,s=A[f];F>s.value&&(s.value=F,s.index=S)}}return[...new Set([...y.values()].flatMap(S=>S.map(d=>d.index)))]}function Jo(t,c,n){const x=t.slice();c.traverse(i=>{i.isMesh&&!i.userData.__outline&&x.push(i)});const y=x.map(i=>[i,Ko(i)]),S=new O,d=Math.tan(De.degToRad(n)/2);return(i,A,g)=>{i.clearViewOffset(),i.aspect=1,i.fov=n,i.updateProjectionMatrix(),i.updateMatrixWorld(!0);let a=1/0,_=-1/0,f=1/0,m=-1/0;for(const[p,e]of y)for(const o of e)p.getVertexPosition(o,S).applyMatrix4(p.matrixWorld).project(i),a=Math.min(a,S.x),_=Math.max(_,S.x),f=Math.min(f,S.y),m=Math.max(m,S.y);const W=Math.min(A,g)/2,h=_-a+.065,F=m-f+.045,s=Math.min(.94*A/(h*W),.55*g/(F*W),2.15),N=W*s;i.fov=De.radToDeg(2*Math.atan(d*g/(2*N))),i.setViewOffset(A,g,(a+_)*N/2,-(f+m)*N/2,A,g)}}const qe={spineLower:"pelvis",spineUpper:"spineLower",torso:"spineUpper",neck:"torso",head:"neck"};for(const t of["left","right"]){Object.assign(qe,{[t+"Scapula"]:"torso",[t+"UpperArm"]:t+"Scapula",[t+"Forearm"]:t+"UpperArm",[t+"Hand"]:t+"Forearm",[t+"Thigh"]:"pelvis",[t+"Shin"]:t+"Thigh",[t+"Patella"]:t+"Shin",[t+"Foot"]:t+"Shin"});for(let c=1;c<=6;c++)qe[t+"ForearmTwist"+c]=t+"Forearm";for(let c=1;c<=2;c++)qe[t+"WristBend"+c]=t+"Forearm"}const Pt=t=>new URL("./v5/"+t,document.baseURI).href,en=new O(0,1,0);async function tn(t){const[c,n]=await Promise.all([new Lt().setMeshoptDecoder(fo).loadAsync(Pt("coach-v3r3-wristfix.glb")),fetch(Pt("flare-arm8legs-v3r3.json")).then(e=>{if(!e.ok)throw Error("V5 motion load failed");return e.json()})]),x=new uo,y=new Rt(30,1,.05,50),S=new fe(new mo(2,48).rotateX(-Math.PI/2));x.add(c.scene,S);const d=c.scene,i={},A=[];d.updateMatrixWorld(!0),d.traverse(e=>{if(e.isBone&&(i[e.name]=e),e.isSkinnedMesh){if(!e.geometry.getAttribute("_region"))throw Error("V5 mesh has no material regions");e.geometry.deleteAttribute("color"),A.push(e),e.frustumCulled=!1}});for(const[e,o]of Object.entries(qe)){if(!i[e]||!i[o])throw Error("V5 rig missing "+e);i[o].attach(i[e])}for(const e of Object.values(i))e.quaternion.identity();d.updateMatrixWorld(!0);const g=go({bones:i,renderer:t});await Wo({scene:x,root:d,bones:i,skinned:A,floor:S,renderer:t,camera:y}).hairReady;const _=i.head.getObjectByName("hair-spiky");if(!g||!_)throw Error("V5 wrist or hair unavailable");const f=new O().fromArray(n.cams.v0.t),m=new O().fromArray(n.cams.v0.p).sub(f),W=Object.keys(n.frames[0].q),h=Jo(A,_,n.cams.v0.f);let F=0,s=!0;function N(e){const o=n.frames[e];for(const l of W)i[l].quaternion.fromArray(o.q[l]).normalize();i.pelvis.position.fromArray(o.p)}N(F),Qo({scene:x,root:d,bones:i,skinned:A,renderer:t,anim:n,jointIds:W,getFrame:()=>s?F:null,getFrames:()=>n.frames});const p=new Ot;return{period:n.count/n.fps,render(e,{fxEnabled:o=!0,yaw:l=0}={}){F=Math.min(n.count-1,Math.floor((e%1+1)%1*n.count)),s=o,N(F),d.updateMatrixWorld(!0),t.getSize(p),y.position.copy(m).applyAxisAngle(en,l).add(f),y.lookAt(f),h(y,Math.max(1,p.x),Math.max(1,p.y)),t.render(x,y)},dispose(){const e=new Set;x.traverse(o=>{if(o.geometry&&e.add(o.geometry),o.material)for(const l of[].concat(o.material))e.add(l);o.skeleton&&e.add(o.skeleton)});for(const o of e)o.dispose()}}}const on=[.25,.5,1];let We=1,de,ye,Te,He,Pe=0,lt=.5,Ut=0,he=null,ie=!1,Ye=!0,Xt=!0,Ie=0,It=-1/0;function ve(t,c={}){const n={source:"flare-scene",type:t,time:Pe,period:We,speed:lt,playing:ie,...c};window.FlareHost?.postMessage?window.FlareHost.postMessage(JSON.stringify(n)):window.parent!==window&&window.parent.postMessage(n,window.location.origin)}function be(){ye&&Ye&&!document.hidden&&!Te&&(Te=requestAnimationFrame(nn))}function nn(t){Te=null,!(!Ye||document.hidden)&&(ie&&Ie&&(Pe=(Pe+(t-Ie)*.001*lt)%We),Ie=t,ye.render(Pe/We,{fxEnabled:Xt,yaw:Ut}),He!=null&&(ve("presented",{requestId:He}),He=null),ie&&t-It>=100&&(It=t,ve("state")),ie&&be())}function Dt(t){switch(t?.type){case"play":ie=!0,Ie=0;break;case"pause":ie=!1;break;case"seek":if(!Number.isFinite(t.time))return;ie=!1,Pe=Math.max(0,Math.min(t.time,We-1/120));break;case"speed":on.includes(t.value)&&(lt=t.value);break;case"fx":Xt=t.value===!0;break;case"visibility":Ye=t.visible===!0,Ye||(ie=!1);break;case"present":He=t.requestId;break;default:return}be(),ye&&t.type!=="present"&&ve("state")}window.flareBridge=Object.freeze({command:Dt});window.addEventListener("message",t=>{t.source===window.parent&&t.origin===window.location.origin&&t.data?.source==="flare-host"&&Dt(t.data.command)});function Wt(){de.setPixelRatio(Math.min(window.devicePixelRatio||1,2)),de.setSize(window.innerWidth,window.innerHeight,!1),be()}async function an(){try{de=new po({antialias:!0}),de.outputColorSpace=ho;const t=de.getContext();"drawingBufferColorSpace"in t&&(t.drawingBufferColorSpace="srgb");const c=de.domElement;document.body.append(c),c.addEventListener("webglcontextlost",n=>{n.preventDefault(),ie=!1,ve("error",{errorCode:"graphics_context_lost"})}),c.addEventListener("pointerdown",n=>{he||(c.setPointerCapture(n.pointerId),he={id:n.pointerId,x:n.clientX})}),c.addEventListener("pointermove",n=>{he?.id===n.pointerId&&(Ut+=(he.x-n.clientX)*.01,he.x=n.clientX,be())}),c.addEventListener("lostpointercapture",n=>{he?.id===n.pointerId&&(he=null)}),Wt(),ye=await tn(de),We=ye.period,window.addEventListener("resize",Wt),document.addEventListener("visibilitychange",()=>{document.hidden?(ie=!1,ve("state")):(Ie=0,be())}),window.addEventListener("pagehide",n=>{n.persisted||(Te&&cancelAnimationFrame(Te),ye.dispose(),de.dispose())}),ve("ready"),be()}catch(t){console.error(t),ve("error",{errorCode:"scene-load-failed"})}}an();
