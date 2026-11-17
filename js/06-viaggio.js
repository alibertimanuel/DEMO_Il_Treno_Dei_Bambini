"use strict";
const smoothK=(a,b,v)=>{const t=clamp((v-a)/(b-a),0,1);return t*t*(3-2*t);};
const ICO=new THREE.IcosahedronGeometry(1,1),CONE7=new THREE.ConeGeometry(.5,1,7),HALFS=new THREE.SphereGeometry(1,22,10,0,TAU,0,Math.PI/2);
const FLATM={};function flatM(c){return FLATM[c]||(FLATM[c]=new THREE.MeshStandardMaterial({color:new THREE.Color(c),flatShading:true,roughness:.92,envMapIntensity:.2}));}
function treeG(kind,s){const g=new THREE.Group(),bark=mc('#4a3a2c',{rough:1});
const add=(geo,m,x,y,z,sx,sy,sz)=>{const me=new THREE.Mesh(geo,m);me.position.set(x,y,z);me.scale.set(sx,sy,sz);g.add(me);return me;};
if(kind==='pioppo'){add(CG.cyl,bark,0,2.4,0,.22,2.4,.22);add(ICO,flatM(rpick(R,['#5a6a3e','#66703e','#7a7444'])),0,4.6,0,1,3.2,1);}
else if(kind==='quercia'){add(CG.cyl,bark,0,1.8,0,.4,1.8,.4);for(let i=0;i<4;i++)add(ICO,flatM(rpick(R,['#4e5e38','#5a6640','#6a6a3a'])),rr(-.8,.8),2.5+rr(0,1),rr(-.8,.8),rr(1.2,1.8),rr(1,1.4),rr(1.2,1.8));}
else if(kind==='cipresso'){add(CG.cyl,bark,0,.8,0,.2,.8,.2);add(CONE7,flatM('#3a4a32'),0,3.2,0,1.1,5,1.1);}
else{add(CG.cyl,bark,0,2.6,0,.2,2.6,.2);   // spoglio d'inverno: rami nudi verso il cielo
for(let i=0;i<7;i++){const b=add(CG.cyl,bark,0,1.5+i*.28,0,.07,1.2+R()*.9,.07);b.rotation.set(Math.PI+rr(-.95,.95),0,rr(-.95,.95));}}
g.scale.setScalar(s||1);return g;}
function pagliaio(){const g=new THREE.Group();const p=new THREE.Mesh(CG.cyl,mc('#5a4a38'));p.scale.set(.08,3.4,.08);p.position.y=3.4;g.add(p);
const c=new THREE.Mesh(new THREE.ConeGeometry(1.3,2.6,9),flatM('#c4a058'));c.position.y=1.3;g.add(c);const t=new THREE.Mesh(new THREE.CylinderGeometry(1.25,1.3,.5,9),flatM('#b08c48'));t.position.y=.25;g.add(t);return g;}
function casale(w,d,h,col){const g=new THREE.Group();const wm=mc(col,{rough:.95}),dk=mc('#2a2420'),rf=mc('#9a4a32',{rough:.8}),rh=h*.38;
const b=new THREE.Mesh(CG.box,wm);b.scale.set(w,h,d);b.position.y=h/2;g.add(b);
const sl=Math.hypot(w/2+.3,rh),an=Math.atan2(rh,w/2+.3);for(const s of [-1,1]){const r=new THREE.Mesh(CG.box,rf);r.scale.set(sl,.12,d+.5);r.position.set(s*(w/4+.15),h+rh/2,0);r.rotation.z=-s*an;g.add(r);}
const tri=new THREE.Shape();tri.moveTo(-w/2,0);tri.lineTo(w/2,0);tri.lineTo(0,rh);tri.closePath();for(const s of [-1,1]){const t=new THREE.Mesh(new THREE.ShapeGeometry(tri),wm);t.position.set(0,h,s*d/2);if(s<0)t.rotation.y=Math.PI;g.add(t);}
const ch=new THREE.Mesh(CG.box,mc('#b8a888'));ch.scale.set(.4,1,.4);ch.position.set(w*.25,h+rh*.6,0);g.add(ch);
for(const s of [-1,1])for(let i=0;i<3;i++)for(let f=0;f<2;f++){const win=new THREE.Mesh(CG.box,dk);win.scale.set(.5,.62,.05);win.position.set((i-1)*w*.3,h*(.3+f*.42),s*(d/2+.01));g.add(win);}
const door=new THREE.Mesh(CG.box,mc('#4a3020'));door.scale.set(.8,1.5,.06);door.position.set(w*.12,.75,d/2+.02);g.add(door);
const m=new THREE.SpriteMaterial({map:glowTex,color:0xffb860,transparent:true,depthWrite:false,blending:THREE.AdditiveBlending,opacity:0});const sp=new THREE.Sprite(m);sp.scale.set(1.6,1.6,1);sp.position.set(-w*.3,h*.3,d/2+.1);g.add(sp);g.userData.glow=m;return g;}
function texFurrows(k){return T('furrow'+k,()=>hd(256,256,(g,gb,w,h,rnd)=>{const base=k?'#6a7a3e':'#7a5a3a';g.fillStyle=base;g.fillRect(0,0,w,h);gb.fillStyle='#808080';gb.fillRect(0,0,w,h);
for(let y=0;y<h;y+=16){g.fillStyle=shade(base,-.3);g.fillRect(0,y,w,6);g.fillStyle=shade(base,.15);g.fillRect(0,y+8,w,4);gb.fillStyle='#202020';gb.fillRect(0,y,w,6);gb.fillStyle='#e0e0e0';gb.fillRect(0,y+8,w,4);}
blot(g,w,h,rnd,20,k?'90,110,50':'110,80,50',10,50,.25);grainPx(g,w,h,16,rnd);},.06));}
const texCarPanel=()=>T('carpanel',()=>hd(256,256,(g,gb,w,h,rnd)=>{planks(g,gb,w,h,rnd,5,'#6e4628',true);
g.strokeStyle='#3a2410';g.lineWidth=7;rrect(g,18,18,w-36,h-36,8);g.stroke();g.strokeStyle='rgba(255,214,160,.22)';g.lineWidth=2;rrect(g,24,24,w-48,h-48,6);g.stroke();
gb.strokeStyle='#f0f0f0';gb.lineWidth=9;rrect(gb,18,18,w-36,h-36,8);gb.stroke();g.fillStyle='#2e1c0c';g.fillRect(0,0,w,7);g.fillStyle='rgba(255,226,180,.3)';g.fillRect(0,0,w,2);grainPx(g,w,h,10,rnd);},.05));
const texCarPaint=()=>T('carpaint',()=>hd(256,256,(g,gb,w,h,rnd)=>{g.fillStyle='#c4bf9e';g.fillRect(0,0,w,h);blot(g,w,h,rnd,16,'110,104,70',10,50,.12);blot(g,w,h,rnd,10,'255,250,230',10,40,.1);
for(let i=0;i<90;i++){g.fillStyle='rgba(60,50,30,'+(.015+rnd()*.03)+')';g.fillRect(0,rnd()*h,w,1+rnd()*2);}blot(gb,w,h,rnd,30,'255,255,255',3,10,.2);grainPx(g,w,h,8,rnd);},.02));
const texSlat=()=>T('slat',()=>hd(256,64,(g,gb,w,h,rnd)=>{planks(g,gb,w,h,rnd,1,'#8a5c32',false);g.fillStyle='rgba(255,220,170,.12)';g.fillRect(0,h*.35,w,h*.25);grainPx(g,w,h,8,rnd);},.03));
const texTrack=()=>T('track',()=>hd(128,128,(g,gb,w,h,rnd)=>{g.fillStyle='#6e6862';g.fillRect(0,0,w,h);blot(g,w,h,rnd,40,'40,36,32',3,9,.4);blot(g,w,h,rnd,40,'160,150,140',3,8,.3);blot(gb,w,h,rnd,60,'255,255,255',2,6,.4);
g.fillStyle='#4a3a2c';g.fillRect(8,40,w-16,40);gb.fillStyle='#d0d0d0';gb.fillRect(8,40,w-16,40);for(let i=0;i<14;i++){g.fillStyle='rgba(30,20,10,.3)';g.fillRect(8,42+rnd()*36,w-16,1);}grainPx(g,w,h,14,rnd);},.08));
function signTex(txt,w,h,bg,fg,font){const c=document.createElement('canvas');c.width=w;c.height=h;const g=c.getContext('2d');g.fillStyle=bg;g.fillRect(0,0,w,h);g.strokeStyle=fg;g.lineWidth=4;g.strokeRect(7,7,w-14,h-14);
g.fillStyle=fg;g.font=font;g.textAlign='center';g.textBaseline='middle';g.fillText(txt,w/2,h/2+2);const t=new THREE.CanvasTexture(c);t.anisotropy=ANISO;return t;}
function instParts(parts,places){for(const p of parts){const im=new THREE.InstancedMesh(p.geo,p.mat,places.length),m=new THREE.Matrix4();places.forEach((M,i)=>{m.multiplyMatrices(M,p.m);im.setMatrixAt(i,m);});im.instanceMatrix.needsUpdate=true;im.frustumCulled=false;world.add(im);}}
const pmx=(x,y,z,sx,sy,sz,rx,ry)=>new THREE.Matrix4().compose(new THREE.Vector3(x,y,z),new THREE.Quaternion().setFromEuler(new THREE.Euler(rx||0,ry||0,0)),new THREE.Vector3(sx,sy,sz));
function buildTrain(){clearWorld();world.userData.interior=true;R=mulberry(51);setEnv('train');onTitle=false;
const ZF=1.15,ZB=-19.15,L=ZF-ZB,ZC=(ZF+ZB)/2,XW=1.87,BAYS=[];for(let k=0;k<8;k++)BAYS.push(-2.1-k*2.2);
const PH={train:{lamp:.5,em:.35,sh:[.16,.16],col:0xfff0d0,out:0,glass:.14},trainDusk:{lamp:.7,em:.6,sh:[0,.42],col:0xffa860,out:0,glass:.16},trainNight:{lamp:1.5,em:1.4,sh:[0,0],col:0xffd8a0,out:.55,glass:.32}};
const TR={bays:BAYS,speed:11,want:11,dk:0,cur:Object.assign({},PH.train,{sh:[.16,.16],col:new THREE.Color(PH.train.col)}),tgt:PH.train,stationG:null,stationA:[]};
TR.phase=(k,dur)=>{setEnv(k,dur);TR.tgt=PH[k];};
ground(3.6,L,texWood(),0,ZC,2,11);
const pm1=mat(texCarPanel()),pmt=mat(texCarPaint()),dkw=mc('#3a2614',{rough:.5}),frm=mc('#4a2e18',{rough:.45}),brass=mc('#b08a48',{rough:.3,metal:1});
const edges=[ZF];for(const zc of BAYS)edges.push(zc+.65,zc-.65);edges.push(ZB);
for(const s of [-1,1]){
for(let z=ZF;z>ZB+.01;z-=1.1){const w=Math.min(1.1,z-ZB);box(s*XW,0,z-w/2,.14,.9,w,pm1,{collide:false});}
for(let i=0;i<edges.length;i+=2){const z0=edges[i],z1=edges[i+1];box(s*XW,.9,(z0+z1)/2,.14,1.05,z0-z1,pmt,{collide:false});}
box(s*XW,1.95,ZC,.14,.7,L,pmt,{collide:false});
for(const y of [0,.86])box(s*(XW-.08),y,ZC,.05,y?.05:.13,L,dkw,{collide:false});}
wall(-2.3,ZB-.3,-1.7,ZF+.3);wall(1.7,ZB-.3,2.3,ZF+.3);wall(-2,ZF-.1,2,ZF+.4);wall(-2,ZB-.4,2,ZB+.1);
const glass=new THREE.MeshStandardMaterial({color:'#b8ccd0',transparent:true,opacity:.14,roughness:.04,metalness:.1,envMapIntensity:1.2,depthWrite:false,side:THREE.DoubleSide});
const curtains=[];
BAYS.forEach((zc,k)=>{for(const s of [-1,1]){const x=s*(XW-.07),open=k===7&&s===1;
box(s*(XW-.17),.86,zc,.22,.06,1.42,frm,{collide:false});box(x,1.9,zc,.09,.07,1.42,frm,{collide:false});
for(const dz of [-.68,.68])box(x,.9,zc+dz,.1,1.05,.06,frm,{collide:false});
if(!open){const gl=plane(1.3,1,glass,s*(XW-.03),1.42,zc,s*Math.PI/2);gl.userData.noCast=true;box(x,1.38,zc,.07,.05,1.3,frm,{collide:false});
const st=new THREE.Mesh(CG.box,cm('#3a2618',{k:'leather'}));st.scale.set(.02,.32,.05);st.position.set(s*(XW-.1),1.1,zc);world.add(st);}
else box(x,.9,zc,.07,.12,1.3,frm,{collide:false});
for(const dz of [-.55,.55]){const c=new THREE.Mesh(CG.cyl,cm(k%2?'#7a3a2c':'#5a5a3a',{k:'cloth'}));c.scale.set(.05,.9,.1);c.position.set(s*(XW-.13),1.93,zc+dz);world.add(c);if(open)curtains.push(c);}}});
const warn=new THREE.MeshStandardMaterial({map:signTex('È PERICOLOSO SPORGERSI',512,64,'#f0ece0','#1e2a50','bold 29px Georgia, serif'),roughness:.3});
for(const zc of [BAYS[0],BAYS[3],BAYS[7]])for(const s of [-1,1])plane(.62,.08,warn,s*(XW-.075),.72,zc,-s*Math.PI/2);
const arch=(w,len,y,m)=>{const g=new THREE.PlaneGeometry(w,len,14,1);g.rotateX(Math.PI/2);const p=g.attributes.position,r=4.48;for(let i=0;i<p.count;i++){const x=p.getX(i);p.setY(i,Math.sqrt(r*r-x*x)-(r-.42));}g.computeVertexNormals();const me=new THREE.Mesh(g,m);me.position.y=y;world.add(me);return me;};
arch(3.74,L,2.64,mc('#d6cfb0',{rough:.85})).position.z=ZC;
for(let z=ZF-.05;z>ZB;z-=2.2)arch(3.74,.08,2.62,dkw).position.z=z-.05;
box(-1.18,0,ZB,1.4,2.65,.14,pmt);box(1.18,0,ZB,1.4,2.65,.14,pmt);box(0,2.08,ZB,.96,.57,.14,pmt,{collide:false});
const dm=mat(texWood());box(0,0,ZB-.02,.9,2.08,.06,dm,{collide:false});plane(.5,.62,mc('#1a1c24',{rough:.1}),0,1.5,ZB+.02);box(.32,1.02,ZB+.03,.1,.03,.04,brass,{collide:false});
plane(.9,.2,new THREE.MeshStandardMaterial({map:signTex('III CLASSE',384,84,'#1e2a40','#e8d8a8','bold 46px Georgia, serif'),roughness:.4}),0,2.35,ZB+.08);
{const sh=new THREE.Shape(),r=4.48;sh.moveTo(-1.87,2.64);for(let i=0;i<=16;i++){const x=-1.87+i*3.74/16;sh.lineTo(x,2.64+Math.sqrt(r*r-x*x)-(r-.42));}sh.lineTo(1.87,2.64);const lg=new THREE.ShapeGeometry(sh);const a=new THREE.Mesh(lg,pmt);a.position.z=ZB+.07;world.add(a);const b=new THREE.Mesh(lg,pmt);b.rotation.y=Math.PI;b.position.z=ZF;b.userData.noCast=true;world.add(b);}
const fw=plane(3.74,2.65,pmt,0,1.325,ZF,Math.PI);fw.userData.noCast=true;plane(.9,2.08,dm,0,1.04,ZF-.01,Math.PI);   // la parete di testa dietro la camera: visibile solo da dentro
for(const s of [-1,1]){for(let z=ZF-.05;z>ZB;z-=2.2)box(s*1.6,2.08,z-.05,.42,.05,.05,brass,{collide:false});
for(const dx of [1.42,1.55,1.68]){const r=new THREE.Mesh(new THREE.CylinderGeometry(.013,.013,L-.3,6),brass);r.rotation.x=Math.PI/2;r.position.set(s*dx,dx===1.42?2.17:2.13,ZC);world.add(r);}}
const lug=(x,z)=>{const g=new THREE.Group();g.position.set(x,2.15,z);g.rotation.y=rr(-.12,.12);world.add(g);const t=R(),add=(m,sx,sy,sz,px,py,pz,geo)=>{const me=new THREE.Mesh(geo||CG.box,m);me.scale.set(sx,sy,sz);me.position.set(px||0,py||0,pz||0);g.add(me);return me;};
if(t<.4){const h=rr(.16,.24),w=rr(.42,.6);add(cm(rpick(R,['#6a4a2a','#4a3a2a','#7a5a3a','#5a3a30','#3a3a3a']),{k:'leather',r:.6}),.34,h,w,0,h/2);for(const k of [-.28,.28])add(cm('#2a1e14',{k:'leather'}),.35,h+.01,.03,0,h/2,k*w);add(brass,.05,.04,.12,-.17,h*.6);}
else if(t<.7){add(cm(rpick(R,PAL.cloth),{k:'cloth'}),.34,.24,.42,0,.12,0,CG.sph);add(cm(rpick(R,PAL.cloth),{k:'cloth'}),.1,.12,.1,0,.25,0,CG.sph);}
else if(t<.85){add(mc('#a88a50',{rough:.95}),.3,.2,.3,0,.2,0,CG.cyl);add(cm(rpick(R,PAL.light),{k:'cloth'}),.31,.06,.31,0,.22,0,CG.sph);}
else{const h=rr(.18,.26);add(mc('#b0946a',{rough:.95}),.32,h,.38,0,h/2);add(mc('#d8ccb0'),.33,h+.01,.012,0,h/2);add(mc('#d8ccb0'),.33,.012,.39,0,h+.004);}};
BAYS.forEach(zc=>{for(const s of [-1,1]){let z=zc+.85;while(z>zc-1){const w=rr(.4,.65);if(R()<.75)lug(s*1.58,z-w/2);z-=w+rr(.05,.25);}}});
const sl=mat(texSlat(),{rough:.5}),iron=mc('#2a2a2e',{rough:.55,metal:1}),parts=[],P_=(geo,mt,m)=>parts.push({geo,mat:mt,m});
for(const z of [-.17,-.06,.05,.16])P_(CG.box,sl,pmx(0,.405,z,1.12,.035,.1));
for(const y of [.56,.69,.82,.95])P_(CG.box,sl,pmx(0,y,-.24-(y-.42)*.12,1.12,.1,.03,-.12));
for(const x of [-.55,.55]){P_(CG.box,iron,pmx(x,.2,-.02,.04,.4,.42));P_(CG.box,iron,pmx(x,.72,-.28,.04,.64,.05,-.12));}
P_(CG.box,sl,pmx(0,1.05,-.31,1.16,.045,.07));
const places=[];BAYS.forEach(zc=>{for(const s of [-1,1]){places.push(pmx(s*1.165,0,zc-.74,1,1,1,0,0),pmx(s*1.165,0,zc+.74,1,1,1,0,Math.PI));obstacles.push({x0:s>0?.6:-1.75,x1:s>0?1.75:-.6,z0:zc-1.08,z1:zc+1.08});}});
instParts(parts,places);
TR.seats=[];BAYS.forEach((zc,k)=>{for(const s of [-1,1])for(const f of [1,-1])for(const xi of [.88,1.45])TR.seats.push({k,s,f,x:s*xi,z:zc-f*.79});});
const peel=mc('#e07a28',{rough:.6});for(let i=0;i<7;i++){const p=new THREE.Mesh(new THREE.CircleGeometry(.035,7),peel);p.rotation.x=-Math.PI/2;p.position.set(rr(-.45,.45),.006,rr(-17,-1));world.add(p);}
{const t=new THREE.Mesh(CG.box,mc('#ece4d0'));t.scale.set(.09,.004,.06);t.position.set(.22,.006,-6.4);t.rotation.y=.5;world.add(t);const c=new THREE.Mesh(new THREE.CylinderGeometry(.04,.035,.08,10),mc('#8a8a90',{rough:.4,metal:1}));c.position.set(-.35,.04,-11.2);world.add(c);}
const globe=new THREE.MeshStandardMaterial({color:'#fff4dc',emissive:new THREE.Color('#ffd890'),emissiveIntensity:.35,roughness:.3});const lamps=[];
for(const z of [-3.2,-7.6,-12,-16.4]){const g=new THREE.Group();g.position.set(0,2.98,z);world.add(g);const rod=new THREE.Mesh(CG.cyl,brass);rod.scale.set(.025,.3,.025);g.add(rod);
const cap=new THREE.Mesh(new THREE.ConeGeometry(.12,.08,14),brass);cap.position.y=-.31;g.add(cap);const gl=new THREE.Mesh(CG.sph,globe);gl.scale.setScalar(.17);gl.position.y=-.4;gl.userData.noCast=true;g.add(gl);
const l=plight(0xffd8a0,.6,7);l.position.set(0,2.45,z);world.add(l);lamps.push({l,g,sp:glowAt(0,2.58,z,.5,0xffd8a0)});}
const shafts=[];BAYS.forEach(zc=>{for(const s of [-1,1])shafts.push({m:shaft(s*1.02,.95,zc,.8,2.5,0,-s*.62,0xfff0d0,.16,true).material,s});});
const ZMIN=-162,ZMAX=90,PER=ZMAX-ZMIN,OUT=[];
const mover=(o,z,wrap)=>{o.position.z=z;world.add(o);OUT.push({o,wrap});return o;};
const gt=texGrassGround().clone();gt.needsUpdate=true;gt.repeat.set(14,30);const gm=mat(gt);gm.color.set('#d8d8c8');
for(const s of [-1,1]){const g=new THREE.Mesh(new THREE.PlaneGeometry(116,PER),gm);g.rotation.x=-Math.PI/2;g.position.set(s*60,-.75,(ZMIN+ZMAX)/2);world.add(g);}
const tt_=texTrack().clone();tt_.needsUpdate=true;tt_.repeat.set(1,PER/.9);const tm=mat(tt_);
for(const x of [0,4]){const g=new THREE.Mesh(new THREE.PlaneGeometry(3.2,PER),tm);g.rotation.x=-Math.PI/2;g.position.set(x,-.74,(ZMIN+ZMAX)/2);world.add(g);}
const rail=mc('#8a8a92',{rough:.35,metal:1});for(const x of [3.28,4.72])box(x,-.74,(ZMIN+ZMAX)/2,.07,.1,PER,rail,{collide:false});
const insul=mc('#e8e4d8',{rough:.2});for(let z=ZMIN;z<ZMAX;z+=18){const g=new THREE.Group();g.position.x=-3.7;const p=new THREE.Mesh(CG.cyl,mc('#4a3a2a'));p.scale.set(.18,6.1,.18);p.position.y=5.35;g.add(p);
const cb=new THREE.Mesh(CG.box,mc('#4a3a2a'));cb.scale.set(1.1,.08,.08);cb.position.y=5.05;g.add(cb);for(const dx of [-.45,0,.45]){const i=new THREE.Mesh(CG.cyl,insul);i.scale.set(.06,.12,.06);i.position.set(dx,5.22,0);g.add(i);}mover(g,z);}
for(const dx of [-.45,0,.45]){const w=new THREE.Mesh(new THREE.CylinderGeometry(.01,.01,PER,4),mc('#2a2a2a'));w.rotation.x=Math.PI/2;w.position.set(-3.7+dx,5.2,(ZMIN+ZMAX)/2);world.add(w);}
for(let i=0;i<8;i++){const s=i%2?1:-1,f=new THREE.Mesh(new THREE.PlaneGeometry(rr(18,30),rr(26,44)),mat(texFurrows(i%3?0:1)));f.material.map.repeat.set(3,5);f.rotation.x=-Math.PI/2;const g=new THREE.Group();g.add(f);f.position.set(s*rr(14,40),-.73,0);mover(g,ZMIN+i*PER/8);}
const kinds=['spoglio','spoglio','spoglio','pioppo','pioppo','quercia','quercia','cipresso'];
for(let i=0;i<46;i++){const s=R()<.5?-1:1,t=treeG(pick(kinds),rr(.8,1.25));t.position.set(s*rr(6.5,46),-.75,0);t.rotation.y=R()*TAU;mover(t,rr(ZMIN,ZMAX),o=>{o.position.x=(o.position.x>0?1:-1)*rr(6.5,46);});}
for(let i=0;i<9;i++){const t=treeG('pioppo',rr(.95,1.3));t.position.set(-15+rr(-.6,.6),-.75,0);mover(t,ZMIN+i*rr(5,8));}
const glows=[];for(let i=0;i<5;i++){const s=i%2?1:-1,c=casale(rr(6,9),rr(5,7),rr(4.2,5.6),rpick(R,['#d8c4a0','#cdb894','#e0cfae','#c8a888']));c.position.set(s*rr(20,44),-.75,0);c.rotation.y=rr(-.3,.3)+(s>0?-Math.PI/2:Math.PI/2);glows.push(c.userData.glow);
const p=pagliaio();p.position.set(rr(-5,5),0,rr(-6,-4));c.add(p);mover(c,ZMIN+i*PER/5+rr(0,20),o=>{o.position.x=(o.position.x>0?1:-1)*rr(20,44);});}
for(let i=0;i<10;i++){const s=i%2?1:-1,h=new THREE.Mesh(HALFS,flatM(rpick(R,['#7a8466','#6e7a5e','#868a70','#7a7e6a'])));h.scale.set(rr(30,52),rr(9,20),rr(35,65));h.position.set(s*rr(78,118),-1,0);mover(h,ZMIN+i*PER/10);}
const patchM=new THREE.MeshBasicMaterial({map:glowTex,color:0xffc070,transparent:true,depthWrite:false,blending:THREE.AdditiveBlending,opacity:0});
BAYS.forEach(zc=>{for(const s of [-1,1]){const p=new THREE.Mesh(new THREE.PlaneGeometry(2.2,1.8),patchM);p.rotation.x=-Math.PI/2;p.position.set(s*2.9,-.7,zc);world.add(p);}});
const TL=50,tun=new THREE.Group();tun.visible=false;world.add(tun);{const bt=texBrick().clone();bt.needsUpdate=true;bt.repeat.set(TL/2,2.2);const bm=mat(bt);bm.color.set('#4e443e');
for(const s of [-1,1]){const w=new THREE.Mesh(new THREE.PlaneGeometry(TL,4.4),bm);w.rotation.y=-s*Math.PI/2;w.position.set(s*2.65,1.45,0);tun.add(w);}
const vt=bt.clone();vt.needsUpdate=true;vt.repeat.set(3,TL/2);const vg=new THREE.CylinderGeometry(2.65,2.65,TL,16,1,true,Math.PI/2,Math.PI);vg.rotateX(Math.PI/2);const v=new THREE.Mesh(vg,mat(vt,{}));v.material.side=THREE.BackSide;v.material.color.set('#443a34');v.position.y=3.65;tun.add(v);
const sh=new THREE.Shape();sh.moveTo(-9,-.8);sh.lineTo(9,-.8);sh.lineTo(9,7.4);sh.lineTo(-9,7.4);sh.closePath();const ho=new THREE.Path();ho.moveTo(-2.65,-.8);ho.lineTo(2.65,-.8);ho.lineTo(2.65,3.65);ho.absarc(0,3.65,2.65,0,Math.PI,false);ho.lineTo(-2.65,-.8);sh.holes.push(ho);
const st=texSlabs().clone();st.needsUpdate=true;st.repeat.set(.22,.22);const pm=mat(st);
for(const e of [1,-1]){const f=new THREE.Mesh(new THREE.ShapeGeometry(sh,24),pm);f.position.z=e*TL/2;if(e<0)f.rotation.y=Math.PI;tun.add(f);
const ring=new THREE.Mesh(new THREE.TorusGeometry(2.85,.22,6,24,Math.PI),mc('#a89a84'));ring.position.set(0,3.65,e*(TL/2+.1));tun.add(ring);
const cor=new THREE.Mesh(CG.box,mc('#a89a84'));cor.scale.set(18.4,.4,.5);cor.position.set(0,7.4,e*(TL/2+.05));tun.add(cor);
for(const s of [-1,1]){const m=new THREE.Mesh(HALFS,flatM('#6a7458'));m.scale.set(9,8,14);m.position.set(s*13,-.8,e*(TL/2-12));tun.add(m);}}}
let tunT=32;
let pf=0,ck=.5;
hooks.push(dt=>{TR.speed+=(TR.want-TR.speed)*Math.min(1,dt*.55);const dz=TR.speed*dt;
for(const m of OUT){m.o.position.z+=dz;if(m.o.position.z>ZMAX){m.o.position.z-=PER;if(m.wrap)m.wrap(m.o);}}
gt.offset.y+=dz/(PER/30);tt_.offset.y+=dz/.9;
if(TR.stationG){TR.stationG.position.z+=dz;for(const a of TR.stationA)a.z+=dz;if(TR.stationG.position.z>110){world.remove(TR.stationG);for(const a of TR.stationA){world.remove(a.g);actors.splice(actors.indexOf(a),1);}TR.stationG=null;TR.stationA=[];}}
if(!tun.visible){tunT-=dt;if(tunT<=0&&!envTw&&TR.speed>9&&!TR.stationG&&!interacting){tun.visible=true;tun.position.z=-150;tunT=85;}}
else{tun.position.z+=dz;if(tun.position.z-TL/2>ZMAX)tun.visible=false;}
const pz=P?P.z:-9,inside=tun.visible?Math.min(pz-(tun.position.z-TL/2),tun.position.z+TL/2-pz):-9,dk=smoothK(-1.5,2.5,inside);
if(dk>.02&&TR.dk<=.02){noise(.6,300,.06,'lowpass');for(const a of actors)if(!a.isPlayer&&a.def&&!a.def.adult&&R()<.35)emote(a,R()<.5?'excl':'ask');}
TR.dk=dk;if(!envTw&&envNow){AMB.intensity=envNow.ai*(1-.7*dk);HEMI.intensity=envNow.hi*(1-.85*dk);SUN.intensity=envNow.si*(1-dk);}
const c=TR.cur,g=TR.tgt,kk=Math.min(1,dt*.45);c.lamp+=(g.lamp-c.lamp)*kk;c.em+=(g.em-c.em)*kk;c.out+=(g.out-c.out)*kk;c.glass+=(g.glass-c.glass)*kk;c.sh[0]+=(g.sh[0]-c.sh[0])*kk;c.sh[1]+=(g.sh[1]-c.sh[1])*kk;c.col.lerp(_tc.set(g.col),kk);
const lampK=c.lamp+dk*.5,tt=now();for(const L_ of lamps){L_.l.intensity=lampK*.62*(.94+Math.random()*.06);L_.g.rotation.z=Math.sin(tt*1.7)*.03;L_.sp.material.opacity=Math.min(.9,.25+c.em*.45);}
globe.emissiveIntensity=c.em+dk*.4;glass.opacity=c.glass+dk*.15;patchM.opacity=c.out*(TR.speed>1?1:.8);for(const m of glows)m.opacity=c.out*1.3;
for(const s_ of shafts){s_.m.uniforms.uOp.value=c.sh[s_.s>0?1:0]*(1-dk);s_.m.uniforms.uCol.value.copy(c.col);}
for(const cu of curtains)cu.rotation.x=Math.sin(tt*3.1+cu.position.z)*.12*Math.min(1,TR.speed/11);
if(TR.speed>1){ck-=dt;if(ck<=0){ck=1.05*11/TR.speed;noise(.07,650,.05,'bandpass');setTimeout(()=>noise(.07,560,.045,'bandpass'),150);}
pf-=dt;if(pf<=0&&c.out<.3){pf=rr(.6,1.4);const s=R()<.5?-1:1;puff(s*rr(2.3,3.6),rr(2.6,3.4),ZB-1,rr(.8,1.4),0xe8e4dc,3,.15,s*.3,TR.speed*.8);}}});
TR.station=()=>{const g=new THREE.Group();world.add(g);TR.stationG=g;const pl=new THREE.Mesh(CG.box,mat(texSlabs()));pl.scale.set(4,.7,46);pl.position.set(4.2,-.4,-12);g.add(pl);
const ed=new THREE.Mesh(CG.box,mc('#d8d0bc'));ed.scale.set(.3,.06,46);ed.position.set(2.32,-.03,-12);g.add(ed);
for(let z=-30;z<6;z+=6){const c=new THREE.Mesh(CG.cyl,mc('#3a4a3a',{metal:1,rough:.5}));c.scale.set(.12,3.6,.12);c.position.set(5.6,3.55,z);g.add(c);}
const roof=new THREE.Mesh(CG.box,mc('#5a4a40'));roof.scale.set(3.2,.12,40);roof.position.set(4.9,3.6,-12);roof.rotation.z=.12;g.add(roof);
const lampP=new THREE.Mesh(CG.sph,new THREE.MeshBasicMaterial({color:0xfff0c8}));lampP.scale.setScalar(.22);lampP.position.set(4.9,3.2,-17);g.add(lampP);
const bn=new THREE.Mesh(CG.box,mc('#6a4a30'));bn.scale.set(.5,.45,1.6);bn.position.set(5.8,.22,-21);g.add(bn);
const defs=[C.mamma,C.adulto,C.mamma,C.rosa,C.mamma];defs.forEach((d,i)=>{const a=actor(vary(d),2.85+(i%2)*.55,-15.4-i*.85,{name:'',solid:false,fx:-1,fz:.15});a.watch=false;TR.stationA.push(a);});
hooks.push(()=>{for(const a of TR.stationA)if(!a.waveT&&Math.random()<.02)wave(a,1.6);});return g;};
TR.throwCoat=()=>{const m=new THREE.Mesh(CG.box,cm('#45577a',{k:'wool'}));m.scale.set(.5,.08,.42);world.add(m);const a=TR.stationA[2]||TR.stationA[0];const t0=now(),x0=1.7,y0=1.55,z0=-17.4;
const h=()=>{const k=Math.min(1,(now()-t0)/.9);m.position.set(x0+(a.x-x0)*k,y0+(1.3-y0)*k+Math.sin(k*Math.PI)*.9,z0+(a.z-z0)*k);m.rotation.set(k*5,k*3,k*2);if(k>=1){world.remove(m);hooks.splice(hooks.indexOf(h),1);emote(a,'heart');wave(a,2.5);}};hooks.push(h);};
TERRAIN='wood';ambient('treno');TRAIN=TR;return TR;
}
const _tc=new THREE.Color();let TRAIN=null;   // la carrozza in corsa (per le scene e le prove)
function buildCampagna(){clearWorld();R=mulberry(23);setEnv('trainOut');onTitle=false;
const TX=60,H=(x,z)=>{const az=Math.abs(z);let h=0;if(az>14)h+=Math.pow(Math.min(1,(az-14)/40),1.6)*(7+4*Math.sin(x*.035+z*.02)+3*Math.sin(x*.09-z*.05));
return h;};   // niente più collinetta con la galleria: i binari corrono dritti fino all'orizzonte
const tg=new THREE.PlaneGeometry(320,160,160,80);tg.rotateX(-Math.PI/2);{const p=tg.attributes.position,col=new Float32Array(p.count*3),c=new THREE.Color(),lo=new THREE.Color('#b8b8a0'),hi=new THREE.Color('#7e8a6a');
for(let i=0;i<p.count;i++){const x=p.getX(i),z=p.getZ(i)-30,h=H(x,z);p.setY(i,h);c.copy(lo).lerp(hi,Math.min(1,h/9));col[i*3]=c.r;col[i*3+1]=c.g;col[i*3+2]=c.b;}tg.setAttribute('color',new THREE.BufferAttribute(col,3));tg.computeVertexNormals();}
const gtx=texGrassGround().clone();gtx.needsUpdate=true;gtx.repeat.set(48,24);const tm=mat(gtx);tm.vertexColors=true;const ter=new THREE.Mesh(tg,tm);ter.position.z=-30;world.add(ter);
grass([[-70,-11,50,-2.3],[-70,2.3,50,12]],QK==='basso'?6000:16000,{h:.4});grass([[-90,-16,50,-11]],QK==='basso'?2000:6000,{h:.5});
box(0,-.1,0,320,.12,2.4,mat('#4a4038'),{collide:false});box(0,.02,-.6,320,.08,.12,mat('#8a8a92',{rough:.35,metal:1}),{collide:false});box(0,.02,.6,320,.08,.12,mat('#8a8a92',{rough:.35,metal:1}),{collide:false});
const sleeper=mc('#3a3028');for(let x=-120;x<160;x+=1.1)box(x,-.05,0,.25,.06,2.2,sleeper,{collide:false});
for(let x=-100;x<160;x+=10){box(x,0,-2.6,.14,4.2,.14,mat('#3a3028'),{collide:false});box(x,3.9,-2.6,1,.08,.08,mat('#3a3028'),{collide:false});}
const kinds=['spoglio','spoglio','pioppo','quercia','cipresso'];
for(let i=0;i<70;i++){const x=rr(-110,110),z=R()<.5?rr(-60,-6):rr(6,40),h=H(x,z);if(h>9||Math.abs(z)<8)continue;const t=treeG(pick(kinds),rr(.8,1.3));t.position.set(x,h-.05,z);t.rotation.y=R()*TAU;world.add(t);}
for(let x=-90;x<40;x+=rr(4.5,8)){const t=treeG('pioppo',rr(.9,1.3));t.position.set(x,0,-15.5+rr(-.5,.5));world.add(t);}
for(const [x,z] of [[-30,-24],[22,-28],[-60,22],[8,26]]){const c=casale(rr(6,8),rr(5,7),rr(4.4,5.4),rpick(R,['#d8c4a0','#cdb894','#e0cfae']));c.position.set(x,H(x,z),z);c.rotation.y=rr(-.4,.4);world.add(c);c.userData.glow.opacity=.8;chimneySmoke(x+1.5,H(x,z)+6.4,z,0xc8c8c8);const p=pagliaio();p.position.set(x+rr(5,7),H(x+6,z+3),z+3);world.add(p);}
flock(-60,9,-12,7,3.2);leaves(14,0xd0c0a0);
const tr=makeTrain(5,true);tr.g.position.set(-70,0,0);ambient('vento');return tr;}
function buildShelter(){clearWorld();world.userData.interior=true;R=mulberry(43);setEnv('shelter');onTitle=false;TERRAIN='dirt';
ground(10,10,texDirt(),0,0,5,5);const wm=mat('#5a4a40');
box(-5.2,0,0,.4,3,10.4,wm,{occlude:true});box(5.2,0,0,.4,3,10.4,wm,{occlude:true});box(0,0,-5.2,10,3,.4,wm,{occlude:true});wall(-5,5,5,5.3);
for(const z of [-3.5,-1,1.5])for(const s of [-1,1])box(s*3.6,0,z,1.6,.45,.6,mat(texWood()));
for(let i=0;i<6;i++)box(rr(-4.6,4.6),0,-4.6,.9,.5,.5,mat('#8a7a5a'));
const lights=[];for(const [x,z] of [[-3.6,-3.5],[3.6,1.5],[0,-4.6]]){box(x,.45,z,.08,.25,.08,mat('#f2ecdf'),{collide:false});const l=plight(0xffa850,1.2,7);l.position.set(x,1,z);world.add(l);lights.push(l);glowAt(x,.75,z,1.4,0xffa850,true);}
plane(2.6,.55,mat(texSign('RICOVERO','#e8e4d8','#1a1a1a')),0,2.3,-4.98);
hooks.push(dt=>{lights.forEach(l=>l.intensity=.9+Math.random()*.5);if(Math.random()<dt*.25){shake=.12;boom(.25);for(let i=0;i<4;i++)puff(rr(-4,4),2.8,rr(-4,4),.2,0xb0a090,1.5,-1.2,0,0);}});
}
function buildStation(env,sign){clearWorld();R=mulberry(88);setEnv(env);onTitle=false;
ground(56,7,texConcrete(),0,0,28,4);box(0,-.6,0,56,.6,7,mat('#8a847a'),{collide:false});
ground(80,6,texDirt(),0,5.6,40,3,-.55);box(0,-.5,4.8,80,.1,.12,mat('#9a9aa2'),{collide:false});box(0,-.5,6.4,80,.1,.12,mat('#9a9aa2'),{collide:false});
building(0,-6,56,4,7,'#c8b89a',env==='night');occluders.pop();
plane(5,.8,mat(texSign(sign,'#1e2a4a','#ffffff',128)),0,4.6,-3.98);
for(let x=-24;x<=24;x+=6){box(x,0,-3.3,.2,5.2,.2,mat('#3a3a44'),{collide:false});}
box(0,5.2,-2.4,52,.15,2.4,mat('#4a4a54'),{collide:false});
const clk=plane(.9,.9,mat('#f2ecdf'),6,3.4,-3.97);
for(let x=-18;x<=18;x+=9)box(x,0,-2.6,1.8,.45,.5,mat('#6a4a30'));
wall(-28,-3.6,28,-3.3);wall(-28,3.2,28,3.6);wall(-28.4,-4,-27.8,4);wall(27.8,-4,28.4,4);
for(let i=0;i<8;i++)building(-40+i*11,16,10,6,rr(6,10),pick(NAP));
}
