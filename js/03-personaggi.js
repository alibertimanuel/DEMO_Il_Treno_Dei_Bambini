"use strict";
const CG={sph:new THREE.SphereGeometry(.5,16,12),sphLo:new THREE.SphereGeometry(.5,10,8),cyl:new THREE.CylinderGeometry(.5,.5,1,12),box:new THREE.BoxGeometry(1,1,1),
cap:new THREE.SphereGeometry(.5,28,16,0,TAU,0,Math.PI*.55),skirt:new THREE.CylinderGeometry(.5,.82,1,16,1,true),torso:new THREE.CylinderGeometry(.47,.44,1,14),
limb:new THREE.CylinderGeometry(.5,.42,1,10),cone:new THREE.ConeGeometry(.5,1,10),torus:new THREE.TorusGeometry(.5,.16,8,18)};
for(const k of ['cyl','limb','torso','skirt'])CG[k].translate(0,-.5,0);   // pivot in alto: braccia, gambe e gonne ruotano dalla spalla/anca
const CMAT={};
function cm(col,o){o=o||{};const k=col+'|'+(o.r||'')+'|'+(o.e||'')+'|'+(o.side||'')+'|'+(o.k||'')+'|'+(o.metal||'');if(CMAT[k])return CMAT[k];
const m=new THREE.MeshStandardMaterial({color:new THREE.Color(col),roughness:o.r||.86,metalness:o.metal?.6:0,envMapIntensity:.3,emissive:new THREE.Color(o.e||'#000000'),side:o.side||THREE.FrontSide});
if(o.k){m.map=detTex(o.k);m.bumpMap=bumpFor(m.map);m.bumpScale=m.map.image.__bs;}m.userData.vk=k.slice(k.indexOf('|'));return CMAT[k]=m;}
const VCMAT={};
function vcMat(m){const k=m.userData.vk;if(VCMAT[k])return VCMAT[k];const v=m.clone();v.color.setRGB(1,1,1);v.vertexColors=true;return VCMAT[k]=v;}
const BLUSH=new THREE.MeshStandardMaterial({color:'#e8907a',transparent:true,opacity:.32,roughness:.8,depthWrite:false});
function part(parent,geo,col,x,y,z,sx,sy,sz,o){const m=new THREE.Mesh(geo,o&&o.mat||cm(col,o));m.position.set(x,y,z);m.scale.set(sx,sy,sz);parent.add(m);return m;}
function grp(parent,x,y,z){const g=new THREE.Group();g.position.set(x,y,z);parent.add(g);return g;}
const LATHE=(pts,seg)=>new THREE.LatheGeometry(pts.map(([x,y])=>new THREE.Vector2(x,y)),seg||20);
const HEADP=[[0,0],[.11,.008],[.22,.04],[.32,.1],[.4,.19],[.46,.31],[.495,.46],[.505,.61],[.48,.76],[.41,.88],[.28,.965],[0,1]];
const headR=y=>{y=clamp(y,0,1);for(let i=1;i<HEADP.length;i++)if(y<=HEADP[i][1]){const [r0,y0]=HEADP[i-1],[r1,y1]=HEADP[i];return r0+(r1-r0)*(y-y0)/Math.max(1e-6,y1-y0);}return 0;};
const jawK=y=>clamp((.5-y)/.42,0,1);
CG.head=(()=>{const g=LATHE(HEADP,30),p=g.attributes.position;for(let i=0;i<p.count;i++){const x=p.getX(i),y=p.getY(i),z=p.getZ(i),k=jawK(y);
p.setX(i,x*(1-.13*k));p.setZ(i,z>0?z*(1+.05*k-.05*Math.max(0,Math.abs(x)/.5-.4)*(1-k)):z*(1-.08*k));}g.computeVertexNormals();return g;})();
const SHELL={};
function hairShell(front,back,sb,inf,bump,top){top=top||1;const key=[front,back,sb,inf,bump,top].join('|');if(SHELL[key])return SHELL[key];
const NC=36,NR=11,pos=[],uv=[],idx=[];
const yh=th=>{const f=(1+Math.cos(th))/2;return back+(front-back)*f-sb*Math.exp(-Math.pow((Math.abs(th)-1.2)/.22,2))+.022*Math.sin(th*11)*Math.pow(f,4);};
for(let c=0;c<=NC;c++){const th=-Math.PI+c/NC*TAU,y0=Math.min(top,yh(th)),s=Math.sin(th),co=Math.cos(th);
for(let j=0;j<=NR;j++){const t=j/NR;let y=y0+(top-y0)*t,r=headR(y),zf=1+(co>0&&y<.62?.1*jawK(y):0);
const b=bump?bump*Math.sin(th*7+y*13)*Math.sin(y*17-th*5):0;
if(j===NR&&top>=1){r=0;y=1+inf*.7;}else if(top<1)r=r+inf;else{r=r+inf*(.55+.45*Math.min(1,t*3))+b;y+=inf*.6*t*t;}
pos.push(r*s,y,r*co*zf);uv.push(c/NC,t);}}
for(let c=0;c<NC;c++)for(let j=0;j<NR;j++){const a=c*(NR+1)+j,b2=a+NR+1;idx.push(a,b2,a+1,b2,b2+1,a+1);}
const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(pos,3));g.setAttribute('uv',new THREE.Float32BufferAttribute(uv,2));g.setIndex(idx);g.computeVertexNormals();return SHELL[key]=g;}
CG.trunk=LATHE([[0,0],[.43,0],[.425,.12],[.395,.3],[.415,.5],[.455,.68],[.47,.8],[.44,.9],[.33,.975],[.13,1],[0,1]],22);
const pleatGeo=(t0,tl)=>{const g=new THREE.CylinderGeometry(.5,.82,1,56,2,true,t0,tl);g.translate(0,-.5,0);const p=g.attributes.position;for(let i=0;i<p.count;i++){const x=p.getX(i),y=p.getY(i),z=p.getZ(i),a=Math.atan2(z,x),k=1+.055*Math.sin(a*16)*(-y);p.setX(i,x*k);p.setZ(i,z*k);}g.computeVertexNormals();return g;};
CG.pleat=pleatGeo(0,TAU);CG.hairBack=pleatGeo(Math.PI-1.85,3.7);   // i capelli lunghi scendono dietro e ai lati, il viso resta scoperto
CG.lid=new THREE.SphereGeometry(.5,14,8,0,TAU,0,Math.PI*.5);
CG.band=new THREE.CylinderGeometry(.5,.5,1,22,1,true);CG.apronB=new THREE.CylinderGeometry(.5,.5,1,10,1,true,-.72,1.44);CG.apronL=new THREE.CylinderGeometry(.55,.8,1,14,1,true,-.95,1.9);CG.apronL.translate(0,-.5,0);
CG.brow=new THREE.TorusGeometry(.5,.13,5,12,Math.PI*.62);CG.brow.rotateZ(Math.PI*.19);
CG.hand=(()=>{const g=new THREE.SphereGeometry(.5,10,8);const p=g.attributes.position;for(let i=0;i<p.count;i++){const y=p.getY(i);if(y<0)p.setY(i,y*1.35);}g.computeVertexNormals();return g;})();
const DET={};
function detTex(kind){return DET[kind]||(DET[kind]=hd(128,128,(g,gb,w,h,rnd)=>{
g.fillStyle='#f0f0f0';g.fillRect(0,0,w,h);
if(kind==='cloth'){for(let y=0;y<h;y+=2){g.fillStyle='rgba(0,0,0,'+(.04+rnd()*.03)+')';g.fillRect(0,y,w,1);gb.fillStyle='rgba(0,0,0,.35)';gb.fillRect(0,y,w,1);}for(let x=0;x<w;x+=2){g.fillStyle='rgba(255,255,255,.05)';g.fillRect(x,0,1,h);gb.fillStyle='rgba(255,255,255,.25)';gb.fillRect(x,0,1,h);}blot(g,w,h,rnd,10,'0,0,0',8,26,.05);}
if(kind==='wool'){for(let y=0;y<h;y+=6)for(let x=0;x<w;x+=6){const s=.035+rnd()*.045;g.strokeStyle='rgba(0,0,0,'+s+')';g.lineWidth=1.2;g.beginPath();g.moveTo(x,y);g.lineTo(x+3,y+5);g.lineTo(x+6,y);g.stroke();gb.strokeStyle='rgba(0,0,0,.3)';gb.lineWidth=1.6;gb.beginPath();gb.moveTo(x,y);gb.lineTo(x+3,y+5);gb.lineTo(x+6,y);gb.stroke();}blot(g,w,h,rnd,14,'0,0,0',6,20,.06);}
if(kind==='skin'){blot(g,w,h,rnd,30,'200,120,110',6,22,.06);blot(g,w,h,rnd,20,'255,255,255',4,14,.05);}
if(kind==='hair'){for(let i=0;i<260;i++){const x=rnd()*w,l=20+rnd()*60,y=rnd()*h,dark=rnd()<.6;g.strokeStyle=dark?'rgba(0,0,0,'+(.1+rnd()*.15)+')':'rgba(255,255,255,'+(.08+rnd()*.12)+')';g.lineWidth=.8+rnd();g.beginPath();g.moveTo(x,y);g.quadraticCurveTo(x+rnd()*6-3,y+l/2,x+rnd()*4-2,y+l);g.stroke();gb.strokeStyle=dark?'rgba(0,0,0,.5)':'rgba(255,255,255,.5)';gb.lineWidth=1;gb.beginPath();gb.moveTo(x,y);gb.lineTo(x,y+l);gb.stroke();}}
if(kind==='leather'){blot(g,w,h,rnd,26,'0,0,0',4,18,.08);blot(g,w,h,rnd,12,'255,255,255',3,10,.1);blot(gb,w,h,rnd,30,'0,0,0',3,12,.4);}
grainPx(g,w,h,10,rnd);},kind==='wool'?.05:kind==='hair'?.04:.025));}
const EYEC=['#4a2e1c','#3a2416','#5a3a22','#4a5a3a'];
function buildPerson(d){
const ad=!!d.adult,body=new THREE.Group(),skin=d.skin,skD=shade(skin,-.12),S={k:'skin',r:.62};
const legL=ad?.84:.54,torH=ad?.6:.42,hipW=ad?.17:.13,shW=ad?.36:.28,armL=ad?.64:.44,hr=ad?.148:.163,thick=ad?.11:.085;
const top=d.coat||d.shirt,lower=d.pants||d.shirt,R={body,legL,torH,ad,hr},CL={k:'cloth'},WL={k:'wool'},LE={k:'leather',r:.5};
const topK=d.coat?WL:CL;
const hips=R.hips=grp(body,0,legL,0);
part(hips,CG.sph,lower,0,0,0,hipW*2.3,ad?.2:.16,ad?.22:.17,CL);
if(!d.skirt&&!d.robe&&!d.coat){part(hips,CG.cyl,'#2a2018',0,.085,0,hipW*2.42,.035,ad?.235:.185,LE);part(hips,CG.box,'#b8a060',0,.07,(ad?.118:.093),.04,.028,.01,{r:.35});}
const short=!d.longPants&&!d.robe&&!d.skirt;
R.legs=[-1,1].map(s=>{const L=grp(hips,s*hipW*.55,0,0);part(L,CG.limb,d.skirt?skin:lower,0,0,0,thick*1.25,legL*.5,thick*1.3,d.skirt?S:CL);
if(short)part(L,CG.limb,lower,0,.01,0,thick*1.5,legL*.3,thick*1.55,CL);
const knee=grp(L,0,-legL*.5,0);part(knee,CG.sphLo,d.longPants||d.robe?lower:skin,0,0,0,thick*1.1,thick*1.1,thick*1.15,d.longPants||d.robe?CL:S);
part(knee,CG.limb,d.longPants||d.robe?lower:skin,0,0,0,thick*1.05,legL*.47,thick*1.1,d.longPants||d.robe?CL:S);
if(short&&d.shoes)part(knee,CG.limb,'#d6cfbf',0,-legL*.32,0,thick*1.12,legL*.13,thick*1.15,WL);
let foot;if(d.shoes){foot=grp(knee,0,-legL*.47,0);part(foot,CG.box,'#1c1512',0,-.012-(ad?.02:.015),ad?.045:.035,ad?.105:.088,.02,ad?.25:.19,LE);
part(foot,CG.sph,d.shoes,0,0,ad?.05:.04,ad?.1:.085,ad?.075:.06,ad?.24:.18,LE);if(d.holes)part(foot,CG.sphLo,skD,s*.02,.01,ad?.12:.09,.025,.02,.02,S);}
else{foot=grp(knee,0,-legL*.47,0);part(foot,CG.sph,skin,0,-.012,ad?.04:.032,ad?.085:.07,ad?.045:.038,ad?.22:.17,S);
part(foot,CG.sphLo,skD,0,-.03,ad?.04:.032,ad?.09:.074,.012,ad?.21:.16,S);for(let t=0;t<4;t++)part(foot,CG.sphLo,skin,(t-1.5)*.014-s*.004,-.02,(ad?.14:.11)-Math.abs(t-1)*.006,.016,.018,.02,S);}   // piedi scalzi con le dita
return {L,knee,foot};});
if(d.skirt)R.skirt=part(hips,CG.pleat,d.skirt,0,.07,0,hipW*2.6,legL*(ad?.72:.62),hipW*2.25,{k:'cloth',side:THREE.DoubleSide});
if(d.robe)R.skirt=part(hips,CG.pleat,d.robe,0,.07,0,hipW*2.5,legL*.98,hipW*2.15,{k:'wool',side:THREE.DoubleSide});
if(d.coat&&!d.robe){R.tail=part(hips,CG.pleat,d.coat,0,.09,0,hipW*(d.skirt?2.72:2.3),legL*.44,hipW*(d.skirt?2.36:2.0),{k:'wool',side:THREE.DoubleSide});
for(const s of [-1,1])part(hips,CG.box,shade(d.coat,-.12),s*hipW*.75,-.06,(ad?.135:.105),.1,.08,.012,WL);}
const spine=R.spine=grp(hips,0,.02,0);
const chest=R.chest=part(spine,CG.trunk,top,0,0,0,shW*1.1,torH,ad?.25:.2,topK);R.chestY=torH;
const fz=ad?.122:.097;
if(d.coat){for(const s of [-1,1]){const l=part(spine,CG.box,shade(d.coat,-.1),s*shW*.13,torH*.78,fz+.004,shW*.2,torH*.42,.014,WL);l.rotation.z=s*.32;}
part(spine,CG.box,d.shirt||'#e8e4d8',0,torH*.86,fz-.005,shW*.18,torH*.2,.01,CL).rotation.z=Math.PI/4;
for(let i=0;i<3;i++)part(spine,CG.sphLo,'#2a2220',shW*.06,torH*(.18+i*.17),fz+.006,.024,.024,.012,{r:.4});
part(spine,CG.box,shade(d.coat,-.15),-shW*.28,torH*.6,fz+.002,shW*.22,.012,.012,WL);}
else{for(const s of [-1,1]){const c=part(spine,CG.box,shade(top,.12),s*shW*.12,torH*.96,fz*.82,shW*.24,torH*.12,.016,CL);c.rotation.z=s*-.5;c.rotation.x=-.3;}
for(let i=0;i<3;i++)part(spine,CG.sphLo,shade(top,-.3),0,torH*(.45+i*.15),fz*.98,.016,.016,.01,{r:.4});}
if(d.vest)for(const s of [-1,1])part(spine,CG.box,d.vest,s*shW*.23,torH*.5,fz-.004,shW*.3,torH*.9,.03,WL);
if(d.apron){const AS={k:'cloth',side:THREE.DoubleSide};part(spine,CG.apronB,d.apron,0,torH*.52,0,shW*(d.coat?1.2:1.14),torH*.5,(ad?.25:.2)*(d.coat?1.24:1.04),AS);
part(spine,CG.band,shade(d.apron,-.2),0,torH*.28,0,shW*.93,torH*.06,(ad?.25:.2)*.86,CL);   // cinturino aderente
for(const s of [-1,1])part(spine,CG.box,shade(d.apron,-.2),s*shW*.2,torH*.88,fz*.55,.012,torH*.32,.01,CL).rotation.z=s*-.35;   // spalline
R.apron=d.skirt?part(R.skirt,CG.apronL,d.apron,0,-.02,0,1.06,.72,1.08,AS):part(hips,CG.apronL,d.apron,0,.07,0,hipW*2.4,legL*.62,hipW*1.5,AS);}
const neck=grp(spine,0,torH*.97,0);part(neck,CG.cyl,skin,0,ad?.085:.065,0,ad?.112:.088,ad?.11:.085,ad?.105:.084,S);
if(d.scarf){part(neck,CG.torus,d.scarf,0,.0,0,ad?.2:.16,ad?.2:.16,ad?.28:.22,WL).rotation.x=Math.PI/2;const t=part(neck,CG.box,d.scarf,shW*.16,-.14,fz+.01,.065,.24,.022,WL);t.rotation.z=.12;}
const head=R.head=grp(neck,0,ad?.05:.04,0);
const hm=part(head,CG.head,skin,0,0,0,hr*1.64,hr*2.24,hr*1.9,S);hm.updateMatrixWorld(true);
const RC=new THREE.Raycaster(),_ro=new THREE.Vector3(),_rd=new THREE.Vector3(0,0,-1);
const sZ=(x,y)=>{RC.set(_ro.set(x,y,hr*4),_rd);const h=RC.intersectObject(hm,false);return h.length?h[0].point.z:hr*.9;};
for(const s of [-1,1]){const ex=hr*.8*(1-.13*jawK(.48));part(head,CG.sphLo,skin,s*ex,hr*1.08,-hr*.05,hr*.18,hr*.36,hr*.24,S);part(head,CG.sphLo,skD,s*(ex+hr*.05),hr*1.08,-hr*.02,hr*.07,hr*.2,hr*.12,S);}
part(head,CG.sphLo,skin,0,hr*1.02,sZ(0,hr*1.02)-hr*.05,hr*.15,hr*.4,hr*.2,S).rotation.x=-.22;   // naso
const nb=sZ(0,hr*.86);part(head,CG.sphLo,shade(skin,-.04),0,hr*.86,nb+hr*.01,hr*.24,hr*.17,hr*.16,S);
for(const s of [-1,1])part(head,CG.sphLo,shade(skin,-.35),s*hr*.065,hr*.8,nb+hr*.06,hr*.055,hr*.035,hr*.035,S);
const face=R.face=grp(head,0,0,0),eyeC=/c8a060|b58a4a/.test(d.hair)?'#4a6a8a':EYEC[(skin.charCodeAt(2)+d.hair.charCodeAt(3))%EYEC.length];
R.eyes=[];R.lids=[];
for(const s of [-1,1]){const e=grp(face,s*hr*.3,hr*1.16,sZ(s*hr*.3,hr*1.16)-hr*.07);part(e,CG.sph,'#f2ede4',0,0,0,hr*.29,hr*.28,hr*.2,{r:.25});
part(e,CG.sphLo,eyeC,0,0,hr*.085,hr*.15,hr*.16,hr*.06,{r:.3});part(e,CG.sphLo,'#0e0a08',0,0,hr*.105,hr*.075,hr*.08,hr*.03,{r:.2});
part(e,CG.sphLo,'#ffffff',s*-hr*.03,hr*.04,hr*.12,hr*.035,hr*.035,hr*.02,{r:.1,e:'#ffffff'});
const lid=grp(e,0,0,0);part(lid,CG.lid,shade(skin,-.05),0,0,0,hr*.29,hr*.29,hr*.25,S);part(lid,CG.box,'#2a1a14',0,0,hr*.124,hr*.27,hr*.018,hr*.01,{r:.5}).position.y=0;
lid.rotation.x=-.35;R.eyes.push(e);R.lids.push(lid);}
R.brows=[-1,1].map(s=>part(face,CG.brow,shade(d.hair,.08),s*hr*.3,hr*1.35,sZ(s*hr*.3,hr*1.35)+hr*.03,hr*.3,hr*.17,hr*.1,{r:.9}));
const lipC='#'+new THREE.Color(skin).lerp(new THREE.Color('#a8443e'),.4).getHexString(),mo=R.mouth=grp(face,0,hr*.6,sZ(0,hr*.6)-hr*.025);
R.mouthIn=part(mo,CG.box,'#3a1a18',0,-hr*.02,-hr*.02,hr*.3,hr*.06,hr*.04,{r:.8});
R.lipU=part(mo,CG.sphLo,lipC,0,hr*.025,0,hr*.36,hr*.07,hr*.1,{r:.45});R.lipL=part(mo,CG.sphLo,shade(lipC,.06),0,-hr*.045,-hr*.005,hr*.32,hr*.085,hr*.1,{r:.45});
if(!ad)for(const s of [-1,1])part(face,CG.sphLo,'#e8907a',s*hr*.46,hr*.86,sZ(s*hr*.46,hr*.86)-hr*.03,hr*.22,hr*.13,hr*.08,{mat:BLUSH});
if(d.mustache){part(face,CG.sph,d.mustache,0,hr*.74,sZ(0,hr*.74)-hr*.015,hr*.5,hr*.12,hr*.12,{k:'hair'});}
const hc=d.hair,hs=d.hs,HK={k:'hair',r:.75,side:THREE.DoubleSide},HS=[hr*1.64,hr*2.24,hr*1.9];
if(hs==='bald')part(head,hairShell(.72,.3,.06,.04,0,.64),hc,0,0,0,...HS,HK);   // corona di capelli sulla nuca e sopra le orecchie
else{const g=hs==='curly'?hairShell(.8,.32,.06,.075,.022):hs==='short'?hairShell(.8,.33,.08,.05,0):hairShell(.79,.3,.04,.04,0);
const H=R.hair=part(head,g,hc,0,0,0,...HS,HK);
if(hs==='curly')for(let i=0;i<16;i++){const th=(i*2.39996)%TAU-Math.PI,y=.62+(i%5)*.075;if(Math.cos(th)>.55&&y<.8)continue;const r=headR(y)+.085;
part(H,CG.sphLo,shade(hc,(i%3)*.04),Math.sin(th)*r,y+.02,Math.cos(th)*r,.15,.09,.13,HK);}
if(hs==='long'){part(head,CG.hairBack,hc,0,hr*1.7,-hr*.12,hr*1.9,hr*1.95,hr*1.65,{k:'hair',side:THREE.DoubleSide}).rotation.x=-.08;}
if(hs==='bun'&&!d.kerchief){part(head,CG.sph,hc,0,hr*1.62,-hr*1.0,hr*.78,hr*.7,hr*.7,HK);part(head,CG.torus,shade(hc,-.15),0,hr*1.62,-hr*.8,hr*.4,hr*.4,hr*.4,HK);}
}
if(d.cap){part(head,CG.cyl,d.cap,0,hr*2.16,-hr*.05,hr*2.2,hr*.4,hr*2.3,WL);part(head,CG.sph,d.cap,0,hr*2.16,-hr*.05,hr*2.24,hr*.46,hr*2.34,WL);part(head,CG.box,shade(d.cap,-.25),0,hr*1.78,hr*1.18,hr*1.55,hr*.06,hr*.6,WL).rotation.x=.18;}
if(d.hat){part(head,CG.cyl,d.hat,0,hr*1.82,0,hr*3.2,hr*.06,hr*3.2,WL);part(head,CG.cyl,d.hat,0,hr*2.5,0,hr*2.12,hr*.7,hr*2.3,WL);part(head,CG.cyl,shade(d.hat,-.35),0,hr*1.98,0,hr*2.15,hr*.12,hr*2.33,CL);}
if(d.kerchief){part(head,hairShell(.85,.24,0,.1,0),d.kerchief,0,0,0,...HS,{k:'cloth',side:THREE.DoubleSide});const kn=part(head,CG.sph,shade(d.kerchief,-.15),0,hr*.42,-hr*.8,hr*.5,hr*.42,hr*.42,CL);
for(const s of [-1,1])part(head,CG.box,d.kerchief,s*hr*.12,hr*.1,-hr*.85,hr*.16,hr*.4,hr*.05,CL).rotation.z=s*.3;}
R.arms=[-1,1].map(s=>{const A=grp(spine,s*shW*.55,torH*.88,0);part(A,CG.sph,top,-s*thick*.12,-thick*.05,0,thick*1.22,thick*1.06,thick*1.12,topK);part(A,CG.limb,top,0,0,0,thick*1.08,armL*.5,thick*1.08,topK);
const el=grp(A,0,-armL*.5,0);part(el,CG.sphLo,top,0,0,0,thick*1.0,thick*1.0,thick*1.0,topK);part(el,CG.limb,top,0,0,0,thick*.98,armL*.36,thick*.98,topK);
part(el,CG.cyl,shade(top,-.15),0,-armL*.3,0,thick*1.04,armL*.06,thick*1.04,topK);
const hand=grp(el,0,-armL*.4,0);part(hand,CG.hand,skin,0,-thick*.35,0,thick*.95,thick*1.0,thick*.62,S);const th=part(hand,CG.limb,skin,-s*thick*.05,-thick*.1,thick*.28,thick*.28,thick*.55,thick*.28,S);th.rotation.x=.7;
return {A,el,hand};});
const rH=R.arms[0].el,lH=R.arms[1].el;
if(d.lantern){const l=grp(rH,0,-armL*.48,.02);part(l,CG.torus,'#3a3030',0,0,0,.05,.05,.05,{r:.4,metal:1}).rotation.x=Math.PI/2;part(l,CG.cyl,'#3a3030',0,-.03,0,.1,.025,.1,{r:.4});
part(l,CG.cyl,'#ffd36a',0,-.055,0,.075,.12,.075,{e:'#ffb040',r:.2});for(const s of [-1,1])part(l,CG.box,'#3a3030',s*.04,-.11,0,.008,.12,.008,{r:.4});part(l,CG.cyl,'#3a3030',0,-.175,0,.105,.025,.105,{r:.4});}
if(d.violin){const v=R.violin=grp(lH,0,-armL*.4,.06);part(v,CG.sph,'#8a4a20',0,.02,0,.11,.13,.045,{r:.3});part(v,CG.sph,'#8a4a20',0,-.08,0,.13,.14,.05,{r:.3});
part(v,CG.box,'#1e120a',0,.08,.02,.022,.26,.012,{r:.4});part(v,CG.sphLo,'#3a2010',0,.22,0,.03,.04,.03,{r:.4});part(v,CG.box,'#c8b080',0,-.12,.028,.03,.006,.006,{r:.4});}
if(d.bag){part(spine,CG.box,d.bag,-shW*.66,torH*.12,0,.08,.22,.24,LE);part(spine,CG.box,shade(d.bag,-.25),-shW*.66,torH*.2,.0,.085,.06,.245,LE);part(spine,CG.box,shade(d.bag,-.2),0,torH*.55,0,shW*1.15,.02,.02,LE).rotation.z=.9;}
mergeParts(R);return R;}
function mergeParts(R){const keep=new Set([R.chest,R.skirt,R.tail,R.apron,R.hair,R.lipU,R.lipL,R.mouthIn,...(R.brows||[])].filter(Boolean));
const groups=[];R.body.traverse(o=>{if(!o.isMesh)groups.push(o);});
for(const g of groups){const byM=new Map();
for(const c of g.children){const vk=c.isMesh&&c.material&&c.material.userData&&c.material.userData.vk;
if(vk&&!keep.has(c)&&!c.children.length&&!c.material.transparent)(byM.get(vk)||byM.set(vk,[]).get(vk)).push(c);}
for(const [vk,list] of byM){if(list.length<2)continue;
const P=[],N=[],U=[],Cc=[],I=[];let off=0;const nm=new THREE.Matrix3(),v=new THREE.Vector3();
for(const m of list){m.updateMatrix();const geo=m.geometry,pa=geo.attributes.position,na=geo.attributes.normal,ua=geo.attributes.uv,col=m.material.color;nm.getNormalMatrix(m.matrix);
for(let i=0;i<pa.count;i++){v.fromBufferAttribute(pa,i).applyMatrix4(m.matrix);P.push(v.x,v.y,v.z);if(na){v.fromBufferAttribute(na,i).applyMatrix3(nm).normalize();N.push(v.x,v.y,v.z);}else N.push(0,1,0);U.push(ua?ua.getX(i):0,ua?ua.getY(i):0);Cc.push(col.r,col.g,col.b);}
if(geo.index)for(let i=0;i<geo.index.count;i++)I.push(geo.index.getX(i)+off);else for(let i=0;i<pa.count;i++)I.push(i+off);
off+=pa.count;g.remove(m);}
const mg=new THREE.BufferGeometry();mg.setAttribute('position',new THREE.Float32BufferAttribute(P,3));mg.setAttribute('normal',new THREE.Float32BufferAttribute(N,3));mg.setAttribute('uv',new THREE.Float32BufferAttribute(U,2));mg.setAttribute('color',new THREE.Float32BufferAttribute(Cc,3));
mg.setIndex(off>65535?new THREE.Uint32BufferAttribute(I,1):new THREE.Uint16BufferAttribute(I,1));mg.computeBoundingSphere();g.add(new THREE.Mesh(mg,vcMat(list[0].material)));}}}
function buildChicken(){const body=new THREE.Group(),R={body,kind:'chicken'};const b=R.b=grp(body,0,.2,0);
part(b,CG.sph,'#f4f0e6',0,0,0,.26,.22,.32,{r:.9});part(b,CG.cone,'#e2dccd',0,.08,-.16,.12,.16,.1).rotation.x=-.9;
const h=R.head=grp(b,0,.12,.12);part(h,CG.sph,'#f4f0e6',0,.04,0,.12,.13,.12);part(h,CG.box,'#d23a30',0,.12,0,.025,.06,.08);part(h,CG.cone,'#e8a020',0,.04,.08,.04,.07,.04).rotation.x=Math.PI/2;part(h,CG.sphLo,'#d23a30',0,-.02,.05,.03,.05,.03);
for(const s of [-1,1])part(h,CG.sphLo,'#111',s*.05,.06,.04,.018,.018,.018);
R.legs=[-1,1].map(s=>{const L=grp(body,s*.05,.12,0);part(L,CG.cyl,'#e8a020',0,0,0,.018,.12,.018);return {L};});return R;}
function buildDog(){const body=new THREE.Group(),R={body,kind:'dog'};const b=R.b=grp(body,0,.34,0);
part(b,CG.sph,'#9a6a3a',0,0,0,.26,.24,.58,{r:.95});part(b,CG.sph,'#b8884e',0,-.05,.02,.2,.16,.46,{r:.95});
const h=R.head=grp(b,0,.12,.28);part(h,CG.sph,'#9a6a3a',0,.04,.02,.2,.19,.21,{r:.95});part(h,CG.box,'#9a6a3a',0,0,.12,.1,.09,.14);part(h,CG.sphLo,'#1a1010',0,.02,.2,.04,.035,.03);
for(const s of [-1,1]){part(h,CG.sphLo,'#111',s*.06,.08,.1,.025,.025,.02);part(h,CG.box,'#6a4220',s*.08,.1,-.02,.04,.12,.07).rotation.z=s*.4;}
R.tail=grp(b,0,.06,-.27);part(R.tail,CG.cyl,'#9a6a3a',0,0,0,.035,.2,.035).rotation.x=-2.3;
R.legs=[[-1,1],[1,1],[-1,-1],[1,-1]].map(([sx,sz])=>{const L=grp(b,sx*.08,-.06,sz*.18);part(L,CG.cyl,'#6a4220',0,0,0,.05,.28,.05);return {L};});return R;}
function rigFor(def){return def==='chicken'?buildChicken():def==='dog'?buildDog():buildPerson(def);}
function actor(def,x,z,o){o=o||{};const isCh=typeof def==='string',sc=o.sc||1;
const g=new THREE.Group();const R=rigFor(def);R.body.scale.setScalar(sc);g.add(R.body);
const sh=new THREE.Mesh(SHGEO,SHMAT);sh.rotation.x=-Math.PI/2;sh.position.y=.02;if(isCh)sh.scale.setScalar(def==='dog'?.9:.5);g.add(sh);g.position.set(x,0,z);world.add(g);
const fx=o.fx===undefined?1:o.fx,fz=o.fz||0;
const a={def,R,sp:R.body,g,x,z,sc,ph:Math.random()*6,moving:false,solid:o.solid!==false,name:o.name||'',face:{x:fx,z:fz},path:null,pi:0,loop:true,speed:o.speed||1.2,mark:null,markFn:null,watch:o.watch!==false,stun:0,
yaw:Math.atan2(fx,fz),hy:0,hp:0,an:{walk:0,run:0,sit:0,wave:0,talk:0,ph:Math.random()*6,v:0,lx:x,lz:z,blink:1+Math.random()*3,bl:0,expr:'',exprT:0,glance:Math.random()*4,gy:0},pose:null};
if(!isCh){const mk=new THREE.Sprite(new THREE.SpriteMaterial({map:markTex(),transparent:true,alphaTest:.5,depthTest:false}));mk.scale.set(.32,.6,1);mk.position.y=(def.adult?2.25:1.75)*sc;mk.visible=false;g.add(mk);a.mark=mk;}
g.userData.actor=true;actors.push(a);return a;}
function setDef(a,def){a.def=def;const vis=a.sp.visible;a.g.remove(a.R.body);a.R=rigFor(def);a.R.body.scale.setScalar(a.sc||1);a.R.body.visible=vis;a.g.add(a.R.body);a.sp=a.R.body;}
function wave(a,sec){if(a)a.waveT=sec||2;}
function sitDown(a,h){if(a)a.pose={sit:h===undefined?(a.def.adult?.46:.36):h};}
function standUp(a){if(a)a.pose=null;}
function expr(a,k,sec){if(a){a.an.expr=k;a.an.exprT=sec||2.5;}}
const EXPR_OF={heart:'happy',note:'happy',excl:'surprised',ask:'surprised',drop:'sad'};
function angDiff(a,b){let d=a-b;while(d>Math.PI)d-=TAU;while(d<-Math.PI)d+=TAU;return d;}
function animActor(a,dt,tt){const R=a.R,an=a.an,k=n=>1-Math.exp(-n*dt);
const vx=(a.x-an.lx)/Math.max(dt,1e-3),vz=(a.z-an.lz)/Math.max(dt,1e-3);an.lx=a.x;an.lz=a.z;const v=Math.min(8,Math.hypot(vx,vz));an.v+=(v-an.v)*k(10);
const mv=a.moving&&an.v>.15;an.walk+=((mv?1:0)-an.walk)*k(8);an.run+=((mv&&an.v>2.6?1:0)-an.run)*k(5);
const sitting=!!(a.pose&&a.pose.sit!==undefined);an.sit+=((sitting?1:0)-an.sit)*k(6);
a.waveT=Math.max(0,(a.waveT||0)-dt);an.wave+=((a.waveT>0?1:0)-an.wave)*k(7);
const talking=(a===talker&&D.typing)||(a.chat&&!D.open&&Math.sin(tt*.6+a.ph*3)>.35);   // a.chat: chiacchiera con il vicino
an.talk+=((talking?1:0)-an.talk)*k(6);
const want=Math.atan2(a.face.x,a.face.z);a.yaw+=angDiff(want,a.yaw)*k(mv?12:7);R.body.rotation.y=a.yaw;
R.body.rotation.z=a.stun>0?.5:R.body.rotation.z*(1-k(8));
if(R.kind==='chicken'){an.ph+=dt*(mv?14:0);R.legs.forEach((l,i)=>l.L.rotation.x=Math.sin(an.ph+i*Math.PI)*.6*an.walk);R.b.position.y=.2+Math.abs(Math.sin(an.ph))*.03*an.walk;
const peck=!mv&&Math.sin(tt*1.7+a.ph)>.75;R.head.rotation.x+=((peck?1.1:Math.sin(tt*3+a.ph)*.1)-R.head.rotation.x)*k(14);return;}
if(R.kind==='dog'){an.ph+=dt*(4+an.v*2.4);R.legs.forEach((l,i)=>l.L.rotation.x=Math.sin(an.ph+(i===0||i===3?0:Math.PI))*.7*an.walk);R.b.position.y=.34+Math.abs(Math.sin(an.ph))*.03*an.walk;
R.tail.rotation.z=Math.sin(tt*(mv?14:7))*.5;R.head.rotation.x=Math.sin(tt*1.3+a.ph)*.08;return;}
const W=an.walk,Rn=an.run,S=an.sit,stride=.55+Rn*.45;an.ph+=dt*an.v/(a.def.adult?.62:.48)*Math.PI*.5*(1-Rn*.25)+dt*2*Rn;
const sw=Math.sin(an.ph),cw=Math.cos(an.ph),breath=Math.sin(tt*2.2+a.ph);
R.legs.forEach((l,i)=>{const s=i?-sw:sw,c=i?-cw:cw;l.L.rotation.x=(-s*stride*W)*(1-S)+(-1.45)*S;l.knee.rotation.x=(Math.max(0,c)*(.9+Rn*.6)*W+.06)*(1-S)+1.45*S;l.L.rotation.z=0;});
R.hips.position.y=R.legL*(1-S)+(a.pose&&a.pose.sit!==undefined?a.pose.sit:R.legL*.6)*S+Math.abs(sw)*.035*W*(1+Rn)-W*.02;
R.hips.rotation.y=sw*.12*W;R.spine.rotation.y=-sw*.18*W;R.spine.rotation.x=.04+Rn*.22+S*.05;R.spine.rotation.z=Math.sin(tt*.6+a.ph)*.02*(1-W);
R.chest.scale.y=R.torH*(1+breath*.018);
if(R.skirt)R.skirt.rotation.x=-sw*.06*W+S*-.9;if(R.apron&&R.apron.parent===R.hips)R.apron.rotation.x=-Math.abs(sw)*.1*W+S*-1.2;if(R.tail)R.tail.rotation.x=-sw*.05*W-Rn*.2+S*-1;
R.arms.forEach((ar,i)=>{const s=i?sw:-sw,side=i?1:-1;let rx=s*(.45+Rn*.5)*W,rz=side*(.06+breath*.01),ex=-.12-W*.25-Rn*.9;
if(i===0&&an.wave>.01){rx=rx*(1-an.wave)-.2*an.wave;rz=rz*(1-an.wave)+(-2.5)*an.wave;ex=ex*(1-an.wave)+(-.4+Math.sin(tt*9)*.45)*an.wave;}
if(an.talk>.01&&!(i===0&&an.wave>.01)){const g=Math.sin(tt*(i?2.3:3.1)+a.ph*(i+1));rx=rx*(1-an.talk)+(-.35-g*.25)*an.talk;ex=ex*(1-an.talk)+(-.9+g*.3)*an.talk;}
if(a.def.violin&&i===1){rx=-1.1;rz=.3;ex=-1.6;}
if(S>.01){rx=rx*(1-S)-.35*S;ex=ex*(1-S)-.7*S;}
ar.A.rotation.x=rx;ar.A.rotation.z=rz;ar.el.rotation.x=ex;ar.el.rotation.z=0;});
const still=!mv&&S<.05&&!a.act&&!a.def.violin&&!a.def.lantern&&an.talk<.05&&an.wave<.05&&!a.doze&&!a.stun;
an.idleT=(an.idleT===undefined?2+Math.random()*7:an.idleT)-dt;
if(!still){an.idleT=Math.max(an.idleT,a.isPlayer?6:2.5);an.ik='';}
else if(an.idleT<0){if(an.ik){an.ik='';an.idleT=(a.isPlayer?6:4)+Math.random()*8;}
else{const cold=TERRAIN==='snow',L=a.isPlayer?(cold?['blow','rub','look']:['look','scratch','shift','look']):cold?['rub','cross','blow','shift']:a.def.adult?['hips','cross','scratch','shift']:['shift','scratch','hips','stretch','look'];
an.ik=an.iks=L[Math.floor(Math.random()*L.length)];an.idleT=2.4+Math.random()*2.4;}}
an.idle=(an.idle||0)+((an.ik?1:0)-(an.idle||0))*k(3.5);const I=an.idle,ik=an.iks;
R.hips.position.x=0;
if(I>.01){R.arms.forEach((ar,i)=>{const sd=i?1:-1;let t=null;
if(ik==='hips')t=[.28,sd*.6,-1.3,-sd*.85];
if(ik==='cross'||ik==='rub')t=[-.42,sd*.1,-1.55,-sd*1.05];
if(ik==='blow')t=[-1.05,-sd*.08,-1.95,-sd*.5];
if(ik==='stretch')t=[-.25,sd*2.75,-.25,0];
if(ik==='scratch'&&i===0)t=[-.65,sd*1.25,-2.2+Math.sin(tt*13)*.2,-sd*.35];
if(!t)return;if(ik==='rub')t[0]+=Math.sin(tt*9+i*Math.PI)*.13;
ar.A.rotation.x+=(t[0]-ar.A.rotation.x)*I;ar.A.rotation.z+=(t[1]-ar.A.rotation.z)*I;ar.el.rotation.x+=(t[2]-ar.el.rotation.x)*I;ar.el.rotation.z=t[3]*I;});
if(ik==='shift'){const s=Math.sin(tt*.55+a.ph);R.hips.position.x=s*.035*I;R.spine.rotation.z-=s*.05*I;R.legs[s>0?0:1].knee.rotation.x+=.2*I*Math.abs(s);}
if(ik==='stretch')R.spine.rotation.x-=.16*I;}
if(a.act){const A0=R.arms[0],A1=R.arms[1];
if(a.act==='wash'){R.spine.rotation.x=.5;R.arms.forEach((ar,i)=>{ar.A.rotation.x=-1+Math.sin(tt*6+i*1.4)*.25;ar.A.rotation.z=(i?1:-1)*.12;ar.el.rotation.x=-.45;});}
if(a.act==='sweep'){R.spine.rotation.y=Math.sin(tt*2.6+a.ph)*.3;R.spine.rotation.x=.22;R.arms.forEach(ar=>{ar.A.rotation.x=-.55+Math.sin(tt*2.6+a.ph)*.35;ar.el.rotation.x=-.6;});}
if(a.act==='knit'){R.arms.forEach((ar,i)=>{ar.A.rotation.x=-.3;ar.A.rotation.z=(i?-1:1)*.2;ar.el.rotation.x=-1.3+Math.sin(tt*9+i*2)*.09;});}
if(a.act==='fish'){A0.A.rotation.x=-.95;A0.el.rotation.x=-.35+Math.sin(tt*.7)*.05;A1.A.rotation.x=-.55;A1.el.rotation.x=-.95;}}
let ty=0,tp=0,tgtA=null;
if(talker&&talker!==a&&D.open&&Math.hypot(talker.x-a.x,talker.z-a.z)<7)tgtA=talker;
else if(a===talker&&P&&P!==a)tgtA=P;
else if(!a.isPlayer&&a.watch&&P&&Math.hypot(P.x-a.x,P.z-a.z)<4)tgtA=P;
if(tgtA){ty=angDiff(Math.atan2(tgtA.x-a.x,tgtA.z-a.z),a.yaw);const dh=(tgtA.def.adult?1.6:1.2)*(tgtA.sc||1)-(a.def.adult?1.6:1.2)*(a.sc||1),dd=Math.max(.5,Math.hypot(tgtA.x-a.x,tgtA.z-a.z));tp=-Math.atan2(dh,dd)*.8;}
else{an.glance-=dt;if(an.glance<0){an.glance=2+Math.random()*4;an.gy=W>.5?0:(Math.random()-.5)*1.4;}ty=a.lookY!==undefined?a.lookY+Math.sin(tt*.4+a.ph)*.12:ik==='look'&&I>.3?Math.sin(tt*1.1+a.ph)*1.05:an.gy;}   // a.lookY: guarda fisso da una parte (il finestrino)
const nearP=!a.isPlayer&&a!==talker&&tgtA===P&&P;
if(nearP&&!an.seen){an.seen=1;an.nod=1;if(!a.def.adult&&S<.05&&!a.act&&Math.random()<.35)wave(a,1.3);}
else if(!nearP&&P&&Math.hypot(P.x-a.x,P.z-a.z)>6)an.seen=0;
an.nod=Math.max(0,(an.nod||0)-dt*1.5);
ty=clamp(ty,-1.15,1.15);a.hy+=(ty-a.hy)*k(5);a.hp+=(tp-a.hp)*k(5);
R.head.rotation.y=a.hy;R.head.rotation.x=a.hp+(an.talk*Math.sin(tt*5.3)*.05)+Rn*-.15+Math.sin((1-an.nod)*Math.PI)*.26+I*(ik==='blow'?.35:ik==='stretch'?-.3:0);
R.head.rotation.z=Math.sin(tt*.9+a.ph)*.03*(1-W)+I*(ik==='scratch'?.16:0);
if(a.doze){R.head.rotation.x=.42+Math.sin(tt*.8+a.ph)*.04;R.head.rotation.z=.24;}   // si è addormentato con la testa ciondoloni
const near=camera.position.distanceToSquared(a.g.position)<196;R.face.visible=near;if(!near)return;
an.blink-=dt;if(an.blink<0){an.bl=.14;an.blink=2+Math.random()*3.5;}an.bl=Math.max(0,an.bl-dt);const eo=an.bl>0?.12:1;
an.exprT=Math.max(0,an.exprT-dt);const ex=an.exprT>0?an.expr:(a.def.adult?'':'');const hr=R.hr;
const bh=ex==='sad'?.12:ex==='surprised'?.3:ex==='happy'?.08:0,btilt=ex==='sad'?.35:ex==='angry'?-.35:0;
const lidOpen=ex==='surprised'?-.95:ex==='sad'?.1:ex==='happy'?-.38:-.6;R.lids.forEach(l=>{const want=an.bl>0||a.doze?1.45:lidOpen;l.rotation.x+=(want-l.rotation.x)*Math.min(1,dt*30);});
R.brows.forEach((b,i)=>{b.position.y=hr*(1.3+bh);b.rotation.z=(i?-1:1)*btilt;});
const mo=an.talk>.01?Math.max(0,Math.sin(tt*17)*.5+Math.sin(tt*11.3)*.5)*an.talk:0;
const open=mo+(ex==='surprised'?.6:0),wide=ex==='happy'?1.3:ex==='sad'?.8:ex==='surprised'?.7:1;R.mouth.scale.set(wide,1,1);R.lipL.position.y=-hr*(.045+open*.07);R.mouthIn.scale.y=hr*(.06+open*.14);R.mouthIn.position.y=-hr*(.02+open*.035);
R.mouth.position.y=hr*(ex==='sad'?.6:ex==='happy'?.64:.62);}
function talk(a,label,fn,active){interacts.push({a,get x(){return a.x;},get z(){return a.z;},r:1.7,label,fn,active:active||(()=>true)});}
function spot(x,z,label,fn,active,r){interacts.push({x,z,r:r||1.6,label,fn,active:active||(()=>true)});}
function item(x,z,fn){const fr=rugFrames();const m=new THREE.SpriteMaterial({map:fr.r[0],transparent:true,alphaTest:.5});m.color.set(tint);const sp=new THREE.Sprite(m);sp.scale.set(.55,.55,1);sp.position.set(x,.5,z);world.add(sp);const glow=new THREE.Mesh(new THREE.CircleGeometry(.35,10),new THREE.MeshBasicMaterial({color:0xffd23a,transparent:true,opacity:.35,depthWrite:false}));glow.rotation.x=-Math.PI/2;const gy=heightAt(x,z);glow.position.set(x,gy+.03,z);world.add(glow);items.push({x,z,sp,glow,fn,taken:false,t:R()*6,gy});}
