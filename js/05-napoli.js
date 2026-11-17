"use strict";
const NAP=['#e3ad4a','#e09280','#efd27e','#e8a06e','#c9bf9a','#d6805c','#ecc290','#f0d8b0','#d9b0c0'];
const texRail=()=>T('rail',()=>ctex(24,8,g=>{g.fillStyle='#221c20';g.fillRect(0,0,24,1);g.fillRect(0,7,24,1);for(let x=0;x<24;x+=2)g.fillRect(x,0,1,8);g.fillRect(0,3,24,1);},false));
function vicolo(night,war){const from=world.children.length;vicolo0(night,war);mergeNew(from);}
function vicolo0(night,war){const slab=mat('#8a7868'),iron=mat('#2a2428'),rail=mat(texRail(),{alpha:true,double:true}),pot=mat('#b0583a'),leaf=mat('#4e7a3a'),fl=[mat('#d83a48'),mat('#f0c040'),mat('#e070a0')];
const fruit=[mat('#f2d23a'),mat('#d8402a'),mat('#7ab040'),mat('#e88a2a')],wood=mat(texWood()),awn=[mat('#c8402a'),mat('#3a6ab0'),mat('#3a8a5a'),mat('#e0a030')];
const narrow=z=>(z<9&&z>-12)||(z<-22&&z>-28)||(z<-30.5&&z>-43);
const awnings=[];hooks.push(dt=>{if(!P)return;const cx=camera.position.x-P.x,cz=camera.position.z-P.z,l2=cx*cx+cz*cz||1;
for(const [m,x,z] of awnings){const k=clamp(((x-P.x)*cx+(z-P.z)*cz)/l2,0,1),dx=P.x+cx*k-x,dz=P.z+cz*k-z;const t=dx*dx+dz*dz<1.6?.18:1;m.opacity+=(t-m.opacity)*Math.min(1,dt*8);}});
for(const side of [-1,1]){const fx=side*2.5;let k=0;
for(let z=7.5;z>-43;z-=rr(2.4,3.6)){if(!narrow(z)||(side<0&&Math.abs(z-1)<1.3)||(side>0&&Math.abs(z+5)<1.5))continue;k++;
for(const y of [3.4,6.4]){if(R()<.4)continue;box(fx-side*.3,y,z,.6,.12,1.6,slab,{collide:false,occlude:true});plane(1.6,.6,rail,fx-side*.58,y+.42,z,side<0?Math.PI/2:-Math.PI/2).userData.static=true;
for(const dz of [-.8,.8])plane(.6,.6,rail,fx-side*.3,y+.42,z+dz,0).userData.static=true;
for(let i=0;i<3;i++){if(R()<.25)continue;const pz=z-.5+i*.5;box(fx-side*.36,y+.12,pz,.22,.24,.22,pot,{collide:false});box(fx-side*.36,y+.36,pz,.3,.22,.3,R()<.4?leaf:pick(fl),{collide:false});}}
if(war)continue;
if(k%3===0){const am=pick(awn).clone();am.transparent=true;const aw=box(fx-side*.45,2.4,z,.9,.06,1.7,am,{collide:false});aw.rotation.z=side*.32;awnings.push([am,fx-side*.45,z]);
for(const dz of [-.4,.35]){box(fx-side*.3,0,z+dz,.5,.34,.5,wood,{collide:false});box(fx-side*.3,.34,z+dz,.44,.08,.44,pick(fruit),{collide:false});}
if(night)glowAt(fx-side*.5,1.9,z,1.2,0xffc070,true);}
else if(k%3===1){box(fx-side*.45,.42,z,.42,.06,.42,wood,{collide:false});box(fx-side*.27,.42,z,.05,.55,.42,wood,{collide:false});for(const [dx,dz] of [[-.17,-.17],[.17,-.17],[-.17,.17],[.17,.17]])box(fx-side*.45+dx,0,z+dz,.05,.42,.05,wood,{collide:false});}
else{box(fx-side*.3,0,z,.4,.45,.4,pot,{collide:false});const pl=new THREE.Mesh(new THREE.ConeGeometry(.38,1.1,5),leaf);pl.position.set(fx-side*.3,1,z);world.add(pl);}}}
for(let z=6;z>-43;z-=5.5){if(!narrow(z))continue;const y=5.4+R()*.5;box(0,y,z,5,.03,.03,iron,{collide:false});
if(!war){box(0,y-.25,z,.12,.2,.12,mat(night?'#ffe0a0':'#d8d0c0',{basic:night}),{collide:false});if(night)glowAt(0,y-.2,z,1.6,0xffc870,true);}}
if(!war){const rope=box(-2.05,2.3,-8.5,.02,4,.02,mat('#c8b890'),{collide:false});const bk=box(-2.05,1.95,-8.5,.38,.34,.38,mat('#b08a4a'),{collide:false});rope.userData.noMerge=bk.userData.noMerge=true;
box(-2.05,6.25,-8.5,.6,.08,1.2,slab,{collide:false});hooks.push(()=>{const tt=now(),s=Math.sin(tt*1.3)*.06;bk.position.x=-2.05+s;rope.position.x=-2.05+s*.5;bk.rotation.z=s;});}
box(2.33,1.4,-34,.34,1,.7,mat('#ece4d2'),{collide:false});plane(.4,.5,mat('#3a5a9a'),2.15,1.95,-34,-Math.PI/2);
if(!war)glowAt(2.12,1.55,-34,night?1.4:.7,0xffb050,true);}
const KMAT=new Map();function kmat(key,f){if(!KMAT.has(key))KMAT.set(key,f());return KMAT.get(key);}
const NAPW=NAP.map(c=>'#'+new THREE.Color(c).lerp(new THREE.Color('#7a6e60'),.55).getHexString());
let NAPX=NAP,WREC=null;
const POOR={tops:['#5a5048','#6a5a48','#4a4440','#7a6a58','#3a3632','#8a7a66','#5a4a3a','#6a6258','#9a8a72','#4a4a42','#7a7060','#a89a80'],bots:['#3a3430','#4a4038','#2e2c2a','#5a5044','#3e3a36','#6a5e4e']};
function poor(d){const o=vary(d),p=a=>a[Math.floor(R()*a.length)];for(const k of ['coat','skirt','pants','vest'])if(o[k])o[k]=p(POOR.bots.concat(POOR.tops));if(o.shirt)o.shirt=p(POOR.tops);
o.holes=1;if(!o.adult&&R()<.6)o.shoes=null;else if(o.shoes)o.shoes=p(['#2a2420','#3a3028','#4a3a2e']);if(o.hat&&R()<.7)delete o.hat;if(o.bag)delete o.bag;return o;}
function scarMat(k){return kmat('scar'+k,()=>{const c=document.createElement('canvas');c.width=c.height=256;const g=c.getContext('2d'),rn=mulberry(k.charCodeAt(0)*131+k.length*7);
const shape=(cx,cy,r,n,j,sy)=>{const pts=[];for(let i=0;i<n;i++){const a=i/n*TAU;const q=r*(1-j/2+rn()*j);pts.push([cx+Math.cos(a)*q,cy+Math.sin(a)*q*(sy||1)]);}return pts;};
const path=pts=>{g.beginPath();pts.forEach(([x,y],i)=>i?g.lineTo(x,y):g.moveTo(x,y));g.closePath();};
const bricks=()=>{g.fillStyle='#9a7a50';g.fillRect(0,0,256,256);for(let y=0;y<256;y+=20)for(let x=((y/20)%2)*22-22;x<256;x+=44){g.fillStyle=rpick(rn,['#b8955e','#a2804e','#c6a46c','#8e6c44','#a8683e','#b07a4a']);g.fillRect(x+2,y+2,40,16);}
for(let i=0;i<40;i++){g.fillStyle='rgba(40,30,20,'+(.1+rn()*.25)+')';g.fillRect(rn()*256,rn()*256,3+rn()*10,2+rn()*6);}};
let transparent=false;
if(k==='brick'||k==='breach'){const out=shape(128,128,112,30,.6);path(out);g.save();g.clip();bricks();
if(k==='breach'){const hole=shape(128,136,74,22,.7,.95);path(hole);g.fillStyle='#120d0b';g.fill();for(let i=0;i<5;i++){g.strokeStyle='#2a1c12';g.lineWidth=5;g.beginPath();const y=90+rn()*90;g.moveTo(60+rn()*30,y);g.lineTo(190+rn()*30,y+(rn()-.5)*30);g.stroke();}}
g.restore();path(out);g.strokeStyle='rgba(70,55,40,.85)';g.lineWidth=6;g.stroke();g.strokeStyle='rgba(230,215,190,.5)';g.lineWidth=2;g.stroke();}
else if(k==='pock'){for(let i=0;i<70;i++){const x=128+(rn()-.5)*230*rn(),y=128+(rn()-.5)*230*rn(),r=2+rn()*7;g.fillStyle='rgba(235,220,195,.6)';g.beginPath();g.arc(x+1,y+1,r+2.5,0,TAU);g.fill();g.fillStyle='#3a2c22';g.beginPath();g.arc(x,y,r,0,TAU);g.fill();}}
else if(k==='soot'){transparent=true;const gr=g.createLinearGradient(0,256,0,0);gr.addColorStop(0,'rgba(20,16,14,.85)');gr.addColorStop(.45,'rgba(25,20,18,.5)');gr.addColorStop(1,'rgba(30,25,22,0)');
for(let i=0;i<7;i++){g.fillStyle=gr;const x=70+rn()*60,w=50+rn()*70;g.beginPath();g.moveTo(x,256);g.bezierCurveTo(x-20,170,x+w*.2,90,x+w*.5,0);g.lineTo(x+w*.9,0);g.bezierCurveTo(x+w,90,x+w*1.1,170,x+w*.9,256);g.fill();}}
else if(k==='board'){for(let i=0;i<5;i++){const y=14+i*48;g.fillStyle=rpick(rn,['#7a5a3a','#6a4a30','#8a6a46','#5e4430']);g.save();g.translate(128,y+18);g.rotate((rn()-.5)*.12);g.fillRect(-124,-18,248,36);g.fillStyle='rgba(0,0,0,.25)';for(let j=0;j<6;j++)g.fillRect(-120+rn()*230,-16+rn()*30,30+rn()*60,2);g.fillStyle='#2a2a2a';g.fillRect(-110,-4,6,6);g.fillRect(104,-4,6,6);g.restore();}
g.save();g.translate(128,128);g.rotate(.62);g.fillStyle='#5a4028';g.fillRect(-150,-14,300,28);g.restore();}
else if(k==='poster'){const P4=[['VOTATE','REPUBBLICA','#c83a30','#f2e8d0'],['PANE','E LAVORO','#2a2a2a','#e8dcb8'],['NAPOLI','RINASCE','#2f5f9a','#efe6cc'],['W LA','REPUBBLICA','#3a7a4a','#f0e6c8']];
for(let i=0;i<4;i++){const [a,b,ink,paper]=P4[i],x=(i%2)*128,y=(i>>1)*128;const ed=shape(x+64,y+64,60,18,.25);path(ed);g.fillStyle=paper;g.fill();g.fillStyle=ink;g.font='bold 24px Georgia, serif';g.textAlign='center';g.fillText(a,x+64,y+56);g.font='bold 18px Georgia, serif';g.fillText(b,x+64,y+82);
g.fillStyle='rgba(120,100,70,.35)';for(let j=0;j<8;j++)g.fillRect(x+10+rn()*100,y+10+rn()*100,6+rn()*20,3+rn()*10);}}
const t=new THREE.CanvasTexture(c);t.anisotropy=ANISO;
return new THREE.MeshStandardMaterial({map:t,transparent,alphaTest:transparent?0:.45,depthWrite:!transparent,roughness:.95,envMapIntensity:.25,polygonOffset:true,polygonOffsetFactor:-2,polygonOffsetUnits:-2});});}
function flushScars(L){const m4=new THREE.Matrix4(),q=new THREE.Quaternion(),v=new THREE.Vector3(),s=new THREE.Vector3(),Y=new THREE.Vector3(0,1,0);
for(const k in L.scar){const list=L.scar[k];if(!list.length)continue;const geo=new THREE.PlaneGeometry(1,1);let mt=scarMat(k);
if(k==='poster'){const uv=geo.attributes.uv;for(let i=0;i<uv.count;i++)uv.setXY(i,uv.getX(i)*.5,uv.getY(i)*.5);geo.setAttribute('aOff',new THREE.InstancedBufferAttribute(new Float32Array(list.flatMap(e=>[(e[6]%2)*.5,.5-(e[6]>>1)*.5])),2));
mt=mt.clone();mt.onBeforeCompile=sh=>{sh.vertexShader='attribute vec2 aOff;\n'+sh.vertexShader.replace('#include <uv_vertex>','#include <uv_vertex>\n#ifdef USE_UV\nvUv+=aOff;\n#endif');};mt.customProgramCacheKey=()=>'poster';}
const im=new THREE.InstancedMesh(geo,mt,list.length);list.forEach((e,i)=>{q.setFromAxisAngle(Y,e[3]);m4.compose(v.set(e[0],e[1],e[2]),q,s.set(e[4],e[5],1));im.setMatrixAt(i,m4);});im.userData.noMerge=true;im.userData.noCast=true;im.receiveShadow=true;world.add(im);}
if(L.p3&&L.p3.length){const by={};for(const e of L.p3)(by[e[0]]||(by[e[0]]=[])).push(e);const qa=new THREE.Quaternion(),qb=new THREE.Quaternion(),qc=new THREE.Quaternion(),Z=new THREE.Vector3(0,0,1),X=new THREE.Vector3(1,0,0),c=new THREE.Color();
const MAT={brick:()=>new THREE.MeshStandardMaterial({color:'#ffffff',roughness:.95,flatShading:true,envMapIntensity:.25}),plaster:()=>new THREE.MeshStandardMaterial({color:'#ffffff',roughness:.9,flatShading:true,envMapIntensity:.25}),
joist:()=>new THREE.MeshStandardMaterial({color:'#ffffff',roughness:1,envMapIntensity:.15}),crack:()=>new THREE.MeshStandardMaterial({color:'#ffffff',roughness:1,envMapIntensity:.1})};
for(const k in by){const list=by[k],im=new THREE.InstancedMesh(new THREE.BoxGeometry(1,1,1),MAT[k](),list.length);
list.forEach((e,i)=>{const [,x,y,z,ry,roll,pitch,sx,sy,sz,col]=e;qa.setFromAxisAngle(Y,ry);qb.setFromAxisAngle(Z,roll);qc.setFromAxisAngle(X,pitch);qa.multiply(qb).multiply(qc);m4.compose(v.set(x,y,z),qa,s.set(sx,sy,sz));im.setMatrixAt(i,m4);im.setColorAt(i,c.set(col));});
im.castShadow=false;im.receiveShadow=true;im.userData.noMerge=true;world.add(im);}}
if(L.beam.length){const im=new THREE.InstancedMesh(new THREE.BoxGeometry(.2,1,.2),mc('#5a4430',{rough:.95}),L.beam.length);L.beam.forEach((e,i)=>{const [bx,bz,tx,ty,tz]=e,hb=heightAt(bx,bz),d=new THREE.Vector3(tx-bx,ty-hb,tz-bz),len=d.length();q.setFromUnitVectors(Y,d.normalize());m4.compose(v.set((bx+tx)/2,(hb+ty)/2,(bz+tz)/2),q,s.set(1,len,1));im.setMatrixAt(i,m4);});im.castShadow=true;world.add(im);}
if(L.rock.length){const im=new THREE.InstancedMesh(new THREE.DodecahedronGeometry(.5,0),new THREE.MeshStandardMaterial({color:'#ffffff',roughness:1,flatShading:true,envMapIntensity:.3}),L.rock.length),c=new THREE.Color();
L.rock.forEach((e,i)=>{q.setFromEuler(new THREE.Euler(e[4],e[5],e[4]*2));m4.compose(v.set(e[0],e[1]+heightAt(e[0],e[2]),e[2]),q,s.set(e[3]*1.3,e[3]*.7,e[3]));im.setMatrixAt(i,m4);im.setColorAt(i,c.set(['#9a8e7e','#7e7468','#b0a490','#6e6458','#a89070'][i%5]));});world.add(im);}}
let SMOKN=0;
function warDamage(recs,seed,k){k=k===undefined?1:k;SMOKN=0;const rn=mulberry(seed||1943),L={scar:{brick:[],pock:[],breach:[],soot:[],board:[],poster:[]},beam:[],rock:[],p3:[]};
const BRK=['#b8955e','#a8844e','#c6a46c','#9a7a4a','#a8683e','#b07a4a','#8e6c44'];
const blocked=(x,z)=>{for(const b of obstacles)if(x>b.x0&&x<b.x1&&z>b.z0&&z<b.z1)return true;return false;};
for(const [x0,z0,x1,z1,h,y0=0,base='#d8b888'] of recs){if(rn()>.8*k)continue;
const faces=[[(x0+x1)/2,z1,0,0,1,x1-x0],[(x0+x1)/2,z0,Math.PI,0,-1,x1-x0],[x1,(z0+z1)/2,Math.PI/2,1,0,z1-z0],[x0,(z0+z1)/2,-Math.PI/2,-1,0,z1-z0]].filter(f=>f[5]>2.5&&!blocked(f[0]+f[3]*1.2,f[1]+f[4]*1.2));
for(const [cx,cz,ry,nx,nz,len] of faces){if(rn()<.18)continue;
const NW=(u,y,r)=>NOWIN.push([cx+(nz!==0?u:0),y+y0,cz+(nx!==0?u:0),r]);
const at=(u,y,w,hh,kind,off)=>{if(kind==='poster')NW(u,y,Math.max(w,hh)/2);L.scar[kind].push([cx+(nz!==0?u:0)+nx*(off||.04),y+y0,cz+(nx!==0?u:0)+nz*(off||.04),ry,w,hh,Math.floor(rn()*4)]);};
const U=()=>(rn()-.5)*Math.max(0,len-2.6);
const P3=(kind,u,y,off,roll,pitch,sx,sy,sz,col)=>L.p3.push([kind,cx+(nz!==0?u:0)+nx*off,y+y0,cz+(nx!==0?u:0)+nz*off,ry,roll,pitch,sx,sy,sz,col]);
const patch3D=(u,yc,w,hh)=>{NW(u,yc,Math.max(w,hh)/2);for(let r=-hh/2+.06;r<hh/2-.05;r+=.115){const f=1-Math.pow(2*r/hh,2);if(f<=0)continue;const hw=w/2*Math.sqrt(f)*(.78+rn()*.16);let a=u-hw;
while(a<u+hw-.05){const l=Math.min(.3+rn()*.9,u+hw-a);if(rn()>.14){const d=.018+rn()*.026;P3('brick',a+l/2,yc+r,.008+d/2,0,0,l-.025,.09,d,rpick(rn,BRK));}a+=l+(rn()<.18?.24:.01);}}
const n=Math.round(Math.PI*(w+hh)/2/.15);for(let i=0;i<n;i++){const an=i/n*TAU+rn()*.2,pu=u+Math.cos(an)*w/2*(.96+rn()*.12),py=yc+Math.sin(an)*hh/2*(.96+rn()*.12),d=.03+rn()*.025;
P3('plaster',pu,py,.006+d/2,an+Math.PI/2+(rn()-.5)*.6,0,.1+rn()*.2,.05+rn()*.09,d,shade(base,-.05+rn()*.08));}};
const breach3D=(u,yc,w)=>{const r=w*.29,n=Math.round(TAU*r/.19);NW(u,yc,r*1.35);P3('crack',u,yc,.02,0,0,r*1.75,r*1.65,.04,'#0e0a08');for(let i=0;i<n;i++){const an=i/n*TAU,rr2=r*(.92+rn()*.2),d=.3+rn()*.3;
P3('brick',u+Math.cos(an)*rr2,yc+Math.sin(an)*rr2*.95,d/2-.06,an+Math.PI/2+(rn()-.5)*.3,0,.2+rn()*.08,.16+rn()*.12,d,shade(rpick(rn,BRK),-.15));}
for(let i=0;i<Math.round(n*1.3);i++){const an=rn()*TAU,rr2=r*(1.15+rn()*.55),d=.04+rn()*.06;P3('plaster',u+Math.cos(an)*rr2,yc+Math.sin(an)*rr2,.01+d/2,rn()*3,0,.14+rn()*.3,.08+rn()*.16,d,shade(base,-.08+rn()*.1));}
for(let j=0,m=2+Math.floor(rn()*2);j<m;j++){const ln=.8+rn()*.9;P3('joist',u+(rn()-.5)*r*1.2,yc-r*.35+rn()*r*.5,ln*.35,(rn()-.5)*.25,.15+rn()*.45,.12,.14,ln,'#3a2a1e');}};
const crack3D=(u,yt)=>{let px=u,py=yt;for(let i=0,m=5+Math.floor(rn()*6);i<m&&py>1.2;i++){const ln=.2+rn()*.35,th=(rn()-.5)*1.1,dx=Math.sin(th)*ln,dy=-Math.cos(th)*ln;
P3('crack',px+dx/2,py+dy/2,.008,-th,0,.035,ln+.02,.014,'#241c16');P3('plaster',px+dx/2+.03,py+dy/2,.006,-th,0,.03,ln*.8,.01,shade(base,.18));px+=dx;py+=dy;
if(rn()<.25){const t2=th+(rn()<.5?.8:-.8),l2=.15+rn()*.2;P3('crack',px+Math.sin(t2)*l2/2,py-Math.cos(t2)*l2/2,.008,-t2,0,.025,l2,.012,'#241c16');}}};
for(let i=0,n=1+Math.floor(rn()*1.6);i<n;i++){const w=1.2+rn()*2,hh=w*(.7+rn()*.4),u=U(),yc=1.2+rn()*(h-2.4);patch3D(u,yc,w*.84,hh*.84);}
if(rn()<.7)crack3D(U(),h*(.45+rn()*.45));if(rn()<.35)crack3D(U(),h*(.3+rn()*.5));
if(rn()<.45){for(let i=0,n=1+Math.floor(rn()*2);i<n;i++)at(U(),1.75,.8,1.05,'poster',.06+i*.005);}
if(rn()<.38){const u=U();NW(u,1.5,.85);for(let i=0;i<5;i++)P3('joist',u+(rn()-.5)*.06,.75+i*.4,.05,(rn()-.5)*.08,0,1.45,.3,.04,rpick(rn,['#7a5a3a','#6a4a30','#8a6a46','#5e4430']));P3('joist',u,1.55,.09,.62,0,1.9,.24,.04,'#5a4028');}
if(rn()<.34&&h>7){const u=U(),y=h*.5+rn()*h*.28,w=2.2+rn()*1.8;breach3D(u,y,w);
P3('crack',u,y+w*.62,.012,0,0,w*.55,w*.85,.012,'#2c2622');P3('crack',u,y+w*1.05,.01,0,0,w*.38,w*.5,.01,'#3a332c');
if(SMOKN<3&&rn()<.45){SMOKN++;chimneySmoke(cx+(nz!==0?u:0)+nx*.6,y0+y,cz+(nx!==0?u:0)+nz*.6,0x8e8a84);}
for(let i=0;i<10;i++)L.rock.push([cx+(nz!==0?u+(rn()-.5)*2.6:0)+nx*(.4+rn()*1.4),.1,cz+(nx!==0?u+(rn()-.5)*2.6:0)+nz*(.4+rn()*1.4),.2+rn()*.45,rn()*3,rn()*3]);
for(let b=0;b<2;b++){const uu=u+(b-.5)*1.8,bx=cx+(nz!==0?uu:0)+nx*2.4,bz=cz+(nx!==0?uu:0)+nz*2.4;L.beam.push([bx,bz,cx+(nz!==0?uu:0)+nx*.1,y0+y-1.4-b*.4,cz+(nx!==0?uu:0)+nz*.1]);obstacles.push({x0:bx-.2,x1:bx+.2,z0:bz-.2,z1:bz+.2});}}
for(let i=0,n=3+Math.floor(rn()*7);i<n;i++){const u=U();L.rock.push([cx+(nz!==0?u:0)+nx*(.3+rn()*.7),.06,cz+(nx!==0?u:0)+nz*(.3+rn()*.7),.1+rn()*.28,rn()*3,rn()*3]);}}}
flushScars(L);}
function ruin(x0,z0,x1,z1,h,base,rn){const fm=kmat('ruin'+base,()=>mat(texPlaster(base,true))),inner=mc('#6a5e52',{rough:1}),th=.4;
const strip=(cx,cz,alongX)=>{const top=Math.max(1.4,h*(rn()<.2?.18+rn()*.2:.45+rn()*.55)),g=new THREE.BoxGeometry(alongX?2.2:th,top,alongX?th:2.2),uv=g.attributes.uv;for(let i=0;i<uv.count;i++)uv.setY(i,uv.getY(i)*top/2.6);
const me=new THREE.Mesh(g,[fm,fm,inner,inner,fm,fm]);me.position.set(cx,top/2,cz);world.add(me);occluders.push(me);};
for(let x=x0+1.1;x<x1-.5;x+=2.2){strip(x,z0+th/2,true);strip(x,z1-th/2,true);}for(let z=z0+1.1+th;z<z1-.5-th;z+=2.2){strip(x0+th/2,z,false);strip(x1-th/2,z,false);}
const cx=(x0+x1)/2,cz=(z0+z1)/2,W=x1-x0,D=z1-z0;const hill=new THREE.Mesh(new THREE.SphereGeometry(1,12,7,0,TAU,0,Math.PI/2),mc('#7e7266',{rough:1}));hill.scale.set(W*.42,2.2,D*.42);hill.position.set(cx,0,cz);world.add(hill);
for(let i=0;i<6;i++){const b=box(cx+(rn()-.5)*W*.6,1+rn()*2.5,cz+(rn()-.5)*D*.6,.2,.2,3+rn()*3,mc('#2a201a'),{collide:false});b.rotation.set((rn()-.5)*1.1,rn()*3,(rn()-.5)*.8);}
for(let i=0;i<2;i++){const s=box(cx+(rn()-.5)*W*.5,h*(.25+rn()*.25),cz+(rn()-.5)*D*.5,W*.4,.25,D*.3,mc('#8a7e70'),{collide:false});s.rotation.set((rn()-.5)*.7,0,(rn()-.5)*.7);}
obstacles.push({x0,x1,z0,z1});hooks.push(dt=>{if(Math.random()<dt*.12)puff(x0+Math.random()*W,.6,z0+Math.random()*D,.6,0xb8aa98,3,.3,.15,0);});}
function bancarella(x,z,ry,goods){const g=new THREE.Group(),w=mc('#6a4a30');const t=new THREE.Mesh(CG.box,mat(texWood()));t.scale.set(1.8,.08,.8);t.position.y=.82;g.add(t);
for(const [dx,dz] of [[-.82,-.34],[.82,-.34],[-.82,.34],[.82,.34]]){const l=new THREE.Mesh(CG.box,w);l.scale.set(.06,.82,.06);l.position.set(dx,.41,dz);g.add(l);}
for(const dx of [-.9,.9]){const p=new THREE.Mesh(CG.box,w);p.scale.set(.05,2.2,.05);p.position.set(dx,1.1,-.38);g.add(p);}
const aw=new THREE.Mesh(CG.box,mat(texAwning()));aw.scale.set(2,.05,1.1);aw.position.set(0,2.15,.1);aw.rotation.x=-.25;g.add(aw);
for(let i=0;i<(goods||5);i++){const b=new THREE.Mesh(CG.box,mc(pick(['#c8a050','#8a9a4a','#b84a30','#d8c8a0','#7a6a5a','#e8a040'])));b.scale.set(.2,.14,.18);b.position.set(-.7+i*.32,.93,(i%2)*.2-.1);g.add(b);}
g.position.set(x,0,z);g.rotation.y=ry||0;world.add(g);const c=Math.abs(Math.cos(ry||0)),s=Math.abs(Math.sin(ry||0));obstacles.push({x0:x-(1*c+.45*s),x1:x+(1*c+.45*s),z0:z-(1*s+.45*c),z1:z+(1*s+.45*c)});}
function insegna(txt,x,y,z,ry,w,bg,fg){return plane(w,.5,mat(texSign(txt,bg||'#e8dcc0',fg||'#7a2a20',txt.length*7+14),{double:true}),x,y,z,ry);}
function napoliOvest(time){const night=time==='night',war=time==='war',dim=night||war,day=!night&&!war,rn=mulberry(4646),B=(cx,cz,w,d,h,c)=>building(cx,cz,w,d,h,c||rpick(rn,NAPX),dim);
const HN=2.5,H=(x,z)=>z>=9?0:z<=-14?HN:HN*(9-z)/23,from=world.children.length;AUTOY=true;
ramps.push({x0:-66,x1:-25,z0:-14,z1:9,h0:HN,h1:0,ax:'z'},{x0:-66,x1:-8.5,z0:-28,z1:-14,h0:HN,h1:HN},{x0:-25,x1:-10,z0:-30.5,z1:-28,h0:HN,h1:HN},{x0:-10,x1:-4,z0:-30.5,z1:-28,h0:HN,h1:0,ax:'x'},{x0:-66,x1:-8.5,z0:-58,z1:-30.5,h0:HN,h1:HN});
const bas=texBasoli();ground(5,60,bas,-27.5,-21,2,24,.003,H);ground(30,44,texSlabs(),-45,-23,10,14,.003,H);ground(16.5,20.5,bas,-16.75,-40.75,6,8,HN+.003).userData.noLift=true;ground(15,2.5,bas,-17.5,-29.25,6,1,HN+.003).userData.noLift=true;ground(26,10.5,texSlabs(),-53,14.25,7,3,.003).userData.noLift=true;
{const s1=mc('#b4aa98',{rough:.8}),s2=mc('#d4ccbc',{rough:.7}),pw=mc('#c4b8a2',{rough:.85});for(let i=0;i<12;i++){const x=-10+i*.5,h=HN*(12-i)/12;const a=box(x+.25,0,-29.25,.5,h,1.7,i%2?s1:s2,{collide:false}),b=box(x+.25,h-.04,-29.25,.54,.06,1.74,s2,{collide:false});a.userData.noLift=b.userData.noLift=true;
for(const zz of [-30.2,-28.3]){const pp=box(x+.25,0,zz,.5,h+.9,.28,pw,{collide:false});pp.userData.noLift=true;}}
for(const zz of [-30.2,-28.3]){const cap=box(-7,HN*.5+.95,zz,6.3,.1,.36,s2,{collide:false});cap.rotation.z=-Math.atan2(HN,6);cap.userData.noLift=true;}
wall(-10,-30.5,-4,-30.05);wall(-10,-28.45,-4,-28);}
for(let z=-45;z<-1;){const L=Math.min(rr2(rn,6,9),-1-z);B(-63,z+L/2,6,L,rr2(rn,10,15));z+=L;}
for(let x=-66;x<-30;){const L=Math.min(rr2(rn,6,9),-30-x);if(x>-58&&x<-50){ruin(x,-51,x+L,-45,13,rpick(rn,NAPX),rn);x+=L;continue;}B(x+L/2,-48,L,6,rr2(rn,11,16));x+=L;}
for(let z=-45;z<-14;){const L=Math.min(rr2(rn,7,10),-14-z);B(-33,z+L/2,6,L,rr2(rn,10,14));z+=L;}
B(-19,-7.5,12,13,rr2(rn,10,14));B(-19,-21,12,14,rr2(rn,10,14));
macerie(-12.9,-27.8,-8.7,-22.4);
B(-7.25,-47.5,2.5,7,9);
for(let x=-36;x<-25;){const L=Math.min(rr2(rn,5,8),-25-x);B(x+L/2,-54.5,L,7,rr2(rn,11,15));x+=L;}
B(-9.75,-54.5,2.5,7,11);
{const st=(()=>{const t=texSlabs().clone();t.needsUpdate=true;t.repeat.set(4,4);const m=mat(t);m.color.set('#b8a88e');return m;})(),fz=-51,cx=-17.5;
box(-21.25,0,fz-.4,7.5,13,.8,st,{collide:false,occlude:true});for(let x=-17.5;x<-10;x+=1.25)box(x+.62,0,fz-.4,1.25,4+rn()*5.5,.8,st,{collide:false,occlude:true});
box(-22,13,fz-.4,4.5,2.4,.8,st,{collide:false,occlude:true});box(-24,15.4,fz-.4,1.5,1.2,.8,st,{collide:false,occlude:true});
{const L={scar:{brick:[],pock:[],breach:[],soot:[],board:[],poster:[]},beam:[],rock:[]};L.scar.poster.push([-23.6,1.8+HN,fz+.07,0,.8,1.05,1],[-22.6,1.8+HN,fz+.07,0,.8,1.05,0]);
for(let i=0;i<26;i++)L.rock.push([-16+rn()*7,.1,fz+.6+rn()*2.2,.2+rn()*.6,rn()*3,rn()*3]);flushScars(L);}
for(let x=-24.5;x<-10.5;x+=2.33){box(x+1.16,0,-57.6,2.33,4+rn()*7,.8,st,{collide:false,occlude:true});}for(let z=-57.6;z<-51.4;z+=2.2){box(-24.6,0,z+1.1,.8,4+rn()*6,2.2,st,{collide:false,occlude:true});box(-10.4,0,z+1.1,.8,4+rn()*6,2.2,st,{collide:false,occlude:true});}
obstacles.push({x0:-25,x1:-10,z0:-58,z1:-51});const dx=-21.25;plane(3,5,mc('#120d0b'),dx,2.5,fz+.02);const ar=new THREE.Mesh(new THREE.TorusGeometry(1.55,.22,8,20,Math.PI),st);ar.position.set(dx,5,fz+.05);world.add(ar);
const rose=new THREE.Mesh(new THREE.CircleGeometry(1.4,24),mc('#141010'));rose.position.set(dx,9.2,fz+.02);world.add(rose);const rf=new THREE.Mesh(new THREE.TorusGeometry(1.5,.18,8,28),st);rf.position.set(dx,9.2,fz+.06);world.add(rf);
for(let i=0;i<3;i++)box(dx,0,fz+1.1-i*.35,6-i*.4,.2*(3-i),.7,st,{collide:false,occlude:true});
const hill=new THREE.Mesh(new THREE.SphereGeometry(1,12,7,0,TAU,0,Math.PI/2),mc('#8a7e70',{rough:1}));hill.scale.set(6,3,3);hill.position.set(cx,0,-54.5);world.add(hill);
for(let i=0;i<4;i++){const b=box(cx+(rn()-.5)*10,3+rn()*3,-55+rn()*3,.3,.3,6,mc('#2a201a'),{collide:false});b.rotation.set((rn()-.5)*.8,rn()*3,(rn()-.5)*.5);}}
wall(-30,-58,-25,-57.5);
if(!war){for(const [x,z,r,n] of [[-54,-30,0,4],[-49,-30,0,3],[-44,-30,0,5],[-54,-19,Math.PI,3],[-49,-19,Math.PI,4],[-42,-10,Math.PI/2,3],[-57,-8,-Math.PI/2,5]])bancarella(x,z,r,n);
box(-38.6,0,-38,1.4,.5,.8,mat(texWood()));for(const s of [-1,1]){const wh=new THREE.Mesh(new THREE.TorusGeometry(.32,.05,6,16),mc('#4a3a2a'));wh.position.set(-38.6+s*.5,.32,-37.55);world.add(wh);}
insegna('MERCATO',-36.02,4.2,-22,-Math.PI/2,2.6);insegna('MENSA DEL POPOLO',-12,3.4,-51.2+.6,0,3.6,'#e8dcc0','#7a2a20');}
if(day){const tx=-12.5,tz=-47.8;box(tx,0,tz,3.2,.8,.9,mat(texWood()));const pot=new THREE.Mesh(new THREE.CylinderGeometry(.42,.36,.55,16),mc('#4a4a4e',{rough:.4,metal:.7}));pot.position.set(tx-.8,1.08,tz);world.add(pot);
hooks.push(dt=>{if(Math.random()<dt*4)puff(tx-.8+rr(-.15,.15),1.4+HN,tz+rr(-.15,.15),.25,0xf2f0ea,2.2,.5,.05,0);});for(let i=0;i<5;i++){const b=new THREE.Mesh(new THREE.CylinderGeometry(.09,.07,.1,10),mc('#e8e2d4',{rough:.4}));b.position.set(tx+.1+i*.25,.85,tz+(i%2)*.2-.1);world.add(b);}}
{const bx=-22.5,bz=-33;const br=new THREE.Mesh(new THREE.CylinderGeometry(.4,.3,.7,12,1,true),mc('#3a3434',{rough:.5,metal:.6}));br.position.set(bx,.35,bz);world.add(br);wall(bx-.4,bz-.4,bx+.4,bz+.4);
glowAt(bx,.85,bz,1.6,0xff8a30,true);hooks.push(dt=>{if(Math.random()<dt*7)puff(bx+rr(-.15,.15),.8+HN,bz+rr(-.15,.15),.18,0xff9a40,.5,1.3,0,0,true);if(Math.random()<dt*2)puff(bx,1.3+HN,bz,.5,0x5a5048,3.5,.7,.15,0);});}
const ln=[];for(const z of [-12,-26,-38])ln.push(plane(5,1.2,mat(texLaundry(Math.abs(z)%4),{alpha:true,double:true}),-27.5,rr(5,7),z,0));
for(const x of [-52,-44])ln.push(plane(14,1.2,mat(texLaundry(Math.abs(x)%4),{alpha:true,double:true}),x,rr(6,8),-26,Math.PI/2));
for(const x of [-20,-14])ln.push(plane(4,1.2,mat(texLaundry(Math.abs(x)%4),{alpha:true,double:true}),x,rr(4.5,6),-29.25,0));
hooks.push(()=>{const tt=now();ln.forEach((l,i)=>{l.rotation.z=Math.sin(tt*1.5+i)*.05;});});
for(const [x,z] of [[-29.6,-8],[-29.6,-36],[-37,-42],[-58,-42],[-58,-4],[-24.4,-46],[-10,-33]])lampione(x,z);
box(-53,-1,19.65,26,1.9,.3,mat('#e8e0d0'));wall(-66,19.5,-40,19.8);wall(-66.5,9,-66,20);for(let x=-62;x<-42;x+=8)palm(x,17.4,rr(4.5,6));
const FL=[],far=(cx,cz,w,d,h)=>FL.push([cx,cz,w,d,h]);
for(let x=-80;x<46;x+=9)far(x,-68-rr2(rn,0,6),9,8,rr2(rn,12,22));for(let z=-60;z<6;z+=9)far(-74-rr2(rn,0,4),z,8,9,rr2(rn,12,20));for(let z=-50;z<-30;z+=9)far(46+rr2(rn,0,4),z,8,9,rr2(rn,12,20));
for(let x=-6;x<44;x+=9)far(x,-56,9,6,rr2(rn,10,16));
{const HN2=(x,z)=>Math.max(0,(-70-z)*.24)+Math.sin(x*.03)*3+Math.sin(x*.071+z*.05)*2,HW=(x,z)=>Math.max(0,(-76-x)*.22)+Math.sin(z*.05)*2;
cittaLontana({seed:461,area:[-210,160,-260,-64],H:(x,z)=>z>-66?0:Math.max(0,HN2(x,z)),pal:NAPX,n:280,hmin:7,hmax:15,pines:120,ruins:.22,ground:'#8a8a62',ground2:'#6e7a52',list:FL,avoid:(x,z)=>z>-70&&x>-80&&x<50});
cittaLontana({seed:463,area:[-210,160,-260,-72],H:(x,z)=>Math.max(0,HN2(x,z)),pal:NAPX,n:160,hmin:6,hmax:11,gable:true,ruins:.2,avoid:(x,z)=>z>-74&&x>-80&&x<50});
cittaLontana({seed:462,area:[-230,-77,-64,14],H:(x,z)=>Math.max(0,HW(x,z)),pal:NAPX,n:120,hmin:7,hmax:14,pines:50,ruins:.22,ground:'#8a8a62',ground2:'#6e7a52'});}
AUTOY=false;liftFrom(from);}
function liftFrom(from){const c=new THREE.Vector3();for(const o of world.children.slice(from)){if(o.userData.noLift||o.isInstancedMesh)continue;const p=o.position;let x=p.x,z=p.z;
if((x===0||z===0)&&o.isMesh&&o.geometry){if(!o.geometry.boundingBox)o.geometry.computeBoundingBox();o.geometry.boundingBox.getCenter(c);if(x===0)x=c.x;if(z===0)z=c.z;}
p.y+=heightAt(x,z);}}
const texMadonna=()=>T('madonna',()=>ctex(64,96,g=>{const gr=g.createLinearGradient(0,0,0,96);gr.addColorStop(0,'#2a4a8a');gr.addColorStop(1,'#14244a');g.fillStyle=gr;g.fillRect(0,0,64,96);
g.fillStyle='#e8c060';g.beginPath();g.arc(32,26,15,0,TAU);g.fill();g.fillStyle='#e8c8a8';g.beginPath();g.arc(32,28,8,0,TAU);g.fill();g.fillStyle='#3a5aa8';g.beginPath();g.moveTo(32,18);g.lineTo(52,92);g.lineTo(12,92);g.closePath();g.fill();
g.fillStyle='#f2ece0';g.beginPath();g.moveTo(32,34);g.lineTo(42,88);g.lineTo(22,88);g.closePath();g.fill();for(let i=0;i<10;i++){g.fillStyle='rgba(255,230,140,.6)';g.fillRect(4+i*6,2,2,6);}},false));
function edicola(x,z,ry,y0){y0=(y0||0)+heightAt(x,z);NOWIN.push([x,y0+2.2,z,.9]);const g=new THREE.Group(),st=mc('#ece4d2',{rough:.7}),tr=mc('#c8bca4',{rough:.7});
const fr=(px,py,sx,sy,sz,m)=>{const b=new THREE.Mesh(CG.box,m);b.scale.set(sx,sy,sz);b.position.set(px,py,sz/2);g.add(b);return b;};
fr(0,0,1.1,1.5,.12,st);fr(0,.82,1.3,.16,.32,tr);fr(0,-.8,1.25,.12,.36,tr);fr(-.6,0,.12,1.5,.24,tr);fr(.6,0,.12,1.5,.24,tr);
const pic=new THREE.Mesh(new THREE.PlaneGeometry(.7,1.05),new THREE.MeshStandardMaterial({map:texMadonna(),roughness:.5}));pic.position.set(0,.05,.13);g.add(pic);
const roof=new THREE.Mesh(new THREE.ConeGeometry(.82,.38,4),mat(texRoof()));roof.rotation.y=Math.PI/4;roof.scale.set(1,1,.42);roof.position.set(0,1.08,.2);g.add(roof);
for(let i=0;i<4;i++){const f=new THREE.Mesh(CG.sph,mc(['#e83a48','#f2d23a','#ffffff','#e070a0'][i]));f.scale.setScalar(.09);f.position.set(-.3+i*.2,-.68,.32);g.add(f);}
const lm=new THREE.Mesh(new THREE.CylinderGeometry(.05,.05,.1,8),mc('#c83a30',{rough:.3}));lm.position.set(0,-.68,.3);g.add(lm);
g.position.set(x,y0+2.2,z);g.rotation.y=ry;world.add(g);g.userData.noLift=true;const v=new THREE.Vector3(0,-.55,.4).applyEuler(g.rotation).add(g.position);glowAt(v.x,v.y,v.z,.9,0xffb050,true);}
function panaro(x,z,ry,top){const y0=heightAt(x,z);const rope=box(x,y0,z,.02,1,.02,mc('#c8b890'),{collide:false}),bk=box(x,y0,z,.4,.34,.4,mc('#b08a4a'),{collide:false});rope.userData.noMerge=bk.userData.noMerge=rope.userData.noLift=bk.userData.noLift=true;
const ph=Math.random()*9;hooks.push(()=>{const tt=now(),k=.5+.5*Math.sin(tt*.35+ph),yb=y0+1.1+k*(top-y0-2.2),sw=Math.sin(tt*1.3+ph)*.05;bk.position.set(x+sw,yb,z);bk.rotation.z=sw;const L=top-yb-.17;rope.scale.y=Math.max(.05,L);rope.position.set(x+sw*.5,yb+.17+L/2,z);});}
function vesuvio(){const prof=[];for(let i=0;i<=24;i++){const k=i/24,r=k<.88?95*(1-k)+9:9-(k-.88)/.12*3,y=k<.88?Math.pow(k/.88,1.25)*58:58-(k-.88)/.12*4;prof.push(new THREE.Vector2(Math.max(.5,r),y));}
const g=new THREE.LatheGeometry(prof,64),p=g.attributes.position,col=new Float32Array(p.count*3),c=new THREE.Color(),lo=new THREE.Color('#8e98aa'),hi=new THREE.Color('#a6a2b4');
for(let i=0;i<p.count;i++){const x=p.getX(i),y=p.getY(i),z=p.getZ(i),a=Math.atan2(z,x),gul=Math.sin(a*23)*.5+Math.sin(a*41+y*.2)*.3;const s=1+gul*.025*(1-y/60);p.setX(i,x*s);p.setZ(i,z*s);c.copy(lo).lerp(hi,Math.min(1,y/45));col.set([c.r,c.g,c.b],i*3);}
g.setAttribute('color',new THREE.BufferAttribute(col,3));g.computeVertexNormals();const m=new THREE.MeshStandardMaterial({vertexColors:true,roughness:1,flatShading:true,fog:false,envMapIntensity:.2});
const v=new THREE.Mesh(g,m);v.position.set(150,-2,340);v.scale.setScalar(.85);world.add(v);
const sp=[];for(let i=0;i<=10;i++){const k=i/10;sp.push(new THREE.Vector2(130*(1-k)+70*k,k<.8?k/.8*42:42-(k-.8)/.2*6));}
const sg=new THREE.LatheGeometry(sp,48,Math.PI*.15,Math.PI*.95),sm=new THREE.Mesh(sg,new THREE.MeshStandardMaterial({color:'#98a0b0',roughness:1,flatShading:true,fog:false,envMapIntensity:.2}));sm.scale.setScalar(.85);sm.position.set(155,-2,347);sm.rotation.y=Math.PI*.55;world.add(sm);}
function castello(){const st=kmat('castelloS',()=>{const t=texSlabs().clone();t.needsUpdate=true;t.repeat.set(3,3);const m=mat(t);m.color.set('#c8b896');return m;}),sc=mc('#9a8c74',{rough:1});
const X=88,Z=52;for(let i=0;i<14;i++){const r=new THREE.Mesh(new THREE.DodecahedronGeometry(3+Math.random()*3,0),sc);r.position.set(X-14+Math.random()*28,-1.5,Z-9+Math.random()*18);r.rotation.set(Math.random()*3,Math.random()*3,0);world.add(r);}
box(X,-1,Z,26,9,16,st);box(X-3,8,Z-1,18,5,12,st);box(X+9,8,Z+3,8,3,8,st);
for(const [dx,dz,h] of [[-13,-8,13],[13,-8,12],[-13,8,12],[13,8,14],[-4,-8,15]]){const tw=new THREE.Mesh(new THREE.CylinderGeometry(2.6,3.1,h,12),st);tw.position.set(X+dx,h/2-1,Z+dz);world.add(tw);
for(let k=0;k<8;k++){const a=k/8*TAU;box(X+dx+Math.cos(a)*2.4,h-1,Z+dz+Math.sin(a)*2.4,.8,.8,.8,st,{collide:false});}}
for(let x=-12;x<=12;x+=2)for(const s of [-1,1])box(X+x,8,Z+s*8,.9,.9,.6,st,{collide:false});
for(let x=44;x<X-13;x+=4){box(x+2,1.2,30,4,.8,4,st,{collide:false});box(x,-1,30,.9,2.2,3,st,{collide:false});}}
function vesuvioFumo(){const list=[];for(let i=0;i<7;i++){const m=new THREE.SpriteMaterial({map:texPuff(),color:0xd8d4d0,transparent:true,depthWrite:false,opacity:0,fog:false});const sp=new THREE.Sprite(m);world.add(sp);list.push({sp,m,t:i/7});}
hooks.push(dt=>{for(const p of list){p.t+=dt/26;if(p.t>1)p.t-=1;const k=p.t;p.sp.position.set(150+k*26,47+k*30,340+k*4);const s=8+k*30;p.sp.scale.set(s,s*.7,1);p.m.opacity=Math.sin(k*Math.PI)*.42;}});}
function miseria(){const rn=mulberry(3131),L={crate:[],sack:[],rag:[],paper:[],can:[]},col={crate:['#6a4a30','#5a4028','#7a5a3a'],sack:['#8a7a5a','#7a6a4a','#9a8a6a'],rag:['#6a5a5a','#4a4a5a','#7a5a4a','#5a6a5a','#8a7a6a'],paper:['#d8d0bc','#c8bca4','#e0d8c4'],can:['#7a7a7e','#5a5a60','#8a6a4a']};
const free=(x,z)=>{for(const b of obstacles)if(x>b.x0-.05&&x<b.x1+.05&&z>b.z0-.05&&z<b.z1+.05)return false;return true;};
const lines=[[-2.2,8,-2.2,-43],[2.2,8,2.2,-43],[-60,9.5,38,9.5],[-29.5,8,-29.5,-50],[-25.5,-1,-25.5,-27],[-59.4,-2,-59.4,-44],[-59,-44.4,-37,-44.4],[-24.5,-31,-24.5,-50],[-24,-50.4,-11,-50.4],[-6.6,-12.5,-6.6,-21.5],[6.6,-12.5,6.6,-19]];
for(const [ax,az,bx,bz] of lines){const len=Math.hypot(bx-ax,bz-az),n=Math.round(len/2.2);for(let i=0;i<n;i++){const t=rn(),x=ax+(bx-ax)*t+(rn()-.5)*.5,z=az+(bz-az)*t+(rn()-.5)*.5;if(!free(x,z))continue;
const y=heightAt(x,z),k=rpick(rn,['crate','sack','rag','rag','paper','paper','can','can']);L[k].push([x,y,z,rn()*TAU,rpick(rn,col[k]),rn()]);
if(rn()<.5){const x2=x+(rn()-.5)*.8,z2=z+(rn()-.5)*.8;if(free(x2,z2))L.paper.push([x2,heightAt(x2,z2),z2,rn()*TAU,rpick(rn,col.paper),rn()]);}}}
const G={crate:new THREE.BoxGeometry(.5,.32,.38),sack:new THREE.SphereGeometry(.3,8,6),rag:new THREE.BoxGeometry(.7,.04,.5),paper:new THREE.BoxGeometry(.28,.01,.2),can:new THREE.CylinderGeometry(.06,.06,.13,8)};
const m4=new THREE.Matrix4(),q=new THREE.Quaternion(),e=new THREE.Euler(),v=new THREE.Vector3(),s=new THREE.Vector3(),c=new THREE.Color();
for(const k in L){const list=L[k];if(!list.length)continue;const im=new THREE.InstancedMesh(G[k],new THREE.MeshStandardMaterial({color:'#ffffff',roughness:.95,flatShading:k!=='can',metalness:k==='can'?.5:0,envMapIntensity:.25}),list.length);
list.forEach(([x,y,z,r,cc,j],i)=>{let sy=1,yy=y;if(k==='crate'){yy+=.16;e.set((j-.5)*.3,r,(j-.5)*.4);}else if(k==='sack'){s.set(1,.62,.8);yy+=.15;e.set(0,r,0);}else if(k==='can'){yy+=j<.5?.065:.06;e.set(j<.5?0:Math.PI/2,r,0);}else{yy+=.015;e.set((j-.5)*.08,r,(j-.5)*.08);}
q.setFromEuler(e);m4.compose(v.set(x,yy,z),q,k==='sack'?s:s.set(1,1,1));im.setMatrixAt(i,m4);im.setColorAt(i,c.set(cc));});im.castShadow=k==='crate'||k==='sack';im.receiveShadow=true;im.userData.noMerge=true;world.add(im);}
for(const [x,z] of [[-.8,-9],[1.2,-24],[-1,-38],[-27,-6],[-45,-30],[-16,-40],[10,13],[-20,14]]){const y=heightAt(x,z),r=.5+rn()*.6;
const hole=new THREE.Mesh(new THREE.CircleGeometry(r,14),new THREE.MeshStandardMaterial({color:'#2a2622',roughness:1}));hole.rotation.x=-Math.PI/2;hole.position.set(x,y+.02,z);hole.scale.set(1,.6+rn()*.5,1);world.add(hole);
const wat=new THREE.Mesh(new THREE.CircleGeometry(r*.7,14),new THREE.MeshStandardMaterial({color:'#3a4048',roughness:.05,metalness:.6,envMapIntensity:1.4}));wat.rotation.x=-Math.PI/2;wat.position.set(x,y+.025,z);wat.scale.copy(hole.scale);world.add(wat);
for(let i=0;i<6;i++){const a=rn()*TAU,st=box(x+Math.cos(a)*r*1.05,y,z+Math.sin(a)*r*.8,.18,.06,.14,mc('#4a4650'),{collide:false});st.rotation.set(rn()*.4,rn()*3,rn()*.4);}}}
function buildNapoli(time){clearWorld();R=mulberry(1946);const night=time==='night',war=time==='war';setEnv(time);onTitle=false;NAPX=time==='y1994'?NAP:NAPW;WREC=time==='y1994'?null:[];
ground(26,57.5,texBasoli(),0,-19.75,13,29);
const segs={L:[[9,-12,2.5],[-12,-22,7],[-22,-28,2.5],[-30.5,-44,2.5]],Rt:[[9,-12,2.5],[-12,-19.4,7],[-22,-44,2.5]]};
for(const side of [-1,1]){for(const [z0,z1,edge] of (side<0?segs.L:segs.Rt)){let z=z0;while(z>z1+.01){let L=Math.min(rr(4,7),z-z1);if(z-L-z1<2)L=z-z1;const h=rr(7,13);building(side*(edge+3),z-L/2,6,L,h,pick(NAPX),night||war);
if(night&&R()<.7){const wy=rr(3,h-1),wz=z-L/2+rr(-1,1);plane(.7,.9,mat('#ffcf6a',{basic:true}),side*(edge-.02),wy,wz,side<0?Math.PI/2:-Math.PI/2);glowAt(side*(edge-.3),wy,wz,1.7,0xffc060);}z-=L;}}}
{const rc=[];for(const side of [-1,1])for(const [z0,z1,edge] of (side<0?segs.L:segs.Rt))rc.push([Math.min(side*edge,side*(edge-.3)),z1,Math.max(side*edge,side*(edge-.3)),z0]);grass(rc,war?120:320,{h:.16,hue:.2});}
for(const side of [-1,1]){let x=8.5;const xe=side<0?66:40;while(x<xe){let w=rr(5,8);if(side<0&&x<25&&x+w>25)w=25-x;if(side<0&&x>=25&&x<30){x=30;continue;}if(side<0&&x+w>66)w=66-x;const h=rr(9,15);building(side*(x+w/2),4,w,10,h,pick(NAPX),night||war);if(time==='y1994'&&R()<.6)box(side*(x+w/2),h,4,.08,1.6,.08,mat('#3a3a3a'),{collide:false});x+=w;}}
ground(80,10.5,texSlabs(),0,14.25,20,3);
building(0,-46.5,12,5,7,'#b7b2a6',night||war);
plane(3.6,.55,mat(texSign('STAZIONE','#e8e0c8','#2a2420')),0,4.78,-43.45);
plane(2.4,2.8,mat('#120e14',{basic:true}),0,1.4,-43.97);
plane(1.4,2.2,mat(texDoor()),-2.48,1.1,1,Math.PI/2);{const mj=ground(1.3,1.5,texMajolica(),-1.82,1,1.3,1.5,.012);mj.material.roughness=.32;mj.material.envMapIntensity=.7;}
plane(2.2,.5,mat(texSign('CIABATTINO','#4a3a2a','#e9c46a',80)),2.48,2.7,-5,-Math.PI/2);
plane(1.4,2.2,mat(texDoorPCI()),6.98,1.1,-16,-Math.PI/2);
if(!war){plane(2.8,.55,mat(texSign('SEZIONE P.C.I.','#b8302a','#ffffff')),6.98,2.75,-16,-Math.PI/2);box(6.4,0,-14.4,.08,3.6,.08,mat('#3a3030'),{collide:false});const flag=plane(.9,.55,mat('#c8302a',{double:true}),6.4,3.3,-14.0,Math.PI/2);hooks.push(()=>{flag.rotation.y=Math.PI/2+Math.sin(now()*3)*.25;});}
plane(1,1.5,mat(texEdicola()),-6.98,2,-18,Math.PI/2);
if(war){plane(2.6,.55,mat(texSign('RICOVERO ►','#e8e4d8','#1a1a1a')),-6.98,2.6,-12.4,Math.PI/2);plane(1.6,2.2,mat('#0a0606',{basic:true}),-6.97,1.1,-14.4,Math.PI/2);}
fontana(0,-17);
const laund=[];const lz=time==='y1994'?[3,-6,-27,-36]:[5,1,-3,-7,-10,-25,-29,-33,-37,-41];lz.forEach((z,i)=>laund.push(plane(5,1.25,mat(texLaundry(i%4),{alpha:true,double:true}),0,rr(3.6,7),z,0)));
hooks.push(()=>{const tt=now();laund.forEach((l,i)=>{l.rotation.x=Math.sin(tt*1.6+i)*.15;});});
vicolo(night,war);
napoliOvest(time);if(time!=='y1994')miseria();
box(-33.05,-1,19.65,13.9,1.9,.3,mat('#e8e0d0'));box(-12.8,-1,19.65,18.4,1.9,.3,mat('#e8e0d0'));box(23.2,-1,19.65,33.6,1.9,.3,mat('#e8e0d0'));
for(let x=-39;x<40;x+=1.2){if(x>3.4&&x<6.6||x>-26.4&&x<-21.6)continue;box(x,.9,19.65,.12,.02,.12,mat('#e8e0d0'),{collide:false});}
for(const [x,z,w,d] of [[3.2,20.6,1.8,1.6],[5,21.4,2.2,1.6],[7.2,20.8,1.8,1.8],[4.2,22.6,2,1.4],[6.6,22.6,2.2,1.4],[8.6,21.8,1.4,1.6],[2.4,22.2,1.3,1.5]]){const r=box(x,-.6,z,w,.66,d,mat(pick(['#7a746c','#6a6660','#857e74'])),{collide:false});r.rotation.y=rr(-.3,.3);}
wall(-40,19.5,-26.1,19.8);wall(-21.9,19.5,3.6,19.8);wall(6.4,19.5,40,19.8);wall(1.7,19.8,2,23.5);wall(9.3,19.8,9.6,23.5);wall(1.7,23.3,9.6,23.6);wall(38,9,40,20);
waterArea(0,120,420,200,20);
for(let x=-34;x<36;x+=8){if(Math.abs(x-5)<3)continue;palm(x,17.4,rr(4.5,6));box(x+2,0,18.6,1.6,.45,.5,mat('#6a4a30'),{collide:true});}
box(-12,0,14,1.8,1.1,1.2,mat('#e8dcc0'));box(-12,2.2,14,2.4,.15,1.8,mat(texAwning()),{collide:false});for(const [dx,dz] of [[-1,-.7],[1,-.7],[-1,.7],[1,.7]])box(-12+dx,0,14+dz,.08,2.2,.08,mat('#6a4a30'),{collide:false});for(let i=0;i<5;i++)box(-12.6+i*.3,1.1,13.6,.18,.18,.18,mat('#f5d23a'),{collide:false});
plane(2.4,.45,mat(texSign('ACQUAFRESCAIO','#3a6ab0','#ffffff')),-12,2.6,14.92);
for(const [x,z,c] of [[-8,26,'#3a6ab0'],[12,31,'#d23a30'],[-20,36,'#e9c46a'],[24,40,'#3a8a5a'],[0,48,'#3a6ab0']])boat(x,z,c);
vesuvio();castello();
const cst=mat('#c8b8c8',{fog:false});const cs=new THREE.Mesh(new THREE.BoxGeometry(260,6,10),cst);cs.position.set(-40,1,250);world.add(cs);const cap=new THREE.Mesh(new THREE.ConeGeometry(18,12,6),mat('#b0a8c8',{fog:false}));cap.position.set(-90,4,240);world.add(cap);
const ov=mat('#d9c9a0');box(-30,-.5,50,9,4,7,ov,{collide:false});box(-33,3.5,50,3,2.5,3,ov,{collide:false});box(-27,3.5,48,2,1.6,2,ov,{collide:false});box(-30,-.5,40,1.5,.8,10,ov,{collide:false});
if(!war&&!night)gulls(0,40,6,9);
if(time!=='war')pigeons(0,-17,7);
if(night||time==='dusk'){[[-2.35,-2],[0,-17],[2.35,-27],[-2.35,-38]].forEach(([x,z])=>{box(x,2.8,z,.25,.35,.25,mat('#ffcf6a',{basic:true}),{collide:false});const l=plight(0xffb860,night?1.4:.7,10);l.position.set(x*.8,3,z);world.add(l);glowAt(x,2.95,z,night?2.6:1.8,0xffb860,true);});}
if(war){for(const [x,z] of [[-2.2,-9],[2.3,-21],[-6.4,-19.5],[1.8,-2.5]]){const fl=plight(0xff7a30,1.6,9);fl.position.set(x,1.4,z);world.add(fl);glowAt(x,.9,z,3.4,0xff7a30,true);hooks.push(dt=>{fl.intensity=(1.2+Math.random()*.9)*.55;if(Math.random()<dt*9)puff(x+rr(-.3,.3),.3,z+rr(-.3,.3),.35,0xff8a30,.7,1.6,0,0,true);if(Math.random()<dt*3)puff(x,1,z,.8,0x2a2020,3,1.2,.2,0);});box(x,0,z,.9,.45,.9,mat('#5a5048'),{collide:false});}
const beams=[];for(const [x,z,ph] of [[-20,-60,0],[15,-70,2],[40,-30,4]]){const g=new THREE.CylinderGeometry(3,.2,110,10,1,true);g.translate(0,55,0);const b=new THREE.Mesh(g,new THREE.MeshBasicMaterial({color:0xfff6d0,transparent:true,opacity:.09,depthWrite:false,blending:THREE.AdditiveBlending,fog:false,side:THREE.DoubleSide}));b.position.set(x,0,z);world.add(b);beams.push([b,ph]);}
hooks.push(()=>{const tt=now();beams.forEach(([b,ph])=>{b.rotation.z=Math.sin(tt*.4+ph)*.5;b.rotation.x=Math.cos(tt*.33+ph)*.3;});});
hooks.push(dt=>{if(Math.random()<dt*1.5)puff(rr(-8,8),rr(8,12),rr(-40,0),1.6,0x3a2a28,5,.6,.3,0);});}
if(!night&&!war){motes(time==='sunset'||time==='dusk'?0xffb070:0xfff0c0);leaves(time==='y1994'?12:6);
const sc=time==='day'?0xffe2a8:0xffa860,so=time==='day'?.22:.26;for(const z of [6,-1.5,-8,-25,-33,-40]){shaft(rr(-.6,.6),4.6,z,1.7,11,0,.48,sc,so);shaft(rr(-.6,.6),4.6,z-.4,1.2,11,Math.PI/2,.48,sc,so*.5);}}
{const LY=3,bases=NAPX;
building(12.75,-25,8.5,6,rr(8,11),pick(bases),night||war);building(19,-16.2,12,6.4,rr(9,12),pick(bases),night||war);
building(21,-25.2,8,6.4,rr(9,12),pick(bases),night||war);
ground(11,3.2,texBasoli(),12,-20.7,5.5,1.6,.004);
ramps.push({x0:17,x1:25,z0:-22.2,z1:-19.2,h0:0,h1:LY,ax:'x'},{x0:24.95,x1:37.2,z0:-28.2,z1:-12.8,h0:LY,h1:LY});
const stone=mc('#b4aa98',{rough:.8}),edge=mc('#d4ccbc',{rough:.7});
for(let i=0;i<16;i++){const x=17+i*.5,y=(i+1)*LY/16;box(x+.25,0,-20.7,.5,y,2.6,i%2?stone:edge,{collide:false});box(x+.25,y-.04,-20.7,.54,.06,2.62,edge,{collide:false});}
for(const s of [-1,1]){const rl=new THREE.Mesh(new THREE.CylinderGeometry(.035,.035,8.6,6),mc('#2a2428',{rough:.4,metal:.6}));rl.rotation.z=Math.PI/2-Math.atan2(LY,8);rl.position.set(21,LY/2+.95,-20.7+s*1.2);world.add(rl);
for(let x=17.5;x<25;x+=1.5){const p=box(x,(x-17)/8*LY,-20.7+s*1.2,.04,.95,.04,mc('#2a2428',{rough:.4,metal:.6}),{collide:false});}}
box(31,0,-20.5,12,LY,15,mc('#8a7e6e'),{collide:false});ground(12,15,texBasoli(),31,-20.5,6,7.5,LY+.01);
building(31,-10,12,6,rr(8,11),pick(bases),night||war);building(40,-20.5,6,15,10,'#e8dcc4',night||war);building(31,-31,12,6,rr(7,10),pick(bases),night||war);
{const fx=36.95,fm=mc('#efe6d2',{rough:.7}),tr=mc('#c8bca4',{rough:.7});box(fx-.2,LY,-20.5,.4,6.6,6,fm,{collide:false});
for(const z of [-23,-18])box(fx-.45,LY,z,.3,5.6,.5,tr,{collide:false});box(fx-.45,LY+5.6,-20.5,.5,.3,6.2,tr,{collide:false});
{const sh=new THREE.Shape();sh.moveTo(-3.2,0);sh.lineTo(3.2,0);sh.lineTo(0,1.5);sh.lineTo(-3.2,0);const ped=new THREE.Mesh(new THREE.ExtrudeGeometry(sh,{depth:.35,bevelEnabled:false}),tr);ped.rotation.y=-Math.PI/2;ped.position.set(fx-.1,LY+5.9,-20.5);world.add(ped);}
plane(1.6,2.8,mc('#2a1e16'),fx-.41,LY+1.4,-20.5,-Math.PI/2);plane(1.8,.2,tr,fx-.42,LY+2.9,-20.5,-Math.PI/2);
const rose=new THREE.Mesh(new THREE.CircleGeometry(.55,24),mc('#3a4a6a',{rough:.2,env:.8}));rose.position.set(fx-.41,LY+4.3,-20.5);rose.rotation.y=-Math.PI/2;world.add(rose);
const rf=new THREE.Mesh(new THREE.TorusGeometry(.6,.08,8,24),tr);rf.position.copy(rose.position);rf.position.x-=.02;rf.rotation.y=Math.PI/2;world.add(rf);
for(let i=0;i<3;i++)box(fx-.9-i*.35,LY,-20.5,.35,.15*(3-i),2.6-i*.1,edge,{collide:false});
const bell=new THREE.Mesh(new THREE.CylinderGeometry(.12,.3,.4,12),mc('#8a6a3a',{rough:.35,metal:.8}));bell.position.set(fx-.3,LY+7.9,-20.5);world.add(bell);box(fx-.3,LY+7.5,-20.5,.3,1.2,.9,fm,{collide:false});}
{const tx=30,tz=-17;const tk=new THREE.Mesh(new THREE.CylinderGeometry(.22,.38,3,8),mc('#6a5a48'));tk.position.set(tx,LY+1.5,tz);world.add(tk);
const cm2=new THREE.MeshStandardMaterial({color:'#5a7a3c',roughness:.95,flatShading:true,envMapIntensity:.3});for(let i=0;i<14;i++){const s=new THREE.Mesh(new THREE.IcosahedronGeometry(1,0),cm2);const a=i/14*TAU*2.2,r=i<4?.4:1.6+R()*.5;s.scale.set(.8+R()*.5,.6+R()*.35,.8+R()*.5);s.rotation.set(R()*3,R()*3,0);s.position.set(tx+Math.cos(a)*r,LY+4.1+R()*.9+(i<4?.7:0),tz+Math.sin(a)*r);world.add(s);}for(const a of [0,2.1,4.2]){const b=box(tx+Math.cos(a)*.6,LY+2.6,tz+Math.sin(a)*.6,.12,1.5,.12,mc('#6a5a48'),{collide:false});b.rotation.set(Math.sin(a)*.6,0,-Math.cos(a)*.6);}
box(tx,LY,tz,1.5,.5,1.5,mc('#9a9080'));const bx=27.4,bz=-17;box(bx,LY,bz,.5,.42,1.8,mc('#6a4a30'));box(bx-.22,LY+.42,bz,.08,.45,1.8,mc('#6a4a30'),{collide:false});
busy(C.carmela,bx+.05,bz-.4,'knit',{fx:1,fz:0,seat:.42});}
macerie(25.6,-27.6,32.6,-24.2,LY);
{const tub=new THREE.Mesh(new THREE.CylinderGeometry(.42,.34,.4,16,1,true),mc('#8a8a8e',{rough:.4,metal:.6}));tub.position.set(34.8,LY+.2,-14.4);world.add(tub);wall(34.4,-14.8,35.2,-14);
busy(C.lavandaia,34.8,-15.2,'wash',{fx:0,fz:1});}
if(!war){const lz2=[-14.5,-26.8];lz2.forEach((z,i)=>{const l=plane(10,1.2,mat(texLaundry((i+2)%4),{alpha:true,double:true}),31,LY+5.2,z,0);hooks.push(()=>{l.rotation.x=Math.sin(now()*1.4+i)*.18;});});}
}
{const px=-24,z0=19.6,z1=36,zm=(z0+z1)/2;box(px,-1.5,zm,4,1.5,z1-z0,mc('#6a6258'),{collide:false});ground(4,z1-z0,texWood(),px,zm,1.5,7,.012).material.roughness=.85;
for(let z=z0+1.2;z<z1;z+=2.4)for(const s of [-1,1]){const p=new THREE.Mesh(new THREE.CylinderGeometry(.13,.15,2.2,8),mc('#4a3a2a'));p.position.set(px+s*2.02,-.9,z);world.add(p);}
for(const [x,z] of [[px-1.7,23],[px+1.7,28.5],[px-1.7,34]]){const b=new THREE.Mesh(new THREE.CylinderGeometry(.14,.18,.42,10),mc('#3a3a3e',{rough:.4,metal:.6}));b.position.set(x,.21,z);world.add(b);const t=new THREE.Mesh(new THREE.TorusGeometry(.26,.06,6,16),mc('#c8b080',{rough:.95}));t.rotation.x=Math.PI/2;t.position.set(x+.35,.07,z+.2);world.add(t);wall(x-.2,z-.2,x+.2,z+.2);}
for(const s of [-1,1])box(px+s*2,0,zm+.2,.12,.14,z1-z0-.4,mc('#4a3a2a'),{collide:false});
for(const [x,z] of [[px+1.3,21.5],[px+1.5,22.4]]){box(x,0,z,.6,.45,.6,mat(texWood()));for(let i=0;i<4;i++)box(x-.15+(i%2)*.3,.45,z-.15+(i>>1)*.3,.25,.06,.12,mc('#9aa8b0',{rough:.3,metal:.3}),{collide:false});}
{const nc=document.createElement('canvas');nc.width=nc.height=64;const ng=nc.getContext('2d');ng.strokeStyle='#5a6a5a';ng.lineWidth=2;for(let i=0;i<=64;i+=8){ng.beginPath();ng.moveTo(i,0);ng.lineTo(i,64);ng.stroke();ng.beginPath();ng.moveTo(0,i);ng.lineTo(64,i);ng.stroke();}
const nt=new THREE.CanvasTexture(nc);nt.wrapS=nt.wrapT=THREE.RepeatWrapping;nt.repeat.set(3,2);const net=plane(2.4,1.6,new THREE.MeshStandardMaterial({map:nt,transparent:true,alphaTest:.3,side:THREE.DoubleSide,roughness:.9}),px-1.2,.05,30.5,0);net.rotation.x=-Math.PI/2+.08;net.rotation.z=.4;
const fl=[];for(let i=0;i<5;i++){const f=new THREE.Mesh(new THREE.SphereGeometry(.07,8,6),mc('#e0a030',{rough:.5}));f.position.set(px-2.2+i*.5,.08,30+((i%2)*.6));world.add(f);}}
const lp=new THREE.Mesh(new THREE.CylinderGeometry(.06,.08,3.4,8),mc('#2a2a30',{rough:.4,metal:.6}));lp.position.set(px+1.6,1.7,35.4);world.add(lp);box(px+1.6,3.4,35.4,.3,.36,.3,mc('#fff0c8',{basic:true}),{collide:false});if(night||time==='dusk')glowAt(px+1.6,3.55,35.4,2.2,0xffc070,true);
wall(px-2.15,z0+.4,px-1.95,z1);wall(px+1.95,z0+.4,px+2.15,z1);wall(px-2.1,z1-.15,px+2.1,z1+.2);
boat(px+3.4,27,'#d23a30');world.children[world.children.length-1].rotation.y=Math.PI/2;boat(px-3.5,32,'#3a6ab0');world.children[world.children.length-1].rotation.y=Math.PI/2+.2;
if(!war){const fish=busy(C.pescatore,px+1.62,32,'fish',{fx:1,fz:0,seat:.05,name:''});fish.watch=false;}}
{const fz=-43.92,fm=mc('#d8d0bc',{rough:.7}),tr=mc('#bfb39a',{rough:.7});
for(const x of [-2.1,2.1])box(x,0,fz+.18,.5,4.6,.36,tr,{collide:false});box(0,4.6,fz+.22,5,.35,.44,tr,{collide:false});box(0,0,fz+.12,5,.5,.24,mc('#8a8274'),{collide:false});
const arch=new THREE.Mesh(new THREE.TorusGeometry(1.25,.16,8,20,Math.PI),tr);arch.position.set(0,2.8,fz+.2);world.add(arch);
const ck=new THREE.Mesh(new THREE.CircleGeometry(.55,32),mc('#f2ecdf',{rough:.4}));ck.position.set(0,5.9,fz+.46);world.add(ck);const rim=new THREE.Mesh(new THREE.TorusGeometry(.58,.06,8,32),mc('#3a3a3e',{rough:.3,metal:.7}));rim.position.copy(ck.position);world.add(rim);
const hd2=(l,w)=>{const g=new THREE.BoxGeometry(w,l,.02);g.translate(0,l/2,0);const m=new THREE.Mesh(g,mc('#1a1a1a'));m.position.set(0,5.9,fz+.48);m.userData.noMerge=true;world.add(m);return m;},hh=hd2(.3,.05),mh=hd2(.45,.035);
hooks.push(()=>{const d=new Date(),m=(d.getMinutes()+d.getSeconds()/60)/60;hh.rotation.z=-((10+m)/12)*TAU;mh.rotation.z=-m*TAU;});}
if(!war){basso(-2.5,-6.6,-1);basso(2.5,-29,1);basso(-2.5,-36.6,-1);sedia(-2,-37.6,Math.PI/2);sedia(2,-27.6,-Math.PI/2);sedia(-2,-35.4,Math.PI/2);
busy(C.vicinaG,-1.98,-35.4,'knit',{fx:1,fz:0,seat:.47});
{const tub=new THREE.Mesh(new THREE.CylinderGeometry(.4,.32,.38,16,1,true),mc('#8a8a8e',{rough:.4,metal:.6}));tub.position.set(1.9,.19,4.6);world.add(tub);wall(1.5,4.2,2.3,5);busy(C.lavandaia,1.95,3.75,'wash',{fx:0,fz:1});}
const sw=busy(C.castagnaro,-5.4,-21.2,'sweep',{fx:1,fz:.3});sw.watch=false;}
chatter(.18);
if(time==='y1994'){for(const [x,z,c] of [[2,-3,'#6ab08a'],[-2,-20,'#3a6ab0'],[-6,12,'#e8d080']]){box(x,0,z,.5,.55,1.3,mat(c));box(x,.55,z-.3,.4,.35,.4,mat(c),{collide:false});}}
if(!war){for(const [x,z,ry] of [[-29.95,-24,Math.PI/2],[-59.95,-20,Math.PI/2],[-8.55,-38,-Math.PI/2],[-2.45,-3,Math.PI/2],[-18,-27.95,Math.PI]])edicola(x,z,ry);
for(const [x,z,top] of [[-29.7,-12,7],[-59.7,-30,8],[2.2,-24,6.5],[-8.8,-44,8]])panaro(x,z,0,top+heightAt(x,z));}
if(time!=='war'&&time!=='night')vesuvioFumo();
if(time==='day')for(const [x,y,z] of [[-34,10,-78],[18,12,-95],[-80,10,-90]])hooks.push(dt=>{if(Math.random()<dt*1.1)puff(x+rr(-2,2),y,z+rr(-2,2),9+Math.random()*4,0x4e4a46,11,2.6,.8,.15);});
if(time==='day'){carretto(-60,30,11.2,{col:'#5a4a40',load:'#8a7a5a',def:poor(C.castagnaro)});
for(let i=0;i<3;i++){const a=actor(poor(pick([C.carluccio,C.bimba,C.tommasino])),Math.cos(i*2.1)*2.6,-17+Math.sin(i*2.1)*2.6,{name:'',speed:2.2});a.watch=false;a.path=[0,1,2,3,4,5,6,7].map(k=>{const an=(k/8)*TAU+i*2.1;return [Math.cos(an)*2.7,-17+Math.sin(an)*2.7,0];});}
saltaCorda(-12.5,-46,0);tappeto(-29.75,5.2+heightAt(-29.75,-18),-18,Math.PI/2);tappeto(-2.3,4.9+heightAt(-2.3,-12),-12,Math.PI/2);
piccioni(0,-17,9);piccioni(-48,-24,8);piccioni(-16,-40,7);}
if(WREC){warDamage(WREC,1946,war?1.3:1.25);WREC=null;}
TERRAIN='stone';if(!war){loopAt(0,1,-17,'water');soundscape([{k:'gull',r:night?0:.1},{k:'bell',at:[36.5,8,-20],r:.02},{k:'bird',r:night?0:.05}]);}
ambient('mare');
}
