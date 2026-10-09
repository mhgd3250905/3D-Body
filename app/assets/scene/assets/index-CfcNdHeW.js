(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const r of document.querySelectorAll('link[rel="modulepreload"]'))n(r);new MutationObserver(r=>{for(const s of r)if(s.type==="childList")for(const o of s.addedNodes)o.tagName==="LINK"&&o.rel==="modulepreload"&&n(o)}).observe(document,{childList:!0,subtree:!0});function t(r){const s={};return r.integrity&&(s.integrity=r.integrity),r.referrerPolicy&&(s.referrerPolicy=r.referrerPolicy),r.crossOrigin==="use-credentials"?s.credentials="include":r.crossOrigin==="anonymous"?s.credentials="omit":s.credentials="same-origin",s}function n(r){if(r.ep)return;r.ep=!0;const s=t(r);fetch(r.href,s)}})();const Ol="170",os={ROTATE:0,DOLLY:1,PAN:2},is={ROTATE:0,PAN:1,DOLLY_PAN:2,DOLLY_ROTATE:3},Pf=0,hu=1,Lf=2,sh=1,oh=2,Ui=3,ji=0,Cn=1,xi=2,ur=0,as=1,fu=2,pu=3,mu=4,Df=5,Cr=100,If=101,Ff=102,Nf=103,Uf=104,Of=200,kf=201,Bf=202,zf=203,Oc=204,kc=205,Hf=206,Gf=207,Vf=208,Wf=209,qf=210,jf=211,Xf=212,Qf=213,Kf=214,Bc=0,zc=1,Hc=2,ms=3,Gc=4,Vc=5,Wc=6,qc=7,ah=0,Yf=1,$f=2,dr=0,Zf=1,Jf=2,ep=3,ch=4,tp=5,np=6,ip=7,gu="attached",rp="detached",lh=300,gs=301,bs=302,jc=303,Xc=304,Ta=306,_s=1e3,cr=1001,ma=1002,Pn=1003,uh=1004,Ks=1005,jn=1006,na=1007,zi=1008,Xi=1009,dh=1010,hh=1011,ro=1012,kl=1013,Fr=1014,li=1015,uo=1016,Bl=1017,zl=1018,xs=1020,fh=35902,ph=1021,mh=1022,ei=1023,gh=1024,bh=1025,cs=1026,vs=1027,Hl=1028,Gl=1029,_h=1030,Vl=1031,Wl=1033,ia=33776,ra=33777,sa=33778,oa=33779,Qc=35840,Kc=35841,Yc=35842,$c=35843,Zc=36196,Jc=37492,el=37496,tl=37808,nl=37809,il=37810,rl=37811,sl=37812,ol=37813,al=37814,cl=37815,ll=37816,ul=37817,dl=37818,hl=37819,fl=37820,pl=37821,aa=36492,ml=36494,gl=36495,xh=36283,bl=36284,_l=36285,xl=36286,so=2300,oo=2301,Ha=2302,bu=2400,_u=2401,xu=2402,sp=2500,op=0,vh=1,vl=2,ap=3200,cp=3201,yh=0,lp=1,or="",ln="srgb",Ln="srgb-linear",Ra="linear",jt="srgb",Or=7680,vu=519,up=512,dp=513,hp=514,Mh=515,fp=516,pp=517,mp=518,gp=519,yl=35044,yu="300 es",Hi=2e3,ga=2001;class Nr{addEventListener(e,t){this._listeners===void 0&&(this._listeners={});const n=this._listeners;n[e]===void 0&&(n[e]=[]),n[e].indexOf(t)===-1&&n[e].push(t)}hasEventListener(e,t){if(this._listeners===void 0)return!1;const n=this._listeners;return n[e]!==void 0&&n[e].indexOf(t)!==-1}removeEventListener(e,t){if(this._listeners===void 0)return;const r=this._listeners[e];if(r!==void 0){const s=r.indexOf(t);s!==-1&&r.splice(s,1)}}dispatchEvent(e){if(this._listeners===void 0)return;const n=this._listeners[e.type];if(n!==void 0){e.target=this;const r=n.slice(0);for(let s=0,o=r.length;s<o;s++)r[s].call(this,e);e.target=null}}}const Sn=["00","01","02","03","04","05","06","07","08","09","0a","0b","0c","0d","0e","0f","10","11","12","13","14","15","16","17","18","19","1a","1b","1c","1d","1e","1f","20","21","22","23","24","25","26","27","28","29","2a","2b","2c","2d","2e","2f","30","31","32","33","34","35","36","37","38","39","3a","3b","3c","3d","3e","3f","40","41","42","43","44","45","46","47","48","49","4a","4b","4c","4d","4e","4f","50","51","52","53","54","55","56","57","58","59","5a","5b","5c","5d","5e","5f","60","61","62","63","64","65","66","67","68","69","6a","6b","6c","6d","6e","6f","70","71","72","73","74","75","76","77","78","79","7a","7b","7c","7d","7e","7f","80","81","82","83","84","85","86","87","88","89","8a","8b","8c","8d","8e","8f","90","91","92","93","94","95","96","97","98","99","9a","9b","9c","9d","9e","9f","a0","a1","a2","a3","a4","a5","a6","a7","a8","a9","aa","ab","ac","ad","ae","af","b0","b1","b2","b3","b4","b5","b6","b7","b8","b9","ba","bb","bc","bd","be","bf","c0","c1","c2","c3","c4","c5","c6","c7","c8","c9","ca","cb","cc","cd","ce","cf","d0","d1","d2","d3","d4","d5","d6","d7","d8","d9","da","db","dc","dd","de","df","e0","e1","e2","e3","e4","e5","e6","e7","e8","e9","ea","eb","ec","ed","ee","ef","f0","f1","f2","f3","f4","f5","f6","f7","f8","f9","fa","fb","fc","fd","fe","ff"];let Mu=1234567;const Zs=Math.PI/180,ys=180/Math.PI;function di(){const i=Math.random()*4294967295|0,e=Math.random()*4294967295|0,t=Math.random()*4294967295|0,n=Math.random()*4294967295|0;return(Sn[i&255]+Sn[i>>8&255]+Sn[i>>16&255]+Sn[i>>24&255]+"-"+Sn[e&255]+Sn[e>>8&255]+"-"+Sn[e>>16&15|64]+Sn[e>>24&255]+"-"+Sn[t&63|128]+Sn[t>>8&255]+"-"+Sn[t>>16&255]+Sn[t>>24&255]+Sn[n&255]+Sn[n>>8&255]+Sn[n>>16&255]+Sn[n>>24&255]).toLowerCase()}function xn(i,e,t){return Math.max(e,Math.min(t,i))}function ql(i,e){return(i%e+e)%e}function bp(i,e,t,n,r){return n+(i-e)*(r-n)/(t-e)}function _p(i,e,t){return i!==e?(t-i)/(e-i):0}function Js(i,e,t){return(1-t)*i+t*e}function xp(i,e,t,n){return Js(i,e,1-Math.exp(-t*n))}function vp(i,e=1){return e-Math.abs(ql(i,e*2)-e)}function yp(i,e,t){return i<=e?0:i>=t?1:(i=(i-e)/(t-e),i*i*(3-2*i))}function Mp(i,e,t){return i<=e?0:i>=t?1:(i=(i-e)/(t-e),i*i*i*(i*(i*6-15)+10))}function Sp(i,e){return i+Math.floor(Math.random()*(e-i+1))}function wp(i,e){return i+Math.random()*(e-i)}function Ep(i){return i*(.5-Math.random())}function Ap(i){i!==void 0&&(Mu=i);let e=Mu+=1831565813;return e=Math.imul(e^e>>>15,e|1),e^=e+Math.imul(e^e>>>7,e|61),((e^e>>>14)>>>0)/4294967296}function Tp(i){return i*Zs}function Rp(i){return i*ys}function Cp(i){return(i&i-1)===0&&i!==0}function Pp(i){return Math.pow(2,Math.ceil(Math.log(i)/Math.LN2))}function Lp(i){return Math.pow(2,Math.floor(Math.log(i)/Math.LN2))}function Dp(i,e,t,n,r){const s=Math.cos,o=Math.sin,a=s(t/2),l=o(t/2),c=s((e+n)/2),u=o((e+n)/2),d=s((e-n)/2),h=o((e-n)/2),p=s((n-e)/2),g=o((n-e)/2);switch(r){case"XYX":i.set(a*u,l*d,l*h,a*c);break;case"YZY":i.set(l*h,a*u,l*d,a*c);break;case"ZXZ":i.set(l*d,l*h,a*u,a*c);break;case"XZX":i.set(a*u,l*g,l*p,a*c);break;case"YXY":i.set(l*p,a*u,l*g,a*c);break;case"ZYZ":i.set(l*g,l*p,a*u,a*c);break;default:console.warn("THREE.MathUtils: .setQuaternionFromProperEuler() encountered an unknown order: "+r)}}function ci(i,e){switch(e.constructor){case Float32Array:return i;case Uint32Array:return i/4294967295;case Uint16Array:return i/65535;case Uint8Array:return i/255;case Int32Array:return Math.max(i/2147483647,-1);case Int16Array:return Math.max(i/32767,-1);case Int8Array:return Math.max(i/127,-1);default:throw new Error("Invalid component type.")}}function Ht(i,e){switch(e.constructor){case Float32Array:return i;case Uint32Array:return Math.round(i*4294967295);case Uint16Array:return Math.round(i*65535);case Uint8Array:return Math.round(i*255);case Int32Array:return Math.round(i*2147483647);case Int16Array:return Math.round(i*32767);case Int8Array:return Math.round(i*127);default:throw new Error("Invalid component type.")}}const vt={DEG2RAD:Zs,RAD2DEG:ys,generateUUID:di,clamp:xn,euclideanModulo:ql,mapLinear:bp,inverseLerp:_p,lerp:Js,damp:xp,pingpong:vp,smoothstep:yp,smootherstep:Mp,randInt:Sp,randFloat:wp,randFloatSpread:Ep,seededRandom:Ap,degToRad:Tp,radToDeg:Rp,isPowerOfTwo:Cp,ceilPowerOfTwo:Pp,floorPowerOfTwo:Lp,setQuaternionFromProperEuler:Dp,normalize:Ht,denormalize:ci};class ut{constructor(e=0,t=0){ut.prototype.isVector2=!0,this.x=e,this.y=t}get width(){return this.x}set width(e){this.x=e}get height(){return this.y}set height(e){this.y=e}set(e,t){return this.x=e,this.y=t,this}setScalar(e){return this.x=e,this.y=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;default:throw new Error("index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;default:throw new Error("index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y)}copy(e){return this.x=e.x,this.y=e.y,this}add(e){return this.x+=e.x,this.y+=e.y,this}addScalar(e){return this.x+=e,this.y+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this}subScalar(e){return this.x-=e,this.y-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this}multiply(e){return this.x*=e.x,this.y*=e.y,this}multiplyScalar(e){return this.x*=e,this.y*=e,this}divide(e){return this.x/=e.x,this.y/=e.y,this}divideScalar(e){return this.multiplyScalar(1/e)}applyMatrix3(e){const t=this.x,n=this.y,r=e.elements;return this.x=r[0]*t+r[3]*n+r[6],this.y=r[1]*t+r[4]*n+r[7],this}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this}clamp(e,t){return this.x=Math.max(e.x,Math.min(t.x,this.x)),this.y=Math.max(e.y,Math.min(t.y,this.y)),this}clampScalar(e,t){return this.x=Math.max(e,Math.min(t,this.x)),this.y=Math.max(e,Math.min(t,this.y)),this}clampLength(e,t){const n=this.length();return this.divideScalar(n||1).multiplyScalar(Math.max(e,Math.min(t,n)))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this}negate(){return this.x=-this.x,this.y=-this.y,this}dot(e){return this.x*e.x+this.y*e.y}cross(e){return this.x*e.y-this.y*e.x}lengthSq(){return this.x*this.x+this.y*this.y}length(){return Math.sqrt(this.x*this.x+this.y*this.y)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)}normalize(){return this.divideScalar(this.length()||1)}angle(){return Math.atan2(-this.y,-this.x)+Math.PI}angleTo(e){const t=Math.sqrt(this.lengthSq()*e.lengthSq());if(t===0)return Math.PI/2;const n=this.dot(e)/t;return Math.acos(xn(n,-1,1))}distanceTo(e){return Math.sqrt(this.distanceToSquared(e))}distanceToSquared(e){const t=this.x-e.x,n=this.y-e.y;return t*t+n*n}manhattanDistanceTo(e){return Math.abs(this.x-e.x)+Math.abs(this.y-e.y)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this}lerpVectors(e,t,n){return this.x=e.x+(t.x-e.x)*n,this.y=e.y+(t.y-e.y)*n,this}equals(e){return e.x===this.x&&e.y===this.y}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this}rotateAround(e,t){const n=Math.cos(t),r=Math.sin(t),s=this.x-e.x,o=this.y-e.y;return this.x=s*n-o*r+e.x,this.y=s*r+o*n+e.y,this}random(){return this.x=Math.random(),this.y=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y}}class Mt{constructor(e,t,n,r,s,o,a,l,c){Mt.prototype.isMatrix3=!0,this.elements=[1,0,0,0,1,0,0,0,1],e!==void 0&&this.set(e,t,n,r,s,o,a,l,c)}set(e,t,n,r,s,o,a,l,c){const u=this.elements;return u[0]=e,u[1]=r,u[2]=a,u[3]=t,u[4]=s,u[5]=l,u[6]=n,u[7]=o,u[8]=c,this}identity(){return this.set(1,0,0,0,1,0,0,0,1),this}copy(e){const t=this.elements,n=e.elements;return t[0]=n[0],t[1]=n[1],t[2]=n[2],t[3]=n[3],t[4]=n[4],t[5]=n[5],t[6]=n[6],t[7]=n[7],t[8]=n[8],this}extractBasis(e,t,n){return e.setFromMatrix3Column(this,0),t.setFromMatrix3Column(this,1),n.setFromMatrix3Column(this,2),this}setFromMatrix4(e){const t=e.elements;return this.set(t[0],t[4],t[8],t[1],t[5],t[9],t[2],t[6],t[10]),this}multiply(e){return this.multiplyMatrices(this,e)}premultiply(e){return this.multiplyMatrices(e,this)}multiplyMatrices(e,t){const n=e.elements,r=t.elements,s=this.elements,o=n[0],a=n[3],l=n[6],c=n[1],u=n[4],d=n[7],h=n[2],p=n[5],g=n[8],b=r[0],m=r[3],f=r[6],M=r[1],x=r[4],_=r[7],D=r[2],P=r[5],T=r[8];return s[0]=o*b+a*M+l*D,s[3]=o*m+a*x+l*P,s[6]=o*f+a*_+l*T,s[1]=c*b+u*M+d*D,s[4]=c*m+u*x+d*P,s[7]=c*f+u*_+d*T,s[2]=h*b+p*M+g*D,s[5]=h*m+p*x+g*P,s[8]=h*f+p*_+g*T,this}multiplyScalar(e){const t=this.elements;return t[0]*=e,t[3]*=e,t[6]*=e,t[1]*=e,t[4]*=e,t[7]*=e,t[2]*=e,t[5]*=e,t[8]*=e,this}determinant(){const e=this.elements,t=e[0],n=e[1],r=e[2],s=e[3],o=e[4],a=e[5],l=e[6],c=e[7],u=e[8];return t*o*u-t*a*c-n*s*u+n*a*l+r*s*c-r*o*l}invert(){const e=this.elements,t=e[0],n=e[1],r=e[2],s=e[3],o=e[4],a=e[5],l=e[6],c=e[7],u=e[8],d=u*o-a*c,h=a*l-u*s,p=c*s-o*l,g=t*d+n*h+r*p;if(g===0)return this.set(0,0,0,0,0,0,0,0,0);const b=1/g;return e[0]=d*b,e[1]=(r*c-u*n)*b,e[2]=(a*n-r*o)*b,e[3]=h*b,e[4]=(u*t-r*l)*b,e[5]=(r*s-a*t)*b,e[6]=p*b,e[7]=(n*l-c*t)*b,e[8]=(o*t-n*s)*b,this}transpose(){let e;const t=this.elements;return e=t[1],t[1]=t[3],t[3]=e,e=t[2],t[2]=t[6],t[6]=e,e=t[5],t[5]=t[7],t[7]=e,this}getNormalMatrix(e){return this.setFromMatrix4(e).invert().transpose()}transposeIntoArray(e){const t=this.elements;return e[0]=t[0],e[1]=t[3],e[2]=t[6],e[3]=t[1],e[4]=t[4],e[5]=t[7],e[6]=t[2],e[7]=t[5],e[8]=t[8],this}setUvTransform(e,t,n,r,s,o,a){const l=Math.cos(s),c=Math.sin(s);return this.set(n*l,n*c,-n*(l*o+c*a)+o+e,-r*c,r*l,-r*(-c*o+l*a)+a+t,0,0,1),this}scale(e,t){return this.premultiply(Ga.makeScale(e,t)),this}rotate(e){return this.premultiply(Ga.makeRotation(-e)),this}translate(e,t){return this.premultiply(Ga.makeTranslation(e,t)),this}makeTranslation(e,t){return e.isVector2?this.set(1,0,e.x,0,1,e.y,0,0,1):this.set(1,0,e,0,1,t,0,0,1),this}makeRotation(e){const t=Math.cos(e),n=Math.sin(e);return this.set(t,-n,0,n,t,0,0,0,1),this}makeScale(e,t){return this.set(e,0,0,0,t,0,0,0,1),this}equals(e){const t=this.elements,n=e.elements;for(let r=0;r<9;r++)if(t[r]!==n[r])return!1;return!0}fromArray(e,t=0){for(let n=0;n<9;n++)this.elements[n]=e[n+t];return this}toArray(e=[],t=0){const n=this.elements;return e[t]=n[0],e[t+1]=n[1],e[t+2]=n[2],e[t+3]=n[3],e[t+4]=n[4],e[t+5]=n[5],e[t+6]=n[6],e[t+7]=n[7],e[t+8]=n[8],e}clone(){return new this.constructor().fromArray(this.elements)}}const Ga=new Mt;function Sh(i){for(let e=i.length-1;e>=0;--e)if(i[e]>=65535)return!0;return!1}function ao(i){return document.createElementNS("http://www.w3.org/1999/xhtml",i)}function Ip(){const i=ao("canvas");return i.style.display="block",i}const Su={};function Ys(i){i in Su||(Su[i]=!0,console.warn(i))}function Fp(i,e,t){return new Promise(function(n,r){function s(){switch(i.clientWaitSync(e,i.SYNC_FLUSH_COMMANDS_BIT,0)){case i.WAIT_FAILED:r();break;case i.TIMEOUT_EXPIRED:setTimeout(s,t);break;default:n()}}setTimeout(s,t)})}function Np(i){const e=i.elements;e[2]=.5*e[2]+.5*e[3],e[6]=.5*e[6]+.5*e[7],e[10]=.5*e[10]+.5*e[11],e[14]=.5*e[14]+.5*e[15]}function Up(i){const e=i.elements;e[11]===-1?(e[10]=-e[10]-1,e[14]=-e[14]):(e[10]=-e[10],e[14]=-e[14]+1)}const Pt={enabled:!0,workingColorSpace:Ln,spaces:{},convert:function(i,e,t){return this.enabled===!1||e===t||!e||!t||(this.spaces[e].transfer===jt&&(i.r=Vi(i.r),i.g=Vi(i.g),i.b=Vi(i.b)),this.spaces[e].primaries!==this.spaces[t].primaries&&(i.applyMatrix3(this.spaces[e].toXYZ),i.applyMatrix3(this.spaces[t].fromXYZ)),this.spaces[t].transfer===jt&&(i.r=ls(i.r),i.g=ls(i.g),i.b=ls(i.b))),i},fromWorkingColorSpace:function(i,e){return this.convert(i,this.workingColorSpace,e)},toWorkingColorSpace:function(i,e){return this.convert(i,e,this.workingColorSpace)},getPrimaries:function(i){return this.spaces[i].primaries},getTransfer:function(i){return i===or?Ra:this.spaces[i].transfer},getLuminanceCoefficients:function(i,e=this.workingColorSpace){return i.fromArray(this.spaces[e].luminanceCoefficients)},define:function(i){Object.assign(this.spaces,i)},_getMatrix:function(i,e,t){return i.copy(this.spaces[e].toXYZ).multiply(this.spaces[t].fromXYZ)},_getDrawingBufferColorSpace:function(i){return this.spaces[i].outputColorSpaceConfig.drawingBufferColorSpace},_getUnpackColorSpace:function(i=this.workingColorSpace){return this.spaces[i].workingColorSpaceConfig.unpackColorSpace}};function Vi(i){return i<.04045?i*.0773993808:Math.pow(i*.9478672986+.0521327014,2.4)}function ls(i){return i<.0031308?i*12.92:1.055*Math.pow(i,.41666)-.055}const wu=[.64,.33,.3,.6,.15,.06],Eu=[.2126,.7152,.0722],Au=[.3127,.329],Tu=new Mt().set(.4123908,.3575843,.1804808,.212639,.7151687,.0721923,.0193308,.1191948,.9505322),Ru=new Mt().set(3.2409699,-1.5373832,-.4986108,-.9692436,1.8759675,.0415551,.0556301,-.203977,1.0569715);Pt.define({[Ln]:{primaries:wu,whitePoint:Au,transfer:Ra,toXYZ:Tu,fromXYZ:Ru,luminanceCoefficients:Eu,workingColorSpaceConfig:{unpackColorSpace:ln},outputColorSpaceConfig:{drawingBufferColorSpace:ln}},[ln]:{primaries:wu,whitePoint:Au,transfer:jt,toXYZ:Tu,fromXYZ:Ru,luminanceCoefficients:Eu,outputColorSpaceConfig:{drawingBufferColorSpace:ln}}});let kr;class Op{static getDataURL(e){if(/^data:/i.test(e.src)||typeof HTMLCanvasElement>"u")return e.src;let t;if(e instanceof HTMLCanvasElement)t=e;else{kr===void 0&&(kr=ao("canvas")),kr.width=e.width,kr.height=e.height;const n=kr.getContext("2d");e instanceof ImageData?n.putImageData(e,0,0):n.drawImage(e,0,0,e.width,e.height),t=kr}return t.width>2048||t.height>2048?(console.warn("THREE.ImageUtils.getDataURL: Image converted to jpg for performance reasons",e),t.toDataURL("image/jpeg",.6)):t.toDataURL("image/png")}static sRGBToLinear(e){if(typeof HTMLImageElement<"u"&&e instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&e instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&e instanceof ImageBitmap){const t=ao("canvas");t.width=e.width,t.height=e.height;const n=t.getContext("2d");n.drawImage(e,0,0,e.width,e.height);const r=n.getImageData(0,0,e.width,e.height),s=r.data;for(let o=0;o<s.length;o++)s[o]=Vi(s[o]/255)*255;return n.putImageData(r,0,0),t}else if(e.data){const t=e.data.slice(0);for(let n=0;n<t.length;n++)t instanceof Uint8Array||t instanceof Uint8ClampedArray?t[n]=Math.floor(Vi(t[n]/255)*255):t[n]=Vi(t[n]);return{data:t,width:e.width,height:e.height}}else return console.warn("THREE.ImageUtils.sRGBToLinear(): Unsupported image type. No color space conversion applied."),e}}let kp=0;class wh{constructor(e=null){this.isSource=!0,Object.defineProperty(this,"id",{value:kp++}),this.uuid=di(),this.data=e,this.dataReady=!0,this.version=0}set needsUpdate(e){e===!0&&this.version++}toJSON(e){const t=e===void 0||typeof e=="string";if(!t&&e.images[this.uuid]!==void 0)return e.images[this.uuid];const n={uuid:this.uuid,url:""},r=this.data;if(r!==null){let s;if(Array.isArray(r)){s=[];for(let o=0,a=r.length;o<a;o++)r[o].isDataTexture?s.push(Va(r[o].image)):s.push(Va(r[o]))}else s=Va(r);n.url=s}return t||(e.images[this.uuid]=n),n}}function Va(i){return typeof HTMLImageElement<"u"&&i instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&i instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&i instanceof ImageBitmap?Op.getDataURL(i):i.data?{data:Array.from(i.data),width:i.width,height:i.height,type:i.data.constructor.name}:(console.warn("THREE.Texture: Unable to serialize Texture."),{})}let Bp=0;class un extends Nr{constructor(e=un.DEFAULT_IMAGE,t=un.DEFAULT_MAPPING,n=cr,r=cr,s=jn,o=zi,a=ei,l=Xi,c=un.DEFAULT_ANISOTROPY,u=or){super(),this.isTexture=!0,Object.defineProperty(this,"id",{value:Bp++}),this.uuid=di(),this.name="",this.source=new wh(e),this.mipmaps=[],this.mapping=t,this.channel=0,this.wrapS=n,this.wrapT=r,this.magFilter=s,this.minFilter=o,this.anisotropy=c,this.format=a,this.internalFormat=null,this.type=l,this.offset=new ut(0,0),this.repeat=new ut(1,1),this.center=new ut(0,0),this.rotation=0,this.matrixAutoUpdate=!0,this.matrix=new Mt,this.generateMipmaps=!0,this.premultiplyAlpha=!1,this.flipY=!0,this.unpackAlignment=4,this.colorSpace=u,this.userData={},this.version=0,this.onUpdate=null,this.isRenderTargetTexture=!1,this.pmremVersion=0}get image(){return this.source.data}set image(e=null){this.source.data=e}updateMatrix(){this.matrix.setUvTransform(this.offset.x,this.offset.y,this.repeat.x,this.repeat.y,this.rotation,this.center.x,this.center.y)}clone(){return new this.constructor().copy(this)}copy(e){return this.name=e.name,this.source=e.source,this.mipmaps=e.mipmaps.slice(0),this.mapping=e.mapping,this.channel=e.channel,this.wrapS=e.wrapS,this.wrapT=e.wrapT,this.magFilter=e.magFilter,this.minFilter=e.minFilter,this.anisotropy=e.anisotropy,this.format=e.format,this.internalFormat=e.internalFormat,this.type=e.type,this.offset.copy(e.offset),this.repeat.copy(e.repeat),this.center.copy(e.center),this.rotation=e.rotation,this.matrixAutoUpdate=e.matrixAutoUpdate,this.matrix.copy(e.matrix),this.generateMipmaps=e.generateMipmaps,this.premultiplyAlpha=e.premultiplyAlpha,this.flipY=e.flipY,this.unpackAlignment=e.unpackAlignment,this.colorSpace=e.colorSpace,this.userData=JSON.parse(JSON.stringify(e.userData)),this.needsUpdate=!0,this}toJSON(e){const t=e===void 0||typeof e=="string";if(!t&&e.textures[this.uuid]!==void 0)return e.textures[this.uuid];const n={metadata:{version:4.6,type:"Texture",generator:"Texture.toJSON"},uuid:this.uuid,name:this.name,image:this.source.toJSON(e).uuid,mapping:this.mapping,channel:this.channel,repeat:[this.repeat.x,this.repeat.y],offset:[this.offset.x,this.offset.y],center:[this.center.x,this.center.y],rotation:this.rotation,wrap:[this.wrapS,this.wrapT],format:this.format,internalFormat:this.internalFormat,type:this.type,colorSpace:this.colorSpace,minFilter:this.minFilter,magFilter:this.magFilter,anisotropy:this.anisotropy,flipY:this.flipY,generateMipmaps:this.generateMipmaps,premultiplyAlpha:this.premultiplyAlpha,unpackAlignment:this.unpackAlignment};return Object.keys(this.userData).length>0&&(n.userData=this.userData),t||(e.textures[this.uuid]=n),n}dispose(){this.dispatchEvent({type:"dispose"})}transformUv(e){if(this.mapping!==lh)return e;if(e.applyMatrix3(this.matrix),e.x<0||e.x>1)switch(this.wrapS){case _s:e.x=e.x-Math.floor(e.x);break;case cr:e.x=e.x<0?0:1;break;case ma:Math.abs(Math.floor(e.x)%2)===1?e.x=Math.ceil(e.x)-e.x:e.x=e.x-Math.floor(e.x);break}if(e.y<0||e.y>1)switch(this.wrapT){case _s:e.y=e.y-Math.floor(e.y);break;case cr:e.y=e.y<0?0:1;break;case ma:Math.abs(Math.floor(e.y)%2)===1?e.y=Math.ceil(e.y)-e.y:e.y=e.y-Math.floor(e.y);break}return this.flipY&&(e.y=1-e.y),e}set needsUpdate(e){e===!0&&(this.version++,this.source.needsUpdate=!0)}set needsPMREMUpdate(e){e===!0&&this.pmremVersion++}}un.DEFAULT_IMAGE=null;un.DEFAULT_MAPPING=lh;un.DEFAULT_ANISOTROPY=1;class mt{constructor(e=0,t=0,n=0,r=1){mt.prototype.isVector4=!0,this.x=e,this.y=t,this.z=n,this.w=r}get width(){return this.z}set width(e){this.z=e}get height(){return this.w}set height(e){this.w=e}set(e,t,n,r){return this.x=e,this.y=t,this.z=n,this.w=r,this}setScalar(e){return this.x=e,this.y=e,this.z=e,this.w=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setZ(e){return this.z=e,this}setW(e){return this.w=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;case 2:this.z=t;break;case 3:this.w=t;break;default:throw new Error("index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;case 2:return this.z;case 3:return this.w;default:throw new Error("index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y,this.z,this.w)}copy(e){return this.x=e.x,this.y=e.y,this.z=e.z,this.w=e.w!==void 0?e.w:1,this}add(e){return this.x+=e.x,this.y+=e.y,this.z+=e.z,this.w+=e.w,this}addScalar(e){return this.x+=e,this.y+=e,this.z+=e,this.w+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this.z=e.z+t.z,this.w=e.w+t.w,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this.z+=e.z*t,this.w+=e.w*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this.z-=e.z,this.w-=e.w,this}subScalar(e){return this.x-=e,this.y-=e,this.z-=e,this.w-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this.z=e.z-t.z,this.w=e.w-t.w,this}multiply(e){return this.x*=e.x,this.y*=e.y,this.z*=e.z,this.w*=e.w,this}multiplyScalar(e){return this.x*=e,this.y*=e,this.z*=e,this.w*=e,this}applyMatrix4(e){const t=this.x,n=this.y,r=this.z,s=this.w,o=e.elements;return this.x=o[0]*t+o[4]*n+o[8]*r+o[12]*s,this.y=o[1]*t+o[5]*n+o[9]*r+o[13]*s,this.z=o[2]*t+o[6]*n+o[10]*r+o[14]*s,this.w=o[3]*t+o[7]*n+o[11]*r+o[15]*s,this}divide(e){return this.x/=e.x,this.y/=e.y,this.z/=e.z,this.w/=e.w,this}divideScalar(e){return this.multiplyScalar(1/e)}setAxisAngleFromQuaternion(e){this.w=2*Math.acos(e.w);const t=Math.sqrt(1-e.w*e.w);return t<1e-4?(this.x=1,this.y=0,this.z=0):(this.x=e.x/t,this.y=e.y/t,this.z=e.z/t),this}setAxisAngleFromRotationMatrix(e){let t,n,r,s;const l=e.elements,c=l[0],u=l[4],d=l[8],h=l[1],p=l[5],g=l[9],b=l[2],m=l[6],f=l[10];if(Math.abs(u-h)<.01&&Math.abs(d-b)<.01&&Math.abs(g-m)<.01){if(Math.abs(u+h)<.1&&Math.abs(d+b)<.1&&Math.abs(g+m)<.1&&Math.abs(c+p+f-3)<.1)return this.set(1,0,0,0),this;t=Math.PI;const x=(c+1)/2,_=(p+1)/2,D=(f+1)/2,P=(u+h)/4,T=(d+b)/4,N=(g+m)/4;return x>_&&x>D?x<.01?(n=0,r=.707106781,s=.707106781):(n=Math.sqrt(x),r=P/n,s=T/n):_>D?_<.01?(n=.707106781,r=0,s=.707106781):(r=Math.sqrt(_),n=P/r,s=N/r):D<.01?(n=.707106781,r=.707106781,s=0):(s=Math.sqrt(D),n=T/s,r=N/s),this.set(n,r,s,t),this}let M=Math.sqrt((m-g)*(m-g)+(d-b)*(d-b)+(h-u)*(h-u));return Math.abs(M)<.001&&(M=1),this.x=(m-g)/M,this.y=(d-b)/M,this.z=(h-u)/M,this.w=Math.acos((c+p+f-1)/2),this}setFromMatrixPosition(e){const t=e.elements;return this.x=t[12],this.y=t[13],this.z=t[14],this.w=t[15],this}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this.z=Math.min(this.z,e.z),this.w=Math.min(this.w,e.w),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this.z=Math.max(this.z,e.z),this.w=Math.max(this.w,e.w),this}clamp(e,t){return this.x=Math.max(e.x,Math.min(t.x,this.x)),this.y=Math.max(e.y,Math.min(t.y,this.y)),this.z=Math.max(e.z,Math.min(t.z,this.z)),this.w=Math.max(e.w,Math.min(t.w,this.w)),this}clampScalar(e,t){return this.x=Math.max(e,Math.min(t,this.x)),this.y=Math.max(e,Math.min(t,this.y)),this.z=Math.max(e,Math.min(t,this.z)),this.w=Math.max(e,Math.min(t,this.w)),this}clampLength(e,t){const n=this.length();return this.divideScalar(n||1).multiplyScalar(Math.max(e,Math.min(t,n)))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this.w=Math.floor(this.w),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this.w=Math.ceil(this.w),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this.w=Math.round(this.w),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this.w=Math.trunc(this.w),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this.w=-this.w,this}dot(e){return this.x*e.x+this.y*e.y+this.z*e.z+this.w*e.w}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)+Math.abs(this.w)}normalize(){return this.divideScalar(this.length()||1)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this.z+=(e.z-this.z)*t,this.w+=(e.w-this.w)*t,this}lerpVectors(e,t,n){return this.x=e.x+(t.x-e.x)*n,this.y=e.y+(t.y-e.y)*n,this.z=e.z+(t.z-e.z)*n,this.w=e.w+(t.w-e.w)*n,this}equals(e){return e.x===this.x&&e.y===this.y&&e.z===this.z&&e.w===this.w}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this.z=e[t+2],this.w=e[t+3],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e[t+2]=this.z,e[t+3]=this.w,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this.z=e.getZ(t),this.w=e.getW(t),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this.w=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z,yield this.w}}class zp extends Nr{constructor(e=1,t=1,n={}){super(),this.isRenderTarget=!0,this.width=e,this.height=t,this.depth=1,this.scissor=new mt(0,0,e,t),this.scissorTest=!1,this.viewport=new mt(0,0,e,t);const r={width:e,height:t,depth:1};n=Object.assign({generateMipmaps:!1,internalFormat:null,minFilter:jn,depthBuffer:!0,stencilBuffer:!1,resolveDepthBuffer:!0,resolveStencilBuffer:!0,depthTexture:null,samples:0,count:1},n);const s=new un(r,n.mapping,n.wrapS,n.wrapT,n.magFilter,n.minFilter,n.format,n.type,n.anisotropy,n.colorSpace);s.flipY=!1,s.generateMipmaps=n.generateMipmaps,s.internalFormat=n.internalFormat,this.textures=[];const o=n.count;for(let a=0;a<o;a++)this.textures[a]=s.clone(),this.textures[a].isRenderTargetTexture=!0;this.depthBuffer=n.depthBuffer,this.stencilBuffer=n.stencilBuffer,this.resolveDepthBuffer=n.resolveDepthBuffer,this.resolveStencilBuffer=n.resolveStencilBuffer,this.depthTexture=n.depthTexture,this.samples=n.samples}get texture(){return this.textures[0]}set texture(e){this.textures[0]=e}setSize(e,t,n=1){if(this.width!==e||this.height!==t||this.depth!==n){this.width=e,this.height=t,this.depth=n;for(let r=0,s=this.textures.length;r<s;r++)this.textures[r].image.width=e,this.textures[r].image.height=t,this.textures[r].image.depth=n;this.dispose()}this.viewport.set(0,0,e,t),this.scissor.set(0,0,e,t)}clone(){return new this.constructor().copy(this)}copy(e){this.width=e.width,this.height=e.height,this.depth=e.depth,this.scissor.copy(e.scissor),this.scissorTest=e.scissorTest,this.viewport.copy(e.viewport),this.textures.length=0;for(let n=0,r=e.textures.length;n<r;n++)this.textures[n]=e.textures[n].clone(),this.textures[n].isRenderTargetTexture=!0;const t=Object.assign({},e.texture.image);return this.texture.source=new wh(t),this.depthBuffer=e.depthBuffer,this.stencilBuffer=e.stencilBuffer,this.resolveDepthBuffer=e.resolveDepthBuffer,this.resolveStencilBuffer=e.resolveStencilBuffer,e.depthTexture!==null&&(this.depthTexture=e.depthTexture.clone()),this.samples=e.samples,this}dispose(){this.dispatchEvent({type:"dispose"})}}class hr extends zp{constructor(e=1,t=1,n={}){super(e,t,n),this.isWebGLRenderTarget=!0}}class Eh extends un{constructor(e=null,t=1,n=1,r=1){super(null),this.isDataArrayTexture=!0,this.image={data:e,width:t,height:n,depth:r},this.magFilter=Pn,this.minFilter=Pn,this.wrapR=cr,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1,this.layerUpdates=new Set}addLayerUpdate(e){this.layerUpdates.add(e)}clearLayerUpdates(){this.layerUpdates.clear()}}class Hp extends un{constructor(e=null,t=1,n=1,r=1){super(null),this.isData3DTexture=!0,this.image={data:e,width:t,height:n,depth:r},this.magFilter=Pn,this.minFilter=Pn,this.wrapR=cr,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}}class qe{constructor(e=0,t=0,n=0,r=1){this.isQuaternion=!0,this._x=e,this._y=t,this._z=n,this._w=r}static slerpFlat(e,t,n,r,s,o,a){let l=n[r+0],c=n[r+1],u=n[r+2],d=n[r+3];const h=s[o+0],p=s[o+1],g=s[o+2],b=s[o+3];if(a===0){e[t+0]=l,e[t+1]=c,e[t+2]=u,e[t+3]=d;return}if(a===1){e[t+0]=h,e[t+1]=p,e[t+2]=g,e[t+3]=b;return}if(d!==b||l!==h||c!==p||u!==g){let m=1-a;const f=l*h+c*p+u*g+d*b,M=f>=0?1:-1,x=1-f*f;if(x>Number.EPSILON){const D=Math.sqrt(x),P=Math.atan2(D,f*M);m=Math.sin(m*P)/D,a=Math.sin(a*P)/D}const _=a*M;if(l=l*m+h*_,c=c*m+p*_,u=u*m+g*_,d=d*m+b*_,m===1-a){const D=1/Math.sqrt(l*l+c*c+u*u+d*d);l*=D,c*=D,u*=D,d*=D}}e[t]=l,e[t+1]=c,e[t+2]=u,e[t+3]=d}static multiplyQuaternionsFlat(e,t,n,r,s,o){const a=n[r],l=n[r+1],c=n[r+2],u=n[r+3],d=s[o],h=s[o+1],p=s[o+2],g=s[o+3];return e[t]=a*g+u*d+l*p-c*h,e[t+1]=l*g+u*h+c*d-a*p,e[t+2]=c*g+u*p+a*h-l*d,e[t+3]=u*g-a*d-l*h-c*p,e}get x(){return this._x}set x(e){this._x=e,this._onChangeCallback()}get y(){return this._y}set y(e){this._y=e,this._onChangeCallback()}get z(){return this._z}set z(e){this._z=e,this._onChangeCallback()}get w(){return this._w}set w(e){this._w=e,this._onChangeCallback()}set(e,t,n,r){return this._x=e,this._y=t,this._z=n,this._w=r,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._w)}copy(e){return this._x=e.x,this._y=e.y,this._z=e.z,this._w=e.w,this._onChangeCallback(),this}setFromEuler(e,t=!0){const n=e._x,r=e._y,s=e._z,o=e._order,a=Math.cos,l=Math.sin,c=a(n/2),u=a(r/2),d=a(s/2),h=l(n/2),p=l(r/2),g=l(s/2);switch(o){case"XYZ":this._x=h*u*d+c*p*g,this._y=c*p*d-h*u*g,this._z=c*u*g+h*p*d,this._w=c*u*d-h*p*g;break;case"YXZ":this._x=h*u*d+c*p*g,this._y=c*p*d-h*u*g,this._z=c*u*g-h*p*d,this._w=c*u*d+h*p*g;break;case"ZXY":this._x=h*u*d-c*p*g,this._y=c*p*d+h*u*g,this._z=c*u*g+h*p*d,this._w=c*u*d-h*p*g;break;case"ZYX":this._x=h*u*d-c*p*g,this._y=c*p*d+h*u*g,this._z=c*u*g-h*p*d,this._w=c*u*d+h*p*g;break;case"YZX":this._x=h*u*d+c*p*g,this._y=c*p*d+h*u*g,this._z=c*u*g-h*p*d,this._w=c*u*d-h*p*g;break;case"XZY":this._x=h*u*d-c*p*g,this._y=c*p*d-h*u*g,this._z=c*u*g+h*p*d,this._w=c*u*d+h*p*g;break;default:console.warn("THREE.Quaternion: .setFromEuler() encountered an unknown order: "+o)}return t===!0&&this._onChangeCallback(),this}setFromAxisAngle(e,t){const n=t/2,r=Math.sin(n);return this._x=e.x*r,this._y=e.y*r,this._z=e.z*r,this._w=Math.cos(n),this._onChangeCallback(),this}setFromRotationMatrix(e){const t=e.elements,n=t[0],r=t[4],s=t[8],o=t[1],a=t[5],l=t[9],c=t[2],u=t[6],d=t[10],h=n+a+d;if(h>0){const p=.5/Math.sqrt(h+1);this._w=.25/p,this._x=(u-l)*p,this._y=(s-c)*p,this._z=(o-r)*p}else if(n>a&&n>d){const p=2*Math.sqrt(1+n-a-d);this._w=(u-l)/p,this._x=.25*p,this._y=(r+o)/p,this._z=(s+c)/p}else if(a>d){const p=2*Math.sqrt(1+a-n-d);this._w=(s-c)/p,this._x=(r+o)/p,this._y=.25*p,this._z=(l+u)/p}else{const p=2*Math.sqrt(1+d-n-a);this._w=(o-r)/p,this._x=(s+c)/p,this._y=(l+u)/p,this._z=.25*p}return this._onChangeCallback(),this}setFromUnitVectors(e,t){let n=e.dot(t)+1;return n<Number.EPSILON?(n=0,Math.abs(e.x)>Math.abs(e.z)?(this._x=-e.y,this._y=e.x,this._z=0,this._w=n):(this._x=0,this._y=-e.z,this._z=e.y,this._w=n)):(this._x=e.y*t.z-e.z*t.y,this._y=e.z*t.x-e.x*t.z,this._z=e.x*t.y-e.y*t.x,this._w=n),this.normalize()}angleTo(e){return 2*Math.acos(Math.abs(xn(this.dot(e),-1,1)))}rotateTowards(e,t){const n=this.angleTo(e);if(n===0)return this;const r=Math.min(1,t/n);return this.slerp(e,r),this}identity(){return this.set(0,0,0,1)}invert(){return this.conjugate()}conjugate(){return this._x*=-1,this._y*=-1,this._z*=-1,this._onChangeCallback(),this}dot(e){return this._x*e._x+this._y*e._y+this._z*e._z+this._w*e._w}lengthSq(){return this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w}length(){return Math.sqrt(this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w)}normalize(){let e=this.length();return e===0?(this._x=0,this._y=0,this._z=0,this._w=1):(e=1/e,this._x=this._x*e,this._y=this._y*e,this._z=this._z*e,this._w=this._w*e),this._onChangeCallback(),this}multiply(e){return this.multiplyQuaternions(this,e)}premultiply(e){return this.multiplyQuaternions(e,this)}multiplyQuaternions(e,t){const n=e._x,r=e._y,s=e._z,o=e._w,a=t._x,l=t._y,c=t._z,u=t._w;return this._x=n*u+o*a+r*c-s*l,this._y=r*u+o*l+s*a-n*c,this._z=s*u+o*c+n*l-r*a,this._w=o*u-n*a-r*l-s*c,this._onChangeCallback(),this}slerp(e,t){if(t===0)return this;if(t===1)return this.copy(e);const n=this._x,r=this._y,s=this._z,o=this._w;let a=o*e._w+n*e._x+r*e._y+s*e._z;if(a<0?(this._w=-e._w,this._x=-e._x,this._y=-e._y,this._z=-e._z,a=-a):this.copy(e),a>=1)return this._w=o,this._x=n,this._y=r,this._z=s,this;const l=1-a*a;if(l<=Number.EPSILON){const p=1-t;return this._w=p*o+t*this._w,this._x=p*n+t*this._x,this._y=p*r+t*this._y,this._z=p*s+t*this._z,this.normalize(),this}const c=Math.sqrt(l),u=Math.atan2(c,a),d=Math.sin((1-t)*u)/c,h=Math.sin(t*u)/c;return this._w=o*d+this._w*h,this._x=n*d+this._x*h,this._y=r*d+this._y*h,this._z=s*d+this._z*h,this._onChangeCallback(),this}slerpQuaternions(e,t,n){return this.copy(e).slerp(t,n)}random(){const e=2*Math.PI*Math.random(),t=2*Math.PI*Math.random(),n=Math.random(),r=Math.sqrt(1-n),s=Math.sqrt(n);return this.set(r*Math.sin(e),r*Math.cos(e),s*Math.sin(t),s*Math.cos(t))}equals(e){return e._x===this._x&&e._y===this._y&&e._z===this._z&&e._w===this._w}fromArray(e,t=0){return this._x=e[t],this._y=e[t+1],this._z=e[t+2],this._w=e[t+3],this._onChangeCallback(),this}toArray(e=[],t=0){return e[t]=this._x,e[t+1]=this._y,e[t+2]=this._z,e[t+3]=this._w,e}fromBufferAttribute(e,t){return this._x=e.getX(t),this._y=e.getY(t),this._z=e.getZ(t),this._w=e.getW(t),this._onChangeCallback(),this}toJSON(){return this.toArray()}_onChange(e){return this._onChangeCallback=e,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._w}}class A{constructor(e=0,t=0,n=0){A.prototype.isVector3=!0,this.x=e,this.y=t,this.z=n}set(e,t,n){return n===void 0&&(n=this.z),this.x=e,this.y=t,this.z=n,this}setScalar(e){return this.x=e,this.y=e,this.z=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setZ(e){return this.z=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;case 2:this.z=t;break;default:throw new Error("index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;case 2:return this.z;default:throw new Error("index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y,this.z)}copy(e){return this.x=e.x,this.y=e.y,this.z=e.z,this}add(e){return this.x+=e.x,this.y+=e.y,this.z+=e.z,this}addScalar(e){return this.x+=e,this.y+=e,this.z+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this.z=e.z+t.z,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this.z+=e.z*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this.z-=e.z,this}subScalar(e){return this.x-=e,this.y-=e,this.z-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this.z=e.z-t.z,this}multiply(e){return this.x*=e.x,this.y*=e.y,this.z*=e.z,this}multiplyScalar(e){return this.x*=e,this.y*=e,this.z*=e,this}multiplyVectors(e,t){return this.x=e.x*t.x,this.y=e.y*t.y,this.z=e.z*t.z,this}applyEuler(e){return this.applyQuaternion(Cu.setFromEuler(e))}applyAxisAngle(e,t){return this.applyQuaternion(Cu.setFromAxisAngle(e,t))}applyMatrix3(e){const t=this.x,n=this.y,r=this.z,s=e.elements;return this.x=s[0]*t+s[3]*n+s[6]*r,this.y=s[1]*t+s[4]*n+s[7]*r,this.z=s[2]*t+s[5]*n+s[8]*r,this}applyNormalMatrix(e){return this.applyMatrix3(e).normalize()}applyMatrix4(e){const t=this.x,n=this.y,r=this.z,s=e.elements,o=1/(s[3]*t+s[7]*n+s[11]*r+s[15]);return this.x=(s[0]*t+s[4]*n+s[8]*r+s[12])*o,this.y=(s[1]*t+s[5]*n+s[9]*r+s[13])*o,this.z=(s[2]*t+s[6]*n+s[10]*r+s[14])*o,this}applyQuaternion(e){const t=this.x,n=this.y,r=this.z,s=e.x,o=e.y,a=e.z,l=e.w,c=2*(o*r-a*n),u=2*(a*t-s*r),d=2*(s*n-o*t);return this.x=t+l*c+o*d-a*u,this.y=n+l*u+a*c-s*d,this.z=r+l*d+s*u-o*c,this}project(e){return this.applyMatrix4(e.matrixWorldInverse).applyMatrix4(e.projectionMatrix)}unproject(e){return this.applyMatrix4(e.projectionMatrixInverse).applyMatrix4(e.matrixWorld)}transformDirection(e){const t=this.x,n=this.y,r=this.z,s=e.elements;return this.x=s[0]*t+s[4]*n+s[8]*r,this.y=s[1]*t+s[5]*n+s[9]*r,this.z=s[2]*t+s[6]*n+s[10]*r,this.normalize()}divide(e){return this.x/=e.x,this.y/=e.y,this.z/=e.z,this}divideScalar(e){return this.multiplyScalar(1/e)}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this.z=Math.min(this.z,e.z),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this.z=Math.max(this.z,e.z),this}clamp(e,t){return this.x=Math.max(e.x,Math.min(t.x,this.x)),this.y=Math.max(e.y,Math.min(t.y,this.y)),this.z=Math.max(e.z,Math.min(t.z,this.z)),this}clampScalar(e,t){return this.x=Math.max(e,Math.min(t,this.x)),this.y=Math.max(e,Math.min(t,this.y)),this.z=Math.max(e,Math.min(t,this.z)),this}clampLength(e,t){const n=this.length();return this.divideScalar(n||1).multiplyScalar(Math.max(e,Math.min(t,n)))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this}dot(e){return this.x*e.x+this.y*e.y+this.z*e.z}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)}normalize(){return this.divideScalar(this.length()||1)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this.z+=(e.z-this.z)*t,this}lerpVectors(e,t,n){return this.x=e.x+(t.x-e.x)*n,this.y=e.y+(t.y-e.y)*n,this.z=e.z+(t.z-e.z)*n,this}cross(e){return this.crossVectors(this,e)}crossVectors(e,t){const n=e.x,r=e.y,s=e.z,o=t.x,a=t.y,l=t.z;return this.x=r*l-s*a,this.y=s*o-n*l,this.z=n*a-r*o,this}projectOnVector(e){const t=e.lengthSq();if(t===0)return this.set(0,0,0);const n=e.dot(this)/t;return this.copy(e).multiplyScalar(n)}projectOnPlane(e){return Wa.copy(this).projectOnVector(e),this.sub(Wa)}reflect(e){return this.sub(Wa.copy(e).multiplyScalar(2*this.dot(e)))}angleTo(e){const t=Math.sqrt(this.lengthSq()*e.lengthSq());if(t===0)return Math.PI/2;const n=this.dot(e)/t;return Math.acos(xn(n,-1,1))}distanceTo(e){return Math.sqrt(this.distanceToSquared(e))}distanceToSquared(e){const t=this.x-e.x,n=this.y-e.y,r=this.z-e.z;return t*t+n*n+r*r}manhattanDistanceTo(e){return Math.abs(this.x-e.x)+Math.abs(this.y-e.y)+Math.abs(this.z-e.z)}setFromSpherical(e){return this.setFromSphericalCoords(e.radius,e.phi,e.theta)}setFromSphericalCoords(e,t,n){const r=Math.sin(t)*e;return this.x=r*Math.sin(n),this.y=Math.cos(t)*e,this.z=r*Math.cos(n),this}setFromCylindrical(e){return this.setFromCylindricalCoords(e.radius,e.theta,e.y)}setFromCylindricalCoords(e,t,n){return this.x=e*Math.sin(t),this.y=n,this.z=e*Math.cos(t),this}setFromMatrixPosition(e){const t=e.elements;return this.x=t[12],this.y=t[13],this.z=t[14],this}setFromMatrixScale(e){const t=this.setFromMatrixColumn(e,0).length(),n=this.setFromMatrixColumn(e,1).length(),r=this.setFromMatrixColumn(e,2).length();return this.x=t,this.y=n,this.z=r,this}setFromMatrixColumn(e,t){return this.fromArray(e.elements,t*4)}setFromMatrix3Column(e,t){return this.fromArray(e.elements,t*3)}setFromEuler(e){return this.x=e._x,this.y=e._y,this.z=e._z,this}setFromColor(e){return this.x=e.r,this.y=e.g,this.z=e.b,this}equals(e){return e.x===this.x&&e.y===this.y&&e.z===this.z}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this.z=e[t+2],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e[t+2]=this.z,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this.z=e.getZ(t),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this}randomDirection(){const e=Math.random()*Math.PI*2,t=Math.random()*2-1,n=Math.sqrt(1-t*t);return this.x=n*Math.cos(e),this.y=t,this.z=n*Math.sin(e),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z}}const Wa=new A,Cu=new qe;class an{constructor(e=new A(1/0,1/0,1/0),t=new A(-1/0,-1/0,-1/0)){this.isBox3=!0,this.min=e,this.max=t}set(e,t){return this.min.copy(e),this.max.copy(t),this}setFromArray(e){this.makeEmpty();for(let t=0,n=e.length;t<n;t+=3)this.expandByPoint(ii.fromArray(e,t));return this}setFromBufferAttribute(e){this.makeEmpty();for(let t=0,n=e.count;t<n;t++)this.expandByPoint(ii.fromBufferAttribute(e,t));return this}setFromPoints(e){this.makeEmpty();for(let t=0,n=e.length;t<n;t++)this.expandByPoint(e[t]);return this}setFromCenterAndSize(e,t){const n=ii.copy(t).multiplyScalar(.5);return this.min.copy(e).sub(n),this.max.copy(e).add(n),this}setFromObject(e,t=!1){return this.makeEmpty(),this.expandByObject(e,t)}clone(){return new this.constructor().copy(this)}copy(e){return this.min.copy(e.min),this.max.copy(e.max),this}makeEmpty(){return this.min.x=this.min.y=this.min.z=1/0,this.max.x=this.max.y=this.max.z=-1/0,this}isEmpty(){return this.max.x<this.min.x||this.max.y<this.min.y||this.max.z<this.min.z}getCenter(e){return this.isEmpty()?e.set(0,0,0):e.addVectors(this.min,this.max).multiplyScalar(.5)}getSize(e){return this.isEmpty()?e.set(0,0,0):e.subVectors(this.max,this.min)}expandByPoint(e){return this.min.min(e),this.max.max(e),this}expandByVector(e){return this.min.sub(e),this.max.add(e),this}expandByScalar(e){return this.min.addScalar(-e),this.max.addScalar(e),this}expandByObject(e,t=!1){e.updateWorldMatrix(!1,!1);const n=e.geometry;if(n!==void 0){const s=n.getAttribute("position");if(t===!0&&s!==void 0&&e.isInstancedMesh!==!0)for(let o=0,a=s.count;o<a;o++)e.isMesh===!0?e.getVertexPosition(o,ii):ii.fromBufferAttribute(s,o),ii.applyMatrix4(e.matrixWorld),this.expandByPoint(ii);else e.boundingBox!==void 0?(e.boundingBox===null&&e.computeBoundingBox(),_o.copy(e.boundingBox)):(n.boundingBox===null&&n.computeBoundingBox(),_o.copy(n.boundingBox)),_o.applyMatrix4(e.matrixWorld),this.union(_o)}const r=e.children;for(let s=0,o=r.length;s<o;s++)this.expandByObject(r[s],t);return this}containsPoint(e){return e.x>=this.min.x&&e.x<=this.max.x&&e.y>=this.min.y&&e.y<=this.max.y&&e.z>=this.min.z&&e.z<=this.max.z}containsBox(e){return this.min.x<=e.min.x&&e.max.x<=this.max.x&&this.min.y<=e.min.y&&e.max.y<=this.max.y&&this.min.z<=e.min.z&&e.max.z<=this.max.z}getParameter(e,t){return t.set((e.x-this.min.x)/(this.max.x-this.min.x),(e.y-this.min.y)/(this.max.y-this.min.y),(e.z-this.min.z)/(this.max.z-this.min.z))}intersectsBox(e){return e.max.x>=this.min.x&&e.min.x<=this.max.x&&e.max.y>=this.min.y&&e.min.y<=this.max.y&&e.max.z>=this.min.z&&e.min.z<=this.max.z}intersectsSphere(e){return this.clampPoint(e.center,ii),ii.distanceToSquared(e.center)<=e.radius*e.radius}intersectsPlane(e){let t,n;return e.normal.x>0?(t=e.normal.x*this.min.x,n=e.normal.x*this.max.x):(t=e.normal.x*this.max.x,n=e.normal.x*this.min.x),e.normal.y>0?(t+=e.normal.y*this.min.y,n+=e.normal.y*this.max.y):(t+=e.normal.y*this.max.y,n+=e.normal.y*this.min.y),e.normal.z>0?(t+=e.normal.z*this.min.z,n+=e.normal.z*this.max.z):(t+=e.normal.z*this.max.z,n+=e.normal.z*this.min.z),t<=-e.constant&&n>=-e.constant}intersectsTriangle(e){if(this.isEmpty())return!1;this.getCenter(ks),xo.subVectors(this.max,ks),Br.subVectors(e.a,ks),zr.subVectors(e.b,ks),Hr.subVectors(e.c,ks),Yi.subVectors(zr,Br),$i.subVectors(Hr,zr),xr.subVectors(Br,Hr);let t=[0,-Yi.z,Yi.y,0,-$i.z,$i.y,0,-xr.z,xr.y,Yi.z,0,-Yi.x,$i.z,0,-$i.x,xr.z,0,-xr.x,-Yi.y,Yi.x,0,-$i.y,$i.x,0,-xr.y,xr.x,0];return!qa(t,Br,zr,Hr,xo)||(t=[1,0,0,0,1,0,0,0,1],!qa(t,Br,zr,Hr,xo))?!1:(vo.crossVectors(Yi,$i),t=[vo.x,vo.y,vo.z],qa(t,Br,zr,Hr,xo))}clampPoint(e,t){return t.copy(e).clamp(this.min,this.max)}distanceToPoint(e){return this.clampPoint(e,ii).distanceTo(e)}getBoundingSphere(e){return this.isEmpty()?e.makeEmpty():(this.getCenter(e.center),e.radius=this.getSize(ii).length()*.5),e}intersect(e){return this.min.max(e.min),this.max.min(e.max),this.isEmpty()&&this.makeEmpty(),this}union(e){return this.min.min(e.min),this.max.max(e.max),this}applyMatrix4(e){return this.isEmpty()?this:(Pi[0].set(this.min.x,this.min.y,this.min.z).applyMatrix4(e),Pi[1].set(this.min.x,this.min.y,this.max.z).applyMatrix4(e),Pi[2].set(this.min.x,this.max.y,this.min.z).applyMatrix4(e),Pi[3].set(this.min.x,this.max.y,this.max.z).applyMatrix4(e),Pi[4].set(this.max.x,this.min.y,this.min.z).applyMatrix4(e),Pi[5].set(this.max.x,this.min.y,this.max.z).applyMatrix4(e),Pi[6].set(this.max.x,this.max.y,this.min.z).applyMatrix4(e),Pi[7].set(this.max.x,this.max.y,this.max.z).applyMatrix4(e),this.setFromPoints(Pi),this)}translate(e){return this.min.add(e),this.max.add(e),this}equals(e){return e.min.equals(this.min)&&e.max.equals(this.max)}}const Pi=[new A,new A,new A,new A,new A,new A,new A,new A],ii=new A,_o=new an,Br=new A,zr=new A,Hr=new A,Yi=new A,$i=new A,xr=new A,ks=new A,xo=new A,vo=new A,vr=new A;function qa(i,e,t,n,r){for(let s=0,o=i.length-3;s<=o;s+=3){vr.fromArray(i,s);const a=r.x*Math.abs(vr.x)+r.y*Math.abs(vr.y)+r.z*Math.abs(vr.z),l=e.dot(vr),c=t.dot(vr),u=n.dot(vr);if(Math.max(-Math.max(l,c,u),Math.min(l,c,u))>a)return!1}return!0}const Gp=new an,Bs=new A,ja=new A;class wi{constructor(e=new A,t=-1){this.isSphere=!0,this.center=e,this.radius=t}set(e,t){return this.center.copy(e),this.radius=t,this}setFromPoints(e,t){const n=this.center;t!==void 0?n.copy(t):Gp.setFromPoints(e).getCenter(n);let r=0;for(let s=0,o=e.length;s<o;s++)r=Math.max(r,n.distanceToSquared(e[s]));return this.radius=Math.sqrt(r),this}copy(e){return this.center.copy(e.center),this.radius=e.radius,this}isEmpty(){return this.radius<0}makeEmpty(){return this.center.set(0,0,0),this.radius=-1,this}containsPoint(e){return e.distanceToSquared(this.center)<=this.radius*this.radius}distanceToPoint(e){return e.distanceTo(this.center)-this.radius}intersectsSphere(e){const t=this.radius+e.radius;return e.center.distanceToSquared(this.center)<=t*t}intersectsBox(e){return e.intersectsSphere(this)}intersectsPlane(e){return Math.abs(e.distanceToPoint(this.center))<=this.radius}clampPoint(e,t){const n=this.center.distanceToSquared(e);return t.copy(e),n>this.radius*this.radius&&(t.sub(this.center).normalize(),t.multiplyScalar(this.radius).add(this.center)),t}getBoundingBox(e){return this.isEmpty()?(e.makeEmpty(),e):(e.set(this.center,this.center),e.expandByScalar(this.radius),e)}applyMatrix4(e){return this.center.applyMatrix4(e),this.radius=this.radius*e.getMaxScaleOnAxis(),this}translate(e){return this.center.add(e),this}expandByPoint(e){if(this.isEmpty())return this.center.copy(e),this.radius=0,this;Bs.subVectors(e,this.center);const t=Bs.lengthSq();if(t>this.radius*this.radius){const n=Math.sqrt(t),r=(n-this.radius)*.5;this.center.addScaledVector(Bs,r/n),this.radius+=r}return this}union(e){return e.isEmpty()?this:this.isEmpty()?(this.copy(e),this):(this.center.equals(e.center)===!0?this.radius=Math.max(this.radius,e.radius):(ja.subVectors(e.center,this.center).setLength(e.radius),this.expandByPoint(Bs.copy(e.center).add(ja)),this.expandByPoint(Bs.copy(e.center).sub(ja))),this)}equals(e){return e.center.equals(this.center)&&e.radius===this.radius}clone(){return new this.constructor().copy(this)}}const Li=new A,Xa=new A,yo=new A,Zi=new A,Qa=new A,Mo=new A,Ka=new A;class Rs{constructor(e=new A,t=new A(0,0,-1)){this.origin=e,this.direction=t}set(e,t){return this.origin.copy(e),this.direction.copy(t),this}copy(e){return this.origin.copy(e.origin),this.direction.copy(e.direction),this}at(e,t){return t.copy(this.origin).addScaledVector(this.direction,e)}lookAt(e){return this.direction.copy(e).sub(this.origin).normalize(),this}recast(e){return this.origin.copy(this.at(e,Li)),this}closestPointToPoint(e,t){t.subVectors(e,this.origin);const n=t.dot(this.direction);return n<0?t.copy(this.origin):t.copy(this.origin).addScaledVector(this.direction,n)}distanceToPoint(e){return Math.sqrt(this.distanceSqToPoint(e))}distanceSqToPoint(e){const t=Li.subVectors(e,this.origin).dot(this.direction);return t<0?this.origin.distanceToSquared(e):(Li.copy(this.origin).addScaledVector(this.direction,t),Li.distanceToSquared(e))}distanceSqToSegment(e,t,n,r){Xa.copy(e).add(t).multiplyScalar(.5),yo.copy(t).sub(e).normalize(),Zi.copy(this.origin).sub(Xa);const s=e.distanceTo(t)*.5,o=-this.direction.dot(yo),a=Zi.dot(this.direction),l=-Zi.dot(yo),c=Zi.lengthSq(),u=Math.abs(1-o*o);let d,h,p,g;if(u>0)if(d=o*l-a,h=o*a-l,g=s*u,d>=0)if(h>=-g)if(h<=g){const b=1/u;d*=b,h*=b,p=d*(d+o*h+2*a)+h*(o*d+h+2*l)+c}else h=s,d=Math.max(0,-(o*h+a)),p=-d*d+h*(h+2*l)+c;else h=-s,d=Math.max(0,-(o*h+a)),p=-d*d+h*(h+2*l)+c;else h<=-g?(d=Math.max(0,-(-o*s+a)),h=d>0?-s:Math.min(Math.max(-s,-l),s),p=-d*d+h*(h+2*l)+c):h<=g?(d=0,h=Math.min(Math.max(-s,-l),s),p=h*(h+2*l)+c):(d=Math.max(0,-(o*s+a)),h=d>0?s:Math.min(Math.max(-s,-l),s),p=-d*d+h*(h+2*l)+c);else h=o>0?-s:s,d=Math.max(0,-(o*h+a)),p=-d*d+h*(h+2*l)+c;return n&&n.copy(this.origin).addScaledVector(this.direction,d),r&&r.copy(Xa).addScaledVector(yo,h),p}intersectSphere(e,t){Li.subVectors(e.center,this.origin);const n=Li.dot(this.direction),r=Li.dot(Li)-n*n,s=e.radius*e.radius;if(r>s)return null;const o=Math.sqrt(s-r),a=n-o,l=n+o;return l<0?null:a<0?this.at(l,t):this.at(a,t)}intersectsSphere(e){return this.distanceSqToPoint(e.center)<=e.radius*e.radius}distanceToPlane(e){const t=e.normal.dot(this.direction);if(t===0)return e.distanceToPoint(this.origin)===0?0:null;const n=-(this.origin.dot(e.normal)+e.constant)/t;return n>=0?n:null}intersectPlane(e,t){const n=this.distanceToPlane(e);return n===null?null:this.at(n,t)}intersectsPlane(e){const t=e.distanceToPoint(this.origin);return t===0||e.normal.dot(this.direction)*t<0}intersectBox(e,t){let n,r,s,o,a,l;const c=1/this.direction.x,u=1/this.direction.y,d=1/this.direction.z,h=this.origin;return c>=0?(n=(e.min.x-h.x)*c,r=(e.max.x-h.x)*c):(n=(e.max.x-h.x)*c,r=(e.min.x-h.x)*c),u>=0?(s=(e.min.y-h.y)*u,o=(e.max.y-h.y)*u):(s=(e.max.y-h.y)*u,o=(e.min.y-h.y)*u),n>o||s>r||((s>n||isNaN(n))&&(n=s),(o<r||isNaN(r))&&(r=o),d>=0?(a=(e.min.z-h.z)*d,l=(e.max.z-h.z)*d):(a=(e.max.z-h.z)*d,l=(e.min.z-h.z)*d),n>l||a>r)||((a>n||n!==n)&&(n=a),(l<r||r!==r)&&(r=l),r<0)?null:this.at(n>=0?n:r,t)}intersectsBox(e){return this.intersectBox(e,Li)!==null}intersectTriangle(e,t,n,r,s){Qa.subVectors(t,e),Mo.subVectors(n,e),Ka.crossVectors(Qa,Mo);let o=this.direction.dot(Ka),a;if(o>0){if(r)return null;a=1}else if(o<0)a=-1,o=-o;else return null;Zi.subVectors(this.origin,e);const l=a*this.direction.dot(Mo.crossVectors(Zi,Mo));if(l<0)return null;const c=a*this.direction.dot(Qa.cross(Zi));if(c<0||l+c>o)return null;const u=-a*Zi.dot(Ka);return u<0?null:this.at(u/o,s)}applyMatrix4(e){return this.origin.applyMatrix4(e),this.direction.transformDirection(e),this}equals(e){return e.origin.equals(this.origin)&&e.direction.equals(this.direction)}clone(){return new this.constructor().copy(this)}}class ot{constructor(e,t,n,r,s,o,a,l,c,u,d,h,p,g,b,m){ot.prototype.isMatrix4=!0,this.elements=[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1],e!==void 0&&this.set(e,t,n,r,s,o,a,l,c,u,d,h,p,g,b,m)}set(e,t,n,r,s,o,a,l,c,u,d,h,p,g,b,m){const f=this.elements;return f[0]=e,f[4]=t,f[8]=n,f[12]=r,f[1]=s,f[5]=o,f[9]=a,f[13]=l,f[2]=c,f[6]=u,f[10]=d,f[14]=h,f[3]=p,f[7]=g,f[11]=b,f[15]=m,this}identity(){return this.set(1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1),this}clone(){return new ot().fromArray(this.elements)}copy(e){const t=this.elements,n=e.elements;return t[0]=n[0],t[1]=n[1],t[2]=n[2],t[3]=n[3],t[4]=n[4],t[5]=n[5],t[6]=n[6],t[7]=n[7],t[8]=n[8],t[9]=n[9],t[10]=n[10],t[11]=n[11],t[12]=n[12],t[13]=n[13],t[14]=n[14],t[15]=n[15],this}copyPosition(e){const t=this.elements,n=e.elements;return t[12]=n[12],t[13]=n[13],t[14]=n[14],this}setFromMatrix3(e){const t=e.elements;return this.set(t[0],t[3],t[6],0,t[1],t[4],t[7],0,t[2],t[5],t[8],0,0,0,0,1),this}extractBasis(e,t,n){return e.setFromMatrixColumn(this,0),t.setFromMatrixColumn(this,1),n.setFromMatrixColumn(this,2),this}makeBasis(e,t,n){return this.set(e.x,t.x,n.x,0,e.y,t.y,n.y,0,e.z,t.z,n.z,0,0,0,0,1),this}extractRotation(e){const t=this.elements,n=e.elements,r=1/Gr.setFromMatrixColumn(e,0).length(),s=1/Gr.setFromMatrixColumn(e,1).length(),o=1/Gr.setFromMatrixColumn(e,2).length();return t[0]=n[0]*r,t[1]=n[1]*r,t[2]=n[2]*r,t[3]=0,t[4]=n[4]*s,t[5]=n[5]*s,t[6]=n[6]*s,t[7]=0,t[8]=n[8]*o,t[9]=n[9]*o,t[10]=n[10]*o,t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,this}makeRotationFromEuler(e){const t=this.elements,n=e.x,r=e.y,s=e.z,o=Math.cos(n),a=Math.sin(n),l=Math.cos(r),c=Math.sin(r),u=Math.cos(s),d=Math.sin(s);if(e.order==="XYZ"){const h=o*u,p=o*d,g=a*u,b=a*d;t[0]=l*u,t[4]=-l*d,t[8]=c,t[1]=p+g*c,t[5]=h-b*c,t[9]=-a*l,t[2]=b-h*c,t[6]=g+p*c,t[10]=o*l}else if(e.order==="YXZ"){const h=l*u,p=l*d,g=c*u,b=c*d;t[0]=h+b*a,t[4]=g*a-p,t[8]=o*c,t[1]=o*d,t[5]=o*u,t[9]=-a,t[2]=p*a-g,t[6]=b+h*a,t[10]=o*l}else if(e.order==="ZXY"){const h=l*u,p=l*d,g=c*u,b=c*d;t[0]=h-b*a,t[4]=-o*d,t[8]=g+p*a,t[1]=p+g*a,t[5]=o*u,t[9]=b-h*a,t[2]=-o*c,t[6]=a,t[10]=o*l}else if(e.order==="ZYX"){const h=o*u,p=o*d,g=a*u,b=a*d;t[0]=l*u,t[4]=g*c-p,t[8]=h*c+b,t[1]=l*d,t[5]=b*c+h,t[9]=p*c-g,t[2]=-c,t[6]=a*l,t[10]=o*l}else if(e.order==="YZX"){const h=o*l,p=o*c,g=a*l,b=a*c;t[0]=l*u,t[4]=b-h*d,t[8]=g*d+p,t[1]=d,t[5]=o*u,t[9]=-a*u,t[2]=-c*u,t[6]=p*d+g,t[10]=h-b*d}else if(e.order==="XZY"){const h=o*l,p=o*c,g=a*l,b=a*c;t[0]=l*u,t[4]=-d,t[8]=c*u,t[1]=h*d+b,t[5]=o*u,t[9]=p*d-g,t[2]=g*d-p,t[6]=a*u,t[10]=b*d+h}return t[3]=0,t[7]=0,t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,this}makeRotationFromQuaternion(e){return this.compose(Vp,e,Wp)}lookAt(e,t,n){const r=this.elements;return Vn.subVectors(e,t),Vn.lengthSq()===0&&(Vn.z=1),Vn.normalize(),Ji.crossVectors(n,Vn),Ji.lengthSq()===0&&(Math.abs(n.z)===1?Vn.x+=1e-4:Vn.z+=1e-4,Vn.normalize(),Ji.crossVectors(n,Vn)),Ji.normalize(),So.crossVectors(Vn,Ji),r[0]=Ji.x,r[4]=So.x,r[8]=Vn.x,r[1]=Ji.y,r[5]=So.y,r[9]=Vn.y,r[2]=Ji.z,r[6]=So.z,r[10]=Vn.z,this}multiply(e){return this.multiplyMatrices(this,e)}premultiply(e){return this.multiplyMatrices(e,this)}multiplyMatrices(e,t){const n=e.elements,r=t.elements,s=this.elements,o=n[0],a=n[4],l=n[8],c=n[12],u=n[1],d=n[5],h=n[9],p=n[13],g=n[2],b=n[6],m=n[10],f=n[14],M=n[3],x=n[7],_=n[11],D=n[15],P=r[0],T=r[4],N=r[8],v=r[12],y=r[1],C=r[5],q=r[9],O=r[13],$=r[2],se=r[6],Z=r[10],ce=r[14],L=r[3],k=r[7],K=r[11],X=r[15];return s[0]=o*P+a*y+l*$+c*L,s[4]=o*T+a*C+l*se+c*k,s[8]=o*N+a*q+l*Z+c*K,s[12]=o*v+a*O+l*ce+c*X,s[1]=u*P+d*y+h*$+p*L,s[5]=u*T+d*C+h*se+p*k,s[9]=u*N+d*q+h*Z+p*K,s[13]=u*v+d*O+h*ce+p*X,s[2]=g*P+b*y+m*$+f*L,s[6]=g*T+b*C+m*se+f*k,s[10]=g*N+b*q+m*Z+f*K,s[14]=g*v+b*O+m*ce+f*X,s[3]=M*P+x*y+_*$+D*L,s[7]=M*T+x*C+_*se+D*k,s[11]=M*N+x*q+_*Z+D*K,s[15]=M*v+x*O+_*ce+D*X,this}multiplyScalar(e){const t=this.elements;return t[0]*=e,t[4]*=e,t[8]*=e,t[12]*=e,t[1]*=e,t[5]*=e,t[9]*=e,t[13]*=e,t[2]*=e,t[6]*=e,t[10]*=e,t[14]*=e,t[3]*=e,t[7]*=e,t[11]*=e,t[15]*=e,this}determinant(){const e=this.elements,t=e[0],n=e[4],r=e[8],s=e[12],o=e[1],a=e[5],l=e[9],c=e[13],u=e[2],d=e[6],h=e[10],p=e[14],g=e[3],b=e[7],m=e[11],f=e[15];return g*(+s*l*d-r*c*d-s*a*h+n*c*h+r*a*p-n*l*p)+b*(+t*l*p-t*c*h+s*o*h-r*o*p+r*c*u-s*l*u)+m*(+t*c*d-t*a*p-s*o*d+n*o*p+s*a*u-n*c*u)+f*(-r*a*u-t*l*d+t*a*h+r*o*d-n*o*h+n*l*u)}transpose(){const e=this.elements;let t;return t=e[1],e[1]=e[4],e[4]=t,t=e[2],e[2]=e[8],e[8]=t,t=e[6],e[6]=e[9],e[9]=t,t=e[3],e[3]=e[12],e[12]=t,t=e[7],e[7]=e[13],e[13]=t,t=e[11],e[11]=e[14],e[14]=t,this}setPosition(e,t,n){const r=this.elements;return e.isVector3?(r[12]=e.x,r[13]=e.y,r[14]=e.z):(r[12]=e,r[13]=t,r[14]=n),this}invert(){const e=this.elements,t=e[0],n=e[1],r=e[2],s=e[3],o=e[4],a=e[5],l=e[6],c=e[7],u=e[8],d=e[9],h=e[10],p=e[11],g=e[12],b=e[13],m=e[14],f=e[15],M=d*m*c-b*h*c+b*l*p-a*m*p-d*l*f+a*h*f,x=g*h*c-u*m*c-g*l*p+o*m*p+u*l*f-o*h*f,_=u*b*c-g*d*c+g*a*p-o*b*p-u*a*f+o*d*f,D=g*d*l-u*b*l-g*a*h+o*b*h+u*a*m-o*d*m,P=t*M+n*x+r*_+s*D;if(P===0)return this.set(0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0);const T=1/P;return e[0]=M*T,e[1]=(b*h*s-d*m*s-b*r*p+n*m*p+d*r*f-n*h*f)*T,e[2]=(a*m*s-b*l*s+b*r*c-n*m*c-a*r*f+n*l*f)*T,e[3]=(d*l*s-a*h*s-d*r*c+n*h*c+a*r*p-n*l*p)*T,e[4]=x*T,e[5]=(u*m*s-g*h*s+g*r*p-t*m*p-u*r*f+t*h*f)*T,e[6]=(g*l*s-o*m*s-g*r*c+t*m*c+o*r*f-t*l*f)*T,e[7]=(o*h*s-u*l*s+u*r*c-t*h*c-o*r*p+t*l*p)*T,e[8]=_*T,e[9]=(g*d*s-u*b*s-g*n*p+t*b*p+u*n*f-t*d*f)*T,e[10]=(o*b*s-g*a*s+g*n*c-t*b*c-o*n*f+t*a*f)*T,e[11]=(u*a*s-o*d*s-u*n*c+t*d*c+o*n*p-t*a*p)*T,e[12]=D*T,e[13]=(u*b*r-g*d*r+g*n*h-t*b*h-u*n*m+t*d*m)*T,e[14]=(g*a*r-o*b*r-g*n*l+t*b*l+o*n*m-t*a*m)*T,e[15]=(o*d*r-u*a*r+u*n*l-t*d*l-o*n*h+t*a*h)*T,this}scale(e){const t=this.elements,n=e.x,r=e.y,s=e.z;return t[0]*=n,t[4]*=r,t[8]*=s,t[1]*=n,t[5]*=r,t[9]*=s,t[2]*=n,t[6]*=r,t[10]*=s,t[3]*=n,t[7]*=r,t[11]*=s,this}getMaxScaleOnAxis(){const e=this.elements,t=e[0]*e[0]+e[1]*e[1]+e[2]*e[2],n=e[4]*e[4]+e[5]*e[5]+e[6]*e[6],r=e[8]*e[8]+e[9]*e[9]+e[10]*e[10];return Math.sqrt(Math.max(t,n,r))}makeTranslation(e,t,n){return e.isVector3?this.set(1,0,0,e.x,0,1,0,e.y,0,0,1,e.z,0,0,0,1):this.set(1,0,0,e,0,1,0,t,0,0,1,n,0,0,0,1),this}makeRotationX(e){const t=Math.cos(e),n=Math.sin(e);return this.set(1,0,0,0,0,t,-n,0,0,n,t,0,0,0,0,1),this}makeRotationY(e){const t=Math.cos(e),n=Math.sin(e);return this.set(t,0,n,0,0,1,0,0,-n,0,t,0,0,0,0,1),this}makeRotationZ(e){const t=Math.cos(e),n=Math.sin(e);return this.set(t,-n,0,0,n,t,0,0,0,0,1,0,0,0,0,1),this}makeRotationAxis(e,t){const n=Math.cos(t),r=Math.sin(t),s=1-n,o=e.x,a=e.y,l=e.z,c=s*o,u=s*a;return this.set(c*o+n,c*a-r*l,c*l+r*a,0,c*a+r*l,u*a+n,u*l-r*o,0,c*l-r*a,u*l+r*o,s*l*l+n,0,0,0,0,1),this}makeScale(e,t,n){return this.set(e,0,0,0,0,t,0,0,0,0,n,0,0,0,0,1),this}makeShear(e,t,n,r,s,o){return this.set(1,n,s,0,e,1,o,0,t,r,1,0,0,0,0,1),this}compose(e,t,n){const r=this.elements,s=t._x,o=t._y,a=t._z,l=t._w,c=s+s,u=o+o,d=a+a,h=s*c,p=s*u,g=s*d,b=o*u,m=o*d,f=a*d,M=l*c,x=l*u,_=l*d,D=n.x,P=n.y,T=n.z;return r[0]=(1-(b+f))*D,r[1]=(p+_)*D,r[2]=(g-x)*D,r[3]=0,r[4]=(p-_)*P,r[5]=(1-(h+f))*P,r[6]=(m+M)*P,r[7]=0,r[8]=(g+x)*T,r[9]=(m-M)*T,r[10]=(1-(h+b))*T,r[11]=0,r[12]=e.x,r[13]=e.y,r[14]=e.z,r[15]=1,this}decompose(e,t,n){const r=this.elements;let s=Gr.set(r[0],r[1],r[2]).length();const o=Gr.set(r[4],r[5],r[6]).length(),a=Gr.set(r[8],r[9],r[10]).length();this.determinant()<0&&(s=-s),e.x=r[12],e.y=r[13],e.z=r[14],ri.copy(this);const c=1/s,u=1/o,d=1/a;return ri.elements[0]*=c,ri.elements[1]*=c,ri.elements[2]*=c,ri.elements[4]*=u,ri.elements[5]*=u,ri.elements[6]*=u,ri.elements[8]*=d,ri.elements[9]*=d,ri.elements[10]*=d,t.setFromRotationMatrix(ri),n.x=s,n.y=o,n.z=a,this}makePerspective(e,t,n,r,s,o,a=Hi){const l=this.elements,c=2*s/(t-e),u=2*s/(n-r),d=(t+e)/(t-e),h=(n+r)/(n-r);let p,g;if(a===Hi)p=-(o+s)/(o-s),g=-2*o*s/(o-s);else if(a===ga)p=-o/(o-s),g=-o*s/(o-s);else throw new Error("THREE.Matrix4.makePerspective(): Invalid coordinate system: "+a);return l[0]=c,l[4]=0,l[8]=d,l[12]=0,l[1]=0,l[5]=u,l[9]=h,l[13]=0,l[2]=0,l[6]=0,l[10]=p,l[14]=g,l[3]=0,l[7]=0,l[11]=-1,l[15]=0,this}makeOrthographic(e,t,n,r,s,o,a=Hi){const l=this.elements,c=1/(t-e),u=1/(n-r),d=1/(o-s),h=(t+e)*c,p=(n+r)*u;let g,b;if(a===Hi)g=(o+s)*d,b=-2*d;else if(a===ga)g=s*d,b=-1*d;else throw new Error("THREE.Matrix4.makeOrthographic(): Invalid coordinate system: "+a);return l[0]=2*c,l[4]=0,l[8]=0,l[12]=-h,l[1]=0,l[5]=2*u,l[9]=0,l[13]=-p,l[2]=0,l[6]=0,l[10]=b,l[14]=-g,l[3]=0,l[7]=0,l[11]=0,l[15]=1,this}equals(e){const t=this.elements,n=e.elements;for(let r=0;r<16;r++)if(t[r]!==n[r])return!1;return!0}fromArray(e,t=0){for(let n=0;n<16;n++)this.elements[n]=e[n+t];return this}toArray(e=[],t=0){const n=this.elements;return e[t]=n[0],e[t+1]=n[1],e[t+2]=n[2],e[t+3]=n[3],e[t+4]=n[4],e[t+5]=n[5],e[t+6]=n[6],e[t+7]=n[7],e[t+8]=n[8],e[t+9]=n[9],e[t+10]=n[10],e[t+11]=n[11],e[t+12]=n[12],e[t+13]=n[13],e[t+14]=n[14],e[t+15]=n[15],e}}const Gr=new A,ri=new ot,Vp=new A(0,0,0),Wp=new A(1,1,1),Ji=new A,So=new A,Vn=new A,Pu=new ot,Lu=new qe;class Mi{constructor(e=0,t=0,n=0,r=Mi.DEFAULT_ORDER){this.isEuler=!0,this._x=e,this._y=t,this._z=n,this._order=r}get x(){return this._x}set x(e){this._x=e,this._onChangeCallback()}get y(){return this._y}set y(e){this._y=e,this._onChangeCallback()}get z(){return this._z}set z(e){this._z=e,this._onChangeCallback()}get order(){return this._order}set order(e){this._order=e,this._onChangeCallback()}set(e,t,n,r=this._order){return this._x=e,this._y=t,this._z=n,this._order=r,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._order)}copy(e){return this._x=e._x,this._y=e._y,this._z=e._z,this._order=e._order,this._onChangeCallback(),this}setFromRotationMatrix(e,t=this._order,n=!0){const r=e.elements,s=r[0],o=r[4],a=r[8],l=r[1],c=r[5],u=r[9],d=r[2],h=r[6],p=r[10];switch(t){case"XYZ":this._y=Math.asin(xn(a,-1,1)),Math.abs(a)<.9999999?(this._x=Math.atan2(-u,p),this._z=Math.atan2(-o,s)):(this._x=Math.atan2(h,c),this._z=0);break;case"YXZ":this._x=Math.asin(-xn(u,-1,1)),Math.abs(u)<.9999999?(this._y=Math.atan2(a,p),this._z=Math.atan2(l,c)):(this._y=Math.atan2(-d,s),this._z=0);break;case"ZXY":this._x=Math.asin(xn(h,-1,1)),Math.abs(h)<.9999999?(this._y=Math.atan2(-d,p),this._z=Math.atan2(-o,c)):(this._y=0,this._z=Math.atan2(l,s));break;case"ZYX":this._y=Math.asin(-xn(d,-1,1)),Math.abs(d)<.9999999?(this._x=Math.atan2(h,p),this._z=Math.atan2(l,s)):(this._x=0,this._z=Math.atan2(-o,c));break;case"YZX":this._z=Math.asin(xn(l,-1,1)),Math.abs(l)<.9999999?(this._x=Math.atan2(-u,c),this._y=Math.atan2(-d,s)):(this._x=0,this._y=Math.atan2(a,p));break;case"XZY":this._z=Math.asin(-xn(o,-1,1)),Math.abs(o)<.9999999?(this._x=Math.atan2(h,c),this._y=Math.atan2(a,s)):(this._x=Math.atan2(-u,p),this._y=0);break;default:console.warn("THREE.Euler: .setFromRotationMatrix() encountered an unknown order: "+t)}return this._order=t,n===!0&&this._onChangeCallback(),this}setFromQuaternion(e,t,n){return Pu.makeRotationFromQuaternion(e),this.setFromRotationMatrix(Pu,t,n)}setFromVector3(e,t=this._order){return this.set(e.x,e.y,e.z,t)}reorder(e){return Lu.setFromEuler(this),this.setFromQuaternion(Lu,e)}equals(e){return e._x===this._x&&e._y===this._y&&e._z===this._z&&e._order===this._order}fromArray(e){return this._x=e[0],this._y=e[1],this._z=e[2],e[3]!==void 0&&(this._order=e[3]),this._onChangeCallback(),this}toArray(e=[],t=0){return e[t]=this._x,e[t+1]=this._y,e[t+2]=this._z,e[t+3]=this._order,e}_onChange(e){return this._onChangeCallback=e,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._order}}Mi.DEFAULT_ORDER="XYZ";class jl{constructor(){this.mask=1}set(e){this.mask=(1<<e|0)>>>0}enable(e){this.mask|=1<<e|0}enableAll(){this.mask=-1}toggle(e){this.mask^=1<<e|0}disable(e){this.mask&=~(1<<e|0)}disableAll(){this.mask=0}test(e){return(this.mask&e.mask)!==0}isEnabled(e){return(this.mask&(1<<e|0))!==0}}let qp=0;const Du=new A,Vr=new qe,Di=new ot,wo=new A,zs=new A,jp=new A,Xp=new qe,Iu=new A(1,0,0),Fu=new A(0,1,0),Nu=new A(0,0,1),Uu={type:"added"},Qp={type:"removed"},Wr={type:"childadded",child:null},Ya={type:"childremoved",child:null};class en extends Nr{constructor(){super(),this.isObject3D=!0,Object.defineProperty(this,"id",{value:qp++}),this.uuid=di(),this.name="",this.type="Object3D",this.parent=null,this.children=[],this.up=en.DEFAULT_UP.clone();const e=new A,t=new Mi,n=new qe,r=new A(1,1,1);function s(){n.setFromEuler(t,!1)}function o(){t.setFromQuaternion(n,void 0,!1)}t._onChange(s),n._onChange(o),Object.defineProperties(this,{position:{configurable:!0,enumerable:!0,value:e},rotation:{configurable:!0,enumerable:!0,value:t},quaternion:{configurable:!0,enumerable:!0,value:n},scale:{configurable:!0,enumerable:!0,value:r},modelViewMatrix:{value:new ot},normalMatrix:{value:new Mt}}),this.matrix=new ot,this.matrixWorld=new ot,this.matrixAutoUpdate=en.DEFAULT_MATRIX_AUTO_UPDATE,this.matrixWorldAutoUpdate=en.DEFAULT_MATRIX_WORLD_AUTO_UPDATE,this.matrixWorldNeedsUpdate=!1,this.layers=new jl,this.visible=!0,this.castShadow=!1,this.receiveShadow=!1,this.frustumCulled=!0,this.renderOrder=0,this.animations=[],this.userData={}}onBeforeShadow(){}onAfterShadow(){}onBeforeRender(){}onAfterRender(){}applyMatrix4(e){this.matrixAutoUpdate&&this.updateMatrix(),this.matrix.premultiply(e),this.matrix.decompose(this.position,this.quaternion,this.scale)}applyQuaternion(e){return this.quaternion.premultiply(e),this}setRotationFromAxisAngle(e,t){this.quaternion.setFromAxisAngle(e,t)}setRotationFromEuler(e){this.quaternion.setFromEuler(e,!0)}setRotationFromMatrix(e){this.quaternion.setFromRotationMatrix(e)}setRotationFromQuaternion(e){this.quaternion.copy(e)}rotateOnAxis(e,t){return Vr.setFromAxisAngle(e,t),this.quaternion.multiply(Vr),this}rotateOnWorldAxis(e,t){return Vr.setFromAxisAngle(e,t),this.quaternion.premultiply(Vr),this}rotateX(e){return this.rotateOnAxis(Iu,e)}rotateY(e){return this.rotateOnAxis(Fu,e)}rotateZ(e){return this.rotateOnAxis(Nu,e)}translateOnAxis(e,t){return Du.copy(e).applyQuaternion(this.quaternion),this.position.add(Du.multiplyScalar(t)),this}translateX(e){return this.translateOnAxis(Iu,e)}translateY(e){return this.translateOnAxis(Fu,e)}translateZ(e){return this.translateOnAxis(Nu,e)}localToWorld(e){return this.updateWorldMatrix(!0,!1),e.applyMatrix4(this.matrixWorld)}worldToLocal(e){return this.updateWorldMatrix(!0,!1),e.applyMatrix4(Di.copy(this.matrixWorld).invert())}lookAt(e,t,n){e.isVector3?wo.copy(e):wo.set(e,t,n);const r=this.parent;this.updateWorldMatrix(!0,!1),zs.setFromMatrixPosition(this.matrixWorld),this.isCamera||this.isLight?Di.lookAt(zs,wo,this.up):Di.lookAt(wo,zs,this.up),this.quaternion.setFromRotationMatrix(Di),r&&(Di.extractRotation(r.matrixWorld),Vr.setFromRotationMatrix(Di),this.quaternion.premultiply(Vr.invert()))}add(e){if(arguments.length>1){for(let t=0;t<arguments.length;t++)this.add(arguments[t]);return this}return e===this?(console.error("THREE.Object3D.add: object can't be added as a child of itself.",e),this):(e&&e.isObject3D?(e.removeFromParent(),e.parent=this,this.children.push(e),e.dispatchEvent(Uu),Wr.child=e,this.dispatchEvent(Wr),Wr.child=null):console.error("THREE.Object3D.add: object not an instance of THREE.Object3D.",e),this)}remove(e){if(arguments.length>1){for(let n=0;n<arguments.length;n++)this.remove(arguments[n]);return this}const t=this.children.indexOf(e);return t!==-1&&(e.parent=null,this.children.splice(t,1),e.dispatchEvent(Qp),Ya.child=e,this.dispatchEvent(Ya),Ya.child=null),this}removeFromParent(){const e=this.parent;return e!==null&&e.remove(this),this}clear(){return this.remove(...this.children)}attach(e){return this.updateWorldMatrix(!0,!1),Di.copy(this.matrixWorld).invert(),e.parent!==null&&(e.parent.updateWorldMatrix(!0,!1),Di.multiply(e.parent.matrixWorld)),e.applyMatrix4(Di),e.removeFromParent(),e.parent=this,this.children.push(e),e.updateWorldMatrix(!1,!0),e.dispatchEvent(Uu),Wr.child=e,this.dispatchEvent(Wr),Wr.child=null,this}getObjectById(e){return this.getObjectByProperty("id",e)}getObjectByName(e){return this.getObjectByProperty("name",e)}getObjectByProperty(e,t){if(this[e]===t)return this;for(let n=0,r=this.children.length;n<r;n++){const o=this.children[n].getObjectByProperty(e,t);if(o!==void 0)return o}}getObjectsByProperty(e,t,n=[]){this[e]===t&&n.push(this);const r=this.children;for(let s=0,o=r.length;s<o;s++)r[s].getObjectsByProperty(e,t,n);return n}getWorldPosition(e){return this.updateWorldMatrix(!0,!1),e.setFromMatrixPosition(this.matrixWorld)}getWorldQuaternion(e){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(zs,e,jp),e}getWorldScale(e){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(zs,Xp,e),e}getWorldDirection(e){this.updateWorldMatrix(!0,!1);const t=this.matrixWorld.elements;return e.set(t[8],t[9],t[10]).normalize()}raycast(){}traverse(e){e(this);const t=this.children;for(let n=0,r=t.length;n<r;n++)t[n].traverse(e)}traverseVisible(e){if(this.visible===!1)return;e(this);const t=this.children;for(let n=0,r=t.length;n<r;n++)t[n].traverseVisible(e)}traverseAncestors(e){const t=this.parent;t!==null&&(e(t),t.traverseAncestors(e))}updateMatrix(){this.matrix.compose(this.position,this.quaternion,this.scale),this.matrixWorldNeedsUpdate=!0}updateMatrixWorld(e){this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||e)&&(this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),this.matrixWorldNeedsUpdate=!1,e=!0);const t=this.children;for(let n=0,r=t.length;n<r;n++)t[n].updateMatrixWorld(e)}updateWorldMatrix(e,t){const n=this.parent;if(e===!0&&n!==null&&n.updateWorldMatrix(!0,!1),this.matrixAutoUpdate&&this.updateMatrix(),this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),t===!0){const r=this.children;for(let s=0,o=r.length;s<o;s++)r[s].updateWorldMatrix(!1,!0)}}toJSON(e){const t=e===void 0||typeof e=="string",n={};t&&(e={geometries:{},materials:{},textures:{},images:{},shapes:{},skeletons:{},animations:{},nodes:{}},n.metadata={version:4.6,type:"Object",generator:"Object3D.toJSON"});const r={};r.uuid=this.uuid,r.type=this.type,this.name!==""&&(r.name=this.name),this.castShadow===!0&&(r.castShadow=!0),this.receiveShadow===!0&&(r.receiveShadow=!0),this.visible===!1&&(r.visible=!1),this.frustumCulled===!1&&(r.frustumCulled=!1),this.renderOrder!==0&&(r.renderOrder=this.renderOrder),Object.keys(this.userData).length>0&&(r.userData=this.userData),r.layers=this.layers.mask,r.matrix=this.matrix.toArray(),r.up=this.up.toArray(),this.matrixAutoUpdate===!1&&(r.matrixAutoUpdate=!1),this.isInstancedMesh&&(r.type="InstancedMesh",r.count=this.count,r.instanceMatrix=this.instanceMatrix.toJSON(),this.instanceColor!==null&&(r.instanceColor=this.instanceColor.toJSON())),this.isBatchedMesh&&(r.type="BatchedMesh",r.perObjectFrustumCulled=this.perObjectFrustumCulled,r.sortObjects=this.sortObjects,r.drawRanges=this._drawRanges,r.reservedRanges=this._reservedRanges,r.visibility=this._visibility,r.active=this._active,r.bounds=this._bounds.map(a=>({boxInitialized:a.boxInitialized,boxMin:a.box.min.toArray(),boxMax:a.box.max.toArray(),sphereInitialized:a.sphereInitialized,sphereRadius:a.sphere.radius,sphereCenter:a.sphere.center.toArray()})),r.maxInstanceCount=this._maxInstanceCount,r.maxVertexCount=this._maxVertexCount,r.maxIndexCount=this._maxIndexCount,r.geometryInitialized=this._geometryInitialized,r.geometryCount=this._geometryCount,r.matricesTexture=this._matricesTexture.toJSON(e),this._colorsTexture!==null&&(r.colorsTexture=this._colorsTexture.toJSON(e)),this.boundingSphere!==null&&(r.boundingSphere={center:r.boundingSphere.center.toArray(),radius:r.boundingSphere.radius}),this.boundingBox!==null&&(r.boundingBox={min:r.boundingBox.min.toArray(),max:r.boundingBox.max.toArray()}));function s(a,l){return a[l.uuid]===void 0&&(a[l.uuid]=l.toJSON(e)),l.uuid}if(this.isScene)this.background&&(this.background.isColor?r.background=this.background.toJSON():this.background.isTexture&&(r.background=this.background.toJSON(e).uuid)),this.environment&&this.environment.isTexture&&this.environment.isRenderTargetTexture!==!0&&(r.environment=this.environment.toJSON(e).uuid);else if(this.isMesh||this.isLine||this.isPoints){r.geometry=s(e.geometries,this.geometry);const a=this.geometry.parameters;if(a!==void 0&&a.shapes!==void 0){const l=a.shapes;if(Array.isArray(l))for(let c=0,u=l.length;c<u;c++){const d=l[c];s(e.shapes,d)}else s(e.shapes,l)}}if(this.isSkinnedMesh&&(r.bindMode=this.bindMode,r.bindMatrix=this.bindMatrix.toArray(),this.skeleton!==void 0&&(s(e.skeletons,this.skeleton),r.skeleton=this.skeleton.uuid)),this.material!==void 0)if(Array.isArray(this.material)){const a=[];for(let l=0,c=this.material.length;l<c;l++)a.push(s(e.materials,this.material[l]));r.material=a}else r.material=s(e.materials,this.material);if(this.children.length>0){r.children=[];for(let a=0;a<this.children.length;a++)r.children.push(this.children[a].toJSON(e).object)}if(this.animations.length>0){r.animations=[];for(let a=0;a<this.animations.length;a++){const l=this.animations[a];r.animations.push(s(e.animations,l))}}if(t){const a=o(e.geometries),l=o(e.materials),c=o(e.textures),u=o(e.images),d=o(e.shapes),h=o(e.skeletons),p=o(e.animations),g=o(e.nodes);a.length>0&&(n.geometries=a),l.length>0&&(n.materials=l),c.length>0&&(n.textures=c),u.length>0&&(n.images=u),d.length>0&&(n.shapes=d),h.length>0&&(n.skeletons=h),p.length>0&&(n.animations=p),g.length>0&&(n.nodes=g)}return n.object=r,n;function o(a){const l=[];for(const c in a){const u=a[c];delete u.metadata,l.push(u)}return l}}clone(e){return new this.constructor().copy(this,e)}copy(e,t=!0){if(this.name=e.name,this.up.copy(e.up),this.position.copy(e.position),this.rotation.order=e.rotation.order,this.quaternion.copy(e.quaternion),this.scale.copy(e.scale),this.matrix.copy(e.matrix),this.matrixWorld.copy(e.matrixWorld),this.matrixAutoUpdate=e.matrixAutoUpdate,this.matrixWorldAutoUpdate=e.matrixWorldAutoUpdate,this.matrixWorldNeedsUpdate=e.matrixWorldNeedsUpdate,this.layers.mask=e.layers.mask,this.visible=e.visible,this.castShadow=e.castShadow,this.receiveShadow=e.receiveShadow,this.frustumCulled=e.frustumCulled,this.renderOrder=e.renderOrder,this.animations=e.animations.slice(),this.userData=JSON.parse(JSON.stringify(e.userData)),t===!0)for(let n=0;n<e.children.length;n++){const r=e.children[n];this.add(r.clone())}return this}}en.DEFAULT_UP=new A(0,1,0);en.DEFAULT_MATRIX_AUTO_UPDATE=!0;en.DEFAULT_MATRIX_WORLD_AUTO_UPDATE=!0;const si=new A,Ii=new A,$a=new A,Fi=new A,qr=new A,jr=new A,Ou=new A,Za=new A,Ja=new A,ec=new A,tc=new mt,nc=new mt,ic=new mt;class Jn{constructor(e=new A,t=new A,n=new A){this.a=e,this.b=t,this.c=n}static getNormal(e,t,n,r){r.subVectors(n,t),si.subVectors(e,t),r.cross(si);const s=r.lengthSq();return s>0?r.multiplyScalar(1/Math.sqrt(s)):r.set(0,0,0)}static getBarycoord(e,t,n,r,s){si.subVectors(r,t),Ii.subVectors(n,t),$a.subVectors(e,t);const o=si.dot(si),a=si.dot(Ii),l=si.dot($a),c=Ii.dot(Ii),u=Ii.dot($a),d=o*c-a*a;if(d===0)return s.set(0,0,0),null;const h=1/d,p=(c*l-a*u)*h,g=(o*u-a*l)*h;return s.set(1-p-g,g,p)}static containsPoint(e,t,n,r){return this.getBarycoord(e,t,n,r,Fi)===null?!1:Fi.x>=0&&Fi.y>=0&&Fi.x+Fi.y<=1}static getInterpolation(e,t,n,r,s,o,a,l){return this.getBarycoord(e,t,n,r,Fi)===null?(l.x=0,l.y=0,"z"in l&&(l.z=0),"w"in l&&(l.w=0),null):(l.setScalar(0),l.addScaledVector(s,Fi.x),l.addScaledVector(o,Fi.y),l.addScaledVector(a,Fi.z),l)}static getInterpolatedAttribute(e,t,n,r,s,o){return tc.setScalar(0),nc.setScalar(0),ic.setScalar(0),tc.fromBufferAttribute(e,t),nc.fromBufferAttribute(e,n),ic.fromBufferAttribute(e,r),o.setScalar(0),o.addScaledVector(tc,s.x),o.addScaledVector(nc,s.y),o.addScaledVector(ic,s.z),o}static isFrontFacing(e,t,n,r){return si.subVectors(n,t),Ii.subVectors(e,t),si.cross(Ii).dot(r)<0}set(e,t,n){return this.a.copy(e),this.b.copy(t),this.c.copy(n),this}setFromPointsAndIndices(e,t,n,r){return this.a.copy(e[t]),this.b.copy(e[n]),this.c.copy(e[r]),this}setFromAttributeAndIndices(e,t,n,r){return this.a.fromBufferAttribute(e,t),this.b.fromBufferAttribute(e,n),this.c.fromBufferAttribute(e,r),this}clone(){return new this.constructor().copy(this)}copy(e){return this.a.copy(e.a),this.b.copy(e.b),this.c.copy(e.c),this}getArea(){return si.subVectors(this.c,this.b),Ii.subVectors(this.a,this.b),si.cross(Ii).length()*.5}getMidpoint(e){return e.addVectors(this.a,this.b).add(this.c).multiplyScalar(1/3)}getNormal(e){return Jn.getNormal(this.a,this.b,this.c,e)}getPlane(e){return e.setFromCoplanarPoints(this.a,this.b,this.c)}getBarycoord(e,t){return Jn.getBarycoord(e,this.a,this.b,this.c,t)}getInterpolation(e,t,n,r,s){return Jn.getInterpolation(e,this.a,this.b,this.c,t,n,r,s)}containsPoint(e){return Jn.containsPoint(e,this.a,this.b,this.c)}isFrontFacing(e){return Jn.isFrontFacing(this.a,this.b,this.c,e)}intersectsBox(e){return e.intersectsTriangle(this)}closestPointToPoint(e,t){const n=this.a,r=this.b,s=this.c;let o,a;qr.subVectors(r,n),jr.subVectors(s,n),Za.subVectors(e,n);const l=qr.dot(Za),c=jr.dot(Za);if(l<=0&&c<=0)return t.copy(n);Ja.subVectors(e,r);const u=qr.dot(Ja),d=jr.dot(Ja);if(u>=0&&d<=u)return t.copy(r);const h=l*d-u*c;if(h<=0&&l>=0&&u<=0)return o=l/(l-u),t.copy(n).addScaledVector(qr,o);ec.subVectors(e,s);const p=qr.dot(ec),g=jr.dot(ec);if(g>=0&&p<=g)return t.copy(s);const b=p*c-l*g;if(b<=0&&c>=0&&g<=0)return a=c/(c-g),t.copy(n).addScaledVector(jr,a);const m=u*g-p*d;if(m<=0&&d-u>=0&&p-g>=0)return Ou.subVectors(s,r),a=(d-u)/(d-u+(p-g)),t.copy(r).addScaledVector(Ou,a);const f=1/(m+b+h);return o=b*f,a=h*f,t.copy(n).addScaledVector(qr,o).addScaledVector(jr,a)}equals(e){return e.a.equals(this.a)&&e.b.equals(this.b)&&e.c.equals(this.c)}}const Ah={aliceblue:15792383,antiquewhite:16444375,aqua:65535,aquamarine:8388564,azure:15794175,beige:16119260,bisque:16770244,black:0,blanchedalmond:16772045,blue:255,blueviolet:9055202,brown:10824234,burlywood:14596231,cadetblue:6266528,chartreuse:8388352,chocolate:13789470,coral:16744272,cornflowerblue:6591981,cornsilk:16775388,crimson:14423100,cyan:65535,darkblue:139,darkcyan:35723,darkgoldenrod:12092939,darkgray:11119017,darkgreen:25600,darkgrey:11119017,darkkhaki:12433259,darkmagenta:9109643,darkolivegreen:5597999,darkorange:16747520,darkorchid:10040012,darkred:9109504,darksalmon:15308410,darkseagreen:9419919,darkslateblue:4734347,darkslategray:3100495,darkslategrey:3100495,darkturquoise:52945,darkviolet:9699539,deeppink:16716947,deepskyblue:49151,dimgray:6908265,dimgrey:6908265,dodgerblue:2003199,firebrick:11674146,floralwhite:16775920,forestgreen:2263842,fuchsia:16711935,gainsboro:14474460,ghostwhite:16316671,gold:16766720,goldenrod:14329120,gray:8421504,green:32768,greenyellow:11403055,grey:8421504,honeydew:15794160,hotpink:16738740,indianred:13458524,indigo:4915330,ivory:16777200,khaki:15787660,lavender:15132410,lavenderblush:16773365,lawngreen:8190976,lemonchiffon:16775885,lightblue:11393254,lightcoral:15761536,lightcyan:14745599,lightgoldenrodyellow:16448210,lightgray:13882323,lightgreen:9498256,lightgrey:13882323,lightpink:16758465,lightsalmon:16752762,lightseagreen:2142890,lightskyblue:8900346,lightslategray:7833753,lightslategrey:7833753,lightsteelblue:11584734,lightyellow:16777184,lime:65280,limegreen:3329330,linen:16445670,magenta:16711935,maroon:8388608,mediumaquamarine:6737322,mediumblue:205,mediumorchid:12211667,mediumpurple:9662683,mediumseagreen:3978097,mediumslateblue:8087790,mediumspringgreen:64154,mediumturquoise:4772300,mediumvioletred:13047173,midnightblue:1644912,mintcream:16121850,mistyrose:16770273,moccasin:16770229,navajowhite:16768685,navy:128,oldlace:16643558,olive:8421376,olivedrab:7048739,orange:16753920,orangered:16729344,orchid:14315734,palegoldenrod:15657130,palegreen:10025880,paleturquoise:11529966,palevioletred:14381203,papayawhip:16773077,peachpuff:16767673,peru:13468991,pink:16761035,plum:14524637,powderblue:11591910,purple:8388736,rebeccapurple:6697881,red:16711680,rosybrown:12357519,royalblue:4286945,saddlebrown:9127187,salmon:16416882,sandybrown:16032864,seagreen:3050327,seashell:16774638,sienna:10506797,silver:12632256,skyblue:8900331,slateblue:6970061,slategray:7372944,slategrey:7372944,snow:16775930,springgreen:65407,steelblue:4620980,tan:13808780,teal:32896,thistle:14204888,tomato:16737095,turquoise:4251856,violet:15631086,wheat:16113331,white:16777215,whitesmoke:16119285,yellow:16776960,yellowgreen:10145074},er={h:0,s:0,l:0},Eo={h:0,s:0,l:0};function rc(i,e,t){return t<0&&(t+=1),t>1&&(t-=1),t<1/6?i+(e-i)*6*t:t<1/2?e:t<2/3?i+(e-i)*6*(2/3-t):i}class rt{constructor(e,t,n){return this.isColor=!0,this.r=1,this.g=1,this.b=1,this.set(e,t,n)}set(e,t,n){if(t===void 0&&n===void 0){const r=e;r&&r.isColor?this.copy(r):typeof r=="number"?this.setHex(r):typeof r=="string"&&this.setStyle(r)}else this.setRGB(e,t,n);return this}setScalar(e){return this.r=e,this.g=e,this.b=e,this}setHex(e,t=ln){return e=Math.floor(e),this.r=(e>>16&255)/255,this.g=(e>>8&255)/255,this.b=(e&255)/255,Pt.toWorkingColorSpace(this,t),this}setRGB(e,t,n,r=Pt.workingColorSpace){return this.r=e,this.g=t,this.b=n,Pt.toWorkingColorSpace(this,r),this}setHSL(e,t,n,r=Pt.workingColorSpace){if(e=ql(e,1),t=xn(t,0,1),n=xn(n,0,1),t===0)this.r=this.g=this.b=n;else{const s=n<=.5?n*(1+t):n+t-n*t,o=2*n-s;this.r=rc(o,s,e+1/3),this.g=rc(o,s,e),this.b=rc(o,s,e-1/3)}return Pt.toWorkingColorSpace(this,r),this}setStyle(e,t=ln){function n(s){s!==void 0&&parseFloat(s)<1&&console.warn("THREE.Color: Alpha component of "+e+" will be ignored.")}let r;if(r=/^(\w+)\(([^\)]*)\)/.exec(e)){let s;const o=r[1],a=r[2];switch(o){case"rgb":case"rgba":if(s=/^\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(a))return n(s[4]),this.setRGB(Math.min(255,parseInt(s[1],10))/255,Math.min(255,parseInt(s[2],10))/255,Math.min(255,parseInt(s[3],10))/255,t);if(s=/^\s*(\d+)\%\s*,\s*(\d+)\%\s*,\s*(\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(a))return n(s[4]),this.setRGB(Math.min(100,parseInt(s[1],10))/100,Math.min(100,parseInt(s[2],10))/100,Math.min(100,parseInt(s[3],10))/100,t);break;case"hsl":case"hsla":if(s=/^\s*(\d*\.?\d+)\s*,\s*(\d*\.?\d+)\%\s*,\s*(\d*\.?\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(a))return n(s[4]),this.setHSL(parseFloat(s[1])/360,parseFloat(s[2])/100,parseFloat(s[3])/100,t);break;default:console.warn("THREE.Color: Unknown color model "+e)}}else if(r=/^\#([A-Fa-f\d]+)$/.exec(e)){const s=r[1],o=s.length;if(o===3)return this.setRGB(parseInt(s.charAt(0),16)/15,parseInt(s.charAt(1),16)/15,parseInt(s.charAt(2),16)/15,t);if(o===6)return this.setHex(parseInt(s,16),t);console.warn("THREE.Color: Invalid hex color "+e)}else if(e&&e.length>0)return this.setColorName(e,t);return this}setColorName(e,t=ln){const n=Ah[e.toLowerCase()];return n!==void 0?this.setHex(n,t):console.warn("THREE.Color: Unknown color "+e),this}clone(){return new this.constructor(this.r,this.g,this.b)}copy(e){return this.r=e.r,this.g=e.g,this.b=e.b,this}copySRGBToLinear(e){return this.r=Vi(e.r),this.g=Vi(e.g),this.b=Vi(e.b),this}copyLinearToSRGB(e){return this.r=ls(e.r),this.g=ls(e.g),this.b=ls(e.b),this}convertSRGBToLinear(){return this.copySRGBToLinear(this),this}convertLinearToSRGB(){return this.copyLinearToSRGB(this),this}getHex(e=ln){return Pt.fromWorkingColorSpace(wn.copy(this),e),Math.round(xn(wn.r*255,0,255))*65536+Math.round(xn(wn.g*255,0,255))*256+Math.round(xn(wn.b*255,0,255))}getHexString(e=ln){return("000000"+this.getHex(e).toString(16)).slice(-6)}getHSL(e,t=Pt.workingColorSpace){Pt.fromWorkingColorSpace(wn.copy(this),t);const n=wn.r,r=wn.g,s=wn.b,o=Math.max(n,r,s),a=Math.min(n,r,s);let l,c;const u=(a+o)/2;if(a===o)l=0,c=0;else{const d=o-a;switch(c=u<=.5?d/(o+a):d/(2-o-a),o){case n:l=(r-s)/d+(r<s?6:0);break;case r:l=(s-n)/d+2;break;case s:l=(n-r)/d+4;break}l/=6}return e.h=l,e.s=c,e.l=u,e}getRGB(e,t=Pt.workingColorSpace){return Pt.fromWorkingColorSpace(wn.copy(this),t),e.r=wn.r,e.g=wn.g,e.b=wn.b,e}getStyle(e=ln){Pt.fromWorkingColorSpace(wn.copy(this),e);const t=wn.r,n=wn.g,r=wn.b;return e!==ln?`color(${e} ${t.toFixed(3)} ${n.toFixed(3)} ${r.toFixed(3)})`:`rgb(${Math.round(t*255)},${Math.round(n*255)},${Math.round(r*255)})`}offsetHSL(e,t,n){return this.getHSL(er),this.setHSL(er.h+e,er.s+t,er.l+n)}add(e){return this.r+=e.r,this.g+=e.g,this.b+=e.b,this}addColors(e,t){return this.r=e.r+t.r,this.g=e.g+t.g,this.b=e.b+t.b,this}addScalar(e){return this.r+=e,this.g+=e,this.b+=e,this}sub(e){return this.r=Math.max(0,this.r-e.r),this.g=Math.max(0,this.g-e.g),this.b=Math.max(0,this.b-e.b),this}multiply(e){return this.r*=e.r,this.g*=e.g,this.b*=e.b,this}multiplyScalar(e){return this.r*=e,this.g*=e,this.b*=e,this}lerp(e,t){return this.r+=(e.r-this.r)*t,this.g+=(e.g-this.g)*t,this.b+=(e.b-this.b)*t,this}lerpColors(e,t,n){return this.r=e.r+(t.r-e.r)*n,this.g=e.g+(t.g-e.g)*n,this.b=e.b+(t.b-e.b)*n,this}lerpHSL(e,t){this.getHSL(er),e.getHSL(Eo);const n=Js(er.h,Eo.h,t),r=Js(er.s,Eo.s,t),s=Js(er.l,Eo.l,t);return this.setHSL(n,r,s),this}setFromVector3(e){return this.r=e.x,this.g=e.y,this.b=e.z,this}applyMatrix3(e){const t=this.r,n=this.g,r=this.b,s=e.elements;return this.r=s[0]*t+s[3]*n+s[6]*r,this.g=s[1]*t+s[4]*n+s[7]*r,this.b=s[2]*t+s[5]*n+s[8]*r,this}equals(e){return e.r===this.r&&e.g===this.g&&e.b===this.b}fromArray(e,t=0){return this.r=e[t],this.g=e[t+1],this.b=e[t+2],this}toArray(e=[],t=0){return e[t]=this.r,e[t+1]=this.g,e[t+2]=this.b,e}fromBufferAttribute(e,t){return this.r=e.getX(t),this.g=e.getY(t),this.b=e.getZ(t),this}toJSON(){return this.getHex()}*[Symbol.iterator](){yield this.r,yield this.g,yield this.b}}const wn=new rt;rt.NAMES=Ah;let Kp=0;class hi extends Nr{static get type(){return"Material"}get type(){return this.constructor.type}set type(e){}constructor(){super(),this.isMaterial=!0,Object.defineProperty(this,"id",{value:Kp++}),this.uuid=di(),this.name="",this.blending=as,this.side=ji,this.vertexColors=!1,this.opacity=1,this.transparent=!1,this.alphaHash=!1,this.blendSrc=Oc,this.blendDst=kc,this.blendEquation=Cr,this.blendSrcAlpha=null,this.blendDstAlpha=null,this.blendEquationAlpha=null,this.blendColor=new rt(0,0,0),this.blendAlpha=0,this.depthFunc=ms,this.depthTest=!0,this.depthWrite=!0,this.stencilWriteMask=255,this.stencilFunc=vu,this.stencilRef=0,this.stencilFuncMask=255,this.stencilFail=Or,this.stencilZFail=Or,this.stencilZPass=Or,this.stencilWrite=!1,this.clippingPlanes=null,this.clipIntersection=!1,this.clipShadows=!1,this.shadowSide=null,this.colorWrite=!0,this.precision=null,this.polygonOffset=!1,this.polygonOffsetFactor=0,this.polygonOffsetUnits=0,this.dithering=!1,this.alphaToCoverage=!1,this.premultipliedAlpha=!1,this.forceSinglePass=!1,this.visible=!0,this.toneMapped=!0,this.userData={},this.version=0,this._alphaTest=0}get alphaTest(){return this._alphaTest}set alphaTest(e){this._alphaTest>0!=e>0&&this.version++,this._alphaTest=e}onBeforeRender(){}onBeforeCompile(){}customProgramCacheKey(){return this.onBeforeCompile.toString()}setValues(e){if(e!==void 0)for(const t in e){const n=e[t];if(n===void 0){console.warn(`THREE.Material: parameter '${t}' has value of undefined.`);continue}const r=this[t];if(r===void 0){console.warn(`THREE.Material: '${t}' is not a property of THREE.${this.type}.`);continue}r&&r.isColor?r.set(n):r&&r.isVector3&&n&&n.isVector3?r.copy(n):this[t]=n}}toJSON(e){const t=e===void 0||typeof e=="string";t&&(e={textures:{},images:{}});const n={metadata:{version:4.6,type:"Material",generator:"Material.toJSON"}};n.uuid=this.uuid,n.type=this.type,this.name!==""&&(n.name=this.name),this.color&&this.color.isColor&&(n.color=this.color.getHex()),this.roughness!==void 0&&(n.roughness=this.roughness),this.metalness!==void 0&&(n.metalness=this.metalness),this.sheen!==void 0&&(n.sheen=this.sheen),this.sheenColor&&this.sheenColor.isColor&&(n.sheenColor=this.sheenColor.getHex()),this.sheenRoughness!==void 0&&(n.sheenRoughness=this.sheenRoughness),this.emissive&&this.emissive.isColor&&(n.emissive=this.emissive.getHex()),this.emissiveIntensity!==void 0&&this.emissiveIntensity!==1&&(n.emissiveIntensity=this.emissiveIntensity),this.specular&&this.specular.isColor&&(n.specular=this.specular.getHex()),this.specularIntensity!==void 0&&(n.specularIntensity=this.specularIntensity),this.specularColor&&this.specularColor.isColor&&(n.specularColor=this.specularColor.getHex()),this.shininess!==void 0&&(n.shininess=this.shininess),this.clearcoat!==void 0&&(n.clearcoat=this.clearcoat),this.clearcoatRoughness!==void 0&&(n.clearcoatRoughness=this.clearcoatRoughness),this.clearcoatMap&&this.clearcoatMap.isTexture&&(n.clearcoatMap=this.clearcoatMap.toJSON(e).uuid),this.clearcoatRoughnessMap&&this.clearcoatRoughnessMap.isTexture&&(n.clearcoatRoughnessMap=this.clearcoatRoughnessMap.toJSON(e).uuid),this.clearcoatNormalMap&&this.clearcoatNormalMap.isTexture&&(n.clearcoatNormalMap=this.clearcoatNormalMap.toJSON(e).uuid,n.clearcoatNormalScale=this.clearcoatNormalScale.toArray()),this.dispersion!==void 0&&(n.dispersion=this.dispersion),this.iridescence!==void 0&&(n.iridescence=this.iridescence),this.iridescenceIOR!==void 0&&(n.iridescenceIOR=this.iridescenceIOR),this.iridescenceThicknessRange!==void 0&&(n.iridescenceThicknessRange=this.iridescenceThicknessRange),this.iridescenceMap&&this.iridescenceMap.isTexture&&(n.iridescenceMap=this.iridescenceMap.toJSON(e).uuid),this.iridescenceThicknessMap&&this.iridescenceThicknessMap.isTexture&&(n.iridescenceThicknessMap=this.iridescenceThicknessMap.toJSON(e).uuid),this.anisotropy!==void 0&&(n.anisotropy=this.anisotropy),this.anisotropyRotation!==void 0&&(n.anisotropyRotation=this.anisotropyRotation),this.anisotropyMap&&this.anisotropyMap.isTexture&&(n.anisotropyMap=this.anisotropyMap.toJSON(e).uuid),this.map&&this.map.isTexture&&(n.map=this.map.toJSON(e).uuid),this.matcap&&this.matcap.isTexture&&(n.matcap=this.matcap.toJSON(e).uuid),this.alphaMap&&this.alphaMap.isTexture&&(n.alphaMap=this.alphaMap.toJSON(e).uuid),this.lightMap&&this.lightMap.isTexture&&(n.lightMap=this.lightMap.toJSON(e).uuid,n.lightMapIntensity=this.lightMapIntensity),this.aoMap&&this.aoMap.isTexture&&(n.aoMap=this.aoMap.toJSON(e).uuid,n.aoMapIntensity=this.aoMapIntensity),this.bumpMap&&this.bumpMap.isTexture&&(n.bumpMap=this.bumpMap.toJSON(e).uuid,n.bumpScale=this.bumpScale),this.normalMap&&this.normalMap.isTexture&&(n.normalMap=this.normalMap.toJSON(e).uuid,n.normalMapType=this.normalMapType,n.normalScale=this.normalScale.toArray()),this.displacementMap&&this.displacementMap.isTexture&&(n.displacementMap=this.displacementMap.toJSON(e).uuid,n.displacementScale=this.displacementScale,n.displacementBias=this.displacementBias),this.roughnessMap&&this.roughnessMap.isTexture&&(n.roughnessMap=this.roughnessMap.toJSON(e).uuid),this.metalnessMap&&this.metalnessMap.isTexture&&(n.metalnessMap=this.metalnessMap.toJSON(e).uuid),this.emissiveMap&&this.emissiveMap.isTexture&&(n.emissiveMap=this.emissiveMap.toJSON(e).uuid),this.specularMap&&this.specularMap.isTexture&&(n.specularMap=this.specularMap.toJSON(e).uuid),this.specularIntensityMap&&this.specularIntensityMap.isTexture&&(n.specularIntensityMap=this.specularIntensityMap.toJSON(e).uuid),this.specularColorMap&&this.specularColorMap.isTexture&&(n.specularColorMap=this.specularColorMap.toJSON(e).uuid),this.envMap&&this.envMap.isTexture&&(n.envMap=this.envMap.toJSON(e).uuid,this.combine!==void 0&&(n.combine=this.combine)),this.envMapRotation!==void 0&&(n.envMapRotation=this.envMapRotation.toArray()),this.envMapIntensity!==void 0&&(n.envMapIntensity=this.envMapIntensity),this.reflectivity!==void 0&&(n.reflectivity=this.reflectivity),this.refractionRatio!==void 0&&(n.refractionRatio=this.refractionRatio),this.gradientMap&&this.gradientMap.isTexture&&(n.gradientMap=this.gradientMap.toJSON(e).uuid),this.transmission!==void 0&&(n.transmission=this.transmission),this.transmissionMap&&this.transmissionMap.isTexture&&(n.transmissionMap=this.transmissionMap.toJSON(e).uuid),this.thickness!==void 0&&(n.thickness=this.thickness),this.thicknessMap&&this.thicknessMap.isTexture&&(n.thicknessMap=this.thicknessMap.toJSON(e).uuid),this.attenuationDistance!==void 0&&this.attenuationDistance!==1/0&&(n.attenuationDistance=this.attenuationDistance),this.attenuationColor!==void 0&&(n.attenuationColor=this.attenuationColor.getHex()),this.size!==void 0&&(n.size=this.size),this.shadowSide!==null&&(n.shadowSide=this.shadowSide),this.sizeAttenuation!==void 0&&(n.sizeAttenuation=this.sizeAttenuation),this.blending!==as&&(n.blending=this.blending),this.side!==ji&&(n.side=this.side),this.vertexColors===!0&&(n.vertexColors=!0),this.opacity<1&&(n.opacity=this.opacity),this.transparent===!0&&(n.transparent=!0),this.blendSrc!==Oc&&(n.blendSrc=this.blendSrc),this.blendDst!==kc&&(n.blendDst=this.blendDst),this.blendEquation!==Cr&&(n.blendEquation=this.blendEquation),this.blendSrcAlpha!==null&&(n.blendSrcAlpha=this.blendSrcAlpha),this.blendDstAlpha!==null&&(n.blendDstAlpha=this.blendDstAlpha),this.blendEquationAlpha!==null&&(n.blendEquationAlpha=this.blendEquationAlpha),this.blendColor&&this.blendColor.isColor&&(n.blendColor=this.blendColor.getHex()),this.blendAlpha!==0&&(n.blendAlpha=this.blendAlpha),this.depthFunc!==ms&&(n.depthFunc=this.depthFunc),this.depthTest===!1&&(n.depthTest=this.depthTest),this.depthWrite===!1&&(n.depthWrite=this.depthWrite),this.colorWrite===!1&&(n.colorWrite=this.colorWrite),this.stencilWriteMask!==255&&(n.stencilWriteMask=this.stencilWriteMask),this.stencilFunc!==vu&&(n.stencilFunc=this.stencilFunc),this.stencilRef!==0&&(n.stencilRef=this.stencilRef),this.stencilFuncMask!==255&&(n.stencilFuncMask=this.stencilFuncMask),this.stencilFail!==Or&&(n.stencilFail=this.stencilFail),this.stencilZFail!==Or&&(n.stencilZFail=this.stencilZFail),this.stencilZPass!==Or&&(n.stencilZPass=this.stencilZPass),this.stencilWrite===!0&&(n.stencilWrite=this.stencilWrite),this.rotation!==void 0&&this.rotation!==0&&(n.rotation=this.rotation),this.polygonOffset===!0&&(n.polygonOffset=!0),this.polygonOffsetFactor!==0&&(n.polygonOffsetFactor=this.polygonOffsetFactor),this.polygonOffsetUnits!==0&&(n.polygonOffsetUnits=this.polygonOffsetUnits),this.linewidth!==void 0&&this.linewidth!==1&&(n.linewidth=this.linewidth),this.dashSize!==void 0&&(n.dashSize=this.dashSize),this.gapSize!==void 0&&(n.gapSize=this.gapSize),this.scale!==void 0&&(n.scale=this.scale),this.dithering===!0&&(n.dithering=!0),this.alphaTest>0&&(n.alphaTest=this.alphaTest),this.alphaHash===!0&&(n.alphaHash=!0),this.alphaToCoverage===!0&&(n.alphaToCoverage=!0),this.premultipliedAlpha===!0&&(n.premultipliedAlpha=!0),this.forceSinglePass===!0&&(n.forceSinglePass=!0),this.wireframe===!0&&(n.wireframe=!0),this.wireframeLinewidth>1&&(n.wireframeLinewidth=this.wireframeLinewidth),this.wireframeLinecap!=="round"&&(n.wireframeLinecap=this.wireframeLinecap),this.wireframeLinejoin!=="round"&&(n.wireframeLinejoin=this.wireframeLinejoin),this.flatShading===!0&&(n.flatShading=!0),this.visible===!1&&(n.visible=!1),this.toneMapped===!1&&(n.toneMapped=!1),this.fog===!1&&(n.fog=!1),Object.keys(this.userData).length>0&&(n.userData=this.userData);function r(s){const o=[];for(const a in s){const l=s[a];delete l.metadata,o.push(l)}return o}if(t){const s=r(e.textures),o=r(e.images);s.length>0&&(n.textures=s),o.length>0&&(n.images=o)}return n}clone(){return new this.constructor().copy(this)}copy(e){this.name=e.name,this.blending=e.blending,this.side=e.side,this.vertexColors=e.vertexColors,this.opacity=e.opacity,this.transparent=e.transparent,this.blendSrc=e.blendSrc,this.blendDst=e.blendDst,this.blendEquation=e.blendEquation,this.blendSrcAlpha=e.blendSrcAlpha,this.blendDstAlpha=e.blendDstAlpha,this.blendEquationAlpha=e.blendEquationAlpha,this.blendColor.copy(e.blendColor),this.blendAlpha=e.blendAlpha,this.depthFunc=e.depthFunc,this.depthTest=e.depthTest,this.depthWrite=e.depthWrite,this.stencilWriteMask=e.stencilWriteMask,this.stencilFunc=e.stencilFunc,this.stencilRef=e.stencilRef,this.stencilFuncMask=e.stencilFuncMask,this.stencilFail=e.stencilFail,this.stencilZFail=e.stencilZFail,this.stencilZPass=e.stencilZPass,this.stencilWrite=e.stencilWrite;const t=e.clippingPlanes;let n=null;if(t!==null){const r=t.length;n=new Array(r);for(let s=0;s!==r;++s)n[s]=t[s].clone()}return this.clippingPlanes=n,this.clipIntersection=e.clipIntersection,this.clipShadows=e.clipShadows,this.shadowSide=e.shadowSide,this.colorWrite=e.colorWrite,this.precision=e.precision,this.polygonOffset=e.polygonOffset,this.polygonOffsetFactor=e.polygonOffsetFactor,this.polygonOffsetUnits=e.polygonOffsetUnits,this.dithering=e.dithering,this.alphaTest=e.alphaTest,this.alphaHash=e.alphaHash,this.alphaToCoverage=e.alphaToCoverage,this.premultipliedAlpha=e.premultipliedAlpha,this.forceSinglePass=e.forceSinglePass,this.visible=e.visible,this.toneMapped=e.toneMapped,this.userData=JSON.parse(JSON.stringify(e.userData)),this}dispose(){this.dispatchEvent({type:"dispose"})}set needsUpdate(e){e===!0&&this.version++}onBuild(){console.warn("Material: onBuild() has been removed.")}}class Gi extends hi{static get type(){return"MeshBasicMaterial"}constructor(e){super(),this.isMeshBasicMaterial=!0,this.color=new rt(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new Mi,this.combine=ah,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.specularMap=e.specularMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.envMapRotation.copy(e.envMapRotation),this.combine=e.combine,this.reflectivity=e.reflectivity,this.refractionRatio=e.refractionRatio,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.fog=e.fog,this}}const sn=new A,Ao=new ut;class yn{constructor(e,t,n=!1){if(Array.isArray(e))throw new TypeError("THREE.BufferAttribute: array should be a Typed Array.");this.isBufferAttribute=!0,this.name="",this.array=e,this.itemSize=t,this.count=e!==void 0?e.length/t:0,this.normalized=n,this.usage=yl,this.updateRanges=[],this.gpuType=li,this.version=0}onUploadCallback(){}set needsUpdate(e){e===!0&&this.version++}setUsage(e){return this.usage=e,this}addUpdateRange(e,t){this.updateRanges.push({start:e,count:t})}clearUpdateRanges(){this.updateRanges.length=0}copy(e){return this.name=e.name,this.array=new e.array.constructor(e.array),this.itemSize=e.itemSize,this.count=e.count,this.normalized=e.normalized,this.usage=e.usage,this.gpuType=e.gpuType,this}copyAt(e,t,n){e*=this.itemSize,n*=t.itemSize;for(let r=0,s=this.itemSize;r<s;r++)this.array[e+r]=t.array[n+r];return this}copyArray(e){return this.array.set(e),this}applyMatrix3(e){if(this.itemSize===2)for(let t=0,n=this.count;t<n;t++)Ao.fromBufferAttribute(this,t),Ao.applyMatrix3(e),this.setXY(t,Ao.x,Ao.y);else if(this.itemSize===3)for(let t=0,n=this.count;t<n;t++)sn.fromBufferAttribute(this,t),sn.applyMatrix3(e),this.setXYZ(t,sn.x,sn.y,sn.z);return this}applyMatrix4(e){for(let t=0,n=this.count;t<n;t++)sn.fromBufferAttribute(this,t),sn.applyMatrix4(e),this.setXYZ(t,sn.x,sn.y,sn.z);return this}applyNormalMatrix(e){for(let t=0,n=this.count;t<n;t++)sn.fromBufferAttribute(this,t),sn.applyNormalMatrix(e),this.setXYZ(t,sn.x,sn.y,sn.z);return this}transformDirection(e){for(let t=0,n=this.count;t<n;t++)sn.fromBufferAttribute(this,t),sn.transformDirection(e),this.setXYZ(t,sn.x,sn.y,sn.z);return this}set(e,t=0){return this.array.set(e,t),this}getComponent(e,t){let n=this.array[e*this.itemSize+t];return this.normalized&&(n=ci(n,this.array)),n}setComponent(e,t,n){return this.normalized&&(n=Ht(n,this.array)),this.array[e*this.itemSize+t]=n,this}getX(e){let t=this.array[e*this.itemSize];return this.normalized&&(t=ci(t,this.array)),t}setX(e,t){return this.normalized&&(t=Ht(t,this.array)),this.array[e*this.itemSize]=t,this}getY(e){let t=this.array[e*this.itemSize+1];return this.normalized&&(t=ci(t,this.array)),t}setY(e,t){return this.normalized&&(t=Ht(t,this.array)),this.array[e*this.itemSize+1]=t,this}getZ(e){let t=this.array[e*this.itemSize+2];return this.normalized&&(t=ci(t,this.array)),t}setZ(e,t){return this.normalized&&(t=Ht(t,this.array)),this.array[e*this.itemSize+2]=t,this}getW(e){let t=this.array[e*this.itemSize+3];return this.normalized&&(t=ci(t,this.array)),t}setW(e,t){return this.normalized&&(t=Ht(t,this.array)),this.array[e*this.itemSize+3]=t,this}setXY(e,t,n){return e*=this.itemSize,this.normalized&&(t=Ht(t,this.array),n=Ht(n,this.array)),this.array[e+0]=t,this.array[e+1]=n,this}setXYZ(e,t,n,r){return e*=this.itemSize,this.normalized&&(t=Ht(t,this.array),n=Ht(n,this.array),r=Ht(r,this.array)),this.array[e+0]=t,this.array[e+1]=n,this.array[e+2]=r,this}setXYZW(e,t,n,r,s){return e*=this.itemSize,this.normalized&&(t=Ht(t,this.array),n=Ht(n,this.array),r=Ht(r,this.array),s=Ht(s,this.array)),this.array[e+0]=t,this.array[e+1]=n,this.array[e+2]=r,this.array[e+3]=s,this}onUpload(e){return this.onUploadCallback=e,this}clone(){return new this.constructor(this.array,this.itemSize).copy(this)}toJSON(){const e={itemSize:this.itemSize,type:this.array.constructor.name,array:Array.from(this.array),normalized:this.normalized};return this.name!==""&&(e.name=this.name),this.usage!==yl&&(e.usage=this.usage),e}}class Th extends yn{constructor(e,t,n){super(new Uint16Array(e),t,n)}}class Rh extends yn{constructor(e,t,n){super(new Uint32Array(e),t,n)}}class Wi extends yn{constructor(e,t,n){super(new Float32Array(e),t,n)}}let Yp=0;const Yn=new ot,sc=new en,Xr=new A,Wn=new an,Hs=new an,gn=new A;class Ei extends Nr{constructor(){super(),this.isBufferGeometry=!0,Object.defineProperty(this,"id",{value:Yp++}),this.uuid=di(),this.name="",this.type="BufferGeometry",this.index=null,this.indirect=null,this.attributes={},this.morphAttributes={},this.morphTargetsRelative=!1,this.groups=[],this.boundingBox=null,this.boundingSphere=null,this.drawRange={start:0,count:1/0},this.userData={}}getIndex(){return this.index}setIndex(e){return Array.isArray(e)?this.index=new(Sh(e)?Rh:Th)(e,1):this.index=e,this}setIndirect(e){return this.indirect=e,this}getIndirect(){return this.indirect}getAttribute(e){return this.attributes[e]}setAttribute(e,t){return this.attributes[e]=t,this}deleteAttribute(e){return delete this.attributes[e],this}hasAttribute(e){return this.attributes[e]!==void 0}addGroup(e,t,n=0){this.groups.push({start:e,count:t,materialIndex:n})}clearGroups(){this.groups=[]}setDrawRange(e,t){this.drawRange.start=e,this.drawRange.count=t}applyMatrix4(e){const t=this.attributes.position;t!==void 0&&(t.applyMatrix4(e),t.needsUpdate=!0);const n=this.attributes.normal;if(n!==void 0){const s=new Mt().getNormalMatrix(e);n.applyNormalMatrix(s),n.needsUpdate=!0}const r=this.attributes.tangent;return r!==void 0&&(r.transformDirection(e),r.needsUpdate=!0),this.boundingBox!==null&&this.computeBoundingBox(),this.boundingSphere!==null&&this.computeBoundingSphere(),this}applyQuaternion(e){return Yn.makeRotationFromQuaternion(e),this.applyMatrix4(Yn),this}rotateX(e){return Yn.makeRotationX(e),this.applyMatrix4(Yn),this}rotateY(e){return Yn.makeRotationY(e),this.applyMatrix4(Yn),this}rotateZ(e){return Yn.makeRotationZ(e),this.applyMatrix4(Yn),this}translate(e,t,n){return Yn.makeTranslation(e,t,n),this.applyMatrix4(Yn),this}scale(e,t,n){return Yn.makeScale(e,t,n),this.applyMatrix4(Yn),this}lookAt(e){return sc.lookAt(e),sc.updateMatrix(),this.applyMatrix4(sc.matrix),this}center(){return this.computeBoundingBox(),this.boundingBox.getCenter(Xr).negate(),this.translate(Xr.x,Xr.y,Xr.z),this}setFromPoints(e){const t=this.getAttribute("position");if(t===void 0){const n=[];for(let r=0,s=e.length;r<s;r++){const o=e[r];n.push(o.x,o.y,o.z||0)}this.setAttribute("position",new Wi(n,3))}else{for(let n=0,r=t.count;n<r;n++){const s=e[n];t.setXYZ(n,s.x,s.y,s.z||0)}e.length>t.count&&console.warn("THREE.BufferGeometry: Buffer size too small for points data. Use .dispose() and create a new geometry."),t.needsUpdate=!0}return this}computeBoundingBox(){this.boundingBox===null&&(this.boundingBox=new an);const e=this.attributes.position,t=this.morphAttributes.position;if(e&&e.isGLBufferAttribute){console.error("THREE.BufferGeometry.computeBoundingBox(): GLBufferAttribute requires a manual bounding box.",this),this.boundingBox.set(new A(-1/0,-1/0,-1/0),new A(1/0,1/0,1/0));return}if(e!==void 0){if(this.boundingBox.setFromBufferAttribute(e),t)for(let n=0,r=t.length;n<r;n++){const s=t[n];Wn.setFromBufferAttribute(s),this.morphTargetsRelative?(gn.addVectors(this.boundingBox.min,Wn.min),this.boundingBox.expandByPoint(gn),gn.addVectors(this.boundingBox.max,Wn.max),this.boundingBox.expandByPoint(gn)):(this.boundingBox.expandByPoint(Wn.min),this.boundingBox.expandByPoint(Wn.max))}}else this.boundingBox.makeEmpty();(isNaN(this.boundingBox.min.x)||isNaN(this.boundingBox.min.y)||isNaN(this.boundingBox.min.z))&&console.error('THREE.BufferGeometry.computeBoundingBox(): Computed min/max have NaN values. The "position" attribute is likely to have NaN values.',this)}computeBoundingSphere(){this.boundingSphere===null&&(this.boundingSphere=new wi);const e=this.attributes.position,t=this.morphAttributes.position;if(e&&e.isGLBufferAttribute){console.error("THREE.BufferGeometry.computeBoundingSphere(): GLBufferAttribute requires a manual bounding sphere.",this),this.boundingSphere.set(new A,1/0);return}if(e){const n=this.boundingSphere.center;if(Wn.setFromBufferAttribute(e),t)for(let s=0,o=t.length;s<o;s++){const a=t[s];Hs.setFromBufferAttribute(a),this.morphTargetsRelative?(gn.addVectors(Wn.min,Hs.min),Wn.expandByPoint(gn),gn.addVectors(Wn.max,Hs.max),Wn.expandByPoint(gn)):(Wn.expandByPoint(Hs.min),Wn.expandByPoint(Hs.max))}Wn.getCenter(n);let r=0;for(let s=0,o=e.count;s<o;s++)gn.fromBufferAttribute(e,s),r=Math.max(r,n.distanceToSquared(gn));if(t)for(let s=0,o=t.length;s<o;s++){const a=t[s],l=this.morphTargetsRelative;for(let c=0,u=a.count;c<u;c++)gn.fromBufferAttribute(a,c),l&&(Xr.fromBufferAttribute(e,c),gn.add(Xr)),r=Math.max(r,n.distanceToSquared(gn))}this.boundingSphere.radius=Math.sqrt(r),isNaN(this.boundingSphere.radius)&&console.error('THREE.BufferGeometry.computeBoundingSphere(): Computed radius is NaN. The "position" attribute is likely to have NaN values.',this)}}computeTangents(){const e=this.index,t=this.attributes;if(e===null||t.position===void 0||t.normal===void 0||t.uv===void 0){console.error("THREE.BufferGeometry: .computeTangents() failed. Missing required attributes (index, position, normal or uv)");return}const n=t.position,r=t.normal,s=t.uv;this.hasAttribute("tangent")===!1&&this.setAttribute("tangent",new yn(new Float32Array(4*n.count),4));const o=this.getAttribute("tangent"),a=[],l=[];for(let N=0;N<n.count;N++)a[N]=new A,l[N]=new A;const c=new A,u=new A,d=new A,h=new ut,p=new ut,g=new ut,b=new A,m=new A;function f(N,v,y){c.fromBufferAttribute(n,N),u.fromBufferAttribute(n,v),d.fromBufferAttribute(n,y),h.fromBufferAttribute(s,N),p.fromBufferAttribute(s,v),g.fromBufferAttribute(s,y),u.sub(c),d.sub(c),p.sub(h),g.sub(h);const C=1/(p.x*g.y-g.x*p.y);isFinite(C)&&(b.copy(u).multiplyScalar(g.y).addScaledVector(d,-p.y).multiplyScalar(C),m.copy(d).multiplyScalar(p.x).addScaledVector(u,-g.x).multiplyScalar(C),a[N].add(b),a[v].add(b),a[y].add(b),l[N].add(m),l[v].add(m),l[y].add(m))}let M=this.groups;M.length===0&&(M=[{start:0,count:e.count}]);for(let N=0,v=M.length;N<v;++N){const y=M[N],C=y.start,q=y.count;for(let O=C,$=C+q;O<$;O+=3)f(e.getX(O+0),e.getX(O+1),e.getX(O+2))}const x=new A,_=new A,D=new A,P=new A;function T(N){D.fromBufferAttribute(r,N),P.copy(D);const v=a[N];x.copy(v),x.sub(D.multiplyScalar(D.dot(v))).normalize(),_.crossVectors(P,v);const C=_.dot(l[N])<0?-1:1;o.setXYZW(N,x.x,x.y,x.z,C)}for(let N=0,v=M.length;N<v;++N){const y=M[N],C=y.start,q=y.count;for(let O=C,$=C+q;O<$;O+=3)T(e.getX(O+0)),T(e.getX(O+1)),T(e.getX(O+2))}}computeVertexNormals(){const e=this.index,t=this.getAttribute("position");if(t!==void 0){let n=this.getAttribute("normal");if(n===void 0)n=new yn(new Float32Array(t.count*3),3),this.setAttribute("normal",n);else for(let h=0,p=n.count;h<p;h++)n.setXYZ(h,0,0,0);const r=new A,s=new A,o=new A,a=new A,l=new A,c=new A,u=new A,d=new A;if(e)for(let h=0,p=e.count;h<p;h+=3){const g=e.getX(h+0),b=e.getX(h+1),m=e.getX(h+2);r.fromBufferAttribute(t,g),s.fromBufferAttribute(t,b),o.fromBufferAttribute(t,m),u.subVectors(o,s),d.subVectors(r,s),u.cross(d),a.fromBufferAttribute(n,g),l.fromBufferAttribute(n,b),c.fromBufferAttribute(n,m),a.add(u),l.add(u),c.add(u),n.setXYZ(g,a.x,a.y,a.z),n.setXYZ(b,l.x,l.y,l.z),n.setXYZ(m,c.x,c.y,c.z)}else for(let h=0,p=t.count;h<p;h+=3)r.fromBufferAttribute(t,h+0),s.fromBufferAttribute(t,h+1),o.fromBufferAttribute(t,h+2),u.subVectors(o,s),d.subVectors(r,s),u.cross(d),n.setXYZ(h+0,u.x,u.y,u.z),n.setXYZ(h+1,u.x,u.y,u.z),n.setXYZ(h+2,u.x,u.y,u.z);this.normalizeNormals(),n.needsUpdate=!0}}normalizeNormals(){const e=this.attributes.normal;for(let t=0,n=e.count;t<n;t++)gn.fromBufferAttribute(e,t),gn.normalize(),e.setXYZ(t,gn.x,gn.y,gn.z)}toNonIndexed(){function e(a,l){const c=a.array,u=a.itemSize,d=a.normalized,h=new c.constructor(l.length*u);let p=0,g=0;for(let b=0,m=l.length;b<m;b++){a.isInterleavedBufferAttribute?p=l[b]*a.data.stride+a.offset:p=l[b]*u;for(let f=0;f<u;f++)h[g++]=c[p++]}return new yn(h,u,d)}if(this.index===null)return console.warn("THREE.BufferGeometry.toNonIndexed(): BufferGeometry is already non-indexed."),this;const t=new Ei,n=this.index.array,r=this.attributes;for(const a in r){const l=r[a],c=e(l,n);t.setAttribute(a,c)}const s=this.morphAttributes;for(const a in s){const l=[],c=s[a];for(let u=0,d=c.length;u<d;u++){const h=c[u],p=e(h,n);l.push(p)}t.morphAttributes[a]=l}t.morphTargetsRelative=this.morphTargetsRelative;const o=this.groups;for(let a=0,l=o.length;a<l;a++){const c=o[a];t.addGroup(c.start,c.count,c.materialIndex)}return t}toJSON(){const e={metadata:{version:4.6,type:"BufferGeometry",generator:"BufferGeometry.toJSON"}};if(e.uuid=this.uuid,e.type=this.type,this.name!==""&&(e.name=this.name),Object.keys(this.userData).length>0&&(e.userData=this.userData),this.parameters!==void 0){const l=this.parameters;for(const c in l)l[c]!==void 0&&(e[c]=l[c]);return e}e.data={attributes:{}};const t=this.index;t!==null&&(e.data.index={type:t.array.constructor.name,array:Array.prototype.slice.call(t.array)});const n=this.attributes;for(const l in n){const c=n[l];e.data.attributes[l]=c.toJSON(e.data)}const r={};let s=!1;for(const l in this.morphAttributes){const c=this.morphAttributes[l],u=[];for(let d=0,h=c.length;d<h;d++){const p=c[d];u.push(p.toJSON(e.data))}u.length>0&&(r[l]=u,s=!0)}s&&(e.data.morphAttributes=r,e.data.morphTargetsRelative=this.morphTargetsRelative);const o=this.groups;o.length>0&&(e.data.groups=JSON.parse(JSON.stringify(o)));const a=this.boundingSphere;return a!==null&&(e.data.boundingSphere={center:a.center.toArray(),radius:a.radius}),e}clone(){return new this.constructor().copy(this)}copy(e){this.index=null,this.attributes={},this.morphAttributes={},this.groups=[],this.boundingBox=null,this.boundingSphere=null;const t={};this.name=e.name;const n=e.index;n!==null&&this.setIndex(n.clone(t));const r=e.attributes;for(const c in r){const u=r[c];this.setAttribute(c,u.clone(t))}const s=e.morphAttributes;for(const c in s){const u=[],d=s[c];for(let h=0,p=d.length;h<p;h++)u.push(d[h].clone(t));this.morphAttributes[c]=u}this.morphTargetsRelative=e.morphTargetsRelative;const o=e.groups;for(let c=0,u=o.length;c<u;c++){const d=o[c];this.addGroup(d.start,d.count,d.materialIndex)}const a=e.boundingBox;a!==null&&(this.boundingBox=a.clone());const l=e.boundingSphere;return l!==null&&(this.boundingSphere=l.clone()),this.drawRange.start=e.drawRange.start,this.drawRange.count=e.drawRange.count,this.userData=e.userData,this}dispose(){this.dispatchEvent({type:"dispose"})}}const ku=new ot,yr=new Rs,To=new wi,Bu=new A,Ro=new A,Co=new A,Po=new A,oc=new A,Lo=new A,zu=new A,Do=new A;class Xt extends en{constructor(e=new Ei,t=new Gi){super(),this.isMesh=!0,this.type="Mesh",this.geometry=e,this.material=t,this.updateMorphTargets()}copy(e,t){return super.copy(e,t),e.morphTargetInfluences!==void 0&&(this.morphTargetInfluences=e.morphTargetInfluences.slice()),e.morphTargetDictionary!==void 0&&(this.morphTargetDictionary=Object.assign({},e.morphTargetDictionary)),this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}updateMorphTargets(){const t=this.geometry.morphAttributes,n=Object.keys(t);if(n.length>0){const r=t[n[0]];if(r!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let s=0,o=r.length;s<o;s++){const a=r[s].name||String(s);this.morphTargetInfluences.push(0),this.morphTargetDictionary[a]=s}}}}getVertexPosition(e,t){const n=this.geometry,r=n.attributes.position,s=n.morphAttributes.position,o=n.morphTargetsRelative;t.fromBufferAttribute(r,e);const a=this.morphTargetInfluences;if(s&&a){Lo.set(0,0,0);for(let l=0,c=s.length;l<c;l++){const u=a[l],d=s[l];u!==0&&(oc.fromBufferAttribute(d,e),o?Lo.addScaledVector(oc,u):Lo.addScaledVector(oc.sub(t),u))}t.add(Lo)}return t}raycast(e,t){const n=this.geometry,r=this.material,s=this.matrixWorld;r!==void 0&&(n.boundingSphere===null&&n.computeBoundingSphere(),To.copy(n.boundingSphere),To.applyMatrix4(s),yr.copy(e.ray).recast(e.near),!(To.containsPoint(yr.origin)===!1&&(yr.intersectSphere(To,Bu)===null||yr.origin.distanceToSquared(Bu)>(e.far-e.near)**2))&&(ku.copy(s).invert(),yr.copy(e.ray).applyMatrix4(ku),!(n.boundingBox!==null&&yr.intersectsBox(n.boundingBox)===!1)&&this._computeIntersections(e,t,yr)))}_computeIntersections(e,t,n){let r;const s=this.geometry,o=this.material,a=s.index,l=s.attributes.position,c=s.attributes.uv,u=s.attributes.uv1,d=s.attributes.normal,h=s.groups,p=s.drawRange;if(a!==null)if(Array.isArray(o))for(let g=0,b=h.length;g<b;g++){const m=h[g],f=o[m.materialIndex],M=Math.max(m.start,p.start),x=Math.min(a.count,Math.min(m.start+m.count,p.start+p.count));for(let _=M,D=x;_<D;_+=3){const P=a.getX(_),T=a.getX(_+1),N=a.getX(_+2);r=Io(this,f,e,n,c,u,d,P,T,N),r&&(r.faceIndex=Math.floor(_/3),r.face.materialIndex=m.materialIndex,t.push(r))}}else{const g=Math.max(0,p.start),b=Math.min(a.count,p.start+p.count);for(let m=g,f=b;m<f;m+=3){const M=a.getX(m),x=a.getX(m+1),_=a.getX(m+2);r=Io(this,o,e,n,c,u,d,M,x,_),r&&(r.faceIndex=Math.floor(m/3),t.push(r))}}else if(l!==void 0)if(Array.isArray(o))for(let g=0,b=h.length;g<b;g++){const m=h[g],f=o[m.materialIndex],M=Math.max(m.start,p.start),x=Math.min(l.count,Math.min(m.start+m.count,p.start+p.count));for(let _=M,D=x;_<D;_+=3){const P=_,T=_+1,N=_+2;r=Io(this,f,e,n,c,u,d,P,T,N),r&&(r.faceIndex=Math.floor(_/3),r.face.materialIndex=m.materialIndex,t.push(r))}}else{const g=Math.max(0,p.start),b=Math.min(l.count,p.start+p.count);for(let m=g,f=b;m<f;m+=3){const M=m,x=m+1,_=m+2;r=Io(this,o,e,n,c,u,d,M,x,_),r&&(r.faceIndex=Math.floor(m/3),t.push(r))}}}}function $p(i,e,t,n,r,s,o,a){let l;if(e.side===Cn?l=n.intersectTriangle(o,s,r,!0,a):l=n.intersectTriangle(r,s,o,e.side===ji,a),l===null)return null;Do.copy(a),Do.applyMatrix4(i.matrixWorld);const c=t.ray.origin.distanceTo(Do);return c<t.near||c>t.far?null:{distance:c,point:Do.clone(),object:i}}function Io(i,e,t,n,r,s,o,a,l,c){i.getVertexPosition(a,Ro),i.getVertexPosition(l,Co),i.getVertexPosition(c,Po);const u=$p(i,e,t,n,Ro,Co,Po,zu);if(u){const d=new A;Jn.getBarycoord(zu,Ro,Co,Po,d),r&&(u.uv=Jn.getInterpolatedAttribute(r,a,l,c,d,new ut)),s&&(u.uv1=Jn.getInterpolatedAttribute(s,a,l,c,d,new ut)),o&&(u.normal=Jn.getInterpolatedAttribute(o,a,l,c,d,new A),u.normal.dot(n.direction)>0&&u.normal.multiplyScalar(-1));const h={a,b:l,c,normal:new A,materialIndex:0};Jn.getNormal(Ro,Co,Po,h.normal),u.face=h,u.barycoord=d}return u}class Cs extends Ei{constructor(e=1,t=1,n=1,r=1,s=1,o=1){super(),this.type="BoxGeometry",this.parameters={width:e,height:t,depth:n,widthSegments:r,heightSegments:s,depthSegments:o};const a=this;r=Math.floor(r),s=Math.floor(s),o=Math.floor(o);const l=[],c=[],u=[],d=[];let h=0,p=0;g("z","y","x",-1,-1,n,t,e,o,s,0),g("z","y","x",1,-1,n,t,-e,o,s,1),g("x","z","y",1,1,e,n,t,r,o,2),g("x","z","y",1,-1,e,n,-t,r,o,3),g("x","y","z",1,-1,e,t,n,r,s,4),g("x","y","z",-1,-1,e,t,-n,r,s,5),this.setIndex(l),this.setAttribute("position",new Wi(c,3)),this.setAttribute("normal",new Wi(u,3)),this.setAttribute("uv",new Wi(d,2));function g(b,m,f,M,x,_,D,P,T,N,v){const y=_/T,C=D/N,q=_/2,O=D/2,$=P/2,se=T+1,Z=N+1;let ce=0,L=0;const k=new A;for(let K=0;K<Z;K++){const X=K*C-O;for(let ee=0;ee<se;ee++){const le=ee*y-q;k[b]=le*M,k[m]=X*x,k[f]=$,c.push(k.x,k.y,k.z),k[b]=0,k[m]=0,k[f]=P>0?1:-1,u.push(k.x,k.y,k.z),d.push(ee/T),d.push(1-K/N),ce+=1}}for(let K=0;K<N;K++)for(let X=0;X<T;X++){const ee=h+X+se*K,le=h+X+se*(K+1),j=h+(X+1)+se*(K+1),oe=h+(X+1)+se*K;l.push(ee,le,oe),l.push(le,j,oe),L+=6}a.addGroup(p,L,v),p+=L,h+=ce}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new Cs(e.width,e.height,e.depth,e.widthSegments,e.heightSegments,e.depthSegments)}}function Ms(i){const e={};for(const t in i){e[t]={};for(const n in i[t]){const r=i[t][n];r&&(r.isColor||r.isMatrix3||r.isMatrix4||r.isVector2||r.isVector3||r.isVector4||r.isTexture||r.isQuaternion)?r.isRenderTargetTexture?(console.warn("UniformsUtils: Textures of render targets cannot be cloned via cloneUniforms() or mergeUniforms()."),e[t][n]=null):e[t][n]=r.clone():Array.isArray(r)?e[t][n]=r.slice():e[t][n]=r}}return e}function Tn(i){const e={};for(let t=0;t<i.length;t++){const n=Ms(i[t]);for(const r in n)e[r]=n[r]}return e}function Zp(i){const e=[];for(let t=0;t<i.length;t++)e.push(i[t].clone());return e}function Ch(i){const e=i.getRenderTarget();return e===null?i.outputColorSpace:e.isXRRenderTarget===!0?e.texture.colorSpace:Pt.workingColorSpace}const Jp={clone:Ms,merge:Tn};var em=`void main() {
	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}`,tm=`void main() {
	gl_FragColor = vec4( 1.0, 0.0, 0.0, 1.0 );
}`;class fr extends hi{static get type(){return"ShaderMaterial"}constructor(e){super(),this.isShaderMaterial=!0,this.defines={},this.uniforms={},this.uniformsGroups=[],this.vertexShader=em,this.fragmentShader=tm,this.linewidth=1,this.wireframe=!1,this.wireframeLinewidth=1,this.fog=!1,this.lights=!1,this.clipping=!1,this.forceSinglePass=!0,this.extensions={clipCullDistance:!1,multiDraw:!1},this.defaultAttributeValues={color:[1,1,1],uv:[0,0],uv1:[0,0]},this.index0AttributeName=void 0,this.uniformsNeedUpdate=!1,this.glslVersion=null,e!==void 0&&this.setValues(e)}copy(e){return super.copy(e),this.fragmentShader=e.fragmentShader,this.vertexShader=e.vertexShader,this.uniforms=Ms(e.uniforms),this.uniformsGroups=Zp(e.uniformsGroups),this.defines=Object.assign({},e.defines),this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.fog=e.fog,this.lights=e.lights,this.clipping=e.clipping,this.extensions=Object.assign({},e.extensions),this.glslVersion=e.glslVersion,this}toJSON(e){const t=super.toJSON(e);t.glslVersion=this.glslVersion,t.uniforms={};for(const r in this.uniforms){const o=this.uniforms[r].value;o&&o.isTexture?t.uniforms[r]={type:"t",value:o.toJSON(e).uuid}:o&&o.isColor?t.uniforms[r]={type:"c",value:o.getHex()}:o&&o.isVector2?t.uniforms[r]={type:"v2",value:o.toArray()}:o&&o.isVector3?t.uniforms[r]={type:"v3",value:o.toArray()}:o&&o.isVector4?t.uniforms[r]={type:"v4",value:o.toArray()}:o&&o.isMatrix3?t.uniforms[r]={type:"m3",value:o.toArray()}:o&&o.isMatrix4?t.uniforms[r]={type:"m4",value:o.toArray()}:t.uniforms[r]={value:o}}Object.keys(this.defines).length>0&&(t.defines=this.defines),t.vertexShader=this.vertexShader,t.fragmentShader=this.fragmentShader,t.lights=this.lights,t.clipping=this.clipping;const n={};for(const r in this.extensions)this.extensions[r]===!0&&(n[r]=!0);return Object.keys(n).length>0&&(t.extensions=n),t}}class Ph extends en{constructor(){super(),this.isCamera=!0,this.type="Camera",this.matrixWorldInverse=new ot,this.projectionMatrix=new ot,this.projectionMatrixInverse=new ot,this.coordinateSystem=Hi}copy(e,t){return super.copy(e,t),this.matrixWorldInverse.copy(e.matrixWorldInverse),this.projectionMatrix.copy(e.projectionMatrix),this.projectionMatrixInverse.copy(e.projectionMatrixInverse),this.coordinateSystem=e.coordinateSystem,this}getWorldDirection(e){return super.getWorldDirection(e).negate()}updateMatrixWorld(e){super.updateMatrixWorld(e),this.matrixWorldInverse.copy(this.matrixWorld).invert()}updateWorldMatrix(e,t){super.updateWorldMatrix(e,t),this.matrixWorldInverse.copy(this.matrixWorld).invert()}clone(){return new this.constructor().copy(this)}}const tr=new A,Hu=new ut,Gu=new ut;class vn extends Ph{constructor(e=50,t=1,n=.1,r=2e3){super(),this.isPerspectiveCamera=!0,this.type="PerspectiveCamera",this.fov=e,this.zoom=1,this.near=n,this.far=r,this.focus=10,this.aspect=t,this.view=null,this.filmGauge=35,this.filmOffset=0,this.updateProjectionMatrix()}copy(e,t){return super.copy(e,t),this.fov=e.fov,this.zoom=e.zoom,this.near=e.near,this.far=e.far,this.focus=e.focus,this.aspect=e.aspect,this.view=e.view===null?null:Object.assign({},e.view),this.filmGauge=e.filmGauge,this.filmOffset=e.filmOffset,this}setFocalLength(e){const t=.5*this.getFilmHeight()/e;this.fov=ys*2*Math.atan(t),this.updateProjectionMatrix()}getFocalLength(){const e=Math.tan(Zs*.5*this.fov);return .5*this.getFilmHeight()/e}getEffectiveFOV(){return ys*2*Math.atan(Math.tan(Zs*.5*this.fov)/this.zoom)}getFilmWidth(){return this.filmGauge*Math.min(this.aspect,1)}getFilmHeight(){return this.filmGauge/Math.max(this.aspect,1)}getViewBounds(e,t,n){tr.set(-1,-1,.5).applyMatrix4(this.projectionMatrixInverse),t.set(tr.x,tr.y).multiplyScalar(-e/tr.z),tr.set(1,1,.5).applyMatrix4(this.projectionMatrixInverse),n.set(tr.x,tr.y).multiplyScalar(-e/tr.z)}getViewSize(e,t){return this.getViewBounds(e,Hu,Gu),t.subVectors(Gu,Hu)}setViewOffset(e,t,n,r,s,o){this.aspect=e/t,this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=e,this.view.fullHeight=t,this.view.offsetX=n,this.view.offsetY=r,this.view.width=s,this.view.height=o,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const e=this.near;let t=e*Math.tan(Zs*.5*this.fov)/this.zoom,n=2*t,r=this.aspect*n,s=-.5*r;const o=this.view;if(this.view!==null&&this.view.enabled){const l=o.fullWidth,c=o.fullHeight;s+=o.offsetX*r/l,t-=o.offsetY*n/c,r*=o.width/l,n*=o.height/c}const a=this.filmOffset;a!==0&&(s+=e*a/this.getFilmWidth()),this.projectionMatrix.makePerspective(s,s+r,t,t-n,e,this.far,this.coordinateSystem),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(e){const t=super.toJSON(e);return t.object.fov=this.fov,t.object.zoom=this.zoom,t.object.near=this.near,t.object.far=this.far,t.object.focus=this.focus,t.object.aspect=this.aspect,this.view!==null&&(t.object.view=Object.assign({},this.view)),t.object.filmGauge=this.filmGauge,t.object.filmOffset=this.filmOffset,t}}const Qr=-90,Kr=1;class nm extends en{constructor(e,t,n){super(),this.type="CubeCamera",this.renderTarget=n,this.coordinateSystem=null,this.activeMipmapLevel=0;const r=new vn(Qr,Kr,e,t);r.layers=this.layers,this.add(r);const s=new vn(Qr,Kr,e,t);s.layers=this.layers,this.add(s);const o=new vn(Qr,Kr,e,t);o.layers=this.layers,this.add(o);const a=new vn(Qr,Kr,e,t);a.layers=this.layers,this.add(a);const l=new vn(Qr,Kr,e,t);l.layers=this.layers,this.add(l);const c=new vn(Qr,Kr,e,t);c.layers=this.layers,this.add(c)}updateCoordinateSystem(){const e=this.coordinateSystem,t=this.children.concat(),[n,r,s,o,a,l]=t;for(const c of t)this.remove(c);if(e===Hi)n.up.set(0,1,0),n.lookAt(1,0,0),r.up.set(0,1,0),r.lookAt(-1,0,0),s.up.set(0,0,-1),s.lookAt(0,1,0),o.up.set(0,0,1),o.lookAt(0,-1,0),a.up.set(0,1,0),a.lookAt(0,0,1),l.up.set(0,1,0),l.lookAt(0,0,-1);else if(e===ga)n.up.set(0,-1,0),n.lookAt(-1,0,0),r.up.set(0,-1,0),r.lookAt(1,0,0),s.up.set(0,0,1),s.lookAt(0,1,0),o.up.set(0,0,-1),o.lookAt(0,-1,0),a.up.set(0,-1,0),a.lookAt(0,0,1),l.up.set(0,-1,0),l.lookAt(0,0,-1);else throw new Error("THREE.CubeCamera.updateCoordinateSystem(): Invalid coordinate system: "+e);for(const c of t)this.add(c),c.updateMatrixWorld()}update(e,t){this.parent===null&&this.updateMatrixWorld();const{renderTarget:n,activeMipmapLevel:r}=this;this.coordinateSystem!==e.coordinateSystem&&(this.coordinateSystem=e.coordinateSystem,this.updateCoordinateSystem());const[s,o,a,l,c,u]=this.children,d=e.getRenderTarget(),h=e.getActiveCubeFace(),p=e.getActiveMipmapLevel(),g=e.xr.enabled;e.xr.enabled=!1;const b=n.texture.generateMipmaps;n.texture.generateMipmaps=!1,e.setRenderTarget(n,0,r),e.render(t,s),e.setRenderTarget(n,1,r),e.render(t,o),e.setRenderTarget(n,2,r),e.render(t,a),e.setRenderTarget(n,3,r),e.render(t,l),e.setRenderTarget(n,4,r),e.render(t,c),n.texture.generateMipmaps=b,e.setRenderTarget(n,5,r),e.render(t,u),e.setRenderTarget(d,h,p),e.xr.enabled=g,n.texture.needsPMREMUpdate=!0}}class Lh extends un{constructor(e,t,n,r,s,o,a,l,c,u){e=e!==void 0?e:[],t=t!==void 0?t:gs,super(e,t,n,r,s,o,a,l,c,u),this.isCubeTexture=!0,this.flipY=!1}get images(){return this.image}set images(e){this.image=e}}class im extends hr{constructor(e=1,t={}){super(e,e,t),this.isWebGLCubeRenderTarget=!0;const n={width:e,height:e,depth:1},r=[n,n,n,n,n,n];this.texture=new Lh(r,t.mapping,t.wrapS,t.wrapT,t.magFilter,t.minFilter,t.format,t.type,t.anisotropy,t.colorSpace),this.texture.isRenderTargetTexture=!0,this.texture.generateMipmaps=t.generateMipmaps!==void 0?t.generateMipmaps:!1,this.texture.minFilter=t.minFilter!==void 0?t.minFilter:jn}fromEquirectangularTexture(e,t){this.texture.type=t.type,this.texture.colorSpace=t.colorSpace,this.texture.generateMipmaps=t.generateMipmaps,this.texture.minFilter=t.minFilter,this.texture.magFilter=t.magFilter;const n={uniforms:{tEquirect:{value:null}},vertexShader:`

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
			`},r=new Cs(5,5,5),s=new fr({name:"CubemapFromEquirect",uniforms:Ms(n.uniforms),vertexShader:n.vertexShader,fragmentShader:n.fragmentShader,side:Cn,blending:ur});s.uniforms.tEquirect.value=t;const o=new Xt(r,s),a=t.minFilter;return t.minFilter===zi&&(t.minFilter=jn),new nm(1,10,this).update(e,o),t.minFilter=a,o.geometry.dispose(),o.material.dispose(),this}clear(e,t,n,r){const s=e.getRenderTarget();for(let o=0;o<6;o++)e.setRenderTarget(this,o),e.clear(t,n,r);e.setRenderTarget(s)}}const ac=new A,rm=new A,sm=new Mt;class sr{constructor(e=new A(1,0,0),t=0){this.isPlane=!0,this.normal=e,this.constant=t}set(e,t){return this.normal.copy(e),this.constant=t,this}setComponents(e,t,n,r){return this.normal.set(e,t,n),this.constant=r,this}setFromNormalAndCoplanarPoint(e,t){return this.normal.copy(e),this.constant=-t.dot(this.normal),this}setFromCoplanarPoints(e,t,n){const r=ac.subVectors(n,t).cross(rm.subVectors(e,t)).normalize();return this.setFromNormalAndCoplanarPoint(r,e),this}copy(e){return this.normal.copy(e.normal),this.constant=e.constant,this}normalize(){const e=1/this.normal.length();return this.normal.multiplyScalar(e),this.constant*=e,this}negate(){return this.constant*=-1,this.normal.negate(),this}distanceToPoint(e){return this.normal.dot(e)+this.constant}distanceToSphere(e){return this.distanceToPoint(e.center)-e.radius}projectPoint(e,t){return t.copy(e).addScaledVector(this.normal,-this.distanceToPoint(e))}intersectLine(e,t){const n=e.delta(ac),r=this.normal.dot(n);if(r===0)return this.distanceToPoint(e.start)===0?t.copy(e.start):null;const s=-(e.start.dot(this.normal)+this.constant)/r;return s<0||s>1?null:t.copy(e.start).addScaledVector(n,s)}intersectsLine(e){const t=this.distanceToPoint(e.start),n=this.distanceToPoint(e.end);return t<0&&n>0||n<0&&t>0}intersectsBox(e){return e.intersectsPlane(this)}intersectsSphere(e){return e.intersectsPlane(this)}coplanarPoint(e){return e.copy(this.normal).multiplyScalar(-this.constant)}applyMatrix4(e,t){const n=t||sm.getNormalMatrix(e),r=this.coplanarPoint(ac).applyMatrix4(e),s=this.normal.applyMatrix3(n).normalize();return this.constant=-r.dot(s),this}translate(e){return this.constant-=e.dot(this.normal),this}equals(e){return e.normal.equals(this.normal)&&e.constant===this.constant}clone(){return new this.constructor().copy(this)}}const Mr=new wi,Fo=new A;class Xl{constructor(e=new sr,t=new sr,n=new sr,r=new sr,s=new sr,o=new sr){this.planes=[e,t,n,r,s,o]}set(e,t,n,r,s,o){const a=this.planes;return a[0].copy(e),a[1].copy(t),a[2].copy(n),a[3].copy(r),a[4].copy(s),a[5].copy(o),this}copy(e){const t=this.planes;for(let n=0;n<6;n++)t[n].copy(e.planes[n]);return this}setFromProjectionMatrix(e,t=Hi){const n=this.planes,r=e.elements,s=r[0],o=r[1],a=r[2],l=r[3],c=r[4],u=r[5],d=r[6],h=r[7],p=r[8],g=r[9],b=r[10],m=r[11],f=r[12],M=r[13],x=r[14],_=r[15];if(n[0].setComponents(l-s,h-c,m-p,_-f).normalize(),n[1].setComponents(l+s,h+c,m+p,_+f).normalize(),n[2].setComponents(l+o,h+u,m+g,_+M).normalize(),n[3].setComponents(l-o,h-u,m-g,_-M).normalize(),n[4].setComponents(l-a,h-d,m-b,_-x).normalize(),t===Hi)n[5].setComponents(l+a,h+d,m+b,_+x).normalize();else if(t===ga)n[5].setComponents(a,d,b,x).normalize();else throw new Error("THREE.Frustum.setFromProjectionMatrix(): Invalid coordinate system: "+t);return this}intersectsObject(e){if(e.boundingSphere!==void 0)e.boundingSphere===null&&e.computeBoundingSphere(),Mr.copy(e.boundingSphere).applyMatrix4(e.matrixWorld);else{const t=e.geometry;t.boundingSphere===null&&t.computeBoundingSphere(),Mr.copy(t.boundingSphere).applyMatrix4(e.matrixWorld)}return this.intersectsSphere(Mr)}intersectsSprite(e){return Mr.center.set(0,0,0),Mr.radius=.7071067811865476,Mr.applyMatrix4(e.matrixWorld),this.intersectsSphere(Mr)}intersectsSphere(e){const t=this.planes,n=e.center,r=-e.radius;for(let s=0;s<6;s++)if(t[s].distanceToPoint(n)<r)return!1;return!0}intersectsBox(e){const t=this.planes;for(let n=0;n<6;n++){const r=t[n];if(Fo.x=r.normal.x>0?e.max.x:e.min.x,Fo.y=r.normal.y>0?e.max.y:e.min.y,Fo.z=r.normal.z>0?e.max.z:e.min.z,r.distanceToPoint(Fo)<0)return!1}return!0}containsPoint(e){const t=this.planes;for(let n=0;n<6;n++)if(t[n].distanceToPoint(e)<0)return!1;return!0}clone(){return new this.constructor().copy(this)}}function Dh(){let i=null,e=!1,t=null,n=null;function r(s,o){t(s,o),n=i.requestAnimationFrame(r)}return{start:function(){e!==!0&&t!==null&&(n=i.requestAnimationFrame(r),e=!0)},stop:function(){i.cancelAnimationFrame(n),e=!1},setAnimationLoop:function(s){t=s},setContext:function(s){i=s}}}function om(i){const e=new WeakMap;function t(a,l){const c=a.array,u=a.usage,d=c.byteLength,h=i.createBuffer();i.bindBuffer(l,h),i.bufferData(l,c,u),a.onUploadCallback();let p;if(c instanceof Float32Array)p=i.FLOAT;else if(c instanceof Uint16Array)a.isFloat16BufferAttribute?p=i.HALF_FLOAT:p=i.UNSIGNED_SHORT;else if(c instanceof Int16Array)p=i.SHORT;else if(c instanceof Uint32Array)p=i.UNSIGNED_INT;else if(c instanceof Int32Array)p=i.INT;else if(c instanceof Int8Array)p=i.BYTE;else if(c instanceof Uint8Array)p=i.UNSIGNED_BYTE;else if(c instanceof Uint8ClampedArray)p=i.UNSIGNED_BYTE;else throw new Error("THREE.WebGLAttributes: Unsupported buffer data format: "+c);return{buffer:h,type:p,bytesPerElement:c.BYTES_PER_ELEMENT,version:a.version,size:d}}function n(a,l,c){const u=l.array,d=l.updateRanges;if(i.bindBuffer(c,a),d.length===0)i.bufferSubData(c,0,u);else{d.sort((p,g)=>p.start-g.start);let h=0;for(let p=1;p<d.length;p++){const g=d[h],b=d[p];b.start<=g.start+g.count+1?g.count=Math.max(g.count,b.start+b.count-g.start):(++h,d[h]=b)}d.length=h+1;for(let p=0,g=d.length;p<g;p++){const b=d[p];i.bufferSubData(c,b.start*u.BYTES_PER_ELEMENT,u,b.start,b.count)}l.clearUpdateRanges()}l.onUploadCallback()}function r(a){return a.isInterleavedBufferAttribute&&(a=a.data),e.get(a)}function s(a){a.isInterleavedBufferAttribute&&(a=a.data);const l=e.get(a);l&&(i.deleteBuffer(l.buffer),e.delete(a))}function o(a,l){if(a.isInterleavedBufferAttribute&&(a=a.data),a.isGLBufferAttribute){const u=e.get(a);(!u||u.version<a.version)&&e.set(a,{buffer:a.buffer,type:a.type,bytesPerElement:a.elementSize,version:a.version});return}const c=e.get(a);if(c===void 0)e.set(a,t(a,l));else if(c.version<a.version){if(c.size!==a.array.byteLength)throw new Error("THREE.WebGLAttributes: The size of the buffer attribute's array buffer does not match the original size. Resizing buffer attributes is not supported.");n(c.buffer,a,l),c.version=a.version}}return{get:r,remove:s,update:o}}class Ps extends Ei{constructor(e=1,t=1,n=1,r=1){super(),this.type="PlaneGeometry",this.parameters={width:e,height:t,widthSegments:n,heightSegments:r};const s=e/2,o=t/2,a=Math.floor(n),l=Math.floor(r),c=a+1,u=l+1,d=e/a,h=t/l,p=[],g=[],b=[],m=[];for(let f=0;f<u;f++){const M=f*h-o;for(let x=0;x<c;x++){const _=x*d-s;g.push(_,-M,0),b.push(0,0,1),m.push(x/a),m.push(1-f/l)}}for(let f=0;f<l;f++)for(let M=0;M<a;M++){const x=M+c*f,_=M+c*(f+1),D=M+1+c*(f+1),P=M+1+c*f;p.push(x,_,P),p.push(_,D,P)}this.setIndex(p),this.setAttribute("position",new Wi(g,3)),this.setAttribute("normal",new Wi(b,3)),this.setAttribute("uv",new Wi(m,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new Ps(e.width,e.height,e.widthSegments,e.heightSegments)}}var am=`#ifdef USE_ALPHAHASH
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
#endif`,um=`#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,dm=`#ifdef USE_ALPHATEST
	#ifdef ALPHA_TO_COVERAGE
	diffuseColor.a = smoothstep( alphaTest, alphaTest + fwidth( diffuseColor.a ), diffuseColor.a );
	if ( diffuseColor.a == 0.0 ) discard;
	#else
	if ( diffuseColor.a < alphaTest ) discard;
	#endif
#endif`,hm=`#ifdef USE_ALPHATEST
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
#endif`,Fm=`#ifdef USE_DISPLACEMENTMAP
	transformed += normalize( objectNormal ) * ( texture2D( displacementMap, vDisplacementMapUv ).x * displacementScale + displacementBias );
#endif`,Nm=`#ifdef USE_EMISSIVEMAP
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
#endif`,Gm=`#ifdef USE_ENVMAP
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		
		varying vec3 vWorldPosition;
	#else
		varying vec3 vReflect;
		uniform float refractionRatio;
	#endif
#endif`,Vm=`#ifdef USE_ENVMAP
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
#endif`,e0=`ToonMaterial material;
material.diffuseColor = diffuseColor.rgb;`,t0=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Toon`,n0=`BlinnPhongMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularColor = specular;
material.specularShininess = shininess;
material.specularStrength = specularStrength;`,i0=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_BlinnPhong`,r0=`PhysicalMaterial material;
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
#endif`,s0=`struct PhysicalMaterial {
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
}`,o0=`
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
#endif`,a0=`#if defined( RE_IndirectDiffuse )
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
#endif`,c0=`#if defined( RE_IndirectDiffuse )
	RE_IndirectDiffuse( irradiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif
#if defined( RE_IndirectSpecular )
	RE_IndirectSpecular( radiance, iblIrradiance, clearcoatRadiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif`,l0=`#if defined( USE_LOGDEPTHBUF )
	gl_FragDepth = vIsPerspective == 0.0 ? gl_FragCoord.z : log2( vFragDepth ) * logDepthBufFC * 0.5;
#endif`,u0=`#if defined( USE_LOGDEPTHBUF )
	uniform float logDepthBufFC;
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,d0=`#ifdef USE_LOGDEPTHBUF
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,h0=`#ifdef USE_LOGDEPTHBUF
	vFragDepth = 1.0 + gl_Position.w;
	vIsPerspective = float( isPerspectiveMatrix( projectionMatrix ) );
#endif`,f0=`#ifdef USE_MAP
	vec4 sampledDiffuseColor = texture2D( map, vMapUv );
	#ifdef DECODE_VIDEO_TEXTURE
		sampledDiffuseColor = sRGBTransferEOTF( sampledDiffuseColor );
	#endif
	diffuseColor *= sampledDiffuseColor;
#endif`,p0=`#ifdef USE_MAP
	uniform sampler2D map;
#endif`,m0=`#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
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
#endif`,g0=`#if defined( USE_POINTS_UV )
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
#endif`,b0=`float metalnessFactor = metalness;
#ifdef USE_METALNESSMAP
	vec4 texelMetalness = texture2D( metalnessMap, vMetalnessMapUv );
	metalnessFactor *= texelMetalness.b;
#endif`,_0=`#ifdef USE_METALNESSMAP
	uniform sampler2D metalnessMap;
#endif`,x0=`#ifdef USE_INSTANCING_MORPH
	float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	float morphTargetBaseInfluence = texelFetch( morphTexture, ivec2( 0, gl_InstanceID ), 0 ).r;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		morphTargetInfluences[i] =  texelFetch( morphTexture, ivec2( i + 1, gl_InstanceID ), 0 ).r;
	}
#endif`,v0=`#if defined( USE_MORPHCOLORS )
	vColor *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		#if defined( USE_COLOR_ALPHA )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ) * morphTargetInfluences[ i ];
		#elif defined( USE_COLOR )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ).rgb * morphTargetInfluences[ i ];
		#endif
	}
#endif`,y0=`#ifdef USE_MORPHNORMALS
	objectNormal *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) objectNormal += getMorph( gl_VertexID, i, 1 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,M0=`#ifdef USE_MORPHTARGETS
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
#endif`,S0=`#ifdef USE_MORPHTARGETS
	transformed *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) transformed += getMorph( gl_VertexID, i, 0 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,w0=`float faceDirection = gl_FrontFacing ? 1.0 : - 1.0;
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
vec3 nonPerturbedNormal = normal;`,E0=`#ifdef USE_NORMALMAP_OBJECTSPACE
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
#endif`,A0=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,T0=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,R0=`#ifndef FLAT_SHADED
	vNormal = normalize( transformedNormal );
	#ifdef USE_TANGENT
		vTangent = normalize( transformedTangent );
		vBitangent = normalize( cross( vNormal, vTangent ) * tangent.w );
	#endif
#endif`,C0=`#ifdef USE_NORMALMAP
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
#endif`,P0=`#ifdef USE_CLEARCOAT
	vec3 clearcoatNormal = nonPerturbedNormal;
#endif`,L0=`#ifdef USE_CLEARCOAT_NORMALMAP
	vec3 clearcoatMapN = texture2D( clearcoatNormalMap, vClearcoatNormalMapUv ).xyz * 2.0 - 1.0;
	clearcoatMapN.xy *= clearcoatNormalScale;
	clearcoatNormal = normalize( tbn2 * clearcoatMapN );
#endif`,D0=`#ifdef USE_CLEARCOATMAP
	uniform sampler2D clearcoatMap;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform sampler2D clearcoatNormalMap;
	uniform vec2 clearcoatNormalScale;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform sampler2D clearcoatRoughnessMap;
#endif`,I0=`#ifdef USE_IRIDESCENCEMAP
	uniform sampler2D iridescenceMap;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform sampler2D iridescenceThicknessMap;
#endif`,F0=`#ifdef OPAQUE
diffuseColor.a = 1.0;
#endif
#ifdef USE_TRANSMISSION
diffuseColor.a *= material.transmissionAlpha;
#endif
gl_FragColor = vec4( outgoingLight, diffuseColor.a );`,N0=`vec3 packNormalToRGB( const in vec3 normal ) {
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
}`,U0=`#ifdef PREMULTIPLIED_ALPHA
	gl_FragColor.rgb *= gl_FragColor.a;
#endif`,O0=`vec4 mvPosition = vec4( transformed, 1.0 );
#ifdef USE_BATCHING
	mvPosition = batchingMatrix * mvPosition;
#endif
#ifdef USE_INSTANCING
	mvPosition = instanceMatrix * mvPosition;
#endif
mvPosition = modelViewMatrix * mvPosition;
gl_Position = projectionMatrix * mvPosition;`,k0=`#ifdef DITHERING
	gl_FragColor.rgb = dithering( gl_FragColor.rgb );
#endif`,B0=`#ifdef DITHERING
	vec3 dithering( vec3 color ) {
		float grid_position = rand( gl_FragCoord.xy );
		vec3 dither_shift_RGB = vec3( 0.25 / 255.0, -0.25 / 255.0, 0.25 / 255.0 );
		dither_shift_RGB = mix( 2.0 * dither_shift_RGB, -2.0 * dither_shift_RGB, grid_position );
		return color + dither_shift_RGB;
	}
#endif`,z0=`float roughnessFactor = roughness;
#ifdef USE_ROUGHNESSMAP
	vec4 texelRoughness = texture2D( roughnessMap, vRoughnessMapUv );
	roughnessFactor *= texelRoughness.g;
#endif`,H0=`#ifdef USE_ROUGHNESSMAP
	uniform sampler2D roughnessMap;
#endif`,G0=`#if NUM_SPOT_LIGHT_COORDS > 0
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
#endif`,V0=`#if NUM_SPOT_LIGHT_COORDS > 0
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
#endif`,W0=`#if ( defined( USE_SHADOWMAP ) && ( NUM_DIR_LIGHT_SHADOWS > 0 || NUM_POINT_LIGHT_SHADOWS > 0 ) ) || ( NUM_SPOT_LIGHT_COORDS > 0 )
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
#endif`,q0=`float getShadowMask() {
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
}`,j0=`#ifdef USE_SKINNING
	mat4 boneMatX = getBoneMatrix( skinIndex.x );
	mat4 boneMatY = getBoneMatrix( skinIndex.y );
	mat4 boneMatZ = getBoneMatrix( skinIndex.z );
	mat4 boneMatW = getBoneMatrix( skinIndex.w );
#endif`,X0=`#ifdef USE_SKINNING
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
#endif`,Q0=`#ifdef USE_SKINNING
	vec4 skinVertex = bindMatrix * vec4( transformed, 1.0 );
	vec4 skinned = vec4( 0.0 );
	skinned += boneMatX * skinVertex * skinWeight.x;
	skinned += boneMatY * skinVertex * skinWeight.y;
	skinned += boneMatZ * skinVertex * skinWeight.z;
	skinned += boneMatW * skinVertex * skinWeight.w;
	transformed = ( bindMatrixInverse * skinned ).xyz;
#endif`,K0=`#ifdef USE_SKINNING
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
#endif`,Y0=`float specularStrength;
#ifdef USE_SPECULARMAP
	vec4 texelSpecular = texture2D( specularMap, vSpecularMapUv );
	specularStrength = texelSpecular.r;
#else
	specularStrength = 1.0;
#endif`,$0=`#ifdef USE_SPECULARMAP
	uniform sampler2D specularMap;
#endif`,Z0=`#if defined( TONE_MAPPING )
	gl_FragColor.rgb = toneMapping( gl_FragColor.rgb );
#endif`,J0=`#ifndef saturate
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
vec3 CustomToneMapping( vec3 color ) { return color; }`,eg=`#ifdef USE_TRANSMISSION
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
#endif`,tg=`#ifdef USE_TRANSMISSION
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
#endif`,ng=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,ig=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,rg=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,sg=`#if defined( USE_ENVMAP ) || defined( DISTANCE ) || defined ( USE_SHADOWMAP ) || defined ( USE_TRANSMISSION ) || NUM_SPOT_LIGHT_COORDS > 0
	vec4 worldPosition = vec4( transformed, 1.0 );
	#ifdef USE_BATCHING
		worldPosition = batchingMatrix * worldPosition;
	#endif
	#ifdef USE_INSTANCING
		worldPosition = instanceMatrix * worldPosition;
	#endif
	worldPosition = modelMatrix * worldPosition;
#endif`;const og=`varying vec2 vUv;
uniform mat3 uvTransform;
void main() {
	vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	gl_Position = vec4( position.xy, 1.0, 1.0 );
}`,ag=`uniform sampler2D t2D;
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
}`,cg=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,lg=`#ifdef ENVMAP_TYPE_CUBE
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
}`,ug=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,dg=`uniform samplerCube tCube;
uniform float tFlip;
uniform float opacity;
varying vec3 vWorldDirection;
void main() {
	vec4 texColor = textureCube( tCube, vec3( tFlip * vWorldDirection.x, vWorldDirection.yz ) );
	gl_FragColor = texColor;
	gl_FragColor.a *= opacity;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,hg=`#include <common>
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
}`,fg=`#if DEPTH_PACKING == 3200
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
}`,pg=`#define DISTANCE
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
}`,mg=`#define DISTANCE
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
}`,gg=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
}`,bg=`uniform sampler2D tEquirect;
varying vec3 vWorldDirection;
#include <common>
void main() {
	vec3 direction = normalize( vWorldDirection );
	vec2 sampleUV = equirectUv( direction );
	gl_FragColor = texture2D( tEquirect, sampleUV );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,_g=`uniform float scale;
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
}`,xg=`uniform vec3 diffuse;
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
}`,vg=`#include <common>
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
}`,yg=`uniform vec3 diffuse;
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
}`,Mg=`#define LAMBERT
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
}`,Sg=`#define LAMBERT
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
}`,wg=`#define MATCAP
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
}`,Eg=`#define MATCAP
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
}`,Ag=`#define NORMAL
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
}`,Tg=`#define NORMAL
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
}`,Rg=`#define PHONG
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
}`,Cg=`#define PHONG
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
}`,Pg=`#define STANDARD
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
}`,Lg=`#define STANDARD
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
}`,Dg=`#define TOON
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
}`,Ig=`#define TOON
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
}`,Fg=`uniform float size;
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
}`,Ng=`uniform vec3 diffuse;
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
}`,Ug=`#include <common>
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
}`,Og=`uniform vec3 color;
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
}`,kg=`uniform float rotation;
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
}`,Bg=`uniform vec3 diffuse;
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
}`,yt={alphahash_fragment:am,alphahash_pars_fragment:cm,alphamap_fragment:lm,alphamap_pars_fragment:um,alphatest_fragment:dm,alphatest_pars_fragment:hm,aomap_fragment:fm,aomap_pars_fragment:pm,batching_pars_vertex:mm,batching_vertex:gm,begin_vertex:bm,beginnormal_vertex:_m,bsdfs:xm,iridescence_fragment:vm,bumpmap_pars_fragment:ym,clipping_planes_fragment:Mm,clipping_planes_pars_fragment:Sm,clipping_planes_pars_vertex:wm,clipping_planes_vertex:Em,color_fragment:Am,color_pars_fragment:Tm,color_pars_vertex:Rm,color_vertex:Cm,common:Pm,cube_uv_reflection_fragment:Lm,defaultnormal_vertex:Dm,displacementmap_pars_vertex:Im,displacementmap_vertex:Fm,emissivemap_fragment:Nm,emissivemap_pars_fragment:Um,colorspace_fragment:Om,colorspace_pars_fragment:km,envmap_fragment:Bm,envmap_common_pars_fragment:zm,envmap_pars_fragment:Hm,envmap_pars_vertex:Gm,envmap_physical_pars_fragment:Jm,envmap_vertex:Vm,fog_vertex:Wm,fog_pars_vertex:qm,fog_fragment:jm,fog_pars_fragment:Xm,gradientmap_pars_fragment:Qm,lightmap_pars_fragment:Km,lights_lambert_fragment:Ym,lights_lambert_pars_fragment:$m,lights_pars_begin:Zm,lights_toon_fragment:e0,lights_toon_pars_fragment:t0,lights_phong_fragment:n0,lights_phong_pars_fragment:i0,lights_physical_fragment:r0,lights_physical_pars_fragment:s0,lights_fragment_begin:o0,lights_fragment_maps:a0,lights_fragment_end:c0,logdepthbuf_fragment:l0,logdepthbuf_pars_fragment:u0,logdepthbuf_pars_vertex:d0,logdepthbuf_vertex:h0,map_fragment:f0,map_pars_fragment:p0,map_particle_fragment:m0,map_particle_pars_fragment:g0,metalnessmap_fragment:b0,metalnessmap_pars_fragment:_0,morphinstance_vertex:x0,morphcolor_vertex:v0,morphnormal_vertex:y0,morphtarget_pars_vertex:M0,morphtarget_vertex:S0,normal_fragment_begin:w0,normal_fragment_maps:E0,normal_pars_fragment:A0,normal_pars_vertex:T0,normal_vertex:R0,normalmap_pars_fragment:C0,clearcoat_normal_fragment_begin:P0,clearcoat_normal_fragment_maps:L0,clearcoat_pars_fragment:D0,iridescence_pars_fragment:I0,opaque_fragment:F0,packing:N0,premultiplied_alpha_fragment:U0,project_vertex:O0,dithering_fragment:k0,dithering_pars_fragment:B0,roughnessmap_fragment:z0,roughnessmap_pars_fragment:H0,shadowmap_pars_fragment:G0,shadowmap_pars_vertex:V0,shadowmap_vertex:W0,shadowmask_pars_fragment:q0,skinbase_vertex:j0,skinning_pars_vertex:X0,skinning_vertex:Q0,skinnormal_vertex:K0,specularmap_fragment:Y0,specularmap_pars_fragment:$0,tonemapping_fragment:Z0,tonemapping_pars_fragment:J0,transmission_fragment:eg,transmission_pars_fragment:tg,uv_pars_fragment:ng,uv_pars_vertex:ig,uv_vertex:rg,worldpos_vertex:sg,background_vert:og,background_frag:ag,backgroundCube_vert:cg,backgroundCube_frag:lg,cube_vert:ug,cube_frag:dg,depth_vert:hg,depth_frag:fg,distanceRGBA_vert:pg,distanceRGBA_frag:mg,equirect_vert:gg,equirect_frag:bg,linedashed_vert:_g,linedashed_frag:xg,meshbasic_vert:vg,meshbasic_frag:yg,meshlambert_vert:Mg,meshlambert_frag:Sg,meshmatcap_vert:wg,meshmatcap_frag:Eg,meshnormal_vert:Ag,meshnormal_frag:Tg,meshphong_vert:Rg,meshphong_frag:Cg,meshphysical_vert:Pg,meshphysical_frag:Lg,meshtoon_vert:Dg,meshtoon_frag:Ig,points_vert:Fg,points_frag:Ng,shadow_vert:Ug,shadow_frag:Og,sprite_vert:kg,sprite_frag:Bg},Pe={common:{diffuse:{value:new rt(16777215)},opacity:{value:1},map:{value:null},mapTransform:{value:new Mt},alphaMap:{value:null},alphaMapTransform:{value:new Mt},alphaTest:{value:0}},specularmap:{specularMap:{value:null},specularMapTransform:{value:new Mt}},envmap:{envMap:{value:null},envMapRotation:{value:new Mt},flipEnvMap:{value:-1},reflectivity:{value:1},ior:{value:1.5},refractionRatio:{value:.98}},aomap:{aoMap:{value:null},aoMapIntensity:{value:1},aoMapTransform:{value:new Mt}},lightmap:{lightMap:{value:null},lightMapIntensity:{value:1},lightMapTransform:{value:new Mt}},bumpmap:{bumpMap:{value:null},bumpMapTransform:{value:new Mt},bumpScale:{value:1}},normalmap:{normalMap:{value:null},normalMapTransform:{value:new Mt},normalScale:{value:new ut(1,1)}},displacementmap:{displacementMap:{value:null},displacementMapTransform:{value:new Mt},displacementScale:{value:1},displacementBias:{value:0}},emissivemap:{emissiveMap:{value:null},emissiveMapTransform:{value:new Mt}},metalnessmap:{metalnessMap:{value:null},metalnessMapTransform:{value:new Mt}},roughnessmap:{roughnessMap:{value:null},roughnessMapTransform:{value:new Mt}},gradientmap:{gradientMap:{value:null}},fog:{fogDensity:{value:25e-5},fogNear:{value:1},fogFar:{value:2e3},fogColor:{value:new rt(16777215)}},lights:{ambientLightColor:{value:[]},lightProbe:{value:[]},directionalLights:{value:[],properties:{direction:{},color:{}}},directionalLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},directionalShadowMap:{value:[]},directionalShadowMatrix:{value:[]},spotLights:{value:[],properties:{color:{},position:{},direction:{},distance:{},coneCos:{},penumbraCos:{},decay:{}}},spotLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},spotLightMap:{value:[]},spotShadowMap:{value:[]},spotLightMatrix:{value:[]},pointLights:{value:[],properties:{color:{},position:{},decay:{},distance:{}}},pointLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{},shadowCameraNear:{},shadowCameraFar:{}}},pointShadowMap:{value:[]},pointShadowMatrix:{value:[]},hemisphereLights:{value:[],properties:{direction:{},skyColor:{},groundColor:{}}},rectAreaLights:{value:[],properties:{color:{},position:{},width:{},height:{}}},ltc_1:{value:null},ltc_2:{value:null}},points:{diffuse:{value:new rt(16777215)},opacity:{value:1},size:{value:1},scale:{value:1},map:{value:null},alphaMap:{value:null},alphaMapTransform:{value:new Mt},alphaTest:{value:0},uvTransform:{value:new Mt}},sprite:{diffuse:{value:new rt(16777215)},opacity:{value:1},center:{value:new ut(.5,.5)},rotation:{value:0},map:{value:null},mapTransform:{value:new Mt},alphaMap:{value:null},alphaMapTransform:{value:new Mt},alphaTest:{value:0}}},_i={basic:{uniforms:Tn([Pe.common,Pe.specularmap,Pe.envmap,Pe.aomap,Pe.lightmap,Pe.fog]),vertexShader:yt.meshbasic_vert,fragmentShader:yt.meshbasic_frag},lambert:{uniforms:Tn([Pe.common,Pe.specularmap,Pe.envmap,Pe.aomap,Pe.lightmap,Pe.emissivemap,Pe.bumpmap,Pe.normalmap,Pe.displacementmap,Pe.fog,Pe.lights,{emissive:{value:new rt(0)}}]),vertexShader:yt.meshlambert_vert,fragmentShader:yt.meshlambert_frag},phong:{uniforms:Tn([Pe.common,Pe.specularmap,Pe.envmap,Pe.aomap,Pe.lightmap,Pe.emissivemap,Pe.bumpmap,Pe.normalmap,Pe.displacementmap,Pe.fog,Pe.lights,{emissive:{value:new rt(0)},specular:{value:new rt(1118481)},shininess:{value:30}}]),vertexShader:yt.meshphong_vert,fragmentShader:yt.meshphong_frag},standard:{uniforms:Tn([Pe.common,Pe.envmap,Pe.aomap,Pe.lightmap,Pe.emissivemap,Pe.bumpmap,Pe.normalmap,Pe.displacementmap,Pe.roughnessmap,Pe.metalnessmap,Pe.fog,Pe.lights,{emissive:{value:new rt(0)},roughness:{value:1},metalness:{value:0},envMapIntensity:{value:1}}]),vertexShader:yt.meshphysical_vert,fragmentShader:yt.meshphysical_frag},toon:{uniforms:Tn([Pe.common,Pe.aomap,Pe.lightmap,Pe.emissivemap,Pe.bumpmap,Pe.normalmap,Pe.displacementmap,Pe.gradientmap,Pe.fog,Pe.lights,{emissive:{value:new rt(0)}}]),vertexShader:yt.meshtoon_vert,fragmentShader:yt.meshtoon_frag},matcap:{uniforms:Tn([Pe.common,Pe.bumpmap,Pe.normalmap,Pe.displacementmap,Pe.fog,{matcap:{value:null}}]),vertexShader:yt.meshmatcap_vert,fragmentShader:yt.meshmatcap_frag},points:{uniforms:Tn([Pe.points,Pe.fog]),vertexShader:yt.points_vert,fragmentShader:yt.points_frag},dashed:{uniforms:Tn([Pe.common,Pe.fog,{scale:{value:1},dashSize:{value:1},totalSize:{value:2}}]),vertexShader:yt.linedashed_vert,fragmentShader:yt.linedashed_frag},depth:{uniforms:Tn([Pe.common,Pe.displacementmap]),vertexShader:yt.depth_vert,fragmentShader:yt.depth_frag},normal:{uniforms:Tn([Pe.common,Pe.bumpmap,Pe.normalmap,Pe.displacementmap,{opacity:{value:1}}]),vertexShader:yt.meshnormal_vert,fragmentShader:yt.meshnormal_frag},sprite:{uniforms:Tn([Pe.sprite,Pe.fog]),vertexShader:yt.sprite_vert,fragmentShader:yt.sprite_frag},background:{uniforms:{uvTransform:{value:new Mt},t2D:{value:null},backgroundIntensity:{value:1}},vertexShader:yt.background_vert,fragmentShader:yt.background_frag},backgroundCube:{uniforms:{envMap:{value:null},flipEnvMap:{value:-1},backgroundBlurriness:{value:0},backgroundIntensity:{value:1},backgroundRotation:{value:new Mt}},vertexShader:yt.backgroundCube_vert,fragmentShader:yt.backgroundCube_frag},cube:{uniforms:{tCube:{value:null},tFlip:{value:-1},opacity:{value:1}},vertexShader:yt.cube_vert,fragmentShader:yt.cube_frag},equirect:{uniforms:{tEquirect:{value:null}},vertexShader:yt.equirect_vert,fragmentShader:yt.equirect_frag},distanceRGBA:{uniforms:Tn([Pe.common,Pe.displacementmap,{referencePosition:{value:new A},nearDistance:{value:1},farDistance:{value:1e3}}]),vertexShader:yt.distanceRGBA_vert,fragmentShader:yt.distanceRGBA_frag},shadow:{uniforms:Tn([Pe.lights,Pe.fog,{color:{value:new rt(0)},opacity:{value:1}}]),vertexShader:yt.shadow_vert,fragmentShader:yt.shadow_frag}};_i.physical={uniforms:Tn([_i.standard.uniforms,{clearcoat:{value:0},clearcoatMap:{value:null},clearcoatMapTransform:{value:new Mt},clearcoatNormalMap:{value:null},clearcoatNormalMapTransform:{value:new Mt},clearcoatNormalScale:{value:new ut(1,1)},clearcoatRoughness:{value:0},clearcoatRoughnessMap:{value:null},clearcoatRoughnessMapTransform:{value:new Mt},dispersion:{value:0},iridescence:{value:0},iridescenceMap:{value:null},iridescenceMapTransform:{value:new Mt},iridescenceIOR:{value:1.3},iridescenceThicknessMinimum:{value:100},iridescenceThicknessMaximum:{value:400},iridescenceThicknessMap:{value:null},iridescenceThicknessMapTransform:{value:new Mt},sheen:{value:0},sheenColor:{value:new rt(0)},sheenColorMap:{value:null},sheenColorMapTransform:{value:new Mt},sheenRoughness:{value:1},sheenRoughnessMap:{value:null},sheenRoughnessMapTransform:{value:new Mt},transmission:{value:0},transmissionMap:{value:null},transmissionMapTransform:{value:new Mt},transmissionSamplerSize:{value:new ut},transmissionSamplerMap:{value:null},thickness:{value:0},thicknessMap:{value:null},thicknessMapTransform:{value:new Mt},attenuationDistance:{value:0},attenuationColor:{value:new rt(0)},specularColor:{value:new rt(1,1,1)},specularColorMap:{value:null},specularColorMapTransform:{value:new Mt},specularIntensity:{value:1},specularIntensityMap:{value:null},specularIntensityMapTransform:{value:new Mt},anisotropyVector:{value:new ut},anisotropyMap:{value:null},anisotropyMapTransform:{value:new Mt}}]),vertexShader:yt.meshphysical_vert,fragmentShader:yt.meshphysical_frag};const No={r:0,b:0,g:0},Sr=new Mi,zg=new ot;function Hg(i,e,t,n,r,s,o){const a=new rt(0);let l=s===!0?0:1,c,u,d=null,h=0,p=null;function g(M){let x=M.isScene===!0?M.background:null;return x&&x.isTexture&&(x=(M.backgroundBlurriness>0?t:e).get(x)),x}function b(M){let x=!1;const _=g(M);_===null?f(a,l):_&&_.isColor&&(f(_,1),x=!0);const D=i.xr.getEnvironmentBlendMode();D==="additive"?n.buffers.color.setClear(0,0,0,1,o):D==="alpha-blend"&&n.buffers.color.setClear(0,0,0,0,o),(i.autoClear||x)&&(n.buffers.depth.setTest(!0),n.buffers.depth.setMask(!0),n.buffers.color.setMask(!0),i.clear(i.autoClearColor,i.autoClearDepth,i.autoClearStencil))}function m(M,x){const _=g(x);_&&(_.isCubeTexture||_.mapping===Ta)?(u===void 0&&(u=new Xt(new Cs(1,1,1),new fr({name:"BackgroundCubeMaterial",uniforms:Ms(_i.backgroundCube.uniforms),vertexShader:_i.backgroundCube.vertexShader,fragmentShader:_i.backgroundCube.fragmentShader,side:Cn,depthTest:!1,depthWrite:!1,fog:!1})),u.geometry.deleteAttribute("normal"),u.geometry.deleteAttribute("uv"),u.onBeforeRender=function(D,P,T){this.matrixWorld.copyPosition(T.matrixWorld)},Object.defineProperty(u.material,"envMap",{get:function(){return this.uniforms.envMap.value}}),r.update(u)),Sr.copy(x.backgroundRotation),Sr.x*=-1,Sr.y*=-1,Sr.z*=-1,_.isCubeTexture&&_.isRenderTargetTexture===!1&&(Sr.y*=-1,Sr.z*=-1),u.material.uniforms.envMap.value=_,u.material.uniforms.flipEnvMap.value=_.isCubeTexture&&_.isRenderTargetTexture===!1?-1:1,u.material.uniforms.backgroundBlurriness.value=x.backgroundBlurriness,u.material.uniforms.backgroundIntensity.value=x.backgroundIntensity,u.material.uniforms.backgroundRotation.value.setFromMatrix4(zg.makeRotationFromEuler(Sr)),u.material.toneMapped=Pt.getTransfer(_.colorSpace)!==jt,(d!==_||h!==_.version||p!==i.toneMapping)&&(u.material.needsUpdate=!0,d=_,h=_.version,p=i.toneMapping),u.layers.enableAll(),M.unshift(u,u.geometry,u.material,0,0,null)):_&&_.isTexture&&(c===void 0&&(c=new Xt(new Ps(2,2),new fr({name:"BackgroundMaterial",uniforms:Ms(_i.background.uniforms),vertexShader:_i.background.vertexShader,fragmentShader:_i.background.fragmentShader,side:ji,depthTest:!1,depthWrite:!1,fog:!1})),c.geometry.deleteAttribute("normal"),Object.defineProperty(c.material,"map",{get:function(){return this.uniforms.t2D.value}}),r.update(c)),c.material.uniforms.t2D.value=_,c.material.uniforms.backgroundIntensity.value=x.backgroundIntensity,c.material.toneMapped=Pt.getTransfer(_.colorSpace)!==jt,_.matrixAutoUpdate===!0&&_.updateMatrix(),c.material.uniforms.uvTransform.value.copy(_.matrix),(d!==_||h!==_.version||p!==i.toneMapping)&&(c.material.needsUpdate=!0,d=_,h=_.version,p=i.toneMapping),c.layers.enableAll(),M.unshift(c,c.geometry,c.material,0,0,null))}function f(M,x){M.getRGB(No,Ch(i)),n.buffers.color.setClear(No.r,No.g,No.b,x,o)}return{getClearColor:function(){return a},setClearColor:function(M,x=1){a.set(M),l=x,f(a,l)},getClearAlpha:function(){return l},setClearAlpha:function(M){l=M,f(a,l)},render:b,addToRenderList:m}}function Gg(i,e){const t=i.getParameter(i.MAX_VERTEX_ATTRIBS),n={},r=h(null);let s=r,o=!1;function a(y,C,q,O,$){let se=!1;const Z=d(O,q,C);s!==Z&&(s=Z,c(s.object)),se=p(y,O,q,$),se&&g(y,O,q,$),$!==null&&e.update($,i.ELEMENT_ARRAY_BUFFER),(se||o)&&(o=!1,_(y,C,q,O),$!==null&&i.bindBuffer(i.ELEMENT_ARRAY_BUFFER,e.get($).buffer))}function l(){return i.createVertexArray()}function c(y){return i.bindVertexArray(y)}function u(y){return i.deleteVertexArray(y)}function d(y,C,q){const O=q.wireframe===!0;let $=n[y.id];$===void 0&&($={},n[y.id]=$);let se=$[C.id];se===void 0&&(se={},$[C.id]=se);let Z=se[O];return Z===void 0&&(Z=h(l()),se[O]=Z),Z}function h(y){const C=[],q=[],O=[];for(let $=0;$<t;$++)C[$]=0,q[$]=0,O[$]=0;return{geometry:null,program:null,wireframe:!1,newAttributes:C,enabledAttributes:q,attributeDivisors:O,object:y,attributes:{},index:null}}function p(y,C,q,O){const $=s.attributes,se=C.attributes;let Z=0;const ce=q.getAttributes();for(const L in ce)if(ce[L].location>=0){const K=$[L];let X=se[L];if(X===void 0&&(L==="instanceMatrix"&&y.instanceMatrix&&(X=y.instanceMatrix),L==="instanceColor"&&y.instanceColor&&(X=y.instanceColor)),K===void 0||K.attribute!==X||X&&K.data!==X.data)return!0;Z++}return s.attributesNum!==Z||s.index!==O}function g(y,C,q,O){const $={},se=C.attributes;let Z=0;const ce=q.getAttributes();for(const L in ce)if(ce[L].location>=0){let K=se[L];K===void 0&&(L==="instanceMatrix"&&y.instanceMatrix&&(K=y.instanceMatrix),L==="instanceColor"&&y.instanceColor&&(K=y.instanceColor));const X={};X.attribute=K,K&&K.data&&(X.data=K.data),$[L]=X,Z++}s.attributes=$,s.attributesNum=Z,s.index=O}function b(){const y=s.newAttributes;for(let C=0,q=y.length;C<q;C++)y[C]=0}function m(y){f(y,0)}function f(y,C){const q=s.newAttributes,O=s.enabledAttributes,$=s.attributeDivisors;q[y]=1,O[y]===0&&(i.enableVertexAttribArray(y),O[y]=1),$[y]!==C&&(i.vertexAttribDivisor(y,C),$[y]=C)}function M(){const y=s.newAttributes,C=s.enabledAttributes;for(let q=0,O=C.length;q<O;q++)C[q]!==y[q]&&(i.disableVertexAttribArray(q),C[q]=0)}function x(y,C,q,O,$,se,Z){Z===!0?i.vertexAttribIPointer(y,C,q,$,se):i.vertexAttribPointer(y,C,q,O,$,se)}function _(y,C,q,O){b();const $=O.attributes,se=q.getAttributes(),Z=C.defaultAttributeValues;for(const ce in se){const L=se[ce];if(L.location>=0){let k=$[ce];if(k===void 0&&(ce==="instanceMatrix"&&y.instanceMatrix&&(k=y.instanceMatrix),ce==="instanceColor"&&y.instanceColor&&(k=y.instanceColor)),k!==void 0){const K=k.normalized,X=k.itemSize,ee=e.get(k);if(ee===void 0)continue;const le=ee.buffer,j=ee.type,oe=ee.bytesPerElement,xe=j===i.INT||j===i.UNSIGNED_INT||k.gpuType===kl;if(k.isInterleavedBufferAttribute){const me=k.data,Te=me.stride,ke=k.offset;if(me.isInstancedInterleavedBuffer){for(let He=0;He<L.locationSize;He++)f(L.location+He,me.meshPerAttribute);y.isInstancedMesh!==!0&&O._maxInstanceCount===void 0&&(O._maxInstanceCount=me.meshPerAttribute*me.count)}else for(let He=0;He<L.locationSize;He++)m(L.location+He);i.bindBuffer(i.ARRAY_BUFFER,le);for(let He=0;He<L.locationSize;He++)x(L.location+He,X/L.locationSize,j,K,Te*oe,(ke+X/L.locationSize*He)*oe,xe)}else{if(k.isInstancedBufferAttribute){for(let me=0;me<L.locationSize;me++)f(L.location+me,k.meshPerAttribute);y.isInstancedMesh!==!0&&O._maxInstanceCount===void 0&&(O._maxInstanceCount=k.meshPerAttribute*k.count)}else for(let me=0;me<L.locationSize;me++)m(L.location+me);i.bindBuffer(i.ARRAY_BUFFER,le);for(let me=0;me<L.locationSize;me++)x(L.location+me,X/L.locationSize,j,K,X*oe,X/L.locationSize*me*oe,xe)}}else if(Z!==void 0){const K=Z[ce];if(K!==void 0)switch(K.length){case 2:i.vertexAttrib2fv(L.location,K);break;case 3:i.vertexAttrib3fv(L.location,K);break;case 4:i.vertexAttrib4fv(L.location,K);break;default:i.vertexAttrib1fv(L.location,K)}}}}M()}function D(){N();for(const y in n){const C=n[y];for(const q in C){const O=C[q];for(const $ in O)u(O[$].object),delete O[$];delete C[q]}delete n[y]}}function P(y){if(n[y.id]===void 0)return;const C=n[y.id];for(const q in C){const O=C[q];for(const $ in O)u(O[$].object),delete O[$];delete C[q]}delete n[y.id]}function T(y){for(const C in n){const q=n[C];if(q[y.id]===void 0)continue;const O=q[y.id];for(const $ in O)u(O[$].object),delete O[$];delete q[y.id]}}function N(){v(),o=!0,s!==r&&(s=r,c(s.object))}function v(){r.geometry=null,r.program=null,r.wireframe=!1}return{setup:a,reset:N,resetDefaultState:v,dispose:D,releaseStatesOfGeometry:P,releaseStatesOfProgram:T,initAttributes:b,enableAttribute:m,disableUnusedAttributes:M}}function Vg(i,e,t){let n;function r(c){n=c}function s(c,u){i.drawArrays(n,c,u),t.update(u,n,1)}function o(c,u,d){d!==0&&(i.drawArraysInstanced(n,c,u,d),t.update(u,n,d))}function a(c,u,d){if(d===0)return;e.get("WEBGL_multi_draw").multiDrawArraysWEBGL(n,c,0,u,0,d);let p=0;for(let g=0;g<d;g++)p+=u[g];t.update(p,n,1)}function l(c,u,d,h){if(d===0)return;const p=e.get("WEBGL_multi_draw");if(p===null)for(let g=0;g<c.length;g++)o(c[g],u[g],h[g]);else{p.multiDrawArraysInstancedWEBGL(n,c,0,u,0,h,0,d);let g=0;for(let b=0;b<d;b++)g+=u[b]*h[b];t.update(g,n,1)}}this.setMode=r,this.render=s,this.renderInstances=o,this.renderMultiDraw=a,this.renderMultiDrawInstances=l}function Wg(i,e,t,n){let r;function s(){if(r!==void 0)return r;if(e.has("EXT_texture_filter_anisotropic")===!0){const T=e.get("EXT_texture_filter_anisotropic");r=i.getParameter(T.MAX_TEXTURE_MAX_ANISOTROPY_EXT)}else r=0;return r}function o(T){return!(T!==ei&&n.convert(T)!==i.getParameter(i.IMPLEMENTATION_COLOR_READ_FORMAT))}function a(T){const N=T===uo&&(e.has("EXT_color_buffer_half_float")||e.has("EXT_color_buffer_float"));return!(T!==Xi&&n.convert(T)!==i.getParameter(i.IMPLEMENTATION_COLOR_READ_TYPE)&&T!==li&&!N)}function l(T){if(T==="highp"){if(i.getShaderPrecisionFormat(i.VERTEX_SHADER,i.HIGH_FLOAT).precision>0&&i.getShaderPrecisionFormat(i.FRAGMENT_SHADER,i.HIGH_FLOAT).precision>0)return"highp";T="mediump"}return T==="mediump"&&i.getShaderPrecisionFormat(i.VERTEX_SHADER,i.MEDIUM_FLOAT).precision>0&&i.getShaderPrecisionFormat(i.FRAGMENT_SHADER,i.MEDIUM_FLOAT).precision>0?"mediump":"lowp"}let c=t.precision!==void 0?t.precision:"highp";const u=l(c);u!==c&&(console.warn("THREE.WebGLRenderer:",c,"not supported, using",u,"instead."),c=u);const d=t.logarithmicDepthBuffer===!0,h=t.reverseDepthBuffer===!0&&e.has("EXT_clip_control"),p=i.getParameter(i.MAX_TEXTURE_IMAGE_UNITS),g=i.getParameter(i.MAX_VERTEX_TEXTURE_IMAGE_UNITS),b=i.getParameter(i.MAX_TEXTURE_SIZE),m=i.getParameter(i.MAX_CUBE_MAP_TEXTURE_SIZE),f=i.getParameter(i.MAX_VERTEX_ATTRIBS),M=i.getParameter(i.MAX_VERTEX_UNIFORM_VECTORS),x=i.getParameter(i.MAX_VARYING_VECTORS),_=i.getParameter(i.MAX_FRAGMENT_UNIFORM_VECTORS),D=g>0,P=i.getParameter(i.MAX_SAMPLES);return{isWebGL2:!0,getMaxAnisotropy:s,getMaxPrecision:l,textureFormatReadable:o,textureTypeReadable:a,precision:c,logarithmicDepthBuffer:d,reverseDepthBuffer:h,maxTextures:p,maxVertexTextures:g,maxTextureSize:b,maxCubemapSize:m,maxAttributes:f,maxVertexUniforms:M,maxVaryings:x,maxFragmentUniforms:_,vertexTextures:D,maxSamples:P}}function qg(i){const e=this;let t=null,n=0,r=!1,s=!1;const o=new sr,a=new Mt,l={value:null,needsUpdate:!1};this.uniform=l,this.numPlanes=0,this.numIntersection=0,this.init=function(d,h){const p=d.length!==0||h||n!==0||r;return r=h,n=d.length,p},this.beginShadows=function(){s=!0,u(null)},this.endShadows=function(){s=!1},this.setGlobalState=function(d,h){t=u(d,h,0)},this.setState=function(d,h,p){const g=d.clippingPlanes,b=d.clipIntersection,m=d.clipShadows,f=i.get(d);if(!r||g===null||g.length===0||s&&!m)s?u(null):c();else{const M=s?0:n,x=M*4;let _=f.clippingState||null;l.value=_,_=u(g,h,x,p);for(let D=0;D!==x;++D)_[D]=t[D];f.clippingState=_,this.numIntersection=b?this.numPlanes:0,this.numPlanes+=M}};function c(){l.value!==t&&(l.value=t,l.needsUpdate=n>0),e.numPlanes=n,e.numIntersection=0}function u(d,h,p,g){const b=d!==null?d.length:0;let m=null;if(b!==0){if(m=l.value,g!==!0||m===null){const f=p+b*4,M=h.matrixWorldInverse;a.getNormalMatrix(M),(m===null||m.length<f)&&(m=new Float32Array(f));for(let x=0,_=p;x!==b;++x,_+=4)o.copy(d[x]).applyMatrix4(M,a),o.normal.toArray(m,_),m[_+3]=o.constant}l.value=m,l.needsUpdate=!0}return e.numPlanes=b,e.numIntersection=0,m}}function jg(i){let e=new WeakMap;function t(o,a){return a===jc?o.mapping=gs:a===Xc&&(o.mapping=bs),o}function n(o){if(o&&o.isTexture){const a=o.mapping;if(a===jc||a===Xc)if(e.has(o)){const l=e.get(o).texture;return t(l,o.mapping)}else{const l=o.image;if(l&&l.height>0){const c=new im(l.height);return c.fromEquirectangularTexture(i,o),e.set(o,c),o.addEventListener("dispose",r),t(c.texture,o.mapping)}else return null}}return o}function r(o){const a=o.target;a.removeEventListener("dispose",r);const l=e.get(a);l!==void 0&&(e.delete(a),l.dispose())}function s(){e=new WeakMap}return{get:n,dispose:s}}class Ql extends Ph{constructor(e=-1,t=1,n=1,r=-1,s=.1,o=2e3){super(),this.isOrthographicCamera=!0,this.type="OrthographicCamera",this.zoom=1,this.view=null,this.left=e,this.right=t,this.top=n,this.bottom=r,this.near=s,this.far=o,this.updateProjectionMatrix()}copy(e,t){return super.copy(e,t),this.left=e.left,this.right=e.right,this.top=e.top,this.bottom=e.bottom,this.near=e.near,this.far=e.far,this.zoom=e.zoom,this.view=e.view===null?null:Object.assign({},e.view),this}setViewOffset(e,t,n,r,s,o){this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=e,this.view.fullHeight=t,this.view.offsetX=n,this.view.offsetY=r,this.view.width=s,this.view.height=o,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const e=(this.right-this.left)/(2*this.zoom),t=(this.top-this.bottom)/(2*this.zoom),n=(this.right+this.left)/2,r=(this.top+this.bottom)/2;let s=n-e,o=n+e,a=r+t,l=r-t;if(this.view!==null&&this.view.enabled){const c=(this.right-this.left)/this.view.fullWidth/this.zoom,u=(this.top-this.bottom)/this.view.fullHeight/this.zoom;s+=c*this.view.offsetX,o=s+c*this.view.width,a-=u*this.view.offsetY,l=a-u*this.view.height}this.projectionMatrix.makeOrthographic(s,o,a,l,this.near,this.far,this.coordinateSystem),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(e){const t=super.toJSON(e);return t.object.zoom=this.zoom,t.object.left=this.left,t.object.right=this.right,t.object.top=this.top,t.object.bottom=this.bottom,t.object.near=this.near,t.object.far=this.far,this.view!==null&&(t.object.view=Object.assign({},this.view)),t}}const rs=4,Vu=[.125,.215,.35,.446,.526,.582],Pr=20,cc=new Ql,Wu=new rt;let lc=null,uc=0,dc=0,hc=!1;const Tr=(1+Math.sqrt(5))/2,Yr=1/Tr,qu=[new A(-Tr,Yr,0),new A(Tr,Yr,0),new A(-Yr,0,Tr),new A(Yr,0,Tr),new A(0,Tr,-Yr),new A(0,Tr,Yr),new A(-1,1,-1),new A(1,1,-1),new A(-1,1,1),new A(1,1,1)];class Ml{constructor(e){this._renderer=e,this._pingPongRenderTarget=null,this._lodMax=0,this._cubeSize=0,this._lodPlanes=[],this._sizeLods=[],this._sigmas=[],this._blurMaterial=null,this._cubemapMaterial=null,this._equirectMaterial=null,this._compileMaterial(this._blurMaterial)}fromScene(e,t=0,n=.1,r=100){lc=this._renderer.getRenderTarget(),uc=this._renderer.getActiveCubeFace(),dc=this._renderer.getActiveMipmapLevel(),hc=this._renderer.xr.enabled,this._renderer.xr.enabled=!1,this._setSize(256);const s=this._allocateTargets();return s.depthBuffer=!0,this._sceneToCubeUV(e,n,r,s),t>0&&this._blur(s,0,0,t),this._applyPMREM(s),this._cleanup(s),s}fromEquirectangular(e,t=null){return this._fromTexture(e,t)}fromCubemap(e,t=null){return this._fromTexture(e,t)}compileCubemapShader(){this._cubemapMaterial===null&&(this._cubemapMaterial=Qu(),this._compileMaterial(this._cubemapMaterial))}compileEquirectangularShader(){this._equirectMaterial===null&&(this._equirectMaterial=Xu(),this._compileMaterial(this._equirectMaterial))}dispose(){this._dispose(),this._cubemapMaterial!==null&&this._cubemapMaterial.dispose(),this._equirectMaterial!==null&&this._equirectMaterial.dispose()}_setSize(e){this._lodMax=Math.floor(Math.log2(e)),this._cubeSize=Math.pow(2,this._lodMax)}_dispose(){this._blurMaterial!==null&&this._blurMaterial.dispose(),this._pingPongRenderTarget!==null&&this._pingPongRenderTarget.dispose();for(let e=0;e<this._lodPlanes.length;e++)this._lodPlanes[e].dispose()}_cleanup(e){this._renderer.setRenderTarget(lc,uc,dc),this._renderer.xr.enabled=hc,e.scissorTest=!1,Uo(e,0,0,e.width,e.height)}_fromTexture(e,t){e.mapping===gs||e.mapping===bs?this._setSize(e.image.length===0?16:e.image[0].width||e.image[0].image.width):this._setSize(e.image.width/4),lc=this._renderer.getRenderTarget(),uc=this._renderer.getActiveCubeFace(),dc=this._renderer.getActiveMipmapLevel(),hc=this._renderer.xr.enabled,this._renderer.xr.enabled=!1;const n=t||this._allocateTargets();return this._textureToCubeUV(e,n),this._applyPMREM(n),this._cleanup(n),n}_allocateTargets(){const e=3*Math.max(this._cubeSize,112),t=4*this._cubeSize,n={magFilter:jn,minFilter:jn,generateMipmaps:!1,type:uo,format:ei,colorSpace:Ln,depthBuffer:!1},r=ju(e,t,n);if(this._pingPongRenderTarget===null||this._pingPongRenderTarget.width!==e||this._pingPongRenderTarget.height!==t){this._pingPongRenderTarget!==null&&this._dispose(),this._pingPongRenderTarget=ju(e,t,n);const{_lodMax:s}=this;({sizeLods:this._sizeLods,lodPlanes:this._lodPlanes,sigmas:this._sigmas}=Xg(s)),this._blurMaterial=Qg(s,e,t)}return r}_compileMaterial(e){const t=new Xt(this._lodPlanes[0],e);this._renderer.compile(t,cc)}_sceneToCubeUV(e,t,n,r){const a=new vn(90,1,t,n),l=[1,-1,1,1,1,1],c=[1,1,1,-1,-1,-1],u=this._renderer,d=u.autoClear,h=u.toneMapping;u.getClearColor(Wu),u.toneMapping=dr,u.autoClear=!1;const p=new Gi({name:"PMREM.Background",side:Cn,depthWrite:!1,depthTest:!1}),g=new Xt(new Cs,p);let b=!1;const m=e.background;m?m.isColor&&(p.color.copy(m),e.background=null,b=!0):(p.color.copy(Wu),b=!0);for(let f=0;f<6;f++){const M=f%3;M===0?(a.up.set(0,l[f],0),a.lookAt(c[f],0,0)):M===1?(a.up.set(0,0,l[f]),a.lookAt(0,c[f],0)):(a.up.set(0,l[f],0),a.lookAt(0,0,c[f]));const x=this._cubeSize;Uo(r,M*x,f>2?x:0,x,x),u.setRenderTarget(r),b&&u.render(g,a),u.render(e,a)}g.geometry.dispose(),g.material.dispose(),u.toneMapping=h,u.autoClear=d,e.background=m}_textureToCubeUV(e,t){const n=this._renderer,r=e.mapping===gs||e.mapping===bs;r?(this._cubemapMaterial===null&&(this._cubemapMaterial=Qu()),this._cubemapMaterial.uniforms.flipEnvMap.value=e.isRenderTargetTexture===!1?-1:1):this._equirectMaterial===null&&(this._equirectMaterial=Xu());const s=r?this._cubemapMaterial:this._equirectMaterial,o=new Xt(this._lodPlanes[0],s),a=s.uniforms;a.envMap.value=e;const l=this._cubeSize;Uo(t,0,0,3*l,2*l),n.setRenderTarget(t),n.render(o,cc)}_applyPMREM(e){const t=this._renderer,n=t.autoClear;t.autoClear=!1;const r=this._lodPlanes.length;for(let s=1;s<r;s++){const o=Math.sqrt(this._sigmas[s]*this._sigmas[s]-this._sigmas[s-1]*this._sigmas[s-1]),a=qu[(r-s-1)%qu.length];this._blur(e,s-1,s,o,a)}t.autoClear=n}_blur(e,t,n,r,s){const o=this._pingPongRenderTarget;this._halfBlur(e,o,t,n,r,"latitudinal",s),this._halfBlur(o,e,n,n,r,"longitudinal",s)}_halfBlur(e,t,n,r,s,o,a){const l=this._renderer,c=this._blurMaterial;o!=="latitudinal"&&o!=="longitudinal"&&console.error("blur direction must be either latitudinal or longitudinal!");const u=3,d=new Xt(this._lodPlanes[r],c),h=c.uniforms,p=this._sizeLods[n]-1,g=isFinite(s)?Math.PI/(2*p):2*Math.PI/(2*Pr-1),b=s/g,m=isFinite(s)?1+Math.floor(u*b):Pr;m>Pr&&console.warn(`sigmaRadians, ${s}, is too large and will clip, as it requested ${m} samples when the maximum is set to ${Pr}`);const f=[];let M=0;for(let T=0;T<Pr;++T){const N=T/b,v=Math.exp(-N*N/2);f.push(v),T===0?M+=v:T<m&&(M+=2*v)}for(let T=0;T<f.length;T++)f[T]=f[T]/M;h.envMap.value=e.texture,h.samples.value=m,h.weights.value=f,h.latitudinal.value=o==="latitudinal",a&&(h.poleAxis.value=a);const{_lodMax:x}=this;h.dTheta.value=g,h.mipInt.value=x-n;const _=this._sizeLods[r],D=3*_*(r>x-rs?r-x+rs:0),P=4*(this._cubeSize-_);Uo(t,D,P,3*_,2*_),l.setRenderTarget(t),l.render(d,cc)}}function Xg(i){const e=[],t=[],n=[];let r=i;const s=i-rs+1+Vu.length;for(let o=0;o<s;o++){const a=Math.pow(2,r);t.push(a);let l=1/a;o>i-rs?l=Vu[o-i+rs-1]:o===0&&(l=0),n.push(l);const c=1/(a-2),u=-c,d=1+c,h=[u,u,d,u,d,d,u,u,d,d,u,d],p=6,g=6,b=3,m=2,f=1,M=new Float32Array(b*g*p),x=new Float32Array(m*g*p),_=new Float32Array(f*g*p);for(let P=0;P<p;P++){const T=P%3*2/3-1,N=P>2?0:-1,v=[T,N,0,T+2/3,N,0,T+2/3,N+1,0,T,N,0,T+2/3,N+1,0,T,N+1,0];M.set(v,b*g*P),x.set(h,m*g*P);const y=[P,P,P,P,P,P];_.set(y,f*g*P)}const D=new Ei;D.setAttribute("position",new yn(M,b)),D.setAttribute("uv",new yn(x,m)),D.setAttribute("faceIndex",new yn(_,f)),e.push(D),r>rs&&r--}return{lodPlanes:e,sizeLods:t,sigmas:n}}function ju(i,e,t){const n=new hr(i,e,t);return n.texture.mapping=Ta,n.texture.name="PMREM.cubeUv",n.scissorTest=!0,n}function Uo(i,e,t,n,r){i.viewport.set(e,t,n,r),i.scissor.set(e,t,n,r)}function Qg(i,e,t){const n=new Float32Array(Pr),r=new A(0,1,0);return new fr({name:"SphericalGaussianBlur",defines:{n:Pr,CUBEUV_TEXEL_WIDTH:1/e,CUBEUV_TEXEL_HEIGHT:1/t,CUBEUV_MAX_MIP:`${i}.0`},uniforms:{envMap:{value:null},samples:{value:1},weights:{value:n},latitudinal:{value:!1},dTheta:{value:0},mipInt:{value:0},poleAxis:{value:r}},vertexShader:Kl(),fragmentShader:`

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
		`,blending:ur,depthTest:!1,depthWrite:!1})}function Xu(){return new fr({name:"EquirectangularToCubeUV",uniforms:{envMap:{value:null}},vertexShader:Kl(),fragmentShader:`

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
		`,blending:ur,depthTest:!1,depthWrite:!1})}function Qu(){return new fr({name:"CubemapToCubeUV",uniforms:{envMap:{value:null},flipEnvMap:{value:-1}},vertexShader:Kl(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			uniform float flipEnvMap;

			varying vec3 vOutputDirection;

			uniform samplerCube envMap;

			void main() {

				gl_FragColor = textureCube( envMap, vec3( flipEnvMap * vOutputDirection.x, vOutputDirection.yz ) );

			}
		`,blending:ur,depthTest:!1,depthWrite:!1})}function Kl(){return`

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
	`}function Kg(i){let e=new WeakMap,t=null;function n(a){if(a&&a.isTexture){const l=a.mapping,c=l===jc||l===Xc,u=l===gs||l===bs;if(c||u){let d=e.get(a);const h=d!==void 0?d.texture.pmremVersion:0;if(a.isRenderTargetTexture&&a.pmremVersion!==h)return t===null&&(t=new Ml(i)),d=c?t.fromEquirectangular(a,d):t.fromCubemap(a,d),d.texture.pmremVersion=a.pmremVersion,e.set(a,d),d.texture;if(d!==void 0)return d.texture;{const p=a.image;return c&&p&&p.height>0||u&&p&&r(p)?(t===null&&(t=new Ml(i)),d=c?t.fromEquirectangular(a):t.fromCubemap(a),d.texture.pmremVersion=a.pmremVersion,e.set(a,d),a.addEventListener("dispose",s),d.texture):null}}}return a}function r(a){let l=0;const c=6;for(let u=0;u<c;u++)a[u]!==void 0&&l++;return l===c}function s(a){const l=a.target;l.removeEventListener("dispose",s);const c=e.get(l);c!==void 0&&(e.delete(l),c.dispose())}function o(){e=new WeakMap,t!==null&&(t.dispose(),t=null)}return{get:n,dispose:o}}function Yg(i){const e={};function t(n){if(e[n]!==void 0)return e[n];let r;switch(n){case"WEBGL_depth_texture":r=i.getExtension("WEBGL_depth_texture")||i.getExtension("MOZ_WEBGL_depth_texture")||i.getExtension("WEBKIT_WEBGL_depth_texture");break;case"EXT_texture_filter_anisotropic":r=i.getExtension("EXT_texture_filter_anisotropic")||i.getExtension("MOZ_EXT_texture_filter_anisotropic")||i.getExtension("WEBKIT_EXT_texture_filter_anisotropic");break;case"WEBGL_compressed_texture_s3tc":r=i.getExtension("WEBGL_compressed_texture_s3tc")||i.getExtension("MOZ_WEBGL_compressed_texture_s3tc")||i.getExtension("WEBKIT_WEBGL_compressed_texture_s3tc");break;case"WEBGL_compressed_texture_pvrtc":r=i.getExtension("WEBGL_compressed_texture_pvrtc")||i.getExtension("WEBKIT_WEBGL_compressed_texture_pvrtc");break;default:r=i.getExtension(n)}return e[n]=r,r}return{has:function(n){return t(n)!==null},init:function(){t("EXT_color_buffer_float"),t("WEBGL_clip_cull_distance"),t("OES_texture_float_linear"),t("EXT_color_buffer_half_float"),t("WEBGL_multisampled_render_to_texture"),t("WEBGL_render_shared_exponent")},get:function(n){const r=t(n);return r===null&&Ys("THREE.WebGLRenderer: "+n+" extension not supported."),r}}}function $g(i,e,t,n){const r={},s=new WeakMap;function o(d){const h=d.target;h.index!==null&&e.remove(h.index);for(const g in h.attributes)e.remove(h.attributes[g]);for(const g in h.morphAttributes){const b=h.morphAttributes[g];for(let m=0,f=b.length;m<f;m++)e.remove(b[m])}h.removeEventListener("dispose",o),delete r[h.id];const p=s.get(h);p&&(e.remove(p),s.delete(h)),n.releaseStatesOfGeometry(h),h.isInstancedBufferGeometry===!0&&delete h._maxInstanceCount,t.memory.geometries--}function a(d,h){return r[h.id]===!0||(h.addEventListener("dispose",o),r[h.id]=!0,t.memory.geometries++),h}function l(d){const h=d.attributes;for(const g in h)e.update(h[g],i.ARRAY_BUFFER);const p=d.morphAttributes;for(const g in p){const b=p[g];for(let m=0,f=b.length;m<f;m++)e.update(b[m],i.ARRAY_BUFFER)}}function c(d){const h=[],p=d.index,g=d.attributes.position;let b=0;if(p!==null){const M=p.array;b=p.version;for(let x=0,_=M.length;x<_;x+=3){const D=M[x+0],P=M[x+1],T=M[x+2];h.push(D,P,P,T,T,D)}}else if(g!==void 0){const M=g.array;b=g.version;for(let x=0,_=M.length/3-1;x<_;x+=3){const D=x+0,P=x+1,T=x+2;h.push(D,P,P,T,T,D)}}else return;const m=new(Sh(h)?Rh:Th)(h,1);m.version=b;const f=s.get(d);f&&e.remove(f),s.set(d,m)}function u(d){const h=s.get(d);if(h){const p=d.index;p!==null&&h.version<p.version&&c(d)}else c(d);return s.get(d)}return{get:a,update:l,getWireframeAttribute:u}}function Zg(i,e,t){let n;function r(h){n=h}let s,o;function a(h){s=h.type,o=h.bytesPerElement}function l(h,p){i.drawElements(n,p,s,h*o),t.update(p,n,1)}function c(h,p,g){g!==0&&(i.drawElementsInstanced(n,p,s,h*o,g),t.update(p,n,g))}function u(h,p,g){if(g===0)return;e.get("WEBGL_multi_draw").multiDrawElementsWEBGL(n,p,0,s,h,0,g);let m=0;for(let f=0;f<g;f++)m+=p[f];t.update(m,n,1)}function d(h,p,g,b){if(g===0)return;const m=e.get("WEBGL_multi_draw");if(m===null)for(let f=0;f<h.length;f++)c(h[f]/o,p[f],b[f]);else{m.multiDrawElementsInstancedWEBGL(n,p,0,s,h,0,b,0,g);let f=0;for(let M=0;M<g;M++)f+=p[M]*b[M];t.update(f,n,1)}}this.setMode=r,this.setIndex=a,this.render=l,this.renderInstances=c,this.renderMultiDraw=u,this.renderMultiDrawInstances=d}function Jg(i){const e={geometries:0,textures:0},t={frame:0,calls:0,triangles:0,points:0,lines:0};function n(s,o,a){switch(t.calls++,o){case i.TRIANGLES:t.triangles+=a*(s/3);break;case i.LINES:t.lines+=a*(s/2);break;case i.LINE_STRIP:t.lines+=a*(s-1);break;case i.LINE_LOOP:t.lines+=a*s;break;case i.POINTS:t.points+=a*s;break;default:console.error("THREE.WebGLInfo: Unknown draw mode:",o);break}}function r(){t.calls=0,t.triangles=0,t.points=0,t.lines=0}return{memory:e,render:t,programs:null,autoReset:!0,reset:r,update:n}}function eb(i,e,t){const n=new WeakMap,r=new mt;function s(o,a,l){const c=o.morphTargetInfluences,u=a.morphAttributes.position||a.morphAttributes.normal||a.morphAttributes.color,d=u!==void 0?u.length:0;let h=n.get(a);if(h===void 0||h.count!==d){let y=function(){N.dispose(),n.delete(a),a.removeEventListener("dispose",y)};var p=y;h!==void 0&&h.texture.dispose();const g=a.morphAttributes.position!==void 0,b=a.morphAttributes.normal!==void 0,m=a.morphAttributes.color!==void 0,f=a.morphAttributes.position||[],M=a.morphAttributes.normal||[],x=a.morphAttributes.color||[];let _=0;g===!0&&(_=1),b===!0&&(_=2),m===!0&&(_=3);let D=a.attributes.position.count*_,P=1;D>e.maxTextureSize&&(P=Math.ceil(D/e.maxTextureSize),D=e.maxTextureSize);const T=new Float32Array(D*P*4*d),N=new Eh(T,D,P,d);N.type=li,N.needsUpdate=!0;const v=_*4;for(let C=0;C<d;C++){const q=f[C],O=M[C],$=x[C],se=D*P*4*C;for(let Z=0;Z<q.count;Z++){const ce=Z*v;g===!0&&(r.fromBufferAttribute(q,Z),T[se+ce+0]=r.x,T[se+ce+1]=r.y,T[se+ce+2]=r.z,T[se+ce+3]=0),b===!0&&(r.fromBufferAttribute(O,Z),T[se+ce+4]=r.x,T[se+ce+5]=r.y,T[se+ce+6]=r.z,T[se+ce+7]=0),m===!0&&(r.fromBufferAttribute($,Z),T[se+ce+8]=r.x,T[se+ce+9]=r.y,T[se+ce+10]=r.z,T[se+ce+11]=$.itemSize===4?r.w:1)}}h={count:d,texture:N,size:new ut(D,P)},n.set(a,h),a.addEventListener("dispose",y)}if(o.isInstancedMesh===!0&&o.morphTexture!==null)l.getUniforms().setValue(i,"morphTexture",o.morphTexture,t);else{let g=0;for(let m=0;m<c.length;m++)g+=c[m];const b=a.morphTargetsRelative?1:1-g;l.getUniforms().setValue(i,"morphTargetBaseInfluence",b),l.getUniforms().setValue(i,"morphTargetInfluences",c)}l.getUniforms().setValue(i,"morphTargetsTexture",h.texture,t),l.getUniforms().setValue(i,"morphTargetsTextureSize",h.size)}return{update:s}}function tb(i,e,t,n){let r=new WeakMap;function s(l){const c=n.render.frame,u=l.geometry,d=e.get(l,u);if(r.get(d)!==c&&(e.update(d),r.set(d,c)),l.isInstancedMesh&&(l.hasEventListener("dispose",a)===!1&&l.addEventListener("dispose",a),r.get(l)!==c&&(t.update(l.instanceMatrix,i.ARRAY_BUFFER),l.instanceColor!==null&&t.update(l.instanceColor,i.ARRAY_BUFFER),r.set(l,c))),l.isSkinnedMesh){const h=l.skeleton;r.get(h)!==c&&(h.update(),r.set(h,c))}return d}function o(){r=new WeakMap}function a(l){const c=l.target;c.removeEventListener("dispose",a),t.remove(c.instanceMatrix),c.instanceColor!==null&&t.remove(c.instanceColor)}return{update:s,dispose:o}}class Ih extends un{constructor(e,t,n,r,s,o,a,l,c,u=cs){if(u!==cs&&u!==vs)throw new Error("DepthTexture format must be either THREE.DepthFormat or THREE.DepthStencilFormat");n===void 0&&u===cs&&(n=Fr),n===void 0&&u===vs&&(n=xs),super(null,r,s,o,a,l,u,n,c),this.isDepthTexture=!0,this.image={width:e,height:t},this.magFilter=a!==void 0?a:Pn,this.minFilter=l!==void 0?l:Pn,this.flipY=!1,this.generateMipmaps=!1,this.compareFunction=null}copy(e){return super.copy(e),this.compareFunction=e.compareFunction,this}toJSON(e){const t=super.toJSON(e);return this.compareFunction!==null&&(t.compareFunction=this.compareFunction),t}}const Fh=new un,Ku=new Ih(1,1),Nh=new Eh,Uh=new Hp,Oh=new Lh,Yu=[],$u=[],Zu=new Float32Array(16),Ju=new Float32Array(9),ed=new Float32Array(4);function Ls(i,e,t){const n=i[0];if(n<=0||n>0)return i;const r=e*t;let s=Yu[r];if(s===void 0&&(s=new Float32Array(r),Yu[r]=s),e!==0){n.toArray(s,0);for(let o=1,a=0;o!==e;++o)a+=t,i[o].toArray(s,a)}return s}function dn(i,e){if(i.length!==e.length)return!1;for(let t=0,n=i.length;t<n;t++)if(i[t]!==e[t])return!1;return!0}function hn(i,e){for(let t=0,n=e.length;t<n;t++)i[t]=e[t]}function Ca(i,e){let t=$u[e];t===void 0&&(t=new Int32Array(e),$u[e]=t);for(let n=0;n!==e;++n)t[n]=i.allocateTextureUnit();return t}function nb(i,e){const t=this.cache;t[0]!==e&&(i.uniform1f(this.addr,e),t[0]=e)}function ib(i,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(i.uniform2f(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(dn(t,e))return;i.uniform2fv(this.addr,e),hn(t,e)}}function rb(i,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(i.uniform3f(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else if(e.r!==void 0)(t[0]!==e.r||t[1]!==e.g||t[2]!==e.b)&&(i.uniform3f(this.addr,e.r,e.g,e.b),t[0]=e.r,t[1]=e.g,t[2]=e.b);else{if(dn(t,e))return;i.uniform3fv(this.addr,e),hn(t,e)}}function sb(i,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(i.uniform4f(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(dn(t,e))return;i.uniform4fv(this.addr,e),hn(t,e)}}function ob(i,e){const t=this.cache,n=e.elements;if(n===void 0){if(dn(t,e))return;i.uniformMatrix2fv(this.addr,!1,e),hn(t,e)}else{if(dn(t,n))return;ed.set(n),i.uniformMatrix2fv(this.addr,!1,ed),hn(t,n)}}function ab(i,e){const t=this.cache,n=e.elements;if(n===void 0){if(dn(t,e))return;i.uniformMatrix3fv(this.addr,!1,e),hn(t,e)}else{if(dn(t,n))return;Ju.set(n),i.uniformMatrix3fv(this.addr,!1,Ju),hn(t,n)}}function cb(i,e){const t=this.cache,n=e.elements;if(n===void 0){if(dn(t,e))return;i.uniformMatrix4fv(this.addr,!1,e),hn(t,e)}else{if(dn(t,n))return;Zu.set(n),i.uniformMatrix4fv(this.addr,!1,Zu),hn(t,n)}}function lb(i,e){const t=this.cache;t[0]!==e&&(i.uniform1i(this.addr,e),t[0]=e)}function ub(i,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(i.uniform2i(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(dn(t,e))return;i.uniform2iv(this.addr,e),hn(t,e)}}function db(i,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(i.uniform3i(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else{if(dn(t,e))return;i.uniform3iv(this.addr,e),hn(t,e)}}function hb(i,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(i.uniform4i(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(dn(t,e))return;i.uniform4iv(this.addr,e),hn(t,e)}}function fb(i,e){const t=this.cache;t[0]!==e&&(i.uniform1ui(this.addr,e),t[0]=e)}function pb(i,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(i.uniform2ui(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(dn(t,e))return;i.uniform2uiv(this.addr,e),hn(t,e)}}function mb(i,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(i.uniform3ui(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else{if(dn(t,e))return;i.uniform3uiv(this.addr,e),hn(t,e)}}function gb(i,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(i.uniform4ui(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(dn(t,e))return;i.uniform4uiv(this.addr,e),hn(t,e)}}function bb(i,e,t){const n=this.cache,r=t.allocateTextureUnit();n[0]!==r&&(i.uniform1i(this.addr,r),n[0]=r);let s;this.type===i.SAMPLER_2D_SHADOW?(Ku.compareFunction=Mh,s=Ku):s=Fh,t.setTexture2D(e||s,r)}function _b(i,e,t){const n=this.cache,r=t.allocateTextureUnit();n[0]!==r&&(i.uniform1i(this.addr,r),n[0]=r),t.setTexture3D(e||Uh,r)}function xb(i,e,t){const n=this.cache,r=t.allocateTextureUnit();n[0]!==r&&(i.uniform1i(this.addr,r),n[0]=r),t.setTextureCube(e||Oh,r)}function vb(i,e,t){const n=this.cache,r=t.allocateTextureUnit();n[0]!==r&&(i.uniform1i(this.addr,r),n[0]=r),t.setTexture2DArray(e||Nh,r)}function yb(i){switch(i){case 5126:return nb;case 35664:return ib;case 35665:return rb;case 35666:return sb;case 35674:return ob;case 35675:return ab;case 35676:return cb;case 5124:case 35670:return lb;case 35667:case 35671:return ub;case 35668:case 35672:return db;case 35669:case 35673:return hb;case 5125:return fb;case 36294:return pb;case 36295:return mb;case 36296:return gb;case 35678:case 36198:case 36298:case 36306:case 35682:return bb;case 35679:case 36299:case 36307:return _b;case 35680:case 36300:case 36308:case 36293:return xb;case 36289:case 36303:case 36311:case 36292:return vb}}function Mb(i,e){i.uniform1fv(this.addr,e)}function Sb(i,e){const t=Ls(e,this.size,2);i.uniform2fv(this.addr,t)}function wb(i,e){const t=Ls(e,this.size,3);i.uniform3fv(this.addr,t)}function Eb(i,e){const t=Ls(e,this.size,4);i.uniform4fv(this.addr,t)}function Ab(i,e){const t=Ls(e,this.size,4);i.uniformMatrix2fv(this.addr,!1,t)}function Tb(i,e){const t=Ls(e,this.size,9);i.uniformMatrix3fv(this.addr,!1,t)}function Rb(i,e){const t=Ls(e,this.size,16);i.uniformMatrix4fv(this.addr,!1,t)}function Cb(i,e){i.uniform1iv(this.addr,e)}function Pb(i,e){i.uniform2iv(this.addr,e)}function Lb(i,e){i.uniform3iv(this.addr,e)}function Db(i,e){i.uniform4iv(this.addr,e)}function Ib(i,e){i.uniform1uiv(this.addr,e)}function Fb(i,e){i.uniform2uiv(this.addr,e)}function Nb(i,e){i.uniform3uiv(this.addr,e)}function Ub(i,e){i.uniform4uiv(this.addr,e)}function Ob(i,e,t){const n=this.cache,r=e.length,s=Ca(t,r);dn(n,s)||(i.uniform1iv(this.addr,s),hn(n,s));for(let o=0;o!==r;++o)t.setTexture2D(e[o]||Fh,s[o])}function kb(i,e,t){const n=this.cache,r=e.length,s=Ca(t,r);dn(n,s)||(i.uniform1iv(this.addr,s),hn(n,s));for(let o=0;o!==r;++o)t.setTexture3D(e[o]||Uh,s[o])}function Bb(i,e,t){const n=this.cache,r=e.length,s=Ca(t,r);dn(n,s)||(i.uniform1iv(this.addr,s),hn(n,s));for(let o=0;o!==r;++o)t.setTextureCube(e[o]||Oh,s[o])}function zb(i,e,t){const n=this.cache,r=e.length,s=Ca(t,r);dn(n,s)||(i.uniform1iv(this.addr,s),hn(n,s));for(let o=0;o!==r;++o)t.setTexture2DArray(e[o]||Nh,s[o])}function Hb(i){switch(i){case 5126:return Mb;case 35664:return Sb;case 35665:return wb;case 35666:return Eb;case 35674:return Ab;case 35675:return Tb;case 35676:return Rb;case 5124:case 35670:return Cb;case 35667:case 35671:return Pb;case 35668:case 35672:return Lb;case 35669:case 35673:return Db;case 5125:return Ib;case 36294:return Fb;case 36295:return Nb;case 36296:return Ub;case 35678:case 36198:case 36298:case 36306:case 35682:return Ob;case 35679:case 36299:case 36307:return kb;case 35680:case 36300:case 36308:case 36293:return Bb;case 36289:case 36303:case 36311:case 36292:return zb}}class Gb{constructor(e,t,n){this.id=e,this.addr=n,this.cache=[],this.type=t.type,this.setValue=yb(t.type)}}class Vb{constructor(e,t,n){this.id=e,this.addr=n,this.cache=[],this.type=t.type,this.size=t.size,this.setValue=Hb(t.type)}}class Wb{constructor(e){this.id=e,this.seq=[],this.map={}}setValue(e,t,n){const r=this.seq;for(let s=0,o=r.length;s!==o;++s){const a=r[s];a.setValue(e,t[a.id],n)}}}const fc=/(\w+)(\])?(\[|\.)?/g;function td(i,e){i.seq.push(e),i.map[e.id]=e}function qb(i,e,t){const n=i.name,r=n.length;for(fc.lastIndex=0;;){const s=fc.exec(n),o=fc.lastIndex;let a=s[1];const l=s[2]==="]",c=s[3];if(l&&(a=a|0),c===void 0||c==="["&&o+2===r){td(t,c===void 0?new Gb(a,i,e):new Vb(a,i,e));break}else{let d=t.map[a];d===void 0&&(d=new Wb(a),td(t,d)),t=d}}}class ca{constructor(e,t){this.seq=[],this.map={};const n=e.getProgramParameter(t,e.ACTIVE_UNIFORMS);for(let r=0;r<n;++r){const s=e.getActiveUniform(t,r),o=e.getUniformLocation(t,s.name);qb(s,o,this)}}setValue(e,t,n,r){const s=this.map[t];s!==void 0&&s.setValue(e,n,r)}setOptional(e,t,n){const r=t[n];r!==void 0&&this.setValue(e,n,r)}static upload(e,t,n,r){for(let s=0,o=t.length;s!==o;++s){const a=t[s],l=n[a.id];l.needsUpdate!==!1&&a.setValue(e,l.value,r)}}static seqWithValue(e,t){const n=[];for(let r=0,s=e.length;r!==s;++r){const o=e[r];o.id in t&&n.push(o)}return n}}function nd(i,e,t){const n=i.createShader(e);return i.shaderSource(n,t),i.compileShader(n),n}const jb=37297;let Xb=0;function Qb(i,e){const t=i.split(`
`),n=[],r=Math.max(e-6,0),s=Math.min(e+6,t.length);for(let o=r;o<s;o++){const a=o+1;n.push(`${a===e?">":" "} ${a}: ${t[o]}`)}return n.join(`
`)}const id=new Mt;function Kb(i){Pt._getMatrix(id,Pt.workingColorSpace,i);const e=`mat3( ${id.elements.map(t=>t.toFixed(4))} )`;switch(Pt.getTransfer(i)){case Ra:return[e,"LinearTransferOETF"];case jt:return[e,"sRGBTransferOETF"];default:return console.warn("THREE.WebGLProgram: Unsupported color space: ",i),[e,"LinearTransferOETF"]}}function rd(i,e,t){const n=i.getShaderParameter(e,i.COMPILE_STATUS),r=i.getShaderInfoLog(e).trim();if(n&&r==="")return"";const s=/ERROR: 0:(\d+)/.exec(r);if(s){const o=parseInt(s[1]);return t.toUpperCase()+`

`+r+`

`+Qb(i.getShaderSource(e),o)}else return r}function Yb(i,e){const t=Kb(e);return[`vec4 ${i}( vec4 value ) {`,`	return ${t[1]}( vec4( value.rgb * ${t[0]}, value.a ) );`,"}"].join(`
`)}function $b(i,e){let t;switch(e){case Zf:t="Linear";break;case Jf:t="Reinhard";break;case ep:t="Cineon";break;case ch:t="ACESFilmic";break;case np:t="AgX";break;case ip:t="Neutral";break;case tp:t="Custom";break;default:console.warn("THREE.WebGLProgram: Unsupported toneMapping:",e),t="Linear"}return"vec3 "+i+"( vec3 color ) { return "+t+"ToneMapping( color ); }"}const Oo=new A;function Zb(){Pt.getLuminanceCoefficients(Oo);const i=Oo.x.toFixed(4),e=Oo.y.toFixed(4),t=Oo.z.toFixed(4);return["float luminance( const in vec3 rgb ) {",`	const vec3 weights = vec3( ${i}, ${e}, ${t} );`,"	return dot( weights, rgb );","}"].join(`
`)}function Jb(i){return[i.extensionClipCullDistance?"#extension GL_ANGLE_clip_cull_distance : require":"",i.extensionMultiDraw?"#extension GL_ANGLE_multi_draw : require":""].filter($s).join(`
`)}function e_(i){const e=[];for(const t in i){const n=i[t];n!==!1&&e.push("#define "+t+" "+n)}return e.join(`
`)}function t_(i,e){const t={},n=i.getProgramParameter(e,i.ACTIVE_ATTRIBUTES);for(let r=0;r<n;r++){const s=i.getActiveAttrib(e,r),o=s.name;let a=1;s.type===i.FLOAT_MAT2&&(a=2),s.type===i.FLOAT_MAT3&&(a=3),s.type===i.FLOAT_MAT4&&(a=4),t[o]={type:s.type,location:i.getAttribLocation(e,o),locationSize:a}}return t}function $s(i){return i!==""}function sd(i,e){const t=e.numSpotLightShadows+e.numSpotLightMaps-e.numSpotLightShadowsWithMaps;return i.replace(/NUM_DIR_LIGHTS/g,e.numDirLights).replace(/NUM_SPOT_LIGHTS/g,e.numSpotLights).replace(/NUM_SPOT_LIGHT_MAPS/g,e.numSpotLightMaps).replace(/NUM_SPOT_LIGHT_COORDS/g,t).replace(/NUM_RECT_AREA_LIGHTS/g,e.numRectAreaLights).replace(/NUM_POINT_LIGHTS/g,e.numPointLights).replace(/NUM_HEMI_LIGHTS/g,e.numHemiLights).replace(/NUM_DIR_LIGHT_SHADOWS/g,e.numDirLightShadows).replace(/NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS/g,e.numSpotLightShadowsWithMaps).replace(/NUM_SPOT_LIGHT_SHADOWS/g,e.numSpotLightShadows).replace(/NUM_POINT_LIGHT_SHADOWS/g,e.numPointLightShadows)}function od(i,e){return i.replace(/NUM_CLIPPING_PLANES/g,e.numClippingPlanes).replace(/UNION_CLIPPING_PLANES/g,e.numClippingPlanes-e.numClipIntersection)}const n_=/^[ \t]*#include +<([\w\d./]+)>/gm;function Sl(i){return i.replace(n_,r_)}const i_=new Map;function r_(i,e){let t=yt[e];if(t===void 0){const n=i_.get(e);if(n!==void 0)t=yt[n],console.warn('THREE.WebGLRenderer: Shader chunk "%s" has been deprecated. Use "%s" instead.',e,n);else throw new Error("Can not resolve #include <"+e+">")}return Sl(t)}const s_=/#pragma unroll_loop_start\s+for\s*\(\s*int\s+i\s*=\s*(\d+)\s*;\s*i\s*<\s*(\d+)\s*;\s*i\s*\+\+\s*\)\s*{([\s\S]+?)}\s+#pragma unroll_loop_end/g;function ad(i){return i.replace(s_,o_)}function o_(i,e,t,n){let r="";for(let s=parseInt(e);s<parseInt(t);s++)r+=n.replace(/\[\s*i\s*\]/g,"[ "+s+" ]").replace(/UNROLLED_LOOP_INDEX/g,s);return r}function cd(i){let e=`precision ${i.precision} float;
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
#define LOW_PRECISION`),e}function a_(i){let e="SHADOWMAP_TYPE_BASIC";return i.shadowMapType===sh?e="SHADOWMAP_TYPE_PCF":i.shadowMapType===oh?e="SHADOWMAP_TYPE_PCF_SOFT":i.shadowMapType===Ui&&(e="SHADOWMAP_TYPE_VSM"),e}function c_(i){let e="ENVMAP_TYPE_CUBE";if(i.envMap)switch(i.envMapMode){case gs:case bs:e="ENVMAP_TYPE_CUBE";break;case Ta:e="ENVMAP_TYPE_CUBE_UV";break}return e}function l_(i){let e="ENVMAP_MODE_REFLECTION";return i.envMap&&i.envMapMode===bs&&(e="ENVMAP_MODE_REFRACTION"),e}function u_(i){let e="ENVMAP_BLENDING_NONE";if(i.envMap)switch(i.combine){case ah:e="ENVMAP_BLENDING_MULTIPLY";break;case Yf:e="ENVMAP_BLENDING_MIX";break;case $f:e="ENVMAP_BLENDING_ADD";break}return e}function d_(i){const e=i.envMapCubeUVHeight;if(e===null)return null;const t=Math.log2(e)-2,n=1/e;return{texelWidth:1/(3*Math.max(Math.pow(2,t),112)),texelHeight:n,maxMip:t}}function h_(i,e,t,n){const r=i.getContext(),s=t.defines;let o=t.vertexShader,a=t.fragmentShader;const l=a_(t),c=c_(t),u=l_(t),d=u_(t),h=d_(t),p=Jb(t),g=e_(s),b=r.createProgram();let m,f,M=t.glslVersion?"#version "+t.glslVersion+`
`:"";t.isRawShaderMaterial?(m=["#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,g].filter($s).join(`
`),m.length>0&&(m+=`
`),f=["#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,g].filter($s).join(`
`),f.length>0&&(f+=`
`)):(m=[cd(t),"#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,g,t.extensionClipCullDistance?"#define USE_CLIP_DISTANCE":"",t.batching?"#define USE_BATCHING":"",t.batchingColor?"#define USE_BATCHING_COLOR":"",t.instancing?"#define USE_INSTANCING":"",t.instancingColor?"#define USE_INSTANCING_COLOR":"",t.instancingMorph?"#define USE_INSTANCING_MORPH":"",t.useFog&&t.fog?"#define USE_FOG":"",t.useFog&&t.fogExp2?"#define FOG_EXP2":"",t.map?"#define USE_MAP":"",t.envMap?"#define USE_ENVMAP":"",t.envMap?"#define "+u:"",t.lightMap?"#define USE_LIGHTMAP":"",t.aoMap?"#define USE_AOMAP":"",t.bumpMap?"#define USE_BUMPMAP":"",t.normalMap?"#define USE_NORMALMAP":"",t.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",t.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",t.displacementMap?"#define USE_DISPLACEMENTMAP":"",t.emissiveMap?"#define USE_EMISSIVEMAP":"",t.anisotropy?"#define USE_ANISOTROPY":"",t.anisotropyMap?"#define USE_ANISOTROPYMAP":"",t.clearcoatMap?"#define USE_CLEARCOATMAP":"",t.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",t.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",t.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",t.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",t.specularMap?"#define USE_SPECULARMAP":"",t.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",t.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",t.roughnessMap?"#define USE_ROUGHNESSMAP":"",t.metalnessMap?"#define USE_METALNESSMAP":"",t.alphaMap?"#define USE_ALPHAMAP":"",t.alphaHash?"#define USE_ALPHAHASH":"",t.transmission?"#define USE_TRANSMISSION":"",t.transmissionMap?"#define USE_TRANSMISSIONMAP":"",t.thicknessMap?"#define USE_THICKNESSMAP":"",t.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",t.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",t.mapUv?"#define MAP_UV "+t.mapUv:"",t.alphaMapUv?"#define ALPHAMAP_UV "+t.alphaMapUv:"",t.lightMapUv?"#define LIGHTMAP_UV "+t.lightMapUv:"",t.aoMapUv?"#define AOMAP_UV "+t.aoMapUv:"",t.emissiveMapUv?"#define EMISSIVEMAP_UV "+t.emissiveMapUv:"",t.bumpMapUv?"#define BUMPMAP_UV "+t.bumpMapUv:"",t.normalMapUv?"#define NORMALMAP_UV "+t.normalMapUv:"",t.displacementMapUv?"#define DISPLACEMENTMAP_UV "+t.displacementMapUv:"",t.metalnessMapUv?"#define METALNESSMAP_UV "+t.metalnessMapUv:"",t.roughnessMapUv?"#define ROUGHNESSMAP_UV "+t.roughnessMapUv:"",t.anisotropyMapUv?"#define ANISOTROPYMAP_UV "+t.anisotropyMapUv:"",t.clearcoatMapUv?"#define CLEARCOATMAP_UV "+t.clearcoatMapUv:"",t.clearcoatNormalMapUv?"#define CLEARCOAT_NORMALMAP_UV "+t.clearcoatNormalMapUv:"",t.clearcoatRoughnessMapUv?"#define CLEARCOAT_ROUGHNESSMAP_UV "+t.clearcoatRoughnessMapUv:"",t.iridescenceMapUv?"#define IRIDESCENCEMAP_UV "+t.iridescenceMapUv:"",t.iridescenceThicknessMapUv?"#define IRIDESCENCE_THICKNESSMAP_UV "+t.iridescenceThicknessMapUv:"",t.sheenColorMapUv?"#define SHEEN_COLORMAP_UV "+t.sheenColorMapUv:"",t.sheenRoughnessMapUv?"#define SHEEN_ROUGHNESSMAP_UV "+t.sheenRoughnessMapUv:"",t.specularMapUv?"#define SPECULARMAP_UV "+t.specularMapUv:"",t.specularColorMapUv?"#define SPECULAR_COLORMAP_UV "+t.specularColorMapUv:"",t.specularIntensityMapUv?"#define SPECULAR_INTENSITYMAP_UV "+t.specularIntensityMapUv:"",t.transmissionMapUv?"#define TRANSMISSIONMAP_UV "+t.transmissionMapUv:"",t.thicknessMapUv?"#define THICKNESSMAP_UV "+t.thicknessMapUv:"",t.vertexTangents&&t.flatShading===!1?"#define USE_TANGENT":"",t.vertexColors?"#define USE_COLOR":"",t.vertexAlphas?"#define USE_COLOR_ALPHA":"",t.vertexUv1s?"#define USE_UV1":"",t.vertexUv2s?"#define USE_UV2":"",t.vertexUv3s?"#define USE_UV3":"",t.pointsUvs?"#define USE_POINTS_UV":"",t.flatShading?"#define FLAT_SHADED":"",t.skinning?"#define USE_SKINNING":"",t.morphTargets?"#define USE_MORPHTARGETS":"",t.morphNormals&&t.flatShading===!1?"#define USE_MORPHNORMALS":"",t.morphColors?"#define USE_MORPHCOLORS":"",t.morphTargetsCount>0?"#define MORPHTARGETS_TEXTURE_STRIDE "+t.morphTextureStride:"",t.morphTargetsCount>0?"#define MORPHTARGETS_COUNT "+t.morphTargetsCount:"",t.doubleSided?"#define DOUBLE_SIDED":"",t.flipSided?"#define FLIP_SIDED":"",t.shadowMapEnabled?"#define USE_SHADOWMAP":"",t.shadowMapEnabled?"#define "+l:"",t.sizeAttenuation?"#define USE_SIZEATTENUATION":"",t.numLightProbes>0?"#define USE_LIGHT_PROBES":"",t.logarithmicDepthBuffer?"#define USE_LOGDEPTHBUF":"",t.reverseDepthBuffer?"#define USE_REVERSEDEPTHBUF":"","uniform mat4 modelMatrix;","uniform mat4 modelViewMatrix;","uniform mat4 projectionMatrix;","uniform mat4 viewMatrix;","uniform mat3 normalMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;","#ifdef USE_INSTANCING","	attribute mat4 instanceMatrix;","#endif","#ifdef USE_INSTANCING_COLOR","	attribute vec3 instanceColor;","#endif","#ifdef USE_INSTANCING_MORPH","	uniform sampler2D morphTexture;","#endif","attribute vec3 position;","attribute vec3 normal;","attribute vec2 uv;","#ifdef USE_UV1","	attribute vec2 uv1;","#endif","#ifdef USE_UV2","	attribute vec2 uv2;","#endif","#ifdef USE_UV3","	attribute vec2 uv3;","#endif","#ifdef USE_TANGENT","	attribute vec4 tangent;","#endif","#if defined( USE_COLOR_ALPHA )","	attribute vec4 color;","#elif defined( USE_COLOR )","	attribute vec3 color;","#endif","#ifdef USE_SKINNING","	attribute vec4 skinIndex;","	attribute vec4 skinWeight;","#endif",`
`].filter($s).join(`
`),f=[cd(t),"#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,g,t.useFog&&t.fog?"#define USE_FOG":"",t.useFog&&t.fogExp2?"#define FOG_EXP2":"",t.alphaToCoverage?"#define ALPHA_TO_COVERAGE":"",t.map?"#define USE_MAP":"",t.matcap?"#define USE_MATCAP":"",t.envMap?"#define USE_ENVMAP":"",t.envMap?"#define "+c:"",t.envMap?"#define "+u:"",t.envMap?"#define "+d:"",h?"#define CUBEUV_TEXEL_WIDTH "+h.texelWidth:"",h?"#define CUBEUV_TEXEL_HEIGHT "+h.texelHeight:"",h?"#define CUBEUV_MAX_MIP "+h.maxMip+".0":"",t.lightMap?"#define USE_LIGHTMAP":"",t.aoMap?"#define USE_AOMAP":"",t.bumpMap?"#define USE_BUMPMAP":"",t.normalMap?"#define USE_NORMALMAP":"",t.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",t.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",t.emissiveMap?"#define USE_EMISSIVEMAP":"",t.anisotropy?"#define USE_ANISOTROPY":"",t.anisotropyMap?"#define USE_ANISOTROPYMAP":"",t.clearcoat?"#define USE_CLEARCOAT":"",t.clearcoatMap?"#define USE_CLEARCOATMAP":"",t.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",t.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",t.dispersion?"#define USE_DISPERSION":"",t.iridescence?"#define USE_IRIDESCENCE":"",t.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",t.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",t.specularMap?"#define USE_SPECULARMAP":"",t.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",t.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",t.roughnessMap?"#define USE_ROUGHNESSMAP":"",t.metalnessMap?"#define USE_METALNESSMAP":"",t.alphaMap?"#define USE_ALPHAMAP":"",t.alphaTest?"#define USE_ALPHATEST":"",t.alphaHash?"#define USE_ALPHAHASH":"",t.sheen?"#define USE_SHEEN":"",t.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",t.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",t.transmission?"#define USE_TRANSMISSION":"",t.transmissionMap?"#define USE_TRANSMISSIONMAP":"",t.thicknessMap?"#define USE_THICKNESSMAP":"",t.vertexTangents&&t.flatShading===!1?"#define USE_TANGENT":"",t.vertexColors||t.instancingColor||t.batchingColor?"#define USE_COLOR":"",t.vertexAlphas?"#define USE_COLOR_ALPHA":"",t.vertexUv1s?"#define USE_UV1":"",t.vertexUv2s?"#define USE_UV2":"",t.vertexUv3s?"#define USE_UV3":"",t.pointsUvs?"#define USE_POINTS_UV":"",t.gradientMap?"#define USE_GRADIENTMAP":"",t.flatShading?"#define FLAT_SHADED":"",t.doubleSided?"#define DOUBLE_SIDED":"",t.flipSided?"#define FLIP_SIDED":"",t.shadowMapEnabled?"#define USE_SHADOWMAP":"",t.shadowMapEnabled?"#define "+l:"",t.premultipliedAlpha?"#define PREMULTIPLIED_ALPHA":"",t.numLightProbes>0?"#define USE_LIGHT_PROBES":"",t.decodeVideoTexture?"#define DECODE_VIDEO_TEXTURE":"",t.decodeVideoTextureEmissive?"#define DECODE_VIDEO_TEXTURE_EMISSIVE":"",t.logarithmicDepthBuffer?"#define USE_LOGDEPTHBUF":"",t.reverseDepthBuffer?"#define USE_REVERSEDEPTHBUF":"","uniform mat4 viewMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;",t.toneMapping!==dr?"#define TONE_MAPPING":"",t.toneMapping!==dr?yt.tonemapping_pars_fragment:"",t.toneMapping!==dr?$b("toneMapping",t.toneMapping):"",t.dithering?"#define DITHERING":"",t.opaque?"#define OPAQUE":"",yt.colorspace_pars_fragment,Yb("linearToOutputTexel",t.outputColorSpace),Zb(),t.useDepthPacking?"#define DEPTH_PACKING "+t.depthPacking:"",`
`].filter($s).join(`
`)),o=Sl(o),o=sd(o,t),o=od(o,t),a=Sl(a),a=sd(a,t),a=od(a,t),o=ad(o),a=ad(a),t.isRawShaderMaterial!==!0&&(M=`#version 300 es
`,m=[p,"#define attribute in","#define varying out","#define texture2D texture"].join(`
`)+`
`+m,f=["#define varying in",t.glslVersion===yu?"":"layout(location = 0) out highp vec4 pc_fragColor;",t.glslVersion===yu?"":"#define gl_FragColor pc_fragColor","#define gl_FragDepthEXT gl_FragDepth","#define texture2D texture","#define textureCube texture","#define texture2DProj textureProj","#define texture2DLodEXT textureLod","#define texture2DProjLodEXT textureProjLod","#define textureCubeLodEXT textureLod","#define texture2DGradEXT textureGrad","#define texture2DProjGradEXT textureProjGrad","#define textureCubeGradEXT textureGrad"].join(`
`)+`
`+f);const x=M+m+o,_=M+f+a,D=nd(r,r.VERTEX_SHADER,x),P=nd(r,r.FRAGMENT_SHADER,_);r.attachShader(b,D),r.attachShader(b,P),t.index0AttributeName!==void 0?r.bindAttribLocation(b,0,t.index0AttributeName):t.morphTargets===!0&&r.bindAttribLocation(b,0,"position"),r.linkProgram(b);function T(C){if(i.debug.checkShaderErrors){const q=r.getProgramInfoLog(b).trim(),O=r.getShaderInfoLog(D).trim(),$=r.getShaderInfoLog(P).trim();let se=!0,Z=!0;if(r.getProgramParameter(b,r.LINK_STATUS)===!1)if(se=!1,typeof i.debug.onShaderError=="function")i.debug.onShaderError(r,b,D,P);else{const ce=rd(r,D,"vertex"),L=rd(r,P,"fragment");console.error("THREE.WebGLProgram: Shader Error "+r.getError()+" - VALIDATE_STATUS "+r.getProgramParameter(b,r.VALIDATE_STATUS)+`

Material Name: `+C.name+`
Material Type: `+C.type+`

Program Info Log: `+q+`
`+ce+`
`+L)}else q!==""?console.warn("THREE.WebGLProgram: Program Info Log:",q):(O===""||$==="")&&(Z=!1);Z&&(C.diagnostics={runnable:se,programLog:q,vertexShader:{log:O,prefix:m},fragmentShader:{log:$,prefix:f}})}r.deleteShader(D),r.deleteShader(P),N=new ca(r,b),v=t_(r,b)}let N;this.getUniforms=function(){return N===void 0&&T(this),N};let v;this.getAttributes=function(){return v===void 0&&T(this),v};let y=t.rendererExtensionParallelShaderCompile===!1;return this.isReady=function(){return y===!1&&(y=r.getProgramParameter(b,jb)),y},this.destroy=function(){n.releaseStatesOfProgram(this),r.deleteProgram(b),this.program=void 0},this.type=t.shaderType,this.name=t.shaderName,this.id=Xb++,this.cacheKey=e,this.usedTimes=1,this.program=b,this.vertexShader=D,this.fragmentShader=P,this}let f_=0;class p_{constructor(){this.shaderCache=new Map,this.materialCache=new Map}update(e){const t=e.vertexShader,n=e.fragmentShader,r=this._getShaderStage(t),s=this._getShaderStage(n),o=this._getShaderCacheForMaterial(e);return o.has(r)===!1&&(o.add(r),r.usedTimes++),o.has(s)===!1&&(o.add(s),s.usedTimes++),this}remove(e){const t=this.materialCache.get(e);for(const n of t)n.usedTimes--,n.usedTimes===0&&this.shaderCache.delete(n.code);return this.materialCache.delete(e),this}getVertexShaderID(e){return this._getShaderStage(e.vertexShader).id}getFragmentShaderID(e){return this._getShaderStage(e.fragmentShader).id}dispose(){this.shaderCache.clear(),this.materialCache.clear()}_getShaderCacheForMaterial(e){const t=this.materialCache;let n=t.get(e);return n===void 0&&(n=new Set,t.set(e,n)),n}_getShaderStage(e){const t=this.shaderCache;let n=t.get(e);return n===void 0&&(n=new m_(e),t.set(e,n)),n}}class m_{constructor(e){this.id=f_++,this.code=e,this.usedTimes=0}}function g_(i,e,t,n,r,s,o){const a=new jl,l=new p_,c=new Set,u=[],d=r.logarithmicDepthBuffer,h=r.vertexTextures;let p=r.precision;const g={MeshDepthMaterial:"depth",MeshDistanceMaterial:"distanceRGBA",MeshNormalMaterial:"normal",MeshBasicMaterial:"basic",MeshLambertMaterial:"lambert",MeshPhongMaterial:"phong",MeshToonMaterial:"toon",MeshStandardMaterial:"physical",MeshPhysicalMaterial:"physical",MeshMatcapMaterial:"matcap",LineBasicMaterial:"basic",LineDashedMaterial:"dashed",PointsMaterial:"points",ShadowMaterial:"shadow",SpriteMaterial:"sprite"};function b(v){return c.add(v),v===0?"uv":`uv${v}`}function m(v,y,C,q,O){const $=q.fog,se=O.geometry,Z=v.isMeshStandardMaterial?q.environment:null,ce=(v.isMeshStandardMaterial?t:e).get(v.envMap||Z),L=ce&&ce.mapping===Ta?ce.image.height:null,k=g[v.type];v.precision!==null&&(p=r.getMaxPrecision(v.precision),p!==v.precision&&console.warn("THREE.WebGLProgram.getParameters:",v.precision,"not supported, using",p,"instead."));const K=se.morphAttributes.position||se.morphAttributes.normal||se.morphAttributes.color,X=K!==void 0?K.length:0;let ee=0;se.morphAttributes.position!==void 0&&(ee=1),se.morphAttributes.normal!==void 0&&(ee=2),se.morphAttributes.color!==void 0&&(ee=3);let le,j,oe,xe;if(k){const It=_i[k];le=It.vertexShader,j=It.fragmentShader}else le=v.vertexShader,j=v.fragmentShader,l.update(v),oe=l.getVertexShaderID(v),xe=l.getFragmentShaderID(v);const me=i.getRenderTarget(),Te=i.state.buffers.depth.getReversed(),ke=O.isInstancedMesh===!0,He=O.isBatchedMesh===!0,Ze=!!v.map,Ce=!!v.matcap,st=!!ce,F=!!v.aoMap,Nt=!!v.lightMap,pt=!!v.bumpMap,ct=!!v.normalMap,Fe=!!v.displacementMap,Ut=!!v.emissiveMap,it=!!v.metalnessMap,R=!!v.roughnessMap,S=v.anisotropy>0,te=v.clearcoat>0,ge=v.dispersion>0,be=v.iridescence>0,fe=v.sheen>0,Je=v.transmission>0,Le=S&&!!v.anisotropyMap,Be=te&&!!v.clearcoatMap,Ct=te&&!!v.clearcoatNormalMap,we=te&&!!v.clearcoatRoughnessMap,ze=be&&!!v.iridescenceMap,et=be&&!!v.iridescenceThicknessMap,at=fe&&!!v.sheenColorMap,Ge=fe&&!!v.sheenRoughnessMap,St=!!v.specularMap,bt=!!v.specularColorMap,Dt=!!v.specularIntensityMap,B=Je&&!!v.transmissionMap,De=Je&&!!v.thicknessMap,de=!!v.gradientMap,_e=!!v.alphaMap,Ne=v.alphaTest>0,Ie=!!v.alphaHash,ft=!!v.extensions;let $t=dr;v.toneMapped&&(me===null||me.isXRRenderTarget===!0)&&($t=i.toneMapping);const fn={shaderID:k,shaderType:v.type,shaderName:v.name,vertexShader:le,fragmentShader:j,defines:v.defines,customVertexShaderID:oe,customFragmentShaderID:xe,isRawShaderMaterial:v.isRawShaderMaterial===!0,glslVersion:v.glslVersion,precision:p,batching:He,batchingColor:He&&O._colorsTexture!==null,instancing:ke,instancingColor:ke&&O.instanceColor!==null,instancingMorph:ke&&O.morphTexture!==null,supportsVertexTextures:h,outputColorSpace:me===null?i.outputColorSpace:me.isXRRenderTarget===!0?me.texture.colorSpace:Ln,alphaToCoverage:!!v.alphaToCoverage,map:Ze,matcap:Ce,envMap:st,envMapMode:st&&ce.mapping,envMapCubeUVHeight:L,aoMap:F,lightMap:Nt,bumpMap:pt,normalMap:ct,displacementMap:h&&Fe,emissiveMap:Ut,normalMapObjectSpace:ct&&v.normalMapType===lp,normalMapTangentSpace:ct&&v.normalMapType===yh,metalnessMap:it,roughnessMap:R,anisotropy:S,anisotropyMap:Le,clearcoat:te,clearcoatMap:Be,clearcoatNormalMap:Ct,clearcoatRoughnessMap:we,dispersion:ge,iridescence:be,iridescenceMap:ze,iridescenceThicknessMap:et,sheen:fe,sheenColorMap:at,sheenRoughnessMap:Ge,specularMap:St,specularColorMap:bt,specularIntensityMap:Dt,transmission:Je,transmissionMap:B,thicknessMap:De,gradientMap:de,opaque:v.transparent===!1&&v.blending===as&&v.alphaToCoverage===!1,alphaMap:_e,alphaTest:Ne,alphaHash:Ie,combine:v.combine,mapUv:Ze&&b(v.map.channel),aoMapUv:F&&b(v.aoMap.channel),lightMapUv:Nt&&b(v.lightMap.channel),bumpMapUv:pt&&b(v.bumpMap.channel),normalMapUv:ct&&b(v.normalMap.channel),displacementMapUv:Fe&&b(v.displacementMap.channel),emissiveMapUv:Ut&&b(v.emissiveMap.channel),metalnessMapUv:it&&b(v.metalnessMap.channel),roughnessMapUv:R&&b(v.roughnessMap.channel),anisotropyMapUv:Le&&b(v.anisotropyMap.channel),clearcoatMapUv:Be&&b(v.clearcoatMap.channel),clearcoatNormalMapUv:Ct&&b(v.clearcoatNormalMap.channel),clearcoatRoughnessMapUv:we&&b(v.clearcoatRoughnessMap.channel),iridescenceMapUv:ze&&b(v.iridescenceMap.channel),iridescenceThicknessMapUv:et&&b(v.iridescenceThicknessMap.channel),sheenColorMapUv:at&&b(v.sheenColorMap.channel),sheenRoughnessMapUv:Ge&&b(v.sheenRoughnessMap.channel),specularMapUv:St&&b(v.specularMap.channel),specularColorMapUv:bt&&b(v.specularColorMap.channel),specularIntensityMapUv:Dt&&b(v.specularIntensityMap.channel),transmissionMapUv:B&&b(v.transmissionMap.channel),thicknessMapUv:De&&b(v.thicknessMap.channel),alphaMapUv:_e&&b(v.alphaMap.channel),vertexTangents:!!se.attributes.tangent&&(ct||S),vertexColors:v.vertexColors,vertexAlphas:v.vertexColors===!0&&!!se.attributes.color&&se.attributes.color.itemSize===4,pointsUvs:O.isPoints===!0&&!!se.attributes.uv&&(Ze||_e),fog:!!$,useFog:v.fog===!0,fogExp2:!!$&&$.isFogExp2,flatShading:v.flatShading===!0,sizeAttenuation:v.sizeAttenuation===!0,logarithmicDepthBuffer:d,reverseDepthBuffer:Te,skinning:O.isSkinnedMesh===!0,morphTargets:se.morphAttributes.position!==void 0,morphNormals:se.morphAttributes.normal!==void 0,morphColors:se.morphAttributes.color!==void 0,morphTargetsCount:X,morphTextureStride:ee,numDirLights:y.directional.length,numPointLights:y.point.length,numSpotLights:y.spot.length,numSpotLightMaps:y.spotLightMap.length,numRectAreaLights:y.rectArea.length,numHemiLights:y.hemi.length,numDirLightShadows:y.directionalShadowMap.length,numPointLightShadows:y.pointShadowMap.length,numSpotLightShadows:y.spotShadowMap.length,numSpotLightShadowsWithMaps:y.numSpotLightShadowsWithMaps,numLightProbes:y.numLightProbes,numClippingPlanes:o.numPlanes,numClipIntersection:o.numIntersection,dithering:v.dithering,shadowMapEnabled:i.shadowMap.enabled&&C.length>0,shadowMapType:i.shadowMap.type,toneMapping:$t,decodeVideoTexture:Ze&&v.map.isVideoTexture===!0&&Pt.getTransfer(v.map.colorSpace)===jt,decodeVideoTextureEmissive:Ut&&v.emissiveMap.isVideoTexture===!0&&Pt.getTransfer(v.emissiveMap.colorSpace)===jt,premultipliedAlpha:v.premultipliedAlpha,doubleSided:v.side===xi,flipSided:v.side===Cn,useDepthPacking:v.depthPacking>=0,depthPacking:v.depthPacking||0,index0AttributeName:v.index0AttributeName,extensionClipCullDistance:ft&&v.extensions.clipCullDistance===!0&&n.has("WEBGL_clip_cull_distance"),extensionMultiDraw:(ft&&v.extensions.multiDraw===!0||He)&&n.has("WEBGL_multi_draw"),rendererExtensionParallelShaderCompile:n.has("KHR_parallel_shader_compile"),customProgramCacheKey:v.customProgramCacheKey()};return fn.vertexUv1s=c.has(1),fn.vertexUv2s=c.has(2),fn.vertexUv3s=c.has(3),c.clear(),fn}function f(v){const y=[];if(v.shaderID?y.push(v.shaderID):(y.push(v.customVertexShaderID),y.push(v.customFragmentShaderID)),v.defines!==void 0)for(const C in v.defines)y.push(C),y.push(v.defines[C]);return v.isRawShaderMaterial===!1&&(M(y,v),x(y,v),y.push(i.outputColorSpace)),y.push(v.customProgramCacheKey),y.join()}function M(v,y){v.push(y.precision),v.push(y.outputColorSpace),v.push(y.envMapMode),v.push(y.envMapCubeUVHeight),v.push(y.mapUv),v.push(y.alphaMapUv),v.push(y.lightMapUv),v.push(y.aoMapUv),v.push(y.bumpMapUv),v.push(y.normalMapUv),v.push(y.displacementMapUv),v.push(y.emissiveMapUv),v.push(y.metalnessMapUv),v.push(y.roughnessMapUv),v.push(y.anisotropyMapUv),v.push(y.clearcoatMapUv),v.push(y.clearcoatNormalMapUv),v.push(y.clearcoatRoughnessMapUv),v.push(y.iridescenceMapUv),v.push(y.iridescenceThicknessMapUv),v.push(y.sheenColorMapUv),v.push(y.sheenRoughnessMapUv),v.push(y.specularMapUv),v.push(y.specularColorMapUv),v.push(y.specularIntensityMapUv),v.push(y.transmissionMapUv),v.push(y.thicknessMapUv),v.push(y.combine),v.push(y.fogExp2),v.push(y.sizeAttenuation),v.push(y.morphTargetsCount),v.push(y.morphAttributeCount),v.push(y.numDirLights),v.push(y.numPointLights),v.push(y.numSpotLights),v.push(y.numSpotLightMaps),v.push(y.numHemiLights),v.push(y.numRectAreaLights),v.push(y.numDirLightShadows),v.push(y.numPointLightShadows),v.push(y.numSpotLightShadows),v.push(y.numSpotLightShadowsWithMaps),v.push(y.numLightProbes),v.push(y.shadowMapType),v.push(y.toneMapping),v.push(y.numClippingPlanes),v.push(y.numClipIntersection),v.push(y.depthPacking)}function x(v,y){a.disableAll(),y.supportsVertexTextures&&a.enable(0),y.instancing&&a.enable(1),y.instancingColor&&a.enable(2),y.instancingMorph&&a.enable(3),y.matcap&&a.enable(4),y.envMap&&a.enable(5),y.normalMapObjectSpace&&a.enable(6),y.normalMapTangentSpace&&a.enable(7),y.clearcoat&&a.enable(8),y.iridescence&&a.enable(9),y.alphaTest&&a.enable(10),y.vertexColors&&a.enable(11),y.vertexAlphas&&a.enable(12),y.vertexUv1s&&a.enable(13),y.vertexUv2s&&a.enable(14),y.vertexUv3s&&a.enable(15),y.vertexTangents&&a.enable(16),y.anisotropy&&a.enable(17),y.alphaHash&&a.enable(18),y.batching&&a.enable(19),y.dispersion&&a.enable(20),y.batchingColor&&a.enable(21),v.push(a.mask),a.disableAll(),y.fog&&a.enable(0),y.useFog&&a.enable(1),y.flatShading&&a.enable(2),y.logarithmicDepthBuffer&&a.enable(3),y.reverseDepthBuffer&&a.enable(4),y.skinning&&a.enable(5),y.morphTargets&&a.enable(6),y.morphNormals&&a.enable(7),y.morphColors&&a.enable(8),y.premultipliedAlpha&&a.enable(9),y.shadowMapEnabled&&a.enable(10),y.doubleSided&&a.enable(11),y.flipSided&&a.enable(12),y.useDepthPacking&&a.enable(13),y.dithering&&a.enable(14),y.transmission&&a.enable(15),y.sheen&&a.enable(16),y.opaque&&a.enable(17),y.pointsUvs&&a.enable(18),y.decodeVideoTexture&&a.enable(19),y.decodeVideoTextureEmissive&&a.enable(20),y.alphaToCoverage&&a.enable(21),v.push(a.mask)}function _(v){const y=g[v.type];let C;if(y){const q=_i[y];C=Jp.clone(q.uniforms)}else C=v.uniforms;return C}function D(v,y){let C;for(let q=0,O=u.length;q<O;q++){const $=u[q];if($.cacheKey===y){C=$,++C.usedTimes;break}}return C===void 0&&(C=new h_(i,y,v,s),u.push(C)),C}function P(v){if(--v.usedTimes===0){const y=u.indexOf(v);u[y]=u[u.length-1],u.pop(),v.destroy()}}function T(v){l.remove(v)}function N(){l.dispose()}return{getParameters:m,getProgramCacheKey:f,getUniforms:_,acquireProgram:D,releaseProgram:P,releaseShaderCache:T,programs:u,dispose:N}}function b_(){let i=new WeakMap;function e(o){return i.has(o)}function t(o){let a=i.get(o);return a===void 0&&(a={},i.set(o,a)),a}function n(o){i.delete(o)}function r(o,a,l){i.get(o)[a]=l}function s(){i=new WeakMap}return{has:e,get:t,remove:n,update:r,dispose:s}}function __(i,e){return i.groupOrder!==e.groupOrder?i.groupOrder-e.groupOrder:i.renderOrder!==e.renderOrder?i.renderOrder-e.renderOrder:i.material.id!==e.material.id?i.material.id-e.material.id:i.z!==e.z?i.z-e.z:i.id-e.id}function ld(i,e){return i.groupOrder!==e.groupOrder?i.groupOrder-e.groupOrder:i.renderOrder!==e.renderOrder?i.renderOrder-e.renderOrder:i.z!==e.z?e.z-i.z:i.id-e.id}function ud(){const i=[];let e=0;const t=[],n=[],r=[];function s(){e=0,t.length=0,n.length=0,r.length=0}function o(d,h,p,g,b,m){let f=i[e];return f===void 0?(f={id:d.id,object:d,geometry:h,material:p,groupOrder:g,renderOrder:d.renderOrder,z:b,group:m},i[e]=f):(f.id=d.id,f.object=d,f.geometry=h,f.material=p,f.groupOrder=g,f.renderOrder=d.renderOrder,f.z=b,f.group=m),e++,f}function a(d,h,p,g,b,m){const f=o(d,h,p,g,b,m);p.transmission>0?n.push(f):p.transparent===!0?r.push(f):t.push(f)}function l(d,h,p,g,b,m){const f=o(d,h,p,g,b,m);p.transmission>0?n.unshift(f):p.transparent===!0?r.unshift(f):t.unshift(f)}function c(d,h){t.length>1&&t.sort(d||__),n.length>1&&n.sort(h||ld),r.length>1&&r.sort(h||ld)}function u(){for(let d=e,h=i.length;d<h;d++){const p=i[d];if(p.id===null)break;p.id=null,p.object=null,p.geometry=null,p.material=null,p.group=null}}return{opaque:t,transmissive:n,transparent:r,init:s,push:a,unshift:l,finish:u,sort:c}}function x_(){let i=new WeakMap;function e(n,r){const s=i.get(n);let o;return s===void 0?(o=new ud,i.set(n,[o])):r>=s.length?(o=new ud,s.push(o)):o=s[r],o}function t(){i=new WeakMap}return{get:e,dispose:t}}function v_(){const i={};return{get:function(e){if(i[e.id]!==void 0)return i[e.id];let t;switch(e.type){case"DirectionalLight":t={direction:new A,color:new rt};break;case"SpotLight":t={position:new A,direction:new A,color:new rt,distance:0,coneCos:0,penumbraCos:0,decay:0};break;case"PointLight":t={position:new A,color:new rt,distance:0,decay:0};break;case"HemisphereLight":t={direction:new A,skyColor:new rt,groundColor:new rt};break;case"RectAreaLight":t={color:new rt,position:new A,halfWidth:new A,halfHeight:new A};break}return i[e.id]=t,t}}}function y_(){const i={};return{get:function(e){if(i[e.id]!==void 0)return i[e.id];let t;switch(e.type){case"DirectionalLight":t={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new ut};break;case"SpotLight":t={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new ut};break;case"PointLight":t={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new ut,shadowCameraNear:1,shadowCameraFar:1e3};break}return i[e.id]=t,t}}}let M_=0;function S_(i,e){return(e.castShadow?2:0)-(i.castShadow?2:0)+(e.map?1:0)-(i.map?1:0)}function w_(i){const e=new v_,t=y_(),n={version:0,hash:{directionalLength:-1,pointLength:-1,spotLength:-1,rectAreaLength:-1,hemiLength:-1,numDirectionalShadows:-1,numPointShadows:-1,numSpotShadows:-1,numSpotMaps:-1,numLightProbes:-1},ambient:[0,0,0],probe:[],directional:[],directionalShadow:[],directionalShadowMap:[],directionalShadowMatrix:[],spot:[],spotLightMap:[],spotShadow:[],spotShadowMap:[],spotLightMatrix:[],rectArea:[],rectAreaLTC1:null,rectAreaLTC2:null,point:[],pointShadow:[],pointShadowMap:[],pointShadowMatrix:[],hemi:[],numSpotLightShadowsWithMaps:0,numLightProbes:0};for(let c=0;c<9;c++)n.probe.push(new A);const r=new A,s=new ot,o=new ot;function a(c){let u=0,d=0,h=0;for(let v=0;v<9;v++)n.probe[v].set(0,0,0);let p=0,g=0,b=0,m=0,f=0,M=0,x=0,_=0,D=0,P=0,T=0;c.sort(S_);for(let v=0,y=c.length;v<y;v++){const C=c[v],q=C.color,O=C.intensity,$=C.distance,se=C.shadow&&C.shadow.map?C.shadow.map.texture:null;if(C.isAmbientLight)u+=q.r*O,d+=q.g*O,h+=q.b*O;else if(C.isLightProbe){for(let Z=0;Z<9;Z++)n.probe[Z].addScaledVector(C.sh.coefficients[Z],O);T++}else if(C.isDirectionalLight){const Z=e.get(C);if(Z.color.copy(C.color).multiplyScalar(C.intensity),C.castShadow){const ce=C.shadow,L=t.get(C);L.shadowIntensity=ce.intensity,L.shadowBias=ce.bias,L.shadowNormalBias=ce.normalBias,L.shadowRadius=ce.radius,L.shadowMapSize=ce.mapSize,n.directionalShadow[p]=L,n.directionalShadowMap[p]=se,n.directionalShadowMatrix[p]=C.shadow.matrix,M++}n.directional[p]=Z,p++}else if(C.isSpotLight){const Z=e.get(C);Z.position.setFromMatrixPosition(C.matrixWorld),Z.color.copy(q).multiplyScalar(O),Z.distance=$,Z.coneCos=Math.cos(C.angle),Z.penumbraCos=Math.cos(C.angle*(1-C.penumbra)),Z.decay=C.decay,n.spot[b]=Z;const ce=C.shadow;if(C.map&&(n.spotLightMap[D]=C.map,D++,ce.updateMatrices(C),C.castShadow&&P++),n.spotLightMatrix[b]=ce.matrix,C.castShadow){const L=t.get(C);L.shadowIntensity=ce.intensity,L.shadowBias=ce.bias,L.shadowNormalBias=ce.normalBias,L.shadowRadius=ce.radius,L.shadowMapSize=ce.mapSize,n.spotShadow[b]=L,n.spotShadowMap[b]=se,_++}b++}else if(C.isRectAreaLight){const Z=e.get(C);Z.color.copy(q).multiplyScalar(O),Z.halfWidth.set(C.width*.5,0,0),Z.halfHeight.set(0,C.height*.5,0),n.rectArea[m]=Z,m++}else if(C.isPointLight){const Z=e.get(C);if(Z.color.copy(C.color).multiplyScalar(C.intensity),Z.distance=C.distance,Z.decay=C.decay,C.castShadow){const ce=C.shadow,L=t.get(C);L.shadowIntensity=ce.intensity,L.shadowBias=ce.bias,L.shadowNormalBias=ce.normalBias,L.shadowRadius=ce.radius,L.shadowMapSize=ce.mapSize,L.shadowCameraNear=ce.camera.near,L.shadowCameraFar=ce.camera.far,n.pointShadow[g]=L,n.pointShadowMap[g]=se,n.pointShadowMatrix[g]=C.shadow.matrix,x++}n.point[g]=Z,g++}else if(C.isHemisphereLight){const Z=e.get(C);Z.skyColor.copy(C.color).multiplyScalar(O),Z.groundColor.copy(C.groundColor).multiplyScalar(O),n.hemi[f]=Z,f++}}m>0&&(i.has("OES_texture_float_linear")===!0?(n.rectAreaLTC1=Pe.LTC_FLOAT_1,n.rectAreaLTC2=Pe.LTC_FLOAT_2):(n.rectAreaLTC1=Pe.LTC_HALF_1,n.rectAreaLTC2=Pe.LTC_HALF_2)),n.ambient[0]=u,n.ambient[1]=d,n.ambient[2]=h;const N=n.hash;(N.directionalLength!==p||N.pointLength!==g||N.spotLength!==b||N.rectAreaLength!==m||N.hemiLength!==f||N.numDirectionalShadows!==M||N.numPointShadows!==x||N.numSpotShadows!==_||N.numSpotMaps!==D||N.numLightProbes!==T)&&(n.directional.length=p,n.spot.length=b,n.rectArea.length=m,n.point.length=g,n.hemi.length=f,n.directionalShadow.length=M,n.directionalShadowMap.length=M,n.pointShadow.length=x,n.pointShadowMap.length=x,n.spotShadow.length=_,n.spotShadowMap.length=_,n.directionalShadowMatrix.length=M,n.pointShadowMatrix.length=x,n.spotLightMatrix.length=_+D-P,n.spotLightMap.length=D,n.numSpotLightShadowsWithMaps=P,n.numLightProbes=T,N.directionalLength=p,N.pointLength=g,N.spotLength=b,N.rectAreaLength=m,N.hemiLength=f,N.numDirectionalShadows=M,N.numPointShadows=x,N.numSpotShadows=_,N.numSpotMaps=D,N.numLightProbes=T,n.version=M_++)}function l(c,u){let d=0,h=0,p=0,g=0,b=0;const m=u.matrixWorldInverse;for(let f=0,M=c.length;f<M;f++){const x=c[f];if(x.isDirectionalLight){const _=n.directional[d];_.direction.setFromMatrixPosition(x.matrixWorld),r.setFromMatrixPosition(x.target.matrixWorld),_.direction.sub(r),_.direction.transformDirection(m),d++}else if(x.isSpotLight){const _=n.spot[p];_.position.setFromMatrixPosition(x.matrixWorld),_.position.applyMatrix4(m),_.direction.setFromMatrixPosition(x.matrixWorld),r.setFromMatrixPosition(x.target.matrixWorld),_.direction.sub(r),_.direction.transformDirection(m),p++}else if(x.isRectAreaLight){const _=n.rectArea[g];_.position.setFromMatrixPosition(x.matrixWorld),_.position.applyMatrix4(m),o.identity(),s.copy(x.matrixWorld),s.premultiply(m),o.extractRotation(s),_.halfWidth.set(x.width*.5,0,0),_.halfHeight.set(0,x.height*.5,0),_.halfWidth.applyMatrix4(o),_.halfHeight.applyMatrix4(o),g++}else if(x.isPointLight){const _=n.point[h];_.position.setFromMatrixPosition(x.matrixWorld),_.position.applyMatrix4(m),h++}else if(x.isHemisphereLight){const _=n.hemi[b];_.direction.setFromMatrixPosition(x.matrixWorld),_.direction.transformDirection(m),b++}}}return{setup:a,setupView:l,state:n}}function dd(i){const e=new w_(i),t=[],n=[];function r(u){c.camera=u,t.length=0,n.length=0}function s(u){t.push(u)}function o(u){n.push(u)}function a(){e.setup(t)}function l(u){e.setupView(t,u)}const c={lightsArray:t,shadowsArray:n,camera:null,lights:e,transmissionRenderTarget:{}};return{init:r,state:c,setupLights:a,setupLightsView:l,pushLight:s,pushShadow:o}}function E_(i){let e=new WeakMap;function t(r,s=0){const o=e.get(r);let a;return o===void 0?(a=new dd(i),e.set(r,[a])):s>=o.length?(a=new dd(i),o.push(a)):a=o[s],a}function n(){e=new WeakMap}return{get:t,dispose:n}}class A_ extends hi{static get type(){return"MeshDepthMaterial"}constructor(e){super(),this.isMeshDepthMaterial=!0,this.depthPacking=ap,this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.wireframe=!1,this.wireframeLinewidth=1,this.setValues(e)}copy(e){return super.copy(e),this.depthPacking=e.depthPacking,this.map=e.map,this.alphaMap=e.alphaMap,this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this}}class T_ extends hi{static get type(){return"MeshDistanceMaterial"}constructor(e){super(),this.isMeshDistanceMaterial=!0,this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.setValues(e)}copy(e){return super.copy(e),this.map=e.map,this.alphaMap=e.alphaMap,this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this}}const R_=`void main() {
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
}`;function P_(i,e,t){let n=new Xl;const r=new ut,s=new ut,o=new mt,a=new A_({depthPacking:cp}),l=new T_,c={},u=t.maxTextureSize,d={[ji]:Cn,[Cn]:ji,[xi]:xi},h=new fr({defines:{VSM_SAMPLES:8},uniforms:{shadow_pass:{value:null},resolution:{value:new ut},radius:{value:4}},vertexShader:R_,fragmentShader:C_}),p=h.clone();p.defines.HORIZONTAL_PASS=1;const g=new Ei;g.setAttribute("position",new yn(new Float32Array([-1,-1,.5,3,-1,.5,-1,3,.5]),3));const b=new Xt(g,h),m=this;this.enabled=!1,this.autoUpdate=!0,this.needsUpdate=!1,this.type=sh;let f=this.type;this.render=function(P,T,N){if(m.enabled===!1||m.autoUpdate===!1&&m.needsUpdate===!1||P.length===0)return;const v=i.getRenderTarget(),y=i.getActiveCubeFace(),C=i.getActiveMipmapLevel(),q=i.state;q.setBlending(ur),q.buffers.color.setClear(1,1,1,1),q.buffers.depth.setTest(!0),q.setScissorTest(!1);const O=f!==Ui&&this.type===Ui,$=f===Ui&&this.type!==Ui;for(let se=0,Z=P.length;se<Z;se++){const ce=P[se],L=ce.shadow;if(L===void 0){console.warn("THREE.WebGLShadowMap:",ce,"has no shadow.");continue}if(L.autoUpdate===!1&&L.needsUpdate===!1)continue;r.copy(L.mapSize);const k=L.getFrameExtents();if(r.multiply(k),s.copy(L.mapSize),(r.x>u||r.y>u)&&(r.x>u&&(s.x=Math.floor(u/k.x),r.x=s.x*k.x,L.mapSize.x=s.x),r.y>u&&(s.y=Math.floor(u/k.y),r.y=s.y*k.y,L.mapSize.y=s.y)),L.map===null||O===!0||$===!0){const X=this.type!==Ui?{minFilter:Pn,magFilter:Pn}:{};L.map!==null&&L.map.dispose(),L.map=new hr(r.x,r.y,X),L.map.texture.name=ce.name+".shadowMap",L.camera.updateProjectionMatrix()}i.setRenderTarget(L.map),i.clear();const K=L.getViewportCount();for(let X=0;X<K;X++){const ee=L.getViewport(X);o.set(s.x*ee.x,s.y*ee.y,s.x*ee.z,s.y*ee.w),q.viewport(o),L.updateMatrices(ce,X),n=L.getFrustum(),_(T,N,L.camera,ce,this.type)}L.isPointLightShadow!==!0&&this.type===Ui&&M(L,N),L.needsUpdate=!1}f=this.type,m.needsUpdate=!1,i.setRenderTarget(v,y,C)};function M(P,T){const N=e.update(b);h.defines.VSM_SAMPLES!==P.blurSamples&&(h.defines.VSM_SAMPLES=P.blurSamples,p.defines.VSM_SAMPLES=P.blurSamples,h.needsUpdate=!0,p.needsUpdate=!0),P.mapPass===null&&(P.mapPass=new hr(r.x,r.y)),h.uniforms.shadow_pass.value=P.map.texture,h.uniforms.resolution.value=P.mapSize,h.uniforms.radius.value=P.radius,i.setRenderTarget(P.mapPass),i.clear(),i.renderBufferDirect(T,null,N,h,b,null),p.uniforms.shadow_pass.value=P.mapPass.texture,p.uniforms.resolution.value=P.mapSize,p.uniforms.radius.value=P.radius,i.setRenderTarget(P.map),i.clear(),i.renderBufferDirect(T,null,N,p,b,null)}function x(P,T,N,v){let y=null;const C=N.isPointLight===!0?P.customDistanceMaterial:P.customDepthMaterial;if(C!==void 0)y=C;else if(y=N.isPointLight===!0?l:a,i.localClippingEnabled&&T.clipShadows===!0&&Array.isArray(T.clippingPlanes)&&T.clippingPlanes.length!==0||T.displacementMap&&T.displacementScale!==0||T.alphaMap&&T.alphaTest>0||T.map&&T.alphaTest>0){const q=y.uuid,O=T.uuid;let $=c[q];$===void 0&&($={},c[q]=$);let se=$[O];se===void 0&&(se=y.clone(),$[O]=se,T.addEventListener("dispose",D)),y=se}if(y.visible=T.visible,y.wireframe=T.wireframe,v===Ui?y.side=T.shadowSide!==null?T.shadowSide:T.side:y.side=T.shadowSide!==null?T.shadowSide:d[T.side],y.alphaMap=T.alphaMap,y.alphaTest=T.alphaTest,y.map=T.map,y.clipShadows=T.clipShadows,y.clippingPlanes=T.clippingPlanes,y.clipIntersection=T.clipIntersection,y.displacementMap=T.displacementMap,y.displacementScale=T.displacementScale,y.displacementBias=T.displacementBias,y.wireframeLinewidth=T.wireframeLinewidth,y.linewidth=T.linewidth,N.isPointLight===!0&&y.isMeshDistanceMaterial===!0){const q=i.properties.get(y);q.light=N}return y}function _(P,T,N,v,y){if(P.visible===!1)return;if(P.layers.test(T.layers)&&(P.isMesh||P.isLine||P.isPoints)&&(P.castShadow||P.receiveShadow&&y===Ui)&&(!P.frustumCulled||n.intersectsObject(P))){P.modelViewMatrix.multiplyMatrices(N.matrixWorldInverse,P.matrixWorld);const O=e.update(P),$=P.material;if(Array.isArray($)){const se=O.groups;for(let Z=0,ce=se.length;Z<ce;Z++){const L=se[Z],k=$[L.materialIndex];if(k&&k.visible){const K=x(P,k,v,y);P.onBeforeShadow(i,P,T,N,O,K,L),i.renderBufferDirect(N,null,O,K,P,L),P.onAfterShadow(i,P,T,N,O,K,L)}}}else if($.visible){const se=x(P,$,v,y);P.onBeforeShadow(i,P,T,N,O,se,null),i.renderBufferDirect(N,null,O,se,P,null),P.onAfterShadow(i,P,T,N,O,se,null)}}const q=P.children;for(let O=0,$=q.length;O<$;O++)_(q[O],T,N,v,y)}function D(P){P.target.removeEventListener("dispose",D);for(const N in c){const v=c[N],y=P.target.uuid;y in v&&(v[y].dispose(),delete v[y])}}}const L_={[Bc]:zc,[Hc]:Wc,[Gc]:qc,[ms]:Vc,[zc]:Bc,[Wc]:Hc,[qc]:Gc,[Vc]:ms};function D_(i,e){function t(){let B=!1;const De=new mt;let de=null;const _e=new mt(0,0,0,0);return{setMask:function(Ne){de!==Ne&&!B&&(i.colorMask(Ne,Ne,Ne,Ne),de=Ne)},setLocked:function(Ne){B=Ne},setClear:function(Ne,Ie,ft,$t,fn){fn===!0&&(Ne*=$t,Ie*=$t,ft*=$t),De.set(Ne,Ie,ft,$t),_e.equals(De)===!1&&(i.clearColor(Ne,Ie,ft,$t),_e.copy(De))},reset:function(){B=!1,de=null,_e.set(-1,0,0,0)}}}function n(){let B=!1,De=!1,de=null,_e=null,Ne=null;return{setReversed:function(Ie){if(De!==Ie){const ft=e.get("EXT_clip_control");De?ft.clipControlEXT(ft.LOWER_LEFT_EXT,ft.ZERO_TO_ONE_EXT):ft.clipControlEXT(ft.LOWER_LEFT_EXT,ft.NEGATIVE_ONE_TO_ONE_EXT);const $t=Ne;Ne=null,this.setClear($t)}De=Ie},getReversed:function(){return De},setTest:function(Ie){Ie?me(i.DEPTH_TEST):Te(i.DEPTH_TEST)},setMask:function(Ie){de!==Ie&&!B&&(i.depthMask(Ie),de=Ie)},setFunc:function(Ie){if(De&&(Ie=L_[Ie]),_e!==Ie){switch(Ie){case Bc:i.depthFunc(i.NEVER);break;case zc:i.depthFunc(i.ALWAYS);break;case Hc:i.depthFunc(i.LESS);break;case ms:i.depthFunc(i.LEQUAL);break;case Gc:i.depthFunc(i.EQUAL);break;case Vc:i.depthFunc(i.GEQUAL);break;case Wc:i.depthFunc(i.GREATER);break;case qc:i.depthFunc(i.NOTEQUAL);break;default:i.depthFunc(i.LEQUAL)}_e=Ie}},setLocked:function(Ie){B=Ie},setClear:function(Ie){Ne!==Ie&&(De&&(Ie=1-Ie),i.clearDepth(Ie),Ne=Ie)},reset:function(){B=!1,de=null,_e=null,Ne=null,De=!1}}}function r(){let B=!1,De=null,de=null,_e=null,Ne=null,Ie=null,ft=null,$t=null,fn=null;return{setTest:function(It){B||(It?me(i.STENCIL_TEST):Te(i.STENCIL_TEST))},setMask:function(It){De!==It&&!B&&(i.stencilMask(It),De=It)},setFunc:function(It,Dn,Xn){(de!==It||_e!==Dn||Ne!==Xn)&&(i.stencilFunc(It,Dn,Xn),de=It,_e=Dn,Ne=Xn)},setOp:function(It,Dn,Xn){(Ie!==It||ft!==Dn||$t!==Xn)&&(i.stencilOp(It,Dn,Xn),Ie=It,ft=Dn,$t=Xn)},setLocked:function(It){B=It},setClear:function(It){fn!==It&&(i.clearStencil(It),fn=It)},reset:function(){B=!1,De=null,de=null,_e=null,Ne=null,Ie=null,ft=null,$t=null,fn=null}}}const s=new t,o=new n,a=new r,l=new WeakMap,c=new WeakMap;let u={},d={},h=new WeakMap,p=[],g=null,b=!1,m=null,f=null,M=null,x=null,_=null,D=null,P=null,T=new rt(0,0,0),N=0,v=!1,y=null,C=null,q=null,O=null,$=null;const se=i.getParameter(i.MAX_COMBINED_TEXTURE_IMAGE_UNITS);let Z=!1,ce=0;const L=i.getParameter(i.VERSION);L.indexOf("WebGL")!==-1?(ce=parseFloat(/^WebGL (\d)/.exec(L)[1]),Z=ce>=1):L.indexOf("OpenGL ES")!==-1&&(ce=parseFloat(/^OpenGL ES (\d)/.exec(L)[1]),Z=ce>=2);let k=null,K={};const X=i.getParameter(i.SCISSOR_BOX),ee=i.getParameter(i.VIEWPORT),le=new mt().fromArray(X),j=new mt().fromArray(ee);function oe(B,De,de,_e){const Ne=new Uint8Array(4),Ie=i.createTexture();i.bindTexture(B,Ie),i.texParameteri(B,i.TEXTURE_MIN_FILTER,i.NEAREST),i.texParameteri(B,i.TEXTURE_MAG_FILTER,i.NEAREST);for(let ft=0;ft<de;ft++)B===i.TEXTURE_3D||B===i.TEXTURE_2D_ARRAY?i.texImage3D(De,0,i.RGBA,1,1,_e,0,i.RGBA,i.UNSIGNED_BYTE,Ne):i.texImage2D(De+ft,0,i.RGBA,1,1,0,i.RGBA,i.UNSIGNED_BYTE,Ne);return Ie}const xe={};xe[i.TEXTURE_2D]=oe(i.TEXTURE_2D,i.TEXTURE_2D,1),xe[i.TEXTURE_CUBE_MAP]=oe(i.TEXTURE_CUBE_MAP,i.TEXTURE_CUBE_MAP_POSITIVE_X,6),xe[i.TEXTURE_2D_ARRAY]=oe(i.TEXTURE_2D_ARRAY,i.TEXTURE_2D_ARRAY,1,1),xe[i.TEXTURE_3D]=oe(i.TEXTURE_3D,i.TEXTURE_3D,1,1),s.setClear(0,0,0,1),o.setClear(1),a.setClear(0),me(i.DEPTH_TEST),o.setFunc(ms),pt(!1),ct(hu),me(i.CULL_FACE),F(ur);function me(B){u[B]!==!0&&(i.enable(B),u[B]=!0)}function Te(B){u[B]!==!1&&(i.disable(B),u[B]=!1)}function ke(B,De){return d[B]!==De?(i.bindFramebuffer(B,De),d[B]=De,B===i.DRAW_FRAMEBUFFER&&(d[i.FRAMEBUFFER]=De),B===i.FRAMEBUFFER&&(d[i.DRAW_FRAMEBUFFER]=De),!0):!1}function He(B,De){let de=p,_e=!1;if(B){de=h.get(De),de===void 0&&(de=[],h.set(De,de));const Ne=B.textures;if(de.length!==Ne.length||de[0]!==i.COLOR_ATTACHMENT0){for(let Ie=0,ft=Ne.length;Ie<ft;Ie++)de[Ie]=i.COLOR_ATTACHMENT0+Ie;de.length=Ne.length,_e=!0}}else de[0]!==i.BACK&&(de[0]=i.BACK,_e=!0);_e&&i.drawBuffers(de)}function Ze(B){return g!==B?(i.useProgram(B),g=B,!0):!1}const Ce={[Cr]:i.FUNC_ADD,[If]:i.FUNC_SUBTRACT,[Ff]:i.FUNC_REVERSE_SUBTRACT};Ce[Nf]=i.MIN,Ce[Uf]=i.MAX;const st={[Of]:i.ZERO,[kf]:i.ONE,[Bf]:i.SRC_COLOR,[Oc]:i.SRC_ALPHA,[qf]:i.SRC_ALPHA_SATURATE,[Vf]:i.DST_COLOR,[Hf]:i.DST_ALPHA,[zf]:i.ONE_MINUS_SRC_COLOR,[kc]:i.ONE_MINUS_SRC_ALPHA,[Wf]:i.ONE_MINUS_DST_COLOR,[Gf]:i.ONE_MINUS_DST_ALPHA,[jf]:i.CONSTANT_COLOR,[Xf]:i.ONE_MINUS_CONSTANT_COLOR,[Qf]:i.CONSTANT_ALPHA,[Kf]:i.ONE_MINUS_CONSTANT_ALPHA};function F(B,De,de,_e,Ne,Ie,ft,$t,fn,It){if(B===ur){b===!0&&(Te(i.BLEND),b=!1);return}if(b===!1&&(me(i.BLEND),b=!0),B!==Df){if(B!==m||It!==v){if((f!==Cr||_!==Cr)&&(i.blendEquation(i.FUNC_ADD),f=Cr,_=Cr),It)switch(B){case as:i.blendFuncSeparate(i.ONE,i.ONE_MINUS_SRC_ALPHA,i.ONE,i.ONE_MINUS_SRC_ALPHA);break;case fu:i.blendFunc(i.ONE,i.ONE);break;case pu:i.blendFuncSeparate(i.ZERO,i.ONE_MINUS_SRC_COLOR,i.ZERO,i.ONE);break;case mu:i.blendFuncSeparate(i.ZERO,i.SRC_COLOR,i.ZERO,i.SRC_ALPHA);break;default:console.error("THREE.WebGLState: Invalid blending: ",B);break}else switch(B){case as:i.blendFuncSeparate(i.SRC_ALPHA,i.ONE_MINUS_SRC_ALPHA,i.ONE,i.ONE_MINUS_SRC_ALPHA);break;case fu:i.blendFunc(i.SRC_ALPHA,i.ONE);break;case pu:i.blendFuncSeparate(i.ZERO,i.ONE_MINUS_SRC_COLOR,i.ZERO,i.ONE);break;case mu:i.blendFunc(i.ZERO,i.SRC_COLOR);break;default:console.error("THREE.WebGLState: Invalid blending: ",B);break}M=null,x=null,D=null,P=null,T.set(0,0,0),N=0,m=B,v=It}return}Ne=Ne||De,Ie=Ie||de,ft=ft||_e,(De!==f||Ne!==_)&&(i.blendEquationSeparate(Ce[De],Ce[Ne]),f=De,_=Ne),(de!==M||_e!==x||Ie!==D||ft!==P)&&(i.blendFuncSeparate(st[de],st[_e],st[Ie],st[ft]),M=de,x=_e,D=Ie,P=ft),($t.equals(T)===!1||fn!==N)&&(i.blendColor($t.r,$t.g,$t.b,fn),T.copy($t),N=fn),m=B,v=!1}function Nt(B,De){B.side===xi?Te(i.CULL_FACE):me(i.CULL_FACE);let de=B.side===Cn;De&&(de=!de),pt(de),B.blending===as&&B.transparent===!1?F(ur):F(B.blending,B.blendEquation,B.blendSrc,B.blendDst,B.blendEquationAlpha,B.blendSrcAlpha,B.blendDstAlpha,B.blendColor,B.blendAlpha,B.premultipliedAlpha),o.setFunc(B.depthFunc),o.setTest(B.depthTest),o.setMask(B.depthWrite),s.setMask(B.colorWrite);const _e=B.stencilWrite;a.setTest(_e),_e&&(a.setMask(B.stencilWriteMask),a.setFunc(B.stencilFunc,B.stencilRef,B.stencilFuncMask),a.setOp(B.stencilFail,B.stencilZFail,B.stencilZPass)),Ut(B.polygonOffset,B.polygonOffsetFactor,B.polygonOffsetUnits),B.alphaToCoverage===!0?me(i.SAMPLE_ALPHA_TO_COVERAGE):Te(i.SAMPLE_ALPHA_TO_COVERAGE)}function pt(B){y!==B&&(B?i.frontFace(i.CW):i.frontFace(i.CCW),y=B)}function ct(B){B!==Pf?(me(i.CULL_FACE),B!==C&&(B===hu?i.cullFace(i.BACK):B===Lf?i.cullFace(i.FRONT):i.cullFace(i.FRONT_AND_BACK))):Te(i.CULL_FACE),C=B}function Fe(B){B!==q&&(Z&&i.lineWidth(B),q=B)}function Ut(B,De,de){B?(me(i.POLYGON_OFFSET_FILL),(O!==De||$!==de)&&(i.polygonOffset(De,de),O=De,$=de)):Te(i.POLYGON_OFFSET_FILL)}function it(B){B?me(i.SCISSOR_TEST):Te(i.SCISSOR_TEST)}function R(B){B===void 0&&(B=i.TEXTURE0+se-1),k!==B&&(i.activeTexture(B),k=B)}function S(B,De,de){de===void 0&&(k===null?de=i.TEXTURE0+se-1:de=k);let _e=K[de];_e===void 0&&(_e={type:void 0,texture:void 0},K[de]=_e),(_e.type!==B||_e.texture!==De)&&(k!==de&&(i.activeTexture(de),k=de),i.bindTexture(B,De||xe[B]),_e.type=B,_e.texture=De)}function te(){const B=K[k];B!==void 0&&B.type!==void 0&&(i.bindTexture(B.type,null),B.type=void 0,B.texture=void 0)}function ge(){try{i.compressedTexImage2D.apply(i,arguments)}catch(B){console.error("THREE.WebGLState:",B)}}function be(){try{i.compressedTexImage3D.apply(i,arguments)}catch(B){console.error("THREE.WebGLState:",B)}}function fe(){try{i.texSubImage2D.apply(i,arguments)}catch(B){console.error("THREE.WebGLState:",B)}}function Je(){try{i.texSubImage3D.apply(i,arguments)}catch(B){console.error("THREE.WebGLState:",B)}}function Le(){try{i.compressedTexSubImage2D.apply(i,arguments)}catch(B){console.error("THREE.WebGLState:",B)}}function Be(){try{i.compressedTexSubImage3D.apply(i,arguments)}catch(B){console.error("THREE.WebGLState:",B)}}function Ct(){try{i.texStorage2D.apply(i,arguments)}catch(B){console.error("THREE.WebGLState:",B)}}function we(){try{i.texStorage3D.apply(i,arguments)}catch(B){console.error("THREE.WebGLState:",B)}}function ze(){try{i.texImage2D.apply(i,arguments)}catch(B){console.error("THREE.WebGLState:",B)}}function et(){try{i.texImage3D.apply(i,arguments)}catch(B){console.error("THREE.WebGLState:",B)}}function at(B){le.equals(B)===!1&&(i.scissor(B.x,B.y,B.z,B.w),le.copy(B))}function Ge(B){j.equals(B)===!1&&(i.viewport(B.x,B.y,B.z,B.w),j.copy(B))}function St(B,De){let de=c.get(De);de===void 0&&(de=new WeakMap,c.set(De,de));let _e=de.get(B);_e===void 0&&(_e=i.getUniformBlockIndex(De,B.name),de.set(B,_e))}function bt(B,De){const _e=c.get(De).get(B);l.get(De)!==_e&&(i.uniformBlockBinding(De,_e,B.__bindingPointIndex),l.set(De,_e))}function Dt(){i.disable(i.BLEND),i.disable(i.CULL_FACE),i.disable(i.DEPTH_TEST),i.disable(i.POLYGON_OFFSET_FILL),i.disable(i.SCISSOR_TEST),i.disable(i.STENCIL_TEST),i.disable(i.SAMPLE_ALPHA_TO_COVERAGE),i.blendEquation(i.FUNC_ADD),i.blendFunc(i.ONE,i.ZERO),i.blendFuncSeparate(i.ONE,i.ZERO,i.ONE,i.ZERO),i.blendColor(0,0,0,0),i.colorMask(!0,!0,!0,!0),i.clearColor(0,0,0,0),i.depthMask(!0),i.depthFunc(i.LESS),o.setReversed(!1),i.clearDepth(1),i.stencilMask(4294967295),i.stencilFunc(i.ALWAYS,0,4294967295),i.stencilOp(i.KEEP,i.KEEP,i.KEEP),i.clearStencil(0),i.cullFace(i.BACK),i.frontFace(i.CCW),i.polygonOffset(0,0),i.activeTexture(i.TEXTURE0),i.bindFramebuffer(i.FRAMEBUFFER,null),i.bindFramebuffer(i.DRAW_FRAMEBUFFER,null),i.bindFramebuffer(i.READ_FRAMEBUFFER,null),i.useProgram(null),i.lineWidth(1),i.scissor(0,0,i.canvas.width,i.canvas.height),i.viewport(0,0,i.canvas.width,i.canvas.height),u={},k=null,K={},d={},h=new WeakMap,p=[],g=null,b=!1,m=null,f=null,M=null,x=null,_=null,D=null,P=null,T=new rt(0,0,0),N=0,v=!1,y=null,C=null,q=null,O=null,$=null,le.set(0,0,i.canvas.width,i.canvas.height),j.set(0,0,i.canvas.width,i.canvas.height),s.reset(),o.reset(),a.reset()}return{buffers:{color:s,depth:o,stencil:a},enable:me,disable:Te,bindFramebuffer:ke,drawBuffers:He,useProgram:Ze,setBlending:F,setMaterial:Nt,setFlipSided:pt,setCullFace:ct,setLineWidth:Fe,setPolygonOffset:Ut,setScissorTest:it,activeTexture:R,bindTexture:S,unbindTexture:te,compressedTexImage2D:ge,compressedTexImage3D:be,texImage2D:ze,texImage3D:et,updateUBOMapping:St,uniformBlockBinding:bt,texStorage2D:Ct,texStorage3D:we,texSubImage2D:fe,texSubImage3D:Je,compressedTexSubImage2D:Le,compressedTexSubImage3D:Be,scissor:at,viewport:Ge,reset:Dt}}function hd(i,e,t,n){const r=I_(n);switch(t){case ph:return i*e;case gh:return i*e;case bh:return i*e*2;case Hl:return i*e/r.components*r.byteLength;case Gl:return i*e/r.components*r.byteLength;case _h:return i*e*2/r.components*r.byteLength;case Vl:return i*e*2/r.components*r.byteLength;case mh:return i*e*3/r.components*r.byteLength;case ei:return i*e*4/r.components*r.byteLength;case Wl:return i*e*4/r.components*r.byteLength;case ia:case ra:return Math.floor((i+3)/4)*Math.floor((e+3)/4)*8;case sa:case oa:return Math.floor((i+3)/4)*Math.floor((e+3)/4)*16;case Kc:case $c:return Math.max(i,16)*Math.max(e,8)/4;case Qc:case Yc:return Math.max(i,8)*Math.max(e,8)/2;case Zc:case Jc:return Math.floor((i+3)/4)*Math.floor((e+3)/4)*8;case el:return Math.floor((i+3)/4)*Math.floor((e+3)/4)*16;case tl:return Math.floor((i+3)/4)*Math.floor((e+3)/4)*16;case nl:return Math.floor((i+4)/5)*Math.floor((e+3)/4)*16;case il:return Math.floor((i+4)/5)*Math.floor((e+4)/5)*16;case rl:return Math.floor((i+5)/6)*Math.floor((e+4)/5)*16;case sl:return Math.floor((i+5)/6)*Math.floor((e+5)/6)*16;case ol:return Math.floor((i+7)/8)*Math.floor((e+4)/5)*16;case al:return Math.floor((i+7)/8)*Math.floor((e+5)/6)*16;case cl:return Math.floor((i+7)/8)*Math.floor((e+7)/8)*16;case ll:return Math.floor((i+9)/10)*Math.floor((e+4)/5)*16;case ul:return Math.floor((i+9)/10)*Math.floor((e+5)/6)*16;case dl:return Math.floor((i+9)/10)*Math.floor((e+7)/8)*16;case hl:return Math.floor((i+9)/10)*Math.floor((e+9)/10)*16;case fl:return Math.floor((i+11)/12)*Math.floor((e+9)/10)*16;case pl:return Math.floor((i+11)/12)*Math.floor((e+11)/12)*16;case aa:case ml:case gl:return Math.ceil(i/4)*Math.ceil(e/4)*16;case xh:case bl:return Math.ceil(i/4)*Math.ceil(e/4)*8;case _l:case xl:return Math.ceil(i/4)*Math.ceil(e/4)*16}throw new Error(`Unable to determine texture byte length for ${t} format.`)}function I_(i){switch(i){case Xi:case dh:return{byteLength:1,components:1};case ro:case hh:case uo:return{byteLength:2,components:1};case Bl:case zl:return{byteLength:2,components:4};case Fr:case kl:case li:return{byteLength:4,components:1};case fh:return{byteLength:4,components:3}}throw new Error(`Unknown texture type ${i}.`)}function F_(i,e,t,n,r,s,o){const a=e.has("WEBGL_multisampled_render_to_texture")?e.get("WEBGL_multisampled_render_to_texture"):null,l=typeof navigator>"u"?!1:/OculusBrowser/g.test(navigator.userAgent),c=new ut,u=new WeakMap;let d;const h=new WeakMap;let p=!1;try{p=typeof OffscreenCanvas<"u"&&new OffscreenCanvas(1,1).getContext("2d")!==null}catch{}function g(R,S){return p?new OffscreenCanvas(R,S):ao("canvas")}function b(R,S,te){let ge=1;const be=it(R);if((be.width>te||be.height>te)&&(ge=te/Math.max(be.width,be.height)),ge<1)if(typeof HTMLImageElement<"u"&&R instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&R instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&R instanceof ImageBitmap||typeof VideoFrame<"u"&&R instanceof VideoFrame){const fe=Math.floor(ge*be.width),Je=Math.floor(ge*be.height);d===void 0&&(d=g(fe,Je));const Le=S?g(fe,Je):d;return Le.width=fe,Le.height=Je,Le.getContext("2d").drawImage(R,0,0,fe,Je),console.warn("THREE.WebGLRenderer: Texture has been resized from ("+be.width+"x"+be.height+") to ("+fe+"x"+Je+")."),Le}else return"data"in R&&console.warn("THREE.WebGLRenderer: Image in DataTexture is too big ("+be.width+"x"+be.height+")."),R;return R}function m(R){return R.generateMipmaps}function f(R){i.generateMipmap(R)}function M(R){return R.isWebGLCubeRenderTarget?i.TEXTURE_CUBE_MAP:R.isWebGL3DRenderTarget?i.TEXTURE_3D:R.isWebGLArrayRenderTarget||R.isCompressedArrayTexture?i.TEXTURE_2D_ARRAY:i.TEXTURE_2D}function x(R,S,te,ge,be=!1){if(R!==null){if(i[R]!==void 0)return i[R];console.warn("THREE.WebGLRenderer: Attempt to use non-existing WebGL internal format '"+R+"'")}let fe=S;if(S===i.RED&&(te===i.FLOAT&&(fe=i.R32F),te===i.HALF_FLOAT&&(fe=i.R16F),te===i.UNSIGNED_BYTE&&(fe=i.R8)),S===i.RED_INTEGER&&(te===i.UNSIGNED_BYTE&&(fe=i.R8UI),te===i.UNSIGNED_SHORT&&(fe=i.R16UI),te===i.UNSIGNED_INT&&(fe=i.R32UI),te===i.BYTE&&(fe=i.R8I),te===i.SHORT&&(fe=i.R16I),te===i.INT&&(fe=i.R32I)),S===i.RG&&(te===i.FLOAT&&(fe=i.RG32F),te===i.HALF_FLOAT&&(fe=i.RG16F),te===i.UNSIGNED_BYTE&&(fe=i.RG8)),S===i.RG_INTEGER&&(te===i.UNSIGNED_BYTE&&(fe=i.RG8UI),te===i.UNSIGNED_SHORT&&(fe=i.RG16UI),te===i.UNSIGNED_INT&&(fe=i.RG32UI),te===i.BYTE&&(fe=i.RG8I),te===i.SHORT&&(fe=i.RG16I),te===i.INT&&(fe=i.RG32I)),S===i.RGB_INTEGER&&(te===i.UNSIGNED_BYTE&&(fe=i.RGB8UI),te===i.UNSIGNED_SHORT&&(fe=i.RGB16UI),te===i.UNSIGNED_INT&&(fe=i.RGB32UI),te===i.BYTE&&(fe=i.RGB8I),te===i.SHORT&&(fe=i.RGB16I),te===i.INT&&(fe=i.RGB32I)),S===i.RGBA_INTEGER&&(te===i.UNSIGNED_BYTE&&(fe=i.RGBA8UI),te===i.UNSIGNED_SHORT&&(fe=i.RGBA16UI),te===i.UNSIGNED_INT&&(fe=i.RGBA32UI),te===i.BYTE&&(fe=i.RGBA8I),te===i.SHORT&&(fe=i.RGBA16I),te===i.INT&&(fe=i.RGBA32I)),S===i.RGB&&te===i.UNSIGNED_INT_5_9_9_9_REV&&(fe=i.RGB9_E5),S===i.RGBA){const Je=be?Ra:Pt.getTransfer(ge);te===i.FLOAT&&(fe=i.RGBA32F),te===i.HALF_FLOAT&&(fe=i.RGBA16F),te===i.UNSIGNED_BYTE&&(fe=Je===jt?i.SRGB8_ALPHA8:i.RGBA8),te===i.UNSIGNED_SHORT_4_4_4_4&&(fe=i.RGBA4),te===i.UNSIGNED_SHORT_5_5_5_1&&(fe=i.RGB5_A1)}return(fe===i.R16F||fe===i.R32F||fe===i.RG16F||fe===i.RG32F||fe===i.RGBA16F||fe===i.RGBA32F)&&e.get("EXT_color_buffer_float"),fe}function _(R,S){let te;return R?S===null||S===Fr||S===xs?te=i.DEPTH24_STENCIL8:S===li?te=i.DEPTH32F_STENCIL8:S===ro&&(te=i.DEPTH24_STENCIL8,console.warn("DepthTexture: 16 bit depth attachment is not supported with stencil. Using 24-bit attachment.")):S===null||S===Fr||S===xs?te=i.DEPTH_COMPONENT24:S===li?te=i.DEPTH_COMPONENT32F:S===ro&&(te=i.DEPTH_COMPONENT16),te}function D(R,S){return m(R)===!0||R.isFramebufferTexture&&R.minFilter!==Pn&&R.minFilter!==jn?Math.log2(Math.max(S.width,S.height))+1:R.mipmaps!==void 0&&R.mipmaps.length>0?R.mipmaps.length:R.isCompressedTexture&&Array.isArray(R.image)?S.mipmaps.length:1}function P(R){const S=R.target;S.removeEventListener("dispose",P),N(S),S.isVideoTexture&&u.delete(S)}function T(R){const S=R.target;S.removeEventListener("dispose",T),y(S)}function N(R){const S=n.get(R);if(S.__webglInit===void 0)return;const te=R.source,ge=h.get(te);if(ge){const be=ge[S.__cacheKey];be.usedTimes--,be.usedTimes===0&&v(R),Object.keys(ge).length===0&&h.delete(te)}n.remove(R)}function v(R){const S=n.get(R);i.deleteTexture(S.__webglTexture);const te=R.source,ge=h.get(te);delete ge[S.__cacheKey],o.memory.textures--}function y(R){const S=n.get(R);if(R.depthTexture&&(R.depthTexture.dispose(),n.remove(R.depthTexture)),R.isWebGLCubeRenderTarget)for(let ge=0;ge<6;ge++){if(Array.isArray(S.__webglFramebuffer[ge]))for(let be=0;be<S.__webglFramebuffer[ge].length;be++)i.deleteFramebuffer(S.__webglFramebuffer[ge][be]);else i.deleteFramebuffer(S.__webglFramebuffer[ge]);S.__webglDepthbuffer&&i.deleteRenderbuffer(S.__webglDepthbuffer[ge])}else{if(Array.isArray(S.__webglFramebuffer))for(let ge=0;ge<S.__webglFramebuffer.length;ge++)i.deleteFramebuffer(S.__webglFramebuffer[ge]);else i.deleteFramebuffer(S.__webglFramebuffer);if(S.__webglDepthbuffer&&i.deleteRenderbuffer(S.__webglDepthbuffer),S.__webglMultisampledFramebuffer&&i.deleteFramebuffer(S.__webglMultisampledFramebuffer),S.__webglColorRenderbuffer)for(let ge=0;ge<S.__webglColorRenderbuffer.length;ge++)S.__webglColorRenderbuffer[ge]&&i.deleteRenderbuffer(S.__webglColorRenderbuffer[ge]);S.__webglDepthRenderbuffer&&i.deleteRenderbuffer(S.__webglDepthRenderbuffer)}const te=R.textures;for(let ge=0,be=te.length;ge<be;ge++){const fe=n.get(te[ge]);fe.__webglTexture&&(i.deleteTexture(fe.__webglTexture),o.memory.textures--),n.remove(te[ge])}n.remove(R)}let C=0;function q(){C=0}function O(){const R=C;return R>=r.maxTextures&&console.warn("THREE.WebGLTextures: Trying to use "+R+" texture units while this GPU supports only "+r.maxTextures),C+=1,R}function $(R){const S=[];return S.push(R.wrapS),S.push(R.wrapT),S.push(R.wrapR||0),S.push(R.magFilter),S.push(R.minFilter),S.push(R.anisotropy),S.push(R.internalFormat),S.push(R.format),S.push(R.type),S.push(R.generateMipmaps),S.push(R.premultiplyAlpha),S.push(R.flipY),S.push(R.unpackAlignment),S.push(R.colorSpace),S.join()}function se(R,S){const te=n.get(R);if(R.isVideoTexture&&Fe(R),R.isRenderTargetTexture===!1&&R.version>0&&te.__version!==R.version){const ge=R.image;if(ge===null)console.warn("THREE.WebGLRenderer: Texture marked for update but no image data found.");else if(ge.complete===!1)console.warn("THREE.WebGLRenderer: Texture marked for update but image is incomplete");else{j(te,R,S);return}}t.bindTexture(i.TEXTURE_2D,te.__webglTexture,i.TEXTURE0+S)}function Z(R,S){const te=n.get(R);if(R.version>0&&te.__version!==R.version){j(te,R,S);return}t.bindTexture(i.TEXTURE_2D_ARRAY,te.__webglTexture,i.TEXTURE0+S)}function ce(R,S){const te=n.get(R);if(R.version>0&&te.__version!==R.version){j(te,R,S);return}t.bindTexture(i.TEXTURE_3D,te.__webglTexture,i.TEXTURE0+S)}function L(R,S){const te=n.get(R);if(R.version>0&&te.__version!==R.version){oe(te,R,S);return}t.bindTexture(i.TEXTURE_CUBE_MAP,te.__webglTexture,i.TEXTURE0+S)}const k={[_s]:i.REPEAT,[cr]:i.CLAMP_TO_EDGE,[ma]:i.MIRRORED_REPEAT},K={[Pn]:i.NEAREST,[uh]:i.NEAREST_MIPMAP_NEAREST,[Ks]:i.NEAREST_MIPMAP_LINEAR,[jn]:i.LINEAR,[na]:i.LINEAR_MIPMAP_NEAREST,[zi]:i.LINEAR_MIPMAP_LINEAR},X={[up]:i.NEVER,[gp]:i.ALWAYS,[dp]:i.LESS,[Mh]:i.LEQUAL,[hp]:i.EQUAL,[mp]:i.GEQUAL,[fp]:i.GREATER,[pp]:i.NOTEQUAL};function ee(R,S){if(S.type===li&&e.has("OES_texture_float_linear")===!1&&(S.magFilter===jn||S.magFilter===na||S.magFilter===Ks||S.magFilter===zi||S.minFilter===jn||S.minFilter===na||S.minFilter===Ks||S.minFilter===zi)&&console.warn("THREE.WebGLRenderer: Unable to use linear filtering with floating point textures. OES_texture_float_linear not supported on this device."),i.texParameteri(R,i.TEXTURE_WRAP_S,k[S.wrapS]),i.texParameteri(R,i.TEXTURE_WRAP_T,k[S.wrapT]),(R===i.TEXTURE_3D||R===i.TEXTURE_2D_ARRAY)&&i.texParameteri(R,i.TEXTURE_WRAP_R,k[S.wrapR]),i.texParameteri(R,i.TEXTURE_MAG_FILTER,K[S.magFilter]),i.texParameteri(R,i.TEXTURE_MIN_FILTER,K[S.minFilter]),S.compareFunction&&(i.texParameteri(R,i.TEXTURE_COMPARE_MODE,i.COMPARE_REF_TO_TEXTURE),i.texParameteri(R,i.TEXTURE_COMPARE_FUNC,X[S.compareFunction])),e.has("EXT_texture_filter_anisotropic")===!0){if(S.magFilter===Pn||S.minFilter!==Ks&&S.minFilter!==zi||S.type===li&&e.has("OES_texture_float_linear")===!1)return;if(S.anisotropy>1||n.get(S).__currentAnisotropy){const te=e.get("EXT_texture_filter_anisotropic");i.texParameterf(R,te.TEXTURE_MAX_ANISOTROPY_EXT,Math.min(S.anisotropy,r.getMaxAnisotropy())),n.get(S).__currentAnisotropy=S.anisotropy}}}function le(R,S){let te=!1;R.__webglInit===void 0&&(R.__webglInit=!0,S.addEventListener("dispose",P));const ge=S.source;let be=h.get(ge);be===void 0&&(be={},h.set(ge,be));const fe=$(S);if(fe!==R.__cacheKey){be[fe]===void 0&&(be[fe]={texture:i.createTexture(),usedTimes:0},o.memory.textures++,te=!0),be[fe].usedTimes++;const Je=be[R.__cacheKey];Je!==void 0&&(be[R.__cacheKey].usedTimes--,Je.usedTimes===0&&v(S)),R.__cacheKey=fe,R.__webglTexture=be[fe].texture}return te}function j(R,S,te){let ge=i.TEXTURE_2D;(S.isDataArrayTexture||S.isCompressedArrayTexture)&&(ge=i.TEXTURE_2D_ARRAY),S.isData3DTexture&&(ge=i.TEXTURE_3D);const be=le(R,S),fe=S.source;t.bindTexture(ge,R.__webglTexture,i.TEXTURE0+te);const Je=n.get(fe);if(fe.version!==Je.__version||be===!0){t.activeTexture(i.TEXTURE0+te);const Le=Pt.getPrimaries(Pt.workingColorSpace),Be=S.colorSpace===or?null:Pt.getPrimaries(S.colorSpace),Ct=S.colorSpace===or||Le===Be?i.NONE:i.BROWSER_DEFAULT_WEBGL;i.pixelStorei(i.UNPACK_FLIP_Y_WEBGL,S.flipY),i.pixelStorei(i.UNPACK_PREMULTIPLY_ALPHA_WEBGL,S.premultiplyAlpha),i.pixelStorei(i.UNPACK_ALIGNMENT,S.unpackAlignment),i.pixelStorei(i.UNPACK_COLORSPACE_CONVERSION_WEBGL,Ct);let we=b(S.image,!1,r.maxTextureSize);we=Ut(S,we);const ze=s.convert(S.format,S.colorSpace),et=s.convert(S.type);let at=x(S.internalFormat,ze,et,S.colorSpace,S.isVideoTexture);ee(ge,S);let Ge;const St=S.mipmaps,bt=S.isVideoTexture!==!0,Dt=Je.__version===void 0||be===!0,B=fe.dataReady,De=D(S,we);if(S.isDepthTexture)at=_(S.format===vs,S.type),Dt&&(bt?t.texStorage2D(i.TEXTURE_2D,1,at,we.width,we.height):t.texImage2D(i.TEXTURE_2D,0,at,we.width,we.height,0,ze,et,null));else if(S.isDataTexture)if(St.length>0){bt&&Dt&&t.texStorage2D(i.TEXTURE_2D,De,at,St[0].width,St[0].height);for(let de=0,_e=St.length;de<_e;de++)Ge=St[de],bt?B&&t.texSubImage2D(i.TEXTURE_2D,de,0,0,Ge.width,Ge.height,ze,et,Ge.data):t.texImage2D(i.TEXTURE_2D,de,at,Ge.width,Ge.height,0,ze,et,Ge.data);S.generateMipmaps=!1}else bt?(Dt&&t.texStorage2D(i.TEXTURE_2D,De,at,we.width,we.height),B&&t.texSubImage2D(i.TEXTURE_2D,0,0,0,we.width,we.height,ze,et,we.data)):t.texImage2D(i.TEXTURE_2D,0,at,we.width,we.height,0,ze,et,we.data);else if(S.isCompressedTexture)if(S.isCompressedArrayTexture){bt&&Dt&&t.texStorage3D(i.TEXTURE_2D_ARRAY,De,at,St[0].width,St[0].height,we.depth);for(let de=0,_e=St.length;de<_e;de++)if(Ge=St[de],S.format!==ei)if(ze!==null)if(bt){if(B)if(S.layerUpdates.size>0){const Ne=hd(Ge.width,Ge.height,S.format,S.type);for(const Ie of S.layerUpdates){const ft=Ge.data.subarray(Ie*Ne/Ge.data.BYTES_PER_ELEMENT,(Ie+1)*Ne/Ge.data.BYTES_PER_ELEMENT);t.compressedTexSubImage3D(i.TEXTURE_2D_ARRAY,de,0,0,Ie,Ge.width,Ge.height,1,ze,ft)}S.clearLayerUpdates()}else t.compressedTexSubImage3D(i.TEXTURE_2D_ARRAY,de,0,0,0,Ge.width,Ge.height,we.depth,ze,Ge.data)}else t.compressedTexImage3D(i.TEXTURE_2D_ARRAY,de,at,Ge.width,Ge.height,we.depth,0,Ge.data,0,0);else console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()");else bt?B&&t.texSubImage3D(i.TEXTURE_2D_ARRAY,de,0,0,0,Ge.width,Ge.height,we.depth,ze,et,Ge.data):t.texImage3D(i.TEXTURE_2D_ARRAY,de,at,Ge.width,Ge.height,we.depth,0,ze,et,Ge.data)}else{bt&&Dt&&t.texStorage2D(i.TEXTURE_2D,De,at,St[0].width,St[0].height);for(let de=0,_e=St.length;de<_e;de++)Ge=St[de],S.format!==ei?ze!==null?bt?B&&t.compressedTexSubImage2D(i.TEXTURE_2D,de,0,0,Ge.width,Ge.height,ze,Ge.data):t.compressedTexImage2D(i.TEXTURE_2D,de,at,Ge.width,Ge.height,0,Ge.data):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()"):bt?B&&t.texSubImage2D(i.TEXTURE_2D,de,0,0,Ge.width,Ge.height,ze,et,Ge.data):t.texImage2D(i.TEXTURE_2D,de,at,Ge.width,Ge.height,0,ze,et,Ge.data)}else if(S.isDataArrayTexture)if(bt){if(Dt&&t.texStorage3D(i.TEXTURE_2D_ARRAY,De,at,we.width,we.height,we.depth),B)if(S.layerUpdates.size>0){const de=hd(we.width,we.height,S.format,S.type);for(const _e of S.layerUpdates){const Ne=we.data.subarray(_e*de/we.data.BYTES_PER_ELEMENT,(_e+1)*de/we.data.BYTES_PER_ELEMENT);t.texSubImage3D(i.TEXTURE_2D_ARRAY,0,0,0,_e,we.width,we.height,1,ze,et,Ne)}S.clearLayerUpdates()}else t.texSubImage3D(i.TEXTURE_2D_ARRAY,0,0,0,0,we.width,we.height,we.depth,ze,et,we.data)}else t.texImage3D(i.TEXTURE_2D_ARRAY,0,at,we.width,we.height,we.depth,0,ze,et,we.data);else if(S.isData3DTexture)bt?(Dt&&t.texStorage3D(i.TEXTURE_3D,De,at,we.width,we.height,we.depth),B&&t.texSubImage3D(i.TEXTURE_3D,0,0,0,0,we.width,we.height,we.depth,ze,et,we.data)):t.texImage3D(i.TEXTURE_3D,0,at,we.width,we.height,we.depth,0,ze,et,we.data);else if(S.isFramebufferTexture){if(Dt)if(bt)t.texStorage2D(i.TEXTURE_2D,De,at,we.width,we.height);else{let de=we.width,_e=we.height;for(let Ne=0;Ne<De;Ne++)t.texImage2D(i.TEXTURE_2D,Ne,at,de,_e,0,ze,et,null),de>>=1,_e>>=1}}else if(St.length>0){if(bt&&Dt){const de=it(St[0]);t.texStorage2D(i.TEXTURE_2D,De,at,de.width,de.height)}for(let de=0,_e=St.length;de<_e;de++)Ge=St[de],bt?B&&t.texSubImage2D(i.TEXTURE_2D,de,0,0,ze,et,Ge):t.texImage2D(i.TEXTURE_2D,de,at,ze,et,Ge);S.generateMipmaps=!1}else if(bt){if(Dt){const de=it(we);t.texStorage2D(i.TEXTURE_2D,De,at,de.width,de.height)}B&&t.texSubImage2D(i.TEXTURE_2D,0,0,0,ze,et,we)}else t.texImage2D(i.TEXTURE_2D,0,at,ze,et,we);m(S)&&f(ge),Je.__version=fe.version,S.onUpdate&&S.onUpdate(S)}R.__version=S.version}function oe(R,S,te){if(S.image.length!==6)return;const ge=le(R,S),be=S.source;t.bindTexture(i.TEXTURE_CUBE_MAP,R.__webglTexture,i.TEXTURE0+te);const fe=n.get(be);if(be.version!==fe.__version||ge===!0){t.activeTexture(i.TEXTURE0+te);const Je=Pt.getPrimaries(Pt.workingColorSpace),Le=S.colorSpace===or?null:Pt.getPrimaries(S.colorSpace),Be=S.colorSpace===or||Je===Le?i.NONE:i.BROWSER_DEFAULT_WEBGL;i.pixelStorei(i.UNPACK_FLIP_Y_WEBGL,S.flipY),i.pixelStorei(i.UNPACK_PREMULTIPLY_ALPHA_WEBGL,S.premultiplyAlpha),i.pixelStorei(i.UNPACK_ALIGNMENT,S.unpackAlignment),i.pixelStorei(i.UNPACK_COLORSPACE_CONVERSION_WEBGL,Be);const Ct=S.isCompressedTexture||S.image[0].isCompressedTexture,we=S.image[0]&&S.image[0].isDataTexture,ze=[];for(let _e=0;_e<6;_e++)!Ct&&!we?ze[_e]=b(S.image[_e],!0,r.maxCubemapSize):ze[_e]=we?S.image[_e].image:S.image[_e],ze[_e]=Ut(S,ze[_e]);const et=ze[0],at=s.convert(S.format,S.colorSpace),Ge=s.convert(S.type),St=x(S.internalFormat,at,Ge,S.colorSpace),bt=S.isVideoTexture!==!0,Dt=fe.__version===void 0||ge===!0,B=be.dataReady;let De=D(S,et);ee(i.TEXTURE_CUBE_MAP,S);let de;if(Ct){bt&&Dt&&t.texStorage2D(i.TEXTURE_CUBE_MAP,De,St,et.width,et.height);for(let _e=0;_e<6;_e++){de=ze[_e].mipmaps;for(let Ne=0;Ne<de.length;Ne++){const Ie=de[Ne];S.format!==ei?at!==null?bt?B&&t.compressedTexSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+_e,Ne,0,0,Ie.width,Ie.height,at,Ie.data):t.compressedTexImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+_e,Ne,St,Ie.width,Ie.height,0,Ie.data):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .setTextureCube()"):bt?B&&t.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+_e,Ne,0,0,Ie.width,Ie.height,at,Ge,Ie.data):t.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+_e,Ne,St,Ie.width,Ie.height,0,at,Ge,Ie.data)}}}else{if(de=S.mipmaps,bt&&Dt){de.length>0&&De++;const _e=it(ze[0]);t.texStorage2D(i.TEXTURE_CUBE_MAP,De,St,_e.width,_e.height)}for(let _e=0;_e<6;_e++)if(we){bt?B&&t.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+_e,0,0,0,ze[_e].width,ze[_e].height,at,Ge,ze[_e].data):t.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+_e,0,St,ze[_e].width,ze[_e].height,0,at,Ge,ze[_e].data);for(let Ne=0;Ne<de.length;Ne++){const ft=de[Ne].image[_e].image;bt?B&&t.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+_e,Ne+1,0,0,ft.width,ft.height,at,Ge,ft.data):t.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+_e,Ne+1,St,ft.width,ft.height,0,at,Ge,ft.data)}}else{bt?B&&t.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+_e,0,0,0,at,Ge,ze[_e]):t.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+_e,0,St,at,Ge,ze[_e]);for(let Ne=0;Ne<de.length;Ne++){const Ie=de[Ne];bt?B&&t.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+_e,Ne+1,0,0,at,Ge,Ie.image[_e]):t.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+_e,Ne+1,St,at,Ge,Ie.image[_e])}}}m(S)&&f(i.TEXTURE_CUBE_MAP),fe.__version=be.version,S.onUpdate&&S.onUpdate(S)}R.__version=S.version}function xe(R,S,te,ge,be,fe){const Je=s.convert(te.format,te.colorSpace),Le=s.convert(te.type),Be=x(te.internalFormat,Je,Le,te.colorSpace),Ct=n.get(S),we=n.get(te);if(we.__renderTarget=S,!Ct.__hasExternalTextures){const ze=Math.max(1,S.width>>fe),et=Math.max(1,S.height>>fe);be===i.TEXTURE_3D||be===i.TEXTURE_2D_ARRAY?t.texImage3D(be,fe,Be,ze,et,S.depth,0,Je,Le,null):t.texImage2D(be,fe,Be,ze,et,0,Je,Le,null)}t.bindFramebuffer(i.FRAMEBUFFER,R),ct(S)?a.framebufferTexture2DMultisampleEXT(i.FRAMEBUFFER,ge,be,we.__webglTexture,0,pt(S)):(be===i.TEXTURE_2D||be>=i.TEXTURE_CUBE_MAP_POSITIVE_X&&be<=i.TEXTURE_CUBE_MAP_NEGATIVE_Z)&&i.framebufferTexture2D(i.FRAMEBUFFER,ge,be,we.__webglTexture,fe),t.bindFramebuffer(i.FRAMEBUFFER,null)}function me(R,S,te){if(i.bindRenderbuffer(i.RENDERBUFFER,R),S.depthBuffer){const ge=S.depthTexture,be=ge&&ge.isDepthTexture?ge.type:null,fe=_(S.stencilBuffer,be),Je=S.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT,Le=pt(S);ct(S)?a.renderbufferStorageMultisampleEXT(i.RENDERBUFFER,Le,fe,S.width,S.height):te?i.renderbufferStorageMultisample(i.RENDERBUFFER,Le,fe,S.width,S.height):i.renderbufferStorage(i.RENDERBUFFER,fe,S.width,S.height),i.framebufferRenderbuffer(i.FRAMEBUFFER,Je,i.RENDERBUFFER,R)}else{const ge=S.textures;for(let be=0;be<ge.length;be++){const fe=ge[be],Je=s.convert(fe.format,fe.colorSpace),Le=s.convert(fe.type),Be=x(fe.internalFormat,Je,Le,fe.colorSpace),Ct=pt(S);te&&ct(S)===!1?i.renderbufferStorageMultisample(i.RENDERBUFFER,Ct,Be,S.width,S.height):ct(S)?a.renderbufferStorageMultisampleEXT(i.RENDERBUFFER,Ct,Be,S.width,S.height):i.renderbufferStorage(i.RENDERBUFFER,Be,S.width,S.height)}}i.bindRenderbuffer(i.RENDERBUFFER,null)}function Te(R,S){if(S&&S.isWebGLCubeRenderTarget)throw new Error("Depth Texture with cube render targets is not supported");if(t.bindFramebuffer(i.FRAMEBUFFER,R),!(S.depthTexture&&S.depthTexture.isDepthTexture))throw new Error("renderTarget.depthTexture must be an instance of THREE.DepthTexture");const ge=n.get(S.depthTexture);ge.__renderTarget=S,(!ge.__webglTexture||S.depthTexture.image.width!==S.width||S.depthTexture.image.height!==S.height)&&(S.depthTexture.image.width=S.width,S.depthTexture.image.height=S.height,S.depthTexture.needsUpdate=!0),se(S.depthTexture,0);const be=ge.__webglTexture,fe=pt(S);if(S.depthTexture.format===cs)ct(S)?a.framebufferTexture2DMultisampleEXT(i.FRAMEBUFFER,i.DEPTH_ATTACHMENT,i.TEXTURE_2D,be,0,fe):i.framebufferTexture2D(i.FRAMEBUFFER,i.DEPTH_ATTACHMENT,i.TEXTURE_2D,be,0);else if(S.depthTexture.format===vs)ct(S)?a.framebufferTexture2DMultisampleEXT(i.FRAMEBUFFER,i.DEPTH_STENCIL_ATTACHMENT,i.TEXTURE_2D,be,0,fe):i.framebufferTexture2D(i.FRAMEBUFFER,i.DEPTH_STENCIL_ATTACHMENT,i.TEXTURE_2D,be,0);else throw new Error("Unknown depthTexture format")}function ke(R){const S=n.get(R),te=R.isWebGLCubeRenderTarget===!0;if(S.__boundDepthTexture!==R.depthTexture){const ge=R.depthTexture;if(S.__depthDisposeCallback&&S.__depthDisposeCallback(),ge){const be=()=>{delete S.__boundDepthTexture,delete S.__depthDisposeCallback,ge.removeEventListener("dispose",be)};ge.addEventListener("dispose",be),S.__depthDisposeCallback=be}S.__boundDepthTexture=ge}if(R.depthTexture&&!S.__autoAllocateDepthBuffer){if(te)throw new Error("target.depthTexture not supported in Cube render targets");Te(S.__webglFramebuffer,R)}else if(te){S.__webglDepthbuffer=[];for(let ge=0;ge<6;ge++)if(t.bindFramebuffer(i.FRAMEBUFFER,S.__webglFramebuffer[ge]),S.__webglDepthbuffer[ge]===void 0)S.__webglDepthbuffer[ge]=i.createRenderbuffer(),me(S.__webglDepthbuffer[ge],R,!1);else{const be=R.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT,fe=S.__webglDepthbuffer[ge];i.bindRenderbuffer(i.RENDERBUFFER,fe),i.framebufferRenderbuffer(i.FRAMEBUFFER,be,i.RENDERBUFFER,fe)}}else if(t.bindFramebuffer(i.FRAMEBUFFER,S.__webglFramebuffer),S.__webglDepthbuffer===void 0)S.__webglDepthbuffer=i.createRenderbuffer(),me(S.__webglDepthbuffer,R,!1);else{const ge=R.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT,be=S.__webglDepthbuffer;i.bindRenderbuffer(i.RENDERBUFFER,be),i.framebufferRenderbuffer(i.FRAMEBUFFER,ge,i.RENDERBUFFER,be)}t.bindFramebuffer(i.FRAMEBUFFER,null)}function He(R,S,te){const ge=n.get(R);S!==void 0&&xe(ge.__webglFramebuffer,R,R.texture,i.COLOR_ATTACHMENT0,i.TEXTURE_2D,0),te!==void 0&&ke(R)}function Ze(R){const S=R.texture,te=n.get(R),ge=n.get(S);R.addEventListener("dispose",T);const be=R.textures,fe=R.isWebGLCubeRenderTarget===!0,Je=be.length>1;if(Je||(ge.__webglTexture===void 0&&(ge.__webglTexture=i.createTexture()),ge.__version=S.version,o.memory.textures++),fe){te.__webglFramebuffer=[];for(let Le=0;Le<6;Le++)if(S.mipmaps&&S.mipmaps.length>0){te.__webglFramebuffer[Le]=[];for(let Be=0;Be<S.mipmaps.length;Be++)te.__webglFramebuffer[Le][Be]=i.createFramebuffer()}else te.__webglFramebuffer[Le]=i.createFramebuffer()}else{if(S.mipmaps&&S.mipmaps.length>0){te.__webglFramebuffer=[];for(let Le=0;Le<S.mipmaps.length;Le++)te.__webglFramebuffer[Le]=i.createFramebuffer()}else te.__webglFramebuffer=i.createFramebuffer();if(Je)for(let Le=0,Be=be.length;Le<Be;Le++){const Ct=n.get(be[Le]);Ct.__webglTexture===void 0&&(Ct.__webglTexture=i.createTexture(),o.memory.textures++)}if(R.samples>0&&ct(R)===!1){te.__webglMultisampledFramebuffer=i.createFramebuffer(),te.__webglColorRenderbuffer=[],t.bindFramebuffer(i.FRAMEBUFFER,te.__webglMultisampledFramebuffer);for(let Le=0;Le<be.length;Le++){const Be=be[Le];te.__webglColorRenderbuffer[Le]=i.createRenderbuffer(),i.bindRenderbuffer(i.RENDERBUFFER,te.__webglColorRenderbuffer[Le]);const Ct=s.convert(Be.format,Be.colorSpace),we=s.convert(Be.type),ze=x(Be.internalFormat,Ct,we,Be.colorSpace,R.isXRRenderTarget===!0),et=pt(R);i.renderbufferStorageMultisample(i.RENDERBUFFER,et,ze,R.width,R.height),i.framebufferRenderbuffer(i.FRAMEBUFFER,i.COLOR_ATTACHMENT0+Le,i.RENDERBUFFER,te.__webglColorRenderbuffer[Le])}i.bindRenderbuffer(i.RENDERBUFFER,null),R.depthBuffer&&(te.__webglDepthRenderbuffer=i.createRenderbuffer(),me(te.__webglDepthRenderbuffer,R,!0)),t.bindFramebuffer(i.FRAMEBUFFER,null)}}if(fe){t.bindTexture(i.TEXTURE_CUBE_MAP,ge.__webglTexture),ee(i.TEXTURE_CUBE_MAP,S);for(let Le=0;Le<6;Le++)if(S.mipmaps&&S.mipmaps.length>0)for(let Be=0;Be<S.mipmaps.length;Be++)xe(te.__webglFramebuffer[Le][Be],R,S,i.COLOR_ATTACHMENT0,i.TEXTURE_CUBE_MAP_POSITIVE_X+Le,Be);else xe(te.__webglFramebuffer[Le],R,S,i.COLOR_ATTACHMENT0,i.TEXTURE_CUBE_MAP_POSITIVE_X+Le,0);m(S)&&f(i.TEXTURE_CUBE_MAP),t.unbindTexture()}else if(Je){for(let Le=0,Be=be.length;Le<Be;Le++){const Ct=be[Le],we=n.get(Ct);t.bindTexture(i.TEXTURE_2D,we.__webglTexture),ee(i.TEXTURE_2D,Ct),xe(te.__webglFramebuffer,R,Ct,i.COLOR_ATTACHMENT0+Le,i.TEXTURE_2D,0),m(Ct)&&f(i.TEXTURE_2D)}t.unbindTexture()}else{let Le=i.TEXTURE_2D;if((R.isWebGL3DRenderTarget||R.isWebGLArrayRenderTarget)&&(Le=R.isWebGL3DRenderTarget?i.TEXTURE_3D:i.TEXTURE_2D_ARRAY),t.bindTexture(Le,ge.__webglTexture),ee(Le,S),S.mipmaps&&S.mipmaps.length>0)for(let Be=0;Be<S.mipmaps.length;Be++)xe(te.__webglFramebuffer[Be],R,S,i.COLOR_ATTACHMENT0,Le,Be);else xe(te.__webglFramebuffer,R,S,i.COLOR_ATTACHMENT0,Le,0);m(S)&&f(Le),t.unbindTexture()}R.depthBuffer&&ke(R)}function Ce(R){const S=R.textures;for(let te=0,ge=S.length;te<ge;te++){const be=S[te];if(m(be)){const fe=M(R),Je=n.get(be).__webglTexture;t.bindTexture(fe,Je),f(fe),t.unbindTexture()}}}const st=[],F=[];function Nt(R){if(R.samples>0){if(ct(R)===!1){const S=R.textures,te=R.width,ge=R.height;let be=i.COLOR_BUFFER_BIT;const fe=R.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT,Je=n.get(R),Le=S.length>1;if(Le)for(let Be=0;Be<S.length;Be++)t.bindFramebuffer(i.FRAMEBUFFER,Je.__webglMultisampledFramebuffer),i.framebufferRenderbuffer(i.FRAMEBUFFER,i.COLOR_ATTACHMENT0+Be,i.RENDERBUFFER,null),t.bindFramebuffer(i.FRAMEBUFFER,Je.__webglFramebuffer),i.framebufferTexture2D(i.DRAW_FRAMEBUFFER,i.COLOR_ATTACHMENT0+Be,i.TEXTURE_2D,null,0);t.bindFramebuffer(i.READ_FRAMEBUFFER,Je.__webglMultisampledFramebuffer),t.bindFramebuffer(i.DRAW_FRAMEBUFFER,Je.__webglFramebuffer);for(let Be=0;Be<S.length;Be++){if(R.resolveDepthBuffer&&(R.depthBuffer&&(be|=i.DEPTH_BUFFER_BIT),R.stencilBuffer&&R.resolveStencilBuffer&&(be|=i.STENCIL_BUFFER_BIT)),Le){i.framebufferRenderbuffer(i.READ_FRAMEBUFFER,i.COLOR_ATTACHMENT0,i.RENDERBUFFER,Je.__webglColorRenderbuffer[Be]);const Ct=n.get(S[Be]).__webglTexture;i.framebufferTexture2D(i.DRAW_FRAMEBUFFER,i.COLOR_ATTACHMENT0,i.TEXTURE_2D,Ct,0)}i.blitFramebuffer(0,0,te,ge,0,0,te,ge,be,i.NEAREST),l===!0&&(st.length=0,F.length=0,st.push(i.COLOR_ATTACHMENT0+Be),R.depthBuffer&&R.resolveDepthBuffer===!1&&(st.push(fe),F.push(fe),i.invalidateFramebuffer(i.DRAW_FRAMEBUFFER,F)),i.invalidateFramebuffer(i.READ_FRAMEBUFFER,st))}if(t.bindFramebuffer(i.READ_FRAMEBUFFER,null),t.bindFramebuffer(i.DRAW_FRAMEBUFFER,null),Le)for(let Be=0;Be<S.length;Be++){t.bindFramebuffer(i.FRAMEBUFFER,Je.__webglMultisampledFramebuffer),i.framebufferRenderbuffer(i.FRAMEBUFFER,i.COLOR_ATTACHMENT0+Be,i.RENDERBUFFER,Je.__webglColorRenderbuffer[Be]);const Ct=n.get(S[Be]).__webglTexture;t.bindFramebuffer(i.FRAMEBUFFER,Je.__webglFramebuffer),i.framebufferTexture2D(i.DRAW_FRAMEBUFFER,i.COLOR_ATTACHMENT0+Be,i.TEXTURE_2D,Ct,0)}t.bindFramebuffer(i.DRAW_FRAMEBUFFER,Je.__webglMultisampledFramebuffer)}else if(R.depthBuffer&&R.resolveDepthBuffer===!1&&l){const S=R.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT;i.invalidateFramebuffer(i.DRAW_FRAMEBUFFER,[S])}}}function pt(R){return Math.min(r.maxSamples,R.samples)}function ct(R){const S=n.get(R);return R.samples>0&&e.has("WEBGL_multisampled_render_to_texture")===!0&&S.__useRenderToTexture!==!1}function Fe(R){const S=o.render.frame;u.get(R)!==S&&(u.set(R,S),R.update())}function Ut(R,S){const te=R.colorSpace,ge=R.format,be=R.type;return R.isCompressedTexture===!0||R.isVideoTexture===!0||te!==Ln&&te!==or&&(Pt.getTransfer(te)===jt?(ge!==ei||be!==Xi)&&console.warn("THREE.WebGLTextures: sRGB encoded textures have to use RGBAFormat and UnsignedByteType."):console.error("THREE.WebGLTextures: Unsupported texture color space:",te)),S}function it(R){return typeof HTMLImageElement<"u"&&R instanceof HTMLImageElement?(c.width=R.naturalWidth||R.width,c.height=R.naturalHeight||R.height):typeof VideoFrame<"u"&&R instanceof VideoFrame?(c.width=R.displayWidth,c.height=R.displayHeight):(c.width=R.width,c.height=R.height),c}this.allocateTextureUnit=O,this.resetTextureUnits=q,this.setTexture2D=se,this.setTexture2DArray=Z,this.setTexture3D=ce,this.setTextureCube=L,this.rebindTextures=He,this.setupRenderTarget=Ze,this.updateRenderTargetMipmap=Ce,this.updateMultisampleRenderTarget=Nt,this.setupDepthRenderbuffer=ke,this.setupFrameBufferTexture=xe,this.useMultisampledRTT=ct}function N_(i,e){function t(n,r=or){let s;const o=Pt.getTransfer(r);if(n===Xi)return i.UNSIGNED_BYTE;if(n===Bl)return i.UNSIGNED_SHORT_4_4_4_4;if(n===zl)return i.UNSIGNED_SHORT_5_5_5_1;if(n===fh)return i.UNSIGNED_INT_5_9_9_9_REV;if(n===dh)return i.BYTE;if(n===hh)return i.SHORT;if(n===ro)return i.UNSIGNED_SHORT;if(n===kl)return i.INT;if(n===Fr)return i.UNSIGNED_INT;if(n===li)return i.FLOAT;if(n===uo)return i.HALF_FLOAT;if(n===ph)return i.ALPHA;if(n===mh)return i.RGB;if(n===ei)return i.RGBA;if(n===gh)return i.LUMINANCE;if(n===bh)return i.LUMINANCE_ALPHA;if(n===cs)return i.DEPTH_COMPONENT;if(n===vs)return i.DEPTH_STENCIL;if(n===Hl)return i.RED;if(n===Gl)return i.RED_INTEGER;if(n===_h)return i.RG;if(n===Vl)return i.RG_INTEGER;if(n===Wl)return i.RGBA_INTEGER;if(n===ia||n===ra||n===sa||n===oa)if(o===jt)if(s=e.get("WEBGL_compressed_texture_s3tc_srgb"),s!==null){if(n===ia)return s.COMPRESSED_SRGB_S3TC_DXT1_EXT;if(n===ra)return s.COMPRESSED_SRGB_ALPHA_S3TC_DXT1_EXT;if(n===sa)return s.COMPRESSED_SRGB_ALPHA_S3TC_DXT3_EXT;if(n===oa)return s.COMPRESSED_SRGB_ALPHA_S3TC_DXT5_EXT}else return null;else if(s=e.get("WEBGL_compressed_texture_s3tc"),s!==null){if(n===ia)return s.COMPRESSED_RGB_S3TC_DXT1_EXT;if(n===ra)return s.COMPRESSED_RGBA_S3TC_DXT1_EXT;if(n===sa)return s.COMPRESSED_RGBA_S3TC_DXT3_EXT;if(n===oa)return s.COMPRESSED_RGBA_S3TC_DXT5_EXT}else return null;if(n===Qc||n===Kc||n===Yc||n===$c)if(s=e.get("WEBGL_compressed_texture_pvrtc"),s!==null){if(n===Qc)return s.COMPRESSED_RGB_PVRTC_4BPPV1_IMG;if(n===Kc)return s.COMPRESSED_RGB_PVRTC_2BPPV1_IMG;if(n===Yc)return s.COMPRESSED_RGBA_PVRTC_4BPPV1_IMG;if(n===$c)return s.COMPRESSED_RGBA_PVRTC_2BPPV1_IMG}else return null;if(n===Zc||n===Jc||n===el)if(s=e.get("WEBGL_compressed_texture_etc"),s!==null){if(n===Zc||n===Jc)return o===jt?s.COMPRESSED_SRGB8_ETC2:s.COMPRESSED_RGB8_ETC2;if(n===el)return o===jt?s.COMPRESSED_SRGB8_ALPHA8_ETC2_EAC:s.COMPRESSED_RGBA8_ETC2_EAC}else return null;if(n===tl||n===nl||n===il||n===rl||n===sl||n===ol||n===al||n===cl||n===ll||n===ul||n===dl||n===hl||n===fl||n===pl)if(s=e.get("WEBGL_compressed_texture_astc"),s!==null){if(n===tl)return o===jt?s.COMPRESSED_SRGB8_ALPHA8_ASTC_4x4_KHR:s.COMPRESSED_RGBA_ASTC_4x4_KHR;if(n===nl)return o===jt?s.COMPRESSED_SRGB8_ALPHA8_ASTC_5x4_KHR:s.COMPRESSED_RGBA_ASTC_5x4_KHR;if(n===il)return o===jt?s.COMPRESSED_SRGB8_ALPHA8_ASTC_5x5_KHR:s.COMPRESSED_RGBA_ASTC_5x5_KHR;if(n===rl)return o===jt?s.COMPRESSED_SRGB8_ALPHA8_ASTC_6x5_KHR:s.COMPRESSED_RGBA_ASTC_6x5_KHR;if(n===sl)return o===jt?s.COMPRESSED_SRGB8_ALPHA8_ASTC_6x6_KHR:s.COMPRESSED_RGBA_ASTC_6x6_KHR;if(n===ol)return o===jt?s.COMPRESSED_SRGB8_ALPHA8_ASTC_8x5_KHR:s.COMPRESSED_RGBA_ASTC_8x5_KHR;if(n===al)return o===jt?s.COMPRESSED_SRGB8_ALPHA8_ASTC_8x6_KHR:s.COMPRESSED_RGBA_ASTC_8x6_KHR;if(n===cl)return o===jt?s.COMPRESSED_SRGB8_ALPHA8_ASTC_8x8_KHR:s.COMPRESSED_RGBA_ASTC_8x8_KHR;if(n===ll)return o===jt?s.COMPRESSED_SRGB8_ALPHA8_ASTC_10x5_KHR:s.COMPRESSED_RGBA_ASTC_10x5_KHR;if(n===ul)return o===jt?s.COMPRESSED_SRGB8_ALPHA8_ASTC_10x6_KHR:s.COMPRESSED_RGBA_ASTC_10x6_KHR;if(n===dl)return o===jt?s.COMPRESSED_SRGB8_ALPHA8_ASTC_10x8_KHR:s.COMPRESSED_RGBA_ASTC_10x8_KHR;if(n===hl)return o===jt?s.COMPRESSED_SRGB8_ALPHA8_ASTC_10x10_KHR:s.COMPRESSED_RGBA_ASTC_10x10_KHR;if(n===fl)return o===jt?s.COMPRESSED_SRGB8_ALPHA8_ASTC_12x10_KHR:s.COMPRESSED_RGBA_ASTC_12x10_KHR;if(n===pl)return o===jt?s.COMPRESSED_SRGB8_ALPHA8_ASTC_12x12_KHR:s.COMPRESSED_RGBA_ASTC_12x12_KHR}else return null;if(n===aa||n===ml||n===gl)if(s=e.get("EXT_texture_compression_bptc"),s!==null){if(n===aa)return o===jt?s.COMPRESSED_SRGB_ALPHA_BPTC_UNORM_EXT:s.COMPRESSED_RGBA_BPTC_UNORM_EXT;if(n===ml)return s.COMPRESSED_RGB_BPTC_SIGNED_FLOAT_EXT;if(n===gl)return s.COMPRESSED_RGB_BPTC_UNSIGNED_FLOAT_EXT}else return null;if(n===xh||n===bl||n===_l||n===xl)if(s=e.get("EXT_texture_compression_rgtc"),s!==null){if(n===aa)return s.COMPRESSED_RED_RGTC1_EXT;if(n===bl)return s.COMPRESSED_SIGNED_RED_RGTC1_EXT;if(n===_l)return s.COMPRESSED_RED_GREEN_RGTC2_EXT;if(n===xl)return s.COMPRESSED_SIGNED_RED_GREEN_RGTC2_EXT}else return null;return n===xs?i.UNSIGNED_INT_24_8:i[n]!==void 0?i[n]:null}return{convert:t}}class U_ extends vn{constructor(e=[]){super(),this.isArrayCamera=!0,this.cameras=e}}class Dr extends en{constructor(){super(),this.isGroup=!0,this.type="Group"}}const O_={type:"move"};class pc{constructor(){this._targetRay=null,this._grip=null,this._hand=null}getHandSpace(){return this._hand===null&&(this._hand=new Dr,this._hand.matrixAutoUpdate=!1,this._hand.visible=!1,this._hand.joints={},this._hand.inputState={pinching:!1}),this._hand}getTargetRaySpace(){return this._targetRay===null&&(this._targetRay=new Dr,this._targetRay.matrixAutoUpdate=!1,this._targetRay.visible=!1,this._targetRay.hasLinearVelocity=!1,this._targetRay.linearVelocity=new A,this._targetRay.hasAngularVelocity=!1,this._targetRay.angularVelocity=new A),this._targetRay}getGripSpace(){return this._grip===null&&(this._grip=new Dr,this._grip.matrixAutoUpdate=!1,this._grip.visible=!1,this._grip.hasLinearVelocity=!1,this._grip.linearVelocity=new A,this._grip.hasAngularVelocity=!1,this._grip.angularVelocity=new A),this._grip}dispatchEvent(e){return this._targetRay!==null&&this._targetRay.dispatchEvent(e),this._grip!==null&&this._grip.dispatchEvent(e),this._hand!==null&&this._hand.dispatchEvent(e),this}connect(e){if(e&&e.hand){const t=this._hand;if(t)for(const n of e.hand.values())this._getHandJoint(t,n)}return this.dispatchEvent({type:"connected",data:e}),this}disconnect(e){return this.dispatchEvent({type:"disconnected",data:e}),this._targetRay!==null&&(this._targetRay.visible=!1),this._grip!==null&&(this._grip.visible=!1),this._hand!==null&&(this._hand.visible=!1),this}update(e,t,n){let r=null,s=null,o=null;const a=this._targetRay,l=this._grip,c=this._hand;if(e&&t.session.visibilityState!=="visible-blurred"){if(c&&e.hand){o=!0;for(const b of e.hand.values()){const m=t.getJointPose(b,n),f=this._getHandJoint(c,b);m!==null&&(f.matrix.fromArray(m.transform.matrix),f.matrix.decompose(f.position,f.rotation,f.scale),f.matrixWorldNeedsUpdate=!0,f.jointRadius=m.radius),f.visible=m!==null}const u=c.joints["index-finger-tip"],d=c.joints["thumb-tip"],h=u.position.distanceTo(d.position),p=.02,g=.005;c.inputState.pinching&&h>p+g?(c.inputState.pinching=!1,this.dispatchEvent({type:"pinchend",handedness:e.handedness,target:this})):!c.inputState.pinching&&h<=p-g&&(c.inputState.pinching=!0,this.dispatchEvent({type:"pinchstart",handedness:e.handedness,target:this}))}else l!==null&&e.gripSpace&&(s=t.getPose(e.gripSpace,n),s!==null&&(l.matrix.fromArray(s.transform.matrix),l.matrix.decompose(l.position,l.rotation,l.scale),l.matrixWorldNeedsUpdate=!0,s.linearVelocity?(l.hasLinearVelocity=!0,l.linearVelocity.copy(s.linearVelocity)):l.hasLinearVelocity=!1,s.angularVelocity?(l.hasAngularVelocity=!0,l.angularVelocity.copy(s.angularVelocity)):l.hasAngularVelocity=!1));a!==null&&(r=t.getPose(e.targetRaySpace,n),r===null&&s!==null&&(r=s),r!==null&&(a.matrix.fromArray(r.transform.matrix),a.matrix.decompose(a.position,a.rotation,a.scale),a.matrixWorldNeedsUpdate=!0,r.linearVelocity?(a.hasLinearVelocity=!0,a.linearVelocity.copy(r.linearVelocity)):a.hasLinearVelocity=!1,r.angularVelocity?(a.hasAngularVelocity=!0,a.angularVelocity.copy(r.angularVelocity)):a.hasAngularVelocity=!1,this.dispatchEvent(O_)))}return a!==null&&(a.visible=r!==null),l!==null&&(l.visible=s!==null),c!==null&&(c.visible=o!==null),this}_getHandJoint(e,t){if(e.joints[t.jointName]===void 0){const n=new Dr;n.matrixAutoUpdate=!1,n.visible=!1,e.joints[t.jointName]=n,e.add(n)}return e.joints[t.jointName]}}const k_=`
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

}`;class z_{constructor(){this.texture=null,this.mesh=null,this.depthNear=0,this.depthFar=0}init(e,t,n){if(this.texture===null){const r=new un,s=e.properties.get(r);s.__webglTexture=t.texture,(t.depthNear!=n.depthNear||t.depthFar!=n.depthFar)&&(this.depthNear=t.depthNear,this.depthFar=t.depthFar),this.texture=r}}getMesh(e){if(this.texture!==null&&this.mesh===null){const t=e.cameras[0].viewport,n=new fr({vertexShader:k_,fragmentShader:B_,uniforms:{depthColor:{value:this.texture},depthWidth:{value:t.z},depthHeight:{value:t.w}}});this.mesh=new Xt(new Ps(20,20),n)}return this.mesh}reset(){this.texture=null,this.mesh=null}getDepthTexture(){return this.texture}}class H_ extends Nr{constructor(e,t){super();const n=this;let r=null,s=1,o=null,a="local-floor",l=1,c=null,u=null,d=null,h=null,p=null,g=null;const b=new z_,m=t.getContextAttributes();let f=null,M=null;const x=[],_=[],D=new ut;let P=null;const T=new vn;T.viewport=new mt;const N=new vn;N.viewport=new mt;const v=[T,N],y=new U_;let C=null,q=null;this.cameraAutoUpdate=!0,this.enabled=!1,this.isPresenting=!1,this.getController=function(j){let oe=x[j];return oe===void 0&&(oe=new pc,x[j]=oe),oe.getTargetRaySpace()},this.getControllerGrip=function(j){let oe=x[j];return oe===void 0&&(oe=new pc,x[j]=oe),oe.getGripSpace()},this.getHand=function(j){let oe=x[j];return oe===void 0&&(oe=new pc,x[j]=oe),oe.getHandSpace()};function O(j){const oe=_.indexOf(j.inputSource);if(oe===-1)return;const xe=x[oe];xe!==void 0&&(xe.update(j.inputSource,j.frame,c||o),xe.dispatchEvent({type:j.type,data:j.inputSource}))}function $(){r.removeEventListener("select",O),r.removeEventListener("selectstart",O),r.removeEventListener("selectend",O),r.removeEventListener("squeeze",O),r.removeEventListener("squeezestart",O),r.removeEventListener("squeezeend",O),r.removeEventListener("end",$),r.removeEventListener("inputsourceschange",se);for(let j=0;j<x.length;j++){const oe=_[j];oe!==null&&(_[j]=null,x[j].disconnect(oe))}C=null,q=null,b.reset(),e.setRenderTarget(f),p=null,h=null,d=null,r=null,M=null,le.stop(),n.isPresenting=!1,e.setPixelRatio(P),e.setSize(D.width,D.height,!1),n.dispatchEvent({type:"sessionend"})}this.setFramebufferScaleFactor=function(j){s=j,n.isPresenting===!0&&console.warn("THREE.WebXRManager: Cannot change framebuffer scale while presenting.")},this.setReferenceSpaceType=function(j){a=j,n.isPresenting===!0&&console.warn("THREE.WebXRManager: Cannot change reference space type while presenting.")},this.getReferenceSpace=function(){return c||o},this.setReferenceSpace=function(j){c=j},this.getBaseLayer=function(){return h!==null?h:p},this.getBinding=function(){return d},this.getFrame=function(){return g},this.getSession=function(){return r},this.setSession=async function(j){if(r=j,r!==null){if(f=e.getRenderTarget(),r.addEventListener("select",O),r.addEventListener("selectstart",O),r.addEventListener("selectend",O),r.addEventListener("squeeze",O),r.addEventListener("squeezestart",O),r.addEventListener("squeezeend",O),r.addEventListener("end",$),r.addEventListener("inputsourceschange",se),m.xrCompatible!==!0&&await t.makeXRCompatible(),P=e.getPixelRatio(),e.getSize(D),r.renderState.layers===void 0){const oe={antialias:m.antialias,alpha:!0,depth:m.depth,stencil:m.stencil,framebufferScaleFactor:s};p=new XRWebGLLayer(r,t,oe),r.updateRenderState({baseLayer:p}),e.setPixelRatio(1),e.setSize(p.framebufferWidth,p.framebufferHeight,!1),M=new hr(p.framebufferWidth,p.framebufferHeight,{format:ei,type:Xi,colorSpace:e.outputColorSpace,stencilBuffer:m.stencil})}else{let oe=null,xe=null,me=null;m.depth&&(me=m.stencil?t.DEPTH24_STENCIL8:t.DEPTH_COMPONENT24,oe=m.stencil?vs:cs,xe=m.stencil?xs:Fr);const Te={colorFormat:t.RGBA8,depthFormat:me,scaleFactor:s};d=new XRWebGLBinding(r,t),h=d.createProjectionLayer(Te),r.updateRenderState({layers:[h]}),e.setPixelRatio(1),e.setSize(h.textureWidth,h.textureHeight,!1),M=new hr(h.textureWidth,h.textureHeight,{format:ei,type:Xi,depthTexture:new Ih(h.textureWidth,h.textureHeight,xe,void 0,void 0,void 0,void 0,void 0,void 0,oe),stencilBuffer:m.stencil,colorSpace:e.outputColorSpace,samples:m.antialias?4:0,resolveDepthBuffer:h.ignoreDepthValues===!1})}M.isXRRenderTarget=!0,this.setFoveation(l),c=null,o=await r.requestReferenceSpace(a),le.setContext(r),le.start(),n.isPresenting=!0,n.dispatchEvent({type:"sessionstart"})}},this.getEnvironmentBlendMode=function(){if(r!==null)return r.environmentBlendMode},this.getDepthTexture=function(){return b.getDepthTexture()};function se(j){for(let oe=0;oe<j.removed.length;oe++){const xe=j.removed[oe],me=_.indexOf(xe);me>=0&&(_[me]=null,x[me].disconnect(xe))}for(let oe=0;oe<j.added.length;oe++){const xe=j.added[oe];let me=_.indexOf(xe);if(me===-1){for(let ke=0;ke<x.length;ke++)if(ke>=_.length){_.push(xe),me=ke;break}else if(_[ke]===null){_[ke]=xe,me=ke;break}if(me===-1)break}const Te=x[me];Te&&Te.connect(xe)}}const Z=new A,ce=new A;function L(j,oe,xe){Z.setFromMatrixPosition(oe.matrixWorld),ce.setFromMatrixPosition(xe.matrixWorld);const me=Z.distanceTo(ce),Te=oe.projectionMatrix.elements,ke=xe.projectionMatrix.elements,He=Te[14]/(Te[10]-1),Ze=Te[14]/(Te[10]+1),Ce=(Te[9]+1)/Te[5],st=(Te[9]-1)/Te[5],F=(Te[8]-1)/Te[0],Nt=(ke[8]+1)/ke[0],pt=He*F,ct=He*Nt,Fe=me/(-F+Nt),Ut=Fe*-F;if(oe.matrixWorld.decompose(j.position,j.quaternion,j.scale),j.translateX(Ut),j.translateZ(Fe),j.matrixWorld.compose(j.position,j.quaternion,j.scale),j.matrixWorldInverse.copy(j.matrixWorld).invert(),Te[10]===-1)j.projectionMatrix.copy(oe.projectionMatrix),j.projectionMatrixInverse.copy(oe.projectionMatrixInverse);else{const it=He+Fe,R=Ze+Fe,S=pt-Ut,te=ct+(me-Ut),ge=Ce*Ze/R*it,be=st*Ze/R*it;j.projectionMatrix.makePerspective(S,te,ge,be,it,R),j.projectionMatrixInverse.copy(j.projectionMatrix).invert()}}function k(j,oe){oe===null?j.matrixWorld.copy(j.matrix):j.matrixWorld.multiplyMatrices(oe.matrixWorld,j.matrix),j.matrixWorldInverse.copy(j.matrixWorld).invert()}this.updateCamera=function(j){if(r===null)return;let oe=j.near,xe=j.far;b.texture!==null&&(b.depthNear>0&&(oe=b.depthNear),b.depthFar>0&&(xe=b.depthFar)),y.near=N.near=T.near=oe,y.far=N.far=T.far=xe,(C!==y.near||q!==y.far)&&(r.updateRenderState({depthNear:y.near,depthFar:y.far}),C=y.near,q=y.far),T.layers.mask=j.layers.mask|2,N.layers.mask=j.layers.mask|4,y.layers.mask=T.layers.mask|N.layers.mask;const me=j.parent,Te=y.cameras;k(y,me);for(let ke=0;ke<Te.length;ke++)k(Te[ke],me);Te.length===2?L(y,T,N):y.projectionMatrix.copy(T.projectionMatrix),K(j,y,me)};function K(j,oe,xe){xe===null?j.matrix.copy(oe.matrixWorld):(j.matrix.copy(xe.matrixWorld),j.matrix.invert(),j.matrix.multiply(oe.matrixWorld)),j.matrix.decompose(j.position,j.quaternion,j.scale),j.updateMatrixWorld(!0),j.projectionMatrix.copy(oe.projectionMatrix),j.projectionMatrixInverse.copy(oe.projectionMatrixInverse),j.isPerspectiveCamera&&(j.fov=ys*2*Math.atan(1/j.projectionMatrix.elements[5]),j.zoom=1)}this.getCamera=function(){return y},this.getFoveation=function(){if(!(h===null&&p===null))return l},this.setFoveation=function(j){l=j,h!==null&&(h.fixedFoveation=j),p!==null&&p.fixedFoveation!==void 0&&(p.fixedFoveation=j)},this.hasDepthSensing=function(){return b.texture!==null},this.getDepthSensingMesh=function(){return b.getMesh(y)};let X=null;function ee(j,oe){if(u=oe.getViewerPose(c||o),g=oe,u!==null){const xe=u.views;p!==null&&(e.setRenderTargetFramebuffer(M,p.framebuffer),e.setRenderTarget(M));let me=!1;xe.length!==y.cameras.length&&(y.cameras.length=0,me=!0);for(let ke=0;ke<xe.length;ke++){const He=xe[ke];let Ze=null;if(p!==null)Ze=p.getViewport(He);else{const st=d.getViewSubImage(h,He);Ze=st.viewport,ke===0&&(e.setRenderTargetTextures(M,st.colorTexture,h.ignoreDepthValues?void 0:st.depthStencilTexture),e.setRenderTarget(M))}let Ce=v[ke];Ce===void 0&&(Ce=new vn,Ce.layers.enable(ke),Ce.viewport=new mt,v[ke]=Ce),Ce.matrix.fromArray(He.transform.matrix),Ce.matrix.decompose(Ce.position,Ce.quaternion,Ce.scale),Ce.projectionMatrix.fromArray(He.projectionMatrix),Ce.projectionMatrixInverse.copy(Ce.projectionMatrix).invert(),Ce.viewport.set(Ze.x,Ze.y,Ze.width,Ze.height),ke===0&&(y.matrix.copy(Ce.matrix),y.matrix.decompose(y.position,y.quaternion,y.scale)),me===!0&&y.cameras.push(Ce)}const Te=r.enabledFeatures;if(Te&&Te.includes("depth-sensing")){const ke=d.getDepthInformation(xe[0]);ke&&ke.isValid&&ke.texture&&b.init(e,ke,r.renderState)}}for(let xe=0;xe<x.length;xe++){const me=_[xe],Te=x[xe];me!==null&&Te!==void 0&&Te.update(me,oe,c||o)}X&&X(j,oe),oe.detectedPlanes&&n.dispatchEvent({type:"planesdetected",data:oe}),g=null}const le=new Dh;le.setAnimationLoop(ee),this.setAnimationLoop=function(j){X=j},this.dispose=function(){}}}const wr=new Mi,G_=new ot;function V_(i,e){function t(m,f){m.matrixAutoUpdate===!0&&m.updateMatrix(),f.value.copy(m.matrix)}function n(m,f){f.color.getRGB(m.fogColor.value,Ch(i)),f.isFog?(m.fogNear.value=f.near,m.fogFar.value=f.far):f.isFogExp2&&(m.fogDensity.value=f.density)}function r(m,f,M,x,_){f.isMeshBasicMaterial||f.isMeshLambertMaterial?s(m,f):f.isMeshToonMaterial?(s(m,f),d(m,f)):f.isMeshPhongMaterial?(s(m,f),u(m,f)):f.isMeshStandardMaterial?(s(m,f),h(m,f),f.isMeshPhysicalMaterial&&p(m,f,_)):f.isMeshMatcapMaterial?(s(m,f),g(m,f)):f.isMeshDepthMaterial?s(m,f):f.isMeshDistanceMaterial?(s(m,f),b(m,f)):f.isMeshNormalMaterial?s(m,f):f.isLineBasicMaterial?(o(m,f),f.isLineDashedMaterial&&a(m,f)):f.isPointsMaterial?l(m,f,M,x):f.isSpriteMaterial?c(m,f):f.isShadowMaterial?(m.color.value.copy(f.color),m.opacity.value=f.opacity):f.isShaderMaterial&&(f.uniformsNeedUpdate=!1)}function s(m,f){m.opacity.value=f.opacity,f.color&&m.diffuse.value.copy(f.color),f.emissive&&m.emissive.value.copy(f.emissive).multiplyScalar(f.emissiveIntensity),f.map&&(m.map.value=f.map,t(f.map,m.mapTransform)),f.alphaMap&&(m.alphaMap.value=f.alphaMap,t(f.alphaMap,m.alphaMapTransform)),f.bumpMap&&(m.bumpMap.value=f.bumpMap,t(f.bumpMap,m.bumpMapTransform),m.bumpScale.value=f.bumpScale,f.side===Cn&&(m.bumpScale.value*=-1)),f.normalMap&&(m.normalMap.value=f.normalMap,t(f.normalMap,m.normalMapTransform),m.normalScale.value.copy(f.normalScale),f.side===Cn&&m.normalScale.value.negate()),f.displacementMap&&(m.displacementMap.value=f.displacementMap,t(f.displacementMap,m.displacementMapTransform),m.displacementScale.value=f.displacementScale,m.displacementBias.value=f.displacementBias),f.emissiveMap&&(m.emissiveMap.value=f.emissiveMap,t(f.emissiveMap,m.emissiveMapTransform)),f.specularMap&&(m.specularMap.value=f.specularMap,t(f.specularMap,m.specularMapTransform)),f.alphaTest>0&&(m.alphaTest.value=f.alphaTest);const M=e.get(f),x=M.envMap,_=M.envMapRotation;x&&(m.envMap.value=x,wr.copy(_),wr.x*=-1,wr.y*=-1,wr.z*=-1,x.isCubeTexture&&x.isRenderTargetTexture===!1&&(wr.y*=-1,wr.z*=-1),m.envMapRotation.value.setFromMatrix4(G_.makeRotationFromEuler(wr)),m.flipEnvMap.value=x.isCubeTexture&&x.isRenderTargetTexture===!1?-1:1,m.reflectivity.value=f.reflectivity,m.ior.value=f.ior,m.refractionRatio.value=f.refractionRatio),f.lightMap&&(m.lightMap.value=f.lightMap,m.lightMapIntensity.value=f.lightMapIntensity,t(f.lightMap,m.lightMapTransform)),f.aoMap&&(m.aoMap.value=f.aoMap,m.aoMapIntensity.value=f.aoMapIntensity,t(f.aoMap,m.aoMapTransform))}function o(m,f){m.diffuse.value.copy(f.color),m.opacity.value=f.opacity,f.map&&(m.map.value=f.map,t(f.map,m.mapTransform))}function a(m,f){m.dashSize.value=f.dashSize,m.totalSize.value=f.dashSize+f.gapSize,m.scale.value=f.scale}function l(m,f,M,x){m.diffuse.value.copy(f.color),m.opacity.value=f.opacity,m.size.value=f.size*M,m.scale.value=x*.5,f.map&&(m.map.value=f.map,t(f.map,m.uvTransform)),f.alphaMap&&(m.alphaMap.value=f.alphaMap,t(f.alphaMap,m.alphaMapTransform)),f.alphaTest>0&&(m.alphaTest.value=f.alphaTest)}function c(m,f){m.diffuse.value.copy(f.color),m.opacity.value=f.opacity,m.rotation.value=f.rotation,f.map&&(m.map.value=f.map,t(f.map,m.mapTransform)),f.alphaMap&&(m.alphaMap.value=f.alphaMap,t(f.alphaMap,m.alphaMapTransform)),f.alphaTest>0&&(m.alphaTest.value=f.alphaTest)}function u(m,f){m.specular.value.copy(f.specular),m.shininess.value=Math.max(f.shininess,1e-4)}function d(m,f){f.gradientMap&&(m.gradientMap.value=f.gradientMap)}function h(m,f){m.metalness.value=f.metalness,f.metalnessMap&&(m.metalnessMap.value=f.metalnessMap,t(f.metalnessMap,m.metalnessMapTransform)),m.roughness.value=f.roughness,f.roughnessMap&&(m.roughnessMap.value=f.roughnessMap,t(f.roughnessMap,m.roughnessMapTransform)),f.envMap&&(m.envMapIntensity.value=f.envMapIntensity)}function p(m,f,M){m.ior.value=f.ior,f.sheen>0&&(m.sheenColor.value.copy(f.sheenColor).multiplyScalar(f.sheen),m.sheenRoughness.value=f.sheenRoughness,f.sheenColorMap&&(m.sheenColorMap.value=f.sheenColorMap,t(f.sheenColorMap,m.sheenColorMapTransform)),f.sheenRoughnessMap&&(m.sheenRoughnessMap.value=f.sheenRoughnessMap,t(f.sheenRoughnessMap,m.sheenRoughnessMapTransform))),f.clearcoat>0&&(m.clearcoat.value=f.clearcoat,m.clearcoatRoughness.value=f.clearcoatRoughness,f.clearcoatMap&&(m.clearcoatMap.value=f.clearcoatMap,t(f.clearcoatMap,m.clearcoatMapTransform)),f.clearcoatRoughnessMap&&(m.clearcoatRoughnessMap.value=f.clearcoatRoughnessMap,t(f.clearcoatRoughnessMap,m.clearcoatRoughnessMapTransform)),f.clearcoatNormalMap&&(m.clearcoatNormalMap.value=f.clearcoatNormalMap,t(f.clearcoatNormalMap,m.clearcoatNormalMapTransform),m.clearcoatNormalScale.value.copy(f.clearcoatNormalScale),f.side===Cn&&m.clearcoatNormalScale.value.negate())),f.dispersion>0&&(m.dispersion.value=f.dispersion),f.iridescence>0&&(m.iridescence.value=f.iridescence,m.iridescenceIOR.value=f.iridescenceIOR,m.iridescenceThicknessMinimum.value=f.iridescenceThicknessRange[0],m.iridescenceThicknessMaximum.value=f.iridescenceThicknessRange[1],f.iridescenceMap&&(m.iridescenceMap.value=f.iridescenceMap,t(f.iridescenceMap,m.iridescenceMapTransform)),f.iridescenceThicknessMap&&(m.iridescenceThicknessMap.value=f.iridescenceThicknessMap,t(f.iridescenceThicknessMap,m.iridescenceThicknessMapTransform))),f.transmission>0&&(m.transmission.value=f.transmission,m.transmissionSamplerMap.value=M.texture,m.transmissionSamplerSize.value.set(M.width,M.height),f.transmissionMap&&(m.transmissionMap.value=f.transmissionMap,t(f.transmissionMap,m.transmissionMapTransform)),m.thickness.value=f.thickness,f.thicknessMap&&(m.thicknessMap.value=f.thicknessMap,t(f.thicknessMap,m.thicknessMapTransform)),m.attenuationDistance.value=f.attenuationDistance,m.attenuationColor.value.copy(f.attenuationColor)),f.anisotropy>0&&(m.anisotropyVector.value.set(f.anisotropy*Math.cos(f.anisotropyRotation),f.anisotropy*Math.sin(f.anisotropyRotation)),f.anisotropyMap&&(m.anisotropyMap.value=f.anisotropyMap,t(f.anisotropyMap,m.anisotropyMapTransform))),m.specularIntensity.value=f.specularIntensity,m.specularColor.value.copy(f.specularColor),f.specularColorMap&&(m.specularColorMap.value=f.specularColorMap,t(f.specularColorMap,m.specularColorMapTransform)),f.specularIntensityMap&&(m.specularIntensityMap.value=f.specularIntensityMap,t(f.specularIntensityMap,m.specularIntensityMapTransform))}function g(m,f){f.matcap&&(m.matcap.value=f.matcap)}function b(m,f){const M=e.get(f).light;m.referencePosition.value.setFromMatrixPosition(M.matrixWorld),m.nearDistance.value=M.shadow.camera.near,m.farDistance.value=M.shadow.camera.far}return{refreshFogUniforms:n,refreshMaterialUniforms:r}}function W_(i,e,t,n){let r={},s={},o=[];const a=i.getParameter(i.MAX_UNIFORM_BUFFER_BINDINGS);function l(M,x){const _=x.program;n.uniformBlockBinding(M,_)}function c(M,x){let _=r[M.id];_===void 0&&(g(M),_=u(M),r[M.id]=_,M.addEventListener("dispose",m));const D=x.program;n.updateUBOMapping(M,D);const P=e.render.frame;s[M.id]!==P&&(h(M),s[M.id]=P)}function u(M){const x=d();M.__bindingPointIndex=x;const _=i.createBuffer(),D=M.__size,P=M.usage;return i.bindBuffer(i.UNIFORM_BUFFER,_),i.bufferData(i.UNIFORM_BUFFER,D,P),i.bindBuffer(i.UNIFORM_BUFFER,null),i.bindBufferBase(i.UNIFORM_BUFFER,x,_),_}function d(){for(let M=0;M<a;M++)if(o.indexOf(M)===-1)return o.push(M),M;return console.error("THREE.WebGLRenderer: Maximum number of simultaneously usable uniforms groups reached."),0}function h(M){const x=r[M.id],_=M.uniforms,D=M.__cache;i.bindBuffer(i.UNIFORM_BUFFER,x);for(let P=0,T=_.length;P<T;P++){const N=Array.isArray(_[P])?_[P]:[_[P]];for(let v=0,y=N.length;v<y;v++){const C=N[v];if(p(C,P,v,D)===!0){const q=C.__offset,O=Array.isArray(C.value)?C.value:[C.value];let $=0;for(let se=0;se<O.length;se++){const Z=O[se],ce=b(Z);typeof Z=="number"||typeof Z=="boolean"?(C.__data[0]=Z,i.bufferSubData(i.UNIFORM_BUFFER,q+$,C.__data)):Z.isMatrix3?(C.__data[0]=Z.elements[0],C.__data[1]=Z.elements[1],C.__data[2]=Z.elements[2],C.__data[3]=0,C.__data[4]=Z.elements[3],C.__data[5]=Z.elements[4],C.__data[6]=Z.elements[5],C.__data[7]=0,C.__data[8]=Z.elements[6],C.__data[9]=Z.elements[7],C.__data[10]=Z.elements[8],C.__data[11]=0):(Z.toArray(C.__data,$),$+=ce.storage/Float32Array.BYTES_PER_ELEMENT)}i.bufferSubData(i.UNIFORM_BUFFER,q,C.__data)}}}i.bindBuffer(i.UNIFORM_BUFFER,null)}function p(M,x,_,D){const P=M.value,T=x+"_"+_;if(D[T]===void 0)return typeof P=="number"||typeof P=="boolean"?D[T]=P:D[T]=P.clone(),!0;{const N=D[T];if(typeof P=="number"||typeof P=="boolean"){if(N!==P)return D[T]=P,!0}else if(N.equals(P)===!1)return N.copy(P),!0}return!1}function g(M){const x=M.uniforms;let _=0;const D=16;for(let T=0,N=x.length;T<N;T++){const v=Array.isArray(x[T])?x[T]:[x[T]];for(let y=0,C=v.length;y<C;y++){const q=v[y],O=Array.isArray(q.value)?q.value:[q.value];for(let $=0,se=O.length;$<se;$++){const Z=O[$],ce=b(Z),L=_%D,k=L%ce.boundary,K=L+k;_+=k,K!==0&&D-K<ce.storage&&(_+=D-K),q.__data=new Float32Array(ce.storage/Float32Array.BYTES_PER_ELEMENT),q.__offset=_,_+=ce.storage}}}const P=_%D;return P>0&&(_+=D-P),M.__size=_,M.__cache={},this}function b(M){const x={boundary:0,storage:0};return typeof M=="number"||typeof M=="boolean"?(x.boundary=4,x.storage=4):M.isVector2?(x.boundary=8,x.storage=8):M.isVector3||M.isColor?(x.boundary=16,x.storage=12):M.isVector4?(x.boundary=16,x.storage=16):M.isMatrix3?(x.boundary=48,x.storage=48):M.isMatrix4?(x.boundary=64,x.storage=64):M.isTexture?console.warn("THREE.WebGLRenderer: Texture samplers can not be part of an uniforms group."):console.warn("THREE.WebGLRenderer: Unsupported uniform value type.",M),x}function m(M){const x=M.target;x.removeEventListener("dispose",m);const _=o.indexOf(x.__bindingPointIndex);o.splice(_,1),i.deleteBuffer(r[x.id]),delete r[x.id],delete s[x.id]}function f(){for(const M in r)i.deleteBuffer(r[M]);o=[],r={},s={}}return{bind:l,update:c,dispose:f}}class q_{constructor(e={}){const{canvas:t=Ip(),context:n=null,depth:r=!0,stencil:s=!1,alpha:o=!1,antialias:a=!1,premultipliedAlpha:l=!0,preserveDrawingBuffer:c=!1,powerPreference:u="default",failIfMajorPerformanceCaveat:d=!1,reverseDepthBuffer:h=!1}=e;this.isWebGLRenderer=!0;let p;if(n!==null){if(typeof WebGLRenderingContext<"u"&&n instanceof WebGLRenderingContext)throw new Error("THREE.WebGLRenderer: WebGL 1 is not supported since r163.");p=n.getContextAttributes().alpha}else p=o;const g=new Uint32Array(4),b=new Int32Array(4);let m=null,f=null;const M=[],x=[];this.domElement=t,this.debug={checkShaderErrors:!0,onShaderError:null},this.autoClear=!0,this.autoClearColor=!0,this.autoClearDepth=!0,this.autoClearStencil=!0,this.sortObjects=!0,this.clippingPlanes=[],this.localClippingEnabled=!1,this._outputColorSpace=ln,this.toneMapping=dr,this.toneMappingExposure=1;const _=this;let D=!1,P=0,T=0,N=null,v=-1,y=null;const C=new mt,q=new mt;let O=null;const $=new rt(0);let se=0,Z=t.width,ce=t.height,L=1,k=null,K=null;const X=new mt(0,0,Z,ce),ee=new mt(0,0,Z,ce);let le=!1;const j=new Xl;let oe=!1,xe=!1;const me=new ot,Te=new ot,ke=new A,He=new mt,Ze={background:null,fog:null,environment:null,overrideMaterial:null,isScene:!0};let Ce=!1;function st(){return N===null?L:1}let F=n;function Nt(w,z){return t.getContext(w,z)}try{const w={alpha:!0,depth:r,stencil:s,antialias:a,premultipliedAlpha:l,preserveDrawingBuffer:c,powerPreference:u,failIfMajorPerformanceCaveat:d};if("setAttribute"in t&&t.setAttribute("data-engine",`three.js r${Ol}`),t.addEventListener("webglcontextlost",_e,!1),t.addEventListener("webglcontextrestored",Ne,!1),t.addEventListener("webglcontextcreationerror",Ie,!1),F===null){const z="webgl2";if(F=Nt(z,w),F===null)throw Nt(z)?new Error("Error creating WebGL context with your selected attributes."):new Error("Error creating WebGL context.")}}catch(w){throw console.error("THREE.WebGLRenderer: "+w.message),w}let pt,ct,Fe,Ut,it,R,S,te,ge,be,fe,Je,Le,Be,Ct,we,ze,et,at,Ge,St,bt,Dt,B;function De(){pt=new Yg(F),pt.init(),bt=new N_(F,pt),ct=new Wg(F,pt,e,bt),Fe=new D_(F,pt),ct.reverseDepthBuffer&&h&&Fe.buffers.depth.setReversed(!0),Ut=new Jg(F),it=new b_,R=new F_(F,pt,Fe,it,ct,bt,Ut),S=new jg(_),te=new Kg(_),ge=new om(F),Dt=new Gg(F,ge),be=new $g(F,ge,Ut,Dt),fe=new tb(F,be,ge,Ut),at=new eb(F,ct,R),we=new qg(it),Je=new g_(_,S,te,pt,ct,Dt,we),Le=new V_(_,it),Be=new x_,Ct=new E_(pt),et=new Hg(_,S,te,Fe,fe,p,l),ze=new P_(_,fe,ct),B=new W_(F,Ut,ct,Fe),Ge=new Vg(F,pt,Ut),St=new Zg(F,pt,Ut),Ut.programs=Je.programs,_.capabilities=ct,_.extensions=pt,_.properties=it,_.renderLists=Be,_.shadowMap=ze,_.state=Fe,_.info=Ut}De();const de=new H_(_,F);this.xr=de,this.getContext=function(){return F},this.getContextAttributes=function(){return F.getContextAttributes()},this.forceContextLoss=function(){const w=pt.get("WEBGL_lose_context");w&&w.loseContext()},this.forceContextRestore=function(){const w=pt.get("WEBGL_lose_context");w&&w.restoreContext()},this.getPixelRatio=function(){return L},this.setPixelRatio=function(w){w!==void 0&&(L=w,this.setSize(Z,ce,!1))},this.getSize=function(w){return w.set(Z,ce)},this.setSize=function(w,z,ie=!0){if(de.isPresenting){console.warn("THREE.WebGLRenderer: Can't change size while VR device is presenting.");return}Z=w,ce=z,t.width=Math.floor(w*L),t.height=Math.floor(z*L),ie===!0&&(t.style.width=w+"px",t.style.height=z+"px"),this.setViewport(0,0,w,z)},this.getDrawingBufferSize=function(w){return w.set(Z*L,ce*L).floor()},this.setDrawingBufferSize=function(w,z,ie){Z=w,ce=z,L=ie,t.width=Math.floor(w*ie),t.height=Math.floor(z*ie),this.setViewport(0,0,w,z)},this.getCurrentViewport=function(w){return w.copy(C)},this.getViewport=function(w){return w.copy(X)},this.setViewport=function(w,z,ie,re){w.isVector4?X.set(w.x,w.y,w.z,w.w):X.set(w,z,ie,re),Fe.viewport(C.copy(X).multiplyScalar(L).round())},this.getScissor=function(w){return w.copy(ee)},this.setScissor=function(w,z,ie,re){w.isVector4?ee.set(w.x,w.y,w.z,w.w):ee.set(w,z,ie,re),Fe.scissor(q.copy(ee).multiplyScalar(L).round())},this.getScissorTest=function(){return le},this.setScissorTest=function(w){Fe.setScissorTest(le=w)},this.setOpaqueSort=function(w){k=w},this.setTransparentSort=function(w){K=w},this.getClearColor=function(w){return w.copy(et.getClearColor())},this.setClearColor=function(){et.setClearColor.apply(et,arguments)},this.getClearAlpha=function(){return et.getClearAlpha()},this.setClearAlpha=function(){et.setClearAlpha.apply(et,arguments)},this.clear=function(w=!0,z=!0,ie=!0){let re=0;if(w){let G=!1;if(N!==null){const Ee=N.texture.format;G=Ee===Wl||Ee===Vl||Ee===Gl}if(G){const Ee=N.texture.type,Ue=Ee===Xi||Ee===Fr||Ee===ro||Ee===xs||Ee===Bl||Ee===zl,Qe=et.getClearColor(),Ye=et.getClearAlpha(),dt=Qe.r,gt=Qe.g,We=Qe.b;Ue?(g[0]=dt,g[1]=gt,g[2]=We,g[3]=Ye,F.clearBufferuiv(F.COLOR,0,g)):(b[0]=dt,b[1]=gt,b[2]=We,b[3]=Ye,F.clearBufferiv(F.COLOR,0,b))}else re|=F.COLOR_BUFFER_BIT}z&&(re|=F.DEPTH_BUFFER_BIT),ie&&(re|=F.STENCIL_BUFFER_BIT,this.state.buffers.stencil.setMask(4294967295)),F.clear(re)},this.clearColor=function(){this.clear(!0,!1,!1)},this.clearDepth=function(){this.clear(!1,!0,!1)},this.clearStencil=function(){this.clear(!1,!1,!0)},this.dispose=function(){t.removeEventListener("webglcontextlost",_e,!1),t.removeEventListener("webglcontextrestored",Ne,!1),t.removeEventListener("webglcontextcreationerror",Ie,!1),Be.dispose(),Ct.dispose(),it.dispose(),S.dispose(),te.dispose(),fe.dispose(),Dt.dispose(),B.dispose(),Je.dispose(),de.dispose(),de.removeEventListener("sessionstart",Bn),de.removeEventListener("sessionend",mr),ti.stop()};function _e(w){w.preventDefault(),console.log("THREE.WebGLRenderer: Context Lost."),D=!0}function Ne(){console.log("THREE.WebGLRenderer: Context Restored."),D=!1;const w=Ut.autoReset,z=ze.enabled,ie=ze.autoUpdate,re=ze.needsUpdate,G=ze.type;De(),Ut.autoReset=w,ze.enabled=z,ze.autoUpdate=ie,ze.needsUpdate=re,ze.type=G}function Ie(w){console.error("THREE.WebGLRenderer: A WebGL context could not be created. Reason: ",w.statusMessage)}function ft(w){const z=w.target;z.removeEventListener("dispose",ft),$t(z)}function $t(w){fn(w),it.remove(w)}function fn(w){const z=it.get(w).programs;z!==void 0&&(z.forEach(function(ie){Je.releaseProgram(ie)}),w.isShaderMaterial&&Je.releaseShaderCache(w))}this.renderBufferDirect=function(w,z,ie,re,G,Ee){z===null&&(z=Ze);const Ue=G.isMesh&&G.matrixWorld.determinant()<0,Qe=Ia(w,z,ie,re,G);Fe.setMaterial(re,Ue);let Ye=ie.index,dt=1;if(re.wireframe===!0){if(Ye=be.getWireframeAttribute(ie),Ye===void 0)return;dt=2}const gt=ie.drawRange,We=ie.attributes.position;let At=gt.start*dt,kt=(gt.start+gt.count)*dt;Ee!==null&&(At=Math.max(At,Ee.start*dt),kt=Math.min(kt,(Ee.start+Ee.count)*dt)),Ye!==null?(At=Math.max(At,0),kt=Math.min(kt,Ye.count)):We!=null&&(At=Math.max(At,0),kt=Math.min(kt,We.count));const Kt=kt-At;if(Kt<0||Kt===1/0)return;Dt.setup(G,re,Qe,ie,Ye);let pn,Ft=Ge;if(Ye!==null&&(pn=ge.get(Ye),Ft=St,Ft.setIndex(pn)),G.isMesh)re.wireframe===!0?(Fe.setLineWidth(re.wireframeLinewidth*st()),Ft.setMode(F.LINES)):Ft.setMode(F.TRIANGLES);else if(G.isLine){let Oe=re.linewidth;Oe===void 0&&(Oe=1),Fe.setLineWidth(Oe*st()),G.isLineSegments?Ft.setMode(F.LINES):G.isLineLoop?Ft.setMode(F.LINE_LOOP):Ft.setMode(F.LINE_STRIP)}else G.isPoints?Ft.setMode(F.POINTS):G.isSprite&&Ft.setMode(F.TRIANGLES);if(G.isBatchedMesh)if(G._multiDrawInstances!==null)Ft.renderMultiDrawInstances(G._multiDrawStarts,G._multiDrawCounts,G._multiDrawCount,G._multiDrawInstances);else if(pt.get("WEBGL_multi_draw"))Ft.renderMultiDraw(G._multiDrawStarts,G._multiDrawCounts,G._multiDrawCount);else{const Oe=G._multiDrawStarts,zn=G._multiDrawCounts,Lt=G._multiDrawCount,In=Ye?ge.get(Ye).bytesPerElement:1,Ki=it.get(re).currentProgram.getUniforms();for(let tn=0;tn<Lt;tn++)Ki.setValue(F,"_gl_DrawID",tn),Ft.render(Oe[tn]/In,zn[tn])}else if(G.isInstancedMesh)Ft.renderInstances(At,Kt,G.count);else if(ie.isInstancedBufferGeometry){const Oe=ie._maxInstanceCount!==void 0?ie._maxInstanceCount:1/0,zn=Math.min(ie.instanceCount,Oe);Ft.renderInstances(At,Kt,zn)}else Ft.render(At,Kt)};function It(w,z,ie){w.transparent===!0&&w.side===xi&&w.forceSinglePass===!1?(w.side=Cn,w.needsUpdate=!0,Ur(w,z,ie),w.side=ji,w.needsUpdate=!0,Ur(w,z,ie),w.side=xi):Ur(w,z,ie)}this.compile=function(w,z,ie=null){ie===null&&(ie=w),f=Ct.get(ie),f.init(z),x.push(f),ie.traverseVisible(function(G){G.isLight&&G.layers.test(z.layers)&&(f.pushLight(G),G.castShadow&&f.pushShadow(G))}),w!==ie&&w.traverseVisible(function(G){G.isLight&&G.layers.test(z.layers)&&(f.pushLight(G),G.castShadow&&f.pushShadow(G))}),f.setupLights();const re=new Set;return w.traverse(function(G){if(!(G.isMesh||G.isPoints||G.isLine||G.isSprite))return;const Ee=G.material;if(Ee)if(Array.isArray(Ee))for(let Ue=0;Ue<Ee.length;Ue++){const Qe=Ee[Ue];It(Qe,ie,G),re.add(Qe)}else It(Ee,ie,G),re.add(Ee)}),x.pop(),f=null,re},this.compileAsync=function(w,z,ie=null){const re=this.compile(w,z,ie);return new Promise(G=>{function Ee(){if(re.forEach(function(Ue){it.get(Ue).currentProgram.isReady()&&re.delete(Ue)}),re.size===0){G(w);return}setTimeout(Ee,10)}pt.get("KHR_parallel_shader_compile")!==null?Ee():setTimeout(Ee,10)})};let Dn=null;function Xn(w){Dn&&Dn(w)}function Bn(){ti.stop()}function mr(){ti.start()}const ti=new Dh;ti.setAnimationLoop(Xn),typeof self<"u"&&ti.setContext(self),this.setAnimationLoop=function(w){Dn=w,de.setAnimationLoop(w),w===null?ti.stop():ti.start()},de.addEventListener("sessionstart",Bn),de.addEventListener("sessionend",mr),this.render=function(w,z){if(z!==void 0&&z.isCamera!==!0){console.error("THREE.WebGLRenderer.render: camera is not an instance of THREE.Camera.");return}if(D===!0)return;if(w.matrixWorldAutoUpdate===!0&&w.updateMatrixWorld(),z.parent===null&&z.matrixWorldAutoUpdate===!0&&z.updateMatrixWorld(),de.enabled===!0&&de.isPresenting===!0&&(de.cameraAutoUpdate===!0&&de.updateCamera(z),z=de.getCamera()),w.isScene===!0&&w.onBeforeRender(_,w,z,N),f=Ct.get(w,x.length),f.init(z),x.push(f),Te.multiplyMatrices(z.projectionMatrix,z.matrixWorldInverse),j.setFromProjectionMatrix(Te),xe=this.localClippingEnabled,oe=we.init(this.clippingPlanes,xe),m=Be.get(w,M.length),m.init(),M.push(m),de.enabled===!0&&de.isPresenting===!0){const Ee=_.xr.getDepthSensingMesh();Ee!==null&&Us(Ee,z,-1/0,_.sortObjects)}Us(w,z,0,_.sortObjects),m.finish(),_.sortObjects===!0&&m.sort(k,K),Ce=de.enabled===!1||de.isPresenting===!1||de.hasDepthSensing()===!1,Ce&&et.addToRenderList(m,w),this.info.render.frame++,oe===!0&&we.beginShadows();const ie=f.state.shadowsArray;ze.render(ie,w,z),oe===!0&&we.endShadows(),this.info.autoReset===!0&&this.info.reset();const re=m.opaque,G=m.transmissive;if(f.setupLights(),z.isArrayCamera){const Ee=z.cameras;if(G.length>0)for(let Ue=0,Qe=Ee.length;Ue<Qe;Ue++){const Ye=Ee[Ue];mo(re,G,w,Ye)}Ce&&et.render(w);for(let Ue=0,Qe=Ee.length;Ue<Qe;Ue++){const Ye=Ee[Ue];po(m,w,Ye,Ye.viewport)}}else G.length>0&&mo(re,G,w,z),Ce&&et.render(w),po(m,w,z);N!==null&&(R.updateMultisampleRenderTarget(N),R.updateRenderTargetMipmap(N)),w.isScene===!0&&w.onAfterRender(_,w,z),Dt.resetDefaultState(),v=-1,y=null,x.pop(),x.length>0?(f=x[x.length-1],oe===!0&&we.setGlobalState(_.clippingPlanes,f.state.camera)):f=null,M.pop(),M.length>0?m=M[M.length-1]:m=null};function Us(w,z,ie,re){if(w.visible===!1)return;if(w.layers.test(z.layers)){if(w.isGroup)ie=w.renderOrder;else if(w.isLOD)w.autoUpdate===!0&&w.update(z);else if(w.isLight)f.pushLight(w),w.castShadow&&f.pushShadow(w);else if(w.isSprite){if(!w.frustumCulled||j.intersectsSprite(w)){re&&He.setFromMatrixPosition(w.matrixWorld).applyMatrix4(Te);const Ue=fe.update(w),Qe=w.material;Qe.visible&&m.push(w,Ue,Qe,ie,He.z,null)}}else if((w.isMesh||w.isLine||w.isPoints)&&(!w.frustumCulled||j.intersectsObject(w))){const Ue=fe.update(w),Qe=w.material;if(re&&(w.boundingSphere!==void 0?(w.boundingSphere===null&&w.computeBoundingSphere(),He.copy(w.boundingSphere.center)):(Ue.boundingSphere===null&&Ue.computeBoundingSphere(),He.copy(Ue.boundingSphere.center)),He.applyMatrix4(w.matrixWorld).applyMatrix4(Te)),Array.isArray(Qe)){const Ye=Ue.groups;for(let dt=0,gt=Ye.length;dt<gt;dt++){const We=Ye[dt],At=Qe[We.materialIndex];At&&At.visible&&m.push(w,Ue,At,ie,He.z,We)}}else Qe.visible&&m.push(w,Ue,Qe,ie,He.z,null)}}const Ee=w.children;for(let Ue=0,Qe=Ee.length;Ue<Qe;Ue++)Us(Ee[Ue],z,ie,re)}function po(w,z,ie,re){const G=w.opaque,Ee=w.transmissive,Ue=w.transparent;f.setupLightsView(ie),oe===!0&&we.setGlobalState(_.clippingPlanes,ie),re&&Fe.viewport(C.copy(re)),G.length>0&&Qi(G,z,ie),Ee.length>0&&Qi(Ee,z,ie),Ue.length>0&&Qi(Ue,z,ie),Fe.buffers.depth.setTest(!0),Fe.buffers.depth.setMask(!0),Fe.buffers.color.setMask(!0),Fe.setPolygonOffset(!1)}function mo(w,z,ie,re){if((ie.isScene===!0?ie.overrideMaterial:null)!==null)return;f.state.transmissionRenderTarget[re.id]===void 0&&(f.state.transmissionRenderTarget[re.id]=new hr(1,1,{generateMipmaps:!0,type:pt.has("EXT_color_buffer_half_float")||pt.has("EXT_color_buffer_float")?uo:Xi,minFilter:zi,samples:4,stencilBuffer:s,resolveDepthBuffer:!1,resolveStencilBuffer:!1,colorSpace:Pt.workingColorSpace}));const Ee=f.state.transmissionRenderTarget[re.id],Ue=re.viewport||C;Ee.setSize(Ue.z,Ue.w);const Qe=_.getRenderTarget();_.setRenderTarget(Ee),_.getClearColor($),se=_.getClearAlpha(),se<1&&_.setClearColor(16777215,.5),_.clear(),Ce&&et.render(ie);const Ye=_.toneMapping;_.toneMapping=dr;const dt=re.viewport;if(re.viewport!==void 0&&(re.viewport=void 0),f.setupLightsView(re),oe===!0&&we.setGlobalState(_.clippingPlanes,re),Qi(w,ie,re),R.updateMultisampleRenderTarget(Ee),R.updateRenderTargetMipmap(Ee),pt.has("WEBGL_multisampled_render_to_texture")===!1){let gt=!1;for(let We=0,At=z.length;We<At;We++){const kt=z[We],Kt=kt.object,pn=kt.geometry,Ft=kt.material,Oe=kt.group;if(Ft.side===xi&&Kt.layers.test(re.layers)){const zn=Ft.side;Ft.side=Cn,Ft.needsUpdate=!0,ni(Kt,ie,re,pn,Ft,Oe),Ft.side=zn,Ft.needsUpdate=!0,gt=!0}}gt===!0&&(R.updateMultisampleRenderTarget(Ee),R.updateRenderTargetMipmap(Ee))}_.setRenderTarget(Qe),_.setClearColor($,se),dt!==void 0&&(re.viewport=dt),_.toneMapping=Ye}function Qi(w,z,ie){const re=z.isScene===!0?z.overrideMaterial:null;for(let G=0,Ee=w.length;G<Ee;G++){const Ue=w[G],Qe=Ue.object,Ye=Ue.geometry,dt=re===null?Ue.material:re,gt=Ue.group;Qe.layers.test(ie.layers)&&ni(Qe,z,ie,Ye,dt,gt)}}function ni(w,z,ie,re,G,Ee){w.onBeforeRender(_,z,ie,re,G,Ee),w.modelViewMatrix.multiplyMatrices(ie.matrixWorldInverse,w.matrixWorld),w.normalMatrix.getNormalMatrix(w.modelViewMatrix),G.onBeforeRender(_,z,ie,re,w,Ee),G.transparent===!0&&G.side===xi&&G.forceSinglePass===!1?(G.side=Cn,G.needsUpdate=!0,_.renderBufferDirect(ie,z,re,G,w,Ee),G.side=ji,G.needsUpdate=!0,_.renderBufferDirect(ie,z,re,G,w,Ee),G.side=xi):_.renderBufferDirect(ie,z,re,G,w,Ee),w.onAfterRender(_,z,ie,re,G,Ee)}function Ur(w,z,ie){z.isScene!==!0&&(z=Ze);const re=it.get(w),G=f.state.lights,Ee=f.state.shadowsArray,Ue=G.state.version,Qe=Je.getParameters(w,G.state,Ee,z,ie),Ye=Je.getProgramCacheKey(Qe);let dt=re.programs;re.environment=w.isMeshStandardMaterial?z.environment:null,re.fog=z.fog,re.envMap=(w.isMeshStandardMaterial?te:S).get(w.envMap||re.environment),re.envMapRotation=re.environment!==null&&w.envMap===null?z.environmentRotation:w.envMapRotation,dt===void 0&&(w.addEventListener("dispose",ft),dt=new Map,re.programs=dt);let gt=dt.get(Ye);if(gt!==void 0){if(re.currentProgram===gt&&re.lightsStateVersion===Ue)return bo(w,Qe),gt}else Qe.uniforms=Je.getUniforms(w),w.onBeforeCompile(Qe,_),gt=Je.acquireProgram(Qe,Ye),dt.set(Ye,gt),re.uniforms=Qe.uniforms;const We=re.uniforms;return(!w.isShaderMaterial&&!w.isRawShaderMaterial||w.clipping===!0)&&(We.clippingPlanes=we.uniform),bo(w,Qe),re.needsLights=Na(w),re.lightsStateVersion=Ue,re.needsLights&&(We.ambientLightColor.value=G.state.ambient,We.lightProbe.value=G.state.probe,We.directionalLights.value=G.state.directional,We.directionalLightShadows.value=G.state.directionalShadow,We.spotLights.value=G.state.spot,We.spotLightShadows.value=G.state.spotShadow,We.rectAreaLights.value=G.state.rectArea,We.ltc_1.value=G.state.rectAreaLTC1,We.ltc_2.value=G.state.rectAreaLTC2,We.pointLights.value=G.state.point,We.pointLightShadows.value=G.state.pointShadow,We.hemisphereLights.value=G.state.hemi,We.directionalShadowMap.value=G.state.directionalShadowMap,We.directionalShadowMatrix.value=G.state.directionalShadowMatrix,We.spotShadowMap.value=G.state.spotShadowMap,We.spotLightMatrix.value=G.state.spotLightMatrix,We.spotLightMap.value=G.state.spotLightMap,We.pointShadowMap.value=G.state.pointShadowMap,We.pointShadowMatrix.value=G.state.pointShadowMatrix),re.currentProgram=gt,re.uniformsList=null,gt}function go(w){if(w.uniformsList===null){const z=w.currentProgram.getUniforms();w.uniformsList=ca.seqWithValue(z.seq,w.uniforms)}return w.uniformsList}function bo(w,z){const ie=it.get(w);ie.outputColorSpace=z.outputColorSpace,ie.batching=z.batching,ie.batchingColor=z.batchingColor,ie.instancing=z.instancing,ie.instancingColor=z.instancingColor,ie.instancingMorph=z.instancingMorph,ie.skinning=z.skinning,ie.morphTargets=z.morphTargets,ie.morphNormals=z.morphNormals,ie.morphColors=z.morphColors,ie.morphTargetsCount=z.morphTargetsCount,ie.numClippingPlanes=z.numClippingPlanes,ie.numIntersection=z.numClipIntersection,ie.vertexAlphas=z.vertexAlphas,ie.vertexTangents=z.vertexTangents,ie.toneMapping=z.toneMapping}function Ia(w,z,ie,re,G){z.isScene!==!0&&(z=Ze),R.resetTextureUnits();const Ee=z.fog,Ue=re.isMeshStandardMaterial?z.environment:null,Qe=N===null?_.outputColorSpace:N.isXRRenderTarget===!0?N.texture.colorSpace:Ln,Ye=(re.isMeshStandardMaterial?te:S).get(re.envMap||Ue),dt=re.vertexColors===!0&&!!ie.attributes.color&&ie.attributes.color.itemSize===4,gt=!!ie.attributes.tangent&&(!!re.normalMap||re.anisotropy>0),We=!!ie.morphAttributes.position,At=!!ie.morphAttributes.normal,kt=!!ie.morphAttributes.color;let Kt=dr;re.toneMapped&&(N===null||N.isXRRenderTarget===!0)&&(Kt=_.toneMapping);const pn=ie.morphAttributes.position||ie.morphAttributes.normal||ie.morphAttributes.color,Ft=pn!==void 0?pn.length:0,Oe=it.get(re),zn=f.state.lights;if(oe===!0&&(xe===!0||w!==y)){const Mn=w===y&&re.id===v;we.setState(re,w,Mn)}let Lt=!1;re.version===Oe.__version?(Oe.needsLights&&Oe.lightsStateVersion!==zn.state.version||Oe.outputColorSpace!==Qe||G.isBatchedMesh&&Oe.batching===!1||!G.isBatchedMesh&&Oe.batching===!0||G.isBatchedMesh&&Oe.batchingColor===!0&&G.colorTexture===null||G.isBatchedMesh&&Oe.batchingColor===!1&&G.colorTexture!==null||G.isInstancedMesh&&Oe.instancing===!1||!G.isInstancedMesh&&Oe.instancing===!0||G.isSkinnedMesh&&Oe.skinning===!1||!G.isSkinnedMesh&&Oe.skinning===!0||G.isInstancedMesh&&Oe.instancingColor===!0&&G.instanceColor===null||G.isInstancedMesh&&Oe.instancingColor===!1&&G.instanceColor!==null||G.isInstancedMesh&&Oe.instancingMorph===!0&&G.morphTexture===null||G.isInstancedMesh&&Oe.instancingMorph===!1&&G.morphTexture!==null||Oe.envMap!==Ye||re.fog===!0&&Oe.fog!==Ee||Oe.numClippingPlanes!==void 0&&(Oe.numClippingPlanes!==we.numPlanes||Oe.numIntersection!==we.numIntersection)||Oe.vertexAlphas!==dt||Oe.vertexTangents!==gt||Oe.morphTargets!==We||Oe.morphNormals!==At||Oe.morphColors!==kt||Oe.toneMapping!==Kt||Oe.morphTargetsCount!==Ft)&&(Lt=!0):(Lt=!0,Oe.__version=re.version);let In=Oe.currentProgram;Lt===!0&&(In=Ur(re,z,G));let Ki=!1,tn=!1,gr=!1;const Ot=In.getUniforms(),Fn=Oe.uniforms;if(Fe.useProgram(In.program)&&(Ki=!0,tn=!0,gr=!0),re.id!==v&&(v=re.id,tn=!0),Ki||y!==w){Fe.buffers.depth.getReversed()?(me.copy(w.projectionMatrix),Np(me),Up(me),Ot.setValue(F,"projectionMatrix",me)):Ot.setValue(F,"projectionMatrix",w.projectionMatrix),Ot.setValue(F,"viewMatrix",w.matrixWorldInverse);const fi=Ot.map.cameraPosition;fi!==void 0&&fi.setValue(F,ke.setFromMatrixPosition(w.matrixWorld)),ct.logarithmicDepthBuffer&&Ot.setValue(F,"logDepthBufFC",2/(Math.log(w.far+1)/Math.LN2)),(re.isMeshPhongMaterial||re.isMeshToonMaterial||re.isMeshLambertMaterial||re.isMeshBasicMaterial||re.isMeshStandardMaterial||re.isShaderMaterial)&&Ot.setValue(F,"isOrthographic",w.isOrthographicCamera===!0),y!==w&&(y=w,tn=!0,gr=!0)}if(G.isSkinnedMesh){Ot.setOptional(F,G,"bindMatrix"),Ot.setOptional(F,G,"bindMatrixInverse");const Mn=G.skeleton;Mn&&(Mn.boneTexture===null&&Mn.computeBoneTexture(),Ot.setValue(F,"boneTexture",Mn.boneTexture,R))}G.isBatchedMesh&&(Ot.setOptional(F,G,"batchingTexture"),Ot.setValue(F,"batchingTexture",G._matricesTexture,R),Ot.setOptional(F,G,"batchingIdTexture"),Ot.setValue(F,"batchingIdTexture",G._indirectTexture,R),Ot.setOptional(F,G,"batchingColorTexture"),G._colorsTexture!==null&&Ot.setValue(F,"batchingColorTexture",G._colorsTexture,R));const br=ie.morphAttributes;if((br.position!==void 0||br.normal!==void 0||br.color!==void 0)&&at.update(G,ie,In),(tn||Oe.receiveShadow!==G.receiveShadow)&&(Oe.receiveShadow=G.receiveShadow,Ot.setValue(F,"receiveShadow",G.receiveShadow)),re.isMeshGouraudMaterial&&re.envMap!==null&&(Fn.envMap.value=Ye,Fn.flipEnvMap.value=Ye.isCubeTexture&&Ye.isRenderTargetTexture===!1?-1:1),re.isMeshStandardMaterial&&re.envMap===null&&z.environment!==null&&(Fn.envMapIntensity.value=z.environmentIntensity),tn&&(Ot.setValue(F,"toneMappingExposure",_.toneMappingExposure),Oe.needsLights&&Fa(Fn,gr),Ee&&re.fog===!0&&Le.refreshFogUniforms(Fn,Ee),Le.refreshMaterialUniforms(Fn,re,L,ce,f.state.transmissionRenderTarget[w.id]),ca.upload(F,go(Oe),Fn,R)),re.isShaderMaterial&&re.uniformsNeedUpdate===!0&&(ca.upload(F,go(Oe),Fn,R),re.uniformsNeedUpdate=!1),re.isSpriteMaterial&&Ot.setValue(F,"center",G.center),Ot.setValue(F,"modelViewMatrix",G.modelViewMatrix),Ot.setValue(F,"normalMatrix",G.normalMatrix),Ot.setValue(F,"modelMatrix",G.matrixWorld),re.isShaderMaterial||re.isRawShaderMaterial){const Mn=re.uniformsGroups;for(let fi=0,Hn=Mn.length;fi<Hn;fi++){const Os=Mn[fi];B.update(Os,In),B.bind(Os,In)}}return In}function Fa(w,z){w.ambientLightColor.needsUpdate=z,w.lightProbe.needsUpdate=z,w.directionalLights.needsUpdate=z,w.directionalLightShadows.needsUpdate=z,w.pointLights.needsUpdate=z,w.pointLightShadows.needsUpdate=z,w.spotLights.needsUpdate=z,w.spotLightShadows.needsUpdate=z,w.rectAreaLights.needsUpdate=z,w.hemisphereLights.needsUpdate=z}function Na(w){return w.isMeshLambertMaterial||w.isMeshToonMaterial||w.isMeshPhongMaterial||w.isMeshStandardMaterial||w.isShadowMaterial||w.isShaderMaterial&&w.lights===!0}this.getActiveCubeFace=function(){return P},this.getActiveMipmapLevel=function(){return T},this.getRenderTarget=function(){return N},this.setRenderTargetTextures=function(w,z,ie){it.get(w.texture).__webglTexture=z,it.get(w.depthTexture).__webglTexture=ie;const re=it.get(w);re.__hasExternalTextures=!0,re.__autoAllocateDepthBuffer=ie===void 0,re.__autoAllocateDepthBuffer||pt.has("WEBGL_multisampled_render_to_texture")===!0&&(console.warn("THREE.WebGLRenderer: Render-to-texture extension was disabled because an external texture was provided"),re.__useRenderToTexture=!1)},this.setRenderTargetFramebuffer=function(w,z){const ie=it.get(w);ie.__webglFramebuffer=z,ie.__useDefaultFramebuffer=z===void 0},this.setRenderTarget=function(w,z=0,ie=0){N=w,P=z,T=ie;let re=!0,G=null,Ee=!1,Ue=!1;if(w){const Ye=it.get(w);if(Ye.__useDefaultFramebuffer!==void 0)Fe.bindFramebuffer(F.FRAMEBUFFER,null),re=!1;else if(Ye.__webglFramebuffer===void 0)R.setupRenderTarget(w);else if(Ye.__hasExternalTextures)R.rebindTextures(w,it.get(w.texture).__webglTexture,it.get(w.depthTexture).__webglTexture);else if(w.depthBuffer){const We=w.depthTexture;if(Ye.__boundDepthTexture!==We){if(We!==null&&it.has(We)&&(w.width!==We.image.width||w.height!==We.image.height))throw new Error("WebGLRenderTarget: Attached DepthTexture is initialized to the incorrect size.");R.setupDepthRenderbuffer(w)}}const dt=w.texture;(dt.isData3DTexture||dt.isDataArrayTexture||dt.isCompressedArrayTexture)&&(Ue=!0);const gt=it.get(w).__webglFramebuffer;w.isWebGLCubeRenderTarget?(Array.isArray(gt[z])?G=gt[z][ie]:G=gt[z],Ee=!0):w.samples>0&&R.useMultisampledRTT(w)===!1?G=it.get(w).__webglMultisampledFramebuffer:Array.isArray(gt)?G=gt[ie]:G=gt,C.copy(w.viewport),q.copy(w.scissor),O=w.scissorTest}else C.copy(X).multiplyScalar(L).floor(),q.copy(ee).multiplyScalar(L).floor(),O=le;if(Fe.bindFramebuffer(F.FRAMEBUFFER,G)&&re&&Fe.drawBuffers(w,G),Fe.viewport(C),Fe.scissor(q),Fe.setScissorTest(O),Ee){const Ye=it.get(w.texture);F.framebufferTexture2D(F.FRAMEBUFFER,F.COLOR_ATTACHMENT0,F.TEXTURE_CUBE_MAP_POSITIVE_X+z,Ye.__webglTexture,ie)}else if(Ue){const Ye=it.get(w.texture),dt=z||0;F.framebufferTextureLayer(F.FRAMEBUFFER,F.COLOR_ATTACHMENT0,Ye.__webglTexture,ie||0,dt)}v=-1},this.readRenderTargetPixels=function(w,z,ie,re,G,Ee,Ue){if(!(w&&w.isWebGLRenderTarget)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");return}let Qe=it.get(w).__webglFramebuffer;if(w.isWebGLCubeRenderTarget&&Ue!==void 0&&(Qe=Qe[Ue]),Qe){Fe.bindFramebuffer(F.FRAMEBUFFER,Qe);try{const Ye=w.texture,dt=Ye.format,gt=Ye.type;if(!ct.textureFormatReadable(dt)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in RGBA or implementation defined format.");return}if(!ct.textureTypeReadable(gt)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in UnsignedByteType or implementation defined type.");return}z>=0&&z<=w.width-re&&ie>=0&&ie<=w.height-G&&F.readPixels(z,ie,re,G,bt.convert(dt),bt.convert(gt),Ee)}finally{const Ye=N!==null?it.get(N).__webglFramebuffer:null;Fe.bindFramebuffer(F.FRAMEBUFFER,Ye)}}},this.readRenderTargetPixelsAsync=async function(w,z,ie,re,G,Ee,Ue){if(!(w&&w.isWebGLRenderTarget))throw new Error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");let Qe=it.get(w).__webglFramebuffer;if(w.isWebGLCubeRenderTarget&&Ue!==void 0&&(Qe=Qe[Ue]),Qe){const Ye=w.texture,dt=Ye.format,gt=Ye.type;if(!ct.textureFormatReadable(dt))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in RGBA or implementation defined format.");if(!ct.textureTypeReadable(gt))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in UnsignedByteType or implementation defined type.");if(z>=0&&z<=w.width-re&&ie>=0&&ie<=w.height-G){Fe.bindFramebuffer(F.FRAMEBUFFER,Qe);const We=F.createBuffer();F.bindBuffer(F.PIXEL_PACK_BUFFER,We),F.bufferData(F.PIXEL_PACK_BUFFER,Ee.byteLength,F.STREAM_READ),F.readPixels(z,ie,re,G,bt.convert(dt),bt.convert(gt),0);const At=N!==null?it.get(N).__webglFramebuffer:null;Fe.bindFramebuffer(F.FRAMEBUFFER,At);const kt=F.fenceSync(F.SYNC_GPU_COMMANDS_COMPLETE,0);return F.flush(),await Fp(F,kt,4),F.bindBuffer(F.PIXEL_PACK_BUFFER,We),F.getBufferSubData(F.PIXEL_PACK_BUFFER,0,Ee),F.deleteBuffer(We),F.deleteSync(kt),Ee}else throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: requested read bounds are out of range.")}},this.copyFramebufferToTexture=function(w,z=null,ie=0){w.isTexture!==!0&&(Ys("WebGLRenderer: copyFramebufferToTexture function signature has changed."),z=arguments[0]||null,w=arguments[1]);const re=Math.pow(2,-ie),G=Math.floor(w.image.width*re),Ee=Math.floor(w.image.height*re),Ue=z!==null?z.x:0,Qe=z!==null?z.y:0;R.setTexture2D(w,0),F.copyTexSubImage2D(F.TEXTURE_2D,ie,0,0,Ue,Qe,G,Ee),Fe.unbindTexture()},this.copyTextureToTexture=function(w,z,ie=null,re=null,G=0){w.isTexture!==!0&&(Ys("WebGLRenderer: copyTextureToTexture function signature has changed."),re=arguments[0]||null,w=arguments[1],z=arguments[2],G=arguments[3]||0,ie=null);let Ee,Ue,Qe,Ye,dt,gt,We,At,kt;const Kt=w.isCompressedTexture?w.mipmaps[G]:w.image;ie!==null?(Ee=ie.max.x-ie.min.x,Ue=ie.max.y-ie.min.y,Qe=ie.isBox3?ie.max.z-ie.min.z:1,Ye=ie.min.x,dt=ie.min.y,gt=ie.isBox3?ie.min.z:0):(Ee=Kt.width,Ue=Kt.height,Qe=Kt.depth||1,Ye=0,dt=0,gt=0),re!==null?(We=re.x,At=re.y,kt=re.z):(We=0,At=0,kt=0);const pn=bt.convert(z.format),Ft=bt.convert(z.type);let Oe;z.isData3DTexture?(R.setTexture3D(z,0),Oe=F.TEXTURE_3D):z.isDataArrayTexture||z.isCompressedArrayTexture?(R.setTexture2DArray(z,0),Oe=F.TEXTURE_2D_ARRAY):(R.setTexture2D(z,0),Oe=F.TEXTURE_2D),F.pixelStorei(F.UNPACK_FLIP_Y_WEBGL,z.flipY),F.pixelStorei(F.UNPACK_PREMULTIPLY_ALPHA_WEBGL,z.premultiplyAlpha),F.pixelStorei(F.UNPACK_ALIGNMENT,z.unpackAlignment);const zn=F.getParameter(F.UNPACK_ROW_LENGTH),Lt=F.getParameter(F.UNPACK_IMAGE_HEIGHT),In=F.getParameter(F.UNPACK_SKIP_PIXELS),Ki=F.getParameter(F.UNPACK_SKIP_ROWS),tn=F.getParameter(F.UNPACK_SKIP_IMAGES);F.pixelStorei(F.UNPACK_ROW_LENGTH,Kt.width),F.pixelStorei(F.UNPACK_IMAGE_HEIGHT,Kt.height),F.pixelStorei(F.UNPACK_SKIP_PIXELS,Ye),F.pixelStorei(F.UNPACK_SKIP_ROWS,dt),F.pixelStorei(F.UNPACK_SKIP_IMAGES,gt);const gr=w.isDataArrayTexture||w.isData3DTexture,Ot=z.isDataArrayTexture||z.isData3DTexture;if(w.isRenderTargetTexture||w.isDepthTexture){const Fn=it.get(w),br=it.get(z),Mn=it.get(Fn.__renderTarget),fi=it.get(br.__renderTarget);Fe.bindFramebuffer(F.READ_FRAMEBUFFER,Mn.__webglFramebuffer),Fe.bindFramebuffer(F.DRAW_FRAMEBUFFER,fi.__webglFramebuffer);for(let Hn=0;Hn<Qe;Hn++)gr&&F.framebufferTextureLayer(F.READ_FRAMEBUFFER,F.COLOR_ATTACHMENT0,it.get(w).__webglTexture,G,gt+Hn),w.isDepthTexture?(Ot&&F.framebufferTextureLayer(F.DRAW_FRAMEBUFFER,F.COLOR_ATTACHMENT0,it.get(z).__webglTexture,G,kt+Hn),F.blitFramebuffer(Ye,dt,Ee,Ue,We,At,Ee,Ue,F.DEPTH_BUFFER_BIT,F.NEAREST)):Ot?F.copyTexSubImage3D(Oe,G,We,At,kt+Hn,Ye,dt,Ee,Ue):F.copyTexSubImage2D(Oe,G,We,At,kt+Hn,Ye,dt,Ee,Ue);Fe.bindFramebuffer(F.READ_FRAMEBUFFER,null),Fe.bindFramebuffer(F.DRAW_FRAMEBUFFER,null)}else Ot?w.isDataTexture||w.isData3DTexture?F.texSubImage3D(Oe,G,We,At,kt,Ee,Ue,Qe,pn,Ft,Kt.data):z.isCompressedArrayTexture?F.compressedTexSubImage3D(Oe,G,We,At,kt,Ee,Ue,Qe,pn,Kt.data):F.texSubImage3D(Oe,G,We,At,kt,Ee,Ue,Qe,pn,Ft,Kt):w.isDataTexture?F.texSubImage2D(F.TEXTURE_2D,G,We,At,Ee,Ue,pn,Ft,Kt.data):w.isCompressedTexture?F.compressedTexSubImage2D(F.TEXTURE_2D,G,We,At,Kt.width,Kt.height,pn,Kt.data):F.texSubImage2D(F.TEXTURE_2D,G,We,At,Ee,Ue,pn,Ft,Kt);F.pixelStorei(F.UNPACK_ROW_LENGTH,zn),F.pixelStorei(F.UNPACK_IMAGE_HEIGHT,Lt),F.pixelStorei(F.UNPACK_SKIP_PIXELS,In),F.pixelStorei(F.UNPACK_SKIP_ROWS,Ki),F.pixelStorei(F.UNPACK_SKIP_IMAGES,tn),G===0&&z.generateMipmaps&&F.generateMipmap(Oe),Fe.unbindTexture()},this.copyTextureToTexture3D=function(w,z,ie=null,re=null,G=0){return w.isTexture!==!0&&(Ys("WebGLRenderer: copyTextureToTexture3D function signature has changed."),ie=arguments[0]||null,re=arguments[1]||null,w=arguments[2],z=arguments[3],G=arguments[4]||0),Ys('WebGLRenderer: copyTextureToTexture3D function has been deprecated. Use "copyTextureToTexture" instead.'),this.copyTextureToTexture(w,z,ie,re,G)},this.initRenderTarget=function(w){it.get(w).__webglFramebuffer===void 0&&R.setupRenderTarget(w)},this.initTexture=function(w){w.isCubeTexture?R.setTextureCube(w,0):w.isData3DTexture?R.setTexture3D(w,0):w.isDataArrayTexture||w.isCompressedArrayTexture?R.setTexture2DArray(w,0):R.setTexture2D(w,0),Fe.unbindTexture()},this.resetState=function(){P=0,T=0,N=null,Fe.reset(),Dt.reset()},typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}get coordinateSystem(){return Hi}get outputColorSpace(){return this._outputColorSpace}set outputColorSpace(e){this._outputColorSpace=e;const t=this.getContext();t.drawingBufferColorspace=Pt._getDrawingBufferColorSpace(e),t.unpackColorSpace=Pt._getUnpackColorSpace()}}class Yl extends en{constructor(){super(),this.isScene=!0,this.type="Scene",this.background=null,this.environment=null,this.fog=null,this.backgroundBlurriness=0,this.backgroundIntensity=1,this.backgroundRotation=new Mi,this.environmentIntensity=1,this.environmentRotation=new Mi,this.overrideMaterial=null,typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}copy(e,t){return super.copy(e,t),e.background!==null&&(this.background=e.background.clone()),e.environment!==null&&(this.environment=e.environment.clone()),e.fog!==null&&(this.fog=e.fog.clone()),this.backgroundBlurriness=e.backgroundBlurriness,this.backgroundIntensity=e.backgroundIntensity,this.backgroundRotation.copy(e.backgroundRotation),this.environmentIntensity=e.environmentIntensity,this.environmentRotation.copy(e.environmentRotation),e.overrideMaterial!==null&&(this.overrideMaterial=e.overrideMaterial.clone()),this.matrixAutoUpdate=e.matrixAutoUpdate,this}toJSON(e){const t=super.toJSON(e);return this.fog!==null&&(t.object.fog=this.fog.toJSON()),this.backgroundBlurriness>0&&(t.object.backgroundBlurriness=this.backgroundBlurriness),this.backgroundIntensity!==1&&(t.object.backgroundIntensity=this.backgroundIntensity),t.object.backgroundRotation=this.backgroundRotation.toArray(),this.environmentIntensity!==1&&(t.object.environmentIntensity=this.environmentIntensity),t.object.environmentRotation=this.environmentRotation.toArray(),t}}class j_{constructor(e,t){this.isInterleavedBuffer=!0,this.array=e,this.stride=t,this.count=e!==void 0?e.length/t:0,this.usage=yl,this.updateRanges=[],this.version=0,this.uuid=di()}onUploadCallback(){}set needsUpdate(e){e===!0&&this.version++}setUsage(e){return this.usage=e,this}addUpdateRange(e,t){this.updateRanges.push({start:e,count:t})}clearUpdateRanges(){this.updateRanges.length=0}copy(e){return this.array=new e.array.constructor(e.array),this.count=e.count,this.stride=e.stride,this.usage=e.usage,this}copyAt(e,t,n){e*=this.stride,n*=t.stride;for(let r=0,s=this.stride;r<s;r++)this.array[e+r]=t.array[n+r];return this}set(e,t=0){return this.array.set(e,t),this}clone(e){e.arrayBuffers===void 0&&(e.arrayBuffers={}),this.array.buffer._uuid===void 0&&(this.array.buffer._uuid=di()),e.arrayBuffers[this.array.buffer._uuid]===void 0&&(e.arrayBuffers[this.array.buffer._uuid]=this.array.slice(0).buffer);const t=new this.array.constructor(e.arrayBuffers[this.array.buffer._uuid]),n=new this.constructor(t,this.stride);return n.setUsage(this.usage),n}onUpload(e){return this.onUploadCallback=e,this}toJSON(e){return e.arrayBuffers===void 0&&(e.arrayBuffers={}),this.array.buffer._uuid===void 0&&(this.array.buffer._uuid=di()),e.arrayBuffers[this.array.buffer._uuid]===void 0&&(e.arrayBuffers[this.array.buffer._uuid]=Array.from(new Uint32Array(this.array.buffer))),{uuid:this.uuid,buffer:this.array.buffer._uuid,type:this.array.constructor.name,stride:this.stride}}}const An=new A;class $l{constructor(e,t,n,r=!1){this.isInterleavedBufferAttribute=!0,this.name="",this.data=e,this.itemSize=t,this.offset=n,this.normalized=r}get count(){return this.data.count}get array(){return this.data.array}set needsUpdate(e){this.data.needsUpdate=e}applyMatrix4(e){for(let t=0,n=this.data.count;t<n;t++)An.fromBufferAttribute(this,t),An.applyMatrix4(e),this.setXYZ(t,An.x,An.y,An.z);return this}applyNormalMatrix(e){for(let t=0,n=this.count;t<n;t++)An.fromBufferAttribute(this,t),An.applyNormalMatrix(e),this.setXYZ(t,An.x,An.y,An.z);return this}transformDirection(e){for(let t=0,n=this.count;t<n;t++)An.fromBufferAttribute(this,t),An.transformDirection(e),this.setXYZ(t,An.x,An.y,An.z);return this}getComponent(e,t){let n=this.array[e*this.data.stride+this.offset+t];return this.normalized&&(n=ci(n,this.array)),n}setComponent(e,t,n){return this.normalized&&(n=Ht(n,this.array)),this.data.array[e*this.data.stride+this.offset+t]=n,this}setX(e,t){return this.normalized&&(t=Ht(t,this.array)),this.data.array[e*this.data.stride+this.offset]=t,this}setY(e,t){return this.normalized&&(t=Ht(t,this.array)),this.data.array[e*this.data.stride+this.offset+1]=t,this}setZ(e,t){return this.normalized&&(t=Ht(t,this.array)),this.data.array[e*this.data.stride+this.offset+2]=t,this}setW(e,t){return this.normalized&&(t=Ht(t,this.array)),this.data.array[e*this.data.stride+this.offset+3]=t,this}getX(e){let t=this.data.array[e*this.data.stride+this.offset];return this.normalized&&(t=ci(t,this.array)),t}getY(e){let t=this.data.array[e*this.data.stride+this.offset+1];return this.normalized&&(t=ci(t,this.array)),t}getZ(e){let t=this.data.array[e*this.data.stride+this.offset+2];return this.normalized&&(t=ci(t,this.array)),t}getW(e){let t=this.data.array[e*this.data.stride+this.offset+3];return this.normalized&&(t=ci(t,this.array)),t}setXY(e,t,n){return e=e*this.data.stride+this.offset,this.normalized&&(t=Ht(t,this.array),n=Ht(n,this.array)),this.data.array[e+0]=t,this.data.array[e+1]=n,this}setXYZ(e,t,n,r){return e=e*this.data.stride+this.offset,this.normalized&&(t=Ht(t,this.array),n=Ht(n,this.array),r=Ht(r,this.array)),this.data.array[e+0]=t,this.data.array[e+1]=n,this.data.array[e+2]=r,this}setXYZW(e,t,n,r,s){return e=e*this.data.stride+this.offset,this.normalized&&(t=Ht(t,this.array),n=Ht(n,this.array),r=Ht(r,this.array),s=Ht(s,this.array)),this.data.array[e+0]=t,this.data.array[e+1]=n,this.data.array[e+2]=r,this.data.array[e+3]=s,this}clone(e){if(e===void 0){console.log("THREE.InterleavedBufferAttribute.clone(): Cloning an interleaved buffer attribute will de-interleave buffer data.");const t=[];for(let n=0;n<this.count;n++){const r=n*this.data.stride+this.offset;for(let s=0;s<this.itemSize;s++)t.push(this.data.array[r+s])}return new yn(new this.array.constructor(t),this.itemSize,this.normalized)}else return e.interleavedBuffers===void 0&&(e.interleavedBuffers={}),e.interleavedBuffers[this.data.uuid]===void 0&&(e.interleavedBuffers[this.data.uuid]=this.data.clone(e)),new $l(e.interleavedBuffers[this.data.uuid],this.itemSize,this.offset,this.normalized)}toJSON(e){if(e===void 0){console.log("THREE.InterleavedBufferAttribute.toJSON(): Serializing an interleaved buffer attribute will de-interleave buffer data.");const t=[];for(let n=0;n<this.count;n++){const r=n*this.data.stride+this.offset;for(let s=0;s<this.itemSize;s++)t.push(this.data.array[r+s])}return{itemSize:this.itemSize,type:this.array.constructor.name,array:t,normalized:this.normalized}}else return e.interleavedBuffers===void 0&&(e.interleavedBuffers={}),e.interleavedBuffers[this.data.uuid]===void 0&&(e.interleavedBuffers[this.data.uuid]=this.data.toJSON(e)),{isInterleavedBufferAttribute:!0,itemSize:this.itemSize,data:this.data.uuid,offset:this.offset,normalized:this.normalized}}}const fd=new A,pd=new mt,md=new mt,X_=new A,gd=new ot,ko=new A,mc=new wi,bd=new ot,gc=new Rs;class Q_ extends Xt{constructor(e,t){super(e,t),this.isSkinnedMesh=!0,this.type="SkinnedMesh",this.bindMode=gu,this.bindMatrix=new ot,this.bindMatrixInverse=new ot,this.boundingBox=null,this.boundingSphere=null}computeBoundingBox(){const e=this.geometry;this.boundingBox===null&&(this.boundingBox=new an),this.boundingBox.makeEmpty();const t=e.getAttribute("position");for(let n=0;n<t.count;n++)this.getVertexPosition(n,ko),this.boundingBox.expandByPoint(ko)}computeBoundingSphere(){const e=this.geometry;this.boundingSphere===null&&(this.boundingSphere=new wi),this.boundingSphere.makeEmpty();const t=e.getAttribute("position");for(let n=0;n<t.count;n++)this.getVertexPosition(n,ko),this.boundingSphere.expandByPoint(ko)}copy(e,t){return super.copy(e,t),this.bindMode=e.bindMode,this.bindMatrix.copy(e.bindMatrix),this.bindMatrixInverse.copy(e.bindMatrixInverse),this.skeleton=e.skeleton,e.boundingBox!==null&&(this.boundingBox=e.boundingBox.clone()),e.boundingSphere!==null&&(this.boundingSphere=e.boundingSphere.clone()),this}raycast(e,t){const n=this.material,r=this.matrixWorld;n!==void 0&&(this.boundingSphere===null&&this.computeBoundingSphere(),mc.copy(this.boundingSphere),mc.applyMatrix4(r),e.ray.intersectsSphere(mc)!==!1&&(bd.copy(r).invert(),gc.copy(e.ray).applyMatrix4(bd),!(this.boundingBox!==null&&gc.intersectsBox(this.boundingBox)===!1)&&this._computeIntersections(e,t,gc)))}getVertexPosition(e,t){return super.getVertexPosition(e,t),this.applyBoneTransform(e,t),t}bind(e,t){this.skeleton=e,t===void 0&&(this.updateMatrixWorld(!0),this.skeleton.calculateInverses(),t=this.matrixWorld),this.bindMatrix.copy(t),this.bindMatrixInverse.copy(t).invert()}pose(){this.skeleton.pose()}normalizeSkinWeights(){const e=new mt,t=this.geometry.attributes.skinWeight;for(let n=0,r=t.count;n<r;n++){e.fromBufferAttribute(t,n);const s=1/e.manhattanLength();s!==1/0?e.multiplyScalar(s):e.set(1,0,0,0),t.setXYZW(n,e.x,e.y,e.z,e.w)}}updateMatrixWorld(e){super.updateMatrixWorld(e),this.bindMode===gu?this.bindMatrixInverse.copy(this.matrixWorld).invert():this.bindMode===rp?this.bindMatrixInverse.copy(this.bindMatrix).invert():console.warn("THREE.SkinnedMesh: Unrecognized bindMode: "+this.bindMode)}applyBoneTransform(e,t){const n=this.skeleton,r=this.geometry;pd.fromBufferAttribute(r.attributes.skinIndex,e),md.fromBufferAttribute(r.attributes.skinWeight,e),fd.copy(t).applyMatrix4(this.bindMatrix),t.set(0,0,0);for(let s=0;s<4;s++){const o=md.getComponent(s);if(o!==0){const a=pd.getComponent(s);gd.multiplyMatrices(n.bones[a].matrixWorld,n.boneInverses[a]),t.addScaledVector(X_.copy(fd).applyMatrix4(gd),o)}}return t.applyMatrix4(this.bindMatrixInverse)}}class Zl extends en{constructor(){super(),this.isBone=!0,this.type="Bone"}}class kh extends un{constructor(e=null,t=1,n=1,r,s,o,a,l,c=Pn,u=Pn,d,h){super(null,o,a,l,c,u,r,s,d,h),this.isDataTexture=!0,this.image={data:e,width:t,height:n},this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}}const _d=new ot,K_=new ot;class Pa{constructor(e=[],t=[]){this.uuid=di(),this.bones=e.slice(0),this.boneInverses=t,this.boneMatrices=null,this.boneTexture=null,this.init()}init(){const e=this.bones,t=this.boneInverses;if(this.boneMatrices=new Float32Array(e.length*16),t.length===0)this.calculateInverses();else if(e.length!==t.length){console.warn("THREE.Skeleton: Number of inverse bone matrices does not match amount of bones."),this.boneInverses=[];for(let n=0,r=this.bones.length;n<r;n++)this.boneInverses.push(new ot)}}calculateInverses(){this.boneInverses.length=0;for(let e=0,t=this.bones.length;e<t;e++){const n=new ot;this.bones[e]&&n.copy(this.bones[e].matrixWorld).invert(),this.boneInverses.push(n)}}pose(){for(let e=0,t=this.bones.length;e<t;e++){const n=this.bones[e];n&&n.matrixWorld.copy(this.boneInverses[e]).invert()}for(let e=0,t=this.bones.length;e<t;e++){const n=this.bones[e];n&&(n.parent&&n.parent.isBone?(n.matrix.copy(n.parent.matrixWorld).invert(),n.matrix.multiply(n.matrixWorld)):n.matrix.copy(n.matrixWorld),n.matrix.decompose(n.position,n.quaternion,n.scale))}}update(){const e=this.bones,t=this.boneInverses,n=this.boneMatrices,r=this.boneTexture;for(let s=0,o=e.length;s<o;s++){const a=e[s]?e[s].matrixWorld:K_;_d.multiplyMatrices(a,t[s]),_d.toArray(n,s*16)}r!==null&&(r.needsUpdate=!0)}clone(){return new Pa(this.bones,this.boneInverses)}computeBoneTexture(){let e=Math.sqrt(this.bones.length*4);e=Math.ceil(e/4)*4,e=Math.max(e,4);const t=new Float32Array(e*e*4);t.set(this.boneMatrices);const n=new kh(t,e,e,ei,li);return n.needsUpdate=!0,this.boneMatrices=t,this.boneTexture=n,this}getBoneByName(e){for(let t=0,n=this.bones.length;t<n;t++){const r=this.bones[t];if(r.name===e)return r}}dispose(){this.boneTexture!==null&&(this.boneTexture.dispose(),this.boneTexture=null)}fromJSON(e,t){this.uuid=e.uuid;for(let n=0,r=e.bones.length;n<r;n++){const s=e.bones[n];let o=t[s];o===void 0&&(console.warn("THREE.Skeleton: No bone found with UUID:",s),o=new Zl),this.bones.push(o),this.boneInverses.push(new ot().fromArray(e.boneInverses[n]))}return this.init(),this}toJSON(){const e={metadata:{version:4.6,type:"Skeleton",generator:"Skeleton.toJSON"},bones:[],boneInverses:[]};e.uuid=this.uuid;const t=this.bones,n=this.boneInverses;for(let r=0,s=t.length;r<s;r++){const o=t[r];e.bones.push(o.uuid);const a=n[r];e.boneInverses.push(a.toArray())}return e}}class wl extends yn{constructor(e,t,n,r=1){super(e,t,n),this.isInstancedBufferAttribute=!0,this.meshPerAttribute=r}copy(e){return super.copy(e),this.meshPerAttribute=e.meshPerAttribute,this}toJSON(){const e=super.toJSON();return e.meshPerAttribute=this.meshPerAttribute,e.isInstancedBufferAttribute=!0,e}}const $r=new ot,xd=new ot,Bo=[],vd=new an,Y_=new ot,Gs=new Xt,Vs=new wi;class $_ extends Xt{constructor(e,t,n){super(e,t),this.isInstancedMesh=!0,this.instanceMatrix=new wl(new Float32Array(n*16),16),this.instanceColor=null,this.morphTexture=null,this.count=n,this.boundingBox=null,this.boundingSphere=null;for(let r=0;r<n;r++)this.setMatrixAt(r,Y_)}computeBoundingBox(){const e=this.geometry,t=this.count;this.boundingBox===null&&(this.boundingBox=new an),e.boundingBox===null&&e.computeBoundingBox(),this.boundingBox.makeEmpty();for(let n=0;n<t;n++)this.getMatrixAt(n,$r),vd.copy(e.boundingBox).applyMatrix4($r),this.boundingBox.union(vd)}computeBoundingSphere(){const e=this.geometry,t=this.count;this.boundingSphere===null&&(this.boundingSphere=new wi),e.boundingSphere===null&&e.computeBoundingSphere(),this.boundingSphere.makeEmpty();for(let n=0;n<t;n++)this.getMatrixAt(n,$r),Vs.copy(e.boundingSphere).applyMatrix4($r),this.boundingSphere.union(Vs)}copy(e,t){return super.copy(e,t),this.instanceMatrix.copy(e.instanceMatrix),e.morphTexture!==null&&(this.morphTexture=e.morphTexture.clone()),e.instanceColor!==null&&(this.instanceColor=e.instanceColor.clone()),this.count=e.count,e.boundingBox!==null&&(this.boundingBox=e.boundingBox.clone()),e.boundingSphere!==null&&(this.boundingSphere=e.boundingSphere.clone()),this}getColorAt(e,t){t.fromArray(this.instanceColor.array,e*3)}getMatrixAt(e,t){t.fromArray(this.instanceMatrix.array,e*16)}getMorphAt(e,t){const n=t.morphTargetInfluences,r=this.morphTexture.source.data.data,s=n.length+1,o=e*s+1;for(let a=0;a<n.length;a++)n[a]=r[o+a]}raycast(e,t){const n=this.matrixWorld,r=this.count;if(Gs.geometry=this.geometry,Gs.material=this.material,Gs.material!==void 0&&(this.boundingSphere===null&&this.computeBoundingSphere(),Vs.copy(this.boundingSphere),Vs.applyMatrix4(n),e.ray.intersectsSphere(Vs)!==!1))for(let s=0;s<r;s++){this.getMatrixAt(s,$r),xd.multiplyMatrices(n,$r),Gs.matrixWorld=xd,Gs.raycast(e,Bo);for(let o=0,a=Bo.length;o<a;o++){const l=Bo[o];l.instanceId=s,l.object=this,t.push(l)}Bo.length=0}}setColorAt(e,t){this.instanceColor===null&&(this.instanceColor=new wl(new Float32Array(this.instanceMatrix.count*3).fill(1),3)),t.toArray(this.instanceColor.array,e*3)}setMatrixAt(e,t){t.toArray(this.instanceMatrix.array,e*16)}setMorphAt(e,t){const n=t.morphTargetInfluences,r=n.length+1;this.morphTexture===null&&(this.morphTexture=new kh(new Float32Array(r*this.count),r,this.count,Hl,li));const s=this.morphTexture.source.data.data;let o=0;for(let c=0;c<n.length;c++)o+=n[c];const a=this.geometry.morphTargetsRelative?1:1-o,l=r*e;s[l]=a,s.set(n,l+1)}updateMorphTargets(){}dispose(){return this.dispatchEvent({type:"dispose"}),this.morphTexture!==null&&(this.morphTexture.dispose(),this.morphTexture=null),this}}class Bh extends hi{static get type(){return"LineBasicMaterial"}constructor(e){super(),this.isLineBasicMaterial=!0,this.color=new rt(16777215),this.map=null,this.linewidth=1,this.linecap="round",this.linejoin="round",this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.linewidth=e.linewidth,this.linecap=e.linecap,this.linejoin=e.linejoin,this.fog=e.fog,this}}const ba=new A,_a=new A,yd=new ot,Ws=new Rs,zo=new wi,bc=new A,Md=new A;class Jl extends en{constructor(e=new Ei,t=new Bh){super(),this.isLine=!0,this.type="Line",this.geometry=e,this.material=t,this.updateMorphTargets()}copy(e,t){return super.copy(e,t),this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}computeLineDistances(){const e=this.geometry;if(e.index===null){const t=e.attributes.position,n=[0];for(let r=1,s=t.count;r<s;r++)ba.fromBufferAttribute(t,r-1),_a.fromBufferAttribute(t,r),n[r]=n[r-1],n[r]+=ba.distanceTo(_a);e.setAttribute("lineDistance",new Wi(n,1))}else console.warn("THREE.Line.computeLineDistances(): Computation only possible with non-indexed BufferGeometry.");return this}raycast(e,t){const n=this.geometry,r=this.matrixWorld,s=e.params.Line.threshold,o=n.drawRange;if(n.boundingSphere===null&&n.computeBoundingSphere(),zo.copy(n.boundingSphere),zo.applyMatrix4(r),zo.radius+=s,e.ray.intersectsSphere(zo)===!1)return;yd.copy(r).invert(),Ws.copy(e.ray).applyMatrix4(yd);const a=s/((this.scale.x+this.scale.y+this.scale.z)/3),l=a*a,c=this.isLineSegments?2:1,u=n.index,h=n.attributes.position;if(u!==null){const p=Math.max(0,o.start),g=Math.min(u.count,o.start+o.count);for(let b=p,m=g-1;b<m;b+=c){const f=u.getX(b),M=u.getX(b+1),x=Ho(this,e,Ws,l,f,M);x&&t.push(x)}if(this.isLineLoop){const b=u.getX(g-1),m=u.getX(p),f=Ho(this,e,Ws,l,b,m);f&&t.push(f)}}else{const p=Math.max(0,o.start),g=Math.min(h.count,o.start+o.count);for(let b=p,m=g-1;b<m;b+=c){const f=Ho(this,e,Ws,l,b,b+1);f&&t.push(f)}if(this.isLineLoop){const b=Ho(this,e,Ws,l,g-1,p);b&&t.push(b)}}}updateMorphTargets(){const t=this.geometry.morphAttributes,n=Object.keys(t);if(n.length>0){const r=t[n[0]];if(r!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let s=0,o=r.length;s<o;s++){const a=r[s].name||String(s);this.morphTargetInfluences.push(0),this.morphTargetDictionary[a]=s}}}}}function Ho(i,e,t,n,r,s){const o=i.geometry.attributes.position;if(ba.fromBufferAttribute(o,r),_a.fromBufferAttribute(o,s),t.distanceSqToSegment(ba,_a,bc,Md)>n)return;bc.applyMatrix4(i.matrixWorld);const l=e.ray.origin.distanceTo(bc);if(!(l<e.near||l>e.far))return{distance:l,point:Md.clone().applyMatrix4(i.matrixWorld),index:r,face:null,faceIndex:null,barycoord:null,object:i}}const Sd=new A,wd=new A;class Z_ extends Jl{constructor(e,t){super(e,t),this.isLineSegments=!0,this.type="LineSegments"}computeLineDistances(){const e=this.geometry;if(e.index===null){const t=e.attributes.position,n=[];for(let r=0,s=t.count;r<s;r+=2)Sd.fromBufferAttribute(t,r),wd.fromBufferAttribute(t,r+1),n[r]=r===0?0:n[r-1],n[r+1]=n[r]+Sd.distanceTo(wd);e.setAttribute("lineDistance",new Wi(n,1))}else console.warn("THREE.LineSegments.computeLineDistances(): Computation only possible with non-indexed BufferGeometry.");return this}}class J_ extends Jl{constructor(e,t){super(e,t),this.isLineLoop=!0,this.type="LineLoop"}}class zh extends hi{static get type(){return"PointsMaterial"}constructor(e){super(),this.isPointsMaterial=!0,this.color=new rt(16777215),this.map=null,this.alphaMap=null,this.size=1,this.sizeAttenuation=!0,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.alphaMap=e.alphaMap,this.size=e.size,this.sizeAttenuation=e.sizeAttenuation,this.fog=e.fog,this}}const Ed=new ot,El=new Rs,Go=new wi,Vo=new A;class ex extends en{constructor(e=new Ei,t=new zh){super(),this.isPoints=!0,this.type="Points",this.geometry=e,this.material=t,this.updateMorphTargets()}copy(e,t){return super.copy(e,t),this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}raycast(e,t){const n=this.geometry,r=this.matrixWorld,s=e.params.Points.threshold,o=n.drawRange;if(n.boundingSphere===null&&n.computeBoundingSphere(),Go.copy(n.boundingSphere),Go.applyMatrix4(r),Go.radius+=s,e.ray.intersectsSphere(Go)===!1)return;Ed.copy(r).invert(),El.copy(e.ray).applyMatrix4(Ed);const a=s/((this.scale.x+this.scale.y+this.scale.z)/3),l=a*a,c=n.index,d=n.attributes.position;if(c!==null){const h=Math.max(0,o.start),p=Math.min(c.count,o.start+o.count);for(let g=h,b=p;g<b;g++){const m=c.getX(g);Vo.fromBufferAttribute(d,m),Ad(Vo,m,l,r,e,t,this)}}else{const h=Math.max(0,o.start),p=Math.min(d.count,o.start+o.count);for(let g=h,b=p;g<b;g++)Vo.fromBufferAttribute(d,g),Ad(Vo,g,l,r,e,t,this)}}updateMorphTargets(){const t=this.geometry.morphAttributes,n=Object.keys(t);if(n.length>0){const r=t[n[0]];if(r!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let s=0,o=r.length;s<o;s++){const a=r[s].name||String(s);this.morphTargetInfluences.push(0),this.morphTargetDictionary[a]=s}}}}}function Ad(i,e,t,n,r,s,o){const a=El.distanceSqToPoint(i);if(a<t){const l=new A;El.closestPointToPoint(i,l),l.applyMatrix4(n);const c=r.ray.origin.distanceTo(l);if(c<r.near||c>r.far)return;s.push({distance:c,distanceToRay:Math.sqrt(a),point:l,index:e,face:null,faceIndex:null,barycoord:null,object:o})}}class tx extends un{constructor(e,t,n,r,s,o,a,l,c){super(e,t,n,r,s,o,a,l,c),this.isCanvasTexture=!0,this.needsUpdate=!0}}class nx extends hi{static get type(){return"ShadowMaterial"}constructor(e){super(),this.isShadowMaterial=!0,this.color=new rt(0),this.transparent=!0,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.fog=e.fog,this}}class Ss extends hi{static get type(){return"MeshStandardMaterial"}constructor(e){super(),this.isMeshStandardMaterial=!0,this.defines={STANDARD:""},this.color=new rt(16777215),this.roughness=1,this.metalness=0,this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.emissive=new rt(0),this.emissiveIntensity=1,this.emissiveMap=null,this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=yh,this.normalScale=new ut(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.roughnessMap=null,this.metalnessMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new Mi,this.envMapIntensity=1,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.flatShading=!1,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.defines={STANDARD:""},this.color.copy(e.color),this.roughness=e.roughness,this.metalness=e.metalness,this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.emissive.copy(e.emissive),this.emissiveMap=e.emissiveMap,this.emissiveIntensity=e.emissiveIntensity,this.bumpMap=e.bumpMap,this.bumpScale=e.bumpScale,this.normalMap=e.normalMap,this.normalMapType=e.normalMapType,this.normalScale.copy(e.normalScale),this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.roughnessMap=e.roughnessMap,this.metalnessMap=e.metalnessMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.envMapRotation.copy(e.envMapRotation),this.envMapIntensity=e.envMapIntensity,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.flatShading=e.flatShading,this.fog=e.fog,this}}class Ai extends Ss{static get type(){return"MeshPhysicalMaterial"}constructor(e){super(),this.isMeshPhysicalMaterial=!0,this.defines={STANDARD:"",PHYSICAL:""},this.anisotropyRotation=0,this.anisotropyMap=null,this.clearcoatMap=null,this.clearcoatRoughness=0,this.clearcoatRoughnessMap=null,this.clearcoatNormalScale=new ut(1,1),this.clearcoatNormalMap=null,this.ior=1.5,Object.defineProperty(this,"reflectivity",{get:function(){return xn(2.5*(this.ior-1)/(this.ior+1),0,1)},set:function(t){this.ior=(1+.4*t)/(1-.4*t)}}),this.iridescenceMap=null,this.iridescenceIOR=1.3,this.iridescenceThicknessRange=[100,400],this.iridescenceThicknessMap=null,this.sheenColor=new rt(0),this.sheenColorMap=null,this.sheenRoughness=1,this.sheenRoughnessMap=null,this.transmissionMap=null,this.thickness=0,this.thicknessMap=null,this.attenuationDistance=1/0,this.attenuationColor=new rt(1,1,1),this.specularIntensity=1,this.specularIntensityMap=null,this.specularColor=new rt(1,1,1),this.specularColorMap=null,this._anisotropy=0,this._clearcoat=0,this._dispersion=0,this._iridescence=0,this._sheen=0,this._transmission=0,this.setValues(e)}get anisotropy(){return this._anisotropy}set anisotropy(e){this._anisotropy>0!=e>0&&this.version++,this._anisotropy=e}get clearcoat(){return this._clearcoat}set clearcoat(e){this._clearcoat>0!=e>0&&this.version++,this._clearcoat=e}get iridescence(){return this._iridescence}set iridescence(e){this._iridescence>0!=e>0&&this.version++,this._iridescence=e}get dispersion(){return this._dispersion}set dispersion(e){this._dispersion>0!=e>0&&this.version++,this._dispersion=e}get sheen(){return this._sheen}set sheen(e){this._sheen>0!=e>0&&this.version++,this._sheen=e}get transmission(){return this._transmission}set transmission(e){this._transmission>0!=e>0&&this.version++,this._transmission=e}copy(e){return super.copy(e),this.defines={STANDARD:"",PHYSICAL:""},this.anisotropy=e.anisotropy,this.anisotropyRotation=e.anisotropyRotation,this.anisotropyMap=e.anisotropyMap,this.clearcoat=e.clearcoat,this.clearcoatMap=e.clearcoatMap,this.clearcoatRoughness=e.clearcoatRoughness,this.clearcoatRoughnessMap=e.clearcoatRoughnessMap,this.clearcoatNormalMap=e.clearcoatNormalMap,this.clearcoatNormalScale.copy(e.clearcoatNormalScale),this.dispersion=e.dispersion,this.ior=e.ior,this.iridescence=e.iridescence,this.iridescenceMap=e.iridescenceMap,this.iridescenceIOR=e.iridescenceIOR,this.iridescenceThicknessRange=[...e.iridescenceThicknessRange],this.iridescenceThicknessMap=e.iridescenceThicknessMap,this.sheen=e.sheen,this.sheenColor.copy(e.sheenColor),this.sheenColorMap=e.sheenColorMap,this.sheenRoughness=e.sheenRoughness,this.sheenRoughnessMap=e.sheenRoughnessMap,this.transmission=e.transmission,this.transmissionMap=e.transmissionMap,this.thickness=e.thickness,this.thicknessMap=e.thicknessMap,this.attenuationDistance=e.attenuationDistance,this.attenuationColor.copy(e.attenuationColor),this.specularIntensity=e.specularIntensity,this.specularIntensityMap=e.specularIntensityMap,this.specularColor.copy(e.specularColor),this.specularColorMap=e.specularColorMap,this}}function Wo(i,e,t){return!i||!t&&i.constructor===e?i:typeof e.BYTES_PER_ELEMENT=="number"?new e(i):Array.prototype.slice.call(i)}function ix(i){return ArrayBuffer.isView(i)&&!(i instanceof DataView)}function rx(i){function e(r,s){return i[r]-i[s]}const t=i.length,n=new Array(t);for(let r=0;r!==t;++r)n[r]=r;return n.sort(e),n}function Td(i,e,t){const n=i.length,r=new i.constructor(n);for(let s=0,o=0;o!==n;++s){const a=t[s]*e;for(let l=0;l!==e;++l)r[o++]=i[a+l]}return r}function Hh(i,e,t,n){let r=1,s=i[0];for(;s!==void 0&&s[n]===void 0;)s=i[r++];if(s===void 0)return;let o=s[n];if(o!==void 0)if(Array.isArray(o))do o=s[n],o!==void 0&&(e.push(s.time),t.push.apply(t,o)),s=i[r++];while(s!==void 0);else if(o.toArray!==void 0)do o=s[n],o!==void 0&&(e.push(s.time),o.toArray(t,t.length)),s=i[r++];while(s!==void 0);else do o=s[n],o!==void 0&&(e.push(s.time),t.push(o)),s=i[r++];while(s!==void 0)}class ho{constructor(e,t,n,r){this.parameterPositions=e,this._cachedIndex=0,this.resultBuffer=r!==void 0?r:new t.constructor(n),this.sampleValues=t,this.valueSize=n,this.settings=null,this.DefaultSettings_={}}evaluate(e){const t=this.parameterPositions;let n=this._cachedIndex,r=t[n],s=t[n-1];n:{e:{let o;t:{i:if(!(e<r)){for(let a=n+2;;){if(r===void 0){if(e<s)break i;return n=t.length,this._cachedIndex=n,this.copySampleValue_(n-1)}if(n===a)break;if(s=r,r=t[++n],e<r)break e}o=t.length;break t}if(!(e>=s)){const a=t[1];e<a&&(n=2,s=a);for(let l=n-2;;){if(s===void 0)return this._cachedIndex=0,this.copySampleValue_(0);if(n===l)break;if(r=s,s=t[--n-1],e>=s)break e}o=n,n=0;break t}break n}for(;n<o;){const a=n+o>>>1;e<t[a]?o=a:n=a+1}if(r=t[n],s=t[n-1],s===void 0)return this._cachedIndex=0,this.copySampleValue_(0);if(r===void 0)return n=t.length,this._cachedIndex=n,this.copySampleValue_(n-1)}this._cachedIndex=n,this.intervalChanged_(n,s,r)}return this.interpolate_(n,s,e,r)}getSettings_(){return this.settings||this.DefaultSettings_}copySampleValue_(e){const t=this.resultBuffer,n=this.sampleValues,r=this.valueSize,s=e*r;for(let o=0;o!==r;++o)t[o]=n[s+o];return t}interpolate_(){throw new Error("call to abstract method")}intervalChanged_(){}}class sx extends ho{constructor(e,t,n,r){super(e,t,n,r),this._weightPrev=-0,this._offsetPrev=-0,this._weightNext=-0,this._offsetNext=-0,this.DefaultSettings_={endingStart:bu,endingEnd:bu}}intervalChanged_(e,t,n){const r=this.parameterPositions;let s=e-2,o=e+1,a=r[s],l=r[o];if(a===void 0)switch(this.getSettings_().endingStart){case _u:s=e,a=2*t-n;break;case xu:s=r.length-2,a=t+r[s]-r[s+1];break;default:s=e,a=n}if(l===void 0)switch(this.getSettings_().endingEnd){case _u:o=e,l=2*n-t;break;case xu:o=1,l=n+r[1]-r[0];break;default:o=e-1,l=t}const c=(n-t)*.5,u=this.valueSize;this._weightPrev=c/(t-a),this._weightNext=c/(l-n),this._offsetPrev=s*u,this._offsetNext=o*u}interpolate_(e,t,n,r){const s=this.resultBuffer,o=this.sampleValues,a=this.valueSize,l=e*a,c=l-a,u=this._offsetPrev,d=this._offsetNext,h=this._weightPrev,p=this._weightNext,g=(n-t)/(r-t),b=g*g,m=b*g,f=-h*m+2*h*b-h*g,M=(1+h)*m+(-1.5-2*h)*b+(-.5+h)*g+1,x=(-1-p)*m+(1.5+p)*b+.5*g,_=p*m-p*b;for(let D=0;D!==a;++D)s[D]=f*o[u+D]+M*o[c+D]+x*o[l+D]+_*o[d+D];return s}}class ox extends ho{constructor(e,t,n,r){super(e,t,n,r)}interpolate_(e,t,n,r){const s=this.resultBuffer,o=this.sampleValues,a=this.valueSize,l=e*a,c=l-a,u=(n-t)/(r-t),d=1-u;for(let h=0;h!==a;++h)s[h]=o[c+h]*d+o[l+h]*u;return s}}class ax extends ho{constructor(e,t,n,r){super(e,t,n,r)}interpolate_(e){return this.copySampleValue_(e-1)}}class Ti{constructor(e,t,n,r){if(e===void 0)throw new Error("THREE.KeyframeTrack: track name is undefined");if(t===void 0||t.length===0)throw new Error("THREE.KeyframeTrack: no keyframes in track named "+e);this.name=e,this.times=Wo(t,this.TimeBufferType),this.values=Wo(n,this.ValueBufferType),this.setInterpolation(r||this.DefaultInterpolation)}static toJSON(e){const t=e.constructor;let n;if(t.toJSON!==this.toJSON)n=t.toJSON(e);else{n={name:e.name,times:Wo(e.times,Array),values:Wo(e.values,Array)};const r=e.getInterpolation();r!==e.DefaultInterpolation&&(n.interpolation=r)}return n.type=e.ValueTypeName,n}InterpolantFactoryMethodDiscrete(e){return new ax(this.times,this.values,this.getValueSize(),e)}InterpolantFactoryMethodLinear(e){return new ox(this.times,this.values,this.getValueSize(),e)}InterpolantFactoryMethodSmooth(e){return new sx(this.times,this.values,this.getValueSize(),e)}setInterpolation(e){let t;switch(e){case so:t=this.InterpolantFactoryMethodDiscrete;break;case oo:t=this.InterpolantFactoryMethodLinear;break;case Ha:t=this.InterpolantFactoryMethodSmooth;break}if(t===void 0){const n="unsupported interpolation for "+this.ValueTypeName+" keyframe track named "+this.name;if(this.createInterpolant===void 0)if(e!==this.DefaultInterpolation)this.setInterpolation(this.DefaultInterpolation);else throw new Error(n);return console.warn("THREE.KeyframeTrack:",n),this}return this.createInterpolant=t,this}getInterpolation(){switch(this.createInterpolant){case this.InterpolantFactoryMethodDiscrete:return so;case this.InterpolantFactoryMethodLinear:return oo;case this.InterpolantFactoryMethodSmooth:return Ha}}getValueSize(){return this.values.length/this.times.length}shift(e){if(e!==0){const t=this.times;for(let n=0,r=t.length;n!==r;++n)t[n]+=e}return this}scale(e){if(e!==1){const t=this.times;for(let n=0,r=t.length;n!==r;++n)t[n]*=e}return this}trim(e,t){const n=this.times,r=n.length;let s=0,o=r-1;for(;s!==r&&n[s]<e;)++s;for(;o!==-1&&n[o]>t;)--o;if(++o,s!==0||o!==r){s>=o&&(o=Math.max(o,1),s=o-1);const a=this.getValueSize();this.times=n.slice(s,o),this.values=this.values.slice(s*a,o*a)}return this}validate(){let e=!0;const t=this.getValueSize();t-Math.floor(t)!==0&&(console.error("THREE.KeyframeTrack: Invalid value size in track.",this),e=!1);const n=this.times,r=this.values,s=n.length;s===0&&(console.error("THREE.KeyframeTrack: Track is empty.",this),e=!1);let o=null;for(let a=0;a!==s;a++){const l=n[a];if(typeof l=="number"&&isNaN(l)){console.error("THREE.KeyframeTrack: Time is not a valid number.",this,a,l),e=!1;break}if(o!==null&&o>l){console.error("THREE.KeyframeTrack: Out of order keys.",this,a,l,o),e=!1;break}o=l}if(r!==void 0&&ix(r))for(let a=0,l=r.length;a!==l;++a){const c=r[a];if(isNaN(c)){console.error("THREE.KeyframeTrack: Value is not a valid number.",this,a,c),e=!1;break}}return e}optimize(){const e=this.times.slice(),t=this.values.slice(),n=this.getValueSize(),r=this.getInterpolation()===Ha,s=e.length-1;let o=1;for(let a=1;a<s;++a){let l=!1;const c=e[a],u=e[a+1];if(c!==u&&(a!==1||c!==e[0]))if(r)l=!0;else{const d=a*n,h=d-n,p=d+n;for(let g=0;g!==n;++g){const b=t[d+g];if(b!==t[h+g]||b!==t[p+g]){l=!0;break}}}if(l){if(a!==o){e[o]=e[a];const d=a*n,h=o*n;for(let p=0;p!==n;++p)t[h+p]=t[d+p]}++o}}if(s>0){e[o]=e[s];for(let a=s*n,l=o*n,c=0;c!==n;++c)t[l+c]=t[a+c];++o}return o!==e.length?(this.times=e.slice(0,o),this.values=t.slice(0,o*n)):(this.times=e,this.values=t),this}clone(){const e=this.times.slice(),t=this.values.slice(),n=this.constructor,r=new n(this.name,e,t);return r.createInterpolant=this.createInterpolant,r}}Ti.prototype.TimeBufferType=Float32Array;Ti.prototype.ValueBufferType=Float32Array;Ti.prototype.DefaultInterpolation=oo;class Ds extends Ti{constructor(e,t,n){super(e,t,n)}}Ds.prototype.ValueTypeName="bool";Ds.prototype.ValueBufferType=Array;Ds.prototype.DefaultInterpolation=so;Ds.prototype.InterpolantFactoryMethodLinear=void 0;Ds.prototype.InterpolantFactoryMethodSmooth=void 0;class Gh extends Ti{}Gh.prototype.ValueTypeName="color";class ws extends Ti{}ws.prototype.ValueTypeName="number";class cx extends ho{constructor(e,t,n,r){super(e,t,n,r)}interpolate_(e,t,n,r){const s=this.resultBuffer,o=this.sampleValues,a=this.valueSize,l=(n-t)/(r-t);let c=e*a;for(let u=c+a;c!==u;c+=4)qe.slerpFlat(s,0,o,c-a,o,c,l);return s}}class Es extends Ti{InterpolantFactoryMethodLinear(e){return new cx(this.times,this.values,this.getValueSize(),e)}}Es.prototype.ValueTypeName="quaternion";Es.prototype.InterpolantFactoryMethodSmooth=void 0;class Is extends Ti{constructor(e,t,n){super(e,t,n)}}Is.prototype.ValueTypeName="string";Is.prototype.ValueBufferType=Array;Is.prototype.DefaultInterpolation=so;Is.prototype.InterpolantFactoryMethodLinear=void 0;Is.prototype.InterpolantFactoryMethodSmooth=void 0;class As extends Ti{}As.prototype.ValueTypeName="vector";class lx{constructor(e="",t=-1,n=[],r=sp){this.name=e,this.tracks=n,this.duration=t,this.blendMode=r,this.uuid=di(),this.duration<0&&this.resetDuration()}static parse(e){const t=[],n=e.tracks,r=1/(e.fps||1);for(let o=0,a=n.length;o!==a;++o)t.push(dx(n[o]).scale(r));const s=new this(e.name,e.duration,t,e.blendMode);return s.uuid=e.uuid,s}static toJSON(e){const t=[],n=e.tracks,r={name:e.name,duration:e.duration,tracks:t,uuid:e.uuid,blendMode:e.blendMode};for(let s=0,o=n.length;s!==o;++s)t.push(Ti.toJSON(n[s]));return r}static CreateFromMorphTargetSequence(e,t,n,r){const s=t.length,o=[];for(let a=0;a<s;a++){let l=[],c=[];l.push((a+s-1)%s,a,(a+1)%s),c.push(0,1,0);const u=rx(l);l=Td(l,1,u),c=Td(c,1,u),!r&&l[0]===0&&(l.push(s),c.push(c[0])),o.push(new ws(".morphTargetInfluences["+t[a].name+"]",l,c).scale(1/n))}return new this(e,-1,o)}static findByName(e,t){let n=e;if(!Array.isArray(e)){const r=e;n=r.geometry&&r.geometry.animations||r.animations}for(let r=0;r<n.length;r++)if(n[r].name===t)return n[r];return null}static CreateClipsFromMorphTargetSequences(e,t,n){const r={},s=/^([\w-]*?)([\d]+)$/;for(let a=0,l=e.length;a<l;a++){const c=e[a],u=c.name.match(s);if(u&&u.length>1){const d=u[1];let h=r[d];h||(r[d]=h=[]),h.push(c)}}const o=[];for(const a in r)o.push(this.CreateFromMorphTargetSequence(a,r[a],t,n));return o}static parseAnimation(e,t){if(!e)return console.error("THREE.AnimationClip: No animation in JSONLoader data."),null;const n=function(d,h,p,g,b){if(p.length!==0){const m=[],f=[];Hh(p,m,f,g),m.length!==0&&b.push(new d(h,m,f))}},r=[],s=e.name||"default",o=e.fps||30,a=e.blendMode;let l=e.length||-1;const c=e.hierarchy||[];for(let d=0;d<c.length;d++){const h=c[d].keys;if(!(!h||h.length===0))if(h[0].morphTargets){const p={};let g;for(g=0;g<h.length;g++)if(h[g].morphTargets)for(let b=0;b<h[g].morphTargets.length;b++)p[h[g].morphTargets[b]]=-1;for(const b in p){const m=[],f=[];for(let M=0;M!==h[g].morphTargets.length;++M){const x=h[g];m.push(x.time),f.push(x.morphTarget===b?1:0)}r.push(new ws(".morphTargetInfluence["+b+"]",m,f))}l=p.length*o}else{const p=".bones["+t[d].name+"]";n(As,p+".position",h,"pos",r),n(Es,p+".quaternion",h,"rot",r),n(As,p+".scale",h,"scl",r)}}return r.length===0?null:new this(s,l,r,a)}resetDuration(){const e=this.tracks;let t=0;for(let n=0,r=e.length;n!==r;++n){const s=this.tracks[n];t=Math.max(t,s.times[s.times.length-1])}return this.duration=t,this}trim(){for(let e=0;e<this.tracks.length;e++)this.tracks[e].trim(0,this.duration);return this}validate(){let e=!0;for(let t=0;t<this.tracks.length;t++)e=e&&this.tracks[t].validate();return e}optimize(){for(let e=0;e<this.tracks.length;e++)this.tracks[e].optimize();return this}clone(){const e=[];for(let t=0;t<this.tracks.length;t++)e.push(this.tracks[t].clone());return new this.constructor(this.name,this.duration,e,this.blendMode)}toJSON(){return this.constructor.toJSON(this)}}function ux(i){switch(i.toLowerCase()){case"scalar":case"double":case"float":case"number":case"integer":return ws;case"vector":case"vector2":case"vector3":case"vector4":return As;case"color":return Gh;case"quaternion":return Es;case"bool":case"boolean":return Ds;case"string":return Is}throw new Error("THREE.KeyframeTrack: Unsupported typeName: "+i)}function dx(i){if(i.type===void 0)throw new Error("THREE.KeyframeTrack: track type undefined, can not parse");const e=ux(i.type);if(i.times===void 0){const t=[],n=[];Hh(i.keys,t,n,"value"),i.times=t,i.values=n}return e.parse!==void 0?e.parse(i):new e(i.name,i.times,i.values,i.interpolation)}const lr={enabled:!1,files:{},add:function(i,e){this.enabled!==!1&&(this.files[i]=e)},get:function(i){if(this.enabled!==!1)return this.files[i]},remove:function(i){delete this.files[i]},clear:function(){this.files={}}};class hx{constructor(e,t,n){const r=this;let s=!1,o=0,a=0,l;const c=[];this.onStart=void 0,this.onLoad=e,this.onProgress=t,this.onError=n,this.itemStart=function(u){a++,s===!1&&r.onStart!==void 0&&r.onStart(u,o,a),s=!0},this.itemEnd=function(u){o++,r.onProgress!==void 0&&r.onProgress(u,o,a),o===a&&(s=!1,r.onLoad!==void 0&&r.onLoad())},this.itemError=function(u){r.onError!==void 0&&r.onError(u)},this.resolveURL=function(u){return l?l(u):u},this.setURLModifier=function(u){return l=u,this},this.addHandler=function(u,d){return c.push(u,d),this},this.removeHandler=function(u){const d=c.indexOf(u);return d!==-1&&c.splice(d,2),this},this.getHandler=function(u){for(let d=0,h=c.length;d<h;d+=2){const p=c[d],g=c[d+1];if(p.global&&(p.lastIndex=0),p.test(u))return g}return null}}}const fx=new hx;class Fs{constructor(e){this.manager=e!==void 0?e:fx,this.crossOrigin="anonymous",this.withCredentials=!1,this.path="",this.resourcePath="",this.requestHeader={}}load(){}loadAsync(e,t){const n=this;return new Promise(function(r,s){n.load(e,r,t,s)})}parse(){}setCrossOrigin(e){return this.crossOrigin=e,this}setWithCredentials(e){return this.withCredentials=e,this}setPath(e){return this.path=e,this}setResourcePath(e){return this.resourcePath=e,this}setRequestHeader(e){return this.requestHeader=e,this}}Fs.DEFAULT_MATERIAL_NAME="__DEFAULT";const Ni={};class px extends Error{constructor(e,t){super(e),this.response=t}}class Vh extends Fs{constructor(e){super(e)}load(e,t,n,r){e===void 0&&(e=""),this.path!==void 0&&(e=this.path+e),e=this.manager.resolveURL(e);const s=lr.get(e);if(s!==void 0)return this.manager.itemStart(e),setTimeout(()=>{t&&t(s),this.manager.itemEnd(e)},0),s;if(Ni[e]!==void 0){Ni[e].push({onLoad:t,onProgress:n,onError:r});return}Ni[e]=[],Ni[e].push({onLoad:t,onProgress:n,onError:r});const o=new Request(e,{headers:new Headers(this.requestHeader),credentials:this.withCredentials?"include":"same-origin"}),a=this.mimeType,l=this.responseType;fetch(o).then(c=>{if(c.status===200||c.status===0){if(c.status===0&&console.warn("THREE.FileLoader: HTTP Status 0 received."),typeof ReadableStream>"u"||c.body===void 0||c.body.getReader===void 0)return c;const u=Ni[e],d=c.body.getReader(),h=c.headers.get("X-File-Size")||c.headers.get("Content-Length"),p=h?parseInt(h):0,g=p!==0;let b=0;const m=new ReadableStream({start(f){M();function M(){d.read().then(({done:x,value:_})=>{if(x)f.close();else{b+=_.byteLength;const D=new ProgressEvent("progress",{lengthComputable:g,loaded:b,total:p});for(let P=0,T=u.length;P<T;P++){const N=u[P];N.onProgress&&N.onProgress(D)}f.enqueue(_),M()}},x=>{f.error(x)})}}});return new Response(m)}else throw new px(`fetch for "${c.url}" responded with ${c.status}: ${c.statusText}`,c)}).then(c=>{switch(l){case"arraybuffer":return c.arrayBuffer();case"blob":return c.blob();case"document":return c.text().then(u=>new DOMParser().parseFromString(u,a));case"json":return c.json();default:if(a===void 0)return c.text();{const d=/charset="?([^;"\s]*)"?/i.exec(a),h=d&&d[1]?d[1].toLowerCase():void 0,p=new TextDecoder(h);return c.arrayBuffer().then(g=>p.decode(g))}}}).then(c=>{lr.add(e,c);const u=Ni[e];delete Ni[e];for(let d=0,h=u.length;d<h;d++){const p=u[d];p.onLoad&&p.onLoad(c)}}).catch(c=>{const u=Ni[e];if(u===void 0)throw this.manager.itemError(e),c;delete Ni[e];for(let d=0,h=u.length;d<h;d++){const p=u[d];p.onError&&p.onError(c)}this.manager.itemError(e)}).finally(()=>{this.manager.itemEnd(e)}),this.manager.itemStart(e)}setResponseType(e){return this.responseType=e,this}setMimeType(e){return this.mimeType=e,this}}class mx extends Fs{constructor(e){super(e)}load(e,t,n,r){this.path!==void 0&&(e=this.path+e),e=this.manager.resolveURL(e);const s=this,o=lr.get(e);if(o!==void 0)return s.manager.itemStart(e),setTimeout(function(){t&&t(o),s.manager.itemEnd(e)},0),o;const a=ao("img");function l(){u(),lr.add(e,this),t&&t(this),s.manager.itemEnd(e)}function c(d){u(),r&&r(d),s.manager.itemError(e),s.manager.itemEnd(e)}function u(){a.removeEventListener("load",l,!1),a.removeEventListener("error",c,!1)}return a.addEventListener("load",l,!1),a.addEventListener("error",c,!1),e.slice(0,5)!=="data:"&&this.crossOrigin!==void 0&&(a.crossOrigin=this.crossOrigin),s.manager.itemStart(e),a.src=e,a}}class gx extends Fs{constructor(e){super(e)}load(e,t,n,r){const s=new un,o=new mx(this.manager);return o.setCrossOrigin(this.crossOrigin),o.setPath(this.path),o.load(e,function(a){s.image=a,s.needsUpdate=!0,t!==void 0&&t(s)},n,r),s}}class La extends en{constructor(e,t=1){super(),this.isLight=!0,this.type="Light",this.color=new rt(e),this.intensity=t}dispose(){}copy(e,t){return super.copy(e,t),this.color.copy(e.color),this.intensity=e.intensity,this}toJSON(e){const t=super.toJSON(e);return t.object.color=this.color.getHex(),t.object.intensity=this.intensity,this.groundColor!==void 0&&(t.object.groundColor=this.groundColor.getHex()),this.distance!==void 0&&(t.object.distance=this.distance),this.angle!==void 0&&(t.object.angle=this.angle),this.decay!==void 0&&(t.object.decay=this.decay),this.penumbra!==void 0&&(t.object.penumbra=this.penumbra),this.shadow!==void 0&&(t.object.shadow=this.shadow.toJSON()),this.target!==void 0&&(t.object.target=this.target.uuid),t}}class Wh extends La{constructor(e,t,n){super(e,n),this.isHemisphereLight=!0,this.type="HemisphereLight",this.position.copy(en.DEFAULT_UP),this.updateMatrix(),this.groundColor=new rt(t)}copy(e,t){return super.copy(e,t),this.groundColor.copy(e.groundColor),this}}const _c=new ot,Rd=new A,Cd=new A;class eu{constructor(e){this.camera=e,this.intensity=1,this.bias=0,this.normalBias=0,this.radius=1,this.blurSamples=8,this.mapSize=new ut(512,512),this.map=null,this.mapPass=null,this.matrix=new ot,this.autoUpdate=!0,this.needsUpdate=!1,this._frustum=new Xl,this._frameExtents=new ut(1,1),this._viewportCount=1,this._viewports=[new mt(0,0,1,1)]}getViewportCount(){return this._viewportCount}getFrustum(){return this._frustum}updateMatrices(e){const t=this.camera,n=this.matrix;Rd.setFromMatrixPosition(e.matrixWorld),t.position.copy(Rd),Cd.setFromMatrixPosition(e.target.matrixWorld),t.lookAt(Cd),t.updateMatrixWorld(),_c.multiplyMatrices(t.projectionMatrix,t.matrixWorldInverse),this._frustum.setFromProjectionMatrix(_c),n.set(.5,0,0,.5,0,.5,0,.5,0,0,.5,.5,0,0,0,1),n.multiply(_c)}getViewport(e){return this._viewports[e]}getFrameExtents(){return this._frameExtents}dispose(){this.map&&this.map.dispose(),this.mapPass&&this.mapPass.dispose()}copy(e){return this.camera=e.camera.clone(),this.intensity=e.intensity,this.bias=e.bias,this.radius=e.radius,this.mapSize.copy(e.mapSize),this}clone(){return new this.constructor().copy(this)}toJSON(){const e={};return this.intensity!==1&&(e.intensity=this.intensity),this.bias!==0&&(e.bias=this.bias),this.normalBias!==0&&(e.normalBias=this.normalBias),this.radius!==1&&(e.radius=this.radius),(this.mapSize.x!==512||this.mapSize.y!==512)&&(e.mapSize=this.mapSize.toArray()),e.camera=this.camera.toJSON(!1).object,delete e.camera.matrix,e}}class bx extends eu{constructor(){super(new vn(50,1,.5,500)),this.isSpotLightShadow=!0,this.focus=1}updateMatrices(e){const t=this.camera,n=ys*2*e.angle*this.focus,r=this.mapSize.width/this.mapSize.height,s=e.distance||t.far;(n!==t.fov||r!==t.aspect||s!==t.far)&&(t.fov=n,t.aspect=r,t.far=s,t.updateProjectionMatrix()),super.updateMatrices(e)}copy(e){return super.copy(e),this.focus=e.focus,this}}class _x extends La{constructor(e,t,n=0,r=Math.PI/3,s=0,o=2){super(e,t),this.isSpotLight=!0,this.type="SpotLight",this.position.copy(en.DEFAULT_UP),this.updateMatrix(),this.target=new en,this.distance=n,this.angle=r,this.penumbra=s,this.decay=o,this.map=null,this.shadow=new bx}get power(){return this.intensity*Math.PI}set power(e){this.intensity=e/Math.PI}dispose(){this.shadow.dispose()}copy(e,t){return super.copy(e,t),this.distance=e.distance,this.angle=e.angle,this.penumbra=e.penumbra,this.decay=e.decay,this.target=e.target.clone(),this.shadow=e.shadow.clone(),this}}const Pd=new ot,qs=new A,xc=new A;class xx extends eu{constructor(){super(new vn(90,1,.5,500)),this.isPointLightShadow=!0,this._frameExtents=new ut(4,2),this._viewportCount=6,this._viewports=[new mt(2,1,1,1),new mt(0,1,1,1),new mt(3,1,1,1),new mt(1,1,1,1),new mt(3,0,1,1),new mt(1,0,1,1)],this._cubeDirections=[new A(1,0,0),new A(-1,0,0),new A(0,0,1),new A(0,0,-1),new A(0,1,0),new A(0,-1,0)],this._cubeUps=[new A(0,1,0),new A(0,1,0),new A(0,1,0),new A(0,1,0),new A(0,0,1),new A(0,0,-1)]}updateMatrices(e,t=0){const n=this.camera,r=this.matrix,s=e.distance||n.far;s!==n.far&&(n.far=s,n.updateProjectionMatrix()),qs.setFromMatrixPosition(e.matrixWorld),n.position.copy(qs),xc.copy(n.position),xc.add(this._cubeDirections[t]),n.up.copy(this._cubeUps[t]),n.lookAt(xc),n.updateMatrixWorld(),r.makeTranslation(-qs.x,-qs.y,-qs.z),Pd.multiplyMatrices(n.projectionMatrix,n.matrixWorldInverse),this._frustum.setFromProjectionMatrix(Pd)}}class qh extends La{constructor(e,t,n=0,r=2){super(e,t),this.isPointLight=!0,this.type="PointLight",this.distance=n,this.decay=r,this.shadow=new xx}get power(){return this.intensity*4*Math.PI}set power(e){this.intensity=e/(4*Math.PI)}dispose(){this.shadow.dispose()}copy(e,t){return super.copy(e,t),this.distance=e.distance,this.decay=e.decay,this.shadow=e.shadow.clone(),this}}class vx extends eu{constructor(){super(new Ql(-5,5,5,-5,.5,500)),this.isDirectionalLightShadow=!0}}class us extends La{constructor(e,t){super(e,t),this.isDirectionalLight=!0,this.type="DirectionalLight",this.position.copy(en.DEFAULT_UP),this.updateMatrix(),this.target=new en,this.shadow=new vx}dispose(){this.shadow.dispose()}copy(e){return super.copy(e),this.target=e.target.clone(),this.shadow=e.shadow.clone(),this}}class eo{static decodeText(e){if(console.warn("THREE.LoaderUtils: decodeText() has been deprecated with r165 and will be removed with r175. Use TextDecoder instead."),typeof TextDecoder<"u")return new TextDecoder().decode(e);let t="";for(let n=0,r=e.length;n<r;n++)t+=String.fromCharCode(e[n]);try{return decodeURIComponent(escape(t))}catch{return t}}static extractUrlBase(e){const t=e.lastIndexOf("/");return t===-1?"./":e.slice(0,t+1)}static resolveURL(e,t){return typeof e!="string"||e===""?"":(/^https?:\/\//i.test(t)&&/^\//.test(e)&&(t=t.replace(/(^https?:\/\/[^\/]+).*/i,"$1")),/^(https?:)?\/\//i.test(e)||/^data:.*,.*$/i.test(e)||/^blob:.*$/i.test(e)?e:t+e)}}class yx extends Fs{constructor(e){super(e),this.isImageBitmapLoader=!0,typeof createImageBitmap>"u"&&console.warn("THREE.ImageBitmapLoader: createImageBitmap() not supported."),typeof fetch>"u"&&console.warn("THREE.ImageBitmapLoader: fetch() not supported."),this.options={premultiplyAlpha:"none"}}setOptions(e){return this.options=e,this}load(e,t,n,r){e===void 0&&(e=""),this.path!==void 0&&(e=this.path+e),e=this.manager.resolveURL(e);const s=this,o=lr.get(e);if(o!==void 0){if(s.manager.itemStart(e),o.then){o.then(c=>{t&&t(c),s.manager.itemEnd(e)}).catch(c=>{r&&r(c)});return}return setTimeout(function(){t&&t(o),s.manager.itemEnd(e)},0),o}const a={};a.credentials=this.crossOrigin==="anonymous"?"same-origin":"include",a.headers=this.requestHeader;const l=fetch(e,a).then(function(c){return c.blob()}).then(function(c){return createImageBitmap(c,Object.assign(s.options,{colorSpaceConversion:"none"}))}).then(function(c){return lr.add(e,c),t&&t(c),s.manager.itemEnd(e),c}).catch(function(c){r&&r(c),lr.remove(e),s.manager.itemError(e),s.manager.itemEnd(e)});lr.add(e,l),s.manager.itemStart(e)}}const tu="\\[\\]\\.:\\/",Mx=new RegExp("["+tu+"]","g"),nu="[^"+tu+"]",Sx="[^"+tu.replace("\\.","")+"]",wx=/((?:WC+[\/:])*)/.source.replace("WC",nu),Ex=/(WCOD+)?/.source.replace("WCOD",Sx),Ax=/(?:\.(WC+)(?:\[(.+)\])?)?/.source.replace("WC",nu),Tx=/\.(WC+)(?:\[(.+)\])?/.source.replace("WC",nu),Rx=new RegExp("^"+wx+Ex+Ax+Tx+"$"),Cx=["material","materials","bones","map"];class Px{constructor(e,t,n){const r=n||Gt.parseTrackName(t);this._targetGroup=e,this._bindings=e.subscribe_(t,r)}getValue(e,t){this.bind();const n=this._targetGroup.nCachedObjects_,r=this._bindings[n];r!==void 0&&r.getValue(e,t)}setValue(e,t){const n=this._bindings;for(let r=this._targetGroup.nCachedObjects_,s=n.length;r!==s;++r)n[r].setValue(e,t)}bind(){const e=this._bindings;for(let t=this._targetGroup.nCachedObjects_,n=e.length;t!==n;++t)e[t].bind()}unbind(){const e=this._bindings;for(let t=this._targetGroup.nCachedObjects_,n=e.length;t!==n;++t)e[t].unbind()}}class Gt{constructor(e,t,n){this.path=t,this.parsedPath=n||Gt.parseTrackName(t),this.node=Gt.findNode(e,this.parsedPath.nodeName),this.rootNode=e,this.getValue=this._getValue_unbound,this.setValue=this._setValue_unbound}static create(e,t,n){return e&&e.isAnimationObjectGroup?new Gt.Composite(e,t,n):new Gt(e,t,n)}static sanitizeNodeName(e){return e.replace(/\s/g,"_").replace(Mx,"")}static parseTrackName(e){const t=Rx.exec(e);if(t===null)throw new Error("PropertyBinding: Cannot parse trackName: "+e);const n={nodeName:t[2],objectName:t[3],objectIndex:t[4],propertyName:t[5],propertyIndex:t[6]},r=n.nodeName&&n.nodeName.lastIndexOf(".");if(r!==void 0&&r!==-1){const s=n.nodeName.substring(r+1);Cx.indexOf(s)!==-1&&(n.nodeName=n.nodeName.substring(0,r),n.objectName=s)}if(n.propertyName===null||n.propertyName.length===0)throw new Error("PropertyBinding: can not parse propertyName from trackName: "+e);return n}static findNode(e,t){if(t===void 0||t===""||t==="."||t===-1||t===e.name||t===e.uuid)return e;if(e.skeleton){const n=e.skeleton.getBoneByName(t);if(n!==void 0)return n}if(e.children){const n=function(s){for(let o=0;o<s.length;o++){const a=s[o];if(a.name===t||a.uuid===t)return a;const l=n(a.children);if(l)return l}return null},r=n(e.children);if(r)return r}return null}_getValue_unavailable(){}_setValue_unavailable(){}_getValue_direct(e,t){e[t]=this.targetObject[this.propertyName]}_getValue_array(e,t){const n=this.resolvedProperty;for(let r=0,s=n.length;r!==s;++r)e[t++]=n[r]}_getValue_arrayElement(e,t){e[t]=this.resolvedProperty[this.propertyIndex]}_getValue_toArray(e,t){this.resolvedProperty.toArray(e,t)}_setValue_direct(e,t){this.targetObject[this.propertyName]=e[t]}_setValue_direct_setNeedsUpdate(e,t){this.targetObject[this.propertyName]=e[t],this.targetObject.needsUpdate=!0}_setValue_direct_setMatrixWorldNeedsUpdate(e,t){this.targetObject[this.propertyName]=e[t],this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_array(e,t){const n=this.resolvedProperty;for(let r=0,s=n.length;r!==s;++r)n[r]=e[t++]}_setValue_array_setNeedsUpdate(e,t){const n=this.resolvedProperty;for(let r=0,s=n.length;r!==s;++r)n[r]=e[t++];this.targetObject.needsUpdate=!0}_setValue_array_setMatrixWorldNeedsUpdate(e,t){const n=this.resolvedProperty;for(let r=0,s=n.length;r!==s;++r)n[r]=e[t++];this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_arrayElement(e,t){this.resolvedProperty[this.propertyIndex]=e[t]}_setValue_arrayElement_setNeedsUpdate(e,t){this.resolvedProperty[this.propertyIndex]=e[t],this.targetObject.needsUpdate=!0}_setValue_arrayElement_setMatrixWorldNeedsUpdate(e,t){this.resolvedProperty[this.propertyIndex]=e[t],this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_fromArray(e,t){this.resolvedProperty.fromArray(e,t)}_setValue_fromArray_setNeedsUpdate(e,t){this.resolvedProperty.fromArray(e,t),this.targetObject.needsUpdate=!0}_setValue_fromArray_setMatrixWorldNeedsUpdate(e,t){this.resolvedProperty.fromArray(e,t),this.targetObject.matrixWorldNeedsUpdate=!0}_getValue_unbound(e,t){this.bind(),this.getValue(e,t)}_setValue_unbound(e,t){this.bind(),this.setValue(e,t)}bind(){let e=this.node;const t=this.parsedPath,n=t.objectName,r=t.propertyName;let s=t.propertyIndex;if(e||(e=Gt.findNode(this.rootNode,t.nodeName),this.node=e),this.getValue=this._getValue_unavailable,this.setValue=this._setValue_unavailable,!e){console.warn("THREE.PropertyBinding: No target node found for track: "+this.path+".");return}if(n){let c=t.objectIndex;switch(n){case"materials":if(!e.material){console.error("THREE.PropertyBinding: Can not bind to material as node does not have a material.",this);return}if(!e.material.materials){console.error("THREE.PropertyBinding: Can not bind to material.materials as node.material does not have a materials array.",this);return}e=e.material.materials;break;case"bones":if(!e.skeleton){console.error("THREE.PropertyBinding: Can not bind to bones as node does not have a skeleton.",this);return}e=e.skeleton.bones;for(let u=0;u<e.length;u++)if(e[u].name===c){c=u;break}break;case"map":if("map"in e){e=e.map;break}if(!e.material){console.error("THREE.PropertyBinding: Can not bind to material as node does not have a material.",this);return}if(!e.material.map){console.error("THREE.PropertyBinding: Can not bind to material.map as node.material does not have a map.",this);return}e=e.material.map;break;default:if(e[n]===void 0){console.error("THREE.PropertyBinding: Can not bind to objectName of node undefined.",this);return}e=e[n]}if(c!==void 0){if(e[c]===void 0){console.error("THREE.PropertyBinding: Trying to bind to objectIndex of objectName, but is undefined.",this,e);return}e=e[c]}}const o=e[r];if(o===void 0){const c=t.nodeName;console.error("THREE.PropertyBinding: Trying to update property for track: "+c+"."+r+" but it wasn't found.",e);return}let a=this.Versioning.None;this.targetObject=e,e.needsUpdate!==void 0?a=this.Versioning.NeedsUpdate:e.matrixWorldNeedsUpdate!==void 0&&(a=this.Versioning.MatrixWorldNeedsUpdate);let l=this.BindingType.Direct;if(s!==void 0){if(r==="morphTargetInfluences"){if(!e.geometry){console.error("THREE.PropertyBinding: Can not bind to morphTargetInfluences because node does not have a geometry.",this);return}if(!e.geometry.morphAttributes){console.error("THREE.PropertyBinding: Can not bind to morphTargetInfluences because node does not have a geometry.morphAttributes.",this);return}e.morphTargetDictionary[s]!==void 0&&(s=e.morphTargetDictionary[s])}l=this.BindingType.ArrayElement,this.resolvedProperty=o,this.propertyIndex=s}else o.fromArray!==void 0&&o.toArray!==void 0?(l=this.BindingType.HasFromToArray,this.resolvedProperty=o):Array.isArray(o)?(l=this.BindingType.EntireArray,this.resolvedProperty=o):this.propertyName=r;this.getValue=this.GetterByBindingType[l],this.setValue=this.SetterByBindingTypeAndVersioning[l][a]}unbind(){this.node=null,this.getValue=this._getValue_unbound,this.setValue=this._setValue_unbound}}Gt.Composite=Px;Gt.prototype.BindingType={Direct:0,EntireArray:1,ArrayElement:2,HasFromToArray:3};Gt.prototype.Versioning={None:0,NeedsUpdate:1,MatrixWorldNeedsUpdate:2};Gt.prototype.GetterByBindingType=[Gt.prototype._getValue_direct,Gt.prototype._getValue_array,Gt.prototype._getValue_arrayElement,Gt.prototype._getValue_toArray];Gt.prototype.SetterByBindingTypeAndVersioning=[[Gt.prototype._setValue_direct,Gt.prototype._setValue_direct_setNeedsUpdate,Gt.prototype._setValue_direct_setMatrixWorldNeedsUpdate],[Gt.prototype._setValue_array,Gt.prototype._setValue_array_setNeedsUpdate,Gt.prototype._setValue_array_setMatrixWorldNeedsUpdate],[Gt.prototype._setValue_arrayElement,Gt.prototype._setValue_arrayElement_setNeedsUpdate,Gt.prototype._setValue_arrayElement_setMatrixWorldNeedsUpdate],[Gt.prototype._setValue_fromArray,Gt.prototype._setValue_fromArray_setNeedsUpdate,Gt.prototype._setValue_fromArray_setMatrixWorldNeedsUpdate]];const Ld=new ot;class jh{constructor(e,t,n=0,r=1/0){this.ray=new Rs(e,t),this.near=n,this.far=r,this.camera=null,this.layers=new jl,this.params={Mesh:{},Line:{threshold:1},LOD:{},Points:{threshold:1},Sprite:{}}}set(e,t){this.ray.set(e,t)}setFromCamera(e,t){t.isPerspectiveCamera?(this.ray.origin.setFromMatrixPosition(t.matrixWorld),this.ray.direction.set(e.x,e.y,.5).unproject(t).sub(this.ray.origin).normalize(),this.camera=t):t.isOrthographicCamera?(this.ray.origin.set(e.x,e.y,(t.near+t.far)/(t.near-t.far)).unproject(t),this.ray.direction.set(0,0,-1).transformDirection(t.matrixWorld),this.camera=t):console.error("THREE.Raycaster: Unsupported camera type: "+t.type)}setFromXRController(e){return Ld.identity().extractRotation(e.matrixWorld),this.ray.origin.setFromMatrixPosition(e.matrixWorld),this.ray.direction.set(0,0,-1).applyMatrix4(Ld),this}intersectObject(e,t=!0,n=[]){return Al(e,this,n,t),n.sort(Dd),n}intersectObjects(e,t=!0,n=[]){for(let r=0,s=e.length;r<s;r++)Al(e[r],this,n,t);return n.sort(Dd),n}}function Dd(i,e){return i.distance-e.distance}function Al(i,e,t,n){let r=!0;if(i.layers.test(e.layers)&&i.raycast(e,t)===!1&&(r=!1),r===!0&&n===!0){const s=i.children;for(let o=0,a=s.length;o<a;o++)Al(s[o],e,t,!0)}}class Id{constructor(e=1,t=0,n=0){return this.radius=e,this.phi=t,this.theta=n,this}set(e,t,n){return this.radius=e,this.phi=t,this.theta=n,this}copy(e){return this.radius=e.radius,this.phi=e.phi,this.theta=e.theta,this}makeSafe(){return this.phi=Math.max(1e-6,Math.min(Math.PI-1e-6,this.phi)),this}setFromVector3(e){return this.setFromCartesianCoords(e.x,e.y,e.z)}setFromCartesianCoords(e,t,n){return this.radius=Math.sqrt(e*e+t*t+n*n),this.radius===0?(this.theta=0,this.phi=0):(this.theta=Math.atan2(e,n),this.phi=Math.acos(xn(t/this.radius,-1,1))),this}clone(){return new this.constructor().copy(this)}}class Lx extends Nr{constructor(e,t=null){super(),this.object=e,this.domElement=t,this.enabled=!0,this.state=-1,this.keys={},this.mouseButtons={LEFT:null,MIDDLE:null,RIGHT:null},this.touches={ONE:null,TWO:null}}connect(){}disconnect(){}dispose(){}update(){}}typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("register",{detail:{revision:Ol}}));typeof window<"u"&&(window.__THREE__?console.warn("WARNING: Multiple instances of Three.js being imported."):window.__THREE__=Ol);const Fd={type:"change"},iu={type:"start"},Xh={type:"end"},qo=new Rs,Nd=new sr,Dx=Math.cos(70*vt.DEG2RAD),cn=new A,Nn=2*Math.PI,Qt={NONE:-1,ROTATE:0,DOLLY:1,PAN:2,TOUCH_ROTATE:3,TOUCH_PAN:4,TOUCH_DOLLY_PAN:5,TOUCH_DOLLY_ROTATE:6},vc=1e-6;class Ix extends Lx{constructor(e,t=null){super(e,t),this.state=Qt.NONE,this.enabled=!0,this.target=new A,this.cursor=new A,this.minDistance=0,this.maxDistance=1/0,this.minZoom=0,this.maxZoom=1/0,this.minTargetRadius=0,this.maxTargetRadius=1/0,this.minPolarAngle=0,this.maxPolarAngle=Math.PI,this.minAzimuthAngle=-1/0,this.maxAzimuthAngle=1/0,this.enableDamping=!1,this.dampingFactor=.05,this.enableZoom=!0,this.zoomSpeed=1,this.enableRotate=!0,this.rotateSpeed=1,this.enablePan=!0,this.panSpeed=1,this.screenSpacePanning=!0,this.keyPanSpeed=7,this.zoomToCursor=!1,this.autoRotate=!1,this.autoRotateSpeed=2,this.keys={LEFT:"ArrowLeft",UP:"ArrowUp",RIGHT:"ArrowRight",BOTTOM:"ArrowDown"},this.mouseButtons={LEFT:os.ROTATE,MIDDLE:os.DOLLY,RIGHT:os.PAN},this.touches={ONE:is.ROTATE,TWO:is.DOLLY_PAN},this.target0=this.target.clone(),this.position0=this.object.position.clone(),this.zoom0=this.object.zoom,this._domElementKeyEvents=null,this._lastPosition=new A,this._lastQuaternion=new qe,this._lastTargetPosition=new A,this._quat=new qe().setFromUnitVectors(e.up,new A(0,1,0)),this._quatInverse=this._quat.clone().invert(),this._spherical=new Id,this._sphericalDelta=new Id,this._scale=1,this._panOffset=new A,this._rotateStart=new ut,this._rotateEnd=new ut,this._rotateDelta=new ut,this._panStart=new ut,this._panEnd=new ut,this._panDelta=new ut,this._dollyStart=new ut,this._dollyEnd=new ut,this._dollyDelta=new ut,this._dollyDirection=new A,this._mouse=new ut,this._performCursorZoom=!1,this._pointers=[],this._pointerPositions={},this._controlActive=!1,this._onPointerMove=Nx.bind(this),this._onPointerDown=Fx.bind(this),this._onPointerUp=Ux.bind(this),this._onContextMenu=Vx.bind(this),this._onMouseWheel=Bx.bind(this),this._onKeyDown=zx.bind(this),this._onTouchStart=Hx.bind(this),this._onTouchMove=Gx.bind(this),this._onMouseDown=Ox.bind(this),this._onMouseMove=kx.bind(this),this._interceptControlDown=Wx.bind(this),this._interceptControlUp=qx.bind(this),this.domElement!==null&&this.connect(),this.update()}connect(){this.domElement.addEventListener("pointerdown",this._onPointerDown),this.domElement.addEventListener("pointercancel",this._onPointerUp),this.domElement.addEventListener("contextmenu",this._onContextMenu),this.domElement.addEventListener("wheel",this._onMouseWheel,{passive:!1}),this.domElement.getRootNode().addEventListener("keydown",this._interceptControlDown,{passive:!0,capture:!0}),this.domElement.style.touchAction="none"}disconnect(){this.domElement.removeEventListener("pointerdown",this._onPointerDown),this.domElement.removeEventListener("pointermove",this._onPointerMove),this.domElement.removeEventListener("pointerup",this._onPointerUp),this.domElement.removeEventListener("pointercancel",this._onPointerUp),this.domElement.removeEventListener("wheel",this._onMouseWheel),this.domElement.removeEventListener("contextmenu",this._onContextMenu),this.stopListenToKeyEvents(),this.domElement.getRootNode().removeEventListener("keydown",this._interceptControlDown,{capture:!0}),this.domElement.style.touchAction="auto"}dispose(){this.disconnect()}getPolarAngle(){return this._spherical.phi}getAzimuthalAngle(){return this._spherical.theta}getDistance(){return this.object.position.distanceTo(this.target)}listenToKeyEvents(e){e.addEventListener("keydown",this._onKeyDown),this._domElementKeyEvents=e}stopListenToKeyEvents(){this._domElementKeyEvents!==null&&(this._domElementKeyEvents.removeEventListener("keydown",this._onKeyDown),this._domElementKeyEvents=null)}saveState(){this.target0.copy(this.target),this.position0.copy(this.object.position),this.zoom0=this.object.zoom}reset(){this.target.copy(this.target0),this.object.position.copy(this.position0),this.object.zoom=this.zoom0,this.object.updateProjectionMatrix(),this.dispatchEvent(Fd),this.update(),this.state=Qt.NONE}update(e=null){const t=this.object.position;cn.copy(t).sub(this.target),cn.applyQuaternion(this._quat),this._spherical.setFromVector3(cn),this.autoRotate&&this.state===Qt.NONE&&this._rotateLeft(this._getAutoRotationAngle(e)),this.enableDamping?(this._spherical.theta+=this._sphericalDelta.theta*this.dampingFactor,this._spherical.phi+=this._sphericalDelta.phi*this.dampingFactor):(this._spherical.theta+=this._sphericalDelta.theta,this._spherical.phi+=this._sphericalDelta.phi);let n=this.minAzimuthAngle,r=this.maxAzimuthAngle;isFinite(n)&&isFinite(r)&&(n<-Math.PI?n+=Nn:n>Math.PI&&(n-=Nn),r<-Math.PI?r+=Nn:r>Math.PI&&(r-=Nn),n<=r?this._spherical.theta=Math.max(n,Math.min(r,this._spherical.theta)):this._spherical.theta=this._spherical.theta>(n+r)/2?Math.max(n,this._spherical.theta):Math.min(r,this._spherical.theta)),this._spherical.phi=Math.max(this.minPolarAngle,Math.min(this.maxPolarAngle,this._spherical.phi)),this._spherical.makeSafe(),this.enableDamping===!0?this.target.addScaledVector(this._panOffset,this.dampingFactor):this.target.add(this._panOffset),this.target.sub(this.cursor),this.target.clampLength(this.minTargetRadius,this.maxTargetRadius),this.target.add(this.cursor);let s=!1;if(this.zoomToCursor&&this._performCursorZoom||this.object.isOrthographicCamera)this._spherical.radius=this._clampDistance(this._spherical.radius);else{const o=this._spherical.radius;this._spherical.radius=this._clampDistance(this._spherical.radius*this._scale),s=o!=this._spherical.radius}if(cn.setFromSpherical(this._spherical),cn.applyQuaternion(this._quatInverse),t.copy(this.target).add(cn),this.object.lookAt(this.target),this.enableDamping===!0?(this._sphericalDelta.theta*=1-this.dampingFactor,this._sphericalDelta.phi*=1-this.dampingFactor,this._panOffset.multiplyScalar(1-this.dampingFactor)):(this._sphericalDelta.set(0,0,0),this._panOffset.set(0,0,0)),this.zoomToCursor&&this._performCursorZoom){let o=null;if(this.object.isPerspectiveCamera){const a=cn.length();o=this._clampDistance(a*this._scale);const l=a-o;this.object.position.addScaledVector(this._dollyDirection,l),this.object.updateMatrixWorld(),s=!!l}else if(this.object.isOrthographicCamera){const a=new A(this._mouse.x,this._mouse.y,0);a.unproject(this.object);const l=this.object.zoom;this.object.zoom=Math.max(this.minZoom,Math.min(this.maxZoom,this.object.zoom/this._scale)),this.object.updateProjectionMatrix(),s=l!==this.object.zoom;const c=new A(this._mouse.x,this._mouse.y,0);c.unproject(this.object),this.object.position.sub(c).add(a),this.object.updateMatrixWorld(),o=cn.length()}else console.warn("WARNING: OrbitControls.js encountered an unknown camera type - zoom to cursor disabled."),this.zoomToCursor=!1;o!==null&&(this.screenSpacePanning?this.target.set(0,0,-1).transformDirection(this.object.matrix).multiplyScalar(o).add(this.object.position):(qo.origin.copy(this.object.position),qo.direction.set(0,0,-1).transformDirection(this.object.matrix),Math.abs(this.object.up.dot(qo.direction))<Dx?this.object.lookAt(this.target):(Nd.setFromNormalAndCoplanarPoint(this.object.up,this.target),qo.intersectPlane(Nd,this.target))))}else if(this.object.isOrthographicCamera){const o=this.object.zoom;this.object.zoom=Math.max(this.minZoom,Math.min(this.maxZoom,this.object.zoom/this._scale)),o!==this.object.zoom&&(this.object.updateProjectionMatrix(),s=!0)}return this._scale=1,this._performCursorZoom=!1,s||this._lastPosition.distanceToSquared(this.object.position)>vc||8*(1-this._lastQuaternion.dot(this.object.quaternion))>vc||this._lastTargetPosition.distanceToSquared(this.target)>vc?(this.dispatchEvent(Fd),this._lastPosition.copy(this.object.position),this._lastQuaternion.copy(this.object.quaternion),this._lastTargetPosition.copy(this.target),!0):!1}_getAutoRotationAngle(e){return e!==null?Nn/60*this.autoRotateSpeed*e:Nn/60/60*this.autoRotateSpeed}_getZoomScale(e){const t=Math.abs(e*.01);return Math.pow(.95,this.zoomSpeed*t)}_rotateLeft(e){this._sphericalDelta.theta-=e}_rotateUp(e){this._sphericalDelta.phi-=e}_panLeft(e,t){cn.setFromMatrixColumn(t,0),cn.multiplyScalar(-e),this._panOffset.add(cn)}_panUp(e,t){this.screenSpacePanning===!0?cn.setFromMatrixColumn(t,1):(cn.setFromMatrixColumn(t,0),cn.crossVectors(this.object.up,cn)),cn.multiplyScalar(e),this._panOffset.add(cn)}_pan(e,t){const n=this.domElement;if(this.object.isPerspectiveCamera){const r=this.object.position;cn.copy(r).sub(this.target);let s=cn.length();s*=Math.tan(this.object.fov/2*Math.PI/180),this._panLeft(2*e*s/n.clientHeight,this.object.matrix),this._panUp(2*t*s/n.clientHeight,this.object.matrix)}else this.object.isOrthographicCamera?(this._panLeft(e*(this.object.right-this.object.left)/this.object.zoom/n.clientWidth,this.object.matrix),this._panUp(t*(this.object.top-this.object.bottom)/this.object.zoom/n.clientHeight,this.object.matrix)):(console.warn("WARNING: OrbitControls.js encountered an unknown camera type - pan disabled."),this.enablePan=!1)}_dollyOut(e){this.object.isPerspectiveCamera||this.object.isOrthographicCamera?this._scale/=e:(console.warn("WARNING: OrbitControls.js encountered an unknown camera type - dolly/zoom disabled."),this.enableZoom=!1)}_dollyIn(e){this.object.isPerspectiveCamera||this.object.isOrthographicCamera?this._scale*=e:(console.warn("WARNING: OrbitControls.js encountered an unknown camera type - dolly/zoom disabled."),this.enableZoom=!1)}_updateZoomParameters(e,t){if(!this.zoomToCursor)return;this._performCursorZoom=!0;const n=this.domElement.getBoundingClientRect(),r=e-n.left,s=t-n.top,o=n.width,a=n.height;this._mouse.x=r/o*2-1,this._mouse.y=-(s/a)*2+1,this._dollyDirection.set(this._mouse.x,this._mouse.y,1).unproject(this.object).sub(this.object.position).normalize()}_clampDistance(e){return Math.max(this.minDistance,Math.min(this.maxDistance,e))}_handleMouseDownRotate(e){this._rotateStart.set(e.clientX,e.clientY)}_handleMouseDownDolly(e){this._updateZoomParameters(e.clientX,e.clientX),this._dollyStart.set(e.clientX,e.clientY)}_handleMouseDownPan(e){this._panStart.set(e.clientX,e.clientY)}_handleMouseMoveRotate(e){this._rotateEnd.set(e.clientX,e.clientY),this._rotateDelta.subVectors(this._rotateEnd,this._rotateStart).multiplyScalar(this.rotateSpeed);const t=this.domElement;this._rotateLeft(Nn*this._rotateDelta.x/t.clientHeight),this._rotateUp(Nn*this._rotateDelta.y/t.clientHeight),this._rotateStart.copy(this._rotateEnd),this.update()}_handleMouseMoveDolly(e){this._dollyEnd.set(e.clientX,e.clientY),this._dollyDelta.subVectors(this._dollyEnd,this._dollyStart),this._dollyDelta.y>0?this._dollyOut(this._getZoomScale(this._dollyDelta.y)):this._dollyDelta.y<0&&this._dollyIn(this._getZoomScale(this._dollyDelta.y)),this._dollyStart.copy(this._dollyEnd),this.update()}_handleMouseMovePan(e){this._panEnd.set(e.clientX,e.clientY),this._panDelta.subVectors(this._panEnd,this._panStart).multiplyScalar(this.panSpeed),this._pan(this._panDelta.x,this._panDelta.y),this._panStart.copy(this._panEnd),this.update()}_handleMouseWheel(e){this._updateZoomParameters(e.clientX,e.clientY),e.deltaY<0?this._dollyIn(this._getZoomScale(e.deltaY)):e.deltaY>0&&this._dollyOut(this._getZoomScale(e.deltaY)),this.update()}_handleKeyDown(e){let t=!1;switch(e.code){case this.keys.UP:e.ctrlKey||e.metaKey||e.shiftKey?this._rotateUp(Nn*this.rotateSpeed/this.domElement.clientHeight):this._pan(0,this.keyPanSpeed),t=!0;break;case this.keys.BOTTOM:e.ctrlKey||e.metaKey||e.shiftKey?this._rotateUp(-Nn*this.rotateSpeed/this.domElement.clientHeight):this._pan(0,-this.keyPanSpeed),t=!0;break;case this.keys.LEFT:e.ctrlKey||e.metaKey||e.shiftKey?this._rotateLeft(Nn*this.rotateSpeed/this.domElement.clientHeight):this._pan(this.keyPanSpeed,0),t=!0;break;case this.keys.RIGHT:e.ctrlKey||e.metaKey||e.shiftKey?this._rotateLeft(-Nn*this.rotateSpeed/this.domElement.clientHeight):this._pan(-this.keyPanSpeed,0),t=!0;break}t&&(e.preventDefault(),this.update())}_handleTouchStartRotate(e){if(this._pointers.length===1)this._rotateStart.set(e.pageX,e.pageY);else{const t=this._getSecondPointerPosition(e),n=.5*(e.pageX+t.x),r=.5*(e.pageY+t.y);this._rotateStart.set(n,r)}}_handleTouchStartPan(e){if(this._pointers.length===1)this._panStart.set(e.pageX,e.pageY);else{const t=this._getSecondPointerPosition(e),n=.5*(e.pageX+t.x),r=.5*(e.pageY+t.y);this._panStart.set(n,r)}}_handleTouchStartDolly(e){const t=this._getSecondPointerPosition(e),n=e.pageX-t.x,r=e.pageY-t.y,s=Math.sqrt(n*n+r*r);this._dollyStart.set(0,s)}_handleTouchStartDollyPan(e){this.enableZoom&&this._handleTouchStartDolly(e),this.enablePan&&this._handleTouchStartPan(e)}_handleTouchStartDollyRotate(e){this.enableZoom&&this._handleTouchStartDolly(e),this.enableRotate&&this._handleTouchStartRotate(e)}_handleTouchMoveRotate(e){if(this._pointers.length==1)this._rotateEnd.set(e.pageX,e.pageY);else{const n=this._getSecondPointerPosition(e),r=.5*(e.pageX+n.x),s=.5*(e.pageY+n.y);this._rotateEnd.set(r,s)}this._rotateDelta.subVectors(this._rotateEnd,this._rotateStart).multiplyScalar(this.rotateSpeed);const t=this.domElement;this._rotateLeft(Nn*this._rotateDelta.x/t.clientHeight),this._rotateUp(Nn*this._rotateDelta.y/t.clientHeight),this._rotateStart.copy(this._rotateEnd)}_handleTouchMovePan(e){if(this._pointers.length===1)this._panEnd.set(e.pageX,e.pageY);else{const t=this._getSecondPointerPosition(e),n=.5*(e.pageX+t.x),r=.5*(e.pageY+t.y);this._panEnd.set(n,r)}this._panDelta.subVectors(this._panEnd,this._panStart).multiplyScalar(this.panSpeed),this._pan(this._panDelta.x,this._panDelta.y),this._panStart.copy(this._panEnd)}_handleTouchMoveDolly(e){const t=this._getSecondPointerPosition(e),n=e.pageX-t.x,r=e.pageY-t.y,s=Math.sqrt(n*n+r*r);this._dollyEnd.set(0,s),this._dollyDelta.set(0,Math.pow(this._dollyEnd.y/this._dollyStart.y,this.zoomSpeed)),this._dollyOut(this._dollyDelta.y),this._dollyStart.copy(this._dollyEnd);const o=(e.pageX+t.x)*.5,a=(e.pageY+t.y)*.5;this._updateZoomParameters(o,a)}_handleTouchMoveDollyPan(e){this.enableZoom&&this._handleTouchMoveDolly(e),this.enablePan&&this._handleTouchMovePan(e)}_handleTouchMoveDollyRotate(e){this.enableZoom&&this._handleTouchMoveDolly(e),this.enableRotate&&this._handleTouchMoveRotate(e)}_addPointer(e){this._pointers.push(e.pointerId)}_removePointer(e){delete this._pointerPositions[e.pointerId];for(let t=0;t<this._pointers.length;t++)if(this._pointers[t]==e.pointerId){this._pointers.splice(t,1);return}}_isTrackingPointer(e){for(let t=0;t<this._pointers.length;t++)if(this._pointers[t]==e.pointerId)return!0;return!1}_trackPointer(e){let t=this._pointerPositions[e.pointerId];t===void 0&&(t=new ut,this._pointerPositions[e.pointerId]=t),t.set(e.pageX,e.pageY)}_getSecondPointerPosition(e){const t=e.pointerId===this._pointers[0]?this._pointers[1]:this._pointers[0];return this._pointerPositions[t]}_customWheelEvent(e){const t=e.deltaMode,n={clientX:e.clientX,clientY:e.clientY,deltaY:e.deltaY};switch(t){case 1:n.deltaY*=16;break;case 2:n.deltaY*=100;break}return e.ctrlKey&&!this._controlActive&&(n.deltaY*=10),n}}function Fx(i){this.enabled!==!1&&(this._pointers.length===0&&(this.domElement.setPointerCapture(i.pointerId),this.domElement.addEventListener("pointermove",this._onPointerMove),this.domElement.addEventListener("pointerup",this._onPointerUp)),!this._isTrackingPointer(i)&&(this._addPointer(i),i.pointerType==="touch"?this._onTouchStart(i):this._onMouseDown(i)))}function Nx(i){this.enabled!==!1&&(i.pointerType==="touch"?this._onTouchMove(i):this._onMouseMove(i))}function Ux(i){switch(this._removePointer(i),this._pointers.length){case 0:this.domElement.releasePointerCapture(i.pointerId),this.domElement.removeEventListener("pointermove",this._onPointerMove),this.domElement.removeEventListener("pointerup",this._onPointerUp),this.dispatchEvent(Xh),this.state=Qt.NONE;break;case 1:const e=this._pointers[0],t=this._pointerPositions[e];this._onTouchStart({pointerId:e,pageX:t.x,pageY:t.y});break}}function Ox(i){let e;switch(i.button){case 0:e=this.mouseButtons.LEFT;break;case 1:e=this.mouseButtons.MIDDLE;break;case 2:e=this.mouseButtons.RIGHT;break;default:e=-1}switch(e){case os.DOLLY:if(this.enableZoom===!1)return;this._handleMouseDownDolly(i),this.state=Qt.DOLLY;break;case os.ROTATE:if(i.ctrlKey||i.metaKey||i.shiftKey){if(this.enablePan===!1)return;this._handleMouseDownPan(i),this.state=Qt.PAN}else{if(this.enableRotate===!1)return;this._handleMouseDownRotate(i),this.state=Qt.ROTATE}break;case os.PAN:if(i.ctrlKey||i.metaKey||i.shiftKey){if(this.enableRotate===!1)return;this._handleMouseDownRotate(i),this.state=Qt.ROTATE}else{if(this.enablePan===!1)return;this._handleMouseDownPan(i),this.state=Qt.PAN}break;default:this.state=Qt.NONE}this.state!==Qt.NONE&&this.dispatchEvent(iu)}function kx(i){switch(this.state){case Qt.ROTATE:if(this.enableRotate===!1)return;this._handleMouseMoveRotate(i);break;case Qt.DOLLY:if(this.enableZoom===!1)return;this._handleMouseMoveDolly(i);break;case Qt.PAN:if(this.enablePan===!1)return;this._handleMouseMovePan(i);break}}function Bx(i){this.enabled===!1||this.enableZoom===!1||this.state!==Qt.NONE||(i.preventDefault(),this.dispatchEvent(iu),this._handleMouseWheel(this._customWheelEvent(i)),this.dispatchEvent(Xh))}function zx(i){this.enabled===!1||this.enablePan===!1||this._handleKeyDown(i)}function Hx(i){switch(this._trackPointer(i),this._pointers.length){case 1:switch(this.touches.ONE){case is.ROTATE:if(this.enableRotate===!1)return;this._handleTouchStartRotate(i),this.state=Qt.TOUCH_ROTATE;break;case is.PAN:if(this.enablePan===!1)return;this._handleTouchStartPan(i),this.state=Qt.TOUCH_PAN;break;default:this.state=Qt.NONE}break;case 2:switch(this.touches.TWO){case is.DOLLY_PAN:if(this.enableZoom===!1&&this.enablePan===!1)return;this._handleTouchStartDollyPan(i),this.state=Qt.TOUCH_DOLLY_PAN;break;case is.DOLLY_ROTATE:if(this.enableZoom===!1&&this.enableRotate===!1)return;this._handleTouchStartDollyRotate(i),this.state=Qt.TOUCH_DOLLY_ROTATE;break;default:this.state=Qt.NONE}break;default:this.state=Qt.NONE}this.state!==Qt.NONE&&this.dispatchEvent(iu)}function Gx(i){switch(this._trackPointer(i),this.state){case Qt.TOUCH_ROTATE:if(this.enableRotate===!1)return;this._handleTouchMoveRotate(i),this.update();break;case Qt.TOUCH_PAN:if(this.enablePan===!1)return;this._handleTouchMovePan(i),this.update();break;case Qt.TOUCH_DOLLY_PAN:if(this.enableZoom===!1&&this.enablePan===!1)return;this._handleTouchMoveDollyPan(i),this.update();break;case Qt.TOUCH_DOLLY_ROTATE:if(this.enableZoom===!1&&this.enableRotate===!1)return;this._handleTouchMoveDollyRotate(i),this.update();break;default:this.state=Qt.NONE}}function Vx(i){this.enabled!==!1&&i.preventDefault()}function Wx(i){i.key==="Control"&&(this._controlActive=!0,this.domElement.getRootNode().addEventListener("keyup",this._interceptControlUp,{passive:!0,capture:!0}))}function qx(i){i.key==="Control"&&(this._controlActive=!1,this.domElement.getRootNode().removeEventListener("keyup",this._interceptControlUp,{passive:!0,capture:!0}))}class jx extends Yl{constructor(){super();const e=new Cs;e.deleteAttribute("uv");const t=new Ss({side:Cn}),n=new Ss,r=new qh(16777215,900,28,2);r.position.set(.418,16.199,.3),this.add(r);const s=new Xt(e,t);s.position.set(-.757,13.219,.717),s.scale.set(31.713,28.305,28.591),this.add(s);const o=new Xt(e,n);o.position.set(-10.906,2.009,1.846),o.rotation.set(0,-.195,0),o.scale.set(2.328,7.905,4.651),this.add(o);const a=new Xt(e,n);a.position.set(-5.607,-.754,-.758),a.rotation.set(0,.994,0),a.scale.set(1.97,1.534,3.955),this.add(a);const l=new Xt(e,n);l.position.set(6.167,.857,7.803),l.rotation.set(0,.561,0),l.scale.set(3.927,6.285,3.687),this.add(l);const c=new Xt(e,n);c.position.set(-2.017,.018,6.124),c.rotation.set(0,.333,0),c.scale.set(2.002,4.566,2.064),this.add(c);const u=new Xt(e,n);u.position.set(2.291,-.756,-2.621),u.rotation.set(0,-.286,0),u.scale.set(1.546,1.552,1.496),this.add(u);const d=new Xt(e,n);d.position.set(-2.193,-.369,-5.547),d.rotation.set(0,.516,0),d.scale.set(3.875,3.487,2.986),this.add(d);const h=new Xt(e,Zr(50));h.position.set(-16.116,14.37,8.208),h.scale.set(.1,2.428,2.739),this.add(h);const p=new Xt(e,Zr(50));p.position.set(-16.109,18.021,-8.207),p.scale.set(.1,2.425,2.751),this.add(p);const g=new Xt(e,Zr(17));g.position.set(14.904,12.198,-1.832),g.scale.set(.15,4.265,6.331),this.add(g);const b=new Xt(e,Zr(43));b.position.set(-.462,8.89,14.52),b.scale.set(4.38,5.441,.088),this.add(b);const m=new Xt(e,Zr(20));m.position.set(3.235,11.486,-12.541),m.scale.set(2.5,2,.1),this.add(m);const f=new Xt(e,Zr(100));f.position.set(0,20,0),f.scale.set(1,.1,1),this.add(f)}dispose(){const e=new Set;this.traverse(t=>{t.isMesh&&(e.add(t.geometry),e.add(t.material))});for(const t of e)t.dispose()}}function Zr(i){const e=new Gi;return e.color.setScalar(i),e}const Qh=["left","right"],Xx=["step","point"],Tl=i=>structuredClone(i);function la(i,e,t=1/0){if(!Array.isArray(i)||i.length!==3||Array.from(i).some(n=>typeof n!="number"||!Number.isFinite(n)||Math.abs(n)>t))throw new TypeError(`${e} must contain three finite numbers${t===1/0?"":` within ±${t}`}.`)}function Rl(i){return i&&typeof i=="object"&&!Array.isArray(i)&&Xx.includes(i.kind)&&typeof i.id=="string"&&!!i.id.trim()}function co(i){if(!Rl(i))throw new TypeError("A foot curve anchor needs kind step or point and a non-empty string id.");return{kind:i.kind,id:i.id}}function Ud(i){const{kind:e,id:t}=co(i);return JSON.stringify([e,t])}function Ts(i,e){return!!(Rl(i)&&Rl(e)&&i.kind===e.kind&&i.id===e.id)}function Qx(i,e,t=i?.side){return!!(Qh.includes(t)&&i?.side===t&&Ts(i.from,e?.from)&&Ts(i.to,e?.to))}function Kx(i){if(!Array.isArray(i)||i.length>200)throw new TypeError("Foot curves must be an array with at most 200 entries.");const e=new Set,t=new Set;for(const[n,r]of i.entries()){const s=`Foot curve ${n+1}`;if(!r||typeof r!="object"||Array.isArray(r))throw new TypeError(`${s} must be an object.`);if(typeof r.id!="string"||!r.id.trim())throw new TypeError(`${s} needs a non-empty string id.`);if(e.has(r.id))throw new TypeError(`${s} repeats a curve id.`);if(e.add(r.id),!Qh.includes(r.side))throw new TypeError(`${s} side must be left or right.`);const o=co(r.from),a=co(r.to);if(Ts(o,a))throw new TypeError(`${s} must connect two different anchors.`);const l=JSON.stringify([r.side,o.kind,o.id,a.kind,a.id]);if(t.has(l))throw new TypeError(`${s} repeats a side and directed anchor pair.`);t.add(l),la(r.bend,`${s} bend`,1e4)}return Tl(i)}function Yx(i,e,t,n){if(la(i,"Foot curve start"),la(e,"Foot curve end"),la(t,"Foot curve bend",1e4),typeof n!="number"||!Number.isFinite(n)||n<0||n>1)throw new TypeError("Foot curve blend must be finite and between 0 and 1.");if(n===0)return Tl(i);if(n===1)return Tl(e);const r=4*n*(1-n);return i.map((s,o)=>s*(1-n)+e[o]*n+r*t[o])}const yc=["pelvis","leftAnkle","rightAnkle","leftWrist","rightWrist"],$x=["leftKnee","rightKnee","leftElbow","rightElbow"],ds=i=>structuredClone(i),Rr=i=>i&&typeof i=="object"&&!Array.isArray(i);function qi(i,e,t=10){if(!Array.isArray(i)||i.length!==3||Array.from(i).some(n=>typeof n!="number"||!Number.isFinite(n)||Math.abs(n)>t))throw new TypeError(`${e}需要三个${t===1/0?"":`在 ±${t} 米以内的`}有限坐标。`)}function Kh(i,e){if(!Rr(i))throw new TypeError(`${e}需要为对象。`);if(qi(i.center,`${e}旋转中心`),Object.hasOwn(i,"arc")&&!["short","long"].includes(i.arc))throw new TypeError(`${e}请选择短弧或长弧。`);if(Object.hasOwn(i,"normal")&&(qi(i.normal,`${e}备用旋转平面法向`,1/0),Math.max(...i.normal.map(Math.abs))===0))throw new TypeError(`${e}备用旋转平面法向不能为零。`)}function Zx(i,e){if(!Array.isArray(i)||i.length>200)throw new TypeError("整段路线需要为数组，最多保存 200 条。");const t=new Set,n=new Set,r=Array.isArray(e)?e:e?.steps;if(e!==void 0&&!Array.isArray(r))throw new TypeError("整段路线需要有效的动画节点。");const s=r&&new Set(r.map((o,a)=>typeof o?.id=="string"&&o.id.trim()?o.id:`step-${a}`));for(const[o,a]of i.entries()){const l=`整段路线 ${o+1}`;if(!Rr(a))throw new TypeError(`${l}需要为对象。`);if(typeof a.id!="string"||!a.id.trim()||t.has(a.id))throw new TypeError(`${l}需要独立且非空的编号。`);t.add(a.id);const c=co(a.from),u=co(a.to);if(Ts(c,u))throw new TypeError(`${l}需要两个不同的关键帧。`);for(const h of[c,u])if(s&&h.kind==="step"&&!s.has(h.id))throw new TypeError(`${l}的原关键帧不属于当前动画。`);const d=JSON.stringify([Ud(c),Ud(u)]);if(n.has(d))throw new TypeError(`${l}重复指定同一个有向关键帧区间。`);if(n.add(d),!["linear","smooth"].includes(a.timing))throw new TypeError(`${l}需要选择线性或平滑补帧。`);if(Object.hasOwn(a,"bends")){if(!Rr(a.bends))throw new TypeError(`${l}的位置路线需要为对象。`);for(const h of yc)Object.hasOwn(a.bends,h)&&qi(a.bends[h],`${l} ${h}`)}if(Object.hasOwn(a,"smoothPaths")){if(!Rr(a.smoothPaths))throw new TypeError(`${l}的平滑弧线需要为对象。`);for(const h of yc)if(Object.hasOwn(a.smoothPaths,h)){const p=a.smoothPaths[h];if(!Rr(p))throw new TypeError(`${l} ${h} 的平滑弧线需要为对象。`);qi(p.bend,`${l} ${h} 平滑弧线中点偏移`)}}if(Object.hasOwn(a,"orbitPaths")){if(!Rr(a.orbitPaths))throw new TypeError(`${l}的旋转中心路线需要为对象。`);for(const h of yc)Object.hasOwn(a.orbitPaths,h)&&Kh(a.orbitPaths[h],`${l} ${h} 旋转中心路线`)}if(Object.hasOwn(a,"bendAngles")){if(!Rr(a.bendAngles))throw new TypeError(`${l}的关节弯向需要为对象。`);for(const h of $x)if(Object.hasOwn(a.bendAngles,h)){const p=a.bendAngles[h];if(typeof p!="number"||!Number.isFinite(p)||Math.abs(p)>2*Math.PI)throw new TypeError(`${l} ${h}需要在 ±2π 以内的有限角度。`)}}}return ds(i)}function Jx(i,e){return!!(i&&Ts(i.from,e?.from)&&Ts(i.to,e?.to))}function ev(i){if(typeof i!="number"||!Number.isFinite(i)||i<0||i>1)throw new TypeError("整段路线进度需要为 0–1 之间的有限数值。");return i===0||i===1?0:16*i*i*(1-i)*(1-i)}function tv(i,e,t,n){if(qi(i,"整段平滑弧线起点",1/0),qi(e,"整段平滑弧线终点",1/0),qi(t,"整段平滑弧线中点偏移"),typeof n!="number"||!Number.isFinite(n)||n<0||n>1)throw new TypeError("整段平滑弧线进度需要为 0–1 之间的有限数值。");if(n===0)return ds(i);if(n===1)return ds(e);const r=4*n*(1-n);return i.map((s,o)=>s*(1-n)+e[o]*n+r*t[o])}const xa=(i,e)=>i.reduce((t,n,r)=>t+n*e[r],0),Od=(i,e)=>[i[1]*e[2]-i[2]*e[1],i[2]*e[0]-i[0]*e[2],i[0]*e[1]-i[1]*e[0]];function hs(i){const e=Math.max(...i.map(Math.abs));if(e===0)return null;const t=i.map(r=>r/e),n=Math.hypot(...t);return t.map(r=>r/n)}function kd(i,e){const t=i.map((o,a)=>o-e[a]),n=hs(t);if(!n)throw new RangeError("旋转中心不能与任一端点重合，请移动旋转中心。");const r=Math.max(...t.map(Math.abs)),s=r*Math.hypot(...t.map(o=>o/r));if(!Number.isFinite(s))throw new RangeError("端点离旋转中心过远，无法计算有限的弧线。");return{direction:n,radius:s}}function nv(i,e){if(e){const s=hs(e),o=xa(s,i),a=s.map((l,c)=>l-o*i[c]);if(Math.hypot(...a)>1e-12)return hs(a)}let t=0;for(let s=1;s<3;s++)Math.abs(i[s])<Math.abs(i[t])&&(t=s);const n=[0,0,0];n[t]=1;const r=xa(n,i);return hs(n.map((s,o)=>s-r*i[o]))}function iv(i,e,t,n){if(qi(i,"整段旋转弧线起点",1/0),qi(e,"整段旋转弧线终点",1/0),Kh(t,"整段旋转弧线"),typeof n!="number"||!Number.isFinite(n)||n<0||n>1)throw new TypeError("整段旋转弧线进度需要为 0–1 之间的有限数值。");const r=kd(i,t.center),s=kd(e,t.center);if(n===0)return ds(i);if(n===1)return ds(e);if(t.arc!=="long"&&i.every((f,M)=>f===e[M]))return ds(i);const o=Od(r.direction,s.direction),a=Math.max(-1,Math.min(1,xa(r.direction,s.direction)));let l=hs(o);const c=l?Math.atan2(Math.hypot(...o),a):a<0?Math.PI:0;l??(l=nv(r.direction,t.normal));const u=(t.arc==="long"?c-2*Math.PI:c)*n,d=Math.sin(u),h=Math.cos(u),p=Od(l,r.direction),g=xa(l,r.direction),b=r.radius*(1-n)+s.radius*n;return hs(r.direction.map((f,M)=>f*h+p[M]*d+l[M]*g*(1-h))).map((f,M)=>t.center[M]+b*f)}const va=["left","right"],Yh=["wrist","elbowPole","ankle","kneePole"],$h=["handQuaternion","footQuaternion"],Zh=["elbowTwist","kneeTwist","upperArmTwist","thighTwist"],Bd=[0,0,0,1],on=i=>structuredClone(i);function Cl(i,e,t){if(!Array.isArray(i)||i.length!==e||Array.from(i).some(n=>typeof n!="number"||!Number.isFinite(n)))throw new TypeError(`${t} must contain ${e} finite numbers.`)}function jo(i,e){if(Cl(i,4,e),Math.max(...i.map(Math.abs))===0)throw new TypeError(`${e} cannot be a zero quaternion.`)}function Da(i,e){if(typeof i=="number"&&!Number.isFinite(i))throw new TypeError(`${e} contains a non-finite number.`);if(i&&typeof i=="object")for(const[t,n]of Object.entries(i))Da(n,`${e}.${t}`)}function ua(i,e){const t=typeof e=="number"?`Step ${e+1}`:e;if(!i||i.version!==1)throw new TypeError(`${t} needs a version 1 pose.`);if(Cl(i.pelvis,3,`${t} pelvis`),jo(i.bodyQuaternion,`${t} bodyQuaternion`),Object.hasOwn(i,"torsoQuaternion")&&jo(i.torsoQuaternion,`${t} torsoQuaternion`),Object.hasOwn(i,"pelvisQuaternion")&&jo(i.pelvisQuaternion,`${t} pelvisQuaternion`),typeof i.groundLock!="boolean")throw new TypeError(`${t} groundLock must be boolean.`);for(const n of va){const r=i.limbs?.[n];if(!r||typeof r.handLocked!="boolean")throw new TypeError(`${t} ${n} handLocked must be boolean.`);for(const s of Yh)Cl(r[s],3,`${t} ${n} ${s}`);for(const s of $h)jo(r[s],`${t} ${n} ${s}`);for(const s of Zh)if(Object.hasOwn(r,s)&&(typeof r[s]!="number"||!Number.isFinite(r[s])))throw new TypeError(`${t} ${n} ${s} must be a finite angle in radians.`)}Da(i,t)}function Xo(i){const e=Math.max(...i.map(Math.abs)),t=i.map(r=>r/e),n=Math.hypot(...t);return t.map(r=>r/n)}function Qo(i,e,t){const n=Xo(i),r=Xo(e);let s=n.reduce((u,d,h)=>u+d*r[h],0);if(s<0){for(let u=0;u<4;u++)r[u]=-r[u];s=-s}if(s=Math.min(1,Math.max(0,s)),s>.9995)return Xo(n.map((u,d)=>u*(1-t)+r[d]*t));const o=Math.acos(s),a=Math.sin(o),l=Math.sin((1-t)*o)/a,c=Math.sin(t*o)/a;return Xo(n.map((u,d)=>u*l+r[d]*c))}const zd=(i,e,t)=>i.map((n,r)=>n*(1-t)+e[r]*t);function rv(i,e,t){const n=2*Math.PI,r=((e%n-i%n+Math.PI)%n+n)%n-Math.PI;return i+r*t}const Ko=i=>i*i*(3-2*i);function Jr(i,e){return i+e>1&&([i,e]=[1-e,1-i]),(e-i)*(3*(i+e)-2*(i*i+i*e+e*e))}function sv(i,e,t){const n=on(i);n.pelvis=zd(i.pelvis,e.pelvis,t),n.bodyQuaternion=Qo(i.bodyQuaternion,e.bodyQuaternion,t),(Object.hasOwn(i,"pelvisQuaternion")||Object.hasOwn(e,"pelvisQuaternion"))&&(n.pelvisQuaternion=Qo(i.pelvisQuaternion??i.bodyQuaternion,e.pelvisQuaternion??e.bodyQuaternion,t)),(Object.hasOwn(i,"torsoQuaternion")||Object.hasOwn(e,"torsoQuaternion"))&&(n.torsoQuaternion=Qo(i.torsoQuaternion??Bd,e.torsoQuaternion??Bd,t));for(const r of va){const s=n.limbs[r];for(const o of Yh)s[o]=zd(i.limbs[r][o],e.limbs[r][o],t);for(const o of $h)s[o]=Qo(i.limbs[r][o],e.limbs[r][o],t);for(const o of Zh)(Object.hasOwn(i.limbs[r],o)||Object.hasOwn(e.limbs[r],o))&&(s[o]=rv(i.limbs[r][o]??0,e.limbs[r][o]??0,t));s.handLocked=i.limbs[r].handLocked&&e.limbs[r].handLocked}return n}function ov(i,e){if(!Array.isArray(i))throw new TypeError("Transition corrections must be an array.");const t=new Set;for(const[r,s]of i.entries()){const o=`Correction ${r+1}`;if(!s||typeof s!="object"||Array.isArray(s))throw new TypeError(`${o} must be an object.`);if(typeof s.id!="string"||!s.id.trim())throw new TypeError(`${o} needs a non-empty string id.`);if(t.has(s.id))throw new TypeError(`${o} repeats a correction id.`);if(t.add(s.id),!Number.isInteger(s.segment)||s.segment<0||s.segment>=e)throw new TypeError(`${o} segment must be an existing transition index.`);if(typeof s.at!="number"||!Number.isFinite(s.at)||s.at<=0||s.at>=1)throw new TypeError(`${o} at must be strictly between 0 and 1.`);ua(s.pose,o),Da(s,o)}const n=on(i).sort((r,s)=>r.segment-s.segment||r.at-s.at);for(let r=1;r<n.length;r++){const s=n[r-1],o=n[r];if(s.segment===o.segment&&o.at-s.at<=1e-8)throw new TypeError("A transition cannot have correction points at the same position.")}return n}function av(i){const e={front:0,sideA:2,rear:4,sideB:6,frontRepeat:8};for(const t of["front","sideA","rear","sideB"]){const n=i.flatMap((r,s)=>r.phase===t?[s]:[]);n.length&&(e[t]=t.startsWith("side")?n[Math.floor(n.length/2)]:n[0],t==="front"&&(e.frontRepeat=n.at(-1)),t==="rear"&&n.length>1&&(e.rearRepeat=n.at(-1)))}return e}function cv(i,e){if(!Array.isArray(i))throw new TypeError("Skipped steps must be an array of original step indices.");const t=new Set;for(const n of i){if(!Number.isInteger(n)||n<0||n>=e)throw new TypeError("A skipped step must be an existing original step index.");if(t.has(n))throw new TypeError("Skipped step indices must be unique.");t.add(n)}return t}function Mc(i,{period:e=i?.length,corrections:t=[],mapTransition:n,interpolation:r="smooth",skippedSteps:s=[],footCurves:o=[],resolveFootEndpoint:a,segmentGuides:l=[],mapGuidedTransition:c}={}){if(!Array.isArray(i)||!i.length)throw new TypeError("A flare sequence needs at least one step.");if(typeof e!="number"||!Number.isFinite(e)||e<=0)throw new TypeError("Sequence period must be positive and finite.");if(n!==void 0&&typeof n!="function")throw new TypeError("mapTransition must be a function.");if(c!==void 0&&typeof c!="function")throw new TypeError("mapGuidedTransition must be a function.");if(a!==void 0&&typeof a!="function")throw new TypeError("resolveFootEndpoint must be a function.");if(r!=="smooth"&&r!=="linear")throw new TypeError("Sequence interpolation must be smooth or linear.");for(const[L,k]of i.entries())ua(k?.pose,L),Da(k,`Step ${L+1}`);const u=ov(t,i.length),d=cv(s,i.length),h=Kx(o),p=Zx(l,i),g=on(i),b=g.length,m=g.map((L,k)=>({kind:"step",id:typeof L.id=="string"&&L.id.trim()?L.id:`step-${k}`,coordinate:k,index:k,pose:L.pose})),f=m.filter((L,k)=>!d.has(k)),M=u.map(L=>({...L,kind:"point",coordinate:L.segment+L.at,index:L.segment})),x=f.concat(M).sort((L,k)=>L.coordinate-k.coordinate);if(!x.length)throw new TypeError("A sequence needs at least one enabled original step or correction.");const _=Array.from({length:b},(L,k)=>[{...m[k],at:0},...M.filter(K=>K.segment===k),{...m[(k+1)%b],at:1}]),D=L=>Math.min(1e-8,32*Number.EPSILON*Math.max(1,b,Math.abs(L/e)*b)),P=L=>{if(typeof L!="number"||!Number.isFinite(L))throw new TypeError("Sequence time must be finite.");let k=L%e;k<0&&(k+=e);const K=k/e*b,X=Math.max(0,Math.min(b-1,Math.floor(K))),ee=(X+1)%b,le=K-X,j=D(L);return le<=Math.min(j,_[X][1].at/2)?{index:X,next:ee,progress:0}:1-le<=Math.min(j,(1-_[X].at(-2).at)/2)?{index:ee,next:(ee+1)%b,progress:0}:{index:X,next:ee,progress:le}},T=(L,k,K,X)=>{const ee=p.length?$(X):null,le=ee&&O(ee);le&&(K=ee.blend);const j=sv(L,k,K);let oe=j;if(n){const xe=n(j,{start:on(L),end:on(k),blend:K});ua(xe,"Mapped transition"),oe=on(xe)}if(h.length){const xe=ee??q(X);xe.blend=K;for(const me of va){const Te=Z(xe,me);Te&&(oe.limbs[me].ankle=Te.position)}}if(le&&!ee.exact&&c){const xe=c(oe,{start:on(L),end:on(k),blend:K,time:X,span:se(ee,X),guide:on(le)});ua(xe,"Guided transition"),oe=xe}return oe},N=L=>{let k=L%e;return k<0&&(k+=e),k/e*b},v=(L,k)=>{const K=L.findIndex(le=>le.coordinate>k),X=L[(K<=0?L.length:K)-1],ee=L[K<0?0:K];return{left:X,right:ee,start:X.coordinate-(K===0?b:0),end:ee.coordinate+(K<0?b:0)}},y=(L,k)=>{let K=(k-L.start)/(L.end-L.start);if(r==="smooth")if(f.length){const X=v(f,k),ee=X.end-X.start,le=(L.start-X.start)/ee,j=(L.end-X.start)/ee,oe=(k-X.start)/ee;K=Jr(le,oe)/Jr(le,j)}else K=Ko(K);return Math.min(1,Math.max(0,K))},C=(L,k,K)=>{const X=x.indexOf(L),ee=L.coordinate+Math.round((k-L.coordinate)/b)*b;if(K==="previous"){const xe=x[(X+x.length-1)%x.length],me=L.coordinate-xe.coordinate,Te=me>0?me:me+b;return{left:xe,right:L,start:ee-Te,end:ee,blend:1,exact:!0}}const le=x[(X+1)%x.length],j=le.coordinate-L.coordinate,oe=j>0?j:j+b;return{left:L,right:le,start:ee,end:ee+oe,blend:0,exact:!0}},q=(L,k="next")=>{const{index:K,next:X,progress:ee}=P(L),le=N(L),j=v(x,le);if(d.has(K)||d.has(X)||x.length===1){const Ce=le-j.start,st=j.end-le;return Math.min(Ce,st)<=Math.min(D(L),(j.end-j.start)/2)?C(Ce<st?j.left:j.right,le,k):{...j,blend:y(j,le),exact:!1}}if(ee===0)return C(f.find(Ce=>Ce.index===K),le,k);const xe=_[K];if(xe.length===2)return{...j,blend:r==="linear"?ee:Ko(ee),exact:!1};const me=xe.reduce((Ce,st)=>Math.abs(ee-st.at)<Math.abs(ee-Ce.at)?st:Ce);if(Math.abs(ee-me.at)<=D(L)){const Ce=x.find(st=>st.kind===me.kind&&(st.kind==="step"?st.index===me.index:st.id===me.id));return C(Ce,le,k)}const Te=xe.findIndex(Ce=>Ce.at>ee),ke=xe[Te-1],He=xe[Te],Ze=r==="linear"?(ee-ke.at)/(He.at-ke.at):Jr(ke.at,ee)/Jr(ke.at,He.at);return{...j,blend:Math.min(1,Math.max(0,Ze)),exact:!1}},O=L=>p.find(k=>Jx(k,{from:L.left,to:L.right})),$=(L,k="next")=>{const K=q(L,k),X=O(K);if(!X||K.exact)return K;const ee=Math.min(1,Math.max(0,(N(L)-K.start)/(K.end-K.start)));return{...K,blend:X.timing==="linear"?ee:Ko(ee)}},se=(L,k)=>{let K=k%e;K<0&&(K+=e);const X=k-K,ee=X+L.start/b*e,le=X+L.end/b*e;return{from:{kind:L.left.kind,id:L.left.id,pose:on(L.left.pose),time:ee},to:{kind:L.right.kind,id:L.right.id,pose:on(L.right.pose),time:le},startTime:ee,endTime:le,blend:L.blend}},Z=(L,k)=>{const K=h.find(ee=>Qx(ee,{from:L.left,to:L.right},k));if(!K)return null;const X=ee=>a?a(on(ee.pose),k):ee.pose.limbs[k].ankle;return{curve:K,position:Yx(X(L.left),X(L.right),K.bend,L.blend)}},ce=(L,k)=>{if(x.length===1)return on(x[0].pose);const K=v(x,k),X=k-K.start,ee=K.end-k,le=X<ee?K.left:K.right;return Math.min(X,ee)<=Math.min(D(L),(K.end-K.start)/2)?on(le.pose):T(K.left.pose,K.right.pose,y(K,k),L)};return{steps:on(g),period:e,keyframes:av(g),transitionAt(L){return P(L)},spanAt(L,k={}){if(!k||typeof k!="object"||Array.isArray(k))throw new TypeError("Span options must be an object.");const{prefer:K="next"}=k;if(K!=="previous"&&K!=="next")throw new TypeError("Span preference must be previous or next.");return se($(L,K),L)},guideAt(L,k={}){if(typeof k=="string"&&(k={prefer:k}),!k||typeof k!="object"||Array.isArray(k))throw new TypeError("Guide options must be an object.");const{prefer:K="next"}=k;if(K!=="previous"&&K!=="next")throw new TypeError("Guide preference must be previous or next.");const X=$(L,K),ee=O(X);return ee?{guide:on(ee),span:se(X,L)}:null},curveAt(L,k){if(!va.includes(k))throw new TypeError("Foot curve side must be left or right.");let K=$(L),X=Z(K,k);return!X&&K.exact&&(K=$(L,"previous"),X=Z(K,k)),X?{curve:on(X.curve),span:se(K,L),position:X.position}:null},stepAt(L){const{index:k,next:K,progress:X}=P(L);if(d.size){const ee=N(L),le=v(f.length?f:x,ee);return ee-le.start>=le.end-ee?le.right.index:le.left.index}return X>=.5?K:k},sample(L){const{index:k,next:K,progress:X}=P(L);if(d.has(k)||d.has(K))return ce(L,N(L));const ee=g[k].pose,le=g[K].pose;if(X===0)return on(ee);const j=_[k];if(j.length===2)return b===1?on(ee):T(ee,le,r==="linear"?X:Ko(X),L);const oe=j.reduce((He,Ze)=>Math.abs(X-Ze.at)<Math.abs(X-He.at)?Ze:He);if(Math.abs(X-oe.at)<=D(L))return on(oe.pose);const xe=j.findIndex(He=>He.at>X),me=j[xe-1],Te=j[xe],ke=r==="linear"?(X-me.at)/(Te.at-me.at):Jr(me.at,X)/Jr(me.at,Te.at);return T(me.pose,Te.pose,Math.min(1,Math.max(0,ke)),L)}}}const lo=1e-10,Jh=new A(0,1,0),mi=i=>new A().fromArray(i),Sc=i=>new qe().fromArray(i).normalize(),ya=(i,e,t)=>i*(1-t)+e*t;function da(i,e){const t=e.clone().addScaledVector(i,-e.dot(i));return t.lengthSq()<lo&&(t.copy(Math.abs(i.z)<.9?new A(0,0,1):Jh),t.addScaledVector(i,-t.dot(i))),t.normalize()}function Hd(i,e,t){const n=Math.max(-1,Math.min(1,i.dot(e)));if(n>1-lo)return new qe;const r=new A().crossVectors(i,e);return r.lengthSq()<lo&&r.crossVectors(i,da(i,t)),new qe().setFromAxisAngle(r.normalize(),Math.acos(n))}function Gd(i,e){return new qe().setFromRotationMatrix(new ot().makeBasis(e,new A().crossVectors(i,e).normalize(),i))}function lv(i,e,t,n,r){if(!(n>0&&r>0))return ya(i,e,t);const s=a=>Math.acos(Math.max(-1,Math.min(1,(a*a-n*n-r*r)/(2*n*r)))),o=ya(s(i),s(e),t);return Math.sqrt(Math.max(0,n*n+r*r+2*n*r*Math.cos(o)))}function js({startRoot:i,endRoot:e,currentRoot:t,startTarget:n,endTarget:r,currentTarget:s,startMiddle:o,endMiddle:a,startReference:l,endReference:c,currentReference:u,blend:d,upperLength:h,lowerLength:p,arc:g=!0,floorHeight:b=-1/0,side:m="left"}){const f=Sc(l),M=Sc(c),x=Sc(u),_=mi(i),D=mi(e),P=mi(t),T=mi(n).sub(_),N=mi(r).sub(D),v=T.clone().applyQuaternion(f.clone().invert()),y=N.clone().applyQuaternion(M.clone().invert()),C=v.length(),q=y.length();if(C<1e-8||q<1e-8)return{target:[...s],pole:mi(o).lerp(mi(a),d).toArray()};const O=v.clone().normalize(),$=y.clone().normalize(),se=mi(o).sub(_),Z=mi(a).sub(D),ce=da(T.clone().normalize(),se).applyQuaternion(f.clone().invert()),L=da(N.clone().normalize(),Z).applyQuaternion(M.clone().invert()),k=se.clone().applyQuaternion(f.clone().invert()),K=Z.clone().applyQuaternion(M.clone().invert()),X=new qe().slerp(Hd(O,$,ce),d),ee=lv(C,q,d,h,p),le=g?O.clone().applyQuaternion(X).multiplyScalar(ee).applyQuaternion(x):mi(s).sub(P);if(g&&Number.isFinite(b)&&P.y+le.y<b){const st=b-P.y;if(st<=ee){const F=Math.sqrt(Math.max(0,ee*ee-st*st)),Nt=new A(le.x,0,le.z);Nt.lengthSq()<lo&&(Nt.copy(O).applyQuaternion(x),Nt.y=0,Nt.lengthSq()<lo&&Nt.set(m==="left"?1:-1,0,0)),Nt.normalize().multiplyScalar(F),le.set(Nt.x,st,Nt.z)}else le.set(0,st,0)}const j=le.lengthSq()>1e-12?le.clone().normalize():Jh.clone().negate(),oe=j.clone().applyQuaternion(x.clone().invert()),xe=Gd(O,ce).slerp(Gd($,L),d),me=new A(0,0,1).applyQuaternion(xe),Te=new A(1,0,0).applyQuaternion(xe),ke=Te.applyQuaternion(Hd(me,oe,Te)),He=da(oe,ke).applyQuaternion(x),Ze=ya(k.dot(O),K.dot($),d),Ce=Math.max(1e-4,ya(k.clone().addScaledVector(O,-k.dot(O)).length(),K.clone().addScaledVector($,-K.dot($)).length(),d));return{target:P.clone().add(le).toArray(),pole:P.clone().addScaledVector(j,Ze).addScaledVector(He,Ce).toArray()}}const Lr=[.8,1.27],uv=[1/3,2/3],dv=i=>i*i*(3-2*i);function hv({model:i,meshes:e,skeletons:t,landmarks:n}){const r=Vd(i,"pelvis"),s=Vd(i,"torso");if(!r||!s||!n?.pelvis||!n?.torso)return null;const o=r.parent;i.updateMatrixWorld(!0);const a=r.matrixWorld.clone(),l=s.matrixWorld.clone(),c=a.clone().invert(),u=l.clone().invert(),d=new A(...n.pelvis).applyMatrix4(i.matrixWorld),h=new A(...n.torso).applyMatrix4(i.matrixWorld),p=uv.map((C,q)=>{const O=new Zl;O.name=q?"spineUpper":"spineLower",O.matrixAutoUpdate=!1,O.matrixWorldAutoUpdate=!1,o.add(O);const $=d.clone().lerp(h,C);return $.y=vt.lerp(Lr[0],Lr[1],C),{bone:O,share:C,pivot:$}}),g=new Map;for(const C of e){let q=g.get(C.skeleton);if(!q){const Z=C.skeleton,ce=a.clone().multiply(Z.boneInverses[Z.bones.indexOf(r)]);q=new Pa([...Z.bones,...p.map(L=>L.bone)],[...Z.boneInverses,...p.map(()=>ce.clone())]),g.set(Z,q)}const O=q.bones.indexOf(r),$=q.bones.indexOf(s),se=p.map(Z=>q.bones.indexOf(Z.bone));fv(C,[O,se[0],se[1],$]),C.bind(q,C.bindMatrix)}t.clear();for(const C of g.values())C.bones.length&&t.add(C);const b=new ot,m=new ot,f=new qe,M=new qe,x=new qe,_=new A,D=new A,P=new A,T=new A,N=new A,v=new ot;function y(){b.multiplyMatrices(r.matrixWorld,c),m.multiplyMatrices(s.matrixWorld,u),b.decompose(_,f,P),m.decompose(D,M,P);for(const{bone:C,share:q,pivot:O}of p)x.slerpQuaternions(f,M,q),T.copy(O).applyMatrix4(b),N.copy(O).applyMatrix4(m),T.lerp(N,q),v.makeRotationFromQuaternion(x),C.matrixWorld.makeTranslation(-O.x,-O.y,-O.z).premultiply(v),C.matrixWorld.elements[12]+=T.x,C.matrixWorld.elements[13]+=T.y,C.matrixWorld.elements[14]+=T.z}return y(),{update:y,helpers:p.map(C=>C.bone.name)}}function Vd(i,e){let t=null;return i.traverse(n=>{!t&&n.isBone&&n.name===e&&(t=n)}),t}function fv(i,e){const[t,,,n]=e,r=i.geometry,s=r.getAttribute("position"),o=r.getAttribute("skinIndex"),a=r.getAttribute("skinWeight");if(!s||!o||!a)return;const l=new A;let c=!1;for(let u=0;u<s.count;u++){if(i.getVertexPosition(u,l).applyMatrix4(i.matrixWorld),l.y<Lr[0]-.02||l.y>Lr[1]+.05)continue;let d=0;const h=[];for(let x=0;x<4;x++){const _=o.getComponent(u,x),D=a.getComponent(u,x);D<=0||(_===t||_===n?d+=D:h.push([_,D]))}if(d<.02)continue;const p=dv(vt.clamp((l.y-Lr[0])/(Lr[1]-Lr[0]),0,1))*3,g=Math.min(2,Math.floor(p)),b=p-g,m=[[e[g],d*(1-b)],[e[g+1],d*b]];h.sort((x,_)=>_[1]-x[1]);const f=[...m,...h].filter(x=>x[1]>1e-5).slice(0,4),M=f.reduce((x,_)=>x+_[1],0);for(let x=0;x<4;x++){const _=f[x];o.setComponent(u,x,_?_[0]:0),a.setComponent(u,x,_?_[1]/M:0)}c=!0}c&&(o.needsUpdate=!0,a.needsUpdate=!0)}const pv=9,mv=JSON.parse('[{"id":"flare-saved-09-rear","name":"后双撑 · 循环起点","phase":"rear","sourceStepId":"a998d382-0b7f-4ad3-b627-57f44e99561e","sourceStepNumber":9,"sourceStepName":"前双撑 · 开腿起点","sourcePreset":"flare-front-open","mirrored":true,"pose":{"version":1,"pelvis":[-0.029999999999999943,0.7875411999117483,-0.25],"bodyQuaternion":[0.8985343740226003,-0.007470351912587276,0.0006445605531121277,0.43883910158942024],"limbs":{"left":{"wrist":[0.215,0.03115682210638071,-8.326672684688674e-17],"elbowPole":[0.3679072,0.43590140665760185,0.17715781234977546],"ankle":[0.49486288804898193,0.40686809373231875,-0.7652272856350576],"kneePole":[0.2702140644338731,0.37378315689696334,-0.7127973660353976],"handQuaternion":[-0.014115609697670064,0.00967441866320057,-0.030224304035934627,0.9993966412951045],"footQuaternion":[0.501149601194387,-0.3339169438195634,0.18899898676280638,0.7756467848547703],"handLocked":true},"right":{"wrist":[-0.215,0.03113663464124783,0.1],"elbowPole":[-0.3679072,0.43590147865439804,0.17715799894147222],"ankle":[-0.5742504279789087,0.432309189823983,-0.7595179492198025],"kneePole":[-0.3509231115663002,0.38906846675917944,-0.7088646859581507],"handQuaternion":[-0.014115609697670064,-0.00967441866320057,0.030224304035934627,0.9993966412951045],"footQuaternion":[0.5058360746426133,0.3280672253476286,-0.2086002061921243,0.7700569558282452],"handLocked":true}},"groundLock":true,"pelvisQuaternion":[0.8986774439285762,-0.009315986729886845,-0.006751183447908846,0.4384592178154111]}},{"id":"flare-saved-10-left-transfer","name":"左侧移重 · 单手接重","phase":"sideA","sourceStepId":"6c5f9dec-c1bd-4f56-a3d8-81c75be93c7c","sourceStepNumber":10,"sourceStepName":"移重到右手 · 抬起左手","sourcePreset":null,"mirrored":false,"pose":{"version":1,"pelvis":[0.07007888106107946,0.7720626104730002,-0.23144189371099202],"bodyQuaternion":[0.6884117264809348,0.11040177881154879,0.4256823395806238,0.5767974409166106],"limbs":{"left":{"wrist":[0.25010189652088743,0.40476689807122906,0.4254073596363691],"elbowPole":[0.1979829028589189,0.6468147145769494,0.1695743416386411],"handQuaternion":[0.17350982369554666,-0.20884585815279677,-0.42524718689772656,0.8633901659441879],"ankle":[0.7926862748388714,1.1193371825281488,0.02680001526901879],"kneePole":[0.3616283684785114,1.2603983791051436,-0.14519721305129968],"footQuaternion":[0.37605521460570385,-0.4806383614070052,0.6894911510529526,0.3900912633365708],"handLocked":false},"right":{"wrist":[-0.21500000000000002,0.031189341132898618,0.1],"elbowPole":[-0.13184425020229218,0.3478909272549951,0.25290060337913167],"handQuaternion":[-0.014115609697670064,-0.00967441866320057,0.030224304035934627,0.9993966412951045],"ankle":[0.6018922580190487,0.2699931936992248,-0.5084342844878578],"kneePole":[0.4912872602276406,0.7407256279319921,-0.4700971459634683],"footQuaternion":[0.24650126182492982,-0.11415961691961395,0.3855988737729689,0.8817699350332276],"handLocked":true}},"groundLock":true,"pelvisQuaternion":[0.6884117264809348,0.11040177881154879,0.4256823395806238,0.5767974409166106]}},{"id":"flare-saved-11-left-support","name":"左侧单撑 · 高 V 开腿","phase":"sideA","sourceStepId":"24e0a3ba-d63d-486a-97f7-36f3100d28ef","sourceStepNumber":11,"sourceStepName":"右手单撑 · 高 V 开腿","sourcePreset":"flare-right-high-v","mirrored":false,"pose":{"version":1,"pelvis":[0.1903361328182514,0.7545844330974216,0.10069056676801744],"bodyQuaternion":[0.01190128902092805,0.009840940988734014,0.7461237406115414,0.6656281836700862],"limbs":{"left":{"wrist":[-0.08205568785866227,1.3192134842986976,0.05783298066135038],"elbowPole":[-0.1038368832172161,0.9652514281805494,0.25907342447150283],"handQuaternion":[-0.010637571712003226,0.15332075029523548,0.4980305488275511,0.8534314044089931],"ankle":[0.25070478047876693,1.5148527459255963,0.4509019187873464],"kneePole":[0.22270561091053936,1.318234604989236,0.008352961581929969],"footQuaternion":[-0.24504767067701202,-0.33643014189620246,0.9073613842252461,0.05883635896549819],"handLocked":false},"right":{"wrist":[-0.21500000000000002,0.031337200862919246,0.1],"elbowPole":[-0.3593795877380631,0.3556281924676706,0.21969045833840206],"handQuaternion":[-0.014115609697670064,-0.00967441866320057,0.030224304035934627,0.9993966412951045],"ankle":[0.5643167000574032,0.37000000000000005,0.7146731056126405],"kneePole":[0.46092973263258913,0.7987466594162334,0.5127333537768439],"footQuaternion":[-0.294194493164645,-0.3609348053999786,0.4421438388133155,0.7666058258596149],"handLocked":true}},"groundLock":true,"pelvisQuaternion":[0.01190128902092805,0.009840940988734014,0.7461237406115414,0.6656281836700862]}},{"id":"flare-saved-12-left-pass","name":"左侧换腿 · 接回前撑","phase":"sideA","sourceStepId":"4d22469f-bb80-4518-99e4-b611d4244a78","sourceStepNumber":12,"sourceStepName":"前方换腿 · 左手回撑","sourcePreset":"flare-front-pass","mirrored":false,"pose":{"version":1,"pelvis":[0.08080120998552665,0.6717401391645048,0.3300759020463073],"bodyQuaternion":[-0.5030282219657664,-0.18419941941207668,0.5023756857913568,0.678713379947587],"limbs":{"left":{"wrist":[0.3263099404048406,0.5503030997171975,-0.16654118679356797],"elbowPole":[0.005709472502696794,1.1087823544715194,-0.2920629230395969],"handQuaternion":[0.004090732578487741,0.11367232674478131,-0.3504979993357032,0.9296305828129088],"ankle":[0.1696009324348301,1.4388597936380656,0.6536559379409476],"kneePole":[-0.07048148640053131,1.239113916217521,0.6289599578779773],"footQuaternion":[0.7676218038380517,0.16807131531128494,-0.6100891390991674,-0.10148912057549417],"handLocked":false},"right":{"wrist":[-0.215,0.03139534160318602,0.1],"elbowPole":[-0.4121819284405803,0.4148261451148529,0.029550607614414443],"handQuaternion":[-0.014115609697670064,-0.00967441866320057,0.030224304035934627,0.9993966412951045],"ankle":[-0.36438471561797037,0.5683410998145629,1.0138897008702232],"kneePole":[-0.15267899085524128,0.8835641507980668,0.7120497754184677],"footQuaternion":[0.6711110431488149,0.540964207129817,-0.1472897106548494,-0.48504993093838167],"handLocked":true}},"groundLock":true,"pelvisQuaternion":[-0.5030282219657664,-0.18419941941207668,0.5023756857913568,0.678713379947587]}},{"id":"flare-saved-13-front","name":"前双撑 · 中间过渡","phase":"front","sourceStepId":"474fe57e-894b-4bb7-937e-698993abf67e","sourceStepNumber":13,"sourceStepName":"后双撑 · 抬髋开腿","sourcePreset":"flare-rear-open","mirrored":false,"pose":{"version":1,"pelvis":[0.0005147625624336676,0.5976163930301621,0.4542566030631731],"bodyQuaternion":[-0.7564131631953535,0,0,0.6540941266704661],"limbs":{"left":{"wrist":[0.215,0.031494584452709806,6.938893903907228e-18],"elbowPole":[0.3679072,0.6431900159999999,0.007709588000000031],"handQuaternion":[-0.014115609697670064,0.00967441866320057,-0.030224304035934627,0.9993966412951045],"ankle":[0.5921656864634581,1.1333667707622546,0.6929969677947478],"kneePole":[0.3371117184305408,1.1635426234507742,0.5542034891857168],"footQuaternion":[0.9019193641710003,-0.295289058482176,-0.27258807678697555,-0.15824529335075616],"handLocked":true},"right":{"wrist":[-0.215,0.03151863562964291,0.1],"elbowPole":[-0.3679072,0.64318996,0.00770977999999993],"handQuaternion":[-0.014115609697670064,-0.00967441866320057,0.030224304035934627,0.9993966412951045],"ankle":[-0.5911361626057233,1.1333667720871636,0.6929969682691859],"kneePole":[-0.33608219457280597,1.1635426247756833,0.5542034896601549],"footQuaternion":[0.9019193648820122,0.2952890574650434,0.2725880759374532,-0.1582452926596914],"handLocked":true}},"groundLock":true,"pelvisQuaternion":[-0.7564131631953535,0,0,0.6540941266704661]}},{"id":"flare-saved-14-right-pass","name":"右侧换腿 · 前撑转移","phase":"sideB","sourceStepId":"mirror-20261005-12-4d22469f-bb80-4518-99e4-b611d4244a78","sourceStepNumber":14,"sourceStepName":"右侧换腿 · 第12步镜像","sourcePreset":null,"mirrored":true,"pose":{"version":1,"pelvis":[-0.08080120998552665,0.6717401391645048,0.23007590204630735],"bodyQuaternion":[-0.5030282219657664,0.18419941941207668,-0.5023756857913568,0.678713379947587],"limbs":{"left":{"wrist":[0.215,0.03139534160318602,-5.551115123125783e-17],"elbowPole":[0.4121819284405803,0.4148261451148529,-0.07044939238558556],"ankle":[0.19113649346039305,0.5683410998145629,1.0047228478250085],"kneePole":[0.06328556334187835,0.8835641507980668,0.6589182871814792],"handQuaternion":[-0.014115609697670064,0.00967441866320057,-0.030224304035934627,0.9993966412951045],"footQuaternion":[-0.6457449068778082,0.4762301827326176,-0.23414204743752473,0.5489952913437353],"handLocked":true},"right":{"wrist":[-0.3263099404048406,0.5503030997171975,-0.266541186793568],"elbowPole":[-0.005709472502696794,1.1087823544715194,-0.39206292303959694],"ankle":[-0.1696009324348301,1.4388597936380654,0.5536559379409474],"kneePole":[0.07048148640053131,1.2391139162175209,0.5289599578779771],"handQuaternion":[0.004090662857153402,-0.11367252035892912,0.35049805429256764,0.9296305387248004],"footQuaternion":[0.7676218038380499,-0.1680713153112819,0.6100891390991705,-0.10148912057549579],"handLocked":false}},"groundLock":true,"pelvisQuaternion":[-0.5030282219657664,0.18419941941207668,-0.5023756857913568,0.678713379947587]}},{"id":"flare-saved-15-right-support","name":"右侧单撑 · 高 V 开腿","phase":"sideB","sourceStepId":"mirror-20261005-11-24e0a3ba-d63d-486a-97f7-36f3100d28ef","sourceStepNumber":15,"sourceStepName":"右侧单撑 · 第11步镜像","sourcePreset":null,"mirrored":true,"pose":{"version":1,"pelvis":[-0.1903361328182514,0.7545844330974216,0.0006905667680174282],"bodyQuaternion":[0.01190128902092805,-0.009840940988734014,-0.7461237406115414,0.6656281836700862],"limbs":{"left":{"wrist":[0.21500000000000002,0.031337200862919246,2.168404344971009e-19],"elbowPole":[0.3593795877380631,0.3556281924676706,0.11969045833840207],"ankle":[-0.7212292424837399,0.37000000000000005,0.5047556600532115],"kneePole":[-0.5667628569452158,0.7987466594162334,0.3385971088334001],"handQuaternion":[-0.014115609697670064,0.00967441866320057,-0.030224304035934627,0.9993966412951045],"footQuaternion":[-0.215261700594769,0.2785571897933545,-0.4875555274236323,0.7989730282995422],"handLocked":true},"right":{"wrist":[0.08205568785866227,1.3192134842986976,-0.04216701933864962],"elbowPole":[0.1038368832172161,0.9652514281805494,0.15907342447150283],"ankle":[-0.25070478047876693,1.5148527459255963,0.3509019187873464],"kneePole":[-0.22270561091053936,1.318234604989236,-0.09164703841807004],"handQuaternion":[-0.010637530420344477,-0.15332079687130243,-0.4980306961583427,0.8534313105794405],"footQuaternion":[0.24504767067701202,-0.33643014189620246,0.9073613842252461,-0.05883635896549819],"handLocked":false}},"groundLock":true,"pelvisQuaternion":[0.01190128902092805,-0.009840940988734014,-0.7461237406115414,0.6656281836700862]}},{"id":"flare-saved-16-right-transfer","name":"右侧移重 · 接回后撑","phase":"sideB","sourceStepId":"mirror-20261005-10-6c5f9dec-c1bd-4f56-a3d8-81c75be93c7c","sourceStepNumber":16,"sourceStepName":"右侧移重 · 第10步镜像","sourcePreset":null,"mirrored":true,"pose":{"version":1,"pelvis":[-0.07007888106107946,0.7720626104730002,-0.33144189371099203],"bodyQuaternion":[0.6884117264809348,-0.11040177881154879,-0.4256823395806238,0.5767974409166106],"limbs":{"left":{"wrist":[0.21500000000000002,0.031189341132898618,-1.1102230246251565e-16],"elbowPole":[0.13184425020229218,0.3478909272549951,0.15290060337913164],"ankle":[-0.2021544164567965,0.26999327318300526,-0.9891058341482438],"kneePole":[-0.16926419668416162,0.7407257330417467,-0.8767607806566532],"handQuaternion":[-0.014115609697670064,0.00967441866320057,-0.030224304035934627,0.9993966412951045],"footQuaternion":[0.4277125353770555,-0.18123110953002605,-0.18905342984813847,0.8651451165454856],"handLocked":true},"right":{"wrist":[-0.350382176937909,0.55,0.390798365196093],"elbowPole":[-0.1979829028589189,0.6468147145769494,0.06957434163864108],"ankle":[-0.7926863412523646,1.1193372104041521,-0.073199958231208],"kneePole":[-0.3616284348920045,1.260398406981147,-0.24519718655152647],"handQuaternion":[0.17351002724527126,0.20884616142195156,0.42524722271428583,0.8633900340393375],"footQuaternion":[-0.3760566309157787,-0.48063789237587945,0.6894914295083285,-0.39008998371056375],"handLocked":false}},"groundLock":true,"pelvisQuaternion":[0.6884117264809348,-0.11040177881154879,-0.4256823395806238,0.5767974409166106]}},{"id":"flare-saved-09-rear-repeat","name":"后双撑 · 接回起点","phase":"rear","sourceStepId":"a998d382-0b7f-4ad3-b627-57f44e99561e","sourceStepNumber":9,"sourceStepName":"前双撑 · 开腿起点","sourcePreset":"flare-front-open","mirrored":true,"pose":{"version":1,"pelvis":[-0.029999999999999943,0.7875411999117483,-0.25],"bodyQuaternion":[0.8985343740226003,-0.007470351912587276,0.0006445605531121277,0.43883910158942024],"limbs":{"left":{"wrist":[0.215,0.03115682210638071,-8.326672684688674e-17],"elbowPole":[0.3679072,0.43590140665760185,0.17715781234977546],"ankle":[0.49486288804898193,0.40686809373231875,-0.7652272856350576],"kneePole":[0.2702140644338731,0.37378315689696334,-0.7127973660353976],"handQuaternion":[-0.014115609697670064,0.00967441866320057,-0.030224304035934627,0.9993966412951045],"footQuaternion":[0.501149601194387,-0.3339169438195634,0.18899898676280638,0.7756467848547703],"handLocked":true},"right":{"wrist":[-0.215,0.03113663464124783,0.1],"elbowPole":[-0.3679072,0.43590147865439804,0.17715799894147222],"ankle":[-0.5742504279789087,0.432309189823983,-0.7595179492198025],"kneePole":[-0.3509231115663002,0.38906846675917944,-0.7088646859581507],"handQuaternion":[-0.014115609697670064,-0.00967441866320057,0.030224304035934627,0.9993966412951045],"footQuaternion":[0.5058360746426133,0.3280672253476286,-0.2086002061921243,0.7700569558282452],"handLocked":true}},"groundLock":true,"pelvisQuaternion":[0.8986774439285762,-0.009315986729886845,-0.006751183447908846,0.4384592178154111]}}]'),gv={period:pv,steps:mv},Pl=gv,bv=Math.PI*2,_v=new A(0,-1,0),xv=new A(0,0,1),Yo=["left","right"],$o=vt.degToRad,wc=i=>new A().fromArray(i);function Ll(i,e,t){return Math.max(i,e)+t*Math.log1p(Math.exp(-Math.abs(i-e)/t))}const vv=(i,e,t)=>-Ll(-i,-e,t);function Wd(i,e){const[t,n]=e==="left"?[.07,.42]:[.58,.93];if(i<=t||i>=n)return{locked:!0,lift:0,at:0};const r=(i-t)/(n-t);return{locked:!1,lift:64*r**3*(1-r)**3,at:r}}function yv({landmarks:i,groundHands:e,shoeOffsets:t,period:n=9}){if(!Number.isFinite(n)||n<=0)throw new Error("数学动画需要有效的循环时长。");const r=Object.fromEntries(Object.entries(i).map(([l,c])=>[l,wc(c)])),s=Object.fromEntries(Yo.map(l=>{const c=r[l+"Hip"].distanceTo(r[l+"Knee"]),u=r[l+"Knee"].distanceTo(r[l+"Ankle"]);return[l,{shoulderOffset:r[l+"Shoulder"].clone().sub(r.pelvis),hipOffset:r[l+"Hip"].clone().sub(r.pelvis),armReach:r[l+"Shoulder"].distanceTo(r[l+"Elbow"])+r[l+"Elbow"].distanceTo(r[l+"Wrist"])-.003,legReach:Math.sqrt(c**2+u**2+2*c*u*Math.cos($o(8))),groundWrist:wc(e[l].wrist),groundRotation:new qe().fromArray(e[l].handQuaternion),shoeCorners:t[l].map(wc)}]}));function o(l){const c=((Number.isFinite(l)?l:0)%n+n)%n/n,u=c*bv,d=Math.sin(u),h=Math.cos(u),p=new qe(.15+.75*h,.1*Math.sin(2*u),.576*d,.71825-.1805*h-.09875*Math.cos(2*u)).normalize(),g=new A(.22*d,0,.06-.34*h),b={},m={},f={},M=[];for(const D of Yo){const P=D==="left"?1:-1,T=s[D],N=T.shoulderOffset.clone().applyQuaternion(p),v=N.clone().add(g),y=Wd(c,D),C=T.groundWrist.clone();C.x+=y.lift*(v.x+P*.3-C.x),C.z+=y.lift*(v.z+.1-C.z),C.y+=.72*y.lift;const q=(v.x-C.x)**2+(v.z-C.z)**2;if(q>=T.armReach**2)throw new Error("数学轨迹超出手臂的水平可达范围。");M.push(C.y-N.y+Math.sqrt(T.armReach**2-q)),b[D]=v,m[D]=C,f[D]=y}g.y=vv(M[0],M[1],.012)-.003;const x=xv.clone().applyQuaternion(p),_={};for(const D of Yo){const P=D==="left"?1:-1,T=s[D],N=f[D],v=T.hipOffset.clone().applyQuaternion(p).add(g),y=b[D].clone();y.y+=g.y;const C=$o(48+P*36*d),q=$o(50+25*h+30*Math.cos(2*u)),O=new A(P*Math.sin(C),-Math.cos(C)*Math.cos(q),Math.cos(C)*Math.sin(q)),$=p.clone().multiply(new qe().setFromUnitVectors(_v,O)),se=O.clone().applyQuaternion(p);let Z=-1/0;for(const ee of T.shoeCorners){const le=-ee.clone().applyQuaternion($).y;Z=Number.isFinite(Z)?Ll(Z,le,.002):le}const ce=(.006+.012+Z-v.y)/T.legReach,L=Ll(se.y,ce,.012);if(Math.abs(L)>=.9999)throw new Error("数学轨迹无法保持脚底和真实腿长。");const k=Math.hypot(se.x,se.z);se.x*=Math.sqrt(1-L*L)/k,se.z*=Math.sqrt(1-L*L)/k,se.y=L;const K=v.clone().addScaledVector(se,T.legReach),X=new qe().setFromAxisAngle(new A(1,0,0),$o(-30)*N.lift).multiply(T.groundRotation);_[D]={wrist:m[D].toArray(),elbowPole:y.clone().add(new A(P*.18,-.05,-.5)).toArray(),handQuaternion:X.toArray(),handLocked:N.locked,ankle:K.toArray(),kneePole:v.clone().addScaledVector(x,.5).toArray(),footQuaternion:$.toArray()}}return{version:1,pelvis:g.toArray(),bodyQuaternion:p.toArray(),groundLock:!0,limbs:_}}function a(l){const c=((Number.isFinite(l)?l:0)%n+n)%n/n,u=Yo.filter(h=>Wd(c,h).locked),d=c<.07||c>=.93?"rear":c<.42?"right":c<=.58?"front":"left";return{phase:c,section:d,supportHands:u,period:n,kneeFlexionDegrees:8}}return{sample:o,describe:a,period:n}}const Mv=1e-12,Sv=new A(0,1,0),wv=new A(0,0,1),Ec=2*Math.PI,ef=i=>((i+Math.PI)%Ec+Ec)%Ec-Math.PI;function tf(i,e){const t=e.clone().addScaledVector(i,-e.dot(i));return t.lengthSq()<Mv&&(t.copy(Math.abs(i.z)<.9?wv:Sv),t.addScaledVector(i,-t.dot(i))),t.normalize()}function qd(i,e){const t=i.clone().normalize(),n=tf(t,e),r=new A().crossVectors(n,t).normalize();return new qe().setFromRotationMatrix(new ot().makeBasis(t,r,n))}function Ac(i,e,t,n){return qd(e,n).multiply(qd(i,t).invert()).normalize()}function Dl(i,e,t){const n=i.clone().invert().multiply(e),r=t.clone().normalize();return ef(2*Math.atan2(n.x*r.x+n.y*r.y+n.z*r.z,n.w))}function Ev({sourceAxis:i,sourceNormal:e,startAxis:t,endAxis:n,currentAxis:r,startNormal:s,endNormal:o,currentNormal:a,startRotation:l,endRotation:c,blend:u}){const d=Ac(i,t,e,s),h=Ac(i,n,e,o),p=Ac(i,r,e,a),g=Dl(d,l,i),b=Dl(h,c,i),m=g+ef(b-g)*u;return p.multiply(new qe().setFromAxisAngle(i.clone().normalize(),m)).normalize()}function Av({sourceAxis:i,currentAxis:e,startRotation:t,endRotation:n,startReference:r,endReference:s,currentReference:o,blend:a}){const l=r.clone().invert().multiply(t),c=s.clone().invert().multiply(n),u=o.clone().multiply(l.slerp(c,a)),d=i.clone().normalize().applyQuaternion(u);return new qe().setFromUnitVectors(d,e.clone().normalize()).multiply(u).normalize()}function Tv(i,e,t,n){if(!n)return t.clone();const r=e.clone().sub(i).normalize(),s=t.clone().sub(i),o=s.dot(r),a=tf(r,s).applyAxisAngle(r,n),l=Math.max(1e-4,s.clone().addScaledVector(r,-o).length());return i.clone().addScaledVector(r,o).addScaledVector(a,l)}const Et=["left","right"],ki=new A(0,1,0),Oi=new A(0,0,1),Rv=new A(1,1,1),Un=new qe,gi=.006,es=vt.clamp,Yt=i=>new A().fromArray(i);function Zo(i,e){const t=i.clone().normalize(),n=e.clone().addScaledVector(t,-e.dot(t)).normalize(),r=new A().crossVectors(t,n).normalize();return new qe().setFromRotationMatrix(new ot().makeBasis(r,t,n))}function nr(i,e,t=Un){const n=i.clone().normalize().applyQuaternion(t),r=e.clone().normalize();return new qe().setFromUnitVectors(n,r).multiply(t)}function jd(i,e,t,n){const r=(s,o)=>{const a=s.clone().normalize(),l=o.clone().normalize(),c=new A().crossVectors(l,a).normalize();return new qe().setFromRotationMatrix(new ot().makeBasis(a,c,l))};return r(e,n).multiply(r(i,t).invert()).normalize()}function Jo(i,e,t,n,r){const s=e.clone().sub(i),o=es(s.length(),Math.abs(t-n)+1e-7,t+n-1e-7),a=s.lengthSq()>1e-12?s.normalize():ki.clone().negate(),l=(t*t-n*n+o*o)/(2*o),c=Math.sqrt(Math.max(0,t*t-l*l)),u=r.clone().sub(i);return u.addScaledVector(a,-u.dot(a)),u.lengthSq()<1e-10&&(u.copy(Math.abs(a.z)<.9?Oi:ki),u.addScaledVector(a,-u.dot(a))),u.normalize(),{middle:i.clone().addScaledVector(a,l).addScaledVector(u,c),end:i.clone().addScaledVector(a,o)}}function Tc(i,e,t){if(i.isEmpty())return;const n=new A;for(let r=0;r<8;r++)n.set(r&1?i.max.x:i.min.x,r&2?i.max.y:i.min.y,r&4?i.max.z:i.min.z),t.expandByPoint(n.applyMatrix4(e))}function ar(i,e,t){if(!Array.isArray(i)||i.length!==e||Array.from(i).some(n=>typeof n!="number"||!Number.isFinite(n)))throw new Error(`${t}必须包含 ${e} 个有限数值。`);if(i.some(n=>Math.abs(n)>1e4))throw new Error(`${t}超出可编辑范围。`);return[...i]}function ts(i,e){const t=ar(i,4,e),n=Math.hypot(...t);if(n<1e-12)throw new Error(`${e}不能是零四元数。`);return new qe().fromArray(t.map(r=>r/n))}function Rc(i){if(!i||typeof i!="object"||i.version!==1)throw new Error("姿势文件版本无效，请使用版本 1 的姿势。");if(typeof i.groundLock!="boolean")throw new Error("姿势的地面锁定必须为 true 或 false。");const e={pelvis:Yt(ar(i.pelvis,3,"骨盆位置")),bodyQuaternion:ts(i.bodyQuaternion,"躯干方向"),groundLock:i.groundLock,limbs:{}};Object.hasOwn(i,"torsoQuaternion")&&(e.torsoQuaternion=ts(i.torsoQuaternion,"腰部方向")),Object.hasOwn(i,"pelvisQuaternion")&&(e.pelvisQuaternion=ts(i.pelvisQuaternion,"髋部方向"));for(const t of Et){const n=i.limbs?.[t],r=t==="left"?"左侧":"右侧";if(!n||typeof n.handLocked!="boolean")throw new Error(`${r}手掌锁定必须为 true 或 false。`);e.limbs[t]={wrist:Yt(ar(n.wrist,3,`${r}手腕位置`)),elbowPole:Yt(ar(n.elbowPole,3,`${r}肘部弯曲方向`)),handQuaternion:ts(n.handQuaternion,`${r}手掌方向`),ankle:Yt(ar(n.ankle,3,`${r}脚踝位置`)),kneePole:Yt(ar(n.kneePole,3,`${r}膝部弯曲方向`)),footQuaternion:ts(n.footQuaternion,`${r}脚掌方向`),handLocked:n.handLocked};for(const s of["elbowTwist","kneeTwist","upperArmTwist","thighTwist"])if(Object.hasOwn(n,s)){if(typeof n[s]!="number"||!Number.isFinite(n[s]))throw new Error(`${r}关节扭转需要有限角度。`);e.limbs[t][s]=n[s]}}return e}function Cv({model:i,rigData:e}){if(!i?.isObject3D)throw new Error("Snow motion requires a loaded model.");if(!e?.landmarks)throw new Error("Snow motion requires the accompanying coach-rig.json.");i.updateWorldMatrix(!0,!1),i.updateMatrixWorld(!0);const t=i.matrixWorld.clone().invert(),n=i.getWorldQuaternion(new qe).invert(),r=new Map,s=[],o=new Set;let a=null;i.traverse(E=>{E.isBone&&r.set(E.name,E),E.isSkinnedMesh&&(s.push(E),o.add(E.skeleton),E.frustumCulled=!1)}),typeof location<"u"&&new URLSearchParams(location.search).get("spine")==="off"||(a=hv({model:i,meshes:s,skeletons:o,landmarks:e.landmarks}));const l=new Map;for(const{name:E}of e.bones??[]){const I=r.get(E);if(!I)throw new Error(`Snow is missing its ${E} bone.`);if(I.parent?.isBone)throw new Error("Snow motion expects parallel deform bones under the armature.");l.set(E,{bone:I,rest:I.getWorldPosition(new A).applyMatrix4(t),restRotation:n.clone().multiply(I.getWorldQuaternion(new qe)),scale:I.scale.clone(),bounds:new an,target:new A,rotation:new qe,matrix:new ot})}if(l.size!==20||!s.length)throw new Error("Snow requires its 20 original deform bones and skinned meshes.");const c=Object.fromEntries(Object.entries(e.landmarks).map(([E,I])=>[E,Yt(I)])),u={left:[],right:[]},d={left:[],right:[]},h={left:new an,right:new an};let p=0;for(const E of o)E.update();const g=new A;for(const E of s){const I=/^Coach_(Sneakers|Soles|Shoe_Details)(?:_|$)/.test(E.name),H=E.geometry.getAttribute("position"),U=E.geometry.getAttribute("skinIndex"),W=E.geometry.getAttribute("skinWeight");if(!(!H||!U||!W)){p+=H.count;for(let V=0;V<H.count;V++){E.getVertexPosition(V,g).applyMatrix4(E.matrixWorld).applyMatrix4(t);for(let Y=0;Y<4;Y++){const J=W.getComponent(V,Y);if(J<=1e-7)continue;const ne=E.skeleton.bones[U.getComponent(V,Y)]?.name,Q=ne==="spineLower"||ne==="spineUpper"?"torso":ne;l.get(Q)?.bounds.expandByPoint(g);for(const ue of Et)Q===ue+"Hand"&&J>.7&&(u[ue].push(g.clone()),d[ue].push({mesh:E,index:V})),I&&Q===ue+"Foot"&&h[ue].expandByPoint(g)}}}}const b={};for(const E of Et){const I=E==="left"?1:-1,H=new A(I*.98253144,.05483374,.17783482).normalize(),U=new A(I*.06068526,-.99777448,-.02762938);U.addScaledVector(H,-U.dot(H)).normalize();const W=Zo(H,U);let V=-1/0,Y=.16;for(const ae of u[E]){const pe=ae.clone().sub(c[E+"Wrist"]);V=Math.max(V,pe.dot(U)),Y=Math.max(Y,pe.dot(H))}Number.isFinite(V)||(V=.025);const J=H.clone().multiplyScalar(es(Y*.3,.04,.075)).addScaledVector(U,V),ne=new A(I*.08,-.994,.08).normalize(),Q=new A(-I*.92,0,.38),ue=Zo(ne,Q).multiply(W.clone().invert());b[E]={upperArm:c[E+"Shoulder"].distanceTo(c[E+"Elbow"]),forearm:c[E+"Elbow"].distanceTo(c[E+"Wrist"]),thigh:c[E+"Hip"].distanceTo(c[E+"Knee"]),shin:c[E+"Knee"].distanceTo(c[E+"Ankle"]),armNormal:c[E+"Elbow"].clone().sub(c[E+"Shoulder"]).cross(c[E+"Wrist"].clone().sub(c[E+"Elbow"])),legNormal:c[E+"Knee"].clone().sub(c[E+"Hip"]).cross(c[E+"Ankle"].clone().sub(c[E+"Knee"])),anchor:new A(I*.215,gi,0),playAnchor:new A(I*.215,gi,0),palmOffset:J,neutralRotation:ue,support:!1,flight:0}}const m=new qe,f=new qe,M=new qe,x=c.pelvis.clone().lerp(c.torso,.3);let _=!1,D=!1;const P=new A(1,0,0),T=ki.clone(),N=Oi.clone(),v=c.pelvis.clone(),y={},C=new qe,q=new Map,O=new an,$=new an;let se=0,Z=Math.PI,ce="standing",L="skin",k=null,K=!0,X=null,ee=gi;const le=new Map,j=new WeakMap;let oe="arc",xe="smooth",me=[],Te=[],ke=[],He=[],Ze="saved",Ce=null,st=!1,F=Mc(Pl.steps,{period:Pl.period,mapTransition:re,resolveFootEndpoint:at}),Nt=!0,pt=[];const ct=E=>E.clone().sub(c.pelvis).applyQuaternion(m).add(v),Fe=E=>E.pelvisQuaternion??E.bodyQuaternion,Ut=E=>!E||E.x*E.x+E.y*E.y+E.z*E.z<1e-24,it=()=>Ut(M)?m.clone():m.clone().multiply(M);function R(E,I,H){return Ut(H)?E.clone().sub(c.pelvis).applyQuaternion(I):x.clone().sub(c.pelvis).applyQuaternion(I).add(E.clone().sub(x).applyQuaternion(I.clone().multiply(H)))}const S=E=>R(E,m,M).add(v);function te(E,I,H){const U=E.clone().invert().multiply(I),W=H.clone().normalize(),V=U.x*W.x+U.y*W.y+U.z*W.z;return((2*Math.atan2(V,U.w)+Math.PI)%(Math.PI*2)+Math.PI*2)%(Math.PI*2)-Math.PI}function ge(){i.updateWorldMatrix(!0,!1),i.updateMatrixWorld(!0),i.getWorldQuaternion(C),q.clear();for(const{bone:E}of l.values())q.has(E.parent)||q.set(E.parent,{inverse:E.parent.matrixWorld.clone().invert(),inverseRotation:E.parent.getWorldQuaternion(new qe).invert()})}function be(E,I,H){const U=l.get(E),W=q.get(U.bone.parent);U.target.copy(I),U.rotation.copy(H),U.bone.position.copy(I).applyMatrix4(i.matrixWorld).applyMatrix4(W.inverse),U.bone.quaternion.copy(W.inverseRotation).multiply(C).multiply(H).multiply(U.restRotation),U.bone.scale.copy(U.scale),U.bone.updateMatrix(),U.matrix.compose(I,H,Rv).multiply(new ot().makeTranslation(-U.rest.x,-U.rest.y,-U.rest.z))}function fe(){i.updateMatrixWorld(!0),a?.update();for(const E of o)E.update();ee=Math.min(Je("left"),Je("right")),K=!0}function Je(E){return $.makeEmpty(),Tc(h[E],l.get(E+"Foot").matrix,$),$.isEmpty()?y[E].ankle.y-c[E+"Ankle"].y:$.min.y}function Le(){be("pelvis",ct(c.pelvis),f);const E=it();for(const I of["torso","neck","head"])be(I,S(c[I]),E)}function Be(E,I,H,U,W,V){const Y=it(),J=U.clone().sub(H).cross(W.clone().sub(U)),ne=(Me,ye)=>st?jd(Me,ye,b[E].armNormal,J):nr(Me,ye,Y),Q=c[E+"Elbow"].clone().sub(c[E+"Shoulder"]),ue=ne(Q,U.clone().sub(H));I.upperArmTwist&&ue.multiply(new qe().setFromAxisAngle(Q.normalize(),I.upperArmTwist));const ae=c[E+"Wrist"].clone().sub(c[E+"Elbow"]),pe=ne(ae,W.clone().sub(U));I.elbowTwist&&pe.multiply(new qe().setFromAxisAngle(ae.normalize(),I.elbowTwist)),be(E+"Scapula",H,Y),be(E+"UpperArm",H,ue),be(E+"Forearm",U,pe),be(E+"Hand",W,V),Object.assign(I,{shoulder:H,elbow:U,wrist:W,palm:b[E].palmOffset.clone().applyQuaternion(V).add(W)})}function Ct(E,I,H,U,W,V){const Y=U.clone().sub(H).cross(W.clone().sub(U)),J=(pe,Me)=>st?jd(pe,Me,b[E].legNormal,Y):nr(pe,Me,f),ne=c[E+"Knee"].clone().sub(c[E+"Hip"]),Q=J(ne,U.clone().sub(H));I.thighTwist&&Q.multiply(new qe().setFromAxisAngle(ne.normalize(),I.thighTwist));const ue=c[E+"Ankle"].clone().sub(c[E+"Knee"]),ae=J(ue,W.clone().sub(U));I.kneeTwist&&ae.multiply(new qe().setFromAxisAngle(ue.normalize(),I.kneeTwist)),be(E+"Thigh",H,Q),be(E+"Patella",U,Q.clone().slerp(ae,.52)),be(E+"Shin",U,ae),be(E+"Foot",W,V),Object.assign(I,{hip:H,knee:U,ankle:W}),I.toe=new A(0,0,.18).applyQuaternion(V).add(W)}function we(){ce="standing",st=!1,Nt=!0,pt=[],se=0,Z=Math.PI,m.identity(),f.identity(),D=!1,M.identity(),_=!1,P.set(1,0,0),T.copy(ki),N.copy(Oi);const E=Math.min(...Et.map(I=>h[I].isEmpty()?0:h[I].min.y));v.copy(c.pelvis).addScaledVector(ki,gi-E),ge(),Le();for(const I of Et){const H=b[I],U=I==="left"?1:-1;H.support=!1,H.flight=0,H.anchor.copy(H.playAnchor);const W=y[I]={},V=ct(c[I+"Shoulder"]),Y=V.clone().addScaledVector(new A(U*.18,-.978,.06).normalize(),H.upperArm),J=Y.clone().addScaledVector(new A(U*.08,-.994,.08).normalize(),H.forearm);Be(I,W,V,Y,J,H.neutralRotation),Ct(I,W,ct(c[I+"Hip"]),ct(c[I+"Knee"]),ct(c[I+"Ankle"]),Un)}return fe(),X=du(),i}function ze(E=0){const I=((Number.isFinite(E)?E:0)%F.period+F.period)%F.period,H=!Ce&&ti();return Hn(Ce?Ce.sample(I):H?ie(I):F.sample(I),{alignBendPlanes:!!Ce,bodyOffset:H?U=>fi(I,U):0}),ce="flare",se=I,i}function et(E){const I=JSON.stringify(E);return le.has(I)||(le.size>=256&&le.clear(),le.set(I,Oe(E))),le.get(I)}function at(E,I){return et(E).solved[I].leg.end.toArray()}const Ge=typeof location<"u"&&new URLSearchParams(location.search).get("hip")==="linear",St=(E,I)=>E.pelvis.every((H,U)=>Math.abs(H-I.pelvis[U])<1e-9)&&E.bodyQuaternion.every((H,U)=>Math.abs(H-I.bodyQuaternion[U])<1e-9);function bt(E,I,H,U,W){const V=F?.steps;if(Ge||!V||V.length<4||!St(V[0].pose,V[V.length-1].pose))return null;const Y=V.length-1,J=V.findIndex(je=>St(je.pose,E));if(J<0||!St(V[(J+1)%V.length].pose,I))return null;const ne=et(V[(J-1+Y)%Y].pose).constrainedPelvis,Q=et(V[(J+2)%Y].pose).constrainedPelvis,ue=H.constrainedPelvis,ae=U.constrainedPelvis,pe=W,Me=pe*pe,ye=Me*pe;return new A(0,0,0).addScaledVector(ne,-.5*ye+Me-.5*pe).addScaledVector(ue,1.5*ye-2.5*Me+1).addScaledVector(ae,-1.5*ye+2*Me+.5*pe).addScaledVector(Q,.5*ye-.5*Me)}const Dt=gi+.06,B=gi+.12,De=.9985,de=.99993;function _e(E,I){for(const H of Et){const U=E.limbs[H],W=b[H];if(U.handLocked||U.wrist.y<=Dt)continue;const V=vt.smoothstep(U.wrist.y,Dt,B),Y=R(c[H+"Shoulder"],E.bodyQuaternion,E.torsoQuaternion).add(I),J=(W.upperArm+W.forearm)*De,ne=U.wrist.clone().sub(Y);if(ne.length()<1e-6||ne.length()>=J)continue;const Q=Y.clone().addScaledVector(ne.normalize(),J),ue=gi+.03;if(Q.y<ue){const ae=Y.y-ue,pe=new A(ne.x,0,ne.z);ae<J&&pe.lengthSq()>1e-8?Q.copy(Y).addScaledVector(pe.normalize(),Math.sqrt(J*J-ae*ae)).setY(ue):Q.y=ue}U.wrist.lerp(Q,V)}}const Ne=new WeakMap,Ie=new WeakMap;let ft=null;function $t(E,I,H,U=null){ft=U;try{return fn(E,I,H)}finally{ft=null}}function fn(E,I,H){if(!H?.size)return It(E,I);const U=[...H.keys()].map(V=>[V,E.limbs[V].wrist.clone(),E.limbs[V].handLocked]);for(const[V,Y]of H)E.limbs[V].wrist.copy(Y),E.limbs[V].handLocked=!0;const W=It(E,I);for(const[V,Y,J]of U)E.limbs[V].wrist.copy(Y),E.limbs[V].handLocked=J;return W}function It(E,I){let H=0;const U=[];for(const W of Et){const V=E.limbs[W].wrist,Y=b[W],J=Y.upperArm+Y.forearm-2e-5,ne=J*de,ue=R(c[W+"Shoulder"],E.bodyQuaternion,E.torsoQuaternion).add(I).clone().sub(V),ae=Math.hypot(ue.x,ue.z),pe=E.limbs[W].handLocked?1:Dn?1-vt.smoothstep(V.y,Dt,B+.05):ft?.[W]??0;pe>0&&U.push([pe,ae<J?Math.sqrt(J*J-ae*ae)-ue.y:0]);const Me=vt.clamp((B-V.y)/(B-Dt),0,1);Me<=0||ue.length()>=ne||ae>=ne||(H=Math.max(H,Me*(Math.sqrt(ne*ne-ae*ae)-ue.y)))}for(const[W,V]of U)H=Math.min(H,H+W*(Math.min(H,V)-H));return Math.max(0,H)}const Dn=typeof location<"u"&&new URLSearchParams(location.search).get("smooth")==="0"||globalThis.__COACH_SMOOTH_OFF===!0,Xn=E=>{const I=E*E,H=I*E;return[2*H-3*I+1,H-2*I+E,-2*H+3*I,H-I]};function Bn(E,I,H,U,W,V=!1,Y=!1){const[J,ne,Q,ue]=Xn(W),ae=V?new A:H.clone().sub(E).multiplyScalar(.5),pe=Y?new A:U.clone().sub(I).multiplyScalar(.5);return I.clone().multiplyScalar(J).addScaledVector(ae,ne).addScaledVector(H,Q).addScaledVector(pe,ue)}function mr(E,I,H,U,W,V=!1,Y=!1){const J=nt=>new mt().fromArray(nt),ne=J(I),Q=J(H),ue=J(E),ae=J(U);Q.dot(ne)<0&&Q.negate(),ue.dot(ne)<0&&ue.negate(),ae.dot(Q)<0&&ae.negate();const[pe,Me,ye,je]=Xn(W),Ae=V?new mt:Q.clone().sub(ue).multiplyScalar(.5),Ke=Y?new mt:ae.clone().sub(ne).multiplyScalar(.5);return ne.clone().multiplyScalar(pe).add(Ae.multiplyScalar(Me)).add(Q.clone().multiplyScalar(ye)).add(Ke.multiplyScalar(je)).normalize().toArray()}function ti(){const E=F?.steps;return!Dn&&!Ce&&E&&E.length>=5&&!me.length&&!Te.length&&!ke.length&&!He.length&&St(E[0].pose,E[E.length-1].pose)}const Us=.12,po=!0,mo=.03,Qi=[.003,.03],ni={right:.7},Ur=.85,go=.3,bo=.6,Ia=0,Fa=.75,Na=1.8,w=.55;function z(E,I){let H=1/0;const U=c[E+"Wrist"];for(let W=0;W<u[E].length;W+=3)H=Math.min(H,u[E][W].clone().sub(U).applyQuaternion(I).y);return Number.isFinite(H)?H:-.035}function ie(E){const I=F.steps,H=I.length-1,U=F.period/(H+1),W=(E%F.period+F.period)%F.period,V=W<=(H-1)*U?W/U:H-1+(W-(H-1)*U)/(2*U),Y=Math.min(H-1,Math.floor(V)),J=V-Y;let ne=J;const Q=he=>I[(he%H+H)%H].pose,ue=Q(Y-1),ae=Q(Y),pe=Q(Y+1),Me=Q(Y+2),ye=structuredClone(ae),je=he=>mr(ue[he]??ue.bodyQuaternion,ae[he]??ae.bodyQuaternion,pe[he]??pe.bodyQuaternion,Me[he]??Me.bodyQuaternion,ne);ye.bodyQuaternion=je("bodyQuaternion"),(ae.pelvisQuaternion||pe.pelvisQuaternion)&&(ye.pelvisQuaternion=je("pelvisQuaternion")),(ae.torsoQuaternion||pe.torsoQuaternion)&&(ye.torsoQuaternion=mr(...[ue,ae,pe,Me].map(he=>he.torsoQuaternion??[0,0,0,1]),ne));const Ae=[ue,ae,pe,Me].map(et);ye.pelvis=Bn(...Ae.map(he=>he.constrainedPelvis),ne).toArray();const Ke={},tt={},nt=new Map,ve={};for(const he of Et){const Re=[ue,ae,pe,Me].map(Tt=>Tt.limbs[he]),Ve=ye.limbs[he];let Wt=Re,Bt=Ae,Jt=J,nn=Re[1].handLocked,rn=Re[2].handLocked;const zt=ni[he]||0,wt=Tt=>(Tt%H+H)%H===H-1?2:1;if(zt&&rn&&!nn)Jt=J*wt(Y)/(wt(Y)+zt),tt[he]={nodes:Bt,t:Jt,mix:0};else if(zt&&nn&&!Re[0].handLocked&&J<zt){const Tt=[Q(Y-2),Q(Y-1),Q(Y),Q(Y+1)];Wt=Tt.map(bn=>bn.limbs[he]),Bt=Tt.map(et),Jt=(wt(Y-1)+J)/(wt(Y-1)+zt),nn=!1,rn=!0,tt[he]={nodes:Bt,t:Jt,mix:vt.smootherstep(J,0,zt)},nt.set(he,Bt[2].solved[he].arm.end.clone())}if(Ve.handLocked=nn&&rn,Re[1].handLocked&&!Re[2].handLocked&&(ve[he]=1-vt.smoothstep(J,0,Us)),Ve.handQuaternion=mr(...Wt.map(Tt=>Tt.handQuaternion),Jt,nn,rn),rn&&!nn){const Tt=vt.smoothstep(Jt,Ia,zt?w:Fa);Tt>0&&(Ve.handQuaternion=new qe().fromArray(Ve.handQuaternion).slerp(new qe().fromArray(Wt[2].handQuaternion),Tt).toArray())}if(Ve.footQuaternion=mr(...Re.map(Tt=>Tt.footQuaternion),J),Ve.wrist=Bn(...Bt.map(Tt=>Tt.solved[he].arm.end),Jt,nn,rn).toArray(),!Ve.handLocked){const Tt=mn=>mn.requested.bodyQuaternion.clone().multiply(mn.requested.torsoQuaternion??Un),bn=Bt.map(mn=>mn.solved[he].arm.end.clone().sub(mn.solved[he].shoulder).applyQuaternion(Tt(mn).invert())),Ri=Math.max(Bn(...bn.map(mn=>new A(mn.length(),0,0)),Jt).x,b[he].upperArm+b[he].forearm+.001),Gn=new qe().fromArray(ye.bodyQuaternion).multiply(ye.torsoQuaternion?new qe().fromArray(ye.torsoQuaternion):Un.clone()),En=R(c[he+"Shoulder"],new qe().fromArray(ye.bodyQuaternion),ye.torsoQuaternion?new qe().fromArray(ye.torsoQuaternion):void 0).add(new A().fromArray(ye.pelvis)),qt=Bn(...bn,Jt).setLength(Ri).applyQuaternion(Gn),Qn=En.clone().add(qt),Kn=new A().fromArray(Ve.wrist),pi=vt.smoothstep(Math.min(Kn.y,Qn.y),Dt,B+.1);if(Ve.wrist=Kn.clone().lerp(Qn,pi).toArray(),Ke[he]={local:qt,world:Kn,w:pi,shoulderS:En,t:Jt},rn){const mn=new qe().fromArray(Wt[2].handQuaternion);Ke[he].approach=!0,Ke[he].plantWrist=Bt[2].solved[he].arm.end.clone(),Ke[he].startWrist=Bt[1].solved[he].arm.end.clone(),Ke[he].plantLow=Bt[2].solved[he].arm.end.y+z(he,mn),Ke[he].startLow=Bt[1].solved[he].arm.end.y+z(he,new qe().fromArray(Wt[1].handQuaternion))}}Ve.elbowPole=Bn(...Wt.map(Tt=>new A().fromArray(Tt.elbowPole)),Jt).toArray(),Ve.kneePole=Bn(...Re.map(Tt=>new A().fromArray(Tt.kneePole)),J).toArray()}ne=J;const Xe=Rc(ye),lt=pn(Xe),Vt=$t(Xe,lt,nt,ve);Vt>0&&(lt.y+=Vt,Xe.pelvis.y+=Vt),ye.pelvis=lt.toArray();for(const he of Et){const Re=Ke[he];if(!Re)continue;const Ve=R(c[he+"Shoulder"],Xe.bodyQuaternion,Xe.torsoQuaternion).add(lt),Wt=Ve.clone().add(Re.local);if(ye.limbs[he].wrist=Re.world.clone().lerp(Wt,Re.w).toArray(),Re.approach){{const zt=new A().fromArray(ye.limbs[he].wrist),wt=vt.lerp(b[he].upperArm+b[he].forearm+.001,(ni[he]?Re.plantWrist:zt).distanceTo(Ve),vt.smootherstep(Re.t,ni[he]?.85:.6,1)),Tt=1-bo*vt.smootherstep(Re.t,0,1),bn=Re.plantWrist.clone().add(new A(zt.x-Re.plantWrist.x,0,zt.z-Re.plantWrist.z).multiplyScalar(Tt)),Ri=(bn.x-Ve.x)**2+(bn.z-Ve.z)**2;if(Ri<wt*wt&&(ye.limbs[he].wrist=bn.setY(Ve.y-Math.sqrt(wt*wt-Ri)).toArray()),ni[he]){const Gn=new A().fromArray(ye.limbs[he].wrist),En=Re.plantWrist,qt=Re.startWrist,Qn=vt.clamp(Re.t/Ur,0,1),Kn=(1-Qn)**3*(1+3*Qn),pi=vt.smoothstep(Re.t,0,go);let mn=vt.lerp(Gn.x,En.x+(qt.x-En.x)*Kn,pi),_r=vt.lerp(Gn.z,En.z+(qt.z-En.z)*Kn,pi),Ci=(mn-Ve.x)**2+(_r-Ve.z)**2,ka=Ci<wt*wt?Ve.y-Math.sqrt(wt*wt-Ci):Ve.y;const Ba=Qi?1-vt.smoothstep(vt.lerp(Gn.y,ka,pi)-En.y,Qi[0],Qi[1]):0;if(Ba>0&&(mn=vt.lerp(mn,En.x,Ba),_r=vt.lerp(_r,En.z,Ba),Ci=(mn-Ve.x)**2+(_r-Ve.z)**2,ka=Ci<wt*wt?Ve.y-Math.sqrt(wt*wt-Ci):Ve.y),ye.limbs[he].wrist=[mn,vt.lerp(Gn.y,ka,pi),_r],pi<1){const za=new A().fromArray(ye.limbs[he].wrist).sub(Ve);za.length()>1e-6&&za.length()<wt&&(ye.limbs[he].wrist=Ve.clone().add(za.setLength(wt)).toArray())}}}const Bt=Re.plantLow,Jt=new qe().fromArray(ye.limbs[he].handQuaternion),nn=ye.limbs[he].wrist[1]+z(he,Jt),rn=ni[he]?Bt:Bt+Math.max(0,Re.startLow-Bt)*Math.pow(1-Re.t,Na);if(nn<rn&&ni[he]&&po)ye.limbs[he].wrist[1]+=rn-nn;else if(nn<rn){const zt=new A().fromArray(ye.limbs[he].wrist),wt=zt.distanceTo(Ve),Tt=zt.y+rn-nn-Ve.y,bn=new A(zt.x-Ve.x,0,zt.z-Ve.z);Math.abs(Tt)<wt&&bn.lengthSq()>1e-10&&(ye.limbs[he].wrist=Ve.clone().addScaledVector(bn.normalize(),Math.sqrt(wt*wt-Tt*Tt)).setY(Ve.y+Tt).toArray())}}Xe.limbs[he].wrist.fromArray(ye.limbs[he].wrist)}const ht=Xe.bodyQuaternion.clone().multiply(Xe.torsoQuaternion??Un),_t=he=>he.requested.bodyQuaternion.clone().multiply(he.requested.torsoQuaternion??Un),[$e,xt]=[Ae[1],Ae[2]];for(const he of Et){const Re=b[he],Ve=$e.solved[he],Wt=xt.solved[he],Bt=qt=>qt.solved[he].leg.end.clone().sub(qt.solved[he].hip).applyQuaternion(Fe(qt.requested).clone().invert()),Jt=Ae.map(Bt),nn=Bn(...Jt.map(qt=>new A(qt.length(),0,0)),ne).x,rn=Fe(Xe),zt=c[he+"Hip"].clone().sub(c.pelvis).applyQuaternion(rn).add(lt),wt=zt.clone().add(Bn(...Jt,ne).setLength(nn).applyQuaternion(rn)),Tt=ye.groundLock?At(he,Xe.limbs[he].footQuaternion):-1/0;if(wt.y<Tt&&Tt-zt.y<=nn){const qt=Tt-zt.y,Qn=new A(wt.x-zt.x,0,wt.z-zt.z);Qn.lengthSq()>1e-10&&wt.copy(zt).addScaledVector(Qn.normalize(),Math.sqrt(nn*nn-qt*qt)).setY(Tt)}const bn=js({startRoot:Ve.hip.toArray(),endRoot:Wt.hip.toArray(),currentRoot:zt.toArray(),startTarget:Ve.leg.end.toArray(),endTarget:Wt.leg.end.toArray(),currentTarget:wt.toArray(),startMiddle:Ve.leg.middle.toArray(),endMiddle:Wt.leg.middle.toArray(),startReference:Fe($e.requested).toArray(),endReference:Fe(xt.requested).toArray(),currentReference:rn.toArray(),blend:ne,upperLength:Re.thigh,lowerLength:Re.shin,arc:!1,side:he}),Ri=(qt,Qn,Kn,pi,mn)=>{const _r=Ae.map(Ci=>Qn(Ci).clone().sub(qt(Ci)).applyQuaternion(Kn(Ci).clone().invert()));return mn.clone().add(Bn(..._r,ne).applyQuaternion(pi)).toArray()};ye.limbs[he].ankle=bn.target,ye.limbs[he].kneePole=Ri(qt=>qt.solved[he].hip,qt=>qt.requested.limbs[he].kneePole,qt=>Fe(qt.requested),rn,zt);const Gn=R(c[he+"Shoulder"],Xe.bodyQuaternion,Xe.torsoQuaternion).add(lt);js({startRoot:Ve.shoulder.toArray(),endRoot:Wt.shoulder.toArray(),currentRoot:Gn.toArray(),startTarget:Ve.arm.end.toArray(),endTarget:Wt.arm.end.toArray(),currentTarget:ye.limbs[he].wrist,startMiddle:Ve.arm.middle.toArray(),endMiddle:Wt.arm.middle.toArray(),startReference:_t($e).toArray(),endReference:_t(xt).toArray(),currentReference:ht.toArray(),blend:ne,upperLength:Re.upperArm,lowerLength:Re.forearm,arc:!1,side:he}),ye.limbs[he].elbowPole=Ri(qt=>qt.solved[he].shoulder,qt=>qt.requested.limbs[he].elbowPole,_t,ht,Gn);const En=tt[he];if(En){const qt=En.nodes.map(Kn=>Kn.requested.limbs[he].elbowPole.clone().sub(Kn.solved[he].shoulder).applyQuaternion(_t(Kn).clone().invert())),Qn=Gn.clone().add(Bn(...qt,En.t).applyQuaternion(ht));ye.limbs[he].elbowPole=Qn.lerp(new A().fromArray(ye.limbs[he].elbowPole),En.mix).toArray()}}return nt.size&&Ne.set(ye,nt),Object.keys(ve).length&&Ie.set(ye,ve),ye}function re(E,{start:I,end:H,blend:U}){const W=et(I),V=et(H);E.pelvis=(bt(I,H,W,V,U)??W.constrainedPelvis.clone().lerp(V.constrainedPelvis,U)).toArray();for(const ae of Et)E.limbs[ae].wrist=W.solved[ae].arm.end.clone().lerp(V.solved[ae].arm.end,U).toArray();const Y=Rc(E),J=pn(Y),ne=It(Y,J);if(ne>0){J.y+=ne,Y.pelvis.y+=ne;for(const ae of Et)for(const pe of["ankle","kneePole"])E.limbs[ae][pe]&&(E.limbs[ae][pe][1]+=ne)}E.pelvis=J.toArray();const Q=ae=>ae.requested.bodyQuaternion.clone().multiply(ae.requested.torsoQuaternion??Un).toArray(),ue=Y.bodyQuaternion.clone().multiply(Y.torsoQuaternion??Un);for(const ae of Et){const pe=b[ae],Me=W.solved[ae],ye=V.solved[ae],je=R(c[ae+"Shoulder"],Y.bodyQuaternion,Y.torsoQuaternion).add(J),Ae=js({startRoot:Me.shoulder.toArray(),endRoot:ye.shoulder.toArray(),currentRoot:je.toArray(),startTarget:Me.arm.end.toArray(),endTarget:ye.arm.end.toArray(),currentTarget:E.limbs[ae].wrist,startMiddle:Me.arm.middle.toArray(),endMiddle:ye.arm.middle.toArray(),startReference:Q(W),endReference:Q(V),currentReference:ue.toArray(),blend:U,upperLength:pe.upperArm,lowerLength:pe.forearm,arc:!E.limbs[ae].handLocked,side:ae});E.limbs[ae].wrist=Ae.target,E.limbs[ae].elbowPole=Ae.pole;const Ke=c[ae+"Hip"].clone().sub(c.pelvis).applyQuaternion(Fe(Y)).add(J),tt=E.groundLock?At(ae,Y.limbs[ae].footQuaternion):-1/0,nt=js({startRoot:Me.hip.toArray(),endRoot:ye.hip.toArray(),currentRoot:Ke.toArray(),startTarget:Me.leg.end.toArray(),endTarget:ye.leg.end.toArray(),currentTarget:E.limbs[ae].ankle,startMiddle:Me.leg.middle.toArray(),endMiddle:ye.leg.middle.toArray(),startReference:Fe(W.requested).toArray(),endReference:Fe(V.requested).toArray(),currentReference:Fe(Y).toArray(),blend:U,upperLength:pe.thigh,lowerLength:pe.shin,floorHeight:tt,side:ae});E.limbs[ae].ankle=nt.target,E.limbs[ae].kneePole=nt.pole}return E}function G(E){const{requested:I,solved:H}=E,U=I.bodyQuaternion.clone().multiply(I.torsoQuaternion??Un),W=Fe(I),V={pelvis:W.clone(),torso:U.clone(),neck:U.clone(),head:U.clone()};for(const Y of Et){const{source:J,shoulder:ne,arm:Q,hip:ue,leg:ae}=H[Y],pe=[["UpperArm","Shoulder","Elbow",Q.middle.clone().sub(ne),U,"upperArmTwist"],["Forearm","Elbow","Wrist",Q.end.clone().sub(Q.middle),U,"elbowTwist"],["Thigh","Hip","Knee",ae.middle.clone().sub(ue),W,"thighTwist"],["Shin","Knee","Ankle",ae.end.clone().sub(ae.middle),W,"kneeTwist"]];for(const[Me,ye,je,Ae,Ke,tt]of pe){const nt=c[Y+je].clone().sub(c[Y+ye]),ve=nr(nt,Ae,Ke);J[tt]&&ve.multiply(new qe().setFromAxisAngle(nt.normalize(),J[tt])),V[Y+Me]=ve}V[Y+"Scapula"]=U.clone(),V[Y+"Patella"]=V[Y+"Thigh"].clone().slerp(V[Y+"Shin"],.52),V[Y+"Hand"]=J.handQuaternion.clone(),V[Y+"Foot"]=J.footQuaternion.clone()}return V}function Ee(E,{start:I,end:H,blend:U,guide:W}){const V=structuredClone(E),Y=Oe(E),J=ev(U),ne=et(I),Q=et(H),ue={},ae=[],pe=ve=>Yt(W.bends?.[ve]??[0,0,0]).multiplyScalar(J),Me=(ve,Xe)=>Xe==="pelvis"?ve.constrainedPelvis:ve.solved[Xe.startsWith("left")?"left":"right"][Xe.endsWith("Wrist")?"arm":"leg"].end,ye=ve=>W.orbitPaths?.[ve]?iv(Me(ne,ve).toArray(),Me(Q,ve).toArray(),W.orbitPaths[ve],U):W.smoothPaths?.[ve]?tv(Me(ne,ve).toArray(),Me(Q,ve).toArray(),W.smoothPaths[ve].bend,U):Me(Y,ve).clone().add(pe(ve)).toArray();ue.pelvis=ye("pelvis"),V.pelvis=[...ue.pelvis];for(const ve of Et){const Xe=V.limbs[ve];ne.requested.limbs[ve].handLocked&&Q.requested.limbs[ve].handLocked?(Xe.wrist=ne.solved[ve].arm.end.clone().lerp(Q.solved[ve].arm.end,U).toArray(),(W.orbitPaths?.[ve+"Wrist"]||W.smoothPaths?.[ve+"Wrist"]||pe(ve+"Wrist").lengthSq()>1e-16)&&ae.push(`${ve==="left"?"左":"右"}手在两端均为支撑手，腕部路线偏移已忽略。`)):(ue[ve+"Wrist"]=ye(ve+"Wrist"),Xe.wrist=[...ue[ve+"Wrist"]]),ue[ve+"Ankle"]=ye(ve+"Ankle"),Xe.ankle=[...ue[ve+"Ankle"]]}const je=Oe(V);V.pelvis=je.constrainedPelvis.toArray();const Ae=ve=>ve.requested.bodyQuaternion.clone().multiply(ve.requested.torsoQuaternion??Un);for(const ve of Et){const Xe=b[ve],lt=ne.solved[ve],Vt=Q.solved[ve],ht=je.solved[ve],_t=V.limbs[ve];for(const $e of[!0,!1]){const xt=$e?ht.shoulder:ht.hip,he=$e?ht.arm.end:ht.leg.end,Re=$e?lt.arm:lt.leg,Ve=$e?Vt.arm:Vt.leg,Wt=js({startRoot:($e?lt.shoulder:lt.hip).toArray(),endRoot:($e?Vt.shoulder:Vt.hip).toArray(),currentRoot:xt.toArray(),startTarget:Re.end.toArray(),endTarget:Ve.end.toArray(),currentTarget:he.toArray(),startMiddle:Re.middle.toArray(),endMiddle:Ve.middle.toArray(),startReference:($e?Ae(ne):Fe(ne.requested)).toArray(),endReference:($e?Ae(Q):Fe(Q.requested)).toArray(),currentReference:($e?Ae(je):Fe(je.requested)).toArray(),blend:U,upperLength:$e?Xe.upperArm:Xe.thigh,lowerLength:$e?Xe.forearm:Xe.shin,arc:!1,side:ve}),Bt=(W.bendAngles?.[ve+($e?"Elbow":"Knee")]??0)*J;_t[$e?"wrist":"ankle"]=he.toArray(),_t[$e?"elbowPole":"kneePole"]=Tv(xt,he,Yt(Wt.pole),Bt).toArray()}}const Ke=Oe(V),tt=G(ne),nt=G(Q);for(const ve of Et){const Xe=ne.solved[ve],lt=Q.solved[ve],Vt=Ke.solved[ve];for(const ht of[!0,!1]){const _t=Re=>ht?Re.shoulder:Re.hip,$e=Re=>ht?Re.arm:Re.leg,xt=Re=>$e(Re).middle.clone().sub(_t(Re)).cross($e(Re).end.clone().sub($e(Re).middle)),he=ht?b[ve].armNormal:b[ve].legNormal;for(const Re of[!1,!0]){const Ve=ve+(ht?Re?"Forearm":"UpperArm":Re?"Shin":"Thigh"),Wt=ht?Re?"elbowTwist":"upperArmTwist":Re?"kneeTwist":"thighTwist",Bt=c[ve+(ht?Re?"Wrist":"Elbow":Re?"Ankle":"Knee")].clone().sub(c[ve+(ht?Re?"Elbow":"Shoulder":Re?"Knee":"Hip")]),Jt=wt=>Re?$e(wt).end.clone().sub($e(wt).middle):$e(wt).middle.clone().sub(_t(wt)),nn=ht?Ev({sourceAxis:Bt,sourceNormal:he,startAxis:Jt(Xe),endAxis:Jt(lt),currentAxis:Jt(Vt),startNormal:xt(Xe),endNormal:xt(lt),currentNormal:xt(Vt),startRotation:tt[Ve],endRotation:nt[Ve],blend:U}):Av({sourceAxis:Bt,currentAxis:Jt(Vt),startRotation:tt[Ve],endRotation:nt[Ve],startReference:Fe(ne.requested),endReference:Fe(Q.requested),currentReference:Fe(Ke.requested),blend:U}),rn=ht?Ae(Ke):Fe(Ke.requested),zt=nr(Bt,Jt(Vt),rn);V.limbs[ve][Wt]=Dl(zt,nn,Bt)}}}return j.set(V,{targets:ue,warnings:[...new Set([...je.warnings,...Ke.warnings,...ae])]}),V}function Ue(E,I={}){const H=I.legPath==="linear"?"linear":"arc",U=Mc(E,{...I,mapTransition:H==="arc"?re:void 0,resolveFootEndpoint:at,mapGuidedTransition:Ee});if(I.segmentGuides?.some(Q=>Object.keys(Q.orbitPaths??{}).length)){const Q=[...new Set([...E.map((ue,ae)=>ae*U.period/E.length),...(I.corrections??[]).map(ue=>(ue.segment+ue.at)*U.period/E.length)])].sort((ue,ae)=>ue-ae);for(let ue=0;ue<Q.length;ue++){const ae=(Q[ue]+(Q[ue+1]??U.period))/2,pe=U.guideAt(ae);pe&&Object.keys(pe.guide.orbitPaths??{}).length&&U.sample(ae)}}const W=I.motionModel==="periodic"?yv({landmarks:e.landmarks,period:U.period,groundHands:Object.fromEntries(Et.map(Q=>[Q,kt(Q,[0,0,1])])),shoeOffsets:Object.fromEntries(Et.map(Q=>[Q,Array.from({length:8},(ue,ae)=>{const pe=h[Q];return new A(ae&1?pe.max.x:pe.min.x,ae&2?pe.max.y:pe.min.y,ae&4?pe.max.z:pe.min.z).sub(c[Q+"Ankle"]).toArray()})]))}):null;if(W)for(let Q=0;Q<180;Q++)Oe(W.sample(Q*U.period/180));const V=structuredClone(I.corrections??[]),Y=structuredClone(I.skippedSteps??[]),J=structuredClone(I.footCurves??[]),ne=structuredClone(I.segmentGuides??[]);F=U,me=V,Te=Y,ke=J,He=ne,Ce=W,Ze=W?"periodic":"saved",le.clear(),oe=H,xe=I.interpolation??"smooth",ce==="flare"&&ze(se)}function Qe(E={}){if(!E||typeof E!="object"||Array.isArray(E))throw new Error("动画采样选项需要为对象。");const I=E.legPath??oe;if(!["arc","linear"].includes(I))throw new Error("未知的轨迹路线。");return["steps","corrections","legPath","interpolation","skippedSteps","footCurves","segmentGuides"].some(U=>E[U]!==void 0)?Mc(E.steps??F.steps,{period:E.period??F.period,corrections:E.corrections??me,skippedSteps:E.skippedSteps??Te,footCurves:E.footCurves??ke,resolveFootEndpoint:at,segmentGuides:E.segmentGuides??He,mapGuidedTransition:Ee,interpolation:E.interpolation??xe,mapTransition:I==="arc"?re:void 0}):F}function Ye(E,I={}){if(!Number.isFinite(E))throw new Error("动画采样时间需要为有限数值。");return!Object.keys(I).length&&ti()?ie(E):Qe(I).sample(E)}function dt(E,I={}){return typeof I=="string"?F.guideAt(E,I):Qe(I).guideAt(E,{prefer:I.prefer??"next"})}function gt(E={}){const{startTime:I,endTime:H,samples:U=64,includeTimes:W=[]}=E;if(!Number.isFinite(I)||!Number.isFinite(H)||H<I)throw new Error("轨迹起止时间需要有限数值，结束时间不能早于开始时间。");if(!Number.isInteger(U)||U<2||U>512)throw new Error("轨迹采样数量需要为 2–512 的整数。");if(!Array.isArray(W)||W.some(Q=>!Number.isFinite(Q)||Q<I||Q>H))throw new Error("额外关键帧时间必须位于轨迹区间内。");const V=Qe(E),Y=Array.from({length:U},(Q,ue)=>ue===U-1?H:I+(H-I)*ue/(U-1)),ne=(W.length&&H>I?[...new Set([...Y,...W])].sort((Q,ue)=>Q-ue):Y).map(Q=>{const ue=V.sample(Q),ae=Oe(ue),{requested:pe,constrainedPelvis:Me,solved:ye}=ae,je=ve=>R(c[ve],pe.bodyQuaternion,pe.torsoQuaternion).add(Me).toArray(),Ae={pelvis:Me.toArray(),waist:x.clone().sub(c.pelvis).applyQuaternion(pe.bodyQuaternion).add(Me).toArray(),shoulderCenter:je("torso"),neck:je("neck"),head:je("head")};for(const ve of Et){const{source:Xe,shoulder:lt,arm:Vt,hip:ht,leg:_t}=ye[ve],$e={shoulder:lt,elbow:Vt.middle,wrist:Vt.end,palm:b[ve].palmOffset.clone().applyQuaternion(Xe.handQuaternion).add(Vt.end),hip:ht,knee:_t.middle,ankle:_t.end,toe:new A(0,0,.18).applyQuaternion(Xe.footQuaternion).add(_t.end)};for(const[xt,he]of Object.entries($e))Ae[ve+xt[0].toUpperCase()+xt.slice(1)]=he.toArray()}const Ke={};for(const ve of Et){const Xe=V.curveAt(Q,ve);Xe&&(Ke[ve]=Xe.position)}const tt=j.get(ue),nt=tt?{warnings:[...new Set([...tt.warnings,...ae.warnings])],goalErrors:Object.fromEntries(Object.entries(tt.targets).map(([ve,Xe])=>[ve,Yt(Ae[ve]).distanceTo(Yt(Xe))]))}:null;return{time:Q,joints:Ae,...Object.keys(Ke).length?{curveTargets:Ke}:{},...tt?{guideTargets:structuredClone(tt.targets),diagnostics:nt}:{},...E.includeBoneRotations?{boneRotations:Object.fromEntries(Object.entries(G(ae)).map(([ve,Xe])=>[ve,Xe.toArray()]))}:{}}});return{startTime:I,endTime:H,frames:ne}}function We(){return{version:1,pelvis:v.toArray(),bodyQuaternion:m.toArray(),...D?{pelvisQuaternion:f.toArray()}:{},..._?{torsoQuaternion:M.toArray()}:{},limbs:Object.fromEntries(Et.map(E=>[E,{wrist:y[E].wrist.toArray(),elbowPole:(y[E].elbowPole??y[E].elbow).toArray(),handQuaternion:l.get(E+"Hand").rotation.toArray(),ankle:y[E].ankle.toArray(),kneePole:(y[E].kneePole??y[E].knee).toArray(),footQuaternion:l.get(E+"Foot").rotation.toArray(),handLocked:b[E].support,...Object.fromEntries(["elbowTwist","kneeTwist","upperArmTwist","thighTwist"].filter(I=>y[E][I]!==void 0).map(I=>[I,y[E][I]]))}])),groundLock:Nt}}function At(E,I){const H=new an,U=c[E+"Ankle"],W=new ot().makeRotationFromQuaternion(I).multiply(new ot().makeTranslation(-U.x,-U.y,-U.z));return Tc(h[E],W,H),gi-(H.isEmpty()?-U.y:H.min.y)}function kt(E,I,H){if(!Et.includes(E))throw new Error("未知的支撑手。");const U=E==="left"?1:-1,W=new A(U*.98253144,.05483374,.17783482),V=new A(U*.06068526,-.99777448,-.02762938),Y=Yt(I);if(Y.y=0,Y.lengthSq()<1e-8)throw new Error("手指方向需要有水平分量。");Y.normalize();const J=Zo(Y,ki.clone().negate()).multiply(Zo(W,V).invert());let ne=1/0;for(const ue of u[E])ne=Math.min(ne,ue.clone().sub(c[E+"Wrist"]).applyQuaternion(J).y);const Q=H?Yt(H):new A(U*.215,0,0);return Q.y=gi-(Number.isFinite(ne)?ne:-.035),{wrist:Q.toArray(),handQuaternion:J.toArray(),fingerDirection:Y.toArray()}}function Kt(){let E=We();const I=new A;for(let H=0;H<8;H++){const U=i.matrixWorld.clone().invert();let W=!1;for(const V of Et){if(!E.limbs[V].handLocked)continue;let Y=1/0;for(const{mesh:ne,index:Q}of d[V])ne.getVertexPosition(Q,I).applyMatrix4(ne.matrixWorld).applyMatrix4(U),Y=Math.min(Y,I.y);const J=gi-Y;Number.isFinite(J)&&Math.abs(J)>1e-7&&(E.limbs[V].wrist[1]+=J,W=!0)}if(!W)break;E=Hn(E)}return We()}function pn(E){const I=E.pelvis.clone(),H=[];let U=-1/0;for(const W of Et){const V=E.limbs[W],Y=b[W],J=R(c[W+"Shoulder"],E.bodyQuaternion,E.torsoQuaternion);if(V.handLocked&&H.push({center:V.wrist.clone().sub(J),maximum:Y.upperArm+Y.forearm-1e-5,minimum:Math.abs(Y.upperArm-Y.forearm)+1e-5,side:W}),E.groundLock){const ne=c[W+"Hip"].clone().sub(c.pelvis).applyQuaternion(Fe(E));U=Math.max(U,At(W,V.footQuaternion)-(Y.thigh+Y.shin-1e-5)-ne.y)}}if(H.length===2&&H[0].center.distanceTo(H[1].center)>H[0].maximum+H[1].maximum)throw new Error("双手锁定的位置相隔过远，原始手臂长度无法同时到达。请先解锁一只手或缩短双手间距。");for(let W=0;W<96;W++){for(const Y of H){const J=I.clone().sub(Y.center),ne=J.length();ne>Y.maximum?I.copy(Y.center).addScaledVector(J,Y.maximum/ne):ne<Y.minimum&&(ne<1e-10?J.copy(ki):J.multiplyScalar(1/ne),I.copy(Y.center).addScaledVector(J,Y.minimum))}if(I.y=Math.max(I.y,U),H.every(Y=>{const J=I.distanceTo(Y.center);return J<=Y.maximum+1e-7&&J>=Y.minimum-1e-7}))return I}throw new Error("此躯干方向无法同时保持锁定手掌和脚底高度。请先解锁手掌或调整脚掌方向。")}function Ft(E,I,H,U){const W=b[H],V=W.thigh+W.shin-1e-7,Y=Math.abs(W.thigh-W.shin)+1e-7,J=I.clone();Number.isFinite(U)&&(J.y=Math.max(J.y,U));const ne=J.clone().sub(E),Q=ne.length();if(Q>V&&J.copy(E).addScaledVector(ne,V/Q),Number.isFinite(U)&&J.y<U){const ue=U-E.y,ae=Math.sqrt(Math.max(0,V*V-ue*ue)),pe=I.x-E.x,Me=I.z-E.z,ye=Math.hypot(pe,Me),je=ye>ae&&ye>0?ae/ye:1;J.set(E.x+pe*je,U,E.z+Me*je)}return J.distanceTo(E)<Y&&J.copy(E).addScaledVector(ki,Y),J}function Oe(E){const I=Rc(E),H=pn(I),U=$t(I,H,Ne.get(E),Ie.get(E));if(U>0){H.y+=U,I.pelvis.y+=U;for(const J of Et)I.limbs[J].ankle.y+=U,I.limbs[J].kneePole&&(I.limbs[J].kneePole.y+=U)}_e(I,H);const W=[],V={},Y=J=>c[J].clone().sub(c.pelvis).applyQuaternion(Fe(I)).add(H);H.distanceTo(I.pelvis)>1e-5&&W.push("躯干位置已限制，以保持锁定手掌、真实骨长和地面高度。");for(const J of Et){const ne=I.limbs[J],Q=b[J],ue=J==="left"?"左":"右",ae=R(c[J+"Shoulder"],I.bodyQuaternion,I.torsoQuaternion).add(H);if(ne.handLocked||ne.wrist.y<=Dt){const Ke=ae.clone().sub(ne.wrist),tt=Ke.length(),nt=(Q.upperArm+Q.forearm)*de;tt>1e-6&&tt<nt-1e-4&&ae.copy(ne.wrist).addScaledVector(Ke,Math.min(nt,tt+mo)/tt)}const pe=Jo(ae,ne.wrist,Q.upperArm,Q.forearm,ne.elbowPole);if(ne.handLocked&&pe.end.distanceTo(ne.wrist)>1e-5)throw new Error(`${ue}手锁定位置无法到达，请先解锁手掌。`);pe.end.distanceTo(ne.wrist)>1e-5&&W.push(`${ue}手腕已限制在原始手臂能够到达的位置。`);const Me=Y(J+"Hip"),ye=I.groundLock?At(J,ne.footQuaternion):-1/0,je=Ft(Me,ne.ankle,J,ye),Ae=Jo(Me,je,Q.thigh,Q.shin,ne.kneePole);Ae.end.distanceTo(ne.ankle)>1e-5&&W.push(`${ue}脚踝已按真实腿长${I.groundLock?"和地面高度":""}限制。`),V[J]={source:ne,shoulder:ae,arm:pe,hip:Me,leg:Ae}}return{requested:I,constrainedPelvis:H,warnings:W,solved:V}}const zn=.22,Lt=.9,In=1.2,Ki=.3,tn=.02,gr=.015,Ot=.85,Fn=1.15,br=!0;let Mn=null;function fi(E,I=null){const H=F?.steps,U=H?H.length-1:0;if(!U||!Object.keys(ni).length)return 0;if(Mn?.sequence!==F){const V=F.period,Y=V/(U+1),J=[];for(const Q of Et)for(let ue=0;ue<U;ue++)H[ue].pose.limbs[Q].handLocked&&!H[(ue-1+U)%U].pose.limbs[Q].handLocked&&J.push({center:ue*Y,mono:Q in ni});const ne=J.map(({center:Q,mono:ue})=>{const ae=Q-Math.max(Lt,Ot)-3*zn,pe=Math.ceil((Math.max(Lt,Ot)+Math.max(In,Fn)+6*zn)/tn)+1,Me=Array.from({length:pe},(je,Ae)=>Oe(ie(ae+Ae*tn)).constrainedPelvis.y);if(ue){const je=$e=>($e-ae)/tn,Ae=Math.round(je(Q-Ot)),Ke=Math.round(je(Q+Fn)),tt=$e=>(Me[$e+1]-Me[$e-1])/(2*tn),nt=(Ke-Ae)*tn,ve=Me[Ae],Xe=Me[Ke],lt=tt(Ae)*nt,Vt=tt(Ke)*nt,ht=Me.map(($e,xt)=>{if(xt<=Ae||xt>=Ke)return 0;const he=(xt-Ae)/(Ke-Ae),Re=he*he,Ve=Re*he;return(2*Ve-3*Re+1)*ve+(Ve-2*Re+he)*lt+(-2*Ve+3*Re)*Xe+(Ve-Re)*Vt-$e}),_t={t0:ae+Ae*tn,span:nt,y0:ve,y1:Xe,m0:lt,m1:Vt};return{center:Q,from:ae,offset:ht,period:V,before:Ot,after:Fn,edge:0,ease:_t}}let ye=null;for(let je=zn;je>.03;je*=.85){const Ae=Math.ceil(3*je/tn),Ke=Array.from({length:2*Ae+1},(tt,nt)=>Math.exp(-.5*((nt-Ae)*tn/je)**2));if(ye=Me.map((tt,nt)=>{if(nt<Ae||nt>=pe-Ae)return 0;let ve=0,Xe=0;for(let lt=-Ae;lt<=Ae;lt++)ve+=Me[nt+lt]*Ke[lt+Ae],Xe+=Ke[lt+Ae];return ve/Xe-tt}),Math.max(...ye.map(Math.abs))<=gr)break}return{center:Q,from:ae,offset:ye,period:V,before:Lt,after:In,edge:Ki}});Mn={sequence:F,tables:ne}}let W=0;for(const{center:V,from:Y,offset:J,period:ne,before:Q,after:ue,edge:ae,ease:pe}of Mn.tables){let Me=E-V;if(Me-=Math.round(Me/ne)*ne,Me<-Q||Me>ue)continue;if(pe&&I!==null&&br){const tt=vt.clamp((V+Me-pe.t0)/pe.span,0,1),nt=tt*tt,ve=nt*tt;W+=(2*ve-3*nt+1)*pe.y0+(ve-2*nt+tt)*pe.m0+(-2*ve+3*nt)*pe.y1+(ve-nt)*pe.m1-I;continue}const ye=ae?vt.smoothstep(Me,-Q,-Q+ae)*(1-vt.smoothstep(Me,ue-ae,ue)):1,je=(V+Me-Y)/tn,Ae=Math.floor(je),Ke=je-Ae;W+=ye*vt.lerp(J[Ae]??0,J[Ae+1]??0,Ke)}return W}function Hn(E,{alignBendPlanes:I=!1,bodyOffset:H=0}={}){const{requested:U,constrainedPelvis:W,warnings:V,solved:Y}=Oe(E);if(typeof H=="function"&&(H=H(W.y)),H){W.y+=H;for(const J of Et)for(const ne of[Y[J].hip,Y[J].leg.middle,Y[J].leg.end])ne.y+=H}st=I,ce="manual",Nt=U.groundLock,pt=V,v.copy(W),m.copy(U.bodyQuaternion),f.copy(Fe(U)),D=U.pelvisQuaternion!==void 0,M.copy(U.torsoQuaternion??Un),_=U.torsoQuaternion!==void 0,P.set(1,0,0).applyQuaternion(m),T.copy(ki).applyQuaternion(m),N.copy(Oi).applyQuaternion(m),Z=(Math.atan2(N.x,N.z)+Math.PI*2)%(Math.PI*2),ge(),Le();for(const J of Et){const{source:ne,shoulder:Q,arm:ue,hip:ae,leg:pe}=Y[J],Me=b[J];Me.support=ne.handLocked,Me.flight=ne.handLocked?0:1,Me.anchor.copy(ne.wrist).add(Me.palmOffset.clone().applyQuaternion(ne.handQuaternion));const ye=y[J]={elbowPole:ne.elbowPole.clone(),kneePole:ne.kneePole.clone()};for(const je of["elbowTwist","kneeTwist","upperArmTwist","thighTwist"])ne[je]!==void 0&&(ye[je]=ne[je]);Be(J,ye,Q,ue.middle,ue.end,ne.handQuaternion),Ct(J,ye,ae,pe.middle,pe.end,ne.footQuaternion)}return fe(),We()}function Os(){const E=[{id:"pelvis",position:v.toArray(),quaternion:f.toArray(),canRotate:!0,label:"髋部 · 独立位置与旋转"},{id:"torso",position:S(c.torso).toArray(),quaternion:m.toArray(),canRotate:!0,label:"躯干 · 整体移动与转向"},{id:"waist",position:ct(x).toArray(),quaternion:M.toArray(),parentQuaternion:m.toArray(),canRotate:!0,label:"腰部 · 独立弯腰与扭转"}];for(const I of Et){const H=I==="left"?"左":"右";for(const[U,W,V,Y,J]of[["Wrist","wrist","Hand",!0,"手腕 · 手掌位置与朝向"],["Elbow","elbow","Forearm",!0,"肘部 · 前臂旋转与弯曲"],["Ankle","ankle","Foot",!0,"脚踝 · 脚掌位置与朝向"],["Knee","knee","Shin",!0,"膝部 · 小腿旋转与弯曲"]])E.push({id:I+U,position:y[I][W].toArray(),quaternion:l.get(I+V).rotation.toArray(),canRotate:Y,label:H+J})}return E}function Ua(E,I,H,U=null){const W=U?U.constrainedPelvis.clone():v.clone(),V=U?U.requested.bodyQuaternion.clone():m.clone(),Y=U?Ut(U.requested.torsoQuaternion)?V.clone():V.clone().multiply(U.requested.torsoQuaternion):it(),J=U?Fe(U.requested).clone():f.clone(),ne=U?R(c.torso,V,U.requested.torsoQuaternion).add(W):S(c.torso),Q=U?x.clone().sub(c.pelvis).applyQuaternion(V).add(W):ct(x),ue=x.clone().sub(c.pelvis),ae=c.torso.clone().sub(x),pe=ue.length(),Me=ae.length(),ye=ne.clone().sub(W).normalize(),je=Q.clone().sub(W);je.addScaledVector(ye,-je.dot(ye)),je.lengthSq()<1e-10&&(je.copy(Oi).applyQuaternion(Y),je.addScaledVector(ye,-je.dot(ye))),je.lengthSq()<1e-10&&(je.copy(Oi).applyQuaternion(V),je.addScaledVector(ye,-je.dot(ye))),je.normalize();const Ae=I?Yt(I):W,Ke=H?new qe().fromArray(H):J,tt=Ae.distanceToSquared(W)>1e-20,nt=Ae.clone();if(tt){const ht=nt.clone().sub(W),_t=W.clone().sub(ne),$e=ht.lengthSq(),xt=_t.dot(ht),he=(Me-pe)**2,Re=es(-xt/$e,0,1);if(_t.clone().addScaledVector(ht,Re).lengthSq()<he-1e-14){const Ve=xt*xt-$e*(_t.lengthSq()-he),Wt=es((-xt-Math.sqrt(Math.max(0,Ve)))/$e,0,1);nt.copy(W).addScaledVector(ht,Wt)}}function ve(ht,_t=!1){const $e=structuredClone(E);if($e.pelvisQuaternion=J.clone().slerp(Ke,ht).toArray(),!tt)return $e;const xt=W.clone().lerp(nt,ht);if(_t){const wt=Q.clone(),Tt=W.clone().sub(wt).normalize(),bn=xt.clone().sub(W);bn.addScaledVector(Tt,-bn.dot(Tt));const Ri=Tt.multiplyScalar(pe).add(bn).normalize();xt.copy(wt).addScaledVector(Ri,pe);const Gn=nr(ue,wt.clone().sub(xt),V);return $e.pelvis=xt.toArray(),$e.bodyQuaternion=Gn.toArray(),$e.torsoQuaternion=Gn.clone().invert().multiply(Y).normalize().toArray(),$e}const he=ne.clone().sub(xt);let Re=he.length();const Ve=Re>1e-10?he.multiplyScalar(1/Re):ye.clone();Re=es(Re,Math.abs(Me-pe),Me+pe),xt.copy(ne).addScaledVector(Ve,-Re);const Wt=(pe*pe-Me*Me+Re*Re)/(2*Re),Bt=Math.sqrt(Math.max(0,pe*pe-Wt*Wt)),Jt=je.clone().applyQuaternion(new qe().setFromUnitVectors(ye,Ve)),nn=xt.clone().addScaledVector(Ve,Wt).addScaledVector(Jt,Bt),rn=nr(ue,nn.clone().sub(xt),V),zt=nr(ae,ne.clone().sub(nn),Y);return $e.pelvis=xt.toArray(),$e.bodyQuaternion=rn.toArray(),$e.torsoQuaternion=rn.clone().invert().multiply(zt).normalize().toArray(),$e}function Xe(ht){try{const _t=Oe(ht);return R(c.torso,_t.requested.bodyQuaternion,_t.requested.torsoQuaternion).add(_t.constrainedPelvis).distanceTo(ne)<1e-7}catch{return!1}}let lt=ve(1),Vt=!1;if(!Xe(lt)){const ht=tt&&Et.some($e=>E.limbs[$e].handLocked),_t=ht?ve(1,!0):null;if(_t&&Xe(_t))lt=_t;else{let $e=0,xt=1;lt=E,Vt=!0;for(let he=0;he<28;he++){const Re=($e+xt)/2,Ve=ve(Re,ht);Xe(Ve)?($e=Re,lt=Ve):xt=Re}}}return tt&&Yt(lt.pelvis).distanceTo(Ae)>1e-5&&(Vt=!0),{pose:lt,limited:Vt}}function Oa({requested:E,constrainedPelvis:I,solved:H}){const U=V=>R(c[V],E.bodyQuaternion,E.torsoQuaternion).add(I),W={pelvis:I.clone(),waist:x.clone().sub(c.pelvis).applyQuaternion(E.bodyQuaternion).add(I),shoulderCenter:U("torso"),neck:U("neck"),head:U("head")};for(const V of Et){const{source:Y,shoulder:J,arm:ne,hip:Q,leg:ue}=H[V],ae={Shoulder:J.clone(),Elbow:ne.middle.clone(),Wrist:ne.end.clone(),Palm:b[V].palmOffset.clone().applyQuaternion(Y.handQuaternion).add(ne.end),Hip:Q.clone(),Knee:ue.middle.clone(),Ankle:ue.end.clone(),Toe:new A(0,0,.18).applyQuaternion(Y.footQuaternion).add(ue.end)};for(const[pe,Me]of Object.entries(ae))W[V+pe]=Me}return W}function lu({requested:E,constrainedPelvis:I,solved:H},U){const W=structuredClone(U);W.pelvis=I.toArray(),W.bodyQuaternion=E.bodyQuaternion.toArray();for(const V of["torsoQuaternion","pelvisQuaternion"])E[V]?W[V]=E[V].toArray():delete W[V];for(const V of Et){const{source:Y,arm:J,leg:ne}=H[V],Q=W.limbs[V];Q.wrist=J.end.toArray(),Q.ankle=ne.end.toArray(),Q.elbowPole=Y.elbowPole.toArray(),Q.kneePole=Y.kneePole.toArray(),Q.handQuaternion=Y.handQuaternion.toArray(),Q.footQuaternion=Y.footQuaternion.toArray()}return W}function uu(E,I,H){if(E.lengthSq()<1e-20||I.lengthSq()<1e-20)return Un.clone();const U=E.clone().normalize(),W=I.clone().normalize(),V=new A().crossVectors(U,W),Y=V.length(),J=es(U.dot(W),-1,1);return Y>1e-10?new qe().setFromAxisAngle(V.multiplyScalar(1/Y),Math.atan2(Y,J)):J>=0?Un.clone():(V.copy(Oi).applyQuaternion(H).addScaledVector(U,-Oi.clone().applyQuaternion(H).dot(U)),V.lengthSq()<1e-10&&V.set(1,0,0).applyQuaternion(H).addScaledVector(U,-new A(1,0,0).applyQuaternion(H).dot(U)),new qe().setFromAxisAngle(V.normalize(),Math.PI))}function wf(E,{joint:I,position:H}={}){const U=ar(H,3,"关节目标位置"),W=Oe(E),V=Oa(W),Y=Yt(U);if(typeof I!="string"||!Object.hasOwn(V,I))throw new Error("未知关节点。");const J=lu(W,E),ne=[];let Q=I==="pelvis"||I.endsWith("Hip")?"pelvis":I==="waist"||I==="shoulderCenter"?"body":["neck","head","leftShoulder","rightShoulder"].includes(I)?"upperBody":(I.startsWith("left")?"left":"right")+(/Elbow|Wrist|Palm$/.test(I)?"Arm":"Leg"),ue;const ae=Ut(W.requested.torsoQuaternion)?W.requested.bodyQuaternion.clone():W.requested.bodyQuaternion.clone().multiply(W.requested.torsoQuaternion),pe=(Ae,Ke)=>{const tt=lu(Ae,Ke),nt=Oe(tt),ve=Oa(nt),Xe=ve[I].distanceTo(Y),lt=Xe>1e-5,Vt=[...new Set([...W.warnings,...Ae.warnings,...nt.warnings,...ne,...lt?["目标已按现有联动关系、真实骨长和锁定约束限制；显示的是实际可达位置。"]:[]])];return{pose:tt,joint:I,position:ve[I].toArray(),requestedPosition:[...U],error:Xe,limited:lt,warnings:Vt,linkedGroup:Q,beforePosition:V[I].toArray(),joints:Object.fromEntries(Object.entries(ve).map(([ht,_t])=>[ht,_t.toArray()]))}};if(V[I].distanceToSquared(Y)<1e-24)return pe(W,J);if(I==="pelvis"){Q="pelvis";const Ae=Ua(J,U,null,W);return Ae.limited&&ne.push("髋部位移已限幅，上身通过原有腰部联动。"),pe(Oe(Ae.pose),Ae.pose)}if(I==="waist"||I==="shoulderCenter")Q="body",ue=Ae=>{const Ke=structuredClone(J);return Ke.pelvis=Yt(J.pelvis).add(Y.clone().sub(V[I]).multiplyScalar(Ae)).toArray(),Ke};else if(["neck","head","leftShoulder","rightShoulder"].includes(I)){Q="upperBody";const Ae=V.waist,Ke=uu(V[I].clone().sub(Ae),Y.clone().sub(Ae),ae);ue=tt=>{const nt=structuredClone(J),ve=Un.clone().slerp(Ke,tt);nt.torsoQuaternion=W.requested.bodyQuaternion.clone().invert().multiply(ve.clone().multiply(ae)).normalize().toArray();for(const Xe of Et){const lt=nt.limbs[Xe];lt.elbowPole=Yt(lt.elbowPole).sub(Ae).applyQuaternion(ve).add(Ae).toArray(),lt.handLocked||(lt.wrist=Yt(lt.wrist).sub(Ae).applyQuaternion(ve).add(Ae).toArray(),lt.handQuaternion=ve.clone().multiply(W.requested.limbs[Xe].handQuaternion).normalize().toArray())}return nt}}else{const Ae=I.startsWith("left")?"left":"right",Ke=I.slice(Ae.length),tt=W.solved[Ae],nt=b[Ae];if(Ke==="Hip"){Q="pelvis";const ht=Fe(W.requested),_t=V.pelvis,xt=uu(V[I].clone().sub(_t),Y.clone().sub(_t),ht).multiply(ht).normalize(),he=Ua(J,null,xt.toArray(),W);return pe(Oe(he.pose),he.pose)}if(Ke==="Elbow"||Ke==="Knee"){Q=Ke==="Elbow"?Ae+"Arm":Ae+"Leg";const ht=Ke==="Elbow",_t=ht?tt.shoulder:tt.hip,$e=ht?tt.arm:tt.leg,xt=$e.end.clone().sub(_t).normalize(),he=_t.clone().addScaledVector(xt,$e.middle.clone().sub(_t).dot(xt)),Re=$e.middle.clone().sub(he),Ve=Re.length(),Wt=Y.clone().sub(he).addScaledVector(xt,-Y.clone().sub(he).dot(xt));Ve<.001?ne.push("肢体接近伸直，已保留原弯曲方向。"):Wt.lengthSq()<1e-20?ne.push("目标在肢体轴线上，已保留原弯曲方向。"):Re.copy(Wt).normalize().multiplyScalar(Ve);const Bt=structuredClone(J);return Bt.limbs[Ae][ht?"elbowPole":"kneePole"]=he.add(Re).toArray(),pe(Oe(Bt),Bt)}const ve=Ke==="Wrist"||Ke==="Palm";Q=ve?Ae+"Arm":Ae+"Leg";let Xe=Y.clone();Ke==="Palm"&&Xe.sub(nt.palmOffset.clone().applyQuaternion(tt.source.handQuaternion)),Ke==="Toe"&&Xe.sub(new A(0,0,.18).applyQuaternion(tt.source.footQuaternion)),ve&&(Xe=Jo(tt.shoulder,Xe,nt.upperArm,nt.forearm,tt.source.elbowPole).end);const lt=ve?"wrist":"ankle",Vt=Yt(J.limbs[Ae][lt]);ue=ht=>{const _t=structuredClone(J);return _t.limbs[Ae][lt]=Vt.clone().lerp(Xe,ht).toArray(),_t}}let Me=W,ye=J,je=V[I].distanceTo(Y);for(let Ae=0;Ae<12;Ae++){const Ke=ue(2**-Ae);try{const tt=Oe(Ke),nt=Oa(tt)[I].distanceTo(Y);if(nt<je-1e-12&&(Me=tt,ye=Ke,je=nt),nt<1e-8)break}catch{}}return pe(Me,ye)}function Ef(E,I){const H=Os().find(Q=>Q.id===E);if(!H)throw new Error("未知姿势控制点。");if(!I||I.position===void 0&&I.quaternion===void 0)throw new Error("请提供控制点的位置或方向。");const U=I.position===void 0?null:ar(I.position,3,`${H.label}位置`),W=I.quaternion===void 0?null:ts(I.quaternion,`${H.label}方向`).toArray();if(W&&!H.canRotate)throw new Error("此控制点不支持旋转。");let V=We(),Y=!1,J=!1;if(E==="pelvis"){const Q=Ua(V,U,W);V=Q.pose,J=Q.limited}else if(E==="torso"){if(W){if(V.pelvisQuaternion){const ae=new qe().fromArray(W).multiply(m.clone().invert());V.pelvisQuaternion=ae.multiply(f).normalize().toArray()}V.bodyQuaternion=W}const Q=Yt(U??H.position),ue=R(c.torso,new qe().fromArray(V.bodyQuaternion),V.torsoQuaternion?new qe().fromArray(V.torsoQuaternion):null);V.pelvis=Q.sub(ue).toArray()}else if(E==="waist"){if(U&&(V.pelvis=Yt(U).sub(x.clone().sub(c.pelvis).applyQuaternion(m)).toArray()),W){const Q=ct(x),ae=m.clone().multiply(new qe().fromArray(W)).clone().multiply(it().invert());V.torsoQuaternion=W;for(const pe of Et){const Me=V.limbs[pe];Me.elbowPole=Yt(Me.elbowPole).sub(Q).applyQuaternion(ae).add(Q).toArray(),Me.handLocked||(Me.wrist=Yt(Me.wrist).sub(Q).applyQuaternion(ae).add(Q).toArray(),Me.handQuaternion=ae.clone().multiply(new qe().fromArray(Me.handQuaternion)).normalize().toArray())}}}else{const Q=E.startsWith("left")?"left":"right",ue=E.slice(Q.length),ae=V.limbs[Q];if(W&&(ue==="Elbow"||ue==="Knee")){const pe=ue==="Elbow";if(pe&&ae.handLocked)throw new Error(`${Q==="left"?"左":"右"}手已固定，旋转肘部前请先取消对应手的固定。`);const Me=Q+(pe?"Forearm":"Shin"),ye=new qe().fromArray(W),je=ye.clone().multiply(l.get(Me).rotation.clone().invert()),Ae=y[Q][pe?"elbow":"knee"],Ke=pe?"wrist":"ankle",tt=pe?"elbowPole":"kneePole",nt=pe?"handQuaternion":"footQuaternion",ve=Yt(ae[Ke]).sub(Ae).applyQuaternion(je).add(Ae);ae[Ke]=ve.toArray(),ae[tt]=Ae.toArray(),ae[nt]=je.clone().multiply(new qe().fromArray(ae[nt])).normalize().toArray();const Xe=c[Q+(pe?"Wrist":"Ankle")].clone().sub(c[Q+ue]),lt=nr(Xe,ve.clone().sub(Ae),pe?it():f);ae[pe?"elbowTwist":"kneeTwist"]=te(lt,ye,Xe)}if(U&&ue==="Wrist"){const pe=Yt(U),Me=y[Q].shoulder,ye=b[Q],je=Jo(Me,pe,ye.upperArm,ye.forearm,Yt(ae.elbowPole)).end;Y=je.distanceTo(pe)>1e-5,ae.wrist=je.toArray()}else U&&(ae[{Elbow:"elbowPole",Ankle:"ankle",Knee:"kneePole"}[ue]]=U);W&&(ue==="Wrist"||ue==="Ankle")&&(ae[ue==="Wrist"?"handQuaternion":"footQuaternion"]=W)}const ne=Hn(V);return J&&pt.unshift("髋部调整已限制在腰部和四肢可达范围内，肩中心保持原位置。"),Y&&pt.unshift("手腕已限制在当前肩部与真实手臂长度能够到达的位置。"),ne}function du(){if(K){O.makeEmpty();for(const E of l.values())Tc(E.bounds,E.matrix,O);K=!1}return{min:O.min.toArray(),max:O.max.toArray()}}function Af(E){L=E,i.userData.coachLayer=E}function Tf(E){k=E,i.userData.selectedMuscle=E}function Rf(){const E=Ce?Ce.describe(se):null,I=E?["rear","right","front","left"].indexOf(E.section):-1,H={pelvis:v.toArray(),waist:ct(x).toArray(),shoulderCenter:S(c.torso).toArray(),neck:S(c.neck).toArray(),head:S(c.head).toArray()},U={torso:c.pelvis.distanceTo(c.torso)},W={torso:c.pelvis.distanceTo(c.torso)},V=[],Y={},J={};for(const ne of Et){const Q=b[ne],ue=y[ne];for(const ae of["shoulder","elbow","wrist","palm","hip","knee","ankle","toe"])H[ne+ae[0].toUpperCase()+ae.slice(1)]=ue[ae].toArray();J[ne]=Q.support,Q.support&&V.push(ne),Y[ne]=Q.support?ue.palm.distanceTo(Q.anchor):null,U[ne+"UpperArm"]=ue.shoulder.distanceTo(ue.elbow),U[ne+"Forearm"]=ue.elbow.distanceTo(ue.wrist),U[ne+"Thigh"]=ue.hip.distanceTo(ue.knee),U[ne+"Shin"]=ue.knee.distanceTo(ue.ankle);for(const ae of["UpperArm","Forearm","Thigh","Shin"])W[ne+ae]=Q[ae[0].toLowerCase()+ae.slice(1)]}return{time:se,angle:Z,period:F.period,mode:ce,manual:ce==="manual",layer:L,selected:k,legPath:oe,interpolation:xe,motionModel:Ze,skippedSteps:[...Te],periodic:E,bodyQuaternion:m.toArray(),groundLock:Nt,warnings:[...pt],pelvisQuaternion:f.toArray(),torsoQuaternion:M.toArray(),name:"Snow 友善健身主角",source:e.source,license:e.license,illustrative:!0,motionType:"Flare 教学示意",automaticallyBound:!1,keyframes:{...F.keyframes},demonstration:E?{index:I,count:4,id:`periodic-${E.section}`,phase:["rear","sideA","front","sideB"][I]}:{index:F.stepAt(se),count:F.steps.length,id:F.steps[F.stepAt(se)].id,phase:F.steps[F.stepAt(se)].phase},supportHands:V,supports:J,supportDrift:Y,segmentLengths:U,expectedLengths:W,joints:H,minFootHeight:ee,chestForward:Oi.clone().applyQuaternion(it()).toArray(),bounds:du(),neutralBounds:X,neutralHeight:e.height,skinning:{bones:l.size,batches:s.length,weightedVertices:p,originalMeshes:s.length,authoredWeights:!0},supportAnchors:Object.fromEntries(Et.map(ne=>[ne,b[ne].anchor.toArray()]))}}i.userData.motionSource="Snow Rig / Blender Foundation",we();function Cf(E){if(!ti())return 1;const I=F.steps.length-1,H=F.period/(I+1);return(E%F.period+F.period)%F.period>(I-1)*H?2:1}return{group:i,update:ze,reset:we,setSequence:Ue,sampleTrajectory:gt,samplePose:Ye,getSegmentGuideAt:dt,getLoopTimeScale:Cf,getFootCurveSpan:(E,I)=>F.spanAt(E,I),getFootCurveAt:(E,I)=>F.curveAt(E,I),setLayer:Af,setHighlight:Tf,getMetrics:Rf,capturePose:We,applyPose:Hn,getEditableHandles:Os,editHandle:Ef,solveJointPose:wf,getGroundHandPose:kt,alignGroundHands:Kt}}function Pv(i,e,t=0){const n=["pelvis","leftHand","rightHand","leftFoot","rightFoot"].map(g=>i.getObjectByName(g)).filter(Boolean);if(n.length<3)return null;const r=e.getMetrics().period,s=240,o=[],a=new A;for(let g=0;g<=s;g++)e.update(g*r/s),i.updateMatrixWorld(!0),o.push(n.map(b=>b.getWorldPosition(a).clone()));e.update(t),i.updateMatrixWorld(!0);const l=g=>e.getLoopTimeScale?.(g)??1,c=[];for(let g=0;g<s;g++){let b=0;for(let m=0;m<n.length;m++)b+=o[g][m].distanceTo(o[g+1][m]);c.push(b*l((g+.5)*r/s))}const u=c.map((g,b)=>{let m=0,f=0;for(let M=-4;M<=4;M++){const x=5-Math.abs(M);m+=c[(b+M+s)%s]*x,f+=x}return m/f}),d=u.reduce((g,b)=>g+b,0)/s;if(!(d>0))return null;const h=u.map(g=>g<d*.02?25:Math.min(25,Math.max(.35,Math.pow(d/g,.8)))),p=h.reduce((g,b,m)=>g+1/(b*l((m+.5)*r/s)),0)/s;return h.map(g=>g*p)}function nf(i,e,t,n=9){if(!i)return 1;const r=i.length,s=(t%n+n)%n/n*r,o=Math.floor(s)%r,a=s-Math.floor(s);return(i[o]*(1-a)+i[(o+1)%r]*a)*(e.getLoopTimeScale?.(t)??1)}function Lv(i,e,t,n,r,s=9){const a=n*r/8;let l=0;for(let c=0;c<8;c++)l+=a*nf(i,e,t+l,s);return l}function Xd(i,e){if(e===op)return console.warn("THREE.BufferGeometryUtils.toTrianglesDrawMode(): Geometry already defined as triangles."),i;if(e===vl||e===vh){let t=i.getIndex();if(t===null){const o=[],a=i.getAttribute("position");if(a!==void 0){for(let l=0;l<a.count;l++)o.push(l);i.setIndex(o),t=i.getIndex()}else return console.error("THREE.BufferGeometryUtils.toTrianglesDrawMode(): Undefined position attribute. Processing not possible."),i}const n=t.count-2,r=[];if(e===vl)for(let o=1;o<=n;o++)r.push(t.getX(0)),r.push(t.getX(o)),r.push(t.getX(o+1));else for(let o=0;o<n;o++)o%2===0?(r.push(t.getX(o)),r.push(t.getX(o+1)),r.push(t.getX(o+2))):(r.push(t.getX(o+2)),r.push(t.getX(o+1)),r.push(t.getX(o)));r.length/3!==n&&console.error("THREE.BufferGeometryUtils.toTrianglesDrawMode(): Unable to generate correct amount of triangles.");const s=i.clone();return s.setIndex(r),s.clearGroups(),s}else return console.error("THREE.BufferGeometryUtils.toTrianglesDrawMode(): Unknown draw mode:",e),i}class Dv extends Fs{constructor(e){super(e),this.dracoLoader=null,this.ktx2Loader=null,this.meshoptDecoder=null,this.pluginCallbacks=[],this.register(function(t){return new Ov(t)}),this.register(function(t){return new kv(t)}),this.register(function(t){return new Xv(t)}),this.register(function(t){return new Qv(t)}),this.register(function(t){return new Kv(t)}),this.register(function(t){return new zv(t)}),this.register(function(t){return new Hv(t)}),this.register(function(t){return new Gv(t)}),this.register(function(t){return new Vv(t)}),this.register(function(t){return new Uv(t)}),this.register(function(t){return new Wv(t)}),this.register(function(t){return new Bv(t)}),this.register(function(t){return new jv(t)}),this.register(function(t){return new qv(t)}),this.register(function(t){return new Fv(t)}),this.register(function(t){return new Yv(t)}),this.register(function(t){return new $v(t)})}load(e,t,n,r){const s=this;let o;if(this.resourcePath!=="")o=this.resourcePath;else if(this.path!==""){const c=eo.extractUrlBase(e);o=eo.resolveURL(c,this.path)}else o=eo.extractUrlBase(e);this.manager.itemStart(e);const a=function(c){r?r(c):console.error(c),s.manager.itemError(e),s.manager.itemEnd(e)},l=new Vh(this.manager);l.setPath(this.path),l.setResponseType("arraybuffer"),l.setRequestHeader(this.requestHeader),l.setWithCredentials(this.withCredentials),l.load(e,function(c){try{s.parse(c,o,function(u){t(u),s.manager.itemEnd(e)},a)}catch(u){a(u)}},n,a)}setDRACOLoader(e){return this.dracoLoader=e,this}setKTX2Loader(e){return this.ktx2Loader=e,this}setMeshoptDecoder(e){return this.meshoptDecoder=e,this}register(e){return this.pluginCallbacks.indexOf(e)===-1&&this.pluginCallbacks.push(e),this}unregister(e){return this.pluginCallbacks.indexOf(e)!==-1&&this.pluginCallbacks.splice(this.pluginCallbacks.indexOf(e),1),this}parse(e,t,n,r){let s;const o={},a={},l=new TextDecoder;if(typeof e=="string")s=JSON.parse(e);else if(e instanceof ArrayBuffer)if(l.decode(new Uint8Array(e,0,4))===rf){try{o[Rt.KHR_BINARY_GLTF]=new Zv(e)}catch(d){r&&r(d);return}s=JSON.parse(o[Rt.KHR_BINARY_GLTF].content)}else s=JSON.parse(l.decode(e));else s=e;if(s.asset===void 0||s.asset.version[0]<2){r&&r(new Error("THREE.GLTFLoader: Unsupported asset. glTF versions >=2.0 are supported."));return}const c=new dy(s,{path:t||this.resourcePath||"",crossOrigin:this.crossOrigin,requestHeader:this.requestHeader,manager:this.manager,ktx2Loader:this.ktx2Loader,meshoptDecoder:this.meshoptDecoder});c.fileLoader.setRequestHeader(this.requestHeader);for(let u=0;u<this.pluginCallbacks.length;u++){const d=this.pluginCallbacks[u](c);d.name||console.error("THREE.GLTFLoader: Invalid plugin found: missing name"),a[d.name]=d,o[d.name]=!0}if(s.extensionsUsed)for(let u=0;u<s.extensionsUsed.length;++u){const d=s.extensionsUsed[u],h=s.extensionsRequired||[];switch(d){case Rt.KHR_MATERIALS_UNLIT:o[d]=new Nv;break;case Rt.KHR_DRACO_MESH_COMPRESSION:o[d]=new Jv(s,this.dracoLoader);break;case Rt.KHR_TEXTURE_TRANSFORM:o[d]=new ey;break;case Rt.KHR_MESH_QUANTIZATION:o[d]=new ty;break;default:h.indexOf(d)>=0&&a[d]===void 0&&console.warn('THREE.GLTFLoader: Unknown extension "'+d+'".')}}c.setExtensions(o),c.setPlugins(a),c.parse(n,r)}parseAsync(e,t){const n=this;return new Promise(function(r,s){n.parse(e,t,r,s)})}}function Iv(){let i={};return{get:function(e){return i[e]},add:function(e,t){i[e]=t},remove:function(e){delete i[e]},removeAll:function(){i={}}}}const Rt={KHR_BINARY_GLTF:"KHR_binary_glTF",KHR_DRACO_MESH_COMPRESSION:"KHR_draco_mesh_compression",KHR_LIGHTS_PUNCTUAL:"KHR_lights_punctual",KHR_MATERIALS_CLEARCOAT:"KHR_materials_clearcoat",KHR_MATERIALS_DISPERSION:"KHR_materials_dispersion",KHR_MATERIALS_IOR:"KHR_materials_ior",KHR_MATERIALS_SHEEN:"KHR_materials_sheen",KHR_MATERIALS_SPECULAR:"KHR_materials_specular",KHR_MATERIALS_TRANSMISSION:"KHR_materials_transmission",KHR_MATERIALS_IRIDESCENCE:"KHR_materials_iridescence",KHR_MATERIALS_ANISOTROPY:"KHR_materials_anisotropy",KHR_MATERIALS_UNLIT:"KHR_materials_unlit",KHR_MATERIALS_VOLUME:"KHR_materials_volume",KHR_TEXTURE_BASISU:"KHR_texture_basisu",KHR_TEXTURE_TRANSFORM:"KHR_texture_transform",KHR_MESH_QUANTIZATION:"KHR_mesh_quantization",KHR_MATERIALS_EMISSIVE_STRENGTH:"KHR_materials_emissive_strength",EXT_MATERIALS_BUMP:"EXT_materials_bump",EXT_TEXTURE_WEBP:"EXT_texture_webp",EXT_TEXTURE_AVIF:"EXT_texture_avif",EXT_MESHOPT_COMPRESSION:"EXT_meshopt_compression",EXT_MESH_GPU_INSTANCING:"EXT_mesh_gpu_instancing"};class Fv{constructor(e){this.parser=e,this.name=Rt.KHR_LIGHTS_PUNCTUAL,this.cache={refs:{},uses:{}}}_markDefs(){const e=this.parser,t=this.parser.json.nodes||[];for(let n=0,r=t.length;n<r;n++){const s=t[n];s.extensions&&s.extensions[this.name]&&s.extensions[this.name].light!==void 0&&e._addNodeRef(this.cache,s.extensions[this.name].light)}}_loadLight(e){const t=this.parser,n="light:"+e;let r=t.cache.get(n);if(r)return r;const s=t.json,l=((s.extensions&&s.extensions[this.name]||{}).lights||[])[e];let c;const u=new rt(16777215);l.color!==void 0&&u.setRGB(l.color[0],l.color[1],l.color[2],Ln);const d=l.range!==void 0?l.range:0;switch(l.type){case"directional":c=new us(u),c.target.position.set(0,0,-1),c.add(c.target);break;case"point":c=new qh(u),c.distance=d;break;case"spot":c=new _x(u),c.distance=d,l.spot=l.spot||{},l.spot.innerConeAngle=l.spot.innerConeAngle!==void 0?l.spot.innerConeAngle:0,l.spot.outerConeAngle=l.spot.outerConeAngle!==void 0?l.spot.outerConeAngle:Math.PI/4,c.angle=l.spot.outerConeAngle,c.penumbra=1-l.spot.innerConeAngle/l.spot.outerConeAngle,c.target.position.set(0,0,-1),c.add(c.target);break;default:throw new Error("THREE.GLTFLoader: Unexpected light type: "+l.type)}return c.position.set(0,0,0),c.decay=2,Bi(c,l),l.intensity!==void 0&&(c.intensity=l.intensity),c.name=t.createUniqueName(l.name||"light_"+e),r=Promise.resolve(c),t.cache.add(n,r),r}getDependency(e,t){if(e==="light")return this._loadLight(t)}createNodeAttachment(e){const t=this,n=this.parser,s=n.json.nodes[e],a=(s.extensions&&s.extensions[this.name]||{}).light;return a===void 0?null:this._loadLight(a).then(function(l){return n._getNodeRef(t.cache,a,l)})}}class Nv{constructor(){this.name=Rt.KHR_MATERIALS_UNLIT}getMaterialType(){return Gi}extendParams(e,t,n){const r=[];e.color=new rt(1,1,1),e.opacity=1;const s=t.pbrMetallicRoughness;if(s){if(Array.isArray(s.baseColorFactor)){const o=s.baseColorFactor;e.color.setRGB(o[0],o[1],o[2],Ln),e.opacity=o[3]}s.baseColorTexture!==void 0&&r.push(n.assignTexture(e,"map",s.baseColorTexture,ln))}return Promise.all(r)}}class Uv{constructor(e){this.parser=e,this.name=Rt.KHR_MATERIALS_EMISSIVE_STRENGTH}extendMaterialParams(e,t){const r=this.parser.json.materials[e];if(!r.extensions||!r.extensions[this.name])return Promise.resolve();const s=r.extensions[this.name].emissiveStrength;return s!==void 0&&(t.emissiveIntensity=s),Promise.resolve()}}class Ov{constructor(e){this.parser=e,this.name=Rt.KHR_MATERIALS_CLEARCOAT}getMaterialType(e){const n=this.parser.json.materials[e];return!n.extensions||!n.extensions[this.name]?null:Ai}extendMaterialParams(e,t){const n=this.parser,r=n.json.materials[e];if(!r.extensions||!r.extensions[this.name])return Promise.resolve();const s=[],o=r.extensions[this.name];if(o.clearcoatFactor!==void 0&&(t.clearcoat=o.clearcoatFactor),o.clearcoatTexture!==void 0&&s.push(n.assignTexture(t,"clearcoatMap",o.clearcoatTexture)),o.clearcoatRoughnessFactor!==void 0&&(t.clearcoatRoughness=o.clearcoatRoughnessFactor),o.clearcoatRoughnessTexture!==void 0&&s.push(n.assignTexture(t,"clearcoatRoughnessMap",o.clearcoatRoughnessTexture)),o.clearcoatNormalTexture!==void 0&&(s.push(n.assignTexture(t,"clearcoatNormalMap",o.clearcoatNormalTexture)),o.clearcoatNormalTexture.scale!==void 0)){const a=o.clearcoatNormalTexture.scale;t.clearcoatNormalScale=new ut(a,a)}return Promise.all(s)}}class kv{constructor(e){this.parser=e,this.name=Rt.KHR_MATERIALS_DISPERSION}getMaterialType(e){const n=this.parser.json.materials[e];return!n.extensions||!n.extensions[this.name]?null:Ai}extendMaterialParams(e,t){const r=this.parser.json.materials[e];if(!r.extensions||!r.extensions[this.name])return Promise.resolve();const s=r.extensions[this.name];return t.dispersion=s.dispersion!==void 0?s.dispersion:0,Promise.resolve()}}class Bv{constructor(e){this.parser=e,this.name=Rt.KHR_MATERIALS_IRIDESCENCE}getMaterialType(e){const n=this.parser.json.materials[e];return!n.extensions||!n.extensions[this.name]?null:Ai}extendMaterialParams(e,t){const n=this.parser,r=n.json.materials[e];if(!r.extensions||!r.extensions[this.name])return Promise.resolve();const s=[],o=r.extensions[this.name];return o.iridescenceFactor!==void 0&&(t.iridescence=o.iridescenceFactor),o.iridescenceTexture!==void 0&&s.push(n.assignTexture(t,"iridescenceMap",o.iridescenceTexture)),o.iridescenceIor!==void 0&&(t.iridescenceIOR=o.iridescenceIor),t.iridescenceThicknessRange===void 0&&(t.iridescenceThicknessRange=[100,400]),o.iridescenceThicknessMinimum!==void 0&&(t.iridescenceThicknessRange[0]=o.iridescenceThicknessMinimum),o.iridescenceThicknessMaximum!==void 0&&(t.iridescenceThicknessRange[1]=o.iridescenceThicknessMaximum),o.iridescenceThicknessTexture!==void 0&&s.push(n.assignTexture(t,"iridescenceThicknessMap",o.iridescenceThicknessTexture)),Promise.all(s)}}class zv{constructor(e){this.parser=e,this.name=Rt.KHR_MATERIALS_SHEEN}getMaterialType(e){const n=this.parser.json.materials[e];return!n.extensions||!n.extensions[this.name]?null:Ai}extendMaterialParams(e,t){const n=this.parser,r=n.json.materials[e];if(!r.extensions||!r.extensions[this.name])return Promise.resolve();const s=[];t.sheenColor=new rt(0,0,0),t.sheenRoughness=0,t.sheen=1;const o=r.extensions[this.name];if(o.sheenColorFactor!==void 0){const a=o.sheenColorFactor;t.sheenColor.setRGB(a[0],a[1],a[2],Ln)}return o.sheenRoughnessFactor!==void 0&&(t.sheenRoughness=o.sheenRoughnessFactor),o.sheenColorTexture!==void 0&&s.push(n.assignTexture(t,"sheenColorMap",o.sheenColorTexture,ln)),o.sheenRoughnessTexture!==void 0&&s.push(n.assignTexture(t,"sheenRoughnessMap",o.sheenRoughnessTexture)),Promise.all(s)}}class Hv{constructor(e){this.parser=e,this.name=Rt.KHR_MATERIALS_TRANSMISSION}getMaterialType(e){const n=this.parser.json.materials[e];return!n.extensions||!n.extensions[this.name]?null:Ai}extendMaterialParams(e,t){const n=this.parser,r=n.json.materials[e];if(!r.extensions||!r.extensions[this.name])return Promise.resolve();const s=[],o=r.extensions[this.name];return o.transmissionFactor!==void 0&&(t.transmission=o.transmissionFactor),o.transmissionTexture!==void 0&&s.push(n.assignTexture(t,"transmissionMap",o.transmissionTexture)),Promise.all(s)}}class Gv{constructor(e){this.parser=e,this.name=Rt.KHR_MATERIALS_VOLUME}getMaterialType(e){const n=this.parser.json.materials[e];return!n.extensions||!n.extensions[this.name]?null:Ai}extendMaterialParams(e,t){const n=this.parser,r=n.json.materials[e];if(!r.extensions||!r.extensions[this.name])return Promise.resolve();const s=[],o=r.extensions[this.name];t.thickness=o.thicknessFactor!==void 0?o.thicknessFactor:0,o.thicknessTexture!==void 0&&s.push(n.assignTexture(t,"thicknessMap",o.thicknessTexture)),t.attenuationDistance=o.attenuationDistance||1/0;const a=o.attenuationColor||[1,1,1];return t.attenuationColor=new rt().setRGB(a[0],a[1],a[2],Ln),Promise.all(s)}}class Vv{constructor(e){this.parser=e,this.name=Rt.KHR_MATERIALS_IOR}getMaterialType(e){const n=this.parser.json.materials[e];return!n.extensions||!n.extensions[this.name]?null:Ai}extendMaterialParams(e,t){const r=this.parser.json.materials[e];if(!r.extensions||!r.extensions[this.name])return Promise.resolve();const s=r.extensions[this.name];return t.ior=s.ior!==void 0?s.ior:1.5,Promise.resolve()}}class Wv{constructor(e){this.parser=e,this.name=Rt.KHR_MATERIALS_SPECULAR}getMaterialType(e){const n=this.parser.json.materials[e];return!n.extensions||!n.extensions[this.name]?null:Ai}extendMaterialParams(e,t){const n=this.parser,r=n.json.materials[e];if(!r.extensions||!r.extensions[this.name])return Promise.resolve();const s=[],o=r.extensions[this.name];t.specularIntensity=o.specularFactor!==void 0?o.specularFactor:1,o.specularTexture!==void 0&&s.push(n.assignTexture(t,"specularIntensityMap",o.specularTexture));const a=o.specularColorFactor||[1,1,1];return t.specularColor=new rt().setRGB(a[0],a[1],a[2],Ln),o.specularColorTexture!==void 0&&s.push(n.assignTexture(t,"specularColorMap",o.specularColorTexture,ln)),Promise.all(s)}}class qv{constructor(e){this.parser=e,this.name=Rt.EXT_MATERIALS_BUMP}getMaterialType(e){const n=this.parser.json.materials[e];return!n.extensions||!n.extensions[this.name]?null:Ai}extendMaterialParams(e,t){const n=this.parser,r=n.json.materials[e];if(!r.extensions||!r.extensions[this.name])return Promise.resolve();const s=[],o=r.extensions[this.name];return t.bumpScale=o.bumpFactor!==void 0?o.bumpFactor:1,o.bumpTexture!==void 0&&s.push(n.assignTexture(t,"bumpMap",o.bumpTexture)),Promise.all(s)}}class jv{constructor(e){this.parser=e,this.name=Rt.KHR_MATERIALS_ANISOTROPY}getMaterialType(e){const n=this.parser.json.materials[e];return!n.extensions||!n.extensions[this.name]?null:Ai}extendMaterialParams(e,t){const n=this.parser,r=n.json.materials[e];if(!r.extensions||!r.extensions[this.name])return Promise.resolve();const s=[],o=r.extensions[this.name];return o.anisotropyStrength!==void 0&&(t.anisotropy=o.anisotropyStrength),o.anisotropyRotation!==void 0&&(t.anisotropyRotation=o.anisotropyRotation),o.anisotropyTexture!==void 0&&s.push(n.assignTexture(t,"anisotropyMap",o.anisotropyTexture)),Promise.all(s)}}class Xv{constructor(e){this.parser=e,this.name=Rt.KHR_TEXTURE_BASISU}loadTexture(e){const t=this.parser,n=t.json,r=n.textures[e];if(!r.extensions||!r.extensions[this.name])return null;const s=r.extensions[this.name],o=t.options.ktx2Loader;if(!o){if(n.extensionsRequired&&n.extensionsRequired.indexOf(this.name)>=0)throw new Error("THREE.GLTFLoader: setKTX2Loader must be called before loading KTX2 textures");return null}return t.loadTextureImage(e,s.source,o)}}class Qv{constructor(e){this.parser=e,this.name=Rt.EXT_TEXTURE_WEBP,this.isSupported=null}loadTexture(e){const t=this.name,n=this.parser,r=n.json,s=r.textures[e];if(!s.extensions||!s.extensions[t])return null;const o=s.extensions[t],a=r.images[o.source];let l=n.textureLoader;if(a.uri){const c=n.options.manager.getHandler(a.uri);c!==null&&(l=c)}return this.detectSupport().then(function(c){if(c)return n.loadTextureImage(e,o.source,l);if(r.extensionsRequired&&r.extensionsRequired.indexOf(t)>=0)throw new Error("THREE.GLTFLoader: WebP required by asset but unsupported.");return n.loadTexture(e)})}detectSupport(){return this.isSupported||(this.isSupported=new Promise(function(e){const t=new Image;t.src="data:image/webp;base64,UklGRiIAAABXRUJQVlA4IBYAAAAwAQCdASoBAAEADsD+JaQAA3AAAAAA",t.onload=t.onerror=function(){e(t.height===1)}})),this.isSupported}}class Kv{constructor(e){this.parser=e,this.name=Rt.EXT_TEXTURE_AVIF,this.isSupported=null}loadTexture(e){const t=this.name,n=this.parser,r=n.json,s=r.textures[e];if(!s.extensions||!s.extensions[t])return null;const o=s.extensions[t],a=r.images[o.source];let l=n.textureLoader;if(a.uri){const c=n.options.manager.getHandler(a.uri);c!==null&&(l=c)}return this.detectSupport().then(function(c){if(c)return n.loadTextureImage(e,o.source,l);if(r.extensionsRequired&&r.extensionsRequired.indexOf(t)>=0)throw new Error("THREE.GLTFLoader: AVIF required by asset but unsupported.");return n.loadTexture(e)})}detectSupport(){return this.isSupported||(this.isSupported=new Promise(function(e){const t=new Image;t.src="data:image/avif;base64,AAAAIGZ0eXBhdmlmAAAAAGF2aWZtaWYxbWlhZk1BMUIAAADybWV0YQAAAAAAAAAoaGRscgAAAAAAAAAAcGljdAAAAAAAAAAAAAAAAGxpYmF2aWYAAAAADnBpdG0AAAAAAAEAAAAeaWxvYwAAAABEAAABAAEAAAABAAABGgAAABcAAAAoaWluZgAAAAAAAQAAABppbmZlAgAAAAABAABhdjAxQ29sb3IAAAAAamlwcnAAAABLaXBjbwAAABRpc3BlAAAAAAAAAAEAAAABAAAAEHBpeGkAAAAAAwgICAAAAAxhdjFDgQAMAAAAABNjb2xybmNseAACAAIABoAAAAAXaXBtYQAAAAAAAAABAAEEAQKDBAAAAB9tZGF0EgAKCBgABogQEDQgMgkQAAAAB8dSLfI=",t.onload=t.onerror=function(){e(t.height===1)}})),this.isSupported}}class Yv{constructor(e){this.name=Rt.EXT_MESHOPT_COMPRESSION,this.parser=e}loadBufferView(e){const t=this.parser.json,n=t.bufferViews[e];if(n.extensions&&n.extensions[this.name]){const r=n.extensions[this.name],s=this.parser.getDependency("buffer",r.buffer),o=this.parser.options.meshoptDecoder;if(!o||!o.supported){if(t.extensionsRequired&&t.extensionsRequired.indexOf(this.name)>=0)throw new Error("THREE.GLTFLoader: setMeshoptDecoder must be called before loading compressed files");return null}return s.then(function(a){const l=r.byteOffset||0,c=r.byteLength||0,u=r.count,d=r.byteStride,h=new Uint8Array(a,l,c);return o.decodeGltfBufferAsync?o.decodeGltfBufferAsync(u,d,h,r.mode,r.filter).then(function(p){return p.buffer}):o.ready.then(function(){const p=new ArrayBuffer(u*d);return o.decodeGltfBuffer(new Uint8Array(p),u,d,h,r.mode,r.filter),p})})}else return null}}class $v{constructor(e){this.name=Rt.EXT_MESH_GPU_INSTANCING,this.parser=e}createNodeMesh(e){const t=this.parser.json,n=t.nodes[e];if(!n.extensions||!n.extensions[this.name]||n.mesh===void 0)return null;const r=t.meshes[n.mesh];for(const c of r.primitives)if(c.mode!==$n.TRIANGLES&&c.mode!==$n.TRIANGLE_STRIP&&c.mode!==$n.TRIANGLE_FAN&&c.mode!==void 0)return null;const o=n.extensions[this.name].attributes,a=[],l={};for(const c in o)a.push(this.parser.getDependency("accessor",o[c]).then(u=>(l[c]=u,l[c])));return a.length<1?null:(a.push(this.parser.createNodeMesh(e)),Promise.all(a).then(c=>{const u=c.pop(),d=u.isGroup?u.children:[u],h=c[0].count,p=[];for(const g of d){const b=new ot,m=new A,f=new qe,M=new A(1,1,1),x=new $_(g.geometry,g.material,h);for(let _=0;_<h;_++)l.TRANSLATION&&m.fromBufferAttribute(l.TRANSLATION,_),l.ROTATION&&f.fromBufferAttribute(l.ROTATION,_),l.SCALE&&M.fromBufferAttribute(l.SCALE,_),x.setMatrixAt(_,b.compose(m,f,M));for(const _ in l)if(_==="_COLOR_0"){const D=l[_];x.instanceColor=new wl(D.array,D.itemSize,D.normalized)}else _!=="TRANSLATION"&&_!=="ROTATION"&&_!=="SCALE"&&g.geometry.setAttribute(_,l[_]);en.prototype.copy.call(x,g),this.parser.assignFinalMaterial(x),p.push(x)}return u.isGroup?(u.clear(),u.add(...p),u):p[0]}))}}const rf="glTF",Xs=12,Qd={JSON:1313821514,BIN:5130562};class Zv{constructor(e){this.name=Rt.KHR_BINARY_GLTF,this.content=null,this.body=null;const t=new DataView(e,0,Xs),n=new TextDecoder;if(this.header={magic:n.decode(new Uint8Array(e.slice(0,4))),version:t.getUint32(4,!0),length:t.getUint32(8,!0)},this.header.magic!==rf)throw new Error("THREE.GLTFLoader: Unsupported glTF-Binary header.");if(this.header.version<2)throw new Error("THREE.GLTFLoader: Legacy binary file detected.");const r=this.header.length-Xs,s=new DataView(e,Xs);let o=0;for(;o<r;){const a=s.getUint32(o,!0);o+=4;const l=s.getUint32(o,!0);if(o+=4,l===Qd.JSON){const c=new Uint8Array(e,Xs+o,a);this.content=n.decode(c)}else if(l===Qd.BIN){const c=Xs+o;this.body=e.slice(c,c+a)}o+=a}if(this.content===null)throw new Error("THREE.GLTFLoader: JSON content not found.")}}class Jv{constructor(e,t){if(!t)throw new Error("THREE.GLTFLoader: No DRACOLoader instance provided.");this.name=Rt.KHR_DRACO_MESH_COMPRESSION,this.json=e,this.dracoLoader=t,this.dracoLoader.preload()}decodePrimitive(e,t){const n=this.json,r=this.dracoLoader,s=e.extensions[this.name].bufferView,o=e.extensions[this.name].attributes,a={},l={},c={};for(const u in o){const d=Il[u]||u.toLowerCase();a[d]=o[u]}for(const u in e.attributes){const d=Il[u]||u.toLowerCase();if(o[u]!==void 0){const h=n.accessors[e.attributes[u]],p=fs[h.componentType];c[d]=p.name,l[d]=h.normalized===!0}}return t.getDependency("bufferView",s).then(function(u){return new Promise(function(d,h){r.decodeDracoFile(u,function(p){for(const g in p.attributes){const b=p.attributes[g],m=l[g];m!==void 0&&(b.normalized=m)}d(p)},a,c,Ln,h)})})}}class ey{constructor(){this.name=Rt.KHR_TEXTURE_TRANSFORM}extendTexture(e,t){return(t.texCoord===void 0||t.texCoord===e.channel)&&t.offset===void 0&&t.rotation===void 0&&t.scale===void 0||(e=e.clone(),t.texCoord!==void 0&&(e.channel=t.texCoord),t.offset!==void 0&&e.offset.fromArray(t.offset),t.rotation!==void 0&&(e.rotation=t.rotation),t.scale!==void 0&&e.repeat.fromArray(t.scale),e.needsUpdate=!0),e}}class ty{constructor(){this.name=Rt.KHR_MESH_QUANTIZATION}}class sf extends ho{constructor(e,t,n,r){super(e,t,n,r)}copySampleValue_(e){const t=this.resultBuffer,n=this.sampleValues,r=this.valueSize,s=e*r*3+r;for(let o=0;o!==r;o++)t[o]=n[s+o];return t}interpolate_(e,t,n,r){const s=this.resultBuffer,o=this.sampleValues,a=this.valueSize,l=a*2,c=a*3,u=r-t,d=(n-t)/u,h=d*d,p=h*d,g=e*c,b=g-c,m=-2*p+3*h,f=p-h,M=1-m,x=f-h+d;for(let _=0;_!==a;_++){const D=o[b+_+a],P=o[b+_+l]*u,T=o[g+_+a],N=o[g+_]*u;s[_]=M*D+x*P+m*T+f*N}return s}}const ny=new qe;class iy extends sf{interpolate_(e,t,n,r){const s=super.interpolate_(e,t,n,r);return ny.fromArray(s).normalize().toArray(s),s}}const $n={POINTS:0,LINES:1,LINE_LOOP:2,LINE_STRIP:3,TRIANGLES:4,TRIANGLE_STRIP:5,TRIANGLE_FAN:6},fs={5120:Int8Array,5121:Uint8Array,5122:Int16Array,5123:Uint16Array,5125:Uint32Array,5126:Float32Array},Kd={9728:Pn,9729:jn,9984:uh,9985:na,9986:Ks,9987:zi},Yd={33071:cr,33648:ma,10497:_s},Cc={SCALAR:1,VEC2:2,VEC3:3,VEC4:4,MAT2:4,MAT3:9,MAT4:16},Il={POSITION:"position",NORMAL:"normal",TANGENT:"tangent",TEXCOORD_0:"uv",TEXCOORD_1:"uv1",TEXCOORD_2:"uv2",TEXCOORD_3:"uv3",COLOR_0:"color",WEIGHTS_0:"skinWeight",JOINTS_0:"skinIndex"},ir={scale:"scale",translation:"position",rotation:"quaternion",weights:"morphTargetInfluences"},ry={CUBICSPLINE:void 0,LINEAR:oo,STEP:so},Pc={OPAQUE:"OPAQUE",MASK:"MASK",BLEND:"BLEND"};function sy(i){return i.DefaultMaterial===void 0&&(i.DefaultMaterial=new Ss({color:16777215,emissive:0,metalness:1,roughness:1,transparent:!1,depthTest:!0,side:ji})),i.DefaultMaterial}function Er(i,e,t){for(const n in t.extensions)i[n]===void 0&&(e.userData.gltfExtensions=e.userData.gltfExtensions||{},e.userData.gltfExtensions[n]=t.extensions[n])}function Bi(i,e){e.extras!==void 0&&(typeof e.extras=="object"?Object.assign(i.userData,e.extras):console.warn("THREE.GLTFLoader: Ignoring primitive type .extras, "+e.extras))}function oy(i,e,t){let n=!1,r=!1,s=!1;for(let c=0,u=e.length;c<u;c++){const d=e[c];if(d.POSITION!==void 0&&(n=!0),d.NORMAL!==void 0&&(r=!0),d.COLOR_0!==void 0&&(s=!0),n&&r&&s)break}if(!n&&!r&&!s)return Promise.resolve(i);const o=[],a=[],l=[];for(let c=0,u=e.length;c<u;c++){const d=e[c];if(n){const h=d.POSITION!==void 0?t.getDependency("accessor",d.POSITION):i.attributes.position;o.push(h)}if(r){const h=d.NORMAL!==void 0?t.getDependency("accessor",d.NORMAL):i.attributes.normal;a.push(h)}if(s){const h=d.COLOR_0!==void 0?t.getDependency("accessor",d.COLOR_0):i.attributes.color;l.push(h)}}return Promise.all([Promise.all(o),Promise.all(a),Promise.all(l)]).then(function(c){const u=c[0],d=c[1],h=c[2];return n&&(i.morphAttributes.position=u),r&&(i.morphAttributes.normal=d),s&&(i.morphAttributes.color=h),i.morphTargetsRelative=!0,i})}function ay(i,e){if(i.updateMorphTargets(),e.weights!==void 0)for(let t=0,n=e.weights.length;t<n;t++)i.morphTargetInfluences[t]=e.weights[t];if(e.extras&&Array.isArray(e.extras.targetNames)){const t=e.extras.targetNames;if(i.morphTargetInfluences.length===t.length){i.morphTargetDictionary={};for(let n=0,r=t.length;n<r;n++)i.morphTargetDictionary[t[n]]=n}else console.warn("THREE.GLTFLoader: Invalid extras.targetNames length. Ignoring names.")}}function cy(i){let e;const t=i.extensions&&i.extensions[Rt.KHR_DRACO_MESH_COMPRESSION];if(t?e="draco:"+t.bufferView+":"+t.indices+":"+Lc(t.attributes):e=i.indices+":"+Lc(i.attributes)+":"+i.mode,i.targets!==void 0)for(let n=0,r=i.targets.length;n<r;n++)e+=":"+Lc(i.targets[n]);return e}function Lc(i){let e="";const t=Object.keys(i).sort();for(let n=0,r=t.length;n<r;n++)e+=t[n]+":"+i[t[n]]+";";return e}function Fl(i){switch(i){case Int8Array:return 1/127;case Uint8Array:return 1/255;case Int16Array:return 1/32767;case Uint16Array:return 1/65535;default:throw new Error("THREE.GLTFLoader: Unsupported normalized accessor component type.")}}function ly(i){return i.search(/\.jpe?g($|\?)/i)>0||i.search(/^data\:image\/jpeg/)===0?"image/jpeg":i.search(/\.webp($|\?)/i)>0||i.search(/^data\:image\/webp/)===0?"image/webp":i.search(/\.ktx2($|\?)/i)>0||i.search(/^data\:image\/ktx2/)===0?"image/ktx2":"image/png"}const uy=new ot;class dy{constructor(e={},t={}){this.json=e,this.extensions={},this.plugins={},this.options=t,this.cache=new Iv,this.associations=new Map,this.primitiveCache={},this.nodeCache={},this.meshCache={refs:{},uses:{}},this.cameraCache={refs:{},uses:{}},this.lightCache={refs:{},uses:{}},this.sourceCache={},this.textureCache={},this.nodeNamesUsed={};let n=!1,r=-1,s=!1,o=-1;if(typeof navigator<"u"){const a=navigator.userAgent;n=/^((?!chrome|android).)*safari/i.test(a)===!0;const l=a.match(/Version\/(\d+)/);r=n&&l?parseInt(l[1],10):-1,s=a.indexOf("Firefox")>-1,o=s?a.match(/Firefox\/([0-9]+)\./)[1]:-1}typeof createImageBitmap>"u"||n&&r<17||s&&o<98?this.textureLoader=new gx(this.options.manager):this.textureLoader=new yx(this.options.manager),this.textureLoader.setCrossOrigin(this.options.crossOrigin),this.textureLoader.setRequestHeader(this.options.requestHeader),this.fileLoader=new Vh(this.options.manager),this.fileLoader.setResponseType("arraybuffer"),this.options.crossOrigin==="use-credentials"&&this.fileLoader.setWithCredentials(!0)}setExtensions(e){this.extensions=e}setPlugins(e){this.plugins=e}parse(e,t){const n=this,r=this.json,s=this.extensions;this.cache.removeAll(),this.nodeCache={},this._invokeAll(function(o){return o._markDefs&&o._markDefs()}),Promise.all(this._invokeAll(function(o){return o.beforeRoot&&o.beforeRoot()})).then(function(){return Promise.all([n.getDependencies("scene"),n.getDependencies("animation"),n.getDependencies("camera")])}).then(function(o){const a={scene:o[0][r.scene||0],scenes:o[0],animations:o[1],cameras:o[2],asset:r.asset,parser:n,userData:{}};return Er(s,a,r),Bi(a,r),Promise.all(n._invokeAll(function(l){return l.afterRoot&&l.afterRoot(a)})).then(function(){for(const l of a.scenes)l.updateMatrixWorld();e(a)})}).catch(t)}_markDefs(){const e=this.json.nodes||[],t=this.json.skins||[],n=this.json.meshes||[];for(let r=0,s=t.length;r<s;r++){const o=t[r].joints;for(let a=0,l=o.length;a<l;a++)e[o[a]].isBone=!0}for(let r=0,s=e.length;r<s;r++){const o=e[r];o.mesh!==void 0&&(this._addNodeRef(this.meshCache,o.mesh),o.skin!==void 0&&(n[o.mesh].isSkinnedMesh=!0)),o.camera!==void 0&&this._addNodeRef(this.cameraCache,o.camera)}}_addNodeRef(e,t){t!==void 0&&(e.refs[t]===void 0&&(e.refs[t]=e.uses[t]=0),e.refs[t]++)}_getNodeRef(e,t,n){if(e.refs[t]<=1)return n;const r=n.clone(),s=(o,a)=>{const l=this.associations.get(o);l!=null&&this.associations.set(a,l);for(const[c,u]of o.children.entries())s(u,a.children[c])};return s(n,r),r.name+="_instance_"+e.uses[t]++,r}_invokeOne(e){const t=Object.values(this.plugins);t.push(this);for(let n=0;n<t.length;n++){const r=e(t[n]);if(r)return r}return null}_invokeAll(e){const t=Object.values(this.plugins);t.unshift(this);const n=[];for(let r=0;r<t.length;r++){const s=e(t[r]);s&&n.push(s)}return n}getDependency(e,t){const n=e+":"+t;let r=this.cache.get(n);if(!r){switch(e){case"scene":r=this.loadScene(t);break;case"node":r=this._invokeOne(function(s){return s.loadNode&&s.loadNode(t)});break;case"mesh":r=this._invokeOne(function(s){return s.loadMesh&&s.loadMesh(t)});break;case"accessor":r=this.loadAccessor(t);break;case"bufferView":r=this._invokeOne(function(s){return s.loadBufferView&&s.loadBufferView(t)});break;case"buffer":r=this.loadBuffer(t);break;case"material":r=this._invokeOne(function(s){return s.loadMaterial&&s.loadMaterial(t)});break;case"texture":r=this._invokeOne(function(s){return s.loadTexture&&s.loadTexture(t)});break;case"skin":r=this.loadSkin(t);break;case"animation":r=this._invokeOne(function(s){return s.loadAnimation&&s.loadAnimation(t)});break;case"camera":r=this.loadCamera(t);break;default:if(r=this._invokeOne(function(s){return s!=this&&s.getDependency&&s.getDependency(e,t)}),!r)throw new Error("Unknown type: "+e);break}this.cache.add(n,r)}return r}getDependencies(e){let t=this.cache.get(e);if(!t){const n=this,r=this.json[e+(e==="mesh"?"es":"s")]||[];t=Promise.all(r.map(function(s,o){return n.getDependency(e,o)})),this.cache.add(e,t)}return t}loadBuffer(e){const t=this.json.buffers[e],n=this.fileLoader;if(t.type&&t.type!=="arraybuffer")throw new Error("THREE.GLTFLoader: "+t.type+" buffer type is not supported.");if(t.uri===void 0&&e===0)return Promise.resolve(this.extensions[Rt.KHR_BINARY_GLTF].body);const r=this.options;return new Promise(function(s,o){n.load(eo.resolveURL(t.uri,r.path),s,void 0,function(){o(new Error('THREE.GLTFLoader: Failed to load buffer "'+t.uri+'".'))})})}loadBufferView(e){const t=this.json.bufferViews[e];return this.getDependency("buffer",t.buffer).then(function(n){const r=t.byteLength||0,s=t.byteOffset||0;return n.slice(s,s+r)})}loadAccessor(e){const t=this,n=this.json,r=this.json.accessors[e];if(r.bufferView===void 0&&r.sparse===void 0){const o=Cc[r.type],a=fs[r.componentType],l=r.normalized===!0,c=new a(r.count*o);return Promise.resolve(new yn(c,o,l))}const s=[];return r.bufferView!==void 0?s.push(this.getDependency("bufferView",r.bufferView)):s.push(null),r.sparse!==void 0&&(s.push(this.getDependency("bufferView",r.sparse.indices.bufferView)),s.push(this.getDependency("bufferView",r.sparse.values.bufferView))),Promise.all(s).then(function(o){const a=o[0],l=Cc[r.type],c=fs[r.componentType],u=c.BYTES_PER_ELEMENT,d=u*l,h=r.byteOffset||0,p=r.bufferView!==void 0?n.bufferViews[r.bufferView].byteStride:void 0,g=r.normalized===!0;let b,m;if(p&&p!==d){const f=Math.floor(h/p),M="InterleavedBuffer:"+r.bufferView+":"+r.componentType+":"+f+":"+r.count;let x=t.cache.get(M);x||(b=new c(a,f*p,r.count*p/u),x=new j_(b,p/u),t.cache.add(M,x)),m=new $l(x,l,h%p/u,g)}else a===null?b=new c(r.count*l):b=new c(a,h,r.count*l),m=new yn(b,l,g);if(r.sparse!==void 0){const f=Cc.SCALAR,M=fs[r.sparse.indices.componentType],x=r.sparse.indices.byteOffset||0,_=r.sparse.values.byteOffset||0,D=new M(o[1],x,r.sparse.count*f),P=new c(o[2],_,r.sparse.count*l);a!==null&&(m=new yn(m.array.slice(),m.itemSize,m.normalized)),m.normalized=!1;for(let T=0,N=D.length;T<N;T++){const v=D[T];if(m.setX(v,P[T*l]),l>=2&&m.setY(v,P[T*l+1]),l>=3&&m.setZ(v,P[T*l+2]),l>=4&&m.setW(v,P[T*l+3]),l>=5)throw new Error("THREE.GLTFLoader: Unsupported itemSize in sparse BufferAttribute.")}m.normalized=g}return m})}loadTexture(e){const t=this.json,n=this.options,s=t.textures[e].source,o=t.images[s];let a=this.textureLoader;if(o.uri){const l=n.manager.getHandler(o.uri);l!==null&&(a=l)}return this.loadTextureImage(e,s,a)}loadTextureImage(e,t,n){const r=this,s=this.json,o=s.textures[e],a=s.images[t],l=(a.uri||a.bufferView)+":"+o.sampler;if(this.textureCache[l])return this.textureCache[l];const c=this.loadImageSource(t,n).then(function(u){u.flipY=!1,u.name=o.name||a.name||"",u.name===""&&typeof a.uri=="string"&&a.uri.startsWith("data:image/")===!1&&(u.name=a.uri);const h=(s.samplers||{})[o.sampler]||{};return u.magFilter=Kd[h.magFilter]||jn,u.minFilter=Kd[h.minFilter]||zi,u.wrapS=Yd[h.wrapS]||_s,u.wrapT=Yd[h.wrapT]||_s,u.generateMipmaps=!u.isCompressedTexture&&u.minFilter!==Pn&&u.minFilter!==jn,r.associations.set(u,{textures:e}),u}).catch(function(){return null});return this.textureCache[l]=c,c}loadImageSource(e,t){const n=this,r=this.json,s=this.options;if(this.sourceCache[e]!==void 0)return this.sourceCache[e].then(d=>d.clone());const o=r.images[e],a=self.URL||self.webkitURL;let l=o.uri||"",c=!1;if(o.bufferView!==void 0)l=n.getDependency("bufferView",o.bufferView).then(function(d){c=!0;const h=new Blob([d],{type:o.mimeType});return l=a.createObjectURL(h),l});else if(o.uri===void 0)throw new Error("THREE.GLTFLoader: Image "+e+" is missing URI and bufferView");const u=Promise.resolve(l).then(function(d){return new Promise(function(h,p){let g=h;t.isImageBitmapLoader===!0&&(g=function(b){const m=new un(b);m.needsUpdate=!0,h(m)}),t.load(eo.resolveURL(d,s.path),g,void 0,p)})}).then(function(d){return c===!0&&a.revokeObjectURL(l),Bi(d,o),d.userData.mimeType=o.mimeType||ly(o.uri),d}).catch(function(d){throw console.error("THREE.GLTFLoader: Couldn't load texture",l),d});return this.sourceCache[e]=u,u}assignTexture(e,t,n,r){const s=this;return this.getDependency("texture",n.index).then(function(o){if(!o)return null;if(n.texCoord!==void 0&&n.texCoord>0&&(o=o.clone(),o.channel=n.texCoord),s.extensions[Rt.KHR_TEXTURE_TRANSFORM]){const a=n.extensions!==void 0?n.extensions[Rt.KHR_TEXTURE_TRANSFORM]:void 0;if(a){const l=s.associations.get(o);o=s.extensions[Rt.KHR_TEXTURE_TRANSFORM].extendTexture(o,a),s.associations.set(o,l)}}return r!==void 0&&(o.colorSpace=r),e[t]=o,o})}assignFinalMaterial(e){const t=e.geometry;let n=e.material;const r=t.attributes.tangent===void 0,s=t.attributes.color!==void 0,o=t.attributes.normal===void 0;if(e.isPoints){const a="PointsMaterial:"+n.uuid;let l=this.cache.get(a);l||(l=new zh,hi.prototype.copy.call(l,n),l.color.copy(n.color),l.map=n.map,l.sizeAttenuation=!1,this.cache.add(a,l)),n=l}else if(e.isLine){const a="LineBasicMaterial:"+n.uuid;let l=this.cache.get(a);l||(l=new Bh,hi.prototype.copy.call(l,n),l.color.copy(n.color),l.map=n.map,this.cache.add(a,l)),n=l}if(r||s||o){let a="ClonedMaterial:"+n.uuid+":";r&&(a+="derivative-tangents:"),s&&(a+="vertex-colors:"),o&&(a+="flat-shading:");let l=this.cache.get(a);l||(l=n.clone(),s&&(l.vertexColors=!0),o&&(l.flatShading=!0),r&&(l.normalScale&&(l.normalScale.y*=-1),l.clearcoatNormalScale&&(l.clearcoatNormalScale.y*=-1)),this.cache.add(a,l),this.associations.set(l,this.associations.get(n))),n=l}e.material=n}getMaterialType(){return Ss}loadMaterial(e){const t=this,n=this.json,r=this.extensions,s=n.materials[e];let o;const a={},l=s.extensions||{},c=[];if(l[Rt.KHR_MATERIALS_UNLIT]){const d=r[Rt.KHR_MATERIALS_UNLIT];o=d.getMaterialType(),c.push(d.extendParams(a,s,t))}else{const d=s.pbrMetallicRoughness||{};if(a.color=new rt(1,1,1),a.opacity=1,Array.isArray(d.baseColorFactor)){const h=d.baseColorFactor;a.color.setRGB(h[0],h[1],h[2],Ln),a.opacity=h[3]}d.baseColorTexture!==void 0&&c.push(t.assignTexture(a,"map",d.baseColorTexture,ln)),a.metalness=d.metallicFactor!==void 0?d.metallicFactor:1,a.roughness=d.roughnessFactor!==void 0?d.roughnessFactor:1,d.metallicRoughnessTexture!==void 0&&(c.push(t.assignTexture(a,"metalnessMap",d.metallicRoughnessTexture)),c.push(t.assignTexture(a,"roughnessMap",d.metallicRoughnessTexture))),o=this._invokeOne(function(h){return h.getMaterialType&&h.getMaterialType(e)}),c.push(Promise.all(this._invokeAll(function(h){return h.extendMaterialParams&&h.extendMaterialParams(e,a)})))}s.doubleSided===!0&&(a.side=xi);const u=s.alphaMode||Pc.OPAQUE;if(u===Pc.BLEND?(a.transparent=!0,a.depthWrite=!1):(a.transparent=!1,u===Pc.MASK&&(a.alphaTest=s.alphaCutoff!==void 0?s.alphaCutoff:.5)),s.normalTexture!==void 0&&o!==Gi&&(c.push(t.assignTexture(a,"normalMap",s.normalTexture)),a.normalScale=new ut(1,1),s.normalTexture.scale!==void 0)){const d=s.normalTexture.scale;a.normalScale.set(d,d)}if(s.occlusionTexture!==void 0&&o!==Gi&&(c.push(t.assignTexture(a,"aoMap",s.occlusionTexture)),s.occlusionTexture.strength!==void 0&&(a.aoMapIntensity=s.occlusionTexture.strength)),s.emissiveFactor!==void 0&&o!==Gi){const d=s.emissiveFactor;a.emissive=new rt().setRGB(d[0],d[1],d[2],Ln)}return s.emissiveTexture!==void 0&&o!==Gi&&c.push(t.assignTexture(a,"emissiveMap",s.emissiveTexture,ln)),Promise.all(c).then(function(){const d=new o(a);return s.name&&(d.name=s.name),Bi(d,s),t.associations.set(d,{materials:e}),s.extensions&&Er(r,d,s),d})}createUniqueName(e){const t=Gt.sanitizeNodeName(e||"");return t in this.nodeNamesUsed?t+"_"+ ++this.nodeNamesUsed[t]:(this.nodeNamesUsed[t]=0,t)}loadGeometries(e){const t=this,n=this.extensions,r=this.primitiveCache;function s(a){return n[Rt.KHR_DRACO_MESH_COMPRESSION].decodePrimitive(a,t).then(function(l){return $d(l,a,t)})}const o=[];for(let a=0,l=e.length;a<l;a++){const c=e[a],u=cy(c),d=r[u];if(d)o.push(d.promise);else{let h;c.extensions&&c.extensions[Rt.KHR_DRACO_MESH_COMPRESSION]?h=s(c):h=$d(new Ei,c,t),r[u]={primitive:c,promise:h},o.push(h)}}return Promise.all(o)}loadMesh(e){const t=this,n=this.json,r=this.extensions,s=n.meshes[e],o=s.primitives,a=[];for(let l=0,c=o.length;l<c;l++){const u=o[l].material===void 0?sy(this.cache):this.getDependency("material",o[l].material);a.push(u)}return a.push(t.loadGeometries(o)),Promise.all(a).then(function(l){const c=l.slice(0,l.length-1),u=l[l.length-1],d=[];for(let p=0,g=u.length;p<g;p++){const b=u[p],m=o[p];let f;const M=c[p];if(m.mode===$n.TRIANGLES||m.mode===$n.TRIANGLE_STRIP||m.mode===$n.TRIANGLE_FAN||m.mode===void 0)f=s.isSkinnedMesh===!0?new Q_(b,M):new Xt(b,M),f.isSkinnedMesh===!0&&f.normalizeSkinWeights(),m.mode===$n.TRIANGLE_STRIP?f.geometry=Xd(f.geometry,vh):m.mode===$n.TRIANGLE_FAN&&(f.geometry=Xd(f.geometry,vl));else if(m.mode===$n.LINES)f=new Z_(b,M);else if(m.mode===$n.LINE_STRIP)f=new Jl(b,M);else if(m.mode===$n.LINE_LOOP)f=new J_(b,M);else if(m.mode===$n.POINTS)f=new ex(b,M);else throw new Error("THREE.GLTFLoader: Primitive mode unsupported: "+m.mode);Object.keys(f.geometry.morphAttributes).length>0&&ay(f,s),f.name=t.createUniqueName(s.name||"mesh_"+e),Bi(f,s),m.extensions&&Er(r,f,m),t.assignFinalMaterial(f),d.push(f)}for(let p=0,g=d.length;p<g;p++)t.associations.set(d[p],{meshes:e,primitives:p});if(d.length===1)return s.extensions&&Er(r,d[0],s),d[0];const h=new Dr;s.extensions&&Er(r,h,s),t.associations.set(h,{meshes:e});for(let p=0,g=d.length;p<g;p++)h.add(d[p]);return h})}loadCamera(e){let t;const n=this.json.cameras[e],r=n[n.type];if(!r){console.warn("THREE.GLTFLoader: Missing camera parameters.");return}return n.type==="perspective"?t=new vn(vt.radToDeg(r.yfov),r.aspectRatio||1,r.znear||1,r.zfar||2e6):n.type==="orthographic"&&(t=new Ql(-r.xmag,r.xmag,r.ymag,-r.ymag,r.znear,r.zfar)),n.name&&(t.name=this.createUniqueName(n.name)),Bi(t,n),Promise.resolve(t)}loadSkin(e){const t=this.json.skins[e],n=[];for(let r=0,s=t.joints.length;r<s;r++)n.push(this._loadNodeShallow(t.joints[r]));return t.inverseBindMatrices!==void 0?n.push(this.getDependency("accessor",t.inverseBindMatrices)):n.push(null),Promise.all(n).then(function(r){const s=r.pop(),o=r,a=[],l=[];for(let c=0,u=o.length;c<u;c++){const d=o[c];if(d){a.push(d);const h=new ot;s!==null&&h.fromArray(s.array,c*16),l.push(h)}else console.warn('THREE.GLTFLoader: Joint "%s" could not be found.',t.joints[c])}return new Pa(a,l)})}loadAnimation(e){const t=this.json,n=this,r=t.animations[e],s=r.name?r.name:"animation_"+e,o=[],a=[],l=[],c=[],u=[];for(let d=0,h=r.channels.length;d<h;d++){const p=r.channels[d],g=r.samplers[p.sampler],b=p.target,m=b.node,f=r.parameters!==void 0?r.parameters[g.input]:g.input,M=r.parameters!==void 0?r.parameters[g.output]:g.output;b.node!==void 0&&(o.push(this.getDependency("node",m)),a.push(this.getDependency("accessor",f)),l.push(this.getDependency("accessor",M)),c.push(g),u.push(b))}return Promise.all([Promise.all(o),Promise.all(a),Promise.all(l),Promise.all(c),Promise.all(u)]).then(function(d){const h=d[0],p=d[1],g=d[2],b=d[3],m=d[4],f=[];for(let M=0,x=h.length;M<x;M++){const _=h[M],D=p[M],P=g[M],T=b[M],N=m[M];if(_===void 0)continue;_.updateMatrix&&_.updateMatrix();const v=n._createAnimationTracks(_,D,P,T,N);if(v)for(let y=0;y<v.length;y++)f.push(v[y])}return new lx(s,void 0,f)})}createNodeMesh(e){const t=this.json,n=this,r=t.nodes[e];return r.mesh===void 0?null:n.getDependency("mesh",r.mesh).then(function(s){const o=n._getNodeRef(n.meshCache,r.mesh,s);return r.weights!==void 0&&o.traverse(function(a){if(a.isMesh)for(let l=0,c=r.weights.length;l<c;l++)a.morphTargetInfluences[l]=r.weights[l]}),o})}loadNode(e){const t=this.json,n=this,r=t.nodes[e],s=n._loadNodeShallow(e),o=[],a=r.children||[];for(let c=0,u=a.length;c<u;c++)o.push(n.getDependency("node",a[c]));const l=r.skin===void 0?Promise.resolve(null):n.getDependency("skin",r.skin);return Promise.all([s,Promise.all(o),l]).then(function(c){const u=c[0],d=c[1],h=c[2];h!==null&&u.traverse(function(p){p.isSkinnedMesh&&p.bind(h,uy)});for(let p=0,g=d.length;p<g;p++)u.add(d[p]);return u})}_loadNodeShallow(e){const t=this.json,n=this.extensions,r=this;if(this.nodeCache[e]!==void 0)return this.nodeCache[e];const s=t.nodes[e],o=s.name?r.createUniqueName(s.name):"",a=[],l=r._invokeOne(function(c){return c.createNodeMesh&&c.createNodeMesh(e)});return l&&a.push(l),s.camera!==void 0&&a.push(r.getDependency("camera",s.camera).then(function(c){return r._getNodeRef(r.cameraCache,s.camera,c)})),r._invokeAll(function(c){return c.createNodeAttachment&&c.createNodeAttachment(e)}).forEach(function(c){a.push(c)}),this.nodeCache[e]=Promise.all(a).then(function(c){let u;if(s.isBone===!0?u=new Zl:c.length>1?u=new Dr:c.length===1?u=c[0]:u=new en,u!==c[0])for(let d=0,h=c.length;d<h;d++)u.add(c[d]);if(s.name&&(u.userData.name=s.name,u.name=o),Bi(u,s),s.extensions&&Er(n,u,s),s.matrix!==void 0){const d=new ot;d.fromArray(s.matrix),u.applyMatrix4(d)}else s.translation!==void 0&&u.position.fromArray(s.translation),s.rotation!==void 0&&u.quaternion.fromArray(s.rotation),s.scale!==void 0&&u.scale.fromArray(s.scale);return r.associations.has(u)||r.associations.set(u,{}),r.associations.get(u).nodes=e,u}),this.nodeCache[e]}loadScene(e){const t=this.extensions,n=this.json.scenes[e],r=this,s=new Dr;n.name&&(s.name=r.createUniqueName(n.name)),Bi(s,n),n.extensions&&Er(t,s,n);const o=n.nodes||[],a=[];for(let l=0,c=o.length;l<c;l++)a.push(r.getDependency("node",o[l]));return Promise.all(a).then(function(l){for(let u=0,d=l.length;u<d;u++)s.add(l[u]);const c=u=>{const d=new Map;for(const[h,p]of r.associations)(h instanceof hi||h instanceof un)&&d.set(h,p);return u.traverse(h=>{const p=r.associations.get(h);p!=null&&d.set(h,p)}),d};return r.associations=c(s),s})}_createAnimationTracks(e,t,n,r,s){const o=[],a=e.name?e.name:e.uuid,l=[];ir[s.path]===ir.weights?e.traverse(function(h){h.morphTargetInfluences&&l.push(h.name?h.name:h.uuid)}):l.push(a);let c;switch(ir[s.path]){case ir.weights:c=ws;break;case ir.rotation:c=Es;break;case ir.position:case ir.scale:c=As;break;default:n.itemSize===1?c=ws:c=As;break}const u=r.interpolation!==void 0?ry[r.interpolation]:oo,d=this._getArrayFromAccessor(n);for(let h=0,p=l.length;h<p;h++){const g=new c(l[h]+"."+ir[s.path],t.array,d,u);r.interpolation==="CUBICSPLINE"&&this._createCubicSplineTrackInterpolant(g),o.push(g)}return o}_getArrayFromAccessor(e){let t=e.array;if(e.normalized){const n=Fl(t.constructor),r=new Float32Array(t.length);for(let s=0,o=t.length;s<o;s++)r[s]=t[s]*n;t=r}return t}_createCubicSplineTrackInterpolant(e){e.createInterpolant=function(n){const r=this instanceof Es?iy:sf;return new r(this.times,this.values,this.getValueSize()/3,n)},e.createInterpolant.isInterpolantFactoryMethodGLTFCubicSpline=!0}}function hy(i,e,t){const n=e.attributes,r=new an;if(n.POSITION!==void 0){const a=t.json.accessors[n.POSITION],l=a.min,c=a.max;if(l!==void 0&&c!==void 0){if(r.set(new A(l[0],l[1],l[2]),new A(c[0],c[1],c[2])),a.normalized){const u=Fl(fs[a.componentType]);r.min.multiplyScalar(u),r.max.multiplyScalar(u)}}else{console.warn("THREE.GLTFLoader: Missing min/max properties for accessor POSITION.");return}}else return;const s=e.targets;if(s!==void 0){const a=new A,l=new A;for(let c=0,u=s.length;c<u;c++){const d=s[c];if(d.POSITION!==void 0){const h=t.json.accessors[d.POSITION],p=h.min,g=h.max;if(p!==void 0&&g!==void 0){if(l.setX(Math.max(Math.abs(p[0]),Math.abs(g[0]))),l.setY(Math.max(Math.abs(p[1]),Math.abs(g[1]))),l.setZ(Math.max(Math.abs(p[2]),Math.abs(g[2]))),h.normalized){const b=Fl(fs[h.componentType]);l.multiplyScalar(b)}a.max(l)}else console.warn("THREE.GLTFLoader: Missing min/max properties for accessor POSITION.")}}r.expandByVector(a)}i.boundingBox=r;const o=new wi;r.getCenter(o.center),o.radius=r.min.distanceTo(r.max)/2,i.boundingSphere=o}function $d(i,e,t){const n=e.attributes,r=[];function s(o,a){return t.getDependency("accessor",o).then(function(l){i.setAttribute(a,l)})}for(const o in n){const a=Il[o]||o.toLowerCase();a in i.attributes||r.push(s(n[o],a))}if(e.indices!==void 0&&!i.index){const o=t.getDependency("accessor",e.indices).then(function(a){i.setIndex(a)});r.push(o)}return Pt.workingColorSpace!==Ln&&"COLOR_0"in n&&console.warn(`THREE.GLTFLoader: Converting vertex colors from "srgb-linear" to "${Pt.workingColorSpace}" not supported.`),Bi(i,e),hy(i,e,t),Promise.all(r).then(function(){return e.targets!==void 0?oy(i,e.targets,t):i})}var fy=(function(){var i="b9H79Tebbbe8Fv9Gbb9Gvuuuuueu9Giuuub9Geueu9Giuuueuikqbeeedddillviebeoweuec:q;iekr;leDo9TW9T9VV95dbH9F9F939H79T9F9J9H229F9Jt9VV7bb8A9TW79O9V9Wt9F9KW9J9V9KW9wWVtW949c919M9MWVbeY9TW79O9V9Wt9F9KW9J9V9KW69U9KW949c919M9MWVbdE9TW79O9V9Wt9F9KW9J9V9KW69U9KW949tWG91W9U9JWbiL9TW79O9V9Wt9F9KW9J9V9KWS9P2tWV9p9JtblK9TW79O9V9Wt9F9KW9J9V9KWS9P2tWV9r919HtbvL9TW79O9V9Wt9F9KW9J9V9KWS9P2tWVT949Wbol79IV9Rbrq:P8Yqdbk;3sezu8Jjjjjbcj;eb9Rgv8Kjjjjbc9:hodnadcefal0mbcuhoaiRbbc:Ge9hmbavaialfgrad9Radz1jjjbhwcj;abad9UhoaicefhldnadTmbaoc;WFbGgocjdaocjd6EhDcbhqinaqae9pmeaDaeaq9RaqaDfae6Egkcsfgocl4cifcd4hxdndndndnaoc9WGgmTmbcbhPcehsawcjdfhzalhHinaraH9Rax6midnaraHaxfgl9RcK6mbczhoinawcj;cbfaogifgoc9WfhOdndndndndnaHaic9WfgAco4fRbbaAci4coG4ciGPlbedibkaO9cb83ibaOcwf9cb83ibxikaOalRblalRbbgAco4gCaCciSgCE86bbaocGfalclfaCfgORbbaAcl4ciGgCaCciSgCE86bbaocVfaOaCfgORbbaAcd4ciGgCaCciSgCE86bbaoc7faOaCfgORbbaAciGgAaAciSgAE86bbaoctfaOaAfgARbbalRbegOco4gCaCciSgCE86bbaoc91faAaCfgARbbaOcl4ciGgCaCciSgCE86bbaoc4faAaCfgARbbaOcd4ciGgCaCciSgCE86bbaoc93faAaCfgARbbaOciGgOaOciSgOE86bbaoc94faAaOfgARbbalRbdgOco4gCaCciSgCE86bbaoc95faAaCfgARbbaOcl4ciGgCaCciSgCE86bbaoc96faAaCfgARbbaOcd4ciGgCaCciSgCE86bbaoc97faAaCfgARbbaOciGgOaOciSgOE86bbaoc98faAaOfgORbbalRbiglco4gAaAciSgAE86bbaoc99faOaAfgORbbalcl4ciGgAaAciSgAE86bbaoc9:faOaAfgORbbalcd4ciGgAaAciSgAE86bbaocufaOaAfgoRbbalciGglalciSglE86bbaoalfhlxdkaOalRbwalRbbgAcl4gCaCcsSgCE86bbaocGfalcwfaCfgORbbaAcsGgAaAcsSgAE86bbaocVfaOaAfgORbbalRbegAcl4gCaCcsSgCE86bbaoc7faOaCfgORbbaAcsGgAaAcsSgAE86bbaoctfaOaAfgORbbalRbdgAcl4gCaCcsSgCE86bbaoc91faOaCfgORbbaAcsGgAaAcsSgAE86bbaoc4faOaAfgORbbalRbigAcl4gCaCcsSgCE86bbaoc93faOaCfgORbbaAcsGgAaAcsSgAE86bbaoc94faOaAfgORbbalRblgAcl4gCaCcsSgCE86bbaoc95faOaCfgORbbaAcsGgAaAcsSgAE86bbaoc96faOaAfgORbbalRbvgAcl4gCaCcsSgCE86bbaoc97faOaCfgORbbaAcsGgAaAcsSgAE86bbaoc98faOaAfgORbbalRbogAcl4gCaCcsSgCE86bbaoc99faOaCfgORbbaAcsGgAaAcsSgAE86bbaoc9:faOaAfgORbbalRbrglcl4gAaAcsSgAE86bbaocufaOaAfgoRbbalcsGglalcsSglE86bbaoalfhlxekaOal8Pbb83bbaOcwfalcwf8Pbb83bbalczfhlkdnaiam9pmbaiczfhoaral9RcL0mekkaiam6mialTmidnakTmbawaPfRbbhOcbhoazhiinaiawcj;cbfaofRbbgAce4cbaAceG9R7aOfgO86bbaiadfhiaocefgoak9hmbkkazcefhzaPcefgPad6hsalhHaPad9hmexvkkcbhlasceGmdxikalaxad2fhCdnakTmbcbhHcehsawcjdfhminaral9Rax6mialTmdalaxfhlawaHfRbbhOcbhoamhiinaiawcj;cbfaofRbbgAce4cbaAceG9R7aOfgO86bbaiadfhiaocefgoak9hmbkamcefhmaHcefgHad6hsaHad9hmbkaChlxikcbhocehsinaral9Rax6mdalTmealaxfhlaocefgoad6hsadao9hmbkaChlxdkcbhlasceGTmekc9:hoxikabaqad2fawcjdfakad2z1jjjb8Aawawcjdfakcufad2fadz1jjjb8Aakaqfhqalmbkc9:hoxekcbc99aral9Radcaadca0ESEhokavcj;ebf8Kjjjjbaok;yzeHu8Jjjjjbc;ae9Rgv8Kjjjjbc9:hodnaeci9UgrcHfal0mbcuhoaiRbbgwc;WeGc;Ge9hmbawcsGgDce0mbavc;abfcFecjez:jjjjb8AavcUf9cu83ibavc8Wf9cu83ibavcyf9cu83ibavcaf9cu83ibavcKf9cu83ibavczf9cu83ibav9cu83iwav9cu83ibaialfc9WfhqaicefgwarfhodnaeTmbcmcsaDceSEhkcbhxcbhmcbhDcbhicbhlindnaoaq9nmbc9:hoxikdndnawRbbgrc;Ve0mbavc;abfalarcl4cu7fcsGcitfgPydlhsaPydbhzdnarcsGgPak9pmbavaiarcu7fcsGcdtfydbaxaPEhraPThPdndnadcd9hmbabaDcetfgHaz87ebaHcdfas87ebaHclfar87ebxekabaDcdtfgHazBdbaHclfasBdbaHcwfarBdbkaxaPfhxavc;abfalcitfgHarBdbaHasBdlavaicdtfarBdbavc;abfalcefcsGglcitfgHazBdbaHarBdlaiaPfhialcefhlxdkdndnaPcsSmbamaPfaPc987fcefhmxekaocefhrao8SbbgPcFeGhHdndnaPcu9mmbarhoxekaocvfhoaHcFbGhHcrhPdninar8SbbgOcFbGaPtaHVhHaOcu9kmearcefhraPcrfgPc8J9hmbxdkkarcefhokaHce4cbaHceG9R7amfhmkdndnadcd9hmbabaDcetfgraz87ebarcdfas87ebarclfam87ebxekabaDcdtfgrazBdbarclfasBdbarcwfamBdbkavc;abfalcitfgramBdbarasBdlavaicdtfamBdbavc;abfalcefcsGglcitfgrazBdbaramBdlaicefhialcefhlxekdnarcpe0mbaxcefgOavaiaqarcsGfRbbgPcl49RcsGcdtfydbaPcz6gHEhravaiaP9RcsGcdtfydbaOaHfgsaPcsGgOEhPaOThOdndnadcd9hmbabaDcetfgzax87ebazcdfar87ebazclfaP87ebxekabaDcdtfgzaxBdbazclfarBdbazcwfaPBdbkavaicdtfaxBdbavc;abfalcitfgzarBdbazaxBdlavaicefgicsGcdtfarBdbavc;abfalcefcsGcitfgzaPBdbazarBdlavaiaHfcsGgicdtfaPBdbavc;abfalcdfcsGglcitfgraxBdbaraPBdlalcefhlaiaOfhiasaOfhxxekaxcbaoRbbgzEgAarc;:eSgrfhsazcsGhCazcl4hXdndnazcs0mbascefhOxekashOavaiaX9RcsGcdtfydbhskdndnaCmbaOcefhxxekaOhxavaiaz9RcsGcdtfydbhOkdndnarTmbaocefhrxekaocdfhrao8SbegHcFeGhPdnaHcu9kmbaocofhAaPcFbGhPcrhodninar8SbbgHcFbGaotaPVhPaHcu9kmearcefhraocrfgoc8J9hmbkaAhrxekarcefhrkaPce4cbaPceG9R7amfgmhAkdndnaXcsSmbarhPxekarcefhPar8SbbgocFeGhHdnaocu9kmbarcvfhsaHcFbGhHcrhodninaP8SbbgrcFbGaotaHVhHarcu9kmeaPcefhPaocrfgoc8J9hmbkashPxekaPcefhPkaHce4cbaHceG9R7amfgmhskdndnaCcsSmbaPhoxekaPcefhoaP8SbbgrcFeGhHdnarcu9kmbaPcvfhOaHcFbGhHcrhrdninao8SbbgPcFbGartaHVhHaPcu9kmeaocefhoarcrfgrc8J9hmbkaOhoxekaocefhokaHce4cbaHceG9R7amfgmhOkdndnadcd9hmbabaDcetfgraA87ebarcdfas87ebarclfaO87ebxekabaDcdtfgraABdbarclfasBdbarcwfaOBdbkavc;abfalcitfgrasBdbaraABdlavaicdtfaABdbavc;abfalcefcsGcitfgraOBdbarasBdlavaicefgicsGcdtfasBdbavc;abfalcdfcsGcitfgraABdbaraOBdlavaiazcz6aXcsSVfgicsGcdtfaOBdbaiaCTaCcsSVfhialcifhlkawcefhwalcsGhlaicsGhiaDcifgDae6mbkkcbc99aoaqSEhokavc;aef8Kjjjjbaok:llevu8Jjjjjbcz9Rhvc9:hodnaecvfal0mbcuhoaiRbbc;:eGc;qe9hmbav9cb83iwaicefhraialfc98fhwdnaeTmbdnadcdSmbcbhDindnaraw6mbc9:skarcefhoar8SbbglcFeGhidndnalcu9mmbaohrxekarcvfhraicFbGhicrhldninao8SbbgdcFbGaltaiVhiadcu9kmeaocefhoalcrfglc8J9hmbxdkkaocefhrkabaDcdtfaicd4cbaice4ceG9R7avcwfaiceGcdtVgoydbfglBdbaoalBdbaDcefgDae9hmbxdkkcbhDindnaraw6mbc9:skarcefhoar8SbbglcFeGhidndnalcu9mmbaohrxekarcvfhraicFbGhicrhldninao8SbbgdcFbGaltaiVhiadcu9kmeaocefhoalcrfglc8J9hmbxdkkaocefhrkabaDcetfaicd4cbaice4ceG9R7avcwfaiceGcdtVgoydbfgl87ebaoalBdbaDcefgDae9hmbkkcbc99arawSEhokaok:Lvoeue99dud99eud99dndnadcl9hmbaeTmeindndnabcdfgd8Sbb:Yab8Sbbgi:Ygl:l:tabcefgv8Sbbgo:Ygr:l:tgwJbb;:9cawawNJbbbbawawJbbbb9GgDEgq:mgkaqaicb9iEalMgwawNakaqaocb9iEarMgqaqNMM:r:vglNJbbbZJbbb:;aDEMgr:lJbbb9p9DTmbar:Ohixekcjjjj94hikadai86bbdndnaqalNJbbbZJbbb:;aqJbbbb9GEMgq:lJbbb9p9DTmbaq:Ohdxekcjjjj94hdkavad86bbdndnawalNJbbbZJbbb:;awJbbbb9GEMgw:lJbbb9p9DTmbaw:Ohdxekcjjjj94hdkabad86bbabclfhbaecufgembxdkkaeTmbindndnabclfgd8Ueb:Yab8Uebgi:Ygl:l:tabcdfgv8Uebgo:Ygr:l:tgwJb;:FSawawNJbbbbawawJbbbb9GgDEgq:mgkaqaicb9iEalMgwawNakaqaocb9iEarMgqaqNMM:r:vglNJbbbZJbbb:;aDEMgr:lJbbb9p9DTmbar:Ohixekcjjjj94hikadai87ebdndnaqalNJbbbZJbbb:;aqJbbbb9GEMgq:lJbbb9p9DTmbaq:Ohdxekcjjjj94hdkavad87ebdndnawalNJbbbZJbbb:;awJbbbb9GEMgw:lJbbb9p9DTmbaw:Ohdxekcjjjj94hdkabad87ebabcwfhbaecufgembkkk;siliui99iue99dnaeTmbcbhiabhlindndnJ;Zl81Zalcof8UebgvciV:Y:vgoal8Ueb:YNgrJb;:FSNJbbbZJbbb:;arJbbbb9GEMgw:lJbbb9p9DTmbaw:OhDxekcjjjj94hDkalclf8Uebhqalcdf8UebhkabavcefciGaiVcetfaD87ebdndnaoak:YNgwJb;:FSNJbbbZJbbb:;awJbbbb9GEMgx:lJbbb9p9DTmbax:Ohkxekcjjjj94hkkabavcdfciGaiVcetfak87ebdndnaoaq:YNgoJb;:FSNJbbbZJbbb:;aoJbbbb9GEMgx:lJbbb9p9DTmbax:Ohqxekcjjjj94hqkabavcufciGaiVcetfaq87ebdndnJbbjZararN:tawawN:taoaoN:tgrJbbbbarJbbbb9GE:rJb;:FSNJbbbZMgr:lJbbb9p9DTmbar:Ohqxekcjjjj94hqkabavciGaiVcetfaq87ebalcwfhlaiclfhiaecufgembkkk9mbdnadcd4ae2geTmbinababydbgdcwtcw91:Yadce91cjjj;8ifcjjj98G::NUdbabclfhbaecufgembkkk9teiucbcbydj1jjbgeabcifc98GfgbBdj1jjbdndnabZbcztgd9nmbcuhiabad9RcFFifcz4nbcuSmekaehikaik;LeeeudndnaeabVciGTmbabhixekdndnadcz9pmbabhixekabhiinaiaeydbBdbaiclfaeclfydbBdbaicwfaecwfydbBdbaicxfaecxfydbBdbaiczfhiaeczfheadc9Wfgdcs0mbkkadcl6mbinaiaeydbBdbaeclfheaiclfhiadc98fgdci0mbkkdnadTmbinaiaeRbb86bbaicefhiaecefheadcufgdmbkkabk;aeedudndnabciGTmbabhixekaecFeGc:b:c:ew2hldndnadcz9pmbabhixekabhiinaialBdbaicxfalBdbaicwfalBdbaiclfalBdbaiczfhiadc9Wfgdcs0mbkkadcl6mbinaialBdbaiclfhiadc98fgdci0mbkkdnadTmbinaiae86bbaicefhiadcufgdmbkkabkkkebcjwklz9Kbb",e="b9H79TebbbeKl9Gbb9Gvuuuuueu9Giuuub9Geueuikqbbebeedddilve9Weeeviebeoweuec:q;Aekr;leDo9TW9T9VV95dbH9F9F939H79T9F9J9H229F9Jt9VV7bb8A9TW79O9V9Wt9F9KW9J9V9KW9wWVtW949c919M9MWVbdY9TW79O9V9Wt9F9KW9J9V9KW69U9KW949c919M9MWVblE9TW79O9V9Wt9F9KW9J9V9KW69U9KW949tWG91W9U9JWbvL9TW79O9V9Wt9F9KW9J9V9KWS9P2tWV9p9JtboK9TW79O9V9Wt9F9KW9J9V9KWS9P2tWV9r919HtbrL9TW79O9V9Wt9F9KW9J9V9KWS9P2tWVT949Wbwl79IV9RbDq;t9tqlbzik9:evu8Jjjjjbcz9Rhbcbheincbhdcbhiinabcwfadfaicjuaead4ceGglE86bbaialfhiadcefgdcw9hmbkaec:q:yjjbfai86bbaecitc:q1jjbfab8Piw83ibaecefgecjd9hmbkk;h8JlHud97euo978Jjjjjbcj;kb9Rgv8Kjjjjbc9:hodnadcefal0mbcuhoaiRbbc:Ge9hmbavaialfgrad9Rad;8qbbcj;abad9UhoaicefhldnadTmbaoc;WFbGgocjdaocjd6EhwcbhDinaDae9pmeawaeaD9RaDawfae6Egqcsfgoc9WGgkci2hxakcethmaocl4cifcd4hPabaDad2fhscbhzdnincehHalhOcbhAdninaraO9RaP6miavcj;cbfaAak2fhCaOaPfhlcbhidnakc;ab6mbaral9Rc;Gb6mbcbhoinaCaofhidndndndndnaOaoco4fRbbgXciGPlbedibkaipxbbbbbbbbbbbbbbbbpklbxikaialpbblalpbbbgQclp:meaQpmbzeHdOiAlCvXoQrLgQcdp:meaQpmbzeHdOiAlCvXoQrLpxiiiiiiiiiiiiiiiip9ogLpxiiiiiiiiiiiiiiiip8JgQp5b9cjF;8;4;W;G;ab9:9cU1:NgKcitc:q1jjbfpbibaKc:q:yjjbfpbbbgYaYpmbbbbbbbbbbbbbbbbaQp5e9cjF;8;4;W;G;ab9:9cU1:NgKcitc:q1jjbfpbibp9UpmbedilvorzHOACXQLpPaLaQp9spklbalclfaYpQbfaKc:q:yjjbfRbbfhlxdkaialpbbwalpbbbgQclp:meaQpmbzeHdOiAlCvXoQrLpxssssssssssssssssp9ogLpxssssssssssssssssp8JgQp5b9cjF;8;4;W;G;ab9:9cU1:NgKcitc:q1jjbfpbibaKc:q:yjjbfpbbbgYaYpmbbbbbbbbbbbbbbbbaQp5e9cjF;8;4;W;G;ab9:9cU1:NgKcitc:q1jjbfpbibp9UpmbedilvorzHOACXQLpPaLaQp9spklbalcwfaYpQbfaKc:q:yjjbfRbbfhlxekaialpbbbpklbalczfhlkdndndndndnaXcd4ciGPlbedibkaipxbbbbbbbbbbbbbbbbpklzxikaialpbblalpbbbgQclp:meaQpmbzeHdOiAlCvXoQrLgQcdp:meaQpmbzeHdOiAlCvXoQrLpxiiiiiiiiiiiiiiiip9ogLpxiiiiiiiiiiiiiiiip8JgQp5b9cjF;8;4;W;G;ab9:9cU1:NgKcitc:q1jjbfpbibaKc:q:yjjbfpbbbgYaYpmbbbbbbbbbbbbbbbbaQp5e9cjF;8;4;W;G;ab9:9cU1:NgKcitc:q1jjbfpbibp9UpmbedilvorzHOACXQLpPaLaQp9spklzalclfaYpQbfaKc:q:yjjbfRbbfhlxdkaialpbbwalpbbbgQclp:meaQpmbzeHdOiAlCvXoQrLpxssssssssssssssssp9ogLpxssssssssssssssssp8JgQp5b9cjF;8;4;W;G;ab9:9cU1:NgKcitc:q1jjbfpbibaKc:q:yjjbfpbbbgYaYpmbbbbbbbbbbbbbbbbaQp5e9cjF;8;4;W;G;ab9:9cU1:NgKcitc:q1jjbfpbibp9UpmbedilvorzHOACXQLpPaLaQp9spklzalcwfaYpQbfaKc:q:yjjbfRbbfhlxekaialpbbbpklzalczfhlkdndndndndnaXcl4ciGPlbedibkaipxbbbbbbbbbbbbbbbbpklaxikaialpbblalpbbbgQclp:meaQpmbzeHdOiAlCvXoQrLgQcdp:meaQpmbzeHdOiAlCvXoQrLpxiiiiiiiiiiiiiiiip9ogLpxiiiiiiiiiiiiiiiip8JgQp5b9cjF;8;4;W;G;ab9:9cU1:NgKcitc:q1jjbfpbibaKc:q:yjjbfpbbbgYaYpmbbbbbbbbbbbbbbbbaQp5e9cjF;8;4;W;G;ab9:9cU1:NgKcitc:q1jjbfpbibp9UpmbedilvorzHOACXQLpPaLaQp9spklaalclfaYpQbfaKc:q:yjjbfRbbfhlxdkaialpbbwalpbbbgQclp:meaQpmbzeHdOiAlCvXoQrLpxssssssssssssssssp9ogLpxssssssssssssssssp8JgQp5b9cjF;8;4;W;G;ab9:9cU1:NgKcitc:q1jjbfpbibaKc:q:yjjbfpbbbgYaYpmbbbbbbbbbbbbbbbbaQp5e9cjF;8;4;W;G;ab9:9cU1:NgKcitc:q1jjbfpbibp9UpmbedilvorzHOACXQLpPaLaQp9spklaalcwfaYpQbfaKc:q:yjjbfRbbfhlxekaialpbbbpklaalczfhlkdndndndndnaXco4Plbedibkaipxbbbbbbbbbbbbbbbbpkl8WxikaialpbblalpbbbgQclp:meaQpmbzeHdOiAlCvXoQrLgQcdp:meaQpmbzeHdOiAlCvXoQrLpxiiiiiiiiiiiiiiiip9ogLpxiiiiiiiiiiiiiiiip8JgQp5b9cjF;8;4;W;G;ab9:9cU1:NgXcitc:q1jjbfpbibaXc:q:yjjbfpbbbgYaYpmbbbbbbbbbbbbbbbbaQp5e9cjF;8;4;W;G;ab9:9cU1:NgXcitc:q1jjbfpbibp9UpmbedilvorzHOACXQLpPaLaQp9spkl8WalclfaYpQbfaXc:q:yjjbfRbbfhlxdkaialpbbwalpbbbgQclp:meaQpmbzeHdOiAlCvXoQrLpxssssssssssssssssp9ogLpxssssssssssssssssp8JgQp5b9cjF;8;4;W;G;ab9:9cU1:NgXcitc:q1jjbfpbibaXc:q:yjjbfpbbbgYaYpmbbbbbbbbbbbbbbbbaQp5e9cjF;8;4;W;G;ab9:9cU1:NgXcitc:q1jjbfpbibp9UpmbedilvorzHOACXQLpPaLaQp9spkl8WalcwfaYpQbfaXc:q:yjjbfRbbfhlxekaialpbbbpkl8Walczfhlkaoc;abfhiaocjefak0meaihoaral9Rc;Fb0mbkkdndnaiak9pmbaici4hoinaral9RcK6mdaCaifhXdndndndndnaOaico4fRbbaocoG4ciGPlbedibkaXpxbbbbbbbbbbbbbbbbpklbxikaXalpbblalpbbbgQclp:meaQpmbzeHdOiAlCvXoQrLgQcdp:meaQpmbzeHdOiAlCvXoQrLpxiiiiiiiiiiiiiiiip9ogLpxiiiiiiiiiiiiiiiip8JgQp5b9cjF;8;4;W;G;ab9:9cU1:NgKcitc:q1jjbfpbibaKc:q:yjjbfpbbbgYaYpmbbbbbbbbbbbbbbbbaQp5e9cjF;8;4;W;G;ab9:9cU1:NgKcitc:q1jjbfpbibp9UpmbedilvorzHOACXQLpPaLaQp9spklbalclfaYpQbfaKc:q:yjjbfRbbfhlxdkaXalpbbwalpbbbgQclp:meaQpmbzeHdOiAlCvXoQrLpxssssssssssssssssp9ogLpxssssssssssssssssp8JgQp5b9cjF;8;4;W;G;ab9:9cU1:NgKcitc:q1jjbfpbibaKc:q:yjjbfpbbbgYaYpmbbbbbbbbbbbbbbbbaQp5e9cjF;8;4;W;G;ab9:9cU1:NgKcitc:q1jjbfpbibp9UpmbedilvorzHOACXQLpPaLaQp9spklbalcwfaYpQbfaKc:q:yjjbfRbbfhlxekaXalpbbbpklbalczfhlkaocdfhoaiczfgiak6mbkkalTmbaAci6hHalhOaAcefgohAaoclSmdxekkcbhlaHceGmdkdnakTmbavcjdfazfhiavazfpbdbhYcbhXinaiavcj;cbfaXfgopblbgLcep9TaLpxeeeeeeeeeeeeeeeegQp9op9Hp9rgLaoakfpblbg8Acep9Ta8AaQp9op9Hp9rg8ApmbzeHdOiAlCvXoQrLgEaoamfpblbg3cep9Ta3aQp9op9Hp9rg3aoaxfpblbg5cep9Ta5aQp9op9Hp9rg5pmbzeHdOiAlCvXoQrLg8EpmbezHdiOAlvCXorQLgQaQpmbedibedibedibediaYp9UgYp9AdbbaiadfgoaYaQaQpmlvorlvorlvorlvorp9UgYp9AdbbaoadfgoaYaQaQpmwDqkwDqkwDqkwDqkp9UgYp9AdbbaoadfgoaYaQaQpmxmPsxmPsxmPsxmPsp9UgYp9AdbbaoadfgoaYaEa8EpmwDKYqk8AExm35Ps8E8FgQaQpmbedibedibedibedip9UgYp9AdbbaoadfgoaYaQaQpmlvorlvorlvorlvorp9UgYp9AdbbaoadfgoaYaQaQpmwDqkwDqkwDqkwDqkp9UgYp9AdbbaoadfgoaYaQaQpmxmPsxmPsxmPsxmPsp9UgYp9AdbbaoadfgoaYaLa8ApmwKDYq8AkEx3m5P8Es8FgLa3a5pmwKDYq8AkEx3m5P8Es8Fg8ApmbezHdiOAlvCXorQLgQaQpmbedibedibedibedip9UgYp9AdbbaoadfgoaYaQaQpmlvorlvorlvorlvorp9UgYp9AdbbaoadfgoaYaQaQpmwDqkwDqkwDqkwDqkp9UgYp9AdbbaoadfgoaYaQaQpmxmPsxmPsxmPsxmPsp9UgYp9AdbbaoadfgoaYaLa8ApmwDKYqk8AExm35Ps8E8FgQaQpmbedibedibedibedip9UgYp9AdbbaoadfgoaYaQaQpmlvorlvorlvorlvorp9UgYp9AdbbaoadfgoaYaQaQpmwDqkwDqkwDqkwDqkp9UgYp9AdbbaoadfgoaYaQaQpmxmPsxmPsxmPsxmPsp9UgYp9AdbbaoadfhiaXczfgXak6mbkkazclfgzad6mbkasavcjdfaqad2;8qbbavavcjdfaqcufad2fad;8qbbaqaDfhDc9:hoalmexikkc9:hoxekcbc99aral9Radcaadca0ESEhokavcj;kbf8Kjjjjbaokwbz:bjjjbk;uzeHu8Jjjjjbc;ae9Rgv8Kjjjjbc9:hodnaeci9UgrcHfal0mbcuhoaiRbbgwc;WeGc;Ge9hmbawcsGgDce0mbavc;abfcFecje;8kbavcUf9cu83ibavc8Wf9cu83ibavcyf9cu83ibavcaf9cu83ibavcKf9cu83ibavczf9cu83ibav9cu83iwav9cu83ibaialfc9WfhqaicefgwarfhodnaeTmbcmcsaDceSEhkcbhxcbhmcbhDcbhicbhlindnaoaq9nmbc9:hoxikdndnawRbbgrc;Ve0mbavc;abfalarcl4cu7fcsGcitfgPydlhsaPydbhzdnarcsGgPak9pmbavaiarcu7fcsGcdtfydbaxaPEhraPThPdndnadcd9hmbabaDcetfgHaz87ebaHcdfas87ebaHclfar87ebxekabaDcdtfgHazBdbaHclfasBdbaHcwfarBdbkaxaPfhxavc;abfalcitfgHarBdbaHasBdlavaicdtfarBdbavc;abfalcefcsGglcitfgHazBdbaHarBdlaiaPfhialcefhlxdkdndnaPcsSmbamaPfaPc987fcefhmxekaocefhrao8SbbgPcFeGhHdndnaPcu9mmbarhoxekaocvfhoaHcFbGhHcrhPdninar8SbbgOcFbGaPtaHVhHaOcu9kmearcefhraPcrfgPc8J9hmbxdkkarcefhokaHce4cbaHceG9R7amfhmkdndnadcd9hmbabaDcetfgraz87ebarcdfas87ebarclfam87ebxekabaDcdtfgrazBdbarclfasBdbarcwfamBdbkavc;abfalcitfgramBdbarasBdlavaicdtfamBdbavc;abfalcefcsGglcitfgrazBdbaramBdlaicefhialcefhlxekdnarcpe0mbaxcefgOavaiaqarcsGfRbbgPcl49RcsGcdtfydbaPcz6gHEhravaiaP9RcsGcdtfydbaOaHfgsaPcsGgOEhPaOThOdndnadcd9hmbabaDcetfgzax87ebazcdfar87ebazclfaP87ebxekabaDcdtfgzaxBdbazclfarBdbazcwfaPBdbkavaicdtfaxBdbavc;abfalcitfgzarBdbazaxBdlavaicefgicsGcdtfarBdbavc;abfalcefcsGcitfgzaPBdbazarBdlavaiaHfcsGgicdtfaPBdbavc;abfalcdfcsGglcitfgraxBdbaraPBdlalcefhlaiaOfhiasaOfhxxekaxcbaoRbbgzEgAarc;:eSgrfhsazcsGhCazcl4hXdndnazcs0mbascefhOxekashOavaiaX9RcsGcdtfydbhskdndnaCmbaOcefhxxekaOhxavaiaz9RcsGcdtfydbhOkdndnarTmbaocefhrxekaocdfhrao8SbegHcFeGhPdnaHcu9kmbaocofhAaPcFbGhPcrhodninar8SbbgHcFbGaotaPVhPaHcu9kmearcefhraocrfgoc8J9hmbkaAhrxekarcefhrkaPce4cbaPceG9R7amfgmhAkdndnaXcsSmbarhPxekarcefhPar8SbbgocFeGhHdnaocu9kmbarcvfhsaHcFbGhHcrhodninaP8SbbgrcFbGaotaHVhHarcu9kmeaPcefhPaocrfgoc8J9hmbkashPxekaPcefhPkaHce4cbaHceG9R7amfgmhskdndnaCcsSmbaPhoxekaPcefhoaP8SbbgrcFeGhHdnarcu9kmbaPcvfhOaHcFbGhHcrhrdninao8SbbgPcFbGartaHVhHaPcu9kmeaocefhoarcrfgrc8J9hmbkaOhoxekaocefhokaHce4cbaHceG9R7amfgmhOkdndnadcd9hmbabaDcetfgraA87ebarcdfas87ebarclfaO87ebxekabaDcdtfgraABdbarclfasBdbarcwfaOBdbkavc;abfalcitfgrasBdbaraABdlavaicdtfaABdbavc;abfalcefcsGcitfgraOBdbarasBdlavaicefgicsGcdtfasBdbavc;abfalcdfcsGcitfgraABdbaraOBdlavaiazcz6aXcsSVfgicsGcdtfaOBdbaiaCTaCcsSVfhialcifhlkawcefhwalcsGhlaicsGhiaDcifgDae6mbkkcbc99aoaqSEhokavc;aef8Kjjjjbaok:llevu8Jjjjjbcz9Rhvc9:hodnaecvfal0mbcuhoaiRbbc;:eGc;qe9hmbav9cb83iwaicefhraialfc98fhwdnaeTmbdnadcdSmbcbhDindnaraw6mbc9:skarcefhoar8SbbglcFeGhidndnalcu9mmbaohrxekarcvfhraicFbGhicrhldninao8SbbgdcFbGaltaiVhiadcu9kmeaocefhoalcrfglc8J9hmbxdkkaocefhrkabaDcdtfaicd4cbaice4ceG9R7avcwfaiceGcdtVgoydbfglBdbaoalBdbaDcefgDae9hmbxdkkcbhDindnaraw6mbc9:skarcefhoar8SbbglcFeGhidndnalcu9mmbaohrxekarcvfhraicFbGhicrhldninao8SbbgdcFbGaltaiVhiadcu9kmeaocefhoalcrfglc8J9hmbxdkkaocefhrkabaDcetfaicd4cbaice4ceG9R7avcwfaiceGcdtVgoydbfgl87ebaoalBdbaDcefgDae9hmbkkcbc99arawSEhokaok:EPliuo97eue978Jjjjjbca9Rhidndnadcl9hmbdnaec98GglTmbcbhvabhdinadadpbbbgocKp:RecKp:Sep;6egraocwp:RecKp:Sep;6earp;Geaoczp:RecKp:Sep;6egwp;Gep;Kep;LegDpxbbbbbbbbbbbbbbbbp:2egqarpxbbbjbbbjbbbjbbbjgkp9op9rp;Kegrpxbb;:9cbb;:9cbb;:9cbb;:9cararp;MeaDaDp;Meawaqawakp9op9rp;Kegrarp;Mep;Kep;Kep;Jep;Negwp;Mepxbbn0bbn0bbn0bbn0gqp;KepxFbbbFbbbFbbbFbbbp9oaopxbbbFbbbFbbbFbbbFp9op9qarawp;Meaqp;Kecwp:RepxbFbbbFbbbFbbbFbbp9op9qaDawp;Meaqp;Keczp:RepxbbFbbbFbbbFbbbFbp9op9qpkbbadczfhdavclfgval6mbkkalae9pmeaiaeciGgvcdtgdVcbczad9R;8kbaiabalcdtfglad;8qbbdnavTmbaiaipblbgocKp:RecKp:Sep;6egraocwp:RecKp:Sep;6earp;Geaoczp:RecKp:Sep;6egwp;Gep;Kep;LegDpxbbbbbbbbbbbbbbbbp:2egqarpxbbbjbbbjbbbjbbbjgkp9op9rp;Kegrpxbb;:9cbb;:9cbb;:9cbb;:9cararp;MeaDaDp;Meawaqawakp9op9rp;Kegrarp;Mep;Kep;Kep;Jep;Negwp;Mepxbbn0bbn0bbn0bbn0gqp;KepxFbbbFbbbFbbbFbbbp9oaopxbbbFbbbFbbbFbbbFp9op9qarawp;Meaqp;Kecwp:RepxbFbbbFbbbFbbbFbbp9op9qaDawp;Meaqp;Keczp:RepxbbFbbbFbbbFbbbFbp9op9qpklbkalaiad;8qbbskdnaec98GgxTmbcbhvabhdinadczfglalpbbbgopxbbbbbbFFbbbbbbFFgkp9oadpbbbgDaopmlvorxmPsCXQL358E8FpxFubbFubbFubbFubbp9op;6eaDaopmbediwDqkzHOAKY8AEgoczp:Sep;6egrp;Geaoczp:Reczp:Sep;6egwp;Gep;Kep;Legopxb;:FSb;:FSb;:FSb;:FSawaopxbbbbbbbbbbbbbbbbp:2egqawpxbbbjbbbjbbbjbbbjgmp9op9rp;Kegwawp;Meaoaop;Mearaqaramp9op9rp;Kegoaop;Mep;Kep;Kep;Jep;Negrp;Mepxbbn0bbn0bbn0bbn0gqp;Keczp:Reawarp;Meaqp;KepxFFbbFFbbFFbbFFbbp9op9qgwaoarp;Meaqp;KepxFFbbFFbbFFbbFFbbp9ogopmwDKYqk8AExm35Ps8E8Fp9qpkbbadaDakp9oawaopmbezHdiOAlvCXorQLp9qpkbbadcafhdavclfgvax6mbkkaxae9pmbaiaeciGgvcitgdfcbcaad9R;8kbaiabaxcitfglad;8qbbdnavTmbaiaipblzgopxbbbbbbFFbbbbbbFFgkp9oaipblbgDaopmlvorxmPsCXQL358E8FpxFubbFubbFubbFubbp9op;6eaDaopmbediwDqkzHOAKY8AEgoczp:Sep;6egrp;Geaoczp:Reczp:Sep;6egwp;Gep;Kep;Legopxb;:FSb;:FSb;:FSb;:FSawaopxbbbbbbbbbbbbbbbbp:2egqawpxbbbjbbbjbbbjbbbjgmp9op9rp;Kegwawp;Meaoaop;Mearaqaramp9op9rp;Kegoaop;Mep;Kep;Kep;Jep;Negrp;Mepxbbn0bbn0bbn0bbn0gqp;Keczp:Reawarp;Meaqp;KepxFFbbFFbbFFbbFFbbp9op9qgwaoarp;Meaqp;KepxFFbbFFbbFFbbFFbbp9ogopmwDKYqk8AExm35Ps8E8Fp9qpklzaiaDakp9oawaopmbezHdiOAlvCXorQLp9qpklbkalaiad;8qbbkk;4wllue97euv978Jjjjjbc8W9Rhidnaec98GglTmbcbhvabhoinaiaopbbbgraoczfgwpbbbgDpmlvorxmPsCXQL358E8Fgqczp:Segkclp:RepklbaopxbbjZbbjZbbjZbbjZpx;Zl81Z;Zl81Z;Zl81Z;Zl81Zakpxibbbibbbibbbibbbp9qp;6ep;NegkaraDpmbediwDqkzHOAKY8AEgrczp:Reczp:Sep;6ep;MegDaDp;Meakarczp:Sep;6ep;Megxaxp;Meakaqczp:Reczp:Sep;6ep;Megqaqp;Mep;Kep;Kep;Lepxbbbbbbbbbbbbbbbbp:4ep;Jepxb;:FSb;:FSb;:FSb;:FSgkp;Mepxbbn0bbn0bbn0bbn0grp;KepxFFbbFFbbFFbbFFbbgmp9oaxakp;Mearp;Keczp:Rep9qgxaqakp;Mearp;Keczp:ReaDakp;Mearp;Keamp9op9qgkpmbezHdiOAlvCXorQLgrp5baipblbpEb:T:j83ibaocwfarp5eaipblbpEe:T:j83ibawaxakpmwDKYqk8AExm35Ps8E8Fgkp5baipblbpEd:T:j83ibaocKfakp5eaipblbpEi:T:j83ibaocafhoavclfgval6mbkkdnalae9pmbaiaeciGgvcitgofcbcaao9R;8kbaiabalcitfgwao;8qbbdnavTmbaiaipblbgraipblzgDpmlvorxmPsCXQL358E8Fgqczp:Segkclp:RepklaaipxbbjZbbjZbbjZbbjZpx;Zl81Z;Zl81Z;Zl81Z;Zl81Zakpxibbbibbbibbbibbbp9qp;6ep;NegkaraDpmbediwDqkzHOAKY8AEgrczp:Reczp:Sep;6ep;MegDaDp;Meakarczp:Sep;6ep;Megxaxp;Meakaqczp:Reczp:Sep;6ep;Megqaqp;Mep;Kep;Kep;Lepxbbbbbbbbbbbbbbbbp:4ep;Jepxb;:FSb;:FSb;:FSb;:FSgkp;Mepxbbn0bbn0bbn0bbn0grp;KepxFFbbFFbbFFbbFFbbgmp9oaxakp;Mearp;Keczp:Rep9qgxaqakp;Mearp;Keczp:ReaDakp;Mearp;Keamp9op9qgkpmbezHdiOAlvCXorQLgrp5baipblapEb:T:j83ibaiarp5eaipblapEe:T:j83iwaiaxakpmwDKYqk8AExm35Ps8E8Fgkp5baipblapEd:T:j83izaiakp5eaipblapEi:T:j83iKkawaiao;8qbbkk:Pddiue978Jjjjjbc;ab9Rhidnadcd4ae2glc98GgvTmbcbhdabheinaeaepbbbgocwp:Recwp:Sep;6eaocep:SepxbbjZbbjZbbjZbbjZp:UepxbbjFbbjFbbjFbbjFp9op;Mepkbbaeczfheadclfgdav6mbkkdnaval9pmbaialciGgdcdtgeVcbc;abae9R;8kbaiabavcdtfgvae;8qbbdnadTmbaiaipblbgocwp:Recwp:Sep;6eaocep:SepxbbjZbbjZbbjZbbjZp:UepxbbjFbbjFbbjFbbjFp9op;Mepklbkavaiae;8qbbkk9teiucbcbydj1jjbgeabcifc98GfgbBdj1jjbdndnabZbcztgd9nmbcuhiabad9RcFFifcz4nbcuSmekaehikaikkkebcjwklz9Tbb",t=new Uint8Array([0,97,115,109,1,0,0,0,1,4,1,96,0,0,3,3,2,0,0,5,3,1,0,1,12,1,0,10,22,2,12,0,65,0,65,0,65,0,252,10,0,0,11,7,0,65,0,253,15,26,11]),n=new Uint8Array([32,0,65,2,1,106,34,33,3,128,11,4,13,64,6,253,10,7,15,116,127,5,8,12,40,16,19,54,20,9,27,255,113,17,42,67,24,23,146,148,18,14,22,45,70,69,56,114,101,21,25,63,75,136,108,28,118,29,73,115]);if(typeof WebAssembly!="object")return{supported:!1};var r=WebAssembly.validate(t)?e:i,s,o=WebAssembly.instantiate(a(r),{}).then(function(f){s=f.instance,s.exports.__wasm_call_ctors()});function a(f){for(var M=new Uint8Array(f.length),x=0;x<f.length;++x){var _=f.charCodeAt(x);M[x]=_>96?_-97:_>64?_-39:_+4}for(var D=0,x=0;x<f.length;++x)M[D++]=M[x]<60?n[M[x]]:(M[x]-60)*64+M[++x];return M.buffer.slice(0,D)}function l(f,M,x,_,D,P){var T=s.exports.sbrk,N=x+3&-4,v=T(N*_),y=T(D.length),C=new Uint8Array(s.exports.memory.buffer);C.set(D,y);var q=f(v,x,_,y,D.length);if(q==0&&P&&P(v,N,_),M.set(C.subarray(v,v+x*_)),T(v-T(0)),q!=0)throw new Error("Malformed buffer data: "+q)}var c={NONE:"",OCTAHEDRAL:"meshopt_decodeFilterOct",QUATERNION:"meshopt_decodeFilterQuat",EXPONENTIAL:"meshopt_decodeFilterExp"},u={ATTRIBUTES:"meshopt_decodeVertexBuffer",TRIANGLES:"meshopt_decodeIndexBuffer",INDICES:"meshopt_decodeIndexSequence"},d=[],h=0;function p(f){var M={object:new Worker(f),pending:0,requests:{}};return M.object.onmessage=function(x){var _=x.data;M.pending-=_.count,M.requests[_.id][_.action](_.value),delete M.requests[_.id]},M}function g(f){for(var M="var instance; var ready = WebAssembly.instantiate(new Uint8Array(["+new Uint8Array(a(r))+"]), {}).then(function(result) { instance = result.instance; instance.exports.__wasm_call_ctors(); });self.onmessage = workerProcess;"+l.toString()+m.toString(),x=new Blob([M],{type:"text/javascript"}),_=URL.createObjectURL(x),D=0;D<f;++D)d[D]=p(_);URL.revokeObjectURL(_)}function b(f,M,x,_,D){for(var P=d[0],T=1;T<d.length;++T)d[T].pending<P.pending&&(P=d[T]);return new Promise(function(N,v){var y=new Uint8Array(x),C=h++;P.pending+=f,P.requests[C]={resolve:N,reject:v},P.object.postMessage({id:C,count:f,size:M,source:y,mode:_,filter:D},[y.buffer])})}function m(f){o.then(function(){var M=f.data;try{var x=new Uint8Array(M.count*M.size);l(s.exports[M.mode],x,M.count,M.size,M.source,s.exports[M.filter]),self.postMessage({id:M.id,count:M.count,action:"resolve",value:x},[x.buffer])}catch(_){self.postMessage({id:M.id,count:M.count,action:"reject",value:_})}})}return{ready:o,supported:!0,useWorkers:function(f){g(f)},decodeVertexBuffer:function(f,M,x,_,D){l(s.exports.meshopt_decodeVertexBuffer,f,M,x,_,s.exports[c[D]])},decodeIndexBuffer:function(f,M,x,_){l(s.exports.meshopt_decodeIndexBuffer,f,M,x,_)},decodeIndexSequence:function(f,M,x,_){l(s.exports.meshopt_decodeIndexSequence,f,M,x,_)},decodeGltfBuffer:function(f,M,x,_,D,P){l(s.exports[u[D]],f,M,x,_,s.exports[c[P]])},decodeGltfBufferAsync:function(f,M,x,_,D){return d.length>0?b(f,M,x,u[_],c[D]):o.then(function(){var P=new Uint8Array(f*M);return l(s.exports[u[_]],P,f,M,x,s.exports[c[D]]),P})}}})(),qn=Uint8Array,ss=Uint16Array,py=Int32Array,of=new qn([0,0,0,0,0,0,0,0,1,1,1,1,2,2,2,2,3,3,3,3,4,4,4,4,5,5,5,5,0,0,0,0]),af=new qn([0,0,0,0,1,1,2,2,3,3,4,4,5,5,6,6,7,7,8,8,9,9,10,10,11,11,12,12,13,13,0,0]),my=new qn([16,17,18,0,8,7,9,6,10,5,11,4,12,3,13,2,14,1,15]),cf=function(i,e){for(var t=new ss(31),n=0;n<31;++n)t[n]=e+=1<<i[n-1];for(var r=new py(t[30]),n=1;n<30;++n)for(var s=t[n];s<t[n+1];++s)r[s]=s-t[n]<<5|n;return{b:t,r}},lf=cf(of,2),uf=lf.b,gy=lf.r;uf[28]=258,gy[258]=28;var by=cf(af,0),_y=by.b,Nl=new ss(32768);for(var Zt=0;Zt<32768;++Zt){var rr=(Zt&43690)>>1|(Zt&21845)<<1;rr=(rr&52428)>>2|(rr&13107)<<2,rr=(rr&61680)>>4|(rr&3855)<<4,Nl[Zt]=((rr&65280)>>8|(rr&255)<<8)>>1}var to=(function(i,e,t){for(var n=i.length,r=0,s=new ss(e);r<n;++r)i[r]&&++s[i[r]-1];var o=new ss(e);for(r=1;r<e;++r)o[r]=o[r-1]+s[r-1]<<1;var a;if(t){a=new ss(1<<e);var l=15-e;for(r=0;r<n;++r)if(i[r])for(var c=r<<4|i[r],u=e-i[r],d=o[i[r]-1]++<<u,h=d|(1<<u)-1;d<=h;++d)a[Nl[d]>>l]=c}else for(a=new ss(n),r=0;r<n;++r)i[r]&&(a[r]=Nl[o[i[r]-1]++]>>15-i[r]);return a}),fo=new qn(288);for(var Zt=0;Zt<144;++Zt)fo[Zt]=8;for(var Zt=144;Zt<256;++Zt)fo[Zt]=9;for(var Zt=256;Zt<280;++Zt)fo[Zt]=7;for(var Zt=280;Zt<288;++Zt)fo[Zt]=8;var df=new qn(32);for(var Zt=0;Zt<32;++Zt)df[Zt]=5;var xy=to(fo,9,1),vy=to(df,5,1),Dc=function(i){for(var e=i[0],t=1;t<i.length;++t)i[t]>e&&(e=i[t]);return e},oi=function(i,e,t){var n=e/8|0;return(i[n]|i[n+1]<<8)>>(e&7)&t},Ic=function(i,e){var t=e/8|0;return(i[t]|i[t+1]<<8|i[t+2]<<16)>>(e&7)},yy=function(i){return(i+7)/8|0},My=function(i,e,t){return(t==null||t>i.length)&&(t=i.length),new qn(i.subarray(e,t))},Sy=["unexpected EOF","invalid block type","invalid length/literal","invalid distance","stream finished","no stream handler",,"no callback","invalid UTF-8 data","extra field too long","date not in range 1980-2099","filename too long","stream finishing","invalid zip data"],ai=function(i,e,t){var n=new Error(e||Sy[i]);if(n.code=i,Error.captureStackTrace&&Error.captureStackTrace(n,ai),!t)throw n;return n},wy=function(i,e,t,n){var r=i.length,s=0;if(!r||e.f&&!e.l)return t||new qn(0);var o=!t,a=o||e.i!=2,l=e.i;o&&(t=new qn(r*3));var c=function(Ze){var Ce=t.length;if(Ze>Ce){var st=new qn(Math.max(Ce*2,Ze));st.set(t),t=st}},u=e.f||0,d=e.p||0,h=e.b||0,p=e.l,g=e.d,b=e.m,m=e.n,f=r*8;do{if(!p){u=oi(i,d,1);var M=oi(i,d+1,3);if(d+=3,M)if(M==1)p=xy,g=vy,b=9,m=5;else if(M==2){var P=oi(i,d,31)+257,T=oi(i,d+10,15)+4,N=P+oi(i,d+5,31)+1;d+=14;for(var v=new qn(N),y=new qn(19),C=0;C<T;++C)y[my[C]]=oi(i,d+C*3,7);d+=T*3;for(var q=Dc(y),O=(1<<q)-1,$=to(y,q,1),C=0;C<N;){var se=$[oi(i,d,O)];d+=se&15;var x=se>>4;if(x<16)v[C++]=x;else{var Z=0,ce=0;for(x==16?(ce=3+oi(i,d,3),d+=2,Z=v[C-1]):x==17?(ce=3+oi(i,d,7),d+=3):x==18&&(ce=11+oi(i,d,127),d+=7);ce--;)v[C++]=Z}}var L=v.subarray(0,P),k=v.subarray(P);b=Dc(L),m=Dc(k),p=to(L,b,1),g=to(k,m,1)}else ai(1);else{var x=yy(d)+4,_=i[x-4]|i[x-3]<<8,D=x+_;if(D>r){l&&ai(0);break}a&&c(h+_),t.set(i.subarray(x,D),h),e.b=h+=_,e.p=d=D*8,e.f=u;continue}if(d>f){l&&ai(0);break}}a&&c(h+131072);for(var K=(1<<b)-1,X=(1<<m)-1,ee=d;;ee=d){var Z=p[Ic(i,d)&K],le=Z>>4;if(d+=Z&15,d>f){l&&ai(0);break}if(Z||ai(2),le<256)t[h++]=le;else if(le==256){ee=d,p=null;break}else{var j=le-254;if(le>264){var C=le-257,oe=of[C];j=oi(i,d,(1<<oe)-1)+uf[C],d+=oe}var xe=g[Ic(i,d)&X],me=xe>>4;xe||ai(3),d+=xe&15;var k=_y[me];if(me>3){var oe=af[me];k+=Ic(i,d)&(1<<oe)-1,d+=oe}if(d>f){l&&ai(0);break}a&&c(h+131072);var Te=h+j;if(h<k){var ke=s-k,He=Math.min(k,Te);for(ke+h<0&&ai(3);h<He;++h)t[h]=n[ke+h]}for(;h<Te;++h)t[h]=t[h-k]}}e.l=p,e.p=ee,e.b=h,e.f=u,p&&(u=1,e.m=b,e.d=g,e.n=m)}while(!u);return h!=t.length&&o?My(t,0,h):t.subarray(0,h)},Ey=new qn(0),Ay=function(i){(i[0]!=31||i[1]!=139||i[2]!=8)&&ai(6,"invalid gzip data");var e=i[3],t=10;e&4&&(t+=(i[10]|i[11]<<8)+2);for(var n=(e>>3&1)+(e>>4&1);n>0;n-=!i[t++]);return t+(e&2)},Ty=function(i){var e=i.length;return(i[e-4]|i[e-3]<<8|i[e-2]<<16|i[e-1]<<24)>>>0};function Ry(i,e){var t=Ay(i);return t+8>i.length&&ai(6,"invalid gzip data"),wy(i.subarray(t,-8),{i:2},new qn(Ty(i)),e)}var Cy=typeof TextDecoder<"u"&&new TextDecoder,Py=0;try{Cy.decode(Ey,{stream:!0}),Py=1}catch{}async function hf(i){const e=new URL(i,document.baseURI),t=await fetch(e);if(!t.ok)throw new Error("model_load_failed");let n=new Uint8Array(await t.arrayBuffer());n[0]===31&&n[1]===139&&(n=Ry(n));const r=n.buffer.slice(n.byteOffset,n.byteOffset+n.byteLength);return new Dv().setMeshoptDecoder(fy).parseAsync(r,new URL(".",e).href)}const no={standard:new A(.18,.38,1),front:new A(0,.15,1),side:new A(1,.2,0),back:new A(0,.15,-1)},Fc={low:{ratio:1,shadows:!1},medium:{ratio:1.5,shadows:!0},high:{ratio:2,shadows:!0}};class Ly{constructor(e,t={}){this.container=e,this.callbacks=t,this.scene=new Yl,this.camera=new vn(32,1,.02,40),this.time=0,this.period=9,this.playing=!1,this.speed=.5,this.loopRange=null,this.visible=!0,this.disposed=!1,this.contextLost=!1,this.dirty=!0,this.framingMode="main",this.loopBounds=new an,this.stageProps=[],this.renderer=new q_({alpha:!0,antialias:!0,powerPreference:"high-performance"}),this.renderer.setClearColor(1052950,0),this.renderer.outputColorSpace=ln,this.renderer.toneMapping=ch,this.renderer.toneMappingExposure=1.15,this.renderer.domElement.setAttribute("aria-label","托马斯全旋 3D 动画，可拖动旋转与双指缩放"),e.prepend(this.renderer.domElement),this.controls=new Ix(this.camera,this.renderer.domElement),Object.assign(this.controls,{enableDamping:!0,dampingFactor:.13,enablePan:!1,minDistance:.45,maxDistance:7,minPolarAngle:.12,maxPolarAngle:Math.PI*.9}),this.onControlsChange=()=>{this.dirty=!0},this.controls.addEventListener("change",this.onControlsChange),this.autoFrame=!0,this.controls.addEventListener("start",()=>{this.autoFrame=!1}),this.scene.add(new Wh(16184042,3947070,2)),this.keyLight=new us(16771794,3.7),this.keyLight.position.set(-2.5,4,4),this.scene.add(this.keyLight);const n=new us(15790847,2.2);n.position.set(2,2,-3),this.scene.add(n);const r=new us(14869226,.8);r.position.set(4,.7,2),this.scene.add(r),this.createEnvironment(),this.scene.environmentIntensity=.32,this.renderer.shadowMap.type=oh,this.keyLight.shadow.mapSize.set(1024,1024),this.keyLight.shadow.bias=-4e-4,this.keyLight.shadow.normalBias=.02,this.keyLight.shadow.radius=6,Object.assign(this.keyLight.shadow.camera,{left:-1.9,right:1.9,top:1.9,bottom:-1.9,near:1,far:12}),this.keyLight.shadow.camera.updateProjectionMatrix(),this.shadowCatcher=new Xt(new Ps(8,8),new nx({color:0,opacity:.28})),this.shadowCatcher.rotation.x=-Math.PI/2,this.shadowCatcher.position.y=-.006,this.shadowCatcher.receiveShadow=!0,this.floor=Dy(),this.stageProps.push(this.shadowCatcher,this.floor),this.scene.add(...this.stageProps),this.setQuality("medium"),this.resizeObserver=new ResizeObserver(()=>this.resize()),this.resizeObserver.observe(e),this.resize(),this.onVisibility=()=>{document.hidden?(this.playing=!1,this.stop(),t.onTime?.(this.time)):this.visible&&(this.dirty=!0,this.start())},this.onContextLost=s=>{s.preventDefault(),this.contextLost=!0,this.playing=!1,this.stop(),Nc(this.scene),this.keyLight.shadow.map?.dispose(),this.keyLight.shadow.map=null,this.scene.environment=null,this.environment?.dispose(),this.environment=null,t.onContext?.(!1),t.onTime?.(this.time)},this.onContextRestored=()=>{this.contextLost=!1,this.createEnvironment(),this.dirty=!0,this.resize(),this.start(),t.onContext?.(!0)},document.addEventListener("visibilitychange",this.onVisibility),this.renderer.domElement.addEventListener("webglcontextlost",this.onContextLost),this.renderer.domElement.addEventListener("webglcontextrestored",this.onContextRestored)}createEnvironment(){this.environment?.dispose();const e=new Ml(this.renderer),t=new jx;this.environment=e.fromScene(t,.04),this.scene.environment=this.environment.texture,t.dispose(),e.dispose()}async load(){const[e,t]=await Promise.all([hf("./coach/flare-coach.meshopt.glb.gz"),fetch(new URL("./coach/coach-rig.json",document.baseURI)).then(n=>{if(!n.ok)throw new Error("rig_load_failed");return n.json()})]);if(this.disposed){Nc(e.scene);return}this.coach=e.scene,this.motion=Cv({model:this.coach,rigData:t}),this.coach.traverse(n=>{n.isMesh&&(n.castShadow=this.renderer.shadowMap.enabled)}),this.scene.add(this.coach),this.period=this.motion.getMetrics().period;for(let n=0;n<18;n++){this.motion.update(n*this.period/18);const r=this.motion.getMetrics().bounds;this.loopBounds.union(new an(new A().fromArray(r.min),new A().fromArray(r.max)))}this.loopBounds.expandByScalar(t.height*.045),this.pacing=Pv(this.coach,this.motion,0),this.setTime(0),this.resetView(),this.start()}start(){this.running||this.disposed||this.contextLost||!this.visible||document.hidden||(this.running=!0,this.last=performance.now(),this.renderer.setAnimationLoop(e=>this.tick(e)))}stop(){this.running=!1,this.renderer.setAnimationLoop(null)}tick(e){const t=Math.min(Math.max((e-this.last)/1e3,0),.06);if(this.last=e,this.motion&&this.playing){const n=this.paceStep(t);if(this.loopRange){const[r,s]=this.loopRange,o=s-r;this.time=r+((this.time-r+n)%o+o)%o}else this.time=(this.time+n)%this.period;this.motion.update(this.time),this.callbacks.onTime?.(this.time),this.dirty=!0}this.controls.update(),this.dirty&&(this.renderer.render(this.displayScene??this.scene,this.camera),this.dirty=!1,this.callbacks.onRender?.())}setTime(e){this.time=vt.clamp(e,0,this.period),this.motion?.update(this.time),this.coach?.updateMatrixWorld(!0),this.dirty=!0,this.callbacks.onTime?.(this.time)}pacingRate(e){return nf(this.pacing,this.motion,e,this.period)}paceStep(e){return Lv(this.pacing,this.motion,this.time,e,this.speed,this.period)}getMetrics(){return this.motion?.getMetrics()??null}setDisplayScene(e=null){this.displayScene=e,this.dirty=!0}setVisible(e){this.visible=!!e,this.visible&&!document.hidden?(this.dirty=!0,this.start()):(this.playing=!1,this.stop(),this.callbacks.onTime?.(this.time))}setQuality(e){this.quality=e in Fc?e:"medium";const t=Fc[this.quality];this.updatePixelRatio(),this.renderer.shadowMap.enabled=t.shadows,this.keyLight.castShadow=t.shadows,this.shadowCatcher.visible=t.shadows,this.coach?.traverse(n=>{n.isMesh&&(n.castShadow=t.shadows)}),this.dirty=!0,this.resize()}updatePixelRatio(){const e=this.framingMode==="detail"&&this.quality!=="low"?2:1;this.renderer.setPixelRatio(Math.min(Math.max(window.devicePixelRatio||1,e),Math.max(Fc[this.quality].ratio,e)))}resize(){const e=this.container.clientWidth,t=this.container.clientHeight;if(!(e>0&&t>0))return;const n=this.camera.aspect!==e/t;this.camera.aspect=e/t;const r=this.framingMode==="main"&&e<=600&&t>=500;this.insetLeft=this.framingMode==="detail"||r?0:t<=320?48:64,this.offsetY=r?t*(.5-187/650):0,this.offsetX=r?e*10/390:0,this.camera.setViewOffset(e,t,this.offsetX-this.insetLeft/2,this.offsetY,e,t),this.camera.updateProjectionMatrix(),this.renderer.setSize(e,t),n&&this.autoFrame&&this.motion&&this.resetView(),n&&this.framingMode==="detail"&&this.callbacks.onResize?.(),this.dirty=!0}setFramingMode(e){this.framingMode=e,this.updatePixelRatio(),this.resize()}resetView(e=no.standard){this.autoFrame=!0;const t=this.container.clientWidth<=600&&this.container.clientHeight>=500;this.fitBounds(this.loopBounds,e,t?.72:this.container.clientWidth<=600?.78:.74)}setCameraView(e,t){const n=this.controls.enableDamping;this.controls.enableDamping=!1,this.controls.update(),this.controls.enableDamping=n,this.controls.target.copy(t),this.camera.position.copy(e),this.controls.update(),this.dirty=!0}fitBounds(e,t,n=1){if(e.isEmpty())return;const r=t.clone().normalize(),s=e.getCenter(new A),o=new A().crossVectors(new A(0,1,0),r).normalize(),a=new A().crossVectors(r,o).normalize(),l=Math.tan(vt.degToRad(this.camera.fov/2)),c=l*this.camera.aspect*Math.max(.4,(this.container.clientWidth-(this.insetLeft||0))/this.container.clientWidth);let u=.6;for(const d of[e.min.x,e.max.x])for(const h of[e.min.y,e.max.y])for(const p of[e.min.z,e.max.z]){const g=new A(d,h,p).sub(s),b=g.dot(r);u=Math.max(u,b+Math.abs(g.dot(a))/l,b+Math.abs(g.dot(o))/c)}this.setCameraView(s.clone().addScaledVector(r,u*n),s)}project(e){const t=e.clone().project(this.camera),n=this.renderer.domElement.getBoundingClientRect();return{x:(t.x+1)*.5*n.width,y:(1-t.y)*.5*n.height,behind:t.z>1||t.z<-1}}dispose(){this.disposed||(this.disposed=!0,this.stop(),this.resizeObserver.disconnect(),document.removeEventListener("visibilitychange",this.onVisibility),this.renderer.domElement.removeEventListener("webglcontextlost",this.onContextLost),this.renderer.domElement.removeEventListener("webglcontextrestored",this.onContextRestored),this.controls.removeEventListener("change",this.onControlsChange),this.controls.dispose(),Nc(this.scene),this.environment?.dispose(),this.renderer.dispose(),this.renderer.domElement.remove())}}function Dy(){const i=document.createElement("canvas");i.width=i.height=256;const e=i.getContext("2d"),t=e.createRadialGradient(128,128,0,128,128,128);t.addColorStop(0,"rgba(255,255,255,.055)"),t.addColorStop(.45,"rgba(255,255,255,.018)"),t.addColorStop(1,"rgba(255,255,255,0)"),e.fillStyle=t,e.fillRect(0,0,256,256);const n=new tx(i);n.colorSpace=ln;const r=new Xt(new Ps(4.2,4.2),new Gi({map:n,transparent:!0,depthWrite:!1}));return r.rotation.x=-Math.PI/2,r.position.y=-.014,r.renderOrder=-1,r}function Nc(i){const e=new Set,t=new Set,n=new Set,r=new Set;i.traverse(s=>{s.geometry&&e.add(s.geometry),s.skeleton&&r.add(s.skeleton);for(const o of s.material?[].concat(s.material):[]){t.add(o);for(const a of Object.values(o))a?.isTexture&&n.add(a)}});for(const s of[...e,...t,...n,...r])s.dispose()}const ff=[{source:9,id:"rear-support",name:"后侧支撑",detail:"长腿过前方",caption:"双手推地撑住身体，屈髋把开立的长腿抬过身体前方；腹部卷紧，臀中肌保持开腿。",primary:[{id:"triceps",side:"support",why:"双臂伸直锁肘，把身体撑离地面。"},{id:"deltoids",side:"support",why:"肩前倾在手的上方，控制承重肩。"},{id:"hip-flexors",side:"both",why:"主动屈髋，把长腿抬过身体前方。"},{id:"abs",side:"both",why:"卷腹折叠躯干，给抬腿留出空间。"},{id:"hip-abductors",side:"both",why:"双腿保持大开度，过前方时不合拢。"}],secondary:[{id:"serratus",side:"support"},{id:"forearms",side:"support"},{id:"adductors",side:"both"},{id:"quadriceps",side:"both"}]},{source:10,id:"first-transfer",name:"第一侧移重",detail:"单手接重",caption:"重量从双手移到单手：支撑侧三角肌、肱三头肌和前锯肌一起接住体重，腕屈肌稳住掌根；腹斜肌把骨盆转向侧面。",primary:[{id:"deltoids",side:"support",why:"整个上身的重量转到这一侧肩上。"},{id:"triceps",side:"support",why:"支撑臂伸肘锁住，不让手肘弯塌。"},{id:"serratus",side:"support",why:"肩胛贴住胸廓前伸，主动把地面推远。"},{id:"forearms",side:"support",why:"掌根刚接住体重，腕屈肌控制手腕不塌。"},{id:"obliques",side:"both",why:"转动躯干，让骨盆跟着摆腿转向侧面。"}],secondary:[{id:"rotator-cuff",side:"support"},{id:"hip-abductors",side:"free"},{id:"glute-max",side:"support"}]},{source:11,id:"first-support",name:"第一侧支撑",detail:"高 V 开腿",caption:"单手撑起全身、身体侧立：支撑肩最吃力，肩袖护住肩关节；腹斜肌把髋撑高，臀中肌打开高 V 字腿。",primary:[{id:"deltoids",side:"support",why:"单臂承担全身重量，肩部负荷最大的时刻。"},{id:"triceps",side:"support",why:"手臂保持笔直，身体才能侧立撑高。"},{id:"rotator-cuff",side:"support",why:"手臂举过头承重，肩袖把肱骨头稳在关节里。"},{id:"obliques",side:"both",why:"侧面核心把骨盆撑高，身体不往下塌。"},{id:"hip-abductors",side:"both",why:"臀中肌外展双腿，撑开高 V 字。"}],secondary:[{id:"serratus",side:"support"},{id:"forearms",side:"support"},{id:"lats",side:"support"},{id:"adductors",side:"both"}]},{source:12,id:"first-pass",name:"第一侧换腿",detail:"准备回撑",caption:"身体转向正面，双腿像剪刀一样换位过前：屈髋肌和腹直肌把腿带到前方，内收肌控制两腿交错；另一只手准备回撑。",primary:[{id:"triceps",side:"support",why:"仍是单手支撑，伸肘把身体顶住。"},{id:"deltoids",side:"support",why:"身体转向正面，承重肩随之转动控制。"},{id:"hip-flexors",side:"both",why:"屈髋把扫行的腿带到身体前方。"},{id:"abs",side:"both",why:"收腹折叠，骨盆抬住，给腿让出通道。"},{id:"adductors",side:"both",why:"两腿剪刀式交错，内收肌控制开合。"}],secondary:[{id:"obliques",side:"both"},{id:"quadriceps",side:"both"},{id:"serratus",side:"support"},{id:"forearms",side:"support"}]},{source:13,id:"front-support",name:"前侧支撑",detail:"开腿扫后方",caption:"双手在身后撑地、胸口朝上：肱三头肌、三角肌和胸大肌像做臂屈伸一样顶住身体；双腿保持大开度，准备向后扫。",primary:[{id:"triceps",side:"support",why:"双手在身后推地，伸肘把身体顶起。"},{id:"deltoids",side:"support",why:"肩在后伸位承重，前束最吃力。"},{id:"chest",side:"support",why:"胸大肌协助肩部在后伸位推地。"},{id:"hip-abductors",side:"both",why:"双腿抬高大开度，准备向后扫。"}],secondary:[{id:"scapular",side:"support"},{id:"hip-flexors",side:"both"},{id:"abs",side:"both"},{id:"forearms",side:"support"},{id:"glute-max",side:"both"}]},{source:14,id:"second-transfer",name:"第二侧移重",detail:"换手接重",caption:"换到另一只手单撑：支撑侧肩臂和前锯肌重新接住体重，腕屈肌稳住掌根；臀大肌带长腿从前方扫向后方。",primary:[{id:"deltoids",side:"support",why:"体重换到这一侧肩上，重新接住。"},{id:"triceps",side:"support",why:"新的支撑臂伸肘锁住。"},{id:"serratus",side:"support",why:"肩胛前伸推地，肩不往下沉。"},{id:"forearms",side:"support",why:"掌根刚接重，腕屈肌控制手腕。"},{id:"glute-max",side:"both",why:"伸髋发力，把长腿从前方扫向后方。"}],secondary:[{id:"rotator-cuff",side:"support"},{id:"obliques",side:"both"},{id:"hip-abductors",side:"free"},{id:"hamstrings",side:"both"}]},{source:15,id:"second-support",name:"第二侧支撑",detail:"高 V 开腿",caption:"另一侧单手侧撑：支撑肩与肩袖承担全身重量；腹斜肌撑高骨盆，臀中肌保持高 V 开腿。",primary:[{id:"deltoids",side:"support",why:"单臂承担全身重量，肩部负荷最大的时刻。"},{id:"triceps",side:"support",why:"手臂保持笔直，身体才能侧立撑高。"},{id:"rotator-cuff",side:"support",why:"手臂举过头承重，肩袖把肱骨头稳在关节里。"},{id:"obliques",side:"both",why:"侧面核心把骨盆撑高，身体不往下塌。"},{id:"hip-abductors",side:"both",why:"臀中肌外展双腿，撑开高 V 字。"}],secondary:[{id:"serratus",side:"support"},{id:"forearms",side:"support"},{id:"lats",side:"support"},{id:"adductors",side:"both"}]},{source:16,id:"second-pass",name:"第二侧换腿",detail:"准备接圈",caption:"身体转回朝下，双腿扫过后方：臀大肌伸髋带腿，竖脊肌保持髋部高度，腹斜肌把身体旋回；另一只手准备落地接回下一圈。",primary:[{id:"deltoids",side:"support",why:"单手支撑中身体旋回，承重肩随之控制。"},{id:"triceps",side:"support",why:"伸肘撑住，直到另一只手落地。"},{id:"glute-max",side:"both",why:"伸髋把长腿扫过身体后方。"},{id:"erectors",side:"both",why:"背部伸展肌群保持髋部高度，不塌腰。"},{id:"obliques",side:"both",why:"躯干旋回，把身体接回后侧支撑。"}],secondary:[{id:"hamstrings",side:"both"},{id:"serratus",side:"support"},{id:"forearms",side:"support"},{id:"hip-abductors",side:"both"}]}],Zd=Object.fromEntries(ff.map(i=>[i.source,i])),Iy={rear:9,sideA:11,front:13,sideB:15},Fy=i=>{const e=Number(i?.sourceStepNumber??i?.source?.stepNumber);return Number.isSafeInteger(e)?e:null};function Ny(i){return Zd[Fy(i)]??Zd[Iy[i?.phase]]??ff[0]}function Uy(i){const e=i?.pose?.limbs,t=e?.left?.handLocked===!0,n=e?.right?.handLocked===!0;return t&&!n?"left":n&&!t?"right":"both"}function Oy(i,{smooth:e=!1}={}){const t=Array.isArray(i?.steps)?i.steps:[],n=Number(i?.period)||9;if(!t.length)return{period:n,keys:[]};const r=new Set(i.skippedSteps??[]),s=e?t.length-1:t.length,o=e?n/(s+1):n/t.length,a=[];for(let l=0;l<s;l++)r.has(l)||a.push({time:l*o,index:l,phase:Ny(t[l]),support:Uy(t[l])});return{period:n,keys:a}}function ky(i,e,t=.16){const{keys:n,period:r}=i;if(!n?.length)return null;const s=(e%r+r)%r,o=n.length,a=_=>{const D=(_%o+o)%o;return{...n[D],t:n[D].time+Math.floor(_/o)*r}};let l=-1;for(;l<o-1&&n[l+1].time<=s;)l++;const c=a(l),u=a(l+1),d=(c.t+u.t)/2,h=s<d?l:l+1,p=a(h),g=a(h-1),b=a(h+1),m=(g.t+p.t)/2,f=(p.t+b.t)/2;let M=null,x=0;return f-s<t?(M=b,x=.5*(1-(f-s)/t)):s-m<t&&(M=g,x=.5*(1-(s-m)/t)),{current:p,neighbour:M,w:x,t:s}}function By(i,e){const t=n=>n==="both"||e==="both"?"both":n==="support"?e:n==="free"?e==="left"?"right":"left":n==="left"||n==="right"?n:"both";return[...i.primary.map(n=>({groupId:n.id,level:"primary",side:t(n.side),why:n.why??""})),...i.secondary.map(n=>({groupId:n.id,level:"secondary",side:t(n.side),why:n.why??""}))]}const zy=i=>i==="both"?"双手支撑":i==="left"?"左手支撑":"右手支撑",pf=[{groupId:"deltoids",section:"support",colour:"#4cc9f0",label:"三角肌",view:"front",role:"前、中、后束协同控制承重肩，接住每一次换手。"},{groupId:"rotator-cuff",section:"support",colour:"#a29bfe",label:"肩袖肌群",view:"back",role:"位于深层，帮助稳定肱骨头，支撑方向不断变化时护住肩关节。",note:"仅用冈下肌位置示意（斜线＝深层）；冈上肌、小圆肌、肩胛下肌未单独绘制。"},{groupId:"triceps",section:"support",colour:"#2f6bff",label:"肱三头肌",view:"back",role:"伸肘锁住支撑臂，手臂保持伸直受控。"},{groupId:"forearms",section:"support",label:"前臂 · 腕屈伸肌",colour:"#9ad1e8",view:"front",role:"掌根撑地时控制手腕与手指，平稳落手、卸载。",note:"屈肌群与伸肌群各合为一块面板；手部小肌群未绘制。"},{groupId:"serratus",section:"support",colour:"#5eead4",label:"前锯肌",view:"front",role:"让肩胛贴着胸廓前伸，主动把地面推远。",note:"只画出胸廓侧面可见的部分；被肩胛骨覆盖的部分未绘制。"},{groupId:"scapular",section:"support",label:"斜方肌中下部 · 菱形肌",colour:"#86efc4",view:"back",role:"协同调整肩胛位置，维持肩带与地面之间的支撑空间。",note:"菱形肌在斜方肌深层，这里与斜方肌中下部合为一块面板。"},{groupId:"chest",section:"support",colour:"#6f8dff",label:"胸大肌",view:"front",role:"前撑转侧撑时，配合控制上臂相对胸廓的方向。"},{groupId:"lats",section:"support",colour:"#00a896",label:"背阔肌",view:"back",role:"连接上臂与躯干，参与肩部下压与身体随支撑转移。"},{groupId:"abs",section:"core",colour:"#c466ff",label:"腹直肌（含深层腹横肌）",view:"front",role:"卷腹折叠躯干，与深层腹横肌一起稳住骨盆，给抬腿留出空间。",note:"面板为腹直肌；腹横肌位于深层，没有单独面板。"},{groupId:"obliques",section:"core",colour:"#ff6fb5",label:"腹斜肌",view:"front",role:"参与躯干旋转与侧向控制，让肩与骨盆随摆腿转动。",note:"面板为腹外斜肌；腹内斜肌在其深层，未单独绘制。"},{groupId:"erectors",section:"core",colour:"#e3b3ff",label:"竖脊肌",view:"back",role:"控制脊柱伸展与躯干位置，后撑时帮助保持髋高。",note:"腰方肌（腰部深层）暂无面板，未显示。"},{groupId:"hip-flexors",section:"core",colour:"#ff9ec7",label:"髋屈肌",view:"front",role:"位于骨盆深处，主动屈髋，把长腿从身体前方抬过去。",note:"髂腰肌在深层（斜线），与阔筋膜张肌合为一块面板示意；股直肌见股四头肌。"},{groupId:"glute-max",section:"legs",colour:"#ffb703",label:"臀大肌",view:"back",role:"髋伸展与后方扫腿（深层髋旋转肌配合调整腿的方向）。",note:"深层髋外旋肌群没有单独面板。"},{groupId:"hip-abductors",section:"legs",colour:"#ff7b2e",label:"臀中肌 · 髋外展",view:"back",role:"主动开腿并控制骨盆，离地后双腿不合拢。",note:"臀小肌在臀中肌深层，未单独绘制。"},{groupId:"adductors",section:"legs",colour:"#b5e655",label:"内收肌群",view:"front",role:"控制腿向中线回收与开度变化，衔接下一段扫腿。",note:"长收肌、短收肌、大收肌、股薄肌合为一块面板。"},{groupId:"quadriceps",section:"legs",colour:"#ffe45c",label:"股四头肌",view:"front",role:"保持膝部伸直，让长腿连续绕行。",note:"股中间肌位于深层，未单独绘制。"},{groupId:"hamstrings",section:"legs",colour:"#e9a46a",label:"腘绳肌",view:"back",role:"后侧长腿线条，参与髋伸与膝部控制。"}];Object.fromEntries(pf.map(i=>[i.groupId,i.colour]));const ui=Object.fromEntries(pf.map(i=>[i.groupId,i])),mf=Oy(Pl,{smooth:!0});function Rn(i){const e=ky(mf,i,.16),t=e.current;return{source:t.phase.source,id:t.phase.id,name:t.phase.name,caption:t.phase.caption,support:t.support,supportText:zy(t.support),items:By(t.phase,t.support).map(n=>({...n,colour:ui[n.groupId].colour,label:ui[n.groupId].label}))}}const Jd=mf.keys.map(i=>({phase:i.phase.source,time:i.time})),Ar=(i,e)=>i.clone().lerp(e,.5),_n=(i,e,t)=>i.clone().lerp(e,t),Hy=i=>i==="left"?"right":"left",Gy={deltoids:(i,e)=>_n(i(e+"Shoulder"),i(e+"Elbow"),.12),"rotator-cuff":(i,e)=>_n(i(e+"Shoulder"),Ar(i("leftShoulder"),i("rightShoulder")),.35),triceps:(i,e)=>_n(i(e+"Shoulder"),i(e+"Elbow"),.55),forearms:(i,e)=>_n(i(e+"Elbow"),i(e+"Wrist"),.4),serratus:(i,e)=>_n(i(e+"Shoulder"),i(e+"Hip"),.32),scapular:(i,e)=>_n(Ar(i("leftShoulder"),i("rightShoulder")),i(e+"Shoulder"),.35),chest:(i,e)=>_n(Ar(i("leftShoulder"),i("rightShoulder")),i(e+"Shoulder"),.45).add(new A(0,-.05,0)),lats:(i,e)=>_n(i(e+"Shoulder"),i(e+"Hip"),.45),abs:i=>_n(Ar(i("leftShoulder"),i("rightShoulder")),Ar(i("leftHip"),i("rightHip")),.62),obliques:(i,e)=>_n(i(e+"Shoulder"),i(e+"Hip"),.7),erectors:i=>_n(Ar(i("leftShoulder"),i("rightShoulder")),Ar(i("leftHip"),i("rightHip")),.75),"hip-flexors":(i,e)=>_n(i(e+"Hip"),i(e+"Knee"),.08),"glute-max":(i,e)=>_n(i(e+"Hip"),i(Hy(e)+"Hip"),.2),"hip-abductors":(i,e)=>_n(i(e+"Hip"),i(e+"Knee"),.02),adductors:(i,e)=>_n(i(e+"Hip"),i(e+"Knee"),.35),quadriceps:(i,e)=>_n(i(e+"Hip"),i(e+"Knee"),.55),hamstrings:(i,e)=>_n(i(e+"Hip"),i(e+"Knee"),.6)};function Vy(i,e,t=45){const n=i.getMetrics().joints,r=o=>new A().fromArray(n[o]??n.pelvis),s=[];for(const o of e.filter(a=>a.level==="primary")){const a=Gy[o.groupId];if(!a)continue;const c=(o.side==="both"?["left","right"]:[o.side]).map(h=>({side:h,point:a(r,h)}));c.sort((h,p)=>h.point.distanceToSquared(i.camera.position)-p.point.distanceToSquared(i.camera.position));const u=c[0],d=i.project(u.point);d.behind||d.x<12||d.y<12||d.x>i.container.clientWidth-12||d.y>i.container.clientHeight-12||s.some(h=>Math.hypot(h.x-d.x,h.y-d.y)<t)||s.push({...d,groupId:o.groupId,label:o.label,colour:o.colour,side:u.side})}return s}const Wy=[["skinHead","","skin",[0,1.6,.01],[.105,.125,.125],0,0,"k"],["skinHand","","skin",[.4,.78,.09],[.065,.105,.09],.35,0,"k"],["skinFoot","","skin",[.17,.03,.03],[.08,.085,.15],0,0,"k"],["skinKnee","","skin",[.135,.47,.03],[.06,.04,.07],.05,0,"k"],["skinShin","","skin",[.128,.3,.01],[.026,.15,.03],-.05,0,"k"],["neck","胸锁乳突肌","neck",[.03,1.47,.055],[.024,.065,.04],.25,-.45,""],["trapUpper","斜方肌上部","trap",[.075,1.43,-.03],[.1,.075,.075],-.3,.1,"m"],["deltFront","三角肌前束","delt",[.18,1.34,.05],[.048,.085,.048],.25,0,""],["deltSide","三角肌中束","delt",[.215,1.33,0],[.048,.09,.06],.3,0,""],["deltRear","三角肌后束","delt",[.18,1.34,-.06],[.048,.085,.048],.25,0,""],["pec","胸大肌","pec",[.08,1.29,.12],[.105,.08,.075],.1,0,"m"],["biceps","肱二头肌","biceps",[.245,1.19,.035],[.04,.11,.045],.36,0,""],["triceps","肱三头肌","triceps",[.258,1.2,-.045],[.045,.13,.05],.36,0,""],["forearmFlex","前臂屈肌群","forearm",[.335,.98,.05],[.04,.11,.04],.37,0,""],["forearmExt","前臂伸肌群","forearm",[.35,.98,0],[.04,.11,.045],.37,0,""],["serratus","前锯肌","serratus",[.135,1.18,.075],[.04,.06,.05],-.15,0,""],["abs","腹直肌","abs",[.036,1.03,.14],[.048,.215,.06],0,0,"ma"],["oblique","腹外斜肌","oblique",[.132,1.02,.06],[.05,.12,.08],.08,0,""],["infraspinatus","冈下肌（肩袖）","infra",[.11,1.29,-.095],[.055,.055,.045],0,0,""],["scapular","菱形肌 / 斜方肌中下部","trap",[.04,1.25,-.1],[.05,.13,.045],0,0,"m"],["lats","背阔肌","lats",[.125,1.13,-.065],[.07,.13,.07],-.15,0,""],["erectors","竖脊肌","erectors",[.035,.99,-.075],[.04,.13,.045],0,0,"m"],["gluteMed","臀中肌","gluteMed",[.15,.91,-.03],[.055,.06,.065],0,0,"c"],["glutes","臀大肌","glutes",[.085,.83,-.085],[.1,.09,.07],0,0,"mc"],["hipFlexor","髂腰肌 / 阔筋膜张肌","hipFlexor",[.12,.87,.08],[.055,.065,.05],0,0,"c"],["quadRect","股直肌","quads",[.105,.65,.1],[.045,.16,.05],.05,0,"c"],["quadLat","股外侧肌","quads",[.165,.64,.068],[.045,.16,.055],.05,0,"c"],["quadMed","股内侧肌","quads",[.085,.52,.075],[.04,.08,.045],.02,0,""],["adductors","内收肌群","adductors",[.05,.67,.01],[.045,.14,.06],.05,0,"c"],["hamLat","股二头肌","ham",[.162,.62,-.042],[.045,.17,.05],.04,0,"c"],["hamMed","半腱肌 / 半膜肌","ham",[.085,.62,-.055],[.045,.17,.05],.04,0,"c"],["tibialis","胫骨前肌","tibialis",[.178,.32,-.01],[.026,.12,.032],0,0,""],["calfMed","腓肠肌内侧头","calf",[.13,.35,-.085],[.04,.1,.045],0,0,""],["calfLat","腓肠肌外侧头","calf",[.18,.35,-.08],[.04,.1,.045],0,0,""]],qy=[["adductors",[0,.79,.02],[.055,.07,.065],0,0]],gf=1.4,yi=Wy.map(([i,e,t,n,r,s,o,a],l)=>{const c=a.includes("k");return{id:i,name:e,family:t,centre:n,radius:c?r:r.map(u=>u*gf),tz:s,tx:o,skin:c,mid:a.includes("m"),abs:a.includes("a"),cloth:a.includes("c"),index:l}}),Si=Object.fromEntries(yi.map(i=>[i.id,i])),jy=["skin",...new Set(yi.map(i=>i.family).filter(i=>i!=="skin"))],bf=yi.length,io=[...yi.map(i=>({...i,parent:i.index})),...qy.map(([i,e,t,n,r])=>({centre:e,radius:t.map(s=>s*gf),tz:n,tx:r,parent:Si[i].index}))],Xy=io.length,Ul=Si.abs.index,_f=14,Qy=i=>{const e=Math.min(Math.max((1.03-i)/.2,0),1),t=Math.min(Math.max((i-1.08)/.14,0),1);return .09-.064*e**1.6-.014*t*t*(3-2*t)},Ky=(i,e,t)=>{const n=Qy(e)-i,r=e-.832,s=Math.max(.012-Math.abs(n-r),0)/.012;return Math.min(Math.min(n,r)-s*s*.003,t-.04)},Yy=(i,e,t)=>{const n=Math.min(Math.max((t-i)/(e-i),0),1);return n*n*(3-2*n)},Ma={deltoids:{label:"三角肌",muscles:["deltFront","deltSide","deltRear"]},"rotator-cuff":{label:"肩袖肌群",muscles:["infraspinatus"],deep:!0},triceps:{label:"肱三头肌",muscles:["triceps"]},serratus:{label:"前锯肌",muscles:["serratus"]},scapular:{label:"肩胛稳定肌群",muscles:["scapular"]},obliques:{label:"腹斜肌",muscles:["oblique"]},erectors:{label:"竖脊肌",muscles:["erectors"]},"hip-flexors":{label:"髋屈肌",muscles:["hipFlexor"],deep:!0},quadriceps:{label:"股四头肌",muscles:["quadRect","quadLat","quadMed"]},glutes:{label:"臀肌",muscles:["glutes","gluteMed"]},"glute-max":{label:"臀大肌",muscles:["glutes"]},"hip-abductors":{label:"臀中肌 · 髋外展",muscles:["gluteMed"]},"hip-rotators":{label:"髋外旋肌群",muscles:["glutes"],deep:!0},adductors:{label:"内收肌群",muscles:["adductors"]},hamstrings:{label:"腘绳肌",muscles:["hamLat","hamMed"]},chest:{label:"胸大肌",muscles:["pec"]},pectorals:{label:"胸肌",muscles:["pec"]},abs:{label:"腹直肌",muscles:["abs"]},biceps:{label:"肱二头肌",muscles:["biceps"]},forearms:{label:"前臂肌群",muscles:["forearmFlex","forearmExt"]},traps:{label:"斜方肌",muscles:["trapUpper","scapular"]},lats:{label:"背阔肌",muscles:["lats"]},calves:{label:"小腿三头肌",muscles:["calfMed","calfLat"]},tibialis:{label:"胫骨前肌",muscles:["tibialis"]},neck:{label:"颈部肌群",muscles:["neck"]}};function Sa(i){if(Ma[i])return Ma[i];const e=Si[i];return e?{label:e.name,muscles:[e.id]}:null}function $y(i,e,t,n){let r=e-i.centre[0],s=t-i.centre[1],o=n-i.centre[2];const a=Math.cos(i.tz),l=Math.sin(i.tz);[r,s]=[r*a+s*l,s*a-r*l];const c=Math.cos(i.tx),u=Math.sin(i.tx);return[s,o]=[s*c+o*u,o*c-s*u],[r,s,o]}function ru(i,e=1.69){const t=1.69/e,n=Math.abs(i.x)*t,r=i.y*t,s=i.z*t,o=new Float64Array(bf).fill(-9);let a=-9;for(const p of io){const[g,b,m]=$y(p,n,r,s),f=1-Math.hypot(g/p.radius[0],b/p.radius[1],m/p.radius[2]);p.parent===Ul?a=f:o[p.parent]=Math.max(o[p.parent],f)}const l=Math.max(...o),c=(a-l)*.1+Yy(1.13,1.08,r);o[Ul]=Math.max(l,0)+_f*Math.min(Ky(n,r,s),c);let u=-1,d=-1,h=null;return o.forEach((p,g)=>{p>u?(d=u,u=p,h=yi[g].id):p>d&&(d=p)}),u>.02&&!Si[h].skin?{id:h,name:Si[h].name,side:i.x>=0?"left":"right",score:u,margin:u-Math.max(d,0)}:null}function Zy(){return{mmC:{value:io.map(i=>new mt(...i.centre,i.parent))},mmR:{value:io.map(i=>new A(...i.radius))},mmT:{value:io.map(i=>new mt(Math.cos(i.tz),Math.sin(i.tz),Math.cos(i.tx),Math.sin(i.tx)))},mmF:{value:yi.map(i=>new mt(jy.indexOf(i.family),i.mid?1:0,i.abs?1:0,i.cloth?1:0))},mmState:{value:yi.map(()=>new mt(0,0,0,0))},mmCol:{value:yi.map(()=>new rt("#ff5a36"))},mmMulti:{value:0},mmScale:{value:1},mmTime:{value:0},mmReveal:{value:1},mmDebug:{value:0},mmAccent:{value:new rt("#ff5a36")},mmAccent2:{value:new rt("#ffae5c")},mmBase:{value:new rt("#939dab")},mmSkin:{value:new rt("#7f8896")},mmGroove:{value:new rt("#3f4859")},mmFabric:{value:new rt("#1a2130")}}}const Jy=`
#define MM_N ${bf}
#define MM_NE ${Xy}
#define MM_ABS ${Ul}
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
    float sa = max(b1, 0.0) + ${_f.toFixed(1)} * min(mmAbsInside(p), top);
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
}`;function eM(i,e,{clothing:t=!1}={}){i.onBeforeCompile=n=>{Object.assign(n.uniforms,e),n.vertexShader=`varying vec3 vMmPos;
`+n.vertexShader.replace("#include <begin_vertex>",`#include <begin_vertex>
vMmPos = transformed;`),n.fragmentShader=Jy+`
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
        }`)},i.customProgramCacheKey=()=>"muscle-map-v4"+(t?"-c":""),i.needsUpdate=!0}function tM(i,e){const t=i.mmState.value,n=new Set;for(const r of t)r.x=0,r.y=0,r.w=0;for(const r of e){const s=Si[r.muscle];if(!s)continue;const o=t[s.index],a=r.level==="deep"?-1:r.level==="secondary"?.6:1,l=d=>d===1?3:d===-1?2:d?1:0;l(a)>l(o.x)&&(o.x=a);const c=r.side==="left"?1:r.side==="right"?-1:0,u=!n.has(s.index);o.y=!u&&o.y!==c?0:c,n.add(s.index),r.colour&&i.mmCol.value[s.index].set(r.colour),o.w=u?r.dim??0:Math.min(o.w,r.dim??0)}}function nM(i,e=[]){const t=i.mmState.value;for(const n of t)n.z=0;for(const n of e){const r=Si[n];r&&(t[r.index].z=1)}}const iM={targetHip:[0,.86,0],targetShoulder:[0,1.36,-.005],targetLeftShoulder:[.19,1.36,-.005]},rM=[[.8519647653602053,.86,.14123115616294554,.15381037174264547,.09262726324065938,-.08592658351782756,.09706453300245481,-.10011745737069572],[.9348899653602052,.94,.13320318840949602,.14595730495273262,.11661488219848297,-.07357852059669932,.11424942408939057,-.07492253514509346],[1.0281808153602052,1.03,.12227492890574483,.14904280885929877,.13808155655391605,-.0447849032958402,.1316576062777205,-.06389861212644905],[1.0800090653602052,1.08,.1210116942554125,.14729703221435375,.14076212342835936,-.046380452159224025,.13736222206751886,-.07168580505982716],[1.1629342653602053,1.16,.1444635501875882,.16692346562702368,.14190019649751573,-.059520373090000515,.13601027049039877,-.0897280470956204],[1.2458594653602053,1.24,.16413436268796855,.2762911195041309,.1416611216723902,-.08624352043435868,.1414359237322392,-.10653363669456134],[1.3080533653602053,1.3,null,.25192030140219435,null,null,.11259043199045207,-.10893461867303987],[1.3702472653602056,1.36,null,.22297681384823365,null,null,.07563556215280054,-.09363302401676188]],sM=[{targetY:.86,source:{valid:!0,halfWidth:.14123115616294554,front:.09262726324065938,back:-.08592658351782756,openEnds:0,points:122,components:1},target:{valid:!0,halfWidth:.15381037174264547,front:.09706453300245481,back:-.10011745737069572,openEnds:0,points:130,components:3},ratio:1.0890682758780694,accepted:!0,reasons:[],fallback:null},{targetY:.94,source:{valid:!0,halfWidth:.13320318840949602,front:.11661488219848297,back:-.07357852059669932,openEnds:0,points:108,components:1},target:{valid:!0,halfWidth:.14595730495273262,front:.11424942408939057,back:-.07492253514509346,openEnds:0,points:130,components:3},ratio:1.0957493337473847,accepted:!0,reasons:[],fallback:null},{targetY:1.03,source:{valid:!0,halfWidth:.12227492890574483,front:.13808155655391605,back:-.0447849032958402,openEnds:0,points:114,components:1},target:{valid:!0,halfWidth:.14904280885929877,front:.1316576062777205,back:-.06389861212644905,openEnds:0,points:132,components:3},ratio:1.218915522528644,accepted:!0,reasons:[],fallback:null},{targetY:1.08,source:{valid:!0,halfWidth:.1210116942554125,front:.14076212342835936,back:-.046380452159224025,openEnds:0,points:104,components:1},target:{valid:!0,halfWidth:.14729703221435375,front:.13736222206751886,back:-.07168580505982716,openEnds:0,points:134,components:3},ratio:1.2172132050598539,accepted:!0,reasons:[],fallback:null},{targetY:1.16,source:{valid:!0,halfWidth:.1444635501875882,front:.14190019649751573,back:-.059520373090000515,openEnds:0,points:90,components:1},target:{valid:!0,halfWidth:.16692346562702368,front:.13601027049039877,back:-.0897280470956204,openEnds:0,points:140,components:3},ratio:1.1554711580206283,accepted:!0,reasons:[],fallback:null},{targetY:1.24,source:{valid:!0,halfWidth:.16413436268796855,front:.1416611216723902,back:-.08624352043435868,openEnds:0,points:168,components:1},target:{valid:!0,halfWidth:.2762911195041309,front:.1414359237322392,back:-.10653363669456134,openEnds:0,points:318,components:1},ratio:1.6833228275871794,accepted:!1,reasons:["reference_core_width_outside_guard_or_arm_join","width_ratio_outside_guard"],fallback:"interpolate_from_accepted_core_rows_to_canonical_shoulder_ratio"},{targetY:1.3,source:{valid:!1,reason:"no_continuous_midline_component",components:2},target:{valid:!0,halfWidth:.25192030140219435,front:.11259043199045207,back:-.10893461867303987,openEnds:0,points:294,components:1},ratio:null,accepted:!1,reasons:["no_continuous_midline_component","reference_core_width_outside_guard_or_arm_join"],fallback:"interpolate_from_accepted_core_rows_to_canonical_shoulder_ratio"},{targetY:1.36,source:{valid:!1,reason:"no_continuous_midline_component",components:2},target:{valid:!0,halfWidth:.22297681384823365,front:.07563556215280054,back:-.09363302401676188,openEnds:0,points:293,components:1},ratio:null,accepted:!1,reasons:["no_continuous_midline_component","reference_core_width_outside_guard_or_arm_join"],fallback:"interpolate_from_accepted_core_rows_to_canonical_shoulder_ratio"}],oM={coreBones:["pelvis","spineLower","spineUpper","torso"]},ns={canonicalAnchors:iM,rows:rM,measurements:sM,limits:oM},aM=new Set(ns.limits.coreBones);function cM(i){const e=new A().fromArray(i.leftHip).add(new A().fromArray(i.rightHip)).multiplyScalar(.5),t=new A().fromArray(i.shoulderCenter),n=ns.canonicalAnchors.targetHip,r=ns.canonicalAnchors.targetShoulder,s=ns.rows.filter((o,a)=>ns.measurements[a].accepted).map(o=>[o[1],o[3]/o[2]]);return s.push([r[1],ns.canonicalAnchors.targetLeftShoulder[0]/Math.abs(i.leftShoulder[0])]),(o,a)=>{const l=vt.clamp((o.y-e.y)/(t.y-e.y),0,1),c=o.y+vt.lerp(n[1]-e.y,r[1]-t.y,l);let u=s[0][1];for(let d=1;d<s.length;d++){const h=s[d-1],p=s[d];if(u=vt.lerp(h[1],p[1],vt.clamp((c-h[0])/(p[0]-h[0]),0,1)),c<=p[0])break}return a.set(o.x*u,c,o.z+vt.lerp(n[2]-e.z,r[2]-t.z,l))}}function xf(i){for(let e=i;e;e=e.parent)if(e.name==="Coach_Body"||/^Coach_Training_(Tee|Shorts)(_|$)/.test(e.name))return!0;return!1}const lM=new Set(["Coach_Face","Coach_Hair","Coach_Brows","Coach_Eyes","Coach_Eye_Glints","Coach_Lower_Gums","Coach_Lower_Teeth","Coach_Upper_Gums","Coach_Upper_Teeth","Coach_Tongue"]);function uM(i){for(let e=i;e;e=e.parent)if(lM.has(e.name))return!0;return!1}const ea={shoulder:[.19,1.36,-.005],elbow:[.29,1.085,-.005],wrist:[.365,.875,.02],palm:[.39,.8,.04],hip:[.09,.86,0],knee:[.12,.47,0],ankle:[.15,.08,-.02],toe:[.17,.03,.13]},dM={UpperArm:["Shoulder","Elbow","shoulder","elbow"],Forearm:["Elbow","Wrist","elbow","wrist"],Hand:["Wrist","Palm","wrist","palm"],Thigh:["Hip","Knee","hip","knee"],Patella:["Knee","Ankle","knee","ankle"],Shin:["Knee","Ankle","knee","ankle"],Foot:["Ankle","Toe","ankle","toe"]};function hM(i,e){const t=i.getMetrics().time;i.reset(),e.updateMatrixWorld(!0);const n=i.getMetrics().joints,r={},s=cM(n),o=(p,g)=>new A(g==="left"?ea[p][0]:-ea[p][0],ea[p][1],ea[p][2]);for(const p of["left","right"])for(const[g,[b,m,f,M]]of Object.entries(dM)){const x=new A().fromArray(n[p+b]),_=new A().fromArray(n[p+m]),D=o(f,p),P=o(M,p);r[p+g]={P0:x,Q0:D,rotation:new qe().setFromUnitVectors(_.clone().sub(x).normalize(),P.clone().sub(D).normalize()),scale:P.distanceTo(D)/_.distanceTo(x)}}const a=[],l=new A,c=new A,u=new A,d=new mt,h=new mt;return e.traverse(p=>{if(!p.isSkinnedMesh)return;const g=p.geometry,b=g.attributes.position.count,m=new Float32Array(b*3),f=g.attributes.skinIndex,M=g.attributes.skinWeight,x=p.skeleton.bones;p.skeleton.update();for(let _=0;_<b;_++){p.getVertexPosition(_,l).applyMatrix4(p.matrixWorld),d.fromBufferAttribute(f,_),h.fromBufferAttribute(M,_),c.set(0,0,0);let D=0;for(let P=0;P<4;P++){const T=h.getComponent(P);if(T<=0)continue;const N=x[d.getComponent(P)]?.name,v=r[N];v?u.copy(l).sub(v.P0).applyQuaternion(v.rotation).multiplyScalar(v.scale).add(v.Q0):aM.has(N)?s(l,u):u.copy(l),c.addScaledVector(u,T),D+=T}c.multiplyScalar(1/(D||1)),c.toArray(m,_*3)}g.setAttribute("mmRest",new yn(m,3)),a.push(p)}),i.update(t),e.updateMatrixWorld(!0),a}const ha={};for(const[i,e]of Object.entries(Ma))if(ui[i])for(const t of e.muscles)(ha[t]??(ha[t]=[])).push(i);function fM(i,e){const t=new jh,n=new ut,r=new A,s=new A,o=new A,a=new A,l=new Jn,c=new A,u=new A;let d=null;function h(){i.coach.updateMatrixWorld(!0);for(const g of e)g.skeleton.update(),g.computeBoundingSphere(),g.computeBoundingBox();d=i.time}function p(g,b,m){d!==i.time&&h();const f=i.renderer.domElement.getBoundingClientRect();n.set((g-f.left)/f.width*2-1,-(b-f.top)/f.height*2+1),t.setFromCamera(n,i.camera);const M=t.intersectObjects(e.filter(x=>x.visible),!1);for(const x of M){const _=x.object,D=x.face,P=_.geometry.getAttribute("mmRest");if(!D||!P||(_.getVertexPosition(D.a,r).applyMatrix4(_.matrixWorld),_.getVertexPosition(D.b,s).applyMatrix4(_.matrixWorld),_.getVertexPosition(D.c,o).applyMatrix4(_.matrixWorld),!l.set(r,s,o).getBarycoord(x.point,a)))continue;c.fromBufferAttribute(P,D.a).multiplyScalar(a.x),c.addScaledVector(u.fromBufferAttribute(P,D.b),a.y).addScaledVector(u.fromBufferAttribute(P,D.c),a.z);const T=ru(c,1.69);if(!T)continue;const N=ha[T.id]??[],v=N.map(C=>m.find(q=>q.groupId===C&&(q.side==="both"||q.side===T.side))).find(Boolean),y=v?.groupId??N[0];if(y)return{groupId:y,side:T.side,panelId:T.id,inPhase:!!v}}return null}return{pick:p,prepare:h}}function pM(i,e){const t=Math.abs(i),n=1-vt.smoothstep(t,.07,.12),r=vt.smoothstep(e,.66,.72)*(1-vt.smoothstep(e,.9,.96)),s=vt.smoothstep(t,.33,.36)*(1-vt.smoothstep(e,.88,.92));return(1-n*r)*(1-s)}const mM=`{ float flareW = smoothstep(0.12, 0.75, vFocusW);
  float flareDark = 1.0 - smoothstep(0.02, 0.25, dot(diffuseColor.rgb, vec3(0.333)));
  flareFocusGlow = focusTint * flareW * mix(0.06, 0.30, flareDark);
  diffuseColor.rgb = mix(diffuseColor.rgb, focusTint, flareW * mix(0.78, 0.62, flareDark)); }`;function eh(i,e){const t=i.clone(),n=i.onBeforeCompile;return t.userData={...i.userData,flareFocusProxyOf:i.uuid},t.onBeforeCompile=(r,s)=>{n?.call(t,r,s),r.uniforms.focusTint=e,r.vertexShader=`attribute float focusW;
varying float vFocusW;
`+r.vertexShader.replace("#include <begin_vertex>",`#include <begin_vertex>
vFocusW = focusW;`);let o=`uniform vec3 focusTint;
varying float vFocusW;
`+r.fragmentShader;o=o.replace("void main() {",`void main() {
vec3 flareFocusGlow = vec3(0.0);`),o=o.replace("#include <color_fragment>",`#include <color_fragment>
`+mM),o=o.includes("#include <emissivemap_fragment>")?o.replace("#include <emissivemap_fragment>",`#include <emissivemap_fragment>
totalEmissiveRadiance += flareFocusGlow;`):o,r.fragmentShader=o},t.customProgramCacheKey=()=>"flare-motion-focus-v3-"+(i.customProgramCacheKey?.()??"")+i.type,t}function gM(i){const e=new Map(i.map(b=>[b,b.material])),t=new Map,n=new A,r={value:new rt("#ff6a3d")};let s=!1;for(const b of i){if(!xf(b))continue;const m=b.geometry,f=m.getAttribute("mmRest"),M=f.count,x=new Int16Array(M).fill(-1),_=new Int8Array(M),D=new Float32Array(M);for(let O=0;O<M;O++){n.fromBufferAttribute(f,O),D[O]=pM(n.x,n.y);const $=ru(n,1.69);$&&(x[O]=yi.indexOf(Si[$.id]),_[O]=$.side==="left"?1:-1)}const P=new Map,T=new Int32Array(M),N=m.attributes.position;for(let O=0;O<M;O++){const $=Math.round(N.getX(O)*2e3)+","+Math.round(N.getY(O)*2e3)+","+Math.round(N.getZ(O)*2e3);P.has($)||P.set($,O),T[O]=P.get($)}const v=m.index.array,y=new Int32Array(v.length*2);for(let O=0,$=0;O<v.length;O+=3)for(const[se,Z]of[[0,1],[1,2],[2,0]])y[$++]=T[v[O+se]],y[$++]=T[v[O+Z]];const C=new yn(new Float32Array(M),1);m.setAttribute("focusW",C);const q=Array.isArray(b.material)?b.material.map(O=>eh(O,r)):eh(b.material,r);t.set(b,{panel:x,side:_,guard:D,edges:y,weld:T,attribute:C,material:q})}function o(b,m,f=!1){if(p(),!b||!f||!ui[b])return;r.value.set(ui[b].colour??"#ff6a3d");const M=new Set((Sa(b)?.muscles??[]).map(D=>yi.indexOf(Si[D]))),x=m.find(D=>D.groupId===b),_=x?.side==="left"?1:x?.side==="right"?-1:0;for(const[D,P]of t){const{panel:T,side:N,guard:v,edges:y,weld:C,attribute:q}=P,O=T.length;let $=new Float32Array(O);for(let ce=0;ce<O;ce++)$[ce]=M.has(T[ce])&&(!_||N[ce]===_)?1:0;const se=new Float32Array(O),Z=new Float32Array(O);for(let ce=0;ce<5;ce++){se.fill(0),Z.fill(0);for(let k=0;k<y.length;k+=2){const K=y[k],X=y[k+1];se[K]+=$[X],Z[K]++,se[X]+=$[K],Z[X]++}const L=new Float32Array(O);for(let k=0;k<O;k++)L[k]=Z[k]?($[k]+se[k])/(1+Z[k]):$[k];$=L}for(let ce=0;ce<O;ce++)q.array[ce]=$[C[ce]]*v[ce];q.needsUpdate=!0,D.material=P.material}s=!0}const a=new A,l=new A,c=new A,u=new A,d=new A;function h(){if(!s)return null;const b=new A;let m=0;for(const[M,x]of t){const _=x.attribute.array,D=M.geometry.index.array;M.skeleton.update();for(let P=0;P<D.length;P+=3){const T=(_[D[P]]+_[D[P+1]]+_[D[P+2]])/3;T<.1||(M.getVertexPosition(D[P],a).applyMatrix4(M.matrixWorld),M.getVertexPosition(D[P+1],l).applyMatrix4(M.matrixWorld),M.getVertexPosition(D[P+2],c).applyMatrix4(M.matrixWorld),u.subVectors(l,a),d.subVectors(c,a),b.addScaledVector(u.cross(d),T*.5),m+=T)}}if(!m||b.lengthSq()<1e-12)return null;const f=b.normalize();return f.y=Math.max(.12,Math.min(.55,f.y+.15)),f.normalize()}function p(){for(const[b,m]of e)b.material=m;s=!1}const g=()=>[...t.values()].flatMap(b=>[].concat(b.material));return{show:o,restore:p,focusDirection:h,isProxy:b=>g().includes(b),releaseGpu(){for(const b of new Set([...e.values()].flat()))b.dispose();for(const b of g())b.dispose()},dispose(){p();for(const b of g())b.dispose()}}}function bM(i,e,t,n=()=>null){let r=null,s=null,o="motion",a={};const l=new vn(32,1,.02,40),c=document.createElement("button");c.className="minimap",c.hidden=!0,(window.parent!==window||window.FlareHost)&&(c.tabIndex=-1,c.setAttribute("aria-hidden","true")),c.innerHTML="<span>肌群图</span>",i.container.append(c);const u=()=>({position:i.camera.position.clone(),target:i.controls.target.clone()}),d=v=>i.setCameraView(v.position,v.target);function h(v){const y=(Sa(v)?.muscles??[]).map(q=>Si[q]?.centre).filter(Boolean),C=y.length&&y.reduce((q,O)=>q+O[2],0)/y.length<-.01;return new A(0,.1,C?-1:1)}function p(){return n()??no.standard.clone()}function g(){const v=i.getMetrics().bounds;return new an(new A().fromArray(v.min),new A().fromArray(v.max)).expandByScalar(.04)}function b(v,y=null){if(!s)return;const C=o==="muscles"?e.getFullBounds().expandByScalar(.035):g(),q=y??(o==="muscles"?h(s):p());i.fitBounds(C,q,o==="muscles"?1.08:1.04),i.autoFrame=!1}function m(){const v=!!s&&o==="motion";i.controls.enabled=!v,i.controls.enableZoom=!v}function f(){m(),e.refreshEnvironment(),i.setDisplayScene(o==="muscles"?e.scene:null),c.querySelector("span").textContent=o==="motion"?"肌群图":"动作",c.setAttribute("aria-label",o==="motion"?"切换到全身肌群模型":"切换到托马斯动作")}function M(v,y){const C=!r,q=s!==v;C&&(r={...u(),framingMode:i.framingMode,autoFrame:i.autoFrame},o="motion",a={}),i.autoFrame=!1,i.setFramingMode("detail"),s=v,c.hidden=!1,e.setDetail(v,y),f(),(C||q)&&(a={},b())}function x(v,y){return!s||!["motion","muscles"].includes(v)||v===o?!1:(a[o]=u(),o=v,f(),a[o]?d(a[o]):b(),i.autoFrame=!1,i.dirty=!0,!0)}function _(){if(i.setDisplayScene(null),e.restorePhase(),r){const v=r;r=null,i.autoFrame=!1,i.setFramingMode(v.framingMode),d(v),i.autoFrame=v.autoFrame}s=null,o="motion",a={},c.hidden=!0,m()}function D(v,y=null){s&&(a={},b(v,o==="motion"?null:y??h(s)))}function P(v){if(!s)return;const y=o==="motion"?null:i.camera.position.clone().sub(i.controls.target);a={},b(v,y)}function T(v){i.setVisible(!0),x(o==="motion"?"muscles":"motion")&&t?.(o)}function N(){if(!s||c.hidden)return;const v=c.getBoundingClientRect(),y=i.container.getBoundingClientRect();if(!(v.width>0&&v.height>0))return;const C=v.width,q=v.height,O=v.left-y.left,$=y.height-(v.bottom-y.top),se=o==="motion"?"muscles":"motion",Z=i.getMetrics().bounds,ce=se==="muscles"?e.getFullBounds():new an(new A().fromArray(Z.min),new A().fromArray(Z.max)),L=ce.getCenter(new A),k=ce.getSize(new A),K=se==="muscles"?h(s):a.motion?a.motion.position.clone().sub(a.motion.target):p();l.aspect=C/q,l.updateProjectionMatrix();const X=Math.tan(vt.degToRad(16)),ee=Math.max(k.y/2/X,k.x/2/(X*l.aspect))+k.z;l.position.copy(L).addScaledVector(K.normalize(),ee*1.12),l.lookAt(L),e.refreshEnvironment();const le=i.renderer,j={viewport:le.getViewport(new mt),scissor:le.getScissor(new mt),scissorTest:le.getScissorTest(),color:le.getClearColor(new rt),alpha:le.getClearAlpha()};try{le.setScissorTest(!0),le.setScissor(O,$,C,q),le.setViewport(O,$,C,q),le.setClearColor(document.documentElement.dataset.theme==="light"?15526629:1513762,1),le.render(se==="muscles"?e.scene:i.scene,l)}finally{le.setViewport(j.viewport),le.setScissor(j.scissor),le.setScissorTest(j.scissorTest),le.setClearColor(j.color,j.alpha)}}return{open:M,close:_,toggle:T,setModel:x,reset:D,refit:P,renderMini:N,mini:c,getModel:()=>o,dispose(){_(),c.remove()}}}function th(i,e=[],t="both"){nM(i,e),i.mmFocusSide.value=t==="left"?1:t==="right"?-1:0}function _M(i,e,{posed:t=!1,thumbnail:n=!1,density:r=null}={}){e.mmFocusSide??(e.mmFocusSide={value:0}),e.mmFocusColour??(e.mmFocusColour={value:new rt("#e58b90")}),e.mmFocusInk??(e.mmFocusInk={value:new rt("#a7777b")}),eM(i,e);const s=i.onBeforeCompile,o=r??{value:1};i.onBeforeRender=a=>{(!r||a.getRenderTarget()===null)&&(o.value=a.getPixelRatio())},i.onBeforeCompile=(a,l)=>{s(a,l),a.uniforms.mmStrokeDensity=o,t&&(a.vertexShader=`attribute vec3 mmRest;
`+a.vertexShader.replace("vMmPos = transformed;","vMmPos = mmRest;")),a.fragmentShader=`uniform float mmStrokeDensity;
uniform float mmFocusSide; uniform vec3 mmFocusColour; uniform vec3 mmFocusInk;
float mmPanelCoverage; float mmFocusCoverage; float mmFocusOutline;
`+a.fragmentShader;const c=(d,h)=>{if(!a.fragmentShader.includes(d))throw new Error("functional_shader_source_mismatch");a.fragmentShader=a.fragmentShader.replace(d,h)};c("smoothstep(1.13, 1.08, p.y)","(1.0 - smoothstep(1.08, 1.13, p.y))"),c("smoothstep(0.003, -0.003, sx)","(1.0 - smoothstep(-0.003, 0.003, sx))"),c("float b1 = -9.0, b2 = -9.0, sAbs = -9.0; int i1 = -1, i2 = -1;","float b1 = -9.0, b2 = -9.0, sAbs = -9.0; int i1 = -1, i2 = -1; float focusScore = -9.0, otherScore = 0.0;"),c("if (k == MM_ABS) { sAbs = s; continue; }",`if (k == MM_ABS) { sAbs = s; continue; }
    if (mmState[k].z > 0.5 && mmF[k].x > 0.5) focusScore = max(focusScore, s);
    else otherScore = max(otherScore, s);`),c("if (sa > b1) {",`if (mmState[MM_ABS].z > 0.5) focusScore = max(focusScore, sa);
    else otherScore = max(otherScore, sa);
    if (sa > b1) {`),c("mmShown = smoothstep(mmRevealT - 0.05, mmRevealT + 0.01, b1 / 0.85 + 0.12);",`mmShown = smoothstep(mmRevealT - 0.05, mmRevealT + 0.01, b1 / 0.85 + 0.12);
  float focusMargin = focusScore - otherScore;
  float focusGradient = length(vec2(dFdx(focusMargin), dFdy(focusMargin))) + 1e-6;
  float focusPx = focusMargin / focusGradient;
  if (abs(mmFocusSide) > 0.5) {
    float sideCoord = vMmPos.x * mmFocusSide;
    float sideGradient = length(vec2(dFdx(sideCoord), dFdy(sideCoord))) + 1e-7;
    focusPx = min(focusPx, sideCoord / sideGradient);
  }
  float focusFeather = ${t?"3.0 * mmStrokeDensity":"0.65"};
  mmFocusCoverage = smoothstep(-focusFeather, focusFeather, focusPx);
  float focusWidth = 1.6 * mmStrokeDensity;
  mmFocusOutline = (1.0 - smoothstep(0.0, focusWidth, abs(focusPx))) * mmFocusCoverage;`);const u=/#include <normal_fragment_maps>\s*\{\s*float h = mmEdge \* mmIsMuscle;[\s\S]*?normal = normalize\(abs\(fDet\) \* normal - grad\);\s*\}/;if(!u.test(a.fragmentShader))throw new Error("functional_relief_source_mismatch");if(a.fragmentShader=a.fragmentShader.replace(u,"#include <normal_fragment_maps>"),c("float gap = b1 - s2; float g = length(vec2(dFdx(gap), dFdy(gap))) + 1e-6;",`float gap = b1 - s2;
       float signedGap = gap * (i1 < i2 ? 1.0 : -1.0);
       float pairKey = float(min(i1, i2) * MM_N + max(i1, i2));
       float pairChange = abs(dFdx(pairKey)) + abs(dFdy(pairKey));
       float signedGradient = length(vec2(dFdx(signedGap), dFdy(signedGap)));
       float originalGradient = length(vec2(dFdx(gap), dFdy(gap)));
       float g = mix(signedGradient, originalGradient, step(0.5, pairChange)) + 1e-6;`),c("float ax = abs(vMmPos.x) * mmScale; float ag = length(vec2(dFdx(ax), dFdy(ax))) + 1e-7;","float signedX = vMmPos.x * mmScale; float ax = abs(signedX); float ag = length(vec2(dFdx(signedX), dFdy(signedX))) + 1e-7;"),c("float wpx = max((sameFamily ? 0.008 : 0.022) / g, sameFamily ? 0.6 : 1.05);","float wpx = clamp((sameFamily ? 0.008 : 0.022) / g, (sameFamily ? 0.18 : 0.28) * mmStrokeDensity, (sameFamily ? 0.35 : 0.55) * mmStrokeDensity);"),c("float mw = max((mmF[i1].z > 0.5 ? mix(0.0015, 0.0024, smoothstep(0.95, 1.05, p.y)) : 0.0022) / ag, 0.7);","float mw = clamp((mmF[i1].z > 0.5 ? mix(0.0015, 0.0024, smoothstep(0.95, 1.05, p.y)) : 0.0022) / ag, 0.20 * mmStrokeDensity, 0.45 * mmStrokeDensity);"),c("float lw = max(0.0015 / yg, 0.6);","float lw = clamp(0.0015 / yg, 0.18 * mmStrokeDensity, 0.40 * mmStrokeDensity);"),c("float px = gap / g;","float px = gap / g; mmPanelCoverage = smoothstep(0.0, 0.9, px);"),c("float sh = mmShown * mmIsMuscle;","float sh = mmShown * mmIsMuscle * mmPanelCoverage;"),c("mmBase * mix(0.80, 1.04, mmEdge)","mmBase * mix(0.985, 1.015, mmEdge)"),c("mix(0.74, 1.0, mmEdge)","mix(0.96, 1.0, mmEdge)"),c("mix(0.78, 1.0, mmEdge)","mix(0.96, 1.0, mmEdge)"),c("mix(0.85, 1.0, mmEdge)","mix(0.97, 1.0, mmEdge)"),c("col = mix(col, mmGroove, mmGrooveV * mix(0.40, 0.82, mmIsMuscle));",""),c("diffuseColor.rgb = col;",`diffuseColor.rgb = mix(${t?"base":"col"}, mmFocusColour, mmFocusCoverage);`),c("* (1.0 - mmGrooveV) * mmShown;","* mmShown;"),c("lit *= 1.0 - 0.85 * mmDimV;","lit *= (1.0 - 0.85 * mmDimV) * mmPanelCoverage;"),c("totalEmissiveRadiance += mmPc * (lit * (0.10 + 0.08 * pulse + 0.40 * mmFocusV * pulse) + front * 0.6 * step(0.3, abs(mmSelV)));",t?"totalEmissiveRadiance += mmFocusColour * (0.04 * mmFocusCoverage);":"totalEmissiveRadiance += mmPc * (lit * (0.10 + 0.08 * pulse) + front * 0.6 * step(0.3, abs(mmSelV))) * (1.0 - mmFocusCoverage) + mmFocusColour * (0.04 * mmFocusCoverage);"),c(`float hA = max(fwidth(vMmPos.y) * 140.0, 0.02);
          float hatch = smoothstep(0.5 - hA, 0.5 + hA, abs(fract((vMmPos.x * 0.6 + vMmPos.y - vMmPos.z * 0.5) * 70.0) - 0.5) * 2.0);`,`float stripe = (vMmPos.x * 0.6 + vMmPos.y - vMmPos.z * 0.5) * 70.0;
          float footprint = fwidth(stripe);
          float hA = max(footprint, 0.02);
          float hatch = mix(smoothstep(0.5 - hA, 0.5 + hA, abs(fract(stripe) - 0.5) * 2.0), 0.5, smoothstep(0.3, 0.8, footprint));`),t&&(c("vec3 base = mix(mmSkin, mmBase * mix(0.985, 1.015, mmEdge), mmIsMuscle);","vec3 base = diffuseColor.rgb;"),c("float sh = mmShown * mmIsMuscle * mmPanelCoverage;","float sh = mmShown * mmIsMuscle;"),c("float hatch = mix(smoothstep(0.5 - hA, 0.5 + hA, abs(fract(stripe) - 0.5) * 2.0), 0.5, smoothstep(0.3, 0.8, footprint));","float hatch = 1.0;"),c("lit *= (1.0 - 0.85 * mmDimV) * mmPanelCoverage;","lit *= 1.0 - 0.85 * mmDimV;"),a.fragmentShader=a.fragmentShader.replace(/vec3 hot = mmMulti > 0\.5[\s\S]*?mix\(0\.96, 1\.0, mmEdge\);/,"vec3 hot = pc;"),c("mix(mmBase, pc, 0.52) * mix(0.97, 1.0, mmEdge)","mix(mmBase, pc, 0.52)"),c("totalEmissiveRadiance += vec3(0.50, 0.60, 0.80) * rim * 0.32;","")),n&&(a.fragmentShader=`#ifndef TONE_MAPPING
`+yt.tonemapping_pars_fragment+`
#endif
`+a.fragmentShader,c("#include <tonemapping_fragment>",`#include <tonemapping_fragment>
#ifndef TONE_MAPPING
 gl_FragColor.rgb = ACESFilmicToneMapping(gl_FragColor.rgb);
#endif`),c("#include <colorspace_fragment>","gl_FragColor = sRGBTransferOETF(gl_FragColor);")),!t){const d=n?"gl_FragColor = sRGBTransferOETF(gl_FragColor);":"#include <colorspace_fragment>";c(d,d+`
{
 vec3 ink = sRGBTransferOETF(vec4(mmGroove, 1.0)).rgb;
 float coverage = clamp(mmGrooveV * mmIsMuscle * 0.68, 0.0, 1.0);
 gl_FragColor.rgb = mix(gl_FragColor.rgb, min(gl_FragColor.rgb, ink), coverage);
}`)}if(!t){const d=n?"gl_FragColor = sRGBTransferOETF(gl_FragColor);":"#include <colorspace_fragment>";c(d,d+`
{
 vec3 ink = sRGBTransferOETF(vec4(mmFocusInk, 1.0)).rgb;
 gl_FragColor.rgb = mix(gl_FragColor.rgb, ink, mmFocusOutline * 0.26);
}`)}},i.customProgramCacheKey=()=>"flare-functional-surface-v9-"+Number(t)+"-"+Number(n),i.needsUpdate=!0}async function xM(i,e){const{scene:t}=await hf("./anatomy/mannequin-reference.meshopt.glb.gz"),n=new Yl;n.add(t),n.add(new Wh(15397631,3420989,2));const r=new us(16773860,3);r.position.set(-2,3,4),n.add(r);const s=new us(15199487,2);s.position.set(2,2,-3),n.add(s);const o=Zy();o.mmMulti.value=1,o.mmReveal.value=1,o.mmTime.value=.654,o.mmBase.value.set("#818b99"),o.mmSkin.value.copy(o.mmBase.value),o.mmGroove.value.set("#596273");const a={value:2},l=[],c=new Set;t.traverse(X=>{if(!X.isMesh)return;for(const le of[].concat(X.material))le.dispose();const ee=new Ss({color:16777215,roughness:.72,metalness:0});_M(ee,o,{thumbnail:!0,density:a}),X.material=ee,l.push(X),c.add(ee)}),t.updateMatrixWorld(!0);const u=[1,-1].map(X=>{const ee=new vn(26,.5,.02,20);return ee.position.set(0,.845,X*4),ee.lookAt(0,.845,0),ee.updateMatrixWorld(!0),ee}),d=document.createElement("aside");d.className="phase-map",d.setAttribute("aria-label","随动作阶段同步的肌群正面和背面定位图"),d.innerHTML='<header><i></i><span>同步发力</span></header><div class="phase-map-view"><span>正面</span><span>背面</span></div><div class="phase-map-legend"></div>',i.container.append(d);const h=d.querySelector(".phase-map-view"),p=d.querySelector(".phase-map-legend"),g=document.createElement("canvas");g.setAttribute("aria-hidden","true"),h.prepend(g);const b=g.getContext("2d"),m=new jh,f=new ut,M=new A;let x=null,_=!1,D=[],P=null,T=null,N=0,v=null;const y=new an().setFromObject(t),C={"hip-abductors":"臀中肌",abs:"腹直肌","rotator-cuff":"肩袖",forearms:"前臂",scapular:"肩胛肌群",adductors:"内收肌"};function q(X,ee,le,j){f.set((X-j.left)/j.width*2-1,-(ee-j.top)/j.height*2+1),m.setFromCamera(f,le);const oe=Rn(i.time);for(const xe of m.intersectObjects(l)){const me=ru(xe.object.worldToLocal(M.copy(xe.point)),1.69);if(!me)continue;const Te=Object.entries(Ma).filter(([He,Ze])=>ui[He]&&Ze.muscles.includes(me.id)).map(([He])=>He),ke=Te.find(He=>oe.items.some(Ze=>Ze.groupId===He&&(Ze.side==="both"||Ze.side===me.side)))??Te[0];if(ke)return{groupId:ke,side:me.side,panelId:me.id}}return null}function O(X){const ee=h.getBoundingClientRect(),le=ee.width/2,j=X.clientX-ee.left<le?0:1,oe=q(X.clientX,X.clientY,u[j],{left:ee.left+le*j,top:ee.top,width:le,height:ee.height});oe&&e(oe.groupId)}h.addEventListener("click",O);function $(X,ee=null){const le=[...X.items],j=[];ee&&!le.some(oe=>oe.groupId===ee)&&le.push({groupId:ee,side:"both",level:"primary",colour:ui[ee].colour});for(const oe of le){if(ee&&oe.groupId!==ee)continue;const xe=Sa(oe.groupId);if(xe)for(const me of xe.muscles)j.push({muscle:me,side:oe.side,colour:oe.colour,level:xe.deep&&oe.level==="primary"?"deep":oe.level,dim:ee?oe.groupId===ee?0:.85:oe.level==="primary"?0:.5})}tM(o,j),th(o,ee?Sa(ee)?.muscles??[]:[],le.find(oe=>oe.groupId===ee)?.side)}function se(X,ee){v=X,$(ee,X),T=null,ce()}function Z(){v=null,x=null,T=null,th(o,[])}function ce(){n.environment=i.scene.environment}function L(){if(_)return;const X=Rn(i.time);if(X.source!==x){x=X.source,$(X),D=["support","core","legs"].map(Ze=>X.items.find(Ce=>ui[Ce.groupId].section===Ze&&Ce.level==="primary")??X.items.find(Ce=>ui[Ce.groupId].section===Ze)).filter(Boolean),p.replaceChildren();for(const Ze of D){const Ce=document.createElement("button");Ce.type="button",Ce.dataset.groupId=Ze.groupId,Ce.setAttribute("aria-label","查看"+Ze.label);const st=document.createElement("i");st.style.background=Ze.colour,Ce.append(st,C[Ze.groupId]??Ze.label),Ce.addEventListener("click",()=>e(Ze.groupId)),p.append(Ce)}}const ee=h.getBoundingClientRect();if(!(ee.width>0&&ee.height>0))return;const le=i.renderer,j=i.quality==="low"?1:Math.min(3,Math.max(2,window.devicePixelRatio||1)),oe=Math.ceil(ee.width/2*j),xe=Math.ceil(ee.height*j);a.value=oe/(ee.width/2);const me=[X.source,oe,xe,i.quality,le.toneMappingExposure].join(":");if(me===T&&n.environment===i.scene.environment)return;n.environment=i.scene.environment,P?P.setSize(oe,xe):P=new hr(oe,xe,{samples:Math.min(4,le.capabilities.maxSamples),stencilBuffer:!1}),(g.width!==oe*2||g.height!==xe)&&(g.width=oe*2,g.height=xe);const Te={target:le.getRenderTarget(),viewport:le.getViewport(new mt),scissor:le.getScissor(new mt),scissorTest:le.getScissorTest(),color:le.getClearColor(new rt),alpha:le.getClearAlpha(),autoClear:le.autoClear},ke=new Uint8Array(oe*xe*4),He=new Uint8ClampedArray(ke.length);try{le.autoClear=!0,le.setClearColor(0,0);for(let Ze=0;Ze<2;Ze++){u[Ze].aspect=ee.width/2/ee.height,u[Ze].updateProjectionMatrix(),le.setRenderTarget(P),le.render(n,u[Ze]),le.readRenderTargetPixels(P,0,0,oe,xe,ke);for(let Ce=0;Ce<xe;Ce++)for(let st=0;st<oe;st++){const F=((xe-1-Ce)*oe+st)*4,Nt=(Ce*oe+st)*4,pt=ke[F+3],ct=pt?255/pt:0;He[Nt]=Math.min(255,ke[F]*ct),He[Nt+1]=Math.min(255,ke[F+1]*ct),He[Nt+2]=Math.min(255,ke[F+2]*ct),He[Nt+3]=pt}b.putImageData(new ImageData(He,oe,xe),Ze*oe,0)}T=me,N++}finally{le.setRenderTarget(Te.target),le.setViewport(Te.viewport),le.setScissor(Te.scissor),le.setScissorTest(Te.scissorTest),le.setClearColor(Te.color,Te.alpha),le.autoClear=Te.autoClear}}function k(X){_=X,d.hidden=X,i.dirty=!0}function K(){P?.dispose(),P=null,T=null;for(const X of l)X.geometry.dispose();for(const X of c)X.dispose()}return{render:L,setHidden:k,releaseGpu:K,scene:n,setDetail:se,restorePhase:Z,refreshEnvironment:ce,pickSurface:q,getFullBounds:()=>y.clone(),getState:()=>({phase:x,hidden:_,focus:v,views:["front","back"],legend:D.map(X=>({groupId:X.groupId,label:C[X.groupId]??X.label})),referencePose:"static CC0 mannequin",resolution:[g.width,g.height],renderCount:N,samples:P?.samples??0}),dispose(){K(),h.removeEventListener("click",O),d.remove()}}}const vM=document.querySelector("#stage"),wa=document.querySelector("#status"),yM=document.querySelector("#status-text"),vf=document.querySelector("#retry"),nh=document.querySelector("#hotspots"),su=document.querySelector("#detail-note");let Se,Uc,vi,On,bi,pr=!1,Zn=null,kn=!1,fa=[],ou=null,ps=[],ta=null,ih=0,Qs=new Map;function Ns(i){const e={source:"flare-scene",...i};window.FlareHost?.postMessage?window.FlareHost.postMessage(JSON.stringify(e)):window.parent!==window&&window.parent.postMessage(e,window.location.origin)}function yf(){return{type:"state",time:Se?.time??0,period:Se?.period??9,playing:Se?.playing??!1,speed:Se?.speed??.5,phase:Rn(Se?.time??0).source,selected:Zn,detail:kn,loop:Se?.loopRange?{start:Se.loopRange[0],end:Se.loopRange[1]}:null,detailModel:kn?On?.getModel()??"motion":"motion",quality:Se?.quality??"medium",ready:pr,errorCode:ou}}function Ir(i=!1){if(!pr)return;const e=performance.now();!i&&e-ih<100||(ih=e,Ns(yf()))}function rh(i,e=!1){ou=i,wa.hidden=!1,wa.dataset.error="true",yM.textContent=e?"三维画面暂时中断，正在等待图形恢复。也可重新载入。":"三维动作暂时无法载入，请重新载入。",vf.hidden=!1,Ns({type:"error",code:i,errorCode:i}),Ir(!0)}function au(){if(!pr||Se.playing||kn){fa=[],nh.replaceChildren(),Qs.clear();return}fa=Vy(Se,Rn(Se.time).items);const i=new Set;for(const e of fa){i.add(e.groupId);let t=Qs.get(e.groupId);t||(t=document.createElement("button"),t.className="hotspot",t.type="button",t.dataset.groupId=e.groupId,t.setAttribute("aria-label","查看"+e.label),t.title=e.label,t.addEventListener("click",()=>Mf(e.groupId)),nh.append(t),Qs.set(e.groupId,t)),t.style.left=e.x+"px",t.style.top=e.y+"px",t.style.setProperty("--accent",e.colour),t.dataset.selected=String(e.groupId===Zn)}for(const[e,t]of Qs)i.has(e)||(t.remove(),Qs.delete(e))}function pa(){On?.close(),kn=!1,su.hidden=!0,bi?.setHidden(!1);for(const i of Se?.stageProps??[])i.visible=i===Se.shadowCatcher?Se.renderer.shadowMap.enabled:!0}function cu(){su.textContent=On?.getModel()==="muscles"?"拖动旋转":"固定视角"}function Ea(i,e=kn){if(Se.playing=!1,!i)pa(),Zn=null,vi.restore();else{Zn=i,kn=!!e;const t=Rn(Se.time);if(vi.show(Zn,t.items,kn),kn){On.open(Zn,t),su.hidden=!1,cu(),bi?.setHidden(!0);for(const n of Se.stageProps)n.visible=!1}}Se.dirty=!0,au(),Ir(!0)}function Mf(i){!pr||Se.playing||(Ea(i),Ns({type:"select",groupId:i,time:Se.time}))}function MM(i){pr&&(Ea(i),Ns({type:"select",groupId:i,time:Se.time}))}function Aa(i){let e=i;if(typeof e=="string")try{e=JSON.parse(e)}catch{Ns({type:"error",code:"invalid_command",errorCode:"invalid_command"});return}if(!(!e||typeof e!="object"||typeof e.type!="string")){if(e.type==="theme"){["dark","light"].includes(e.value)&&(document.documentElement.dataset.theme=e.value,Se&&(Se.dirty=!0));return}if(!pr){ps.push(e),ps.length>32&&ps.shift();return}switch(e.type){case"play":pa(),Zn=null,vi.restore(),Se.time>=Se.period&&Se.setTime(0),Se.playing=Se.visible&&!document.hidden&&!Se.contextLost,Se.start();break;case"pause":Se.playing=!1;break;case"seek":{const t=Number(e.time);if(!Number.isFinite(t))return;pa(),Zn=null,vi.restore(),Se.playing=!1,Se.loopRange=null,Se.setTime(t);break}case"speed":[.25,.5,1].includes(Number(e.value))&&(Se.speed=Number(e.value));break;case"loop":{if(e.start==null||e.end==null)Se.loopRange=null;else{const t=Number(e.start),n=Number(e.end);if(!Number.isFinite(t)||!Number.isFinite(n)||t<0||n>Se.period||n-t<=.001)return;Se.loopRange=[t,n],(Se.time<t||Se.time>=n)&&Se.setTime(t)}break}case"reset":kn&&Zn?On.reset(Rn(Se.time)):Se.resetView();break;case"camera":{if(!no[e.view])return;kn&&Zn?On.reset(Rn(Se.time),no[e.view]):Se.resetView(no[e.view]);break}case"select":if(e.groupId==null||ui[e.groupId])Ea(e.groupId??null);else return;break;case"detail":if(e.groupId==null)pa(),Zn?vi.show(Zn,Rn(Se.time).items,!1):vi.restore();else if(ui[e.groupId])Ea(e.groupId,!0);else return;break;case"detail_model":if(!kn||!["motion","muscles"].includes(e.value))return;On.setModel(e.value,Rn(Se.time)),cu();break;case"quality":Se.setQuality(e.value);break;case"visibility":Se.setVisible(e.visible);break;default:return}Se.dirty=!0,au(),Ir(!0)}}window.flareBridge=Object.freeze({command:Aa});function Sf(i){i.source!==window.parent||i.origin!==window.location.origin||i.data?.source!=="flare-host"||Aa(i.data.command)}window.addEventListener("message",Sf);vf.addEventListener("click",()=>window.location.reload());async function SM(){try{Se=new Ly(vM,{onTime:()=>Ir(),onRender:()=>{au(),kn?On?.renderMini():bi?.render()},onResize:()=>{kn&&On?.refit(Rn(Se.time))},onContext:r=>{r?(bi?.refreshEnvironment(),ou=null,wa.hidden=!0,Ir(!0)):(vi?.releaseGpu(),bi?.releaseGpu(),rh("graphics_context_lost",!0))}}),await Promise.all([Se.load(),xM(Se,MM).then(r=>{bi=r})]),Se.resetView();const i=hM(Se.motion,Se.coach);Uc=fM(Se,i),vi=gM(i),On=bM(Se,bi,()=>{cu(),Se.dirty=!0,Ir(!0)},()=>vi.focusDirection()),On.mini.addEventListener("click",()=>On.toggle(Rn(Se.time)));const e=Se.renderer.domElement;e.addEventListener("pointerdown",r=>{ta={x:r.clientX,y:r.clientY,time:performance.now()}}),e.addEventListener("pointercancel",()=>{ta=null}),e.addEventListener("pointerup",r=>{const s=ta;if(ta=null,!s||Se.playing||performance.now()-s.time>550||Math.hypot(r.clientX-s.x,r.clientY-s.y)>7)return;const o=kn&&On.getModel()==="muscles"?bi.pickSurface(r.clientX,r.clientY,Se.camera,e.getBoundingClientRect()):Uc.pick(r.clientX,r.clientY,Rn(Se.time).items);o&&Mf(o.groupId)}),pr=!0,wa.hidden=!0,Se.dirty=!0;const t=i.reduce((r,s)=>({meshes:r.meshes+1,vertices:r.vertices+s.geometry.attributes.position.count,triangles:r.triangles+(s.geometry.index?.count??s.geometry.attributes.position.count)/3}),{meshes:0,vertices:0,triangles:0});window.__flareScene=Object.freeze({getMetrics:()=>Se.getMetrics(),getState:yf,getHotspots:()=>fa.map(r=>({...r})),hitTest:(r,s)=>Uc.pick(r,s,Rn(Se.time).items),getPhaseMap:()=>bi?.getState(),getActorSurface:()=>i.filter(r=>r.userData.studySkin||r.userData.studyHead||xf(r)||uM(r)).map(r=>({name:r.name,part:r.parent.name,visible:r.visible,studySkin:!!r.userData.studySkin,studyHead:!!r.userData.studyHead})),getRenderState:()=>({visible:Se.visible,running:Se.running,dirty:Se.dirty,contextLost:Se.contextLost,frame:Se.renderer.info.render.frame,calls:Se.renderer.info.render.calls,triangles:Se.renderer.info.render.triangles,pixelRatio:Se.renderer.getPixelRatio(),framingMode:Se.framingMode,bufferSize:[Se.renderer.domElement.width,Se.renderer.domElement.height]}),getCamera:()=>({position:Se.camera.position.toArray(),target:Se.controls.target.toArray(),aspect:Se.camera.aspect}),setTime:r=>Aa({type:"seek",time:r}),phaseAt:Rn,phaseTicks:Jd,pacingRate:r=>Se.pacingRate(r),geometryStats:{...t}}),Ns({type:"ready",period:Se.period,time:Se.time,phase:Rn(Se.time).source,phases:Jd});const n=ps;ps=[];for(const r of n)Aa(r);Ir(!0)}catch(i){Se?.stop(),rh(i?.message==="rig_load_failed"?"rig_load_failed":"scene_load_failed")}}function wM(){pr=!1,ps=[],window.removeEventListener("message",Sf),On?.dispose(),vi?.dispose(),bi?.dispose(),Se?.dispose()}window.addEventListener("pagehide",i=>{i.persisted?Se?.setVisible(!1):wM()});window.addEventListener("pageshow",i=>{i.persisted&&Se?.setVisible(!0)});SM();
