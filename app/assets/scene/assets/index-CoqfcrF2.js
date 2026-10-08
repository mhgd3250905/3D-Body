(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const r of document.querySelectorAll('link[rel="modulepreload"]'))n(r);new MutationObserver(r=>{for(const s of r)if(s.type==="childList")for(const o of s.addedNodes)o.tagName==="LINK"&&o.rel==="modulepreload"&&n(o)}).observe(document,{childList:!0,subtree:!0});function t(r){const s={};return r.integrity&&(s.integrity=r.integrity),r.referrerPolicy&&(s.referrerPolicy=r.referrerPolicy),r.crossOrigin==="use-credentials"?s.credentials="include":r.crossOrigin==="anonymous"?s.credentials="omit":s.credentials="same-origin",s}function n(r){if(r.ep)return;r.ep=!0;const s=t(r);fetch(r.href,s)}})();const Ul="170",ss={ROTATE:0,DOLLY:1,PAN:2},ns={ROTATE:0,PAN:1,DOLLY_PAN:2,DOLLY_ROTATE:3},Rf=0,ah=1,Cf=2,Ju=1,ed=2,Li=3,Gi=0,Rn=1,mi=2,ar=0,os=1,ch=2,lh=3,hh=4,Pf=5,Ar=100,Lf=101,Df=102,If=103,Nf=104,Uf=200,Ff=201,Of=202,kf=203,Ic=204,Nc=205,Bf=206,zf=207,Hf=208,Vf=209,Gf=210,Wf=211,qf=212,jf=213,Xf=214,Uc=0,Fc=1,Oc=2,ms=3,kc=4,Bc=5,zc=6,Hc=7,td=0,Qf=1,Kf=2,cr=0,Yf=1,$f=2,Zf=3,nd=4,Jf=5,ep=6,tp=7,uh="attached",np="detached",id=300,gs=301,bs=302,Vc=303,Gc=304,wa=306,_s=1e3,sr=1001,fa=1002,Cn=1003,rd=1004,Qs=1005,qn=1006,ea=1007,Ui=1008,Wi=1009,sd=1010,od=1011,no=1012,Fl=1013,Lr=1014,ai=1015,co=1016,Ol=1017,kl=1018,xs=1020,ad=35902,cd=1021,ld=1022,Zn=1023,hd=1024,ud=1025,as=1026,vs=1027,Bl=1028,zl=1029,dd=1030,Hl=1031,Vl=1033,ta=33776,na=33777,ia=33778,ra=33779,Wc=35840,qc=35841,jc=35842,Xc=35843,Qc=36196,Kc=37492,Yc=37496,$c=37808,Zc=37809,Jc=37810,el=37811,tl=37812,nl=37813,il=37814,rl=37815,sl=37816,ol=37817,al=37818,cl=37819,ll=37820,hl=37821,sa=36492,ul=36494,dl=36495,fd=36283,fl=36284,pl=36285,ml=36286,io=2300,ro=2301,ka=2302,dh=2400,fh=2401,ph=2402,ip=2500,rp=0,pd=1,gl=2,sp=3200,op=3201,md=0,ap=1,ir="",ln="srgb",Pn="srgb-linear",Ea="linear",qt="srgb",Or=7680,mh=519,cp=512,lp=513,hp=514,gd=515,up=516,dp=517,fp=518,pp=519,bl=35044,gh="300 es",Fi=2e3,pa=2001;class Ur{addEventListener(e,t){this._listeners===void 0&&(this._listeners={});const n=this._listeners;n[e]===void 0&&(n[e]=[]),n[e].indexOf(t)===-1&&n[e].push(t)}hasEventListener(e,t){if(this._listeners===void 0)return!1;const n=this._listeners;return n[e]!==void 0&&n[e].indexOf(t)!==-1}removeEventListener(e,t){if(this._listeners===void 0)return;const r=this._listeners[e];if(r!==void 0){const s=r.indexOf(t);s!==-1&&r.splice(s,1)}}dispatchEvent(e){if(this._listeners===void 0)return;const n=this._listeners[e.type];if(n!==void 0){e.target=this;const r=n.slice(0);for(let s=0,o=r.length;s<o;s++)r[s].call(this,e);e.target=null}}}const Mn=["00","01","02","03","04","05","06","07","08","09","0a","0b","0c","0d","0e","0f","10","11","12","13","14","15","16","17","18","19","1a","1b","1c","1d","1e","1f","20","21","22","23","24","25","26","27","28","29","2a","2b","2c","2d","2e","2f","30","31","32","33","34","35","36","37","38","39","3a","3b","3c","3d","3e","3f","40","41","42","43","44","45","46","47","48","49","4a","4b","4c","4d","4e","4f","50","51","52","53","54","55","56","57","58","59","5a","5b","5c","5d","5e","5f","60","61","62","63","64","65","66","67","68","69","6a","6b","6c","6d","6e","6f","70","71","72","73","74","75","76","77","78","79","7a","7b","7c","7d","7e","7f","80","81","82","83","84","85","86","87","88","89","8a","8b","8c","8d","8e","8f","90","91","92","93","94","95","96","97","98","99","9a","9b","9c","9d","9e","9f","a0","a1","a2","a3","a4","a5","a6","a7","a8","a9","aa","ab","ac","ad","ae","af","b0","b1","b2","b3","b4","b5","b6","b7","b8","b9","ba","bb","bc","bd","be","bf","c0","c1","c2","c3","c4","c5","c6","c7","c8","c9","ca","cb","cc","cd","ce","cf","d0","d1","d2","d3","d4","d5","d6","d7","d8","d9","da","db","dc","dd","de","df","e0","e1","e2","e3","e4","e5","e6","e7","e8","e9","ea","eb","ec","ed","ee","ef","f0","f1","f2","f3","f4","f5","f6","f7","f8","f9","fa","fb","fc","fd","fe","ff"];let bh=1234567;const $s=Math.PI/180,ys=180/Math.PI;function ci(){const i=Math.random()*4294967295|0,e=Math.random()*4294967295|0,t=Math.random()*4294967295|0,n=Math.random()*4294967295|0;return(Mn[i&255]+Mn[i>>8&255]+Mn[i>>16&255]+Mn[i>>24&255]+"-"+Mn[e&255]+Mn[e>>8&255]+"-"+Mn[e>>16&15|64]+Mn[e>>24&255]+"-"+Mn[t&63|128]+Mn[t>>8&255]+"-"+Mn[t>>16&255]+Mn[t>>24&255]+Mn[n&255]+Mn[n>>8&255]+Mn[n>>16&255]+Mn[n>>24&255]).toLowerCase()}function xn(i,e,t){return Math.max(e,Math.min(t,i))}function Gl(i,e){return(i%e+e)%e}function mp(i,e,t,n,r){return n+(i-e)*(r-n)/(t-e)}function gp(i,e,t){return i!==e?(t-i)/(e-i):0}function Zs(i,e,t){return(1-t)*i+t*e}function bp(i,e,t,n){return Zs(i,e,1-Math.exp(-t*n))}function _p(i,e=1){return e-Math.abs(Gl(i,e*2)-e)}function xp(i,e,t){return i<=e?0:i>=t?1:(i=(i-e)/(t-e),i*i*(3-2*i))}function vp(i,e,t){return i<=e?0:i>=t?1:(i=(i-e)/(t-e),i*i*i*(i*(i*6-15)+10))}function yp(i,e){return i+Math.floor(Math.random()*(e-i+1))}function Mp(i,e){return i+Math.random()*(e-i)}function Sp(i){return i*(.5-Math.random())}function wp(i){i!==void 0&&(bh=i);let e=bh+=1831565813;return e=Math.imul(e^e>>>15,e|1),e^=e+Math.imul(e^e>>>7,e|61),((e^e>>>14)>>>0)/4294967296}function Ep(i){return i*$s}function Ap(i){return i*ys}function Tp(i){return(i&i-1)===0&&i!==0}function Rp(i){return Math.pow(2,Math.ceil(Math.log(i)/Math.LN2))}function Cp(i){return Math.pow(2,Math.floor(Math.log(i)/Math.LN2))}function Pp(i,e,t,n,r){const s=Math.cos,o=Math.sin,a=s(t/2),c=o(t/2),l=s((e+n)/2),h=o((e+n)/2),u=s((e-n)/2),d=o((e-n)/2),p=s((n-e)/2),g=o((n-e)/2);switch(r){case"XYX":i.set(a*h,c*u,c*d,a*l);break;case"YZY":i.set(c*d,a*h,c*u,a*l);break;case"ZXZ":i.set(c*u,c*d,a*h,a*l);break;case"XZX":i.set(a*h,c*g,c*p,a*l);break;case"YXY":i.set(c*p,a*h,c*g,a*l);break;case"ZYZ":i.set(c*g,c*p,a*h,a*l);break;default:console.warn("THREE.MathUtils: .setQuaternionFromProperEuler() encountered an unknown order: "+r)}}function oi(i,e){switch(e.constructor){case Float32Array:return i;case Uint32Array:return i/4294967295;case Uint16Array:return i/65535;case Uint8Array:return i/255;case Int32Array:return Math.max(i/2147483647,-1);case Int16Array:return Math.max(i/32767,-1);case Int8Array:return Math.max(i/127,-1);default:throw new Error("Invalid component type.")}}function zt(i,e){switch(e.constructor){case Float32Array:return i;case Uint32Array:return Math.round(i*4294967295);case Uint16Array:return Math.round(i*65535);case Uint8Array:return Math.round(i*255);case Int32Array:return Math.round(i*2147483647);case Int16Array:return Math.round(i*32767);case Int8Array:return Math.round(i*127);default:throw new Error("Invalid component type.")}}const Nt={DEG2RAD:$s,RAD2DEG:ys,generateUUID:ci,clamp:xn,euclideanModulo:Gl,mapLinear:mp,inverseLerp:gp,lerp:Zs,damp:bp,pingpong:_p,smoothstep:xp,smootherstep:vp,randInt:yp,randFloat:Mp,randFloatSpread:Sp,seededRandom:wp,degToRad:Ep,radToDeg:Ap,isPowerOfTwo:Tp,ceilPowerOfTwo:Rp,floorPowerOfTwo:Cp,setQuaternionFromProperEuler:Pp,normalize:zt,denormalize:oi};class at{constructor(e=0,t=0){at.prototype.isVector2=!0,this.x=e,this.y=t}get width(){return this.x}set width(e){this.x=e}get height(){return this.y}set height(e){this.y=e}set(e,t){return this.x=e,this.y=t,this}setScalar(e){return this.x=e,this.y=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;default:throw new Error("index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;default:throw new Error("index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y)}copy(e){return this.x=e.x,this.y=e.y,this}add(e){return this.x+=e.x,this.y+=e.y,this}addScalar(e){return this.x+=e,this.y+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this}subScalar(e){return this.x-=e,this.y-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this}multiply(e){return this.x*=e.x,this.y*=e.y,this}multiplyScalar(e){return this.x*=e,this.y*=e,this}divide(e){return this.x/=e.x,this.y/=e.y,this}divideScalar(e){return this.multiplyScalar(1/e)}applyMatrix3(e){const t=this.x,n=this.y,r=e.elements;return this.x=r[0]*t+r[3]*n+r[6],this.y=r[1]*t+r[4]*n+r[7],this}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this}clamp(e,t){return this.x=Math.max(e.x,Math.min(t.x,this.x)),this.y=Math.max(e.y,Math.min(t.y,this.y)),this}clampScalar(e,t){return this.x=Math.max(e,Math.min(t,this.x)),this.y=Math.max(e,Math.min(t,this.y)),this}clampLength(e,t){const n=this.length();return this.divideScalar(n||1).multiplyScalar(Math.max(e,Math.min(t,n)))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this}negate(){return this.x=-this.x,this.y=-this.y,this}dot(e){return this.x*e.x+this.y*e.y}cross(e){return this.x*e.y-this.y*e.x}lengthSq(){return this.x*this.x+this.y*this.y}length(){return Math.sqrt(this.x*this.x+this.y*this.y)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)}normalize(){return this.divideScalar(this.length()||1)}angle(){return Math.atan2(-this.y,-this.x)+Math.PI}angleTo(e){const t=Math.sqrt(this.lengthSq()*e.lengthSq());if(t===0)return Math.PI/2;const n=this.dot(e)/t;return Math.acos(xn(n,-1,1))}distanceTo(e){return Math.sqrt(this.distanceToSquared(e))}distanceToSquared(e){const t=this.x-e.x,n=this.y-e.y;return t*t+n*n}manhattanDistanceTo(e){return Math.abs(this.x-e.x)+Math.abs(this.y-e.y)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this}lerpVectors(e,t,n){return this.x=e.x+(t.x-e.x)*n,this.y=e.y+(t.y-e.y)*n,this}equals(e){return e.x===this.x&&e.y===this.y}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this}rotateAround(e,t){const n=Math.cos(t),r=Math.sin(t),s=this.x-e.x,o=this.y-e.y;return this.x=s*n-o*r+e.x,this.y=s*r+o*n+e.y,this}random(){return this.x=Math.random(),this.y=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y}}class bt{constructor(e,t,n,r,s,o,a,c,l){bt.prototype.isMatrix3=!0,this.elements=[1,0,0,0,1,0,0,0,1],e!==void 0&&this.set(e,t,n,r,s,o,a,c,l)}set(e,t,n,r,s,o,a,c,l){const h=this.elements;return h[0]=e,h[1]=r,h[2]=a,h[3]=t,h[4]=s,h[5]=c,h[6]=n,h[7]=o,h[8]=l,this}identity(){return this.set(1,0,0,0,1,0,0,0,1),this}copy(e){const t=this.elements,n=e.elements;return t[0]=n[0],t[1]=n[1],t[2]=n[2],t[3]=n[3],t[4]=n[4],t[5]=n[5],t[6]=n[6],t[7]=n[7],t[8]=n[8],this}extractBasis(e,t,n){return e.setFromMatrix3Column(this,0),t.setFromMatrix3Column(this,1),n.setFromMatrix3Column(this,2),this}setFromMatrix4(e){const t=e.elements;return this.set(t[0],t[4],t[8],t[1],t[5],t[9],t[2],t[6],t[10]),this}multiply(e){return this.multiplyMatrices(this,e)}premultiply(e){return this.multiplyMatrices(e,this)}multiplyMatrices(e,t){const n=e.elements,r=t.elements,s=this.elements,o=n[0],a=n[3],c=n[6],l=n[1],h=n[4],u=n[7],d=n[2],p=n[5],g=n[8],b=r[0],m=r[3],f=r[6],y=r[1],x=r[4],_=r[7],I=r[2],L=r[5],C=r[8];return s[0]=o*b+a*y+c*I,s[3]=o*m+a*x+c*L,s[6]=o*f+a*_+c*C,s[1]=l*b+h*y+u*I,s[4]=l*m+h*x+u*L,s[7]=l*f+h*_+u*C,s[2]=d*b+p*y+g*I,s[5]=d*m+p*x+g*L,s[8]=d*f+p*_+g*C,this}multiplyScalar(e){const t=this.elements;return t[0]*=e,t[3]*=e,t[6]*=e,t[1]*=e,t[4]*=e,t[7]*=e,t[2]*=e,t[5]*=e,t[8]*=e,this}determinant(){const e=this.elements,t=e[0],n=e[1],r=e[2],s=e[3],o=e[4],a=e[5],c=e[6],l=e[7],h=e[8];return t*o*h-t*a*l-n*s*h+n*a*c+r*s*l-r*o*c}invert(){const e=this.elements,t=e[0],n=e[1],r=e[2],s=e[3],o=e[4],a=e[5],c=e[6],l=e[7],h=e[8],u=h*o-a*l,d=a*c-h*s,p=l*s-o*c,g=t*u+n*d+r*p;if(g===0)return this.set(0,0,0,0,0,0,0,0,0);const b=1/g;return e[0]=u*b,e[1]=(r*l-h*n)*b,e[2]=(a*n-r*o)*b,e[3]=d*b,e[4]=(h*t-r*c)*b,e[5]=(r*s-a*t)*b,e[6]=p*b,e[7]=(n*c-l*t)*b,e[8]=(o*t-n*s)*b,this}transpose(){let e;const t=this.elements;return e=t[1],t[1]=t[3],t[3]=e,e=t[2],t[2]=t[6],t[6]=e,e=t[5],t[5]=t[7],t[7]=e,this}getNormalMatrix(e){return this.setFromMatrix4(e).invert().transpose()}transposeIntoArray(e){const t=this.elements;return e[0]=t[0],e[1]=t[3],e[2]=t[6],e[3]=t[1],e[4]=t[4],e[5]=t[7],e[6]=t[2],e[7]=t[5],e[8]=t[8],this}setUvTransform(e,t,n,r,s,o,a){const c=Math.cos(s),l=Math.sin(s);return this.set(n*c,n*l,-n*(c*o+l*a)+o+e,-r*l,r*c,-r*(-l*o+c*a)+a+t,0,0,1),this}scale(e,t){return this.premultiply(Ba.makeScale(e,t)),this}rotate(e){return this.premultiply(Ba.makeRotation(-e)),this}translate(e,t){return this.premultiply(Ba.makeTranslation(e,t)),this}makeTranslation(e,t){return e.isVector2?this.set(1,0,e.x,0,1,e.y,0,0,1):this.set(1,0,e,0,1,t,0,0,1),this}makeRotation(e){const t=Math.cos(e),n=Math.sin(e);return this.set(t,-n,0,n,t,0,0,0,1),this}makeScale(e,t){return this.set(e,0,0,0,t,0,0,0,1),this}equals(e){const t=this.elements,n=e.elements;for(let r=0;r<9;r++)if(t[r]!==n[r])return!1;return!0}fromArray(e,t=0){for(let n=0;n<9;n++)this.elements[n]=e[n+t];return this}toArray(e=[],t=0){const n=this.elements;return e[t]=n[0],e[t+1]=n[1],e[t+2]=n[2],e[t+3]=n[3],e[t+4]=n[4],e[t+5]=n[5],e[t+6]=n[6],e[t+7]=n[7],e[t+8]=n[8],e}clone(){return new this.constructor().fromArray(this.elements)}}const Ba=new bt;function bd(i){for(let e=i.length-1;e>=0;--e)if(i[e]>=65535)return!0;return!1}function so(i){return document.createElementNS("http://www.w3.org/1999/xhtml",i)}function Lp(){const i=so("canvas");return i.style.display="block",i}const _h={};function Ks(i){i in _h||(_h[i]=!0,console.warn(i))}function Dp(i,e,t){return new Promise(function(n,r){function s(){switch(i.clientWaitSync(e,i.SYNC_FLUSH_COMMANDS_BIT,0)){case i.WAIT_FAILED:r();break;case i.TIMEOUT_EXPIRED:setTimeout(s,t);break;default:n()}}setTimeout(s,t)})}function Ip(i){const e=i.elements;e[2]=.5*e[2]+.5*e[3],e[6]=.5*e[6]+.5*e[7],e[10]=.5*e[10]+.5*e[11],e[14]=.5*e[14]+.5*e[15]}function Np(i){const e=i.elements;e[11]===-1?(e[10]=-e[10]-1,e[14]=-e[14]):(e[10]=-e[10],e[14]=-e[14]+1)}const Ct={enabled:!0,workingColorSpace:Pn,spaces:{},convert:function(i,e,t){return this.enabled===!1||e===t||!e||!t||(this.spaces[e].transfer===qt&&(i.r=zi(i.r),i.g=zi(i.g),i.b=zi(i.b)),this.spaces[e].primaries!==this.spaces[t].primaries&&(i.applyMatrix3(this.spaces[e].toXYZ),i.applyMatrix3(this.spaces[t].fromXYZ)),this.spaces[t].transfer===qt&&(i.r=cs(i.r),i.g=cs(i.g),i.b=cs(i.b))),i},fromWorkingColorSpace:function(i,e){return this.convert(i,this.workingColorSpace,e)},toWorkingColorSpace:function(i,e){return this.convert(i,e,this.workingColorSpace)},getPrimaries:function(i){return this.spaces[i].primaries},getTransfer:function(i){return i===ir?Ea:this.spaces[i].transfer},getLuminanceCoefficients:function(i,e=this.workingColorSpace){return i.fromArray(this.spaces[e].luminanceCoefficients)},define:function(i){Object.assign(this.spaces,i)},_getMatrix:function(i,e,t){return i.copy(this.spaces[e].toXYZ).multiply(this.spaces[t].fromXYZ)},_getDrawingBufferColorSpace:function(i){return this.spaces[i].outputColorSpaceConfig.drawingBufferColorSpace},_getUnpackColorSpace:function(i=this.workingColorSpace){return this.spaces[i].workingColorSpaceConfig.unpackColorSpace}};function zi(i){return i<.04045?i*.0773993808:Math.pow(i*.9478672986+.0521327014,2.4)}function cs(i){return i<.0031308?i*12.92:1.055*Math.pow(i,.41666)-.055}const xh=[.64,.33,.3,.6,.15,.06],vh=[.2126,.7152,.0722],yh=[.3127,.329],Mh=new bt().set(.4123908,.3575843,.1804808,.212639,.7151687,.0721923,.0193308,.1191948,.9505322),Sh=new bt().set(3.2409699,-1.5373832,-.4986108,-.9692436,1.8759675,.0415551,.0556301,-.203977,1.0569715);Ct.define({[Pn]:{primaries:xh,whitePoint:yh,transfer:Ea,toXYZ:Mh,fromXYZ:Sh,luminanceCoefficients:vh,workingColorSpaceConfig:{unpackColorSpace:ln},outputColorSpaceConfig:{drawingBufferColorSpace:ln}},[ln]:{primaries:xh,whitePoint:yh,transfer:qt,toXYZ:Mh,fromXYZ:Sh,luminanceCoefficients:vh,outputColorSpaceConfig:{drawingBufferColorSpace:ln}}});let kr;class Up{static getDataURL(e){if(/^data:/i.test(e.src)||typeof HTMLCanvasElement>"u")return e.src;let t;if(e instanceof HTMLCanvasElement)t=e;else{kr===void 0&&(kr=so("canvas")),kr.width=e.width,kr.height=e.height;const n=kr.getContext("2d");e instanceof ImageData?n.putImageData(e,0,0):n.drawImage(e,0,0,e.width,e.height),t=kr}return t.width>2048||t.height>2048?(console.warn("THREE.ImageUtils.getDataURL: Image converted to jpg for performance reasons",e),t.toDataURL("image/jpeg",.6)):t.toDataURL("image/png")}static sRGBToLinear(e){if(typeof HTMLImageElement<"u"&&e instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&e instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&e instanceof ImageBitmap){const t=so("canvas");t.width=e.width,t.height=e.height;const n=t.getContext("2d");n.drawImage(e,0,0,e.width,e.height);const r=n.getImageData(0,0,e.width,e.height),s=r.data;for(let o=0;o<s.length;o++)s[o]=zi(s[o]/255)*255;return n.putImageData(r,0,0),t}else if(e.data){const t=e.data.slice(0);for(let n=0;n<t.length;n++)t instanceof Uint8Array||t instanceof Uint8ClampedArray?t[n]=Math.floor(zi(t[n]/255)*255):t[n]=zi(t[n]);return{data:t,width:e.width,height:e.height}}else return console.warn("THREE.ImageUtils.sRGBToLinear(): Unsupported image type. No color space conversion applied."),e}}let Fp=0;class _d{constructor(e=null){this.isSource=!0,Object.defineProperty(this,"id",{value:Fp++}),this.uuid=ci(),this.data=e,this.dataReady=!0,this.version=0}set needsUpdate(e){e===!0&&this.version++}toJSON(e){const t=e===void 0||typeof e=="string";if(!t&&e.images[this.uuid]!==void 0)return e.images[this.uuid];const n={uuid:this.uuid,url:""},r=this.data;if(r!==null){let s;if(Array.isArray(r)){s=[];for(let o=0,a=r.length;o<a;o++)r[o].isDataTexture?s.push(za(r[o].image)):s.push(za(r[o]))}else s=za(r);n.url=s}return t||(e.images[this.uuid]=n),n}}function za(i){return typeof HTMLImageElement<"u"&&i instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&i instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&i instanceof ImageBitmap?Up.getDataURL(i):i.data?{data:Array.from(i.data),width:i.width,height:i.height,type:i.data.constructor.name}:(console.warn("THREE.Texture: Unable to serialize Texture."),{})}let Op=0;class hn extends Ur{constructor(e=hn.DEFAULT_IMAGE,t=hn.DEFAULT_MAPPING,n=sr,r=sr,s=qn,o=Ui,a=Zn,c=Wi,l=hn.DEFAULT_ANISOTROPY,h=ir){super(),this.isTexture=!0,Object.defineProperty(this,"id",{value:Op++}),this.uuid=ci(),this.name="",this.source=new _d(e),this.mipmaps=[],this.mapping=t,this.channel=0,this.wrapS=n,this.wrapT=r,this.magFilter=s,this.minFilter=o,this.anisotropy=l,this.format=a,this.internalFormat=null,this.type=c,this.offset=new at(0,0),this.repeat=new at(1,1),this.center=new at(0,0),this.rotation=0,this.matrixAutoUpdate=!0,this.matrix=new bt,this.generateMipmaps=!0,this.premultiplyAlpha=!1,this.flipY=!0,this.unpackAlignment=4,this.colorSpace=h,this.userData={},this.version=0,this.onUpdate=null,this.isRenderTargetTexture=!1,this.pmremVersion=0}get image(){return this.source.data}set image(e=null){this.source.data=e}updateMatrix(){this.matrix.setUvTransform(this.offset.x,this.offset.y,this.repeat.x,this.repeat.y,this.rotation,this.center.x,this.center.y)}clone(){return new this.constructor().copy(this)}copy(e){return this.name=e.name,this.source=e.source,this.mipmaps=e.mipmaps.slice(0),this.mapping=e.mapping,this.channel=e.channel,this.wrapS=e.wrapS,this.wrapT=e.wrapT,this.magFilter=e.magFilter,this.minFilter=e.minFilter,this.anisotropy=e.anisotropy,this.format=e.format,this.internalFormat=e.internalFormat,this.type=e.type,this.offset.copy(e.offset),this.repeat.copy(e.repeat),this.center.copy(e.center),this.rotation=e.rotation,this.matrixAutoUpdate=e.matrixAutoUpdate,this.matrix.copy(e.matrix),this.generateMipmaps=e.generateMipmaps,this.premultiplyAlpha=e.premultiplyAlpha,this.flipY=e.flipY,this.unpackAlignment=e.unpackAlignment,this.colorSpace=e.colorSpace,this.userData=JSON.parse(JSON.stringify(e.userData)),this.needsUpdate=!0,this}toJSON(e){const t=e===void 0||typeof e=="string";if(!t&&e.textures[this.uuid]!==void 0)return e.textures[this.uuid];const n={metadata:{version:4.6,type:"Texture",generator:"Texture.toJSON"},uuid:this.uuid,name:this.name,image:this.source.toJSON(e).uuid,mapping:this.mapping,channel:this.channel,repeat:[this.repeat.x,this.repeat.y],offset:[this.offset.x,this.offset.y],center:[this.center.x,this.center.y],rotation:this.rotation,wrap:[this.wrapS,this.wrapT],format:this.format,internalFormat:this.internalFormat,type:this.type,colorSpace:this.colorSpace,minFilter:this.minFilter,magFilter:this.magFilter,anisotropy:this.anisotropy,flipY:this.flipY,generateMipmaps:this.generateMipmaps,premultiplyAlpha:this.premultiplyAlpha,unpackAlignment:this.unpackAlignment};return Object.keys(this.userData).length>0&&(n.userData=this.userData),t||(e.textures[this.uuid]=n),n}dispose(){this.dispatchEvent({type:"dispose"})}transformUv(e){if(this.mapping!==id)return e;if(e.applyMatrix3(this.matrix),e.x<0||e.x>1)switch(this.wrapS){case _s:e.x=e.x-Math.floor(e.x);break;case sr:e.x=e.x<0?0:1;break;case fa:Math.abs(Math.floor(e.x)%2)===1?e.x=Math.ceil(e.x)-e.x:e.x=e.x-Math.floor(e.x);break}if(e.y<0||e.y>1)switch(this.wrapT){case _s:e.y=e.y-Math.floor(e.y);break;case sr:e.y=e.y<0?0:1;break;case fa:Math.abs(Math.floor(e.y)%2)===1?e.y=Math.ceil(e.y)-e.y:e.y=e.y-Math.floor(e.y);break}return this.flipY&&(e.y=1-e.y),e}set needsUpdate(e){e===!0&&(this.version++,this.source.needsUpdate=!0)}set needsPMREMUpdate(e){e===!0&&this.pmremVersion++}}hn.DEFAULT_IMAGE=null;hn.DEFAULT_MAPPING=id;hn.DEFAULT_ANISOTROPY=1;class vt{constructor(e=0,t=0,n=0,r=1){vt.prototype.isVector4=!0,this.x=e,this.y=t,this.z=n,this.w=r}get width(){return this.z}set width(e){this.z=e}get height(){return this.w}set height(e){this.w=e}set(e,t,n,r){return this.x=e,this.y=t,this.z=n,this.w=r,this}setScalar(e){return this.x=e,this.y=e,this.z=e,this.w=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setZ(e){return this.z=e,this}setW(e){return this.w=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;case 2:this.z=t;break;case 3:this.w=t;break;default:throw new Error("index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;case 2:return this.z;case 3:return this.w;default:throw new Error("index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y,this.z,this.w)}copy(e){return this.x=e.x,this.y=e.y,this.z=e.z,this.w=e.w!==void 0?e.w:1,this}add(e){return this.x+=e.x,this.y+=e.y,this.z+=e.z,this.w+=e.w,this}addScalar(e){return this.x+=e,this.y+=e,this.z+=e,this.w+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this.z=e.z+t.z,this.w=e.w+t.w,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this.z+=e.z*t,this.w+=e.w*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this.z-=e.z,this.w-=e.w,this}subScalar(e){return this.x-=e,this.y-=e,this.z-=e,this.w-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this.z=e.z-t.z,this.w=e.w-t.w,this}multiply(e){return this.x*=e.x,this.y*=e.y,this.z*=e.z,this.w*=e.w,this}multiplyScalar(e){return this.x*=e,this.y*=e,this.z*=e,this.w*=e,this}applyMatrix4(e){const t=this.x,n=this.y,r=this.z,s=this.w,o=e.elements;return this.x=o[0]*t+o[4]*n+o[8]*r+o[12]*s,this.y=o[1]*t+o[5]*n+o[9]*r+o[13]*s,this.z=o[2]*t+o[6]*n+o[10]*r+o[14]*s,this.w=o[3]*t+o[7]*n+o[11]*r+o[15]*s,this}divide(e){return this.x/=e.x,this.y/=e.y,this.z/=e.z,this.w/=e.w,this}divideScalar(e){return this.multiplyScalar(1/e)}setAxisAngleFromQuaternion(e){this.w=2*Math.acos(e.w);const t=Math.sqrt(1-e.w*e.w);return t<1e-4?(this.x=1,this.y=0,this.z=0):(this.x=e.x/t,this.y=e.y/t,this.z=e.z/t),this}setAxisAngleFromRotationMatrix(e){let t,n,r,s;const c=e.elements,l=c[0],h=c[4],u=c[8],d=c[1],p=c[5],g=c[9],b=c[2],m=c[6],f=c[10];if(Math.abs(h-d)<.01&&Math.abs(u-b)<.01&&Math.abs(g-m)<.01){if(Math.abs(h+d)<.1&&Math.abs(u+b)<.1&&Math.abs(g+m)<.1&&Math.abs(l+p+f-3)<.1)return this.set(1,0,0,0),this;t=Math.PI;const x=(l+1)/2,_=(p+1)/2,I=(f+1)/2,L=(h+d)/4,C=(u+b)/4,F=(g+m)/4;return x>_&&x>I?x<.01?(n=0,r=.707106781,s=.707106781):(n=Math.sqrt(x),r=L/n,s=C/n):_>I?_<.01?(n=.707106781,r=0,s=.707106781):(r=Math.sqrt(_),n=L/r,s=F/r):I<.01?(n=.707106781,r=.707106781,s=0):(s=Math.sqrt(I),n=C/s,r=F/s),this.set(n,r,s,t),this}let y=Math.sqrt((m-g)*(m-g)+(u-b)*(u-b)+(d-h)*(d-h));return Math.abs(y)<.001&&(y=1),this.x=(m-g)/y,this.y=(u-b)/y,this.z=(d-h)/y,this.w=Math.acos((l+p+f-1)/2),this}setFromMatrixPosition(e){const t=e.elements;return this.x=t[12],this.y=t[13],this.z=t[14],this.w=t[15],this}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this.z=Math.min(this.z,e.z),this.w=Math.min(this.w,e.w),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this.z=Math.max(this.z,e.z),this.w=Math.max(this.w,e.w),this}clamp(e,t){return this.x=Math.max(e.x,Math.min(t.x,this.x)),this.y=Math.max(e.y,Math.min(t.y,this.y)),this.z=Math.max(e.z,Math.min(t.z,this.z)),this.w=Math.max(e.w,Math.min(t.w,this.w)),this}clampScalar(e,t){return this.x=Math.max(e,Math.min(t,this.x)),this.y=Math.max(e,Math.min(t,this.y)),this.z=Math.max(e,Math.min(t,this.z)),this.w=Math.max(e,Math.min(t,this.w)),this}clampLength(e,t){const n=this.length();return this.divideScalar(n||1).multiplyScalar(Math.max(e,Math.min(t,n)))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this.w=Math.floor(this.w),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this.w=Math.ceil(this.w),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this.w=Math.round(this.w),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this.w=Math.trunc(this.w),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this.w=-this.w,this}dot(e){return this.x*e.x+this.y*e.y+this.z*e.z+this.w*e.w}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)+Math.abs(this.w)}normalize(){return this.divideScalar(this.length()||1)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this.z+=(e.z-this.z)*t,this.w+=(e.w-this.w)*t,this}lerpVectors(e,t,n){return this.x=e.x+(t.x-e.x)*n,this.y=e.y+(t.y-e.y)*n,this.z=e.z+(t.z-e.z)*n,this.w=e.w+(t.w-e.w)*n,this}equals(e){return e.x===this.x&&e.y===this.y&&e.z===this.z&&e.w===this.w}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this.z=e[t+2],this.w=e[t+3],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e[t+2]=this.z,e[t+3]=this.w,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this.z=e.getZ(t),this.w=e.getW(t),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this.w=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z,yield this.w}}class kp extends Ur{constructor(e=1,t=1,n={}){super(),this.isRenderTarget=!0,this.width=e,this.height=t,this.depth=1,this.scissor=new vt(0,0,e,t),this.scissorTest=!1,this.viewport=new vt(0,0,e,t);const r={width:e,height:t,depth:1};n=Object.assign({generateMipmaps:!1,internalFormat:null,minFilter:qn,depthBuffer:!0,stencilBuffer:!1,resolveDepthBuffer:!0,resolveStencilBuffer:!0,depthTexture:null,samples:0,count:1},n);const s=new hn(r,n.mapping,n.wrapS,n.wrapT,n.magFilter,n.minFilter,n.format,n.type,n.anisotropy,n.colorSpace);s.flipY=!1,s.generateMipmaps=n.generateMipmaps,s.internalFormat=n.internalFormat,this.textures=[];const o=n.count;for(let a=0;a<o;a++)this.textures[a]=s.clone(),this.textures[a].isRenderTargetTexture=!0;this.depthBuffer=n.depthBuffer,this.stencilBuffer=n.stencilBuffer,this.resolveDepthBuffer=n.resolveDepthBuffer,this.resolveStencilBuffer=n.resolveStencilBuffer,this.depthTexture=n.depthTexture,this.samples=n.samples}get texture(){return this.textures[0]}set texture(e){this.textures[0]=e}setSize(e,t,n=1){if(this.width!==e||this.height!==t||this.depth!==n){this.width=e,this.height=t,this.depth=n;for(let r=0,s=this.textures.length;r<s;r++)this.textures[r].image.width=e,this.textures[r].image.height=t,this.textures[r].image.depth=n;this.dispose()}this.viewport.set(0,0,e,t),this.scissor.set(0,0,e,t)}clone(){return new this.constructor().copy(this)}copy(e){this.width=e.width,this.height=e.height,this.depth=e.depth,this.scissor.copy(e.scissor),this.scissorTest=e.scissorTest,this.viewport.copy(e.viewport),this.textures.length=0;for(let n=0,r=e.textures.length;n<r;n++)this.textures[n]=e.textures[n].clone(),this.textures[n].isRenderTargetTexture=!0;const t=Object.assign({},e.texture.image);return this.texture.source=new _d(t),this.depthBuffer=e.depthBuffer,this.stencilBuffer=e.stencilBuffer,this.resolveDepthBuffer=e.resolveDepthBuffer,this.resolveStencilBuffer=e.resolveStencilBuffer,e.depthTexture!==null&&(this.depthTexture=e.depthTexture.clone()),this.samples=e.samples,this}dispose(){this.dispatchEvent({type:"dispose"})}}class Dr extends kp{constructor(e=1,t=1,n={}){super(e,t,n),this.isWebGLRenderTarget=!0}}class xd extends hn{constructor(e=null,t=1,n=1,r=1){super(null),this.isDataArrayTexture=!0,this.image={data:e,width:t,height:n,depth:r},this.magFilter=Cn,this.minFilter=Cn,this.wrapR=sr,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1,this.layerUpdates=new Set}addLayerUpdate(e){this.layerUpdates.add(e)}clearLayerUpdates(){this.layerUpdates.clear()}}class Bp extends hn{constructor(e=null,t=1,n=1,r=1){super(null),this.isData3DTexture=!0,this.image={data:e,width:t,height:n,depth:r},this.magFilter=Cn,this.minFilter=Cn,this.wrapR=sr,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}}class Ve{constructor(e=0,t=0,n=0,r=1){this.isQuaternion=!0,this._x=e,this._y=t,this._z=n,this._w=r}static slerpFlat(e,t,n,r,s,o,a){let c=n[r+0],l=n[r+1],h=n[r+2],u=n[r+3];const d=s[o+0],p=s[o+1],g=s[o+2],b=s[o+3];if(a===0){e[t+0]=c,e[t+1]=l,e[t+2]=h,e[t+3]=u;return}if(a===1){e[t+0]=d,e[t+1]=p,e[t+2]=g,e[t+3]=b;return}if(u!==b||c!==d||l!==p||h!==g){let m=1-a;const f=c*d+l*p+h*g+u*b,y=f>=0?1:-1,x=1-f*f;if(x>Number.EPSILON){const I=Math.sqrt(x),L=Math.atan2(I,f*y);m=Math.sin(m*L)/I,a=Math.sin(a*L)/I}const _=a*y;if(c=c*m+d*_,l=l*m+p*_,h=h*m+g*_,u=u*m+b*_,m===1-a){const I=1/Math.sqrt(c*c+l*l+h*h+u*u);c*=I,l*=I,h*=I,u*=I}}e[t]=c,e[t+1]=l,e[t+2]=h,e[t+3]=u}static multiplyQuaternionsFlat(e,t,n,r,s,o){const a=n[r],c=n[r+1],l=n[r+2],h=n[r+3],u=s[o],d=s[o+1],p=s[o+2],g=s[o+3];return e[t]=a*g+h*u+c*p-l*d,e[t+1]=c*g+h*d+l*u-a*p,e[t+2]=l*g+h*p+a*d-c*u,e[t+3]=h*g-a*u-c*d-l*p,e}get x(){return this._x}set x(e){this._x=e,this._onChangeCallback()}get y(){return this._y}set y(e){this._y=e,this._onChangeCallback()}get z(){return this._z}set z(e){this._z=e,this._onChangeCallback()}get w(){return this._w}set w(e){this._w=e,this._onChangeCallback()}set(e,t,n,r){return this._x=e,this._y=t,this._z=n,this._w=r,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._w)}copy(e){return this._x=e.x,this._y=e.y,this._z=e.z,this._w=e.w,this._onChangeCallback(),this}setFromEuler(e,t=!0){const n=e._x,r=e._y,s=e._z,o=e._order,a=Math.cos,c=Math.sin,l=a(n/2),h=a(r/2),u=a(s/2),d=c(n/2),p=c(r/2),g=c(s/2);switch(o){case"XYZ":this._x=d*h*u+l*p*g,this._y=l*p*u-d*h*g,this._z=l*h*g+d*p*u,this._w=l*h*u-d*p*g;break;case"YXZ":this._x=d*h*u+l*p*g,this._y=l*p*u-d*h*g,this._z=l*h*g-d*p*u,this._w=l*h*u+d*p*g;break;case"ZXY":this._x=d*h*u-l*p*g,this._y=l*p*u+d*h*g,this._z=l*h*g+d*p*u,this._w=l*h*u-d*p*g;break;case"ZYX":this._x=d*h*u-l*p*g,this._y=l*p*u+d*h*g,this._z=l*h*g-d*p*u,this._w=l*h*u+d*p*g;break;case"YZX":this._x=d*h*u+l*p*g,this._y=l*p*u+d*h*g,this._z=l*h*g-d*p*u,this._w=l*h*u-d*p*g;break;case"XZY":this._x=d*h*u-l*p*g,this._y=l*p*u-d*h*g,this._z=l*h*g+d*p*u,this._w=l*h*u+d*p*g;break;default:console.warn("THREE.Quaternion: .setFromEuler() encountered an unknown order: "+o)}return t===!0&&this._onChangeCallback(),this}setFromAxisAngle(e,t){const n=t/2,r=Math.sin(n);return this._x=e.x*r,this._y=e.y*r,this._z=e.z*r,this._w=Math.cos(n),this._onChangeCallback(),this}setFromRotationMatrix(e){const t=e.elements,n=t[0],r=t[4],s=t[8],o=t[1],a=t[5],c=t[9],l=t[2],h=t[6],u=t[10],d=n+a+u;if(d>0){const p=.5/Math.sqrt(d+1);this._w=.25/p,this._x=(h-c)*p,this._y=(s-l)*p,this._z=(o-r)*p}else if(n>a&&n>u){const p=2*Math.sqrt(1+n-a-u);this._w=(h-c)/p,this._x=.25*p,this._y=(r+o)/p,this._z=(s+l)/p}else if(a>u){const p=2*Math.sqrt(1+a-n-u);this._w=(s-l)/p,this._x=(r+o)/p,this._y=.25*p,this._z=(c+h)/p}else{const p=2*Math.sqrt(1+u-n-a);this._w=(o-r)/p,this._x=(s+l)/p,this._y=(c+h)/p,this._z=.25*p}return this._onChangeCallback(),this}setFromUnitVectors(e,t){let n=e.dot(t)+1;return n<Number.EPSILON?(n=0,Math.abs(e.x)>Math.abs(e.z)?(this._x=-e.y,this._y=e.x,this._z=0,this._w=n):(this._x=0,this._y=-e.z,this._z=e.y,this._w=n)):(this._x=e.y*t.z-e.z*t.y,this._y=e.z*t.x-e.x*t.z,this._z=e.x*t.y-e.y*t.x,this._w=n),this.normalize()}angleTo(e){return 2*Math.acos(Math.abs(xn(this.dot(e),-1,1)))}rotateTowards(e,t){const n=this.angleTo(e);if(n===0)return this;const r=Math.min(1,t/n);return this.slerp(e,r),this}identity(){return this.set(0,0,0,1)}invert(){return this.conjugate()}conjugate(){return this._x*=-1,this._y*=-1,this._z*=-1,this._onChangeCallback(),this}dot(e){return this._x*e._x+this._y*e._y+this._z*e._z+this._w*e._w}lengthSq(){return this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w}length(){return Math.sqrt(this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w)}normalize(){let e=this.length();return e===0?(this._x=0,this._y=0,this._z=0,this._w=1):(e=1/e,this._x=this._x*e,this._y=this._y*e,this._z=this._z*e,this._w=this._w*e),this._onChangeCallback(),this}multiply(e){return this.multiplyQuaternions(this,e)}premultiply(e){return this.multiplyQuaternions(e,this)}multiplyQuaternions(e,t){const n=e._x,r=e._y,s=e._z,o=e._w,a=t._x,c=t._y,l=t._z,h=t._w;return this._x=n*h+o*a+r*l-s*c,this._y=r*h+o*c+s*a-n*l,this._z=s*h+o*l+n*c-r*a,this._w=o*h-n*a-r*c-s*l,this._onChangeCallback(),this}slerp(e,t){if(t===0)return this;if(t===1)return this.copy(e);const n=this._x,r=this._y,s=this._z,o=this._w;let a=o*e._w+n*e._x+r*e._y+s*e._z;if(a<0?(this._w=-e._w,this._x=-e._x,this._y=-e._y,this._z=-e._z,a=-a):this.copy(e),a>=1)return this._w=o,this._x=n,this._y=r,this._z=s,this;const c=1-a*a;if(c<=Number.EPSILON){const p=1-t;return this._w=p*o+t*this._w,this._x=p*n+t*this._x,this._y=p*r+t*this._y,this._z=p*s+t*this._z,this.normalize(),this}const l=Math.sqrt(c),h=Math.atan2(l,a),u=Math.sin((1-t)*h)/l,d=Math.sin(t*h)/l;return this._w=o*u+this._w*d,this._x=n*u+this._x*d,this._y=r*u+this._y*d,this._z=s*u+this._z*d,this._onChangeCallback(),this}slerpQuaternions(e,t,n){return this.copy(e).slerp(t,n)}random(){const e=2*Math.PI*Math.random(),t=2*Math.PI*Math.random(),n=Math.random(),r=Math.sqrt(1-n),s=Math.sqrt(n);return this.set(r*Math.sin(e),r*Math.cos(e),s*Math.sin(t),s*Math.cos(t))}equals(e){return e._x===this._x&&e._y===this._y&&e._z===this._z&&e._w===this._w}fromArray(e,t=0){return this._x=e[t],this._y=e[t+1],this._z=e[t+2],this._w=e[t+3],this._onChangeCallback(),this}toArray(e=[],t=0){return e[t]=this._x,e[t+1]=this._y,e[t+2]=this._z,e[t+3]=this._w,e}fromBufferAttribute(e,t){return this._x=e.getX(t),this._y=e.getY(t),this._z=e.getZ(t),this._w=e.getW(t),this._onChangeCallback(),this}toJSON(){return this.toArray()}_onChange(e){return this._onChangeCallback=e,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._w}}class A{constructor(e=0,t=0,n=0){A.prototype.isVector3=!0,this.x=e,this.y=t,this.z=n}set(e,t,n){return n===void 0&&(n=this.z),this.x=e,this.y=t,this.z=n,this}setScalar(e){return this.x=e,this.y=e,this.z=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setZ(e){return this.z=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;case 2:this.z=t;break;default:throw new Error("index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;case 2:return this.z;default:throw new Error("index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y,this.z)}copy(e){return this.x=e.x,this.y=e.y,this.z=e.z,this}add(e){return this.x+=e.x,this.y+=e.y,this.z+=e.z,this}addScalar(e){return this.x+=e,this.y+=e,this.z+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this.z=e.z+t.z,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this.z+=e.z*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this.z-=e.z,this}subScalar(e){return this.x-=e,this.y-=e,this.z-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this.z=e.z-t.z,this}multiply(e){return this.x*=e.x,this.y*=e.y,this.z*=e.z,this}multiplyScalar(e){return this.x*=e,this.y*=e,this.z*=e,this}multiplyVectors(e,t){return this.x=e.x*t.x,this.y=e.y*t.y,this.z=e.z*t.z,this}applyEuler(e){return this.applyQuaternion(wh.setFromEuler(e))}applyAxisAngle(e,t){return this.applyQuaternion(wh.setFromAxisAngle(e,t))}applyMatrix3(e){const t=this.x,n=this.y,r=this.z,s=e.elements;return this.x=s[0]*t+s[3]*n+s[6]*r,this.y=s[1]*t+s[4]*n+s[7]*r,this.z=s[2]*t+s[5]*n+s[8]*r,this}applyNormalMatrix(e){return this.applyMatrix3(e).normalize()}applyMatrix4(e){const t=this.x,n=this.y,r=this.z,s=e.elements,o=1/(s[3]*t+s[7]*n+s[11]*r+s[15]);return this.x=(s[0]*t+s[4]*n+s[8]*r+s[12])*o,this.y=(s[1]*t+s[5]*n+s[9]*r+s[13])*o,this.z=(s[2]*t+s[6]*n+s[10]*r+s[14])*o,this}applyQuaternion(e){const t=this.x,n=this.y,r=this.z,s=e.x,o=e.y,a=e.z,c=e.w,l=2*(o*r-a*n),h=2*(a*t-s*r),u=2*(s*n-o*t);return this.x=t+c*l+o*u-a*h,this.y=n+c*h+a*l-s*u,this.z=r+c*u+s*h-o*l,this}project(e){return this.applyMatrix4(e.matrixWorldInverse).applyMatrix4(e.projectionMatrix)}unproject(e){return this.applyMatrix4(e.projectionMatrixInverse).applyMatrix4(e.matrixWorld)}transformDirection(e){const t=this.x,n=this.y,r=this.z,s=e.elements;return this.x=s[0]*t+s[4]*n+s[8]*r,this.y=s[1]*t+s[5]*n+s[9]*r,this.z=s[2]*t+s[6]*n+s[10]*r,this.normalize()}divide(e){return this.x/=e.x,this.y/=e.y,this.z/=e.z,this}divideScalar(e){return this.multiplyScalar(1/e)}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this.z=Math.min(this.z,e.z),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this.z=Math.max(this.z,e.z),this}clamp(e,t){return this.x=Math.max(e.x,Math.min(t.x,this.x)),this.y=Math.max(e.y,Math.min(t.y,this.y)),this.z=Math.max(e.z,Math.min(t.z,this.z)),this}clampScalar(e,t){return this.x=Math.max(e,Math.min(t,this.x)),this.y=Math.max(e,Math.min(t,this.y)),this.z=Math.max(e,Math.min(t,this.z)),this}clampLength(e,t){const n=this.length();return this.divideScalar(n||1).multiplyScalar(Math.max(e,Math.min(t,n)))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this}dot(e){return this.x*e.x+this.y*e.y+this.z*e.z}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)}normalize(){return this.divideScalar(this.length()||1)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this.z+=(e.z-this.z)*t,this}lerpVectors(e,t,n){return this.x=e.x+(t.x-e.x)*n,this.y=e.y+(t.y-e.y)*n,this.z=e.z+(t.z-e.z)*n,this}cross(e){return this.crossVectors(this,e)}crossVectors(e,t){const n=e.x,r=e.y,s=e.z,o=t.x,a=t.y,c=t.z;return this.x=r*c-s*a,this.y=s*o-n*c,this.z=n*a-r*o,this}projectOnVector(e){const t=e.lengthSq();if(t===0)return this.set(0,0,0);const n=e.dot(this)/t;return this.copy(e).multiplyScalar(n)}projectOnPlane(e){return Ha.copy(this).projectOnVector(e),this.sub(Ha)}reflect(e){return this.sub(Ha.copy(e).multiplyScalar(2*this.dot(e)))}angleTo(e){const t=Math.sqrt(this.lengthSq()*e.lengthSq());if(t===0)return Math.PI/2;const n=this.dot(e)/t;return Math.acos(xn(n,-1,1))}distanceTo(e){return Math.sqrt(this.distanceToSquared(e))}distanceToSquared(e){const t=this.x-e.x,n=this.y-e.y,r=this.z-e.z;return t*t+n*n+r*r}manhattanDistanceTo(e){return Math.abs(this.x-e.x)+Math.abs(this.y-e.y)+Math.abs(this.z-e.z)}setFromSpherical(e){return this.setFromSphericalCoords(e.radius,e.phi,e.theta)}setFromSphericalCoords(e,t,n){const r=Math.sin(t)*e;return this.x=r*Math.sin(n),this.y=Math.cos(t)*e,this.z=r*Math.cos(n),this}setFromCylindrical(e){return this.setFromCylindricalCoords(e.radius,e.theta,e.y)}setFromCylindricalCoords(e,t,n){return this.x=e*Math.sin(t),this.y=n,this.z=e*Math.cos(t),this}setFromMatrixPosition(e){const t=e.elements;return this.x=t[12],this.y=t[13],this.z=t[14],this}setFromMatrixScale(e){const t=this.setFromMatrixColumn(e,0).length(),n=this.setFromMatrixColumn(e,1).length(),r=this.setFromMatrixColumn(e,2).length();return this.x=t,this.y=n,this.z=r,this}setFromMatrixColumn(e,t){return this.fromArray(e.elements,t*4)}setFromMatrix3Column(e,t){return this.fromArray(e.elements,t*3)}setFromEuler(e){return this.x=e._x,this.y=e._y,this.z=e._z,this}setFromColor(e){return this.x=e.r,this.y=e.g,this.z=e.b,this}equals(e){return e.x===this.x&&e.y===this.y&&e.z===this.z}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this.z=e[t+2],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e[t+2]=this.z,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this.z=e.getZ(t),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this}randomDirection(){const e=Math.random()*Math.PI*2,t=Math.random()*2-1,n=Math.sqrt(1-t*t);return this.x=n*Math.cos(e),this.y=t,this.z=n*Math.sin(e),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z}}const Ha=new A,wh=new Ve;class an{constructor(e=new A(1/0,1/0,1/0),t=new A(-1/0,-1/0,-1/0)){this.isBox3=!0,this.min=e,this.max=t}set(e,t){return this.min.copy(e),this.max.copy(t),this}setFromArray(e){this.makeEmpty();for(let t=0,n=e.length;t<n;t+=3)this.expandByPoint(ti.fromArray(e,t));return this}setFromBufferAttribute(e){this.makeEmpty();for(let t=0,n=e.count;t<n;t++)this.expandByPoint(ti.fromBufferAttribute(e,t));return this}setFromPoints(e){this.makeEmpty();for(let t=0,n=e.length;t<n;t++)this.expandByPoint(e[t]);return this}setFromCenterAndSize(e,t){const n=ti.copy(t).multiplyScalar(.5);return this.min.copy(e).sub(n),this.max.copy(e).add(n),this}setFromObject(e,t=!1){return this.makeEmpty(),this.expandByObject(e,t)}clone(){return new this.constructor().copy(this)}copy(e){return this.min.copy(e.min),this.max.copy(e.max),this}makeEmpty(){return this.min.x=this.min.y=this.min.z=1/0,this.max.x=this.max.y=this.max.z=-1/0,this}isEmpty(){return this.max.x<this.min.x||this.max.y<this.min.y||this.max.z<this.min.z}getCenter(e){return this.isEmpty()?e.set(0,0,0):e.addVectors(this.min,this.max).multiplyScalar(.5)}getSize(e){return this.isEmpty()?e.set(0,0,0):e.subVectors(this.max,this.min)}expandByPoint(e){return this.min.min(e),this.max.max(e),this}expandByVector(e){return this.min.sub(e),this.max.add(e),this}expandByScalar(e){return this.min.addScalar(-e),this.max.addScalar(e),this}expandByObject(e,t=!1){e.updateWorldMatrix(!1,!1);const n=e.geometry;if(n!==void 0){const s=n.getAttribute("position");if(t===!0&&s!==void 0&&e.isInstancedMesh!==!0)for(let o=0,a=s.count;o<a;o++)e.isMesh===!0?e.getVertexPosition(o,ti):ti.fromBufferAttribute(s,o),ti.applyMatrix4(e.matrixWorld),this.expandByPoint(ti);else e.boundingBox!==void 0?(e.boundingBox===null&&e.computeBoundingBox(),go.copy(e.boundingBox)):(n.boundingBox===null&&n.computeBoundingBox(),go.copy(n.boundingBox)),go.applyMatrix4(e.matrixWorld),this.union(go)}const r=e.children;for(let s=0,o=r.length;s<o;s++)this.expandByObject(r[s],t);return this}containsPoint(e){return e.x>=this.min.x&&e.x<=this.max.x&&e.y>=this.min.y&&e.y<=this.max.y&&e.z>=this.min.z&&e.z<=this.max.z}containsBox(e){return this.min.x<=e.min.x&&e.max.x<=this.max.x&&this.min.y<=e.min.y&&e.max.y<=this.max.y&&this.min.z<=e.min.z&&e.max.z<=this.max.z}getParameter(e,t){return t.set((e.x-this.min.x)/(this.max.x-this.min.x),(e.y-this.min.y)/(this.max.y-this.min.y),(e.z-this.min.z)/(this.max.z-this.min.z))}intersectsBox(e){return e.max.x>=this.min.x&&e.min.x<=this.max.x&&e.max.y>=this.min.y&&e.min.y<=this.max.y&&e.max.z>=this.min.z&&e.min.z<=this.max.z}intersectsSphere(e){return this.clampPoint(e.center,ti),ti.distanceToSquared(e.center)<=e.radius*e.radius}intersectsPlane(e){let t,n;return e.normal.x>0?(t=e.normal.x*this.min.x,n=e.normal.x*this.max.x):(t=e.normal.x*this.max.x,n=e.normal.x*this.min.x),e.normal.y>0?(t+=e.normal.y*this.min.y,n+=e.normal.y*this.max.y):(t+=e.normal.y*this.max.y,n+=e.normal.y*this.min.y),e.normal.z>0?(t+=e.normal.z*this.min.z,n+=e.normal.z*this.max.z):(t+=e.normal.z*this.max.z,n+=e.normal.z*this.min.z),t<=-e.constant&&n>=-e.constant}intersectsTriangle(e){if(this.isEmpty())return!1;this.getCenter(Os),bo.subVectors(this.max,Os),Br.subVectors(e.a,Os),zr.subVectors(e.b,Os),Hr.subVectors(e.c,Os),Xi.subVectors(zr,Br),Qi.subVectors(Hr,zr),gr.subVectors(Br,Hr);let t=[0,-Xi.z,Xi.y,0,-Qi.z,Qi.y,0,-gr.z,gr.y,Xi.z,0,-Xi.x,Qi.z,0,-Qi.x,gr.z,0,-gr.x,-Xi.y,Xi.x,0,-Qi.y,Qi.x,0,-gr.y,gr.x,0];return!Va(t,Br,zr,Hr,bo)||(t=[1,0,0,0,1,0,0,0,1],!Va(t,Br,zr,Hr,bo))?!1:(_o.crossVectors(Xi,Qi),t=[_o.x,_o.y,_o.z],Va(t,Br,zr,Hr,bo))}clampPoint(e,t){return t.copy(e).clamp(this.min,this.max)}distanceToPoint(e){return this.clampPoint(e,ti).distanceTo(e)}getBoundingSphere(e){return this.isEmpty()?e.makeEmpty():(this.getCenter(e.center),e.radius=this.getSize(ti).length()*.5),e}intersect(e){return this.min.max(e.min),this.max.min(e.max),this.isEmpty()&&this.makeEmpty(),this}union(e){return this.min.min(e.min),this.max.max(e.max),this}applyMatrix4(e){return this.isEmpty()?this:(Ei[0].set(this.min.x,this.min.y,this.min.z).applyMatrix4(e),Ei[1].set(this.min.x,this.min.y,this.max.z).applyMatrix4(e),Ei[2].set(this.min.x,this.max.y,this.min.z).applyMatrix4(e),Ei[3].set(this.min.x,this.max.y,this.max.z).applyMatrix4(e),Ei[4].set(this.max.x,this.min.y,this.min.z).applyMatrix4(e),Ei[5].set(this.max.x,this.min.y,this.max.z).applyMatrix4(e),Ei[6].set(this.max.x,this.max.y,this.min.z).applyMatrix4(e),Ei[7].set(this.max.x,this.max.y,this.max.z).applyMatrix4(e),this.setFromPoints(Ei),this)}translate(e){return this.min.add(e),this.max.add(e),this}equals(e){return e.min.equals(this.min)&&e.max.equals(this.max)}}const Ei=[new A,new A,new A,new A,new A,new A,new A,new A],ti=new A,go=new an,Br=new A,zr=new A,Hr=new A,Xi=new A,Qi=new A,gr=new A,Os=new A,bo=new A,_o=new A,br=new A;function Va(i,e,t,n,r){for(let s=0,o=i.length-3;s<=o;s+=3){br.fromArray(i,s);const a=r.x*Math.abs(br.x)+r.y*Math.abs(br.y)+r.z*Math.abs(br.z),c=e.dot(br),l=t.dot(br),h=n.dot(br);if(Math.max(-Math.max(c,l,h),Math.min(c,l,h))>a)return!1}return!0}const zp=new an,ks=new A,Ga=new A;class xi{constructor(e=new A,t=-1){this.isSphere=!0,this.center=e,this.radius=t}set(e,t){return this.center.copy(e),this.radius=t,this}setFromPoints(e,t){const n=this.center;t!==void 0?n.copy(t):zp.setFromPoints(e).getCenter(n);let r=0;for(let s=0,o=e.length;s<o;s++)r=Math.max(r,n.distanceToSquared(e[s]));return this.radius=Math.sqrt(r),this}copy(e){return this.center.copy(e.center),this.radius=e.radius,this}isEmpty(){return this.radius<0}makeEmpty(){return this.center.set(0,0,0),this.radius=-1,this}containsPoint(e){return e.distanceToSquared(this.center)<=this.radius*this.radius}distanceToPoint(e){return e.distanceTo(this.center)-this.radius}intersectsSphere(e){const t=this.radius+e.radius;return e.center.distanceToSquared(this.center)<=t*t}intersectsBox(e){return e.intersectsSphere(this)}intersectsPlane(e){return Math.abs(e.distanceToPoint(this.center))<=this.radius}clampPoint(e,t){const n=this.center.distanceToSquared(e);return t.copy(e),n>this.radius*this.radius&&(t.sub(this.center).normalize(),t.multiplyScalar(this.radius).add(this.center)),t}getBoundingBox(e){return this.isEmpty()?(e.makeEmpty(),e):(e.set(this.center,this.center),e.expandByScalar(this.radius),e)}applyMatrix4(e){return this.center.applyMatrix4(e),this.radius=this.radius*e.getMaxScaleOnAxis(),this}translate(e){return this.center.add(e),this}expandByPoint(e){if(this.isEmpty())return this.center.copy(e),this.radius=0,this;ks.subVectors(e,this.center);const t=ks.lengthSq();if(t>this.radius*this.radius){const n=Math.sqrt(t),r=(n-this.radius)*.5;this.center.addScaledVector(ks,r/n),this.radius+=r}return this}union(e){return e.isEmpty()?this:this.isEmpty()?(this.copy(e),this):(this.center.equals(e.center)===!0?this.radius=Math.max(this.radius,e.radius):(Ga.subVectors(e.center,this.center).setLength(e.radius),this.expandByPoint(ks.copy(e.center).add(Ga)),this.expandByPoint(ks.copy(e.center).sub(Ga))),this)}equals(e){return e.center.equals(this.center)&&e.radius===this.radius}clone(){return new this.constructor().copy(this)}}const Ai=new A,Wa=new A,xo=new A,Ki=new A,qa=new A,vo=new A,ja=new A;class Ts{constructor(e=new A,t=new A(0,0,-1)){this.origin=e,this.direction=t}set(e,t){return this.origin.copy(e),this.direction.copy(t),this}copy(e){return this.origin.copy(e.origin),this.direction.copy(e.direction),this}at(e,t){return t.copy(this.origin).addScaledVector(this.direction,e)}lookAt(e){return this.direction.copy(e).sub(this.origin).normalize(),this}recast(e){return this.origin.copy(this.at(e,Ai)),this}closestPointToPoint(e,t){t.subVectors(e,this.origin);const n=t.dot(this.direction);return n<0?t.copy(this.origin):t.copy(this.origin).addScaledVector(this.direction,n)}distanceToPoint(e){return Math.sqrt(this.distanceSqToPoint(e))}distanceSqToPoint(e){const t=Ai.subVectors(e,this.origin).dot(this.direction);return t<0?this.origin.distanceToSquared(e):(Ai.copy(this.origin).addScaledVector(this.direction,t),Ai.distanceToSquared(e))}distanceSqToSegment(e,t,n,r){Wa.copy(e).add(t).multiplyScalar(.5),xo.copy(t).sub(e).normalize(),Ki.copy(this.origin).sub(Wa);const s=e.distanceTo(t)*.5,o=-this.direction.dot(xo),a=Ki.dot(this.direction),c=-Ki.dot(xo),l=Ki.lengthSq(),h=Math.abs(1-o*o);let u,d,p,g;if(h>0)if(u=o*c-a,d=o*a-c,g=s*h,u>=0)if(d>=-g)if(d<=g){const b=1/h;u*=b,d*=b,p=u*(u+o*d+2*a)+d*(o*u+d+2*c)+l}else d=s,u=Math.max(0,-(o*d+a)),p=-u*u+d*(d+2*c)+l;else d=-s,u=Math.max(0,-(o*d+a)),p=-u*u+d*(d+2*c)+l;else d<=-g?(u=Math.max(0,-(-o*s+a)),d=u>0?-s:Math.min(Math.max(-s,-c),s),p=-u*u+d*(d+2*c)+l):d<=g?(u=0,d=Math.min(Math.max(-s,-c),s),p=d*(d+2*c)+l):(u=Math.max(0,-(o*s+a)),d=u>0?s:Math.min(Math.max(-s,-c),s),p=-u*u+d*(d+2*c)+l);else d=o>0?-s:s,u=Math.max(0,-(o*d+a)),p=-u*u+d*(d+2*c)+l;return n&&n.copy(this.origin).addScaledVector(this.direction,u),r&&r.copy(Wa).addScaledVector(xo,d),p}intersectSphere(e,t){Ai.subVectors(e.center,this.origin);const n=Ai.dot(this.direction),r=Ai.dot(Ai)-n*n,s=e.radius*e.radius;if(r>s)return null;const o=Math.sqrt(s-r),a=n-o,c=n+o;return c<0?null:a<0?this.at(c,t):this.at(a,t)}intersectsSphere(e){return this.distanceSqToPoint(e.center)<=e.radius*e.radius}distanceToPlane(e){const t=e.normal.dot(this.direction);if(t===0)return e.distanceToPoint(this.origin)===0?0:null;const n=-(this.origin.dot(e.normal)+e.constant)/t;return n>=0?n:null}intersectPlane(e,t){const n=this.distanceToPlane(e);return n===null?null:this.at(n,t)}intersectsPlane(e){const t=e.distanceToPoint(this.origin);return t===0||e.normal.dot(this.direction)*t<0}intersectBox(e,t){let n,r,s,o,a,c;const l=1/this.direction.x,h=1/this.direction.y,u=1/this.direction.z,d=this.origin;return l>=0?(n=(e.min.x-d.x)*l,r=(e.max.x-d.x)*l):(n=(e.max.x-d.x)*l,r=(e.min.x-d.x)*l),h>=0?(s=(e.min.y-d.y)*h,o=(e.max.y-d.y)*h):(s=(e.max.y-d.y)*h,o=(e.min.y-d.y)*h),n>o||s>r||((s>n||isNaN(n))&&(n=s),(o<r||isNaN(r))&&(r=o),u>=0?(a=(e.min.z-d.z)*u,c=(e.max.z-d.z)*u):(a=(e.max.z-d.z)*u,c=(e.min.z-d.z)*u),n>c||a>r)||((a>n||n!==n)&&(n=a),(c<r||r!==r)&&(r=c),r<0)?null:this.at(n>=0?n:r,t)}intersectsBox(e){return this.intersectBox(e,Ai)!==null}intersectTriangle(e,t,n,r,s){qa.subVectors(t,e),vo.subVectors(n,e),ja.crossVectors(qa,vo);let o=this.direction.dot(ja),a;if(o>0){if(r)return null;a=1}else if(o<0)a=-1,o=-o;else return null;Ki.subVectors(this.origin,e);const c=a*this.direction.dot(vo.crossVectors(Ki,vo));if(c<0)return null;const l=a*this.direction.dot(qa.cross(Ki));if(l<0||c+l>o)return null;const h=-a*Ki.dot(ja);return h<0?null:this.at(h/o,s)}applyMatrix4(e){return this.origin.applyMatrix4(e),this.direction.transformDirection(e),this}equals(e){return e.origin.equals(this.origin)&&e.direction.equals(this.direction)}clone(){return new this.constructor().copy(this)}}class rt{constructor(e,t,n,r,s,o,a,c,l,h,u,d,p,g,b,m){rt.prototype.isMatrix4=!0,this.elements=[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1],e!==void 0&&this.set(e,t,n,r,s,o,a,c,l,h,u,d,p,g,b,m)}set(e,t,n,r,s,o,a,c,l,h,u,d,p,g,b,m){const f=this.elements;return f[0]=e,f[4]=t,f[8]=n,f[12]=r,f[1]=s,f[5]=o,f[9]=a,f[13]=c,f[2]=l,f[6]=h,f[10]=u,f[14]=d,f[3]=p,f[7]=g,f[11]=b,f[15]=m,this}identity(){return this.set(1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1),this}clone(){return new rt().fromArray(this.elements)}copy(e){const t=this.elements,n=e.elements;return t[0]=n[0],t[1]=n[1],t[2]=n[2],t[3]=n[3],t[4]=n[4],t[5]=n[5],t[6]=n[6],t[7]=n[7],t[8]=n[8],t[9]=n[9],t[10]=n[10],t[11]=n[11],t[12]=n[12],t[13]=n[13],t[14]=n[14],t[15]=n[15],this}copyPosition(e){const t=this.elements,n=e.elements;return t[12]=n[12],t[13]=n[13],t[14]=n[14],this}setFromMatrix3(e){const t=e.elements;return this.set(t[0],t[3],t[6],0,t[1],t[4],t[7],0,t[2],t[5],t[8],0,0,0,0,1),this}extractBasis(e,t,n){return e.setFromMatrixColumn(this,0),t.setFromMatrixColumn(this,1),n.setFromMatrixColumn(this,2),this}makeBasis(e,t,n){return this.set(e.x,t.x,n.x,0,e.y,t.y,n.y,0,e.z,t.z,n.z,0,0,0,0,1),this}extractRotation(e){const t=this.elements,n=e.elements,r=1/Vr.setFromMatrixColumn(e,0).length(),s=1/Vr.setFromMatrixColumn(e,1).length(),o=1/Vr.setFromMatrixColumn(e,2).length();return t[0]=n[0]*r,t[1]=n[1]*r,t[2]=n[2]*r,t[3]=0,t[4]=n[4]*s,t[5]=n[5]*s,t[6]=n[6]*s,t[7]=0,t[8]=n[8]*o,t[9]=n[9]*o,t[10]=n[10]*o,t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,this}makeRotationFromEuler(e){const t=this.elements,n=e.x,r=e.y,s=e.z,o=Math.cos(n),a=Math.sin(n),c=Math.cos(r),l=Math.sin(r),h=Math.cos(s),u=Math.sin(s);if(e.order==="XYZ"){const d=o*h,p=o*u,g=a*h,b=a*u;t[0]=c*h,t[4]=-c*u,t[8]=l,t[1]=p+g*l,t[5]=d-b*l,t[9]=-a*c,t[2]=b-d*l,t[6]=g+p*l,t[10]=o*c}else if(e.order==="YXZ"){const d=c*h,p=c*u,g=l*h,b=l*u;t[0]=d+b*a,t[4]=g*a-p,t[8]=o*l,t[1]=o*u,t[5]=o*h,t[9]=-a,t[2]=p*a-g,t[6]=b+d*a,t[10]=o*c}else if(e.order==="ZXY"){const d=c*h,p=c*u,g=l*h,b=l*u;t[0]=d-b*a,t[4]=-o*u,t[8]=g+p*a,t[1]=p+g*a,t[5]=o*h,t[9]=b-d*a,t[2]=-o*l,t[6]=a,t[10]=o*c}else if(e.order==="ZYX"){const d=o*h,p=o*u,g=a*h,b=a*u;t[0]=c*h,t[4]=g*l-p,t[8]=d*l+b,t[1]=c*u,t[5]=b*l+d,t[9]=p*l-g,t[2]=-l,t[6]=a*c,t[10]=o*c}else if(e.order==="YZX"){const d=o*c,p=o*l,g=a*c,b=a*l;t[0]=c*h,t[4]=b-d*u,t[8]=g*u+p,t[1]=u,t[5]=o*h,t[9]=-a*h,t[2]=-l*h,t[6]=p*u+g,t[10]=d-b*u}else if(e.order==="XZY"){const d=o*c,p=o*l,g=a*c,b=a*l;t[0]=c*h,t[4]=-u,t[8]=l*h,t[1]=d*u+b,t[5]=o*h,t[9]=p*u-g,t[2]=g*u-p,t[6]=a*h,t[10]=b*u+d}return t[3]=0,t[7]=0,t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,this}makeRotationFromQuaternion(e){return this.compose(Hp,e,Vp)}lookAt(e,t,n){const r=this.elements;return Hn.subVectors(e,t),Hn.lengthSq()===0&&(Hn.z=1),Hn.normalize(),Yi.crossVectors(n,Hn),Yi.lengthSq()===0&&(Math.abs(n.z)===1?Hn.x+=1e-4:Hn.z+=1e-4,Hn.normalize(),Yi.crossVectors(n,Hn)),Yi.normalize(),yo.crossVectors(Hn,Yi),r[0]=Yi.x,r[4]=yo.x,r[8]=Hn.x,r[1]=Yi.y,r[5]=yo.y,r[9]=Hn.y,r[2]=Yi.z,r[6]=yo.z,r[10]=Hn.z,this}multiply(e){return this.multiplyMatrices(this,e)}premultiply(e){return this.multiplyMatrices(e,this)}multiplyMatrices(e,t){const n=e.elements,r=t.elements,s=this.elements,o=n[0],a=n[4],c=n[8],l=n[12],h=n[1],u=n[5],d=n[9],p=n[13],g=n[2],b=n[6],m=n[10],f=n[14],y=n[3],x=n[7],_=n[11],I=n[15],L=r[0],C=r[4],F=r[8],w=r[12],v=r[1],T=r[5],j=r[9],q=r[13],se=r[2],ne=r[6],$=r[10],ce=r[14],P=r[3],k=r[7],W=r[11],re=r[15];return s[0]=o*L+a*v+c*se+l*P,s[4]=o*C+a*T+c*ne+l*k,s[8]=o*F+a*j+c*$+l*W,s[12]=o*w+a*q+c*ce+l*re,s[1]=h*L+u*v+d*se+p*P,s[5]=h*C+u*T+d*ne+p*k,s[9]=h*F+u*j+d*$+p*W,s[13]=h*w+u*q+d*ce+p*re,s[2]=g*L+b*v+m*se+f*P,s[6]=g*C+b*T+m*ne+f*k,s[10]=g*F+b*j+m*$+f*W,s[14]=g*w+b*q+m*ce+f*re,s[3]=y*L+x*v+_*se+I*P,s[7]=y*C+x*T+_*ne+I*k,s[11]=y*F+x*j+_*$+I*W,s[15]=y*w+x*q+_*ce+I*re,this}multiplyScalar(e){const t=this.elements;return t[0]*=e,t[4]*=e,t[8]*=e,t[12]*=e,t[1]*=e,t[5]*=e,t[9]*=e,t[13]*=e,t[2]*=e,t[6]*=e,t[10]*=e,t[14]*=e,t[3]*=e,t[7]*=e,t[11]*=e,t[15]*=e,this}determinant(){const e=this.elements,t=e[0],n=e[4],r=e[8],s=e[12],o=e[1],a=e[5],c=e[9],l=e[13],h=e[2],u=e[6],d=e[10],p=e[14],g=e[3],b=e[7],m=e[11],f=e[15];return g*(+s*c*u-r*l*u-s*a*d+n*l*d+r*a*p-n*c*p)+b*(+t*c*p-t*l*d+s*o*d-r*o*p+r*l*h-s*c*h)+m*(+t*l*u-t*a*p-s*o*u+n*o*p+s*a*h-n*l*h)+f*(-r*a*h-t*c*u+t*a*d+r*o*u-n*o*d+n*c*h)}transpose(){const e=this.elements;let t;return t=e[1],e[1]=e[4],e[4]=t,t=e[2],e[2]=e[8],e[8]=t,t=e[6],e[6]=e[9],e[9]=t,t=e[3],e[3]=e[12],e[12]=t,t=e[7],e[7]=e[13],e[13]=t,t=e[11],e[11]=e[14],e[14]=t,this}setPosition(e,t,n){const r=this.elements;return e.isVector3?(r[12]=e.x,r[13]=e.y,r[14]=e.z):(r[12]=e,r[13]=t,r[14]=n),this}invert(){const e=this.elements,t=e[0],n=e[1],r=e[2],s=e[3],o=e[4],a=e[5],c=e[6],l=e[7],h=e[8],u=e[9],d=e[10],p=e[11],g=e[12],b=e[13],m=e[14],f=e[15],y=u*m*l-b*d*l+b*c*p-a*m*p-u*c*f+a*d*f,x=g*d*l-h*m*l-g*c*p+o*m*p+h*c*f-o*d*f,_=h*b*l-g*u*l+g*a*p-o*b*p-h*a*f+o*u*f,I=g*u*c-h*b*c-g*a*d+o*b*d+h*a*m-o*u*m,L=t*y+n*x+r*_+s*I;if(L===0)return this.set(0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0);const C=1/L;return e[0]=y*C,e[1]=(b*d*s-u*m*s-b*r*p+n*m*p+u*r*f-n*d*f)*C,e[2]=(a*m*s-b*c*s+b*r*l-n*m*l-a*r*f+n*c*f)*C,e[3]=(u*c*s-a*d*s-u*r*l+n*d*l+a*r*p-n*c*p)*C,e[4]=x*C,e[5]=(h*m*s-g*d*s+g*r*p-t*m*p-h*r*f+t*d*f)*C,e[6]=(g*c*s-o*m*s-g*r*l+t*m*l+o*r*f-t*c*f)*C,e[7]=(o*d*s-h*c*s+h*r*l-t*d*l-o*r*p+t*c*p)*C,e[8]=_*C,e[9]=(g*u*s-h*b*s-g*n*p+t*b*p+h*n*f-t*u*f)*C,e[10]=(o*b*s-g*a*s+g*n*l-t*b*l-o*n*f+t*a*f)*C,e[11]=(h*a*s-o*u*s-h*n*l+t*u*l+o*n*p-t*a*p)*C,e[12]=I*C,e[13]=(h*b*r-g*u*r+g*n*d-t*b*d-h*n*m+t*u*m)*C,e[14]=(g*a*r-o*b*r-g*n*c+t*b*c+o*n*m-t*a*m)*C,e[15]=(o*u*r-h*a*r+h*n*c-t*u*c-o*n*d+t*a*d)*C,this}scale(e){const t=this.elements,n=e.x,r=e.y,s=e.z;return t[0]*=n,t[4]*=r,t[8]*=s,t[1]*=n,t[5]*=r,t[9]*=s,t[2]*=n,t[6]*=r,t[10]*=s,t[3]*=n,t[7]*=r,t[11]*=s,this}getMaxScaleOnAxis(){const e=this.elements,t=e[0]*e[0]+e[1]*e[1]+e[2]*e[2],n=e[4]*e[4]+e[5]*e[5]+e[6]*e[6],r=e[8]*e[8]+e[9]*e[9]+e[10]*e[10];return Math.sqrt(Math.max(t,n,r))}makeTranslation(e,t,n){return e.isVector3?this.set(1,0,0,e.x,0,1,0,e.y,0,0,1,e.z,0,0,0,1):this.set(1,0,0,e,0,1,0,t,0,0,1,n,0,0,0,1),this}makeRotationX(e){const t=Math.cos(e),n=Math.sin(e);return this.set(1,0,0,0,0,t,-n,0,0,n,t,0,0,0,0,1),this}makeRotationY(e){const t=Math.cos(e),n=Math.sin(e);return this.set(t,0,n,0,0,1,0,0,-n,0,t,0,0,0,0,1),this}makeRotationZ(e){const t=Math.cos(e),n=Math.sin(e);return this.set(t,-n,0,0,n,t,0,0,0,0,1,0,0,0,0,1),this}makeRotationAxis(e,t){const n=Math.cos(t),r=Math.sin(t),s=1-n,o=e.x,a=e.y,c=e.z,l=s*o,h=s*a;return this.set(l*o+n,l*a-r*c,l*c+r*a,0,l*a+r*c,h*a+n,h*c-r*o,0,l*c-r*a,h*c+r*o,s*c*c+n,0,0,0,0,1),this}makeScale(e,t,n){return this.set(e,0,0,0,0,t,0,0,0,0,n,0,0,0,0,1),this}makeShear(e,t,n,r,s,o){return this.set(1,n,s,0,e,1,o,0,t,r,1,0,0,0,0,1),this}compose(e,t,n){const r=this.elements,s=t._x,o=t._y,a=t._z,c=t._w,l=s+s,h=o+o,u=a+a,d=s*l,p=s*h,g=s*u,b=o*h,m=o*u,f=a*u,y=c*l,x=c*h,_=c*u,I=n.x,L=n.y,C=n.z;return r[0]=(1-(b+f))*I,r[1]=(p+_)*I,r[2]=(g-x)*I,r[3]=0,r[4]=(p-_)*L,r[5]=(1-(d+f))*L,r[6]=(m+y)*L,r[7]=0,r[8]=(g+x)*C,r[9]=(m-y)*C,r[10]=(1-(d+b))*C,r[11]=0,r[12]=e.x,r[13]=e.y,r[14]=e.z,r[15]=1,this}decompose(e,t,n){const r=this.elements;let s=Vr.set(r[0],r[1],r[2]).length();const o=Vr.set(r[4],r[5],r[6]).length(),a=Vr.set(r[8],r[9],r[10]).length();this.determinant()<0&&(s=-s),e.x=r[12],e.y=r[13],e.z=r[14],ni.copy(this);const l=1/s,h=1/o,u=1/a;return ni.elements[0]*=l,ni.elements[1]*=l,ni.elements[2]*=l,ni.elements[4]*=h,ni.elements[5]*=h,ni.elements[6]*=h,ni.elements[8]*=u,ni.elements[9]*=u,ni.elements[10]*=u,t.setFromRotationMatrix(ni),n.x=s,n.y=o,n.z=a,this}makePerspective(e,t,n,r,s,o,a=Fi){const c=this.elements,l=2*s/(t-e),h=2*s/(n-r),u=(t+e)/(t-e),d=(n+r)/(n-r);let p,g;if(a===Fi)p=-(o+s)/(o-s),g=-2*o*s/(o-s);else if(a===pa)p=-o/(o-s),g=-o*s/(o-s);else throw new Error("THREE.Matrix4.makePerspective(): Invalid coordinate system: "+a);return c[0]=l,c[4]=0,c[8]=u,c[12]=0,c[1]=0,c[5]=h,c[9]=d,c[13]=0,c[2]=0,c[6]=0,c[10]=p,c[14]=g,c[3]=0,c[7]=0,c[11]=-1,c[15]=0,this}makeOrthographic(e,t,n,r,s,o,a=Fi){const c=this.elements,l=1/(t-e),h=1/(n-r),u=1/(o-s),d=(t+e)*l,p=(n+r)*h;let g,b;if(a===Fi)g=(o+s)*u,b=-2*u;else if(a===pa)g=s*u,b=-1*u;else throw new Error("THREE.Matrix4.makeOrthographic(): Invalid coordinate system: "+a);return c[0]=2*l,c[4]=0,c[8]=0,c[12]=-d,c[1]=0,c[5]=2*h,c[9]=0,c[13]=-p,c[2]=0,c[6]=0,c[10]=b,c[14]=-g,c[3]=0,c[7]=0,c[11]=0,c[15]=1,this}equals(e){const t=this.elements,n=e.elements;for(let r=0;r<16;r++)if(t[r]!==n[r])return!1;return!0}fromArray(e,t=0){for(let n=0;n<16;n++)this.elements[n]=e[n+t];return this}toArray(e=[],t=0){const n=this.elements;return e[t]=n[0],e[t+1]=n[1],e[t+2]=n[2],e[t+3]=n[3],e[t+4]=n[4],e[t+5]=n[5],e[t+6]=n[6],e[t+7]=n[7],e[t+8]=n[8],e[t+9]=n[9],e[t+10]=n[10],e[t+11]=n[11],e[t+12]=n[12],e[t+13]=n[13],e[t+14]=n[14],e[t+15]=n[15],e}}const Vr=new A,ni=new rt,Hp=new A(0,0,0),Vp=new A(1,1,1),Yi=new A,yo=new A,Hn=new A,Eh=new rt,Ah=new Ve;class _i{constructor(e=0,t=0,n=0,r=_i.DEFAULT_ORDER){this.isEuler=!0,this._x=e,this._y=t,this._z=n,this._order=r}get x(){return this._x}set x(e){this._x=e,this._onChangeCallback()}get y(){return this._y}set y(e){this._y=e,this._onChangeCallback()}get z(){return this._z}set z(e){this._z=e,this._onChangeCallback()}get order(){return this._order}set order(e){this._order=e,this._onChangeCallback()}set(e,t,n,r=this._order){return this._x=e,this._y=t,this._z=n,this._order=r,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._order)}copy(e){return this._x=e._x,this._y=e._y,this._z=e._z,this._order=e._order,this._onChangeCallback(),this}setFromRotationMatrix(e,t=this._order,n=!0){const r=e.elements,s=r[0],o=r[4],a=r[8],c=r[1],l=r[5],h=r[9],u=r[2],d=r[6],p=r[10];switch(t){case"XYZ":this._y=Math.asin(xn(a,-1,1)),Math.abs(a)<.9999999?(this._x=Math.atan2(-h,p),this._z=Math.atan2(-o,s)):(this._x=Math.atan2(d,l),this._z=0);break;case"YXZ":this._x=Math.asin(-xn(h,-1,1)),Math.abs(h)<.9999999?(this._y=Math.atan2(a,p),this._z=Math.atan2(c,l)):(this._y=Math.atan2(-u,s),this._z=0);break;case"ZXY":this._x=Math.asin(xn(d,-1,1)),Math.abs(d)<.9999999?(this._y=Math.atan2(-u,p),this._z=Math.atan2(-o,l)):(this._y=0,this._z=Math.atan2(c,s));break;case"ZYX":this._y=Math.asin(-xn(u,-1,1)),Math.abs(u)<.9999999?(this._x=Math.atan2(d,p),this._z=Math.atan2(c,s)):(this._x=0,this._z=Math.atan2(-o,l));break;case"YZX":this._z=Math.asin(xn(c,-1,1)),Math.abs(c)<.9999999?(this._x=Math.atan2(-h,l),this._y=Math.atan2(-u,s)):(this._x=0,this._y=Math.atan2(a,p));break;case"XZY":this._z=Math.asin(-xn(o,-1,1)),Math.abs(o)<.9999999?(this._x=Math.atan2(d,l),this._y=Math.atan2(a,s)):(this._x=Math.atan2(-h,p),this._y=0);break;default:console.warn("THREE.Euler: .setFromRotationMatrix() encountered an unknown order: "+t)}return this._order=t,n===!0&&this._onChangeCallback(),this}setFromQuaternion(e,t,n){return Eh.makeRotationFromQuaternion(e),this.setFromRotationMatrix(Eh,t,n)}setFromVector3(e,t=this._order){return this.set(e.x,e.y,e.z,t)}reorder(e){return Ah.setFromEuler(this),this.setFromQuaternion(Ah,e)}equals(e){return e._x===this._x&&e._y===this._y&&e._z===this._z&&e._order===this._order}fromArray(e){return this._x=e[0],this._y=e[1],this._z=e[2],e[3]!==void 0&&(this._order=e[3]),this._onChangeCallback(),this}toArray(e=[],t=0){return e[t]=this._x,e[t+1]=this._y,e[t+2]=this._z,e[t+3]=this._order,e}_onChange(e){return this._onChangeCallback=e,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._order}}_i.DEFAULT_ORDER="XYZ";class Wl{constructor(){this.mask=1}set(e){this.mask=(1<<e|0)>>>0}enable(e){this.mask|=1<<e|0}enableAll(){this.mask=-1}toggle(e){this.mask^=1<<e|0}disable(e){this.mask&=~(1<<e|0)}disableAll(){this.mask=0}test(e){return(this.mask&e.mask)!==0}isEnabled(e){return(this.mask&(1<<e|0))!==0}}let Gp=0;const Th=new A,Gr=new Ve,Ti=new rt,Mo=new A,Bs=new A,Wp=new A,qp=new Ve,Rh=new A(1,0,0),Ch=new A(0,1,0),Ph=new A(0,0,1),Lh={type:"added"},jp={type:"removed"},Wr={type:"childadded",child:null},Xa={type:"childremoved",child:null};class en extends Ur{constructor(){super(),this.isObject3D=!0,Object.defineProperty(this,"id",{value:Gp++}),this.uuid=ci(),this.name="",this.type="Object3D",this.parent=null,this.children=[],this.up=en.DEFAULT_UP.clone();const e=new A,t=new _i,n=new Ve,r=new A(1,1,1);function s(){n.setFromEuler(t,!1)}function o(){t.setFromQuaternion(n,void 0,!1)}t._onChange(s),n._onChange(o),Object.defineProperties(this,{position:{configurable:!0,enumerable:!0,value:e},rotation:{configurable:!0,enumerable:!0,value:t},quaternion:{configurable:!0,enumerable:!0,value:n},scale:{configurable:!0,enumerable:!0,value:r},modelViewMatrix:{value:new rt},normalMatrix:{value:new bt}}),this.matrix=new rt,this.matrixWorld=new rt,this.matrixAutoUpdate=en.DEFAULT_MATRIX_AUTO_UPDATE,this.matrixWorldAutoUpdate=en.DEFAULT_MATRIX_WORLD_AUTO_UPDATE,this.matrixWorldNeedsUpdate=!1,this.layers=new Wl,this.visible=!0,this.castShadow=!1,this.receiveShadow=!1,this.frustumCulled=!0,this.renderOrder=0,this.animations=[],this.userData={}}onBeforeShadow(){}onAfterShadow(){}onBeforeRender(){}onAfterRender(){}applyMatrix4(e){this.matrixAutoUpdate&&this.updateMatrix(),this.matrix.premultiply(e),this.matrix.decompose(this.position,this.quaternion,this.scale)}applyQuaternion(e){return this.quaternion.premultiply(e),this}setRotationFromAxisAngle(e,t){this.quaternion.setFromAxisAngle(e,t)}setRotationFromEuler(e){this.quaternion.setFromEuler(e,!0)}setRotationFromMatrix(e){this.quaternion.setFromRotationMatrix(e)}setRotationFromQuaternion(e){this.quaternion.copy(e)}rotateOnAxis(e,t){return Gr.setFromAxisAngle(e,t),this.quaternion.multiply(Gr),this}rotateOnWorldAxis(e,t){return Gr.setFromAxisAngle(e,t),this.quaternion.premultiply(Gr),this}rotateX(e){return this.rotateOnAxis(Rh,e)}rotateY(e){return this.rotateOnAxis(Ch,e)}rotateZ(e){return this.rotateOnAxis(Ph,e)}translateOnAxis(e,t){return Th.copy(e).applyQuaternion(this.quaternion),this.position.add(Th.multiplyScalar(t)),this}translateX(e){return this.translateOnAxis(Rh,e)}translateY(e){return this.translateOnAxis(Ch,e)}translateZ(e){return this.translateOnAxis(Ph,e)}localToWorld(e){return this.updateWorldMatrix(!0,!1),e.applyMatrix4(this.matrixWorld)}worldToLocal(e){return this.updateWorldMatrix(!0,!1),e.applyMatrix4(Ti.copy(this.matrixWorld).invert())}lookAt(e,t,n){e.isVector3?Mo.copy(e):Mo.set(e,t,n);const r=this.parent;this.updateWorldMatrix(!0,!1),Bs.setFromMatrixPosition(this.matrixWorld),this.isCamera||this.isLight?Ti.lookAt(Bs,Mo,this.up):Ti.lookAt(Mo,Bs,this.up),this.quaternion.setFromRotationMatrix(Ti),r&&(Ti.extractRotation(r.matrixWorld),Gr.setFromRotationMatrix(Ti),this.quaternion.premultiply(Gr.invert()))}add(e){if(arguments.length>1){for(let t=0;t<arguments.length;t++)this.add(arguments[t]);return this}return e===this?(console.error("THREE.Object3D.add: object can't be added as a child of itself.",e),this):(e&&e.isObject3D?(e.removeFromParent(),e.parent=this,this.children.push(e),e.dispatchEvent(Lh),Wr.child=e,this.dispatchEvent(Wr),Wr.child=null):console.error("THREE.Object3D.add: object not an instance of THREE.Object3D.",e),this)}remove(e){if(arguments.length>1){for(let n=0;n<arguments.length;n++)this.remove(arguments[n]);return this}const t=this.children.indexOf(e);return t!==-1&&(e.parent=null,this.children.splice(t,1),e.dispatchEvent(jp),Xa.child=e,this.dispatchEvent(Xa),Xa.child=null),this}removeFromParent(){const e=this.parent;return e!==null&&e.remove(this),this}clear(){return this.remove(...this.children)}attach(e){return this.updateWorldMatrix(!0,!1),Ti.copy(this.matrixWorld).invert(),e.parent!==null&&(e.parent.updateWorldMatrix(!0,!1),Ti.multiply(e.parent.matrixWorld)),e.applyMatrix4(Ti),e.removeFromParent(),e.parent=this,this.children.push(e),e.updateWorldMatrix(!1,!0),e.dispatchEvent(Lh),Wr.child=e,this.dispatchEvent(Wr),Wr.child=null,this}getObjectById(e){return this.getObjectByProperty("id",e)}getObjectByName(e){return this.getObjectByProperty("name",e)}getObjectByProperty(e,t){if(this[e]===t)return this;for(let n=0,r=this.children.length;n<r;n++){const o=this.children[n].getObjectByProperty(e,t);if(o!==void 0)return o}}getObjectsByProperty(e,t,n=[]){this[e]===t&&n.push(this);const r=this.children;for(let s=0,o=r.length;s<o;s++)r[s].getObjectsByProperty(e,t,n);return n}getWorldPosition(e){return this.updateWorldMatrix(!0,!1),e.setFromMatrixPosition(this.matrixWorld)}getWorldQuaternion(e){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(Bs,e,Wp),e}getWorldScale(e){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(Bs,qp,e),e}getWorldDirection(e){this.updateWorldMatrix(!0,!1);const t=this.matrixWorld.elements;return e.set(t[8],t[9],t[10]).normalize()}raycast(){}traverse(e){e(this);const t=this.children;for(let n=0,r=t.length;n<r;n++)t[n].traverse(e)}traverseVisible(e){if(this.visible===!1)return;e(this);const t=this.children;for(let n=0,r=t.length;n<r;n++)t[n].traverseVisible(e)}traverseAncestors(e){const t=this.parent;t!==null&&(e(t),t.traverseAncestors(e))}updateMatrix(){this.matrix.compose(this.position,this.quaternion,this.scale),this.matrixWorldNeedsUpdate=!0}updateMatrixWorld(e){this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||e)&&(this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),this.matrixWorldNeedsUpdate=!1,e=!0);const t=this.children;for(let n=0,r=t.length;n<r;n++)t[n].updateMatrixWorld(e)}updateWorldMatrix(e,t){const n=this.parent;if(e===!0&&n!==null&&n.updateWorldMatrix(!0,!1),this.matrixAutoUpdate&&this.updateMatrix(),this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),t===!0){const r=this.children;for(let s=0,o=r.length;s<o;s++)r[s].updateWorldMatrix(!1,!0)}}toJSON(e){const t=e===void 0||typeof e=="string",n={};t&&(e={geometries:{},materials:{},textures:{},images:{},shapes:{},skeletons:{},animations:{},nodes:{}},n.metadata={version:4.6,type:"Object",generator:"Object3D.toJSON"});const r={};r.uuid=this.uuid,r.type=this.type,this.name!==""&&(r.name=this.name),this.castShadow===!0&&(r.castShadow=!0),this.receiveShadow===!0&&(r.receiveShadow=!0),this.visible===!1&&(r.visible=!1),this.frustumCulled===!1&&(r.frustumCulled=!1),this.renderOrder!==0&&(r.renderOrder=this.renderOrder),Object.keys(this.userData).length>0&&(r.userData=this.userData),r.layers=this.layers.mask,r.matrix=this.matrix.toArray(),r.up=this.up.toArray(),this.matrixAutoUpdate===!1&&(r.matrixAutoUpdate=!1),this.isInstancedMesh&&(r.type="InstancedMesh",r.count=this.count,r.instanceMatrix=this.instanceMatrix.toJSON(),this.instanceColor!==null&&(r.instanceColor=this.instanceColor.toJSON())),this.isBatchedMesh&&(r.type="BatchedMesh",r.perObjectFrustumCulled=this.perObjectFrustumCulled,r.sortObjects=this.sortObjects,r.drawRanges=this._drawRanges,r.reservedRanges=this._reservedRanges,r.visibility=this._visibility,r.active=this._active,r.bounds=this._bounds.map(a=>({boxInitialized:a.boxInitialized,boxMin:a.box.min.toArray(),boxMax:a.box.max.toArray(),sphereInitialized:a.sphereInitialized,sphereRadius:a.sphere.radius,sphereCenter:a.sphere.center.toArray()})),r.maxInstanceCount=this._maxInstanceCount,r.maxVertexCount=this._maxVertexCount,r.maxIndexCount=this._maxIndexCount,r.geometryInitialized=this._geometryInitialized,r.geometryCount=this._geometryCount,r.matricesTexture=this._matricesTexture.toJSON(e),this._colorsTexture!==null&&(r.colorsTexture=this._colorsTexture.toJSON(e)),this.boundingSphere!==null&&(r.boundingSphere={center:r.boundingSphere.center.toArray(),radius:r.boundingSphere.radius}),this.boundingBox!==null&&(r.boundingBox={min:r.boundingBox.min.toArray(),max:r.boundingBox.max.toArray()}));function s(a,c){return a[c.uuid]===void 0&&(a[c.uuid]=c.toJSON(e)),c.uuid}if(this.isScene)this.background&&(this.background.isColor?r.background=this.background.toJSON():this.background.isTexture&&(r.background=this.background.toJSON(e).uuid)),this.environment&&this.environment.isTexture&&this.environment.isRenderTargetTexture!==!0&&(r.environment=this.environment.toJSON(e).uuid);else if(this.isMesh||this.isLine||this.isPoints){r.geometry=s(e.geometries,this.geometry);const a=this.geometry.parameters;if(a!==void 0&&a.shapes!==void 0){const c=a.shapes;if(Array.isArray(c))for(let l=0,h=c.length;l<h;l++){const u=c[l];s(e.shapes,u)}else s(e.shapes,c)}}if(this.isSkinnedMesh&&(r.bindMode=this.bindMode,r.bindMatrix=this.bindMatrix.toArray(),this.skeleton!==void 0&&(s(e.skeletons,this.skeleton),r.skeleton=this.skeleton.uuid)),this.material!==void 0)if(Array.isArray(this.material)){const a=[];for(let c=0,l=this.material.length;c<l;c++)a.push(s(e.materials,this.material[c]));r.material=a}else r.material=s(e.materials,this.material);if(this.children.length>0){r.children=[];for(let a=0;a<this.children.length;a++)r.children.push(this.children[a].toJSON(e).object)}if(this.animations.length>0){r.animations=[];for(let a=0;a<this.animations.length;a++){const c=this.animations[a];r.animations.push(s(e.animations,c))}}if(t){const a=o(e.geometries),c=o(e.materials),l=o(e.textures),h=o(e.images),u=o(e.shapes),d=o(e.skeletons),p=o(e.animations),g=o(e.nodes);a.length>0&&(n.geometries=a),c.length>0&&(n.materials=c),l.length>0&&(n.textures=l),h.length>0&&(n.images=h),u.length>0&&(n.shapes=u),d.length>0&&(n.skeletons=d),p.length>0&&(n.animations=p),g.length>0&&(n.nodes=g)}return n.object=r,n;function o(a){const c=[];for(const l in a){const h=a[l];delete h.metadata,c.push(h)}return c}}clone(e){return new this.constructor().copy(this,e)}copy(e,t=!0){if(this.name=e.name,this.up.copy(e.up),this.position.copy(e.position),this.rotation.order=e.rotation.order,this.quaternion.copy(e.quaternion),this.scale.copy(e.scale),this.matrix.copy(e.matrix),this.matrixWorld.copy(e.matrixWorld),this.matrixAutoUpdate=e.matrixAutoUpdate,this.matrixWorldAutoUpdate=e.matrixWorldAutoUpdate,this.matrixWorldNeedsUpdate=e.matrixWorldNeedsUpdate,this.layers.mask=e.layers.mask,this.visible=e.visible,this.castShadow=e.castShadow,this.receiveShadow=e.receiveShadow,this.frustumCulled=e.frustumCulled,this.renderOrder=e.renderOrder,this.animations=e.animations.slice(),this.userData=JSON.parse(JSON.stringify(e.userData)),t===!0)for(let n=0;n<e.children.length;n++){const r=e.children[n];this.add(r.clone())}return this}}en.DEFAULT_UP=new A(0,1,0);en.DEFAULT_MATRIX_AUTO_UPDATE=!0;en.DEFAULT_MATRIX_WORLD_AUTO_UPDATE=!0;const ii=new A,Ri=new A,Qa=new A,Ci=new A,qr=new A,jr=new A,Dh=new A,Ka=new A,Ya=new A,$a=new A,Za=new vt,Ja=new vt,ec=new vt;class $n{constructor(e=new A,t=new A,n=new A){this.a=e,this.b=t,this.c=n}static getNormal(e,t,n,r){r.subVectors(n,t),ii.subVectors(e,t),r.cross(ii);const s=r.lengthSq();return s>0?r.multiplyScalar(1/Math.sqrt(s)):r.set(0,0,0)}static getBarycoord(e,t,n,r,s){ii.subVectors(r,t),Ri.subVectors(n,t),Qa.subVectors(e,t);const o=ii.dot(ii),a=ii.dot(Ri),c=ii.dot(Qa),l=Ri.dot(Ri),h=Ri.dot(Qa),u=o*l-a*a;if(u===0)return s.set(0,0,0),null;const d=1/u,p=(l*c-a*h)*d,g=(o*h-a*c)*d;return s.set(1-p-g,g,p)}static containsPoint(e,t,n,r){return this.getBarycoord(e,t,n,r,Ci)===null?!1:Ci.x>=0&&Ci.y>=0&&Ci.x+Ci.y<=1}static getInterpolation(e,t,n,r,s,o,a,c){return this.getBarycoord(e,t,n,r,Ci)===null?(c.x=0,c.y=0,"z"in c&&(c.z=0),"w"in c&&(c.w=0),null):(c.setScalar(0),c.addScaledVector(s,Ci.x),c.addScaledVector(o,Ci.y),c.addScaledVector(a,Ci.z),c)}static getInterpolatedAttribute(e,t,n,r,s,o){return Za.setScalar(0),Ja.setScalar(0),ec.setScalar(0),Za.fromBufferAttribute(e,t),Ja.fromBufferAttribute(e,n),ec.fromBufferAttribute(e,r),o.setScalar(0),o.addScaledVector(Za,s.x),o.addScaledVector(Ja,s.y),o.addScaledVector(ec,s.z),o}static isFrontFacing(e,t,n,r){return ii.subVectors(n,t),Ri.subVectors(e,t),ii.cross(Ri).dot(r)<0}set(e,t,n){return this.a.copy(e),this.b.copy(t),this.c.copy(n),this}setFromPointsAndIndices(e,t,n,r){return this.a.copy(e[t]),this.b.copy(e[n]),this.c.copy(e[r]),this}setFromAttributeAndIndices(e,t,n,r){return this.a.fromBufferAttribute(e,t),this.b.fromBufferAttribute(e,n),this.c.fromBufferAttribute(e,r),this}clone(){return new this.constructor().copy(this)}copy(e){return this.a.copy(e.a),this.b.copy(e.b),this.c.copy(e.c),this}getArea(){return ii.subVectors(this.c,this.b),Ri.subVectors(this.a,this.b),ii.cross(Ri).length()*.5}getMidpoint(e){return e.addVectors(this.a,this.b).add(this.c).multiplyScalar(1/3)}getNormal(e){return $n.getNormal(this.a,this.b,this.c,e)}getPlane(e){return e.setFromCoplanarPoints(this.a,this.b,this.c)}getBarycoord(e,t){return $n.getBarycoord(e,this.a,this.b,this.c,t)}getInterpolation(e,t,n,r,s){return $n.getInterpolation(e,this.a,this.b,this.c,t,n,r,s)}containsPoint(e){return $n.containsPoint(e,this.a,this.b,this.c)}isFrontFacing(e){return $n.isFrontFacing(this.a,this.b,this.c,e)}intersectsBox(e){return e.intersectsTriangle(this)}closestPointToPoint(e,t){const n=this.a,r=this.b,s=this.c;let o,a;qr.subVectors(r,n),jr.subVectors(s,n),Ka.subVectors(e,n);const c=qr.dot(Ka),l=jr.dot(Ka);if(c<=0&&l<=0)return t.copy(n);Ya.subVectors(e,r);const h=qr.dot(Ya),u=jr.dot(Ya);if(h>=0&&u<=h)return t.copy(r);const d=c*u-h*l;if(d<=0&&c>=0&&h<=0)return o=c/(c-h),t.copy(n).addScaledVector(qr,o);$a.subVectors(e,s);const p=qr.dot($a),g=jr.dot($a);if(g>=0&&p<=g)return t.copy(s);const b=p*l-c*g;if(b<=0&&l>=0&&g<=0)return a=l/(l-g),t.copy(n).addScaledVector(jr,a);const m=h*g-p*u;if(m<=0&&u-h>=0&&p-g>=0)return Dh.subVectors(s,r),a=(u-h)/(u-h+(p-g)),t.copy(r).addScaledVector(Dh,a);const f=1/(m+b+d);return o=b*f,a=d*f,t.copy(n).addScaledVector(qr,o).addScaledVector(jr,a)}equals(e){return e.a.equals(this.a)&&e.b.equals(this.b)&&e.c.equals(this.c)}}const vd={aliceblue:15792383,antiquewhite:16444375,aqua:65535,aquamarine:8388564,azure:15794175,beige:16119260,bisque:16770244,black:0,blanchedalmond:16772045,blue:255,blueviolet:9055202,brown:10824234,burlywood:14596231,cadetblue:6266528,chartreuse:8388352,chocolate:13789470,coral:16744272,cornflowerblue:6591981,cornsilk:16775388,crimson:14423100,cyan:65535,darkblue:139,darkcyan:35723,darkgoldenrod:12092939,darkgray:11119017,darkgreen:25600,darkgrey:11119017,darkkhaki:12433259,darkmagenta:9109643,darkolivegreen:5597999,darkorange:16747520,darkorchid:10040012,darkred:9109504,darksalmon:15308410,darkseagreen:9419919,darkslateblue:4734347,darkslategray:3100495,darkslategrey:3100495,darkturquoise:52945,darkviolet:9699539,deeppink:16716947,deepskyblue:49151,dimgray:6908265,dimgrey:6908265,dodgerblue:2003199,firebrick:11674146,floralwhite:16775920,forestgreen:2263842,fuchsia:16711935,gainsboro:14474460,ghostwhite:16316671,gold:16766720,goldenrod:14329120,gray:8421504,green:32768,greenyellow:11403055,grey:8421504,honeydew:15794160,hotpink:16738740,indianred:13458524,indigo:4915330,ivory:16777200,khaki:15787660,lavender:15132410,lavenderblush:16773365,lawngreen:8190976,lemonchiffon:16775885,lightblue:11393254,lightcoral:15761536,lightcyan:14745599,lightgoldenrodyellow:16448210,lightgray:13882323,lightgreen:9498256,lightgrey:13882323,lightpink:16758465,lightsalmon:16752762,lightseagreen:2142890,lightskyblue:8900346,lightslategray:7833753,lightslategrey:7833753,lightsteelblue:11584734,lightyellow:16777184,lime:65280,limegreen:3329330,linen:16445670,magenta:16711935,maroon:8388608,mediumaquamarine:6737322,mediumblue:205,mediumorchid:12211667,mediumpurple:9662683,mediumseagreen:3978097,mediumslateblue:8087790,mediumspringgreen:64154,mediumturquoise:4772300,mediumvioletred:13047173,midnightblue:1644912,mintcream:16121850,mistyrose:16770273,moccasin:16770229,navajowhite:16768685,navy:128,oldlace:16643558,olive:8421376,olivedrab:7048739,orange:16753920,orangered:16729344,orchid:14315734,palegoldenrod:15657130,palegreen:10025880,paleturquoise:11529966,palevioletred:14381203,papayawhip:16773077,peachpuff:16767673,peru:13468991,pink:16761035,plum:14524637,powderblue:11591910,purple:8388736,rebeccapurple:6697881,red:16711680,rosybrown:12357519,royalblue:4286945,saddlebrown:9127187,salmon:16416882,sandybrown:16032864,seagreen:3050327,seashell:16774638,sienna:10506797,silver:12632256,skyblue:8900331,slateblue:6970061,slategray:7372944,slategrey:7372944,snow:16775930,springgreen:65407,steelblue:4620980,tan:13808780,teal:32896,thistle:14204888,tomato:16737095,turquoise:4251856,violet:15631086,wheat:16113331,white:16777215,whitesmoke:16119285,yellow:16776960,yellowgreen:10145074},$i={h:0,s:0,l:0},So={h:0,s:0,l:0};function tc(i,e,t){return t<0&&(t+=1),t>1&&(t-=1),t<1/6?i+(e-i)*6*t:t<1/2?e:t<2/3?i+(e-i)*6*(2/3-t):i}class it{constructor(e,t,n){return this.isColor=!0,this.r=1,this.g=1,this.b=1,this.set(e,t,n)}set(e,t,n){if(t===void 0&&n===void 0){const r=e;r&&r.isColor?this.copy(r):typeof r=="number"?this.setHex(r):typeof r=="string"&&this.setStyle(r)}else this.setRGB(e,t,n);return this}setScalar(e){return this.r=e,this.g=e,this.b=e,this}setHex(e,t=ln){return e=Math.floor(e),this.r=(e>>16&255)/255,this.g=(e>>8&255)/255,this.b=(e&255)/255,Ct.toWorkingColorSpace(this,t),this}setRGB(e,t,n,r=Ct.workingColorSpace){return this.r=e,this.g=t,this.b=n,Ct.toWorkingColorSpace(this,r),this}setHSL(e,t,n,r=Ct.workingColorSpace){if(e=Gl(e,1),t=xn(t,0,1),n=xn(n,0,1),t===0)this.r=this.g=this.b=n;else{const s=n<=.5?n*(1+t):n+t-n*t,o=2*n-s;this.r=tc(o,s,e+1/3),this.g=tc(o,s,e),this.b=tc(o,s,e-1/3)}return Ct.toWorkingColorSpace(this,r),this}setStyle(e,t=ln){function n(s){s!==void 0&&parseFloat(s)<1&&console.warn("THREE.Color: Alpha component of "+e+" will be ignored.")}let r;if(r=/^(\w+)\(([^\)]*)\)/.exec(e)){let s;const o=r[1],a=r[2];switch(o){case"rgb":case"rgba":if(s=/^\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(a))return n(s[4]),this.setRGB(Math.min(255,parseInt(s[1],10))/255,Math.min(255,parseInt(s[2],10))/255,Math.min(255,parseInt(s[3],10))/255,t);if(s=/^\s*(\d+)\%\s*,\s*(\d+)\%\s*,\s*(\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(a))return n(s[4]),this.setRGB(Math.min(100,parseInt(s[1],10))/100,Math.min(100,parseInt(s[2],10))/100,Math.min(100,parseInt(s[3],10))/100,t);break;case"hsl":case"hsla":if(s=/^\s*(\d*\.?\d+)\s*,\s*(\d*\.?\d+)\%\s*,\s*(\d*\.?\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(a))return n(s[4]),this.setHSL(parseFloat(s[1])/360,parseFloat(s[2])/100,parseFloat(s[3])/100,t);break;default:console.warn("THREE.Color: Unknown color model "+e)}}else if(r=/^\#([A-Fa-f\d]+)$/.exec(e)){const s=r[1],o=s.length;if(o===3)return this.setRGB(parseInt(s.charAt(0),16)/15,parseInt(s.charAt(1),16)/15,parseInt(s.charAt(2),16)/15,t);if(o===6)return this.setHex(parseInt(s,16),t);console.warn("THREE.Color: Invalid hex color "+e)}else if(e&&e.length>0)return this.setColorName(e,t);return this}setColorName(e,t=ln){const n=vd[e.toLowerCase()];return n!==void 0?this.setHex(n,t):console.warn("THREE.Color: Unknown color "+e),this}clone(){return new this.constructor(this.r,this.g,this.b)}copy(e){return this.r=e.r,this.g=e.g,this.b=e.b,this}copySRGBToLinear(e){return this.r=zi(e.r),this.g=zi(e.g),this.b=zi(e.b),this}copyLinearToSRGB(e){return this.r=cs(e.r),this.g=cs(e.g),this.b=cs(e.b),this}convertSRGBToLinear(){return this.copySRGBToLinear(this),this}convertLinearToSRGB(){return this.copyLinearToSRGB(this),this}getHex(e=ln){return Ct.fromWorkingColorSpace(Sn.copy(this),e),Math.round(xn(Sn.r*255,0,255))*65536+Math.round(xn(Sn.g*255,0,255))*256+Math.round(xn(Sn.b*255,0,255))}getHexString(e=ln){return("000000"+this.getHex(e).toString(16)).slice(-6)}getHSL(e,t=Ct.workingColorSpace){Ct.fromWorkingColorSpace(Sn.copy(this),t);const n=Sn.r,r=Sn.g,s=Sn.b,o=Math.max(n,r,s),a=Math.min(n,r,s);let c,l;const h=(a+o)/2;if(a===o)c=0,l=0;else{const u=o-a;switch(l=h<=.5?u/(o+a):u/(2-o-a),o){case n:c=(r-s)/u+(r<s?6:0);break;case r:c=(s-n)/u+2;break;case s:c=(n-r)/u+4;break}c/=6}return e.h=c,e.s=l,e.l=h,e}getRGB(e,t=Ct.workingColorSpace){return Ct.fromWorkingColorSpace(Sn.copy(this),t),e.r=Sn.r,e.g=Sn.g,e.b=Sn.b,e}getStyle(e=ln){Ct.fromWorkingColorSpace(Sn.copy(this),e);const t=Sn.r,n=Sn.g,r=Sn.b;return e!==ln?`color(${e} ${t.toFixed(3)} ${n.toFixed(3)} ${r.toFixed(3)})`:`rgb(${Math.round(t*255)},${Math.round(n*255)},${Math.round(r*255)})`}offsetHSL(e,t,n){return this.getHSL($i),this.setHSL($i.h+e,$i.s+t,$i.l+n)}add(e){return this.r+=e.r,this.g+=e.g,this.b+=e.b,this}addColors(e,t){return this.r=e.r+t.r,this.g=e.g+t.g,this.b=e.b+t.b,this}addScalar(e){return this.r+=e,this.g+=e,this.b+=e,this}sub(e){return this.r=Math.max(0,this.r-e.r),this.g=Math.max(0,this.g-e.g),this.b=Math.max(0,this.b-e.b),this}multiply(e){return this.r*=e.r,this.g*=e.g,this.b*=e.b,this}multiplyScalar(e){return this.r*=e,this.g*=e,this.b*=e,this}lerp(e,t){return this.r+=(e.r-this.r)*t,this.g+=(e.g-this.g)*t,this.b+=(e.b-this.b)*t,this}lerpColors(e,t,n){return this.r=e.r+(t.r-e.r)*n,this.g=e.g+(t.g-e.g)*n,this.b=e.b+(t.b-e.b)*n,this}lerpHSL(e,t){this.getHSL($i),e.getHSL(So);const n=Zs($i.h,So.h,t),r=Zs($i.s,So.s,t),s=Zs($i.l,So.l,t);return this.setHSL(n,r,s),this}setFromVector3(e){return this.r=e.x,this.g=e.y,this.b=e.z,this}applyMatrix3(e){const t=this.r,n=this.g,r=this.b,s=e.elements;return this.r=s[0]*t+s[3]*n+s[6]*r,this.g=s[1]*t+s[4]*n+s[7]*r,this.b=s[2]*t+s[5]*n+s[8]*r,this}equals(e){return e.r===this.r&&e.g===this.g&&e.b===this.b}fromArray(e,t=0){return this.r=e[t],this.g=e[t+1],this.b=e[t+2],this}toArray(e=[],t=0){return e[t]=this.r,e[t+1]=this.g,e[t+2]=this.b,e}fromBufferAttribute(e,t){return this.r=e.getX(t),this.g=e.getY(t),this.b=e.getZ(t),this}toJSON(){return this.getHex()}*[Symbol.iterator](){yield this.r,yield this.g,yield this.b}}const Sn=new it;it.NAMES=vd;let Xp=0;class li extends Ur{static get type(){return"Material"}get type(){return this.constructor.type}set type(e){}constructor(){super(),this.isMaterial=!0,Object.defineProperty(this,"id",{value:Xp++}),this.uuid=ci(),this.name="",this.blending=os,this.side=Gi,this.vertexColors=!1,this.opacity=1,this.transparent=!1,this.alphaHash=!1,this.blendSrc=Ic,this.blendDst=Nc,this.blendEquation=Ar,this.blendSrcAlpha=null,this.blendDstAlpha=null,this.blendEquationAlpha=null,this.blendColor=new it(0,0,0),this.blendAlpha=0,this.depthFunc=ms,this.depthTest=!0,this.depthWrite=!0,this.stencilWriteMask=255,this.stencilFunc=mh,this.stencilRef=0,this.stencilFuncMask=255,this.stencilFail=Or,this.stencilZFail=Or,this.stencilZPass=Or,this.stencilWrite=!1,this.clippingPlanes=null,this.clipIntersection=!1,this.clipShadows=!1,this.shadowSide=null,this.colorWrite=!0,this.precision=null,this.polygonOffset=!1,this.polygonOffsetFactor=0,this.polygonOffsetUnits=0,this.dithering=!1,this.alphaToCoverage=!1,this.premultipliedAlpha=!1,this.forceSinglePass=!1,this.visible=!0,this.toneMapped=!0,this.userData={},this.version=0,this._alphaTest=0}get alphaTest(){return this._alphaTest}set alphaTest(e){this._alphaTest>0!=e>0&&this.version++,this._alphaTest=e}onBeforeRender(){}onBeforeCompile(){}customProgramCacheKey(){return this.onBeforeCompile.toString()}setValues(e){if(e!==void 0)for(const t in e){const n=e[t];if(n===void 0){console.warn(`THREE.Material: parameter '${t}' has value of undefined.`);continue}const r=this[t];if(r===void 0){console.warn(`THREE.Material: '${t}' is not a property of THREE.${this.type}.`);continue}r&&r.isColor?r.set(n):r&&r.isVector3&&n&&n.isVector3?r.copy(n):this[t]=n}}toJSON(e){const t=e===void 0||typeof e=="string";t&&(e={textures:{},images:{}});const n={metadata:{version:4.6,type:"Material",generator:"Material.toJSON"}};n.uuid=this.uuid,n.type=this.type,this.name!==""&&(n.name=this.name),this.color&&this.color.isColor&&(n.color=this.color.getHex()),this.roughness!==void 0&&(n.roughness=this.roughness),this.metalness!==void 0&&(n.metalness=this.metalness),this.sheen!==void 0&&(n.sheen=this.sheen),this.sheenColor&&this.sheenColor.isColor&&(n.sheenColor=this.sheenColor.getHex()),this.sheenRoughness!==void 0&&(n.sheenRoughness=this.sheenRoughness),this.emissive&&this.emissive.isColor&&(n.emissive=this.emissive.getHex()),this.emissiveIntensity!==void 0&&this.emissiveIntensity!==1&&(n.emissiveIntensity=this.emissiveIntensity),this.specular&&this.specular.isColor&&(n.specular=this.specular.getHex()),this.specularIntensity!==void 0&&(n.specularIntensity=this.specularIntensity),this.specularColor&&this.specularColor.isColor&&(n.specularColor=this.specularColor.getHex()),this.shininess!==void 0&&(n.shininess=this.shininess),this.clearcoat!==void 0&&(n.clearcoat=this.clearcoat),this.clearcoatRoughness!==void 0&&(n.clearcoatRoughness=this.clearcoatRoughness),this.clearcoatMap&&this.clearcoatMap.isTexture&&(n.clearcoatMap=this.clearcoatMap.toJSON(e).uuid),this.clearcoatRoughnessMap&&this.clearcoatRoughnessMap.isTexture&&(n.clearcoatRoughnessMap=this.clearcoatRoughnessMap.toJSON(e).uuid),this.clearcoatNormalMap&&this.clearcoatNormalMap.isTexture&&(n.clearcoatNormalMap=this.clearcoatNormalMap.toJSON(e).uuid,n.clearcoatNormalScale=this.clearcoatNormalScale.toArray()),this.dispersion!==void 0&&(n.dispersion=this.dispersion),this.iridescence!==void 0&&(n.iridescence=this.iridescence),this.iridescenceIOR!==void 0&&(n.iridescenceIOR=this.iridescenceIOR),this.iridescenceThicknessRange!==void 0&&(n.iridescenceThicknessRange=this.iridescenceThicknessRange),this.iridescenceMap&&this.iridescenceMap.isTexture&&(n.iridescenceMap=this.iridescenceMap.toJSON(e).uuid),this.iridescenceThicknessMap&&this.iridescenceThicknessMap.isTexture&&(n.iridescenceThicknessMap=this.iridescenceThicknessMap.toJSON(e).uuid),this.anisotropy!==void 0&&(n.anisotropy=this.anisotropy),this.anisotropyRotation!==void 0&&(n.anisotropyRotation=this.anisotropyRotation),this.anisotropyMap&&this.anisotropyMap.isTexture&&(n.anisotropyMap=this.anisotropyMap.toJSON(e).uuid),this.map&&this.map.isTexture&&(n.map=this.map.toJSON(e).uuid),this.matcap&&this.matcap.isTexture&&(n.matcap=this.matcap.toJSON(e).uuid),this.alphaMap&&this.alphaMap.isTexture&&(n.alphaMap=this.alphaMap.toJSON(e).uuid),this.lightMap&&this.lightMap.isTexture&&(n.lightMap=this.lightMap.toJSON(e).uuid,n.lightMapIntensity=this.lightMapIntensity),this.aoMap&&this.aoMap.isTexture&&(n.aoMap=this.aoMap.toJSON(e).uuid,n.aoMapIntensity=this.aoMapIntensity),this.bumpMap&&this.bumpMap.isTexture&&(n.bumpMap=this.bumpMap.toJSON(e).uuid,n.bumpScale=this.bumpScale),this.normalMap&&this.normalMap.isTexture&&(n.normalMap=this.normalMap.toJSON(e).uuid,n.normalMapType=this.normalMapType,n.normalScale=this.normalScale.toArray()),this.displacementMap&&this.displacementMap.isTexture&&(n.displacementMap=this.displacementMap.toJSON(e).uuid,n.displacementScale=this.displacementScale,n.displacementBias=this.displacementBias),this.roughnessMap&&this.roughnessMap.isTexture&&(n.roughnessMap=this.roughnessMap.toJSON(e).uuid),this.metalnessMap&&this.metalnessMap.isTexture&&(n.metalnessMap=this.metalnessMap.toJSON(e).uuid),this.emissiveMap&&this.emissiveMap.isTexture&&(n.emissiveMap=this.emissiveMap.toJSON(e).uuid),this.specularMap&&this.specularMap.isTexture&&(n.specularMap=this.specularMap.toJSON(e).uuid),this.specularIntensityMap&&this.specularIntensityMap.isTexture&&(n.specularIntensityMap=this.specularIntensityMap.toJSON(e).uuid),this.specularColorMap&&this.specularColorMap.isTexture&&(n.specularColorMap=this.specularColorMap.toJSON(e).uuid),this.envMap&&this.envMap.isTexture&&(n.envMap=this.envMap.toJSON(e).uuid,this.combine!==void 0&&(n.combine=this.combine)),this.envMapRotation!==void 0&&(n.envMapRotation=this.envMapRotation.toArray()),this.envMapIntensity!==void 0&&(n.envMapIntensity=this.envMapIntensity),this.reflectivity!==void 0&&(n.reflectivity=this.reflectivity),this.refractionRatio!==void 0&&(n.refractionRatio=this.refractionRatio),this.gradientMap&&this.gradientMap.isTexture&&(n.gradientMap=this.gradientMap.toJSON(e).uuid),this.transmission!==void 0&&(n.transmission=this.transmission),this.transmissionMap&&this.transmissionMap.isTexture&&(n.transmissionMap=this.transmissionMap.toJSON(e).uuid),this.thickness!==void 0&&(n.thickness=this.thickness),this.thicknessMap&&this.thicknessMap.isTexture&&(n.thicknessMap=this.thicknessMap.toJSON(e).uuid),this.attenuationDistance!==void 0&&this.attenuationDistance!==1/0&&(n.attenuationDistance=this.attenuationDistance),this.attenuationColor!==void 0&&(n.attenuationColor=this.attenuationColor.getHex()),this.size!==void 0&&(n.size=this.size),this.shadowSide!==null&&(n.shadowSide=this.shadowSide),this.sizeAttenuation!==void 0&&(n.sizeAttenuation=this.sizeAttenuation),this.blending!==os&&(n.blending=this.blending),this.side!==Gi&&(n.side=this.side),this.vertexColors===!0&&(n.vertexColors=!0),this.opacity<1&&(n.opacity=this.opacity),this.transparent===!0&&(n.transparent=!0),this.blendSrc!==Ic&&(n.blendSrc=this.blendSrc),this.blendDst!==Nc&&(n.blendDst=this.blendDst),this.blendEquation!==Ar&&(n.blendEquation=this.blendEquation),this.blendSrcAlpha!==null&&(n.blendSrcAlpha=this.blendSrcAlpha),this.blendDstAlpha!==null&&(n.blendDstAlpha=this.blendDstAlpha),this.blendEquationAlpha!==null&&(n.blendEquationAlpha=this.blendEquationAlpha),this.blendColor&&this.blendColor.isColor&&(n.blendColor=this.blendColor.getHex()),this.blendAlpha!==0&&(n.blendAlpha=this.blendAlpha),this.depthFunc!==ms&&(n.depthFunc=this.depthFunc),this.depthTest===!1&&(n.depthTest=this.depthTest),this.depthWrite===!1&&(n.depthWrite=this.depthWrite),this.colorWrite===!1&&(n.colorWrite=this.colorWrite),this.stencilWriteMask!==255&&(n.stencilWriteMask=this.stencilWriteMask),this.stencilFunc!==mh&&(n.stencilFunc=this.stencilFunc),this.stencilRef!==0&&(n.stencilRef=this.stencilRef),this.stencilFuncMask!==255&&(n.stencilFuncMask=this.stencilFuncMask),this.stencilFail!==Or&&(n.stencilFail=this.stencilFail),this.stencilZFail!==Or&&(n.stencilZFail=this.stencilZFail),this.stencilZPass!==Or&&(n.stencilZPass=this.stencilZPass),this.stencilWrite===!0&&(n.stencilWrite=this.stencilWrite),this.rotation!==void 0&&this.rotation!==0&&(n.rotation=this.rotation),this.polygonOffset===!0&&(n.polygonOffset=!0),this.polygonOffsetFactor!==0&&(n.polygonOffsetFactor=this.polygonOffsetFactor),this.polygonOffsetUnits!==0&&(n.polygonOffsetUnits=this.polygonOffsetUnits),this.linewidth!==void 0&&this.linewidth!==1&&(n.linewidth=this.linewidth),this.dashSize!==void 0&&(n.dashSize=this.dashSize),this.gapSize!==void 0&&(n.gapSize=this.gapSize),this.scale!==void 0&&(n.scale=this.scale),this.dithering===!0&&(n.dithering=!0),this.alphaTest>0&&(n.alphaTest=this.alphaTest),this.alphaHash===!0&&(n.alphaHash=!0),this.alphaToCoverage===!0&&(n.alphaToCoverage=!0),this.premultipliedAlpha===!0&&(n.premultipliedAlpha=!0),this.forceSinglePass===!0&&(n.forceSinglePass=!0),this.wireframe===!0&&(n.wireframe=!0),this.wireframeLinewidth>1&&(n.wireframeLinewidth=this.wireframeLinewidth),this.wireframeLinecap!=="round"&&(n.wireframeLinecap=this.wireframeLinecap),this.wireframeLinejoin!=="round"&&(n.wireframeLinejoin=this.wireframeLinejoin),this.flatShading===!0&&(n.flatShading=!0),this.visible===!1&&(n.visible=!1),this.toneMapped===!1&&(n.toneMapped=!1),this.fog===!1&&(n.fog=!1),Object.keys(this.userData).length>0&&(n.userData=this.userData);function r(s){const o=[];for(const a in s){const c=s[a];delete c.metadata,o.push(c)}return o}if(t){const s=r(e.textures),o=r(e.images);s.length>0&&(n.textures=s),o.length>0&&(n.images=o)}return n}clone(){return new this.constructor().copy(this)}copy(e){this.name=e.name,this.blending=e.blending,this.side=e.side,this.vertexColors=e.vertexColors,this.opacity=e.opacity,this.transparent=e.transparent,this.blendSrc=e.blendSrc,this.blendDst=e.blendDst,this.blendEquation=e.blendEquation,this.blendSrcAlpha=e.blendSrcAlpha,this.blendDstAlpha=e.blendDstAlpha,this.blendEquationAlpha=e.blendEquationAlpha,this.blendColor.copy(e.blendColor),this.blendAlpha=e.blendAlpha,this.depthFunc=e.depthFunc,this.depthTest=e.depthTest,this.depthWrite=e.depthWrite,this.stencilWriteMask=e.stencilWriteMask,this.stencilFunc=e.stencilFunc,this.stencilRef=e.stencilRef,this.stencilFuncMask=e.stencilFuncMask,this.stencilFail=e.stencilFail,this.stencilZFail=e.stencilZFail,this.stencilZPass=e.stencilZPass,this.stencilWrite=e.stencilWrite;const t=e.clippingPlanes;let n=null;if(t!==null){const r=t.length;n=new Array(r);for(let s=0;s!==r;++s)n[s]=t[s].clone()}return this.clippingPlanes=n,this.clipIntersection=e.clipIntersection,this.clipShadows=e.clipShadows,this.shadowSide=e.shadowSide,this.colorWrite=e.colorWrite,this.precision=e.precision,this.polygonOffset=e.polygonOffset,this.polygonOffsetFactor=e.polygonOffsetFactor,this.polygonOffsetUnits=e.polygonOffsetUnits,this.dithering=e.dithering,this.alphaTest=e.alphaTest,this.alphaHash=e.alphaHash,this.alphaToCoverage=e.alphaToCoverage,this.premultipliedAlpha=e.premultipliedAlpha,this.forceSinglePass=e.forceSinglePass,this.visible=e.visible,this.toneMapped=e.toneMapped,this.userData=JSON.parse(JSON.stringify(e.userData)),this}dispose(){this.dispatchEvent({type:"dispose"})}set needsUpdate(e){e===!0&&this.version++}onBuild(){console.warn("Material: onBuild() has been removed.")}}class Oi extends li{static get type(){return"MeshBasicMaterial"}constructor(e){super(),this.isMeshBasicMaterial=!0,this.color=new it(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new _i,this.combine=td,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.specularMap=e.specularMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.envMapRotation.copy(e.envMapRotation),this.combine=e.combine,this.reflectivity=e.reflectivity,this.refractionRatio=e.refractionRatio,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.fog=e.fog,this}}const sn=new A,wo=new at;class wn{constructor(e,t,n=!1){if(Array.isArray(e))throw new TypeError("THREE.BufferAttribute: array should be a Typed Array.");this.isBufferAttribute=!0,this.name="",this.array=e,this.itemSize=t,this.count=e!==void 0?e.length/t:0,this.normalized=n,this.usage=bl,this.updateRanges=[],this.gpuType=ai,this.version=0}onUploadCallback(){}set needsUpdate(e){e===!0&&this.version++}setUsage(e){return this.usage=e,this}addUpdateRange(e,t){this.updateRanges.push({start:e,count:t})}clearUpdateRanges(){this.updateRanges.length=0}copy(e){return this.name=e.name,this.array=new e.array.constructor(e.array),this.itemSize=e.itemSize,this.count=e.count,this.normalized=e.normalized,this.usage=e.usage,this.gpuType=e.gpuType,this}copyAt(e,t,n){e*=this.itemSize,n*=t.itemSize;for(let r=0,s=this.itemSize;r<s;r++)this.array[e+r]=t.array[n+r];return this}copyArray(e){return this.array.set(e),this}applyMatrix3(e){if(this.itemSize===2)for(let t=0,n=this.count;t<n;t++)wo.fromBufferAttribute(this,t),wo.applyMatrix3(e),this.setXY(t,wo.x,wo.y);else if(this.itemSize===3)for(let t=0,n=this.count;t<n;t++)sn.fromBufferAttribute(this,t),sn.applyMatrix3(e),this.setXYZ(t,sn.x,sn.y,sn.z);return this}applyMatrix4(e){for(let t=0,n=this.count;t<n;t++)sn.fromBufferAttribute(this,t),sn.applyMatrix4(e),this.setXYZ(t,sn.x,sn.y,sn.z);return this}applyNormalMatrix(e){for(let t=0,n=this.count;t<n;t++)sn.fromBufferAttribute(this,t),sn.applyNormalMatrix(e),this.setXYZ(t,sn.x,sn.y,sn.z);return this}transformDirection(e){for(let t=0,n=this.count;t<n;t++)sn.fromBufferAttribute(this,t),sn.transformDirection(e),this.setXYZ(t,sn.x,sn.y,sn.z);return this}set(e,t=0){return this.array.set(e,t),this}getComponent(e,t){let n=this.array[e*this.itemSize+t];return this.normalized&&(n=oi(n,this.array)),n}setComponent(e,t,n){return this.normalized&&(n=zt(n,this.array)),this.array[e*this.itemSize+t]=n,this}getX(e){let t=this.array[e*this.itemSize];return this.normalized&&(t=oi(t,this.array)),t}setX(e,t){return this.normalized&&(t=zt(t,this.array)),this.array[e*this.itemSize]=t,this}getY(e){let t=this.array[e*this.itemSize+1];return this.normalized&&(t=oi(t,this.array)),t}setY(e,t){return this.normalized&&(t=zt(t,this.array)),this.array[e*this.itemSize+1]=t,this}getZ(e){let t=this.array[e*this.itemSize+2];return this.normalized&&(t=oi(t,this.array)),t}setZ(e,t){return this.normalized&&(t=zt(t,this.array)),this.array[e*this.itemSize+2]=t,this}getW(e){let t=this.array[e*this.itemSize+3];return this.normalized&&(t=oi(t,this.array)),t}setW(e,t){return this.normalized&&(t=zt(t,this.array)),this.array[e*this.itemSize+3]=t,this}setXY(e,t,n){return e*=this.itemSize,this.normalized&&(t=zt(t,this.array),n=zt(n,this.array)),this.array[e+0]=t,this.array[e+1]=n,this}setXYZ(e,t,n,r){return e*=this.itemSize,this.normalized&&(t=zt(t,this.array),n=zt(n,this.array),r=zt(r,this.array)),this.array[e+0]=t,this.array[e+1]=n,this.array[e+2]=r,this}setXYZW(e,t,n,r,s){return e*=this.itemSize,this.normalized&&(t=zt(t,this.array),n=zt(n,this.array),r=zt(r,this.array),s=zt(s,this.array)),this.array[e+0]=t,this.array[e+1]=n,this.array[e+2]=r,this.array[e+3]=s,this}onUpload(e){return this.onUploadCallback=e,this}clone(){return new this.constructor(this.array,this.itemSize).copy(this)}toJSON(){const e={itemSize:this.itemSize,type:this.array.constructor.name,array:Array.from(this.array),normalized:this.normalized};return this.name!==""&&(e.name=this.name),this.usage!==bl&&(e.usage=this.usage),e}}class yd extends wn{constructor(e,t,n){super(new Uint16Array(e),t,n)}}class Md extends wn{constructor(e,t,n){super(new Uint32Array(e),t,n)}}class Hi extends wn{constructor(e,t,n){super(new Float32Array(e),t,n)}}let Qp=0;const Kn=new rt,nc=new en,Xr=new A,Vn=new an,zs=new an,gn=new A;class vi extends Ur{constructor(){super(),this.isBufferGeometry=!0,Object.defineProperty(this,"id",{value:Qp++}),this.uuid=ci(),this.name="",this.type="BufferGeometry",this.index=null,this.indirect=null,this.attributes={},this.morphAttributes={},this.morphTargetsRelative=!1,this.groups=[],this.boundingBox=null,this.boundingSphere=null,this.drawRange={start:0,count:1/0},this.userData={}}getIndex(){return this.index}setIndex(e){return Array.isArray(e)?this.index=new(bd(e)?Md:yd)(e,1):this.index=e,this}setIndirect(e){return this.indirect=e,this}getIndirect(){return this.indirect}getAttribute(e){return this.attributes[e]}setAttribute(e,t){return this.attributes[e]=t,this}deleteAttribute(e){return delete this.attributes[e],this}hasAttribute(e){return this.attributes[e]!==void 0}addGroup(e,t,n=0){this.groups.push({start:e,count:t,materialIndex:n})}clearGroups(){this.groups=[]}setDrawRange(e,t){this.drawRange.start=e,this.drawRange.count=t}applyMatrix4(e){const t=this.attributes.position;t!==void 0&&(t.applyMatrix4(e),t.needsUpdate=!0);const n=this.attributes.normal;if(n!==void 0){const s=new bt().getNormalMatrix(e);n.applyNormalMatrix(s),n.needsUpdate=!0}const r=this.attributes.tangent;return r!==void 0&&(r.transformDirection(e),r.needsUpdate=!0),this.boundingBox!==null&&this.computeBoundingBox(),this.boundingSphere!==null&&this.computeBoundingSphere(),this}applyQuaternion(e){return Kn.makeRotationFromQuaternion(e),this.applyMatrix4(Kn),this}rotateX(e){return Kn.makeRotationX(e),this.applyMatrix4(Kn),this}rotateY(e){return Kn.makeRotationY(e),this.applyMatrix4(Kn),this}rotateZ(e){return Kn.makeRotationZ(e),this.applyMatrix4(Kn),this}translate(e,t,n){return Kn.makeTranslation(e,t,n),this.applyMatrix4(Kn),this}scale(e,t,n){return Kn.makeScale(e,t,n),this.applyMatrix4(Kn),this}lookAt(e){return nc.lookAt(e),nc.updateMatrix(),this.applyMatrix4(nc.matrix),this}center(){return this.computeBoundingBox(),this.boundingBox.getCenter(Xr).negate(),this.translate(Xr.x,Xr.y,Xr.z),this}setFromPoints(e){const t=this.getAttribute("position");if(t===void 0){const n=[];for(let r=0,s=e.length;r<s;r++){const o=e[r];n.push(o.x,o.y,o.z||0)}this.setAttribute("position",new Hi(n,3))}else{for(let n=0,r=t.count;n<r;n++){const s=e[n];t.setXYZ(n,s.x,s.y,s.z||0)}e.length>t.count&&console.warn("THREE.BufferGeometry: Buffer size too small for points data. Use .dispose() and create a new geometry."),t.needsUpdate=!0}return this}computeBoundingBox(){this.boundingBox===null&&(this.boundingBox=new an);const e=this.attributes.position,t=this.morphAttributes.position;if(e&&e.isGLBufferAttribute){console.error("THREE.BufferGeometry.computeBoundingBox(): GLBufferAttribute requires a manual bounding box.",this),this.boundingBox.set(new A(-1/0,-1/0,-1/0),new A(1/0,1/0,1/0));return}if(e!==void 0){if(this.boundingBox.setFromBufferAttribute(e),t)for(let n=0,r=t.length;n<r;n++){const s=t[n];Vn.setFromBufferAttribute(s),this.morphTargetsRelative?(gn.addVectors(this.boundingBox.min,Vn.min),this.boundingBox.expandByPoint(gn),gn.addVectors(this.boundingBox.max,Vn.max),this.boundingBox.expandByPoint(gn)):(this.boundingBox.expandByPoint(Vn.min),this.boundingBox.expandByPoint(Vn.max))}}else this.boundingBox.makeEmpty();(isNaN(this.boundingBox.min.x)||isNaN(this.boundingBox.min.y)||isNaN(this.boundingBox.min.z))&&console.error('THREE.BufferGeometry.computeBoundingBox(): Computed min/max have NaN values. The "position" attribute is likely to have NaN values.',this)}computeBoundingSphere(){this.boundingSphere===null&&(this.boundingSphere=new xi);const e=this.attributes.position,t=this.morphAttributes.position;if(e&&e.isGLBufferAttribute){console.error("THREE.BufferGeometry.computeBoundingSphere(): GLBufferAttribute requires a manual bounding sphere.",this),this.boundingSphere.set(new A,1/0);return}if(e){const n=this.boundingSphere.center;if(Vn.setFromBufferAttribute(e),t)for(let s=0,o=t.length;s<o;s++){const a=t[s];zs.setFromBufferAttribute(a),this.morphTargetsRelative?(gn.addVectors(Vn.min,zs.min),Vn.expandByPoint(gn),gn.addVectors(Vn.max,zs.max),Vn.expandByPoint(gn)):(Vn.expandByPoint(zs.min),Vn.expandByPoint(zs.max))}Vn.getCenter(n);let r=0;for(let s=0,o=e.count;s<o;s++)gn.fromBufferAttribute(e,s),r=Math.max(r,n.distanceToSquared(gn));if(t)for(let s=0,o=t.length;s<o;s++){const a=t[s],c=this.morphTargetsRelative;for(let l=0,h=a.count;l<h;l++)gn.fromBufferAttribute(a,l),c&&(Xr.fromBufferAttribute(e,l),gn.add(Xr)),r=Math.max(r,n.distanceToSquared(gn))}this.boundingSphere.radius=Math.sqrt(r),isNaN(this.boundingSphere.radius)&&console.error('THREE.BufferGeometry.computeBoundingSphere(): Computed radius is NaN. The "position" attribute is likely to have NaN values.',this)}}computeTangents(){const e=this.index,t=this.attributes;if(e===null||t.position===void 0||t.normal===void 0||t.uv===void 0){console.error("THREE.BufferGeometry: .computeTangents() failed. Missing required attributes (index, position, normal or uv)");return}const n=t.position,r=t.normal,s=t.uv;this.hasAttribute("tangent")===!1&&this.setAttribute("tangent",new wn(new Float32Array(4*n.count),4));const o=this.getAttribute("tangent"),a=[],c=[];for(let F=0;F<n.count;F++)a[F]=new A,c[F]=new A;const l=new A,h=new A,u=new A,d=new at,p=new at,g=new at,b=new A,m=new A;function f(F,w,v){l.fromBufferAttribute(n,F),h.fromBufferAttribute(n,w),u.fromBufferAttribute(n,v),d.fromBufferAttribute(s,F),p.fromBufferAttribute(s,w),g.fromBufferAttribute(s,v),h.sub(l),u.sub(l),p.sub(d),g.sub(d);const T=1/(p.x*g.y-g.x*p.y);isFinite(T)&&(b.copy(h).multiplyScalar(g.y).addScaledVector(u,-p.y).multiplyScalar(T),m.copy(u).multiplyScalar(p.x).addScaledVector(h,-g.x).multiplyScalar(T),a[F].add(b),a[w].add(b),a[v].add(b),c[F].add(m),c[w].add(m),c[v].add(m))}let y=this.groups;y.length===0&&(y=[{start:0,count:e.count}]);for(let F=0,w=y.length;F<w;++F){const v=y[F],T=v.start,j=v.count;for(let q=T,se=T+j;q<se;q+=3)f(e.getX(q+0),e.getX(q+1),e.getX(q+2))}const x=new A,_=new A,I=new A,L=new A;function C(F){I.fromBufferAttribute(r,F),L.copy(I);const w=a[F];x.copy(w),x.sub(I.multiplyScalar(I.dot(w))).normalize(),_.crossVectors(L,w);const T=_.dot(c[F])<0?-1:1;o.setXYZW(F,x.x,x.y,x.z,T)}for(let F=0,w=y.length;F<w;++F){const v=y[F],T=v.start,j=v.count;for(let q=T,se=T+j;q<se;q+=3)C(e.getX(q+0)),C(e.getX(q+1)),C(e.getX(q+2))}}computeVertexNormals(){const e=this.index,t=this.getAttribute("position");if(t!==void 0){let n=this.getAttribute("normal");if(n===void 0)n=new wn(new Float32Array(t.count*3),3),this.setAttribute("normal",n);else for(let d=0,p=n.count;d<p;d++)n.setXYZ(d,0,0,0);const r=new A,s=new A,o=new A,a=new A,c=new A,l=new A,h=new A,u=new A;if(e)for(let d=0,p=e.count;d<p;d+=3){const g=e.getX(d+0),b=e.getX(d+1),m=e.getX(d+2);r.fromBufferAttribute(t,g),s.fromBufferAttribute(t,b),o.fromBufferAttribute(t,m),h.subVectors(o,s),u.subVectors(r,s),h.cross(u),a.fromBufferAttribute(n,g),c.fromBufferAttribute(n,b),l.fromBufferAttribute(n,m),a.add(h),c.add(h),l.add(h),n.setXYZ(g,a.x,a.y,a.z),n.setXYZ(b,c.x,c.y,c.z),n.setXYZ(m,l.x,l.y,l.z)}else for(let d=0,p=t.count;d<p;d+=3)r.fromBufferAttribute(t,d+0),s.fromBufferAttribute(t,d+1),o.fromBufferAttribute(t,d+2),h.subVectors(o,s),u.subVectors(r,s),h.cross(u),n.setXYZ(d+0,h.x,h.y,h.z),n.setXYZ(d+1,h.x,h.y,h.z),n.setXYZ(d+2,h.x,h.y,h.z);this.normalizeNormals(),n.needsUpdate=!0}}normalizeNormals(){const e=this.attributes.normal;for(let t=0,n=e.count;t<n;t++)gn.fromBufferAttribute(e,t),gn.normalize(),e.setXYZ(t,gn.x,gn.y,gn.z)}toNonIndexed(){function e(a,c){const l=a.array,h=a.itemSize,u=a.normalized,d=new l.constructor(c.length*h);let p=0,g=0;for(let b=0,m=c.length;b<m;b++){a.isInterleavedBufferAttribute?p=c[b]*a.data.stride+a.offset:p=c[b]*h;for(let f=0;f<h;f++)d[g++]=l[p++]}return new wn(d,h,u)}if(this.index===null)return console.warn("THREE.BufferGeometry.toNonIndexed(): BufferGeometry is already non-indexed."),this;const t=new vi,n=this.index.array,r=this.attributes;for(const a in r){const c=r[a],l=e(c,n);t.setAttribute(a,l)}const s=this.morphAttributes;for(const a in s){const c=[],l=s[a];for(let h=0,u=l.length;h<u;h++){const d=l[h],p=e(d,n);c.push(p)}t.morphAttributes[a]=c}t.morphTargetsRelative=this.morphTargetsRelative;const o=this.groups;for(let a=0,c=o.length;a<c;a++){const l=o[a];t.addGroup(l.start,l.count,l.materialIndex)}return t}toJSON(){const e={metadata:{version:4.6,type:"BufferGeometry",generator:"BufferGeometry.toJSON"}};if(e.uuid=this.uuid,e.type=this.type,this.name!==""&&(e.name=this.name),Object.keys(this.userData).length>0&&(e.userData=this.userData),this.parameters!==void 0){const c=this.parameters;for(const l in c)c[l]!==void 0&&(e[l]=c[l]);return e}e.data={attributes:{}};const t=this.index;t!==null&&(e.data.index={type:t.array.constructor.name,array:Array.prototype.slice.call(t.array)});const n=this.attributes;for(const c in n){const l=n[c];e.data.attributes[c]=l.toJSON(e.data)}const r={};let s=!1;for(const c in this.morphAttributes){const l=this.morphAttributes[c],h=[];for(let u=0,d=l.length;u<d;u++){const p=l[u];h.push(p.toJSON(e.data))}h.length>0&&(r[c]=h,s=!0)}s&&(e.data.morphAttributes=r,e.data.morphTargetsRelative=this.morphTargetsRelative);const o=this.groups;o.length>0&&(e.data.groups=JSON.parse(JSON.stringify(o)));const a=this.boundingSphere;return a!==null&&(e.data.boundingSphere={center:a.center.toArray(),radius:a.radius}),e}clone(){return new this.constructor().copy(this)}copy(e){this.index=null,this.attributes={},this.morphAttributes={},this.groups=[],this.boundingBox=null,this.boundingSphere=null;const t={};this.name=e.name;const n=e.index;n!==null&&this.setIndex(n.clone(t));const r=e.attributes;for(const l in r){const h=r[l];this.setAttribute(l,h.clone(t))}const s=e.morphAttributes;for(const l in s){const h=[],u=s[l];for(let d=0,p=u.length;d<p;d++)h.push(u[d].clone(t));this.morphAttributes[l]=h}this.morphTargetsRelative=e.morphTargetsRelative;const o=e.groups;for(let l=0,h=o.length;l<h;l++){const u=o[l];this.addGroup(u.start,u.count,u.materialIndex)}const a=e.boundingBox;a!==null&&(this.boundingBox=a.clone());const c=e.boundingSphere;return c!==null&&(this.boundingSphere=c.clone()),this.drawRange.start=e.drawRange.start,this.drawRange.count=e.drawRange.count,this.userData=e.userData,this}dispose(){this.dispatchEvent({type:"dispose"})}}const Ih=new rt,_r=new Ts,Eo=new xi,Nh=new A,Ao=new A,To=new A,Ro=new A,ic=new A,Co=new A,Uh=new A,Po=new A;class jt extends en{constructor(e=new vi,t=new Oi){super(),this.isMesh=!0,this.type="Mesh",this.geometry=e,this.material=t,this.updateMorphTargets()}copy(e,t){return super.copy(e,t),e.morphTargetInfluences!==void 0&&(this.morphTargetInfluences=e.morphTargetInfluences.slice()),e.morphTargetDictionary!==void 0&&(this.morphTargetDictionary=Object.assign({},e.morphTargetDictionary)),this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}updateMorphTargets(){const t=this.geometry.morphAttributes,n=Object.keys(t);if(n.length>0){const r=t[n[0]];if(r!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let s=0,o=r.length;s<o;s++){const a=r[s].name||String(s);this.morphTargetInfluences.push(0),this.morphTargetDictionary[a]=s}}}}getVertexPosition(e,t){const n=this.geometry,r=n.attributes.position,s=n.morphAttributes.position,o=n.morphTargetsRelative;t.fromBufferAttribute(r,e);const a=this.morphTargetInfluences;if(s&&a){Co.set(0,0,0);for(let c=0,l=s.length;c<l;c++){const h=a[c],u=s[c];h!==0&&(ic.fromBufferAttribute(u,e),o?Co.addScaledVector(ic,h):Co.addScaledVector(ic.sub(t),h))}t.add(Co)}return t}raycast(e,t){const n=this.geometry,r=this.material,s=this.matrixWorld;r!==void 0&&(n.boundingSphere===null&&n.computeBoundingSphere(),Eo.copy(n.boundingSphere),Eo.applyMatrix4(s),_r.copy(e.ray).recast(e.near),!(Eo.containsPoint(_r.origin)===!1&&(_r.intersectSphere(Eo,Nh)===null||_r.origin.distanceToSquared(Nh)>(e.far-e.near)**2))&&(Ih.copy(s).invert(),_r.copy(e.ray).applyMatrix4(Ih),!(n.boundingBox!==null&&_r.intersectsBox(n.boundingBox)===!1)&&this._computeIntersections(e,t,_r)))}_computeIntersections(e,t,n){let r;const s=this.geometry,o=this.material,a=s.index,c=s.attributes.position,l=s.attributes.uv,h=s.attributes.uv1,u=s.attributes.normal,d=s.groups,p=s.drawRange;if(a!==null)if(Array.isArray(o))for(let g=0,b=d.length;g<b;g++){const m=d[g],f=o[m.materialIndex],y=Math.max(m.start,p.start),x=Math.min(a.count,Math.min(m.start+m.count,p.start+p.count));for(let _=y,I=x;_<I;_+=3){const L=a.getX(_),C=a.getX(_+1),F=a.getX(_+2);r=Lo(this,f,e,n,l,h,u,L,C,F),r&&(r.faceIndex=Math.floor(_/3),r.face.materialIndex=m.materialIndex,t.push(r))}}else{const g=Math.max(0,p.start),b=Math.min(a.count,p.start+p.count);for(let m=g,f=b;m<f;m+=3){const y=a.getX(m),x=a.getX(m+1),_=a.getX(m+2);r=Lo(this,o,e,n,l,h,u,y,x,_),r&&(r.faceIndex=Math.floor(m/3),t.push(r))}}else if(c!==void 0)if(Array.isArray(o))for(let g=0,b=d.length;g<b;g++){const m=d[g],f=o[m.materialIndex],y=Math.max(m.start,p.start),x=Math.min(c.count,Math.min(m.start+m.count,p.start+p.count));for(let _=y,I=x;_<I;_+=3){const L=_,C=_+1,F=_+2;r=Lo(this,f,e,n,l,h,u,L,C,F),r&&(r.faceIndex=Math.floor(_/3),r.face.materialIndex=m.materialIndex,t.push(r))}}else{const g=Math.max(0,p.start),b=Math.min(c.count,p.start+p.count);for(let m=g,f=b;m<f;m+=3){const y=m,x=m+1,_=m+2;r=Lo(this,o,e,n,l,h,u,y,x,_),r&&(r.faceIndex=Math.floor(m/3),t.push(r))}}}}function Kp(i,e,t,n,r,s,o,a){let c;if(e.side===Rn?c=n.intersectTriangle(o,s,r,!0,a):c=n.intersectTriangle(r,s,o,e.side===Gi,a),c===null)return null;Po.copy(a),Po.applyMatrix4(i.matrixWorld);const l=t.ray.origin.distanceTo(Po);return l<t.near||l>t.far?null:{distance:l,point:Po.clone(),object:i}}function Lo(i,e,t,n,r,s,o,a,c,l){i.getVertexPosition(a,Ao),i.getVertexPosition(c,To),i.getVertexPosition(l,Ro);const h=Kp(i,e,t,n,Ao,To,Ro,Uh);if(h){const u=new A;$n.getBarycoord(Uh,Ao,To,Ro,u),r&&(h.uv=$n.getInterpolatedAttribute(r,a,c,l,u,new at)),s&&(h.uv1=$n.getInterpolatedAttribute(s,a,c,l,u,new at)),o&&(h.normal=$n.getInterpolatedAttribute(o,a,c,l,u,new A),h.normal.dot(n.direction)>0&&h.normal.multiplyScalar(-1));const d={a,b:c,c:l,normal:new A,materialIndex:0};$n.getNormal(Ao,To,Ro,d.normal),h.face=d,h.barycoord=u}return h}class Rs extends vi{constructor(e=1,t=1,n=1,r=1,s=1,o=1){super(),this.type="BoxGeometry",this.parameters={width:e,height:t,depth:n,widthSegments:r,heightSegments:s,depthSegments:o};const a=this;r=Math.floor(r),s=Math.floor(s),o=Math.floor(o);const c=[],l=[],h=[],u=[];let d=0,p=0;g("z","y","x",-1,-1,n,t,e,o,s,0),g("z","y","x",1,-1,n,t,-e,o,s,1),g("x","z","y",1,1,e,n,t,r,o,2),g("x","z","y",1,-1,e,n,-t,r,o,3),g("x","y","z",1,-1,e,t,n,r,s,4),g("x","y","z",-1,-1,e,t,-n,r,s,5),this.setIndex(c),this.setAttribute("position",new Hi(l,3)),this.setAttribute("normal",new Hi(h,3)),this.setAttribute("uv",new Hi(u,2));function g(b,m,f,y,x,_,I,L,C,F,w){const v=_/C,T=I/F,j=_/2,q=I/2,se=L/2,ne=C+1,$=F+1;let ce=0,P=0;const k=new A;for(let W=0;W<$;W++){const re=W*T-q;for(let he=0;he<ne;he++){const ye=he*v-j;k[b]=ye*y,k[m]=re*x,k[f]=se,l.push(k.x,k.y,k.z),k[b]=0,k[m]=0,k[f]=L>0?1:-1,h.push(k.x,k.y,k.z),u.push(he/C),u.push(1-W/F),ce+=1}}for(let W=0;W<F;W++)for(let re=0;re<C;re++){const he=d+re+ne*W,ye=d+re+ne*(W+1),J=d+(re+1)+ne*(W+1),fe=d+(re+1)+ne*W;c.push(he,ye,fe),c.push(ye,J,fe),P+=6}a.addGroup(p,P,w),p+=P,d+=ce}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new Rs(e.width,e.height,e.depth,e.widthSegments,e.heightSegments,e.depthSegments)}}function Ms(i){const e={};for(const t in i){e[t]={};for(const n in i[t]){const r=i[t][n];r&&(r.isColor||r.isMatrix3||r.isMatrix4||r.isVector2||r.isVector3||r.isVector4||r.isTexture||r.isQuaternion)?r.isRenderTargetTexture?(console.warn("UniformsUtils: Textures of render targets cannot be cloned via cloneUniforms() or mergeUniforms()."),e[t][n]=null):e[t][n]=r.clone():Array.isArray(r)?e[t][n]=r.slice():e[t][n]=r}}return e}function Tn(i){const e={};for(let t=0;t<i.length;t++){const n=Ms(i[t]);for(const r in n)e[r]=n[r]}return e}function Yp(i){const e=[];for(let t=0;t<i.length;t++)e.push(i[t].clone());return e}function Sd(i){const e=i.getRenderTarget();return e===null?i.outputColorSpace:e.isXRRenderTarget===!0?e.texture.colorSpace:Ct.workingColorSpace}const $p={clone:Ms,merge:Tn};var Zp=`void main() {
	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}`,Jp=`void main() {
	gl_FragColor = vec4( 1.0, 0.0, 0.0, 1.0 );
}`;class hr extends li{static get type(){return"ShaderMaterial"}constructor(e){super(),this.isShaderMaterial=!0,this.defines={},this.uniforms={},this.uniformsGroups=[],this.vertexShader=Zp,this.fragmentShader=Jp,this.linewidth=1,this.wireframe=!1,this.wireframeLinewidth=1,this.fog=!1,this.lights=!1,this.clipping=!1,this.forceSinglePass=!0,this.extensions={clipCullDistance:!1,multiDraw:!1},this.defaultAttributeValues={color:[1,1,1],uv:[0,0],uv1:[0,0]},this.index0AttributeName=void 0,this.uniformsNeedUpdate=!1,this.glslVersion=null,e!==void 0&&this.setValues(e)}copy(e){return super.copy(e),this.fragmentShader=e.fragmentShader,this.vertexShader=e.vertexShader,this.uniforms=Ms(e.uniforms),this.uniformsGroups=Yp(e.uniformsGroups),this.defines=Object.assign({},e.defines),this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.fog=e.fog,this.lights=e.lights,this.clipping=e.clipping,this.extensions=Object.assign({},e.extensions),this.glslVersion=e.glslVersion,this}toJSON(e){const t=super.toJSON(e);t.glslVersion=this.glslVersion,t.uniforms={};for(const r in this.uniforms){const o=this.uniforms[r].value;o&&o.isTexture?t.uniforms[r]={type:"t",value:o.toJSON(e).uuid}:o&&o.isColor?t.uniforms[r]={type:"c",value:o.getHex()}:o&&o.isVector2?t.uniforms[r]={type:"v2",value:o.toArray()}:o&&o.isVector3?t.uniforms[r]={type:"v3",value:o.toArray()}:o&&o.isVector4?t.uniforms[r]={type:"v4",value:o.toArray()}:o&&o.isMatrix3?t.uniforms[r]={type:"m3",value:o.toArray()}:o&&o.isMatrix4?t.uniforms[r]={type:"m4",value:o.toArray()}:t.uniforms[r]={value:o}}Object.keys(this.defines).length>0&&(t.defines=this.defines),t.vertexShader=this.vertexShader,t.fragmentShader=this.fragmentShader,t.lights=this.lights,t.clipping=this.clipping;const n={};for(const r in this.extensions)this.extensions[r]===!0&&(n[r]=!0);return Object.keys(n).length>0&&(t.extensions=n),t}}class wd extends en{constructor(){super(),this.isCamera=!0,this.type="Camera",this.matrixWorldInverse=new rt,this.projectionMatrix=new rt,this.projectionMatrixInverse=new rt,this.coordinateSystem=Fi}copy(e,t){return super.copy(e,t),this.matrixWorldInverse.copy(e.matrixWorldInverse),this.projectionMatrix.copy(e.projectionMatrix),this.projectionMatrixInverse.copy(e.projectionMatrixInverse),this.coordinateSystem=e.coordinateSystem,this}getWorldDirection(e){return super.getWorldDirection(e).negate()}updateMatrixWorld(e){super.updateMatrixWorld(e),this.matrixWorldInverse.copy(this.matrixWorld).invert()}updateWorldMatrix(e,t){super.updateWorldMatrix(e,t),this.matrixWorldInverse.copy(this.matrixWorld).invert()}clone(){return new this.constructor().copy(this)}}const Zi=new A,Fh=new at,Oh=new at;class vn extends wd{constructor(e=50,t=1,n=.1,r=2e3){super(),this.isPerspectiveCamera=!0,this.type="PerspectiveCamera",this.fov=e,this.zoom=1,this.near=n,this.far=r,this.focus=10,this.aspect=t,this.view=null,this.filmGauge=35,this.filmOffset=0,this.updateProjectionMatrix()}copy(e,t){return super.copy(e,t),this.fov=e.fov,this.zoom=e.zoom,this.near=e.near,this.far=e.far,this.focus=e.focus,this.aspect=e.aspect,this.view=e.view===null?null:Object.assign({},e.view),this.filmGauge=e.filmGauge,this.filmOffset=e.filmOffset,this}setFocalLength(e){const t=.5*this.getFilmHeight()/e;this.fov=ys*2*Math.atan(t),this.updateProjectionMatrix()}getFocalLength(){const e=Math.tan($s*.5*this.fov);return .5*this.getFilmHeight()/e}getEffectiveFOV(){return ys*2*Math.atan(Math.tan($s*.5*this.fov)/this.zoom)}getFilmWidth(){return this.filmGauge*Math.min(this.aspect,1)}getFilmHeight(){return this.filmGauge/Math.max(this.aspect,1)}getViewBounds(e,t,n){Zi.set(-1,-1,.5).applyMatrix4(this.projectionMatrixInverse),t.set(Zi.x,Zi.y).multiplyScalar(-e/Zi.z),Zi.set(1,1,.5).applyMatrix4(this.projectionMatrixInverse),n.set(Zi.x,Zi.y).multiplyScalar(-e/Zi.z)}getViewSize(e,t){return this.getViewBounds(e,Fh,Oh),t.subVectors(Oh,Fh)}setViewOffset(e,t,n,r,s,o){this.aspect=e/t,this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=e,this.view.fullHeight=t,this.view.offsetX=n,this.view.offsetY=r,this.view.width=s,this.view.height=o,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const e=this.near;let t=e*Math.tan($s*.5*this.fov)/this.zoom,n=2*t,r=this.aspect*n,s=-.5*r;const o=this.view;if(this.view!==null&&this.view.enabled){const c=o.fullWidth,l=o.fullHeight;s+=o.offsetX*r/c,t-=o.offsetY*n/l,r*=o.width/c,n*=o.height/l}const a=this.filmOffset;a!==0&&(s+=e*a/this.getFilmWidth()),this.projectionMatrix.makePerspective(s,s+r,t,t-n,e,this.far,this.coordinateSystem),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(e){const t=super.toJSON(e);return t.object.fov=this.fov,t.object.zoom=this.zoom,t.object.near=this.near,t.object.far=this.far,t.object.focus=this.focus,t.object.aspect=this.aspect,this.view!==null&&(t.object.view=Object.assign({},this.view)),t.object.filmGauge=this.filmGauge,t.object.filmOffset=this.filmOffset,t}}const Qr=-90,Kr=1;class em extends en{constructor(e,t,n){super(),this.type="CubeCamera",this.renderTarget=n,this.coordinateSystem=null,this.activeMipmapLevel=0;const r=new vn(Qr,Kr,e,t);r.layers=this.layers,this.add(r);const s=new vn(Qr,Kr,e,t);s.layers=this.layers,this.add(s);const o=new vn(Qr,Kr,e,t);o.layers=this.layers,this.add(o);const a=new vn(Qr,Kr,e,t);a.layers=this.layers,this.add(a);const c=new vn(Qr,Kr,e,t);c.layers=this.layers,this.add(c);const l=new vn(Qr,Kr,e,t);l.layers=this.layers,this.add(l)}updateCoordinateSystem(){const e=this.coordinateSystem,t=this.children.concat(),[n,r,s,o,a,c]=t;for(const l of t)this.remove(l);if(e===Fi)n.up.set(0,1,0),n.lookAt(1,0,0),r.up.set(0,1,0),r.lookAt(-1,0,0),s.up.set(0,0,-1),s.lookAt(0,1,0),o.up.set(0,0,1),o.lookAt(0,-1,0),a.up.set(0,1,0),a.lookAt(0,0,1),c.up.set(0,1,0),c.lookAt(0,0,-1);else if(e===pa)n.up.set(0,-1,0),n.lookAt(-1,0,0),r.up.set(0,-1,0),r.lookAt(1,0,0),s.up.set(0,0,1),s.lookAt(0,1,0),o.up.set(0,0,-1),o.lookAt(0,-1,0),a.up.set(0,-1,0),a.lookAt(0,0,1),c.up.set(0,-1,0),c.lookAt(0,0,-1);else throw new Error("THREE.CubeCamera.updateCoordinateSystem(): Invalid coordinate system: "+e);for(const l of t)this.add(l),l.updateMatrixWorld()}update(e,t){this.parent===null&&this.updateMatrixWorld();const{renderTarget:n,activeMipmapLevel:r}=this;this.coordinateSystem!==e.coordinateSystem&&(this.coordinateSystem=e.coordinateSystem,this.updateCoordinateSystem());const[s,o,a,c,l,h]=this.children,u=e.getRenderTarget(),d=e.getActiveCubeFace(),p=e.getActiveMipmapLevel(),g=e.xr.enabled;e.xr.enabled=!1;const b=n.texture.generateMipmaps;n.texture.generateMipmaps=!1,e.setRenderTarget(n,0,r),e.render(t,s),e.setRenderTarget(n,1,r),e.render(t,o),e.setRenderTarget(n,2,r),e.render(t,a),e.setRenderTarget(n,3,r),e.render(t,c),e.setRenderTarget(n,4,r),e.render(t,l),n.texture.generateMipmaps=b,e.setRenderTarget(n,5,r),e.render(t,h),e.setRenderTarget(u,d,p),e.xr.enabled=g,n.texture.needsPMREMUpdate=!0}}class Ed extends hn{constructor(e,t,n,r,s,o,a,c,l,h){e=e!==void 0?e:[],t=t!==void 0?t:gs,super(e,t,n,r,s,o,a,c,l,h),this.isCubeTexture=!0,this.flipY=!1}get images(){return this.image}set images(e){this.image=e}}class tm extends Dr{constructor(e=1,t={}){super(e,e,t),this.isWebGLCubeRenderTarget=!0;const n={width:e,height:e,depth:1},r=[n,n,n,n,n,n];this.texture=new Ed(r,t.mapping,t.wrapS,t.wrapT,t.magFilter,t.minFilter,t.format,t.type,t.anisotropy,t.colorSpace),this.texture.isRenderTargetTexture=!0,this.texture.generateMipmaps=t.generateMipmaps!==void 0?t.generateMipmaps:!1,this.texture.minFilter=t.minFilter!==void 0?t.minFilter:qn}fromEquirectangularTexture(e,t){this.texture.type=t.type,this.texture.colorSpace=t.colorSpace,this.texture.generateMipmaps=t.generateMipmaps,this.texture.minFilter=t.minFilter,this.texture.magFilter=t.magFilter;const n={uniforms:{tEquirect:{value:null}},vertexShader:`

				varying vec3 vWorldDirection;

				vec3 transformDirection( in vec3 dir, in mat4 matrix ) {

					return normalize( ( matrix * vec4( dir, 0.0 ) ).xyz );

				}

				void main() {

					vWorldDirection = transformDirection( position, modelMatrix );

					#include <begin_vertex>
					#include <project_vertex>

				}
			`,fragmentShader:`

				uniform sampler2D tEquirect;

				varying vec3 vWorldDirection;

				#include <common>

				void main() {

					vec3 direction = normalize( vWorldDirection );

					vec2 sampleUV = equirectUv( direction );

					gl_FragColor = texture2D( tEquirect, sampleUV );

				}
			`},r=new Rs(5,5,5),s=new hr({name:"CubemapFromEquirect",uniforms:Ms(n.uniforms),vertexShader:n.vertexShader,fragmentShader:n.fragmentShader,side:Rn,blending:ar});s.uniforms.tEquirect.value=t;const o=new jt(r,s),a=t.minFilter;return t.minFilter===Ui&&(t.minFilter=qn),new em(1,10,this).update(e,o),t.minFilter=a,o.geometry.dispose(),o.material.dispose(),this}clear(e,t,n,r){const s=e.getRenderTarget();for(let o=0;o<6;o++)e.setRenderTarget(this,o),e.clear(t,n,r);e.setRenderTarget(s)}}const rc=new A,nm=new A,im=new bt;class nr{constructor(e=new A(1,0,0),t=0){this.isPlane=!0,this.normal=e,this.constant=t}set(e,t){return this.normal.copy(e),this.constant=t,this}setComponents(e,t,n,r){return this.normal.set(e,t,n),this.constant=r,this}setFromNormalAndCoplanarPoint(e,t){return this.normal.copy(e),this.constant=-t.dot(this.normal),this}setFromCoplanarPoints(e,t,n){const r=rc.subVectors(n,t).cross(nm.subVectors(e,t)).normalize();return this.setFromNormalAndCoplanarPoint(r,e),this}copy(e){return this.normal.copy(e.normal),this.constant=e.constant,this}normalize(){const e=1/this.normal.length();return this.normal.multiplyScalar(e),this.constant*=e,this}negate(){return this.constant*=-1,this.normal.negate(),this}distanceToPoint(e){return this.normal.dot(e)+this.constant}distanceToSphere(e){return this.distanceToPoint(e.center)-e.radius}projectPoint(e,t){return t.copy(e).addScaledVector(this.normal,-this.distanceToPoint(e))}intersectLine(e,t){const n=e.delta(rc),r=this.normal.dot(n);if(r===0)return this.distanceToPoint(e.start)===0?t.copy(e.start):null;const s=-(e.start.dot(this.normal)+this.constant)/r;return s<0||s>1?null:t.copy(e.start).addScaledVector(n,s)}intersectsLine(e){const t=this.distanceToPoint(e.start),n=this.distanceToPoint(e.end);return t<0&&n>0||n<0&&t>0}intersectsBox(e){return e.intersectsPlane(this)}intersectsSphere(e){return e.intersectsPlane(this)}coplanarPoint(e){return e.copy(this.normal).multiplyScalar(-this.constant)}applyMatrix4(e,t){const n=t||im.getNormalMatrix(e),r=this.coplanarPoint(rc).applyMatrix4(e),s=this.normal.applyMatrix3(n).normalize();return this.constant=-r.dot(s),this}translate(e){return this.constant-=e.dot(this.normal),this}equals(e){return e.normal.equals(this.normal)&&e.constant===this.constant}clone(){return new this.constructor().copy(this)}}const xr=new xi,Do=new A;class ql{constructor(e=new nr,t=new nr,n=new nr,r=new nr,s=new nr,o=new nr){this.planes=[e,t,n,r,s,o]}set(e,t,n,r,s,o){const a=this.planes;return a[0].copy(e),a[1].copy(t),a[2].copy(n),a[3].copy(r),a[4].copy(s),a[5].copy(o),this}copy(e){const t=this.planes;for(let n=0;n<6;n++)t[n].copy(e.planes[n]);return this}setFromProjectionMatrix(e,t=Fi){const n=this.planes,r=e.elements,s=r[0],o=r[1],a=r[2],c=r[3],l=r[4],h=r[5],u=r[6],d=r[7],p=r[8],g=r[9],b=r[10],m=r[11],f=r[12],y=r[13],x=r[14],_=r[15];if(n[0].setComponents(c-s,d-l,m-p,_-f).normalize(),n[1].setComponents(c+s,d+l,m+p,_+f).normalize(),n[2].setComponents(c+o,d+h,m+g,_+y).normalize(),n[3].setComponents(c-o,d-h,m-g,_-y).normalize(),n[4].setComponents(c-a,d-u,m-b,_-x).normalize(),t===Fi)n[5].setComponents(c+a,d+u,m+b,_+x).normalize();else if(t===pa)n[5].setComponents(a,u,b,x).normalize();else throw new Error("THREE.Frustum.setFromProjectionMatrix(): Invalid coordinate system: "+t);return this}intersectsObject(e){if(e.boundingSphere!==void 0)e.boundingSphere===null&&e.computeBoundingSphere(),xr.copy(e.boundingSphere).applyMatrix4(e.matrixWorld);else{const t=e.geometry;t.boundingSphere===null&&t.computeBoundingSphere(),xr.copy(t.boundingSphere).applyMatrix4(e.matrixWorld)}return this.intersectsSphere(xr)}intersectsSprite(e){return xr.center.set(0,0,0),xr.radius=.7071067811865476,xr.applyMatrix4(e.matrixWorld),this.intersectsSphere(xr)}intersectsSphere(e){const t=this.planes,n=e.center,r=-e.radius;for(let s=0;s<6;s++)if(t[s].distanceToPoint(n)<r)return!1;return!0}intersectsBox(e){const t=this.planes;for(let n=0;n<6;n++){const r=t[n];if(Do.x=r.normal.x>0?e.max.x:e.min.x,Do.y=r.normal.y>0?e.max.y:e.min.y,Do.z=r.normal.z>0?e.max.z:e.min.z,r.distanceToPoint(Do)<0)return!1}return!0}containsPoint(e){const t=this.planes;for(let n=0;n<6;n++)if(t[n].distanceToPoint(e)<0)return!1;return!0}clone(){return new this.constructor().copy(this)}}function Ad(){let i=null,e=!1,t=null,n=null;function r(s,o){t(s,o),n=i.requestAnimationFrame(r)}return{start:function(){e!==!0&&t!==null&&(n=i.requestAnimationFrame(r),e=!0)},stop:function(){i.cancelAnimationFrame(n),e=!1},setAnimationLoop:function(s){t=s},setContext:function(s){i=s}}}function rm(i){const e=new WeakMap;function t(a,c){const l=a.array,h=a.usage,u=l.byteLength,d=i.createBuffer();i.bindBuffer(c,d),i.bufferData(c,l,h),a.onUploadCallback();let p;if(l instanceof Float32Array)p=i.FLOAT;else if(l instanceof Uint16Array)a.isFloat16BufferAttribute?p=i.HALF_FLOAT:p=i.UNSIGNED_SHORT;else if(l instanceof Int16Array)p=i.SHORT;else if(l instanceof Uint32Array)p=i.UNSIGNED_INT;else if(l instanceof Int32Array)p=i.INT;else if(l instanceof Int8Array)p=i.BYTE;else if(l instanceof Uint8Array)p=i.UNSIGNED_BYTE;else if(l instanceof Uint8ClampedArray)p=i.UNSIGNED_BYTE;else throw new Error("THREE.WebGLAttributes: Unsupported buffer data format: "+l);return{buffer:d,type:p,bytesPerElement:l.BYTES_PER_ELEMENT,version:a.version,size:u}}function n(a,c,l){const h=c.array,u=c.updateRanges;if(i.bindBuffer(l,a),u.length===0)i.bufferSubData(l,0,h);else{u.sort((p,g)=>p.start-g.start);let d=0;for(let p=1;p<u.length;p++){const g=u[d],b=u[p];b.start<=g.start+g.count+1?g.count=Math.max(g.count,b.start+b.count-g.start):(++d,u[d]=b)}u.length=d+1;for(let p=0,g=u.length;p<g;p++){const b=u[p];i.bufferSubData(l,b.start*h.BYTES_PER_ELEMENT,h,b.start,b.count)}c.clearUpdateRanges()}c.onUploadCallback()}function r(a){return a.isInterleavedBufferAttribute&&(a=a.data),e.get(a)}function s(a){a.isInterleavedBufferAttribute&&(a=a.data);const c=e.get(a);c&&(i.deleteBuffer(c.buffer),e.delete(a))}function o(a,c){if(a.isInterleavedBufferAttribute&&(a=a.data),a.isGLBufferAttribute){const h=e.get(a);(!h||h.version<a.version)&&e.set(a,{buffer:a.buffer,type:a.type,bytesPerElement:a.elementSize,version:a.version});return}const l=e.get(a);if(l===void 0)e.set(a,t(a,c));else if(l.version<a.version){if(l.size!==a.array.byteLength)throw new Error("THREE.WebGLAttributes: The size of the buffer attribute's array buffer does not match the original size. Resizing buffer attributes is not supported.");n(l.buffer,a,c),l.version=a.version}}return{get:r,remove:s,update:o}}class Cs extends vi{constructor(e=1,t=1,n=1,r=1){super(),this.type="PlaneGeometry",this.parameters={width:e,height:t,widthSegments:n,heightSegments:r};const s=e/2,o=t/2,a=Math.floor(n),c=Math.floor(r),l=a+1,h=c+1,u=e/a,d=t/c,p=[],g=[],b=[],m=[];for(let f=0;f<h;f++){const y=f*d-o;for(let x=0;x<l;x++){const _=x*u-s;g.push(_,-y,0),b.push(0,0,1),m.push(x/a),m.push(1-f/c)}}for(let f=0;f<c;f++)for(let y=0;y<a;y++){const x=y+l*f,_=y+l*(f+1),I=y+1+l*(f+1),L=y+1+l*f;p.push(x,_,L),p.push(_,I,L)}this.setIndex(p),this.setAttribute("position",new Hi(g,3)),this.setAttribute("normal",new Hi(b,3)),this.setAttribute("uv",new Hi(m,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new Cs(e.width,e.height,e.widthSegments,e.heightSegments)}}var sm=`#ifdef USE_ALPHAHASH
	if ( diffuseColor.a < getAlphaHashThreshold( vPosition ) ) discard;
#endif`,om=`#ifdef USE_ALPHAHASH
	const float ALPHA_HASH_SCALE = 0.05;
	float hash2D( vec2 value ) {
		return fract( 1.0e4 * sin( 17.0 * value.x + 0.1 * value.y ) * ( 0.1 + abs( sin( 13.0 * value.y + value.x ) ) ) );
	}
	float hash3D( vec3 value ) {
		return hash2D( vec2( hash2D( value.xy ), value.z ) );
	}
	float getAlphaHashThreshold( vec3 position ) {
		float maxDeriv = max(
			length( dFdx( position.xyz ) ),
			length( dFdy( position.xyz ) )
		);
		float pixScale = 1.0 / ( ALPHA_HASH_SCALE * maxDeriv );
		vec2 pixScales = vec2(
			exp2( floor( log2( pixScale ) ) ),
			exp2( ceil( log2( pixScale ) ) )
		);
		vec2 alpha = vec2(
			hash3D( floor( pixScales.x * position.xyz ) ),
			hash3D( floor( pixScales.y * position.xyz ) )
		);
		float lerpFactor = fract( log2( pixScale ) );
		float x = ( 1.0 - lerpFactor ) * alpha.x + lerpFactor * alpha.y;
		float a = min( lerpFactor, 1.0 - lerpFactor );
		vec3 cases = vec3(
			x * x / ( 2.0 * a * ( 1.0 - a ) ),
			( x - 0.5 * a ) / ( 1.0 - a ),
			1.0 - ( ( 1.0 - x ) * ( 1.0 - x ) / ( 2.0 * a * ( 1.0 - a ) ) )
		);
		float threshold = ( x < ( 1.0 - a ) )
			? ( ( x < a ) ? cases.x : cases.y )
			: cases.z;
		return clamp( threshold , 1.0e-6, 1.0 );
	}
#endif`,am=`#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, vAlphaMapUv ).g;
#endif`,cm=`#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,lm=`#ifdef USE_ALPHATEST
	#ifdef ALPHA_TO_COVERAGE
	diffuseColor.a = smoothstep( alphaTest, alphaTest + fwidth( diffuseColor.a ), diffuseColor.a );
	if ( diffuseColor.a == 0.0 ) discard;
	#else
	if ( diffuseColor.a < alphaTest ) discard;
	#endif
#endif`,hm=`#ifdef USE_ALPHATEST
	uniform float alphaTest;
#endif`,um=`#ifdef USE_AOMAP
	float ambientOcclusion = ( texture2D( aoMap, vAoMapUv ).r - 1.0 ) * aoMapIntensity + 1.0;
	reflectedLight.indirectDiffuse *= ambientOcclusion;
	#if defined( USE_CLEARCOAT ) 
		clearcoatSpecularIndirect *= ambientOcclusion;
	#endif
	#if defined( USE_SHEEN ) 
		sheenSpecularIndirect *= ambientOcclusion;
	#endif
	#if defined( USE_ENVMAP ) && defined( STANDARD )
		float dotNV = saturate( dot( geometryNormal, geometryViewDir ) );
		reflectedLight.indirectSpecular *= computeSpecularOcclusion( dotNV, ambientOcclusion, material.roughness );
	#endif
#endif`,dm=`#ifdef USE_AOMAP
	uniform sampler2D aoMap;
	uniform float aoMapIntensity;
#endif`,fm=`#ifdef USE_BATCHING
	#if ! defined( GL_ANGLE_multi_draw )
	#define gl_DrawID _gl_DrawID
	uniform int _gl_DrawID;
	#endif
	uniform highp sampler2D batchingTexture;
	uniform highp usampler2D batchingIdTexture;
	mat4 getBatchingMatrix( const in float i ) {
		int size = textureSize( batchingTexture, 0 ).x;
		int j = int( i ) * 4;
		int x = j % size;
		int y = j / size;
		vec4 v1 = texelFetch( batchingTexture, ivec2( x, y ), 0 );
		vec4 v2 = texelFetch( batchingTexture, ivec2( x + 1, y ), 0 );
		vec4 v3 = texelFetch( batchingTexture, ivec2( x + 2, y ), 0 );
		vec4 v4 = texelFetch( batchingTexture, ivec2( x + 3, y ), 0 );
		return mat4( v1, v2, v3, v4 );
	}
	float getIndirectIndex( const in int i ) {
		int size = textureSize( batchingIdTexture, 0 ).x;
		int x = i % size;
		int y = i / size;
		return float( texelFetch( batchingIdTexture, ivec2( x, y ), 0 ).r );
	}
#endif
#ifdef USE_BATCHING_COLOR
	uniform sampler2D batchingColorTexture;
	vec3 getBatchingColor( const in float i ) {
		int size = textureSize( batchingColorTexture, 0 ).x;
		int j = int( i );
		int x = j % size;
		int y = j / size;
		return texelFetch( batchingColorTexture, ivec2( x, y ), 0 ).rgb;
	}
#endif`,pm=`#ifdef USE_BATCHING
	mat4 batchingMatrix = getBatchingMatrix( getIndirectIndex( gl_DrawID ) );
#endif`,mm=`vec3 transformed = vec3( position );
#ifdef USE_ALPHAHASH
	vPosition = vec3( position );
#endif`,gm=`vec3 objectNormal = vec3( normal );
#ifdef USE_TANGENT
	vec3 objectTangent = vec3( tangent.xyz );
#endif`,bm=`float G_BlinnPhong_Implicit( ) {
	return 0.25;
}
float D_BlinnPhong( const in float shininess, const in float dotNH ) {
	return RECIPROCAL_PI * ( shininess * 0.5 + 1.0 ) * pow( dotNH, shininess );
}
vec3 BRDF_BlinnPhong( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in vec3 specularColor, const in float shininess ) {
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNH = saturate( dot( normal, halfDir ) );
	float dotVH = saturate( dot( viewDir, halfDir ) );
	vec3 F = F_Schlick( specularColor, 1.0, dotVH );
	float G = G_BlinnPhong_Implicit( );
	float D = D_BlinnPhong( shininess, dotNH );
	return F * ( G * D );
} // validated`,_m=`#ifdef USE_IRIDESCENCE
	const mat3 XYZ_TO_REC709 = mat3(
		 3.2404542, -0.9692660,  0.0556434,
		-1.5371385,  1.8760108, -0.2040259,
		-0.4985314,  0.0415560,  1.0572252
	);
	vec3 Fresnel0ToIor( vec3 fresnel0 ) {
		vec3 sqrtF0 = sqrt( fresnel0 );
		return ( vec3( 1.0 ) + sqrtF0 ) / ( vec3( 1.0 ) - sqrtF0 );
	}
	vec3 IorToFresnel0( vec3 transmittedIor, float incidentIor ) {
		return pow2( ( transmittedIor - vec3( incidentIor ) ) / ( transmittedIor + vec3( incidentIor ) ) );
	}
	float IorToFresnel0( float transmittedIor, float incidentIor ) {
		return pow2( ( transmittedIor - incidentIor ) / ( transmittedIor + incidentIor ));
	}
	vec3 evalSensitivity( float OPD, vec3 shift ) {
		float phase = 2.0 * PI * OPD * 1.0e-9;
		vec3 val = vec3( 5.4856e-13, 4.4201e-13, 5.2481e-13 );
		vec3 pos = vec3( 1.6810e+06, 1.7953e+06, 2.2084e+06 );
		vec3 var = vec3( 4.3278e+09, 9.3046e+09, 6.6121e+09 );
		vec3 xyz = val * sqrt( 2.0 * PI * var ) * cos( pos * phase + shift ) * exp( - pow2( phase ) * var );
		xyz.x += 9.7470e-14 * sqrt( 2.0 * PI * 4.5282e+09 ) * cos( 2.2399e+06 * phase + shift[ 0 ] ) * exp( - 4.5282e+09 * pow2( phase ) );
		xyz /= 1.0685e-7;
		vec3 rgb = XYZ_TO_REC709 * xyz;
		return rgb;
	}
	vec3 evalIridescence( float outsideIOR, float eta2, float cosTheta1, float thinFilmThickness, vec3 baseF0 ) {
		vec3 I;
		float iridescenceIOR = mix( outsideIOR, eta2, smoothstep( 0.0, 0.03, thinFilmThickness ) );
		float sinTheta2Sq = pow2( outsideIOR / iridescenceIOR ) * ( 1.0 - pow2( cosTheta1 ) );
		float cosTheta2Sq = 1.0 - sinTheta2Sq;
		if ( cosTheta2Sq < 0.0 ) {
			return vec3( 1.0 );
		}
		float cosTheta2 = sqrt( cosTheta2Sq );
		float R0 = IorToFresnel0( iridescenceIOR, outsideIOR );
		float R12 = F_Schlick( R0, 1.0, cosTheta1 );
		float T121 = 1.0 - R12;
		float phi12 = 0.0;
		if ( iridescenceIOR < outsideIOR ) phi12 = PI;
		float phi21 = PI - phi12;
		vec3 baseIOR = Fresnel0ToIor( clamp( baseF0, 0.0, 0.9999 ) );		vec3 R1 = IorToFresnel0( baseIOR, iridescenceIOR );
		vec3 R23 = F_Schlick( R1, 1.0, cosTheta2 );
		vec3 phi23 = vec3( 0.0 );
		if ( baseIOR[ 0 ] < iridescenceIOR ) phi23[ 0 ] = PI;
		if ( baseIOR[ 1 ] < iridescenceIOR ) phi23[ 1 ] = PI;
		if ( baseIOR[ 2 ] < iridescenceIOR ) phi23[ 2 ] = PI;
		float OPD = 2.0 * iridescenceIOR * thinFilmThickness * cosTheta2;
		vec3 phi = vec3( phi21 ) + phi23;
		vec3 R123 = clamp( R12 * R23, 1e-5, 0.9999 );
		vec3 r123 = sqrt( R123 );
		vec3 Rs = pow2( T121 ) * R23 / ( vec3( 1.0 ) - R123 );
		vec3 C0 = R12 + Rs;
		I = C0;
		vec3 Cm = Rs - T121;
		for ( int m = 1; m <= 2; ++ m ) {
			Cm *= r123;
			vec3 Sm = 2.0 * evalSensitivity( float( m ) * OPD, float( m ) * phi );
			I += Cm * Sm;
		}
		return max( I, vec3( 0.0 ) );
	}
#endif`,xm=`#ifdef USE_BUMPMAP
	uniform sampler2D bumpMap;
	uniform float bumpScale;
	vec2 dHdxy_fwd() {
		vec2 dSTdx = dFdx( vBumpMapUv );
		vec2 dSTdy = dFdy( vBumpMapUv );
		float Hll = bumpScale * texture2D( bumpMap, vBumpMapUv ).x;
		float dBx = bumpScale * texture2D( bumpMap, vBumpMapUv + dSTdx ).x - Hll;
		float dBy = bumpScale * texture2D( bumpMap, vBumpMapUv + dSTdy ).x - Hll;
		return vec2( dBx, dBy );
	}
	vec3 perturbNormalArb( vec3 surf_pos, vec3 surf_norm, vec2 dHdxy, float faceDirection ) {
		vec3 vSigmaX = normalize( dFdx( surf_pos.xyz ) );
		vec3 vSigmaY = normalize( dFdy( surf_pos.xyz ) );
		vec3 vN = surf_norm;
		vec3 R1 = cross( vSigmaY, vN );
		vec3 R2 = cross( vN, vSigmaX );
		float fDet = dot( vSigmaX, R1 ) * faceDirection;
		vec3 vGrad = sign( fDet ) * ( dHdxy.x * R1 + dHdxy.y * R2 );
		return normalize( abs( fDet ) * surf_norm - vGrad );
	}
#endif`,vm=`#if NUM_CLIPPING_PLANES > 0
	vec4 plane;
	#ifdef ALPHA_TO_COVERAGE
		float distanceToPlane, distanceGradient;
		float clipOpacity = 1.0;
		#pragma unroll_loop_start
		for ( int i = 0; i < UNION_CLIPPING_PLANES; i ++ ) {
			plane = clippingPlanes[ i ];
			distanceToPlane = - dot( vClipPosition, plane.xyz ) + plane.w;
			distanceGradient = fwidth( distanceToPlane ) / 2.0;
			clipOpacity *= smoothstep( - distanceGradient, distanceGradient, distanceToPlane );
			if ( clipOpacity == 0.0 ) discard;
		}
		#pragma unroll_loop_end
		#if UNION_CLIPPING_PLANES < NUM_CLIPPING_PLANES
			float unionClipOpacity = 1.0;
			#pragma unroll_loop_start
			for ( int i = UNION_CLIPPING_PLANES; i < NUM_CLIPPING_PLANES; i ++ ) {
				plane = clippingPlanes[ i ];
				distanceToPlane = - dot( vClipPosition, plane.xyz ) + plane.w;
				distanceGradient = fwidth( distanceToPlane ) / 2.0;
				unionClipOpacity *= 1.0 - smoothstep( - distanceGradient, distanceGradient, distanceToPlane );
			}
			#pragma unroll_loop_end
			clipOpacity *= 1.0 - unionClipOpacity;
		#endif
		diffuseColor.a *= clipOpacity;
		if ( diffuseColor.a == 0.0 ) discard;
	#else
		#pragma unroll_loop_start
		for ( int i = 0; i < UNION_CLIPPING_PLANES; i ++ ) {
			plane = clippingPlanes[ i ];
			if ( dot( vClipPosition, plane.xyz ) > plane.w ) discard;
		}
		#pragma unroll_loop_end
		#if UNION_CLIPPING_PLANES < NUM_CLIPPING_PLANES
			bool clipped = true;
			#pragma unroll_loop_start
			for ( int i = UNION_CLIPPING_PLANES; i < NUM_CLIPPING_PLANES; i ++ ) {
				plane = clippingPlanes[ i ];
				clipped = ( dot( vClipPosition, plane.xyz ) > plane.w ) && clipped;
			}
			#pragma unroll_loop_end
			if ( clipped ) discard;
		#endif
	#endif
#endif`,ym=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
	uniform vec4 clippingPlanes[ NUM_CLIPPING_PLANES ];
#endif`,Mm=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
#endif`,Sm=`#if NUM_CLIPPING_PLANES > 0
	vClipPosition = - mvPosition.xyz;
#endif`,wm=`#if defined( USE_COLOR_ALPHA )
	diffuseColor *= vColor;
#elif defined( USE_COLOR )
	diffuseColor.rgb *= vColor;
#endif`,Em=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR )
	varying vec3 vColor;
#endif`,Am=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	varying vec3 vColor;
#endif`,Tm=`#if defined( USE_COLOR_ALPHA )
	vColor = vec4( 1.0 );
#elif defined( USE_COLOR ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	vColor = vec3( 1.0 );
#endif
#ifdef USE_COLOR
	vColor *= color;
#endif
#ifdef USE_INSTANCING_COLOR
	vColor.xyz *= instanceColor.xyz;
#endif
#ifdef USE_BATCHING_COLOR
	vec3 batchingColor = getBatchingColor( getIndirectIndex( gl_DrawID ) );
	vColor.xyz *= batchingColor.xyz;
#endif`,Rm=`#define PI 3.141592653589793
#define PI2 6.283185307179586
#define PI_HALF 1.5707963267948966
#define RECIPROCAL_PI 0.3183098861837907
#define RECIPROCAL_PI2 0.15915494309189535
#define EPSILON 1e-6
#ifndef saturate
#define saturate( a ) clamp( a, 0.0, 1.0 )
#endif
#define whiteComplement( a ) ( 1.0 - saturate( a ) )
float pow2( const in float x ) { return x*x; }
vec3 pow2( const in vec3 x ) { return x*x; }
float pow3( const in float x ) { return x*x*x; }
float pow4( const in float x ) { float x2 = x*x; return x2*x2; }
float max3( const in vec3 v ) { return max( max( v.x, v.y ), v.z ); }
float average( const in vec3 v ) { return dot( v, vec3( 0.3333333 ) ); }
highp float rand( const in vec2 uv ) {
	const highp float a = 12.9898, b = 78.233, c = 43758.5453;
	highp float dt = dot( uv.xy, vec2( a,b ) ), sn = mod( dt, PI );
	return fract( sin( sn ) * c );
}
#ifdef HIGH_PRECISION
	float precisionSafeLength( vec3 v ) { return length( v ); }
#else
	float precisionSafeLength( vec3 v ) {
		float maxComponent = max3( abs( v ) );
		return length( v / maxComponent ) * maxComponent;
	}
#endif
struct IncidentLight {
	vec3 color;
	vec3 direction;
	bool visible;
};
struct ReflectedLight {
	vec3 directDiffuse;
	vec3 directSpecular;
	vec3 indirectDiffuse;
	vec3 indirectSpecular;
};
#ifdef USE_ALPHAHASH
	varying vec3 vPosition;
#endif
vec3 transformDirection( in vec3 dir, in mat4 matrix ) {
	return normalize( ( matrix * vec4( dir, 0.0 ) ).xyz );
}
vec3 inverseTransformDirection( in vec3 dir, in mat4 matrix ) {
	return normalize( ( vec4( dir, 0.0 ) * matrix ).xyz );
}
mat3 transposeMat3( const in mat3 m ) {
	mat3 tmp;
	tmp[ 0 ] = vec3( m[ 0 ].x, m[ 1 ].x, m[ 2 ].x );
	tmp[ 1 ] = vec3( m[ 0 ].y, m[ 1 ].y, m[ 2 ].y );
	tmp[ 2 ] = vec3( m[ 0 ].z, m[ 1 ].z, m[ 2 ].z );
	return tmp;
}
bool isPerspectiveMatrix( mat4 m ) {
	return m[ 2 ][ 3 ] == - 1.0;
}
vec2 equirectUv( in vec3 dir ) {
	float u = atan( dir.z, dir.x ) * RECIPROCAL_PI2 + 0.5;
	float v = asin( clamp( dir.y, - 1.0, 1.0 ) ) * RECIPROCAL_PI + 0.5;
	return vec2( u, v );
}
vec3 BRDF_Lambert( const in vec3 diffuseColor ) {
	return RECIPROCAL_PI * diffuseColor;
}
vec3 F_Schlick( const in vec3 f0, const in float f90, const in float dotVH ) {
	float fresnel = exp2( ( - 5.55473 * dotVH - 6.98316 ) * dotVH );
	return f0 * ( 1.0 - fresnel ) + ( f90 * fresnel );
}
float F_Schlick( const in float f0, const in float f90, const in float dotVH ) {
	float fresnel = exp2( ( - 5.55473 * dotVH - 6.98316 ) * dotVH );
	return f0 * ( 1.0 - fresnel ) + ( f90 * fresnel );
} // validated`,Cm=`#ifdef ENVMAP_TYPE_CUBE_UV
	#define cubeUV_minMipLevel 4.0
	#define cubeUV_minTileSize 16.0
	float getFace( vec3 direction ) {
		vec3 absDirection = abs( direction );
		float face = - 1.0;
		if ( absDirection.x > absDirection.z ) {
			if ( absDirection.x > absDirection.y )
				face = direction.x > 0.0 ? 0.0 : 3.0;
			else
				face = direction.y > 0.0 ? 1.0 : 4.0;
		} else {
			if ( absDirection.z > absDirection.y )
				face = direction.z > 0.0 ? 2.0 : 5.0;
			else
				face = direction.y > 0.0 ? 1.0 : 4.0;
		}
		return face;
	}
	vec2 getUV( vec3 direction, float face ) {
		vec2 uv;
		if ( face == 0.0 ) {
			uv = vec2( direction.z, direction.y ) / abs( direction.x );
		} else if ( face == 1.0 ) {
			uv = vec2( - direction.x, - direction.z ) / abs( direction.y );
		} else if ( face == 2.0 ) {
			uv = vec2( - direction.x, direction.y ) / abs( direction.z );
		} else if ( face == 3.0 ) {
			uv = vec2( - direction.z, direction.y ) / abs( direction.x );
		} else if ( face == 4.0 ) {
			uv = vec2( - direction.x, direction.z ) / abs( direction.y );
		} else {
			uv = vec2( direction.x, direction.y ) / abs( direction.z );
		}
		return 0.5 * ( uv + 1.0 );
	}
	vec3 bilinearCubeUV( sampler2D envMap, vec3 direction, float mipInt ) {
		float face = getFace( direction );
		float filterInt = max( cubeUV_minMipLevel - mipInt, 0.0 );
		mipInt = max( mipInt, cubeUV_minMipLevel );
		float faceSize = exp2( mipInt );
		highp vec2 uv = getUV( direction, face ) * ( faceSize - 2.0 ) + 1.0;
		if ( face > 2.0 ) {
			uv.y += faceSize;
			face -= 3.0;
		}
		uv.x += face * faceSize;
		uv.x += filterInt * 3.0 * cubeUV_minTileSize;
		uv.y += 4.0 * ( exp2( CUBEUV_MAX_MIP ) - faceSize );
		uv.x *= CUBEUV_TEXEL_WIDTH;
		uv.y *= CUBEUV_TEXEL_HEIGHT;
		#ifdef texture2DGradEXT
			return texture2DGradEXT( envMap, uv, vec2( 0.0 ), vec2( 0.0 ) ).rgb;
		#else
			return texture2D( envMap, uv ).rgb;
		#endif
	}
	#define cubeUV_r0 1.0
	#define cubeUV_m0 - 2.0
	#define cubeUV_r1 0.8
	#define cubeUV_m1 - 1.0
	#define cubeUV_r4 0.4
	#define cubeUV_m4 2.0
	#define cubeUV_r5 0.305
	#define cubeUV_m5 3.0
	#define cubeUV_r6 0.21
	#define cubeUV_m6 4.0
	float roughnessToMip( float roughness ) {
		float mip = 0.0;
		if ( roughness >= cubeUV_r1 ) {
			mip = ( cubeUV_r0 - roughness ) * ( cubeUV_m1 - cubeUV_m0 ) / ( cubeUV_r0 - cubeUV_r1 ) + cubeUV_m0;
		} else if ( roughness >= cubeUV_r4 ) {
			mip = ( cubeUV_r1 - roughness ) * ( cubeUV_m4 - cubeUV_m1 ) / ( cubeUV_r1 - cubeUV_r4 ) + cubeUV_m1;
		} else if ( roughness >= cubeUV_r5 ) {
			mip = ( cubeUV_r4 - roughness ) * ( cubeUV_m5 - cubeUV_m4 ) / ( cubeUV_r4 - cubeUV_r5 ) + cubeUV_m4;
		} else if ( roughness >= cubeUV_r6 ) {
			mip = ( cubeUV_r5 - roughness ) * ( cubeUV_m6 - cubeUV_m5 ) / ( cubeUV_r5 - cubeUV_r6 ) + cubeUV_m5;
		} else {
			mip = - 2.0 * log2( 1.16 * roughness );		}
		return mip;
	}
	vec4 textureCubeUV( sampler2D envMap, vec3 sampleDir, float roughness ) {
		float mip = clamp( roughnessToMip( roughness ), cubeUV_m0, CUBEUV_MAX_MIP );
		float mipF = fract( mip );
		float mipInt = floor( mip );
		vec3 color0 = bilinearCubeUV( envMap, sampleDir, mipInt );
		if ( mipF == 0.0 ) {
			return vec4( color0, 1.0 );
		} else {
			vec3 color1 = bilinearCubeUV( envMap, sampleDir, mipInt + 1.0 );
			return vec4( mix( color0, color1, mipF ), 1.0 );
		}
	}
#endif`,Pm=`vec3 transformedNormal = objectNormal;
#ifdef USE_TANGENT
	vec3 transformedTangent = objectTangent;
#endif
#ifdef USE_BATCHING
	mat3 bm = mat3( batchingMatrix );
	transformedNormal /= vec3( dot( bm[ 0 ], bm[ 0 ] ), dot( bm[ 1 ], bm[ 1 ] ), dot( bm[ 2 ], bm[ 2 ] ) );
	transformedNormal = bm * transformedNormal;
	#ifdef USE_TANGENT
		transformedTangent = bm * transformedTangent;
	#endif
#endif
#ifdef USE_INSTANCING
	mat3 im = mat3( instanceMatrix );
	transformedNormal /= vec3( dot( im[ 0 ], im[ 0 ] ), dot( im[ 1 ], im[ 1 ] ), dot( im[ 2 ], im[ 2 ] ) );
	transformedNormal = im * transformedNormal;
	#ifdef USE_TANGENT
		transformedTangent = im * transformedTangent;
	#endif
#endif
transformedNormal = normalMatrix * transformedNormal;
#ifdef FLIP_SIDED
	transformedNormal = - transformedNormal;
#endif
#ifdef USE_TANGENT
	transformedTangent = ( modelViewMatrix * vec4( transformedTangent, 0.0 ) ).xyz;
	#ifdef FLIP_SIDED
		transformedTangent = - transformedTangent;
	#endif
#endif`,Lm=`#ifdef USE_DISPLACEMENTMAP
	uniform sampler2D displacementMap;
	uniform float displacementScale;
	uniform float displacementBias;
#endif`,Dm=`#ifdef USE_DISPLACEMENTMAP
	transformed += normalize( objectNormal ) * ( texture2D( displacementMap, vDisplacementMapUv ).x * displacementScale + displacementBias );
#endif`,Im=`#ifdef USE_EMISSIVEMAP
	vec4 emissiveColor = texture2D( emissiveMap, vEmissiveMapUv );
	#ifdef DECODE_VIDEO_TEXTURE_EMISSIVE
		emissiveColor = sRGBTransferEOTF( emissiveColor );
	#endif
	totalEmissiveRadiance *= emissiveColor.rgb;
#endif`,Nm=`#ifdef USE_EMISSIVEMAP
	uniform sampler2D emissiveMap;
#endif`,Um="gl_FragColor = linearToOutputTexel( gl_FragColor );",Fm=`vec4 LinearTransferOETF( in vec4 value ) {
	return value;
}
vec4 sRGBTransferEOTF( in vec4 value ) {
	return vec4( mix( pow( value.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), value.rgb * 0.0773993808, vec3( lessThanEqual( value.rgb, vec3( 0.04045 ) ) ) ), value.a );
}
vec4 sRGBTransferOETF( in vec4 value ) {
	return vec4( mix( pow( value.rgb, vec3( 0.41666 ) ) * 1.055 - vec3( 0.055 ), value.rgb * 12.92, vec3( lessThanEqual( value.rgb, vec3( 0.0031308 ) ) ) ), value.a );
}`,Om=`#ifdef USE_ENVMAP
	#ifdef ENV_WORLDPOS
		vec3 cameraToFrag;
		if ( isOrthographic ) {
			cameraToFrag = normalize( vec3( - viewMatrix[ 0 ][ 2 ], - viewMatrix[ 1 ][ 2 ], - viewMatrix[ 2 ][ 2 ] ) );
		} else {
			cameraToFrag = normalize( vWorldPosition - cameraPosition );
		}
		vec3 worldNormal = inverseTransformDirection( normal, viewMatrix );
		#ifdef ENVMAP_MODE_REFLECTION
			vec3 reflectVec = reflect( cameraToFrag, worldNormal );
		#else
			vec3 reflectVec = refract( cameraToFrag, worldNormal, refractionRatio );
		#endif
	#else
		vec3 reflectVec = vReflect;
	#endif
	#ifdef ENVMAP_TYPE_CUBE
		vec4 envColor = textureCube( envMap, envMapRotation * vec3( flipEnvMap * reflectVec.x, reflectVec.yz ) );
	#else
		vec4 envColor = vec4( 0.0 );
	#endif
	#ifdef ENVMAP_BLENDING_MULTIPLY
		outgoingLight = mix( outgoingLight, outgoingLight * envColor.xyz, specularStrength * reflectivity );
	#elif defined( ENVMAP_BLENDING_MIX )
		outgoingLight = mix( outgoingLight, envColor.xyz, specularStrength * reflectivity );
	#elif defined( ENVMAP_BLENDING_ADD )
		outgoingLight += envColor.xyz * specularStrength * reflectivity;
	#endif
#endif`,km=`#ifdef USE_ENVMAP
	uniform float envMapIntensity;
	uniform float flipEnvMap;
	uniform mat3 envMapRotation;
	#ifdef ENVMAP_TYPE_CUBE
		uniform samplerCube envMap;
	#else
		uniform sampler2D envMap;
	#endif
	
#endif`,Bm=`#ifdef USE_ENVMAP
	uniform float reflectivity;
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		varying vec3 vWorldPosition;
		uniform float refractionRatio;
	#else
		varying vec3 vReflect;
	#endif
#endif`,zm=`#ifdef USE_ENVMAP
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		
		varying vec3 vWorldPosition;
	#else
		varying vec3 vReflect;
		uniform float refractionRatio;
	#endif
#endif`,Hm=`#ifdef USE_ENVMAP
	#ifdef ENV_WORLDPOS
		vWorldPosition = worldPosition.xyz;
	#else
		vec3 cameraToVertex;
		if ( isOrthographic ) {
			cameraToVertex = normalize( vec3( - viewMatrix[ 0 ][ 2 ], - viewMatrix[ 1 ][ 2 ], - viewMatrix[ 2 ][ 2 ] ) );
		} else {
			cameraToVertex = normalize( worldPosition.xyz - cameraPosition );
		}
		vec3 worldNormal = inverseTransformDirection( transformedNormal, viewMatrix );
		#ifdef ENVMAP_MODE_REFLECTION
			vReflect = reflect( cameraToVertex, worldNormal );
		#else
			vReflect = refract( cameraToVertex, worldNormal, refractionRatio );
		#endif
	#endif
#endif`,Vm=`#ifdef USE_FOG
	vFogDepth = - mvPosition.z;
#endif`,Gm=`#ifdef USE_FOG
	varying float vFogDepth;
#endif`,Wm=`#ifdef USE_FOG
	#ifdef FOG_EXP2
		float fogFactor = 1.0 - exp( - fogDensity * fogDensity * vFogDepth * vFogDepth );
	#else
		float fogFactor = smoothstep( fogNear, fogFar, vFogDepth );
	#endif
	gl_FragColor.rgb = mix( gl_FragColor.rgb, fogColor, fogFactor );
#endif`,qm=`#ifdef USE_FOG
	uniform vec3 fogColor;
	varying float vFogDepth;
	#ifdef FOG_EXP2
		uniform float fogDensity;
	#else
		uniform float fogNear;
		uniform float fogFar;
	#endif
#endif`,jm=`#ifdef USE_GRADIENTMAP
	uniform sampler2D gradientMap;
#endif
vec3 getGradientIrradiance( vec3 normal, vec3 lightDirection ) {
	float dotNL = dot( normal, lightDirection );
	vec2 coord = vec2( dotNL * 0.5 + 0.5, 0.0 );
	#ifdef USE_GRADIENTMAP
		return vec3( texture2D( gradientMap, coord ).r );
	#else
		vec2 fw = fwidth( coord ) * 0.5;
		return mix( vec3( 0.7 ), vec3( 1.0 ), smoothstep( 0.7 - fw.x, 0.7 + fw.x, coord.x ) );
	#endif
}`,Xm=`#ifdef USE_LIGHTMAP
	uniform sampler2D lightMap;
	uniform float lightMapIntensity;
#endif`,Qm=`LambertMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularStrength = specularStrength;`,Km=`varying vec3 vViewPosition;
struct LambertMaterial {
	vec3 diffuseColor;
	float specularStrength;
};
void RE_Direct_Lambert( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in LambertMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Lambert( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in LambertMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_Lambert
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Lambert`,Ym=`uniform bool receiveShadow;
uniform vec3 ambientLightColor;
#if defined( USE_LIGHT_PROBES )
	uniform vec3 lightProbe[ 9 ];
#endif
vec3 shGetIrradianceAt( in vec3 normal, in vec3 shCoefficients[ 9 ] ) {
	float x = normal.x, y = normal.y, z = normal.z;
	vec3 result = shCoefficients[ 0 ] * 0.886227;
	result += shCoefficients[ 1 ] * 2.0 * 0.511664 * y;
	result += shCoefficients[ 2 ] * 2.0 * 0.511664 * z;
	result += shCoefficients[ 3 ] * 2.0 * 0.511664 * x;
	result += shCoefficients[ 4 ] * 2.0 * 0.429043 * x * y;
	result += shCoefficients[ 5 ] * 2.0 * 0.429043 * y * z;
	result += shCoefficients[ 6 ] * ( 0.743125 * z * z - 0.247708 );
	result += shCoefficients[ 7 ] * 2.0 * 0.429043 * x * z;
	result += shCoefficients[ 8 ] * 0.429043 * ( x * x - y * y );
	return result;
}
vec3 getLightProbeIrradiance( const in vec3 lightProbe[ 9 ], const in vec3 normal ) {
	vec3 worldNormal = inverseTransformDirection( normal, viewMatrix );
	vec3 irradiance = shGetIrradianceAt( worldNormal, lightProbe );
	return irradiance;
}
vec3 getAmbientLightIrradiance( const in vec3 ambientLightColor ) {
	vec3 irradiance = ambientLightColor;
	return irradiance;
}
float getDistanceAttenuation( const in float lightDistance, const in float cutoffDistance, const in float decayExponent ) {
	float distanceFalloff = 1.0 / max( pow( lightDistance, decayExponent ), 0.01 );
	if ( cutoffDistance > 0.0 ) {
		distanceFalloff *= pow2( saturate( 1.0 - pow4( lightDistance / cutoffDistance ) ) );
	}
	return distanceFalloff;
}
float getSpotAttenuation( const in float coneCosine, const in float penumbraCosine, const in float angleCosine ) {
	return smoothstep( coneCosine, penumbraCosine, angleCosine );
}
#if NUM_DIR_LIGHTS > 0
	struct DirectionalLight {
		vec3 direction;
		vec3 color;
	};
	uniform DirectionalLight directionalLights[ NUM_DIR_LIGHTS ];
	void getDirectionalLightInfo( const in DirectionalLight directionalLight, out IncidentLight light ) {
		light.color = directionalLight.color;
		light.direction = directionalLight.direction;
		light.visible = true;
	}
#endif
#if NUM_POINT_LIGHTS > 0
	struct PointLight {
		vec3 position;
		vec3 color;
		float distance;
		float decay;
	};
	uniform PointLight pointLights[ NUM_POINT_LIGHTS ];
	void getPointLightInfo( const in PointLight pointLight, const in vec3 geometryPosition, out IncidentLight light ) {
		vec3 lVector = pointLight.position - geometryPosition;
		light.direction = normalize( lVector );
		float lightDistance = length( lVector );
		light.color = pointLight.color;
		light.color *= getDistanceAttenuation( lightDistance, pointLight.distance, pointLight.decay );
		light.visible = ( light.color != vec3( 0.0 ) );
	}
#endif
#if NUM_SPOT_LIGHTS > 0
	struct SpotLight {
		vec3 position;
		vec3 direction;
		vec3 color;
		float distance;
		float decay;
		float coneCos;
		float penumbraCos;
	};
	uniform SpotLight spotLights[ NUM_SPOT_LIGHTS ];
	void getSpotLightInfo( const in SpotLight spotLight, const in vec3 geometryPosition, out IncidentLight light ) {
		vec3 lVector = spotLight.position - geometryPosition;
		light.direction = normalize( lVector );
		float angleCos = dot( light.direction, spotLight.direction );
		float spotAttenuation = getSpotAttenuation( spotLight.coneCos, spotLight.penumbraCos, angleCos );
		if ( spotAttenuation > 0.0 ) {
			float lightDistance = length( lVector );
			light.color = spotLight.color * spotAttenuation;
			light.color *= getDistanceAttenuation( lightDistance, spotLight.distance, spotLight.decay );
			light.visible = ( light.color != vec3( 0.0 ) );
		} else {
			light.color = vec3( 0.0 );
			light.visible = false;
		}
	}
#endif
#if NUM_RECT_AREA_LIGHTS > 0
	struct RectAreaLight {
		vec3 color;
		vec3 position;
		vec3 halfWidth;
		vec3 halfHeight;
	};
	uniform sampler2D ltc_1;	uniform sampler2D ltc_2;
	uniform RectAreaLight rectAreaLights[ NUM_RECT_AREA_LIGHTS ];
#endif
#if NUM_HEMI_LIGHTS > 0
	struct HemisphereLight {
		vec3 direction;
		vec3 skyColor;
		vec3 groundColor;
	};
	uniform HemisphereLight hemisphereLights[ NUM_HEMI_LIGHTS ];
	vec3 getHemisphereLightIrradiance( const in HemisphereLight hemiLight, const in vec3 normal ) {
		float dotNL = dot( normal, hemiLight.direction );
		float hemiDiffuseWeight = 0.5 * dotNL + 0.5;
		vec3 irradiance = mix( hemiLight.groundColor, hemiLight.skyColor, hemiDiffuseWeight );
		return irradiance;
	}
#endif`,$m=`#ifdef USE_ENVMAP
	vec3 getIBLIrradiance( const in vec3 normal ) {
		#ifdef ENVMAP_TYPE_CUBE_UV
			vec3 worldNormal = inverseTransformDirection( normal, viewMatrix );
			vec4 envMapColor = textureCubeUV( envMap, envMapRotation * worldNormal, 1.0 );
			return PI * envMapColor.rgb * envMapIntensity;
		#else
			return vec3( 0.0 );
		#endif
	}
	vec3 getIBLRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness ) {
		#ifdef ENVMAP_TYPE_CUBE_UV
			vec3 reflectVec = reflect( - viewDir, normal );
			reflectVec = normalize( mix( reflectVec, normal, roughness * roughness) );
			reflectVec = inverseTransformDirection( reflectVec, viewMatrix );
			vec4 envMapColor = textureCubeUV( envMap, envMapRotation * reflectVec, roughness );
			return envMapColor.rgb * envMapIntensity;
		#else
			return vec3( 0.0 );
		#endif
	}
	#ifdef USE_ANISOTROPY
		vec3 getIBLAnisotropyRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness, const in vec3 bitangent, const in float anisotropy ) {
			#ifdef ENVMAP_TYPE_CUBE_UV
				vec3 bentNormal = cross( bitangent, viewDir );
				bentNormal = normalize( cross( bentNormal, bitangent ) );
				bentNormal = normalize( mix( bentNormal, normal, pow2( pow2( 1.0 - anisotropy * ( 1.0 - roughness ) ) ) ) );
				return getIBLRadiance( viewDir, bentNormal, roughness );
			#else
				return vec3( 0.0 );
			#endif
		}
	#endif
#endif`,Zm=`ToonMaterial material;
material.diffuseColor = diffuseColor.rgb;`,Jm=`varying vec3 vViewPosition;
struct ToonMaterial {
	vec3 diffuseColor;
};
void RE_Direct_Toon( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in ToonMaterial material, inout ReflectedLight reflectedLight ) {
	vec3 irradiance = getGradientIrradiance( geometryNormal, directLight.direction ) * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Toon( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in ToonMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_Toon
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Toon`,eg=`BlinnPhongMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularColor = specular;
material.specularShininess = shininess;
material.specularStrength = specularStrength;`,tg=`varying vec3 vViewPosition;
struct BlinnPhongMaterial {
	vec3 diffuseColor;
	vec3 specularColor;
	float specularShininess;
	float specularStrength;
};
void RE_Direct_BlinnPhong( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in BlinnPhongMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
	reflectedLight.directSpecular += irradiance * BRDF_BlinnPhong( directLight.direction, geometryViewDir, geometryNormal, material.specularColor, material.specularShininess ) * material.specularStrength;
}
void RE_IndirectDiffuse_BlinnPhong( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in BlinnPhongMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_BlinnPhong
#define RE_IndirectDiffuse		RE_IndirectDiffuse_BlinnPhong`,ng=`PhysicalMaterial material;
material.diffuseColor = diffuseColor.rgb * ( 1.0 - metalnessFactor );
vec3 dxy = max( abs( dFdx( nonPerturbedNormal ) ), abs( dFdy( nonPerturbedNormal ) ) );
float geometryRoughness = max( max( dxy.x, dxy.y ), dxy.z );
material.roughness = max( roughnessFactor, 0.0525 );material.roughness += geometryRoughness;
material.roughness = min( material.roughness, 1.0 );
#ifdef IOR
	material.ior = ior;
	#ifdef USE_SPECULAR
		float specularIntensityFactor = specularIntensity;
		vec3 specularColorFactor = specularColor;
		#ifdef USE_SPECULAR_COLORMAP
			specularColorFactor *= texture2D( specularColorMap, vSpecularColorMapUv ).rgb;
		#endif
		#ifdef USE_SPECULAR_INTENSITYMAP
			specularIntensityFactor *= texture2D( specularIntensityMap, vSpecularIntensityMapUv ).a;
		#endif
		material.specularF90 = mix( specularIntensityFactor, 1.0, metalnessFactor );
	#else
		float specularIntensityFactor = 1.0;
		vec3 specularColorFactor = vec3( 1.0 );
		material.specularF90 = 1.0;
	#endif
	material.specularColor = mix( min( pow2( ( material.ior - 1.0 ) / ( material.ior + 1.0 ) ) * specularColorFactor, vec3( 1.0 ) ) * specularIntensityFactor, diffuseColor.rgb, metalnessFactor );
#else
	material.specularColor = mix( vec3( 0.04 ), diffuseColor.rgb, metalnessFactor );
	material.specularF90 = 1.0;
#endif
#ifdef USE_CLEARCOAT
	material.clearcoat = clearcoat;
	material.clearcoatRoughness = clearcoatRoughness;
	material.clearcoatF0 = vec3( 0.04 );
	material.clearcoatF90 = 1.0;
	#ifdef USE_CLEARCOATMAP
		material.clearcoat *= texture2D( clearcoatMap, vClearcoatMapUv ).x;
	#endif
	#ifdef USE_CLEARCOAT_ROUGHNESSMAP
		material.clearcoatRoughness *= texture2D( clearcoatRoughnessMap, vClearcoatRoughnessMapUv ).y;
	#endif
	material.clearcoat = saturate( material.clearcoat );	material.clearcoatRoughness = max( material.clearcoatRoughness, 0.0525 );
	material.clearcoatRoughness += geometryRoughness;
	material.clearcoatRoughness = min( material.clearcoatRoughness, 1.0 );
#endif
#ifdef USE_DISPERSION
	material.dispersion = dispersion;
#endif
#ifdef USE_IRIDESCENCE
	material.iridescence = iridescence;
	material.iridescenceIOR = iridescenceIOR;
	#ifdef USE_IRIDESCENCEMAP
		material.iridescence *= texture2D( iridescenceMap, vIridescenceMapUv ).r;
	#endif
	#ifdef USE_IRIDESCENCE_THICKNESSMAP
		material.iridescenceThickness = (iridescenceThicknessMaximum - iridescenceThicknessMinimum) * texture2D( iridescenceThicknessMap, vIridescenceThicknessMapUv ).g + iridescenceThicknessMinimum;
	#else
		material.iridescenceThickness = iridescenceThicknessMaximum;
	#endif
#endif
#ifdef USE_SHEEN
	material.sheenColor = sheenColor;
	#ifdef USE_SHEEN_COLORMAP
		material.sheenColor *= texture2D( sheenColorMap, vSheenColorMapUv ).rgb;
	#endif
	material.sheenRoughness = clamp( sheenRoughness, 0.07, 1.0 );
	#ifdef USE_SHEEN_ROUGHNESSMAP
		material.sheenRoughness *= texture2D( sheenRoughnessMap, vSheenRoughnessMapUv ).a;
	#endif
#endif
#ifdef USE_ANISOTROPY
	#ifdef USE_ANISOTROPYMAP
		mat2 anisotropyMat = mat2( anisotropyVector.x, anisotropyVector.y, - anisotropyVector.y, anisotropyVector.x );
		vec3 anisotropyPolar = texture2D( anisotropyMap, vAnisotropyMapUv ).rgb;
		vec2 anisotropyV = anisotropyMat * normalize( 2.0 * anisotropyPolar.rg - vec2( 1.0 ) ) * anisotropyPolar.b;
	#else
		vec2 anisotropyV = anisotropyVector;
	#endif
	material.anisotropy = length( anisotropyV );
	if( material.anisotropy == 0.0 ) {
		anisotropyV = vec2( 1.0, 0.0 );
	} else {
		anisotropyV /= material.anisotropy;
		material.anisotropy = saturate( material.anisotropy );
	}
	material.alphaT = mix( pow2( material.roughness ), 1.0, pow2( material.anisotropy ) );
	material.anisotropyT = tbn[ 0 ] * anisotropyV.x + tbn[ 1 ] * anisotropyV.y;
	material.anisotropyB = tbn[ 1 ] * anisotropyV.x - tbn[ 0 ] * anisotropyV.y;
#endif`,ig=`struct PhysicalMaterial {
	vec3 diffuseColor;
	float roughness;
	vec3 specularColor;
	float specularF90;
	float dispersion;
	#ifdef USE_CLEARCOAT
		float clearcoat;
		float clearcoatRoughness;
		vec3 clearcoatF0;
		float clearcoatF90;
	#endif
	#ifdef USE_IRIDESCENCE
		float iridescence;
		float iridescenceIOR;
		float iridescenceThickness;
		vec3 iridescenceFresnel;
		vec3 iridescenceF0;
	#endif
	#ifdef USE_SHEEN
		vec3 sheenColor;
		float sheenRoughness;
	#endif
	#ifdef IOR
		float ior;
	#endif
	#ifdef USE_TRANSMISSION
		float transmission;
		float transmissionAlpha;
		float thickness;
		float attenuationDistance;
		vec3 attenuationColor;
	#endif
	#ifdef USE_ANISOTROPY
		float anisotropy;
		float alphaT;
		vec3 anisotropyT;
		vec3 anisotropyB;
	#endif
};
vec3 clearcoatSpecularDirect = vec3( 0.0 );
vec3 clearcoatSpecularIndirect = vec3( 0.0 );
vec3 sheenSpecularDirect = vec3( 0.0 );
vec3 sheenSpecularIndirect = vec3(0.0 );
vec3 Schlick_to_F0( const in vec3 f, const in float f90, const in float dotVH ) {
    float x = clamp( 1.0 - dotVH, 0.0, 1.0 );
    float x2 = x * x;
    float x5 = clamp( x * x2 * x2, 0.0, 0.9999 );
    return ( f - vec3( f90 ) * x5 ) / ( 1.0 - x5 );
}
float V_GGX_SmithCorrelated( const in float alpha, const in float dotNL, const in float dotNV ) {
	float a2 = pow2( alpha );
	float gv = dotNL * sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNV ) );
	float gl = dotNV * sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNL ) );
	return 0.5 / max( gv + gl, EPSILON );
}
float D_GGX( const in float alpha, const in float dotNH ) {
	float a2 = pow2( alpha );
	float denom = pow2( dotNH ) * ( a2 - 1.0 ) + 1.0;
	return RECIPROCAL_PI * a2 / pow2( denom );
}
#ifdef USE_ANISOTROPY
	float V_GGX_SmithCorrelated_Anisotropic( const in float alphaT, const in float alphaB, const in float dotTV, const in float dotBV, const in float dotTL, const in float dotBL, const in float dotNV, const in float dotNL ) {
		float gv = dotNL * length( vec3( alphaT * dotTV, alphaB * dotBV, dotNV ) );
		float gl = dotNV * length( vec3( alphaT * dotTL, alphaB * dotBL, dotNL ) );
		float v = 0.5 / ( gv + gl );
		return saturate(v);
	}
	float D_GGX_Anisotropic( const in float alphaT, const in float alphaB, const in float dotNH, const in float dotTH, const in float dotBH ) {
		float a2 = alphaT * alphaB;
		highp vec3 v = vec3( alphaB * dotTH, alphaT * dotBH, a2 * dotNH );
		highp float v2 = dot( v, v );
		float w2 = a2 / v2;
		return RECIPROCAL_PI * a2 * pow2 ( w2 );
	}
#endif
#ifdef USE_CLEARCOAT
	vec3 BRDF_GGX_Clearcoat( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material) {
		vec3 f0 = material.clearcoatF0;
		float f90 = material.clearcoatF90;
		float roughness = material.clearcoatRoughness;
		float alpha = pow2( roughness );
		vec3 halfDir = normalize( lightDir + viewDir );
		float dotNL = saturate( dot( normal, lightDir ) );
		float dotNV = saturate( dot( normal, viewDir ) );
		float dotNH = saturate( dot( normal, halfDir ) );
		float dotVH = saturate( dot( viewDir, halfDir ) );
		vec3 F = F_Schlick( f0, f90, dotVH );
		float V = V_GGX_SmithCorrelated( alpha, dotNL, dotNV );
		float D = D_GGX( alpha, dotNH );
		return F * ( V * D );
	}
#endif
vec3 BRDF_GGX( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material ) {
	vec3 f0 = material.specularColor;
	float f90 = material.specularF90;
	float roughness = material.roughness;
	float alpha = pow2( roughness );
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNL = saturate( dot( normal, lightDir ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	float dotNH = saturate( dot( normal, halfDir ) );
	float dotVH = saturate( dot( viewDir, halfDir ) );
	vec3 F = F_Schlick( f0, f90, dotVH );
	#ifdef USE_IRIDESCENCE
		F = mix( F, material.iridescenceFresnel, material.iridescence );
	#endif
	#ifdef USE_ANISOTROPY
		float dotTL = dot( material.anisotropyT, lightDir );
		float dotTV = dot( material.anisotropyT, viewDir );
		float dotTH = dot( material.anisotropyT, halfDir );
		float dotBL = dot( material.anisotropyB, lightDir );
		float dotBV = dot( material.anisotropyB, viewDir );
		float dotBH = dot( material.anisotropyB, halfDir );
		float V = V_GGX_SmithCorrelated_Anisotropic( material.alphaT, alpha, dotTV, dotBV, dotTL, dotBL, dotNV, dotNL );
		float D = D_GGX_Anisotropic( material.alphaT, alpha, dotNH, dotTH, dotBH );
	#else
		float V = V_GGX_SmithCorrelated( alpha, dotNL, dotNV );
		float D = D_GGX( alpha, dotNH );
	#endif
	return F * ( V * D );
}
vec2 LTC_Uv( const in vec3 N, const in vec3 V, const in float roughness ) {
	const float LUT_SIZE = 64.0;
	const float LUT_SCALE = ( LUT_SIZE - 1.0 ) / LUT_SIZE;
	const float LUT_BIAS = 0.5 / LUT_SIZE;
	float dotNV = saturate( dot( N, V ) );
	vec2 uv = vec2( roughness, sqrt( 1.0 - dotNV ) );
	uv = uv * LUT_SCALE + LUT_BIAS;
	return uv;
}
float LTC_ClippedSphereFormFactor( const in vec3 f ) {
	float l = length( f );
	return max( ( l * l + f.z ) / ( l + 1.0 ), 0.0 );
}
vec3 LTC_EdgeVectorFormFactor( const in vec3 v1, const in vec3 v2 ) {
	float x = dot( v1, v2 );
	float y = abs( x );
	float a = 0.8543985 + ( 0.4965155 + 0.0145206 * y ) * y;
	float b = 3.4175940 + ( 4.1616724 + y ) * y;
	float v = a / b;
	float theta_sintheta = ( x > 0.0 ) ? v : 0.5 * inversesqrt( max( 1.0 - x * x, 1e-7 ) ) - v;
	return cross( v1, v2 ) * theta_sintheta;
}
vec3 LTC_Evaluate( const in vec3 N, const in vec3 V, const in vec3 P, const in mat3 mInv, const in vec3 rectCoords[ 4 ] ) {
	vec3 v1 = rectCoords[ 1 ] - rectCoords[ 0 ];
	vec3 v2 = rectCoords[ 3 ] - rectCoords[ 0 ];
	vec3 lightNormal = cross( v1, v2 );
	if( dot( lightNormal, P - rectCoords[ 0 ] ) < 0.0 ) return vec3( 0.0 );
	vec3 T1, T2;
	T1 = normalize( V - N * dot( V, N ) );
	T2 = - cross( N, T1 );
	mat3 mat = mInv * transposeMat3( mat3( T1, T2, N ) );
	vec3 coords[ 4 ];
	coords[ 0 ] = mat * ( rectCoords[ 0 ] - P );
	coords[ 1 ] = mat * ( rectCoords[ 1 ] - P );
	coords[ 2 ] = mat * ( rectCoords[ 2 ] - P );
	coords[ 3 ] = mat * ( rectCoords[ 3 ] - P );
	coords[ 0 ] = normalize( coords[ 0 ] );
	coords[ 1 ] = normalize( coords[ 1 ] );
	coords[ 2 ] = normalize( coords[ 2 ] );
	coords[ 3 ] = normalize( coords[ 3 ] );
	vec3 vectorFormFactor = vec3( 0.0 );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 0 ], coords[ 1 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 1 ], coords[ 2 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 2 ], coords[ 3 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 3 ], coords[ 0 ] );
	float result = LTC_ClippedSphereFormFactor( vectorFormFactor );
	return vec3( result );
}
#if defined( USE_SHEEN )
float D_Charlie( float roughness, float dotNH ) {
	float alpha = pow2( roughness );
	float invAlpha = 1.0 / alpha;
	float cos2h = dotNH * dotNH;
	float sin2h = max( 1.0 - cos2h, 0.0078125 );
	return ( 2.0 + invAlpha ) * pow( sin2h, invAlpha * 0.5 ) / ( 2.0 * PI );
}
float V_Neubelt( float dotNV, float dotNL ) {
	return saturate( 1.0 / ( 4.0 * ( dotNL + dotNV - dotNL * dotNV ) ) );
}
vec3 BRDF_Sheen( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, vec3 sheenColor, const in float sheenRoughness ) {
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNL = saturate( dot( normal, lightDir ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	float dotNH = saturate( dot( normal, halfDir ) );
	float D = D_Charlie( sheenRoughness, dotNH );
	float V = V_Neubelt( dotNV, dotNL );
	return sheenColor * ( D * V );
}
#endif
float IBLSheenBRDF( const in vec3 normal, const in vec3 viewDir, const in float roughness ) {
	float dotNV = saturate( dot( normal, viewDir ) );
	float r2 = roughness * roughness;
	float a = roughness < 0.25 ? -339.2 * r2 + 161.4 * roughness - 25.9 : -8.48 * r2 + 14.3 * roughness - 9.95;
	float b = roughness < 0.25 ? 44.0 * r2 - 23.7 * roughness + 3.26 : 1.97 * r2 - 3.27 * roughness + 0.72;
	float DG = exp( a * dotNV + b ) + ( roughness < 0.25 ? 0.0 : 0.1 * ( roughness - 0.25 ) );
	return saturate( DG * RECIPROCAL_PI );
}
vec2 DFGApprox( const in vec3 normal, const in vec3 viewDir, const in float roughness ) {
	float dotNV = saturate( dot( normal, viewDir ) );
	const vec4 c0 = vec4( - 1, - 0.0275, - 0.572, 0.022 );
	const vec4 c1 = vec4( 1, 0.0425, 1.04, - 0.04 );
	vec4 r = roughness * c0 + c1;
	float a004 = min( r.x * r.x, exp2( - 9.28 * dotNV ) ) * r.x + r.y;
	vec2 fab = vec2( - 1.04, 1.04 ) * a004 + r.zw;
	return fab;
}
vec3 EnvironmentBRDF( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float roughness ) {
	vec2 fab = DFGApprox( normal, viewDir, roughness );
	return specularColor * fab.x + specularF90 * fab.y;
}
#ifdef USE_IRIDESCENCE
void computeMultiscatteringIridescence( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float iridescence, const in vec3 iridescenceF0, const in float roughness, inout vec3 singleScatter, inout vec3 multiScatter ) {
#else
void computeMultiscattering( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float roughness, inout vec3 singleScatter, inout vec3 multiScatter ) {
#endif
	vec2 fab = DFGApprox( normal, viewDir, roughness );
	#ifdef USE_IRIDESCENCE
		vec3 Fr = mix( specularColor, iridescenceF0, iridescence );
	#else
		vec3 Fr = specularColor;
	#endif
	vec3 FssEss = Fr * fab.x + specularF90 * fab.y;
	float Ess = fab.x + fab.y;
	float Ems = 1.0 - Ess;
	vec3 Favg = Fr + ( 1.0 - Fr ) * 0.047619;	vec3 Fms = FssEss * Favg / ( 1.0 - Ems * Favg );
	singleScatter += FssEss;
	multiScatter += Fms * Ems;
}
#if NUM_RECT_AREA_LIGHTS > 0
	void RE_Direct_RectArea_Physical( const in RectAreaLight rectAreaLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
		vec3 normal = geometryNormal;
		vec3 viewDir = geometryViewDir;
		vec3 position = geometryPosition;
		vec3 lightPos = rectAreaLight.position;
		vec3 halfWidth = rectAreaLight.halfWidth;
		vec3 halfHeight = rectAreaLight.halfHeight;
		vec3 lightColor = rectAreaLight.color;
		float roughness = material.roughness;
		vec3 rectCoords[ 4 ];
		rectCoords[ 0 ] = lightPos + halfWidth - halfHeight;		rectCoords[ 1 ] = lightPos - halfWidth - halfHeight;
		rectCoords[ 2 ] = lightPos - halfWidth + halfHeight;
		rectCoords[ 3 ] = lightPos + halfWidth + halfHeight;
		vec2 uv = LTC_Uv( normal, viewDir, roughness );
		vec4 t1 = texture2D( ltc_1, uv );
		vec4 t2 = texture2D( ltc_2, uv );
		mat3 mInv = mat3(
			vec3( t1.x, 0, t1.y ),
			vec3(    0, 1,    0 ),
			vec3( t1.z, 0, t1.w )
		);
		vec3 fresnel = ( material.specularColor * t2.x + ( vec3( 1.0 ) - material.specularColor ) * t2.y );
		reflectedLight.directSpecular += lightColor * fresnel * LTC_Evaluate( normal, viewDir, position, mInv, rectCoords );
		reflectedLight.directDiffuse += lightColor * material.diffuseColor * LTC_Evaluate( normal, viewDir, position, mat3( 1.0 ), rectCoords );
	}
#endif
void RE_Direct_Physical( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	#ifdef USE_CLEARCOAT
		float dotNLcc = saturate( dot( geometryClearcoatNormal, directLight.direction ) );
		vec3 ccIrradiance = dotNLcc * directLight.color;
		clearcoatSpecularDirect += ccIrradiance * BRDF_GGX_Clearcoat( directLight.direction, geometryViewDir, geometryClearcoatNormal, material );
	#endif
	#ifdef USE_SHEEN
		sheenSpecularDirect += irradiance * BRDF_Sheen( directLight.direction, geometryViewDir, geometryNormal, material.sheenColor, material.sheenRoughness );
	#endif
	reflectedLight.directSpecular += irradiance * BRDF_GGX( directLight.direction, geometryViewDir, geometryNormal, material );
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Physical( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectSpecular_Physical( const in vec3 radiance, const in vec3 irradiance, const in vec3 clearcoatRadiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight) {
	#ifdef USE_CLEARCOAT
		clearcoatSpecularIndirect += clearcoatRadiance * EnvironmentBRDF( geometryClearcoatNormal, geometryViewDir, material.clearcoatF0, material.clearcoatF90, material.clearcoatRoughness );
	#endif
	#ifdef USE_SHEEN
		sheenSpecularIndirect += irradiance * material.sheenColor * IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness );
	#endif
	vec3 singleScattering = vec3( 0.0 );
	vec3 multiScattering = vec3( 0.0 );
	vec3 cosineWeightedIrradiance = irradiance * RECIPROCAL_PI;
	#ifdef USE_IRIDESCENCE
		computeMultiscatteringIridescence( geometryNormal, geometryViewDir, material.specularColor, material.specularF90, material.iridescence, material.iridescenceFresnel, material.roughness, singleScattering, multiScattering );
	#else
		computeMultiscattering( geometryNormal, geometryViewDir, material.specularColor, material.specularF90, material.roughness, singleScattering, multiScattering );
	#endif
	vec3 totalScattering = singleScattering + multiScattering;
	vec3 diffuse = material.diffuseColor * ( 1.0 - max( max( totalScattering.r, totalScattering.g ), totalScattering.b ) );
	reflectedLight.indirectSpecular += radiance * singleScattering;
	reflectedLight.indirectSpecular += multiScattering * cosineWeightedIrradiance;
	reflectedLight.indirectDiffuse += diffuse * cosineWeightedIrradiance;
}
#define RE_Direct				RE_Direct_Physical
#define RE_Direct_RectArea		RE_Direct_RectArea_Physical
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Physical
#define RE_IndirectSpecular		RE_IndirectSpecular_Physical
float computeSpecularOcclusion( const in float dotNV, const in float ambientOcclusion, const in float roughness ) {
	return saturate( pow( dotNV + ambientOcclusion, exp2( - 16.0 * roughness - 1.0 ) ) - 1.0 + ambientOcclusion );
}`,rg=`
vec3 geometryPosition = - vViewPosition;
vec3 geometryNormal = normal;
vec3 geometryViewDir = ( isOrthographic ) ? vec3( 0, 0, 1 ) : normalize( vViewPosition );
vec3 geometryClearcoatNormal = vec3( 0.0 );
#ifdef USE_CLEARCOAT
	geometryClearcoatNormal = clearcoatNormal;
#endif
#ifdef USE_IRIDESCENCE
	float dotNVi = saturate( dot( normal, geometryViewDir ) );
	if ( material.iridescenceThickness == 0.0 ) {
		material.iridescence = 0.0;
	} else {
		material.iridescence = saturate( material.iridescence );
	}
	if ( material.iridescence > 0.0 ) {
		material.iridescenceFresnel = evalIridescence( 1.0, material.iridescenceIOR, dotNVi, material.iridescenceThickness, material.specularColor );
		material.iridescenceF0 = Schlick_to_F0( material.iridescenceFresnel, 1.0, dotNVi );
	}
#endif
IncidentLight directLight;
#if ( NUM_POINT_LIGHTS > 0 ) && defined( RE_Direct )
	PointLight pointLight;
	#if defined( USE_SHADOWMAP ) && NUM_POINT_LIGHT_SHADOWS > 0
	PointLightShadow pointLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_POINT_LIGHTS; i ++ ) {
		pointLight = pointLights[ i ];
		getPointLightInfo( pointLight, geometryPosition, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_POINT_LIGHT_SHADOWS )
		pointLightShadow = pointLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getPointShadow( pointShadowMap[ i ], pointLightShadow.shadowMapSize, pointLightShadow.shadowIntensity, pointLightShadow.shadowBias, pointLightShadow.shadowRadius, vPointShadowCoord[ i ], pointLightShadow.shadowCameraNear, pointLightShadow.shadowCameraFar ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_SPOT_LIGHTS > 0 ) && defined( RE_Direct )
	SpotLight spotLight;
	vec4 spotColor;
	vec3 spotLightCoord;
	bool inSpotLightMap;
	#if defined( USE_SHADOWMAP ) && NUM_SPOT_LIGHT_SHADOWS > 0
	SpotLightShadow spotLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHTS; i ++ ) {
		spotLight = spotLights[ i ];
		getSpotLightInfo( spotLight, geometryPosition, directLight );
		#if ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS )
		#define SPOT_LIGHT_MAP_INDEX UNROLLED_LOOP_INDEX
		#elif ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
		#define SPOT_LIGHT_MAP_INDEX NUM_SPOT_LIGHT_MAPS
		#else
		#define SPOT_LIGHT_MAP_INDEX ( UNROLLED_LOOP_INDEX - NUM_SPOT_LIGHT_SHADOWS + NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS )
		#endif
		#if ( SPOT_LIGHT_MAP_INDEX < NUM_SPOT_LIGHT_MAPS )
			spotLightCoord = vSpotLightCoord[ i ].xyz / vSpotLightCoord[ i ].w;
			inSpotLightMap = all( lessThan( abs( spotLightCoord * 2. - 1. ), vec3( 1.0 ) ) );
			spotColor = texture2D( spotLightMap[ SPOT_LIGHT_MAP_INDEX ], spotLightCoord.xy );
			directLight.color = inSpotLightMap ? directLight.color * spotColor.rgb : directLight.color;
		#endif
		#undef SPOT_LIGHT_MAP_INDEX
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
		spotLightShadow = spotLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getShadow( spotShadowMap[ i ], spotLightShadow.shadowMapSize, spotLightShadow.shadowIntensity, spotLightShadow.shadowBias, spotLightShadow.shadowRadius, vSpotLightCoord[ i ] ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_DIR_LIGHTS > 0 ) && defined( RE_Direct )
	DirectionalLight directionalLight;
	#if defined( USE_SHADOWMAP ) && NUM_DIR_LIGHT_SHADOWS > 0
	DirectionalLightShadow directionalLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_DIR_LIGHTS; i ++ ) {
		directionalLight = directionalLights[ i ];
		getDirectionalLightInfo( directionalLight, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_DIR_LIGHT_SHADOWS )
		directionalLightShadow = directionalLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getShadow( directionalShadowMap[ i ], directionalLightShadow.shadowMapSize, directionalLightShadow.shadowIntensity, directionalLightShadow.shadowBias, directionalLightShadow.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_RECT_AREA_LIGHTS > 0 ) && defined( RE_Direct_RectArea )
	RectAreaLight rectAreaLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_RECT_AREA_LIGHTS; i ++ ) {
		rectAreaLight = rectAreaLights[ i ];
		RE_Direct_RectArea( rectAreaLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if defined( RE_IndirectDiffuse )
	vec3 iblIrradiance = vec3( 0.0 );
	vec3 irradiance = getAmbientLightIrradiance( ambientLightColor );
	#if defined( USE_LIGHT_PROBES )
		irradiance += getLightProbeIrradiance( lightProbe, geometryNormal );
	#endif
	#if ( NUM_HEMI_LIGHTS > 0 )
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_HEMI_LIGHTS; i ++ ) {
			irradiance += getHemisphereLightIrradiance( hemisphereLights[ i ], geometryNormal );
		}
		#pragma unroll_loop_end
	#endif
#endif
#if defined( RE_IndirectSpecular )
	vec3 radiance = vec3( 0.0 );
	vec3 clearcoatRadiance = vec3( 0.0 );
#endif`,sg=`#if defined( RE_IndirectDiffuse )
	#ifdef USE_LIGHTMAP
		vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
		vec3 lightMapIrradiance = lightMapTexel.rgb * lightMapIntensity;
		irradiance += lightMapIrradiance;
	#endif
	#if defined( USE_ENVMAP ) && defined( STANDARD ) && defined( ENVMAP_TYPE_CUBE_UV )
		iblIrradiance += getIBLIrradiance( geometryNormal );
	#endif
#endif
#if defined( USE_ENVMAP ) && defined( RE_IndirectSpecular )
	#ifdef USE_ANISOTROPY
		radiance += getIBLAnisotropyRadiance( geometryViewDir, geometryNormal, material.roughness, material.anisotropyB, material.anisotropy );
	#else
		radiance += getIBLRadiance( geometryViewDir, geometryNormal, material.roughness );
	#endif
	#ifdef USE_CLEARCOAT
		clearcoatRadiance += getIBLRadiance( geometryViewDir, geometryClearcoatNormal, material.clearcoatRoughness );
	#endif
#endif`,og=`#if defined( RE_IndirectDiffuse )
	RE_IndirectDiffuse( irradiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif
#if defined( RE_IndirectSpecular )
	RE_IndirectSpecular( radiance, iblIrradiance, clearcoatRadiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif`,ag=`#if defined( USE_LOGDEPTHBUF )
	gl_FragDepth = vIsPerspective == 0.0 ? gl_FragCoord.z : log2( vFragDepth ) * logDepthBufFC * 0.5;
#endif`,cg=`#if defined( USE_LOGDEPTHBUF )
	uniform float logDepthBufFC;
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,lg=`#ifdef USE_LOGDEPTHBUF
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,hg=`#ifdef USE_LOGDEPTHBUF
	vFragDepth = 1.0 + gl_Position.w;
	vIsPerspective = float( isPerspectiveMatrix( projectionMatrix ) );
#endif`,ug=`#ifdef USE_MAP
	vec4 sampledDiffuseColor = texture2D( map, vMapUv );
	#ifdef DECODE_VIDEO_TEXTURE
		sampledDiffuseColor = sRGBTransferEOTF( sampledDiffuseColor );
	#endif
	diffuseColor *= sampledDiffuseColor;
#endif`,dg=`#ifdef USE_MAP
	uniform sampler2D map;
#endif`,fg=`#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
	#if defined( USE_POINTS_UV )
		vec2 uv = vUv;
	#else
		vec2 uv = ( uvTransform * vec3( gl_PointCoord.x, 1.0 - gl_PointCoord.y, 1 ) ).xy;
	#endif
#endif
#ifdef USE_MAP
	diffuseColor *= texture2D( map, uv );
#endif
#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, uv ).g;
#endif`,pg=`#if defined( USE_POINTS_UV )
	varying vec2 vUv;
#else
	#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
		uniform mat3 uvTransform;
	#endif
#endif
#ifdef USE_MAP
	uniform sampler2D map;
#endif
#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,mg=`float metalnessFactor = metalness;
#ifdef USE_METALNESSMAP
	vec4 texelMetalness = texture2D( metalnessMap, vMetalnessMapUv );
	metalnessFactor *= texelMetalness.b;
#endif`,gg=`#ifdef USE_METALNESSMAP
	uniform sampler2D metalnessMap;
#endif`,bg=`#ifdef USE_INSTANCING_MORPH
	float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	float morphTargetBaseInfluence = texelFetch( morphTexture, ivec2( 0, gl_InstanceID ), 0 ).r;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		morphTargetInfluences[i] =  texelFetch( morphTexture, ivec2( i + 1, gl_InstanceID ), 0 ).r;
	}
#endif`,_g=`#if defined( USE_MORPHCOLORS )
	vColor *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		#if defined( USE_COLOR_ALPHA )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ) * morphTargetInfluences[ i ];
		#elif defined( USE_COLOR )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ).rgb * morphTargetInfluences[ i ];
		#endif
	}
#endif`,xg=`#ifdef USE_MORPHNORMALS
	objectNormal *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) objectNormal += getMorph( gl_VertexID, i, 1 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,vg=`#ifdef USE_MORPHTARGETS
	#ifndef USE_INSTANCING_MORPH
		uniform float morphTargetBaseInfluence;
		uniform float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	#endif
	uniform sampler2DArray morphTargetsTexture;
	uniform ivec2 morphTargetsTextureSize;
	vec4 getMorph( const in int vertexIndex, const in int morphTargetIndex, const in int offset ) {
		int texelIndex = vertexIndex * MORPHTARGETS_TEXTURE_STRIDE + offset;
		int y = texelIndex / morphTargetsTextureSize.x;
		int x = texelIndex - y * morphTargetsTextureSize.x;
		ivec3 morphUV = ivec3( x, y, morphTargetIndex );
		return texelFetch( morphTargetsTexture, morphUV, 0 );
	}
#endif`,yg=`#ifdef USE_MORPHTARGETS
	transformed *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) transformed += getMorph( gl_VertexID, i, 0 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,Mg=`float faceDirection = gl_FrontFacing ? 1.0 : - 1.0;
#ifdef FLAT_SHADED
	vec3 fdx = dFdx( vViewPosition );
	vec3 fdy = dFdy( vViewPosition );
	vec3 normal = normalize( cross( fdx, fdy ) );
#else
	vec3 normal = normalize( vNormal );
	#ifdef DOUBLE_SIDED
		normal *= faceDirection;
	#endif
#endif
#if defined( USE_NORMALMAP_TANGENTSPACE ) || defined( USE_CLEARCOAT_NORMALMAP ) || defined( USE_ANISOTROPY )
	#ifdef USE_TANGENT
		mat3 tbn = mat3( normalize( vTangent ), normalize( vBitangent ), normal );
	#else
		mat3 tbn = getTangentFrame( - vViewPosition, normal,
		#if defined( USE_NORMALMAP )
			vNormalMapUv
		#elif defined( USE_CLEARCOAT_NORMALMAP )
			vClearcoatNormalMapUv
		#else
			vUv
		#endif
		);
	#endif
	#if defined( DOUBLE_SIDED ) && ! defined( FLAT_SHADED )
		tbn[0] *= faceDirection;
		tbn[1] *= faceDirection;
	#endif
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	#ifdef USE_TANGENT
		mat3 tbn2 = mat3( normalize( vTangent ), normalize( vBitangent ), normal );
	#else
		mat3 tbn2 = getTangentFrame( - vViewPosition, normal, vClearcoatNormalMapUv );
	#endif
	#if defined( DOUBLE_SIDED ) && ! defined( FLAT_SHADED )
		tbn2[0] *= faceDirection;
		tbn2[1] *= faceDirection;
	#endif
#endif
vec3 nonPerturbedNormal = normal;`,Sg=`#ifdef USE_NORMALMAP_OBJECTSPACE
	normal = texture2D( normalMap, vNormalMapUv ).xyz * 2.0 - 1.0;
	#ifdef FLIP_SIDED
		normal = - normal;
	#endif
	#ifdef DOUBLE_SIDED
		normal = normal * faceDirection;
	#endif
	normal = normalize( normalMatrix * normal );
#elif defined( USE_NORMALMAP_TANGENTSPACE )
	vec3 mapN = texture2D( normalMap, vNormalMapUv ).xyz * 2.0 - 1.0;
	mapN.xy *= normalScale;
	normal = normalize( tbn * mapN );
#elif defined( USE_BUMPMAP )
	normal = perturbNormalArb( - vViewPosition, normal, dHdxy_fwd(), faceDirection );
#endif`,wg=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,Eg=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,Ag=`#ifndef FLAT_SHADED
	vNormal = normalize( transformedNormal );
	#ifdef USE_TANGENT
		vTangent = normalize( transformedTangent );
		vBitangent = normalize( cross( vNormal, vTangent ) * tangent.w );
	#endif
#endif`,Tg=`#ifdef USE_NORMALMAP
	uniform sampler2D normalMap;
	uniform vec2 normalScale;
#endif
#ifdef USE_NORMALMAP_OBJECTSPACE
	uniform mat3 normalMatrix;
#endif
#if ! defined ( USE_TANGENT ) && ( defined ( USE_NORMALMAP_TANGENTSPACE ) || defined ( USE_CLEARCOAT_NORMALMAP ) || defined( USE_ANISOTROPY ) )
	mat3 getTangentFrame( vec3 eye_pos, vec3 surf_norm, vec2 uv ) {
		vec3 q0 = dFdx( eye_pos.xyz );
		vec3 q1 = dFdy( eye_pos.xyz );
		vec2 st0 = dFdx( uv.st );
		vec2 st1 = dFdy( uv.st );
		vec3 N = surf_norm;
		vec3 q1perp = cross( q1, N );
		vec3 q0perp = cross( N, q0 );
		vec3 T = q1perp * st0.x + q0perp * st1.x;
		vec3 B = q1perp * st0.y + q0perp * st1.y;
		float det = max( dot( T, T ), dot( B, B ) );
		float scale = ( det == 0.0 ) ? 0.0 : inversesqrt( det );
		return mat3( T * scale, B * scale, N );
	}
#endif`,Rg=`#ifdef USE_CLEARCOAT
	vec3 clearcoatNormal = nonPerturbedNormal;
#endif`,Cg=`#ifdef USE_CLEARCOAT_NORMALMAP
	vec3 clearcoatMapN = texture2D( clearcoatNormalMap, vClearcoatNormalMapUv ).xyz * 2.0 - 1.0;
	clearcoatMapN.xy *= clearcoatNormalScale;
	clearcoatNormal = normalize( tbn2 * clearcoatMapN );
#endif`,Pg=`#ifdef USE_CLEARCOATMAP
	uniform sampler2D clearcoatMap;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform sampler2D clearcoatNormalMap;
	uniform vec2 clearcoatNormalScale;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform sampler2D clearcoatRoughnessMap;
#endif`,Lg=`#ifdef USE_IRIDESCENCEMAP
	uniform sampler2D iridescenceMap;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform sampler2D iridescenceThicknessMap;
#endif`,Dg=`#ifdef OPAQUE
diffuseColor.a = 1.0;
#endif
#ifdef USE_TRANSMISSION
diffuseColor.a *= material.transmissionAlpha;
#endif
gl_FragColor = vec4( outgoingLight, diffuseColor.a );`,Ig=`vec3 packNormalToRGB( const in vec3 normal ) {
	return normalize( normal ) * 0.5 + 0.5;
}
vec3 unpackRGBToNormal( const in vec3 rgb ) {
	return 2.0 * rgb.xyz - 1.0;
}
const float PackUpscale = 256. / 255.;const float UnpackDownscale = 255. / 256.;const float ShiftRight8 = 1. / 256.;
const float Inv255 = 1. / 255.;
const vec4 PackFactors = vec4( 1.0, 256.0, 256.0 * 256.0, 256.0 * 256.0 * 256.0 );
const vec2 UnpackFactors2 = vec2( UnpackDownscale, 1.0 / PackFactors.g );
const vec3 UnpackFactors3 = vec3( UnpackDownscale / PackFactors.rg, 1.0 / PackFactors.b );
const vec4 UnpackFactors4 = vec4( UnpackDownscale / PackFactors.rgb, 1.0 / PackFactors.a );
vec4 packDepthToRGBA( const in float v ) {
	if( v <= 0.0 )
		return vec4( 0., 0., 0., 0. );
	if( v >= 1.0 )
		return vec4( 1., 1., 1., 1. );
	float vuf;
	float af = modf( v * PackFactors.a, vuf );
	float bf = modf( vuf * ShiftRight8, vuf );
	float gf = modf( vuf * ShiftRight8, vuf );
	return vec4( vuf * Inv255, gf * PackUpscale, bf * PackUpscale, af );
}
vec3 packDepthToRGB( const in float v ) {
	if( v <= 0.0 )
		return vec3( 0., 0., 0. );
	if( v >= 1.0 )
		return vec3( 1., 1., 1. );
	float vuf;
	float bf = modf( v * PackFactors.b, vuf );
	float gf = modf( vuf * ShiftRight8, vuf );
	return vec3( vuf * Inv255, gf * PackUpscale, bf );
}
vec2 packDepthToRG( const in float v ) {
	if( v <= 0.0 )
		return vec2( 0., 0. );
	if( v >= 1.0 )
		return vec2( 1., 1. );
	float vuf;
	float gf = modf( v * 256., vuf );
	return vec2( vuf * Inv255, gf );
}
float unpackRGBAToDepth( const in vec4 v ) {
	return dot( v, UnpackFactors4 );
}
float unpackRGBToDepth( const in vec3 v ) {
	return dot( v, UnpackFactors3 );
}
float unpackRGToDepth( const in vec2 v ) {
	return v.r * UnpackFactors2.r + v.g * UnpackFactors2.g;
}
vec4 pack2HalfToRGBA( const in vec2 v ) {
	vec4 r = vec4( v.x, fract( v.x * 255.0 ), v.y, fract( v.y * 255.0 ) );
	return vec4( r.x - r.y / 255.0, r.y, r.z - r.w / 255.0, r.w );
}
vec2 unpackRGBATo2Half( const in vec4 v ) {
	return vec2( v.x + ( v.y / 255.0 ), v.z + ( v.w / 255.0 ) );
}
float viewZToOrthographicDepth( const in float viewZ, const in float near, const in float far ) {
	return ( viewZ + near ) / ( near - far );
}
float orthographicDepthToViewZ( const in float depth, const in float near, const in float far ) {
	return depth * ( near - far ) - near;
}
float viewZToPerspectiveDepth( const in float viewZ, const in float near, const in float far ) {
	return ( ( near + viewZ ) * far ) / ( ( far - near ) * viewZ );
}
float perspectiveDepthToViewZ( const in float depth, const in float near, const in float far ) {
	return ( near * far ) / ( ( far - near ) * depth - far );
}`,Ng=`#ifdef PREMULTIPLIED_ALPHA
	gl_FragColor.rgb *= gl_FragColor.a;
#endif`,Ug=`vec4 mvPosition = vec4( transformed, 1.0 );
#ifdef USE_BATCHING
	mvPosition = batchingMatrix * mvPosition;
#endif
#ifdef USE_INSTANCING
	mvPosition = instanceMatrix * mvPosition;
#endif
mvPosition = modelViewMatrix * mvPosition;
gl_Position = projectionMatrix * mvPosition;`,Fg=`#ifdef DITHERING
	gl_FragColor.rgb = dithering( gl_FragColor.rgb );
#endif`,Og=`#ifdef DITHERING
	vec3 dithering( vec3 color ) {
		float grid_position = rand( gl_FragCoord.xy );
		vec3 dither_shift_RGB = vec3( 0.25 / 255.0, -0.25 / 255.0, 0.25 / 255.0 );
		dither_shift_RGB = mix( 2.0 * dither_shift_RGB, -2.0 * dither_shift_RGB, grid_position );
		return color + dither_shift_RGB;
	}
#endif`,kg=`float roughnessFactor = roughness;
#ifdef USE_ROUGHNESSMAP
	vec4 texelRoughness = texture2D( roughnessMap, vRoughnessMapUv );
	roughnessFactor *= texelRoughness.g;
#endif`,Bg=`#ifdef USE_ROUGHNESSMAP
	uniform sampler2D roughnessMap;
#endif`,zg=`#if NUM_SPOT_LIGHT_COORDS > 0
	varying vec4 vSpotLightCoord[ NUM_SPOT_LIGHT_COORDS ];
#endif
#if NUM_SPOT_LIGHT_MAPS > 0
	uniform sampler2D spotLightMap[ NUM_SPOT_LIGHT_MAPS ];
#endif
#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
		uniform sampler2D directionalShadowMap[ NUM_DIR_LIGHT_SHADOWS ];
		varying vec4 vDirectionalShadowCoord[ NUM_DIR_LIGHT_SHADOWS ];
		struct DirectionalLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform DirectionalLightShadow directionalLightShadows[ NUM_DIR_LIGHT_SHADOWS ];
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
		uniform sampler2D spotShadowMap[ NUM_SPOT_LIGHT_SHADOWS ];
		struct SpotLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SpotLightShadow spotLightShadows[ NUM_SPOT_LIGHT_SHADOWS ];
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		uniform sampler2D pointShadowMap[ NUM_POINT_LIGHT_SHADOWS ];
		varying vec4 vPointShadowCoord[ NUM_POINT_LIGHT_SHADOWS ];
		struct PointLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
			float shadowCameraNear;
			float shadowCameraFar;
		};
		uniform PointLightShadow pointLightShadows[ NUM_POINT_LIGHT_SHADOWS ];
	#endif
	float texture2DCompare( sampler2D depths, vec2 uv, float compare ) {
		return step( compare, unpackRGBAToDepth( texture2D( depths, uv ) ) );
	}
	vec2 texture2DDistribution( sampler2D shadow, vec2 uv ) {
		return unpackRGBATo2Half( texture2D( shadow, uv ) );
	}
	float VSMShadow (sampler2D shadow, vec2 uv, float compare ){
		float occlusion = 1.0;
		vec2 distribution = texture2DDistribution( shadow, uv );
		float hard_shadow = step( compare , distribution.x );
		if (hard_shadow != 1.0 ) {
			float distance = compare - distribution.x ;
			float variance = max( 0.00000, distribution.y * distribution.y );
			float softness_probability = variance / (variance + distance * distance );			softness_probability = clamp( ( softness_probability - 0.3 ) / ( 0.95 - 0.3 ), 0.0, 1.0 );			occlusion = clamp( max( hard_shadow, softness_probability ), 0.0, 1.0 );
		}
		return occlusion;
	}
	float getShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord ) {
		float shadow = 1.0;
		shadowCoord.xyz /= shadowCoord.w;
		shadowCoord.z += shadowBias;
		bool inFrustum = shadowCoord.x >= 0.0 && shadowCoord.x <= 1.0 && shadowCoord.y >= 0.0 && shadowCoord.y <= 1.0;
		bool frustumTest = inFrustum && shadowCoord.z <= 1.0;
		if ( frustumTest ) {
		#if defined( SHADOWMAP_TYPE_PCF )
			vec2 texelSize = vec2( 1.0 ) / shadowMapSize;
			float dx0 = - texelSize.x * shadowRadius;
			float dy0 = - texelSize.y * shadowRadius;
			float dx1 = + texelSize.x * shadowRadius;
			float dy1 = + texelSize.y * shadowRadius;
			float dx2 = dx0 / 2.0;
			float dy2 = dy0 / 2.0;
			float dx3 = dx1 / 2.0;
			float dy3 = dy1 / 2.0;
			shadow = (
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx0, dy0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx1, dy0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx2, dy2 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy2 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx3, dy2 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx0, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx2, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy, shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx3, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx1, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx2, dy3 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy3 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx3, dy3 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx0, dy1 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy1 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx1, dy1 ), shadowCoord.z )
			) * ( 1.0 / 17.0 );
		#elif defined( SHADOWMAP_TYPE_PCF_SOFT )
			vec2 texelSize = vec2( 1.0 ) / shadowMapSize;
			float dx = texelSize.x;
			float dy = texelSize.y;
			vec2 uv = shadowCoord.xy;
			vec2 f = fract( uv * shadowMapSize + 0.5 );
			uv -= f * texelSize;
			shadow = (
				texture2DCompare( shadowMap, uv, shadowCoord.z ) +
				texture2DCompare( shadowMap, uv + vec2( dx, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, uv + vec2( 0.0, dy ), shadowCoord.z ) +
				texture2DCompare( shadowMap, uv + texelSize, shadowCoord.z ) +
				mix( texture2DCompare( shadowMap, uv + vec2( -dx, 0.0 ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, 0.0 ), shadowCoord.z ),
					 f.x ) +
				mix( texture2DCompare( shadowMap, uv + vec2( -dx, dy ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, dy ), shadowCoord.z ),
					 f.x ) +
				mix( texture2DCompare( shadowMap, uv + vec2( 0.0, -dy ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( 0.0, 2.0 * dy ), shadowCoord.z ),
					 f.y ) +
				mix( texture2DCompare( shadowMap, uv + vec2( dx, -dy ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( dx, 2.0 * dy ), shadowCoord.z ),
					 f.y ) +
				mix( mix( texture2DCompare( shadowMap, uv + vec2( -dx, -dy ), shadowCoord.z ),
						  texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, -dy ), shadowCoord.z ),
						  f.x ),
					 mix( texture2DCompare( shadowMap, uv + vec2( -dx, 2.0 * dy ), shadowCoord.z ),
						  texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, 2.0 * dy ), shadowCoord.z ),
						  f.x ),
					 f.y )
			) * ( 1.0 / 9.0 );
		#elif defined( SHADOWMAP_TYPE_VSM )
			shadow = VSMShadow( shadowMap, shadowCoord.xy, shadowCoord.z );
		#else
			shadow = texture2DCompare( shadowMap, shadowCoord.xy, shadowCoord.z );
		#endif
		}
		return mix( 1.0, shadow, shadowIntensity );
	}
	vec2 cubeToUV( vec3 v, float texelSizeY ) {
		vec3 absV = abs( v );
		float scaleToCube = 1.0 / max( absV.x, max( absV.y, absV.z ) );
		absV *= scaleToCube;
		v *= scaleToCube * ( 1.0 - 2.0 * texelSizeY );
		vec2 planar = v.xy;
		float almostATexel = 1.5 * texelSizeY;
		float almostOne = 1.0 - almostATexel;
		if ( absV.z >= almostOne ) {
			if ( v.z > 0.0 )
				planar.x = 4.0 - v.x;
		} else if ( absV.x >= almostOne ) {
			float signX = sign( v.x );
			planar.x = v.z * signX + 2.0 * signX;
		} else if ( absV.y >= almostOne ) {
			float signY = sign( v.y );
			planar.x = v.x + 2.0 * signY + 2.0;
			planar.y = v.z * signY - 2.0;
		}
		return vec2( 0.125, 0.25 ) * planar + vec2( 0.375, 0.75 );
	}
	float getPointShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord, float shadowCameraNear, float shadowCameraFar ) {
		float shadow = 1.0;
		vec3 lightToPosition = shadowCoord.xyz;
		
		float lightToPositionLength = length( lightToPosition );
		if ( lightToPositionLength - shadowCameraFar <= 0.0 && lightToPositionLength - shadowCameraNear >= 0.0 ) {
			float dp = ( lightToPositionLength - shadowCameraNear ) / ( shadowCameraFar - shadowCameraNear );			dp += shadowBias;
			vec3 bd3D = normalize( lightToPosition );
			vec2 texelSize = vec2( 1.0 ) / ( shadowMapSize * vec2( 4.0, 2.0 ) );
			#if defined( SHADOWMAP_TYPE_PCF ) || defined( SHADOWMAP_TYPE_PCF_SOFT ) || defined( SHADOWMAP_TYPE_VSM )
				vec2 offset = vec2( - 1, 1 ) * shadowRadius * texelSize.y;
				shadow = (
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xyy, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yyy, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xyx, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yyx, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xxy, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yxy, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xxx, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yxx, texelSize.y ), dp )
				) * ( 1.0 / 9.0 );
			#else
				shadow = texture2DCompare( shadowMap, cubeToUV( bd3D, texelSize.y ), dp );
			#endif
		}
		return mix( 1.0, shadow, shadowIntensity );
	}
#endif`,Hg=`#if NUM_SPOT_LIGHT_COORDS > 0
	uniform mat4 spotLightMatrix[ NUM_SPOT_LIGHT_COORDS ];
	varying vec4 vSpotLightCoord[ NUM_SPOT_LIGHT_COORDS ];
#endif
#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
		uniform mat4 directionalShadowMatrix[ NUM_DIR_LIGHT_SHADOWS ];
		varying vec4 vDirectionalShadowCoord[ NUM_DIR_LIGHT_SHADOWS ];
		struct DirectionalLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform DirectionalLightShadow directionalLightShadows[ NUM_DIR_LIGHT_SHADOWS ];
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
		struct SpotLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SpotLightShadow spotLightShadows[ NUM_SPOT_LIGHT_SHADOWS ];
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		uniform mat4 pointShadowMatrix[ NUM_POINT_LIGHT_SHADOWS ];
		varying vec4 vPointShadowCoord[ NUM_POINT_LIGHT_SHADOWS ];
		struct PointLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
			float shadowCameraNear;
			float shadowCameraFar;
		};
		uniform PointLightShadow pointLightShadows[ NUM_POINT_LIGHT_SHADOWS ];
	#endif
#endif`,Vg=`#if ( defined( USE_SHADOWMAP ) && ( NUM_DIR_LIGHT_SHADOWS > 0 || NUM_POINT_LIGHT_SHADOWS > 0 ) ) || ( NUM_SPOT_LIGHT_COORDS > 0 )
	vec3 shadowWorldNormal = inverseTransformDirection( transformedNormal, viewMatrix );
	vec4 shadowWorldPosition;
#endif
#if defined( USE_SHADOWMAP )
	#if NUM_DIR_LIGHT_SHADOWS > 0
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_DIR_LIGHT_SHADOWS; i ++ ) {
			shadowWorldPosition = worldPosition + vec4( shadowWorldNormal * directionalLightShadows[ i ].shadowNormalBias, 0 );
			vDirectionalShadowCoord[ i ] = directionalShadowMatrix[ i ] * shadowWorldPosition;
		}
		#pragma unroll_loop_end
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_POINT_LIGHT_SHADOWS; i ++ ) {
			shadowWorldPosition = worldPosition + vec4( shadowWorldNormal * pointLightShadows[ i ].shadowNormalBias, 0 );
			vPointShadowCoord[ i ] = pointShadowMatrix[ i ] * shadowWorldPosition;
		}
		#pragma unroll_loop_end
	#endif
#endif
#if NUM_SPOT_LIGHT_COORDS > 0
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHT_COORDS; i ++ ) {
		shadowWorldPosition = worldPosition;
		#if ( defined( USE_SHADOWMAP ) && UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
			shadowWorldPosition.xyz += shadowWorldNormal * spotLightShadows[ i ].shadowNormalBias;
		#endif
		vSpotLightCoord[ i ] = spotLightMatrix[ i ] * shadowWorldPosition;
	}
	#pragma unroll_loop_end
#endif`,Gg=`float getShadowMask() {
	float shadow = 1.0;
	#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
	DirectionalLightShadow directionalLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_DIR_LIGHT_SHADOWS; i ++ ) {
		directionalLight = directionalLightShadows[ i ];
		shadow *= receiveShadow ? getShadow( directionalShadowMap[ i ], directionalLight.shadowMapSize, directionalLight.shadowIntensity, directionalLight.shadowBias, directionalLight.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
	SpotLightShadow spotLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHT_SHADOWS; i ++ ) {
		spotLight = spotLightShadows[ i ];
		shadow *= receiveShadow ? getShadow( spotShadowMap[ i ], spotLight.shadowMapSize, spotLight.shadowIntensity, spotLight.shadowBias, spotLight.shadowRadius, vSpotLightCoord[ i ] ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
	PointLightShadow pointLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_POINT_LIGHT_SHADOWS; i ++ ) {
		pointLight = pointLightShadows[ i ];
		shadow *= receiveShadow ? getPointShadow( pointShadowMap[ i ], pointLight.shadowMapSize, pointLight.shadowIntensity, pointLight.shadowBias, pointLight.shadowRadius, vPointShadowCoord[ i ], pointLight.shadowCameraNear, pointLight.shadowCameraFar ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#endif
	return shadow;
}`,Wg=`#ifdef USE_SKINNING
	mat4 boneMatX = getBoneMatrix( skinIndex.x );
	mat4 boneMatY = getBoneMatrix( skinIndex.y );
	mat4 boneMatZ = getBoneMatrix( skinIndex.z );
	mat4 boneMatW = getBoneMatrix( skinIndex.w );
#endif`,qg=`#ifdef USE_SKINNING
	uniform mat4 bindMatrix;
	uniform mat4 bindMatrixInverse;
	uniform highp sampler2D boneTexture;
	mat4 getBoneMatrix( const in float i ) {
		int size = textureSize( boneTexture, 0 ).x;
		int j = int( i ) * 4;
		int x = j % size;
		int y = j / size;
		vec4 v1 = texelFetch( boneTexture, ivec2( x, y ), 0 );
		vec4 v2 = texelFetch( boneTexture, ivec2( x + 1, y ), 0 );
		vec4 v3 = texelFetch( boneTexture, ivec2( x + 2, y ), 0 );
		vec4 v4 = texelFetch( boneTexture, ivec2( x + 3, y ), 0 );
		return mat4( v1, v2, v3, v4 );
	}
#endif`,jg=`#ifdef USE_SKINNING
	vec4 skinVertex = bindMatrix * vec4( transformed, 1.0 );
	vec4 skinned = vec4( 0.0 );
	skinned += boneMatX * skinVertex * skinWeight.x;
	skinned += boneMatY * skinVertex * skinWeight.y;
	skinned += boneMatZ * skinVertex * skinWeight.z;
	skinned += boneMatW * skinVertex * skinWeight.w;
	transformed = ( bindMatrixInverse * skinned ).xyz;
#endif`,Xg=`#ifdef USE_SKINNING
	mat4 skinMatrix = mat4( 0.0 );
	skinMatrix += skinWeight.x * boneMatX;
	skinMatrix += skinWeight.y * boneMatY;
	skinMatrix += skinWeight.z * boneMatZ;
	skinMatrix += skinWeight.w * boneMatW;
	skinMatrix = bindMatrixInverse * skinMatrix * bindMatrix;
	objectNormal = vec4( skinMatrix * vec4( objectNormal, 0.0 ) ).xyz;
	#ifdef USE_TANGENT
		objectTangent = vec4( skinMatrix * vec4( objectTangent, 0.0 ) ).xyz;
	#endif
#endif`,Qg=`float specularStrength;
#ifdef USE_SPECULARMAP
	vec4 texelSpecular = texture2D( specularMap, vSpecularMapUv );
	specularStrength = texelSpecular.r;
#else
	specularStrength = 1.0;
#endif`,Kg=`#ifdef USE_SPECULARMAP
	uniform sampler2D specularMap;
#endif`,Yg=`#if defined( TONE_MAPPING )
	gl_FragColor.rgb = toneMapping( gl_FragColor.rgb );
#endif`,$g=`#ifndef saturate
#define saturate( a ) clamp( a, 0.0, 1.0 )
#endif
uniform float toneMappingExposure;
vec3 LinearToneMapping( vec3 color ) {
	return saturate( toneMappingExposure * color );
}
vec3 ReinhardToneMapping( vec3 color ) {
	color *= toneMappingExposure;
	return saturate( color / ( vec3( 1.0 ) + color ) );
}
vec3 CineonToneMapping( vec3 color ) {
	color *= toneMappingExposure;
	color = max( vec3( 0.0 ), color - 0.004 );
	return pow( ( color * ( 6.2 * color + 0.5 ) ) / ( color * ( 6.2 * color + 1.7 ) + 0.06 ), vec3( 2.2 ) );
}
vec3 RRTAndODTFit( vec3 v ) {
	vec3 a = v * ( v + 0.0245786 ) - 0.000090537;
	vec3 b = v * ( 0.983729 * v + 0.4329510 ) + 0.238081;
	return a / b;
}
vec3 ACESFilmicToneMapping( vec3 color ) {
	const mat3 ACESInputMat = mat3(
		vec3( 0.59719, 0.07600, 0.02840 ),		vec3( 0.35458, 0.90834, 0.13383 ),
		vec3( 0.04823, 0.01566, 0.83777 )
	);
	const mat3 ACESOutputMat = mat3(
		vec3(  1.60475, -0.10208, -0.00327 ),		vec3( -0.53108,  1.10813, -0.07276 ),
		vec3( -0.07367, -0.00605,  1.07602 )
	);
	color *= toneMappingExposure / 0.6;
	color = ACESInputMat * color;
	color = RRTAndODTFit( color );
	color = ACESOutputMat * color;
	return saturate( color );
}
const mat3 LINEAR_REC2020_TO_LINEAR_SRGB = mat3(
	vec3( 1.6605, - 0.1246, - 0.0182 ),
	vec3( - 0.5876, 1.1329, - 0.1006 ),
	vec3( - 0.0728, - 0.0083, 1.1187 )
);
const mat3 LINEAR_SRGB_TO_LINEAR_REC2020 = mat3(
	vec3( 0.6274, 0.0691, 0.0164 ),
	vec3( 0.3293, 0.9195, 0.0880 ),
	vec3( 0.0433, 0.0113, 0.8956 )
);
vec3 agxDefaultContrastApprox( vec3 x ) {
	vec3 x2 = x * x;
	vec3 x4 = x2 * x2;
	return + 15.5 * x4 * x2
		- 40.14 * x4 * x
		+ 31.96 * x4
		- 6.868 * x2 * x
		+ 0.4298 * x2
		+ 0.1191 * x
		- 0.00232;
}
vec3 AgXToneMapping( vec3 color ) {
	const mat3 AgXInsetMatrix = mat3(
		vec3( 0.856627153315983, 0.137318972929847, 0.11189821299995 ),
		vec3( 0.0951212405381588, 0.761241990602591, 0.0767994186031903 ),
		vec3( 0.0482516061458583, 0.101439036467562, 0.811302368396859 )
	);
	const mat3 AgXOutsetMatrix = mat3(
		vec3( 1.1271005818144368, - 0.1413297634984383, - 0.14132976349843826 ),
		vec3( - 0.11060664309660323, 1.157823702216272, - 0.11060664309660294 ),
		vec3( - 0.016493938717834573, - 0.016493938717834257, 1.2519364065950405 )
	);
	const float AgxMinEv = - 12.47393;	const float AgxMaxEv = 4.026069;
	color *= toneMappingExposure;
	color = LINEAR_SRGB_TO_LINEAR_REC2020 * color;
	color = AgXInsetMatrix * color;
	color = max( color, 1e-10 );	color = log2( color );
	color = ( color - AgxMinEv ) / ( AgxMaxEv - AgxMinEv );
	color = clamp( color, 0.0, 1.0 );
	color = agxDefaultContrastApprox( color );
	color = AgXOutsetMatrix * color;
	color = pow( max( vec3( 0.0 ), color ), vec3( 2.2 ) );
	color = LINEAR_REC2020_TO_LINEAR_SRGB * color;
	color = clamp( color, 0.0, 1.0 );
	return color;
}
vec3 NeutralToneMapping( vec3 color ) {
	const float StartCompression = 0.8 - 0.04;
	const float Desaturation = 0.15;
	color *= toneMappingExposure;
	float x = min( color.r, min( color.g, color.b ) );
	float offset = x < 0.08 ? x - 6.25 * x * x : 0.04;
	color -= offset;
	float peak = max( color.r, max( color.g, color.b ) );
	if ( peak < StartCompression ) return color;
	float d = 1. - StartCompression;
	float newPeak = 1. - d * d / ( peak + d - StartCompression );
	color *= newPeak / peak;
	float g = 1. - 1. / ( Desaturation * ( peak - newPeak ) + 1. );
	return mix( color, vec3( newPeak ), g );
}
vec3 CustomToneMapping( vec3 color ) { return color; }`,Zg=`#ifdef USE_TRANSMISSION
	material.transmission = transmission;
	material.transmissionAlpha = 1.0;
	material.thickness = thickness;
	material.attenuationDistance = attenuationDistance;
	material.attenuationColor = attenuationColor;
	#ifdef USE_TRANSMISSIONMAP
		material.transmission *= texture2D( transmissionMap, vTransmissionMapUv ).r;
	#endif
	#ifdef USE_THICKNESSMAP
		material.thickness *= texture2D( thicknessMap, vThicknessMapUv ).g;
	#endif
	vec3 pos = vWorldPosition;
	vec3 v = normalize( cameraPosition - pos );
	vec3 n = inverseTransformDirection( normal, viewMatrix );
	vec4 transmitted = getIBLVolumeRefraction(
		n, v, material.roughness, material.diffuseColor, material.specularColor, material.specularF90,
		pos, modelMatrix, viewMatrix, projectionMatrix, material.dispersion, material.ior, material.thickness,
		material.attenuationColor, material.attenuationDistance );
	material.transmissionAlpha = mix( material.transmissionAlpha, transmitted.a, material.transmission );
	totalDiffuse = mix( totalDiffuse, transmitted.rgb, material.transmission );
#endif`,Jg=`#ifdef USE_TRANSMISSION
	uniform float transmission;
	uniform float thickness;
	uniform float attenuationDistance;
	uniform vec3 attenuationColor;
	#ifdef USE_TRANSMISSIONMAP
		uniform sampler2D transmissionMap;
	#endif
	#ifdef USE_THICKNESSMAP
		uniform sampler2D thicknessMap;
	#endif
	uniform vec2 transmissionSamplerSize;
	uniform sampler2D transmissionSamplerMap;
	uniform mat4 modelMatrix;
	uniform mat4 projectionMatrix;
	varying vec3 vWorldPosition;
	float w0( float a ) {
		return ( 1.0 / 6.0 ) * ( a * ( a * ( - a + 3.0 ) - 3.0 ) + 1.0 );
	}
	float w1( float a ) {
		return ( 1.0 / 6.0 ) * ( a *  a * ( 3.0 * a - 6.0 ) + 4.0 );
	}
	float w2( float a ){
		return ( 1.0 / 6.0 ) * ( a * ( a * ( - 3.0 * a + 3.0 ) + 3.0 ) + 1.0 );
	}
	float w3( float a ) {
		return ( 1.0 / 6.0 ) * ( a * a * a );
	}
	float g0( float a ) {
		return w0( a ) + w1( a );
	}
	float g1( float a ) {
		return w2( a ) + w3( a );
	}
	float h0( float a ) {
		return - 1.0 + w1( a ) / ( w0( a ) + w1( a ) );
	}
	float h1( float a ) {
		return 1.0 + w3( a ) / ( w2( a ) + w3( a ) );
	}
	vec4 bicubic( sampler2D tex, vec2 uv, vec4 texelSize, float lod ) {
		uv = uv * texelSize.zw + 0.5;
		vec2 iuv = floor( uv );
		vec2 fuv = fract( uv );
		float g0x = g0( fuv.x );
		float g1x = g1( fuv.x );
		float h0x = h0( fuv.x );
		float h1x = h1( fuv.x );
		float h0y = h0( fuv.y );
		float h1y = h1( fuv.y );
		vec2 p0 = ( vec2( iuv.x + h0x, iuv.y + h0y ) - 0.5 ) * texelSize.xy;
		vec2 p1 = ( vec2( iuv.x + h1x, iuv.y + h0y ) - 0.5 ) * texelSize.xy;
		vec2 p2 = ( vec2( iuv.x + h0x, iuv.y + h1y ) - 0.5 ) * texelSize.xy;
		vec2 p3 = ( vec2( iuv.x + h1x, iuv.y + h1y ) - 0.5 ) * texelSize.xy;
		return g0( fuv.y ) * ( g0x * textureLod( tex, p0, lod ) + g1x * textureLod( tex, p1, lod ) ) +
			g1( fuv.y ) * ( g0x * textureLod( tex, p2, lod ) + g1x * textureLod( tex, p3, lod ) );
	}
	vec4 textureBicubic( sampler2D sampler, vec2 uv, float lod ) {
		vec2 fLodSize = vec2( textureSize( sampler, int( lod ) ) );
		vec2 cLodSize = vec2( textureSize( sampler, int( lod + 1.0 ) ) );
		vec2 fLodSizeInv = 1.0 / fLodSize;
		vec2 cLodSizeInv = 1.0 / cLodSize;
		vec4 fSample = bicubic( sampler, uv, vec4( fLodSizeInv, fLodSize ), floor( lod ) );
		vec4 cSample = bicubic( sampler, uv, vec4( cLodSizeInv, cLodSize ), ceil( lod ) );
		return mix( fSample, cSample, fract( lod ) );
	}
	vec3 getVolumeTransmissionRay( const in vec3 n, const in vec3 v, const in float thickness, const in float ior, const in mat4 modelMatrix ) {
		vec3 refractionVector = refract( - v, normalize( n ), 1.0 / ior );
		vec3 modelScale;
		modelScale.x = length( vec3( modelMatrix[ 0 ].xyz ) );
		modelScale.y = length( vec3( modelMatrix[ 1 ].xyz ) );
		modelScale.z = length( vec3( modelMatrix[ 2 ].xyz ) );
		return normalize( refractionVector ) * thickness * modelScale;
	}
	float applyIorToRoughness( const in float roughness, const in float ior ) {
		return roughness * clamp( ior * 2.0 - 2.0, 0.0, 1.0 );
	}
	vec4 getTransmissionSample( const in vec2 fragCoord, const in float roughness, const in float ior ) {
		float lod = log2( transmissionSamplerSize.x ) * applyIorToRoughness( roughness, ior );
		return textureBicubic( transmissionSamplerMap, fragCoord.xy, lod );
	}
	vec3 volumeAttenuation( const in float transmissionDistance, const in vec3 attenuationColor, const in float attenuationDistance ) {
		if ( isinf( attenuationDistance ) ) {
			return vec3( 1.0 );
		} else {
			vec3 attenuationCoefficient = -log( attenuationColor ) / attenuationDistance;
			vec3 transmittance = exp( - attenuationCoefficient * transmissionDistance );			return transmittance;
		}
	}
	vec4 getIBLVolumeRefraction( const in vec3 n, const in vec3 v, const in float roughness, const in vec3 diffuseColor,
		const in vec3 specularColor, const in float specularF90, const in vec3 position, const in mat4 modelMatrix,
		const in mat4 viewMatrix, const in mat4 projMatrix, const in float dispersion, const in float ior, const in float thickness,
		const in vec3 attenuationColor, const in float attenuationDistance ) {
		vec4 transmittedLight;
		vec3 transmittance;
		#ifdef USE_DISPERSION
			float halfSpread = ( ior - 1.0 ) * 0.025 * dispersion;
			vec3 iors = vec3( ior - halfSpread, ior, ior + halfSpread );
			for ( int i = 0; i < 3; i ++ ) {
				vec3 transmissionRay = getVolumeTransmissionRay( n, v, thickness, iors[ i ], modelMatrix );
				vec3 refractedRayExit = position + transmissionRay;
		
				vec4 ndcPos = projMatrix * viewMatrix * vec4( refractedRayExit, 1.0 );
				vec2 refractionCoords = ndcPos.xy / ndcPos.w;
				refractionCoords += 1.0;
				refractionCoords /= 2.0;
		
				vec4 transmissionSample = getTransmissionSample( refractionCoords, roughness, iors[ i ] );
				transmittedLight[ i ] = transmissionSample[ i ];
				transmittedLight.a += transmissionSample.a;
				transmittance[ i ] = diffuseColor[ i ] * volumeAttenuation( length( transmissionRay ), attenuationColor, attenuationDistance )[ i ];
			}
			transmittedLight.a /= 3.0;
		
		#else
		
			vec3 transmissionRay = getVolumeTransmissionRay( n, v, thickness, ior, modelMatrix );
			vec3 refractedRayExit = position + transmissionRay;
			vec4 ndcPos = projMatrix * viewMatrix * vec4( refractedRayExit, 1.0 );
			vec2 refractionCoords = ndcPos.xy / ndcPos.w;
			refractionCoords += 1.0;
			refractionCoords /= 2.0;
			transmittedLight = getTransmissionSample( refractionCoords, roughness, ior );
			transmittance = diffuseColor * volumeAttenuation( length( transmissionRay ), attenuationColor, attenuationDistance );
		
		#endif
		vec3 attenuatedColor = transmittance * transmittedLight.rgb;
		vec3 F = EnvironmentBRDF( n, v, specularColor, specularF90, roughness );
		float transmittanceFactor = ( transmittance.r + transmittance.g + transmittance.b ) / 3.0;
		return vec4( ( 1.0 - F ) * attenuatedColor, 1.0 - ( 1.0 - transmittedLight.a ) * transmittanceFactor );
	}
#endif`,e0=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	varying vec2 vUv;
#endif
#ifdef USE_MAP
	varying vec2 vMapUv;
#endif
#ifdef USE_ALPHAMAP
	varying vec2 vAlphaMapUv;
#endif
#ifdef USE_LIGHTMAP
	varying vec2 vLightMapUv;
#endif
#ifdef USE_AOMAP
	varying vec2 vAoMapUv;
#endif
#ifdef USE_BUMPMAP
	varying vec2 vBumpMapUv;
#endif
#ifdef USE_NORMALMAP
	varying vec2 vNormalMapUv;
#endif
#ifdef USE_EMISSIVEMAP
	varying vec2 vEmissiveMapUv;
#endif
#ifdef USE_METALNESSMAP
	varying vec2 vMetalnessMapUv;
#endif
#ifdef USE_ROUGHNESSMAP
	varying vec2 vRoughnessMapUv;
#endif
#ifdef USE_ANISOTROPYMAP
	varying vec2 vAnisotropyMapUv;
#endif
#ifdef USE_CLEARCOATMAP
	varying vec2 vClearcoatMapUv;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	varying vec2 vClearcoatNormalMapUv;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	varying vec2 vClearcoatRoughnessMapUv;
#endif
#ifdef USE_IRIDESCENCEMAP
	varying vec2 vIridescenceMapUv;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	varying vec2 vIridescenceThicknessMapUv;
#endif
#ifdef USE_SHEEN_COLORMAP
	varying vec2 vSheenColorMapUv;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	varying vec2 vSheenRoughnessMapUv;
#endif
#ifdef USE_SPECULARMAP
	varying vec2 vSpecularMapUv;
#endif
#ifdef USE_SPECULAR_COLORMAP
	varying vec2 vSpecularColorMapUv;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	varying vec2 vSpecularIntensityMapUv;
#endif
#ifdef USE_TRANSMISSIONMAP
	uniform mat3 transmissionMapTransform;
	varying vec2 vTransmissionMapUv;
#endif
#ifdef USE_THICKNESSMAP
	uniform mat3 thicknessMapTransform;
	varying vec2 vThicknessMapUv;
#endif`,t0=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	varying vec2 vUv;
#endif
#ifdef USE_MAP
	uniform mat3 mapTransform;
	varying vec2 vMapUv;
#endif
#ifdef USE_ALPHAMAP
	uniform mat3 alphaMapTransform;
	varying vec2 vAlphaMapUv;
#endif
#ifdef USE_LIGHTMAP
	uniform mat3 lightMapTransform;
	varying vec2 vLightMapUv;
#endif
#ifdef USE_AOMAP
	uniform mat3 aoMapTransform;
	varying vec2 vAoMapUv;
#endif
#ifdef USE_BUMPMAP
	uniform mat3 bumpMapTransform;
	varying vec2 vBumpMapUv;
#endif
#ifdef USE_NORMALMAP
	uniform mat3 normalMapTransform;
	varying vec2 vNormalMapUv;
#endif
#ifdef USE_DISPLACEMENTMAP
	uniform mat3 displacementMapTransform;
	varying vec2 vDisplacementMapUv;
#endif
#ifdef USE_EMISSIVEMAP
	uniform mat3 emissiveMapTransform;
	varying vec2 vEmissiveMapUv;
#endif
#ifdef USE_METALNESSMAP
	uniform mat3 metalnessMapTransform;
	varying vec2 vMetalnessMapUv;
#endif
#ifdef USE_ROUGHNESSMAP
	uniform mat3 roughnessMapTransform;
	varying vec2 vRoughnessMapUv;
#endif
#ifdef USE_ANISOTROPYMAP
	uniform mat3 anisotropyMapTransform;
	varying vec2 vAnisotropyMapUv;
#endif
#ifdef USE_CLEARCOATMAP
	uniform mat3 clearcoatMapTransform;
	varying vec2 vClearcoatMapUv;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform mat3 clearcoatNormalMapTransform;
	varying vec2 vClearcoatNormalMapUv;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform mat3 clearcoatRoughnessMapTransform;
	varying vec2 vClearcoatRoughnessMapUv;
#endif
#ifdef USE_SHEEN_COLORMAP
	uniform mat3 sheenColorMapTransform;
	varying vec2 vSheenColorMapUv;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	uniform mat3 sheenRoughnessMapTransform;
	varying vec2 vSheenRoughnessMapUv;
#endif
#ifdef USE_IRIDESCENCEMAP
	uniform mat3 iridescenceMapTransform;
	varying vec2 vIridescenceMapUv;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform mat3 iridescenceThicknessMapTransform;
	varying vec2 vIridescenceThicknessMapUv;
#endif
#ifdef USE_SPECULARMAP
	uniform mat3 specularMapTransform;
	varying vec2 vSpecularMapUv;
#endif
#ifdef USE_SPECULAR_COLORMAP
	uniform mat3 specularColorMapTransform;
	varying vec2 vSpecularColorMapUv;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	uniform mat3 specularIntensityMapTransform;
	varying vec2 vSpecularIntensityMapUv;
#endif
#ifdef USE_TRANSMISSIONMAP
	uniform mat3 transmissionMapTransform;
	varying vec2 vTransmissionMapUv;
#endif
#ifdef USE_THICKNESSMAP
	uniform mat3 thicknessMapTransform;
	varying vec2 vThicknessMapUv;
#endif`,n0=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	vUv = vec3( uv, 1 ).xy;
#endif
#ifdef USE_MAP
	vMapUv = ( mapTransform * vec3( MAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ALPHAMAP
	vAlphaMapUv = ( alphaMapTransform * vec3( ALPHAMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_LIGHTMAP
	vLightMapUv = ( lightMapTransform * vec3( LIGHTMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_AOMAP
	vAoMapUv = ( aoMapTransform * vec3( AOMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_BUMPMAP
	vBumpMapUv = ( bumpMapTransform * vec3( BUMPMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_NORMALMAP
	vNormalMapUv = ( normalMapTransform * vec3( NORMALMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_DISPLACEMENTMAP
	vDisplacementMapUv = ( displacementMapTransform * vec3( DISPLACEMENTMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_EMISSIVEMAP
	vEmissiveMapUv = ( emissiveMapTransform * vec3( EMISSIVEMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_METALNESSMAP
	vMetalnessMapUv = ( metalnessMapTransform * vec3( METALNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ROUGHNESSMAP
	vRoughnessMapUv = ( roughnessMapTransform * vec3( ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ANISOTROPYMAP
	vAnisotropyMapUv = ( anisotropyMapTransform * vec3( ANISOTROPYMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOATMAP
	vClearcoatMapUv = ( clearcoatMapTransform * vec3( CLEARCOATMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	vClearcoatNormalMapUv = ( clearcoatNormalMapTransform * vec3( CLEARCOAT_NORMALMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	vClearcoatRoughnessMapUv = ( clearcoatRoughnessMapTransform * vec3( CLEARCOAT_ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_IRIDESCENCEMAP
	vIridescenceMapUv = ( iridescenceMapTransform * vec3( IRIDESCENCEMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	vIridescenceThicknessMapUv = ( iridescenceThicknessMapTransform * vec3( IRIDESCENCE_THICKNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SHEEN_COLORMAP
	vSheenColorMapUv = ( sheenColorMapTransform * vec3( SHEEN_COLORMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	vSheenRoughnessMapUv = ( sheenRoughnessMapTransform * vec3( SHEEN_ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULARMAP
	vSpecularMapUv = ( specularMapTransform * vec3( SPECULARMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULAR_COLORMAP
	vSpecularColorMapUv = ( specularColorMapTransform * vec3( SPECULAR_COLORMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	vSpecularIntensityMapUv = ( specularIntensityMapTransform * vec3( SPECULAR_INTENSITYMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_TRANSMISSIONMAP
	vTransmissionMapUv = ( transmissionMapTransform * vec3( TRANSMISSIONMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_THICKNESSMAP
	vThicknessMapUv = ( thicknessMapTransform * vec3( THICKNESSMAP_UV, 1 ) ).xy;
#endif`,i0=`#if defined( USE_ENVMAP ) || defined( DISTANCE ) || defined ( USE_SHADOWMAP ) || defined ( USE_TRANSMISSION ) || NUM_SPOT_LIGHT_COORDS > 0
	vec4 worldPosition = vec4( transformed, 1.0 );
	#ifdef USE_BATCHING
		worldPosition = batchingMatrix * worldPosition;
	#endif
	#ifdef USE_INSTANCING
		worldPosition = instanceMatrix * worldPosition;
	#endif
	worldPosition = modelMatrix * worldPosition;
#endif`;const r0=`varying vec2 vUv;
uniform mat3 uvTransform;
void main() {
	vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	gl_Position = vec4( position.xy, 1.0, 1.0 );
}`,s0=`uniform sampler2D t2D;
uniform float backgroundIntensity;
varying vec2 vUv;
void main() {
	vec4 texColor = texture2D( t2D, vUv );
	#ifdef DECODE_VIDEO_TEXTURE
		texColor = vec4( mix( pow( texColor.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), texColor.rgb * 0.0773993808, vec3( lessThanEqual( texColor.rgb, vec3( 0.04045 ) ) ) ), texColor.w );
	#endif
	texColor.rgb *= backgroundIntensity;
	gl_FragColor = texColor;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,o0=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,a0=`#ifdef ENVMAP_TYPE_CUBE
	uniform samplerCube envMap;
#elif defined( ENVMAP_TYPE_CUBE_UV )
	uniform sampler2D envMap;
#endif
uniform float flipEnvMap;
uniform float backgroundBlurriness;
uniform float backgroundIntensity;
uniform mat3 backgroundRotation;
varying vec3 vWorldDirection;
#include <cube_uv_reflection_fragment>
void main() {
	#ifdef ENVMAP_TYPE_CUBE
		vec4 texColor = textureCube( envMap, backgroundRotation * vec3( flipEnvMap * vWorldDirection.x, vWorldDirection.yz ) );
	#elif defined( ENVMAP_TYPE_CUBE_UV )
		vec4 texColor = textureCubeUV( envMap, backgroundRotation * vWorldDirection, backgroundBlurriness );
	#else
		vec4 texColor = vec4( 0.0, 0.0, 0.0, 1.0 );
	#endif
	texColor.rgb *= backgroundIntensity;
	gl_FragColor = texColor;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,c0=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,l0=`uniform samplerCube tCube;
uniform float tFlip;
uniform float opacity;
varying vec3 vWorldDirection;
void main() {
	vec4 texColor = textureCube( tCube, vec3( tFlip * vWorldDirection.x, vWorldDirection.yz ) );
	gl_FragColor = texColor;
	gl_FragColor.a *= opacity;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,h0=`#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
varying vec2 vHighPrecisionZW;
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <skinbase_vertex>
	#include <morphinstance_vertex>
	#ifdef USE_DISPLACEMENTMAP
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vHighPrecisionZW = gl_Position.zw;
}`,u0=`#if DEPTH_PACKING == 3200
	uniform float opacity;
#endif
#include <common>
#include <packing>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
varying vec2 vHighPrecisionZW;
void main() {
	vec4 diffuseColor = vec4( 1.0 );
	#include <clipping_planes_fragment>
	#if DEPTH_PACKING == 3200
		diffuseColor.a = opacity;
	#endif
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <logdepthbuf_fragment>
	float fragCoordZ = 0.5 * vHighPrecisionZW[0] / vHighPrecisionZW[1] + 0.5;
	#if DEPTH_PACKING == 3200
		gl_FragColor = vec4( vec3( 1.0 - fragCoordZ ), opacity );
	#elif DEPTH_PACKING == 3201
		gl_FragColor = packDepthToRGBA( fragCoordZ );
	#elif DEPTH_PACKING == 3202
		gl_FragColor = vec4( packDepthToRGB( fragCoordZ ), 1.0 );
	#elif DEPTH_PACKING == 3203
		gl_FragColor = vec4( packDepthToRG( fragCoordZ ), 0.0, 1.0 );
	#endif
}`,d0=`#define DISTANCE
varying vec3 vWorldPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <skinbase_vertex>
	#include <morphinstance_vertex>
	#ifdef USE_DISPLACEMENTMAP
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <worldpos_vertex>
	#include <clipping_planes_vertex>
	vWorldPosition = worldPosition.xyz;
}`,f0=`#define DISTANCE
uniform vec3 referencePosition;
uniform float nearDistance;
uniform float farDistance;
varying vec3 vWorldPosition;
#include <common>
#include <packing>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <clipping_planes_pars_fragment>
void main () {
	vec4 diffuseColor = vec4( 1.0 );
	#include <clipping_planes_fragment>
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	float dist = length( vWorldPosition - referencePosition );
	dist = ( dist - nearDistance ) / ( farDistance - nearDistance );
	dist = saturate( dist );
	gl_FragColor = packDepthToRGBA( dist );
}`,p0=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
}`,m0=`uniform sampler2D tEquirect;
varying vec3 vWorldDirection;
#include <common>
void main() {
	vec3 direction = normalize( vWorldDirection );
	vec2 sampleUV = equirectUv( direction );
	gl_FragColor = texture2D( tEquirect, sampleUV );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,g0=`uniform float scale;
attribute float lineDistance;
varying float vLineDistance;
#include <common>
#include <uv_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	vLineDistance = scale * lineDistance;
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
}`,b0=`uniform vec3 diffuse;
uniform float opacity;
uniform float dashSize;
uniform float totalSize;
varying float vLineDistance;
#include <common>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	if ( mod( vLineDistance, totalSize ) > dashSize ) {
		discard;
	}
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,_0=`#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#if defined ( USE_ENVMAP ) || defined ( USE_SKINNING )
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinbase_vertex>
		#include <skinnormal_vertex>
		#include <defaultnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <fog_vertex>
}`,x0=`uniform vec3 diffuse;
uniform float opacity;
#ifndef FLAT_SHADED
	varying vec3 vNormal;
#endif
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <fog_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	#ifdef USE_LIGHTMAP
		vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
		reflectedLight.indirectDiffuse += lightMapTexel.rgb * lightMapIntensity * RECIPROCAL_PI;
	#else
		reflectedLight.indirectDiffuse += vec3( 1.0 );
	#endif
	#include <aomap_fragment>
	reflectedLight.indirectDiffuse *= diffuseColor.rgb;
	vec3 outgoingLight = reflectedLight.indirectDiffuse;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,v0=`#define LAMBERT
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,y0=`#define LAMBERT
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float opacity;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_lambert_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_lambert_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + totalEmissiveRadiance;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,M0=`#define MATCAP
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <color_pars_vertex>
#include <displacementmap_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
	vViewPosition = - mvPosition.xyz;
}`,S0=`#define MATCAP
uniform vec3 diffuse;
uniform float opacity;
uniform sampler2D matcap;
varying vec3 vViewPosition;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <normal_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	vec3 viewDir = normalize( vViewPosition );
	vec3 x = normalize( vec3( viewDir.z, 0.0, - viewDir.x ) );
	vec3 y = cross( viewDir, x );
	vec2 uv = vec2( dot( x, normal ), dot( y, normal ) ) * 0.495 + 0.5;
	#ifdef USE_MATCAP
		vec4 matcapColor = texture2D( matcap, uv );
	#else
		vec4 matcapColor = vec4( vec3( mix( 0.2, 0.8, uv.y ) ), 1.0 );
	#endif
	vec3 outgoingLight = diffuseColor.rgb * matcapColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,w0=`#define NORMAL
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	varying vec3 vViewPosition;
#endif
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	vViewPosition = - mvPosition.xyz;
#endif
}`,E0=`#define NORMAL
uniform float opacity;
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	varying vec3 vViewPosition;
#endif
#include <packing>
#include <uv_pars_fragment>
#include <normal_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( 0.0, 0.0, 0.0, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	gl_FragColor = vec4( packNormalToRGB( normal ), diffuseColor.a );
	#ifdef OPAQUE
		gl_FragColor.a = 1.0;
	#endif
}`,A0=`#define PHONG
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,T0=`#define PHONG
uniform vec3 diffuse;
uniform vec3 emissive;
uniform vec3 specular;
uniform float shininess;
uniform float opacity;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_phong_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_phong_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + reflectedLight.directSpecular + reflectedLight.indirectSpecular + totalEmissiveRadiance;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,R0=`#define STANDARD
varying vec3 vViewPosition;
#ifdef USE_TRANSMISSION
	varying vec3 vWorldPosition;
#endif
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
#ifdef USE_TRANSMISSION
	vWorldPosition = worldPosition.xyz;
#endif
}`,C0=`#define STANDARD
#ifdef PHYSICAL
	#define IOR
	#define USE_SPECULAR
#endif
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float roughness;
uniform float metalness;
uniform float opacity;
#ifdef IOR
	uniform float ior;
#endif
#ifdef USE_SPECULAR
	uniform float specularIntensity;
	uniform vec3 specularColor;
	#ifdef USE_SPECULAR_COLORMAP
		uniform sampler2D specularColorMap;
	#endif
	#ifdef USE_SPECULAR_INTENSITYMAP
		uniform sampler2D specularIntensityMap;
	#endif
#endif
#ifdef USE_CLEARCOAT
	uniform float clearcoat;
	uniform float clearcoatRoughness;
#endif
#ifdef USE_DISPERSION
	uniform float dispersion;
#endif
#ifdef USE_IRIDESCENCE
	uniform float iridescence;
	uniform float iridescenceIOR;
	uniform float iridescenceThicknessMinimum;
	uniform float iridescenceThicknessMaximum;
#endif
#ifdef USE_SHEEN
	uniform vec3 sheenColor;
	uniform float sheenRoughness;
	#ifdef USE_SHEEN_COLORMAP
		uniform sampler2D sheenColorMap;
	#endif
	#ifdef USE_SHEEN_ROUGHNESSMAP
		uniform sampler2D sheenRoughnessMap;
	#endif
#endif
#ifdef USE_ANISOTROPY
	uniform vec2 anisotropyVector;
	#ifdef USE_ANISOTROPYMAP
		uniform sampler2D anisotropyMap;
	#endif
#endif
varying vec3 vViewPosition;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <iridescence_fragment>
#include <cube_uv_reflection_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_physical_pars_fragment>
#include <fog_pars_fragment>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_physical_pars_fragment>
#include <transmission_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <clearcoat_pars_fragment>
#include <iridescence_pars_fragment>
#include <roughnessmap_pars_fragment>
#include <metalnessmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <roughnessmap_fragment>
	#include <metalnessmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <clearcoat_normal_fragment_begin>
	#include <clearcoat_normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_physical_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 totalDiffuse = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse;
	vec3 totalSpecular = reflectedLight.directSpecular + reflectedLight.indirectSpecular;
	#include <transmission_fragment>
	vec3 outgoingLight = totalDiffuse + totalSpecular + totalEmissiveRadiance;
	#ifdef USE_SHEEN
		float sheenEnergyComp = 1.0 - 0.157 * max3( material.sheenColor );
		outgoingLight = outgoingLight * sheenEnergyComp + sheenSpecularDirect + sheenSpecularIndirect;
	#endif
	#ifdef USE_CLEARCOAT
		float dotNVcc = saturate( dot( geometryClearcoatNormal, geometryViewDir ) );
		vec3 Fcc = F_Schlick( material.clearcoatF0, material.clearcoatF90, dotNVcc );
		outgoingLight = outgoingLight * ( 1.0 - material.clearcoat * Fcc ) + ( clearcoatSpecularDirect + clearcoatSpecularIndirect ) * material.clearcoat;
	#endif
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,P0=`#define TOON
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,L0=`#define TOON
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float opacity;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <gradientmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_toon_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_toon_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + totalEmissiveRadiance;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,D0=`uniform float size;
uniform float scale;
#include <common>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
#ifdef USE_POINTS_UV
	varying vec2 vUv;
	uniform mat3 uvTransform;
#endif
void main() {
	#ifdef USE_POINTS_UV
		vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	#endif
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <project_vertex>
	gl_PointSize = size;
	#ifdef USE_SIZEATTENUATION
		bool isPerspective = isPerspectiveMatrix( projectionMatrix );
		if ( isPerspective ) gl_PointSize *= ( scale / - mvPosition.z );
	#endif
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <worldpos_vertex>
	#include <fog_vertex>
}`,I0=`uniform vec3 diffuse;
uniform float opacity;
#include <common>
#include <color_pars_fragment>
#include <map_particle_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_particle_fragment>
	#include <color_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,N0=`#include <common>
#include <batching_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <shadowmap_pars_vertex>
void main() {
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,U0=`uniform vec3 color;
uniform float opacity;
#include <common>
#include <packing>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <logdepthbuf_pars_fragment>
#include <shadowmap_pars_fragment>
#include <shadowmask_pars_fragment>
void main() {
	#include <logdepthbuf_fragment>
	gl_FragColor = vec4( color, opacity * ( 1.0 - getShadowMask() ) );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
}`,F0=`uniform float rotation;
uniform vec2 center;
#include <common>
#include <uv_pars_vertex>
#include <fog_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	vec4 mvPosition = modelViewMatrix[ 3 ];
	vec2 scale = vec2( length( modelMatrix[ 0 ].xyz ), length( modelMatrix[ 1 ].xyz ) );
	#ifndef USE_SIZEATTENUATION
		bool isPerspective = isPerspectiveMatrix( projectionMatrix );
		if ( isPerspective ) scale *= - mvPosition.z;
	#endif
	vec2 alignedPosition = ( position.xy - ( center - vec2( 0.5 ) ) ) * scale;
	vec2 rotatedPosition;
	rotatedPosition.x = cos( rotation ) * alignedPosition.x - sin( rotation ) * alignedPosition.y;
	rotatedPosition.y = sin( rotation ) * alignedPosition.x + cos( rotation ) * alignedPosition.y;
	mvPosition.xy += rotatedPosition;
	gl_Position = projectionMatrix * mvPosition;
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
}`,O0=`uniform vec3 diffuse;
uniform float opacity;
#include <common>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
}`,xt={alphahash_fragment:sm,alphahash_pars_fragment:om,alphamap_fragment:am,alphamap_pars_fragment:cm,alphatest_fragment:lm,alphatest_pars_fragment:hm,aomap_fragment:um,aomap_pars_fragment:dm,batching_pars_vertex:fm,batching_vertex:pm,begin_vertex:mm,beginnormal_vertex:gm,bsdfs:bm,iridescence_fragment:_m,bumpmap_pars_fragment:xm,clipping_planes_fragment:vm,clipping_planes_pars_fragment:ym,clipping_planes_pars_vertex:Mm,clipping_planes_vertex:Sm,color_fragment:wm,color_pars_fragment:Em,color_pars_vertex:Am,color_vertex:Tm,common:Rm,cube_uv_reflection_fragment:Cm,defaultnormal_vertex:Pm,displacementmap_pars_vertex:Lm,displacementmap_vertex:Dm,emissivemap_fragment:Im,emissivemap_pars_fragment:Nm,colorspace_fragment:Um,colorspace_pars_fragment:Fm,envmap_fragment:Om,envmap_common_pars_fragment:km,envmap_pars_fragment:Bm,envmap_pars_vertex:zm,envmap_physical_pars_fragment:$m,envmap_vertex:Hm,fog_vertex:Vm,fog_pars_vertex:Gm,fog_fragment:Wm,fog_pars_fragment:qm,gradientmap_pars_fragment:jm,lightmap_pars_fragment:Xm,lights_lambert_fragment:Qm,lights_lambert_pars_fragment:Km,lights_pars_begin:Ym,lights_toon_fragment:Zm,lights_toon_pars_fragment:Jm,lights_phong_fragment:eg,lights_phong_pars_fragment:tg,lights_physical_fragment:ng,lights_physical_pars_fragment:ig,lights_fragment_begin:rg,lights_fragment_maps:sg,lights_fragment_end:og,logdepthbuf_fragment:ag,logdepthbuf_pars_fragment:cg,logdepthbuf_pars_vertex:lg,logdepthbuf_vertex:hg,map_fragment:ug,map_pars_fragment:dg,map_particle_fragment:fg,map_particle_pars_fragment:pg,metalnessmap_fragment:mg,metalnessmap_pars_fragment:gg,morphinstance_vertex:bg,morphcolor_vertex:_g,morphnormal_vertex:xg,morphtarget_pars_vertex:vg,morphtarget_vertex:yg,normal_fragment_begin:Mg,normal_fragment_maps:Sg,normal_pars_fragment:wg,normal_pars_vertex:Eg,normal_vertex:Ag,normalmap_pars_fragment:Tg,clearcoat_normal_fragment_begin:Rg,clearcoat_normal_fragment_maps:Cg,clearcoat_pars_fragment:Pg,iridescence_pars_fragment:Lg,opaque_fragment:Dg,packing:Ig,premultiplied_alpha_fragment:Ng,project_vertex:Ug,dithering_fragment:Fg,dithering_pars_fragment:Og,roughnessmap_fragment:kg,roughnessmap_pars_fragment:Bg,shadowmap_pars_fragment:zg,shadowmap_pars_vertex:Hg,shadowmap_vertex:Vg,shadowmask_pars_fragment:Gg,skinbase_vertex:Wg,skinning_pars_vertex:qg,skinning_vertex:jg,skinnormal_vertex:Xg,specularmap_fragment:Qg,specularmap_pars_fragment:Kg,tonemapping_fragment:Yg,tonemapping_pars_fragment:$g,transmission_fragment:Zg,transmission_pars_fragment:Jg,uv_pars_fragment:e0,uv_pars_vertex:t0,uv_vertex:n0,worldpos_vertex:i0,background_vert:r0,background_frag:s0,backgroundCube_vert:o0,backgroundCube_frag:a0,cube_vert:c0,cube_frag:l0,depth_vert:h0,depth_frag:u0,distanceRGBA_vert:d0,distanceRGBA_frag:f0,equirect_vert:p0,equirect_frag:m0,linedashed_vert:g0,linedashed_frag:b0,meshbasic_vert:_0,meshbasic_frag:x0,meshlambert_vert:v0,meshlambert_frag:y0,meshmatcap_vert:M0,meshmatcap_frag:S0,meshnormal_vert:w0,meshnormal_frag:E0,meshphong_vert:A0,meshphong_frag:T0,meshphysical_vert:R0,meshphysical_frag:C0,meshtoon_vert:P0,meshtoon_frag:L0,points_vert:D0,points_frag:I0,shadow_vert:N0,shadow_frag:U0,sprite_vert:F0,sprite_frag:O0},Te={common:{diffuse:{value:new it(16777215)},opacity:{value:1},map:{value:null},mapTransform:{value:new bt},alphaMap:{value:null},alphaMapTransform:{value:new bt},alphaTest:{value:0}},specularmap:{specularMap:{value:null},specularMapTransform:{value:new bt}},envmap:{envMap:{value:null},envMapRotation:{value:new bt},flipEnvMap:{value:-1},reflectivity:{value:1},ior:{value:1.5},refractionRatio:{value:.98}},aomap:{aoMap:{value:null},aoMapIntensity:{value:1},aoMapTransform:{value:new bt}},lightmap:{lightMap:{value:null},lightMapIntensity:{value:1},lightMapTransform:{value:new bt}},bumpmap:{bumpMap:{value:null},bumpMapTransform:{value:new bt},bumpScale:{value:1}},normalmap:{normalMap:{value:null},normalMapTransform:{value:new bt},normalScale:{value:new at(1,1)}},displacementmap:{displacementMap:{value:null},displacementMapTransform:{value:new bt},displacementScale:{value:1},displacementBias:{value:0}},emissivemap:{emissiveMap:{value:null},emissiveMapTransform:{value:new bt}},metalnessmap:{metalnessMap:{value:null},metalnessMapTransform:{value:new bt}},roughnessmap:{roughnessMap:{value:null},roughnessMapTransform:{value:new bt}},gradientmap:{gradientMap:{value:null}},fog:{fogDensity:{value:25e-5},fogNear:{value:1},fogFar:{value:2e3},fogColor:{value:new it(16777215)}},lights:{ambientLightColor:{value:[]},lightProbe:{value:[]},directionalLights:{value:[],properties:{direction:{},color:{}}},directionalLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},directionalShadowMap:{value:[]},directionalShadowMatrix:{value:[]},spotLights:{value:[],properties:{color:{},position:{},direction:{},distance:{},coneCos:{},penumbraCos:{},decay:{}}},spotLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},spotLightMap:{value:[]},spotShadowMap:{value:[]},spotLightMatrix:{value:[]},pointLights:{value:[],properties:{color:{},position:{},decay:{},distance:{}}},pointLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{},shadowCameraNear:{},shadowCameraFar:{}}},pointShadowMap:{value:[]},pointShadowMatrix:{value:[]},hemisphereLights:{value:[],properties:{direction:{},skyColor:{},groundColor:{}}},rectAreaLights:{value:[],properties:{color:{},position:{},width:{},height:{}}},ltc_1:{value:null},ltc_2:{value:null}},points:{diffuse:{value:new it(16777215)},opacity:{value:1},size:{value:1},scale:{value:1},map:{value:null},alphaMap:{value:null},alphaMapTransform:{value:new bt},alphaTest:{value:0},uvTransform:{value:new bt}},sprite:{diffuse:{value:new it(16777215)},opacity:{value:1},center:{value:new at(.5,.5)},rotation:{value:0},map:{value:null},mapTransform:{value:new bt},alphaMap:{value:null},alphaMapTransform:{value:new bt},alphaTest:{value:0}}},pi={basic:{uniforms:Tn([Te.common,Te.specularmap,Te.envmap,Te.aomap,Te.lightmap,Te.fog]),vertexShader:xt.meshbasic_vert,fragmentShader:xt.meshbasic_frag},lambert:{uniforms:Tn([Te.common,Te.specularmap,Te.envmap,Te.aomap,Te.lightmap,Te.emissivemap,Te.bumpmap,Te.normalmap,Te.displacementmap,Te.fog,Te.lights,{emissive:{value:new it(0)}}]),vertexShader:xt.meshlambert_vert,fragmentShader:xt.meshlambert_frag},phong:{uniforms:Tn([Te.common,Te.specularmap,Te.envmap,Te.aomap,Te.lightmap,Te.emissivemap,Te.bumpmap,Te.normalmap,Te.displacementmap,Te.fog,Te.lights,{emissive:{value:new it(0)},specular:{value:new it(1118481)},shininess:{value:30}}]),vertexShader:xt.meshphong_vert,fragmentShader:xt.meshphong_frag},standard:{uniforms:Tn([Te.common,Te.envmap,Te.aomap,Te.lightmap,Te.emissivemap,Te.bumpmap,Te.normalmap,Te.displacementmap,Te.roughnessmap,Te.metalnessmap,Te.fog,Te.lights,{emissive:{value:new it(0)},roughness:{value:1},metalness:{value:0},envMapIntensity:{value:1}}]),vertexShader:xt.meshphysical_vert,fragmentShader:xt.meshphysical_frag},toon:{uniforms:Tn([Te.common,Te.aomap,Te.lightmap,Te.emissivemap,Te.bumpmap,Te.normalmap,Te.displacementmap,Te.gradientmap,Te.fog,Te.lights,{emissive:{value:new it(0)}}]),vertexShader:xt.meshtoon_vert,fragmentShader:xt.meshtoon_frag},matcap:{uniforms:Tn([Te.common,Te.bumpmap,Te.normalmap,Te.displacementmap,Te.fog,{matcap:{value:null}}]),vertexShader:xt.meshmatcap_vert,fragmentShader:xt.meshmatcap_frag},points:{uniforms:Tn([Te.points,Te.fog]),vertexShader:xt.points_vert,fragmentShader:xt.points_frag},dashed:{uniforms:Tn([Te.common,Te.fog,{scale:{value:1},dashSize:{value:1},totalSize:{value:2}}]),vertexShader:xt.linedashed_vert,fragmentShader:xt.linedashed_frag},depth:{uniforms:Tn([Te.common,Te.displacementmap]),vertexShader:xt.depth_vert,fragmentShader:xt.depth_frag},normal:{uniforms:Tn([Te.common,Te.bumpmap,Te.normalmap,Te.displacementmap,{opacity:{value:1}}]),vertexShader:xt.meshnormal_vert,fragmentShader:xt.meshnormal_frag},sprite:{uniforms:Tn([Te.sprite,Te.fog]),vertexShader:xt.sprite_vert,fragmentShader:xt.sprite_frag},background:{uniforms:{uvTransform:{value:new bt},t2D:{value:null},backgroundIntensity:{value:1}},vertexShader:xt.background_vert,fragmentShader:xt.background_frag},backgroundCube:{uniforms:{envMap:{value:null},flipEnvMap:{value:-1},backgroundBlurriness:{value:0},backgroundIntensity:{value:1},backgroundRotation:{value:new bt}},vertexShader:xt.backgroundCube_vert,fragmentShader:xt.backgroundCube_frag},cube:{uniforms:{tCube:{value:null},tFlip:{value:-1},opacity:{value:1}},vertexShader:xt.cube_vert,fragmentShader:xt.cube_frag},equirect:{uniforms:{tEquirect:{value:null}},vertexShader:xt.equirect_vert,fragmentShader:xt.equirect_frag},distanceRGBA:{uniforms:Tn([Te.common,Te.displacementmap,{referencePosition:{value:new A},nearDistance:{value:1},farDistance:{value:1e3}}]),vertexShader:xt.distanceRGBA_vert,fragmentShader:xt.distanceRGBA_frag},shadow:{uniforms:Tn([Te.lights,Te.fog,{color:{value:new it(0)},opacity:{value:1}}]),vertexShader:xt.shadow_vert,fragmentShader:xt.shadow_frag}};pi.physical={uniforms:Tn([pi.standard.uniforms,{clearcoat:{value:0},clearcoatMap:{value:null},clearcoatMapTransform:{value:new bt},clearcoatNormalMap:{value:null},clearcoatNormalMapTransform:{value:new bt},clearcoatNormalScale:{value:new at(1,1)},clearcoatRoughness:{value:0},clearcoatRoughnessMap:{value:null},clearcoatRoughnessMapTransform:{value:new bt},dispersion:{value:0},iridescence:{value:0},iridescenceMap:{value:null},iridescenceMapTransform:{value:new bt},iridescenceIOR:{value:1.3},iridescenceThicknessMinimum:{value:100},iridescenceThicknessMaximum:{value:400},iridescenceThicknessMap:{value:null},iridescenceThicknessMapTransform:{value:new bt},sheen:{value:0},sheenColor:{value:new it(0)},sheenColorMap:{value:null},sheenColorMapTransform:{value:new bt},sheenRoughness:{value:1},sheenRoughnessMap:{value:null},sheenRoughnessMapTransform:{value:new bt},transmission:{value:0},transmissionMap:{value:null},transmissionMapTransform:{value:new bt},transmissionSamplerSize:{value:new at},transmissionSamplerMap:{value:null},thickness:{value:0},thicknessMap:{value:null},thicknessMapTransform:{value:new bt},attenuationDistance:{value:0},attenuationColor:{value:new it(0)},specularColor:{value:new it(1,1,1)},specularColorMap:{value:null},specularColorMapTransform:{value:new bt},specularIntensity:{value:1},specularIntensityMap:{value:null},specularIntensityMapTransform:{value:new bt},anisotropyVector:{value:new at},anisotropyMap:{value:null},anisotropyMapTransform:{value:new bt}}]),vertexShader:xt.meshphysical_vert,fragmentShader:xt.meshphysical_frag};const Io={r:0,b:0,g:0},vr=new _i,k0=new rt;function B0(i,e,t,n,r,s,o){const a=new it(0);let c=s===!0?0:1,l,h,u=null,d=0,p=null;function g(y){let x=y.isScene===!0?y.background:null;return x&&x.isTexture&&(x=(y.backgroundBlurriness>0?t:e).get(x)),x}function b(y){let x=!1;const _=g(y);_===null?f(a,c):_&&_.isColor&&(f(_,1),x=!0);const I=i.xr.getEnvironmentBlendMode();I==="additive"?n.buffers.color.setClear(0,0,0,1,o):I==="alpha-blend"&&n.buffers.color.setClear(0,0,0,0,o),(i.autoClear||x)&&(n.buffers.depth.setTest(!0),n.buffers.depth.setMask(!0),n.buffers.color.setMask(!0),i.clear(i.autoClearColor,i.autoClearDepth,i.autoClearStencil))}function m(y,x){const _=g(x);_&&(_.isCubeTexture||_.mapping===wa)?(h===void 0&&(h=new jt(new Rs(1,1,1),new hr({name:"BackgroundCubeMaterial",uniforms:Ms(pi.backgroundCube.uniforms),vertexShader:pi.backgroundCube.vertexShader,fragmentShader:pi.backgroundCube.fragmentShader,side:Rn,depthTest:!1,depthWrite:!1,fog:!1})),h.geometry.deleteAttribute("normal"),h.geometry.deleteAttribute("uv"),h.onBeforeRender=function(I,L,C){this.matrixWorld.copyPosition(C.matrixWorld)},Object.defineProperty(h.material,"envMap",{get:function(){return this.uniforms.envMap.value}}),r.update(h)),vr.copy(x.backgroundRotation),vr.x*=-1,vr.y*=-1,vr.z*=-1,_.isCubeTexture&&_.isRenderTargetTexture===!1&&(vr.y*=-1,vr.z*=-1),h.material.uniforms.envMap.value=_,h.material.uniforms.flipEnvMap.value=_.isCubeTexture&&_.isRenderTargetTexture===!1?-1:1,h.material.uniforms.backgroundBlurriness.value=x.backgroundBlurriness,h.material.uniforms.backgroundIntensity.value=x.backgroundIntensity,h.material.uniforms.backgroundRotation.value.setFromMatrix4(k0.makeRotationFromEuler(vr)),h.material.toneMapped=Ct.getTransfer(_.colorSpace)!==qt,(u!==_||d!==_.version||p!==i.toneMapping)&&(h.material.needsUpdate=!0,u=_,d=_.version,p=i.toneMapping),h.layers.enableAll(),y.unshift(h,h.geometry,h.material,0,0,null)):_&&_.isTexture&&(l===void 0&&(l=new jt(new Cs(2,2),new hr({name:"BackgroundMaterial",uniforms:Ms(pi.background.uniforms),vertexShader:pi.background.vertexShader,fragmentShader:pi.background.fragmentShader,side:Gi,depthTest:!1,depthWrite:!1,fog:!1})),l.geometry.deleteAttribute("normal"),Object.defineProperty(l.material,"map",{get:function(){return this.uniforms.t2D.value}}),r.update(l)),l.material.uniforms.t2D.value=_,l.material.uniforms.backgroundIntensity.value=x.backgroundIntensity,l.material.toneMapped=Ct.getTransfer(_.colorSpace)!==qt,_.matrixAutoUpdate===!0&&_.updateMatrix(),l.material.uniforms.uvTransform.value.copy(_.matrix),(u!==_||d!==_.version||p!==i.toneMapping)&&(l.material.needsUpdate=!0,u=_,d=_.version,p=i.toneMapping),l.layers.enableAll(),y.unshift(l,l.geometry,l.material,0,0,null))}function f(y,x){y.getRGB(Io,Sd(i)),n.buffers.color.setClear(Io.r,Io.g,Io.b,x,o)}return{getClearColor:function(){return a},setClearColor:function(y,x=1){a.set(y),c=x,f(a,c)},getClearAlpha:function(){return c},setClearAlpha:function(y){c=y,f(a,c)},render:b,addToRenderList:m}}function z0(i,e){const t=i.getParameter(i.MAX_VERTEX_ATTRIBS),n={},r=d(null);let s=r,o=!1;function a(v,T,j,q,se){let ne=!1;const $=u(q,j,T);s!==$&&(s=$,l(s.object)),ne=p(v,q,j,se),ne&&g(v,q,j,se),se!==null&&e.update(se,i.ELEMENT_ARRAY_BUFFER),(ne||o)&&(o=!1,_(v,T,j,q),se!==null&&i.bindBuffer(i.ELEMENT_ARRAY_BUFFER,e.get(se).buffer))}function c(){return i.createVertexArray()}function l(v){return i.bindVertexArray(v)}function h(v){return i.deleteVertexArray(v)}function u(v,T,j){const q=j.wireframe===!0;let se=n[v.id];se===void 0&&(se={},n[v.id]=se);let ne=se[T.id];ne===void 0&&(ne={},se[T.id]=ne);let $=ne[q];return $===void 0&&($=d(c()),ne[q]=$),$}function d(v){const T=[],j=[],q=[];for(let se=0;se<t;se++)T[se]=0,j[se]=0,q[se]=0;return{geometry:null,program:null,wireframe:!1,newAttributes:T,enabledAttributes:j,attributeDivisors:q,object:v,attributes:{},index:null}}function p(v,T,j,q){const se=s.attributes,ne=T.attributes;let $=0;const ce=j.getAttributes();for(const P in ce)if(ce[P].location>=0){const W=se[P];let re=ne[P];if(re===void 0&&(P==="instanceMatrix"&&v.instanceMatrix&&(re=v.instanceMatrix),P==="instanceColor"&&v.instanceColor&&(re=v.instanceColor)),W===void 0||W.attribute!==re||re&&W.data!==re.data)return!0;$++}return s.attributesNum!==$||s.index!==q}function g(v,T,j,q){const se={},ne=T.attributes;let $=0;const ce=j.getAttributes();for(const P in ce)if(ce[P].location>=0){let W=ne[P];W===void 0&&(P==="instanceMatrix"&&v.instanceMatrix&&(W=v.instanceMatrix),P==="instanceColor"&&v.instanceColor&&(W=v.instanceColor));const re={};re.attribute=W,W&&W.data&&(re.data=W.data),se[P]=re,$++}s.attributes=se,s.attributesNum=$,s.index=q}function b(){const v=s.newAttributes;for(let T=0,j=v.length;T<j;T++)v[T]=0}function m(v){f(v,0)}function f(v,T){const j=s.newAttributes,q=s.enabledAttributes,se=s.attributeDivisors;j[v]=1,q[v]===0&&(i.enableVertexAttribArray(v),q[v]=1),se[v]!==T&&(i.vertexAttribDivisor(v,T),se[v]=T)}function y(){const v=s.newAttributes,T=s.enabledAttributes;for(let j=0,q=T.length;j<q;j++)T[j]!==v[j]&&(i.disableVertexAttribArray(j),T[j]=0)}function x(v,T,j,q,se,ne,$){$===!0?i.vertexAttribIPointer(v,T,j,se,ne):i.vertexAttribPointer(v,T,j,q,se,ne)}function _(v,T,j,q){b();const se=q.attributes,ne=j.getAttributes(),$=T.defaultAttributeValues;for(const ce in ne){const P=ne[ce];if(P.location>=0){let k=se[ce];if(k===void 0&&(ce==="instanceMatrix"&&v.instanceMatrix&&(k=v.instanceMatrix),ce==="instanceColor"&&v.instanceColor&&(k=v.instanceColor)),k!==void 0){const W=k.normalized,re=k.itemSize,he=e.get(k);if(he===void 0)continue;const ye=he.buffer,J=he.type,fe=he.bytesPerElement,Me=J===i.INT||J===i.UNSIGNED_INT||k.gpuType===Fl;if(k.isInterleavedBufferAttribute){const _e=k.data,Fe=_e.stride,$e=k.offset;if(_e.isInstancedInterleavedBuffer){for(let nt=0;nt<P.locationSize;nt++)f(P.location+nt,_e.meshPerAttribute);v.isInstancedMesh!==!0&&q._maxInstanceCount===void 0&&(q._maxInstanceCount=_e.meshPerAttribute*_e.count)}else for(let nt=0;nt<P.locationSize;nt++)m(P.location+nt);i.bindBuffer(i.ARRAY_BUFFER,ye);for(let nt=0;nt<P.locationSize;nt++)x(P.location+nt,re/P.locationSize,J,W,Fe*fe,($e+re/P.locationSize*nt)*fe,Me)}else{if(k.isInstancedBufferAttribute){for(let _e=0;_e<P.locationSize;_e++)f(P.location+_e,k.meshPerAttribute);v.isInstancedMesh!==!0&&q._maxInstanceCount===void 0&&(q._maxInstanceCount=k.meshPerAttribute*k.count)}else for(let _e=0;_e<P.locationSize;_e++)m(P.location+_e);i.bindBuffer(i.ARRAY_BUFFER,ye);for(let _e=0;_e<P.locationSize;_e++)x(P.location+_e,re/P.locationSize,J,W,re*fe,re/P.locationSize*_e*fe,Me)}}else if($!==void 0){const W=$[ce];if(W!==void 0)switch(W.length){case 2:i.vertexAttrib2fv(P.location,W);break;case 3:i.vertexAttrib3fv(P.location,W);break;case 4:i.vertexAttrib4fv(P.location,W);break;default:i.vertexAttrib1fv(P.location,W)}}}}y()}function I(){F();for(const v in n){const T=n[v];for(const j in T){const q=T[j];for(const se in q)h(q[se].object),delete q[se];delete T[j]}delete n[v]}}function L(v){if(n[v.id]===void 0)return;const T=n[v.id];for(const j in T){const q=T[j];for(const se in q)h(q[se].object),delete q[se];delete T[j]}delete n[v.id]}function C(v){for(const T in n){const j=n[T];if(j[v.id]===void 0)continue;const q=j[v.id];for(const se in q)h(q[se].object),delete q[se];delete j[v.id]}}function F(){w(),o=!0,s!==r&&(s=r,l(s.object))}function w(){r.geometry=null,r.program=null,r.wireframe=!1}return{setup:a,reset:F,resetDefaultState:w,dispose:I,releaseStatesOfGeometry:L,releaseStatesOfProgram:C,initAttributes:b,enableAttribute:m,disableUnusedAttributes:y}}function H0(i,e,t){let n;function r(l){n=l}function s(l,h){i.drawArrays(n,l,h),t.update(h,n,1)}function o(l,h,u){u!==0&&(i.drawArraysInstanced(n,l,h,u),t.update(h,n,u))}function a(l,h,u){if(u===0)return;e.get("WEBGL_multi_draw").multiDrawArraysWEBGL(n,l,0,h,0,u);let p=0;for(let g=0;g<u;g++)p+=h[g];t.update(p,n,1)}function c(l,h,u,d){if(u===0)return;const p=e.get("WEBGL_multi_draw");if(p===null)for(let g=0;g<l.length;g++)o(l[g],h[g],d[g]);else{p.multiDrawArraysInstancedWEBGL(n,l,0,h,0,d,0,u);let g=0;for(let b=0;b<u;b++)g+=h[b]*d[b];t.update(g,n,1)}}this.setMode=r,this.render=s,this.renderInstances=o,this.renderMultiDraw=a,this.renderMultiDrawInstances=c}function V0(i,e,t,n){let r;function s(){if(r!==void 0)return r;if(e.has("EXT_texture_filter_anisotropic")===!0){const C=e.get("EXT_texture_filter_anisotropic");r=i.getParameter(C.MAX_TEXTURE_MAX_ANISOTROPY_EXT)}else r=0;return r}function o(C){return!(C!==Zn&&n.convert(C)!==i.getParameter(i.IMPLEMENTATION_COLOR_READ_FORMAT))}function a(C){const F=C===co&&(e.has("EXT_color_buffer_half_float")||e.has("EXT_color_buffer_float"));return!(C!==Wi&&n.convert(C)!==i.getParameter(i.IMPLEMENTATION_COLOR_READ_TYPE)&&C!==ai&&!F)}function c(C){if(C==="highp"){if(i.getShaderPrecisionFormat(i.VERTEX_SHADER,i.HIGH_FLOAT).precision>0&&i.getShaderPrecisionFormat(i.FRAGMENT_SHADER,i.HIGH_FLOAT).precision>0)return"highp";C="mediump"}return C==="mediump"&&i.getShaderPrecisionFormat(i.VERTEX_SHADER,i.MEDIUM_FLOAT).precision>0&&i.getShaderPrecisionFormat(i.FRAGMENT_SHADER,i.MEDIUM_FLOAT).precision>0?"mediump":"lowp"}let l=t.precision!==void 0?t.precision:"highp";const h=c(l);h!==l&&(console.warn("THREE.WebGLRenderer:",l,"not supported, using",h,"instead."),l=h);const u=t.logarithmicDepthBuffer===!0,d=t.reverseDepthBuffer===!0&&e.has("EXT_clip_control"),p=i.getParameter(i.MAX_TEXTURE_IMAGE_UNITS),g=i.getParameter(i.MAX_VERTEX_TEXTURE_IMAGE_UNITS),b=i.getParameter(i.MAX_TEXTURE_SIZE),m=i.getParameter(i.MAX_CUBE_MAP_TEXTURE_SIZE),f=i.getParameter(i.MAX_VERTEX_ATTRIBS),y=i.getParameter(i.MAX_VERTEX_UNIFORM_VECTORS),x=i.getParameter(i.MAX_VARYING_VECTORS),_=i.getParameter(i.MAX_FRAGMENT_UNIFORM_VECTORS),I=g>0,L=i.getParameter(i.MAX_SAMPLES);return{isWebGL2:!0,getMaxAnisotropy:s,getMaxPrecision:c,textureFormatReadable:o,textureTypeReadable:a,precision:l,logarithmicDepthBuffer:u,reverseDepthBuffer:d,maxTextures:p,maxVertexTextures:g,maxTextureSize:b,maxCubemapSize:m,maxAttributes:f,maxVertexUniforms:y,maxVaryings:x,maxFragmentUniforms:_,vertexTextures:I,maxSamples:L}}function G0(i){const e=this;let t=null,n=0,r=!1,s=!1;const o=new nr,a=new bt,c={value:null,needsUpdate:!1};this.uniform=c,this.numPlanes=0,this.numIntersection=0,this.init=function(u,d){const p=u.length!==0||d||n!==0||r;return r=d,n=u.length,p},this.beginShadows=function(){s=!0,h(null)},this.endShadows=function(){s=!1},this.setGlobalState=function(u,d){t=h(u,d,0)},this.setState=function(u,d,p){const g=u.clippingPlanes,b=u.clipIntersection,m=u.clipShadows,f=i.get(u);if(!r||g===null||g.length===0||s&&!m)s?h(null):l();else{const y=s?0:n,x=y*4;let _=f.clippingState||null;c.value=_,_=h(g,d,x,p);for(let I=0;I!==x;++I)_[I]=t[I];f.clippingState=_,this.numIntersection=b?this.numPlanes:0,this.numPlanes+=y}};function l(){c.value!==t&&(c.value=t,c.needsUpdate=n>0),e.numPlanes=n,e.numIntersection=0}function h(u,d,p,g){const b=u!==null?u.length:0;let m=null;if(b!==0){if(m=c.value,g!==!0||m===null){const f=p+b*4,y=d.matrixWorldInverse;a.getNormalMatrix(y),(m===null||m.length<f)&&(m=new Float32Array(f));for(let x=0,_=p;x!==b;++x,_+=4)o.copy(u[x]).applyMatrix4(y,a),o.normal.toArray(m,_),m[_+3]=o.constant}c.value=m,c.needsUpdate=!0}return e.numPlanes=b,e.numIntersection=0,m}}function W0(i){let e=new WeakMap;function t(o,a){return a===Vc?o.mapping=gs:a===Gc&&(o.mapping=bs),o}function n(o){if(o&&o.isTexture){const a=o.mapping;if(a===Vc||a===Gc)if(e.has(o)){const c=e.get(o).texture;return t(c,o.mapping)}else{const c=o.image;if(c&&c.height>0){const l=new tm(c.height);return l.fromEquirectangularTexture(i,o),e.set(o,l),o.addEventListener("dispose",r),t(l.texture,o.mapping)}else return null}}return o}function r(o){const a=o.target;a.removeEventListener("dispose",r);const c=e.get(a);c!==void 0&&(e.delete(a),c.dispose())}function s(){e=new WeakMap}return{get:n,dispose:s}}class jl extends wd{constructor(e=-1,t=1,n=1,r=-1,s=.1,o=2e3){super(),this.isOrthographicCamera=!0,this.type="OrthographicCamera",this.zoom=1,this.view=null,this.left=e,this.right=t,this.top=n,this.bottom=r,this.near=s,this.far=o,this.updateProjectionMatrix()}copy(e,t){return super.copy(e,t),this.left=e.left,this.right=e.right,this.top=e.top,this.bottom=e.bottom,this.near=e.near,this.far=e.far,this.zoom=e.zoom,this.view=e.view===null?null:Object.assign({},e.view),this}setViewOffset(e,t,n,r,s,o){this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=e,this.view.fullHeight=t,this.view.offsetX=n,this.view.offsetY=r,this.view.width=s,this.view.height=o,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const e=(this.right-this.left)/(2*this.zoom),t=(this.top-this.bottom)/(2*this.zoom),n=(this.right+this.left)/2,r=(this.top+this.bottom)/2;let s=n-e,o=n+e,a=r+t,c=r-t;if(this.view!==null&&this.view.enabled){const l=(this.right-this.left)/this.view.fullWidth/this.zoom,h=(this.top-this.bottom)/this.view.fullHeight/this.zoom;s+=l*this.view.offsetX,o=s+l*this.view.width,a-=h*this.view.offsetY,c=a-h*this.view.height}this.projectionMatrix.makeOrthographic(s,o,a,c,this.near,this.far,this.coordinateSystem),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(e){const t=super.toJSON(e);return t.object.zoom=this.zoom,t.object.left=this.left,t.object.right=this.right,t.object.top=this.top,t.object.bottom=this.bottom,t.object.near=this.near,t.object.far=this.far,this.view!==null&&(t.object.view=Object.assign({},this.view)),t}}const is=4,kh=[.125,.215,.35,.446,.526,.582],Tr=20,sc=new jl,Bh=new it;let oc=null,ac=0,cc=0,lc=!1;const wr=(1+Math.sqrt(5))/2,Yr=1/wr,zh=[new A(-wr,Yr,0),new A(wr,Yr,0),new A(-Yr,0,wr),new A(Yr,0,wr),new A(0,wr,-Yr),new A(0,wr,Yr),new A(-1,1,-1),new A(1,1,-1),new A(-1,1,1),new A(1,1,1)];class _l{constructor(e){this._renderer=e,this._pingPongRenderTarget=null,this._lodMax=0,this._cubeSize=0,this._lodPlanes=[],this._sizeLods=[],this._sigmas=[],this._blurMaterial=null,this._cubemapMaterial=null,this._equirectMaterial=null,this._compileMaterial(this._blurMaterial)}fromScene(e,t=0,n=.1,r=100){oc=this._renderer.getRenderTarget(),ac=this._renderer.getActiveCubeFace(),cc=this._renderer.getActiveMipmapLevel(),lc=this._renderer.xr.enabled,this._renderer.xr.enabled=!1,this._setSize(256);const s=this._allocateTargets();return s.depthBuffer=!0,this._sceneToCubeUV(e,n,r,s),t>0&&this._blur(s,0,0,t),this._applyPMREM(s),this._cleanup(s),s}fromEquirectangular(e,t=null){return this._fromTexture(e,t)}fromCubemap(e,t=null){return this._fromTexture(e,t)}compileCubemapShader(){this._cubemapMaterial===null&&(this._cubemapMaterial=Gh(),this._compileMaterial(this._cubemapMaterial))}compileEquirectangularShader(){this._equirectMaterial===null&&(this._equirectMaterial=Vh(),this._compileMaterial(this._equirectMaterial))}dispose(){this._dispose(),this._cubemapMaterial!==null&&this._cubemapMaterial.dispose(),this._equirectMaterial!==null&&this._equirectMaterial.dispose()}_setSize(e){this._lodMax=Math.floor(Math.log2(e)),this._cubeSize=Math.pow(2,this._lodMax)}_dispose(){this._blurMaterial!==null&&this._blurMaterial.dispose(),this._pingPongRenderTarget!==null&&this._pingPongRenderTarget.dispose();for(let e=0;e<this._lodPlanes.length;e++)this._lodPlanes[e].dispose()}_cleanup(e){this._renderer.setRenderTarget(oc,ac,cc),this._renderer.xr.enabled=lc,e.scissorTest=!1,No(e,0,0,e.width,e.height)}_fromTexture(e,t){e.mapping===gs||e.mapping===bs?this._setSize(e.image.length===0?16:e.image[0].width||e.image[0].image.width):this._setSize(e.image.width/4),oc=this._renderer.getRenderTarget(),ac=this._renderer.getActiveCubeFace(),cc=this._renderer.getActiveMipmapLevel(),lc=this._renderer.xr.enabled,this._renderer.xr.enabled=!1;const n=t||this._allocateTargets();return this._textureToCubeUV(e,n),this._applyPMREM(n),this._cleanup(n),n}_allocateTargets(){const e=3*Math.max(this._cubeSize,112),t=4*this._cubeSize,n={magFilter:qn,minFilter:qn,generateMipmaps:!1,type:co,format:Zn,colorSpace:Pn,depthBuffer:!1},r=Hh(e,t,n);if(this._pingPongRenderTarget===null||this._pingPongRenderTarget.width!==e||this._pingPongRenderTarget.height!==t){this._pingPongRenderTarget!==null&&this._dispose(),this._pingPongRenderTarget=Hh(e,t,n);const{_lodMax:s}=this;({sizeLods:this._sizeLods,lodPlanes:this._lodPlanes,sigmas:this._sigmas}=q0(s)),this._blurMaterial=j0(s,e,t)}return r}_compileMaterial(e){const t=new jt(this._lodPlanes[0],e);this._renderer.compile(t,sc)}_sceneToCubeUV(e,t,n,r){const a=new vn(90,1,t,n),c=[1,-1,1,1,1,1],l=[1,1,1,-1,-1,-1],h=this._renderer,u=h.autoClear,d=h.toneMapping;h.getClearColor(Bh),h.toneMapping=cr,h.autoClear=!1;const p=new Oi({name:"PMREM.Background",side:Rn,depthWrite:!1,depthTest:!1}),g=new jt(new Rs,p);let b=!1;const m=e.background;m?m.isColor&&(p.color.copy(m),e.background=null,b=!0):(p.color.copy(Bh),b=!0);for(let f=0;f<6;f++){const y=f%3;y===0?(a.up.set(0,c[f],0),a.lookAt(l[f],0,0)):y===1?(a.up.set(0,0,c[f]),a.lookAt(0,l[f],0)):(a.up.set(0,c[f],0),a.lookAt(0,0,l[f]));const x=this._cubeSize;No(r,y*x,f>2?x:0,x,x),h.setRenderTarget(r),b&&h.render(g,a),h.render(e,a)}g.geometry.dispose(),g.material.dispose(),h.toneMapping=d,h.autoClear=u,e.background=m}_textureToCubeUV(e,t){const n=this._renderer,r=e.mapping===gs||e.mapping===bs;r?(this._cubemapMaterial===null&&(this._cubemapMaterial=Gh()),this._cubemapMaterial.uniforms.flipEnvMap.value=e.isRenderTargetTexture===!1?-1:1):this._equirectMaterial===null&&(this._equirectMaterial=Vh());const s=r?this._cubemapMaterial:this._equirectMaterial,o=new jt(this._lodPlanes[0],s),a=s.uniforms;a.envMap.value=e;const c=this._cubeSize;No(t,0,0,3*c,2*c),n.setRenderTarget(t),n.render(o,sc)}_applyPMREM(e){const t=this._renderer,n=t.autoClear;t.autoClear=!1;const r=this._lodPlanes.length;for(let s=1;s<r;s++){const o=Math.sqrt(this._sigmas[s]*this._sigmas[s]-this._sigmas[s-1]*this._sigmas[s-1]),a=zh[(r-s-1)%zh.length];this._blur(e,s-1,s,o,a)}t.autoClear=n}_blur(e,t,n,r,s){const o=this._pingPongRenderTarget;this._halfBlur(e,o,t,n,r,"latitudinal",s),this._halfBlur(o,e,n,n,r,"longitudinal",s)}_halfBlur(e,t,n,r,s,o,a){const c=this._renderer,l=this._blurMaterial;o!=="latitudinal"&&o!=="longitudinal"&&console.error("blur direction must be either latitudinal or longitudinal!");const h=3,u=new jt(this._lodPlanes[r],l),d=l.uniforms,p=this._sizeLods[n]-1,g=isFinite(s)?Math.PI/(2*p):2*Math.PI/(2*Tr-1),b=s/g,m=isFinite(s)?1+Math.floor(h*b):Tr;m>Tr&&console.warn(`sigmaRadians, ${s}, is too large and will clip, as it requested ${m} samples when the maximum is set to ${Tr}`);const f=[];let y=0;for(let C=0;C<Tr;++C){const F=C/b,w=Math.exp(-F*F/2);f.push(w),C===0?y+=w:C<m&&(y+=2*w)}for(let C=0;C<f.length;C++)f[C]=f[C]/y;d.envMap.value=e.texture,d.samples.value=m,d.weights.value=f,d.latitudinal.value=o==="latitudinal",a&&(d.poleAxis.value=a);const{_lodMax:x}=this;d.dTheta.value=g,d.mipInt.value=x-n;const _=this._sizeLods[r],I=3*_*(r>x-is?r-x+is:0),L=4*(this._cubeSize-_);No(t,I,L,3*_,2*_),c.setRenderTarget(t),c.render(u,sc)}}function q0(i){const e=[],t=[],n=[];let r=i;const s=i-is+1+kh.length;for(let o=0;o<s;o++){const a=Math.pow(2,r);t.push(a);let c=1/a;o>i-is?c=kh[o-i+is-1]:o===0&&(c=0),n.push(c);const l=1/(a-2),h=-l,u=1+l,d=[h,h,u,h,u,u,h,h,u,u,h,u],p=6,g=6,b=3,m=2,f=1,y=new Float32Array(b*g*p),x=new Float32Array(m*g*p),_=new Float32Array(f*g*p);for(let L=0;L<p;L++){const C=L%3*2/3-1,F=L>2?0:-1,w=[C,F,0,C+2/3,F,0,C+2/3,F+1,0,C,F,0,C+2/3,F+1,0,C,F+1,0];y.set(w,b*g*L),x.set(d,m*g*L);const v=[L,L,L,L,L,L];_.set(v,f*g*L)}const I=new vi;I.setAttribute("position",new wn(y,b)),I.setAttribute("uv",new wn(x,m)),I.setAttribute("faceIndex",new wn(_,f)),e.push(I),r>is&&r--}return{lodPlanes:e,sizeLods:t,sigmas:n}}function Hh(i,e,t){const n=new Dr(i,e,t);return n.texture.mapping=wa,n.texture.name="PMREM.cubeUv",n.scissorTest=!0,n}function No(i,e,t,n,r){i.viewport.set(e,t,n,r),i.scissor.set(e,t,n,r)}function j0(i,e,t){const n=new Float32Array(Tr),r=new A(0,1,0);return new hr({name:"SphericalGaussianBlur",defines:{n:Tr,CUBEUV_TEXEL_WIDTH:1/e,CUBEUV_TEXEL_HEIGHT:1/t,CUBEUV_MAX_MIP:`${i}.0`},uniforms:{envMap:{value:null},samples:{value:1},weights:{value:n},latitudinal:{value:!1},dTheta:{value:0},mipInt:{value:0},poleAxis:{value:r}},vertexShader:Xl(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;
			uniform int samples;
			uniform float weights[ n ];
			uniform bool latitudinal;
			uniform float dTheta;
			uniform float mipInt;
			uniform vec3 poleAxis;

			#define ENVMAP_TYPE_CUBE_UV
			#include <cube_uv_reflection_fragment>

			vec3 getSample( float theta, vec3 axis ) {

				float cosTheta = cos( theta );
				// Rodrigues' axis-angle rotation
				vec3 sampleDirection = vOutputDirection * cosTheta
					+ cross( axis, vOutputDirection ) * sin( theta )
					+ axis * dot( axis, vOutputDirection ) * ( 1.0 - cosTheta );

				return bilinearCubeUV( envMap, sampleDirection, mipInt );

			}

			void main() {

				vec3 axis = latitudinal ? poleAxis : cross( poleAxis, vOutputDirection );

				if ( all( equal( axis, vec3( 0.0 ) ) ) ) {

					axis = vec3( vOutputDirection.z, 0.0, - vOutputDirection.x );

				}

				axis = normalize( axis );

				gl_FragColor = vec4( 0.0, 0.0, 0.0, 1.0 );
				gl_FragColor.rgb += weights[ 0 ] * getSample( 0.0, axis );

				for ( int i = 1; i < n; i++ ) {

					if ( i >= samples ) {

						break;

					}

					float theta = dTheta * float( i );
					gl_FragColor.rgb += weights[ i ] * getSample( -1.0 * theta, axis );
					gl_FragColor.rgb += weights[ i ] * getSample( theta, axis );

				}

			}
		`,blending:ar,depthTest:!1,depthWrite:!1})}function Vh(){return new hr({name:"EquirectangularToCubeUV",uniforms:{envMap:{value:null}},vertexShader:Xl(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;

			#include <common>

			void main() {

				vec3 outputDirection = normalize( vOutputDirection );
				vec2 uv = equirectUv( outputDirection );

				gl_FragColor = vec4( texture2D ( envMap, uv ).rgb, 1.0 );

			}
		`,blending:ar,depthTest:!1,depthWrite:!1})}function Gh(){return new hr({name:"CubemapToCubeUV",uniforms:{envMap:{value:null},flipEnvMap:{value:-1}},vertexShader:Xl(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			uniform float flipEnvMap;

			varying vec3 vOutputDirection;

			uniform samplerCube envMap;

			void main() {

				gl_FragColor = textureCube( envMap, vec3( flipEnvMap * vOutputDirection.x, vOutputDirection.yz ) );

			}
		`,blending:ar,depthTest:!1,depthWrite:!1})}function Xl(){return`

		precision mediump float;
		precision mediump int;

		attribute float faceIndex;

		varying vec3 vOutputDirection;

		// RH coordinate system; PMREM face-indexing convention
		vec3 getDirection( vec2 uv, float face ) {

			uv = 2.0 * uv - 1.0;

			vec3 direction = vec3( uv, 1.0 );

			if ( face == 0.0 ) {

				direction = direction.zyx; // ( 1, v, u ) pos x

			} else if ( face == 1.0 ) {

				direction = direction.xzy;
				direction.xz *= -1.0; // ( -u, 1, -v ) pos y

			} else if ( face == 2.0 ) {

				direction.x *= -1.0; // ( -u, v, 1 ) pos z

			} else if ( face == 3.0 ) {

				direction = direction.zyx;
				direction.xz *= -1.0; // ( -1, v, -u ) neg x

			} else if ( face == 4.0 ) {

				direction = direction.xzy;
				direction.xy *= -1.0; // ( -u, -1, v ) neg y

			} else if ( face == 5.0 ) {

				direction.z *= -1.0; // ( u, v, -1 ) neg z

			}

			return direction;

		}

		void main() {

			vOutputDirection = getDirection( uv, faceIndex );
			gl_Position = vec4( position, 1.0 );

		}
	`}function X0(i){let e=new WeakMap,t=null;function n(a){if(a&&a.isTexture){const c=a.mapping,l=c===Vc||c===Gc,h=c===gs||c===bs;if(l||h){let u=e.get(a);const d=u!==void 0?u.texture.pmremVersion:0;if(a.isRenderTargetTexture&&a.pmremVersion!==d)return t===null&&(t=new _l(i)),u=l?t.fromEquirectangular(a,u):t.fromCubemap(a,u),u.texture.pmremVersion=a.pmremVersion,e.set(a,u),u.texture;if(u!==void 0)return u.texture;{const p=a.image;return l&&p&&p.height>0||h&&p&&r(p)?(t===null&&(t=new _l(i)),u=l?t.fromEquirectangular(a):t.fromCubemap(a),u.texture.pmremVersion=a.pmremVersion,e.set(a,u),a.addEventListener("dispose",s),u.texture):null}}}return a}function r(a){let c=0;const l=6;for(let h=0;h<l;h++)a[h]!==void 0&&c++;return c===l}function s(a){const c=a.target;c.removeEventListener("dispose",s);const l=e.get(c);l!==void 0&&(e.delete(c),l.dispose())}function o(){e=new WeakMap,t!==null&&(t.dispose(),t=null)}return{get:n,dispose:o}}function Q0(i){const e={};function t(n){if(e[n]!==void 0)return e[n];let r;switch(n){case"WEBGL_depth_texture":r=i.getExtension("WEBGL_depth_texture")||i.getExtension("MOZ_WEBGL_depth_texture")||i.getExtension("WEBKIT_WEBGL_depth_texture");break;case"EXT_texture_filter_anisotropic":r=i.getExtension("EXT_texture_filter_anisotropic")||i.getExtension("MOZ_EXT_texture_filter_anisotropic")||i.getExtension("WEBKIT_EXT_texture_filter_anisotropic");break;case"WEBGL_compressed_texture_s3tc":r=i.getExtension("WEBGL_compressed_texture_s3tc")||i.getExtension("MOZ_WEBGL_compressed_texture_s3tc")||i.getExtension("WEBKIT_WEBGL_compressed_texture_s3tc");break;case"WEBGL_compressed_texture_pvrtc":r=i.getExtension("WEBGL_compressed_texture_pvrtc")||i.getExtension("WEBKIT_WEBGL_compressed_texture_pvrtc");break;default:r=i.getExtension(n)}return e[n]=r,r}return{has:function(n){return t(n)!==null},init:function(){t("EXT_color_buffer_float"),t("WEBGL_clip_cull_distance"),t("OES_texture_float_linear"),t("EXT_color_buffer_half_float"),t("WEBGL_multisampled_render_to_texture"),t("WEBGL_render_shared_exponent")},get:function(n){const r=t(n);return r===null&&Ks("THREE.WebGLRenderer: "+n+" extension not supported."),r}}}function K0(i,e,t,n){const r={},s=new WeakMap;function o(u){const d=u.target;d.index!==null&&e.remove(d.index);for(const g in d.attributes)e.remove(d.attributes[g]);for(const g in d.morphAttributes){const b=d.morphAttributes[g];for(let m=0,f=b.length;m<f;m++)e.remove(b[m])}d.removeEventListener("dispose",o),delete r[d.id];const p=s.get(d);p&&(e.remove(p),s.delete(d)),n.releaseStatesOfGeometry(d),d.isInstancedBufferGeometry===!0&&delete d._maxInstanceCount,t.memory.geometries--}function a(u,d){return r[d.id]===!0||(d.addEventListener("dispose",o),r[d.id]=!0,t.memory.geometries++),d}function c(u){const d=u.attributes;for(const g in d)e.update(d[g],i.ARRAY_BUFFER);const p=u.morphAttributes;for(const g in p){const b=p[g];for(let m=0,f=b.length;m<f;m++)e.update(b[m],i.ARRAY_BUFFER)}}function l(u){const d=[],p=u.index,g=u.attributes.position;let b=0;if(p!==null){const y=p.array;b=p.version;for(let x=0,_=y.length;x<_;x+=3){const I=y[x+0],L=y[x+1],C=y[x+2];d.push(I,L,L,C,C,I)}}else if(g!==void 0){const y=g.array;b=g.version;for(let x=0,_=y.length/3-1;x<_;x+=3){const I=x+0,L=x+1,C=x+2;d.push(I,L,L,C,C,I)}}else return;const m=new(bd(d)?Md:yd)(d,1);m.version=b;const f=s.get(u);f&&e.remove(f),s.set(u,m)}function h(u){const d=s.get(u);if(d){const p=u.index;p!==null&&d.version<p.version&&l(u)}else l(u);return s.get(u)}return{get:a,update:c,getWireframeAttribute:h}}function Y0(i,e,t){let n;function r(d){n=d}let s,o;function a(d){s=d.type,o=d.bytesPerElement}function c(d,p){i.drawElements(n,p,s,d*o),t.update(p,n,1)}function l(d,p,g){g!==0&&(i.drawElementsInstanced(n,p,s,d*o,g),t.update(p,n,g))}function h(d,p,g){if(g===0)return;e.get("WEBGL_multi_draw").multiDrawElementsWEBGL(n,p,0,s,d,0,g);let m=0;for(let f=0;f<g;f++)m+=p[f];t.update(m,n,1)}function u(d,p,g,b){if(g===0)return;const m=e.get("WEBGL_multi_draw");if(m===null)for(let f=0;f<d.length;f++)l(d[f]/o,p[f],b[f]);else{m.multiDrawElementsInstancedWEBGL(n,p,0,s,d,0,b,0,g);let f=0;for(let y=0;y<g;y++)f+=p[y]*b[y];t.update(f,n,1)}}this.setMode=r,this.setIndex=a,this.render=c,this.renderInstances=l,this.renderMultiDraw=h,this.renderMultiDrawInstances=u}function $0(i){const e={geometries:0,textures:0},t={frame:0,calls:0,triangles:0,points:0,lines:0};function n(s,o,a){switch(t.calls++,o){case i.TRIANGLES:t.triangles+=a*(s/3);break;case i.LINES:t.lines+=a*(s/2);break;case i.LINE_STRIP:t.lines+=a*(s-1);break;case i.LINE_LOOP:t.lines+=a*s;break;case i.POINTS:t.points+=a*s;break;default:console.error("THREE.WebGLInfo: Unknown draw mode:",o);break}}function r(){t.calls=0,t.triangles=0,t.points=0,t.lines=0}return{memory:e,render:t,programs:null,autoReset:!0,reset:r,update:n}}function Z0(i,e,t){const n=new WeakMap,r=new vt;function s(o,a,c){const l=o.morphTargetInfluences,h=a.morphAttributes.position||a.morphAttributes.normal||a.morphAttributes.color,u=h!==void 0?h.length:0;let d=n.get(a);if(d===void 0||d.count!==u){let v=function(){F.dispose(),n.delete(a),a.removeEventListener("dispose",v)};var p=v;d!==void 0&&d.texture.dispose();const g=a.morphAttributes.position!==void 0,b=a.morphAttributes.normal!==void 0,m=a.morphAttributes.color!==void 0,f=a.morphAttributes.position||[],y=a.morphAttributes.normal||[],x=a.morphAttributes.color||[];let _=0;g===!0&&(_=1),b===!0&&(_=2),m===!0&&(_=3);let I=a.attributes.position.count*_,L=1;I>e.maxTextureSize&&(L=Math.ceil(I/e.maxTextureSize),I=e.maxTextureSize);const C=new Float32Array(I*L*4*u),F=new xd(C,I,L,u);F.type=ai,F.needsUpdate=!0;const w=_*4;for(let T=0;T<u;T++){const j=f[T],q=y[T],se=x[T],ne=I*L*4*T;for(let $=0;$<j.count;$++){const ce=$*w;g===!0&&(r.fromBufferAttribute(j,$),C[ne+ce+0]=r.x,C[ne+ce+1]=r.y,C[ne+ce+2]=r.z,C[ne+ce+3]=0),b===!0&&(r.fromBufferAttribute(q,$),C[ne+ce+4]=r.x,C[ne+ce+5]=r.y,C[ne+ce+6]=r.z,C[ne+ce+7]=0),m===!0&&(r.fromBufferAttribute(se,$),C[ne+ce+8]=r.x,C[ne+ce+9]=r.y,C[ne+ce+10]=r.z,C[ne+ce+11]=se.itemSize===4?r.w:1)}}d={count:u,texture:F,size:new at(I,L)},n.set(a,d),a.addEventListener("dispose",v)}if(o.isInstancedMesh===!0&&o.morphTexture!==null)c.getUniforms().setValue(i,"morphTexture",o.morphTexture,t);else{let g=0;for(let m=0;m<l.length;m++)g+=l[m];const b=a.morphTargetsRelative?1:1-g;c.getUniforms().setValue(i,"morphTargetBaseInfluence",b),c.getUniforms().setValue(i,"morphTargetInfluences",l)}c.getUniforms().setValue(i,"morphTargetsTexture",d.texture,t),c.getUniforms().setValue(i,"morphTargetsTextureSize",d.size)}return{update:s}}function J0(i,e,t,n){let r=new WeakMap;function s(c){const l=n.render.frame,h=c.geometry,u=e.get(c,h);if(r.get(u)!==l&&(e.update(u),r.set(u,l)),c.isInstancedMesh&&(c.hasEventListener("dispose",a)===!1&&c.addEventListener("dispose",a),r.get(c)!==l&&(t.update(c.instanceMatrix,i.ARRAY_BUFFER),c.instanceColor!==null&&t.update(c.instanceColor,i.ARRAY_BUFFER),r.set(c,l))),c.isSkinnedMesh){const d=c.skeleton;r.get(d)!==l&&(d.update(),r.set(d,l))}return u}function o(){r=new WeakMap}function a(c){const l=c.target;l.removeEventListener("dispose",a),t.remove(l.instanceMatrix),l.instanceColor!==null&&t.remove(l.instanceColor)}return{update:s,dispose:o}}class Td extends hn{constructor(e,t,n,r,s,o,a,c,l,h=as){if(h!==as&&h!==vs)throw new Error("DepthTexture format must be either THREE.DepthFormat or THREE.DepthStencilFormat");n===void 0&&h===as&&(n=Lr),n===void 0&&h===vs&&(n=xs),super(null,r,s,o,a,c,h,n,l),this.isDepthTexture=!0,this.image={width:e,height:t},this.magFilter=a!==void 0?a:Cn,this.minFilter=c!==void 0?c:Cn,this.flipY=!1,this.generateMipmaps=!1,this.compareFunction=null}copy(e){return super.copy(e),this.compareFunction=e.compareFunction,this}toJSON(e){const t=super.toJSON(e);return this.compareFunction!==null&&(t.compareFunction=this.compareFunction),t}}const Rd=new hn,Wh=new Td(1,1),Cd=new xd,Pd=new Bp,Ld=new Ed,qh=[],jh=[],Xh=new Float32Array(16),Qh=new Float32Array(9),Kh=new Float32Array(4);function Ps(i,e,t){const n=i[0];if(n<=0||n>0)return i;const r=e*t;let s=qh[r];if(s===void 0&&(s=new Float32Array(r),qh[r]=s),e!==0){n.toArray(s,0);for(let o=1,a=0;o!==e;++o)a+=t,i[o].toArray(s,a)}return s}function un(i,e){if(i.length!==e.length)return!1;for(let t=0,n=i.length;t<n;t++)if(i[t]!==e[t])return!1;return!0}function dn(i,e){for(let t=0,n=e.length;t<n;t++)i[t]=e[t]}function Aa(i,e){let t=jh[e];t===void 0&&(t=new Int32Array(e),jh[e]=t);for(let n=0;n!==e;++n)t[n]=i.allocateTextureUnit();return t}function eb(i,e){const t=this.cache;t[0]!==e&&(i.uniform1f(this.addr,e),t[0]=e)}function tb(i,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(i.uniform2f(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(un(t,e))return;i.uniform2fv(this.addr,e),dn(t,e)}}function nb(i,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(i.uniform3f(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else if(e.r!==void 0)(t[0]!==e.r||t[1]!==e.g||t[2]!==e.b)&&(i.uniform3f(this.addr,e.r,e.g,e.b),t[0]=e.r,t[1]=e.g,t[2]=e.b);else{if(un(t,e))return;i.uniform3fv(this.addr,e),dn(t,e)}}function ib(i,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(i.uniform4f(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(un(t,e))return;i.uniform4fv(this.addr,e),dn(t,e)}}function rb(i,e){const t=this.cache,n=e.elements;if(n===void 0){if(un(t,e))return;i.uniformMatrix2fv(this.addr,!1,e),dn(t,e)}else{if(un(t,n))return;Kh.set(n),i.uniformMatrix2fv(this.addr,!1,Kh),dn(t,n)}}function sb(i,e){const t=this.cache,n=e.elements;if(n===void 0){if(un(t,e))return;i.uniformMatrix3fv(this.addr,!1,e),dn(t,e)}else{if(un(t,n))return;Qh.set(n),i.uniformMatrix3fv(this.addr,!1,Qh),dn(t,n)}}function ob(i,e){const t=this.cache,n=e.elements;if(n===void 0){if(un(t,e))return;i.uniformMatrix4fv(this.addr,!1,e),dn(t,e)}else{if(un(t,n))return;Xh.set(n),i.uniformMatrix4fv(this.addr,!1,Xh),dn(t,n)}}function ab(i,e){const t=this.cache;t[0]!==e&&(i.uniform1i(this.addr,e),t[0]=e)}function cb(i,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(i.uniform2i(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(un(t,e))return;i.uniform2iv(this.addr,e),dn(t,e)}}function lb(i,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(i.uniform3i(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else{if(un(t,e))return;i.uniform3iv(this.addr,e),dn(t,e)}}function hb(i,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(i.uniform4i(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(un(t,e))return;i.uniform4iv(this.addr,e),dn(t,e)}}function ub(i,e){const t=this.cache;t[0]!==e&&(i.uniform1ui(this.addr,e),t[0]=e)}function db(i,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(i.uniform2ui(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(un(t,e))return;i.uniform2uiv(this.addr,e),dn(t,e)}}function fb(i,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(i.uniform3ui(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else{if(un(t,e))return;i.uniform3uiv(this.addr,e),dn(t,e)}}function pb(i,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(i.uniform4ui(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(un(t,e))return;i.uniform4uiv(this.addr,e),dn(t,e)}}function mb(i,e,t){const n=this.cache,r=t.allocateTextureUnit();n[0]!==r&&(i.uniform1i(this.addr,r),n[0]=r);let s;this.type===i.SAMPLER_2D_SHADOW?(Wh.compareFunction=gd,s=Wh):s=Rd,t.setTexture2D(e||s,r)}function gb(i,e,t){const n=this.cache,r=t.allocateTextureUnit();n[0]!==r&&(i.uniform1i(this.addr,r),n[0]=r),t.setTexture3D(e||Pd,r)}function bb(i,e,t){const n=this.cache,r=t.allocateTextureUnit();n[0]!==r&&(i.uniform1i(this.addr,r),n[0]=r),t.setTextureCube(e||Ld,r)}function _b(i,e,t){const n=this.cache,r=t.allocateTextureUnit();n[0]!==r&&(i.uniform1i(this.addr,r),n[0]=r),t.setTexture2DArray(e||Cd,r)}function xb(i){switch(i){case 5126:return eb;case 35664:return tb;case 35665:return nb;case 35666:return ib;case 35674:return rb;case 35675:return sb;case 35676:return ob;case 5124:case 35670:return ab;case 35667:case 35671:return cb;case 35668:case 35672:return lb;case 35669:case 35673:return hb;case 5125:return ub;case 36294:return db;case 36295:return fb;case 36296:return pb;case 35678:case 36198:case 36298:case 36306:case 35682:return mb;case 35679:case 36299:case 36307:return gb;case 35680:case 36300:case 36308:case 36293:return bb;case 36289:case 36303:case 36311:case 36292:return _b}}function vb(i,e){i.uniform1fv(this.addr,e)}function yb(i,e){const t=Ps(e,this.size,2);i.uniform2fv(this.addr,t)}function Mb(i,e){const t=Ps(e,this.size,3);i.uniform3fv(this.addr,t)}function Sb(i,e){const t=Ps(e,this.size,4);i.uniform4fv(this.addr,t)}function wb(i,e){const t=Ps(e,this.size,4);i.uniformMatrix2fv(this.addr,!1,t)}function Eb(i,e){const t=Ps(e,this.size,9);i.uniformMatrix3fv(this.addr,!1,t)}function Ab(i,e){const t=Ps(e,this.size,16);i.uniformMatrix4fv(this.addr,!1,t)}function Tb(i,e){i.uniform1iv(this.addr,e)}function Rb(i,e){i.uniform2iv(this.addr,e)}function Cb(i,e){i.uniform3iv(this.addr,e)}function Pb(i,e){i.uniform4iv(this.addr,e)}function Lb(i,e){i.uniform1uiv(this.addr,e)}function Db(i,e){i.uniform2uiv(this.addr,e)}function Ib(i,e){i.uniform3uiv(this.addr,e)}function Nb(i,e){i.uniform4uiv(this.addr,e)}function Ub(i,e,t){const n=this.cache,r=e.length,s=Aa(t,r);un(n,s)||(i.uniform1iv(this.addr,s),dn(n,s));for(let o=0;o!==r;++o)t.setTexture2D(e[o]||Rd,s[o])}function Fb(i,e,t){const n=this.cache,r=e.length,s=Aa(t,r);un(n,s)||(i.uniform1iv(this.addr,s),dn(n,s));for(let o=0;o!==r;++o)t.setTexture3D(e[o]||Pd,s[o])}function Ob(i,e,t){const n=this.cache,r=e.length,s=Aa(t,r);un(n,s)||(i.uniform1iv(this.addr,s),dn(n,s));for(let o=0;o!==r;++o)t.setTextureCube(e[o]||Ld,s[o])}function kb(i,e,t){const n=this.cache,r=e.length,s=Aa(t,r);un(n,s)||(i.uniform1iv(this.addr,s),dn(n,s));for(let o=0;o!==r;++o)t.setTexture2DArray(e[o]||Cd,s[o])}function Bb(i){switch(i){case 5126:return vb;case 35664:return yb;case 35665:return Mb;case 35666:return Sb;case 35674:return wb;case 35675:return Eb;case 35676:return Ab;case 5124:case 35670:return Tb;case 35667:case 35671:return Rb;case 35668:case 35672:return Cb;case 35669:case 35673:return Pb;case 5125:return Lb;case 36294:return Db;case 36295:return Ib;case 36296:return Nb;case 35678:case 36198:case 36298:case 36306:case 35682:return Ub;case 35679:case 36299:case 36307:return Fb;case 35680:case 36300:case 36308:case 36293:return Ob;case 36289:case 36303:case 36311:case 36292:return kb}}class zb{constructor(e,t,n){this.id=e,this.addr=n,this.cache=[],this.type=t.type,this.setValue=xb(t.type)}}class Hb{constructor(e,t,n){this.id=e,this.addr=n,this.cache=[],this.type=t.type,this.size=t.size,this.setValue=Bb(t.type)}}class Vb{constructor(e){this.id=e,this.seq=[],this.map={}}setValue(e,t,n){const r=this.seq;for(let s=0,o=r.length;s!==o;++s){const a=r[s];a.setValue(e,t[a.id],n)}}}const hc=/(\w+)(\])?(\[|\.)?/g;function Yh(i,e){i.seq.push(e),i.map[e.id]=e}function Gb(i,e,t){const n=i.name,r=n.length;for(hc.lastIndex=0;;){const s=hc.exec(n),o=hc.lastIndex;let a=s[1];const c=s[2]==="]",l=s[3];if(c&&(a=a|0),l===void 0||l==="["&&o+2===r){Yh(t,l===void 0?new zb(a,i,e):new Hb(a,i,e));break}else{let u=t.map[a];u===void 0&&(u=new Vb(a),Yh(t,u)),t=u}}}class oa{constructor(e,t){this.seq=[],this.map={};const n=e.getProgramParameter(t,e.ACTIVE_UNIFORMS);for(let r=0;r<n;++r){const s=e.getActiveUniform(t,r),o=e.getUniformLocation(t,s.name);Gb(s,o,this)}}setValue(e,t,n,r){const s=this.map[t];s!==void 0&&s.setValue(e,n,r)}setOptional(e,t,n){const r=t[n];r!==void 0&&this.setValue(e,n,r)}static upload(e,t,n,r){for(let s=0,o=t.length;s!==o;++s){const a=t[s],c=n[a.id];c.needsUpdate!==!1&&a.setValue(e,c.value,r)}}static seqWithValue(e,t){const n=[];for(let r=0,s=e.length;r!==s;++r){const o=e[r];o.id in t&&n.push(o)}return n}}function $h(i,e,t){const n=i.createShader(e);return i.shaderSource(n,t),i.compileShader(n),n}const Wb=37297;let qb=0;function jb(i,e){const t=i.split(`
`),n=[],r=Math.max(e-6,0),s=Math.min(e+6,t.length);for(let o=r;o<s;o++){const a=o+1;n.push(`${a===e?">":" "} ${a}: ${t[o]}`)}return n.join(`
`)}const Zh=new bt;function Xb(i){Ct._getMatrix(Zh,Ct.workingColorSpace,i);const e=`mat3( ${Zh.elements.map(t=>t.toFixed(4))} )`;switch(Ct.getTransfer(i)){case Ea:return[e,"LinearTransferOETF"];case qt:return[e,"sRGBTransferOETF"];default:return console.warn("THREE.WebGLProgram: Unsupported color space: ",i),[e,"LinearTransferOETF"]}}function Jh(i,e,t){const n=i.getShaderParameter(e,i.COMPILE_STATUS),r=i.getShaderInfoLog(e).trim();if(n&&r==="")return"";const s=/ERROR: 0:(\d+)/.exec(r);if(s){const o=parseInt(s[1]);return t.toUpperCase()+`

`+r+`

`+jb(i.getShaderSource(e),o)}else return r}function Qb(i,e){const t=Xb(e);return[`vec4 ${i}( vec4 value ) {`,`	return ${t[1]}( vec4( value.rgb * ${t[0]}, value.a ) );`,"}"].join(`
`)}function Kb(i,e){let t;switch(e){case Yf:t="Linear";break;case $f:t="Reinhard";break;case Zf:t="Cineon";break;case nd:t="ACESFilmic";break;case ep:t="AgX";break;case tp:t="Neutral";break;case Jf:t="Custom";break;default:console.warn("THREE.WebGLProgram: Unsupported toneMapping:",e),t="Linear"}return"vec3 "+i+"( vec3 color ) { return "+t+"ToneMapping( color ); }"}const Uo=new A;function Yb(){Ct.getLuminanceCoefficients(Uo);const i=Uo.x.toFixed(4),e=Uo.y.toFixed(4),t=Uo.z.toFixed(4);return["float luminance( const in vec3 rgb ) {",`	const vec3 weights = vec3( ${i}, ${e}, ${t} );`,"	return dot( weights, rgb );","}"].join(`
`)}function $b(i){return[i.extensionClipCullDistance?"#extension GL_ANGLE_clip_cull_distance : require":"",i.extensionMultiDraw?"#extension GL_ANGLE_multi_draw : require":""].filter(Ys).join(`
`)}function Zb(i){const e=[];for(const t in i){const n=i[t];n!==!1&&e.push("#define "+t+" "+n)}return e.join(`
`)}function Jb(i,e){const t={},n=i.getProgramParameter(e,i.ACTIVE_ATTRIBUTES);for(let r=0;r<n;r++){const s=i.getActiveAttrib(e,r),o=s.name;let a=1;s.type===i.FLOAT_MAT2&&(a=2),s.type===i.FLOAT_MAT3&&(a=3),s.type===i.FLOAT_MAT4&&(a=4),t[o]={type:s.type,location:i.getAttribLocation(e,o),locationSize:a}}return t}function Ys(i){return i!==""}function eu(i,e){const t=e.numSpotLightShadows+e.numSpotLightMaps-e.numSpotLightShadowsWithMaps;return i.replace(/NUM_DIR_LIGHTS/g,e.numDirLights).replace(/NUM_SPOT_LIGHTS/g,e.numSpotLights).replace(/NUM_SPOT_LIGHT_MAPS/g,e.numSpotLightMaps).replace(/NUM_SPOT_LIGHT_COORDS/g,t).replace(/NUM_RECT_AREA_LIGHTS/g,e.numRectAreaLights).replace(/NUM_POINT_LIGHTS/g,e.numPointLights).replace(/NUM_HEMI_LIGHTS/g,e.numHemiLights).replace(/NUM_DIR_LIGHT_SHADOWS/g,e.numDirLightShadows).replace(/NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS/g,e.numSpotLightShadowsWithMaps).replace(/NUM_SPOT_LIGHT_SHADOWS/g,e.numSpotLightShadows).replace(/NUM_POINT_LIGHT_SHADOWS/g,e.numPointLightShadows)}function tu(i,e){return i.replace(/NUM_CLIPPING_PLANES/g,e.numClippingPlanes).replace(/UNION_CLIPPING_PLANES/g,e.numClippingPlanes-e.numClipIntersection)}const e_=/^[ \t]*#include +<([\w\d./]+)>/gm;function xl(i){return i.replace(e_,n_)}const t_=new Map;function n_(i,e){let t=xt[e];if(t===void 0){const n=t_.get(e);if(n!==void 0)t=xt[n],console.warn('THREE.WebGLRenderer: Shader chunk "%s" has been deprecated. Use "%s" instead.',e,n);else throw new Error("Can not resolve #include <"+e+">")}return xl(t)}const i_=/#pragma unroll_loop_start\s+for\s*\(\s*int\s+i\s*=\s*(\d+)\s*;\s*i\s*<\s*(\d+)\s*;\s*i\s*\+\+\s*\)\s*{([\s\S]+?)}\s+#pragma unroll_loop_end/g;function nu(i){return i.replace(i_,r_)}function r_(i,e,t,n){let r="";for(let s=parseInt(e);s<parseInt(t);s++)r+=n.replace(/\[\s*i\s*\]/g,"[ "+s+" ]").replace(/UNROLLED_LOOP_INDEX/g,s);return r}function iu(i){let e=`precision ${i.precision} float;
	precision ${i.precision} int;
	precision ${i.precision} sampler2D;
	precision ${i.precision} samplerCube;
	precision ${i.precision} sampler3D;
	precision ${i.precision} sampler2DArray;
	precision ${i.precision} sampler2DShadow;
	precision ${i.precision} samplerCubeShadow;
	precision ${i.precision} sampler2DArrayShadow;
	precision ${i.precision} isampler2D;
	precision ${i.precision} isampler3D;
	precision ${i.precision} isamplerCube;
	precision ${i.precision} isampler2DArray;
	precision ${i.precision} usampler2D;
	precision ${i.precision} usampler3D;
	precision ${i.precision} usamplerCube;
	precision ${i.precision} usampler2DArray;
	`;return i.precision==="highp"?e+=`
#define HIGH_PRECISION`:i.precision==="mediump"?e+=`
#define MEDIUM_PRECISION`:i.precision==="lowp"&&(e+=`
#define LOW_PRECISION`),e}function s_(i){let e="SHADOWMAP_TYPE_BASIC";return i.shadowMapType===Ju?e="SHADOWMAP_TYPE_PCF":i.shadowMapType===ed?e="SHADOWMAP_TYPE_PCF_SOFT":i.shadowMapType===Li&&(e="SHADOWMAP_TYPE_VSM"),e}function o_(i){let e="ENVMAP_TYPE_CUBE";if(i.envMap)switch(i.envMapMode){case gs:case bs:e="ENVMAP_TYPE_CUBE";break;case wa:e="ENVMAP_TYPE_CUBE_UV";break}return e}function a_(i){let e="ENVMAP_MODE_REFLECTION";return i.envMap&&i.envMapMode===bs&&(e="ENVMAP_MODE_REFRACTION"),e}function c_(i){let e="ENVMAP_BLENDING_NONE";if(i.envMap)switch(i.combine){case td:e="ENVMAP_BLENDING_MULTIPLY";break;case Qf:e="ENVMAP_BLENDING_MIX";break;case Kf:e="ENVMAP_BLENDING_ADD";break}return e}function l_(i){const e=i.envMapCubeUVHeight;if(e===null)return null;const t=Math.log2(e)-2,n=1/e;return{texelWidth:1/(3*Math.max(Math.pow(2,t),112)),texelHeight:n,maxMip:t}}function h_(i,e,t,n){const r=i.getContext(),s=t.defines;let o=t.vertexShader,a=t.fragmentShader;const c=s_(t),l=o_(t),h=a_(t),u=c_(t),d=l_(t),p=$b(t),g=Zb(s),b=r.createProgram();let m,f,y=t.glslVersion?"#version "+t.glslVersion+`
`:"";t.isRawShaderMaterial?(m=["#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,g].filter(Ys).join(`
`),m.length>0&&(m+=`
`),f=["#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,g].filter(Ys).join(`
`),f.length>0&&(f+=`
`)):(m=[iu(t),"#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,g,t.extensionClipCullDistance?"#define USE_CLIP_DISTANCE":"",t.batching?"#define USE_BATCHING":"",t.batchingColor?"#define USE_BATCHING_COLOR":"",t.instancing?"#define USE_INSTANCING":"",t.instancingColor?"#define USE_INSTANCING_COLOR":"",t.instancingMorph?"#define USE_INSTANCING_MORPH":"",t.useFog&&t.fog?"#define USE_FOG":"",t.useFog&&t.fogExp2?"#define FOG_EXP2":"",t.map?"#define USE_MAP":"",t.envMap?"#define USE_ENVMAP":"",t.envMap?"#define "+h:"",t.lightMap?"#define USE_LIGHTMAP":"",t.aoMap?"#define USE_AOMAP":"",t.bumpMap?"#define USE_BUMPMAP":"",t.normalMap?"#define USE_NORMALMAP":"",t.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",t.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",t.displacementMap?"#define USE_DISPLACEMENTMAP":"",t.emissiveMap?"#define USE_EMISSIVEMAP":"",t.anisotropy?"#define USE_ANISOTROPY":"",t.anisotropyMap?"#define USE_ANISOTROPYMAP":"",t.clearcoatMap?"#define USE_CLEARCOATMAP":"",t.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",t.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",t.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",t.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",t.specularMap?"#define USE_SPECULARMAP":"",t.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",t.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",t.roughnessMap?"#define USE_ROUGHNESSMAP":"",t.metalnessMap?"#define USE_METALNESSMAP":"",t.alphaMap?"#define USE_ALPHAMAP":"",t.alphaHash?"#define USE_ALPHAHASH":"",t.transmission?"#define USE_TRANSMISSION":"",t.transmissionMap?"#define USE_TRANSMISSIONMAP":"",t.thicknessMap?"#define USE_THICKNESSMAP":"",t.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",t.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",t.mapUv?"#define MAP_UV "+t.mapUv:"",t.alphaMapUv?"#define ALPHAMAP_UV "+t.alphaMapUv:"",t.lightMapUv?"#define LIGHTMAP_UV "+t.lightMapUv:"",t.aoMapUv?"#define AOMAP_UV "+t.aoMapUv:"",t.emissiveMapUv?"#define EMISSIVEMAP_UV "+t.emissiveMapUv:"",t.bumpMapUv?"#define BUMPMAP_UV "+t.bumpMapUv:"",t.normalMapUv?"#define NORMALMAP_UV "+t.normalMapUv:"",t.displacementMapUv?"#define DISPLACEMENTMAP_UV "+t.displacementMapUv:"",t.metalnessMapUv?"#define METALNESSMAP_UV "+t.metalnessMapUv:"",t.roughnessMapUv?"#define ROUGHNESSMAP_UV "+t.roughnessMapUv:"",t.anisotropyMapUv?"#define ANISOTROPYMAP_UV "+t.anisotropyMapUv:"",t.clearcoatMapUv?"#define CLEARCOATMAP_UV "+t.clearcoatMapUv:"",t.clearcoatNormalMapUv?"#define CLEARCOAT_NORMALMAP_UV "+t.clearcoatNormalMapUv:"",t.clearcoatRoughnessMapUv?"#define CLEARCOAT_ROUGHNESSMAP_UV "+t.clearcoatRoughnessMapUv:"",t.iridescenceMapUv?"#define IRIDESCENCEMAP_UV "+t.iridescenceMapUv:"",t.iridescenceThicknessMapUv?"#define IRIDESCENCE_THICKNESSMAP_UV "+t.iridescenceThicknessMapUv:"",t.sheenColorMapUv?"#define SHEEN_COLORMAP_UV "+t.sheenColorMapUv:"",t.sheenRoughnessMapUv?"#define SHEEN_ROUGHNESSMAP_UV "+t.sheenRoughnessMapUv:"",t.specularMapUv?"#define SPECULARMAP_UV "+t.specularMapUv:"",t.specularColorMapUv?"#define SPECULAR_COLORMAP_UV "+t.specularColorMapUv:"",t.specularIntensityMapUv?"#define SPECULAR_INTENSITYMAP_UV "+t.specularIntensityMapUv:"",t.transmissionMapUv?"#define TRANSMISSIONMAP_UV "+t.transmissionMapUv:"",t.thicknessMapUv?"#define THICKNESSMAP_UV "+t.thicknessMapUv:"",t.vertexTangents&&t.flatShading===!1?"#define USE_TANGENT":"",t.vertexColors?"#define USE_COLOR":"",t.vertexAlphas?"#define USE_COLOR_ALPHA":"",t.vertexUv1s?"#define USE_UV1":"",t.vertexUv2s?"#define USE_UV2":"",t.vertexUv3s?"#define USE_UV3":"",t.pointsUvs?"#define USE_POINTS_UV":"",t.flatShading?"#define FLAT_SHADED":"",t.skinning?"#define USE_SKINNING":"",t.morphTargets?"#define USE_MORPHTARGETS":"",t.morphNormals&&t.flatShading===!1?"#define USE_MORPHNORMALS":"",t.morphColors?"#define USE_MORPHCOLORS":"",t.morphTargetsCount>0?"#define MORPHTARGETS_TEXTURE_STRIDE "+t.morphTextureStride:"",t.morphTargetsCount>0?"#define MORPHTARGETS_COUNT "+t.morphTargetsCount:"",t.doubleSided?"#define DOUBLE_SIDED":"",t.flipSided?"#define FLIP_SIDED":"",t.shadowMapEnabled?"#define USE_SHADOWMAP":"",t.shadowMapEnabled?"#define "+c:"",t.sizeAttenuation?"#define USE_SIZEATTENUATION":"",t.numLightProbes>0?"#define USE_LIGHT_PROBES":"",t.logarithmicDepthBuffer?"#define USE_LOGDEPTHBUF":"",t.reverseDepthBuffer?"#define USE_REVERSEDEPTHBUF":"","uniform mat4 modelMatrix;","uniform mat4 modelViewMatrix;","uniform mat4 projectionMatrix;","uniform mat4 viewMatrix;","uniform mat3 normalMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;","#ifdef USE_INSTANCING","	attribute mat4 instanceMatrix;","#endif","#ifdef USE_INSTANCING_COLOR","	attribute vec3 instanceColor;","#endif","#ifdef USE_INSTANCING_MORPH","	uniform sampler2D morphTexture;","#endif","attribute vec3 position;","attribute vec3 normal;","attribute vec2 uv;","#ifdef USE_UV1","	attribute vec2 uv1;","#endif","#ifdef USE_UV2","	attribute vec2 uv2;","#endif","#ifdef USE_UV3","	attribute vec2 uv3;","#endif","#ifdef USE_TANGENT","	attribute vec4 tangent;","#endif","#if defined( USE_COLOR_ALPHA )","	attribute vec4 color;","#elif defined( USE_COLOR )","	attribute vec3 color;","#endif","#ifdef USE_SKINNING","	attribute vec4 skinIndex;","	attribute vec4 skinWeight;","#endif",`
`].filter(Ys).join(`
`),f=[iu(t),"#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,g,t.useFog&&t.fog?"#define USE_FOG":"",t.useFog&&t.fogExp2?"#define FOG_EXP2":"",t.alphaToCoverage?"#define ALPHA_TO_COVERAGE":"",t.map?"#define USE_MAP":"",t.matcap?"#define USE_MATCAP":"",t.envMap?"#define USE_ENVMAP":"",t.envMap?"#define "+l:"",t.envMap?"#define "+h:"",t.envMap?"#define "+u:"",d?"#define CUBEUV_TEXEL_WIDTH "+d.texelWidth:"",d?"#define CUBEUV_TEXEL_HEIGHT "+d.texelHeight:"",d?"#define CUBEUV_MAX_MIP "+d.maxMip+".0":"",t.lightMap?"#define USE_LIGHTMAP":"",t.aoMap?"#define USE_AOMAP":"",t.bumpMap?"#define USE_BUMPMAP":"",t.normalMap?"#define USE_NORMALMAP":"",t.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",t.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",t.emissiveMap?"#define USE_EMISSIVEMAP":"",t.anisotropy?"#define USE_ANISOTROPY":"",t.anisotropyMap?"#define USE_ANISOTROPYMAP":"",t.clearcoat?"#define USE_CLEARCOAT":"",t.clearcoatMap?"#define USE_CLEARCOATMAP":"",t.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",t.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",t.dispersion?"#define USE_DISPERSION":"",t.iridescence?"#define USE_IRIDESCENCE":"",t.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",t.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",t.specularMap?"#define USE_SPECULARMAP":"",t.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",t.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",t.roughnessMap?"#define USE_ROUGHNESSMAP":"",t.metalnessMap?"#define USE_METALNESSMAP":"",t.alphaMap?"#define USE_ALPHAMAP":"",t.alphaTest?"#define USE_ALPHATEST":"",t.alphaHash?"#define USE_ALPHAHASH":"",t.sheen?"#define USE_SHEEN":"",t.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",t.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",t.transmission?"#define USE_TRANSMISSION":"",t.transmissionMap?"#define USE_TRANSMISSIONMAP":"",t.thicknessMap?"#define USE_THICKNESSMAP":"",t.vertexTangents&&t.flatShading===!1?"#define USE_TANGENT":"",t.vertexColors||t.instancingColor||t.batchingColor?"#define USE_COLOR":"",t.vertexAlphas?"#define USE_COLOR_ALPHA":"",t.vertexUv1s?"#define USE_UV1":"",t.vertexUv2s?"#define USE_UV2":"",t.vertexUv3s?"#define USE_UV3":"",t.pointsUvs?"#define USE_POINTS_UV":"",t.gradientMap?"#define USE_GRADIENTMAP":"",t.flatShading?"#define FLAT_SHADED":"",t.doubleSided?"#define DOUBLE_SIDED":"",t.flipSided?"#define FLIP_SIDED":"",t.shadowMapEnabled?"#define USE_SHADOWMAP":"",t.shadowMapEnabled?"#define "+c:"",t.premultipliedAlpha?"#define PREMULTIPLIED_ALPHA":"",t.numLightProbes>0?"#define USE_LIGHT_PROBES":"",t.decodeVideoTexture?"#define DECODE_VIDEO_TEXTURE":"",t.decodeVideoTextureEmissive?"#define DECODE_VIDEO_TEXTURE_EMISSIVE":"",t.logarithmicDepthBuffer?"#define USE_LOGDEPTHBUF":"",t.reverseDepthBuffer?"#define USE_REVERSEDEPTHBUF":"","uniform mat4 viewMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;",t.toneMapping!==cr?"#define TONE_MAPPING":"",t.toneMapping!==cr?xt.tonemapping_pars_fragment:"",t.toneMapping!==cr?Kb("toneMapping",t.toneMapping):"",t.dithering?"#define DITHERING":"",t.opaque?"#define OPAQUE":"",xt.colorspace_pars_fragment,Qb("linearToOutputTexel",t.outputColorSpace),Yb(),t.useDepthPacking?"#define DEPTH_PACKING "+t.depthPacking:"",`
`].filter(Ys).join(`
`)),o=xl(o),o=eu(o,t),o=tu(o,t),a=xl(a),a=eu(a,t),a=tu(a,t),o=nu(o),a=nu(a),t.isRawShaderMaterial!==!0&&(y=`#version 300 es
`,m=[p,"#define attribute in","#define varying out","#define texture2D texture"].join(`
`)+`
`+m,f=["#define varying in",t.glslVersion===gh?"":"layout(location = 0) out highp vec4 pc_fragColor;",t.glslVersion===gh?"":"#define gl_FragColor pc_fragColor","#define gl_FragDepthEXT gl_FragDepth","#define texture2D texture","#define textureCube texture","#define texture2DProj textureProj","#define texture2DLodEXT textureLod","#define texture2DProjLodEXT textureProjLod","#define textureCubeLodEXT textureLod","#define texture2DGradEXT textureGrad","#define texture2DProjGradEXT textureProjGrad","#define textureCubeGradEXT textureGrad"].join(`
`)+`
`+f);const x=y+m+o,_=y+f+a,I=$h(r,r.VERTEX_SHADER,x),L=$h(r,r.FRAGMENT_SHADER,_);r.attachShader(b,I),r.attachShader(b,L),t.index0AttributeName!==void 0?r.bindAttribLocation(b,0,t.index0AttributeName):t.morphTargets===!0&&r.bindAttribLocation(b,0,"position"),r.linkProgram(b);function C(T){if(i.debug.checkShaderErrors){const j=r.getProgramInfoLog(b).trim(),q=r.getShaderInfoLog(I).trim(),se=r.getShaderInfoLog(L).trim();let ne=!0,$=!0;if(r.getProgramParameter(b,r.LINK_STATUS)===!1)if(ne=!1,typeof i.debug.onShaderError=="function")i.debug.onShaderError(r,b,I,L);else{const ce=Jh(r,I,"vertex"),P=Jh(r,L,"fragment");console.error("THREE.WebGLProgram: Shader Error "+r.getError()+" - VALIDATE_STATUS "+r.getProgramParameter(b,r.VALIDATE_STATUS)+`

Material Name: `+T.name+`
Material Type: `+T.type+`

Program Info Log: `+j+`
`+ce+`
`+P)}else j!==""?console.warn("THREE.WebGLProgram: Program Info Log:",j):(q===""||se==="")&&($=!1);$&&(T.diagnostics={runnable:ne,programLog:j,vertexShader:{log:q,prefix:m},fragmentShader:{log:se,prefix:f}})}r.deleteShader(I),r.deleteShader(L),F=new oa(r,b),w=Jb(r,b)}let F;this.getUniforms=function(){return F===void 0&&C(this),F};let w;this.getAttributes=function(){return w===void 0&&C(this),w};let v=t.rendererExtensionParallelShaderCompile===!1;return this.isReady=function(){return v===!1&&(v=r.getProgramParameter(b,Wb)),v},this.destroy=function(){n.releaseStatesOfProgram(this),r.deleteProgram(b),this.program=void 0},this.type=t.shaderType,this.name=t.shaderName,this.id=qb++,this.cacheKey=e,this.usedTimes=1,this.program=b,this.vertexShader=I,this.fragmentShader=L,this}let u_=0;class d_{constructor(){this.shaderCache=new Map,this.materialCache=new Map}update(e){const t=e.vertexShader,n=e.fragmentShader,r=this._getShaderStage(t),s=this._getShaderStage(n),o=this._getShaderCacheForMaterial(e);return o.has(r)===!1&&(o.add(r),r.usedTimes++),o.has(s)===!1&&(o.add(s),s.usedTimes++),this}remove(e){const t=this.materialCache.get(e);for(const n of t)n.usedTimes--,n.usedTimes===0&&this.shaderCache.delete(n.code);return this.materialCache.delete(e),this}getVertexShaderID(e){return this._getShaderStage(e.vertexShader).id}getFragmentShaderID(e){return this._getShaderStage(e.fragmentShader).id}dispose(){this.shaderCache.clear(),this.materialCache.clear()}_getShaderCacheForMaterial(e){const t=this.materialCache;let n=t.get(e);return n===void 0&&(n=new Set,t.set(e,n)),n}_getShaderStage(e){const t=this.shaderCache;let n=t.get(e);return n===void 0&&(n=new f_(e),t.set(e,n)),n}}class f_{constructor(e){this.id=u_++,this.code=e,this.usedTimes=0}}function p_(i,e,t,n,r,s,o){const a=new Wl,c=new d_,l=new Set,h=[],u=r.logarithmicDepthBuffer,d=r.vertexTextures;let p=r.precision;const g={MeshDepthMaterial:"depth",MeshDistanceMaterial:"distanceRGBA",MeshNormalMaterial:"normal",MeshBasicMaterial:"basic",MeshLambertMaterial:"lambert",MeshPhongMaterial:"phong",MeshToonMaterial:"toon",MeshStandardMaterial:"physical",MeshPhysicalMaterial:"physical",MeshMatcapMaterial:"matcap",LineBasicMaterial:"basic",LineDashedMaterial:"dashed",PointsMaterial:"points",ShadowMaterial:"shadow",SpriteMaterial:"sprite"};function b(w){return l.add(w),w===0?"uv":`uv${w}`}function m(w,v,T,j,q){const se=j.fog,ne=q.geometry,$=w.isMeshStandardMaterial?j.environment:null,ce=(w.isMeshStandardMaterial?t:e).get(w.envMap||$),P=ce&&ce.mapping===wa?ce.image.height:null,k=g[w.type];w.precision!==null&&(p=r.getMaxPrecision(w.precision),p!==w.precision&&console.warn("THREE.WebGLProgram.getParameters:",w.precision,"not supported, using",p,"instead."));const W=ne.morphAttributes.position||ne.morphAttributes.normal||ne.morphAttributes.color,re=W!==void 0?W.length:0;let he=0;ne.morphAttributes.position!==void 0&&(he=1),ne.morphAttributes.normal!==void 0&&(he=2),ne.morphAttributes.color!==void 0&&(he=3);let ye,J,fe,Me;if(k){const Dt=pi[k];ye=Dt.vertexShader,J=Dt.fragmentShader}else ye=w.vertexShader,J=w.fragmentShader,c.update(w),fe=c.getVertexShaderID(w),Me=c.getFragmentShaderID(w);const _e=i.getRenderTarget(),Fe=i.state.buffers.depth.getReversed(),$e=q.isInstancedMesh===!0,nt=q.isBatchedMesh===!0,Tt=!!w.map,Ke=!!w.matcap,ct=!!ce,N=!!w.aoMap,Kt=!!w.lightMap,_t=!!w.bumpMap,dt=!!w.normalMap,De=!!w.displacementMap,Ut=!!w.emissiveMap,tt=!!w.metalnessMap,R=!!w.roughnessMap,M=w.anisotropy>0,Y=w.clearcoat>0,pe=w.dispersion>0,me=w.iridescence>0,ue=w.sheen>0,Ye=w.transmission>0,Re=M&&!!w.anisotropyMap,Oe=Y&&!!w.clearcoatMap,Rt=Y&&!!w.clearcoatNormalMap,Se=Y&&!!w.clearcoatRoughnessMap,ke=me&&!!w.iridescenceMap,Ze=me&&!!w.iridescenceThicknessMap,st=ue&&!!w.sheenColorMap,Be=ue&&!!w.sheenRoughnessMap,yt=!!w.specularMap,pt=!!w.specularColorMap,Lt=!!w.specularIntensityMap,O=Ye&&!!w.transmissionMap,Ce=Ye&&!!w.thicknessMap,ae=!!w.gradientMap,ge=!!w.alphaMap,Ie=w.alphaTest>0,Le=!!w.alphaHash,ut=!!w.extensions;let $t=cr;w.toneMapped&&(_e===null||_e.isXRRenderTarget===!0)&&($t=i.toneMapping);const fn={shaderID:k,shaderType:w.type,shaderName:w.name,vertexShader:ye,fragmentShader:J,defines:w.defines,customVertexShaderID:fe,customFragmentShaderID:Me,isRawShaderMaterial:w.isRawShaderMaterial===!0,glslVersion:w.glslVersion,precision:p,batching:nt,batchingColor:nt&&q._colorsTexture!==null,instancing:$e,instancingColor:$e&&q.instanceColor!==null,instancingMorph:$e&&q.morphTexture!==null,supportsVertexTextures:d,outputColorSpace:_e===null?i.outputColorSpace:_e.isXRRenderTarget===!0?_e.texture.colorSpace:Pn,alphaToCoverage:!!w.alphaToCoverage,map:Tt,matcap:Ke,envMap:ct,envMapMode:ct&&ce.mapping,envMapCubeUVHeight:P,aoMap:N,lightMap:Kt,bumpMap:_t,normalMap:dt,displacementMap:d&&De,emissiveMap:Ut,normalMapObjectSpace:dt&&w.normalMapType===ap,normalMapTangentSpace:dt&&w.normalMapType===md,metalnessMap:tt,roughnessMap:R,anisotropy:M,anisotropyMap:Re,clearcoat:Y,clearcoatMap:Oe,clearcoatNormalMap:Rt,clearcoatRoughnessMap:Se,dispersion:pe,iridescence:me,iridescenceMap:ke,iridescenceThicknessMap:Ze,sheen:ue,sheenColorMap:st,sheenRoughnessMap:Be,specularMap:yt,specularColorMap:pt,specularIntensityMap:Lt,transmission:Ye,transmissionMap:O,thicknessMap:Ce,gradientMap:ae,opaque:w.transparent===!1&&w.blending===os&&w.alphaToCoverage===!1,alphaMap:ge,alphaTest:Ie,alphaHash:Le,combine:w.combine,mapUv:Tt&&b(w.map.channel),aoMapUv:N&&b(w.aoMap.channel),lightMapUv:Kt&&b(w.lightMap.channel),bumpMapUv:_t&&b(w.bumpMap.channel),normalMapUv:dt&&b(w.normalMap.channel),displacementMapUv:De&&b(w.displacementMap.channel),emissiveMapUv:Ut&&b(w.emissiveMap.channel),metalnessMapUv:tt&&b(w.metalnessMap.channel),roughnessMapUv:R&&b(w.roughnessMap.channel),anisotropyMapUv:Re&&b(w.anisotropyMap.channel),clearcoatMapUv:Oe&&b(w.clearcoatMap.channel),clearcoatNormalMapUv:Rt&&b(w.clearcoatNormalMap.channel),clearcoatRoughnessMapUv:Se&&b(w.clearcoatRoughnessMap.channel),iridescenceMapUv:ke&&b(w.iridescenceMap.channel),iridescenceThicknessMapUv:Ze&&b(w.iridescenceThicknessMap.channel),sheenColorMapUv:st&&b(w.sheenColorMap.channel),sheenRoughnessMapUv:Be&&b(w.sheenRoughnessMap.channel),specularMapUv:yt&&b(w.specularMap.channel),specularColorMapUv:pt&&b(w.specularColorMap.channel),specularIntensityMapUv:Lt&&b(w.specularIntensityMap.channel),transmissionMapUv:O&&b(w.transmissionMap.channel),thicknessMapUv:Ce&&b(w.thicknessMap.channel),alphaMapUv:ge&&b(w.alphaMap.channel),vertexTangents:!!ne.attributes.tangent&&(dt||M),vertexColors:w.vertexColors,vertexAlphas:w.vertexColors===!0&&!!ne.attributes.color&&ne.attributes.color.itemSize===4,pointsUvs:q.isPoints===!0&&!!ne.attributes.uv&&(Tt||ge),fog:!!se,useFog:w.fog===!0,fogExp2:!!se&&se.isFogExp2,flatShading:w.flatShading===!0,sizeAttenuation:w.sizeAttenuation===!0,logarithmicDepthBuffer:u,reverseDepthBuffer:Fe,skinning:q.isSkinnedMesh===!0,morphTargets:ne.morphAttributes.position!==void 0,morphNormals:ne.morphAttributes.normal!==void 0,morphColors:ne.morphAttributes.color!==void 0,morphTargetsCount:re,morphTextureStride:he,numDirLights:v.directional.length,numPointLights:v.point.length,numSpotLights:v.spot.length,numSpotLightMaps:v.spotLightMap.length,numRectAreaLights:v.rectArea.length,numHemiLights:v.hemi.length,numDirLightShadows:v.directionalShadowMap.length,numPointLightShadows:v.pointShadowMap.length,numSpotLightShadows:v.spotShadowMap.length,numSpotLightShadowsWithMaps:v.numSpotLightShadowsWithMaps,numLightProbes:v.numLightProbes,numClippingPlanes:o.numPlanes,numClipIntersection:o.numIntersection,dithering:w.dithering,shadowMapEnabled:i.shadowMap.enabled&&T.length>0,shadowMapType:i.shadowMap.type,toneMapping:$t,decodeVideoTexture:Tt&&w.map.isVideoTexture===!0&&Ct.getTransfer(w.map.colorSpace)===qt,decodeVideoTextureEmissive:Ut&&w.emissiveMap.isVideoTexture===!0&&Ct.getTransfer(w.emissiveMap.colorSpace)===qt,premultipliedAlpha:w.premultipliedAlpha,doubleSided:w.side===mi,flipSided:w.side===Rn,useDepthPacking:w.depthPacking>=0,depthPacking:w.depthPacking||0,index0AttributeName:w.index0AttributeName,extensionClipCullDistance:ut&&w.extensions.clipCullDistance===!0&&n.has("WEBGL_clip_cull_distance"),extensionMultiDraw:(ut&&w.extensions.multiDraw===!0||nt)&&n.has("WEBGL_multi_draw"),rendererExtensionParallelShaderCompile:n.has("KHR_parallel_shader_compile"),customProgramCacheKey:w.customProgramCacheKey()};return fn.vertexUv1s=l.has(1),fn.vertexUv2s=l.has(2),fn.vertexUv3s=l.has(3),l.clear(),fn}function f(w){const v=[];if(w.shaderID?v.push(w.shaderID):(v.push(w.customVertexShaderID),v.push(w.customFragmentShaderID)),w.defines!==void 0)for(const T in w.defines)v.push(T),v.push(w.defines[T]);return w.isRawShaderMaterial===!1&&(y(v,w),x(v,w),v.push(i.outputColorSpace)),v.push(w.customProgramCacheKey),v.join()}function y(w,v){w.push(v.precision),w.push(v.outputColorSpace),w.push(v.envMapMode),w.push(v.envMapCubeUVHeight),w.push(v.mapUv),w.push(v.alphaMapUv),w.push(v.lightMapUv),w.push(v.aoMapUv),w.push(v.bumpMapUv),w.push(v.normalMapUv),w.push(v.displacementMapUv),w.push(v.emissiveMapUv),w.push(v.metalnessMapUv),w.push(v.roughnessMapUv),w.push(v.anisotropyMapUv),w.push(v.clearcoatMapUv),w.push(v.clearcoatNormalMapUv),w.push(v.clearcoatRoughnessMapUv),w.push(v.iridescenceMapUv),w.push(v.iridescenceThicknessMapUv),w.push(v.sheenColorMapUv),w.push(v.sheenRoughnessMapUv),w.push(v.specularMapUv),w.push(v.specularColorMapUv),w.push(v.specularIntensityMapUv),w.push(v.transmissionMapUv),w.push(v.thicknessMapUv),w.push(v.combine),w.push(v.fogExp2),w.push(v.sizeAttenuation),w.push(v.morphTargetsCount),w.push(v.morphAttributeCount),w.push(v.numDirLights),w.push(v.numPointLights),w.push(v.numSpotLights),w.push(v.numSpotLightMaps),w.push(v.numHemiLights),w.push(v.numRectAreaLights),w.push(v.numDirLightShadows),w.push(v.numPointLightShadows),w.push(v.numSpotLightShadows),w.push(v.numSpotLightShadowsWithMaps),w.push(v.numLightProbes),w.push(v.shadowMapType),w.push(v.toneMapping),w.push(v.numClippingPlanes),w.push(v.numClipIntersection),w.push(v.depthPacking)}function x(w,v){a.disableAll(),v.supportsVertexTextures&&a.enable(0),v.instancing&&a.enable(1),v.instancingColor&&a.enable(2),v.instancingMorph&&a.enable(3),v.matcap&&a.enable(4),v.envMap&&a.enable(5),v.normalMapObjectSpace&&a.enable(6),v.normalMapTangentSpace&&a.enable(7),v.clearcoat&&a.enable(8),v.iridescence&&a.enable(9),v.alphaTest&&a.enable(10),v.vertexColors&&a.enable(11),v.vertexAlphas&&a.enable(12),v.vertexUv1s&&a.enable(13),v.vertexUv2s&&a.enable(14),v.vertexUv3s&&a.enable(15),v.vertexTangents&&a.enable(16),v.anisotropy&&a.enable(17),v.alphaHash&&a.enable(18),v.batching&&a.enable(19),v.dispersion&&a.enable(20),v.batchingColor&&a.enable(21),w.push(a.mask),a.disableAll(),v.fog&&a.enable(0),v.useFog&&a.enable(1),v.flatShading&&a.enable(2),v.logarithmicDepthBuffer&&a.enable(3),v.reverseDepthBuffer&&a.enable(4),v.skinning&&a.enable(5),v.morphTargets&&a.enable(6),v.morphNormals&&a.enable(7),v.morphColors&&a.enable(8),v.premultipliedAlpha&&a.enable(9),v.shadowMapEnabled&&a.enable(10),v.doubleSided&&a.enable(11),v.flipSided&&a.enable(12),v.useDepthPacking&&a.enable(13),v.dithering&&a.enable(14),v.transmission&&a.enable(15),v.sheen&&a.enable(16),v.opaque&&a.enable(17),v.pointsUvs&&a.enable(18),v.decodeVideoTexture&&a.enable(19),v.decodeVideoTextureEmissive&&a.enable(20),v.alphaToCoverage&&a.enable(21),w.push(a.mask)}function _(w){const v=g[w.type];let T;if(v){const j=pi[v];T=$p.clone(j.uniforms)}else T=w.uniforms;return T}function I(w,v){let T;for(let j=0,q=h.length;j<q;j++){const se=h[j];if(se.cacheKey===v){T=se,++T.usedTimes;break}}return T===void 0&&(T=new h_(i,v,w,s),h.push(T)),T}function L(w){if(--w.usedTimes===0){const v=h.indexOf(w);h[v]=h[h.length-1],h.pop(),w.destroy()}}function C(w){c.remove(w)}function F(){c.dispose()}return{getParameters:m,getProgramCacheKey:f,getUniforms:_,acquireProgram:I,releaseProgram:L,releaseShaderCache:C,programs:h,dispose:F}}function m_(){let i=new WeakMap;function e(o){return i.has(o)}function t(o){let a=i.get(o);return a===void 0&&(a={},i.set(o,a)),a}function n(o){i.delete(o)}function r(o,a,c){i.get(o)[a]=c}function s(){i=new WeakMap}return{has:e,get:t,remove:n,update:r,dispose:s}}function g_(i,e){return i.groupOrder!==e.groupOrder?i.groupOrder-e.groupOrder:i.renderOrder!==e.renderOrder?i.renderOrder-e.renderOrder:i.material.id!==e.material.id?i.material.id-e.material.id:i.z!==e.z?i.z-e.z:i.id-e.id}function ru(i,e){return i.groupOrder!==e.groupOrder?i.groupOrder-e.groupOrder:i.renderOrder!==e.renderOrder?i.renderOrder-e.renderOrder:i.z!==e.z?e.z-i.z:i.id-e.id}function su(){const i=[];let e=0;const t=[],n=[],r=[];function s(){e=0,t.length=0,n.length=0,r.length=0}function o(u,d,p,g,b,m){let f=i[e];return f===void 0?(f={id:u.id,object:u,geometry:d,material:p,groupOrder:g,renderOrder:u.renderOrder,z:b,group:m},i[e]=f):(f.id=u.id,f.object=u,f.geometry=d,f.material=p,f.groupOrder=g,f.renderOrder=u.renderOrder,f.z=b,f.group=m),e++,f}function a(u,d,p,g,b,m){const f=o(u,d,p,g,b,m);p.transmission>0?n.push(f):p.transparent===!0?r.push(f):t.push(f)}function c(u,d,p,g,b,m){const f=o(u,d,p,g,b,m);p.transmission>0?n.unshift(f):p.transparent===!0?r.unshift(f):t.unshift(f)}function l(u,d){t.length>1&&t.sort(u||g_),n.length>1&&n.sort(d||ru),r.length>1&&r.sort(d||ru)}function h(){for(let u=e,d=i.length;u<d;u++){const p=i[u];if(p.id===null)break;p.id=null,p.object=null,p.geometry=null,p.material=null,p.group=null}}return{opaque:t,transmissive:n,transparent:r,init:s,push:a,unshift:c,finish:h,sort:l}}function b_(){let i=new WeakMap;function e(n,r){const s=i.get(n);let o;return s===void 0?(o=new su,i.set(n,[o])):r>=s.length?(o=new su,s.push(o)):o=s[r],o}function t(){i=new WeakMap}return{get:e,dispose:t}}function __(){const i={};return{get:function(e){if(i[e.id]!==void 0)return i[e.id];let t;switch(e.type){case"DirectionalLight":t={direction:new A,color:new it};break;case"SpotLight":t={position:new A,direction:new A,color:new it,distance:0,coneCos:0,penumbraCos:0,decay:0};break;case"PointLight":t={position:new A,color:new it,distance:0,decay:0};break;case"HemisphereLight":t={direction:new A,skyColor:new it,groundColor:new it};break;case"RectAreaLight":t={color:new it,position:new A,halfWidth:new A,halfHeight:new A};break}return i[e.id]=t,t}}}function x_(){const i={};return{get:function(e){if(i[e.id]!==void 0)return i[e.id];let t;switch(e.type){case"DirectionalLight":t={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new at};break;case"SpotLight":t={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new at};break;case"PointLight":t={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new at,shadowCameraNear:1,shadowCameraFar:1e3};break}return i[e.id]=t,t}}}let v_=0;function y_(i,e){return(e.castShadow?2:0)-(i.castShadow?2:0)+(e.map?1:0)-(i.map?1:0)}function M_(i){const e=new __,t=x_(),n={version:0,hash:{directionalLength:-1,pointLength:-1,spotLength:-1,rectAreaLength:-1,hemiLength:-1,numDirectionalShadows:-1,numPointShadows:-1,numSpotShadows:-1,numSpotMaps:-1,numLightProbes:-1},ambient:[0,0,0],probe:[],directional:[],directionalShadow:[],directionalShadowMap:[],directionalShadowMatrix:[],spot:[],spotLightMap:[],spotShadow:[],spotShadowMap:[],spotLightMatrix:[],rectArea:[],rectAreaLTC1:null,rectAreaLTC2:null,point:[],pointShadow:[],pointShadowMap:[],pointShadowMatrix:[],hemi:[],numSpotLightShadowsWithMaps:0,numLightProbes:0};for(let l=0;l<9;l++)n.probe.push(new A);const r=new A,s=new rt,o=new rt;function a(l){let h=0,u=0,d=0;for(let w=0;w<9;w++)n.probe[w].set(0,0,0);let p=0,g=0,b=0,m=0,f=0,y=0,x=0,_=0,I=0,L=0,C=0;l.sort(y_);for(let w=0,v=l.length;w<v;w++){const T=l[w],j=T.color,q=T.intensity,se=T.distance,ne=T.shadow&&T.shadow.map?T.shadow.map.texture:null;if(T.isAmbientLight)h+=j.r*q,u+=j.g*q,d+=j.b*q;else if(T.isLightProbe){for(let $=0;$<9;$++)n.probe[$].addScaledVector(T.sh.coefficients[$],q);C++}else if(T.isDirectionalLight){const $=e.get(T);if($.color.copy(T.color).multiplyScalar(T.intensity),T.castShadow){const ce=T.shadow,P=t.get(T);P.shadowIntensity=ce.intensity,P.shadowBias=ce.bias,P.shadowNormalBias=ce.normalBias,P.shadowRadius=ce.radius,P.shadowMapSize=ce.mapSize,n.directionalShadow[p]=P,n.directionalShadowMap[p]=ne,n.directionalShadowMatrix[p]=T.shadow.matrix,y++}n.directional[p]=$,p++}else if(T.isSpotLight){const $=e.get(T);$.position.setFromMatrixPosition(T.matrixWorld),$.color.copy(j).multiplyScalar(q),$.distance=se,$.coneCos=Math.cos(T.angle),$.penumbraCos=Math.cos(T.angle*(1-T.penumbra)),$.decay=T.decay,n.spot[b]=$;const ce=T.shadow;if(T.map&&(n.spotLightMap[I]=T.map,I++,ce.updateMatrices(T),T.castShadow&&L++),n.spotLightMatrix[b]=ce.matrix,T.castShadow){const P=t.get(T);P.shadowIntensity=ce.intensity,P.shadowBias=ce.bias,P.shadowNormalBias=ce.normalBias,P.shadowRadius=ce.radius,P.shadowMapSize=ce.mapSize,n.spotShadow[b]=P,n.spotShadowMap[b]=ne,_++}b++}else if(T.isRectAreaLight){const $=e.get(T);$.color.copy(j).multiplyScalar(q),$.halfWidth.set(T.width*.5,0,0),$.halfHeight.set(0,T.height*.5,0),n.rectArea[m]=$,m++}else if(T.isPointLight){const $=e.get(T);if($.color.copy(T.color).multiplyScalar(T.intensity),$.distance=T.distance,$.decay=T.decay,T.castShadow){const ce=T.shadow,P=t.get(T);P.shadowIntensity=ce.intensity,P.shadowBias=ce.bias,P.shadowNormalBias=ce.normalBias,P.shadowRadius=ce.radius,P.shadowMapSize=ce.mapSize,P.shadowCameraNear=ce.camera.near,P.shadowCameraFar=ce.camera.far,n.pointShadow[g]=P,n.pointShadowMap[g]=ne,n.pointShadowMatrix[g]=T.shadow.matrix,x++}n.point[g]=$,g++}else if(T.isHemisphereLight){const $=e.get(T);$.skyColor.copy(T.color).multiplyScalar(q),$.groundColor.copy(T.groundColor).multiplyScalar(q),n.hemi[f]=$,f++}}m>0&&(i.has("OES_texture_float_linear")===!0?(n.rectAreaLTC1=Te.LTC_FLOAT_1,n.rectAreaLTC2=Te.LTC_FLOAT_2):(n.rectAreaLTC1=Te.LTC_HALF_1,n.rectAreaLTC2=Te.LTC_HALF_2)),n.ambient[0]=h,n.ambient[1]=u,n.ambient[2]=d;const F=n.hash;(F.directionalLength!==p||F.pointLength!==g||F.spotLength!==b||F.rectAreaLength!==m||F.hemiLength!==f||F.numDirectionalShadows!==y||F.numPointShadows!==x||F.numSpotShadows!==_||F.numSpotMaps!==I||F.numLightProbes!==C)&&(n.directional.length=p,n.spot.length=b,n.rectArea.length=m,n.point.length=g,n.hemi.length=f,n.directionalShadow.length=y,n.directionalShadowMap.length=y,n.pointShadow.length=x,n.pointShadowMap.length=x,n.spotShadow.length=_,n.spotShadowMap.length=_,n.directionalShadowMatrix.length=y,n.pointShadowMatrix.length=x,n.spotLightMatrix.length=_+I-L,n.spotLightMap.length=I,n.numSpotLightShadowsWithMaps=L,n.numLightProbes=C,F.directionalLength=p,F.pointLength=g,F.spotLength=b,F.rectAreaLength=m,F.hemiLength=f,F.numDirectionalShadows=y,F.numPointShadows=x,F.numSpotShadows=_,F.numSpotMaps=I,F.numLightProbes=C,n.version=v_++)}function c(l,h){let u=0,d=0,p=0,g=0,b=0;const m=h.matrixWorldInverse;for(let f=0,y=l.length;f<y;f++){const x=l[f];if(x.isDirectionalLight){const _=n.directional[u];_.direction.setFromMatrixPosition(x.matrixWorld),r.setFromMatrixPosition(x.target.matrixWorld),_.direction.sub(r),_.direction.transformDirection(m),u++}else if(x.isSpotLight){const _=n.spot[p];_.position.setFromMatrixPosition(x.matrixWorld),_.position.applyMatrix4(m),_.direction.setFromMatrixPosition(x.matrixWorld),r.setFromMatrixPosition(x.target.matrixWorld),_.direction.sub(r),_.direction.transformDirection(m),p++}else if(x.isRectAreaLight){const _=n.rectArea[g];_.position.setFromMatrixPosition(x.matrixWorld),_.position.applyMatrix4(m),o.identity(),s.copy(x.matrixWorld),s.premultiply(m),o.extractRotation(s),_.halfWidth.set(x.width*.5,0,0),_.halfHeight.set(0,x.height*.5,0),_.halfWidth.applyMatrix4(o),_.halfHeight.applyMatrix4(o),g++}else if(x.isPointLight){const _=n.point[d];_.position.setFromMatrixPosition(x.matrixWorld),_.position.applyMatrix4(m),d++}else if(x.isHemisphereLight){const _=n.hemi[b];_.direction.setFromMatrixPosition(x.matrixWorld),_.direction.transformDirection(m),b++}}}return{setup:a,setupView:c,state:n}}function ou(i){const e=new M_(i),t=[],n=[];function r(h){l.camera=h,t.length=0,n.length=0}function s(h){t.push(h)}function o(h){n.push(h)}function a(){e.setup(t)}function c(h){e.setupView(t,h)}const l={lightsArray:t,shadowsArray:n,camera:null,lights:e,transmissionRenderTarget:{}};return{init:r,state:l,setupLights:a,setupLightsView:c,pushLight:s,pushShadow:o}}function S_(i){let e=new WeakMap;function t(r,s=0){const o=e.get(r);let a;return o===void 0?(a=new ou(i),e.set(r,[a])):s>=o.length?(a=new ou(i),o.push(a)):a=o[s],a}function n(){e=new WeakMap}return{get:t,dispose:n}}class w_ extends li{static get type(){return"MeshDepthMaterial"}constructor(e){super(),this.isMeshDepthMaterial=!0,this.depthPacking=sp,this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.wireframe=!1,this.wireframeLinewidth=1,this.setValues(e)}copy(e){return super.copy(e),this.depthPacking=e.depthPacking,this.map=e.map,this.alphaMap=e.alphaMap,this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this}}class E_ extends li{static get type(){return"MeshDistanceMaterial"}constructor(e){super(),this.isMeshDistanceMaterial=!0,this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.setValues(e)}copy(e){return super.copy(e),this.map=e.map,this.alphaMap=e.alphaMap,this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this}}const A_=`void main() {
	gl_Position = vec4( position, 1.0 );
}`,T_=`uniform sampler2D shadow_pass;
uniform vec2 resolution;
uniform float radius;
#include <packing>
void main() {
	const float samples = float( VSM_SAMPLES );
	float mean = 0.0;
	float squared_mean = 0.0;
	float uvStride = samples <= 1.0 ? 0.0 : 2.0 / ( samples - 1.0 );
	float uvStart = samples <= 1.0 ? 0.0 : - 1.0;
	for ( float i = 0.0; i < samples; i ++ ) {
		float uvOffset = uvStart + i * uvStride;
		#ifdef HORIZONTAL_PASS
			vec2 distribution = unpackRGBATo2Half( texture2D( shadow_pass, ( gl_FragCoord.xy + vec2( uvOffset, 0.0 ) * radius ) / resolution ) );
			mean += distribution.x;
			squared_mean += distribution.y * distribution.y + distribution.x * distribution.x;
		#else
			float depth = unpackRGBAToDepth( texture2D( shadow_pass, ( gl_FragCoord.xy + vec2( 0.0, uvOffset ) * radius ) / resolution ) );
			mean += depth;
			squared_mean += depth * depth;
		#endif
	}
	mean = mean / samples;
	squared_mean = squared_mean / samples;
	float std_dev = sqrt( squared_mean - mean * mean );
	gl_FragColor = pack2HalfToRGBA( vec2( mean, std_dev ) );
}`;function R_(i,e,t){let n=new ql;const r=new at,s=new at,o=new vt,a=new w_({depthPacking:op}),c=new E_,l={},h=t.maxTextureSize,u={[Gi]:Rn,[Rn]:Gi,[mi]:mi},d=new hr({defines:{VSM_SAMPLES:8},uniforms:{shadow_pass:{value:null},resolution:{value:new at},radius:{value:4}},vertexShader:A_,fragmentShader:T_}),p=d.clone();p.defines.HORIZONTAL_PASS=1;const g=new vi;g.setAttribute("position",new wn(new Float32Array([-1,-1,.5,3,-1,.5,-1,3,.5]),3));const b=new jt(g,d),m=this;this.enabled=!1,this.autoUpdate=!0,this.needsUpdate=!1,this.type=Ju;let f=this.type;this.render=function(L,C,F){if(m.enabled===!1||m.autoUpdate===!1&&m.needsUpdate===!1||L.length===0)return;const w=i.getRenderTarget(),v=i.getActiveCubeFace(),T=i.getActiveMipmapLevel(),j=i.state;j.setBlending(ar),j.buffers.color.setClear(1,1,1,1),j.buffers.depth.setTest(!0),j.setScissorTest(!1);const q=f!==Li&&this.type===Li,se=f===Li&&this.type!==Li;for(let ne=0,$=L.length;ne<$;ne++){const ce=L[ne],P=ce.shadow;if(P===void 0){console.warn("THREE.WebGLShadowMap:",ce,"has no shadow.");continue}if(P.autoUpdate===!1&&P.needsUpdate===!1)continue;r.copy(P.mapSize);const k=P.getFrameExtents();if(r.multiply(k),s.copy(P.mapSize),(r.x>h||r.y>h)&&(r.x>h&&(s.x=Math.floor(h/k.x),r.x=s.x*k.x,P.mapSize.x=s.x),r.y>h&&(s.y=Math.floor(h/k.y),r.y=s.y*k.y,P.mapSize.y=s.y)),P.map===null||q===!0||se===!0){const re=this.type!==Li?{minFilter:Cn,magFilter:Cn}:{};P.map!==null&&P.map.dispose(),P.map=new Dr(r.x,r.y,re),P.map.texture.name=ce.name+".shadowMap",P.camera.updateProjectionMatrix()}i.setRenderTarget(P.map),i.clear();const W=P.getViewportCount();for(let re=0;re<W;re++){const he=P.getViewport(re);o.set(s.x*he.x,s.y*he.y,s.x*he.z,s.y*he.w),j.viewport(o),P.updateMatrices(ce,re),n=P.getFrustum(),_(C,F,P.camera,ce,this.type)}P.isPointLightShadow!==!0&&this.type===Li&&y(P,F),P.needsUpdate=!1}f=this.type,m.needsUpdate=!1,i.setRenderTarget(w,v,T)};function y(L,C){const F=e.update(b);d.defines.VSM_SAMPLES!==L.blurSamples&&(d.defines.VSM_SAMPLES=L.blurSamples,p.defines.VSM_SAMPLES=L.blurSamples,d.needsUpdate=!0,p.needsUpdate=!0),L.mapPass===null&&(L.mapPass=new Dr(r.x,r.y)),d.uniforms.shadow_pass.value=L.map.texture,d.uniforms.resolution.value=L.mapSize,d.uniforms.radius.value=L.radius,i.setRenderTarget(L.mapPass),i.clear(),i.renderBufferDirect(C,null,F,d,b,null),p.uniforms.shadow_pass.value=L.mapPass.texture,p.uniforms.resolution.value=L.mapSize,p.uniforms.radius.value=L.radius,i.setRenderTarget(L.map),i.clear(),i.renderBufferDirect(C,null,F,p,b,null)}function x(L,C,F,w){let v=null;const T=F.isPointLight===!0?L.customDistanceMaterial:L.customDepthMaterial;if(T!==void 0)v=T;else if(v=F.isPointLight===!0?c:a,i.localClippingEnabled&&C.clipShadows===!0&&Array.isArray(C.clippingPlanes)&&C.clippingPlanes.length!==0||C.displacementMap&&C.displacementScale!==0||C.alphaMap&&C.alphaTest>0||C.map&&C.alphaTest>0){const j=v.uuid,q=C.uuid;let se=l[j];se===void 0&&(se={},l[j]=se);let ne=se[q];ne===void 0&&(ne=v.clone(),se[q]=ne,C.addEventListener("dispose",I)),v=ne}if(v.visible=C.visible,v.wireframe=C.wireframe,w===Li?v.side=C.shadowSide!==null?C.shadowSide:C.side:v.side=C.shadowSide!==null?C.shadowSide:u[C.side],v.alphaMap=C.alphaMap,v.alphaTest=C.alphaTest,v.map=C.map,v.clipShadows=C.clipShadows,v.clippingPlanes=C.clippingPlanes,v.clipIntersection=C.clipIntersection,v.displacementMap=C.displacementMap,v.displacementScale=C.displacementScale,v.displacementBias=C.displacementBias,v.wireframeLinewidth=C.wireframeLinewidth,v.linewidth=C.linewidth,F.isPointLight===!0&&v.isMeshDistanceMaterial===!0){const j=i.properties.get(v);j.light=F}return v}function _(L,C,F,w,v){if(L.visible===!1)return;if(L.layers.test(C.layers)&&(L.isMesh||L.isLine||L.isPoints)&&(L.castShadow||L.receiveShadow&&v===Li)&&(!L.frustumCulled||n.intersectsObject(L))){L.modelViewMatrix.multiplyMatrices(F.matrixWorldInverse,L.matrixWorld);const q=e.update(L),se=L.material;if(Array.isArray(se)){const ne=q.groups;for(let $=0,ce=ne.length;$<ce;$++){const P=ne[$],k=se[P.materialIndex];if(k&&k.visible){const W=x(L,k,w,v);L.onBeforeShadow(i,L,C,F,q,W,P),i.renderBufferDirect(F,null,q,W,L,P),L.onAfterShadow(i,L,C,F,q,W,P)}}}else if(se.visible){const ne=x(L,se,w,v);L.onBeforeShadow(i,L,C,F,q,ne,null),i.renderBufferDirect(F,null,q,ne,L,null),L.onAfterShadow(i,L,C,F,q,ne,null)}}const j=L.children;for(let q=0,se=j.length;q<se;q++)_(j[q],C,F,w,v)}function I(L){L.target.removeEventListener("dispose",I);for(const F in l){const w=l[F],v=L.target.uuid;v in w&&(w[v].dispose(),delete w[v])}}}const C_={[Uc]:Fc,[Oc]:zc,[kc]:Hc,[ms]:Bc,[Fc]:Uc,[zc]:Oc,[Hc]:kc,[Bc]:ms};function P_(i,e){function t(){let O=!1;const Ce=new vt;let ae=null;const ge=new vt(0,0,0,0);return{setMask:function(Ie){ae!==Ie&&!O&&(i.colorMask(Ie,Ie,Ie,Ie),ae=Ie)},setLocked:function(Ie){O=Ie},setClear:function(Ie,Le,ut,$t,fn){fn===!0&&(Ie*=$t,Le*=$t,ut*=$t),Ce.set(Ie,Le,ut,$t),ge.equals(Ce)===!1&&(i.clearColor(Ie,Le,ut,$t),ge.copy(Ce))},reset:function(){O=!1,ae=null,ge.set(-1,0,0,0)}}}function n(){let O=!1,Ce=!1,ae=null,ge=null,Ie=null;return{setReversed:function(Le){if(Ce!==Le){const ut=e.get("EXT_clip_control");Ce?ut.clipControlEXT(ut.LOWER_LEFT_EXT,ut.ZERO_TO_ONE_EXT):ut.clipControlEXT(ut.LOWER_LEFT_EXT,ut.NEGATIVE_ONE_TO_ONE_EXT);const $t=Ie;Ie=null,this.setClear($t)}Ce=Le},getReversed:function(){return Ce},setTest:function(Le){Le?_e(i.DEPTH_TEST):Fe(i.DEPTH_TEST)},setMask:function(Le){ae!==Le&&!O&&(i.depthMask(Le),ae=Le)},setFunc:function(Le){if(Ce&&(Le=C_[Le]),ge!==Le){switch(Le){case Uc:i.depthFunc(i.NEVER);break;case Fc:i.depthFunc(i.ALWAYS);break;case Oc:i.depthFunc(i.LESS);break;case ms:i.depthFunc(i.LEQUAL);break;case kc:i.depthFunc(i.EQUAL);break;case Bc:i.depthFunc(i.GEQUAL);break;case zc:i.depthFunc(i.GREATER);break;case Hc:i.depthFunc(i.NOTEQUAL);break;default:i.depthFunc(i.LEQUAL)}ge=Le}},setLocked:function(Le){O=Le},setClear:function(Le){Ie!==Le&&(Ce&&(Le=1-Le),i.clearDepth(Le),Ie=Le)},reset:function(){O=!1,ae=null,ge=null,Ie=null,Ce=!1}}}function r(){let O=!1,Ce=null,ae=null,ge=null,Ie=null,Le=null,ut=null,$t=null,fn=null;return{setTest:function(Dt){O||(Dt?_e(i.STENCIL_TEST):Fe(i.STENCIL_TEST))},setMask:function(Dt){Ce!==Dt&&!O&&(i.stencilMask(Dt),Ce=Dt)},setFunc:function(Dt,Ln,jn){(ae!==Dt||ge!==Ln||Ie!==jn)&&(i.stencilFunc(Dt,Ln,jn),ae=Dt,ge=Ln,Ie=jn)},setOp:function(Dt,Ln,jn){(Le!==Dt||ut!==Ln||$t!==jn)&&(i.stencilOp(Dt,Ln,jn),Le=Dt,ut=Ln,$t=jn)},setLocked:function(Dt){O=Dt},setClear:function(Dt){fn!==Dt&&(i.clearStencil(Dt),fn=Dt)},reset:function(){O=!1,Ce=null,ae=null,ge=null,Ie=null,Le=null,ut=null,$t=null,fn=null}}}const s=new t,o=new n,a=new r,c=new WeakMap,l=new WeakMap;let h={},u={},d=new WeakMap,p=[],g=null,b=!1,m=null,f=null,y=null,x=null,_=null,I=null,L=null,C=new it(0,0,0),F=0,w=!1,v=null,T=null,j=null,q=null,se=null;const ne=i.getParameter(i.MAX_COMBINED_TEXTURE_IMAGE_UNITS);let $=!1,ce=0;const P=i.getParameter(i.VERSION);P.indexOf("WebGL")!==-1?(ce=parseFloat(/^WebGL (\d)/.exec(P)[1]),$=ce>=1):P.indexOf("OpenGL ES")!==-1&&(ce=parseFloat(/^OpenGL ES (\d)/.exec(P)[1]),$=ce>=2);let k=null,W={};const re=i.getParameter(i.SCISSOR_BOX),he=i.getParameter(i.VIEWPORT),ye=new vt().fromArray(re),J=new vt().fromArray(he);function fe(O,Ce,ae,ge){const Ie=new Uint8Array(4),Le=i.createTexture();i.bindTexture(O,Le),i.texParameteri(O,i.TEXTURE_MIN_FILTER,i.NEAREST),i.texParameteri(O,i.TEXTURE_MAG_FILTER,i.NEAREST);for(let ut=0;ut<ae;ut++)O===i.TEXTURE_3D||O===i.TEXTURE_2D_ARRAY?i.texImage3D(Ce,0,i.RGBA,1,1,ge,0,i.RGBA,i.UNSIGNED_BYTE,Ie):i.texImage2D(Ce+ut,0,i.RGBA,1,1,0,i.RGBA,i.UNSIGNED_BYTE,Ie);return Le}const Me={};Me[i.TEXTURE_2D]=fe(i.TEXTURE_2D,i.TEXTURE_2D,1),Me[i.TEXTURE_CUBE_MAP]=fe(i.TEXTURE_CUBE_MAP,i.TEXTURE_CUBE_MAP_POSITIVE_X,6),Me[i.TEXTURE_2D_ARRAY]=fe(i.TEXTURE_2D_ARRAY,i.TEXTURE_2D_ARRAY,1,1),Me[i.TEXTURE_3D]=fe(i.TEXTURE_3D,i.TEXTURE_3D,1,1),s.setClear(0,0,0,1),o.setClear(1),a.setClear(0),_e(i.DEPTH_TEST),o.setFunc(ms),_t(!1),dt(ah),_e(i.CULL_FACE),N(ar);function _e(O){h[O]!==!0&&(i.enable(O),h[O]=!0)}function Fe(O){h[O]!==!1&&(i.disable(O),h[O]=!1)}function $e(O,Ce){return u[O]!==Ce?(i.bindFramebuffer(O,Ce),u[O]=Ce,O===i.DRAW_FRAMEBUFFER&&(u[i.FRAMEBUFFER]=Ce),O===i.FRAMEBUFFER&&(u[i.DRAW_FRAMEBUFFER]=Ce),!0):!1}function nt(O,Ce){let ae=p,ge=!1;if(O){ae=d.get(Ce),ae===void 0&&(ae=[],d.set(Ce,ae));const Ie=O.textures;if(ae.length!==Ie.length||ae[0]!==i.COLOR_ATTACHMENT0){for(let Le=0,ut=Ie.length;Le<ut;Le++)ae[Le]=i.COLOR_ATTACHMENT0+Le;ae.length=Ie.length,ge=!0}}else ae[0]!==i.BACK&&(ae[0]=i.BACK,ge=!0);ge&&i.drawBuffers(ae)}function Tt(O){return g!==O?(i.useProgram(O),g=O,!0):!1}const Ke={[Ar]:i.FUNC_ADD,[Lf]:i.FUNC_SUBTRACT,[Df]:i.FUNC_REVERSE_SUBTRACT};Ke[If]=i.MIN,Ke[Nf]=i.MAX;const ct={[Uf]:i.ZERO,[Ff]:i.ONE,[Of]:i.SRC_COLOR,[Ic]:i.SRC_ALPHA,[Gf]:i.SRC_ALPHA_SATURATE,[Hf]:i.DST_COLOR,[Bf]:i.DST_ALPHA,[kf]:i.ONE_MINUS_SRC_COLOR,[Nc]:i.ONE_MINUS_SRC_ALPHA,[Vf]:i.ONE_MINUS_DST_COLOR,[zf]:i.ONE_MINUS_DST_ALPHA,[Wf]:i.CONSTANT_COLOR,[qf]:i.ONE_MINUS_CONSTANT_COLOR,[jf]:i.CONSTANT_ALPHA,[Xf]:i.ONE_MINUS_CONSTANT_ALPHA};function N(O,Ce,ae,ge,Ie,Le,ut,$t,fn,Dt){if(O===ar){b===!0&&(Fe(i.BLEND),b=!1);return}if(b===!1&&(_e(i.BLEND),b=!0),O!==Pf){if(O!==m||Dt!==w){if((f!==Ar||_!==Ar)&&(i.blendEquation(i.FUNC_ADD),f=Ar,_=Ar),Dt)switch(O){case os:i.blendFuncSeparate(i.ONE,i.ONE_MINUS_SRC_ALPHA,i.ONE,i.ONE_MINUS_SRC_ALPHA);break;case ch:i.blendFunc(i.ONE,i.ONE);break;case lh:i.blendFuncSeparate(i.ZERO,i.ONE_MINUS_SRC_COLOR,i.ZERO,i.ONE);break;case hh:i.blendFuncSeparate(i.ZERO,i.SRC_COLOR,i.ZERO,i.SRC_ALPHA);break;default:console.error("THREE.WebGLState: Invalid blending: ",O);break}else switch(O){case os:i.blendFuncSeparate(i.SRC_ALPHA,i.ONE_MINUS_SRC_ALPHA,i.ONE,i.ONE_MINUS_SRC_ALPHA);break;case ch:i.blendFunc(i.SRC_ALPHA,i.ONE);break;case lh:i.blendFuncSeparate(i.ZERO,i.ONE_MINUS_SRC_COLOR,i.ZERO,i.ONE);break;case hh:i.blendFunc(i.ZERO,i.SRC_COLOR);break;default:console.error("THREE.WebGLState: Invalid blending: ",O);break}y=null,x=null,I=null,L=null,C.set(0,0,0),F=0,m=O,w=Dt}return}Ie=Ie||Ce,Le=Le||ae,ut=ut||ge,(Ce!==f||Ie!==_)&&(i.blendEquationSeparate(Ke[Ce],Ke[Ie]),f=Ce,_=Ie),(ae!==y||ge!==x||Le!==I||ut!==L)&&(i.blendFuncSeparate(ct[ae],ct[ge],ct[Le],ct[ut]),y=ae,x=ge,I=Le,L=ut),($t.equals(C)===!1||fn!==F)&&(i.blendColor($t.r,$t.g,$t.b,fn),C.copy($t),F=fn),m=O,w=!1}function Kt(O,Ce){O.side===mi?Fe(i.CULL_FACE):_e(i.CULL_FACE);let ae=O.side===Rn;Ce&&(ae=!ae),_t(ae),O.blending===os&&O.transparent===!1?N(ar):N(O.blending,O.blendEquation,O.blendSrc,O.blendDst,O.blendEquationAlpha,O.blendSrcAlpha,O.blendDstAlpha,O.blendColor,O.blendAlpha,O.premultipliedAlpha),o.setFunc(O.depthFunc),o.setTest(O.depthTest),o.setMask(O.depthWrite),s.setMask(O.colorWrite);const ge=O.stencilWrite;a.setTest(ge),ge&&(a.setMask(O.stencilWriteMask),a.setFunc(O.stencilFunc,O.stencilRef,O.stencilFuncMask),a.setOp(O.stencilFail,O.stencilZFail,O.stencilZPass)),Ut(O.polygonOffset,O.polygonOffsetFactor,O.polygonOffsetUnits),O.alphaToCoverage===!0?_e(i.SAMPLE_ALPHA_TO_COVERAGE):Fe(i.SAMPLE_ALPHA_TO_COVERAGE)}function _t(O){v!==O&&(O?i.frontFace(i.CW):i.frontFace(i.CCW),v=O)}function dt(O){O!==Rf?(_e(i.CULL_FACE),O!==T&&(O===ah?i.cullFace(i.BACK):O===Cf?i.cullFace(i.FRONT):i.cullFace(i.FRONT_AND_BACK))):Fe(i.CULL_FACE),T=O}function De(O){O!==j&&($&&i.lineWidth(O),j=O)}function Ut(O,Ce,ae){O?(_e(i.POLYGON_OFFSET_FILL),(q!==Ce||se!==ae)&&(i.polygonOffset(Ce,ae),q=Ce,se=ae)):Fe(i.POLYGON_OFFSET_FILL)}function tt(O){O?_e(i.SCISSOR_TEST):Fe(i.SCISSOR_TEST)}function R(O){O===void 0&&(O=i.TEXTURE0+ne-1),k!==O&&(i.activeTexture(O),k=O)}function M(O,Ce,ae){ae===void 0&&(k===null?ae=i.TEXTURE0+ne-1:ae=k);let ge=W[ae];ge===void 0&&(ge={type:void 0,texture:void 0},W[ae]=ge),(ge.type!==O||ge.texture!==Ce)&&(k!==ae&&(i.activeTexture(ae),k=ae),i.bindTexture(O,Ce||Me[O]),ge.type=O,ge.texture=Ce)}function Y(){const O=W[k];O!==void 0&&O.type!==void 0&&(i.bindTexture(O.type,null),O.type=void 0,O.texture=void 0)}function pe(){try{i.compressedTexImage2D.apply(i,arguments)}catch(O){console.error("THREE.WebGLState:",O)}}function me(){try{i.compressedTexImage3D.apply(i,arguments)}catch(O){console.error("THREE.WebGLState:",O)}}function ue(){try{i.texSubImage2D.apply(i,arguments)}catch(O){console.error("THREE.WebGLState:",O)}}function Ye(){try{i.texSubImage3D.apply(i,arguments)}catch(O){console.error("THREE.WebGLState:",O)}}function Re(){try{i.compressedTexSubImage2D.apply(i,arguments)}catch(O){console.error("THREE.WebGLState:",O)}}function Oe(){try{i.compressedTexSubImage3D.apply(i,arguments)}catch(O){console.error("THREE.WebGLState:",O)}}function Rt(){try{i.texStorage2D.apply(i,arguments)}catch(O){console.error("THREE.WebGLState:",O)}}function Se(){try{i.texStorage3D.apply(i,arguments)}catch(O){console.error("THREE.WebGLState:",O)}}function ke(){try{i.texImage2D.apply(i,arguments)}catch(O){console.error("THREE.WebGLState:",O)}}function Ze(){try{i.texImage3D.apply(i,arguments)}catch(O){console.error("THREE.WebGLState:",O)}}function st(O){ye.equals(O)===!1&&(i.scissor(O.x,O.y,O.z,O.w),ye.copy(O))}function Be(O){J.equals(O)===!1&&(i.viewport(O.x,O.y,O.z,O.w),J.copy(O))}function yt(O,Ce){let ae=l.get(Ce);ae===void 0&&(ae=new WeakMap,l.set(Ce,ae));let ge=ae.get(O);ge===void 0&&(ge=i.getUniformBlockIndex(Ce,O.name),ae.set(O,ge))}function pt(O,Ce){const ge=l.get(Ce).get(O);c.get(Ce)!==ge&&(i.uniformBlockBinding(Ce,ge,O.__bindingPointIndex),c.set(Ce,ge))}function Lt(){i.disable(i.BLEND),i.disable(i.CULL_FACE),i.disable(i.DEPTH_TEST),i.disable(i.POLYGON_OFFSET_FILL),i.disable(i.SCISSOR_TEST),i.disable(i.STENCIL_TEST),i.disable(i.SAMPLE_ALPHA_TO_COVERAGE),i.blendEquation(i.FUNC_ADD),i.blendFunc(i.ONE,i.ZERO),i.blendFuncSeparate(i.ONE,i.ZERO,i.ONE,i.ZERO),i.blendColor(0,0,0,0),i.colorMask(!0,!0,!0,!0),i.clearColor(0,0,0,0),i.depthMask(!0),i.depthFunc(i.LESS),o.setReversed(!1),i.clearDepth(1),i.stencilMask(4294967295),i.stencilFunc(i.ALWAYS,0,4294967295),i.stencilOp(i.KEEP,i.KEEP,i.KEEP),i.clearStencil(0),i.cullFace(i.BACK),i.frontFace(i.CCW),i.polygonOffset(0,0),i.activeTexture(i.TEXTURE0),i.bindFramebuffer(i.FRAMEBUFFER,null),i.bindFramebuffer(i.DRAW_FRAMEBUFFER,null),i.bindFramebuffer(i.READ_FRAMEBUFFER,null),i.useProgram(null),i.lineWidth(1),i.scissor(0,0,i.canvas.width,i.canvas.height),i.viewport(0,0,i.canvas.width,i.canvas.height),h={},k=null,W={},u={},d=new WeakMap,p=[],g=null,b=!1,m=null,f=null,y=null,x=null,_=null,I=null,L=null,C=new it(0,0,0),F=0,w=!1,v=null,T=null,j=null,q=null,se=null,ye.set(0,0,i.canvas.width,i.canvas.height),J.set(0,0,i.canvas.width,i.canvas.height),s.reset(),o.reset(),a.reset()}return{buffers:{color:s,depth:o,stencil:a},enable:_e,disable:Fe,bindFramebuffer:$e,drawBuffers:nt,useProgram:Tt,setBlending:N,setMaterial:Kt,setFlipSided:_t,setCullFace:dt,setLineWidth:De,setPolygonOffset:Ut,setScissorTest:tt,activeTexture:R,bindTexture:M,unbindTexture:Y,compressedTexImage2D:pe,compressedTexImage3D:me,texImage2D:ke,texImage3D:Ze,updateUBOMapping:yt,uniformBlockBinding:pt,texStorage2D:Rt,texStorage3D:Se,texSubImage2D:ue,texSubImage3D:Ye,compressedTexSubImage2D:Re,compressedTexSubImage3D:Oe,scissor:st,viewport:Be,reset:Lt}}function au(i,e,t,n){const r=L_(n);switch(t){case cd:return i*e;case hd:return i*e;case ud:return i*e*2;case Bl:return i*e/r.components*r.byteLength;case zl:return i*e/r.components*r.byteLength;case dd:return i*e*2/r.components*r.byteLength;case Hl:return i*e*2/r.components*r.byteLength;case ld:return i*e*3/r.components*r.byteLength;case Zn:return i*e*4/r.components*r.byteLength;case Vl:return i*e*4/r.components*r.byteLength;case ta:case na:return Math.floor((i+3)/4)*Math.floor((e+3)/4)*8;case ia:case ra:return Math.floor((i+3)/4)*Math.floor((e+3)/4)*16;case qc:case Xc:return Math.max(i,16)*Math.max(e,8)/4;case Wc:case jc:return Math.max(i,8)*Math.max(e,8)/2;case Qc:case Kc:return Math.floor((i+3)/4)*Math.floor((e+3)/4)*8;case Yc:return Math.floor((i+3)/4)*Math.floor((e+3)/4)*16;case $c:return Math.floor((i+3)/4)*Math.floor((e+3)/4)*16;case Zc:return Math.floor((i+4)/5)*Math.floor((e+3)/4)*16;case Jc:return Math.floor((i+4)/5)*Math.floor((e+4)/5)*16;case el:return Math.floor((i+5)/6)*Math.floor((e+4)/5)*16;case tl:return Math.floor((i+5)/6)*Math.floor((e+5)/6)*16;case nl:return Math.floor((i+7)/8)*Math.floor((e+4)/5)*16;case il:return Math.floor((i+7)/8)*Math.floor((e+5)/6)*16;case rl:return Math.floor((i+7)/8)*Math.floor((e+7)/8)*16;case sl:return Math.floor((i+9)/10)*Math.floor((e+4)/5)*16;case ol:return Math.floor((i+9)/10)*Math.floor((e+5)/6)*16;case al:return Math.floor((i+9)/10)*Math.floor((e+7)/8)*16;case cl:return Math.floor((i+9)/10)*Math.floor((e+9)/10)*16;case ll:return Math.floor((i+11)/12)*Math.floor((e+9)/10)*16;case hl:return Math.floor((i+11)/12)*Math.floor((e+11)/12)*16;case sa:case ul:case dl:return Math.ceil(i/4)*Math.ceil(e/4)*16;case fd:case fl:return Math.ceil(i/4)*Math.ceil(e/4)*8;case pl:case ml:return Math.ceil(i/4)*Math.ceil(e/4)*16}throw new Error(`Unable to determine texture byte length for ${t} format.`)}function L_(i){switch(i){case Wi:case sd:return{byteLength:1,components:1};case no:case od:case co:return{byteLength:2,components:1};case Ol:case kl:return{byteLength:2,components:4};case Lr:case Fl:case ai:return{byteLength:4,components:1};case ad:return{byteLength:4,components:3}}throw new Error(`Unknown texture type ${i}.`)}function D_(i,e,t,n,r,s,o){const a=e.has("WEBGL_multisampled_render_to_texture")?e.get("WEBGL_multisampled_render_to_texture"):null,c=typeof navigator>"u"?!1:/OculusBrowser/g.test(navigator.userAgent),l=new at,h=new WeakMap;let u;const d=new WeakMap;let p=!1;try{p=typeof OffscreenCanvas<"u"&&new OffscreenCanvas(1,1).getContext("2d")!==null}catch{}function g(R,M){return p?new OffscreenCanvas(R,M):so("canvas")}function b(R,M,Y){let pe=1;const me=tt(R);if((me.width>Y||me.height>Y)&&(pe=Y/Math.max(me.width,me.height)),pe<1)if(typeof HTMLImageElement<"u"&&R instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&R instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&R instanceof ImageBitmap||typeof VideoFrame<"u"&&R instanceof VideoFrame){const ue=Math.floor(pe*me.width),Ye=Math.floor(pe*me.height);u===void 0&&(u=g(ue,Ye));const Re=M?g(ue,Ye):u;return Re.width=ue,Re.height=Ye,Re.getContext("2d").drawImage(R,0,0,ue,Ye),console.warn("THREE.WebGLRenderer: Texture has been resized from ("+me.width+"x"+me.height+") to ("+ue+"x"+Ye+")."),Re}else return"data"in R&&console.warn("THREE.WebGLRenderer: Image in DataTexture is too big ("+me.width+"x"+me.height+")."),R;return R}function m(R){return R.generateMipmaps}function f(R){i.generateMipmap(R)}function y(R){return R.isWebGLCubeRenderTarget?i.TEXTURE_CUBE_MAP:R.isWebGL3DRenderTarget?i.TEXTURE_3D:R.isWebGLArrayRenderTarget||R.isCompressedArrayTexture?i.TEXTURE_2D_ARRAY:i.TEXTURE_2D}function x(R,M,Y,pe,me=!1){if(R!==null){if(i[R]!==void 0)return i[R];console.warn("THREE.WebGLRenderer: Attempt to use non-existing WebGL internal format '"+R+"'")}let ue=M;if(M===i.RED&&(Y===i.FLOAT&&(ue=i.R32F),Y===i.HALF_FLOAT&&(ue=i.R16F),Y===i.UNSIGNED_BYTE&&(ue=i.R8)),M===i.RED_INTEGER&&(Y===i.UNSIGNED_BYTE&&(ue=i.R8UI),Y===i.UNSIGNED_SHORT&&(ue=i.R16UI),Y===i.UNSIGNED_INT&&(ue=i.R32UI),Y===i.BYTE&&(ue=i.R8I),Y===i.SHORT&&(ue=i.R16I),Y===i.INT&&(ue=i.R32I)),M===i.RG&&(Y===i.FLOAT&&(ue=i.RG32F),Y===i.HALF_FLOAT&&(ue=i.RG16F),Y===i.UNSIGNED_BYTE&&(ue=i.RG8)),M===i.RG_INTEGER&&(Y===i.UNSIGNED_BYTE&&(ue=i.RG8UI),Y===i.UNSIGNED_SHORT&&(ue=i.RG16UI),Y===i.UNSIGNED_INT&&(ue=i.RG32UI),Y===i.BYTE&&(ue=i.RG8I),Y===i.SHORT&&(ue=i.RG16I),Y===i.INT&&(ue=i.RG32I)),M===i.RGB_INTEGER&&(Y===i.UNSIGNED_BYTE&&(ue=i.RGB8UI),Y===i.UNSIGNED_SHORT&&(ue=i.RGB16UI),Y===i.UNSIGNED_INT&&(ue=i.RGB32UI),Y===i.BYTE&&(ue=i.RGB8I),Y===i.SHORT&&(ue=i.RGB16I),Y===i.INT&&(ue=i.RGB32I)),M===i.RGBA_INTEGER&&(Y===i.UNSIGNED_BYTE&&(ue=i.RGBA8UI),Y===i.UNSIGNED_SHORT&&(ue=i.RGBA16UI),Y===i.UNSIGNED_INT&&(ue=i.RGBA32UI),Y===i.BYTE&&(ue=i.RGBA8I),Y===i.SHORT&&(ue=i.RGBA16I),Y===i.INT&&(ue=i.RGBA32I)),M===i.RGB&&Y===i.UNSIGNED_INT_5_9_9_9_REV&&(ue=i.RGB9_E5),M===i.RGBA){const Ye=me?Ea:Ct.getTransfer(pe);Y===i.FLOAT&&(ue=i.RGBA32F),Y===i.HALF_FLOAT&&(ue=i.RGBA16F),Y===i.UNSIGNED_BYTE&&(ue=Ye===qt?i.SRGB8_ALPHA8:i.RGBA8),Y===i.UNSIGNED_SHORT_4_4_4_4&&(ue=i.RGBA4),Y===i.UNSIGNED_SHORT_5_5_5_1&&(ue=i.RGB5_A1)}return(ue===i.R16F||ue===i.R32F||ue===i.RG16F||ue===i.RG32F||ue===i.RGBA16F||ue===i.RGBA32F)&&e.get("EXT_color_buffer_float"),ue}function _(R,M){let Y;return R?M===null||M===Lr||M===xs?Y=i.DEPTH24_STENCIL8:M===ai?Y=i.DEPTH32F_STENCIL8:M===no&&(Y=i.DEPTH24_STENCIL8,console.warn("DepthTexture: 16 bit depth attachment is not supported with stencil. Using 24-bit attachment.")):M===null||M===Lr||M===xs?Y=i.DEPTH_COMPONENT24:M===ai?Y=i.DEPTH_COMPONENT32F:M===no&&(Y=i.DEPTH_COMPONENT16),Y}function I(R,M){return m(R)===!0||R.isFramebufferTexture&&R.minFilter!==Cn&&R.minFilter!==qn?Math.log2(Math.max(M.width,M.height))+1:R.mipmaps!==void 0&&R.mipmaps.length>0?R.mipmaps.length:R.isCompressedTexture&&Array.isArray(R.image)?M.mipmaps.length:1}function L(R){const M=R.target;M.removeEventListener("dispose",L),F(M),M.isVideoTexture&&h.delete(M)}function C(R){const M=R.target;M.removeEventListener("dispose",C),v(M)}function F(R){const M=n.get(R);if(M.__webglInit===void 0)return;const Y=R.source,pe=d.get(Y);if(pe){const me=pe[M.__cacheKey];me.usedTimes--,me.usedTimes===0&&w(R),Object.keys(pe).length===0&&d.delete(Y)}n.remove(R)}function w(R){const M=n.get(R);i.deleteTexture(M.__webglTexture);const Y=R.source,pe=d.get(Y);delete pe[M.__cacheKey],o.memory.textures--}function v(R){const M=n.get(R);if(R.depthTexture&&(R.depthTexture.dispose(),n.remove(R.depthTexture)),R.isWebGLCubeRenderTarget)for(let pe=0;pe<6;pe++){if(Array.isArray(M.__webglFramebuffer[pe]))for(let me=0;me<M.__webglFramebuffer[pe].length;me++)i.deleteFramebuffer(M.__webglFramebuffer[pe][me]);else i.deleteFramebuffer(M.__webglFramebuffer[pe]);M.__webglDepthbuffer&&i.deleteRenderbuffer(M.__webglDepthbuffer[pe])}else{if(Array.isArray(M.__webglFramebuffer))for(let pe=0;pe<M.__webglFramebuffer.length;pe++)i.deleteFramebuffer(M.__webglFramebuffer[pe]);else i.deleteFramebuffer(M.__webglFramebuffer);if(M.__webglDepthbuffer&&i.deleteRenderbuffer(M.__webglDepthbuffer),M.__webglMultisampledFramebuffer&&i.deleteFramebuffer(M.__webglMultisampledFramebuffer),M.__webglColorRenderbuffer)for(let pe=0;pe<M.__webglColorRenderbuffer.length;pe++)M.__webglColorRenderbuffer[pe]&&i.deleteRenderbuffer(M.__webglColorRenderbuffer[pe]);M.__webglDepthRenderbuffer&&i.deleteRenderbuffer(M.__webglDepthRenderbuffer)}const Y=R.textures;for(let pe=0,me=Y.length;pe<me;pe++){const ue=n.get(Y[pe]);ue.__webglTexture&&(i.deleteTexture(ue.__webglTexture),o.memory.textures--),n.remove(Y[pe])}n.remove(R)}let T=0;function j(){T=0}function q(){const R=T;return R>=r.maxTextures&&console.warn("THREE.WebGLTextures: Trying to use "+R+" texture units while this GPU supports only "+r.maxTextures),T+=1,R}function se(R){const M=[];return M.push(R.wrapS),M.push(R.wrapT),M.push(R.wrapR||0),M.push(R.magFilter),M.push(R.minFilter),M.push(R.anisotropy),M.push(R.internalFormat),M.push(R.format),M.push(R.type),M.push(R.generateMipmaps),M.push(R.premultiplyAlpha),M.push(R.flipY),M.push(R.unpackAlignment),M.push(R.colorSpace),M.join()}function ne(R,M){const Y=n.get(R);if(R.isVideoTexture&&De(R),R.isRenderTargetTexture===!1&&R.version>0&&Y.__version!==R.version){const pe=R.image;if(pe===null)console.warn("THREE.WebGLRenderer: Texture marked for update but no image data found.");else if(pe.complete===!1)console.warn("THREE.WebGLRenderer: Texture marked for update but image is incomplete");else{J(Y,R,M);return}}t.bindTexture(i.TEXTURE_2D,Y.__webglTexture,i.TEXTURE0+M)}function $(R,M){const Y=n.get(R);if(R.version>0&&Y.__version!==R.version){J(Y,R,M);return}t.bindTexture(i.TEXTURE_2D_ARRAY,Y.__webglTexture,i.TEXTURE0+M)}function ce(R,M){const Y=n.get(R);if(R.version>0&&Y.__version!==R.version){J(Y,R,M);return}t.bindTexture(i.TEXTURE_3D,Y.__webglTexture,i.TEXTURE0+M)}function P(R,M){const Y=n.get(R);if(R.version>0&&Y.__version!==R.version){fe(Y,R,M);return}t.bindTexture(i.TEXTURE_CUBE_MAP,Y.__webglTexture,i.TEXTURE0+M)}const k={[_s]:i.REPEAT,[sr]:i.CLAMP_TO_EDGE,[fa]:i.MIRRORED_REPEAT},W={[Cn]:i.NEAREST,[rd]:i.NEAREST_MIPMAP_NEAREST,[Qs]:i.NEAREST_MIPMAP_LINEAR,[qn]:i.LINEAR,[ea]:i.LINEAR_MIPMAP_NEAREST,[Ui]:i.LINEAR_MIPMAP_LINEAR},re={[cp]:i.NEVER,[pp]:i.ALWAYS,[lp]:i.LESS,[gd]:i.LEQUAL,[hp]:i.EQUAL,[fp]:i.GEQUAL,[up]:i.GREATER,[dp]:i.NOTEQUAL};function he(R,M){if(M.type===ai&&e.has("OES_texture_float_linear")===!1&&(M.magFilter===qn||M.magFilter===ea||M.magFilter===Qs||M.magFilter===Ui||M.minFilter===qn||M.minFilter===ea||M.minFilter===Qs||M.minFilter===Ui)&&console.warn("THREE.WebGLRenderer: Unable to use linear filtering with floating point textures. OES_texture_float_linear not supported on this device."),i.texParameteri(R,i.TEXTURE_WRAP_S,k[M.wrapS]),i.texParameteri(R,i.TEXTURE_WRAP_T,k[M.wrapT]),(R===i.TEXTURE_3D||R===i.TEXTURE_2D_ARRAY)&&i.texParameteri(R,i.TEXTURE_WRAP_R,k[M.wrapR]),i.texParameteri(R,i.TEXTURE_MAG_FILTER,W[M.magFilter]),i.texParameteri(R,i.TEXTURE_MIN_FILTER,W[M.minFilter]),M.compareFunction&&(i.texParameteri(R,i.TEXTURE_COMPARE_MODE,i.COMPARE_REF_TO_TEXTURE),i.texParameteri(R,i.TEXTURE_COMPARE_FUNC,re[M.compareFunction])),e.has("EXT_texture_filter_anisotropic")===!0){if(M.magFilter===Cn||M.minFilter!==Qs&&M.minFilter!==Ui||M.type===ai&&e.has("OES_texture_float_linear")===!1)return;if(M.anisotropy>1||n.get(M).__currentAnisotropy){const Y=e.get("EXT_texture_filter_anisotropic");i.texParameterf(R,Y.TEXTURE_MAX_ANISOTROPY_EXT,Math.min(M.anisotropy,r.getMaxAnisotropy())),n.get(M).__currentAnisotropy=M.anisotropy}}}function ye(R,M){let Y=!1;R.__webglInit===void 0&&(R.__webglInit=!0,M.addEventListener("dispose",L));const pe=M.source;let me=d.get(pe);me===void 0&&(me={},d.set(pe,me));const ue=se(M);if(ue!==R.__cacheKey){me[ue]===void 0&&(me[ue]={texture:i.createTexture(),usedTimes:0},o.memory.textures++,Y=!0),me[ue].usedTimes++;const Ye=me[R.__cacheKey];Ye!==void 0&&(me[R.__cacheKey].usedTimes--,Ye.usedTimes===0&&w(M)),R.__cacheKey=ue,R.__webglTexture=me[ue].texture}return Y}function J(R,M,Y){let pe=i.TEXTURE_2D;(M.isDataArrayTexture||M.isCompressedArrayTexture)&&(pe=i.TEXTURE_2D_ARRAY),M.isData3DTexture&&(pe=i.TEXTURE_3D);const me=ye(R,M),ue=M.source;t.bindTexture(pe,R.__webglTexture,i.TEXTURE0+Y);const Ye=n.get(ue);if(ue.version!==Ye.__version||me===!0){t.activeTexture(i.TEXTURE0+Y);const Re=Ct.getPrimaries(Ct.workingColorSpace),Oe=M.colorSpace===ir?null:Ct.getPrimaries(M.colorSpace),Rt=M.colorSpace===ir||Re===Oe?i.NONE:i.BROWSER_DEFAULT_WEBGL;i.pixelStorei(i.UNPACK_FLIP_Y_WEBGL,M.flipY),i.pixelStorei(i.UNPACK_PREMULTIPLY_ALPHA_WEBGL,M.premultiplyAlpha),i.pixelStorei(i.UNPACK_ALIGNMENT,M.unpackAlignment),i.pixelStorei(i.UNPACK_COLORSPACE_CONVERSION_WEBGL,Rt);let Se=b(M.image,!1,r.maxTextureSize);Se=Ut(M,Se);const ke=s.convert(M.format,M.colorSpace),Ze=s.convert(M.type);let st=x(M.internalFormat,ke,Ze,M.colorSpace,M.isVideoTexture);he(pe,M);let Be;const yt=M.mipmaps,pt=M.isVideoTexture!==!0,Lt=Ye.__version===void 0||me===!0,O=ue.dataReady,Ce=I(M,Se);if(M.isDepthTexture)st=_(M.format===vs,M.type),Lt&&(pt?t.texStorage2D(i.TEXTURE_2D,1,st,Se.width,Se.height):t.texImage2D(i.TEXTURE_2D,0,st,Se.width,Se.height,0,ke,Ze,null));else if(M.isDataTexture)if(yt.length>0){pt&&Lt&&t.texStorage2D(i.TEXTURE_2D,Ce,st,yt[0].width,yt[0].height);for(let ae=0,ge=yt.length;ae<ge;ae++)Be=yt[ae],pt?O&&t.texSubImage2D(i.TEXTURE_2D,ae,0,0,Be.width,Be.height,ke,Ze,Be.data):t.texImage2D(i.TEXTURE_2D,ae,st,Be.width,Be.height,0,ke,Ze,Be.data);M.generateMipmaps=!1}else pt?(Lt&&t.texStorage2D(i.TEXTURE_2D,Ce,st,Se.width,Se.height),O&&t.texSubImage2D(i.TEXTURE_2D,0,0,0,Se.width,Se.height,ke,Ze,Se.data)):t.texImage2D(i.TEXTURE_2D,0,st,Se.width,Se.height,0,ke,Ze,Se.data);else if(M.isCompressedTexture)if(M.isCompressedArrayTexture){pt&&Lt&&t.texStorage3D(i.TEXTURE_2D_ARRAY,Ce,st,yt[0].width,yt[0].height,Se.depth);for(let ae=0,ge=yt.length;ae<ge;ae++)if(Be=yt[ae],M.format!==Zn)if(ke!==null)if(pt){if(O)if(M.layerUpdates.size>0){const Ie=au(Be.width,Be.height,M.format,M.type);for(const Le of M.layerUpdates){const ut=Be.data.subarray(Le*Ie/Be.data.BYTES_PER_ELEMENT,(Le+1)*Ie/Be.data.BYTES_PER_ELEMENT);t.compressedTexSubImage3D(i.TEXTURE_2D_ARRAY,ae,0,0,Le,Be.width,Be.height,1,ke,ut)}M.clearLayerUpdates()}else t.compressedTexSubImage3D(i.TEXTURE_2D_ARRAY,ae,0,0,0,Be.width,Be.height,Se.depth,ke,Be.data)}else t.compressedTexImage3D(i.TEXTURE_2D_ARRAY,ae,st,Be.width,Be.height,Se.depth,0,Be.data,0,0);else console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()");else pt?O&&t.texSubImage3D(i.TEXTURE_2D_ARRAY,ae,0,0,0,Be.width,Be.height,Se.depth,ke,Ze,Be.data):t.texImage3D(i.TEXTURE_2D_ARRAY,ae,st,Be.width,Be.height,Se.depth,0,ke,Ze,Be.data)}else{pt&&Lt&&t.texStorage2D(i.TEXTURE_2D,Ce,st,yt[0].width,yt[0].height);for(let ae=0,ge=yt.length;ae<ge;ae++)Be=yt[ae],M.format!==Zn?ke!==null?pt?O&&t.compressedTexSubImage2D(i.TEXTURE_2D,ae,0,0,Be.width,Be.height,ke,Be.data):t.compressedTexImage2D(i.TEXTURE_2D,ae,st,Be.width,Be.height,0,Be.data):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()"):pt?O&&t.texSubImage2D(i.TEXTURE_2D,ae,0,0,Be.width,Be.height,ke,Ze,Be.data):t.texImage2D(i.TEXTURE_2D,ae,st,Be.width,Be.height,0,ke,Ze,Be.data)}else if(M.isDataArrayTexture)if(pt){if(Lt&&t.texStorage3D(i.TEXTURE_2D_ARRAY,Ce,st,Se.width,Se.height,Se.depth),O)if(M.layerUpdates.size>0){const ae=au(Se.width,Se.height,M.format,M.type);for(const ge of M.layerUpdates){const Ie=Se.data.subarray(ge*ae/Se.data.BYTES_PER_ELEMENT,(ge+1)*ae/Se.data.BYTES_PER_ELEMENT);t.texSubImage3D(i.TEXTURE_2D_ARRAY,0,0,0,ge,Se.width,Se.height,1,ke,Ze,Ie)}M.clearLayerUpdates()}else t.texSubImage3D(i.TEXTURE_2D_ARRAY,0,0,0,0,Se.width,Se.height,Se.depth,ke,Ze,Se.data)}else t.texImage3D(i.TEXTURE_2D_ARRAY,0,st,Se.width,Se.height,Se.depth,0,ke,Ze,Se.data);else if(M.isData3DTexture)pt?(Lt&&t.texStorage3D(i.TEXTURE_3D,Ce,st,Se.width,Se.height,Se.depth),O&&t.texSubImage3D(i.TEXTURE_3D,0,0,0,0,Se.width,Se.height,Se.depth,ke,Ze,Se.data)):t.texImage3D(i.TEXTURE_3D,0,st,Se.width,Se.height,Se.depth,0,ke,Ze,Se.data);else if(M.isFramebufferTexture){if(Lt)if(pt)t.texStorage2D(i.TEXTURE_2D,Ce,st,Se.width,Se.height);else{let ae=Se.width,ge=Se.height;for(let Ie=0;Ie<Ce;Ie++)t.texImage2D(i.TEXTURE_2D,Ie,st,ae,ge,0,ke,Ze,null),ae>>=1,ge>>=1}}else if(yt.length>0){if(pt&&Lt){const ae=tt(yt[0]);t.texStorage2D(i.TEXTURE_2D,Ce,st,ae.width,ae.height)}for(let ae=0,ge=yt.length;ae<ge;ae++)Be=yt[ae],pt?O&&t.texSubImage2D(i.TEXTURE_2D,ae,0,0,ke,Ze,Be):t.texImage2D(i.TEXTURE_2D,ae,st,ke,Ze,Be);M.generateMipmaps=!1}else if(pt){if(Lt){const ae=tt(Se);t.texStorage2D(i.TEXTURE_2D,Ce,st,ae.width,ae.height)}O&&t.texSubImage2D(i.TEXTURE_2D,0,0,0,ke,Ze,Se)}else t.texImage2D(i.TEXTURE_2D,0,st,ke,Ze,Se);m(M)&&f(pe),Ye.__version=ue.version,M.onUpdate&&M.onUpdate(M)}R.__version=M.version}function fe(R,M,Y){if(M.image.length!==6)return;const pe=ye(R,M),me=M.source;t.bindTexture(i.TEXTURE_CUBE_MAP,R.__webglTexture,i.TEXTURE0+Y);const ue=n.get(me);if(me.version!==ue.__version||pe===!0){t.activeTexture(i.TEXTURE0+Y);const Ye=Ct.getPrimaries(Ct.workingColorSpace),Re=M.colorSpace===ir?null:Ct.getPrimaries(M.colorSpace),Oe=M.colorSpace===ir||Ye===Re?i.NONE:i.BROWSER_DEFAULT_WEBGL;i.pixelStorei(i.UNPACK_FLIP_Y_WEBGL,M.flipY),i.pixelStorei(i.UNPACK_PREMULTIPLY_ALPHA_WEBGL,M.premultiplyAlpha),i.pixelStorei(i.UNPACK_ALIGNMENT,M.unpackAlignment),i.pixelStorei(i.UNPACK_COLORSPACE_CONVERSION_WEBGL,Oe);const Rt=M.isCompressedTexture||M.image[0].isCompressedTexture,Se=M.image[0]&&M.image[0].isDataTexture,ke=[];for(let ge=0;ge<6;ge++)!Rt&&!Se?ke[ge]=b(M.image[ge],!0,r.maxCubemapSize):ke[ge]=Se?M.image[ge].image:M.image[ge],ke[ge]=Ut(M,ke[ge]);const Ze=ke[0],st=s.convert(M.format,M.colorSpace),Be=s.convert(M.type),yt=x(M.internalFormat,st,Be,M.colorSpace),pt=M.isVideoTexture!==!0,Lt=ue.__version===void 0||pe===!0,O=me.dataReady;let Ce=I(M,Ze);he(i.TEXTURE_CUBE_MAP,M);let ae;if(Rt){pt&&Lt&&t.texStorage2D(i.TEXTURE_CUBE_MAP,Ce,yt,Ze.width,Ze.height);for(let ge=0;ge<6;ge++){ae=ke[ge].mipmaps;for(let Ie=0;Ie<ae.length;Ie++){const Le=ae[Ie];M.format!==Zn?st!==null?pt?O&&t.compressedTexSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+ge,Ie,0,0,Le.width,Le.height,st,Le.data):t.compressedTexImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+ge,Ie,yt,Le.width,Le.height,0,Le.data):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .setTextureCube()"):pt?O&&t.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+ge,Ie,0,0,Le.width,Le.height,st,Be,Le.data):t.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+ge,Ie,yt,Le.width,Le.height,0,st,Be,Le.data)}}}else{if(ae=M.mipmaps,pt&&Lt){ae.length>0&&Ce++;const ge=tt(ke[0]);t.texStorage2D(i.TEXTURE_CUBE_MAP,Ce,yt,ge.width,ge.height)}for(let ge=0;ge<6;ge++)if(Se){pt?O&&t.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+ge,0,0,0,ke[ge].width,ke[ge].height,st,Be,ke[ge].data):t.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+ge,0,yt,ke[ge].width,ke[ge].height,0,st,Be,ke[ge].data);for(let Ie=0;Ie<ae.length;Ie++){const ut=ae[Ie].image[ge].image;pt?O&&t.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+ge,Ie+1,0,0,ut.width,ut.height,st,Be,ut.data):t.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+ge,Ie+1,yt,ut.width,ut.height,0,st,Be,ut.data)}}else{pt?O&&t.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+ge,0,0,0,st,Be,ke[ge]):t.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+ge,0,yt,st,Be,ke[ge]);for(let Ie=0;Ie<ae.length;Ie++){const Le=ae[Ie];pt?O&&t.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+ge,Ie+1,0,0,st,Be,Le.image[ge]):t.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+ge,Ie+1,yt,st,Be,Le.image[ge])}}}m(M)&&f(i.TEXTURE_CUBE_MAP),ue.__version=me.version,M.onUpdate&&M.onUpdate(M)}R.__version=M.version}function Me(R,M,Y,pe,me,ue){const Ye=s.convert(Y.format,Y.colorSpace),Re=s.convert(Y.type),Oe=x(Y.internalFormat,Ye,Re,Y.colorSpace),Rt=n.get(M),Se=n.get(Y);if(Se.__renderTarget=M,!Rt.__hasExternalTextures){const ke=Math.max(1,M.width>>ue),Ze=Math.max(1,M.height>>ue);me===i.TEXTURE_3D||me===i.TEXTURE_2D_ARRAY?t.texImage3D(me,ue,Oe,ke,Ze,M.depth,0,Ye,Re,null):t.texImage2D(me,ue,Oe,ke,Ze,0,Ye,Re,null)}t.bindFramebuffer(i.FRAMEBUFFER,R),dt(M)?a.framebufferTexture2DMultisampleEXT(i.FRAMEBUFFER,pe,me,Se.__webglTexture,0,_t(M)):(me===i.TEXTURE_2D||me>=i.TEXTURE_CUBE_MAP_POSITIVE_X&&me<=i.TEXTURE_CUBE_MAP_NEGATIVE_Z)&&i.framebufferTexture2D(i.FRAMEBUFFER,pe,me,Se.__webglTexture,ue),t.bindFramebuffer(i.FRAMEBUFFER,null)}function _e(R,M,Y){if(i.bindRenderbuffer(i.RENDERBUFFER,R),M.depthBuffer){const pe=M.depthTexture,me=pe&&pe.isDepthTexture?pe.type:null,ue=_(M.stencilBuffer,me),Ye=M.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT,Re=_t(M);dt(M)?a.renderbufferStorageMultisampleEXT(i.RENDERBUFFER,Re,ue,M.width,M.height):Y?i.renderbufferStorageMultisample(i.RENDERBUFFER,Re,ue,M.width,M.height):i.renderbufferStorage(i.RENDERBUFFER,ue,M.width,M.height),i.framebufferRenderbuffer(i.FRAMEBUFFER,Ye,i.RENDERBUFFER,R)}else{const pe=M.textures;for(let me=0;me<pe.length;me++){const ue=pe[me],Ye=s.convert(ue.format,ue.colorSpace),Re=s.convert(ue.type),Oe=x(ue.internalFormat,Ye,Re,ue.colorSpace),Rt=_t(M);Y&&dt(M)===!1?i.renderbufferStorageMultisample(i.RENDERBUFFER,Rt,Oe,M.width,M.height):dt(M)?a.renderbufferStorageMultisampleEXT(i.RENDERBUFFER,Rt,Oe,M.width,M.height):i.renderbufferStorage(i.RENDERBUFFER,Oe,M.width,M.height)}}i.bindRenderbuffer(i.RENDERBUFFER,null)}function Fe(R,M){if(M&&M.isWebGLCubeRenderTarget)throw new Error("Depth Texture with cube render targets is not supported");if(t.bindFramebuffer(i.FRAMEBUFFER,R),!(M.depthTexture&&M.depthTexture.isDepthTexture))throw new Error("renderTarget.depthTexture must be an instance of THREE.DepthTexture");const pe=n.get(M.depthTexture);pe.__renderTarget=M,(!pe.__webglTexture||M.depthTexture.image.width!==M.width||M.depthTexture.image.height!==M.height)&&(M.depthTexture.image.width=M.width,M.depthTexture.image.height=M.height,M.depthTexture.needsUpdate=!0),ne(M.depthTexture,0);const me=pe.__webglTexture,ue=_t(M);if(M.depthTexture.format===as)dt(M)?a.framebufferTexture2DMultisampleEXT(i.FRAMEBUFFER,i.DEPTH_ATTACHMENT,i.TEXTURE_2D,me,0,ue):i.framebufferTexture2D(i.FRAMEBUFFER,i.DEPTH_ATTACHMENT,i.TEXTURE_2D,me,0);else if(M.depthTexture.format===vs)dt(M)?a.framebufferTexture2DMultisampleEXT(i.FRAMEBUFFER,i.DEPTH_STENCIL_ATTACHMENT,i.TEXTURE_2D,me,0,ue):i.framebufferTexture2D(i.FRAMEBUFFER,i.DEPTH_STENCIL_ATTACHMENT,i.TEXTURE_2D,me,0);else throw new Error("Unknown depthTexture format")}function $e(R){const M=n.get(R),Y=R.isWebGLCubeRenderTarget===!0;if(M.__boundDepthTexture!==R.depthTexture){const pe=R.depthTexture;if(M.__depthDisposeCallback&&M.__depthDisposeCallback(),pe){const me=()=>{delete M.__boundDepthTexture,delete M.__depthDisposeCallback,pe.removeEventListener("dispose",me)};pe.addEventListener("dispose",me),M.__depthDisposeCallback=me}M.__boundDepthTexture=pe}if(R.depthTexture&&!M.__autoAllocateDepthBuffer){if(Y)throw new Error("target.depthTexture not supported in Cube render targets");Fe(M.__webglFramebuffer,R)}else if(Y){M.__webglDepthbuffer=[];for(let pe=0;pe<6;pe++)if(t.bindFramebuffer(i.FRAMEBUFFER,M.__webglFramebuffer[pe]),M.__webglDepthbuffer[pe]===void 0)M.__webglDepthbuffer[pe]=i.createRenderbuffer(),_e(M.__webglDepthbuffer[pe],R,!1);else{const me=R.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT,ue=M.__webglDepthbuffer[pe];i.bindRenderbuffer(i.RENDERBUFFER,ue),i.framebufferRenderbuffer(i.FRAMEBUFFER,me,i.RENDERBUFFER,ue)}}else if(t.bindFramebuffer(i.FRAMEBUFFER,M.__webglFramebuffer),M.__webglDepthbuffer===void 0)M.__webglDepthbuffer=i.createRenderbuffer(),_e(M.__webglDepthbuffer,R,!1);else{const pe=R.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT,me=M.__webglDepthbuffer;i.bindRenderbuffer(i.RENDERBUFFER,me),i.framebufferRenderbuffer(i.FRAMEBUFFER,pe,i.RENDERBUFFER,me)}t.bindFramebuffer(i.FRAMEBUFFER,null)}function nt(R,M,Y){const pe=n.get(R);M!==void 0&&Me(pe.__webglFramebuffer,R,R.texture,i.COLOR_ATTACHMENT0,i.TEXTURE_2D,0),Y!==void 0&&$e(R)}function Tt(R){const M=R.texture,Y=n.get(R),pe=n.get(M);R.addEventListener("dispose",C);const me=R.textures,ue=R.isWebGLCubeRenderTarget===!0,Ye=me.length>1;if(Ye||(pe.__webglTexture===void 0&&(pe.__webglTexture=i.createTexture()),pe.__version=M.version,o.memory.textures++),ue){Y.__webglFramebuffer=[];for(let Re=0;Re<6;Re++)if(M.mipmaps&&M.mipmaps.length>0){Y.__webglFramebuffer[Re]=[];for(let Oe=0;Oe<M.mipmaps.length;Oe++)Y.__webglFramebuffer[Re][Oe]=i.createFramebuffer()}else Y.__webglFramebuffer[Re]=i.createFramebuffer()}else{if(M.mipmaps&&M.mipmaps.length>0){Y.__webglFramebuffer=[];for(let Re=0;Re<M.mipmaps.length;Re++)Y.__webglFramebuffer[Re]=i.createFramebuffer()}else Y.__webglFramebuffer=i.createFramebuffer();if(Ye)for(let Re=0,Oe=me.length;Re<Oe;Re++){const Rt=n.get(me[Re]);Rt.__webglTexture===void 0&&(Rt.__webglTexture=i.createTexture(),o.memory.textures++)}if(R.samples>0&&dt(R)===!1){Y.__webglMultisampledFramebuffer=i.createFramebuffer(),Y.__webglColorRenderbuffer=[],t.bindFramebuffer(i.FRAMEBUFFER,Y.__webglMultisampledFramebuffer);for(let Re=0;Re<me.length;Re++){const Oe=me[Re];Y.__webglColorRenderbuffer[Re]=i.createRenderbuffer(),i.bindRenderbuffer(i.RENDERBUFFER,Y.__webglColorRenderbuffer[Re]);const Rt=s.convert(Oe.format,Oe.colorSpace),Se=s.convert(Oe.type),ke=x(Oe.internalFormat,Rt,Se,Oe.colorSpace,R.isXRRenderTarget===!0),Ze=_t(R);i.renderbufferStorageMultisample(i.RENDERBUFFER,Ze,ke,R.width,R.height),i.framebufferRenderbuffer(i.FRAMEBUFFER,i.COLOR_ATTACHMENT0+Re,i.RENDERBUFFER,Y.__webglColorRenderbuffer[Re])}i.bindRenderbuffer(i.RENDERBUFFER,null),R.depthBuffer&&(Y.__webglDepthRenderbuffer=i.createRenderbuffer(),_e(Y.__webglDepthRenderbuffer,R,!0)),t.bindFramebuffer(i.FRAMEBUFFER,null)}}if(ue){t.bindTexture(i.TEXTURE_CUBE_MAP,pe.__webglTexture),he(i.TEXTURE_CUBE_MAP,M);for(let Re=0;Re<6;Re++)if(M.mipmaps&&M.mipmaps.length>0)for(let Oe=0;Oe<M.mipmaps.length;Oe++)Me(Y.__webglFramebuffer[Re][Oe],R,M,i.COLOR_ATTACHMENT0,i.TEXTURE_CUBE_MAP_POSITIVE_X+Re,Oe);else Me(Y.__webglFramebuffer[Re],R,M,i.COLOR_ATTACHMENT0,i.TEXTURE_CUBE_MAP_POSITIVE_X+Re,0);m(M)&&f(i.TEXTURE_CUBE_MAP),t.unbindTexture()}else if(Ye){for(let Re=0,Oe=me.length;Re<Oe;Re++){const Rt=me[Re],Se=n.get(Rt);t.bindTexture(i.TEXTURE_2D,Se.__webglTexture),he(i.TEXTURE_2D,Rt),Me(Y.__webglFramebuffer,R,Rt,i.COLOR_ATTACHMENT0+Re,i.TEXTURE_2D,0),m(Rt)&&f(i.TEXTURE_2D)}t.unbindTexture()}else{let Re=i.TEXTURE_2D;if((R.isWebGL3DRenderTarget||R.isWebGLArrayRenderTarget)&&(Re=R.isWebGL3DRenderTarget?i.TEXTURE_3D:i.TEXTURE_2D_ARRAY),t.bindTexture(Re,pe.__webglTexture),he(Re,M),M.mipmaps&&M.mipmaps.length>0)for(let Oe=0;Oe<M.mipmaps.length;Oe++)Me(Y.__webglFramebuffer[Oe],R,M,i.COLOR_ATTACHMENT0,Re,Oe);else Me(Y.__webglFramebuffer,R,M,i.COLOR_ATTACHMENT0,Re,0);m(M)&&f(Re),t.unbindTexture()}R.depthBuffer&&$e(R)}function Ke(R){const M=R.textures;for(let Y=0,pe=M.length;Y<pe;Y++){const me=M[Y];if(m(me)){const ue=y(R),Ye=n.get(me).__webglTexture;t.bindTexture(ue,Ye),f(ue),t.unbindTexture()}}}const ct=[],N=[];function Kt(R){if(R.samples>0){if(dt(R)===!1){const M=R.textures,Y=R.width,pe=R.height;let me=i.COLOR_BUFFER_BIT;const ue=R.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT,Ye=n.get(R),Re=M.length>1;if(Re)for(let Oe=0;Oe<M.length;Oe++)t.bindFramebuffer(i.FRAMEBUFFER,Ye.__webglMultisampledFramebuffer),i.framebufferRenderbuffer(i.FRAMEBUFFER,i.COLOR_ATTACHMENT0+Oe,i.RENDERBUFFER,null),t.bindFramebuffer(i.FRAMEBUFFER,Ye.__webglFramebuffer),i.framebufferTexture2D(i.DRAW_FRAMEBUFFER,i.COLOR_ATTACHMENT0+Oe,i.TEXTURE_2D,null,0);t.bindFramebuffer(i.READ_FRAMEBUFFER,Ye.__webglMultisampledFramebuffer),t.bindFramebuffer(i.DRAW_FRAMEBUFFER,Ye.__webglFramebuffer);for(let Oe=0;Oe<M.length;Oe++){if(R.resolveDepthBuffer&&(R.depthBuffer&&(me|=i.DEPTH_BUFFER_BIT),R.stencilBuffer&&R.resolveStencilBuffer&&(me|=i.STENCIL_BUFFER_BIT)),Re){i.framebufferRenderbuffer(i.READ_FRAMEBUFFER,i.COLOR_ATTACHMENT0,i.RENDERBUFFER,Ye.__webglColorRenderbuffer[Oe]);const Rt=n.get(M[Oe]).__webglTexture;i.framebufferTexture2D(i.DRAW_FRAMEBUFFER,i.COLOR_ATTACHMENT0,i.TEXTURE_2D,Rt,0)}i.blitFramebuffer(0,0,Y,pe,0,0,Y,pe,me,i.NEAREST),c===!0&&(ct.length=0,N.length=0,ct.push(i.COLOR_ATTACHMENT0+Oe),R.depthBuffer&&R.resolveDepthBuffer===!1&&(ct.push(ue),N.push(ue),i.invalidateFramebuffer(i.DRAW_FRAMEBUFFER,N)),i.invalidateFramebuffer(i.READ_FRAMEBUFFER,ct))}if(t.bindFramebuffer(i.READ_FRAMEBUFFER,null),t.bindFramebuffer(i.DRAW_FRAMEBUFFER,null),Re)for(let Oe=0;Oe<M.length;Oe++){t.bindFramebuffer(i.FRAMEBUFFER,Ye.__webglMultisampledFramebuffer),i.framebufferRenderbuffer(i.FRAMEBUFFER,i.COLOR_ATTACHMENT0+Oe,i.RENDERBUFFER,Ye.__webglColorRenderbuffer[Oe]);const Rt=n.get(M[Oe]).__webglTexture;t.bindFramebuffer(i.FRAMEBUFFER,Ye.__webglFramebuffer),i.framebufferTexture2D(i.DRAW_FRAMEBUFFER,i.COLOR_ATTACHMENT0+Oe,i.TEXTURE_2D,Rt,0)}t.bindFramebuffer(i.DRAW_FRAMEBUFFER,Ye.__webglMultisampledFramebuffer)}else if(R.depthBuffer&&R.resolveDepthBuffer===!1&&c){const M=R.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT;i.invalidateFramebuffer(i.DRAW_FRAMEBUFFER,[M])}}}function _t(R){return Math.min(r.maxSamples,R.samples)}function dt(R){const M=n.get(R);return R.samples>0&&e.has("WEBGL_multisampled_render_to_texture")===!0&&M.__useRenderToTexture!==!1}function De(R){const M=o.render.frame;h.get(R)!==M&&(h.set(R,M),R.update())}function Ut(R,M){const Y=R.colorSpace,pe=R.format,me=R.type;return R.isCompressedTexture===!0||R.isVideoTexture===!0||Y!==Pn&&Y!==ir&&(Ct.getTransfer(Y)===qt?(pe!==Zn||me!==Wi)&&console.warn("THREE.WebGLTextures: sRGB encoded textures have to use RGBAFormat and UnsignedByteType."):console.error("THREE.WebGLTextures: Unsupported texture color space:",Y)),M}function tt(R){return typeof HTMLImageElement<"u"&&R instanceof HTMLImageElement?(l.width=R.naturalWidth||R.width,l.height=R.naturalHeight||R.height):typeof VideoFrame<"u"&&R instanceof VideoFrame?(l.width=R.displayWidth,l.height=R.displayHeight):(l.width=R.width,l.height=R.height),l}this.allocateTextureUnit=q,this.resetTextureUnits=j,this.setTexture2D=ne,this.setTexture2DArray=$,this.setTexture3D=ce,this.setTextureCube=P,this.rebindTextures=nt,this.setupRenderTarget=Tt,this.updateRenderTargetMipmap=Ke,this.updateMultisampleRenderTarget=Kt,this.setupDepthRenderbuffer=$e,this.setupFrameBufferTexture=Me,this.useMultisampledRTT=dt}function I_(i,e){function t(n,r=ir){let s;const o=Ct.getTransfer(r);if(n===Wi)return i.UNSIGNED_BYTE;if(n===Ol)return i.UNSIGNED_SHORT_4_4_4_4;if(n===kl)return i.UNSIGNED_SHORT_5_5_5_1;if(n===ad)return i.UNSIGNED_INT_5_9_9_9_REV;if(n===sd)return i.BYTE;if(n===od)return i.SHORT;if(n===no)return i.UNSIGNED_SHORT;if(n===Fl)return i.INT;if(n===Lr)return i.UNSIGNED_INT;if(n===ai)return i.FLOAT;if(n===co)return i.HALF_FLOAT;if(n===cd)return i.ALPHA;if(n===ld)return i.RGB;if(n===Zn)return i.RGBA;if(n===hd)return i.LUMINANCE;if(n===ud)return i.LUMINANCE_ALPHA;if(n===as)return i.DEPTH_COMPONENT;if(n===vs)return i.DEPTH_STENCIL;if(n===Bl)return i.RED;if(n===zl)return i.RED_INTEGER;if(n===dd)return i.RG;if(n===Hl)return i.RG_INTEGER;if(n===Vl)return i.RGBA_INTEGER;if(n===ta||n===na||n===ia||n===ra)if(o===qt)if(s=e.get("WEBGL_compressed_texture_s3tc_srgb"),s!==null){if(n===ta)return s.COMPRESSED_SRGB_S3TC_DXT1_EXT;if(n===na)return s.COMPRESSED_SRGB_ALPHA_S3TC_DXT1_EXT;if(n===ia)return s.COMPRESSED_SRGB_ALPHA_S3TC_DXT3_EXT;if(n===ra)return s.COMPRESSED_SRGB_ALPHA_S3TC_DXT5_EXT}else return null;else if(s=e.get("WEBGL_compressed_texture_s3tc"),s!==null){if(n===ta)return s.COMPRESSED_RGB_S3TC_DXT1_EXT;if(n===na)return s.COMPRESSED_RGBA_S3TC_DXT1_EXT;if(n===ia)return s.COMPRESSED_RGBA_S3TC_DXT3_EXT;if(n===ra)return s.COMPRESSED_RGBA_S3TC_DXT5_EXT}else return null;if(n===Wc||n===qc||n===jc||n===Xc)if(s=e.get("WEBGL_compressed_texture_pvrtc"),s!==null){if(n===Wc)return s.COMPRESSED_RGB_PVRTC_4BPPV1_IMG;if(n===qc)return s.COMPRESSED_RGB_PVRTC_2BPPV1_IMG;if(n===jc)return s.COMPRESSED_RGBA_PVRTC_4BPPV1_IMG;if(n===Xc)return s.COMPRESSED_RGBA_PVRTC_2BPPV1_IMG}else return null;if(n===Qc||n===Kc||n===Yc)if(s=e.get("WEBGL_compressed_texture_etc"),s!==null){if(n===Qc||n===Kc)return o===qt?s.COMPRESSED_SRGB8_ETC2:s.COMPRESSED_RGB8_ETC2;if(n===Yc)return o===qt?s.COMPRESSED_SRGB8_ALPHA8_ETC2_EAC:s.COMPRESSED_RGBA8_ETC2_EAC}else return null;if(n===$c||n===Zc||n===Jc||n===el||n===tl||n===nl||n===il||n===rl||n===sl||n===ol||n===al||n===cl||n===ll||n===hl)if(s=e.get("WEBGL_compressed_texture_astc"),s!==null){if(n===$c)return o===qt?s.COMPRESSED_SRGB8_ALPHA8_ASTC_4x4_KHR:s.COMPRESSED_RGBA_ASTC_4x4_KHR;if(n===Zc)return o===qt?s.COMPRESSED_SRGB8_ALPHA8_ASTC_5x4_KHR:s.COMPRESSED_RGBA_ASTC_5x4_KHR;if(n===Jc)return o===qt?s.COMPRESSED_SRGB8_ALPHA8_ASTC_5x5_KHR:s.COMPRESSED_RGBA_ASTC_5x5_KHR;if(n===el)return o===qt?s.COMPRESSED_SRGB8_ALPHA8_ASTC_6x5_KHR:s.COMPRESSED_RGBA_ASTC_6x5_KHR;if(n===tl)return o===qt?s.COMPRESSED_SRGB8_ALPHA8_ASTC_6x6_KHR:s.COMPRESSED_RGBA_ASTC_6x6_KHR;if(n===nl)return o===qt?s.COMPRESSED_SRGB8_ALPHA8_ASTC_8x5_KHR:s.COMPRESSED_RGBA_ASTC_8x5_KHR;if(n===il)return o===qt?s.COMPRESSED_SRGB8_ALPHA8_ASTC_8x6_KHR:s.COMPRESSED_RGBA_ASTC_8x6_KHR;if(n===rl)return o===qt?s.COMPRESSED_SRGB8_ALPHA8_ASTC_8x8_KHR:s.COMPRESSED_RGBA_ASTC_8x8_KHR;if(n===sl)return o===qt?s.COMPRESSED_SRGB8_ALPHA8_ASTC_10x5_KHR:s.COMPRESSED_RGBA_ASTC_10x5_KHR;if(n===ol)return o===qt?s.COMPRESSED_SRGB8_ALPHA8_ASTC_10x6_KHR:s.COMPRESSED_RGBA_ASTC_10x6_KHR;if(n===al)return o===qt?s.COMPRESSED_SRGB8_ALPHA8_ASTC_10x8_KHR:s.COMPRESSED_RGBA_ASTC_10x8_KHR;if(n===cl)return o===qt?s.COMPRESSED_SRGB8_ALPHA8_ASTC_10x10_KHR:s.COMPRESSED_RGBA_ASTC_10x10_KHR;if(n===ll)return o===qt?s.COMPRESSED_SRGB8_ALPHA8_ASTC_12x10_KHR:s.COMPRESSED_RGBA_ASTC_12x10_KHR;if(n===hl)return o===qt?s.COMPRESSED_SRGB8_ALPHA8_ASTC_12x12_KHR:s.COMPRESSED_RGBA_ASTC_12x12_KHR}else return null;if(n===sa||n===ul||n===dl)if(s=e.get("EXT_texture_compression_bptc"),s!==null){if(n===sa)return o===qt?s.COMPRESSED_SRGB_ALPHA_BPTC_UNORM_EXT:s.COMPRESSED_RGBA_BPTC_UNORM_EXT;if(n===ul)return s.COMPRESSED_RGB_BPTC_SIGNED_FLOAT_EXT;if(n===dl)return s.COMPRESSED_RGB_BPTC_UNSIGNED_FLOAT_EXT}else return null;if(n===fd||n===fl||n===pl||n===ml)if(s=e.get("EXT_texture_compression_rgtc"),s!==null){if(n===sa)return s.COMPRESSED_RED_RGTC1_EXT;if(n===fl)return s.COMPRESSED_SIGNED_RED_RGTC1_EXT;if(n===pl)return s.COMPRESSED_RED_GREEN_RGTC2_EXT;if(n===ml)return s.COMPRESSED_SIGNED_RED_GREEN_RGTC2_EXT}else return null;return n===xs?i.UNSIGNED_INT_24_8:i[n]!==void 0?i[n]:null}return{convert:t}}class N_ extends vn{constructor(e=[]){super(),this.isArrayCamera=!0,this.cameras=e}}class Cr extends en{constructor(){super(),this.isGroup=!0,this.type="Group"}}const U_={type:"move"};class uc{constructor(){this._targetRay=null,this._grip=null,this._hand=null}getHandSpace(){return this._hand===null&&(this._hand=new Cr,this._hand.matrixAutoUpdate=!1,this._hand.visible=!1,this._hand.joints={},this._hand.inputState={pinching:!1}),this._hand}getTargetRaySpace(){return this._targetRay===null&&(this._targetRay=new Cr,this._targetRay.matrixAutoUpdate=!1,this._targetRay.visible=!1,this._targetRay.hasLinearVelocity=!1,this._targetRay.linearVelocity=new A,this._targetRay.hasAngularVelocity=!1,this._targetRay.angularVelocity=new A),this._targetRay}getGripSpace(){return this._grip===null&&(this._grip=new Cr,this._grip.matrixAutoUpdate=!1,this._grip.visible=!1,this._grip.hasLinearVelocity=!1,this._grip.linearVelocity=new A,this._grip.hasAngularVelocity=!1,this._grip.angularVelocity=new A),this._grip}dispatchEvent(e){return this._targetRay!==null&&this._targetRay.dispatchEvent(e),this._grip!==null&&this._grip.dispatchEvent(e),this._hand!==null&&this._hand.dispatchEvent(e),this}connect(e){if(e&&e.hand){const t=this._hand;if(t)for(const n of e.hand.values())this._getHandJoint(t,n)}return this.dispatchEvent({type:"connected",data:e}),this}disconnect(e){return this.dispatchEvent({type:"disconnected",data:e}),this._targetRay!==null&&(this._targetRay.visible=!1),this._grip!==null&&(this._grip.visible=!1),this._hand!==null&&(this._hand.visible=!1),this}update(e,t,n){let r=null,s=null,o=null;const a=this._targetRay,c=this._grip,l=this._hand;if(e&&t.session.visibilityState!=="visible-blurred"){if(l&&e.hand){o=!0;for(const b of e.hand.values()){const m=t.getJointPose(b,n),f=this._getHandJoint(l,b);m!==null&&(f.matrix.fromArray(m.transform.matrix),f.matrix.decompose(f.position,f.rotation,f.scale),f.matrixWorldNeedsUpdate=!0,f.jointRadius=m.radius),f.visible=m!==null}const h=l.joints["index-finger-tip"],u=l.joints["thumb-tip"],d=h.position.distanceTo(u.position),p=.02,g=.005;l.inputState.pinching&&d>p+g?(l.inputState.pinching=!1,this.dispatchEvent({type:"pinchend",handedness:e.handedness,target:this})):!l.inputState.pinching&&d<=p-g&&(l.inputState.pinching=!0,this.dispatchEvent({type:"pinchstart",handedness:e.handedness,target:this}))}else c!==null&&e.gripSpace&&(s=t.getPose(e.gripSpace,n),s!==null&&(c.matrix.fromArray(s.transform.matrix),c.matrix.decompose(c.position,c.rotation,c.scale),c.matrixWorldNeedsUpdate=!0,s.linearVelocity?(c.hasLinearVelocity=!0,c.linearVelocity.copy(s.linearVelocity)):c.hasLinearVelocity=!1,s.angularVelocity?(c.hasAngularVelocity=!0,c.angularVelocity.copy(s.angularVelocity)):c.hasAngularVelocity=!1));a!==null&&(r=t.getPose(e.targetRaySpace,n),r===null&&s!==null&&(r=s),r!==null&&(a.matrix.fromArray(r.transform.matrix),a.matrix.decompose(a.position,a.rotation,a.scale),a.matrixWorldNeedsUpdate=!0,r.linearVelocity?(a.hasLinearVelocity=!0,a.linearVelocity.copy(r.linearVelocity)):a.hasLinearVelocity=!1,r.angularVelocity?(a.hasAngularVelocity=!0,a.angularVelocity.copy(r.angularVelocity)):a.hasAngularVelocity=!1,this.dispatchEvent(U_)))}return a!==null&&(a.visible=r!==null),c!==null&&(c.visible=s!==null),l!==null&&(l.visible=o!==null),this}_getHandJoint(e,t){if(e.joints[t.jointName]===void 0){const n=new Cr;n.matrixAutoUpdate=!1,n.visible=!1,e.joints[t.jointName]=n,e.add(n)}return e.joints[t.jointName]}}const F_=`
void main() {

	gl_Position = vec4( position, 1.0 );

}`,O_=`
uniform sampler2DArray depthColor;
uniform float depthWidth;
uniform float depthHeight;

void main() {

	vec2 coord = vec2( gl_FragCoord.x / depthWidth, gl_FragCoord.y / depthHeight );

	if ( coord.x >= 1.0 ) {

		gl_FragDepth = texture( depthColor, vec3( coord.x - 1.0, coord.y, 1 ) ).r;

	} else {

		gl_FragDepth = texture( depthColor, vec3( coord.x, coord.y, 0 ) ).r;

	}

}`;class k_{constructor(){this.texture=null,this.mesh=null,this.depthNear=0,this.depthFar=0}init(e,t,n){if(this.texture===null){const r=new hn,s=e.properties.get(r);s.__webglTexture=t.texture,(t.depthNear!=n.depthNear||t.depthFar!=n.depthFar)&&(this.depthNear=t.depthNear,this.depthFar=t.depthFar),this.texture=r}}getMesh(e){if(this.texture!==null&&this.mesh===null){const t=e.cameras[0].viewport,n=new hr({vertexShader:F_,fragmentShader:O_,uniforms:{depthColor:{value:this.texture},depthWidth:{value:t.z},depthHeight:{value:t.w}}});this.mesh=new jt(new Cs(20,20),n)}return this.mesh}reset(){this.texture=null,this.mesh=null}getDepthTexture(){return this.texture}}class B_ extends Ur{constructor(e,t){super();const n=this;let r=null,s=1,o=null,a="local-floor",c=1,l=null,h=null,u=null,d=null,p=null,g=null;const b=new k_,m=t.getContextAttributes();let f=null,y=null;const x=[],_=[],I=new at;let L=null;const C=new vn;C.viewport=new vt;const F=new vn;F.viewport=new vt;const w=[C,F],v=new N_;let T=null,j=null;this.cameraAutoUpdate=!0,this.enabled=!1,this.isPresenting=!1,this.getController=function(J){let fe=x[J];return fe===void 0&&(fe=new uc,x[J]=fe),fe.getTargetRaySpace()},this.getControllerGrip=function(J){let fe=x[J];return fe===void 0&&(fe=new uc,x[J]=fe),fe.getGripSpace()},this.getHand=function(J){let fe=x[J];return fe===void 0&&(fe=new uc,x[J]=fe),fe.getHandSpace()};function q(J){const fe=_.indexOf(J.inputSource);if(fe===-1)return;const Me=x[fe];Me!==void 0&&(Me.update(J.inputSource,J.frame,l||o),Me.dispatchEvent({type:J.type,data:J.inputSource}))}function se(){r.removeEventListener("select",q),r.removeEventListener("selectstart",q),r.removeEventListener("selectend",q),r.removeEventListener("squeeze",q),r.removeEventListener("squeezestart",q),r.removeEventListener("squeezeend",q),r.removeEventListener("end",se),r.removeEventListener("inputsourceschange",ne);for(let J=0;J<x.length;J++){const fe=_[J];fe!==null&&(_[J]=null,x[J].disconnect(fe))}T=null,j=null,b.reset(),e.setRenderTarget(f),p=null,d=null,u=null,r=null,y=null,ye.stop(),n.isPresenting=!1,e.setPixelRatio(L),e.setSize(I.width,I.height,!1),n.dispatchEvent({type:"sessionend"})}this.setFramebufferScaleFactor=function(J){s=J,n.isPresenting===!0&&console.warn("THREE.WebXRManager: Cannot change framebuffer scale while presenting.")},this.setReferenceSpaceType=function(J){a=J,n.isPresenting===!0&&console.warn("THREE.WebXRManager: Cannot change reference space type while presenting.")},this.getReferenceSpace=function(){return l||o},this.setReferenceSpace=function(J){l=J},this.getBaseLayer=function(){return d!==null?d:p},this.getBinding=function(){return u},this.getFrame=function(){return g},this.getSession=function(){return r},this.setSession=async function(J){if(r=J,r!==null){if(f=e.getRenderTarget(),r.addEventListener("select",q),r.addEventListener("selectstart",q),r.addEventListener("selectend",q),r.addEventListener("squeeze",q),r.addEventListener("squeezestart",q),r.addEventListener("squeezeend",q),r.addEventListener("end",se),r.addEventListener("inputsourceschange",ne),m.xrCompatible!==!0&&await t.makeXRCompatible(),L=e.getPixelRatio(),e.getSize(I),r.renderState.layers===void 0){const fe={antialias:m.antialias,alpha:!0,depth:m.depth,stencil:m.stencil,framebufferScaleFactor:s};p=new XRWebGLLayer(r,t,fe),r.updateRenderState({baseLayer:p}),e.setPixelRatio(1),e.setSize(p.framebufferWidth,p.framebufferHeight,!1),y=new Dr(p.framebufferWidth,p.framebufferHeight,{format:Zn,type:Wi,colorSpace:e.outputColorSpace,stencilBuffer:m.stencil})}else{let fe=null,Me=null,_e=null;m.depth&&(_e=m.stencil?t.DEPTH24_STENCIL8:t.DEPTH_COMPONENT24,fe=m.stencil?vs:as,Me=m.stencil?xs:Lr);const Fe={colorFormat:t.RGBA8,depthFormat:_e,scaleFactor:s};u=new XRWebGLBinding(r,t),d=u.createProjectionLayer(Fe),r.updateRenderState({layers:[d]}),e.setPixelRatio(1),e.setSize(d.textureWidth,d.textureHeight,!1),y=new Dr(d.textureWidth,d.textureHeight,{format:Zn,type:Wi,depthTexture:new Td(d.textureWidth,d.textureHeight,Me,void 0,void 0,void 0,void 0,void 0,void 0,fe),stencilBuffer:m.stencil,colorSpace:e.outputColorSpace,samples:m.antialias?4:0,resolveDepthBuffer:d.ignoreDepthValues===!1})}y.isXRRenderTarget=!0,this.setFoveation(c),l=null,o=await r.requestReferenceSpace(a),ye.setContext(r),ye.start(),n.isPresenting=!0,n.dispatchEvent({type:"sessionstart"})}},this.getEnvironmentBlendMode=function(){if(r!==null)return r.environmentBlendMode},this.getDepthTexture=function(){return b.getDepthTexture()};function ne(J){for(let fe=0;fe<J.removed.length;fe++){const Me=J.removed[fe],_e=_.indexOf(Me);_e>=0&&(_[_e]=null,x[_e].disconnect(Me))}for(let fe=0;fe<J.added.length;fe++){const Me=J.added[fe];let _e=_.indexOf(Me);if(_e===-1){for(let $e=0;$e<x.length;$e++)if($e>=_.length){_.push(Me),_e=$e;break}else if(_[$e]===null){_[$e]=Me,_e=$e;break}if(_e===-1)break}const Fe=x[_e];Fe&&Fe.connect(Me)}}const $=new A,ce=new A;function P(J,fe,Me){$.setFromMatrixPosition(fe.matrixWorld),ce.setFromMatrixPosition(Me.matrixWorld);const _e=$.distanceTo(ce),Fe=fe.projectionMatrix.elements,$e=Me.projectionMatrix.elements,nt=Fe[14]/(Fe[10]-1),Tt=Fe[14]/(Fe[10]+1),Ke=(Fe[9]+1)/Fe[5],ct=(Fe[9]-1)/Fe[5],N=(Fe[8]-1)/Fe[0],Kt=($e[8]+1)/$e[0],_t=nt*N,dt=nt*Kt,De=_e/(-N+Kt),Ut=De*-N;if(fe.matrixWorld.decompose(J.position,J.quaternion,J.scale),J.translateX(Ut),J.translateZ(De),J.matrixWorld.compose(J.position,J.quaternion,J.scale),J.matrixWorldInverse.copy(J.matrixWorld).invert(),Fe[10]===-1)J.projectionMatrix.copy(fe.projectionMatrix),J.projectionMatrixInverse.copy(fe.projectionMatrixInverse);else{const tt=nt+De,R=Tt+De,M=_t-Ut,Y=dt+(_e-Ut),pe=Ke*Tt/R*tt,me=ct*Tt/R*tt;J.projectionMatrix.makePerspective(M,Y,pe,me,tt,R),J.projectionMatrixInverse.copy(J.projectionMatrix).invert()}}function k(J,fe){fe===null?J.matrixWorld.copy(J.matrix):J.matrixWorld.multiplyMatrices(fe.matrixWorld,J.matrix),J.matrixWorldInverse.copy(J.matrixWorld).invert()}this.updateCamera=function(J){if(r===null)return;let fe=J.near,Me=J.far;b.texture!==null&&(b.depthNear>0&&(fe=b.depthNear),b.depthFar>0&&(Me=b.depthFar)),v.near=F.near=C.near=fe,v.far=F.far=C.far=Me,(T!==v.near||j!==v.far)&&(r.updateRenderState({depthNear:v.near,depthFar:v.far}),T=v.near,j=v.far),C.layers.mask=J.layers.mask|2,F.layers.mask=J.layers.mask|4,v.layers.mask=C.layers.mask|F.layers.mask;const _e=J.parent,Fe=v.cameras;k(v,_e);for(let $e=0;$e<Fe.length;$e++)k(Fe[$e],_e);Fe.length===2?P(v,C,F):v.projectionMatrix.copy(C.projectionMatrix),W(J,v,_e)};function W(J,fe,Me){Me===null?J.matrix.copy(fe.matrixWorld):(J.matrix.copy(Me.matrixWorld),J.matrix.invert(),J.matrix.multiply(fe.matrixWorld)),J.matrix.decompose(J.position,J.quaternion,J.scale),J.updateMatrixWorld(!0),J.projectionMatrix.copy(fe.projectionMatrix),J.projectionMatrixInverse.copy(fe.projectionMatrixInverse),J.isPerspectiveCamera&&(J.fov=ys*2*Math.atan(1/J.projectionMatrix.elements[5]),J.zoom=1)}this.getCamera=function(){return v},this.getFoveation=function(){if(!(d===null&&p===null))return c},this.setFoveation=function(J){c=J,d!==null&&(d.fixedFoveation=J),p!==null&&p.fixedFoveation!==void 0&&(p.fixedFoveation=J)},this.hasDepthSensing=function(){return b.texture!==null},this.getDepthSensingMesh=function(){return b.getMesh(v)};let re=null;function he(J,fe){if(h=fe.getViewerPose(l||o),g=fe,h!==null){const Me=h.views;p!==null&&(e.setRenderTargetFramebuffer(y,p.framebuffer),e.setRenderTarget(y));let _e=!1;Me.length!==v.cameras.length&&(v.cameras.length=0,_e=!0);for(let $e=0;$e<Me.length;$e++){const nt=Me[$e];let Tt=null;if(p!==null)Tt=p.getViewport(nt);else{const ct=u.getViewSubImage(d,nt);Tt=ct.viewport,$e===0&&(e.setRenderTargetTextures(y,ct.colorTexture,d.ignoreDepthValues?void 0:ct.depthStencilTexture),e.setRenderTarget(y))}let Ke=w[$e];Ke===void 0&&(Ke=new vn,Ke.layers.enable($e),Ke.viewport=new vt,w[$e]=Ke),Ke.matrix.fromArray(nt.transform.matrix),Ke.matrix.decompose(Ke.position,Ke.quaternion,Ke.scale),Ke.projectionMatrix.fromArray(nt.projectionMatrix),Ke.projectionMatrixInverse.copy(Ke.projectionMatrix).invert(),Ke.viewport.set(Tt.x,Tt.y,Tt.width,Tt.height),$e===0&&(v.matrix.copy(Ke.matrix),v.matrix.decompose(v.position,v.quaternion,v.scale)),_e===!0&&v.cameras.push(Ke)}const Fe=r.enabledFeatures;if(Fe&&Fe.includes("depth-sensing")){const $e=u.getDepthInformation(Me[0]);$e&&$e.isValid&&$e.texture&&b.init(e,$e,r.renderState)}}for(let Me=0;Me<x.length;Me++){const _e=_[Me],Fe=x[Me];_e!==null&&Fe!==void 0&&Fe.update(_e,fe,l||o)}re&&re(J,fe),fe.detectedPlanes&&n.dispatchEvent({type:"planesdetected",data:fe}),g=null}const ye=new Ad;ye.setAnimationLoop(he),this.setAnimationLoop=function(J){re=J},this.dispose=function(){}}}const yr=new _i,z_=new rt;function H_(i,e){function t(m,f){m.matrixAutoUpdate===!0&&m.updateMatrix(),f.value.copy(m.matrix)}function n(m,f){f.color.getRGB(m.fogColor.value,Sd(i)),f.isFog?(m.fogNear.value=f.near,m.fogFar.value=f.far):f.isFogExp2&&(m.fogDensity.value=f.density)}function r(m,f,y,x,_){f.isMeshBasicMaterial||f.isMeshLambertMaterial?s(m,f):f.isMeshToonMaterial?(s(m,f),u(m,f)):f.isMeshPhongMaterial?(s(m,f),h(m,f)):f.isMeshStandardMaterial?(s(m,f),d(m,f),f.isMeshPhysicalMaterial&&p(m,f,_)):f.isMeshMatcapMaterial?(s(m,f),g(m,f)):f.isMeshDepthMaterial?s(m,f):f.isMeshDistanceMaterial?(s(m,f),b(m,f)):f.isMeshNormalMaterial?s(m,f):f.isLineBasicMaterial?(o(m,f),f.isLineDashedMaterial&&a(m,f)):f.isPointsMaterial?c(m,f,y,x):f.isSpriteMaterial?l(m,f):f.isShadowMaterial?(m.color.value.copy(f.color),m.opacity.value=f.opacity):f.isShaderMaterial&&(f.uniformsNeedUpdate=!1)}function s(m,f){m.opacity.value=f.opacity,f.color&&m.diffuse.value.copy(f.color),f.emissive&&m.emissive.value.copy(f.emissive).multiplyScalar(f.emissiveIntensity),f.map&&(m.map.value=f.map,t(f.map,m.mapTransform)),f.alphaMap&&(m.alphaMap.value=f.alphaMap,t(f.alphaMap,m.alphaMapTransform)),f.bumpMap&&(m.bumpMap.value=f.bumpMap,t(f.bumpMap,m.bumpMapTransform),m.bumpScale.value=f.bumpScale,f.side===Rn&&(m.bumpScale.value*=-1)),f.normalMap&&(m.normalMap.value=f.normalMap,t(f.normalMap,m.normalMapTransform),m.normalScale.value.copy(f.normalScale),f.side===Rn&&m.normalScale.value.negate()),f.displacementMap&&(m.displacementMap.value=f.displacementMap,t(f.displacementMap,m.displacementMapTransform),m.displacementScale.value=f.displacementScale,m.displacementBias.value=f.displacementBias),f.emissiveMap&&(m.emissiveMap.value=f.emissiveMap,t(f.emissiveMap,m.emissiveMapTransform)),f.specularMap&&(m.specularMap.value=f.specularMap,t(f.specularMap,m.specularMapTransform)),f.alphaTest>0&&(m.alphaTest.value=f.alphaTest);const y=e.get(f),x=y.envMap,_=y.envMapRotation;x&&(m.envMap.value=x,yr.copy(_),yr.x*=-1,yr.y*=-1,yr.z*=-1,x.isCubeTexture&&x.isRenderTargetTexture===!1&&(yr.y*=-1,yr.z*=-1),m.envMapRotation.value.setFromMatrix4(z_.makeRotationFromEuler(yr)),m.flipEnvMap.value=x.isCubeTexture&&x.isRenderTargetTexture===!1?-1:1,m.reflectivity.value=f.reflectivity,m.ior.value=f.ior,m.refractionRatio.value=f.refractionRatio),f.lightMap&&(m.lightMap.value=f.lightMap,m.lightMapIntensity.value=f.lightMapIntensity,t(f.lightMap,m.lightMapTransform)),f.aoMap&&(m.aoMap.value=f.aoMap,m.aoMapIntensity.value=f.aoMapIntensity,t(f.aoMap,m.aoMapTransform))}function o(m,f){m.diffuse.value.copy(f.color),m.opacity.value=f.opacity,f.map&&(m.map.value=f.map,t(f.map,m.mapTransform))}function a(m,f){m.dashSize.value=f.dashSize,m.totalSize.value=f.dashSize+f.gapSize,m.scale.value=f.scale}function c(m,f,y,x){m.diffuse.value.copy(f.color),m.opacity.value=f.opacity,m.size.value=f.size*y,m.scale.value=x*.5,f.map&&(m.map.value=f.map,t(f.map,m.uvTransform)),f.alphaMap&&(m.alphaMap.value=f.alphaMap,t(f.alphaMap,m.alphaMapTransform)),f.alphaTest>0&&(m.alphaTest.value=f.alphaTest)}function l(m,f){m.diffuse.value.copy(f.color),m.opacity.value=f.opacity,m.rotation.value=f.rotation,f.map&&(m.map.value=f.map,t(f.map,m.mapTransform)),f.alphaMap&&(m.alphaMap.value=f.alphaMap,t(f.alphaMap,m.alphaMapTransform)),f.alphaTest>0&&(m.alphaTest.value=f.alphaTest)}function h(m,f){m.specular.value.copy(f.specular),m.shininess.value=Math.max(f.shininess,1e-4)}function u(m,f){f.gradientMap&&(m.gradientMap.value=f.gradientMap)}function d(m,f){m.metalness.value=f.metalness,f.metalnessMap&&(m.metalnessMap.value=f.metalnessMap,t(f.metalnessMap,m.metalnessMapTransform)),m.roughness.value=f.roughness,f.roughnessMap&&(m.roughnessMap.value=f.roughnessMap,t(f.roughnessMap,m.roughnessMapTransform)),f.envMap&&(m.envMapIntensity.value=f.envMapIntensity)}function p(m,f,y){m.ior.value=f.ior,f.sheen>0&&(m.sheenColor.value.copy(f.sheenColor).multiplyScalar(f.sheen),m.sheenRoughness.value=f.sheenRoughness,f.sheenColorMap&&(m.sheenColorMap.value=f.sheenColorMap,t(f.sheenColorMap,m.sheenColorMapTransform)),f.sheenRoughnessMap&&(m.sheenRoughnessMap.value=f.sheenRoughnessMap,t(f.sheenRoughnessMap,m.sheenRoughnessMapTransform))),f.clearcoat>0&&(m.clearcoat.value=f.clearcoat,m.clearcoatRoughness.value=f.clearcoatRoughness,f.clearcoatMap&&(m.clearcoatMap.value=f.clearcoatMap,t(f.clearcoatMap,m.clearcoatMapTransform)),f.clearcoatRoughnessMap&&(m.clearcoatRoughnessMap.value=f.clearcoatRoughnessMap,t(f.clearcoatRoughnessMap,m.clearcoatRoughnessMapTransform)),f.clearcoatNormalMap&&(m.clearcoatNormalMap.value=f.clearcoatNormalMap,t(f.clearcoatNormalMap,m.clearcoatNormalMapTransform),m.clearcoatNormalScale.value.copy(f.clearcoatNormalScale),f.side===Rn&&m.clearcoatNormalScale.value.negate())),f.dispersion>0&&(m.dispersion.value=f.dispersion),f.iridescence>0&&(m.iridescence.value=f.iridescence,m.iridescenceIOR.value=f.iridescenceIOR,m.iridescenceThicknessMinimum.value=f.iridescenceThicknessRange[0],m.iridescenceThicknessMaximum.value=f.iridescenceThicknessRange[1],f.iridescenceMap&&(m.iridescenceMap.value=f.iridescenceMap,t(f.iridescenceMap,m.iridescenceMapTransform)),f.iridescenceThicknessMap&&(m.iridescenceThicknessMap.value=f.iridescenceThicknessMap,t(f.iridescenceThicknessMap,m.iridescenceThicknessMapTransform))),f.transmission>0&&(m.transmission.value=f.transmission,m.transmissionSamplerMap.value=y.texture,m.transmissionSamplerSize.value.set(y.width,y.height),f.transmissionMap&&(m.transmissionMap.value=f.transmissionMap,t(f.transmissionMap,m.transmissionMapTransform)),m.thickness.value=f.thickness,f.thicknessMap&&(m.thicknessMap.value=f.thicknessMap,t(f.thicknessMap,m.thicknessMapTransform)),m.attenuationDistance.value=f.attenuationDistance,m.attenuationColor.value.copy(f.attenuationColor)),f.anisotropy>0&&(m.anisotropyVector.value.set(f.anisotropy*Math.cos(f.anisotropyRotation),f.anisotropy*Math.sin(f.anisotropyRotation)),f.anisotropyMap&&(m.anisotropyMap.value=f.anisotropyMap,t(f.anisotropyMap,m.anisotropyMapTransform))),m.specularIntensity.value=f.specularIntensity,m.specularColor.value.copy(f.specularColor),f.specularColorMap&&(m.specularColorMap.value=f.specularColorMap,t(f.specularColorMap,m.specularColorMapTransform)),f.specularIntensityMap&&(m.specularIntensityMap.value=f.specularIntensityMap,t(f.specularIntensityMap,m.specularIntensityMapTransform))}function g(m,f){f.matcap&&(m.matcap.value=f.matcap)}function b(m,f){const y=e.get(f).light;m.referencePosition.value.setFromMatrixPosition(y.matrixWorld),m.nearDistance.value=y.shadow.camera.near,m.farDistance.value=y.shadow.camera.far}return{refreshFogUniforms:n,refreshMaterialUniforms:r}}function V_(i,e,t,n){let r={},s={},o=[];const a=i.getParameter(i.MAX_UNIFORM_BUFFER_BINDINGS);function c(y,x){const _=x.program;n.uniformBlockBinding(y,_)}function l(y,x){let _=r[y.id];_===void 0&&(g(y),_=h(y),r[y.id]=_,y.addEventListener("dispose",m));const I=x.program;n.updateUBOMapping(y,I);const L=e.render.frame;s[y.id]!==L&&(d(y),s[y.id]=L)}function h(y){const x=u();y.__bindingPointIndex=x;const _=i.createBuffer(),I=y.__size,L=y.usage;return i.bindBuffer(i.UNIFORM_BUFFER,_),i.bufferData(i.UNIFORM_BUFFER,I,L),i.bindBuffer(i.UNIFORM_BUFFER,null),i.bindBufferBase(i.UNIFORM_BUFFER,x,_),_}function u(){for(let y=0;y<a;y++)if(o.indexOf(y)===-1)return o.push(y),y;return console.error("THREE.WebGLRenderer: Maximum number of simultaneously usable uniforms groups reached."),0}function d(y){const x=r[y.id],_=y.uniforms,I=y.__cache;i.bindBuffer(i.UNIFORM_BUFFER,x);for(let L=0,C=_.length;L<C;L++){const F=Array.isArray(_[L])?_[L]:[_[L]];for(let w=0,v=F.length;w<v;w++){const T=F[w];if(p(T,L,w,I)===!0){const j=T.__offset,q=Array.isArray(T.value)?T.value:[T.value];let se=0;for(let ne=0;ne<q.length;ne++){const $=q[ne],ce=b($);typeof $=="number"||typeof $=="boolean"?(T.__data[0]=$,i.bufferSubData(i.UNIFORM_BUFFER,j+se,T.__data)):$.isMatrix3?(T.__data[0]=$.elements[0],T.__data[1]=$.elements[1],T.__data[2]=$.elements[2],T.__data[3]=0,T.__data[4]=$.elements[3],T.__data[5]=$.elements[4],T.__data[6]=$.elements[5],T.__data[7]=0,T.__data[8]=$.elements[6],T.__data[9]=$.elements[7],T.__data[10]=$.elements[8],T.__data[11]=0):($.toArray(T.__data,se),se+=ce.storage/Float32Array.BYTES_PER_ELEMENT)}i.bufferSubData(i.UNIFORM_BUFFER,j,T.__data)}}}i.bindBuffer(i.UNIFORM_BUFFER,null)}function p(y,x,_,I){const L=y.value,C=x+"_"+_;if(I[C]===void 0)return typeof L=="number"||typeof L=="boolean"?I[C]=L:I[C]=L.clone(),!0;{const F=I[C];if(typeof L=="number"||typeof L=="boolean"){if(F!==L)return I[C]=L,!0}else if(F.equals(L)===!1)return F.copy(L),!0}return!1}function g(y){const x=y.uniforms;let _=0;const I=16;for(let C=0,F=x.length;C<F;C++){const w=Array.isArray(x[C])?x[C]:[x[C]];for(let v=0,T=w.length;v<T;v++){const j=w[v],q=Array.isArray(j.value)?j.value:[j.value];for(let se=0,ne=q.length;se<ne;se++){const $=q[se],ce=b($),P=_%I,k=P%ce.boundary,W=P+k;_+=k,W!==0&&I-W<ce.storage&&(_+=I-W),j.__data=new Float32Array(ce.storage/Float32Array.BYTES_PER_ELEMENT),j.__offset=_,_+=ce.storage}}}const L=_%I;return L>0&&(_+=I-L),y.__size=_,y.__cache={},this}function b(y){const x={boundary:0,storage:0};return typeof y=="number"||typeof y=="boolean"?(x.boundary=4,x.storage=4):y.isVector2?(x.boundary=8,x.storage=8):y.isVector3||y.isColor?(x.boundary=16,x.storage=12):y.isVector4?(x.boundary=16,x.storage=16):y.isMatrix3?(x.boundary=48,x.storage=48):y.isMatrix4?(x.boundary=64,x.storage=64):y.isTexture?console.warn("THREE.WebGLRenderer: Texture samplers can not be part of an uniforms group."):console.warn("THREE.WebGLRenderer: Unsupported uniform value type.",y),x}function m(y){const x=y.target;x.removeEventListener("dispose",m);const _=o.indexOf(x.__bindingPointIndex);o.splice(_,1),i.deleteBuffer(r[x.id]),delete r[x.id],delete s[x.id]}function f(){for(const y in r)i.deleteBuffer(r[y]);o=[],r={},s={}}return{bind:c,update:l,dispose:f}}class G_{constructor(e={}){const{canvas:t=Lp(),context:n=null,depth:r=!0,stencil:s=!1,alpha:o=!1,antialias:a=!1,premultipliedAlpha:c=!0,preserveDrawingBuffer:l=!1,powerPreference:h="default",failIfMajorPerformanceCaveat:u=!1,reverseDepthBuffer:d=!1}=e;this.isWebGLRenderer=!0;let p;if(n!==null){if(typeof WebGLRenderingContext<"u"&&n instanceof WebGLRenderingContext)throw new Error("THREE.WebGLRenderer: WebGL 1 is not supported since r163.");p=n.getContextAttributes().alpha}else p=o;const g=new Uint32Array(4),b=new Int32Array(4);let m=null,f=null;const y=[],x=[];this.domElement=t,this.debug={checkShaderErrors:!0,onShaderError:null},this.autoClear=!0,this.autoClearColor=!0,this.autoClearDepth=!0,this.autoClearStencil=!0,this.sortObjects=!0,this.clippingPlanes=[],this.localClippingEnabled=!1,this._outputColorSpace=ln,this.toneMapping=cr,this.toneMappingExposure=1;const _=this;let I=!1,L=0,C=0,F=null,w=-1,v=null;const T=new vt,j=new vt;let q=null;const se=new it(0);let ne=0,$=t.width,ce=t.height,P=1,k=null,W=null;const re=new vt(0,0,$,ce),he=new vt(0,0,$,ce);let ye=!1;const J=new ql;let fe=!1,Me=!1;const _e=new rt,Fe=new rt,$e=new A,nt=new vt,Tt={background:null,fog:null,environment:null,overrideMaterial:null,isScene:!0};let Ke=!1;function ct(){return F===null?P:1}let N=n;function Kt(S,B){return t.getContext(S,B)}try{const S={alpha:!0,depth:r,stencil:s,antialias:a,premultipliedAlpha:c,preserveDrawingBuffer:l,powerPreference:h,failIfMajorPerformanceCaveat:u};if("setAttribute"in t&&t.setAttribute("data-engine",`three.js r${Ul}`),t.addEventListener("webglcontextlost",ge,!1),t.addEventListener("webglcontextrestored",Ie,!1),t.addEventListener("webglcontextcreationerror",Le,!1),N===null){const B="webgl2";if(N=Kt(B,S),N===null)throw Kt(B)?new Error("Error creating WebGL context with your selected attributes."):new Error("Error creating WebGL context.")}}catch(S){throw console.error("THREE.WebGLRenderer: "+S.message),S}let _t,dt,De,Ut,tt,R,M,Y,pe,me,ue,Ye,Re,Oe,Rt,Se,ke,Ze,st,Be,yt,pt,Lt,O;function Ce(){_t=new Q0(N),_t.init(),pt=new I_(N,_t),dt=new V0(N,_t,e,pt),De=new P_(N,_t),dt.reverseDepthBuffer&&d&&De.buffers.depth.setReversed(!0),Ut=new $0(N),tt=new m_,R=new D_(N,_t,De,tt,dt,pt,Ut),M=new W0(_),Y=new X0(_),pe=new rm(N),Lt=new z0(N,pe),me=new K0(N,pe,Ut,Lt),ue=new J0(N,me,pe,Ut),st=new Z0(N,dt,R),Se=new G0(tt),Ye=new p_(_,M,Y,_t,dt,Lt,Se),Re=new H_(_,tt),Oe=new b_,Rt=new S_(_t),Ze=new B0(_,M,Y,De,ue,p,c),ke=new R_(_,ue,dt),O=new V_(N,Ut,dt,De),Be=new H0(N,_t,Ut),yt=new Y0(N,_t,Ut),Ut.programs=Ye.programs,_.capabilities=dt,_.extensions=_t,_.properties=tt,_.renderLists=Oe,_.shadowMap=ke,_.state=De,_.info=Ut}Ce();const ae=new B_(_,N);this.xr=ae,this.getContext=function(){return N},this.getContextAttributes=function(){return N.getContextAttributes()},this.forceContextLoss=function(){const S=_t.get("WEBGL_lose_context");S&&S.loseContext()},this.forceContextRestore=function(){const S=_t.get("WEBGL_lose_context");S&&S.restoreContext()},this.getPixelRatio=function(){return P},this.setPixelRatio=function(S){S!==void 0&&(P=S,this.setSize($,ce,!1))},this.getSize=function(S){return S.set($,ce)},this.setSize=function(S,B,ee=!0){if(ae.isPresenting){console.warn("THREE.WebGLRenderer: Can't change size while VR device is presenting.");return}$=S,ce=B,t.width=Math.floor(S*P),t.height=Math.floor(B*P),ee===!0&&(t.style.width=S+"px",t.style.height=B+"px"),this.setViewport(0,0,S,B)},this.getDrawingBufferSize=function(S){return S.set($*P,ce*P).floor()},this.setDrawingBufferSize=function(S,B,ee){$=S,ce=B,P=ee,t.width=Math.floor(S*ee),t.height=Math.floor(B*ee),this.setViewport(0,0,S,B)},this.getCurrentViewport=function(S){return S.copy(T)},this.getViewport=function(S){return S.copy(re)},this.setViewport=function(S,B,ee,te){S.isVector4?re.set(S.x,S.y,S.z,S.w):re.set(S,B,ee,te),De.viewport(T.copy(re).multiplyScalar(P).round())},this.getScissor=function(S){return S.copy(he)},this.setScissor=function(S,B,ee,te){S.isVector4?he.set(S.x,S.y,S.z,S.w):he.set(S,B,ee,te),De.scissor(j.copy(he).multiplyScalar(P).round())},this.getScissorTest=function(){return ye},this.setScissorTest=function(S){De.setScissorTest(ye=S)},this.setOpaqueSort=function(S){k=S},this.setTransparentSort=function(S){W=S},this.getClearColor=function(S){return S.copy(Ze.getClearColor())},this.setClearColor=function(){Ze.setClearColor.apply(Ze,arguments)},this.getClearAlpha=function(){return Ze.getClearAlpha()},this.setClearAlpha=function(){Ze.setClearAlpha.apply(Ze,arguments)},this.clear=function(S=!0,B=!0,ee=!0){let te=0;if(S){let H=!1;if(F!==null){const we=F.texture.format;H=we===Vl||we===Hl||we===zl}if(H){const we=F.texture.type,Ne=we===Wi||we===Lr||we===no||we===xs||we===Ol||we===kl,qe=Ze.getClearColor(),Xe=Ze.getClearAlpha(),lt=qe.r,ft=qe.g,He=qe.b;Ne?(g[0]=lt,g[1]=ft,g[2]=He,g[3]=Xe,N.clearBufferuiv(N.COLOR,0,g)):(b[0]=lt,b[1]=ft,b[2]=He,b[3]=Xe,N.clearBufferiv(N.COLOR,0,b))}else te|=N.COLOR_BUFFER_BIT}B&&(te|=N.DEPTH_BUFFER_BIT),ee&&(te|=N.STENCIL_BUFFER_BIT,this.state.buffers.stencil.setMask(4294967295)),N.clear(te)},this.clearColor=function(){this.clear(!0,!1,!1)},this.clearDepth=function(){this.clear(!1,!0,!1)},this.clearStencil=function(){this.clear(!1,!1,!0)},this.dispose=function(){t.removeEventListener("webglcontextlost",ge,!1),t.removeEventListener("webglcontextrestored",Ie,!1),t.removeEventListener("webglcontextcreationerror",Le,!1),Oe.dispose(),Rt.dispose(),tt.dispose(),M.dispose(),Y.dispose(),ue.dispose(),Lt.dispose(),O.dispose(),Ye.dispose(),ae.dispose(),ae.removeEventListener("sessionstart",On),ae.removeEventListener("sessionend",dr),Jn.stop()};function ge(S){S.preventDefault(),console.log("THREE.WebGLRenderer: Context Lost."),I=!0}function Ie(){console.log("THREE.WebGLRenderer: Context Restored."),I=!1;const S=Ut.autoReset,B=ke.enabled,ee=ke.autoUpdate,te=ke.needsUpdate,H=ke.type;Ce(),Ut.autoReset=S,ke.enabled=B,ke.autoUpdate=ee,ke.needsUpdate=te,ke.type=H}function Le(S){console.error("THREE.WebGLRenderer: A WebGL context could not be created. Reason: ",S.statusMessage)}function ut(S){const B=S.target;B.removeEventListener("dispose",ut),$t(B)}function $t(S){fn(S),tt.remove(S)}function fn(S){const B=tt.get(S).programs;B!==void 0&&(B.forEach(function(ee){Ye.releaseProgram(ee)}),S.isShaderMaterial&&Ye.releaseShaderCache(S))}this.renderBufferDirect=function(S,B,ee,te,H,we){B===null&&(B=Tt);const Ne=H.isMesh&&H.matrixWorld.determinant()<0,qe=Pa(S,B,ee,te,H);De.setMaterial(te,Ne);let Xe=ee.index,lt=1;if(te.wireframe===!0){if(Xe=me.getWireframeAttribute(ee),Xe===void 0)return;lt=2}const ft=ee.drawRange,He=ee.attributes.position;let wt=ft.start*lt,Ot=(ft.start+ft.count)*lt;we!==null&&(wt=Math.max(wt,we.start*lt),Ot=Math.min(Ot,(we.start+we.count)*lt)),Xe!==null?(wt=Math.max(wt,0),Ot=Math.min(Ot,Xe.count)):He!=null&&(wt=Math.max(wt,0),Ot=Math.min(Ot,He.count));const Qt=Ot-wt;if(Qt<0||Qt===1/0)return;Lt.setup(H,te,qe,ee,Xe);let pn,It=Be;if(Xe!==null&&(pn=pe.get(Xe),It=yt,It.setIndex(pn)),H.isMesh)te.wireframe===!0?(De.setLineWidth(te.wireframeLinewidth*ct()),It.setMode(N.LINES)):It.setMode(N.TRIANGLES);else if(H.isLine){let Ue=te.linewidth;Ue===void 0&&(Ue=1),De.setLineWidth(Ue*ct()),H.isLineSegments?It.setMode(N.LINES):H.isLineLoop?It.setMode(N.LINE_LOOP):It.setMode(N.LINE_STRIP)}else H.isPoints?It.setMode(N.POINTS):H.isSprite&&It.setMode(N.TRIANGLES);if(H.isBatchedMesh)if(H._multiDrawInstances!==null)It.renderMultiDrawInstances(H._multiDrawStarts,H._multiDrawCounts,H._multiDrawCount,H._multiDrawInstances);else if(_t.get("WEBGL_multi_draw"))It.renderMultiDraw(H._multiDrawStarts,H._multiDrawCounts,H._multiDrawCount);else{const Ue=H._multiDrawStarts,kn=H._multiDrawCounts,Pt=H._multiDrawCount,Dn=Xe?pe.get(Xe).bytesPerElement:1,ji=tt.get(te).currentProgram.getUniforms();for(let tn=0;tn<Pt;tn++)ji.setValue(N,"_gl_DrawID",tn),It.render(Ue[tn]/Dn,kn[tn])}else if(H.isInstancedMesh)It.renderInstances(wt,Qt,H.count);else if(ee.isInstancedBufferGeometry){const Ue=ee._maxInstanceCount!==void 0?ee._maxInstanceCount:1/0,kn=Math.min(ee.instanceCount,Ue);It.renderInstances(wt,Qt,kn)}else It.render(wt,Qt)};function Dt(S,B,ee){S.transparent===!0&&S.side===mi&&S.forceSinglePass===!1?(S.side=Rn,S.needsUpdate=!0,Fr(S,B,ee),S.side=Gi,S.needsUpdate=!0,Fr(S,B,ee),S.side=mi):Fr(S,B,ee)}this.compile=function(S,B,ee=null){ee===null&&(ee=S),f=Rt.get(ee),f.init(B),x.push(f),ee.traverseVisible(function(H){H.isLight&&H.layers.test(B.layers)&&(f.pushLight(H),H.castShadow&&f.pushShadow(H))}),S!==ee&&S.traverseVisible(function(H){H.isLight&&H.layers.test(B.layers)&&(f.pushLight(H),H.castShadow&&f.pushShadow(H))}),f.setupLights();const te=new Set;return S.traverse(function(H){if(!(H.isMesh||H.isPoints||H.isLine||H.isSprite))return;const we=H.material;if(we)if(Array.isArray(we))for(let Ne=0;Ne<we.length;Ne++){const qe=we[Ne];Dt(qe,ee,H),te.add(qe)}else Dt(we,ee,H),te.add(we)}),x.pop(),f=null,te},this.compileAsync=function(S,B,ee=null){const te=this.compile(S,B,ee);return new Promise(H=>{function we(){if(te.forEach(function(Ne){tt.get(Ne).currentProgram.isReady()&&te.delete(Ne)}),te.size===0){H(S);return}setTimeout(we,10)}_t.get("KHR_parallel_shader_compile")!==null?we():setTimeout(we,10)})};let Ln=null;function jn(S){Ln&&Ln(S)}function On(){Jn.stop()}function dr(){Jn.start()}const Jn=new Ad;Jn.setAnimationLoop(jn),typeof self<"u"&&Jn.setContext(self),this.setAnimationLoop=function(S){Ln=S,ae.setAnimationLoop(S),S===null?Jn.stop():Jn.start()},ae.addEventListener("sessionstart",On),ae.addEventListener("sessionend",dr),this.render=function(S,B){if(B!==void 0&&B.isCamera!==!0){console.error("THREE.WebGLRenderer.render: camera is not an instance of THREE.Camera.");return}if(I===!0)return;if(S.matrixWorldAutoUpdate===!0&&S.updateMatrixWorld(),B.parent===null&&B.matrixWorldAutoUpdate===!0&&B.updateMatrixWorld(),ae.enabled===!0&&ae.isPresenting===!0&&(ae.cameraAutoUpdate===!0&&ae.updateCamera(B),B=ae.getCamera()),S.isScene===!0&&S.onBeforeRender(_,S,B,F),f=Rt.get(S,x.length),f.init(B),x.push(f),Fe.multiplyMatrices(B.projectionMatrix,B.matrixWorldInverse),J.setFromProjectionMatrix(Fe),Me=this.localClippingEnabled,fe=Se.init(this.clippingPlanes,Me),m=Oe.get(S,y.length),m.init(),y.push(m),ae.enabled===!0&&ae.isPresenting===!0){const we=_.xr.getDepthSensingMesh();we!==null&&Us(we,B,-1/0,_.sortObjects)}Us(S,B,0,_.sortObjects),m.finish(),_.sortObjects===!0&&m.sort(k,W),Ke=ae.enabled===!1||ae.isPresenting===!1||ae.hasDepthSensing()===!1,Ke&&Ze.addToRenderList(m,S),this.info.render.frame++,fe===!0&&Se.beginShadows();const ee=f.state.shadowsArray;ke.render(ee,S,B),fe===!0&&Se.endShadows(),this.info.autoReset===!0&&this.info.reset();const te=m.opaque,H=m.transmissive;if(f.setupLights(),B.isArrayCamera){const we=B.cameras;if(H.length>0)for(let Ne=0,qe=we.length;Ne<qe;Ne++){const Xe=we[Ne];fo(te,H,S,Xe)}Ke&&Ze.render(S);for(let Ne=0,qe=we.length;Ne<qe;Ne++){const Xe=we[Ne];uo(m,S,Xe,Xe.viewport)}}else H.length>0&&fo(te,H,S,B),Ke&&Ze.render(S),uo(m,S,B);F!==null&&(R.updateMultisampleRenderTarget(F),R.updateRenderTargetMipmap(F)),S.isScene===!0&&S.onAfterRender(_,S,B),Lt.resetDefaultState(),w=-1,v=null,x.pop(),x.length>0?(f=x[x.length-1],fe===!0&&Se.setGlobalState(_.clippingPlanes,f.state.camera)):f=null,y.pop(),y.length>0?m=y[y.length-1]:m=null};function Us(S,B,ee,te){if(S.visible===!1)return;if(S.layers.test(B.layers)){if(S.isGroup)ee=S.renderOrder;else if(S.isLOD)S.autoUpdate===!0&&S.update(B);else if(S.isLight)f.pushLight(S),S.castShadow&&f.pushShadow(S);else if(S.isSprite){if(!S.frustumCulled||J.intersectsSprite(S)){te&&nt.setFromMatrixPosition(S.matrixWorld).applyMatrix4(Fe);const Ne=ue.update(S),qe=S.material;qe.visible&&m.push(S,Ne,qe,ee,nt.z,null)}}else if((S.isMesh||S.isLine||S.isPoints)&&(!S.frustumCulled||J.intersectsObject(S))){const Ne=ue.update(S),qe=S.material;if(te&&(S.boundingSphere!==void 0?(S.boundingSphere===null&&S.computeBoundingSphere(),nt.copy(S.boundingSphere.center)):(Ne.boundingSphere===null&&Ne.computeBoundingSphere(),nt.copy(Ne.boundingSphere.center)),nt.applyMatrix4(S.matrixWorld).applyMatrix4(Fe)),Array.isArray(qe)){const Xe=Ne.groups;for(let lt=0,ft=Xe.length;lt<ft;lt++){const He=Xe[lt],wt=qe[He.materialIndex];wt&&wt.visible&&m.push(S,Ne,wt,ee,nt.z,He)}}else qe.visible&&m.push(S,Ne,qe,ee,nt.z,null)}}const we=S.children;for(let Ne=0,qe=we.length;Ne<qe;Ne++)Us(we[Ne],B,ee,te)}function uo(S,B,ee,te){const H=S.opaque,we=S.transmissive,Ne=S.transparent;f.setupLightsView(ee),fe===!0&&Se.setGlobalState(_.clippingPlanes,ee),te&&De.viewport(T.copy(te)),H.length>0&&qi(H,B,ee),we.length>0&&qi(we,B,ee),Ne.length>0&&qi(Ne,B,ee),De.buffers.depth.setTest(!0),De.buffers.depth.setMask(!0),De.buffers.color.setMask(!0),De.setPolygonOffset(!1)}function fo(S,B,ee,te){if((ee.isScene===!0?ee.overrideMaterial:null)!==null)return;f.state.transmissionRenderTarget[te.id]===void 0&&(f.state.transmissionRenderTarget[te.id]=new Dr(1,1,{generateMipmaps:!0,type:_t.has("EXT_color_buffer_half_float")||_t.has("EXT_color_buffer_float")?co:Wi,minFilter:Ui,samples:4,stencilBuffer:s,resolveDepthBuffer:!1,resolveStencilBuffer:!1,colorSpace:Ct.workingColorSpace}));const we=f.state.transmissionRenderTarget[te.id],Ne=te.viewport||T;we.setSize(Ne.z,Ne.w);const qe=_.getRenderTarget();_.setRenderTarget(we),_.getClearColor(se),ne=_.getClearAlpha(),ne<1&&_.setClearColor(16777215,.5),_.clear(),Ke&&Ze.render(ee);const Xe=_.toneMapping;_.toneMapping=cr;const lt=te.viewport;if(te.viewport!==void 0&&(te.viewport=void 0),f.setupLightsView(te),fe===!0&&Se.setGlobalState(_.clippingPlanes,te),qi(S,ee,te),R.updateMultisampleRenderTarget(we),R.updateRenderTargetMipmap(we),_t.has("WEBGL_multisampled_render_to_texture")===!1){let ft=!1;for(let He=0,wt=B.length;He<wt;He++){const Ot=B[He],Qt=Ot.object,pn=Ot.geometry,It=Ot.material,Ue=Ot.group;if(It.side===mi&&Qt.layers.test(te.layers)){const kn=It.side;It.side=Rn,It.needsUpdate=!0,ei(Qt,ee,te,pn,It,Ue),It.side=kn,It.needsUpdate=!0,ft=!0}}ft===!0&&(R.updateMultisampleRenderTarget(we),R.updateRenderTargetMipmap(we))}_.setRenderTarget(qe),_.setClearColor(se,ne),lt!==void 0&&(te.viewport=lt),_.toneMapping=Xe}function qi(S,B,ee){const te=B.isScene===!0?B.overrideMaterial:null;for(let H=0,we=S.length;H<we;H++){const Ne=S[H],qe=Ne.object,Xe=Ne.geometry,lt=te===null?Ne.material:te,ft=Ne.group;qe.layers.test(ee.layers)&&ei(qe,B,ee,Xe,lt,ft)}}function ei(S,B,ee,te,H,we){S.onBeforeRender(_,B,ee,te,H,we),S.modelViewMatrix.multiplyMatrices(ee.matrixWorldInverse,S.matrixWorld),S.normalMatrix.getNormalMatrix(S.modelViewMatrix),H.onBeforeRender(_,B,ee,te,S,we),H.transparent===!0&&H.side===mi&&H.forceSinglePass===!1?(H.side=Rn,H.needsUpdate=!0,_.renderBufferDirect(ee,B,te,H,S,we),H.side=Gi,H.needsUpdate=!0,_.renderBufferDirect(ee,B,te,H,S,we),H.side=mi):_.renderBufferDirect(ee,B,te,H,S,we),S.onAfterRender(_,B,ee,te,H,we)}function Fr(S,B,ee){B.isScene!==!0&&(B=Tt);const te=tt.get(S),H=f.state.lights,we=f.state.shadowsArray,Ne=H.state.version,qe=Ye.getParameters(S,H.state,we,B,ee),Xe=Ye.getProgramCacheKey(qe);let lt=te.programs;te.environment=S.isMeshStandardMaterial?B.environment:null,te.fog=B.fog,te.envMap=(S.isMeshStandardMaterial?Y:M).get(S.envMap||te.environment),te.envMapRotation=te.environment!==null&&S.envMap===null?B.environmentRotation:S.envMapRotation,lt===void 0&&(S.addEventListener("dispose",ut),lt=new Map,te.programs=lt);let ft=lt.get(Xe);if(ft!==void 0){if(te.currentProgram===ft&&te.lightsStateVersion===Ne)return mo(S,qe),ft}else qe.uniforms=Ye.getUniforms(S),S.onBeforeCompile(qe,_),ft=Ye.acquireProgram(qe,Xe),lt.set(Xe,ft),te.uniforms=qe.uniforms;const He=te.uniforms;return(!S.isShaderMaterial&&!S.isRawShaderMaterial||S.clipping===!0)&&(He.clippingPlanes=Se.uniform),mo(S,qe),te.needsLights=Da(S),te.lightsStateVersion=Ne,te.needsLights&&(He.ambientLightColor.value=H.state.ambient,He.lightProbe.value=H.state.probe,He.directionalLights.value=H.state.directional,He.directionalLightShadows.value=H.state.directionalShadow,He.spotLights.value=H.state.spot,He.spotLightShadows.value=H.state.spotShadow,He.rectAreaLights.value=H.state.rectArea,He.ltc_1.value=H.state.rectAreaLTC1,He.ltc_2.value=H.state.rectAreaLTC2,He.pointLights.value=H.state.point,He.pointLightShadows.value=H.state.pointShadow,He.hemisphereLights.value=H.state.hemi,He.directionalShadowMap.value=H.state.directionalShadowMap,He.directionalShadowMatrix.value=H.state.directionalShadowMatrix,He.spotShadowMap.value=H.state.spotShadowMap,He.spotLightMatrix.value=H.state.spotLightMatrix,He.spotLightMap.value=H.state.spotLightMap,He.pointShadowMap.value=H.state.pointShadowMap,He.pointShadowMatrix.value=H.state.pointShadowMatrix),te.currentProgram=ft,te.uniformsList=null,ft}function po(S){if(S.uniformsList===null){const B=S.currentProgram.getUniforms();S.uniformsList=oa.seqWithValue(B.seq,S.uniforms)}return S.uniformsList}function mo(S,B){const ee=tt.get(S);ee.outputColorSpace=B.outputColorSpace,ee.batching=B.batching,ee.batchingColor=B.batchingColor,ee.instancing=B.instancing,ee.instancingColor=B.instancingColor,ee.instancingMorph=B.instancingMorph,ee.skinning=B.skinning,ee.morphTargets=B.morphTargets,ee.morphNormals=B.morphNormals,ee.morphColors=B.morphColors,ee.morphTargetsCount=B.morphTargetsCount,ee.numClippingPlanes=B.numClippingPlanes,ee.numIntersection=B.numClipIntersection,ee.vertexAlphas=B.vertexAlphas,ee.vertexTangents=B.vertexTangents,ee.toneMapping=B.toneMapping}function Pa(S,B,ee,te,H){B.isScene!==!0&&(B=Tt),R.resetTextureUnits();const we=B.fog,Ne=te.isMeshStandardMaterial?B.environment:null,qe=F===null?_.outputColorSpace:F.isXRRenderTarget===!0?F.texture.colorSpace:Pn,Xe=(te.isMeshStandardMaterial?Y:M).get(te.envMap||Ne),lt=te.vertexColors===!0&&!!ee.attributes.color&&ee.attributes.color.itemSize===4,ft=!!ee.attributes.tangent&&(!!te.normalMap||te.anisotropy>0),He=!!ee.morphAttributes.position,wt=!!ee.morphAttributes.normal,Ot=!!ee.morphAttributes.color;let Qt=cr;te.toneMapped&&(F===null||F.isXRRenderTarget===!0)&&(Qt=_.toneMapping);const pn=ee.morphAttributes.position||ee.morphAttributes.normal||ee.morphAttributes.color,It=pn!==void 0?pn.length:0,Ue=tt.get(te),kn=f.state.lights;if(fe===!0&&(Me===!0||S!==v)){const yn=S===v&&te.id===w;Se.setState(te,S,yn)}let Pt=!1;te.version===Ue.__version?(Ue.needsLights&&Ue.lightsStateVersion!==kn.state.version||Ue.outputColorSpace!==qe||H.isBatchedMesh&&Ue.batching===!1||!H.isBatchedMesh&&Ue.batching===!0||H.isBatchedMesh&&Ue.batchingColor===!0&&H.colorTexture===null||H.isBatchedMesh&&Ue.batchingColor===!1&&H.colorTexture!==null||H.isInstancedMesh&&Ue.instancing===!1||!H.isInstancedMesh&&Ue.instancing===!0||H.isSkinnedMesh&&Ue.skinning===!1||!H.isSkinnedMesh&&Ue.skinning===!0||H.isInstancedMesh&&Ue.instancingColor===!0&&H.instanceColor===null||H.isInstancedMesh&&Ue.instancingColor===!1&&H.instanceColor!==null||H.isInstancedMesh&&Ue.instancingMorph===!0&&H.morphTexture===null||H.isInstancedMesh&&Ue.instancingMorph===!1&&H.morphTexture!==null||Ue.envMap!==Xe||te.fog===!0&&Ue.fog!==we||Ue.numClippingPlanes!==void 0&&(Ue.numClippingPlanes!==Se.numPlanes||Ue.numIntersection!==Se.numIntersection)||Ue.vertexAlphas!==lt||Ue.vertexTangents!==ft||Ue.morphTargets!==He||Ue.morphNormals!==wt||Ue.morphColors!==Ot||Ue.toneMapping!==Qt||Ue.morphTargetsCount!==It)&&(Pt=!0):(Pt=!0,Ue.__version=te.version);let Dn=Ue.currentProgram;Pt===!0&&(Dn=Fr(te,B,H));let ji=!1,tn=!1,fr=!1;const Ft=Dn.getUniforms(),In=Ue.uniforms;if(De.useProgram(Dn.program)&&(ji=!0,tn=!0,fr=!0),te.id!==w&&(w=te.id,tn=!0),ji||v!==S){De.buffers.depth.getReversed()?(_e.copy(S.projectionMatrix),Ip(_e),Np(_e),Ft.setValue(N,"projectionMatrix",_e)):Ft.setValue(N,"projectionMatrix",S.projectionMatrix),Ft.setValue(N,"viewMatrix",S.matrixWorldInverse);const hi=Ft.map.cameraPosition;hi!==void 0&&hi.setValue(N,$e.setFromMatrixPosition(S.matrixWorld)),dt.logarithmicDepthBuffer&&Ft.setValue(N,"logDepthBufFC",2/(Math.log(S.far+1)/Math.LN2)),(te.isMeshPhongMaterial||te.isMeshToonMaterial||te.isMeshLambertMaterial||te.isMeshBasicMaterial||te.isMeshStandardMaterial||te.isShaderMaterial)&&Ft.setValue(N,"isOrthographic",S.isOrthographicCamera===!0),v!==S&&(v=S,tn=!0,fr=!0)}if(H.isSkinnedMesh){Ft.setOptional(N,H,"bindMatrix"),Ft.setOptional(N,H,"bindMatrixInverse");const yn=H.skeleton;yn&&(yn.boneTexture===null&&yn.computeBoneTexture(),Ft.setValue(N,"boneTexture",yn.boneTexture,R))}H.isBatchedMesh&&(Ft.setOptional(N,H,"batchingTexture"),Ft.setValue(N,"batchingTexture",H._matricesTexture,R),Ft.setOptional(N,H,"batchingIdTexture"),Ft.setValue(N,"batchingIdTexture",H._indirectTexture,R),Ft.setOptional(N,H,"batchingColorTexture"),H._colorsTexture!==null&&Ft.setValue(N,"batchingColorTexture",H._colorsTexture,R));const pr=ee.morphAttributes;if((pr.position!==void 0||pr.normal!==void 0||pr.color!==void 0)&&st.update(H,ee,Dn),(tn||Ue.receiveShadow!==H.receiveShadow)&&(Ue.receiveShadow=H.receiveShadow,Ft.setValue(N,"receiveShadow",H.receiveShadow)),te.isMeshGouraudMaterial&&te.envMap!==null&&(In.envMap.value=Xe,In.flipEnvMap.value=Xe.isCubeTexture&&Xe.isRenderTargetTexture===!1?-1:1),te.isMeshStandardMaterial&&te.envMap===null&&B.environment!==null&&(In.envMapIntensity.value=B.environmentIntensity),tn&&(Ft.setValue(N,"toneMappingExposure",_.toneMappingExposure),Ue.needsLights&&La(In,fr),we&&te.fog===!0&&Re.refreshFogUniforms(In,we),Re.refreshMaterialUniforms(In,te,P,ce,f.state.transmissionRenderTarget[S.id]),oa.upload(N,po(Ue),In,R)),te.isShaderMaterial&&te.uniformsNeedUpdate===!0&&(oa.upload(N,po(Ue),In,R),te.uniformsNeedUpdate=!1),te.isSpriteMaterial&&Ft.setValue(N,"center",H.center),Ft.setValue(N,"modelViewMatrix",H.modelViewMatrix),Ft.setValue(N,"normalMatrix",H.normalMatrix),Ft.setValue(N,"modelMatrix",H.matrixWorld),te.isShaderMaterial||te.isRawShaderMaterial){const yn=te.uniformsGroups;for(let hi=0,Bn=yn.length;hi<Bn;hi++){const Fs=yn[hi];O.update(Fs,Dn),O.bind(Fs,Dn)}}return Dn}function La(S,B){S.ambientLightColor.needsUpdate=B,S.lightProbe.needsUpdate=B,S.directionalLights.needsUpdate=B,S.directionalLightShadows.needsUpdate=B,S.pointLights.needsUpdate=B,S.pointLightShadows.needsUpdate=B,S.spotLights.needsUpdate=B,S.spotLightShadows.needsUpdate=B,S.rectAreaLights.needsUpdate=B,S.hemisphereLights.needsUpdate=B}function Da(S){return S.isMeshLambertMaterial||S.isMeshToonMaterial||S.isMeshPhongMaterial||S.isMeshStandardMaterial||S.isShadowMaterial||S.isShaderMaterial&&S.lights===!0}this.getActiveCubeFace=function(){return L},this.getActiveMipmapLevel=function(){return C},this.getRenderTarget=function(){return F},this.setRenderTargetTextures=function(S,B,ee){tt.get(S.texture).__webglTexture=B,tt.get(S.depthTexture).__webglTexture=ee;const te=tt.get(S);te.__hasExternalTextures=!0,te.__autoAllocateDepthBuffer=ee===void 0,te.__autoAllocateDepthBuffer||_t.has("WEBGL_multisampled_render_to_texture")===!0&&(console.warn("THREE.WebGLRenderer: Render-to-texture extension was disabled because an external texture was provided"),te.__useRenderToTexture=!1)},this.setRenderTargetFramebuffer=function(S,B){const ee=tt.get(S);ee.__webglFramebuffer=B,ee.__useDefaultFramebuffer=B===void 0},this.setRenderTarget=function(S,B=0,ee=0){F=S,L=B,C=ee;let te=!0,H=null,we=!1,Ne=!1;if(S){const Xe=tt.get(S);if(Xe.__useDefaultFramebuffer!==void 0)De.bindFramebuffer(N.FRAMEBUFFER,null),te=!1;else if(Xe.__webglFramebuffer===void 0)R.setupRenderTarget(S);else if(Xe.__hasExternalTextures)R.rebindTextures(S,tt.get(S.texture).__webglTexture,tt.get(S.depthTexture).__webglTexture);else if(S.depthBuffer){const He=S.depthTexture;if(Xe.__boundDepthTexture!==He){if(He!==null&&tt.has(He)&&(S.width!==He.image.width||S.height!==He.image.height))throw new Error("WebGLRenderTarget: Attached DepthTexture is initialized to the incorrect size.");R.setupDepthRenderbuffer(S)}}const lt=S.texture;(lt.isData3DTexture||lt.isDataArrayTexture||lt.isCompressedArrayTexture)&&(Ne=!0);const ft=tt.get(S).__webglFramebuffer;S.isWebGLCubeRenderTarget?(Array.isArray(ft[B])?H=ft[B][ee]:H=ft[B],we=!0):S.samples>0&&R.useMultisampledRTT(S)===!1?H=tt.get(S).__webglMultisampledFramebuffer:Array.isArray(ft)?H=ft[ee]:H=ft,T.copy(S.viewport),j.copy(S.scissor),q=S.scissorTest}else T.copy(re).multiplyScalar(P).floor(),j.copy(he).multiplyScalar(P).floor(),q=ye;if(De.bindFramebuffer(N.FRAMEBUFFER,H)&&te&&De.drawBuffers(S,H),De.viewport(T),De.scissor(j),De.setScissorTest(q),we){const Xe=tt.get(S.texture);N.framebufferTexture2D(N.FRAMEBUFFER,N.COLOR_ATTACHMENT0,N.TEXTURE_CUBE_MAP_POSITIVE_X+B,Xe.__webglTexture,ee)}else if(Ne){const Xe=tt.get(S.texture),lt=B||0;N.framebufferTextureLayer(N.FRAMEBUFFER,N.COLOR_ATTACHMENT0,Xe.__webglTexture,ee||0,lt)}w=-1},this.readRenderTargetPixels=function(S,B,ee,te,H,we,Ne){if(!(S&&S.isWebGLRenderTarget)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");return}let qe=tt.get(S).__webglFramebuffer;if(S.isWebGLCubeRenderTarget&&Ne!==void 0&&(qe=qe[Ne]),qe){De.bindFramebuffer(N.FRAMEBUFFER,qe);try{const Xe=S.texture,lt=Xe.format,ft=Xe.type;if(!dt.textureFormatReadable(lt)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in RGBA or implementation defined format.");return}if(!dt.textureTypeReadable(ft)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in UnsignedByteType or implementation defined type.");return}B>=0&&B<=S.width-te&&ee>=0&&ee<=S.height-H&&N.readPixels(B,ee,te,H,pt.convert(lt),pt.convert(ft),we)}finally{const Xe=F!==null?tt.get(F).__webglFramebuffer:null;De.bindFramebuffer(N.FRAMEBUFFER,Xe)}}},this.readRenderTargetPixelsAsync=async function(S,B,ee,te,H,we,Ne){if(!(S&&S.isWebGLRenderTarget))throw new Error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");let qe=tt.get(S).__webglFramebuffer;if(S.isWebGLCubeRenderTarget&&Ne!==void 0&&(qe=qe[Ne]),qe){const Xe=S.texture,lt=Xe.format,ft=Xe.type;if(!dt.textureFormatReadable(lt))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in RGBA or implementation defined format.");if(!dt.textureTypeReadable(ft))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in UnsignedByteType or implementation defined type.");if(B>=0&&B<=S.width-te&&ee>=0&&ee<=S.height-H){De.bindFramebuffer(N.FRAMEBUFFER,qe);const He=N.createBuffer();N.bindBuffer(N.PIXEL_PACK_BUFFER,He),N.bufferData(N.PIXEL_PACK_BUFFER,we.byteLength,N.STREAM_READ),N.readPixels(B,ee,te,H,pt.convert(lt),pt.convert(ft),0);const wt=F!==null?tt.get(F).__webglFramebuffer:null;De.bindFramebuffer(N.FRAMEBUFFER,wt);const Ot=N.fenceSync(N.SYNC_GPU_COMMANDS_COMPLETE,0);return N.flush(),await Dp(N,Ot,4),N.bindBuffer(N.PIXEL_PACK_BUFFER,He),N.getBufferSubData(N.PIXEL_PACK_BUFFER,0,we),N.deleteBuffer(He),N.deleteSync(Ot),we}else throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: requested read bounds are out of range.")}},this.copyFramebufferToTexture=function(S,B=null,ee=0){S.isTexture!==!0&&(Ks("WebGLRenderer: copyFramebufferToTexture function signature has changed."),B=arguments[0]||null,S=arguments[1]);const te=Math.pow(2,-ee),H=Math.floor(S.image.width*te),we=Math.floor(S.image.height*te),Ne=B!==null?B.x:0,qe=B!==null?B.y:0;R.setTexture2D(S,0),N.copyTexSubImage2D(N.TEXTURE_2D,ee,0,0,Ne,qe,H,we),De.unbindTexture()},this.copyTextureToTexture=function(S,B,ee=null,te=null,H=0){S.isTexture!==!0&&(Ks("WebGLRenderer: copyTextureToTexture function signature has changed."),te=arguments[0]||null,S=arguments[1],B=arguments[2],H=arguments[3]||0,ee=null);let we,Ne,qe,Xe,lt,ft,He,wt,Ot;const Qt=S.isCompressedTexture?S.mipmaps[H]:S.image;ee!==null?(we=ee.max.x-ee.min.x,Ne=ee.max.y-ee.min.y,qe=ee.isBox3?ee.max.z-ee.min.z:1,Xe=ee.min.x,lt=ee.min.y,ft=ee.isBox3?ee.min.z:0):(we=Qt.width,Ne=Qt.height,qe=Qt.depth||1,Xe=0,lt=0,ft=0),te!==null?(He=te.x,wt=te.y,Ot=te.z):(He=0,wt=0,Ot=0);const pn=pt.convert(B.format),It=pt.convert(B.type);let Ue;B.isData3DTexture?(R.setTexture3D(B,0),Ue=N.TEXTURE_3D):B.isDataArrayTexture||B.isCompressedArrayTexture?(R.setTexture2DArray(B,0),Ue=N.TEXTURE_2D_ARRAY):(R.setTexture2D(B,0),Ue=N.TEXTURE_2D),N.pixelStorei(N.UNPACK_FLIP_Y_WEBGL,B.flipY),N.pixelStorei(N.UNPACK_PREMULTIPLY_ALPHA_WEBGL,B.premultiplyAlpha),N.pixelStorei(N.UNPACK_ALIGNMENT,B.unpackAlignment);const kn=N.getParameter(N.UNPACK_ROW_LENGTH),Pt=N.getParameter(N.UNPACK_IMAGE_HEIGHT),Dn=N.getParameter(N.UNPACK_SKIP_PIXELS),ji=N.getParameter(N.UNPACK_SKIP_ROWS),tn=N.getParameter(N.UNPACK_SKIP_IMAGES);N.pixelStorei(N.UNPACK_ROW_LENGTH,Qt.width),N.pixelStorei(N.UNPACK_IMAGE_HEIGHT,Qt.height),N.pixelStorei(N.UNPACK_SKIP_PIXELS,Xe),N.pixelStorei(N.UNPACK_SKIP_ROWS,lt),N.pixelStorei(N.UNPACK_SKIP_IMAGES,ft);const fr=S.isDataArrayTexture||S.isData3DTexture,Ft=B.isDataArrayTexture||B.isData3DTexture;if(S.isRenderTargetTexture||S.isDepthTexture){const In=tt.get(S),pr=tt.get(B),yn=tt.get(In.__renderTarget),hi=tt.get(pr.__renderTarget);De.bindFramebuffer(N.READ_FRAMEBUFFER,yn.__webglFramebuffer),De.bindFramebuffer(N.DRAW_FRAMEBUFFER,hi.__webglFramebuffer);for(let Bn=0;Bn<qe;Bn++)fr&&N.framebufferTextureLayer(N.READ_FRAMEBUFFER,N.COLOR_ATTACHMENT0,tt.get(S).__webglTexture,H,ft+Bn),S.isDepthTexture?(Ft&&N.framebufferTextureLayer(N.DRAW_FRAMEBUFFER,N.COLOR_ATTACHMENT0,tt.get(B).__webglTexture,H,Ot+Bn),N.blitFramebuffer(Xe,lt,we,Ne,He,wt,we,Ne,N.DEPTH_BUFFER_BIT,N.NEAREST)):Ft?N.copyTexSubImage3D(Ue,H,He,wt,Ot+Bn,Xe,lt,we,Ne):N.copyTexSubImage2D(Ue,H,He,wt,Ot+Bn,Xe,lt,we,Ne);De.bindFramebuffer(N.READ_FRAMEBUFFER,null),De.bindFramebuffer(N.DRAW_FRAMEBUFFER,null)}else Ft?S.isDataTexture||S.isData3DTexture?N.texSubImage3D(Ue,H,He,wt,Ot,we,Ne,qe,pn,It,Qt.data):B.isCompressedArrayTexture?N.compressedTexSubImage3D(Ue,H,He,wt,Ot,we,Ne,qe,pn,Qt.data):N.texSubImage3D(Ue,H,He,wt,Ot,we,Ne,qe,pn,It,Qt):S.isDataTexture?N.texSubImage2D(N.TEXTURE_2D,H,He,wt,we,Ne,pn,It,Qt.data):S.isCompressedTexture?N.compressedTexSubImage2D(N.TEXTURE_2D,H,He,wt,Qt.width,Qt.height,pn,Qt.data):N.texSubImage2D(N.TEXTURE_2D,H,He,wt,we,Ne,pn,It,Qt);N.pixelStorei(N.UNPACK_ROW_LENGTH,kn),N.pixelStorei(N.UNPACK_IMAGE_HEIGHT,Pt),N.pixelStorei(N.UNPACK_SKIP_PIXELS,Dn),N.pixelStorei(N.UNPACK_SKIP_ROWS,ji),N.pixelStorei(N.UNPACK_SKIP_IMAGES,tn),H===0&&B.generateMipmaps&&N.generateMipmap(Ue),De.unbindTexture()},this.copyTextureToTexture3D=function(S,B,ee=null,te=null,H=0){return S.isTexture!==!0&&(Ks("WebGLRenderer: copyTextureToTexture3D function signature has changed."),ee=arguments[0]||null,te=arguments[1]||null,S=arguments[2],B=arguments[3],H=arguments[4]||0),Ks('WebGLRenderer: copyTextureToTexture3D function has been deprecated. Use "copyTextureToTexture" instead.'),this.copyTextureToTexture(S,B,ee,te,H)},this.initRenderTarget=function(S){tt.get(S).__webglFramebuffer===void 0&&R.setupRenderTarget(S)},this.initTexture=function(S){S.isCubeTexture?R.setTextureCube(S,0):S.isData3DTexture?R.setTexture3D(S,0):S.isDataArrayTexture||S.isCompressedArrayTexture?R.setTexture2DArray(S,0):R.setTexture2D(S,0),De.unbindTexture()},this.resetState=function(){L=0,C=0,F=null,De.reset(),Lt.reset()},typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}get coordinateSystem(){return Fi}get outputColorSpace(){return this._outputColorSpace}set outputColorSpace(e){this._outputColorSpace=e;const t=this.getContext();t.drawingBufferColorspace=Ct._getDrawingBufferColorSpace(e),t.unpackColorSpace=Ct._getUnpackColorSpace()}}class Ql extends en{constructor(){super(),this.isScene=!0,this.type="Scene",this.background=null,this.environment=null,this.fog=null,this.backgroundBlurriness=0,this.backgroundIntensity=1,this.backgroundRotation=new _i,this.environmentIntensity=1,this.environmentRotation=new _i,this.overrideMaterial=null,typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}copy(e,t){return super.copy(e,t),e.background!==null&&(this.background=e.background.clone()),e.environment!==null&&(this.environment=e.environment.clone()),e.fog!==null&&(this.fog=e.fog.clone()),this.backgroundBlurriness=e.backgroundBlurriness,this.backgroundIntensity=e.backgroundIntensity,this.backgroundRotation.copy(e.backgroundRotation),this.environmentIntensity=e.environmentIntensity,this.environmentRotation.copy(e.environmentRotation),e.overrideMaterial!==null&&(this.overrideMaterial=e.overrideMaterial.clone()),this.matrixAutoUpdate=e.matrixAutoUpdate,this}toJSON(e){const t=super.toJSON(e);return this.fog!==null&&(t.object.fog=this.fog.toJSON()),this.backgroundBlurriness>0&&(t.object.backgroundBlurriness=this.backgroundBlurriness),this.backgroundIntensity!==1&&(t.object.backgroundIntensity=this.backgroundIntensity),t.object.backgroundRotation=this.backgroundRotation.toArray(),this.environmentIntensity!==1&&(t.object.environmentIntensity=this.environmentIntensity),t.object.environmentRotation=this.environmentRotation.toArray(),t}}class W_{constructor(e,t){this.isInterleavedBuffer=!0,this.array=e,this.stride=t,this.count=e!==void 0?e.length/t:0,this.usage=bl,this.updateRanges=[],this.version=0,this.uuid=ci()}onUploadCallback(){}set needsUpdate(e){e===!0&&this.version++}setUsage(e){return this.usage=e,this}addUpdateRange(e,t){this.updateRanges.push({start:e,count:t})}clearUpdateRanges(){this.updateRanges.length=0}copy(e){return this.array=new e.array.constructor(e.array),this.count=e.count,this.stride=e.stride,this.usage=e.usage,this}copyAt(e,t,n){e*=this.stride,n*=t.stride;for(let r=0,s=this.stride;r<s;r++)this.array[e+r]=t.array[n+r];return this}set(e,t=0){return this.array.set(e,t),this}clone(e){e.arrayBuffers===void 0&&(e.arrayBuffers={}),this.array.buffer._uuid===void 0&&(this.array.buffer._uuid=ci()),e.arrayBuffers[this.array.buffer._uuid]===void 0&&(e.arrayBuffers[this.array.buffer._uuid]=this.array.slice(0).buffer);const t=new this.array.constructor(e.arrayBuffers[this.array.buffer._uuid]),n=new this.constructor(t,this.stride);return n.setUsage(this.usage),n}onUpload(e){return this.onUploadCallback=e,this}toJSON(e){return e.arrayBuffers===void 0&&(e.arrayBuffers={}),this.array.buffer._uuid===void 0&&(this.array.buffer._uuid=ci()),e.arrayBuffers[this.array.buffer._uuid]===void 0&&(e.arrayBuffers[this.array.buffer._uuid]=Array.from(new Uint32Array(this.array.buffer))),{uuid:this.uuid,buffer:this.array.buffer._uuid,type:this.array.constructor.name,stride:this.stride}}}const An=new A;class Kl{constructor(e,t,n,r=!1){this.isInterleavedBufferAttribute=!0,this.name="",this.data=e,this.itemSize=t,this.offset=n,this.normalized=r}get count(){return this.data.count}get array(){return this.data.array}set needsUpdate(e){this.data.needsUpdate=e}applyMatrix4(e){for(let t=0,n=this.data.count;t<n;t++)An.fromBufferAttribute(this,t),An.applyMatrix4(e),this.setXYZ(t,An.x,An.y,An.z);return this}applyNormalMatrix(e){for(let t=0,n=this.count;t<n;t++)An.fromBufferAttribute(this,t),An.applyNormalMatrix(e),this.setXYZ(t,An.x,An.y,An.z);return this}transformDirection(e){for(let t=0,n=this.count;t<n;t++)An.fromBufferAttribute(this,t),An.transformDirection(e),this.setXYZ(t,An.x,An.y,An.z);return this}getComponent(e,t){let n=this.array[e*this.data.stride+this.offset+t];return this.normalized&&(n=oi(n,this.array)),n}setComponent(e,t,n){return this.normalized&&(n=zt(n,this.array)),this.data.array[e*this.data.stride+this.offset+t]=n,this}setX(e,t){return this.normalized&&(t=zt(t,this.array)),this.data.array[e*this.data.stride+this.offset]=t,this}setY(e,t){return this.normalized&&(t=zt(t,this.array)),this.data.array[e*this.data.stride+this.offset+1]=t,this}setZ(e,t){return this.normalized&&(t=zt(t,this.array)),this.data.array[e*this.data.stride+this.offset+2]=t,this}setW(e,t){return this.normalized&&(t=zt(t,this.array)),this.data.array[e*this.data.stride+this.offset+3]=t,this}getX(e){let t=this.data.array[e*this.data.stride+this.offset];return this.normalized&&(t=oi(t,this.array)),t}getY(e){let t=this.data.array[e*this.data.stride+this.offset+1];return this.normalized&&(t=oi(t,this.array)),t}getZ(e){let t=this.data.array[e*this.data.stride+this.offset+2];return this.normalized&&(t=oi(t,this.array)),t}getW(e){let t=this.data.array[e*this.data.stride+this.offset+3];return this.normalized&&(t=oi(t,this.array)),t}setXY(e,t,n){return e=e*this.data.stride+this.offset,this.normalized&&(t=zt(t,this.array),n=zt(n,this.array)),this.data.array[e+0]=t,this.data.array[e+1]=n,this}setXYZ(e,t,n,r){return e=e*this.data.stride+this.offset,this.normalized&&(t=zt(t,this.array),n=zt(n,this.array),r=zt(r,this.array)),this.data.array[e+0]=t,this.data.array[e+1]=n,this.data.array[e+2]=r,this}setXYZW(e,t,n,r,s){return e=e*this.data.stride+this.offset,this.normalized&&(t=zt(t,this.array),n=zt(n,this.array),r=zt(r,this.array),s=zt(s,this.array)),this.data.array[e+0]=t,this.data.array[e+1]=n,this.data.array[e+2]=r,this.data.array[e+3]=s,this}clone(e){if(e===void 0){console.log("THREE.InterleavedBufferAttribute.clone(): Cloning an interleaved buffer attribute will de-interleave buffer data.");const t=[];for(let n=0;n<this.count;n++){const r=n*this.data.stride+this.offset;for(let s=0;s<this.itemSize;s++)t.push(this.data.array[r+s])}return new wn(new this.array.constructor(t),this.itemSize,this.normalized)}else return e.interleavedBuffers===void 0&&(e.interleavedBuffers={}),e.interleavedBuffers[this.data.uuid]===void 0&&(e.interleavedBuffers[this.data.uuid]=this.data.clone(e)),new Kl(e.interleavedBuffers[this.data.uuid],this.itemSize,this.offset,this.normalized)}toJSON(e){if(e===void 0){console.log("THREE.InterleavedBufferAttribute.toJSON(): Serializing an interleaved buffer attribute will de-interleave buffer data.");const t=[];for(let n=0;n<this.count;n++){const r=n*this.data.stride+this.offset;for(let s=0;s<this.itemSize;s++)t.push(this.data.array[r+s])}return{itemSize:this.itemSize,type:this.array.constructor.name,array:t,normalized:this.normalized}}else return e.interleavedBuffers===void 0&&(e.interleavedBuffers={}),e.interleavedBuffers[this.data.uuid]===void 0&&(e.interleavedBuffers[this.data.uuid]=this.data.toJSON(e)),{isInterleavedBufferAttribute:!0,itemSize:this.itemSize,data:this.data.uuid,offset:this.offset,normalized:this.normalized}}}const cu=new A,lu=new vt,hu=new vt,q_=new A,uu=new rt,Fo=new A,dc=new xi,du=new rt,fc=new Ts;class j_ extends jt{constructor(e,t){super(e,t),this.isSkinnedMesh=!0,this.type="SkinnedMesh",this.bindMode=uh,this.bindMatrix=new rt,this.bindMatrixInverse=new rt,this.boundingBox=null,this.boundingSphere=null}computeBoundingBox(){const e=this.geometry;this.boundingBox===null&&(this.boundingBox=new an),this.boundingBox.makeEmpty();const t=e.getAttribute("position");for(let n=0;n<t.count;n++)this.getVertexPosition(n,Fo),this.boundingBox.expandByPoint(Fo)}computeBoundingSphere(){const e=this.geometry;this.boundingSphere===null&&(this.boundingSphere=new xi),this.boundingSphere.makeEmpty();const t=e.getAttribute("position");for(let n=0;n<t.count;n++)this.getVertexPosition(n,Fo),this.boundingSphere.expandByPoint(Fo)}copy(e,t){return super.copy(e,t),this.bindMode=e.bindMode,this.bindMatrix.copy(e.bindMatrix),this.bindMatrixInverse.copy(e.bindMatrixInverse),this.skeleton=e.skeleton,e.boundingBox!==null&&(this.boundingBox=e.boundingBox.clone()),e.boundingSphere!==null&&(this.boundingSphere=e.boundingSphere.clone()),this}raycast(e,t){const n=this.material,r=this.matrixWorld;n!==void 0&&(this.boundingSphere===null&&this.computeBoundingSphere(),dc.copy(this.boundingSphere),dc.applyMatrix4(r),e.ray.intersectsSphere(dc)!==!1&&(du.copy(r).invert(),fc.copy(e.ray).applyMatrix4(du),!(this.boundingBox!==null&&fc.intersectsBox(this.boundingBox)===!1)&&this._computeIntersections(e,t,fc)))}getVertexPosition(e,t){return super.getVertexPosition(e,t),this.applyBoneTransform(e,t),t}bind(e,t){this.skeleton=e,t===void 0&&(this.updateMatrixWorld(!0),this.skeleton.calculateInverses(),t=this.matrixWorld),this.bindMatrix.copy(t),this.bindMatrixInverse.copy(t).invert()}pose(){this.skeleton.pose()}normalizeSkinWeights(){const e=new vt,t=this.geometry.attributes.skinWeight;for(let n=0,r=t.count;n<r;n++){e.fromBufferAttribute(t,n);const s=1/e.manhattanLength();s!==1/0?e.multiplyScalar(s):e.set(1,0,0,0),t.setXYZW(n,e.x,e.y,e.z,e.w)}}updateMatrixWorld(e){super.updateMatrixWorld(e),this.bindMode===uh?this.bindMatrixInverse.copy(this.matrixWorld).invert():this.bindMode===np?this.bindMatrixInverse.copy(this.bindMatrix).invert():console.warn("THREE.SkinnedMesh: Unrecognized bindMode: "+this.bindMode)}applyBoneTransform(e,t){const n=this.skeleton,r=this.geometry;lu.fromBufferAttribute(r.attributes.skinIndex,e),hu.fromBufferAttribute(r.attributes.skinWeight,e),cu.copy(t).applyMatrix4(this.bindMatrix),t.set(0,0,0);for(let s=0;s<4;s++){const o=hu.getComponent(s);if(o!==0){const a=lu.getComponent(s);uu.multiplyMatrices(n.bones[a].matrixWorld,n.boneInverses[a]),t.addScaledVector(q_.copy(cu).applyMatrix4(uu),o)}}return t.applyMatrix4(this.bindMatrixInverse)}}class Yl extends en{constructor(){super(),this.isBone=!0,this.type="Bone"}}class Dd extends hn{constructor(e=null,t=1,n=1,r,s,o,a,c,l=Cn,h=Cn,u,d){super(null,o,a,c,l,h,r,s,u,d),this.isDataTexture=!0,this.image={data:e,width:t,height:n},this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}}const fu=new rt,X_=new rt;class Ta{constructor(e=[],t=[]){this.uuid=ci(),this.bones=e.slice(0),this.boneInverses=t,this.boneMatrices=null,this.boneTexture=null,this.init()}init(){const e=this.bones,t=this.boneInverses;if(this.boneMatrices=new Float32Array(e.length*16),t.length===0)this.calculateInverses();else if(e.length!==t.length){console.warn("THREE.Skeleton: Number of inverse bone matrices does not match amount of bones."),this.boneInverses=[];for(let n=0,r=this.bones.length;n<r;n++)this.boneInverses.push(new rt)}}calculateInverses(){this.boneInverses.length=0;for(let e=0,t=this.bones.length;e<t;e++){const n=new rt;this.bones[e]&&n.copy(this.bones[e].matrixWorld).invert(),this.boneInverses.push(n)}}pose(){for(let e=0,t=this.bones.length;e<t;e++){const n=this.bones[e];n&&n.matrixWorld.copy(this.boneInverses[e]).invert()}for(let e=0,t=this.bones.length;e<t;e++){const n=this.bones[e];n&&(n.parent&&n.parent.isBone?(n.matrix.copy(n.parent.matrixWorld).invert(),n.matrix.multiply(n.matrixWorld)):n.matrix.copy(n.matrixWorld),n.matrix.decompose(n.position,n.quaternion,n.scale))}}update(){const e=this.bones,t=this.boneInverses,n=this.boneMatrices,r=this.boneTexture;for(let s=0,o=e.length;s<o;s++){const a=e[s]?e[s].matrixWorld:X_;fu.multiplyMatrices(a,t[s]),fu.toArray(n,s*16)}r!==null&&(r.needsUpdate=!0)}clone(){return new Ta(this.bones,this.boneInverses)}computeBoneTexture(){let e=Math.sqrt(this.bones.length*4);e=Math.ceil(e/4)*4,e=Math.max(e,4);const t=new Float32Array(e*e*4);t.set(this.boneMatrices);const n=new Dd(t,e,e,Zn,ai);return n.needsUpdate=!0,this.boneMatrices=t,this.boneTexture=n,this}getBoneByName(e){for(let t=0,n=this.bones.length;t<n;t++){const r=this.bones[t];if(r.name===e)return r}}dispose(){this.boneTexture!==null&&(this.boneTexture.dispose(),this.boneTexture=null)}fromJSON(e,t){this.uuid=e.uuid;for(let n=0,r=e.bones.length;n<r;n++){const s=e.bones[n];let o=t[s];o===void 0&&(console.warn("THREE.Skeleton: No bone found with UUID:",s),o=new Yl),this.bones.push(o),this.boneInverses.push(new rt().fromArray(e.boneInverses[n]))}return this.init(),this}toJSON(){const e={metadata:{version:4.6,type:"Skeleton",generator:"Skeleton.toJSON"},bones:[],boneInverses:[]};e.uuid=this.uuid;const t=this.bones,n=this.boneInverses;for(let r=0,s=t.length;r<s;r++){const o=t[r];e.bones.push(o.uuid);const a=n[r];e.boneInverses.push(a.toArray())}return e}}class vl extends wn{constructor(e,t,n,r=1){super(e,t,n),this.isInstancedBufferAttribute=!0,this.meshPerAttribute=r}copy(e){return super.copy(e),this.meshPerAttribute=e.meshPerAttribute,this}toJSON(){const e=super.toJSON();return e.meshPerAttribute=this.meshPerAttribute,e.isInstancedBufferAttribute=!0,e}}const $r=new rt,pu=new rt,Oo=[],mu=new an,Q_=new rt,Hs=new jt,Vs=new xi;class K_ extends jt{constructor(e,t,n){super(e,t),this.isInstancedMesh=!0,this.instanceMatrix=new vl(new Float32Array(n*16),16),this.instanceColor=null,this.morphTexture=null,this.count=n,this.boundingBox=null,this.boundingSphere=null;for(let r=0;r<n;r++)this.setMatrixAt(r,Q_)}computeBoundingBox(){const e=this.geometry,t=this.count;this.boundingBox===null&&(this.boundingBox=new an),e.boundingBox===null&&e.computeBoundingBox(),this.boundingBox.makeEmpty();for(let n=0;n<t;n++)this.getMatrixAt(n,$r),mu.copy(e.boundingBox).applyMatrix4($r),this.boundingBox.union(mu)}computeBoundingSphere(){const e=this.geometry,t=this.count;this.boundingSphere===null&&(this.boundingSphere=new xi),e.boundingSphere===null&&e.computeBoundingSphere(),this.boundingSphere.makeEmpty();for(let n=0;n<t;n++)this.getMatrixAt(n,$r),Vs.copy(e.boundingSphere).applyMatrix4($r),this.boundingSphere.union(Vs)}copy(e,t){return super.copy(e,t),this.instanceMatrix.copy(e.instanceMatrix),e.morphTexture!==null&&(this.morphTexture=e.morphTexture.clone()),e.instanceColor!==null&&(this.instanceColor=e.instanceColor.clone()),this.count=e.count,e.boundingBox!==null&&(this.boundingBox=e.boundingBox.clone()),e.boundingSphere!==null&&(this.boundingSphere=e.boundingSphere.clone()),this}getColorAt(e,t){t.fromArray(this.instanceColor.array,e*3)}getMatrixAt(e,t){t.fromArray(this.instanceMatrix.array,e*16)}getMorphAt(e,t){const n=t.morphTargetInfluences,r=this.morphTexture.source.data.data,s=n.length+1,o=e*s+1;for(let a=0;a<n.length;a++)n[a]=r[o+a]}raycast(e,t){const n=this.matrixWorld,r=this.count;if(Hs.geometry=this.geometry,Hs.material=this.material,Hs.material!==void 0&&(this.boundingSphere===null&&this.computeBoundingSphere(),Vs.copy(this.boundingSphere),Vs.applyMatrix4(n),e.ray.intersectsSphere(Vs)!==!1))for(let s=0;s<r;s++){this.getMatrixAt(s,$r),pu.multiplyMatrices(n,$r),Hs.matrixWorld=pu,Hs.raycast(e,Oo);for(let o=0,a=Oo.length;o<a;o++){const c=Oo[o];c.instanceId=s,c.object=this,t.push(c)}Oo.length=0}}setColorAt(e,t){this.instanceColor===null&&(this.instanceColor=new vl(new Float32Array(this.instanceMatrix.count*3).fill(1),3)),t.toArray(this.instanceColor.array,e*3)}setMatrixAt(e,t){t.toArray(this.instanceMatrix.array,e*16)}setMorphAt(e,t){const n=t.morphTargetInfluences,r=n.length+1;this.morphTexture===null&&(this.morphTexture=new Dd(new Float32Array(r*this.count),r,this.count,Bl,ai));const s=this.morphTexture.source.data.data;let o=0;for(let l=0;l<n.length;l++)o+=n[l];const a=this.geometry.morphTargetsRelative?1:1-o,c=r*e;s[c]=a,s.set(n,c+1)}updateMorphTargets(){}dispose(){return this.dispatchEvent({type:"dispose"}),this.morphTexture!==null&&(this.morphTexture.dispose(),this.morphTexture=null),this}}class Id extends li{static get type(){return"LineBasicMaterial"}constructor(e){super(),this.isLineBasicMaterial=!0,this.color=new it(16777215),this.map=null,this.linewidth=1,this.linecap="round",this.linejoin="round",this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.linewidth=e.linewidth,this.linecap=e.linecap,this.linejoin=e.linejoin,this.fog=e.fog,this}}const ma=new A,ga=new A,gu=new rt,Gs=new Ts,ko=new xi,pc=new A,bu=new A;class $l extends en{constructor(e=new vi,t=new Id){super(),this.isLine=!0,this.type="Line",this.geometry=e,this.material=t,this.updateMorphTargets()}copy(e,t){return super.copy(e,t),this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}computeLineDistances(){const e=this.geometry;if(e.index===null){const t=e.attributes.position,n=[0];for(let r=1,s=t.count;r<s;r++)ma.fromBufferAttribute(t,r-1),ga.fromBufferAttribute(t,r),n[r]=n[r-1],n[r]+=ma.distanceTo(ga);e.setAttribute("lineDistance",new Hi(n,1))}else console.warn("THREE.Line.computeLineDistances(): Computation only possible with non-indexed BufferGeometry.");return this}raycast(e,t){const n=this.geometry,r=this.matrixWorld,s=e.params.Line.threshold,o=n.drawRange;if(n.boundingSphere===null&&n.computeBoundingSphere(),ko.copy(n.boundingSphere),ko.applyMatrix4(r),ko.radius+=s,e.ray.intersectsSphere(ko)===!1)return;gu.copy(r).invert(),Gs.copy(e.ray).applyMatrix4(gu);const a=s/((this.scale.x+this.scale.y+this.scale.z)/3),c=a*a,l=this.isLineSegments?2:1,h=n.index,d=n.attributes.position;if(h!==null){const p=Math.max(0,o.start),g=Math.min(h.count,o.start+o.count);for(let b=p,m=g-1;b<m;b+=l){const f=h.getX(b),y=h.getX(b+1),x=Bo(this,e,Gs,c,f,y);x&&t.push(x)}if(this.isLineLoop){const b=h.getX(g-1),m=h.getX(p),f=Bo(this,e,Gs,c,b,m);f&&t.push(f)}}else{const p=Math.max(0,o.start),g=Math.min(d.count,o.start+o.count);for(let b=p,m=g-1;b<m;b+=l){const f=Bo(this,e,Gs,c,b,b+1);f&&t.push(f)}if(this.isLineLoop){const b=Bo(this,e,Gs,c,g-1,p);b&&t.push(b)}}}updateMorphTargets(){const t=this.geometry.morphAttributes,n=Object.keys(t);if(n.length>0){const r=t[n[0]];if(r!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let s=0,o=r.length;s<o;s++){const a=r[s].name||String(s);this.morphTargetInfluences.push(0),this.morphTargetDictionary[a]=s}}}}}function Bo(i,e,t,n,r,s){const o=i.geometry.attributes.position;if(ma.fromBufferAttribute(o,r),ga.fromBufferAttribute(o,s),t.distanceSqToSegment(ma,ga,pc,bu)>n)return;pc.applyMatrix4(i.matrixWorld);const c=e.ray.origin.distanceTo(pc);if(!(c<e.near||c>e.far))return{distance:c,point:bu.clone().applyMatrix4(i.matrixWorld),index:r,face:null,faceIndex:null,barycoord:null,object:i}}const _u=new A,xu=new A;class Y_ extends $l{constructor(e,t){super(e,t),this.isLineSegments=!0,this.type="LineSegments"}computeLineDistances(){const e=this.geometry;if(e.index===null){const t=e.attributes.position,n=[];for(let r=0,s=t.count;r<s;r+=2)_u.fromBufferAttribute(t,r),xu.fromBufferAttribute(t,r+1),n[r]=r===0?0:n[r-1],n[r+1]=n[r]+_u.distanceTo(xu);e.setAttribute("lineDistance",new Hi(n,1))}else console.warn("THREE.LineSegments.computeLineDistances(): Computation only possible with non-indexed BufferGeometry.");return this}}class $_ extends $l{constructor(e,t){super(e,t),this.isLineLoop=!0,this.type="LineLoop"}}class Nd extends li{static get type(){return"PointsMaterial"}constructor(e){super(),this.isPointsMaterial=!0,this.color=new it(16777215),this.map=null,this.alphaMap=null,this.size=1,this.sizeAttenuation=!0,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.alphaMap=e.alphaMap,this.size=e.size,this.sizeAttenuation=e.sizeAttenuation,this.fog=e.fog,this}}const vu=new rt,yl=new Ts,zo=new xi,Ho=new A;class Z_ extends en{constructor(e=new vi,t=new Nd){super(),this.isPoints=!0,this.type="Points",this.geometry=e,this.material=t,this.updateMorphTargets()}copy(e,t){return super.copy(e,t),this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}raycast(e,t){const n=this.geometry,r=this.matrixWorld,s=e.params.Points.threshold,o=n.drawRange;if(n.boundingSphere===null&&n.computeBoundingSphere(),zo.copy(n.boundingSphere),zo.applyMatrix4(r),zo.radius+=s,e.ray.intersectsSphere(zo)===!1)return;vu.copy(r).invert(),yl.copy(e.ray).applyMatrix4(vu);const a=s/((this.scale.x+this.scale.y+this.scale.z)/3),c=a*a,l=n.index,u=n.attributes.position;if(l!==null){const d=Math.max(0,o.start),p=Math.min(l.count,o.start+o.count);for(let g=d,b=p;g<b;g++){const m=l.getX(g);Ho.fromBufferAttribute(u,m),yu(Ho,m,c,r,e,t,this)}}else{const d=Math.max(0,o.start),p=Math.min(u.count,o.start+o.count);for(let g=d,b=p;g<b;g++)Ho.fromBufferAttribute(u,g),yu(Ho,g,c,r,e,t,this)}}updateMorphTargets(){const t=this.geometry.morphAttributes,n=Object.keys(t);if(n.length>0){const r=t[n[0]];if(r!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let s=0,o=r.length;s<o;s++){const a=r[s].name||String(s);this.morphTargetInfluences.push(0),this.morphTargetDictionary[a]=s}}}}}function yu(i,e,t,n,r,s,o){const a=yl.distanceSqToPoint(i);if(a<t){const c=new A;yl.closestPointToPoint(i,c),c.applyMatrix4(n);const l=r.ray.origin.distanceTo(c);if(l<r.near||l>r.far)return;s.push({distance:l,distanceToRay:Math.sqrt(a),point:c,index:e,face:null,faceIndex:null,barycoord:null,object:o})}}class J_ extends hn{constructor(e,t,n,r,s,o,a,c,l){super(e,t,n,r,s,o,a,c,l),this.isCanvasTexture=!0,this.needsUpdate=!0}}class ex extends li{static get type(){return"ShadowMaterial"}constructor(e){super(),this.isShadowMaterial=!0,this.color=new it(0),this.transparent=!0,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.fog=e.fog,this}}class Ir extends li{static get type(){return"MeshStandardMaterial"}constructor(e){super(),this.isMeshStandardMaterial=!0,this.defines={STANDARD:""},this.color=new it(16777215),this.roughness=1,this.metalness=0,this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.emissive=new it(0),this.emissiveIntensity=1,this.emissiveMap=null,this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=md,this.normalScale=new at(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.roughnessMap=null,this.metalnessMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new _i,this.envMapIntensity=1,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.flatShading=!1,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.defines={STANDARD:""},this.color.copy(e.color),this.roughness=e.roughness,this.metalness=e.metalness,this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.emissive.copy(e.emissive),this.emissiveMap=e.emissiveMap,this.emissiveIntensity=e.emissiveIntensity,this.bumpMap=e.bumpMap,this.bumpScale=e.bumpScale,this.normalMap=e.normalMap,this.normalMapType=e.normalMapType,this.normalScale.copy(e.normalScale),this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.roughnessMap=e.roughnessMap,this.metalnessMap=e.metalnessMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.envMapRotation.copy(e.envMapRotation),this.envMapIntensity=e.envMapIntensity,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.flatShading=e.flatShading,this.fog=e.fog,this}}class yi extends Ir{static get type(){return"MeshPhysicalMaterial"}constructor(e){super(),this.isMeshPhysicalMaterial=!0,this.defines={STANDARD:"",PHYSICAL:""},this.anisotropyRotation=0,this.anisotropyMap=null,this.clearcoatMap=null,this.clearcoatRoughness=0,this.clearcoatRoughnessMap=null,this.clearcoatNormalScale=new at(1,1),this.clearcoatNormalMap=null,this.ior=1.5,Object.defineProperty(this,"reflectivity",{get:function(){return xn(2.5*(this.ior-1)/(this.ior+1),0,1)},set:function(t){this.ior=(1+.4*t)/(1-.4*t)}}),this.iridescenceMap=null,this.iridescenceIOR=1.3,this.iridescenceThicknessRange=[100,400],this.iridescenceThicknessMap=null,this.sheenColor=new it(0),this.sheenColorMap=null,this.sheenRoughness=1,this.sheenRoughnessMap=null,this.transmissionMap=null,this.thickness=0,this.thicknessMap=null,this.attenuationDistance=1/0,this.attenuationColor=new it(1,1,1),this.specularIntensity=1,this.specularIntensityMap=null,this.specularColor=new it(1,1,1),this.specularColorMap=null,this._anisotropy=0,this._clearcoat=0,this._dispersion=0,this._iridescence=0,this._sheen=0,this._transmission=0,this.setValues(e)}get anisotropy(){return this._anisotropy}set anisotropy(e){this._anisotropy>0!=e>0&&this.version++,this._anisotropy=e}get clearcoat(){return this._clearcoat}set clearcoat(e){this._clearcoat>0!=e>0&&this.version++,this._clearcoat=e}get iridescence(){return this._iridescence}set iridescence(e){this._iridescence>0!=e>0&&this.version++,this._iridescence=e}get dispersion(){return this._dispersion}set dispersion(e){this._dispersion>0!=e>0&&this.version++,this._dispersion=e}get sheen(){return this._sheen}set sheen(e){this._sheen>0!=e>0&&this.version++,this._sheen=e}get transmission(){return this._transmission}set transmission(e){this._transmission>0!=e>0&&this.version++,this._transmission=e}copy(e){return super.copy(e),this.defines={STANDARD:"",PHYSICAL:""},this.anisotropy=e.anisotropy,this.anisotropyRotation=e.anisotropyRotation,this.anisotropyMap=e.anisotropyMap,this.clearcoat=e.clearcoat,this.clearcoatMap=e.clearcoatMap,this.clearcoatRoughness=e.clearcoatRoughness,this.clearcoatRoughnessMap=e.clearcoatRoughnessMap,this.clearcoatNormalMap=e.clearcoatNormalMap,this.clearcoatNormalScale.copy(e.clearcoatNormalScale),this.dispersion=e.dispersion,this.ior=e.ior,this.iridescence=e.iridescence,this.iridescenceMap=e.iridescenceMap,this.iridescenceIOR=e.iridescenceIOR,this.iridescenceThicknessRange=[...e.iridescenceThicknessRange],this.iridescenceThicknessMap=e.iridescenceThicknessMap,this.sheen=e.sheen,this.sheenColor.copy(e.sheenColor),this.sheenColorMap=e.sheenColorMap,this.sheenRoughness=e.sheenRoughness,this.sheenRoughnessMap=e.sheenRoughnessMap,this.transmission=e.transmission,this.transmissionMap=e.transmissionMap,this.thickness=e.thickness,this.thicknessMap=e.thicknessMap,this.attenuationDistance=e.attenuationDistance,this.attenuationColor.copy(e.attenuationColor),this.specularIntensity=e.specularIntensity,this.specularIntensityMap=e.specularIntensityMap,this.specularColor.copy(e.specularColor),this.specularColorMap=e.specularColorMap,this}}function Vo(i,e,t){return!i||!t&&i.constructor===e?i:typeof e.BYTES_PER_ELEMENT=="number"?new e(i):Array.prototype.slice.call(i)}function tx(i){return ArrayBuffer.isView(i)&&!(i instanceof DataView)}function nx(i){function e(r,s){return i[r]-i[s]}const t=i.length,n=new Array(t);for(let r=0;r!==t;++r)n[r]=r;return n.sort(e),n}function Mu(i,e,t){const n=i.length,r=new i.constructor(n);for(let s=0,o=0;o!==n;++s){const a=t[s]*e;for(let c=0;c!==e;++c)r[o++]=i[a+c]}return r}function Ud(i,e,t,n){let r=1,s=i[0];for(;s!==void 0&&s[n]===void 0;)s=i[r++];if(s===void 0)return;let o=s[n];if(o!==void 0)if(Array.isArray(o))do o=s[n],o!==void 0&&(e.push(s.time),t.push.apply(t,o)),s=i[r++];while(s!==void 0);else if(o.toArray!==void 0)do o=s[n],o!==void 0&&(e.push(s.time),o.toArray(t,t.length)),s=i[r++];while(s!==void 0);else do o=s[n],o!==void 0&&(e.push(s.time),t.push(o)),s=i[r++];while(s!==void 0)}class lo{constructor(e,t,n,r){this.parameterPositions=e,this._cachedIndex=0,this.resultBuffer=r!==void 0?r:new t.constructor(n),this.sampleValues=t,this.valueSize=n,this.settings=null,this.DefaultSettings_={}}evaluate(e){const t=this.parameterPositions;let n=this._cachedIndex,r=t[n],s=t[n-1];n:{e:{let o;t:{i:if(!(e<r)){for(let a=n+2;;){if(r===void 0){if(e<s)break i;return n=t.length,this._cachedIndex=n,this.copySampleValue_(n-1)}if(n===a)break;if(s=r,r=t[++n],e<r)break e}o=t.length;break t}if(!(e>=s)){const a=t[1];e<a&&(n=2,s=a);for(let c=n-2;;){if(s===void 0)return this._cachedIndex=0,this.copySampleValue_(0);if(n===c)break;if(r=s,s=t[--n-1],e>=s)break e}o=n,n=0;break t}break n}for(;n<o;){const a=n+o>>>1;e<t[a]?o=a:n=a+1}if(r=t[n],s=t[n-1],s===void 0)return this._cachedIndex=0,this.copySampleValue_(0);if(r===void 0)return n=t.length,this._cachedIndex=n,this.copySampleValue_(n-1)}this._cachedIndex=n,this.intervalChanged_(n,s,r)}return this.interpolate_(n,s,e,r)}getSettings_(){return this.settings||this.DefaultSettings_}copySampleValue_(e){const t=this.resultBuffer,n=this.sampleValues,r=this.valueSize,s=e*r;for(let o=0;o!==r;++o)t[o]=n[s+o];return t}interpolate_(){throw new Error("call to abstract method")}intervalChanged_(){}}class ix extends lo{constructor(e,t,n,r){super(e,t,n,r),this._weightPrev=-0,this._offsetPrev=-0,this._weightNext=-0,this._offsetNext=-0,this.DefaultSettings_={endingStart:dh,endingEnd:dh}}intervalChanged_(e,t,n){const r=this.parameterPositions;let s=e-2,o=e+1,a=r[s],c=r[o];if(a===void 0)switch(this.getSettings_().endingStart){case fh:s=e,a=2*t-n;break;case ph:s=r.length-2,a=t+r[s]-r[s+1];break;default:s=e,a=n}if(c===void 0)switch(this.getSettings_().endingEnd){case fh:o=e,c=2*n-t;break;case ph:o=1,c=n+r[1]-r[0];break;default:o=e-1,c=t}const l=(n-t)*.5,h=this.valueSize;this._weightPrev=l/(t-a),this._weightNext=l/(c-n),this._offsetPrev=s*h,this._offsetNext=o*h}interpolate_(e,t,n,r){const s=this.resultBuffer,o=this.sampleValues,a=this.valueSize,c=e*a,l=c-a,h=this._offsetPrev,u=this._offsetNext,d=this._weightPrev,p=this._weightNext,g=(n-t)/(r-t),b=g*g,m=b*g,f=-d*m+2*d*b-d*g,y=(1+d)*m+(-1.5-2*d)*b+(-.5+d)*g+1,x=(-1-p)*m+(1.5+p)*b+.5*g,_=p*m-p*b;for(let I=0;I!==a;++I)s[I]=f*o[h+I]+y*o[l+I]+x*o[c+I]+_*o[u+I];return s}}class rx extends lo{constructor(e,t,n,r){super(e,t,n,r)}interpolate_(e,t,n,r){const s=this.resultBuffer,o=this.sampleValues,a=this.valueSize,c=e*a,l=c-a,h=(n-t)/(r-t),u=1-h;for(let d=0;d!==a;++d)s[d]=o[l+d]*u+o[c+d]*h;return s}}class sx extends lo{constructor(e,t,n,r){super(e,t,n,r)}interpolate_(e){return this.copySampleValue_(e-1)}}class Mi{constructor(e,t,n,r){if(e===void 0)throw new Error("THREE.KeyframeTrack: track name is undefined");if(t===void 0||t.length===0)throw new Error("THREE.KeyframeTrack: no keyframes in track named "+e);this.name=e,this.times=Vo(t,this.TimeBufferType),this.values=Vo(n,this.ValueBufferType),this.setInterpolation(r||this.DefaultInterpolation)}static toJSON(e){const t=e.constructor;let n;if(t.toJSON!==this.toJSON)n=t.toJSON(e);else{n={name:e.name,times:Vo(e.times,Array),values:Vo(e.values,Array)};const r=e.getInterpolation();r!==e.DefaultInterpolation&&(n.interpolation=r)}return n.type=e.ValueTypeName,n}InterpolantFactoryMethodDiscrete(e){return new sx(this.times,this.values,this.getValueSize(),e)}InterpolantFactoryMethodLinear(e){return new rx(this.times,this.values,this.getValueSize(),e)}InterpolantFactoryMethodSmooth(e){return new ix(this.times,this.values,this.getValueSize(),e)}setInterpolation(e){let t;switch(e){case io:t=this.InterpolantFactoryMethodDiscrete;break;case ro:t=this.InterpolantFactoryMethodLinear;break;case ka:t=this.InterpolantFactoryMethodSmooth;break}if(t===void 0){const n="unsupported interpolation for "+this.ValueTypeName+" keyframe track named "+this.name;if(this.createInterpolant===void 0)if(e!==this.DefaultInterpolation)this.setInterpolation(this.DefaultInterpolation);else throw new Error(n);return console.warn("THREE.KeyframeTrack:",n),this}return this.createInterpolant=t,this}getInterpolation(){switch(this.createInterpolant){case this.InterpolantFactoryMethodDiscrete:return io;case this.InterpolantFactoryMethodLinear:return ro;case this.InterpolantFactoryMethodSmooth:return ka}}getValueSize(){return this.values.length/this.times.length}shift(e){if(e!==0){const t=this.times;for(let n=0,r=t.length;n!==r;++n)t[n]+=e}return this}scale(e){if(e!==1){const t=this.times;for(let n=0,r=t.length;n!==r;++n)t[n]*=e}return this}trim(e,t){const n=this.times,r=n.length;let s=0,o=r-1;for(;s!==r&&n[s]<e;)++s;for(;o!==-1&&n[o]>t;)--o;if(++o,s!==0||o!==r){s>=o&&(o=Math.max(o,1),s=o-1);const a=this.getValueSize();this.times=n.slice(s,o),this.values=this.values.slice(s*a,o*a)}return this}validate(){let e=!0;const t=this.getValueSize();t-Math.floor(t)!==0&&(console.error("THREE.KeyframeTrack: Invalid value size in track.",this),e=!1);const n=this.times,r=this.values,s=n.length;s===0&&(console.error("THREE.KeyframeTrack: Track is empty.",this),e=!1);let o=null;for(let a=0;a!==s;a++){const c=n[a];if(typeof c=="number"&&isNaN(c)){console.error("THREE.KeyframeTrack: Time is not a valid number.",this,a,c),e=!1;break}if(o!==null&&o>c){console.error("THREE.KeyframeTrack: Out of order keys.",this,a,c,o),e=!1;break}o=c}if(r!==void 0&&tx(r))for(let a=0,c=r.length;a!==c;++a){const l=r[a];if(isNaN(l)){console.error("THREE.KeyframeTrack: Value is not a valid number.",this,a,l),e=!1;break}}return e}optimize(){const e=this.times.slice(),t=this.values.slice(),n=this.getValueSize(),r=this.getInterpolation()===ka,s=e.length-1;let o=1;for(let a=1;a<s;++a){let c=!1;const l=e[a],h=e[a+1];if(l!==h&&(a!==1||l!==e[0]))if(r)c=!0;else{const u=a*n,d=u-n,p=u+n;for(let g=0;g!==n;++g){const b=t[u+g];if(b!==t[d+g]||b!==t[p+g]){c=!0;break}}}if(c){if(a!==o){e[o]=e[a];const u=a*n,d=o*n;for(let p=0;p!==n;++p)t[d+p]=t[u+p]}++o}}if(s>0){e[o]=e[s];for(let a=s*n,c=o*n,l=0;l!==n;++l)t[c+l]=t[a+l];++o}return o!==e.length?(this.times=e.slice(0,o),this.values=t.slice(0,o*n)):(this.times=e,this.values=t),this}clone(){const e=this.times.slice(),t=this.values.slice(),n=this.constructor,r=new n(this.name,e,t);return r.createInterpolant=this.createInterpolant,r}}Mi.prototype.TimeBufferType=Float32Array;Mi.prototype.ValueBufferType=Float32Array;Mi.prototype.DefaultInterpolation=ro;class Ls extends Mi{constructor(e,t,n){super(e,t,n)}}Ls.prototype.ValueTypeName="bool";Ls.prototype.ValueBufferType=Array;Ls.prototype.DefaultInterpolation=io;Ls.prototype.InterpolantFactoryMethodLinear=void 0;Ls.prototype.InterpolantFactoryMethodSmooth=void 0;class Fd extends Mi{}Fd.prototype.ValueTypeName="color";class Ss extends Mi{}Ss.prototype.ValueTypeName="number";class ox extends lo{constructor(e,t,n,r){super(e,t,n,r)}interpolate_(e,t,n,r){const s=this.resultBuffer,o=this.sampleValues,a=this.valueSize,c=(n-t)/(r-t);let l=e*a;for(let h=l+a;l!==h;l+=4)Ve.slerpFlat(s,0,o,l-a,o,l,c);return s}}class ws extends Mi{InterpolantFactoryMethodLinear(e){return new ox(this.times,this.values,this.getValueSize(),e)}}ws.prototype.ValueTypeName="quaternion";ws.prototype.InterpolantFactoryMethodSmooth=void 0;class Ds extends Mi{constructor(e,t,n){super(e,t,n)}}Ds.prototype.ValueTypeName="string";Ds.prototype.ValueBufferType=Array;Ds.prototype.DefaultInterpolation=io;Ds.prototype.InterpolantFactoryMethodLinear=void 0;Ds.prototype.InterpolantFactoryMethodSmooth=void 0;class Es extends Mi{}Es.prototype.ValueTypeName="vector";class ax{constructor(e="",t=-1,n=[],r=ip){this.name=e,this.tracks=n,this.duration=t,this.blendMode=r,this.uuid=ci(),this.duration<0&&this.resetDuration()}static parse(e){const t=[],n=e.tracks,r=1/(e.fps||1);for(let o=0,a=n.length;o!==a;++o)t.push(lx(n[o]).scale(r));const s=new this(e.name,e.duration,t,e.blendMode);return s.uuid=e.uuid,s}static toJSON(e){const t=[],n=e.tracks,r={name:e.name,duration:e.duration,tracks:t,uuid:e.uuid,blendMode:e.blendMode};for(let s=0,o=n.length;s!==o;++s)t.push(Mi.toJSON(n[s]));return r}static CreateFromMorphTargetSequence(e,t,n,r){const s=t.length,o=[];for(let a=0;a<s;a++){let c=[],l=[];c.push((a+s-1)%s,a,(a+1)%s),l.push(0,1,0);const h=nx(c);c=Mu(c,1,h),l=Mu(l,1,h),!r&&c[0]===0&&(c.push(s),l.push(l[0])),o.push(new Ss(".morphTargetInfluences["+t[a].name+"]",c,l).scale(1/n))}return new this(e,-1,o)}static findByName(e,t){let n=e;if(!Array.isArray(e)){const r=e;n=r.geometry&&r.geometry.animations||r.animations}for(let r=0;r<n.length;r++)if(n[r].name===t)return n[r];return null}static CreateClipsFromMorphTargetSequences(e,t,n){const r={},s=/^([\w-]*?)([\d]+)$/;for(let a=0,c=e.length;a<c;a++){const l=e[a],h=l.name.match(s);if(h&&h.length>1){const u=h[1];let d=r[u];d||(r[u]=d=[]),d.push(l)}}const o=[];for(const a in r)o.push(this.CreateFromMorphTargetSequence(a,r[a],t,n));return o}static parseAnimation(e,t){if(!e)return console.error("THREE.AnimationClip: No animation in JSONLoader data."),null;const n=function(u,d,p,g,b){if(p.length!==0){const m=[],f=[];Ud(p,m,f,g),m.length!==0&&b.push(new u(d,m,f))}},r=[],s=e.name||"default",o=e.fps||30,a=e.blendMode;let c=e.length||-1;const l=e.hierarchy||[];for(let u=0;u<l.length;u++){const d=l[u].keys;if(!(!d||d.length===0))if(d[0].morphTargets){const p={};let g;for(g=0;g<d.length;g++)if(d[g].morphTargets)for(let b=0;b<d[g].morphTargets.length;b++)p[d[g].morphTargets[b]]=-1;for(const b in p){const m=[],f=[];for(let y=0;y!==d[g].morphTargets.length;++y){const x=d[g];m.push(x.time),f.push(x.morphTarget===b?1:0)}r.push(new Ss(".morphTargetInfluence["+b+"]",m,f))}c=p.length*o}else{const p=".bones["+t[u].name+"]";n(Es,p+".position",d,"pos",r),n(ws,p+".quaternion",d,"rot",r),n(Es,p+".scale",d,"scl",r)}}return r.length===0?null:new this(s,c,r,a)}resetDuration(){const e=this.tracks;let t=0;for(let n=0,r=e.length;n!==r;++n){const s=this.tracks[n];t=Math.max(t,s.times[s.times.length-1])}return this.duration=t,this}trim(){for(let e=0;e<this.tracks.length;e++)this.tracks[e].trim(0,this.duration);return this}validate(){let e=!0;for(let t=0;t<this.tracks.length;t++)e=e&&this.tracks[t].validate();return e}optimize(){for(let e=0;e<this.tracks.length;e++)this.tracks[e].optimize();return this}clone(){const e=[];for(let t=0;t<this.tracks.length;t++)e.push(this.tracks[t].clone());return new this.constructor(this.name,this.duration,e,this.blendMode)}toJSON(){return this.constructor.toJSON(this)}}function cx(i){switch(i.toLowerCase()){case"scalar":case"double":case"float":case"number":case"integer":return Ss;case"vector":case"vector2":case"vector3":case"vector4":return Es;case"color":return Fd;case"quaternion":return ws;case"bool":case"boolean":return Ls;case"string":return Ds}throw new Error("THREE.KeyframeTrack: Unsupported typeName: "+i)}function lx(i){if(i.type===void 0)throw new Error("THREE.KeyframeTrack: track type undefined, can not parse");const e=cx(i.type);if(i.times===void 0){const t=[],n=[];Ud(i.keys,t,n,"value"),i.times=t,i.values=n}return e.parse!==void 0?e.parse(i):new e(i.name,i.times,i.values,i.interpolation)}const or={enabled:!1,files:{},add:function(i,e){this.enabled!==!1&&(this.files[i]=e)},get:function(i){if(this.enabled!==!1)return this.files[i]},remove:function(i){delete this.files[i]},clear:function(){this.files={}}};class hx{constructor(e,t,n){const r=this;let s=!1,o=0,a=0,c;const l=[];this.onStart=void 0,this.onLoad=e,this.onProgress=t,this.onError=n,this.itemStart=function(h){a++,s===!1&&r.onStart!==void 0&&r.onStart(h,o,a),s=!0},this.itemEnd=function(h){o++,r.onProgress!==void 0&&r.onProgress(h,o,a),o===a&&(s=!1,r.onLoad!==void 0&&r.onLoad())},this.itemError=function(h){r.onError!==void 0&&r.onError(h)},this.resolveURL=function(h){return c?c(h):h},this.setURLModifier=function(h){return c=h,this},this.addHandler=function(h,u){return l.push(h,u),this},this.removeHandler=function(h){const u=l.indexOf(h);return u!==-1&&l.splice(u,2),this},this.getHandler=function(h){for(let u=0,d=l.length;u<d;u+=2){const p=l[u],g=l[u+1];if(p.global&&(p.lastIndex=0),p.test(h))return g}return null}}}const ux=new hx;class Is{constructor(e){this.manager=e!==void 0?e:ux,this.crossOrigin="anonymous",this.withCredentials=!1,this.path="",this.resourcePath="",this.requestHeader={}}load(){}loadAsync(e,t){const n=this;return new Promise(function(r,s){n.load(e,r,t,s)})}parse(){}setCrossOrigin(e){return this.crossOrigin=e,this}setWithCredentials(e){return this.withCredentials=e,this}setPath(e){return this.path=e,this}setResourcePath(e){return this.resourcePath=e,this}setRequestHeader(e){return this.requestHeader=e,this}}Is.DEFAULT_MATERIAL_NAME="__DEFAULT";const Pi={};class dx extends Error{constructor(e,t){super(e),this.response=t}}class Od extends Is{constructor(e){super(e)}load(e,t,n,r){e===void 0&&(e=""),this.path!==void 0&&(e=this.path+e),e=this.manager.resolveURL(e);const s=or.get(e);if(s!==void 0)return this.manager.itemStart(e),setTimeout(()=>{t&&t(s),this.manager.itemEnd(e)},0),s;if(Pi[e]!==void 0){Pi[e].push({onLoad:t,onProgress:n,onError:r});return}Pi[e]=[],Pi[e].push({onLoad:t,onProgress:n,onError:r});const o=new Request(e,{headers:new Headers(this.requestHeader),credentials:this.withCredentials?"include":"same-origin"}),a=this.mimeType,c=this.responseType;fetch(o).then(l=>{if(l.status===200||l.status===0){if(l.status===0&&console.warn("THREE.FileLoader: HTTP Status 0 received."),typeof ReadableStream>"u"||l.body===void 0||l.body.getReader===void 0)return l;const h=Pi[e],u=l.body.getReader(),d=l.headers.get("X-File-Size")||l.headers.get("Content-Length"),p=d?parseInt(d):0,g=p!==0;let b=0;const m=new ReadableStream({start(f){y();function y(){u.read().then(({done:x,value:_})=>{if(x)f.close();else{b+=_.byteLength;const I=new ProgressEvent("progress",{lengthComputable:g,loaded:b,total:p});for(let L=0,C=h.length;L<C;L++){const F=h[L];F.onProgress&&F.onProgress(I)}f.enqueue(_),y()}},x=>{f.error(x)})}}});return new Response(m)}else throw new dx(`fetch for "${l.url}" responded with ${l.status}: ${l.statusText}`,l)}).then(l=>{switch(c){case"arraybuffer":return l.arrayBuffer();case"blob":return l.blob();case"document":return l.text().then(h=>new DOMParser().parseFromString(h,a));case"json":return l.json();default:if(a===void 0)return l.text();{const u=/charset="?([^;"\s]*)"?/i.exec(a),d=u&&u[1]?u[1].toLowerCase():void 0,p=new TextDecoder(d);return l.arrayBuffer().then(g=>p.decode(g))}}}).then(l=>{or.add(e,l);const h=Pi[e];delete Pi[e];for(let u=0,d=h.length;u<d;u++){const p=h[u];p.onLoad&&p.onLoad(l)}}).catch(l=>{const h=Pi[e];if(h===void 0)throw this.manager.itemError(e),l;delete Pi[e];for(let u=0,d=h.length;u<d;u++){const p=h[u];p.onError&&p.onError(l)}this.manager.itemError(e)}).finally(()=>{this.manager.itemEnd(e)}),this.manager.itemStart(e)}setResponseType(e){return this.responseType=e,this}setMimeType(e){return this.mimeType=e,this}}class fx extends Is{constructor(e){super(e)}load(e,t,n,r){this.path!==void 0&&(e=this.path+e),e=this.manager.resolveURL(e);const s=this,o=or.get(e);if(o!==void 0)return s.manager.itemStart(e),setTimeout(function(){t&&t(o),s.manager.itemEnd(e)},0),o;const a=so("img");function c(){h(),or.add(e,this),t&&t(this),s.manager.itemEnd(e)}function l(u){h(),r&&r(u),s.manager.itemError(e),s.manager.itemEnd(e)}function h(){a.removeEventListener("load",c,!1),a.removeEventListener("error",l,!1)}return a.addEventListener("load",c,!1),a.addEventListener("error",l,!1),e.slice(0,5)!=="data:"&&this.crossOrigin!==void 0&&(a.crossOrigin=this.crossOrigin),s.manager.itemStart(e),a.src=e,a}}class px extends Is{constructor(e){super(e)}load(e,t,n,r){const s=new hn,o=new fx(this.manager);return o.setCrossOrigin(this.crossOrigin),o.setPath(this.path),o.load(e,function(a){s.image=a,s.needsUpdate=!0,t!==void 0&&t(s)},n,r),s}}class Ra extends en{constructor(e,t=1){super(),this.isLight=!0,this.type="Light",this.color=new it(e),this.intensity=t}dispose(){}copy(e,t){return super.copy(e,t),this.color.copy(e.color),this.intensity=e.intensity,this}toJSON(e){const t=super.toJSON(e);return t.object.color=this.color.getHex(),t.object.intensity=this.intensity,this.groundColor!==void 0&&(t.object.groundColor=this.groundColor.getHex()),this.distance!==void 0&&(t.object.distance=this.distance),this.angle!==void 0&&(t.object.angle=this.angle),this.decay!==void 0&&(t.object.decay=this.decay),this.penumbra!==void 0&&(t.object.penumbra=this.penumbra),this.shadow!==void 0&&(t.object.shadow=this.shadow.toJSON()),this.target!==void 0&&(t.object.target=this.target.uuid),t}}class kd extends Ra{constructor(e,t,n){super(e,n),this.isHemisphereLight=!0,this.type="HemisphereLight",this.position.copy(en.DEFAULT_UP),this.updateMatrix(),this.groundColor=new it(t)}copy(e,t){return super.copy(e,t),this.groundColor.copy(e.groundColor),this}}const mc=new rt,Su=new A,wu=new A;class Zl{constructor(e){this.camera=e,this.intensity=1,this.bias=0,this.normalBias=0,this.radius=1,this.blurSamples=8,this.mapSize=new at(512,512),this.map=null,this.mapPass=null,this.matrix=new rt,this.autoUpdate=!0,this.needsUpdate=!1,this._frustum=new ql,this._frameExtents=new at(1,1),this._viewportCount=1,this._viewports=[new vt(0,0,1,1)]}getViewportCount(){return this._viewportCount}getFrustum(){return this._frustum}updateMatrices(e){const t=this.camera,n=this.matrix;Su.setFromMatrixPosition(e.matrixWorld),t.position.copy(Su),wu.setFromMatrixPosition(e.target.matrixWorld),t.lookAt(wu),t.updateMatrixWorld(),mc.multiplyMatrices(t.projectionMatrix,t.matrixWorldInverse),this._frustum.setFromProjectionMatrix(mc),n.set(.5,0,0,.5,0,.5,0,.5,0,0,.5,.5,0,0,0,1),n.multiply(mc)}getViewport(e){return this._viewports[e]}getFrameExtents(){return this._frameExtents}dispose(){this.map&&this.map.dispose(),this.mapPass&&this.mapPass.dispose()}copy(e){return this.camera=e.camera.clone(),this.intensity=e.intensity,this.bias=e.bias,this.radius=e.radius,this.mapSize.copy(e.mapSize),this}clone(){return new this.constructor().copy(this)}toJSON(){const e={};return this.intensity!==1&&(e.intensity=this.intensity),this.bias!==0&&(e.bias=this.bias),this.normalBias!==0&&(e.normalBias=this.normalBias),this.radius!==1&&(e.radius=this.radius),(this.mapSize.x!==512||this.mapSize.y!==512)&&(e.mapSize=this.mapSize.toArray()),e.camera=this.camera.toJSON(!1).object,delete e.camera.matrix,e}}class mx extends Zl{constructor(){super(new vn(50,1,.5,500)),this.isSpotLightShadow=!0,this.focus=1}updateMatrices(e){const t=this.camera,n=ys*2*e.angle*this.focus,r=this.mapSize.width/this.mapSize.height,s=e.distance||t.far;(n!==t.fov||r!==t.aspect||s!==t.far)&&(t.fov=n,t.aspect=r,t.far=s,t.updateProjectionMatrix()),super.updateMatrices(e)}copy(e){return super.copy(e),this.focus=e.focus,this}}class gx extends Ra{constructor(e,t,n=0,r=Math.PI/3,s=0,o=2){super(e,t),this.isSpotLight=!0,this.type="SpotLight",this.position.copy(en.DEFAULT_UP),this.updateMatrix(),this.target=new en,this.distance=n,this.angle=r,this.penumbra=s,this.decay=o,this.map=null,this.shadow=new mx}get power(){return this.intensity*Math.PI}set power(e){this.intensity=e/Math.PI}dispose(){this.shadow.dispose()}copy(e,t){return super.copy(e,t),this.distance=e.distance,this.angle=e.angle,this.penumbra=e.penumbra,this.decay=e.decay,this.target=e.target.clone(),this.shadow=e.shadow.clone(),this}}const Eu=new rt,Ws=new A,gc=new A;class bx extends Zl{constructor(){super(new vn(90,1,.5,500)),this.isPointLightShadow=!0,this._frameExtents=new at(4,2),this._viewportCount=6,this._viewports=[new vt(2,1,1,1),new vt(0,1,1,1),new vt(3,1,1,1),new vt(1,1,1,1),new vt(3,0,1,1),new vt(1,0,1,1)],this._cubeDirections=[new A(1,0,0),new A(-1,0,0),new A(0,0,1),new A(0,0,-1),new A(0,1,0),new A(0,-1,0)],this._cubeUps=[new A(0,1,0),new A(0,1,0),new A(0,1,0),new A(0,1,0),new A(0,0,1),new A(0,0,-1)]}updateMatrices(e,t=0){const n=this.camera,r=this.matrix,s=e.distance||n.far;s!==n.far&&(n.far=s,n.updateProjectionMatrix()),Ws.setFromMatrixPosition(e.matrixWorld),n.position.copy(Ws),gc.copy(n.position),gc.add(this._cubeDirections[t]),n.up.copy(this._cubeUps[t]),n.lookAt(gc),n.updateMatrixWorld(),r.makeTranslation(-Ws.x,-Ws.y,-Ws.z),Eu.multiplyMatrices(n.projectionMatrix,n.matrixWorldInverse),this._frustum.setFromProjectionMatrix(Eu)}}class Bd extends Ra{constructor(e,t,n=0,r=2){super(e,t),this.isPointLight=!0,this.type="PointLight",this.distance=n,this.decay=r,this.shadow=new bx}get power(){return this.intensity*4*Math.PI}set power(e){this.intensity=e/(4*Math.PI)}dispose(){this.shadow.dispose()}copy(e,t){return super.copy(e,t),this.distance=e.distance,this.decay=e.decay,this.shadow=e.shadow.clone(),this}}class _x extends Zl{constructor(){super(new jl(-5,5,5,-5,.5,500)),this.isDirectionalLightShadow=!0}}class ls extends Ra{constructor(e,t){super(e,t),this.isDirectionalLight=!0,this.type="DirectionalLight",this.position.copy(en.DEFAULT_UP),this.updateMatrix(),this.target=new en,this.shadow=new _x}dispose(){this.shadow.dispose()}copy(e){return super.copy(e),this.target=e.target.clone(),this.shadow=e.shadow.clone(),this}}class Js{static decodeText(e){if(console.warn("THREE.LoaderUtils: decodeText() has been deprecated with r165 and will be removed with r175. Use TextDecoder instead."),typeof TextDecoder<"u")return new TextDecoder().decode(e);let t="";for(let n=0,r=e.length;n<r;n++)t+=String.fromCharCode(e[n]);try{return decodeURIComponent(escape(t))}catch{return t}}static extractUrlBase(e){const t=e.lastIndexOf("/");return t===-1?"./":e.slice(0,t+1)}static resolveURL(e,t){return typeof e!="string"||e===""?"":(/^https?:\/\//i.test(t)&&/^\//.test(e)&&(t=t.replace(/(^https?:\/\/[^\/]+).*/i,"$1")),/^(https?:)?\/\//i.test(e)||/^data:.*,.*$/i.test(e)||/^blob:.*$/i.test(e)?e:t+e)}}class xx extends Is{constructor(e){super(e),this.isImageBitmapLoader=!0,typeof createImageBitmap>"u"&&console.warn("THREE.ImageBitmapLoader: createImageBitmap() not supported."),typeof fetch>"u"&&console.warn("THREE.ImageBitmapLoader: fetch() not supported."),this.options={premultiplyAlpha:"none"}}setOptions(e){return this.options=e,this}load(e,t,n,r){e===void 0&&(e=""),this.path!==void 0&&(e=this.path+e),e=this.manager.resolveURL(e);const s=this,o=or.get(e);if(o!==void 0){if(s.manager.itemStart(e),o.then){o.then(l=>{t&&t(l),s.manager.itemEnd(e)}).catch(l=>{r&&r(l)});return}return setTimeout(function(){t&&t(o),s.manager.itemEnd(e)},0),o}const a={};a.credentials=this.crossOrigin==="anonymous"?"same-origin":"include",a.headers=this.requestHeader;const c=fetch(e,a).then(function(l){return l.blob()}).then(function(l){return createImageBitmap(l,Object.assign(s.options,{colorSpaceConversion:"none"}))}).then(function(l){return or.add(e,l),t&&t(l),s.manager.itemEnd(e),l}).catch(function(l){r&&r(l),or.remove(e),s.manager.itemError(e),s.manager.itemEnd(e)});or.add(e,c),s.manager.itemStart(e)}}const Jl="\\[\\]\\.:\\/",vx=new RegExp("["+Jl+"]","g"),eh="[^"+Jl+"]",yx="[^"+Jl.replace("\\.","")+"]",Mx=/((?:WC+[\/:])*)/.source.replace("WC",eh),Sx=/(WCOD+)?/.source.replace("WCOD",yx),wx=/(?:\.(WC+)(?:\[(.+)\])?)?/.source.replace("WC",eh),Ex=/\.(WC+)(?:\[(.+)\])?/.source.replace("WC",eh),Ax=new RegExp("^"+Mx+Sx+wx+Ex+"$"),Tx=["material","materials","bones","map"];class Rx{constructor(e,t,n){const r=n||Ht.parseTrackName(t);this._targetGroup=e,this._bindings=e.subscribe_(t,r)}getValue(e,t){this.bind();const n=this._targetGroup.nCachedObjects_,r=this._bindings[n];r!==void 0&&r.getValue(e,t)}setValue(e,t){const n=this._bindings;for(let r=this._targetGroup.nCachedObjects_,s=n.length;r!==s;++r)n[r].setValue(e,t)}bind(){const e=this._bindings;for(let t=this._targetGroup.nCachedObjects_,n=e.length;t!==n;++t)e[t].bind()}unbind(){const e=this._bindings;for(let t=this._targetGroup.nCachedObjects_,n=e.length;t!==n;++t)e[t].unbind()}}class Ht{constructor(e,t,n){this.path=t,this.parsedPath=n||Ht.parseTrackName(t),this.node=Ht.findNode(e,this.parsedPath.nodeName),this.rootNode=e,this.getValue=this._getValue_unbound,this.setValue=this._setValue_unbound}static create(e,t,n){return e&&e.isAnimationObjectGroup?new Ht.Composite(e,t,n):new Ht(e,t,n)}static sanitizeNodeName(e){return e.replace(/\s/g,"_").replace(vx,"")}static parseTrackName(e){const t=Ax.exec(e);if(t===null)throw new Error("PropertyBinding: Cannot parse trackName: "+e);const n={nodeName:t[2],objectName:t[3],objectIndex:t[4],propertyName:t[5],propertyIndex:t[6]},r=n.nodeName&&n.nodeName.lastIndexOf(".");if(r!==void 0&&r!==-1){const s=n.nodeName.substring(r+1);Tx.indexOf(s)!==-1&&(n.nodeName=n.nodeName.substring(0,r),n.objectName=s)}if(n.propertyName===null||n.propertyName.length===0)throw new Error("PropertyBinding: can not parse propertyName from trackName: "+e);return n}static findNode(e,t){if(t===void 0||t===""||t==="."||t===-1||t===e.name||t===e.uuid)return e;if(e.skeleton){const n=e.skeleton.getBoneByName(t);if(n!==void 0)return n}if(e.children){const n=function(s){for(let o=0;o<s.length;o++){const a=s[o];if(a.name===t||a.uuid===t)return a;const c=n(a.children);if(c)return c}return null},r=n(e.children);if(r)return r}return null}_getValue_unavailable(){}_setValue_unavailable(){}_getValue_direct(e,t){e[t]=this.targetObject[this.propertyName]}_getValue_array(e,t){const n=this.resolvedProperty;for(let r=0,s=n.length;r!==s;++r)e[t++]=n[r]}_getValue_arrayElement(e,t){e[t]=this.resolvedProperty[this.propertyIndex]}_getValue_toArray(e,t){this.resolvedProperty.toArray(e,t)}_setValue_direct(e,t){this.targetObject[this.propertyName]=e[t]}_setValue_direct_setNeedsUpdate(e,t){this.targetObject[this.propertyName]=e[t],this.targetObject.needsUpdate=!0}_setValue_direct_setMatrixWorldNeedsUpdate(e,t){this.targetObject[this.propertyName]=e[t],this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_array(e,t){const n=this.resolvedProperty;for(let r=0,s=n.length;r!==s;++r)n[r]=e[t++]}_setValue_array_setNeedsUpdate(e,t){const n=this.resolvedProperty;for(let r=0,s=n.length;r!==s;++r)n[r]=e[t++];this.targetObject.needsUpdate=!0}_setValue_array_setMatrixWorldNeedsUpdate(e,t){const n=this.resolvedProperty;for(let r=0,s=n.length;r!==s;++r)n[r]=e[t++];this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_arrayElement(e,t){this.resolvedProperty[this.propertyIndex]=e[t]}_setValue_arrayElement_setNeedsUpdate(e,t){this.resolvedProperty[this.propertyIndex]=e[t],this.targetObject.needsUpdate=!0}_setValue_arrayElement_setMatrixWorldNeedsUpdate(e,t){this.resolvedProperty[this.propertyIndex]=e[t],this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_fromArray(e,t){this.resolvedProperty.fromArray(e,t)}_setValue_fromArray_setNeedsUpdate(e,t){this.resolvedProperty.fromArray(e,t),this.targetObject.needsUpdate=!0}_setValue_fromArray_setMatrixWorldNeedsUpdate(e,t){this.resolvedProperty.fromArray(e,t),this.targetObject.matrixWorldNeedsUpdate=!0}_getValue_unbound(e,t){this.bind(),this.getValue(e,t)}_setValue_unbound(e,t){this.bind(),this.setValue(e,t)}bind(){let e=this.node;const t=this.parsedPath,n=t.objectName,r=t.propertyName;let s=t.propertyIndex;if(e||(e=Ht.findNode(this.rootNode,t.nodeName),this.node=e),this.getValue=this._getValue_unavailable,this.setValue=this._setValue_unavailable,!e){console.warn("THREE.PropertyBinding: No target node found for track: "+this.path+".");return}if(n){let l=t.objectIndex;switch(n){case"materials":if(!e.material){console.error("THREE.PropertyBinding: Can not bind to material as node does not have a material.",this);return}if(!e.material.materials){console.error("THREE.PropertyBinding: Can not bind to material.materials as node.material does not have a materials array.",this);return}e=e.material.materials;break;case"bones":if(!e.skeleton){console.error("THREE.PropertyBinding: Can not bind to bones as node does not have a skeleton.",this);return}e=e.skeleton.bones;for(let h=0;h<e.length;h++)if(e[h].name===l){l=h;break}break;case"map":if("map"in e){e=e.map;break}if(!e.material){console.error("THREE.PropertyBinding: Can not bind to material as node does not have a material.",this);return}if(!e.material.map){console.error("THREE.PropertyBinding: Can not bind to material.map as node.material does not have a map.",this);return}e=e.material.map;break;default:if(e[n]===void 0){console.error("THREE.PropertyBinding: Can not bind to objectName of node undefined.",this);return}e=e[n]}if(l!==void 0){if(e[l]===void 0){console.error("THREE.PropertyBinding: Trying to bind to objectIndex of objectName, but is undefined.",this,e);return}e=e[l]}}const o=e[r];if(o===void 0){const l=t.nodeName;console.error("THREE.PropertyBinding: Trying to update property for track: "+l+"."+r+" but it wasn't found.",e);return}let a=this.Versioning.None;this.targetObject=e,e.needsUpdate!==void 0?a=this.Versioning.NeedsUpdate:e.matrixWorldNeedsUpdate!==void 0&&(a=this.Versioning.MatrixWorldNeedsUpdate);let c=this.BindingType.Direct;if(s!==void 0){if(r==="morphTargetInfluences"){if(!e.geometry){console.error("THREE.PropertyBinding: Can not bind to morphTargetInfluences because node does not have a geometry.",this);return}if(!e.geometry.morphAttributes){console.error("THREE.PropertyBinding: Can not bind to morphTargetInfluences because node does not have a geometry.morphAttributes.",this);return}e.morphTargetDictionary[s]!==void 0&&(s=e.morphTargetDictionary[s])}c=this.BindingType.ArrayElement,this.resolvedProperty=o,this.propertyIndex=s}else o.fromArray!==void 0&&o.toArray!==void 0?(c=this.BindingType.HasFromToArray,this.resolvedProperty=o):Array.isArray(o)?(c=this.BindingType.EntireArray,this.resolvedProperty=o):this.propertyName=r;this.getValue=this.GetterByBindingType[c],this.setValue=this.SetterByBindingTypeAndVersioning[c][a]}unbind(){this.node=null,this.getValue=this._getValue_unbound,this.setValue=this._setValue_unbound}}Ht.Composite=Rx;Ht.prototype.BindingType={Direct:0,EntireArray:1,ArrayElement:2,HasFromToArray:3};Ht.prototype.Versioning={None:0,NeedsUpdate:1,MatrixWorldNeedsUpdate:2};Ht.prototype.GetterByBindingType=[Ht.prototype._getValue_direct,Ht.prototype._getValue_array,Ht.prototype._getValue_arrayElement,Ht.prototype._getValue_toArray];Ht.prototype.SetterByBindingTypeAndVersioning=[[Ht.prototype._setValue_direct,Ht.prototype._setValue_direct_setNeedsUpdate,Ht.prototype._setValue_direct_setMatrixWorldNeedsUpdate],[Ht.prototype._setValue_array,Ht.prototype._setValue_array_setNeedsUpdate,Ht.prototype._setValue_array_setMatrixWorldNeedsUpdate],[Ht.prototype._setValue_arrayElement,Ht.prototype._setValue_arrayElement_setNeedsUpdate,Ht.prototype._setValue_arrayElement_setMatrixWorldNeedsUpdate],[Ht.prototype._setValue_fromArray,Ht.prototype._setValue_fromArray_setNeedsUpdate,Ht.prototype._setValue_fromArray_setMatrixWorldNeedsUpdate]];const Au=new rt;class zd{constructor(e,t,n=0,r=1/0){this.ray=new Ts(e,t),this.near=n,this.far=r,this.camera=null,this.layers=new Wl,this.params={Mesh:{},Line:{threshold:1},LOD:{},Points:{threshold:1},Sprite:{}}}set(e,t){this.ray.set(e,t)}setFromCamera(e,t){t.isPerspectiveCamera?(this.ray.origin.setFromMatrixPosition(t.matrixWorld),this.ray.direction.set(e.x,e.y,.5).unproject(t).sub(this.ray.origin).normalize(),this.camera=t):t.isOrthographicCamera?(this.ray.origin.set(e.x,e.y,(t.near+t.far)/(t.near-t.far)).unproject(t),this.ray.direction.set(0,0,-1).transformDirection(t.matrixWorld),this.camera=t):console.error("THREE.Raycaster: Unsupported camera type: "+t.type)}setFromXRController(e){return Au.identity().extractRotation(e.matrixWorld),this.ray.origin.setFromMatrixPosition(e.matrixWorld),this.ray.direction.set(0,0,-1).applyMatrix4(Au),this}intersectObject(e,t=!0,n=[]){return Ml(e,this,n,t),n.sort(Tu),n}intersectObjects(e,t=!0,n=[]){for(let r=0,s=e.length;r<s;r++)Ml(e[r],this,n,t);return n.sort(Tu),n}}function Tu(i,e){return i.distance-e.distance}function Ml(i,e,t,n){let r=!0;if(i.layers.test(e.layers)&&i.raycast(e,t)===!1&&(r=!1),r===!0&&n===!0){const s=i.children;for(let o=0,a=s.length;o<a;o++)Ml(s[o],e,t,!0)}}class Ru{constructor(e=1,t=0,n=0){return this.radius=e,this.phi=t,this.theta=n,this}set(e,t,n){return this.radius=e,this.phi=t,this.theta=n,this}copy(e){return this.radius=e.radius,this.phi=e.phi,this.theta=e.theta,this}makeSafe(){return this.phi=Math.max(1e-6,Math.min(Math.PI-1e-6,this.phi)),this}setFromVector3(e){return this.setFromCartesianCoords(e.x,e.y,e.z)}setFromCartesianCoords(e,t,n){return this.radius=Math.sqrt(e*e+t*t+n*n),this.radius===0?(this.theta=0,this.phi=0):(this.theta=Math.atan2(e,n),this.phi=Math.acos(xn(t/this.radius,-1,1))),this}clone(){return new this.constructor().copy(this)}}class Cx extends Ur{constructor(e,t=null){super(),this.object=e,this.domElement=t,this.enabled=!0,this.state=-1,this.keys={},this.mouseButtons={LEFT:null,MIDDLE:null,RIGHT:null},this.touches={ONE:null,TWO:null}}connect(){}disconnect(){}dispose(){}update(){}}typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("register",{detail:{revision:Ul}}));typeof window<"u"&&(window.__THREE__?console.warn("WARNING: Multiple instances of Three.js being imported."):window.__THREE__=Ul);const Cu={type:"change"},th={type:"start"},Hd={type:"end"},Go=new Ts,Pu=new nr,Px=Math.cos(70*Nt.DEG2RAD),cn=new A,Nn=2*Math.PI,Xt={NONE:-1,ROTATE:0,DOLLY:1,PAN:2,TOUCH_ROTATE:3,TOUCH_PAN:4,TOUCH_DOLLY_PAN:5,TOUCH_DOLLY_ROTATE:6},bc=1e-6;class Lx extends Cx{constructor(e,t=null){super(e,t),this.state=Xt.NONE,this.enabled=!0,this.target=new A,this.cursor=new A,this.minDistance=0,this.maxDistance=1/0,this.minZoom=0,this.maxZoom=1/0,this.minTargetRadius=0,this.maxTargetRadius=1/0,this.minPolarAngle=0,this.maxPolarAngle=Math.PI,this.minAzimuthAngle=-1/0,this.maxAzimuthAngle=1/0,this.enableDamping=!1,this.dampingFactor=.05,this.enableZoom=!0,this.zoomSpeed=1,this.enableRotate=!0,this.rotateSpeed=1,this.enablePan=!0,this.panSpeed=1,this.screenSpacePanning=!0,this.keyPanSpeed=7,this.zoomToCursor=!1,this.autoRotate=!1,this.autoRotateSpeed=2,this.keys={LEFT:"ArrowLeft",UP:"ArrowUp",RIGHT:"ArrowRight",BOTTOM:"ArrowDown"},this.mouseButtons={LEFT:ss.ROTATE,MIDDLE:ss.DOLLY,RIGHT:ss.PAN},this.touches={ONE:ns.ROTATE,TWO:ns.DOLLY_PAN},this.target0=this.target.clone(),this.position0=this.object.position.clone(),this.zoom0=this.object.zoom,this._domElementKeyEvents=null,this._lastPosition=new A,this._lastQuaternion=new Ve,this._lastTargetPosition=new A,this._quat=new Ve().setFromUnitVectors(e.up,new A(0,1,0)),this._quatInverse=this._quat.clone().invert(),this._spherical=new Ru,this._sphericalDelta=new Ru,this._scale=1,this._panOffset=new A,this._rotateStart=new at,this._rotateEnd=new at,this._rotateDelta=new at,this._panStart=new at,this._panEnd=new at,this._panDelta=new at,this._dollyStart=new at,this._dollyEnd=new at,this._dollyDelta=new at,this._dollyDirection=new A,this._mouse=new at,this._performCursorZoom=!1,this._pointers=[],this._pointerPositions={},this._controlActive=!1,this._onPointerMove=Ix.bind(this),this._onPointerDown=Dx.bind(this),this._onPointerUp=Nx.bind(this),this._onContextMenu=Hx.bind(this),this._onMouseWheel=Ox.bind(this),this._onKeyDown=kx.bind(this),this._onTouchStart=Bx.bind(this),this._onTouchMove=zx.bind(this),this._onMouseDown=Ux.bind(this),this._onMouseMove=Fx.bind(this),this._interceptControlDown=Vx.bind(this),this._interceptControlUp=Gx.bind(this),this.domElement!==null&&this.connect(),this.update()}connect(){this.domElement.addEventListener("pointerdown",this._onPointerDown),this.domElement.addEventListener("pointercancel",this._onPointerUp),this.domElement.addEventListener("contextmenu",this._onContextMenu),this.domElement.addEventListener("wheel",this._onMouseWheel,{passive:!1}),this.domElement.getRootNode().addEventListener("keydown",this._interceptControlDown,{passive:!0,capture:!0}),this.domElement.style.touchAction="none"}disconnect(){this.domElement.removeEventListener("pointerdown",this._onPointerDown),this.domElement.removeEventListener("pointermove",this._onPointerMove),this.domElement.removeEventListener("pointerup",this._onPointerUp),this.domElement.removeEventListener("pointercancel",this._onPointerUp),this.domElement.removeEventListener("wheel",this._onMouseWheel),this.domElement.removeEventListener("contextmenu",this._onContextMenu),this.stopListenToKeyEvents(),this.domElement.getRootNode().removeEventListener("keydown",this._interceptControlDown,{capture:!0}),this.domElement.style.touchAction="auto"}dispose(){this.disconnect()}getPolarAngle(){return this._spherical.phi}getAzimuthalAngle(){return this._spherical.theta}getDistance(){return this.object.position.distanceTo(this.target)}listenToKeyEvents(e){e.addEventListener("keydown",this._onKeyDown),this._domElementKeyEvents=e}stopListenToKeyEvents(){this._domElementKeyEvents!==null&&(this._domElementKeyEvents.removeEventListener("keydown",this._onKeyDown),this._domElementKeyEvents=null)}saveState(){this.target0.copy(this.target),this.position0.copy(this.object.position),this.zoom0=this.object.zoom}reset(){this.target.copy(this.target0),this.object.position.copy(this.position0),this.object.zoom=this.zoom0,this.object.updateProjectionMatrix(),this.dispatchEvent(Cu),this.update(),this.state=Xt.NONE}update(e=null){const t=this.object.position;cn.copy(t).sub(this.target),cn.applyQuaternion(this._quat),this._spherical.setFromVector3(cn),this.autoRotate&&this.state===Xt.NONE&&this._rotateLeft(this._getAutoRotationAngle(e)),this.enableDamping?(this._spherical.theta+=this._sphericalDelta.theta*this.dampingFactor,this._spherical.phi+=this._sphericalDelta.phi*this.dampingFactor):(this._spherical.theta+=this._sphericalDelta.theta,this._spherical.phi+=this._sphericalDelta.phi);let n=this.minAzimuthAngle,r=this.maxAzimuthAngle;isFinite(n)&&isFinite(r)&&(n<-Math.PI?n+=Nn:n>Math.PI&&(n-=Nn),r<-Math.PI?r+=Nn:r>Math.PI&&(r-=Nn),n<=r?this._spherical.theta=Math.max(n,Math.min(r,this._spherical.theta)):this._spherical.theta=this._spherical.theta>(n+r)/2?Math.max(n,this._spherical.theta):Math.min(r,this._spherical.theta)),this._spherical.phi=Math.max(this.minPolarAngle,Math.min(this.maxPolarAngle,this._spherical.phi)),this._spherical.makeSafe(),this.enableDamping===!0?this.target.addScaledVector(this._panOffset,this.dampingFactor):this.target.add(this._panOffset),this.target.sub(this.cursor),this.target.clampLength(this.minTargetRadius,this.maxTargetRadius),this.target.add(this.cursor);let s=!1;if(this.zoomToCursor&&this._performCursorZoom||this.object.isOrthographicCamera)this._spherical.radius=this._clampDistance(this._spherical.radius);else{const o=this._spherical.radius;this._spherical.radius=this._clampDistance(this._spherical.radius*this._scale),s=o!=this._spherical.radius}if(cn.setFromSpherical(this._spherical),cn.applyQuaternion(this._quatInverse),t.copy(this.target).add(cn),this.object.lookAt(this.target),this.enableDamping===!0?(this._sphericalDelta.theta*=1-this.dampingFactor,this._sphericalDelta.phi*=1-this.dampingFactor,this._panOffset.multiplyScalar(1-this.dampingFactor)):(this._sphericalDelta.set(0,0,0),this._panOffset.set(0,0,0)),this.zoomToCursor&&this._performCursorZoom){let o=null;if(this.object.isPerspectiveCamera){const a=cn.length();o=this._clampDistance(a*this._scale);const c=a-o;this.object.position.addScaledVector(this._dollyDirection,c),this.object.updateMatrixWorld(),s=!!c}else if(this.object.isOrthographicCamera){const a=new A(this._mouse.x,this._mouse.y,0);a.unproject(this.object);const c=this.object.zoom;this.object.zoom=Math.max(this.minZoom,Math.min(this.maxZoom,this.object.zoom/this._scale)),this.object.updateProjectionMatrix(),s=c!==this.object.zoom;const l=new A(this._mouse.x,this._mouse.y,0);l.unproject(this.object),this.object.position.sub(l).add(a),this.object.updateMatrixWorld(),o=cn.length()}else console.warn("WARNING: OrbitControls.js encountered an unknown camera type - zoom to cursor disabled."),this.zoomToCursor=!1;o!==null&&(this.screenSpacePanning?this.target.set(0,0,-1).transformDirection(this.object.matrix).multiplyScalar(o).add(this.object.position):(Go.origin.copy(this.object.position),Go.direction.set(0,0,-1).transformDirection(this.object.matrix),Math.abs(this.object.up.dot(Go.direction))<Px?this.object.lookAt(this.target):(Pu.setFromNormalAndCoplanarPoint(this.object.up,this.target),Go.intersectPlane(Pu,this.target))))}else if(this.object.isOrthographicCamera){const o=this.object.zoom;this.object.zoom=Math.max(this.minZoom,Math.min(this.maxZoom,this.object.zoom/this._scale)),o!==this.object.zoom&&(this.object.updateProjectionMatrix(),s=!0)}return this._scale=1,this._performCursorZoom=!1,s||this._lastPosition.distanceToSquared(this.object.position)>bc||8*(1-this._lastQuaternion.dot(this.object.quaternion))>bc||this._lastTargetPosition.distanceToSquared(this.target)>bc?(this.dispatchEvent(Cu),this._lastPosition.copy(this.object.position),this._lastQuaternion.copy(this.object.quaternion),this._lastTargetPosition.copy(this.target),!0):!1}_getAutoRotationAngle(e){return e!==null?Nn/60*this.autoRotateSpeed*e:Nn/60/60*this.autoRotateSpeed}_getZoomScale(e){const t=Math.abs(e*.01);return Math.pow(.95,this.zoomSpeed*t)}_rotateLeft(e){this._sphericalDelta.theta-=e}_rotateUp(e){this._sphericalDelta.phi-=e}_panLeft(e,t){cn.setFromMatrixColumn(t,0),cn.multiplyScalar(-e),this._panOffset.add(cn)}_panUp(e,t){this.screenSpacePanning===!0?cn.setFromMatrixColumn(t,1):(cn.setFromMatrixColumn(t,0),cn.crossVectors(this.object.up,cn)),cn.multiplyScalar(e),this._panOffset.add(cn)}_pan(e,t){const n=this.domElement;if(this.object.isPerspectiveCamera){const r=this.object.position;cn.copy(r).sub(this.target);let s=cn.length();s*=Math.tan(this.object.fov/2*Math.PI/180),this._panLeft(2*e*s/n.clientHeight,this.object.matrix),this._panUp(2*t*s/n.clientHeight,this.object.matrix)}else this.object.isOrthographicCamera?(this._panLeft(e*(this.object.right-this.object.left)/this.object.zoom/n.clientWidth,this.object.matrix),this._panUp(t*(this.object.top-this.object.bottom)/this.object.zoom/n.clientHeight,this.object.matrix)):(console.warn("WARNING: OrbitControls.js encountered an unknown camera type - pan disabled."),this.enablePan=!1)}_dollyOut(e){this.object.isPerspectiveCamera||this.object.isOrthographicCamera?this._scale/=e:(console.warn("WARNING: OrbitControls.js encountered an unknown camera type - dolly/zoom disabled."),this.enableZoom=!1)}_dollyIn(e){this.object.isPerspectiveCamera||this.object.isOrthographicCamera?this._scale*=e:(console.warn("WARNING: OrbitControls.js encountered an unknown camera type - dolly/zoom disabled."),this.enableZoom=!1)}_updateZoomParameters(e,t){if(!this.zoomToCursor)return;this._performCursorZoom=!0;const n=this.domElement.getBoundingClientRect(),r=e-n.left,s=t-n.top,o=n.width,a=n.height;this._mouse.x=r/o*2-1,this._mouse.y=-(s/a)*2+1,this._dollyDirection.set(this._mouse.x,this._mouse.y,1).unproject(this.object).sub(this.object.position).normalize()}_clampDistance(e){return Math.max(this.minDistance,Math.min(this.maxDistance,e))}_handleMouseDownRotate(e){this._rotateStart.set(e.clientX,e.clientY)}_handleMouseDownDolly(e){this._updateZoomParameters(e.clientX,e.clientX),this._dollyStart.set(e.clientX,e.clientY)}_handleMouseDownPan(e){this._panStart.set(e.clientX,e.clientY)}_handleMouseMoveRotate(e){this._rotateEnd.set(e.clientX,e.clientY),this._rotateDelta.subVectors(this._rotateEnd,this._rotateStart).multiplyScalar(this.rotateSpeed);const t=this.domElement;this._rotateLeft(Nn*this._rotateDelta.x/t.clientHeight),this._rotateUp(Nn*this._rotateDelta.y/t.clientHeight),this._rotateStart.copy(this._rotateEnd),this.update()}_handleMouseMoveDolly(e){this._dollyEnd.set(e.clientX,e.clientY),this._dollyDelta.subVectors(this._dollyEnd,this._dollyStart),this._dollyDelta.y>0?this._dollyOut(this._getZoomScale(this._dollyDelta.y)):this._dollyDelta.y<0&&this._dollyIn(this._getZoomScale(this._dollyDelta.y)),this._dollyStart.copy(this._dollyEnd),this.update()}_handleMouseMovePan(e){this._panEnd.set(e.clientX,e.clientY),this._panDelta.subVectors(this._panEnd,this._panStart).multiplyScalar(this.panSpeed),this._pan(this._panDelta.x,this._panDelta.y),this._panStart.copy(this._panEnd),this.update()}_handleMouseWheel(e){this._updateZoomParameters(e.clientX,e.clientY),e.deltaY<0?this._dollyIn(this._getZoomScale(e.deltaY)):e.deltaY>0&&this._dollyOut(this._getZoomScale(e.deltaY)),this.update()}_handleKeyDown(e){let t=!1;switch(e.code){case this.keys.UP:e.ctrlKey||e.metaKey||e.shiftKey?this._rotateUp(Nn*this.rotateSpeed/this.domElement.clientHeight):this._pan(0,this.keyPanSpeed),t=!0;break;case this.keys.BOTTOM:e.ctrlKey||e.metaKey||e.shiftKey?this._rotateUp(-Nn*this.rotateSpeed/this.domElement.clientHeight):this._pan(0,-this.keyPanSpeed),t=!0;break;case this.keys.LEFT:e.ctrlKey||e.metaKey||e.shiftKey?this._rotateLeft(Nn*this.rotateSpeed/this.domElement.clientHeight):this._pan(this.keyPanSpeed,0),t=!0;break;case this.keys.RIGHT:e.ctrlKey||e.metaKey||e.shiftKey?this._rotateLeft(-Nn*this.rotateSpeed/this.domElement.clientHeight):this._pan(-this.keyPanSpeed,0),t=!0;break}t&&(e.preventDefault(),this.update())}_handleTouchStartRotate(e){if(this._pointers.length===1)this._rotateStart.set(e.pageX,e.pageY);else{const t=this._getSecondPointerPosition(e),n=.5*(e.pageX+t.x),r=.5*(e.pageY+t.y);this._rotateStart.set(n,r)}}_handleTouchStartPan(e){if(this._pointers.length===1)this._panStart.set(e.pageX,e.pageY);else{const t=this._getSecondPointerPosition(e),n=.5*(e.pageX+t.x),r=.5*(e.pageY+t.y);this._panStart.set(n,r)}}_handleTouchStartDolly(e){const t=this._getSecondPointerPosition(e),n=e.pageX-t.x,r=e.pageY-t.y,s=Math.sqrt(n*n+r*r);this._dollyStart.set(0,s)}_handleTouchStartDollyPan(e){this.enableZoom&&this._handleTouchStartDolly(e),this.enablePan&&this._handleTouchStartPan(e)}_handleTouchStartDollyRotate(e){this.enableZoom&&this._handleTouchStartDolly(e),this.enableRotate&&this._handleTouchStartRotate(e)}_handleTouchMoveRotate(e){if(this._pointers.length==1)this._rotateEnd.set(e.pageX,e.pageY);else{const n=this._getSecondPointerPosition(e),r=.5*(e.pageX+n.x),s=.5*(e.pageY+n.y);this._rotateEnd.set(r,s)}this._rotateDelta.subVectors(this._rotateEnd,this._rotateStart).multiplyScalar(this.rotateSpeed);const t=this.domElement;this._rotateLeft(Nn*this._rotateDelta.x/t.clientHeight),this._rotateUp(Nn*this._rotateDelta.y/t.clientHeight),this._rotateStart.copy(this._rotateEnd)}_handleTouchMovePan(e){if(this._pointers.length===1)this._panEnd.set(e.pageX,e.pageY);else{const t=this._getSecondPointerPosition(e),n=.5*(e.pageX+t.x),r=.5*(e.pageY+t.y);this._panEnd.set(n,r)}this._panDelta.subVectors(this._panEnd,this._panStart).multiplyScalar(this.panSpeed),this._pan(this._panDelta.x,this._panDelta.y),this._panStart.copy(this._panEnd)}_handleTouchMoveDolly(e){const t=this._getSecondPointerPosition(e),n=e.pageX-t.x,r=e.pageY-t.y,s=Math.sqrt(n*n+r*r);this._dollyEnd.set(0,s),this._dollyDelta.set(0,Math.pow(this._dollyEnd.y/this._dollyStart.y,this.zoomSpeed)),this._dollyOut(this._dollyDelta.y),this._dollyStart.copy(this._dollyEnd);const o=(e.pageX+t.x)*.5,a=(e.pageY+t.y)*.5;this._updateZoomParameters(o,a)}_handleTouchMoveDollyPan(e){this.enableZoom&&this._handleTouchMoveDolly(e),this.enablePan&&this._handleTouchMovePan(e)}_handleTouchMoveDollyRotate(e){this.enableZoom&&this._handleTouchMoveDolly(e),this.enableRotate&&this._handleTouchMoveRotate(e)}_addPointer(e){this._pointers.push(e.pointerId)}_removePointer(e){delete this._pointerPositions[e.pointerId];for(let t=0;t<this._pointers.length;t++)if(this._pointers[t]==e.pointerId){this._pointers.splice(t,1);return}}_isTrackingPointer(e){for(let t=0;t<this._pointers.length;t++)if(this._pointers[t]==e.pointerId)return!0;return!1}_trackPointer(e){let t=this._pointerPositions[e.pointerId];t===void 0&&(t=new at,this._pointerPositions[e.pointerId]=t),t.set(e.pageX,e.pageY)}_getSecondPointerPosition(e){const t=e.pointerId===this._pointers[0]?this._pointers[1]:this._pointers[0];return this._pointerPositions[t]}_customWheelEvent(e){const t=e.deltaMode,n={clientX:e.clientX,clientY:e.clientY,deltaY:e.deltaY};switch(t){case 1:n.deltaY*=16;break;case 2:n.deltaY*=100;break}return e.ctrlKey&&!this._controlActive&&(n.deltaY*=10),n}}function Dx(i){this.enabled!==!1&&(this._pointers.length===0&&(this.domElement.setPointerCapture(i.pointerId),this.domElement.addEventListener("pointermove",this._onPointerMove),this.domElement.addEventListener("pointerup",this._onPointerUp)),!this._isTrackingPointer(i)&&(this._addPointer(i),i.pointerType==="touch"?this._onTouchStart(i):this._onMouseDown(i)))}function Ix(i){this.enabled!==!1&&(i.pointerType==="touch"?this._onTouchMove(i):this._onMouseMove(i))}function Nx(i){switch(this._removePointer(i),this._pointers.length){case 0:this.domElement.releasePointerCapture(i.pointerId),this.domElement.removeEventListener("pointermove",this._onPointerMove),this.domElement.removeEventListener("pointerup",this._onPointerUp),this.dispatchEvent(Hd),this.state=Xt.NONE;break;case 1:const e=this._pointers[0],t=this._pointerPositions[e];this._onTouchStart({pointerId:e,pageX:t.x,pageY:t.y});break}}function Ux(i){let e;switch(i.button){case 0:e=this.mouseButtons.LEFT;break;case 1:e=this.mouseButtons.MIDDLE;break;case 2:e=this.mouseButtons.RIGHT;break;default:e=-1}switch(e){case ss.DOLLY:if(this.enableZoom===!1)return;this._handleMouseDownDolly(i),this.state=Xt.DOLLY;break;case ss.ROTATE:if(i.ctrlKey||i.metaKey||i.shiftKey){if(this.enablePan===!1)return;this._handleMouseDownPan(i),this.state=Xt.PAN}else{if(this.enableRotate===!1)return;this._handleMouseDownRotate(i),this.state=Xt.ROTATE}break;case ss.PAN:if(i.ctrlKey||i.metaKey||i.shiftKey){if(this.enableRotate===!1)return;this._handleMouseDownRotate(i),this.state=Xt.ROTATE}else{if(this.enablePan===!1)return;this._handleMouseDownPan(i),this.state=Xt.PAN}break;default:this.state=Xt.NONE}this.state!==Xt.NONE&&this.dispatchEvent(th)}function Fx(i){switch(this.state){case Xt.ROTATE:if(this.enableRotate===!1)return;this._handleMouseMoveRotate(i);break;case Xt.DOLLY:if(this.enableZoom===!1)return;this._handleMouseMoveDolly(i);break;case Xt.PAN:if(this.enablePan===!1)return;this._handleMouseMovePan(i);break}}function Ox(i){this.enabled===!1||this.enableZoom===!1||this.state!==Xt.NONE||(i.preventDefault(),this.dispatchEvent(th),this._handleMouseWheel(this._customWheelEvent(i)),this.dispatchEvent(Hd))}function kx(i){this.enabled===!1||this.enablePan===!1||this._handleKeyDown(i)}function Bx(i){switch(this._trackPointer(i),this._pointers.length){case 1:switch(this.touches.ONE){case ns.ROTATE:if(this.enableRotate===!1)return;this._handleTouchStartRotate(i),this.state=Xt.TOUCH_ROTATE;break;case ns.PAN:if(this.enablePan===!1)return;this._handleTouchStartPan(i),this.state=Xt.TOUCH_PAN;break;default:this.state=Xt.NONE}break;case 2:switch(this.touches.TWO){case ns.DOLLY_PAN:if(this.enableZoom===!1&&this.enablePan===!1)return;this._handleTouchStartDollyPan(i),this.state=Xt.TOUCH_DOLLY_PAN;break;case ns.DOLLY_ROTATE:if(this.enableZoom===!1&&this.enableRotate===!1)return;this._handleTouchStartDollyRotate(i),this.state=Xt.TOUCH_DOLLY_ROTATE;break;default:this.state=Xt.NONE}break;default:this.state=Xt.NONE}this.state!==Xt.NONE&&this.dispatchEvent(th)}function zx(i){switch(this._trackPointer(i),this.state){case Xt.TOUCH_ROTATE:if(this.enableRotate===!1)return;this._handleTouchMoveRotate(i),this.update();break;case Xt.TOUCH_PAN:if(this.enablePan===!1)return;this._handleTouchMovePan(i),this.update();break;case Xt.TOUCH_DOLLY_PAN:if(this.enableZoom===!1&&this.enablePan===!1)return;this._handleTouchMoveDollyPan(i),this.update();break;case Xt.TOUCH_DOLLY_ROTATE:if(this.enableZoom===!1&&this.enableRotate===!1)return;this._handleTouchMoveDollyRotate(i),this.update();break;default:this.state=Xt.NONE}}function Hx(i){this.enabled!==!1&&i.preventDefault()}function Vx(i){i.key==="Control"&&(this._controlActive=!0,this.domElement.getRootNode().addEventListener("keyup",this._interceptControlUp,{passive:!0,capture:!0}))}function Gx(i){i.key==="Control"&&(this._controlActive=!1,this.domElement.getRootNode().removeEventListener("keyup",this._interceptControlUp,{passive:!0,capture:!0}))}class Wx extends Ql{constructor(){super();const e=new Rs;e.deleteAttribute("uv");const t=new Ir({side:Rn}),n=new Ir,r=new Bd(16777215,900,28,2);r.position.set(.418,16.199,.3),this.add(r);const s=new jt(e,t);s.position.set(-.757,13.219,.717),s.scale.set(31.713,28.305,28.591),this.add(s);const o=new jt(e,n);o.position.set(-10.906,2.009,1.846),o.rotation.set(0,-.195,0),o.scale.set(2.328,7.905,4.651),this.add(o);const a=new jt(e,n);a.position.set(-5.607,-.754,-.758),a.rotation.set(0,.994,0),a.scale.set(1.97,1.534,3.955),this.add(a);const c=new jt(e,n);c.position.set(6.167,.857,7.803),c.rotation.set(0,.561,0),c.scale.set(3.927,6.285,3.687),this.add(c);const l=new jt(e,n);l.position.set(-2.017,.018,6.124),l.rotation.set(0,.333,0),l.scale.set(2.002,4.566,2.064),this.add(l);const h=new jt(e,n);h.position.set(2.291,-.756,-2.621),h.rotation.set(0,-.286,0),h.scale.set(1.546,1.552,1.496),this.add(h);const u=new jt(e,n);u.position.set(-2.193,-.369,-5.547),u.rotation.set(0,.516,0),u.scale.set(3.875,3.487,2.986),this.add(u);const d=new jt(e,Zr(50));d.position.set(-16.116,14.37,8.208),d.scale.set(.1,2.428,2.739),this.add(d);const p=new jt(e,Zr(50));p.position.set(-16.109,18.021,-8.207),p.scale.set(.1,2.425,2.751),this.add(p);const g=new jt(e,Zr(17));g.position.set(14.904,12.198,-1.832),g.scale.set(.15,4.265,6.331),this.add(g);const b=new jt(e,Zr(43));b.position.set(-.462,8.89,14.52),b.scale.set(4.38,5.441,.088),this.add(b);const m=new jt(e,Zr(20));m.position.set(3.235,11.486,-12.541),m.scale.set(2.5,2,.1),this.add(m);const f=new jt(e,Zr(100));f.position.set(0,20,0),f.scale.set(1,.1,1),this.add(f)}dispose(){const e=new Set;this.traverse(t=>{t.isMesh&&(e.add(t.geometry),e.add(t.material))});for(const t of e)t.dispose()}}function Zr(i){const e=new Oi;return e.color.setScalar(i),e}const Vd=["left","right"],qx=["step","point"],Sl=i=>structuredClone(i);function aa(i,e,t=1/0){if(!Array.isArray(i)||i.length!==3||Array.from(i).some(n=>typeof n!="number"||!Number.isFinite(n)||Math.abs(n)>t))throw new TypeError(`${e} must contain three finite numbers${t===1/0?"":` within ±${t}`}.`)}function wl(i){return i&&typeof i=="object"&&!Array.isArray(i)&&qx.includes(i.kind)&&typeof i.id=="string"&&!!i.id.trim()}function oo(i){if(!wl(i))throw new TypeError("A foot curve anchor needs kind step or point and a non-empty string id.");return{kind:i.kind,id:i.id}}function Lu(i){const{kind:e,id:t}=oo(i);return JSON.stringify([e,t])}function As(i,e){return!!(wl(i)&&wl(e)&&i.kind===e.kind&&i.id===e.id)}function jx(i,e,t=i?.side){return!!(Vd.includes(t)&&i?.side===t&&As(i.from,e?.from)&&As(i.to,e?.to))}function Xx(i){if(!Array.isArray(i)||i.length>200)throw new TypeError("Foot curves must be an array with at most 200 entries.");const e=new Set,t=new Set;for(const[n,r]of i.entries()){const s=`Foot curve ${n+1}`;if(!r||typeof r!="object"||Array.isArray(r))throw new TypeError(`${s} must be an object.`);if(typeof r.id!="string"||!r.id.trim())throw new TypeError(`${s} needs a non-empty string id.`);if(e.has(r.id))throw new TypeError(`${s} repeats a curve id.`);if(e.add(r.id),!Vd.includes(r.side))throw new TypeError(`${s} side must be left or right.`);const o=oo(r.from),a=oo(r.to);if(As(o,a))throw new TypeError(`${s} must connect two different anchors.`);const c=JSON.stringify([r.side,o.kind,o.id,a.kind,a.id]);if(t.has(c))throw new TypeError(`${s} repeats a side and directed anchor pair.`);t.add(c),aa(r.bend,`${s} bend`,1e4)}return Sl(i)}function Qx(i,e,t,n){if(aa(i,"Foot curve start"),aa(e,"Foot curve end"),aa(t,"Foot curve bend",1e4),typeof n!="number"||!Number.isFinite(n)||n<0||n>1)throw new TypeError("Foot curve blend must be finite and between 0 and 1.");if(n===0)return Sl(i);if(n===1)return Sl(e);const r=4*n*(1-n);return i.map((s,o)=>s*(1-n)+e[o]*n+r*t[o])}const _c=["pelvis","leftAnkle","rightAnkle","leftWrist","rightWrist"],Kx=["leftKnee","rightKnee","leftElbow","rightElbow"],hs=i=>structuredClone(i),Er=i=>i&&typeof i=="object"&&!Array.isArray(i);function Vi(i,e,t=10){if(!Array.isArray(i)||i.length!==3||Array.from(i).some(n=>typeof n!="number"||!Number.isFinite(n)||Math.abs(n)>t))throw new TypeError(`${e}需要三个${t===1/0?"":`在 ±${t} 米以内的`}有限坐标。`)}function Gd(i,e){if(!Er(i))throw new TypeError(`${e}需要为对象。`);if(Vi(i.center,`${e}旋转中心`),Object.hasOwn(i,"arc")&&!["short","long"].includes(i.arc))throw new TypeError(`${e}请选择短弧或长弧。`);if(Object.hasOwn(i,"normal")&&(Vi(i.normal,`${e}备用旋转平面法向`,1/0),Math.max(...i.normal.map(Math.abs))===0))throw new TypeError(`${e}备用旋转平面法向不能为零。`)}function Yx(i,e){if(!Array.isArray(i)||i.length>200)throw new TypeError("整段路线需要为数组，最多保存 200 条。");const t=new Set,n=new Set,r=Array.isArray(e)?e:e?.steps;if(e!==void 0&&!Array.isArray(r))throw new TypeError("整段路线需要有效的动画节点。");const s=r&&new Set(r.map((o,a)=>typeof o?.id=="string"&&o.id.trim()?o.id:`step-${a}`));for(const[o,a]of i.entries()){const c=`整段路线 ${o+1}`;if(!Er(a))throw new TypeError(`${c}需要为对象。`);if(typeof a.id!="string"||!a.id.trim()||t.has(a.id))throw new TypeError(`${c}需要独立且非空的编号。`);t.add(a.id);const l=oo(a.from),h=oo(a.to);if(As(l,h))throw new TypeError(`${c}需要两个不同的关键帧。`);for(const d of[l,h])if(s&&d.kind==="step"&&!s.has(d.id))throw new TypeError(`${c}的原关键帧不属于当前动画。`);const u=JSON.stringify([Lu(l),Lu(h)]);if(n.has(u))throw new TypeError(`${c}重复指定同一个有向关键帧区间。`);if(n.add(u),!["linear","smooth"].includes(a.timing))throw new TypeError(`${c}需要选择线性或平滑补帧。`);if(Object.hasOwn(a,"bends")){if(!Er(a.bends))throw new TypeError(`${c}的位置路线需要为对象。`);for(const d of _c)Object.hasOwn(a.bends,d)&&Vi(a.bends[d],`${c} ${d}`)}if(Object.hasOwn(a,"smoothPaths")){if(!Er(a.smoothPaths))throw new TypeError(`${c}的平滑弧线需要为对象。`);for(const d of _c)if(Object.hasOwn(a.smoothPaths,d)){const p=a.smoothPaths[d];if(!Er(p))throw new TypeError(`${c} ${d} 的平滑弧线需要为对象。`);Vi(p.bend,`${c} ${d} 平滑弧线中点偏移`)}}if(Object.hasOwn(a,"orbitPaths")){if(!Er(a.orbitPaths))throw new TypeError(`${c}的旋转中心路线需要为对象。`);for(const d of _c)Object.hasOwn(a.orbitPaths,d)&&Gd(a.orbitPaths[d],`${c} ${d} 旋转中心路线`)}if(Object.hasOwn(a,"bendAngles")){if(!Er(a.bendAngles))throw new TypeError(`${c}的关节弯向需要为对象。`);for(const d of Kx)if(Object.hasOwn(a.bendAngles,d)){const p=a.bendAngles[d];if(typeof p!="number"||!Number.isFinite(p)||Math.abs(p)>2*Math.PI)throw new TypeError(`${c} ${d}需要在 ±2π 以内的有限角度。`)}}}return hs(i)}function $x(i,e){return!!(i&&As(i.from,e?.from)&&As(i.to,e?.to))}function Zx(i){if(typeof i!="number"||!Number.isFinite(i)||i<0||i>1)throw new TypeError("整段路线进度需要为 0–1 之间的有限数值。");return i===0||i===1?0:16*i*i*(1-i)*(1-i)}function Jx(i,e,t,n){if(Vi(i,"整段平滑弧线起点",1/0),Vi(e,"整段平滑弧线终点",1/0),Vi(t,"整段平滑弧线中点偏移"),typeof n!="number"||!Number.isFinite(n)||n<0||n>1)throw new TypeError("整段平滑弧线进度需要为 0–1 之间的有限数值。");if(n===0)return hs(i);if(n===1)return hs(e);const r=4*n*(1-n);return i.map((s,o)=>s*(1-n)+e[o]*n+r*t[o])}const ba=(i,e)=>i.reduce((t,n,r)=>t+n*e[r],0),Du=(i,e)=>[i[1]*e[2]-i[2]*e[1],i[2]*e[0]-i[0]*e[2],i[0]*e[1]-i[1]*e[0]];function us(i){const e=Math.max(...i.map(Math.abs));if(e===0)return null;const t=i.map(r=>r/e),n=Math.hypot(...t);return t.map(r=>r/n)}function Iu(i,e){const t=i.map((o,a)=>o-e[a]),n=us(t);if(!n)throw new RangeError("旋转中心不能与任一端点重合，请移动旋转中心。");const r=Math.max(...t.map(Math.abs)),s=r*Math.hypot(...t.map(o=>o/r));if(!Number.isFinite(s))throw new RangeError("端点离旋转中心过远，无法计算有限的弧线。");return{direction:n,radius:s}}function ev(i,e){if(e){const s=us(e),o=ba(s,i),a=s.map((c,l)=>c-o*i[l]);if(Math.hypot(...a)>1e-12)return us(a)}let t=0;for(let s=1;s<3;s++)Math.abs(i[s])<Math.abs(i[t])&&(t=s);const n=[0,0,0];n[t]=1;const r=ba(n,i);return us(n.map((s,o)=>s-r*i[o]))}function tv(i,e,t,n){if(Vi(i,"整段旋转弧线起点",1/0),Vi(e,"整段旋转弧线终点",1/0),Gd(t,"整段旋转弧线"),typeof n!="number"||!Number.isFinite(n)||n<0||n>1)throw new TypeError("整段旋转弧线进度需要为 0–1 之间的有限数值。");const r=Iu(i,t.center),s=Iu(e,t.center);if(n===0)return hs(i);if(n===1)return hs(e);if(t.arc!=="long"&&i.every((f,y)=>f===e[y]))return hs(i);const o=Du(r.direction,s.direction),a=Math.max(-1,Math.min(1,ba(r.direction,s.direction)));let c=us(o);const l=c?Math.atan2(Math.hypot(...o),a):a<0?Math.PI:0;c??(c=ev(r.direction,t.normal));const h=(t.arc==="long"?l-2*Math.PI:l)*n,u=Math.sin(h),d=Math.cos(h),p=Du(c,r.direction),g=ba(c,r.direction),b=r.radius*(1-n)+s.radius*n;return us(r.direction.map((f,y)=>f*d+p[y]*u+c[y]*g*(1-d))).map((f,y)=>t.center[y]+b*f)}const _a=["left","right"],Wd=["wrist","elbowPole","ankle","kneePole"],qd=["handQuaternion","footQuaternion"],jd=["elbowTwist","kneeTwist","upperArmTwist","thighTwist"],Nu=[0,0,0,1],on=i=>structuredClone(i);function El(i,e,t){if(!Array.isArray(i)||i.length!==e||Array.from(i).some(n=>typeof n!="number"||!Number.isFinite(n)))throw new TypeError(`${t} must contain ${e} finite numbers.`)}function Wo(i,e){if(El(i,4,e),Math.max(...i.map(Math.abs))===0)throw new TypeError(`${e} cannot be a zero quaternion.`)}function Ca(i,e){if(typeof i=="number"&&!Number.isFinite(i))throw new TypeError(`${e} contains a non-finite number.`);if(i&&typeof i=="object")for(const[t,n]of Object.entries(i))Ca(n,`${e}.${t}`)}function ca(i,e){const t=typeof e=="number"?`Step ${e+1}`:e;if(!i||i.version!==1)throw new TypeError(`${t} needs a version 1 pose.`);if(El(i.pelvis,3,`${t} pelvis`),Wo(i.bodyQuaternion,`${t} bodyQuaternion`),Object.hasOwn(i,"torsoQuaternion")&&Wo(i.torsoQuaternion,`${t} torsoQuaternion`),Object.hasOwn(i,"pelvisQuaternion")&&Wo(i.pelvisQuaternion,`${t} pelvisQuaternion`),typeof i.groundLock!="boolean")throw new TypeError(`${t} groundLock must be boolean.`);for(const n of _a){const r=i.limbs?.[n];if(!r||typeof r.handLocked!="boolean")throw new TypeError(`${t} ${n} handLocked must be boolean.`);for(const s of Wd)El(r[s],3,`${t} ${n} ${s}`);for(const s of qd)Wo(r[s],`${t} ${n} ${s}`);for(const s of jd)if(Object.hasOwn(r,s)&&(typeof r[s]!="number"||!Number.isFinite(r[s])))throw new TypeError(`${t} ${n} ${s} must be a finite angle in radians.`)}Ca(i,t)}function qo(i){const e=Math.max(...i.map(Math.abs)),t=i.map(r=>r/e),n=Math.hypot(...t);return t.map(r=>r/n)}function jo(i,e,t){const n=qo(i),r=qo(e);let s=n.reduce((h,u,d)=>h+u*r[d],0);if(s<0){for(let h=0;h<4;h++)r[h]=-r[h];s=-s}if(s=Math.min(1,Math.max(0,s)),s>.9995)return qo(n.map((h,u)=>h*(1-t)+r[u]*t));const o=Math.acos(s),a=Math.sin(o),c=Math.sin((1-t)*o)/a,l=Math.sin(t*o)/a;return qo(n.map((h,u)=>h*c+r[u]*l))}const Uu=(i,e,t)=>i.map((n,r)=>n*(1-t)+e[r]*t);function nv(i,e,t){const n=2*Math.PI,r=((e%n-i%n+Math.PI)%n+n)%n-Math.PI;return i+r*t}const Xo=i=>i*i*(3-2*i);function Jr(i,e){return i+e>1&&([i,e]=[1-e,1-i]),(e-i)*(3*(i+e)-2*(i*i+i*e+e*e))}function iv(i,e,t){const n=on(i);n.pelvis=Uu(i.pelvis,e.pelvis,t),n.bodyQuaternion=jo(i.bodyQuaternion,e.bodyQuaternion,t),(Object.hasOwn(i,"pelvisQuaternion")||Object.hasOwn(e,"pelvisQuaternion"))&&(n.pelvisQuaternion=jo(i.pelvisQuaternion??i.bodyQuaternion,e.pelvisQuaternion??e.bodyQuaternion,t)),(Object.hasOwn(i,"torsoQuaternion")||Object.hasOwn(e,"torsoQuaternion"))&&(n.torsoQuaternion=jo(i.torsoQuaternion??Nu,e.torsoQuaternion??Nu,t));for(const r of _a){const s=n.limbs[r];for(const o of Wd)s[o]=Uu(i.limbs[r][o],e.limbs[r][o],t);for(const o of qd)s[o]=jo(i.limbs[r][o],e.limbs[r][o],t);for(const o of jd)(Object.hasOwn(i.limbs[r],o)||Object.hasOwn(e.limbs[r],o))&&(s[o]=nv(i.limbs[r][o]??0,e.limbs[r][o]??0,t));s.handLocked=i.limbs[r].handLocked&&e.limbs[r].handLocked}return n}function rv(i,e){if(!Array.isArray(i))throw new TypeError("Transition corrections must be an array.");const t=new Set;for(const[r,s]of i.entries()){const o=`Correction ${r+1}`;if(!s||typeof s!="object"||Array.isArray(s))throw new TypeError(`${o} must be an object.`);if(typeof s.id!="string"||!s.id.trim())throw new TypeError(`${o} needs a non-empty string id.`);if(t.has(s.id))throw new TypeError(`${o} repeats a correction id.`);if(t.add(s.id),!Number.isInteger(s.segment)||s.segment<0||s.segment>=e)throw new TypeError(`${o} segment must be an existing transition index.`);if(typeof s.at!="number"||!Number.isFinite(s.at)||s.at<=0||s.at>=1)throw new TypeError(`${o} at must be strictly between 0 and 1.`);ca(s.pose,o),Ca(s,o)}const n=on(i).sort((r,s)=>r.segment-s.segment||r.at-s.at);for(let r=1;r<n.length;r++){const s=n[r-1],o=n[r];if(s.segment===o.segment&&o.at-s.at<=1e-8)throw new TypeError("A transition cannot have correction points at the same position.")}return n}function sv(i){const e={front:0,sideA:2,rear:4,sideB:6,frontRepeat:8};for(const t of["front","sideA","rear","sideB"]){const n=i.flatMap((r,s)=>r.phase===t?[s]:[]);n.length&&(e[t]=t.startsWith("side")?n[Math.floor(n.length/2)]:n[0],t==="front"&&(e.frontRepeat=n.at(-1)),t==="rear"&&n.length>1&&(e.rearRepeat=n.at(-1)))}return e}function ov(i,e){if(!Array.isArray(i))throw new TypeError("Skipped steps must be an array of original step indices.");const t=new Set;for(const n of i){if(!Number.isInteger(n)||n<0||n>=e)throw new TypeError("A skipped step must be an existing original step index.");if(t.has(n))throw new TypeError("Skipped step indices must be unique.");t.add(n)}return t}function xc(i,{period:e=i?.length,corrections:t=[],mapTransition:n,interpolation:r="smooth",skippedSteps:s=[],footCurves:o=[],resolveFootEndpoint:a,segmentGuides:c=[],mapGuidedTransition:l}={}){if(!Array.isArray(i)||!i.length)throw new TypeError("A flare sequence needs at least one step.");if(typeof e!="number"||!Number.isFinite(e)||e<=0)throw new TypeError("Sequence period must be positive and finite.");if(n!==void 0&&typeof n!="function")throw new TypeError("mapTransition must be a function.");if(l!==void 0&&typeof l!="function")throw new TypeError("mapGuidedTransition must be a function.");if(a!==void 0&&typeof a!="function")throw new TypeError("resolveFootEndpoint must be a function.");if(r!=="smooth"&&r!=="linear")throw new TypeError("Sequence interpolation must be smooth or linear.");for(const[P,k]of i.entries())ca(k?.pose,P),Ca(k,`Step ${P+1}`);const h=rv(t,i.length),u=ov(s,i.length),d=Xx(o),p=Yx(c,i),g=on(i),b=g.length,m=g.map((P,k)=>({kind:"step",id:typeof P.id=="string"&&P.id.trim()?P.id:`step-${k}`,coordinate:k,index:k,pose:P.pose})),f=m.filter((P,k)=>!u.has(k)),y=h.map(P=>({...P,kind:"point",coordinate:P.segment+P.at,index:P.segment})),x=f.concat(y).sort((P,k)=>P.coordinate-k.coordinate);if(!x.length)throw new TypeError("A sequence needs at least one enabled original step or correction.");const _=Array.from({length:b},(P,k)=>[{...m[k],at:0},...y.filter(W=>W.segment===k),{...m[(k+1)%b],at:1}]),I=P=>Math.min(1e-8,32*Number.EPSILON*Math.max(1,b,Math.abs(P/e)*b)),L=P=>{if(typeof P!="number"||!Number.isFinite(P))throw new TypeError("Sequence time must be finite.");let k=P%e;k<0&&(k+=e);const W=k/e*b,re=Math.max(0,Math.min(b-1,Math.floor(W))),he=(re+1)%b,ye=W-re,J=I(P);return ye<=Math.min(J,_[re][1].at/2)?{index:re,next:he,progress:0}:1-ye<=Math.min(J,(1-_[re].at(-2).at)/2)?{index:he,next:(he+1)%b,progress:0}:{index:re,next:he,progress:ye}},C=(P,k,W,re)=>{const he=p.length?se(re):null,ye=he&&q(he);ye&&(W=he.blend);const J=iv(P,k,W);let fe=J;if(n){const Me=n(J,{start:on(P),end:on(k),blend:W});ca(Me,"Mapped transition"),fe=on(Me)}if(d.length){const Me=he??j(re);Me.blend=W;for(const _e of _a){const Fe=$(Me,_e);Fe&&(fe.limbs[_e].ankle=Fe.position)}}if(ye&&!he.exact&&l){const Me=l(fe,{start:on(P),end:on(k),blend:W,time:re,span:ne(he,re),guide:on(ye)});ca(Me,"Guided transition"),fe=Me}return fe},F=P=>{let k=P%e;return k<0&&(k+=e),k/e*b},w=(P,k)=>{const W=P.findIndex(ye=>ye.coordinate>k),re=P[(W<=0?P.length:W)-1],he=P[W<0?0:W];return{left:re,right:he,start:re.coordinate-(W===0?b:0),end:he.coordinate+(W<0?b:0)}},v=(P,k)=>{let W=(k-P.start)/(P.end-P.start);if(r==="smooth")if(f.length){const re=w(f,k),he=re.end-re.start,ye=(P.start-re.start)/he,J=(P.end-re.start)/he,fe=(k-re.start)/he;W=Jr(ye,fe)/Jr(ye,J)}else W=Xo(W);return Math.min(1,Math.max(0,W))},T=(P,k,W)=>{const re=x.indexOf(P),he=P.coordinate+Math.round((k-P.coordinate)/b)*b;if(W==="previous"){const Me=x[(re+x.length-1)%x.length],_e=P.coordinate-Me.coordinate,Fe=_e>0?_e:_e+b;return{left:Me,right:P,start:he-Fe,end:he,blend:1,exact:!0}}const ye=x[(re+1)%x.length],J=ye.coordinate-P.coordinate,fe=J>0?J:J+b;return{left:P,right:ye,start:he,end:he+fe,blend:0,exact:!0}},j=(P,k="next")=>{const{index:W,next:re,progress:he}=L(P),ye=F(P),J=w(x,ye);if(u.has(W)||u.has(re)||x.length===1){const Ke=ye-J.start,ct=J.end-ye;return Math.min(Ke,ct)<=Math.min(I(P),(J.end-J.start)/2)?T(Ke<ct?J.left:J.right,ye,k):{...J,blend:v(J,ye),exact:!1}}if(he===0)return T(f.find(Ke=>Ke.index===W),ye,k);const Me=_[W];if(Me.length===2)return{...J,blend:r==="linear"?he:Xo(he),exact:!1};const _e=Me.reduce((Ke,ct)=>Math.abs(he-ct.at)<Math.abs(he-Ke.at)?ct:Ke);if(Math.abs(he-_e.at)<=I(P)){const Ke=x.find(ct=>ct.kind===_e.kind&&(ct.kind==="step"?ct.index===_e.index:ct.id===_e.id));return T(Ke,ye,k)}const Fe=Me.findIndex(Ke=>Ke.at>he),$e=Me[Fe-1],nt=Me[Fe],Tt=r==="linear"?(he-$e.at)/(nt.at-$e.at):Jr($e.at,he)/Jr($e.at,nt.at);return{...J,blend:Math.min(1,Math.max(0,Tt)),exact:!1}},q=P=>p.find(k=>$x(k,{from:P.left,to:P.right})),se=(P,k="next")=>{const W=j(P,k),re=q(W);if(!re||W.exact)return W;const he=Math.min(1,Math.max(0,(F(P)-W.start)/(W.end-W.start)));return{...W,blend:re.timing==="linear"?he:Xo(he)}},ne=(P,k)=>{let W=k%e;W<0&&(W+=e);const re=k-W,he=re+P.start/b*e,ye=re+P.end/b*e;return{from:{kind:P.left.kind,id:P.left.id,pose:on(P.left.pose),time:he},to:{kind:P.right.kind,id:P.right.id,pose:on(P.right.pose),time:ye},startTime:he,endTime:ye,blend:P.blend}},$=(P,k)=>{const W=d.find(he=>jx(he,{from:P.left,to:P.right},k));if(!W)return null;const re=he=>a?a(on(he.pose),k):he.pose.limbs[k].ankle;return{curve:W,position:Qx(re(P.left),re(P.right),W.bend,P.blend)}},ce=(P,k)=>{if(x.length===1)return on(x[0].pose);const W=w(x,k),re=k-W.start,he=W.end-k,ye=re<he?W.left:W.right;return Math.min(re,he)<=Math.min(I(P),(W.end-W.start)/2)?on(ye.pose):C(W.left.pose,W.right.pose,v(W,k),P)};return{steps:on(g),period:e,keyframes:sv(g),transitionAt(P){return L(P)},spanAt(P,k={}){if(!k||typeof k!="object"||Array.isArray(k))throw new TypeError("Span options must be an object.");const{prefer:W="next"}=k;if(W!=="previous"&&W!=="next")throw new TypeError("Span preference must be previous or next.");return ne(se(P,W),P)},guideAt(P,k={}){if(typeof k=="string"&&(k={prefer:k}),!k||typeof k!="object"||Array.isArray(k))throw new TypeError("Guide options must be an object.");const{prefer:W="next"}=k;if(W!=="previous"&&W!=="next")throw new TypeError("Guide preference must be previous or next.");const re=se(P,W),he=q(re);return he?{guide:on(he),span:ne(re,P)}:null},curveAt(P,k){if(!_a.includes(k))throw new TypeError("Foot curve side must be left or right.");let W=se(P),re=$(W,k);return!re&&W.exact&&(W=se(P,"previous"),re=$(W,k)),re?{curve:on(re.curve),span:ne(W,P),position:re.position}:null},stepAt(P){const{index:k,next:W,progress:re}=L(P);if(u.size){const he=F(P),ye=w(f.length?f:x,he);return he-ye.start>=ye.end-he?ye.right.index:ye.left.index}return re>=.5?W:k},sample(P){const{index:k,next:W,progress:re}=L(P);if(u.has(k)||u.has(W))return ce(P,F(P));const he=g[k].pose,ye=g[W].pose;if(re===0)return on(he);const J=_[k];if(J.length===2)return b===1?on(he):C(he,ye,r==="linear"?re:Xo(re),P);const fe=J.reduce((nt,Tt)=>Math.abs(re-Tt.at)<Math.abs(re-nt.at)?Tt:nt);if(Math.abs(re-fe.at)<=I(P))return on(fe.pose);const Me=J.findIndex(nt=>nt.at>re),_e=J[Me-1],Fe=J[Me],$e=r==="linear"?(re-_e.at)/(Fe.at-_e.at):Jr(_e.at,re)/Jr(_e.at,Fe.at);return C(_e.pose,Fe.pose,Math.min(1,Math.max(0,$e)),P)}}}const ao=1e-10,Xd=new A(0,1,0),di=i=>new A().fromArray(i),vc=i=>new Ve().fromArray(i).normalize(),xa=(i,e,t)=>i*(1-t)+e*t;function la(i,e){const t=e.clone().addScaledVector(i,-e.dot(i));return t.lengthSq()<ao&&(t.copy(Math.abs(i.z)<.9?new A(0,0,1):Xd),t.addScaledVector(i,-t.dot(i))),t.normalize()}function Fu(i,e,t){const n=Math.max(-1,Math.min(1,i.dot(e)));if(n>1-ao)return new Ve;const r=new A().crossVectors(i,e);return r.lengthSq()<ao&&r.crossVectors(i,la(i,t)),new Ve().setFromAxisAngle(r.normalize(),Math.acos(n))}function Ou(i,e){return new Ve().setFromRotationMatrix(new rt().makeBasis(e,new A().crossVectors(i,e).normalize(),i))}function av(i,e,t,n,r){if(!(n>0&&r>0))return xa(i,e,t);const s=a=>Math.acos(Math.max(-1,Math.min(1,(a*a-n*n-r*r)/(2*n*r)))),o=xa(s(i),s(e),t);return Math.sqrt(Math.max(0,n*n+r*r+2*n*r*Math.cos(o)))}function qs({startRoot:i,endRoot:e,currentRoot:t,startTarget:n,endTarget:r,currentTarget:s,startMiddle:o,endMiddle:a,startReference:c,endReference:l,currentReference:h,blend:u,upperLength:d,lowerLength:p,arc:g=!0,floorHeight:b=-1/0,side:m="left"}){const f=vc(c),y=vc(l),x=vc(h),_=di(i),I=di(e),L=di(t),C=di(n).sub(_),F=di(r).sub(I),w=C.clone().applyQuaternion(f.clone().invert()),v=F.clone().applyQuaternion(y.clone().invert()),T=w.length(),j=v.length();if(T<1e-8||j<1e-8)return{target:[...s],pole:di(o).lerp(di(a),u).toArray()};const q=w.clone().normalize(),se=v.clone().normalize(),ne=di(o).sub(_),$=di(a).sub(I),ce=la(C.clone().normalize(),ne).applyQuaternion(f.clone().invert()),P=la(F.clone().normalize(),$).applyQuaternion(y.clone().invert()),k=ne.clone().applyQuaternion(f.clone().invert()),W=$.clone().applyQuaternion(y.clone().invert()),re=new Ve().slerp(Fu(q,se,ce),u),he=av(T,j,u,d,p),ye=g?q.clone().applyQuaternion(re).multiplyScalar(he).applyQuaternion(x):di(s).sub(L);if(g&&Number.isFinite(b)&&L.y+ye.y<b){const ct=b-L.y;if(ct<=he){const N=Math.sqrt(Math.max(0,he*he-ct*ct)),Kt=new A(ye.x,0,ye.z);Kt.lengthSq()<ao&&(Kt.copy(q).applyQuaternion(x),Kt.y=0,Kt.lengthSq()<ao&&Kt.set(m==="left"?1:-1,0,0)),Kt.normalize().multiplyScalar(N),ye.set(Kt.x,ct,Kt.z)}else ye.set(0,ct,0)}const J=ye.lengthSq()>1e-12?ye.clone().normalize():Xd.clone().negate(),fe=J.clone().applyQuaternion(x.clone().invert()),Me=Ou(q,ce).slerp(Ou(se,P),u),_e=new A(0,0,1).applyQuaternion(Me),Fe=new A(1,0,0).applyQuaternion(Me),$e=Fe.applyQuaternion(Fu(_e,fe,Fe)),nt=la(fe,$e).applyQuaternion(x),Tt=xa(k.dot(q),W.dot(se),u),Ke=Math.max(1e-4,xa(k.clone().addScaledVector(q,-k.dot(q)).length(),W.clone().addScaledVector(se,-W.dot(se)).length(),u));return{target:L.clone().add(ye).toArray(),pole:L.clone().addScaledVector(J,Tt).addScaledVector(nt,Ke).toArray()}}const Rr=[.8,1.27],cv=[1/3,2/3],lv=i=>i*i*(3-2*i);function hv({model:i,meshes:e,skeletons:t,landmarks:n}){const r=ku(i,"pelvis"),s=ku(i,"torso");if(!r||!s||!n?.pelvis||!n?.torso)return null;const o=r.parent;i.updateMatrixWorld(!0);const a=r.matrixWorld.clone(),c=s.matrixWorld.clone(),l=a.clone().invert(),h=c.clone().invert(),u=new A(...n.pelvis).applyMatrix4(i.matrixWorld),d=new A(...n.torso).applyMatrix4(i.matrixWorld),p=cv.map((T,j)=>{const q=new Yl;q.name=j?"spineUpper":"spineLower",q.matrixAutoUpdate=!1,q.matrixWorldAutoUpdate=!1,o.add(q);const se=u.clone().lerp(d,T);return se.y=Nt.lerp(Rr[0],Rr[1],T),{bone:q,share:T,pivot:se}}),g=new Map;for(const T of e){let j=g.get(T.skeleton);if(!j){const $=T.skeleton,ce=a.clone().multiply($.boneInverses[$.bones.indexOf(r)]);j=new Ta([...$.bones,...p.map(P=>P.bone)],[...$.boneInverses,...p.map(()=>ce.clone())]),g.set($,j)}const q=j.bones.indexOf(r),se=j.bones.indexOf(s),ne=p.map($=>j.bones.indexOf($.bone));uv(T,[q,ne[0],ne[1],se]),T.bind(j,T.bindMatrix)}t.clear();for(const T of g.values())T.bones.length&&t.add(T);const b=new rt,m=new rt,f=new Ve,y=new Ve,x=new Ve,_=new A,I=new A,L=new A,C=new A,F=new A,w=new rt;function v(){b.multiplyMatrices(r.matrixWorld,l),m.multiplyMatrices(s.matrixWorld,h),b.decompose(_,f,L),m.decompose(I,y,L);for(const{bone:T,share:j,pivot:q}of p)x.slerpQuaternions(f,y,j),C.copy(q).applyMatrix4(b),F.copy(q).applyMatrix4(m),C.lerp(F,j),w.makeRotationFromQuaternion(x),T.matrixWorld.makeTranslation(-q.x,-q.y,-q.z).premultiply(w),T.matrixWorld.elements[12]+=C.x,T.matrixWorld.elements[13]+=C.y,T.matrixWorld.elements[14]+=C.z}return v(),{update:v,helpers:p.map(T=>T.bone.name)}}function ku(i,e){let t=null;return i.traverse(n=>{!t&&n.isBone&&n.name===e&&(t=n)}),t}function uv(i,e){const[t,,,n]=e,r=i.geometry,s=r.getAttribute("position"),o=r.getAttribute("skinIndex"),a=r.getAttribute("skinWeight");if(!s||!o||!a)return;const c=new A;let l=!1;for(let h=0;h<s.count;h++){if(i.getVertexPosition(h,c).applyMatrix4(i.matrixWorld),c.y<Rr[0]-.02||c.y>Rr[1]+.05)continue;let u=0;const d=[];for(let x=0;x<4;x++){const _=o.getComponent(h,x),I=a.getComponent(h,x);I<=0||(_===t||_===n?u+=I:d.push([_,I]))}if(u<.02)continue;const p=lv(Nt.clamp((c.y-Rr[0])/(Rr[1]-Rr[0]),0,1))*3,g=Math.min(2,Math.floor(p)),b=p-g,m=[[e[g],u*(1-b)],[e[g+1],u*b]];d.sort((x,_)=>_[1]-x[1]);const f=[...m,...d].filter(x=>x[1]>1e-5).slice(0,4),y=f.reduce((x,_)=>x+_[1],0);for(let x=0;x<4;x++){const _=f[x];o.setComponent(h,x,_?_[0]:0),a.setComponent(h,x,_?_[1]/y:0)}l=!0}l&&(o.needsUpdate=!0,a.needsUpdate=!0)}const dv=9,fv=JSON.parse('[{"id":"flare-saved-09-rear","name":"后双撑 · 循环起点","phase":"rear","sourceStepId":"a998d382-0b7f-4ad3-b627-57f44e99561e","sourceStepNumber":9,"sourceStepName":"前双撑 · 开腿起点","sourcePreset":"flare-front-open","mirrored":true,"pose":{"version":1,"pelvis":[-0.029999999999999943,0.7875411999117483,-0.25],"bodyQuaternion":[0.8985343740226003,-0.007470351912587276,0.0006445605531121277,0.43883910158942024],"limbs":{"left":{"wrist":[0.215,0.03115682210638071,-8.326672684688674e-17],"elbowPole":[0.3679072,0.43590140665760185,0.17715781234977546],"ankle":[0.49486288804898193,0.40686809373231875,-0.7652272856350576],"kneePole":[0.2702140644338731,0.37378315689696334,-0.7127973660353976],"handQuaternion":[-0.014115609697670064,0.00967441866320057,-0.030224304035934627,0.9993966412951045],"footQuaternion":[0.501149601194387,-0.3339169438195634,0.18899898676280638,0.7756467848547703],"handLocked":true},"right":{"wrist":[-0.215,0.03113663464124783,0.1],"elbowPole":[-0.3679072,0.43590147865439804,0.17715799894147222],"ankle":[-0.5742504279789087,0.432309189823983,-0.7595179492198025],"kneePole":[-0.3509231115663002,0.38906846675917944,-0.7088646859581507],"handQuaternion":[-0.014115609697670064,-0.00967441866320057,0.030224304035934627,0.9993966412951045],"footQuaternion":[0.5058360746426133,0.3280672253476286,-0.2086002061921243,0.7700569558282452],"handLocked":true}},"groundLock":true,"pelvisQuaternion":[0.8986774439285762,-0.009315986729886845,-0.006751183447908846,0.4384592178154111]}},{"id":"flare-saved-10-left-transfer","name":"左侧移重 · 单手接重","phase":"sideA","sourceStepId":"6c5f9dec-c1bd-4f56-a3d8-81c75be93c7c","sourceStepNumber":10,"sourceStepName":"移重到右手 · 抬起左手","sourcePreset":null,"mirrored":false,"pose":{"version":1,"pelvis":[0.07007888106107946,0.7720626104730002,-0.23144189371099202],"bodyQuaternion":[0.6884117264809348,0.11040177881154879,0.4256823395806238,0.5767974409166106],"limbs":{"left":{"wrist":[0.25010189652088743,0.40476689807122906,0.4254073596363691],"elbowPole":[0.1979829028589189,0.6468147145769494,0.1695743416386411],"handQuaternion":[0.17350982369554666,-0.20884585815279677,-0.42524718689772656,0.8633901659441879],"ankle":[0.7926862748388714,1.1193371825281488,0.02680001526901879],"kneePole":[0.3616283684785114,1.2603983791051436,-0.14519721305129968],"footQuaternion":[0.37605521460570385,-0.4806383614070052,0.6894911510529526,0.3900912633365708],"handLocked":false},"right":{"wrist":[-0.21500000000000002,0.031189341132898618,0.1],"elbowPole":[-0.13184425020229218,0.3478909272549951,0.25290060337913167],"handQuaternion":[-0.014115609697670064,-0.00967441866320057,0.030224304035934627,0.9993966412951045],"ankle":[0.6018922580190487,0.2699931936992248,-0.5084342844878578],"kneePole":[0.4912872602276406,0.7407256279319921,-0.4700971459634683],"footQuaternion":[0.24650126182492982,-0.11415961691961395,0.3855988737729689,0.8817699350332276],"handLocked":true}},"groundLock":true,"pelvisQuaternion":[0.6884117264809348,0.11040177881154879,0.4256823395806238,0.5767974409166106]}},{"id":"flare-saved-11-left-support","name":"左侧单撑 · 高 V 开腿","phase":"sideA","sourceStepId":"24e0a3ba-d63d-486a-97f7-36f3100d28ef","sourceStepNumber":11,"sourceStepName":"右手单撑 · 高 V 开腿","sourcePreset":"flare-right-high-v","mirrored":false,"pose":{"version":1,"pelvis":[0.1903361328182514,0.7545844330974216,0.10069056676801744],"bodyQuaternion":[0.01190128902092805,0.009840940988734014,0.7461237406115414,0.6656281836700862],"limbs":{"left":{"wrist":[-0.08205568785866227,1.3192134842986976,0.05783298066135038],"elbowPole":[-0.1038368832172161,0.9652514281805494,0.25907342447150283],"handQuaternion":[-0.010637571712003226,0.15332075029523548,0.4980305488275511,0.8534314044089931],"ankle":[0.25070478047876693,1.5148527459255963,0.4509019187873464],"kneePole":[0.22270561091053936,1.318234604989236,0.008352961581929969],"footQuaternion":[-0.24504767067701202,-0.33643014189620246,0.9073613842252461,0.05883635896549819],"handLocked":false},"right":{"wrist":[-0.21500000000000002,0.031337200862919246,0.1],"elbowPole":[-0.3593795877380631,0.3556281924676706,0.21969045833840206],"handQuaternion":[-0.014115609697670064,-0.00967441866320057,0.030224304035934627,0.9993966412951045],"ankle":[0.5643167000574032,0.37000000000000005,0.7146731056126405],"kneePole":[0.46092973263258913,0.7987466594162334,0.5127333537768439],"footQuaternion":[-0.294194493164645,-0.3609348053999786,0.4421438388133155,0.7666058258596149],"handLocked":true}},"groundLock":true,"pelvisQuaternion":[0.01190128902092805,0.009840940988734014,0.7461237406115414,0.6656281836700862]}},{"id":"flare-saved-12-left-pass","name":"左侧换腿 · 接回前撑","phase":"sideA","sourceStepId":"4d22469f-bb80-4518-99e4-b611d4244a78","sourceStepNumber":12,"sourceStepName":"前方换腿 · 左手回撑","sourcePreset":"flare-front-pass","mirrored":false,"pose":{"version":1,"pelvis":[0.08080120998552665,0.6717401391645048,0.3300759020463073],"bodyQuaternion":[-0.5030282219657664,-0.18419941941207668,0.5023756857913568,0.678713379947587],"limbs":{"left":{"wrist":[0.3263099404048406,0.5503030997171975,-0.16654118679356797],"elbowPole":[0.005709472502696794,1.1087823544715194,-0.2920629230395969],"handQuaternion":[0.004090732578487741,0.11367232674478131,-0.3504979993357032,0.9296305828129088],"ankle":[0.1696009324348301,1.4388597936380656,0.6536559379409476],"kneePole":[-0.07048148640053131,1.239113916217521,0.6289599578779773],"footQuaternion":[0.7676218038380517,0.16807131531128494,-0.6100891390991674,-0.10148912057549417],"handLocked":false},"right":{"wrist":[-0.215,0.03139534160318602,0.1],"elbowPole":[-0.4121819284405803,0.4148261451148529,0.029550607614414443],"handQuaternion":[-0.014115609697670064,-0.00967441866320057,0.030224304035934627,0.9993966412951045],"ankle":[-0.36438471561797037,0.5683410998145629,1.0138897008702232],"kneePole":[-0.15267899085524128,0.8835641507980668,0.7120497754184677],"footQuaternion":[0.6711110431488149,0.540964207129817,-0.1472897106548494,-0.48504993093838167],"handLocked":true}},"groundLock":true,"pelvisQuaternion":[-0.5030282219657664,-0.18419941941207668,0.5023756857913568,0.678713379947587]}},{"id":"flare-saved-13-front","name":"前双撑 · 中间过渡","phase":"front","sourceStepId":"474fe57e-894b-4bb7-937e-698993abf67e","sourceStepNumber":13,"sourceStepName":"后双撑 · 抬髋开腿","sourcePreset":"flare-rear-open","mirrored":false,"pose":{"version":1,"pelvis":[0.0005147625624336676,0.5976163930301621,0.4542566030631731],"bodyQuaternion":[-0.7564131631953535,0,0,0.6540941266704661],"limbs":{"left":{"wrist":[0.215,0.031494584452709806,6.938893903907228e-18],"elbowPole":[0.3679072,0.6431900159999999,0.007709588000000031],"handQuaternion":[-0.014115609697670064,0.00967441866320057,-0.030224304035934627,0.9993966412951045],"ankle":[0.5921656864634581,1.1333667707622546,0.6929969677947478],"kneePole":[0.3371117184305408,1.1635426234507742,0.5542034891857168],"footQuaternion":[0.9019193641710003,-0.295289058482176,-0.27258807678697555,-0.15824529335075616],"handLocked":true},"right":{"wrist":[-0.215,0.03151863562964291,0.1],"elbowPole":[-0.3679072,0.64318996,0.00770977999999993],"handQuaternion":[-0.014115609697670064,-0.00967441866320057,0.030224304035934627,0.9993966412951045],"ankle":[-0.5911361626057233,1.1333667720871636,0.6929969682691859],"kneePole":[-0.33608219457280597,1.1635426247756833,0.5542034896601549],"footQuaternion":[0.9019193648820122,0.2952890574650434,0.2725880759374532,-0.1582452926596914],"handLocked":true}},"groundLock":true,"pelvisQuaternion":[-0.7564131631953535,0,0,0.6540941266704661]}},{"id":"flare-saved-14-right-pass","name":"右侧换腿 · 前撑转移","phase":"sideB","sourceStepId":"mirror-20261005-12-4d22469f-bb80-4518-99e4-b611d4244a78","sourceStepNumber":14,"sourceStepName":"右侧换腿 · 第12步镜像","sourcePreset":null,"mirrored":true,"pose":{"version":1,"pelvis":[-0.08080120998552665,0.6717401391645048,0.23007590204630735],"bodyQuaternion":[-0.5030282219657664,0.18419941941207668,-0.5023756857913568,0.678713379947587],"limbs":{"left":{"wrist":[0.215,0.03139534160318602,-5.551115123125783e-17],"elbowPole":[0.4121819284405803,0.4148261451148529,-0.07044939238558556],"ankle":[0.19113649346039305,0.5683410998145629,1.0047228478250085],"kneePole":[0.06328556334187835,0.8835641507980668,0.6589182871814792],"handQuaternion":[-0.014115609697670064,0.00967441866320057,-0.030224304035934627,0.9993966412951045],"footQuaternion":[-0.6457449068778082,0.4762301827326176,-0.23414204743752473,0.5489952913437353],"handLocked":true},"right":{"wrist":[-0.3263099404048406,0.5503030997171975,-0.266541186793568],"elbowPole":[-0.005709472502696794,1.1087823544715194,-0.39206292303959694],"ankle":[-0.1696009324348301,1.4388597936380654,0.5536559379409474],"kneePole":[0.07048148640053131,1.2391139162175209,0.5289599578779771],"handQuaternion":[0.004090662857153402,-0.11367252035892912,0.35049805429256764,0.9296305387248004],"footQuaternion":[0.7676218038380499,-0.1680713153112819,0.6100891390991705,-0.10148912057549579],"handLocked":false}},"groundLock":true,"pelvisQuaternion":[-0.5030282219657664,0.18419941941207668,-0.5023756857913568,0.678713379947587]}},{"id":"flare-saved-15-right-support","name":"右侧单撑 · 高 V 开腿","phase":"sideB","sourceStepId":"mirror-20261005-11-24e0a3ba-d63d-486a-97f7-36f3100d28ef","sourceStepNumber":15,"sourceStepName":"右侧单撑 · 第11步镜像","sourcePreset":null,"mirrored":true,"pose":{"version":1,"pelvis":[-0.1903361328182514,0.7545844330974216,0.0006905667680174282],"bodyQuaternion":[0.01190128902092805,-0.009840940988734014,-0.7461237406115414,0.6656281836700862],"limbs":{"left":{"wrist":[0.21500000000000002,0.031337200862919246,2.168404344971009e-19],"elbowPole":[0.3593795877380631,0.3556281924676706,0.11969045833840207],"ankle":[-0.7212292424837399,0.37000000000000005,0.5047556600532115],"kneePole":[-0.5667628569452158,0.7987466594162334,0.3385971088334001],"handQuaternion":[-0.014115609697670064,0.00967441866320057,-0.030224304035934627,0.9993966412951045],"footQuaternion":[-0.215261700594769,0.2785571897933545,-0.4875555274236323,0.7989730282995422],"handLocked":true},"right":{"wrist":[0.08205568785866227,1.3192134842986976,-0.04216701933864962],"elbowPole":[0.1038368832172161,0.9652514281805494,0.15907342447150283],"ankle":[-0.25070478047876693,1.5148527459255963,0.3509019187873464],"kneePole":[-0.22270561091053936,1.318234604989236,-0.09164703841807004],"handQuaternion":[-0.010637530420344477,-0.15332079687130243,-0.4980306961583427,0.8534313105794405],"footQuaternion":[0.24504767067701202,-0.33643014189620246,0.9073613842252461,-0.05883635896549819],"handLocked":false}},"groundLock":true,"pelvisQuaternion":[0.01190128902092805,-0.009840940988734014,-0.7461237406115414,0.6656281836700862]}},{"id":"flare-saved-16-right-transfer","name":"右侧移重 · 接回后撑","phase":"sideB","sourceStepId":"mirror-20261005-10-6c5f9dec-c1bd-4f56-a3d8-81c75be93c7c","sourceStepNumber":16,"sourceStepName":"右侧移重 · 第10步镜像","sourcePreset":null,"mirrored":true,"pose":{"version":1,"pelvis":[-0.07007888106107946,0.7720626104730002,-0.33144189371099203],"bodyQuaternion":[0.6884117264809348,-0.11040177881154879,-0.4256823395806238,0.5767974409166106],"limbs":{"left":{"wrist":[0.21500000000000002,0.031189341132898618,-1.1102230246251565e-16],"elbowPole":[0.13184425020229218,0.3478909272549951,0.15290060337913164],"ankle":[-0.2021544164567965,0.26999327318300526,-0.9891058341482438],"kneePole":[-0.16926419668416162,0.7407257330417467,-0.8767607806566532],"handQuaternion":[-0.014115609697670064,0.00967441866320057,-0.030224304035934627,0.9993966412951045],"footQuaternion":[0.4277125353770555,-0.18123110953002605,-0.18905342984813847,0.8651451165454856],"handLocked":true},"right":{"wrist":[-0.350382176937909,0.55,0.390798365196093],"elbowPole":[-0.1979829028589189,0.6468147145769494,0.06957434163864108],"ankle":[-0.7926863412523646,1.1193372104041521,-0.073199958231208],"kneePole":[-0.3616284348920045,1.260398406981147,-0.24519718655152647],"handQuaternion":[0.17351002724527126,0.20884616142195156,0.42524722271428583,0.8633900340393375],"footQuaternion":[-0.3760566309157787,-0.48063789237587945,0.6894914295083285,-0.39008998371056375],"handLocked":false}},"groundLock":true,"pelvisQuaternion":[0.6884117264809348,-0.11040177881154879,-0.4256823395806238,0.5767974409166106]}},{"id":"flare-saved-09-rear-repeat","name":"后双撑 · 接回起点","phase":"rear","sourceStepId":"a998d382-0b7f-4ad3-b627-57f44e99561e","sourceStepNumber":9,"sourceStepName":"前双撑 · 开腿起点","sourcePreset":"flare-front-open","mirrored":true,"pose":{"version":1,"pelvis":[-0.029999999999999943,0.7875411999117483,-0.25],"bodyQuaternion":[0.8985343740226003,-0.007470351912587276,0.0006445605531121277,0.43883910158942024],"limbs":{"left":{"wrist":[0.215,0.03115682210638071,-8.326672684688674e-17],"elbowPole":[0.3679072,0.43590140665760185,0.17715781234977546],"ankle":[0.49486288804898193,0.40686809373231875,-0.7652272856350576],"kneePole":[0.2702140644338731,0.37378315689696334,-0.7127973660353976],"handQuaternion":[-0.014115609697670064,0.00967441866320057,-0.030224304035934627,0.9993966412951045],"footQuaternion":[0.501149601194387,-0.3339169438195634,0.18899898676280638,0.7756467848547703],"handLocked":true},"right":{"wrist":[-0.215,0.03113663464124783,0.1],"elbowPole":[-0.3679072,0.43590147865439804,0.17715799894147222],"ankle":[-0.5742504279789087,0.432309189823983,-0.7595179492198025],"kneePole":[-0.3509231115663002,0.38906846675917944,-0.7088646859581507],"handQuaternion":[-0.014115609697670064,-0.00967441866320057,0.030224304035934627,0.9993966412951045],"footQuaternion":[0.5058360746426133,0.3280672253476286,-0.2086002061921243,0.7700569558282452],"handLocked":true}},"groundLock":true,"pelvisQuaternion":[0.8986774439285762,-0.009315986729886845,-0.006751183447908846,0.4384592178154111]}}]'),pv={period:dv,steps:fv},Al=pv,mv=Math.PI*2,gv=new A(0,-1,0),bv=new A(0,0,1),Qo=["left","right"],Ko=Nt.degToRad,yc=i=>new A().fromArray(i);function Tl(i,e,t){return Math.max(i,e)+t*Math.log1p(Math.exp(-Math.abs(i-e)/t))}const _v=(i,e,t)=>-Tl(-i,-e,t);function Bu(i,e){const[t,n]=e==="left"?[.07,.42]:[.58,.93];if(i<=t||i>=n)return{locked:!0,lift:0,at:0};const r=(i-t)/(n-t);return{locked:!1,lift:64*r**3*(1-r)**3,at:r}}function xv({landmarks:i,groundHands:e,shoeOffsets:t,period:n=9}){if(!Number.isFinite(n)||n<=0)throw new Error("数学动画需要有效的循环时长。");const r=Object.fromEntries(Object.entries(i).map(([c,l])=>[c,yc(l)])),s=Object.fromEntries(Qo.map(c=>{const l=r[c+"Hip"].distanceTo(r[c+"Knee"]),h=r[c+"Knee"].distanceTo(r[c+"Ankle"]);return[c,{shoulderOffset:r[c+"Shoulder"].clone().sub(r.pelvis),hipOffset:r[c+"Hip"].clone().sub(r.pelvis),armReach:r[c+"Shoulder"].distanceTo(r[c+"Elbow"])+r[c+"Elbow"].distanceTo(r[c+"Wrist"])-.003,legReach:Math.sqrt(l**2+h**2+2*l*h*Math.cos(Ko(8))),groundWrist:yc(e[c].wrist),groundRotation:new Ve().fromArray(e[c].handQuaternion),shoeCorners:t[c].map(yc)}]}));function o(c){const l=((Number.isFinite(c)?c:0)%n+n)%n/n,h=l*mv,u=Math.sin(h),d=Math.cos(h),p=new Ve(.15+.75*d,.1*Math.sin(2*h),.576*u,.71825-.1805*d-.09875*Math.cos(2*h)).normalize(),g=new A(.22*u,0,.06-.34*d),b={},m={},f={},y=[];for(const I of Qo){const L=I==="left"?1:-1,C=s[I],F=C.shoulderOffset.clone().applyQuaternion(p),w=F.clone().add(g),v=Bu(l,I),T=C.groundWrist.clone();T.x+=v.lift*(w.x+L*.3-T.x),T.z+=v.lift*(w.z+.1-T.z),T.y+=.72*v.lift;const j=(w.x-T.x)**2+(w.z-T.z)**2;if(j>=C.armReach**2)throw new Error("数学轨迹超出手臂的水平可达范围。");y.push(T.y-F.y+Math.sqrt(C.armReach**2-j)),b[I]=w,m[I]=T,f[I]=v}g.y=_v(y[0],y[1],.012)-.003;const x=bv.clone().applyQuaternion(p),_={};for(const I of Qo){const L=I==="left"?1:-1,C=s[I],F=f[I],w=C.hipOffset.clone().applyQuaternion(p).add(g),v=b[I].clone();v.y+=g.y;const T=Ko(48+L*36*u),j=Ko(50+25*d+30*Math.cos(2*h)),q=new A(L*Math.sin(T),-Math.cos(T)*Math.cos(j),Math.cos(T)*Math.sin(j)),se=p.clone().multiply(new Ve().setFromUnitVectors(gv,q)),ne=q.clone().applyQuaternion(p);let $=-1/0;for(const he of C.shoeCorners){const ye=-he.clone().applyQuaternion(se).y;$=Number.isFinite($)?Tl($,ye,.002):ye}const ce=(.006+.012+$-w.y)/C.legReach,P=Tl(ne.y,ce,.012);if(Math.abs(P)>=.9999)throw new Error("数学轨迹无法保持脚底和真实腿长。");const k=Math.hypot(ne.x,ne.z);ne.x*=Math.sqrt(1-P*P)/k,ne.z*=Math.sqrt(1-P*P)/k,ne.y=P;const W=w.clone().addScaledVector(ne,C.legReach),re=new Ve().setFromAxisAngle(new A(1,0,0),Ko(-30)*F.lift).multiply(C.groundRotation);_[I]={wrist:m[I].toArray(),elbowPole:v.clone().add(new A(L*.18,-.05,-.5)).toArray(),handQuaternion:re.toArray(),handLocked:F.locked,ankle:W.toArray(),kneePole:w.clone().addScaledVector(x,.5).toArray(),footQuaternion:se.toArray()}}return{version:1,pelvis:g.toArray(),bodyQuaternion:p.toArray(),groundLock:!0,limbs:_}}function a(c){const l=((Number.isFinite(c)?c:0)%n+n)%n/n,h=Qo.filter(d=>Bu(l,d).locked),u=l<.07||l>=.93?"rear":l<.42?"right":l<=.58?"front":"left";return{phase:l,section:u,supportHands:h,period:n,kneeFlexionDegrees:8}}return{sample:o,describe:a,period:n}}const vv=1e-12,yv=new A(0,1,0),Mv=new A(0,0,1),Mc=2*Math.PI,Qd=i=>((i+Math.PI)%Mc+Mc)%Mc-Math.PI;function Kd(i,e){const t=e.clone().addScaledVector(i,-e.dot(i));return t.lengthSq()<vv&&(t.copy(Math.abs(i.z)<.9?Mv:yv),t.addScaledVector(i,-t.dot(i))),t.normalize()}function zu(i,e){const t=i.clone().normalize(),n=Kd(t,e),r=new A().crossVectors(n,t).normalize();return new Ve().setFromRotationMatrix(new rt().makeBasis(t,r,n))}function Sc(i,e,t,n){return zu(e,n).multiply(zu(i,t).invert()).normalize()}function Rl(i,e,t){const n=i.clone().invert().multiply(e),r=t.clone().normalize();return Qd(2*Math.atan2(n.x*r.x+n.y*r.y+n.z*r.z,n.w))}function Sv({sourceAxis:i,sourceNormal:e,startAxis:t,endAxis:n,currentAxis:r,startNormal:s,endNormal:o,currentNormal:a,startRotation:c,endRotation:l,blend:h}){const u=Sc(i,t,e,s),d=Sc(i,n,e,o),p=Sc(i,r,e,a),g=Rl(u,c,i),b=Rl(d,l,i),m=g+Qd(b-g)*h;return p.multiply(new Ve().setFromAxisAngle(i.clone().normalize(),m)).normalize()}function wv({sourceAxis:i,currentAxis:e,startRotation:t,endRotation:n,startReference:r,endReference:s,currentReference:o,blend:a}){const c=r.clone().invert().multiply(t),l=s.clone().invert().multiply(n),h=o.clone().multiply(c.slerp(l,a)),u=i.clone().normalize().applyQuaternion(h);return new Ve().setFromUnitVectors(u,e.clone().normalize()).multiply(h).normalize()}function Ev(i,e,t,n){if(!n)return t.clone();const r=e.clone().sub(i).normalize(),s=t.clone().sub(i),o=s.dot(r),a=Kd(r,s).applyAxisAngle(r,n),c=Math.max(1e-4,s.clone().addScaledVector(r,-o).length());return i.clone().addScaledVector(r,o).addScaledVector(a,c)}const St=["left","right"],Ii=new A(0,1,0),Di=new A(0,0,1),Av=new A(1,1,1),Un=new Ve,fi=.006,es=Nt.clamp,Yt=i=>new A().fromArray(i);function Yo(i,e){const t=i.clone().normalize(),n=e.clone().addScaledVector(t,-e.dot(t)).normalize(),r=new A().crossVectors(t,n).normalize();return new Ve().setFromRotationMatrix(new rt().makeBasis(r,t,n))}function Ji(i,e,t=Un){const n=i.clone().normalize().applyQuaternion(t),r=e.clone().normalize();return new Ve().setFromUnitVectors(n,r).multiply(t)}function Hu(i,e,t,n){const r=(s,o)=>{const a=s.clone().normalize(),c=o.clone().normalize(),l=new A().crossVectors(c,a).normalize();return new Ve().setFromRotationMatrix(new rt().makeBasis(a,l,c))};return r(e,n).multiply(r(i,t).invert()).normalize()}function $o(i,e,t,n,r){const s=e.clone().sub(i),o=es(s.length(),Math.abs(t-n)+1e-7,t+n-1e-7),a=s.lengthSq()>1e-12?s.normalize():Ii.clone().negate(),c=(t*t-n*n+o*o)/(2*o),l=Math.sqrt(Math.max(0,t*t-c*c)),h=r.clone().sub(i);return h.addScaledVector(a,-h.dot(a)),h.lengthSq()<1e-10&&(h.copy(Math.abs(a.z)<.9?Di:Ii),h.addScaledVector(a,-h.dot(a))),h.normalize(),{middle:i.clone().addScaledVector(a,c).addScaledVector(h,l),end:i.clone().addScaledVector(a,o)}}function wc(i,e,t){if(i.isEmpty())return;const n=new A;for(let r=0;r<8;r++)n.set(r&1?i.max.x:i.min.x,r&2?i.max.y:i.min.y,r&4?i.max.z:i.min.z),t.expandByPoint(n.applyMatrix4(e))}function rr(i,e,t){if(!Array.isArray(i)||i.length!==e||Array.from(i).some(n=>typeof n!="number"||!Number.isFinite(n)))throw new Error(`${t}必须包含 ${e} 个有限数值。`);if(i.some(n=>Math.abs(n)>1e4))throw new Error(`${t}超出可编辑范围。`);return[...i]}function ts(i,e){const t=rr(i,4,e),n=Math.hypot(...t);if(n<1e-12)throw new Error(`${e}不能是零四元数。`);return new Ve().fromArray(t.map(r=>r/n))}function Ec(i){if(!i||typeof i!="object"||i.version!==1)throw new Error("姿势文件版本无效，请使用版本 1 的姿势。");if(typeof i.groundLock!="boolean")throw new Error("姿势的地面锁定必须为 true 或 false。");const e={pelvis:Yt(rr(i.pelvis,3,"骨盆位置")),bodyQuaternion:ts(i.bodyQuaternion,"躯干方向"),groundLock:i.groundLock,limbs:{}};Object.hasOwn(i,"torsoQuaternion")&&(e.torsoQuaternion=ts(i.torsoQuaternion,"腰部方向")),Object.hasOwn(i,"pelvisQuaternion")&&(e.pelvisQuaternion=ts(i.pelvisQuaternion,"髋部方向"));for(const t of St){const n=i.limbs?.[t],r=t==="left"?"左侧":"右侧";if(!n||typeof n.handLocked!="boolean")throw new Error(`${r}手掌锁定必须为 true 或 false。`);e.limbs[t]={wrist:Yt(rr(n.wrist,3,`${r}手腕位置`)),elbowPole:Yt(rr(n.elbowPole,3,`${r}肘部弯曲方向`)),handQuaternion:ts(n.handQuaternion,`${r}手掌方向`),ankle:Yt(rr(n.ankle,3,`${r}脚踝位置`)),kneePole:Yt(rr(n.kneePole,3,`${r}膝部弯曲方向`)),footQuaternion:ts(n.footQuaternion,`${r}脚掌方向`),handLocked:n.handLocked};for(const s of["elbowTwist","kneeTwist","upperArmTwist","thighTwist"])if(Object.hasOwn(n,s)){if(typeof n[s]!="number"||!Number.isFinite(n[s]))throw new Error(`${r}关节扭转需要有限角度。`);e.limbs[t][s]=n[s]}}return e}function Tv({model:i,rigData:e}){if(!i?.isObject3D)throw new Error("Snow motion requires a loaded model.");if(!e?.landmarks)throw new Error("Snow motion requires the accompanying coach-rig.json.");i.updateWorldMatrix(!0,!1),i.updateMatrixWorld(!0);const t=i.matrixWorld.clone().invert(),n=i.getWorldQuaternion(new Ve).invert(),r=new Map,s=[],o=new Set;let a=null;i.traverse(E=>{E.isBone&&r.set(E.name,E),E.isSkinnedMesh&&(s.push(E),o.add(E.skeleton),E.frustumCulled=!1)}),typeof location<"u"&&new URLSearchParams(location.search).get("spine")==="off"||(a=hv({model:i,meshes:s,skeletons:o,landmarks:e.landmarks}));const c=new Map;for(const{name:E}of e.bones??[]){const D=r.get(E);if(!D)throw new Error(`Snow is missing its ${E} bone.`);if(D.parent?.isBone)throw new Error("Snow motion expects parallel deform bones under the armature.");c.set(E,{bone:D,rest:D.getWorldPosition(new A).applyMatrix4(t),restRotation:n.clone().multiply(D.getWorldQuaternion(new Ve)),scale:D.scale.clone(),bounds:new an,target:new A,rotation:new Ve,matrix:new rt})}if(c.size!==20||!s.length)throw new Error("Snow requires its 20 original deform bones and skinned meshes.");const l=Object.fromEntries(Object.entries(e.landmarks).map(([E,D])=>[E,Yt(D)])),h={left:[],right:[]},u={left:[],right:[]},d={left:new an,right:new an};let p=0;for(const E of o)E.update();const g=new A;for(const E of s){const D=/^Coach_(Sneakers|Soles|Shoe_Details)(?:_|$)/.test(E.name),z=E.geometry.getAttribute("position"),U=E.geometry.getAttribute("skinIndex"),G=E.geometry.getAttribute("skinWeight");if(!(!z||!U||!G)){p+=z.count;for(let V=0;V<z.count;V++){E.getVertexPosition(V,g).applyMatrix4(E.matrixWorld).applyMatrix4(t);for(let Q=0;Q<4;Q++){const K=G.getComponent(V,Q);if(K<=1e-7)continue;const Z=E.skeleton.bones[U.getComponent(V,Q)]?.name,X=Z==="spineLower"||Z==="spineUpper"?"torso":Z;c.get(X)?.bounds.expandByPoint(g);for(const oe of St)X===oe+"Hand"&&K>.7&&(h[oe].push(g.clone()),u[oe].push({mesh:E,index:V})),D&&X===oe+"Foot"&&d[oe].expandByPoint(g)}}}}const b={};for(const E of St){const D=E==="left"?1:-1,z=new A(D*.98253144,.05483374,.17783482).normalize(),U=new A(D*.06068526,-.99777448,-.02762938);U.addScaledVector(z,-U.dot(z)).normalize();const G=Yo(z,U);let V=-1/0,Q=.16;for(const ie of h[E]){const de=ie.clone().sub(l[E+"Wrist"]);V=Math.max(V,de.dot(U)),Q=Math.max(Q,de.dot(z))}Number.isFinite(V)||(V=.025);const K=z.clone().multiplyScalar(es(Q*.3,.04,.075)).addScaledVector(U,V),Z=new A(D*.08,-.994,.08).normalize(),X=new A(-D*.92,0,.38),oe=Yo(Z,X).multiply(G.clone().invert());b[E]={upperArm:l[E+"Shoulder"].distanceTo(l[E+"Elbow"]),forearm:l[E+"Elbow"].distanceTo(l[E+"Wrist"]),thigh:l[E+"Hip"].distanceTo(l[E+"Knee"]),shin:l[E+"Knee"].distanceTo(l[E+"Ankle"]),armNormal:l[E+"Elbow"].clone().sub(l[E+"Shoulder"]).cross(l[E+"Wrist"].clone().sub(l[E+"Elbow"])),legNormal:l[E+"Knee"].clone().sub(l[E+"Hip"]).cross(l[E+"Ankle"].clone().sub(l[E+"Knee"])),anchor:new A(D*.215,fi,0),playAnchor:new A(D*.215,fi,0),palmOffset:K,neutralRotation:oe,support:!1,flight:0}}const m=new Ve,f=new Ve,y=new Ve,x=l.pelvis.clone().lerp(l.torso,.3);let _=!1,I=!1;const L=new A(1,0,0),C=Ii.clone(),F=Di.clone(),w=l.pelvis.clone(),v={},T=new Ve,j=new Map,q=new an,se=new an;let ne=0,$=Math.PI,ce="standing",P="skin",k=null,W=!0,re=null,he=fi;const ye=new Map,J=new WeakMap;let fe="arc",Me="smooth",_e=[],Fe=[],$e=[],nt=[],Tt="saved",Ke=null,ct=!1,N=xc(Al.steps,{period:Al.period,mapTransition:te,resolveFootEndpoint:st}),Kt=!0,_t=[];const dt=E=>E.clone().sub(l.pelvis).applyQuaternion(m).add(w),De=E=>E.pelvisQuaternion??E.bodyQuaternion,Ut=E=>!E||E.x*E.x+E.y*E.y+E.z*E.z<1e-24,tt=()=>Ut(y)?m.clone():m.clone().multiply(y);function R(E,D,z){return Ut(z)?E.clone().sub(l.pelvis).applyQuaternion(D):x.clone().sub(l.pelvis).applyQuaternion(D).add(E.clone().sub(x).applyQuaternion(D.clone().multiply(z)))}const M=E=>R(E,m,y).add(w);function Y(E,D,z){const U=E.clone().invert().multiply(D),G=z.clone().normalize(),V=U.x*G.x+U.y*G.y+U.z*G.z;return((2*Math.atan2(V,U.w)+Math.PI)%(Math.PI*2)+Math.PI*2)%(Math.PI*2)-Math.PI}function pe(){i.updateWorldMatrix(!0,!1),i.updateMatrixWorld(!0),i.getWorldQuaternion(T),j.clear();for(const{bone:E}of c.values())j.has(E.parent)||j.set(E.parent,{inverse:E.parent.matrixWorld.clone().invert(),inverseRotation:E.parent.getWorldQuaternion(new Ve).invert()})}function me(E,D,z){const U=c.get(E),G=j.get(U.bone.parent);U.target.copy(D),U.rotation.copy(z),U.bone.position.copy(D).applyMatrix4(i.matrixWorld).applyMatrix4(G.inverse),U.bone.quaternion.copy(G.inverseRotation).multiply(T).multiply(z).multiply(U.restRotation),U.bone.scale.copy(U.scale),U.bone.updateMatrix(),U.matrix.compose(D,z,Av).multiply(new rt().makeTranslation(-U.rest.x,-U.rest.y,-U.rest.z))}function ue(){i.updateMatrixWorld(!0),a?.update();for(const E of o)E.update();he=Math.min(Ye("left"),Ye("right")),W=!0}function Ye(E){return se.makeEmpty(),wc(d[E],c.get(E+"Foot").matrix,se),se.isEmpty()?v[E].ankle.y-l[E+"Ankle"].y:se.min.y}function Re(){me("pelvis",dt(l.pelvis),f);const E=tt();for(const D of["torso","neck","head"])me(D,M(l[D]),E)}function Oe(E,D,z,U,G,V){const Q=tt(),K=U.clone().sub(z).cross(G.clone().sub(U)),Z=(ve,xe)=>ct?Hu(ve,xe,b[E].armNormal,K):Ji(ve,xe,Q),X=l[E+"Elbow"].clone().sub(l[E+"Shoulder"]),oe=Z(X,U.clone().sub(z));D.upperArmTwist&&oe.multiply(new Ve().setFromAxisAngle(X.normalize(),D.upperArmTwist));const ie=l[E+"Wrist"].clone().sub(l[E+"Elbow"]),de=Z(ie,G.clone().sub(U));D.elbowTwist&&de.multiply(new Ve().setFromAxisAngle(ie.normalize(),D.elbowTwist)),me(E+"Scapula",z,Q),me(E+"UpperArm",z,oe),me(E+"Forearm",U,de),me(E+"Hand",G,V),Object.assign(D,{shoulder:z,elbow:U,wrist:G,palm:b[E].palmOffset.clone().applyQuaternion(V).add(G)})}function Rt(E,D,z,U,G,V){const Q=U.clone().sub(z).cross(G.clone().sub(U)),K=(de,ve)=>ct?Hu(de,ve,b[E].legNormal,Q):Ji(de,ve,f),Z=l[E+"Knee"].clone().sub(l[E+"Hip"]),X=K(Z,U.clone().sub(z));D.thighTwist&&X.multiply(new Ve().setFromAxisAngle(Z.normalize(),D.thighTwist));const oe=l[E+"Ankle"].clone().sub(l[E+"Knee"]),ie=K(oe,G.clone().sub(U));D.kneeTwist&&ie.multiply(new Ve().setFromAxisAngle(oe.normalize(),D.kneeTwist)),me(E+"Thigh",z,X),me(E+"Patella",U,X.clone().slerp(ie,.52)),me(E+"Shin",U,ie),me(E+"Foot",G,V),Object.assign(D,{hip:z,knee:U,ankle:G}),D.toe=new A(0,0,.18).applyQuaternion(V).add(G)}function Se(){ce="standing",ct=!1,Kt=!0,_t=[],ne=0,$=Math.PI,m.identity(),f.identity(),I=!1,y.identity(),_=!1,L.set(1,0,0),C.copy(Ii),F.copy(Di);const E=Math.min(...St.map(D=>d[D].isEmpty()?0:d[D].min.y));w.copy(l.pelvis).addScaledVector(Ii,fi-E),pe(),Re();for(const D of St){const z=b[D],U=D==="left"?1:-1;z.support=!1,z.flight=0,z.anchor.copy(z.playAnchor);const G=v[D]={},V=dt(l[D+"Shoulder"]),Q=V.clone().addScaledVector(new A(U*.18,-.978,.06).normalize(),z.upperArm),K=Q.clone().addScaledVector(new A(U*.08,-.994,.08).normalize(),z.forearm);Oe(D,G,V,Q,K,z.neutralRotation),Rt(D,G,dt(l[D+"Hip"]),dt(l[D+"Knee"]),dt(l[D+"Ankle"]),Un)}return ue(),re=oh(),i}function ke(E=0){const D=((Number.isFinite(E)?E:0)%N.period+N.period)%N.period,z=!Ke&&Jn();return Bn(Ke?Ke.sample(D):z?ee(D):N.sample(D),{alignBendPlanes:!!Ke,bodyOffset:z?U=>hi(D,U):0}),ce="flare",ne=D,i}function Ze(E){const D=JSON.stringify(E);return ye.has(D)||(ye.size>=256&&ye.clear(),ye.set(D,Ue(E))),ye.get(D)}function st(E,D){return Ze(E).solved[D].leg.end.toArray()}const Be=typeof location<"u"&&new URLSearchParams(location.search).get("hip")==="linear",yt=(E,D)=>E.pelvis.every((z,U)=>Math.abs(z-D.pelvis[U])<1e-9)&&E.bodyQuaternion.every((z,U)=>Math.abs(z-D.bodyQuaternion[U])<1e-9);function pt(E,D,z,U,G){const V=N?.steps;if(Be||!V||V.length<4||!yt(V[0].pose,V[V.length-1].pose))return null;const Q=V.length-1,K=V.findIndex(Ge=>yt(Ge.pose,E));if(K<0||!yt(V[(K+1)%V.length].pose,D))return null;const Z=Ze(V[(K-1+Q)%Q].pose).constrainedPelvis,X=Ze(V[(K+2)%Q].pose).constrainedPelvis,oe=z.constrainedPelvis,ie=U.constrainedPelvis,de=G,ve=de*de,xe=ve*de;return new A(0,0,0).addScaledVector(Z,-.5*xe+ve-.5*de).addScaledVector(oe,1.5*xe-2.5*ve+1).addScaledVector(ie,-1.5*xe+2*ve+.5*de).addScaledVector(X,.5*xe-.5*ve)}const Lt=fi+.06,O=fi+.12,Ce=.9985,ae=.99993;function ge(E,D){for(const z of St){const U=E.limbs[z],G=b[z];if(U.handLocked||U.wrist.y<=Lt)continue;const V=Nt.smoothstep(U.wrist.y,Lt,O),Q=R(l[z+"Shoulder"],E.bodyQuaternion,E.torsoQuaternion).add(D),K=(G.upperArm+G.forearm)*Ce,Z=U.wrist.clone().sub(Q);if(Z.length()<1e-6||Z.length()>=K)continue;const X=Q.clone().addScaledVector(Z.normalize(),K),oe=fi+.03;if(X.y<oe){const ie=Q.y-oe,de=new A(Z.x,0,Z.z);ie<K&&de.lengthSq()>1e-8?X.copy(Q).addScaledVector(de.normalize(),Math.sqrt(K*K-ie*ie)).setY(oe):X.y=oe}U.wrist.lerp(X,V)}}const Ie=new WeakMap,Le=new WeakMap;let ut=null;function $t(E,D,z,U=null){ut=U;try{return fn(E,D,z)}finally{ut=null}}function fn(E,D,z){if(!z?.size)return Dt(E,D);const U=[...z.keys()].map(V=>[V,E.limbs[V].wrist.clone(),E.limbs[V].handLocked]);for(const[V,Q]of z)E.limbs[V].wrist.copy(Q),E.limbs[V].handLocked=!0;const G=Dt(E,D);for(const[V,Q,K]of U)E.limbs[V].wrist.copy(Q),E.limbs[V].handLocked=K;return G}function Dt(E,D){let z=0;const U=[];for(const G of St){const V=E.limbs[G].wrist,Q=b[G],K=Q.upperArm+Q.forearm-2e-5,Z=K*ae,oe=R(l[G+"Shoulder"],E.bodyQuaternion,E.torsoQuaternion).add(D).clone().sub(V),ie=Math.hypot(oe.x,oe.z),de=E.limbs[G].handLocked?1:Ln?1-Nt.smoothstep(V.y,Lt,O+.05):ut?.[G]??0;de>0&&U.push([de,ie<K?Math.sqrt(K*K-ie*ie)-oe.y:0]);const ve=Nt.clamp((O-V.y)/(O-Lt),0,1);ve<=0||oe.length()>=Z||ie>=Z||(z=Math.max(z,ve*(Math.sqrt(Z*Z-ie*ie)-oe.y)))}for(const[G,V]of U)z=Math.min(z,z+G*(Math.min(z,V)-z));return Math.max(0,z)}const Ln=typeof location<"u"&&new URLSearchParams(location.search).get("smooth")==="0"||globalThis.__COACH_SMOOTH_OFF===!0,jn=E=>{const D=E*E,z=D*E;return[2*z-3*D+1,z-2*D+E,-2*z+3*D,z-D]};function On(E,D,z,U,G,V=!1,Q=!1){const[K,Z,X,oe]=jn(G),ie=V?new A:z.clone().sub(E).multiplyScalar(.5),de=Q?new A:U.clone().sub(D).multiplyScalar(.5);return D.clone().multiplyScalar(K).addScaledVector(ie,Z).addScaledVector(z,X).addScaledVector(de,oe)}function dr(E,D,z,U,G,V=!1,Q=!1){const K=et=>new vt().fromArray(et),Z=K(D),X=K(z),oe=K(E),ie=K(U);X.dot(Z)<0&&X.negate(),oe.dot(Z)<0&&oe.negate(),ie.dot(X)<0&&ie.negate();const[de,ve,xe,Ge]=jn(G),Ee=V?new vt:X.clone().sub(oe).multiplyScalar(.5),je=Q?new vt:ie.clone().sub(Z).multiplyScalar(.5);return Z.clone().multiplyScalar(de).add(Ee.multiplyScalar(ve)).add(X.clone().multiplyScalar(xe)).add(je.multiplyScalar(Ge)).normalize().toArray()}function Jn(){const E=N?.steps;return!Ln&&!Ke&&E&&E.length>=5&&!_e.length&&!Fe.length&&!$e.length&&!nt.length&&yt(E[0].pose,E[E.length-1].pose)}const Us=.12,uo=!0,fo=.03,qi=[.003,.03],ei={right:.7},Fr=.85,po=.3,mo=.6,Pa=0,La=.75,Da=1.8,S=.55;function B(E,D){let z=1/0;const U=l[E+"Wrist"];for(let G=0;G<h[E].length;G+=3)z=Math.min(z,h[E][G].clone().sub(U).applyQuaternion(D).y);return Number.isFinite(z)?z:-.035}function ee(E){const D=N.steps,z=D.length-1,U=N.period/(z+1),G=(E%N.period+N.period)%N.period,V=G<=(z-1)*U?G/U:z-1+(G-(z-1)*U)/(2*U),Q=Math.min(z-1,Math.floor(V)),K=V-Q;let Z=K;const X=le=>D[(le%z+z)%z].pose,oe=X(Q-1),ie=X(Q),de=X(Q+1),ve=X(Q+2),xe=structuredClone(ie),Ge=le=>dr(oe[le]??oe.bodyQuaternion,ie[le]??ie.bodyQuaternion,de[le]??de.bodyQuaternion,ve[le]??ve.bodyQuaternion,Z);xe.bodyQuaternion=Ge("bodyQuaternion"),(ie.pelvisQuaternion||de.pelvisQuaternion)&&(xe.pelvisQuaternion=Ge("pelvisQuaternion")),(ie.torsoQuaternion||de.torsoQuaternion)&&(xe.torsoQuaternion=dr(...[oe,ie,de,ve].map(le=>le.torsoQuaternion??[0,0,0,1]),Z));const Ee=[oe,ie,de,ve].map(Ze);xe.pelvis=On(...Ee.map(le=>le.constrainedPelvis),Z).toArray();const je={},Je={},et=new Map,be={};for(const le of St){const Ae=[oe,ie,de,ve].map(Et=>Et.limbs[le]),ze=xe.limbs[le];let Gt=Ae,kt=Ee,Jt=K,nn=Ae[1].handLocked,rn=Ae[2].handLocked;const Bt=ei[le]||0,Mt=Et=>(Et%z+z)%z===z-1?2:1;if(Bt&&rn&&!nn)Jt=K*Mt(Q)/(Mt(Q)+Bt),Je[le]={nodes:kt,t:Jt,mix:0};else if(Bt&&nn&&!Ae[0].handLocked&&K<Bt){const Et=[X(Q-2),X(Q-1),X(Q),X(Q+1)];Gt=Et.map(bn=>bn.limbs[le]),kt=Et.map(Ze),Jt=(Mt(Q-1)+K)/(Mt(Q-1)+Bt),nn=!1,rn=!0,Je[le]={nodes:kt,t:Jt,mix:Nt.smootherstep(K,0,Bt)},et.set(le,kt[2].solved[le].arm.end.clone())}if(ze.handLocked=nn&&rn,Ae[1].handLocked&&!Ae[2].handLocked&&(be[le]=1-Nt.smoothstep(K,0,Us)),ze.handQuaternion=dr(...Gt.map(Et=>Et.handQuaternion),Jt,nn,rn),rn&&!nn){const Et=Nt.smoothstep(Jt,Pa,Bt?S:La);Et>0&&(ze.handQuaternion=new Ve().fromArray(ze.handQuaternion).slerp(new Ve().fromArray(Gt[2].handQuaternion),Et).toArray())}if(ze.footQuaternion=dr(...Ae.map(Et=>Et.footQuaternion),K),ze.wrist=On(...kt.map(Et=>Et.solved[le].arm.end),Jt,nn,rn).toArray(),!ze.handLocked){const Et=mn=>mn.requested.bodyQuaternion.clone().multiply(mn.requested.torsoQuaternion??Un),bn=kt.map(mn=>mn.solved[le].arm.end.clone().sub(mn.solved[le].shoulder).applyQuaternion(Et(mn).invert())),Si=Math.max(On(...bn.map(mn=>new A(mn.length(),0,0)),Jt).x,b[le].upperArm+b[le].forearm+.001),zn=new Ve().fromArray(xe.bodyQuaternion).multiply(xe.torsoQuaternion?new Ve().fromArray(xe.torsoQuaternion):Un.clone()),En=R(l[le+"Shoulder"],new Ve().fromArray(xe.bodyQuaternion),xe.torsoQuaternion?new Ve().fromArray(xe.torsoQuaternion):void 0).add(new A().fromArray(xe.pelvis)),Wt=On(...bn,Jt).setLength(Si).applyQuaternion(zn),Xn=En.clone().add(Wt),Qn=new A().fromArray(ze.wrist),ui=Nt.smoothstep(Math.min(Qn.y,Xn.y),Lt,O+.1);if(ze.wrist=Qn.clone().lerp(Xn,ui).toArray(),je[le]={local:Wt,world:Qn,w:ui,shoulderS:En,t:Jt},rn){const mn=new Ve().fromArray(Gt[2].handQuaternion);je[le].approach=!0,je[le].plantWrist=kt[2].solved[le].arm.end.clone(),je[le].startWrist=kt[1].solved[le].arm.end.clone(),je[le].plantLow=kt[2].solved[le].arm.end.y+B(le,mn),je[le].startLow=kt[1].solved[le].arm.end.y+B(le,new Ve().fromArray(Gt[1].handQuaternion))}}ze.elbowPole=On(...Gt.map(Et=>new A().fromArray(Et.elbowPole)),Jt).toArray(),ze.kneePole=On(...Ae.map(Et=>new A().fromArray(Et.kneePole)),K).toArray()}Z=K;const We=Ec(xe),ot=pn(We),Vt=$t(We,ot,et,be);Vt>0&&(ot.y+=Vt,We.pelvis.y+=Vt),xe.pelvis=ot.toArray();for(const le of St){const Ae=je[le];if(!Ae)continue;const ze=R(l[le+"Shoulder"],We.bodyQuaternion,We.torsoQuaternion).add(ot),Gt=ze.clone().add(Ae.local);if(xe.limbs[le].wrist=Ae.world.clone().lerp(Gt,Ae.w).toArray(),Ae.approach){{const Bt=new A().fromArray(xe.limbs[le].wrist),Mt=Nt.lerp(b[le].upperArm+b[le].forearm+.001,(ei[le]?Ae.plantWrist:Bt).distanceTo(ze),Nt.smootherstep(Ae.t,ei[le]?.85:.6,1)),Et=1-mo*Nt.smootherstep(Ae.t,0,1),bn=Ae.plantWrist.clone().add(new A(Bt.x-Ae.plantWrist.x,0,Bt.z-Ae.plantWrist.z).multiplyScalar(Et)),Si=(bn.x-ze.x)**2+(bn.z-ze.z)**2;if(Si<Mt*Mt&&(xe.limbs[le].wrist=bn.setY(ze.y-Math.sqrt(Mt*Mt-Si)).toArray()),ei[le]){const zn=new A().fromArray(xe.limbs[le].wrist),En=Ae.plantWrist,Wt=Ae.startWrist,Xn=Nt.clamp(Ae.t/Fr,0,1),Qn=(1-Xn)**3*(1+3*Xn),ui=Nt.smoothstep(Ae.t,0,po);let mn=Nt.lerp(zn.x,En.x+(Wt.x-En.x)*Qn,ui),mr=Nt.lerp(zn.z,En.z+(Wt.z-En.z)*Qn,ui),wi=(mn-ze.x)**2+(mr-ze.z)**2,Ua=wi<Mt*Mt?ze.y-Math.sqrt(Mt*Mt-wi):ze.y;const Fa=qi?1-Nt.smoothstep(Nt.lerp(zn.y,Ua,ui)-En.y,qi[0],qi[1]):0;if(Fa>0&&(mn=Nt.lerp(mn,En.x,Fa),mr=Nt.lerp(mr,En.z,Fa),wi=(mn-ze.x)**2+(mr-ze.z)**2,Ua=wi<Mt*Mt?ze.y-Math.sqrt(Mt*Mt-wi):ze.y),xe.limbs[le].wrist=[mn,Nt.lerp(zn.y,Ua,ui),mr],ui<1){const Oa=new A().fromArray(xe.limbs[le].wrist).sub(ze);Oa.length()>1e-6&&Oa.length()<Mt&&(xe.limbs[le].wrist=ze.clone().add(Oa.setLength(Mt)).toArray())}}}const kt=Ae.plantLow,Jt=new Ve().fromArray(xe.limbs[le].handQuaternion),nn=xe.limbs[le].wrist[1]+B(le,Jt),rn=ei[le]?kt:kt+Math.max(0,Ae.startLow-kt)*Math.pow(1-Ae.t,Da);if(nn<rn&&ei[le]&&uo)xe.limbs[le].wrist[1]+=rn-nn;else if(nn<rn){const Bt=new A().fromArray(xe.limbs[le].wrist),Mt=Bt.distanceTo(ze),Et=Bt.y+rn-nn-ze.y,bn=new A(Bt.x-ze.x,0,Bt.z-ze.z);Math.abs(Et)<Mt&&bn.lengthSq()>1e-10&&(xe.limbs[le].wrist=ze.clone().addScaledVector(bn.normalize(),Math.sqrt(Mt*Mt-Et*Et)).setY(ze.y+Et).toArray())}}We.limbs[le].wrist.fromArray(xe.limbs[le].wrist)}const ht=We.bodyQuaternion.clone().multiply(We.torsoQuaternion??Un),mt=le=>le.requested.bodyQuaternion.clone().multiply(le.requested.torsoQuaternion??Un),[Qe,gt]=[Ee[1],Ee[2]];for(const le of St){const Ae=b[le],ze=Qe.solved[le],Gt=gt.solved[le],kt=Wt=>Wt.solved[le].leg.end.clone().sub(Wt.solved[le].hip).applyQuaternion(De(Wt.requested).clone().invert()),Jt=Ee.map(kt),nn=On(...Jt.map(Wt=>new A(Wt.length(),0,0)),Z).x,rn=De(We),Bt=l[le+"Hip"].clone().sub(l.pelvis).applyQuaternion(rn).add(ot),Mt=Bt.clone().add(On(...Jt,Z).setLength(nn).applyQuaternion(rn)),Et=xe.groundLock?wt(le,We.limbs[le].footQuaternion):-1/0;if(Mt.y<Et&&Et-Bt.y<=nn){const Wt=Et-Bt.y,Xn=new A(Mt.x-Bt.x,0,Mt.z-Bt.z);Xn.lengthSq()>1e-10&&Mt.copy(Bt).addScaledVector(Xn.normalize(),Math.sqrt(nn*nn-Wt*Wt)).setY(Et)}const bn=qs({startRoot:ze.hip.toArray(),endRoot:Gt.hip.toArray(),currentRoot:Bt.toArray(),startTarget:ze.leg.end.toArray(),endTarget:Gt.leg.end.toArray(),currentTarget:Mt.toArray(),startMiddle:ze.leg.middle.toArray(),endMiddle:Gt.leg.middle.toArray(),startReference:De(Qe.requested).toArray(),endReference:De(gt.requested).toArray(),currentReference:rn.toArray(),blend:Z,upperLength:Ae.thigh,lowerLength:Ae.shin,arc:!1,side:le}),Si=(Wt,Xn,Qn,ui,mn)=>{const mr=Ee.map(wi=>Xn(wi).clone().sub(Wt(wi)).applyQuaternion(Qn(wi).clone().invert()));return mn.clone().add(On(...mr,Z).applyQuaternion(ui)).toArray()};xe.limbs[le].ankle=bn.target,xe.limbs[le].kneePole=Si(Wt=>Wt.solved[le].hip,Wt=>Wt.requested.limbs[le].kneePole,Wt=>De(Wt.requested),rn,Bt);const zn=R(l[le+"Shoulder"],We.bodyQuaternion,We.torsoQuaternion).add(ot);qs({startRoot:ze.shoulder.toArray(),endRoot:Gt.shoulder.toArray(),currentRoot:zn.toArray(),startTarget:ze.arm.end.toArray(),endTarget:Gt.arm.end.toArray(),currentTarget:xe.limbs[le].wrist,startMiddle:ze.arm.middle.toArray(),endMiddle:Gt.arm.middle.toArray(),startReference:mt(Qe).toArray(),endReference:mt(gt).toArray(),currentReference:ht.toArray(),blend:Z,upperLength:Ae.upperArm,lowerLength:Ae.forearm,arc:!1,side:le}),xe.limbs[le].elbowPole=Si(Wt=>Wt.solved[le].shoulder,Wt=>Wt.requested.limbs[le].elbowPole,mt,ht,zn);const En=Je[le];if(En){const Wt=En.nodes.map(Qn=>Qn.requested.limbs[le].elbowPole.clone().sub(Qn.solved[le].shoulder).applyQuaternion(mt(Qn).clone().invert())),Xn=zn.clone().add(On(...Wt,En.t).applyQuaternion(ht));xe.limbs[le].elbowPole=Xn.lerp(new A().fromArray(xe.limbs[le].elbowPole),En.mix).toArray()}}return et.size&&Ie.set(xe,et),Object.keys(be).length&&Le.set(xe,be),xe}function te(E,{start:D,end:z,blend:U}){const G=Ze(D),V=Ze(z);E.pelvis=(pt(D,z,G,V,U)??G.constrainedPelvis.clone().lerp(V.constrainedPelvis,U)).toArray();for(const ie of St)E.limbs[ie].wrist=G.solved[ie].arm.end.clone().lerp(V.solved[ie].arm.end,U).toArray();const Q=Ec(E),K=pn(Q),Z=Dt(Q,K);if(Z>0){K.y+=Z,Q.pelvis.y+=Z;for(const ie of St)for(const de of["ankle","kneePole"])E.limbs[ie][de]&&(E.limbs[ie][de][1]+=Z)}E.pelvis=K.toArray();const X=ie=>ie.requested.bodyQuaternion.clone().multiply(ie.requested.torsoQuaternion??Un).toArray(),oe=Q.bodyQuaternion.clone().multiply(Q.torsoQuaternion??Un);for(const ie of St){const de=b[ie],ve=G.solved[ie],xe=V.solved[ie],Ge=R(l[ie+"Shoulder"],Q.bodyQuaternion,Q.torsoQuaternion).add(K),Ee=qs({startRoot:ve.shoulder.toArray(),endRoot:xe.shoulder.toArray(),currentRoot:Ge.toArray(),startTarget:ve.arm.end.toArray(),endTarget:xe.arm.end.toArray(),currentTarget:E.limbs[ie].wrist,startMiddle:ve.arm.middle.toArray(),endMiddle:xe.arm.middle.toArray(),startReference:X(G),endReference:X(V),currentReference:oe.toArray(),blend:U,upperLength:de.upperArm,lowerLength:de.forearm,arc:!E.limbs[ie].handLocked,side:ie});E.limbs[ie].wrist=Ee.target,E.limbs[ie].elbowPole=Ee.pole;const je=l[ie+"Hip"].clone().sub(l.pelvis).applyQuaternion(De(Q)).add(K),Je=E.groundLock?wt(ie,Q.limbs[ie].footQuaternion):-1/0,et=qs({startRoot:ve.hip.toArray(),endRoot:xe.hip.toArray(),currentRoot:je.toArray(),startTarget:ve.leg.end.toArray(),endTarget:xe.leg.end.toArray(),currentTarget:E.limbs[ie].ankle,startMiddle:ve.leg.middle.toArray(),endMiddle:xe.leg.middle.toArray(),startReference:De(G.requested).toArray(),endReference:De(V.requested).toArray(),currentReference:De(Q).toArray(),blend:U,upperLength:de.thigh,lowerLength:de.shin,floorHeight:Je,side:ie});E.limbs[ie].ankle=et.target,E.limbs[ie].kneePole=et.pole}return E}function H(E){const{requested:D,solved:z}=E,U=D.bodyQuaternion.clone().multiply(D.torsoQuaternion??Un),G=De(D),V={pelvis:G.clone(),torso:U.clone(),neck:U.clone(),head:U.clone()};for(const Q of St){const{source:K,shoulder:Z,arm:X,hip:oe,leg:ie}=z[Q],de=[["UpperArm","Shoulder","Elbow",X.middle.clone().sub(Z),U,"upperArmTwist"],["Forearm","Elbow","Wrist",X.end.clone().sub(X.middle),U,"elbowTwist"],["Thigh","Hip","Knee",ie.middle.clone().sub(oe),G,"thighTwist"],["Shin","Knee","Ankle",ie.end.clone().sub(ie.middle),G,"kneeTwist"]];for(const[ve,xe,Ge,Ee,je,Je]of de){const et=l[Q+Ge].clone().sub(l[Q+xe]),be=Ji(et,Ee,je);K[Je]&&be.multiply(new Ve().setFromAxisAngle(et.normalize(),K[Je])),V[Q+ve]=be}V[Q+"Scapula"]=U.clone(),V[Q+"Patella"]=V[Q+"Thigh"].clone().slerp(V[Q+"Shin"],.52),V[Q+"Hand"]=K.handQuaternion.clone(),V[Q+"Foot"]=K.footQuaternion.clone()}return V}function we(E,{start:D,end:z,blend:U,guide:G}){const V=structuredClone(E),Q=Ue(E),K=Zx(U),Z=Ze(D),X=Ze(z),oe={},ie=[],de=be=>Yt(G.bends?.[be]??[0,0,0]).multiplyScalar(K),ve=(be,We)=>We==="pelvis"?be.constrainedPelvis:be.solved[We.startsWith("left")?"left":"right"][We.endsWith("Wrist")?"arm":"leg"].end,xe=be=>G.orbitPaths?.[be]?tv(ve(Z,be).toArray(),ve(X,be).toArray(),G.orbitPaths[be],U):G.smoothPaths?.[be]?Jx(ve(Z,be).toArray(),ve(X,be).toArray(),G.smoothPaths[be].bend,U):ve(Q,be).clone().add(de(be)).toArray();oe.pelvis=xe("pelvis"),V.pelvis=[...oe.pelvis];for(const be of St){const We=V.limbs[be];Z.requested.limbs[be].handLocked&&X.requested.limbs[be].handLocked?(We.wrist=Z.solved[be].arm.end.clone().lerp(X.solved[be].arm.end,U).toArray(),(G.orbitPaths?.[be+"Wrist"]||G.smoothPaths?.[be+"Wrist"]||de(be+"Wrist").lengthSq()>1e-16)&&ie.push(`${be==="left"?"左":"右"}手在两端均为支撑手，腕部路线偏移已忽略。`)):(oe[be+"Wrist"]=xe(be+"Wrist"),We.wrist=[...oe[be+"Wrist"]]),oe[be+"Ankle"]=xe(be+"Ankle"),We.ankle=[...oe[be+"Ankle"]]}const Ge=Ue(V);V.pelvis=Ge.constrainedPelvis.toArray();const Ee=be=>be.requested.bodyQuaternion.clone().multiply(be.requested.torsoQuaternion??Un);for(const be of St){const We=b[be],ot=Z.solved[be],Vt=X.solved[be],ht=Ge.solved[be],mt=V.limbs[be];for(const Qe of[!0,!1]){const gt=Qe?ht.shoulder:ht.hip,le=Qe?ht.arm.end:ht.leg.end,Ae=Qe?ot.arm:ot.leg,ze=Qe?Vt.arm:Vt.leg,Gt=qs({startRoot:(Qe?ot.shoulder:ot.hip).toArray(),endRoot:(Qe?Vt.shoulder:Vt.hip).toArray(),currentRoot:gt.toArray(),startTarget:Ae.end.toArray(),endTarget:ze.end.toArray(),currentTarget:le.toArray(),startMiddle:Ae.middle.toArray(),endMiddle:ze.middle.toArray(),startReference:(Qe?Ee(Z):De(Z.requested)).toArray(),endReference:(Qe?Ee(X):De(X.requested)).toArray(),currentReference:(Qe?Ee(Ge):De(Ge.requested)).toArray(),blend:U,upperLength:Qe?We.upperArm:We.thigh,lowerLength:Qe?We.forearm:We.shin,arc:!1,side:be}),kt=(G.bendAngles?.[be+(Qe?"Elbow":"Knee")]??0)*K;mt[Qe?"wrist":"ankle"]=le.toArray(),mt[Qe?"elbowPole":"kneePole"]=Ev(gt,le,Yt(Gt.pole),kt).toArray()}}const je=Ue(V),Je=H(Z),et=H(X);for(const be of St){const We=Z.solved[be],ot=X.solved[be],Vt=je.solved[be];for(const ht of[!0,!1]){const mt=Ae=>ht?Ae.shoulder:Ae.hip,Qe=Ae=>ht?Ae.arm:Ae.leg,gt=Ae=>Qe(Ae).middle.clone().sub(mt(Ae)).cross(Qe(Ae).end.clone().sub(Qe(Ae).middle)),le=ht?b[be].armNormal:b[be].legNormal;for(const Ae of[!1,!0]){const ze=be+(ht?Ae?"Forearm":"UpperArm":Ae?"Shin":"Thigh"),Gt=ht?Ae?"elbowTwist":"upperArmTwist":Ae?"kneeTwist":"thighTwist",kt=l[be+(ht?Ae?"Wrist":"Elbow":Ae?"Ankle":"Knee")].clone().sub(l[be+(ht?Ae?"Elbow":"Shoulder":Ae?"Knee":"Hip")]),Jt=Mt=>Ae?Qe(Mt).end.clone().sub(Qe(Mt).middle):Qe(Mt).middle.clone().sub(mt(Mt)),nn=ht?Sv({sourceAxis:kt,sourceNormal:le,startAxis:Jt(We),endAxis:Jt(ot),currentAxis:Jt(Vt),startNormal:gt(We),endNormal:gt(ot),currentNormal:gt(Vt),startRotation:Je[ze],endRotation:et[ze],blend:U}):wv({sourceAxis:kt,currentAxis:Jt(Vt),startRotation:Je[ze],endRotation:et[ze],startReference:De(Z.requested),endReference:De(X.requested),currentReference:De(je.requested),blend:U}),rn=ht?Ee(je):De(je.requested),Bt=Ji(kt,Jt(Vt),rn);V.limbs[be][Gt]=Rl(Bt,nn,kt)}}}return J.set(V,{targets:oe,warnings:[...new Set([...Ge.warnings,...je.warnings,...ie])]}),V}function Ne(E,D={}){const z=D.legPath==="linear"?"linear":"arc",U=xc(E,{...D,mapTransition:z==="arc"?te:void 0,resolveFootEndpoint:st,mapGuidedTransition:we});if(D.segmentGuides?.some(X=>Object.keys(X.orbitPaths??{}).length)){const X=[...new Set([...E.map((oe,ie)=>ie*U.period/E.length),...(D.corrections??[]).map(oe=>(oe.segment+oe.at)*U.period/E.length)])].sort((oe,ie)=>oe-ie);for(let oe=0;oe<X.length;oe++){const ie=(X[oe]+(X[oe+1]??U.period))/2,de=U.guideAt(ie);de&&Object.keys(de.guide.orbitPaths??{}).length&&U.sample(ie)}}const G=D.motionModel==="periodic"?xv({landmarks:e.landmarks,period:U.period,groundHands:Object.fromEntries(St.map(X=>[X,Ot(X,[0,0,1])])),shoeOffsets:Object.fromEntries(St.map(X=>[X,Array.from({length:8},(oe,ie)=>{const de=d[X];return new A(ie&1?de.max.x:de.min.x,ie&2?de.max.y:de.min.y,ie&4?de.max.z:de.min.z).sub(l[X+"Ankle"]).toArray()})]))}):null;if(G)for(let X=0;X<180;X++)Ue(G.sample(X*U.period/180));const V=structuredClone(D.corrections??[]),Q=structuredClone(D.skippedSteps??[]),K=structuredClone(D.footCurves??[]),Z=structuredClone(D.segmentGuides??[]);N=U,_e=V,Fe=Q,$e=K,nt=Z,Ke=G,Tt=G?"periodic":"saved",ye.clear(),fe=z,Me=D.interpolation??"smooth",ce==="flare"&&ke(ne)}function qe(E={}){if(!E||typeof E!="object"||Array.isArray(E))throw new Error("动画采样选项需要为对象。");const D=E.legPath??fe;if(!["arc","linear"].includes(D))throw new Error("未知的轨迹路线。");return["steps","corrections","legPath","interpolation","skippedSteps","footCurves","segmentGuides"].some(U=>E[U]!==void 0)?xc(E.steps??N.steps,{period:E.period??N.period,corrections:E.corrections??_e,skippedSteps:E.skippedSteps??Fe,footCurves:E.footCurves??$e,resolveFootEndpoint:st,segmentGuides:E.segmentGuides??nt,mapGuidedTransition:we,interpolation:E.interpolation??Me,mapTransition:D==="arc"?te:void 0}):N}function Xe(E,D={}){if(!Number.isFinite(E))throw new Error("动画采样时间需要为有限数值。");return!Object.keys(D).length&&Jn()?ee(E):qe(D).sample(E)}function lt(E,D={}){return typeof D=="string"?N.guideAt(E,D):qe(D).guideAt(E,{prefer:D.prefer??"next"})}function ft(E={}){const{startTime:D,endTime:z,samples:U=64,includeTimes:G=[]}=E;if(!Number.isFinite(D)||!Number.isFinite(z)||z<D)throw new Error("轨迹起止时间需要有限数值，结束时间不能早于开始时间。");if(!Number.isInteger(U)||U<2||U>512)throw new Error("轨迹采样数量需要为 2–512 的整数。");if(!Array.isArray(G)||G.some(X=>!Number.isFinite(X)||X<D||X>z))throw new Error("额外关键帧时间必须位于轨迹区间内。");const V=qe(E),Q=Array.from({length:U},(X,oe)=>oe===U-1?z:D+(z-D)*oe/(U-1)),Z=(G.length&&z>D?[...new Set([...Q,...G])].sort((X,oe)=>X-oe):Q).map(X=>{const oe=V.sample(X),ie=Ue(oe),{requested:de,constrainedPelvis:ve,solved:xe}=ie,Ge=be=>R(l[be],de.bodyQuaternion,de.torsoQuaternion).add(ve).toArray(),Ee={pelvis:ve.toArray(),waist:x.clone().sub(l.pelvis).applyQuaternion(de.bodyQuaternion).add(ve).toArray(),shoulderCenter:Ge("torso"),neck:Ge("neck"),head:Ge("head")};for(const be of St){const{source:We,shoulder:ot,arm:Vt,hip:ht,leg:mt}=xe[be],Qe={shoulder:ot,elbow:Vt.middle,wrist:Vt.end,palm:b[be].palmOffset.clone().applyQuaternion(We.handQuaternion).add(Vt.end),hip:ht,knee:mt.middle,ankle:mt.end,toe:new A(0,0,.18).applyQuaternion(We.footQuaternion).add(mt.end)};for(const[gt,le]of Object.entries(Qe))Ee[be+gt[0].toUpperCase()+gt.slice(1)]=le.toArray()}const je={};for(const be of St){const We=V.curveAt(X,be);We&&(je[be]=We.position)}const Je=J.get(oe),et=Je?{warnings:[...new Set([...Je.warnings,...ie.warnings])],goalErrors:Object.fromEntries(Object.entries(Je.targets).map(([be,We])=>[be,Yt(Ee[be]).distanceTo(Yt(We))]))}:null;return{time:X,joints:Ee,...Object.keys(je).length?{curveTargets:je}:{},...Je?{guideTargets:structuredClone(Je.targets),diagnostics:et}:{},...E.includeBoneRotations?{boneRotations:Object.fromEntries(Object.entries(H(ie)).map(([be,We])=>[be,We.toArray()]))}:{}}});return{startTime:D,endTime:z,frames:Z}}function He(){return{version:1,pelvis:w.toArray(),bodyQuaternion:m.toArray(),...I?{pelvisQuaternion:f.toArray()}:{},..._?{torsoQuaternion:y.toArray()}:{},limbs:Object.fromEntries(St.map(E=>[E,{wrist:v[E].wrist.toArray(),elbowPole:(v[E].elbowPole??v[E].elbow).toArray(),handQuaternion:c.get(E+"Hand").rotation.toArray(),ankle:v[E].ankle.toArray(),kneePole:(v[E].kneePole??v[E].knee).toArray(),footQuaternion:c.get(E+"Foot").rotation.toArray(),handLocked:b[E].support,...Object.fromEntries(["elbowTwist","kneeTwist","upperArmTwist","thighTwist"].filter(D=>v[E][D]!==void 0).map(D=>[D,v[E][D]]))}])),groundLock:Kt}}function wt(E,D){const z=new an,U=l[E+"Ankle"],G=new rt().makeRotationFromQuaternion(D).multiply(new rt().makeTranslation(-U.x,-U.y,-U.z));return wc(d[E],G,z),fi-(z.isEmpty()?-U.y:z.min.y)}function Ot(E,D,z){if(!St.includes(E))throw new Error("未知的支撑手。");const U=E==="left"?1:-1,G=new A(U*.98253144,.05483374,.17783482),V=new A(U*.06068526,-.99777448,-.02762938),Q=Yt(D);if(Q.y=0,Q.lengthSq()<1e-8)throw new Error("手指方向需要有水平分量。");Q.normalize();const K=Yo(Q,Ii.clone().negate()).multiply(Yo(G,V).invert());let Z=1/0;for(const oe of h[E])Z=Math.min(Z,oe.clone().sub(l[E+"Wrist"]).applyQuaternion(K).y);const X=z?Yt(z):new A(U*.215,0,0);return X.y=fi-(Number.isFinite(Z)?Z:-.035),{wrist:X.toArray(),handQuaternion:K.toArray(),fingerDirection:Q.toArray()}}function Qt(){let E=He();const D=new A;for(let z=0;z<8;z++){const U=i.matrixWorld.clone().invert();let G=!1;for(const V of St){if(!E.limbs[V].handLocked)continue;let Q=1/0;for(const{mesh:Z,index:X}of u[V])Z.getVertexPosition(X,D).applyMatrix4(Z.matrixWorld).applyMatrix4(U),Q=Math.min(Q,D.y);const K=fi-Q;Number.isFinite(K)&&Math.abs(K)>1e-7&&(E.limbs[V].wrist[1]+=K,G=!0)}if(!G)break;E=Bn(E)}return He()}function pn(E){const D=E.pelvis.clone(),z=[];let U=-1/0;for(const G of St){const V=E.limbs[G],Q=b[G],K=R(l[G+"Shoulder"],E.bodyQuaternion,E.torsoQuaternion);if(V.handLocked&&z.push({center:V.wrist.clone().sub(K),maximum:Q.upperArm+Q.forearm-1e-5,minimum:Math.abs(Q.upperArm-Q.forearm)+1e-5,side:G}),E.groundLock){const Z=l[G+"Hip"].clone().sub(l.pelvis).applyQuaternion(De(E));U=Math.max(U,wt(G,V.footQuaternion)-(Q.thigh+Q.shin-1e-5)-Z.y)}}if(z.length===2&&z[0].center.distanceTo(z[1].center)>z[0].maximum+z[1].maximum)throw new Error("双手锁定的位置相隔过远，原始手臂长度无法同时到达。请先解锁一只手或缩短双手间距。");for(let G=0;G<96;G++){for(const Q of z){const K=D.clone().sub(Q.center),Z=K.length();Z>Q.maximum?D.copy(Q.center).addScaledVector(K,Q.maximum/Z):Z<Q.minimum&&(Z<1e-10?K.copy(Ii):K.multiplyScalar(1/Z),D.copy(Q.center).addScaledVector(K,Q.minimum))}if(D.y=Math.max(D.y,U),z.every(Q=>{const K=D.distanceTo(Q.center);return K<=Q.maximum+1e-7&&K>=Q.minimum-1e-7}))return D}throw new Error("此躯干方向无法同时保持锁定手掌和脚底高度。请先解锁手掌或调整脚掌方向。")}function It(E,D,z,U){const G=b[z],V=G.thigh+G.shin-1e-7,Q=Math.abs(G.thigh-G.shin)+1e-7,K=D.clone();Number.isFinite(U)&&(K.y=Math.max(K.y,U));const Z=K.clone().sub(E),X=Z.length();if(X>V&&K.copy(E).addScaledVector(Z,V/X),Number.isFinite(U)&&K.y<U){const oe=U-E.y,ie=Math.sqrt(Math.max(0,V*V-oe*oe)),de=D.x-E.x,ve=D.z-E.z,xe=Math.hypot(de,ve),Ge=xe>ie&&xe>0?ie/xe:1;K.set(E.x+de*Ge,U,E.z+ve*Ge)}return K.distanceTo(E)<Q&&K.copy(E).addScaledVector(Ii,Q),K}function Ue(E){const D=Ec(E),z=pn(D),U=$t(D,z,Ie.get(E),Le.get(E));if(U>0){z.y+=U,D.pelvis.y+=U;for(const K of St)D.limbs[K].ankle.y+=U,D.limbs[K].kneePole&&(D.limbs[K].kneePole.y+=U)}ge(D,z);const G=[],V={},Q=K=>l[K].clone().sub(l.pelvis).applyQuaternion(De(D)).add(z);z.distanceTo(D.pelvis)>1e-5&&G.push("躯干位置已限制，以保持锁定手掌、真实骨长和地面高度。");for(const K of St){const Z=D.limbs[K],X=b[K],oe=K==="left"?"左":"右",ie=R(l[K+"Shoulder"],D.bodyQuaternion,D.torsoQuaternion).add(z);if(Z.handLocked||Z.wrist.y<=Lt){const je=ie.clone().sub(Z.wrist),Je=je.length(),et=(X.upperArm+X.forearm)*ae;Je>1e-6&&Je<et-1e-4&&ie.copy(Z.wrist).addScaledVector(je,Math.min(et,Je+fo)/Je)}const de=$o(ie,Z.wrist,X.upperArm,X.forearm,Z.elbowPole);if(Z.handLocked&&de.end.distanceTo(Z.wrist)>1e-5)throw new Error(`${oe}手锁定位置无法到达，请先解锁手掌。`);de.end.distanceTo(Z.wrist)>1e-5&&G.push(`${oe}手腕已限制在原始手臂能够到达的位置。`);const ve=Q(K+"Hip"),xe=D.groundLock?wt(K,Z.footQuaternion):-1/0,Ge=It(ve,Z.ankle,K,xe),Ee=$o(ve,Ge,X.thigh,X.shin,Z.kneePole);Ee.end.distanceTo(Z.ankle)>1e-5&&G.push(`${oe}脚踝已按真实腿长${D.groundLock?"和地面高度":""}限制。`),V[K]={source:Z,shoulder:ie,arm:de,hip:ve,leg:Ee}}return{requested:D,constrainedPelvis:z,warnings:G,solved:V}}const kn=.22,Pt=.9,Dn=1.2,ji=.3,tn=.02,fr=.015,Ft=.85,In=1.15,pr=!0;let yn=null;function hi(E,D=null){const z=N?.steps,U=z?z.length-1:0;if(!U||!Object.keys(ei).length)return 0;if(yn?.sequence!==N){const V=N.period,Q=V/(U+1),K=[];for(const X of St)for(let oe=0;oe<U;oe++)z[oe].pose.limbs[X].handLocked&&!z[(oe-1+U)%U].pose.limbs[X].handLocked&&K.push({center:oe*Q,mono:X in ei});const Z=K.map(({center:X,mono:oe})=>{const ie=X-Math.max(Pt,Ft)-3*kn,de=Math.ceil((Math.max(Pt,Ft)+Math.max(Dn,In)+6*kn)/tn)+1,ve=Array.from({length:de},(Ge,Ee)=>Ue(ee(ie+Ee*tn)).constrainedPelvis.y);if(oe){const Ge=Qe=>(Qe-ie)/tn,Ee=Math.round(Ge(X-Ft)),je=Math.round(Ge(X+In)),Je=Qe=>(ve[Qe+1]-ve[Qe-1])/(2*tn),et=(je-Ee)*tn,be=ve[Ee],We=ve[je],ot=Je(Ee)*et,Vt=Je(je)*et,ht=ve.map((Qe,gt)=>{if(gt<=Ee||gt>=je)return 0;const le=(gt-Ee)/(je-Ee),Ae=le*le,ze=Ae*le;return(2*ze-3*Ae+1)*be+(ze-2*Ae+le)*ot+(-2*ze+3*Ae)*We+(ze-Ae)*Vt-Qe}),mt={t0:ie+Ee*tn,span:et,y0:be,y1:We,m0:ot,m1:Vt};return{center:X,from:ie,offset:ht,period:V,before:Ft,after:In,edge:0,ease:mt}}let xe=null;for(let Ge=kn;Ge>.03;Ge*=.85){const Ee=Math.ceil(3*Ge/tn),je=Array.from({length:2*Ee+1},(Je,et)=>Math.exp(-.5*((et-Ee)*tn/Ge)**2));if(xe=ve.map((Je,et)=>{if(et<Ee||et>=de-Ee)return 0;let be=0,We=0;for(let ot=-Ee;ot<=Ee;ot++)be+=ve[et+ot]*je[ot+Ee],We+=je[ot+Ee];return be/We-Je}),Math.max(...xe.map(Math.abs))<=fr)break}return{center:X,from:ie,offset:xe,period:V,before:Pt,after:Dn,edge:ji}});yn={sequence:N,tables:Z}}let G=0;for(const{center:V,from:Q,offset:K,period:Z,before:X,after:oe,edge:ie,ease:de}of yn.tables){let ve=E-V;if(ve-=Math.round(ve/Z)*Z,ve<-X||ve>oe)continue;if(de&&D!==null&&pr){const Je=Nt.clamp((V+ve-de.t0)/de.span,0,1),et=Je*Je,be=et*Je;G+=(2*be-3*et+1)*de.y0+(be-2*et+Je)*de.m0+(-2*be+3*et)*de.y1+(be-et)*de.m1-D;continue}const xe=ie?Nt.smoothstep(ve,-X,-X+ie)*(1-Nt.smoothstep(ve,oe-ie,oe)):1,Ge=(V+ve-Q)/tn,Ee=Math.floor(Ge),je=Ge-Ee;G+=xe*Nt.lerp(K[Ee]??0,K[Ee+1]??0,je)}return G}function Bn(E,{alignBendPlanes:D=!1,bodyOffset:z=0}={}){const{requested:U,constrainedPelvis:G,warnings:V,solved:Q}=Ue(E);if(typeof z=="function"&&(z=z(G.y)),z){G.y+=z;for(const K of St)for(const Z of[Q[K].hip,Q[K].leg.middle,Q[K].leg.end])Z.y+=z}ct=D,ce="manual",Kt=U.groundLock,_t=V,w.copy(G),m.copy(U.bodyQuaternion),f.copy(De(U)),I=U.pelvisQuaternion!==void 0,y.copy(U.torsoQuaternion??Un),_=U.torsoQuaternion!==void 0,L.set(1,0,0).applyQuaternion(m),C.copy(Ii).applyQuaternion(m),F.copy(Di).applyQuaternion(m),$=(Math.atan2(F.x,F.z)+Math.PI*2)%(Math.PI*2),pe(),Re();for(const K of St){const{source:Z,shoulder:X,arm:oe,hip:ie,leg:de}=Q[K],ve=b[K];ve.support=Z.handLocked,ve.flight=Z.handLocked?0:1,ve.anchor.copy(Z.wrist).add(ve.palmOffset.clone().applyQuaternion(Z.handQuaternion));const xe=v[K]={elbowPole:Z.elbowPole.clone(),kneePole:Z.kneePole.clone()};for(const Ge of["elbowTwist","kneeTwist","upperArmTwist","thighTwist"])Z[Ge]!==void 0&&(xe[Ge]=Z[Ge]);Oe(K,xe,X,oe.middle,oe.end,Z.handQuaternion),Rt(K,xe,ie,de.middle,de.end,Z.footQuaternion)}return ue(),He()}function Fs(){const E=[{id:"pelvis",position:w.toArray(),quaternion:f.toArray(),canRotate:!0,label:"髋部 · 独立位置与旋转"},{id:"torso",position:M(l.torso).toArray(),quaternion:m.toArray(),canRotate:!0,label:"躯干 · 整体移动与转向"},{id:"waist",position:dt(x).toArray(),quaternion:y.toArray(),parentQuaternion:m.toArray(),canRotate:!0,label:"腰部 · 独立弯腰与扭转"}];for(const D of St){const z=D==="left"?"左":"右";for(const[U,G,V,Q,K]of[["Wrist","wrist","Hand",!0,"手腕 · 手掌位置与朝向"],["Elbow","elbow","Forearm",!0,"肘部 · 前臂旋转与弯曲"],["Ankle","ankle","Foot",!0,"脚踝 · 脚掌位置与朝向"],["Knee","knee","Shin",!0,"膝部 · 小腿旋转与弯曲"]])E.push({id:D+U,position:v[D][G].toArray(),quaternion:c.get(D+V).rotation.toArray(),canRotate:Q,label:z+K})}return E}function Ia(E,D,z,U=null){const G=U?U.constrainedPelvis.clone():w.clone(),V=U?U.requested.bodyQuaternion.clone():m.clone(),Q=U?Ut(U.requested.torsoQuaternion)?V.clone():V.clone().multiply(U.requested.torsoQuaternion):tt(),K=U?De(U.requested).clone():f.clone(),Z=U?R(l.torso,V,U.requested.torsoQuaternion).add(G):M(l.torso),X=U?x.clone().sub(l.pelvis).applyQuaternion(V).add(G):dt(x),oe=x.clone().sub(l.pelvis),ie=l.torso.clone().sub(x),de=oe.length(),ve=ie.length(),xe=Z.clone().sub(G).normalize(),Ge=X.clone().sub(G);Ge.addScaledVector(xe,-Ge.dot(xe)),Ge.lengthSq()<1e-10&&(Ge.copy(Di).applyQuaternion(Q),Ge.addScaledVector(xe,-Ge.dot(xe))),Ge.lengthSq()<1e-10&&(Ge.copy(Di).applyQuaternion(V),Ge.addScaledVector(xe,-Ge.dot(xe))),Ge.normalize();const Ee=D?Yt(D):G,je=z?new Ve().fromArray(z):K,Je=Ee.distanceToSquared(G)>1e-20,et=Ee.clone();if(Je){const ht=et.clone().sub(G),mt=G.clone().sub(Z),Qe=ht.lengthSq(),gt=mt.dot(ht),le=(ve-de)**2,Ae=es(-gt/Qe,0,1);if(mt.clone().addScaledVector(ht,Ae).lengthSq()<le-1e-14){const ze=gt*gt-Qe*(mt.lengthSq()-le),Gt=es((-gt-Math.sqrt(Math.max(0,ze)))/Qe,0,1);et.copy(G).addScaledVector(ht,Gt)}}function be(ht,mt=!1){const Qe=structuredClone(E);if(Qe.pelvisQuaternion=K.clone().slerp(je,ht).toArray(),!Je)return Qe;const gt=G.clone().lerp(et,ht);if(mt){const Mt=X.clone(),Et=G.clone().sub(Mt).normalize(),bn=gt.clone().sub(G);bn.addScaledVector(Et,-bn.dot(Et));const Si=Et.multiplyScalar(de).add(bn).normalize();gt.copy(Mt).addScaledVector(Si,de);const zn=Ji(oe,Mt.clone().sub(gt),V);return Qe.pelvis=gt.toArray(),Qe.bodyQuaternion=zn.toArray(),Qe.torsoQuaternion=zn.clone().invert().multiply(Q).normalize().toArray(),Qe}const le=Z.clone().sub(gt);let Ae=le.length();const ze=Ae>1e-10?le.multiplyScalar(1/Ae):xe.clone();Ae=es(Ae,Math.abs(ve-de),ve+de),gt.copy(Z).addScaledVector(ze,-Ae);const Gt=(de*de-ve*ve+Ae*Ae)/(2*Ae),kt=Math.sqrt(Math.max(0,de*de-Gt*Gt)),Jt=Ge.clone().applyQuaternion(new Ve().setFromUnitVectors(xe,ze)),nn=gt.clone().addScaledVector(ze,Gt).addScaledVector(Jt,kt),rn=Ji(oe,nn.clone().sub(gt),V),Bt=Ji(ie,Z.clone().sub(nn),Q);return Qe.pelvis=gt.toArray(),Qe.bodyQuaternion=rn.toArray(),Qe.torsoQuaternion=rn.clone().invert().multiply(Bt).normalize().toArray(),Qe}function We(ht){try{const mt=Ue(ht);return R(l.torso,mt.requested.bodyQuaternion,mt.requested.torsoQuaternion).add(mt.constrainedPelvis).distanceTo(Z)<1e-7}catch{return!1}}let ot=be(1),Vt=!1;if(!We(ot)){const ht=Je&&St.some(Qe=>E.limbs[Qe].handLocked),mt=ht?be(1,!0):null;if(mt&&We(mt))ot=mt;else{let Qe=0,gt=1;ot=E,Vt=!0;for(let le=0;le<28;le++){const Ae=(Qe+gt)/2,ze=be(Ae,ht);We(ze)?(Qe=Ae,ot=ze):gt=Ae}}}return Je&&Yt(ot.pelvis).distanceTo(Ee)>1e-5&&(Vt=!0),{pose:ot,limited:Vt}}function Na({requested:E,constrainedPelvis:D,solved:z}){const U=V=>R(l[V],E.bodyQuaternion,E.torsoQuaternion).add(D),G={pelvis:D.clone(),waist:x.clone().sub(l.pelvis).applyQuaternion(E.bodyQuaternion).add(D),shoulderCenter:U("torso"),neck:U("neck"),head:U("head")};for(const V of St){const{source:Q,shoulder:K,arm:Z,hip:X,leg:oe}=z[V],ie={Shoulder:K.clone(),Elbow:Z.middle.clone(),Wrist:Z.end.clone(),Palm:b[V].palmOffset.clone().applyQuaternion(Q.handQuaternion).add(Z.end),Hip:X.clone(),Knee:oe.middle.clone(),Ankle:oe.end.clone(),Toe:new A(0,0,.18).applyQuaternion(Q.footQuaternion).add(oe.end)};for(const[de,ve]of Object.entries(ie))G[V+de]=ve}return G}function rh({requested:E,constrainedPelvis:D,solved:z},U){const G=structuredClone(U);G.pelvis=D.toArray(),G.bodyQuaternion=E.bodyQuaternion.toArray();for(const V of["torsoQuaternion","pelvisQuaternion"])E[V]?G[V]=E[V].toArray():delete G[V];for(const V of St){const{source:Q,arm:K,leg:Z}=z[V],X=G.limbs[V];X.wrist=K.end.toArray(),X.ankle=Z.end.toArray(),X.elbowPole=Q.elbowPole.toArray(),X.kneePole=Q.kneePole.toArray(),X.handQuaternion=Q.handQuaternion.toArray(),X.footQuaternion=Q.footQuaternion.toArray()}return G}function sh(E,D,z){if(E.lengthSq()<1e-20||D.lengthSq()<1e-20)return Un.clone();const U=E.clone().normalize(),G=D.clone().normalize(),V=new A().crossVectors(U,G),Q=V.length(),K=es(U.dot(G),-1,1);return Q>1e-10?new Ve().setFromAxisAngle(V.multiplyScalar(1/Q),Math.atan2(Q,K)):K>=0?Un.clone():(V.copy(Di).applyQuaternion(z).addScaledVector(U,-Di.clone().applyQuaternion(z).dot(U)),V.lengthSq()<1e-10&&V.set(1,0,0).applyQuaternion(z).addScaledVector(U,-new A(1,0,0).applyQuaternion(z).dot(U)),new Ve().setFromAxisAngle(V.normalize(),Math.PI))}function Mf(E,{joint:D,position:z}={}){const U=rr(z,3,"关节目标位置"),G=Ue(E),V=Na(G),Q=Yt(U);if(typeof D!="string"||!Object.hasOwn(V,D))throw new Error("未知关节点。");const K=rh(G,E),Z=[];let X=D==="pelvis"||D.endsWith("Hip")?"pelvis":D==="waist"||D==="shoulderCenter"?"body":["neck","head","leftShoulder","rightShoulder"].includes(D)?"upperBody":(D.startsWith("left")?"left":"right")+(/Elbow|Wrist|Palm$/.test(D)?"Arm":"Leg"),oe;const ie=Ut(G.requested.torsoQuaternion)?G.requested.bodyQuaternion.clone():G.requested.bodyQuaternion.clone().multiply(G.requested.torsoQuaternion),de=(Ee,je)=>{const Je=rh(Ee,je),et=Ue(Je),be=Na(et),We=be[D].distanceTo(Q),ot=We>1e-5,Vt=[...new Set([...G.warnings,...Ee.warnings,...et.warnings,...Z,...ot?["目标已按现有联动关系、真实骨长和锁定约束限制；显示的是实际可达位置。"]:[]])];return{pose:Je,joint:D,position:be[D].toArray(),requestedPosition:[...U],error:We,limited:ot,warnings:Vt,linkedGroup:X,beforePosition:V[D].toArray(),joints:Object.fromEntries(Object.entries(be).map(([ht,mt])=>[ht,mt.toArray()]))}};if(V[D].distanceToSquared(Q)<1e-24)return de(G,K);if(D==="pelvis"){X="pelvis";const Ee=Ia(K,U,null,G);return Ee.limited&&Z.push("髋部位移已限幅，上身通过原有腰部联动。"),de(Ue(Ee.pose),Ee.pose)}if(D==="waist"||D==="shoulderCenter")X="body",oe=Ee=>{const je=structuredClone(K);return je.pelvis=Yt(K.pelvis).add(Q.clone().sub(V[D]).multiplyScalar(Ee)).toArray(),je};else if(["neck","head","leftShoulder","rightShoulder"].includes(D)){X="upperBody";const Ee=V.waist,je=sh(V[D].clone().sub(Ee),Q.clone().sub(Ee),ie);oe=Je=>{const et=structuredClone(K),be=Un.clone().slerp(je,Je);et.torsoQuaternion=G.requested.bodyQuaternion.clone().invert().multiply(be.clone().multiply(ie)).normalize().toArray();for(const We of St){const ot=et.limbs[We];ot.elbowPole=Yt(ot.elbowPole).sub(Ee).applyQuaternion(be).add(Ee).toArray(),ot.handLocked||(ot.wrist=Yt(ot.wrist).sub(Ee).applyQuaternion(be).add(Ee).toArray(),ot.handQuaternion=be.clone().multiply(G.requested.limbs[We].handQuaternion).normalize().toArray())}return et}}else{const Ee=D.startsWith("left")?"left":"right",je=D.slice(Ee.length),Je=G.solved[Ee],et=b[Ee];if(je==="Hip"){X="pelvis";const ht=De(G.requested),mt=V.pelvis,gt=sh(V[D].clone().sub(mt),Q.clone().sub(mt),ht).multiply(ht).normalize(),le=Ia(K,null,gt.toArray(),G);return de(Ue(le.pose),le.pose)}if(je==="Elbow"||je==="Knee"){X=je==="Elbow"?Ee+"Arm":Ee+"Leg";const ht=je==="Elbow",mt=ht?Je.shoulder:Je.hip,Qe=ht?Je.arm:Je.leg,gt=Qe.end.clone().sub(mt).normalize(),le=mt.clone().addScaledVector(gt,Qe.middle.clone().sub(mt).dot(gt)),Ae=Qe.middle.clone().sub(le),ze=Ae.length(),Gt=Q.clone().sub(le).addScaledVector(gt,-Q.clone().sub(le).dot(gt));ze<.001?Z.push("肢体接近伸直，已保留原弯曲方向。"):Gt.lengthSq()<1e-20?Z.push("目标在肢体轴线上，已保留原弯曲方向。"):Ae.copy(Gt).normalize().multiplyScalar(ze);const kt=structuredClone(K);return kt.limbs[Ee][ht?"elbowPole":"kneePole"]=le.add(Ae).toArray(),de(Ue(kt),kt)}const be=je==="Wrist"||je==="Palm";X=be?Ee+"Arm":Ee+"Leg";let We=Q.clone();je==="Palm"&&We.sub(et.palmOffset.clone().applyQuaternion(Je.source.handQuaternion)),je==="Toe"&&We.sub(new A(0,0,.18).applyQuaternion(Je.source.footQuaternion)),be&&(We=$o(Je.shoulder,We,et.upperArm,et.forearm,Je.source.elbowPole).end);const ot=be?"wrist":"ankle",Vt=Yt(K.limbs[Ee][ot]);oe=ht=>{const mt=structuredClone(K);return mt.limbs[Ee][ot]=Vt.clone().lerp(We,ht).toArray(),mt}}let ve=G,xe=K,Ge=V[D].distanceTo(Q);for(let Ee=0;Ee<12;Ee++){const je=oe(2**-Ee);try{const Je=Ue(je),et=Na(Je)[D].distanceTo(Q);if(et<Ge-1e-12&&(ve=Je,xe=je,Ge=et),et<1e-8)break}catch{}}return de(ve,xe)}function Sf(E,D){const z=Fs().find(X=>X.id===E);if(!z)throw new Error("未知姿势控制点。");if(!D||D.position===void 0&&D.quaternion===void 0)throw new Error("请提供控制点的位置或方向。");const U=D.position===void 0?null:rr(D.position,3,`${z.label}位置`),G=D.quaternion===void 0?null:ts(D.quaternion,`${z.label}方向`).toArray();if(G&&!z.canRotate)throw new Error("此控制点不支持旋转。");let V=He(),Q=!1,K=!1;if(E==="pelvis"){const X=Ia(V,U,G);V=X.pose,K=X.limited}else if(E==="torso"){if(G){if(V.pelvisQuaternion){const ie=new Ve().fromArray(G).multiply(m.clone().invert());V.pelvisQuaternion=ie.multiply(f).normalize().toArray()}V.bodyQuaternion=G}const X=Yt(U??z.position),oe=R(l.torso,new Ve().fromArray(V.bodyQuaternion),V.torsoQuaternion?new Ve().fromArray(V.torsoQuaternion):null);V.pelvis=X.sub(oe).toArray()}else if(E==="waist"){if(U&&(V.pelvis=Yt(U).sub(x.clone().sub(l.pelvis).applyQuaternion(m)).toArray()),G){const X=dt(x),ie=m.clone().multiply(new Ve().fromArray(G)).clone().multiply(tt().invert());V.torsoQuaternion=G;for(const de of St){const ve=V.limbs[de];ve.elbowPole=Yt(ve.elbowPole).sub(X).applyQuaternion(ie).add(X).toArray(),ve.handLocked||(ve.wrist=Yt(ve.wrist).sub(X).applyQuaternion(ie).add(X).toArray(),ve.handQuaternion=ie.clone().multiply(new Ve().fromArray(ve.handQuaternion)).normalize().toArray())}}}else{const X=E.startsWith("left")?"left":"right",oe=E.slice(X.length),ie=V.limbs[X];if(G&&(oe==="Elbow"||oe==="Knee")){const de=oe==="Elbow";if(de&&ie.handLocked)throw new Error(`${X==="left"?"左":"右"}手已固定，旋转肘部前请先取消对应手的固定。`);const ve=X+(de?"Forearm":"Shin"),xe=new Ve().fromArray(G),Ge=xe.clone().multiply(c.get(ve).rotation.clone().invert()),Ee=v[X][de?"elbow":"knee"],je=de?"wrist":"ankle",Je=de?"elbowPole":"kneePole",et=de?"handQuaternion":"footQuaternion",be=Yt(ie[je]).sub(Ee).applyQuaternion(Ge).add(Ee);ie[je]=be.toArray(),ie[Je]=Ee.toArray(),ie[et]=Ge.clone().multiply(new Ve().fromArray(ie[et])).normalize().toArray();const We=l[X+(de?"Wrist":"Ankle")].clone().sub(l[X+oe]),ot=Ji(We,be.clone().sub(Ee),de?tt():f);ie[de?"elbowTwist":"kneeTwist"]=Y(ot,xe,We)}if(U&&oe==="Wrist"){const de=Yt(U),ve=v[X].shoulder,xe=b[X],Ge=$o(ve,de,xe.upperArm,xe.forearm,Yt(ie.elbowPole)).end;Q=Ge.distanceTo(de)>1e-5,ie.wrist=Ge.toArray()}else U&&(ie[{Elbow:"elbowPole",Ankle:"ankle",Knee:"kneePole"}[oe]]=U);G&&(oe==="Wrist"||oe==="Ankle")&&(ie[oe==="Wrist"?"handQuaternion":"footQuaternion"]=G)}const Z=Bn(V);return K&&_t.unshift("髋部调整已限制在腰部和四肢可达范围内，肩中心保持原位置。"),Q&&_t.unshift("手腕已限制在当前肩部与真实手臂长度能够到达的位置。"),Z}function oh(){if(W){q.makeEmpty();for(const E of c.values())wc(E.bounds,E.matrix,q);W=!1}return{min:q.min.toArray(),max:q.max.toArray()}}function wf(E){P=E,i.userData.coachLayer=E}function Ef(E){k=E,i.userData.selectedMuscle=E}function Af(){const E=Ke?Ke.describe(ne):null,D=E?["rear","right","front","left"].indexOf(E.section):-1,z={pelvis:w.toArray(),waist:dt(x).toArray(),shoulderCenter:M(l.torso).toArray(),neck:M(l.neck).toArray(),head:M(l.head).toArray()},U={torso:l.pelvis.distanceTo(l.torso)},G={torso:l.pelvis.distanceTo(l.torso)},V=[],Q={},K={};for(const Z of St){const X=b[Z],oe=v[Z];for(const ie of["shoulder","elbow","wrist","palm","hip","knee","ankle","toe"])z[Z+ie[0].toUpperCase()+ie.slice(1)]=oe[ie].toArray();K[Z]=X.support,X.support&&V.push(Z),Q[Z]=X.support?oe.palm.distanceTo(X.anchor):null,U[Z+"UpperArm"]=oe.shoulder.distanceTo(oe.elbow),U[Z+"Forearm"]=oe.elbow.distanceTo(oe.wrist),U[Z+"Thigh"]=oe.hip.distanceTo(oe.knee),U[Z+"Shin"]=oe.knee.distanceTo(oe.ankle);for(const ie of["UpperArm","Forearm","Thigh","Shin"])G[Z+ie]=X[ie[0].toLowerCase()+ie.slice(1)]}return{time:ne,angle:$,period:N.period,mode:ce,manual:ce==="manual",layer:P,selected:k,legPath:fe,interpolation:Me,motionModel:Tt,skippedSteps:[...Fe],periodic:E,bodyQuaternion:m.toArray(),groundLock:Kt,warnings:[..._t],pelvisQuaternion:f.toArray(),torsoQuaternion:y.toArray(),name:"Snow 友善健身主角",source:e.source,license:e.license,illustrative:!0,motionType:"Flare 教学示意",automaticallyBound:!1,keyframes:{...N.keyframes},demonstration:E?{index:D,count:4,id:`periodic-${E.section}`,phase:["rear","sideA","front","sideB"][D]}:{index:N.stepAt(ne),count:N.steps.length,id:N.steps[N.stepAt(ne)].id,phase:N.steps[N.stepAt(ne)].phase},supportHands:V,supports:K,supportDrift:Q,segmentLengths:U,expectedLengths:G,joints:z,minFootHeight:he,chestForward:Di.clone().applyQuaternion(tt()).toArray(),bounds:oh(),neutralBounds:re,neutralHeight:e.height,skinning:{bones:c.size,batches:s.length,weightedVertices:p,originalMeshes:s.length,authoredWeights:!0},supportAnchors:Object.fromEntries(St.map(Z=>[Z,b[Z].anchor.toArray()]))}}i.userData.motionSource="Snow Rig / Blender Foundation",Se();function Tf(E){if(!Jn())return 1;const D=N.steps.length-1,z=N.period/(D+1);return(E%N.period+N.period)%N.period>(D-1)*z?2:1}return{group:i,update:ke,reset:Se,setSequence:Ne,sampleTrajectory:ft,samplePose:Xe,getSegmentGuideAt:lt,getLoopTimeScale:Tf,getFootCurveSpan:(E,D)=>N.spanAt(E,D),getFootCurveAt:(E,D)=>N.curveAt(E,D),setLayer:wf,setHighlight:Ef,getMetrics:Af,capturePose:He,applyPose:Bn,getEditableHandles:Fs,editHandle:Sf,solveJointPose:Mf,getGroundHandPose:Ot,alignGroundHands:Qt}}function Rv(i,e,t=0){const n=["pelvis","leftHand","rightHand","leftFoot","rightFoot"].map(g=>i.getObjectByName(g)).filter(Boolean);if(n.length<3)return null;const r=e.getMetrics().period,s=240,o=[],a=new A;for(let g=0;g<=s;g++)e.update(g*r/s),i.updateMatrixWorld(!0),o.push(n.map(b=>b.getWorldPosition(a).clone()));e.update(t),i.updateMatrixWorld(!0);const c=g=>e.getLoopTimeScale?.(g)??1,l=[];for(let g=0;g<s;g++){let b=0;for(let m=0;m<n.length;m++)b+=o[g][m].distanceTo(o[g+1][m]);l.push(b*c((g+.5)*r/s))}const h=l.map((g,b)=>{let m=0,f=0;for(let y=-4;y<=4;y++){const x=5-Math.abs(y);m+=l[(b+y+s)%s]*x,f+=x}return m/f}),u=h.reduce((g,b)=>g+b,0)/s;if(!(u>0))return null;const d=h.map(g=>g<u*.02?25:Math.min(25,Math.max(.35,Math.pow(u/g,.8)))),p=d.reduce((g,b,m)=>g+1/(b*c((m+.5)*r/s)),0)/s;return d.map(g=>g*p)}function Yd(i,e,t,n=9){if(!i)return 1;const r=i.length,s=(t%n+n)%n/n*r,o=Math.floor(s)%r,a=s-Math.floor(s);return(i[o]*(1-a)+i[(o+1)%r]*a)*(e.getLoopTimeScale?.(t)??1)}function Cv(i,e,t,n,r,s=9){const a=n*r/8;let c=0;for(let l=0;l<8;l++)c+=a*Yd(i,e,t+c,s);return c}function Vu(i,e){if(e===rp)return console.warn("THREE.BufferGeometryUtils.toTrianglesDrawMode(): Geometry already defined as triangles."),i;if(e===gl||e===pd){let t=i.getIndex();if(t===null){const o=[],a=i.getAttribute("position");if(a!==void 0){for(let c=0;c<a.count;c++)o.push(c);i.setIndex(o),t=i.getIndex()}else return console.error("THREE.BufferGeometryUtils.toTrianglesDrawMode(): Undefined position attribute. Processing not possible."),i}const n=t.count-2,r=[];if(e===gl)for(let o=1;o<=n;o++)r.push(t.getX(0)),r.push(t.getX(o)),r.push(t.getX(o+1));else for(let o=0;o<n;o++)o%2===0?(r.push(t.getX(o)),r.push(t.getX(o+1)),r.push(t.getX(o+2))):(r.push(t.getX(o+2)),r.push(t.getX(o+1)),r.push(t.getX(o)));r.length/3!==n&&console.error("THREE.BufferGeometryUtils.toTrianglesDrawMode(): Unable to generate correct amount of triangles.");const s=i.clone();return s.setIndex(r),s.clearGroups(),s}else return console.error("THREE.BufferGeometryUtils.toTrianglesDrawMode(): Unknown draw mode:",e),i}class Pv extends Is{constructor(e){super(e),this.dracoLoader=null,this.ktx2Loader=null,this.meshoptDecoder=null,this.pluginCallbacks=[],this.register(function(t){return new Uv(t)}),this.register(function(t){return new Fv(t)}),this.register(function(t){return new qv(t)}),this.register(function(t){return new jv(t)}),this.register(function(t){return new Xv(t)}),this.register(function(t){return new kv(t)}),this.register(function(t){return new Bv(t)}),this.register(function(t){return new zv(t)}),this.register(function(t){return new Hv(t)}),this.register(function(t){return new Nv(t)}),this.register(function(t){return new Vv(t)}),this.register(function(t){return new Ov(t)}),this.register(function(t){return new Wv(t)}),this.register(function(t){return new Gv(t)}),this.register(function(t){return new Dv(t)}),this.register(function(t){return new Qv(t)}),this.register(function(t){return new Kv(t)})}load(e,t,n,r){const s=this;let o;if(this.resourcePath!=="")o=this.resourcePath;else if(this.path!==""){const l=Js.extractUrlBase(e);o=Js.resolveURL(l,this.path)}else o=Js.extractUrlBase(e);this.manager.itemStart(e);const a=function(l){r?r(l):console.error(l),s.manager.itemError(e),s.manager.itemEnd(e)},c=new Od(this.manager);c.setPath(this.path),c.setResponseType("arraybuffer"),c.setRequestHeader(this.requestHeader),c.setWithCredentials(this.withCredentials),c.load(e,function(l){try{s.parse(l,o,function(h){t(h),s.manager.itemEnd(e)},a)}catch(h){a(h)}},n,a)}setDRACOLoader(e){return this.dracoLoader=e,this}setKTX2Loader(e){return this.ktx2Loader=e,this}setMeshoptDecoder(e){return this.meshoptDecoder=e,this}register(e){return this.pluginCallbacks.indexOf(e)===-1&&this.pluginCallbacks.push(e),this}unregister(e){return this.pluginCallbacks.indexOf(e)!==-1&&this.pluginCallbacks.splice(this.pluginCallbacks.indexOf(e),1),this}parse(e,t,n,r){let s;const o={},a={},c=new TextDecoder;if(typeof e=="string")s=JSON.parse(e);else if(e instanceof ArrayBuffer)if(c.decode(new Uint8Array(e,0,4))===$d){try{o[At.KHR_BINARY_GLTF]=new Yv(e)}catch(u){r&&r(u);return}s=JSON.parse(o[At.KHR_BINARY_GLTF].content)}else s=JSON.parse(c.decode(e));else s=e;if(s.asset===void 0||s.asset.version[0]<2){r&&r(new Error("THREE.GLTFLoader: Unsupported asset. glTF versions >=2.0 are supported."));return}const l=new ly(s,{path:t||this.resourcePath||"",crossOrigin:this.crossOrigin,requestHeader:this.requestHeader,manager:this.manager,ktx2Loader:this.ktx2Loader,meshoptDecoder:this.meshoptDecoder});l.fileLoader.setRequestHeader(this.requestHeader);for(let h=0;h<this.pluginCallbacks.length;h++){const u=this.pluginCallbacks[h](l);u.name||console.error("THREE.GLTFLoader: Invalid plugin found: missing name"),a[u.name]=u,o[u.name]=!0}if(s.extensionsUsed)for(let h=0;h<s.extensionsUsed.length;++h){const u=s.extensionsUsed[h],d=s.extensionsRequired||[];switch(u){case At.KHR_MATERIALS_UNLIT:o[u]=new Iv;break;case At.KHR_DRACO_MESH_COMPRESSION:o[u]=new $v(s,this.dracoLoader);break;case At.KHR_TEXTURE_TRANSFORM:o[u]=new Zv;break;case At.KHR_MESH_QUANTIZATION:o[u]=new Jv;break;default:d.indexOf(u)>=0&&a[u]===void 0&&console.warn('THREE.GLTFLoader: Unknown extension "'+u+'".')}}l.setExtensions(o),l.setPlugins(a),l.parse(n,r)}parseAsync(e,t){const n=this;return new Promise(function(r,s){n.parse(e,t,r,s)})}}function Lv(){let i={};return{get:function(e){return i[e]},add:function(e,t){i[e]=t},remove:function(e){delete i[e]},removeAll:function(){i={}}}}const At={KHR_BINARY_GLTF:"KHR_binary_glTF",KHR_DRACO_MESH_COMPRESSION:"KHR_draco_mesh_compression",KHR_LIGHTS_PUNCTUAL:"KHR_lights_punctual",KHR_MATERIALS_CLEARCOAT:"KHR_materials_clearcoat",KHR_MATERIALS_DISPERSION:"KHR_materials_dispersion",KHR_MATERIALS_IOR:"KHR_materials_ior",KHR_MATERIALS_SHEEN:"KHR_materials_sheen",KHR_MATERIALS_SPECULAR:"KHR_materials_specular",KHR_MATERIALS_TRANSMISSION:"KHR_materials_transmission",KHR_MATERIALS_IRIDESCENCE:"KHR_materials_iridescence",KHR_MATERIALS_ANISOTROPY:"KHR_materials_anisotropy",KHR_MATERIALS_UNLIT:"KHR_materials_unlit",KHR_MATERIALS_VOLUME:"KHR_materials_volume",KHR_TEXTURE_BASISU:"KHR_texture_basisu",KHR_TEXTURE_TRANSFORM:"KHR_texture_transform",KHR_MESH_QUANTIZATION:"KHR_mesh_quantization",KHR_MATERIALS_EMISSIVE_STRENGTH:"KHR_materials_emissive_strength",EXT_MATERIALS_BUMP:"EXT_materials_bump",EXT_TEXTURE_WEBP:"EXT_texture_webp",EXT_TEXTURE_AVIF:"EXT_texture_avif",EXT_MESHOPT_COMPRESSION:"EXT_meshopt_compression",EXT_MESH_GPU_INSTANCING:"EXT_mesh_gpu_instancing"};class Dv{constructor(e){this.parser=e,this.name=At.KHR_LIGHTS_PUNCTUAL,this.cache={refs:{},uses:{}}}_markDefs(){const e=this.parser,t=this.parser.json.nodes||[];for(let n=0,r=t.length;n<r;n++){const s=t[n];s.extensions&&s.extensions[this.name]&&s.extensions[this.name].light!==void 0&&e._addNodeRef(this.cache,s.extensions[this.name].light)}}_loadLight(e){const t=this.parser,n="light:"+e;let r=t.cache.get(n);if(r)return r;const s=t.json,c=((s.extensions&&s.extensions[this.name]||{}).lights||[])[e];let l;const h=new it(16777215);c.color!==void 0&&h.setRGB(c.color[0],c.color[1],c.color[2],Pn);const u=c.range!==void 0?c.range:0;switch(c.type){case"directional":l=new ls(h),l.target.position.set(0,0,-1),l.add(l.target);break;case"point":l=new Bd(h),l.distance=u;break;case"spot":l=new gx(h),l.distance=u,c.spot=c.spot||{},c.spot.innerConeAngle=c.spot.innerConeAngle!==void 0?c.spot.innerConeAngle:0,c.spot.outerConeAngle=c.spot.outerConeAngle!==void 0?c.spot.outerConeAngle:Math.PI/4,l.angle=c.spot.outerConeAngle,l.penumbra=1-c.spot.innerConeAngle/c.spot.outerConeAngle,l.target.position.set(0,0,-1),l.add(l.target);break;default:throw new Error("THREE.GLTFLoader: Unexpected light type: "+c.type)}return l.position.set(0,0,0),l.decay=2,Ni(l,c),c.intensity!==void 0&&(l.intensity=c.intensity),l.name=t.createUniqueName(c.name||"light_"+e),r=Promise.resolve(l),t.cache.add(n,r),r}getDependency(e,t){if(e==="light")return this._loadLight(t)}createNodeAttachment(e){const t=this,n=this.parser,s=n.json.nodes[e],a=(s.extensions&&s.extensions[this.name]||{}).light;return a===void 0?null:this._loadLight(a).then(function(c){return n._getNodeRef(t.cache,a,c)})}}class Iv{constructor(){this.name=At.KHR_MATERIALS_UNLIT}getMaterialType(){return Oi}extendParams(e,t,n){const r=[];e.color=new it(1,1,1),e.opacity=1;const s=t.pbrMetallicRoughness;if(s){if(Array.isArray(s.baseColorFactor)){const o=s.baseColorFactor;e.color.setRGB(o[0],o[1],o[2],Pn),e.opacity=o[3]}s.baseColorTexture!==void 0&&r.push(n.assignTexture(e,"map",s.baseColorTexture,ln))}return Promise.all(r)}}class Nv{constructor(e){this.parser=e,this.name=At.KHR_MATERIALS_EMISSIVE_STRENGTH}extendMaterialParams(e,t){const r=this.parser.json.materials[e];if(!r.extensions||!r.extensions[this.name])return Promise.resolve();const s=r.extensions[this.name].emissiveStrength;return s!==void 0&&(t.emissiveIntensity=s),Promise.resolve()}}class Uv{constructor(e){this.parser=e,this.name=At.KHR_MATERIALS_CLEARCOAT}getMaterialType(e){const n=this.parser.json.materials[e];return!n.extensions||!n.extensions[this.name]?null:yi}extendMaterialParams(e,t){const n=this.parser,r=n.json.materials[e];if(!r.extensions||!r.extensions[this.name])return Promise.resolve();const s=[],o=r.extensions[this.name];if(o.clearcoatFactor!==void 0&&(t.clearcoat=o.clearcoatFactor),o.clearcoatTexture!==void 0&&s.push(n.assignTexture(t,"clearcoatMap",o.clearcoatTexture)),o.clearcoatRoughnessFactor!==void 0&&(t.clearcoatRoughness=o.clearcoatRoughnessFactor),o.clearcoatRoughnessTexture!==void 0&&s.push(n.assignTexture(t,"clearcoatRoughnessMap",o.clearcoatRoughnessTexture)),o.clearcoatNormalTexture!==void 0&&(s.push(n.assignTexture(t,"clearcoatNormalMap",o.clearcoatNormalTexture)),o.clearcoatNormalTexture.scale!==void 0)){const a=o.clearcoatNormalTexture.scale;t.clearcoatNormalScale=new at(a,a)}return Promise.all(s)}}class Fv{constructor(e){this.parser=e,this.name=At.KHR_MATERIALS_DISPERSION}getMaterialType(e){const n=this.parser.json.materials[e];return!n.extensions||!n.extensions[this.name]?null:yi}extendMaterialParams(e,t){const r=this.parser.json.materials[e];if(!r.extensions||!r.extensions[this.name])return Promise.resolve();const s=r.extensions[this.name];return t.dispersion=s.dispersion!==void 0?s.dispersion:0,Promise.resolve()}}class Ov{constructor(e){this.parser=e,this.name=At.KHR_MATERIALS_IRIDESCENCE}getMaterialType(e){const n=this.parser.json.materials[e];return!n.extensions||!n.extensions[this.name]?null:yi}extendMaterialParams(e,t){const n=this.parser,r=n.json.materials[e];if(!r.extensions||!r.extensions[this.name])return Promise.resolve();const s=[],o=r.extensions[this.name];return o.iridescenceFactor!==void 0&&(t.iridescence=o.iridescenceFactor),o.iridescenceTexture!==void 0&&s.push(n.assignTexture(t,"iridescenceMap",o.iridescenceTexture)),o.iridescenceIor!==void 0&&(t.iridescenceIOR=o.iridescenceIor),t.iridescenceThicknessRange===void 0&&(t.iridescenceThicknessRange=[100,400]),o.iridescenceThicknessMinimum!==void 0&&(t.iridescenceThicknessRange[0]=o.iridescenceThicknessMinimum),o.iridescenceThicknessMaximum!==void 0&&(t.iridescenceThicknessRange[1]=o.iridescenceThicknessMaximum),o.iridescenceThicknessTexture!==void 0&&s.push(n.assignTexture(t,"iridescenceThicknessMap",o.iridescenceThicknessTexture)),Promise.all(s)}}class kv{constructor(e){this.parser=e,this.name=At.KHR_MATERIALS_SHEEN}getMaterialType(e){const n=this.parser.json.materials[e];return!n.extensions||!n.extensions[this.name]?null:yi}extendMaterialParams(e,t){const n=this.parser,r=n.json.materials[e];if(!r.extensions||!r.extensions[this.name])return Promise.resolve();const s=[];t.sheenColor=new it(0,0,0),t.sheenRoughness=0,t.sheen=1;const o=r.extensions[this.name];if(o.sheenColorFactor!==void 0){const a=o.sheenColorFactor;t.sheenColor.setRGB(a[0],a[1],a[2],Pn)}return o.sheenRoughnessFactor!==void 0&&(t.sheenRoughness=o.sheenRoughnessFactor),o.sheenColorTexture!==void 0&&s.push(n.assignTexture(t,"sheenColorMap",o.sheenColorTexture,ln)),o.sheenRoughnessTexture!==void 0&&s.push(n.assignTexture(t,"sheenRoughnessMap",o.sheenRoughnessTexture)),Promise.all(s)}}class Bv{constructor(e){this.parser=e,this.name=At.KHR_MATERIALS_TRANSMISSION}getMaterialType(e){const n=this.parser.json.materials[e];return!n.extensions||!n.extensions[this.name]?null:yi}extendMaterialParams(e,t){const n=this.parser,r=n.json.materials[e];if(!r.extensions||!r.extensions[this.name])return Promise.resolve();const s=[],o=r.extensions[this.name];return o.transmissionFactor!==void 0&&(t.transmission=o.transmissionFactor),o.transmissionTexture!==void 0&&s.push(n.assignTexture(t,"transmissionMap",o.transmissionTexture)),Promise.all(s)}}class zv{constructor(e){this.parser=e,this.name=At.KHR_MATERIALS_VOLUME}getMaterialType(e){const n=this.parser.json.materials[e];return!n.extensions||!n.extensions[this.name]?null:yi}extendMaterialParams(e,t){const n=this.parser,r=n.json.materials[e];if(!r.extensions||!r.extensions[this.name])return Promise.resolve();const s=[],o=r.extensions[this.name];t.thickness=o.thicknessFactor!==void 0?o.thicknessFactor:0,o.thicknessTexture!==void 0&&s.push(n.assignTexture(t,"thicknessMap",o.thicknessTexture)),t.attenuationDistance=o.attenuationDistance||1/0;const a=o.attenuationColor||[1,1,1];return t.attenuationColor=new it().setRGB(a[0],a[1],a[2],Pn),Promise.all(s)}}class Hv{constructor(e){this.parser=e,this.name=At.KHR_MATERIALS_IOR}getMaterialType(e){const n=this.parser.json.materials[e];return!n.extensions||!n.extensions[this.name]?null:yi}extendMaterialParams(e,t){const r=this.parser.json.materials[e];if(!r.extensions||!r.extensions[this.name])return Promise.resolve();const s=r.extensions[this.name];return t.ior=s.ior!==void 0?s.ior:1.5,Promise.resolve()}}class Vv{constructor(e){this.parser=e,this.name=At.KHR_MATERIALS_SPECULAR}getMaterialType(e){const n=this.parser.json.materials[e];return!n.extensions||!n.extensions[this.name]?null:yi}extendMaterialParams(e,t){const n=this.parser,r=n.json.materials[e];if(!r.extensions||!r.extensions[this.name])return Promise.resolve();const s=[],o=r.extensions[this.name];t.specularIntensity=o.specularFactor!==void 0?o.specularFactor:1,o.specularTexture!==void 0&&s.push(n.assignTexture(t,"specularIntensityMap",o.specularTexture));const a=o.specularColorFactor||[1,1,1];return t.specularColor=new it().setRGB(a[0],a[1],a[2],Pn),o.specularColorTexture!==void 0&&s.push(n.assignTexture(t,"specularColorMap",o.specularColorTexture,ln)),Promise.all(s)}}class Gv{constructor(e){this.parser=e,this.name=At.EXT_MATERIALS_BUMP}getMaterialType(e){const n=this.parser.json.materials[e];return!n.extensions||!n.extensions[this.name]?null:yi}extendMaterialParams(e,t){const n=this.parser,r=n.json.materials[e];if(!r.extensions||!r.extensions[this.name])return Promise.resolve();const s=[],o=r.extensions[this.name];return t.bumpScale=o.bumpFactor!==void 0?o.bumpFactor:1,o.bumpTexture!==void 0&&s.push(n.assignTexture(t,"bumpMap",o.bumpTexture)),Promise.all(s)}}class Wv{constructor(e){this.parser=e,this.name=At.KHR_MATERIALS_ANISOTROPY}getMaterialType(e){const n=this.parser.json.materials[e];return!n.extensions||!n.extensions[this.name]?null:yi}extendMaterialParams(e,t){const n=this.parser,r=n.json.materials[e];if(!r.extensions||!r.extensions[this.name])return Promise.resolve();const s=[],o=r.extensions[this.name];return o.anisotropyStrength!==void 0&&(t.anisotropy=o.anisotropyStrength),o.anisotropyRotation!==void 0&&(t.anisotropyRotation=o.anisotropyRotation),o.anisotropyTexture!==void 0&&s.push(n.assignTexture(t,"anisotropyMap",o.anisotropyTexture)),Promise.all(s)}}class qv{constructor(e){this.parser=e,this.name=At.KHR_TEXTURE_BASISU}loadTexture(e){const t=this.parser,n=t.json,r=n.textures[e];if(!r.extensions||!r.extensions[this.name])return null;const s=r.extensions[this.name],o=t.options.ktx2Loader;if(!o){if(n.extensionsRequired&&n.extensionsRequired.indexOf(this.name)>=0)throw new Error("THREE.GLTFLoader: setKTX2Loader must be called before loading KTX2 textures");return null}return t.loadTextureImage(e,s.source,o)}}class jv{constructor(e){this.parser=e,this.name=At.EXT_TEXTURE_WEBP,this.isSupported=null}loadTexture(e){const t=this.name,n=this.parser,r=n.json,s=r.textures[e];if(!s.extensions||!s.extensions[t])return null;const o=s.extensions[t],a=r.images[o.source];let c=n.textureLoader;if(a.uri){const l=n.options.manager.getHandler(a.uri);l!==null&&(c=l)}return this.detectSupport().then(function(l){if(l)return n.loadTextureImage(e,o.source,c);if(r.extensionsRequired&&r.extensionsRequired.indexOf(t)>=0)throw new Error("THREE.GLTFLoader: WebP required by asset but unsupported.");return n.loadTexture(e)})}detectSupport(){return this.isSupported||(this.isSupported=new Promise(function(e){const t=new Image;t.src="data:image/webp;base64,UklGRiIAAABXRUJQVlA4IBYAAAAwAQCdASoBAAEADsD+JaQAA3AAAAAA",t.onload=t.onerror=function(){e(t.height===1)}})),this.isSupported}}class Xv{constructor(e){this.parser=e,this.name=At.EXT_TEXTURE_AVIF,this.isSupported=null}loadTexture(e){const t=this.name,n=this.parser,r=n.json,s=r.textures[e];if(!s.extensions||!s.extensions[t])return null;const o=s.extensions[t],a=r.images[o.source];let c=n.textureLoader;if(a.uri){const l=n.options.manager.getHandler(a.uri);l!==null&&(c=l)}return this.detectSupport().then(function(l){if(l)return n.loadTextureImage(e,o.source,c);if(r.extensionsRequired&&r.extensionsRequired.indexOf(t)>=0)throw new Error("THREE.GLTFLoader: AVIF required by asset but unsupported.");return n.loadTexture(e)})}detectSupport(){return this.isSupported||(this.isSupported=new Promise(function(e){const t=new Image;t.src="data:image/avif;base64,AAAAIGZ0eXBhdmlmAAAAAGF2aWZtaWYxbWlhZk1BMUIAAADybWV0YQAAAAAAAAAoaGRscgAAAAAAAAAAcGljdAAAAAAAAAAAAAAAAGxpYmF2aWYAAAAADnBpdG0AAAAAAAEAAAAeaWxvYwAAAABEAAABAAEAAAABAAABGgAAABcAAAAoaWluZgAAAAAAAQAAABppbmZlAgAAAAABAABhdjAxQ29sb3IAAAAAamlwcnAAAABLaXBjbwAAABRpc3BlAAAAAAAAAAEAAAABAAAAEHBpeGkAAAAAAwgICAAAAAxhdjFDgQAMAAAAABNjb2xybmNseAACAAIABoAAAAAXaXBtYQAAAAAAAAABAAEEAQKDBAAAAB9tZGF0EgAKCBgABogQEDQgMgkQAAAAB8dSLfI=",t.onload=t.onerror=function(){e(t.height===1)}})),this.isSupported}}class Qv{constructor(e){this.name=At.EXT_MESHOPT_COMPRESSION,this.parser=e}loadBufferView(e){const t=this.parser.json,n=t.bufferViews[e];if(n.extensions&&n.extensions[this.name]){const r=n.extensions[this.name],s=this.parser.getDependency("buffer",r.buffer),o=this.parser.options.meshoptDecoder;if(!o||!o.supported){if(t.extensionsRequired&&t.extensionsRequired.indexOf(this.name)>=0)throw new Error("THREE.GLTFLoader: setMeshoptDecoder must be called before loading compressed files");return null}return s.then(function(a){const c=r.byteOffset||0,l=r.byteLength||0,h=r.count,u=r.byteStride,d=new Uint8Array(a,c,l);return o.decodeGltfBufferAsync?o.decodeGltfBufferAsync(h,u,d,r.mode,r.filter).then(function(p){return p.buffer}):o.ready.then(function(){const p=new ArrayBuffer(h*u);return o.decodeGltfBuffer(new Uint8Array(p),h,u,d,r.mode,r.filter),p})})}else return null}}class Kv{constructor(e){this.name=At.EXT_MESH_GPU_INSTANCING,this.parser=e}createNodeMesh(e){const t=this.parser.json,n=t.nodes[e];if(!n.extensions||!n.extensions[this.name]||n.mesh===void 0)return null;const r=t.meshes[n.mesh];for(const l of r.primitives)if(l.mode!==Yn.TRIANGLES&&l.mode!==Yn.TRIANGLE_STRIP&&l.mode!==Yn.TRIANGLE_FAN&&l.mode!==void 0)return null;const o=n.extensions[this.name].attributes,a=[],c={};for(const l in o)a.push(this.parser.getDependency("accessor",o[l]).then(h=>(c[l]=h,c[l])));return a.length<1?null:(a.push(this.parser.createNodeMesh(e)),Promise.all(a).then(l=>{const h=l.pop(),u=h.isGroup?h.children:[h],d=l[0].count,p=[];for(const g of u){const b=new rt,m=new A,f=new Ve,y=new A(1,1,1),x=new K_(g.geometry,g.material,d);for(let _=0;_<d;_++)c.TRANSLATION&&m.fromBufferAttribute(c.TRANSLATION,_),c.ROTATION&&f.fromBufferAttribute(c.ROTATION,_),c.SCALE&&y.fromBufferAttribute(c.SCALE,_),x.setMatrixAt(_,b.compose(m,f,y));for(const _ in c)if(_==="_COLOR_0"){const I=c[_];x.instanceColor=new vl(I.array,I.itemSize,I.normalized)}else _!=="TRANSLATION"&&_!=="ROTATION"&&_!=="SCALE"&&g.geometry.setAttribute(_,c[_]);en.prototype.copy.call(x,g),this.parser.assignFinalMaterial(x),p.push(x)}return h.isGroup?(h.clear(),h.add(...p),h):p[0]}))}}const $d="glTF",js=12,Gu={JSON:1313821514,BIN:5130562};class Yv{constructor(e){this.name=At.KHR_BINARY_GLTF,this.content=null,this.body=null;const t=new DataView(e,0,js),n=new TextDecoder;if(this.header={magic:n.decode(new Uint8Array(e.slice(0,4))),version:t.getUint32(4,!0),length:t.getUint32(8,!0)},this.header.magic!==$d)throw new Error("THREE.GLTFLoader: Unsupported glTF-Binary header.");if(this.header.version<2)throw new Error("THREE.GLTFLoader: Legacy binary file detected.");const r=this.header.length-js,s=new DataView(e,js);let o=0;for(;o<r;){const a=s.getUint32(o,!0);o+=4;const c=s.getUint32(o,!0);if(o+=4,c===Gu.JSON){const l=new Uint8Array(e,js+o,a);this.content=n.decode(l)}else if(c===Gu.BIN){const l=js+o;this.body=e.slice(l,l+a)}o+=a}if(this.content===null)throw new Error("THREE.GLTFLoader: JSON content not found.")}}class $v{constructor(e,t){if(!t)throw new Error("THREE.GLTFLoader: No DRACOLoader instance provided.");this.name=At.KHR_DRACO_MESH_COMPRESSION,this.json=e,this.dracoLoader=t,this.dracoLoader.preload()}decodePrimitive(e,t){const n=this.json,r=this.dracoLoader,s=e.extensions[this.name].bufferView,o=e.extensions[this.name].attributes,a={},c={},l={};for(const h in o){const u=Cl[h]||h.toLowerCase();a[u]=o[h]}for(const h in e.attributes){const u=Cl[h]||h.toLowerCase();if(o[h]!==void 0){const d=n.accessors[e.attributes[h]],p=ds[d.componentType];l[u]=p.name,c[u]=d.normalized===!0}}return t.getDependency("bufferView",s).then(function(h){return new Promise(function(u,d){r.decodeDracoFile(h,function(p){for(const g in p.attributes){const b=p.attributes[g],m=c[g];m!==void 0&&(b.normalized=m)}u(p)},a,l,Pn,d)})})}}class Zv{constructor(){this.name=At.KHR_TEXTURE_TRANSFORM}extendTexture(e,t){return(t.texCoord===void 0||t.texCoord===e.channel)&&t.offset===void 0&&t.rotation===void 0&&t.scale===void 0||(e=e.clone(),t.texCoord!==void 0&&(e.channel=t.texCoord),t.offset!==void 0&&e.offset.fromArray(t.offset),t.rotation!==void 0&&(e.rotation=t.rotation),t.scale!==void 0&&e.repeat.fromArray(t.scale),e.needsUpdate=!0),e}}class Jv{constructor(){this.name=At.KHR_MESH_QUANTIZATION}}class Zd extends lo{constructor(e,t,n,r){super(e,t,n,r)}copySampleValue_(e){const t=this.resultBuffer,n=this.sampleValues,r=this.valueSize,s=e*r*3+r;for(let o=0;o!==r;o++)t[o]=n[s+o];return t}interpolate_(e,t,n,r){const s=this.resultBuffer,o=this.sampleValues,a=this.valueSize,c=a*2,l=a*3,h=r-t,u=(n-t)/h,d=u*u,p=d*u,g=e*l,b=g-l,m=-2*p+3*d,f=p-d,y=1-m,x=f-d+u;for(let _=0;_!==a;_++){const I=o[b+_+a],L=o[b+_+c]*h,C=o[g+_+a],F=o[g+_]*h;s[_]=y*I+x*L+m*C+f*F}return s}}const ey=new Ve;class ty extends Zd{interpolate_(e,t,n,r){const s=super.interpolate_(e,t,n,r);return ey.fromArray(s).normalize().toArray(s),s}}const Yn={POINTS:0,LINES:1,LINE_LOOP:2,LINE_STRIP:3,TRIANGLES:4,TRIANGLE_STRIP:5,TRIANGLE_FAN:6},ds={5120:Int8Array,5121:Uint8Array,5122:Int16Array,5123:Uint16Array,5125:Uint32Array,5126:Float32Array},Wu={9728:Cn,9729:qn,9984:rd,9985:ea,9986:Qs,9987:Ui},qu={33071:sr,33648:fa,10497:_s},Ac={SCALAR:1,VEC2:2,VEC3:3,VEC4:4,MAT2:4,MAT3:9,MAT4:16},Cl={POSITION:"position",NORMAL:"normal",TANGENT:"tangent",TEXCOORD_0:"uv",TEXCOORD_1:"uv1",TEXCOORD_2:"uv2",TEXCOORD_3:"uv3",COLOR_0:"color",WEIGHTS_0:"skinWeight",JOINTS_0:"skinIndex"},er={scale:"scale",translation:"position",rotation:"quaternion",weights:"morphTargetInfluences"},ny={CUBICSPLINE:void 0,LINEAR:ro,STEP:io},Tc={OPAQUE:"OPAQUE",MASK:"MASK",BLEND:"BLEND"};function iy(i){return i.DefaultMaterial===void 0&&(i.DefaultMaterial=new Ir({color:16777215,emissive:0,metalness:1,roughness:1,transparent:!1,depthTest:!0,side:Gi})),i.DefaultMaterial}function Mr(i,e,t){for(const n in t.extensions)i[n]===void 0&&(e.userData.gltfExtensions=e.userData.gltfExtensions||{},e.userData.gltfExtensions[n]=t.extensions[n])}function Ni(i,e){e.extras!==void 0&&(typeof e.extras=="object"?Object.assign(i.userData,e.extras):console.warn("THREE.GLTFLoader: Ignoring primitive type .extras, "+e.extras))}function ry(i,e,t){let n=!1,r=!1,s=!1;for(let l=0,h=e.length;l<h;l++){const u=e[l];if(u.POSITION!==void 0&&(n=!0),u.NORMAL!==void 0&&(r=!0),u.COLOR_0!==void 0&&(s=!0),n&&r&&s)break}if(!n&&!r&&!s)return Promise.resolve(i);const o=[],a=[],c=[];for(let l=0,h=e.length;l<h;l++){const u=e[l];if(n){const d=u.POSITION!==void 0?t.getDependency("accessor",u.POSITION):i.attributes.position;o.push(d)}if(r){const d=u.NORMAL!==void 0?t.getDependency("accessor",u.NORMAL):i.attributes.normal;a.push(d)}if(s){const d=u.COLOR_0!==void 0?t.getDependency("accessor",u.COLOR_0):i.attributes.color;c.push(d)}}return Promise.all([Promise.all(o),Promise.all(a),Promise.all(c)]).then(function(l){const h=l[0],u=l[1],d=l[2];return n&&(i.morphAttributes.position=h),r&&(i.morphAttributes.normal=u),s&&(i.morphAttributes.color=d),i.morphTargetsRelative=!0,i})}function sy(i,e){if(i.updateMorphTargets(),e.weights!==void 0)for(let t=0,n=e.weights.length;t<n;t++)i.morphTargetInfluences[t]=e.weights[t];if(e.extras&&Array.isArray(e.extras.targetNames)){const t=e.extras.targetNames;if(i.morphTargetInfluences.length===t.length){i.morphTargetDictionary={};for(let n=0,r=t.length;n<r;n++)i.morphTargetDictionary[t[n]]=n}else console.warn("THREE.GLTFLoader: Invalid extras.targetNames length. Ignoring names.")}}function oy(i){let e;const t=i.extensions&&i.extensions[At.KHR_DRACO_MESH_COMPRESSION];if(t?e="draco:"+t.bufferView+":"+t.indices+":"+Rc(t.attributes):e=i.indices+":"+Rc(i.attributes)+":"+i.mode,i.targets!==void 0)for(let n=0,r=i.targets.length;n<r;n++)e+=":"+Rc(i.targets[n]);return e}function Rc(i){let e="";const t=Object.keys(i).sort();for(let n=0,r=t.length;n<r;n++)e+=t[n]+":"+i[t[n]]+";";return e}function Pl(i){switch(i){case Int8Array:return 1/127;case Uint8Array:return 1/255;case Int16Array:return 1/32767;case Uint16Array:return 1/65535;default:throw new Error("THREE.GLTFLoader: Unsupported normalized accessor component type.")}}function ay(i){return i.search(/\.jpe?g($|\?)/i)>0||i.search(/^data\:image\/jpeg/)===0?"image/jpeg":i.search(/\.webp($|\?)/i)>0||i.search(/^data\:image\/webp/)===0?"image/webp":i.search(/\.ktx2($|\?)/i)>0||i.search(/^data\:image\/ktx2/)===0?"image/ktx2":"image/png"}const cy=new rt;class ly{constructor(e={},t={}){this.json=e,this.extensions={},this.plugins={},this.options=t,this.cache=new Lv,this.associations=new Map,this.primitiveCache={},this.nodeCache={},this.meshCache={refs:{},uses:{}},this.cameraCache={refs:{},uses:{}},this.lightCache={refs:{},uses:{}},this.sourceCache={},this.textureCache={},this.nodeNamesUsed={};let n=!1,r=-1,s=!1,o=-1;if(typeof navigator<"u"){const a=navigator.userAgent;n=/^((?!chrome|android).)*safari/i.test(a)===!0;const c=a.match(/Version\/(\d+)/);r=n&&c?parseInt(c[1],10):-1,s=a.indexOf("Firefox")>-1,o=s?a.match(/Firefox\/([0-9]+)\./)[1]:-1}typeof createImageBitmap>"u"||n&&r<17||s&&o<98?this.textureLoader=new px(this.options.manager):this.textureLoader=new xx(this.options.manager),this.textureLoader.setCrossOrigin(this.options.crossOrigin),this.textureLoader.setRequestHeader(this.options.requestHeader),this.fileLoader=new Od(this.options.manager),this.fileLoader.setResponseType("arraybuffer"),this.options.crossOrigin==="use-credentials"&&this.fileLoader.setWithCredentials(!0)}setExtensions(e){this.extensions=e}setPlugins(e){this.plugins=e}parse(e,t){const n=this,r=this.json,s=this.extensions;this.cache.removeAll(),this.nodeCache={},this._invokeAll(function(o){return o._markDefs&&o._markDefs()}),Promise.all(this._invokeAll(function(o){return o.beforeRoot&&o.beforeRoot()})).then(function(){return Promise.all([n.getDependencies("scene"),n.getDependencies("animation"),n.getDependencies("camera")])}).then(function(o){const a={scene:o[0][r.scene||0],scenes:o[0],animations:o[1],cameras:o[2],asset:r.asset,parser:n,userData:{}};return Mr(s,a,r),Ni(a,r),Promise.all(n._invokeAll(function(c){return c.afterRoot&&c.afterRoot(a)})).then(function(){for(const c of a.scenes)c.updateMatrixWorld();e(a)})}).catch(t)}_markDefs(){const e=this.json.nodes||[],t=this.json.skins||[],n=this.json.meshes||[];for(let r=0,s=t.length;r<s;r++){const o=t[r].joints;for(let a=0,c=o.length;a<c;a++)e[o[a]].isBone=!0}for(let r=0,s=e.length;r<s;r++){const o=e[r];o.mesh!==void 0&&(this._addNodeRef(this.meshCache,o.mesh),o.skin!==void 0&&(n[o.mesh].isSkinnedMesh=!0)),o.camera!==void 0&&this._addNodeRef(this.cameraCache,o.camera)}}_addNodeRef(e,t){t!==void 0&&(e.refs[t]===void 0&&(e.refs[t]=e.uses[t]=0),e.refs[t]++)}_getNodeRef(e,t,n){if(e.refs[t]<=1)return n;const r=n.clone(),s=(o,a)=>{const c=this.associations.get(o);c!=null&&this.associations.set(a,c);for(const[l,h]of o.children.entries())s(h,a.children[l])};return s(n,r),r.name+="_instance_"+e.uses[t]++,r}_invokeOne(e){const t=Object.values(this.plugins);t.push(this);for(let n=0;n<t.length;n++){const r=e(t[n]);if(r)return r}return null}_invokeAll(e){const t=Object.values(this.plugins);t.unshift(this);const n=[];for(let r=0;r<t.length;r++){const s=e(t[r]);s&&n.push(s)}return n}getDependency(e,t){const n=e+":"+t;let r=this.cache.get(n);if(!r){switch(e){case"scene":r=this.loadScene(t);break;case"node":r=this._invokeOne(function(s){return s.loadNode&&s.loadNode(t)});break;case"mesh":r=this._invokeOne(function(s){return s.loadMesh&&s.loadMesh(t)});break;case"accessor":r=this.loadAccessor(t);break;case"bufferView":r=this._invokeOne(function(s){return s.loadBufferView&&s.loadBufferView(t)});break;case"buffer":r=this.loadBuffer(t);break;case"material":r=this._invokeOne(function(s){return s.loadMaterial&&s.loadMaterial(t)});break;case"texture":r=this._invokeOne(function(s){return s.loadTexture&&s.loadTexture(t)});break;case"skin":r=this.loadSkin(t);break;case"animation":r=this._invokeOne(function(s){return s.loadAnimation&&s.loadAnimation(t)});break;case"camera":r=this.loadCamera(t);break;default:if(r=this._invokeOne(function(s){return s!=this&&s.getDependency&&s.getDependency(e,t)}),!r)throw new Error("Unknown type: "+e);break}this.cache.add(n,r)}return r}getDependencies(e){let t=this.cache.get(e);if(!t){const n=this,r=this.json[e+(e==="mesh"?"es":"s")]||[];t=Promise.all(r.map(function(s,o){return n.getDependency(e,o)})),this.cache.add(e,t)}return t}loadBuffer(e){const t=this.json.buffers[e],n=this.fileLoader;if(t.type&&t.type!=="arraybuffer")throw new Error("THREE.GLTFLoader: "+t.type+" buffer type is not supported.");if(t.uri===void 0&&e===0)return Promise.resolve(this.extensions[At.KHR_BINARY_GLTF].body);const r=this.options;return new Promise(function(s,o){n.load(Js.resolveURL(t.uri,r.path),s,void 0,function(){o(new Error('THREE.GLTFLoader: Failed to load buffer "'+t.uri+'".'))})})}loadBufferView(e){const t=this.json.bufferViews[e];return this.getDependency("buffer",t.buffer).then(function(n){const r=t.byteLength||0,s=t.byteOffset||0;return n.slice(s,s+r)})}loadAccessor(e){const t=this,n=this.json,r=this.json.accessors[e];if(r.bufferView===void 0&&r.sparse===void 0){const o=Ac[r.type],a=ds[r.componentType],c=r.normalized===!0,l=new a(r.count*o);return Promise.resolve(new wn(l,o,c))}const s=[];return r.bufferView!==void 0?s.push(this.getDependency("bufferView",r.bufferView)):s.push(null),r.sparse!==void 0&&(s.push(this.getDependency("bufferView",r.sparse.indices.bufferView)),s.push(this.getDependency("bufferView",r.sparse.values.bufferView))),Promise.all(s).then(function(o){const a=o[0],c=Ac[r.type],l=ds[r.componentType],h=l.BYTES_PER_ELEMENT,u=h*c,d=r.byteOffset||0,p=r.bufferView!==void 0?n.bufferViews[r.bufferView].byteStride:void 0,g=r.normalized===!0;let b,m;if(p&&p!==u){const f=Math.floor(d/p),y="InterleavedBuffer:"+r.bufferView+":"+r.componentType+":"+f+":"+r.count;let x=t.cache.get(y);x||(b=new l(a,f*p,r.count*p/h),x=new W_(b,p/h),t.cache.add(y,x)),m=new Kl(x,c,d%p/h,g)}else a===null?b=new l(r.count*c):b=new l(a,d,r.count*c),m=new wn(b,c,g);if(r.sparse!==void 0){const f=Ac.SCALAR,y=ds[r.sparse.indices.componentType],x=r.sparse.indices.byteOffset||0,_=r.sparse.values.byteOffset||0,I=new y(o[1],x,r.sparse.count*f),L=new l(o[2],_,r.sparse.count*c);a!==null&&(m=new wn(m.array.slice(),m.itemSize,m.normalized)),m.normalized=!1;for(let C=0,F=I.length;C<F;C++){const w=I[C];if(m.setX(w,L[C*c]),c>=2&&m.setY(w,L[C*c+1]),c>=3&&m.setZ(w,L[C*c+2]),c>=4&&m.setW(w,L[C*c+3]),c>=5)throw new Error("THREE.GLTFLoader: Unsupported itemSize in sparse BufferAttribute.")}m.normalized=g}return m})}loadTexture(e){const t=this.json,n=this.options,s=t.textures[e].source,o=t.images[s];let a=this.textureLoader;if(o.uri){const c=n.manager.getHandler(o.uri);c!==null&&(a=c)}return this.loadTextureImage(e,s,a)}loadTextureImage(e,t,n){const r=this,s=this.json,o=s.textures[e],a=s.images[t],c=(a.uri||a.bufferView)+":"+o.sampler;if(this.textureCache[c])return this.textureCache[c];const l=this.loadImageSource(t,n).then(function(h){h.flipY=!1,h.name=o.name||a.name||"",h.name===""&&typeof a.uri=="string"&&a.uri.startsWith("data:image/")===!1&&(h.name=a.uri);const d=(s.samplers||{})[o.sampler]||{};return h.magFilter=Wu[d.magFilter]||qn,h.minFilter=Wu[d.minFilter]||Ui,h.wrapS=qu[d.wrapS]||_s,h.wrapT=qu[d.wrapT]||_s,h.generateMipmaps=!h.isCompressedTexture&&h.minFilter!==Cn&&h.minFilter!==qn,r.associations.set(h,{textures:e}),h}).catch(function(){return null});return this.textureCache[c]=l,l}loadImageSource(e,t){const n=this,r=this.json,s=this.options;if(this.sourceCache[e]!==void 0)return this.sourceCache[e].then(u=>u.clone());const o=r.images[e],a=self.URL||self.webkitURL;let c=o.uri||"",l=!1;if(o.bufferView!==void 0)c=n.getDependency("bufferView",o.bufferView).then(function(u){l=!0;const d=new Blob([u],{type:o.mimeType});return c=a.createObjectURL(d),c});else if(o.uri===void 0)throw new Error("THREE.GLTFLoader: Image "+e+" is missing URI and bufferView");const h=Promise.resolve(c).then(function(u){return new Promise(function(d,p){let g=d;t.isImageBitmapLoader===!0&&(g=function(b){const m=new hn(b);m.needsUpdate=!0,d(m)}),t.load(Js.resolveURL(u,s.path),g,void 0,p)})}).then(function(u){return l===!0&&a.revokeObjectURL(c),Ni(u,o),u.userData.mimeType=o.mimeType||ay(o.uri),u}).catch(function(u){throw console.error("THREE.GLTFLoader: Couldn't load texture",c),u});return this.sourceCache[e]=h,h}assignTexture(e,t,n,r){const s=this;return this.getDependency("texture",n.index).then(function(o){if(!o)return null;if(n.texCoord!==void 0&&n.texCoord>0&&(o=o.clone(),o.channel=n.texCoord),s.extensions[At.KHR_TEXTURE_TRANSFORM]){const a=n.extensions!==void 0?n.extensions[At.KHR_TEXTURE_TRANSFORM]:void 0;if(a){const c=s.associations.get(o);o=s.extensions[At.KHR_TEXTURE_TRANSFORM].extendTexture(o,a),s.associations.set(o,c)}}return r!==void 0&&(o.colorSpace=r),e[t]=o,o})}assignFinalMaterial(e){const t=e.geometry;let n=e.material;const r=t.attributes.tangent===void 0,s=t.attributes.color!==void 0,o=t.attributes.normal===void 0;if(e.isPoints){const a="PointsMaterial:"+n.uuid;let c=this.cache.get(a);c||(c=new Nd,li.prototype.copy.call(c,n),c.color.copy(n.color),c.map=n.map,c.sizeAttenuation=!1,this.cache.add(a,c)),n=c}else if(e.isLine){const a="LineBasicMaterial:"+n.uuid;let c=this.cache.get(a);c||(c=new Id,li.prototype.copy.call(c,n),c.color.copy(n.color),c.map=n.map,this.cache.add(a,c)),n=c}if(r||s||o){let a="ClonedMaterial:"+n.uuid+":";r&&(a+="derivative-tangents:"),s&&(a+="vertex-colors:"),o&&(a+="flat-shading:");let c=this.cache.get(a);c||(c=n.clone(),s&&(c.vertexColors=!0),o&&(c.flatShading=!0),r&&(c.normalScale&&(c.normalScale.y*=-1),c.clearcoatNormalScale&&(c.clearcoatNormalScale.y*=-1)),this.cache.add(a,c),this.associations.set(c,this.associations.get(n))),n=c}e.material=n}getMaterialType(){return Ir}loadMaterial(e){const t=this,n=this.json,r=this.extensions,s=n.materials[e];let o;const a={},c=s.extensions||{},l=[];if(c[At.KHR_MATERIALS_UNLIT]){const u=r[At.KHR_MATERIALS_UNLIT];o=u.getMaterialType(),l.push(u.extendParams(a,s,t))}else{const u=s.pbrMetallicRoughness||{};if(a.color=new it(1,1,1),a.opacity=1,Array.isArray(u.baseColorFactor)){const d=u.baseColorFactor;a.color.setRGB(d[0],d[1],d[2],Pn),a.opacity=d[3]}u.baseColorTexture!==void 0&&l.push(t.assignTexture(a,"map",u.baseColorTexture,ln)),a.metalness=u.metallicFactor!==void 0?u.metallicFactor:1,a.roughness=u.roughnessFactor!==void 0?u.roughnessFactor:1,u.metallicRoughnessTexture!==void 0&&(l.push(t.assignTexture(a,"metalnessMap",u.metallicRoughnessTexture)),l.push(t.assignTexture(a,"roughnessMap",u.metallicRoughnessTexture))),o=this._invokeOne(function(d){return d.getMaterialType&&d.getMaterialType(e)}),l.push(Promise.all(this._invokeAll(function(d){return d.extendMaterialParams&&d.extendMaterialParams(e,a)})))}s.doubleSided===!0&&(a.side=mi);const h=s.alphaMode||Tc.OPAQUE;if(h===Tc.BLEND?(a.transparent=!0,a.depthWrite=!1):(a.transparent=!1,h===Tc.MASK&&(a.alphaTest=s.alphaCutoff!==void 0?s.alphaCutoff:.5)),s.normalTexture!==void 0&&o!==Oi&&(l.push(t.assignTexture(a,"normalMap",s.normalTexture)),a.normalScale=new at(1,1),s.normalTexture.scale!==void 0)){const u=s.normalTexture.scale;a.normalScale.set(u,u)}if(s.occlusionTexture!==void 0&&o!==Oi&&(l.push(t.assignTexture(a,"aoMap",s.occlusionTexture)),s.occlusionTexture.strength!==void 0&&(a.aoMapIntensity=s.occlusionTexture.strength)),s.emissiveFactor!==void 0&&o!==Oi){const u=s.emissiveFactor;a.emissive=new it().setRGB(u[0],u[1],u[2],Pn)}return s.emissiveTexture!==void 0&&o!==Oi&&l.push(t.assignTexture(a,"emissiveMap",s.emissiveTexture,ln)),Promise.all(l).then(function(){const u=new o(a);return s.name&&(u.name=s.name),Ni(u,s),t.associations.set(u,{materials:e}),s.extensions&&Mr(r,u,s),u})}createUniqueName(e){const t=Ht.sanitizeNodeName(e||"");return t in this.nodeNamesUsed?t+"_"+ ++this.nodeNamesUsed[t]:(this.nodeNamesUsed[t]=0,t)}loadGeometries(e){const t=this,n=this.extensions,r=this.primitiveCache;function s(a){return n[At.KHR_DRACO_MESH_COMPRESSION].decodePrimitive(a,t).then(function(c){return ju(c,a,t)})}const o=[];for(let a=0,c=e.length;a<c;a++){const l=e[a],h=oy(l),u=r[h];if(u)o.push(u.promise);else{let d;l.extensions&&l.extensions[At.KHR_DRACO_MESH_COMPRESSION]?d=s(l):d=ju(new vi,l,t),r[h]={primitive:l,promise:d},o.push(d)}}return Promise.all(o)}loadMesh(e){const t=this,n=this.json,r=this.extensions,s=n.meshes[e],o=s.primitives,a=[];for(let c=0,l=o.length;c<l;c++){const h=o[c].material===void 0?iy(this.cache):this.getDependency("material",o[c].material);a.push(h)}return a.push(t.loadGeometries(o)),Promise.all(a).then(function(c){const l=c.slice(0,c.length-1),h=c[c.length-1],u=[];for(let p=0,g=h.length;p<g;p++){const b=h[p],m=o[p];let f;const y=l[p];if(m.mode===Yn.TRIANGLES||m.mode===Yn.TRIANGLE_STRIP||m.mode===Yn.TRIANGLE_FAN||m.mode===void 0)f=s.isSkinnedMesh===!0?new j_(b,y):new jt(b,y),f.isSkinnedMesh===!0&&f.normalizeSkinWeights(),m.mode===Yn.TRIANGLE_STRIP?f.geometry=Vu(f.geometry,pd):m.mode===Yn.TRIANGLE_FAN&&(f.geometry=Vu(f.geometry,gl));else if(m.mode===Yn.LINES)f=new Y_(b,y);else if(m.mode===Yn.LINE_STRIP)f=new $l(b,y);else if(m.mode===Yn.LINE_LOOP)f=new $_(b,y);else if(m.mode===Yn.POINTS)f=new Z_(b,y);else throw new Error("THREE.GLTFLoader: Primitive mode unsupported: "+m.mode);Object.keys(f.geometry.morphAttributes).length>0&&sy(f,s),f.name=t.createUniqueName(s.name||"mesh_"+e),Ni(f,s),m.extensions&&Mr(r,f,m),t.assignFinalMaterial(f),u.push(f)}for(let p=0,g=u.length;p<g;p++)t.associations.set(u[p],{meshes:e,primitives:p});if(u.length===1)return s.extensions&&Mr(r,u[0],s),u[0];const d=new Cr;s.extensions&&Mr(r,d,s),t.associations.set(d,{meshes:e});for(let p=0,g=u.length;p<g;p++)d.add(u[p]);return d})}loadCamera(e){let t;const n=this.json.cameras[e],r=n[n.type];if(!r){console.warn("THREE.GLTFLoader: Missing camera parameters.");return}return n.type==="perspective"?t=new vn(Nt.radToDeg(r.yfov),r.aspectRatio||1,r.znear||1,r.zfar||2e6):n.type==="orthographic"&&(t=new jl(-r.xmag,r.xmag,r.ymag,-r.ymag,r.znear,r.zfar)),n.name&&(t.name=this.createUniqueName(n.name)),Ni(t,n),Promise.resolve(t)}loadSkin(e){const t=this.json.skins[e],n=[];for(let r=0,s=t.joints.length;r<s;r++)n.push(this._loadNodeShallow(t.joints[r]));return t.inverseBindMatrices!==void 0?n.push(this.getDependency("accessor",t.inverseBindMatrices)):n.push(null),Promise.all(n).then(function(r){const s=r.pop(),o=r,a=[],c=[];for(let l=0,h=o.length;l<h;l++){const u=o[l];if(u){a.push(u);const d=new rt;s!==null&&d.fromArray(s.array,l*16),c.push(d)}else console.warn('THREE.GLTFLoader: Joint "%s" could not be found.',t.joints[l])}return new Ta(a,c)})}loadAnimation(e){const t=this.json,n=this,r=t.animations[e],s=r.name?r.name:"animation_"+e,o=[],a=[],c=[],l=[],h=[];for(let u=0,d=r.channels.length;u<d;u++){const p=r.channels[u],g=r.samplers[p.sampler],b=p.target,m=b.node,f=r.parameters!==void 0?r.parameters[g.input]:g.input,y=r.parameters!==void 0?r.parameters[g.output]:g.output;b.node!==void 0&&(o.push(this.getDependency("node",m)),a.push(this.getDependency("accessor",f)),c.push(this.getDependency("accessor",y)),l.push(g),h.push(b))}return Promise.all([Promise.all(o),Promise.all(a),Promise.all(c),Promise.all(l),Promise.all(h)]).then(function(u){const d=u[0],p=u[1],g=u[2],b=u[3],m=u[4],f=[];for(let y=0,x=d.length;y<x;y++){const _=d[y],I=p[y],L=g[y],C=b[y],F=m[y];if(_===void 0)continue;_.updateMatrix&&_.updateMatrix();const w=n._createAnimationTracks(_,I,L,C,F);if(w)for(let v=0;v<w.length;v++)f.push(w[v])}return new ax(s,void 0,f)})}createNodeMesh(e){const t=this.json,n=this,r=t.nodes[e];return r.mesh===void 0?null:n.getDependency("mesh",r.mesh).then(function(s){const o=n._getNodeRef(n.meshCache,r.mesh,s);return r.weights!==void 0&&o.traverse(function(a){if(a.isMesh)for(let c=0,l=r.weights.length;c<l;c++)a.morphTargetInfluences[c]=r.weights[c]}),o})}loadNode(e){const t=this.json,n=this,r=t.nodes[e],s=n._loadNodeShallow(e),o=[],a=r.children||[];for(let l=0,h=a.length;l<h;l++)o.push(n.getDependency("node",a[l]));const c=r.skin===void 0?Promise.resolve(null):n.getDependency("skin",r.skin);return Promise.all([s,Promise.all(o),c]).then(function(l){const h=l[0],u=l[1],d=l[2];d!==null&&h.traverse(function(p){p.isSkinnedMesh&&p.bind(d,cy)});for(let p=0,g=u.length;p<g;p++)h.add(u[p]);return h})}_loadNodeShallow(e){const t=this.json,n=this.extensions,r=this;if(this.nodeCache[e]!==void 0)return this.nodeCache[e];const s=t.nodes[e],o=s.name?r.createUniqueName(s.name):"",a=[],c=r._invokeOne(function(l){return l.createNodeMesh&&l.createNodeMesh(e)});return c&&a.push(c),s.camera!==void 0&&a.push(r.getDependency("camera",s.camera).then(function(l){return r._getNodeRef(r.cameraCache,s.camera,l)})),r._invokeAll(function(l){return l.createNodeAttachment&&l.createNodeAttachment(e)}).forEach(function(l){a.push(l)}),this.nodeCache[e]=Promise.all(a).then(function(l){let h;if(s.isBone===!0?h=new Yl:l.length>1?h=new Cr:l.length===1?h=l[0]:h=new en,h!==l[0])for(let u=0,d=l.length;u<d;u++)h.add(l[u]);if(s.name&&(h.userData.name=s.name,h.name=o),Ni(h,s),s.extensions&&Mr(n,h,s),s.matrix!==void 0){const u=new rt;u.fromArray(s.matrix),h.applyMatrix4(u)}else s.translation!==void 0&&h.position.fromArray(s.translation),s.rotation!==void 0&&h.quaternion.fromArray(s.rotation),s.scale!==void 0&&h.scale.fromArray(s.scale);return r.associations.has(h)||r.associations.set(h,{}),r.associations.get(h).nodes=e,h}),this.nodeCache[e]}loadScene(e){const t=this.extensions,n=this.json.scenes[e],r=this,s=new Cr;n.name&&(s.name=r.createUniqueName(n.name)),Ni(s,n),n.extensions&&Mr(t,s,n);const o=n.nodes||[],a=[];for(let c=0,l=o.length;c<l;c++)a.push(r.getDependency("node",o[c]));return Promise.all(a).then(function(c){for(let h=0,u=c.length;h<u;h++)s.add(c[h]);const l=h=>{const u=new Map;for(const[d,p]of r.associations)(d instanceof li||d instanceof hn)&&u.set(d,p);return h.traverse(d=>{const p=r.associations.get(d);p!=null&&u.set(d,p)}),u};return r.associations=l(s),s})}_createAnimationTracks(e,t,n,r,s){const o=[],a=e.name?e.name:e.uuid,c=[];er[s.path]===er.weights?e.traverse(function(d){d.morphTargetInfluences&&c.push(d.name?d.name:d.uuid)}):c.push(a);let l;switch(er[s.path]){case er.weights:l=Ss;break;case er.rotation:l=ws;break;case er.position:case er.scale:l=Es;break;default:n.itemSize===1?l=Ss:l=Es;break}const h=r.interpolation!==void 0?ny[r.interpolation]:ro,u=this._getArrayFromAccessor(n);for(let d=0,p=c.length;d<p;d++){const g=new l(c[d]+"."+er[s.path],t.array,u,h);r.interpolation==="CUBICSPLINE"&&this._createCubicSplineTrackInterpolant(g),o.push(g)}return o}_getArrayFromAccessor(e){let t=e.array;if(e.normalized){const n=Pl(t.constructor),r=new Float32Array(t.length);for(let s=0,o=t.length;s<o;s++)r[s]=t[s]*n;t=r}return t}_createCubicSplineTrackInterpolant(e){e.createInterpolant=function(n){const r=this instanceof ws?ty:Zd;return new r(this.times,this.values,this.getValueSize()/3,n)},e.createInterpolant.isInterpolantFactoryMethodGLTFCubicSpline=!0}}function hy(i,e,t){const n=e.attributes,r=new an;if(n.POSITION!==void 0){const a=t.json.accessors[n.POSITION],c=a.min,l=a.max;if(c!==void 0&&l!==void 0){if(r.set(new A(c[0],c[1],c[2]),new A(l[0],l[1],l[2])),a.normalized){const h=Pl(ds[a.componentType]);r.min.multiplyScalar(h),r.max.multiplyScalar(h)}}else{console.warn("THREE.GLTFLoader: Missing min/max properties for accessor POSITION.");return}}else return;const s=e.targets;if(s!==void 0){const a=new A,c=new A;for(let l=0,h=s.length;l<h;l++){const u=s[l];if(u.POSITION!==void 0){const d=t.json.accessors[u.POSITION],p=d.min,g=d.max;if(p!==void 0&&g!==void 0){if(c.setX(Math.max(Math.abs(p[0]),Math.abs(g[0]))),c.setY(Math.max(Math.abs(p[1]),Math.abs(g[1]))),c.setZ(Math.max(Math.abs(p[2]),Math.abs(g[2]))),d.normalized){const b=Pl(ds[d.componentType]);c.multiplyScalar(b)}a.max(c)}else console.warn("THREE.GLTFLoader: Missing min/max properties for accessor POSITION.")}}r.expandByVector(a)}i.boundingBox=r;const o=new xi;r.getCenter(o.center),o.radius=r.min.distanceTo(r.max)/2,i.boundingSphere=o}function ju(i,e,t){const n=e.attributes,r=[];function s(o,a){return t.getDependency("accessor",o).then(function(c){i.setAttribute(a,c)})}for(const o in n){const a=Cl[o]||o.toLowerCase();a in i.attributes||r.push(s(n[o],a))}if(e.indices!==void 0&&!i.index){const o=t.getDependency("accessor",e.indices).then(function(a){i.setIndex(a)});r.push(o)}return Ct.workingColorSpace!==Pn&&"COLOR_0"in n&&console.warn(`THREE.GLTFLoader: Converting vertex colors from "srgb-linear" to "${Ct.workingColorSpace}" not supported.`),Ni(i,e),hy(i,e,t),Promise.all(r).then(function(){return e.targets!==void 0?ry(i,e.targets,t):i})}var uy=(function(){var i="b9H79Tebbbe8Fv9Gbb9Gvuuuuueu9Giuuub9Geueu9Giuuueuikqbeeedddillviebeoweuec:q;iekr;leDo9TW9T9VV95dbH9F9F939H79T9F9J9H229F9Jt9VV7bb8A9TW79O9V9Wt9F9KW9J9V9KW9wWVtW949c919M9MWVbeY9TW79O9V9Wt9F9KW9J9V9KW69U9KW949c919M9MWVbdE9TW79O9V9Wt9F9KW9J9V9KW69U9KW949tWG91W9U9JWbiL9TW79O9V9Wt9F9KW9J9V9KWS9P2tWV9p9JtblK9TW79O9V9Wt9F9KW9J9V9KWS9P2tWV9r919HtbvL9TW79O9V9Wt9F9KW9J9V9KWS9P2tWVT949Wbol79IV9Rbrq:P8Yqdbk;3sezu8Jjjjjbcj;eb9Rgv8Kjjjjbc9:hodnadcefal0mbcuhoaiRbbc:Ge9hmbavaialfgrad9Radz1jjjbhwcj;abad9UhoaicefhldnadTmbaoc;WFbGgocjdaocjd6EhDcbhqinaqae9pmeaDaeaq9RaqaDfae6Egkcsfgocl4cifcd4hxdndndndnaoc9WGgmTmbcbhPcehsawcjdfhzalhHinaraH9Rax6midnaraHaxfgl9RcK6mbczhoinawcj;cbfaogifgoc9WfhOdndndndndnaHaic9WfgAco4fRbbaAci4coG4ciGPlbedibkaO9cb83ibaOcwf9cb83ibxikaOalRblalRbbgAco4gCaCciSgCE86bbaocGfalclfaCfgORbbaAcl4ciGgCaCciSgCE86bbaocVfaOaCfgORbbaAcd4ciGgCaCciSgCE86bbaoc7faOaCfgORbbaAciGgAaAciSgAE86bbaoctfaOaAfgARbbalRbegOco4gCaCciSgCE86bbaoc91faAaCfgARbbaOcl4ciGgCaCciSgCE86bbaoc4faAaCfgARbbaOcd4ciGgCaCciSgCE86bbaoc93faAaCfgARbbaOciGgOaOciSgOE86bbaoc94faAaOfgARbbalRbdgOco4gCaCciSgCE86bbaoc95faAaCfgARbbaOcl4ciGgCaCciSgCE86bbaoc96faAaCfgARbbaOcd4ciGgCaCciSgCE86bbaoc97faAaCfgARbbaOciGgOaOciSgOE86bbaoc98faAaOfgORbbalRbiglco4gAaAciSgAE86bbaoc99faOaAfgORbbalcl4ciGgAaAciSgAE86bbaoc9:faOaAfgORbbalcd4ciGgAaAciSgAE86bbaocufaOaAfgoRbbalciGglalciSglE86bbaoalfhlxdkaOalRbwalRbbgAcl4gCaCcsSgCE86bbaocGfalcwfaCfgORbbaAcsGgAaAcsSgAE86bbaocVfaOaAfgORbbalRbegAcl4gCaCcsSgCE86bbaoc7faOaCfgORbbaAcsGgAaAcsSgAE86bbaoctfaOaAfgORbbalRbdgAcl4gCaCcsSgCE86bbaoc91faOaCfgORbbaAcsGgAaAcsSgAE86bbaoc4faOaAfgORbbalRbigAcl4gCaCcsSgCE86bbaoc93faOaCfgORbbaAcsGgAaAcsSgAE86bbaoc94faOaAfgORbbalRblgAcl4gCaCcsSgCE86bbaoc95faOaCfgORbbaAcsGgAaAcsSgAE86bbaoc96faOaAfgORbbalRbvgAcl4gCaCcsSgCE86bbaoc97faOaCfgORbbaAcsGgAaAcsSgAE86bbaoc98faOaAfgORbbalRbogAcl4gCaCcsSgCE86bbaoc99faOaCfgORbbaAcsGgAaAcsSgAE86bbaoc9:faOaAfgORbbalRbrglcl4gAaAcsSgAE86bbaocufaOaAfgoRbbalcsGglalcsSglE86bbaoalfhlxekaOal8Pbb83bbaOcwfalcwf8Pbb83bbalczfhlkdnaiam9pmbaiczfhoaral9RcL0mekkaiam6mialTmidnakTmbawaPfRbbhOcbhoazhiinaiawcj;cbfaofRbbgAce4cbaAceG9R7aOfgO86bbaiadfhiaocefgoak9hmbkkazcefhzaPcefgPad6hsalhHaPad9hmexvkkcbhlasceGmdxikalaxad2fhCdnakTmbcbhHcehsawcjdfhminaral9Rax6mialTmdalaxfhlawaHfRbbhOcbhoamhiinaiawcj;cbfaofRbbgAce4cbaAceG9R7aOfgO86bbaiadfhiaocefgoak9hmbkamcefhmaHcefgHad6hsaHad9hmbkaChlxikcbhocehsinaral9Rax6mdalTmealaxfhlaocefgoad6hsadao9hmbkaChlxdkcbhlasceGTmekc9:hoxikabaqad2fawcjdfakad2z1jjjb8Aawawcjdfakcufad2fadz1jjjb8Aakaqfhqalmbkc9:hoxekcbc99aral9Radcaadca0ESEhokavcj;ebf8Kjjjjbaok;yzeHu8Jjjjjbc;ae9Rgv8Kjjjjbc9:hodnaeci9UgrcHfal0mbcuhoaiRbbgwc;WeGc;Ge9hmbawcsGgDce0mbavc;abfcFecjez:jjjjb8AavcUf9cu83ibavc8Wf9cu83ibavcyf9cu83ibavcaf9cu83ibavcKf9cu83ibavczf9cu83ibav9cu83iwav9cu83ibaialfc9WfhqaicefgwarfhodnaeTmbcmcsaDceSEhkcbhxcbhmcbhDcbhicbhlindnaoaq9nmbc9:hoxikdndnawRbbgrc;Ve0mbavc;abfalarcl4cu7fcsGcitfgPydlhsaPydbhzdnarcsGgPak9pmbavaiarcu7fcsGcdtfydbaxaPEhraPThPdndnadcd9hmbabaDcetfgHaz87ebaHcdfas87ebaHclfar87ebxekabaDcdtfgHazBdbaHclfasBdbaHcwfarBdbkaxaPfhxavc;abfalcitfgHarBdbaHasBdlavaicdtfarBdbavc;abfalcefcsGglcitfgHazBdbaHarBdlaiaPfhialcefhlxdkdndnaPcsSmbamaPfaPc987fcefhmxekaocefhrao8SbbgPcFeGhHdndnaPcu9mmbarhoxekaocvfhoaHcFbGhHcrhPdninar8SbbgOcFbGaPtaHVhHaOcu9kmearcefhraPcrfgPc8J9hmbxdkkarcefhokaHce4cbaHceG9R7amfhmkdndnadcd9hmbabaDcetfgraz87ebarcdfas87ebarclfam87ebxekabaDcdtfgrazBdbarclfasBdbarcwfamBdbkavc;abfalcitfgramBdbarasBdlavaicdtfamBdbavc;abfalcefcsGglcitfgrazBdbaramBdlaicefhialcefhlxekdnarcpe0mbaxcefgOavaiaqarcsGfRbbgPcl49RcsGcdtfydbaPcz6gHEhravaiaP9RcsGcdtfydbaOaHfgsaPcsGgOEhPaOThOdndnadcd9hmbabaDcetfgzax87ebazcdfar87ebazclfaP87ebxekabaDcdtfgzaxBdbazclfarBdbazcwfaPBdbkavaicdtfaxBdbavc;abfalcitfgzarBdbazaxBdlavaicefgicsGcdtfarBdbavc;abfalcefcsGcitfgzaPBdbazarBdlavaiaHfcsGgicdtfaPBdbavc;abfalcdfcsGglcitfgraxBdbaraPBdlalcefhlaiaOfhiasaOfhxxekaxcbaoRbbgzEgAarc;:eSgrfhsazcsGhCazcl4hXdndnazcs0mbascefhOxekashOavaiaX9RcsGcdtfydbhskdndnaCmbaOcefhxxekaOhxavaiaz9RcsGcdtfydbhOkdndnarTmbaocefhrxekaocdfhrao8SbegHcFeGhPdnaHcu9kmbaocofhAaPcFbGhPcrhodninar8SbbgHcFbGaotaPVhPaHcu9kmearcefhraocrfgoc8J9hmbkaAhrxekarcefhrkaPce4cbaPceG9R7amfgmhAkdndnaXcsSmbarhPxekarcefhPar8SbbgocFeGhHdnaocu9kmbarcvfhsaHcFbGhHcrhodninaP8SbbgrcFbGaotaHVhHarcu9kmeaPcefhPaocrfgoc8J9hmbkashPxekaPcefhPkaHce4cbaHceG9R7amfgmhskdndnaCcsSmbaPhoxekaPcefhoaP8SbbgrcFeGhHdnarcu9kmbaPcvfhOaHcFbGhHcrhrdninao8SbbgPcFbGartaHVhHaPcu9kmeaocefhoarcrfgrc8J9hmbkaOhoxekaocefhokaHce4cbaHceG9R7amfgmhOkdndnadcd9hmbabaDcetfgraA87ebarcdfas87ebarclfaO87ebxekabaDcdtfgraABdbarclfasBdbarcwfaOBdbkavc;abfalcitfgrasBdbaraABdlavaicdtfaABdbavc;abfalcefcsGcitfgraOBdbarasBdlavaicefgicsGcdtfasBdbavc;abfalcdfcsGcitfgraABdbaraOBdlavaiazcz6aXcsSVfgicsGcdtfaOBdbaiaCTaCcsSVfhialcifhlkawcefhwalcsGhlaicsGhiaDcifgDae6mbkkcbc99aoaqSEhokavc;aef8Kjjjjbaok:llevu8Jjjjjbcz9Rhvc9:hodnaecvfal0mbcuhoaiRbbc;:eGc;qe9hmbav9cb83iwaicefhraialfc98fhwdnaeTmbdnadcdSmbcbhDindnaraw6mbc9:skarcefhoar8SbbglcFeGhidndnalcu9mmbaohrxekarcvfhraicFbGhicrhldninao8SbbgdcFbGaltaiVhiadcu9kmeaocefhoalcrfglc8J9hmbxdkkaocefhrkabaDcdtfaicd4cbaice4ceG9R7avcwfaiceGcdtVgoydbfglBdbaoalBdbaDcefgDae9hmbxdkkcbhDindnaraw6mbc9:skarcefhoar8SbbglcFeGhidndnalcu9mmbaohrxekarcvfhraicFbGhicrhldninao8SbbgdcFbGaltaiVhiadcu9kmeaocefhoalcrfglc8J9hmbxdkkaocefhrkabaDcetfaicd4cbaice4ceG9R7avcwfaiceGcdtVgoydbfgl87ebaoalBdbaDcefgDae9hmbkkcbc99arawSEhokaok:Lvoeue99dud99eud99dndnadcl9hmbaeTmeindndnabcdfgd8Sbb:Yab8Sbbgi:Ygl:l:tabcefgv8Sbbgo:Ygr:l:tgwJbb;:9cawawNJbbbbawawJbbbb9GgDEgq:mgkaqaicb9iEalMgwawNakaqaocb9iEarMgqaqNMM:r:vglNJbbbZJbbb:;aDEMgr:lJbbb9p9DTmbar:Ohixekcjjjj94hikadai86bbdndnaqalNJbbbZJbbb:;aqJbbbb9GEMgq:lJbbb9p9DTmbaq:Ohdxekcjjjj94hdkavad86bbdndnawalNJbbbZJbbb:;awJbbbb9GEMgw:lJbbb9p9DTmbaw:Ohdxekcjjjj94hdkabad86bbabclfhbaecufgembxdkkaeTmbindndnabclfgd8Ueb:Yab8Uebgi:Ygl:l:tabcdfgv8Uebgo:Ygr:l:tgwJb;:FSawawNJbbbbawawJbbbb9GgDEgq:mgkaqaicb9iEalMgwawNakaqaocb9iEarMgqaqNMM:r:vglNJbbbZJbbb:;aDEMgr:lJbbb9p9DTmbar:Ohixekcjjjj94hikadai87ebdndnaqalNJbbbZJbbb:;aqJbbbb9GEMgq:lJbbb9p9DTmbaq:Ohdxekcjjjj94hdkavad87ebdndnawalNJbbbZJbbb:;awJbbbb9GEMgw:lJbbb9p9DTmbaw:Ohdxekcjjjj94hdkabad87ebabcwfhbaecufgembkkk;siliui99iue99dnaeTmbcbhiabhlindndnJ;Zl81Zalcof8UebgvciV:Y:vgoal8Ueb:YNgrJb;:FSNJbbbZJbbb:;arJbbbb9GEMgw:lJbbb9p9DTmbaw:OhDxekcjjjj94hDkalclf8Uebhqalcdf8UebhkabavcefciGaiVcetfaD87ebdndnaoak:YNgwJb;:FSNJbbbZJbbb:;awJbbbb9GEMgx:lJbbb9p9DTmbax:Ohkxekcjjjj94hkkabavcdfciGaiVcetfak87ebdndnaoaq:YNgoJb;:FSNJbbbZJbbb:;aoJbbbb9GEMgx:lJbbb9p9DTmbax:Ohqxekcjjjj94hqkabavcufciGaiVcetfaq87ebdndnJbbjZararN:tawawN:taoaoN:tgrJbbbbarJbbbb9GE:rJb;:FSNJbbbZMgr:lJbbb9p9DTmbar:Ohqxekcjjjj94hqkabavciGaiVcetfaq87ebalcwfhlaiclfhiaecufgembkkk9mbdnadcd4ae2geTmbinababydbgdcwtcw91:Yadce91cjjj;8ifcjjj98G::NUdbabclfhbaecufgembkkk9teiucbcbydj1jjbgeabcifc98GfgbBdj1jjbdndnabZbcztgd9nmbcuhiabad9RcFFifcz4nbcuSmekaehikaik;LeeeudndnaeabVciGTmbabhixekdndnadcz9pmbabhixekabhiinaiaeydbBdbaiclfaeclfydbBdbaicwfaecwfydbBdbaicxfaecxfydbBdbaiczfhiaeczfheadc9Wfgdcs0mbkkadcl6mbinaiaeydbBdbaeclfheaiclfhiadc98fgdci0mbkkdnadTmbinaiaeRbb86bbaicefhiaecefheadcufgdmbkkabk;aeedudndnabciGTmbabhixekaecFeGc:b:c:ew2hldndnadcz9pmbabhixekabhiinaialBdbaicxfalBdbaicwfalBdbaiclfalBdbaiczfhiadc9Wfgdcs0mbkkadcl6mbinaialBdbaiclfhiadc98fgdci0mbkkdnadTmbinaiae86bbaicefhiadcufgdmbkkabkkkebcjwklz9Kbb",e="b9H79TebbbeKl9Gbb9Gvuuuuueu9Giuuub9Geueuikqbbebeedddilve9Weeeviebeoweuec:q;Aekr;leDo9TW9T9VV95dbH9F9F939H79T9F9J9H229F9Jt9VV7bb8A9TW79O9V9Wt9F9KW9J9V9KW9wWVtW949c919M9MWVbdY9TW79O9V9Wt9F9KW9J9V9KW69U9KW949c919M9MWVblE9TW79O9V9Wt9F9KW9J9V9KW69U9KW949tWG91W9U9JWbvL9TW79O9V9Wt9F9KW9J9V9KWS9P2tWV9p9JtboK9TW79O9V9Wt9F9KW9J9V9KWS9P2tWV9r919HtbrL9TW79O9V9Wt9F9KW9J9V9KWS9P2tWVT949Wbwl79IV9RbDq;t9tqlbzik9:evu8Jjjjjbcz9Rhbcbheincbhdcbhiinabcwfadfaicjuaead4ceGglE86bbaialfhiadcefgdcw9hmbkaec:q:yjjbfai86bbaecitc:q1jjbfab8Piw83ibaecefgecjd9hmbkk;h8JlHud97euo978Jjjjjbcj;kb9Rgv8Kjjjjbc9:hodnadcefal0mbcuhoaiRbbc:Ge9hmbavaialfgrad9Rad;8qbbcj;abad9UhoaicefhldnadTmbaoc;WFbGgocjdaocjd6EhwcbhDinaDae9pmeawaeaD9RaDawfae6Egqcsfgoc9WGgkci2hxakcethmaocl4cifcd4hPabaDad2fhscbhzdnincehHalhOcbhAdninaraO9RaP6miavcj;cbfaAak2fhCaOaPfhlcbhidnakc;ab6mbaral9Rc;Gb6mbcbhoinaCaofhidndndndndnaOaoco4fRbbgXciGPlbedibkaipxbbbbbbbbbbbbbbbbpklbxikaialpbblalpbbbgQclp:meaQpmbzeHdOiAlCvXoQrLgQcdp:meaQpmbzeHdOiAlCvXoQrLpxiiiiiiiiiiiiiiiip9ogLpxiiiiiiiiiiiiiiiip8JgQp5b9cjF;8;4;W;G;ab9:9cU1:NgKcitc:q1jjbfpbibaKc:q:yjjbfpbbbgYaYpmbbbbbbbbbbbbbbbbaQp5e9cjF;8;4;W;G;ab9:9cU1:NgKcitc:q1jjbfpbibp9UpmbedilvorzHOACXQLpPaLaQp9spklbalclfaYpQbfaKc:q:yjjbfRbbfhlxdkaialpbbwalpbbbgQclp:meaQpmbzeHdOiAlCvXoQrLpxssssssssssssssssp9ogLpxssssssssssssssssp8JgQp5b9cjF;8;4;W;G;ab9:9cU1:NgKcitc:q1jjbfpbibaKc:q:yjjbfpbbbgYaYpmbbbbbbbbbbbbbbbbaQp5e9cjF;8;4;W;G;ab9:9cU1:NgKcitc:q1jjbfpbibp9UpmbedilvorzHOACXQLpPaLaQp9spklbalcwfaYpQbfaKc:q:yjjbfRbbfhlxekaialpbbbpklbalczfhlkdndndndndnaXcd4ciGPlbedibkaipxbbbbbbbbbbbbbbbbpklzxikaialpbblalpbbbgQclp:meaQpmbzeHdOiAlCvXoQrLgQcdp:meaQpmbzeHdOiAlCvXoQrLpxiiiiiiiiiiiiiiiip9ogLpxiiiiiiiiiiiiiiiip8JgQp5b9cjF;8;4;W;G;ab9:9cU1:NgKcitc:q1jjbfpbibaKc:q:yjjbfpbbbgYaYpmbbbbbbbbbbbbbbbbaQp5e9cjF;8;4;W;G;ab9:9cU1:NgKcitc:q1jjbfpbibp9UpmbedilvorzHOACXQLpPaLaQp9spklzalclfaYpQbfaKc:q:yjjbfRbbfhlxdkaialpbbwalpbbbgQclp:meaQpmbzeHdOiAlCvXoQrLpxssssssssssssssssp9ogLpxssssssssssssssssp8JgQp5b9cjF;8;4;W;G;ab9:9cU1:NgKcitc:q1jjbfpbibaKc:q:yjjbfpbbbgYaYpmbbbbbbbbbbbbbbbbaQp5e9cjF;8;4;W;G;ab9:9cU1:NgKcitc:q1jjbfpbibp9UpmbedilvorzHOACXQLpPaLaQp9spklzalcwfaYpQbfaKc:q:yjjbfRbbfhlxekaialpbbbpklzalczfhlkdndndndndnaXcl4ciGPlbedibkaipxbbbbbbbbbbbbbbbbpklaxikaialpbblalpbbbgQclp:meaQpmbzeHdOiAlCvXoQrLgQcdp:meaQpmbzeHdOiAlCvXoQrLpxiiiiiiiiiiiiiiiip9ogLpxiiiiiiiiiiiiiiiip8JgQp5b9cjF;8;4;W;G;ab9:9cU1:NgKcitc:q1jjbfpbibaKc:q:yjjbfpbbbgYaYpmbbbbbbbbbbbbbbbbaQp5e9cjF;8;4;W;G;ab9:9cU1:NgKcitc:q1jjbfpbibp9UpmbedilvorzHOACXQLpPaLaQp9spklaalclfaYpQbfaKc:q:yjjbfRbbfhlxdkaialpbbwalpbbbgQclp:meaQpmbzeHdOiAlCvXoQrLpxssssssssssssssssp9ogLpxssssssssssssssssp8JgQp5b9cjF;8;4;W;G;ab9:9cU1:NgKcitc:q1jjbfpbibaKc:q:yjjbfpbbbgYaYpmbbbbbbbbbbbbbbbbaQp5e9cjF;8;4;W;G;ab9:9cU1:NgKcitc:q1jjbfpbibp9UpmbedilvorzHOACXQLpPaLaQp9spklaalcwfaYpQbfaKc:q:yjjbfRbbfhlxekaialpbbbpklaalczfhlkdndndndndnaXco4Plbedibkaipxbbbbbbbbbbbbbbbbpkl8WxikaialpbblalpbbbgQclp:meaQpmbzeHdOiAlCvXoQrLgQcdp:meaQpmbzeHdOiAlCvXoQrLpxiiiiiiiiiiiiiiiip9ogLpxiiiiiiiiiiiiiiiip8JgQp5b9cjF;8;4;W;G;ab9:9cU1:NgXcitc:q1jjbfpbibaXc:q:yjjbfpbbbgYaYpmbbbbbbbbbbbbbbbbaQp5e9cjF;8;4;W;G;ab9:9cU1:NgXcitc:q1jjbfpbibp9UpmbedilvorzHOACXQLpPaLaQp9spkl8WalclfaYpQbfaXc:q:yjjbfRbbfhlxdkaialpbbwalpbbbgQclp:meaQpmbzeHdOiAlCvXoQrLpxssssssssssssssssp9ogLpxssssssssssssssssp8JgQp5b9cjF;8;4;W;G;ab9:9cU1:NgXcitc:q1jjbfpbibaXc:q:yjjbfpbbbgYaYpmbbbbbbbbbbbbbbbbaQp5e9cjF;8;4;W;G;ab9:9cU1:NgXcitc:q1jjbfpbibp9UpmbedilvorzHOACXQLpPaLaQp9spkl8WalcwfaYpQbfaXc:q:yjjbfRbbfhlxekaialpbbbpkl8Walczfhlkaoc;abfhiaocjefak0meaihoaral9Rc;Fb0mbkkdndnaiak9pmbaici4hoinaral9RcK6mdaCaifhXdndndndndnaOaico4fRbbaocoG4ciGPlbedibkaXpxbbbbbbbbbbbbbbbbpklbxikaXalpbblalpbbbgQclp:meaQpmbzeHdOiAlCvXoQrLgQcdp:meaQpmbzeHdOiAlCvXoQrLpxiiiiiiiiiiiiiiiip9ogLpxiiiiiiiiiiiiiiiip8JgQp5b9cjF;8;4;W;G;ab9:9cU1:NgKcitc:q1jjbfpbibaKc:q:yjjbfpbbbgYaYpmbbbbbbbbbbbbbbbbaQp5e9cjF;8;4;W;G;ab9:9cU1:NgKcitc:q1jjbfpbibp9UpmbedilvorzHOACXQLpPaLaQp9spklbalclfaYpQbfaKc:q:yjjbfRbbfhlxdkaXalpbbwalpbbbgQclp:meaQpmbzeHdOiAlCvXoQrLpxssssssssssssssssp9ogLpxssssssssssssssssp8JgQp5b9cjF;8;4;W;G;ab9:9cU1:NgKcitc:q1jjbfpbibaKc:q:yjjbfpbbbgYaYpmbbbbbbbbbbbbbbbbaQp5e9cjF;8;4;W;G;ab9:9cU1:NgKcitc:q1jjbfpbibp9UpmbedilvorzHOACXQLpPaLaQp9spklbalcwfaYpQbfaKc:q:yjjbfRbbfhlxekaXalpbbbpklbalczfhlkaocdfhoaiczfgiak6mbkkalTmbaAci6hHalhOaAcefgohAaoclSmdxekkcbhlaHceGmdkdnakTmbavcjdfazfhiavazfpbdbhYcbhXinaiavcj;cbfaXfgopblbgLcep9TaLpxeeeeeeeeeeeeeeeegQp9op9Hp9rgLaoakfpblbg8Acep9Ta8AaQp9op9Hp9rg8ApmbzeHdOiAlCvXoQrLgEaoamfpblbg3cep9Ta3aQp9op9Hp9rg3aoaxfpblbg5cep9Ta5aQp9op9Hp9rg5pmbzeHdOiAlCvXoQrLg8EpmbezHdiOAlvCXorQLgQaQpmbedibedibedibediaYp9UgYp9AdbbaiadfgoaYaQaQpmlvorlvorlvorlvorp9UgYp9AdbbaoadfgoaYaQaQpmwDqkwDqkwDqkwDqkp9UgYp9AdbbaoadfgoaYaQaQpmxmPsxmPsxmPsxmPsp9UgYp9AdbbaoadfgoaYaEa8EpmwDKYqk8AExm35Ps8E8FgQaQpmbedibedibedibedip9UgYp9AdbbaoadfgoaYaQaQpmlvorlvorlvorlvorp9UgYp9AdbbaoadfgoaYaQaQpmwDqkwDqkwDqkwDqkp9UgYp9AdbbaoadfgoaYaQaQpmxmPsxmPsxmPsxmPsp9UgYp9AdbbaoadfgoaYaLa8ApmwKDYq8AkEx3m5P8Es8FgLa3a5pmwKDYq8AkEx3m5P8Es8Fg8ApmbezHdiOAlvCXorQLgQaQpmbedibedibedibedip9UgYp9AdbbaoadfgoaYaQaQpmlvorlvorlvorlvorp9UgYp9AdbbaoadfgoaYaQaQpmwDqkwDqkwDqkwDqkp9UgYp9AdbbaoadfgoaYaQaQpmxmPsxmPsxmPsxmPsp9UgYp9AdbbaoadfgoaYaLa8ApmwDKYqk8AExm35Ps8E8FgQaQpmbedibedibedibedip9UgYp9AdbbaoadfgoaYaQaQpmlvorlvorlvorlvorp9UgYp9AdbbaoadfgoaYaQaQpmwDqkwDqkwDqkwDqkp9UgYp9AdbbaoadfgoaYaQaQpmxmPsxmPsxmPsxmPsp9UgYp9AdbbaoadfhiaXczfgXak6mbkkazclfgzad6mbkasavcjdfaqad2;8qbbavavcjdfaqcufad2fad;8qbbaqaDfhDc9:hoalmexikkc9:hoxekcbc99aral9Radcaadca0ESEhokavcj;kbf8Kjjjjbaokwbz:bjjjbk;uzeHu8Jjjjjbc;ae9Rgv8Kjjjjbc9:hodnaeci9UgrcHfal0mbcuhoaiRbbgwc;WeGc;Ge9hmbawcsGgDce0mbavc;abfcFecje;8kbavcUf9cu83ibavc8Wf9cu83ibavcyf9cu83ibavcaf9cu83ibavcKf9cu83ibavczf9cu83ibav9cu83iwav9cu83ibaialfc9WfhqaicefgwarfhodnaeTmbcmcsaDceSEhkcbhxcbhmcbhDcbhicbhlindnaoaq9nmbc9:hoxikdndnawRbbgrc;Ve0mbavc;abfalarcl4cu7fcsGcitfgPydlhsaPydbhzdnarcsGgPak9pmbavaiarcu7fcsGcdtfydbaxaPEhraPThPdndnadcd9hmbabaDcetfgHaz87ebaHcdfas87ebaHclfar87ebxekabaDcdtfgHazBdbaHclfasBdbaHcwfarBdbkaxaPfhxavc;abfalcitfgHarBdbaHasBdlavaicdtfarBdbavc;abfalcefcsGglcitfgHazBdbaHarBdlaiaPfhialcefhlxdkdndnaPcsSmbamaPfaPc987fcefhmxekaocefhrao8SbbgPcFeGhHdndnaPcu9mmbarhoxekaocvfhoaHcFbGhHcrhPdninar8SbbgOcFbGaPtaHVhHaOcu9kmearcefhraPcrfgPc8J9hmbxdkkarcefhokaHce4cbaHceG9R7amfhmkdndnadcd9hmbabaDcetfgraz87ebarcdfas87ebarclfam87ebxekabaDcdtfgrazBdbarclfasBdbarcwfamBdbkavc;abfalcitfgramBdbarasBdlavaicdtfamBdbavc;abfalcefcsGglcitfgrazBdbaramBdlaicefhialcefhlxekdnarcpe0mbaxcefgOavaiaqarcsGfRbbgPcl49RcsGcdtfydbaPcz6gHEhravaiaP9RcsGcdtfydbaOaHfgsaPcsGgOEhPaOThOdndnadcd9hmbabaDcetfgzax87ebazcdfar87ebazclfaP87ebxekabaDcdtfgzaxBdbazclfarBdbazcwfaPBdbkavaicdtfaxBdbavc;abfalcitfgzarBdbazaxBdlavaicefgicsGcdtfarBdbavc;abfalcefcsGcitfgzaPBdbazarBdlavaiaHfcsGgicdtfaPBdbavc;abfalcdfcsGglcitfgraxBdbaraPBdlalcefhlaiaOfhiasaOfhxxekaxcbaoRbbgzEgAarc;:eSgrfhsazcsGhCazcl4hXdndnazcs0mbascefhOxekashOavaiaX9RcsGcdtfydbhskdndnaCmbaOcefhxxekaOhxavaiaz9RcsGcdtfydbhOkdndnarTmbaocefhrxekaocdfhrao8SbegHcFeGhPdnaHcu9kmbaocofhAaPcFbGhPcrhodninar8SbbgHcFbGaotaPVhPaHcu9kmearcefhraocrfgoc8J9hmbkaAhrxekarcefhrkaPce4cbaPceG9R7amfgmhAkdndnaXcsSmbarhPxekarcefhPar8SbbgocFeGhHdnaocu9kmbarcvfhsaHcFbGhHcrhodninaP8SbbgrcFbGaotaHVhHarcu9kmeaPcefhPaocrfgoc8J9hmbkashPxekaPcefhPkaHce4cbaHceG9R7amfgmhskdndnaCcsSmbaPhoxekaPcefhoaP8SbbgrcFeGhHdnarcu9kmbaPcvfhOaHcFbGhHcrhrdninao8SbbgPcFbGartaHVhHaPcu9kmeaocefhoarcrfgrc8J9hmbkaOhoxekaocefhokaHce4cbaHceG9R7amfgmhOkdndnadcd9hmbabaDcetfgraA87ebarcdfas87ebarclfaO87ebxekabaDcdtfgraABdbarclfasBdbarcwfaOBdbkavc;abfalcitfgrasBdbaraABdlavaicdtfaABdbavc;abfalcefcsGcitfgraOBdbarasBdlavaicefgicsGcdtfasBdbavc;abfalcdfcsGcitfgraABdbaraOBdlavaiazcz6aXcsSVfgicsGcdtfaOBdbaiaCTaCcsSVfhialcifhlkawcefhwalcsGhlaicsGhiaDcifgDae6mbkkcbc99aoaqSEhokavc;aef8Kjjjjbaok:llevu8Jjjjjbcz9Rhvc9:hodnaecvfal0mbcuhoaiRbbc;:eGc;qe9hmbav9cb83iwaicefhraialfc98fhwdnaeTmbdnadcdSmbcbhDindnaraw6mbc9:skarcefhoar8SbbglcFeGhidndnalcu9mmbaohrxekarcvfhraicFbGhicrhldninao8SbbgdcFbGaltaiVhiadcu9kmeaocefhoalcrfglc8J9hmbxdkkaocefhrkabaDcdtfaicd4cbaice4ceG9R7avcwfaiceGcdtVgoydbfglBdbaoalBdbaDcefgDae9hmbxdkkcbhDindnaraw6mbc9:skarcefhoar8SbbglcFeGhidndnalcu9mmbaohrxekarcvfhraicFbGhicrhldninao8SbbgdcFbGaltaiVhiadcu9kmeaocefhoalcrfglc8J9hmbxdkkaocefhrkabaDcetfaicd4cbaice4ceG9R7avcwfaiceGcdtVgoydbfgl87ebaoalBdbaDcefgDae9hmbkkcbc99arawSEhokaok:EPliuo97eue978Jjjjjbca9Rhidndnadcl9hmbdnaec98GglTmbcbhvabhdinadadpbbbgocKp:RecKp:Sep;6egraocwp:RecKp:Sep;6earp;Geaoczp:RecKp:Sep;6egwp;Gep;Kep;LegDpxbbbbbbbbbbbbbbbbp:2egqarpxbbbjbbbjbbbjbbbjgkp9op9rp;Kegrpxbb;:9cbb;:9cbb;:9cbb;:9cararp;MeaDaDp;Meawaqawakp9op9rp;Kegrarp;Mep;Kep;Kep;Jep;Negwp;Mepxbbn0bbn0bbn0bbn0gqp;KepxFbbbFbbbFbbbFbbbp9oaopxbbbFbbbFbbbFbbbFp9op9qarawp;Meaqp;Kecwp:RepxbFbbbFbbbFbbbFbbp9op9qaDawp;Meaqp;Keczp:RepxbbFbbbFbbbFbbbFbp9op9qpkbbadczfhdavclfgval6mbkkalae9pmeaiaeciGgvcdtgdVcbczad9R;8kbaiabalcdtfglad;8qbbdnavTmbaiaipblbgocKp:RecKp:Sep;6egraocwp:RecKp:Sep;6earp;Geaoczp:RecKp:Sep;6egwp;Gep;Kep;LegDpxbbbbbbbbbbbbbbbbp:2egqarpxbbbjbbbjbbbjbbbjgkp9op9rp;Kegrpxbb;:9cbb;:9cbb;:9cbb;:9cararp;MeaDaDp;Meawaqawakp9op9rp;Kegrarp;Mep;Kep;Kep;Jep;Negwp;Mepxbbn0bbn0bbn0bbn0gqp;KepxFbbbFbbbFbbbFbbbp9oaopxbbbFbbbFbbbFbbbFp9op9qarawp;Meaqp;Kecwp:RepxbFbbbFbbbFbbbFbbp9op9qaDawp;Meaqp;Keczp:RepxbbFbbbFbbbFbbbFbp9op9qpklbkalaiad;8qbbskdnaec98GgxTmbcbhvabhdinadczfglalpbbbgopxbbbbbbFFbbbbbbFFgkp9oadpbbbgDaopmlvorxmPsCXQL358E8FpxFubbFubbFubbFubbp9op;6eaDaopmbediwDqkzHOAKY8AEgoczp:Sep;6egrp;Geaoczp:Reczp:Sep;6egwp;Gep;Kep;Legopxb;:FSb;:FSb;:FSb;:FSawaopxbbbbbbbbbbbbbbbbp:2egqawpxbbbjbbbjbbbjbbbjgmp9op9rp;Kegwawp;Meaoaop;Mearaqaramp9op9rp;Kegoaop;Mep;Kep;Kep;Jep;Negrp;Mepxbbn0bbn0bbn0bbn0gqp;Keczp:Reawarp;Meaqp;KepxFFbbFFbbFFbbFFbbp9op9qgwaoarp;Meaqp;KepxFFbbFFbbFFbbFFbbp9ogopmwDKYqk8AExm35Ps8E8Fp9qpkbbadaDakp9oawaopmbezHdiOAlvCXorQLp9qpkbbadcafhdavclfgvax6mbkkaxae9pmbaiaeciGgvcitgdfcbcaad9R;8kbaiabaxcitfglad;8qbbdnavTmbaiaipblzgopxbbbbbbFFbbbbbbFFgkp9oaipblbgDaopmlvorxmPsCXQL358E8FpxFubbFubbFubbFubbp9op;6eaDaopmbediwDqkzHOAKY8AEgoczp:Sep;6egrp;Geaoczp:Reczp:Sep;6egwp;Gep;Kep;Legopxb;:FSb;:FSb;:FSb;:FSawaopxbbbbbbbbbbbbbbbbp:2egqawpxbbbjbbbjbbbjbbbjgmp9op9rp;Kegwawp;Meaoaop;Mearaqaramp9op9rp;Kegoaop;Mep;Kep;Kep;Jep;Negrp;Mepxbbn0bbn0bbn0bbn0gqp;Keczp:Reawarp;Meaqp;KepxFFbbFFbbFFbbFFbbp9op9qgwaoarp;Meaqp;KepxFFbbFFbbFFbbFFbbp9ogopmwDKYqk8AExm35Ps8E8Fp9qpklzaiaDakp9oawaopmbezHdiOAlvCXorQLp9qpklbkalaiad;8qbbkk;4wllue97euv978Jjjjjbc8W9Rhidnaec98GglTmbcbhvabhoinaiaopbbbgraoczfgwpbbbgDpmlvorxmPsCXQL358E8Fgqczp:Segkclp:RepklbaopxbbjZbbjZbbjZbbjZpx;Zl81Z;Zl81Z;Zl81Z;Zl81Zakpxibbbibbbibbbibbbp9qp;6ep;NegkaraDpmbediwDqkzHOAKY8AEgrczp:Reczp:Sep;6ep;MegDaDp;Meakarczp:Sep;6ep;Megxaxp;Meakaqczp:Reczp:Sep;6ep;Megqaqp;Mep;Kep;Kep;Lepxbbbbbbbbbbbbbbbbp:4ep;Jepxb;:FSb;:FSb;:FSb;:FSgkp;Mepxbbn0bbn0bbn0bbn0grp;KepxFFbbFFbbFFbbFFbbgmp9oaxakp;Mearp;Keczp:Rep9qgxaqakp;Mearp;Keczp:ReaDakp;Mearp;Keamp9op9qgkpmbezHdiOAlvCXorQLgrp5baipblbpEb:T:j83ibaocwfarp5eaipblbpEe:T:j83ibawaxakpmwDKYqk8AExm35Ps8E8Fgkp5baipblbpEd:T:j83ibaocKfakp5eaipblbpEi:T:j83ibaocafhoavclfgval6mbkkdnalae9pmbaiaeciGgvcitgofcbcaao9R;8kbaiabalcitfgwao;8qbbdnavTmbaiaipblbgraipblzgDpmlvorxmPsCXQL358E8Fgqczp:Segkclp:RepklaaipxbbjZbbjZbbjZbbjZpx;Zl81Z;Zl81Z;Zl81Z;Zl81Zakpxibbbibbbibbbibbbp9qp;6ep;NegkaraDpmbediwDqkzHOAKY8AEgrczp:Reczp:Sep;6ep;MegDaDp;Meakarczp:Sep;6ep;Megxaxp;Meakaqczp:Reczp:Sep;6ep;Megqaqp;Mep;Kep;Kep;Lepxbbbbbbbbbbbbbbbbp:4ep;Jepxb;:FSb;:FSb;:FSb;:FSgkp;Mepxbbn0bbn0bbn0bbn0grp;KepxFFbbFFbbFFbbFFbbgmp9oaxakp;Mearp;Keczp:Rep9qgxaqakp;Mearp;Keczp:ReaDakp;Mearp;Keamp9op9qgkpmbezHdiOAlvCXorQLgrp5baipblapEb:T:j83ibaiarp5eaipblapEe:T:j83iwaiaxakpmwDKYqk8AExm35Ps8E8Fgkp5baipblapEd:T:j83izaiakp5eaipblapEi:T:j83iKkawaiao;8qbbkk:Pddiue978Jjjjjbc;ab9Rhidnadcd4ae2glc98GgvTmbcbhdabheinaeaepbbbgocwp:Recwp:Sep;6eaocep:SepxbbjZbbjZbbjZbbjZp:UepxbbjFbbjFbbjFbbjFp9op;Mepkbbaeczfheadclfgdav6mbkkdnaval9pmbaialciGgdcdtgeVcbc;abae9R;8kbaiabavcdtfgvae;8qbbdnadTmbaiaipblbgocwp:Recwp:Sep;6eaocep:SepxbbjZbbjZbbjZbbjZp:UepxbbjFbbjFbbjFbbjFp9op;Mepklbkavaiae;8qbbkk9teiucbcbydj1jjbgeabcifc98GfgbBdj1jjbdndnabZbcztgd9nmbcuhiabad9RcFFifcz4nbcuSmekaehikaikkkebcjwklz9Tbb",t=new Uint8Array([0,97,115,109,1,0,0,0,1,4,1,96,0,0,3,3,2,0,0,5,3,1,0,1,12,1,0,10,22,2,12,0,65,0,65,0,65,0,252,10,0,0,11,7,0,65,0,253,15,26,11]),n=new Uint8Array([32,0,65,2,1,106,34,33,3,128,11,4,13,64,6,253,10,7,15,116,127,5,8,12,40,16,19,54,20,9,27,255,113,17,42,67,24,23,146,148,18,14,22,45,70,69,56,114,101,21,25,63,75,136,108,28,118,29,73,115]);if(typeof WebAssembly!="object")return{supported:!1};var r=WebAssembly.validate(t)?e:i,s,o=WebAssembly.instantiate(a(r),{}).then(function(f){s=f.instance,s.exports.__wasm_call_ctors()});function a(f){for(var y=new Uint8Array(f.length),x=0;x<f.length;++x){var _=f.charCodeAt(x);y[x]=_>96?_-97:_>64?_-39:_+4}for(var I=0,x=0;x<f.length;++x)y[I++]=y[x]<60?n[y[x]]:(y[x]-60)*64+y[++x];return y.buffer.slice(0,I)}function c(f,y,x,_,I,L){var C=s.exports.sbrk,F=x+3&-4,w=C(F*_),v=C(I.length),T=new Uint8Array(s.exports.memory.buffer);T.set(I,v);var j=f(w,x,_,v,I.length);if(j==0&&L&&L(w,F,_),y.set(T.subarray(w,w+x*_)),C(w-C(0)),j!=0)throw new Error("Malformed buffer data: "+j)}var l={NONE:"",OCTAHEDRAL:"meshopt_decodeFilterOct",QUATERNION:"meshopt_decodeFilterQuat",EXPONENTIAL:"meshopt_decodeFilterExp"},h={ATTRIBUTES:"meshopt_decodeVertexBuffer",TRIANGLES:"meshopt_decodeIndexBuffer",INDICES:"meshopt_decodeIndexSequence"},u=[],d=0;function p(f){var y={object:new Worker(f),pending:0,requests:{}};return y.object.onmessage=function(x){var _=x.data;y.pending-=_.count,y.requests[_.id][_.action](_.value),delete y.requests[_.id]},y}function g(f){for(var y="var instance; var ready = WebAssembly.instantiate(new Uint8Array(["+new Uint8Array(a(r))+"]), {}).then(function(result) { instance = result.instance; instance.exports.__wasm_call_ctors(); });self.onmessage = workerProcess;"+c.toString()+m.toString(),x=new Blob([y],{type:"text/javascript"}),_=URL.createObjectURL(x),I=0;I<f;++I)u[I]=p(_);URL.revokeObjectURL(_)}function b(f,y,x,_,I){for(var L=u[0],C=1;C<u.length;++C)u[C].pending<L.pending&&(L=u[C]);return new Promise(function(F,w){var v=new Uint8Array(x),T=d++;L.pending+=f,L.requests[T]={resolve:F,reject:w},L.object.postMessage({id:T,count:f,size:y,source:v,mode:_,filter:I},[v.buffer])})}function m(f){o.then(function(){var y=f.data;try{var x=new Uint8Array(y.count*y.size);c(s.exports[y.mode],x,y.count,y.size,y.source,s.exports[y.filter]),self.postMessage({id:y.id,count:y.count,action:"resolve",value:x},[x.buffer])}catch(_){self.postMessage({id:y.id,count:y.count,action:"reject",value:_})}})}return{ready:o,supported:!0,useWorkers:function(f){g(f)},decodeVertexBuffer:function(f,y,x,_,I){c(s.exports.meshopt_decodeVertexBuffer,f,y,x,_,s.exports[l[I]])},decodeIndexBuffer:function(f,y,x,_){c(s.exports.meshopt_decodeIndexBuffer,f,y,x,_)},decodeIndexSequence:function(f,y,x,_){c(s.exports.meshopt_decodeIndexSequence,f,y,x,_)},decodeGltfBuffer:function(f,y,x,_,I,L){c(s.exports[h[I]],f,y,x,_,s.exports[l[L]])},decodeGltfBufferAsync:function(f,y,x,_,I){return u.length>0?b(f,y,x,h[_],l[I]):o.then(function(){var L=new Uint8Array(f*y);return c(s.exports[h[_]],L,f,y,x,s.exports[l[I]]),L})}}})(),Gn=Uint8Array,rs=Uint16Array,dy=Int32Array,Jd=new Gn([0,0,0,0,0,0,0,0,1,1,1,1,2,2,2,2,3,3,3,3,4,4,4,4,5,5,5,5,0,0,0,0]),ef=new Gn([0,0,0,0,1,1,2,2,3,3,4,4,5,5,6,6,7,7,8,8,9,9,10,10,11,11,12,12,13,13,0,0]),fy=new Gn([16,17,18,0,8,7,9,6,10,5,11,4,12,3,13,2,14,1,15]),tf=function(i,e){for(var t=new rs(31),n=0;n<31;++n)t[n]=e+=1<<i[n-1];for(var r=new dy(t[30]),n=1;n<30;++n)for(var s=t[n];s<t[n+1];++s)r[s]=s-t[n]<<5|n;return{b:t,r}},nf=tf(Jd,2),rf=nf.b,py=nf.r;rf[28]=258,py[258]=28;var my=tf(ef,0),gy=my.b,Ll=new rs(32768);for(var Zt=0;Zt<32768;++Zt){var tr=(Zt&43690)>>1|(Zt&21845)<<1;tr=(tr&52428)>>2|(tr&13107)<<2,tr=(tr&61680)>>4|(tr&3855)<<4,Ll[Zt]=((tr&65280)>>8|(tr&255)<<8)>>1}var eo=(function(i,e,t){for(var n=i.length,r=0,s=new rs(e);r<n;++r)i[r]&&++s[i[r]-1];var o=new rs(e);for(r=1;r<e;++r)o[r]=o[r-1]+s[r-1]<<1;var a;if(t){a=new rs(1<<e);var c=15-e;for(r=0;r<n;++r)if(i[r])for(var l=r<<4|i[r],h=e-i[r],u=o[i[r]-1]++<<h,d=u|(1<<h)-1;u<=d;++u)a[Ll[u]>>c]=l}else for(a=new rs(n),r=0;r<n;++r)i[r]&&(a[r]=Ll[o[i[r]-1]++]>>15-i[r]);return a}),ho=new Gn(288);for(var Zt=0;Zt<144;++Zt)ho[Zt]=8;for(var Zt=144;Zt<256;++Zt)ho[Zt]=9;for(var Zt=256;Zt<280;++Zt)ho[Zt]=7;for(var Zt=280;Zt<288;++Zt)ho[Zt]=8;var sf=new Gn(32);for(var Zt=0;Zt<32;++Zt)sf[Zt]=5;var by=eo(ho,9,1),_y=eo(sf,5,1),Cc=function(i){for(var e=i[0],t=1;t<i.length;++t)i[t]>e&&(e=i[t]);return e},ri=function(i,e,t){var n=e/8|0;return(i[n]|i[n+1]<<8)>>(e&7)&t},Pc=function(i,e){var t=e/8|0;return(i[t]|i[t+1]<<8|i[t+2]<<16)>>(e&7)},xy=function(i){return(i+7)/8|0},vy=function(i,e,t){return(t==null||t>i.length)&&(t=i.length),new Gn(i.subarray(e,t))},yy=["unexpected EOF","invalid block type","invalid length/literal","invalid distance","stream finished","no stream handler",,"no callback","invalid UTF-8 data","extra field too long","date not in range 1980-2099","filename too long","stream finishing","invalid zip data"],si=function(i,e,t){var n=new Error(e||yy[i]);if(n.code=i,Error.captureStackTrace&&Error.captureStackTrace(n,si),!t)throw n;return n},My=function(i,e,t,n){var r=i.length,s=0;if(!r||e.f&&!e.l)return t||new Gn(0);var o=!t,a=o||e.i!=2,c=e.i;o&&(t=new Gn(r*3));var l=function(Tt){var Ke=t.length;if(Tt>Ke){var ct=new Gn(Math.max(Ke*2,Tt));ct.set(t),t=ct}},h=e.f||0,u=e.p||0,d=e.b||0,p=e.l,g=e.d,b=e.m,m=e.n,f=r*8;do{if(!p){h=ri(i,u,1);var y=ri(i,u+1,3);if(u+=3,y)if(y==1)p=by,g=_y,b=9,m=5;else if(y==2){var L=ri(i,u,31)+257,C=ri(i,u+10,15)+4,F=L+ri(i,u+5,31)+1;u+=14;for(var w=new Gn(F),v=new Gn(19),T=0;T<C;++T)v[fy[T]]=ri(i,u+T*3,7);u+=C*3;for(var j=Cc(v),q=(1<<j)-1,se=eo(v,j,1),T=0;T<F;){var ne=se[ri(i,u,q)];u+=ne&15;var x=ne>>4;if(x<16)w[T++]=x;else{var $=0,ce=0;for(x==16?(ce=3+ri(i,u,3),u+=2,$=w[T-1]):x==17?(ce=3+ri(i,u,7),u+=3):x==18&&(ce=11+ri(i,u,127),u+=7);ce--;)w[T++]=$}}var P=w.subarray(0,L),k=w.subarray(L);b=Cc(P),m=Cc(k),p=eo(P,b,1),g=eo(k,m,1)}else si(1);else{var x=xy(u)+4,_=i[x-4]|i[x-3]<<8,I=x+_;if(I>r){c&&si(0);break}a&&l(d+_),t.set(i.subarray(x,I),d),e.b=d+=_,e.p=u=I*8,e.f=h;continue}if(u>f){c&&si(0);break}}a&&l(d+131072);for(var W=(1<<b)-1,re=(1<<m)-1,he=u;;he=u){var $=p[Pc(i,u)&W],ye=$>>4;if(u+=$&15,u>f){c&&si(0);break}if($||si(2),ye<256)t[d++]=ye;else if(ye==256){he=u,p=null;break}else{var J=ye-254;if(ye>264){var T=ye-257,fe=Jd[T];J=ri(i,u,(1<<fe)-1)+rf[T],u+=fe}var Me=g[Pc(i,u)&re],_e=Me>>4;Me||si(3),u+=Me&15;var k=gy[_e];if(_e>3){var fe=ef[_e];k+=Pc(i,u)&(1<<fe)-1,u+=fe}if(u>f){c&&si(0);break}a&&l(d+131072);var Fe=d+J;if(d<k){var $e=s-k,nt=Math.min(k,Fe);for($e+d<0&&si(3);d<nt;++d)t[d]=n[$e+d]}for(;d<Fe;++d)t[d]=t[d-k]}}e.l=p,e.p=he,e.b=d,e.f=h,p&&(h=1,e.m=b,e.d=g,e.n=m)}while(!h);return d!=t.length&&o?vy(t,0,d):t.subarray(0,d)},Sy=new Gn(0),wy=function(i){(i[0]!=31||i[1]!=139||i[2]!=8)&&si(6,"invalid gzip data");var e=i[3],t=10;e&4&&(t+=(i[10]|i[11]<<8)+2);for(var n=(e>>3&1)+(e>>4&1);n>0;n-=!i[t++]);return t+(e&2)},Ey=function(i){var e=i.length;return(i[e-4]|i[e-3]<<8|i[e-2]<<16|i[e-1]<<24)>>>0};function Ay(i,e){var t=wy(i);return t+8>i.length&&si(6,"invalid gzip data"),My(i.subarray(t,-8),{i:2},new Gn(Ey(i)),e)}var Ty=typeof TextDecoder<"u"&&new TextDecoder,Ry=0;try{Ty.decode(Sy,{stream:!0}),Ry=1}catch{}async function of(i){const e=new URL(i,document.baseURI),t=await fetch(e);if(!t.ok)throw new Error("model_load_failed");let n=new Uint8Array(await t.arrayBuffer());n[0]===31&&n[1]===139&&(n=Ay(n));const r=n.buffer.slice(n.byteOffset,n.byteOffset+n.byteLength);return new Pv().setMeshoptDecoder(uy).parseAsync(r,new URL(".",e).href)}const Dl={standard:new A(.18,.38,1),front:new A(0,.15,1),side:new A(1,.2,0),back:new A(0,.15,-1)},Xu={low:{ratio:1,shadows:!1},medium:{ratio:1.5,shadows:!0},high:{ratio:2,shadows:!0}};class Cy{constructor(e,t={}){this.container=e,this.callbacks=t,this.scene=new Ql,this.camera=new vn(32,1,.02,40),this.time=0,this.period=9,this.playing=!1,this.speed=.5,this.loopRange=null,this.visible=!0,this.disposed=!1,this.contextLost=!1,this.dirty=!0,this.framingMode="main",this.loopBounds=new an,this.stageProps=[],this.renderer=new G_({alpha:!0,antialias:!0,powerPreference:"high-performance"}),this.renderer.setClearColor(1052950,0),this.renderer.outputColorSpace=ln,this.renderer.toneMapping=nd,this.renderer.toneMappingExposure=1.15,this.renderer.domElement.setAttribute("aria-label","托马斯全旋 3D 动画，可拖动旋转与双指缩放"),e.prepend(this.renderer.domElement),this.controls=new Lx(this.camera,this.renderer.domElement),Object.assign(this.controls,{enableDamping:!0,dampingFactor:.13,enablePan:!1,minDistance:.45,maxDistance:7,minPolarAngle:.12,maxPolarAngle:Math.PI*.9}),this.onControlsChange=()=>{this.dirty=!0},this.controls.addEventListener("change",this.onControlsChange),this.autoFrame=!0,this.controls.addEventListener("start",()=>{this.autoFrame=!1}),this.scene.add(new kd(16184042,3947070,2)),this.keyLight=new ls(16771794,3.7),this.keyLight.position.set(-2.5,4,4),this.scene.add(this.keyLight);const n=new ls(15790847,2.2);n.position.set(2,2,-3),this.scene.add(n);const r=new ls(14869226,.8);r.position.set(4,.7,2),this.scene.add(r),this.createEnvironment(),this.scene.environmentIntensity=.32,this.renderer.shadowMap.type=ed,this.keyLight.shadow.mapSize.set(1024,1024),this.keyLight.shadow.bias=-4e-4,this.keyLight.shadow.normalBias=.02,this.keyLight.shadow.radius=6,Object.assign(this.keyLight.shadow.camera,{left:-1.9,right:1.9,top:1.9,bottom:-1.9,near:1,far:12}),this.keyLight.shadow.camera.updateProjectionMatrix(),this.shadowCatcher=new jt(new Cs(8,8),new ex({color:0,opacity:.28})),this.shadowCatcher.rotation.x=-Math.PI/2,this.shadowCatcher.position.y=-.006,this.shadowCatcher.receiveShadow=!0,this.floor=Py(),this.stageProps.push(this.shadowCatcher,this.floor),this.scene.add(...this.stageProps),this.setQuality("medium"),this.resizeObserver=new ResizeObserver(()=>this.resize()),this.resizeObserver.observe(e),this.resize(),this.onVisibility=()=>{document.hidden?(this.playing=!1,this.stop(),t.onTime?.(this.time)):this.visible&&(this.dirty=!0,this.start())},this.onContextLost=s=>{s.preventDefault(),this.contextLost=!0,this.playing=!1,this.stop(),Lc(this.scene),this.coach?.traverse(o=>{o.skeleton?.boneTexture?.dispose()}),this.keyLight.shadow.map?.dispose(),this.keyLight.shadow.map=null,this.scene.environment=null,this.environment?.dispose(),this.environment=null,t.onContext?.(!1),t.onTime?.(this.time)},this.onContextRestored=()=>{this.contextLost=!1,this.createEnvironment(),this.dirty=!0,this.resize(),this.start(),t.onContext?.(!0)},document.addEventListener("visibilitychange",this.onVisibility),this.renderer.domElement.addEventListener("webglcontextlost",this.onContextLost),this.renderer.domElement.addEventListener("webglcontextrestored",this.onContextRestored)}createEnvironment(){this.environment?.dispose();const e=new _l(this.renderer),t=new Wx;this.environment=e.fromScene(t,.04),this.scene.environment=this.environment.texture,t.dispose(),e.dispose()}async load(){const[e,t]=await Promise.all([of("./coach/flare-coach.meshopt.glb.gz"),fetch(new URL("./coach/coach-rig.json",document.baseURI)).then(n=>{if(!n.ok)throw new Error("rig_load_failed");return n.json()})]);if(this.disposed){Lc(e.scene);return}this.coach=e.scene,this.motion=Tv({model:this.coach,rigData:t}),this.coach.traverse(n=>{n.isMesh&&(n.castShadow=this.renderer.shadowMap.enabled)}),this.scene.add(this.coach),this.period=this.motion.getMetrics().period;for(let n=0;n<18;n++){this.motion.update(n*this.period/18);const r=this.motion.getMetrics().bounds;this.loopBounds.union(new an(new A().fromArray(r.min),new A().fromArray(r.max)))}this.loopBounds.expandByScalar(t.height*.045),this.pacing=Rv(this.coach,this.motion,0),this.setTime(0),this.resetView(),this.start()}start(){this.running||this.disposed||this.contextLost||!this.visible||document.hidden||(this.running=!0,this.last=performance.now(),this.renderer.setAnimationLoop(e=>this.tick(e)))}stop(){this.running=!1,this.renderer.setAnimationLoop(null)}tick(e){const t=Math.min(Math.max((e-this.last)/1e3,0),.06);if(this.last=e,this.motion&&this.playing){const n=this.paceStep(t);if(this.loopRange){const[r,s]=this.loopRange,o=s-r;this.time=r+((this.time-r+n)%o+o)%o}else this.time=(this.time+n)%this.period;this.motion.update(this.time),this.callbacks.onTime?.(this.time),this.dirty=!0}this.controls.update(),this.dirty&&(this.renderer.render(this.scene,this.camera),this.dirty=!1,this.callbacks.onRender?.())}setTime(e){this.time=Nt.clamp(e,0,this.period),this.motion?.update(this.time),this.coach?.updateMatrixWorld(!0),this.dirty=!0,this.callbacks.onTime?.(this.time)}pacingRate(e){return Yd(this.pacing,this.motion,e,this.period)}paceStep(e){return Cv(this.pacing,this.motion,this.time,e,this.speed,this.period)}getMetrics(){return this.motion?.getMetrics()??null}setVisible(e){this.visible=!!e,this.visible&&!document.hidden?(this.dirty=!0,this.start()):(this.playing=!1,this.stop(),this.callbacks.onTime?.(this.time))}setQuality(e){this.quality=e in Xu?e:"medium";const t=Xu[this.quality];this.renderer.setPixelRatio(Math.min(window.devicePixelRatio||1,t.ratio)),this.renderer.shadowMap.enabled=t.shadows,this.keyLight.castShadow=t.shadows,this.shadowCatcher.visible=t.shadows,this.coach?.traverse(n=>{n.isMesh&&(n.castShadow=t.shadows)}),this.dirty=!0,this.resize()}resize(){const e=this.container.clientWidth,t=this.container.clientHeight;if(!(e>0&&t>0))return;const n=this.camera.aspect!==e/t;this.camera.aspect=e/t;const r=this.framingMode==="main"&&e<=600&&t>=500;this.insetLeft=this.framingMode==="detail"||r?0:t<=320?48:64,this.offsetY=r?t*(.5-187/650):0,this.offsetX=r?e*10/390:0,this.camera.setViewOffset(e,t,this.offsetX-this.insetLeft/2,this.offsetY,e,t),this.camera.updateProjectionMatrix(),this.renderer.setSize(e,t),n&&this.autoFrame&&this.motion&&this.resetView(),this.dirty=!0}setFramingMode(e){this.framingMode=e,this.resize()}resetView(e=Dl.standard){this.autoFrame=!0;const t=this.container.clientWidth<=600&&this.container.clientHeight>=500;this.fitBounds(this.loopBounds,e,t?.72:this.container.clientWidth<=600?.78:.74)}fitBounds(e,t,n=1){if(e.isEmpty())return;const r=t.clone().normalize(),s=e.getCenter(new A),o=new A().crossVectors(new A(0,1,0),r).normalize(),a=new A().crossVectors(r,o).normalize(),c=Math.tan(Nt.degToRad(this.camera.fov/2)),l=c*this.camera.aspect*Math.max(.4,(this.container.clientWidth-(this.insetLeft||0))/this.container.clientWidth);let h=.6;for(const u of[e.min.x,e.max.x])for(const d of[e.min.y,e.max.y])for(const p of[e.min.z,e.max.z]){const g=new A(u,d,p).sub(s),b=g.dot(r);h=Math.max(h,b+Math.abs(g.dot(a))/c,b+Math.abs(g.dot(o))/l)}this.controls.target.copy(s),this.camera.position.copy(s).addScaledVector(r,h*n),this.controls.update(),this.dirty=!0}project(e){const t=e.clone().project(this.camera),n=this.renderer.domElement.getBoundingClientRect();return{x:(t.x+1)*.5*n.width,y:(1-t.y)*.5*n.height,behind:t.z>1||t.z<-1}}dispose(){this.disposed||(this.disposed=!0,this.stop(),this.resizeObserver.disconnect(),document.removeEventListener("visibilitychange",this.onVisibility),this.renderer.domElement.removeEventListener("webglcontextlost",this.onContextLost),this.renderer.domElement.removeEventListener("webglcontextrestored",this.onContextRestored),this.controls.removeEventListener("change",this.onControlsChange),this.controls.dispose(),Lc(this.scene),this.environment?.dispose(),this.renderer.dispose(),this.renderer.domElement.remove())}}function Py(){const i=document.createElement("canvas");i.width=i.height=256;const e=i.getContext("2d"),t=e.createRadialGradient(128,128,0,128,128,128);t.addColorStop(0,"rgba(255,255,255,.055)"),t.addColorStop(.45,"rgba(255,255,255,.018)"),t.addColorStop(1,"rgba(255,255,255,0)"),e.fillStyle=t,e.fillRect(0,0,256,256);const n=new J_(i);n.colorSpace=ln;const r=new jt(new Cs(4.2,4.2),new Oi({map:n,transparent:!0,depthWrite:!1}));return r.rotation.x=-Math.PI/2,r.position.y=-.014,r.renderOrder=-1,r}function Lc(i){const e=new Set,t=new Set,n=new Set;i.traverse(r=>{r.geometry&&e.add(r.geometry);for(const s of r.material?[].concat(r.material):[]){t.add(s);for(const o of Object.values(s))o?.isTexture&&n.add(o)}});for(const r of[...e,...t,...n])r.dispose()}const af=[{source:9,id:"rear-support",name:"后侧支撑",detail:"长腿过前方",caption:"双手推地撑住身体，屈髋把开立的长腿抬过身体前方；腹部卷紧，臀中肌保持开腿。",primary:[{id:"triceps",side:"support",why:"双臂伸直锁肘，把身体撑离地面。"},{id:"deltoids",side:"support",why:"肩前倾在手的上方，控制承重肩。"},{id:"hip-flexors",side:"both",why:"主动屈髋，把长腿抬过身体前方。"},{id:"abs",side:"both",why:"卷腹折叠躯干，给抬腿留出空间。"},{id:"hip-abductors",side:"both",why:"双腿保持大开度，过前方时不合拢。"}],secondary:[{id:"serratus",side:"support"},{id:"forearms",side:"support"},{id:"adductors",side:"both"},{id:"quadriceps",side:"both"}]},{source:10,id:"first-transfer",name:"第一侧移重",detail:"单手接重",caption:"重量从双手移到单手：支撑侧三角肌、肱三头肌和前锯肌一起接住体重，腕屈肌稳住掌根；腹斜肌把骨盆转向侧面。",primary:[{id:"deltoids",side:"support",why:"整个上身的重量转到这一侧肩上。"},{id:"triceps",side:"support",why:"支撑臂伸肘锁住，不让手肘弯塌。"},{id:"serratus",side:"support",why:"肩胛贴住胸廓前伸，主动把地面推远。"},{id:"forearms",side:"support",why:"掌根刚接住体重，腕屈肌控制手腕不塌。"},{id:"obliques",side:"both",why:"转动躯干，让骨盆跟着摆腿转向侧面。"}],secondary:[{id:"rotator-cuff",side:"support"},{id:"hip-abductors",side:"free"},{id:"glute-max",side:"support"}]},{source:11,id:"first-support",name:"第一侧支撑",detail:"高 V 开腿",caption:"单手撑起全身、身体侧立：支撑肩最吃力，肩袖护住肩关节；腹斜肌把髋撑高，臀中肌打开高 V 字腿。",primary:[{id:"deltoids",side:"support",why:"单臂承担全身重量，肩部负荷最大的时刻。"},{id:"triceps",side:"support",why:"手臂保持笔直，身体才能侧立撑高。"},{id:"rotator-cuff",side:"support",why:"手臂举过头承重，肩袖把肱骨头稳在关节里。"},{id:"obliques",side:"both",why:"侧面核心把骨盆撑高，身体不往下塌。"},{id:"hip-abductors",side:"both",why:"臀中肌外展双腿，撑开高 V 字。"}],secondary:[{id:"serratus",side:"support"},{id:"forearms",side:"support"},{id:"lats",side:"support"},{id:"adductors",side:"both"}]},{source:12,id:"first-pass",name:"第一侧换腿",detail:"准备回撑",caption:"身体转向正面，双腿像剪刀一样换位过前：屈髋肌和腹直肌把腿带到前方，内收肌控制两腿交错；另一只手准备回撑。",primary:[{id:"triceps",side:"support",why:"仍是单手支撑，伸肘把身体顶住。"},{id:"deltoids",side:"support",why:"身体转向正面，承重肩随之转动控制。"},{id:"hip-flexors",side:"both",why:"屈髋把扫行的腿带到身体前方。"},{id:"abs",side:"both",why:"收腹折叠，骨盆抬住，给腿让出通道。"},{id:"adductors",side:"both",why:"两腿剪刀式交错，内收肌控制开合。"}],secondary:[{id:"obliques",side:"both"},{id:"quadriceps",side:"both"},{id:"serratus",side:"support"},{id:"forearms",side:"support"}]},{source:13,id:"front-support",name:"前侧支撑",detail:"开腿扫后方",caption:"双手在身后撑地、胸口朝上：肱三头肌、三角肌和胸大肌像做臂屈伸一样顶住身体；双腿保持大开度，准备向后扫。",primary:[{id:"triceps",side:"support",why:"双手在身后推地，伸肘把身体顶起。"},{id:"deltoids",side:"support",why:"肩在后伸位承重，前束最吃力。"},{id:"chest",side:"support",why:"胸大肌协助肩部在后伸位推地。"},{id:"hip-abductors",side:"both",why:"双腿抬高大开度，准备向后扫。"}],secondary:[{id:"scapular",side:"support"},{id:"hip-flexors",side:"both"},{id:"abs",side:"both"},{id:"forearms",side:"support"},{id:"glute-max",side:"both"}]},{source:14,id:"second-transfer",name:"第二侧移重",detail:"换手接重",caption:"换到另一只手单撑：支撑侧肩臂和前锯肌重新接住体重，腕屈肌稳住掌根；臀大肌带长腿从前方扫向后方。",primary:[{id:"deltoids",side:"support",why:"体重换到这一侧肩上，重新接住。"},{id:"triceps",side:"support",why:"新的支撑臂伸肘锁住。"},{id:"serratus",side:"support",why:"肩胛前伸推地，肩不往下沉。"},{id:"forearms",side:"support",why:"掌根刚接重，腕屈肌控制手腕。"},{id:"glute-max",side:"both",why:"伸髋发力，把长腿从前方扫向后方。"}],secondary:[{id:"rotator-cuff",side:"support"},{id:"obliques",side:"both"},{id:"hip-abductors",side:"free"},{id:"hamstrings",side:"both"}]},{source:15,id:"second-support",name:"第二侧支撑",detail:"高 V 开腿",caption:"另一侧单手侧撑：支撑肩与肩袖承担全身重量；腹斜肌撑高骨盆，臀中肌保持高 V 开腿。",primary:[{id:"deltoids",side:"support",why:"单臂承担全身重量，肩部负荷最大的时刻。"},{id:"triceps",side:"support",why:"手臂保持笔直，身体才能侧立撑高。"},{id:"rotator-cuff",side:"support",why:"手臂举过头承重，肩袖把肱骨头稳在关节里。"},{id:"obliques",side:"both",why:"侧面核心把骨盆撑高，身体不往下塌。"},{id:"hip-abductors",side:"both",why:"臀中肌外展双腿，撑开高 V 字。"}],secondary:[{id:"serratus",side:"support"},{id:"forearms",side:"support"},{id:"lats",side:"support"},{id:"adductors",side:"both"}]},{source:16,id:"second-pass",name:"第二侧换腿",detail:"准备接圈",caption:"身体转回朝下，双腿扫过后方：臀大肌伸髋带腿，竖脊肌保持髋部高度，腹斜肌把身体旋回；另一只手准备落地接回下一圈。",primary:[{id:"deltoids",side:"support",why:"单手支撑中身体旋回，承重肩随之控制。"},{id:"triceps",side:"support",why:"伸肘撑住，直到另一只手落地。"},{id:"glute-max",side:"both",why:"伸髋把长腿扫过身体后方。"},{id:"erectors",side:"both",why:"背部伸展肌群保持髋部高度，不塌腰。"},{id:"obliques",side:"both",why:"躯干旋回，把身体接回后侧支撑。"}],secondary:[{id:"hamstrings",side:"both"},{id:"serratus",side:"support"},{id:"forearms",side:"support"},{id:"hip-abductors",side:"both"}]}],Qu=Object.fromEntries(af.map(i=>[i.source,i])),Ly={rear:9,sideA:11,front:13,sideB:15},Dy=i=>{const e=Number(i?.sourceStepNumber??i?.source?.stepNumber);return Number.isSafeInteger(e)?e:null};function Iy(i){return Qu[Dy(i)]??Qu[Ly[i?.phase]]??af[0]}function Ny(i){const e=i?.pose?.limbs,t=e?.left?.handLocked===!0,n=e?.right?.handLocked===!0;return t&&!n?"left":n&&!t?"right":"both"}function Uy(i,{smooth:e=!1}={}){const t=Array.isArray(i?.steps)?i.steps:[],n=Number(i?.period)||9;if(!t.length)return{period:n,keys:[]};const r=new Set(i.skippedSteps??[]),s=e?t.length-1:t.length,o=e?n/(s+1):n/t.length,a=[];for(let c=0;c<s;c++)r.has(c)||a.push({time:c*o,index:c,phase:Iy(t[c]),support:Ny(t[c])});return{period:n,keys:a}}function Fy(i,e,t=.16){const{keys:n,period:r}=i;if(!n?.length)return null;const s=(e%r+r)%r,o=n.length,a=_=>{const I=(_%o+o)%o;return{...n[I],t:n[I].time+Math.floor(_/o)*r}};let c=-1;for(;c<o-1&&n[c+1].time<=s;)c++;const l=a(c),h=a(c+1),u=(l.t+h.t)/2,d=s<u?c:c+1,p=a(d),g=a(d-1),b=a(d+1),m=(g.t+p.t)/2,f=(p.t+b.t)/2;let y=null,x=0;return f-s<t?(y=b,x=.5*(1-(f-s)/t)):s-m<t&&(y=g,x=.5*(1-(s-m)/t)),{current:p,neighbour:y,w:x,t:s}}function Oy(i,e){const t=n=>n==="both"||e==="both"?"both":n==="support"?e:n==="free"?e==="left"?"right":"left":n==="left"||n==="right"?n:"both";return[...i.primary.map(n=>({groupId:n.id,level:"primary",side:t(n.side),why:n.why??""})),...i.secondary.map(n=>({groupId:n.id,level:"secondary",side:t(n.side),why:n.why??""}))]}const ky=i=>i==="both"?"双手支撑":i==="left"?"左手支撑":"右手支撑",cf=[{groupId:"deltoids",section:"support",colour:"#4cc9f0",label:"三角肌",view:"front",role:"前、中、后束协同控制承重肩，接住每一次换手。"},{groupId:"rotator-cuff",section:"support",colour:"#a29bfe",label:"肩袖肌群",view:"back",role:"位于深层，帮助稳定肱骨头，支撑方向不断变化时护住肩关节。",note:"仅用冈下肌位置示意（斜线＝深层）；冈上肌、小圆肌、肩胛下肌未单独绘制。"},{groupId:"triceps",section:"support",colour:"#2f6bff",label:"肱三头肌",view:"back",role:"伸肘锁住支撑臂，手臂保持伸直受控。"},{groupId:"forearms",section:"support",label:"前臂 · 腕屈伸肌",colour:"#9ad1e8",view:"front",role:"掌根撑地时控制手腕与手指，平稳落手、卸载。",note:"屈肌群与伸肌群各合为一块面板；手部小肌群未绘制。"},{groupId:"serratus",section:"support",colour:"#5eead4",label:"前锯肌",view:"front",role:"让肩胛贴着胸廓前伸，主动把地面推远。",note:"只画出胸廓侧面可见的部分；被肩胛骨覆盖的部分未绘制。"},{groupId:"scapular",section:"support",label:"斜方肌中下部 · 菱形肌",colour:"#86efc4",view:"back",role:"协同调整肩胛位置，维持肩带与地面之间的支撑空间。",note:"菱形肌在斜方肌深层，这里与斜方肌中下部合为一块面板。"},{groupId:"chest",section:"support",colour:"#6f8dff",label:"胸大肌",view:"front",role:"前撑转侧撑时，配合控制上臂相对胸廓的方向。"},{groupId:"lats",section:"support",colour:"#00a896",label:"背阔肌",view:"back",role:"连接上臂与躯干，参与肩部下压与身体随支撑转移。"},{groupId:"abs",section:"core",colour:"#c466ff",label:"腹直肌（含深层腹横肌）",view:"front",role:"卷腹折叠躯干，与深层腹横肌一起稳住骨盆，给抬腿留出空间。",note:"面板为腹直肌；腹横肌位于深层，没有单独面板。"},{groupId:"obliques",section:"core",colour:"#ff6fb5",label:"腹斜肌",view:"front",role:"参与躯干旋转与侧向控制，让肩与骨盆随摆腿转动。",note:"面板为腹外斜肌；腹内斜肌在其深层，未单独绘制。"},{groupId:"erectors",section:"core",colour:"#e3b3ff",label:"竖脊肌",view:"back",role:"控制脊柱伸展与躯干位置，后撑时帮助保持髋高。",note:"腰方肌（腰部深层）暂无面板，未显示。"},{groupId:"hip-flexors",section:"core",colour:"#ff9ec7",label:"髋屈肌",view:"front",role:"位于骨盆深处，主动屈髋，把长腿从身体前方抬过去。",note:"髂腰肌在深层（斜线），与阔筋膜张肌合为一块面板示意；股直肌见股四头肌。"},{groupId:"glute-max",section:"legs",colour:"#ffb703",label:"臀大肌",view:"back",role:"髋伸展与后方扫腿（深层髋旋转肌配合调整腿的方向）。",note:"深层髋外旋肌群没有单独面板。"},{groupId:"hip-abductors",section:"legs",colour:"#ff7b2e",label:"臀中肌 · 髋外展",view:"back",role:"主动开腿并控制骨盆，离地后双腿不合拢。",note:"臀小肌在臀中肌深层，未单独绘制。"},{groupId:"adductors",section:"legs",colour:"#b5e655",label:"内收肌群",view:"front",role:"控制腿向中线回收与开度变化，衔接下一段扫腿。",note:"长收肌、短收肌、大收肌、股薄肌合为一块面板。"},{groupId:"quadriceps",section:"legs",colour:"#ffe45c",label:"股四头肌",view:"front",role:"保持膝部伸直，让长腿连续绕行。",note:"股中间肌位于深层，未单独绘制。"},{groupId:"hamstrings",section:"legs",colour:"#e9a46a",label:"腘绳肌",view:"back",role:"后侧长腿线条，参与髋伸与膝部控制。"}];Object.fromEntries(cf.map(i=>[i.groupId,i.colour]));const bi=Object.fromEntries(cf.map(i=>[i.groupId,i])),lf=Uy(Al,{smooth:!0});function Wn(i){const e=Fy(lf,i,.16),t=e.current;return{source:t.phase.source,id:t.phase.id,name:t.phase.name,caption:t.phase.caption,support:t.support,supportText:ky(t.support),items:Oy(t.phase,t.support).map(n=>({...n,colour:bi[n.groupId].colour,label:bi[n.groupId].label}))}}const Ku=lf.keys.map(i=>({phase:i.phase.source,time:i.time})),Sr=(i,e)=>i.clone().lerp(e,.5),_n=(i,e,t)=>i.clone().lerp(e,t),By=i=>i==="left"?"right":"left",zy={deltoids:(i,e)=>_n(i(e+"Shoulder"),i(e+"Elbow"),.12),"rotator-cuff":(i,e)=>_n(i(e+"Shoulder"),Sr(i("leftShoulder"),i("rightShoulder")),.35),triceps:(i,e)=>_n(i(e+"Shoulder"),i(e+"Elbow"),.55),forearms:(i,e)=>_n(i(e+"Elbow"),i(e+"Wrist"),.4),serratus:(i,e)=>_n(i(e+"Shoulder"),i(e+"Hip"),.32),scapular:(i,e)=>_n(Sr(i("leftShoulder"),i("rightShoulder")),i(e+"Shoulder"),.35),chest:(i,e)=>_n(Sr(i("leftShoulder"),i("rightShoulder")),i(e+"Shoulder"),.45).add(new A(0,-.05,0)),lats:(i,e)=>_n(i(e+"Shoulder"),i(e+"Hip"),.45),abs:i=>_n(Sr(i("leftShoulder"),i("rightShoulder")),Sr(i("leftHip"),i("rightHip")),.62),obliques:(i,e)=>_n(i(e+"Shoulder"),i(e+"Hip"),.7),erectors:i=>_n(Sr(i("leftShoulder"),i("rightShoulder")),Sr(i("leftHip"),i("rightHip")),.75),"hip-flexors":(i,e)=>_n(i(e+"Hip"),i(e+"Knee"),.08),"glute-max":(i,e)=>_n(i(e+"Hip"),i(By(e)+"Hip"),.2),"hip-abductors":(i,e)=>_n(i(e+"Hip"),i(e+"Knee"),.02),adductors:(i,e)=>_n(i(e+"Hip"),i(e+"Knee"),.35),quadriceps:(i,e)=>_n(i(e+"Hip"),i(e+"Knee"),.55),hamstrings:(i,e)=>_n(i(e+"Hip"),i(e+"Knee"),.6)};function Hy(i,e,t=45){const n=i.getMetrics().joints,r=o=>new A().fromArray(n[o]??n.pelvis),s=[];for(const o of e.filter(a=>a.level==="primary")){const a=zy[o.groupId];if(!a)continue;const l=(o.side==="both"?["left","right"]:[o.side]).map(d=>({side:d,point:a(r,d)}));l.sort((d,p)=>d.point.distanceToSquared(i.camera.position)-p.point.distanceToSquared(i.camera.position));const h=l[0],u=i.project(h.point);u.behind||u.x<12||u.y<12||u.x>i.container.clientWidth-12||u.y>i.container.clientHeight-12||s.some(d=>Math.hypot(d.x-u.x,d.y-u.y)<t)||s.push({...u,groupId:o.groupId,label:o.label,colour:o.colour,side:h.side})}return s}const Vy=[["skinHead","","skin",[0,1.6,.01],[.105,.125,.125],0,0,"k"],["skinHand","","skin",[.4,.78,.09],[.065,.105,.09],.35,0,"k"],["skinFoot","","skin",[.17,.03,.03],[.08,.085,.15],0,0,"k"],["skinKnee","","skin",[.135,.47,.03],[.06,.04,.07],.05,0,"k"],["skinShin","","skin",[.128,.3,.01],[.026,.15,.03],-.05,0,"k"],["neck","胸锁乳突肌","neck",[.03,1.47,.055],[.024,.065,.04],.25,-.45,""],["trapUpper","斜方肌上部","trap",[.075,1.43,-.03],[.1,.075,.075],-.3,.1,"m"],["deltFront","三角肌前束","delt",[.18,1.34,.05],[.048,.085,.048],.25,0,""],["deltSide","三角肌中束","delt",[.215,1.33,0],[.048,.09,.06],.3,0,""],["deltRear","三角肌后束","delt",[.18,1.34,-.06],[.048,.085,.048],.25,0,""],["pec","胸大肌","pec",[.08,1.29,.12],[.105,.08,.075],.1,0,"m"],["biceps","肱二头肌","biceps",[.245,1.19,.035],[.04,.11,.045],.36,0,""],["triceps","肱三头肌","triceps",[.258,1.2,-.045],[.045,.13,.05],.36,0,""],["forearmFlex","前臂屈肌群","forearm",[.335,.98,.05],[.04,.11,.04],.37,0,""],["forearmExt","前臂伸肌群","forearm",[.35,.98,0],[.04,.11,.045],.37,0,""],["serratus","前锯肌","serratus",[.135,1.18,.075],[.04,.06,.05],-.15,0,""],["abs","腹直肌","abs",[.036,1.03,.14],[.048,.215,.06],0,0,"ma"],["oblique","腹外斜肌","oblique",[.132,1.02,.06],[.05,.12,.08],.08,0,""],["infraspinatus","冈下肌（肩袖）","infra",[.11,1.29,-.095],[.055,.055,.045],0,0,""],["scapular","菱形肌 / 斜方肌中下部","trap",[.04,1.25,-.1],[.05,.13,.045],0,0,"m"],["lats","背阔肌","lats",[.125,1.13,-.065],[.07,.13,.07],-.15,0,""],["erectors","竖脊肌","erectors",[.035,.99,-.075],[.04,.13,.045],0,0,"m"],["gluteMed","臀中肌","gluteMed",[.15,.91,-.03],[.055,.06,.065],0,0,"c"],["glutes","臀大肌","glutes",[.085,.83,-.085],[.1,.09,.07],0,0,"mc"],["hipFlexor","髂腰肌 / 阔筋膜张肌","hipFlexor",[.12,.87,.08],[.055,.065,.05],0,0,"c"],["quadRect","股直肌","quads",[.105,.65,.1],[.045,.16,.05],.05,0,"c"],["quadLat","股外侧肌","quads",[.165,.64,.068],[.045,.16,.055],.05,0,"c"],["quadMed","股内侧肌","quads",[.085,.52,.075],[.04,.08,.045],.02,0,""],["adductors","内收肌群","adductors",[.05,.67,.01],[.045,.14,.06],.05,0,"c"],["hamLat","股二头肌","ham",[.162,.62,-.042],[.045,.17,.05],.04,0,"c"],["hamMed","半腱肌 / 半膜肌","ham",[.085,.62,-.055],[.045,.17,.05],.04,0,"c"],["tibialis","胫骨前肌","tibialis",[.178,.32,-.01],[.026,.12,.032],0,0,""],["calfMed","腓肠肌内侧头","calf",[.13,.35,-.085],[.04,.1,.045],0,0,""],["calfLat","腓肠肌外侧头","calf",[.18,.35,-.08],[.04,.1,.045],0,0,""]],Gy=[["adductors",[0,.79,.02],[.055,.07,.065],0,0]],hf=1.4,lr=Vy.map(([i,e,t,n,r,s,o,a],c)=>{const l=a.includes("k");return{id:i,name:e,family:t,centre:n,radius:l?r:r.map(h=>h*hf),tz:s,tx:o,skin:l,mid:a.includes("m"),abs:a.includes("a"),cloth:a.includes("c"),index:c}}),Nr=Object.fromEntries(lr.map(i=>[i.id,i])),Wy=["skin",...new Set(lr.map(i=>i.family).filter(i=>i!=="skin"))],uf=lr.length,to=[...lr.map(i=>({...i,parent:i.index})),...Gy.map(([i,e,t,n,r])=>({centre:e,radius:t.map(s=>s*hf),tz:n,tx:r,parent:Nr[i].index}))],qy=to.length,Il=Nr.abs.index,df=14,jy=i=>{const e=Math.min(Math.max((1.03-i)/.2,0),1),t=Math.min(Math.max((i-1.08)/.14,0),1);return .09-.064*e**1.6-.014*t*t*(3-2*t)},Xy=(i,e,t)=>{const n=jy(e)-i,r=e-.832,s=Math.max(.012-Math.abs(n-r),0)/.012;return Math.min(Math.min(n,r)-s*s*.003,t-.04)},Qy=(i,e,t)=>{const n=Math.min(Math.max((t-i)/(e-i),0),1);return n*n*(3-2*n)},va={deltoids:{label:"三角肌",muscles:["deltFront","deltSide","deltRear"]},"rotator-cuff":{label:"肩袖肌群",muscles:["infraspinatus"],deep:!0},triceps:{label:"肱三头肌",muscles:["triceps"]},serratus:{label:"前锯肌",muscles:["serratus"]},scapular:{label:"肩胛稳定肌群",muscles:["scapular"]},obliques:{label:"腹斜肌",muscles:["oblique"]},erectors:{label:"竖脊肌",muscles:["erectors"]},"hip-flexors":{label:"髋屈肌",muscles:["hipFlexor"],deep:!0},quadriceps:{label:"股四头肌",muscles:["quadRect","quadLat","quadMed"]},glutes:{label:"臀肌",muscles:["glutes","gluteMed"]},"glute-max":{label:"臀大肌",muscles:["glutes"]},"hip-abductors":{label:"臀中肌 · 髋外展",muscles:["gluteMed"]},"hip-rotators":{label:"髋外旋肌群",muscles:["glutes"],deep:!0},adductors:{label:"内收肌群",muscles:["adductors"]},hamstrings:{label:"腘绳肌",muscles:["hamLat","hamMed"]},chest:{label:"胸大肌",muscles:["pec"]},pectorals:{label:"胸肌",muscles:["pec"]},abs:{label:"腹直肌",muscles:["abs"]},biceps:{label:"肱二头肌",muscles:["biceps"]},forearms:{label:"前臂肌群",muscles:["forearmFlex","forearmExt"]},traps:{label:"斜方肌",muscles:["trapUpper","scapular"]},lats:{label:"背阔肌",muscles:["lats"]},calves:{label:"小腿三头肌",muscles:["calfMed","calfLat"]},tibialis:{label:"胫骨前肌",muscles:["tibialis"]},neck:{label:"颈部肌群",muscles:["neck"]}};function Nl(i){if(va[i])return va[i];const e=Nr[i];return e?{label:e.name,muscles:[e.id]}:null}function Ky(i,e,t,n){let r=e-i.centre[0],s=t-i.centre[1],o=n-i.centre[2];const a=Math.cos(i.tz),c=Math.sin(i.tz);[r,s]=[r*a+s*c,s*a-r*c];const l=Math.cos(i.tx),h=Math.sin(i.tx);return[s,o]=[s*l+o*h,o*l-s*h],[r,s,o]}function ff(i,e=1.69){const t=1.69/e,n=Math.abs(i.x)*t,r=i.y*t,s=i.z*t,o=new Float64Array(uf).fill(-9);let a=-9;for(const p of to){const[g,b,m]=Ky(p,n,r,s),f=1-Math.hypot(g/p.radius[0],b/p.radius[1],m/p.radius[2]);p.parent===Il?a=f:o[p.parent]=Math.max(o[p.parent],f)}const c=Math.max(...o),l=(a-c)*.1+Qy(1.13,1.08,r);o[Il]=Math.max(c,0)+df*Math.min(Xy(n,r,s),l);let h=-1,u=-1,d=null;return o.forEach((p,g)=>{p>h?(u=h,h=p,d=lr[g].id):p>u&&(u=p)}),h>.02&&!Nr[d].skin?{id:d,name:Nr[d].name,side:i.x>=0?"left":"right",score:h,margin:h-Math.max(u,0)}:null}function pf(){return{mmC:{value:to.map(i=>new vt(...i.centre,i.parent))},mmR:{value:to.map(i=>new A(...i.radius))},mmT:{value:to.map(i=>new vt(Math.cos(i.tz),Math.sin(i.tz),Math.cos(i.tx),Math.sin(i.tx)))},mmF:{value:lr.map(i=>new vt(Wy.indexOf(i.family),i.mid?1:0,i.abs?1:0,i.cloth?1:0))},mmState:{value:lr.map(()=>new vt(0,0,0,0))},mmCol:{value:lr.map(()=>new it("#ff5a36"))},mmMulti:{value:0},mmScale:{value:1},mmTime:{value:0},mmReveal:{value:1},mmDebug:{value:0},mmAccent:{value:new it("#ff5a36")},mmAccent2:{value:new it("#ffae5c")},mmBase:{value:new it("#939dab")},mmSkin:{value:new it("#7f8896")},mmGroove:{value:new it("#3f4859")},mmFabric:{value:new it("#1a2130")}}}const Yy=`
#define MM_N ${uf}
#define MM_NE ${qy}
#define MM_ABS ${Il}
uniform vec4 mmC[MM_NE]; uniform vec3 mmR[MM_NE]; uniform vec4 mmT[MM_NE]; uniform vec4 mmF[MM_N];
uniform vec4 mmState[MM_N]; uniform vec3 mmCol[MM_N]; uniform float mmMulti;
uniform float mmScale; uniform float mmTime; uniform float mmReveal; uniform float mmDebug;
uniform vec3 mmAccent; uniform vec3 mmAccent2; uniform vec3 mmBase; uniform vec3 mmSkin; uniform vec3 mmGroove; uniform vec3 mmFabric;
varying vec3 vMmPos;
vec3 mmPc; float mmDimV; float mmS1; float mmEdge; float mmCloth; float mmRevealT; float mmSelV; float mmGrooveV; float mmIsMuscle; float mmFocusV; float mmCore; float mmShown; float mmIdx;
vec3 mmHue(float i){ return 0.55 + 0.45 * cos(6.2831 * (i * 0.137 + vec3(0.0, 0.33, 0.67))); }
float mmAbsInside(vec3 p){
  float t = clamp((1.03 - p.y) / 0.20, 0.0, 1.0);
  float w = 0.090 - 0.064 * pow(t, 1.6) - 0.014 * smoothstep(1.08, 1.22, p.y);
  float a = w - p.x, b = p.y - 0.832, h = max(0.012 - abs(a - b), 0.0) / 0.012; // rounded tip on the pubis
  return min(min(a, b) - h * h * 0.003, p.z - 0.04);
}
// tendinous intersections: signed vertical distance to line k (0 top .. 2
// at the navel). Each is slightly bowed and uneven; the top ones are higher,
// shorter and rise laterally along the rib arch; the right side sits a few
// millimetres off the left, as on a real six-pack. sx = signed model x (+ left)
float mmAbsLine(vec3 p, float sx, int k){
  float ax = p.x; float r = smoothstep(0.003, -0.003, sx); // 0 left .. 1 right, continuous across the midline
  float t = clamp(ax / 0.085, 0.0, 1.0); float bow = sin(3.1416 * t);
  if (k == 0) return p.y - (1.178 + 0.15 * ax + 0.0050 * bow + r * 0.0040 + 0.0014 * sin(ax * 140.0));
  if (k == 1) return p.y - (1.103 + 0.10 * ax + 0.0040 * bow - r * 0.0035 + 0.0014 * sin(ax * 120.0 + 2.1));
  return p.y - (1.031 - 0.03 * ax + 0.0030 * bow + r * 0.0030 + 0.0012 * sin(ax * 100.0 + 4.2));
}
void mmEval(){
  vec3 p = vec3(abs(vMmPos.x), vMmPos.y, vMmPos.z) * mmScale; float sd = vMmPos.x >= 0.0 ? 1.0 : -1.0;
  float b1 = -9.0, b2 = -9.0, sAbs = -9.0; int i1 = -1, i2 = -1;
  for (int i = 0; i < MM_NE; i++) {
    int k = int(mmC[i].w + 0.5);
    vec3 d = p - mmC[i].xyz; vec4 t = mmT[i];
    d.xy = vec2(d.x * t.x + d.y * t.y, d.y * t.x - d.x * t.y);
    d.yz = vec2(d.y * t.z + d.z * t.w, d.z * t.z - d.y * t.w);
    float s = 1.0 - length(d / mmR[i]);
    if (k == MM_ABS) { sAbs = s; continue; }
    if (k == i1) b1 = max(b1, s);
    else if (s > b1) { b2 = b1; i2 = i1; b1 = s; i1 = k; }
    else if (k == i2) b2 = max(b2, s);
    else if (s > b2) { b2 = s; i2 = k; }
  }
  { // rectus abdominis outline wins inside, meets its neighbours along the outline
    // top edge: the original panel border under the chest (its ellipsoid vs
    // the neighbours), so the pectoral curves stay exactly as before
    float top = (sAbs - b1) * 0.1 + smoothstep(1.13, 1.08, p.y);
    float sa = max(b1, 0.0) + ${df.toFixed(1)} * min(mmAbsInside(p), top);
    if (sa > b1) { b2 = b1; i2 = i1; b1 = sa; i1 = MM_ABS; } else if (sa > b2) { b2 = sa; i2 = MM_ABS; }
  }
  i1 = max(i1, 0); i2 = max(i2, 0);
  vec4 st = mmState[i1];
  float on = (st.y == 0.0 || st.y == sd) ? 1.0 : 0.0;
  mmCloth = mmF[i1].w; mmS1 = b1; mmSelV = st.x * on; mmFocusV = st.z * on; mmIdx = float(i1); mmPc = mmCol[i1]; mmDimV = st.w;
  float s2 = max(b2, 0.0);
  float gap = b1 - s2; float g = length(vec2(dFdx(gap), dFdy(gap))) + 1e-6; float px = gap / g;
  bool sameFamily = b2 > 0.0 && mmF[i1].x == mmF[i2].x;
  mmEdge = smoothstep(0.0, sameFamily ? 0.07 : 0.16, gap);
  // grooves: a soft channel between muscles, a fine line inside one family.
  // Widths are metric (score units) with a pixel floor, AA'd in pixel space.
  float wpx = max((sameFamily ? 0.008 : 0.022) / g, sameFamily ? 0.6 : 1.05);
  mmGrooveV = (1.0 - smoothstep(wpx - 0.65, wpx + 0.65, px)) * (sameFamily ? 0.55 : 1.0);
  // midline seam (linea alba, spine) for mirrored central panels
  if (mmF[i1].y > 0.5) {
    float ax = abs(vMmPos.x) * mmScale; float ag = length(vec2(dFdx(ax), dFdy(ax))) + 1e-7;
    // linea alba: a touch wider above the navel, finer toward the pubis
    float mw = max((mmF[i1].z > 0.5 ? mix(0.0015, 0.0024, smoothstep(0.95, 1.05, p.y)) : 0.0022) / ag, 0.7);
    // the buttock cleft line stops before it reaches the smooth perineum
    float keep = 1.0 - (1.0 - smoothstep(0.80, 0.84, p.y)) * smoothstep(-0.075, -0.045, p.z);
    mmGrooveV = max(mmGrooveV, (1.0 - smoothstep(mw - 0.65, mw + 0.65, ax / ag)) * keep);
  }
  // rectus abdominis: three tendinous intersections + the linea alba, drawn
  // like the other division lines and rounding each segment into a block
  if (mmF[i1].z > 0.5) {
    float edge = 1.0;
    for (int k = 0; k < 3; k++) {
      float dy = mmAbsLine(p, vMmPos.x, k);
      float yg = length(vec2(dFdx(dy), dFdy(dy))) + 1e-7; float lw = max(0.0015 / yg, 0.6);
      mmGrooveV = max(mmGrooveV, (1.0 - smoothstep(lw - 0.6, lw + 0.6, abs(dy) / yg)) * 0.85);
      edge *= mix(0.45, 1.0, smoothstep(0.0, 0.016, abs(dy)));
    }
    edge *= mix(0.55, 1.0, smoothstep(0.0, 0.012, p.x));
    mmEdge *= edge;
  }
  float bg = length(vec2(dFdx(b1), dFdy(b1))) + 1e-6;
  mmIsMuscle = smoothstep(-0.5, 0.7, b1 / bg) * (mmF[i1].x < 0.5 ? 0.0 : 1.0);
  if (mmF[i1].x < 0.5) { mmSelV = 0.0; mmFocusV = 0.0; mmGrooveV *= 0.6; }
  mmCore = smoothstep(0.0, 0.5, b1);
  // reveal: highlighted panels fill from their centre outwards
  mmRevealT = 1.32 - 1.38 * mmReveal;
  mmShown = smoothstep(mmRevealT - 0.05, mmRevealT + 0.01, b1 / 0.85 + 0.12);
}`;function mf(i,e,{clothing:t=!1}={}){i.onBeforeCompile=n=>{Object.assign(n.uniforms,e),n.vertexShader=`varying vec3 vMmPos;
`+n.vertexShader.replace("#include <begin_vertex>",`#include <begin_vertex>
vMmPos = transformed;`),n.fragmentShader=Yy+`
`+n.fragmentShader,n.fragmentShader=n.fragmentShader.replace("void main() {",`void main() {
 mmEval();`).replace("#include <normal_fragment_maps>",`#include <normal_fragment_maps>
        {
          float h = ${t?"0.0":"mmEdge * mmIsMuscle"};
          vec3 vSigmaX = dFdx(-vViewPosition), vSigmaY = dFdy(-vViewPosition);
          vec3 R1 = cross(vSigmaY, normal), R2 = cross(normal, vSigmaX); float fDet = dot(vSigmaX, R1);
          vec2 dH = vec2(dFdx(h), dFdy(h)) * 0.004;
          vec3 grad = sign(fDet) * (dH.x * R1 + dH.y * R2);
          normal = normalize(abs(fDet) * normal - grad);
        }`).replace("#include <color_fragment>",`#include <color_fragment>
        {
          float primary = step(0.9, mmSelV), secondary = step(0.3, mmSelV) * (1.0 - primary), deep = step(mmSelV, -0.5);
          float sh = mmShown * mmIsMuscle;
          vec3 pc = mmPc;
          vec3 hot = mmMulti > 0.5
            ? pc * mix(0.70, 0.86, smoothstep(0.0, 0.5, mmS1)) * mix(0.74, 1.0, mmEdge)
            : mix(mmAccent2, pc, 0.55 + 0.45 * smoothstep(0.0, 0.5, mmS1)) * mix(0.78, 1.0, mmEdge);
          float anySel = primary + secondary + deep;
          float hA = max(fwidth(vMmPos.y) * 140.0, 0.02);
          float hatch = smoothstep(0.5 - hA, 0.5 + hA, abs(fract((vMmPos.x * 0.6 + vMmPos.y - vMmPos.z * 0.5) * 70.0) - 0.5) * 2.0);
          ${t?`
          vec3 col = mmFabric; sh *= mmCloth;
          col = mix(col, mix(mmFabric, pc * mix(0.86, 1.0, mmEdge), 0.86), primary * sh);
          col = mix(col, mix(mmFabric, pc, 0.42), secondary * sh);
          col = mix(col, mix(mmFabric, pc, 0.70), deep * sh * mix(0.25, 1.0, hatch));
          col = mix(col, mix(mmFabric, col, 0.12), mmDimV * anySel * sh);
          col = mix(col, col * 0.6, mmGrooveV * mmIsMuscle * anySel * sh * 0.6);
          `:`
          vec3 base = mix(mmSkin, mmBase * mix(0.80, 1.04, mmEdge), mmIsMuscle);
          vec3 col = base;
          col = mix(col, hot, primary * sh);
          col = mix(col, mix(mmBase, pc, 0.52) * mix(0.85, 1.0, mmEdge), secondary * sh);
          col = mix(col, mix(mmBase, pc, 0.80), deep * sh * mix(0.18, 1.0, hatch));
          col = mix(col, mix(base, col, 0.10), mmDimV * anySel * sh);
          if (mmDebug > 0.5) col = mix(mmSkin, mmHue(mmIdx), mmIsMuscle);
          col = mix(col, mmGroove, mmGrooveV * mix(0.40, 0.82, mmIsMuscle));
          `}
          diffuseColor.rgb = col;
          ${t?`{
            float ax = abs(vMmPos.x);
            float cut = 0.778 + 1.05 * max(ax - 0.028, 0.0);
            float e = vMmPos.y - cut; float ea = max(fwidth(e), 1e-5);
            diffuseColor.a = smoothstep(-ea, ea, e);
            if (diffuseColor.a < 0.01) discard;
            col = mix(col, col * 1.5 + 0.03, (1.0 - smoothstep(0.0, 0.010, abs(vMmPos.y - 0.968))) * 0.6);
            diffuseColor.rgb = col;
          }`:""}
        }`).replace("#include <emissivemap_fragment>",`#include <emissivemap_fragment>
        {
          float lit = (step(0.3, mmSelV) + step(mmSelV, -0.5) * 0.6) * mmIsMuscle * (1.0 - mmGrooveV) * mmShown;
          float pulse = 0.5 + 0.5 * sin(mmTime * 2.4);
          float front = smoothstep(0.0, 0.08, mmS1) * (1.0 - smoothstep(0.0, 0.10, abs(mmS1 / 0.85 + 0.12 - mmRevealT))) * step(mmReveal, 0.985);
          ${t?"lit *= mmCloth; front *= mmCloth;":""}
          lit *= 1.0 - 0.85 * mmDimV;
          totalEmissiveRadiance += mmPc * (lit * (0.10 + 0.08 * pulse + 0.40 * mmFocusV * pulse) + front * 0.6 * step(0.3, abs(mmSelV)));
          float rim = pow(1.0 - clamp(abs(dot(normal, normalize(vViewPosition))), 0.0, 1.0), 3.0);
          totalEmissiveRadiance += vec3(0.50, 0.60, 0.80) * rim * ${t?"0.18":"0.32"};
        }`)},i.customProgramCacheKey=()=>"muscle-map-v4"+(t?"-c":""),i.needsUpdate=!0}function gf(i,e){const t=i.mmState.value,n=new Set;for(const r of t)r.x=0,r.y=0,r.w=0;for(const r of e){const s=Nr[r.muscle];if(!s)continue;const o=t[s.index],a=r.level==="deep"?-1:r.level==="secondary"?.6:1,c=u=>u===1?3:u===-1?2:u?1:0;c(a)>c(o.x)&&(o.x=a);const l=r.side==="left"?1:r.side==="right"?-1:0,h=!n.has(s.index);o.y=!h&&o.y!==l?0:l,n.add(s.index),r.colour&&i.mmCol.value[s.index].set(r.colour),o.w=h?r.dim??0:Math.min(o.w,r.dim??0)}}function $y(i,e=[]){const t=i.mmState.value;for(const n of t)n.z=0;for(const n of e){const r=Nr[n];r&&(t[r.index].z=1)}}const Zo={shoulder:[.19,1.36,-.005],elbow:[.29,1.085,-.005],wrist:[.365,.875,.02],palm:[.39,.8,.04],hip:[.09,.86,0],knee:[.12,.47,0],ankle:[.15,.08,-.02],toe:[.17,.03,.13]},Zy={UpperArm:["Shoulder","Elbow","shoulder","elbow"],Forearm:["Elbow","Wrist","elbow","wrist"],Hand:["Wrist","Palm","wrist","palm"],Thigh:["Hip","Knee","hip","knee"],Patella:["Knee","Ankle","knee","ankle"],Shin:["Knee","Ankle","knee","ankle"],Foot:["Ankle","Toe","ankle","toe"]};function Jy(i,e){const t=i.getMetrics().time;i.reset(),e.updateMatrixWorld(!0);const n=i.getMetrics().joints,r={},s=(d,p)=>new A(p==="left"?Zo[d][0]:-Zo[d][0],Zo[d][1],Zo[d][2]);for(const d of["left","right"])for(const[p,[g,b,m,f]]of Object.entries(Zy)){const y=new A().fromArray(n[d+g]),x=new A().fromArray(n[d+b]),_=s(m,d),I=s(f,d);r[d+p]={P0:y,Q0:_,rotation:new Ve().setFromUnitVectors(x.clone().sub(y).normalize(),I.clone().sub(_).normalize()),scale:I.distanceTo(_)/x.distanceTo(y)}}const o=[],a=new A,c=new A,l=new A,h=new vt,u=new vt;return e.traverse(d=>{if(!d.isSkinnedMesh)return;const p=d.geometry,g=p.attributes.position.count,b=new Float32Array(g*3),m=p.attributes.skinIndex,f=p.attributes.skinWeight,y=d.skeleton.bones;d.skeleton.update();for(let x=0;x<g;x++){d.getVertexPosition(x,a).applyMatrix4(d.matrixWorld),h.fromBufferAttribute(m,x),u.fromBufferAttribute(f,x),c.set(0,0,0);let _=0;for(let I=0;I<4;I++){const L=u.getComponent(I);if(L<=0)continue;const C=r[y[h.getComponent(I)]?.name];C?l.copy(a).sub(C.P0).applyQuaternion(C.rotation).multiplyScalar(C.scale).add(C.Q0):l.copy(a),c.addScaledVector(l,L),_+=L}c.multiplyScalar(1/(_||1)),c.toArray(b,x*3)}p.setAttribute("mmRest",new wn(b,3)),o.push(d)}),i.update(t),e.updateMatrixWorld(!0),o}const ha={};for(const[i,e]of Object.entries(va))if(bi[i])for(const t of e.muscles)(ha[t]??(ha[t]=[])).push(i);function eM(i,e){const t=new zd,n=new at,r=new A,s=new A,o=new A,a=new A,c=new $n,l=new A,h=new A;let u=null;function d(){i.coach.updateMatrixWorld(!0);for(const g of e)g.skeleton.update(),g.computeBoundingSphere(),g.computeBoundingBox();u=i.time}function p(g,b,m){u!==i.time&&d();const f=i.renderer.domElement.getBoundingClientRect();n.set((g-f.left)/f.width*2-1,-(b-f.top)/f.height*2+1),t.setFromCamera(n,i.camera);const y=t.intersectObjects(e.filter(x=>x.visible),!1);for(const x of y){const _=x.object,I=x.face,L=_.geometry.getAttribute("mmRest");if(!I||!L||(_.getVertexPosition(I.a,r).applyMatrix4(_.matrixWorld),_.getVertexPosition(I.b,s).applyMatrix4(_.matrixWorld),_.getVertexPosition(I.c,o).applyMatrix4(_.matrixWorld),!c.set(r,s,o).getBarycoord(x.point,a)))continue;l.fromBufferAttribute(L,I.a).multiplyScalar(a.x),l.addScaledVector(h.fromBufferAttribute(L,I.b),a.y).addScaledVector(h.fromBufferAttribute(L,I.c),a.z);const C=ff(l,1.69);if(!C)continue;const F=ha[C.id]??[],w=F.map(T=>m.find(j=>j.groupId===T&&(j.side==="both"||j.side===C.side))).find(Boolean),v=w?.groupId??F[0];if(v)return{groupId:v,side:C.side,panelId:C.id,inPhase:!!w}}return null}return{pick:p,prepare:d}}function tM(i){const e=pf(),t=new Map,n=new Map;e.mmMulti.value=1,e.mmReveal.value=1,e.mmTime.value=.654,e.mmBase.value.set("#737b88"),e.mmSkin.value.set("#59606c"),e.mmGroove.value.set("#2b313c");for(const o of i){t.set(o,o.material);const a=new Ir({color:16777215,roughness:.68,metalness:0});mf(a,e,{clothing:!1});const c=a.onBeforeCompile;a.onBeforeCompile=(l,h)=>{c(l,h),l.vertexShader=`attribute vec3 mmRest;
`+l.vertexShader.replace("vMmPos = transformed;","vMmPos = mmRest;"),l.fragmentShader=l.fragmentShader.replace("vec2(dFdx(h), dFdy(h)) * 0.004","vec2(0.0)")},a.customProgramCacheKey=()=>"flare-posed-functional-surface-v1",n.set(o,a)}function r(o,a,c=!1){if(!o){s();return}const l=[...a];l.some(u=>u.groupId===o)||l.push({groupId:o,level:"primary",side:"both",colour:bi[o].colour});const h=[];for(const u of l){if(!c&&u.groupId!==o)continue;const d=Nl(u.groupId);if(d)for(const p of d.muscles)h.push({muscle:p,side:u.side,colour:u.colour,level:d.deep&&u.level==="primary"?"deep":u.level,dim:u.groupId===o?0:u.level==="primary"?.45:.7})}gf(e,h),$y(e,Nl(o)?.muscles??[]);for(const[u,d]of n)u.material=d}function s(){for(const[o,a]of t)o.material=a}return{show:r,restore:s,releaseGpu(){for(const o of new Set([...t.values()].flat()))o.dispose();for(const o of n.values())o.dispose()},dispose(){s();for(const o of n.values())o.dispose()}}}function nM(i){let e=null,t=null,n=!1;const r=new vn(32,1,.02,40),s=document.createElement("button");s.className="minimap",s.hidden=!0,s.setAttribute("aria-label","切换全身或局部视图"),s.innerHTML="<span>全身定位 ↗</span>",i.container.append(s);function o(u,d){const p=bi[u],g=i.getMetrics().joints,b=d.items.find(_=>_.groupId===u),m=b?.side==="left"||b?.side==="right"?b.side:d.support==="both"?i.camera.position.x>0?"left":"right":d.support,f=p.section==="support"?[m+"Shoulder",m+"Elbow",m+"Palm","head","rightHip","leftHip",iM(m)+"Shoulder"]:p.section==="core"?["leftShoulder","rightShoulder","leftHip","rightHip","pelvis","head"]:["leftHip","rightHip","leftKnee","rightKnee","leftAnkle","rightAnkle","pelvis"],y=new an;for(const _ of f)g[_]&&y.expandByPoint(new A().fromArray(g[_]));y.expandByScalar(p.section==="support"?.1:.12);const x=i.camera.position.clone().sub(i.controls.target);i.fitBounds(y,x,1.02)}function a(u,d){e||(e={position:i.camera.position.clone(),target:i.controls.target.clone(),framingMode:i.framingMode}),i.setFramingMode("detail"),t=u,n=!1,s.hidden=!1,o(u,d)}function c(){e&&(i.setFramingMode(e.framingMode),i.camera.position.copy(e.position),i.controls.target.copy(e.target),i.controls.update(),e=null,i.dirty=!0),t=null,s.hidden=!0}function l(u){if(t){if(n=!n,n){const d=i.getMetrics().bounds,p=new an(new A().fromArray(d.min),new A().fromArray(d.max));i.fitBounds(p.expandByScalar(.04),i.camera.position.clone().sub(i.controls.target),.88)}else o(t,u);s.querySelector("span").textContent=n?"返回局部 ↗":"全身定位 ↗"}}function h(){if(!t||s.hidden)return;const u=s.getBoundingClientRect(),d=i.container.getBoundingClientRect(),p=u.width,g=u.height,b=u.left-d.left,m=d.height-(u.bottom-d.top),f=i.getMetrics().bounds,y=new an(new A().fromArray(f.min),new A().fromArray(f.max)),x=y.getCenter(new A),_=y.getSize(new A).length()/2,I=i.camera.position.clone().sub(i.controls.target).normalize();r.aspect=p/g,r.updateProjectionMatrix(),r.position.copy(x).addScaledVector(I,_/Math.sin(Nt.degToRad(16))*1.05),r.lookAt(x);const L=i.renderer;L.setScissorTest(!0),L.setScissor(b,m,p,g),L.setViewport(b,m,p,g),L.setClearColor(1513762,1),L.render(i.scene,r),L.setScissorTest(!1),L.setViewport(0,0,d.width,d.height),L.setClearColor(1052950,0)}return{open:a,close:c,toggle:l,renderMini:h,mini:s,dispose(){c(),s.remove()}}}const iM=i=>i==="left"?"right":"left";async function rM(i,e){const{scene:t}=await of("./anatomy/mannequin-reference.meshopt.glb.gz"),n=new Ql;n.background=new it("#1f1f24"),n.add(t),n.add(new kd(15397631,3420989,2));const r=new ls(16773860,3);r.position.set(-2,3,4),n.add(r);const s=new ls(15199487,2);s.position.set(2,2,-3),n.add(s);const o=pf();o.mmMulti.value=1,o.mmReveal.value=1,o.mmTime.value=.654,o.mmBase.value.set("#727b8b"),o.mmSkin.value.set("#565f70"),o.mmGroove.value.set("#2b3343");const a=[],c=new Set;t.traverse(v=>{if(!v.isMesh)return;for(const j of[].concat(v.material))j.dispose();const T=new Ir({color:16777215,roughness:.72,metalness:0});mf(T,o),v.material=T,a.push(v),c.add(T)}),t.updateMatrixWorld(!0);const l=[1,-1].map(v=>{const T=new vn(26,.5,.02,20);return T.position.set(0,.845,v*4),T.lookAt(0,.845,0),T.updateMatrixWorld(!0),T}),h=document.createElement("aside");h.className="phase-map",h.setAttribute("aria-label","随动作阶段同步的肌群正面和背面定位图"),h.innerHTML='<header><i></i><span>同步发力</span></header><div class="phase-map-view"><span>正面</span><span>背面</span></div><div class="phase-map-legend"></div>',i.container.append(h);const u=h.querySelector(".phase-map-view"),d=h.querySelector(".phase-map-legend"),p=document.createElement("canvas");p.setAttribute("aria-hidden","true"),u.prepend(p);const g=p.getContext("2d"),b=new zd,m=new at,f=new A;let y=null,x=!1,_=[];const I={"hip-abductors":"臀中肌",abs:"腹直肌","rotator-cuff":"肩袖",forearms:"前臂",scapular:"肩胛肌群",adductors:"内收肌"};function L(v){const T=u.getBoundingClientRect(),j=T.width/2,q=v.clientX-T.left<j?0:1;m.set((v.clientX-T.left-j*q)/j*2-1,-(v.clientY-T.top)/T.height*2+1),b.setFromCamera(m,l[q]);const se=Wn(i.time);for(const ne of b.intersectObjects(a)){const $=ff(ne.object.worldToLocal(f.copy(ne.point)),1.69);if(!$)continue;const ce=Object.entries(va).filter(([k,W])=>bi[k]&&W.muscles.includes($.id)).map(([k])=>k),P=ce.find(k=>se.items.some(W=>W.groupId===k&&(W.side==="both"||W.side===$.side)))??ce[0];if(P){e(P);return}}}u.addEventListener("click",L);function C(){if(x)return;const v=Wn(i.time);if(v.source!==y){y=v.source;const k=[];for(const W of v.items){const re=Nl(W.groupId);if(re)for(const he of re.muscles)k.push({muscle:he,side:W.side,colour:W.colour,level:re.deep&&W.level==="primary"?"deep":W.level,dim:W.level==="primary"?0:.5})}gf(o,k),_=["support","core","legs"].map(W=>v.items.find(re=>bi[re.groupId].section===W&&re.level==="primary")??v.items.find(re=>bi[re.groupId].section===W)).filter(Boolean),d.replaceChildren();for(const W of _){const re=document.createElement("button");re.type="button",re.dataset.groupId=W.groupId,re.setAttribute("aria-label","查看"+W.label);const he=document.createElement("i");he.style.background=W.colour,re.append(he,I[W.groupId]??W.label),re.addEventListener("click",()=>e(W.groupId)),d.append(re)}}const T=u.getBoundingClientRect(),j=i.container.getBoundingClientRect(),q=T.width/2,se=j.height-(T.bottom-j.top),ne=i.renderer;n.environment=i.scene.environment,ne.setScissorTest(!0);for(let k=0;k<2;k++){l[k].aspect=q/T.height,l[k].updateProjectionMatrix();const W=T.left-j.left+q*k;ne.setScissor(W,se,q,T.height),ne.setViewport(W,se,q,T.height),ne.render(n,l[k])}const $=ne.getPixelRatio(),ce=Math.round(T.width*$),P=Math.round(T.height*$);(p.width!==ce||p.height!==P)&&(p.width=ce,p.height=P),g.drawImage(ne.domElement,(T.left-j.left)*$,(T.top-j.top)*$,T.width*$,T.height*$,0,0,ce,P),ne.setScissorTest(!1),ne.setViewport(0,0,j.width,j.height),ne.setClearColor(1052950,0)}function F(v){x=v,h.hidden=v,i.dirty=!0}function w(){for(const v of a)v.geometry.dispose();for(const v of c)v.dispose()}return{render:C,setHidden:F,releaseGpu:w,getState:()=>({phase:y,hidden:x,views:["front","back"],legend:_.map(v=>({groupId:v.groupId,label:I[v.groupId]??v.label})),referencePose:"static CC0 mannequin"}),dispose(){w(),u.removeEventListener("click",L),h.remove()}}}const sM=document.querySelector("#stage"),ya=document.querySelector("#status"),oM=document.querySelector("#status-text"),bf=document.querySelector("#retry"),Yu=document.querySelector("#hotspots"),_f=document.querySelector("#detail-note");let Pe,Dc,ki,Bi,Pr,ur=!1,Fn=null,gi=!1,ua=[],nh=null,fs=[],Jo=null,$u=0,Xs=new Map;function Ns(i){const e={source:"flare-scene",...i};window.FlareHost?.postMessage?window.FlareHost.postMessage(JSON.stringify(e)):window.parent!==window&&window.parent.postMessage(e,window.location.origin)}function xf(){return{type:"state",time:Pe?.time??0,period:Pe?.period??9,playing:Pe?.playing??!1,speed:Pe?.speed??.5,phase:Wn(Pe?.time??0).source,selected:Fn,detail:gi,loop:Pe?.loopRange?{start:Pe.loopRange[0],end:Pe.loopRange[1]}:null,quality:Pe?.quality??"medium",ready:ur,errorCode:nh}}function ps(i=!1){if(!ur)return;const e=performance.now();!i&&e-$u<100||($u=e,Ns(xf()))}function Zu(i,e=!1){nh=i,ya.hidden=!1,ya.dataset.error="true",oM.textContent=e?"三维画面暂时中断，正在等待图形恢复。也可重新载入。":"三维动作暂时无法载入，请重新载入。",bf.hidden=!1,Ns({type:"error",code:i,errorCode:i}),ps(!0)}function ih(){if(!ur||Pe.playing||gi){ua=[],Yu.replaceChildren(),Xs.clear();return}ua=Hy(Pe,Wn(Pe.time).items);const i=new Set;for(const e of ua){i.add(e.groupId);let t=Xs.get(e.groupId);t||(t=document.createElement("button"),t.className="hotspot",t.type="button",t.dataset.groupId=e.groupId,t.setAttribute("aria-label","查看"+e.label),t.title=e.label,t.addEventListener("click",()=>vf(e.groupId)),Yu.append(t),Xs.set(e.groupId,t)),t.style.left=e.x+"px",t.style.top=e.y+"px",t.style.setProperty("--accent",e.colour),t.dataset.selected=String(e.groupId===Fn)}for(const[e,t]of Xs)i.has(e)||(t.remove(),Xs.delete(e))}function da(){Bi?.close(),gi=!1,_f.hidden=!0,Pr?.setHidden(!1);for(const i of Pe?.stageProps??[])i.visible=i===Pe.shadowCatcher?Pe.renderer.shadowMap.enabled:!0}function Ma(i,e=gi){if(Pe.playing=!1,!i)da(),Fn=null,ki.restore();else{Fn=i,gi=!!e;const t=Wn(Pe.time);if(ki.show(Fn,t.items,gi),gi){Bi.open(Fn,t),_f.hidden=!1,Pr?.setHidden(!0);for(const n of Pe.stageProps)n.visible=!1}}Pe.dirty=!0,ih(),ps(!0)}function vf(i){!ur||Pe.playing||(Ma(i),Ns({type:"select",groupId:i,time:Pe.time}))}function aM(i){ur&&(Ma(i),Ns({type:"select",groupId:i,time:Pe.time}))}function Sa(i){let e=i;if(typeof e=="string")try{e=JSON.parse(e)}catch{Ns({type:"error",code:"invalid_command",errorCode:"invalid_command"});return}if(!(!e||typeof e!="object"||typeof e.type!="string")){if(!ur){fs.push(e),fs.length>32&&fs.shift();return}switch(e.type){case"play":da(),Fn=null,ki.restore(),Pe.time>=Pe.period&&Pe.setTime(0),Pe.playing=Pe.visible&&!document.hidden&&!Pe.contextLost,Pe.start();break;case"pause":Pe.playing=!1;break;case"seek":{const t=Number(e.time);if(!Number.isFinite(t))return;da(),Fn=null,ki.restore(),Pe.playing=!1,Pe.loopRange=null,Pe.setTime(t);break}case"speed":[.25,.5,1].includes(Number(e.value))&&(Pe.speed=Number(e.value));break;case"loop":{if(e.start==null||e.end==null)Pe.loopRange=null;else{const t=Number(e.start),n=Number(e.end);if(!Number.isFinite(t)||!Number.isFinite(n)||t<0||n>Pe.period||n-t<=.001)return;Pe.loopRange=[t,n],(Pe.time<t||Pe.time>=n)&&Pe.setTime(t)}break}case"reset":Pe.resetView(),gi&&Fn&&Bi.open(Fn,Wn(Pe.time));break;case"camera":{if(!Dl[e.view])return;Pe.resetView(Dl[e.view]),gi&&Fn&&Bi.open(Fn,Wn(Pe.time));break}case"select":if(e.groupId==null||bi[e.groupId])Ma(e.groupId??null);else return;break;case"detail":if(e.groupId==null)da(),Fn?ki.show(Fn,Wn(Pe.time).items,!1):ki.restore();else if(bi[e.groupId])Ma(e.groupId,!0);else return;break;case"quality":Pe.setQuality(e.value);break;case"visibility":Pe.setVisible(e.visible);break;default:return}Pe.dirty=!0,ih(),ps(!0)}}window.flareBridge=Object.freeze({command:Sa});function yf(i){i.source!==window.parent||i.origin!==window.location.origin||i.data?.source!=="flare-host"||Sa(i.data.command)}window.addEventListener("message",yf);bf.addEventListener("click",()=>window.location.reload());async function cM(){try{Pe=new Cy(sM,{onTime:()=>ps(),onRender:()=>{ih(),gi?Bi?.renderMini():Pr?.render()},onContext:r=>{r?(nh=null,ya.hidden=!0,ps(!0)):(ki?.releaseGpu(),Pr?.releaseGpu(),Zu("graphics_context_lost",!0))}}),await Promise.all([Pe.load(),rM(Pe,aM).then(r=>{Pr=r})]),Pe.resetView();const i=Jy(Pe.motion,Pe.coach);Dc=eM(Pe,i),ki=tM(i),Bi=nM(Pe),Bi.mini.addEventListener("click",()=>Bi.toggle(Wn(Pe.time)));const e=Pe.renderer.domElement;e.addEventListener("pointerdown",r=>{Jo={x:r.clientX,y:r.clientY,time:performance.now()}}),e.addEventListener("pointercancel",()=>{Jo=null}),e.addEventListener("pointerup",r=>{const s=Jo;if(Jo=null,!s||Pe.playing||performance.now()-s.time>550||Math.hypot(r.clientX-s.x,r.clientY-s.y)>7)return;const o=Dc.pick(r.clientX,r.clientY,Wn(Pe.time).items);o&&vf(o.groupId)}),ur=!0,ya.hidden=!0,Pe.dirty=!0;const t=i.reduce((r,s)=>({meshes:r.meshes+1,vertices:r.vertices+s.geometry.attributes.position.count,triangles:r.triangles+(s.geometry.index?.count??s.geometry.attributes.position.count)/3}),{meshes:0,vertices:0,triangles:0});window.__flareScene=Object.freeze({getMetrics:()=>Pe.getMetrics(),getState:xf,getHotspots:()=>ua.map(r=>({...r})),hitTest:(r,s)=>Dc.pick(r,s,Wn(Pe.time).items),getPhaseMap:()=>Pr?.getState(),getCamera:()=>({position:Pe.camera.position.toArray(),target:Pe.controls.target.toArray(),aspect:Pe.camera.aspect}),setTime:r=>Sa({type:"seek",time:r}),phaseAt:Wn,phaseTicks:Ku,pacingRate:r=>Pe.pacingRate(r),geometryStats:{...t}}),Ns({type:"ready",period:Pe.period,time:Pe.time,phase:Wn(Pe.time).source,phases:Ku});const n=fs;fs=[];for(const r of n)Sa(r);ps(!0)}catch(i){Pe?.stop(),Zu(i?.message==="rig_load_failed"?"rig_load_failed":"scene_load_failed")}}function lM(){ur=!1,fs=[],window.removeEventListener("message",yf),Bi?.dispose(),ki?.dispose(),Pr?.dispose(),Pe?.dispose()}window.addEventListener("pagehide",i=>{i.persisted?Pe?.setVisible(!1):lM()});window.addEventListener("pageshow",i=>{i.persisted&&Pe?.setVisible(!0)});cM();
