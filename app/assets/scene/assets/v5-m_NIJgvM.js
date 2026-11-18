import{Q as ae,l as X,h as rt,V as B,k as Q,N as re,e as Ue,ad as It,q as Tt,_ as it,g as fe,ae as Qt,af as Kt,o as Xe,D as Nt,$ as Jt,G as Rt,n as tt,a7 as Oe,a as Lt,a8 as eo,v as to,a6 as oo,ag as no,ab as ao,ah as ro,ac as io,p as Mt,ai as so,b as De,j as lo,c as co,aj as fo,W as uo,r as mo}from"./meshopt_decoder.module-BxcarpM8.js";function po({bones:t,renderer:c}){const n=["left","right"].filter(m=>t[m+"ForearmTwist1"]&&t[m+"Hand"]&&t[m+"Forearm"]);if(!n.length)return null;const b={};for(const m of n){const e=t[m+"Forearm"],o=t[m+"Hand"],l=[],g=[];for(let r=1;t[m+"ForearmTwist"+r];r++)l.push(t[m+"ForearmTwist"+r]);for(let r=1;t[m+"WristBend"+r];r++)g.push(t[m+"WristBend"+r]);for(const r of[...l,...g])r.parent!==e&&e.attach(r);b[m]={a:o.position.clone().normalize(),fa:e,hand:o,tw:l,bd:g,prev:null,snapF:new ae,snapH:new ae}}const M=new ae,A=new ae,p=new ae,s=new ae,k=new ae,w=new ae,a={theta:{},swing:{},wraps:0,seeks:0,hubUndone:0},z=1.5*Math.PI,f=Math.PI/2;function d(){for(const m of n){const e=b[m],o=e.a;s.copy(e.hand.quaternion).normalize(),s.w<0&&s.set(-s.x,-s.y,-s.z,-s.w);const l=2*Math.atan2(s.x*o.x+s.y*o.y+s.z*o.z,s.w);let g=l;if(e.prev!=null){for(;g-e.prev>Math.PI;)g-=2*Math.PI;for(;g-e.prev<-Math.PI;)g+=2*Math.PI;Math.abs(g-e.prev)>f?(g=l,a.seeks++):Math.abs(g)>z&&(g=l,a.wraps++)}e.prev=g,M.setFromAxisAngle(o,g),A.copy(M).invert(),p.copy(s).multiply(A);const r=e.tw.length,x=e.bd.length+1;e.tw.forEach((N,O)=>N.quaternion.setFromAxisAngle(o,g*(O+1)/r)),e.bd.forEach((N,O)=>N.quaternion.copy(k).slerp(p,(O+1)/x).multiply(M)),a.theta[m]=+(g*180/Math.PI).toFixed(1),a.swing[m]=+(2*Math.acos(Math.min(1,Math.abs(p.w)))*180/Math.PI).toFixed(1)}}const I=()=>{const m=window.__drill;return!!(m&&(m.__wristTwistR5||m.__wristTwistR6)&&window.__wristTwistStats)};function h(){for(const m of n){const e=b[m];if(!e.fa.quaternion.equals(e.snapF)||!e.hand.quaternion.equals(e.snapH))e.fa.quaternion.copy(e.snapF),e.hand.quaternion.copy(e.snapH),a.hubUndone++;else{const o=(window.__wristTwistStats.applied?.[m]||0)*Math.PI/180;if(!o)continue;w.setFromAxisAngle(e.a,o),e.fa.quaternion.multiply(A.copy(w).invert()),e.hand.quaternion.premultiply(w),a.hubUndone++}}}let _=!1;function i(m){const e=m.onBeforeRender;m.onBeforeRender=function(...o){m.onBeforeRender=e;try{if(_){_=!1,I()&&h(),d();for(const l of n)b[l].fa.updateMatrixWorld(!0)}}finally{return e.apply(this,o)}}}const R=c.render.bind(c);return c.render=function(m,e){if(!I())return d(),R(m,e);for(const o of n)b[o].snapF.copy(b[o].fa.quaternion),b[o].snapH.copy(b[o].hand.quaternion);_=!0,i(m);try{return R(m,e)}finally{_=!1}},{update:d,stats:a,sides:n}}const ot={base:["#f7d9c4","#3f6fd8","#2b2f45","#f3f1ee"],shade:["#d99a8e","#2a3f8f","#1a1c2e","#b9b3c4"]},G=new URLSearchParams("hair=spiky"),Bt={default:{base:ot.base,shade:ot.shade,sock:null,cap:["#d8343a","#8e1d2c"]},mono:{base:["#f7d9c4","#f2f0ec","#26242c","#2a2830"],shade:["#d99a8e","#b6b0c2","#121016","#141219"],sock:["#f2f0ec","#b6b0c2"],cap:["#2a2830","#141219"]},redblack:{base:["#f7d9c4","#d8343a","#26242c","#d8343a"],shade:["#d99a8e","#8e1d2c","#121016","#8e1d2c"],sock:["#26242c","#121016"],cap:["#26242c","#121016"]}},St={black:["#363044","#18141f","#6f6c8e"],brown:["#5a3a2c","#2c1a16","#a77a5e"]},Ce=["spiky","mid","beanie"].includes(G.get("hair"))?G.get("hair"):"none",At=Bt[G.get("outfit")]?G.get("outfit"):"default",ve=G.get("ol")!=="0",je=G.get("rim")==="1",Ee=(()=>{const t=G.get("tsm");return t!=null&&isFinite(+t)?Math.max(0,Math.round(+t)):48})(),$e=(t,c)=>G.has(t)&&isFinite(+G.get(t))?+G.get(t):c,Z={frac:$e("olw",.0048),k:$e("olk",.5),refP11:1/Math.tan(15*Math.PI/180),refZ:4.95,push:$e("olpush",.012),hand:.5,head:.7,shoe:.8,hair:.78,ink:"#2a1d33",hairInk:"#1a1430"},Ot="#2b2230",ho=.0045,vo="#231c26",go="#f4efe6",pe=0,Fe=1,Qe=2,kt=3,wo=["Coach_Body","Coach_Shoe_Details","Coach_Sneakers","Coach_Soles","Coach_Training_Shorts","Mesh005","Mesh005_1","V2P_Base_Limbs","V3_Head_Neck_Torso_Shared_R26","V2P_Base_Hands"],xo=.305,_t=1,yo=`
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
}`,bo=`
uniform vec3 uBase[4];
uniform vec3 uShade[4];
uniform vec3 uLight;
varying vec4 vW;
varying vec3 vN;
varying vec3 vV;
void main() {
  // 部位：取插值后权重最大的那一项，边界落在三角形中线上，不会糊
  int r = 0; float m = vW.x;
  if (vW.y > m) { m = vW.y; r = 1; }
  if (vW.z > m) { m = vW.z; r = 2; }
  if (vW.w > m) { m = vW.w; r = 3; }
  vec3 alb = uBase[0], shc = uShade[0];
  if (r == 1) { alb = uBase[1]; shc = uShade[1]; }
  else if (r == 2) { alb = uBase[2]; shc = uShade[2]; }
  else if (r == 3) { alb = uBase[3]; shc = uShade[3]; }
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
}`,Mo=`
#include <common>
#include <skinning_pars_vertex>
void main() {
  #include <beginnormal_vertex>
  #include <skinbase_vertex>
  #include <skinnormal_vertex>
  #include <begin_vertex>
  #include <skinning_vertex>
  transformed += normalize(objectNormal) * ${ho.toFixed(4)};   // 蒙皮后（米）沿法线外扩
  #include <project_vertex>
}`,nt=`
uniform vec3 uColor;
void main() { gl_FragColor = vec4(uColor, 1.0);
  #include <colorspace_fragment>
}`,Vt=`
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
}`,So=`
attribute float olW; attribute vec4 toonW; varying vec4 vW;
#include <common>
#include <skinning_pars_vertex>
${Vt}
void main() {
  vW = toonW;
  #include <beginnormal_vertex>
  #include <skinbase_vertex>
  #include <skinnormal_vertex>
  #include <begin_vertex>
  #include <skinning_vertex>
  vec4 mv = modelViewMatrix * vec4(transformed, 1.0);
  gl_Position = ol2Clip(mv, normalize(normalMatrix * objectNormal), olW);
}`,Ao=`
uniform vec3 uShade[4]; uniform vec3 uInk; varying vec4 vW;
void main() {
  int r = 0; float m = vW.x;
  if (vW.y > m) { m = vW.y; r = 1; }
  if (vW.z > m) { m = vW.z; r = 2; }
  if (vW.w > m) { m = vW.w; r = 3; }
  vec3 s = uShade[0]; if (r == 1) s = uShade[1]; else if (r == 2) s = uShade[2]; else if (r == 3) s = uShade[3];
  gl_FragColor = vec4(mix(s * 0.42, uInk, 0.38), 1.0);    // 色线：各部位暗色 + 深紫墨（不是纯黑）
  #include <colorspace_fragment>
}`,Et=()=>({uF:{value:Z.frac},uW0:{value:Z.frac/(Z.refP11/(2*Z.refZ))},uK:{value:Z.k},uPush:{value:Z.push}});function Ke(t=ot){return new re({...ve?{defines:je?{STYLE2:"",RIM:""}:{STYLE2:"",...Ee>0?{TOONN:""}:{}}}:{},name:"toon3r2",uniforms:{uBase:{value:t.base.map(c=>new X(c))},uShade:{value:t.shade.map(c=>new X(c))},uLight:{value:new B(-.45,.75,.55)}},vertexShader:yo,fragmentShader:bo})}function ko(t){const n=new Array(24).fill(-9),b=new Array(24).fill(0);let M=0;for(const p of t)M+=p.z;M/=t.length;for(const p of t){const s=Math.floor((Math.atan2(p.x,p.z-M)/Math.PI+1)/2*24)%24,k=Math.hypot(p.x,p.z-M);n[s]=Math.max(n[s],p.y),b[s]=Math.max(b[s],k)}const A=(p,s)=>{const k=(Math.atan2(s.x,s.z-M)/Math.PI+1)/2*24-.5,w=Math.floor(k),a=k-w,z=(w%24+24)%24,f=(z+1)%24;return p[z]*(1-a)+p[f]*a};return{zc:M,top:p=>A(n,p),rad:p=>A(b,p)}}const ne=t=>{const c=[0,0,0,0];return c[t]=1,c},Ve=(t,c,n)=>{const b=Math.min(1,Math.max(0,.5+n/.02)),M=[0,0,0,0];return M[t]+=1-b,M[c]+=b,M};function _o(t,c,n,b){if(t===1||t===2||t===3)return ne(kt);if(t===5||t===6)return ne(Fe);if(t===9)return ne(pe);if(/Foot/.test(c))return ne(kt);if(/Hand|Forearm/.test(c))return ne(pe);if(/Thigh|Shin|Patella/.test(c))return ne(Qe);if(t===4)return Ve(Fe,Qe,_t-n.y);if(c==="head")return ne(pe);if(b){if(Math.hypot(n.x,n.z-b.zc)<b.rad(n)+.005)return Ve(Fe,pe,n.y-b.top(n)-.002);if(c==="neck")return ne(pe)}else if(c==="neck")return ne(pe);return/UpperArm|Scapula/.test(c)?Ve(Fe,pe,Math.abs(n.x)-xo):Ve(Fe,Qe,_t-n.y)}function Ft(t,c){const n=t.skeleton,b=n.bones.findIndex(M=>M.name===c);return new it().multiplyMatrices(n.bones[b].matrixWorld,n.boneInverses[b]).multiply(t.bindMatrix)}function at(t,c=12){const n=t.attributes.position,b=n.count,M=new B,A=e=>(M.fromBufferAttribute(n,e),Math.round(M.x*2e4)+","+Math.round(M.y*2e4)+","+Math.round(M.z*2e4)),p=new Map,s=new Int32Array(b);for(let e=0;e<b;e++){const o=A(e);p.has(o)||p.set(o,p.size),s[e]=p.get(o)}const k=new Float32Array(p.size*3),w=t.index?t.index.array:null,a=w?w.length:b,z=new B,f=new B,d=new B;for(let e=0;e<a;e+=3){const o=w?w[e]:e,l=w?w[e+1]:e+1,g=w?w[e+2]:e+2;z.fromBufferAttribute(n,o),f.fromBufferAttribute(n,l),d.fromBufferAttribute(n,g),d.sub(f),z.sub(f),d.cross(z);for(const r of[o,l,g]){const x=s[r]*3;k[x]+=d.x,k[x+1]+=d.y,k[x+2]+=d.z}}const I=p.size,h=[],_=new Int32Array(I+1);{const e=Array.from({length:I},()=>new Set);for(let o=0;o<a;o+=3){const l=s[w?w[o]:o],g=s[w?w[o+1]:o+1],r=s[w?w[o+2]:o+2];e[l].add(g).add(r),e[g].add(l).add(r),e[r].add(l).add(g)}for(let o=0;o<I;o++){_[o+1]=_[o]+e[o].size;for(const l of e[o])h.push(l)}}let i=new Float32Array(k),R=new Float32Array(I*3);for(let e=0;e<I;e++){const o=Math.hypot(i[3*e],i[3*e+1],i[3*e+2])||1;i[3*e]/=o,i[3*e+1]/=o,i[3*e+2]/=o}for(let e=0;e<c;e++){for(let o=0;o<I;o++){let l=i[3*o],g=i[3*o+1],r=i[3*o+2];for(let N=_[o];N<_[o+1];N++){const O=h[N];l+=i[3*O],g+=i[3*O+1],r+=i[3*O+2]}const x=Math.hypot(l,g,r)||1;R[3*o]=l/x,R[3*o+1]=g/x,R[3*o+2]=r/x}[i,R]=[R,i]}const m=t.attributes.normal;for(let e=0;e<b;e++){const o=s[e]*3;m.setXYZ(e,i[o],i[o+1],i[o+2])}m.needsUpdate=!0}function Fo(t,c,n){const b=t.skeleton,M=b.bones.indexOf(c),A=new it().multiplyMatrices(b.boneInverses[M],t.bindMatrix),p=A.clone().invert(),s=t.geometry,k=s.attributes.position;s.attributes.normal;const w=k.count,a=new B,z=[];for(let r=0;r<w;r++)z.push(a.fromBufferAttribute(k,r).applyMatrix4(A).clone());const f=(r,x,N)=>{const O=Math.min(1,Math.max(0,(N-r)/(x-r)));return O*O*(3-2*O)},d=z.map(r=>r.z<.06?0:(1-f(n.hx,n.hx+n.f,Math.abs(r.x)))*f(n.y0-n.f,n.y0,r.y)*(1-f(n.y1,n.y1+n.f,r.y))),I=r=>Math.round(r.x*1e5)+","+Math.round(r.y*1e5)+","+Math.round(r.z*1e5),h=new Map,_=[];for(let r=0;r<w;r++){const x=I(z[r]);h.has(x)||h.set(x,h.size),_.push(h.get(x))}const i=h.size,R=new Array(i),m=new Float32Array(i),e=Array.from({length:i},()=>new Set);for(let r=0;r<w;r++)R[_[r]]=z[r].clone(),m[_[r]]=Math.max(m[_[r]],d[r]);const o=s.index?s.index.array:null,l=o?o.length:w;for(let r=0;r<l;r+=3){const x=_[o?o[r]:r],N=_[o?o[r+1]:r+1],O=_[o?o[r+2]:r+2];e[x].add(N).add(O),e[N].add(x).add(O),e[O].add(x).add(N)}let g=0;for(let r=0;r<i;r++)m[r]>0&&g++;for(let r=0;r<n.iters;r++){const x=R.map(N=>N.clone());for(let N=0;N<i;N++){if(!(m[N]>0))continue;const O=new B;for(const $ of e[N])O.add(R[$]);O.multiplyScalar(1/e[N].size),x[N].lerp(O,.6*m[N])}for(let N=0;N<i;N++)R[N]=x[N]}for(let r=0;r<w;r++)m[_[r]]>0&&(a.copy(R[_[r]]).applyMatrix4(p),k.setXYZ(r,a.x,a.y,a.z));return k.needsUpdate=!0,at(s),s.computeBoundingSphere(),{verts:w,welded:i,active:g}}function zo(t,c){const n=t.skeleton,b=n.bones.indexOf(c),M=new it().multiplyMatrices(n.boneInverses[b],t.bindMatrix),A=new Xe,p=t.geometry.attributes.position,s=new Float32Array(p.count*3),k=new B;for(let z=0;z<p.count;z++)k.fromBufferAttribute(p,z).applyMatrix4(M),s.set([k.x,k.y,k.z],3*z);A.setAttribute("position",new Q(s,3)),A.setIndex(t.geometry.index),A.computeBoundingSphere();const w=new fe(A,new rt({side:Nt}));w.updateMatrixWorld(!0);const a=new Jt;return(z,f)=>{a.set(new B(z,f,.4),new B(0,0,-1));const d=a.intersectObject(w,!1)[0];return d?d.point.z:null}}function Co(t,c){const n=new rt({color:vo}),b={eyes:[],brows:[]};for(const a of[-1,1]){const z=a*.032,f=.069,d=c(z,f),I=new fe(new Qt(1,24,16),n);I.position.set(z,f,d!=null?d+.002:.1045),I.quaternion.set(-.020044549351510503,0,0,.9997990878377991),I.scale.set(.00819,.013125,.00315),I.userData.__face=!0,t.add(I),b.eyes.push({p:I.position.toArray().map(h=>+h.toFixed(4)),surf:d})}const M=.0105,A=.046,p=.104,s=.034,k=.004,w=6;for(const a of[-1,1]){const z=a*s,f=new Kt(M/2,A-M,6,12);f.rotateZ(Math.PI/2),f.scale(1,1,.25);const d=[-M/2,0,M/2].map(i=>Array.from({length:w+1},(R,m)=>c(z-A/2-.002+(A+.004)*m/w,p+i))),I=(i,R)=>{const m=Math.min(w,Math.max(0,(i+A/2+.002)/(A+.004)*w)),e=Math.min(w-1,Math.floor(m)),o=m-e,l=Math.min(2,Math.max(0,(R+M/2)/(M/2))),g=Math.min(1,Math.floor(l)),r=l-g,x=N=>(d[N][e]??.1)*(1-o)+(d[N][e+1]??.1)*o;return x(g)*(1-r)+x(g+1)*r},h=f.attributes.position;for(let i=0;i<h.count;i++){const R=h.getX(i),m=Math.max(I(R,-M/2),I(R,0),I(R,M/2));h.setZ(i,h.getZ(i)+m+k)}h.needsUpdate=!0,f.computeVertexNormals();const _=new fe(f,n);_.position.set(z,p,0),_.userData.__face=!0,t.add(_),b.brows.push({xc:z,z:d[1].map(i=>i==null?null:+i.toFixed(4))})}return b}function Po({scene:t,root:c,bones:n,skinned:b,grid:M,floor:A,renderer:p,camera:s}){c.updateMatrixWorld(!0);const k={prims:[],counts:[0,0,0,0]};t.background=new X(go),M&&M.removeFromParent(),A&&(A.material=new rt({color:15129805,transparent:!0,opacity:.6}));const w=n.head,a=b.slice(),z=new Map(a.map((e,o)=>[e,o]));let f=null;{const e=a[5];if(e){const o=Ft(e,"torso"),l=e.geometry.attributes.position,g=new B,r=[];for(let x=0;x<l.count;x++)r.push(g.fromBufferAttribute(l,x).applyMatrix4(o).clone());f=ko(r)}}const d=Bt[At],I=Ke(d),h=Ke(d);h.defines={...h.defines||{},INFLATE:"0.0015"};let _=null;d.sock&&(_=Ke({base:d.base.map((e,o)=>o===3?d.sock[0]:e),shade:d.shade.map((e,o)=>o===3?d.sock[1]:e)})),k.outfit=At,k.hair=Ce;for(const e of a){const o=z.get(e),l=e.geometry,g=l.attributes.position,r=l.attributes.skinIndex,x=l.attributes.skinWeight,N=Ft(e,"pelvis"),O=new B,$=new Float32Array(g.count*4),E=e.skeleton.bones.map(H=>H.name);for(let H=0;H<g.count;H++){let j=0,Y=-1;for(let J=0;J<4;J++){const Me=x.getComponent(H,J);Me>Y&&(Y=Me,j=r.getComponent(H,J))}O.fromBufferAttribute(g,H).applyMatrix4(N);const se=l.attributes._region,K=se?ne(Math.round(se.getX(H))):_o(o,E[j],O,f);$.set(K,4*H),k.counts[K.indexOf(Math.max(...K))]++}l.setAttribute("toonW",new Q($,4)),at(l);const D=e.material&&e.material.name;e.material=!l.attributes._region&&(o===5||o===6)?h:_&&D==="sock"?_:I,k.prims.push({prim:o,name:wo[o],verts:g.count})}const i=a.find(e=>e.geometry.attributes._region&&e.name.includes("skin"))||a.find(e=>e.geometry.attributes._region&&Math.round(e.geometry.attributes._region.getX(0))===0&&e.geometry.attributes.position.count>2e4)||a[8];i&&w&&(k.faceFix=Fo(i,w,{hx:.026,y0:-.036,y1:.045,f:.012,iters:60}),k.face=Co(w,zo(i,w)));const R=performance.now();if(ve&&!je&&Ee>0)for(const e of a){const o=e.geometry,l=o.attributes.normal,g=new Float32Array(l.count*3);for(let x=0;x<l.count;x++)g[3*x]=l.getX(x),g[3*x+1]=l.getY(x),g[3*x+2]=l.getZ(x);at(o,12+Ee);const r=new Float32Array(l.count*3);for(let x=0;x<l.count;x++)r[3*x]=l.getX(x),r[3*x+1]=l.getY(x),r[3*x+2]=l.getZ(x),l.setXYZ(x,g[3*x],g[3*x+1],g[3*x+2]);l.needsUpdate=!0,o.setAttribute("toonN",new Q(r,3))}k.toonN={iters:ve&&!je?Ee:0,ms:+(performance.now()-R).toFixed(0)};const m=ve?new re({name:"toon-outline-r2",uniforms:{...Et(),uShade:{value:d.shade.map(e=>new X(e))},uInk:{value:new X(Z.ink)}},vertexShader:So,fragmentShader:Ao,side:Ue}):new re({name:"toon3r2-outline",uniforms:{uColor:{value:new X(Ot)}},vertexShader:Mo,fragmentShader:nt,side:Ue});if(ve)for(const e of a){const o=e.geometry,l=o.attributes.skinIndex,g=o.attributes.skinWeight,r=o.attributes._region,x=l.count,N=new Float32Array(x),O=e.skeleton.bones.map(E=>E.name),$=O.filter(E=>/^leftWristBend\d+$/.test(E)).length+1;for(let E=0;E<x;E++){let D=0,H=0;for(let Y=0;Y<4;Y++){const se=O[l.getComponent(E,Y)],K=g.getComponent(E,Y);let J;/Hand$/.test(se)?D+=K:(J=/WristBend(\d+)$/.exec(se))?D+=K*+J[1]/$:se==="head"&&(H+=K)}const j=r?Math.round(r.getX(E))===3:!1;N[E]=Math.min(j?Z.shoe:1,1+(Z.hand-1)*Math.min(1,D*1.2),1+(Z.head-1)*Math.min(1,H*1.2))}o.setAttribute("olW",new Q(N,1))}for(const e of a){const o=new It(e.geometry,m);o.bind(e.skeleton,e.bindMatrix),o.userData.__outline=!0,o.frustumCulled=!1,o.renderOrder=-1,o.raycast=()=>{},e.add(o)}return k.outlines=a.length,k.faceSnap=(e=0,o=500,l=500,g)=>{c.updateMatrixWorld(!0);const r=w.getWorldPosition(new B),x=w.getWorldQuaternion(new ae),N=new B(0,.07,.03).applyQuaternion(x).add(r),O=new B(e,.05,1).applyQuaternion(x).normalize(),$=new B(0,1,0).applyQuaternion(x),E=new Tt(12,o/l,.05,50);E.up.copy($),E.position.copy(N).addScaledVector(O,1.6),E.lookAt(N),E.updateMatrixWorld();const D=p.domElement.width,H=p.domElement.height,j=p.getPixelRatio();p.setPixelRatio(1),p.setSize(o,l,!1),g&&g(!0),p.render(t,E);const Y=p.domElement.toDataURL("image/png");return g&&g(!1),p.setPixelRatio(j),p.setSize(D/j,H/j,!1),Y},Ce!=="none"&&w&&(k.hairReady=Lo(w,k,d)),k}const Wo=`
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
}`,Io=`
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
}`,To=.0035,No=`
attribute vec3 _oln;
${Vt}
void main() { gl_Position = ol2Clip(modelViewMatrix * vec4(position, 1.0), normalize(normalMatrix * _oln), ${Z.hair.toFixed(3)}); }`,Ro=`
attribute vec3 _oln;
void main() { gl_Position = projectionMatrix * modelViewMatrix * vec4(position + normalize(_oln) * ${To.toFixed(4)}, 1.0); }`;async function Lo(t,c,n){const b=await new Rt().loadAsync(new URL("./v5/hair-v3r5.glb",document.baseURI).href),M=St[G.get("hairc")]||St.black,A=/^[0-9a-f]{6}$/i.test(G.get("cap")||"")?["#"+G.get("cap"),"#"+new X("#"+G.get("cap")).multiplyScalar(.55).getHexString()]:n.cap,p=new B(-.45,.75,.55),s=(f,d,I,h)=>new re({name:"toon-hair",...ve&&!je?{defines:{NORIM:""}}:{},uniforms:{uBase:{value:new X(f)},uShade:{value:new X(d)},uHi:{value:new X(I)},uLight:{value:p},uRib:{value:h}},vertexShader:Wo,fragmentShader:Io}),k={hair:s(M[0],M[1],M[2],0),beanie:s(A[0],A[1],A[0],46)},w=ve?new re({name:"toon-hair-outline-r2",uniforms:{...Et(),uColor:{value:new X(Z.hairInk)}},vertexShader:No,fragmentShader:nt,side:Ue}):new re({name:"toon-hair-outline",uniforms:{uColor:{value:new X(Ot)}},vertexShader:Ro,fragmentShader:nt,side:Ue}),a=new tt;a.name="hair-"+Ce,a.userData.__hair=!0;const z={style:Ce,meshes:[]};return b.scene.traverse(f=>{if(!f.isMesh||(f.parent&&f.parent.name.startsWith("hair_")?f.parent.name:f.name).replace(/^hair_/,"").replace(/_\d+$/,"")!==Ce)return;const I=f.material.userData&&f.material.userData.region||f.material.name,h=new fe(f.geometry,k[I]||k.hair);h.name=f.name,h.userData.region=I,h.frustumCulled=!1,h.raycast=()=>{};const _=new fe(f.geometry,w);_.userData.__outline=!0,_.frustumCulled=!1,_.renderOrder=-1,_.raycast=()=>{},h.add(_),a.add(h),z.meshes.push({name:f.name,region:I,verts:f.geometry.attributes.position.count,tris:f.geometry.index.count/3})}),t.add(a),c.hairInfo=z,z}const Je=new URLSearchParams,ce=(t,c)=>Je.has(t)&&isFinite(+Je.get(t))?+Je.get(t):c,Bo={samples:720,trailSeconds:.95,segments:56,rippleSeconds:.9,refTurn:8.991662288,width:.024,motes:18,moteLife:.8,plantDrop:.025,plantDelay:6,ripples:4,old:ce("fxold",0)===1,halo:2.8,wide:ce("fxwide",1.6),glow:ce("fxglow",1),flick:ce("fxflick",1),core:ce("fxcore",1),shadow:ce("fxshadow",1)!==0,ring:ce("fxring",1)!==0,spark:ce("fxspark",1)!==0,shadowCell:ce("fxcell",.022),palette:{head:"#ff8a3a",mid:"#ff6a55",tail:"#ff8f9a",ripple:"#ff9348",gold:"#ffe6a8"},colors:{core:"#fffaf2",ink:"#3a1f3c",ringInk:"#b8462a",shadow1:"#d9cbbd",shadow2:"#c3b2a5"}},Oo=`
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
  }`,Vo=`
  uniform float uOpacity; uniform float uProgress; uniform vec3 uColor; varying vec2 vUv;
  void main() {
    float r = length(vUv - 0.5) * 2.0; float ring = uProgress * 0.92 + 0.06; float w = 0.05 + 0.05 * uProgress;
    float band = exp(-pow((r - ring) / w, 2.0));
    float glow = exp(-pow(r / max(ring, 0.05), 2.0) * 3.0) * 0.18 * (1.0 - uProgress);
    float a = uOpacity * (band * 0.85 + glow) * pow(1.0 - uProgress, 1.4);
    gl_FragColor = vec4(uColor, a);
    #include <colorspace_fragment>
  }`,Eo=`uniform float uOpacity; uniform vec3 uHead; uniform vec3 uTail; uniform vec3 uCore; uniform vec3 uEdge; varying float vAge;
  void main(){ vec2 q = gl_PointCoord - 0.5; float d = length(q) * 2.0; if (d > 1.0) discard;
    float a = uOpacity * pow(1.0 - vAge, 2.0) * exp(-d * d * 4.0);
    gl_FragColor = vec4(mix(uHead, uTail, vAge) * 1.4 + 0.25, a);
    #include <colorspace_fragment>
  }`,qo=`
attribute float aAge; attribute float aSide; attribute float aSpeed;
varying float vAge; varying float vSide; varying float vSpeed;
void main(){ vAge = aAge; vSide = aSide; vSpeed = aSpeed; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }`,Ho=`
float h11(float x){ return fract(sin(x * 127.1 + uSeed * 31.7) * 43758.5453); }
float n1(float x){ float i = floor(x), f = fract(x); f = f * f * (3.0 - 2.0 * f); return mix(h11(i), h11(i + 1.0), f) * 2.0 - 1.0; }
float h21(vec2 p){ return fract(sin(dot(p, vec2(127.1, 311.7)) + uSeed * 17.0) * 43758.5453); }
float n2(vec2 p){ vec2 i = floor(p), f = fract(p); f = f * f * (3.0 - 2.0 * f);
  return mix(mix(h21(i), h21(i + vec2(1, 0)), f.x), mix(h21(i + vec2(0, 1)), h21(i + vec2(1, 1)), f.x), f.y); }
vec3 toS(vec3 c){ return pow(max(c, 0.0), vec3(1.0 / 2.2)); }   // 线性 → sRGB（预乘输出不走 colorspace_fragment）
`,Uo=`
uniform float uOpacity; uniform float uHalo; uniform float uWide; uniform float uSeed; uniform vec3 uShoe; uniform float uTime; uniform float uFlick; uniform float uCoreK;
uniform vec3 uHead; uniform vec3 uMid; uniform vec3 uTail; uniform vec3 uCore; uniform vec3 uGold;
varying float vAge; varying float vSide; varying float vSpeed;
${Ho}
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
}`,Xo=`attribute float aAge; attribute float aSize; uniform float uScale; uniform float uStar; varying float vAge;
void main(){ vAge = aAge; vec4 mv = modelViewMatrix * vec4(position, 1.0); gl_Position = projectionMatrix * mv;
  gl_PointSize = aAge >= 1.0 ? 0.0 : aSize * uStar * (1.0 - 0.6 * aAge) * uScale / max(0.1, -mv.z); }`,Do=`uniform float uOpacity; uniform vec3 uCore; uniform vec3 uEdge; varying float vAge;
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
}`,jo=`
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
}`,Yo=`
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
}`,Go=`
uniform vec3 uC1; uniform vec3 uC2; uniform float uCut; varying float vH;
void main(){ gl_FragColor = vec4(vH < uCut ? uC2 : uC1, 1.0);
  #include <colorspace_fragment>
}`;function zt(t,c,n){const b=t.attributes.position,M=b.count,A=new Int32Array(M),p=new Map,s=[],k=[],w=[],a=[],z=t.attributes.skinIndex,f=t.attributes.skinWeight;for(let i=0;i<M;i++){const R=b.getX(i),m=b.getY(i),e=b.getZ(i),o=Math.floor(R/c)+","+Math.floor(m/c)+","+Math.floor(e/c);let l=p.get(o);l===void 0&&(l=a.length,p.set(o,l),a.push(0),s.push(0,0,0),n&&(k.push(z.getX(i),z.getY(i),z.getZ(i),z.getW(i)),w.push(f.getX(i),f.getY(i),f.getZ(i),f.getW(i)))),s[l*3]+=R,s[l*3+1]+=m,s[l*3+2]+=e,a[l]++,A[i]=l}for(let i=0;i<a.length;i++)s[i*3]/=a[i],s[i*3+1]/=a[i],s[i*3+2]/=a[i];const d=t.index,I=d?d.count:M,h=[];for(let i=0;i<I;i+=3){const R=A[d?d.getX(i):i],m=A[d?d.getX(i+1):i+1],e=A[d?d.getX(i+2):i+2];R!==m&&m!==e&&R!==e&&h.push(R,m,e)}const _=new Xe;return _.setAttribute("position",new Mt(s,3)),n&&(_.setAttribute("skinIndex",new so(k,4)),_.setAttribute("skinWeight",new Mt(w,4))),_.setIndex(h),_}const ze=t=>t-Math.floor(t);function Zo({scene:t,root:c,bones:n,skinned:b,renderer:M,anim:A,getFrame:p,getFrames:s,jointIds:k,params:w={}}){const a={...Bo,...w},z=a.colors,f=a.palette,d=A.count,I=A.fps||120,h=a.samples,_=d/I,i=_/a.refTurn,R=a.trailSeconds*i,m=a.rippleSeconds*i,e=new tt;e.name="v3r7-fx3",t.add(e);const o=b.filter(S=>!S.userData.__outline),l={params:{old:a.old,trailSeconds:R,trailFrames:R*I,rippleFrames:m*I,moteFrames:a.moteLife*I,shadow:a.shadow,ring:a.ring,spark:a.spark}};c.updateMatrixWorld(!0);const g=new B,r=S=>{const y=S.geometry.attributes._region;if(!y)return-1;const C=[0,0,0,0];for(let u=0;u<y.count;u+=7)C[Math.round(y.getX(u))]++;return C.indexOf(Math.max(...C))},x=o.filter(S=>/Sneaker|Sole/i.test(S.name)||r(S)===3),N=S=>{const y=n[S+"Foot"],C=y.getWorldPosition(new B);let u=null,W=-1;for(const v of x.length?x:o){const P=v.skeleton.bones.indexOf(y);if(P<0)continue;const T=v.geometry.attributes.skinIndex,L=v.geometry.attributes.skinWeight;for(let F=0;F<T.count;F++){let q=0;for(let U=0;U<4;U++)T.getComponent(F,U)===P&&(q+=L.getComponent(F,U));if(q<.95)continue;v.getVertexPosition(F,g).applyMatrix4(v.matrixWorld);const V=g.distanceTo(C);V>W&&(W=V,u={m:v,i:F})}}return u},O={left:N("left"),right:N("right")};l.toe={left:O.left?.i??-1,right:O.right?.i??-1,mesh:O.left?.m.name};const $={left:new Float32Array(d*3),right:new Float32Array(d*3)},E={left:new Float32Array(d*3),right:new Float32Array(d*3)},D={left:new Float32Array(h*3),right:new Float32Array(h*3)},H={left:new Float32Array(h*3),right:new Float32Array(h*3)},j={left:new Float32Array(h),right:new Float32Array(h)};let Y=[],se=null;const K=(S,y,C)=>{const u=Math.floor(y),W=y-u,v=U=>(U%d+d)%d,P=v(u-1),T=v(u),L=v(u+1),F=v(u+2),q=W*W,V=q*W;for(let U=0;U<3;U++){const ke=S[P*3+U],xe=S[T*3+U],oe=S[L*3+U],_e=S[F*3+U];C.setComponent(U,.5*(2*xe+(-ke+oe)*W+(2*ke-5*xe+4*oe-_e)*q+(-ke+3*xe-3*oe+_e)*V))}return C};function J(S){const y=k.map(v=>n[v].quaternion.clone()),C=n.pelvis.position.clone(),u=new ae;for(let v=0;v<d;v++){const P=S[v];for(const T of k)n[T].quaternion.copy(u.fromArray(P.q[T]||[0,0,0,1]).normalize());n.pelvis.position.fromArray(P.p),c.updateMatrixWorld(!0);for(const T of["left","right"]){const L=O[T];L?L.m.getVertexPosition(L.i,g).applyMatrix4(L.m.matrixWorld):n[T+"Foot"].getWorldPosition(g),g.toArray($[T],v*3),n[T+"Hand"].getWorldPosition(g).toArray(E[T],v*3)}}k.forEach((v,P)=>n[v].quaternion.copy(y[P])),n.pelvis.position.copy(C),c.updateMatrixWorld(!0);for(const v of["left","right"])for(let P=0;P<h;P++)K($[v],P/h*d,g).toArray(D[v],P*3),K(E[v],P/h*d,g).toArray(H[v],P*3);const W=_/h;for(const v of["left","right"]){const P=D[v],T=new Float32Array(h);for(let F=0;F<h;F++){const q=(F+1)%h;T[F]=Math.hypot(P[q*3]-P[F*3],P[q*3+1]-P[F*3+1],P[q*3+2]-P[F*3+2])/W}const L=[...T].sort((F,q)=>F-q)[Math.floor(h*.8)]||1;for(let F=0;F<h;F++)j[v][F]=Math.min(1,T[F]/L)}Y=[];for(const v of["left","right"]){const P=F=>H[v][F*3+1];let T=1/0;for(let F=0;F<h;F++)T=Math.min(T,P(F));const L=F=>P(F)<T+a.plantDrop;for(let F=0;F<h;F++)if(L(F)&&!L((F-1+h)%h)){const q=(F+a.plantDelay)%h;Y.push({side:v,wall:F/h*_,x:H[v][q*3],z:H[v][q*3+2]})}}l.plants=Y.map(v=>({side:v.side,frame:+(v.wall*I).toFixed(1)})),se=S}J(s());const Me=(S,y,C)=>{const u=(y/_%1+1)%1*h,W=Math.floor(u),v=(W+1)%h,P=u-W;return C.set(S[W*3]+(S[v*3]-S[W*3])*P,S[W*3+1]+(S[v*3+1]-S[W*3+1])*P,S[W*3+2]+(S[v*3+2]-S[W*3+2])*P)},lt=(S,y)=>{const C=(y/_%1+1)%1*h,u=Math.floor(C),W=(u+1)%h,v=C-u;return S[u]+(S[W]-S[u])*v},le=S=>new X(S),ct=a.old?1:a.halo,ee=a.segments,Xt={blending:io,blendEquation:ro,blendSrc:ao,blendDst:no,premultipliedAlpha:!0},Ge=()=>a.old?{blending:oo}:Xt,ft={value:le(f.head)},ut={value:le(f.mid)},dt={value:le(f.tail)},mt={value:le(z.core)},pt=[0,1].map(S=>new re({name:"fx2-ribbon",vertexShader:qo,fragmentShader:a.old?Oo:Uo,transparent:!0,depthWrite:!1,side:Nt,...Ge(),uniforms:{uOpacity:{value:a.old?1:a.glow},uHalo:{value:ct},uWide:{value:a.wide},uSeed:{value:S*3.7+1.3},uShoe:{value:new B(-1e4,-1e4,0)},uTime:{value:0},uFlick:{value:a.flick},uCoreK:{value:a.core},uHead:ft,uMid:ut,uTail:dt,uCore:mt,uGold:{value:le(f.gold)},uInk:{value:le(z.ink)}}})),Dt=["left","right"].map((S,y)=>{const C=(ee+1)*2,u=new Xe;u.setAttribute("position",new Q(new Float32Array(C*3),3).setUsage(Oe));const W=new Float32Array(C),v=new Float32Array(C);for(let L=0;L<=ee;L++)W[L*2]=W[L*2+1]=L/ee,v[L*2]=-1,v[L*2+1]=1;u.setAttribute("aAge",new Q(W,1)),u.setAttribute("aSide",new Q(v,1)),u.setAttribute("aSpeed",new Q(new Float32Array(C),1).setUsage(Oe));const P=[];for(let L=0;L<ee;L++){const F=L*2;P.push(F,F+1,F+2,F+1,F+3,F+2)}u.setIndex(P);const T=new fe(u,pt[y]);return T.frustumCulled=!1,T.renderOrder=3,e.add(T),{side:S,mesh:T,geometry:u}}),te=Array.from({length:ee+1},()=>new B),Ne=new B,ht=new B,me=new B,ue=new B,Ze=new B,Re=new Lt;function jt(S,y,C){const u=R;for(const W of pt)W.uniforms.uTime.value=S;C.getDrawingBufferSize(Re);for(const W of Dt){const v=O[W.side];v&&v.m.getVertexPosition(v.i,Ze).applyMatrix4(v.m.matrixWorld),n[W.side+"Foot"].getWorldPosition(ue);const P=ue.distanceTo(Ze)*.46;ue.lerp(Ze,.45);const T=y.position.distanceTo(ue);ue.project(y);const L=y.isPerspectiveCamera?P/(T*Math.tan(De.degToRad(y.fov)/2))*Re.y/2:0;W.mesh.material.uniforms.uShoe.value.set((ue.x*.5+.5)*Re.x,(ue.y*.5+.5)*Re.y,!a.old&&ue.z<1?L:0);const F=W.geometry.attributes.position,q=W.geometry.attributes.aSpeed;for(let V=0;V<=ee;V++)Me(D[W.side],S-u*V/ee,te[V]);for(let V=0;V<=ee;V++){const U=te[Math.max(0,V-1)],ke=te[Math.min(ee,V+1)];Ne.subVectors(U,ke),Ne.lengthSq()<1e-10&&Ne.set(1,0,0),ht.subVectors(y.position,te[V]),me.crossVectors(Ne,ht).normalize();const xe=V/ee,oe=a.width*(1-xe*.75)*ct;F.setXYZ(V*2,te[V].x-me.x*oe,te[V].y-me.y*oe,te[V].z-me.z*oe),F.setXYZ(V*2+1,te[V].x+me.x*oe,te[V].y+me.y*oe,te[V].z+me.z*oe);const _e=lt(j[W.side],S-u*xe);q.setX(V*2,_e),q.setX(V*2+1,_e)}F.needsUpdate=!0,q.needsUpdate=!0}}const we=a.motes,vt=new re({name:"fx2-mote",transparent:!0,depthWrite:!1,...Ge(),uniforms:{uOpacity:{value:a.old?.9:.9*a.glow},uScale:{value:400},uStar:{value:a.old?1:2.6},uHead:ft,uMid:ut,uTail:dt,uCore:mt,uEdge:{value:le(f.ripple)}},vertexShader:Xo,fragmentShader:a.old?Eo:Do}),gt=["left","right"].map((S,y)=>{const C=new Xe;C.setAttribute("position",new Q(new Float32Array(we*3),3).setUsage(Oe)),C.setAttribute("aAge",new Q(new Float32Array(we),1).setUsage(Oe));const u=new Float32Array(we),W=[];for(let P=0;P<we;P++){const T=ze(Math.sin((P+1)*12.9898+y*78.233)*43758.5453);u[P]=.01+.012*T,W.push(new B(ze(T*7.13)-.5,ze(T*3.71)-.2,ze(T*5.29)-.5).normalize())}C.setAttribute("aSize",new Q(u,1));const v=new eo(C,vt);return v.frustumCulled=!1,v.renderOrder=4,e.add(v),{side:S,mesh:v,geometry:C,seed:W}}),Le=new B;function Yt(S,y){vt.uniforms.uScale.value=M.domElement.height/(2*Math.tan(De.degToRad(y.fov||35)/2));const C=a.moteLife;for(const u of gt){const W=u.geometry.attributes.position,v=u.geometry.attributes.aAge;for(let P=0;P<we;P++){const T=ze(S/C+P/we),L=S-T*C;Me(D[u.side],L,Le);const F=.05*T+.02*T*T,q=lt(j[u.side],L);W.setXYZ(P,Le.x+u.seed[P].x*F,Le.y+u.seed[P].y*F+.015*T,Le.z+u.seed[P].z*F),v.setX(P,q>.35?T:1)}W.needsUpdate=!0,v.needsUpdate=!0}}const Se=Array.from({length:a.ripples},()=>{const S=new re({name:"fx2-ripple",vertexShader:"varying vec2 vUv; void main(){ vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0); }",fragmentShader:a.old?Vo:jo,transparent:!0,depthWrite:!1,...Ge(),uniforms:{uOpacity:{value:0},uProgress:{value:0},uColor:{value:le(f.ripple)},uInk:{value:le(z.ringInk)}}}),y=new fe(new to(.5,.5),S);return y.rotation.x=-Math.PI/2,y.position.y=.0036,y.visible=!1,y.renderOrder=1,y.frustumCulled=!1,e.add(y),y});function Gt(S){let y=0;for(const C of Y){let u=S-C.wall;if(u<0&&(u+=_),u>m||y>=Se.length)continue;const W=Se[y++];W.visible=!0,W.position.x=C.x,W.position.z=C.z,W.material.uniforms.uProgress.value=u/m,W.material.uniforms.uOpacity.value=a.old?.75:.75*a.glow}for(let C=y;C<Se.length;C++)Se[C].visible=!1}const wt={uL:{value:new B(.4,1,-.2).normalize()},uCut:{value:.16},uC1:{value:new X(z.shadow1)},uC2:{value:new X(z.shadow2)}},Ae=[],xt=[];l.shadowVerts=0;const Be=new tt;if(Be.name="v3r7-fx-shadow",t.add(Be),a.shadow){const S=new re({name:"fx-shadow",uniforms:wt,vertexShader:Yo,fragmentShader:Go});for(const y of o){const C=zt(y.geometry,a.shadowCell,!0);l.shadowVerts+=C.attributes.position.count;const u=new It(C,S);u.bind(y.skeleton,y.bindMatrix),u.frustumCulled=!1,u.renderOrder=-2,u.raycast=()=>{},Be.add(u),Ae.push(u)}n.head?.traverse(y=>{if(y.isMesh&&y.name.startsWith("hair")&&!y.userData.__outline){const C=zt(y.geometry,a.shadowCell,!1);l.shadowVerts+=C.attributes.position.count;const u=new fe(C,S);u.matrixAutoUpdate=!1,u.frustumCulled=!1,u.renderOrder=-2,u.raycast=()=>{},Be.add(u),Ae.push(u),xt.push([u,y])}})}const Zt=new B(-.45,.75,.55);function $t(S){const y=wt.uL.value.copy(Zt).applyQuaternion(S.quaternion);if(y.y=Math.max(y.y,.2),y.normalize(),y.y<.62){const C=Math.hypot(y.x,y.z),u=Math.sqrt(1-.62*.62)/(C||1);y.set(y.x*u,.62,y.z*u)}}let yt=null;const bt=t.onBeforeRender;return t.onBeforeRender=(S,y,C,u)=>{bt&&bt.call(t,S,y,C,u);const W=p(),v=s();if(v&&v!==se&&v.length===d&&J(v),Ae.length){$t(C);for(const[L,F]of xt)L.matrix.copy(F.matrixWorld),L.matrixWorld.copy(F.matrixWorld)}const P=W!=null;if(e.visible=P,!P)return;const T=W/I;jt(T,C,S);for(const L of gt)L.mesh.visible=a.spark;a.spark&&Yt(T,C),a.ring?Gt(T):Se.forEach(L=>L.visible=!1),yt=W},l.casters=Ae.length,l.shadowTris=Ae.reduce((S,y)=>S+y.geometry.index.count/3,0),l.group=e,l.debug=()=>({last:yt,speed:{left:Array.from(j.left),right:Array.from(j.right)},paths:{left:Array.from(D.left),right:Array.from(D.right)}}),l}const et=[[1,0,0],[-1,0,0],[0,1,0],[0,-1,0],[0,0,1],[0,0,-1],...[-1,1].flatMap(t=>[-1,1].flatMap(c=>[-1,1].map(n=>[t,c,n])))];function $o(t){const{position:c,skinIndex:n,skinWeight:b}=t.geometry.attributes,M=new Map;for(let A=0;A<c.count;A++){let p=0;if(b)for(let f=1;f<4;f++)b.getComponent(A,f)>b.getComponent(A,p)&&(p=f);const s=n?.getComponent(A,p)??0;M.has(s)||M.set(s,et.map(()=>({value:-1/0,index:0})));const k=M.get(s),w=c.getX(A),a=c.getY(A),z=c.getZ(A);for(let f=0;f<et.length;f++){const[d,I,h]=et[f],_=w*d+a*I+z*h,i=k[f];_>i.value&&(i.value=_,i.index=A)}}return[...new Set([...M.values()].flatMap(A=>A.map(p=>p.index)))]}function Qo(t,c,n){const b=t.slice();c.traverse(s=>{s.isMesh&&!s.userData.__outline&&b.push(s)});const M=b.map(s=>[s,$o(s)]),A=new B,p=Math.tan(De.degToRad(n)/2);return(s,k,w)=>{s.clearViewOffset(),s.aspect=1,s.fov=n,s.updateProjectionMatrix(),s.updateMatrixWorld(!0);let a=1/0,z=-1/0,f=1/0,d=-1/0;for(const[m,e]of M)for(const o of e)m.getVertexPosition(o,A).applyMatrix4(m.matrixWorld).project(s),a=Math.min(a,A.x),z=Math.max(z,A.x),f=Math.min(f,A.y),d=Math.max(d,A.y);const I=Math.min(k,w)/2,h=z-a+.065,_=d-f+.045,i=Math.min(.94*k/(h*I),.55*w/(_*I),2.15),R=I*i;s.fov=De.radToDeg(2*Math.atan(p*w/(2*R))),s.setViewOffset(k,w,(a+z)*R/2,-(f+d)*R/2,k,w)}}const qe={spineLower:"pelvis",spineUpper:"spineLower",torso:"spineUpper",neck:"torso",head:"neck"};for(const t of["left","right"]){Object.assign(qe,{[t+"Scapula"]:"torso",[t+"UpperArm"]:t+"Scapula",[t+"Forearm"]:t+"UpperArm",[t+"Hand"]:t+"Forearm",[t+"Thigh"]:"pelvis",[t+"Shin"]:t+"Thigh",[t+"Patella"]:t+"Shin",[t+"Foot"]:t+"Shin"});for(let c=1;c<=6;c++)qe[t+"ForearmTwist"+c]=t+"Forearm";for(let c=1;c<=2;c++)qe[t+"WristBend"+c]=t+"Forearm"}const Ct=t=>new URL("./v5/"+t,document.baseURI).href,Ko=new B(0,1,0);async function Jo(t){const[c,n]=await Promise.all([new Rt().setMeshoptDecoder(lo).loadAsync(Ct("coach-v3r3-wristfix.glb")),fetch(Ct("flare-arm8legs-v3r3.json")).then(e=>{if(!e.ok)throw Error("V5 motion load failed");return e.json()})]),b=new co,M=new Tt(30,1,.05,50),A=new fe(new fo(2,48).rotateX(-Math.PI/2));b.add(c.scene,A);const p=c.scene,s={},k=[];p.updateMatrixWorld(!0),p.traverse(e=>{if(e.isBone&&(s[e.name]=e),e.isSkinnedMesh){if(!e.geometry.getAttribute("_region"))throw Error("V5 mesh has no material regions");e.geometry.deleteAttribute("color"),k.push(e),e.frustumCulled=!1}});for(const[e,o]of Object.entries(qe)){if(!s[e]||!s[o])throw Error("V5 rig missing "+e);s[o].attach(s[e])}for(const e of Object.values(s))e.quaternion.identity();p.updateMatrixWorld(!0);const w=po({bones:s,renderer:t});await Po({scene:b,root:p,bones:s,skinned:k,floor:A,renderer:t,camera:M}).hairReady;const z=s.head.getObjectByName("hair-spiky");if(!w||!z)throw Error("V5 wrist or hair unavailable");const f=new B().fromArray(n.cams.v0.t),d=new B().fromArray(n.cams.v0.p).sub(f),I=Object.keys(n.frames[0].q),h=Qo(k,z,n.cams.v0.f);let _=0,i=!0;function R(e){const o=n.frames[e];for(const l of I)s[l].quaternion.fromArray(o.q[l]).normalize();s.pelvis.position.fromArray(o.p)}R(_),Zo({scene:b,root:p,bones:s,skinned:k,renderer:t,anim:n,jointIds:I,getFrame:()=>i?_:null,getFrames:()=>n.frames});const m=new Lt;return{period:n.count/n.fps,render(e,{fxEnabled:o=!0,yaw:l=0}={}){_=Math.min(n.count-1,Math.floor((e%1+1)%1*n.count)),i=o,R(_),p.updateMatrixWorld(!0),t.getSize(m),M.position.copy(d).applyAxisAngle(Ko,l).add(f),M.lookAt(f),h(M,Math.max(1,m.x),Math.max(1,m.y)),t.render(b,M)},dispose(){const e=new Set;b.traverse(o=>{if(o.geometry&&e.add(o.geometry),o.material)for(const l of[].concat(o.material))e.add(l);o.skeleton&&e.add(o.skeleton)});for(const o of e)o.dispose()}}}const en=[.25,.5,1];let Ie=1,de,ye,Te,He,Pe=0,st=.5,qt=0,he=null,ie=!1,Ye=!0,Ht=!0,We=0,Pt=-1/0;function ge(t,c={}){const n={source:"flare-scene",type:t,time:Pe,period:Ie,speed:st,playing:ie,...c};window.FlareHost?.postMessage?window.FlareHost.postMessage(JSON.stringify(n)):window.parent!==window&&window.parent.postMessage(n,window.location.origin)}function be(){ye&&Ye&&!document.hidden&&!Te&&(Te=requestAnimationFrame(tn))}function tn(t){Te=null,!(!Ye||document.hidden)&&(ie&&We&&(Pe=(Pe+(t-We)*.001*st)%Ie),We=t,ye.render(Pe/Ie,{fxEnabled:Ht,yaw:qt}),He!=null&&(ge("presented",{requestId:He}),He=null),ie&&t-Pt>=100&&(Pt=t,ge("state")),ie&&be())}function Ut(t){switch(t?.type){case"play":ie=!0,We=0;break;case"pause":ie=!1;break;case"seek":if(!Number.isFinite(t.time))return;ie=!1,Pe=Math.max(0,Math.min(t.time,Ie-1/120));break;case"speed":en.includes(t.value)&&(st=t.value);break;case"fx":Ht=t.value===!0;break;case"visibility":Ye=t.visible===!0,Ye||(ie=!1);break;case"present":He=t.requestId;break;default:return}be(),ye&&t.type!=="present"&&ge("state")}window.flareBridge=Object.freeze({command:Ut});window.addEventListener("message",t=>{t.source===window.parent&&t.origin===window.location.origin&&t.data?.source==="flare-host"&&Ut(t.data.command)});function Wt(){de.setPixelRatio(Math.min(window.devicePixelRatio||1,2)),de.setSize(window.innerWidth,window.innerHeight,!1),be()}async function on(){try{de=new uo({antialias:!0}),de.outputColorSpace=mo;const t=de.getContext();"drawingBufferColorSpace"in t&&(t.drawingBufferColorSpace="srgb");const c=de.domElement;document.body.append(c),c.addEventListener("webglcontextlost",n=>{n.preventDefault(),ie=!1,ge("error",{errorCode:"graphics_context_lost"})}),c.addEventListener("pointerdown",n=>{he||(c.setPointerCapture(n.pointerId),he={id:n.pointerId,x:n.clientX})}),c.addEventListener("pointermove",n=>{he?.id===n.pointerId&&(qt+=(he.x-n.clientX)*.01,he.x=n.clientX,be())}),c.addEventListener("lostpointercapture",n=>{he?.id===n.pointerId&&(he=null)}),Wt(),ye=await Jo(de),Ie=ye.period,window.addEventListener("resize",Wt),document.addEventListener("visibilitychange",()=>{document.hidden?(ie=!1,ge("state")):(We=0,be())}),window.addEventListener("pagehide",n=>{n.persisted||(Te&&cancelAnimationFrame(Te),ye.dispose(),de.dispose())}),ge("ready"),be()}catch(t){console.error(t),ge("error",{errorCode:"scene-load-failed"})}}on();
