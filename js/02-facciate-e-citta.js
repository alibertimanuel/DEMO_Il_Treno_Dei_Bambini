"use strict";
let WINQ=[];let NOWIN=[];   // [x,y,z,r]: punti del muro dove non va nessuna finestra (buchi di granata, intonaco caduto, manifesti, edicole)
function noWin(x,y,z){for(const [a,b,c,r] of NOWIN){if(Math.abs(y-b)<r+.8&&Math.hypot(x-a,z-c)<r+.55)return true;}return false;}
function texPlaster(base,poor){return T('pl'+base+(poor?'p':''),()=>hd(256,304,(g,gb,w,h,rnd)=>{g.fillStyle=base;g.fillRect(0,0,w,h);blot(g,w,h,rnd,26,rgbOf(shade(base,-.25)),12,60,.22);blot(g,w,h,rnd,16,rgbOf(shade(base,.3)),10,40,.2);
const dg=g.createLinearGradient(0,h*.75,0,h);dg.addColorStop(0,'rgba(60,40,30,0)');dg.addColorStop(1,'rgba(60,40,30,.2)');g.fillStyle=dg;g.fillRect(0,0,w,h);blot(gb,w,h,rnd,90,'0,0,0',3,14,.25);blot(gb,w,h,rnd,40,'255,255,255',3,10,.2);
if(poor){// colature di pioggia, umidità che sale dal basso col salnitro, macchie di muffa, intonaco consumato
for(let i=0;i<9;i++){const x=rnd()*w,ww=6+rnd()*22,gr=g.createLinearGradient(0,0,0,h);gr.addColorStop(0,'rgba(40,32,26,.38)');gr.addColorStop(.5+rnd()*.4,'rgba(40,32,26,.12)');gr.addColorStop(1,'rgba(40,32,26,0)');g.fillStyle=gr;g.fillRect(x,0,ww,h*(.4+rnd()*.6));}
const rd=g.createLinearGradient(0,h*.55,0,h);rd.addColorStop(0,'rgba(50,44,36,0)');rd.addColorStop(.6,'rgba(50,44,36,.32)');rd.addColorStop(1,'rgba(40,34,28,.5)');g.fillStyle=rd;g.fillRect(0,0,w,h);
blot(g,w,h,rnd,14,'235,230,215',6,22,.25);blot(g,w,h,rnd,18,'55,60,40',8,30,.18);blot(g,w,h,rnd,30,'60,48,38',4,18,.3);blot(gb,w,h,rnd,60,'0,0,0',4,20,.35);}
for(let i=0;i<0;i++){let x=rnd()*w,y=rnd()*h;   /* niente crepe dipinte: le crepe sono in 3D */g.strokeStyle='rgba(60,45,35,.35)';gb.strokeStyle='#202020';g.lineWidth=gb.lineWidth=1;g.beginPath();gb.beginPath();g.moveTo(x,y);gb.moveTo(x,y);for(let k=0;k<10;k++){x+=rnd()*10-5;y+=rnd()*9;g.lineTo(x,y);gb.lineTo(x,y);}g.stroke();gb.stroke();}
grainPx(g,w,h,10,rnd);},.05));}
const texLouver=()=>T('louver',()=>hd(64,128,(g,gb,w,h)=>{g.fillStyle='#ffffff';g.fillRect(0,0,w,h);gb.fillStyle='#808080';gb.fillRect(0,0,w,h);for(let y=0;y<h;y+=8){g.fillStyle='rgba(0,0,0,.28)';g.fillRect(4,y+5,w-8,3);g.fillStyle='rgba(255,255,255,.35)';g.fillRect(4,y,w-8,1.5);gb.fillStyle='#202020';gb.fillRect(4,y+5,w-8,3);gb.fillStyle='#f0f0f0';gb.fillRect(4,y,w-8,4);}
g.fillStyle='rgba(0,0,0,.3)';g.fillRect(0,0,4,h);g.fillRect(w-4,0,4,h);g.fillRect(0,0,w,3);g.fillRect(0,h-3,w,3);},.06,false));
function boxesGeo(list){const P=[],N=[],U=[],I=[];let off=0;for(const [x,y,z,sx,sy,sz] of list){const g=new THREE.BoxGeometry(sx,sy,sz);g.translate(x,y,z);const p=g.attributes.position,n=g.attributes.normal,u=g.attributes.uv;
for(let i=0;i<p.count;i++){P.push(p.getX(i),p.getY(i),p.getZ(i));N.push(n.getX(i),n.getY(i),n.getZ(i));U.push(u.getX(i),u.getY(i));}for(let i=0;i<g.index.count;i++)I.push(g.index.getX(i)+off);off+=p.count;g.dispose();}
const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(P,3));g.setAttribute('normal',new THREE.Float32BufferAttribute(N,3));g.setAttribute('uv',new THREE.Float32BufferAttribute(U,2));g.setIndex(I);g.computeBoundingSphere();return g;}
function winFlush(){const q=WINQ;WINQ=[];if(!q.length)return;
const grid=new Map(),ck=(i,j)=>i*100003+j;for(const b of obstacles){if((b.x1-b.x0)*(b.z1-b.z0)>4000)continue;for(let i=Math.floor(b.x0/4);i<=Math.floor(b.x1/4);i++)for(let j=Math.floor(b.z0/4);j<=Math.floor(b.z1/4);j++){const k=ck(i,j);(grid.get(k)||grid.set(k,[]).get(k)).push(b);}}
const blocked=(x,z)=>{const l=grid.get(ck(Math.floor(x/4),Math.floor(z/4)));if(l)for(const b of l)if(x>b.x0&&x<b.x1&&z>b.z0&&z<b.z1)return true;return false;};
const K={glass:[],lit:[],frame:[],open:[],closed:[],door:[],dframe:[],balc:[],gwin:[],hang:[]};
for(const b of q){const rn=mulberry(Math.round(b.cx*73+b.cz*31+b.h*7)),shc=rpick(rn,['#3e6a4a','#4a6a8a','#6a4a30','#5a7a5a','#7a5a3a','#3a5a6a','#8a6a40']),frc=shade(b.base,.28);
const faces=[[b.cx,b.cz+b.d/2,0,0,1,b.w],[b.cx,b.cz-b.d/2,Math.PI,0,-1,b.w],[b.cx+b.w/2,b.cz,Math.PI/2,1,0,b.d],[b.cx-b.w/2,b.cz,-Math.PI/2,-1,0,b.d]];
for(const [fx,fz,ry,nx,nz,len] of faces){if(len<1.9)continue;if(!b.first&&blocked(fx+nx*.9,fz+nz*.9))continue;
const nc=Math.max(1,Math.floor(len/2.3)),sp=len/nc,tx=nz!==0?1:0,tz=nx!==0?1:0;
const put=(list,u,y,col)=>{if(NOWIN.length&&noWin(fx+tx*u,list===K.door||list===K.dframe?y+1.2:y,fz+tz*u))return;list.push([fx+tx*u,y,fz+tz*u,ry,col]);};
const doorAt=Math.floor(rn()*nc);
for(let i=0;i<nc;i++){const u=-len/2+(i+.5)*sp;
const gy=heightAt(fx+tx*u+nx*.7,fz+tz*u+nz*.7);if(b.noGround){}else if(i===doorAt&&rn()<.75){put(K.door,u,gy,'#3a2618');put(K.dframe,u,gy,frc);}else if(rn()<.5){put(K.gwin,u,gy+1.75,'#1c2228');put(K.frame,u,gy+1.75,frc);}
for(let y=b.y0+(b.first||4.55),f=0;y+.95<b.y0+b.h-.25;y+=2.9,f++){
const pr=b.poor?rn():1;
if(b.night&&rn()<.45)put(K.lit,u,y,'#ffffff');else put(K.glass,u,y,pr<.24?'#060606':b.poor?'#1c2024':'#26303a');put(K.frame,u,y,b.poor?shade(frc,-.12):frc);
if(pr<.12)put(K.hang,u,y,shade(shc,-.15));else if(pr<.5){}else{const r=rn();if(r<.5)put(K.open,u,y,b.poor?shade(shc,-.12):shc);else if(r<.75)put(K.closed,u,y,b.poor?shade(shc,-.12):shc);}
if(f<2&&rn()<.16)put(K.balc,u,y,'#2a2628');}}}}
const G={glass:boxesGeo([[0,0,.02,.96,1.56,.04]]),lit:boxesGeo([[0,0,.02,.96,1.56,.04]]),gwin:boxesGeo([[0,0,.02,.8,.9,.04],[-.2,0,.06,.03,.9,.03],[0,0,.06,.03,.9,.03],[.2,0,.06,.03,.9,.03]]),
frame:boxesGeo([[-.55,0,.07,.12,1.72,.14],[.55,0,.07,.12,1.72,.14],[0,.9,.09,1.36,.16,.18],[0,-.86,.12,1.4,.09,.26],[0,0,.05,.05,1.56,.04],[0,.3,.05,.96,.05,.04]]),
open:boxesGeo([[-.86,0,.05,.5,1.58,.05],[.86,0,.05,.5,1.58,.05]]),closed:boxesGeo([[-.25,0,.08,.49,1.56,.05],[.25,0,.08,.49,1.56,.05]]),
door:boxesGeo([[0,1.15,.02,1.2,2.3,.04]]),dframe:boxesGeo([[-.7,1.2,.08,.2,2.4,.16],[.7,1.2,.08,.2,2.4,.16],[0,2.5,.1,1.7,.24,.2],[0,0,.12,1.5,.08,.24]]),
balc:boxesGeo([[0,-.86,.4,1.7,.12,.8],[0,-.02,.79,1.7,.05,.05],[-.84,-.02,.4,.05,.05,.8],[.84,-.02,.4,.05,.05,.8],...[-.7,-.42,-.14,.14,.42,.7].map(x=>[x,-.42,.79,.03,.78,.03]),[-.84,-.42,.4,.03,.78,.03],[.84,-.42,.4,.03,.78,.03]])};
const M={glass:new THREE.MeshStandardMaterial({color:'#ffffff',roughness:.12,metalness:.4,envMapIntensity:1.2}),lit:new THREE.MeshStandardMaterial({color:'#ffd8a0',emissive:new THREE.Color('#ffb860'),emissiveIntensity:1.1,roughness:.4}),
gwin:new THREE.MeshStandardMaterial({color:'#ffffff',roughness:.3,metalness:.3}),frame:new THREE.MeshStandardMaterial({color:'#ffffff',roughness:.85,envMapIntensity:.3}),
open:new THREE.MeshStandardMaterial({color:'#ffffff',map:texLouver(),bumpMap:bumpFor(texLouver()),bumpScale:.03,roughness:.8,envMapIntensity:.3}),door:new THREE.MeshStandardMaterial({color:'#ffffff',map:texWood(),roughness:.8,envMapIntensity:.3}),
balc:new THREE.MeshStandardMaterial({color:'#ffffff',roughness:.5,metalness:.6,envMapIntensity:.6})};
M.closed=M.open;M.dframe=M.frame;M.hang=M.open;{const hg=new THREE.BoxGeometry(.5,1.58,.05);hg.rotateZ(.38);hg.translate(.98,-.22,.16);G.hang=hg;}
const m4=new THREE.Matrix4(),qq=new THREE.Quaternion(),v=new THREE.Vector3(),one=new THREE.Vector3(1,1,1),Y=new THREE.Vector3(0,1,0),c=new THREE.Color();
for(const k in K){const L=K[k];if(!L.length)continue;const im=new THREE.InstancedMesh(G[k],M[k],L.length);
L.forEach((e,i)=>{qq.setFromAxisAngle(Y,e[3]);m4.compose(v.set(e[0],e[1],e[2]),qq,one);im.setMatrixAt(i,m4);im.setColorAt(i,c.set(e[4]));});
im.castShadow=k==='frame'||k==='balc'||k==='open'||k==='dframe';im.receiveShadow=true;im.userData.noMerge=true;world.add(im);}}
function roofCone(x,y,z,w,h){const me=new THREE.Mesh(new THREE.ConeGeometry(w*.75,h,4),mat(texRoof()));me.rotation.y=Math.PI/4;me.position.set(x,y+h/2,z);world.add(me);return me;}
function tree(x,z,h,col){box(x,0,z,.25,h*.4,.25,mat('#5a4636'));const c=new THREE.Mesh(new THREE.ConeGeometry(.7,h,5),mat(col||pick(['#6a6a58','#5e6450','#787060'])));c.position.set(x,h*.3+h/2,z);world.add(c);obstacles.push({x0:x-.25,x1:x+.25,z0:z-.25,z1:z+.25});return c;}
let ramps=[];
function heightAt(x,z){let h=0;for(const r of ramps){if(x<r.x0||x>r.x1||z<r.z0||z>r.z1)continue;let v=r.h0;if(r.ax==='x')v=r.h0+(r.h1-r.h0)*(x-r.x0)/(r.x1-r.x0);else if(r.ax==='z')v=r.h0+(r.h1-r.h0)*(z-r.z0)/(r.z1-r.z0);if(v>h)h=v;}return h;}
const MC={};function mc(c,o){const k=c+JSON.stringify(o||{});return MC[k]||(MC[k]=mat(c,o));}
function mergeNew(from){const by=new Map(),kids=world.children.slice(from);
for(const o of kids)if(o.isMesh&&!o.isInstancedMesh&&!o.children.length&&o.material&&!Array.isArray(o.material)&&!o.material.transparent&&!o.material.map&&!o.material.bumpMap&&!o.material.vertexColors&&!o.userData.noMerge)(by.get(o.material)||by.set(o.material,[]).get(o.material)).push(o);
for(const [mat,list] of by){if(list.length<2)continue;const P=[],N=[],I=[];let off=0;const nm=new THREE.Matrix3(),v=new THREE.Vector3();
for(const m of list){m.updateMatrix();const g=m.geometry,pa=g.attributes.position,na=g.attributes.normal;nm.getNormalMatrix(m.matrix);
for(let i=0;i<pa.count;i++){v.fromBufferAttribute(pa,i).applyMatrix4(m.matrix);P.push(v.x,v.y,v.z);v.fromBufferAttribute(na,i).applyMatrix3(nm).normalize();N.push(v.x,v.y,v.z);}
if(g.index)for(let i=0;i<g.index.count;i++)I.push(g.index.getX(i)+off);else for(let i=0;i<pa.count;i++)I.push(i+off);off+=pa.count;world.remove(m);}
const mg=new THREE.BufferGeometry();mg.setAttribute('position',new THREE.Float32BufferAttribute(P,3));mg.setAttribute('normal',new THREE.Float32BufferAttribute(N,3));
mg.setIndex(off>65535?new THREE.Uint32BufferAttribute(I,1):new THREE.Uint16BufferAttribute(I,1));mg.computeBoundingSphere();const mm=new THREE.Mesh(mg,mat);mm.userData.noLift=true;mm.userData.merged=true;world.add(mm);}}
function buildingDetail(cx,cz,w,d,h,base,y0,bo){const from=world.children.length;buildingDetail0(cx,cz,w,d,h,base,y0,bo);mergeNew(from);}
let CITYSTYLE='napoli';
function cittaLontana(o){const rn=mulberry(o.seed||911),[x0,x1,z0,z1]=o.area,H=o.H||(()=>0),pal=o.pal;
if(o.ground){const W=x1-x0,D=z1-z0,g=new THREE.PlaneGeometry(W,D,Math.round(W/5),Math.round(D/5));g.rotateX(-Math.PI/2);const p=g.attributes.position,col=new Float32Array(p.count*3),c=new THREE.Color(),lo=new THREE.Color(o.ground),hi=new THREE.Color(o.ground2||o.ground);
for(let i=0;i<p.count;i++){const x=p.getX(i)+(x0+x1)/2,z=p.getZ(i)+(z0+z1)/2,h=H(x,z);p.setY(i,h-.3);c.copy(lo).lerp(hi,Math.min(1,h/30));col.set([c.r,c.g,c.b],i*3);}
g.setAttribute('color',new THREE.BufferAttribute(col,3));g.computeVertexNormals();const m=new THREE.Mesh(g,new THREE.MeshStandardMaterial({vertexColors:true,roughness:1,envMapIntensity:.2}));m.position.set((x0+x1)/2,0,(z0+z1)/2);m.receiveShadow=true;world.add(m);}
const houses=o.list?o.list.slice():[];for(let i=0;i<(o.n||0);i++){const x=x0+rn()*(x1-x0),z=z0+rn()*(z1-z0);if(o.avoid&&o.avoid(x,z))continue;const w=5+rn()*6,d=5+rn()*5,h=(o.hmin||6)+rn()*((o.hmax||16)-(o.hmin||6));houses.push([x,z,w,d,h]);}
if(o.ruins)for(const hs of houses)if(rn()<o.ruins){hs[4]*=.3+rn()*.25;hs[5]=1;}
if(houses.length){const g=new THREE.BoxGeometry(1,1,1);g.translate(0,.5,0);const uv=g.attributes.uv;for(let i=0;i<uv.count;i++)uv.setXY(i,uv.getX(i)*3,uv.getY(i)*4);
const fm=new THREE.MeshStandardMaterial({map:texFacade('#ece6da',false),roughness:.95,envMapIntensity:.2}),im=new THREE.InstancedMesh(g,fm,houses.length),m4=new THREE.Matrix4(),q=new THREE.Quaternion(),v=new THREE.Vector3(),s=new THREE.Vector3(),c=new THREE.Color(),Y=new THREE.Vector3(0,1,0);
houses.forEach(([x,z,w,d,h,ru],i)=>{const y=H(x,z)-1.2;q.setFromAxisAngle(Y,(rn()-.5)*.3);m4.compose(v.set(x,y,z),q,s.set(w,h+1.2,d));im.setMatrixAt(i,m4);im.setColorAt(i,c.set(ru?rpick(rn,['#6e655a','#5e564c','#7a6e60']):rpick(rn,pal)));});im.receiveShadow=true;im.userData.noMerge=true;im.userData.camBox=true;world.add(im);
if(o.gable){// i tetti a falde: un prisma per casa, coi coppi o con la neve
const sh=new THREE.Shape();sh.moveTo(-.55,0);sh.lineTo(.55,0);sh.lineTo(0,.42);sh.closePath();const rg=new THREE.ExtrudeGeometry(sh,{depth:1.08,bevelEnabled:false});rg.translate(0,0,-.54);
const rm=new THREE.MeshStandardMaterial({color:'#ffffff',roughness:.9,envMapIntensity:.3}),ri=new THREE.InstancedMesh(rg,rm,houses.length);
houses.forEach(([x,z,w,d,h,ru],i)=>{const y=H(x,z)+h;ri.getMatrixAt(i,m4);im.getMatrixAt(i,m4);m4.decompose(v,q,s);m4.compose(v.set(x,y,z),q,ru?s.set(.001,.001,.001):s.set(w,Math.min(w,d)*1.1,d));ri.setMatrixAt(i,m4);ri.setColorAt(i,c.set(o.snow?(rn()<.8?'#eef2f6':'#c8ccd2'):rpick(rn,['#a4503a','#b05a40','#9a4834'])));});ri.userData.noMerge=true;world.add(ri);}
else{// tetti a terrazza: il parapetto chiaro tutto intorno (un'altra scatola appena più larga, bassa)
const pi=new THREE.InstancedMesh(new THREE.BoxGeometry(1,1,1).translate(0,.5,0),mc('#d8ccb6'),houses.length);
houses.forEach(([x,z,w,d,h],i)=>{im.getMatrixAt(i,m4);m4.decompose(v,q,s);m4.compose(v.set(x,H(x,z)+h-.1,z),q,s.set(w+.3,.5,d+.3));pi.setMatrixAt(i,m4);});pi.userData.noMerge=true;world.add(pi);}}
if(o.pines){const tg=new THREE.ConeGeometry(1,1,7);tg.translate(0,.5,0);const im=new THREE.InstancedMesh(tg,new THREE.MeshStandardMaterial({color:o.pineCol||'#3e5a34',roughness:1,flatShading:true,envMapIntensity:.2}),o.pines),m4=new THREE.Matrix4(),q=new THREE.Quaternion(),v=new THREE.Vector3(),s=new THREE.Vector3();
let k=0;for(let t=0;t<o.pines*3&&k<o.pines;t++){const x=x0+rn()*(x1-x0),z=z0+rn()*(z1-z0);if(o.avoid&&o.avoid(x,z))continue;const r=1.6+rn()*1.6;m4.compose(v.set(x,H(x,z)+1.2,z),q,s.set(r,r*(o.pineK||1.6),r));im.setMatrixAt(k++,m4);}im.count=k;im.userData.noMerge=true;world.add(im);}}
function hipRoof(cx,cz,w,d,y,rh,o){o=o===undefined?.35:o;const W=w/2+o,D=d/2+o,alongX=w>=d,r=alongX?Math.max(0,W-D):Math.max(0,D-W),P=[],U=[];
const A=[-W,0,-D],B=[W,0,-D],Cc=[W,0,D],Dd=[-W,0,D],R1=alongX?[-r,rh,0]:[0,rh,-r],R2=alongX?[r,rh,0]:[0,rh,r];
const tri=(a,b,c,ax)=>{for(const p of [a,b,c]){P.push(p[0],p[1],p[2]);const sl=Math.hypot(p[1],ax==='z'?p[2]:p[0]);U.push((ax==='z'?p[0]:p[2])/1.2,(ax==='z'?(Math.abs(p[2])-0)*1.0:Math.abs(p[0]))/1.2+p[1]*.9);}};
if(alongX){tri(Dd,Cc,R2,'z');tri(Dd,R2,R1,'z');tri(B,A,R1,'z');tri(B,R1,R2,'z');tri(A,Dd,R1,'x');tri(Cc,B,R2,'x');}
else{tri(A,Dd,R1,'x');tri(Dd,R2,R1,'x');tri(Cc,B,R2,'x');tri(B,R1,R2,'x');tri(B,A,R1,'z');tri(Dd,Cc,R2,'z');}
const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(P,3));g.setAttribute('uv',new THREE.Float32BufferAttribute(U,2));g.computeVertexNormals();
const m=new THREE.Mesh(g,kmatRoof());m.position.set(cx,y,cz);m.castShadow=true;world.add(m);occluders.push(m);return m;}
let _roofM=null;function kmatRoof(){if(!_roofM){_roofM=mat(texRoof());_roofM.side=THREE.DoubleSide;}return _roofM;}
const texInterni=()=>T('interni',()=>{const c=document.createElement('canvas');c.width=256;c.height=512;const g=c.getContext('2d'),rn=mulberry(77);
const papers=[['#c8b48a','#a8946a'],['#9aa88a','#7a8a6a'],['#c89a8a','#a87a6a'],['#a8b0c0','#8890a0'],['#d0c0a0','#b0a080'],['#b8a0b0','#988090']];
for(let f=0;f<4;f++){const y0=f*128,[a,b]=papers[f%papers.length];g.fillStyle=a;g.fillRect(0,y0,256,128);
if(f%2){for(let x=0;x<256;x+=16){g.fillStyle=b;g.fillRect(x,y0,6,128);}}else{for(let i=0;i<60;i++){g.fillStyle=b;g.beginPath();g.arc(rn()*256,y0+rn()*128,3+rn()*3,0,TAU);g.fill();}}
g.fillStyle='rgba(255,255,255,.18)';g.fillRect(30+rn()*120,y0+30,60+rn()*50,70);g.fillStyle='rgba(255,255,255,.14)';g.fillRect(150+rn()*60,y0+50,30,30);
g.fillStyle='rgba(40,30,25,.55)';g.fillRect(rn()*180,y0+28,40,100);g.fillStyle='#e8e0d0';g.fillRect(0,y0+122,256,6);g.fillStyle='rgba(30,22,18,.6)';g.fillRect(0,y0,256,8);
const gr=g.createLinearGradient(0,y0+128,0,y0);gr.addColorStop(0,'rgba(20,16,14,.35)');gr.addColorStop(1,'rgba(20,16,14,0)');g.fillStyle=gr;g.fillRect(0,y0,256,128);}
for(let i=0;i<12;i++){g.fillStyle='rgba(30,24,20,'+(.2+rn()*.4)+')';g.beginPath();g.ellipse(rn()*256,rn()*512,10+rn()*40,6+rn()*30,rn()*3,0,TAU);g.fill();}
const t=new THREE.CanvasTexture(c);t.wrapS=t.wrapT=THREE.RepeatWrapping;t.anisotropy=ANISO;return t;});
function collapsedBuilding(cx,cz,w,d,h,base,night,bo,y0,rc){const from=world.children.length,alongX=w>=d,L=alongX?w:d,c=L*(.32+rc()*.16),s=rc()<.5?-1:1,hl=Math.max(3.2,h*(.28+rc()*.22));
const P=(off)=>alongX?[cx+off,cz]:[cx,cz+off];const [tx,tz]=P(-s*c/2),[lx,lz]=P(s*(L-c)/2);
const tall=building(tx,tz,alongX?L-c:w,alongX?d:L-c,h,base,night,Object.assign({},bo,{part:true}));
building(lx,lz,alongX?c:w,alongX?d:c,hl,base,night,Object.assign({},bo,{part:true,roofless:true}));
const cut=(alongX?cx:cz)+s*(L/2-c),other=alongX?d:w,oc=alongX?cz:cx,pm=(()=>{const t=texPlaster(base,true).clone();t.needsUpdate=true;return mat(t);})(),inner=mc('#6a5e52',{rough:1});
const strip=(a,b,fixedOther,isEnd)=>{const n=Math.max(1,Math.round(Math.abs(b-a)/1.1));for(let i=0;i<n;i++){const t0=a+(b-a)*i/n,t1=a+(b-a)*(i+1)/n,mid=(t0+t1)/2,k=isEnd?.25:1-Math.abs(mid-cut)/c;
const top=hl+(h-hl)*Math.max(0,k*(.35+rc()*.55)-(rc()<.25?.3:0));if(top<=hl+.15)continue;const hh=top-hl,g=new THREE.BoxGeometry(isEnd?.36:Math.abs(t1-t0)+.02,hh,isEnd?Math.abs(t1-t0)+.02:.36),uv=g.attributes.uv;for(let j=0;j<uv.count;j++)uv.setXY(j,uv.getX(j)*Math.abs(t1-t0)/2.2,uv.getY(j)*hh/2.6);
const me=new THREE.Mesh(g,[pm,pm,inner,inner,pm,pm]);if(alongX){if(isEnd)me.position.set(fixedOther,y0+hl+hh/2,mid);else me.position.set(mid,y0+hl+hh/2,fixedOther);}else{if(isEnd)me.position.set(mid,y0+hl+hh/2,fixedOther);else me.position.set(fixedOther,y0+hl+hh/2,mid);}
if(!alongX)me.rotation.y=Math.PI/2;world.add(me);occluders.push(me);}};
const far=(alongX?cx:cz)+s*L/2;
for(const sd of [-1,1])strip(cut,far,oc+sd*(other/2-.18),false);strip(oc-other/2,oc+other/2,far-s*.18,true);
for(let y=3.1;y<h-.5;y+=2.9){if(y<hl)continue;const ln=.5+rc()*Math.min(2,c*.6),wd=other*(.35+rc()*.55),off=(rc()-.5)*(other-wd)*.8,sl=box(0,0,0,1,1,1,mc('#8a7e70',{rough:1}),{collide:false});
sl.scale.set(alongX?ln:wd,.24,alongX?wd:ln);sl.position.set(alongX?cut+s*ln/2:oc+off,y0+y,alongX?oc+off:cut+s*ln/2);sl.rotation.set(alongX?0:(rc()-.5)*.25,0,alongX?-s*(rc()*.25):0);
if(rc()<.6){const bm=box(0,0,0,1,1,1,mc('#2e241c'),{collide:false});const bl=1+rc()*1.4;bm.scale.set(.14,.16,bl);bm.position.set(alongX?cut+s*.4:oc+off,y0+y-.4,alongX?oc+off:cut+s*.4);bm.rotation.set(.5+rc()*.6,alongX?Math.PI/2*s:0,0);}}
{const hh=h-hl,g=new THREE.PlaneGeometry(other,hh),uv=g.attributes.uv;for(let j=0;j<uv.count;j++)uv.setXY(j,uv.getX(j)*other/4,(hl+uv.getY(j)*hh)/11.6);
const pl=new THREE.Mesh(g,new THREE.MeshStandardMaterial({map:texInterni(),roughness:.95,envMapIntensity:.2}));pl.position.set(alongX?cut+s*.02:oc,y0+hl+hh/2,alongX?oc:cut+s*.02);pl.rotation.y=alongX?(s>0?Math.PI/2:-Math.PI/2):(s>0?0:Math.PI);world.add(pl);
for(let y=3.1;y<h;y+=2.9){if(y<hl)continue;box(alongX?cut+s*.06:oc,y0+y-.08,alongX?oc:cut+s*.06,alongX?.12:other,.22,alongX?other:.12,mc('#7a6e62'),{collide:false});}}
{const hill=new THREE.Mesh(new THREE.SphereGeometry(1,10,6,0,TAU,0,Math.PI/2),mc('#7e7266',{rough:1}));hill.scale.set((alongX?c:w)*.4,1.4,(alongX?d:c)*.4);hill.position.set(lx,y0+hl+.1,lz);world.add(hill);
for(let i=0;i<4;i++){const b=box(lx+(rc()-.5)*2,y0+hl+.6,lz+(rc()-.5)*2,.16,.16,2.4+rc()*2,mc('#2a201a'),{collide:false});b.rotation.set((rc()-.5)*1,rc()*3,(rc()-.5)*.7);}}
for(const o of world.children.slice(from))o.userData.noLift=true;return tall;}
function buildingDetail0(cx,cz,w,d,h,base,y0,bo){y0=y0||0;bo=bo||{};const rb=mulberry(Math.round(cx*73+cz*31+h*7+999)),cor=mc(shade(base,.2),{rough:.8}),dk=mc(shade(base,-.32)),qn=mc(shade(base,.14),{rough:.85});
box(cx,y0,cz,w+.16,1.15,d+.16,dk,{collide:false});box(cx,y0+1.15,cz,w+.2,.1,d+.2,cor,{collide:false});
for(let y=3.1;y<h-1.6;y+=2.9)box(cx,y0+y,cz,w+.12,.12,d+.12,cor,{collide:false});
if(!bo.roofless){box(cx,y0+h-.32,cz,w+.2,.2,d+.2,cor,{collide:false});box(cx,y0+h-.12,cz,w+.42,.22,d+.42,cor,{collide:false});box(cx,y0+h+.1,cz,w+.3,.1,d+.3,mc(shade(base,.05)),{collide:false});}
for(const [sx,sz] of [[-1,-1],[1,-1],[-1,1],[1,1]])box(cx+sx*(w/2-.18),y0+1.15,cz+sz*(d/2-.18),.5,h-1.45,.5,qn,{collide:false});
if(bo.plain||bo.roofless){}
else if(CITYSTYLE==='modena'){}
else{const T=rb(),t=.16,ph=.85,m=mc(shade(base,-.05)),Y=y0+h;
const parapet=(x,z,ww,dd,yy)=>{box(x,yy,z-dd/2+t/2,ww,ph,t,m,{collide:false});box(x,yy,z+dd/2-t/2,ww,ph,t,m,{collide:false});box(x-ww/2+t/2,yy,z,t,ph,dd,m,{collide:false});box(x+ww/2-t/2,yy,z,t,ph,dd,m,{collide:false});
box(x,yy+ph,z-dd/2+t/2,ww+.06,.06,t+.08,cor,{collide:false});box(x,yy+ph,z+dd/2-t/2,ww+.06,.06,t+.08,cor,{collide:false});};
if(T<.42){// terrazza: parapetto, il casotto delle scale, il serbatoio dell'acqua, a volte un pergolato
parapet(cx,cz,w,d,Y);const sx=cx+rr2(rb,-w/4,w/4),sz=cz+rr2(rb,-d/4,d/4);box(sx,Y,sz,1.9,2.4,2.1,mc(shade(base,-.03)),{collide:false});box(sx,Y+2.4,sz,2.2,.14,2.4,cor,{collide:false});plane(.85,1.9,mc('#3a2a1e'),sx,Y+.95,sz+1.06);
if(rb()<.6){const tx=cx+(sx>cx?-1:1)*w/4,tz=cz+(sz>cz?-1:1)*d/4;for(const [a,b] of [[-.4,-.4],[.4,-.4],[-.4,.4],[.4,.4]])box(tx+a,Y,tz+b,.08,.9,.08,mc('#5a5a5e',{metal:.5,rough:.5}),{collide:false});const tk=new THREE.Mesh(new THREE.CylinderGeometry(.55,.55,1.1,12),mc('#8a8a86',{metal:.4,rough:.6}));tk.position.set(tx,Y+1.45,tz);world.add(tk);}
if(rb()<.35){const px=cx+(sx>cx?-1:1)*w/5,pz=cz;for(const [a,b] of [[-1.2,-1],[1.2,-1],[-1.2,1],[1.2,1]])box(px+a,Y,pz+b,.1,2.2,.1,mc('#6a4a30'),{collide:false});for(let i=-1;i<=1;i+=.5)box(px+i*1.2,Y+2.2,pz,.08,.08,2.2,mc('#6a4a30'),{collide:false});}}
else if(T<.6){// piano rientrato (attico) con la sua terrazza davanti
parapet(cx,cz,w,d,Y);const aw=w*(.5+rb()*.2),ad=d*(.55+rb()*.2),ax=cx+rr2(rb,-(w-aw)/2,(w-aw)/2)*.6,az=cz-(d-ad)/2+.2;
box(ax,Y,az,aw,2.8,ad,mc(shade(base,.04)),{collide:false});box(ax,Y+2.8,az,aw+.3,.16,ad+.3,cor,{collide:false});
WINQ.push({cx:ax,cz:az,w:aw,d:ad,h:2.8,base,night:false,y0:Y,poor:!!WREC,first:1.45,noGround:true});
if(rb()<.6)hipRoof(ax,az,aw,ad,Y+2.95,Math.min(1.4,Math.min(aw,ad)*.3),.3);}
else if(T<.84){// tetto a falde coi coppi, il colmo sul lato lungo
roofGable(cx,cz,w,d,Y+.12,Math.min(2.4,Math.min(w,d)*.3),shade(base,-.04),d>w,true);if(rb()<.7)box(cx+w*.22,Y+.6,cz+d*.1,.45,1.9,.45,mc('#8a5a44'),{collide:false});}
else{// tetto a padiglione, con un'altana coperta a volte
hipRoof(cx,cz,w,d,Y+.12,Math.min(2.2,Math.min(w,d)*.32));box(cx-w*.2,Y+.8,cz,.45,1.8,.45,mc('#8a5a44'),{collide:false});}
if(T<.42&&rb()<.3){// l'altana: un piccolo loggiato coperto sulla terrazza
const lx=cx+rr2(rb,-w/4,w/4),lz=cz+rr2(rb,-d/4,d/4);for(const [a,b] of [[-1.1,-1.1],[1.1,-1.1],[-1.1,1.1],[1.1,1.1]])box(lx+a,Y,lz+b,.22,2.4,.22,cor,{collide:false});box(lx,Y+2.4,lz,2.7,.2,2.7,cor,{collide:false});hipRoof(lx,lz,2.7,2.7,Y+2.6,1.1,.25);}}
const pc=new THREE.Mesh(new THREE.CylinderGeometry(.05,.05,h,6),mc('#5a5a5e',{rough:.5,metal:.4}));pc.position.set(cx+(rb()<.5?-1:1)*(w/2+.04),y0+h/2,cz+(rb()<.5?-1:1)*(d/2+.04));world.add(pc);}
const rr2=(rb,a,b)=>a+rb()*(b-a);
function macerie(x0,z0,x1,z1,y0){y0=y0||0;const rb=mulberry(Math.round(x0*17+z0*29)),st=[mc('#8a7e70'),mc('#6e645a'),mc('#a49888'),mc('#5a5048')],cx=(x0+x1)/2,cz=(z0+z1)/2,W=x1-x0,D=z1-z0;
for(let i=0;i<6;i++){const hx=x0+rb()*W,hh=1+rb()*3.5;box(hx,y0,z0+.2,.9+rb()*1.4,hh,.35,st[i%4],{collide:false}).rotation.z=(rb()-.5)*.08;}
for(let i=0;i<4;i++){const hz=z0+rb()*D;box(x0+.2,y0,hz,.35,.8+rb()*2.5,1+rb()*1.4,st[(i+1)%4],{collide:false});}
for(let i=0;i<48;i++){const s=.15+rb()*.55,b=box(x0+.6+rb()*(W-1.2),y0-s*.3,z0+.6+rb()*(D-1.2),s*1.3,s,s,st[i%4],{collide:false});b.rotation.set(rb()*3,rb()*3,rb()*3);}
const hill=new THREE.Mesh(new THREE.SphereGeometry(1,12,8,0,TAU,0,Math.PI/2),mc('#7a6e62'));hill.scale.set(W*.38,1.1,D*.38);hill.position.set(cx,y0,cz);world.add(hill);
for(let i=0;i<5;i++){const b=box(cx+(rb()-.5)*W*.6,y0+.6+rb(),cz+(rb()-.5)*D*.6,.18,.18,2.6+rb()*1.5,mc('#2a201a'),{collide:false});b.rotation.set((rb()-.5)*.9,rb()*3,(rb()-.5)*.6);}
box(x0+W*.7,y0,z0+.25,.25,2.6,.3,mc('#4a3a2a'),{collide:false});box(x0+W*.7+.9,y0,z0+.25,.25,2.6,.3,mc('#4a3a2a'),{collide:false});box(x0+W*.7+.45,y0+2.5,z0+.25,1.2,.25,.3,mc('#4a3a2a'),{collide:false});
grass([[x0+.3,z0+.3,x1-.3,z1-.3]],60,{h:.22,hue:.18,y:y0});wall(x0,z0,x1,z1);
hooks.push(dt=>{if(Math.random()<dt*.3)puff(x0+rb()*W,y0+.3,z0+rb()*D,.5,0xb8aa98,2.4,.25,.2,0);});}
function fontana(x,z,y0){y0=y0||0;const st=mc('#b8b0a2',{rough:.7}),bas=new THREE.Mesh(new THREE.CylinderGeometry(1.15,1.25,.55,8),st);bas.position.set(x,y0+.27,z);world.add(bas);
const wat=new THREE.Mesh(new THREE.CylinderGeometry(1.02,1.02,.05,24),new THREE.MeshStandardMaterial({color:'#3a8a9a',roughness:.1,envMapIntensity:.9}));wat.position.set(x,y0+.47,z);world.add(wat);
const col=new THREE.Mesh(new THREE.CylinderGeometry(.16,.22,1.3,10),st);col.position.set(x,y0+1.1,z);world.add(col);const cup=new THREE.Mesh(new THREE.CylinderGeometry(.45,.2,.2,10),st);cup.position.set(x,y0+1.8,z);world.add(cup);
for(let i=0;i<4;i++){const a=i*Math.PI/2,m=new THREE.Mesh(new THREE.SphereGeometry(.12,8,6),mc('#8a9090',{rough:.4,metal:.5}));m.position.set(x+Math.cos(a)*.3,y0+1.55,z+Math.sin(a)*.3);world.add(m);}
wall(x-1.2,z-1.2,x+1.2,z+1.2);
hooks.push(()=>{if(Math.random()<.5){const a=Math.random()*TAU;puff(x+Math.cos(a)*.35,y0+1.6,z+Math.sin(a)*.35,.1,0xd8f4ff,.7,1.4,Math.cos(a)*.9,Math.sin(a)*.9);}});}
function basso(x,z,side,y0){y0=y0||0;const ry=side<0?Math.PI/2:-Math.PI/2,fx=x+side*-.02;
plane(1.5,2.3,mc('#1a1210',{basic:true}),fx,y0+1.15,z,ry);plane(1.7,.25,mc('#e2d6c0'),fx-side*.01,y0+2.42,z,ry);for(const dz of [-.82,.82])box(x-side*.04,y0,z+dz,.12,2.5,.18,mc('#d8ccb6'),{collide:false});
for(let i=0;i<9;i++){const b=box(fx-side*.03,y0+.4,z-.6+i*.15,.02,1.85,.025,mc(i%2?'#b8402e':'#e0c070',{rough:.4}),{collide:false});b.userData.noCast=true;}
glowAt(x-side*.3,y0+1.3,z,1.4,0xffc880,true);}
function sedia(x,z,ry,y0){y0=y0||0;const g=new THREE.Group(),w=mc('#6a4a30'),s=mc('#c8a860',{rough:.95});for(const [dx,dz] of [[-.18,-.18],[.18,-.18],[-.18,.18],[.18,.18]]){const l=new THREE.Mesh(CG.box,w);l.scale.set(.04,.45,.04);l.position.set(dx,.225,dz);g.add(l);}
const seat=new THREE.Mesh(CG.box,s);seat.scale.set(.42,.05,.42);seat.position.y=.46;g.add(seat);for(const dx of [-.18,.18]){const b=new THREE.Mesh(CG.box,w);b.scale.set(.04,.5,.04);b.position.set(dx,.7,-.19);g.add(b);}
const bk=new THREE.Mesh(CG.box,w);bk.scale.set(.4,.08,.03);bk.position.set(0,.88,-.19);g.add(bk);g.position.set(x,y0,z);g.rotation.y=ry||0;world.add(g);return g;}
function busy(def,x,z,act,o){o=o||{};const a=actor(def,x,z,{name:o.name||'',solid:false,fx:o.fx,fz:o.fz});a.act=act;a.watch=o.watch!==undefined?o.watch:true;
if(act==='sweep'){const b=grp(a.R.arms[0].el,0,-(a.def.adult?.64:.44)*.42,0);part(b,CG.cyl,'#8a6a40',0,.5,0,.03,1.3,.03);part(b,CG.box,'#c8a860',0,-.82,0,.25,.22,.08,{r:.95});b.rotation.x=.5;}
if(act==='fish'){const b=grp(a.R.arms[0].el,0,-.27,0);const r=part(b,CG.cyl,'#5a4028',0,0,0,.02,2.6,.02);b.rotation.x=-1.1;}
if(act==='knit'){part(a.R.hips,CG.sph,'#b84a3a',0,.05,.25,.12,.1,.12,{k:'wool'});}
if(act==='sit'||act==='knit'||act==='fish'){sitDown(a,o.seat);}
return a;}
let guideFn=null,guideOn=true;try{guideOn=localStorage.getItem('treno-guide')!=='0';}catch(e){}
const GUIDE=(()=>{const c=document.createElement('canvas');c.width=4;c.height=128;const g=c.getContext('2d'),gr=g.createLinearGradient(0,128,0,0);gr.addColorStop(0,'rgba(255,220,150,.9)');gr.addColorStop(.25,'rgba(255,210,140,.35)');gr.addColorStop(1,'rgba(255,200,130,0)');g.fillStyle=gr;g.fillRect(0,0,4,128);
const m=new THREE.MeshBasicMaterial({map:new THREE.CanvasTexture(c),transparent:true,depthWrite:false,blending:THREE.AdditiveBlending,fog:false,side:THREE.DoubleSide,opacity:0});
const geo=new THREE.CylinderGeometry(.42,.55,26,20,1,true);geo.translate(0,13,0);const col=new THREE.Mesh(geo,m);
const rm=new THREE.MeshBasicMaterial({color:0xffd890,transparent:true,depthWrite:false,blending:THREE.AdditiveBlending,opacity:0});const ring=new THREE.Mesh(new THREE.RingGeometry(.55,.68,32),rm);ring.rotation.x=-Math.PI/2;ring.position.y=.04;
const grp2=new THREE.Group();grp2.add(col,ring);grp2.renderOrder=5;scene.add(grp2);return {grp:grp2,m,rm,op:0,pos:new THREE.Vector3()};})();
const _gv=new THREE.Vector3();
function guideTarget(){if(guideFn){const t=guideFn();if(t)return t;}let best=null,bd=1e9;if(!P)return null;
for(const a of actors){if(!a.mark||!a.mark.visible)continue;const d=Math.hypot(a.x-P.x,a.z-P.z);if(d<bd){bd=d;best=[a.x,a.z];}}
for(const it of items){if(it.taken)continue;const d=Math.hypot(it.x-P.x,it.z-P.z);if(d<bd){bd=d;best=[it.x,it.z];}}return best;}
function updateGuide(dt){const G=GUIDE,el=$('#garrow');let t=null;if(guideOn&&P&&playing&&!onTitle&&!cineMode&&!miniOn&&!D.open&&$('#card').hidden)t=guideTarget();
const near=t&&Math.hypot(t[0]-P.x,t[1]-P.z)<1.6;const want=t&&!near?1:0;G.op+=(want-G.op)*Math.min(1,dt*3);
if(t){G.pos.set(t[0],heightAt(t[0],t[1]),t[1]);G.grp.position.lerp(G.pos,G.grp.visible&&G.op>.05?Math.min(1,dt*6):1);}
G.grp.visible=G.op>.01;const pul=.75+Math.sin(now()*2.4)*.25;G.m.opacity=G.op*.55*pul;G.rm.opacity=G.op*.6*pul;G.grp.children[1].scale.setScalar(1+Math.sin(now()*2.4)*.12);
if(!t||near||G.op<.3){el.hidden=true;return;}
_gv.set(t[0],heightAt(t[0],t[1])+1.2,t[1]).project(camera);const behindCam=_gv.z>1,on=!behindCam&&Math.abs(_gv.x)<.92&&Math.abs(_gv.y)<.88;
if(on){el.hidden=true;return;}let x=_gv.x,y=_gv.y;if(behindCam){x=-x;y=-Math.abs(y)-.5;}const a=Math.atan2(y,x),k=Math.min(.86/Math.abs(Math.cos(a)||1e-3),.8/Math.abs(Math.sin(a)||1e-3));
el.hidden=false;el.style.left=(50+Math.cos(a)*k*50)+'%';el.style.top=(50-Math.sin(a)*k*50)+'%';el.style.transform='translate(-50%,-50%) rotate('+(-a)+'rad)';el.style.opacity=G.op;}
function miniMark(a){if(!a)return;const r=new THREE.Mesh(new THREE.RingGeometry(.48,.56,40,1,0,TAU),new THREE.MeshBasicMaterial({color:0xe9c46a,transparent:true,opacity:.5,depthWrite:false}));r.rotation.x=-Math.PI/2;r.position.y=.035;a.g.add(r);
const dots=[];for(let i=0;i<4;i++){const d=new THREE.Mesh(new THREE.CircleGeometry(.05,10),r.material);d.rotation.x=-Math.PI/2;d.position.y=.04;a.g.add(d);dots.push(d);}
hooks.push(()=>{const v=!!(a.markFn&&a.markFn());r.visible=v;const tt=now();dots.forEach((d,i)=>{d.visible=v;const an=tt*.8+i*Math.PI/2;d.position.x=Math.cos(an)*.52;d.position.z=Math.sin(an)*.52;});r.material.opacity=.35+Math.sin(tt*2)*.15;});}
function puff(x,y,z,s,col,life,vy,vx,vz,add){const m=new THREE.SpriteMaterial({map:add?glowTex:texPuff(),color:col===undefined?0xf4ece0:col,transparent:true,opacity:.85,depthWrite:false,blending:add?THREE.AdditiveBlending:THREE.NormalBlending});const sp=new THREE.Sprite(m);sp.position.set(x,y,z);sp.scale.setScalar(s);world.add(sp);FX.push({sp,t:0,life:life||2.2,vx:vx===undefined?-.3+Math.random()*.2:vx,vy:vy===undefined?1.1:vy,vz:vz||0,grow:s*1.3,s0:s,op0:.85});}
function updateFX(dt){for(let i=FX.length-1;i>=0;i--){const f=FX[i];f.t+=dt;const k=f.t/f.life;f.sp.position.x+=f.vx*dt;f.sp.position.y+=f.vy*dt;f.sp.position.z+=f.vz*dt;f.sp.scale.setScalar(f.s0+f.grow*k);f.sp.material.opacity=f.op0*(1-k);if(k>=1){if(f.sp.parent)f.sp.parent.remove(f.sp);f.sp.material.dispose();FX.splice(i,1);}}}
function emote(a,k){if(!a)return;if(a.an&&EXPR_OF[k])expr(a,EXPR_OF[k]);const sp=new THREE.Sprite(new THREE.SpriteMaterial({map:emoteTex(k),transparent:true,depthTest:false}));const s=.42;sp.scale.set(s,s,1);sp.position.set(a.x,(a.def.adult?2.4:1.85)*(a.sc||1)+a.g.position.y,a.z);world.add(sp);FX.push({sp,t:0,life:1.5,vx:0,vy:.4,vz:0,grow:.08,s0:s,op0:1});}
function explode(x,z){boom(1);puff(x,.6,z,.6,0xffa040,.4,0,0,0,true);FX[FX.length-1].grow=7;for(let i=0;i<9;i++)puff(x+rr(-.6,.6),.3,z+rr(-.6,.6),.7,0x5a4a44,1.6,rr(.6,1.6),rr(-1.2,1.2),rr(-1.2,1.2));for(let i=0;i<5;i++)puff(x,.4,z,.18,0xffd070,.6,rr(2,4),rr(-3,3),rr(-3,3),true);
const fl=$('#flash');fl.style.transition='none';fl.style.opacity=.55;requestAnimationFrame(()=>{fl.style.transition='opacity .35s';fl.style.opacity=0;});}
