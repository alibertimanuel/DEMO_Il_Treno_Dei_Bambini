"use strict";
function roofGable(cx,cz,w,d,y,rh,wallCol,alongZ,noSnow){const g=new THREE.Group();g.position.set(cx,y,cz);if(alongZ){g.rotation.y=Math.PI/2;const t=w;w=d;d=t;}world.add(g);
const sl=Math.hypot(d/2+.35,rh),an=Math.atan2(rh,d/2+.35),rm=mc('#9a4a32',{rough:.8}),sn=mc('#dfe4ea',{rough:.95});
const rt=texRoof().clone();rt.needsUpdate=true;rt.repeat.set((w+.5)/1.2,sl/1.2);const rmat=mat(rt);
for(const s of [-1,1]){const r=new THREE.Mesh(CG.box,rmat);r.scale.set(w+.5,.14,sl);r.position.set(0,rh/2,s*(d/4+.17));r.rotation.x=s*an;g.add(r);occluders.push(r);
if(noSnow)continue;const c=new THREE.Mesh(CG.box,sn);c.scale.set(w+.42,.07,sl*.9);c.position.set(0,rh/2+.1*Math.cos(an),s*(d/4+.17)+.1*Math.sin(an)*s);c.rotation.x=s*an;g.add(c);}
if(!noSnow){g.updateMatrixWorld(true);const rn=mulberry(Math.round(cx*17+cz*29));for(const s of [-1,1])for(let x=-w/2+.2;x<w/2-.1;x+=.28+rn()*.35){if(rn()<.35)continue;const v=new THREE.Vector3(x,-.08,s*(d/2+.38)).applyMatrix4(g.matrixWorld);ICEQ.push([v.x,v.y,v.z,.12+rn()*.38]);}}
const ridge=new THREE.Mesh(CG.box,rm);ridge.scale.set(w+.5,.16,.22);ridge.position.y=rh+.05;g.add(ridge);
const tri=new THREE.Shape();tri.moveTo(-d/2,0);tri.lineTo(d/2,0);tri.lineTo(0,rh);tri.closePath();const tg=new THREE.ShapeGeometry(tri),tm=mc(wallCol||'#d8c4a0',{rough:.95});
for(const s of [-1,1]){const t=new THREE.Mesh(tg,tm);t.position.x=s*w/2;t.rotation.y=s*Math.PI/2;g.add(t);}g.userData.static=true;return g;}
function modenaLontana(){const MC=['#e2c48e','#d89a5a','#e6c890','#c8784a','#e0b070','#d8a878','#c88a60'];
cittaLontana({seed:771,area:[-280,-96,-200,60],pal:MC,n:300,hmin:7,hmax:13,gable:true,snow:true,pines:0});
cittaLontana({seed:772,area:[-96,-30,-220,-50],pal:MC,n:160,hmin:7,hmax:12,gable:true,snow:true,avoid:(x,z)=>z>-52&&x>-96});
const st=kmat('duomoMo',()=>{const t=texSlabs().clone();t.needsUpdate=true;t.repeat.set(4,6);const m=mat(t);m.color.set('#ded2b8');return m;});
const TX=-150,TZ=-95;box(TX,0,TZ,9,48,9,st);box(TX,48,TZ,10,1,10,st,{collide:false});box(TX,49,TZ,8,9,8,st,{collide:false});for(const [dx,dz,ry] of [[0,4.02,0],[0,-4.02,Math.PI],[4.02,0,Math.PI/2],[-4.02,0,-Math.PI/2]])plane(2.6,5,mc('#1a1612'),TX+dx,53,TZ+dz,ry);
{const oc=new THREE.Mesh(new THREE.CylinderGeometry(3.6,3.6,6,8),st);oc.position.set(TX,61,TZ);world.add(oc);const sp=new THREE.Mesh(new THREE.ConeGeometry(3.4,22,8),st);sp.position.set(TX,75,TZ);world.add(sp);}
box(TX+12,0,TZ+2,18,20,46,st);roofGable(TX+12,TZ+2,18,46,20,7,'#ded2b8',true);{const ro=new THREE.Mesh(new THREE.CircleGeometry(2.6,24),mc('#3a2e3a'));ro.position.set(TX+12,15,TZ+25.05);world.add(ro);}
plane(4,7,mc('#2a1e16'),TX+12,3.5,TZ+25.05);}
let ICEQ=[];
function iceFlush(){const q=ICEQ;ICEQ=[];if(!q.length)return;const g=new THREE.ConeGeometry(.045,1,5);g.rotateX(Math.PI);g.translate(0,-.5,0);
const im=new THREE.InstancedMesh(g,new THREE.MeshStandardMaterial({color:'#e8f2fa',roughness:.08,metalness:.1,transparent:true,opacity:.82,envMapIntensity:1.2}),q.length),m4=new THREE.Matrix4(),qq=new THREE.Quaternion(),v=new THREE.Vector3(),s=new THREE.Vector3();
q.forEach((e,i)=>{m4.compose(v.set(e[0],e[1],e[2]),qq,s.set(1,e[3],1));im.setMatrixAt(i,m4);});im.userData.noMerge=true;world.add(im);}
function carretto(xa,xb,z,o){o=o||{};const g=new THREE.Group();g.userData.noCam=true;const wd=mat(texWood()),an=mc(o.col||'#5a4636',{rough:.9}),dk=mc('#2a2220');
const cb=new THREE.Mesh(CG.box,wd);cb.scale.set(2.2,.12,1.2);cb.position.set(-1.1,.75,0);g.add(cb);for(const s of [-1,1]){const sd=new THREE.Mesh(CG.box,wd);sd.scale.set(2.2,.35,.06);sd.position.set(-1.1,.98,s*.6);g.add(sd);
const wh=new THREE.Mesh(new THREE.TorusGeometry(.42,.06,6,16),dk);wh.position.set(-1.2,.42,s*.68);g.add(wh);const sh=new THREE.Mesh(CG.box,wd);sh.scale.set(1.8,.06,.06);sh.position.set(.6,.78,s*.32);g.add(sh);}
const load=new THREE.Mesh(CG.sph,mc(o.load||'#c8a858',{rough:1}));load.scale.set(1.9,.55,1);load.position.set(-1.1,1,0);g.add(load);
const body=new THREE.Mesh(CG.box,an);body.scale.set(1.4,.62,.5);body.position.set(1.4,1.18,0);g.add(body);const nk=new THREE.Mesh(CG.box,an);nk.scale.set(.5,.62,.3);nk.position.set(2.15,1.55,0);nk.rotation.z=-.7;g.add(nk);
const hd=new THREE.Mesh(CG.box,an);hd.scale.set(.55,.28,.26);hd.position.set(2.5,1.78,0);hd.rotation.z=-.4;g.add(hd);for(const s of [-1,1]){const ea=new THREE.Mesh(CG.box,an);ea.scale.set(.08,.26,.06);ea.position.set(2.32,2,s*.1);g.add(ea);}
const legs=[];for(const [lx,lz] of [[.85,-.18],[.85,.18],[1.95,-.18],[1.95,.18]]){const l=new THREE.Mesh(CG.box,an);l.scale.set(.14,.9,.14);l.geometry=CG.box;const p=new THREE.Group();p.position.set(lx,.9,lz);l.position.y=-.45;p.add(l);g.add(p);legs.push(p);}
world.add(g);const man=actor(o.def||C.castagnaro,xa,z+1.1,{name:'',solid:false,watch:false});let t=o.ph||0;const L=xb-xa;
hooks.push(dt=>{t+=dt;const per=L/1.1,u=(t%(2*per))/per,dir=u<1?1:-1,k=u<1?u:2-u,x=xa+L*k,gy=heightAt(x,z);g.position.set(x,gy,z);g.rotation.y=dir>0?0:Math.PI;
legs.forEach((p,i)=>{p.rotation.z=Math.sin(t*5+(i%2?Math.PI:0)+(i>1?.5:0))*.35;});g.children.forEach(c=>{if(c.geometry&&c.geometry.type==='TorusGeometry')c.rotation.z=-t*2.6*dir;});
man.x=x+dir*1.6;man.z=z+1.1;man.face={x:dir,z:0};man.moving=true;});return g;}
function modenaDettagli(){const rn=mulberry(4545),L={pile:[],wood:[],bike:[]};
const free=(x,z)=>{for(const b of obstacles)if(x>b.x0-.05&&x<b.x1+.05&&z>b.z0-.05&&z<b.z1+.05)return false;return true;};
const lines=[[-84,2.4,-30,2.4],[-84,8.6,-31,8.6],[-65.6,-6,-65.6,-33],[-50.4,-6,-50.4,-33],[-43.6,-6,-43.6,-35],[-40.4,-6,-40.4,-35],[-27,1.8,-5,1.8],[-26,-7,-12,-7]];
for(const [ax,az,bx,bz] of lines){const len=Math.hypot(bx-ax,bz-az),n=Math.round(len/1.6);for(let i=0;i<n;i++){const t=rn(),x=ax+(bx-ax)*t,z=az+(bz-az)*t;if(!free(x,z))continue;const y=heightAt(x,z),r=rn();
if(r<.62)L.pile.push([x,y,z,.35+rn()*.5]);else if(r<.85)L.wood.push([x,y,z,rn()*TAU]);else L.bike.push([x,y,z,Math.atan2(bz-az,bx-ax)]);}}
const m4=new THREE.Matrix4(),q=new THREE.Quaternion(),v=new THREE.Vector3(),s=new THREE.Vector3(),Y=new THREE.Vector3(0,1,0);
if(L.pile.length){const im=new THREE.InstancedMesh(new THREE.SphereGeometry(1,10,6,0,TAU,0,Math.PI/2),new THREE.MeshStandardMaterial({color:'#eef2f6',roughness:.95,envMapIntensity:.4}),L.pile.length);
L.pile.forEach((e,i)=>{q.setFromAxisAngle(Y,e[0]);m4.compose(v.set(e[0],e[1],e[2]),q,s.set(e[3]*1.5,e[3]*.55,e[3]));im.setMatrixAt(i,m4);});im.receiveShadow=true;world.add(im);}
if(L.wood.length){const g=new THREE.CylinderGeometry(.09,.09,.8,7);g.rotateZ(Math.PI/2);const per=[];L.wood.forEach(e=>{for(let r=0;r<3;r++)for(let k=0;k<4-r;k++)per.push([e,r,k]);});
const im=new THREE.InstancedMesh(g,mc('#7a5a3a',{rough:.95}),per.length);per.forEach(([e,r,k],i)=>{q.setFromAxisAngle(Y,e[3]);v.set(-.27+k*.18+r*.09,.09+r*.16,0).applyQuaternion(q);m4.compose(v.add(new THREE.Vector3(e[0],e[1],e[2])),q,s.set(1,1,1));im.setMatrixAt(i,m4);});im.castShadow=true;world.add(im);}
for(const e of L.bike){const g=new THREE.Group(),ir=mc('#2a2a30',{rough:.4,metal:.8});for(const dx of [-.5,.5]){const w=new THREE.Mesh(new THREE.TorusGeometry(.32,.03,6,16),ir);w.position.set(dx,.33,0);g.add(w);}const b=new THREE.Mesh(CG.box,mc(pick(['#2a2a30','#5a1e1e','#1e3a5a'])));b.scale.set(1,.05,.05);b.position.y=.6;g.add(b);
g.position.set(e[0],e[1],e[2]);g.rotation.set(0,e[3],.18);world.add(g);}
insegna('CASA DEL POPOLO',-56,3.3,8.94,Math.PI,3.6,'#8a2a24','#ffffff');
{const PL={scar:{brick:[],pock:[],breach:[],soot:[],board:[],poster:[]},beam:[],rock:[]};for(const [x,z,ry,k] of [[-53.6,8.92,Math.PI,0],[-52.6,8.92,Math.PI,3],[-44.9,-12,Math.PI/2,1],[-44.9,-13,Math.PI/2,2],[-50.4,-20,-Math.PI/2,0]])PL.scar.poster.push([x,1.8+heightAt(x,z),z,ry,.8,1.05,k]);flushScars(PL);}
carretto(-80,-36,4.6,{col:'#6a4a32',load:'#e8e4d8',def:C.alcide,ph:7});
for(const p of [[[-26,1.5],[-6,1.5]],[[-10,-9],[-24,-9]],[[2,3],[2,-30]],[[-14,-12.5],[-4,-12.5]]]){const a=actor(vary(pick([C.rosa,C.signora,C.alcide,C.maestra,C.comitato])),p[0][0],p[0][1],{name:'',speed:.9+R()*.3});a.path=p.map(z=>[z[0],z[1],1+R()*3]);a.watch=false;}}
function portico(x0,x1,zf,zb,h,col){const n=Math.max(1,Math.round((x1-x0)/2.6)),sp=(x1-x0)/n,pw=.5,sh=new THREE.Shape();
sh.moveTo(x0,-.05);sh.lineTo(x1,-.05);sh.lineTo(x1,h+.7);sh.lineTo(x0,h+.7);sh.closePath();
for(let i=0;i<n;i++){const xa=x0+i*sp+pw/2+(i===0?pw/2:0),xb=x0+(i+1)*sp-pw/2-(i===n-1?pw/2:0),r=(xb-xa)/2,ys=h-r-.15,ho=new THREE.Path();
ho.moveTo(xa,0);ho.lineTo(xb,0);ho.lineTo(xb,ys);ho.absarc((xa+xb)/2,ys,r,0,Math.PI,false);ho.lineTo(xa,0);sh.holes.push(ho);}
const m=mc(col,{rough:.9}),me=new THREE.Mesh(new THREE.ExtrudeGeometry(sh,{depth:.45,bevelEnabled:false,curveSegments:10}),m);me.position.z=zf-.45;world.add(me);
for(let i=0;i<=n;i++){const x=x0+i*sp;obstacles.push({x0:x-pw/2-.05,x1:x+pw/2+.05,z0:zf-.5,z1:zf+.05});const cap=new THREE.Mesh(CG.box,mc(shade(col,.18)));cap.scale.set(.7,.16,.6);cap.position.set(x,h-.9,zf-.22);world.add(cap);
const base=new THREE.Mesh(CG.box,mc(shade(col,-.2)));base.scale.set(.66,.35,.56);base.position.set(x,.17,zf-.22);world.add(base);}
const cor=new THREE.Mesh(CG.box,mc(shade(col,.2)));cor.scale.set(x1-x0+.3,.18,.6);cor.position.set((x0+x1)/2,h+.79,zf-.22);world.add(cor);
const ce=new THREE.Mesh(new THREE.PlaneGeometry(x1-x0,zf-zb),mc(shade(col,-.08)));ce.rotation.x=Math.PI/2;ce.position.set((x0+x1)/2,h+.6,(zf+zb)/2);ce.userData.noCast=true;world.add(ce);
const fl=ground(x1-x0,zf-zb,texSlabs(),(x0+x1)/2,(zf+zb)/2,(x1-x0)/2.5,1,.015);fl.userData.noCast=true;}
function farmhouse(cx,cz,w,d,h,col){box(cx,0,cz,w,h,d,mc(col,{rough:.95}));box(cx,0,cz,w+.1,.55,d+.1,mc(shade(col,-.28)),{collide:false});const sh=mc('#3e6a4a',{rough:.7}),dk=mc('#2a2420',{rough:.5}),fr=mc(shade(col,.3));
const floors=Math.max(1,Math.floor(h/2.6)),nx=Math.max(2,Math.floor(w/2));
for(const s of [-1,1])for(let f=0;f<floors;f++)for(let i=0;i<nx;i++){const x=cx-w/2+(i+.5)*w/nx,y=1.6+f*2.5,z=cz+s*(d/2+.01),ry=s>0?0:Math.PI;if(f===0&&s>0&&i===Math.floor(nx/2))continue;
plane(.7,.95,dk,x,y,z,ry);box(x,y-.58,z,.9,.08,.12,fr,{collide:false});for(const dx of [-.55,.55]){const p=plane(.38,1,sh,x+dx,y,z+s*.02,ry);}}
const dx=cx-w/2+(Math.floor(nx/2)+.5)*w/nx,z=cz+d/2+.02;plane(1.2,2.2,mc('#4a3020'),dx,1.1,z);plane(1.2,.4,mc('#1a1612'),dx,2.45,z);box(dx,2.68,z,1.5,.12,.14,fr,{collide:false});}function lampione(x,z,h){h=h||3.4;const ir=mc('#26262c',{rough:.45,metal:1});const p=new THREE.Mesh(CG.cyl,ir);p.scale.set(.1,h,.1);p.position.set(x,h,z);world.add(p);
const b=new THREE.Mesh(CG.cyl,ir);b.scale.set(.2,.3,.2);b.position.set(x,.3,z);world.add(b);const l=new THREE.Mesh(new THREE.CylinderGeometry(.14,.2,.36,6),new THREE.MeshStandardMaterial({color:'#fff0c8',emissive:new THREE.Color('#ffc870'),emissiveIntensity:.9,roughness:.3}));l.position.set(x,h+.2,z);world.add(l);
const c=new THREE.Mesh(new THREE.ConeGeometry(.26,.2,6),ir);c.position.set(x,h+.48,z);world.add(c);glowAt(x,h+.2,z,1.5,0xffc870,true);obstacles.push({x0:x-.15,x1:x+.15,z0:z-.15,z1:z+.15});}
function treeAt(kind,x,z,s){const t=treeG(kind,s||1);t.position.set(x,0,z);t.rotation.y=R()*TAU;world.add(t);obstacles.push({x0:x-.3,x1:x+.3,z0:z-.3,z1:z+.3});return t;}
const texFurrowSnow=()=>T('fsnow',()=>hd(256,256,(g,gb,w,h,rnd)=>{g.fillStyle='#c8d0d8';g.fillRect(0,0,w,h);gb.fillStyle='#808080';gb.fillRect(0,0,w,h);
for(let y=0;y<h;y+=16){g.fillStyle='rgba(110,90,70,.55)';g.fillRect(0,y+rnd()*2,w,5);gb.fillStyle='#303030';gb.fillRect(0,y,w,5);gb.fillStyle='#e8e8e8';gb.fillRect(0,y+8,w,5);}
blot(g,w,h,rnd,30,'230,234,240',8,40,.4);blot(g,w,h,rnd,12,'120,100,80',6,24,.2);grainPx(g,w,h,8,rnd);},.06));
function fogBanks(n,col){const list=[];for(let i=0;i<n;i++){const m=new THREE.SpriteMaterial({map:texPuff(),color:col||0xeceae6,transparent:true,depthWrite:false,opacity:0,fog:false});const sp=new THREE.Sprite(m);const s=rr(9,15);sp.scale.set(s*1.9,s*.5,1);world.add(sp);
list.push({sp,m,x:rr(-24,24),z:rr(-24,24),y:rr(.4,1.8),v:rr(.15,.4),ph:R()*6,op:rr(.2,.36)});}
hooks.push(dt=>{const cx=P?P.x:0,cz=P?P.z:0,tt=now();for(const f of list){f.x+=f.v*dt;if(f.x>24)f.x=-24;f.sp.position.set(cx+f.x,f.y+Math.sin(tt*.2+f.ph)*.2,cz+f.z);
f.m.opacity=f.op*smoothK(4,9,Math.hypot(f.x,f.z))*(1-smoothK(18,24,Math.abs(f.x)));}});}
function ciclista(xa,xb,z,col,ph){const g=new THREE.Group(),ir=mc('#1e1e22',{rough:.4,metal:.8}),wh=[];for(const dx of [-.55,.55]){const w=new THREE.Mesh(new THREE.TorusGeometry(.33,.03,6,18),ir);w.position.set(dx,.34,0);g.add(w);wh.push(w);}
const fr=(x,y,l,a)=>{const b=new THREE.Mesh(CG.box,ir);b.scale.set(l,.04,.04);b.position.set(x,y,0);b.rotation.z=a;g.add(b);};fr(0,.62,1,0);fr(-.25,.48,.6,.9);fr(.42,.55,.45,-1.2);
const coat=mc(col,{rough:.9}),skin=mc('#e8b898');const body=new THREE.Mesh(CG.box,coat);body.scale.set(.32,.6,.34);body.position.set(-.08,1.2,0);body.rotation.z=-.25;g.add(body);
const head=new THREE.Mesh(CG.sph,skin);head.scale.setScalar(.2);head.position.set(.02,1.62,0);g.add(head);const hat=new THREE.Mesh(CG.box,mc('#2a2a30'));hat.scale.set(.26,.08,.26);hat.position.set(.02,1.74,0);g.add(hat);
const arm=new THREE.Mesh(CG.box,coat);arm.scale.set(.5,.1,.1);arm.position.set(.25,1.2,0);arm.rotation.z=-.5;g.add(arm);const legs=[];for(const s of [-1,1]){const l=new THREE.Mesh(CG.box,mc('#2a2a34'));l.scale.set(.12,.55,.12);l.position.set(-.1,.72,s*.1);g.add(l);legs.push(l);}
world.add(g);let t=ph||0;const L=xb-xa;hooks.push(dt=>{t+=dt;const per=L/3.2,u=(t%(2*per))/per,dir=u<1?1:-1,k=u<1?u:2-u;g.position.set(xa+L*k,0,z+(dir>0?0:1.4));g.rotation.y=dir>0?0:Math.PI;
for(const w of wh)w.rotation.z=-t*9;legs[0].position.y=.72+Math.sin(t*9)*.08;legs[1].position.y=.72-Math.sin(t*9)*.08;});}
function modenaCitta(){const rn=mulberry(1947),MC=['#e2c48e','#d89a5a','#e6c890','#c8784a','#e0b070','#d8a878','#c88a60'],P2=c=>c||rpick(rn,MC),from=world.children.length;
const Hp=(x,z)=>1.2*clamp((-6-z)/28,0,1),Hl=(x,z)=>2*clamp((-6-z)/30,0,1);AUTOY=true;
ramps.push({x0:-66,x1:-50,z0:-34,z1:-6,h0:1.2,h1:0,ax:'z'},{x0:-66,x1:-50,z0:-36,z1:-34,h0:1.2,h1:1.2},{x0:-44,x1:-40,z0:-36,z1:-6,h0:2,h1:0,ax:'z'});
ground(70,62,texSnow(),-62,-14,30,26,.026).userData.noLift=true;const st=texSlabs();ground(54,7,st,-57,5.5,18,2,.065).userData.noLift=true;ground(9,7,st,-88.5,5.5,3,2,.065).userData.noLift=true;wall(-87,9,-84,9.5);ground(16,34,st,-58,-17,6,12,.065,Hp);ground(4,34,texDirt(),-42,-17,2,12,.065,Hl);
const casa=(cx,cz,w,d,h,c)=>{building(cx,cz,w,d,h,c);roofGable(cx,cz,w,d,h,Math.min(2,d*.32),c);if(rn()<.6){box(cx+w*.25,h,cz,.45,2.2,.45,mc('#b8a888'),{collide:false});chimneySmoke(cx+w*.25,h+2.4,cz,0xd8d8dc);}};
for(const [a,b] of [[-84,-66],[-50,-44],[-40,-30]]){let x=a;while(x<b-.5){const w=Math.min(rr2(rn,5,7),b-x);casa(x+w/2,-3,w,6,rr2(rn,8,11),P2());x+=w;}portico(a,b,2,0,3.1,'#e8d6b0');}
const shops=[['PANETTERIA','#6a2a1a'],['MERCERIA','#1e3a5a'],['CAFFÈ','#3a2a1a'],['FARMACIA','#1e4a2a'],['BARBIERE','#4a1e2a'],['DROGHERIA','#2a3a1a'],['CALZOLERIA','#3a2a4a'],['ALIMENTARI','#1e3a2a']];
{let x=-84,i=0;while(x<-31){const w=Math.min(rr2(rn,5,6.5),-30.5-x),cx=x+w/2;casa(cx,11,w,4,rr2(rn,7,9),P2());const [txt,bg]=shops[i++%shops.length];
plane(2.6,.42,new THREE.MeshStandardMaterial({map:signTex(txt,384,64,bg,'#f2e2b0','bold 38px Georgia, serif'),roughness:.4}),cx,2.85,8.96,Math.PI);
const sw=plane(1.7,1.4,new THREE.MeshStandardMaterial({color:'#ffd690',emissive:new THREE.Color('#ffb860'),emissiveIntensity:.75}),cx-.8,1.3,8.97,Math.PI);glowAt(cx-.8,1.25,8.6,1.6,0xffc070,true);
for(let k=0;k<4;k++)box(cx-1.4+k*.2,.95,8.9,.15,.2,.15,mc(rpick(rn,['#c8a050','#e8d8b0','#b84a30','#7a5a3a'])),{collide:false});x+=w;}}
{const sm=mc('#d8c8a8',{rough:.9});box(-90,0,-1,6,12,4,sm);box(-90,0,12,6,12,4,sm);box(-90,8,5.5,6,4,9,sm,{collide:false});const ar=new THREE.Mesh(new THREE.TorusGeometry(3.2,.4,8,20,Math.PI),sm);ar.rotation.y=Math.PI/2;ar.position.set(-87,7.6,5.5);world.add(ar);
for(const z of [-1,12])roofGable(-90,z,6,4,12,1.6,'#d8c8a8');wall(-93,-1,-86.9,14);casa(-90,-8,6,8,10,P2());casa(-90,18,6,8,10,P2());}
{let z=-34;while(z<-6.5){const d=Math.min(rr2(rn,5,7),-6-z);casa(-69,z+d/2,6,d,rr2(rn,9,12),P2());casa(-47,z+d/2,6,d,rr2(rn,9,12),P2());z+=d;}}
{const cm=mc('#c8784a',{rough:.85});building(-58,-38,16,8,11,'#c8784a');roofGable(-58,-38,16,8,11,2,'#c8784a');portico(-66,-50,-32,-34,3.1,'#e0b88a');
box(-58,0,-38,4,24,4,cm,{collide:false});roofGable(-58,-38,4,4,24,2.2,'#c8784a');const ck=new THREE.Mesh(new THREE.CircleGeometry(.95,28),mc('#f4efe2',{rough:.4}));ck.position.set(-58,19,-35.97);world.add(ck);
const rim=new THREE.Mesh(new THREE.TorusGeometry(1,.08,8,28),mc('#3a3a3e',{metal:.7,rough:.3}));rim.position.set(-58,19,-35.95);world.add(rim);const hh=[];for(const [l,w] of [[.55,.07],[.8,.05]]){const g=new THREE.BoxGeometry(w,l,.02);g.translate(0,l/2,0);const m=new THREE.Mesh(g,mc('#1a1a1a'));m.position.set(-58,19,-35.93);m.userData.noMerge=true;world.add(m);hh.push(m);}
hooks.push(()=>{const d=new Date(),m=(d.getMinutes()+d.getSeconds()/60)/60;hh[0].rotation.z=-((d.getHours()%12+m)/12)*TAU;hh[1].rotation.z=-m*TAU;});
plane(4.4,.6,new THREE.MeshStandardMaterial({map:signTex('MUNICIPIO',512,80,'#2a3a5a','#f2ecdc','bold 44px Georgia, serif'),roughness:.4}),-58,4.2,-33.98);
const fl=plane(1.2,.8,mat('#3a8a4a',{double:true}),-60.6,6.2,-33.5,0);hooks.push(()=>{fl.rotation.y=Math.sin(now()*2.4)*.25;});box(-61.4,3.4,-33.5,.06,3.4,.06,mc('#3a3030'),{collide:false});}
{const sm=mc('#cfc6b4',{rough:.7}),br=mc('#5a6a5a',{rough:.4,metal:.7});box(-58,0,-17,3.4,.6,3.4,sm);box(-58,.6,-17,2,2.6,2,sm,{collide:false});const s=new THREE.Group();s.position.set(-58,3.2,-17);world.add(s);
const b=new THREE.Mesh(CG.box,br);b.scale.set(.7,1.3,.5);b.position.y=1.1;s.add(b);const h=new THREE.Mesh(CG.sph,br);h.scale.setScalar(.36);h.position.y=2;s.add(h);const a=new THREE.Mesh(CG.box,br);a.scale.set(.18,.9,.18);a.position.set(.5,1.6,0);a.rotation.z=-.9;s.add(a);for(const dx of [-.18,.18]){const l=new THREE.Mesh(CG.box,br);l.scale.set(.22,.8,.22);l.position.set(dx,.4,0);s.add(l);}
for(const [dx,dz] of [[-3,0],[3,0],[0,-3],[0,3]]){const ai=new THREE.Mesh(new THREE.SphereGeometry(1,12,6,0,TAU,0,Math.PI/2),mc('#dfe4ea',{rough:.95}));ai.scale.set(1.1,.35,1.1);ai.position.set(-58+dx,0,-17+dz);world.add(ai);}}
for(const [x,z,r] of [[-63,-26,Math.PI/2],[-63,-21,Math.PI/2],[-53,-26,-Math.PI/2],[-53,-21,-Math.PI/2],[-63,-10,Math.PI/2],[-53,-10,-Math.PI/2]])bancarella(x,z,r,9);
{for(const [x,z] of [[-62.5,-4],[-60.5,-4]]){box(x,0,z,.7,.72,.7,mc('#e8e4dc',{rough:.5}),{collide:true});sedia(x-.6,z,Math.PI/2);sedia(x+.6,z,-Math.PI/2);}
plane(2.4,.4,new THREE.MeshStandardMaterial({map:signTex('CAFFÈ DEL TEATRO',512,72,'#3a2a1a','#f2e2b0','bold 36px Georgia, serif'),roughness:.4}),-65.98,3.2,-4,Math.PI/2);plane(1.6,1.4,new THREE.MeshStandardMaterial({color:'#ffd690',emissive:new THREE.Color('#ffb860'),emissiveIntensity:.7}),-65.98,1.3,-6,Math.PI/2);glowAt(-65.6,1.3,-6,1.6,0xffc070,true);}
{const ex=-51,ez=-3;box(ex,0,ez,1.6,2.2,1.4,mc('#3a5a3a',{rough:.6}));const rf=new THREE.Mesh(new THREE.ConeGeometry(1.4,.7,4),mc('#2a3a2a'));rf.rotation.y=Math.PI/4;rf.position.set(ex,2.55,ez);world.add(rf);
for(let i=0;i<8;i++)box(ex-.6+(i%4)*.4,1+Math.floor(i/4)*.45,ez+.72,.3,.38,.02,mc(rpick(rn,['#e8d8a0','#c83a30','#3a6ab0','#f2f0ea','#e8a040'])),{collide:false});plane(1.4,.3,mat(texSign('GIORNALI','#e8dcc0','#2a2a2a')),ex,2.05,ez+.71);}
{const iron=mc('#2a2a30',{rough:.4,metal:.8});for(let i=0;i<4;i++){const g=new THREE.Group();g.position.set(-43.3,0,-8-i*1.1);g.rotation.y=Math.PI/2;world.add(g);for(const dx of [-.5,.5]){const w=new THREE.Mesh(new THREE.TorusGeometry(.32,.03,6,16),iron);w.position.set(dx,.33,0);g.add(w);}
const b=new THREE.Mesh(CG.box,mc(rpick(rn,['#2a2a30','#5a1e1e','#1e3a5a'])));b.scale.set(1,.05,.05);b.position.y=.6;g.add(b);}wall(-43.7,-11.8,-42.9,-7.4);}
{let z=-34;while(z<-6.5){const d=Math.min(rr2(rn,5,7),-6-z);casa(-35,z+d/2,10,d,rr2(rn,7,10),P2());z+=d;}casa(-42,-40,16,8,9,P2());
plane(2.2,.4,new THREE.MeshStandardMaterial({map:signTex('FORNO',384,64,'#6a2a1a','#f2e2b0','bold 38px Georgia, serif'),roughness:.4}),-40.02,2.8,-14,-Math.PI/2);plane(1.4,1.3,new THREE.MeshStandardMaterial({color:'#ffc070',emissive:new THREE.Color('#ff9a40'),emissiveIntensity:.9}),-40.02,1.3,-16,-Math.PI/2);glowAt(-40.4,1.3,-16,2,0xffa850,true);
chimneySmoke(-36,10,-15,0xe8e4dc);
const sm=mc('#e6eaf0',{rough:.95});for(const [r,y] of [[.5,.45],[.36,1.15],[.25,1.66]]){const s=new THREE.Mesh(new THREE.SphereGeometry(r,16,10),sm);s.position.set(-42.6,y,-25);world.add(s);}box(-42.6,1.64,-24.72,.06,.06,.28,mat('#e8802a'),{collide:false});wall(-43,-25.4,-42.2,-24.6);}
for(const [x,z] of [[-36,8.3],[-46,8.3],[-56,8.3],[-66,8.3],[-76,8.3],[-50.5,-30],[-65.5,-30],[-50.5,-14],[-65.5,-14],[-40.4,-28],[-40.4,-6]])lampione(x,z,3.4);
for(const z of [3.6,5.8])ciclista(-82,-34,z,rpick(rn,['#3a3a4a','#5a3a2a','#2a3a4a']),rn()*20);
wall(-93,-44,-30,-43.5);AUTOY=false;liftFrom(from);}
function buildModena(){clearWorld();CITYSTYLE='modena';R=mulberry(1947);setEnv('nebbia');onTitle=false;
ground(90,90,texSnow(),0,-10,40,40);
[[0,4,3,10],[-3.5,-3,9,2.6],[4,-9,3,16],[7,-18,12,2.6],[-8,-13,12,2.4]].forEach(([x,z,w,d])=>{const t=texDirt().clone();t.needsUpdate=true;t.repeat.set(w/2,d/2);const me=new THREE.Mesh(new THREE.PlaneGeometry(w,d),mat(t));me.rotation.x=-Math.PI/2;me.position.set(x,.01,z);world.add(me);});
for(const [x,z,w,d] of [[60,-10,50,90],[-60,-10,50,90],[0,-70,120,50],[0,45,120,40]]){const t=texFurrowSnow().clone();t.needsUpdate=true;t.repeat.set(w/8,d/8);const f=new THREE.Mesh(new THREE.PlaneGeometry(w,d),mat(t));f.rotation.x=-Math.PI/2;f.position.set(x,.02,z);world.add(f);}
for(let z=-42;z<22;z+=rr(4,6.5)){const t=treeG('pioppo',rr(.9,1.25));t.position.set(33.5+rr(-.4,.4),0,z);world.add(t);const u=treeG(R()<.5?'pioppo':'spoglio',rr(.9,1.2));if(z<-44)world.add(u);}
for(let x=-30;x<32;x+=rr(4,6.5)){const t=treeG('pioppo',rr(.9,1.25));t.position.set(x,0,-43.5+rr(-.4,.4));world.add(t);}
for(const [x,z,ry] of [[50,-30,.3],[-48,-62,-.4],[22,-68,0],[-112,16,1.2],[58,25,-.8]]){const c=casale(rr(7,9),rr(5,7),rr(4.6,5.6),pick(['#e0c898','#d8b888','#e6d2a8']));c.position.set(x,0,z);c.rotation.y=ry;c.userData.glow.opacity=.7;world.add(c);}
const pst=texSlabs().clone();pst.needsUpdate=true;pst.repeat.set(6,1);box(0,0,11,18,.4,3,mat(pst),{collide:false});box(0,.4,12.45,18,.03,.12,mc('#e8e2d0'),{collide:false});
const trk=ground(100,2.6,texDirt(),0,14.1,40,1,.012);trk.material.color.set('#7a746c');
for(let x=-50;x<50;x+=.9)box(x,0,14.1,.22,.05,2.2,mc('#4a3a2c'),{collide:false});
box(0,0,13.4,100,.12,.12,mc('#9a9aa2',{rough:.35,metal:1}),{collide:false});box(0,0,14.8,100,.12,.12,mc('#9a9aa2',{rough:.35,metal:1}),{collide:false});
building(0,19.5,18,4,7,'#c89a6a');occluders.pop();roofGable(0,19.5,18,4,7,1.4,'#c89a6a');
plane(4.2,.8,new THREE.MeshStandardMaterial({map:signTex('MODENA',512,96,'#1e2a4a','#f2ecdc','bold 60px Georgia, serif'),roughness:.4}),0,5.4,17.45,Math.PI);
{const cf=new THREE.Mesh(new THREE.CircleGeometry(.5,28),mc('#f4efe2',{rough:.4}));cf.position.set(4.5,5.4,17.44);cf.rotation.y=Math.PI;world.add(cf);for(const [l,a] of [[.32,.6],[.42,2.2]]){const hnd=new THREE.Mesh(CG.box,mc('#1a1a1a'));hnd.scale.set(.03,l,.01);hnd.geometry=CG.box;const g=new THREE.Group();g.position.set(4.5,5.4,17.43);g.rotation.z=a;hnd.position.y=l/2;g.add(hnd);world.add(g);}}
const iron=mc('#2e3a34',{rough:.45,metal:1});for(let x=-7.5;x<=7.5;x+=3){const c=new THREE.Mesh(CG.cyl,iron);c.scale.set(.13,3.9,.13);c.position.set(x,4.3,12.2);world.add(c);const br=new THREE.Mesh(CG.box,iron);br.scale.set(.06,.06,1.6);br.position.set(x,3.95,11.55);br.rotation.x=.5;world.add(br);obstacles.push({x0:x-.15,x1:x+.15,z0:12.05,z1:12.35});}
const cano=plane(18.4,3.6,mc('#4a4a50',{rough:.6}),0,4.3,11.3);cano.rotation.x=Math.PI/2;cano.userData.noCast=true;box(0,4.05,9.5,18.4,.3,.05,mc('#d8d0bc'),{collide:false});
plane(2.4,.42,new THREE.MeshStandardMaterial({map:signTex('MODENA',384,68,'#1e2a4a','#f2ecdc','bold 42px Georgia, serif'),roughness:.4}),0,3.55,9.6,Math.PI);
for(const x of [-5.5,5.5]){box(x,.4,11.9,1.6,.42,.45,mat(texSlat()),{collide:false});}
{const cart=new THREE.Group();cart.position.set(-7.6,.4,11.6);world.add(cart);const bd=new THREE.Mesh(CG.box,mat(texWood()));bd.scale.set(1.4,.1,.8);bd.position.y=.4;cart.add(bd);for(const s of [-1,1]){const w=new THREE.Mesh(new THREE.TorusGeometry(.22,.04,6,16),iron);w.position.set(0,.22,s*.42);cart.add(w);}
for(let i=0;i<3;i++){const v=new THREE.Mesh(CG.box,cm(pick(['#6a4a2a','#4a3a2a','#7a5a3a']),{k:'leather'}));v.scale.set(.5,.22,.32);v.position.set(-.35+i*.36,.56+(i===1?.22:0),0);cart.add(v);}}
for(const x of [-4.6,4.6])lampione(x,6.6);
const MODC=['#e2c48e','#d89a5a','#e6c890','#c8784a','#e0b070'];
for(const [cx,w,h,c] of [[-13.6,5,6.4,MODC[1]],[-19,5.6,7.4,MODC[2]],[-24.6,5,6,MODC[3]]]){building(cx,-3.5,w,6,h,c);roofGable(cx,-3.5,w,6,h,1.7,c);const ch=box(cx+w*.25,h,-4.2,.45,2.4,.45,mc('#b8a888'),{collide:false});chimneySmoke(cx+w*.25,h+2.6,-4.2,0xd0d0d4);}
building(-8,-3,5,5,4,'#e2c48e');roofGable(-8,-3,5,5,4,1.5,'#e2c48e');chimneySmoke(-7,6.4,-3.6);box(-7,4,-3.6,.4,2,.4,mc('#b8a888'),{collide:false});
portico(-27.1,-5.5,1.5,-.5,3.1,'#e8d6b0');
for(const [x,txt,bg] of [[-13.6,'FORNO','#6a2a1a'],[-19,'ALIMENTARI','#1e3a2a'],[-24.6,'OSTERIA','#3a2a4a']]){plane(2.4,.4,new THREE.MeshStandardMaterial({map:signTex(txt,384,64,bg,'#f2e2b0','bold 38px Georgia, serif'),roughness:.4}),x,2.75,-.44);
plane(1.6,1.3,new THREE.MeshStandardMaterial({color:'#ffd690',emissive:new THREE.Color('#ffb860'),emissiveIntensity:.7}),x-.9,1.25,-.44);plane(.9,2,mc('#3a2618'),x+1.1,1,-.44);glowAt(x-.9,1.2,-.1,1.6,0xffc070,true);}
for(const x of [-10,-15.5,-21.5])lampione(x,2.4,3);lampione(-1.6,-6.6);lampione(5.8,-13.4);
{const sl=new THREE.Group();sl.position.set(-5.2,0,.9);sl.rotation.y=.3;world.add(sl);for(const s of [-1,1]){const r=new THREE.Mesh(CG.box,mc('#6a4a30'));r.scale.set(.05,.1,1.1);r.position.set(s*.2,.12,0);sl.add(r);}const tp=new THREE.Mesh(CG.box,mat(texSlat()));tp.scale.set(.46,.04,.9);tp.position.y=.2;sl.add(tp);}   // uno slittino appoggiato
building(-14,-16,6,5,4.5,'#e8d0a0');roofGable(-14,-16,6,5,4.5,1.6,'#e8d0a0');
plane(3,.5,new THREE.MeshStandardMaterial({map:signTex('SCUOLA ELEMENTARE',512,84,'#2a3a5a','#f2ecdc','bold 40px Georgia, serif'),roughness:.4}),-14,3.5,-13.47);plane(1.2,2,mat(texDoorPCI()),-14,1,-13.47);
{const b=new THREE.Mesh(new THREE.CylinderGeometry(.08,.18,.22,10),mc('#8a6a3a',{rough:.35,metal:.8}));b.position.set(-14,7,-13.9);world.add(b);box(-14,6.2,-13.9,.06,.7,.06,mc('#3a2a20'),{collide:false});}
building(-24.5,-14,6,8,6.5,'#dac8a8',false,{plain:true,stone:true});roofGable(-24.5,-14,6,8,6.5,2.2,'#dac8a8',true);
{const r=new THREE.Mesh(new THREE.CircleGeometry(.6,16),new THREE.MeshStandardMaterial({color:'#ffd690',emissive:new THREE.Color('#ffb050'),emissiveIntensity:.6}));r.position.set(-24.5,5,-9.97);world.add(r);plane(1.3,2.4,mc('#3a2618'),-24.5,1.2,-9.97);}
building(-20,-18.6,2.4,2.4,10,'#d0bc98',false,{plain:true,stone:true});occluders.pop();
{const bm=mc('#c8b494');for(const [dx,dz,ry] of [[0,1.21,0],[0,-1.21,Math.PI],[1.21,0,Math.PI/2],[-1.21,0,-Math.PI/2]])plane(.7,1.2,mc('#16121a'),-20+dx,9,-18.6+dz,ry);box(-20,10,-18.6,2.7,.25,2.7,bm,{collide:false});
const sp=new THREE.Mesh(new THREE.ConeGeometry(1.75,2.6,4),mat(texRoof()));sp.rotation.y=Math.PI/4;sp.position.set(-20,11.55,-18.6);world.add(sp);const bell=new THREE.Mesh(new THREE.CylinderGeometry(.14,.34,.45,12),mc('#8a6a3a',{rough:.35,metal:.8}));bell.position.set(-20,9,-18.6);world.add(bell);}
farmhouse(13,-23.5,8,6,6.5,'#dcc08a');roofGable(13,-23.5,8,6,6.5,2.2,'#dcc08a');box(15,6.5,-24.2,.5,2.6,.5,mc('#b8a888'),{collide:false});chimneySmoke(15,9.3,-24.2);
{const st=mc('#a8a090',{rough:.9});const w=new THREE.Mesh(new THREE.CylinderGeometry(.7,.75,.8,16,1,true),st);w.material.side=THREE.DoubleSide;w.position.set(6.6,.4,-21.6);world.add(w);const wt=new THREE.Mesh(new THREE.CylinderGeometry(.6,.6,.05,16),mc('#1a2228',{rough:.1}));wt.position.set(6.6,.6,-21.6);world.add(wt);
for(const s of [-1,1])box(6.6+s*.62,.8,-21.6,.1,1.2,.1,mc('#5a4030'),{collide:false});box(6.6,2,-21.6,1.4,.1,.1,mc('#5a4030'),{collide:false});const bk=new THREE.Mesh(new THREE.CylinderGeometry(.13,.1,.2,10),mc('#6a6a70',{metal:1,rough:.4}));bk.position.set(6.6,1.4,-21.6);world.add(bk);wall(5.8,-22.4,7.4,-20.8);}
{const c=new THREE.Group();c.position.set(18.6,0,-17.5);c.rotation.y=.4;world.add(c);const wd=mat(texWood());const bd=new THREE.Mesh(CG.box,wd);bd.scale.set(2.4,.12,1.3);bd.position.y=.75;c.add(bd);
for(const s of [-1,1]){const sd=new THREE.Mesh(CG.box,wd);sd.scale.set(2.4,.35,.06);sd.position.set(0,.98,s*.65);c.add(sd);const w=new THREE.Mesh(new THREE.TorusGeometry(.5,.06,6,20),mc('#4a3a2a'));w.position.set(-.3,.5,s*.72);c.add(w);const hb=new THREE.Mesh(new THREE.CylinderGeometry(.08,.08,.1,8),mc('#3a2a20'));hb.rotation.x=Math.PI/2;hb.position.set(-.3,.5,s*.74);c.add(hb);
const sh=new THREE.Mesh(CG.box,wd);sh.scale.set(2,.07,.07);sh.position.set(2,.45,s*.4);sh.rotation.z=.25;c.add(sh);}
const hay=new THREE.Mesh(CG.sph,flatM('#c8a858'));hay.scale.set(2.2,.7,1.2);hay.position.y=1;c.add(hay);obstacles.push({x0:17,x1:21,z0:-18.6,z1:-16.4});}
{const lg=mc('#7a5a3a',{rough:.95});for(let r=0;r<3;r++)for(let i=0;i<6-r;i++){const l=new THREE.Mesh(new THREE.CylinderGeometry(.13,.13,1.1,8),lg);l.rotation.x=Math.PI/2;l.position.set(17.3+i*.27+r*.13,.13+r*.24,-22.5);world.add(l);}wall(17.1,-23.1,19,-21.9);}
for(const [x,z] of [[22.5,-22.5],[25.5,-27]]){const p=pagliaio();p.position.set(x,0,z);world.add(p);obstacles.push({x0:x-1.2,x1:x+1.2,z0:z-1.2,z1:z+1.2});}
const bm=texBrick().clone();bm.needsUpdate=true;bm.repeat.set(4,3);box(2,0,-29,9,5,5,mat(bm),{occlude:true});roofGable(2,-29,9,5,5,2,'#a4503a');
{const sh=new THREE.Shape();sh.moveTo(-2.5,-.05);sh.lineTo(6.5,-.05);sh.lineTo(6.5,5);sh.lineTo(-2.5,5);sh.closePath();for(const cx of [-.8,2,4.8]){const ho=new THREE.Path();ho.moveTo(cx-1.1,0);ho.lineTo(cx+1.1,0);ho.lineTo(cx+1.1,2.7);ho.absarc(cx,2.7,1.1,0,Math.PI,false);ho.lineTo(cx-1.1,0);sh.holes.push(ho);}
const ft=texBrick().clone();ft.needsUpdate=true;ft.repeat.set(.45,.6);const f=new THREE.Mesh(new THREE.ExtrudeGeometry(sh,{depth:.35,bevelEnabled:false,curveSegments:10}),mat(ft));f.position.set(0,0,-26.5);world.add(f);
for(const cx of [-.8,2,4.8]){plane(2.2,3.8,mc('#1a1210',{rough:1}),cx,1.9,-26.47);const h=new THREE.Mesh(CG.box,flatM('#c8a858'));h.scale.set(1.9,cx===2?.9:1.7,.3);h.position.set(cx,cx===2?.45:.85,-26.35);world.add(h);}}
const fm=mat(texWood());const yx0=10,yx1=18,yz0=-14,yz1=-6;
box((yx0+yx1)/2,0,yz0,8,.7,.15,fm);box((yx0+yx1)/2,0,yz1,8,.7,.15,fm);box(yx1,0,(yz0+yz1)/2,.15,.7,8,fm);box(yx0,0,yz0+1.6,.15,.7,3.2,fm);box(yx0,0,yz1-1.6,.15,.7,3.2,fm);
for(let x=yx0;x<=yx1;x+=1)for(const z of [yz0,yz1])box(x,0,z,.12,.95,.12,fm,{collide:false});
box(16.5,0,-12.6,1.8,1.2,1.4,mat(texWood()));roofGable(16.5,-12.6,1.8,1.4,1.2,.5,'#8a5a3a');
for(let z=10;z>-36;z-=5){if(z===-15)continue;treeAt(z%10?'spoglio':'pioppo',-3,z+rr(-1,1),rr(.9,1.15));}
for(let x=-16;x<26;x+=5)treeAt('pioppo',x,-36+rr(-1,1),rr(.95,1.2));
for(const z of [-31.5,-33,-34.5]){for(let x=20;x<=29;x+=1.5){box(x,0,z,.08,1.3,.08,mc('#5a4636'),{collide:false});const v=new THREE.Mesh(CG.cyl,mc('#4a3828'));v.scale.set(.05,.9,.05);v.position.set(x+.3,1.1,z);v.rotation.z=.6;world.add(v);}box(24.5,1.15,z,9,.02,.02,mc('#3a3a3a'),{collide:false});wall(19.8,z-.1,29.2,z+.1);}
for(let i=0;i<5;i++){const c=new THREE.Mesh(new THREE.CylinderGeometry(.6,.6,1,14),mat('#c8a860'));c.rotation.z=Math.PI/2;c.position.set(rr(27,28.5),.6,rr(-29,-19));const s=new THREE.Mesh(new THREE.CylinderGeometry(.62,.62,.98,14,1,false,0,Math.PI),mc('#e2e6ec'));s.rotation.z=Math.PI/2;c.add(s);s.position.set(0,0,0);world.add(c);}
wall(-30,22,30,23);wall(-30,-40,30,-39);wall(-31,-40,-30,2);wall(-31,9,-30,23);wall(30,-40,31,23);
modenaCitta();modenaDettagli();modenaLontana();SLHILL=slittaHill();
for(const [x,y,z] of [[-9.2,1.8,-.45],[-6.8,1.8,-.45],[10,1.6,-20.46],[16,4.1,-20.46],[-15.7,2,-13.45],[-12.3,2,-13.45]]){plane(.6,.7,mat('#ffcf6a',{basic:true}),x,y,z);glowAt(x,y,z+.3,1.4,0xffc060,true);}
TERRAIN='snow';TZ=[[-27.1,-5.5,-.5,1.5,'stone'],[-9,9,9.5,12.5,'stone'],[-1.5,1.5,-1,9,'dirt'],[-8,1,-4.3,-1.7,'dirt'],[2.5,5.5,-17,-1,'dirt'],[1,13,-19.3,-16.7,'dirt'],[-14,-2,-14.2,-11.8,'dirt'],[-3,7,-30,-26.5,'dirt']];
soundscape([{k:'hen',at:[14,.4,-10],r:.6},{k:'bell',at:[-20,9,-18.6],r:.025,ref:5},{k:'crow',r:.05}]);loopAt(-13.6,1.2,0,'murmur');
snowfall(300);breath();snowPrints();chatter(.15);fogBanks(QK==='basso'?6:12);
ambient('vento');
}
function buildPiazza(){clearWorld();CITYSTYLE='modena';R=mulberry(1225);setEnv('snowNight');onTitle=false;
ground(30,52,texSnow(),0,-10,15,26);
const MOD=['#c8784a','#d89a5a','#e0b070','#b8603a','#d8a878','#c88a60'];
for(const side of [-1,1]){let z=15;while(z>-30){const L=rr(4,6);building(side*12,z-L/2,6,L,rr(8,11),pick(MOD),true);z-=L;}
for(let pz=12;pz>-25;pz-=2.6)box(side*7.6,0,pz,.45,3.2,.45,mat('#e8d8c0'));
for(let pz=12;pz>-22.4;pz-=2.6){const a=new THREE.Mesh(new THREE.TorusGeometry(1.08,.16,6,16,Math.PI),mc('#e8d8c0'));a.rotation.y=Math.PI/2;a.position.set(side*7.6,2.1,pz-1.3);world.add(a);}   // gli archi del portico
box(side*8.3,3.2,-6.5,1.9,.35,38,mat('#d8c8b0'),{collide:false});
for(let pz=11,i=0;pz>-25;pz-=5.2,i++){glowAt(side*8.3,2.8,pz,1.9,0xffc070,true);if(i%2)continue;const l=plight(0xffb060,1,9);l.position.set(side*8.3,2.6,pz);world.add(l);}
for(let i=0;i<16;i++)glowAt(side*8.9,rr(4.6,9),rr(-28,13),1.1,0xffc860);}
building(-3,-28,12,5,8,'#e6d6b4',true,{plain:true,stone:true});
{const sh=new THREE.Shape();sh.moveTo(-6.3,0);sh.lineTo(6.3,0);sh.lineTo(0,3.2);sh.lineTo(-6.3,0);const gab=new THREE.Mesh(new THREE.ExtrudeGeometry(sh,{depth:5.2,bevelEnabled:false}),mat('#e6d6b4'));gab.position.set(-3,8,-30.6);world.add(gab);
const cor=mat('#f2e6c8',{rough:.7});box(-3,7.85,-25.4,12.6,.3,.5,cor,{collide:false});for(const s of [-1,1]){const e=box(-3+s*3.15,8+1.6,-25.38,7.1,.24,.45,cor,{collide:false});e.rotation.z=-s*Math.atan2(3.2,6.3);}
for(const s of [-1,1]){const r=new THREE.Mesh(new THREE.BoxGeometry(7.2,.12,5.6),mat(texRoof()));r.position.set(-3+s*3.1,9.62,-28);r.rotation.z=-s*Math.atan2(3.2,6.3);world.add(r);}
for(const x of [-8.6,-5.4,-.6,2.6])box(x,0,-25.35,.6,7.85,.4,cor,{collide:false});}
const rose=new THREE.Mesh(new THREE.CircleGeometry(1,12),mat('#ffcf6a',{basic:true}));rose.position.set(-3,6.4,-25.44);world.add(rose);glowAt(-3,6.4,-25.1,3,0xffc060,true);
plane(2,3,mat('#ffb860',{basic:true}),-3,1.5,-25.46);glowAt(-3,1.4,-25.1,3.4,0xffa850);
building(6,-28,2.6,2.6,18,'#ddd0b4',true,{plain:true,stone:true});occluders.pop();
{const bm=mat('#ccc0a4',{rough:.7});box(6,18,-28,2.4,3,2.4,bm,{collide:false});for(const [dx,dz,ry] of [[0,1.21,0],[0,-1.21,Math.PI],[1.21,0,Math.PI/2],[-1.21,0,-Math.PI/2]]){plane(.9,1.6,mat('#16121a'),6+dx,19.6,-28+dz,ry);const ar=new THREE.Mesh(new THREE.TorusGeometry(.45,.08,6,12,Math.PI),bm);ar.position.set(6+dx*1.01,20.4,-28+dz*1.01);ar.rotation.y=ry;world.add(ar);}
box(6,21,-28,2.7,.25,2.7,bm,{collide:false});const bell=new THREE.Mesh(new THREE.CylinderGeometry(.18,.42,.55,14),mat('#8a6a3a',{rough:.35,metal:.8}));bell.position.set(6,19.7,-28);world.add(bell);}
const spire=new THREE.Mesh(new THREE.ConeGeometry(1.5,6,8),mat('#bfb398'));spire.position.set(6,24.25,-28);world.add(spire);glowAt(6,21,-26.7,2.2,0xffd890,true);
plane(3.6,.6,mat(texSign('CASA DEL POPOLO','#8a2a24','#ffffff',112)),8.97,3.95,-14,-Math.PI/2);plane(1.4,2.2,mat('#ffb860',{basic:true}),8.97,1.1,-14,-Math.PI/2);glowAt(8.6,1.3,-14,2.6,0xffa850,true);
const bulbs=[],COLS=[0xffd36a,0xff6a5a,0x7ac8ff,0x9aff8a];
for(const lz of [5,-3,-11,-19])for(let i=0;i<=16;i++){const t=i/16;bulbs.push(glowAt(-7.6+15.2*t,4.6-Math.sin(Math.PI*t)*1.1,lz,.6,COLS[i%4]));}
{const tm=new THREE.MeshStandardMaterial({color:'#2a5034',roughness:.9,flatShading:true,envMapIntensity:.3});for(let i=0;i<6;i++){const r=1.95-i*.3,c=new THREE.Mesh(new THREE.ConeGeometry(r,1.6,11,1),tm);c.position.set(0,1.3+i*.85,-16);c.rotation.y=i*.7;const p=c.geometry.attributes.position;for(let j=0;j<p.count;j++){if(p.getY(j)<-.7){const k=1+(j%2?.12:-.06);p.setX(j,p.getX(j)*k);p.setZ(j,p.getZ(j)*k);p.setY(j,p.getY(j)-(j%2?.12:0));}}c.geometry.computeVertexNormals();world.add(c);}
box(0,0,-16,.35,.8,.35,mat('#5a4636'));wall(-1.9,-17.9,1.9,-14.1);const star=new THREE.Mesh(new THREE.OctahedronGeometry(.3,0),mat('#ffe080',{basic:true}));star.position.set(0,6.5,-16);world.add(star);hooks.push(()=>{star.rotation.y=now()*.8;});}
for(let i=0;i<22;i++){const h=.6+R()*5.2,r=1.8*(1-(h-.4)/6)+.05,a=R()*TAU;bulbs.push(glowAt(Math.cos(a)*r,h+.4,-16+Math.sin(a)*r,.45,COLS[i%4]));}
glowAt(0,6.6,-16,1.4,0xfff0a0,true);
hooks.push(()=>{const tt=now();bulbs.forEach((b,i)=>b.material.opacity=.5+.45*Math.sin(tt*3+i*1.7));});
box(-4.5,0,-7.6,.9,.7,.9,mat('#2a2426'));glowAt(-4.5,.95,-7.6,2.4,0xff7a30,true);const bl=plight(0xff8a40,1.4,6);bl.position.set(-4.5,1.2,-7.6);world.add(bl);
hooks.push(dt=>{bl.intensity=1.1+Math.random()*.5;if(Math.random()<dt*3)puff(-4.5+rr(-.2,.2),1,-7.6,.3,0xd8d0c8,2,.7,.1,0);if(Math.random()<dt*4)puff(-4.5,.9,-7.6,.08,0xffb040,.8,rr(1,2),rr(-.4,.4),rr(-.4,.4),true);});
for(const [x,z] of [[-5,4],[4.6,-20]]){box(x,0,z,2,1,1,mat(texWood()));box(x,2.2,z,2.4,.12,1.6,mat(texAwning()),{collide:false});for(const dx of [-1,1])box(x+dx,0,z+.6,.08,2.2,.08,mat('#6a4a30'),{collide:false});glowAt(x,2,z+.7,1.4,0xffd38a,true);for(let i=0;i<4;i++)box(x-.6+i*.4,1,z,.25,.2,.25,mat(pick(['#d23a30','#e9c46a','#7a9a5a','#f2f0ea'])),{collide:false});}
for(const [x,z] of [[3.2,-6.5],[5.4,-8],[2.6,-9.8]]){const m=new THREE.Mesh(new THREE.SphereGeometry(.7,14,8,0,TAU,0,Math.PI/2),mat('#cdd4dc',{rough:.95}));m.scale.set(1.4,.8,.9);m.position.set(x,0,z);world.add(m);obstacles.push({x0:x-.8,x1:x+.8,z0:z-.5,z1:z+.5});}
const sm=mat('#d4dae2',{rough:.95});for(const [r,y] of [[.55,.5],[.4,1.25],[.28,1.8]]){const s=new THREE.Mesh(new THREE.SphereGeometry(r,18,12),sm);s.position.set(-2.2,y,3);world.add(s);}
box(-2.2,1.78,3.3,.07,.07,.3,mat('#e8802a'),{collide:false});box(-2.2,2.05,3,.42,.06,.42,mat('#1a1a1a'),{collide:false});box(-2.2,2.1,3,.28,.3,.28,mat('#1a1a1a'),{collide:false});
obstacles.push({x0:-2.7,x1:-1.7,z0:2.5,z1:3.5});
for(const [x,z] of [[-4.8,10],[4.8,10],[-5.2,-12],[4.8,-23.5]])lampione(x,z,3.2);
wall(-9.4,15,9.4,16);wall(-9.4,-26,9.4,-25.5);
TERRAIN='snow';TZ=[[-9.4,-6.8,-26,15,'stone'],[6.8,9.4,-26,15,'stone']];loopAt(-4.5,1,-7.6,'fire');loopAt(0,1.6,-8,'murmur');soundscape([{k:'choir',at:[-3,1.8,-23.7],r:.35,ref:3},{k:'bell',at:[6,20,-28],r:.02,ref:6}]);
snowfall(420);breath();snowPrints();
ambient('vento');
}
function buildKitchen(){clearWorld();world.userData.interior=true;R=mulberry(12);setEnv('kitchen');onTitle=false;
ground(7.4,7.4,texCotto(),0,0,3,3).material.roughness=.6;const wm=mat(texInside());
box(-3.7,0,0,.4,3,7.4,wm,{occlude:true});box(3.7,0,0,.4,3,7.4,wm,{occlude:true});box(0,0,-3.7,7.4,3,.4,wm);wall(-4,3.6,4,3.9);
box(2.6,0,-2.9,1.2,1.1,.9,mat('#3a3434'));box(2.6,1.1,-3.1,.25,1.9,.25,mat('#2a2426'),{collide:false});
plane(.6,.35,mat('#ff8a30',{basic:true}),2.6,.45,-2.44);glowAt(2.6,.5,-2.3,1.8,0xff8a30,true);
const sl=plight(0xff9a50,1.2,7);sl.position.set(2.4,.9,-2);world.add(sl);
box(0,0,-.5,1.8,.75,1.1,mat(texWood()));box(0,.75,-.5,.14,.32,.14,mat('#e8d090',{basic:true}),{collide:false});glowAt(0,1.15,-.5,1.8,0xffd38a,true);
const tl=plight(0xffd8a0,1,6);tl.position.set(0,1.6,-.5);world.add(tl);
hooks.push(dt=>{sl.intensity=1+Math.random()*.4;tl.intensity=.9+Math.sin(now()*3)*.05;if(Math.random()<dt*1.5)puff(2.6,3,-3.1,.2,0xb0a8a0,1.4,.6,0,0);});
box(-1.2,0,-.5,.5,.45,.5,mat('#6a4a30'));box(1.2,0,-.5,.5,.45,.5,mat('#6a4a30'));
box(-2.6,0,-2.5,1.4,.5,2,mat('#e8e0d0'));box(-2.6,.5,-2.2,1.42,.08,1.4,mat('#b8402a'),{collide:false});box(-2.6,.5,-3.2,1,.15,.4,mat('#f4f0e8'),{collide:false});
plane(1.4,1,mat('#2a3a6a',{basic:true}),0,1.8,-3.48);box(0,1.25,-3.45,1.6,.08,.15,mat('#6a4a30'),{collide:false});glowAt(0,1.8,-3.3,1.6,0x6a8ad0);
hooks.push(dt=>{if(Math.random()<dt*4)puff(rr(-.6,.6),2.3,-3.47,.06,0xffffff,1.2,-.5,rr(-.1,.1),0);});
TERRAIN='stone';loopAt(2.6,.5,-2.9,'fire');soundscape([{k:'tick',at:[-3.3,2,-3.3],r:1.6}]);
for(let i=0;i<5;i++)box(-1.6+i*.35,1.6,-3.35,.22,.3,.22,mat(pick(['#c8a060','#a85a3a','#e8dcc0'])),{collide:false});box(-.9,1.55,-3.35,2,.06,.3,mat('#6a4a30'),{collide:false});
}
