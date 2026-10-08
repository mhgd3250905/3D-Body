(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const r of document.querySelectorAll('link[rel="modulepreload"]'))n(r);new MutationObserver(r=>{for(const s of r)if(s.type==="childList")for(const o of s.addedNodes)o.tagName==="LINK"&&o.rel==="modulepreload"&&n(o)}).observe(document,{childList:!0,subtree:!0});function t(r){const s={};return r.integrity&&(s.integrity=r.integrity),r.referrerPolicy&&(s.referrerPolicy=r.referrerPolicy),r.crossOrigin==="use-credentials"?s.credentials="include":r.crossOrigin==="anonymous"?s.credentials="omit":s.credentials="same-origin",s}function n(r){if(r.ep)return;r.ep=!0;const s=t(r);fetch(r.href,s)}})();const Ol="170",os={ROTATE:0,DOLLY:1,PAN:2},is={ROTATE:0,PAN:1,DOLLY_PAN:2,DOLLY_ROTATE:3},Pf=0,uh=1,Lf=2,nd=1,id=2,Ii=3,Wi=0,Cn=1,xi=2,cr=0,as=1,dh=2,fh=3,ph=4,Df=5,Cr=100,If=101,Nf=102,Ff=103,Uf=104,Of=200,kf=201,Bf=202,zf=203,Uc=204,Oc=205,Hf=206,Vf=207,Gf=208,Wf=209,qf=210,jf=211,Xf=212,Qf=213,Kf=214,kc=0,Bc=1,zc=2,gs=3,Hc=4,Vc=5,Gc=6,Wc=7,rd=0,Yf=1,$f=2,lr=0,Zf=1,Jf=2,ep=3,sd=4,tp=5,np=6,ip=7,mh="attached",rp="detached",od=300,bs=301,_s=302,qc=303,jc=304,Aa=306,xs=1e3,or=1001,ma=1002,Pn=1003,ad=1004,Ks=1005,jn=1006,na=1007,Oi=1008,qi=1009,cd=1010,ld=1011,io=1012,kl=1013,Nr=1014,li=1015,ho=1016,Bl=1017,zl=1018,vs=1020,hd=35902,ud=1021,dd=1022,ei=1023,fd=1024,pd=1025,cs=1026,ys=1027,Hl=1028,Vl=1029,md=1030,Gl=1031,Wl=1033,ia=33776,ra=33777,sa=33778,oa=33779,Xc=35840,Qc=35841,Kc=35842,Yc=35843,$c=36196,Zc=37492,Jc=37496,el=37808,tl=37809,nl=37810,il=37811,rl=37812,sl=37813,ol=37814,al=37815,cl=37816,ll=37817,hl=37818,ul=37819,dl=37820,fl=37821,aa=36492,pl=36494,ml=36495,gd=36283,gl=36284,bl=36285,_l=36286,ro=2300,so=2301,za=2302,gh=2400,bh=2401,_h=2402,sp=2500,op=0,bd=1,xl=2,ap=3200,cp=3201,_d=0,lp=1,rr="",ln="srgb",Ln="srgb-linear",Ta="linear",jt="srgb",kr=7680,xh=519,hp=512,up=513,dp=514,xd=515,fp=516,pp=517,mp=518,gp=519,vl=35044,vh="300 es",ki=2e3,ga=2001;class Ur{addEventListener(e,t){this._listeners===void 0&&(this._listeners={});const n=this._listeners;n[e]===void 0&&(n[e]=[]),n[e].indexOf(t)===-1&&n[e].push(t)}hasEventListener(e,t){if(this._listeners===void 0)return!1;const n=this._listeners;return n[e]!==void 0&&n[e].indexOf(t)!==-1}removeEventListener(e,t){if(this._listeners===void 0)return;const r=this._listeners[e];if(r!==void 0){const s=r.indexOf(t);s!==-1&&r.splice(s,1)}}dispatchEvent(e){if(this._listeners===void 0)return;const n=this._listeners[e.type];if(n!==void 0){e.target=this;const r=n.slice(0);for(let s=0,o=r.length;s<o;s++)r[s].call(this,e);e.target=null}}}const Mn=["00","01","02","03","04","05","06","07","08","09","0a","0b","0c","0d","0e","0f","10","11","12","13","14","15","16","17","18","19","1a","1b","1c","1d","1e","1f","20","21","22","23","24","25","26","27","28","29","2a","2b","2c","2d","2e","2f","30","31","32","33","34","35","36","37","38","39","3a","3b","3c","3d","3e","3f","40","41","42","43","44","45","46","47","48","49","4a","4b","4c","4d","4e","4f","50","51","52","53","54","55","56","57","58","59","5a","5b","5c","5d","5e","5f","60","61","62","63","64","65","66","67","68","69","6a","6b","6c","6d","6e","6f","70","71","72","73","74","75","76","77","78","79","7a","7b","7c","7d","7e","7f","80","81","82","83","84","85","86","87","88","89","8a","8b","8c","8d","8e","8f","90","91","92","93","94","95","96","97","98","99","9a","9b","9c","9d","9e","9f","a0","a1","a2","a3","a4","a5","a6","a7","a8","a9","aa","ab","ac","ad","ae","af","b0","b1","b2","b3","b4","b5","b6","b7","b8","b9","ba","bb","bc","bd","be","bf","c0","c1","c2","c3","c4","c5","c6","c7","c8","c9","ca","cb","cc","cd","ce","cf","d0","d1","d2","d3","d4","d5","d6","d7","d8","d9","da","db","dc","dd","de","df","e0","e1","e2","e3","e4","e5","e6","e7","e8","e9","ea","eb","ec","ed","ee","ef","f0","f1","f2","f3","f4","f5","f6","f7","f8","f9","fa","fb","fc","fd","fe","ff"];let yh=1234567;const Zs=Math.PI/180,Ms=180/Math.PI;function ui(){const i=Math.random()*4294967295|0,e=Math.random()*4294967295|0,t=Math.random()*4294967295|0,n=Math.random()*4294967295|0;return(Mn[i&255]+Mn[i>>8&255]+Mn[i>>16&255]+Mn[i>>24&255]+"-"+Mn[e&255]+Mn[e>>8&255]+"-"+Mn[e>>16&15|64]+Mn[e>>24&255]+"-"+Mn[t&63|128]+Mn[t>>8&255]+"-"+Mn[t>>16&255]+Mn[t>>24&255]+Mn[n&255]+Mn[n>>8&255]+Mn[n>>16&255]+Mn[n>>24&255]).toLowerCase()}function xn(i,e,t){return Math.max(e,Math.min(t,i))}function ql(i,e){return(i%e+e)%e}function bp(i,e,t,n,r){return n+(i-e)*(r-n)/(t-e)}function _p(i,e,t){return i!==e?(t-i)/(e-i):0}function Js(i,e,t){return(1-t)*i+t*e}function xp(i,e,t,n){return Js(i,e,1-Math.exp(-t*n))}function vp(i,e=1){return e-Math.abs(ql(i,e*2)-e)}function yp(i,e,t){return i<=e?0:i>=t?1:(i=(i-e)/(t-e),i*i*(3-2*i))}function Mp(i,e,t){return i<=e?0:i>=t?1:(i=(i-e)/(t-e),i*i*i*(i*(i*6-15)+10))}function Sp(i,e){return i+Math.floor(Math.random()*(e-i+1))}function wp(i,e){return i+Math.random()*(e-i)}function Ep(i){return i*(.5-Math.random())}function Ap(i){i!==void 0&&(yh=i);let e=yh+=1831565813;return e=Math.imul(e^e>>>15,e|1),e^=e+Math.imul(e^e>>>7,e|61),((e^e>>>14)>>>0)/4294967296}function Tp(i){return i*Zs}function Rp(i){return i*Ms}function Cp(i){return(i&i-1)===0&&i!==0}function Pp(i){return Math.pow(2,Math.ceil(Math.log(i)/Math.LN2))}function Lp(i){return Math.pow(2,Math.floor(Math.log(i)/Math.LN2))}function Dp(i,e,t,n,r){const s=Math.cos,o=Math.sin,a=s(t/2),c=o(t/2),l=s((e+n)/2),h=o((e+n)/2),u=s((e-n)/2),d=o((e-n)/2),p=s((n-e)/2),g=o((n-e)/2);switch(r){case"XYX":i.set(a*h,c*u,c*d,a*l);break;case"YZY":i.set(c*d,a*h,c*u,a*l);break;case"ZXZ":i.set(c*u,c*d,a*h,a*l);break;case"XZX":i.set(a*h,c*g,c*p,a*l);break;case"YXY":i.set(c*p,a*h,c*g,a*l);break;case"ZYZ":i.set(c*g,c*p,a*h,a*l);break;default:console.warn("THREE.MathUtils: .setQuaternionFromProperEuler() encountered an unknown order: "+r)}}function ci(i,e){switch(e.constructor){case Float32Array:return i;case Uint32Array:return i/4294967295;case Uint16Array:return i/65535;case Uint8Array:return i/255;case Int32Array:return Math.max(i/2147483647,-1);case Int16Array:return Math.max(i/32767,-1);case Int8Array:return Math.max(i/127,-1);default:throw new Error("Invalid component type.")}}function Ht(i,e){switch(e.constructor){case Float32Array:return i;case Uint32Array:return Math.round(i*4294967295);case Uint16Array:return Math.round(i*65535);case Uint8Array:return Math.round(i*255);case Int32Array:return Math.round(i*2147483647);case Int16Array:return Math.round(i*32767);case Int8Array:return Math.round(i*127);default:throw new Error("Invalid component type.")}}const Nt={DEG2RAD:Zs,RAD2DEG:Ms,generateUUID:ui,clamp:xn,euclideanModulo:ql,mapLinear:bp,inverseLerp:_p,lerp:Js,damp:xp,pingpong:vp,smoothstep:yp,smootherstep:Mp,randInt:Sp,randFloat:wp,randFloatSpread:Ep,seededRandom:Ap,degToRad:Tp,radToDeg:Rp,isPowerOfTwo:Cp,ceilPowerOfTwo:Pp,floorPowerOfTwo:Lp,setQuaternionFromProperEuler:Dp,normalize:Ht,denormalize:ci};class ht{constructor(e=0,t=0){ht.prototype.isVector2=!0,this.x=e,this.y=t}get width(){return this.x}set width(e){this.x=e}get height(){return this.y}set height(e){this.y=e}set(e,t){return this.x=e,this.y=t,this}setScalar(e){return this.x=e,this.y=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;default:throw new Error("index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;default:throw new Error("index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y)}copy(e){return this.x=e.x,this.y=e.y,this}add(e){return this.x+=e.x,this.y+=e.y,this}addScalar(e){return this.x+=e,this.y+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this}subScalar(e){return this.x-=e,this.y-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this}multiply(e){return this.x*=e.x,this.y*=e.y,this}multiplyScalar(e){return this.x*=e,this.y*=e,this}divide(e){return this.x/=e.x,this.y/=e.y,this}divideScalar(e){return this.multiplyScalar(1/e)}applyMatrix3(e){const t=this.x,n=this.y,r=e.elements;return this.x=r[0]*t+r[3]*n+r[6],this.y=r[1]*t+r[4]*n+r[7],this}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this}clamp(e,t){return this.x=Math.max(e.x,Math.min(t.x,this.x)),this.y=Math.max(e.y,Math.min(t.y,this.y)),this}clampScalar(e,t){return this.x=Math.max(e,Math.min(t,this.x)),this.y=Math.max(e,Math.min(t,this.y)),this}clampLength(e,t){const n=this.length();return this.divideScalar(n||1).multiplyScalar(Math.max(e,Math.min(t,n)))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this}negate(){return this.x=-this.x,this.y=-this.y,this}dot(e){return this.x*e.x+this.y*e.y}cross(e){return this.x*e.y-this.y*e.x}lengthSq(){return this.x*this.x+this.y*this.y}length(){return Math.sqrt(this.x*this.x+this.y*this.y)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)}normalize(){return this.divideScalar(this.length()||1)}angle(){return Math.atan2(-this.y,-this.x)+Math.PI}angleTo(e){const t=Math.sqrt(this.lengthSq()*e.lengthSq());if(t===0)return Math.PI/2;const n=this.dot(e)/t;return Math.acos(xn(n,-1,1))}distanceTo(e){return Math.sqrt(this.distanceToSquared(e))}distanceToSquared(e){const t=this.x-e.x,n=this.y-e.y;return t*t+n*n}manhattanDistanceTo(e){return Math.abs(this.x-e.x)+Math.abs(this.y-e.y)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this}lerpVectors(e,t,n){return this.x=e.x+(t.x-e.x)*n,this.y=e.y+(t.y-e.y)*n,this}equals(e){return e.x===this.x&&e.y===this.y}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this}rotateAround(e,t){const n=Math.cos(t),r=Math.sin(t),s=this.x-e.x,o=this.y-e.y;return this.x=s*n-o*r+e.x,this.y=s*r+o*n+e.y,this}random(){return this.x=Math.random(),this.y=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y}}class yt{constructor(e,t,n,r,s,o,a,c,l){yt.prototype.isMatrix3=!0,this.elements=[1,0,0,0,1,0,0,0,1],e!==void 0&&this.set(e,t,n,r,s,o,a,c,l)}set(e,t,n,r,s,o,a,c,l){const h=this.elements;return h[0]=e,h[1]=r,h[2]=a,h[3]=t,h[4]=s,h[5]=c,h[6]=n,h[7]=o,h[8]=l,this}identity(){return this.set(1,0,0,0,1,0,0,0,1),this}copy(e){const t=this.elements,n=e.elements;return t[0]=n[0],t[1]=n[1],t[2]=n[2],t[3]=n[3],t[4]=n[4],t[5]=n[5],t[6]=n[6],t[7]=n[7],t[8]=n[8],this}extractBasis(e,t,n){return e.setFromMatrix3Column(this,0),t.setFromMatrix3Column(this,1),n.setFromMatrix3Column(this,2),this}setFromMatrix4(e){const t=e.elements;return this.set(t[0],t[4],t[8],t[1],t[5],t[9],t[2],t[6],t[10]),this}multiply(e){return this.multiplyMatrices(this,e)}premultiply(e){return this.multiplyMatrices(e,this)}multiplyMatrices(e,t){const n=e.elements,r=t.elements,s=this.elements,o=n[0],a=n[3],c=n[6],l=n[1],h=n[4],u=n[7],d=n[2],p=n[5],g=n[8],b=r[0],m=r[3],f=r[6],M=r[1],x=r[4],_=r[7],I=r[2],R=r[5],T=r[8];return s[0]=o*b+a*M+c*I,s[3]=o*m+a*x+c*R,s[6]=o*f+a*_+c*T,s[1]=l*b+h*M+u*I,s[4]=l*m+h*x+u*R,s[7]=l*f+h*_+u*T,s[2]=d*b+p*M+g*I,s[5]=d*m+p*x+g*R,s[8]=d*f+p*_+g*T,this}multiplyScalar(e){const t=this.elements;return t[0]*=e,t[3]*=e,t[6]*=e,t[1]*=e,t[4]*=e,t[7]*=e,t[2]*=e,t[5]*=e,t[8]*=e,this}determinant(){const e=this.elements,t=e[0],n=e[1],r=e[2],s=e[3],o=e[4],a=e[5],c=e[6],l=e[7],h=e[8];return t*o*h-t*a*l-n*s*h+n*a*c+r*s*l-r*o*c}invert(){const e=this.elements,t=e[0],n=e[1],r=e[2],s=e[3],o=e[4],a=e[5],c=e[6],l=e[7],h=e[8],u=h*o-a*l,d=a*c-h*s,p=l*s-o*c,g=t*u+n*d+r*p;if(g===0)return this.set(0,0,0,0,0,0,0,0,0);const b=1/g;return e[0]=u*b,e[1]=(r*l-h*n)*b,e[2]=(a*n-r*o)*b,e[3]=d*b,e[4]=(h*t-r*c)*b,e[5]=(r*s-a*t)*b,e[6]=p*b,e[7]=(n*c-l*t)*b,e[8]=(o*t-n*s)*b,this}transpose(){let e;const t=this.elements;return e=t[1],t[1]=t[3],t[3]=e,e=t[2],t[2]=t[6],t[6]=e,e=t[5],t[5]=t[7],t[7]=e,this}getNormalMatrix(e){return this.setFromMatrix4(e).invert().transpose()}transposeIntoArray(e){const t=this.elements;return e[0]=t[0],e[1]=t[3],e[2]=t[6],e[3]=t[1],e[4]=t[4],e[5]=t[7],e[6]=t[2],e[7]=t[5],e[8]=t[8],this}setUvTransform(e,t,n,r,s,o,a){const c=Math.cos(s),l=Math.sin(s);return this.set(n*c,n*l,-n*(c*o+l*a)+o+e,-r*l,r*c,-r*(-l*o+c*a)+a+t,0,0,1),this}scale(e,t){return this.premultiply(Ha.makeScale(e,t)),this}rotate(e){return this.premultiply(Ha.makeRotation(-e)),this}translate(e,t){return this.premultiply(Ha.makeTranslation(e,t)),this}makeTranslation(e,t){return e.isVector2?this.set(1,0,e.x,0,1,e.y,0,0,1):this.set(1,0,e,0,1,t,0,0,1),this}makeRotation(e){const t=Math.cos(e),n=Math.sin(e);return this.set(t,-n,0,n,t,0,0,0,1),this}makeScale(e,t){return this.set(e,0,0,0,t,0,0,0,1),this}equals(e){const t=this.elements,n=e.elements;for(let r=0;r<9;r++)if(t[r]!==n[r])return!1;return!0}fromArray(e,t=0){for(let n=0;n<9;n++)this.elements[n]=e[n+t];return this}toArray(e=[],t=0){const n=this.elements;return e[t]=n[0],e[t+1]=n[1],e[t+2]=n[2],e[t+3]=n[3],e[t+4]=n[4],e[t+5]=n[5],e[t+6]=n[6],e[t+7]=n[7],e[t+8]=n[8],e}clone(){return new this.constructor().fromArray(this.elements)}}const Ha=new yt;function vd(i){for(let e=i.length-1;e>=0;--e)if(i[e]>=65535)return!0;return!1}function oo(i){return document.createElementNS("http://www.w3.org/1999/xhtml",i)}function Ip(){const i=oo("canvas");return i.style.display="block",i}const Mh={};function Ys(i){i in Mh||(Mh[i]=!0,console.warn(i))}function Np(i,e,t){return new Promise(function(n,r){function s(){switch(i.clientWaitSync(e,i.SYNC_FLUSH_COMMANDS_BIT,0)){case i.WAIT_FAILED:r();break;case i.TIMEOUT_EXPIRED:setTimeout(s,t);break;default:n()}}setTimeout(s,t)})}function Fp(i){const e=i.elements;e[2]=.5*e[2]+.5*e[3],e[6]=.5*e[6]+.5*e[7],e[10]=.5*e[10]+.5*e[11],e[14]=.5*e[14]+.5*e[15]}function Up(i){const e=i.elements;e[11]===-1?(e[10]=-e[10]-1,e[14]=-e[14]):(e[10]=-e[10],e[14]=-e[14]+1)}const Ct={enabled:!0,workingColorSpace:Ln,spaces:{},convert:function(i,e,t){return this.enabled===!1||e===t||!e||!t||(this.spaces[e].transfer===jt&&(i.r=Hi(i.r),i.g=Hi(i.g),i.b=Hi(i.b)),this.spaces[e].primaries!==this.spaces[t].primaries&&(i.applyMatrix3(this.spaces[e].toXYZ),i.applyMatrix3(this.spaces[t].fromXYZ)),this.spaces[t].transfer===jt&&(i.r=ls(i.r),i.g=ls(i.g),i.b=ls(i.b))),i},fromWorkingColorSpace:function(i,e){return this.convert(i,this.workingColorSpace,e)},toWorkingColorSpace:function(i,e){return this.convert(i,e,this.workingColorSpace)},getPrimaries:function(i){return this.spaces[i].primaries},getTransfer:function(i){return i===rr?Ta:this.spaces[i].transfer},getLuminanceCoefficients:function(i,e=this.workingColorSpace){return i.fromArray(this.spaces[e].luminanceCoefficients)},define:function(i){Object.assign(this.spaces,i)},_getMatrix:function(i,e,t){return i.copy(this.spaces[e].toXYZ).multiply(this.spaces[t].fromXYZ)},_getDrawingBufferColorSpace:function(i){return this.spaces[i].outputColorSpaceConfig.drawingBufferColorSpace},_getUnpackColorSpace:function(i=this.workingColorSpace){return this.spaces[i].workingColorSpaceConfig.unpackColorSpace}};function Hi(i){return i<.04045?i*.0773993808:Math.pow(i*.9478672986+.0521327014,2.4)}function ls(i){return i<.0031308?i*12.92:1.055*Math.pow(i,.41666)-.055}const Sh=[.64,.33,.3,.6,.15,.06],wh=[.2126,.7152,.0722],Eh=[.3127,.329],Ah=new yt().set(.4123908,.3575843,.1804808,.212639,.7151687,.0721923,.0193308,.1191948,.9505322),Th=new yt().set(3.2409699,-1.5373832,-.4986108,-.9692436,1.8759675,.0415551,.0556301,-.203977,1.0569715);Ct.define({[Ln]:{primaries:Sh,whitePoint:Eh,transfer:Ta,toXYZ:Ah,fromXYZ:Th,luminanceCoefficients:wh,workingColorSpaceConfig:{unpackColorSpace:ln},outputColorSpaceConfig:{drawingBufferColorSpace:ln}},[ln]:{primaries:Sh,whitePoint:Eh,transfer:jt,toXYZ:Ah,fromXYZ:Th,luminanceCoefficients:wh,outputColorSpaceConfig:{drawingBufferColorSpace:ln}}});let Br;class Op{static getDataURL(e){if(/^data:/i.test(e.src)||typeof HTMLCanvasElement>"u")return e.src;let t;if(e instanceof HTMLCanvasElement)t=e;else{Br===void 0&&(Br=oo("canvas")),Br.width=e.width,Br.height=e.height;const n=Br.getContext("2d");e instanceof ImageData?n.putImageData(e,0,0):n.drawImage(e,0,0,e.width,e.height),t=Br}return t.width>2048||t.height>2048?(console.warn("THREE.ImageUtils.getDataURL: Image converted to jpg for performance reasons",e),t.toDataURL("image/jpeg",.6)):t.toDataURL("image/png")}static sRGBToLinear(e){if(typeof HTMLImageElement<"u"&&e instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&e instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&e instanceof ImageBitmap){const t=oo("canvas");t.width=e.width,t.height=e.height;const n=t.getContext("2d");n.drawImage(e,0,0,e.width,e.height);const r=n.getImageData(0,0,e.width,e.height),s=r.data;for(let o=0;o<s.length;o++)s[o]=Hi(s[o]/255)*255;return n.putImageData(r,0,0),t}else if(e.data){const t=e.data.slice(0);for(let n=0;n<t.length;n++)t instanceof Uint8Array||t instanceof Uint8ClampedArray?t[n]=Math.floor(Hi(t[n]/255)*255):t[n]=Hi(t[n]);return{data:t,width:e.width,height:e.height}}else return console.warn("THREE.ImageUtils.sRGBToLinear(): Unsupported image type. No color space conversion applied."),e}}let kp=0;class yd{constructor(e=null){this.isSource=!0,Object.defineProperty(this,"id",{value:kp++}),this.uuid=ui(),this.data=e,this.dataReady=!0,this.version=0}set needsUpdate(e){e===!0&&this.version++}toJSON(e){const t=e===void 0||typeof e=="string";if(!t&&e.images[this.uuid]!==void 0)return e.images[this.uuid];const n={uuid:this.uuid,url:""},r=this.data;if(r!==null){let s;if(Array.isArray(r)){s=[];for(let o=0,a=r.length;o<a;o++)r[o].isDataTexture?s.push(Va(r[o].image)):s.push(Va(r[o]))}else s=Va(r);n.url=s}return t||(e.images[this.uuid]=n),n}}function Va(i){return typeof HTMLImageElement<"u"&&i instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&i instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&i instanceof ImageBitmap?Op.getDataURL(i):i.data?{data:Array.from(i.data),width:i.width,height:i.height,type:i.data.constructor.name}:(console.warn("THREE.Texture: Unable to serialize Texture."),{})}let Bp=0;class hn extends Ur{constructor(e=hn.DEFAULT_IMAGE,t=hn.DEFAULT_MAPPING,n=or,r=or,s=jn,o=Oi,a=ei,c=qi,l=hn.DEFAULT_ANISOTROPY,h=rr){super(),this.isTexture=!0,Object.defineProperty(this,"id",{value:Bp++}),this.uuid=ui(),this.name="",this.source=new yd(e),this.mipmaps=[],this.mapping=t,this.channel=0,this.wrapS=n,this.wrapT=r,this.magFilter=s,this.minFilter=o,this.anisotropy=l,this.format=a,this.internalFormat=null,this.type=c,this.offset=new ht(0,0),this.repeat=new ht(1,1),this.center=new ht(0,0),this.rotation=0,this.matrixAutoUpdate=!0,this.matrix=new yt,this.generateMipmaps=!0,this.premultiplyAlpha=!1,this.flipY=!0,this.unpackAlignment=4,this.colorSpace=h,this.userData={},this.version=0,this.onUpdate=null,this.isRenderTargetTexture=!1,this.pmremVersion=0}get image(){return this.source.data}set image(e=null){this.source.data=e}updateMatrix(){this.matrix.setUvTransform(this.offset.x,this.offset.y,this.repeat.x,this.repeat.y,this.rotation,this.center.x,this.center.y)}clone(){return new this.constructor().copy(this)}copy(e){return this.name=e.name,this.source=e.source,this.mipmaps=e.mipmaps.slice(0),this.mapping=e.mapping,this.channel=e.channel,this.wrapS=e.wrapS,this.wrapT=e.wrapT,this.magFilter=e.magFilter,this.minFilter=e.minFilter,this.anisotropy=e.anisotropy,this.format=e.format,this.internalFormat=e.internalFormat,this.type=e.type,this.offset.copy(e.offset),this.repeat.copy(e.repeat),this.center.copy(e.center),this.rotation=e.rotation,this.matrixAutoUpdate=e.matrixAutoUpdate,this.matrix.copy(e.matrix),this.generateMipmaps=e.generateMipmaps,this.premultiplyAlpha=e.premultiplyAlpha,this.flipY=e.flipY,this.unpackAlignment=e.unpackAlignment,this.colorSpace=e.colorSpace,this.userData=JSON.parse(JSON.stringify(e.userData)),this.needsUpdate=!0,this}toJSON(e){const t=e===void 0||typeof e=="string";if(!t&&e.textures[this.uuid]!==void 0)return e.textures[this.uuid];const n={metadata:{version:4.6,type:"Texture",generator:"Texture.toJSON"},uuid:this.uuid,name:this.name,image:this.source.toJSON(e).uuid,mapping:this.mapping,channel:this.channel,repeat:[this.repeat.x,this.repeat.y],offset:[this.offset.x,this.offset.y],center:[this.center.x,this.center.y],rotation:this.rotation,wrap:[this.wrapS,this.wrapT],format:this.format,internalFormat:this.internalFormat,type:this.type,colorSpace:this.colorSpace,minFilter:this.minFilter,magFilter:this.magFilter,anisotropy:this.anisotropy,flipY:this.flipY,generateMipmaps:this.generateMipmaps,premultiplyAlpha:this.premultiplyAlpha,unpackAlignment:this.unpackAlignment};return Object.keys(this.userData).length>0&&(n.userData=this.userData),t||(e.textures[this.uuid]=n),n}dispose(){this.dispatchEvent({type:"dispose"})}transformUv(e){if(this.mapping!==od)return e;if(e.applyMatrix3(this.matrix),e.x<0||e.x>1)switch(this.wrapS){case xs:e.x=e.x-Math.floor(e.x);break;case or:e.x=e.x<0?0:1;break;case ma:Math.abs(Math.floor(e.x)%2)===1?e.x=Math.ceil(e.x)-e.x:e.x=e.x-Math.floor(e.x);break}if(e.y<0||e.y>1)switch(this.wrapT){case xs:e.y=e.y-Math.floor(e.y);break;case or:e.y=e.y<0?0:1;break;case ma:Math.abs(Math.floor(e.y)%2)===1?e.y=Math.ceil(e.y)-e.y:e.y=e.y-Math.floor(e.y);break}return this.flipY&&(e.y=1-e.y),e}set needsUpdate(e){e===!0&&(this.version++,this.source.needsUpdate=!0)}set needsPMREMUpdate(e){e===!0&&this.pmremVersion++}}hn.DEFAULT_IMAGE=null;hn.DEFAULT_MAPPING=od;hn.DEFAULT_ANISOTROPY=1;class mt{constructor(e=0,t=0,n=0,r=1){mt.prototype.isVector4=!0,this.x=e,this.y=t,this.z=n,this.w=r}get width(){return this.z}set width(e){this.z=e}get height(){return this.w}set height(e){this.w=e}set(e,t,n,r){return this.x=e,this.y=t,this.z=n,this.w=r,this}setScalar(e){return this.x=e,this.y=e,this.z=e,this.w=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setZ(e){return this.z=e,this}setW(e){return this.w=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;case 2:this.z=t;break;case 3:this.w=t;break;default:throw new Error("index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;case 2:return this.z;case 3:return this.w;default:throw new Error("index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y,this.z,this.w)}copy(e){return this.x=e.x,this.y=e.y,this.z=e.z,this.w=e.w!==void 0?e.w:1,this}add(e){return this.x+=e.x,this.y+=e.y,this.z+=e.z,this.w+=e.w,this}addScalar(e){return this.x+=e,this.y+=e,this.z+=e,this.w+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this.z=e.z+t.z,this.w=e.w+t.w,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this.z+=e.z*t,this.w+=e.w*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this.z-=e.z,this.w-=e.w,this}subScalar(e){return this.x-=e,this.y-=e,this.z-=e,this.w-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this.z=e.z-t.z,this.w=e.w-t.w,this}multiply(e){return this.x*=e.x,this.y*=e.y,this.z*=e.z,this.w*=e.w,this}multiplyScalar(e){return this.x*=e,this.y*=e,this.z*=e,this.w*=e,this}applyMatrix4(e){const t=this.x,n=this.y,r=this.z,s=this.w,o=e.elements;return this.x=o[0]*t+o[4]*n+o[8]*r+o[12]*s,this.y=o[1]*t+o[5]*n+o[9]*r+o[13]*s,this.z=o[2]*t+o[6]*n+o[10]*r+o[14]*s,this.w=o[3]*t+o[7]*n+o[11]*r+o[15]*s,this}divide(e){return this.x/=e.x,this.y/=e.y,this.z/=e.z,this.w/=e.w,this}divideScalar(e){return this.multiplyScalar(1/e)}setAxisAngleFromQuaternion(e){this.w=2*Math.acos(e.w);const t=Math.sqrt(1-e.w*e.w);return t<1e-4?(this.x=1,this.y=0,this.z=0):(this.x=e.x/t,this.y=e.y/t,this.z=e.z/t),this}setAxisAngleFromRotationMatrix(e){let t,n,r,s;const c=e.elements,l=c[0],h=c[4],u=c[8],d=c[1],p=c[5],g=c[9],b=c[2],m=c[6],f=c[10];if(Math.abs(h-d)<.01&&Math.abs(u-b)<.01&&Math.abs(g-m)<.01){if(Math.abs(h+d)<.1&&Math.abs(u+b)<.1&&Math.abs(g+m)<.1&&Math.abs(l+p+f-3)<.1)return this.set(1,0,0,0),this;t=Math.PI;const x=(l+1)/2,_=(p+1)/2,I=(f+1)/2,R=(h+d)/4,T=(u+b)/4,F=(g+m)/4;return x>_&&x>I?x<.01?(n=0,r=.707106781,s=.707106781):(n=Math.sqrt(x),r=R/n,s=T/n):_>I?_<.01?(n=.707106781,r=0,s=.707106781):(r=Math.sqrt(_),n=R/r,s=F/r):I<.01?(n=.707106781,r=.707106781,s=0):(s=Math.sqrt(I),n=T/s,r=F/s),this.set(n,r,s,t),this}let M=Math.sqrt((m-g)*(m-g)+(u-b)*(u-b)+(d-h)*(d-h));return Math.abs(M)<.001&&(M=1),this.x=(m-g)/M,this.y=(u-b)/M,this.z=(d-h)/M,this.w=Math.acos((l+p+f-1)/2),this}setFromMatrixPosition(e){const t=e.elements;return this.x=t[12],this.y=t[13],this.z=t[14],this.w=t[15],this}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this.z=Math.min(this.z,e.z),this.w=Math.min(this.w,e.w),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this.z=Math.max(this.z,e.z),this.w=Math.max(this.w,e.w),this}clamp(e,t){return this.x=Math.max(e.x,Math.min(t.x,this.x)),this.y=Math.max(e.y,Math.min(t.y,this.y)),this.z=Math.max(e.z,Math.min(t.z,this.z)),this.w=Math.max(e.w,Math.min(t.w,this.w)),this}clampScalar(e,t){return this.x=Math.max(e,Math.min(t,this.x)),this.y=Math.max(e,Math.min(t,this.y)),this.z=Math.max(e,Math.min(t,this.z)),this.w=Math.max(e,Math.min(t,this.w)),this}clampLength(e,t){const n=this.length();return this.divideScalar(n||1).multiplyScalar(Math.max(e,Math.min(t,n)))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this.w=Math.floor(this.w),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this.w=Math.ceil(this.w),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this.w=Math.round(this.w),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this.w=Math.trunc(this.w),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this.w=-this.w,this}dot(e){return this.x*e.x+this.y*e.y+this.z*e.z+this.w*e.w}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)+Math.abs(this.w)}normalize(){return this.divideScalar(this.length()||1)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this.z+=(e.z-this.z)*t,this.w+=(e.w-this.w)*t,this}lerpVectors(e,t,n){return this.x=e.x+(t.x-e.x)*n,this.y=e.y+(t.y-e.y)*n,this.z=e.z+(t.z-e.z)*n,this.w=e.w+(t.w-e.w)*n,this}equals(e){return e.x===this.x&&e.y===this.y&&e.z===this.z&&e.w===this.w}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this.z=e[t+2],this.w=e[t+3],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e[t+2]=this.z,e[t+3]=this.w,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this.z=e.getZ(t),this.w=e.getW(t),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this.w=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z,yield this.w}}class zp extends Ur{constructor(e=1,t=1,n={}){super(),this.isRenderTarget=!0,this.width=e,this.height=t,this.depth=1,this.scissor=new mt(0,0,e,t),this.scissorTest=!1,this.viewport=new mt(0,0,e,t);const r={width:e,height:t,depth:1};n=Object.assign({generateMipmaps:!1,internalFormat:null,minFilter:jn,depthBuffer:!0,stencilBuffer:!1,resolveDepthBuffer:!0,resolveStencilBuffer:!0,depthTexture:null,samples:0,count:1},n);const s=new hn(r,n.mapping,n.wrapS,n.wrapT,n.magFilter,n.minFilter,n.format,n.type,n.anisotropy,n.colorSpace);s.flipY=!1,s.generateMipmaps=n.generateMipmaps,s.internalFormat=n.internalFormat,this.textures=[];const o=n.count;for(let a=0;a<o;a++)this.textures[a]=s.clone(),this.textures[a].isRenderTargetTexture=!0;this.depthBuffer=n.depthBuffer,this.stencilBuffer=n.stencilBuffer,this.resolveDepthBuffer=n.resolveDepthBuffer,this.resolveStencilBuffer=n.resolveStencilBuffer,this.depthTexture=n.depthTexture,this.samples=n.samples}get texture(){return this.textures[0]}set texture(e){this.textures[0]=e}setSize(e,t,n=1){if(this.width!==e||this.height!==t||this.depth!==n){this.width=e,this.height=t,this.depth=n;for(let r=0,s=this.textures.length;r<s;r++)this.textures[r].image.width=e,this.textures[r].image.height=t,this.textures[r].image.depth=n;this.dispose()}this.viewport.set(0,0,e,t),this.scissor.set(0,0,e,t)}clone(){return new this.constructor().copy(this)}copy(e){this.width=e.width,this.height=e.height,this.depth=e.depth,this.scissor.copy(e.scissor),this.scissorTest=e.scissorTest,this.viewport.copy(e.viewport),this.textures.length=0;for(let n=0,r=e.textures.length;n<r;n++)this.textures[n]=e.textures[n].clone(),this.textures[n].isRenderTargetTexture=!0;const t=Object.assign({},e.texture.image);return this.texture.source=new yd(t),this.depthBuffer=e.depthBuffer,this.stencilBuffer=e.stencilBuffer,this.resolveDepthBuffer=e.resolveDepthBuffer,this.resolveStencilBuffer=e.resolveStencilBuffer,e.depthTexture!==null&&(this.depthTexture=e.depthTexture.clone()),this.samples=e.samples,this}dispose(){this.dispatchEvent({type:"dispose"})}}class ur extends zp{constructor(e=1,t=1,n={}){super(e,t,n),this.isWebGLRenderTarget=!0}}class Md extends hn{constructor(e=null,t=1,n=1,r=1){super(null),this.isDataArrayTexture=!0,this.image={data:e,width:t,height:n,depth:r},this.magFilter=Pn,this.minFilter=Pn,this.wrapR=or,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1,this.layerUpdates=new Set}addLayerUpdate(e){this.layerUpdates.add(e)}clearLayerUpdates(){this.layerUpdates.clear()}}class Hp extends hn{constructor(e=null,t=1,n=1,r=1){super(null),this.isData3DTexture=!0,this.image={data:e,width:t,height:n,depth:r},this.magFilter=Pn,this.minFilter=Pn,this.wrapR=or,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}}class qe{constructor(e=0,t=0,n=0,r=1){this.isQuaternion=!0,this._x=e,this._y=t,this._z=n,this._w=r}static slerpFlat(e,t,n,r,s,o,a){let c=n[r+0],l=n[r+1],h=n[r+2],u=n[r+3];const d=s[o+0],p=s[o+1],g=s[o+2],b=s[o+3];if(a===0){e[t+0]=c,e[t+1]=l,e[t+2]=h,e[t+3]=u;return}if(a===1){e[t+0]=d,e[t+1]=p,e[t+2]=g,e[t+3]=b;return}if(u!==b||c!==d||l!==p||h!==g){let m=1-a;const f=c*d+l*p+h*g+u*b,M=f>=0?1:-1,x=1-f*f;if(x>Number.EPSILON){const I=Math.sqrt(x),R=Math.atan2(I,f*M);m=Math.sin(m*R)/I,a=Math.sin(a*R)/I}const _=a*M;if(c=c*m+d*_,l=l*m+p*_,h=h*m+g*_,u=u*m+b*_,m===1-a){const I=1/Math.sqrt(c*c+l*l+h*h+u*u);c*=I,l*=I,h*=I,u*=I}}e[t]=c,e[t+1]=l,e[t+2]=h,e[t+3]=u}static multiplyQuaternionsFlat(e,t,n,r,s,o){const a=n[r],c=n[r+1],l=n[r+2],h=n[r+3],u=s[o],d=s[o+1],p=s[o+2],g=s[o+3];return e[t]=a*g+h*u+c*p-l*d,e[t+1]=c*g+h*d+l*u-a*p,e[t+2]=l*g+h*p+a*d-c*u,e[t+3]=h*g-a*u-c*d-l*p,e}get x(){return this._x}set x(e){this._x=e,this._onChangeCallback()}get y(){return this._y}set y(e){this._y=e,this._onChangeCallback()}get z(){return this._z}set z(e){this._z=e,this._onChangeCallback()}get w(){return this._w}set w(e){this._w=e,this._onChangeCallback()}set(e,t,n,r){return this._x=e,this._y=t,this._z=n,this._w=r,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._w)}copy(e){return this._x=e.x,this._y=e.y,this._z=e.z,this._w=e.w,this._onChangeCallback(),this}setFromEuler(e,t=!0){const n=e._x,r=e._y,s=e._z,o=e._order,a=Math.cos,c=Math.sin,l=a(n/2),h=a(r/2),u=a(s/2),d=c(n/2),p=c(r/2),g=c(s/2);switch(o){case"XYZ":this._x=d*h*u+l*p*g,this._y=l*p*u-d*h*g,this._z=l*h*g+d*p*u,this._w=l*h*u-d*p*g;break;case"YXZ":this._x=d*h*u+l*p*g,this._y=l*p*u-d*h*g,this._z=l*h*g-d*p*u,this._w=l*h*u+d*p*g;break;case"ZXY":this._x=d*h*u-l*p*g,this._y=l*p*u+d*h*g,this._z=l*h*g+d*p*u,this._w=l*h*u-d*p*g;break;case"ZYX":this._x=d*h*u-l*p*g,this._y=l*p*u+d*h*g,this._z=l*h*g-d*p*u,this._w=l*h*u+d*p*g;break;case"YZX":this._x=d*h*u+l*p*g,this._y=l*p*u+d*h*g,this._z=l*h*g-d*p*u,this._w=l*h*u-d*p*g;break;case"XZY":this._x=d*h*u-l*p*g,this._y=l*p*u-d*h*g,this._z=l*h*g+d*p*u,this._w=l*h*u+d*p*g;break;default:console.warn("THREE.Quaternion: .setFromEuler() encountered an unknown order: "+o)}return t===!0&&this._onChangeCallback(),this}setFromAxisAngle(e,t){const n=t/2,r=Math.sin(n);return this._x=e.x*r,this._y=e.y*r,this._z=e.z*r,this._w=Math.cos(n),this._onChangeCallback(),this}setFromRotationMatrix(e){const t=e.elements,n=t[0],r=t[4],s=t[8],o=t[1],a=t[5],c=t[9],l=t[2],h=t[6],u=t[10],d=n+a+u;if(d>0){const p=.5/Math.sqrt(d+1);this._w=.25/p,this._x=(h-c)*p,this._y=(s-l)*p,this._z=(o-r)*p}else if(n>a&&n>u){const p=2*Math.sqrt(1+n-a-u);this._w=(h-c)/p,this._x=.25*p,this._y=(r+o)/p,this._z=(s+l)/p}else if(a>u){const p=2*Math.sqrt(1+a-n-u);this._w=(s-l)/p,this._x=(r+o)/p,this._y=.25*p,this._z=(c+h)/p}else{const p=2*Math.sqrt(1+u-n-a);this._w=(o-r)/p,this._x=(s+l)/p,this._y=(c+h)/p,this._z=.25*p}return this._onChangeCallback(),this}setFromUnitVectors(e,t){let n=e.dot(t)+1;return n<Number.EPSILON?(n=0,Math.abs(e.x)>Math.abs(e.z)?(this._x=-e.y,this._y=e.x,this._z=0,this._w=n):(this._x=0,this._y=-e.z,this._z=e.y,this._w=n)):(this._x=e.y*t.z-e.z*t.y,this._y=e.z*t.x-e.x*t.z,this._z=e.x*t.y-e.y*t.x,this._w=n),this.normalize()}angleTo(e){return 2*Math.acos(Math.abs(xn(this.dot(e),-1,1)))}rotateTowards(e,t){const n=this.angleTo(e);if(n===0)return this;const r=Math.min(1,t/n);return this.slerp(e,r),this}identity(){return this.set(0,0,0,1)}invert(){return this.conjugate()}conjugate(){return this._x*=-1,this._y*=-1,this._z*=-1,this._onChangeCallback(),this}dot(e){return this._x*e._x+this._y*e._y+this._z*e._z+this._w*e._w}lengthSq(){return this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w}length(){return Math.sqrt(this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w)}normalize(){let e=this.length();return e===0?(this._x=0,this._y=0,this._z=0,this._w=1):(e=1/e,this._x=this._x*e,this._y=this._y*e,this._z=this._z*e,this._w=this._w*e),this._onChangeCallback(),this}multiply(e){return this.multiplyQuaternions(this,e)}premultiply(e){return this.multiplyQuaternions(e,this)}multiplyQuaternions(e,t){const n=e._x,r=e._y,s=e._z,o=e._w,a=t._x,c=t._y,l=t._z,h=t._w;return this._x=n*h+o*a+r*l-s*c,this._y=r*h+o*c+s*a-n*l,this._z=s*h+o*l+n*c-r*a,this._w=o*h-n*a-r*c-s*l,this._onChangeCallback(),this}slerp(e,t){if(t===0)return this;if(t===1)return this.copy(e);const n=this._x,r=this._y,s=this._z,o=this._w;let a=o*e._w+n*e._x+r*e._y+s*e._z;if(a<0?(this._w=-e._w,this._x=-e._x,this._y=-e._y,this._z=-e._z,a=-a):this.copy(e),a>=1)return this._w=o,this._x=n,this._y=r,this._z=s,this;const c=1-a*a;if(c<=Number.EPSILON){const p=1-t;return this._w=p*o+t*this._w,this._x=p*n+t*this._x,this._y=p*r+t*this._y,this._z=p*s+t*this._z,this.normalize(),this}const l=Math.sqrt(c),h=Math.atan2(l,a),u=Math.sin((1-t)*h)/l,d=Math.sin(t*h)/l;return this._w=o*u+this._w*d,this._x=n*u+this._x*d,this._y=r*u+this._y*d,this._z=s*u+this._z*d,this._onChangeCallback(),this}slerpQuaternions(e,t,n){return this.copy(e).slerp(t,n)}random(){const e=2*Math.PI*Math.random(),t=2*Math.PI*Math.random(),n=Math.random(),r=Math.sqrt(1-n),s=Math.sqrt(n);return this.set(r*Math.sin(e),r*Math.cos(e),s*Math.sin(t),s*Math.cos(t))}equals(e){return e._x===this._x&&e._y===this._y&&e._z===this._z&&e._w===this._w}fromArray(e,t=0){return this._x=e[t],this._y=e[t+1],this._z=e[t+2],this._w=e[t+3],this._onChangeCallback(),this}toArray(e=[],t=0){return e[t]=this._x,e[t+1]=this._y,e[t+2]=this._z,e[t+3]=this._w,e}fromBufferAttribute(e,t){return this._x=e.getX(t),this._y=e.getY(t),this._z=e.getZ(t),this._w=e.getW(t),this._onChangeCallback(),this}toJSON(){return this.toArray()}_onChange(e){return this._onChangeCallback=e,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._w}}class A{constructor(e=0,t=0,n=0){A.prototype.isVector3=!0,this.x=e,this.y=t,this.z=n}set(e,t,n){return n===void 0&&(n=this.z),this.x=e,this.y=t,this.z=n,this}setScalar(e){return this.x=e,this.y=e,this.z=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setZ(e){return this.z=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;case 2:this.z=t;break;default:throw new Error("index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;case 2:return this.z;default:throw new Error("index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y,this.z)}copy(e){return this.x=e.x,this.y=e.y,this.z=e.z,this}add(e){return this.x+=e.x,this.y+=e.y,this.z+=e.z,this}addScalar(e){return this.x+=e,this.y+=e,this.z+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this.z=e.z+t.z,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this.z+=e.z*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this.z-=e.z,this}subScalar(e){return this.x-=e,this.y-=e,this.z-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this.z=e.z-t.z,this}multiply(e){return this.x*=e.x,this.y*=e.y,this.z*=e.z,this}multiplyScalar(e){return this.x*=e,this.y*=e,this.z*=e,this}multiplyVectors(e,t){return this.x=e.x*t.x,this.y=e.y*t.y,this.z=e.z*t.z,this}applyEuler(e){return this.applyQuaternion(Rh.setFromEuler(e))}applyAxisAngle(e,t){return this.applyQuaternion(Rh.setFromAxisAngle(e,t))}applyMatrix3(e){const t=this.x,n=this.y,r=this.z,s=e.elements;return this.x=s[0]*t+s[3]*n+s[6]*r,this.y=s[1]*t+s[4]*n+s[7]*r,this.z=s[2]*t+s[5]*n+s[8]*r,this}applyNormalMatrix(e){return this.applyMatrix3(e).normalize()}applyMatrix4(e){const t=this.x,n=this.y,r=this.z,s=e.elements,o=1/(s[3]*t+s[7]*n+s[11]*r+s[15]);return this.x=(s[0]*t+s[4]*n+s[8]*r+s[12])*o,this.y=(s[1]*t+s[5]*n+s[9]*r+s[13])*o,this.z=(s[2]*t+s[6]*n+s[10]*r+s[14])*o,this}applyQuaternion(e){const t=this.x,n=this.y,r=this.z,s=e.x,o=e.y,a=e.z,c=e.w,l=2*(o*r-a*n),h=2*(a*t-s*r),u=2*(s*n-o*t);return this.x=t+c*l+o*u-a*h,this.y=n+c*h+a*l-s*u,this.z=r+c*u+s*h-o*l,this}project(e){return this.applyMatrix4(e.matrixWorldInverse).applyMatrix4(e.projectionMatrix)}unproject(e){return this.applyMatrix4(e.projectionMatrixInverse).applyMatrix4(e.matrixWorld)}transformDirection(e){const t=this.x,n=this.y,r=this.z,s=e.elements;return this.x=s[0]*t+s[4]*n+s[8]*r,this.y=s[1]*t+s[5]*n+s[9]*r,this.z=s[2]*t+s[6]*n+s[10]*r,this.normalize()}divide(e){return this.x/=e.x,this.y/=e.y,this.z/=e.z,this}divideScalar(e){return this.multiplyScalar(1/e)}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this.z=Math.min(this.z,e.z),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this.z=Math.max(this.z,e.z),this}clamp(e,t){return this.x=Math.max(e.x,Math.min(t.x,this.x)),this.y=Math.max(e.y,Math.min(t.y,this.y)),this.z=Math.max(e.z,Math.min(t.z,this.z)),this}clampScalar(e,t){return this.x=Math.max(e,Math.min(t,this.x)),this.y=Math.max(e,Math.min(t,this.y)),this.z=Math.max(e,Math.min(t,this.z)),this}clampLength(e,t){const n=this.length();return this.divideScalar(n||1).multiplyScalar(Math.max(e,Math.min(t,n)))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this}dot(e){return this.x*e.x+this.y*e.y+this.z*e.z}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)}normalize(){return this.divideScalar(this.length()||1)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this.z+=(e.z-this.z)*t,this}lerpVectors(e,t,n){return this.x=e.x+(t.x-e.x)*n,this.y=e.y+(t.y-e.y)*n,this.z=e.z+(t.z-e.z)*n,this}cross(e){return this.crossVectors(this,e)}crossVectors(e,t){const n=e.x,r=e.y,s=e.z,o=t.x,a=t.y,c=t.z;return this.x=r*c-s*a,this.y=s*o-n*c,this.z=n*a-r*o,this}projectOnVector(e){const t=e.lengthSq();if(t===0)return this.set(0,0,0);const n=e.dot(this)/t;return this.copy(e).multiplyScalar(n)}projectOnPlane(e){return Ga.copy(this).projectOnVector(e),this.sub(Ga)}reflect(e){return this.sub(Ga.copy(e).multiplyScalar(2*this.dot(e)))}angleTo(e){const t=Math.sqrt(this.lengthSq()*e.lengthSq());if(t===0)return Math.PI/2;const n=this.dot(e)/t;return Math.acos(xn(n,-1,1))}distanceTo(e){return Math.sqrt(this.distanceToSquared(e))}distanceToSquared(e){const t=this.x-e.x,n=this.y-e.y,r=this.z-e.z;return t*t+n*n+r*r}manhattanDistanceTo(e){return Math.abs(this.x-e.x)+Math.abs(this.y-e.y)+Math.abs(this.z-e.z)}setFromSpherical(e){return this.setFromSphericalCoords(e.radius,e.phi,e.theta)}setFromSphericalCoords(e,t,n){const r=Math.sin(t)*e;return this.x=r*Math.sin(n),this.y=Math.cos(t)*e,this.z=r*Math.cos(n),this}setFromCylindrical(e){return this.setFromCylindricalCoords(e.radius,e.theta,e.y)}setFromCylindricalCoords(e,t,n){return this.x=e*Math.sin(t),this.y=n,this.z=e*Math.cos(t),this}setFromMatrixPosition(e){const t=e.elements;return this.x=t[12],this.y=t[13],this.z=t[14],this}setFromMatrixScale(e){const t=this.setFromMatrixColumn(e,0).length(),n=this.setFromMatrixColumn(e,1).length(),r=this.setFromMatrixColumn(e,2).length();return this.x=t,this.y=n,this.z=r,this}setFromMatrixColumn(e,t){return this.fromArray(e.elements,t*4)}setFromMatrix3Column(e,t){return this.fromArray(e.elements,t*3)}setFromEuler(e){return this.x=e._x,this.y=e._y,this.z=e._z,this}setFromColor(e){return this.x=e.r,this.y=e.g,this.z=e.b,this}equals(e){return e.x===this.x&&e.y===this.y&&e.z===this.z}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this.z=e[t+2],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e[t+2]=this.z,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this.z=e.getZ(t),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this}randomDirection(){const e=Math.random()*Math.PI*2,t=Math.random()*2-1,n=Math.sqrt(1-t*t);return this.x=n*Math.cos(e),this.y=t,this.z=n*Math.sin(e),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z}}const Ga=new A,Rh=new qe;class an{constructor(e=new A(1/0,1/0,1/0),t=new A(-1/0,-1/0,-1/0)){this.isBox3=!0,this.min=e,this.max=t}set(e,t){return this.min.copy(e),this.max.copy(t),this}setFromArray(e){this.makeEmpty();for(let t=0,n=e.length;t<n;t+=3)this.expandByPoint(ii.fromArray(e,t));return this}setFromBufferAttribute(e){this.makeEmpty();for(let t=0,n=e.count;t<n;t++)this.expandByPoint(ii.fromBufferAttribute(e,t));return this}setFromPoints(e){this.makeEmpty();for(let t=0,n=e.length;t<n;t++)this.expandByPoint(e[t]);return this}setFromCenterAndSize(e,t){const n=ii.copy(t).multiplyScalar(.5);return this.min.copy(e).sub(n),this.max.copy(e).add(n),this}setFromObject(e,t=!1){return this.makeEmpty(),this.expandByObject(e,t)}clone(){return new this.constructor().copy(this)}copy(e){return this.min.copy(e.min),this.max.copy(e.max),this}makeEmpty(){return this.min.x=this.min.y=this.min.z=1/0,this.max.x=this.max.y=this.max.z=-1/0,this}isEmpty(){return this.max.x<this.min.x||this.max.y<this.min.y||this.max.z<this.min.z}getCenter(e){return this.isEmpty()?e.set(0,0,0):e.addVectors(this.min,this.max).multiplyScalar(.5)}getSize(e){return this.isEmpty()?e.set(0,0,0):e.subVectors(this.max,this.min)}expandByPoint(e){return this.min.min(e),this.max.max(e),this}expandByVector(e){return this.min.sub(e),this.max.add(e),this}expandByScalar(e){return this.min.addScalar(-e),this.max.addScalar(e),this}expandByObject(e,t=!1){e.updateWorldMatrix(!1,!1);const n=e.geometry;if(n!==void 0){const s=n.getAttribute("position");if(t===!0&&s!==void 0&&e.isInstancedMesh!==!0)for(let o=0,a=s.count;o<a;o++)e.isMesh===!0?e.getVertexPosition(o,ii):ii.fromBufferAttribute(s,o),ii.applyMatrix4(e.matrixWorld),this.expandByPoint(ii);else e.boundingBox!==void 0?(e.boundingBox===null&&e.computeBoundingBox(),_o.copy(e.boundingBox)):(n.boundingBox===null&&n.computeBoundingBox(),_o.copy(n.boundingBox)),_o.applyMatrix4(e.matrixWorld),this.union(_o)}const r=e.children;for(let s=0,o=r.length;s<o;s++)this.expandByObject(r[s],t);return this}containsPoint(e){return e.x>=this.min.x&&e.x<=this.max.x&&e.y>=this.min.y&&e.y<=this.max.y&&e.z>=this.min.z&&e.z<=this.max.z}containsBox(e){return this.min.x<=e.min.x&&e.max.x<=this.max.x&&this.min.y<=e.min.y&&e.max.y<=this.max.y&&this.min.z<=e.min.z&&e.max.z<=this.max.z}getParameter(e,t){return t.set((e.x-this.min.x)/(this.max.x-this.min.x),(e.y-this.min.y)/(this.max.y-this.min.y),(e.z-this.min.z)/(this.max.z-this.min.z))}intersectsBox(e){return e.max.x>=this.min.x&&e.min.x<=this.max.x&&e.max.y>=this.min.y&&e.min.y<=this.max.y&&e.max.z>=this.min.z&&e.min.z<=this.max.z}intersectsSphere(e){return this.clampPoint(e.center,ii),ii.distanceToSquared(e.center)<=e.radius*e.radius}intersectsPlane(e){let t,n;return e.normal.x>0?(t=e.normal.x*this.min.x,n=e.normal.x*this.max.x):(t=e.normal.x*this.max.x,n=e.normal.x*this.min.x),e.normal.y>0?(t+=e.normal.y*this.min.y,n+=e.normal.y*this.max.y):(t+=e.normal.y*this.max.y,n+=e.normal.y*this.min.y),e.normal.z>0?(t+=e.normal.z*this.min.z,n+=e.normal.z*this.max.z):(t+=e.normal.z*this.max.z,n+=e.normal.z*this.min.z),t<=-e.constant&&n>=-e.constant}intersectsTriangle(e){if(this.isEmpty())return!1;this.getCenter(ks),xo.subVectors(this.max,ks),zr.subVectors(e.a,ks),Hr.subVectors(e.b,ks),Vr.subVectors(e.c,ks),Qi.subVectors(Hr,zr),Ki.subVectors(Vr,Hr),xr.subVectors(zr,Vr);let t=[0,-Qi.z,Qi.y,0,-Ki.z,Ki.y,0,-xr.z,xr.y,Qi.z,0,-Qi.x,Ki.z,0,-Ki.x,xr.z,0,-xr.x,-Qi.y,Qi.x,0,-Ki.y,Ki.x,0,-xr.y,xr.x,0];return!Wa(t,zr,Hr,Vr,xo)||(t=[1,0,0,0,1,0,0,0,1],!Wa(t,zr,Hr,Vr,xo))?!1:(vo.crossVectors(Qi,Ki),t=[vo.x,vo.y,vo.z],Wa(t,zr,Hr,Vr,xo))}clampPoint(e,t){return t.copy(e).clamp(this.min,this.max)}distanceToPoint(e){return this.clampPoint(e,ii).distanceTo(e)}getBoundingSphere(e){return this.isEmpty()?e.makeEmpty():(this.getCenter(e.center),e.radius=this.getSize(ii).length()*.5),e}intersect(e){return this.min.max(e.min),this.max.min(e.max),this.isEmpty()&&this.makeEmpty(),this}union(e){return this.min.min(e.min),this.max.max(e.max),this}applyMatrix4(e){return this.isEmpty()?this:(Ti[0].set(this.min.x,this.min.y,this.min.z).applyMatrix4(e),Ti[1].set(this.min.x,this.min.y,this.max.z).applyMatrix4(e),Ti[2].set(this.min.x,this.max.y,this.min.z).applyMatrix4(e),Ti[3].set(this.min.x,this.max.y,this.max.z).applyMatrix4(e),Ti[4].set(this.max.x,this.min.y,this.min.z).applyMatrix4(e),Ti[5].set(this.max.x,this.min.y,this.max.z).applyMatrix4(e),Ti[6].set(this.max.x,this.max.y,this.min.z).applyMatrix4(e),Ti[7].set(this.max.x,this.max.y,this.max.z).applyMatrix4(e),this.setFromPoints(Ti),this)}translate(e){return this.min.add(e),this.max.add(e),this}equals(e){return e.min.equals(this.min)&&e.max.equals(this.max)}}const Ti=[new A,new A,new A,new A,new A,new A,new A,new A],ii=new A,_o=new an,zr=new A,Hr=new A,Vr=new A,Qi=new A,Ki=new A,xr=new A,ks=new A,xo=new A,vo=new A,vr=new A;function Wa(i,e,t,n,r){for(let s=0,o=i.length-3;s<=o;s+=3){vr.fromArray(i,s);const a=r.x*Math.abs(vr.x)+r.y*Math.abs(vr.y)+r.z*Math.abs(vr.z),c=e.dot(vr),l=t.dot(vr),h=n.dot(vr);if(Math.max(-Math.max(c,l,h),Math.min(c,l,h))>a)return!1}return!0}const Vp=new an,Bs=new A,qa=new A;class yi{constructor(e=new A,t=-1){this.isSphere=!0,this.center=e,this.radius=t}set(e,t){return this.center.copy(e),this.radius=t,this}setFromPoints(e,t){const n=this.center;t!==void 0?n.copy(t):Vp.setFromPoints(e).getCenter(n);let r=0;for(let s=0,o=e.length;s<o;s++)r=Math.max(r,n.distanceToSquared(e[s]));return this.radius=Math.sqrt(r),this}copy(e){return this.center.copy(e.center),this.radius=e.radius,this}isEmpty(){return this.radius<0}makeEmpty(){return this.center.set(0,0,0),this.radius=-1,this}containsPoint(e){return e.distanceToSquared(this.center)<=this.radius*this.radius}distanceToPoint(e){return e.distanceTo(this.center)-this.radius}intersectsSphere(e){const t=this.radius+e.radius;return e.center.distanceToSquared(this.center)<=t*t}intersectsBox(e){return e.intersectsSphere(this)}intersectsPlane(e){return Math.abs(e.distanceToPoint(this.center))<=this.radius}clampPoint(e,t){const n=this.center.distanceToSquared(e);return t.copy(e),n>this.radius*this.radius&&(t.sub(this.center).normalize(),t.multiplyScalar(this.radius).add(this.center)),t}getBoundingBox(e){return this.isEmpty()?(e.makeEmpty(),e):(e.set(this.center,this.center),e.expandByScalar(this.radius),e)}applyMatrix4(e){return this.center.applyMatrix4(e),this.radius=this.radius*e.getMaxScaleOnAxis(),this}translate(e){return this.center.add(e),this}expandByPoint(e){if(this.isEmpty())return this.center.copy(e),this.radius=0,this;Bs.subVectors(e,this.center);const t=Bs.lengthSq();if(t>this.radius*this.radius){const n=Math.sqrt(t),r=(n-this.radius)*.5;this.center.addScaledVector(Bs,r/n),this.radius+=r}return this}union(e){return e.isEmpty()?this:this.isEmpty()?(this.copy(e),this):(this.center.equals(e.center)===!0?this.radius=Math.max(this.radius,e.radius):(qa.subVectors(e.center,this.center).setLength(e.radius),this.expandByPoint(Bs.copy(e.center).add(qa)),this.expandByPoint(Bs.copy(e.center).sub(qa))),this)}equals(e){return e.center.equals(this.center)&&e.radius===this.radius}clone(){return new this.constructor().copy(this)}}const Ri=new A,ja=new A,yo=new A,Yi=new A,Xa=new A,Mo=new A,Qa=new A;class Rs{constructor(e=new A,t=new A(0,0,-1)){this.origin=e,this.direction=t}set(e,t){return this.origin.copy(e),this.direction.copy(t),this}copy(e){return this.origin.copy(e.origin),this.direction.copy(e.direction),this}at(e,t){return t.copy(this.origin).addScaledVector(this.direction,e)}lookAt(e){return this.direction.copy(e).sub(this.origin).normalize(),this}recast(e){return this.origin.copy(this.at(e,Ri)),this}closestPointToPoint(e,t){t.subVectors(e,this.origin);const n=t.dot(this.direction);return n<0?t.copy(this.origin):t.copy(this.origin).addScaledVector(this.direction,n)}distanceToPoint(e){return Math.sqrt(this.distanceSqToPoint(e))}distanceSqToPoint(e){const t=Ri.subVectors(e,this.origin).dot(this.direction);return t<0?this.origin.distanceToSquared(e):(Ri.copy(this.origin).addScaledVector(this.direction,t),Ri.distanceToSquared(e))}distanceSqToSegment(e,t,n,r){ja.copy(e).add(t).multiplyScalar(.5),yo.copy(t).sub(e).normalize(),Yi.copy(this.origin).sub(ja);const s=e.distanceTo(t)*.5,o=-this.direction.dot(yo),a=Yi.dot(this.direction),c=-Yi.dot(yo),l=Yi.lengthSq(),h=Math.abs(1-o*o);let u,d,p,g;if(h>0)if(u=o*c-a,d=o*a-c,g=s*h,u>=0)if(d>=-g)if(d<=g){const b=1/h;u*=b,d*=b,p=u*(u+o*d+2*a)+d*(o*u+d+2*c)+l}else d=s,u=Math.max(0,-(o*d+a)),p=-u*u+d*(d+2*c)+l;else d=-s,u=Math.max(0,-(o*d+a)),p=-u*u+d*(d+2*c)+l;else d<=-g?(u=Math.max(0,-(-o*s+a)),d=u>0?-s:Math.min(Math.max(-s,-c),s),p=-u*u+d*(d+2*c)+l):d<=g?(u=0,d=Math.min(Math.max(-s,-c),s),p=d*(d+2*c)+l):(u=Math.max(0,-(o*s+a)),d=u>0?s:Math.min(Math.max(-s,-c),s),p=-u*u+d*(d+2*c)+l);else d=o>0?-s:s,u=Math.max(0,-(o*d+a)),p=-u*u+d*(d+2*c)+l;return n&&n.copy(this.origin).addScaledVector(this.direction,u),r&&r.copy(ja).addScaledVector(yo,d),p}intersectSphere(e,t){Ri.subVectors(e.center,this.origin);const n=Ri.dot(this.direction),r=Ri.dot(Ri)-n*n,s=e.radius*e.radius;if(r>s)return null;const o=Math.sqrt(s-r),a=n-o,c=n+o;return c<0?null:a<0?this.at(c,t):this.at(a,t)}intersectsSphere(e){return this.distanceSqToPoint(e.center)<=e.radius*e.radius}distanceToPlane(e){const t=e.normal.dot(this.direction);if(t===0)return e.distanceToPoint(this.origin)===0?0:null;const n=-(this.origin.dot(e.normal)+e.constant)/t;return n>=0?n:null}intersectPlane(e,t){const n=this.distanceToPlane(e);return n===null?null:this.at(n,t)}intersectsPlane(e){const t=e.distanceToPoint(this.origin);return t===0||e.normal.dot(this.direction)*t<0}intersectBox(e,t){let n,r,s,o,a,c;const l=1/this.direction.x,h=1/this.direction.y,u=1/this.direction.z,d=this.origin;return l>=0?(n=(e.min.x-d.x)*l,r=(e.max.x-d.x)*l):(n=(e.max.x-d.x)*l,r=(e.min.x-d.x)*l),h>=0?(s=(e.min.y-d.y)*h,o=(e.max.y-d.y)*h):(s=(e.max.y-d.y)*h,o=(e.min.y-d.y)*h),n>o||s>r||((s>n||isNaN(n))&&(n=s),(o<r||isNaN(r))&&(r=o),u>=0?(a=(e.min.z-d.z)*u,c=(e.max.z-d.z)*u):(a=(e.max.z-d.z)*u,c=(e.min.z-d.z)*u),n>c||a>r)||((a>n||n!==n)&&(n=a),(c<r||r!==r)&&(r=c),r<0)?null:this.at(n>=0?n:r,t)}intersectsBox(e){return this.intersectBox(e,Ri)!==null}intersectTriangle(e,t,n,r,s){Xa.subVectors(t,e),Mo.subVectors(n,e),Qa.crossVectors(Xa,Mo);let o=this.direction.dot(Qa),a;if(o>0){if(r)return null;a=1}else if(o<0)a=-1,o=-o;else return null;Yi.subVectors(this.origin,e);const c=a*this.direction.dot(Mo.crossVectors(Yi,Mo));if(c<0)return null;const l=a*this.direction.dot(Xa.cross(Yi));if(l<0||c+l>o)return null;const h=-a*Yi.dot(Qa);return h<0?null:this.at(h/o,s)}applyMatrix4(e){return this.origin.applyMatrix4(e),this.direction.transformDirection(e),this}equals(e){return e.origin.equals(this.origin)&&e.direction.equals(this.direction)}clone(){return new this.constructor().copy(this)}}class ot{constructor(e,t,n,r,s,o,a,c,l,h,u,d,p,g,b,m){ot.prototype.isMatrix4=!0,this.elements=[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1],e!==void 0&&this.set(e,t,n,r,s,o,a,c,l,h,u,d,p,g,b,m)}set(e,t,n,r,s,o,a,c,l,h,u,d,p,g,b,m){const f=this.elements;return f[0]=e,f[4]=t,f[8]=n,f[12]=r,f[1]=s,f[5]=o,f[9]=a,f[13]=c,f[2]=l,f[6]=h,f[10]=u,f[14]=d,f[3]=p,f[7]=g,f[11]=b,f[15]=m,this}identity(){return this.set(1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1),this}clone(){return new ot().fromArray(this.elements)}copy(e){const t=this.elements,n=e.elements;return t[0]=n[0],t[1]=n[1],t[2]=n[2],t[3]=n[3],t[4]=n[4],t[5]=n[5],t[6]=n[6],t[7]=n[7],t[8]=n[8],t[9]=n[9],t[10]=n[10],t[11]=n[11],t[12]=n[12],t[13]=n[13],t[14]=n[14],t[15]=n[15],this}copyPosition(e){const t=this.elements,n=e.elements;return t[12]=n[12],t[13]=n[13],t[14]=n[14],this}setFromMatrix3(e){const t=e.elements;return this.set(t[0],t[3],t[6],0,t[1],t[4],t[7],0,t[2],t[5],t[8],0,0,0,0,1),this}extractBasis(e,t,n){return e.setFromMatrixColumn(this,0),t.setFromMatrixColumn(this,1),n.setFromMatrixColumn(this,2),this}makeBasis(e,t,n){return this.set(e.x,t.x,n.x,0,e.y,t.y,n.y,0,e.z,t.z,n.z,0,0,0,0,1),this}extractRotation(e){const t=this.elements,n=e.elements,r=1/Gr.setFromMatrixColumn(e,0).length(),s=1/Gr.setFromMatrixColumn(e,1).length(),o=1/Gr.setFromMatrixColumn(e,2).length();return t[0]=n[0]*r,t[1]=n[1]*r,t[2]=n[2]*r,t[3]=0,t[4]=n[4]*s,t[5]=n[5]*s,t[6]=n[6]*s,t[7]=0,t[8]=n[8]*o,t[9]=n[9]*o,t[10]=n[10]*o,t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,this}makeRotationFromEuler(e){const t=this.elements,n=e.x,r=e.y,s=e.z,o=Math.cos(n),a=Math.sin(n),c=Math.cos(r),l=Math.sin(r),h=Math.cos(s),u=Math.sin(s);if(e.order==="XYZ"){const d=o*h,p=o*u,g=a*h,b=a*u;t[0]=c*h,t[4]=-c*u,t[8]=l,t[1]=p+g*l,t[5]=d-b*l,t[9]=-a*c,t[2]=b-d*l,t[6]=g+p*l,t[10]=o*c}else if(e.order==="YXZ"){const d=c*h,p=c*u,g=l*h,b=l*u;t[0]=d+b*a,t[4]=g*a-p,t[8]=o*l,t[1]=o*u,t[5]=o*h,t[9]=-a,t[2]=p*a-g,t[6]=b+d*a,t[10]=o*c}else if(e.order==="ZXY"){const d=c*h,p=c*u,g=l*h,b=l*u;t[0]=d-b*a,t[4]=-o*u,t[8]=g+p*a,t[1]=p+g*a,t[5]=o*h,t[9]=b-d*a,t[2]=-o*l,t[6]=a,t[10]=o*c}else if(e.order==="ZYX"){const d=o*h,p=o*u,g=a*h,b=a*u;t[0]=c*h,t[4]=g*l-p,t[8]=d*l+b,t[1]=c*u,t[5]=b*l+d,t[9]=p*l-g,t[2]=-l,t[6]=a*c,t[10]=o*c}else if(e.order==="YZX"){const d=o*c,p=o*l,g=a*c,b=a*l;t[0]=c*h,t[4]=b-d*u,t[8]=g*u+p,t[1]=u,t[5]=o*h,t[9]=-a*h,t[2]=-l*h,t[6]=p*u+g,t[10]=d-b*u}else if(e.order==="XZY"){const d=o*c,p=o*l,g=a*c,b=a*l;t[0]=c*h,t[4]=-u,t[8]=l*h,t[1]=d*u+b,t[5]=o*h,t[9]=p*u-g,t[2]=g*u-p,t[6]=a*h,t[10]=b*u+d}return t[3]=0,t[7]=0,t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,this}makeRotationFromQuaternion(e){return this.compose(Gp,e,Wp)}lookAt(e,t,n){const r=this.elements;return Gn.subVectors(e,t),Gn.lengthSq()===0&&(Gn.z=1),Gn.normalize(),$i.crossVectors(n,Gn),$i.lengthSq()===0&&(Math.abs(n.z)===1?Gn.x+=1e-4:Gn.z+=1e-4,Gn.normalize(),$i.crossVectors(n,Gn)),$i.normalize(),So.crossVectors(Gn,$i),r[0]=$i.x,r[4]=So.x,r[8]=Gn.x,r[1]=$i.y,r[5]=So.y,r[9]=Gn.y,r[2]=$i.z,r[6]=So.z,r[10]=Gn.z,this}multiply(e){return this.multiplyMatrices(this,e)}premultiply(e){return this.multiplyMatrices(e,this)}multiplyMatrices(e,t){const n=e.elements,r=t.elements,s=this.elements,o=n[0],a=n[4],c=n[8],l=n[12],h=n[1],u=n[5],d=n[9],p=n[13],g=n[2],b=n[6],m=n[10],f=n[14],M=n[3],x=n[7],_=n[11],I=n[15],R=r[0],T=r[4],F=r[8],S=r[12],v=r[1],P=r[5],Q=r[9],G=r[13],ae=r[2],oe=r[6],ne=r[10],he=r[14],L=r[3],W=r[7],q=r[11],j=r[15];return s[0]=o*R+a*v+c*ae+l*L,s[4]=o*T+a*P+c*oe+l*W,s[8]=o*F+a*Q+c*ne+l*q,s[12]=o*S+a*G+c*he+l*j,s[1]=h*R+u*v+d*ae+p*L,s[5]=h*T+u*P+d*oe+p*W,s[9]=h*F+u*Q+d*ne+p*q,s[13]=h*S+u*G+d*he+p*j,s[2]=g*R+b*v+m*ae+f*L,s[6]=g*T+b*P+m*oe+f*W,s[10]=g*F+b*Q+m*ne+f*q,s[14]=g*S+b*G+m*he+f*j,s[3]=M*R+x*v+_*ae+I*L,s[7]=M*T+x*P+_*oe+I*W,s[11]=M*F+x*Q+_*ne+I*q,s[15]=M*S+x*G+_*he+I*j,this}multiplyScalar(e){const t=this.elements;return t[0]*=e,t[4]*=e,t[8]*=e,t[12]*=e,t[1]*=e,t[5]*=e,t[9]*=e,t[13]*=e,t[2]*=e,t[6]*=e,t[10]*=e,t[14]*=e,t[3]*=e,t[7]*=e,t[11]*=e,t[15]*=e,this}determinant(){const e=this.elements,t=e[0],n=e[4],r=e[8],s=e[12],o=e[1],a=e[5],c=e[9],l=e[13],h=e[2],u=e[6],d=e[10],p=e[14],g=e[3],b=e[7],m=e[11],f=e[15];return g*(+s*c*u-r*l*u-s*a*d+n*l*d+r*a*p-n*c*p)+b*(+t*c*p-t*l*d+s*o*d-r*o*p+r*l*h-s*c*h)+m*(+t*l*u-t*a*p-s*o*u+n*o*p+s*a*h-n*l*h)+f*(-r*a*h-t*c*u+t*a*d+r*o*u-n*o*d+n*c*h)}transpose(){const e=this.elements;let t;return t=e[1],e[1]=e[4],e[4]=t,t=e[2],e[2]=e[8],e[8]=t,t=e[6],e[6]=e[9],e[9]=t,t=e[3],e[3]=e[12],e[12]=t,t=e[7],e[7]=e[13],e[13]=t,t=e[11],e[11]=e[14],e[14]=t,this}setPosition(e,t,n){const r=this.elements;return e.isVector3?(r[12]=e.x,r[13]=e.y,r[14]=e.z):(r[12]=e,r[13]=t,r[14]=n),this}invert(){const e=this.elements,t=e[0],n=e[1],r=e[2],s=e[3],o=e[4],a=e[5],c=e[6],l=e[7],h=e[8],u=e[9],d=e[10],p=e[11],g=e[12],b=e[13],m=e[14],f=e[15],M=u*m*l-b*d*l+b*c*p-a*m*p-u*c*f+a*d*f,x=g*d*l-h*m*l-g*c*p+o*m*p+h*c*f-o*d*f,_=h*b*l-g*u*l+g*a*p-o*b*p-h*a*f+o*u*f,I=g*u*c-h*b*c-g*a*d+o*b*d+h*a*m-o*u*m,R=t*M+n*x+r*_+s*I;if(R===0)return this.set(0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0);const T=1/R;return e[0]=M*T,e[1]=(b*d*s-u*m*s-b*r*p+n*m*p+u*r*f-n*d*f)*T,e[2]=(a*m*s-b*c*s+b*r*l-n*m*l-a*r*f+n*c*f)*T,e[3]=(u*c*s-a*d*s-u*r*l+n*d*l+a*r*p-n*c*p)*T,e[4]=x*T,e[5]=(h*m*s-g*d*s+g*r*p-t*m*p-h*r*f+t*d*f)*T,e[6]=(g*c*s-o*m*s-g*r*l+t*m*l+o*r*f-t*c*f)*T,e[7]=(o*d*s-h*c*s+h*r*l-t*d*l-o*r*p+t*c*p)*T,e[8]=_*T,e[9]=(g*u*s-h*b*s-g*n*p+t*b*p+h*n*f-t*u*f)*T,e[10]=(o*b*s-g*a*s+g*n*l-t*b*l-o*n*f+t*a*f)*T,e[11]=(h*a*s-o*u*s-h*n*l+t*u*l+o*n*p-t*a*p)*T,e[12]=I*T,e[13]=(h*b*r-g*u*r+g*n*d-t*b*d-h*n*m+t*u*m)*T,e[14]=(g*a*r-o*b*r-g*n*c+t*b*c+o*n*m-t*a*m)*T,e[15]=(o*u*r-h*a*r+h*n*c-t*u*c-o*n*d+t*a*d)*T,this}scale(e){const t=this.elements,n=e.x,r=e.y,s=e.z;return t[0]*=n,t[4]*=r,t[8]*=s,t[1]*=n,t[5]*=r,t[9]*=s,t[2]*=n,t[6]*=r,t[10]*=s,t[3]*=n,t[7]*=r,t[11]*=s,this}getMaxScaleOnAxis(){const e=this.elements,t=e[0]*e[0]+e[1]*e[1]+e[2]*e[2],n=e[4]*e[4]+e[5]*e[5]+e[6]*e[6],r=e[8]*e[8]+e[9]*e[9]+e[10]*e[10];return Math.sqrt(Math.max(t,n,r))}makeTranslation(e,t,n){return e.isVector3?this.set(1,0,0,e.x,0,1,0,e.y,0,0,1,e.z,0,0,0,1):this.set(1,0,0,e,0,1,0,t,0,0,1,n,0,0,0,1),this}makeRotationX(e){const t=Math.cos(e),n=Math.sin(e);return this.set(1,0,0,0,0,t,-n,0,0,n,t,0,0,0,0,1),this}makeRotationY(e){const t=Math.cos(e),n=Math.sin(e);return this.set(t,0,n,0,0,1,0,0,-n,0,t,0,0,0,0,1),this}makeRotationZ(e){const t=Math.cos(e),n=Math.sin(e);return this.set(t,-n,0,0,n,t,0,0,0,0,1,0,0,0,0,1),this}makeRotationAxis(e,t){const n=Math.cos(t),r=Math.sin(t),s=1-n,o=e.x,a=e.y,c=e.z,l=s*o,h=s*a;return this.set(l*o+n,l*a-r*c,l*c+r*a,0,l*a+r*c,h*a+n,h*c-r*o,0,l*c-r*a,h*c+r*o,s*c*c+n,0,0,0,0,1),this}makeScale(e,t,n){return this.set(e,0,0,0,0,t,0,0,0,0,n,0,0,0,0,1),this}makeShear(e,t,n,r,s,o){return this.set(1,n,s,0,e,1,o,0,t,r,1,0,0,0,0,1),this}compose(e,t,n){const r=this.elements,s=t._x,o=t._y,a=t._z,c=t._w,l=s+s,h=o+o,u=a+a,d=s*l,p=s*h,g=s*u,b=o*h,m=o*u,f=a*u,M=c*l,x=c*h,_=c*u,I=n.x,R=n.y,T=n.z;return r[0]=(1-(b+f))*I,r[1]=(p+_)*I,r[2]=(g-x)*I,r[3]=0,r[4]=(p-_)*R,r[5]=(1-(d+f))*R,r[6]=(m+M)*R,r[7]=0,r[8]=(g+x)*T,r[9]=(m-M)*T,r[10]=(1-(d+b))*T,r[11]=0,r[12]=e.x,r[13]=e.y,r[14]=e.z,r[15]=1,this}decompose(e,t,n){const r=this.elements;let s=Gr.set(r[0],r[1],r[2]).length();const o=Gr.set(r[4],r[5],r[6]).length(),a=Gr.set(r[8],r[9],r[10]).length();this.determinant()<0&&(s=-s),e.x=r[12],e.y=r[13],e.z=r[14],ri.copy(this);const l=1/s,h=1/o,u=1/a;return ri.elements[0]*=l,ri.elements[1]*=l,ri.elements[2]*=l,ri.elements[4]*=h,ri.elements[5]*=h,ri.elements[6]*=h,ri.elements[8]*=u,ri.elements[9]*=u,ri.elements[10]*=u,t.setFromRotationMatrix(ri),n.x=s,n.y=o,n.z=a,this}makePerspective(e,t,n,r,s,o,a=ki){const c=this.elements,l=2*s/(t-e),h=2*s/(n-r),u=(t+e)/(t-e),d=(n+r)/(n-r);let p,g;if(a===ki)p=-(o+s)/(o-s),g=-2*o*s/(o-s);else if(a===ga)p=-o/(o-s),g=-o*s/(o-s);else throw new Error("THREE.Matrix4.makePerspective(): Invalid coordinate system: "+a);return c[0]=l,c[4]=0,c[8]=u,c[12]=0,c[1]=0,c[5]=h,c[9]=d,c[13]=0,c[2]=0,c[6]=0,c[10]=p,c[14]=g,c[3]=0,c[7]=0,c[11]=-1,c[15]=0,this}makeOrthographic(e,t,n,r,s,o,a=ki){const c=this.elements,l=1/(t-e),h=1/(n-r),u=1/(o-s),d=(t+e)*l,p=(n+r)*h;let g,b;if(a===ki)g=(o+s)*u,b=-2*u;else if(a===ga)g=s*u,b=-1*u;else throw new Error("THREE.Matrix4.makeOrthographic(): Invalid coordinate system: "+a);return c[0]=2*l,c[4]=0,c[8]=0,c[12]=-d,c[1]=0,c[5]=2*h,c[9]=0,c[13]=-p,c[2]=0,c[6]=0,c[10]=b,c[14]=-g,c[3]=0,c[7]=0,c[11]=0,c[15]=1,this}equals(e){const t=this.elements,n=e.elements;for(let r=0;r<16;r++)if(t[r]!==n[r])return!1;return!0}fromArray(e,t=0){for(let n=0;n<16;n++)this.elements[n]=e[n+t];return this}toArray(e=[],t=0){const n=this.elements;return e[t]=n[0],e[t+1]=n[1],e[t+2]=n[2],e[t+3]=n[3],e[t+4]=n[4],e[t+5]=n[5],e[t+6]=n[6],e[t+7]=n[7],e[t+8]=n[8],e[t+9]=n[9],e[t+10]=n[10],e[t+11]=n[11],e[t+12]=n[12],e[t+13]=n[13],e[t+14]=n[14],e[t+15]=n[15],e}}const Gr=new A,ri=new ot,Gp=new A(0,0,0),Wp=new A(1,1,1),$i=new A,So=new A,Gn=new A,Ch=new ot,Ph=new qe;class vi{constructor(e=0,t=0,n=0,r=vi.DEFAULT_ORDER){this.isEuler=!0,this._x=e,this._y=t,this._z=n,this._order=r}get x(){return this._x}set x(e){this._x=e,this._onChangeCallback()}get y(){return this._y}set y(e){this._y=e,this._onChangeCallback()}get z(){return this._z}set z(e){this._z=e,this._onChangeCallback()}get order(){return this._order}set order(e){this._order=e,this._onChangeCallback()}set(e,t,n,r=this._order){return this._x=e,this._y=t,this._z=n,this._order=r,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._order)}copy(e){return this._x=e._x,this._y=e._y,this._z=e._z,this._order=e._order,this._onChangeCallback(),this}setFromRotationMatrix(e,t=this._order,n=!0){const r=e.elements,s=r[0],o=r[4],a=r[8],c=r[1],l=r[5],h=r[9],u=r[2],d=r[6],p=r[10];switch(t){case"XYZ":this._y=Math.asin(xn(a,-1,1)),Math.abs(a)<.9999999?(this._x=Math.atan2(-h,p),this._z=Math.atan2(-o,s)):(this._x=Math.atan2(d,l),this._z=0);break;case"YXZ":this._x=Math.asin(-xn(h,-1,1)),Math.abs(h)<.9999999?(this._y=Math.atan2(a,p),this._z=Math.atan2(c,l)):(this._y=Math.atan2(-u,s),this._z=0);break;case"ZXY":this._x=Math.asin(xn(d,-1,1)),Math.abs(d)<.9999999?(this._y=Math.atan2(-u,p),this._z=Math.atan2(-o,l)):(this._y=0,this._z=Math.atan2(c,s));break;case"ZYX":this._y=Math.asin(-xn(u,-1,1)),Math.abs(u)<.9999999?(this._x=Math.atan2(d,p),this._z=Math.atan2(c,s)):(this._x=0,this._z=Math.atan2(-o,l));break;case"YZX":this._z=Math.asin(xn(c,-1,1)),Math.abs(c)<.9999999?(this._x=Math.atan2(-h,l),this._y=Math.atan2(-u,s)):(this._x=0,this._y=Math.atan2(a,p));break;case"XZY":this._z=Math.asin(-xn(o,-1,1)),Math.abs(o)<.9999999?(this._x=Math.atan2(d,l),this._y=Math.atan2(a,s)):(this._x=Math.atan2(-h,p),this._y=0);break;default:console.warn("THREE.Euler: .setFromRotationMatrix() encountered an unknown order: "+t)}return this._order=t,n===!0&&this._onChangeCallback(),this}setFromQuaternion(e,t,n){return Ch.makeRotationFromQuaternion(e),this.setFromRotationMatrix(Ch,t,n)}setFromVector3(e,t=this._order){return this.set(e.x,e.y,e.z,t)}reorder(e){return Ph.setFromEuler(this),this.setFromQuaternion(Ph,e)}equals(e){return e._x===this._x&&e._y===this._y&&e._z===this._z&&e._order===this._order}fromArray(e){return this._x=e[0],this._y=e[1],this._z=e[2],e[3]!==void 0&&(this._order=e[3]),this._onChangeCallback(),this}toArray(e=[],t=0){return e[t]=this._x,e[t+1]=this._y,e[t+2]=this._z,e[t+3]=this._order,e}_onChange(e){return this._onChangeCallback=e,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._order}}vi.DEFAULT_ORDER="XYZ";class jl{constructor(){this.mask=1}set(e){this.mask=(1<<e|0)>>>0}enable(e){this.mask|=1<<e|0}enableAll(){this.mask=-1}toggle(e){this.mask^=1<<e|0}disable(e){this.mask&=~(1<<e|0)}disableAll(){this.mask=0}test(e){return(this.mask&e.mask)!==0}isEnabled(e){return(this.mask&(1<<e|0))!==0}}let qp=0;const Lh=new A,Wr=new qe,Ci=new ot,wo=new A,zs=new A,jp=new A,Xp=new qe,Dh=new A(1,0,0),Ih=new A(0,1,0),Nh=new A(0,0,1),Fh={type:"added"},Qp={type:"removed"},qr={type:"childadded",child:null},Ka={type:"childremoved",child:null};class en extends Ur{constructor(){super(),this.isObject3D=!0,Object.defineProperty(this,"id",{value:qp++}),this.uuid=ui(),this.name="",this.type="Object3D",this.parent=null,this.children=[],this.up=en.DEFAULT_UP.clone();const e=new A,t=new vi,n=new qe,r=new A(1,1,1);function s(){n.setFromEuler(t,!1)}function o(){t.setFromQuaternion(n,void 0,!1)}t._onChange(s),n._onChange(o),Object.defineProperties(this,{position:{configurable:!0,enumerable:!0,value:e},rotation:{configurable:!0,enumerable:!0,value:t},quaternion:{configurable:!0,enumerable:!0,value:n},scale:{configurable:!0,enumerable:!0,value:r},modelViewMatrix:{value:new ot},normalMatrix:{value:new yt}}),this.matrix=new ot,this.matrixWorld=new ot,this.matrixAutoUpdate=en.DEFAULT_MATRIX_AUTO_UPDATE,this.matrixWorldAutoUpdate=en.DEFAULT_MATRIX_WORLD_AUTO_UPDATE,this.matrixWorldNeedsUpdate=!1,this.layers=new jl,this.visible=!0,this.castShadow=!1,this.receiveShadow=!1,this.frustumCulled=!0,this.renderOrder=0,this.animations=[],this.userData={}}onBeforeShadow(){}onAfterShadow(){}onBeforeRender(){}onAfterRender(){}applyMatrix4(e){this.matrixAutoUpdate&&this.updateMatrix(),this.matrix.premultiply(e),this.matrix.decompose(this.position,this.quaternion,this.scale)}applyQuaternion(e){return this.quaternion.premultiply(e),this}setRotationFromAxisAngle(e,t){this.quaternion.setFromAxisAngle(e,t)}setRotationFromEuler(e){this.quaternion.setFromEuler(e,!0)}setRotationFromMatrix(e){this.quaternion.setFromRotationMatrix(e)}setRotationFromQuaternion(e){this.quaternion.copy(e)}rotateOnAxis(e,t){return Wr.setFromAxisAngle(e,t),this.quaternion.multiply(Wr),this}rotateOnWorldAxis(e,t){return Wr.setFromAxisAngle(e,t),this.quaternion.premultiply(Wr),this}rotateX(e){return this.rotateOnAxis(Dh,e)}rotateY(e){return this.rotateOnAxis(Ih,e)}rotateZ(e){return this.rotateOnAxis(Nh,e)}translateOnAxis(e,t){return Lh.copy(e).applyQuaternion(this.quaternion),this.position.add(Lh.multiplyScalar(t)),this}translateX(e){return this.translateOnAxis(Dh,e)}translateY(e){return this.translateOnAxis(Ih,e)}translateZ(e){return this.translateOnAxis(Nh,e)}localToWorld(e){return this.updateWorldMatrix(!0,!1),e.applyMatrix4(this.matrixWorld)}worldToLocal(e){return this.updateWorldMatrix(!0,!1),e.applyMatrix4(Ci.copy(this.matrixWorld).invert())}lookAt(e,t,n){e.isVector3?wo.copy(e):wo.set(e,t,n);const r=this.parent;this.updateWorldMatrix(!0,!1),zs.setFromMatrixPosition(this.matrixWorld),this.isCamera||this.isLight?Ci.lookAt(zs,wo,this.up):Ci.lookAt(wo,zs,this.up),this.quaternion.setFromRotationMatrix(Ci),r&&(Ci.extractRotation(r.matrixWorld),Wr.setFromRotationMatrix(Ci),this.quaternion.premultiply(Wr.invert()))}add(e){if(arguments.length>1){for(let t=0;t<arguments.length;t++)this.add(arguments[t]);return this}return e===this?(console.error("THREE.Object3D.add: object can't be added as a child of itself.",e),this):(e&&e.isObject3D?(e.removeFromParent(),e.parent=this,this.children.push(e),e.dispatchEvent(Fh),qr.child=e,this.dispatchEvent(qr),qr.child=null):console.error("THREE.Object3D.add: object not an instance of THREE.Object3D.",e),this)}remove(e){if(arguments.length>1){for(let n=0;n<arguments.length;n++)this.remove(arguments[n]);return this}const t=this.children.indexOf(e);return t!==-1&&(e.parent=null,this.children.splice(t,1),e.dispatchEvent(Qp),Ka.child=e,this.dispatchEvent(Ka),Ka.child=null),this}removeFromParent(){const e=this.parent;return e!==null&&e.remove(this),this}clear(){return this.remove(...this.children)}attach(e){return this.updateWorldMatrix(!0,!1),Ci.copy(this.matrixWorld).invert(),e.parent!==null&&(e.parent.updateWorldMatrix(!0,!1),Ci.multiply(e.parent.matrixWorld)),e.applyMatrix4(Ci),e.removeFromParent(),e.parent=this,this.children.push(e),e.updateWorldMatrix(!1,!0),e.dispatchEvent(Fh),qr.child=e,this.dispatchEvent(qr),qr.child=null,this}getObjectById(e){return this.getObjectByProperty("id",e)}getObjectByName(e){return this.getObjectByProperty("name",e)}getObjectByProperty(e,t){if(this[e]===t)return this;for(let n=0,r=this.children.length;n<r;n++){const o=this.children[n].getObjectByProperty(e,t);if(o!==void 0)return o}}getObjectsByProperty(e,t,n=[]){this[e]===t&&n.push(this);const r=this.children;for(let s=0,o=r.length;s<o;s++)r[s].getObjectsByProperty(e,t,n);return n}getWorldPosition(e){return this.updateWorldMatrix(!0,!1),e.setFromMatrixPosition(this.matrixWorld)}getWorldQuaternion(e){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(zs,e,jp),e}getWorldScale(e){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(zs,Xp,e),e}getWorldDirection(e){this.updateWorldMatrix(!0,!1);const t=this.matrixWorld.elements;return e.set(t[8],t[9],t[10]).normalize()}raycast(){}traverse(e){e(this);const t=this.children;for(let n=0,r=t.length;n<r;n++)t[n].traverse(e)}traverseVisible(e){if(this.visible===!1)return;e(this);const t=this.children;for(let n=0,r=t.length;n<r;n++)t[n].traverseVisible(e)}traverseAncestors(e){const t=this.parent;t!==null&&(e(t),t.traverseAncestors(e))}updateMatrix(){this.matrix.compose(this.position,this.quaternion,this.scale),this.matrixWorldNeedsUpdate=!0}updateMatrixWorld(e){this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||e)&&(this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),this.matrixWorldNeedsUpdate=!1,e=!0);const t=this.children;for(let n=0,r=t.length;n<r;n++)t[n].updateMatrixWorld(e)}updateWorldMatrix(e,t){const n=this.parent;if(e===!0&&n!==null&&n.updateWorldMatrix(!0,!1),this.matrixAutoUpdate&&this.updateMatrix(),this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),t===!0){const r=this.children;for(let s=0,o=r.length;s<o;s++)r[s].updateWorldMatrix(!1,!0)}}toJSON(e){const t=e===void 0||typeof e=="string",n={};t&&(e={geometries:{},materials:{},textures:{},images:{},shapes:{},skeletons:{},animations:{},nodes:{}},n.metadata={version:4.6,type:"Object",generator:"Object3D.toJSON"});const r={};r.uuid=this.uuid,r.type=this.type,this.name!==""&&(r.name=this.name),this.castShadow===!0&&(r.castShadow=!0),this.receiveShadow===!0&&(r.receiveShadow=!0),this.visible===!1&&(r.visible=!1),this.frustumCulled===!1&&(r.frustumCulled=!1),this.renderOrder!==0&&(r.renderOrder=this.renderOrder),Object.keys(this.userData).length>0&&(r.userData=this.userData),r.layers=this.layers.mask,r.matrix=this.matrix.toArray(),r.up=this.up.toArray(),this.matrixAutoUpdate===!1&&(r.matrixAutoUpdate=!1),this.isInstancedMesh&&(r.type="InstancedMesh",r.count=this.count,r.instanceMatrix=this.instanceMatrix.toJSON(),this.instanceColor!==null&&(r.instanceColor=this.instanceColor.toJSON())),this.isBatchedMesh&&(r.type="BatchedMesh",r.perObjectFrustumCulled=this.perObjectFrustumCulled,r.sortObjects=this.sortObjects,r.drawRanges=this._drawRanges,r.reservedRanges=this._reservedRanges,r.visibility=this._visibility,r.active=this._active,r.bounds=this._bounds.map(a=>({boxInitialized:a.boxInitialized,boxMin:a.box.min.toArray(),boxMax:a.box.max.toArray(),sphereInitialized:a.sphereInitialized,sphereRadius:a.sphere.radius,sphereCenter:a.sphere.center.toArray()})),r.maxInstanceCount=this._maxInstanceCount,r.maxVertexCount=this._maxVertexCount,r.maxIndexCount=this._maxIndexCount,r.geometryInitialized=this._geometryInitialized,r.geometryCount=this._geometryCount,r.matricesTexture=this._matricesTexture.toJSON(e),this._colorsTexture!==null&&(r.colorsTexture=this._colorsTexture.toJSON(e)),this.boundingSphere!==null&&(r.boundingSphere={center:r.boundingSphere.center.toArray(),radius:r.boundingSphere.radius}),this.boundingBox!==null&&(r.boundingBox={min:r.boundingBox.min.toArray(),max:r.boundingBox.max.toArray()}));function s(a,c){return a[c.uuid]===void 0&&(a[c.uuid]=c.toJSON(e)),c.uuid}if(this.isScene)this.background&&(this.background.isColor?r.background=this.background.toJSON():this.background.isTexture&&(r.background=this.background.toJSON(e).uuid)),this.environment&&this.environment.isTexture&&this.environment.isRenderTargetTexture!==!0&&(r.environment=this.environment.toJSON(e).uuid);else if(this.isMesh||this.isLine||this.isPoints){r.geometry=s(e.geometries,this.geometry);const a=this.geometry.parameters;if(a!==void 0&&a.shapes!==void 0){const c=a.shapes;if(Array.isArray(c))for(let l=0,h=c.length;l<h;l++){const u=c[l];s(e.shapes,u)}else s(e.shapes,c)}}if(this.isSkinnedMesh&&(r.bindMode=this.bindMode,r.bindMatrix=this.bindMatrix.toArray(),this.skeleton!==void 0&&(s(e.skeletons,this.skeleton),r.skeleton=this.skeleton.uuid)),this.material!==void 0)if(Array.isArray(this.material)){const a=[];for(let c=0,l=this.material.length;c<l;c++)a.push(s(e.materials,this.material[c]));r.material=a}else r.material=s(e.materials,this.material);if(this.children.length>0){r.children=[];for(let a=0;a<this.children.length;a++)r.children.push(this.children[a].toJSON(e).object)}if(this.animations.length>0){r.animations=[];for(let a=0;a<this.animations.length;a++){const c=this.animations[a];r.animations.push(s(e.animations,c))}}if(t){const a=o(e.geometries),c=o(e.materials),l=o(e.textures),h=o(e.images),u=o(e.shapes),d=o(e.skeletons),p=o(e.animations),g=o(e.nodes);a.length>0&&(n.geometries=a),c.length>0&&(n.materials=c),l.length>0&&(n.textures=l),h.length>0&&(n.images=h),u.length>0&&(n.shapes=u),d.length>0&&(n.skeletons=d),p.length>0&&(n.animations=p),g.length>0&&(n.nodes=g)}return n.object=r,n;function o(a){const c=[];for(const l in a){const h=a[l];delete h.metadata,c.push(h)}return c}}clone(e){return new this.constructor().copy(this,e)}copy(e,t=!0){if(this.name=e.name,this.up.copy(e.up),this.position.copy(e.position),this.rotation.order=e.rotation.order,this.quaternion.copy(e.quaternion),this.scale.copy(e.scale),this.matrix.copy(e.matrix),this.matrixWorld.copy(e.matrixWorld),this.matrixAutoUpdate=e.matrixAutoUpdate,this.matrixWorldAutoUpdate=e.matrixWorldAutoUpdate,this.matrixWorldNeedsUpdate=e.matrixWorldNeedsUpdate,this.layers.mask=e.layers.mask,this.visible=e.visible,this.castShadow=e.castShadow,this.receiveShadow=e.receiveShadow,this.frustumCulled=e.frustumCulled,this.renderOrder=e.renderOrder,this.animations=e.animations.slice(),this.userData=JSON.parse(JSON.stringify(e.userData)),t===!0)for(let n=0;n<e.children.length;n++){const r=e.children[n];this.add(r.clone())}return this}}en.DEFAULT_UP=new A(0,1,0);en.DEFAULT_MATRIX_AUTO_UPDATE=!0;en.DEFAULT_MATRIX_WORLD_AUTO_UPDATE=!0;const si=new A,Pi=new A,Ya=new A,Li=new A,jr=new A,Xr=new A,Uh=new A,$a=new A,Za=new A,Ja=new A,ec=new mt,tc=new mt,nc=new mt;class Jn{constructor(e=new A,t=new A,n=new A){this.a=e,this.b=t,this.c=n}static getNormal(e,t,n,r){r.subVectors(n,t),si.subVectors(e,t),r.cross(si);const s=r.lengthSq();return s>0?r.multiplyScalar(1/Math.sqrt(s)):r.set(0,0,0)}static getBarycoord(e,t,n,r,s){si.subVectors(r,t),Pi.subVectors(n,t),Ya.subVectors(e,t);const o=si.dot(si),a=si.dot(Pi),c=si.dot(Ya),l=Pi.dot(Pi),h=Pi.dot(Ya),u=o*l-a*a;if(u===0)return s.set(0,0,0),null;const d=1/u,p=(l*c-a*h)*d,g=(o*h-a*c)*d;return s.set(1-p-g,g,p)}static containsPoint(e,t,n,r){return this.getBarycoord(e,t,n,r,Li)===null?!1:Li.x>=0&&Li.y>=0&&Li.x+Li.y<=1}static getInterpolation(e,t,n,r,s,o,a,c){return this.getBarycoord(e,t,n,r,Li)===null?(c.x=0,c.y=0,"z"in c&&(c.z=0),"w"in c&&(c.w=0),null):(c.setScalar(0),c.addScaledVector(s,Li.x),c.addScaledVector(o,Li.y),c.addScaledVector(a,Li.z),c)}static getInterpolatedAttribute(e,t,n,r,s,o){return ec.setScalar(0),tc.setScalar(0),nc.setScalar(0),ec.fromBufferAttribute(e,t),tc.fromBufferAttribute(e,n),nc.fromBufferAttribute(e,r),o.setScalar(0),o.addScaledVector(ec,s.x),o.addScaledVector(tc,s.y),o.addScaledVector(nc,s.z),o}static isFrontFacing(e,t,n,r){return si.subVectors(n,t),Pi.subVectors(e,t),si.cross(Pi).dot(r)<0}set(e,t,n){return this.a.copy(e),this.b.copy(t),this.c.copy(n),this}setFromPointsAndIndices(e,t,n,r){return this.a.copy(e[t]),this.b.copy(e[n]),this.c.copy(e[r]),this}setFromAttributeAndIndices(e,t,n,r){return this.a.fromBufferAttribute(e,t),this.b.fromBufferAttribute(e,n),this.c.fromBufferAttribute(e,r),this}clone(){return new this.constructor().copy(this)}copy(e){return this.a.copy(e.a),this.b.copy(e.b),this.c.copy(e.c),this}getArea(){return si.subVectors(this.c,this.b),Pi.subVectors(this.a,this.b),si.cross(Pi).length()*.5}getMidpoint(e){return e.addVectors(this.a,this.b).add(this.c).multiplyScalar(1/3)}getNormal(e){return Jn.getNormal(this.a,this.b,this.c,e)}getPlane(e){return e.setFromCoplanarPoints(this.a,this.b,this.c)}getBarycoord(e,t){return Jn.getBarycoord(e,this.a,this.b,this.c,t)}getInterpolation(e,t,n,r,s){return Jn.getInterpolation(e,this.a,this.b,this.c,t,n,r,s)}containsPoint(e){return Jn.containsPoint(e,this.a,this.b,this.c)}isFrontFacing(e){return Jn.isFrontFacing(this.a,this.b,this.c,e)}intersectsBox(e){return e.intersectsTriangle(this)}closestPointToPoint(e,t){const n=this.a,r=this.b,s=this.c;let o,a;jr.subVectors(r,n),Xr.subVectors(s,n),$a.subVectors(e,n);const c=jr.dot($a),l=Xr.dot($a);if(c<=0&&l<=0)return t.copy(n);Za.subVectors(e,r);const h=jr.dot(Za),u=Xr.dot(Za);if(h>=0&&u<=h)return t.copy(r);const d=c*u-h*l;if(d<=0&&c>=0&&h<=0)return o=c/(c-h),t.copy(n).addScaledVector(jr,o);Ja.subVectors(e,s);const p=jr.dot(Ja),g=Xr.dot(Ja);if(g>=0&&p<=g)return t.copy(s);const b=p*l-c*g;if(b<=0&&l>=0&&g<=0)return a=l/(l-g),t.copy(n).addScaledVector(Xr,a);const m=h*g-p*u;if(m<=0&&u-h>=0&&p-g>=0)return Uh.subVectors(s,r),a=(u-h)/(u-h+(p-g)),t.copy(r).addScaledVector(Uh,a);const f=1/(m+b+d);return o=b*f,a=d*f,t.copy(n).addScaledVector(jr,o).addScaledVector(Xr,a)}equals(e){return e.a.equals(this.a)&&e.b.equals(this.b)&&e.c.equals(this.c)}}const Sd={aliceblue:15792383,antiquewhite:16444375,aqua:65535,aquamarine:8388564,azure:15794175,beige:16119260,bisque:16770244,black:0,blanchedalmond:16772045,blue:255,blueviolet:9055202,brown:10824234,burlywood:14596231,cadetblue:6266528,chartreuse:8388352,chocolate:13789470,coral:16744272,cornflowerblue:6591981,cornsilk:16775388,crimson:14423100,cyan:65535,darkblue:139,darkcyan:35723,darkgoldenrod:12092939,darkgray:11119017,darkgreen:25600,darkgrey:11119017,darkkhaki:12433259,darkmagenta:9109643,darkolivegreen:5597999,darkorange:16747520,darkorchid:10040012,darkred:9109504,darksalmon:15308410,darkseagreen:9419919,darkslateblue:4734347,darkslategray:3100495,darkslategrey:3100495,darkturquoise:52945,darkviolet:9699539,deeppink:16716947,deepskyblue:49151,dimgray:6908265,dimgrey:6908265,dodgerblue:2003199,firebrick:11674146,floralwhite:16775920,forestgreen:2263842,fuchsia:16711935,gainsboro:14474460,ghostwhite:16316671,gold:16766720,goldenrod:14329120,gray:8421504,green:32768,greenyellow:11403055,grey:8421504,honeydew:15794160,hotpink:16738740,indianred:13458524,indigo:4915330,ivory:16777200,khaki:15787660,lavender:15132410,lavenderblush:16773365,lawngreen:8190976,lemonchiffon:16775885,lightblue:11393254,lightcoral:15761536,lightcyan:14745599,lightgoldenrodyellow:16448210,lightgray:13882323,lightgreen:9498256,lightgrey:13882323,lightpink:16758465,lightsalmon:16752762,lightseagreen:2142890,lightskyblue:8900346,lightslategray:7833753,lightslategrey:7833753,lightsteelblue:11584734,lightyellow:16777184,lime:65280,limegreen:3329330,linen:16445670,magenta:16711935,maroon:8388608,mediumaquamarine:6737322,mediumblue:205,mediumorchid:12211667,mediumpurple:9662683,mediumseagreen:3978097,mediumslateblue:8087790,mediumspringgreen:64154,mediumturquoise:4772300,mediumvioletred:13047173,midnightblue:1644912,mintcream:16121850,mistyrose:16770273,moccasin:16770229,navajowhite:16768685,navy:128,oldlace:16643558,olive:8421376,olivedrab:7048739,orange:16753920,orangered:16729344,orchid:14315734,palegoldenrod:15657130,palegreen:10025880,paleturquoise:11529966,palevioletred:14381203,papayawhip:16773077,peachpuff:16767673,peru:13468991,pink:16761035,plum:14524637,powderblue:11591910,purple:8388736,rebeccapurple:6697881,red:16711680,rosybrown:12357519,royalblue:4286945,saddlebrown:9127187,salmon:16416882,sandybrown:16032864,seagreen:3050327,seashell:16774638,sienna:10506797,silver:12632256,skyblue:8900331,slateblue:6970061,slategray:7372944,slategrey:7372944,snow:16775930,springgreen:65407,steelblue:4620980,tan:13808780,teal:32896,thistle:14204888,tomato:16737095,turquoise:4251856,violet:15631086,wheat:16113331,white:16777215,whitesmoke:16119285,yellow:16776960,yellowgreen:10145074},Zi={h:0,s:0,l:0},Eo={h:0,s:0,l:0};function ic(i,e,t){return t<0&&(t+=1),t>1&&(t-=1),t<1/6?i+(e-i)*6*t:t<1/2?e:t<2/3?i+(e-i)*6*(2/3-t):i}class st{constructor(e,t,n){return this.isColor=!0,this.r=1,this.g=1,this.b=1,this.set(e,t,n)}set(e,t,n){if(t===void 0&&n===void 0){const r=e;r&&r.isColor?this.copy(r):typeof r=="number"?this.setHex(r):typeof r=="string"&&this.setStyle(r)}else this.setRGB(e,t,n);return this}setScalar(e){return this.r=e,this.g=e,this.b=e,this}setHex(e,t=ln){return e=Math.floor(e),this.r=(e>>16&255)/255,this.g=(e>>8&255)/255,this.b=(e&255)/255,Ct.toWorkingColorSpace(this,t),this}setRGB(e,t,n,r=Ct.workingColorSpace){return this.r=e,this.g=t,this.b=n,Ct.toWorkingColorSpace(this,r),this}setHSL(e,t,n,r=Ct.workingColorSpace){if(e=ql(e,1),t=xn(t,0,1),n=xn(n,0,1),t===0)this.r=this.g=this.b=n;else{const s=n<=.5?n*(1+t):n+t-n*t,o=2*n-s;this.r=ic(o,s,e+1/3),this.g=ic(o,s,e),this.b=ic(o,s,e-1/3)}return Ct.toWorkingColorSpace(this,r),this}setStyle(e,t=ln){function n(s){s!==void 0&&parseFloat(s)<1&&console.warn("THREE.Color: Alpha component of "+e+" will be ignored.")}let r;if(r=/^(\w+)\(([^\)]*)\)/.exec(e)){let s;const o=r[1],a=r[2];switch(o){case"rgb":case"rgba":if(s=/^\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(a))return n(s[4]),this.setRGB(Math.min(255,parseInt(s[1],10))/255,Math.min(255,parseInt(s[2],10))/255,Math.min(255,parseInt(s[3],10))/255,t);if(s=/^\s*(\d+)\%\s*,\s*(\d+)\%\s*,\s*(\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(a))return n(s[4]),this.setRGB(Math.min(100,parseInt(s[1],10))/100,Math.min(100,parseInt(s[2],10))/100,Math.min(100,parseInt(s[3],10))/100,t);break;case"hsl":case"hsla":if(s=/^\s*(\d*\.?\d+)\s*,\s*(\d*\.?\d+)\%\s*,\s*(\d*\.?\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(a))return n(s[4]),this.setHSL(parseFloat(s[1])/360,parseFloat(s[2])/100,parseFloat(s[3])/100,t);break;default:console.warn("THREE.Color: Unknown color model "+e)}}else if(r=/^\#([A-Fa-f\d]+)$/.exec(e)){const s=r[1],o=s.length;if(o===3)return this.setRGB(parseInt(s.charAt(0),16)/15,parseInt(s.charAt(1),16)/15,parseInt(s.charAt(2),16)/15,t);if(o===6)return this.setHex(parseInt(s,16),t);console.warn("THREE.Color: Invalid hex color "+e)}else if(e&&e.length>0)return this.setColorName(e,t);return this}setColorName(e,t=ln){const n=Sd[e.toLowerCase()];return n!==void 0?this.setHex(n,t):console.warn("THREE.Color: Unknown color "+e),this}clone(){return new this.constructor(this.r,this.g,this.b)}copy(e){return this.r=e.r,this.g=e.g,this.b=e.b,this}copySRGBToLinear(e){return this.r=Hi(e.r),this.g=Hi(e.g),this.b=Hi(e.b),this}copyLinearToSRGB(e){return this.r=ls(e.r),this.g=ls(e.g),this.b=ls(e.b),this}convertSRGBToLinear(){return this.copySRGBToLinear(this),this}convertLinearToSRGB(){return this.copyLinearToSRGB(this),this}getHex(e=ln){return Ct.fromWorkingColorSpace(Sn.copy(this),e),Math.round(xn(Sn.r*255,0,255))*65536+Math.round(xn(Sn.g*255,0,255))*256+Math.round(xn(Sn.b*255,0,255))}getHexString(e=ln){return("000000"+this.getHex(e).toString(16)).slice(-6)}getHSL(e,t=Ct.workingColorSpace){Ct.fromWorkingColorSpace(Sn.copy(this),t);const n=Sn.r,r=Sn.g,s=Sn.b,o=Math.max(n,r,s),a=Math.min(n,r,s);let c,l;const h=(a+o)/2;if(a===o)c=0,l=0;else{const u=o-a;switch(l=h<=.5?u/(o+a):u/(2-o-a),o){case n:c=(r-s)/u+(r<s?6:0);break;case r:c=(s-n)/u+2;break;case s:c=(n-r)/u+4;break}c/=6}return e.h=c,e.s=l,e.l=h,e}getRGB(e,t=Ct.workingColorSpace){return Ct.fromWorkingColorSpace(Sn.copy(this),t),e.r=Sn.r,e.g=Sn.g,e.b=Sn.b,e}getStyle(e=ln){Ct.fromWorkingColorSpace(Sn.copy(this),e);const t=Sn.r,n=Sn.g,r=Sn.b;return e!==ln?`color(${e} ${t.toFixed(3)} ${n.toFixed(3)} ${r.toFixed(3)})`:`rgb(${Math.round(t*255)},${Math.round(n*255)},${Math.round(r*255)})`}offsetHSL(e,t,n){return this.getHSL(Zi),this.setHSL(Zi.h+e,Zi.s+t,Zi.l+n)}add(e){return this.r+=e.r,this.g+=e.g,this.b+=e.b,this}addColors(e,t){return this.r=e.r+t.r,this.g=e.g+t.g,this.b=e.b+t.b,this}addScalar(e){return this.r+=e,this.g+=e,this.b+=e,this}sub(e){return this.r=Math.max(0,this.r-e.r),this.g=Math.max(0,this.g-e.g),this.b=Math.max(0,this.b-e.b),this}multiply(e){return this.r*=e.r,this.g*=e.g,this.b*=e.b,this}multiplyScalar(e){return this.r*=e,this.g*=e,this.b*=e,this}lerp(e,t){return this.r+=(e.r-this.r)*t,this.g+=(e.g-this.g)*t,this.b+=(e.b-this.b)*t,this}lerpColors(e,t,n){return this.r=e.r+(t.r-e.r)*n,this.g=e.g+(t.g-e.g)*n,this.b=e.b+(t.b-e.b)*n,this}lerpHSL(e,t){this.getHSL(Zi),e.getHSL(Eo);const n=Js(Zi.h,Eo.h,t),r=Js(Zi.s,Eo.s,t),s=Js(Zi.l,Eo.l,t);return this.setHSL(n,r,s),this}setFromVector3(e){return this.r=e.x,this.g=e.y,this.b=e.z,this}applyMatrix3(e){const t=this.r,n=this.g,r=this.b,s=e.elements;return this.r=s[0]*t+s[3]*n+s[6]*r,this.g=s[1]*t+s[4]*n+s[7]*r,this.b=s[2]*t+s[5]*n+s[8]*r,this}equals(e){return e.r===this.r&&e.g===this.g&&e.b===this.b}fromArray(e,t=0){return this.r=e[t],this.g=e[t+1],this.b=e[t+2],this}toArray(e=[],t=0){return e[t]=this.r,e[t+1]=this.g,e[t+2]=this.b,e}fromBufferAttribute(e,t){return this.r=e.getX(t),this.g=e.getY(t),this.b=e.getZ(t),this}toJSON(){return this.getHex()}*[Symbol.iterator](){yield this.r,yield this.g,yield this.b}}const Sn=new st;st.NAMES=Sd;let Kp=0;class di extends Ur{static get type(){return"Material"}get type(){return this.constructor.type}set type(e){}constructor(){super(),this.isMaterial=!0,Object.defineProperty(this,"id",{value:Kp++}),this.uuid=ui(),this.name="",this.blending=as,this.side=Wi,this.vertexColors=!1,this.opacity=1,this.transparent=!1,this.alphaHash=!1,this.blendSrc=Uc,this.blendDst=Oc,this.blendEquation=Cr,this.blendSrcAlpha=null,this.blendDstAlpha=null,this.blendEquationAlpha=null,this.blendColor=new st(0,0,0),this.blendAlpha=0,this.depthFunc=gs,this.depthTest=!0,this.depthWrite=!0,this.stencilWriteMask=255,this.stencilFunc=xh,this.stencilRef=0,this.stencilFuncMask=255,this.stencilFail=kr,this.stencilZFail=kr,this.stencilZPass=kr,this.stencilWrite=!1,this.clippingPlanes=null,this.clipIntersection=!1,this.clipShadows=!1,this.shadowSide=null,this.colorWrite=!0,this.precision=null,this.polygonOffset=!1,this.polygonOffsetFactor=0,this.polygonOffsetUnits=0,this.dithering=!1,this.alphaToCoverage=!1,this.premultipliedAlpha=!1,this.forceSinglePass=!1,this.visible=!0,this.toneMapped=!0,this.userData={},this.version=0,this._alphaTest=0}get alphaTest(){return this._alphaTest}set alphaTest(e){this._alphaTest>0!=e>0&&this.version++,this._alphaTest=e}onBeforeRender(){}onBeforeCompile(){}customProgramCacheKey(){return this.onBeforeCompile.toString()}setValues(e){if(e!==void 0)for(const t in e){const n=e[t];if(n===void 0){console.warn(`THREE.Material: parameter '${t}' has value of undefined.`);continue}const r=this[t];if(r===void 0){console.warn(`THREE.Material: '${t}' is not a property of THREE.${this.type}.`);continue}r&&r.isColor?r.set(n):r&&r.isVector3&&n&&n.isVector3?r.copy(n):this[t]=n}}toJSON(e){const t=e===void 0||typeof e=="string";t&&(e={textures:{},images:{}});const n={metadata:{version:4.6,type:"Material",generator:"Material.toJSON"}};n.uuid=this.uuid,n.type=this.type,this.name!==""&&(n.name=this.name),this.color&&this.color.isColor&&(n.color=this.color.getHex()),this.roughness!==void 0&&(n.roughness=this.roughness),this.metalness!==void 0&&(n.metalness=this.metalness),this.sheen!==void 0&&(n.sheen=this.sheen),this.sheenColor&&this.sheenColor.isColor&&(n.sheenColor=this.sheenColor.getHex()),this.sheenRoughness!==void 0&&(n.sheenRoughness=this.sheenRoughness),this.emissive&&this.emissive.isColor&&(n.emissive=this.emissive.getHex()),this.emissiveIntensity!==void 0&&this.emissiveIntensity!==1&&(n.emissiveIntensity=this.emissiveIntensity),this.specular&&this.specular.isColor&&(n.specular=this.specular.getHex()),this.specularIntensity!==void 0&&(n.specularIntensity=this.specularIntensity),this.specularColor&&this.specularColor.isColor&&(n.specularColor=this.specularColor.getHex()),this.shininess!==void 0&&(n.shininess=this.shininess),this.clearcoat!==void 0&&(n.clearcoat=this.clearcoat),this.clearcoatRoughness!==void 0&&(n.clearcoatRoughness=this.clearcoatRoughness),this.clearcoatMap&&this.clearcoatMap.isTexture&&(n.clearcoatMap=this.clearcoatMap.toJSON(e).uuid),this.clearcoatRoughnessMap&&this.clearcoatRoughnessMap.isTexture&&(n.clearcoatRoughnessMap=this.clearcoatRoughnessMap.toJSON(e).uuid),this.clearcoatNormalMap&&this.clearcoatNormalMap.isTexture&&(n.clearcoatNormalMap=this.clearcoatNormalMap.toJSON(e).uuid,n.clearcoatNormalScale=this.clearcoatNormalScale.toArray()),this.dispersion!==void 0&&(n.dispersion=this.dispersion),this.iridescence!==void 0&&(n.iridescence=this.iridescence),this.iridescenceIOR!==void 0&&(n.iridescenceIOR=this.iridescenceIOR),this.iridescenceThicknessRange!==void 0&&(n.iridescenceThicknessRange=this.iridescenceThicknessRange),this.iridescenceMap&&this.iridescenceMap.isTexture&&(n.iridescenceMap=this.iridescenceMap.toJSON(e).uuid),this.iridescenceThicknessMap&&this.iridescenceThicknessMap.isTexture&&(n.iridescenceThicknessMap=this.iridescenceThicknessMap.toJSON(e).uuid),this.anisotropy!==void 0&&(n.anisotropy=this.anisotropy),this.anisotropyRotation!==void 0&&(n.anisotropyRotation=this.anisotropyRotation),this.anisotropyMap&&this.anisotropyMap.isTexture&&(n.anisotropyMap=this.anisotropyMap.toJSON(e).uuid),this.map&&this.map.isTexture&&(n.map=this.map.toJSON(e).uuid),this.matcap&&this.matcap.isTexture&&(n.matcap=this.matcap.toJSON(e).uuid),this.alphaMap&&this.alphaMap.isTexture&&(n.alphaMap=this.alphaMap.toJSON(e).uuid),this.lightMap&&this.lightMap.isTexture&&(n.lightMap=this.lightMap.toJSON(e).uuid,n.lightMapIntensity=this.lightMapIntensity),this.aoMap&&this.aoMap.isTexture&&(n.aoMap=this.aoMap.toJSON(e).uuid,n.aoMapIntensity=this.aoMapIntensity),this.bumpMap&&this.bumpMap.isTexture&&(n.bumpMap=this.bumpMap.toJSON(e).uuid,n.bumpScale=this.bumpScale),this.normalMap&&this.normalMap.isTexture&&(n.normalMap=this.normalMap.toJSON(e).uuid,n.normalMapType=this.normalMapType,n.normalScale=this.normalScale.toArray()),this.displacementMap&&this.displacementMap.isTexture&&(n.displacementMap=this.displacementMap.toJSON(e).uuid,n.displacementScale=this.displacementScale,n.displacementBias=this.displacementBias),this.roughnessMap&&this.roughnessMap.isTexture&&(n.roughnessMap=this.roughnessMap.toJSON(e).uuid),this.metalnessMap&&this.metalnessMap.isTexture&&(n.metalnessMap=this.metalnessMap.toJSON(e).uuid),this.emissiveMap&&this.emissiveMap.isTexture&&(n.emissiveMap=this.emissiveMap.toJSON(e).uuid),this.specularMap&&this.specularMap.isTexture&&(n.specularMap=this.specularMap.toJSON(e).uuid),this.specularIntensityMap&&this.specularIntensityMap.isTexture&&(n.specularIntensityMap=this.specularIntensityMap.toJSON(e).uuid),this.specularColorMap&&this.specularColorMap.isTexture&&(n.specularColorMap=this.specularColorMap.toJSON(e).uuid),this.envMap&&this.envMap.isTexture&&(n.envMap=this.envMap.toJSON(e).uuid,this.combine!==void 0&&(n.combine=this.combine)),this.envMapRotation!==void 0&&(n.envMapRotation=this.envMapRotation.toArray()),this.envMapIntensity!==void 0&&(n.envMapIntensity=this.envMapIntensity),this.reflectivity!==void 0&&(n.reflectivity=this.reflectivity),this.refractionRatio!==void 0&&(n.refractionRatio=this.refractionRatio),this.gradientMap&&this.gradientMap.isTexture&&(n.gradientMap=this.gradientMap.toJSON(e).uuid),this.transmission!==void 0&&(n.transmission=this.transmission),this.transmissionMap&&this.transmissionMap.isTexture&&(n.transmissionMap=this.transmissionMap.toJSON(e).uuid),this.thickness!==void 0&&(n.thickness=this.thickness),this.thicknessMap&&this.thicknessMap.isTexture&&(n.thicknessMap=this.thicknessMap.toJSON(e).uuid),this.attenuationDistance!==void 0&&this.attenuationDistance!==1/0&&(n.attenuationDistance=this.attenuationDistance),this.attenuationColor!==void 0&&(n.attenuationColor=this.attenuationColor.getHex()),this.size!==void 0&&(n.size=this.size),this.shadowSide!==null&&(n.shadowSide=this.shadowSide),this.sizeAttenuation!==void 0&&(n.sizeAttenuation=this.sizeAttenuation),this.blending!==as&&(n.blending=this.blending),this.side!==Wi&&(n.side=this.side),this.vertexColors===!0&&(n.vertexColors=!0),this.opacity<1&&(n.opacity=this.opacity),this.transparent===!0&&(n.transparent=!0),this.blendSrc!==Uc&&(n.blendSrc=this.blendSrc),this.blendDst!==Oc&&(n.blendDst=this.blendDst),this.blendEquation!==Cr&&(n.blendEquation=this.blendEquation),this.blendSrcAlpha!==null&&(n.blendSrcAlpha=this.blendSrcAlpha),this.blendDstAlpha!==null&&(n.blendDstAlpha=this.blendDstAlpha),this.blendEquationAlpha!==null&&(n.blendEquationAlpha=this.blendEquationAlpha),this.blendColor&&this.blendColor.isColor&&(n.blendColor=this.blendColor.getHex()),this.blendAlpha!==0&&(n.blendAlpha=this.blendAlpha),this.depthFunc!==gs&&(n.depthFunc=this.depthFunc),this.depthTest===!1&&(n.depthTest=this.depthTest),this.depthWrite===!1&&(n.depthWrite=this.depthWrite),this.colorWrite===!1&&(n.colorWrite=this.colorWrite),this.stencilWriteMask!==255&&(n.stencilWriteMask=this.stencilWriteMask),this.stencilFunc!==xh&&(n.stencilFunc=this.stencilFunc),this.stencilRef!==0&&(n.stencilRef=this.stencilRef),this.stencilFuncMask!==255&&(n.stencilFuncMask=this.stencilFuncMask),this.stencilFail!==kr&&(n.stencilFail=this.stencilFail),this.stencilZFail!==kr&&(n.stencilZFail=this.stencilZFail),this.stencilZPass!==kr&&(n.stencilZPass=this.stencilZPass),this.stencilWrite===!0&&(n.stencilWrite=this.stencilWrite),this.rotation!==void 0&&this.rotation!==0&&(n.rotation=this.rotation),this.polygonOffset===!0&&(n.polygonOffset=!0),this.polygonOffsetFactor!==0&&(n.polygonOffsetFactor=this.polygonOffsetFactor),this.polygonOffsetUnits!==0&&(n.polygonOffsetUnits=this.polygonOffsetUnits),this.linewidth!==void 0&&this.linewidth!==1&&(n.linewidth=this.linewidth),this.dashSize!==void 0&&(n.dashSize=this.dashSize),this.gapSize!==void 0&&(n.gapSize=this.gapSize),this.scale!==void 0&&(n.scale=this.scale),this.dithering===!0&&(n.dithering=!0),this.alphaTest>0&&(n.alphaTest=this.alphaTest),this.alphaHash===!0&&(n.alphaHash=!0),this.alphaToCoverage===!0&&(n.alphaToCoverage=!0),this.premultipliedAlpha===!0&&(n.premultipliedAlpha=!0),this.forceSinglePass===!0&&(n.forceSinglePass=!0),this.wireframe===!0&&(n.wireframe=!0),this.wireframeLinewidth>1&&(n.wireframeLinewidth=this.wireframeLinewidth),this.wireframeLinecap!=="round"&&(n.wireframeLinecap=this.wireframeLinecap),this.wireframeLinejoin!=="round"&&(n.wireframeLinejoin=this.wireframeLinejoin),this.flatShading===!0&&(n.flatShading=!0),this.visible===!1&&(n.visible=!1),this.toneMapped===!1&&(n.toneMapped=!1),this.fog===!1&&(n.fog=!1),Object.keys(this.userData).length>0&&(n.userData=this.userData);function r(s){const o=[];for(const a in s){const c=s[a];delete c.metadata,o.push(c)}return o}if(t){const s=r(e.textures),o=r(e.images);s.length>0&&(n.textures=s),o.length>0&&(n.images=o)}return n}clone(){return new this.constructor().copy(this)}copy(e){this.name=e.name,this.blending=e.blending,this.side=e.side,this.vertexColors=e.vertexColors,this.opacity=e.opacity,this.transparent=e.transparent,this.blendSrc=e.blendSrc,this.blendDst=e.blendDst,this.blendEquation=e.blendEquation,this.blendSrcAlpha=e.blendSrcAlpha,this.blendDstAlpha=e.blendDstAlpha,this.blendEquationAlpha=e.blendEquationAlpha,this.blendColor.copy(e.blendColor),this.blendAlpha=e.blendAlpha,this.depthFunc=e.depthFunc,this.depthTest=e.depthTest,this.depthWrite=e.depthWrite,this.stencilWriteMask=e.stencilWriteMask,this.stencilFunc=e.stencilFunc,this.stencilRef=e.stencilRef,this.stencilFuncMask=e.stencilFuncMask,this.stencilFail=e.stencilFail,this.stencilZFail=e.stencilZFail,this.stencilZPass=e.stencilZPass,this.stencilWrite=e.stencilWrite;const t=e.clippingPlanes;let n=null;if(t!==null){const r=t.length;n=new Array(r);for(let s=0;s!==r;++s)n[s]=t[s].clone()}return this.clippingPlanes=n,this.clipIntersection=e.clipIntersection,this.clipShadows=e.clipShadows,this.shadowSide=e.shadowSide,this.colorWrite=e.colorWrite,this.precision=e.precision,this.polygonOffset=e.polygonOffset,this.polygonOffsetFactor=e.polygonOffsetFactor,this.polygonOffsetUnits=e.polygonOffsetUnits,this.dithering=e.dithering,this.alphaTest=e.alphaTest,this.alphaHash=e.alphaHash,this.alphaToCoverage=e.alphaToCoverage,this.premultipliedAlpha=e.premultipliedAlpha,this.forceSinglePass=e.forceSinglePass,this.visible=e.visible,this.toneMapped=e.toneMapped,this.userData=JSON.parse(JSON.stringify(e.userData)),this}dispose(){this.dispatchEvent({type:"dispose"})}set needsUpdate(e){e===!0&&this.version++}onBuild(){console.warn("Material: onBuild() has been removed.")}}class Bi extends di{static get type(){return"MeshBasicMaterial"}constructor(e){super(),this.isMeshBasicMaterial=!0,this.color=new st(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new vi,this.combine=rd,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.specularMap=e.specularMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.envMapRotation.copy(e.envMapRotation),this.combine=e.combine,this.reflectivity=e.reflectivity,this.refractionRatio=e.refractionRatio,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.fog=e.fog,this}}const sn=new A,Ao=new ht;class wn{constructor(e,t,n=!1){if(Array.isArray(e))throw new TypeError("THREE.BufferAttribute: array should be a Typed Array.");this.isBufferAttribute=!0,this.name="",this.array=e,this.itemSize=t,this.count=e!==void 0?e.length/t:0,this.normalized=n,this.usage=vl,this.updateRanges=[],this.gpuType=li,this.version=0}onUploadCallback(){}set needsUpdate(e){e===!0&&this.version++}setUsage(e){return this.usage=e,this}addUpdateRange(e,t){this.updateRanges.push({start:e,count:t})}clearUpdateRanges(){this.updateRanges.length=0}copy(e){return this.name=e.name,this.array=new e.array.constructor(e.array),this.itemSize=e.itemSize,this.count=e.count,this.normalized=e.normalized,this.usage=e.usage,this.gpuType=e.gpuType,this}copyAt(e,t,n){e*=this.itemSize,n*=t.itemSize;for(let r=0,s=this.itemSize;r<s;r++)this.array[e+r]=t.array[n+r];return this}copyArray(e){return this.array.set(e),this}applyMatrix3(e){if(this.itemSize===2)for(let t=0,n=this.count;t<n;t++)Ao.fromBufferAttribute(this,t),Ao.applyMatrix3(e),this.setXY(t,Ao.x,Ao.y);else if(this.itemSize===3)for(let t=0,n=this.count;t<n;t++)sn.fromBufferAttribute(this,t),sn.applyMatrix3(e),this.setXYZ(t,sn.x,sn.y,sn.z);return this}applyMatrix4(e){for(let t=0,n=this.count;t<n;t++)sn.fromBufferAttribute(this,t),sn.applyMatrix4(e),this.setXYZ(t,sn.x,sn.y,sn.z);return this}applyNormalMatrix(e){for(let t=0,n=this.count;t<n;t++)sn.fromBufferAttribute(this,t),sn.applyNormalMatrix(e),this.setXYZ(t,sn.x,sn.y,sn.z);return this}transformDirection(e){for(let t=0,n=this.count;t<n;t++)sn.fromBufferAttribute(this,t),sn.transformDirection(e),this.setXYZ(t,sn.x,sn.y,sn.z);return this}set(e,t=0){return this.array.set(e,t),this}getComponent(e,t){let n=this.array[e*this.itemSize+t];return this.normalized&&(n=ci(n,this.array)),n}setComponent(e,t,n){return this.normalized&&(n=Ht(n,this.array)),this.array[e*this.itemSize+t]=n,this}getX(e){let t=this.array[e*this.itemSize];return this.normalized&&(t=ci(t,this.array)),t}setX(e,t){return this.normalized&&(t=Ht(t,this.array)),this.array[e*this.itemSize]=t,this}getY(e){let t=this.array[e*this.itemSize+1];return this.normalized&&(t=ci(t,this.array)),t}setY(e,t){return this.normalized&&(t=Ht(t,this.array)),this.array[e*this.itemSize+1]=t,this}getZ(e){let t=this.array[e*this.itemSize+2];return this.normalized&&(t=ci(t,this.array)),t}setZ(e,t){return this.normalized&&(t=Ht(t,this.array)),this.array[e*this.itemSize+2]=t,this}getW(e){let t=this.array[e*this.itemSize+3];return this.normalized&&(t=ci(t,this.array)),t}setW(e,t){return this.normalized&&(t=Ht(t,this.array)),this.array[e*this.itemSize+3]=t,this}setXY(e,t,n){return e*=this.itemSize,this.normalized&&(t=Ht(t,this.array),n=Ht(n,this.array)),this.array[e+0]=t,this.array[e+1]=n,this}setXYZ(e,t,n,r){return e*=this.itemSize,this.normalized&&(t=Ht(t,this.array),n=Ht(n,this.array),r=Ht(r,this.array)),this.array[e+0]=t,this.array[e+1]=n,this.array[e+2]=r,this}setXYZW(e,t,n,r,s){return e*=this.itemSize,this.normalized&&(t=Ht(t,this.array),n=Ht(n,this.array),r=Ht(r,this.array),s=Ht(s,this.array)),this.array[e+0]=t,this.array[e+1]=n,this.array[e+2]=r,this.array[e+3]=s,this}onUpload(e){return this.onUploadCallback=e,this}clone(){return new this.constructor(this.array,this.itemSize).copy(this)}toJSON(){const e={itemSize:this.itemSize,type:this.array.constructor.name,array:Array.from(this.array),normalized:this.normalized};return this.name!==""&&(e.name=this.name),this.usage!==vl&&(e.usage=this.usage),e}}class wd extends wn{constructor(e,t,n){super(new Uint16Array(e),t,n)}}class Ed extends wn{constructor(e,t,n){super(new Uint32Array(e),t,n)}}class Vi extends wn{constructor(e,t,n){super(new Float32Array(e),t,n)}}let Yp=0;const Yn=new ot,rc=new en,Qr=new A,Wn=new an,Hs=new an,gn=new A;class Mi extends Ur{constructor(){super(),this.isBufferGeometry=!0,Object.defineProperty(this,"id",{value:Yp++}),this.uuid=ui(),this.name="",this.type="BufferGeometry",this.index=null,this.indirect=null,this.attributes={},this.morphAttributes={},this.morphTargetsRelative=!1,this.groups=[],this.boundingBox=null,this.boundingSphere=null,this.drawRange={start:0,count:1/0},this.userData={}}getIndex(){return this.index}setIndex(e){return Array.isArray(e)?this.index=new(vd(e)?Ed:wd)(e,1):this.index=e,this}setIndirect(e){return this.indirect=e,this}getIndirect(){return this.indirect}getAttribute(e){return this.attributes[e]}setAttribute(e,t){return this.attributes[e]=t,this}deleteAttribute(e){return delete this.attributes[e],this}hasAttribute(e){return this.attributes[e]!==void 0}addGroup(e,t,n=0){this.groups.push({start:e,count:t,materialIndex:n})}clearGroups(){this.groups=[]}setDrawRange(e,t){this.drawRange.start=e,this.drawRange.count=t}applyMatrix4(e){const t=this.attributes.position;t!==void 0&&(t.applyMatrix4(e),t.needsUpdate=!0);const n=this.attributes.normal;if(n!==void 0){const s=new yt().getNormalMatrix(e);n.applyNormalMatrix(s),n.needsUpdate=!0}const r=this.attributes.tangent;return r!==void 0&&(r.transformDirection(e),r.needsUpdate=!0),this.boundingBox!==null&&this.computeBoundingBox(),this.boundingSphere!==null&&this.computeBoundingSphere(),this}applyQuaternion(e){return Yn.makeRotationFromQuaternion(e),this.applyMatrix4(Yn),this}rotateX(e){return Yn.makeRotationX(e),this.applyMatrix4(Yn),this}rotateY(e){return Yn.makeRotationY(e),this.applyMatrix4(Yn),this}rotateZ(e){return Yn.makeRotationZ(e),this.applyMatrix4(Yn),this}translate(e,t,n){return Yn.makeTranslation(e,t,n),this.applyMatrix4(Yn),this}scale(e,t,n){return Yn.makeScale(e,t,n),this.applyMatrix4(Yn),this}lookAt(e){return rc.lookAt(e),rc.updateMatrix(),this.applyMatrix4(rc.matrix),this}center(){return this.computeBoundingBox(),this.boundingBox.getCenter(Qr).negate(),this.translate(Qr.x,Qr.y,Qr.z),this}setFromPoints(e){const t=this.getAttribute("position");if(t===void 0){const n=[];for(let r=0,s=e.length;r<s;r++){const o=e[r];n.push(o.x,o.y,o.z||0)}this.setAttribute("position",new Vi(n,3))}else{for(let n=0,r=t.count;n<r;n++){const s=e[n];t.setXYZ(n,s.x,s.y,s.z||0)}e.length>t.count&&console.warn("THREE.BufferGeometry: Buffer size too small for points data. Use .dispose() and create a new geometry."),t.needsUpdate=!0}return this}computeBoundingBox(){this.boundingBox===null&&(this.boundingBox=new an);const e=this.attributes.position,t=this.morphAttributes.position;if(e&&e.isGLBufferAttribute){console.error("THREE.BufferGeometry.computeBoundingBox(): GLBufferAttribute requires a manual bounding box.",this),this.boundingBox.set(new A(-1/0,-1/0,-1/0),new A(1/0,1/0,1/0));return}if(e!==void 0){if(this.boundingBox.setFromBufferAttribute(e),t)for(let n=0,r=t.length;n<r;n++){const s=t[n];Wn.setFromBufferAttribute(s),this.morphTargetsRelative?(gn.addVectors(this.boundingBox.min,Wn.min),this.boundingBox.expandByPoint(gn),gn.addVectors(this.boundingBox.max,Wn.max),this.boundingBox.expandByPoint(gn)):(this.boundingBox.expandByPoint(Wn.min),this.boundingBox.expandByPoint(Wn.max))}}else this.boundingBox.makeEmpty();(isNaN(this.boundingBox.min.x)||isNaN(this.boundingBox.min.y)||isNaN(this.boundingBox.min.z))&&console.error('THREE.BufferGeometry.computeBoundingBox(): Computed min/max have NaN values. The "position" attribute is likely to have NaN values.',this)}computeBoundingSphere(){this.boundingSphere===null&&(this.boundingSphere=new yi);const e=this.attributes.position,t=this.morphAttributes.position;if(e&&e.isGLBufferAttribute){console.error("THREE.BufferGeometry.computeBoundingSphere(): GLBufferAttribute requires a manual bounding sphere.",this),this.boundingSphere.set(new A,1/0);return}if(e){const n=this.boundingSphere.center;if(Wn.setFromBufferAttribute(e),t)for(let s=0,o=t.length;s<o;s++){const a=t[s];Hs.setFromBufferAttribute(a),this.morphTargetsRelative?(gn.addVectors(Wn.min,Hs.min),Wn.expandByPoint(gn),gn.addVectors(Wn.max,Hs.max),Wn.expandByPoint(gn)):(Wn.expandByPoint(Hs.min),Wn.expandByPoint(Hs.max))}Wn.getCenter(n);let r=0;for(let s=0,o=e.count;s<o;s++)gn.fromBufferAttribute(e,s),r=Math.max(r,n.distanceToSquared(gn));if(t)for(let s=0,o=t.length;s<o;s++){const a=t[s],c=this.morphTargetsRelative;for(let l=0,h=a.count;l<h;l++)gn.fromBufferAttribute(a,l),c&&(Qr.fromBufferAttribute(e,l),gn.add(Qr)),r=Math.max(r,n.distanceToSquared(gn))}this.boundingSphere.radius=Math.sqrt(r),isNaN(this.boundingSphere.radius)&&console.error('THREE.BufferGeometry.computeBoundingSphere(): Computed radius is NaN. The "position" attribute is likely to have NaN values.',this)}}computeTangents(){const e=this.index,t=this.attributes;if(e===null||t.position===void 0||t.normal===void 0||t.uv===void 0){console.error("THREE.BufferGeometry: .computeTangents() failed. Missing required attributes (index, position, normal or uv)");return}const n=t.position,r=t.normal,s=t.uv;this.hasAttribute("tangent")===!1&&this.setAttribute("tangent",new wn(new Float32Array(4*n.count),4));const o=this.getAttribute("tangent"),a=[],c=[];for(let F=0;F<n.count;F++)a[F]=new A,c[F]=new A;const l=new A,h=new A,u=new A,d=new ht,p=new ht,g=new ht,b=new A,m=new A;function f(F,S,v){l.fromBufferAttribute(n,F),h.fromBufferAttribute(n,S),u.fromBufferAttribute(n,v),d.fromBufferAttribute(s,F),p.fromBufferAttribute(s,S),g.fromBufferAttribute(s,v),h.sub(l),u.sub(l),p.sub(d),g.sub(d);const P=1/(p.x*g.y-g.x*p.y);isFinite(P)&&(b.copy(h).multiplyScalar(g.y).addScaledVector(u,-p.y).multiplyScalar(P),m.copy(u).multiplyScalar(p.x).addScaledVector(h,-g.x).multiplyScalar(P),a[F].add(b),a[S].add(b),a[v].add(b),c[F].add(m),c[S].add(m),c[v].add(m))}let M=this.groups;M.length===0&&(M=[{start:0,count:e.count}]);for(let F=0,S=M.length;F<S;++F){const v=M[F],P=v.start,Q=v.count;for(let G=P,ae=P+Q;G<ae;G+=3)f(e.getX(G+0),e.getX(G+1),e.getX(G+2))}const x=new A,_=new A,I=new A,R=new A;function T(F){I.fromBufferAttribute(r,F),R.copy(I);const S=a[F];x.copy(S),x.sub(I.multiplyScalar(I.dot(S))).normalize(),_.crossVectors(R,S);const P=_.dot(c[F])<0?-1:1;o.setXYZW(F,x.x,x.y,x.z,P)}for(let F=0,S=M.length;F<S;++F){const v=M[F],P=v.start,Q=v.count;for(let G=P,ae=P+Q;G<ae;G+=3)T(e.getX(G+0)),T(e.getX(G+1)),T(e.getX(G+2))}}computeVertexNormals(){const e=this.index,t=this.getAttribute("position");if(t!==void 0){let n=this.getAttribute("normal");if(n===void 0)n=new wn(new Float32Array(t.count*3),3),this.setAttribute("normal",n);else for(let d=0,p=n.count;d<p;d++)n.setXYZ(d,0,0,0);const r=new A,s=new A,o=new A,a=new A,c=new A,l=new A,h=new A,u=new A;if(e)for(let d=0,p=e.count;d<p;d+=3){const g=e.getX(d+0),b=e.getX(d+1),m=e.getX(d+2);r.fromBufferAttribute(t,g),s.fromBufferAttribute(t,b),o.fromBufferAttribute(t,m),h.subVectors(o,s),u.subVectors(r,s),h.cross(u),a.fromBufferAttribute(n,g),c.fromBufferAttribute(n,b),l.fromBufferAttribute(n,m),a.add(h),c.add(h),l.add(h),n.setXYZ(g,a.x,a.y,a.z),n.setXYZ(b,c.x,c.y,c.z),n.setXYZ(m,l.x,l.y,l.z)}else for(let d=0,p=t.count;d<p;d+=3)r.fromBufferAttribute(t,d+0),s.fromBufferAttribute(t,d+1),o.fromBufferAttribute(t,d+2),h.subVectors(o,s),u.subVectors(r,s),h.cross(u),n.setXYZ(d+0,h.x,h.y,h.z),n.setXYZ(d+1,h.x,h.y,h.z),n.setXYZ(d+2,h.x,h.y,h.z);this.normalizeNormals(),n.needsUpdate=!0}}normalizeNormals(){const e=this.attributes.normal;for(let t=0,n=e.count;t<n;t++)gn.fromBufferAttribute(e,t),gn.normalize(),e.setXYZ(t,gn.x,gn.y,gn.z)}toNonIndexed(){function e(a,c){const l=a.array,h=a.itemSize,u=a.normalized,d=new l.constructor(c.length*h);let p=0,g=0;for(let b=0,m=c.length;b<m;b++){a.isInterleavedBufferAttribute?p=c[b]*a.data.stride+a.offset:p=c[b]*h;for(let f=0;f<h;f++)d[g++]=l[p++]}return new wn(d,h,u)}if(this.index===null)return console.warn("THREE.BufferGeometry.toNonIndexed(): BufferGeometry is already non-indexed."),this;const t=new Mi,n=this.index.array,r=this.attributes;for(const a in r){const c=r[a],l=e(c,n);t.setAttribute(a,l)}const s=this.morphAttributes;for(const a in s){const c=[],l=s[a];for(let h=0,u=l.length;h<u;h++){const d=l[h],p=e(d,n);c.push(p)}t.morphAttributes[a]=c}t.morphTargetsRelative=this.morphTargetsRelative;const o=this.groups;for(let a=0,c=o.length;a<c;a++){const l=o[a];t.addGroup(l.start,l.count,l.materialIndex)}return t}toJSON(){const e={metadata:{version:4.6,type:"BufferGeometry",generator:"BufferGeometry.toJSON"}};if(e.uuid=this.uuid,e.type=this.type,this.name!==""&&(e.name=this.name),Object.keys(this.userData).length>0&&(e.userData=this.userData),this.parameters!==void 0){const c=this.parameters;for(const l in c)c[l]!==void 0&&(e[l]=c[l]);return e}e.data={attributes:{}};const t=this.index;t!==null&&(e.data.index={type:t.array.constructor.name,array:Array.prototype.slice.call(t.array)});const n=this.attributes;for(const c in n){const l=n[c];e.data.attributes[c]=l.toJSON(e.data)}const r={};let s=!1;for(const c in this.morphAttributes){const l=this.morphAttributes[c],h=[];for(let u=0,d=l.length;u<d;u++){const p=l[u];h.push(p.toJSON(e.data))}h.length>0&&(r[c]=h,s=!0)}s&&(e.data.morphAttributes=r,e.data.morphTargetsRelative=this.morphTargetsRelative);const o=this.groups;o.length>0&&(e.data.groups=JSON.parse(JSON.stringify(o)));const a=this.boundingSphere;return a!==null&&(e.data.boundingSphere={center:a.center.toArray(),radius:a.radius}),e}clone(){return new this.constructor().copy(this)}copy(e){this.index=null,this.attributes={},this.morphAttributes={},this.groups=[],this.boundingBox=null,this.boundingSphere=null;const t={};this.name=e.name;const n=e.index;n!==null&&this.setIndex(n.clone(t));const r=e.attributes;for(const l in r){const h=r[l];this.setAttribute(l,h.clone(t))}const s=e.morphAttributes;for(const l in s){const h=[],u=s[l];for(let d=0,p=u.length;d<p;d++)h.push(u[d].clone(t));this.morphAttributes[l]=h}this.morphTargetsRelative=e.morphTargetsRelative;const o=e.groups;for(let l=0,h=o.length;l<h;l++){const u=o[l];this.addGroup(u.start,u.count,u.materialIndex)}const a=e.boundingBox;a!==null&&(this.boundingBox=a.clone());const c=e.boundingSphere;return c!==null&&(this.boundingSphere=c.clone()),this.drawRange.start=e.drawRange.start,this.drawRange.count=e.drawRange.count,this.userData=e.userData,this}dispose(){this.dispatchEvent({type:"dispose"})}}const Oh=new ot,yr=new Rs,To=new yi,kh=new A,Ro=new A,Co=new A,Po=new A,sc=new A,Lo=new A,Bh=new A,Do=new A;class Xt extends en{constructor(e=new Mi,t=new Bi){super(),this.isMesh=!0,this.type="Mesh",this.geometry=e,this.material=t,this.updateMorphTargets()}copy(e,t){return super.copy(e,t),e.morphTargetInfluences!==void 0&&(this.morphTargetInfluences=e.morphTargetInfluences.slice()),e.morphTargetDictionary!==void 0&&(this.morphTargetDictionary=Object.assign({},e.morphTargetDictionary)),this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}updateMorphTargets(){const t=this.geometry.morphAttributes,n=Object.keys(t);if(n.length>0){const r=t[n[0]];if(r!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let s=0,o=r.length;s<o;s++){const a=r[s].name||String(s);this.morphTargetInfluences.push(0),this.morphTargetDictionary[a]=s}}}}getVertexPosition(e,t){const n=this.geometry,r=n.attributes.position,s=n.morphAttributes.position,o=n.morphTargetsRelative;t.fromBufferAttribute(r,e);const a=this.morphTargetInfluences;if(s&&a){Lo.set(0,0,0);for(let c=0,l=s.length;c<l;c++){const h=a[c],u=s[c];h!==0&&(sc.fromBufferAttribute(u,e),o?Lo.addScaledVector(sc,h):Lo.addScaledVector(sc.sub(t),h))}t.add(Lo)}return t}raycast(e,t){const n=this.geometry,r=this.material,s=this.matrixWorld;r!==void 0&&(n.boundingSphere===null&&n.computeBoundingSphere(),To.copy(n.boundingSphere),To.applyMatrix4(s),yr.copy(e.ray).recast(e.near),!(To.containsPoint(yr.origin)===!1&&(yr.intersectSphere(To,kh)===null||yr.origin.distanceToSquared(kh)>(e.far-e.near)**2))&&(Oh.copy(s).invert(),yr.copy(e.ray).applyMatrix4(Oh),!(n.boundingBox!==null&&yr.intersectsBox(n.boundingBox)===!1)&&this._computeIntersections(e,t,yr)))}_computeIntersections(e,t,n){let r;const s=this.geometry,o=this.material,a=s.index,c=s.attributes.position,l=s.attributes.uv,h=s.attributes.uv1,u=s.attributes.normal,d=s.groups,p=s.drawRange;if(a!==null)if(Array.isArray(o))for(let g=0,b=d.length;g<b;g++){const m=d[g],f=o[m.materialIndex],M=Math.max(m.start,p.start),x=Math.min(a.count,Math.min(m.start+m.count,p.start+p.count));for(let _=M,I=x;_<I;_+=3){const R=a.getX(_),T=a.getX(_+1),F=a.getX(_+2);r=Io(this,f,e,n,l,h,u,R,T,F),r&&(r.faceIndex=Math.floor(_/3),r.face.materialIndex=m.materialIndex,t.push(r))}}else{const g=Math.max(0,p.start),b=Math.min(a.count,p.start+p.count);for(let m=g,f=b;m<f;m+=3){const M=a.getX(m),x=a.getX(m+1),_=a.getX(m+2);r=Io(this,o,e,n,l,h,u,M,x,_),r&&(r.faceIndex=Math.floor(m/3),t.push(r))}}else if(c!==void 0)if(Array.isArray(o))for(let g=0,b=d.length;g<b;g++){const m=d[g],f=o[m.materialIndex],M=Math.max(m.start,p.start),x=Math.min(c.count,Math.min(m.start+m.count,p.start+p.count));for(let _=M,I=x;_<I;_+=3){const R=_,T=_+1,F=_+2;r=Io(this,f,e,n,l,h,u,R,T,F),r&&(r.faceIndex=Math.floor(_/3),r.face.materialIndex=m.materialIndex,t.push(r))}}else{const g=Math.max(0,p.start),b=Math.min(c.count,p.start+p.count);for(let m=g,f=b;m<f;m+=3){const M=m,x=m+1,_=m+2;r=Io(this,o,e,n,l,h,u,M,x,_),r&&(r.faceIndex=Math.floor(m/3),t.push(r))}}}}function $p(i,e,t,n,r,s,o,a){let c;if(e.side===Cn?c=n.intersectTriangle(o,s,r,!0,a):c=n.intersectTriangle(r,s,o,e.side===Wi,a),c===null)return null;Do.copy(a),Do.applyMatrix4(i.matrixWorld);const l=t.ray.origin.distanceTo(Do);return l<t.near||l>t.far?null:{distance:l,point:Do.clone(),object:i}}function Io(i,e,t,n,r,s,o,a,c,l){i.getVertexPosition(a,Ro),i.getVertexPosition(c,Co),i.getVertexPosition(l,Po);const h=$p(i,e,t,n,Ro,Co,Po,Bh);if(h){const u=new A;Jn.getBarycoord(Bh,Ro,Co,Po,u),r&&(h.uv=Jn.getInterpolatedAttribute(r,a,c,l,u,new ht)),s&&(h.uv1=Jn.getInterpolatedAttribute(s,a,c,l,u,new ht)),o&&(h.normal=Jn.getInterpolatedAttribute(o,a,c,l,u,new A),h.normal.dot(n.direction)>0&&h.normal.multiplyScalar(-1));const d={a,b:c,c:l,normal:new A,materialIndex:0};Jn.getNormal(Ro,Co,Po,d.normal),h.face=d,h.barycoord=u}return h}class Cs extends Mi{constructor(e=1,t=1,n=1,r=1,s=1,o=1){super(),this.type="BoxGeometry",this.parameters={width:e,height:t,depth:n,widthSegments:r,heightSegments:s,depthSegments:o};const a=this;r=Math.floor(r),s=Math.floor(s),o=Math.floor(o);const c=[],l=[],h=[],u=[];let d=0,p=0;g("z","y","x",-1,-1,n,t,e,o,s,0),g("z","y","x",1,-1,n,t,-e,o,s,1),g("x","z","y",1,1,e,n,t,r,o,2),g("x","z","y",1,-1,e,n,-t,r,o,3),g("x","y","z",1,-1,e,t,n,r,s,4),g("x","y","z",-1,-1,e,t,-n,r,s,5),this.setIndex(c),this.setAttribute("position",new Vi(l,3)),this.setAttribute("normal",new Vi(h,3)),this.setAttribute("uv",new Vi(u,2));function g(b,m,f,M,x,_,I,R,T,F,S){const v=_/T,P=I/F,Q=_/2,G=I/2,ae=R/2,oe=T+1,ne=F+1;let he=0,L=0;const W=new A;for(let q=0;q<ne;q++){const j=q*P-G;for(let ee=0;ee<oe;ee++){const ue=ee*v-Q;W[b]=ue*M,W[m]=j*x,W[f]=ae,l.push(W.x,W.y,W.z),W[b]=0,W[m]=0,W[f]=R>0?1:-1,h.push(W.x,W.y,W.z),u.push(ee/T),u.push(1-q/F),he+=1}}for(let q=0;q<F;q++)for(let j=0;j<T;j++){const ee=d+j+oe*q,ue=d+j+oe*(q+1),X=d+(j+1)+oe*(q+1),re=d+(j+1)+oe*q;c.push(ee,ue,re),c.push(ue,X,re),L+=6}a.addGroup(p,L,S),p+=L,d+=he}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new Cs(e.width,e.height,e.depth,e.widthSegments,e.heightSegments,e.depthSegments)}}function Ss(i){const e={};for(const t in i){e[t]={};for(const n in i[t]){const r=i[t][n];r&&(r.isColor||r.isMatrix3||r.isMatrix4||r.isVector2||r.isVector3||r.isVector4||r.isTexture||r.isQuaternion)?r.isRenderTargetTexture?(console.warn("UniformsUtils: Textures of render targets cannot be cloned via cloneUniforms() or mergeUniforms()."),e[t][n]=null):e[t][n]=r.clone():Array.isArray(r)?e[t][n]=r.slice():e[t][n]=r}}return e}function Tn(i){const e={};for(let t=0;t<i.length;t++){const n=Ss(i[t]);for(const r in n)e[r]=n[r]}return e}function Zp(i){const e=[];for(let t=0;t<i.length;t++)e.push(i[t].clone());return e}function Ad(i){const e=i.getRenderTarget();return e===null?i.outputColorSpace:e.isXRRenderTarget===!0?e.texture.colorSpace:Ct.workingColorSpace}const Jp={clone:Ss,merge:Tn};var em=`void main() {
	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}`,tm=`void main() {
	gl_FragColor = vec4( 1.0, 0.0, 0.0, 1.0 );
}`;class dr extends di{static get type(){return"ShaderMaterial"}constructor(e){super(),this.isShaderMaterial=!0,this.defines={},this.uniforms={},this.uniformsGroups=[],this.vertexShader=em,this.fragmentShader=tm,this.linewidth=1,this.wireframe=!1,this.wireframeLinewidth=1,this.fog=!1,this.lights=!1,this.clipping=!1,this.forceSinglePass=!0,this.extensions={clipCullDistance:!1,multiDraw:!1},this.defaultAttributeValues={color:[1,1,1],uv:[0,0],uv1:[0,0]},this.index0AttributeName=void 0,this.uniformsNeedUpdate=!1,this.glslVersion=null,e!==void 0&&this.setValues(e)}copy(e){return super.copy(e),this.fragmentShader=e.fragmentShader,this.vertexShader=e.vertexShader,this.uniforms=Ss(e.uniforms),this.uniformsGroups=Zp(e.uniformsGroups),this.defines=Object.assign({},e.defines),this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.fog=e.fog,this.lights=e.lights,this.clipping=e.clipping,this.extensions=Object.assign({},e.extensions),this.glslVersion=e.glslVersion,this}toJSON(e){const t=super.toJSON(e);t.glslVersion=this.glslVersion,t.uniforms={};for(const r in this.uniforms){const o=this.uniforms[r].value;o&&o.isTexture?t.uniforms[r]={type:"t",value:o.toJSON(e).uuid}:o&&o.isColor?t.uniforms[r]={type:"c",value:o.getHex()}:o&&o.isVector2?t.uniforms[r]={type:"v2",value:o.toArray()}:o&&o.isVector3?t.uniforms[r]={type:"v3",value:o.toArray()}:o&&o.isVector4?t.uniforms[r]={type:"v4",value:o.toArray()}:o&&o.isMatrix3?t.uniforms[r]={type:"m3",value:o.toArray()}:o&&o.isMatrix4?t.uniforms[r]={type:"m4",value:o.toArray()}:t.uniforms[r]={value:o}}Object.keys(this.defines).length>0&&(t.defines=this.defines),t.vertexShader=this.vertexShader,t.fragmentShader=this.fragmentShader,t.lights=this.lights,t.clipping=this.clipping;const n={};for(const r in this.extensions)this.extensions[r]===!0&&(n[r]=!0);return Object.keys(n).length>0&&(t.extensions=n),t}}class Td extends en{constructor(){super(),this.isCamera=!0,this.type="Camera",this.matrixWorldInverse=new ot,this.projectionMatrix=new ot,this.projectionMatrixInverse=new ot,this.coordinateSystem=ki}copy(e,t){return super.copy(e,t),this.matrixWorldInverse.copy(e.matrixWorldInverse),this.projectionMatrix.copy(e.projectionMatrix),this.projectionMatrixInverse.copy(e.projectionMatrixInverse),this.coordinateSystem=e.coordinateSystem,this}getWorldDirection(e){return super.getWorldDirection(e).negate()}updateMatrixWorld(e){super.updateMatrixWorld(e),this.matrixWorldInverse.copy(this.matrixWorld).invert()}updateWorldMatrix(e,t){super.updateWorldMatrix(e,t),this.matrixWorldInverse.copy(this.matrixWorld).invert()}clone(){return new this.constructor().copy(this)}}const Ji=new A,zh=new ht,Hh=new ht;class vn extends Td{constructor(e=50,t=1,n=.1,r=2e3){super(),this.isPerspectiveCamera=!0,this.type="PerspectiveCamera",this.fov=e,this.zoom=1,this.near=n,this.far=r,this.focus=10,this.aspect=t,this.view=null,this.filmGauge=35,this.filmOffset=0,this.updateProjectionMatrix()}copy(e,t){return super.copy(e,t),this.fov=e.fov,this.zoom=e.zoom,this.near=e.near,this.far=e.far,this.focus=e.focus,this.aspect=e.aspect,this.view=e.view===null?null:Object.assign({},e.view),this.filmGauge=e.filmGauge,this.filmOffset=e.filmOffset,this}setFocalLength(e){const t=.5*this.getFilmHeight()/e;this.fov=Ms*2*Math.atan(t),this.updateProjectionMatrix()}getFocalLength(){const e=Math.tan(Zs*.5*this.fov);return .5*this.getFilmHeight()/e}getEffectiveFOV(){return Ms*2*Math.atan(Math.tan(Zs*.5*this.fov)/this.zoom)}getFilmWidth(){return this.filmGauge*Math.min(this.aspect,1)}getFilmHeight(){return this.filmGauge/Math.max(this.aspect,1)}getViewBounds(e,t,n){Ji.set(-1,-1,.5).applyMatrix4(this.projectionMatrixInverse),t.set(Ji.x,Ji.y).multiplyScalar(-e/Ji.z),Ji.set(1,1,.5).applyMatrix4(this.projectionMatrixInverse),n.set(Ji.x,Ji.y).multiplyScalar(-e/Ji.z)}getViewSize(e,t){return this.getViewBounds(e,zh,Hh),t.subVectors(Hh,zh)}setViewOffset(e,t,n,r,s,o){this.aspect=e/t,this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=e,this.view.fullHeight=t,this.view.offsetX=n,this.view.offsetY=r,this.view.width=s,this.view.height=o,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const e=this.near;let t=e*Math.tan(Zs*.5*this.fov)/this.zoom,n=2*t,r=this.aspect*n,s=-.5*r;const o=this.view;if(this.view!==null&&this.view.enabled){const c=o.fullWidth,l=o.fullHeight;s+=o.offsetX*r/c,t-=o.offsetY*n/l,r*=o.width/c,n*=o.height/l}const a=this.filmOffset;a!==0&&(s+=e*a/this.getFilmWidth()),this.projectionMatrix.makePerspective(s,s+r,t,t-n,e,this.far,this.coordinateSystem),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(e){const t=super.toJSON(e);return t.object.fov=this.fov,t.object.zoom=this.zoom,t.object.near=this.near,t.object.far=this.far,t.object.focus=this.focus,t.object.aspect=this.aspect,this.view!==null&&(t.object.view=Object.assign({},this.view)),t.object.filmGauge=this.filmGauge,t.object.filmOffset=this.filmOffset,t}}const Kr=-90,Yr=1;class nm extends en{constructor(e,t,n){super(),this.type="CubeCamera",this.renderTarget=n,this.coordinateSystem=null,this.activeMipmapLevel=0;const r=new vn(Kr,Yr,e,t);r.layers=this.layers,this.add(r);const s=new vn(Kr,Yr,e,t);s.layers=this.layers,this.add(s);const o=new vn(Kr,Yr,e,t);o.layers=this.layers,this.add(o);const a=new vn(Kr,Yr,e,t);a.layers=this.layers,this.add(a);const c=new vn(Kr,Yr,e,t);c.layers=this.layers,this.add(c);const l=new vn(Kr,Yr,e,t);l.layers=this.layers,this.add(l)}updateCoordinateSystem(){const e=this.coordinateSystem,t=this.children.concat(),[n,r,s,o,a,c]=t;for(const l of t)this.remove(l);if(e===ki)n.up.set(0,1,0),n.lookAt(1,0,0),r.up.set(0,1,0),r.lookAt(-1,0,0),s.up.set(0,0,-1),s.lookAt(0,1,0),o.up.set(0,0,1),o.lookAt(0,-1,0),a.up.set(0,1,0),a.lookAt(0,0,1),c.up.set(0,1,0),c.lookAt(0,0,-1);else if(e===ga)n.up.set(0,-1,0),n.lookAt(-1,0,0),r.up.set(0,-1,0),r.lookAt(1,0,0),s.up.set(0,0,1),s.lookAt(0,1,0),o.up.set(0,0,-1),o.lookAt(0,-1,0),a.up.set(0,-1,0),a.lookAt(0,0,1),c.up.set(0,-1,0),c.lookAt(0,0,-1);else throw new Error("THREE.CubeCamera.updateCoordinateSystem(): Invalid coordinate system: "+e);for(const l of t)this.add(l),l.updateMatrixWorld()}update(e,t){this.parent===null&&this.updateMatrixWorld();const{renderTarget:n,activeMipmapLevel:r}=this;this.coordinateSystem!==e.coordinateSystem&&(this.coordinateSystem=e.coordinateSystem,this.updateCoordinateSystem());const[s,o,a,c,l,h]=this.children,u=e.getRenderTarget(),d=e.getActiveCubeFace(),p=e.getActiveMipmapLevel(),g=e.xr.enabled;e.xr.enabled=!1;const b=n.texture.generateMipmaps;n.texture.generateMipmaps=!1,e.setRenderTarget(n,0,r),e.render(t,s),e.setRenderTarget(n,1,r),e.render(t,o),e.setRenderTarget(n,2,r),e.render(t,a),e.setRenderTarget(n,3,r),e.render(t,c),e.setRenderTarget(n,4,r),e.render(t,l),n.texture.generateMipmaps=b,e.setRenderTarget(n,5,r),e.render(t,h),e.setRenderTarget(u,d,p),e.xr.enabled=g,n.texture.needsPMREMUpdate=!0}}class Rd extends hn{constructor(e,t,n,r,s,o,a,c,l,h){e=e!==void 0?e:[],t=t!==void 0?t:bs,super(e,t,n,r,s,o,a,c,l,h),this.isCubeTexture=!0,this.flipY=!1}get images(){return this.image}set images(e){this.image=e}}class im extends ur{constructor(e=1,t={}){super(e,e,t),this.isWebGLCubeRenderTarget=!0;const n={width:e,height:e,depth:1},r=[n,n,n,n,n,n];this.texture=new Rd(r,t.mapping,t.wrapS,t.wrapT,t.magFilter,t.minFilter,t.format,t.type,t.anisotropy,t.colorSpace),this.texture.isRenderTargetTexture=!0,this.texture.generateMipmaps=t.generateMipmaps!==void 0?t.generateMipmaps:!1,this.texture.minFilter=t.minFilter!==void 0?t.minFilter:jn}fromEquirectangularTexture(e,t){this.texture.type=t.type,this.texture.colorSpace=t.colorSpace,this.texture.generateMipmaps=t.generateMipmaps,this.texture.minFilter=t.minFilter,this.texture.magFilter=t.magFilter;const n={uniforms:{tEquirect:{value:null}},vertexShader:`

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
			`},r=new Cs(5,5,5),s=new dr({name:"CubemapFromEquirect",uniforms:Ss(n.uniforms),vertexShader:n.vertexShader,fragmentShader:n.fragmentShader,side:Cn,blending:cr});s.uniforms.tEquirect.value=t;const o=new Xt(r,s),a=t.minFilter;return t.minFilter===Oi&&(t.minFilter=jn),new nm(1,10,this).update(e,o),t.minFilter=a,o.geometry.dispose(),o.material.dispose(),this}clear(e,t,n,r){const s=e.getRenderTarget();for(let o=0;o<6;o++)e.setRenderTarget(this,o),e.clear(t,n,r);e.setRenderTarget(s)}}const oc=new A,rm=new A,sm=new yt;class ir{constructor(e=new A(1,0,0),t=0){this.isPlane=!0,this.normal=e,this.constant=t}set(e,t){return this.normal.copy(e),this.constant=t,this}setComponents(e,t,n,r){return this.normal.set(e,t,n),this.constant=r,this}setFromNormalAndCoplanarPoint(e,t){return this.normal.copy(e),this.constant=-t.dot(this.normal),this}setFromCoplanarPoints(e,t,n){const r=oc.subVectors(n,t).cross(rm.subVectors(e,t)).normalize();return this.setFromNormalAndCoplanarPoint(r,e),this}copy(e){return this.normal.copy(e.normal),this.constant=e.constant,this}normalize(){const e=1/this.normal.length();return this.normal.multiplyScalar(e),this.constant*=e,this}negate(){return this.constant*=-1,this.normal.negate(),this}distanceToPoint(e){return this.normal.dot(e)+this.constant}distanceToSphere(e){return this.distanceToPoint(e.center)-e.radius}projectPoint(e,t){return t.copy(e).addScaledVector(this.normal,-this.distanceToPoint(e))}intersectLine(e,t){const n=e.delta(oc),r=this.normal.dot(n);if(r===0)return this.distanceToPoint(e.start)===0?t.copy(e.start):null;const s=-(e.start.dot(this.normal)+this.constant)/r;return s<0||s>1?null:t.copy(e.start).addScaledVector(n,s)}intersectsLine(e){const t=this.distanceToPoint(e.start),n=this.distanceToPoint(e.end);return t<0&&n>0||n<0&&t>0}intersectsBox(e){return e.intersectsPlane(this)}intersectsSphere(e){return e.intersectsPlane(this)}coplanarPoint(e){return e.copy(this.normal).multiplyScalar(-this.constant)}applyMatrix4(e,t){const n=t||sm.getNormalMatrix(e),r=this.coplanarPoint(oc).applyMatrix4(e),s=this.normal.applyMatrix3(n).normalize();return this.constant=-r.dot(s),this}translate(e){return this.constant-=e.dot(this.normal),this}equals(e){return e.normal.equals(this.normal)&&e.constant===this.constant}clone(){return new this.constructor().copy(this)}}const Mr=new yi,No=new A;class Xl{constructor(e=new ir,t=new ir,n=new ir,r=new ir,s=new ir,o=new ir){this.planes=[e,t,n,r,s,o]}set(e,t,n,r,s,o){const a=this.planes;return a[0].copy(e),a[1].copy(t),a[2].copy(n),a[3].copy(r),a[4].copy(s),a[5].copy(o),this}copy(e){const t=this.planes;for(let n=0;n<6;n++)t[n].copy(e.planes[n]);return this}setFromProjectionMatrix(e,t=ki){const n=this.planes,r=e.elements,s=r[0],o=r[1],a=r[2],c=r[3],l=r[4],h=r[5],u=r[6],d=r[7],p=r[8],g=r[9],b=r[10],m=r[11],f=r[12],M=r[13],x=r[14],_=r[15];if(n[0].setComponents(c-s,d-l,m-p,_-f).normalize(),n[1].setComponents(c+s,d+l,m+p,_+f).normalize(),n[2].setComponents(c+o,d+h,m+g,_+M).normalize(),n[3].setComponents(c-o,d-h,m-g,_-M).normalize(),n[4].setComponents(c-a,d-u,m-b,_-x).normalize(),t===ki)n[5].setComponents(c+a,d+u,m+b,_+x).normalize();else if(t===ga)n[5].setComponents(a,u,b,x).normalize();else throw new Error("THREE.Frustum.setFromProjectionMatrix(): Invalid coordinate system: "+t);return this}intersectsObject(e){if(e.boundingSphere!==void 0)e.boundingSphere===null&&e.computeBoundingSphere(),Mr.copy(e.boundingSphere).applyMatrix4(e.matrixWorld);else{const t=e.geometry;t.boundingSphere===null&&t.computeBoundingSphere(),Mr.copy(t.boundingSphere).applyMatrix4(e.matrixWorld)}return this.intersectsSphere(Mr)}intersectsSprite(e){return Mr.center.set(0,0,0),Mr.radius=.7071067811865476,Mr.applyMatrix4(e.matrixWorld),this.intersectsSphere(Mr)}intersectsSphere(e){const t=this.planes,n=e.center,r=-e.radius;for(let s=0;s<6;s++)if(t[s].distanceToPoint(n)<r)return!1;return!0}intersectsBox(e){const t=this.planes;for(let n=0;n<6;n++){const r=t[n];if(No.x=r.normal.x>0?e.max.x:e.min.x,No.y=r.normal.y>0?e.max.y:e.min.y,No.z=r.normal.z>0?e.max.z:e.min.z,r.distanceToPoint(No)<0)return!1}return!0}containsPoint(e){const t=this.planes;for(let n=0;n<6;n++)if(t[n].distanceToPoint(e)<0)return!1;return!0}clone(){return new this.constructor().copy(this)}}function Cd(){let i=null,e=!1,t=null,n=null;function r(s,o){t(s,o),n=i.requestAnimationFrame(r)}return{start:function(){e!==!0&&t!==null&&(n=i.requestAnimationFrame(r),e=!0)},stop:function(){i.cancelAnimationFrame(n),e=!1},setAnimationLoop:function(s){t=s},setContext:function(s){i=s}}}function om(i){const e=new WeakMap;function t(a,c){const l=a.array,h=a.usage,u=l.byteLength,d=i.createBuffer();i.bindBuffer(c,d),i.bufferData(c,l,h),a.onUploadCallback();let p;if(l instanceof Float32Array)p=i.FLOAT;else if(l instanceof Uint16Array)a.isFloat16BufferAttribute?p=i.HALF_FLOAT:p=i.UNSIGNED_SHORT;else if(l instanceof Int16Array)p=i.SHORT;else if(l instanceof Uint32Array)p=i.UNSIGNED_INT;else if(l instanceof Int32Array)p=i.INT;else if(l instanceof Int8Array)p=i.BYTE;else if(l instanceof Uint8Array)p=i.UNSIGNED_BYTE;else if(l instanceof Uint8ClampedArray)p=i.UNSIGNED_BYTE;else throw new Error("THREE.WebGLAttributes: Unsupported buffer data format: "+l);return{buffer:d,type:p,bytesPerElement:l.BYTES_PER_ELEMENT,version:a.version,size:u}}function n(a,c,l){const h=c.array,u=c.updateRanges;if(i.bindBuffer(l,a),u.length===0)i.bufferSubData(l,0,h);else{u.sort((p,g)=>p.start-g.start);let d=0;for(let p=1;p<u.length;p++){const g=u[d],b=u[p];b.start<=g.start+g.count+1?g.count=Math.max(g.count,b.start+b.count-g.start):(++d,u[d]=b)}u.length=d+1;for(let p=0,g=u.length;p<g;p++){const b=u[p];i.bufferSubData(l,b.start*h.BYTES_PER_ELEMENT,h,b.start,b.count)}c.clearUpdateRanges()}c.onUploadCallback()}function r(a){return a.isInterleavedBufferAttribute&&(a=a.data),e.get(a)}function s(a){a.isInterleavedBufferAttribute&&(a=a.data);const c=e.get(a);c&&(i.deleteBuffer(c.buffer),e.delete(a))}function o(a,c){if(a.isInterleavedBufferAttribute&&(a=a.data),a.isGLBufferAttribute){const h=e.get(a);(!h||h.version<a.version)&&e.set(a,{buffer:a.buffer,type:a.type,bytesPerElement:a.elementSize,version:a.version});return}const l=e.get(a);if(l===void 0)e.set(a,t(a,c));else if(l.version<a.version){if(l.size!==a.array.byteLength)throw new Error("THREE.WebGLAttributes: The size of the buffer attribute's array buffer does not match the original size. Resizing buffer attributes is not supported.");n(l.buffer,a,c),l.version=a.version}}return{get:r,remove:s,update:o}}class Ps extends Mi{constructor(e=1,t=1,n=1,r=1){super(),this.type="PlaneGeometry",this.parameters={width:e,height:t,widthSegments:n,heightSegments:r};const s=e/2,o=t/2,a=Math.floor(n),c=Math.floor(r),l=a+1,h=c+1,u=e/a,d=t/c,p=[],g=[],b=[],m=[];for(let f=0;f<h;f++){const M=f*d-o;for(let x=0;x<l;x++){const _=x*u-s;g.push(_,-M,0),b.push(0,0,1),m.push(x/a),m.push(1-f/c)}}for(let f=0;f<c;f++)for(let M=0;M<a;M++){const x=M+l*f,_=M+l*(f+1),I=M+1+l*(f+1),R=M+1+l*f;p.push(x,_,R),p.push(_,I,R)}this.setIndex(p),this.setAttribute("position",new Vi(g,3)),this.setAttribute("normal",new Vi(b,3)),this.setAttribute("uv",new Vi(m,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new Ps(e.width,e.height,e.widthSegments,e.heightSegments)}}var am=`#ifdef USE_ALPHAHASH
	if ( diffuseColor.a < getAlphaHashThreshold( vPosition ) ) discard;
#endif`,cm=`#ifdef USE_ALPHAHASH
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
#endif`,lm=`#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, vAlphaMapUv ).g;
#endif`,hm=`#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,um=`#ifdef USE_ALPHATEST
	#ifdef ALPHA_TO_COVERAGE
	diffuseColor.a = smoothstep( alphaTest, alphaTest + fwidth( diffuseColor.a ), diffuseColor.a );
	if ( diffuseColor.a == 0.0 ) discard;
	#else
	if ( diffuseColor.a < alphaTest ) discard;
	#endif
#endif`,dm=`#ifdef USE_ALPHATEST
	uniform float alphaTest;
#endif`,fm=`#ifdef USE_AOMAP
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
#endif`,pm=`#ifdef USE_AOMAP
	uniform sampler2D aoMap;
	uniform float aoMapIntensity;
#endif`,mm=`#ifdef USE_BATCHING
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
#endif`,gm=`#ifdef USE_BATCHING
	mat4 batchingMatrix = getBatchingMatrix( getIndirectIndex( gl_DrawID ) );
#endif`,bm=`vec3 transformed = vec3( position );
#ifdef USE_ALPHAHASH
	vPosition = vec3( position );
#endif`,_m=`vec3 objectNormal = vec3( normal );
#ifdef USE_TANGENT
	vec3 objectTangent = vec3( tangent.xyz );
#endif`,xm=`float G_BlinnPhong_Implicit( ) {
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
} // validated`,vm=`#ifdef USE_IRIDESCENCE
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
#endif`,ym=`#ifdef USE_BUMPMAP
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
#endif`,Mm=`#if NUM_CLIPPING_PLANES > 0
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
#endif`,Sm=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
	uniform vec4 clippingPlanes[ NUM_CLIPPING_PLANES ];
#endif`,wm=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
#endif`,Em=`#if NUM_CLIPPING_PLANES > 0
	vClipPosition = - mvPosition.xyz;
#endif`,Am=`#if defined( USE_COLOR_ALPHA )
	diffuseColor *= vColor;
#elif defined( USE_COLOR )
	diffuseColor.rgb *= vColor;
#endif`,Tm=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR )
	varying vec3 vColor;
#endif`,Rm=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	varying vec3 vColor;
#endif`,Cm=`#if defined( USE_COLOR_ALPHA )
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
#endif`,Pm=`#define PI 3.141592653589793
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
} // validated`,Lm=`#ifdef ENVMAP_TYPE_CUBE_UV
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
#endif`,Dm=`vec3 transformedNormal = objectNormal;
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
#endif`,Im=`#ifdef USE_DISPLACEMENTMAP
	uniform sampler2D displacementMap;
	uniform float displacementScale;
	uniform float displacementBias;
#endif`,Nm=`#ifdef USE_DISPLACEMENTMAP
	transformed += normalize( objectNormal ) * ( texture2D( displacementMap, vDisplacementMapUv ).x * displacementScale + displacementBias );
#endif`,Fm=`#ifdef USE_EMISSIVEMAP
	vec4 emissiveColor = texture2D( emissiveMap, vEmissiveMapUv );
	#ifdef DECODE_VIDEO_TEXTURE_EMISSIVE
		emissiveColor = sRGBTransferEOTF( emissiveColor );
	#endif
	totalEmissiveRadiance *= emissiveColor.rgb;
#endif`,Um=`#ifdef USE_EMISSIVEMAP
	uniform sampler2D emissiveMap;
#endif`,Om="gl_FragColor = linearToOutputTexel( gl_FragColor );",km=`vec4 LinearTransferOETF( in vec4 value ) {
	return value;
}
vec4 sRGBTransferEOTF( in vec4 value ) {
	return vec4( mix( pow( value.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), value.rgb * 0.0773993808, vec3( lessThanEqual( value.rgb, vec3( 0.04045 ) ) ) ), value.a );
}
vec4 sRGBTransferOETF( in vec4 value ) {
	return vec4( mix( pow( value.rgb, vec3( 0.41666 ) ) * 1.055 - vec3( 0.055 ), value.rgb * 12.92, vec3( lessThanEqual( value.rgb, vec3( 0.0031308 ) ) ) ), value.a );
}`,Bm=`#ifdef USE_ENVMAP
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
#endif`,zm=`#ifdef USE_ENVMAP
	uniform float envMapIntensity;
	uniform float flipEnvMap;
	uniform mat3 envMapRotation;
	#ifdef ENVMAP_TYPE_CUBE
		uniform samplerCube envMap;
	#else
		uniform sampler2D envMap;
	#endif
	
#endif`,Hm=`#ifdef USE_ENVMAP
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
#endif`,Vm=`#ifdef USE_ENVMAP
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		
		varying vec3 vWorldPosition;
	#else
		varying vec3 vReflect;
		uniform float refractionRatio;
	#endif
#endif`,Gm=`#ifdef USE_ENVMAP
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
#endif`,Wm=`#ifdef USE_FOG
	vFogDepth = - mvPosition.z;
#endif`,qm=`#ifdef USE_FOG
	varying float vFogDepth;
#endif`,jm=`#ifdef USE_FOG
	#ifdef FOG_EXP2
		float fogFactor = 1.0 - exp( - fogDensity * fogDensity * vFogDepth * vFogDepth );
	#else
		float fogFactor = smoothstep( fogNear, fogFar, vFogDepth );
	#endif
	gl_FragColor.rgb = mix( gl_FragColor.rgb, fogColor, fogFactor );
#endif`,Xm=`#ifdef USE_FOG
	uniform vec3 fogColor;
	varying float vFogDepth;
	#ifdef FOG_EXP2
		uniform float fogDensity;
	#else
		uniform float fogNear;
		uniform float fogFar;
	#endif
#endif`,Qm=`#ifdef USE_GRADIENTMAP
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
}`,Km=`#ifdef USE_LIGHTMAP
	uniform sampler2D lightMap;
	uniform float lightMapIntensity;
#endif`,Ym=`LambertMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularStrength = specularStrength;`,$m=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Lambert`,Zm=`uniform bool receiveShadow;
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
#endif`,Jm=`#ifdef USE_ENVMAP
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
#endif`,eg=`ToonMaterial material;
material.diffuseColor = diffuseColor.rgb;`,tg=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Toon`,ng=`BlinnPhongMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularColor = specular;
material.specularShininess = shininess;
material.specularStrength = specularStrength;`,ig=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_BlinnPhong`,rg=`PhysicalMaterial material;
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
#endif`,sg=`struct PhysicalMaterial {
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
}`,og=`
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
#endif`,ag=`#if defined( RE_IndirectDiffuse )
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
#endif`,cg=`#if defined( RE_IndirectDiffuse )
	RE_IndirectDiffuse( irradiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif
#if defined( RE_IndirectSpecular )
	RE_IndirectSpecular( radiance, iblIrradiance, clearcoatRadiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif`,lg=`#if defined( USE_LOGDEPTHBUF )
	gl_FragDepth = vIsPerspective == 0.0 ? gl_FragCoord.z : log2( vFragDepth ) * logDepthBufFC * 0.5;
#endif`,hg=`#if defined( USE_LOGDEPTHBUF )
	uniform float logDepthBufFC;
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,ug=`#ifdef USE_LOGDEPTHBUF
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,dg=`#ifdef USE_LOGDEPTHBUF
	vFragDepth = 1.0 + gl_Position.w;
	vIsPerspective = float( isPerspectiveMatrix( projectionMatrix ) );
#endif`,fg=`#ifdef USE_MAP
	vec4 sampledDiffuseColor = texture2D( map, vMapUv );
	#ifdef DECODE_VIDEO_TEXTURE
		sampledDiffuseColor = sRGBTransferEOTF( sampledDiffuseColor );
	#endif
	diffuseColor *= sampledDiffuseColor;
#endif`,pg=`#ifdef USE_MAP
	uniform sampler2D map;
#endif`,mg=`#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
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
#endif`,gg=`#if defined( USE_POINTS_UV )
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
#endif`,bg=`float metalnessFactor = metalness;
#ifdef USE_METALNESSMAP
	vec4 texelMetalness = texture2D( metalnessMap, vMetalnessMapUv );
	metalnessFactor *= texelMetalness.b;
#endif`,_g=`#ifdef USE_METALNESSMAP
	uniform sampler2D metalnessMap;
#endif`,xg=`#ifdef USE_INSTANCING_MORPH
	float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	float morphTargetBaseInfluence = texelFetch( morphTexture, ivec2( 0, gl_InstanceID ), 0 ).r;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		morphTargetInfluences[i] =  texelFetch( morphTexture, ivec2( i + 1, gl_InstanceID ), 0 ).r;
	}
#endif`,vg=`#if defined( USE_MORPHCOLORS )
	vColor *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		#if defined( USE_COLOR_ALPHA )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ) * morphTargetInfluences[ i ];
		#elif defined( USE_COLOR )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ).rgb * morphTargetInfluences[ i ];
		#endif
	}
#endif`,yg=`#ifdef USE_MORPHNORMALS
	objectNormal *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) objectNormal += getMorph( gl_VertexID, i, 1 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,Mg=`#ifdef USE_MORPHTARGETS
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
#endif`,Sg=`#ifdef USE_MORPHTARGETS
	transformed *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) transformed += getMorph( gl_VertexID, i, 0 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,wg=`float faceDirection = gl_FrontFacing ? 1.0 : - 1.0;
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
vec3 nonPerturbedNormal = normal;`,Eg=`#ifdef USE_NORMALMAP_OBJECTSPACE
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
#endif`,Ag=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,Tg=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,Rg=`#ifndef FLAT_SHADED
	vNormal = normalize( transformedNormal );
	#ifdef USE_TANGENT
		vTangent = normalize( transformedTangent );
		vBitangent = normalize( cross( vNormal, vTangent ) * tangent.w );
	#endif
#endif`,Cg=`#ifdef USE_NORMALMAP
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
#endif`,Pg=`#ifdef USE_CLEARCOAT
	vec3 clearcoatNormal = nonPerturbedNormal;
#endif`,Lg=`#ifdef USE_CLEARCOAT_NORMALMAP
	vec3 clearcoatMapN = texture2D( clearcoatNormalMap, vClearcoatNormalMapUv ).xyz * 2.0 - 1.0;
	clearcoatMapN.xy *= clearcoatNormalScale;
	clearcoatNormal = normalize( tbn2 * clearcoatMapN );
#endif`,Dg=`#ifdef USE_CLEARCOATMAP
	uniform sampler2D clearcoatMap;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform sampler2D clearcoatNormalMap;
	uniform vec2 clearcoatNormalScale;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform sampler2D clearcoatRoughnessMap;
#endif`,Ig=`#ifdef USE_IRIDESCENCEMAP
	uniform sampler2D iridescenceMap;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform sampler2D iridescenceThicknessMap;
#endif`,Ng=`#ifdef OPAQUE
diffuseColor.a = 1.0;
#endif
#ifdef USE_TRANSMISSION
diffuseColor.a *= material.transmissionAlpha;
#endif
gl_FragColor = vec4( outgoingLight, diffuseColor.a );`,Fg=`vec3 packNormalToRGB( const in vec3 normal ) {
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
}`,Ug=`#ifdef PREMULTIPLIED_ALPHA
	gl_FragColor.rgb *= gl_FragColor.a;
#endif`,Og=`vec4 mvPosition = vec4( transformed, 1.0 );
#ifdef USE_BATCHING
	mvPosition = batchingMatrix * mvPosition;
#endif
#ifdef USE_INSTANCING
	mvPosition = instanceMatrix * mvPosition;
#endif
mvPosition = modelViewMatrix * mvPosition;
gl_Position = projectionMatrix * mvPosition;`,kg=`#ifdef DITHERING
	gl_FragColor.rgb = dithering( gl_FragColor.rgb );
#endif`,Bg=`#ifdef DITHERING
	vec3 dithering( vec3 color ) {
		float grid_position = rand( gl_FragCoord.xy );
		vec3 dither_shift_RGB = vec3( 0.25 / 255.0, -0.25 / 255.0, 0.25 / 255.0 );
		dither_shift_RGB = mix( 2.0 * dither_shift_RGB, -2.0 * dither_shift_RGB, grid_position );
		return color + dither_shift_RGB;
	}
#endif`,zg=`float roughnessFactor = roughness;
#ifdef USE_ROUGHNESSMAP
	vec4 texelRoughness = texture2D( roughnessMap, vRoughnessMapUv );
	roughnessFactor *= texelRoughness.g;
#endif`,Hg=`#ifdef USE_ROUGHNESSMAP
	uniform sampler2D roughnessMap;
#endif`,Vg=`#if NUM_SPOT_LIGHT_COORDS > 0
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
#endif`,Gg=`#if NUM_SPOT_LIGHT_COORDS > 0
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
#endif`,Wg=`#if ( defined( USE_SHADOWMAP ) && ( NUM_DIR_LIGHT_SHADOWS > 0 || NUM_POINT_LIGHT_SHADOWS > 0 ) ) || ( NUM_SPOT_LIGHT_COORDS > 0 )
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
#endif`,qg=`float getShadowMask() {
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
}`,jg=`#ifdef USE_SKINNING
	mat4 boneMatX = getBoneMatrix( skinIndex.x );
	mat4 boneMatY = getBoneMatrix( skinIndex.y );
	mat4 boneMatZ = getBoneMatrix( skinIndex.z );
	mat4 boneMatW = getBoneMatrix( skinIndex.w );
#endif`,Xg=`#ifdef USE_SKINNING
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
#endif`,Qg=`#ifdef USE_SKINNING
	vec4 skinVertex = bindMatrix * vec4( transformed, 1.0 );
	vec4 skinned = vec4( 0.0 );
	skinned += boneMatX * skinVertex * skinWeight.x;
	skinned += boneMatY * skinVertex * skinWeight.y;
	skinned += boneMatZ * skinVertex * skinWeight.z;
	skinned += boneMatW * skinVertex * skinWeight.w;
	transformed = ( bindMatrixInverse * skinned ).xyz;
#endif`,Kg=`#ifdef USE_SKINNING
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
#endif`,Yg=`float specularStrength;
#ifdef USE_SPECULARMAP
	vec4 texelSpecular = texture2D( specularMap, vSpecularMapUv );
	specularStrength = texelSpecular.r;
#else
	specularStrength = 1.0;
#endif`,$g=`#ifdef USE_SPECULARMAP
	uniform sampler2D specularMap;
#endif`,Zg=`#if defined( TONE_MAPPING )
	gl_FragColor.rgb = toneMapping( gl_FragColor.rgb );
#endif`,Jg=`#ifndef saturate
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
vec3 CustomToneMapping( vec3 color ) { return color; }`,e0=`#ifdef USE_TRANSMISSION
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
#endif`,t0=`#ifdef USE_TRANSMISSION
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
#endif`,n0=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,i0=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,r0=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,s0=`#if defined( USE_ENVMAP ) || defined( DISTANCE ) || defined ( USE_SHADOWMAP ) || defined ( USE_TRANSMISSION ) || NUM_SPOT_LIGHT_COORDS > 0
	vec4 worldPosition = vec4( transformed, 1.0 );
	#ifdef USE_BATCHING
		worldPosition = batchingMatrix * worldPosition;
	#endif
	#ifdef USE_INSTANCING
		worldPosition = instanceMatrix * worldPosition;
	#endif
	worldPosition = modelMatrix * worldPosition;
#endif`;const o0=`varying vec2 vUv;
uniform mat3 uvTransform;
void main() {
	vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	gl_Position = vec4( position.xy, 1.0, 1.0 );
}`,a0=`uniform sampler2D t2D;
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
}`,c0=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,l0=`#ifdef ENVMAP_TYPE_CUBE
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
}`,h0=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,u0=`uniform samplerCube tCube;
uniform float tFlip;
uniform float opacity;
varying vec3 vWorldDirection;
void main() {
	vec4 texColor = textureCube( tCube, vec3( tFlip * vWorldDirection.x, vWorldDirection.yz ) );
	gl_FragColor = texColor;
	gl_FragColor.a *= opacity;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,d0=`#include <common>
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
}`,f0=`#if DEPTH_PACKING == 3200
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
}`,p0=`#define DISTANCE
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
}`,m0=`#define DISTANCE
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
}`,g0=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
}`,b0=`uniform sampler2D tEquirect;
varying vec3 vWorldDirection;
#include <common>
void main() {
	vec3 direction = normalize( vWorldDirection );
	vec2 sampleUV = equirectUv( direction );
	gl_FragColor = texture2D( tEquirect, sampleUV );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,_0=`uniform float scale;
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
}`,x0=`uniform vec3 diffuse;
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
}`,v0=`#include <common>
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
}`,y0=`uniform vec3 diffuse;
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
}`,M0=`#define LAMBERT
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
}`,S0=`#define LAMBERT
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
}`,w0=`#define MATCAP
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
}`,E0=`#define MATCAP
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
}`,A0=`#define NORMAL
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
}`,T0=`#define NORMAL
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
}`,R0=`#define PHONG
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
}`,C0=`#define PHONG
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
}`,P0=`#define STANDARD
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
}`,L0=`#define STANDARD
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
}`,D0=`#define TOON
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
}`,I0=`#define TOON
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
}`,N0=`uniform float size;
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
}`,F0=`uniform vec3 diffuse;
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
}`,U0=`#include <common>
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
}`,O0=`uniform vec3 color;
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
}`,k0=`uniform float rotation;
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
}`,B0=`uniform vec3 diffuse;
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
}`,vt={alphahash_fragment:am,alphahash_pars_fragment:cm,alphamap_fragment:lm,alphamap_pars_fragment:hm,alphatest_fragment:um,alphatest_pars_fragment:dm,aomap_fragment:fm,aomap_pars_fragment:pm,batching_pars_vertex:mm,batching_vertex:gm,begin_vertex:bm,beginnormal_vertex:_m,bsdfs:xm,iridescence_fragment:vm,bumpmap_pars_fragment:ym,clipping_planes_fragment:Mm,clipping_planes_pars_fragment:Sm,clipping_planes_pars_vertex:wm,clipping_planes_vertex:Em,color_fragment:Am,color_pars_fragment:Tm,color_pars_vertex:Rm,color_vertex:Cm,common:Pm,cube_uv_reflection_fragment:Lm,defaultnormal_vertex:Dm,displacementmap_pars_vertex:Im,displacementmap_vertex:Nm,emissivemap_fragment:Fm,emissivemap_pars_fragment:Um,colorspace_fragment:Om,colorspace_pars_fragment:km,envmap_fragment:Bm,envmap_common_pars_fragment:zm,envmap_pars_fragment:Hm,envmap_pars_vertex:Vm,envmap_physical_pars_fragment:Jm,envmap_vertex:Gm,fog_vertex:Wm,fog_pars_vertex:qm,fog_fragment:jm,fog_pars_fragment:Xm,gradientmap_pars_fragment:Qm,lightmap_pars_fragment:Km,lights_lambert_fragment:Ym,lights_lambert_pars_fragment:$m,lights_pars_begin:Zm,lights_toon_fragment:eg,lights_toon_pars_fragment:tg,lights_phong_fragment:ng,lights_phong_pars_fragment:ig,lights_physical_fragment:rg,lights_physical_pars_fragment:sg,lights_fragment_begin:og,lights_fragment_maps:ag,lights_fragment_end:cg,logdepthbuf_fragment:lg,logdepthbuf_pars_fragment:hg,logdepthbuf_pars_vertex:ug,logdepthbuf_vertex:dg,map_fragment:fg,map_pars_fragment:pg,map_particle_fragment:mg,map_particle_pars_fragment:gg,metalnessmap_fragment:bg,metalnessmap_pars_fragment:_g,morphinstance_vertex:xg,morphcolor_vertex:vg,morphnormal_vertex:yg,morphtarget_pars_vertex:Mg,morphtarget_vertex:Sg,normal_fragment_begin:wg,normal_fragment_maps:Eg,normal_pars_fragment:Ag,normal_pars_vertex:Tg,normal_vertex:Rg,normalmap_pars_fragment:Cg,clearcoat_normal_fragment_begin:Pg,clearcoat_normal_fragment_maps:Lg,clearcoat_pars_fragment:Dg,iridescence_pars_fragment:Ig,opaque_fragment:Ng,packing:Fg,premultiplied_alpha_fragment:Ug,project_vertex:Og,dithering_fragment:kg,dithering_pars_fragment:Bg,roughnessmap_fragment:zg,roughnessmap_pars_fragment:Hg,shadowmap_pars_fragment:Vg,shadowmap_pars_vertex:Gg,shadowmap_vertex:Wg,shadowmask_pars_fragment:qg,skinbase_vertex:jg,skinning_pars_vertex:Xg,skinning_vertex:Qg,skinnormal_vertex:Kg,specularmap_fragment:Yg,specularmap_pars_fragment:$g,tonemapping_fragment:Zg,tonemapping_pars_fragment:Jg,transmission_fragment:e0,transmission_pars_fragment:t0,uv_pars_fragment:n0,uv_pars_vertex:i0,uv_vertex:r0,worldpos_vertex:s0,background_vert:o0,background_frag:a0,backgroundCube_vert:c0,backgroundCube_frag:l0,cube_vert:h0,cube_frag:u0,depth_vert:d0,depth_frag:f0,distanceRGBA_vert:p0,distanceRGBA_frag:m0,equirect_vert:g0,equirect_frag:b0,linedashed_vert:_0,linedashed_frag:x0,meshbasic_vert:v0,meshbasic_frag:y0,meshlambert_vert:M0,meshlambert_frag:S0,meshmatcap_vert:w0,meshmatcap_frag:E0,meshnormal_vert:A0,meshnormal_frag:T0,meshphong_vert:R0,meshphong_frag:C0,meshphysical_vert:P0,meshphysical_frag:L0,meshtoon_vert:D0,meshtoon_frag:I0,points_vert:N0,points_frag:F0,shadow_vert:U0,shadow_frag:O0,sprite_vert:k0,sprite_frag:B0},Pe={common:{diffuse:{value:new st(16777215)},opacity:{value:1},map:{value:null},mapTransform:{value:new yt},alphaMap:{value:null},alphaMapTransform:{value:new yt},alphaTest:{value:0}},specularmap:{specularMap:{value:null},specularMapTransform:{value:new yt}},envmap:{envMap:{value:null},envMapRotation:{value:new yt},flipEnvMap:{value:-1},reflectivity:{value:1},ior:{value:1.5},refractionRatio:{value:.98}},aomap:{aoMap:{value:null},aoMapIntensity:{value:1},aoMapTransform:{value:new yt}},lightmap:{lightMap:{value:null},lightMapIntensity:{value:1},lightMapTransform:{value:new yt}},bumpmap:{bumpMap:{value:null},bumpMapTransform:{value:new yt},bumpScale:{value:1}},normalmap:{normalMap:{value:null},normalMapTransform:{value:new yt},normalScale:{value:new ht(1,1)}},displacementmap:{displacementMap:{value:null},displacementMapTransform:{value:new yt},displacementScale:{value:1},displacementBias:{value:0}},emissivemap:{emissiveMap:{value:null},emissiveMapTransform:{value:new yt}},metalnessmap:{metalnessMap:{value:null},metalnessMapTransform:{value:new yt}},roughnessmap:{roughnessMap:{value:null},roughnessMapTransform:{value:new yt}},gradientmap:{gradientMap:{value:null}},fog:{fogDensity:{value:25e-5},fogNear:{value:1},fogFar:{value:2e3},fogColor:{value:new st(16777215)}},lights:{ambientLightColor:{value:[]},lightProbe:{value:[]},directionalLights:{value:[],properties:{direction:{},color:{}}},directionalLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},directionalShadowMap:{value:[]},directionalShadowMatrix:{value:[]},spotLights:{value:[],properties:{color:{},position:{},direction:{},distance:{},coneCos:{},penumbraCos:{},decay:{}}},spotLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},spotLightMap:{value:[]},spotShadowMap:{value:[]},spotLightMatrix:{value:[]},pointLights:{value:[],properties:{color:{},position:{},decay:{},distance:{}}},pointLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{},shadowCameraNear:{},shadowCameraFar:{}}},pointShadowMap:{value:[]},pointShadowMatrix:{value:[]},hemisphereLights:{value:[],properties:{direction:{},skyColor:{},groundColor:{}}},rectAreaLights:{value:[],properties:{color:{},position:{},width:{},height:{}}},ltc_1:{value:null},ltc_2:{value:null}},points:{diffuse:{value:new st(16777215)},opacity:{value:1},size:{value:1},scale:{value:1},map:{value:null},alphaMap:{value:null},alphaMapTransform:{value:new yt},alphaTest:{value:0},uvTransform:{value:new yt}},sprite:{diffuse:{value:new st(16777215)},opacity:{value:1},center:{value:new ht(.5,.5)},rotation:{value:0},map:{value:null},mapTransform:{value:new yt},alphaMap:{value:null},alphaMapTransform:{value:new yt},alphaTest:{value:0}}},_i={basic:{uniforms:Tn([Pe.common,Pe.specularmap,Pe.envmap,Pe.aomap,Pe.lightmap,Pe.fog]),vertexShader:vt.meshbasic_vert,fragmentShader:vt.meshbasic_frag},lambert:{uniforms:Tn([Pe.common,Pe.specularmap,Pe.envmap,Pe.aomap,Pe.lightmap,Pe.emissivemap,Pe.bumpmap,Pe.normalmap,Pe.displacementmap,Pe.fog,Pe.lights,{emissive:{value:new st(0)}}]),vertexShader:vt.meshlambert_vert,fragmentShader:vt.meshlambert_frag},phong:{uniforms:Tn([Pe.common,Pe.specularmap,Pe.envmap,Pe.aomap,Pe.lightmap,Pe.emissivemap,Pe.bumpmap,Pe.normalmap,Pe.displacementmap,Pe.fog,Pe.lights,{emissive:{value:new st(0)},specular:{value:new st(1118481)},shininess:{value:30}}]),vertexShader:vt.meshphong_vert,fragmentShader:vt.meshphong_frag},standard:{uniforms:Tn([Pe.common,Pe.envmap,Pe.aomap,Pe.lightmap,Pe.emissivemap,Pe.bumpmap,Pe.normalmap,Pe.displacementmap,Pe.roughnessmap,Pe.metalnessmap,Pe.fog,Pe.lights,{emissive:{value:new st(0)},roughness:{value:1},metalness:{value:0},envMapIntensity:{value:1}}]),vertexShader:vt.meshphysical_vert,fragmentShader:vt.meshphysical_frag},toon:{uniforms:Tn([Pe.common,Pe.aomap,Pe.lightmap,Pe.emissivemap,Pe.bumpmap,Pe.normalmap,Pe.displacementmap,Pe.gradientmap,Pe.fog,Pe.lights,{emissive:{value:new st(0)}}]),vertexShader:vt.meshtoon_vert,fragmentShader:vt.meshtoon_frag},matcap:{uniforms:Tn([Pe.common,Pe.bumpmap,Pe.normalmap,Pe.displacementmap,Pe.fog,{matcap:{value:null}}]),vertexShader:vt.meshmatcap_vert,fragmentShader:vt.meshmatcap_frag},points:{uniforms:Tn([Pe.points,Pe.fog]),vertexShader:vt.points_vert,fragmentShader:vt.points_frag},dashed:{uniforms:Tn([Pe.common,Pe.fog,{scale:{value:1},dashSize:{value:1},totalSize:{value:2}}]),vertexShader:vt.linedashed_vert,fragmentShader:vt.linedashed_frag},depth:{uniforms:Tn([Pe.common,Pe.displacementmap]),vertexShader:vt.depth_vert,fragmentShader:vt.depth_frag},normal:{uniforms:Tn([Pe.common,Pe.bumpmap,Pe.normalmap,Pe.displacementmap,{opacity:{value:1}}]),vertexShader:vt.meshnormal_vert,fragmentShader:vt.meshnormal_frag},sprite:{uniforms:Tn([Pe.sprite,Pe.fog]),vertexShader:vt.sprite_vert,fragmentShader:vt.sprite_frag},background:{uniforms:{uvTransform:{value:new yt},t2D:{value:null},backgroundIntensity:{value:1}},vertexShader:vt.background_vert,fragmentShader:vt.background_frag},backgroundCube:{uniforms:{envMap:{value:null},flipEnvMap:{value:-1},backgroundBlurriness:{value:0},backgroundIntensity:{value:1},backgroundRotation:{value:new yt}},vertexShader:vt.backgroundCube_vert,fragmentShader:vt.backgroundCube_frag},cube:{uniforms:{tCube:{value:null},tFlip:{value:-1},opacity:{value:1}},vertexShader:vt.cube_vert,fragmentShader:vt.cube_frag},equirect:{uniforms:{tEquirect:{value:null}},vertexShader:vt.equirect_vert,fragmentShader:vt.equirect_frag},distanceRGBA:{uniforms:Tn([Pe.common,Pe.displacementmap,{referencePosition:{value:new A},nearDistance:{value:1},farDistance:{value:1e3}}]),vertexShader:vt.distanceRGBA_vert,fragmentShader:vt.distanceRGBA_frag},shadow:{uniforms:Tn([Pe.lights,Pe.fog,{color:{value:new st(0)},opacity:{value:1}}]),vertexShader:vt.shadow_vert,fragmentShader:vt.shadow_frag}};_i.physical={uniforms:Tn([_i.standard.uniforms,{clearcoat:{value:0},clearcoatMap:{value:null},clearcoatMapTransform:{value:new yt},clearcoatNormalMap:{value:null},clearcoatNormalMapTransform:{value:new yt},clearcoatNormalScale:{value:new ht(1,1)},clearcoatRoughness:{value:0},clearcoatRoughnessMap:{value:null},clearcoatRoughnessMapTransform:{value:new yt},dispersion:{value:0},iridescence:{value:0},iridescenceMap:{value:null},iridescenceMapTransform:{value:new yt},iridescenceIOR:{value:1.3},iridescenceThicknessMinimum:{value:100},iridescenceThicknessMaximum:{value:400},iridescenceThicknessMap:{value:null},iridescenceThicknessMapTransform:{value:new yt},sheen:{value:0},sheenColor:{value:new st(0)},sheenColorMap:{value:null},sheenColorMapTransform:{value:new yt},sheenRoughness:{value:1},sheenRoughnessMap:{value:null},sheenRoughnessMapTransform:{value:new yt},transmission:{value:0},transmissionMap:{value:null},transmissionMapTransform:{value:new yt},transmissionSamplerSize:{value:new ht},transmissionSamplerMap:{value:null},thickness:{value:0},thicknessMap:{value:null},thicknessMapTransform:{value:new yt},attenuationDistance:{value:0},attenuationColor:{value:new st(0)},specularColor:{value:new st(1,1,1)},specularColorMap:{value:null},specularColorMapTransform:{value:new yt},specularIntensity:{value:1},specularIntensityMap:{value:null},specularIntensityMapTransform:{value:new yt},anisotropyVector:{value:new ht},anisotropyMap:{value:null},anisotropyMapTransform:{value:new yt}}]),vertexShader:vt.meshphysical_vert,fragmentShader:vt.meshphysical_frag};const Fo={r:0,b:0,g:0},Sr=new vi,z0=new ot;function H0(i,e,t,n,r,s,o){const a=new st(0);let c=s===!0?0:1,l,h,u=null,d=0,p=null;function g(M){let x=M.isScene===!0?M.background:null;return x&&x.isTexture&&(x=(M.backgroundBlurriness>0?t:e).get(x)),x}function b(M){let x=!1;const _=g(M);_===null?f(a,c):_&&_.isColor&&(f(_,1),x=!0);const I=i.xr.getEnvironmentBlendMode();I==="additive"?n.buffers.color.setClear(0,0,0,1,o):I==="alpha-blend"&&n.buffers.color.setClear(0,0,0,0,o),(i.autoClear||x)&&(n.buffers.depth.setTest(!0),n.buffers.depth.setMask(!0),n.buffers.color.setMask(!0),i.clear(i.autoClearColor,i.autoClearDepth,i.autoClearStencil))}function m(M,x){const _=g(x);_&&(_.isCubeTexture||_.mapping===Aa)?(h===void 0&&(h=new Xt(new Cs(1,1,1),new dr({name:"BackgroundCubeMaterial",uniforms:Ss(_i.backgroundCube.uniforms),vertexShader:_i.backgroundCube.vertexShader,fragmentShader:_i.backgroundCube.fragmentShader,side:Cn,depthTest:!1,depthWrite:!1,fog:!1})),h.geometry.deleteAttribute("normal"),h.geometry.deleteAttribute("uv"),h.onBeforeRender=function(I,R,T){this.matrixWorld.copyPosition(T.matrixWorld)},Object.defineProperty(h.material,"envMap",{get:function(){return this.uniforms.envMap.value}}),r.update(h)),Sr.copy(x.backgroundRotation),Sr.x*=-1,Sr.y*=-1,Sr.z*=-1,_.isCubeTexture&&_.isRenderTargetTexture===!1&&(Sr.y*=-1,Sr.z*=-1),h.material.uniforms.envMap.value=_,h.material.uniforms.flipEnvMap.value=_.isCubeTexture&&_.isRenderTargetTexture===!1?-1:1,h.material.uniforms.backgroundBlurriness.value=x.backgroundBlurriness,h.material.uniforms.backgroundIntensity.value=x.backgroundIntensity,h.material.uniforms.backgroundRotation.value.setFromMatrix4(z0.makeRotationFromEuler(Sr)),h.material.toneMapped=Ct.getTransfer(_.colorSpace)!==jt,(u!==_||d!==_.version||p!==i.toneMapping)&&(h.material.needsUpdate=!0,u=_,d=_.version,p=i.toneMapping),h.layers.enableAll(),M.unshift(h,h.geometry,h.material,0,0,null)):_&&_.isTexture&&(l===void 0&&(l=new Xt(new Ps(2,2),new dr({name:"BackgroundMaterial",uniforms:Ss(_i.background.uniforms),vertexShader:_i.background.vertexShader,fragmentShader:_i.background.fragmentShader,side:Wi,depthTest:!1,depthWrite:!1,fog:!1})),l.geometry.deleteAttribute("normal"),Object.defineProperty(l.material,"map",{get:function(){return this.uniforms.t2D.value}}),r.update(l)),l.material.uniforms.t2D.value=_,l.material.uniforms.backgroundIntensity.value=x.backgroundIntensity,l.material.toneMapped=Ct.getTransfer(_.colorSpace)!==jt,_.matrixAutoUpdate===!0&&_.updateMatrix(),l.material.uniforms.uvTransform.value.copy(_.matrix),(u!==_||d!==_.version||p!==i.toneMapping)&&(l.material.needsUpdate=!0,u=_,d=_.version,p=i.toneMapping),l.layers.enableAll(),M.unshift(l,l.geometry,l.material,0,0,null))}function f(M,x){M.getRGB(Fo,Ad(i)),n.buffers.color.setClear(Fo.r,Fo.g,Fo.b,x,o)}return{getClearColor:function(){return a},setClearColor:function(M,x=1){a.set(M),c=x,f(a,c)},getClearAlpha:function(){return c},setClearAlpha:function(M){c=M,f(a,c)},render:b,addToRenderList:m}}function V0(i,e){const t=i.getParameter(i.MAX_VERTEX_ATTRIBS),n={},r=d(null);let s=r,o=!1;function a(v,P,Q,G,ae){let oe=!1;const ne=u(G,Q,P);s!==ne&&(s=ne,l(s.object)),oe=p(v,G,Q,ae),oe&&g(v,G,Q,ae),ae!==null&&e.update(ae,i.ELEMENT_ARRAY_BUFFER),(oe||o)&&(o=!1,_(v,P,Q,G),ae!==null&&i.bindBuffer(i.ELEMENT_ARRAY_BUFFER,e.get(ae).buffer))}function c(){return i.createVertexArray()}function l(v){return i.bindVertexArray(v)}function h(v){return i.deleteVertexArray(v)}function u(v,P,Q){const G=Q.wireframe===!0;let ae=n[v.id];ae===void 0&&(ae={},n[v.id]=ae);let oe=ae[P.id];oe===void 0&&(oe={},ae[P.id]=oe);let ne=oe[G];return ne===void 0&&(ne=d(c()),oe[G]=ne),ne}function d(v){const P=[],Q=[],G=[];for(let ae=0;ae<t;ae++)P[ae]=0,Q[ae]=0,G[ae]=0;return{geometry:null,program:null,wireframe:!1,newAttributes:P,enabledAttributes:Q,attributeDivisors:G,object:v,attributes:{},index:null}}function p(v,P,Q,G){const ae=s.attributes,oe=P.attributes;let ne=0;const he=Q.getAttributes();for(const L in he)if(he[L].location>=0){const q=ae[L];let j=oe[L];if(j===void 0&&(L==="instanceMatrix"&&v.instanceMatrix&&(j=v.instanceMatrix),L==="instanceColor"&&v.instanceColor&&(j=v.instanceColor)),q===void 0||q.attribute!==j||j&&q.data!==j.data)return!0;ne++}return s.attributesNum!==ne||s.index!==G}function g(v,P,Q,G){const ae={},oe=P.attributes;let ne=0;const he=Q.getAttributes();for(const L in he)if(he[L].location>=0){let q=oe[L];q===void 0&&(L==="instanceMatrix"&&v.instanceMatrix&&(q=v.instanceMatrix),L==="instanceColor"&&v.instanceColor&&(q=v.instanceColor));const j={};j.attribute=q,q&&q.data&&(j.data=q.data),ae[L]=j,ne++}s.attributes=ae,s.attributesNum=ne,s.index=G}function b(){const v=s.newAttributes;for(let P=0,Q=v.length;P<Q;P++)v[P]=0}function m(v){f(v,0)}function f(v,P){const Q=s.newAttributes,G=s.enabledAttributes,ae=s.attributeDivisors;Q[v]=1,G[v]===0&&(i.enableVertexAttribArray(v),G[v]=1),ae[v]!==P&&(i.vertexAttribDivisor(v,P),ae[v]=P)}function M(){const v=s.newAttributes,P=s.enabledAttributes;for(let Q=0,G=P.length;Q<G;Q++)P[Q]!==v[Q]&&(i.disableVertexAttribArray(Q),P[Q]=0)}function x(v,P,Q,G,ae,oe,ne){ne===!0?i.vertexAttribIPointer(v,P,Q,ae,oe):i.vertexAttribPointer(v,P,Q,G,ae,oe)}function _(v,P,Q,G){b();const ae=G.attributes,oe=Q.getAttributes(),ne=P.defaultAttributeValues;for(const he in oe){const L=oe[he];if(L.location>=0){let W=ae[he];if(W===void 0&&(he==="instanceMatrix"&&v.instanceMatrix&&(W=v.instanceMatrix),he==="instanceColor"&&v.instanceColor&&(W=v.instanceColor)),W!==void 0){const q=W.normalized,j=W.itemSize,ee=e.get(W);if(ee===void 0)continue;const ue=ee.buffer,X=ee.type,re=ee.bytesPerElement,xe=X===i.INT||X===i.UNSIGNED_INT||W.gpuType===kl;if(W.isInterleavedBufferAttribute){const me=W.data,Te=me.stride,ke=W.offset;if(me.isInstancedInterleavedBuffer){for(let He=0;He<L.locationSize;He++)f(L.location+He,me.meshPerAttribute);v.isInstancedMesh!==!0&&G._maxInstanceCount===void 0&&(G._maxInstanceCount=me.meshPerAttribute*me.count)}else for(let He=0;He<L.locationSize;He++)m(L.location+He);i.bindBuffer(i.ARRAY_BUFFER,ue);for(let He=0;He<L.locationSize;He++)x(L.location+He,j/L.locationSize,X,q,Te*re,(ke+j/L.locationSize*He)*re,xe)}else{if(W.isInstancedBufferAttribute){for(let me=0;me<L.locationSize;me++)f(L.location+me,W.meshPerAttribute);v.isInstancedMesh!==!0&&G._maxInstanceCount===void 0&&(G._maxInstanceCount=W.meshPerAttribute*W.count)}else for(let me=0;me<L.locationSize;me++)m(L.location+me);i.bindBuffer(i.ARRAY_BUFFER,ue);for(let me=0;me<L.locationSize;me++)x(L.location+me,j/L.locationSize,X,q,j*re,j/L.locationSize*me*re,xe)}}else if(ne!==void 0){const q=ne[he];if(q!==void 0)switch(q.length){case 2:i.vertexAttrib2fv(L.location,q);break;case 3:i.vertexAttrib3fv(L.location,q);break;case 4:i.vertexAttrib4fv(L.location,q);break;default:i.vertexAttrib1fv(L.location,q)}}}}M()}function I(){F();for(const v in n){const P=n[v];for(const Q in P){const G=P[Q];for(const ae in G)h(G[ae].object),delete G[ae];delete P[Q]}delete n[v]}}function R(v){if(n[v.id]===void 0)return;const P=n[v.id];for(const Q in P){const G=P[Q];for(const ae in G)h(G[ae].object),delete G[ae];delete P[Q]}delete n[v.id]}function T(v){for(const P in n){const Q=n[P];if(Q[v.id]===void 0)continue;const G=Q[v.id];for(const ae in G)h(G[ae].object),delete G[ae];delete Q[v.id]}}function F(){S(),o=!0,s!==r&&(s=r,l(s.object))}function S(){r.geometry=null,r.program=null,r.wireframe=!1}return{setup:a,reset:F,resetDefaultState:S,dispose:I,releaseStatesOfGeometry:R,releaseStatesOfProgram:T,initAttributes:b,enableAttribute:m,disableUnusedAttributes:M}}function G0(i,e,t){let n;function r(l){n=l}function s(l,h){i.drawArrays(n,l,h),t.update(h,n,1)}function o(l,h,u){u!==0&&(i.drawArraysInstanced(n,l,h,u),t.update(h,n,u))}function a(l,h,u){if(u===0)return;e.get("WEBGL_multi_draw").multiDrawArraysWEBGL(n,l,0,h,0,u);let p=0;for(let g=0;g<u;g++)p+=h[g];t.update(p,n,1)}function c(l,h,u,d){if(u===0)return;const p=e.get("WEBGL_multi_draw");if(p===null)for(let g=0;g<l.length;g++)o(l[g],h[g],d[g]);else{p.multiDrawArraysInstancedWEBGL(n,l,0,h,0,d,0,u);let g=0;for(let b=0;b<u;b++)g+=h[b]*d[b];t.update(g,n,1)}}this.setMode=r,this.render=s,this.renderInstances=o,this.renderMultiDraw=a,this.renderMultiDrawInstances=c}function W0(i,e,t,n){let r;function s(){if(r!==void 0)return r;if(e.has("EXT_texture_filter_anisotropic")===!0){const T=e.get("EXT_texture_filter_anisotropic");r=i.getParameter(T.MAX_TEXTURE_MAX_ANISOTROPY_EXT)}else r=0;return r}function o(T){return!(T!==ei&&n.convert(T)!==i.getParameter(i.IMPLEMENTATION_COLOR_READ_FORMAT))}function a(T){const F=T===ho&&(e.has("EXT_color_buffer_half_float")||e.has("EXT_color_buffer_float"));return!(T!==qi&&n.convert(T)!==i.getParameter(i.IMPLEMENTATION_COLOR_READ_TYPE)&&T!==li&&!F)}function c(T){if(T==="highp"){if(i.getShaderPrecisionFormat(i.VERTEX_SHADER,i.HIGH_FLOAT).precision>0&&i.getShaderPrecisionFormat(i.FRAGMENT_SHADER,i.HIGH_FLOAT).precision>0)return"highp";T="mediump"}return T==="mediump"&&i.getShaderPrecisionFormat(i.VERTEX_SHADER,i.MEDIUM_FLOAT).precision>0&&i.getShaderPrecisionFormat(i.FRAGMENT_SHADER,i.MEDIUM_FLOAT).precision>0?"mediump":"lowp"}let l=t.precision!==void 0?t.precision:"highp";const h=c(l);h!==l&&(console.warn("THREE.WebGLRenderer:",l,"not supported, using",h,"instead."),l=h);const u=t.logarithmicDepthBuffer===!0,d=t.reverseDepthBuffer===!0&&e.has("EXT_clip_control"),p=i.getParameter(i.MAX_TEXTURE_IMAGE_UNITS),g=i.getParameter(i.MAX_VERTEX_TEXTURE_IMAGE_UNITS),b=i.getParameter(i.MAX_TEXTURE_SIZE),m=i.getParameter(i.MAX_CUBE_MAP_TEXTURE_SIZE),f=i.getParameter(i.MAX_VERTEX_ATTRIBS),M=i.getParameter(i.MAX_VERTEX_UNIFORM_VECTORS),x=i.getParameter(i.MAX_VARYING_VECTORS),_=i.getParameter(i.MAX_FRAGMENT_UNIFORM_VECTORS),I=g>0,R=i.getParameter(i.MAX_SAMPLES);return{isWebGL2:!0,getMaxAnisotropy:s,getMaxPrecision:c,textureFormatReadable:o,textureTypeReadable:a,precision:l,logarithmicDepthBuffer:u,reverseDepthBuffer:d,maxTextures:p,maxVertexTextures:g,maxTextureSize:b,maxCubemapSize:m,maxAttributes:f,maxVertexUniforms:M,maxVaryings:x,maxFragmentUniforms:_,vertexTextures:I,maxSamples:R}}function q0(i){const e=this;let t=null,n=0,r=!1,s=!1;const o=new ir,a=new yt,c={value:null,needsUpdate:!1};this.uniform=c,this.numPlanes=0,this.numIntersection=0,this.init=function(u,d){const p=u.length!==0||d||n!==0||r;return r=d,n=u.length,p},this.beginShadows=function(){s=!0,h(null)},this.endShadows=function(){s=!1},this.setGlobalState=function(u,d){t=h(u,d,0)},this.setState=function(u,d,p){const g=u.clippingPlanes,b=u.clipIntersection,m=u.clipShadows,f=i.get(u);if(!r||g===null||g.length===0||s&&!m)s?h(null):l();else{const M=s?0:n,x=M*4;let _=f.clippingState||null;c.value=_,_=h(g,d,x,p);for(let I=0;I!==x;++I)_[I]=t[I];f.clippingState=_,this.numIntersection=b?this.numPlanes:0,this.numPlanes+=M}};function l(){c.value!==t&&(c.value=t,c.needsUpdate=n>0),e.numPlanes=n,e.numIntersection=0}function h(u,d,p,g){const b=u!==null?u.length:0;let m=null;if(b!==0){if(m=c.value,g!==!0||m===null){const f=p+b*4,M=d.matrixWorldInverse;a.getNormalMatrix(M),(m===null||m.length<f)&&(m=new Float32Array(f));for(let x=0,_=p;x!==b;++x,_+=4)o.copy(u[x]).applyMatrix4(M,a),o.normal.toArray(m,_),m[_+3]=o.constant}c.value=m,c.needsUpdate=!0}return e.numPlanes=b,e.numIntersection=0,m}}function j0(i){let e=new WeakMap;function t(o,a){return a===qc?o.mapping=bs:a===jc&&(o.mapping=_s),o}function n(o){if(o&&o.isTexture){const a=o.mapping;if(a===qc||a===jc)if(e.has(o)){const c=e.get(o).texture;return t(c,o.mapping)}else{const c=o.image;if(c&&c.height>0){const l=new im(c.height);return l.fromEquirectangularTexture(i,o),e.set(o,l),o.addEventListener("dispose",r),t(l.texture,o.mapping)}else return null}}return o}function r(o){const a=o.target;a.removeEventListener("dispose",r);const c=e.get(a);c!==void 0&&(e.delete(a),c.dispose())}function s(){e=new WeakMap}return{get:n,dispose:s}}class Ql extends Td{constructor(e=-1,t=1,n=1,r=-1,s=.1,o=2e3){super(),this.isOrthographicCamera=!0,this.type="OrthographicCamera",this.zoom=1,this.view=null,this.left=e,this.right=t,this.top=n,this.bottom=r,this.near=s,this.far=o,this.updateProjectionMatrix()}copy(e,t){return super.copy(e,t),this.left=e.left,this.right=e.right,this.top=e.top,this.bottom=e.bottom,this.near=e.near,this.far=e.far,this.zoom=e.zoom,this.view=e.view===null?null:Object.assign({},e.view),this}setViewOffset(e,t,n,r,s,o){this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=e,this.view.fullHeight=t,this.view.offsetX=n,this.view.offsetY=r,this.view.width=s,this.view.height=o,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const e=(this.right-this.left)/(2*this.zoom),t=(this.top-this.bottom)/(2*this.zoom),n=(this.right+this.left)/2,r=(this.top+this.bottom)/2;let s=n-e,o=n+e,a=r+t,c=r-t;if(this.view!==null&&this.view.enabled){const l=(this.right-this.left)/this.view.fullWidth/this.zoom,h=(this.top-this.bottom)/this.view.fullHeight/this.zoom;s+=l*this.view.offsetX,o=s+l*this.view.width,a-=h*this.view.offsetY,c=a-h*this.view.height}this.projectionMatrix.makeOrthographic(s,o,a,c,this.near,this.far,this.coordinateSystem),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(e){const t=super.toJSON(e);return t.object.zoom=this.zoom,t.object.left=this.left,t.object.right=this.right,t.object.top=this.top,t.object.bottom=this.bottom,t.object.near=this.near,t.object.far=this.far,this.view!==null&&(t.object.view=Object.assign({},this.view)),t}}const rs=4,Vh=[.125,.215,.35,.446,.526,.582],Pr=20,ac=new Ql,Gh=new st;let cc=null,lc=0,hc=0,uc=!1;const Tr=(1+Math.sqrt(5))/2,$r=1/Tr,Wh=[new A(-Tr,$r,0),new A(Tr,$r,0),new A(-$r,0,Tr),new A($r,0,Tr),new A(0,Tr,-$r),new A(0,Tr,$r),new A(-1,1,-1),new A(1,1,-1),new A(-1,1,1),new A(1,1,1)];class yl{constructor(e){this._renderer=e,this._pingPongRenderTarget=null,this._lodMax=0,this._cubeSize=0,this._lodPlanes=[],this._sizeLods=[],this._sigmas=[],this._blurMaterial=null,this._cubemapMaterial=null,this._equirectMaterial=null,this._compileMaterial(this._blurMaterial)}fromScene(e,t=0,n=.1,r=100){cc=this._renderer.getRenderTarget(),lc=this._renderer.getActiveCubeFace(),hc=this._renderer.getActiveMipmapLevel(),uc=this._renderer.xr.enabled,this._renderer.xr.enabled=!1,this._setSize(256);const s=this._allocateTargets();return s.depthBuffer=!0,this._sceneToCubeUV(e,n,r,s),t>0&&this._blur(s,0,0,t),this._applyPMREM(s),this._cleanup(s),s}fromEquirectangular(e,t=null){return this._fromTexture(e,t)}fromCubemap(e,t=null){return this._fromTexture(e,t)}compileCubemapShader(){this._cubemapMaterial===null&&(this._cubemapMaterial=Xh(),this._compileMaterial(this._cubemapMaterial))}compileEquirectangularShader(){this._equirectMaterial===null&&(this._equirectMaterial=jh(),this._compileMaterial(this._equirectMaterial))}dispose(){this._dispose(),this._cubemapMaterial!==null&&this._cubemapMaterial.dispose(),this._equirectMaterial!==null&&this._equirectMaterial.dispose()}_setSize(e){this._lodMax=Math.floor(Math.log2(e)),this._cubeSize=Math.pow(2,this._lodMax)}_dispose(){this._blurMaterial!==null&&this._blurMaterial.dispose(),this._pingPongRenderTarget!==null&&this._pingPongRenderTarget.dispose();for(let e=0;e<this._lodPlanes.length;e++)this._lodPlanes[e].dispose()}_cleanup(e){this._renderer.setRenderTarget(cc,lc,hc),this._renderer.xr.enabled=uc,e.scissorTest=!1,Uo(e,0,0,e.width,e.height)}_fromTexture(e,t){e.mapping===bs||e.mapping===_s?this._setSize(e.image.length===0?16:e.image[0].width||e.image[0].image.width):this._setSize(e.image.width/4),cc=this._renderer.getRenderTarget(),lc=this._renderer.getActiveCubeFace(),hc=this._renderer.getActiveMipmapLevel(),uc=this._renderer.xr.enabled,this._renderer.xr.enabled=!1;const n=t||this._allocateTargets();return this._textureToCubeUV(e,n),this._applyPMREM(n),this._cleanup(n),n}_allocateTargets(){const e=3*Math.max(this._cubeSize,112),t=4*this._cubeSize,n={magFilter:jn,minFilter:jn,generateMipmaps:!1,type:ho,format:ei,colorSpace:Ln,depthBuffer:!1},r=qh(e,t,n);if(this._pingPongRenderTarget===null||this._pingPongRenderTarget.width!==e||this._pingPongRenderTarget.height!==t){this._pingPongRenderTarget!==null&&this._dispose(),this._pingPongRenderTarget=qh(e,t,n);const{_lodMax:s}=this;({sizeLods:this._sizeLods,lodPlanes:this._lodPlanes,sigmas:this._sigmas}=X0(s)),this._blurMaterial=Q0(s,e,t)}return r}_compileMaterial(e){const t=new Xt(this._lodPlanes[0],e);this._renderer.compile(t,ac)}_sceneToCubeUV(e,t,n,r){const a=new vn(90,1,t,n),c=[1,-1,1,1,1,1],l=[1,1,1,-1,-1,-1],h=this._renderer,u=h.autoClear,d=h.toneMapping;h.getClearColor(Gh),h.toneMapping=lr,h.autoClear=!1;const p=new Bi({name:"PMREM.Background",side:Cn,depthWrite:!1,depthTest:!1}),g=new Xt(new Cs,p);let b=!1;const m=e.background;m?m.isColor&&(p.color.copy(m),e.background=null,b=!0):(p.color.copy(Gh),b=!0);for(let f=0;f<6;f++){const M=f%3;M===0?(a.up.set(0,c[f],0),a.lookAt(l[f],0,0)):M===1?(a.up.set(0,0,c[f]),a.lookAt(0,l[f],0)):(a.up.set(0,c[f],0),a.lookAt(0,0,l[f]));const x=this._cubeSize;Uo(r,M*x,f>2?x:0,x,x),h.setRenderTarget(r),b&&h.render(g,a),h.render(e,a)}g.geometry.dispose(),g.material.dispose(),h.toneMapping=d,h.autoClear=u,e.background=m}_textureToCubeUV(e,t){const n=this._renderer,r=e.mapping===bs||e.mapping===_s;r?(this._cubemapMaterial===null&&(this._cubemapMaterial=Xh()),this._cubemapMaterial.uniforms.flipEnvMap.value=e.isRenderTargetTexture===!1?-1:1):this._equirectMaterial===null&&(this._equirectMaterial=jh());const s=r?this._cubemapMaterial:this._equirectMaterial,o=new Xt(this._lodPlanes[0],s),a=s.uniforms;a.envMap.value=e;const c=this._cubeSize;Uo(t,0,0,3*c,2*c),n.setRenderTarget(t),n.render(o,ac)}_applyPMREM(e){const t=this._renderer,n=t.autoClear;t.autoClear=!1;const r=this._lodPlanes.length;for(let s=1;s<r;s++){const o=Math.sqrt(this._sigmas[s]*this._sigmas[s]-this._sigmas[s-1]*this._sigmas[s-1]),a=Wh[(r-s-1)%Wh.length];this._blur(e,s-1,s,o,a)}t.autoClear=n}_blur(e,t,n,r,s){const o=this._pingPongRenderTarget;this._halfBlur(e,o,t,n,r,"latitudinal",s),this._halfBlur(o,e,n,n,r,"longitudinal",s)}_halfBlur(e,t,n,r,s,o,a){const c=this._renderer,l=this._blurMaterial;o!=="latitudinal"&&o!=="longitudinal"&&console.error("blur direction must be either latitudinal or longitudinal!");const h=3,u=new Xt(this._lodPlanes[r],l),d=l.uniforms,p=this._sizeLods[n]-1,g=isFinite(s)?Math.PI/(2*p):2*Math.PI/(2*Pr-1),b=s/g,m=isFinite(s)?1+Math.floor(h*b):Pr;m>Pr&&console.warn(`sigmaRadians, ${s}, is too large and will clip, as it requested ${m} samples when the maximum is set to ${Pr}`);const f=[];let M=0;for(let T=0;T<Pr;++T){const F=T/b,S=Math.exp(-F*F/2);f.push(S),T===0?M+=S:T<m&&(M+=2*S)}for(let T=0;T<f.length;T++)f[T]=f[T]/M;d.envMap.value=e.texture,d.samples.value=m,d.weights.value=f,d.latitudinal.value=o==="latitudinal",a&&(d.poleAxis.value=a);const{_lodMax:x}=this;d.dTheta.value=g,d.mipInt.value=x-n;const _=this._sizeLods[r],I=3*_*(r>x-rs?r-x+rs:0),R=4*(this._cubeSize-_);Uo(t,I,R,3*_,2*_),c.setRenderTarget(t),c.render(u,ac)}}function X0(i){const e=[],t=[],n=[];let r=i;const s=i-rs+1+Vh.length;for(let o=0;o<s;o++){const a=Math.pow(2,r);t.push(a);let c=1/a;o>i-rs?c=Vh[o-i+rs-1]:o===0&&(c=0),n.push(c);const l=1/(a-2),h=-l,u=1+l,d=[h,h,u,h,u,u,h,h,u,u,h,u],p=6,g=6,b=3,m=2,f=1,M=new Float32Array(b*g*p),x=new Float32Array(m*g*p),_=new Float32Array(f*g*p);for(let R=0;R<p;R++){const T=R%3*2/3-1,F=R>2?0:-1,S=[T,F,0,T+2/3,F,0,T+2/3,F+1,0,T,F,0,T+2/3,F+1,0,T,F+1,0];M.set(S,b*g*R),x.set(d,m*g*R);const v=[R,R,R,R,R,R];_.set(v,f*g*R)}const I=new Mi;I.setAttribute("position",new wn(M,b)),I.setAttribute("uv",new wn(x,m)),I.setAttribute("faceIndex",new wn(_,f)),e.push(I),r>rs&&r--}return{lodPlanes:e,sizeLods:t,sigmas:n}}function qh(i,e,t){const n=new ur(i,e,t);return n.texture.mapping=Aa,n.texture.name="PMREM.cubeUv",n.scissorTest=!0,n}function Uo(i,e,t,n,r){i.viewport.set(e,t,n,r),i.scissor.set(e,t,n,r)}function Q0(i,e,t){const n=new Float32Array(Pr),r=new A(0,1,0);return new dr({name:"SphericalGaussianBlur",defines:{n:Pr,CUBEUV_TEXEL_WIDTH:1/e,CUBEUV_TEXEL_HEIGHT:1/t,CUBEUV_MAX_MIP:`${i}.0`},uniforms:{envMap:{value:null},samples:{value:1},weights:{value:n},latitudinal:{value:!1},dTheta:{value:0},mipInt:{value:0},poleAxis:{value:r}},vertexShader:Kl(),fragmentShader:`

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
		`,blending:cr,depthTest:!1,depthWrite:!1})}function jh(){return new dr({name:"EquirectangularToCubeUV",uniforms:{envMap:{value:null}},vertexShader:Kl(),fragmentShader:`

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
		`,blending:cr,depthTest:!1,depthWrite:!1})}function Xh(){return new dr({name:"CubemapToCubeUV",uniforms:{envMap:{value:null},flipEnvMap:{value:-1}},vertexShader:Kl(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			uniform float flipEnvMap;

			varying vec3 vOutputDirection;

			uniform samplerCube envMap;

			void main() {

				gl_FragColor = textureCube( envMap, vec3( flipEnvMap * vOutputDirection.x, vOutputDirection.yz ) );

			}
		`,blending:cr,depthTest:!1,depthWrite:!1})}function Kl(){return`

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
	`}function K0(i){let e=new WeakMap,t=null;function n(a){if(a&&a.isTexture){const c=a.mapping,l=c===qc||c===jc,h=c===bs||c===_s;if(l||h){let u=e.get(a);const d=u!==void 0?u.texture.pmremVersion:0;if(a.isRenderTargetTexture&&a.pmremVersion!==d)return t===null&&(t=new yl(i)),u=l?t.fromEquirectangular(a,u):t.fromCubemap(a,u),u.texture.pmremVersion=a.pmremVersion,e.set(a,u),u.texture;if(u!==void 0)return u.texture;{const p=a.image;return l&&p&&p.height>0||h&&p&&r(p)?(t===null&&(t=new yl(i)),u=l?t.fromEquirectangular(a):t.fromCubemap(a),u.texture.pmremVersion=a.pmremVersion,e.set(a,u),a.addEventListener("dispose",s),u.texture):null}}}return a}function r(a){let c=0;const l=6;for(let h=0;h<l;h++)a[h]!==void 0&&c++;return c===l}function s(a){const c=a.target;c.removeEventListener("dispose",s);const l=e.get(c);l!==void 0&&(e.delete(c),l.dispose())}function o(){e=new WeakMap,t!==null&&(t.dispose(),t=null)}return{get:n,dispose:o}}function Y0(i){const e={};function t(n){if(e[n]!==void 0)return e[n];let r;switch(n){case"WEBGL_depth_texture":r=i.getExtension("WEBGL_depth_texture")||i.getExtension("MOZ_WEBGL_depth_texture")||i.getExtension("WEBKIT_WEBGL_depth_texture");break;case"EXT_texture_filter_anisotropic":r=i.getExtension("EXT_texture_filter_anisotropic")||i.getExtension("MOZ_EXT_texture_filter_anisotropic")||i.getExtension("WEBKIT_EXT_texture_filter_anisotropic");break;case"WEBGL_compressed_texture_s3tc":r=i.getExtension("WEBGL_compressed_texture_s3tc")||i.getExtension("MOZ_WEBGL_compressed_texture_s3tc")||i.getExtension("WEBKIT_WEBGL_compressed_texture_s3tc");break;case"WEBGL_compressed_texture_pvrtc":r=i.getExtension("WEBGL_compressed_texture_pvrtc")||i.getExtension("WEBKIT_WEBGL_compressed_texture_pvrtc");break;default:r=i.getExtension(n)}return e[n]=r,r}return{has:function(n){return t(n)!==null},init:function(){t("EXT_color_buffer_float"),t("WEBGL_clip_cull_distance"),t("OES_texture_float_linear"),t("EXT_color_buffer_half_float"),t("WEBGL_multisampled_render_to_texture"),t("WEBGL_render_shared_exponent")},get:function(n){const r=t(n);return r===null&&Ys("THREE.WebGLRenderer: "+n+" extension not supported."),r}}}function $0(i,e,t,n){const r={},s=new WeakMap;function o(u){const d=u.target;d.index!==null&&e.remove(d.index);for(const g in d.attributes)e.remove(d.attributes[g]);for(const g in d.morphAttributes){const b=d.morphAttributes[g];for(let m=0,f=b.length;m<f;m++)e.remove(b[m])}d.removeEventListener("dispose",o),delete r[d.id];const p=s.get(d);p&&(e.remove(p),s.delete(d)),n.releaseStatesOfGeometry(d),d.isInstancedBufferGeometry===!0&&delete d._maxInstanceCount,t.memory.geometries--}function a(u,d){return r[d.id]===!0||(d.addEventListener("dispose",o),r[d.id]=!0,t.memory.geometries++),d}function c(u){const d=u.attributes;for(const g in d)e.update(d[g],i.ARRAY_BUFFER);const p=u.morphAttributes;for(const g in p){const b=p[g];for(let m=0,f=b.length;m<f;m++)e.update(b[m],i.ARRAY_BUFFER)}}function l(u){const d=[],p=u.index,g=u.attributes.position;let b=0;if(p!==null){const M=p.array;b=p.version;for(let x=0,_=M.length;x<_;x+=3){const I=M[x+0],R=M[x+1],T=M[x+2];d.push(I,R,R,T,T,I)}}else if(g!==void 0){const M=g.array;b=g.version;for(let x=0,_=M.length/3-1;x<_;x+=3){const I=x+0,R=x+1,T=x+2;d.push(I,R,R,T,T,I)}}else return;const m=new(vd(d)?Ed:wd)(d,1);m.version=b;const f=s.get(u);f&&e.remove(f),s.set(u,m)}function h(u){const d=s.get(u);if(d){const p=u.index;p!==null&&d.version<p.version&&l(u)}else l(u);return s.get(u)}return{get:a,update:c,getWireframeAttribute:h}}function Z0(i,e,t){let n;function r(d){n=d}let s,o;function a(d){s=d.type,o=d.bytesPerElement}function c(d,p){i.drawElements(n,p,s,d*o),t.update(p,n,1)}function l(d,p,g){g!==0&&(i.drawElementsInstanced(n,p,s,d*o,g),t.update(p,n,g))}function h(d,p,g){if(g===0)return;e.get("WEBGL_multi_draw").multiDrawElementsWEBGL(n,p,0,s,d,0,g);let m=0;for(let f=0;f<g;f++)m+=p[f];t.update(m,n,1)}function u(d,p,g,b){if(g===0)return;const m=e.get("WEBGL_multi_draw");if(m===null)for(let f=0;f<d.length;f++)l(d[f]/o,p[f],b[f]);else{m.multiDrawElementsInstancedWEBGL(n,p,0,s,d,0,b,0,g);let f=0;for(let M=0;M<g;M++)f+=p[M]*b[M];t.update(f,n,1)}}this.setMode=r,this.setIndex=a,this.render=c,this.renderInstances=l,this.renderMultiDraw=h,this.renderMultiDrawInstances=u}function J0(i){const e={geometries:0,textures:0},t={frame:0,calls:0,triangles:0,points:0,lines:0};function n(s,o,a){switch(t.calls++,o){case i.TRIANGLES:t.triangles+=a*(s/3);break;case i.LINES:t.lines+=a*(s/2);break;case i.LINE_STRIP:t.lines+=a*(s-1);break;case i.LINE_LOOP:t.lines+=a*s;break;case i.POINTS:t.points+=a*s;break;default:console.error("THREE.WebGLInfo: Unknown draw mode:",o);break}}function r(){t.calls=0,t.triangles=0,t.points=0,t.lines=0}return{memory:e,render:t,programs:null,autoReset:!0,reset:r,update:n}}function eb(i,e,t){const n=new WeakMap,r=new mt;function s(o,a,c){const l=o.morphTargetInfluences,h=a.morphAttributes.position||a.morphAttributes.normal||a.morphAttributes.color,u=h!==void 0?h.length:0;let d=n.get(a);if(d===void 0||d.count!==u){let v=function(){F.dispose(),n.delete(a),a.removeEventListener("dispose",v)};var p=v;d!==void 0&&d.texture.dispose();const g=a.morphAttributes.position!==void 0,b=a.morphAttributes.normal!==void 0,m=a.morphAttributes.color!==void 0,f=a.morphAttributes.position||[],M=a.morphAttributes.normal||[],x=a.morphAttributes.color||[];let _=0;g===!0&&(_=1),b===!0&&(_=2),m===!0&&(_=3);let I=a.attributes.position.count*_,R=1;I>e.maxTextureSize&&(R=Math.ceil(I/e.maxTextureSize),I=e.maxTextureSize);const T=new Float32Array(I*R*4*u),F=new Md(T,I,R,u);F.type=li,F.needsUpdate=!0;const S=_*4;for(let P=0;P<u;P++){const Q=f[P],G=M[P],ae=x[P],oe=I*R*4*P;for(let ne=0;ne<Q.count;ne++){const he=ne*S;g===!0&&(r.fromBufferAttribute(Q,ne),T[oe+he+0]=r.x,T[oe+he+1]=r.y,T[oe+he+2]=r.z,T[oe+he+3]=0),b===!0&&(r.fromBufferAttribute(G,ne),T[oe+he+4]=r.x,T[oe+he+5]=r.y,T[oe+he+6]=r.z,T[oe+he+7]=0),m===!0&&(r.fromBufferAttribute(ae,ne),T[oe+he+8]=r.x,T[oe+he+9]=r.y,T[oe+he+10]=r.z,T[oe+he+11]=ae.itemSize===4?r.w:1)}}d={count:u,texture:F,size:new ht(I,R)},n.set(a,d),a.addEventListener("dispose",v)}if(o.isInstancedMesh===!0&&o.morphTexture!==null)c.getUniforms().setValue(i,"morphTexture",o.morphTexture,t);else{let g=0;for(let m=0;m<l.length;m++)g+=l[m];const b=a.morphTargetsRelative?1:1-g;c.getUniforms().setValue(i,"morphTargetBaseInfluence",b),c.getUniforms().setValue(i,"morphTargetInfluences",l)}c.getUniforms().setValue(i,"morphTargetsTexture",d.texture,t),c.getUniforms().setValue(i,"morphTargetsTextureSize",d.size)}return{update:s}}function tb(i,e,t,n){let r=new WeakMap;function s(c){const l=n.render.frame,h=c.geometry,u=e.get(c,h);if(r.get(u)!==l&&(e.update(u),r.set(u,l)),c.isInstancedMesh&&(c.hasEventListener("dispose",a)===!1&&c.addEventListener("dispose",a),r.get(c)!==l&&(t.update(c.instanceMatrix,i.ARRAY_BUFFER),c.instanceColor!==null&&t.update(c.instanceColor,i.ARRAY_BUFFER),r.set(c,l))),c.isSkinnedMesh){const d=c.skeleton;r.get(d)!==l&&(d.update(),r.set(d,l))}return u}function o(){r=new WeakMap}function a(c){const l=c.target;l.removeEventListener("dispose",a),t.remove(l.instanceMatrix),l.instanceColor!==null&&t.remove(l.instanceColor)}return{update:s,dispose:o}}class Pd extends hn{constructor(e,t,n,r,s,o,a,c,l,h=cs){if(h!==cs&&h!==ys)throw new Error("DepthTexture format must be either THREE.DepthFormat or THREE.DepthStencilFormat");n===void 0&&h===cs&&(n=Nr),n===void 0&&h===ys&&(n=vs),super(null,r,s,o,a,c,h,n,l),this.isDepthTexture=!0,this.image={width:e,height:t},this.magFilter=a!==void 0?a:Pn,this.minFilter=c!==void 0?c:Pn,this.flipY=!1,this.generateMipmaps=!1,this.compareFunction=null}copy(e){return super.copy(e),this.compareFunction=e.compareFunction,this}toJSON(e){const t=super.toJSON(e);return this.compareFunction!==null&&(t.compareFunction=this.compareFunction),t}}const Ld=new hn,Qh=new Pd(1,1),Dd=new Md,Id=new Hp,Nd=new Rd,Kh=[],Yh=[],$h=new Float32Array(16),Zh=new Float32Array(9),Jh=new Float32Array(4);function Ls(i,e,t){const n=i[0];if(n<=0||n>0)return i;const r=e*t;let s=Kh[r];if(s===void 0&&(s=new Float32Array(r),Kh[r]=s),e!==0){n.toArray(s,0);for(let o=1,a=0;o!==e;++o)a+=t,i[o].toArray(s,a)}return s}function un(i,e){if(i.length!==e.length)return!1;for(let t=0,n=i.length;t<n;t++)if(i[t]!==e[t])return!1;return!0}function dn(i,e){for(let t=0,n=e.length;t<n;t++)i[t]=e[t]}function Ra(i,e){let t=Yh[e];t===void 0&&(t=new Int32Array(e),Yh[e]=t);for(let n=0;n!==e;++n)t[n]=i.allocateTextureUnit();return t}function nb(i,e){const t=this.cache;t[0]!==e&&(i.uniform1f(this.addr,e),t[0]=e)}function ib(i,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(i.uniform2f(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(un(t,e))return;i.uniform2fv(this.addr,e),dn(t,e)}}function rb(i,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(i.uniform3f(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else if(e.r!==void 0)(t[0]!==e.r||t[1]!==e.g||t[2]!==e.b)&&(i.uniform3f(this.addr,e.r,e.g,e.b),t[0]=e.r,t[1]=e.g,t[2]=e.b);else{if(un(t,e))return;i.uniform3fv(this.addr,e),dn(t,e)}}function sb(i,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(i.uniform4f(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(un(t,e))return;i.uniform4fv(this.addr,e),dn(t,e)}}function ob(i,e){const t=this.cache,n=e.elements;if(n===void 0){if(un(t,e))return;i.uniformMatrix2fv(this.addr,!1,e),dn(t,e)}else{if(un(t,n))return;Jh.set(n),i.uniformMatrix2fv(this.addr,!1,Jh),dn(t,n)}}function ab(i,e){const t=this.cache,n=e.elements;if(n===void 0){if(un(t,e))return;i.uniformMatrix3fv(this.addr,!1,e),dn(t,e)}else{if(un(t,n))return;Zh.set(n),i.uniformMatrix3fv(this.addr,!1,Zh),dn(t,n)}}function cb(i,e){const t=this.cache,n=e.elements;if(n===void 0){if(un(t,e))return;i.uniformMatrix4fv(this.addr,!1,e),dn(t,e)}else{if(un(t,n))return;$h.set(n),i.uniformMatrix4fv(this.addr,!1,$h),dn(t,n)}}function lb(i,e){const t=this.cache;t[0]!==e&&(i.uniform1i(this.addr,e),t[0]=e)}function hb(i,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(i.uniform2i(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(un(t,e))return;i.uniform2iv(this.addr,e),dn(t,e)}}function ub(i,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(i.uniform3i(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else{if(un(t,e))return;i.uniform3iv(this.addr,e),dn(t,e)}}function db(i,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(i.uniform4i(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(un(t,e))return;i.uniform4iv(this.addr,e),dn(t,e)}}function fb(i,e){const t=this.cache;t[0]!==e&&(i.uniform1ui(this.addr,e),t[0]=e)}function pb(i,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(i.uniform2ui(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(un(t,e))return;i.uniform2uiv(this.addr,e),dn(t,e)}}function mb(i,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(i.uniform3ui(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else{if(un(t,e))return;i.uniform3uiv(this.addr,e),dn(t,e)}}function gb(i,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(i.uniform4ui(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(un(t,e))return;i.uniform4uiv(this.addr,e),dn(t,e)}}function bb(i,e,t){const n=this.cache,r=t.allocateTextureUnit();n[0]!==r&&(i.uniform1i(this.addr,r),n[0]=r);let s;this.type===i.SAMPLER_2D_SHADOW?(Qh.compareFunction=xd,s=Qh):s=Ld,t.setTexture2D(e||s,r)}function _b(i,e,t){const n=this.cache,r=t.allocateTextureUnit();n[0]!==r&&(i.uniform1i(this.addr,r),n[0]=r),t.setTexture3D(e||Id,r)}function xb(i,e,t){const n=this.cache,r=t.allocateTextureUnit();n[0]!==r&&(i.uniform1i(this.addr,r),n[0]=r),t.setTextureCube(e||Nd,r)}function vb(i,e,t){const n=this.cache,r=t.allocateTextureUnit();n[0]!==r&&(i.uniform1i(this.addr,r),n[0]=r),t.setTexture2DArray(e||Dd,r)}function yb(i){switch(i){case 5126:return nb;case 35664:return ib;case 35665:return rb;case 35666:return sb;case 35674:return ob;case 35675:return ab;case 35676:return cb;case 5124:case 35670:return lb;case 35667:case 35671:return hb;case 35668:case 35672:return ub;case 35669:case 35673:return db;case 5125:return fb;case 36294:return pb;case 36295:return mb;case 36296:return gb;case 35678:case 36198:case 36298:case 36306:case 35682:return bb;case 35679:case 36299:case 36307:return _b;case 35680:case 36300:case 36308:case 36293:return xb;case 36289:case 36303:case 36311:case 36292:return vb}}function Mb(i,e){i.uniform1fv(this.addr,e)}function Sb(i,e){const t=Ls(e,this.size,2);i.uniform2fv(this.addr,t)}function wb(i,e){const t=Ls(e,this.size,3);i.uniform3fv(this.addr,t)}function Eb(i,e){const t=Ls(e,this.size,4);i.uniform4fv(this.addr,t)}function Ab(i,e){const t=Ls(e,this.size,4);i.uniformMatrix2fv(this.addr,!1,t)}function Tb(i,e){const t=Ls(e,this.size,9);i.uniformMatrix3fv(this.addr,!1,t)}function Rb(i,e){const t=Ls(e,this.size,16);i.uniformMatrix4fv(this.addr,!1,t)}function Cb(i,e){i.uniform1iv(this.addr,e)}function Pb(i,e){i.uniform2iv(this.addr,e)}function Lb(i,e){i.uniform3iv(this.addr,e)}function Db(i,e){i.uniform4iv(this.addr,e)}function Ib(i,e){i.uniform1uiv(this.addr,e)}function Nb(i,e){i.uniform2uiv(this.addr,e)}function Fb(i,e){i.uniform3uiv(this.addr,e)}function Ub(i,e){i.uniform4uiv(this.addr,e)}function Ob(i,e,t){const n=this.cache,r=e.length,s=Ra(t,r);un(n,s)||(i.uniform1iv(this.addr,s),dn(n,s));for(let o=0;o!==r;++o)t.setTexture2D(e[o]||Ld,s[o])}function kb(i,e,t){const n=this.cache,r=e.length,s=Ra(t,r);un(n,s)||(i.uniform1iv(this.addr,s),dn(n,s));for(let o=0;o!==r;++o)t.setTexture3D(e[o]||Id,s[o])}function Bb(i,e,t){const n=this.cache,r=e.length,s=Ra(t,r);un(n,s)||(i.uniform1iv(this.addr,s),dn(n,s));for(let o=0;o!==r;++o)t.setTextureCube(e[o]||Nd,s[o])}function zb(i,e,t){const n=this.cache,r=e.length,s=Ra(t,r);un(n,s)||(i.uniform1iv(this.addr,s),dn(n,s));for(let o=0;o!==r;++o)t.setTexture2DArray(e[o]||Dd,s[o])}function Hb(i){switch(i){case 5126:return Mb;case 35664:return Sb;case 35665:return wb;case 35666:return Eb;case 35674:return Ab;case 35675:return Tb;case 35676:return Rb;case 5124:case 35670:return Cb;case 35667:case 35671:return Pb;case 35668:case 35672:return Lb;case 35669:case 35673:return Db;case 5125:return Ib;case 36294:return Nb;case 36295:return Fb;case 36296:return Ub;case 35678:case 36198:case 36298:case 36306:case 35682:return Ob;case 35679:case 36299:case 36307:return kb;case 35680:case 36300:case 36308:case 36293:return Bb;case 36289:case 36303:case 36311:case 36292:return zb}}class Vb{constructor(e,t,n){this.id=e,this.addr=n,this.cache=[],this.type=t.type,this.setValue=yb(t.type)}}class Gb{constructor(e,t,n){this.id=e,this.addr=n,this.cache=[],this.type=t.type,this.size=t.size,this.setValue=Hb(t.type)}}class Wb{constructor(e){this.id=e,this.seq=[],this.map={}}setValue(e,t,n){const r=this.seq;for(let s=0,o=r.length;s!==o;++s){const a=r[s];a.setValue(e,t[a.id],n)}}}const dc=/(\w+)(\])?(\[|\.)?/g;function eu(i,e){i.seq.push(e),i.map[e.id]=e}function qb(i,e,t){const n=i.name,r=n.length;for(dc.lastIndex=0;;){const s=dc.exec(n),o=dc.lastIndex;let a=s[1];const c=s[2]==="]",l=s[3];if(c&&(a=a|0),l===void 0||l==="["&&o+2===r){eu(t,l===void 0?new Vb(a,i,e):new Gb(a,i,e));break}else{let u=t.map[a];u===void 0&&(u=new Wb(a),eu(t,u)),t=u}}}class ca{constructor(e,t){this.seq=[],this.map={};const n=e.getProgramParameter(t,e.ACTIVE_UNIFORMS);for(let r=0;r<n;++r){const s=e.getActiveUniform(t,r),o=e.getUniformLocation(t,s.name);qb(s,o,this)}}setValue(e,t,n,r){const s=this.map[t];s!==void 0&&s.setValue(e,n,r)}setOptional(e,t,n){const r=t[n];r!==void 0&&this.setValue(e,n,r)}static upload(e,t,n,r){for(let s=0,o=t.length;s!==o;++s){const a=t[s],c=n[a.id];c.needsUpdate!==!1&&a.setValue(e,c.value,r)}}static seqWithValue(e,t){const n=[];for(let r=0,s=e.length;r!==s;++r){const o=e[r];o.id in t&&n.push(o)}return n}}function tu(i,e,t){const n=i.createShader(e);return i.shaderSource(n,t),i.compileShader(n),n}const jb=37297;let Xb=0;function Qb(i,e){const t=i.split(`
`),n=[],r=Math.max(e-6,0),s=Math.min(e+6,t.length);for(let o=r;o<s;o++){const a=o+1;n.push(`${a===e?">":" "} ${a}: ${t[o]}`)}return n.join(`
`)}const nu=new yt;function Kb(i){Ct._getMatrix(nu,Ct.workingColorSpace,i);const e=`mat3( ${nu.elements.map(t=>t.toFixed(4))} )`;switch(Ct.getTransfer(i)){case Ta:return[e,"LinearTransferOETF"];case jt:return[e,"sRGBTransferOETF"];default:return console.warn("THREE.WebGLProgram: Unsupported color space: ",i),[e,"LinearTransferOETF"]}}function iu(i,e,t){const n=i.getShaderParameter(e,i.COMPILE_STATUS),r=i.getShaderInfoLog(e).trim();if(n&&r==="")return"";const s=/ERROR: 0:(\d+)/.exec(r);if(s){const o=parseInt(s[1]);return t.toUpperCase()+`

`+r+`

`+Qb(i.getShaderSource(e),o)}else return r}function Yb(i,e){const t=Kb(e);return[`vec4 ${i}( vec4 value ) {`,`	return ${t[1]}( vec4( value.rgb * ${t[0]}, value.a ) );`,"}"].join(`
`)}function $b(i,e){let t;switch(e){case Zf:t="Linear";break;case Jf:t="Reinhard";break;case ep:t="Cineon";break;case sd:t="ACESFilmic";break;case np:t="AgX";break;case ip:t="Neutral";break;case tp:t="Custom";break;default:console.warn("THREE.WebGLProgram: Unsupported toneMapping:",e),t="Linear"}return"vec3 "+i+"( vec3 color ) { return "+t+"ToneMapping( color ); }"}const Oo=new A;function Zb(){Ct.getLuminanceCoefficients(Oo);const i=Oo.x.toFixed(4),e=Oo.y.toFixed(4),t=Oo.z.toFixed(4);return["float luminance( const in vec3 rgb ) {",`	const vec3 weights = vec3( ${i}, ${e}, ${t} );`,"	return dot( weights, rgb );","}"].join(`
`)}function Jb(i){return[i.extensionClipCullDistance?"#extension GL_ANGLE_clip_cull_distance : require":"",i.extensionMultiDraw?"#extension GL_ANGLE_multi_draw : require":""].filter($s).join(`
`)}function e_(i){const e=[];for(const t in i){const n=i[t];n!==!1&&e.push("#define "+t+" "+n)}return e.join(`
`)}function t_(i,e){const t={},n=i.getProgramParameter(e,i.ACTIVE_ATTRIBUTES);for(let r=0;r<n;r++){const s=i.getActiveAttrib(e,r),o=s.name;let a=1;s.type===i.FLOAT_MAT2&&(a=2),s.type===i.FLOAT_MAT3&&(a=3),s.type===i.FLOAT_MAT4&&(a=4),t[o]={type:s.type,location:i.getAttribLocation(e,o),locationSize:a}}return t}function $s(i){return i!==""}function ru(i,e){const t=e.numSpotLightShadows+e.numSpotLightMaps-e.numSpotLightShadowsWithMaps;return i.replace(/NUM_DIR_LIGHTS/g,e.numDirLights).replace(/NUM_SPOT_LIGHTS/g,e.numSpotLights).replace(/NUM_SPOT_LIGHT_MAPS/g,e.numSpotLightMaps).replace(/NUM_SPOT_LIGHT_COORDS/g,t).replace(/NUM_RECT_AREA_LIGHTS/g,e.numRectAreaLights).replace(/NUM_POINT_LIGHTS/g,e.numPointLights).replace(/NUM_HEMI_LIGHTS/g,e.numHemiLights).replace(/NUM_DIR_LIGHT_SHADOWS/g,e.numDirLightShadows).replace(/NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS/g,e.numSpotLightShadowsWithMaps).replace(/NUM_SPOT_LIGHT_SHADOWS/g,e.numSpotLightShadows).replace(/NUM_POINT_LIGHT_SHADOWS/g,e.numPointLightShadows)}function su(i,e){return i.replace(/NUM_CLIPPING_PLANES/g,e.numClippingPlanes).replace(/UNION_CLIPPING_PLANES/g,e.numClippingPlanes-e.numClipIntersection)}const n_=/^[ \t]*#include +<([\w\d./]+)>/gm;function Ml(i){return i.replace(n_,r_)}const i_=new Map;function r_(i,e){let t=vt[e];if(t===void 0){const n=i_.get(e);if(n!==void 0)t=vt[n],console.warn('THREE.WebGLRenderer: Shader chunk "%s" has been deprecated. Use "%s" instead.',e,n);else throw new Error("Can not resolve #include <"+e+">")}return Ml(t)}const s_=/#pragma unroll_loop_start\s+for\s*\(\s*int\s+i\s*=\s*(\d+)\s*;\s*i\s*<\s*(\d+)\s*;\s*i\s*\+\+\s*\)\s*{([\s\S]+?)}\s+#pragma unroll_loop_end/g;function ou(i){return i.replace(s_,o_)}function o_(i,e,t,n){let r="";for(let s=parseInt(e);s<parseInt(t);s++)r+=n.replace(/\[\s*i\s*\]/g,"[ "+s+" ]").replace(/UNROLLED_LOOP_INDEX/g,s);return r}function au(i){let e=`precision ${i.precision} float;
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
#define LOW_PRECISION`),e}function a_(i){let e="SHADOWMAP_TYPE_BASIC";return i.shadowMapType===nd?e="SHADOWMAP_TYPE_PCF":i.shadowMapType===id?e="SHADOWMAP_TYPE_PCF_SOFT":i.shadowMapType===Ii&&(e="SHADOWMAP_TYPE_VSM"),e}function c_(i){let e="ENVMAP_TYPE_CUBE";if(i.envMap)switch(i.envMapMode){case bs:case _s:e="ENVMAP_TYPE_CUBE";break;case Aa:e="ENVMAP_TYPE_CUBE_UV";break}return e}function l_(i){let e="ENVMAP_MODE_REFLECTION";return i.envMap&&i.envMapMode===_s&&(e="ENVMAP_MODE_REFRACTION"),e}function h_(i){let e="ENVMAP_BLENDING_NONE";if(i.envMap)switch(i.combine){case rd:e="ENVMAP_BLENDING_MULTIPLY";break;case Yf:e="ENVMAP_BLENDING_MIX";break;case $f:e="ENVMAP_BLENDING_ADD";break}return e}function u_(i){const e=i.envMapCubeUVHeight;if(e===null)return null;const t=Math.log2(e)-2,n=1/e;return{texelWidth:1/(3*Math.max(Math.pow(2,t),112)),texelHeight:n,maxMip:t}}function d_(i,e,t,n){const r=i.getContext(),s=t.defines;let o=t.vertexShader,a=t.fragmentShader;const c=a_(t),l=c_(t),h=l_(t),u=h_(t),d=u_(t),p=Jb(t),g=e_(s),b=r.createProgram();let m,f,M=t.glslVersion?"#version "+t.glslVersion+`
`:"";t.isRawShaderMaterial?(m=["#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,g].filter($s).join(`
`),m.length>0&&(m+=`
`),f=["#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,g].filter($s).join(`
`),f.length>0&&(f+=`
`)):(m=[au(t),"#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,g,t.extensionClipCullDistance?"#define USE_CLIP_DISTANCE":"",t.batching?"#define USE_BATCHING":"",t.batchingColor?"#define USE_BATCHING_COLOR":"",t.instancing?"#define USE_INSTANCING":"",t.instancingColor?"#define USE_INSTANCING_COLOR":"",t.instancingMorph?"#define USE_INSTANCING_MORPH":"",t.useFog&&t.fog?"#define USE_FOG":"",t.useFog&&t.fogExp2?"#define FOG_EXP2":"",t.map?"#define USE_MAP":"",t.envMap?"#define USE_ENVMAP":"",t.envMap?"#define "+h:"",t.lightMap?"#define USE_LIGHTMAP":"",t.aoMap?"#define USE_AOMAP":"",t.bumpMap?"#define USE_BUMPMAP":"",t.normalMap?"#define USE_NORMALMAP":"",t.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",t.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",t.displacementMap?"#define USE_DISPLACEMENTMAP":"",t.emissiveMap?"#define USE_EMISSIVEMAP":"",t.anisotropy?"#define USE_ANISOTROPY":"",t.anisotropyMap?"#define USE_ANISOTROPYMAP":"",t.clearcoatMap?"#define USE_CLEARCOATMAP":"",t.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",t.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",t.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",t.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",t.specularMap?"#define USE_SPECULARMAP":"",t.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",t.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",t.roughnessMap?"#define USE_ROUGHNESSMAP":"",t.metalnessMap?"#define USE_METALNESSMAP":"",t.alphaMap?"#define USE_ALPHAMAP":"",t.alphaHash?"#define USE_ALPHAHASH":"",t.transmission?"#define USE_TRANSMISSION":"",t.transmissionMap?"#define USE_TRANSMISSIONMAP":"",t.thicknessMap?"#define USE_THICKNESSMAP":"",t.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",t.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",t.mapUv?"#define MAP_UV "+t.mapUv:"",t.alphaMapUv?"#define ALPHAMAP_UV "+t.alphaMapUv:"",t.lightMapUv?"#define LIGHTMAP_UV "+t.lightMapUv:"",t.aoMapUv?"#define AOMAP_UV "+t.aoMapUv:"",t.emissiveMapUv?"#define EMISSIVEMAP_UV "+t.emissiveMapUv:"",t.bumpMapUv?"#define BUMPMAP_UV "+t.bumpMapUv:"",t.normalMapUv?"#define NORMALMAP_UV "+t.normalMapUv:"",t.displacementMapUv?"#define DISPLACEMENTMAP_UV "+t.displacementMapUv:"",t.metalnessMapUv?"#define METALNESSMAP_UV "+t.metalnessMapUv:"",t.roughnessMapUv?"#define ROUGHNESSMAP_UV "+t.roughnessMapUv:"",t.anisotropyMapUv?"#define ANISOTROPYMAP_UV "+t.anisotropyMapUv:"",t.clearcoatMapUv?"#define CLEARCOATMAP_UV "+t.clearcoatMapUv:"",t.clearcoatNormalMapUv?"#define CLEARCOAT_NORMALMAP_UV "+t.clearcoatNormalMapUv:"",t.clearcoatRoughnessMapUv?"#define CLEARCOAT_ROUGHNESSMAP_UV "+t.clearcoatRoughnessMapUv:"",t.iridescenceMapUv?"#define IRIDESCENCEMAP_UV "+t.iridescenceMapUv:"",t.iridescenceThicknessMapUv?"#define IRIDESCENCE_THICKNESSMAP_UV "+t.iridescenceThicknessMapUv:"",t.sheenColorMapUv?"#define SHEEN_COLORMAP_UV "+t.sheenColorMapUv:"",t.sheenRoughnessMapUv?"#define SHEEN_ROUGHNESSMAP_UV "+t.sheenRoughnessMapUv:"",t.specularMapUv?"#define SPECULARMAP_UV "+t.specularMapUv:"",t.specularColorMapUv?"#define SPECULAR_COLORMAP_UV "+t.specularColorMapUv:"",t.specularIntensityMapUv?"#define SPECULAR_INTENSITYMAP_UV "+t.specularIntensityMapUv:"",t.transmissionMapUv?"#define TRANSMISSIONMAP_UV "+t.transmissionMapUv:"",t.thicknessMapUv?"#define THICKNESSMAP_UV "+t.thicknessMapUv:"",t.vertexTangents&&t.flatShading===!1?"#define USE_TANGENT":"",t.vertexColors?"#define USE_COLOR":"",t.vertexAlphas?"#define USE_COLOR_ALPHA":"",t.vertexUv1s?"#define USE_UV1":"",t.vertexUv2s?"#define USE_UV2":"",t.vertexUv3s?"#define USE_UV3":"",t.pointsUvs?"#define USE_POINTS_UV":"",t.flatShading?"#define FLAT_SHADED":"",t.skinning?"#define USE_SKINNING":"",t.morphTargets?"#define USE_MORPHTARGETS":"",t.morphNormals&&t.flatShading===!1?"#define USE_MORPHNORMALS":"",t.morphColors?"#define USE_MORPHCOLORS":"",t.morphTargetsCount>0?"#define MORPHTARGETS_TEXTURE_STRIDE "+t.morphTextureStride:"",t.morphTargetsCount>0?"#define MORPHTARGETS_COUNT "+t.morphTargetsCount:"",t.doubleSided?"#define DOUBLE_SIDED":"",t.flipSided?"#define FLIP_SIDED":"",t.shadowMapEnabled?"#define USE_SHADOWMAP":"",t.shadowMapEnabled?"#define "+c:"",t.sizeAttenuation?"#define USE_SIZEATTENUATION":"",t.numLightProbes>0?"#define USE_LIGHT_PROBES":"",t.logarithmicDepthBuffer?"#define USE_LOGDEPTHBUF":"",t.reverseDepthBuffer?"#define USE_REVERSEDEPTHBUF":"","uniform mat4 modelMatrix;","uniform mat4 modelViewMatrix;","uniform mat4 projectionMatrix;","uniform mat4 viewMatrix;","uniform mat3 normalMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;","#ifdef USE_INSTANCING","	attribute mat4 instanceMatrix;","#endif","#ifdef USE_INSTANCING_COLOR","	attribute vec3 instanceColor;","#endif","#ifdef USE_INSTANCING_MORPH","	uniform sampler2D morphTexture;","#endif","attribute vec3 position;","attribute vec3 normal;","attribute vec2 uv;","#ifdef USE_UV1","	attribute vec2 uv1;","#endif","#ifdef USE_UV2","	attribute vec2 uv2;","#endif","#ifdef USE_UV3","	attribute vec2 uv3;","#endif","#ifdef USE_TANGENT","	attribute vec4 tangent;","#endif","#if defined( USE_COLOR_ALPHA )","	attribute vec4 color;","#elif defined( USE_COLOR )","	attribute vec3 color;","#endif","#ifdef USE_SKINNING","	attribute vec4 skinIndex;","	attribute vec4 skinWeight;","#endif",`
`].filter($s).join(`
`),f=[au(t),"#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,g,t.useFog&&t.fog?"#define USE_FOG":"",t.useFog&&t.fogExp2?"#define FOG_EXP2":"",t.alphaToCoverage?"#define ALPHA_TO_COVERAGE":"",t.map?"#define USE_MAP":"",t.matcap?"#define USE_MATCAP":"",t.envMap?"#define USE_ENVMAP":"",t.envMap?"#define "+l:"",t.envMap?"#define "+h:"",t.envMap?"#define "+u:"",d?"#define CUBEUV_TEXEL_WIDTH "+d.texelWidth:"",d?"#define CUBEUV_TEXEL_HEIGHT "+d.texelHeight:"",d?"#define CUBEUV_MAX_MIP "+d.maxMip+".0":"",t.lightMap?"#define USE_LIGHTMAP":"",t.aoMap?"#define USE_AOMAP":"",t.bumpMap?"#define USE_BUMPMAP":"",t.normalMap?"#define USE_NORMALMAP":"",t.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",t.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",t.emissiveMap?"#define USE_EMISSIVEMAP":"",t.anisotropy?"#define USE_ANISOTROPY":"",t.anisotropyMap?"#define USE_ANISOTROPYMAP":"",t.clearcoat?"#define USE_CLEARCOAT":"",t.clearcoatMap?"#define USE_CLEARCOATMAP":"",t.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",t.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",t.dispersion?"#define USE_DISPERSION":"",t.iridescence?"#define USE_IRIDESCENCE":"",t.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",t.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",t.specularMap?"#define USE_SPECULARMAP":"",t.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",t.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",t.roughnessMap?"#define USE_ROUGHNESSMAP":"",t.metalnessMap?"#define USE_METALNESSMAP":"",t.alphaMap?"#define USE_ALPHAMAP":"",t.alphaTest?"#define USE_ALPHATEST":"",t.alphaHash?"#define USE_ALPHAHASH":"",t.sheen?"#define USE_SHEEN":"",t.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",t.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",t.transmission?"#define USE_TRANSMISSION":"",t.transmissionMap?"#define USE_TRANSMISSIONMAP":"",t.thicknessMap?"#define USE_THICKNESSMAP":"",t.vertexTangents&&t.flatShading===!1?"#define USE_TANGENT":"",t.vertexColors||t.instancingColor||t.batchingColor?"#define USE_COLOR":"",t.vertexAlphas?"#define USE_COLOR_ALPHA":"",t.vertexUv1s?"#define USE_UV1":"",t.vertexUv2s?"#define USE_UV2":"",t.vertexUv3s?"#define USE_UV3":"",t.pointsUvs?"#define USE_POINTS_UV":"",t.gradientMap?"#define USE_GRADIENTMAP":"",t.flatShading?"#define FLAT_SHADED":"",t.doubleSided?"#define DOUBLE_SIDED":"",t.flipSided?"#define FLIP_SIDED":"",t.shadowMapEnabled?"#define USE_SHADOWMAP":"",t.shadowMapEnabled?"#define "+c:"",t.premultipliedAlpha?"#define PREMULTIPLIED_ALPHA":"",t.numLightProbes>0?"#define USE_LIGHT_PROBES":"",t.decodeVideoTexture?"#define DECODE_VIDEO_TEXTURE":"",t.decodeVideoTextureEmissive?"#define DECODE_VIDEO_TEXTURE_EMISSIVE":"",t.logarithmicDepthBuffer?"#define USE_LOGDEPTHBUF":"",t.reverseDepthBuffer?"#define USE_REVERSEDEPTHBUF":"","uniform mat4 viewMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;",t.toneMapping!==lr?"#define TONE_MAPPING":"",t.toneMapping!==lr?vt.tonemapping_pars_fragment:"",t.toneMapping!==lr?$b("toneMapping",t.toneMapping):"",t.dithering?"#define DITHERING":"",t.opaque?"#define OPAQUE":"",vt.colorspace_pars_fragment,Yb("linearToOutputTexel",t.outputColorSpace),Zb(),t.useDepthPacking?"#define DEPTH_PACKING "+t.depthPacking:"",`
`].filter($s).join(`
`)),o=Ml(o),o=ru(o,t),o=su(o,t),a=Ml(a),a=ru(a,t),a=su(a,t),o=ou(o),a=ou(a),t.isRawShaderMaterial!==!0&&(M=`#version 300 es
`,m=[p,"#define attribute in","#define varying out","#define texture2D texture"].join(`
`)+`
`+m,f=["#define varying in",t.glslVersion===vh?"":"layout(location = 0) out highp vec4 pc_fragColor;",t.glslVersion===vh?"":"#define gl_FragColor pc_fragColor","#define gl_FragDepthEXT gl_FragDepth","#define texture2D texture","#define textureCube texture","#define texture2DProj textureProj","#define texture2DLodEXT textureLod","#define texture2DProjLodEXT textureProjLod","#define textureCubeLodEXT textureLod","#define texture2DGradEXT textureGrad","#define texture2DProjGradEXT textureProjGrad","#define textureCubeGradEXT textureGrad"].join(`
`)+`
`+f);const x=M+m+o,_=M+f+a,I=tu(r,r.VERTEX_SHADER,x),R=tu(r,r.FRAGMENT_SHADER,_);r.attachShader(b,I),r.attachShader(b,R),t.index0AttributeName!==void 0?r.bindAttribLocation(b,0,t.index0AttributeName):t.morphTargets===!0&&r.bindAttribLocation(b,0,"position"),r.linkProgram(b);function T(P){if(i.debug.checkShaderErrors){const Q=r.getProgramInfoLog(b).trim(),G=r.getShaderInfoLog(I).trim(),ae=r.getShaderInfoLog(R).trim();let oe=!0,ne=!0;if(r.getProgramParameter(b,r.LINK_STATUS)===!1)if(oe=!1,typeof i.debug.onShaderError=="function")i.debug.onShaderError(r,b,I,R);else{const he=iu(r,I,"vertex"),L=iu(r,R,"fragment");console.error("THREE.WebGLProgram: Shader Error "+r.getError()+" - VALIDATE_STATUS "+r.getProgramParameter(b,r.VALIDATE_STATUS)+`

Material Name: `+P.name+`
Material Type: `+P.type+`

Program Info Log: `+Q+`
`+he+`
`+L)}else Q!==""?console.warn("THREE.WebGLProgram: Program Info Log:",Q):(G===""||ae==="")&&(ne=!1);ne&&(P.diagnostics={runnable:oe,programLog:Q,vertexShader:{log:G,prefix:m},fragmentShader:{log:ae,prefix:f}})}r.deleteShader(I),r.deleteShader(R),F=new ca(r,b),S=t_(r,b)}let F;this.getUniforms=function(){return F===void 0&&T(this),F};let S;this.getAttributes=function(){return S===void 0&&T(this),S};let v=t.rendererExtensionParallelShaderCompile===!1;return this.isReady=function(){return v===!1&&(v=r.getProgramParameter(b,jb)),v},this.destroy=function(){n.releaseStatesOfProgram(this),r.deleteProgram(b),this.program=void 0},this.type=t.shaderType,this.name=t.shaderName,this.id=Xb++,this.cacheKey=e,this.usedTimes=1,this.program=b,this.vertexShader=I,this.fragmentShader=R,this}let f_=0;class p_{constructor(){this.shaderCache=new Map,this.materialCache=new Map}update(e){const t=e.vertexShader,n=e.fragmentShader,r=this._getShaderStage(t),s=this._getShaderStage(n),o=this._getShaderCacheForMaterial(e);return o.has(r)===!1&&(o.add(r),r.usedTimes++),o.has(s)===!1&&(o.add(s),s.usedTimes++),this}remove(e){const t=this.materialCache.get(e);for(const n of t)n.usedTimes--,n.usedTimes===0&&this.shaderCache.delete(n.code);return this.materialCache.delete(e),this}getVertexShaderID(e){return this._getShaderStage(e.vertexShader).id}getFragmentShaderID(e){return this._getShaderStage(e.fragmentShader).id}dispose(){this.shaderCache.clear(),this.materialCache.clear()}_getShaderCacheForMaterial(e){const t=this.materialCache;let n=t.get(e);return n===void 0&&(n=new Set,t.set(e,n)),n}_getShaderStage(e){const t=this.shaderCache;let n=t.get(e);return n===void 0&&(n=new m_(e),t.set(e,n)),n}}class m_{constructor(e){this.id=f_++,this.code=e,this.usedTimes=0}}function g_(i,e,t,n,r,s,o){const a=new jl,c=new p_,l=new Set,h=[],u=r.logarithmicDepthBuffer,d=r.vertexTextures;let p=r.precision;const g={MeshDepthMaterial:"depth",MeshDistanceMaterial:"distanceRGBA",MeshNormalMaterial:"normal",MeshBasicMaterial:"basic",MeshLambertMaterial:"lambert",MeshPhongMaterial:"phong",MeshToonMaterial:"toon",MeshStandardMaterial:"physical",MeshPhysicalMaterial:"physical",MeshMatcapMaterial:"matcap",LineBasicMaterial:"basic",LineDashedMaterial:"dashed",PointsMaterial:"points",ShadowMaterial:"shadow",SpriteMaterial:"sprite"};function b(S){return l.add(S),S===0?"uv":`uv${S}`}function m(S,v,P,Q,G){const ae=Q.fog,oe=G.geometry,ne=S.isMeshStandardMaterial?Q.environment:null,he=(S.isMeshStandardMaterial?t:e).get(S.envMap||ne),L=he&&he.mapping===Aa?he.image.height:null,W=g[S.type];S.precision!==null&&(p=r.getMaxPrecision(S.precision),p!==S.precision&&console.warn("THREE.WebGLProgram.getParameters:",S.precision,"not supported, using",p,"instead."));const q=oe.morphAttributes.position||oe.morphAttributes.normal||oe.morphAttributes.color,j=q!==void 0?q.length:0;let ee=0;oe.morphAttributes.position!==void 0&&(ee=1),oe.morphAttributes.normal!==void 0&&(ee=2),oe.morphAttributes.color!==void 0&&(ee=3);let ue,X,re,xe;if(W){const Dt=_i[W];ue=Dt.vertexShader,X=Dt.fragmentShader}else ue=S.vertexShader,X=S.fragmentShader,c.update(S),re=c.getVertexShaderID(S),xe=c.getFragmentShaderID(S);const me=i.getRenderTarget(),Te=i.state.buffers.depth.getReversed(),ke=G.isInstancedMesh===!0,He=G.isBatchedMesh===!0,Ze=!!S.map,Ce=!!S.matcap,rt=!!he,N=!!S.aoMap,Ft=!!S.lightMap,pt=!!S.bumpMap,ct=!!S.normalMap,Ne=!!S.displacementMap,Ut=!!S.emissiveMap,it=!!S.metalnessMap,C=!!S.roughnessMap,y=S.anisotropy>0,Z=S.clearcoat>0,ge=S.dispersion>0,be=S.iridescence>0,fe=S.sheen>0,Je=S.transmission>0,Le=y&&!!S.anisotropyMap,Be=Z&&!!S.clearcoatMap,Rt=Z&&!!S.clearcoatNormalMap,Se=Z&&!!S.clearcoatRoughnessMap,ze=be&&!!S.iridescenceMap,et=be&&!!S.iridescenceThicknessMap,at=fe&&!!S.sheenColorMap,Ve=fe&&!!S.sheenRoughnessMap,Mt=!!S.specularMap,bt=!!S.specularColorMap,Lt=!!S.specularIntensityMap,O=Je&&!!S.transmissionMap,De=Je&&!!S.thicknessMap,le=!!S.gradientMap,_e=!!S.alphaMap,Fe=S.alphaTest>0,Ie=!!S.alphaHash,ft=!!S.extensions;let $t=lr;S.toneMapped&&(me===null||me.isXRRenderTarget===!0)&&($t=i.toneMapping);const fn={shaderID:W,shaderType:S.type,shaderName:S.name,vertexShader:ue,fragmentShader:X,defines:S.defines,customVertexShaderID:re,customFragmentShaderID:xe,isRawShaderMaterial:S.isRawShaderMaterial===!0,glslVersion:S.glslVersion,precision:p,batching:He,batchingColor:He&&G._colorsTexture!==null,instancing:ke,instancingColor:ke&&G.instanceColor!==null,instancingMorph:ke&&G.morphTexture!==null,supportsVertexTextures:d,outputColorSpace:me===null?i.outputColorSpace:me.isXRRenderTarget===!0?me.texture.colorSpace:Ln,alphaToCoverage:!!S.alphaToCoverage,map:Ze,matcap:Ce,envMap:rt,envMapMode:rt&&he.mapping,envMapCubeUVHeight:L,aoMap:N,lightMap:Ft,bumpMap:pt,normalMap:ct,displacementMap:d&&Ne,emissiveMap:Ut,normalMapObjectSpace:ct&&S.normalMapType===lp,normalMapTangentSpace:ct&&S.normalMapType===_d,metalnessMap:it,roughnessMap:C,anisotropy:y,anisotropyMap:Le,clearcoat:Z,clearcoatMap:Be,clearcoatNormalMap:Rt,clearcoatRoughnessMap:Se,dispersion:ge,iridescence:be,iridescenceMap:ze,iridescenceThicknessMap:et,sheen:fe,sheenColorMap:at,sheenRoughnessMap:Ve,specularMap:Mt,specularColorMap:bt,specularIntensityMap:Lt,transmission:Je,transmissionMap:O,thicknessMap:De,gradientMap:le,opaque:S.transparent===!1&&S.blending===as&&S.alphaToCoverage===!1,alphaMap:_e,alphaTest:Fe,alphaHash:Ie,combine:S.combine,mapUv:Ze&&b(S.map.channel),aoMapUv:N&&b(S.aoMap.channel),lightMapUv:Ft&&b(S.lightMap.channel),bumpMapUv:pt&&b(S.bumpMap.channel),normalMapUv:ct&&b(S.normalMap.channel),displacementMapUv:Ne&&b(S.displacementMap.channel),emissiveMapUv:Ut&&b(S.emissiveMap.channel),metalnessMapUv:it&&b(S.metalnessMap.channel),roughnessMapUv:C&&b(S.roughnessMap.channel),anisotropyMapUv:Le&&b(S.anisotropyMap.channel),clearcoatMapUv:Be&&b(S.clearcoatMap.channel),clearcoatNormalMapUv:Rt&&b(S.clearcoatNormalMap.channel),clearcoatRoughnessMapUv:Se&&b(S.clearcoatRoughnessMap.channel),iridescenceMapUv:ze&&b(S.iridescenceMap.channel),iridescenceThicknessMapUv:et&&b(S.iridescenceThicknessMap.channel),sheenColorMapUv:at&&b(S.sheenColorMap.channel),sheenRoughnessMapUv:Ve&&b(S.sheenRoughnessMap.channel),specularMapUv:Mt&&b(S.specularMap.channel),specularColorMapUv:bt&&b(S.specularColorMap.channel),specularIntensityMapUv:Lt&&b(S.specularIntensityMap.channel),transmissionMapUv:O&&b(S.transmissionMap.channel),thicknessMapUv:De&&b(S.thicknessMap.channel),alphaMapUv:_e&&b(S.alphaMap.channel),vertexTangents:!!oe.attributes.tangent&&(ct||y),vertexColors:S.vertexColors,vertexAlphas:S.vertexColors===!0&&!!oe.attributes.color&&oe.attributes.color.itemSize===4,pointsUvs:G.isPoints===!0&&!!oe.attributes.uv&&(Ze||_e),fog:!!ae,useFog:S.fog===!0,fogExp2:!!ae&&ae.isFogExp2,flatShading:S.flatShading===!0,sizeAttenuation:S.sizeAttenuation===!0,logarithmicDepthBuffer:u,reverseDepthBuffer:Te,skinning:G.isSkinnedMesh===!0,morphTargets:oe.morphAttributes.position!==void 0,morphNormals:oe.morphAttributes.normal!==void 0,morphColors:oe.morphAttributes.color!==void 0,morphTargetsCount:j,morphTextureStride:ee,numDirLights:v.directional.length,numPointLights:v.point.length,numSpotLights:v.spot.length,numSpotLightMaps:v.spotLightMap.length,numRectAreaLights:v.rectArea.length,numHemiLights:v.hemi.length,numDirLightShadows:v.directionalShadowMap.length,numPointLightShadows:v.pointShadowMap.length,numSpotLightShadows:v.spotShadowMap.length,numSpotLightShadowsWithMaps:v.numSpotLightShadowsWithMaps,numLightProbes:v.numLightProbes,numClippingPlanes:o.numPlanes,numClipIntersection:o.numIntersection,dithering:S.dithering,shadowMapEnabled:i.shadowMap.enabled&&P.length>0,shadowMapType:i.shadowMap.type,toneMapping:$t,decodeVideoTexture:Ze&&S.map.isVideoTexture===!0&&Ct.getTransfer(S.map.colorSpace)===jt,decodeVideoTextureEmissive:Ut&&S.emissiveMap.isVideoTexture===!0&&Ct.getTransfer(S.emissiveMap.colorSpace)===jt,premultipliedAlpha:S.premultipliedAlpha,doubleSided:S.side===xi,flipSided:S.side===Cn,useDepthPacking:S.depthPacking>=0,depthPacking:S.depthPacking||0,index0AttributeName:S.index0AttributeName,extensionClipCullDistance:ft&&S.extensions.clipCullDistance===!0&&n.has("WEBGL_clip_cull_distance"),extensionMultiDraw:(ft&&S.extensions.multiDraw===!0||He)&&n.has("WEBGL_multi_draw"),rendererExtensionParallelShaderCompile:n.has("KHR_parallel_shader_compile"),customProgramCacheKey:S.customProgramCacheKey()};return fn.vertexUv1s=l.has(1),fn.vertexUv2s=l.has(2),fn.vertexUv3s=l.has(3),l.clear(),fn}function f(S){const v=[];if(S.shaderID?v.push(S.shaderID):(v.push(S.customVertexShaderID),v.push(S.customFragmentShaderID)),S.defines!==void 0)for(const P in S.defines)v.push(P),v.push(S.defines[P]);return S.isRawShaderMaterial===!1&&(M(v,S),x(v,S),v.push(i.outputColorSpace)),v.push(S.customProgramCacheKey),v.join()}function M(S,v){S.push(v.precision),S.push(v.outputColorSpace),S.push(v.envMapMode),S.push(v.envMapCubeUVHeight),S.push(v.mapUv),S.push(v.alphaMapUv),S.push(v.lightMapUv),S.push(v.aoMapUv),S.push(v.bumpMapUv),S.push(v.normalMapUv),S.push(v.displacementMapUv),S.push(v.emissiveMapUv),S.push(v.metalnessMapUv),S.push(v.roughnessMapUv),S.push(v.anisotropyMapUv),S.push(v.clearcoatMapUv),S.push(v.clearcoatNormalMapUv),S.push(v.clearcoatRoughnessMapUv),S.push(v.iridescenceMapUv),S.push(v.iridescenceThicknessMapUv),S.push(v.sheenColorMapUv),S.push(v.sheenRoughnessMapUv),S.push(v.specularMapUv),S.push(v.specularColorMapUv),S.push(v.specularIntensityMapUv),S.push(v.transmissionMapUv),S.push(v.thicknessMapUv),S.push(v.combine),S.push(v.fogExp2),S.push(v.sizeAttenuation),S.push(v.morphTargetsCount),S.push(v.morphAttributeCount),S.push(v.numDirLights),S.push(v.numPointLights),S.push(v.numSpotLights),S.push(v.numSpotLightMaps),S.push(v.numHemiLights),S.push(v.numRectAreaLights),S.push(v.numDirLightShadows),S.push(v.numPointLightShadows),S.push(v.numSpotLightShadows),S.push(v.numSpotLightShadowsWithMaps),S.push(v.numLightProbes),S.push(v.shadowMapType),S.push(v.toneMapping),S.push(v.numClippingPlanes),S.push(v.numClipIntersection),S.push(v.depthPacking)}function x(S,v){a.disableAll(),v.supportsVertexTextures&&a.enable(0),v.instancing&&a.enable(1),v.instancingColor&&a.enable(2),v.instancingMorph&&a.enable(3),v.matcap&&a.enable(4),v.envMap&&a.enable(5),v.normalMapObjectSpace&&a.enable(6),v.normalMapTangentSpace&&a.enable(7),v.clearcoat&&a.enable(8),v.iridescence&&a.enable(9),v.alphaTest&&a.enable(10),v.vertexColors&&a.enable(11),v.vertexAlphas&&a.enable(12),v.vertexUv1s&&a.enable(13),v.vertexUv2s&&a.enable(14),v.vertexUv3s&&a.enable(15),v.vertexTangents&&a.enable(16),v.anisotropy&&a.enable(17),v.alphaHash&&a.enable(18),v.batching&&a.enable(19),v.dispersion&&a.enable(20),v.batchingColor&&a.enable(21),S.push(a.mask),a.disableAll(),v.fog&&a.enable(0),v.useFog&&a.enable(1),v.flatShading&&a.enable(2),v.logarithmicDepthBuffer&&a.enable(3),v.reverseDepthBuffer&&a.enable(4),v.skinning&&a.enable(5),v.morphTargets&&a.enable(6),v.morphNormals&&a.enable(7),v.morphColors&&a.enable(8),v.premultipliedAlpha&&a.enable(9),v.shadowMapEnabled&&a.enable(10),v.doubleSided&&a.enable(11),v.flipSided&&a.enable(12),v.useDepthPacking&&a.enable(13),v.dithering&&a.enable(14),v.transmission&&a.enable(15),v.sheen&&a.enable(16),v.opaque&&a.enable(17),v.pointsUvs&&a.enable(18),v.decodeVideoTexture&&a.enable(19),v.decodeVideoTextureEmissive&&a.enable(20),v.alphaToCoverage&&a.enable(21),S.push(a.mask)}function _(S){const v=g[S.type];let P;if(v){const Q=_i[v];P=Jp.clone(Q.uniforms)}else P=S.uniforms;return P}function I(S,v){let P;for(let Q=0,G=h.length;Q<G;Q++){const ae=h[Q];if(ae.cacheKey===v){P=ae,++P.usedTimes;break}}return P===void 0&&(P=new d_(i,v,S,s),h.push(P)),P}function R(S){if(--S.usedTimes===0){const v=h.indexOf(S);h[v]=h[h.length-1],h.pop(),S.destroy()}}function T(S){c.remove(S)}function F(){c.dispose()}return{getParameters:m,getProgramCacheKey:f,getUniforms:_,acquireProgram:I,releaseProgram:R,releaseShaderCache:T,programs:h,dispose:F}}function b_(){let i=new WeakMap;function e(o){return i.has(o)}function t(o){let a=i.get(o);return a===void 0&&(a={},i.set(o,a)),a}function n(o){i.delete(o)}function r(o,a,c){i.get(o)[a]=c}function s(){i=new WeakMap}return{has:e,get:t,remove:n,update:r,dispose:s}}function __(i,e){return i.groupOrder!==e.groupOrder?i.groupOrder-e.groupOrder:i.renderOrder!==e.renderOrder?i.renderOrder-e.renderOrder:i.material.id!==e.material.id?i.material.id-e.material.id:i.z!==e.z?i.z-e.z:i.id-e.id}function cu(i,e){return i.groupOrder!==e.groupOrder?i.groupOrder-e.groupOrder:i.renderOrder!==e.renderOrder?i.renderOrder-e.renderOrder:i.z!==e.z?e.z-i.z:i.id-e.id}function lu(){const i=[];let e=0;const t=[],n=[],r=[];function s(){e=0,t.length=0,n.length=0,r.length=0}function o(u,d,p,g,b,m){let f=i[e];return f===void 0?(f={id:u.id,object:u,geometry:d,material:p,groupOrder:g,renderOrder:u.renderOrder,z:b,group:m},i[e]=f):(f.id=u.id,f.object=u,f.geometry=d,f.material=p,f.groupOrder=g,f.renderOrder=u.renderOrder,f.z=b,f.group=m),e++,f}function a(u,d,p,g,b,m){const f=o(u,d,p,g,b,m);p.transmission>0?n.push(f):p.transparent===!0?r.push(f):t.push(f)}function c(u,d,p,g,b,m){const f=o(u,d,p,g,b,m);p.transmission>0?n.unshift(f):p.transparent===!0?r.unshift(f):t.unshift(f)}function l(u,d){t.length>1&&t.sort(u||__),n.length>1&&n.sort(d||cu),r.length>1&&r.sort(d||cu)}function h(){for(let u=e,d=i.length;u<d;u++){const p=i[u];if(p.id===null)break;p.id=null,p.object=null,p.geometry=null,p.material=null,p.group=null}}return{opaque:t,transmissive:n,transparent:r,init:s,push:a,unshift:c,finish:h,sort:l}}function x_(){let i=new WeakMap;function e(n,r){const s=i.get(n);let o;return s===void 0?(o=new lu,i.set(n,[o])):r>=s.length?(o=new lu,s.push(o)):o=s[r],o}function t(){i=new WeakMap}return{get:e,dispose:t}}function v_(){const i={};return{get:function(e){if(i[e.id]!==void 0)return i[e.id];let t;switch(e.type){case"DirectionalLight":t={direction:new A,color:new st};break;case"SpotLight":t={position:new A,direction:new A,color:new st,distance:0,coneCos:0,penumbraCos:0,decay:0};break;case"PointLight":t={position:new A,color:new st,distance:0,decay:0};break;case"HemisphereLight":t={direction:new A,skyColor:new st,groundColor:new st};break;case"RectAreaLight":t={color:new st,position:new A,halfWidth:new A,halfHeight:new A};break}return i[e.id]=t,t}}}function y_(){const i={};return{get:function(e){if(i[e.id]!==void 0)return i[e.id];let t;switch(e.type){case"DirectionalLight":t={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new ht};break;case"SpotLight":t={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new ht};break;case"PointLight":t={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new ht,shadowCameraNear:1,shadowCameraFar:1e3};break}return i[e.id]=t,t}}}let M_=0;function S_(i,e){return(e.castShadow?2:0)-(i.castShadow?2:0)+(e.map?1:0)-(i.map?1:0)}function w_(i){const e=new v_,t=y_(),n={version:0,hash:{directionalLength:-1,pointLength:-1,spotLength:-1,rectAreaLength:-1,hemiLength:-1,numDirectionalShadows:-1,numPointShadows:-1,numSpotShadows:-1,numSpotMaps:-1,numLightProbes:-1},ambient:[0,0,0],probe:[],directional:[],directionalShadow:[],directionalShadowMap:[],directionalShadowMatrix:[],spot:[],spotLightMap:[],spotShadow:[],spotShadowMap:[],spotLightMatrix:[],rectArea:[],rectAreaLTC1:null,rectAreaLTC2:null,point:[],pointShadow:[],pointShadowMap:[],pointShadowMatrix:[],hemi:[],numSpotLightShadowsWithMaps:0,numLightProbes:0};for(let l=0;l<9;l++)n.probe.push(new A);const r=new A,s=new ot,o=new ot;function a(l){let h=0,u=0,d=0;for(let S=0;S<9;S++)n.probe[S].set(0,0,0);let p=0,g=0,b=0,m=0,f=0,M=0,x=0,_=0,I=0,R=0,T=0;l.sort(S_);for(let S=0,v=l.length;S<v;S++){const P=l[S],Q=P.color,G=P.intensity,ae=P.distance,oe=P.shadow&&P.shadow.map?P.shadow.map.texture:null;if(P.isAmbientLight)h+=Q.r*G,u+=Q.g*G,d+=Q.b*G;else if(P.isLightProbe){for(let ne=0;ne<9;ne++)n.probe[ne].addScaledVector(P.sh.coefficients[ne],G);T++}else if(P.isDirectionalLight){const ne=e.get(P);if(ne.color.copy(P.color).multiplyScalar(P.intensity),P.castShadow){const he=P.shadow,L=t.get(P);L.shadowIntensity=he.intensity,L.shadowBias=he.bias,L.shadowNormalBias=he.normalBias,L.shadowRadius=he.radius,L.shadowMapSize=he.mapSize,n.directionalShadow[p]=L,n.directionalShadowMap[p]=oe,n.directionalShadowMatrix[p]=P.shadow.matrix,M++}n.directional[p]=ne,p++}else if(P.isSpotLight){const ne=e.get(P);ne.position.setFromMatrixPosition(P.matrixWorld),ne.color.copy(Q).multiplyScalar(G),ne.distance=ae,ne.coneCos=Math.cos(P.angle),ne.penumbraCos=Math.cos(P.angle*(1-P.penumbra)),ne.decay=P.decay,n.spot[b]=ne;const he=P.shadow;if(P.map&&(n.spotLightMap[I]=P.map,I++,he.updateMatrices(P),P.castShadow&&R++),n.spotLightMatrix[b]=he.matrix,P.castShadow){const L=t.get(P);L.shadowIntensity=he.intensity,L.shadowBias=he.bias,L.shadowNormalBias=he.normalBias,L.shadowRadius=he.radius,L.shadowMapSize=he.mapSize,n.spotShadow[b]=L,n.spotShadowMap[b]=oe,_++}b++}else if(P.isRectAreaLight){const ne=e.get(P);ne.color.copy(Q).multiplyScalar(G),ne.halfWidth.set(P.width*.5,0,0),ne.halfHeight.set(0,P.height*.5,0),n.rectArea[m]=ne,m++}else if(P.isPointLight){const ne=e.get(P);if(ne.color.copy(P.color).multiplyScalar(P.intensity),ne.distance=P.distance,ne.decay=P.decay,P.castShadow){const he=P.shadow,L=t.get(P);L.shadowIntensity=he.intensity,L.shadowBias=he.bias,L.shadowNormalBias=he.normalBias,L.shadowRadius=he.radius,L.shadowMapSize=he.mapSize,L.shadowCameraNear=he.camera.near,L.shadowCameraFar=he.camera.far,n.pointShadow[g]=L,n.pointShadowMap[g]=oe,n.pointShadowMatrix[g]=P.shadow.matrix,x++}n.point[g]=ne,g++}else if(P.isHemisphereLight){const ne=e.get(P);ne.skyColor.copy(P.color).multiplyScalar(G),ne.groundColor.copy(P.groundColor).multiplyScalar(G),n.hemi[f]=ne,f++}}m>0&&(i.has("OES_texture_float_linear")===!0?(n.rectAreaLTC1=Pe.LTC_FLOAT_1,n.rectAreaLTC2=Pe.LTC_FLOAT_2):(n.rectAreaLTC1=Pe.LTC_HALF_1,n.rectAreaLTC2=Pe.LTC_HALF_2)),n.ambient[0]=h,n.ambient[1]=u,n.ambient[2]=d;const F=n.hash;(F.directionalLength!==p||F.pointLength!==g||F.spotLength!==b||F.rectAreaLength!==m||F.hemiLength!==f||F.numDirectionalShadows!==M||F.numPointShadows!==x||F.numSpotShadows!==_||F.numSpotMaps!==I||F.numLightProbes!==T)&&(n.directional.length=p,n.spot.length=b,n.rectArea.length=m,n.point.length=g,n.hemi.length=f,n.directionalShadow.length=M,n.directionalShadowMap.length=M,n.pointShadow.length=x,n.pointShadowMap.length=x,n.spotShadow.length=_,n.spotShadowMap.length=_,n.directionalShadowMatrix.length=M,n.pointShadowMatrix.length=x,n.spotLightMatrix.length=_+I-R,n.spotLightMap.length=I,n.numSpotLightShadowsWithMaps=R,n.numLightProbes=T,F.directionalLength=p,F.pointLength=g,F.spotLength=b,F.rectAreaLength=m,F.hemiLength=f,F.numDirectionalShadows=M,F.numPointShadows=x,F.numSpotShadows=_,F.numSpotMaps=I,F.numLightProbes=T,n.version=M_++)}function c(l,h){let u=0,d=0,p=0,g=0,b=0;const m=h.matrixWorldInverse;for(let f=0,M=l.length;f<M;f++){const x=l[f];if(x.isDirectionalLight){const _=n.directional[u];_.direction.setFromMatrixPosition(x.matrixWorld),r.setFromMatrixPosition(x.target.matrixWorld),_.direction.sub(r),_.direction.transformDirection(m),u++}else if(x.isSpotLight){const _=n.spot[p];_.position.setFromMatrixPosition(x.matrixWorld),_.position.applyMatrix4(m),_.direction.setFromMatrixPosition(x.matrixWorld),r.setFromMatrixPosition(x.target.matrixWorld),_.direction.sub(r),_.direction.transformDirection(m),p++}else if(x.isRectAreaLight){const _=n.rectArea[g];_.position.setFromMatrixPosition(x.matrixWorld),_.position.applyMatrix4(m),o.identity(),s.copy(x.matrixWorld),s.premultiply(m),o.extractRotation(s),_.halfWidth.set(x.width*.5,0,0),_.halfHeight.set(0,x.height*.5,0),_.halfWidth.applyMatrix4(o),_.halfHeight.applyMatrix4(o),g++}else if(x.isPointLight){const _=n.point[d];_.position.setFromMatrixPosition(x.matrixWorld),_.position.applyMatrix4(m),d++}else if(x.isHemisphereLight){const _=n.hemi[b];_.direction.setFromMatrixPosition(x.matrixWorld),_.direction.transformDirection(m),b++}}}return{setup:a,setupView:c,state:n}}function hu(i){const e=new w_(i),t=[],n=[];function r(h){l.camera=h,t.length=0,n.length=0}function s(h){t.push(h)}function o(h){n.push(h)}function a(){e.setup(t)}function c(h){e.setupView(t,h)}const l={lightsArray:t,shadowsArray:n,camera:null,lights:e,transmissionRenderTarget:{}};return{init:r,state:l,setupLights:a,setupLightsView:c,pushLight:s,pushShadow:o}}function E_(i){let e=new WeakMap;function t(r,s=0){const o=e.get(r);let a;return o===void 0?(a=new hu(i),e.set(r,[a])):s>=o.length?(a=new hu(i),o.push(a)):a=o[s],a}function n(){e=new WeakMap}return{get:t,dispose:n}}class A_ extends di{static get type(){return"MeshDepthMaterial"}constructor(e){super(),this.isMeshDepthMaterial=!0,this.depthPacking=ap,this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.wireframe=!1,this.wireframeLinewidth=1,this.setValues(e)}copy(e){return super.copy(e),this.depthPacking=e.depthPacking,this.map=e.map,this.alphaMap=e.alphaMap,this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this}}class T_ extends di{static get type(){return"MeshDistanceMaterial"}constructor(e){super(),this.isMeshDistanceMaterial=!0,this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.setValues(e)}copy(e){return super.copy(e),this.map=e.map,this.alphaMap=e.alphaMap,this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this}}const R_=`void main() {
	gl_Position = vec4( position, 1.0 );
}`,C_=`uniform sampler2D shadow_pass;
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
}`;function P_(i,e,t){let n=new Xl;const r=new ht,s=new ht,o=new mt,a=new A_({depthPacking:cp}),c=new T_,l={},h=t.maxTextureSize,u={[Wi]:Cn,[Cn]:Wi,[xi]:xi},d=new dr({defines:{VSM_SAMPLES:8},uniforms:{shadow_pass:{value:null},resolution:{value:new ht},radius:{value:4}},vertexShader:R_,fragmentShader:C_}),p=d.clone();p.defines.HORIZONTAL_PASS=1;const g=new Mi;g.setAttribute("position",new wn(new Float32Array([-1,-1,.5,3,-1,.5,-1,3,.5]),3));const b=new Xt(g,d),m=this;this.enabled=!1,this.autoUpdate=!0,this.needsUpdate=!1,this.type=nd;let f=this.type;this.render=function(R,T,F){if(m.enabled===!1||m.autoUpdate===!1&&m.needsUpdate===!1||R.length===0)return;const S=i.getRenderTarget(),v=i.getActiveCubeFace(),P=i.getActiveMipmapLevel(),Q=i.state;Q.setBlending(cr),Q.buffers.color.setClear(1,1,1,1),Q.buffers.depth.setTest(!0),Q.setScissorTest(!1);const G=f!==Ii&&this.type===Ii,ae=f===Ii&&this.type!==Ii;for(let oe=0,ne=R.length;oe<ne;oe++){const he=R[oe],L=he.shadow;if(L===void 0){console.warn("THREE.WebGLShadowMap:",he,"has no shadow.");continue}if(L.autoUpdate===!1&&L.needsUpdate===!1)continue;r.copy(L.mapSize);const W=L.getFrameExtents();if(r.multiply(W),s.copy(L.mapSize),(r.x>h||r.y>h)&&(r.x>h&&(s.x=Math.floor(h/W.x),r.x=s.x*W.x,L.mapSize.x=s.x),r.y>h&&(s.y=Math.floor(h/W.y),r.y=s.y*W.y,L.mapSize.y=s.y)),L.map===null||G===!0||ae===!0){const j=this.type!==Ii?{minFilter:Pn,magFilter:Pn}:{};L.map!==null&&L.map.dispose(),L.map=new ur(r.x,r.y,j),L.map.texture.name=he.name+".shadowMap",L.camera.updateProjectionMatrix()}i.setRenderTarget(L.map),i.clear();const q=L.getViewportCount();for(let j=0;j<q;j++){const ee=L.getViewport(j);o.set(s.x*ee.x,s.y*ee.y,s.x*ee.z,s.y*ee.w),Q.viewport(o),L.updateMatrices(he,j),n=L.getFrustum(),_(T,F,L.camera,he,this.type)}L.isPointLightShadow!==!0&&this.type===Ii&&M(L,F),L.needsUpdate=!1}f=this.type,m.needsUpdate=!1,i.setRenderTarget(S,v,P)};function M(R,T){const F=e.update(b);d.defines.VSM_SAMPLES!==R.blurSamples&&(d.defines.VSM_SAMPLES=R.blurSamples,p.defines.VSM_SAMPLES=R.blurSamples,d.needsUpdate=!0,p.needsUpdate=!0),R.mapPass===null&&(R.mapPass=new ur(r.x,r.y)),d.uniforms.shadow_pass.value=R.map.texture,d.uniforms.resolution.value=R.mapSize,d.uniforms.radius.value=R.radius,i.setRenderTarget(R.mapPass),i.clear(),i.renderBufferDirect(T,null,F,d,b,null),p.uniforms.shadow_pass.value=R.mapPass.texture,p.uniforms.resolution.value=R.mapSize,p.uniforms.radius.value=R.radius,i.setRenderTarget(R.map),i.clear(),i.renderBufferDirect(T,null,F,p,b,null)}function x(R,T,F,S){let v=null;const P=F.isPointLight===!0?R.customDistanceMaterial:R.customDepthMaterial;if(P!==void 0)v=P;else if(v=F.isPointLight===!0?c:a,i.localClippingEnabled&&T.clipShadows===!0&&Array.isArray(T.clippingPlanes)&&T.clippingPlanes.length!==0||T.displacementMap&&T.displacementScale!==0||T.alphaMap&&T.alphaTest>0||T.map&&T.alphaTest>0){const Q=v.uuid,G=T.uuid;let ae=l[Q];ae===void 0&&(ae={},l[Q]=ae);let oe=ae[G];oe===void 0&&(oe=v.clone(),ae[G]=oe,T.addEventListener("dispose",I)),v=oe}if(v.visible=T.visible,v.wireframe=T.wireframe,S===Ii?v.side=T.shadowSide!==null?T.shadowSide:T.side:v.side=T.shadowSide!==null?T.shadowSide:u[T.side],v.alphaMap=T.alphaMap,v.alphaTest=T.alphaTest,v.map=T.map,v.clipShadows=T.clipShadows,v.clippingPlanes=T.clippingPlanes,v.clipIntersection=T.clipIntersection,v.displacementMap=T.displacementMap,v.displacementScale=T.displacementScale,v.displacementBias=T.displacementBias,v.wireframeLinewidth=T.wireframeLinewidth,v.linewidth=T.linewidth,F.isPointLight===!0&&v.isMeshDistanceMaterial===!0){const Q=i.properties.get(v);Q.light=F}return v}function _(R,T,F,S,v){if(R.visible===!1)return;if(R.layers.test(T.layers)&&(R.isMesh||R.isLine||R.isPoints)&&(R.castShadow||R.receiveShadow&&v===Ii)&&(!R.frustumCulled||n.intersectsObject(R))){R.modelViewMatrix.multiplyMatrices(F.matrixWorldInverse,R.matrixWorld);const G=e.update(R),ae=R.material;if(Array.isArray(ae)){const oe=G.groups;for(let ne=0,he=oe.length;ne<he;ne++){const L=oe[ne],W=ae[L.materialIndex];if(W&&W.visible){const q=x(R,W,S,v);R.onBeforeShadow(i,R,T,F,G,q,L),i.renderBufferDirect(F,null,G,q,R,L),R.onAfterShadow(i,R,T,F,G,q,L)}}}else if(ae.visible){const oe=x(R,ae,S,v);R.onBeforeShadow(i,R,T,F,G,oe,null),i.renderBufferDirect(F,null,G,oe,R,null),R.onAfterShadow(i,R,T,F,G,oe,null)}}const Q=R.children;for(let G=0,ae=Q.length;G<ae;G++)_(Q[G],T,F,S,v)}function I(R){R.target.removeEventListener("dispose",I);for(const F in l){const S=l[F],v=R.target.uuid;v in S&&(S[v].dispose(),delete S[v])}}}const L_={[kc]:Bc,[zc]:Gc,[Hc]:Wc,[gs]:Vc,[Bc]:kc,[Gc]:zc,[Wc]:Hc,[Vc]:gs};function D_(i,e){function t(){let O=!1;const De=new mt;let le=null;const _e=new mt(0,0,0,0);return{setMask:function(Fe){le!==Fe&&!O&&(i.colorMask(Fe,Fe,Fe,Fe),le=Fe)},setLocked:function(Fe){O=Fe},setClear:function(Fe,Ie,ft,$t,fn){fn===!0&&(Fe*=$t,Ie*=$t,ft*=$t),De.set(Fe,Ie,ft,$t),_e.equals(De)===!1&&(i.clearColor(Fe,Ie,ft,$t),_e.copy(De))},reset:function(){O=!1,le=null,_e.set(-1,0,0,0)}}}function n(){let O=!1,De=!1,le=null,_e=null,Fe=null;return{setReversed:function(Ie){if(De!==Ie){const ft=e.get("EXT_clip_control");De?ft.clipControlEXT(ft.LOWER_LEFT_EXT,ft.ZERO_TO_ONE_EXT):ft.clipControlEXT(ft.LOWER_LEFT_EXT,ft.NEGATIVE_ONE_TO_ONE_EXT);const $t=Fe;Fe=null,this.setClear($t)}De=Ie},getReversed:function(){return De},setTest:function(Ie){Ie?me(i.DEPTH_TEST):Te(i.DEPTH_TEST)},setMask:function(Ie){le!==Ie&&!O&&(i.depthMask(Ie),le=Ie)},setFunc:function(Ie){if(De&&(Ie=L_[Ie]),_e!==Ie){switch(Ie){case kc:i.depthFunc(i.NEVER);break;case Bc:i.depthFunc(i.ALWAYS);break;case zc:i.depthFunc(i.LESS);break;case gs:i.depthFunc(i.LEQUAL);break;case Hc:i.depthFunc(i.EQUAL);break;case Vc:i.depthFunc(i.GEQUAL);break;case Gc:i.depthFunc(i.GREATER);break;case Wc:i.depthFunc(i.NOTEQUAL);break;default:i.depthFunc(i.LEQUAL)}_e=Ie}},setLocked:function(Ie){O=Ie},setClear:function(Ie){Fe!==Ie&&(De&&(Ie=1-Ie),i.clearDepth(Ie),Fe=Ie)},reset:function(){O=!1,le=null,_e=null,Fe=null,De=!1}}}function r(){let O=!1,De=null,le=null,_e=null,Fe=null,Ie=null,ft=null,$t=null,fn=null;return{setTest:function(Dt){O||(Dt?me(i.STENCIL_TEST):Te(i.STENCIL_TEST))},setMask:function(Dt){De!==Dt&&!O&&(i.stencilMask(Dt),De=Dt)},setFunc:function(Dt,Dn,Xn){(le!==Dt||_e!==Dn||Fe!==Xn)&&(i.stencilFunc(Dt,Dn,Xn),le=Dt,_e=Dn,Fe=Xn)},setOp:function(Dt,Dn,Xn){(Ie!==Dt||ft!==Dn||$t!==Xn)&&(i.stencilOp(Dt,Dn,Xn),Ie=Dt,ft=Dn,$t=Xn)},setLocked:function(Dt){O=Dt},setClear:function(Dt){fn!==Dt&&(i.clearStencil(Dt),fn=Dt)},reset:function(){O=!1,De=null,le=null,_e=null,Fe=null,Ie=null,ft=null,$t=null,fn=null}}}const s=new t,o=new n,a=new r,c=new WeakMap,l=new WeakMap;let h={},u={},d=new WeakMap,p=[],g=null,b=!1,m=null,f=null,M=null,x=null,_=null,I=null,R=null,T=new st(0,0,0),F=0,S=!1,v=null,P=null,Q=null,G=null,ae=null;const oe=i.getParameter(i.MAX_COMBINED_TEXTURE_IMAGE_UNITS);let ne=!1,he=0;const L=i.getParameter(i.VERSION);L.indexOf("WebGL")!==-1?(he=parseFloat(/^WebGL (\d)/.exec(L)[1]),ne=he>=1):L.indexOf("OpenGL ES")!==-1&&(he=parseFloat(/^OpenGL ES (\d)/.exec(L)[1]),ne=he>=2);let W=null,q={};const j=i.getParameter(i.SCISSOR_BOX),ee=i.getParameter(i.VIEWPORT),ue=new mt().fromArray(j),X=new mt().fromArray(ee);function re(O,De,le,_e){const Fe=new Uint8Array(4),Ie=i.createTexture();i.bindTexture(O,Ie),i.texParameteri(O,i.TEXTURE_MIN_FILTER,i.NEAREST),i.texParameteri(O,i.TEXTURE_MAG_FILTER,i.NEAREST);for(let ft=0;ft<le;ft++)O===i.TEXTURE_3D||O===i.TEXTURE_2D_ARRAY?i.texImage3D(De,0,i.RGBA,1,1,_e,0,i.RGBA,i.UNSIGNED_BYTE,Fe):i.texImage2D(De+ft,0,i.RGBA,1,1,0,i.RGBA,i.UNSIGNED_BYTE,Fe);return Ie}const xe={};xe[i.TEXTURE_2D]=re(i.TEXTURE_2D,i.TEXTURE_2D,1),xe[i.TEXTURE_CUBE_MAP]=re(i.TEXTURE_CUBE_MAP,i.TEXTURE_CUBE_MAP_POSITIVE_X,6),xe[i.TEXTURE_2D_ARRAY]=re(i.TEXTURE_2D_ARRAY,i.TEXTURE_2D_ARRAY,1,1),xe[i.TEXTURE_3D]=re(i.TEXTURE_3D,i.TEXTURE_3D,1,1),s.setClear(0,0,0,1),o.setClear(1),a.setClear(0),me(i.DEPTH_TEST),o.setFunc(gs),pt(!1),ct(uh),me(i.CULL_FACE),N(cr);function me(O){h[O]!==!0&&(i.enable(O),h[O]=!0)}function Te(O){h[O]!==!1&&(i.disable(O),h[O]=!1)}function ke(O,De){return u[O]!==De?(i.bindFramebuffer(O,De),u[O]=De,O===i.DRAW_FRAMEBUFFER&&(u[i.FRAMEBUFFER]=De),O===i.FRAMEBUFFER&&(u[i.DRAW_FRAMEBUFFER]=De),!0):!1}function He(O,De){let le=p,_e=!1;if(O){le=d.get(De),le===void 0&&(le=[],d.set(De,le));const Fe=O.textures;if(le.length!==Fe.length||le[0]!==i.COLOR_ATTACHMENT0){for(let Ie=0,ft=Fe.length;Ie<ft;Ie++)le[Ie]=i.COLOR_ATTACHMENT0+Ie;le.length=Fe.length,_e=!0}}else le[0]!==i.BACK&&(le[0]=i.BACK,_e=!0);_e&&i.drawBuffers(le)}function Ze(O){return g!==O?(i.useProgram(O),g=O,!0):!1}const Ce={[Cr]:i.FUNC_ADD,[If]:i.FUNC_SUBTRACT,[Nf]:i.FUNC_REVERSE_SUBTRACT};Ce[Ff]=i.MIN,Ce[Uf]=i.MAX;const rt={[Of]:i.ZERO,[kf]:i.ONE,[Bf]:i.SRC_COLOR,[Uc]:i.SRC_ALPHA,[qf]:i.SRC_ALPHA_SATURATE,[Gf]:i.DST_COLOR,[Hf]:i.DST_ALPHA,[zf]:i.ONE_MINUS_SRC_COLOR,[Oc]:i.ONE_MINUS_SRC_ALPHA,[Wf]:i.ONE_MINUS_DST_COLOR,[Vf]:i.ONE_MINUS_DST_ALPHA,[jf]:i.CONSTANT_COLOR,[Xf]:i.ONE_MINUS_CONSTANT_COLOR,[Qf]:i.CONSTANT_ALPHA,[Kf]:i.ONE_MINUS_CONSTANT_ALPHA};function N(O,De,le,_e,Fe,Ie,ft,$t,fn,Dt){if(O===cr){b===!0&&(Te(i.BLEND),b=!1);return}if(b===!1&&(me(i.BLEND),b=!0),O!==Df){if(O!==m||Dt!==S){if((f!==Cr||_!==Cr)&&(i.blendEquation(i.FUNC_ADD),f=Cr,_=Cr),Dt)switch(O){case as:i.blendFuncSeparate(i.ONE,i.ONE_MINUS_SRC_ALPHA,i.ONE,i.ONE_MINUS_SRC_ALPHA);break;case dh:i.blendFunc(i.ONE,i.ONE);break;case fh:i.blendFuncSeparate(i.ZERO,i.ONE_MINUS_SRC_COLOR,i.ZERO,i.ONE);break;case ph:i.blendFuncSeparate(i.ZERO,i.SRC_COLOR,i.ZERO,i.SRC_ALPHA);break;default:console.error("THREE.WebGLState: Invalid blending: ",O);break}else switch(O){case as:i.blendFuncSeparate(i.SRC_ALPHA,i.ONE_MINUS_SRC_ALPHA,i.ONE,i.ONE_MINUS_SRC_ALPHA);break;case dh:i.blendFunc(i.SRC_ALPHA,i.ONE);break;case fh:i.blendFuncSeparate(i.ZERO,i.ONE_MINUS_SRC_COLOR,i.ZERO,i.ONE);break;case ph:i.blendFunc(i.ZERO,i.SRC_COLOR);break;default:console.error("THREE.WebGLState: Invalid blending: ",O);break}M=null,x=null,I=null,R=null,T.set(0,0,0),F=0,m=O,S=Dt}return}Fe=Fe||De,Ie=Ie||le,ft=ft||_e,(De!==f||Fe!==_)&&(i.blendEquationSeparate(Ce[De],Ce[Fe]),f=De,_=Fe),(le!==M||_e!==x||Ie!==I||ft!==R)&&(i.blendFuncSeparate(rt[le],rt[_e],rt[Ie],rt[ft]),M=le,x=_e,I=Ie,R=ft),($t.equals(T)===!1||fn!==F)&&(i.blendColor($t.r,$t.g,$t.b,fn),T.copy($t),F=fn),m=O,S=!1}function Ft(O,De){O.side===xi?Te(i.CULL_FACE):me(i.CULL_FACE);let le=O.side===Cn;De&&(le=!le),pt(le),O.blending===as&&O.transparent===!1?N(cr):N(O.blending,O.blendEquation,O.blendSrc,O.blendDst,O.blendEquationAlpha,O.blendSrcAlpha,O.blendDstAlpha,O.blendColor,O.blendAlpha,O.premultipliedAlpha),o.setFunc(O.depthFunc),o.setTest(O.depthTest),o.setMask(O.depthWrite),s.setMask(O.colorWrite);const _e=O.stencilWrite;a.setTest(_e),_e&&(a.setMask(O.stencilWriteMask),a.setFunc(O.stencilFunc,O.stencilRef,O.stencilFuncMask),a.setOp(O.stencilFail,O.stencilZFail,O.stencilZPass)),Ut(O.polygonOffset,O.polygonOffsetFactor,O.polygonOffsetUnits),O.alphaToCoverage===!0?me(i.SAMPLE_ALPHA_TO_COVERAGE):Te(i.SAMPLE_ALPHA_TO_COVERAGE)}function pt(O){v!==O&&(O?i.frontFace(i.CW):i.frontFace(i.CCW),v=O)}function ct(O){O!==Pf?(me(i.CULL_FACE),O!==P&&(O===uh?i.cullFace(i.BACK):O===Lf?i.cullFace(i.FRONT):i.cullFace(i.FRONT_AND_BACK))):Te(i.CULL_FACE),P=O}function Ne(O){O!==Q&&(ne&&i.lineWidth(O),Q=O)}function Ut(O,De,le){O?(me(i.POLYGON_OFFSET_FILL),(G!==De||ae!==le)&&(i.polygonOffset(De,le),G=De,ae=le)):Te(i.POLYGON_OFFSET_FILL)}function it(O){O?me(i.SCISSOR_TEST):Te(i.SCISSOR_TEST)}function C(O){O===void 0&&(O=i.TEXTURE0+oe-1),W!==O&&(i.activeTexture(O),W=O)}function y(O,De,le){le===void 0&&(W===null?le=i.TEXTURE0+oe-1:le=W);let _e=q[le];_e===void 0&&(_e={type:void 0,texture:void 0},q[le]=_e),(_e.type!==O||_e.texture!==De)&&(W!==le&&(i.activeTexture(le),W=le),i.bindTexture(O,De||xe[O]),_e.type=O,_e.texture=De)}function Z(){const O=q[W];O!==void 0&&O.type!==void 0&&(i.bindTexture(O.type,null),O.type=void 0,O.texture=void 0)}function ge(){try{i.compressedTexImage2D.apply(i,arguments)}catch(O){console.error("THREE.WebGLState:",O)}}function be(){try{i.compressedTexImage3D.apply(i,arguments)}catch(O){console.error("THREE.WebGLState:",O)}}function fe(){try{i.texSubImage2D.apply(i,arguments)}catch(O){console.error("THREE.WebGLState:",O)}}function Je(){try{i.texSubImage3D.apply(i,arguments)}catch(O){console.error("THREE.WebGLState:",O)}}function Le(){try{i.compressedTexSubImage2D.apply(i,arguments)}catch(O){console.error("THREE.WebGLState:",O)}}function Be(){try{i.compressedTexSubImage3D.apply(i,arguments)}catch(O){console.error("THREE.WebGLState:",O)}}function Rt(){try{i.texStorage2D.apply(i,arguments)}catch(O){console.error("THREE.WebGLState:",O)}}function Se(){try{i.texStorage3D.apply(i,arguments)}catch(O){console.error("THREE.WebGLState:",O)}}function ze(){try{i.texImage2D.apply(i,arguments)}catch(O){console.error("THREE.WebGLState:",O)}}function et(){try{i.texImage3D.apply(i,arguments)}catch(O){console.error("THREE.WebGLState:",O)}}function at(O){ue.equals(O)===!1&&(i.scissor(O.x,O.y,O.z,O.w),ue.copy(O))}function Ve(O){X.equals(O)===!1&&(i.viewport(O.x,O.y,O.z,O.w),X.copy(O))}function Mt(O,De){let le=l.get(De);le===void 0&&(le=new WeakMap,l.set(De,le));let _e=le.get(O);_e===void 0&&(_e=i.getUniformBlockIndex(De,O.name),le.set(O,_e))}function bt(O,De){const _e=l.get(De).get(O);c.get(De)!==_e&&(i.uniformBlockBinding(De,_e,O.__bindingPointIndex),c.set(De,_e))}function Lt(){i.disable(i.BLEND),i.disable(i.CULL_FACE),i.disable(i.DEPTH_TEST),i.disable(i.POLYGON_OFFSET_FILL),i.disable(i.SCISSOR_TEST),i.disable(i.STENCIL_TEST),i.disable(i.SAMPLE_ALPHA_TO_COVERAGE),i.blendEquation(i.FUNC_ADD),i.blendFunc(i.ONE,i.ZERO),i.blendFuncSeparate(i.ONE,i.ZERO,i.ONE,i.ZERO),i.blendColor(0,0,0,0),i.colorMask(!0,!0,!0,!0),i.clearColor(0,0,0,0),i.depthMask(!0),i.depthFunc(i.LESS),o.setReversed(!1),i.clearDepth(1),i.stencilMask(4294967295),i.stencilFunc(i.ALWAYS,0,4294967295),i.stencilOp(i.KEEP,i.KEEP,i.KEEP),i.clearStencil(0),i.cullFace(i.BACK),i.frontFace(i.CCW),i.polygonOffset(0,0),i.activeTexture(i.TEXTURE0),i.bindFramebuffer(i.FRAMEBUFFER,null),i.bindFramebuffer(i.DRAW_FRAMEBUFFER,null),i.bindFramebuffer(i.READ_FRAMEBUFFER,null),i.useProgram(null),i.lineWidth(1),i.scissor(0,0,i.canvas.width,i.canvas.height),i.viewport(0,0,i.canvas.width,i.canvas.height),h={},W=null,q={},u={},d=new WeakMap,p=[],g=null,b=!1,m=null,f=null,M=null,x=null,_=null,I=null,R=null,T=new st(0,0,0),F=0,S=!1,v=null,P=null,Q=null,G=null,ae=null,ue.set(0,0,i.canvas.width,i.canvas.height),X.set(0,0,i.canvas.width,i.canvas.height),s.reset(),o.reset(),a.reset()}return{buffers:{color:s,depth:o,stencil:a},enable:me,disable:Te,bindFramebuffer:ke,drawBuffers:He,useProgram:Ze,setBlending:N,setMaterial:Ft,setFlipSided:pt,setCullFace:ct,setLineWidth:Ne,setPolygonOffset:Ut,setScissorTest:it,activeTexture:C,bindTexture:y,unbindTexture:Z,compressedTexImage2D:ge,compressedTexImage3D:be,texImage2D:ze,texImage3D:et,updateUBOMapping:Mt,uniformBlockBinding:bt,texStorage2D:Rt,texStorage3D:Se,texSubImage2D:fe,texSubImage3D:Je,compressedTexSubImage2D:Le,compressedTexSubImage3D:Be,scissor:at,viewport:Ve,reset:Lt}}function uu(i,e,t,n){const r=I_(n);switch(t){case ud:return i*e;case fd:return i*e;case pd:return i*e*2;case Hl:return i*e/r.components*r.byteLength;case Vl:return i*e/r.components*r.byteLength;case md:return i*e*2/r.components*r.byteLength;case Gl:return i*e*2/r.components*r.byteLength;case dd:return i*e*3/r.components*r.byteLength;case ei:return i*e*4/r.components*r.byteLength;case Wl:return i*e*4/r.components*r.byteLength;case ia:case ra:return Math.floor((i+3)/4)*Math.floor((e+3)/4)*8;case sa:case oa:return Math.floor((i+3)/4)*Math.floor((e+3)/4)*16;case Qc:case Yc:return Math.max(i,16)*Math.max(e,8)/4;case Xc:case Kc:return Math.max(i,8)*Math.max(e,8)/2;case $c:case Zc:return Math.floor((i+3)/4)*Math.floor((e+3)/4)*8;case Jc:return Math.floor((i+3)/4)*Math.floor((e+3)/4)*16;case el:return Math.floor((i+3)/4)*Math.floor((e+3)/4)*16;case tl:return Math.floor((i+4)/5)*Math.floor((e+3)/4)*16;case nl:return Math.floor((i+4)/5)*Math.floor((e+4)/5)*16;case il:return Math.floor((i+5)/6)*Math.floor((e+4)/5)*16;case rl:return Math.floor((i+5)/6)*Math.floor((e+5)/6)*16;case sl:return Math.floor((i+7)/8)*Math.floor((e+4)/5)*16;case ol:return Math.floor((i+7)/8)*Math.floor((e+5)/6)*16;case al:return Math.floor((i+7)/8)*Math.floor((e+7)/8)*16;case cl:return Math.floor((i+9)/10)*Math.floor((e+4)/5)*16;case ll:return Math.floor((i+9)/10)*Math.floor((e+5)/6)*16;case hl:return Math.floor((i+9)/10)*Math.floor((e+7)/8)*16;case ul:return Math.floor((i+9)/10)*Math.floor((e+9)/10)*16;case dl:return Math.floor((i+11)/12)*Math.floor((e+9)/10)*16;case fl:return Math.floor((i+11)/12)*Math.floor((e+11)/12)*16;case aa:case pl:case ml:return Math.ceil(i/4)*Math.ceil(e/4)*16;case gd:case gl:return Math.ceil(i/4)*Math.ceil(e/4)*8;case bl:case _l:return Math.ceil(i/4)*Math.ceil(e/4)*16}throw new Error(`Unable to determine texture byte length for ${t} format.`)}function I_(i){switch(i){case qi:case cd:return{byteLength:1,components:1};case io:case ld:case ho:return{byteLength:2,components:1};case Bl:case zl:return{byteLength:2,components:4};case Nr:case kl:case li:return{byteLength:4,components:1};case hd:return{byteLength:4,components:3}}throw new Error(`Unknown texture type ${i}.`)}function N_(i,e,t,n,r,s,o){const a=e.has("WEBGL_multisampled_render_to_texture")?e.get("WEBGL_multisampled_render_to_texture"):null,c=typeof navigator>"u"?!1:/OculusBrowser/g.test(navigator.userAgent),l=new ht,h=new WeakMap;let u;const d=new WeakMap;let p=!1;try{p=typeof OffscreenCanvas<"u"&&new OffscreenCanvas(1,1).getContext("2d")!==null}catch{}function g(C,y){return p?new OffscreenCanvas(C,y):oo("canvas")}function b(C,y,Z){let ge=1;const be=it(C);if((be.width>Z||be.height>Z)&&(ge=Z/Math.max(be.width,be.height)),ge<1)if(typeof HTMLImageElement<"u"&&C instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&C instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&C instanceof ImageBitmap||typeof VideoFrame<"u"&&C instanceof VideoFrame){const fe=Math.floor(ge*be.width),Je=Math.floor(ge*be.height);u===void 0&&(u=g(fe,Je));const Le=y?g(fe,Je):u;return Le.width=fe,Le.height=Je,Le.getContext("2d").drawImage(C,0,0,fe,Je),console.warn("THREE.WebGLRenderer: Texture has been resized from ("+be.width+"x"+be.height+") to ("+fe+"x"+Je+")."),Le}else return"data"in C&&console.warn("THREE.WebGLRenderer: Image in DataTexture is too big ("+be.width+"x"+be.height+")."),C;return C}function m(C){return C.generateMipmaps}function f(C){i.generateMipmap(C)}function M(C){return C.isWebGLCubeRenderTarget?i.TEXTURE_CUBE_MAP:C.isWebGL3DRenderTarget?i.TEXTURE_3D:C.isWebGLArrayRenderTarget||C.isCompressedArrayTexture?i.TEXTURE_2D_ARRAY:i.TEXTURE_2D}function x(C,y,Z,ge,be=!1){if(C!==null){if(i[C]!==void 0)return i[C];console.warn("THREE.WebGLRenderer: Attempt to use non-existing WebGL internal format '"+C+"'")}let fe=y;if(y===i.RED&&(Z===i.FLOAT&&(fe=i.R32F),Z===i.HALF_FLOAT&&(fe=i.R16F),Z===i.UNSIGNED_BYTE&&(fe=i.R8)),y===i.RED_INTEGER&&(Z===i.UNSIGNED_BYTE&&(fe=i.R8UI),Z===i.UNSIGNED_SHORT&&(fe=i.R16UI),Z===i.UNSIGNED_INT&&(fe=i.R32UI),Z===i.BYTE&&(fe=i.R8I),Z===i.SHORT&&(fe=i.R16I),Z===i.INT&&(fe=i.R32I)),y===i.RG&&(Z===i.FLOAT&&(fe=i.RG32F),Z===i.HALF_FLOAT&&(fe=i.RG16F),Z===i.UNSIGNED_BYTE&&(fe=i.RG8)),y===i.RG_INTEGER&&(Z===i.UNSIGNED_BYTE&&(fe=i.RG8UI),Z===i.UNSIGNED_SHORT&&(fe=i.RG16UI),Z===i.UNSIGNED_INT&&(fe=i.RG32UI),Z===i.BYTE&&(fe=i.RG8I),Z===i.SHORT&&(fe=i.RG16I),Z===i.INT&&(fe=i.RG32I)),y===i.RGB_INTEGER&&(Z===i.UNSIGNED_BYTE&&(fe=i.RGB8UI),Z===i.UNSIGNED_SHORT&&(fe=i.RGB16UI),Z===i.UNSIGNED_INT&&(fe=i.RGB32UI),Z===i.BYTE&&(fe=i.RGB8I),Z===i.SHORT&&(fe=i.RGB16I),Z===i.INT&&(fe=i.RGB32I)),y===i.RGBA_INTEGER&&(Z===i.UNSIGNED_BYTE&&(fe=i.RGBA8UI),Z===i.UNSIGNED_SHORT&&(fe=i.RGBA16UI),Z===i.UNSIGNED_INT&&(fe=i.RGBA32UI),Z===i.BYTE&&(fe=i.RGBA8I),Z===i.SHORT&&(fe=i.RGBA16I),Z===i.INT&&(fe=i.RGBA32I)),y===i.RGB&&Z===i.UNSIGNED_INT_5_9_9_9_REV&&(fe=i.RGB9_E5),y===i.RGBA){const Je=be?Ta:Ct.getTransfer(ge);Z===i.FLOAT&&(fe=i.RGBA32F),Z===i.HALF_FLOAT&&(fe=i.RGBA16F),Z===i.UNSIGNED_BYTE&&(fe=Je===jt?i.SRGB8_ALPHA8:i.RGBA8),Z===i.UNSIGNED_SHORT_4_4_4_4&&(fe=i.RGBA4),Z===i.UNSIGNED_SHORT_5_5_5_1&&(fe=i.RGB5_A1)}return(fe===i.R16F||fe===i.R32F||fe===i.RG16F||fe===i.RG32F||fe===i.RGBA16F||fe===i.RGBA32F)&&e.get("EXT_color_buffer_float"),fe}function _(C,y){let Z;return C?y===null||y===Nr||y===vs?Z=i.DEPTH24_STENCIL8:y===li?Z=i.DEPTH32F_STENCIL8:y===io&&(Z=i.DEPTH24_STENCIL8,console.warn("DepthTexture: 16 bit depth attachment is not supported with stencil. Using 24-bit attachment.")):y===null||y===Nr||y===vs?Z=i.DEPTH_COMPONENT24:y===li?Z=i.DEPTH_COMPONENT32F:y===io&&(Z=i.DEPTH_COMPONENT16),Z}function I(C,y){return m(C)===!0||C.isFramebufferTexture&&C.minFilter!==Pn&&C.minFilter!==jn?Math.log2(Math.max(y.width,y.height))+1:C.mipmaps!==void 0&&C.mipmaps.length>0?C.mipmaps.length:C.isCompressedTexture&&Array.isArray(C.image)?y.mipmaps.length:1}function R(C){const y=C.target;y.removeEventListener("dispose",R),F(y),y.isVideoTexture&&h.delete(y)}function T(C){const y=C.target;y.removeEventListener("dispose",T),v(y)}function F(C){const y=n.get(C);if(y.__webglInit===void 0)return;const Z=C.source,ge=d.get(Z);if(ge){const be=ge[y.__cacheKey];be.usedTimes--,be.usedTimes===0&&S(C),Object.keys(ge).length===0&&d.delete(Z)}n.remove(C)}function S(C){const y=n.get(C);i.deleteTexture(y.__webglTexture);const Z=C.source,ge=d.get(Z);delete ge[y.__cacheKey],o.memory.textures--}function v(C){const y=n.get(C);if(C.depthTexture&&(C.depthTexture.dispose(),n.remove(C.depthTexture)),C.isWebGLCubeRenderTarget)for(let ge=0;ge<6;ge++){if(Array.isArray(y.__webglFramebuffer[ge]))for(let be=0;be<y.__webglFramebuffer[ge].length;be++)i.deleteFramebuffer(y.__webglFramebuffer[ge][be]);else i.deleteFramebuffer(y.__webglFramebuffer[ge]);y.__webglDepthbuffer&&i.deleteRenderbuffer(y.__webglDepthbuffer[ge])}else{if(Array.isArray(y.__webglFramebuffer))for(let ge=0;ge<y.__webglFramebuffer.length;ge++)i.deleteFramebuffer(y.__webglFramebuffer[ge]);else i.deleteFramebuffer(y.__webglFramebuffer);if(y.__webglDepthbuffer&&i.deleteRenderbuffer(y.__webglDepthbuffer),y.__webglMultisampledFramebuffer&&i.deleteFramebuffer(y.__webglMultisampledFramebuffer),y.__webglColorRenderbuffer)for(let ge=0;ge<y.__webglColorRenderbuffer.length;ge++)y.__webglColorRenderbuffer[ge]&&i.deleteRenderbuffer(y.__webglColorRenderbuffer[ge]);y.__webglDepthRenderbuffer&&i.deleteRenderbuffer(y.__webglDepthRenderbuffer)}const Z=C.textures;for(let ge=0,be=Z.length;ge<be;ge++){const fe=n.get(Z[ge]);fe.__webglTexture&&(i.deleteTexture(fe.__webglTexture),o.memory.textures--),n.remove(Z[ge])}n.remove(C)}let P=0;function Q(){P=0}function G(){const C=P;return C>=r.maxTextures&&console.warn("THREE.WebGLTextures: Trying to use "+C+" texture units while this GPU supports only "+r.maxTextures),P+=1,C}function ae(C){const y=[];return y.push(C.wrapS),y.push(C.wrapT),y.push(C.wrapR||0),y.push(C.magFilter),y.push(C.minFilter),y.push(C.anisotropy),y.push(C.internalFormat),y.push(C.format),y.push(C.type),y.push(C.generateMipmaps),y.push(C.premultiplyAlpha),y.push(C.flipY),y.push(C.unpackAlignment),y.push(C.colorSpace),y.join()}function oe(C,y){const Z=n.get(C);if(C.isVideoTexture&&Ne(C),C.isRenderTargetTexture===!1&&C.version>0&&Z.__version!==C.version){const ge=C.image;if(ge===null)console.warn("THREE.WebGLRenderer: Texture marked for update but no image data found.");else if(ge.complete===!1)console.warn("THREE.WebGLRenderer: Texture marked for update but image is incomplete");else{X(Z,C,y);return}}t.bindTexture(i.TEXTURE_2D,Z.__webglTexture,i.TEXTURE0+y)}function ne(C,y){const Z=n.get(C);if(C.version>0&&Z.__version!==C.version){X(Z,C,y);return}t.bindTexture(i.TEXTURE_2D_ARRAY,Z.__webglTexture,i.TEXTURE0+y)}function he(C,y){const Z=n.get(C);if(C.version>0&&Z.__version!==C.version){X(Z,C,y);return}t.bindTexture(i.TEXTURE_3D,Z.__webglTexture,i.TEXTURE0+y)}function L(C,y){const Z=n.get(C);if(C.version>0&&Z.__version!==C.version){re(Z,C,y);return}t.bindTexture(i.TEXTURE_CUBE_MAP,Z.__webglTexture,i.TEXTURE0+y)}const W={[xs]:i.REPEAT,[or]:i.CLAMP_TO_EDGE,[ma]:i.MIRRORED_REPEAT},q={[Pn]:i.NEAREST,[ad]:i.NEAREST_MIPMAP_NEAREST,[Ks]:i.NEAREST_MIPMAP_LINEAR,[jn]:i.LINEAR,[na]:i.LINEAR_MIPMAP_NEAREST,[Oi]:i.LINEAR_MIPMAP_LINEAR},j={[hp]:i.NEVER,[gp]:i.ALWAYS,[up]:i.LESS,[xd]:i.LEQUAL,[dp]:i.EQUAL,[mp]:i.GEQUAL,[fp]:i.GREATER,[pp]:i.NOTEQUAL};function ee(C,y){if(y.type===li&&e.has("OES_texture_float_linear")===!1&&(y.magFilter===jn||y.magFilter===na||y.magFilter===Ks||y.magFilter===Oi||y.minFilter===jn||y.minFilter===na||y.minFilter===Ks||y.minFilter===Oi)&&console.warn("THREE.WebGLRenderer: Unable to use linear filtering with floating point textures. OES_texture_float_linear not supported on this device."),i.texParameteri(C,i.TEXTURE_WRAP_S,W[y.wrapS]),i.texParameteri(C,i.TEXTURE_WRAP_T,W[y.wrapT]),(C===i.TEXTURE_3D||C===i.TEXTURE_2D_ARRAY)&&i.texParameteri(C,i.TEXTURE_WRAP_R,W[y.wrapR]),i.texParameteri(C,i.TEXTURE_MAG_FILTER,q[y.magFilter]),i.texParameteri(C,i.TEXTURE_MIN_FILTER,q[y.minFilter]),y.compareFunction&&(i.texParameteri(C,i.TEXTURE_COMPARE_MODE,i.COMPARE_REF_TO_TEXTURE),i.texParameteri(C,i.TEXTURE_COMPARE_FUNC,j[y.compareFunction])),e.has("EXT_texture_filter_anisotropic")===!0){if(y.magFilter===Pn||y.minFilter!==Ks&&y.minFilter!==Oi||y.type===li&&e.has("OES_texture_float_linear")===!1)return;if(y.anisotropy>1||n.get(y).__currentAnisotropy){const Z=e.get("EXT_texture_filter_anisotropic");i.texParameterf(C,Z.TEXTURE_MAX_ANISOTROPY_EXT,Math.min(y.anisotropy,r.getMaxAnisotropy())),n.get(y).__currentAnisotropy=y.anisotropy}}}function ue(C,y){let Z=!1;C.__webglInit===void 0&&(C.__webglInit=!0,y.addEventListener("dispose",R));const ge=y.source;let be=d.get(ge);be===void 0&&(be={},d.set(ge,be));const fe=ae(y);if(fe!==C.__cacheKey){be[fe]===void 0&&(be[fe]={texture:i.createTexture(),usedTimes:0},o.memory.textures++,Z=!0),be[fe].usedTimes++;const Je=be[C.__cacheKey];Je!==void 0&&(be[C.__cacheKey].usedTimes--,Je.usedTimes===0&&S(y)),C.__cacheKey=fe,C.__webglTexture=be[fe].texture}return Z}function X(C,y,Z){let ge=i.TEXTURE_2D;(y.isDataArrayTexture||y.isCompressedArrayTexture)&&(ge=i.TEXTURE_2D_ARRAY),y.isData3DTexture&&(ge=i.TEXTURE_3D);const be=ue(C,y),fe=y.source;t.bindTexture(ge,C.__webglTexture,i.TEXTURE0+Z);const Je=n.get(fe);if(fe.version!==Je.__version||be===!0){t.activeTexture(i.TEXTURE0+Z);const Le=Ct.getPrimaries(Ct.workingColorSpace),Be=y.colorSpace===rr?null:Ct.getPrimaries(y.colorSpace),Rt=y.colorSpace===rr||Le===Be?i.NONE:i.BROWSER_DEFAULT_WEBGL;i.pixelStorei(i.UNPACK_FLIP_Y_WEBGL,y.flipY),i.pixelStorei(i.UNPACK_PREMULTIPLY_ALPHA_WEBGL,y.premultiplyAlpha),i.pixelStorei(i.UNPACK_ALIGNMENT,y.unpackAlignment),i.pixelStorei(i.UNPACK_COLORSPACE_CONVERSION_WEBGL,Rt);let Se=b(y.image,!1,r.maxTextureSize);Se=Ut(y,Se);const ze=s.convert(y.format,y.colorSpace),et=s.convert(y.type);let at=x(y.internalFormat,ze,et,y.colorSpace,y.isVideoTexture);ee(ge,y);let Ve;const Mt=y.mipmaps,bt=y.isVideoTexture!==!0,Lt=Je.__version===void 0||be===!0,O=fe.dataReady,De=I(y,Se);if(y.isDepthTexture)at=_(y.format===ys,y.type),Lt&&(bt?t.texStorage2D(i.TEXTURE_2D,1,at,Se.width,Se.height):t.texImage2D(i.TEXTURE_2D,0,at,Se.width,Se.height,0,ze,et,null));else if(y.isDataTexture)if(Mt.length>0){bt&&Lt&&t.texStorage2D(i.TEXTURE_2D,De,at,Mt[0].width,Mt[0].height);for(let le=0,_e=Mt.length;le<_e;le++)Ve=Mt[le],bt?O&&t.texSubImage2D(i.TEXTURE_2D,le,0,0,Ve.width,Ve.height,ze,et,Ve.data):t.texImage2D(i.TEXTURE_2D,le,at,Ve.width,Ve.height,0,ze,et,Ve.data);y.generateMipmaps=!1}else bt?(Lt&&t.texStorage2D(i.TEXTURE_2D,De,at,Se.width,Se.height),O&&t.texSubImage2D(i.TEXTURE_2D,0,0,0,Se.width,Se.height,ze,et,Se.data)):t.texImage2D(i.TEXTURE_2D,0,at,Se.width,Se.height,0,ze,et,Se.data);else if(y.isCompressedTexture)if(y.isCompressedArrayTexture){bt&&Lt&&t.texStorage3D(i.TEXTURE_2D_ARRAY,De,at,Mt[0].width,Mt[0].height,Se.depth);for(let le=0,_e=Mt.length;le<_e;le++)if(Ve=Mt[le],y.format!==ei)if(ze!==null)if(bt){if(O)if(y.layerUpdates.size>0){const Fe=uu(Ve.width,Ve.height,y.format,y.type);for(const Ie of y.layerUpdates){const ft=Ve.data.subarray(Ie*Fe/Ve.data.BYTES_PER_ELEMENT,(Ie+1)*Fe/Ve.data.BYTES_PER_ELEMENT);t.compressedTexSubImage3D(i.TEXTURE_2D_ARRAY,le,0,0,Ie,Ve.width,Ve.height,1,ze,ft)}y.clearLayerUpdates()}else t.compressedTexSubImage3D(i.TEXTURE_2D_ARRAY,le,0,0,0,Ve.width,Ve.height,Se.depth,ze,Ve.data)}else t.compressedTexImage3D(i.TEXTURE_2D_ARRAY,le,at,Ve.width,Ve.height,Se.depth,0,Ve.data,0,0);else console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()");else bt?O&&t.texSubImage3D(i.TEXTURE_2D_ARRAY,le,0,0,0,Ve.width,Ve.height,Se.depth,ze,et,Ve.data):t.texImage3D(i.TEXTURE_2D_ARRAY,le,at,Ve.width,Ve.height,Se.depth,0,ze,et,Ve.data)}else{bt&&Lt&&t.texStorage2D(i.TEXTURE_2D,De,at,Mt[0].width,Mt[0].height);for(let le=0,_e=Mt.length;le<_e;le++)Ve=Mt[le],y.format!==ei?ze!==null?bt?O&&t.compressedTexSubImage2D(i.TEXTURE_2D,le,0,0,Ve.width,Ve.height,ze,Ve.data):t.compressedTexImage2D(i.TEXTURE_2D,le,at,Ve.width,Ve.height,0,Ve.data):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()"):bt?O&&t.texSubImage2D(i.TEXTURE_2D,le,0,0,Ve.width,Ve.height,ze,et,Ve.data):t.texImage2D(i.TEXTURE_2D,le,at,Ve.width,Ve.height,0,ze,et,Ve.data)}else if(y.isDataArrayTexture)if(bt){if(Lt&&t.texStorage3D(i.TEXTURE_2D_ARRAY,De,at,Se.width,Se.height,Se.depth),O)if(y.layerUpdates.size>0){const le=uu(Se.width,Se.height,y.format,y.type);for(const _e of y.layerUpdates){const Fe=Se.data.subarray(_e*le/Se.data.BYTES_PER_ELEMENT,(_e+1)*le/Se.data.BYTES_PER_ELEMENT);t.texSubImage3D(i.TEXTURE_2D_ARRAY,0,0,0,_e,Se.width,Se.height,1,ze,et,Fe)}y.clearLayerUpdates()}else t.texSubImage3D(i.TEXTURE_2D_ARRAY,0,0,0,0,Se.width,Se.height,Se.depth,ze,et,Se.data)}else t.texImage3D(i.TEXTURE_2D_ARRAY,0,at,Se.width,Se.height,Se.depth,0,ze,et,Se.data);else if(y.isData3DTexture)bt?(Lt&&t.texStorage3D(i.TEXTURE_3D,De,at,Se.width,Se.height,Se.depth),O&&t.texSubImage3D(i.TEXTURE_3D,0,0,0,0,Se.width,Se.height,Se.depth,ze,et,Se.data)):t.texImage3D(i.TEXTURE_3D,0,at,Se.width,Se.height,Se.depth,0,ze,et,Se.data);else if(y.isFramebufferTexture){if(Lt)if(bt)t.texStorage2D(i.TEXTURE_2D,De,at,Se.width,Se.height);else{let le=Se.width,_e=Se.height;for(let Fe=0;Fe<De;Fe++)t.texImage2D(i.TEXTURE_2D,Fe,at,le,_e,0,ze,et,null),le>>=1,_e>>=1}}else if(Mt.length>0){if(bt&&Lt){const le=it(Mt[0]);t.texStorage2D(i.TEXTURE_2D,De,at,le.width,le.height)}for(let le=0,_e=Mt.length;le<_e;le++)Ve=Mt[le],bt?O&&t.texSubImage2D(i.TEXTURE_2D,le,0,0,ze,et,Ve):t.texImage2D(i.TEXTURE_2D,le,at,ze,et,Ve);y.generateMipmaps=!1}else if(bt){if(Lt){const le=it(Se);t.texStorage2D(i.TEXTURE_2D,De,at,le.width,le.height)}O&&t.texSubImage2D(i.TEXTURE_2D,0,0,0,ze,et,Se)}else t.texImage2D(i.TEXTURE_2D,0,at,ze,et,Se);m(y)&&f(ge),Je.__version=fe.version,y.onUpdate&&y.onUpdate(y)}C.__version=y.version}function re(C,y,Z){if(y.image.length!==6)return;const ge=ue(C,y),be=y.source;t.bindTexture(i.TEXTURE_CUBE_MAP,C.__webglTexture,i.TEXTURE0+Z);const fe=n.get(be);if(be.version!==fe.__version||ge===!0){t.activeTexture(i.TEXTURE0+Z);const Je=Ct.getPrimaries(Ct.workingColorSpace),Le=y.colorSpace===rr?null:Ct.getPrimaries(y.colorSpace),Be=y.colorSpace===rr||Je===Le?i.NONE:i.BROWSER_DEFAULT_WEBGL;i.pixelStorei(i.UNPACK_FLIP_Y_WEBGL,y.flipY),i.pixelStorei(i.UNPACK_PREMULTIPLY_ALPHA_WEBGL,y.premultiplyAlpha),i.pixelStorei(i.UNPACK_ALIGNMENT,y.unpackAlignment),i.pixelStorei(i.UNPACK_COLORSPACE_CONVERSION_WEBGL,Be);const Rt=y.isCompressedTexture||y.image[0].isCompressedTexture,Se=y.image[0]&&y.image[0].isDataTexture,ze=[];for(let _e=0;_e<6;_e++)!Rt&&!Se?ze[_e]=b(y.image[_e],!0,r.maxCubemapSize):ze[_e]=Se?y.image[_e].image:y.image[_e],ze[_e]=Ut(y,ze[_e]);const et=ze[0],at=s.convert(y.format,y.colorSpace),Ve=s.convert(y.type),Mt=x(y.internalFormat,at,Ve,y.colorSpace),bt=y.isVideoTexture!==!0,Lt=fe.__version===void 0||ge===!0,O=be.dataReady;let De=I(y,et);ee(i.TEXTURE_CUBE_MAP,y);let le;if(Rt){bt&&Lt&&t.texStorage2D(i.TEXTURE_CUBE_MAP,De,Mt,et.width,et.height);for(let _e=0;_e<6;_e++){le=ze[_e].mipmaps;for(let Fe=0;Fe<le.length;Fe++){const Ie=le[Fe];y.format!==ei?at!==null?bt?O&&t.compressedTexSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+_e,Fe,0,0,Ie.width,Ie.height,at,Ie.data):t.compressedTexImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+_e,Fe,Mt,Ie.width,Ie.height,0,Ie.data):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .setTextureCube()"):bt?O&&t.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+_e,Fe,0,0,Ie.width,Ie.height,at,Ve,Ie.data):t.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+_e,Fe,Mt,Ie.width,Ie.height,0,at,Ve,Ie.data)}}}else{if(le=y.mipmaps,bt&&Lt){le.length>0&&De++;const _e=it(ze[0]);t.texStorage2D(i.TEXTURE_CUBE_MAP,De,Mt,_e.width,_e.height)}for(let _e=0;_e<6;_e++)if(Se){bt?O&&t.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+_e,0,0,0,ze[_e].width,ze[_e].height,at,Ve,ze[_e].data):t.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+_e,0,Mt,ze[_e].width,ze[_e].height,0,at,Ve,ze[_e].data);for(let Fe=0;Fe<le.length;Fe++){const ft=le[Fe].image[_e].image;bt?O&&t.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+_e,Fe+1,0,0,ft.width,ft.height,at,Ve,ft.data):t.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+_e,Fe+1,Mt,ft.width,ft.height,0,at,Ve,ft.data)}}else{bt?O&&t.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+_e,0,0,0,at,Ve,ze[_e]):t.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+_e,0,Mt,at,Ve,ze[_e]);for(let Fe=0;Fe<le.length;Fe++){const Ie=le[Fe];bt?O&&t.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+_e,Fe+1,0,0,at,Ve,Ie.image[_e]):t.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+_e,Fe+1,Mt,at,Ve,Ie.image[_e])}}}m(y)&&f(i.TEXTURE_CUBE_MAP),fe.__version=be.version,y.onUpdate&&y.onUpdate(y)}C.__version=y.version}function xe(C,y,Z,ge,be,fe){const Je=s.convert(Z.format,Z.colorSpace),Le=s.convert(Z.type),Be=x(Z.internalFormat,Je,Le,Z.colorSpace),Rt=n.get(y),Se=n.get(Z);if(Se.__renderTarget=y,!Rt.__hasExternalTextures){const ze=Math.max(1,y.width>>fe),et=Math.max(1,y.height>>fe);be===i.TEXTURE_3D||be===i.TEXTURE_2D_ARRAY?t.texImage3D(be,fe,Be,ze,et,y.depth,0,Je,Le,null):t.texImage2D(be,fe,Be,ze,et,0,Je,Le,null)}t.bindFramebuffer(i.FRAMEBUFFER,C),ct(y)?a.framebufferTexture2DMultisampleEXT(i.FRAMEBUFFER,ge,be,Se.__webglTexture,0,pt(y)):(be===i.TEXTURE_2D||be>=i.TEXTURE_CUBE_MAP_POSITIVE_X&&be<=i.TEXTURE_CUBE_MAP_NEGATIVE_Z)&&i.framebufferTexture2D(i.FRAMEBUFFER,ge,be,Se.__webglTexture,fe),t.bindFramebuffer(i.FRAMEBUFFER,null)}function me(C,y,Z){if(i.bindRenderbuffer(i.RENDERBUFFER,C),y.depthBuffer){const ge=y.depthTexture,be=ge&&ge.isDepthTexture?ge.type:null,fe=_(y.stencilBuffer,be),Je=y.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT,Le=pt(y);ct(y)?a.renderbufferStorageMultisampleEXT(i.RENDERBUFFER,Le,fe,y.width,y.height):Z?i.renderbufferStorageMultisample(i.RENDERBUFFER,Le,fe,y.width,y.height):i.renderbufferStorage(i.RENDERBUFFER,fe,y.width,y.height),i.framebufferRenderbuffer(i.FRAMEBUFFER,Je,i.RENDERBUFFER,C)}else{const ge=y.textures;for(let be=0;be<ge.length;be++){const fe=ge[be],Je=s.convert(fe.format,fe.colorSpace),Le=s.convert(fe.type),Be=x(fe.internalFormat,Je,Le,fe.colorSpace),Rt=pt(y);Z&&ct(y)===!1?i.renderbufferStorageMultisample(i.RENDERBUFFER,Rt,Be,y.width,y.height):ct(y)?a.renderbufferStorageMultisampleEXT(i.RENDERBUFFER,Rt,Be,y.width,y.height):i.renderbufferStorage(i.RENDERBUFFER,Be,y.width,y.height)}}i.bindRenderbuffer(i.RENDERBUFFER,null)}function Te(C,y){if(y&&y.isWebGLCubeRenderTarget)throw new Error("Depth Texture with cube render targets is not supported");if(t.bindFramebuffer(i.FRAMEBUFFER,C),!(y.depthTexture&&y.depthTexture.isDepthTexture))throw new Error("renderTarget.depthTexture must be an instance of THREE.DepthTexture");const ge=n.get(y.depthTexture);ge.__renderTarget=y,(!ge.__webglTexture||y.depthTexture.image.width!==y.width||y.depthTexture.image.height!==y.height)&&(y.depthTexture.image.width=y.width,y.depthTexture.image.height=y.height,y.depthTexture.needsUpdate=!0),oe(y.depthTexture,0);const be=ge.__webglTexture,fe=pt(y);if(y.depthTexture.format===cs)ct(y)?a.framebufferTexture2DMultisampleEXT(i.FRAMEBUFFER,i.DEPTH_ATTACHMENT,i.TEXTURE_2D,be,0,fe):i.framebufferTexture2D(i.FRAMEBUFFER,i.DEPTH_ATTACHMENT,i.TEXTURE_2D,be,0);else if(y.depthTexture.format===ys)ct(y)?a.framebufferTexture2DMultisampleEXT(i.FRAMEBUFFER,i.DEPTH_STENCIL_ATTACHMENT,i.TEXTURE_2D,be,0,fe):i.framebufferTexture2D(i.FRAMEBUFFER,i.DEPTH_STENCIL_ATTACHMENT,i.TEXTURE_2D,be,0);else throw new Error("Unknown depthTexture format")}function ke(C){const y=n.get(C),Z=C.isWebGLCubeRenderTarget===!0;if(y.__boundDepthTexture!==C.depthTexture){const ge=C.depthTexture;if(y.__depthDisposeCallback&&y.__depthDisposeCallback(),ge){const be=()=>{delete y.__boundDepthTexture,delete y.__depthDisposeCallback,ge.removeEventListener("dispose",be)};ge.addEventListener("dispose",be),y.__depthDisposeCallback=be}y.__boundDepthTexture=ge}if(C.depthTexture&&!y.__autoAllocateDepthBuffer){if(Z)throw new Error("target.depthTexture not supported in Cube render targets");Te(y.__webglFramebuffer,C)}else if(Z){y.__webglDepthbuffer=[];for(let ge=0;ge<6;ge++)if(t.bindFramebuffer(i.FRAMEBUFFER,y.__webglFramebuffer[ge]),y.__webglDepthbuffer[ge]===void 0)y.__webglDepthbuffer[ge]=i.createRenderbuffer(),me(y.__webglDepthbuffer[ge],C,!1);else{const be=C.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT,fe=y.__webglDepthbuffer[ge];i.bindRenderbuffer(i.RENDERBUFFER,fe),i.framebufferRenderbuffer(i.FRAMEBUFFER,be,i.RENDERBUFFER,fe)}}else if(t.bindFramebuffer(i.FRAMEBUFFER,y.__webglFramebuffer),y.__webglDepthbuffer===void 0)y.__webglDepthbuffer=i.createRenderbuffer(),me(y.__webglDepthbuffer,C,!1);else{const ge=C.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT,be=y.__webglDepthbuffer;i.bindRenderbuffer(i.RENDERBUFFER,be),i.framebufferRenderbuffer(i.FRAMEBUFFER,ge,i.RENDERBUFFER,be)}t.bindFramebuffer(i.FRAMEBUFFER,null)}function He(C,y,Z){const ge=n.get(C);y!==void 0&&xe(ge.__webglFramebuffer,C,C.texture,i.COLOR_ATTACHMENT0,i.TEXTURE_2D,0),Z!==void 0&&ke(C)}function Ze(C){const y=C.texture,Z=n.get(C),ge=n.get(y);C.addEventListener("dispose",T);const be=C.textures,fe=C.isWebGLCubeRenderTarget===!0,Je=be.length>1;if(Je||(ge.__webglTexture===void 0&&(ge.__webglTexture=i.createTexture()),ge.__version=y.version,o.memory.textures++),fe){Z.__webglFramebuffer=[];for(let Le=0;Le<6;Le++)if(y.mipmaps&&y.mipmaps.length>0){Z.__webglFramebuffer[Le]=[];for(let Be=0;Be<y.mipmaps.length;Be++)Z.__webglFramebuffer[Le][Be]=i.createFramebuffer()}else Z.__webglFramebuffer[Le]=i.createFramebuffer()}else{if(y.mipmaps&&y.mipmaps.length>0){Z.__webglFramebuffer=[];for(let Le=0;Le<y.mipmaps.length;Le++)Z.__webglFramebuffer[Le]=i.createFramebuffer()}else Z.__webglFramebuffer=i.createFramebuffer();if(Je)for(let Le=0,Be=be.length;Le<Be;Le++){const Rt=n.get(be[Le]);Rt.__webglTexture===void 0&&(Rt.__webglTexture=i.createTexture(),o.memory.textures++)}if(C.samples>0&&ct(C)===!1){Z.__webglMultisampledFramebuffer=i.createFramebuffer(),Z.__webglColorRenderbuffer=[],t.bindFramebuffer(i.FRAMEBUFFER,Z.__webglMultisampledFramebuffer);for(let Le=0;Le<be.length;Le++){const Be=be[Le];Z.__webglColorRenderbuffer[Le]=i.createRenderbuffer(),i.bindRenderbuffer(i.RENDERBUFFER,Z.__webglColorRenderbuffer[Le]);const Rt=s.convert(Be.format,Be.colorSpace),Se=s.convert(Be.type),ze=x(Be.internalFormat,Rt,Se,Be.colorSpace,C.isXRRenderTarget===!0),et=pt(C);i.renderbufferStorageMultisample(i.RENDERBUFFER,et,ze,C.width,C.height),i.framebufferRenderbuffer(i.FRAMEBUFFER,i.COLOR_ATTACHMENT0+Le,i.RENDERBUFFER,Z.__webglColorRenderbuffer[Le])}i.bindRenderbuffer(i.RENDERBUFFER,null),C.depthBuffer&&(Z.__webglDepthRenderbuffer=i.createRenderbuffer(),me(Z.__webglDepthRenderbuffer,C,!0)),t.bindFramebuffer(i.FRAMEBUFFER,null)}}if(fe){t.bindTexture(i.TEXTURE_CUBE_MAP,ge.__webglTexture),ee(i.TEXTURE_CUBE_MAP,y);for(let Le=0;Le<6;Le++)if(y.mipmaps&&y.mipmaps.length>0)for(let Be=0;Be<y.mipmaps.length;Be++)xe(Z.__webglFramebuffer[Le][Be],C,y,i.COLOR_ATTACHMENT0,i.TEXTURE_CUBE_MAP_POSITIVE_X+Le,Be);else xe(Z.__webglFramebuffer[Le],C,y,i.COLOR_ATTACHMENT0,i.TEXTURE_CUBE_MAP_POSITIVE_X+Le,0);m(y)&&f(i.TEXTURE_CUBE_MAP),t.unbindTexture()}else if(Je){for(let Le=0,Be=be.length;Le<Be;Le++){const Rt=be[Le],Se=n.get(Rt);t.bindTexture(i.TEXTURE_2D,Se.__webglTexture),ee(i.TEXTURE_2D,Rt),xe(Z.__webglFramebuffer,C,Rt,i.COLOR_ATTACHMENT0+Le,i.TEXTURE_2D,0),m(Rt)&&f(i.TEXTURE_2D)}t.unbindTexture()}else{let Le=i.TEXTURE_2D;if((C.isWebGL3DRenderTarget||C.isWebGLArrayRenderTarget)&&(Le=C.isWebGL3DRenderTarget?i.TEXTURE_3D:i.TEXTURE_2D_ARRAY),t.bindTexture(Le,ge.__webglTexture),ee(Le,y),y.mipmaps&&y.mipmaps.length>0)for(let Be=0;Be<y.mipmaps.length;Be++)xe(Z.__webglFramebuffer[Be],C,y,i.COLOR_ATTACHMENT0,Le,Be);else xe(Z.__webglFramebuffer,C,y,i.COLOR_ATTACHMENT0,Le,0);m(y)&&f(Le),t.unbindTexture()}C.depthBuffer&&ke(C)}function Ce(C){const y=C.textures;for(let Z=0,ge=y.length;Z<ge;Z++){const be=y[Z];if(m(be)){const fe=M(C),Je=n.get(be).__webglTexture;t.bindTexture(fe,Je),f(fe),t.unbindTexture()}}}const rt=[],N=[];function Ft(C){if(C.samples>0){if(ct(C)===!1){const y=C.textures,Z=C.width,ge=C.height;let be=i.COLOR_BUFFER_BIT;const fe=C.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT,Je=n.get(C),Le=y.length>1;if(Le)for(let Be=0;Be<y.length;Be++)t.bindFramebuffer(i.FRAMEBUFFER,Je.__webglMultisampledFramebuffer),i.framebufferRenderbuffer(i.FRAMEBUFFER,i.COLOR_ATTACHMENT0+Be,i.RENDERBUFFER,null),t.bindFramebuffer(i.FRAMEBUFFER,Je.__webglFramebuffer),i.framebufferTexture2D(i.DRAW_FRAMEBUFFER,i.COLOR_ATTACHMENT0+Be,i.TEXTURE_2D,null,0);t.bindFramebuffer(i.READ_FRAMEBUFFER,Je.__webglMultisampledFramebuffer),t.bindFramebuffer(i.DRAW_FRAMEBUFFER,Je.__webglFramebuffer);for(let Be=0;Be<y.length;Be++){if(C.resolveDepthBuffer&&(C.depthBuffer&&(be|=i.DEPTH_BUFFER_BIT),C.stencilBuffer&&C.resolveStencilBuffer&&(be|=i.STENCIL_BUFFER_BIT)),Le){i.framebufferRenderbuffer(i.READ_FRAMEBUFFER,i.COLOR_ATTACHMENT0,i.RENDERBUFFER,Je.__webglColorRenderbuffer[Be]);const Rt=n.get(y[Be]).__webglTexture;i.framebufferTexture2D(i.DRAW_FRAMEBUFFER,i.COLOR_ATTACHMENT0,i.TEXTURE_2D,Rt,0)}i.blitFramebuffer(0,0,Z,ge,0,0,Z,ge,be,i.NEAREST),c===!0&&(rt.length=0,N.length=0,rt.push(i.COLOR_ATTACHMENT0+Be),C.depthBuffer&&C.resolveDepthBuffer===!1&&(rt.push(fe),N.push(fe),i.invalidateFramebuffer(i.DRAW_FRAMEBUFFER,N)),i.invalidateFramebuffer(i.READ_FRAMEBUFFER,rt))}if(t.bindFramebuffer(i.READ_FRAMEBUFFER,null),t.bindFramebuffer(i.DRAW_FRAMEBUFFER,null),Le)for(let Be=0;Be<y.length;Be++){t.bindFramebuffer(i.FRAMEBUFFER,Je.__webglMultisampledFramebuffer),i.framebufferRenderbuffer(i.FRAMEBUFFER,i.COLOR_ATTACHMENT0+Be,i.RENDERBUFFER,Je.__webglColorRenderbuffer[Be]);const Rt=n.get(y[Be]).__webglTexture;t.bindFramebuffer(i.FRAMEBUFFER,Je.__webglFramebuffer),i.framebufferTexture2D(i.DRAW_FRAMEBUFFER,i.COLOR_ATTACHMENT0+Be,i.TEXTURE_2D,Rt,0)}t.bindFramebuffer(i.DRAW_FRAMEBUFFER,Je.__webglMultisampledFramebuffer)}else if(C.depthBuffer&&C.resolveDepthBuffer===!1&&c){const y=C.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT;i.invalidateFramebuffer(i.DRAW_FRAMEBUFFER,[y])}}}function pt(C){return Math.min(r.maxSamples,C.samples)}function ct(C){const y=n.get(C);return C.samples>0&&e.has("WEBGL_multisampled_render_to_texture")===!0&&y.__useRenderToTexture!==!1}function Ne(C){const y=o.render.frame;h.get(C)!==y&&(h.set(C,y),C.update())}function Ut(C,y){const Z=C.colorSpace,ge=C.format,be=C.type;return C.isCompressedTexture===!0||C.isVideoTexture===!0||Z!==Ln&&Z!==rr&&(Ct.getTransfer(Z)===jt?(ge!==ei||be!==qi)&&console.warn("THREE.WebGLTextures: sRGB encoded textures have to use RGBAFormat and UnsignedByteType."):console.error("THREE.WebGLTextures: Unsupported texture color space:",Z)),y}function it(C){return typeof HTMLImageElement<"u"&&C instanceof HTMLImageElement?(l.width=C.naturalWidth||C.width,l.height=C.naturalHeight||C.height):typeof VideoFrame<"u"&&C instanceof VideoFrame?(l.width=C.displayWidth,l.height=C.displayHeight):(l.width=C.width,l.height=C.height),l}this.allocateTextureUnit=G,this.resetTextureUnits=Q,this.setTexture2D=oe,this.setTexture2DArray=ne,this.setTexture3D=he,this.setTextureCube=L,this.rebindTextures=He,this.setupRenderTarget=Ze,this.updateRenderTargetMipmap=Ce,this.updateMultisampleRenderTarget=Ft,this.setupDepthRenderbuffer=ke,this.setupFrameBufferTexture=xe,this.useMultisampledRTT=ct}function F_(i,e){function t(n,r=rr){let s;const o=Ct.getTransfer(r);if(n===qi)return i.UNSIGNED_BYTE;if(n===Bl)return i.UNSIGNED_SHORT_4_4_4_4;if(n===zl)return i.UNSIGNED_SHORT_5_5_5_1;if(n===hd)return i.UNSIGNED_INT_5_9_9_9_REV;if(n===cd)return i.BYTE;if(n===ld)return i.SHORT;if(n===io)return i.UNSIGNED_SHORT;if(n===kl)return i.INT;if(n===Nr)return i.UNSIGNED_INT;if(n===li)return i.FLOAT;if(n===ho)return i.HALF_FLOAT;if(n===ud)return i.ALPHA;if(n===dd)return i.RGB;if(n===ei)return i.RGBA;if(n===fd)return i.LUMINANCE;if(n===pd)return i.LUMINANCE_ALPHA;if(n===cs)return i.DEPTH_COMPONENT;if(n===ys)return i.DEPTH_STENCIL;if(n===Hl)return i.RED;if(n===Vl)return i.RED_INTEGER;if(n===md)return i.RG;if(n===Gl)return i.RG_INTEGER;if(n===Wl)return i.RGBA_INTEGER;if(n===ia||n===ra||n===sa||n===oa)if(o===jt)if(s=e.get("WEBGL_compressed_texture_s3tc_srgb"),s!==null){if(n===ia)return s.COMPRESSED_SRGB_S3TC_DXT1_EXT;if(n===ra)return s.COMPRESSED_SRGB_ALPHA_S3TC_DXT1_EXT;if(n===sa)return s.COMPRESSED_SRGB_ALPHA_S3TC_DXT3_EXT;if(n===oa)return s.COMPRESSED_SRGB_ALPHA_S3TC_DXT5_EXT}else return null;else if(s=e.get("WEBGL_compressed_texture_s3tc"),s!==null){if(n===ia)return s.COMPRESSED_RGB_S3TC_DXT1_EXT;if(n===ra)return s.COMPRESSED_RGBA_S3TC_DXT1_EXT;if(n===sa)return s.COMPRESSED_RGBA_S3TC_DXT3_EXT;if(n===oa)return s.COMPRESSED_RGBA_S3TC_DXT5_EXT}else return null;if(n===Xc||n===Qc||n===Kc||n===Yc)if(s=e.get("WEBGL_compressed_texture_pvrtc"),s!==null){if(n===Xc)return s.COMPRESSED_RGB_PVRTC_4BPPV1_IMG;if(n===Qc)return s.COMPRESSED_RGB_PVRTC_2BPPV1_IMG;if(n===Kc)return s.COMPRESSED_RGBA_PVRTC_4BPPV1_IMG;if(n===Yc)return s.COMPRESSED_RGBA_PVRTC_2BPPV1_IMG}else return null;if(n===$c||n===Zc||n===Jc)if(s=e.get("WEBGL_compressed_texture_etc"),s!==null){if(n===$c||n===Zc)return o===jt?s.COMPRESSED_SRGB8_ETC2:s.COMPRESSED_RGB8_ETC2;if(n===Jc)return o===jt?s.COMPRESSED_SRGB8_ALPHA8_ETC2_EAC:s.COMPRESSED_RGBA8_ETC2_EAC}else return null;if(n===el||n===tl||n===nl||n===il||n===rl||n===sl||n===ol||n===al||n===cl||n===ll||n===hl||n===ul||n===dl||n===fl)if(s=e.get("WEBGL_compressed_texture_astc"),s!==null){if(n===el)return o===jt?s.COMPRESSED_SRGB8_ALPHA8_ASTC_4x4_KHR:s.COMPRESSED_RGBA_ASTC_4x4_KHR;if(n===tl)return o===jt?s.COMPRESSED_SRGB8_ALPHA8_ASTC_5x4_KHR:s.COMPRESSED_RGBA_ASTC_5x4_KHR;if(n===nl)return o===jt?s.COMPRESSED_SRGB8_ALPHA8_ASTC_5x5_KHR:s.COMPRESSED_RGBA_ASTC_5x5_KHR;if(n===il)return o===jt?s.COMPRESSED_SRGB8_ALPHA8_ASTC_6x5_KHR:s.COMPRESSED_RGBA_ASTC_6x5_KHR;if(n===rl)return o===jt?s.COMPRESSED_SRGB8_ALPHA8_ASTC_6x6_KHR:s.COMPRESSED_RGBA_ASTC_6x6_KHR;if(n===sl)return o===jt?s.COMPRESSED_SRGB8_ALPHA8_ASTC_8x5_KHR:s.COMPRESSED_RGBA_ASTC_8x5_KHR;if(n===ol)return o===jt?s.COMPRESSED_SRGB8_ALPHA8_ASTC_8x6_KHR:s.COMPRESSED_RGBA_ASTC_8x6_KHR;if(n===al)return o===jt?s.COMPRESSED_SRGB8_ALPHA8_ASTC_8x8_KHR:s.COMPRESSED_RGBA_ASTC_8x8_KHR;if(n===cl)return o===jt?s.COMPRESSED_SRGB8_ALPHA8_ASTC_10x5_KHR:s.COMPRESSED_RGBA_ASTC_10x5_KHR;if(n===ll)return o===jt?s.COMPRESSED_SRGB8_ALPHA8_ASTC_10x6_KHR:s.COMPRESSED_RGBA_ASTC_10x6_KHR;if(n===hl)return o===jt?s.COMPRESSED_SRGB8_ALPHA8_ASTC_10x8_KHR:s.COMPRESSED_RGBA_ASTC_10x8_KHR;if(n===ul)return o===jt?s.COMPRESSED_SRGB8_ALPHA8_ASTC_10x10_KHR:s.COMPRESSED_RGBA_ASTC_10x10_KHR;if(n===dl)return o===jt?s.COMPRESSED_SRGB8_ALPHA8_ASTC_12x10_KHR:s.COMPRESSED_RGBA_ASTC_12x10_KHR;if(n===fl)return o===jt?s.COMPRESSED_SRGB8_ALPHA8_ASTC_12x12_KHR:s.COMPRESSED_RGBA_ASTC_12x12_KHR}else return null;if(n===aa||n===pl||n===ml)if(s=e.get("EXT_texture_compression_bptc"),s!==null){if(n===aa)return o===jt?s.COMPRESSED_SRGB_ALPHA_BPTC_UNORM_EXT:s.COMPRESSED_RGBA_BPTC_UNORM_EXT;if(n===pl)return s.COMPRESSED_RGB_BPTC_SIGNED_FLOAT_EXT;if(n===ml)return s.COMPRESSED_RGB_BPTC_UNSIGNED_FLOAT_EXT}else return null;if(n===gd||n===gl||n===bl||n===_l)if(s=e.get("EXT_texture_compression_rgtc"),s!==null){if(n===aa)return s.COMPRESSED_RED_RGTC1_EXT;if(n===gl)return s.COMPRESSED_SIGNED_RED_RGTC1_EXT;if(n===bl)return s.COMPRESSED_RED_GREEN_RGTC2_EXT;if(n===_l)return s.COMPRESSED_SIGNED_RED_GREEN_RGTC2_EXT}else return null;return n===vs?i.UNSIGNED_INT_24_8:i[n]!==void 0?i[n]:null}return{convert:t}}class U_ extends vn{constructor(e=[]){super(),this.isArrayCamera=!0,this.cameras=e}}class Dr extends en{constructor(){super(),this.isGroup=!0,this.type="Group"}}const O_={type:"move"};class fc{constructor(){this._targetRay=null,this._grip=null,this._hand=null}getHandSpace(){return this._hand===null&&(this._hand=new Dr,this._hand.matrixAutoUpdate=!1,this._hand.visible=!1,this._hand.joints={},this._hand.inputState={pinching:!1}),this._hand}getTargetRaySpace(){return this._targetRay===null&&(this._targetRay=new Dr,this._targetRay.matrixAutoUpdate=!1,this._targetRay.visible=!1,this._targetRay.hasLinearVelocity=!1,this._targetRay.linearVelocity=new A,this._targetRay.hasAngularVelocity=!1,this._targetRay.angularVelocity=new A),this._targetRay}getGripSpace(){return this._grip===null&&(this._grip=new Dr,this._grip.matrixAutoUpdate=!1,this._grip.visible=!1,this._grip.hasLinearVelocity=!1,this._grip.linearVelocity=new A,this._grip.hasAngularVelocity=!1,this._grip.angularVelocity=new A),this._grip}dispatchEvent(e){return this._targetRay!==null&&this._targetRay.dispatchEvent(e),this._grip!==null&&this._grip.dispatchEvent(e),this._hand!==null&&this._hand.dispatchEvent(e),this}connect(e){if(e&&e.hand){const t=this._hand;if(t)for(const n of e.hand.values())this._getHandJoint(t,n)}return this.dispatchEvent({type:"connected",data:e}),this}disconnect(e){return this.dispatchEvent({type:"disconnected",data:e}),this._targetRay!==null&&(this._targetRay.visible=!1),this._grip!==null&&(this._grip.visible=!1),this._hand!==null&&(this._hand.visible=!1),this}update(e,t,n){let r=null,s=null,o=null;const a=this._targetRay,c=this._grip,l=this._hand;if(e&&t.session.visibilityState!=="visible-blurred"){if(l&&e.hand){o=!0;for(const b of e.hand.values()){const m=t.getJointPose(b,n),f=this._getHandJoint(l,b);m!==null&&(f.matrix.fromArray(m.transform.matrix),f.matrix.decompose(f.position,f.rotation,f.scale),f.matrixWorldNeedsUpdate=!0,f.jointRadius=m.radius),f.visible=m!==null}const h=l.joints["index-finger-tip"],u=l.joints["thumb-tip"],d=h.position.distanceTo(u.position),p=.02,g=.005;l.inputState.pinching&&d>p+g?(l.inputState.pinching=!1,this.dispatchEvent({type:"pinchend",handedness:e.handedness,target:this})):!l.inputState.pinching&&d<=p-g&&(l.inputState.pinching=!0,this.dispatchEvent({type:"pinchstart",handedness:e.handedness,target:this}))}else c!==null&&e.gripSpace&&(s=t.getPose(e.gripSpace,n),s!==null&&(c.matrix.fromArray(s.transform.matrix),c.matrix.decompose(c.position,c.rotation,c.scale),c.matrixWorldNeedsUpdate=!0,s.linearVelocity?(c.hasLinearVelocity=!0,c.linearVelocity.copy(s.linearVelocity)):c.hasLinearVelocity=!1,s.angularVelocity?(c.hasAngularVelocity=!0,c.angularVelocity.copy(s.angularVelocity)):c.hasAngularVelocity=!1));a!==null&&(r=t.getPose(e.targetRaySpace,n),r===null&&s!==null&&(r=s),r!==null&&(a.matrix.fromArray(r.transform.matrix),a.matrix.decompose(a.position,a.rotation,a.scale),a.matrixWorldNeedsUpdate=!0,r.linearVelocity?(a.hasLinearVelocity=!0,a.linearVelocity.copy(r.linearVelocity)):a.hasLinearVelocity=!1,r.angularVelocity?(a.hasAngularVelocity=!0,a.angularVelocity.copy(r.angularVelocity)):a.hasAngularVelocity=!1,this.dispatchEvent(O_)))}return a!==null&&(a.visible=r!==null),c!==null&&(c.visible=s!==null),l!==null&&(l.visible=o!==null),this}_getHandJoint(e,t){if(e.joints[t.jointName]===void 0){const n=new Dr;n.matrixAutoUpdate=!1,n.visible=!1,e.joints[t.jointName]=n,e.add(n)}return e.joints[t.jointName]}}const k_=`
void main() {

	gl_Position = vec4( position, 1.0 );

}`,B_=`
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

}`;class z_{constructor(){this.texture=null,this.mesh=null,this.depthNear=0,this.depthFar=0}init(e,t,n){if(this.texture===null){const r=new hn,s=e.properties.get(r);s.__webglTexture=t.texture,(t.depthNear!=n.depthNear||t.depthFar!=n.depthFar)&&(this.depthNear=t.depthNear,this.depthFar=t.depthFar),this.texture=r}}getMesh(e){if(this.texture!==null&&this.mesh===null){const t=e.cameras[0].viewport,n=new dr({vertexShader:k_,fragmentShader:B_,uniforms:{depthColor:{value:this.texture},depthWidth:{value:t.z},depthHeight:{value:t.w}}});this.mesh=new Xt(new Ps(20,20),n)}return this.mesh}reset(){this.texture=null,this.mesh=null}getDepthTexture(){return this.texture}}class H_ extends Ur{constructor(e,t){super();const n=this;let r=null,s=1,o=null,a="local-floor",c=1,l=null,h=null,u=null,d=null,p=null,g=null;const b=new z_,m=t.getContextAttributes();let f=null,M=null;const x=[],_=[],I=new ht;let R=null;const T=new vn;T.viewport=new mt;const F=new vn;F.viewport=new mt;const S=[T,F],v=new U_;let P=null,Q=null;this.cameraAutoUpdate=!0,this.enabled=!1,this.isPresenting=!1,this.getController=function(X){let re=x[X];return re===void 0&&(re=new fc,x[X]=re),re.getTargetRaySpace()},this.getControllerGrip=function(X){let re=x[X];return re===void 0&&(re=new fc,x[X]=re),re.getGripSpace()},this.getHand=function(X){let re=x[X];return re===void 0&&(re=new fc,x[X]=re),re.getHandSpace()};function G(X){const re=_.indexOf(X.inputSource);if(re===-1)return;const xe=x[re];xe!==void 0&&(xe.update(X.inputSource,X.frame,l||o),xe.dispatchEvent({type:X.type,data:X.inputSource}))}function ae(){r.removeEventListener("select",G),r.removeEventListener("selectstart",G),r.removeEventListener("selectend",G),r.removeEventListener("squeeze",G),r.removeEventListener("squeezestart",G),r.removeEventListener("squeezeend",G),r.removeEventListener("end",ae),r.removeEventListener("inputsourceschange",oe);for(let X=0;X<x.length;X++){const re=_[X];re!==null&&(_[X]=null,x[X].disconnect(re))}P=null,Q=null,b.reset(),e.setRenderTarget(f),p=null,d=null,u=null,r=null,M=null,ue.stop(),n.isPresenting=!1,e.setPixelRatio(R),e.setSize(I.width,I.height,!1),n.dispatchEvent({type:"sessionend"})}this.setFramebufferScaleFactor=function(X){s=X,n.isPresenting===!0&&console.warn("THREE.WebXRManager: Cannot change framebuffer scale while presenting.")},this.setReferenceSpaceType=function(X){a=X,n.isPresenting===!0&&console.warn("THREE.WebXRManager: Cannot change reference space type while presenting.")},this.getReferenceSpace=function(){return l||o},this.setReferenceSpace=function(X){l=X},this.getBaseLayer=function(){return d!==null?d:p},this.getBinding=function(){return u},this.getFrame=function(){return g},this.getSession=function(){return r},this.setSession=async function(X){if(r=X,r!==null){if(f=e.getRenderTarget(),r.addEventListener("select",G),r.addEventListener("selectstart",G),r.addEventListener("selectend",G),r.addEventListener("squeeze",G),r.addEventListener("squeezestart",G),r.addEventListener("squeezeend",G),r.addEventListener("end",ae),r.addEventListener("inputsourceschange",oe),m.xrCompatible!==!0&&await t.makeXRCompatible(),R=e.getPixelRatio(),e.getSize(I),r.renderState.layers===void 0){const re={antialias:m.antialias,alpha:!0,depth:m.depth,stencil:m.stencil,framebufferScaleFactor:s};p=new XRWebGLLayer(r,t,re),r.updateRenderState({baseLayer:p}),e.setPixelRatio(1),e.setSize(p.framebufferWidth,p.framebufferHeight,!1),M=new ur(p.framebufferWidth,p.framebufferHeight,{format:ei,type:qi,colorSpace:e.outputColorSpace,stencilBuffer:m.stencil})}else{let re=null,xe=null,me=null;m.depth&&(me=m.stencil?t.DEPTH24_STENCIL8:t.DEPTH_COMPONENT24,re=m.stencil?ys:cs,xe=m.stencil?vs:Nr);const Te={colorFormat:t.RGBA8,depthFormat:me,scaleFactor:s};u=new XRWebGLBinding(r,t),d=u.createProjectionLayer(Te),r.updateRenderState({layers:[d]}),e.setPixelRatio(1),e.setSize(d.textureWidth,d.textureHeight,!1),M=new ur(d.textureWidth,d.textureHeight,{format:ei,type:qi,depthTexture:new Pd(d.textureWidth,d.textureHeight,xe,void 0,void 0,void 0,void 0,void 0,void 0,re),stencilBuffer:m.stencil,colorSpace:e.outputColorSpace,samples:m.antialias?4:0,resolveDepthBuffer:d.ignoreDepthValues===!1})}M.isXRRenderTarget=!0,this.setFoveation(c),l=null,o=await r.requestReferenceSpace(a),ue.setContext(r),ue.start(),n.isPresenting=!0,n.dispatchEvent({type:"sessionstart"})}},this.getEnvironmentBlendMode=function(){if(r!==null)return r.environmentBlendMode},this.getDepthTexture=function(){return b.getDepthTexture()};function oe(X){for(let re=0;re<X.removed.length;re++){const xe=X.removed[re],me=_.indexOf(xe);me>=0&&(_[me]=null,x[me].disconnect(xe))}for(let re=0;re<X.added.length;re++){const xe=X.added[re];let me=_.indexOf(xe);if(me===-1){for(let ke=0;ke<x.length;ke++)if(ke>=_.length){_.push(xe),me=ke;break}else if(_[ke]===null){_[ke]=xe,me=ke;break}if(me===-1)break}const Te=x[me];Te&&Te.connect(xe)}}const ne=new A,he=new A;function L(X,re,xe){ne.setFromMatrixPosition(re.matrixWorld),he.setFromMatrixPosition(xe.matrixWorld);const me=ne.distanceTo(he),Te=re.projectionMatrix.elements,ke=xe.projectionMatrix.elements,He=Te[14]/(Te[10]-1),Ze=Te[14]/(Te[10]+1),Ce=(Te[9]+1)/Te[5],rt=(Te[9]-1)/Te[5],N=(Te[8]-1)/Te[0],Ft=(ke[8]+1)/ke[0],pt=He*N,ct=He*Ft,Ne=me/(-N+Ft),Ut=Ne*-N;if(re.matrixWorld.decompose(X.position,X.quaternion,X.scale),X.translateX(Ut),X.translateZ(Ne),X.matrixWorld.compose(X.position,X.quaternion,X.scale),X.matrixWorldInverse.copy(X.matrixWorld).invert(),Te[10]===-1)X.projectionMatrix.copy(re.projectionMatrix),X.projectionMatrixInverse.copy(re.projectionMatrixInverse);else{const it=He+Ne,C=Ze+Ne,y=pt-Ut,Z=ct+(me-Ut),ge=Ce*Ze/C*it,be=rt*Ze/C*it;X.projectionMatrix.makePerspective(y,Z,ge,be,it,C),X.projectionMatrixInverse.copy(X.projectionMatrix).invert()}}function W(X,re){re===null?X.matrixWorld.copy(X.matrix):X.matrixWorld.multiplyMatrices(re.matrixWorld,X.matrix),X.matrixWorldInverse.copy(X.matrixWorld).invert()}this.updateCamera=function(X){if(r===null)return;let re=X.near,xe=X.far;b.texture!==null&&(b.depthNear>0&&(re=b.depthNear),b.depthFar>0&&(xe=b.depthFar)),v.near=F.near=T.near=re,v.far=F.far=T.far=xe,(P!==v.near||Q!==v.far)&&(r.updateRenderState({depthNear:v.near,depthFar:v.far}),P=v.near,Q=v.far),T.layers.mask=X.layers.mask|2,F.layers.mask=X.layers.mask|4,v.layers.mask=T.layers.mask|F.layers.mask;const me=X.parent,Te=v.cameras;W(v,me);for(let ke=0;ke<Te.length;ke++)W(Te[ke],me);Te.length===2?L(v,T,F):v.projectionMatrix.copy(T.projectionMatrix),q(X,v,me)};function q(X,re,xe){xe===null?X.matrix.copy(re.matrixWorld):(X.matrix.copy(xe.matrixWorld),X.matrix.invert(),X.matrix.multiply(re.matrixWorld)),X.matrix.decompose(X.position,X.quaternion,X.scale),X.updateMatrixWorld(!0),X.projectionMatrix.copy(re.projectionMatrix),X.projectionMatrixInverse.copy(re.projectionMatrixInverse),X.isPerspectiveCamera&&(X.fov=Ms*2*Math.atan(1/X.projectionMatrix.elements[5]),X.zoom=1)}this.getCamera=function(){return v},this.getFoveation=function(){if(!(d===null&&p===null))return c},this.setFoveation=function(X){c=X,d!==null&&(d.fixedFoveation=X),p!==null&&p.fixedFoveation!==void 0&&(p.fixedFoveation=X)},this.hasDepthSensing=function(){return b.texture!==null},this.getDepthSensingMesh=function(){return b.getMesh(v)};let j=null;function ee(X,re){if(h=re.getViewerPose(l||o),g=re,h!==null){const xe=h.views;p!==null&&(e.setRenderTargetFramebuffer(M,p.framebuffer),e.setRenderTarget(M));let me=!1;xe.length!==v.cameras.length&&(v.cameras.length=0,me=!0);for(let ke=0;ke<xe.length;ke++){const He=xe[ke];let Ze=null;if(p!==null)Ze=p.getViewport(He);else{const rt=u.getViewSubImage(d,He);Ze=rt.viewport,ke===0&&(e.setRenderTargetTextures(M,rt.colorTexture,d.ignoreDepthValues?void 0:rt.depthStencilTexture),e.setRenderTarget(M))}let Ce=S[ke];Ce===void 0&&(Ce=new vn,Ce.layers.enable(ke),Ce.viewport=new mt,S[ke]=Ce),Ce.matrix.fromArray(He.transform.matrix),Ce.matrix.decompose(Ce.position,Ce.quaternion,Ce.scale),Ce.projectionMatrix.fromArray(He.projectionMatrix),Ce.projectionMatrixInverse.copy(Ce.projectionMatrix).invert(),Ce.viewport.set(Ze.x,Ze.y,Ze.width,Ze.height),ke===0&&(v.matrix.copy(Ce.matrix),v.matrix.decompose(v.position,v.quaternion,v.scale)),me===!0&&v.cameras.push(Ce)}const Te=r.enabledFeatures;if(Te&&Te.includes("depth-sensing")){const ke=u.getDepthInformation(xe[0]);ke&&ke.isValid&&ke.texture&&b.init(e,ke,r.renderState)}}for(let xe=0;xe<x.length;xe++){const me=_[xe],Te=x[xe];me!==null&&Te!==void 0&&Te.update(me,re,l||o)}j&&j(X,re),re.detectedPlanes&&n.dispatchEvent({type:"planesdetected",data:re}),g=null}const ue=new Cd;ue.setAnimationLoop(ee),this.setAnimationLoop=function(X){j=X},this.dispose=function(){}}}const wr=new vi,V_=new ot;function G_(i,e){function t(m,f){m.matrixAutoUpdate===!0&&m.updateMatrix(),f.value.copy(m.matrix)}function n(m,f){f.color.getRGB(m.fogColor.value,Ad(i)),f.isFog?(m.fogNear.value=f.near,m.fogFar.value=f.far):f.isFogExp2&&(m.fogDensity.value=f.density)}function r(m,f,M,x,_){f.isMeshBasicMaterial||f.isMeshLambertMaterial?s(m,f):f.isMeshToonMaterial?(s(m,f),u(m,f)):f.isMeshPhongMaterial?(s(m,f),h(m,f)):f.isMeshStandardMaterial?(s(m,f),d(m,f),f.isMeshPhysicalMaterial&&p(m,f,_)):f.isMeshMatcapMaterial?(s(m,f),g(m,f)):f.isMeshDepthMaterial?s(m,f):f.isMeshDistanceMaterial?(s(m,f),b(m,f)):f.isMeshNormalMaterial?s(m,f):f.isLineBasicMaterial?(o(m,f),f.isLineDashedMaterial&&a(m,f)):f.isPointsMaterial?c(m,f,M,x):f.isSpriteMaterial?l(m,f):f.isShadowMaterial?(m.color.value.copy(f.color),m.opacity.value=f.opacity):f.isShaderMaterial&&(f.uniformsNeedUpdate=!1)}function s(m,f){m.opacity.value=f.opacity,f.color&&m.diffuse.value.copy(f.color),f.emissive&&m.emissive.value.copy(f.emissive).multiplyScalar(f.emissiveIntensity),f.map&&(m.map.value=f.map,t(f.map,m.mapTransform)),f.alphaMap&&(m.alphaMap.value=f.alphaMap,t(f.alphaMap,m.alphaMapTransform)),f.bumpMap&&(m.bumpMap.value=f.bumpMap,t(f.bumpMap,m.bumpMapTransform),m.bumpScale.value=f.bumpScale,f.side===Cn&&(m.bumpScale.value*=-1)),f.normalMap&&(m.normalMap.value=f.normalMap,t(f.normalMap,m.normalMapTransform),m.normalScale.value.copy(f.normalScale),f.side===Cn&&m.normalScale.value.negate()),f.displacementMap&&(m.displacementMap.value=f.displacementMap,t(f.displacementMap,m.displacementMapTransform),m.displacementScale.value=f.displacementScale,m.displacementBias.value=f.displacementBias),f.emissiveMap&&(m.emissiveMap.value=f.emissiveMap,t(f.emissiveMap,m.emissiveMapTransform)),f.specularMap&&(m.specularMap.value=f.specularMap,t(f.specularMap,m.specularMapTransform)),f.alphaTest>0&&(m.alphaTest.value=f.alphaTest);const M=e.get(f),x=M.envMap,_=M.envMapRotation;x&&(m.envMap.value=x,wr.copy(_),wr.x*=-1,wr.y*=-1,wr.z*=-1,x.isCubeTexture&&x.isRenderTargetTexture===!1&&(wr.y*=-1,wr.z*=-1),m.envMapRotation.value.setFromMatrix4(V_.makeRotationFromEuler(wr)),m.flipEnvMap.value=x.isCubeTexture&&x.isRenderTargetTexture===!1?-1:1,m.reflectivity.value=f.reflectivity,m.ior.value=f.ior,m.refractionRatio.value=f.refractionRatio),f.lightMap&&(m.lightMap.value=f.lightMap,m.lightMapIntensity.value=f.lightMapIntensity,t(f.lightMap,m.lightMapTransform)),f.aoMap&&(m.aoMap.value=f.aoMap,m.aoMapIntensity.value=f.aoMapIntensity,t(f.aoMap,m.aoMapTransform))}function o(m,f){m.diffuse.value.copy(f.color),m.opacity.value=f.opacity,f.map&&(m.map.value=f.map,t(f.map,m.mapTransform))}function a(m,f){m.dashSize.value=f.dashSize,m.totalSize.value=f.dashSize+f.gapSize,m.scale.value=f.scale}function c(m,f,M,x){m.diffuse.value.copy(f.color),m.opacity.value=f.opacity,m.size.value=f.size*M,m.scale.value=x*.5,f.map&&(m.map.value=f.map,t(f.map,m.uvTransform)),f.alphaMap&&(m.alphaMap.value=f.alphaMap,t(f.alphaMap,m.alphaMapTransform)),f.alphaTest>0&&(m.alphaTest.value=f.alphaTest)}function l(m,f){m.diffuse.value.copy(f.color),m.opacity.value=f.opacity,m.rotation.value=f.rotation,f.map&&(m.map.value=f.map,t(f.map,m.mapTransform)),f.alphaMap&&(m.alphaMap.value=f.alphaMap,t(f.alphaMap,m.alphaMapTransform)),f.alphaTest>0&&(m.alphaTest.value=f.alphaTest)}function h(m,f){m.specular.value.copy(f.specular),m.shininess.value=Math.max(f.shininess,1e-4)}function u(m,f){f.gradientMap&&(m.gradientMap.value=f.gradientMap)}function d(m,f){m.metalness.value=f.metalness,f.metalnessMap&&(m.metalnessMap.value=f.metalnessMap,t(f.metalnessMap,m.metalnessMapTransform)),m.roughness.value=f.roughness,f.roughnessMap&&(m.roughnessMap.value=f.roughnessMap,t(f.roughnessMap,m.roughnessMapTransform)),f.envMap&&(m.envMapIntensity.value=f.envMapIntensity)}function p(m,f,M){m.ior.value=f.ior,f.sheen>0&&(m.sheenColor.value.copy(f.sheenColor).multiplyScalar(f.sheen),m.sheenRoughness.value=f.sheenRoughness,f.sheenColorMap&&(m.sheenColorMap.value=f.sheenColorMap,t(f.sheenColorMap,m.sheenColorMapTransform)),f.sheenRoughnessMap&&(m.sheenRoughnessMap.value=f.sheenRoughnessMap,t(f.sheenRoughnessMap,m.sheenRoughnessMapTransform))),f.clearcoat>0&&(m.clearcoat.value=f.clearcoat,m.clearcoatRoughness.value=f.clearcoatRoughness,f.clearcoatMap&&(m.clearcoatMap.value=f.clearcoatMap,t(f.clearcoatMap,m.clearcoatMapTransform)),f.clearcoatRoughnessMap&&(m.clearcoatRoughnessMap.value=f.clearcoatRoughnessMap,t(f.clearcoatRoughnessMap,m.clearcoatRoughnessMapTransform)),f.clearcoatNormalMap&&(m.clearcoatNormalMap.value=f.clearcoatNormalMap,t(f.clearcoatNormalMap,m.clearcoatNormalMapTransform),m.clearcoatNormalScale.value.copy(f.clearcoatNormalScale),f.side===Cn&&m.clearcoatNormalScale.value.negate())),f.dispersion>0&&(m.dispersion.value=f.dispersion),f.iridescence>0&&(m.iridescence.value=f.iridescence,m.iridescenceIOR.value=f.iridescenceIOR,m.iridescenceThicknessMinimum.value=f.iridescenceThicknessRange[0],m.iridescenceThicknessMaximum.value=f.iridescenceThicknessRange[1],f.iridescenceMap&&(m.iridescenceMap.value=f.iridescenceMap,t(f.iridescenceMap,m.iridescenceMapTransform)),f.iridescenceThicknessMap&&(m.iridescenceThicknessMap.value=f.iridescenceThicknessMap,t(f.iridescenceThicknessMap,m.iridescenceThicknessMapTransform))),f.transmission>0&&(m.transmission.value=f.transmission,m.transmissionSamplerMap.value=M.texture,m.transmissionSamplerSize.value.set(M.width,M.height),f.transmissionMap&&(m.transmissionMap.value=f.transmissionMap,t(f.transmissionMap,m.transmissionMapTransform)),m.thickness.value=f.thickness,f.thicknessMap&&(m.thicknessMap.value=f.thicknessMap,t(f.thicknessMap,m.thicknessMapTransform)),m.attenuationDistance.value=f.attenuationDistance,m.attenuationColor.value.copy(f.attenuationColor)),f.anisotropy>0&&(m.anisotropyVector.value.set(f.anisotropy*Math.cos(f.anisotropyRotation),f.anisotropy*Math.sin(f.anisotropyRotation)),f.anisotropyMap&&(m.anisotropyMap.value=f.anisotropyMap,t(f.anisotropyMap,m.anisotropyMapTransform))),m.specularIntensity.value=f.specularIntensity,m.specularColor.value.copy(f.specularColor),f.specularColorMap&&(m.specularColorMap.value=f.specularColorMap,t(f.specularColorMap,m.specularColorMapTransform)),f.specularIntensityMap&&(m.specularIntensityMap.value=f.specularIntensityMap,t(f.specularIntensityMap,m.specularIntensityMapTransform))}function g(m,f){f.matcap&&(m.matcap.value=f.matcap)}function b(m,f){const M=e.get(f).light;m.referencePosition.value.setFromMatrixPosition(M.matrixWorld),m.nearDistance.value=M.shadow.camera.near,m.farDistance.value=M.shadow.camera.far}return{refreshFogUniforms:n,refreshMaterialUniforms:r}}function W_(i,e,t,n){let r={},s={},o=[];const a=i.getParameter(i.MAX_UNIFORM_BUFFER_BINDINGS);function c(M,x){const _=x.program;n.uniformBlockBinding(M,_)}function l(M,x){let _=r[M.id];_===void 0&&(g(M),_=h(M),r[M.id]=_,M.addEventListener("dispose",m));const I=x.program;n.updateUBOMapping(M,I);const R=e.render.frame;s[M.id]!==R&&(d(M),s[M.id]=R)}function h(M){const x=u();M.__bindingPointIndex=x;const _=i.createBuffer(),I=M.__size,R=M.usage;return i.bindBuffer(i.UNIFORM_BUFFER,_),i.bufferData(i.UNIFORM_BUFFER,I,R),i.bindBuffer(i.UNIFORM_BUFFER,null),i.bindBufferBase(i.UNIFORM_BUFFER,x,_),_}function u(){for(let M=0;M<a;M++)if(o.indexOf(M)===-1)return o.push(M),M;return console.error("THREE.WebGLRenderer: Maximum number of simultaneously usable uniforms groups reached."),0}function d(M){const x=r[M.id],_=M.uniforms,I=M.__cache;i.bindBuffer(i.UNIFORM_BUFFER,x);for(let R=0,T=_.length;R<T;R++){const F=Array.isArray(_[R])?_[R]:[_[R]];for(let S=0,v=F.length;S<v;S++){const P=F[S];if(p(P,R,S,I)===!0){const Q=P.__offset,G=Array.isArray(P.value)?P.value:[P.value];let ae=0;for(let oe=0;oe<G.length;oe++){const ne=G[oe],he=b(ne);typeof ne=="number"||typeof ne=="boolean"?(P.__data[0]=ne,i.bufferSubData(i.UNIFORM_BUFFER,Q+ae,P.__data)):ne.isMatrix3?(P.__data[0]=ne.elements[0],P.__data[1]=ne.elements[1],P.__data[2]=ne.elements[2],P.__data[3]=0,P.__data[4]=ne.elements[3],P.__data[5]=ne.elements[4],P.__data[6]=ne.elements[5],P.__data[7]=0,P.__data[8]=ne.elements[6],P.__data[9]=ne.elements[7],P.__data[10]=ne.elements[8],P.__data[11]=0):(ne.toArray(P.__data,ae),ae+=he.storage/Float32Array.BYTES_PER_ELEMENT)}i.bufferSubData(i.UNIFORM_BUFFER,Q,P.__data)}}}i.bindBuffer(i.UNIFORM_BUFFER,null)}function p(M,x,_,I){const R=M.value,T=x+"_"+_;if(I[T]===void 0)return typeof R=="number"||typeof R=="boolean"?I[T]=R:I[T]=R.clone(),!0;{const F=I[T];if(typeof R=="number"||typeof R=="boolean"){if(F!==R)return I[T]=R,!0}else if(F.equals(R)===!1)return F.copy(R),!0}return!1}function g(M){const x=M.uniforms;let _=0;const I=16;for(let T=0,F=x.length;T<F;T++){const S=Array.isArray(x[T])?x[T]:[x[T]];for(let v=0,P=S.length;v<P;v++){const Q=S[v],G=Array.isArray(Q.value)?Q.value:[Q.value];for(let ae=0,oe=G.length;ae<oe;ae++){const ne=G[ae],he=b(ne),L=_%I,W=L%he.boundary,q=L+W;_+=W,q!==0&&I-q<he.storage&&(_+=I-q),Q.__data=new Float32Array(he.storage/Float32Array.BYTES_PER_ELEMENT),Q.__offset=_,_+=he.storage}}}const R=_%I;return R>0&&(_+=I-R),M.__size=_,M.__cache={},this}function b(M){const x={boundary:0,storage:0};return typeof M=="number"||typeof M=="boolean"?(x.boundary=4,x.storage=4):M.isVector2?(x.boundary=8,x.storage=8):M.isVector3||M.isColor?(x.boundary=16,x.storage=12):M.isVector4?(x.boundary=16,x.storage=16):M.isMatrix3?(x.boundary=48,x.storage=48):M.isMatrix4?(x.boundary=64,x.storage=64):M.isTexture?console.warn("THREE.WebGLRenderer: Texture samplers can not be part of an uniforms group."):console.warn("THREE.WebGLRenderer: Unsupported uniform value type.",M),x}function m(M){const x=M.target;x.removeEventListener("dispose",m);const _=o.indexOf(x.__bindingPointIndex);o.splice(_,1),i.deleteBuffer(r[x.id]),delete r[x.id],delete s[x.id]}function f(){for(const M in r)i.deleteBuffer(r[M]);o=[],r={},s={}}return{bind:c,update:l,dispose:f}}class q_{constructor(e={}){const{canvas:t=Ip(),context:n=null,depth:r=!0,stencil:s=!1,alpha:o=!1,antialias:a=!1,premultipliedAlpha:c=!0,preserveDrawingBuffer:l=!1,powerPreference:h="default",failIfMajorPerformanceCaveat:u=!1,reverseDepthBuffer:d=!1}=e;this.isWebGLRenderer=!0;let p;if(n!==null){if(typeof WebGLRenderingContext<"u"&&n instanceof WebGLRenderingContext)throw new Error("THREE.WebGLRenderer: WebGL 1 is not supported since r163.");p=n.getContextAttributes().alpha}else p=o;const g=new Uint32Array(4),b=new Int32Array(4);let m=null,f=null;const M=[],x=[];this.domElement=t,this.debug={checkShaderErrors:!0,onShaderError:null},this.autoClear=!0,this.autoClearColor=!0,this.autoClearDepth=!0,this.autoClearStencil=!0,this.sortObjects=!0,this.clippingPlanes=[],this.localClippingEnabled=!1,this._outputColorSpace=ln,this.toneMapping=lr,this.toneMappingExposure=1;const _=this;let I=!1,R=0,T=0,F=null,S=-1,v=null;const P=new mt,Q=new mt;let G=null;const ae=new st(0);let oe=0,ne=t.width,he=t.height,L=1,W=null,q=null;const j=new mt(0,0,ne,he),ee=new mt(0,0,ne,he);let ue=!1;const X=new Xl;let re=!1,xe=!1;const me=new ot,Te=new ot,ke=new A,He=new mt,Ze={background:null,fog:null,environment:null,overrideMaterial:null,isScene:!0};let Ce=!1;function rt(){return F===null?L:1}let N=n;function Ft(w,k){return t.getContext(w,k)}try{const w={alpha:!0,depth:r,stencil:s,antialias:a,premultipliedAlpha:c,preserveDrawingBuffer:l,powerPreference:h,failIfMajorPerformanceCaveat:u};if("setAttribute"in t&&t.setAttribute("data-engine",`three.js r${Ol}`),t.addEventListener("webglcontextlost",_e,!1),t.addEventListener("webglcontextrestored",Fe,!1),t.addEventListener("webglcontextcreationerror",Ie,!1),N===null){const k="webgl2";if(N=Ft(k,w),N===null)throw Ft(k)?new Error("Error creating WebGL context with your selected attributes."):new Error("Error creating WebGL context.")}}catch(w){throw console.error("THREE.WebGLRenderer: "+w.message),w}let pt,ct,Ne,Ut,it,C,y,Z,ge,be,fe,Je,Le,Be,Rt,Se,ze,et,at,Ve,Mt,bt,Lt,O;function De(){pt=new Y0(N),pt.init(),bt=new F_(N,pt),ct=new W0(N,pt,e,bt),Ne=new D_(N,pt),ct.reverseDepthBuffer&&d&&Ne.buffers.depth.setReversed(!0),Ut=new J0(N),it=new b_,C=new N_(N,pt,Ne,it,ct,bt,Ut),y=new j0(_),Z=new K0(_),ge=new om(N),Lt=new V0(N,ge),be=new $0(N,ge,Ut,Lt),fe=new tb(N,be,ge,Ut),at=new eb(N,ct,C),Se=new q0(it),Je=new g_(_,y,Z,pt,ct,Lt,Se),Le=new G_(_,it),Be=new x_,Rt=new E_(pt),et=new H0(_,y,Z,Ne,fe,p,c),ze=new P_(_,fe,ct),O=new W_(N,Ut,ct,Ne),Ve=new G0(N,pt,Ut),Mt=new Z0(N,pt,Ut),Ut.programs=Je.programs,_.capabilities=ct,_.extensions=pt,_.properties=it,_.renderLists=Be,_.shadowMap=ze,_.state=Ne,_.info=Ut}De();const le=new H_(_,N);this.xr=le,this.getContext=function(){return N},this.getContextAttributes=function(){return N.getContextAttributes()},this.forceContextLoss=function(){const w=pt.get("WEBGL_lose_context");w&&w.loseContext()},this.forceContextRestore=function(){const w=pt.get("WEBGL_lose_context");w&&w.restoreContext()},this.getPixelRatio=function(){return L},this.setPixelRatio=function(w){w!==void 0&&(L=w,this.setSize(ne,he,!1))},this.getSize=function(w){return w.set(ne,he)},this.setSize=function(w,k,te=!0){if(le.isPresenting){console.warn("THREE.WebGLRenderer: Can't change size while VR device is presenting.");return}ne=w,he=k,t.width=Math.floor(w*L),t.height=Math.floor(k*L),te===!0&&(t.style.width=w+"px",t.style.height=k+"px"),this.setViewport(0,0,w,k)},this.getDrawingBufferSize=function(w){return w.set(ne*L,he*L).floor()},this.setDrawingBufferSize=function(w,k,te){ne=w,he=k,L=te,t.width=Math.floor(w*te),t.height=Math.floor(k*te),this.setViewport(0,0,w,k)},this.getCurrentViewport=function(w){return w.copy(P)},this.getViewport=function(w){return w.copy(j)},this.setViewport=function(w,k,te,ie){w.isVector4?j.set(w.x,w.y,w.z,w.w):j.set(w,k,te,ie),Ne.viewport(P.copy(j).multiplyScalar(L).round())},this.getScissor=function(w){return w.copy(ee)},this.setScissor=function(w,k,te,ie){w.isVector4?ee.set(w.x,w.y,w.z,w.w):ee.set(w,k,te,ie),Ne.scissor(Q.copy(ee).multiplyScalar(L).round())},this.getScissorTest=function(){return ue},this.setScissorTest=function(w){Ne.setScissorTest(ue=w)},this.setOpaqueSort=function(w){W=w},this.setTransparentSort=function(w){q=w},this.getClearColor=function(w){return w.copy(et.getClearColor())},this.setClearColor=function(){et.setClearColor.apply(et,arguments)},this.getClearAlpha=function(){return et.getClearAlpha()},this.setClearAlpha=function(){et.setClearAlpha.apply(et,arguments)},this.clear=function(w=!0,k=!0,te=!0){let ie=0;if(w){let z=!1;if(F!==null){const Ee=F.texture.format;z=Ee===Wl||Ee===Gl||Ee===Vl}if(z){const Ee=F.texture.type,Ue=Ee===qi||Ee===Nr||Ee===io||Ee===vs||Ee===Bl||Ee===zl,Qe=et.getClearColor(),Ye=et.getClearAlpha(),ut=Qe.r,gt=Qe.g,We=Qe.b;Ue?(g[0]=ut,g[1]=gt,g[2]=We,g[3]=Ye,N.clearBufferuiv(N.COLOR,0,g)):(b[0]=ut,b[1]=gt,b[2]=We,b[3]=Ye,N.clearBufferiv(N.COLOR,0,b))}else ie|=N.COLOR_BUFFER_BIT}k&&(ie|=N.DEPTH_BUFFER_BIT),te&&(ie|=N.STENCIL_BUFFER_BIT,this.state.buffers.stencil.setMask(4294967295)),N.clear(ie)},this.clearColor=function(){this.clear(!0,!1,!1)},this.clearDepth=function(){this.clear(!1,!0,!1)},this.clearStencil=function(){this.clear(!1,!1,!0)},this.dispose=function(){t.removeEventListener("webglcontextlost",_e,!1),t.removeEventListener("webglcontextrestored",Fe,!1),t.removeEventListener("webglcontextcreationerror",Ie,!1),Be.dispose(),Rt.dispose(),it.dispose(),y.dispose(),Z.dispose(),fe.dispose(),Lt.dispose(),O.dispose(),Je.dispose(),le.dispose(),le.removeEventListener("sessionstart",Bn),le.removeEventListener("sessionend",mr),ti.stop()};function _e(w){w.preventDefault(),console.log("THREE.WebGLRenderer: Context Lost."),I=!0}function Fe(){console.log("THREE.WebGLRenderer: Context Restored."),I=!1;const w=Ut.autoReset,k=ze.enabled,te=ze.autoUpdate,ie=ze.needsUpdate,z=ze.type;De(),Ut.autoReset=w,ze.enabled=k,ze.autoUpdate=te,ze.needsUpdate=ie,ze.type=z}function Ie(w){console.error("THREE.WebGLRenderer: A WebGL context could not be created. Reason: ",w.statusMessage)}function ft(w){const k=w.target;k.removeEventListener("dispose",ft),$t(k)}function $t(w){fn(w),it.remove(w)}function fn(w){const k=it.get(w).programs;k!==void 0&&(k.forEach(function(te){Je.releaseProgram(te)}),w.isShaderMaterial&&Je.releaseShaderCache(w))}this.renderBufferDirect=function(w,k,te,ie,z,Ee){k===null&&(k=Ze);const Ue=z.isMesh&&z.matrixWorld.determinant()<0,Qe=Da(w,k,te,ie,z);Ne.setMaterial(ie,Ue);let Ye=te.index,ut=1;if(ie.wireframe===!0){if(Ye=be.getWireframeAttribute(te),Ye===void 0)return;ut=2}const gt=te.drawRange,We=te.attributes.position;let Et=gt.start*ut,kt=(gt.start+gt.count)*ut;Ee!==null&&(Et=Math.max(Et,Ee.start*ut),kt=Math.min(kt,(Ee.start+Ee.count)*ut)),Ye!==null?(Et=Math.max(Et,0),kt=Math.min(kt,Ye.count)):We!=null&&(Et=Math.max(Et,0),kt=Math.min(kt,We.count));const Kt=kt-Et;if(Kt<0||Kt===1/0)return;Lt.setup(z,ie,Qe,te,Ye);let pn,It=Ve;if(Ye!==null&&(pn=ge.get(Ye),It=Mt,It.setIndex(pn)),z.isMesh)ie.wireframe===!0?(Ne.setLineWidth(ie.wireframeLinewidth*rt()),It.setMode(N.LINES)):It.setMode(N.TRIANGLES);else if(z.isLine){let Oe=ie.linewidth;Oe===void 0&&(Oe=1),Ne.setLineWidth(Oe*rt()),z.isLineSegments?It.setMode(N.LINES):z.isLineLoop?It.setMode(N.LINE_LOOP):It.setMode(N.LINE_STRIP)}else z.isPoints?It.setMode(N.POINTS):z.isSprite&&It.setMode(N.TRIANGLES);if(z.isBatchedMesh)if(z._multiDrawInstances!==null)It.renderMultiDrawInstances(z._multiDrawStarts,z._multiDrawCounts,z._multiDrawCount,z._multiDrawInstances);else if(pt.get("WEBGL_multi_draw"))It.renderMultiDraw(z._multiDrawStarts,z._multiDrawCounts,z._multiDrawCount);else{const Oe=z._multiDrawStarts,zn=z._multiDrawCounts,Pt=z._multiDrawCount,In=Ye?ge.get(Ye).bytesPerElement:1,Xi=it.get(ie).currentProgram.getUniforms();for(let tn=0;tn<Pt;tn++)Xi.setValue(N,"_gl_DrawID",tn),It.render(Oe[tn]/In,zn[tn])}else if(z.isInstancedMesh)It.renderInstances(Et,Kt,z.count);else if(te.isInstancedBufferGeometry){const Oe=te._maxInstanceCount!==void 0?te._maxInstanceCount:1/0,zn=Math.min(te.instanceCount,Oe);It.renderInstances(Et,Kt,zn)}else It.render(Et,Kt)};function Dt(w,k,te){w.transparent===!0&&w.side===xi&&w.forceSinglePass===!1?(w.side=Cn,w.needsUpdate=!0,Or(w,k,te),w.side=Wi,w.needsUpdate=!0,Or(w,k,te),w.side=xi):Or(w,k,te)}this.compile=function(w,k,te=null){te===null&&(te=w),f=Rt.get(te),f.init(k),x.push(f),te.traverseVisible(function(z){z.isLight&&z.layers.test(k.layers)&&(f.pushLight(z),z.castShadow&&f.pushShadow(z))}),w!==te&&w.traverseVisible(function(z){z.isLight&&z.layers.test(k.layers)&&(f.pushLight(z),z.castShadow&&f.pushShadow(z))}),f.setupLights();const ie=new Set;return w.traverse(function(z){if(!(z.isMesh||z.isPoints||z.isLine||z.isSprite))return;const Ee=z.material;if(Ee)if(Array.isArray(Ee))for(let Ue=0;Ue<Ee.length;Ue++){const Qe=Ee[Ue];Dt(Qe,te,z),ie.add(Qe)}else Dt(Ee,te,z),ie.add(Ee)}),x.pop(),f=null,ie},this.compileAsync=function(w,k,te=null){const ie=this.compile(w,k,te);return new Promise(z=>{function Ee(){if(ie.forEach(function(Ue){it.get(Ue).currentProgram.isReady()&&ie.delete(Ue)}),ie.size===0){z(w);return}setTimeout(Ee,10)}pt.get("KHR_parallel_shader_compile")!==null?Ee():setTimeout(Ee,10)})};let Dn=null;function Xn(w){Dn&&Dn(w)}function Bn(){ti.stop()}function mr(){ti.start()}const ti=new Cd;ti.setAnimationLoop(Xn),typeof self<"u"&&ti.setContext(self),this.setAnimationLoop=function(w){Dn=w,le.setAnimationLoop(w),w===null?ti.stop():ti.start()},le.addEventListener("sessionstart",Bn),le.addEventListener("sessionend",mr),this.render=function(w,k){if(k!==void 0&&k.isCamera!==!0){console.error("THREE.WebGLRenderer.render: camera is not an instance of THREE.Camera.");return}if(I===!0)return;if(w.matrixWorldAutoUpdate===!0&&w.updateMatrixWorld(),k.parent===null&&k.matrixWorldAutoUpdate===!0&&k.updateMatrixWorld(),le.enabled===!0&&le.isPresenting===!0&&(le.cameraAutoUpdate===!0&&le.updateCamera(k),k=le.getCamera()),w.isScene===!0&&w.onBeforeRender(_,w,k,F),f=Rt.get(w,x.length),f.init(k),x.push(f),Te.multiplyMatrices(k.projectionMatrix,k.matrixWorldInverse),X.setFromProjectionMatrix(Te),xe=this.localClippingEnabled,re=Se.init(this.clippingPlanes,xe),m=Be.get(w,M.length),m.init(),M.push(m),le.enabled===!0&&le.isPresenting===!0){const Ee=_.xr.getDepthSensingMesh();Ee!==null&&Us(Ee,k,-1/0,_.sortObjects)}Us(w,k,0,_.sortObjects),m.finish(),_.sortObjects===!0&&m.sort(W,q),Ce=le.enabled===!1||le.isPresenting===!1||le.hasDepthSensing()===!1,Ce&&et.addToRenderList(m,w),this.info.render.frame++,re===!0&&Se.beginShadows();const te=f.state.shadowsArray;ze.render(te,w,k),re===!0&&Se.endShadows(),this.info.autoReset===!0&&this.info.reset();const ie=m.opaque,z=m.transmissive;if(f.setupLights(),k.isArrayCamera){const Ee=k.cameras;if(z.length>0)for(let Ue=0,Qe=Ee.length;Ue<Qe;Ue++){const Ye=Ee[Ue];mo(ie,z,w,Ye)}Ce&&et.render(w);for(let Ue=0,Qe=Ee.length;Ue<Qe;Ue++){const Ye=Ee[Ue];po(m,w,Ye,Ye.viewport)}}else z.length>0&&mo(ie,z,w,k),Ce&&et.render(w),po(m,w,k);F!==null&&(C.updateMultisampleRenderTarget(F),C.updateRenderTargetMipmap(F)),w.isScene===!0&&w.onAfterRender(_,w,k),Lt.resetDefaultState(),S=-1,v=null,x.pop(),x.length>0?(f=x[x.length-1],re===!0&&Se.setGlobalState(_.clippingPlanes,f.state.camera)):f=null,M.pop(),M.length>0?m=M[M.length-1]:m=null};function Us(w,k,te,ie){if(w.visible===!1)return;if(w.layers.test(k.layers)){if(w.isGroup)te=w.renderOrder;else if(w.isLOD)w.autoUpdate===!0&&w.update(k);else if(w.isLight)f.pushLight(w),w.castShadow&&f.pushShadow(w);else if(w.isSprite){if(!w.frustumCulled||X.intersectsSprite(w)){ie&&He.setFromMatrixPosition(w.matrixWorld).applyMatrix4(Te);const Ue=fe.update(w),Qe=w.material;Qe.visible&&m.push(w,Ue,Qe,te,He.z,null)}}else if((w.isMesh||w.isLine||w.isPoints)&&(!w.frustumCulled||X.intersectsObject(w))){const Ue=fe.update(w),Qe=w.material;if(ie&&(w.boundingSphere!==void 0?(w.boundingSphere===null&&w.computeBoundingSphere(),He.copy(w.boundingSphere.center)):(Ue.boundingSphere===null&&Ue.computeBoundingSphere(),He.copy(Ue.boundingSphere.center)),He.applyMatrix4(w.matrixWorld).applyMatrix4(Te)),Array.isArray(Qe)){const Ye=Ue.groups;for(let ut=0,gt=Ye.length;ut<gt;ut++){const We=Ye[ut],Et=Qe[We.materialIndex];Et&&Et.visible&&m.push(w,Ue,Et,te,He.z,We)}}else Qe.visible&&m.push(w,Ue,Qe,te,He.z,null)}}const Ee=w.children;for(let Ue=0,Qe=Ee.length;Ue<Qe;Ue++)Us(Ee[Ue],k,te,ie)}function po(w,k,te,ie){const z=w.opaque,Ee=w.transmissive,Ue=w.transparent;f.setupLightsView(te),re===!0&&Se.setGlobalState(_.clippingPlanes,te),ie&&Ne.viewport(P.copy(ie)),z.length>0&&ji(z,k,te),Ee.length>0&&ji(Ee,k,te),Ue.length>0&&ji(Ue,k,te),Ne.buffers.depth.setTest(!0),Ne.buffers.depth.setMask(!0),Ne.buffers.color.setMask(!0),Ne.setPolygonOffset(!1)}function mo(w,k,te,ie){if((te.isScene===!0?te.overrideMaterial:null)!==null)return;f.state.transmissionRenderTarget[ie.id]===void 0&&(f.state.transmissionRenderTarget[ie.id]=new ur(1,1,{generateMipmaps:!0,type:pt.has("EXT_color_buffer_half_float")||pt.has("EXT_color_buffer_float")?ho:qi,minFilter:Oi,samples:4,stencilBuffer:s,resolveDepthBuffer:!1,resolveStencilBuffer:!1,colorSpace:Ct.workingColorSpace}));const Ee=f.state.transmissionRenderTarget[ie.id],Ue=ie.viewport||P;Ee.setSize(Ue.z,Ue.w);const Qe=_.getRenderTarget();_.setRenderTarget(Ee),_.getClearColor(ae),oe=_.getClearAlpha(),oe<1&&_.setClearColor(16777215,.5),_.clear(),Ce&&et.render(te);const Ye=_.toneMapping;_.toneMapping=lr;const ut=ie.viewport;if(ie.viewport!==void 0&&(ie.viewport=void 0),f.setupLightsView(ie),re===!0&&Se.setGlobalState(_.clippingPlanes,ie),ji(w,te,ie),C.updateMultisampleRenderTarget(Ee),C.updateRenderTargetMipmap(Ee),pt.has("WEBGL_multisampled_render_to_texture")===!1){let gt=!1;for(let We=0,Et=k.length;We<Et;We++){const kt=k[We],Kt=kt.object,pn=kt.geometry,It=kt.material,Oe=kt.group;if(It.side===xi&&Kt.layers.test(ie.layers)){const zn=It.side;It.side=Cn,It.needsUpdate=!0,ni(Kt,te,ie,pn,It,Oe),It.side=zn,It.needsUpdate=!0,gt=!0}}gt===!0&&(C.updateMultisampleRenderTarget(Ee),C.updateRenderTargetMipmap(Ee))}_.setRenderTarget(Qe),_.setClearColor(ae,oe),ut!==void 0&&(ie.viewport=ut),_.toneMapping=Ye}function ji(w,k,te){const ie=k.isScene===!0?k.overrideMaterial:null;for(let z=0,Ee=w.length;z<Ee;z++){const Ue=w[z],Qe=Ue.object,Ye=Ue.geometry,ut=ie===null?Ue.material:ie,gt=Ue.group;Qe.layers.test(te.layers)&&ni(Qe,k,te,Ye,ut,gt)}}function ni(w,k,te,ie,z,Ee){w.onBeforeRender(_,k,te,ie,z,Ee),w.modelViewMatrix.multiplyMatrices(te.matrixWorldInverse,w.matrixWorld),w.normalMatrix.getNormalMatrix(w.modelViewMatrix),z.onBeforeRender(_,k,te,ie,w,Ee),z.transparent===!0&&z.side===xi&&z.forceSinglePass===!1?(z.side=Cn,z.needsUpdate=!0,_.renderBufferDirect(te,k,ie,z,w,Ee),z.side=Wi,z.needsUpdate=!0,_.renderBufferDirect(te,k,ie,z,w,Ee),z.side=xi):_.renderBufferDirect(te,k,ie,z,w,Ee),w.onAfterRender(_,k,te,ie,z,Ee)}function Or(w,k,te){k.isScene!==!0&&(k=Ze);const ie=it.get(w),z=f.state.lights,Ee=f.state.shadowsArray,Ue=z.state.version,Qe=Je.getParameters(w,z.state,Ee,k,te),Ye=Je.getProgramCacheKey(Qe);let ut=ie.programs;ie.environment=w.isMeshStandardMaterial?k.environment:null,ie.fog=k.fog,ie.envMap=(w.isMeshStandardMaterial?Z:y).get(w.envMap||ie.environment),ie.envMapRotation=ie.environment!==null&&w.envMap===null?k.environmentRotation:w.envMapRotation,ut===void 0&&(w.addEventListener("dispose",ft),ut=new Map,ie.programs=ut);let gt=ut.get(Ye);if(gt!==void 0){if(ie.currentProgram===gt&&ie.lightsStateVersion===Ue)return bo(w,Qe),gt}else Qe.uniforms=Je.getUniforms(w),w.onBeforeCompile(Qe,_),gt=Je.acquireProgram(Qe,Ye),ut.set(Ye,gt),ie.uniforms=Qe.uniforms;const We=ie.uniforms;return(!w.isShaderMaterial&&!w.isRawShaderMaterial||w.clipping===!0)&&(We.clippingPlanes=Se.uniform),bo(w,Qe),ie.needsLights=Na(w),ie.lightsStateVersion=Ue,ie.needsLights&&(We.ambientLightColor.value=z.state.ambient,We.lightProbe.value=z.state.probe,We.directionalLights.value=z.state.directional,We.directionalLightShadows.value=z.state.directionalShadow,We.spotLights.value=z.state.spot,We.spotLightShadows.value=z.state.spotShadow,We.rectAreaLights.value=z.state.rectArea,We.ltc_1.value=z.state.rectAreaLTC1,We.ltc_2.value=z.state.rectAreaLTC2,We.pointLights.value=z.state.point,We.pointLightShadows.value=z.state.pointShadow,We.hemisphereLights.value=z.state.hemi,We.directionalShadowMap.value=z.state.directionalShadowMap,We.directionalShadowMatrix.value=z.state.directionalShadowMatrix,We.spotShadowMap.value=z.state.spotShadowMap,We.spotLightMatrix.value=z.state.spotLightMatrix,We.spotLightMap.value=z.state.spotLightMap,We.pointShadowMap.value=z.state.pointShadowMap,We.pointShadowMatrix.value=z.state.pointShadowMatrix),ie.currentProgram=gt,ie.uniformsList=null,gt}function go(w){if(w.uniformsList===null){const k=w.currentProgram.getUniforms();w.uniformsList=ca.seqWithValue(k.seq,w.uniforms)}return w.uniformsList}function bo(w,k){const te=it.get(w);te.outputColorSpace=k.outputColorSpace,te.batching=k.batching,te.batchingColor=k.batchingColor,te.instancing=k.instancing,te.instancingColor=k.instancingColor,te.instancingMorph=k.instancingMorph,te.skinning=k.skinning,te.morphTargets=k.morphTargets,te.morphNormals=k.morphNormals,te.morphColors=k.morphColors,te.morphTargetsCount=k.morphTargetsCount,te.numClippingPlanes=k.numClippingPlanes,te.numIntersection=k.numClipIntersection,te.vertexAlphas=k.vertexAlphas,te.vertexTangents=k.vertexTangents,te.toneMapping=k.toneMapping}function Da(w,k,te,ie,z){k.isScene!==!0&&(k=Ze),C.resetTextureUnits();const Ee=k.fog,Ue=ie.isMeshStandardMaterial?k.environment:null,Qe=F===null?_.outputColorSpace:F.isXRRenderTarget===!0?F.texture.colorSpace:Ln,Ye=(ie.isMeshStandardMaterial?Z:y).get(ie.envMap||Ue),ut=ie.vertexColors===!0&&!!te.attributes.color&&te.attributes.color.itemSize===4,gt=!!te.attributes.tangent&&(!!ie.normalMap||ie.anisotropy>0),We=!!te.morphAttributes.position,Et=!!te.morphAttributes.normal,kt=!!te.morphAttributes.color;let Kt=lr;ie.toneMapped&&(F===null||F.isXRRenderTarget===!0)&&(Kt=_.toneMapping);const pn=te.morphAttributes.position||te.morphAttributes.normal||te.morphAttributes.color,It=pn!==void 0?pn.length:0,Oe=it.get(ie),zn=f.state.lights;if(re===!0&&(xe===!0||w!==v)){const yn=w===v&&ie.id===S;Se.setState(ie,w,yn)}let Pt=!1;ie.version===Oe.__version?(Oe.needsLights&&Oe.lightsStateVersion!==zn.state.version||Oe.outputColorSpace!==Qe||z.isBatchedMesh&&Oe.batching===!1||!z.isBatchedMesh&&Oe.batching===!0||z.isBatchedMesh&&Oe.batchingColor===!0&&z.colorTexture===null||z.isBatchedMesh&&Oe.batchingColor===!1&&z.colorTexture!==null||z.isInstancedMesh&&Oe.instancing===!1||!z.isInstancedMesh&&Oe.instancing===!0||z.isSkinnedMesh&&Oe.skinning===!1||!z.isSkinnedMesh&&Oe.skinning===!0||z.isInstancedMesh&&Oe.instancingColor===!0&&z.instanceColor===null||z.isInstancedMesh&&Oe.instancingColor===!1&&z.instanceColor!==null||z.isInstancedMesh&&Oe.instancingMorph===!0&&z.morphTexture===null||z.isInstancedMesh&&Oe.instancingMorph===!1&&z.morphTexture!==null||Oe.envMap!==Ye||ie.fog===!0&&Oe.fog!==Ee||Oe.numClippingPlanes!==void 0&&(Oe.numClippingPlanes!==Se.numPlanes||Oe.numIntersection!==Se.numIntersection)||Oe.vertexAlphas!==ut||Oe.vertexTangents!==gt||Oe.morphTargets!==We||Oe.morphNormals!==Et||Oe.morphColors!==kt||Oe.toneMapping!==Kt||Oe.morphTargetsCount!==It)&&(Pt=!0):(Pt=!0,Oe.__version=ie.version);let In=Oe.currentProgram;Pt===!0&&(In=Or(ie,k,z));let Xi=!1,tn=!1,gr=!1;const Ot=In.getUniforms(),Nn=Oe.uniforms;if(Ne.useProgram(In.program)&&(Xi=!0,tn=!0,gr=!0),ie.id!==S&&(S=ie.id,tn=!0),Xi||v!==w){Ne.buffers.depth.getReversed()?(me.copy(w.projectionMatrix),Fp(me),Up(me),Ot.setValue(N,"projectionMatrix",me)):Ot.setValue(N,"projectionMatrix",w.projectionMatrix),Ot.setValue(N,"viewMatrix",w.matrixWorldInverse);const fi=Ot.map.cameraPosition;fi!==void 0&&fi.setValue(N,ke.setFromMatrixPosition(w.matrixWorld)),ct.logarithmicDepthBuffer&&Ot.setValue(N,"logDepthBufFC",2/(Math.log(w.far+1)/Math.LN2)),(ie.isMeshPhongMaterial||ie.isMeshToonMaterial||ie.isMeshLambertMaterial||ie.isMeshBasicMaterial||ie.isMeshStandardMaterial||ie.isShaderMaterial)&&Ot.setValue(N,"isOrthographic",w.isOrthographicCamera===!0),v!==w&&(v=w,tn=!0,gr=!0)}if(z.isSkinnedMesh){Ot.setOptional(N,z,"bindMatrix"),Ot.setOptional(N,z,"bindMatrixInverse");const yn=z.skeleton;yn&&(yn.boneTexture===null&&yn.computeBoneTexture(),Ot.setValue(N,"boneTexture",yn.boneTexture,C))}z.isBatchedMesh&&(Ot.setOptional(N,z,"batchingTexture"),Ot.setValue(N,"batchingTexture",z._matricesTexture,C),Ot.setOptional(N,z,"batchingIdTexture"),Ot.setValue(N,"batchingIdTexture",z._indirectTexture,C),Ot.setOptional(N,z,"batchingColorTexture"),z._colorsTexture!==null&&Ot.setValue(N,"batchingColorTexture",z._colorsTexture,C));const br=te.morphAttributes;if((br.position!==void 0||br.normal!==void 0||br.color!==void 0)&&at.update(z,te,In),(tn||Oe.receiveShadow!==z.receiveShadow)&&(Oe.receiveShadow=z.receiveShadow,Ot.setValue(N,"receiveShadow",z.receiveShadow)),ie.isMeshGouraudMaterial&&ie.envMap!==null&&(Nn.envMap.value=Ye,Nn.flipEnvMap.value=Ye.isCubeTexture&&Ye.isRenderTargetTexture===!1?-1:1),ie.isMeshStandardMaterial&&ie.envMap===null&&k.environment!==null&&(Nn.envMapIntensity.value=k.environmentIntensity),tn&&(Ot.setValue(N,"toneMappingExposure",_.toneMappingExposure),Oe.needsLights&&Ia(Nn,gr),Ee&&ie.fog===!0&&Le.refreshFogUniforms(Nn,Ee),Le.refreshMaterialUniforms(Nn,ie,L,he,f.state.transmissionRenderTarget[w.id]),ca.upload(N,go(Oe),Nn,C)),ie.isShaderMaterial&&ie.uniformsNeedUpdate===!0&&(ca.upload(N,go(Oe),Nn,C),ie.uniformsNeedUpdate=!1),ie.isSpriteMaterial&&Ot.setValue(N,"center",z.center),Ot.setValue(N,"modelViewMatrix",z.modelViewMatrix),Ot.setValue(N,"normalMatrix",z.normalMatrix),Ot.setValue(N,"modelMatrix",z.matrixWorld),ie.isShaderMaterial||ie.isRawShaderMaterial){const yn=ie.uniformsGroups;for(let fi=0,Hn=yn.length;fi<Hn;fi++){const Os=yn[fi];O.update(Os,In),O.bind(Os,In)}}return In}function Ia(w,k){w.ambientLightColor.needsUpdate=k,w.lightProbe.needsUpdate=k,w.directionalLights.needsUpdate=k,w.directionalLightShadows.needsUpdate=k,w.pointLights.needsUpdate=k,w.pointLightShadows.needsUpdate=k,w.spotLights.needsUpdate=k,w.spotLightShadows.needsUpdate=k,w.rectAreaLights.needsUpdate=k,w.hemisphereLights.needsUpdate=k}function Na(w){return w.isMeshLambertMaterial||w.isMeshToonMaterial||w.isMeshPhongMaterial||w.isMeshStandardMaterial||w.isShadowMaterial||w.isShaderMaterial&&w.lights===!0}this.getActiveCubeFace=function(){return R},this.getActiveMipmapLevel=function(){return T},this.getRenderTarget=function(){return F},this.setRenderTargetTextures=function(w,k,te){it.get(w.texture).__webglTexture=k,it.get(w.depthTexture).__webglTexture=te;const ie=it.get(w);ie.__hasExternalTextures=!0,ie.__autoAllocateDepthBuffer=te===void 0,ie.__autoAllocateDepthBuffer||pt.has("WEBGL_multisampled_render_to_texture")===!0&&(console.warn("THREE.WebGLRenderer: Render-to-texture extension was disabled because an external texture was provided"),ie.__useRenderToTexture=!1)},this.setRenderTargetFramebuffer=function(w,k){const te=it.get(w);te.__webglFramebuffer=k,te.__useDefaultFramebuffer=k===void 0},this.setRenderTarget=function(w,k=0,te=0){F=w,R=k,T=te;let ie=!0,z=null,Ee=!1,Ue=!1;if(w){const Ye=it.get(w);if(Ye.__useDefaultFramebuffer!==void 0)Ne.bindFramebuffer(N.FRAMEBUFFER,null),ie=!1;else if(Ye.__webglFramebuffer===void 0)C.setupRenderTarget(w);else if(Ye.__hasExternalTextures)C.rebindTextures(w,it.get(w.texture).__webglTexture,it.get(w.depthTexture).__webglTexture);else if(w.depthBuffer){const We=w.depthTexture;if(Ye.__boundDepthTexture!==We){if(We!==null&&it.has(We)&&(w.width!==We.image.width||w.height!==We.image.height))throw new Error("WebGLRenderTarget: Attached DepthTexture is initialized to the incorrect size.");C.setupDepthRenderbuffer(w)}}const ut=w.texture;(ut.isData3DTexture||ut.isDataArrayTexture||ut.isCompressedArrayTexture)&&(Ue=!0);const gt=it.get(w).__webglFramebuffer;w.isWebGLCubeRenderTarget?(Array.isArray(gt[k])?z=gt[k][te]:z=gt[k],Ee=!0):w.samples>0&&C.useMultisampledRTT(w)===!1?z=it.get(w).__webglMultisampledFramebuffer:Array.isArray(gt)?z=gt[te]:z=gt,P.copy(w.viewport),Q.copy(w.scissor),G=w.scissorTest}else P.copy(j).multiplyScalar(L).floor(),Q.copy(ee).multiplyScalar(L).floor(),G=ue;if(Ne.bindFramebuffer(N.FRAMEBUFFER,z)&&ie&&Ne.drawBuffers(w,z),Ne.viewport(P),Ne.scissor(Q),Ne.setScissorTest(G),Ee){const Ye=it.get(w.texture);N.framebufferTexture2D(N.FRAMEBUFFER,N.COLOR_ATTACHMENT0,N.TEXTURE_CUBE_MAP_POSITIVE_X+k,Ye.__webglTexture,te)}else if(Ue){const Ye=it.get(w.texture),ut=k||0;N.framebufferTextureLayer(N.FRAMEBUFFER,N.COLOR_ATTACHMENT0,Ye.__webglTexture,te||0,ut)}S=-1},this.readRenderTargetPixels=function(w,k,te,ie,z,Ee,Ue){if(!(w&&w.isWebGLRenderTarget)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");return}let Qe=it.get(w).__webglFramebuffer;if(w.isWebGLCubeRenderTarget&&Ue!==void 0&&(Qe=Qe[Ue]),Qe){Ne.bindFramebuffer(N.FRAMEBUFFER,Qe);try{const Ye=w.texture,ut=Ye.format,gt=Ye.type;if(!ct.textureFormatReadable(ut)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in RGBA or implementation defined format.");return}if(!ct.textureTypeReadable(gt)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in UnsignedByteType or implementation defined type.");return}k>=0&&k<=w.width-ie&&te>=0&&te<=w.height-z&&N.readPixels(k,te,ie,z,bt.convert(ut),bt.convert(gt),Ee)}finally{const Ye=F!==null?it.get(F).__webglFramebuffer:null;Ne.bindFramebuffer(N.FRAMEBUFFER,Ye)}}},this.readRenderTargetPixelsAsync=async function(w,k,te,ie,z,Ee,Ue){if(!(w&&w.isWebGLRenderTarget))throw new Error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");let Qe=it.get(w).__webglFramebuffer;if(w.isWebGLCubeRenderTarget&&Ue!==void 0&&(Qe=Qe[Ue]),Qe){const Ye=w.texture,ut=Ye.format,gt=Ye.type;if(!ct.textureFormatReadable(ut))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in RGBA or implementation defined format.");if(!ct.textureTypeReadable(gt))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in UnsignedByteType or implementation defined type.");if(k>=0&&k<=w.width-ie&&te>=0&&te<=w.height-z){Ne.bindFramebuffer(N.FRAMEBUFFER,Qe);const We=N.createBuffer();N.bindBuffer(N.PIXEL_PACK_BUFFER,We),N.bufferData(N.PIXEL_PACK_BUFFER,Ee.byteLength,N.STREAM_READ),N.readPixels(k,te,ie,z,bt.convert(ut),bt.convert(gt),0);const Et=F!==null?it.get(F).__webglFramebuffer:null;Ne.bindFramebuffer(N.FRAMEBUFFER,Et);const kt=N.fenceSync(N.SYNC_GPU_COMMANDS_COMPLETE,0);return N.flush(),await Np(N,kt,4),N.bindBuffer(N.PIXEL_PACK_BUFFER,We),N.getBufferSubData(N.PIXEL_PACK_BUFFER,0,Ee),N.deleteBuffer(We),N.deleteSync(kt),Ee}else throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: requested read bounds are out of range.")}},this.copyFramebufferToTexture=function(w,k=null,te=0){w.isTexture!==!0&&(Ys("WebGLRenderer: copyFramebufferToTexture function signature has changed."),k=arguments[0]||null,w=arguments[1]);const ie=Math.pow(2,-te),z=Math.floor(w.image.width*ie),Ee=Math.floor(w.image.height*ie),Ue=k!==null?k.x:0,Qe=k!==null?k.y:0;C.setTexture2D(w,0),N.copyTexSubImage2D(N.TEXTURE_2D,te,0,0,Ue,Qe,z,Ee),Ne.unbindTexture()},this.copyTextureToTexture=function(w,k,te=null,ie=null,z=0){w.isTexture!==!0&&(Ys("WebGLRenderer: copyTextureToTexture function signature has changed."),ie=arguments[0]||null,w=arguments[1],k=arguments[2],z=arguments[3]||0,te=null);let Ee,Ue,Qe,Ye,ut,gt,We,Et,kt;const Kt=w.isCompressedTexture?w.mipmaps[z]:w.image;te!==null?(Ee=te.max.x-te.min.x,Ue=te.max.y-te.min.y,Qe=te.isBox3?te.max.z-te.min.z:1,Ye=te.min.x,ut=te.min.y,gt=te.isBox3?te.min.z:0):(Ee=Kt.width,Ue=Kt.height,Qe=Kt.depth||1,Ye=0,ut=0,gt=0),ie!==null?(We=ie.x,Et=ie.y,kt=ie.z):(We=0,Et=0,kt=0);const pn=bt.convert(k.format),It=bt.convert(k.type);let Oe;k.isData3DTexture?(C.setTexture3D(k,0),Oe=N.TEXTURE_3D):k.isDataArrayTexture||k.isCompressedArrayTexture?(C.setTexture2DArray(k,0),Oe=N.TEXTURE_2D_ARRAY):(C.setTexture2D(k,0),Oe=N.TEXTURE_2D),N.pixelStorei(N.UNPACK_FLIP_Y_WEBGL,k.flipY),N.pixelStorei(N.UNPACK_PREMULTIPLY_ALPHA_WEBGL,k.premultiplyAlpha),N.pixelStorei(N.UNPACK_ALIGNMENT,k.unpackAlignment);const zn=N.getParameter(N.UNPACK_ROW_LENGTH),Pt=N.getParameter(N.UNPACK_IMAGE_HEIGHT),In=N.getParameter(N.UNPACK_SKIP_PIXELS),Xi=N.getParameter(N.UNPACK_SKIP_ROWS),tn=N.getParameter(N.UNPACK_SKIP_IMAGES);N.pixelStorei(N.UNPACK_ROW_LENGTH,Kt.width),N.pixelStorei(N.UNPACK_IMAGE_HEIGHT,Kt.height),N.pixelStorei(N.UNPACK_SKIP_PIXELS,Ye),N.pixelStorei(N.UNPACK_SKIP_ROWS,ut),N.pixelStorei(N.UNPACK_SKIP_IMAGES,gt);const gr=w.isDataArrayTexture||w.isData3DTexture,Ot=k.isDataArrayTexture||k.isData3DTexture;if(w.isRenderTargetTexture||w.isDepthTexture){const Nn=it.get(w),br=it.get(k),yn=it.get(Nn.__renderTarget),fi=it.get(br.__renderTarget);Ne.bindFramebuffer(N.READ_FRAMEBUFFER,yn.__webglFramebuffer),Ne.bindFramebuffer(N.DRAW_FRAMEBUFFER,fi.__webglFramebuffer);for(let Hn=0;Hn<Qe;Hn++)gr&&N.framebufferTextureLayer(N.READ_FRAMEBUFFER,N.COLOR_ATTACHMENT0,it.get(w).__webglTexture,z,gt+Hn),w.isDepthTexture?(Ot&&N.framebufferTextureLayer(N.DRAW_FRAMEBUFFER,N.COLOR_ATTACHMENT0,it.get(k).__webglTexture,z,kt+Hn),N.blitFramebuffer(Ye,ut,Ee,Ue,We,Et,Ee,Ue,N.DEPTH_BUFFER_BIT,N.NEAREST)):Ot?N.copyTexSubImage3D(Oe,z,We,Et,kt+Hn,Ye,ut,Ee,Ue):N.copyTexSubImage2D(Oe,z,We,Et,kt+Hn,Ye,ut,Ee,Ue);Ne.bindFramebuffer(N.READ_FRAMEBUFFER,null),Ne.bindFramebuffer(N.DRAW_FRAMEBUFFER,null)}else Ot?w.isDataTexture||w.isData3DTexture?N.texSubImage3D(Oe,z,We,Et,kt,Ee,Ue,Qe,pn,It,Kt.data):k.isCompressedArrayTexture?N.compressedTexSubImage3D(Oe,z,We,Et,kt,Ee,Ue,Qe,pn,Kt.data):N.texSubImage3D(Oe,z,We,Et,kt,Ee,Ue,Qe,pn,It,Kt):w.isDataTexture?N.texSubImage2D(N.TEXTURE_2D,z,We,Et,Ee,Ue,pn,It,Kt.data):w.isCompressedTexture?N.compressedTexSubImage2D(N.TEXTURE_2D,z,We,Et,Kt.width,Kt.height,pn,Kt.data):N.texSubImage2D(N.TEXTURE_2D,z,We,Et,Ee,Ue,pn,It,Kt);N.pixelStorei(N.UNPACK_ROW_LENGTH,zn),N.pixelStorei(N.UNPACK_IMAGE_HEIGHT,Pt),N.pixelStorei(N.UNPACK_SKIP_PIXELS,In),N.pixelStorei(N.UNPACK_SKIP_ROWS,Xi),N.pixelStorei(N.UNPACK_SKIP_IMAGES,tn),z===0&&k.generateMipmaps&&N.generateMipmap(Oe),Ne.unbindTexture()},this.copyTextureToTexture3D=function(w,k,te=null,ie=null,z=0){return w.isTexture!==!0&&(Ys("WebGLRenderer: copyTextureToTexture3D function signature has changed."),te=arguments[0]||null,ie=arguments[1]||null,w=arguments[2],k=arguments[3],z=arguments[4]||0),Ys('WebGLRenderer: copyTextureToTexture3D function has been deprecated. Use "copyTextureToTexture" instead.'),this.copyTextureToTexture(w,k,te,ie,z)},this.initRenderTarget=function(w){it.get(w).__webglFramebuffer===void 0&&C.setupRenderTarget(w)},this.initTexture=function(w){w.isCubeTexture?C.setTextureCube(w,0):w.isData3DTexture?C.setTexture3D(w,0):w.isDataArrayTexture||w.isCompressedArrayTexture?C.setTexture2DArray(w,0):C.setTexture2D(w,0),Ne.unbindTexture()},this.resetState=function(){R=0,T=0,F=null,Ne.reset(),Lt.reset()},typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}get coordinateSystem(){return ki}get outputColorSpace(){return this._outputColorSpace}set outputColorSpace(e){this._outputColorSpace=e;const t=this.getContext();t.drawingBufferColorspace=Ct._getDrawingBufferColorSpace(e),t.unpackColorSpace=Ct._getUnpackColorSpace()}}class Yl extends en{constructor(){super(),this.isScene=!0,this.type="Scene",this.background=null,this.environment=null,this.fog=null,this.backgroundBlurriness=0,this.backgroundIntensity=1,this.backgroundRotation=new vi,this.environmentIntensity=1,this.environmentRotation=new vi,this.overrideMaterial=null,typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}copy(e,t){return super.copy(e,t),e.background!==null&&(this.background=e.background.clone()),e.environment!==null&&(this.environment=e.environment.clone()),e.fog!==null&&(this.fog=e.fog.clone()),this.backgroundBlurriness=e.backgroundBlurriness,this.backgroundIntensity=e.backgroundIntensity,this.backgroundRotation.copy(e.backgroundRotation),this.environmentIntensity=e.environmentIntensity,this.environmentRotation.copy(e.environmentRotation),e.overrideMaterial!==null&&(this.overrideMaterial=e.overrideMaterial.clone()),this.matrixAutoUpdate=e.matrixAutoUpdate,this}toJSON(e){const t=super.toJSON(e);return this.fog!==null&&(t.object.fog=this.fog.toJSON()),this.backgroundBlurriness>0&&(t.object.backgroundBlurriness=this.backgroundBlurriness),this.backgroundIntensity!==1&&(t.object.backgroundIntensity=this.backgroundIntensity),t.object.backgroundRotation=this.backgroundRotation.toArray(),this.environmentIntensity!==1&&(t.object.environmentIntensity=this.environmentIntensity),t.object.environmentRotation=this.environmentRotation.toArray(),t}}class j_{constructor(e,t){this.isInterleavedBuffer=!0,this.array=e,this.stride=t,this.count=e!==void 0?e.length/t:0,this.usage=vl,this.updateRanges=[],this.version=0,this.uuid=ui()}onUploadCallback(){}set needsUpdate(e){e===!0&&this.version++}setUsage(e){return this.usage=e,this}addUpdateRange(e,t){this.updateRanges.push({start:e,count:t})}clearUpdateRanges(){this.updateRanges.length=0}copy(e){return this.array=new e.array.constructor(e.array),this.count=e.count,this.stride=e.stride,this.usage=e.usage,this}copyAt(e,t,n){e*=this.stride,n*=t.stride;for(let r=0,s=this.stride;r<s;r++)this.array[e+r]=t.array[n+r];return this}set(e,t=0){return this.array.set(e,t),this}clone(e){e.arrayBuffers===void 0&&(e.arrayBuffers={}),this.array.buffer._uuid===void 0&&(this.array.buffer._uuid=ui()),e.arrayBuffers[this.array.buffer._uuid]===void 0&&(e.arrayBuffers[this.array.buffer._uuid]=this.array.slice(0).buffer);const t=new this.array.constructor(e.arrayBuffers[this.array.buffer._uuid]),n=new this.constructor(t,this.stride);return n.setUsage(this.usage),n}onUpload(e){return this.onUploadCallback=e,this}toJSON(e){return e.arrayBuffers===void 0&&(e.arrayBuffers={}),this.array.buffer._uuid===void 0&&(this.array.buffer._uuid=ui()),e.arrayBuffers[this.array.buffer._uuid]===void 0&&(e.arrayBuffers[this.array.buffer._uuid]=Array.from(new Uint32Array(this.array.buffer))),{uuid:this.uuid,buffer:this.array.buffer._uuid,type:this.array.constructor.name,stride:this.stride}}}const An=new A;class $l{constructor(e,t,n,r=!1){this.isInterleavedBufferAttribute=!0,this.name="",this.data=e,this.itemSize=t,this.offset=n,this.normalized=r}get count(){return this.data.count}get array(){return this.data.array}set needsUpdate(e){this.data.needsUpdate=e}applyMatrix4(e){for(let t=0,n=this.data.count;t<n;t++)An.fromBufferAttribute(this,t),An.applyMatrix4(e),this.setXYZ(t,An.x,An.y,An.z);return this}applyNormalMatrix(e){for(let t=0,n=this.count;t<n;t++)An.fromBufferAttribute(this,t),An.applyNormalMatrix(e),this.setXYZ(t,An.x,An.y,An.z);return this}transformDirection(e){for(let t=0,n=this.count;t<n;t++)An.fromBufferAttribute(this,t),An.transformDirection(e),this.setXYZ(t,An.x,An.y,An.z);return this}getComponent(e,t){let n=this.array[e*this.data.stride+this.offset+t];return this.normalized&&(n=ci(n,this.array)),n}setComponent(e,t,n){return this.normalized&&(n=Ht(n,this.array)),this.data.array[e*this.data.stride+this.offset+t]=n,this}setX(e,t){return this.normalized&&(t=Ht(t,this.array)),this.data.array[e*this.data.stride+this.offset]=t,this}setY(e,t){return this.normalized&&(t=Ht(t,this.array)),this.data.array[e*this.data.stride+this.offset+1]=t,this}setZ(e,t){return this.normalized&&(t=Ht(t,this.array)),this.data.array[e*this.data.stride+this.offset+2]=t,this}setW(e,t){return this.normalized&&(t=Ht(t,this.array)),this.data.array[e*this.data.stride+this.offset+3]=t,this}getX(e){let t=this.data.array[e*this.data.stride+this.offset];return this.normalized&&(t=ci(t,this.array)),t}getY(e){let t=this.data.array[e*this.data.stride+this.offset+1];return this.normalized&&(t=ci(t,this.array)),t}getZ(e){let t=this.data.array[e*this.data.stride+this.offset+2];return this.normalized&&(t=ci(t,this.array)),t}getW(e){let t=this.data.array[e*this.data.stride+this.offset+3];return this.normalized&&(t=ci(t,this.array)),t}setXY(e,t,n){return e=e*this.data.stride+this.offset,this.normalized&&(t=Ht(t,this.array),n=Ht(n,this.array)),this.data.array[e+0]=t,this.data.array[e+1]=n,this}setXYZ(e,t,n,r){return e=e*this.data.stride+this.offset,this.normalized&&(t=Ht(t,this.array),n=Ht(n,this.array),r=Ht(r,this.array)),this.data.array[e+0]=t,this.data.array[e+1]=n,this.data.array[e+2]=r,this}setXYZW(e,t,n,r,s){return e=e*this.data.stride+this.offset,this.normalized&&(t=Ht(t,this.array),n=Ht(n,this.array),r=Ht(r,this.array),s=Ht(s,this.array)),this.data.array[e+0]=t,this.data.array[e+1]=n,this.data.array[e+2]=r,this.data.array[e+3]=s,this}clone(e){if(e===void 0){console.log("THREE.InterleavedBufferAttribute.clone(): Cloning an interleaved buffer attribute will de-interleave buffer data.");const t=[];for(let n=0;n<this.count;n++){const r=n*this.data.stride+this.offset;for(let s=0;s<this.itemSize;s++)t.push(this.data.array[r+s])}return new wn(new this.array.constructor(t),this.itemSize,this.normalized)}else return e.interleavedBuffers===void 0&&(e.interleavedBuffers={}),e.interleavedBuffers[this.data.uuid]===void 0&&(e.interleavedBuffers[this.data.uuid]=this.data.clone(e)),new $l(e.interleavedBuffers[this.data.uuid],this.itemSize,this.offset,this.normalized)}toJSON(e){if(e===void 0){console.log("THREE.InterleavedBufferAttribute.toJSON(): Serializing an interleaved buffer attribute will de-interleave buffer data.");const t=[];for(let n=0;n<this.count;n++){const r=n*this.data.stride+this.offset;for(let s=0;s<this.itemSize;s++)t.push(this.data.array[r+s])}return{itemSize:this.itemSize,type:this.array.constructor.name,array:t,normalized:this.normalized}}else return e.interleavedBuffers===void 0&&(e.interleavedBuffers={}),e.interleavedBuffers[this.data.uuid]===void 0&&(e.interleavedBuffers[this.data.uuid]=this.data.toJSON(e)),{isInterleavedBufferAttribute:!0,itemSize:this.itemSize,data:this.data.uuid,offset:this.offset,normalized:this.normalized}}}const du=new A,fu=new mt,pu=new mt,X_=new A,mu=new ot,ko=new A,pc=new yi,gu=new ot,mc=new Rs;class Q_ extends Xt{constructor(e,t){super(e,t),this.isSkinnedMesh=!0,this.type="SkinnedMesh",this.bindMode=mh,this.bindMatrix=new ot,this.bindMatrixInverse=new ot,this.boundingBox=null,this.boundingSphere=null}computeBoundingBox(){const e=this.geometry;this.boundingBox===null&&(this.boundingBox=new an),this.boundingBox.makeEmpty();const t=e.getAttribute("position");for(let n=0;n<t.count;n++)this.getVertexPosition(n,ko),this.boundingBox.expandByPoint(ko)}computeBoundingSphere(){const e=this.geometry;this.boundingSphere===null&&(this.boundingSphere=new yi),this.boundingSphere.makeEmpty();const t=e.getAttribute("position");for(let n=0;n<t.count;n++)this.getVertexPosition(n,ko),this.boundingSphere.expandByPoint(ko)}copy(e,t){return super.copy(e,t),this.bindMode=e.bindMode,this.bindMatrix.copy(e.bindMatrix),this.bindMatrixInverse.copy(e.bindMatrixInverse),this.skeleton=e.skeleton,e.boundingBox!==null&&(this.boundingBox=e.boundingBox.clone()),e.boundingSphere!==null&&(this.boundingSphere=e.boundingSphere.clone()),this}raycast(e,t){const n=this.material,r=this.matrixWorld;n!==void 0&&(this.boundingSphere===null&&this.computeBoundingSphere(),pc.copy(this.boundingSphere),pc.applyMatrix4(r),e.ray.intersectsSphere(pc)!==!1&&(gu.copy(r).invert(),mc.copy(e.ray).applyMatrix4(gu),!(this.boundingBox!==null&&mc.intersectsBox(this.boundingBox)===!1)&&this._computeIntersections(e,t,mc)))}getVertexPosition(e,t){return super.getVertexPosition(e,t),this.applyBoneTransform(e,t),t}bind(e,t){this.skeleton=e,t===void 0&&(this.updateMatrixWorld(!0),this.skeleton.calculateInverses(),t=this.matrixWorld),this.bindMatrix.copy(t),this.bindMatrixInverse.copy(t).invert()}pose(){this.skeleton.pose()}normalizeSkinWeights(){const e=new mt,t=this.geometry.attributes.skinWeight;for(let n=0,r=t.count;n<r;n++){e.fromBufferAttribute(t,n);const s=1/e.manhattanLength();s!==1/0?e.multiplyScalar(s):e.set(1,0,0,0),t.setXYZW(n,e.x,e.y,e.z,e.w)}}updateMatrixWorld(e){super.updateMatrixWorld(e),this.bindMode===mh?this.bindMatrixInverse.copy(this.matrixWorld).invert():this.bindMode===rp?this.bindMatrixInverse.copy(this.bindMatrix).invert():console.warn("THREE.SkinnedMesh: Unrecognized bindMode: "+this.bindMode)}applyBoneTransform(e,t){const n=this.skeleton,r=this.geometry;fu.fromBufferAttribute(r.attributes.skinIndex,e),pu.fromBufferAttribute(r.attributes.skinWeight,e),du.copy(t).applyMatrix4(this.bindMatrix),t.set(0,0,0);for(let s=0;s<4;s++){const o=pu.getComponent(s);if(o!==0){const a=fu.getComponent(s);mu.multiplyMatrices(n.bones[a].matrixWorld,n.boneInverses[a]),t.addScaledVector(X_.copy(du).applyMatrix4(mu),o)}}return t.applyMatrix4(this.bindMatrixInverse)}}class Zl extends en{constructor(){super(),this.isBone=!0,this.type="Bone"}}class Fd extends hn{constructor(e=null,t=1,n=1,r,s,o,a,c,l=Pn,h=Pn,u,d){super(null,o,a,c,l,h,r,s,u,d),this.isDataTexture=!0,this.image={data:e,width:t,height:n},this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}}const bu=new ot,K_=new ot;class Ca{constructor(e=[],t=[]){this.uuid=ui(),this.bones=e.slice(0),this.boneInverses=t,this.boneMatrices=null,this.boneTexture=null,this.init()}init(){const e=this.bones,t=this.boneInverses;if(this.boneMatrices=new Float32Array(e.length*16),t.length===0)this.calculateInverses();else if(e.length!==t.length){console.warn("THREE.Skeleton: Number of inverse bone matrices does not match amount of bones."),this.boneInverses=[];for(let n=0,r=this.bones.length;n<r;n++)this.boneInverses.push(new ot)}}calculateInverses(){this.boneInverses.length=0;for(let e=0,t=this.bones.length;e<t;e++){const n=new ot;this.bones[e]&&n.copy(this.bones[e].matrixWorld).invert(),this.boneInverses.push(n)}}pose(){for(let e=0,t=this.bones.length;e<t;e++){const n=this.bones[e];n&&n.matrixWorld.copy(this.boneInverses[e]).invert()}for(let e=0,t=this.bones.length;e<t;e++){const n=this.bones[e];n&&(n.parent&&n.parent.isBone?(n.matrix.copy(n.parent.matrixWorld).invert(),n.matrix.multiply(n.matrixWorld)):n.matrix.copy(n.matrixWorld),n.matrix.decompose(n.position,n.quaternion,n.scale))}}update(){const e=this.bones,t=this.boneInverses,n=this.boneMatrices,r=this.boneTexture;for(let s=0,o=e.length;s<o;s++){const a=e[s]?e[s].matrixWorld:K_;bu.multiplyMatrices(a,t[s]),bu.toArray(n,s*16)}r!==null&&(r.needsUpdate=!0)}clone(){return new Ca(this.bones,this.boneInverses)}computeBoneTexture(){let e=Math.sqrt(this.bones.length*4);e=Math.ceil(e/4)*4,e=Math.max(e,4);const t=new Float32Array(e*e*4);t.set(this.boneMatrices);const n=new Fd(t,e,e,ei,li);return n.needsUpdate=!0,this.boneMatrices=t,this.boneTexture=n,this}getBoneByName(e){for(let t=0,n=this.bones.length;t<n;t++){const r=this.bones[t];if(r.name===e)return r}}dispose(){this.boneTexture!==null&&(this.boneTexture.dispose(),this.boneTexture=null)}fromJSON(e,t){this.uuid=e.uuid;for(let n=0,r=e.bones.length;n<r;n++){const s=e.bones[n];let o=t[s];o===void 0&&(console.warn("THREE.Skeleton: No bone found with UUID:",s),o=new Zl),this.bones.push(o),this.boneInverses.push(new ot().fromArray(e.boneInverses[n]))}return this.init(),this}toJSON(){const e={metadata:{version:4.6,type:"Skeleton",generator:"Skeleton.toJSON"},bones:[],boneInverses:[]};e.uuid=this.uuid;const t=this.bones,n=this.boneInverses;for(let r=0,s=t.length;r<s;r++){const o=t[r];e.bones.push(o.uuid);const a=n[r];e.boneInverses.push(a.toArray())}return e}}class Sl extends wn{constructor(e,t,n,r=1){super(e,t,n),this.isInstancedBufferAttribute=!0,this.meshPerAttribute=r}copy(e){return super.copy(e),this.meshPerAttribute=e.meshPerAttribute,this}toJSON(){const e=super.toJSON();return e.meshPerAttribute=this.meshPerAttribute,e.isInstancedBufferAttribute=!0,e}}const Zr=new ot,_u=new ot,Bo=[],xu=new an,Y_=new ot,Vs=new Xt,Gs=new yi;class $_ extends Xt{constructor(e,t,n){super(e,t),this.isInstancedMesh=!0,this.instanceMatrix=new Sl(new Float32Array(n*16),16),this.instanceColor=null,this.morphTexture=null,this.count=n,this.boundingBox=null,this.boundingSphere=null;for(let r=0;r<n;r++)this.setMatrixAt(r,Y_)}computeBoundingBox(){const e=this.geometry,t=this.count;this.boundingBox===null&&(this.boundingBox=new an),e.boundingBox===null&&e.computeBoundingBox(),this.boundingBox.makeEmpty();for(let n=0;n<t;n++)this.getMatrixAt(n,Zr),xu.copy(e.boundingBox).applyMatrix4(Zr),this.boundingBox.union(xu)}computeBoundingSphere(){const e=this.geometry,t=this.count;this.boundingSphere===null&&(this.boundingSphere=new yi),e.boundingSphere===null&&e.computeBoundingSphere(),this.boundingSphere.makeEmpty();for(let n=0;n<t;n++)this.getMatrixAt(n,Zr),Gs.copy(e.boundingSphere).applyMatrix4(Zr),this.boundingSphere.union(Gs)}copy(e,t){return super.copy(e,t),this.instanceMatrix.copy(e.instanceMatrix),e.morphTexture!==null&&(this.morphTexture=e.morphTexture.clone()),e.instanceColor!==null&&(this.instanceColor=e.instanceColor.clone()),this.count=e.count,e.boundingBox!==null&&(this.boundingBox=e.boundingBox.clone()),e.boundingSphere!==null&&(this.boundingSphere=e.boundingSphere.clone()),this}getColorAt(e,t){t.fromArray(this.instanceColor.array,e*3)}getMatrixAt(e,t){t.fromArray(this.instanceMatrix.array,e*16)}getMorphAt(e,t){const n=t.morphTargetInfluences,r=this.morphTexture.source.data.data,s=n.length+1,o=e*s+1;for(let a=0;a<n.length;a++)n[a]=r[o+a]}raycast(e,t){const n=this.matrixWorld,r=this.count;if(Vs.geometry=this.geometry,Vs.material=this.material,Vs.material!==void 0&&(this.boundingSphere===null&&this.computeBoundingSphere(),Gs.copy(this.boundingSphere),Gs.applyMatrix4(n),e.ray.intersectsSphere(Gs)!==!1))for(let s=0;s<r;s++){this.getMatrixAt(s,Zr),_u.multiplyMatrices(n,Zr),Vs.matrixWorld=_u,Vs.raycast(e,Bo);for(let o=0,a=Bo.length;o<a;o++){const c=Bo[o];c.instanceId=s,c.object=this,t.push(c)}Bo.length=0}}setColorAt(e,t){this.instanceColor===null&&(this.instanceColor=new Sl(new Float32Array(this.instanceMatrix.count*3).fill(1),3)),t.toArray(this.instanceColor.array,e*3)}setMatrixAt(e,t){t.toArray(this.instanceMatrix.array,e*16)}setMorphAt(e,t){const n=t.morphTargetInfluences,r=n.length+1;this.morphTexture===null&&(this.morphTexture=new Fd(new Float32Array(r*this.count),r,this.count,Hl,li));const s=this.morphTexture.source.data.data;let o=0;for(let l=0;l<n.length;l++)o+=n[l];const a=this.geometry.morphTargetsRelative?1:1-o,c=r*e;s[c]=a,s.set(n,c+1)}updateMorphTargets(){}dispose(){return this.dispatchEvent({type:"dispose"}),this.morphTexture!==null&&(this.morphTexture.dispose(),this.morphTexture=null),this}}class Ud extends di{static get type(){return"LineBasicMaterial"}constructor(e){super(),this.isLineBasicMaterial=!0,this.color=new st(16777215),this.map=null,this.linewidth=1,this.linecap="round",this.linejoin="round",this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.linewidth=e.linewidth,this.linecap=e.linecap,this.linejoin=e.linejoin,this.fog=e.fog,this}}const ba=new A,_a=new A,vu=new ot,Ws=new Rs,zo=new yi,gc=new A,yu=new A;class Jl extends en{constructor(e=new Mi,t=new Ud){super(),this.isLine=!0,this.type="Line",this.geometry=e,this.material=t,this.updateMorphTargets()}copy(e,t){return super.copy(e,t),this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}computeLineDistances(){const e=this.geometry;if(e.index===null){const t=e.attributes.position,n=[0];for(let r=1,s=t.count;r<s;r++)ba.fromBufferAttribute(t,r-1),_a.fromBufferAttribute(t,r),n[r]=n[r-1],n[r]+=ba.distanceTo(_a);e.setAttribute("lineDistance",new Vi(n,1))}else console.warn("THREE.Line.computeLineDistances(): Computation only possible with non-indexed BufferGeometry.");return this}raycast(e,t){const n=this.geometry,r=this.matrixWorld,s=e.params.Line.threshold,o=n.drawRange;if(n.boundingSphere===null&&n.computeBoundingSphere(),zo.copy(n.boundingSphere),zo.applyMatrix4(r),zo.radius+=s,e.ray.intersectsSphere(zo)===!1)return;vu.copy(r).invert(),Ws.copy(e.ray).applyMatrix4(vu);const a=s/((this.scale.x+this.scale.y+this.scale.z)/3),c=a*a,l=this.isLineSegments?2:1,h=n.index,d=n.attributes.position;if(h!==null){const p=Math.max(0,o.start),g=Math.min(h.count,o.start+o.count);for(let b=p,m=g-1;b<m;b+=l){const f=h.getX(b),M=h.getX(b+1),x=Ho(this,e,Ws,c,f,M);x&&t.push(x)}if(this.isLineLoop){const b=h.getX(g-1),m=h.getX(p),f=Ho(this,e,Ws,c,b,m);f&&t.push(f)}}else{const p=Math.max(0,o.start),g=Math.min(d.count,o.start+o.count);for(let b=p,m=g-1;b<m;b+=l){const f=Ho(this,e,Ws,c,b,b+1);f&&t.push(f)}if(this.isLineLoop){const b=Ho(this,e,Ws,c,g-1,p);b&&t.push(b)}}}updateMorphTargets(){const t=this.geometry.morphAttributes,n=Object.keys(t);if(n.length>0){const r=t[n[0]];if(r!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let s=0,o=r.length;s<o;s++){const a=r[s].name||String(s);this.morphTargetInfluences.push(0),this.morphTargetDictionary[a]=s}}}}}function Ho(i,e,t,n,r,s){const o=i.geometry.attributes.position;if(ba.fromBufferAttribute(o,r),_a.fromBufferAttribute(o,s),t.distanceSqToSegment(ba,_a,gc,yu)>n)return;gc.applyMatrix4(i.matrixWorld);const c=e.ray.origin.distanceTo(gc);if(!(c<e.near||c>e.far))return{distance:c,point:yu.clone().applyMatrix4(i.matrixWorld),index:r,face:null,faceIndex:null,barycoord:null,object:i}}const Mu=new A,Su=new A;class Z_ extends Jl{constructor(e,t){super(e,t),this.isLineSegments=!0,this.type="LineSegments"}computeLineDistances(){const e=this.geometry;if(e.index===null){const t=e.attributes.position,n=[];for(let r=0,s=t.count;r<s;r+=2)Mu.fromBufferAttribute(t,r),Su.fromBufferAttribute(t,r+1),n[r]=r===0?0:n[r-1],n[r+1]=n[r]+Mu.distanceTo(Su);e.setAttribute("lineDistance",new Vi(n,1))}else console.warn("THREE.LineSegments.computeLineDistances(): Computation only possible with non-indexed BufferGeometry.");return this}}class J_ extends Jl{constructor(e,t){super(e,t),this.isLineLoop=!0,this.type="LineLoop"}}class Od extends di{static get type(){return"PointsMaterial"}constructor(e){super(),this.isPointsMaterial=!0,this.color=new st(16777215),this.map=null,this.alphaMap=null,this.size=1,this.sizeAttenuation=!0,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.alphaMap=e.alphaMap,this.size=e.size,this.sizeAttenuation=e.sizeAttenuation,this.fog=e.fog,this}}const wu=new ot,wl=new Rs,Vo=new yi,Go=new A;class ex extends en{constructor(e=new Mi,t=new Od){super(),this.isPoints=!0,this.type="Points",this.geometry=e,this.material=t,this.updateMorphTargets()}copy(e,t){return super.copy(e,t),this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}raycast(e,t){const n=this.geometry,r=this.matrixWorld,s=e.params.Points.threshold,o=n.drawRange;if(n.boundingSphere===null&&n.computeBoundingSphere(),Vo.copy(n.boundingSphere),Vo.applyMatrix4(r),Vo.radius+=s,e.ray.intersectsSphere(Vo)===!1)return;wu.copy(r).invert(),wl.copy(e.ray).applyMatrix4(wu);const a=s/((this.scale.x+this.scale.y+this.scale.z)/3),c=a*a,l=n.index,u=n.attributes.position;if(l!==null){const d=Math.max(0,o.start),p=Math.min(l.count,o.start+o.count);for(let g=d,b=p;g<b;g++){const m=l.getX(g);Go.fromBufferAttribute(u,m),Eu(Go,m,c,r,e,t,this)}}else{const d=Math.max(0,o.start),p=Math.min(u.count,o.start+o.count);for(let g=d,b=p;g<b;g++)Go.fromBufferAttribute(u,g),Eu(Go,g,c,r,e,t,this)}}updateMorphTargets(){const t=this.geometry.morphAttributes,n=Object.keys(t);if(n.length>0){const r=t[n[0]];if(r!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let s=0,o=r.length;s<o;s++){const a=r[s].name||String(s);this.morphTargetInfluences.push(0),this.morphTargetDictionary[a]=s}}}}}function Eu(i,e,t,n,r,s,o){const a=wl.distanceSqToPoint(i);if(a<t){const c=new A;wl.closestPointToPoint(i,c),c.applyMatrix4(n);const l=r.ray.origin.distanceTo(c);if(l<r.near||l>r.far)return;s.push({distance:l,distanceToRay:Math.sqrt(a),point:c,index:e,face:null,faceIndex:null,barycoord:null,object:o})}}class tx extends hn{constructor(e,t,n,r,s,o,a,c,l){super(e,t,n,r,s,o,a,c,l),this.isCanvasTexture=!0,this.needsUpdate=!0}}class nx extends di{static get type(){return"ShadowMaterial"}constructor(e){super(),this.isShadowMaterial=!0,this.color=new st(0),this.transparent=!0,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.fog=e.fog,this}}class Fr extends di{static get type(){return"MeshStandardMaterial"}constructor(e){super(),this.isMeshStandardMaterial=!0,this.defines={STANDARD:""},this.color=new st(16777215),this.roughness=1,this.metalness=0,this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.emissive=new st(0),this.emissiveIntensity=1,this.emissiveMap=null,this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=_d,this.normalScale=new ht(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.roughnessMap=null,this.metalnessMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new vi,this.envMapIntensity=1,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.flatShading=!1,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.defines={STANDARD:""},this.color.copy(e.color),this.roughness=e.roughness,this.metalness=e.metalness,this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.emissive.copy(e.emissive),this.emissiveMap=e.emissiveMap,this.emissiveIntensity=e.emissiveIntensity,this.bumpMap=e.bumpMap,this.bumpScale=e.bumpScale,this.normalMap=e.normalMap,this.normalMapType=e.normalMapType,this.normalScale.copy(e.normalScale),this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.roughnessMap=e.roughnessMap,this.metalnessMap=e.metalnessMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.envMapRotation.copy(e.envMapRotation),this.envMapIntensity=e.envMapIntensity,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.flatShading=e.flatShading,this.fog=e.fog,this}}class Si extends Fr{static get type(){return"MeshPhysicalMaterial"}constructor(e){super(),this.isMeshPhysicalMaterial=!0,this.defines={STANDARD:"",PHYSICAL:""},this.anisotropyRotation=0,this.anisotropyMap=null,this.clearcoatMap=null,this.clearcoatRoughness=0,this.clearcoatRoughnessMap=null,this.clearcoatNormalScale=new ht(1,1),this.clearcoatNormalMap=null,this.ior=1.5,Object.defineProperty(this,"reflectivity",{get:function(){return xn(2.5*(this.ior-1)/(this.ior+1),0,1)},set:function(t){this.ior=(1+.4*t)/(1-.4*t)}}),this.iridescenceMap=null,this.iridescenceIOR=1.3,this.iridescenceThicknessRange=[100,400],this.iridescenceThicknessMap=null,this.sheenColor=new st(0),this.sheenColorMap=null,this.sheenRoughness=1,this.sheenRoughnessMap=null,this.transmissionMap=null,this.thickness=0,this.thicknessMap=null,this.attenuationDistance=1/0,this.attenuationColor=new st(1,1,1),this.specularIntensity=1,this.specularIntensityMap=null,this.specularColor=new st(1,1,1),this.specularColorMap=null,this._anisotropy=0,this._clearcoat=0,this._dispersion=0,this._iridescence=0,this._sheen=0,this._transmission=0,this.setValues(e)}get anisotropy(){return this._anisotropy}set anisotropy(e){this._anisotropy>0!=e>0&&this.version++,this._anisotropy=e}get clearcoat(){return this._clearcoat}set clearcoat(e){this._clearcoat>0!=e>0&&this.version++,this._clearcoat=e}get iridescence(){return this._iridescence}set iridescence(e){this._iridescence>0!=e>0&&this.version++,this._iridescence=e}get dispersion(){return this._dispersion}set dispersion(e){this._dispersion>0!=e>0&&this.version++,this._dispersion=e}get sheen(){return this._sheen}set sheen(e){this._sheen>0!=e>0&&this.version++,this._sheen=e}get transmission(){return this._transmission}set transmission(e){this._transmission>0!=e>0&&this.version++,this._transmission=e}copy(e){return super.copy(e),this.defines={STANDARD:"",PHYSICAL:""},this.anisotropy=e.anisotropy,this.anisotropyRotation=e.anisotropyRotation,this.anisotropyMap=e.anisotropyMap,this.clearcoat=e.clearcoat,this.clearcoatMap=e.clearcoatMap,this.clearcoatRoughness=e.clearcoatRoughness,this.clearcoatRoughnessMap=e.clearcoatRoughnessMap,this.clearcoatNormalMap=e.clearcoatNormalMap,this.clearcoatNormalScale.copy(e.clearcoatNormalScale),this.dispersion=e.dispersion,this.ior=e.ior,this.iridescence=e.iridescence,this.iridescenceMap=e.iridescenceMap,this.iridescenceIOR=e.iridescenceIOR,this.iridescenceThicknessRange=[...e.iridescenceThicknessRange],this.iridescenceThicknessMap=e.iridescenceThicknessMap,this.sheen=e.sheen,this.sheenColor.copy(e.sheenColor),this.sheenColorMap=e.sheenColorMap,this.sheenRoughness=e.sheenRoughness,this.sheenRoughnessMap=e.sheenRoughnessMap,this.transmission=e.transmission,this.transmissionMap=e.transmissionMap,this.thickness=e.thickness,this.thicknessMap=e.thicknessMap,this.attenuationDistance=e.attenuationDistance,this.attenuationColor.copy(e.attenuationColor),this.specularIntensity=e.specularIntensity,this.specularIntensityMap=e.specularIntensityMap,this.specularColor.copy(e.specularColor),this.specularColorMap=e.specularColorMap,this}}function Wo(i,e,t){return!i||!t&&i.constructor===e?i:typeof e.BYTES_PER_ELEMENT=="number"?new e(i):Array.prototype.slice.call(i)}function ix(i){return ArrayBuffer.isView(i)&&!(i instanceof DataView)}function rx(i){function e(r,s){return i[r]-i[s]}const t=i.length,n=new Array(t);for(let r=0;r!==t;++r)n[r]=r;return n.sort(e),n}function Au(i,e,t){const n=i.length,r=new i.constructor(n);for(let s=0,o=0;o!==n;++s){const a=t[s]*e;for(let c=0;c!==e;++c)r[o++]=i[a+c]}return r}function kd(i,e,t,n){let r=1,s=i[0];for(;s!==void 0&&s[n]===void 0;)s=i[r++];if(s===void 0)return;let o=s[n];if(o!==void 0)if(Array.isArray(o))do o=s[n],o!==void 0&&(e.push(s.time),t.push.apply(t,o)),s=i[r++];while(s!==void 0);else if(o.toArray!==void 0)do o=s[n],o!==void 0&&(e.push(s.time),o.toArray(t,t.length)),s=i[r++];while(s!==void 0);else do o=s[n],o!==void 0&&(e.push(s.time),t.push(o)),s=i[r++];while(s!==void 0)}class uo{constructor(e,t,n,r){this.parameterPositions=e,this._cachedIndex=0,this.resultBuffer=r!==void 0?r:new t.constructor(n),this.sampleValues=t,this.valueSize=n,this.settings=null,this.DefaultSettings_={}}evaluate(e){const t=this.parameterPositions;let n=this._cachedIndex,r=t[n],s=t[n-1];n:{e:{let o;t:{i:if(!(e<r)){for(let a=n+2;;){if(r===void 0){if(e<s)break i;return n=t.length,this._cachedIndex=n,this.copySampleValue_(n-1)}if(n===a)break;if(s=r,r=t[++n],e<r)break e}o=t.length;break t}if(!(e>=s)){const a=t[1];e<a&&(n=2,s=a);for(let c=n-2;;){if(s===void 0)return this._cachedIndex=0,this.copySampleValue_(0);if(n===c)break;if(r=s,s=t[--n-1],e>=s)break e}o=n,n=0;break t}break n}for(;n<o;){const a=n+o>>>1;e<t[a]?o=a:n=a+1}if(r=t[n],s=t[n-1],s===void 0)return this._cachedIndex=0,this.copySampleValue_(0);if(r===void 0)return n=t.length,this._cachedIndex=n,this.copySampleValue_(n-1)}this._cachedIndex=n,this.intervalChanged_(n,s,r)}return this.interpolate_(n,s,e,r)}getSettings_(){return this.settings||this.DefaultSettings_}copySampleValue_(e){const t=this.resultBuffer,n=this.sampleValues,r=this.valueSize,s=e*r;for(let o=0;o!==r;++o)t[o]=n[s+o];return t}interpolate_(){throw new Error("call to abstract method")}intervalChanged_(){}}class sx extends uo{constructor(e,t,n,r){super(e,t,n,r),this._weightPrev=-0,this._offsetPrev=-0,this._weightNext=-0,this._offsetNext=-0,this.DefaultSettings_={endingStart:gh,endingEnd:gh}}intervalChanged_(e,t,n){const r=this.parameterPositions;let s=e-2,o=e+1,a=r[s],c=r[o];if(a===void 0)switch(this.getSettings_().endingStart){case bh:s=e,a=2*t-n;break;case _h:s=r.length-2,a=t+r[s]-r[s+1];break;default:s=e,a=n}if(c===void 0)switch(this.getSettings_().endingEnd){case bh:o=e,c=2*n-t;break;case _h:o=1,c=n+r[1]-r[0];break;default:o=e-1,c=t}const l=(n-t)*.5,h=this.valueSize;this._weightPrev=l/(t-a),this._weightNext=l/(c-n),this._offsetPrev=s*h,this._offsetNext=o*h}interpolate_(e,t,n,r){const s=this.resultBuffer,o=this.sampleValues,a=this.valueSize,c=e*a,l=c-a,h=this._offsetPrev,u=this._offsetNext,d=this._weightPrev,p=this._weightNext,g=(n-t)/(r-t),b=g*g,m=b*g,f=-d*m+2*d*b-d*g,M=(1+d)*m+(-1.5-2*d)*b+(-.5+d)*g+1,x=(-1-p)*m+(1.5+p)*b+.5*g,_=p*m-p*b;for(let I=0;I!==a;++I)s[I]=f*o[h+I]+M*o[l+I]+x*o[c+I]+_*o[u+I];return s}}class ox extends uo{constructor(e,t,n,r){super(e,t,n,r)}interpolate_(e,t,n,r){const s=this.resultBuffer,o=this.sampleValues,a=this.valueSize,c=e*a,l=c-a,h=(n-t)/(r-t),u=1-h;for(let d=0;d!==a;++d)s[d]=o[l+d]*u+o[c+d]*h;return s}}class ax extends uo{constructor(e,t,n,r){super(e,t,n,r)}interpolate_(e){return this.copySampleValue_(e-1)}}class wi{constructor(e,t,n,r){if(e===void 0)throw new Error("THREE.KeyframeTrack: track name is undefined");if(t===void 0||t.length===0)throw new Error("THREE.KeyframeTrack: no keyframes in track named "+e);this.name=e,this.times=Wo(t,this.TimeBufferType),this.values=Wo(n,this.ValueBufferType),this.setInterpolation(r||this.DefaultInterpolation)}static toJSON(e){const t=e.constructor;let n;if(t.toJSON!==this.toJSON)n=t.toJSON(e);else{n={name:e.name,times:Wo(e.times,Array),values:Wo(e.values,Array)};const r=e.getInterpolation();r!==e.DefaultInterpolation&&(n.interpolation=r)}return n.type=e.ValueTypeName,n}InterpolantFactoryMethodDiscrete(e){return new ax(this.times,this.values,this.getValueSize(),e)}InterpolantFactoryMethodLinear(e){return new ox(this.times,this.values,this.getValueSize(),e)}InterpolantFactoryMethodSmooth(e){return new sx(this.times,this.values,this.getValueSize(),e)}setInterpolation(e){let t;switch(e){case ro:t=this.InterpolantFactoryMethodDiscrete;break;case so:t=this.InterpolantFactoryMethodLinear;break;case za:t=this.InterpolantFactoryMethodSmooth;break}if(t===void 0){const n="unsupported interpolation for "+this.ValueTypeName+" keyframe track named "+this.name;if(this.createInterpolant===void 0)if(e!==this.DefaultInterpolation)this.setInterpolation(this.DefaultInterpolation);else throw new Error(n);return console.warn("THREE.KeyframeTrack:",n),this}return this.createInterpolant=t,this}getInterpolation(){switch(this.createInterpolant){case this.InterpolantFactoryMethodDiscrete:return ro;case this.InterpolantFactoryMethodLinear:return so;case this.InterpolantFactoryMethodSmooth:return za}}getValueSize(){return this.values.length/this.times.length}shift(e){if(e!==0){const t=this.times;for(let n=0,r=t.length;n!==r;++n)t[n]+=e}return this}scale(e){if(e!==1){const t=this.times;for(let n=0,r=t.length;n!==r;++n)t[n]*=e}return this}trim(e,t){const n=this.times,r=n.length;let s=0,o=r-1;for(;s!==r&&n[s]<e;)++s;for(;o!==-1&&n[o]>t;)--o;if(++o,s!==0||o!==r){s>=o&&(o=Math.max(o,1),s=o-1);const a=this.getValueSize();this.times=n.slice(s,o),this.values=this.values.slice(s*a,o*a)}return this}validate(){let e=!0;const t=this.getValueSize();t-Math.floor(t)!==0&&(console.error("THREE.KeyframeTrack: Invalid value size in track.",this),e=!1);const n=this.times,r=this.values,s=n.length;s===0&&(console.error("THREE.KeyframeTrack: Track is empty.",this),e=!1);let o=null;for(let a=0;a!==s;a++){const c=n[a];if(typeof c=="number"&&isNaN(c)){console.error("THREE.KeyframeTrack: Time is not a valid number.",this,a,c),e=!1;break}if(o!==null&&o>c){console.error("THREE.KeyframeTrack: Out of order keys.",this,a,c,o),e=!1;break}o=c}if(r!==void 0&&ix(r))for(let a=0,c=r.length;a!==c;++a){const l=r[a];if(isNaN(l)){console.error("THREE.KeyframeTrack: Value is not a valid number.",this,a,l),e=!1;break}}return e}optimize(){const e=this.times.slice(),t=this.values.slice(),n=this.getValueSize(),r=this.getInterpolation()===za,s=e.length-1;let o=1;for(let a=1;a<s;++a){let c=!1;const l=e[a],h=e[a+1];if(l!==h&&(a!==1||l!==e[0]))if(r)c=!0;else{const u=a*n,d=u-n,p=u+n;for(let g=0;g!==n;++g){const b=t[u+g];if(b!==t[d+g]||b!==t[p+g]){c=!0;break}}}if(c){if(a!==o){e[o]=e[a];const u=a*n,d=o*n;for(let p=0;p!==n;++p)t[d+p]=t[u+p]}++o}}if(s>0){e[o]=e[s];for(let a=s*n,c=o*n,l=0;l!==n;++l)t[c+l]=t[a+l];++o}return o!==e.length?(this.times=e.slice(0,o),this.values=t.slice(0,o*n)):(this.times=e,this.values=t),this}clone(){const e=this.times.slice(),t=this.values.slice(),n=this.constructor,r=new n(this.name,e,t);return r.createInterpolant=this.createInterpolant,r}}wi.prototype.TimeBufferType=Float32Array;wi.prototype.ValueBufferType=Float32Array;wi.prototype.DefaultInterpolation=so;class Ds extends wi{constructor(e,t,n){super(e,t,n)}}Ds.prototype.ValueTypeName="bool";Ds.prototype.ValueBufferType=Array;Ds.prototype.DefaultInterpolation=ro;Ds.prototype.InterpolantFactoryMethodLinear=void 0;Ds.prototype.InterpolantFactoryMethodSmooth=void 0;class Bd extends wi{}Bd.prototype.ValueTypeName="color";class ws extends wi{}ws.prototype.ValueTypeName="number";class cx extends uo{constructor(e,t,n,r){super(e,t,n,r)}interpolate_(e,t,n,r){const s=this.resultBuffer,o=this.sampleValues,a=this.valueSize,c=(n-t)/(r-t);let l=e*a;for(let h=l+a;l!==h;l+=4)qe.slerpFlat(s,0,o,l-a,o,l,c);return s}}class Es extends wi{InterpolantFactoryMethodLinear(e){return new cx(this.times,this.values,this.getValueSize(),e)}}Es.prototype.ValueTypeName="quaternion";Es.prototype.InterpolantFactoryMethodSmooth=void 0;class Is extends wi{constructor(e,t,n){super(e,t,n)}}Is.prototype.ValueTypeName="string";Is.prototype.ValueBufferType=Array;Is.prototype.DefaultInterpolation=ro;Is.prototype.InterpolantFactoryMethodLinear=void 0;Is.prototype.InterpolantFactoryMethodSmooth=void 0;class As extends wi{}As.prototype.ValueTypeName="vector";class lx{constructor(e="",t=-1,n=[],r=sp){this.name=e,this.tracks=n,this.duration=t,this.blendMode=r,this.uuid=ui(),this.duration<0&&this.resetDuration()}static parse(e){const t=[],n=e.tracks,r=1/(e.fps||1);for(let o=0,a=n.length;o!==a;++o)t.push(ux(n[o]).scale(r));const s=new this(e.name,e.duration,t,e.blendMode);return s.uuid=e.uuid,s}static toJSON(e){const t=[],n=e.tracks,r={name:e.name,duration:e.duration,tracks:t,uuid:e.uuid,blendMode:e.blendMode};for(let s=0,o=n.length;s!==o;++s)t.push(wi.toJSON(n[s]));return r}static CreateFromMorphTargetSequence(e,t,n,r){const s=t.length,o=[];for(let a=0;a<s;a++){let c=[],l=[];c.push((a+s-1)%s,a,(a+1)%s),l.push(0,1,0);const h=rx(c);c=Au(c,1,h),l=Au(l,1,h),!r&&c[0]===0&&(c.push(s),l.push(l[0])),o.push(new ws(".morphTargetInfluences["+t[a].name+"]",c,l).scale(1/n))}return new this(e,-1,o)}static findByName(e,t){let n=e;if(!Array.isArray(e)){const r=e;n=r.geometry&&r.geometry.animations||r.animations}for(let r=0;r<n.length;r++)if(n[r].name===t)return n[r];return null}static CreateClipsFromMorphTargetSequences(e,t,n){const r={},s=/^([\w-]*?)([\d]+)$/;for(let a=0,c=e.length;a<c;a++){const l=e[a],h=l.name.match(s);if(h&&h.length>1){const u=h[1];let d=r[u];d||(r[u]=d=[]),d.push(l)}}const o=[];for(const a in r)o.push(this.CreateFromMorphTargetSequence(a,r[a],t,n));return o}static parseAnimation(e,t){if(!e)return console.error("THREE.AnimationClip: No animation in JSONLoader data."),null;const n=function(u,d,p,g,b){if(p.length!==0){const m=[],f=[];kd(p,m,f,g),m.length!==0&&b.push(new u(d,m,f))}},r=[],s=e.name||"default",o=e.fps||30,a=e.blendMode;let c=e.length||-1;const l=e.hierarchy||[];for(let u=0;u<l.length;u++){const d=l[u].keys;if(!(!d||d.length===0))if(d[0].morphTargets){const p={};let g;for(g=0;g<d.length;g++)if(d[g].morphTargets)for(let b=0;b<d[g].morphTargets.length;b++)p[d[g].morphTargets[b]]=-1;for(const b in p){const m=[],f=[];for(let M=0;M!==d[g].morphTargets.length;++M){const x=d[g];m.push(x.time),f.push(x.morphTarget===b?1:0)}r.push(new ws(".morphTargetInfluence["+b+"]",m,f))}c=p.length*o}else{const p=".bones["+t[u].name+"]";n(As,p+".position",d,"pos",r),n(Es,p+".quaternion",d,"rot",r),n(As,p+".scale",d,"scl",r)}}return r.length===0?null:new this(s,c,r,a)}resetDuration(){const e=this.tracks;let t=0;for(let n=0,r=e.length;n!==r;++n){const s=this.tracks[n];t=Math.max(t,s.times[s.times.length-1])}return this.duration=t,this}trim(){for(let e=0;e<this.tracks.length;e++)this.tracks[e].trim(0,this.duration);return this}validate(){let e=!0;for(let t=0;t<this.tracks.length;t++)e=e&&this.tracks[t].validate();return e}optimize(){for(let e=0;e<this.tracks.length;e++)this.tracks[e].optimize();return this}clone(){const e=[];for(let t=0;t<this.tracks.length;t++)e.push(this.tracks[t].clone());return new this.constructor(this.name,this.duration,e,this.blendMode)}toJSON(){return this.constructor.toJSON(this)}}function hx(i){switch(i.toLowerCase()){case"scalar":case"double":case"float":case"number":case"integer":return ws;case"vector":case"vector2":case"vector3":case"vector4":return As;case"color":return Bd;case"quaternion":return Es;case"bool":case"boolean":return Ds;case"string":return Is}throw new Error("THREE.KeyframeTrack: Unsupported typeName: "+i)}function ux(i){if(i.type===void 0)throw new Error("THREE.KeyframeTrack: track type undefined, can not parse");const e=hx(i.type);if(i.times===void 0){const t=[],n=[];kd(i.keys,t,n,"value"),i.times=t,i.values=n}return e.parse!==void 0?e.parse(i):new e(i.name,i.times,i.values,i.interpolation)}const ar={enabled:!1,files:{},add:function(i,e){this.enabled!==!1&&(this.files[i]=e)},get:function(i){if(this.enabled!==!1)return this.files[i]},remove:function(i){delete this.files[i]},clear:function(){this.files={}}};class dx{constructor(e,t,n){const r=this;let s=!1,o=0,a=0,c;const l=[];this.onStart=void 0,this.onLoad=e,this.onProgress=t,this.onError=n,this.itemStart=function(h){a++,s===!1&&r.onStart!==void 0&&r.onStart(h,o,a),s=!0},this.itemEnd=function(h){o++,r.onProgress!==void 0&&r.onProgress(h,o,a),o===a&&(s=!1,r.onLoad!==void 0&&r.onLoad())},this.itemError=function(h){r.onError!==void 0&&r.onError(h)},this.resolveURL=function(h){return c?c(h):h},this.setURLModifier=function(h){return c=h,this},this.addHandler=function(h,u){return l.push(h,u),this},this.removeHandler=function(h){const u=l.indexOf(h);return u!==-1&&l.splice(u,2),this},this.getHandler=function(h){for(let u=0,d=l.length;u<d;u+=2){const p=l[u],g=l[u+1];if(p.global&&(p.lastIndex=0),p.test(h))return g}return null}}}const fx=new dx;class Ns{constructor(e){this.manager=e!==void 0?e:fx,this.crossOrigin="anonymous",this.withCredentials=!1,this.path="",this.resourcePath="",this.requestHeader={}}load(){}loadAsync(e,t){const n=this;return new Promise(function(r,s){n.load(e,r,t,s)})}parse(){}setCrossOrigin(e){return this.crossOrigin=e,this}setWithCredentials(e){return this.withCredentials=e,this}setPath(e){return this.path=e,this}setResourcePath(e){return this.resourcePath=e,this}setRequestHeader(e){return this.requestHeader=e,this}}Ns.DEFAULT_MATERIAL_NAME="__DEFAULT";const Di={};class px extends Error{constructor(e,t){super(e),this.response=t}}class zd extends Ns{constructor(e){super(e)}load(e,t,n,r){e===void 0&&(e=""),this.path!==void 0&&(e=this.path+e),e=this.manager.resolveURL(e);const s=ar.get(e);if(s!==void 0)return this.manager.itemStart(e),setTimeout(()=>{t&&t(s),this.manager.itemEnd(e)},0),s;if(Di[e]!==void 0){Di[e].push({onLoad:t,onProgress:n,onError:r});return}Di[e]=[],Di[e].push({onLoad:t,onProgress:n,onError:r});const o=new Request(e,{headers:new Headers(this.requestHeader),credentials:this.withCredentials?"include":"same-origin"}),a=this.mimeType,c=this.responseType;fetch(o).then(l=>{if(l.status===200||l.status===0){if(l.status===0&&console.warn("THREE.FileLoader: HTTP Status 0 received."),typeof ReadableStream>"u"||l.body===void 0||l.body.getReader===void 0)return l;const h=Di[e],u=l.body.getReader(),d=l.headers.get("X-File-Size")||l.headers.get("Content-Length"),p=d?parseInt(d):0,g=p!==0;let b=0;const m=new ReadableStream({start(f){M();function M(){u.read().then(({done:x,value:_})=>{if(x)f.close();else{b+=_.byteLength;const I=new ProgressEvent("progress",{lengthComputable:g,loaded:b,total:p});for(let R=0,T=h.length;R<T;R++){const F=h[R];F.onProgress&&F.onProgress(I)}f.enqueue(_),M()}},x=>{f.error(x)})}}});return new Response(m)}else throw new px(`fetch for "${l.url}" responded with ${l.status}: ${l.statusText}`,l)}).then(l=>{switch(c){case"arraybuffer":return l.arrayBuffer();case"blob":return l.blob();case"document":return l.text().then(h=>new DOMParser().parseFromString(h,a));case"json":return l.json();default:if(a===void 0)return l.text();{const u=/charset="?([^;"\s]*)"?/i.exec(a),d=u&&u[1]?u[1].toLowerCase():void 0,p=new TextDecoder(d);return l.arrayBuffer().then(g=>p.decode(g))}}}).then(l=>{ar.add(e,l);const h=Di[e];delete Di[e];for(let u=0,d=h.length;u<d;u++){const p=h[u];p.onLoad&&p.onLoad(l)}}).catch(l=>{const h=Di[e];if(h===void 0)throw this.manager.itemError(e),l;delete Di[e];for(let u=0,d=h.length;u<d;u++){const p=h[u];p.onError&&p.onError(l)}this.manager.itemError(e)}).finally(()=>{this.manager.itemEnd(e)}),this.manager.itemStart(e)}setResponseType(e){return this.responseType=e,this}setMimeType(e){return this.mimeType=e,this}}class mx extends Ns{constructor(e){super(e)}load(e,t,n,r){this.path!==void 0&&(e=this.path+e),e=this.manager.resolveURL(e);const s=this,o=ar.get(e);if(o!==void 0)return s.manager.itemStart(e),setTimeout(function(){t&&t(o),s.manager.itemEnd(e)},0),o;const a=oo("img");function c(){h(),ar.add(e,this),t&&t(this),s.manager.itemEnd(e)}function l(u){h(),r&&r(u),s.manager.itemError(e),s.manager.itemEnd(e)}function h(){a.removeEventListener("load",c,!1),a.removeEventListener("error",l,!1)}return a.addEventListener("load",c,!1),a.addEventListener("error",l,!1),e.slice(0,5)!=="data:"&&this.crossOrigin!==void 0&&(a.crossOrigin=this.crossOrigin),s.manager.itemStart(e),a.src=e,a}}class gx extends Ns{constructor(e){super(e)}load(e,t,n,r){const s=new hn,o=new mx(this.manager);return o.setCrossOrigin(this.crossOrigin),o.setPath(this.path),o.load(e,function(a){s.image=a,s.needsUpdate=!0,t!==void 0&&t(s)},n,r),s}}class Pa extends en{constructor(e,t=1){super(),this.isLight=!0,this.type="Light",this.color=new st(e),this.intensity=t}dispose(){}copy(e,t){return super.copy(e,t),this.color.copy(e.color),this.intensity=e.intensity,this}toJSON(e){const t=super.toJSON(e);return t.object.color=this.color.getHex(),t.object.intensity=this.intensity,this.groundColor!==void 0&&(t.object.groundColor=this.groundColor.getHex()),this.distance!==void 0&&(t.object.distance=this.distance),this.angle!==void 0&&(t.object.angle=this.angle),this.decay!==void 0&&(t.object.decay=this.decay),this.penumbra!==void 0&&(t.object.penumbra=this.penumbra),this.shadow!==void 0&&(t.object.shadow=this.shadow.toJSON()),this.target!==void 0&&(t.object.target=this.target.uuid),t}}class Hd extends Pa{constructor(e,t,n){super(e,n),this.isHemisphereLight=!0,this.type="HemisphereLight",this.position.copy(en.DEFAULT_UP),this.updateMatrix(),this.groundColor=new st(t)}copy(e,t){return super.copy(e,t),this.groundColor.copy(e.groundColor),this}}const bc=new ot,Tu=new A,Ru=new A;class eh{constructor(e){this.camera=e,this.intensity=1,this.bias=0,this.normalBias=0,this.radius=1,this.blurSamples=8,this.mapSize=new ht(512,512),this.map=null,this.mapPass=null,this.matrix=new ot,this.autoUpdate=!0,this.needsUpdate=!1,this._frustum=new Xl,this._frameExtents=new ht(1,1),this._viewportCount=1,this._viewports=[new mt(0,0,1,1)]}getViewportCount(){return this._viewportCount}getFrustum(){return this._frustum}updateMatrices(e){const t=this.camera,n=this.matrix;Tu.setFromMatrixPosition(e.matrixWorld),t.position.copy(Tu),Ru.setFromMatrixPosition(e.target.matrixWorld),t.lookAt(Ru),t.updateMatrixWorld(),bc.multiplyMatrices(t.projectionMatrix,t.matrixWorldInverse),this._frustum.setFromProjectionMatrix(bc),n.set(.5,0,0,.5,0,.5,0,.5,0,0,.5,.5,0,0,0,1),n.multiply(bc)}getViewport(e){return this._viewports[e]}getFrameExtents(){return this._frameExtents}dispose(){this.map&&this.map.dispose(),this.mapPass&&this.mapPass.dispose()}copy(e){return this.camera=e.camera.clone(),this.intensity=e.intensity,this.bias=e.bias,this.radius=e.radius,this.mapSize.copy(e.mapSize),this}clone(){return new this.constructor().copy(this)}toJSON(){const e={};return this.intensity!==1&&(e.intensity=this.intensity),this.bias!==0&&(e.bias=this.bias),this.normalBias!==0&&(e.normalBias=this.normalBias),this.radius!==1&&(e.radius=this.radius),(this.mapSize.x!==512||this.mapSize.y!==512)&&(e.mapSize=this.mapSize.toArray()),e.camera=this.camera.toJSON(!1).object,delete e.camera.matrix,e}}class bx extends eh{constructor(){super(new vn(50,1,.5,500)),this.isSpotLightShadow=!0,this.focus=1}updateMatrices(e){const t=this.camera,n=Ms*2*e.angle*this.focus,r=this.mapSize.width/this.mapSize.height,s=e.distance||t.far;(n!==t.fov||r!==t.aspect||s!==t.far)&&(t.fov=n,t.aspect=r,t.far=s,t.updateProjectionMatrix()),super.updateMatrices(e)}copy(e){return super.copy(e),this.focus=e.focus,this}}class _x extends Pa{constructor(e,t,n=0,r=Math.PI/3,s=0,o=2){super(e,t),this.isSpotLight=!0,this.type="SpotLight",this.position.copy(en.DEFAULT_UP),this.updateMatrix(),this.target=new en,this.distance=n,this.angle=r,this.penumbra=s,this.decay=o,this.map=null,this.shadow=new bx}get power(){return this.intensity*Math.PI}set power(e){this.intensity=e/Math.PI}dispose(){this.shadow.dispose()}copy(e,t){return super.copy(e,t),this.distance=e.distance,this.angle=e.angle,this.penumbra=e.penumbra,this.decay=e.decay,this.target=e.target.clone(),this.shadow=e.shadow.clone(),this}}const Cu=new ot,qs=new A,_c=new A;class xx extends eh{constructor(){super(new vn(90,1,.5,500)),this.isPointLightShadow=!0,this._frameExtents=new ht(4,2),this._viewportCount=6,this._viewports=[new mt(2,1,1,1),new mt(0,1,1,1),new mt(3,1,1,1),new mt(1,1,1,1),new mt(3,0,1,1),new mt(1,0,1,1)],this._cubeDirections=[new A(1,0,0),new A(-1,0,0),new A(0,0,1),new A(0,0,-1),new A(0,1,0),new A(0,-1,0)],this._cubeUps=[new A(0,1,0),new A(0,1,0),new A(0,1,0),new A(0,1,0),new A(0,0,1),new A(0,0,-1)]}updateMatrices(e,t=0){const n=this.camera,r=this.matrix,s=e.distance||n.far;s!==n.far&&(n.far=s,n.updateProjectionMatrix()),qs.setFromMatrixPosition(e.matrixWorld),n.position.copy(qs),_c.copy(n.position),_c.add(this._cubeDirections[t]),n.up.copy(this._cubeUps[t]),n.lookAt(_c),n.updateMatrixWorld(),r.makeTranslation(-qs.x,-qs.y,-qs.z),Cu.multiplyMatrices(n.projectionMatrix,n.matrixWorldInverse),this._frustum.setFromProjectionMatrix(Cu)}}class Vd extends Pa{constructor(e,t,n=0,r=2){super(e,t),this.isPointLight=!0,this.type="PointLight",this.distance=n,this.decay=r,this.shadow=new xx}get power(){return this.intensity*4*Math.PI}set power(e){this.intensity=e/(4*Math.PI)}dispose(){this.shadow.dispose()}copy(e,t){return super.copy(e,t),this.distance=e.distance,this.decay=e.decay,this.shadow=e.shadow.clone(),this}}class vx extends eh{constructor(){super(new Ql(-5,5,5,-5,.5,500)),this.isDirectionalLightShadow=!0}}class hs extends Pa{constructor(e,t){super(e,t),this.isDirectionalLight=!0,this.type="DirectionalLight",this.position.copy(en.DEFAULT_UP),this.updateMatrix(),this.target=new en,this.shadow=new vx}dispose(){this.shadow.dispose()}copy(e){return super.copy(e),this.target=e.target.clone(),this.shadow=e.shadow.clone(),this}}class eo{static decodeText(e){if(console.warn("THREE.LoaderUtils: decodeText() has been deprecated with r165 and will be removed with r175. Use TextDecoder instead."),typeof TextDecoder<"u")return new TextDecoder().decode(e);let t="";for(let n=0,r=e.length;n<r;n++)t+=String.fromCharCode(e[n]);try{return decodeURIComponent(escape(t))}catch{return t}}static extractUrlBase(e){const t=e.lastIndexOf("/");return t===-1?"./":e.slice(0,t+1)}static resolveURL(e,t){return typeof e!="string"||e===""?"":(/^https?:\/\//i.test(t)&&/^\//.test(e)&&(t=t.replace(/(^https?:\/\/[^\/]+).*/i,"$1")),/^(https?:)?\/\//i.test(e)||/^data:.*,.*$/i.test(e)||/^blob:.*$/i.test(e)?e:t+e)}}class yx extends Ns{constructor(e){super(e),this.isImageBitmapLoader=!0,typeof createImageBitmap>"u"&&console.warn("THREE.ImageBitmapLoader: createImageBitmap() not supported."),typeof fetch>"u"&&console.warn("THREE.ImageBitmapLoader: fetch() not supported."),this.options={premultiplyAlpha:"none"}}setOptions(e){return this.options=e,this}load(e,t,n,r){e===void 0&&(e=""),this.path!==void 0&&(e=this.path+e),e=this.manager.resolveURL(e);const s=this,o=ar.get(e);if(o!==void 0){if(s.manager.itemStart(e),o.then){o.then(l=>{t&&t(l),s.manager.itemEnd(e)}).catch(l=>{r&&r(l)});return}return setTimeout(function(){t&&t(o),s.manager.itemEnd(e)},0),o}const a={};a.credentials=this.crossOrigin==="anonymous"?"same-origin":"include",a.headers=this.requestHeader;const c=fetch(e,a).then(function(l){return l.blob()}).then(function(l){return createImageBitmap(l,Object.assign(s.options,{colorSpaceConversion:"none"}))}).then(function(l){return ar.add(e,l),t&&t(l),s.manager.itemEnd(e),l}).catch(function(l){r&&r(l),ar.remove(e),s.manager.itemError(e),s.manager.itemEnd(e)});ar.add(e,c),s.manager.itemStart(e)}}const th="\\[\\]\\.:\\/",Mx=new RegExp("["+th+"]","g"),nh="[^"+th+"]",Sx="[^"+th.replace("\\.","")+"]",wx=/((?:WC+[\/:])*)/.source.replace("WC",nh),Ex=/(WCOD+)?/.source.replace("WCOD",Sx),Ax=/(?:\.(WC+)(?:\[(.+)\])?)?/.source.replace("WC",nh),Tx=/\.(WC+)(?:\[(.+)\])?/.source.replace("WC",nh),Rx=new RegExp("^"+wx+Ex+Ax+Tx+"$"),Cx=["material","materials","bones","map"];class Px{constructor(e,t,n){const r=n||Vt.parseTrackName(t);this._targetGroup=e,this._bindings=e.subscribe_(t,r)}getValue(e,t){this.bind();const n=this._targetGroup.nCachedObjects_,r=this._bindings[n];r!==void 0&&r.getValue(e,t)}setValue(e,t){const n=this._bindings;for(let r=this._targetGroup.nCachedObjects_,s=n.length;r!==s;++r)n[r].setValue(e,t)}bind(){const e=this._bindings;for(let t=this._targetGroup.nCachedObjects_,n=e.length;t!==n;++t)e[t].bind()}unbind(){const e=this._bindings;for(let t=this._targetGroup.nCachedObjects_,n=e.length;t!==n;++t)e[t].unbind()}}class Vt{constructor(e,t,n){this.path=t,this.parsedPath=n||Vt.parseTrackName(t),this.node=Vt.findNode(e,this.parsedPath.nodeName),this.rootNode=e,this.getValue=this._getValue_unbound,this.setValue=this._setValue_unbound}static create(e,t,n){return e&&e.isAnimationObjectGroup?new Vt.Composite(e,t,n):new Vt(e,t,n)}static sanitizeNodeName(e){return e.replace(/\s/g,"_").replace(Mx,"")}static parseTrackName(e){const t=Rx.exec(e);if(t===null)throw new Error("PropertyBinding: Cannot parse trackName: "+e);const n={nodeName:t[2],objectName:t[3],objectIndex:t[4],propertyName:t[5],propertyIndex:t[6]},r=n.nodeName&&n.nodeName.lastIndexOf(".");if(r!==void 0&&r!==-1){const s=n.nodeName.substring(r+1);Cx.indexOf(s)!==-1&&(n.nodeName=n.nodeName.substring(0,r),n.objectName=s)}if(n.propertyName===null||n.propertyName.length===0)throw new Error("PropertyBinding: can not parse propertyName from trackName: "+e);return n}static findNode(e,t){if(t===void 0||t===""||t==="."||t===-1||t===e.name||t===e.uuid)return e;if(e.skeleton){const n=e.skeleton.getBoneByName(t);if(n!==void 0)return n}if(e.children){const n=function(s){for(let o=0;o<s.length;o++){const a=s[o];if(a.name===t||a.uuid===t)return a;const c=n(a.children);if(c)return c}return null},r=n(e.children);if(r)return r}return null}_getValue_unavailable(){}_setValue_unavailable(){}_getValue_direct(e,t){e[t]=this.targetObject[this.propertyName]}_getValue_array(e,t){const n=this.resolvedProperty;for(let r=0,s=n.length;r!==s;++r)e[t++]=n[r]}_getValue_arrayElement(e,t){e[t]=this.resolvedProperty[this.propertyIndex]}_getValue_toArray(e,t){this.resolvedProperty.toArray(e,t)}_setValue_direct(e,t){this.targetObject[this.propertyName]=e[t]}_setValue_direct_setNeedsUpdate(e,t){this.targetObject[this.propertyName]=e[t],this.targetObject.needsUpdate=!0}_setValue_direct_setMatrixWorldNeedsUpdate(e,t){this.targetObject[this.propertyName]=e[t],this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_array(e,t){const n=this.resolvedProperty;for(let r=0,s=n.length;r!==s;++r)n[r]=e[t++]}_setValue_array_setNeedsUpdate(e,t){const n=this.resolvedProperty;for(let r=0,s=n.length;r!==s;++r)n[r]=e[t++];this.targetObject.needsUpdate=!0}_setValue_array_setMatrixWorldNeedsUpdate(e,t){const n=this.resolvedProperty;for(let r=0,s=n.length;r!==s;++r)n[r]=e[t++];this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_arrayElement(e,t){this.resolvedProperty[this.propertyIndex]=e[t]}_setValue_arrayElement_setNeedsUpdate(e,t){this.resolvedProperty[this.propertyIndex]=e[t],this.targetObject.needsUpdate=!0}_setValue_arrayElement_setMatrixWorldNeedsUpdate(e,t){this.resolvedProperty[this.propertyIndex]=e[t],this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_fromArray(e,t){this.resolvedProperty.fromArray(e,t)}_setValue_fromArray_setNeedsUpdate(e,t){this.resolvedProperty.fromArray(e,t),this.targetObject.needsUpdate=!0}_setValue_fromArray_setMatrixWorldNeedsUpdate(e,t){this.resolvedProperty.fromArray(e,t),this.targetObject.matrixWorldNeedsUpdate=!0}_getValue_unbound(e,t){this.bind(),this.getValue(e,t)}_setValue_unbound(e,t){this.bind(),this.setValue(e,t)}bind(){let e=this.node;const t=this.parsedPath,n=t.objectName,r=t.propertyName;let s=t.propertyIndex;if(e||(e=Vt.findNode(this.rootNode,t.nodeName),this.node=e),this.getValue=this._getValue_unavailable,this.setValue=this._setValue_unavailable,!e){console.warn("THREE.PropertyBinding: No target node found for track: "+this.path+".");return}if(n){let l=t.objectIndex;switch(n){case"materials":if(!e.material){console.error("THREE.PropertyBinding: Can not bind to material as node does not have a material.",this);return}if(!e.material.materials){console.error("THREE.PropertyBinding: Can not bind to material.materials as node.material does not have a materials array.",this);return}e=e.material.materials;break;case"bones":if(!e.skeleton){console.error("THREE.PropertyBinding: Can not bind to bones as node does not have a skeleton.",this);return}e=e.skeleton.bones;for(let h=0;h<e.length;h++)if(e[h].name===l){l=h;break}break;case"map":if("map"in e){e=e.map;break}if(!e.material){console.error("THREE.PropertyBinding: Can not bind to material as node does not have a material.",this);return}if(!e.material.map){console.error("THREE.PropertyBinding: Can not bind to material.map as node.material does not have a map.",this);return}e=e.material.map;break;default:if(e[n]===void 0){console.error("THREE.PropertyBinding: Can not bind to objectName of node undefined.",this);return}e=e[n]}if(l!==void 0){if(e[l]===void 0){console.error("THREE.PropertyBinding: Trying to bind to objectIndex of objectName, but is undefined.",this,e);return}e=e[l]}}const o=e[r];if(o===void 0){const l=t.nodeName;console.error("THREE.PropertyBinding: Trying to update property for track: "+l+"."+r+" but it wasn't found.",e);return}let a=this.Versioning.None;this.targetObject=e,e.needsUpdate!==void 0?a=this.Versioning.NeedsUpdate:e.matrixWorldNeedsUpdate!==void 0&&(a=this.Versioning.MatrixWorldNeedsUpdate);let c=this.BindingType.Direct;if(s!==void 0){if(r==="morphTargetInfluences"){if(!e.geometry){console.error("THREE.PropertyBinding: Can not bind to morphTargetInfluences because node does not have a geometry.",this);return}if(!e.geometry.morphAttributes){console.error("THREE.PropertyBinding: Can not bind to morphTargetInfluences because node does not have a geometry.morphAttributes.",this);return}e.morphTargetDictionary[s]!==void 0&&(s=e.morphTargetDictionary[s])}c=this.BindingType.ArrayElement,this.resolvedProperty=o,this.propertyIndex=s}else o.fromArray!==void 0&&o.toArray!==void 0?(c=this.BindingType.HasFromToArray,this.resolvedProperty=o):Array.isArray(o)?(c=this.BindingType.EntireArray,this.resolvedProperty=o):this.propertyName=r;this.getValue=this.GetterByBindingType[c],this.setValue=this.SetterByBindingTypeAndVersioning[c][a]}unbind(){this.node=null,this.getValue=this._getValue_unbound,this.setValue=this._setValue_unbound}}Vt.Composite=Px;Vt.prototype.BindingType={Direct:0,EntireArray:1,ArrayElement:2,HasFromToArray:3};Vt.prototype.Versioning={None:0,NeedsUpdate:1,MatrixWorldNeedsUpdate:2};Vt.prototype.GetterByBindingType=[Vt.prototype._getValue_direct,Vt.prototype._getValue_array,Vt.prototype._getValue_arrayElement,Vt.prototype._getValue_toArray];Vt.prototype.SetterByBindingTypeAndVersioning=[[Vt.prototype._setValue_direct,Vt.prototype._setValue_direct_setNeedsUpdate,Vt.prototype._setValue_direct_setMatrixWorldNeedsUpdate],[Vt.prototype._setValue_array,Vt.prototype._setValue_array_setNeedsUpdate,Vt.prototype._setValue_array_setMatrixWorldNeedsUpdate],[Vt.prototype._setValue_arrayElement,Vt.prototype._setValue_arrayElement_setNeedsUpdate,Vt.prototype._setValue_arrayElement_setMatrixWorldNeedsUpdate],[Vt.prototype._setValue_fromArray,Vt.prototype._setValue_fromArray_setNeedsUpdate,Vt.prototype._setValue_fromArray_setMatrixWorldNeedsUpdate]];const Pu=new ot;class Gd{constructor(e,t,n=0,r=1/0){this.ray=new Rs(e,t),this.near=n,this.far=r,this.camera=null,this.layers=new jl,this.params={Mesh:{},Line:{threshold:1},LOD:{},Points:{threshold:1},Sprite:{}}}set(e,t){this.ray.set(e,t)}setFromCamera(e,t){t.isPerspectiveCamera?(this.ray.origin.setFromMatrixPosition(t.matrixWorld),this.ray.direction.set(e.x,e.y,.5).unproject(t).sub(this.ray.origin).normalize(),this.camera=t):t.isOrthographicCamera?(this.ray.origin.set(e.x,e.y,(t.near+t.far)/(t.near-t.far)).unproject(t),this.ray.direction.set(0,0,-1).transformDirection(t.matrixWorld),this.camera=t):console.error("THREE.Raycaster: Unsupported camera type: "+t.type)}setFromXRController(e){return Pu.identity().extractRotation(e.matrixWorld),this.ray.origin.setFromMatrixPosition(e.matrixWorld),this.ray.direction.set(0,0,-1).applyMatrix4(Pu),this}intersectObject(e,t=!0,n=[]){return El(e,this,n,t),n.sort(Lu),n}intersectObjects(e,t=!0,n=[]){for(let r=0,s=e.length;r<s;r++)El(e[r],this,n,t);return n.sort(Lu),n}}function Lu(i,e){return i.distance-e.distance}function El(i,e,t,n){let r=!0;if(i.layers.test(e.layers)&&i.raycast(e,t)===!1&&(r=!1),r===!0&&n===!0){const s=i.children;for(let o=0,a=s.length;o<a;o++)El(s[o],e,t,!0)}}class Du{constructor(e=1,t=0,n=0){return this.radius=e,this.phi=t,this.theta=n,this}set(e,t,n){return this.radius=e,this.phi=t,this.theta=n,this}copy(e){return this.radius=e.radius,this.phi=e.phi,this.theta=e.theta,this}makeSafe(){return this.phi=Math.max(1e-6,Math.min(Math.PI-1e-6,this.phi)),this}setFromVector3(e){return this.setFromCartesianCoords(e.x,e.y,e.z)}setFromCartesianCoords(e,t,n){return this.radius=Math.sqrt(e*e+t*t+n*n),this.radius===0?(this.theta=0,this.phi=0):(this.theta=Math.atan2(e,n),this.phi=Math.acos(xn(t/this.radius,-1,1))),this}clone(){return new this.constructor().copy(this)}}class Lx extends Ur{constructor(e,t=null){super(),this.object=e,this.domElement=t,this.enabled=!0,this.state=-1,this.keys={},this.mouseButtons={LEFT:null,MIDDLE:null,RIGHT:null},this.touches={ONE:null,TWO:null}}connect(){}disconnect(){}dispose(){}update(){}}typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("register",{detail:{revision:Ol}}));typeof window<"u"&&(window.__THREE__?console.warn("WARNING: Multiple instances of Three.js being imported."):window.__THREE__=Ol);const Iu={type:"change"},ih={type:"start"},Wd={type:"end"},qo=new Rs,Nu=new ir,Dx=Math.cos(70*Nt.DEG2RAD),cn=new A,Fn=2*Math.PI,Qt={NONE:-1,ROTATE:0,DOLLY:1,PAN:2,TOUCH_ROTATE:3,TOUCH_PAN:4,TOUCH_DOLLY_PAN:5,TOUCH_DOLLY_ROTATE:6},xc=1e-6;class Ix extends Lx{constructor(e,t=null){super(e,t),this.state=Qt.NONE,this.enabled=!0,this.target=new A,this.cursor=new A,this.minDistance=0,this.maxDistance=1/0,this.minZoom=0,this.maxZoom=1/0,this.minTargetRadius=0,this.maxTargetRadius=1/0,this.minPolarAngle=0,this.maxPolarAngle=Math.PI,this.minAzimuthAngle=-1/0,this.maxAzimuthAngle=1/0,this.enableDamping=!1,this.dampingFactor=.05,this.enableZoom=!0,this.zoomSpeed=1,this.enableRotate=!0,this.rotateSpeed=1,this.enablePan=!0,this.panSpeed=1,this.screenSpacePanning=!0,this.keyPanSpeed=7,this.zoomToCursor=!1,this.autoRotate=!1,this.autoRotateSpeed=2,this.keys={LEFT:"ArrowLeft",UP:"ArrowUp",RIGHT:"ArrowRight",BOTTOM:"ArrowDown"},this.mouseButtons={LEFT:os.ROTATE,MIDDLE:os.DOLLY,RIGHT:os.PAN},this.touches={ONE:is.ROTATE,TWO:is.DOLLY_PAN},this.target0=this.target.clone(),this.position0=this.object.position.clone(),this.zoom0=this.object.zoom,this._domElementKeyEvents=null,this._lastPosition=new A,this._lastQuaternion=new qe,this._lastTargetPosition=new A,this._quat=new qe().setFromUnitVectors(e.up,new A(0,1,0)),this._quatInverse=this._quat.clone().invert(),this._spherical=new Du,this._sphericalDelta=new Du,this._scale=1,this._panOffset=new A,this._rotateStart=new ht,this._rotateEnd=new ht,this._rotateDelta=new ht,this._panStart=new ht,this._panEnd=new ht,this._panDelta=new ht,this._dollyStart=new ht,this._dollyEnd=new ht,this._dollyDelta=new ht,this._dollyDirection=new A,this._mouse=new ht,this._performCursorZoom=!1,this._pointers=[],this._pointerPositions={},this._controlActive=!1,this._onPointerMove=Fx.bind(this),this._onPointerDown=Nx.bind(this),this._onPointerUp=Ux.bind(this),this._onContextMenu=Gx.bind(this),this._onMouseWheel=Bx.bind(this),this._onKeyDown=zx.bind(this),this._onTouchStart=Hx.bind(this),this._onTouchMove=Vx.bind(this),this._onMouseDown=Ox.bind(this),this._onMouseMove=kx.bind(this),this._interceptControlDown=Wx.bind(this),this._interceptControlUp=qx.bind(this),this.domElement!==null&&this.connect(),this.update()}connect(){this.domElement.addEventListener("pointerdown",this._onPointerDown),this.domElement.addEventListener("pointercancel",this._onPointerUp),this.domElement.addEventListener("contextmenu",this._onContextMenu),this.domElement.addEventListener("wheel",this._onMouseWheel,{passive:!1}),this.domElement.getRootNode().addEventListener("keydown",this._interceptControlDown,{passive:!0,capture:!0}),this.domElement.style.touchAction="none"}disconnect(){this.domElement.removeEventListener("pointerdown",this._onPointerDown),this.domElement.removeEventListener("pointermove",this._onPointerMove),this.domElement.removeEventListener("pointerup",this._onPointerUp),this.domElement.removeEventListener("pointercancel",this._onPointerUp),this.domElement.removeEventListener("wheel",this._onMouseWheel),this.domElement.removeEventListener("contextmenu",this._onContextMenu),this.stopListenToKeyEvents(),this.domElement.getRootNode().removeEventListener("keydown",this._interceptControlDown,{capture:!0}),this.domElement.style.touchAction="auto"}dispose(){this.disconnect()}getPolarAngle(){return this._spherical.phi}getAzimuthalAngle(){return this._spherical.theta}getDistance(){return this.object.position.distanceTo(this.target)}listenToKeyEvents(e){e.addEventListener("keydown",this._onKeyDown),this._domElementKeyEvents=e}stopListenToKeyEvents(){this._domElementKeyEvents!==null&&(this._domElementKeyEvents.removeEventListener("keydown",this._onKeyDown),this._domElementKeyEvents=null)}saveState(){this.target0.copy(this.target),this.position0.copy(this.object.position),this.zoom0=this.object.zoom}reset(){this.target.copy(this.target0),this.object.position.copy(this.position0),this.object.zoom=this.zoom0,this.object.updateProjectionMatrix(),this.dispatchEvent(Iu),this.update(),this.state=Qt.NONE}update(e=null){const t=this.object.position;cn.copy(t).sub(this.target),cn.applyQuaternion(this._quat),this._spherical.setFromVector3(cn),this.autoRotate&&this.state===Qt.NONE&&this._rotateLeft(this._getAutoRotationAngle(e)),this.enableDamping?(this._spherical.theta+=this._sphericalDelta.theta*this.dampingFactor,this._spherical.phi+=this._sphericalDelta.phi*this.dampingFactor):(this._spherical.theta+=this._sphericalDelta.theta,this._spherical.phi+=this._sphericalDelta.phi);let n=this.minAzimuthAngle,r=this.maxAzimuthAngle;isFinite(n)&&isFinite(r)&&(n<-Math.PI?n+=Fn:n>Math.PI&&(n-=Fn),r<-Math.PI?r+=Fn:r>Math.PI&&(r-=Fn),n<=r?this._spherical.theta=Math.max(n,Math.min(r,this._spherical.theta)):this._spherical.theta=this._spherical.theta>(n+r)/2?Math.max(n,this._spherical.theta):Math.min(r,this._spherical.theta)),this._spherical.phi=Math.max(this.minPolarAngle,Math.min(this.maxPolarAngle,this._spherical.phi)),this._spherical.makeSafe(),this.enableDamping===!0?this.target.addScaledVector(this._panOffset,this.dampingFactor):this.target.add(this._panOffset),this.target.sub(this.cursor),this.target.clampLength(this.minTargetRadius,this.maxTargetRadius),this.target.add(this.cursor);let s=!1;if(this.zoomToCursor&&this._performCursorZoom||this.object.isOrthographicCamera)this._spherical.radius=this._clampDistance(this._spherical.radius);else{const o=this._spherical.radius;this._spherical.radius=this._clampDistance(this._spherical.radius*this._scale),s=o!=this._spherical.radius}if(cn.setFromSpherical(this._spherical),cn.applyQuaternion(this._quatInverse),t.copy(this.target).add(cn),this.object.lookAt(this.target),this.enableDamping===!0?(this._sphericalDelta.theta*=1-this.dampingFactor,this._sphericalDelta.phi*=1-this.dampingFactor,this._panOffset.multiplyScalar(1-this.dampingFactor)):(this._sphericalDelta.set(0,0,0),this._panOffset.set(0,0,0)),this.zoomToCursor&&this._performCursorZoom){let o=null;if(this.object.isPerspectiveCamera){const a=cn.length();o=this._clampDistance(a*this._scale);const c=a-o;this.object.position.addScaledVector(this._dollyDirection,c),this.object.updateMatrixWorld(),s=!!c}else if(this.object.isOrthographicCamera){const a=new A(this._mouse.x,this._mouse.y,0);a.unproject(this.object);const c=this.object.zoom;this.object.zoom=Math.max(this.minZoom,Math.min(this.maxZoom,this.object.zoom/this._scale)),this.object.updateProjectionMatrix(),s=c!==this.object.zoom;const l=new A(this._mouse.x,this._mouse.y,0);l.unproject(this.object),this.object.position.sub(l).add(a),this.object.updateMatrixWorld(),o=cn.length()}else console.warn("WARNING: OrbitControls.js encountered an unknown camera type - zoom to cursor disabled."),this.zoomToCursor=!1;o!==null&&(this.screenSpacePanning?this.target.set(0,0,-1).transformDirection(this.object.matrix).multiplyScalar(o).add(this.object.position):(qo.origin.copy(this.object.position),qo.direction.set(0,0,-1).transformDirection(this.object.matrix),Math.abs(this.object.up.dot(qo.direction))<Dx?this.object.lookAt(this.target):(Nu.setFromNormalAndCoplanarPoint(this.object.up,this.target),qo.intersectPlane(Nu,this.target))))}else if(this.object.isOrthographicCamera){const o=this.object.zoom;this.object.zoom=Math.max(this.minZoom,Math.min(this.maxZoom,this.object.zoom/this._scale)),o!==this.object.zoom&&(this.object.updateProjectionMatrix(),s=!0)}return this._scale=1,this._performCursorZoom=!1,s||this._lastPosition.distanceToSquared(this.object.position)>xc||8*(1-this._lastQuaternion.dot(this.object.quaternion))>xc||this._lastTargetPosition.distanceToSquared(this.target)>xc?(this.dispatchEvent(Iu),this._lastPosition.copy(this.object.position),this._lastQuaternion.copy(this.object.quaternion),this._lastTargetPosition.copy(this.target),!0):!1}_getAutoRotationAngle(e){return e!==null?Fn/60*this.autoRotateSpeed*e:Fn/60/60*this.autoRotateSpeed}_getZoomScale(e){const t=Math.abs(e*.01);return Math.pow(.95,this.zoomSpeed*t)}_rotateLeft(e){this._sphericalDelta.theta-=e}_rotateUp(e){this._sphericalDelta.phi-=e}_panLeft(e,t){cn.setFromMatrixColumn(t,0),cn.multiplyScalar(-e),this._panOffset.add(cn)}_panUp(e,t){this.screenSpacePanning===!0?cn.setFromMatrixColumn(t,1):(cn.setFromMatrixColumn(t,0),cn.crossVectors(this.object.up,cn)),cn.multiplyScalar(e),this._panOffset.add(cn)}_pan(e,t){const n=this.domElement;if(this.object.isPerspectiveCamera){const r=this.object.position;cn.copy(r).sub(this.target);let s=cn.length();s*=Math.tan(this.object.fov/2*Math.PI/180),this._panLeft(2*e*s/n.clientHeight,this.object.matrix),this._panUp(2*t*s/n.clientHeight,this.object.matrix)}else this.object.isOrthographicCamera?(this._panLeft(e*(this.object.right-this.object.left)/this.object.zoom/n.clientWidth,this.object.matrix),this._panUp(t*(this.object.top-this.object.bottom)/this.object.zoom/n.clientHeight,this.object.matrix)):(console.warn("WARNING: OrbitControls.js encountered an unknown camera type - pan disabled."),this.enablePan=!1)}_dollyOut(e){this.object.isPerspectiveCamera||this.object.isOrthographicCamera?this._scale/=e:(console.warn("WARNING: OrbitControls.js encountered an unknown camera type - dolly/zoom disabled."),this.enableZoom=!1)}_dollyIn(e){this.object.isPerspectiveCamera||this.object.isOrthographicCamera?this._scale*=e:(console.warn("WARNING: OrbitControls.js encountered an unknown camera type - dolly/zoom disabled."),this.enableZoom=!1)}_updateZoomParameters(e,t){if(!this.zoomToCursor)return;this._performCursorZoom=!0;const n=this.domElement.getBoundingClientRect(),r=e-n.left,s=t-n.top,o=n.width,a=n.height;this._mouse.x=r/o*2-1,this._mouse.y=-(s/a)*2+1,this._dollyDirection.set(this._mouse.x,this._mouse.y,1).unproject(this.object).sub(this.object.position).normalize()}_clampDistance(e){return Math.max(this.minDistance,Math.min(this.maxDistance,e))}_handleMouseDownRotate(e){this._rotateStart.set(e.clientX,e.clientY)}_handleMouseDownDolly(e){this._updateZoomParameters(e.clientX,e.clientX),this._dollyStart.set(e.clientX,e.clientY)}_handleMouseDownPan(e){this._panStart.set(e.clientX,e.clientY)}_handleMouseMoveRotate(e){this._rotateEnd.set(e.clientX,e.clientY),this._rotateDelta.subVectors(this._rotateEnd,this._rotateStart).multiplyScalar(this.rotateSpeed);const t=this.domElement;this._rotateLeft(Fn*this._rotateDelta.x/t.clientHeight),this._rotateUp(Fn*this._rotateDelta.y/t.clientHeight),this._rotateStart.copy(this._rotateEnd),this.update()}_handleMouseMoveDolly(e){this._dollyEnd.set(e.clientX,e.clientY),this._dollyDelta.subVectors(this._dollyEnd,this._dollyStart),this._dollyDelta.y>0?this._dollyOut(this._getZoomScale(this._dollyDelta.y)):this._dollyDelta.y<0&&this._dollyIn(this._getZoomScale(this._dollyDelta.y)),this._dollyStart.copy(this._dollyEnd),this.update()}_handleMouseMovePan(e){this._panEnd.set(e.clientX,e.clientY),this._panDelta.subVectors(this._panEnd,this._panStart).multiplyScalar(this.panSpeed),this._pan(this._panDelta.x,this._panDelta.y),this._panStart.copy(this._panEnd),this.update()}_handleMouseWheel(e){this._updateZoomParameters(e.clientX,e.clientY),e.deltaY<0?this._dollyIn(this._getZoomScale(e.deltaY)):e.deltaY>0&&this._dollyOut(this._getZoomScale(e.deltaY)),this.update()}_handleKeyDown(e){let t=!1;switch(e.code){case this.keys.UP:e.ctrlKey||e.metaKey||e.shiftKey?this._rotateUp(Fn*this.rotateSpeed/this.domElement.clientHeight):this._pan(0,this.keyPanSpeed),t=!0;break;case this.keys.BOTTOM:e.ctrlKey||e.metaKey||e.shiftKey?this._rotateUp(-Fn*this.rotateSpeed/this.domElement.clientHeight):this._pan(0,-this.keyPanSpeed),t=!0;break;case this.keys.LEFT:e.ctrlKey||e.metaKey||e.shiftKey?this._rotateLeft(Fn*this.rotateSpeed/this.domElement.clientHeight):this._pan(this.keyPanSpeed,0),t=!0;break;case this.keys.RIGHT:e.ctrlKey||e.metaKey||e.shiftKey?this._rotateLeft(-Fn*this.rotateSpeed/this.domElement.clientHeight):this._pan(-this.keyPanSpeed,0),t=!0;break}t&&(e.preventDefault(),this.update())}_handleTouchStartRotate(e){if(this._pointers.length===1)this._rotateStart.set(e.pageX,e.pageY);else{const t=this._getSecondPointerPosition(e),n=.5*(e.pageX+t.x),r=.5*(e.pageY+t.y);this._rotateStart.set(n,r)}}_handleTouchStartPan(e){if(this._pointers.length===1)this._panStart.set(e.pageX,e.pageY);else{const t=this._getSecondPointerPosition(e),n=.5*(e.pageX+t.x),r=.5*(e.pageY+t.y);this._panStart.set(n,r)}}_handleTouchStartDolly(e){const t=this._getSecondPointerPosition(e),n=e.pageX-t.x,r=e.pageY-t.y,s=Math.sqrt(n*n+r*r);this._dollyStart.set(0,s)}_handleTouchStartDollyPan(e){this.enableZoom&&this._handleTouchStartDolly(e),this.enablePan&&this._handleTouchStartPan(e)}_handleTouchStartDollyRotate(e){this.enableZoom&&this._handleTouchStartDolly(e),this.enableRotate&&this._handleTouchStartRotate(e)}_handleTouchMoveRotate(e){if(this._pointers.length==1)this._rotateEnd.set(e.pageX,e.pageY);else{const n=this._getSecondPointerPosition(e),r=.5*(e.pageX+n.x),s=.5*(e.pageY+n.y);this._rotateEnd.set(r,s)}this._rotateDelta.subVectors(this._rotateEnd,this._rotateStart).multiplyScalar(this.rotateSpeed);const t=this.domElement;this._rotateLeft(Fn*this._rotateDelta.x/t.clientHeight),this._rotateUp(Fn*this._rotateDelta.y/t.clientHeight),this._rotateStart.copy(this._rotateEnd)}_handleTouchMovePan(e){if(this._pointers.length===1)this._panEnd.set(e.pageX,e.pageY);else{const t=this._getSecondPointerPosition(e),n=.5*(e.pageX+t.x),r=.5*(e.pageY+t.y);this._panEnd.set(n,r)}this._panDelta.subVectors(this._panEnd,this._panStart).multiplyScalar(this.panSpeed),this._pan(this._panDelta.x,this._panDelta.y),this._panStart.copy(this._panEnd)}_handleTouchMoveDolly(e){const t=this._getSecondPointerPosition(e),n=e.pageX-t.x,r=e.pageY-t.y,s=Math.sqrt(n*n+r*r);this._dollyEnd.set(0,s),this._dollyDelta.set(0,Math.pow(this._dollyEnd.y/this._dollyStart.y,this.zoomSpeed)),this._dollyOut(this._dollyDelta.y),this._dollyStart.copy(this._dollyEnd);const o=(e.pageX+t.x)*.5,a=(e.pageY+t.y)*.5;this._updateZoomParameters(o,a)}_handleTouchMoveDollyPan(e){this.enableZoom&&this._handleTouchMoveDolly(e),this.enablePan&&this._handleTouchMovePan(e)}_handleTouchMoveDollyRotate(e){this.enableZoom&&this._handleTouchMoveDolly(e),this.enableRotate&&this._handleTouchMoveRotate(e)}_addPointer(e){this._pointers.push(e.pointerId)}_removePointer(e){delete this._pointerPositions[e.pointerId];for(let t=0;t<this._pointers.length;t++)if(this._pointers[t]==e.pointerId){this._pointers.splice(t,1);return}}_isTrackingPointer(e){for(let t=0;t<this._pointers.length;t++)if(this._pointers[t]==e.pointerId)return!0;return!1}_trackPointer(e){let t=this._pointerPositions[e.pointerId];t===void 0&&(t=new ht,this._pointerPositions[e.pointerId]=t),t.set(e.pageX,e.pageY)}_getSecondPointerPosition(e){const t=e.pointerId===this._pointers[0]?this._pointers[1]:this._pointers[0];return this._pointerPositions[t]}_customWheelEvent(e){const t=e.deltaMode,n={clientX:e.clientX,clientY:e.clientY,deltaY:e.deltaY};switch(t){case 1:n.deltaY*=16;break;case 2:n.deltaY*=100;break}return e.ctrlKey&&!this._controlActive&&(n.deltaY*=10),n}}function Nx(i){this.enabled!==!1&&(this._pointers.length===0&&(this.domElement.setPointerCapture(i.pointerId),this.domElement.addEventListener("pointermove",this._onPointerMove),this.domElement.addEventListener("pointerup",this._onPointerUp)),!this._isTrackingPointer(i)&&(this._addPointer(i),i.pointerType==="touch"?this._onTouchStart(i):this._onMouseDown(i)))}function Fx(i){this.enabled!==!1&&(i.pointerType==="touch"?this._onTouchMove(i):this._onMouseMove(i))}function Ux(i){switch(this._removePointer(i),this._pointers.length){case 0:this.domElement.releasePointerCapture(i.pointerId),this.domElement.removeEventListener("pointermove",this._onPointerMove),this.domElement.removeEventListener("pointerup",this._onPointerUp),this.dispatchEvent(Wd),this.state=Qt.NONE;break;case 1:const e=this._pointers[0],t=this._pointerPositions[e];this._onTouchStart({pointerId:e,pageX:t.x,pageY:t.y});break}}function Ox(i){let e;switch(i.button){case 0:e=this.mouseButtons.LEFT;break;case 1:e=this.mouseButtons.MIDDLE;break;case 2:e=this.mouseButtons.RIGHT;break;default:e=-1}switch(e){case os.DOLLY:if(this.enableZoom===!1)return;this._handleMouseDownDolly(i),this.state=Qt.DOLLY;break;case os.ROTATE:if(i.ctrlKey||i.metaKey||i.shiftKey){if(this.enablePan===!1)return;this._handleMouseDownPan(i),this.state=Qt.PAN}else{if(this.enableRotate===!1)return;this._handleMouseDownRotate(i),this.state=Qt.ROTATE}break;case os.PAN:if(i.ctrlKey||i.metaKey||i.shiftKey){if(this.enableRotate===!1)return;this._handleMouseDownRotate(i),this.state=Qt.ROTATE}else{if(this.enablePan===!1)return;this._handleMouseDownPan(i),this.state=Qt.PAN}break;default:this.state=Qt.NONE}this.state!==Qt.NONE&&this.dispatchEvent(ih)}function kx(i){switch(this.state){case Qt.ROTATE:if(this.enableRotate===!1)return;this._handleMouseMoveRotate(i);break;case Qt.DOLLY:if(this.enableZoom===!1)return;this._handleMouseMoveDolly(i);break;case Qt.PAN:if(this.enablePan===!1)return;this._handleMouseMovePan(i);break}}function Bx(i){this.enabled===!1||this.enableZoom===!1||this.state!==Qt.NONE||(i.preventDefault(),this.dispatchEvent(ih),this._handleMouseWheel(this._customWheelEvent(i)),this.dispatchEvent(Wd))}function zx(i){this.enabled===!1||this.enablePan===!1||this._handleKeyDown(i)}function Hx(i){switch(this._trackPointer(i),this._pointers.length){case 1:switch(this.touches.ONE){case is.ROTATE:if(this.enableRotate===!1)return;this._handleTouchStartRotate(i),this.state=Qt.TOUCH_ROTATE;break;case is.PAN:if(this.enablePan===!1)return;this._handleTouchStartPan(i),this.state=Qt.TOUCH_PAN;break;default:this.state=Qt.NONE}break;case 2:switch(this.touches.TWO){case is.DOLLY_PAN:if(this.enableZoom===!1&&this.enablePan===!1)return;this._handleTouchStartDollyPan(i),this.state=Qt.TOUCH_DOLLY_PAN;break;case is.DOLLY_ROTATE:if(this.enableZoom===!1&&this.enableRotate===!1)return;this._handleTouchStartDollyRotate(i),this.state=Qt.TOUCH_DOLLY_ROTATE;break;default:this.state=Qt.NONE}break;default:this.state=Qt.NONE}this.state!==Qt.NONE&&this.dispatchEvent(ih)}function Vx(i){switch(this._trackPointer(i),this.state){case Qt.TOUCH_ROTATE:if(this.enableRotate===!1)return;this._handleTouchMoveRotate(i),this.update();break;case Qt.TOUCH_PAN:if(this.enablePan===!1)return;this._handleTouchMovePan(i),this.update();break;case Qt.TOUCH_DOLLY_PAN:if(this.enableZoom===!1&&this.enablePan===!1)return;this._handleTouchMoveDollyPan(i),this.update();break;case Qt.TOUCH_DOLLY_ROTATE:if(this.enableZoom===!1&&this.enableRotate===!1)return;this._handleTouchMoveDollyRotate(i),this.update();break;default:this.state=Qt.NONE}}function Gx(i){this.enabled!==!1&&i.preventDefault()}function Wx(i){i.key==="Control"&&(this._controlActive=!0,this.domElement.getRootNode().addEventListener("keyup",this._interceptControlUp,{passive:!0,capture:!0}))}function qx(i){i.key==="Control"&&(this._controlActive=!1,this.domElement.getRootNode().removeEventListener("keyup",this._interceptControlUp,{passive:!0,capture:!0}))}class jx extends Yl{constructor(){super();const e=new Cs;e.deleteAttribute("uv");const t=new Fr({side:Cn}),n=new Fr,r=new Vd(16777215,900,28,2);r.position.set(.418,16.199,.3),this.add(r);const s=new Xt(e,t);s.position.set(-.757,13.219,.717),s.scale.set(31.713,28.305,28.591),this.add(s);const o=new Xt(e,n);o.position.set(-10.906,2.009,1.846),o.rotation.set(0,-.195,0),o.scale.set(2.328,7.905,4.651),this.add(o);const a=new Xt(e,n);a.position.set(-5.607,-.754,-.758),a.rotation.set(0,.994,0),a.scale.set(1.97,1.534,3.955),this.add(a);const c=new Xt(e,n);c.position.set(6.167,.857,7.803),c.rotation.set(0,.561,0),c.scale.set(3.927,6.285,3.687),this.add(c);const l=new Xt(e,n);l.position.set(-2.017,.018,6.124),l.rotation.set(0,.333,0),l.scale.set(2.002,4.566,2.064),this.add(l);const h=new Xt(e,n);h.position.set(2.291,-.756,-2.621),h.rotation.set(0,-.286,0),h.scale.set(1.546,1.552,1.496),this.add(h);const u=new Xt(e,n);u.position.set(-2.193,-.369,-5.547),u.rotation.set(0,.516,0),u.scale.set(3.875,3.487,2.986),this.add(u);const d=new Xt(e,Jr(50));d.position.set(-16.116,14.37,8.208),d.scale.set(.1,2.428,2.739),this.add(d);const p=new Xt(e,Jr(50));p.position.set(-16.109,18.021,-8.207),p.scale.set(.1,2.425,2.751),this.add(p);const g=new Xt(e,Jr(17));g.position.set(14.904,12.198,-1.832),g.scale.set(.15,4.265,6.331),this.add(g);const b=new Xt(e,Jr(43));b.position.set(-.462,8.89,14.52),b.scale.set(4.38,5.441,.088),this.add(b);const m=new Xt(e,Jr(20));m.position.set(3.235,11.486,-12.541),m.scale.set(2.5,2,.1),this.add(m);const f=new Xt(e,Jr(100));f.position.set(0,20,0),f.scale.set(1,.1,1),this.add(f)}dispose(){const e=new Set;this.traverse(t=>{t.isMesh&&(e.add(t.geometry),e.add(t.material))});for(const t of e)t.dispose()}}function Jr(i){const e=new Bi;return e.color.setScalar(i),e}const qd=["left","right"],Xx=["step","point"],Al=i=>structuredClone(i);function la(i,e,t=1/0){if(!Array.isArray(i)||i.length!==3||Array.from(i).some(n=>typeof n!="number"||!Number.isFinite(n)||Math.abs(n)>t))throw new TypeError(`${e} must contain three finite numbers${t===1/0?"":` within ±${t}`}.`)}function Tl(i){return i&&typeof i=="object"&&!Array.isArray(i)&&Xx.includes(i.kind)&&typeof i.id=="string"&&!!i.id.trim()}function ao(i){if(!Tl(i))throw new TypeError("A foot curve anchor needs kind step or point and a non-empty string id.");return{kind:i.kind,id:i.id}}function Fu(i){const{kind:e,id:t}=ao(i);return JSON.stringify([e,t])}function Ts(i,e){return!!(Tl(i)&&Tl(e)&&i.kind===e.kind&&i.id===e.id)}function Qx(i,e,t=i?.side){return!!(qd.includes(t)&&i?.side===t&&Ts(i.from,e?.from)&&Ts(i.to,e?.to))}function Kx(i){if(!Array.isArray(i)||i.length>200)throw new TypeError("Foot curves must be an array with at most 200 entries.");const e=new Set,t=new Set;for(const[n,r]of i.entries()){const s=`Foot curve ${n+1}`;if(!r||typeof r!="object"||Array.isArray(r))throw new TypeError(`${s} must be an object.`);if(typeof r.id!="string"||!r.id.trim())throw new TypeError(`${s} needs a non-empty string id.`);if(e.has(r.id))throw new TypeError(`${s} repeats a curve id.`);if(e.add(r.id),!qd.includes(r.side))throw new TypeError(`${s} side must be left or right.`);const o=ao(r.from),a=ao(r.to);if(Ts(o,a))throw new TypeError(`${s} must connect two different anchors.`);const c=JSON.stringify([r.side,o.kind,o.id,a.kind,a.id]);if(t.has(c))throw new TypeError(`${s} repeats a side and directed anchor pair.`);t.add(c),la(r.bend,`${s} bend`,1e4)}return Al(i)}function Yx(i,e,t,n){if(la(i,"Foot curve start"),la(e,"Foot curve end"),la(t,"Foot curve bend",1e4),typeof n!="number"||!Number.isFinite(n)||n<0||n>1)throw new TypeError("Foot curve blend must be finite and between 0 and 1.");if(n===0)return Al(i);if(n===1)return Al(e);const r=4*n*(1-n);return i.map((s,o)=>s*(1-n)+e[o]*n+r*t[o])}const vc=["pelvis","leftAnkle","rightAnkle","leftWrist","rightWrist"],$x=["leftKnee","rightKnee","leftElbow","rightElbow"],us=i=>structuredClone(i),Rr=i=>i&&typeof i=="object"&&!Array.isArray(i);function Gi(i,e,t=10){if(!Array.isArray(i)||i.length!==3||Array.from(i).some(n=>typeof n!="number"||!Number.isFinite(n)||Math.abs(n)>t))throw new TypeError(`${e}需要三个${t===1/0?"":`在 ±${t} 米以内的`}有限坐标。`)}function jd(i,e){if(!Rr(i))throw new TypeError(`${e}需要为对象。`);if(Gi(i.center,`${e}旋转中心`),Object.hasOwn(i,"arc")&&!["short","long"].includes(i.arc))throw new TypeError(`${e}请选择短弧或长弧。`);if(Object.hasOwn(i,"normal")&&(Gi(i.normal,`${e}备用旋转平面法向`,1/0),Math.max(...i.normal.map(Math.abs))===0))throw new TypeError(`${e}备用旋转平面法向不能为零。`)}function Zx(i,e){if(!Array.isArray(i)||i.length>200)throw new TypeError("整段路线需要为数组，最多保存 200 条。");const t=new Set,n=new Set,r=Array.isArray(e)?e:e?.steps;if(e!==void 0&&!Array.isArray(r))throw new TypeError("整段路线需要有效的动画节点。");const s=r&&new Set(r.map((o,a)=>typeof o?.id=="string"&&o.id.trim()?o.id:`step-${a}`));for(const[o,a]of i.entries()){const c=`整段路线 ${o+1}`;if(!Rr(a))throw new TypeError(`${c}需要为对象。`);if(typeof a.id!="string"||!a.id.trim()||t.has(a.id))throw new TypeError(`${c}需要独立且非空的编号。`);t.add(a.id);const l=ao(a.from),h=ao(a.to);if(Ts(l,h))throw new TypeError(`${c}需要两个不同的关键帧。`);for(const d of[l,h])if(s&&d.kind==="step"&&!s.has(d.id))throw new TypeError(`${c}的原关键帧不属于当前动画。`);const u=JSON.stringify([Fu(l),Fu(h)]);if(n.has(u))throw new TypeError(`${c}重复指定同一个有向关键帧区间。`);if(n.add(u),!["linear","smooth"].includes(a.timing))throw new TypeError(`${c}需要选择线性或平滑补帧。`);if(Object.hasOwn(a,"bends")){if(!Rr(a.bends))throw new TypeError(`${c}的位置路线需要为对象。`);for(const d of vc)Object.hasOwn(a.bends,d)&&Gi(a.bends[d],`${c} ${d}`)}if(Object.hasOwn(a,"smoothPaths")){if(!Rr(a.smoothPaths))throw new TypeError(`${c}的平滑弧线需要为对象。`);for(const d of vc)if(Object.hasOwn(a.smoothPaths,d)){const p=a.smoothPaths[d];if(!Rr(p))throw new TypeError(`${c} ${d} 的平滑弧线需要为对象。`);Gi(p.bend,`${c} ${d} 平滑弧线中点偏移`)}}if(Object.hasOwn(a,"orbitPaths")){if(!Rr(a.orbitPaths))throw new TypeError(`${c}的旋转中心路线需要为对象。`);for(const d of vc)Object.hasOwn(a.orbitPaths,d)&&jd(a.orbitPaths[d],`${c} ${d} 旋转中心路线`)}if(Object.hasOwn(a,"bendAngles")){if(!Rr(a.bendAngles))throw new TypeError(`${c}的关节弯向需要为对象。`);for(const d of $x)if(Object.hasOwn(a.bendAngles,d)){const p=a.bendAngles[d];if(typeof p!="number"||!Number.isFinite(p)||Math.abs(p)>2*Math.PI)throw new TypeError(`${c} ${d}需要在 ±2π 以内的有限角度。`)}}}return us(i)}function Jx(i,e){return!!(i&&Ts(i.from,e?.from)&&Ts(i.to,e?.to))}function ev(i){if(typeof i!="number"||!Number.isFinite(i)||i<0||i>1)throw new TypeError("整段路线进度需要为 0–1 之间的有限数值。");return i===0||i===1?0:16*i*i*(1-i)*(1-i)}function tv(i,e,t,n){if(Gi(i,"整段平滑弧线起点",1/0),Gi(e,"整段平滑弧线终点",1/0),Gi(t,"整段平滑弧线中点偏移"),typeof n!="number"||!Number.isFinite(n)||n<0||n>1)throw new TypeError("整段平滑弧线进度需要为 0–1 之间的有限数值。");if(n===0)return us(i);if(n===1)return us(e);const r=4*n*(1-n);return i.map((s,o)=>s*(1-n)+e[o]*n+r*t[o])}const xa=(i,e)=>i.reduce((t,n,r)=>t+n*e[r],0),Uu=(i,e)=>[i[1]*e[2]-i[2]*e[1],i[2]*e[0]-i[0]*e[2],i[0]*e[1]-i[1]*e[0]];function ds(i){const e=Math.max(...i.map(Math.abs));if(e===0)return null;const t=i.map(r=>r/e),n=Math.hypot(...t);return t.map(r=>r/n)}function Ou(i,e){const t=i.map((o,a)=>o-e[a]),n=ds(t);if(!n)throw new RangeError("旋转中心不能与任一端点重合，请移动旋转中心。");const r=Math.max(...t.map(Math.abs)),s=r*Math.hypot(...t.map(o=>o/r));if(!Number.isFinite(s))throw new RangeError("端点离旋转中心过远，无法计算有限的弧线。");return{direction:n,radius:s}}function nv(i,e){if(e){const s=ds(e),o=xa(s,i),a=s.map((c,l)=>c-o*i[l]);if(Math.hypot(...a)>1e-12)return ds(a)}let t=0;for(let s=1;s<3;s++)Math.abs(i[s])<Math.abs(i[t])&&(t=s);const n=[0,0,0];n[t]=1;const r=xa(n,i);return ds(n.map((s,o)=>s-r*i[o]))}function iv(i,e,t,n){if(Gi(i,"整段旋转弧线起点",1/0),Gi(e,"整段旋转弧线终点",1/0),jd(t,"整段旋转弧线"),typeof n!="number"||!Number.isFinite(n)||n<0||n>1)throw new TypeError("整段旋转弧线进度需要为 0–1 之间的有限数值。");const r=Ou(i,t.center),s=Ou(e,t.center);if(n===0)return us(i);if(n===1)return us(e);if(t.arc!=="long"&&i.every((f,M)=>f===e[M]))return us(i);const o=Uu(r.direction,s.direction),a=Math.max(-1,Math.min(1,xa(r.direction,s.direction)));let c=ds(o);const l=c?Math.atan2(Math.hypot(...o),a):a<0?Math.PI:0;c??(c=nv(r.direction,t.normal));const h=(t.arc==="long"?l-2*Math.PI:l)*n,u=Math.sin(h),d=Math.cos(h),p=Uu(c,r.direction),g=xa(c,r.direction),b=r.radius*(1-n)+s.radius*n;return ds(r.direction.map((f,M)=>f*d+p[M]*u+c[M]*g*(1-d))).map((f,M)=>t.center[M]+b*f)}const va=["left","right"],Xd=["wrist","elbowPole","ankle","kneePole"],Qd=["handQuaternion","footQuaternion"],Kd=["elbowTwist","kneeTwist","upperArmTwist","thighTwist"],ku=[0,0,0,1],on=i=>structuredClone(i);function Rl(i,e,t){if(!Array.isArray(i)||i.length!==e||Array.from(i).some(n=>typeof n!="number"||!Number.isFinite(n)))throw new TypeError(`${t} must contain ${e} finite numbers.`)}function jo(i,e){if(Rl(i,4,e),Math.max(...i.map(Math.abs))===0)throw new TypeError(`${e} cannot be a zero quaternion.`)}function La(i,e){if(typeof i=="number"&&!Number.isFinite(i))throw new TypeError(`${e} contains a non-finite number.`);if(i&&typeof i=="object")for(const[t,n]of Object.entries(i))La(n,`${e}.${t}`)}function ha(i,e){const t=typeof e=="number"?`Step ${e+1}`:e;if(!i||i.version!==1)throw new TypeError(`${t} needs a version 1 pose.`);if(Rl(i.pelvis,3,`${t} pelvis`),jo(i.bodyQuaternion,`${t} bodyQuaternion`),Object.hasOwn(i,"torsoQuaternion")&&jo(i.torsoQuaternion,`${t} torsoQuaternion`),Object.hasOwn(i,"pelvisQuaternion")&&jo(i.pelvisQuaternion,`${t} pelvisQuaternion`),typeof i.groundLock!="boolean")throw new TypeError(`${t} groundLock must be boolean.`);for(const n of va){const r=i.limbs?.[n];if(!r||typeof r.handLocked!="boolean")throw new TypeError(`${t} ${n} handLocked must be boolean.`);for(const s of Xd)Rl(r[s],3,`${t} ${n} ${s}`);for(const s of Qd)jo(r[s],`${t} ${n} ${s}`);for(const s of Kd)if(Object.hasOwn(r,s)&&(typeof r[s]!="number"||!Number.isFinite(r[s])))throw new TypeError(`${t} ${n} ${s} must be a finite angle in radians.`)}La(i,t)}function Xo(i){const e=Math.max(...i.map(Math.abs)),t=i.map(r=>r/e),n=Math.hypot(...t);return t.map(r=>r/n)}function Qo(i,e,t){const n=Xo(i),r=Xo(e);let s=n.reduce((h,u,d)=>h+u*r[d],0);if(s<0){for(let h=0;h<4;h++)r[h]=-r[h];s=-s}if(s=Math.min(1,Math.max(0,s)),s>.9995)return Xo(n.map((h,u)=>h*(1-t)+r[u]*t));const o=Math.acos(s),a=Math.sin(o),c=Math.sin((1-t)*o)/a,l=Math.sin(t*o)/a;return Xo(n.map((h,u)=>h*c+r[u]*l))}const Bu=(i,e,t)=>i.map((n,r)=>n*(1-t)+e[r]*t);function rv(i,e,t){const n=2*Math.PI,r=((e%n-i%n+Math.PI)%n+n)%n-Math.PI;return i+r*t}const Ko=i=>i*i*(3-2*i);function es(i,e){return i+e>1&&([i,e]=[1-e,1-i]),(e-i)*(3*(i+e)-2*(i*i+i*e+e*e))}function sv(i,e,t){const n=on(i);n.pelvis=Bu(i.pelvis,e.pelvis,t),n.bodyQuaternion=Qo(i.bodyQuaternion,e.bodyQuaternion,t),(Object.hasOwn(i,"pelvisQuaternion")||Object.hasOwn(e,"pelvisQuaternion"))&&(n.pelvisQuaternion=Qo(i.pelvisQuaternion??i.bodyQuaternion,e.pelvisQuaternion??e.bodyQuaternion,t)),(Object.hasOwn(i,"torsoQuaternion")||Object.hasOwn(e,"torsoQuaternion"))&&(n.torsoQuaternion=Qo(i.torsoQuaternion??ku,e.torsoQuaternion??ku,t));for(const r of va){const s=n.limbs[r];for(const o of Xd)s[o]=Bu(i.limbs[r][o],e.limbs[r][o],t);for(const o of Qd)s[o]=Qo(i.limbs[r][o],e.limbs[r][o],t);for(const o of Kd)(Object.hasOwn(i.limbs[r],o)||Object.hasOwn(e.limbs[r],o))&&(s[o]=rv(i.limbs[r][o]??0,e.limbs[r][o]??0,t));s.handLocked=i.limbs[r].handLocked&&e.limbs[r].handLocked}return n}function ov(i,e){if(!Array.isArray(i))throw new TypeError("Transition corrections must be an array.");const t=new Set;for(const[r,s]of i.entries()){const o=`Correction ${r+1}`;if(!s||typeof s!="object"||Array.isArray(s))throw new TypeError(`${o} must be an object.`);if(typeof s.id!="string"||!s.id.trim())throw new TypeError(`${o} needs a non-empty string id.`);if(t.has(s.id))throw new TypeError(`${o} repeats a correction id.`);if(t.add(s.id),!Number.isInteger(s.segment)||s.segment<0||s.segment>=e)throw new TypeError(`${o} segment must be an existing transition index.`);if(typeof s.at!="number"||!Number.isFinite(s.at)||s.at<=0||s.at>=1)throw new TypeError(`${o} at must be strictly between 0 and 1.`);ha(s.pose,o),La(s,o)}const n=on(i).sort((r,s)=>r.segment-s.segment||r.at-s.at);for(let r=1;r<n.length;r++){const s=n[r-1],o=n[r];if(s.segment===o.segment&&o.at-s.at<=1e-8)throw new TypeError("A transition cannot have correction points at the same position.")}return n}function av(i){const e={front:0,sideA:2,rear:4,sideB:6,frontRepeat:8};for(const t of["front","sideA","rear","sideB"]){const n=i.flatMap((r,s)=>r.phase===t?[s]:[]);n.length&&(e[t]=t.startsWith("side")?n[Math.floor(n.length/2)]:n[0],t==="front"&&(e.frontRepeat=n.at(-1)),t==="rear"&&n.length>1&&(e.rearRepeat=n.at(-1)))}return e}function cv(i,e){if(!Array.isArray(i))throw new TypeError("Skipped steps must be an array of original step indices.");const t=new Set;for(const n of i){if(!Number.isInteger(n)||n<0||n>=e)throw new TypeError("A skipped step must be an existing original step index.");if(t.has(n))throw new TypeError("Skipped step indices must be unique.");t.add(n)}return t}function yc(i,{period:e=i?.length,corrections:t=[],mapTransition:n,interpolation:r="smooth",skippedSteps:s=[],footCurves:o=[],resolveFootEndpoint:a,segmentGuides:c=[],mapGuidedTransition:l}={}){if(!Array.isArray(i)||!i.length)throw new TypeError("A flare sequence needs at least one step.");if(typeof e!="number"||!Number.isFinite(e)||e<=0)throw new TypeError("Sequence period must be positive and finite.");if(n!==void 0&&typeof n!="function")throw new TypeError("mapTransition must be a function.");if(l!==void 0&&typeof l!="function")throw new TypeError("mapGuidedTransition must be a function.");if(a!==void 0&&typeof a!="function")throw new TypeError("resolveFootEndpoint must be a function.");if(r!=="smooth"&&r!=="linear")throw new TypeError("Sequence interpolation must be smooth or linear.");for(const[L,W]of i.entries())ha(W?.pose,L),La(W,`Step ${L+1}`);const h=ov(t,i.length),u=cv(s,i.length),d=Kx(o),p=Zx(c,i),g=on(i),b=g.length,m=g.map((L,W)=>({kind:"step",id:typeof L.id=="string"&&L.id.trim()?L.id:`step-${W}`,coordinate:W,index:W,pose:L.pose})),f=m.filter((L,W)=>!u.has(W)),M=h.map(L=>({...L,kind:"point",coordinate:L.segment+L.at,index:L.segment})),x=f.concat(M).sort((L,W)=>L.coordinate-W.coordinate);if(!x.length)throw new TypeError("A sequence needs at least one enabled original step or correction.");const _=Array.from({length:b},(L,W)=>[{...m[W],at:0},...M.filter(q=>q.segment===W),{...m[(W+1)%b],at:1}]),I=L=>Math.min(1e-8,32*Number.EPSILON*Math.max(1,b,Math.abs(L/e)*b)),R=L=>{if(typeof L!="number"||!Number.isFinite(L))throw new TypeError("Sequence time must be finite.");let W=L%e;W<0&&(W+=e);const q=W/e*b,j=Math.max(0,Math.min(b-1,Math.floor(q))),ee=(j+1)%b,ue=q-j,X=I(L);return ue<=Math.min(X,_[j][1].at/2)?{index:j,next:ee,progress:0}:1-ue<=Math.min(X,(1-_[j].at(-2).at)/2)?{index:ee,next:(ee+1)%b,progress:0}:{index:j,next:ee,progress:ue}},T=(L,W,q,j)=>{const ee=p.length?ae(j):null,ue=ee&&G(ee);ue&&(q=ee.blend);const X=sv(L,W,q);let re=X;if(n){const xe=n(X,{start:on(L),end:on(W),blend:q});ha(xe,"Mapped transition"),re=on(xe)}if(d.length){const xe=ee??Q(j);xe.blend=q;for(const me of va){const Te=ne(xe,me);Te&&(re.limbs[me].ankle=Te.position)}}if(ue&&!ee.exact&&l){const xe=l(re,{start:on(L),end:on(W),blend:q,time:j,span:oe(ee,j),guide:on(ue)});ha(xe,"Guided transition"),re=xe}return re},F=L=>{let W=L%e;return W<0&&(W+=e),W/e*b},S=(L,W)=>{const q=L.findIndex(ue=>ue.coordinate>W),j=L[(q<=0?L.length:q)-1],ee=L[q<0?0:q];return{left:j,right:ee,start:j.coordinate-(q===0?b:0),end:ee.coordinate+(q<0?b:0)}},v=(L,W)=>{let q=(W-L.start)/(L.end-L.start);if(r==="smooth")if(f.length){const j=S(f,W),ee=j.end-j.start,ue=(L.start-j.start)/ee,X=(L.end-j.start)/ee,re=(W-j.start)/ee;q=es(ue,re)/es(ue,X)}else q=Ko(q);return Math.min(1,Math.max(0,q))},P=(L,W,q)=>{const j=x.indexOf(L),ee=L.coordinate+Math.round((W-L.coordinate)/b)*b;if(q==="previous"){const xe=x[(j+x.length-1)%x.length],me=L.coordinate-xe.coordinate,Te=me>0?me:me+b;return{left:xe,right:L,start:ee-Te,end:ee,blend:1,exact:!0}}const ue=x[(j+1)%x.length],X=ue.coordinate-L.coordinate,re=X>0?X:X+b;return{left:L,right:ue,start:ee,end:ee+re,blend:0,exact:!0}},Q=(L,W="next")=>{const{index:q,next:j,progress:ee}=R(L),ue=F(L),X=S(x,ue);if(u.has(q)||u.has(j)||x.length===1){const Ce=ue-X.start,rt=X.end-ue;return Math.min(Ce,rt)<=Math.min(I(L),(X.end-X.start)/2)?P(Ce<rt?X.left:X.right,ue,W):{...X,blend:v(X,ue),exact:!1}}if(ee===0)return P(f.find(Ce=>Ce.index===q),ue,W);const xe=_[q];if(xe.length===2)return{...X,blend:r==="linear"?ee:Ko(ee),exact:!1};const me=xe.reduce((Ce,rt)=>Math.abs(ee-rt.at)<Math.abs(ee-Ce.at)?rt:Ce);if(Math.abs(ee-me.at)<=I(L)){const Ce=x.find(rt=>rt.kind===me.kind&&(rt.kind==="step"?rt.index===me.index:rt.id===me.id));return P(Ce,ue,W)}const Te=xe.findIndex(Ce=>Ce.at>ee),ke=xe[Te-1],He=xe[Te],Ze=r==="linear"?(ee-ke.at)/(He.at-ke.at):es(ke.at,ee)/es(ke.at,He.at);return{...X,blend:Math.min(1,Math.max(0,Ze)),exact:!1}},G=L=>p.find(W=>Jx(W,{from:L.left,to:L.right})),ae=(L,W="next")=>{const q=Q(L,W),j=G(q);if(!j||q.exact)return q;const ee=Math.min(1,Math.max(0,(F(L)-q.start)/(q.end-q.start)));return{...q,blend:j.timing==="linear"?ee:Ko(ee)}},oe=(L,W)=>{let q=W%e;q<0&&(q+=e);const j=W-q,ee=j+L.start/b*e,ue=j+L.end/b*e;return{from:{kind:L.left.kind,id:L.left.id,pose:on(L.left.pose),time:ee},to:{kind:L.right.kind,id:L.right.id,pose:on(L.right.pose),time:ue},startTime:ee,endTime:ue,blend:L.blend}},ne=(L,W)=>{const q=d.find(ee=>Qx(ee,{from:L.left,to:L.right},W));if(!q)return null;const j=ee=>a?a(on(ee.pose),W):ee.pose.limbs[W].ankle;return{curve:q,position:Yx(j(L.left),j(L.right),q.bend,L.blend)}},he=(L,W)=>{if(x.length===1)return on(x[0].pose);const q=S(x,W),j=W-q.start,ee=q.end-W,ue=j<ee?q.left:q.right;return Math.min(j,ee)<=Math.min(I(L),(q.end-q.start)/2)?on(ue.pose):T(q.left.pose,q.right.pose,v(q,W),L)};return{steps:on(g),period:e,keyframes:av(g),transitionAt(L){return R(L)},spanAt(L,W={}){if(!W||typeof W!="object"||Array.isArray(W))throw new TypeError("Span options must be an object.");const{prefer:q="next"}=W;if(q!=="previous"&&q!=="next")throw new TypeError("Span preference must be previous or next.");return oe(ae(L,q),L)},guideAt(L,W={}){if(typeof W=="string"&&(W={prefer:W}),!W||typeof W!="object"||Array.isArray(W))throw new TypeError("Guide options must be an object.");const{prefer:q="next"}=W;if(q!=="previous"&&q!=="next")throw new TypeError("Guide preference must be previous or next.");const j=ae(L,q),ee=G(j);return ee?{guide:on(ee),span:oe(j,L)}:null},curveAt(L,W){if(!va.includes(W))throw new TypeError("Foot curve side must be left or right.");let q=ae(L),j=ne(q,W);return!j&&q.exact&&(q=ae(L,"previous"),j=ne(q,W)),j?{curve:on(j.curve),span:oe(q,L),position:j.position}:null},stepAt(L){const{index:W,next:q,progress:j}=R(L);if(u.size){const ee=F(L),ue=S(f.length?f:x,ee);return ee-ue.start>=ue.end-ee?ue.right.index:ue.left.index}return j>=.5?q:W},sample(L){const{index:W,next:q,progress:j}=R(L);if(u.has(W)||u.has(q))return he(L,F(L));const ee=g[W].pose,ue=g[q].pose;if(j===0)return on(ee);const X=_[W];if(X.length===2)return b===1?on(ee):T(ee,ue,r==="linear"?j:Ko(j),L);const re=X.reduce((He,Ze)=>Math.abs(j-Ze.at)<Math.abs(j-He.at)?Ze:He);if(Math.abs(j-re.at)<=I(L))return on(re.pose);const xe=X.findIndex(He=>He.at>j),me=X[xe-1],Te=X[xe],ke=r==="linear"?(j-me.at)/(Te.at-me.at):es(me.at,j)/es(me.at,Te.at);return T(me.pose,Te.pose,Math.min(1,Math.max(0,ke)),L)}}}const co=1e-10,Yd=new A(0,1,0),mi=i=>new A().fromArray(i),Mc=i=>new qe().fromArray(i).normalize(),ya=(i,e,t)=>i*(1-t)+e*t;function ua(i,e){const t=e.clone().addScaledVector(i,-e.dot(i));return t.lengthSq()<co&&(t.copy(Math.abs(i.z)<.9?new A(0,0,1):Yd),t.addScaledVector(i,-t.dot(i))),t.normalize()}function zu(i,e,t){const n=Math.max(-1,Math.min(1,i.dot(e)));if(n>1-co)return new qe;const r=new A().crossVectors(i,e);return r.lengthSq()<co&&r.crossVectors(i,ua(i,t)),new qe().setFromAxisAngle(r.normalize(),Math.acos(n))}function Hu(i,e){return new qe().setFromRotationMatrix(new ot().makeBasis(e,new A().crossVectors(i,e).normalize(),i))}function lv(i,e,t,n,r){if(!(n>0&&r>0))return ya(i,e,t);const s=a=>Math.acos(Math.max(-1,Math.min(1,(a*a-n*n-r*r)/(2*n*r)))),o=ya(s(i),s(e),t);return Math.sqrt(Math.max(0,n*n+r*r+2*n*r*Math.cos(o)))}function js({startRoot:i,endRoot:e,currentRoot:t,startTarget:n,endTarget:r,currentTarget:s,startMiddle:o,endMiddle:a,startReference:c,endReference:l,currentReference:h,blend:u,upperLength:d,lowerLength:p,arc:g=!0,floorHeight:b=-1/0,side:m="left"}){const f=Mc(c),M=Mc(l),x=Mc(h),_=mi(i),I=mi(e),R=mi(t),T=mi(n).sub(_),F=mi(r).sub(I),S=T.clone().applyQuaternion(f.clone().invert()),v=F.clone().applyQuaternion(M.clone().invert()),P=S.length(),Q=v.length();if(P<1e-8||Q<1e-8)return{target:[...s],pole:mi(o).lerp(mi(a),u).toArray()};const G=S.clone().normalize(),ae=v.clone().normalize(),oe=mi(o).sub(_),ne=mi(a).sub(I),he=ua(T.clone().normalize(),oe).applyQuaternion(f.clone().invert()),L=ua(F.clone().normalize(),ne).applyQuaternion(M.clone().invert()),W=oe.clone().applyQuaternion(f.clone().invert()),q=ne.clone().applyQuaternion(M.clone().invert()),j=new qe().slerp(zu(G,ae,he),u),ee=lv(P,Q,u,d,p),ue=g?G.clone().applyQuaternion(j).multiplyScalar(ee).applyQuaternion(x):mi(s).sub(R);if(g&&Number.isFinite(b)&&R.y+ue.y<b){const rt=b-R.y;if(rt<=ee){const N=Math.sqrt(Math.max(0,ee*ee-rt*rt)),Ft=new A(ue.x,0,ue.z);Ft.lengthSq()<co&&(Ft.copy(G).applyQuaternion(x),Ft.y=0,Ft.lengthSq()<co&&Ft.set(m==="left"?1:-1,0,0)),Ft.normalize().multiplyScalar(N),ue.set(Ft.x,rt,Ft.z)}else ue.set(0,rt,0)}const X=ue.lengthSq()>1e-12?ue.clone().normalize():Yd.clone().negate(),re=X.clone().applyQuaternion(x.clone().invert()),xe=Hu(G,he).slerp(Hu(ae,L),u),me=new A(0,0,1).applyQuaternion(xe),Te=new A(1,0,0).applyQuaternion(xe),ke=Te.applyQuaternion(zu(me,re,Te)),He=ua(re,ke).applyQuaternion(x),Ze=ya(W.dot(G),q.dot(ae),u),Ce=Math.max(1e-4,ya(W.clone().addScaledVector(G,-W.dot(G)).length(),q.clone().addScaledVector(ae,-q.dot(ae)).length(),u));return{target:R.clone().add(ue).toArray(),pole:R.clone().addScaledVector(X,Ze).addScaledVector(He,Ce).toArray()}}const Lr=[.8,1.27],hv=[1/3,2/3],uv=i=>i*i*(3-2*i);function dv({model:i,meshes:e,skeletons:t,landmarks:n}){const r=Vu(i,"pelvis"),s=Vu(i,"torso");if(!r||!s||!n?.pelvis||!n?.torso)return null;const o=r.parent;i.updateMatrixWorld(!0);const a=r.matrixWorld.clone(),c=s.matrixWorld.clone(),l=a.clone().invert(),h=c.clone().invert(),u=new A(...n.pelvis).applyMatrix4(i.matrixWorld),d=new A(...n.torso).applyMatrix4(i.matrixWorld),p=hv.map((P,Q)=>{const G=new Zl;G.name=Q?"spineUpper":"spineLower",G.matrixAutoUpdate=!1,G.matrixWorldAutoUpdate=!1,o.add(G);const ae=u.clone().lerp(d,P);return ae.y=Nt.lerp(Lr[0],Lr[1],P),{bone:G,share:P,pivot:ae}}),g=new Map;for(const P of e){let Q=g.get(P.skeleton);if(!Q){const ne=P.skeleton,he=a.clone().multiply(ne.boneInverses[ne.bones.indexOf(r)]);Q=new Ca([...ne.bones,...p.map(L=>L.bone)],[...ne.boneInverses,...p.map(()=>he.clone())]),g.set(ne,Q)}const G=Q.bones.indexOf(r),ae=Q.bones.indexOf(s),oe=p.map(ne=>Q.bones.indexOf(ne.bone));fv(P,[G,oe[0],oe[1],ae]),P.bind(Q,P.bindMatrix)}t.clear();for(const P of g.values())P.bones.length&&t.add(P);const b=new ot,m=new ot,f=new qe,M=new qe,x=new qe,_=new A,I=new A,R=new A,T=new A,F=new A,S=new ot;function v(){b.multiplyMatrices(r.matrixWorld,l),m.multiplyMatrices(s.matrixWorld,h),b.decompose(_,f,R),m.decompose(I,M,R);for(const{bone:P,share:Q,pivot:G}of p)x.slerpQuaternions(f,M,Q),T.copy(G).applyMatrix4(b),F.copy(G).applyMatrix4(m),T.lerp(F,Q),S.makeRotationFromQuaternion(x),P.matrixWorld.makeTranslation(-G.x,-G.y,-G.z).premultiply(S),P.matrixWorld.elements[12]+=T.x,P.matrixWorld.elements[13]+=T.y,P.matrixWorld.elements[14]+=T.z}return v(),{update:v,helpers:p.map(P=>P.bone.name)}}function Vu(i,e){let t=null;return i.traverse(n=>{!t&&n.isBone&&n.name===e&&(t=n)}),t}function fv(i,e){const[t,,,n]=e,r=i.geometry,s=r.getAttribute("position"),o=r.getAttribute("skinIndex"),a=r.getAttribute("skinWeight");if(!s||!o||!a)return;const c=new A;let l=!1;for(let h=0;h<s.count;h++){if(i.getVertexPosition(h,c).applyMatrix4(i.matrixWorld),c.y<Lr[0]-.02||c.y>Lr[1]+.05)continue;let u=0;const d=[];for(let x=0;x<4;x++){const _=o.getComponent(h,x),I=a.getComponent(h,x);I<=0||(_===t||_===n?u+=I:d.push([_,I]))}if(u<.02)continue;const p=uv(Nt.clamp((c.y-Lr[0])/(Lr[1]-Lr[0]),0,1))*3,g=Math.min(2,Math.floor(p)),b=p-g,m=[[e[g],u*(1-b)],[e[g+1],u*b]];d.sort((x,_)=>_[1]-x[1]);const f=[...m,...d].filter(x=>x[1]>1e-5).slice(0,4),M=f.reduce((x,_)=>x+_[1],0);for(let x=0;x<4;x++){const _=f[x];o.setComponent(h,x,_?_[0]:0),a.setComponent(h,x,_?_[1]/M:0)}l=!0}l&&(o.needsUpdate=!0,a.needsUpdate=!0)}const pv=9,mv=JSON.parse('[{"id":"flare-saved-09-rear","name":"后双撑 · 循环起点","phase":"rear","sourceStepId":"a998d382-0b7f-4ad3-b627-57f44e99561e","sourceStepNumber":9,"sourceStepName":"前双撑 · 开腿起点","sourcePreset":"flare-front-open","mirrored":true,"pose":{"version":1,"pelvis":[-0.029999999999999943,0.7875411999117483,-0.25],"bodyQuaternion":[0.8985343740226003,-0.007470351912587276,0.0006445605531121277,0.43883910158942024],"limbs":{"left":{"wrist":[0.215,0.03115682210638071,-8.326672684688674e-17],"elbowPole":[0.3679072,0.43590140665760185,0.17715781234977546],"ankle":[0.49486288804898193,0.40686809373231875,-0.7652272856350576],"kneePole":[0.2702140644338731,0.37378315689696334,-0.7127973660353976],"handQuaternion":[-0.014115609697670064,0.00967441866320057,-0.030224304035934627,0.9993966412951045],"footQuaternion":[0.501149601194387,-0.3339169438195634,0.18899898676280638,0.7756467848547703],"handLocked":true},"right":{"wrist":[-0.215,0.03113663464124783,0.1],"elbowPole":[-0.3679072,0.43590147865439804,0.17715799894147222],"ankle":[-0.5742504279789087,0.432309189823983,-0.7595179492198025],"kneePole":[-0.3509231115663002,0.38906846675917944,-0.7088646859581507],"handQuaternion":[-0.014115609697670064,-0.00967441866320057,0.030224304035934627,0.9993966412951045],"footQuaternion":[0.5058360746426133,0.3280672253476286,-0.2086002061921243,0.7700569558282452],"handLocked":true}},"groundLock":true,"pelvisQuaternion":[0.8986774439285762,-0.009315986729886845,-0.006751183447908846,0.4384592178154111]}},{"id":"flare-saved-10-left-transfer","name":"左侧移重 · 单手接重","phase":"sideA","sourceStepId":"6c5f9dec-c1bd-4f56-a3d8-81c75be93c7c","sourceStepNumber":10,"sourceStepName":"移重到右手 · 抬起左手","sourcePreset":null,"mirrored":false,"pose":{"version":1,"pelvis":[0.07007888106107946,0.7720626104730002,-0.23144189371099202],"bodyQuaternion":[0.6884117264809348,0.11040177881154879,0.4256823395806238,0.5767974409166106],"limbs":{"left":{"wrist":[0.25010189652088743,0.40476689807122906,0.4254073596363691],"elbowPole":[0.1979829028589189,0.6468147145769494,0.1695743416386411],"handQuaternion":[0.17350982369554666,-0.20884585815279677,-0.42524718689772656,0.8633901659441879],"ankle":[0.7926862748388714,1.1193371825281488,0.02680001526901879],"kneePole":[0.3616283684785114,1.2603983791051436,-0.14519721305129968],"footQuaternion":[0.37605521460570385,-0.4806383614070052,0.6894911510529526,0.3900912633365708],"handLocked":false},"right":{"wrist":[-0.21500000000000002,0.031189341132898618,0.1],"elbowPole":[-0.13184425020229218,0.3478909272549951,0.25290060337913167],"handQuaternion":[-0.014115609697670064,-0.00967441866320057,0.030224304035934627,0.9993966412951045],"ankle":[0.6018922580190487,0.2699931936992248,-0.5084342844878578],"kneePole":[0.4912872602276406,0.7407256279319921,-0.4700971459634683],"footQuaternion":[0.24650126182492982,-0.11415961691961395,0.3855988737729689,0.8817699350332276],"handLocked":true}},"groundLock":true,"pelvisQuaternion":[0.6884117264809348,0.11040177881154879,0.4256823395806238,0.5767974409166106]}},{"id":"flare-saved-11-left-support","name":"左侧单撑 · 高 V 开腿","phase":"sideA","sourceStepId":"24e0a3ba-d63d-486a-97f7-36f3100d28ef","sourceStepNumber":11,"sourceStepName":"右手单撑 · 高 V 开腿","sourcePreset":"flare-right-high-v","mirrored":false,"pose":{"version":1,"pelvis":[0.1903361328182514,0.7545844330974216,0.10069056676801744],"bodyQuaternion":[0.01190128902092805,0.009840940988734014,0.7461237406115414,0.6656281836700862],"limbs":{"left":{"wrist":[-0.08205568785866227,1.3192134842986976,0.05783298066135038],"elbowPole":[-0.1038368832172161,0.9652514281805494,0.25907342447150283],"handQuaternion":[-0.010637571712003226,0.15332075029523548,0.4980305488275511,0.8534314044089931],"ankle":[0.25070478047876693,1.5148527459255963,0.4509019187873464],"kneePole":[0.22270561091053936,1.318234604989236,0.008352961581929969],"footQuaternion":[-0.24504767067701202,-0.33643014189620246,0.9073613842252461,0.05883635896549819],"handLocked":false},"right":{"wrist":[-0.21500000000000002,0.031337200862919246,0.1],"elbowPole":[-0.3593795877380631,0.3556281924676706,0.21969045833840206],"handQuaternion":[-0.014115609697670064,-0.00967441866320057,0.030224304035934627,0.9993966412951045],"ankle":[0.5643167000574032,0.37000000000000005,0.7146731056126405],"kneePole":[0.46092973263258913,0.7987466594162334,0.5127333537768439],"footQuaternion":[-0.294194493164645,-0.3609348053999786,0.4421438388133155,0.7666058258596149],"handLocked":true}},"groundLock":true,"pelvisQuaternion":[0.01190128902092805,0.009840940988734014,0.7461237406115414,0.6656281836700862]}},{"id":"flare-saved-12-left-pass","name":"左侧换腿 · 接回前撑","phase":"sideA","sourceStepId":"4d22469f-bb80-4518-99e4-b611d4244a78","sourceStepNumber":12,"sourceStepName":"前方换腿 · 左手回撑","sourcePreset":"flare-front-pass","mirrored":false,"pose":{"version":1,"pelvis":[0.08080120998552665,0.6717401391645048,0.3300759020463073],"bodyQuaternion":[-0.5030282219657664,-0.18419941941207668,0.5023756857913568,0.678713379947587],"limbs":{"left":{"wrist":[0.3263099404048406,0.5503030997171975,-0.16654118679356797],"elbowPole":[0.005709472502696794,1.1087823544715194,-0.2920629230395969],"handQuaternion":[0.004090732578487741,0.11367232674478131,-0.3504979993357032,0.9296305828129088],"ankle":[0.1696009324348301,1.4388597936380656,0.6536559379409476],"kneePole":[-0.07048148640053131,1.239113916217521,0.6289599578779773],"footQuaternion":[0.7676218038380517,0.16807131531128494,-0.6100891390991674,-0.10148912057549417],"handLocked":false},"right":{"wrist":[-0.215,0.03139534160318602,0.1],"elbowPole":[-0.4121819284405803,0.4148261451148529,0.029550607614414443],"handQuaternion":[-0.014115609697670064,-0.00967441866320057,0.030224304035934627,0.9993966412951045],"ankle":[-0.36438471561797037,0.5683410998145629,1.0138897008702232],"kneePole":[-0.15267899085524128,0.8835641507980668,0.7120497754184677],"footQuaternion":[0.6711110431488149,0.540964207129817,-0.1472897106548494,-0.48504993093838167],"handLocked":true}},"groundLock":true,"pelvisQuaternion":[-0.5030282219657664,-0.18419941941207668,0.5023756857913568,0.678713379947587]}},{"id":"flare-saved-13-front","name":"前双撑 · 中间过渡","phase":"front","sourceStepId":"474fe57e-894b-4bb7-937e-698993abf67e","sourceStepNumber":13,"sourceStepName":"后双撑 · 抬髋开腿","sourcePreset":"flare-rear-open","mirrored":false,"pose":{"version":1,"pelvis":[0.0005147625624336676,0.5976163930301621,0.4542566030631731],"bodyQuaternion":[-0.7564131631953535,0,0,0.6540941266704661],"limbs":{"left":{"wrist":[0.215,0.031494584452709806,6.938893903907228e-18],"elbowPole":[0.3679072,0.6431900159999999,0.007709588000000031],"handQuaternion":[-0.014115609697670064,0.00967441866320057,-0.030224304035934627,0.9993966412951045],"ankle":[0.5921656864634581,1.1333667707622546,0.6929969677947478],"kneePole":[0.3371117184305408,1.1635426234507742,0.5542034891857168],"footQuaternion":[0.9019193641710003,-0.295289058482176,-0.27258807678697555,-0.15824529335075616],"handLocked":true},"right":{"wrist":[-0.215,0.03151863562964291,0.1],"elbowPole":[-0.3679072,0.64318996,0.00770977999999993],"handQuaternion":[-0.014115609697670064,-0.00967441866320057,0.030224304035934627,0.9993966412951045],"ankle":[-0.5911361626057233,1.1333667720871636,0.6929969682691859],"kneePole":[-0.33608219457280597,1.1635426247756833,0.5542034896601549],"footQuaternion":[0.9019193648820122,0.2952890574650434,0.2725880759374532,-0.1582452926596914],"handLocked":true}},"groundLock":true,"pelvisQuaternion":[-0.7564131631953535,0,0,0.6540941266704661]}},{"id":"flare-saved-14-right-pass","name":"右侧换腿 · 前撑转移","phase":"sideB","sourceStepId":"mirror-20261005-12-4d22469f-bb80-4518-99e4-b611d4244a78","sourceStepNumber":14,"sourceStepName":"右侧换腿 · 第12步镜像","sourcePreset":null,"mirrored":true,"pose":{"version":1,"pelvis":[-0.08080120998552665,0.6717401391645048,0.23007590204630735],"bodyQuaternion":[-0.5030282219657664,0.18419941941207668,-0.5023756857913568,0.678713379947587],"limbs":{"left":{"wrist":[0.215,0.03139534160318602,-5.551115123125783e-17],"elbowPole":[0.4121819284405803,0.4148261451148529,-0.07044939238558556],"ankle":[0.19113649346039305,0.5683410998145629,1.0047228478250085],"kneePole":[0.06328556334187835,0.8835641507980668,0.6589182871814792],"handQuaternion":[-0.014115609697670064,0.00967441866320057,-0.030224304035934627,0.9993966412951045],"footQuaternion":[-0.6457449068778082,0.4762301827326176,-0.23414204743752473,0.5489952913437353],"handLocked":true},"right":{"wrist":[-0.3263099404048406,0.5503030997171975,-0.266541186793568],"elbowPole":[-0.005709472502696794,1.1087823544715194,-0.39206292303959694],"ankle":[-0.1696009324348301,1.4388597936380654,0.5536559379409474],"kneePole":[0.07048148640053131,1.2391139162175209,0.5289599578779771],"handQuaternion":[0.004090662857153402,-0.11367252035892912,0.35049805429256764,0.9296305387248004],"footQuaternion":[0.7676218038380499,-0.1680713153112819,0.6100891390991705,-0.10148912057549579],"handLocked":false}},"groundLock":true,"pelvisQuaternion":[-0.5030282219657664,0.18419941941207668,-0.5023756857913568,0.678713379947587]}},{"id":"flare-saved-15-right-support","name":"右侧单撑 · 高 V 开腿","phase":"sideB","sourceStepId":"mirror-20261005-11-24e0a3ba-d63d-486a-97f7-36f3100d28ef","sourceStepNumber":15,"sourceStepName":"右侧单撑 · 第11步镜像","sourcePreset":null,"mirrored":true,"pose":{"version":1,"pelvis":[-0.1903361328182514,0.7545844330974216,0.0006905667680174282],"bodyQuaternion":[0.01190128902092805,-0.009840940988734014,-0.7461237406115414,0.6656281836700862],"limbs":{"left":{"wrist":[0.21500000000000002,0.031337200862919246,2.168404344971009e-19],"elbowPole":[0.3593795877380631,0.3556281924676706,0.11969045833840207],"ankle":[-0.7212292424837399,0.37000000000000005,0.5047556600532115],"kneePole":[-0.5667628569452158,0.7987466594162334,0.3385971088334001],"handQuaternion":[-0.014115609697670064,0.00967441866320057,-0.030224304035934627,0.9993966412951045],"footQuaternion":[-0.215261700594769,0.2785571897933545,-0.4875555274236323,0.7989730282995422],"handLocked":true},"right":{"wrist":[0.08205568785866227,1.3192134842986976,-0.04216701933864962],"elbowPole":[0.1038368832172161,0.9652514281805494,0.15907342447150283],"ankle":[-0.25070478047876693,1.5148527459255963,0.3509019187873464],"kneePole":[-0.22270561091053936,1.318234604989236,-0.09164703841807004],"handQuaternion":[-0.010637530420344477,-0.15332079687130243,-0.4980306961583427,0.8534313105794405],"footQuaternion":[0.24504767067701202,-0.33643014189620246,0.9073613842252461,-0.05883635896549819],"handLocked":false}},"groundLock":true,"pelvisQuaternion":[0.01190128902092805,-0.009840940988734014,-0.7461237406115414,0.6656281836700862]}},{"id":"flare-saved-16-right-transfer","name":"右侧移重 · 接回后撑","phase":"sideB","sourceStepId":"mirror-20261005-10-6c5f9dec-c1bd-4f56-a3d8-81c75be93c7c","sourceStepNumber":16,"sourceStepName":"右侧移重 · 第10步镜像","sourcePreset":null,"mirrored":true,"pose":{"version":1,"pelvis":[-0.07007888106107946,0.7720626104730002,-0.33144189371099203],"bodyQuaternion":[0.6884117264809348,-0.11040177881154879,-0.4256823395806238,0.5767974409166106],"limbs":{"left":{"wrist":[0.21500000000000002,0.031189341132898618,-1.1102230246251565e-16],"elbowPole":[0.13184425020229218,0.3478909272549951,0.15290060337913164],"ankle":[-0.2021544164567965,0.26999327318300526,-0.9891058341482438],"kneePole":[-0.16926419668416162,0.7407257330417467,-0.8767607806566532],"handQuaternion":[-0.014115609697670064,0.00967441866320057,-0.030224304035934627,0.9993966412951045],"footQuaternion":[0.4277125353770555,-0.18123110953002605,-0.18905342984813847,0.8651451165454856],"handLocked":true},"right":{"wrist":[-0.350382176937909,0.55,0.390798365196093],"elbowPole":[-0.1979829028589189,0.6468147145769494,0.06957434163864108],"ankle":[-0.7926863412523646,1.1193372104041521,-0.073199958231208],"kneePole":[-0.3616284348920045,1.260398406981147,-0.24519718655152647],"handQuaternion":[0.17351002724527126,0.20884616142195156,0.42524722271428583,0.8633900340393375],"footQuaternion":[-0.3760566309157787,-0.48063789237587945,0.6894914295083285,-0.39008998371056375],"handLocked":false}},"groundLock":true,"pelvisQuaternion":[0.6884117264809348,-0.11040177881154879,-0.4256823395806238,0.5767974409166106]}},{"id":"flare-saved-09-rear-repeat","name":"后双撑 · 接回起点","phase":"rear","sourceStepId":"a998d382-0b7f-4ad3-b627-57f44e99561e","sourceStepNumber":9,"sourceStepName":"前双撑 · 开腿起点","sourcePreset":"flare-front-open","mirrored":true,"pose":{"version":1,"pelvis":[-0.029999999999999943,0.7875411999117483,-0.25],"bodyQuaternion":[0.8985343740226003,-0.007470351912587276,0.0006445605531121277,0.43883910158942024],"limbs":{"left":{"wrist":[0.215,0.03115682210638071,-8.326672684688674e-17],"elbowPole":[0.3679072,0.43590140665760185,0.17715781234977546],"ankle":[0.49486288804898193,0.40686809373231875,-0.7652272856350576],"kneePole":[0.2702140644338731,0.37378315689696334,-0.7127973660353976],"handQuaternion":[-0.014115609697670064,0.00967441866320057,-0.030224304035934627,0.9993966412951045],"footQuaternion":[0.501149601194387,-0.3339169438195634,0.18899898676280638,0.7756467848547703],"handLocked":true},"right":{"wrist":[-0.215,0.03113663464124783,0.1],"elbowPole":[-0.3679072,0.43590147865439804,0.17715799894147222],"ankle":[-0.5742504279789087,0.432309189823983,-0.7595179492198025],"kneePole":[-0.3509231115663002,0.38906846675917944,-0.7088646859581507],"handQuaternion":[-0.014115609697670064,-0.00967441866320057,0.030224304035934627,0.9993966412951045],"footQuaternion":[0.5058360746426133,0.3280672253476286,-0.2086002061921243,0.7700569558282452],"handLocked":true}},"groundLock":true,"pelvisQuaternion":[0.8986774439285762,-0.009315986729886845,-0.006751183447908846,0.4384592178154111]}}]'),gv={period:pv,steps:mv},Cl=gv,bv=Math.PI*2,_v=new A(0,-1,0),xv=new A(0,0,1),Yo=["left","right"],$o=Nt.degToRad,Sc=i=>new A().fromArray(i);function Pl(i,e,t){return Math.max(i,e)+t*Math.log1p(Math.exp(-Math.abs(i-e)/t))}const vv=(i,e,t)=>-Pl(-i,-e,t);function Gu(i,e){const[t,n]=e==="left"?[.07,.42]:[.58,.93];if(i<=t||i>=n)return{locked:!0,lift:0,at:0};const r=(i-t)/(n-t);return{locked:!1,lift:64*r**3*(1-r)**3,at:r}}function yv({landmarks:i,groundHands:e,shoeOffsets:t,period:n=9}){if(!Number.isFinite(n)||n<=0)throw new Error("数学动画需要有效的循环时长。");const r=Object.fromEntries(Object.entries(i).map(([c,l])=>[c,Sc(l)])),s=Object.fromEntries(Yo.map(c=>{const l=r[c+"Hip"].distanceTo(r[c+"Knee"]),h=r[c+"Knee"].distanceTo(r[c+"Ankle"]);return[c,{shoulderOffset:r[c+"Shoulder"].clone().sub(r.pelvis),hipOffset:r[c+"Hip"].clone().sub(r.pelvis),armReach:r[c+"Shoulder"].distanceTo(r[c+"Elbow"])+r[c+"Elbow"].distanceTo(r[c+"Wrist"])-.003,legReach:Math.sqrt(l**2+h**2+2*l*h*Math.cos($o(8))),groundWrist:Sc(e[c].wrist),groundRotation:new qe().fromArray(e[c].handQuaternion),shoeCorners:t[c].map(Sc)}]}));function o(c){const l=((Number.isFinite(c)?c:0)%n+n)%n/n,h=l*bv,u=Math.sin(h),d=Math.cos(h),p=new qe(.15+.75*d,.1*Math.sin(2*h),.576*u,.71825-.1805*d-.09875*Math.cos(2*h)).normalize(),g=new A(.22*u,0,.06-.34*d),b={},m={},f={},M=[];for(const I of Yo){const R=I==="left"?1:-1,T=s[I],F=T.shoulderOffset.clone().applyQuaternion(p),S=F.clone().add(g),v=Gu(l,I),P=T.groundWrist.clone();P.x+=v.lift*(S.x+R*.3-P.x),P.z+=v.lift*(S.z+.1-P.z),P.y+=.72*v.lift;const Q=(S.x-P.x)**2+(S.z-P.z)**2;if(Q>=T.armReach**2)throw new Error("数学轨迹超出手臂的水平可达范围。");M.push(P.y-F.y+Math.sqrt(T.armReach**2-Q)),b[I]=S,m[I]=P,f[I]=v}g.y=vv(M[0],M[1],.012)-.003;const x=xv.clone().applyQuaternion(p),_={};for(const I of Yo){const R=I==="left"?1:-1,T=s[I],F=f[I],S=T.hipOffset.clone().applyQuaternion(p).add(g),v=b[I].clone();v.y+=g.y;const P=$o(48+R*36*u),Q=$o(50+25*d+30*Math.cos(2*h)),G=new A(R*Math.sin(P),-Math.cos(P)*Math.cos(Q),Math.cos(P)*Math.sin(Q)),ae=p.clone().multiply(new qe().setFromUnitVectors(_v,G)),oe=G.clone().applyQuaternion(p);let ne=-1/0;for(const ee of T.shoeCorners){const ue=-ee.clone().applyQuaternion(ae).y;ne=Number.isFinite(ne)?Pl(ne,ue,.002):ue}const he=(.006+.012+ne-S.y)/T.legReach,L=Pl(oe.y,he,.012);if(Math.abs(L)>=.9999)throw new Error("数学轨迹无法保持脚底和真实腿长。");const W=Math.hypot(oe.x,oe.z);oe.x*=Math.sqrt(1-L*L)/W,oe.z*=Math.sqrt(1-L*L)/W,oe.y=L;const q=S.clone().addScaledVector(oe,T.legReach),j=new qe().setFromAxisAngle(new A(1,0,0),$o(-30)*F.lift).multiply(T.groundRotation);_[I]={wrist:m[I].toArray(),elbowPole:v.clone().add(new A(R*.18,-.05,-.5)).toArray(),handQuaternion:j.toArray(),handLocked:F.locked,ankle:q.toArray(),kneePole:S.clone().addScaledVector(x,.5).toArray(),footQuaternion:ae.toArray()}}return{version:1,pelvis:g.toArray(),bodyQuaternion:p.toArray(),groundLock:!0,limbs:_}}function a(c){const l=((Number.isFinite(c)?c:0)%n+n)%n/n,h=Yo.filter(d=>Gu(l,d).locked),u=l<.07||l>=.93?"rear":l<.42?"right":l<=.58?"front":"left";return{phase:l,section:u,supportHands:h,period:n,kneeFlexionDegrees:8}}return{sample:o,describe:a,period:n}}const Mv=1e-12,Sv=new A(0,1,0),wv=new A(0,0,1),wc=2*Math.PI,$d=i=>((i+Math.PI)%wc+wc)%wc-Math.PI;function Zd(i,e){const t=e.clone().addScaledVector(i,-e.dot(i));return t.lengthSq()<Mv&&(t.copy(Math.abs(i.z)<.9?wv:Sv),t.addScaledVector(i,-t.dot(i))),t.normalize()}function Wu(i,e){const t=i.clone().normalize(),n=Zd(t,e),r=new A().crossVectors(n,t).normalize();return new qe().setFromRotationMatrix(new ot().makeBasis(t,r,n))}function Ec(i,e,t,n){return Wu(e,n).multiply(Wu(i,t).invert()).normalize()}function Ll(i,e,t){const n=i.clone().invert().multiply(e),r=t.clone().normalize();return $d(2*Math.atan2(n.x*r.x+n.y*r.y+n.z*r.z,n.w))}function Ev({sourceAxis:i,sourceNormal:e,startAxis:t,endAxis:n,currentAxis:r,startNormal:s,endNormal:o,currentNormal:a,startRotation:c,endRotation:l,blend:h}){const u=Ec(i,t,e,s),d=Ec(i,n,e,o),p=Ec(i,r,e,a),g=Ll(u,c,i),b=Ll(d,l,i),m=g+$d(b-g)*h;return p.multiply(new qe().setFromAxisAngle(i.clone().normalize(),m)).normalize()}function Av({sourceAxis:i,currentAxis:e,startRotation:t,endRotation:n,startReference:r,endReference:s,currentReference:o,blend:a}){const c=r.clone().invert().multiply(t),l=s.clone().invert().multiply(n),h=o.clone().multiply(c.slerp(l,a)),u=i.clone().normalize().applyQuaternion(h);return new qe().setFromUnitVectors(u,e.clone().normalize()).multiply(h).normalize()}function Tv(i,e,t,n){if(!n)return t.clone();const r=e.clone().sub(i).normalize(),s=t.clone().sub(i),o=s.dot(r),a=Zd(r,s).applyAxisAngle(r,n),c=Math.max(1e-4,s.clone().addScaledVector(r,-o).length());return i.clone().addScaledVector(r,o).addScaledVector(a,c)}const wt=["left","right"],Fi=new A(0,1,0),Ni=new A(0,0,1),Rv=new A(1,1,1),Un=new qe,gi=.006,ts=Nt.clamp,Yt=i=>new A().fromArray(i);function Zo(i,e){const t=i.clone().normalize(),n=e.clone().addScaledVector(t,-e.dot(t)).normalize(),r=new A().crossVectors(t,n).normalize();return new qe().setFromRotationMatrix(new ot().makeBasis(r,t,n))}function er(i,e,t=Un){const n=i.clone().normalize().applyQuaternion(t),r=e.clone().normalize();return new qe().setFromUnitVectors(n,r).multiply(t)}function qu(i,e,t,n){const r=(s,o)=>{const a=s.clone().normalize(),c=o.clone().normalize(),l=new A().crossVectors(c,a).normalize();return new qe().setFromRotationMatrix(new ot().makeBasis(a,l,c))};return r(e,n).multiply(r(i,t).invert()).normalize()}function Jo(i,e,t,n,r){const s=e.clone().sub(i),o=ts(s.length(),Math.abs(t-n)+1e-7,t+n-1e-7),a=s.lengthSq()>1e-12?s.normalize():Fi.clone().negate(),c=(t*t-n*n+o*o)/(2*o),l=Math.sqrt(Math.max(0,t*t-c*c)),h=r.clone().sub(i);return h.addScaledVector(a,-h.dot(a)),h.lengthSq()<1e-10&&(h.copy(Math.abs(a.z)<.9?Ni:Fi),h.addScaledVector(a,-h.dot(a))),h.normalize(),{middle:i.clone().addScaledVector(a,c).addScaledVector(h,l),end:i.clone().addScaledVector(a,o)}}function Ac(i,e,t){if(i.isEmpty())return;const n=new A;for(let r=0;r<8;r++)n.set(r&1?i.max.x:i.min.x,r&2?i.max.y:i.min.y,r&4?i.max.z:i.min.z),t.expandByPoint(n.applyMatrix4(e))}function sr(i,e,t){if(!Array.isArray(i)||i.length!==e||Array.from(i).some(n=>typeof n!="number"||!Number.isFinite(n)))throw new Error(`${t}必须包含 ${e} 个有限数值。`);if(i.some(n=>Math.abs(n)>1e4))throw new Error(`${t}超出可编辑范围。`);return[...i]}function ns(i,e){const t=sr(i,4,e),n=Math.hypot(...t);if(n<1e-12)throw new Error(`${e}不能是零四元数。`);return new qe().fromArray(t.map(r=>r/n))}function Tc(i){if(!i||typeof i!="object"||i.version!==1)throw new Error("姿势文件版本无效，请使用版本 1 的姿势。");if(typeof i.groundLock!="boolean")throw new Error("姿势的地面锁定必须为 true 或 false。");const e={pelvis:Yt(sr(i.pelvis,3,"骨盆位置")),bodyQuaternion:ns(i.bodyQuaternion,"躯干方向"),groundLock:i.groundLock,limbs:{}};Object.hasOwn(i,"torsoQuaternion")&&(e.torsoQuaternion=ns(i.torsoQuaternion,"腰部方向")),Object.hasOwn(i,"pelvisQuaternion")&&(e.pelvisQuaternion=ns(i.pelvisQuaternion,"髋部方向"));for(const t of wt){const n=i.limbs?.[t],r=t==="left"?"左侧":"右侧";if(!n||typeof n.handLocked!="boolean")throw new Error(`${r}手掌锁定必须为 true 或 false。`);e.limbs[t]={wrist:Yt(sr(n.wrist,3,`${r}手腕位置`)),elbowPole:Yt(sr(n.elbowPole,3,`${r}肘部弯曲方向`)),handQuaternion:ns(n.handQuaternion,`${r}手掌方向`),ankle:Yt(sr(n.ankle,3,`${r}脚踝位置`)),kneePole:Yt(sr(n.kneePole,3,`${r}膝部弯曲方向`)),footQuaternion:ns(n.footQuaternion,`${r}脚掌方向`),handLocked:n.handLocked};for(const s of["elbowTwist","kneeTwist","upperArmTwist","thighTwist"])if(Object.hasOwn(n,s)){if(typeof n[s]!="number"||!Number.isFinite(n[s]))throw new Error(`${r}关节扭转需要有限角度。`);e.limbs[t][s]=n[s]}}return e}function Cv({model:i,rigData:e}){if(!i?.isObject3D)throw new Error("Snow motion requires a loaded model.");if(!e?.landmarks)throw new Error("Snow motion requires the accompanying coach-rig.json.");i.updateWorldMatrix(!0,!1),i.updateMatrixWorld(!0);const t=i.matrixWorld.clone().invert(),n=i.getWorldQuaternion(new qe).invert(),r=new Map,s=[],o=new Set;let a=null;i.traverse(E=>{E.isBone&&r.set(E.name,E),E.isSkinnedMesh&&(s.push(E),o.add(E.skeleton),E.frustumCulled=!1)}),typeof location<"u"&&new URLSearchParams(location.search).get("spine")==="off"||(a=dv({model:i,meshes:s,skeletons:o,landmarks:e.landmarks}));const c=new Map;for(const{name:E}of e.bones??[]){const D=r.get(E);if(!D)throw new Error(`Snow is missing its ${E} bone.`);if(D.parent?.isBone)throw new Error("Snow motion expects parallel deform bones under the armature.");c.set(E,{bone:D,rest:D.getWorldPosition(new A).applyMatrix4(t),restRotation:n.clone().multiply(D.getWorldQuaternion(new qe)),scale:D.scale.clone(),bounds:new an,target:new A,rotation:new qe,matrix:new ot})}if(c.size!==20||!s.length)throw new Error("Snow requires its 20 original deform bones and skinned meshes.");const l=Object.fromEntries(Object.entries(e.landmarks).map(([E,D])=>[E,Yt(D)])),h={left:[],right:[]},u={left:[],right:[]},d={left:new an,right:new an};let p=0;for(const E of o)E.update();const g=new A;for(const E of s){const D=/^Coach_(Sneakers|Soles|Shoe_Details)(?:_|$)/.test(E.name),B=E.geometry.getAttribute("position"),U=E.geometry.getAttribute("skinIndex"),V=E.geometry.getAttribute("skinWeight");if(!(!B||!U||!V)){p+=B.count;for(let H=0;H<B.count;H++){E.getVertexPosition(H,g).applyMatrix4(E.matrixWorld).applyMatrix4(t);for(let Y=0;Y<4;Y++){const $=V.getComponent(H,Y);if($<=1e-7)continue;const J=E.skeleton.bones[U.getComponent(H,Y)]?.name,K=J==="spineLower"||J==="spineUpper"?"torso":J;c.get(K)?.bounds.expandByPoint(g);for(const ce of wt)K===ce+"Hand"&&$>.7&&(h[ce].push(g.clone()),u[ce].push({mesh:E,index:H})),D&&K===ce+"Foot"&&d[ce].expandByPoint(g)}}}}const b={};for(const E of wt){const D=E==="left"?1:-1,B=new A(D*.98253144,.05483374,.17783482).normalize(),U=new A(D*.06068526,-.99777448,-.02762938);U.addScaledVector(B,-U.dot(B)).normalize();const V=Zo(B,U);let H=-1/0,Y=.16;for(const se of h[E]){const pe=se.clone().sub(l[E+"Wrist"]);H=Math.max(H,pe.dot(U)),Y=Math.max(Y,pe.dot(B))}Number.isFinite(H)||(H=.025);const $=B.clone().multiplyScalar(ts(Y*.3,.04,.075)).addScaledVector(U,H),J=new A(D*.08,-.994,.08).normalize(),K=new A(-D*.92,0,.38),ce=Zo(J,K).multiply(V.clone().invert());b[E]={upperArm:l[E+"Shoulder"].distanceTo(l[E+"Elbow"]),forearm:l[E+"Elbow"].distanceTo(l[E+"Wrist"]),thigh:l[E+"Hip"].distanceTo(l[E+"Knee"]),shin:l[E+"Knee"].distanceTo(l[E+"Ankle"]),armNormal:l[E+"Elbow"].clone().sub(l[E+"Shoulder"]).cross(l[E+"Wrist"].clone().sub(l[E+"Elbow"])),legNormal:l[E+"Knee"].clone().sub(l[E+"Hip"]).cross(l[E+"Ankle"].clone().sub(l[E+"Knee"])),anchor:new A(D*.215,gi,0),playAnchor:new A(D*.215,gi,0),palmOffset:$,neutralRotation:ce,support:!1,flight:0}}const m=new qe,f=new qe,M=new qe,x=l.pelvis.clone().lerp(l.torso,.3);let _=!1,I=!1;const R=new A(1,0,0),T=Fi.clone(),F=Ni.clone(),S=l.pelvis.clone(),v={},P=new qe,Q=new Map,G=new an,ae=new an;let oe=0,ne=Math.PI,he="standing",L="skin",W=null,q=!0,j=null,ee=gi;const ue=new Map,X=new WeakMap;let re="arc",xe="smooth",me=[],Te=[],ke=[],He=[],Ze="saved",Ce=null,rt=!1,N=yc(Cl.steps,{period:Cl.period,mapTransition:ie,resolveFootEndpoint:at}),Ft=!0,pt=[];const ct=E=>E.clone().sub(l.pelvis).applyQuaternion(m).add(S),Ne=E=>E.pelvisQuaternion??E.bodyQuaternion,Ut=E=>!E||E.x*E.x+E.y*E.y+E.z*E.z<1e-24,it=()=>Ut(M)?m.clone():m.clone().multiply(M);function C(E,D,B){return Ut(B)?E.clone().sub(l.pelvis).applyQuaternion(D):x.clone().sub(l.pelvis).applyQuaternion(D).add(E.clone().sub(x).applyQuaternion(D.clone().multiply(B)))}const y=E=>C(E,m,M).add(S);function Z(E,D,B){const U=E.clone().invert().multiply(D),V=B.clone().normalize(),H=U.x*V.x+U.y*V.y+U.z*V.z;return((2*Math.atan2(H,U.w)+Math.PI)%(Math.PI*2)+Math.PI*2)%(Math.PI*2)-Math.PI}function ge(){i.updateWorldMatrix(!0,!1),i.updateMatrixWorld(!0),i.getWorldQuaternion(P),Q.clear();for(const{bone:E}of c.values())Q.has(E.parent)||Q.set(E.parent,{inverse:E.parent.matrixWorld.clone().invert(),inverseRotation:E.parent.getWorldQuaternion(new qe).invert()})}function be(E,D,B){const U=c.get(E),V=Q.get(U.bone.parent);U.target.copy(D),U.rotation.copy(B),U.bone.position.copy(D).applyMatrix4(i.matrixWorld).applyMatrix4(V.inverse),U.bone.quaternion.copy(V.inverseRotation).multiply(P).multiply(B).multiply(U.restRotation),U.bone.scale.copy(U.scale),U.bone.updateMatrix(),U.matrix.compose(D,B,Rv).multiply(new ot().makeTranslation(-U.rest.x,-U.rest.y,-U.rest.z))}function fe(){i.updateMatrixWorld(!0),a?.update();for(const E of o)E.update();ee=Math.min(Je("left"),Je("right")),q=!0}function Je(E){return ae.makeEmpty(),Ac(d[E],c.get(E+"Foot").matrix,ae),ae.isEmpty()?v[E].ankle.y-l[E+"Ankle"].y:ae.min.y}function Le(){be("pelvis",ct(l.pelvis),f);const E=it();for(const D of["torso","neck","head"])be(D,y(l[D]),E)}function Be(E,D,B,U,V,H){const Y=it(),$=U.clone().sub(B).cross(V.clone().sub(U)),J=(Me,ye)=>rt?qu(Me,ye,b[E].armNormal,$):er(Me,ye,Y),K=l[E+"Elbow"].clone().sub(l[E+"Shoulder"]),ce=J(K,U.clone().sub(B));D.upperArmTwist&&ce.multiply(new qe().setFromAxisAngle(K.normalize(),D.upperArmTwist));const se=l[E+"Wrist"].clone().sub(l[E+"Elbow"]),pe=J(se,V.clone().sub(U));D.elbowTwist&&pe.multiply(new qe().setFromAxisAngle(se.normalize(),D.elbowTwist)),be(E+"Scapula",B,Y),be(E+"UpperArm",B,ce),be(E+"Forearm",U,pe),be(E+"Hand",V,H),Object.assign(D,{shoulder:B,elbow:U,wrist:V,palm:b[E].palmOffset.clone().applyQuaternion(H).add(V)})}function Rt(E,D,B,U,V,H){const Y=U.clone().sub(B).cross(V.clone().sub(U)),$=(pe,Me)=>rt?qu(pe,Me,b[E].legNormal,Y):er(pe,Me,f),J=l[E+"Knee"].clone().sub(l[E+"Hip"]),K=$(J,U.clone().sub(B));D.thighTwist&&K.multiply(new qe().setFromAxisAngle(J.normalize(),D.thighTwist));const ce=l[E+"Ankle"].clone().sub(l[E+"Knee"]),se=$(ce,V.clone().sub(U));D.kneeTwist&&se.multiply(new qe().setFromAxisAngle(ce.normalize(),D.kneeTwist)),be(E+"Thigh",B,K),be(E+"Patella",U,K.clone().slerp(se,.52)),be(E+"Shin",U,se),be(E+"Foot",V,H),Object.assign(D,{hip:B,knee:U,ankle:V}),D.toe=new A(0,0,.18).applyQuaternion(H).add(V)}function Se(){he="standing",rt=!1,Ft=!0,pt=[],oe=0,ne=Math.PI,m.identity(),f.identity(),I=!1,M.identity(),_=!1,R.set(1,0,0),T.copy(Fi),F.copy(Ni);const E=Math.min(...wt.map(D=>d[D].isEmpty()?0:d[D].min.y));S.copy(l.pelvis).addScaledVector(Fi,gi-E),ge(),Le();for(const D of wt){const B=b[D],U=D==="left"?1:-1;B.support=!1,B.flight=0,B.anchor.copy(B.playAnchor);const V=v[D]={},H=ct(l[D+"Shoulder"]),Y=H.clone().addScaledVector(new A(U*.18,-.978,.06).normalize(),B.upperArm),$=Y.clone().addScaledVector(new A(U*.08,-.994,.08).normalize(),B.forearm);Be(D,V,H,Y,$,B.neutralRotation),Rt(D,V,ct(l[D+"Hip"]),ct(l[D+"Knee"]),ct(l[D+"Ankle"]),Un)}return fe(),j=hh(),i}function ze(E=0){const D=((Number.isFinite(E)?E:0)%N.period+N.period)%N.period,B=!Ce&&ti();return Hn(Ce?Ce.sample(D):B?te(D):N.sample(D),{alignBendPlanes:!!Ce,bodyOffset:B?U=>fi(D,U):0}),he="flare",oe=D,i}function et(E){const D=JSON.stringify(E);return ue.has(D)||(ue.size>=256&&ue.clear(),ue.set(D,Oe(E))),ue.get(D)}function at(E,D){return et(E).solved[D].leg.end.toArray()}const Ve=typeof location<"u"&&new URLSearchParams(location.search).get("hip")==="linear",Mt=(E,D)=>E.pelvis.every((B,U)=>Math.abs(B-D.pelvis[U])<1e-9)&&E.bodyQuaternion.every((B,U)=>Math.abs(B-D.bodyQuaternion[U])<1e-9);function bt(E,D,B,U,V){const H=N?.steps;if(Ve||!H||H.length<4||!Mt(H[0].pose,H[H.length-1].pose))return null;const Y=H.length-1,$=H.findIndex(je=>Mt(je.pose,E));if($<0||!Mt(H[($+1)%H.length].pose,D))return null;const J=et(H[($-1+Y)%Y].pose).constrainedPelvis,K=et(H[($+2)%Y].pose).constrainedPelvis,ce=B.constrainedPelvis,se=U.constrainedPelvis,pe=V,Me=pe*pe,ye=Me*pe;return new A(0,0,0).addScaledVector(J,-.5*ye+Me-.5*pe).addScaledVector(ce,1.5*ye-2.5*Me+1).addScaledVector(se,-1.5*ye+2*Me+.5*pe).addScaledVector(K,.5*ye-.5*Me)}const Lt=gi+.06,O=gi+.12,De=.9985,le=.99993;function _e(E,D){for(const B of wt){const U=E.limbs[B],V=b[B];if(U.handLocked||U.wrist.y<=Lt)continue;const H=Nt.smoothstep(U.wrist.y,Lt,O),Y=C(l[B+"Shoulder"],E.bodyQuaternion,E.torsoQuaternion).add(D),$=(V.upperArm+V.forearm)*De,J=U.wrist.clone().sub(Y);if(J.length()<1e-6||J.length()>=$)continue;const K=Y.clone().addScaledVector(J.normalize(),$),ce=gi+.03;if(K.y<ce){const se=Y.y-ce,pe=new A(J.x,0,J.z);se<$&&pe.lengthSq()>1e-8?K.copy(Y).addScaledVector(pe.normalize(),Math.sqrt($*$-se*se)).setY(ce):K.y=ce}U.wrist.lerp(K,H)}}const Fe=new WeakMap,Ie=new WeakMap;let ft=null;function $t(E,D,B,U=null){ft=U;try{return fn(E,D,B)}finally{ft=null}}function fn(E,D,B){if(!B?.size)return Dt(E,D);const U=[...B.keys()].map(H=>[H,E.limbs[H].wrist.clone(),E.limbs[H].handLocked]);for(const[H,Y]of B)E.limbs[H].wrist.copy(Y),E.limbs[H].handLocked=!0;const V=Dt(E,D);for(const[H,Y,$]of U)E.limbs[H].wrist.copy(Y),E.limbs[H].handLocked=$;return V}function Dt(E,D){let B=0;const U=[];for(const V of wt){const H=E.limbs[V].wrist,Y=b[V],$=Y.upperArm+Y.forearm-2e-5,J=$*le,ce=C(l[V+"Shoulder"],E.bodyQuaternion,E.torsoQuaternion).add(D).clone().sub(H),se=Math.hypot(ce.x,ce.z),pe=E.limbs[V].handLocked?1:Dn?1-Nt.smoothstep(H.y,Lt,O+.05):ft?.[V]??0;pe>0&&U.push([pe,se<$?Math.sqrt($*$-se*se)-ce.y:0]);const Me=Nt.clamp((O-H.y)/(O-Lt),0,1);Me<=0||ce.length()>=J||se>=J||(B=Math.max(B,Me*(Math.sqrt(J*J-se*se)-ce.y)))}for(const[V,H]of U)B=Math.min(B,B+V*(Math.min(B,H)-B));return Math.max(0,B)}const Dn=typeof location<"u"&&new URLSearchParams(location.search).get("smooth")==="0"||globalThis.__COACH_SMOOTH_OFF===!0,Xn=E=>{const D=E*E,B=D*E;return[2*B-3*D+1,B-2*D+E,-2*B+3*D,B-D]};function Bn(E,D,B,U,V,H=!1,Y=!1){const[$,J,K,ce]=Xn(V),se=H?new A:B.clone().sub(E).multiplyScalar(.5),pe=Y?new A:U.clone().sub(D).multiplyScalar(.5);return D.clone().multiplyScalar($).addScaledVector(se,J).addScaledVector(B,K).addScaledVector(pe,ce)}function mr(E,D,B,U,V,H=!1,Y=!1){const $=nt=>new mt().fromArray(nt),J=$(D),K=$(B),ce=$(E),se=$(U);K.dot(J)<0&&K.negate(),ce.dot(J)<0&&ce.negate(),se.dot(K)<0&&se.negate();const[pe,Me,ye,je]=Xn(V),Ae=H?new mt:K.clone().sub(ce).multiplyScalar(.5),Ke=Y?new mt:se.clone().sub(J).multiplyScalar(.5);return J.clone().multiplyScalar(pe).add(Ae.multiplyScalar(Me)).add(K.clone().multiplyScalar(ye)).add(Ke.multiplyScalar(je)).normalize().toArray()}function ti(){const E=N?.steps;return!Dn&&!Ce&&E&&E.length>=5&&!me.length&&!Te.length&&!ke.length&&!He.length&&Mt(E[0].pose,E[E.length-1].pose)}const Us=.12,po=!0,mo=.03,ji=[.003,.03],ni={right:.7},Or=.85,go=.3,bo=.6,Da=0,Ia=.75,Na=1.8,w=.55;function k(E,D){let B=1/0;const U=l[E+"Wrist"];for(let V=0;V<h[E].length;V+=3)B=Math.min(B,h[E][V].clone().sub(U).applyQuaternion(D).y);return Number.isFinite(B)?B:-.035}function te(E){const D=N.steps,B=D.length-1,U=N.period/(B+1),V=(E%N.period+N.period)%N.period,H=V<=(B-1)*U?V/U:B-1+(V-(B-1)*U)/(2*U),Y=Math.min(B-1,Math.floor(H)),$=H-Y;let J=$;const K=de=>D[(de%B+B)%B].pose,ce=K(Y-1),se=K(Y),pe=K(Y+1),Me=K(Y+2),ye=structuredClone(se),je=de=>mr(ce[de]??ce.bodyQuaternion,se[de]??se.bodyQuaternion,pe[de]??pe.bodyQuaternion,Me[de]??Me.bodyQuaternion,J);ye.bodyQuaternion=je("bodyQuaternion"),(se.pelvisQuaternion||pe.pelvisQuaternion)&&(ye.pelvisQuaternion=je("pelvisQuaternion")),(se.torsoQuaternion||pe.torsoQuaternion)&&(ye.torsoQuaternion=mr(...[ce,se,pe,Me].map(de=>de.torsoQuaternion??[0,0,0,1]),J));const Ae=[ce,se,pe,Me].map(et);ye.pelvis=Bn(...Ae.map(de=>de.constrainedPelvis),J).toArray();const Ke={},tt={},nt=new Map,ve={};for(const de of wt){const Re=[ce,se,pe,Me].map(At=>At.limbs[de]),Ge=ye.limbs[de];let Wt=Re,Bt=Ae,Jt=$,nn=Re[1].handLocked,rn=Re[2].handLocked;const zt=ni[de]||0,St=At=>(At%B+B)%B===B-1?2:1;if(zt&&rn&&!nn)Jt=$*St(Y)/(St(Y)+zt),tt[de]={nodes:Bt,t:Jt,mix:0};else if(zt&&nn&&!Re[0].handLocked&&$<zt){const At=[K(Y-2),K(Y-1),K(Y),K(Y+1)];Wt=At.map(bn=>bn.limbs[de]),Bt=At.map(et),Jt=(St(Y-1)+$)/(St(Y-1)+zt),nn=!1,rn=!0,tt[de]={nodes:Bt,t:Jt,mix:Nt.smootherstep($,0,zt)},nt.set(de,Bt[2].solved[de].arm.end.clone())}if(Ge.handLocked=nn&&rn,Re[1].handLocked&&!Re[2].handLocked&&(ve[de]=1-Nt.smoothstep($,0,Us)),Ge.handQuaternion=mr(...Wt.map(At=>At.handQuaternion),Jt,nn,rn),rn&&!nn){const At=Nt.smoothstep(Jt,Da,zt?w:Ia);At>0&&(Ge.handQuaternion=new qe().fromArray(Ge.handQuaternion).slerp(new qe().fromArray(Wt[2].handQuaternion),At).toArray())}if(Ge.footQuaternion=mr(...Re.map(At=>At.footQuaternion),$),Ge.wrist=Bn(...Bt.map(At=>At.solved[de].arm.end),Jt,nn,rn).toArray(),!Ge.handLocked){const At=mn=>mn.requested.bodyQuaternion.clone().multiply(mn.requested.torsoQuaternion??Un),bn=Bt.map(mn=>mn.solved[de].arm.end.clone().sub(mn.solved[de].shoulder).applyQuaternion(At(mn).invert())),Ei=Math.max(Bn(...bn.map(mn=>new A(mn.length(),0,0)),Jt).x,b[de].upperArm+b[de].forearm+.001),Vn=new qe().fromArray(ye.bodyQuaternion).multiply(ye.torsoQuaternion?new qe().fromArray(ye.torsoQuaternion):Un.clone()),En=C(l[de+"Shoulder"],new qe().fromArray(ye.bodyQuaternion),ye.torsoQuaternion?new qe().fromArray(ye.torsoQuaternion):void 0).add(new A().fromArray(ye.pelvis)),qt=Bn(...bn,Jt).setLength(Ei).applyQuaternion(Vn),Qn=En.clone().add(qt),Kn=new A().fromArray(Ge.wrist),pi=Nt.smoothstep(Math.min(Kn.y,Qn.y),Lt,O+.1);if(Ge.wrist=Kn.clone().lerp(Qn,pi).toArray(),Ke[de]={local:qt,world:Kn,w:pi,shoulderS:En,t:Jt},rn){const mn=new qe().fromArray(Wt[2].handQuaternion);Ke[de].approach=!0,Ke[de].plantWrist=Bt[2].solved[de].arm.end.clone(),Ke[de].startWrist=Bt[1].solved[de].arm.end.clone(),Ke[de].plantLow=Bt[2].solved[de].arm.end.y+k(de,mn),Ke[de].startLow=Bt[1].solved[de].arm.end.y+k(de,new qe().fromArray(Wt[1].handQuaternion))}}Ge.elbowPole=Bn(...Wt.map(At=>new A().fromArray(At.elbowPole)),Jt).toArray(),Ge.kneePole=Bn(...Re.map(At=>new A().fromArray(At.kneePole)),$).toArray()}J=$;const Xe=Tc(ye),lt=pn(Xe),Gt=$t(Xe,lt,nt,ve);Gt>0&&(lt.y+=Gt,Xe.pelvis.y+=Gt),ye.pelvis=lt.toArray();for(const de of wt){const Re=Ke[de];if(!Re)continue;const Ge=C(l[de+"Shoulder"],Xe.bodyQuaternion,Xe.torsoQuaternion).add(lt),Wt=Ge.clone().add(Re.local);if(ye.limbs[de].wrist=Re.world.clone().lerp(Wt,Re.w).toArray(),Re.approach){{const zt=new A().fromArray(ye.limbs[de].wrist),St=Nt.lerp(b[de].upperArm+b[de].forearm+.001,(ni[de]?Re.plantWrist:zt).distanceTo(Ge),Nt.smootherstep(Re.t,ni[de]?.85:.6,1)),At=1-bo*Nt.smootherstep(Re.t,0,1),bn=Re.plantWrist.clone().add(new A(zt.x-Re.plantWrist.x,0,zt.z-Re.plantWrist.z).multiplyScalar(At)),Ei=(bn.x-Ge.x)**2+(bn.z-Ge.z)**2;if(Ei<St*St&&(ye.limbs[de].wrist=bn.setY(Ge.y-Math.sqrt(St*St-Ei)).toArray()),ni[de]){const Vn=new A().fromArray(ye.limbs[de].wrist),En=Re.plantWrist,qt=Re.startWrist,Qn=Nt.clamp(Re.t/Or,0,1),Kn=(1-Qn)**3*(1+3*Qn),pi=Nt.smoothstep(Re.t,0,go);let mn=Nt.lerp(Vn.x,En.x+(qt.x-En.x)*Kn,pi),_r=Nt.lerp(Vn.z,En.z+(qt.z-En.z)*Kn,pi),Ai=(mn-Ge.x)**2+(_r-Ge.z)**2,Oa=Ai<St*St?Ge.y-Math.sqrt(St*St-Ai):Ge.y;const ka=ji?1-Nt.smoothstep(Nt.lerp(Vn.y,Oa,pi)-En.y,ji[0],ji[1]):0;if(ka>0&&(mn=Nt.lerp(mn,En.x,ka),_r=Nt.lerp(_r,En.z,ka),Ai=(mn-Ge.x)**2+(_r-Ge.z)**2,Oa=Ai<St*St?Ge.y-Math.sqrt(St*St-Ai):Ge.y),ye.limbs[de].wrist=[mn,Nt.lerp(Vn.y,Oa,pi),_r],pi<1){const Ba=new A().fromArray(ye.limbs[de].wrist).sub(Ge);Ba.length()>1e-6&&Ba.length()<St&&(ye.limbs[de].wrist=Ge.clone().add(Ba.setLength(St)).toArray())}}}const Bt=Re.plantLow,Jt=new qe().fromArray(ye.limbs[de].handQuaternion),nn=ye.limbs[de].wrist[1]+k(de,Jt),rn=ni[de]?Bt:Bt+Math.max(0,Re.startLow-Bt)*Math.pow(1-Re.t,Na);if(nn<rn&&ni[de]&&po)ye.limbs[de].wrist[1]+=rn-nn;else if(nn<rn){const zt=new A().fromArray(ye.limbs[de].wrist),St=zt.distanceTo(Ge),At=zt.y+rn-nn-Ge.y,bn=new A(zt.x-Ge.x,0,zt.z-Ge.z);Math.abs(At)<St&&bn.lengthSq()>1e-10&&(ye.limbs[de].wrist=Ge.clone().addScaledVector(bn.normalize(),Math.sqrt(St*St-At*At)).setY(Ge.y+At).toArray())}}Xe.limbs[de].wrist.fromArray(ye.limbs[de].wrist)}const dt=Xe.bodyQuaternion.clone().multiply(Xe.torsoQuaternion??Un),_t=de=>de.requested.bodyQuaternion.clone().multiply(de.requested.torsoQuaternion??Un),[$e,xt]=[Ae[1],Ae[2]];for(const de of wt){const Re=b[de],Ge=$e.solved[de],Wt=xt.solved[de],Bt=qt=>qt.solved[de].leg.end.clone().sub(qt.solved[de].hip).applyQuaternion(Ne(qt.requested).clone().invert()),Jt=Ae.map(Bt),nn=Bn(...Jt.map(qt=>new A(qt.length(),0,0)),J).x,rn=Ne(Xe),zt=l[de+"Hip"].clone().sub(l.pelvis).applyQuaternion(rn).add(lt),St=zt.clone().add(Bn(...Jt,J).setLength(nn).applyQuaternion(rn)),At=ye.groundLock?Et(de,Xe.limbs[de].footQuaternion):-1/0;if(St.y<At&&At-zt.y<=nn){const qt=At-zt.y,Qn=new A(St.x-zt.x,0,St.z-zt.z);Qn.lengthSq()>1e-10&&St.copy(zt).addScaledVector(Qn.normalize(),Math.sqrt(nn*nn-qt*qt)).setY(At)}const bn=js({startRoot:Ge.hip.toArray(),endRoot:Wt.hip.toArray(),currentRoot:zt.toArray(),startTarget:Ge.leg.end.toArray(),endTarget:Wt.leg.end.toArray(),currentTarget:St.toArray(),startMiddle:Ge.leg.middle.toArray(),endMiddle:Wt.leg.middle.toArray(),startReference:Ne($e.requested).toArray(),endReference:Ne(xt.requested).toArray(),currentReference:rn.toArray(),blend:J,upperLength:Re.thigh,lowerLength:Re.shin,arc:!1,side:de}),Ei=(qt,Qn,Kn,pi,mn)=>{const _r=Ae.map(Ai=>Qn(Ai).clone().sub(qt(Ai)).applyQuaternion(Kn(Ai).clone().invert()));return mn.clone().add(Bn(..._r,J).applyQuaternion(pi)).toArray()};ye.limbs[de].ankle=bn.target,ye.limbs[de].kneePole=Ei(qt=>qt.solved[de].hip,qt=>qt.requested.limbs[de].kneePole,qt=>Ne(qt.requested),rn,zt);const Vn=C(l[de+"Shoulder"],Xe.bodyQuaternion,Xe.torsoQuaternion).add(lt);js({startRoot:Ge.shoulder.toArray(),endRoot:Wt.shoulder.toArray(),currentRoot:Vn.toArray(),startTarget:Ge.arm.end.toArray(),endTarget:Wt.arm.end.toArray(),currentTarget:ye.limbs[de].wrist,startMiddle:Ge.arm.middle.toArray(),endMiddle:Wt.arm.middle.toArray(),startReference:_t($e).toArray(),endReference:_t(xt).toArray(),currentReference:dt.toArray(),blend:J,upperLength:Re.upperArm,lowerLength:Re.forearm,arc:!1,side:de}),ye.limbs[de].elbowPole=Ei(qt=>qt.solved[de].shoulder,qt=>qt.requested.limbs[de].elbowPole,_t,dt,Vn);const En=tt[de];if(En){const qt=En.nodes.map(Kn=>Kn.requested.limbs[de].elbowPole.clone().sub(Kn.solved[de].shoulder).applyQuaternion(_t(Kn).clone().invert())),Qn=Vn.clone().add(Bn(...qt,En.t).applyQuaternion(dt));ye.limbs[de].elbowPole=Qn.lerp(new A().fromArray(ye.limbs[de].elbowPole),En.mix).toArray()}}return nt.size&&Fe.set(ye,nt),Object.keys(ve).length&&Ie.set(ye,ve),ye}function ie(E,{start:D,end:B,blend:U}){const V=et(D),H=et(B);E.pelvis=(bt(D,B,V,H,U)??V.constrainedPelvis.clone().lerp(H.constrainedPelvis,U)).toArray();for(const se of wt)E.limbs[se].wrist=V.solved[se].arm.end.clone().lerp(H.solved[se].arm.end,U).toArray();const Y=Tc(E),$=pn(Y),J=Dt(Y,$);if(J>0){$.y+=J,Y.pelvis.y+=J;for(const se of wt)for(const pe of["ankle","kneePole"])E.limbs[se][pe]&&(E.limbs[se][pe][1]+=J)}E.pelvis=$.toArray();const K=se=>se.requested.bodyQuaternion.clone().multiply(se.requested.torsoQuaternion??Un).toArray(),ce=Y.bodyQuaternion.clone().multiply(Y.torsoQuaternion??Un);for(const se of wt){const pe=b[se],Me=V.solved[se],ye=H.solved[se],je=C(l[se+"Shoulder"],Y.bodyQuaternion,Y.torsoQuaternion).add($),Ae=js({startRoot:Me.shoulder.toArray(),endRoot:ye.shoulder.toArray(),currentRoot:je.toArray(),startTarget:Me.arm.end.toArray(),endTarget:ye.arm.end.toArray(),currentTarget:E.limbs[se].wrist,startMiddle:Me.arm.middle.toArray(),endMiddle:ye.arm.middle.toArray(),startReference:K(V),endReference:K(H),currentReference:ce.toArray(),blend:U,upperLength:pe.upperArm,lowerLength:pe.forearm,arc:!E.limbs[se].handLocked,side:se});E.limbs[se].wrist=Ae.target,E.limbs[se].elbowPole=Ae.pole;const Ke=l[se+"Hip"].clone().sub(l.pelvis).applyQuaternion(Ne(Y)).add($),tt=E.groundLock?Et(se,Y.limbs[se].footQuaternion):-1/0,nt=js({startRoot:Me.hip.toArray(),endRoot:ye.hip.toArray(),currentRoot:Ke.toArray(),startTarget:Me.leg.end.toArray(),endTarget:ye.leg.end.toArray(),currentTarget:E.limbs[se].ankle,startMiddle:Me.leg.middle.toArray(),endMiddle:ye.leg.middle.toArray(),startReference:Ne(V.requested).toArray(),endReference:Ne(H.requested).toArray(),currentReference:Ne(Y).toArray(),blend:U,upperLength:pe.thigh,lowerLength:pe.shin,floorHeight:tt,side:se});E.limbs[se].ankle=nt.target,E.limbs[se].kneePole=nt.pole}return E}function z(E){const{requested:D,solved:B}=E,U=D.bodyQuaternion.clone().multiply(D.torsoQuaternion??Un),V=Ne(D),H={pelvis:V.clone(),torso:U.clone(),neck:U.clone(),head:U.clone()};for(const Y of wt){const{source:$,shoulder:J,arm:K,hip:ce,leg:se}=B[Y],pe=[["UpperArm","Shoulder","Elbow",K.middle.clone().sub(J),U,"upperArmTwist"],["Forearm","Elbow","Wrist",K.end.clone().sub(K.middle),U,"elbowTwist"],["Thigh","Hip","Knee",se.middle.clone().sub(ce),V,"thighTwist"],["Shin","Knee","Ankle",se.end.clone().sub(se.middle),V,"kneeTwist"]];for(const[Me,ye,je,Ae,Ke,tt]of pe){const nt=l[Y+je].clone().sub(l[Y+ye]),ve=er(nt,Ae,Ke);$[tt]&&ve.multiply(new qe().setFromAxisAngle(nt.normalize(),$[tt])),H[Y+Me]=ve}H[Y+"Scapula"]=U.clone(),H[Y+"Patella"]=H[Y+"Thigh"].clone().slerp(H[Y+"Shin"],.52),H[Y+"Hand"]=$.handQuaternion.clone(),H[Y+"Foot"]=$.footQuaternion.clone()}return H}function Ee(E,{start:D,end:B,blend:U,guide:V}){const H=structuredClone(E),Y=Oe(E),$=ev(U),J=et(D),K=et(B),ce={},se=[],pe=ve=>Yt(V.bends?.[ve]??[0,0,0]).multiplyScalar($),Me=(ve,Xe)=>Xe==="pelvis"?ve.constrainedPelvis:ve.solved[Xe.startsWith("left")?"left":"right"][Xe.endsWith("Wrist")?"arm":"leg"].end,ye=ve=>V.orbitPaths?.[ve]?iv(Me(J,ve).toArray(),Me(K,ve).toArray(),V.orbitPaths[ve],U):V.smoothPaths?.[ve]?tv(Me(J,ve).toArray(),Me(K,ve).toArray(),V.smoothPaths[ve].bend,U):Me(Y,ve).clone().add(pe(ve)).toArray();ce.pelvis=ye("pelvis"),H.pelvis=[...ce.pelvis];for(const ve of wt){const Xe=H.limbs[ve];J.requested.limbs[ve].handLocked&&K.requested.limbs[ve].handLocked?(Xe.wrist=J.solved[ve].arm.end.clone().lerp(K.solved[ve].arm.end,U).toArray(),(V.orbitPaths?.[ve+"Wrist"]||V.smoothPaths?.[ve+"Wrist"]||pe(ve+"Wrist").lengthSq()>1e-16)&&se.push(`${ve==="left"?"左":"右"}手在两端均为支撑手，腕部路线偏移已忽略。`)):(ce[ve+"Wrist"]=ye(ve+"Wrist"),Xe.wrist=[...ce[ve+"Wrist"]]),ce[ve+"Ankle"]=ye(ve+"Ankle"),Xe.ankle=[...ce[ve+"Ankle"]]}const je=Oe(H);H.pelvis=je.constrainedPelvis.toArray();const Ae=ve=>ve.requested.bodyQuaternion.clone().multiply(ve.requested.torsoQuaternion??Un);for(const ve of wt){const Xe=b[ve],lt=J.solved[ve],Gt=K.solved[ve],dt=je.solved[ve],_t=H.limbs[ve];for(const $e of[!0,!1]){const xt=$e?dt.shoulder:dt.hip,de=$e?dt.arm.end:dt.leg.end,Re=$e?lt.arm:lt.leg,Ge=$e?Gt.arm:Gt.leg,Wt=js({startRoot:($e?lt.shoulder:lt.hip).toArray(),endRoot:($e?Gt.shoulder:Gt.hip).toArray(),currentRoot:xt.toArray(),startTarget:Re.end.toArray(),endTarget:Ge.end.toArray(),currentTarget:de.toArray(),startMiddle:Re.middle.toArray(),endMiddle:Ge.middle.toArray(),startReference:($e?Ae(J):Ne(J.requested)).toArray(),endReference:($e?Ae(K):Ne(K.requested)).toArray(),currentReference:($e?Ae(je):Ne(je.requested)).toArray(),blend:U,upperLength:$e?Xe.upperArm:Xe.thigh,lowerLength:$e?Xe.forearm:Xe.shin,arc:!1,side:ve}),Bt=(V.bendAngles?.[ve+($e?"Elbow":"Knee")]??0)*$;_t[$e?"wrist":"ankle"]=de.toArray(),_t[$e?"elbowPole":"kneePole"]=Tv(xt,de,Yt(Wt.pole),Bt).toArray()}}const Ke=Oe(H),tt=z(J),nt=z(K);for(const ve of wt){const Xe=J.solved[ve],lt=K.solved[ve],Gt=Ke.solved[ve];for(const dt of[!0,!1]){const _t=Re=>dt?Re.shoulder:Re.hip,$e=Re=>dt?Re.arm:Re.leg,xt=Re=>$e(Re).middle.clone().sub(_t(Re)).cross($e(Re).end.clone().sub($e(Re).middle)),de=dt?b[ve].armNormal:b[ve].legNormal;for(const Re of[!1,!0]){const Ge=ve+(dt?Re?"Forearm":"UpperArm":Re?"Shin":"Thigh"),Wt=dt?Re?"elbowTwist":"upperArmTwist":Re?"kneeTwist":"thighTwist",Bt=l[ve+(dt?Re?"Wrist":"Elbow":Re?"Ankle":"Knee")].clone().sub(l[ve+(dt?Re?"Elbow":"Shoulder":Re?"Knee":"Hip")]),Jt=St=>Re?$e(St).end.clone().sub($e(St).middle):$e(St).middle.clone().sub(_t(St)),nn=dt?Ev({sourceAxis:Bt,sourceNormal:de,startAxis:Jt(Xe),endAxis:Jt(lt),currentAxis:Jt(Gt),startNormal:xt(Xe),endNormal:xt(lt),currentNormal:xt(Gt),startRotation:tt[Ge],endRotation:nt[Ge],blend:U}):Av({sourceAxis:Bt,currentAxis:Jt(Gt),startRotation:tt[Ge],endRotation:nt[Ge],startReference:Ne(J.requested),endReference:Ne(K.requested),currentReference:Ne(Ke.requested),blend:U}),rn=dt?Ae(Ke):Ne(Ke.requested),zt=er(Bt,Jt(Gt),rn);H.limbs[ve][Wt]=Ll(zt,nn,Bt)}}}return X.set(H,{targets:ce,warnings:[...new Set([...je.warnings,...Ke.warnings,...se])]}),H}function Ue(E,D={}){const B=D.legPath==="linear"?"linear":"arc",U=yc(E,{...D,mapTransition:B==="arc"?ie:void 0,resolveFootEndpoint:at,mapGuidedTransition:Ee});if(D.segmentGuides?.some(K=>Object.keys(K.orbitPaths??{}).length)){const K=[...new Set([...E.map((ce,se)=>se*U.period/E.length),...(D.corrections??[]).map(ce=>(ce.segment+ce.at)*U.period/E.length)])].sort((ce,se)=>ce-se);for(let ce=0;ce<K.length;ce++){const se=(K[ce]+(K[ce+1]??U.period))/2,pe=U.guideAt(se);pe&&Object.keys(pe.guide.orbitPaths??{}).length&&U.sample(se)}}const V=D.motionModel==="periodic"?yv({landmarks:e.landmarks,period:U.period,groundHands:Object.fromEntries(wt.map(K=>[K,kt(K,[0,0,1])])),shoeOffsets:Object.fromEntries(wt.map(K=>[K,Array.from({length:8},(ce,se)=>{const pe=d[K];return new A(se&1?pe.max.x:pe.min.x,se&2?pe.max.y:pe.min.y,se&4?pe.max.z:pe.min.z).sub(l[K+"Ankle"]).toArray()})]))}):null;if(V)for(let K=0;K<180;K++)Oe(V.sample(K*U.period/180));const H=structuredClone(D.corrections??[]),Y=structuredClone(D.skippedSteps??[]),$=structuredClone(D.footCurves??[]),J=structuredClone(D.segmentGuides??[]);N=U,me=H,Te=Y,ke=$,He=J,Ce=V,Ze=V?"periodic":"saved",ue.clear(),re=B,xe=D.interpolation??"smooth",he==="flare"&&ze(oe)}function Qe(E={}){if(!E||typeof E!="object"||Array.isArray(E))throw new Error("动画采样选项需要为对象。");const D=E.legPath??re;if(!["arc","linear"].includes(D))throw new Error("未知的轨迹路线。");return["steps","corrections","legPath","interpolation","skippedSteps","footCurves","segmentGuides"].some(U=>E[U]!==void 0)?yc(E.steps??N.steps,{period:E.period??N.period,corrections:E.corrections??me,skippedSteps:E.skippedSteps??Te,footCurves:E.footCurves??ke,resolveFootEndpoint:at,segmentGuides:E.segmentGuides??He,mapGuidedTransition:Ee,interpolation:E.interpolation??xe,mapTransition:D==="arc"?ie:void 0}):N}function Ye(E,D={}){if(!Number.isFinite(E))throw new Error("动画采样时间需要为有限数值。");return!Object.keys(D).length&&ti()?te(E):Qe(D).sample(E)}function ut(E,D={}){return typeof D=="string"?N.guideAt(E,D):Qe(D).guideAt(E,{prefer:D.prefer??"next"})}function gt(E={}){const{startTime:D,endTime:B,samples:U=64,includeTimes:V=[]}=E;if(!Number.isFinite(D)||!Number.isFinite(B)||B<D)throw new Error("轨迹起止时间需要有限数值，结束时间不能早于开始时间。");if(!Number.isInteger(U)||U<2||U>512)throw new Error("轨迹采样数量需要为 2–512 的整数。");if(!Array.isArray(V)||V.some(K=>!Number.isFinite(K)||K<D||K>B))throw new Error("额外关键帧时间必须位于轨迹区间内。");const H=Qe(E),Y=Array.from({length:U},(K,ce)=>ce===U-1?B:D+(B-D)*ce/(U-1)),J=(V.length&&B>D?[...new Set([...Y,...V])].sort((K,ce)=>K-ce):Y).map(K=>{const ce=H.sample(K),se=Oe(ce),{requested:pe,constrainedPelvis:Me,solved:ye}=se,je=ve=>C(l[ve],pe.bodyQuaternion,pe.torsoQuaternion).add(Me).toArray(),Ae={pelvis:Me.toArray(),waist:x.clone().sub(l.pelvis).applyQuaternion(pe.bodyQuaternion).add(Me).toArray(),shoulderCenter:je("torso"),neck:je("neck"),head:je("head")};for(const ve of wt){const{source:Xe,shoulder:lt,arm:Gt,hip:dt,leg:_t}=ye[ve],$e={shoulder:lt,elbow:Gt.middle,wrist:Gt.end,palm:b[ve].palmOffset.clone().applyQuaternion(Xe.handQuaternion).add(Gt.end),hip:dt,knee:_t.middle,ankle:_t.end,toe:new A(0,0,.18).applyQuaternion(Xe.footQuaternion).add(_t.end)};for(const[xt,de]of Object.entries($e))Ae[ve+xt[0].toUpperCase()+xt.slice(1)]=de.toArray()}const Ke={};for(const ve of wt){const Xe=H.curveAt(K,ve);Xe&&(Ke[ve]=Xe.position)}const tt=X.get(ce),nt=tt?{warnings:[...new Set([...tt.warnings,...se.warnings])],goalErrors:Object.fromEntries(Object.entries(tt.targets).map(([ve,Xe])=>[ve,Yt(Ae[ve]).distanceTo(Yt(Xe))]))}:null;return{time:K,joints:Ae,...Object.keys(Ke).length?{curveTargets:Ke}:{},...tt?{guideTargets:structuredClone(tt.targets),diagnostics:nt}:{},...E.includeBoneRotations?{boneRotations:Object.fromEntries(Object.entries(z(se)).map(([ve,Xe])=>[ve,Xe.toArray()]))}:{}}});return{startTime:D,endTime:B,frames:J}}function We(){return{version:1,pelvis:S.toArray(),bodyQuaternion:m.toArray(),...I?{pelvisQuaternion:f.toArray()}:{},..._?{torsoQuaternion:M.toArray()}:{},limbs:Object.fromEntries(wt.map(E=>[E,{wrist:v[E].wrist.toArray(),elbowPole:(v[E].elbowPole??v[E].elbow).toArray(),handQuaternion:c.get(E+"Hand").rotation.toArray(),ankle:v[E].ankle.toArray(),kneePole:(v[E].kneePole??v[E].knee).toArray(),footQuaternion:c.get(E+"Foot").rotation.toArray(),handLocked:b[E].support,...Object.fromEntries(["elbowTwist","kneeTwist","upperArmTwist","thighTwist"].filter(D=>v[E][D]!==void 0).map(D=>[D,v[E][D]]))}])),groundLock:Ft}}function Et(E,D){const B=new an,U=l[E+"Ankle"],V=new ot().makeRotationFromQuaternion(D).multiply(new ot().makeTranslation(-U.x,-U.y,-U.z));return Ac(d[E],V,B),gi-(B.isEmpty()?-U.y:B.min.y)}function kt(E,D,B){if(!wt.includes(E))throw new Error("未知的支撑手。");const U=E==="left"?1:-1,V=new A(U*.98253144,.05483374,.17783482),H=new A(U*.06068526,-.99777448,-.02762938),Y=Yt(D);if(Y.y=0,Y.lengthSq()<1e-8)throw new Error("手指方向需要有水平分量。");Y.normalize();const $=Zo(Y,Fi.clone().negate()).multiply(Zo(V,H).invert());let J=1/0;for(const ce of h[E])J=Math.min(J,ce.clone().sub(l[E+"Wrist"]).applyQuaternion($).y);const K=B?Yt(B):new A(U*.215,0,0);return K.y=gi-(Number.isFinite(J)?J:-.035),{wrist:K.toArray(),handQuaternion:$.toArray(),fingerDirection:Y.toArray()}}function Kt(){let E=We();const D=new A;for(let B=0;B<8;B++){const U=i.matrixWorld.clone().invert();let V=!1;for(const H of wt){if(!E.limbs[H].handLocked)continue;let Y=1/0;for(const{mesh:J,index:K}of u[H])J.getVertexPosition(K,D).applyMatrix4(J.matrixWorld).applyMatrix4(U),Y=Math.min(Y,D.y);const $=gi-Y;Number.isFinite($)&&Math.abs($)>1e-7&&(E.limbs[H].wrist[1]+=$,V=!0)}if(!V)break;E=Hn(E)}return We()}function pn(E){const D=E.pelvis.clone(),B=[];let U=-1/0;for(const V of wt){const H=E.limbs[V],Y=b[V],$=C(l[V+"Shoulder"],E.bodyQuaternion,E.torsoQuaternion);if(H.handLocked&&B.push({center:H.wrist.clone().sub($),maximum:Y.upperArm+Y.forearm-1e-5,minimum:Math.abs(Y.upperArm-Y.forearm)+1e-5,side:V}),E.groundLock){const J=l[V+"Hip"].clone().sub(l.pelvis).applyQuaternion(Ne(E));U=Math.max(U,Et(V,H.footQuaternion)-(Y.thigh+Y.shin-1e-5)-J.y)}}if(B.length===2&&B[0].center.distanceTo(B[1].center)>B[0].maximum+B[1].maximum)throw new Error("双手锁定的位置相隔过远，原始手臂长度无法同时到达。请先解锁一只手或缩短双手间距。");for(let V=0;V<96;V++){for(const Y of B){const $=D.clone().sub(Y.center),J=$.length();J>Y.maximum?D.copy(Y.center).addScaledVector($,Y.maximum/J):J<Y.minimum&&(J<1e-10?$.copy(Fi):$.multiplyScalar(1/J),D.copy(Y.center).addScaledVector($,Y.minimum))}if(D.y=Math.max(D.y,U),B.every(Y=>{const $=D.distanceTo(Y.center);return $<=Y.maximum+1e-7&&$>=Y.minimum-1e-7}))return D}throw new Error("此躯干方向无法同时保持锁定手掌和脚底高度。请先解锁手掌或调整脚掌方向。")}function It(E,D,B,U){const V=b[B],H=V.thigh+V.shin-1e-7,Y=Math.abs(V.thigh-V.shin)+1e-7,$=D.clone();Number.isFinite(U)&&($.y=Math.max($.y,U));const J=$.clone().sub(E),K=J.length();if(K>H&&$.copy(E).addScaledVector(J,H/K),Number.isFinite(U)&&$.y<U){const ce=U-E.y,se=Math.sqrt(Math.max(0,H*H-ce*ce)),pe=D.x-E.x,Me=D.z-E.z,ye=Math.hypot(pe,Me),je=ye>se&&ye>0?se/ye:1;$.set(E.x+pe*je,U,E.z+Me*je)}return $.distanceTo(E)<Y&&$.copy(E).addScaledVector(Fi,Y),$}function Oe(E){const D=Tc(E),B=pn(D),U=$t(D,B,Fe.get(E),Ie.get(E));if(U>0){B.y+=U,D.pelvis.y+=U;for(const $ of wt)D.limbs[$].ankle.y+=U,D.limbs[$].kneePole&&(D.limbs[$].kneePole.y+=U)}_e(D,B);const V=[],H={},Y=$=>l[$].clone().sub(l.pelvis).applyQuaternion(Ne(D)).add(B);B.distanceTo(D.pelvis)>1e-5&&V.push("躯干位置已限制，以保持锁定手掌、真实骨长和地面高度。");for(const $ of wt){const J=D.limbs[$],K=b[$],ce=$==="left"?"左":"右",se=C(l[$+"Shoulder"],D.bodyQuaternion,D.torsoQuaternion).add(B);if(J.handLocked||J.wrist.y<=Lt){const Ke=se.clone().sub(J.wrist),tt=Ke.length(),nt=(K.upperArm+K.forearm)*le;tt>1e-6&&tt<nt-1e-4&&se.copy(J.wrist).addScaledVector(Ke,Math.min(nt,tt+mo)/tt)}const pe=Jo(se,J.wrist,K.upperArm,K.forearm,J.elbowPole);if(J.handLocked&&pe.end.distanceTo(J.wrist)>1e-5)throw new Error(`${ce}手锁定位置无法到达，请先解锁手掌。`);pe.end.distanceTo(J.wrist)>1e-5&&V.push(`${ce}手腕已限制在原始手臂能够到达的位置。`);const Me=Y($+"Hip"),ye=D.groundLock?Et($,J.footQuaternion):-1/0,je=It(Me,J.ankle,$,ye),Ae=Jo(Me,je,K.thigh,K.shin,J.kneePole);Ae.end.distanceTo(J.ankle)>1e-5&&V.push(`${ce}脚踝已按真实腿长${D.groundLock?"和地面高度":""}限制。`),H[$]={source:J,shoulder:se,arm:pe,hip:Me,leg:Ae}}return{requested:D,constrainedPelvis:B,warnings:V,solved:H}}const zn=.22,Pt=.9,In=1.2,Xi=.3,tn=.02,gr=.015,Ot=.85,Nn=1.15,br=!0;let yn=null;function fi(E,D=null){const B=N?.steps,U=B?B.length-1:0;if(!U||!Object.keys(ni).length)return 0;if(yn?.sequence!==N){const H=N.period,Y=H/(U+1),$=[];for(const K of wt)for(let ce=0;ce<U;ce++)B[ce].pose.limbs[K].handLocked&&!B[(ce-1+U)%U].pose.limbs[K].handLocked&&$.push({center:ce*Y,mono:K in ni});const J=$.map(({center:K,mono:ce})=>{const se=K-Math.max(Pt,Ot)-3*zn,pe=Math.ceil((Math.max(Pt,Ot)+Math.max(In,Nn)+6*zn)/tn)+1,Me=Array.from({length:pe},(je,Ae)=>Oe(te(se+Ae*tn)).constrainedPelvis.y);if(ce){const je=$e=>($e-se)/tn,Ae=Math.round(je(K-Ot)),Ke=Math.round(je(K+Nn)),tt=$e=>(Me[$e+1]-Me[$e-1])/(2*tn),nt=(Ke-Ae)*tn,ve=Me[Ae],Xe=Me[Ke],lt=tt(Ae)*nt,Gt=tt(Ke)*nt,dt=Me.map(($e,xt)=>{if(xt<=Ae||xt>=Ke)return 0;const de=(xt-Ae)/(Ke-Ae),Re=de*de,Ge=Re*de;return(2*Ge-3*Re+1)*ve+(Ge-2*Re+de)*lt+(-2*Ge+3*Re)*Xe+(Ge-Re)*Gt-$e}),_t={t0:se+Ae*tn,span:nt,y0:ve,y1:Xe,m0:lt,m1:Gt};return{center:K,from:se,offset:dt,period:H,before:Ot,after:Nn,edge:0,ease:_t}}let ye=null;for(let je=zn;je>.03;je*=.85){const Ae=Math.ceil(3*je/tn),Ke=Array.from({length:2*Ae+1},(tt,nt)=>Math.exp(-.5*((nt-Ae)*tn/je)**2));if(ye=Me.map((tt,nt)=>{if(nt<Ae||nt>=pe-Ae)return 0;let ve=0,Xe=0;for(let lt=-Ae;lt<=Ae;lt++)ve+=Me[nt+lt]*Ke[lt+Ae],Xe+=Ke[lt+Ae];return ve/Xe-tt}),Math.max(...ye.map(Math.abs))<=gr)break}return{center:K,from:se,offset:ye,period:H,before:Pt,after:In,edge:Xi}});yn={sequence:N,tables:J}}let V=0;for(const{center:H,from:Y,offset:$,period:J,before:K,after:ce,edge:se,ease:pe}of yn.tables){let Me=E-H;if(Me-=Math.round(Me/J)*J,Me<-K||Me>ce)continue;if(pe&&D!==null&&br){const tt=Nt.clamp((H+Me-pe.t0)/pe.span,0,1),nt=tt*tt,ve=nt*tt;V+=(2*ve-3*nt+1)*pe.y0+(ve-2*nt+tt)*pe.m0+(-2*ve+3*nt)*pe.y1+(ve-nt)*pe.m1-D;continue}const ye=se?Nt.smoothstep(Me,-K,-K+se)*(1-Nt.smoothstep(Me,ce-se,ce)):1,je=(H+Me-Y)/tn,Ae=Math.floor(je),Ke=je-Ae;V+=ye*Nt.lerp($[Ae]??0,$[Ae+1]??0,Ke)}return V}function Hn(E,{alignBendPlanes:D=!1,bodyOffset:B=0}={}){const{requested:U,constrainedPelvis:V,warnings:H,solved:Y}=Oe(E);if(typeof B=="function"&&(B=B(V.y)),B){V.y+=B;for(const $ of wt)for(const J of[Y[$].hip,Y[$].leg.middle,Y[$].leg.end])J.y+=B}rt=D,he="manual",Ft=U.groundLock,pt=H,S.copy(V),m.copy(U.bodyQuaternion),f.copy(Ne(U)),I=U.pelvisQuaternion!==void 0,M.copy(U.torsoQuaternion??Un),_=U.torsoQuaternion!==void 0,R.set(1,0,0).applyQuaternion(m),T.copy(Fi).applyQuaternion(m),F.copy(Ni).applyQuaternion(m),ne=(Math.atan2(F.x,F.z)+Math.PI*2)%(Math.PI*2),ge(),Le();for(const $ of wt){const{source:J,shoulder:K,arm:ce,hip:se,leg:pe}=Y[$],Me=b[$];Me.support=J.handLocked,Me.flight=J.handLocked?0:1,Me.anchor.copy(J.wrist).add(Me.palmOffset.clone().applyQuaternion(J.handQuaternion));const ye=v[$]={elbowPole:J.elbowPole.clone(),kneePole:J.kneePole.clone()};for(const je of["elbowTwist","kneeTwist","upperArmTwist","thighTwist"])J[je]!==void 0&&(ye[je]=J[je]);Be($,ye,K,ce.middle,ce.end,J.handQuaternion),Rt($,ye,se,pe.middle,pe.end,J.footQuaternion)}return fe(),We()}function Os(){const E=[{id:"pelvis",position:S.toArray(),quaternion:f.toArray(),canRotate:!0,label:"髋部 · 独立位置与旋转"},{id:"torso",position:y(l.torso).toArray(),quaternion:m.toArray(),canRotate:!0,label:"躯干 · 整体移动与转向"},{id:"waist",position:ct(x).toArray(),quaternion:M.toArray(),parentQuaternion:m.toArray(),canRotate:!0,label:"腰部 · 独立弯腰与扭转"}];for(const D of wt){const B=D==="left"?"左":"右";for(const[U,V,H,Y,$]of[["Wrist","wrist","Hand",!0,"手腕 · 手掌位置与朝向"],["Elbow","elbow","Forearm",!0,"肘部 · 前臂旋转与弯曲"],["Ankle","ankle","Foot",!0,"脚踝 · 脚掌位置与朝向"],["Knee","knee","Shin",!0,"膝部 · 小腿旋转与弯曲"]])E.push({id:D+U,position:v[D][V].toArray(),quaternion:c.get(D+H).rotation.toArray(),canRotate:Y,label:B+$})}return E}function Fa(E,D,B,U=null){const V=U?U.constrainedPelvis.clone():S.clone(),H=U?U.requested.bodyQuaternion.clone():m.clone(),Y=U?Ut(U.requested.torsoQuaternion)?H.clone():H.clone().multiply(U.requested.torsoQuaternion):it(),$=U?Ne(U.requested).clone():f.clone(),J=U?C(l.torso,H,U.requested.torsoQuaternion).add(V):y(l.torso),K=U?x.clone().sub(l.pelvis).applyQuaternion(H).add(V):ct(x),ce=x.clone().sub(l.pelvis),se=l.torso.clone().sub(x),pe=ce.length(),Me=se.length(),ye=J.clone().sub(V).normalize(),je=K.clone().sub(V);je.addScaledVector(ye,-je.dot(ye)),je.lengthSq()<1e-10&&(je.copy(Ni).applyQuaternion(Y),je.addScaledVector(ye,-je.dot(ye))),je.lengthSq()<1e-10&&(je.copy(Ni).applyQuaternion(H),je.addScaledVector(ye,-je.dot(ye))),je.normalize();const Ae=D?Yt(D):V,Ke=B?new qe().fromArray(B):$,tt=Ae.distanceToSquared(V)>1e-20,nt=Ae.clone();if(tt){const dt=nt.clone().sub(V),_t=V.clone().sub(J),$e=dt.lengthSq(),xt=_t.dot(dt),de=(Me-pe)**2,Re=ts(-xt/$e,0,1);if(_t.clone().addScaledVector(dt,Re).lengthSq()<de-1e-14){const Ge=xt*xt-$e*(_t.lengthSq()-de),Wt=ts((-xt-Math.sqrt(Math.max(0,Ge)))/$e,0,1);nt.copy(V).addScaledVector(dt,Wt)}}function ve(dt,_t=!1){const $e=structuredClone(E);if($e.pelvisQuaternion=$.clone().slerp(Ke,dt).toArray(),!tt)return $e;const xt=V.clone().lerp(nt,dt);if(_t){const St=K.clone(),At=V.clone().sub(St).normalize(),bn=xt.clone().sub(V);bn.addScaledVector(At,-bn.dot(At));const Ei=At.multiplyScalar(pe).add(bn).normalize();xt.copy(St).addScaledVector(Ei,pe);const Vn=er(ce,St.clone().sub(xt),H);return $e.pelvis=xt.toArray(),$e.bodyQuaternion=Vn.toArray(),$e.torsoQuaternion=Vn.clone().invert().multiply(Y).normalize().toArray(),$e}const de=J.clone().sub(xt);let Re=de.length();const Ge=Re>1e-10?de.multiplyScalar(1/Re):ye.clone();Re=ts(Re,Math.abs(Me-pe),Me+pe),xt.copy(J).addScaledVector(Ge,-Re);const Wt=(pe*pe-Me*Me+Re*Re)/(2*Re),Bt=Math.sqrt(Math.max(0,pe*pe-Wt*Wt)),Jt=je.clone().applyQuaternion(new qe().setFromUnitVectors(ye,Ge)),nn=xt.clone().addScaledVector(Ge,Wt).addScaledVector(Jt,Bt),rn=er(ce,nn.clone().sub(xt),H),zt=er(se,J.clone().sub(nn),Y);return $e.pelvis=xt.toArray(),$e.bodyQuaternion=rn.toArray(),$e.torsoQuaternion=rn.clone().invert().multiply(zt).normalize().toArray(),$e}function Xe(dt){try{const _t=Oe(dt);return C(l.torso,_t.requested.bodyQuaternion,_t.requested.torsoQuaternion).add(_t.constrainedPelvis).distanceTo(J)<1e-7}catch{return!1}}let lt=ve(1),Gt=!1;if(!Xe(lt)){const dt=tt&&wt.some($e=>E.limbs[$e].handLocked),_t=dt?ve(1,!0):null;if(_t&&Xe(_t))lt=_t;else{let $e=0,xt=1;lt=E,Gt=!0;for(let de=0;de<28;de++){const Re=($e+xt)/2,Ge=ve(Re,dt);Xe(Ge)?($e=Re,lt=Ge):xt=Re}}}return tt&&Yt(lt.pelvis).distanceTo(Ae)>1e-5&&(Gt=!0),{pose:lt,limited:Gt}}function Ua({requested:E,constrainedPelvis:D,solved:B}){const U=H=>C(l[H],E.bodyQuaternion,E.torsoQuaternion).add(D),V={pelvis:D.clone(),waist:x.clone().sub(l.pelvis).applyQuaternion(E.bodyQuaternion).add(D),shoulderCenter:U("torso"),neck:U("neck"),head:U("head")};for(const H of wt){const{source:Y,shoulder:$,arm:J,hip:K,leg:ce}=B[H],se={Shoulder:$.clone(),Elbow:J.middle.clone(),Wrist:J.end.clone(),Palm:b[H].palmOffset.clone().applyQuaternion(Y.handQuaternion).add(J.end),Hip:K.clone(),Knee:ce.middle.clone(),Ankle:ce.end.clone(),Toe:new A(0,0,.18).applyQuaternion(Y.footQuaternion).add(ce.end)};for(const[pe,Me]of Object.entries(se))V[H+pe]=Me}return V}function ch({requested:E,constrainedPelvis:D,solved:B},U){const V=structuredClone(U);V.pelvis=D.toArray(),V.bodyQuaternion=E.bodyQuaternion.toArray();for(const H of["torsoQuaternion","pelvisQuaternion"])E[H]?V[H]=E[H].toArray():delete V[H];for(const H of wt){const{source:Y,arm:$,leg:J}=B[H],K=V.limbs[H];K.wrist=$.end.toArray(),K.ankle=J.end.toArray(),K.elbowPole=Y.elbowPole.toArray(),K.kneePole=Y.kneePole.toArray(),K.handQuaternion=Y.handQuaternion.toArray(),K.footQuaternion=Y.footQuaternion.toArray()}return V}function lh(E,D,B){if(E.lengthSq()<1e-20||D.lengthSq()<1e-20)return Un.clone();const U=E.clone().normalize(),V=D.clone().normalize(),H=new A().crossVectors(U,V),Y=H.length(),$=ts(U.dot(V),-1,1);return Y>1e-10?new qe().setFromAxisAngle(H.multiplyScalar(1/Y),Math.atan2(Y,$)):$>=0?Un.clone():(H.copy(Ni).applyQuaternion(B).addScaledVector(U,-Ni.clone().applyQuaternion(B).dot(U)),H.lengthSq()<1e-10&&H.set(1,0,0).applyQuaternion(B).addScaledVector(U,-new A(1,0,0).applyQuaternion(B).dot(U)),new qe().setFromAxisAngle(H.normalize(),Math.PI))}function wf(E,{joint:D,position:B}={}){const U=sr(B,3,"关节目标位置"),V=Oe(E),H=Ua(V),Y=Yt(U);if(typeof D!="string"||!Object.hasOwn(H,D))throw new Error("未知关节点。");const $=ch(V,E),J=[];let K=D==="pelvis"||D.endsWith("Hip")?"pelvis":D==="waist"||D==="shoulderCenter"?"body":["neck","head","leftShoulder","rightShoulder"].includes(D)?"upperBody":(D.startsWith("left")?"left":"right")+(/Elbow|Wrist|Palm$/.test(D)?"Arm":"Leg"),ce;const se=Ut(V.requested.torsoQuaternion)?V.requested.bodyQuaternion.clone():V.requested.bodyQuaternion.clone().multiply(V.requested.torsoQuaternion),pe=(Ae,Ke)=>{const tt=ch(Ae,Ke),nt=Oe(tt),ve=Ua(nt),Xe=ve[D].distanceTo(Y),lt=Xe>1e-5,Gt=[...new Set([...V.warnings,...Ae.warnings,...nt.warnings,...J,...lt?["目标已按现有联动关系、真实骨长和锁定约束限制；显示的是实际可达位置。"]:[]])];return{pose:tt,joint:D,position:ve[D].toArray(),requestedPosition:[...U],error:Xe,limited:lt,warnings:Gt,linkedGroup:K,beforePosition:H[D].toArray(),joints:Object.fromEntries(Object.entries(ve).map(([dt,_t])=>[dt,_t.toArray()]))}};if(H[D].distanceToSquared(Y)<1e-24)return pe(V,$);if(D==="pelvis"){K="pelvis";const Ae=Fa($,U,null,V);return Ae.limited&&J.push("髋部位移已限幅，上身通过原有腰部联动。"),pe(Oe(Ae.pose),Ae.pose)}if(D==="waist"||D==="shoulderCenter")K="body",ce=Ae=>{const Ke=structuredClone($);return Ke.pelvis=Yt($.pelvis).add(Y.clone().sub(H[D]).multiplyScalar(Ae)).toArray(),Ke};else if(["neck","head","leftShoulder","rightShoulder"].includes(D)){K="upperBody";const Ae=H.waist,Ke=lh(H[D].clone().sub(Ae),Y.clone().sub(Ae),se);ce=tt=>{const nt=structuredClone($),ve=Un.clone().slerp(Ke,tt);nt.torsoQuaternion=V.requested.bodyQuaternion.clone().invert().multiply(ve.clone().multiply(se)).normalize().toArray();for(const Xe of wt){const lt=nt.limbs[Xe];lt.elbowPole=Yt(lt.elbowPole).sub(Ae).applyQuaternion(ve).add(Ae).toArray(),lt.handLocked||(lt.wrist=Yt(lt.wrist).sub(Ae).applyQuaternion(ve).add(Ae).toArray(),lt.handQuaternion=ve.clone().multiply(V.requested.limbs[Xe].handQuaternion).normalize().toArray())}return nt}}else{const Ae=D.startsWith("left")?"left":"right",Ke=D.slice(Ae.length),tt=V.solved[Ae],nt=b[Ae];if(Ke==="Hip"){K="pelvis";const dt=Ne(V.requested),_t=H.pelvis,xt=lh(H[D].clone().sub(_t),Y.clone().sub(_t),dt).multiply(dt).normalize(),de=Fa($,null,xt.toArray(),V);return pe(Oe(de.pose),de.pose)}if(Ke==="Elbow"||Ke==="Knee"){K=Ke==="Elbow"?Ae+"Arm":Ae+"Leg";const dt=Ke==="Elbow",_t=dt?tt.shoulder:tt.hip,$e=dt?tt.arm:tt.leg,xt=$e.end.clone().sub(_t).normalize(),de=_t.clone().addScaledVector(xt,$e.middle.clone().sub(_t).dot(xt)),Re=$e.middle.clone().sub(de),Ge=Re.length(),Wt=Y.clone().sub(de).addScaledVector(xt,-Y.clone().sub(de).dot(xt));Ge<.001?J.push("肢体接近伸直，已保留原弯曲方向。"):Wt.lengthSq()<1e-20?J.push("目标在肢体轴线上，已保留原弯曲方向。"):Re.copy(Wt).normalize().multiplyScalar(Ge);const Bt=structuredClone($);return Bt.limbs[Ae][dt?"elbowPole":"kneePole"]=de.add(Re).toArray(),pe(Oe(Bt),Bt)}const ve=Ke==="Wrist"||Ke==="Palm";K=ve?Ae+"Arm":Ae+"Leg";let Xe=Y.clone();Ke==="Palm"&&Xe.sub(nt.palmOffset.clone().applyQuaternion(tt.source.handQuaternion)),Ke==="Toe"&&Xe.sub(new A(0,0,.18).applyQuaternion(tt.source.footQuaternion)),ve&&(Xe=Jo(tt.shoulder,Xe,nt.upperArm,nt.forearm,tt.source.elbowPole).end);const lt=ve?"wrist":"ankle",Gt=Yt($.limbs[Ae][lt]);ce=dt=>{const _t=structuredClone($);return _t.limbs[Ae][lt]=Gt.clone().lerp(Xe,dt).toArray(),_t}}let Me=V,ye=$,je=H[D].distanceTo(Y);for(let Ae=0;Ae<12;Ae++){const Ke=ce(2**-Ae);try{const tt=Oe(Ke),nt=Ua(tt)[D].distanceTo(Y);if(nt<je-1e-12&&(Me=tt,ye=Ke,je=nt),nt<1e-8)break}catch{}}return pe(Me,ye)}function Ef(E,D){const B=Os().find(K=>K.id===E);if(!B)throw new Error("未知姿势控制点。");if(!D||D.position===void 0&&D.quaternion===void 0)throw new Error("请提供控制点的位置或方向。");const U=D.position===void 0?null:sr(D.position,3,`${B.label}位置`),V=D.quaternion===void 0?null:ns(D.quaternion,`${B.label}方向`).toArray();if(V&&!B.canRotate)throw new Error("此控制点不支持旋转。");let H=We(),Y=!1,$=!1;if(E==="pelvis"){const K=Fa(H,U,V);H=K.pose,$=K.limited}else if(E==="torso"){if(V){if(H.pelvisQuaternion){const se=new qe().fromArray(V).multiply(m.clone().invert());H.pelvisQuaternion=se.multiply(f).normalize().toArray()}H.bodyQuaternion=V}const K=Yt(U??B.position),ce=C(l.torso,new qe().fromArray(H.bodyQuaternion),H.torsoQuaternion?new qe().fromArray(H.torsoQuaternion):null);H.pelvis=K.sub(ce).toArray()}else if(E==="waist"){if(U&&(H.pelvis=Yt(U).sub(x.clone().sub(l.pelvis).applyQuaternion(m)).toArray()),V){const K=ct(x),se=m.clone().multiply(new qe().fromArray(V)).clone().multiply(it().invert());H.torsoQuaternion=V;for(const pe of wt){const Me=H.limbs[pe];Me.elbowPole=Yt(Me.elbowPole).sub(K).applyQuaternion(se).add(K).toArray(),Me.handLocked||(Me.wrist=Yt(Me.wrist).sub(K).applyQuaternion(se).add(K).toArray(),Me.handQuaternion=se.clone().multiply(new qe().fromArray(Me.handQuaternion)).normalize().toArray())}}}else{const K=E.startsWith("left")?"left":"right",ce=E.slice(K.length),se=H.limbs[K];if(V&&(ce==="Elbow"||ce==="Knee")){const pe=ce==="Elbow";if(pe&&se.handLocked)throw new Error(`${K==="left"?"左":"右"}手已固定，旋转肘部前请先取消对应手的固定。`);const Me=K+(pe?"Forearm":"Shin"),ye=new qe().fromArray(V),je=ye.clone().multiply(c.get(Me).rotation.clone().invert()),Ae=v[K][pe?"elbow":"knee"],Ke=pe?"wrist":"ankle",tt=pe?"elbowPole":"kneePole",nt=pe?"handQuaternion":"footQuaternion",ve=Yt(se[Ke]).sub(Ae).applyQuaternion(je).add(Ae);se[Ke]=ve.toArray(),se[tt]=Ae.toArray(),se[nt]=je.clone().multiply(new qe().fromArray(se[nt])).normalize().toArray();const Xe=l[K+(pe?"Wrist":"Ankle")].clone().sub(l[K+ce]),lt=er(Xe,ve.clone().sub(Ae),pe?it():f);se[pe?"elbowTwist":"kneeTwist"]=Z(lt,ye,Xe)}if(U&&ce==="Wrist"){const pe=Yt(U),Me=v[K].shoulder,ye=b[K],je=Jo(Me,pe,ye.upperArm,ye.forearm,Yt(se.elbowPole)).end;Y=je.distanceTo(pe)>1e-5,se.wrist=je.toArray()}else U&&(se[{Elbow:"elbowPole",Ankle:"ankle",Knee:"kneePole"}[ce]]=U);V&&(ce==="Wrist"||ce==="Ankle")&&(se[ce==="Wrist"?"handQuaternion":"footQuaternion"]=V)}const J=Hn(H);return $&&pt.unshift("髋部调整已限制在腰部和四肢可达范围内，肩中心保持原位置。"),Y&&pt.unshift("手腕已限制在当前肩部与真实手臂长度能够到达的位置。"),J}function hh(){if(q){G.makeEmpty();for(const E of c.values())Ac(E.bounds,E.matrix,G);q=!1}return{min:G.min.toArray(),max:G.max.toArray()}}function Af(E){L=E,i.userData.coachLayer=E}function Tf(E){W=E,i.userData.selectedMuscle=E}function Rf(){const E=Ce?Ce.describe(oe):null,D=E?["rear","right","front","left"].indexOf(E.section):-1,B={pelvis:S.toArray(),waist:ct(x).toArray(),shoulderCenter:y(l.torso).toArray(),neck:y(l.neck).toArray(),head:y(l.head).toArray()},U={torso:l.pelvis.distanceTo(l.torso)},V={torso:l.pelvis.distanceTo(l.torso)},H=[],Y={},$={};for(const J of wt){const K=b[J],ce=v[J];for(const se of["shoulder","elbow","wrist","palm","hip","knee","ankle","toe"])B[J+se[0].toUpperCase()+se.slice(1)]=ce[se].toArray();$[J]=K.support,K.support&&H.push(J),Y[J]=K.support?ce.palm.distanceTo(K.anchor):null,U[J+"UpperArm"]=ce.shoulder.distanceTo(ce.elbow),U[J+"Forearm"]=ce.elbow.distanceTo(ce.wrist),U[J+"Thigh"]=ce.hip.distanceTo(ce.knee),U[J+"Shin"]=ce.knee.distanceTo(ce.ankle);for(const se of["UpperArm","Forearm","Thigh","Shin"])V[J+se]=K[se[0].toLowerCase()+se.slice(1)]}return{time:oe,angle:ne,period:N.period,mode:he,manual:he==="manual",layer:L,selected:W,legPath:re,interpolation:xe,motionModel:Ze,skippedSteps:[...Te],periodic:E,bodyQuaternion:m.toArray(),groundLock:Ft,warnings:[...pt],pelvisQuaternion:f.toArray(),torsoQuaternion:M.toArray(),name:"Snow 友善健身主角",source:e.source,license:e.license,illustrative:!0,motionType:"Flare 教学示意",automaticallyBound:!1,keyframes:{...N.keyframes},demonstration:E?{index:D,count:4,id:`periodic-${E.section}`,phase:["rear","sideA","front","sideB"][D]}:{index:N.stepAt(oe),count:N.steps.length,id:N.steps[N.stepAt(oe)].id,phase:N.steps[N.stepAt(oe)].phase},supportHands:H,supports:$,supportDrift:Y,segmentLengths:U,expectedLengths:V,joints:B,minFootHeight:ee,chestForward:Ni.clone().applyQuaternion(it()).toArray(),bounds:hh(),neutralBounds:j,neutralHeight:e.height,skinning:{bones:c.size,batches:s.length,weightedVertices:p,originalMeshes:s.length,authoredWeights:!0},supportAnchors:Object.fromEntries(wt.map(J=>[J,b[J].anchor.toArray()]))}}i.userData.motionSource="Snow Rig / Blender Foundation",Se();function Cf(E){if(!ti())return 1;const D=N.steps.length-1,B=N.period/(D+1);return(E%N.period+N.period)%N.period>(D-1)*B?2:1}return{group:i,update:ze,reset:Se,setSequence:Ue,sampleTrajectory:gt,samplePose:Ye,getSegmentGuideAt:ut,getLoopTimeScale:Cf,getFootCurveSpan:(E,D)=>N.spanAt(E,D),getFootCurveAt:(E,D)=>N.curveAt(E,D),setLayer:Af,setHighlight:Tf,getMetrics:Rf,capturePose:We,applyPose:Hn,getEditableHandles:Os,editHandle:Ef,solveJointPose:wf,getGroundHandPose:kt,alignGroundHands:Kt}}function Pv(i,e,t=0){const n=["pelvis","leftHand","rightHand","leftFoot","rightFoot"].map(g=>i.getObjectByName(g)).filter(Boolean);if(n.length<3)return null;const r=e.getMetrics().period,s=240,o=[],a=new A;for(let g=0;g<=s;g++)e.update(g*r/s),i.updateMatrixWorld(!0),o.push(n.map(b=>b.getWorldPosition(a).clone()));e.update(t),i.updateMatrixWorld(!0);const c=g=>e.getLoopTimeScale?.(g)??1,l=[];for(let g=0;g<s;g++){let b=0;for(let m=0;m<n.length;m++)b+=o[g][m].distanceTo(o[g+1][m]);l.push(b*c((g+.5)*r/s))}const h=l.map((g,b)=>{let m=0,f=0;for(let M=-4;M<=4;M++){const x=5-Math.abs(M);m+=l[(b+M+s)%s]*x,f+=x}return m/f}),u=h.reduce((g,b)=>g+b,0)/s;if(!(u>0))return null;const d=h.map(g=>g<u*.02?25:Math.min(25,Math.max(.35,Math.pow(u/g,.8)))),p=d.reduce((g,b,m)=>g+1/(b*c((m+.5)*r/s)),0)/s;return d.map(g=>g*p)}function Jd(i,e,t,n=9){if(!i)return 1;const r=i.length,s=(t%n+n)%n/n*r,o=Math.floor(s)%r,a=s-Math.floor(s);return(i[o]*(1-a)+i[(o+1)%r]*a)*(e.getLoopTimeScale?.(t)??1)}function Lv(i,e,t,n,r,s=9){const a=n*r/8;let c=0;for(let l=0;l<8;l++)c+=a*Jd(i,e,t+c,s);return c}function ju(i,e){if(e===op)return console.warn("THREE.BufferGeometryUtils.toTrianglesDrawMode(): Geometry already defined as triangles."),i;if(e===xl||e===bd){let t=i.getIndex();if(t===null){const o=[],a=i.getAttribute("position");if(a!==void 0){for(let c=0;c<a.count;c++)o.push(c);i.setIndex(o),t=i.getIndex()}else return console.error("THREE.BufferGeometryUtils.toTrianglesDrawMode(): Undefined position attribute. Processing not possible."),i}const n=t.count-2,r=[];if(e===xl)for(let o=1;o<=n;o++)r.push(t.getX(0)),r.push(t.getX(o)),r.push(t.getX(o+1));else for(let o=0;o<n;o++)o%2===0?(r.push(t.getX(o)),r.push(t.getX(o+1)),r.push(t.getX(o+2))):(r.push(t.getX(o+2)),r.push(t.getX(o+1)),r.push(t.getX(o)));r.length/3!==n&&console.error("THREE.BufferGeometryUtils.toTrianglesDrawMode(): Unable to generate correct amount of triangles.");const s=i.clone();return s.setIndex(r),s.clearGroups(),s}else return console.error("THREE.BufferGeometryUtils.toTrianglesDrawMode(): Unknown draw mode:",e),i}class Dv extends Ns{constructor(e){super(e),this.dracoLoader=null,this.ktx2Loader=null,this.meshoptDecoder=null,this.pluginCallbacks=[],this.register(function(t){return new Ov(t)}),this.register(function(t){return new kv(t)}),this.register(function(t){return new Xv(t)}),this.register(function(t){return new Qv(t)}),this.register(function(t){return new Kv(t)}),this.register(function(t){return new zv(t)}),this.register(function(t){return new Hv(t)}),this.register(function(t){return new Vv(t)}),this.register(function(t){return new Gv(t)}),this.register(function(t){return new Uv(t)}),this.register(function(t){return new Wv(t)}),this.register(function(t){return new Bv(t)}),this.register(function(t){return new jv(t)}),this.register(function(t){return new qv(t)}),this.register(function(t){return new Nv(t)}),this.register(function(t){return new Yv(t)}),this.register(function(t){return new $v(t)})}load(e,t,n,r){const s=this;let o;if(this.resourcePath!=="")o=this.resourcePath;else if(this.path!==""){const l=eo.extractUrlBase(e);o=eo.resolveURL(l,this.path)}else o=eo.extractUrlBase(e);this.manager.itemStart(e);const a=function(l){r?r(l):console.error(l),s.manager.itemError(e),s.manager.itemEnd(e)},c=new zd(this.manager);c.setPath(this.path),c.setResponseType("arraybuffer"),c.setRequestHeader(this.requestHeader),c.setWithCredentials(this.withCredentials),c.load(e,function(l){try{s.parse(l,o,function(h){t(h),s.manager.itemEnd(e)},a)}catch(h){a(h)}},n,a)}setDRACOLoader(e){return this.dracoLoader=e,this}setKTX2Loader(e){return this.ktx2Loader=e,this}setMeshoptDecoder(e){return this.meshoptDecoder=e,this}register(e){return this.pluginCallbacks.indexOf(e)===-1&&this.pluginCallbacks.push(e),this}unregister(e){return this.pluginCallbacks.indexOf(e)!==-1&&this.pluginCallbacks.splice(this.pluginCallbacks.indexOf(e),1),this}parse(e,t,n,r){let s;const o={},a={},c=new TextDecoder;if(typeof e=="string")s=JSON.parse(e);else if(e instanceof ArrayBuffer)if(c.decode(new Uint8Array(e,0,4))===ef){try{o[Tt.KHR_BINARY_GLTF]=new Zv(e)}catch(u){r&&r(u);return}s=JSON.parse(o[Tt.KHR_BINARY_GLTF].content)}else s=JSON.parse(c.decode(e));else s=e;if(s.asset===void 0||s.asset.version[0]<2){r&&r(new Error("THREE.GLTFLoader: Unsupported asset. glTF versions >=2.0 are supported."));return}const l=new uy(s,{path:t||this.resourcePath||"",crossOrigin:this.crossOrigin,requestHeader:this.requestHeader,manager:this.manager,ktx2Loader:this.ktx2Loader,meshoptDecoder:this.meshoptDecoder});l.fileLoader.setRequestHeader(this.requestHeader);for(let h=0;h<this.pluginCallbacks.length;h++){const u=this.pluginCallbacks[h](l);u.name||console.error("THREE.GLTFLoader: Invalid plugin found: missing name"),a[u.name]=u,o[u.name]=!0}if(s.extensionsUsed)for(let h=0;h<s.extensionsUsed.length;++h){const u=s.extensionsUsed[h],d=s.extensionsRequired||[];switch(u){case Tt.KHR_MATERIALS_UNLIT:o[u]=new Fv;break;case Tt.KHR_DRACO_MESH_COMPRESSION:o[u]=new Jv(s,this.dracoLoader);break;case Tt.KHR_TEXTURE_TRANSFORM:o[u]=new ey;break;case Tt.KHR_MESH_QUANTIZATION:o[u]=new ty;break;default:d.indexOf(u)>=0&&a[u]===void 0&&console.warn('THREE.GLTFLoader: Unknown extension "'+u+'".')}}l.setExtensions(o),l.setPlugins(a),l.parse(n,r)}parseAsync(e,t){const n=this;return new Promise(function(r,s){n.parse(e,t,r,s)})}}function Iv(){let i={};return{get:function(e){return i[e]},add:function(e,t){i[e]=t},remove:function(e){delete i[e]},removeAll:function(){i={}}}}const Tt={KHR_BINARY_GLTF:"KHR_binary_glTF",KHR_DRACO_MESH_COMPRESSION:"KHR_draco_mesh_compression",KHR_LIGHTS_PUNCTUAL:"KHR_lights_punctual",KHR_MATERIALS_CLEARCOAT:"KHR_materials_clearcoat",KHR_MATERIALS_DISPERSION:"KHR_materials_dispersion",KHR_MATERIALS_IOR:"KHR_materials_ior",KHR_MATERIALS_SHEEN:"KHR_materials_sheen",KHR_MATERIALS_SPECULAR:"KHR_materials_specular",KHR_MATERIALS_TRANSMISSION:"KHR_materials_transmission",KHR_MATERIALS_IRIDESCENCE:"KHR_materials_iridescence",KHR_MATERIALS_ANISOTROPY:"KHR_materials_anisotropy",KHR_MATERIALS_UNLIT:"KHR_materials_unlit",KHR_MATERIALS_VOLUME:"KHR_materials_volume",KHR_TEXTURE_BASISU:"KHR_texture_basisu",KHR_TEXTURE_TRANSFORM:"KHR_texture_transform",KHR_MESH_QUANTIZATION:"KHR_mesh_quantization",KHR_MATERIALS_EMISSIVE_STRENGTH:"KHR_materials_emissive_strength",EXT_MATERIALS_BUMP:"EXT_materials_bump",EXT_TEXTURE_WEBP:"EXT_texture_webp",EXT_TEXTURE_AVIF:"EXT_texture_avif",EXT_MESHOPT_COMPRESSION:"EXT_meshopt_compression",EXT_MESH_GPU_INSTANCING:"EXT_mesh_gpu_instancing"};class Nv{constructor(e){this.parser=e,this.name=Tt.KHR_LIGHTS_PUNCTUAL,this.cache={refs:{},uses:{}}}_markDefs(){const e=this.parser,t=this.parser.json.nodes||[];for(let n=0,r=t.length;n<r;n++){const s=t[n];s.extensions&&s.extensions[this.name]&&s.extensions[this.name].light!==void 0&&e._addNodeRef(this.cache,s.extensions[this.name].light)}}_loadLight(e){const t=this.parser,n="light:"+e;let r=t.cache.get(n);if(r)return r;const s=t.json,c=((s.extensions&&s.extensions[this.name]||{}).lights||[])[e];let l;const h=new st(16777215);c.color!==void 0&&h.setRGB(c.color[0],c.color[1],c.color[2],Ln);const u=c.range!==void 0?c.range:0;switch(c.type){case"directional":l=new hs(h),l.target.position.set(0,0,-1),l.add(l.target);break;case"point":l=new Vd(h),l.distance=u;break;case"spot":l=new _x(h),l.distance=u,c.spot=c.spot||{},c.spot.innerConeAngle=c.spot.innerConeAngle!==void 0?c.spot.innerConeAngle:0,c.spot.outerConeAngle=c.spot.outerConeAngle!==void 0?c.spot.outerConeAngle:Math.PI/4,l.angle=c.spot.outerConeAngle,l.penumbra=1-c.spot.innerConeAngle/c.spot.outerConeAngle,l.target.position.set(0,0,-1),l.add(l.target);break;default:throw new Error("THREE.GLTFLoader: Unexpected light type: "+c.type)}return l.position.set(0,0,0),l.decay=2,Ui(l,c),c.intensity!==void 0&&(l.intensity=c.intensity),l.name=t.createUniqueName(c.name||"light_"+e),r=Promise.resolve(l),t.cache.add(n,r),r}getDependency(e,t){if(e==="light")return this._loadLight(t)}createNodeAttachment(e){const t=this,n=this.parser,s=n.json.nodes[e],a=(s.extensions&&s.extensions[this.name]||{}).light;return a===void 0?null:this._loadLight(a).then(function(c){return n._getNodeRef(t.cache,a,c)})}}class Fv{constructor(){this.name=Tt.KHR_MATERIALS_UNLIT}getMaterialType(){return Bi}extendParams(e,t,n){const r=[];e.color=new st(1,1,1),e.opacity=1;const s=t.pbrMetallicRoughness;if(s){if(Array.isArray(s.baseColorFactor)){const o=s.baseColorFactor;e.color.setRGB(o[0],o[1],o[2],Ln),e.opacity=o[3]}s.baseColorTexture!==void 0&&r.push(n.assignTexture(e,"map",s.baseColorTexture,ln))}return Promise.all(r)}}class Uv{constructor(e){this.parser=e,this.name=Tt.KHR_MATERIALS_EMISSIVE_STRENGTH}extendMaterialParams(e,t){const r=this.parser.json.materials[e];if(!r.extensions||!r.extensions[this.name])return Promise.resolve();const s=r.extensions[this.name].emissiveStrength;return s!==void 0&&(t.emissiveIntensity=s),Promise.resolve()}}class Ov{constructor(e){this.parser=e,this.name=Tt.KHR_MATERIALS_CLEARCOAT}getMaterialType(e){const n=this.parser.json.materials[e];return!n.extensions||!n.extensions[this.name]?null:Si}extendMaterialParams(e,t){const n=this.parser,r=n.json.materials[e];if(!r.extensions||!r.extensions[this.name])return Promise.resolve();const s=[],o=r.extensions[this.name];if(o.clearcoatFactor!==void 0&&(t.clearcoat=o.clearcoatFactor),o.clearcoatTexture!==void 0&&s.push(n.assignTexture(t,"clearcoatMap",o.clearcoatTexture)),o.clearcoatRoughnessFactor!==void 0&&(t.clearcoatRoughness=o.clearcoatRoughnessFactor),o.clearcoatRoughnessTexture!==void 0&&s.push(n.assignTexture(t,"clearcoatRoughnessMap",o.clearcoatRoughnessTexture)),o.clearcoatNormalTexture!==void 0&&(s.push(n.assignTexture(t,"clearcoatNormalMap",o.clearcoatNormalTexture)),o.clearcoatNormalTexture.scale!==void 0)){const a=o.clearcoatNormalTexture.scale;t.clearcoatNormalScale=new ht(a,a)}return Promise.all(s)}}class kv{constructor(e){this.parser=e,this.name=Tt.KHR_MATERIALS_DISPERSION}getMaterialType(e){const n=this.parser.json.materials[e];return!n.extensions||!n.extensions[this.name]?null:Si}extendMaterialParams(e,t){const r=this.parser.json.materials[e];if(!r.extensions||!r.extensions[this.name])return Promise.resolve();const s=r.extensions[this.name];return t.dispersion=s.dispersion!==void 0?s.dispersion:0,Promise.resolve()}}class Bv{constructor(e){this.parser=e,this.name=Tt.KHR_MATERIALS_IRIDESCENCE}getMaterialType(e){const n=this.parser.json.materials[e];return!n.extensions||!n.extensions[this.name]?null:Si}extendMaterialParams(e,t){const n=this.parser,r=n.json.materials[e];if(!r.extensions||!r.extensions[this.name])return Promise.resolve();const s=[],o=r.extensions[this.name];return o.iridescenceFactor!==void 0&&(t.iridescence=o.iridescenceFactor),o.iridescenceTexture!==void 0&&s.push(n.assignTexture(t,"iridescenceMap",o.iridescenceTexture)),o.iridescenceIor!==void 0&&(t.iridescenceIOR=o.iridescenceIor),t.iridescenceThicknessRange===void 0&&(t.iridescenceThicknessRange=[100,400]),o.iridescenceThicknessMinimum!==void 0&&(t.iridescenceThicknessRange[0]=o.iridescenceThicknessMinimum),o.iridescenceThicknessMaximum!==void 0&&(t.iridescenceThicknessRange[1]=o.iridescenceThicknessMaximum),o.iridescenceThicknessTexture!==void 0&&s.push(n.assignTexture(t,"iridescenceThicknessMap",o.iridescenceThicknessTexture)),Promise.all(s)}}class zv{constructor(e){this.parser=e,this.name=Tt.KHR_MATERIALS_SHEEN}getMaterialType(e){const n=this.parser.json.materials[e];return!n.extensions||!n.extensions[this.name]?null:Si}extendMaterialParams(e,t){const n=this.parser,r=n.json.materials[e];if(!r.extensions||!r.extensions[this.name])return Promise.resolve();const s=[];t.sheenColor=new st(0,0,0),t.sheenRoughness=0,t.sheen=1;const o=r.extensions[this.name];if(o.sheenColorFactor!==void 0){const a=o.sheenColorFactor;t.sheenColor.setRGB(a[0],a[1],a[2],Ln)}return o.sheenRoughnessFactor!==void 0&&(t.sheenRoughness=o.sheenRoughnessFactor),o.sheenColorTexture!==void 0&&s.push(n.assignTexture(t,"sheenColorMap",o.sheenColorTexture,ln)),o.sheenRoughnessTexture!==void 0&&s.push(n.assignTexture(t,"sheenRoughnessMap",o.sheenRoughnessTexture)),Promise.all(s)}}class Hv{constructor(e){this.parser=e,this.name=Tt.KHR_MATERIALS_TRANSMISSION}getMaterialType(e){const n=this.parser.json.materials[e];return!n.extensions||!n.extensions[this.name]?null:Si}extendMaterialParams(e,t){const n=this.parser,r=n.json.materials[e];if(!r.extensions||!r.extensions[this.name])return Promise.resolve();const s=[],o=r.extensions[this.name];return o.transmissionFactor!==void 0&&(t.transmission=o.transmissionFactor),o.transmissionTexture!==void 0&&s.push(n.assignTexture(t,"transmissionMap",o.transmissionTexture)),Promise.all(s)}}class Vv{constructor(e){this.parser=e,this.name=Tt.KHR_MATERIALS_VOLUME}getMaterialType(e){const n=this.parser.json.materials[e];return!n.extensions||!n.extensions[this.name]?null:Si}extendMaterialParams(e,t){const n=this.parser,r=n.json.materials[e];if(!r.extensions||!r.extensions[this.name])return Promise.resolve();const s=[],o=r.extensions[this.name];t.thickness=o.thicknessFactor!==void 0?o.thicknessFactor:0,o.thicknessTexture!==void 0&&s.push(n.assignTexture(t,"thicknessMap",o.thicknessTexture)),t.attenuationDistance=o.attenuationDistance||1/0;const a=o.attenuationColor||[1,1,1];return t.attenuationColor=new st().setRGB(a[0],a[1],a[2],Ln),Promise.all(s)}}class Gv{constructor(e){this.parser=e,this.name=Tt.KHR_MATERIALS_IOR}getMaterialType(e){const n=this.parser.json.materials[e];return!n.extensions||!n.extensions[this.name]?null:Si}extendMaterialParams(e,t){const r=this.parser.json.materials[e];if(!r.extensions||!r.extensions[this.name])return Promise.resolve();const s=r.extensions[this.name];return t.ior=s.ior!==void 0?s.ior:1.5,Promise.resolve()}}class Wv{constructor(e){this.parser=e,this.name=Tt.KHR_MATERIALS_SPECULAR}getMaterialType(e){const n=this.parser.json.materials[e];return!n.extensions||!n.extensions[this.name]?null:Si}extendMaterialParams(e,t){const n=this.parser,r=n.json.materials[e];if(!r.extensions||!r.extensions[this.name])return Promise.resolve();const s=[],o=r.extensions[this.name];t.specularIntensity=o.specularFactor!==void 0?o.specularFactor:1,o.specularTexture!==void 0&&s.push(n.assignTexture(t,"specularIntensityMap",o.specularTexture));const a=o.specularColorFactor||[1,1,1];return t.specularColor=new st().setRGB(a[0],a[1],a[2],Ln),o.specularColorTexture!==void 0&&s.push(n.assignTexture(t,"specularColorMap",o.specularColorTexture,ln)),Promise.all(s)}}class qv{constructor(e){this.parser=e,this.name=Tt.EXT_MATERIALS_BUMP}getMaterialType(e){const n=this.parser.json.materials[e];return!n.extensions||!n.extensions[this.name]?null:Si}extendMaterialParams(e,t){const n=this.parser,r=n.json.materials[e];if(!r.extensions||!r.extensions[this.name])return Promise.resolve();const s=[],o=r.extensions[this.name];return t.bumpScale=o.bumpFactor!==void 0?o.bumpFactor:1,o.bumpTexture!==void 0&&s.push(n.assignTexture(t,"bumpMap",o.bumpTexture)),Promise.all(s)}}class jv{constructor(e){this.parser=e,this.name=Tt.KHR_MATERIALS_ANISOTROPY}getMaterialType(e){const n=this.parser.json.materials[e];return!n.extensions||!n.extensions[this.name]?null:Si}extendMaterialParams(e,t){const n=this.parser,r=n.json.materials[e];if(!r.extensions||!r.extensions[this.name])return Promise.resolve();const s=[],o=r.extensions[this.name];return o.anisotropyStrength!==void 0&&(t.anisotropy=o.anisotropyStrength),o.anisotropyRotation!==void 0&&(t.anisotropyRotation=o.anisotropyRotation),o.anisotropyTexture!==void 0&&s.push(n.assignTexture(t,"anisotropyMap",o.anisotropyTexture)),Promise.all(s)}}class Xv{constructor(e){this.parser=e,this.name=Tt.KHR_TEXTURE_BASISU}loadTexture(e){const t=this.parser,n=t.json,r=n.textures[e];if(!r.extensions||!r.extensions[this.name])return null;const s=r.extensions[this.name],o=t.options.ktx2Loader;if(!o){if(n.extensionsRequired&&n.extensionsRequired.indexOf(this.name)>=0)throw new Error("THREE.GLTFLoader: setKTX2Loader must be called before loading KTX2 textures");return null}return t.loadTextureImage(e,s.source,o)}}class Qv{constructor(e){this.parser=e,this.name=Tt.EXT_TEXTURE_WEBP,this.isSupported=null}loadTexture(e){const t=this.name,n=this.parser,r=n.json,s=r.textures[e];if(!s.extensions||!s.extensions[t])return null;const o=s.extensions[t],a=r.images[o.source];let c=n.textureLoader;if(a.uri){const l=n.options.manager.getHandler(a.uri);l!==null&&(c=l)}return this.detectSupport().then(function(l){if(l)return n.loadTextureImage(e,o.source,c);if(r.extensionsRequired&&r.extensionsRequired.indexOf(t)>=0)throw new Error("THREE.GLTFLoader: WebP required by asset but unsupported.");return n.loadTexture(e)})}detectSupport(){return this.isSupported||(this.isSupported=new Promise(function(e){const t=new Image;t.src="data:image/webp;base64,UklGRiIAAABXRUJQVlA4IBYAAAAwAQCdASoBAAEADsD+JaQAA3AAAAAA",t.onload=t.onerror=function(){e(t.height===1)}})),this.isSupported}}class Kv{constructor(e){this.parser=e,this.name=Tt.EXT_TEXTURE_AVIF,this.isSupported=null}loadTexture(e){const t=this.name,n=this.parser,r=n.json,s=r.textures[e];if(!s.extensions||!s.extensions[t])return null;const o=s.extensions[t],a=r.images[o.source];let c=n.textureLoader;if(a.uri){const l=n.options.manager.getHandler(a.uri);l!==null&&(c=l)}return this.detectSupport().then(function(l){if(l)return n.loadTextureImage(e,o.source,c);if(r.extensionsRequired&&r.extensionsRequired.indexOf(t)>=0)throw new Error("THREE.GLTFLoader: AVIF required by asset but unsupported.");return n.loadTexture(e)})}detectSupport(){return this.isSupported||(this.isSupported=new Promise(function(e){const t=new Image;t.src="data:image/avif;base64,AAAAIGZ0eXBhdmlmAAAAAGF2aWZtaWYxbWlhZk1BMUIAAADybWV0YQAAAAAAAAAoaGRscgAAAAAAAAAAcGljdAAAAAAAAAAAAAAAAGxpYmF2aWYAAAAADnBpdG0AAAAAAAEAAAAeaWxvYwAAAABEAAABAAEAAAABAAABGgAAABcAAAAoaWluZgAAAAAAAQAAABppbmZlAgAAAAABAABhdjAxQ29sb3IAAAAAamlwcnAAAABLaXBjbwAAABRpc3BlAAAAAAAAAAEAAAABAAAAEHBpeGkAAAAAAwgICAAAAAxhdjFDgQAMAAAAABNjb2xybmNseAACAAIABoAAAAAXaXBtYQAAAAAAAAABAAEEAQKDBAAAAB9tZGF0EgAKCBgABogQEDQgMgkQAAAAB8dSLfI=",t.onload=t.onerror=function(){e(t.height===1)}})),this.isSupported}}class Yv{constructor(e){this.name=Tt.EXT_MESHOPT_COMPRESSION,this.parser=e}loadBufferView(e){const t=this.parser.json,n=t.bufferViews[e];if(n.extensions&&n.extensions[this.name]){const r=n.extensions[this.name],s=this.parser.getDependency("buffer",r.buffer),o=this.parser.options.meshoptDecoder;if(!o||!o.supported){if(t.extensionsRequired&&t.extensionsRequired.indexOf(this.name)>=0)throw new Error("THREE.GLTFLoader: setMeshoptDecoder must be called before loading compressed files");return null}return s.then(function(a){const c=r.byteOffset||0,l=r.byteLength||0,h=r.count,u=r.byteStride,d=new Uint8Array(a,c,l);return o.decodeGltfBufferAsync?o.decodeGltfBufferAsync(h,u,d,r.mode,r.filter).then(function(p){return p.buffer}):o.ready.then(function(){const p=new ArrayBuffer(h*u);return o.decodeGltfBuffer(new Uint8Array(p),h,u,d,r.mode,r.filter),p})})}else return null}}class $v{constructor(e){this.name=Tt.EXT_MESH_GPU_INSTANCING,this.parser=e}createNodeMesh(e){const t=this.parser.json,n=t.nodes[e];if(!n.extensions||!n.extensions[this.name]||n.mesh===void 0)return null;const r=t.meshes[n.mesh];for(const l of r.primitives)if(l.mode!==$n.TRIANGLES&&l.mode!==$n.TRIANGLE_STRIP&&l.mode!==$n.TRIANGLE_FAN&&l.mode!==void 0)return null;const o=n.extensions[this.name].attributes,a=[],c={};for(const l in o)a.push(this.parser.getDependency("accessor",o[l]).then(h=>(c[l]=h,c[l])));return a.length<1?null:(a.push(this.parser.createNodeMesh(e)),Promise.all(a).then(l=>{const h=l.pop(),u=h.isGroup?h.children:[h],d=l[0].count,p=[];for(const g of u){const b=new ot,m=new A,f=new qe,M=new A(1,1,1),x=new $_(g.geometry,g.material,d);for(let _=0;_<d;_++)c.TRANSLATION&&m.fromBufferAttribute(c.TRANSLATION,_),c.ROTATION&&f.fromBufferAttribute(c.ROTATION,_),c.SCALE&&M.fromBufferAttribute(c.SCALE,_),x.setMatrixAt(_,b.compose(m,f,M));for(const _ in c)if(_==="_COLOR_0"){const I=c[_];x.instanceColor=new Sl(I.array,I.itemSize,I.normalized)}else _!=="TRANSLATION"&&_!=="ROTATION"&&_!=="SCALE"&&g.geometry.setAttribute(_,c[_]);en.prototype.copy.call(x,g),this.parser.assignFinalMaterial(x),p.push(x)}return h.isGroup?(h.clear(),h.add(...p),h):p[0]}))}}const ef="glTF",Xs=12,Xu={JSON:1313821514,BIN:5130562};class Zv{constructor(e){this.name=Tt.KHR_BINARY_GLTF,this.content=null,this.body=null;const t=new DataView(e,0,Xs),n=new TextDecoder;if(this.header={magic:n.decode(new Uint8Array(e.slice(0,4))),version:t.getUint32(4,!0),length:t.getUint32(8,!0)},this.header.magic!==ef)throw new Error("THREE.GLTFLoader: Unsupported glTF-Binary header.");if(this.header.version<2)throw new Error("THREE.GLTFLoader: Legacy binary file detected.");const r=this.header.length-Xs,s=new DataView(e,Xs);let o=0;for(;o<r;){const a=s.getUint32(o,!0);o+=4;const c=s.getUint32(o,!0);if(o+=4,c===Xu.JSON){const l=new Uint8Array(e,Xs+o,a);this.content=n.decode(l)}else if(c===Xu.BIN){const l=Xs+o;this.body=e.slice(l,l+a)}o+=a}if(this.content===null)throw new Error("THREE.GLTFLoader: JSON content not found.")}}class Jv{constructor(e,t){if(!t)throw new Error("THREE.GLTFLoader: No DRACOLoader instance provided.");this.name=Tt.KHR_DRACO_MESH_COMPRESSION,this.json=e,this.dracoLoader=t,this.dracoLoader.preload()}decodePrimitive(e,t){const n=this.json,r=this.dracoLoader,s=e.extensions[this.name].bufferView,o=e.extensions[this.name].attributes,a={},c={},l={};for(const h in o){const u=Dl[h]||h.toLowerCase();a[u]=o[h]}for(const h in e.attributes){const u=Dl[h]||h.toLowerCase();if(o[h]!==void 0){const d=n.accessors[e.attributes[h]],p=fs[d.componentType];l[u]=p.name,c[u]=d.normalized===!0}}return t.getDependency("bufferView",s).then(function(h){return new Promise(function(u,d){r.decodeDracoFile(h,function(p){for(const g in p.attributes){const b=p.attributes[g],m=c[g];m!==void 0&&(b.normalized=m)}u(p)},a,l,Ln,d)})})}}class ey{constructor(){this.name=Tt.KHR_TEXTURE_TRANSFORM}extendTexture(e,t){return(t.texCoord===void 0||t.texCoord===e.channel)&&t.offset===void 0&&t.rotation===void 0&&t.scale===void 0||(e=e.clone(),t.texCoord!==void 0&&(e.channel=t.texCoord),t.offset!==void 0&&e.offset.fromArray(t.offset),t.rotation!==void 0&&(e.rotation=t.rotation),t.scale!==void 0&&e.repeat.fromArray(t.scale),e.needsUpdate=!0),e}}class ty{constructor(){this.name=Tt.KHR_MESH_QUANTIZATION}}class tf extends uo{constructor(e,t,n,r){super(e,t,n,r)}copySampleValue_(e){const t=this.resultBuffer,n=this.sampleValues,r=this.valueSize,s=e*r*3+r;for(let o=0;o!==r;o++)t[o]=n[s+o];return t}interpolate_(e,t,n,r){const s=this.resultBuffer,o=this.sampleValues,a=this.valueSize,c=a*2,l=a*3,h=r-t,u=(n-t)/h,d=u*u,p=d*u,g=e*l,b=g-l,m=-2*p+3*d,f=p-d,M=1-m,x=f-d+u;for(let _=0;_!==a;_++){const I=o[b+_+a],R=o[b+_+c]*h,T=o[g+_+a],F=o[g+_]*h;s[_]=M*I+x*R+m*T+f*F}return s}}const ny=new qe;class iy extends tf{interpolate_(e,t,n,r){const s=super.interpolate_(e,t,n,r);return ny.fromArray(s).normalize().toArray(s),s}}const $n={POINTS:0,LINES:1,LINE_LOOP:2,LINE_STRIP:3,TRIANGLES:4,TRIANGLE_STRIP:5,TRIANGLE_FAN:6},fs={5120:Int8Array,5121:Uint8Array,5122:Int16Array,5123:Uint16Array,5125:Uint32Array,5126:Float32Array},Qu={9728:Pn,9729:jn,9984:ad,9985:na,9986:Ks,9987:Oi},Ku={33071:or,33648:ma,10497:xs},Rc={SCALAR:1,VEC2:2,VEC3:3,VEC4:4,MAT2:4,MAT3:9,MAT4:16},Dl={POSITION:"position",NORMAL:"normal",TANGENT:"tangent",TEXCOORD_0:"uv",TEXCOORD_1:"uv1",TEXCOORD_2:"uv2",TEXCOORD_3:"uv3",COLOR_0:"color",WEIGHTS_0:"skinWeight",JOINTS_0:"skinIndex"},tr={scale:"scale",translation:"position",rotation:"quaternion",weights:"morphTargetInfluences"},ry={CUBICSPLINE:void 0,LINEAR:so,STEP:ro},Cc={OPAQUE:"OPAQUE",MASK:"MASK",BLEND:"BLEND"};function sy(i){return i.DefaultMaterial===void 0&&(i.DefaultMaterial=new Fr({color:16777215,emissive:0,metalness:1,roughness:1,transparent:!1,depthTest:!0,side:Wi})),i.DefaultMaterial}function Er(i,e,t){for(const n in t.extensions)i[n]===void 0&&(e.userData.gltfExtensions=e.userData.gltfExtensions||{},e.userData.gltfExtensions[n]=t.extensions[n])}function Ui(i,e){e.extras!==void 0&&(typeof e.extras=="object"?Object.assign(i.userData,e.extras):console.warn("THREE.GLTFLoader: Ignoring primitive type .extras, "+e.extras))}function oy(i,e,t){let n=!1,r=!1,s=!1;for(let l=0,h=e.length;l<h;l++){const u=e[l];if(u.POSITION!==void 0&&(n=!0),u.NORMAL!==void 0&&(r=!0),u.COLOR_0!==void 0&&(s=!0),n&&r&&s)break}if(!n&&!r&&!s)return Promise.resolve(i);const o=[],a=[],c=[];for(let l=0,h=e.length;l<h;l++){const u=e[l];if(n){const d=u.POSITION!==void 0?t.getDependency("accessor",u.POSITION):i.attributes.position;o.push(d)}if(r){const d=u.NORMAL!==void 0?t.getDependency("accessor",u.NORMAL):i.attributes.normal;a.push(d)}if(s){const d=u.COLOR_0!==void 0?t.getDependency("accessor",u.COLOR_0):i.attributes.color;c.push(d)}}return Promise.all([Promise.all(o),Promise.all(a),Promise.all(c)]).then(function(l){const h=l[0],u=l[1],d=l[2];return n&&(i.morphAttributes.position=h),r&&(i.morphAttributes.normal=u),s&&(i.morphAttributes.color=d),i.morphTargetsRelative=!0,i})}function ay(i,e){if(i.updateMorphTargets(),e.weights!==void 0)for(let t=0,n=e.weights.length;t<n;t++)i.morphTargetInfluences[t]=e.weights[t];if(e.extras&&Array.isArray(e.extras.targetNames)){const t=e.extras.targetNames;if(i.morphTargetInfluences.length===t.length){i.morphTargetDictionary={};for(let n=0,r=t.length;n<r;n++)i.morphTargetDictionary[t[n]]=n}else console.warn("THREE.GLTFLoader: Invalid extras.targetNames length. Ignoring names.")}}function cy(i){let e;const t=i.extensions&&i.extensions[Tt.KHR_DRACO_MESH_COMPRESSION];if(t?e="draco:"+t.bufferView+":"+t.indices+":"+Pc(t.attributes):e=i.indices+":"+Pc(i.attributes)+":"+i.mode,i.targets!==void 0)for(let n=0,r=i.targets.length;n<r;n++)e+=":"+Pc(i.targets[n]);return e}function Pc(i){let e="";const t=Object.keys(i).sort();for(let n=0,r=t.length;n<r;n++)e+=t[n]+":"+i[t[n]]+";";return e}function Il(i){switch(i){case Int8Array:return 1/127;case Uint8Array:return 1/255;case Int16Array:return 1/32767;case Uint16Array:return 1/65535;default:throw new Error("THREE.GLTFLoader: Unsupported normalized accessor component type.")}}function ly(i){return i.search(/\.jpe?g($|\?)/i)>0||i.search(/^data\:image\/jpeg/)===0?"image/jpeg":i.search(/\.webp($|\?)/i)>0||i.search(/^data\:image\/webp/)===0?"image/webp":i.search(/\.ktx2($|\?)/i)>0||i.search(/^data\:image\/ktx2/)===0?"image/ktx2":"image/png"}const hy=new ot;class uy{constructor(e={},t={}){this.json=e,this.extensions={},this.plugins={},this.options=t,this.cache=new Iv,this.associations=new Map,this.primitiveCache={},this.nodeCache={},this.meshCache={refs:{},uses:{}},this.cameraCache={refs:{},uses:{}},this.lightCache={refs:{},uses:{}},this.sourceCache={},this.textureCache={},this.nodeNamesUsed={};let n=!1,r=-1,s=!1,o=-1;if(typeof navigator<"u"){const a=navigator.userAgent;n=/^((?!chrome|android).)*safari/i.test(a)===!0;const c=a.match(/Version\/(\d+)/);r=n&&c?parseInt(c[1],10):-1,s=a.indexOf("Firefox")>-1,o=s?a.match(/Firefox\/([0-9]+)\./)[1]:-1}typeof createImageBitmap>"u"||n&&r<17||s&&o<98?this.textureLoader=new gx(this.options.manager):this.textureLoader=new yx(this.options.manager),this.textureLoader.setCrossOrigin(this.options.crossOrigin),this.textureLoader.setRequestHeader(this.options.requestHeader),this.fileLoader=new zd(this.options.manager),this.fileLoader.setResponseType("arraybuffer"),this.options.crossOrigin==="use-credentials"&&this.fileLoader.setWithCredentials(!0)}setExtensions(e){this.extensions=e}setPlugins(e){this.plugins=e}parse(e,t){const n=this,r=this.json,s=this.extensions;this.cache.removeAll(),this.nodeCache={},this._invokeAll(function(o){return o._markDefs&&o._markDefs()}),Promise.all(this._invokeAll(function(o){return o.beforeRoot&&o.beforeRoot()})).then(function(){return Promise.all([n.getDependencies("scene"),n.getDependencies("animation"),n.getDependencies("camera")])}).then(function(o){const a={scene:o[0][r.scene||0],scenes:o[0],animations:o[1],cameras:o[2],asset:r.asset,parser:n,userData:{}};return Er(s,a,r),Ui(a,r),Promise.all(n._invokeAll(function(c){return c.afterRoot&&c.afterRoot(a)})).then(function(){for(const c of a.scenes)c.updateMatrixWorld();e(a)})}).catch(t)}_markDefs(){const e=this.json.nodes||[],t=this.json.skins||[],n=this.json.meshes||[];for(let r=0,s=t.length;r<s;r++){const o=t[r].joints;for(let a=0,c=o.length;a<c;a++)e[o[a]].isBone=!0}for(let r=0,s=e.length;r<s;r++){const o=e[r];o.mesh!==void 0&&(this._addNodeRef(this.meshCache,o.mesh),o.skin!==void 0&&(n[o.mesh].isSkinnedMesh=!0)),o.camera!==void 0&&this._addNodeRef(this.cameraCache,o.camera)}}_addNodeRef(e,t){t!==void 0&&(e.refs[t]===void 0&&(e.refs[t]=e.uses[t]=0),e.refs[t]++)}_getNodeRef(e,t,n){if(e.refs[t]<=1)return n;const r=n.clone(),s=(o,a)=>{const c=this.associations.get(o);c!=null&&this.associations.set(a,c);for(const[l,h]of o.children.entries())s(h,a.children[l])};return s(n,r),r.name+="_instance_"+e.uses[t]++,r}_invokeOne(e){const t=Object.values(this.plugins);t.push(this);for(let n=0;n<t.length;n++){const r=e(t[n]);if(r)return r}return null}_invokeAll(e){const t=Object.values(this.plugins);t.unshift(this);const n=[];for(let r=0;r<t.length;r++){const s=e(t[r]);s&&n.push(s)}return n}getDependency(e,t){const n=e+":"+t;let r=this.cache.get(n);if(!r){switch(e){case"scene":r=this.loadScene(t);break;case"node":r=this._invokeOne(function(s){return s.loadNode&&s.loadNode(t)});break;case"mesh":r=this._invokeOne(function(s){return s.loadMesh&&s.loadMesh(t)});break;case"accessor":r=this.loadAccessor(t);break;case"bufferView":r=this._invokeOne(function(s){return s.loadBufferView&&s.loadBufferView(t)});break;case"buffer":r=this.loadBuffer(t);break;case"material":r=this._invokeOne(function(s){return s.loadMaterial&&s.loadMaterial(t)});break;case"texture":r=this._invokeOne(function(s){return s.loadTexture&&s.loadTexture(t)});break;case"skin":r=this.loadSkin(t);break;case"animation":r=this._invokeOne(function(s){return s.loadAnimation&&s.loadAnimation(t)});break;case"camera":r=this.loadCamera(t);break;default:if(r=this._invokeOne(function(s){return s!=this&&s.getDependency&&s.getDependency(e,t)}),!r)throw new Error("Unknown type: "+e);break}this.cache.add(n,r)}return r}getDependencies(e){let t=this.cache.get(e);if(!t){const n=this,r=this.json[e+(e==="mesh"?"es":"s")]||[];t=Promise.all(r.map(function(s,o){return n.getDependency(e,o)})),this.cache.add(e,t)}return t}loadBuffer(e){const t=this.json.buffers[e],n=this.fileLoader;if(t.type&&t.type!=="arraybuffer")throw new Error("THREE.GLTFLoader: "+t.type+" buffer type is not supported.");if(t.uri===void 0&&e===0)return Promise.resolve(this.extensions[Tt.KHR_BINARY_GLTF].body);const r=this.options;return new Promise(function(s,o){n.load(eo.resolveURL(t.uri,r.path),s,void 0,function(){o(new Error('THREE.GLTFLoader: Failed to load buffer "'+t.uri+'".'))})})}loadBufferView(e){const t=this.json.bufferViews[e];return this.getDependency("buffer",t.buffer).then(function(n){const r=t.byteLength||0,s=t.byteOffset||0;return n.slice(s,s+r)})}loadAccessor(e){const t=this,n=this.json,r=this.json.accessors[e];if(r.bufferView===void 0&&r.sparse===void 0){const o=Rc[r.type],a=fs[r.componentType],c=r.normalized===!0,l=new a(r.count*o);return Promise.resolve(new wn(l,o,c))}const s=[];return r.bufferView!==void 0?s.push(this.getDependency("bufferView",r.bufferView)):s.push(null),r.sparse!==void 0&&(s.push(this.getDependency("bufferView",r.sparse.indices.bufferView)),s.push(this.getDependency("bufferView",r.sparse.values.bufferView))),Promise.all(s).then(function(o){const a=o[0],c=Rc[r.type],l=fs[r.componentType],h=l.BYTES_PER_ELEMENT,u=h*c,d=r.byteOffset||0,p=r.bufferView!==void 0?n.bufferViews[r.bufferView].byteStride:void 0,g=r.normalized===!0;let b,m;if(p&&p!==u){const f=Math.floor(d/p),M="InterleavedBuffer:"+r.bufferView+":"+r.componentType+":"+f+":"+r.count;let x=t.cache.get(M);x||(b=new l(a,f*p,r.count*p/h),x=new j_(b,p/h),t.cache.add(M,x)),m=new $l(x,c,d%p/h,g)}else a===null?b=new l(r.count*c):b=new l(a,d,r.count*c),m=new wn(b,c,g);if(r.sparse!==void 0){const f=Rc.SCALAR,M=fs[r.sparse.indices.componentType],x=r.sparse.indices.byteOffset||0,_=r.sparse.values.byteOffset||0,I=new M(o[1],x,r.sparse.count*f),R=new l(o[2],_,r.sparse.count*c);a!==null&&(m=new wn(m.array.slice(),m.itemSize,m.normalized)),m.normalized=!1;for(let T=0,F=I.length;T<F;T++){const S=I[T];if(m.setX(S,R[T*c]),c>=2&&m.setY(S,R[T*c+1]),c>=3&&m.setZ(S,R[T*c+2]),c>=4&&m.setW(S,R[T*c+3]),c>=5)throw new Error("THREE.GLTFLoader: Unsupported itemSize in sparse BufferAttribute.")}m.normalized=g}return m})}loadTexture(e){const t=this.json,n=this.options,s=t.textures[e].source,o=t.images[s];let a=this.textureLoader;if(o.uri){const c=n.manager.getHandler(o.uri);c!==null&&(a=c)}return this.loadTextureImage(e,s,a)}loadTextureImage(e,t,n){const r=this,s=this.json,o=s.textures[e],a=s.images[t],c=(a.uri||a.bufferView)+":"+o.sampler;if(this.textureCache[c])return this.textureCache[c];const l=this.loadImageSource(t,n).then(function(h){h.flipY=!1,h.name=o.name||a.name||"",h.name===""&&typeof a.uri=="string"&&a.uri.startsWith("data:image/")===!1&&(h.name=a.uri);const d=(s.samplers||{})[o.sampler]||{};return h.magFilter=Qu[d.magFilter]||jn,h.minFilter=Qu[d.minFilter]||Oi,h.wrapS=Ku[d.wrapS]||xs,h.wrapT=Ku[d.wrapT]||xs,h.generateMipmaps=!h.isCompressedTexture&&h.minFilter!==Pn&&h.minFilter!==jn,r.associations.set(h,{textures:e}),h}).catch(function(){return null});return this.textureCache[c]=l,l}loadImageSource(e,t){const n=this,r=this.json,s=this.options;if(this.sourceCache[e]!==void 0)return this.sourceCache[e].then(u=>u.clone());const o=r.images[e],a=self.URL||self.webkitURL;let c=o.uri||"",l=!1;if(o.bufferView!==void 0)c=n.getDependency("bufferView",o.bufferView).then(function(u){l=!0;const d=new Blob([u],{type:o.mimeType});return c=a.createObjectURL(d),c});else if(o.uri===void 0)throw new Error("THREE.GLTFLoader: Image "+e+" is missing URI and bufferView");const h=Promise.resolve(c).then(function(u){return new Promise(function(d,p){let g=d;t.isImageBitmapLoader===!0&&(g=function(b){const m=new hn(b);m.needsUpdate=!0,d(m)}),t.load(eo.resolveURL(u,s.path),g,void 0,p)})}).then(function(u){return l===!0&&a.revokeObjectURL(c),Ui(u,o),u.userData.mimeType=o.mimeType||ly(o.uri),u}).catch(function(u){throw console.error("THREE.GLTFLoader: Couldn't load texture",c),u});return this.sourceCache[e]=h,h}assignTexture(e,t,n,r){const s=this;return this.getDependency("texture",n.index).then(function(o){if(!o)return null;if(n.texCoord!==void 0&&n.texCoord>0&&(o=o.clone(),o.channel=n.texCoord),s.extensions[Tt.KHR_TEXTURE_TRANSFORM]){const a=n.extensions!==void 0?n.extensions[Tt.KHR_TEXTURE_TRANSFORM]:void 0;if(a){const c=s.associations.get(o);o=s.extensions[Tt.KHR_TEXTURE_TRANSFORM].extendTexture(o,a),s.associations.set(o,c)}}return r!==void 0&&(o.colorSpace=r),e[t]=o,o})}assignFinalMaterial(e){const t=e.geometry;let n=e.material;const r=t.attributes.tangent===void 0,s=t.attributes.color!==void 0,o=t.attributes.normal===void 0;if(e.isPoints){const a="PointsMaterial:"+n.uuid;let c=this.cache.get(a);c||(c=new Od,di.prototype.copy.call(c,n),c.color.copy(n.color),c.map=n.map,c.sizeAttenuation=!1,this.cache.add(a,c)),n=c}else if(e.isLine){const a="LineBasicMaterial:"+n.uuid;let c=this.cache.get(a);c||(c=new Ud,di.prototype.copy.call(c,n),c.color.copy(n.color),c.map=n.map,this.cache.add(a,c)),n=c}if(r||s||o){let a="ClonedMaterial:"+n.uuid+":";r&&(a+="derivative-tangents:"),s&&(a+="vertex-colors:"),o&&(a+="flat-shading:");let c=this.cache.get(a);c||(c=n.clone(),s&&(c.vertexColors=!0),o&&(c.flatShading=!0),r&&(c.normalScale&&(c.normalScale.y*=-1),c.clearcoatNormalScale&&(c.clearcoatNormalScale.y*=-1)),this.cache.add(a,c),this.associations.set(c,this.associations.get(n))),n=c}e.material=n}getMaterialType(){return Fr}loadMaterial(e){const t=this,n=this.json,r=this.extensions,s=n.materials[e];let o;const a={},c=s.extensions||{},l=[];if(c[Tt.KHR_MATERIALS_UNLIT]){const u=r[Tt.KHR_MATERIALS_UNLIT];o=u.getMaterialType(),l.push(u.extendParams(a,s,t))}else{const u=s.pbrMetallicRoughness||{};if(a.color=new st(1,1,1),a.opacity=1,Array.isArray(u.baseColorFactor)){const d=u.baseColorFactor;a.color.setRGB(d[0],d[1],d[2],Ln),a.opacity=d[3]}u.baseColorTexture!==void 0&&l.push(t.assignTexture(a,"map",u.baseColorTexture,ln)),a.metalness=u.metallicFactor!==void 0?u.metallicFactor:1,a.roughness=u.roughnessFactor!==void 0?u.roughnessFactor:1,u.metallicRoughnessTexture!==void 0&&(l.push(t.assignTexture(a,"metalnessMap",u.metallicRoughnessTexture)),l.push(t.assignTexture(a,"roughnessMap",u.metallicRoughnessTexture))),o=this._invokeOne(function(d){return d.getMaterialType&&d.getMaterialType(e)}),l.push(Promise.all(this._invokeAll(function(d){return d.extendMaterialParams&&d.extendMaterialParams(e,a)})))}s.doubleSided===!0&&(a.side=xi);const h=s.alphaMode||Cc.OPAQUE;if(h===Cc.BLEND?(a.transparent=!0,a.depthWrite=!1):(a.transparent=!1,h===Cc.MASK&&(a.alphaTest=s.alphaCutoff!==void 0?s.alphaCutoff:.5)),s.normalTexture!==void 0&&o!==Bi&&(l.push(t.assignTexture(a,"normalMap",s.normalTexture)),a.normalScale=new ht(1,1),s.normalTexture.scale!==void 0)){const u=s.normalTexture.scale;a.normalScale.set(u,u)}if(s.occlusionTexture!==void 0&&o!==Bi&&(l.push(t.assignTexture(a,"aoMap",s.occlusionTexture)),s.occlusionTexture.strength!==void 0&&(a.aoMapIntensity=s.occlusionTexture.strength)),s.emissiveFactor!==void 0&&o!==Bi){const u=s.emissiveFactor;a.emissive=new st().setRGB(u[0],u[1],u[2],Ln)}return s.emissiveTexture!==void 0&&o!==Bi&&l.push(t.assignTexture(a,"emissiveMap",s.emissiveTexture,ln)),Promise.all(l).then(function(){const u=new o(a);return s.name&&(u.name=s.name),Ui(u,s),t.associations.set(u,{materials:e}),s.extensions&&Er(r,u,s),u})}createUniqueName(e){const t=Vt.sanitizeNodeName(e||"");return t in this.nodeNamesUsed?t+"_"+ ++this.nodeNamesUsed[t]:(this.nodeNamesUsed[t]=0,t)}loadGeometries(e){const t=this,n=this.extensions,r=this.primitiveCache;function s(a){return n[Tt.KHR_DRACO_MESH_COMPRESSION].decodePrimitive(a,t).then(function(c){return Yu(c,a,t)})}const o=[];for(let a=0,c=e.length;a<c;a++){const l=e[a],h=cy(l),u=r[h];if(u)o.push(u.promise);else{let d;l.extensions&&l.extensions[Tt.KHR_DRACO_MESH_COMPRESSION]?d=s(l):d=Yu(new Mi,l,t),r[h]={primitive:l,promise:d},o.push(d)}}return Promise.all(o)}loadMesh(e){const t=this,n=this.json,r=this.extensions,s=n.meshes[e],o=s.primitives,a=[];for(let c=0,l=o.length;c<l;c++){const h=o[c].material===void 0?sy(this.cache):this.getDependency("material",o[c].material);a.push(h)}return a.push(t.loadGeometries(o)),Promise.all(a).then(function(c){const l=c.slice(0,c.length-1),h=c[c.length-1],u=[];for(let p=0,g=h.length;p<g;p++){const b=h[p],m=o[p];let f;const M=l[p];if(m.mode===$n.TRIANGLES||m.mode===$n.TRIANGLE_STRIP||m.mode===$n.TRIANGLE_FAN||m.mode===void 0)f=s.isSkinnedMesh===!0?new Q_(b,M):new Xt(b,M),f.isSkinnedMesh===!0&&f.normalizeSkinWeights(),m.mode===$n.TRIANGLE_STRIP?f.geometry=ju(f.geometry,bd):m.mode===$n.TRIANGLE_FAN&&(f.geometry=ju(f.geometry,xl));else if(m.mode===$n.LINES)f=new Z_(b,M);else if(m.mode===$n.LINE_STRIP)f=new Jl(b,M);else if(m.mode===$n.LINE_LOOP)f=new J_(b,M);else if(m.mode===$n.POINTS)f=new ex(b,M);else throw new Error("THREE.GLTFLoader: Primitive mode unsupported: "+m.mode);Object.keys(f.geometry.morphAttributes).length>0&&ay(f,s),f.name=t.createUniqueName(s.name||"mesh_"+e),Ui(f,s),m.extensions&&Er(r,f,m),t.assignFinalMaterial(f),u.push(f)}for(let p=0,g=u.length;p<g;p++)t.associations.set(u[p],{meshes:e,primitives:p});if(u.length===1)return s.extensions&&Er(r,u[0],s),u[0];const d=new Dr;s.extensions&&Er(r,d,s),t.associations.set(d,{meshes:e});for(let p=0,g=u.length;p<g;p++)d.add(u[p]);return d})}loadCamera(e){let t;const n=this.json.cameras[e],r=n[n.type];if(!r){console.warn("THREE.GLTFLoader: Missing camera parameters.");return}return n.type==="perspective"?t=new vn(Nt.radToDeg(r.yfov),r.aspectRatio||1,r.znear||1,r.zfar||2e6):n.type==="orthographic"&&(t=new Ql(-r.xmag,r.xmag,r.ymag,-r.ymag,r.znear,r.zfar)),n.name&&(t.name=this.createUniqueName(n.name)),Ui(t,n),Promise.resolve(t)}loadSkin(e){const t=this.json.skins[e],n=[];for(let r=0,s=t.joints.length;r<s;r++)n.push(this._loadNodeShallow(t.joints[r]));return t.inverseBindMatrices!==void 0?n.push(this.getDependency("accessor",t.inverseBindMatrices)):n.push(null),Promise.all(n).then(function(r){const s=r.pop(),o=r,a=[],c=[];for(let l=0,h=o.length;l<h;l++){const u=o[l];if(u){a.push(u);const d=new ot;s!==null&&d.fromArray(s.array,l*16),c.push(d)}else console.warn('THREE.GLTFLoader: Joint "%s" could not be found.',t.joints[l])}return new Ca(a,c)})}loadAnimation(e){const t=this.json,n=this,r=t.animations[e],s=r.name?r.name:"animation_"+e,o=[],a=[],c=[],l=[],h=[];for(let u=0,d=r.channels.length;u<d;u++){const p=r.channels[u],g=r.samplers[p.sampler],b=p.target,m=b.node,f=r.parameters!==void 0?r.parameters[g.input]:g.input,M=r.parameters!==void 0?r.parameters[g.output]:g.output;b.node!==void 0&&(o.push(this.getDependency("node",m)),a.push(this.getDependency("accessor",f)),c.push(this.getDependency("accessor",M)),l.push(g),h.push(b))}return Promise.all([Promise.all(o),Promise.all(a),Promise.all(c),Promise.all(l),Promise.all(h)]).then(function(u){const d=u[0],p=u[1],g=u[2],b=u[3],m=u[4],f=[];for(let M=0,x=d.length;M<x;M++){const _=d[M],I=p[M],R=g[M],T=b[M],F=m[M];if(_===void 0)continue;_.updateMatrix&&_.updateMatrix();const S=n._createAnimationTracks(_,I,R,T,F);if(S)for(let v=0;v<S.length;v++)f.push(S[v])}return new lx(s,void 0,f)})}createNodeMesh(e){const t=this.json,n=this,r=t.nodes[e];return r.mesh===void 0?null:n.getDependency("mesh",r.mesh).then(function(s){const o=n._getNodeRef(n.meshCache,r.mesh,s);return r.weights!==void 0&&o.traverse(function(a){if(a.isMesh)for(let c=0,l=r.weights.length;c<l;c++)a.morphTargetInfluences[c]=r.weights[c]}),o})}loadNode(e){const t=this.json,n=this,r=t.nodes[e],s=n._loadNodeShallow(e),o=[],a=r.children||[];for(let l=0,h=a.length;l<h;l++)o.push(n.getDependency("node",a[l]));const c=r.skin===void 0?Promise.resolve(null):n.getDependency("skin",r.skin);return Promise.all([s,Promise.all(o),c]).then(function(l){const h=l[0],u=l[1],d=l[2];d!==null&&h.traverse(function(p){p.isSkinnedMesh&&p.bind(d,hy)});for(let p=0,g=u.length;p<g;p++)h.add(u[p]);return h})}_loadNodeShallow(e){const t=this.json,n=this.extensions,r=this;if(this.nodeCache[e]!==void 0)return this.nodeCache[e];const s=t.nodes[e],o=s.name?r.createUniqueName(s.name):"",a=[],c=r._invokeOne(function(l){return l.createNodeMesh&&l.createNodeMesh(e)});return c&&a.push(c),s.camera!==void 0&&a.push(r.getDependency("camera",s.camera).then(function(l){return r._getNodeRef(r.cameraCache,s.camera,l)})),r._invokeAll(function(l){return l.createNodeAttachment&&l.createNodeAttachment(e)}).forEach(function(l){a.push(l)}),this.nodeCache[e]=Promise.all(a).then(function(l){let h;if(s.isBone===!0?h=new Zl:l.length>1?h=new Dr:l.length===1?h=l[0]:h=new en,h!==l[0])for(let u=0,d=l.length;u<d;u++)h.add(l[u]);if(s.name&&(h.userData.name=s.name,h.name=o),Ui(h,s),s.extensions&&Er(n,h,s),s.matrix!==void 0){const u=new ot;u.fromArray(s.matrix),h.applyMatrix4(u)}else s.translation!==void 0&&h.position.fromArray(s.translation),s.rotation!==void 0&&h.quaternion.fromArray(s.rotation),s.scale!==void 0&&h.scale.fromArray(s.scale);return r.associations.has(h)||r.associations.set(h,{}),r.associations.get(h).nodes=e,h}),this.nodeCache[e]}loadScene(e){const t=this.extensions,n=this.json.scenes[e],r=this,s=new Dr;n.name&&(s.name=r.createUniqueName(n.name)),Ui(s,n),n.extensions&&Er(t,s,n);const o=n.nodes||[],a=[];for(let c=0,l=o.length;c<l;c++)a.push(r.getDependency("node",o[c]));return Promise.all(a).then(function(c){for(let h=0,u=c.length;h<u;h++)s.add(c[h]);const l=h=>{const u=new Map;for(const[d,p]of r.associations)(d instanceof di||d instanceof hn)&&u.set(d,p);return h.traverse(d=>{const p=r.associations.get(d);p!=null&&u.set(d,p)}),u};return r.associations=l(s),s})}_createAnimationTracks(e,t,n,r,s){const o=[],a=e.name?e.name:e.uuid,c=[];tr[s.path]===tr.weights?e.traverse(function(d){d.morphTargetInfluences&&c.push(d.name?d.name:d.uuid)}):c.push(a);let l;switch(tr[s.path]){case tr.weights:l=ws;break;case tr.rotation:l=Es;break;case tr.position:case tr.scale:l=As;break;default:n.itemSize===1?l=ws:l=As;break}const h=r.interpolation!==void 0?ry[r.interpolation]:so,u=this._getArrayFromAccessor(n);for(let d=0,p=c.length;d<p;d++){const g=new l(c[d]+"."+tr[s.path],t.array,u,h);r.interpolation==="CUBICSPLINE"&&this._createCubicSplineTrackInterpolant(g),o.push(g)}return o}_getArrayFromAccessor(e){let t=e.array;if(e.normalized){const n=Il(t.constructor),r=new Float32Array(t.length);for(let s=0,o=t.length;s<o;s++)r[s]=t[s]*n;t=r}return t}_createCubicSplineTrackInterpolant(e){e.createInterpolant=function(n){const r=this instanceof Es?iy:tf;return new r(this.times,this.values,this.getValueSize()/3,n)},e.createInterpolant.isInterpolantFactoryMethodGLTFCubicSpline=!0}}function dy(i,e,t){const n=e.attributes,r=new an;if(n.POSITION!==void 0){const a=t.json.accessors[n.POSITION],c=a.min,l=a.max;if(c!==void 0&&l!==void 0){if(r.set(new A(c[0],c[1],c[2]),new A(l[0],l[1],l[2])),a.normalized){const h=Il(fs[a.componentType]);r.min.multiplyScalar(h),r.max.multiplyScalar(h)}}else{console.warn("THREE.GLTFLoader: Missing min/max properties for accessor POSITION.");return}}else return;const s=e.targets;if(s!==void 0){const a=new A,c=new A;for(let l=0,h=s.length;l<h;l++){const u=s[l];if(u.POSITION!==void 0){const d=t.json.accessors[u.POSITION],p=d.min,g=d.max;if(p!==void 0&&g!==void 0){if(c.setX(Math.max(Math.abs(p[0]),Math.abs(g[0]))),c.setY(Math.max(Math.abs(p[1]),Math.abs(g[1]))),c.setZ(Math.max(Math.abs(p[2]),Math.abs(g[2]))),d.normalized){const b=Il(fs[d.componentType]);c.multiplyScalar(b)}a.max(c)}else console.warn("THREE.GLTFLoader: Missing min/max properties for accessor POSITION.")}}r.expandByVector(a)}i.boundingBox=r;const o=new yi;r.getCenter(o.center),o.radius=r.min.distanceTo(r.max)/2,i.boundingSphere=o}function Yu(i,e,t){const n=e.attributes,r=[];function s(o,a){return t.getDependency("accessor",o).then(function(c){i.setAttribute(a,c)})}for(const o in n){const a=Dl[o]||o.toLowerCase();a in i.attributes||r.push(s(n[o],a))}if(e.indices!==void 0&&!i.index){const o=t.getDependency("accessor",e.indices).then(function(a){i.setIndex(a)});r.push(o)}return Ct.workingColorSpace!==Ln&&"COLOR_0"in n&&console.warn(`THREE.GLTFLoader: Converting vertex colors from "srgb-linear" to "${Ct.workingColorSpace}" not supported.`),Ui(i,e),dy(i,e,t),Promise.all(r).then(function(){return e.targets!==void 0?oy(i,e.targets,t):i})}var fy=(function(){var i="b9H79Tebbbe8Fv9Gbb9Gvuuuuueu9Giuuub9Geueu9Giuuueuikqbeeedddillviebeoweuec:q;iekr;leDo9TW9T9VV95dbH9F9F939H79T9F9J9H229F9Jt9VV7bb8A9TW79O9V9Wt9F9KW9J9V9KW9wWVtW949c919M9MWVbeY9TW79O9V9Wt9F9KW9J9V9KW69U9KW949c919M9MWVbdE9TW79O9V9Wt9F9KW9J9V9KW69U9KW949tWG91W9U9JWbiL9TW79O9V9Wt9F9KW9J9V9KWS9P2tWV9p9JtblK9TW79O9V9Wt9F9KW9J9V9KWS9P2tWV9r919HtbvL9TW79O9V9Wt9F9KW9J9V9KWS9P2tWVT949Wbol79IV9Rbrq:P8Yqdbk;3sezu8Jjjjjbcj;eb9Rgv8Kjjjjbc9:hodnadcefal0mbcuhoaiRbbc:Ge9hmbavaialfgrad9Radz1jjjbhwcj;abad9UhoaicefhldnadTmbaoc;WFbGgocjdaocjd6EhDcbhqinaqae9pmeaDaeaq9RaqaDfae6Egkcsfgocl4cifcd4hxdndndndnaoc9WGgmTmbcbhPcehsawcjdfhzalhHinaraH9Rax6midnaraHaxfgl9RcK6mbczhoinawcj;cbfaogifgoc9WfhOdndndndndnaHaic9WfgAco4fRbbaAci4coG4ciGPlbedibkaO9cb83ibaOcwf9cb83ibxikaOalRblalRbbgAco4gCaCciSgCE86bbaocGfalclfaCfgORbbaAcl4ciGgCaCciSgCE86bbaocVfaOaCfgORbbaAcd4ciGgCaCciSgCE86bbaoc7faOaCfgORbbaAciGgAaAciSgAE86bbaoctfaOaAfgARbbalRbegOco4gCaCciSgCE86bbaoc91faAaCfgARbbaOcl4ciGgCaCciSgCE86bbaoc4faAaCfgARbbaOcd4ciGgCaCciSgCE86bbaoc93faAaCfgARbbaOciGgOaOciSgOE86bbaoc94faAaOfgARbbalRbdgOco4gCaCciSgCE86bbaoc95faAaCfgARbbaOcl4ciGgCaCciSgCE86bbaoc96faAaCfgARbbaOcd4ciGgCaCciSgCE86bbaoc97faAaCfgARbbaOciGgOaOciSgOE86bbaoc98faAaOfgORbbalRbiglco4gAaAciSgAE86bbaoc99faOaAfgORbbalcl4ciGgAaAciSgAE86bbaoc9:faOaAfgORbbalcd4ciGgAaAciSgAE86bbaocufaOaAfgoRbbalciGglalciSglE86bbaoalfhlxdkaOalRbwalRbbgAcl4gCaCcsSgCE86bbaocGfalcwfaCfgORbbaAcsGgAaAcsSgAE86bbaocVfaOaAfgORbbalRbegAcl4gCaCcsSgCE86bbaoc7faOaCfgORbbaAcsGgAaAcsSgAE86bbaoctfaOaAfgORbbalRbdgAcl4gCaCcsSgCE86bbaoc91faOaCfgORbbaAcsGgAaAcsSgAE86bbaoc4faOaAfgORbbalRbigAcl4gCaCcsSgCE86bbaoc93faOaCfgORbbaAcsGgAaAcsSgAE86bbaoc94faOaAfgORbbalRblgAcl4gCaCcsSgCE86bbaoc95faOaCfgORbbaAcsGgAaAcsSgAE86bbaoc96faOaAfgORbbalRbvgAcl4gCaCcsSgCE86bbaoc97faOaCfgORbbaAcsGgAaAcsSgAE86bbaoc98faOaAfgORbbalRbogAcl4gCaCcsSgCE86bbaoc99faOaCfgORbbaAcsGgAaAcsSgAE86bbaoc9:faOaAfgORbbalRbrglcl4gAaAcsSgAE86bbaocufaOaAfgoRbbalcsGglalcsSglE86bbaoalfhlxekaOal8Pbb83bbaOcwfalcwf8Pbb83bbalczfhlkdnaiam9pmbaiczfhoaral9RcL0mekkaiam6mialTmidnakTmbawaPfRbbhOcbhoazhiinaiawcj;cbfaofRbbgAce4cbaAceG9R7aOfgO86bbaiadfhiaocefgoak9hmbkkazcefhzaPcefgPad6hsalhHaPad9hmexvkkcbhlasceGmdxikalaxad2fhCdnakTmbcbhHcehsawcjdfhminaral9Rax6mialTmdalaxfhlawaHfRbbhOcbhoamhiinaiawcj;cbfaofRbbgAce4cbaAceG9R7aOfgO86bbaiadfhiaocefgoak9hmbkamcefhmaHcefgHad6hsaHad9hmbkaChlxikcbhocehsinaral9Rax6mdalTmealaxfhlaocefgoad6hsadao9hmbkaChlxdkcbhlasceGTmekc9:hoxikabaqad2fawcjdfakad2z1jjjb8Aawawcjdfakcufad2fadz1jjjb8Aakaqfhqalmbkc9:hoxekcbc99aral9Radcaadca0ESEhokavcj;ebf8Kjjjjbaok;yzeHu8Jjjjjbc;ae9Rgv8Kjjjjbc9:hodnaeci9UgrcHfal0mbcuhoaiRbbgwc;WeGc;Ge9hmbawcsGgDce0mbavc;abfcFecjez:jjjjb8AavcUf9cu83ibavc8Wf9cu83ibavcyf9cu83ibavcaf9cu83ibavcKf9cu83ibavczf9cu83ibav9cu83iwav9cu83ibaialfc9WfhqaicefgwarfhodnaeTmbcmcsaDceSEhkcbhxcbhmcbhDcbhicbhlindnaoaq9nmbc9:hoxikdndnawRbbgrc;Ve0mbavc;abfalarcl4cu7fcsGcitfgPydlhsaPydbhzdnarcsGgPak9pmbavaiarcu7fcsGcdtfydbaxaPEhraPThPdndnadcd9hmbabaDcetfgHaz87ebaHcdfas87ebaHclfar87ebxekabaDcdtfgHazBdbaHclfasBdbaHcwfarBdbkaxaPfhxavc;abfalcitfgHarBdbaHasBdlavaicdtfarBdbavc;abfalcefcsGglcitfgHazBdbaHarBdlaiaPfhialcefhlxdkdndnaPcsSmbamaPfaPc987fcefhmxekaocefhrao8SbbgPcFeGhHdndnaPcu9mmbarhoxekaocvfhoaHcFbGhHcrhPdninar8SbbgOcFbGaPtaHVhHaOcu9kmearcefhraPcrfgPc8J9hmbxdkkarcefhokaHce4cbaHceG9R7amfhmkdndnadcd9hmbabaDcetfgraz87ebarcdfas87ebarclfam87ebxekabaDcdtfgrazBdbarclfasBdbarcwfamBdbkavc;abfalcitfgramBdbarasBdlavaicdtfamBdbavc;abfalcefcsGglcitfgrazBdbaramBdlaicefhialcefhlxekdnarcpe0mbaxcefgOavaiaqarcsGfRbbgPcl49RcsGcdtfydbaPcz6gHEhravaiaP9RcsGcdtfydbaOaHfgsaPcsGgOEhPaOThOdndnadcd9hmbabaDcetfgzax87ebazcdfar87ebazclfaP87ebxekabaDcdtfgzaxBdbazclfarBdbazcwfaPBdbkavaicdtfaxBdbavc;abfalcitfgzarBdbazaxBdlavaicefgicsGcdtfarBdbavc;abfalcefcsGcitfgzaPBdbazarBdlavaiaHfcsGgicdtfaPBdbavc;abfalcdfcsGglcitfgraxBdbaraPBdlalcefhlaiaOfhiasaOfhxxekaxcbaoRbbgzEgAarc;:eSgrfhsazcsGhCazcl4hXdndnazcs0mbascefhOxekashOavaiaX9RcsGcdtfydbhskdndnaCmbaOcefhxxekaOhxavaiaz9RcsGcdtfydbhOkdndnarTmbaocefhrxekaocdfhrao8SbegHcFeGhPdnaHcu9kmbaocofhAaPcFbGhPcrhodninar8SbbgHcFbGaotaPVhPaHcu9kmearcefhraocrfgoc8J9hmbkaAhrxekarcefhrkaPce4cbaPceG9R7amfgmhAkdndnaXcsSmbarhPxekarcefhPar8SbbgocFeGhHdnaocu9kmbarcvfhsaHcFbGhHcrhodninaP8SbbgrcFbGaotaHVhHarcu9kmeaPcefhPaocrfgoc8J9hmbkashPxekaPcefhPkaHce4cbaHceG9R7amfgmhskdndnaCcsSmbaPhoxekaPcefhoaP8SbbgrcFeGhHdnarcu9kmbaPcvfhOaHcFbGhHcrhrdninao8SbbgPcFbGartaHVhHaPcu9kmeaocefhoarcrfgrc8J9hmbkaOhoxekaocefhokaHce4cbaHceG9R7amfgmhOkdndnadcd9hmbabaDcetfgraA87ebarcdfas87ebarclfaO87ebxekabaDcdtfgraABdbarclfasBdbarcwfaOBdbkavc;abfalcitfgrasBdbaraABdlavaicdtfaABdbavc;abfalcefcsGcitfgraOBdbarasBdlavaicefgicsGcdtfasBdbavc;abfalcdfcsGcitfgraABdbaraOBdlavaiazcz6aXcsSVfgicsGcdtfaOBdbaiaCTaCcsSVfhialcifhlkawcefhwalcsGhlaicsGhiaDcifgDae6mbkkcbc99aoaqSEhokavc;aef8Kjjjjbaok:llevu8Jjjjjbcz9Rhvc9:hodnaecvfal0mbcuhoaiRbbc;:eGc;qe9hmbav9cb83iwaicefhraialfc98fhwdnaeTmbdnadcdSmbcbhDindnaraw6mbc9:skarcefhoar8SbbglcFeGhidndnalcu9mmbaohrxekarcvfhraicFbGhicrhldninao8SbbgdcFbGaltaiVhiadcu9kmeaocefhoalcrfglc8J9hmbxdkkaocefhrkabaDcdtfaicd4cbaice4ceG9R7avcwfaiceGcdtVgoydbfglBdbaoalBdbaDcefgDae9hmbxdkkcbhDindnaraw6mbc9:skarcefhoar8SbbglcFeGhidndnalcu9mmbaohrxekarcvfhraicFbGhicrhldninao8SbbgdcFbGaltaiVhiadcu9kmeaocefhoalcrfglc8J9hmbxdkkaocefhrkabaDcetfaicd4cbaice4ceG9R7avcwfaiceGcdtVgoydbfgl87ebaoalBdbaDcefgDae9hmbkkcbc99arawSEhokaok:Lvoeue99dud99eud99dndnadcl9hmbaeTmeindndnabcdfgd8Sbb:Yab8Sbbgi:Ygl:l:tabcefgv8Sbbgo:Ygr:l:tgwJbb;:9cawawNJbbbbawawJbbbb9GgDEgq:mgkaqaicb9iEalMgwawNakaqaocb9iEarMgqaqNMM:r:vglNJbbbZJbbb:;aDEMgr:lJbbb9p9DTmbar:Ohixekcjjjj94hikadai86bbdndnaqalNJbbbZJbbb:;aqJbbbb9GEMgq:lJbbb9p9DTmbaq:Ohdxekcjjjj94hdkavad86bbdndnawalNJbbbZJbbb:;awJbbbb9GEMgw:lJbbb9p9DTmbaw:Ohdxekcjjjj94hdkabad86bbabclfhbaecufgembxdkkaeTmbindndnabclfgd8Ueb:Yab8Uebgi:Ygl:l:tabcdfgv8Uebgo:Ygr:l:tgwJb;:FSawawNJbbbbawawJbbbb9GgDEgq:mgkaqaicb9iEalMgwawNakaqaocb9iEarMgqaqNMM:r:vglNJbbbZJbbb:;aDEMgr:lJbbb9p9DTmbar:Ohixekcjjjj94hikadai87ebdndnaqalNJbbbZJbbb:;aqJbbbb9GEMgq:lJbbb9p9DTmbaq:Ohdxekcjjjj94hdkavad87ebdndnawalNJbbbZJbbb:;awJbbbb9GEMgw:lJbbb9p9DTmbaw:Ohdxekcjjjj94hdkabad87ebabcwfhbaecufgembkkk;siliui99iue99dnaeTmbcbhiabhlindndnJ;Zl81Zalcof8UebgvciV:Y:vgoal8Ueb:YNgrJb;:FSNJbbbZJbbb:;arJbbbb9GEMgw:lJbbb9p9DTmbaw:OhDxekcjjjj94hDkalclf8Uebhqalcdf8UebhkabavcefciGaiVcetfaD87ebdndnaoak:YNgwJb;:FSNJbbbZJbbb:;awJbbbb9GEMgx:lJbbb9p9DTmbax:Ohkxekcjjjj94hkkabavcdfciGaiVcetfak87ebdndnaoaq:YNgoJb;:FSNJbbbZJbbb:;aoJbbbb9GEMgx:lJbbb9p9DTmbax:Ohqxekcjjjj94hqkabavcufciGaiVcetfaq87ebdndnJbbjZararN:tawawN:taoaoN:tgrJbbbbarJbbbb9GE:rJb;:FSNJbbbZMgr:lJbbb9p9DTmbar:Ohqxekcjjjj94hqkabavciGaiVcetfaq87ebalcwfhlaiclfhiaecufgembkkk9mbdnadcd4ae2geTmbinababydbgdcwtcw91:Yadce91cjjj;8ifcjjj98G::NUdbabclfhbaecufgembkkk9teiucbcbydj1jjbgeabcifc98GfgbBdj1jjbdndnabZbcztgd9nmbcuhiabad9RcFFifcz4nbcuSmekaehikaik;LeeeudndnaeabVciGTmbabhixekdndnadcz9pmbabhixekabhiinaiaeydbBdbaiclfaeclfydbBdbaicwfaecwfydbBdbaicxfaecxfydbBdbaiczfhiaeczfheadc9Wfgdcs0mbkkadcl6mbinaiaeydbBdbaeclfheaiclfhiadc98fgdci0mbkkdnadTmbinaiaeRbb86bbaicefhiaecefheadcufgdmbkkabk;aeedudndnabciGTmbabhixekaecFeGc:b:c:ew2hldndnadcz9pmbabhixekabhiinaialBdbaicxfalBdbaicwfalBdbaiclfalBdbaiczfhiadc9Wfgdcs0mbkkadcl6mbinaialBdbaiclfhiadc98fgdci0mbkkdnadTmbinaiae86bbaicefhiadcufgdmbkkabkkkebcjwklz9Kbb",e="b9H79TebbbeKl9Gbb9Gvuuuuueu9Giuuub9Geueuikqbbebeedddilve9Weeeviebeoweuec:q;Aekr;leDo9TW9T9VV95dbH9F9F939H79T9F9J9H229F9Jt9VV7bb8A9TW79O9V9Wt9F9KW9J9V9KW9wWVtW949c919M9MWVbdY9TW79O9V9Wt9F9KW9J9V9KW69U9KW949c919M9MWVblE9TW79O9V9Wt9F9KW9J9V9KW69U9KW949tWG91W9U9JWbvL9TW79O9V9Wt9F9KW9J9V9KWS9P2tWV9p9JtboK9TW79O9V9Wt9F9KW9J9V9KWS9P2tWV9r919HtbrL9TW79O9V9Wt9F9KW9J9V9KWS9P2tWVT949Wbwl79IV9RbDq;t9tqlbzik9:evu8Jjjjjbcz9Rhbcbheincbhdcbhiinabcwfadfaicjuaead4ceGglE86bbaialfhiadcefgdcw9hmbkaec:q:yjjbfai86bbaecitc:q1jjbfab8Piw83ibaecefgecjd9hmbkk;h8JlHud97euo978Jjjjjbcj;kb9Rgv8Kjjjjbc9:hodnadcefal0mbcuhoaiRbbc:Ge9hmbavaialfgrad9Rad;8qbbcj;abad9UhoaicefhldnadTmbaoc;WFbGgocjdaocjd6EhwcbhDinaDae9pmeawaeaD9RaDawfae6Egqcsfgoc9WGgkci2hxakcethmaocl4cifcd4hPabaDad2fhscbhzdnincehHalhOcbhAdninaraO9RaP6miavcj;cbfaAak2fhCaOaPfhlcbhidnakc;ab6mbaral9Rc;Gb6mbcbhoinaCaofhidndndndndnaOaoco4fRbbgXciGPlbedibkaipxbbbbbbbbbbbbbbbbpklbxikaialpbblalpbbbgQclp:meaQpmbzeHdOiAlCvXoQrLgQcdp:meaQpmbzeHdOiAlCvXoQrLpxiiiiiiiiiiiiiiiip9ogLpxiiiiiiiiiiiiiiiip8JgQp5b9cjF;8;4;W;G;ab9:9cU1:NgKcitc:q1jjbfpbibaKc:q:yjjbfpbbbgYaYpmbbbbbbbbbbbbbbbbaQp5e9cjF;8;4;W;G;ab9:9cU1:NgKcitc:q1jjbfpbibp9UpmbedilvorzHOACXQLpPaLaQp9spklbalclfaYpQbfaKc:q:yjjbfRbbfhlxdkaialpbbwalpbbbgQclp:meaQpmbzeHdOiAlCvXoQrLpxssssssssssssssssp9ogLpxssssssssssssssssp8JgQp5b9cjF;8;4;W;G;ab9:9cU1:NgKcitc:q1jjbfpbibaKc:q:yjjbfpbbbgYaYpmbbbbbbbbbbbbbbbbaQp5e9cjF;8;4;W;G;ab9:9cU1:NgKcitc:q1jjbfpbibp9UpmbedilvorzHOACXQLpPaLaQp9spklbalcwfaYpQbfaKc:q:yjjbfRbbfhlxekaialpbbbpklbalczfhlkdndndndndnaXcd4ciGPlbedibkaipxbbbbbbbbbbbbbbbbpklzxikaialpbblalpbbbgQclp:meaQpmbzeHdOiAlCvXoQrLgQcdp:meaQpmbzeHdOiAlCvXoQrLpxiiiiiiiiiiiiiiiip9ogLpxiiiiiiiiiiiiiiiip8JgQp5b9cjF;8;4;W;G;ab9:9cU1:NgKcitc:q1jjbfpbibaKc:q:yjjbfpbbbgYaYpmbbbbbbbbbbbbbbbbaQp5e9cjF;8;4;W;G;ab9:9cU1:NgKcitc:q1jjbfpbibp9UpmbedilvorzHOACXQLpPaLaQp9spklzalclfaYpQbfaKc:q:yjjbfRbbfhlxdkaialpbbwalpbbbgQclp:meaQpmbzeHdOiAlCvXoQrLpxssssssssssssssssp9ogLpxssssssssssssssssp8JgQp5b9cjF;8;4;W;G;ab9:9cU1:NgKcitc:q1jjbfpbibaKc:q:yjjbfpbbbgYaYpmbbbbbbbbbbbbbbbbaQp5e9cjF;8;4;W;G;ab9:9cU1:NgKcitc:q1jjbfpbibp9UpmbedilvorzHOACXQLpPaLaQp9spklzalcwfaYpQbfaKc:q:yjjbfRbbfhlxekaialpbbbpklzalczfhlkdndndndndnaXcl4ciGPlbedibkaipxbbbbbbbbbbbbbbbbpklaxikaialpbblalpbbbgQclp:meaQpmbzeHdOiAlCvXoQrLgQcdp:meaQpmbzeHdOiAlCvXoQrLpxiiiiiiiiiiiiiiiip9ogLpxiiiiiiiiiiiiiiiip8JgQp5b9cjF;8;4;W;G;ab9:9cU1:NgKcitc:q1jjbfpbibaKc:q:yjjbfpbbbgYaYpmbbbbbbbbbbbbbbbbaQp5e9cjF;8;4;W;G;ab9:9cU1:NgKcitc:q1jjbfpbibp9UpmbedilvorzHOACXQLpPaLaQp9spklaalclfaYpQbfaKc:q:yjjbfRbbfhlxdkaialpbbwalpbbbgQclp:meaQpmbzeHdOiAlCvXoQrLpxssssssssssssssssp9ogLpxssssssssssssssssp8JgQp5b9cjF;8;4;W;G;ab9:9cU1:NgKcitc:q1jjbfpbibaKc:q:yjjbfpbbbgYaYpmbbbbbbbbbbbbbbbbaQp5e9cjF;8;4;W;G;ab9:9cU1:NgKcitc:q1jjbfpbibp9UpmbedilvorzHOACXQLpPaLaQp9spklaalcwfaYpQbfaKc:q:yjjbfRbbfhlxekaialpbbbpklaalczfhlkdndndndndnaXco4Plbedibkaipxbbbbbbbbbbbbbbbbpkl8WxikaialpbblalpbbbgQclp:meaQpmbzeHdOiAlCvXoQrLgQcdp:meaQpmbzeHdOiAlCvXoQrLpxiiiiiiiiiiiiiiiip9ogLpxiiiiiiiiiiiiiiiip8JgQp5b9cjF;8;4;W;G;ab9:9cU1:NgXcitc:q1jjbfpbibaXc:q:yjjbfpbbbgYaYpmbbbbbbbbbbbbbbbbaQp5e9cjF;8;4;W;G;ab9:9cU1:NgXcitc:q1jjbfpbibp9UpmbedilvorzHOACXQLpPaLaQp9spkl8WalclfaYpQbfaXc:q:yjjbfRbbfhlxdkaialpbbwalpbbbgQclp:meaQpmbzeHdOiAlCvXoQrLpxssssssssssssssssp9ogLpxssssssssssssssssp8JgQp5b9cjF;8;4;W;G;ab9:9cU1:NgXcitc:q1jjbfpbibaXc:q:yjjbfpbbbgYaYpmbbbbbbbbbbbbbbbbaQp5e9cjF;8;4;W;G;ab9:9cU1:NgXcitc:q1jjbfpbibp9UpmbedilvorzHOACXQLpPaLaQp9spkl8WalcwfaYpQbfaXc:q:yjjbfRbbfhlxekaialpbbbpkl8Walczfhlkaoc;abfhiaocjefak0meaihoaral9Rc;Fb0mbkkdndnaiak9pmbaici4hoinaral9RcK6mdaCaifhXdndndndndnaOaico4fRbbaocoG4ciGPlbedibkaXpxbbbbbbbbbbbbbbbbpklbxikaXalpbblalpbbbgQclp:meaQpmbzeHdOiAlCvXoQrLgQcdp:meaQpmbzeHdOiAlCvXoQrLpxiiiiiiiiiiiiiiiip9ogLpxiiiiiiiiiiiiiiiip8JgQp5b9cjF;8;4;W;G;ab9:9cU1:NgKcitc:q1jjbfpbibaKc:q:yjjbfpbbbgYaYpmbbbbbbbbbbbbbbbbaQp5e9cjF;8;4;W;G;ab9:9cU1:NgKcitc:q1jjbfpbibp9UpmbedilvorzHOACXQLpPaLaQp9spklbalclfaYpQbfaKc:q:yjjbfRbbfhlxdkaXalpbbwalpbbbgQclp:meaQpmbzeHdOiAlCvXoQrLpxssssssssssssssssp9ogLpxssssssssssssssssp8JgQp5b9cjF;8;4;W;G;ab9:9cU1:NgKcitc:q1jjbfpbibaKc:q:yjjbfpbbbgYaYpmbbbbbbbbbbbbbbbbaQp5e9cjF;8;4;W;G;ab9:9cU1:NgKcitc:q1jjbfpbibp9UpmbedilvorzHOACXQLpPaLaQp9spklbalcwfaYpQbfaKc:q:yjjbfRbbfhlxekaXalpbbbpklbalczfhlkaocdfhoaiczfgiak6mbkkalTmbaAci6hHalhOaAcefgohAaoclSmdxekkcbhlaHceGmdkdnakTmbavcjdfazfhiavazfpbdbhYcbhXinaiavcj;cbfaXfgopblbgLcep9TaLpxeeeeeeeeeeeeeeeegQp9op9Hp9rgLaoakfpblbg8Acep9Ta8AaQp9op9Hp9rg8ApmbzeHdOiAlCvXoQrLgEaoamfpblbg3cep9Ta3aQp9op9Hp9rg3aoaxfpblbg5cep9Ta5aQp9op9Hp9rg5pmbzeHdOiAlCvXoQrLg8EpmbezHdiOAlvCXorQLgQaQpmbedibedibedibediaYp9UgYp9AdbbaiadfgoaYaQaQpmlvorlvorlvorlvorp9UgYp9AdbbaoadfgoaYaQaQpmwDqkwDqkwDqkwDqkp9UgYp9AdbbaoadfgoaYaQaQpmxmPsxmPsxmPsxmPsp9UgYp9AdbbaoadfgoaYaEa8EpmwDKYqk8AExm35Ps8E8FgQaQpmbedibedibedibedip9UgYp9AdbbaoadfgoaYaQaQpmlvorlvorlvorlvorp9UgYp9AdbbaoadfgoaYaQaQpmwDqkwDqkwDqkwDqkp9UgYp9AdbbaoadfgoaYaQaQpmxmPsxmPsxmPsxmPsp9UgYp9AdbbaoadfgoaYaLa8ApmwKDYq8AkEx3m5P8Es8FgLa3a5pmwKDYq8AkEx3m5P8Es8Fg8ApmbezHdiOAlvCXorQLgQaQpmbedibedibedibedip9UgYp9AdbbaoadfgoaYaQaQpmlvorlvorlvorlvorp9UgYp9AdbbaoadfgoaYaQaQpmwDqkwDqkwDqkwDqkp9UgYp9AdbbaoadfgoaYaQaQpmxmPsxmPsxmPsxmPsp9UgYp9AdbbaoadfgoaYaLa8ApmwDKYqk8AExm35Ps8E8FgQaQpmbedibedibedibedip9UgYp9AdbbaoadfgoaYaQaQpmlvorlvorlvorlvorp9UgYp9AdbbaoadfgoaYaQaQpmwDqkwDqkwDqkwDqkp9UgYp9AdbbaoadfgoaYaQaQpmxmPsxmPsxmPsxmPsp9UgYp9AdbbaoadfhiaXczfgXak6mbkkazclfgzad6mbkasavcjdfaqad2;8qbbavavcjdfaqcufad2fad;8qbbaqaDfhDc9:hoalmexikkc9:hoxekcbc99aral9Radcaadca0ESEhokavcj;kbf8Kjjjjbaokwbz:bjjjbk;uzeHu8Jjjjjbc;ae9Rgv8Kjjjjbc9:hodnaeci9UgrcHfal0mbcuhoaiRbbgwc;WeGc;Ge9hmbawcsGgDce0mbavc;abfcFecje;8kbavcUf9cu83ibavc8Wf9cu83ibavcyf9cu83ibavcaf9cu83ibavcKf9cu83ibavczf9cu83ibav9cu83iwav9cu83ibaialfc9WfhqaicefgwarfhodnaeTmbcmcsaDceSEhkcbhxcbhmcbhDcbhicbhlindnaoaq9nmbc9:hoxikdndnawRbbgrc;Ve0mbavc;abfalarcl4cu7fcsGcitfgPydlhsaPydbhzdnarcsGgPak9pmbavaiarcu7fcsGcdtfydbaxaPEhraPThPdndnadcd9hmbabaDcetfgHaz87ebaHcdfas87ebaHclfar87ebxekabaDcdtfgHazBdbaHclfasBdbaHcwfarBdbkaxaPfhxavc;abfalcitfgHarBdbaHasBdlavaicdtfarBdbavc;abfalcefcsGglcitfgHazBdbaHarBdlaiaPfhialcefhlxdkdndnaPcsSmbamaPfaPc987fcefhmxekaocefhrao8SbbgPcFeGhHdndnaPcu9mmbarhoxekaocvfhoaHcFbGhHcrhPdninar8SbbgOcFbGaPtaHVhHaOcu9kmearcefhraPcrfgPc8J9hmbxdkkarcefhokaHce4cbaHceG9R7amfhmkdndnadcd9hmbabaDcetfgraz87ebarcdfas87ebarclfam87ebxekabaDcdtfgrazBdbarclfasBdbarcwfamBdbkavc;abfalcitfgramBdbarasBdlavaicdtfamBdbavc;abfalcefcsGglcitfgrazBdbaramBdlaicefhialcefhlxekdnarcpe0mbaxcefgOavaiaqarcsGfRbbgPcl49RcsGcdtfydbaPcz6gHEhravaiaP9RcsGcdtfydbaOaHfgsaPcsGgOEhPaOThOdndnadcd9hmbabaDcetfgzax87ebazcdfar87ebazclfaP87ebxekabaDcdtfgzaxBdbazclfarBdbazcwfaPBdbkavaicdtfaxBdbavc;abfalcitfgzarBdbazaxBdlavaicefgicsGcdtfarBdbavc;abfalcefcsGcitfgzaPBdbazarBdlavaiaHfcsGgicdtfaPBdbavc;abfalcdfcsGglcitfgraxBdbaraPBdlalcefhlaiaOfhiasaOfhxxekaxcbaoRbbgzEgAarc;:eSgrfhsazcsGhCazcl4hXdndnazcs0mbascefhOxekashOavaiaX9RcsGcdtfydbhskdndnaCmbaOcefhxxekaOhxavaiaz9RcsGcdtfydbhOkdndnarTmbaocefhrxekaocdfhrao8SbegHcFeGhPdnaHcu9kmbaocofhAaPcFbGhPcrhodninar8SbbgHcFbGaotaPVhPaHcu9kmearcefhraocrfgoc8J9hmbkaAhrxekarcefhrkaPce4cbaPceG9R7amfgmhAkdndnaXcsSmbarhPxekarcefhPar8SbbgocFeGhHdnaocu9kmbarcvfhsaHcFbGhHcrhodninaP8SbbgrcFbGaotaHVhHarcu9kmeaPcefhPaocrfgoc8J9hmbkashPxekaPcefhPkaHce4cbaHceG9R7amfgmhskdndnaCcsSmbaPhoxekaPcefhoaP8SbbgrcFeGhHdnarcu9kmbaPcvfhOaHcFbGhHcrhrdninao8SbbgPcFbGartaHVhHaPcu9kmeaocefhoarcrfgrc8J9hmbkaOhoxekaocefhokaHce4cbaHceG9R7amfgmhOkdndnadcd9hmbabaDcetfgraA87ebarcdfas87ebarclfaO87ebxekabaDcdtfgraABdbarclfasBdbarcwfaOBdbkavc;abfalcitfgrasBdbaraABdlavaicdtfaABdbavc;abfalcefcsGcitfgraOBdbarasBdlavaicefgicsGcdtfasBdbavc;abfalcdfcsGcitfgraABdbaraOBdlavaiazcz6aXcsSVfgicsGcdtfaOBdbaiaCTaCcsSVfhialcifhlkawcefhwalcsGhlaicsGhiaDcifgDae6mbkkcbc99aoaqSEhokavc;aef8Kjjjjbaok:llevu8Jjjjjbcz9Rhvc9:hodnaecvfal0mbcuhoaiRbbc;:eGc;qe9hmbav9cb83iwaicefhraialfc98fhwdnaeTmbdnadcdSmbcbhDindnaraw6mbc9:skarcefhoar8SbbglcFeGhidndnalcu9mmbaohrxekarcvfhraicFbGhicrhldninao8SbbgdcFbGaltaiVhiadcu9kmeaocefhoalcrfglc8J9hmbxdkkaocefhrkabaDcdtfaicd4cbaice4ceG9R7avcwfaiceGcdtVgoydbfglBdbaoalBdbaDcefgDae9hmbxdkkcbhDindnaraw6mbc9:skarcefhoar8SbbglcFeGhidndnalcu9mmbaohrxekarcvfhraicFbGhicrhldninao8SbbgdcFbGaltaiVhiadcu9kmeaocefhoalcrfglc8J9hmbxdkkaocefhrkabaDcetfaicd4cbaice4ceG9R7avcwfaiceGcdtVgoydbfgl87ebaoalBdbaDcefgDae9hmbkkcbc99arawSEhokaok:EPliuo97eue978Jjjjjbca9Rhidndnadcl9hmbdnaec98GglTmbcbhvabhdinadadpbbbgocKp:RecKp:Sep;6egraocwp:RecKp:Sep;6earp;Geaoczp:RecKp:Sep;6egwp;Gep;Kep;LegDpxbbbbbbbbbbbbbbbbp:2egqarpxbbbjbbbjbbbjbbbjgkp9op9rp;Kegrpxbb;:9cbb;:9cbb;:9cbb;:9cararp;MeaDaDp;Meawaqawakp9op9rp;Kegrarp;Mep;Kep;Kep;Jep;Negwp;Mepxbbn0bbn0bbn0bbn0gqp;KepxFbbbFbbbFbbbFbbbp9oaopxbbbFbbbFbbbFbbbFp9op9qarawp;Meaqp;Kecwp:RepxbFbbbFbbbFbbbFbbp9op9qaDawp;Meaqp;Keczp:RepxbbFbbbFbbbFbbbFbp9op9qpkbbadczfhdavclfgval6mbkkalae9pmeaiaeciGgvcdtgdVcbczad9R;8kbaiabalcdtfglad;8qbbdnavTmbaiaipblbgocKp:RecKp:Sep;6egraocwp:RecKp:Sep;6earp;Geaoczp:RecKp:Sep;6egwp;Gep;Kep;LegDpxbbbbbbbbbbbbbbbbp:2egqarpxbbbjbbbjbbbjbbbjgkp9op9rp;Kegrpxbb;:9cbb;:9cbb;:9cbb;:9cararp;MeaDaDp;Meawaqawakp9op9rp;Kegrarp;Mep;Kep;Kep;Jep;Negwp;Mepxbbn0bbn0bbn0bbn0gqp;KepxFbbbFbbbFbbbFbbbp9oaopxbbbFbbbFbbbFbbbFp9op9qarawp;Meaqp;Kecwp:RepxbFbbbFbbbFbbbFbbp9op9qaDawp;Meaqp;Keczp:RepxbbFbbbFbbbFbbbFbp9op9qpklbkalaiad;8qbbskdnaec98GgxTmbcbhvabhdinadczfglalpbbbgopxbbbbbbFFbbbbbbFFgkp9oadpbbbgDaopmlvorxmPsCXQL358E8FpxFubbFubbFubbFubbp9op;6eaDaopmbediwDqkzHOAKY8AEgoczp:Sep;6egrp;Geaoczp:Reczp:Sep;6egwp;Gep;Kep;Legopxb;:FSb;:FSb;:FSb;:FSawaopxbbbbbbbbbbbbbbbbp:2egqawpxbbbjbbbjbbbjbbbjgmp9op9rp;Kegwawp;Meaoaop;Mearaqaramp9op9rp;Kegoaop;Mep;Kep;Kep;Jep;Negrp;Mepxbbn0bbn0bbn0bbn0gqp;Keczp:Reawarp;Meaqp;KepxFFbbFFbbFFbbFFbbp9op9qgwaoarp;Meaqp;KepxFFbbFFbbFFbbFFbbp9ogopmwDKYqk8AExm35Ps8E8Fp9qpkbbadaDakp9oawaopmbezHdiOAlvCXorQLp9qpkbbadcafhdavclfgvax6mbkkaxae9pmbaiaeciGgvcitgdfcbcaad9R;8kbaiabaxcitfglad;8qbbdnavTmbaiaipblzgopxbbbbbbFFbbbbbbFFgkp9oaipblbgDaopmlvorxmPsCXQL358E8FpxFubbFubbFubbFubbp9op;6eaDaopmbediwDqkzHOAKY8AEgoczp:Sep;6egrp;Geaoczp:Reczp:Sep;6egwp;Gep;Kep;Legopxb;:FSb;:FSb;:FSb;:FSawaopxbbbbbbbbbbbbbbbbp:2egqawpxbbbjbbbjbbbjbbbjgmp9op9rp;Kegwawp;Meaoaop;Mearaqaramp9op9rp;Kegoaop;Mep;Kep;Kep;Jep;Negrp;Mepxbbn0bbn0bbn0bbn0gqp;Keczp:Reawarp;Meaqp;KepxFFbbFFbbFFbbFFbbp9op9qgwaoarp;Meaqp;KepxFFbbFFbbFFbbFFbbp9ogopmwDKYqk8AExm35Ps8E8Fp9qpklzaiaDakp9oawaopmbezHdiOAlvCXorQLp9qpklbkalaiad;8qbbkk;4wllue97euv978Jjjjjbc8W9Rhidnaec98GglTmbcbhvabhoinaiaopbbbgraoczfgwpbbbgDpmlvorxmPsCXQL358E8Fgqczp:Segkclp:RepklbaopxbbjZbbjZbbjZbbjZpx;Zl81Z;Zl81Z;Zl81Z;Zl81Zakpxibbbibbbibbbibbbp9qp;6ep;NegkaraDpmbediwDqkzHOAKY8AEgrczp:Reczp:Sep;6ep;MegDaDp;Meakarczp:Sep;6ep;Megxaxp;Meakaqczp:Reczp:Sep;6ep;Megqaqp;Mep;Kep;Kep;Lepxbbbbbbbbbbbbbbbbp:4ep;Jepxb;:FSb;:FSb;:FSb;:FSgkp;Mepxbbn0bbn0bbn0bbn0grp;KepxFFbbFFbbFFbbFFbbgmp9oaxakp;Mearp;Keczp:Rep9qgxaqakp;Mearp;Keczp:ReaDakp;Mearp;Keamp9op9qgkpmbezHdiOAlvCXorQLgrp5baipblbpEb:T:j83ibaocwfarp5eaipblbpEe:T:j83ibawaxakpmwDKYqk8AExm35Ps8E8Fgkp5baipblbpEd:T:j83ibaocKfakp5eaipblbpEi:T:j83ibaocafhoavclfgval6mbkkdnalae9pmbaiaeciGgvcitgofcbcaao9R;8kbaiabalcitfgwao;8qbbdnavTmbaiaipblbgraipblzgDpmlvorxmPsCXQL358E8Fgqczp:Segkclp:RepklaaipxbbjZbbjZbbjZbbjZpx;Zl81Z;Zl81Z;Zl81Z;Zl81Zakpxibbbibbbibbbibbbp9qp;6ep;NegkaraDpmbediwDqkzHOAKY8AEgrczp:Reczp:Sep;6ep;MegDaDp;Meakarczp:Sep;6ep;Megxaxp;Meakaqczp:Reczp:Sep;6ep;Megqaqp;Mep;Kep;Kep;Lepxbbbbbbbbbbbbbbbbp:4ep;Jepxb;:FSb;:FSb;:FSb;:FSgkp;Mepxbbn0bbn0bbn0bbn0grp;KepxFFbbFFbbFFbbFFbbgmp9oaxakp;Mearp;Keczp:Rep9qgxaqakp;Mearp;Keczp:ReaDakp;Mearp;Keamp9op9qgkpmbezHdiOAlvCXorQLgrp5baipblapEb:T:j83ibaiarp5eaipblapEe:T:j83iwaiaxakpmwDKYqk8AExm35Ps8E8Fgkp5baipblapEd:T:j83izaiakp5eaipblapEi:T:j83iKkawaiao;8qbbkk:Pddiue978Jjjjjbc;ab9Rhidnadcd4ae2glc98GgvTmbcbhdabheinaeaepbbbgocwp:Recwp:Sep;6eaocep:SepxbbjZbbjZbbjZbbjZp:UepxbbjFbbjFbbjFbbjFp9op;Mepkbbaeczfheadclfgdav6mbkkdnaval9pmbaialciGgdcdtgeVcbc;abae9R;8kbaiabavcdtfgvae;8qbbdnadTmbaiaipblbgocwp:Recwp:Sep;6eaocep:SepxbbjZbbjZbbjZbbjZp:UepxbbjFbbjFbbjFbbjFp9op;Mepklbkavaiae;8qbbkk9teiucbcbydj1jjbgeabcifc98GfgbBdj1jjbdndnabZbcztgd9nmbcuhiabad9RcFFifcz4nbcuSmekaehikaikkkebcjwklz9Tbb",t=new Uint8Array([0,97,115,109,1,0,0,0,1,4,1,96,0,0,3,3,2,0,0,5,3,1,0,1,12,1,0,10,22,2,12,0,65,0,65,0,65,0,252,10,0,0,11,7,0,65,0,253,15,26,11]),n=new Uint8Array([32,0,65,2,1,106,34,33,3,128,11,4,13,64,6,253,10,7,15,116,127,5,8,12,40,16,19,54,20,9,27,255,113,17,42,67,24,23,146,148,18,14,22,45,70,69,56,114,101,21,25,63,75,136,108,28,118,29,73,115]);if(typeof WebAssembly!="object")return{supported:!1};var r=WebAssembly.validate(t)?e:i,s,o=WebAssembly.instantiate(a(r),{}).then(function(f){s=f.instance,s.exports.__wasm_call_ctors()});function a(f){for(var M=new Uint8Array(f.length),x=0;x<f.length;++x){var _=f.charCodeAt(x);M[x]=_>96?_-97:_>64?_-39:_+4}for(var I=0,x=0;x<f.length;++x)M[I++]=M[x]<60?n[M[x]]:(M[x]-60)*64+M[++x];return M.buffer.slice(0,I)}function c(f,M,x,_,I,R){var T=s.exports.sbrk,F=x+3&-4,S=T(F*_),v=T(I.length),P=new Uint8Array(s.exports.memory.buffer);P.set(I,v);var Q=f(S,x,_,v,I.length);if(Q==0&&R&&R(S,F,_),M.set(P.subarray(S,S+x*_)),T(S-T(0)),Q!=0)throw new Error("Malformed buffer data: "+Q)}var l={NONE:"",OCTAHEDRAL:"meshopt_decodeFilterOct",QUATERNION:"meshopt_decodeFilterQuat",EXPONENTIAL:"meshopt_decodeFilterExp"},h={ATTRIBUTES:"meshopt_decodeVertexBuffer",TRIANGLES:"meshopt_decodeIndexBuffer",INDICES:"meshopt_decodeIndexSequence"},u=[],d=0;function p(f){var M={object:new Worker(f),pending:0,requests:{}};return M.object.onmessage=function(x){var _=x.data;M.pending-=_.count,M.requests[_.id][_.action](_.value),delete M.requests[_.id]},M}function g(f){for(var M="var instance; var ready = WebAssembly.instantiate(new Uint8Array(["+new Uint8Array(a(r))+"]), {}).then(function(result) { instance = result.instance; instance.exports.__wasm_call_ctors(); });self.onmessage = workerProcess;"+c.toString()+m.toString(),x=new Blob([M],{type:"text/javascript"}),_=URL.createObjectURL(x),I=0;I<f;++I)u[I]=p(_);URL.revokeObjectURL(_)}function b(f,M,x,_,I){for(var R=u[0],T=1;T<u.length;++T)u[T].pending<R.pending&&(R=u[T]);return new Promise(function(F,S){var v=new Uint8Array(x),P=d++;R.pending+=f,R.requests[P]={resolve:F,reject:S},R.object.postMessage({id:P,count:f,size:M,source:v,mode:_,filter:I},[v.buffer])})}function m(f){o.then(function(){var M=f.data;try{var x=new Uint8Array(M.count*M.size);c(s.exports[M.mode],x,M.count,M.size,M.source,s.exports[M.filter]),self.postMessage({id:M.id,count:M.count,action:"resolve",value:x},[x.buffer])}catch(_){self.postMessage({id:M.id,count:M.count,action:"reject",value:_})}})}return{ready:o,supported:!0,useWorkers:function(f){g(f)},decodeVertexBuffer:function(f,M,x,_,I){c(s.exports.meshopt_decodeVertexBuffer,f,M,x,_,s.exports[l[I]])},decodeIndexBuffer:function(f,M,x,_){c(s.exports.meshopt_decodeIndexBuffer,f,M,x,_)},decodeIndexSequence:function(f,M,x,_){c(s.exports.meshopt_decodeIndexSequence,f,M,x,_)},decodeGltfBuffer:function(f,M,x,_,I,R){c(s.exports[h[I]],f,M,x,_,s.exports[l[R]])},decodeGltfBufferAsync:function(f,M,x,_,I){return u.length>0?b(f,M,x,h[_],l[I]):o.then(function(){var R=new Uint8Array(f*M);return c(s.exports[h[_]],R,f,M,x,s.exports[l[I]]),R})}}})(),qn=Uint8Array,ss=Uint16Array,py=Int32Array,nf=new qn([0,0,0,0,0,0,0,0,1,1,1,1,2,2,2,2,3,3,3,3,4,4,4,4,5,5,5,5,0,0,0,0]),rf=new qn([0,0,0,0,1,1,2,2,3,3,4,4,5,5,6,6,7,7,8,8,9,9,10,10,11,11,12,12,13,13,0,0]),my=new qn([16,17,18,0,8,7,9,6,10,5,11,4,12,3,13,2,14,1,15]),sf=function(i,e){for(var t=new ss(31),n=0;n<31;++n)t[n]=e+=1<<i[n-1];for(var r=new py(t[30]),n=1;n<30;++n)for(var s=t[n];s<t[n+1];++s)r[s]=s-t[n]<<5|n;return{b:t,r}},of=sf(nf,2),af=of.b,gy=of.r;af[28]=258,gy[258]=28;var by=sf(rf,0),_y=by.b,Nl=new ss(32768);for(var Zt=0;Zt<32768;++Zt){var nr=(Zt&43690)>>1|(Zt&21845)<<1;nr=(nr&52428)>>2|(nr&13107)<<2,nr=(nr&61680)>>4|(nr&3855)<<4,Nl[Zt]=((nr&65280)>>8|(nr&255)<<8)>>1}var to=(function(i,e,t){for(var n=i.length,r=0,s=new ss(e);r<n;++r)i[r]&&++s[i[r]-1];var o=new ss(e);for(r=1;r<e;++r)o[r]=o[r-1]+s[r-1]<<1;var a;if(t){a=new ss(1<<e);var c=15-e;for(r=0;r<n;++r)if(i[r])for(var l=r<<4|i[r],h=e-i[r],u=o[i[r]-1]++<<h,d=u|(1<<h)-1;u<=d;++u)a[Nl[u]>>c]=l}else for(a=new ss(n),r=0;r<n;++r)i[r]&&(a[r]=Nl[o[i[r]-1]++]>>15-i[r]);return a}),fo=new qn(288);for(var Zt=0;Zt<144;++Zt)fo[Zt]=8;for(var Zt=144;Zt<256;++Zt)fo[Zt]=9;for(var Zt=256;Zt<280;++Zt)fo[Zt]=7;for(var Zt=280;Zt<288;++Zt)fo[Zt]=8;var cf=new qn(32);for(var Zt=0;Zt<32;++Zt)cf[Zt]=5;var xy=to(fo,9,1),vy=to(cf,5,1),Lc=function(i){for(var e=i[0],t=1;t<i.length;++t)i[t]>e&&(e=i[t]);return e},oi=function(i,e,t){var n=e/8|0;return(i[n]|i[n+1]<<8)>>(e&7)&t},Dc=function(i,e){var t=e/8|0;return(i[t]|i[t+1]<<8|i[t+2]<<16)>>(e&7)},yy=function(i){return(i+7)/8|0},My=function(i,e,t){return(t==null||t>i.length)&&(t=i.length),new qn(i.subarray(e,t))},Sy=["unexpected EOF","invalid block type","invalid length/literal","invalid distance","stream finished","no stream handler",,"no callback","invalid UTF-8 data","extra field too long","date not in range 1980-2099","filename too long","stream finishing","invalid zip data"],ai=function(i,e,t){var n=new Error(e||Sy[i]);if(n.code=i,Error.captureStackTrace&&Error.captureStackTrace(n,ai),!t)throw n;return n},wy=function(i,e,t,n){var r=i.length,s=0;if(!r||e.f&&!e.l)return t||new qn(0);var o=!t,a=o||e.i!=2,c=e.i;o&&(t=new qn(r*3));var l=function(Ze){var Ce=t.length;if(Ze>Ce){var rt=new qn(Math.max(Ce*2,Ze));rt.set(t),t=rt}},h=e.f||0,u=e.p||0,d=e.b||0,p=e.l,g=e.d,b=e.m,m=e.n,f=r*8;do{if(!p){h=oi(i,u,1);var M=oi(i,u+1,3);if(u+=3,M)if(M==1)p=xy,g=vy,b=9,m=5;else if(M==2){var R=oi(i,u,31)+257,T=oi(i,u+10,15)+4,F=R+oi(i,u+5,31)+1;u+=14;for(var S=new qn(F),v=new qn(19),P=0;P<T;++P)v[my[P]]=oi(i,u+P*3,7);u+=T*3;for(var Q=Lc(v),G=(1<<Q)-1,ae=to(v,Q,1),P=0;P<F;){var oe=ae[oi(i,u,G)];u+=oe&15;var x=oe>>4;if(x<16)S[P++]=x;else{var ne=0,he=0;for(x==16?(he=3+oi(i,u,3),u+=2,ne=S[P-1]):x==17?(he=3+oi(i,u,7),u+=3):x==18&&(he=11+oi(i,u,127),u+=7);he--;)S[P++]=ne}}var L=S.subarray(0,R),W=S.subarray(R);b=Lc(L),m=Lc(W),p=to(L,b,1),g=to(W,m,1)}else ai(1);else{var x=yy(u)+4,_=i[x-4]|i[x-3]<<8,I=x+_;if(I>r){c&&ai(0);break}a&&l(d+_),t.set(i.subarray(x,I),d),e.b=d+=_,e.p=u=I*8,e.f=h;continue}if(u>f){c&&ai(0);break}}a&&l(d+131072);for(var q=(1<<b)-1,j=(1<<m)-1,ee=u;;ee=u){var ne=p[Dc(i,u)&q],ue=ne>>4;if(u+=ne&15,u>f){c&&ai(0);break}if(ne||ai(2),ue<256)t[d++]=ue;else if(ue==256){ee=u,p=null;break}else{var X=ue-254;if(ue>264){var P=ue-257,re=nf[P];X=oi(i,u,(1<<re)-1)+af[P],u+=re}var xe=g[Dc(i,u)&j],me=xe>>4;xe||ai(3),u+=xe&15;var W=_y[me];if(me>3){var re=rf[me];W+=Dc(i,u)&(1<<re)-1,u+=re}if(u>f){c&&ai(0);break}a&&l(d+131072);var Te=d+X;if(d<W){var ke=s-W,He=Math.min(W,Te);for(ke+d<0&&ai(3);d<He;++d)t[d]=n[ke+d]}for(;d<Te;++d)t[d]=t[d-W]}}e.l=p,e.p=ee,e.b=d,e.f=h,p&&(h=1,e.m=b,e.d=g,e.n=m)}while(!h);return d!=t.length&&o?My(t,0,d):t.subarray(0,d)},Ey=new qn(0),Ay=function(i){(i[0]!=31||i[1]!=139||i[2]!=8)&&ai(6,"invalid gzip data");var e=i[3],t=10;e&4&&(t+=(i[10]|i[11]<<8)+2);for(var n=(e>>3&1)+(e>>4&1);n>0;n-=!i[t++]);return t+(e&2)},Ty=function(i){var e=i.length;return(i[e-4]|i[e-3]<<8|i[e-2]<<16|i[e-1]<<24)>>>0};function Ry(i,e){var t=Ay(i);return t+8>i.length&&ai(6,"invalid gzip data"),wy(i.subarray(t,-8),{i:2},new qn(Ty(i)),e)}var Cy=typeof TextDecoder<"u"&&new TextDecoder,Py=0;try{Cy.decode(Ey,{stream:!0}),Py=1}catch{}async function lf(i){const e=new URL(i,document.baseURI),t=await fetch(e);if(!t.ok)throw new Error("model_load_failed");let n=new Uint8Array(await t.arrayBuffer());n[0]===31&&n[1]===139&&(n=Ry(n));const r=n.buffer.slice(n.byteOffset,n.byteOffset+n.byteLength);return new Dv().setMeshoptDecoder(fy).parseAsync(r,new URL(".",e).href)}const ps={standard:new A(.18,.38,1),front:new A(0,.15,1),side:new A(1,.2,0),back:new A(0,.15,-1)},Ic={low:{ratio:1,shadows:!1},medium:{ratio:1.5,shadows:!0},high:{ratio:2,shadows:!0}};class Ly{constructor(e,t={}){this.container=e,this.callbacks=t,this.scene=new Yl,this.camera=new vn(32,1,.02,40),this.time=0,this.period=9,this.playing=!1,this.speed=.5,this.loopRange=null,this.visible=!0,this.disposed=!1,this.contextLost=!1,this.dirty=!0,this.framingMode="main",this.loopBounds=new an,this.stageProps=[],this.renderer=new q_({alpha:!0,antialias:!0,powerPreference:"high-performance"}),this.renderer.setClearColor(1052950,0),this.renderer.outputColorSpace=ln,this.renderer.toneMapping=sd,this.renderer.toneMappingExposure=1.15,this.renderer.domElement.setAttribute("aria-label","托马斯全旋 3D 动画，可拖动旋转与双指缩放"),e.prepend(this.renderer.domElement),this.controls=new Ix(this.camera,this.renderer.domElement),Object.assign(this.controls,{enableDamping:!0,dampingFactor:.13,enablePan:!1,minDistance:.45,maxDistance:7,minPolarAngle:.12,maxPolarAngle:Math.PI*.9}),this.onControlsChange=()=>{this.dirty=!0},this.controls.addEventListener("change",this.onControlsChange),this.autoFrame=!0,this.controls.addEventListener("start",()=>{this.autoFrame=!1}),this.scene.add(new Hd(16184042,3947070,2)),this.keyLight=new hs(16771794,3.7),this.keyLight.position.set(-2.5,4,4),this.scene.add(this.keyLight);const n=new hs(15790847,2.2);n.position.set(2,2,-3),this.scene.add(n);const r=new hs(14869226,.8);r.position.set(4,.7,2),this.scene.add(r),this.createEnvironment(),this.scene.environmentIntensity=.32,this.renderer.shadowMap.type=id,this.keyLight.shadow.mapSize.set(1024,1024),this.keyLight.shadow.bias=-4e-4,this.keyLight.shadow.normalBias=.02,this.keyLight.shadow.radius=6,Object.assign(this.keyLight.shadow.camera,{left:-1.9,right:1.9,top:1.9,bottom:-1.9,near:1,far:12}),this.keyLight.shadow.camera.updateProjectionMatrix(),this.shadowCatcher=new Xt(new Ps(8,8),new nx({color:0,opacity:.28})),this.shadowCatcher.rotation.x=-Math.PI/2,this.shadowCatcher.position.y=-.006,this.shadowCatcher.receiveShadow=!0,this.floor=Dy(),this.stageProps.push(this.shadowCatcher,this.floor),this.scene.add(...this.stageProps),this.setQuality("medium"),this.resizeObserver=new ResizeObserver(()=>this.resize()),this.resizeObserver.observe(e),this.resize(),this.onVisibility=()=>{document.hidden?(this.playing=!1,this.stop(),t.onTime?.(this.time)):this.visible&&(this.dirty=!0,this.start())},this.onContextLost=s=>{s.preventDefault(),this.contextLost=!0,this.playing=!1,this.stop(),Nc(this.scene),this.coach?.traverse(o=>{o.skeleton?.boneTexture?.dispose()}),this.keyLight.shadow.map?.dispose(),this.keyLight.shadow.map=null,this.scene.environment=null,this.environment?.dispose(),this.environment=null,t.onContext?.(!1),t.onTime?.(this.time)},this.onContextRestored=()=>{this.contextLost=!1,this.createEnvironment(),this.dirty=!0,this.resize(),this.start(),t.onContext?.(!0)},document.addEventListener("visibilitychange",this.onVisibility),this.renderer.domElement.addEventListener("webglcontextlost",this.onContextLost),this.renderer.domElement.addEventListener("webglcontextrestored",this.onContextRestored)}createEnvironment(){this.environment?.dispose();const e=new yl(this.renderer),t=new jx;this.environment=e.fromScene(t,.04),this.scene.environment=this.environment.texture,t.dispose(),e.dispose()}async load(){const[e,t]=await Promise.all([lf("./coach/flare-coach.meshopt.glb.gz"),fetch(new URL("./coach/coach-rig.json",document.baseURI)).then(n=>{if(!n.ok)throw new Error("rig_load_failed");return n.json()})]);if(this.disposed){Nc(e.scene);return}this.coach=e.scene,this.motion=Cv({model:this.coach,rigData:t}),this.coach.traverse(n=>{n.isMesh&&(n.castShadow=this.renderer.shadowMap.enabled)}),this.scene.add(this.coach),this.period=this.motion.getMetrics().period;for(let n=0;n<18;n++){this.motion.update(n*this.period/18);const r=this.motion.getMetrics().bounds;this.loopBounds.union(new an(new A().fromArray(r.min),new A().fromArray(r.max)))}this.loopBounds.expandByScalar(t.height*.045),this.pacing=Pv(this.coach,this.motion,0),this.setTime(0),this.resetView(),this.start()}start(){this.running||this.disposed||this.contextLost||!this.visible||document.hidden||(this.running=!0,this.last=performance.now(),this.renderer.setAnimationLoop(e=>this.tick(e)))}stop(){this.running=!1,this.renderer.setAnimationLoop(null)}tick(e){const t=Math.min(Math.max((e-this.last)/1e3,0),.06);if(this.last=e,this.motion&&this.playing){const n=this.paceStep(t);if(this.loopRange){const[r,s]=this.loopRange,o=s-r;this.time=r+((this.time-r+n)%o+o)%o}else this.time=(this.time+n)%this.period;this.motion.update(this.time),this.callbacks.onTime?.(this.time),this.dirty=!0}this.controls.update(),this.dirty&&(this.renderer.render(this.displayScene??this.scene,this.camera),this.dirty=!1,this.callbacks.onRender?.())}setTime(e){this.time=Nt.clamp(e,0,this.period),this.motion?.update(this.time),this.coach?.updateMatrixWorld(!0),this.dirty=!0,this.callbacks.onTime?.(this.time)}pacingRate(e){return Jd(this.pacing,this.motion,e,this.period)}paceStep(e){return Lv(this.pacing,this.motion,this.time,e,this.speed,this.period)}getMetrics(){return this.motion?.getMetrics()??null}setDisplayScene(e=null){this.displayScene=e,this.dirty=!0}setVisible(e){this.visible=!!e,this.visible&&!document.hidden?(this.dirty=!0,this.start()):(this.playing=!1,this.stop(),this.callbacks.onTime?.(this.time))}setQuality(e){this.quality=e in Ic?e:"medium";const t=Ic[this.quality];this.updatePixelRatio(),this.renderer.shadowMap.enabled=t.shadows,this.keyLight.castShadow=t.shadows,this.shadowCatcher.visible=t.shadows,this.coach?.traverse(n=>{n.isMesh&&(n.castShadow=t.shadows)}),this.dirty=!0,this.resize()}updatePixelRatio(){const e=this.framingMode==="detail"&&this.quality!=="low"?2:1;this.renderer.setPixelRatio(Math.min(Math.max(window.devicePixelRatio||1,e),Math.max(Ic[this.quality].ratio,e)))}resize(){const e=this.container.clientWidth,t=this.container.clientHeight;if(!(e>0&&t>0))return;const n=this.camera.aspect!==e/t;this.camera.aspect=e/t;const r=this.framingMode==="main"&&e<=600&&t>=500;this.insetLeft=this.framingMode==="detail"||r?0:t<=320?48:64,this.offsetY=r?t*(.5-187/650):0,this.offsetX=r?e*10/390:0,this.camera.setViewOffset(e,t,this.offsetX-this.insetLeft/2,this.offsetY,e,t),this.camera.updateProjectionMatrix(),this.renderer.setSize(e,t),n&&this.autoFrame&&this.motion&&this.resetView(),n&&this.framingMode==="detail"&&this.callbacks.onResize?.(),this.dirty=!0}setFramingMode(e){this.framingMode=e,this.updatePixelRatio(),this.resize()}resetView(e=ps.standard){this.autoFrame=!0;const t=this.container.clientWidth<=600&&this.container.clientHeight>=500;this.fitBounds(this.loopBounds,e,t?.72:this.container.clientWidth<=600?.78:.74)}setCameraView(e,t){const n=this.controls.enableDamping;this.controls.enableDamping=!1,this.controls.update(),this.controls.enableDamping=n,this.controls.target.copy(t),this.camera.position.copy(e),this.controls.update(),this.dirty=!0}fitBounds(e,t,n=1){if(e.isEmpty())return;const r=t.clone().normalize(),s=e.getCenter(new A),o=new A().crossVectors(new A(0,1,0),r).normalize(),a=new A().crossVectors(r,o).normalize(),c=Math.tan(Nt.degToRad(this.camera.fov/2)),l=c*this.camera.aspect*Math.max(.4,(this.container.clientWidth-(this.insetLeft||0))/this.container.clientWidth);let h=.6;for(const u of[e.min.x,e.max.x])for(const d of[e.min.y,e.max.y])for(const p of[e.min.z,e.max.z]){const g=new A(u,d,p).sub(s),b=g.dot(r);h=Math.max(h,b+Math.abs(g.dot(a))/c,b+Math.abs(g.dot(o))/l)}this.setCameraView(s.clone().addScaledVector(r,h*n),s)}project(e){const t=e.clone().project(this.camera),n=this.renderer.domElement.getBoundingClientRect();return{x:(t.x+1)*.5*n.width,y:(1-t.y)*.5*n.height,behind:t.z>1||t.z<-1}}dispose(){this.disposed||(this.disposed=!0,this.stop(),this.resizeObserver.disconnect(),document.removeEventListener("visibilitychange",this.onVisibility),this.renderer.domElement.removeEventListener("webglcontextlost",this.onContextLost),this.renderer.domElement.removeEventListener("webglcontextrestored",this.onContextRestored),this.controls.removeEventListener("change",this.onControlsChange),this.controls.dispose(),Nc(this.scene),this.environment?.dispose(),this.renderer.dispose(),this.renderer.domElement.remove())}}function Dy(){const i=document.createElement("canvas");i.width=i.height=256;const e=i.getContext("2d"),t=e.createRadialGradient(128,128,0,128,128,128);t.addColorStop(0,"rgba(255,255,255,.055)"),t.addColorStop(.45,"rgba(255,255,255,.018)"),t.addColorStop(1,"rgba(255,255,255,0)"),e.fillStyle=t,e.fillRect(0,0,256,256);const n=new tx(i);n.colorSpace=ln;const r=new Xt(new Ps(4.2,4.2),new Bi({map:n,transparent:!0,depthWrite:!1}));return r.rotation.x=-Math.PI/2,r.position.y=-.014,r.renderOrder=-1,r}function Nc(i){const e=new Set,t=new Set,n=new Set;i.traverse(r=>{r.geometry&&e.add(r.geometry);for(const s of r.material?[].concat(r.material):[]){t.add(s);for(const o of Object.values(s))o?.isTexture&&n.add(o)}});for(const r of[...e,...t,...n])r.dispose()}const hf=[{source:9,id:"rear-support",name:"后侧支撑",detail:"长腿过前方",caption:"双手推地撑住身体，屈髋把开立的长腿抬过身体前方；腹部卷紧，臀中肌保持开腿。",primary:[{id:"triceps",side:"support",why:"双臂伸直锁肘，把身体撑离地面。"},{id:"deltoids",side:"support",why:"肩前倾在手的上方，控制承重肩。"},{id:"hip-flexors",side:"both",why:"主动屈髋，把长腿抬过身体前方。"},{id:"abs",side:"both",why:"卷腹折叠躯干，给抬腿留出空间。"},{id:"hip-abductors",side:"both",why:"双腿保持大开度，过前方时不合拢。"}],secondary:[{id:"serratus",side:"support"},{id:"forearms",side:"support"},{id:"adductors",side:"both"},{id:"quadriceps",side:"both"}]},{source:10,id:"first-transfer",name:"第一侧移重",detail:"单手接重",caption:"重量从双手移到单手：支撑侧三角肌、肱三头肌和前锯肌一起接住体重，腕屈肌稳住掌根；腹斜肌把骨盆转向侧面。",primary:[{id:"deltoids",side:"support",why:"整个上身的重量转到这一侧肩上。"},{id:"triceps",side:"support",why:"支撑臂伸肘锁住，不让手肘弯塌。"},{id:"serratus",side:"support",why:"肩胛贴住胸廓前伸，主动把地面推远。"},{id:"forearms",side:"support",why:"掌根刚接住体重，腕屈肌控制手腕不塌。"},{id:"obliques",side:"both",why:"转动躯干，让骨盆跟着摆腿转向侧面。"}],secondary:[{id:"rotator-cuff",side:"support"},{id:"hip-abductors",side:"free"},{id:"glute-max",side:"support"}]},{source:11,id:"first-support",name:"第一侧支撑",detail:"高 V 开腿",caption:"单手撑起全身、身体侧立：支撑肩最吃力，肩袖护住肩关节；腹斜肌把髋撑高，臀中肌打开高 V 字腿。",primary:[{id:"deltoids",side:"support",why:"单臂承担全身重量，肩部负荷最大的时刻。"},{id:"triceps",side:"support",why:"手臂保持笔直，身体才能侧立撑高。"},{id:"rotator-cuff",side:"support",why:"手臂举过头承重，肩袖把肱骨头稳在关节里。"},{id:"obliques",side:"both",why:"侧面核心把骨盆撑高，身体不往下塌。"},{id:"hip-abductors",side:"both",why:"臀中肌外展双腿，撑开高 V 字。"}],secondary:[{id:"serratus",side:"support"},{id:"forearms",side:"support"},{id:"lats",side:"support"},{id:"adductors",side:"both"}]},{source:12,id:"first-pass",name:"第一侧换腿",detail:"准备回撑",caption:"身体转向正面，双腿像剪刀一样换位过前：屈髋肌和腹直肌把腿带到前方，内收肌控制两腿交错；另一只手准备回撑。",primary:[{id:"triceps",side:"support",why:"仍是单手支撑，伸肘把身体顶住。"},{id:"deltoids",side:"support",why:"身体转向正面，承重肩随之转动控制。"},{id:"hip-flexors",side:"both",why:"屈髋把扫行的腿带到身体前方。"},{id:"abs",side:"both",why:"收腹折叠，骨盆抬住，给腿让出通道。"},{id:"adductors",side:"both",why:"两腿剪刀式交错，内收肌控制开合。"}],secondary:[{id:"obliques",side:"both"},{id:"quadriceps",side:"both"},{id:"serratus",side:"support"},{id:"forearms",side:"support"}]},{source:13,id:"front-support",name:"前侧支撑",detail:"开腿扫后方",caption:"双手在身后撑地、胸口朝上：肱三头肌、三角肌和胸大肌像做臂屈伸一样顶住身体；双腿保持大开度，准备向后扫。",primary:[{id:"triceps",side:"support",why:"双手在身后推地，伸肘把身体顶起。"},{id:"deltoids",side:"support",why:"肩在后伸位承重，前束最吃力。"},{id:"chest",side:"support",why:"胸大肌协助肩部在后伸位推地。"},{id:"hip-abductors",side:"both",why:"双腿抬高大开度，准备向后扫。"}],secondary:[{id:"scapular",side:"support"},{id:"hip-flexors",side:"both"},{id:"abs",side:"both"},{id:"forearms",side:"support"},{id:"glute-max",side:"both"}]},{source:14,id:"second-transfer",name:"第二侧移重",detail:"换手接重",caption:"换到另一只手单撑：支撑侧肩臂和前锯肌重新接住体重，腕屈肌稳住掌根；臀大肌带长腿从前方扫向后方。",primary:[{id:"deltoids",side:"support",why:"体重换到这一侧肩上，重新接住。"},{id:"triceps",side:"support",why:"新的支撑臂伸肘锁住。"},{id:"serratus",side:"support",why:"肩胛前伸推地，肩不往下沉。"},{id:"forearms",side:"support",why:"掌根刚接重，腕屈肌控制手腕。"},{id:"glute-max",side:"both",why:"伸髋发力，把长腿从前方扫向后方。"}],secondary:[{id:"rotator-cuff",side:"support"},{id:"obliques",side:"both"},{id:"hip-abductors",side:"free"},{id:"hamstrings",side:"both"}]},{source:15,id:"second-support",name:"第二侧支撑",detail:"高 V 开腿",caption:"另一侧单手侧撑：支撑肩与肩袖承担全身重量；腹斜肌撑高骨盆，臀中肌保持高 V 开腿。",primary:[{id:"deltoids",side:"support",why:"单臂承担全身重量，肩部负荷最大的时刻。"},{id:"triceps",side:"support",why:"手臂保持笔直，身体才能侧立撑高。"},{id:"rotator-cuff",side:"support",why:"手臂举过头承重，肩袖把肱骨头稳在关节里。"},{id:"obliques",side:"both",why:"侧面核心把骨盆撑高，身体不往下塌。"},{id:"hip-abductors",side:"both",why:"臀中肌外展双腿，撑开高 V 字。"}],secondary:[{id:"serratus",side:"support"},{id:"forearms",side:"support"},{id:"lats",side:"support"},{id:"adductors",side:"both"}]},{source:16,id:"second-pass",name:"第二侧换腿",detail:"准备接圈",caption:"身体转回朝下，双腿扫过后方：臀大肌伸髋带腿，竖脊肌保持髋部高度，腹斜肌把身体旋回；另一只手准备落地接回下一圈。",primary:[{id:"deltoids",side:"support",why:"单手支撑中身体旋回，承重肩随之控制。"},{id:"triceps",side:"support",why:"伸肘撑住，直到另一只手落地。"},{id:"glute-max",side:"both",why:"伸髋把长腿扫过身体后方。"},{id:"erectors",side:"both",why:"背部伸展肌群保持髋部高度，不塌腰。"},{id:"obliques",side:"both",why:"躯干旋回，把身体接回后侧支撑。"}],secondary:[{id:"hamstrings",side:"both"},{id:"serratus",side:"support"},{id:"forearms",side:"support"},{id:"hip-abductors",side:"both"}]}],$u=Object.fromEntries(hf.map(i=>[i.source,i])),Iy={rear:9,sideA:11,front:13,sideB:15},Ny=i=>{const e=Number(i?.sourceStepNumber??i?.source?.stepNumber);return Number.isSafeInteger(e)?e:null};function Fy(i){return $u[Ny(i)]??$u[Iy[i?.phase]]??hf[0]}function Uy(i){const e=i?.pose?.limbs,t=e?.left?.handLocked===!0,n=e?.right?.handLocked===!0;return t&&!n?"left":n&&!t?"right":"both"}function Oy(i,{smooth:e=!1}={}){const t=Array.isArray(i?.steps)?i.steps:[],n=Number(i?.period)||9;if(!t.length)return{period:n,keys:[]};const r=new Set(i.skippedSteps??[]),s=e?t.length-1:t.length,o=e?n/(s+1):n/t.length,a=[];for(let c=0;c<s;c++)r.has(c)||a.push({time:c*o,index:c,phase:Fy(t[c]),support:Uy(t[c])});return{period:n,keys:a}}function ky(i,e,t=.16){const{keys:n,period:r}=i;if(!n?.length)return null;const s=(e%r+r)%r,o=n.length,a=_=>{const I=(_%o+o)%o;return{...n[I],t:n[I].time+Math.floor(_/o)*r}};let c=-1;for(;c<o-1&&n[c+1].time<=s;)c++;const l=a(c),h=a(c+1),u=(l.t+h.t)/2,d=s<u?c:c+1,p=a(d),g=a(d-1),b=a(d+1),m=(g.t+p.t)/2,f=(p.t+b.t)/2;let M=null,x=0;return f-s<t?(M=b,x=.5*(1-(f-s)/t)):s-m<t&&(M=g,x=.5*(1-(s-m)/t)),{current:p,neighbour:M,w:x,t:s}}function By(i,e){const t=n=>n==="both"||e==="both"?"both":n==="support"?e:n==="free"?e==="left"?"right":"left":n==="left"||n==="right"?n:"both";return[...i.primary.map(n=>({groupId:n.id,level:"primary",side:t(n.side),why:n.why??""})),...i.secondary.map(n=>({groupId:n.id,level:"secondary",side:t(n.side),why:n.why??""}))]}const zy=i=>i==="both"?"双手支撑":i==="left"?"左手支撑":"右手支撑",uf=[{groupId:"deltoids",section:"support",colour:"#4cc9f0",label:"三角肌",view:"front",role:"前、中、后束协同控制承重肩，接住每一次换手。"},{groupId:"rotator-cuff",section:"support",colour:"#a29bfe",label:"肩袖肌群",view:"back",role:"位于深层，帮助稳定肱骨头，支撑方向不断变化时护住肩关节。",note:"仅用冈下肌位置示意（斜线＝深层）；冈上肌、小圆肌、肩胛下肌未单独绘制。"},{groupId:"triceps",section:"support",colour:"#2f6bff",label:"肱三头肌",view:"back",role:"伸肘锁住支撑臂，手臂保持伸直受控。"},{groupId:"forearms",section:"support",label:"前臂 · 腕屈伸肌",colour:"#9ad1e8",view:"front",role:"掌根撑地时控制手腕与手指，平稳落手、卸载。",note:"屈肌群与伸肌群各合为一块面板；手部小肌群未绘制。"},{groupId:"serratus",section:"support",colour:"#5eead4",label:"前锯肌",view:"front",role:"让肩胛贴着胸廓前伸，主动把地面推远。",note:"只画出胸廓侧面可见的部分；被肩胛骨覆盖的部分未绘制。"},{groupId:"scapular",section:"support",label:"斜方肌中下部 · 菱形肌",colour:"#86efc4",view:"back",role:"协同调整肩胛位置，维持肩带与地面之间的支撑空间。",note:"菱形肌在斜方肌深层，这里与斜方肌中下部合为一块面板。"},{groupId:"chest",section:"support",colour:"#6f8dff",label:"胸大肌",view:"front",role:"前撑转侧撑时，配合控制上臂相对胸廓的方向。"},{groupId:"lats",section:"support",colour:"#00a896",label:"背阔肌",view:"back",role:"连接上臂与躯干，参与肩部下压与身体随支撑转移。"},{groupId:"abs",section:"core",colour:"#c466ff",label:"腹直肌（含深层腹横肌）",view:"front",role:"卷腹折叠躯干，与深层腹横肌一起稳住骨盆，给抬腿留出空间。",note:"面板为腹直肌；腹横肌位于深层，没有单独面板。"},{groupId:"obliques",section:"core",colour:"#ff6fb5",label:"腹斜肌",view:"front",role:"参与躯干旋转与侧向控制，让肩与骨盆随摆腿转动。",note:"面板为腹外斜肌；腹内斜肌在其深层，未单独绘制。"},{groupId:"erectors",section:"core",colour:"#e3b3ff",label:"竖脊肌",view:"back",role:"控制脊柱伸展与躯干位置，后撑时帮助保持髋高。",note:"腰方肌（腰部深层）暂无面板，未显示。"},{groupId:"hip-flexors",section:"core",colour:"#ff9ec7",label:"髋屈肌",view:"front",role:"位于骨盆深处，主动屈髋，把长腿从身体前方抬过去。",note:"髂腰肌在深层（斜线），与阔筋膜张肌合为一块面板示意；股直肌见股四头肌。"},{groupId:"glute-max",section:"legs",colour:"#ffb703",label:"臀大肌",view:"back",role:"髋伸展与后方扫腿（深层髋旋转肌配合调整腿的方向）。",note:"深层髋外旋肌群没有单独面板。"},{groupId:"hip-abductors",section:"legs",colour:"#ff7b2e",label:"臀中肌 · 髋外展",view:"back",role:"主动开腿并控制骨盆，离地后双腿不合拢。",note:"臀小肌在臀中肌深层，未单独绘制。"},{groupId:"adductors",section:"legs",colour:"#b5e655",label:"内收肌群",view:"front",role:"控制腿向中线回收与开度变化，衔接下一段扫腿。",note:"长收肌、短收肌、大收肌、股薄肌合为一块面板。"},{groupId:"quadriceps",section:"legs",colour:"#ffe45c",label:"股四头肌",view:"front",role:"保持膝部伸直，让长腿连续绕行。",note:"股中间肌位于深层，未单独绘制。"},{groupId:"hamstrings",section:"legs",colour:"#e9a46a",label:"腘绳肌",view:"back",role:"后侧长腿线条，参与髋伸与膝部控制。"}];Object.fromEntries(uf.map(i=>[i.groupId,i.colour]));const hi=Object.fromEntries(uf.map(i=>[i.groupId,i])),df=Oy(Cl,{smooth:!0});function Rn(i){const e=ky(df,i,.16),t=e.current;return{source:t.phase.source,id:t.phase.id,name:t.phase.name,caption:t.phase.caption,support:t.support,supportText:zy(t.support),items:By(t.phase,t.support).map(n=>({...n,colour:hi[n.groupId].colour,label:hi[n.groupId].label}))}}const Zu=df.keys.map(i=>({phase:i.phase.source,time:i.time})),Ar=(i,e)=>i.clone().lerp(e,.5),_n=(i,e,t)=>i.clone().lerp(e,t),Hy=i=>i==="left"?"right":"left",Vy={deltoids:(i,e)=>_n(i(e+"Shoulder"),i(e+"Elbow"),.12),"rotator-cuff":(i,e)=>_n(i(e+"Shoulder"),Ar(i("leftShoulder"),i("rightShoulder")),.35),triceps:(i,e)=>_n(i(e+"Shoulder"),i(e+"Elbow"),.55),forearms:(i,e)=>_n(i(e+"Elbow"),i(e+"Wrist"),.4),serratus:(i,e)=>_n(i(e+"Shoulder"),i(e+"Hip"),.32),scapular:(i,e)=>_n(Ar(i("leftShoulder"),i("rightShoulder")),i(e+"Shoulder"),.35),chest:(i,e)=>_n(Ar(i("leftShoulder"),i("rightShoulder")),i(e+"Shoulder"),.45).add(new A(0,-.05,0)),lats:(i,e)=>_n(i(e+"Shoulder"),i(e+"Hip"),.45),abs:i=>_n(Ar(i("leftShoulder"),i("rightShoulder")),Ar(i("leftHip"),i("rightHip")),.62),obliques:(i,e)=>_n(i(e+"Shoulder"),i(e+"Hip"),.7),erectors:i=>_n(Ar(i("leftShoulder"),i("rightShoulder")),Ar(i("leftHip"),i("rightHip")),.75),"hip-flexors":(i,e)=>_n(i(e+"Hip"),i(e+"Knee"),.08),"glute-max":(i,e)=>_n(i(e+"Hip"),i(Hy(e)+"Hip"),.2),"hip-abductors":(i,e)=>_n(i(e+"Hip"),i(e+"Knee"),.02),adductors:(i,e)=>_n(i(e+"Hip"),i(e+"Knee"),.35),quadriceps:(i,e)=>_n(i(e+"Hip"),i(e+"Knee"),.55),hamstrings:(i,e)=>_n(i(e+"Hip"),i(e+"Knee"),.6)};function Gy(i,e,t=45){const n=i.getMetrics().joints,r=o=>new A().fromArray(n[o]??n.pelvis),s=[];for(const o of e.filter(a=>a.level==="primary")){const a=Vy[o.groupId];if(!a)continue;const l=(o.side==="both"?["left","right"]:[o.side]).map(d=>({side:d,point:a(r,d)}));l.sort((d,p)=>d.point.distanceToSquared(i.camera.position)-p.point.distanceToSquared(i.camera.position));const h=l[0],u=i.project(h.point);u.behind||u.x<12||u.y<12||u.x>i.container.clientWidth-12||u.y>i.container.clientHeight-12||s.some(d=>Math.hypot(d.x-u.x,d.y-u.y)<t)||s.push({...u,groupId:o.groupId,label:o.label,colour:o.colour,side:h.side})}return s}const Wy=[["skinHead","","skin",[0,1.6,.01],[.105,.125,.125],0,0,"k"],["skinHand","","skin",[.4,.78,.09],[.065,.105,.09],.35,0,"k"],["skinFoot","","skin",[.17,.03,.03],[.08,.085,.15],0,0,"k"],["skinKnee","","skin",[.135,.47,.03],[.06,.04,.07],.05,0,"k"],["skinShin","","skin",[.128,.3,.01],[.026,.15,.03],-.05,0,"k"],["neck","胸锁乳突肌","neck",[.03,1.47,.055],[.024,.065,.04],.25,-.45,""],["trapUpper","斜方肌上部","trap",[.075,1.43,-.03],[.1,.075,.075],-.3,.1,"m"],["deltFront","三角肌前束","delt",[.18,1.34,.05],[.048,.085,.048],.25,0,""],["deltSide","三角肌中束","delt",[.215,1.33,0],[.048,.09,.06],.3,0,""],["deltRear","三角肌后束","delt",[.18,1.34,-.06],[.048,.085,.048],.25,0,""],["pec","胸大肌","pec",[.08,1.29,.12],[.105,.08,.075],.1,0,"m"],["biceps","肱二头肌","biceps",[.245,1.19,.035],[.04,.11,.045],.36,0,""],["triceps","肱三头肌","triceps",[.258,1.2,-.045],[.045,.13,.05],.36,0,""],["forearmFlex","前臂屈肌群","forearm",[.335,.98,.05],[.04,.11,.04],.37,0,""],["forearmExt","前臂伸肌群","forearm",[.35,.98,0],[.04,.11,.045],.37,0,""],["serratus","前锯肌","serratus",[.135,1.18,.075],[.04,.06,.05],-.15,0,""],["abs","腹直肌","abs",[.036,1.03,.14],[.048,.215,.06],0,0,"ma"],["oblique","腹外斜肌","oblique",[.132,1.02,.06],[.05,.12,.08],.08,0,""],["infraspinatus","冈下肌（肩袖）","infra",[.11,1.29,-.095],[.055,.055,.045],0,0,""],["scapular","菱形肌 / 斜方肌中下部","trap",[.04,1.25,-.1],[.05,.13,.045],0,0,"m"],["lats","背阔肌","lats",[.125,1.13,-.065],[.07,.13,.07],-.15,0,""],["erectors","竖脊肌","erectors",[.035,.99,-.075],[.04,.13,.045],0,0,"m"],["gluteMed","臀中肌","gluteMed",[.15,.91,-.03],[.055,.06,.065],0,0,"c"],["glutes","臀大肌","glutes",[.085,.83,-.085],[.1,.09,.07],0,0,"mc"],["hipFlexor","髂腰肌 / 阔筋膜张肌","hipFlexor",[.12,.87,.08],[.055,.065,.05],0,0,"c"],["quadRect","股直肌","quads",[.105,.65,.1],[.045,.16,.05],.05,0,"c"],["quadLat","股外侧肌","quads",[.165,.64,.068],[.045,.16,.055],.05,0,"c"],["quadMed","股内侧肌","quads",[.085,.52,.075],[.04,.08,.045],.02,0,""],["adductors","内收肌群","adductors",[.05,.67,.01],[.045,.14,.06],.05,0,"c"],["hamLat","股二头肌","ham",[.162,.62,-.042],[.045,.17,.05],.04,0,"c"],["hamMed","半腱肌 / 半膜肌","ham",[.085,.62,-.055],[.045,.17,.05],.04,0,"c"],["tibialis","胫骨前肌","tibialis",[.178,.32,-.01],[.026,.12,.032],0,0,""],["calfMed","腓肠肌内侧头","calf",[.13,.35,-.085],[.04,.1,.045],0,0,""],["calfLat","腓肠肌外侧头","calf",[.18,.35,-.08],[.04,.1,.045],0,0,""]],qy=[["adductors",[0,.79,.02],[.055,.07,.065],0,0]],ff=1.4,hr=Wy.map(([i,e,t,n,r,s,o,a],c)=>{const l=a.includes("k");return{id:i,name:e,family:t,centre:n,radius:l?r:r.map(h=>h*ff),tz:s,tx:o,skin:l,mid:a.includes("m"),abs:a.includes("a"),cloth:a.includes("c"),index:c}}),fr=Object.fromEntries(hr.map(i=>[i.id,i])),jy=["skin",...new Set(hr.map(i=>i.family).filter(i=>i!=="skin"))],pf=hr.length,no=[...hr.map(i=>({...i,parent:i.index})),...qy.map(([i,e,t,n,r])=>({centre:e,radius:t.map(s=>s*ff),tz:n,tx:r,parent:fr[i].index}))],Xy=no.length,Fl=fr.abs.index,mf=14,Qy=i=>{const e=Math.min(Math.max((1.03-i)/.2,0),1),t=Math.min(Math.max((i-1.08)/.14,0),1);return .09-.064*e**1.6-.014*t*t*(3-2*t)},Ky=(i,e,t)=>{const n=Qy(e)-i,r=e-.832,s=Math.max(.012-Math.abs(n-r),0)/.012;return Math.min(Math.min(n,r)-s*s*.003,t-.04)},Yy=(i,e,t)=>{const n=Math.min(Math.max((t-i)/(e-i),0),1);return n*n*(3-2*n)},Ma={deltoids:{label:"三角肌",muscles:["deltFront","deltSide","deltRear"]},"rotator-cuff":{label:"肩袖肌群",muscles:["infraspinatus"],deep:!0},triceps:{label:"肱三头肌",muscles:["triceps"]},serratus:{label:"前锯肌",muscles:["serratus"]},scapular:{label:"肩胛稳定肌群",muscles:["scapular"]},obliques:{label:"腹斜肌",muscles:["oblique"]},erectors:{label:"竖脊肌",muscles:["erectors"]},"hip-flexors":{label:"髋屈肌",muscles:["hipFlexor"],deep:!0},quadriceps:{label:"股四头肌",muscles:["quadRect","quadLat","quadMed"]},glutes:{label:"臀肌",muscles:["glutes","gluteMed"]},"glute-max":{label:"臀大肌",muscles:["glutes"]},"hip-abductors":{label:"臀中肌 · 髋外展",muscles:["gluteMed"]},"hip-rotators":{label:"髋外旋肌群",muscles:["glutes"],deep:!0},adductors:{label:"内收肌群",muscles:["adductors"]},hamstrings:{label:"腘绳肌",muscles:["hamLat","hamMed"]},chest:{label:"胸大肌",muscles:["pec"]},pectorals:{label:"胸肌",muscles:["pec"]},abs:{label:"腹直肌",muscles:["abs"]},biceps:{label:"肱二头肌",muscles:["biceps"]},forearms:{label:"前臂肌群",muscles:["forearmFlex","forearmExt"]},traps:{label:"斜方肌",muscles:["trapUpper","scapular"]},lats:{label:"背阔肌",muscles:["lats"]},calves:{label:"小腿三头肌",muscles:["calfMed","calfLat"]},tibialis:{label:"胫骨前肌",muscles:["tibialis"]},neck:{label:"颈部肌群",muscles:["neck"]}};function lo(i){if(Ma[i])return Ma[i];const e=fr[i];return e?{label:e.name,muscles:[e.id]}:null}function $y(i,e,t,n){let r=e-i.centre[0],s=t-i.centre[1],o=n-i.centre[2];const a=Math.cos(i.tz),c=Math.sin(i.tz);[r,s]=[r*a+s*c,s*a-r*c];const l=Math.cos(i.tx),h=Math.sin(i.tx);return[s,o]=[s*l+o*h,o*l-s*h],[r,s,o]}function gf(i,e=1.69){const t=1.69/e,n=Math.abs(i.x)*t,r=i.y*t,s=i.z*t,o=new Float64Array(pf).fill(-9);let a=-9;for(const p of no){const[g,b,m]=$y(p,n,r,s),f=1-Math.hypot(g/p.radius[0],b/p.radius[1],m/p.radius[2]);p.parent===Fl?a=f:o[p.parent]=Math.max(o[p.parent],f)}const c=Math.max(...o),l=(a-c)*.1+Yy(1.13,1.08,r);o[Fl]=Math.max(c,0)+mf*Math.min(Ky(n,r,s),l);let h=-1,u=-1,d=null;return o.forEach((p,g)=>{p>h?(u=h,h=p,d=hr[g].id):p>u&&(u=p)}),h>.02&&!fr[d].skin?{id:d,name:fr[d].name,side:i.x>=0?"left":"right",score:h,margin:h-Math.max(u,0)}:null}function bf(){return{mmC:{value:no.map(i=>new mt(...i.centre,i.parent))},mmR:{value:no.map(i=>new A(...i.radius))},mmT:{value:no.map(i=>new mt(Math.cos(i.tz),Math.sin(i.tz),Math.cos(i.tx),Math.sin(i.tx)))},mmF:{value:hr.map(i=>new mt(jy.indexOf(i.family),i.mid?1:0,i.abs?1:0,i.cloth?1:0))},mmState:{value:hr.map(()=>new mt(0,0,0,0))},mmCol:{value:hr.map(()=>new st("#ff5a36"))},mmMulti:{value:0},mmScale:{value:1},mmTime:{value:0},mmReveal:{value:1},mmDebug:{value:0},mmAccent:{value:new st("#ff5a36")},mmAccent2:{value:new st("#ffae5c")},mmBase:{value:new st("#939dab")},mmSkin:{value:new st("#7f8896")},mmGroove:{value:new st("#3f4859")},mmFabric:{value:new st("#1a2130")}}}const Zy=`
#define MM_N ${pf}
#define MM_NE ${Xy}
#define MM_ABS ${Fl}
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
    float sa = max(b1, 0.0) + ${mf.toFixed(1)} * min(mmAbsInside(p), top);
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
}`;function Jy(i,e,{clothing:t=!1}={}){i.onBeforeCompile=n=>{Object.assign(n.uniforms,e),n.vertexShader=`varying vec3 vMmPos;
`+n.vertexShader.replace("#include <begin_vertex>",`#include <begin_vertex>
vMmPos = transformed;`),n.fragmentShader=Zy+`
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
        }`)},i.customProgramCacheKey=()=>"muscle-map-v4"+(t?"-c":""),i.needsUpdate=!0}function _f(i,e){const t=i.mmState.value,n=new Set;for(const r of t)r.x=0,r.y=0,r.w=0;for(const r of e){const s=fr[r.muscle];if(!s)continue;const o=t[s.index],a=r.level==="deep"?-1:r.level==="secondary"?.6:1,c=u=>u===1?3:u===-1?2:u?1:0;c(a)>c(o.x)&&(o.x=a);const l=r.side==="left"?1:r.side==="right"?-1:0,h=!n.has(s.index);o.y=!h&&o.y!==l?0:l,n.add(s.index),r.colour&&i.mmCol.value[s.index].set(r.colour),o.w=h?r.dim??0:Math.min(o.w,r.dim??0)}}function Ul(i,e=[]){const t=i.mmState.value;for(const n of t)n.z=0;for(const n of e){const r=fr[n];r&&(t[r.index].z=1)}}function xf(i,e,{posed:t=!1,thumbnail:n=!1,density:r=null}={}){Jy(i,e);const s=i.onBeforeCompile,o=r??{value:1};i.onBeforeRender=a=>{(!r||a.getRenderTarget()===null)&&(o.value=a.getPixelRatio())},i.onBeforeCompile=(a,c)=>{s(a,c),a.uniforms.mmStrokeDensity=o,t&&(a.vertexShader=`attribute vec3 mmRest;
`+a.vertexShader.replace("vMmPos = transformed;","vMmPos = mmRest;")),a.fragmentShader=`uniform float mmStrokeDensity;
float mmPanelCoverage;
`+a.fragmentShader;const l=(u,d)=>{if(!a.fragmentShader.includes(u))throw new Error("functional_shader_source_mismatch");a.fragmentShader=a.fragmentShader.replace(u,d)},h=/#include <normal_fragment_maps>\s*\{\s*float h = mmEdge \* mmIsMuscle;[\s\S]*?normal = normalize\(abs\(fDet\) \* normal - grad\);\s*\}/;if(!h.test(a.fragmentShader))throw new Error("functional_relief_source_mismatch");a.fragmentShader=a.fragmentShader.replace(h,"#include <normal_fragment_maps>"),l("float wpx = max((sameFamily ? 0.008 : 0.022) / g, sameFamily ? 0.6 : 1.05);","float wpx = clamp((sameFamily ? 0.008 : 0.022) / g, (sameFamily ? 0.18 : 0.28) * mmStrokeDensity, (sameFamily ? 0.35 : 0.55) * mmStrokeDensity);"),l("float mw = max((mmF[i1].z > 0.5 ? mix(0.0015, 0.0024, smoothstep(0.95, 1.05, p.y)) : 0.0022) / ag, 0.7);","float mw = clamp((mmF[i1].z > 0.5 ? mix(0.0015, 0.0024, smoothstep(0.95, 1.05, p.y)) : 0.0022) / ag, 0.20 * mmStrokeDensity, 0.45 * mmStrokeDensity);"),l("float lw = max(0.0015 / yg, 0.6);","float lw = clamp(0.0015 / yg, 0.18 * mmStrokeDensity, 0.40 * mmStrokeDensity);"),l("float px = gap / g;","float px = gap / g; mmPanelCoverage = smoothstep(0.0, 0.9, px);"),l("float sh = mmShown * mmIsMuscle;","float sh = mmShown * mmIsMuscle * mmPanelCoverage;"),l("mmBase * mix(0.80, 1.04, mmEdge)","mmBase * mix(0.985, 1.015, mmEdge)"),l("mix(0.74, 1.0, mmEdge)","mix(0.96, 1.0, mmEdge)"),l("mix(0.78, 1.0, mmEdge)","mix(0.96, 1.0, mmEdge)"),l("mix(0.85, 1.0, mmEdge)","mix(0.97, 1.0, mmEdge)"),l("mmGrooveV * mix(0.40, 0.82, mmIsMuscle)","mmGrooveV * mix(0.06, 0.22, mmIsMuscle)"),l("lit *= 1.0 - 0.85 * mmDimV;","lit *= (1.0 - 0.85 * mmDimV) * mmPanelCoverage;"),l(`float hA = max(fwidth(vMmPos.y) * 140.0, 0.02);
          float hatch = smoothstep(0.5 - hA, 0.5 + hA, abs(fract((vMmPos.x * 0.6 + vMmPos.y - vMmPos.z * 0.5) * 70.0) - 0.5) * 2.0);`,`float stripe = (vMmPos.x * 0.6 + vMmPos.y - vMmPos.z * 0.5) * 70.0;
          float footprint = fwidth(stripe);
          float hA = max(footprint, 0.02);
          float hatch = mix(smoothstep(0.5 - hA, 0.5 + hA, abs(fract(stripe) - 0.5) * 2.0), 0.5, smoothstep(0.3, 0.8, footprint));`),t&&(l("vec3 base = mix(mmSkin, mmBase * mix(0.985, 1.015, mmEdge), mmIsMuscle);","vec3 base = mmBase;"),l("col = mix(col, mmGroove, mmGrooveV * mix(0.06, 0.22, mmIsMuscle));",""),l("float sh = mmShown * mmIsMuscle * mmPanelCoverage;","float sh = mmShown * mmIsMuscle;"),l("float hatch = mix(smoothstep(0.5 - hA, 0.5 + hA, abs(fract(stripe) - 0.5) * 2.0), 0.5, smoothstep(0.3, 0.8, footprint));","float hatch = 1.0;"),l("* (1.0 - mmGrooveV) * mmShown;","* mmShown;"),l("lit *= (1.0 - 0.85 * mmDimV) * mmPanelCoverage;","lit *= 1.0 - 0.85 * mmDimV;"),a.fragmentShader=a.fragmentShader.replace(/vec3 hot = mmMulti > 0\.5[\s\S]*?mix\(0\.96, 1\.0, mmEdge\);/,"vec3 hot = pc;"),l("mix(mmBase, pc, 0.52) * mix(0.97, 1.0, mmEdge)","mix(mmBase, pc, 0.52)")),n&&(a.fragmentShader=`#ifndef TONE_MAPPING
`+vt.tonemapping_pars_fragment+`
#endif
`+a.fragmentShader,l("#include <tonemapping_fragment>",`#include <tonemapping_fragment>
#ifndef TONE_MAPPING
 gl_FragColor.rgb = ACESFilmicToneMapping(gl_FragColor.rgb);
#endif`),l("#include <colorspace_fragment>","gl_FragColor = sRGBTransferOETF(gl_FragColor);"))},i.customProgramCacheKey=()=>"flare-functional-surface-v4-"+Number(t)+"-"+Number(n),i.needsUpdate=!0}const ea={shoulder:[.19,1.36,-.005],elbow:[.29,1.085,-.005],wrist:[.365,.875,.02],palm:[.39,.8,.04],hip:[.09,.86,0],knee:[.12,.47,0],ankle:[.15,.08,-.02],toe:[.17,.03,.13]},eM={UpperArm:["Shoulder","Elbow","shoulder","elbow"],Forearm:["Elbow","Wrist","elbow","wrist"],Hand:["Wrist","Palm","wrist","palm"],Thigh:["Hip","Knee","hip","knee"],Patella:["Knee","Ankle","knee","ankle"],Shin:["Knee","Ankle","knee","ankle"],Foot:["Ankle","Toe","ankle","toe"]};function tM(i,e){const t=i.getMetrics().time;i.reset(),e.updateMatrixWorld(!0);const n=i.getMetrics().joints,r={},s=(d,p)=>new A(p==="left"?ea[d][0]:-ea[d][0],ea[d][1],ea[d][2]);for(const d of["left","right"])for(const[p,[g,b,m,f]]of Object.entries(eM)){const M=new A().fromArray(n[d+g]),x=new A().fromArray(n[d+b]),_=s(m,d),I=s(f,d);r[d+p]={P0:M,Q0:_,rotation:new qe().setFromUnitVectors(x.clone().sub(M).normalize(),I.clone().sub(_).normalize()),scale:I.distanceTo(_)/x.distanceTo(M)}}const o=[],a=new A,c=new A,l=new A,h=new mt,u=new mt;return e.traverse(d=>{if(!d.isSkinnedMesh)return;const p=d.geometry,g=p.attributes.position.count,b=new Float32Array(g*3),m=p.attributes.skinIndex,f=p.attributes.skinWeight,M=d.skeleton.bones;d.skeleton.update();for(let x=0;x<g;x++){d.getVertexPosition(x,a).applyMatrix4(d.matrixWorld),h.fromBufferAttribute(m,x),u.fromBufferAttribute(f,x),c.set(0,0,0);let _=0;for(let I=0;I<4;I++){const R=u.getComponent(I);if(R<=0)continue;const T=r[M[h.getComponent(I)]?.name];T?l.copy(a).sub(T.P0).applyQuaternion(T.rotation).multiplyScalar(T.scale).add(T.Q0):l.copy(a),c.addScaledVector(l,R),_+=R}c.multiplyScalar(1/(_||1)),c.toArray(b,x*3)}p.setAttribute("mmRest",new wn(b,3)),o.push(d)}),i.update(t),e.updateMatrixWorld(!0),o}const da={};for(const[i,e]of Object.entries(Ma))if(hi[i])for(const t of e.muscles)(da[t]??(da[t]=[])).push(i);function nM(i,e){const t=new Gd,n=new ht,r=new A,s=new A,o=new A,a=new A,c=new Jn,l=new A,h=new A;let u=null;function d(){i.coach.updateMatrixWorld(!0);for(const g of e)g.skeleton.update(),g.computeBoundingSphere(),g.computeBoundingBox();u=i.time}function p(g,b,m){u!==i.time&&d();const f=i.renderer.domElement.getBoundingClientRect();n.set((g-f.left)/f.width*2-1,-(b-f.top)/f.height*2+1),t.setFromCamera(n,i.camera);const M=t.intersectObjects(e.filter(x=>x.visible),!1);for(const x of M){const _=x.object,I=x.face,R=_.geometry.getAttribute("mmRest");if(!I||!R||(_.getVertexPosition(I.a,r).applyMatrix4(_.matrixWorld),_.getVertexPosition(I.b,s).applyMatrix4(_.matrixWorld),_.getVertexPosition(I.c,o).applyMatrix4(_.matrixWorld),!c.set(r,s,o).getBarycoord(x.point,a)))continue;l.fromBufferAttribute(R,I.a).multiplyScalar(a.x),l.addScaledVector(h.fromBufferAttribute(R,I.b),a.y).addScaledVector(h.fromBufferAttribute(R,I.c),a.z);const T=gf(l,1.69);if(!T)continue;const F=da[T.id]??[],S=F.map(P=>m.find(Q=>Q.groupId===P&&(Q.side==="both"||Q.side===T.side))).find(Boolean),v=S?.groupId??F[0];if(v)return{groupId:v,side:T.side,panelId:T.id,inPhase:!!S}}return null}return{pick:p,prepare:d}}function iM(i){const e=bf(),t=new Map,n=new Map;e.mmMulti.value=1,e.mmReveal.value=1,e.mmTime.value=.654,e.mmBase.value.set("#818b99"),e.mmSkin.value.copy(e.mmBase.value),e.mmGroove.value.set("#596273");for(const o of i){t.set(o,o.material);const a=new Fr({color:16777215,roughness:.68,metalness:0});xf(a,e,{posed:!0}),n.set(o,a)}function r(o,a,c=!1){if(!o){s();return}const l=[...a];l.some(u=>u.groupId===o)||l.push({groupId:o,level:"primary",side:"both",colour:hi[o].colour});const h=[];for(const u of l){if(!c&&u.groupId!==o)continue;const d=lo(u.groupId);if(d)for(const p of d.muscles)h.push({muscle:p,side:u.side,colour:u.colour,level:d.deep&&u.level==="primary"?"deep":u.level,dim:u.groupId===o?0:u.level==="primary"?.45:.7})}_f(e,h),Ul(e,lo(o)?.muscles??[]);for(const[u,d]of n)u.material=d}function s(){for(const[o,a]of t)o.material=a}return{show:r,restore:s,releaseGpu(){for(const o of new Set([...t.values()].flat()))o.dispose();for(const o of n.values())o.dispose()},dispose(){s();for(const o of n.values())o.dispose()}}}function rM(i,e,t){let n=null,r=null,s="motion",o={};const a=new vn(32,1,.02,40),c=document.createElement("button");c.className="minimap",c.hidden=!0,(window.parent!==window||window.FlareHost)&&(c.tabIndex=-1,c.setAttribute("aria-hidden","true")),c.innerHTML="<span>查看肌群 ↗</span>",i.container.append(c);const l=()=>({position:i.camera.position.clone(),target:i.controls.target.clone()}),h=R=>i.setCameraView(R.position,R.target);function u(R){const T=(lo(R)?.muscles??[]).map(S=>fr[S]?.centre).filter(Boolean),F=T.length&&T.reduce((S,v)=>S+v[2],0)/T.length<-.01;return new A(0,.1,F?-1:1)}function d(R){const T=hi[r],F=i.getMetrics().joints,S=R.items.find(G=>G.groupId===r),v=S?.side==="left"||S?.side==="right"?S.side:R.support==="both"?i.camera.position.x>0?"left":"right":R.support,P=T.section==="support"?[v+"Shoulder",v+"Elbow",v+"Palm","head","rightHip","leftHip",sM(v)+"Shoulder"]:T.section==="core"?["leftShoulder","rightShoulder","leftHip","rightHip","pelvis","head"]:["leftHip","rightHip","leftKnee","rightKnee","leftAnkle","rightAnkle","pelvis"],Q=new an;for(const G of P)F[G]&&Q.expandByPoint(new A().fromArray(F[G]));return Q.expandByScalar(T.section==="support"?.1:.12)}function p(R,T=null){if(!r)return;const F=s==="muscles"?e.getFullBounds().expandByScalar(.035):d(R),S=T??(s==="muscles"?u(r):i.camera.position.clone().sub(i.controls.target));i.fitBounds(F,S,1.08),i.autoFrame=!1}function g(){e.refreshEnvironment(),i.setDisplayScene(s==="muscles"?e.scene:null),c.querySelector("span").textContent=s==="motion"?"查看肌群 ↗":"查看动作 ↗",c.setAttribute("aria-label",s==="motion"?"切换到全身肌群模型":"切换到托马斯动作白膜")}function b(R,T){const F=!n,S=r!==R;F&&(n={...l(),framingMode:i.framingMode,autoFrame:i.autoFrame},s="motion",o={}),i.autoFrame=!1,i.setFramingMode("detail"),r=R,c.hidden=!1,e.setDetail(R,T),g(),(F||S)&&(o={},p(T))}function m(R,T){return!r||!["motion","muscles"].includes(R)||R===s?!1:(o[s]=l(),s=R,g(),o[s]?h(o[s]):p(T),i.autoFrame=!1,i.dirty=!0,!0)}function f(){if(i.setDisplayScene(null),e.restorePhase(),n){const R=n;n=null,i.autoFrame=!1,i.setFramingMode(R.framingMode),h(R),i.autoFrame=R.autoFrame}r=null,s="motion",o={},c.hidden=!0}function M(R,T=null){r&&(o={},p(R,T??(s==="muscles"?u(r):ps.standard)))}function x(R){if(!r)return;const T=i.camera.position.clone().sub(i.controls.target);o={},p(R,T)}function _(R){i.setVisible(!0),m(s==="motion"?"muscles":"motion",R)&&t?.(s)}function I(){if(!r||c.hidden)return;const R=c.getBoundingClientRect(),T=i.container.getBoundingClientRect();if(!(R.width>0&&R.height>0))return;const F=R.width,S=R.height,v=R.left-T.left,P=T.height-(R.bottom-T.top),Q=s==="motion"?"muscles":"motion",G=i.getMetrics().bounds,ae=Q==="muscles"?e.getFullBounds():new an(new A().fromArray(G.min),new A().fromArray(G.max)),oe=ae.getCenter(new A),ne=ae.getSize(new A),he=Q==="muscles"?u(r):o.motion?o.motion.position.clone().sub(o.motion.target):ps.standard.clone();a.aspect=F/S,a.updateProjectionMatrix();const L=Math.tan(Nt.degToRad(16)),W=Math.max(ne.y/2/L,ne.x/2/(L*a.aspect))+ne.z;a.position.copy(oe).addScaledVector(he.normalize(),W*1.12),a.lookAt(oe),e.refreshEnvironment();const q=i.renderer,j={viewport:q.getViewport(new mt),scissor:q.getScissor(new mt),scissorTest:q.getScissorTest(),color:q.getClearColor(new st),alpha:q.getClearAlpha()};try{q.setScissorTest(!0),q.setScissor(v,P,F,S),q.setViewport(v,P,F,S),q.setClearColor(1513762,1),q.render(Q==="muscles"?e.scene:i.scene,a)}finally{q.setViewport(j.viewport),q.setScissor(j.scissor),q.setScissorTest(j.scissorTest),q.setClearColor(j.color,j.alpha)}}return{open:b,close:f,toggle:_,setModel:m,reset:M,refit:x,renderMini:I,mini:c,getModel:()=>s,dispose(){f(),c.remove()}}}const sM=i=>i==="left"?"right":"left";async function oM(i,e){const{scene:t}=await lf("./anatomy/mannequin-reference.meshopt.glb.gz"),n=new Yl;n.add(t),n.add(new Hd(15397631,3420989,2));const r=new hs(16773860,3);r.position.set(-2,3,4),n.add(r);const s=new hs(15199487,2);s.position.set(2,2,-3),n.add(s);const o=bf();o.mmMulti.value=1,o.mmReveal.value=1,o.mmTime.value=.654,o.mmBase.value.set("#818b99"),o.mmSkin.value.copy(o.mmBase.value),o.mmGroove.value.set("#596273");const a={value:2},c=[],l=new Set;t.traverse(j=>{if(!j.isMesh)return;for(const ue of[].concat(j.material))ue.dispose();const ee=new Fr({color:16777215,roughness:.72,metalness:0});xf(ee,o,{thumbnail:!0,density:a}),j.material=ee,c.push(j),l.add(ee)}),t.updateMatrixWorld(!0);const h=[1,-1].map(j=>{const ee=new vn(26,.5,.02,20);return ee.position.set(0,.845,j*4),ee.lookAt(0,.845,0),ee.updateMatrixWorld(!0),ee}),u=document.createElement("aside");u.className="phase-map",u.setAttribute("aria-label","随动作阶段同步的肌群正面和背面定位图"),u.innerHTML='<header><i></i><span>同步发力</span></header><div class="phase-map-view"><span>正面</span><span>背面</span></div><div class="phase-map-legend"></div>',i.container.append(u);const d=u.querySelector(".phase-map-view"),p=u.querySelector(".phase-map-legend"),g=document.createElement("canvas");g.setAttribute("aria-hidden","true"),d.prepend(g);const b=g.getContext("2d"),m=new Gd,f=new ht,M=new A;let x=null,_=!1,I=[],R=null,T=null,F=0,S=null;const v=new an().setFromObject(t),P={"hip-abductors":"臀中肌",abs:"腹直肌","rotator-cuff":"肩袖",forearms:"前臂",scapular:"肩胛肌群",adductors:"内收肌"};function Q(j,ee,ue,X){f.set((j-X.left)/X.width*2-1,-(ee-X.top)/X.height*2+1),m.setFromCamera(f,ue);const re=Rn(i.time);for(const xe of m.intersectObjects(c)){const me=gf(xe.object.worldToLocal(M.copy(xe.point)),1.69);if(!me)continue;const Te=Object.entries(Ma).filter(([He,Ze])=>hi[He]&&Ze.muscles.includes(me.id)).map(([He])=>He),ke=Te.find(He=>re.items.some(Ze=>Ze.groupId===He&&(Ze.side==="both"||Ze.side===me.side)))??Te[0];if(ke)return{groupId:ke,side:me.side,panelId:me.id}}return null}function G(j){const ee=d.getBoundingClientRect(),ue=ee.width/2,X=j.clientX-ee.left<ue?0:1,re=Q(j.clientX,j.clientY,h[X],{left:ee.left+ue*X,top:ee.top,width:ue,height:ee.height});re&&e(re.groupId)}d.addEventListener("click",G);function ae(j,ee=null){const ue=[...j.items],X=[];ee&&!ue.some(re=>re.groupId===ee)&&ue.push({groupId:ee,side:"both",level:"primary",colour:hi[ee].colour});for(const re of ue){const xe=lo(re.groupId);if(xe)for(const me of xe.muscles)X.push({muscle:me,side:re.side,colour:re.colour,level:xe.deep&&re.level==="primary"?"deep":re.level,dim:ee?re.groupId===ee?0:.85:re.level==="primary"?0:.5})}_f(o,X),Ul(o,ee?lo(ee)?.muscles??[]:[])}function oe(j,ee){S=j,ae(ee,j),T=null,he()}function ne(){S=null,x=null,T=null,Ul(o,[])}function he(){n.environment=i.scene.environment}function L(){if(_)return;const j=Rn(i.time);if(j.source!==x){x=j.source,ae(j),I=["support","core","legs"].map(Ze=>j.items.find(Ce=>hi[Ce.groupId].section===Ze&&Ce.level==="primary")??j.items.find(Ce=>hi[Ce.groupId].section===Ze)).filter(Boolean),p.replaceChildren();for(const Ze of I){const Ce=document.createElement("button");Ce.type="button",Ce.dataset.groupId=Ze.groupId,Ce.setAttribute("aria-label","查看"+Ze.label);const rt=document.createElement("i");rt.style.background=Ze.colour,Ce.append(rt,P[Ze.groupId]??Ze.label),Ce.addEventListener("click",()=>e(Ze.groupId)),p.append(Ce)}}const ee=d.getBoundingClientRect();if(!(ee.width>0&&ee.height>0))return;const ue=i.renderer,X=i.quality==="low"?1:Math.min(3,Math.max(2,window.devicePixelRatio||1)),re=Math.ceil(ee.width/2*X),xe=Math.ceil(ee.height*X);a.value=re/(ee.width/2);const me=[j.source,re,xe,i.quality,ue.toneMappingExposure].join(":");if(me===T&&n.environment===i.scene.environment)return;n.environment=i.scene.environment,R?R.setSize(re,xe):R=new ur(re,xe,{samples:Math.min(4,ue.capabilities.maxSamples),stencilBuffer:!1}),(g.width!==re*2||g.height!==xe)&&(g.width=re*2,g.height=xe);const Te={target:ue.getRenderTarget(),viewport:ue.getViewport(new mt),scissor:ue.getScissor(new mt),scissorTest:ue.getScissorTest(),color:ue.getClearColor(new st),alpha:ue.getClearAlpha(),autoClear:ue.autoClear},ke=new Uint8Array(re*xe*4),He=new Uint8ClampedArray(ke.length);try{ue.autoClear=!0,ue.setClearColor(0,0);for(let Ze=0;Ze<2;Ze++){h[Ze].aspect=ee.width/2/ee.height,h[Ze].updateProjectionMatrix(),ue.setRenderTarget(R),ue.render(n,h[Ze]),ue.readRenderTargetPixels(R,0,0,re,xe,ke);for(let Ce=0;Ce<xe;Ce++)for(let rt=0;rt<re;rt++){const N=((xe-1-Ce)*re+rt)*4,Ft=(Ce*re+rt)*4,pt=ke[N+3],ct=pt?255/pt:0;He[Ft]=Math.min(255,ke[N]*ct),He[Ft+1]=Math.min(255,ke[N+1]*ct),He[Ft+2]=Math.min(255,ke[N+2]*ct),He[Ft+3]=pt}b.putImageData(new ImageData(He,re,xe),Ze*re,0)}T=me,F++}finally{ue.setRenderTarget(Te.target),ue.setViewport(Te.viewport),ue.setScissor(Te.scissor),ue.setScissorTest(Te.scissorTest),ue.setClearColor(Te.color,Te.alpha),ue.autoClear=Te.autoClear}}function W(j){_=j,u.hidden=j,i.dirty=!0}function q(){R?.dispose(),R=null,T=null;for(const j of c)j.geometry.dispose();for(const j of l)j.dispose()}return{render:L,setHidden:W,releaseGpu:q,scene:n,setDetail:oe,restorePhase:ne,refreshEnvironment:he,pickSurface:Q,getFullBounds:()=>v.clone(),getState:()=>({phase:x,hidden:_,focus:S,views:["front","back"],legend:I.map(j=>({groupId:j.groupId,label:P[j.groupId]??j.label})),referencePose:"static CC0 mannequin",resolution:[g.width,g.height],renderCount:F,samples:R?.samples??0}),dispose(){q(),d.removeEventListener("click",G),u.remove()}}}const aM=document.querySelector("#stage"),Sa=document.querySelector("#status"),cM=document.querySelector("#status-text"),vf=document.querySelector("#retry"),Ju=document.querySelector("#hotspots"),rh=document.querySelector("#detail-note");let we,Fc,zi,On,bi,pr=!1,Zn=null,kn=!1,fa=[],sh=null,ms=[],ta=null,ed=0,Qs=new Map;function Fs(i){const e={source:"flare-scene",...i};window.FlareHost?.postMessage?window.FlareHost.postMessage(JSON.stringify(e)):window.parent!==window&&window.parent.postMessage(e,window.location.origin)}function yf(){return{type:"state",time:we?.time??0,period:we?.period??9,playing:we?.playing??!1,speed:we?.speed??.5,phase:Rn(we?.time??0).source,selected:Zn,detail:kn,loop:we?.loopRange?{start:we.loopRange[0],end:we.loopRange[1]}:null,detailModel:kn?On?.getModel()??"motion":"motion",quality:we?.quality??"medium",ready:pr,errorCode:sh}}function Ir(i=!1){if(!pr)return;const e=performance.now();!i&&e-ed<100||(ed=e,Fs(yf()))}function td(i,e=!1){sh=i,Sa.hidden=!1,Sa.dataset.error="true",cM.textContent=e?"三维画面暂时中断，正在等待图形恢复。也可重新载入。":"三维动作暂时无法载入，请重新载入。",vf.hidden=!1,Fs({type:"error",code:i,errorCode:i}),Ir(!0)}function oh(){if(!pr||we.playing||kn){fa=[],Ju.replaceChildren(),Qs.clear();return}fa=Gy(we,Rn(we.time).items);const i=new Set;for(const e of fa){i.add(e.groupId);let t=Qs.get(e.groupId);t||(t=document.createElement("button"),t.className="hotspot",t.type="button",t.dataset.groupId=e.groupId,t.setAttribute("aria-label","查看"+e.label),t.title=e.label,t.addEventListener("click",()=>Mf(e.groupId)),Ju.append(t),Qs.set(e.groupId,t)),t.style.left=e.x+"px",t.style.top=e.y+"px",t.style.setProperty("--accent",e.colour),t.dataset.selected=String(e.groupId===Zn)}for(const[e,t]of Qs)i.has(e)||(t.remove(),Qs.delete(e))}function pa(){On?.close(),kn=!1,rh.hidden=!0,bi?.setHidden(!1);for(const i of we?.stageProps??[])i.visible=i===we.shadowCatcher?we.renderer.shadowMap.enabled:!0}function ah(){rh.textContent=On?.getModel()==="muscles"?"肌群位置示意 · 对应同一部位":"动作白膜 · 保持当前暂停姿态"}function wa(i,e=kn){if(we.playing=!1,!i)pa(),Zn=null,zi.restore();else{Zn=i,kn=!!e;const t=Rn(we.time);if(zi.show(Zn,t.items,kn),kn){On.open(Zn,t),rh.hidden=!1,ah(),bi?.setHidden(!0);for(const n of we.stageProps)n.visible=!1}}we.dirty=!0,oh(),Ir(!0)}function Mf(i){!pr||we.playing||(wa(i),Fs({type:"select",groupId:i,time:we.time}))}function lM(i){pr&&(wa(i),Fs({type:"select",groupId:i,time:we.time}))}function Ea(i){let e=i;if(typeof e=="string")try{e=JSON.parse(e)}catch{Fs({type:"error",code:"invalid_command",errorCode:"invalid_command"});return}if(!(!e||typeof e!="object"||typeof e.type!="string")){if(!pr){ms.push(e),ms.length>32&&ms.shift();return}switch(e.type){case"play":pa(),Zn=null,zi.restore(),we.time>=we.period&&we.setTime(0),we.playing=we.visible&&!document.hidden&&!we.contextLost,we.start();break;case"pause":we.playing=!1;break;case"seek":{const t=Number(e.time);if(!Number.isFinite(t))return;pa(),Zn=null,zi.restore(),we.playing=!1,we.loopRange=null,we.setTime(t);break}case"speed":[.25,.5,1].includes(Number(e.value))&&(we.speed=Number(e.value));break;case"loop":{if(e.start==null||e.end==null)we.loopRange=null;else{const t=Number(e.start),n=Number(e.end);if(!Number.isFinite(t)||!Number.isFinite(n)||t<0||n>we.period||n-t<=.001)return;we.loopRange=[t,n],(we.time<t||we.time>=n)&&we.setTime(t)}break}case"reset":kn&&Zn?On.reset(Rn(we.time)):we.resetView();break;case"camera":{if(!ps[e.view])return;kn&&Zn?On.reset(Rn(we.time),ps[e.view]):we.resetView(ps[e.view]);break}case"select":if(e.groupId==null||hi[e.groupId])wa(e.groupId??null);else return;break;case"detail":if(e.groupId==null)pa(),Zn?zi.show(Zn,Rn(we.time).items,!1):zi.restore();else if(hi[e.groupId])wa(e.groupId,!0);else return;break;case"detail_model":if(!kn||!["motion","muscles"].includes(e.value))return;On.setModel(e.value,Rn(we.time)),ah();break;case"quality":we.setQuality(e.value);break;case"visibility":we.setVisible(e.visible);break;default:return}we.dirty=!0,oh(),Ir(!0)}}window.flareBridge=Object.freeze({command:Ea});function Sf(i){i.source!==window.parent||i.origin!==window.location.origin||i.data?.source!=="flare-host"||Ea(i.data.command)}window.addEventListener("message",Sf);vf.addEventListener("click",()=>window.location.reload());async function hM(){try{we=new Ly(aM,{onTime:()=>Ir(),onRender:()=>{oh(),kn?On?.renderMini():bi?.render()},onResize:()=>{kn&&On?.refit(Rn(we.time))},onContext:r=>{r?(bi?.refreshEnvironment(),sh=null,Sa.hidden=!0,Ir(!0)):(zi?.releaseGpu(),bi?.releaseGpu(),td("graphics_context_lost",!0))}}),await Promise.all([we.load(),oM(we,lM).then(r=>{bi=r})]),we.resetView();const i=tM(we.motion,we.coach);Fc=nM(we,i),zi=iM(i),On=rM(we,bi,()=>{ah(),we.dirty=!0,Ir(!0)}),On.mini.addEventListener("click",()=>On.toggle(Rn(we.time)));const e=we.renderer.domElement;e.addEventListener("pointerdown",r=>{ta={x:r.clientX,y:r.clientY,time:performance.now()}}),e.addEventListener("pointercancel",()=>{ta=null}),e.addEventListener("pointerup",r=>{const s=ta;if(ta=null,!s||we.playing||performance.now()-s.time>550||Math.hypot(r.clientX-s.x,r.clientY-s.y)>7)return;const o=kn&&On.getModel()==="muscles"?bi.pickSurface(r.clientX,r.clientY,we.camera,e.getBoundingClientRect()):Fc.pick(r.clientX,r.clientY,Rn(we.time).items);o&&Mf(o.groupId)}),pr=!0,Sa.hidden=!0,we.dirty=!0;const t=i.reduce((r,s)=>({meshes:r.meshes+1,vertices:r.vertices+s.geometry.attributes.position.count,triangles:r.triangles+(s.geometry.index?.count??s.geometry.attributes.position.count)/3}),{meshes:0,vertices:0,triangles:0});window.__flareScene=Object.freeze({getMetrics:()=>we.getMetrics(),getState:yf,getHotspots:()=>fa.map(r=>({...r})),hitTest:(r,s)=>Fc.pick(r,s,Rn(we.time).items),getPhaseMap:()=>bi?.getState(),getRenderState:()=>({visible:we.visible,running:we.running,dirty:we.dirty,contextLost:we.contextLost,frame:we.renderer.info.render.frame,calls:we.renderer.info.render.calls,triangles:we.renderer.info.render.triangles,pixelRatio:we.renderer.getPixelRatio(),framingMode:we.framingMode,bufferSize:[we.renderer.domElement.width,we.renderer.domElement.height]}),getCamera:()=>({position:we.camera.position.toArray(),target:we.controls.target.toArray(),aspect:we.camera.aspect}),setTime:r=>Ea({type:"seek",time:r}),phaseAt:Rn,phaseTicks:Zu,pacingRate:r=>we.pacingRate(r),geometryStats:{...t}}),Fs({type:"ready",period:we.period,time:we.time,phase:Rn(we.time).source,phases:Zu});const n=ms;ms=[];for(const r of n)Ea(r);Ir(!0)}catch(i){we?.stop(),td(i?.message==="rig_load_failed"?"rig_load_failed":"scene_load_failed")}}function uM(){pr=!1,ms=[],window.removeEventListener("message",Sf),On?.dispose(),zi?.dispose(),bi?.dispose(),we?.dispose()}window.addEventListener("pagehide",i=>{i.persisted?we?.setVisible(!1):uM()});window.addEventListener("pageshow",i=>{i.persisted&&we?.setVisible(!0)});hM();
