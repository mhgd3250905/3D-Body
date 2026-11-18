import{Q as ne,l as X,h as Ze,V as O,k as Q,N as re,e as Xe,ad as Wt,q as It,_ as it,g as fe,ae as Qt,af as Kt,o as De,D as Tt,$ as Jt,G as Nt,n as ot,a7 as Ee,a as Rt,a8 as eo,v as to,a6 as oo,ag as ao,ab as no,ah as ro,ac as io,p as bt,ai as so,b as je,j as lo,c as co,aj as fo,W as uo,r as mo}from"./meshopt_decoder.module-BxcarpM8.js";function po({bones:t,renderer:l}){const i=["left","right"].filter(h=>t[h+"ForearmTwist1"]&&t[h+"Hand"]&&t[h+"Forearm"]);if(!i.length)return null;const S={};for(const h of i){const e=t[h+"Forearm"],o=t[h+"Hand"],r=[],u=[];for(let a=1;t[h+"ForearmTwist"+a];a++)r.push(t[h+"ForearmTwist"+a]);for(let a=1;t[h+"WristBend"+a];a++)u.push(t[h+"WristBend"+a]);for(const a of[...r,...u])a.parent!==e&&e.attach(a);S[h]={a:o.position.clone().normalize(),fa:e,hand:o,tw:r,bd:u,prev:null,snapF:new ne,snapH:new ne}}const y=new ne,N=new ne,x=new ne,f=new ne,_=new ne,A=new ne,n={theta:{},swing:{},wraps:0,seeks:0,hubUndone:0},P=1.5*Math.PI,b=Math.PI/2;function g(){for(const h of i){const e=S[h],o=e.a;f.copy(e.hand.quaternion).normalize(),f.w<0&&f.set(-f.x,-f.y,-f.z,-f.w);const r=2*Math.atan2(f.x*o.x+f.y*o.y+f.z*o.z,f.w);let u=r;if(e.prev!=null){for(;u-e.prev>Math.PI;)u-=2*Math.PI;for(;u-e.prev<-Math.PI;)u+=2*Math.PI;Math.abs(u-e.prev)>b?(u=r,n.seeks++):Math.abs(u)>P&&(u=r,n.wraps++)}e.prev=u,y.setFromAxisAngle(o,u),N.copy(y).invert(),x.copy(f).multiply(N);const a=e.tw.length,d=e.bd.length+1;e.tw.forEach((T,B)=>T.quaternion.setFromAxisAngle(o,u*(B+1)/a)),e.bd.forEach((T,B)=>T.quaternion.copy(_).slerp(x,(B+1)/d).multiply(y)),n.theta[h]=+(u*180/Math.PI).toFixed(1),n.swing[h]=+(2*Math.acos(Math.min(1,Math.abs(x.w)))*180/Math.PI).toFixed(1)}}const W=()=>{const h=window.__drill;return!!(h&&(h.__wristTwistR5||h.__wristTwistR6)&&window.__wristTwistStats)};function v(){for(const h of i){const e=S[h];if(!e.fa.quaternion.equals(e.snapF)||!e.hand.quaternion.equals(e.snapH))e.fa.quaternion.copy(e.snapF),e.hand.quaternion.copy(e.snapH),n.hubUndone++;else{const o=(window.__wristTwistStats.applied?.[h]||0)*Math.PI/180;if(!o)continue;A.setFromAxisAngle(e.a,o),e.fa.quaternion.multiply(N.copy(A).invert()),e.hand.quaternion.premultiply(A),n.hubUndone++}}}let C=!1;function s(h){const e=h.onBeforeRender;h.onBeforeRender=function(...o){h.onBeforeRender=e;try{if(C){C=!1,W()&&v(),g();for(const r of i)S[r].fa.updateMatrixWorld(!0)}}finally{return e.apply(this,o)}}}const L=l.render.bind(l);return l.render=function(h,e){if(!W())return g(),L(h,e);for(const o of i)S[o].snapF.copy(S[o].fa.quaternion),S[o].snapH.copy(S[o].hand.quaternion);C=!0,s(h);try{return L(h,e)}finally{C=!1}},{update:g,stats:n,sides:i}}const at={base:["#f7d9c4","#3f6fd8","#2b2f45","#f3f1ee"],shade:["#d99a8e","#2a3f8f","#1a1c2e","#b9b3c4"]},Y=new URLSearchParams("hair=spiky"),Lt={default:{base:at.base,shade:at.shade,sock:null,cap:["#d8343a","#8e1d2c"]},mono:{base:["#f7d9c4","#f2f0ec","#26242c","#2a2830"],shade:["#d99a8e","#b6b0c2","#121016","#141219"],sock:["#f2f0ec","#b6b0c2"],cap:["#2a2830","#141219"]},redblack:{base:["#f7d9c4","#d8343a","#26242c","#d8343a"],shade:["#d99a8e","#8e1d2c","#121016","#8e1d2c"],sock:["#26242c","#121016"],cap:["#26242c","#121016"]}},Mt={black:["#363044","#18141f","#6f6c8e"],brown:["#5a3a2c","#2c1a16","#a77a5e"]},Ce=["spiky","mid","beanie"].includes(Y.get("hair"))?Y.get("hair"):"none",St=Lt[Y.get("outfit")]?Y.get("outfit"):"default",ve=Y.get("ol")!=="0",Ge=Y.get("rim")==="1",He=(()=>{const t=Y.get("tsm");return t!=null&&isFinite(+t)?Math.max(0,Math.round(+t)):48})(),Ke=(t,l)=>Y.has(t)&&isFinite(+Y.get(t))?+Y.get(t):l,Z={frac:Ke("olw",.0048),k:Ke("olk",.5),refP11:1/Math.tan(15*Math.PI/180),refZ:4.95,push:Ke("olpush",.012),hand:.5,head:.7,shoe:.8,hair:.78,ink:"#2a1d33",hairInk:"#1a1430"},Bt="#2b2230",ho=.0045,vo="#231c26",go="#f4efe6",me=0,_e=1,Je=2,At=3,wo=["Coach_Body","Coach_Shoe_Details","Coach_Sneakers","Coach_Soles","Coach_Training_Shorts","Mesh005","Mesh005_1","V2P_Base_Limbs","V3_Head_Neck_Torso_Shared_R26","V2P_Base_Hands"],xo=.305,kt=1,yo=`
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
}`,Ot=`
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
${Ot}
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
}`,Et=()=>({uF:{value:Z.frac},uW0:{value:Z.frac/(Z.refP11/(2*Z.refZ))},uK:{value:Z.k},uPush:{value:Z.push}});function et(t=at){return new re({...ve?{defines:Ge?{STYLE2:"",RIM:""}:{STYLE2:"",...He>0?{TOONN:""}:{}}}:{},name:"toon3r2",uniforms:{uBase:{value:t.base.map(l=>new X(l))},uShade:{value:t.shade.map(l=>new X(l))},uLight:{value:new O(-.45,.75,.55)}},vertexShader:yo,fragmentShader:bo})}function ko(t){const i=new Array(24).fill(-9),S=new Array(24).fill(0);let y=0;for(const x of t)y+=x.z;y/=t.length;for(const x of t){const f=Math.floor((Math.atan2(x.x,x.z-y)/Math.PI+1)/2*24)%24,_=Math.hypot(x.x,x.z-y);i[f]=Math.max(i[f],x.y),S[f]=Math.max(S[f],_)}const N=(x,f)=>{const _=(Math.atan2(f.x,f.z-y)/Math.PI+1)/2*24-.5,A=Math.floor(_),n=_-A,P=(A%24+24)%24,b=(P+1)%24;return x[P]*(1-n)+x[b]*n};return{zc:y,top:x=>N(i,x),rad:x=>N(S,x)}}const ae=t=>{const l=[0,0,0,0];return l[t]=1,l},Ve=(t,l,i)=>{const S=Math.min(1,Math.max(0,.5+i/.02)),y=[0,0,0,0];return y[t]+=1-S,y[l]+=S,y};function Fo(t,l,i,S){if(t===1||t===2||t===3)return ae(At);if(t===5||t===6)return ae(_e);if(t===9)return ae(me);if(/Foot/.test(l))return ae(At);if(/Hand|Forearm/.test(l))return ae(me);if(/Thigh|Shin|Patella/.test(l))return ae(Je);if(t===4)return Ve(_e,Je,kt-i.y);if(l==="head")return ae(me);if(S){if(Math.hypot(i.x,i.z-S.zc)<S.rad(i)+.005)return Ve(_e,me,i.y-S.top(i)-.002);if(l==="neck")return ae(me)}else if(l==="neck")return ae(me);return/UpperArm|Scapula/.test(l)?Ve(_e,me,Math.abs(i.x)-xo):Ve(_e,Je,kt-i.y)}function Ft(t,l){const i=t.skeleton,S=i.bones.findIndex(y=>y.name===l);return new it().multiplyMatrices(i.bones[S].matrixWorld,i.boneInverses[S]).multiply(t.bindMatrix)}function rt(t,l=12){const i=t.attributes.position,S=i.count,y=new O,N=e=>(y.fromBufferAttribute(i,e),Math.round(y.x*2e4)+","+Math.round(y.y*2e4)+","+Math.round(y.z*2e4)),x=new Map,f=new Int32Array(S);for(let e=0;e<S;e++){const o=N(e);x.has(o)||x.set(o,x.size),f[e]=x.get(o)}const _=new Float32Array(x.size*3),A=t.index?t.index.array:null,n=A?A.length:S,P=new O,b=new O,g=new O;for(let e=0;e<n;e+=3){const o=A?A[e]:e,r=A?A[e+1]:e+1,u=A?A[e+2]:e+2;P.fromBufferAttribute(i,o),b.fromBufferAttribute(i,r),g.fromBufferAttribute(i,u),g.sub(b),P.sub(b),g.cross(P);for(const a of[o,r,u]){const d=f[a]*3;_[d]+=g.x,_[d+1]+=g.y,_[d+2]+=g.z}}const W=x.size,v=[],C=new Int32Array(W+1);{const e=Array.from({length:W},()=>new Set);for(let o=0;o<n;o+=3){const r=f[A?A[o]:o],u=f[A?A[o+1]:o+1],a=f[A?A[o+2]:o+2];e[r].add(u).add(a),e[u].add(r).add(a),e[a].add(r).add(u)}for(let o=0;o<W;o++){C[o+1]=C[o]+e[o].size;for(const r of e[o])v.push(r)}}let s=new Float32Array(_),L=new Float32Array(W*3);for(let e=0;e<W;e++){const o=Math.hypot(s[3*e],s[3*e+1],s[3*e+2])||1;s[3*e]/=o,s[3*e+1]/=o,s[3*e+2]/=o}for(let e=0;e<l;e++){for(let o=0;o<W;o++){let r=s[3*o],u=s[3*o+1],a=s[3*o+2];for(let T=C[o];T<C[o+1];T++){const B=v[T];r+=s[3*B],u+=s[3*B+1],a+=s[3*B+2]}const d=Math.hypot(r,u,a)||1;L[3*o]=r/d,L[3*o+1]=u/d,L[3*o+2]=a/d}[s,L]=[L,s]}const h=t.attributes.normal;for(let e=0;e<S;e++){const o=f[e]*3;h.setXYZ(e,s[o],s[o+1],s[o+2])}h.needsUpdate=!0}function _o(t,l,i){const S=t.skeleton,y=S.bones.indexOf(l),N=new it().multiplyMatrices(S.boneInverses[y],t.bindMatrix),x=N.clone().invert(),f=t.geometry,_=f.attributes.position;f.attributes.normal;const A=_.count,n=new O,P=[];for(let a=0;a<A;a++)P.push(n.fromBufferAttribute(_,a).applyMatrix4(N).clone());const b=(a,d,T)=>{const B=Math.min(1,Math.max(0,(T-a)/(d-a)));return B*B*(3-2*B)},g=P.map(a=>a.z<.06?0:(1-b(i.hx,i.hx+i.f,Math.abs(a.x)))*b(i.y0-i.f,i.y0,a.y)*(1-b(i.y1,i.y1+i.f,a.y))),W=a=>Math.round(a.x*1e5)+","+Math.round(a.y*1e5)+","+Math.round(a.z*1e5),v=new Map,C=[];for(let a=0;a<A;a++){const d=W(P[a]);v.has(d)||v.set(d,v.size),C.push(v.get(d))}const s=v.size,L=new Array(s),h=new Float32Array(s),e=Array.from({length:s},()=>new Set);for(let a=0;a<A;a++)L[C[a]]=P[a].clone(),h[C[a]]=Math.max(h[C[a]],g[a]);const o=f.index?f.index.array:null,r=o?o.length:A;for(let a=0;a<r;a+=3){const d=C[o?o[a]:a],T=C[o?o[a+1]:a+1],B=C[o?o[a+2]:a+2];e[d].add(T).add(B),e[T].add(d).add(B),e[B].add(d).add(T)}let u=0;for(let a=0;a<s;a++)h[a]>0&&u++;for(let a=0;a<i.iters;a++){const d=L.map(T=>T.clone());for(let T=0;T<s;T++){if(!(h[T]>0))continue;const B=new O;for(const $ of e[T])B.add(L[$]);B.multiplyScalar(1/e[T].size),d[T].lerp(B,.6*h[T])}for(let T=0;T<s;T++)L[T]=d[T]}for(let a=0;a<A;a++)h[C[a]]>0&&(n.copy(L[C[a]]).applyMatrix4(x),_.setXYZ(a,n.x,n.y,n.z));return _.needsUpdate=!0,rt(f),f.computeBoundingSphere(),{verts:A,welded:s,active:u}}function zo(t,l){const i=t.skeleton,S=i.bones.indexOf(l),y=new it().multiplyMatrices(i.boneInverses[S],t.bindMatrix),N=new De,x=t.geometry.attributes.position,f=new Float32Array(x.count*3),_=new O;for(let P=0;P<x.count;P++)_.fromBufferAttribute(x,P).applyMatrix4(y),f.set([_.x,_.y,_.z],3*P);N.setAttribute("position",new Q(f,3)),N.setIndex(t.geometry.index),N.computeBoundingSphere();const A=new fe(N,new Ze({side:Tt}));A.updateMatrixWorld(!0);const n=new Jt;return(P,b)=>{n.set(new O(P,b,.4),new O(0,0,-1));const g=n.intersectObject(A,!1)[0];return g?g.point.z:null}}function Co(t,l){const i=new Ze({color:vo}),S={eyes:[],brows:[]};for(const n of[-1,1]){const P=n*.032,b=.069,g=l(P,b),W=new fe(new Qt(1,24,16),i);W.position.set(P,b,g!=null?g+.002:.1045),W.quaternion.set(-.020044549351510503,0,0,.9997990878377991),W.scale.set(.00819,.013125,.00315),W.userData.__face=!0,t.add(W),S.eyes.push({p:W.position.toArray().map(v=>+v.toFixed(4)),surf:g})}const y=.0105,N=.046,x=.104,f=.034,_=.004,A=6;for(const n of[-1,1]){const P=n*f,b=new Kt(y/2,N-y,6,12);b.rotateZ(Math.PI/2),b.scale(1,1,.25);const g=[-y/2,0,y/2].map(s=>Array.from({length:A+1},(L,h)=>l(P-N/2-.002+(N+.004)*h/A,x+s))),W=(s,L)=>{const h=Math.min(A,Math.max(0,(s+N/2+.002)/(N+.004)*A)),e=Math.min(A-1,Math.floor(h)),o=h-e,r=Math.min(2,Math.max(0,(L+y/2)/(y/2))),u=Math.min(1,Math.floor(r)),a=r-u,d=T=>(g[T][e]??.1)*(1-o)+(g[T][e+1]??.1)*o;return d(u)*(1-a)+d(u+1)*a},v=b.attributes.position;for(let s=0;s<v.count;s++){const L=v.getX(s),h=Math.max(W(L,-y/2),W(L,0),W(L,y/2));v.setZ(s,v.getZ(s)+h+_)}v.needsUpdate=!0,b.computeVertexNormals();const C=new fe(b,i);C.position.set(P,x,0),C.userData.__face=!0,t.add(C),S.brows.push({xc:P,z:g[1].map(s=>s==null?null:+s.toFixed(4))})}return S}function Po({scene:t,root:l,bones:i,skinned:S,grid:y,floor:N,renderer:x,camera:f}){l.updateMatrixWorld(!0);const _={prims:[],counts:[0,0,0,0]};t.background=new X(go),y&&y.removeFromParent(),N&&(N.material=new Ze({color:15129805,transparent:!0,opacity:.6}));const A=i.head,n=S.slice(),P=new Map(n.map((e,o)=>[e,o]));let b=null;{const e=n[5];if(e){const o=Ft(e,"torso"),r=e.geometry.attributes.position,u=new O,a=[];for(let d=0;d<r.count;d++)a.push(u.fromBufferAttribute(r,d).applyMatrix4(o).clone());b=ko(a)}}const g=Lt[St],W=et(g),v=et(g);v.defines={...v.defines||{},INFLATE:"0.0015"};let C=null;g.sock&&(C=et({base:g.base.map((e,o)=>o===3?g.sock[0]:e),shade:g.shade.map((e,o)=>o===3?g.sock[1]:e)})),_.outfit=St,_.hair=Ce;for(const e of n){const o=P.get(e),r=e.geometry,u=r.attributes.position,a=r.attributes.skinIndex,d=r.attributes.skinWeight,T=Ft(e,"pelvis"),B=new O,$=new Float32Array(u.count*4),V=e.skeleton.bones.map(q=>q.name);for(let q=0;q<u.count;q++){let j=0,G=-1;for(let J=0;J<4;J++){const Me=d.getComponent(q,J);Me>G&&(G=Me,j=a.getComponent(q,J))}B.fromBufferAttribute(u,q).applyMatrix4(T);const se=r.attributes._region,K=se?ae(Math.round(se.getX(q))):Fo(o,V[j],B,b);$.set(K,4*q),_.counts[K.indexOf(Math.max(...K))]++}r.setAttribute("toonW",new Q($,4)),rt(r);const D=e.material&&e.material.name;e.material=!r.attributes._region&&(o===5||o===6)?v:C&&D==="sock"?C:W,_.prims.push({prim:o,name:wo[o],verts:u.count})}const s=n.find(e=>e.geometry.attributes._region&&e.name.includes("skin"))||n.find(e=>e.geometry.attributes._region&&Math.round(e.geometry.attributes._region.getX(0))===0&&e.geometry.attributes.position.count>2e4)||n[8];s&&A&&(_.faceFix=_o(s,A,{hx:.026,y0:-.036,y1:.045,f:.012,iters:60}),_.face=Co(A,zo(s,A)));const L=performance.now();if(ve&&!Ge&&He>0)for(const e of n){const o=e.geometry,r=o.attributes.normal,u=new Float32Array(r.count*3);for(let d=0;d<r.count;d++)u[3*d]=r.getX(d),u[3*d+1]=r.getY(d),u[3*d+2]=r.getZ(d);rt(o,12+He);const a=new Float32Array(r.count*3);for(let d=0;d<r.count;d++)a[3*d]=r.getX(d),a[3*d+1]=r.getY(d),a[3*d+2]=r.getZ(d),r.setXYZ(d,u[3*d],u[3*d+1],u[3*d+2]);r.needsUpdate=!0,o.setAttribute("toonN",new Q(a,3))}_.toonN={iters:ve&&!Ge?He:0,ms:+(performance.now()-L).toFixed(0)};const h=ve?new re({name:"toon-outline-r2",uniforms:{...Et(),uShade:{value:g.shade.map(e=>new X(e))},uInk:{value:new X(Z.ink)}},vertexShader:So,fragmentShader:Ao,side:Xe}):new re({name:"toon3r2-outline",uniforms:{uColor:{value:new X(Bt)}},vertexShader:Mo,fragmentShader:nt,side:Xe});if(ve)for(const e of n){const o=e.geometry,r=o.attributes.skinIndex,u=o.attributes.skinWeight,a=o.attributes._region,d=r.count,T=new Float32Array(d),B=e.skeleton.bones.map(V=>V.name),$=B.filter(V=>/^leftWristBend\d+$/.test(V)).length+1;for(let V=0;V<d;V++){let D=0,q=0;for(let G=0;G<4;G++){const se=B[r.getComponent(V,G)],K=u.getComponent(V,G);let J;/Hand$/.test(se)?D+=K:(J=/WristBend(\d+)$/.exec(se))?D+=K*+J[1]/$:se==="head"&&(q+=K)}const j=a?Math.round(a.getX(V))===3:!1;T[V]=Math.min(j?Z.shoe:1,1+(Z.hand-1)*Math.min(1,D*1.2),1+(Z.head-1)*Math.min(1,q*1.2))}o.setAttribute("olW",new Q(T,1))}for(const e of n){const o=new Wt(e.geometry,h);o.bind(e.skeleton,e.bindMatrix),o.userData.__outline=!0,o.frustumCulled=!1,o.renderOrder=-1,o.raycast=()=>{},e.add(o)}return _.outlines=n.length,_.faceSnap=(e=0,o=500,r=500,u)=>{l.updateMatrixWorld(!0);const a=A.getWorldPosition(new O),d=A.getWorldQuaternion(new ne),T=new O(0,.07,.03).applyQuaternion(d).add(a),B=new O(e,.05,1).applyQuaternion(d).normalize(),$=new O(0,1,0).applyQuaternion(d),V=new It(12,o/r,.05,50);V.up.copy($),V.position.copy(T).addScaledVector(B,1.6),V.lookAt(T),V.updateMatrixWorld();const D=x.domElement.width,q=x.domElement.height,j=x.getPixelRatio();x.setPixelRatio(1),x.setSize(o,r,!1),u&&u(!0),x.render(t,V);const G=x.domElement.toDataURL("image/png");return u&&u(!1),x.setPixelRatio(j),x.setSize(D/j,q/j,!1),G},Ce!=="none"&&A&&(_.hairReady=Lo(A,_,g)),_}const Wo=`
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
${Ot}
void main() { gl_Position = ol2Clip(modelViewMatrix * vec4(position, 1.0), normalize(normalMatrix * _oln), ${Z.hair.toFixed(3)}); }`,Ro=`
attribute vec3 _oln;
void main() { gl_Position = projectionMatrix * modelViewMatrix * vec4(position + normalize(_oln) * ${To.toFixed(4)}, 1.0); }`;async function Lo(t,l,i){const S=await new Nt().loadAsync(new URL("./v5/hair-v3r5.glb",document.baseURI).href),y=Mt[Y.get("hairc")]||Mt.black,N=/^[0-9a-f]{6}$/i.test(Y.get("cap")||"")?["#"+Y.get("cap"),"#"+new X("#"+Y.get("cap")).multiplyScalar(.55).getHexString()]:i.cap,x=new O(-.45,.75,.55),f=(b,g,W,v)=>new re({name:"toon-hair",...ve&&!Ge?{defines:{NORIM:""}}:{},uniforms:{uBase:{value:new X(b)},uShade:{value:new X(g)},uHi:{value:new X(W)},uLight:{value:x},uRib:{value:v}},vertexShader:Wo,fragmentShader:Io}),_={hair:f(y[0],y[1],y[2],0),beanie:f(N[0],N[1],N[0],46)},A=ve?new re({name:"toon-hair-outline-r2",uniforms:{...Et(),uColor:{value:new X(Z.hairInk)}},vertexShader:No,fragmentShader:nt,side:Xe}):new re({name:"toon-hair-outline",uniforms:{uColor:{value:new X(Bt)}},vertexShader:Ro,fragmentShader:nt,side:Xe}),n=new ot;n.name="hair-"+Ce,n.userData.__hair=!0;const P={style:Ce,meshes:[]};return S.scene.traverse(b=>{if(!b.isMesh||(b.parent&&b.parent.name.startsWith("hair_")?b.parent.name:b.name).replace(/^hair_/,"").replace(/_\d+$/,"")!==Ce)return;const W=b.material.userData&&b.material.userData.region||b.material.name,v=new fe(b.geometry,_[W]||_.hair);v.name=b.name,v.userData.region=W,v.frustumCulled=!1,v.raycast=()=>{};const C=new fe(b.geometry,A);C.userData.__outline=!0,C.frustumCulled=!1,C.renderOrder=-1,C.raycast=()=>{},v.add(C),n.add(v),P.meshes.push({name:b.name,region:W,verts:b.geometry.attributes.position.count,tris:b.geometry.index.count/3})}),t.add(n),l.hairInfo=P,P}const tt=new URLSearchParams,ce=(t,l)=>tt.has(t)&&isFinite(+tt.get(t))?+tt.get(t):l,Bo={samples:720,trailSeconds:.95,segments:56,rippleSeconds:.9,refTurn:8.991662288,width:.024,motes:18,moteLife:.8,plantDrop:.025,plantDelay:6,ripples:4,old:ce("fxold",0)===1,halo:2.8,wide:ce("fxwide",1.6),glow:ce("fxglow",1),flick:ce("fxflick",1),core:ce("fxcore",1),shadow:ce("fxshadow",1)!==0,ring:ce("fxring",1)!==0,spark:ce("fxspark",1)!==0,shadowCell:ce("fxcell",.022),palette:{head:"#ff8a3a",mid:"#ff6a55",tail:"#ff8f9a",ripple:"#ff9348",gold:"#ffe6a8"},colors:{core:"#fffaf2",ink:"#3a1f3c",ringInk:"#b8462a",shadow1:"#d9cbbd",shadow2:"#c3b2a5"}},Oo=`
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
  }`,Eo=`
  uniform float uOpacity; uniform float uProgress; uniform vec3 uColor; varying vec2 vUv;
  void main() {
    float r = length(vUv - 0.5) * 2.0; float ring = uProgress * 0.92 + 0.06; float w = 0.05 + 0.05 * uProgress;
    float band = exp(-pow((r - ring) / w, 2.0));
    float glow = exp(-pow(r / max(ring, 0.05), 2.0) * 3.0) * 0.18 * (1.0 - uProgress);
    float a = uOpacity * (band * 0.85 + glow) * pow(1.0 - uProgress, 1.4);
    gl_FragColor = vec4(uColor, a);
    #include <colorspace_fragment>
  }`,Vo=`uniform float uOpacity; uniform vec3 uHead; uniform vec3 uTail; uniform vec3 uCore; uniform vec3 uEdge; varying float vAge;
  void main(){ vec2 q = gl_PointCoord - 0.5; float d = length(q) * 2.0; if (d > 1.0) discard;
    float a = uOpacity * pow(1.0 - vAge, 2.0) * exp(-d * d * 4.0);
    gl_FragColor = vec4(mix(uHead, uTail, vAge) * 1.4 + 0.25, a);
    #include <colorspace_fragment>
  }`,Ho=`
attribute float aAge; attribute float aSide; attribute float aSpeed;
varying float vAge; varying float vSide; varying float vSpeed;
void main(){ vAge = aAge; vSide = aSide; vSpeed = aSpeed; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }`,qo=`
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
${qo}
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
  gl_PointSize = aAge >= 1.0 ? 0.0 : aSize * uStar * (1.0 - 0.6 * aAge) * uScale / max(0.1, -mv.z); }`,Do=`uniform float uOpacity; uniform vec3 uHead; uniform vec3 uMid; uniform vec3 uTail; uniform vec3 uCore; uniform vec3 uEdge; uniform float uSeed; varying float vAge;
vec3 toS(vec3 c){ return pow(max(c, 0.0), vec3(1.0 / 2.2)); }
void main(){ if (vAge >= 1.0) discard; vec2 q = (gl_PointCoord - 0.5) * 2.0; float r = length(q); if (r > 1.0) discard;
  // 柔光点：高斯光斑 + 很淡的四向细芒，无描边
  float spot = exp(-r * r * 9.0);
  float ray = exp(-abs(q.x) * 18.0) * exp(-abs(q.y) * 2.6) + exp(-abs(q.y) * 18.0) * exp(-abs(q.x) * 2.6);
  float k = pow(1.0 - vAge, 2.0) * uOpacity;
  float i = k * (spot + 0.35 * ray * (1.0 - r));
  vec3 c = toS(mix(uCore, mix(uHead, uMid, vAge * 0.6), smoothstep(0.0, 0.5, r)));
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
}`,Yo=`
uniform vec3 uC1; uniform vec3 uC2; uniform float uCut; varying float vH;
void main(){ gl_FragColor = vec4(vH < uCut ? uC2 : uC1, 1.0);
  #include <colorspace_fragment>
}`;function _t(t,l,i){const S=t.attributes.position,y=S.count,N=new Int32Array(y),x=new Map,f=[],_=[],A=[],n=[],P=t.attributes.skinIndex,b=t.attributes.skinWeight;for(let s=0;s<y;s++){const L=S.getX(s),h=S.getY(s),e=S.getZ(s),o=Math.floor(L/l)+","+Math.floor(h/l)+","+Math.floor(e/l);let r=x.get(o);r===void 0&&(r=n.length,x.set(o,r),n.push(0),f.push(0,0,0),i&&(_.push(P.getX(s),P.getY(s),P.getZ(s),P.getW(s)),A.push(b.getX(s),b.getY(s),b.getZ(s),b.getW(s)))),f[r*3]+=L,f[r*3+1]+=h,f[r*3+2]+=e,n[r]++,N[s]=r}for(let s=0;s<n.length;s++)f[s*3]/=n[s],f[s*3+1]/=n[s],f[s*3+2]/=n[s];const g=t.index,W=g?g.count:y,v=[];for(let s=0;s<W;s+=3){const L=N[g?g.getX(s):s],h=N[g?g.getX(s+1):s+1],e=N[g?g.getX(s+2):s+2];L!==h&&h!==e&&L!==e&&v.push(L,h,e)}const C=new De;return C.setAttribute("position",new bt(f,3)),i&&(C.setAttribute("skinIndex",new so(_,4)),C.setAttribute("skinWeight",new bt(A,4))),C.setIndex(v),C}const ze=t=>t-Math.floor(t);function Zo({scene:t,root:l,bones:i,skinned:S,renderer:y,anim:N,getFrame:x,getFrames:f,jointIds:_,params:A={}}){const n={...Bo,...A},P=n.colors,b=n.palette,g=N.count,W=N.fps||120,v=n.samples,C=g/W,s=C/n.refTurn,L=n.trailSeconds*s,h=n.rippleSeconds*s,e=new ot;e.name="v3r7-fx3",t.add(e);const o=S.filter(w=>!w.userData.__outline),r={params:{old:n.old,trailSeconds:L,trailFrames:L*W,rippleFrames:h*W,moteFrames:n.moteLife*W,shadow:n.shadow,ring:n.ring,spark:n.spark}};l.updateMatrixWorld(!0);const u=new O,a=w=>{const m=w.geometry.attributes._region;if(!m)return-1;const k=[0,0,0,0];for(let c=0;c<m.count;c+=7)k[Math.round(m.getX(c))]++;return k.indexOf(Math.max(...k))},d=o.filter(w=>/Sneaker|Sole/i.test(w.name)||a(w)===3),T=w=>{const m=i[w+"Foot"],k=m.getWorldPosition(new O);let c=null,z=-1;for(const p of d.length?d:o){const F=p.skeleton.bones.indexOf(m);if(F<0)continue;const I=p.geometry.attributes.skinIndex,R=p.geometry.attributes.skinWeight;for(let M=0;M<I.count;M++){let H=0;for(let U=0;U<4;U++)I.getComponent(M,U)===F&&(H+=R.getComponent(M,U));if(H<.95)continue;p.getVertexPosition(M,u).applyMatrix4(p.matrixWorld);const E=u.distanceTo(k);E>z&&(z=E,c={m:p,i:M})}}return c},B={left:T("left"),right:T("right")};r.toe={left:B.left?.i??-1,right:B.right?.i??-1,mesh:B.left?.m.name};const $={left:new Float32Array(g*3),right:new Float32Array(g*3)},V={left:new Float32Array(g*3),right:new Float32Array(g*3)},D={left:new Float32Array(v*3),right:new Float32Array(v*3)},q={left:new Float32Array(v*3),right:new Float32Array(v*3)},j={left:new Float32Array(v),right:new Float32Array(v)};let G=[],se=null;const K=(w,m,k)=>{const c=Math.floor(m),z=m-c,p=U=>(U%g+g)%g,F=p(c-1),I=p(c),R=p(c+1),M=p(c+2),H=z*z,E=H*z;for(let U=0;U<3;U++){const ke=w[F*3+U],xe=w[I*3+U],oe=w[R*3+U],Fe=w[M*3+U];k.setComponent(U,.5*(2*xe+(-ke+oe)*z+(2*ke-5*xe+4*oe-Fe)*H+(-ke+3*xe-3*oe+Fe)*E))}return k};function J(w){const m=_.map(p=>i[p].quaternion.clone()),k=i.pelvis.position.clone(),c=new ne;for(let p=0;p<g;p++){const F=w[p];for(const I of _)i[I].quaternion.copy(c.fromArray(F.q[I]||[0,0,0,1]).normalize());i.pelvis.position.fromArray(F.p),l.updateMatrixWorld(!0);for(const I of["left","right"]){const R=B[I];R?R.m.getVertexPosition(R.i,u).applyMatrix4(R.m.matrixWorld):i[I+"Foot"].getWorldPosition(u),u.toArray($[I],p*3),i[I+"Hand"].getWorldPosition(u).toArray(V[I],p*3)}}_.forEach((p,F)=>i[p].quaternion.copy(m[F])),i.pelvis.position.copy(k),l.updateMatrixWorld(!0);for(const p of["left","right"])for(let F=0;F<v;F++)K($[p],F/v*g,u).toArray(D[p],F*3),K(V[p],F/v*g,u).toArray(q[p],F*3);const z=C/v;for(const p of["left","right"]){const F=D[p],I=new Float32Array(v);for(let M=0;M<v;M++){const H=(M+1)%v;I[M]=Math.hypot(F[H*3]-F[M*3],F[H*3+1]-F[M*3+1],F[H*3+2]-F[M*3+2])/z}const R=[...I].sort((M,H)=>M-H)[Math.floor(v*.8)]||1;for(let M=0;M<v;M++)j[p][M]=Math.min(1,I[M]/R)}G=[];for(const p of["left","right"]){const F=M=>q[p][M*3+1];let I=1/0;for(let M=0;M<v;M++)I=Math.min(I,F(M));const R=M=>F(M)<I+n.plantDrop;for(let M=0;M<v;M++)if(R(M)&&!R((M-1+v)%v)){const H=(M+n.plantDelay)%v;G.push({side:p,wall:M/v*C,x:q[p][H*3],z:q[p][H*3+2]})}}r.plants=G.map(p=>({side:p.side,frame:+(p.wall*W).toFixed(1)})),se=w}J(f());const Me=(w,m,k)=>{const c=(m/C%1+1)%1*v,z=Math.floor(c),p=(z+1)%v,F=c-z;return k.set(w[z*3]+(w[p*3]-w[z*3])*F,w[z*3+1]+(w[p*3+1]-w[z*3+1])*F,w[z*3+2]+(w[p*3+2]-w[z*3+2])*F)},lt=(w,m)=>{const k=(m/C%1+1)%1*v,c=Math.floor(k),z=(c+1)%v,p=k-c;return w[c]+(w[z]-w[c])*p},le=w=>new X(w),ct=n.old?1:n.halo,ee=n.segments,Xt={blending:io,blendEquation:ro,blendSrc:no,blendDst:ao,premultipliedAlpha:!0},$e=()=>n.old?{blending:oo}:Xt,ft={value:le(b.head)},ut={value:le(b.mid)},dt={value:le(b.tail)},mt={value:le(P.core)},pt=[0,1].map(w=>new re({name:"fx2-ribbon",vertexShader:Ho,fragmentShader:n.old?Oo:Uo,transparent:!0,depthWrite:!1,side:Tt,...$e(),uniforms:{uOpacity:{value:n.old?1:n.glow},uHalo:{value:ct},uWide:{value:n.wide},uSeed:{value:w*3.7+1.3},uShoe:{value:new O(-1e4,-1e4,0)},uTime:{value:0},uFlick:{value:n.flick},uCoreK:{value:n.core},uHead:ft,uMid:ut,uTail:dt,uCore:mt,uGold:{value:le(b.gold)},uInk:{value:le(P.ink)}}})),Dt=["left","right"].map((w,m)=>{const k=(ee+1)*2,c=new De;c.setAttribute("position",new Q(new Float32Array(k*3),3).setUsage(Ee));const z=new Float32Array(k),p=new Float32Array(k);for(let R=0;R<=ee;R++)z[R*2]=z[R*2+1]=R/ee,p[R*2]=-1,p[R*2+1]=1;c.setAttribute("aAge",new Q(z,1)),c.setAttribute("aSide",new Q(p,1)),c.setAttribute("aSpeed",new Q(new Float32Array(k),1).setUsage(Ee));const F=[];for(let R=0;R<ee;R++){const M=R*2;F.push(M,M+1,M+2,M+1,M+3,M+2)}c.setIndex(F);const I=new fe(c,pt[m]);return I.frustumCulled=!1,I.renderOrder=3,e.add(I),{side:w,mesh:I,geometry:c}}),te=Array.from({length:ee+1},()=>new O),Ne=new O,ht=new O,de=new O,ue=new O,Qe=new O,Re=new Rt;function jt(w,m,k){const c=L;for(const z of pt)z.uniforms.uTime.value=w;k.getDrawingBufferSize(Re);for(const z of Dt){const p=B[z.side];p&&p.m.getVertexPosition(p.i,Qe).applyMatrix4(p.m.matrixWorld),i[z.side+"Foot"].getWorldPosition(ue);const F=ue.distanceTo(Qe)*.46;ue.lerp(Qe,.45);const I=m.position.distanceTo(ue);ue.project(m);const R=m.isPerspectiveCamera?F/(I*Math.tan(je.degToRad(m.fov)/2))*Re.y/2:0;z.mesh.material.uniforms.uShoe.value.set((ue.x*.5+.5)*Re.x,(ue.y*.5+.5)*Re.y,!n.old&&ue.z<1?R:0);const M=z.geometry.attributes.position,H=z.geometry.attributes.aSpeed;for(let E=0;E<=ee;E++)Me(D[z.side],w-c*E/ee,te[E]);for(let E=0;E<=ee;E++){const U=te[Math.max(0,E-1)],ke=te[Math.min(ee,E+1)];Ne.subVectors(U,ke),Ne.lengthSq()<1e-10&&Ne.set(1,0,0),ht.subVectors(m.position,te[E]),de.crossVectors(Ne,ht).normalize();const xe=E/ee,oe=n.width*(1-xe*.75)*ct;M.setXYZ(E*2,te[E].x-de.x*oe,te[E].y-de.y*oe,te[E].z-de.z*oe),M.setXYZ(E*2+1,te[E].x+de.x*oe,te[E].y+de.y*oe,te[E].z+de.z*oe);const Fe=lt(j[z.side],w-c*xe);H.setX(E*2,Fe),H.setX(E*2+1,Fe)}M.needsUpdate=!0,H.needsUpdate=!0}}const we=n.motes,vt=new re({name:"fx2-mote",transparent:!0,depthWrite:!1,...$e(),uniforms:{uOpacity:{value:n.old?.9:.9*n.glow},uScale:{value:400},uStar:{value:n.old?1:2.6},uHead:ft,uMid:ut,uTail:dt,uCore:mt,uEdge:{value:le(b.head)}},vertexShader:Xo,fragmentShader:n.old?Vo:Do}),gt=["left","right"].map((w,m)=>{const k=new De;k.setAttribute("position",new Q(new Float32Array(we*3),3).setUsage(Ee)),k.setAttribute("aAge",new Q(new Float32Array(we),1).setUsage(Ee));const c=new Float32Array(we),z=[];for(let F=0;F<we;F++){const I=ze(Math.sin((F+1)*12.9898+m*78.233)*43758.5453);c[F]=.01+.012*I,z.push(new O(ze(I*7.13)-.5,ze(I*3.71)-.2,ze(I*5.29)-.5).normalize())}k.setAttribute("aSize",new Q(c,1));const p=new eo(k,vt);return p.frustumCulled=!1,p.renderOrder=4,e.add(p),{side:w,mesh:p,geometry:k,seed:z}}),Le=new O;function Gt(w,m){vt.uniforms.uScale.value=y.domElement.height/(2*Math.tan(je.degToRad(m.fov||35)/2));const k=n.moteLife;for(const c of gt){const z=c.geometry.attributes.position,p=c.geometry.attributes.aAge;for(let F=0;F<we;F++){const I=ze(w/k+F/we),R=w-I*k;Me(D[c.side],R,Le);const M=.05*I+.02*I*I,H=lt(j[c.side],R);z.setXYZ(F,Le.x+c.seed[F].x*M,Le.y+c.seed[F].y*M+.015*I,Le.z+c.seed[F].z*M),p.setX(F,H>.35?I:1)}z.needsUpdate=!0,p.needsUpdate=!0}}const Se=Array.from({length:n.ripples},()=>{const w=new re({name:"fx2-ripple",vertexShader:"varying vec2 vUv; void main(){ vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0); }",fragmentShader:n.old?Eo:jo,transparent:!0,depthWrite:!1,...$e(),uniforms:{uOpacity:{value:0},uProgress:{value:0},uColor:{value:le(b.ripple)},uInk:{value:le(P.ringInk)}}}),m=new fe(new to(.5,.5),w);return m.rotation.x=-Math.PI/2,m.position.y=.0036,m.visible=!1,m.renderOrder=1,m.frustumCulled=!1,e.add(m),m});function Yt(w){let m=0;for(const k of G){let c=w-k.wall;if(c<0&&(c+=C),c>h||m>=Se.length)continue;const z=Se[m++];z.visible=!0,z.position.x=k.x,z.position.z=k.z,z.material.uniforms.uProgress.value=c/h,z.material.uniforms.uOpacity.value=n.old?.75:.75*n.glow}for(let k=m;k<Se.length;k++)Se[k].visible=!1}const Be={uL:{value:new O(.4,1,-.2).normalize()},uCut:{value:.16},uC1:{value:new X(P.shadow1)},uC2:{value:new X(P.shadow2)}},Ae=[],wt=[];r.shadowVerts=0;const Oe=new ot;if(Oe.name="v3r7-fx-shadow",t.add(Oe),n.shadow){const w=new re({name:"fx-shadow",uniforms:Be,vertexShader:Go,fragmentShader:Yo});for(const m of o){const k=_t(m.geometry,n.shadowCell,!0);r.shadowVerts+=k.attributes.position.count;const c=new Wt(k,w);c.bind(m.skeleton,m.bindMatrix),c.frustumCulled=!1,c.renderOrder=-2,c.raycast=()=>{},Oe.add(c),Ae.push(c)}i.head?.traverse(m=>{if(m.isMesh&&m.name.startsWith("hair")&&!m.userData.__outline){const k=_t(m.geometry,n.shadowCell,!1);r.shadowVerts+=k.attributes.position.count;const c=new fe(k,w);c.matrixAutoUpdate=!1,c.frustumCulled=!1,c.renderOrder=-2,c.raycast=()=>{},Oe.add(c),Ae.push(c),wt.push([c,m])}})}const Zt=new O(-.45,.75,.55);function $t(w){const m=Be.uL.value.copy(Zt).applyQuaternion(w.quaternion);if(m.y=Math.max(m.y,.2),m.normalize(),m.y<.62){const k=Math.hypot(m.x,m.z),c=Math.sqrt(1-.62*.62)/(k||1);m.set(m.x*c,.62,m.z*c)}}let xt=null;const yt=t.onBeforeRender;return t.onBeforeRender=(w,m,k,c)=>{yt&&yt.call(t,w,m,k,c);const z=x(),p=f();if(p&&p!==se&&p.length===g&&J(p),Ae.length){$t(k);for(const[R,M]of wt)R.matrix.copy(M.matrixWorld),R.matrixWorld.copy(M.matrixWorld)}const F=z!=null;if(e.visible=F,!F)return;const I=z/W;jt(I,k,w);for(const R of gt)R.mesh.visible=n.spark;n.spark&&Gt(I,k),n.ring?Yt(I):Se.forEach(R=>R.visible=!1),xt=z},r.casters=Ae.length,r.shadowTris=Ae.reduce((w,m)=>w+m.geometry.index.count/3,0),r.group=e,r.setShadowColors=(w,m)=>{Be.uC1.value.set(w),Be.uC2.value.set(m)},r.debug=()=>({last:xt,speed:{left:Array.from(j.left),right:Array.from(j.right)},paths:{left:Array.from(D.left),right:Array.from(D.right)}}),r}const qe={spineLower:"pelvis",spineUpper:"spineLower",torso:"spineUpper",neck:"torso",head:"neck"};for(const t of["left","right"]){Object.assign(qe,{[t+"Scapula"]:"torso",[t+"UpperArm"]:t+"Scapula",[t+"Forearm"]:t+"UpperArm",[t+"Hand"]:t+"Forearm",[t+"Thigh"]:"pelvis",[t+"Shin"]:t+"Thigh",[t+"Patella"]:t+"Shin",[t+"Foot"]:t+"Shin"});for(let l=1;l<=6;l++)qe[t+"ForearmTwist"+l]=t+"Forearm";for(let l=1;l<=2;l++)qe[t+"WristBend"+l]=t+"Forearm"}const zt=t=>new URL("./v5/"+t,document.baseURI).href,$o=new O(0,1,0);async function Qo(t){const[l,i]=await Promise.all([new Nt().setMeshoptDecoder(lo).loadAsync(zt("coach-v3r3-wristfix.glb")),fetch(zt("flare-arm8legs-v3r3.json")).then(e=>{if(!e.ok)throw Error("V5 motion load failed");return e.json()})]),S=new co,y=new It(30,1,.05,50),N=new fe(new fo(2,48).rotateX(-Math.PI/2),new Ze);S.add(l.scene,N);const x=l.scene,f={},_=[];x.updateMatrixWorld(!0),x.traverse(e=>{e.isBone&&(f[e.name]=e),e.isSkinnedMesh&&(_.push(e),e.frustumCulled=!1)});for(const[e,o]of Object.entries(qe)){if(!f[e]||!f[o])throw Error("V5 rig missing "+e);f[o].attach(f[e])}for(const e of Object.values(f))e.quaternion.identity();x.updateMatrixWorld(!0);const A=po({bones:f,renderer:t});if(await Po({scene:S,root:x,bones:f,skinned:_,floor:N,renderer:t,camera:y}).hairReady,!A||!f.head.getObjectByName("hair-spiky"))throw Error("V5 wrist or hair unavailable");const P=new O().fromArray(i.cams.v0.t),b=new O().fromArray(i.cams.v0.p).sub(P),g=Object.keys(i.frames[0].q);let W=0,v=!0,C;function s(e){const o=i.frames[e];for(const r of g)f[r].quaternion.fromArray(o.q[r]).normalize();f.pelvis.position.fromArray(o.p)}s(W);const L=Zo({scene:S,root:x,bones:f,skinned:_,renderer:t,anim:i,jointIds:g,getFrame:()=>v?W:null,getFrames:()=>i.frames}),h=new Rt;return{period:i.count/i.fps,render(e,{fxEnabled:o=!0,dark:r=!1,yaw:u=0}={}){W=Math.min(i.count-1,Math.floor((e%1+1)%1*i.count)),v=o,r!==C&&(S.background.set(r?2236710:16052198),N.material.color.set(r?3879990:15129805),L.setShadowColors(r?2234908:14273469,r?1512213:12825253),C=r),s(W),t.getSize(h);const a=Math.max(.01,h.x/Math.max(1,h.y));y.aspect=a;const d=je.degToRad(i.cams.v0.f)/2;y.fov=je.radToDeg(2*Math.atan(Math.tan(d)/Math.min(1,a))),y.position.copy(b).applyAxisAngle($o,u).add(P),y.lookAt(P),y.updateProjectionMatrix(),t.render(S,y)},dispose(){const e=new Set;S.traverse(o=>{if(o.geometry&&e.add(o.geometry),o.material)for(const r of[].concat(o.material))e.add(r);o.skeleton&&e.add(o.skeleton)});for(const o of e)o.dispose()}}}const Ko=[.25,.5,1];let Ie=1,he,ye,Te,Ue,Pe=0,st=.5,Vt=0,pe=null,ie=!1,Ye=!0,Ht=!1,qt=!0,We=0,Ct=-1/0;function ge(t,l={}){const i={source:"flare-scene",type:t,time:Pe,period:Ie,speed:st,playing:ie,...l};window.FlareHost?.postMessage?window.FlareHost.postMessage(JSON.stringify(i)):window.parent!==window&&window.parent.postMessage(i,window.location.origin)}function be(){ye&&Ye&&!document.hidden&&!Te&&(Te=requestAnimationFrame(Jo))}function Jo(t){Te=null,!(!Ye||document.hidden)&&(ie&&We&&(Pe=(Pe+(t-We)*.001*st)%Ie),We=t,ye.render(Pe/Ie,{fxEnabled:qt,dark:Ht,yaw:Vt}),Ue!=null&&(ge("presented",{requestId:Ue}),Ue=null),ie&&t-Ct>=100&&(Ct=t,ge("state")),ie&&be())}function Ut(t){switch(t?.type){case"play":ie=!0,We=0;break;case"pause":ie=!1;break;case"seek":if(!Number.isFinite(t.time))return;ie=!1,Pe=Math.max(0,Math.min(t.time,Ie-1/120));break;case"speed":Ko.includes(t.value)&&(st=t.value);break;case"theme":Ht=t.value==="dark";break;case"fx":qt=t.value===!0;break;case"visibility":Ye=t.visible===!0,Ye||(ie=!1);break;case"present":Ue=t.requestId;break;default:return}be(),ye&&t.type!=="present"&&ge("state")}window.flareBridge=Object.freeze({command:Ut});window.addEventListener("message",t=>{t.source===window.parent&&t.origin===window.location.origin&&t.data?.source==="flare-host"&&Ut(t.data.command)});function Pt(){he.setPixelRatio(Math.min(window.devicePixelRatio||1,2)),he.setSize(window.innerWidth,window.innerHeight,!1),be()}async function ea(){try{he=new uo({antialias:!0}),he.outputColorSpace=mo;const t=he.domElement;document.body.append(t),t.addEventListener("webglcontextlost",l=>{l.preventDefault(),ie=!1,ge("error",{errorCode:"graphics_context_lost"})}),t.addEventListener("pointerdown",l=>{pe||(t.setPointerCapture(l.pointerId),pe={id:l.pointerId,x:l.clientX})}),t.addEventListener("pointermove",l=>{pe?.id===l.pointerId&&(Vt+=(pe.x-l.clientX)*.01,pe.x=l.clientX,be())}),t.addEventListener("lostpointercapture",l=>{pe?.id===l.pointerId&&(pe=null)}),Pt(),ye=await Qo(he),Ie=ye.period,window.addEventListener("resize",Pt),document.addEventListener("visibilitychange",()=>{document.hidden?(ie=!1,ge("state")):(We=0,be())}),window.addEventListener("pagehide",l=>{l.persisted||(Te&&cancelAnimationFrame(Te),ye.dispose(),he.dispose())}),ge("ready"),be()}catch(t){console.error(t),ge("error",{errorCode:"scene-load-failed"})}}ea();
