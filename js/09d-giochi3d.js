"use strict";
let G3=null;
let G3FP=null;function g3FP(pitch){if(G3FP===null)G3FP=fp;fp=true;fpPitch=pitch||0;camSnap=true;if(P&&P.sp)P.sp.visible=false;}
function g3Hud(title,help){let el=$('#g3hud');if(!el){el=document.createElement('div');el.id='g3hud';document.body.appendChild(el);}
el.innerHTML='<b>'+title+'</b><span id="g3t"></span><small>'+(help||'')+'</small>';el.hidden=false;}
function g3Set(t){const e=$('#g3t');if(e)e.textContent=t;}
function g3Stop(h){const i=hooks.indexOf(h);if(i>=0)hooks[i]=()=>{};const el=$('#g3hud');if(el)el.hidden=true;G3=null;if(G3FP!==null){fp=G3FP;G3FP=null;fpPitch=0;camSnap=true;}}
function g3Flash(col){const f=document.createElement('div');f.style.cssText='position:fixed;inset:0;z-index:30;pointer-events:none;background:'+(col||'#fff')+';opacity:.55;transition:opacity .5s';document.body.appendChild(f);setTimeout(()=>{f.style.opacity='0';setTimeout(()=>f.remove(),600);},40);}
async function g3Count(){await sleep(900);}   // niente conto alla rovescia: il gioco parte da sé, dopo un respiro
async function giocoPezze(area,n,dur){const tk=TOKEN;n=n||12;dur=dur||55;g3Hud('Le pezze nel vento','alza gli occhi e corri sotto le pezze prima che tocchino terra · trascina il mouse per guardarti intorno');g3FP(.32);
await g3Count();if(tk!==TOKEN)return 0;
const cols=['#e8e0d0','#b84a3a','#3a5a8a','#d8c070','#6a8a5a','#c87aa0','#f2f0ea','#8a6a4a'],rags=[];let caught=0,spawned=0,t=0,next=0,wind=0;
const spawn=()=>{const an=yaw+(R()-.5)*1.5,dd=4.5+R()*7,x=clamp(P.x-Math.sin(an)*dd,area[0],area[1]),z=clamp(P.z-Math.cos(an)*dd,area[2],area[3]),gy=heightAt(x,z);
const g=new THREE.PlaneGeometry(.8,.55,6,3);const m=new THREE.Mesh(g,new THREE.MeshStandardMaterial({color:pick(cols),side:THREE.DoubleSide,roughness:.9,envMapIntensity:.3}));m.position.set(x,gy+9+R()*3,z);m.castShadow=true;m.userData.noMerge=true;m.userData.sh=1;world.add(m);
const mk=new THREE.Mesh(new THREE.RingGeometry(.32,.5,24),new THREE.MeshBasicMaterial({color:0xffd060,transparent:true,opacity:.5,depthWrite:false}));mk.rotation.x=-Math.PI/2;mk.userData.noMerge=true;world.add(mk);
rags.push({m,mk,g,base:g.attributes.position.array.slice(),vx:(R()-.5)*1.4,vz:(R()-.5)*1.4,ph:R()*9});spawned++;};
return new Promise(res=>{const h=dt=>{if(tk!==TOKEN){g3Stop(h);res(caught);return;}t+=dt;next-=dt;wind+=dt;
if(spawned<n&&next<=0){spawn();next=spawned>6?2.4:3.2;if(spawned===1||R()<.25){for(let k=0;k<8;k++)puff(P.x+rr(-6,6),rr(3,7),P.z+rr(-6,6),.4,0xe8e0d0,2,.3,2.5,0);noise(.6,800,.04,'bandpass');}}
const gx=Math.sin(wind*.4)*1.1,gz=Math.cos(wind*.31)*.8;
for(let i=rags.length-1;i>=0;i--){const r=rags[i],p=r.m.position;r.ph+=dt;p.x=clamp(p.x+(r.vx+gx+Math.sin(r.ph*1.3)*.9)*dt,area[0]-1,area[1]+1);p.z=clamp(p.z+(r.vz+gz+Math.cos(r.ph*1.1)*.9)*dt,area[2]-1,area[3]+1);
const gy=heightAt(p.x,p.z),hh=p.y-gy;p.y-=(1.25+Math.sin(r.ph*2.3)*.35)*dt;r.m.rotation.set(Math.sin(r.ph*2.1)*1.1,r.ph*1.3,Math.cos(r.ph*1.7)*.8);
const a=r.g.attributes.position;for(let k=0;k<a.count;k++){const bx=r.base[k*3],by=r.base[k*3+1];a.setZ(k,Math.sin(bx*5+r.ph*7)*.08+Math.cos(by*6+r.ph*5)*.05);}a.needsUpdate=true;
const k=1-Math.min(1,hh/11);r.mk.position.set(p.x,gy+.05,p.z);r.mk.scale.setScalar(.5+k*.8);r.mk.material.opacity=.2+k*.6;
const dx=P.x-p.x,dz=P.z-p.z;
if(hh<2.4&&dx*dx+dz*dz<1.7){caught++;sfxPick();emote(P,'heart');for(let q=0;q<7;q++)puff(p.x,p.y,p.z,.12,0xffe080,.6,rr(.5,1.6),rr(-1,1),rr(-1,1),true);world.remove(r.m);world.remove(r.mk);rags.splice(i,1);continue;}
if(hh<.06){puff(p.x,gy+.1,p.z,.35,0xd8cbb4,1,.3,0,0);tone(180,.08,'triangle',.03);world.remove(r.m);world.remove(r.mk);rags.splice(i,1);}}
g3Set('  ·  prese '+caught+' su '+n);
if(spawned>=n&&!rags.length){for(const r of rags){world.remove(r.m);world.remove(r.mk);}g3Stop(h);res(caught);}};
G3={on:true};hooks.push(h);});}
const SLITTA={x0:38,x1:62,z0:-142,z1:-38,top:20};let SLHILL=null;
function slittaHill(){const S=SLITTA,H=(x,z)=>{const k=clamp((S.z1-z)/(S.z1-S.z0),0,1);const edge=Math.min(1,Math.min(x-S.x0,S.x1-x)/3);return S.top*k*Math.max(0,edge)+Math.sin(z*.13)*.3*k;};
ramps.push({x0:S.x0+1,x1:S.x1-1,z0:S.z0,z1:S.z1,h0:S.top,h1:0,ax:'z'});
const W=S.x1-S.x0+16,D=S.z1-S.z0+10,g=new THREE.PlaneGeometry(W,D,Math.round(W/1.5),Math.round(D/2));g.rotateX(-Math.PI/2);const p=g.attributes.position;
for(let i=0;i<p.count;i++){const x=p.getX(i)+(S.x0+S.x1)/2,z=p.getZ(i)+(S.z0+S.z1)/2,inX=x>S.x0&&x<S.x1;const k=clamp((S.z1-z)/(S.z1-S.z0),0,1);let h=S.top*k;if(!inX){const dd=Math.min(Math.abs(x-S.x0),Math.abs(x-S.x1));h=Math.max(0,h-dd*1.6);}p.setY(i,h-.05);}
g.computeVertexNormals();const t=texSnow().clone();t.needsUpdate=true;t.repeat.set(W/8,D/8);const me=new THREE.Mesh(g,mat(t));me.position.set((S.x0+S.x1)/2,0,(S.z0+S.z1)/2);me.receiveShadow=true;me.userData.noLift=true;world.add(me);
const trees=[],gates=[];const rn=mulberry(818);
for(let z=S.z0+4;z<S.z1-2;z+=5){for(const s of [-1,1]){const x=s<0?S.x0-1.5+rn()*1.2:S.x1+.3+rn()*1.2;const tr=treeG(rn()<.6?'pioppo':'spoglio',.9+rn()*.3);tr.position.set(x,H(clamp(x,S.x0+.5,S.x1-.5),z)-.2,z);world.add(tr);}}
for(let z=S.z0+16;z<S.z1-8;z+=11+rn()*4){const x=S.x0+4+rn()*(S.x1-S.x0-8);const tr=treeG('cipresso',1+rn()*.2);tr.position.set(x,H(x,z),z);world.add(tr);trees.push([x,z]);}
for(let z=S.z0+12,i=0;z<S.z1-6;z+=9,i++){const cx=S.x0+5+((i*7.3)%1)*0+ (Math.sin(i*1.7)*.5+.5)*(S.x1-S.x0-10),half=1.6;const col=i%2?'#c83a30':'#3a6ab0';
for(const s of [-1,1]){const px=cx+s*half,py=H(px,z);box(px,py,z,.07,1.3,.07,mc('#3a3030'),{collide:false});const fl=plane(.5,.32,mc(col,{double:true}),px+.25*s,py+1.15,z,0);fl.userData.noMerge=true;}gates.push({x:cx,z,half,done:false});}
return {H,trees,gates};}
function saltaCorda(x,z,ry){const c=Math.cos(ry||0),s=Math.sin(ry||0),L=3.2;const a=actor(poor(C.bimba),x-c*L/2,z+s*L/2,{name:'',solid:false}),b=actor(poor(C.mariuccia),x+c*L/2,z-s*L/2,{name:'',solid:false}),j=actor(poor(C.carluccio),x,z,{name:'',solid:false});
for(const k of [a,b,j])k.watch=false;a.face={x:c,z:-s};b.face={x:-c,z:s};j.face={x:-s,z:-c};
const seg=[],rm=mc('#c8b890',{rough:.9});for(let i=0;i<14;i++){const m=new THREE.Mesh(new THREE.SphereGeometry(.035,6,4),rm);m.userData.noMerge=true;world.add(m);seg.push(m);}
let t=Math.random()*5;hooks.push(dt=>{t+=dt*5.2;const gy=heightAt(x,z);for(let i=0;i<seg.length;i++){const u=i/(seg.length-1),off=(u-.5)*L,rad=Math.sin(u*Math.PI)*1.05;seg[i].position.set(x+c*off+s*Math.cos(t)*rad,gy+.95+Math.sin(t)*rad,z-s*off+c*Math.cos(t)*rad);}
j.yOff=Math.max(0,Math.sin(t+Math.PI*.6))*.38;});}
function tappeto(x,y,z,ry){const g=new THREE.PlaneGeometry(1.4,1,6,4),m=new THREE.Mesh(g,new THREE.MeshStandardMaterial({color:'#8a2a2a',side:THREE.DoubleSide,roughness:.95}));m.position.set(x,y,z);m.rotation.y=ry||0;m.userData.noMerge=true;world.add(m);
const base=g.attributes.position.array.slice();let t=Math.random()*4;hooks.push(dt=>{t+=dt;const beat=Math.max(0,Math.sin(t*6))>.92;const a=g.attributes.position;for(let k=0;k<a.count;k++)a.setZ(k,Math.sin(base[k*3]*3+t*4)*.05*(1+(beat?3:0))*(1-base[k*3+1]));a.needsUpdate=true;
if(beat&&Math.random()<.5)puff(x+rr(-.5,.5),y+rr(-.3,.3),z+rr(-.2,.2),.25,0xd8cbb4,1.4,.3,rr(-.3,.3),.3);});}
function piccioni(cx,cz,n){const body=mc('#7a7a84',{rough:.8}),wing=mc('#5a5a66',{rough:.8}),birds=[];
for(let i=0;i<n;i++){const g=new THREE.Group();const b=new THREE.Mesh(CG.box,body);b.scale.set(.12,.11,.22);b.position.y=.08;g.add(b);const h=new THREE.Mesh(CG.box,body);h.scale.set(.08,.08,.08);h.position.set(0,.16,.12);g.add(h);
const wl=new THREE.Mesh(CG.box,wing),wr=new THREE.Mesh(CG.box,wing);wl.scale.set(.2,.02,.14);wr.scale.set(.2,.02,.14);const pl=new THREE.Group(),pr=new THREE.Group();wl.position.x=-.1;wr.position.x=.1;pl.add(wl);pr.add(wr);pl.position.set(-.05,.12,0);pr.position.set(.05,.12,0);g.add(pl);g.add(pr);
g.traverse(o=>{o.userData.noMerge=true;});const hx=cx+rr(-2,2),hz=cz+rr(-2,2);g.position.set(hx,heightAt(hx,hz),hz);g.rotation.y=R()*TAU;world.add(g);birds.push({g,pl,pr,hx,hz,ph:R()*9,a:R()*TAU,r:rr(3,6),fly:0,peck:R()*3});}
let t=0,st=0;hooks.push(dt=>{t+=dt;if(!P)return;const near=Math.hypot(P.x-cx,P.z-cz)<4.5;if(near&&st<=0){st=7;tone(300,.05,'triangle',.015);}if(st>0)st-=dt;
if(Math.abs(P.x-cx)>40||Math.abs(P.z-cz)>40)return;   // lontani: fermi, non costano niente
for(const b of birds){b.ph+=dt;const want=st>0?1:0;b.fly+=(want-b.fly)*Math.min(1,dt*(want?3:1.2));const g=b.g;
if(b.fly>.02){b.a+=dt*(.9+b.r*.05);const fx=cx+Math.cos(b.a)*b.r,fz=cz+Math.sin(b.a)*b.r,fy=heightAt(cx,cz)+4+Math.sin(b.ph)*1.2;
g.position.set(g.position.x+(fx-g.position.x)*b.fly*dt*3,g.position.y+((b.fly>.5?fy:heightAt(b.hx,b.hz))-g.position.y)*dt*2.5,g.position.z+(fz-g.position.z)*b.fly*dt*3);
g.rotation.y=-b.a;const f=Math.sin(b.ph*22)*.9;b.pl.rotation.z=f;b.pr.rotation.z=-f;}
else{b.peck-=dt;if(b.peck<0){b.peck=rr(.6,2.5);g.rotation.y+=rr(-1,1);}g.rotation.x=Math.max(0,Math.sin(b.ph*6))*.35;b.pl.rotation.z=b.pr.rotation.z=0;g.position.x+=(b.hx-g.position.x)*dt;g.position.z+=(b.hz-g.position.z)*dt;}}});}
async function trailerDemoFinale(){const tk=TOKEN;$('#hud').hidden=true;$('#topbtns').hidden=true;hudFn=null;music('ninna');
const S=async(build,p0,l0,p1,l1,ms,lines,cls)=>tk===TOKEN&&await tShot(tk,build,p0,l0,p1,l1,ms,lines,cls);
if(!await S(()=>{const tr=buildCampagna();tr.g.position.x=-40;trainTo(tr,60,9000);},[-30,2.2,7],[-20,1.8,0],[10,3.2,8],[30,1.8,0],8600,['Il treno corre verso il Nord.','Dentro, centinaia di bambini che non sono mai usciti da Napoli.']))return;
if(!await S(()=>{const T=buildTrain();T.phase('trainNight');Object.assign(T.cur,{lamp:1.5,em:1.4,out:.55,glass:.32,sh:[0,0]});T.cur.col.set(0xffd8a0);
T.seats.forEach((s,i)=>{if(i%3)return;const a=actor(vary(pick([C.bimba,C.carluccio,C.tommasino,C.mariuccia])),s.x,s.z,{name:'',fx:0,fz:s.f});sitDown(a,.44);a.doze=1;a.watch=false;});},
[0,1.6,-6],[0,1.2,4],[0,1.7,1],[0,1.2,9],7600,['La notte non passa mai.','Qualcuno piange piano, qualcuno fa finta di dormire.']))return;
if(!await S(()=>{buildStation('dusk','MODENA');const tr=makeTrain(4,true);tr.g.position.set(10,-.5,5.6);for(let i=0;i<6;i++){const a=actor(vary(pick([C.rosa,C.alcide,C.comitato,C.signora])),rr(-8,8),rr(-1.5,1.8),{name:''});a.watch=false;}},
[-12,4.5,-2],[0,1.5,3],[6,2.6,-1.5],[0,1.6,2],7600,['Al binario, famiglie che non conoscono.','Chiamano i nomi da una lista, uno alla volta.']))return;
if(!await S(()=>{buildModena();},[-31,2.4,5.5],[-50,2.6,4],[-46,6,7.5],[-70,3,0],8000,['La neve, che non aveva mai visto.','Le biciclette, i portici, una lingua che sembra un\'altra.']))return;
if(!await S(()=>{buildKitchen();const d=actor(C.derna,.6,-.6,{name:'',fx:-1,fz:0});d.watch=false;},[2.6,1.7,2.6],[0,1.2,-1],[1.6,1.5,1.4],[0,1.1,-1.6],7000,['Una donna sola, con la sciarpa rossa e la testa dura.','Non sa come si fa a voler bene a un bambino. Imparerà.']))return;
if(!await S(()=>{buildPiazza();},[-6,3.2,10],[0,1.6,-4],[5,2.6,7],[0,1.8,-6],8000,['Un Natale con le luci accese e il pane bianco.','Una mazurka, una battaglia di palle di neve, un violino.']))return;
if(!await S(()=>{buildModena();},[50,24,-150],[50,10,-90],[50,12,-60],[50,2,-30],7400,['E una domanda che non lo lascia più:','a chi si appartiene, quando le madri sono due?']))return;
if(tk!==TOKEN)return;$('#fade').classList.add('on');await sleep(1000);if(tk!==TOKEN)return;cineOff();
trailerText(['Il resto della storia è nel libro.','«Il treno dei bambini» · Viola Ardone','Leggilo. Ne vale la pena.'],'title');await sleep(6400);if(tk!==TOKEN)return;trailerTextOut();await sleep(1200);
trailerText(['Fine della demo','un gioco di '+GRUPPO.join(', ')],'title');await sleep(4200);trailerTextOut();await sleep(900);$('#fade').classList.remove('on');}
