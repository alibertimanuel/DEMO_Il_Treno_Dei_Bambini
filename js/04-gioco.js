"use strict";
let P=null,yaw=0,camCfg={dist:7,pitch:.6,lock:false,sway:false},camSnap=true,playing=false,interacting=false,locked=0,curChapter=null,onTitle=true,miniOn=false,shake=0;
const STATS={};
function resetStats(){Object.assign(STATS,{uovo:0,pezze:0,scarpe:0,rimbalzi:0,colpi:0,calmati:0,mosse:0,galline:0,tabelline:0,violino:0,neve:0,ballo:0,scoperto:0,cappotto:null,lascia:2,lettera:0});}
resetStats();
function setPlayer(def,x,z,y,sc){P=actor(def,x,z,{solid:false,watch:false,sc});P.isPlayer=true;yaw=y||0;camSnap=true;}
function setCam(dist,pitch,lock,sway){camCfg={dist,pitch,lock:!!lock,sway:!!sway};camSnap=true;}
const waitUntil=c=>{const tk=TOKEN;return new Promise(r=>waiters.push({c,r,tk}));};
const near=(x,z,d)=>P&&Math.hypot(P.x-x,P.z-z)<d;
let cineMode=false,CT=null;const lookT=new THREE.Vector3();
function cineOn(){cineMode=true;document.body.classList.add('cine');$('#prompt').hidden=true;}
function cineOff(){cineMode=false;CT=null;document.body.classList.remove('cine');camSnap=false;}
function camSet(p,l){cineLift=0;camera.position.set(p[0],p[1],p[2]);lookT.set(l[0],l[1],l[2]);camera.lookAt(lookT);}
function camTo(p,l,ms){const tk=TOKEN;return new Promise(res=>{CT={p0:camera.position.clone(),l0:lookT.clone(),p1:new THREE.Vector3(p[0],p[1],p[2]),l1:new THREE.Vector3(l[0],l[1],l[2]),t0:performance.now(),dur:ms,res,tk};});}
function behind(x,z,y0,d,h){const yy=y0===undefined?yaw:y0;d=d||7;h=h||4.5;return [[x+Math.sin(yy)*d,h,z+Math.cos(yy)*d],[x,1.1,z]];}
let hudFn=null;
function hud(label,fn){$('#chap').textContent=label;hudFn=fn;$('#hud').hidden=false;$('#topbtns').hidden=false;refresh();}
let lastHud='';
function refresh(){if(!hudFn)return;const h=hudFn().map(([t,d])=>'<li class="'+(d?'done':'')+'">'+t+'</li>').join('');if(h!==lastHud){$('#objs').innerHTML=h;lastHud=h;}}
let toastT=0;function toast(t){const el=$('#toast');el.textContent=t;el.hidden=true;void el.offsetWidth;el.hidden=false;clearTimeout(toastT);toastT=setTimeout(()=>el.hidden=true,1900);}
const isTouch=matchMedia('(pointer:coarse)').matches||('ontouchstart' in window);
const D={open:false,typing:false,full:'',i:0,timer:0,resolve:null,choices:null};
const dlg=$('#dlg'),dtext=$('#dtext'),dnext=$('#dnext'),dch=$('#dchoices');
function portrait(def){const c=$('#portrait'),g=c.getContext('2d');g.clearRect(0,0,16,16);if(!def)return;const src=personFrames(def).c;const y=def.adult?3:9;g.drawImage(src,0,y,16,16,0,0,16,16);}
let talker=null;
function openDlg(name,def,narr){talker=narr?null:(name==='Amerigo'?P:actors.find(a=>a.name===name)||null);D.open=true;dlg.hidden=false;dlg.classList.toggle('narr',!!narr);$('#dname').textContent=name;portrait(def);}
function typeText(t){D.full=t;D.i=0;D.typing=true;dlg.classList.add('typing');dtext.textContent='';dnext.hidden=true;dch.innerHTML='';clearInterval(D.timer);D.timer=setInterval(()=>{D.i++;dtext.textContent=D.full.slice(0,D.i);if(D.i%3===0)blip();if(D.i>=D.full.length)finishType();},20);}
function finishType(){clearInterval(D.timer);D.typing=false;dlg.classList.remove('typing');dtext.textContent=D.full;if(D.choices)showChoices();else dnext.hidden=false;}
function showChoices(){dch.innerHTML='';D.choices.forEach((c,i)=>{const b=document.createElement('button');b.type='button';b.innerHTML='<span>'+(i+1)+'</span>'+c;b.onclick=e=>{e.stopPropagation();pickChoice(i);};dch.appendChild(b);});const f=dch.querySelector('button');if(f&&!isTouch)f.focus();}
function pickChoice(i){if(!D.choices||D.typing)return;const r=D.resolve;D.resolve=null;D.choices=null;closeDlg();sfxPick();r&&r(i);}
function closeDlg(){D.open=false;setTimeout(()=>{if(!D.open)dlg.hidden=true;},70);}
function advance(){if(!D.open)return;if(D.typing){finishType();return;}if(D.choices)return;const r=D.resolve;D.resolve=null;closeDlg();r&&r();}
dlg.addEventListener('click',advance);
let dq=Promise.resolve();
function line(name,def,narr,text,opts){const tk=TOKEN;const p=dq.then(()=>tk!==TOKEN?new Promise(()=>{}):new Promise(res=>{openDlg(name,def,narr);D.choices=opts||null;D.resolve=res;typeText(text);}));dq=p.then(()=>{},()=>{});return p;}
const say=(name,text,def)=>line(name,def,false,text);
const choose=(name,text,opts,def)=>line(name,def,false,text,opts);
const narrName=()=>MODE==='film'?'Amerigo ricorda':'Amerigo racconta';
const N=(text,alt)=>line(narrName(),MODE==='film'?C.adulto:C.amerigo,true,MODE==='film'&&alt?alt:text);
const Npres=text=>line('Amerigo',C.adulto,true,text);
let cardRes=null;
const JPATH='M14 58 C 90 18, 150 78, 230 48 S 380 14, 450 46 S 530 70, 546 40',JSTOPS=['Napoli','In viaggio','Modena','Natale'];
const CH_STOP={guerra:0,napoli:0,treno:1,modena:2,natale:3};let jid=0;
function journey(el,stops,here,o){o=o||{};const id='jp'+(++jid),n=stops.length,dl=o.delay||.35,du=o.dur||2.6;
el.innerHTML='<svg class="journey" viewBox="0 0 560 96" aria-hidden="true"><path id="'+id+'" class="ties" d="'+JPATH+'"/><path class="todo" d="'+JPATH+'"/><path class="done" d="'+JPATH+'"/><g class="stops"></g>'+
'<g class="loco"><circle class="puff" cx="4" cy="-13" r="2.4"/><circle class="puff" cx="4" cy="-13" r="2.4"/><circle class="puff" cx="4" cy="-13" r="2.4"/><rect x="-10" y="-8" width="15" height="8" rx="1.5"/><rect x="2" y="-13" width="3" height="5"/><rect x="-13" y="-11" width="6" height="7"/><circle cx="-7" cy="1.5" r="2.4"/><circle cx="1" cy="1.5" r="2.4"/></g></svg>';
const svg=el.firstChild,p=svg.querySelector('.done'),L=p.getTotalLength(),fr=i=>n>1?i/(n-1):0,f=o.loop?1:fr(here);
p.style.setProperty('--d',(L*f).toFixed(1));p.style.animationDelay=dl+'s';p.style.animationDuration=du+'s';
let s='';for(let i=0;i<n;i++){const q=p.getPointAtLength(L*fr(i)),cl=o.loop?'':i<here?' past':i===here?' here':'';
s+='<circle class="stop'+cl+'" cx="'+q.x.toFixed(1)+'" cy="'+q.y.toFixed(1)+'" r="4.5"/><text class="'+cl.trim()+'" x="'+q.x.toFixed(1)+'" y="'+(q.y+(i%2?-21:22)).toFixed(1)+'">'+stops[i]+'</text>';}
svg.querySelector('.stops').innerHTML=s;
const loco=svg.querySelector('.loco'),tot=dl+du;
loco.insertAdjacentHTML('beforeend',o.loop?'<animateMotion dur="16s" repeatCount="indefinite" rotate="auto"><mpath href="#'+id+'"/></animateMotion>':
'<animateMotion dur="'+tot+'s" fill="freeze" rotate="auto" calcMode="spline" keyTimes="0;'+(dl/tot).toFixed(3)+';1" keyPoints="0;0;'+f.toFixed(3)+'" keySplines="0 0 1 1;.6 0 .3 1"><mpath href="#'+id+'"/></animateMotion>');
try{svg.setCurrentTime(0);svg.unpauseAnimations();}catch(e){}}
function card(o){return new Promise(res=>{$('#ckick').textContent=o.kick||'';
const mp=$('#cmap'),showMap=/CAPITOLO|RICORDO/.test(o.kick||'')&&curChapter in CH_STOP;mp.hidden=!showMap;if(showMap)journey(mp,JSTOPS,CH_STOP[curChapter]);$('#ctitle').textContent=o.title||'';$('#csub').textContent=o.sub||'';$('#cbody').innerHTML=o.body||'';
const note=o.notes&&o.notes[MODE];$('#cnote').hidden=!note;if(note){$('#cchip').textContent=MODE==='film'?'NEL FILM':'NEL LIBRO';$('#cnotetext').textContent=note;}
$('#cgo').textContent=o.btn||'Continua ▸';const cd=$('#card');cd.hidden=true;void cd.offsetWidth;cd.hidden=false;$('#hud').hidden=true;$('#prompt').hidden=true;if(!isTouch)$('#cgo').focus();cardRes=res;});}
$('#cgo').onclick=()=>{if(!cardRes)return;const r=cardRes;cardRes=null;$('#card').hidden=true;if(hudFn&&playing)$('#hud').hidden=false;sfxPick();r();};
const fact=(title,body)=>card({kick:'LO SAPEVI?',title,body:'<p>'+body+'</p>'});
let fading=false;
async function fade(on){fading=true;$('#fade').classList.toggle('on',on);await sleep(1050);fading=false;}
const K={};let joy={x:0,y:0};
const KEYMAP={ArrowUp:'up',KeyW:'up',ArrowDown:'down',KeyS:'down',ArrowLeft:'left',KeyA:'left',ArrowRight:'right',KeyD:'right',KeyZ:'rotL',KeyX:'rotR'};
addEventListener('keydown',e=>{audioInit();
if(curChapter==='finale'&&playing){if(e.code==='KeyM')toggleMute();else if(poemSkip&&['Space','Enter','Escape'].includes(e.code)){e.preventDefault();poemSkip();}return;}
if(miniOn){if(['ArrowUp','ArrowDown','ArrowLeft','ArrowRight','Space','Enter'].includes(e.code))e.preventDefault();if(!e.repeat&&MG&&MG.key)MG.key(e.code);return;}
if(!$('#card').hidden){if(e.code==='Enter'||e.code==='Space'){e.preventDefault();$('#cgo').click();}return;}
if(D.open){if(D.choices&&!D.typing){const n=parseInt(e.key,10);if(n>=1&&n<=D.choices.length){e.preventDefault();pickChoice(n-1);return;}if(e.code==='ArrowDown'||e.code==='ArrowUp'){e.preventDefault();const bs=[...dch.querySelectorAll('button')];let i=bs.indexOf(document.activeElement);i=(i+(e.code==='ArrowDown'?1:-1)+bs.length)%bs.length;bs[i].focus();return;}if(e.code==='Enter'&&document.activeElement&&document.activeElement.parentNode===dch)return;}
if(['Space','Enter','KeyE'].includes(e.code)){e.preventDefault();if(D.choices&&!D.typing){const a=document.activeElement;if(a&&a.parentNode===dch)a.click();}else advance();}return;}
if(KEYMAP[e.code]){K[KEYMAP[e.code]]=true;if(e.code.startsWith('Arrow'))e.preventDefault();}
if(G3&&G3.act&&e.code==='Space'&&playing){e.preventDefault();G3.act();return;}
if(['Space','Enter','KeyE'].includes(e.code)&&playing){e.preventDefault();tryInteract();}
if(e.code==='Escape'&&playing)togglePause();
if(e.code==='KeyM')toggleMute();
if(e.code==='KeyV'&&playing&&!e.repeat)toggleFP();
});
addEventListener('keyup',e=>{if(KEYMAP[e.code])K[KEYMAP[e.code]]=false;});
addEventListener('blur',()=>{for(const k in K)K[k]=false;});
let drag=null;
cvs.addEventListener('pointerdown',e=>{audioInit();drag={x:e.clientX,y:e.clientY,id:e.pointerId};});
addEventListener('pointermove',e=>{if(drag&&e.pointerId===drag.id&&(!camCfg.lock||fp)&&!cineMode){yaw-=(e.clientX-drag.x)*.008;drag.x=e.clientX;if(fp)fpPitch=clamp(fpPitch-(e.clientY-drag.y)*.006,-.9,.75);drag.y=e.clientY;}});
addEventListener('pointerup',e=>{if(drag&&e.pointerId===drag.id)drag=null;});
const joyEl=$('#joy'),knob=$('#knob');let joyId=null;
joyEl.addEventListener('pointerdown',e=>{audioInit();joyId=e.pointerId;joyEl.setPointerCapture(e.pointerId);moveJoy(e);});
joyEl.addEventListener('pointermove',e=>{if(e.pointerId===joyId)moveJoy(e);});
const endJoy=e=>{if(e.pointerId!==joyId)return;joyId=null;joy={x:0,y:0};knob.style.transform='';};
joyEl.addEventListener('pointerup',endJoy);joyEl.addEventListener('pointercancel',endJoy);
function moveJoy(e){const r=joyEl.getBoundingClientRect();let dx=e.clientX-(r.left+r.width/2),dy=e.clientY-(r.top+r.height/2);const m=r.width/2-10,l=Math.hypot(dx,dy);if(l>m){dx*=m/l;dy*=m/l;}joy={x:dx/m,y:dy/m};knob.style.transform='translate('+dx+'px,'+dy+'px)';}
$('#bA').addEventListener('click',()=>{audioInit();if(D.open){if(!D.choices||D.typing)advance();}else if(G3&&G3.act&&playing)G3.act();else if(playing)tryInteract();});
let promptTarget=null;
function tryInteract(){if(!promptTarget||interacting||D.open||locked||miniOn||!canMove())return;const it=promptTarget;interacting=true;const tk=TOKEN;Promise.resolve(it.fn()).then(()=>{if(tk===TOKEN){interacting=false;refresh();}});}
function canMove(){return playing&&!fading&&!cineMode&&!$('#fade').classList.contains('on')&&!D.open&&$('#card').hidden&&!miniOn&&!interacting&&!locked&&$('#pause').hidden;}
async function cut(fn){locked++;try{await fn();}finally{locked=Math.max(0,locked-1);}}
const ray=new THREE.Raycaster();const tmpV=new THREE.Vector3(),tgt=new THREE.Vector3(),des=new THREE.Vector3(),shk=new THREE.Vector3();
function collide(p,r){for(const o of obstacles){const cx=clamp(p.x,o.x0,o.x1),cz=clamp(p.z,o.z0,o.z1);const dx=p.x-cx,dz=p.z-cz,d2=dx*dx+dz*dz;if(d2<r*r){if(d2>1e-6){const d=Math.sqrt(d2);p.x=cx+dx/d*r;p.z=cz+dz/d*r;}else{const l=p.x-o.x0,rt=o.x1-p.x,t=p.z-o.z0,b=o.z1-p.z,m=Math.min(l,rt,t,b);if(m===l)p.x=o.x0-r;else if(m===rt)p.x=o.x1+r;else if(m===t)p.z=o.z0-r;else p.z=o.z1+r;}}}
for(const a of actors){if(a===P||!a.solid)continue;const dx=p.x-a.x,dz=p.z-a.z,d=Math.hypot(dx,dz),m=r+.32;if(d<m&&d>1e-4){p.x=a.x+dx/d*m;p.z=a.z+dz/d*m;}}}
let dustT=0,stepT=0;
function updatePlayer(dt){if(!P)return;if(G3&&G3.ownMove)return;let ix=0,iz=0;
if(P.stun>0){P.stun-=dt;}
else if(canMove()){if(K.left)ix-=1;if(K.right)ix+=1;if(K.up)iz+=1;if(K.down)iz-=1;ix+=joy.x;iz-=joy.y;if(!camCfg.lock||fp){if(K.rotL)yaw+=dt*1.8;if(K.rotR)yaw-=dt*1.8;}}
const l=Math.hypot(ix,iz);if(l>1){ix/=l;iz/=l;}
const fx=-Math.sin(yaw),fz=-Math.cos(yaw),rx=Math.cos(yaw),rz=-Math.sin(yaw);
const mx=rx*ix+fx*iz,mz=rz*ix+fz*iz;const sp=P.def.adult?3.6:4.2;
P.x+=mx*sp*dt;P.z+=mz*sp*dt;collide(P,.3);P.moving=l>.12;if(P.moving)P.face={x:mx,z:mz};
if(P.moving&&l>.6){dustT-=dt;if(dustT<=0){dustT=.16;puff(P.x-mx*.25,.08,P.z-mz*.25,.22,curEnv==='nebbia'?0xffffff:0xd8cbb4,.5,.35,0,0);}}
if(P.moving){stepT-=dt*(l>.6?1:.6);if(stepT<=0){stepT=.34;footstep(terrainAt(P.x,P.z));}}else stepT=.05;}
const _cf=new THREE.Vector3();let actFrame=0;
function updateActors(dt){const rx=Math.cos(yaw),rz=-Math.sin(yaw),tt=now();camera.getWorldDirection(_cf);actFrame++;
const cx=camera.position.x,cz=camera.position.z;
for(const a of actors){
if(a.path){if(a.paused)a.moving=false;else{const t=a.path[a.pi],dx=t[0]-a.x,dz=t[1]-a.z,d=Math.hypot(dx,dz);
if(d<.08){if(a.pi===a.path.length-1&&a.loop===false){a.path=null;a.moving=false;}else{a.pi=(a.pi+1)%a.path.length;a.wait=t[2]||0;}}
else if(a.wait>0){a.wait-=dt;a.moving=false;}else{const s=Math.min(d,a.speed*dt);a.x+=dx/d*s;a.z+=dz/d*s;a.face={x:dx/d,z:dz/d};a.moving=true;}}}
else if(!a.isPlayer&&!a.chicken&&!a.critter){a.moving=false;if(a.watch&&!a.pose&&P&&Math.hypot(P.x-a.x,P.z-a.z)<3.5)a.face={x:P.x-a.x,z:P.z-a.z};}
a.g.position.set(a.x,(ramps.length?heightAt(a.x,a.z):0)+(a.yOff||0),a.z);
if(a.g.visible){a.acc=(a.acc||0)+dt;const ox=a.x-cx,oz=a.z-cz,dd=Math.hypot(ox,oz),back=dd>4&&(ox*_cf.x+oz*_cf.z)<-.3*dd;
if(!a.isPlayer&&a.sp){const far=dd>60&&!cineMode;if(a.sp.visible===far)a.sp.visible=!far;if(far)continue;}
const every=a.isPlayer||a===talker||dd<22?1:back?6:dd<45?2:4;
if((actFrame+(a.ph*97|0))%every===0){animActor(a,Math.min(a.acc,.2),tt);a.acc=0;}}
if(a.mark){a.mark.visible=!!(a.markFn&&a.markFn());if(a.mark.visible)a.mark.position.y=(a.def.adult?2.25:1.75)*a.sc+Math.sin(tt*5.5)*.08;}
}}
function updateItems(dt){for(const it of items){if(it.taken)continue;it.t+=dt;it.sp.position.y=it.gy+.5+Math.sin(it.t*3)*.12;it.sp.material.rotation=Math.sin(it.t*2)*.3;if(near(it.x,it.z,.75)&&canMove()){it.taken=true;world.remove(it.sp);world.remove(it.glow);sfxPick();for(let i=0;i<5;i++)puff(it.x,.5,it.z,.15,0xffe080,.5,rr(.5,1.5),rr(-1,1),rr(-1,1),true);it.fn();refresh();}}}
function updatePrompt(){let best=null,bd=1e9;if(P&&canMove()){for(const it of interacts){if(!it.active())continue;const d=Math.hypot(P.x-it.x,P.z-it.z);if(d<it.r&&d<bd){bd=d;best=it;}}}promptTarget=best;const el=$('#prompt');if(best){const h='<b>'+(isTouch?'A':'E')+'</b>'+best.label;if(el.innerHTML!==h)el.innerHTML=h;el.hidden=false;}else el.hidden=true;}
let fp=true,fpPitch=0,bobT=0,dlgK=0,dlgSide=1;const _dc=new THREE.Vector3(),_dl=new THREE.Vector3();
function toggleFP(){fp=!fp;fpPitch=0;camSnap=true;$('#bView').textContent='Visuale: '+(fp?'occhi':'dietro');toast(fp?'Prima persona · guardi con gli occhi di Amerigo (V)':'Visuale da dietro (V)');}
function updateCamera(dt){if(!P)return;
const gy=P.g.position.y;if(fp){const eye=(P.def.adult?1.62:1.2)*(P.sc||1)+gy;bobT+=P.moving?dt*11:0;const by=P.moving?Math.abs(Math.sin(bobT))*.06:0,cp=Math.cos(fpPitch);
camera.position.set(P.x,eye+by,P.z);lookT.set(P.x-Math.sin(yaw)*3*cp,eye+by+Math.sin(fpPitch)*3,P.z-Math.cos(yaw)*3*cp);camera.lookAt(lookT);
if(P.moving)camera.rotateZ(Math.sin(bobT*.5)*.008);camSnap=false;return;}tgt.set(P.x,1.1+gy,P.z);const d=camCfg.dist,p=camCfg.pitch;des.set(P.x+Math.sin(yaw)*Math.cos(p)*d,1.1+gy+Math.sin(p)*d,P.z+Math.cos(yaw)*Math.cos(p)*d);
{tmpV.subVectors(des,tgt);const len=tmpV.length();tmpV.normalize();const hd=camHit(tgt,tmpV,len);if(hd<len)des.copy(tgt).addScaledVector(tmpV,Math.max(.8,hd-.3));}
const talk=D.open&&talker&&talker!==P&&talker.g&&Math.hypot(talker.x-P.x,talker.z-P.z)<6;
if(talk&&dlgK<.02){const dx=talker.x-P.x,dz=talker.z-P.z;dlgSide=((camera.position.x-P.x)*dz-(camera.position.z-P.z)*dx)>0?1:-1;}
dlgK+=((talk?1:0)-dlgK)*Math.min(1,dt*2.2);
if(dlgK>.01&&talker&&talker.g){let dx=talker.x-P.x,dz=talker.z-P.z;const l=Math.hypot(dx,dz)||1;dx/=l;dz/=l;const sx=dz*dlgSide,sz=-dx*dlgSide,e=dlgK*dlgK*(3-2*dlgK);
const ht=(talker.def.adult?1.5:1.08)*(talker.sc||1)+talker.g.position.y,hp=(P.def.adult?1.5:1.08)+gy;
_dc.set(P.x-dx*1.35+sx*.62,hp+.32,P.z-dz*1.35+sz*.62);_dl.set(talker.x-dx*.1,ht,talker.z-dz*.1);des.lerp(_dc,e);tgt.lerp(_dl,e);
{tmpV.subVectors(des,tgt);const len=tmpV.length();tmpV.normalize();const hd=camHit(tgt,tmpV,len);if(hd<len)des.copy(tgt).addScaledVector(tmpV,Math.max(.6,hd-.2));}}
if(camSnap){camera.position.copy(des);camSnap=false;}else camera.position.lerp(des,1-Math.pow(.0015,dt));camGuard(tgt);lookT.copy(tgt);camera.lookAt(tgt);
if(camCfg.sway)camera.rotateZ(Math.sin(now()*1.7)*.012);}
const CAMBOX=[],_cv=new THREE.Vector3(),_cd=new THREE.Vector3(),_hp=new THREE.Vector3(),_cray=new THREE.Ray(),_cbb=new THREE.Box3();let _cbW=null;
function buildCamBoxes(){CAMBOX.length=0;_cbW=world;const add=o=>{if(!o.geometry)return;o.updateMatrixWorld();if(!o.geometry.boundingBox)o.geometry.computeBoundingBox();_cbb.copy(o.geometry.boundingBox).applyMatrix4(o.matrixWorld);
const s=_cbb.getSize(_cv);if(s.y<.5&&!occluders.includes(o))return;CAMBOX.push(_cbb.clone().expandByScalar(.3));};
for(const o of occluders)add(o);
const m4=new THREE.Matrix4();
world.traverse(o=>{if(!o.isMesh||occluders.includes(o)||!o.geometry)return;
if(o.isInstancedMesh){if(!o.userData.camBox)return;if(!o.geometry.boundingBox)o.geometry.computeBoundingBox();o.updateMatrixWorld();for(let i=0;i<o.count;i++){o.getMatrixAt(i,m4);m4.premultiply(o.matrixWorld);_cbb.copy(o.geometry.boundingBox).applyMatrix4(m4);CAMBOX.push(_cbb.clone().expandByScalar(.4));}return;}
if(o.userData.merged)return;   // tanti pezzetti fusi insieme: la loro scatola coprirebbe la strada intera
for(let p=o.parent;p&&p!==world;p=p.parent)if(p.userData.actor||p.userData.noCam)return;   // personaggi e cose che si muovono (treni, carretti) no
const ms=Array.isArray(o.material)?o.material:[o.material];if(ms.some(m=>!m||(m.transparent&&!(m.alphaTest>0))))return;
if(!o.geometry.boundingBox)o.geometry.computeBoundingBox();o.updateMatrixWorld();_cbb.copy(o.geometry.boundingBox).applyMatrix4(o.matrixWorld);const s=_cbb.getSize(_cv),vol=s.x*s.y*s.z;
if(Math.max(s.x,s.z)>1.2&&vol>1.2&&vol<60000&&(s.y>1.6||(s.y>.35&&_cbb.min.y>2.2)))CAMBOX.push(_cbb.clone().expandByScalar(.35));});}
function camHit(o,dir,len){if(_cbW!==world)buildCamBoxes();let best=len;_cray.set(o,dir);for(const b of CAMBOX){if(b.containsPoint(o))continue;const p=_cray.intersectBox(b,_hp);if(p){const d=p.distanceTo(o);if(d<best)best=d;}}return best;}
function camGuard(tgt){if(_cbW!==world)buildCamBoxes();const c=camera.position;if(ramps.length){const g=heightAt(c.x,c.z)+.6;if(c.y<g)c.y=g;}
_cd.subVectors(c,tgt);const len=_cd.length();if(len>.05){_cd.normalize();const hd=camHit(tgt,_cd,len);if(hd<len)c.copy(tgt).addScaledVector(_cd,Math.max(.5,hd-.25));}
for(const b of CAMBOX){if(!b.containsPoint(c)||b.containsPoint(tgt))continue;let lo=0,hi=1;for(let i=0;i<12;i++){const m=(lo+hi)/2;_cv.lerpVectors(c,tgt,m);if(b.containsPoint(_cv))lo=m;else hi=m;}_cv.lerpVectors(c,tgt,hi);c.copy(_cv);}}
let cineLift=0,cineLiftT=0;const _cl=new THREE.Vector3();
function cineNeed(p){let need=ramps.length?Math.max(0,heightAt(p.x,p.z)+1.2-p.y):0;   // mai sotto le colline
for(const b of CAMBOX){if(b.containsPoint(lookT))continue;if(p.x>b.min.x-.5&&p.x<b.max.x+.5&&p.z>b.min.z-.5&&p.z<b.max.z+.5&&p.y<b.max.y+.7&&p.y>b.min.y-1.5)need=Math.max(need,b.max.y+.7-p.y);}return need;}
function cineGuard(){if(onTitle||!world||world.userData.interior)return;if(_cbW!==world)buildCamBoxes();const c=camera.position,t=performance.now(),dt=Math.min(.1,(t-(cineLiftT||t))/1000);cineLiftT=t;
if(!CT)c.y-=cineLift;   // camera ferma: si toglie l'alzata del fotogramma prima e la si ricalcola
let need=cineNeed(c);
if(CT){const k=Math.min(1,(t-CT.t0)/CT.dur);for(const dk of [.03,.06,.1,.15]){const kk=Math.min(1,k+dk),e=kk<.5?4*kk*kk*kk:1-Math.pow(-2*kk+2,3)/2;_cl.lerpVectors(CT.p0,CT.p1,e);need=Math.max(need,cineNeed(_cl)*(1-dk*3));}}
cineLift=Math.max(need,cineLift-dt*2.5);if(cineLift<0)cineLift=0;c.y+=cineLift;
for(const b of CAMBOX){if(!b.containsPoint(c)||b.containsPoint(lookT))continue;const o=[[c.x-b.min.x,0],[b.max.x-c.x,1],[c.z-b.min.z,2],[b.max.z-c.z,3],[b.max.y-c.y,4]].sort((p,q)=>p[0]-q[0])[0][1];
if(o===0)c.x=b.min.x-.05;else if(o===1)c.x=b.max.x+.05;else if(o===2)c.z=b.min.z-.05;else if(o===3)c.z=b.max.z+.05;else c.y=b.max.y+.05;}}
let MERGEQ=false;
function matKey(m){if(m.map||m.isShaderMaterial||!m.isMeshStandardMaterial||String(m.onBeforeCompile).length>40)return m.uuid;
return [m.color.getHexString(),m.emissive.getHexString(),m.emissiveIntensity,m.roughness,m.metalness,m.side,m.flatShading?1:0,m.envMapIntensity,m.fog?1:0,m.vertexColors?1:0,m.bumpMap?m.bumpMap.uuid:'',m.alphaTest].join('|');}
function mergeStatic(){buildCamBoxes();const buckets=new Map(),gone=[];
const ok=(o,stat)=>{if(o.isInstancedMesh||o.isSkinnedMesh||!o.visible||!o.geometry)return false;const g=o.geometry;if(!g.attributes.position||!g.attributes.normal||(g.morphAttributes&&g.morphAttributes.position))return false;
const mats=Array.isArray(o.material)?o.material:[o.material];if(g.attributes.color||g.attributes.uv2)return false;return !mats.some(m=>!m||m.vertexColors||(m.transparent&&!(m.alphaTest>0))||m.isShaderMaterial||(m.side===THREE.DoubleSide&&g.type==='PlaneGeometry'&&!stat&&!o.userData.static));};
const cand=[];
for(const o of world.children){if(o.isGroup&&o.userData.static){o.updateMatrixWorld(true);const ms=[];let good=true;o.traverse(c=>{if(c.isMesh){if(ok(c,true))ms.push(c);else good=false;}});if(!good||!ms.length)continue;for(const c of ms)cand.push([c,c.matrixWorld.clone()]);gone.push(o);continue;}
if(o.isMesh&&!o.children.length&&!o.userData.noMerge&&ok(o,false)){o.updateMatrix();cand.push([o,o.matrix]);gone.push(o);}}
for(const [o,M] of cand){const g=o.geometry,tot=g.index?g.index.count:g.attributes.position.count,grs=Array.isArray(o.material)&&g.groups.length?g.groups:[{start:0,count:tot,materialIndex:0}];
const flat=g.type==='PlaneGeometry'&&Math.abs(o.rotation.x+Math.PI/2)<.01;
for(const gr of grs){const m=Array.isArray(o.material)?o.material[gr.materialIndex]:o.material;if(!m)continue;const key=matKey(m)+'|'+(g.attributes.uv?1:0);let b=buckets.get(key);if(!b)buckets.set(key,b={m,uv:!!g.attributes.uv,items:[],cast:false});b.items.push([o,gr,M]);if(!flat&&!o.userData.noCast)b.cast=true;}}
const nm=new THREE.Matrix3(),v=new THREE.Vector3();
for(const b of buckets.values()){let nv=0,ni=0;for(const [o,gr] of b.items){nv+=o.geometry.attributes.position.count;ni+=gr.count;}
const P=new Float32Array(nv*3),N=new Float32Array(nv*3),U=b.uv?new Float32Array(nv*2):null,I=nv>65535?new Uint32Array(ni):new Uint16Array(ni);let vo=0,io=0;
for(const [o,gr,M] of b.items){const g=o.geometry,pa=g.attributes.position,na=g.attributes.normal,ua=g.attributes.uv;nm.getNormalMatrix(M);
for(let i=0;i<pa.count;i++){v.fromBufferAttribute(pa,i).applyMatrix4(M);P[(vo+i)*3]=v.x;P[(vo+i)*3+1]=v.y;P[(vo+i)*3+2]=v.z;v.fromBufferAttribute(na,i).applyMatrix3(nm).normalize();N[(vo+i)*3]=v.x;N[(vo+i)*3+1]=v.y;N[(vo+i)*3+2]=v.z;if(U){U[(vo+i)*2]=ua?ua.getX(i):0;U[(vo+i)*2+1]=ua?ua.getY(i):0;}}
for(let k=gr.start;k<gr.start+gr.count;k++)I[io++]=(g.index?g.index.getX(k):k)+vo;vo+=pa.count;}
const mg=new THREE.BufferGeometry();mg.setAttribute('position',new THREE.BufferAttribute(P,3));mg.setAttribute('normal',new THREE.BufferAttribute(N,3));if(U)mg.setAttribute('uv',new THREE.BufferAttribute(U,2));mg.setIndex(new THREE.BufferAttribute(I,1));mg.computeBoundingSphere();mg.computeBoundingBox();
const me=new THREE.Mesh(mg,b.m);me.castShadow=b.cast;me.receiveShadow=true;me.userData.noMerge=true;me.userData.sh=1;me.userData.merged=true;world.add(me);}
for(const o of gone){world.remove(o);if(o.isMesh&&!occluders.includes(o))o.geometry.dispose();}}
let last=performance.now();
function loop(t){const dt=Math.min(.05,(t-last)/1000);last=t;if(WINQ.length)winFlush();if(CURBQ.length)curbFlush();if(ICEQ.length)iceFlush();if(MERGEQ&&!onTitle){MERGEQ=false;mergeStatic();}
if(onTitle)titleUpdate(dt);
else{updatePlayer(dt);updateActors(dt);updateItems(dt);for(const h of hooks)h(dt);updatePrompt();
if(cineMode){if(CT){const k=Math.min(1,(t-CT.t0)/CT.dur);const e=k<.5?4*k*k*k:1-Math.pow(-2*k+2,3)/2;camera.position.lerpVectors(CT.p0,CT.p1,e);lookT.lerpVectors(CT.l0,CT.l1,e);if(k>=1){const r=CT.res,tk=CT.tk;CT=null;if(tk===TOKEN)r();}}cineGuard();camera.lookAt(lookT);
const ts=t/1000;camera.rotateX(Math.sin(ts*.71)*.0035);camera.rotateY(Math.sin(ts*.53+1)*.0045);camera.rotateZ(Math.sin(ts*.37+2)*.003);}
else updateCamera(dt);}
updateFX(dt);
for(let i=waiters.length-1;i>=0;i--){const w=waiters[i];if(w.tk!==TOKEN){waiters.splice(i,1);continue;}if(w.c()){waiters.splice(i,1);w.r();}}
stepEnv();WIND.value=t/1000;updateGuide(dt);updateListener();
{const c=P&&!onTitle?P.g.position:camera.position;++shTick;renderer.shadowMap.needsUpdate=(shTick&1)===0;if(renderer.shadowMap.needsUpdate){_sp.set(c.x,0,c.z);placeSun(_sp.clone());}if((shTick&31)===1)shadowize();}
if(P)P.sp.visible=!(fp&&!cineMode&&!onTitle);
SKY.position.copy(camera.position);SKY.material.uniforms.uTime.value=t/1000;SUNSP.position.copy(camera.position).addScaledVector(sunDir,150);
{const u=POST.fin.uniforms,want=0;u.uDof.value+=(want-u.uDof.value)*Math.min(1,dt*3);u.uFocus.value=camera.position.distanceTo(lookT);}
if(shake>.002){shk.set((Math.random()-.5)*shake,(Math.random()-.5)*shake,(Math.random()-.5)*shake);camera.position.add(shk);POST.render(t/1000);camera.position.sub(shk);shake*=Math.pow(.015,dt);}
else POST.render(t/1000);
fpsTick(t);
requestAnimationFrame(loop);}
let fpsOn=false,fpsN=0,fpsT=0;try{fpsOn=localStorage.getItem('treno-fps')==='1';}catch(e){}
let dynLow=0,dynHigh=0,autoLow=0;
function fpsTick(t){fpsN++;if(t-fpsT>=500){const f=fpsN*1000/(t-fpsT);
if(t-fpsT<1500&&!onTitle){if(f<48){dynHigh=0;if(++dynLow>=2&&DYN>.62){DYN=Math.max(.62,DYN-.08);dynLow=0;resize();}}
else if(f>53){dynLow=0;if(++dynHigh>=5&&DYN<1){DYN=Math.min(1,DYN+.05);dynHigh=0;resize();}}else{dynLow=0;dynHigh=0;}}
if(t-fpsT<1500&&!onTitle&&DYN<=.63&&f<34&&QK==='alto'){if(++autoLow>=6){autoLow=0;QK='medio';try{localStorage.setItem('treno-qual2','medio');}catch(e){}applyQuality();resize();toast('Grafica alleggerita automaticamente per andare più fluido');}}else if(f>=34)autoLow=0;
if(fpsOn){const el=$('#fps');el.hidden=false;el.textContent=Math.round(f)+' FPS · '+QK+(DYN<1?' · '+Math.round(DYN*100)+'%':'');}fpsN=0;fpsT=t;}}
function makeTrain(nw,lit){const tr=new THREE.Group();tr.userData.noCam=true;const blk=mc('#24222c',{rough:.42,metal:1}),red=mc('#a8302a',{rough:.5}),brs=mc('#c8a040',{rough:.3,metal:1}),dk=mc('#17171c',{rough:.55,metal:1}),stl=mc('#8a8a92',{rough:.35,metal:1});
const add=(geo,m,x,y,z)=>{const me=new THREE.Mesh(geo,m);me.position.set(x,y,z);tr.add(me);return me;};
const cylX=(r0,r1,l,m,x,y,z,seg)=>{const me=add(new THREE.CylinderGeometry(r0,r1,l,seg||24),m,x,y,z);me.rotation.z=Math.PI/2;return me;};
const cylZ=(r,l,m,x,y,z,seg)=>{const me=add(new THREE.CylinderGeometry(r,r,l,seg||20),m,x,y,z);me.rotation.x=Math.PI/2;return me;};
const roofG=(r,len,sy)=>{const g=new THREE.CylinderGeometry(r,r,len,18,1,false,0,Math.PI);g.rotateZ(Math.PI/2);g.scale(1,sy,1);return g;};
cylX(.75,.75,3.2,blk,.5,1.45,0);for(const x of [-.7,.2,1.1])cylX(.775,.775,.07,brs,x,1.45,0);
cylX(.8,.8,.55,dk,2.12,1.45,0);cylX(.62,.62,.06,dk,2.42,1.45,0);add(new THREE.SphereGeometry(.07,10,8),brs,2.46,1.45,0);
add(new THREE.CylinderGeometry(.2,.26,.85,18),blk,1.95,2.5,0);add(new THREE.CylinderGeometry(.3,.24,.14,18),blk,1.95,2.97,0);
add(new THREE.SphereGeometry(.3,18,10,0,TAU,0,Math.PI/2),brs,.7,2.15,0);add(new THREE.SphereGeometry(.22,16,8,0,TAU,0,Math.PI/2),blk,-.15,2.15,0);
add(new THREE.CylinderGeometry(.05,.07,.3,10),brs,-.6,2.3,0);   // il fischio
add(new THREE.BoxGeometry(1.6,2.1,1.9),blk,-1.6,1.55,0);add(roofG(1.05,1.9,.32),dk,-1.6,2.6,0);
for(const s of [-1,1]){add(new THREE.BoxGeometry(.6,.55,.02),mc(lit?'#ffcf80':'#2a2a34',{rough:.2}),-1.6,2.05,s*.96);add(new THREE.BoxGeometry(.7,.06,.04),brs,-1.6,2.35,s*.97);}
add(new THREE.BoxGeometry(.02,.4,.4),mc('#2a2a34',{rough:.1}),-.79,2.1,.5);add(new THREE.BoxGeometry(.02,.4,.4),mc('#2a2a34',{rough:.1}),-.79,2.1,-.5);
add(new THREE.BoxGeometry(5,.3,1.9),red,0,.6,0);add(new THREE.BoxGeometry(.2,.45,2.1),red,2.55,.6,0);
for(const s of [-1,1]){cylX(.07,.07,.35,stl,2.75,.65,s*.6,12);cylX(.16,.16,.05,stl,2.93,.65,s*.6,16);
add(new THREE.CylinderGeometry(.12,.12,.2,14),blk,2.45,1.05,s*.55).rotation.z=Math.PI/2;add(new THREE.CircleGeometry(.09,14),mat('#fff2b0',{basic:true}),2.56,1.05,s*.55).rotation.y=Math.PI/2;}
const wheels=[],rods=[];const wg=new THREE.CylinderGeometry(.48,.48,.12,24);
for(let i=0;i<3;i++)for(const s of [-1,1]){const w=add(wg,red,1.4-i*1.15,.48,s*.9);w.rotation.x=Math.PI/2;wheels.push(w);const h=add(new THREE.CylinderGeometry(.1,.1,.14,12),brs,1.4-i*1.15,.48,s*.97);h.rotation.x=Math.PI/2;
const rim=add(new THREE.TorusGeometry(.46,.04,6,24),dk,1.4-i*1.15,.48,s*.93);}
for(const s of [-1,1]){const r=add(new THREE.BoxGeometry(2.4,.08,.05),stl,.25,.48,s*1.02);rods.push(r);}
cylZ(.12,1.8,dk,1.4,.48,0);cylZ(.12,1.8,dk,.25,.48,0);cylZ(.12,1.8,dk,-.9,.48,0);
for(const s of [-1,1])add(new THREE.BoxGeometry(.9,.4,.3),blk,2.0,.75,s*.8);   // i cilindri a vapore
const ws=texWagonSide(),side=mat(ws,{rough:.6}),endM=mc('#4a2c1e',{rough:.7}),undM=mc('#1e1c20',{rough:.6,metal:1});
for(let i=0;i<nw;i++){const wx=-4.9-i*5.1;add(new THREE.BoxGeometry(4.8,2.3,1.9),[endM,endM,mc('#3a2a26'),mc('#3a2a26'),side,side],wx,1.45,0);
add(roofG(1.05,5,.3),mc('#3a383c',{rough:.7}),wx,2.6,0);for(let k=-2;k<=2;k++)add(new THREE.CylinderGeometry(.08,.08,.12,10),dk,wx+k*.9,2.95,0);
add(new THREE.BoxGeometry(4.5,.2,1.5),undM,wx,.32,0);
for(const dx of [-1.6,1.6]){add(new THREE.BoxGeometry(1.5,.22,1.7),undM,wx+dx,.32,0);for(const ax of [-.45,.45])for(const s of [-1,1]){const w=add(new THREE.CylinderGeometry(.3,.3,.1,18),dk,wx+dx+ax,.3,s*.88);w.rotation.x=Math.PI/2;wheels.push(w);}}
for(const e of [-1,1]){for(const s of [-1,1])cylX(.11,.11,.22,stl,wx+e*2.5,.6,s*.6,14);add(new THREE.BoxGeometry(.25,1.9,1.2),mc('#141216',{rough:.9}),wx+e*2.48,1.4,0);}
for(const s of [-1,1]){add(new THREE.BoxGeometry(.5,.05,.25),undM,wx+2.05,.2,s*1.05);add(new THREE.BoxGeometry(.03,1.1,.03),brs,wx+2.35,1.3,s*.97);}}
const lights=[];if(lit){for(let i=0;i<nw;i++)for(const dx of [-1.8,-.9,0,.9])for(const sz of [-1.02,1.02]){const m=new THREE.SpriteMaterial({map:glowTex,color:0xffc070,transparent:true,depthWrite:false,blending:THREE.AdditiveBlending,opacity:.7});const sp=new THREE.Sprite(m);sp.position.set(-4.9-i*5.1+dx,1.88,sz);sp.scale.set(1.1,.9,1);tr.add(sp);lights.push([m,Math.random()*9]);}}
world.add(tr);const T={g:tr,speed:0,wheels,chT:0,idle:true};
if(lights.length)hooks.push(()=>{const tt=now();for(const [m,ph] of lights)m.opacity=.55+Math.sin(tt*5+ph)*.06+Math.sin(tt*11.3+ph)*.04;});
hooks.push(dt=>{const rate=T.idle?2:3+Math.abs(T.speed)*1.6;if(Math.random()<dt*rate){const s=new THREE.Vector3(1.95,3.1,0).applyMatrix4(tr.matrixWorld);puff(s.x,s.y,s.z,.8,0xf2ece4,2.8,1.4,-T.speed*.4-.2,0);}
for(const w of wheels)w.rotation.y+=T.speed*dt*1.6;const a=wheels[0].rotation.y;rods.forEach((r,i)=>{r.position.x=.25+Math.cos(a+i*1.57)*.24;r.position.y=.48+Math.sin(a+i*1.57)*.24;});
if(Math.abs(T.speed)>.2){T.chT-=dt;if(T.chT<=0){T.chT=clamp(1.6/Math.abs(T.speed),.18,.6);noise(.12,900,.05,'highpass');}}});
return T;}
function trainTo(T,x1,ms){const tk=TOKEN;return new Promise(res=>{const x0=T.g.position.x,t0=performance.now();let lx=x0;const h=dt=>{const k=Math.min(1,(performance.now()-t0)/ms);const e=k<.5?2*k*k:1-Math.pow(-2*k+2,2)/2;const x=x0+(x1-x0)*e;T.speed=dt>0?(x-lx)/dt:0;lx=x;T.g.position.x=x;T.idle=false;if(k>=1){T.speed=0;T.idle=true;hooks.splice(hooks.indexOf(h),1);if(tk===TOKEN)res();}};hooks.push(h);});}
function waterArea(cx,cz,w,d,shoreZ){const nx=QK==='basso'?90:150,nz=QK==='basso'?45:80;const geo=new THREE.PlaneGeometry(w,d,nx,nz);geo.rotateX(-Math.PI/2);const pos=geo.attributes.position,n=pos.count;
const col=new Float32Array(n*3);geo.setAttribute('color',new THREE.BufferAttribute(col,3));const sh=new THREE.Color('#3d8682'),dp=new THREE.Color('#163d5a'),fo=new THREE.Color('#e4ece6'),tc=new THREE.Color();
const t=bumpFor(texWater());t.repeat.set(w/6,d/6);
const m=new THREE.MeshStandardMaterial({vertexColors:true,roughness:.09,metalness:.05,envMapIntensity:1.05,bumpMap:t,bumpScale:.035});   // mare vero: scuro al largo, verde-azzurro a riva, riflette il cielo
const me=new THREE.Mesh(geo,m);me.position.set(cx,-.5,cz);me.userData.noCast=true;world.add(me);
const ft=texFoam().clone();ft.needsUpdate=true;ft.repeat.set(w/3,1);const fm=new THREE.MeshBasicMaterial({map:ft,transparent:true,depthWrite:false});const foam=new THREE.Mesh(new THREE.PlaneGeometry(w,1.1),fm);foam.rotation.x=-Math.PI/2;foam.position.set(cx,-.28,shoreZ+.5);world.add(foam);
const depth=new Float32Array(n);for(let i=0;i<n;i++)depth[i]=clamp((pos.getZ(i)+cz-shoreZ)/40,0,1);geo.setAttribute('aDepth',new THREE.BufferAttribute(depth,1));
const WT={value:0};
m.onBeforeCompile=s=>{s.uniforms.uWT=WT;s.uniforms.uWC={value:new THREE.Vector2(cx,cz)};s.uniforms.uSh={value:sh};s.uniforms.uDp={value:dp};s.uniforms.uFo={value:fo};
s.vertexShader='attribute float aDepth;uniform float uWT;uniform vec2 uWC;uniform vec3 uSh,uDp,uFo;\n'+s.vertexShader
.replace('#include <beginnormal_vertex>',`float wy=0.,wox=0.,woz=0.,gx=0.,gz=0.;{float x=position.x+uWC.x,z=position.z+uWC.y,k=.25+.75*aDepth;
vec4 W[4];W[0]=vec4(.9,.42,.24,.9);W[1]=vec4(.6,-.8,.14,1.5);W[2]=vec4(-.3,1.,.09,2.3);W[3]=vec4(1.,.1,.05,3.4);
for(int i=0;i<4;i++){vec4 q=W[i];float f=q.w*.35,ph=(q.x*x+q.y*z)*f+uWT*sqrt(q.w)*1.3,s=sin(ph),c=cos(ph);wy+=q.z*s*k;wox+=q.x*q.z*c*.5*k;woz+=q.y*q.z*c*.5*k;gx+=q.z*k*c*q.x*f;gz+=q.z*k*c*q.y*f;}}
vec3 objectNormal=normalize(vec3(-gx,1.,-gz));`)
.replace('#include <begin_vertex>','vec3 transformed=vec3(position.x+wox,wy,position.z+woz);')
.replace('#include <color_vertex>','#include <color_vertex>\nvColor=mix(mix(uSh,uDp,pow(aDepth,.6)),uFo,0.);');
s.vertexShader=s.vertexShader.replace('vec3 transformed=vec3(position.x+wox,wy,position.z+woz);','vec3 transformed=vec3(position.x+wox,wy,position.z+woz);vColor=mix(mix(uSh,uDp,pow(aDepth,.6)),uFo,clamp((wy-.3)*2.5,0.,.45));');};
hooks.push(dt=>{const tt=now();WT.value=tt;
t.offset.x+=dt*.03;t.offset.y+=dt*.02;ft.offset.x+=dt*.05;foam.position.z=shoreZ+.5+Math.sin(tt*.9)*.3;fm.opacity=.75+Math.sin(tt*.9+1)*.2;});}
function boat(x,z,col){const g=new THREE.Group();const hg=new THREE.SphereGeometry(1,24,10,0,TAU,Math.PI/2,Math.PI/2);const hull=new THREE.Mesh(hg,mc('#f2efe6',{rough:.5,double:true}));hull.scale.set(1.3,.5,.48);hull.position.y=.48;g.add(hull);
const rim=new THREE.Mesh(new THREE.TorusGeometry(1,.05,6,32),mc(col,{rough:.5}));rim.rotation.x=Math.PI/2;rim.scale.set(1.3,.48,1);rim.position.y=.46;g.add(rim);const band=new THREE.Mesh(new THREE.CylinderGeometry(1,1,.12,32,1,true),mc(col,{rough:.5,double:true}));band.scale.set(1.302,1,.482);band.position.y=.38;g.add(band);
const in_=new THREE.Mesh(new THREE.CylinderGeometry(1,1,.04,24),mc('#8a6a48'));in_.scale.set(1.2,1,.4);in_.position.y=.26;g.add(in_);for(const bx of [-.45,.35]){const b=new THREE.Mesh(CG.box,mc('#7a5634'));b.scale.set(.18,.05,.86);b.position.set(bx,.4,0);g.add(b);}
for(const s of [-1,1]){const o=new THREE.Mesh(CG.box,mc('#a88050'));o.scale.set(1.8,.04,.06);o.position.set(.1,.47,s*.3);o.rotation.y=s*.12;g.add(o);}
const ms=new THREE.Mesh(new THREE.CylinderGeometry(.03,.04,1.4,6),mc('#6a4a30'));ms.position.set(.3,1.1,0);g.add(ms);g.position.set(x,-.5,z);g.rotation.y=R()*TAU;world.add(g);const ph=R()*6;hooks.push(()=>{const tt=now();g.position.y=-.45+Math.sin(tt*1.3+ph)*.08;g.rotation.z=Math.sin(tt*1.1+ph)*.06;g.rotation.x=Math.cos(tt*.9+ph)*.04;});}
function palm(x,z,h,crowns){const tr=new THREE.Mesh(new THREE.CylinderGeometry(.12,.2,h,6),mat('#8a6a48'));tr.position.set(x,h/2,z);tr.rotation.z=.05;world.add(tr);const cr=new THREE.Group();cr.position.set(x-h*.025,h,z);const lm=mat(texLeaf(),{alpha:true,double:true});for(let i=0;i<7;i++){const yawG=new THREE.Group();yawG.rotation.y=i/7*TAU+R()*.3;const tilt=new THREE.Group();tilt.rotation.z=-.35-R()*.25;const lf=new THREE.Mesh(new THREE.PlaneGeometry(2.3,.7),lm);lf.geometry.translate(1.15,0,0);lf.rotation.x=-Math.PI/2;tilt.add(lf);yawG.add(tilt);cr.add(yawG);}world.add(cr);obstacles.push({x0:x-.2,x1:x+.2,z0:z-.2,z1:z+.2});const ph=R()*6;hooks.push(()=>{const tt=now();cr.rotation.z=Math.sin(tt*1.2+ph)*.05;cr.rotation.x=Math.cos(tt*.9+ph)*.04;});}
function gulls(cx,cz,n,y){const fr=gullFrames();const list=[];for(let i=0;i<n;i++){const m=new THREE.SpriteMaterial({map:fr.r[0],transparent:true,alphaTest:.5});const sp=new THREE.Sprite(m);sp.scale.set(.9,.5,1);world.add(sp);list.push({sp,m,a:R()*TAU,r:rr(4,10),s:rr(.25,.45)*(R()<.5?-1:1),h:y+rr(-1,2),ph:R()*6});}
hooks.push(dt=>{const tt=now();for(const g of list){g.a+=g.s*dt;g.sp.position.set(cx+Math.cos(g.a)*g.r,g.h+Math.sin(tt+g.ph)*.5,cz+Math.sin(g.a)*g.r);g.m.map=fr.r[Math.floor(tt*4+g.ph)%2];}});}
function pigeons(cx,cz,n){const fr=pigeonFrames();const list=[];for(let i=0;i<n;i++){const m=new THREE.SpriteMaterial({map:fr.r[0],transparent:true,alphaTest:.5});m.color.set(tint);const sp=new THREE.Sprite(m);sp.center.set(.5,0);sp.scale.set(.5,.42,1);const hx=cx+rr(-3,3),hz=cz+rr(-3,3);sp.position.set(hx,0,hz);world.add(sp);list.push({sp,m,hx,hz,st:0,t:R()*3,vx:0,vy:0,vz:0,flip:R()<.5});}
hooks.push(dt=>{for(const p of list){p.t+=dt;const s=p.sp.position;if(p.st===0){p.m.map=(p.flip?fr.l:fr.r)[Math.floor(p.t*2.5)%3===0?1:0];if(Math.random()<dt*.4){s.x+=rr(-.2,.2);s.z+=rr(-.2,.2);p.flip=R()<.5;}if(P&&Math.hypot(P.x-s.x,P.z-s.z)<2.2){p.st=1;const a=Math.atan2(s.z-P.z,s.x-P.x)+rr(-.6,.6);p.vx=Math.cos(a)*3.5;p.vz=Math.sin(a)*3.5;p.vy=3;p.t=0;p.flip=p.vx<0;tone(1900,.03,'square',.015);}}
else{s.x+=p.vx*dt;s.y+=p.vy*dt;s.z+=p.vz*dt;p.vy=Math.max(.8,p.vy-dt);p.m.map=(p.flip?fr.l:fr.r)[2+(Math.floor(p.t*12)%2)];if(p.t>8){p.st=0;s.set(p.hx,0,p.hz);}}}});}
function ballKids(x1,z1,x2,z2){const pv=NAPX===NAPW,a=actor(pv?poor(C.carluccio):C.carluccio,x1,z1,{name:''}),b=actor(pv?poor(C.bimba):C.bimba,x2,z2,{name:''});a.watch=b.watch=false;a.face={x:x2-x1,z:z2-z1};b.face={x:x1-x2,z:z1-z2};
const c=document.createElement('canvas');c.width=6;c.height=6;const g=c.getContext('2d');g.fillStyle='#f2f0ea';g.fillRect(1,0,4,6);g.fillRect(0,1,6,4);g.fillStyle='#d23a30';g.fillRect(2,1,2,4);const m=new THREE.SpriteMaterial({map:mkTex(c),transparent:true});m.color.set(tint);const ball=new THREE.Sprite(m);ball.scale.set(.3,.3,1);world.add(ball);
let t=0,dir=1;hooks.push(dt=>{t+=dt/1.3;if(t>=1){t=0;dir*=-1;tone(320,.05,'triangle',.03);emote(dir>0?a:b,R()<.3?'heart':'note');}const k=dir>0?t:1-t;ball.position.set(x1+(x2-x1)*k,heightAt(x1,z1)+.25+Math.sin(t*Math.PI)*1.4,z1+(z2-z1)*k);});return [a,b];}
function flock(x,y,z,n,vx){const fr=gullFrames();const list=[];for(let i=0;i<n;i++){const m=new THREE.SpriteMaterial({map:fr.r[0],transparent:true,alphaTest:.5,color:0x4a4440});const sp=new THREE.Sprite(m);sp.scale.set(.7,.4,1);world.add(sp);const k=Math.ceil(i/2)*(i%2?1:-1);list.push({sp,m,dx:-Math.abs(k)*1.1,dz:k*.9,dy:Math.abs(k)*.15,ph:R()*6});}
let cx=x;hooks.push(dt=>{cx+=vx*dt;const tt=now();for(const b of list){b.sp.position.set(cx+b.dx*Math.sign(vx),y+b.dy+Math.sin(tt*1.3+b.ph)*.2,z+b.dz);b.m.map=(vx>0?fr.r:fr.l)[Math.floor(tt*5+b.ph)%2];}});}
function leaves(n,col){const list=[];for(let i=0;i<n;i++){const m=new THREE.SpriteMaterial({map:texLeafBit(),transparent:true,alphaTest:.5,color:col||0xffffff});const sp=new THREE.Sprite(m);sp.scale.set(.16,.11,1);world.add(sp);list.push({sp,m,x:rr(-8,8),y:rr(0,7),z:rr(-8,8),ph:R()*6,v:rr(.35,.7)});}
hooks.push(dt=>{const tt=now(),cx=P?P.x:camera.position.x,cz=P?P.z:camera.position.z-6;for(const l of list){l.y-=l.v*dt;l.x+=Math.sin(tt*1.4+l.ph)*dt*.6+dt*.25;if(l.y<.03){l.y=rr(5,8);l.x=rr(-8,8);l.z=rr(-8,8);}l.sp.position.set(cx+l.x,l.y,cz+l.z);l.m.rotation=Math.sin(tt*3+l.ph)*1.2;l.sp.scale.x=.16*Math.abs(Math.cos(tt*2.2+l.ph))+.03;}});}
function chimneySmoke(x,y,z,col){hooks.push(dt=>{if(Math.random()<dt*2.2)puff(x,y,z,.5,col||0xd8d8dc,3.2,.8,.25,0);});}
function glowAt(x,y,z,s,col,flick){const m=new THREE.SpriteMaterial({map:glowTex,color:col===undefined?0xffcf6a:col,transparent:true,depthWrite:false,blending:THREE.AdditiveBlending,opacity:.8});const sp=new THREE.Sprite(m);sp.position.set(x,y,z);sp.scale.set(s,s,1);world.add(sp);
if(flick){const ph=Math.random()*9;hooks.push(()=>{const tt=now();m.opacity=.62+Math.sin(tt*7+ph)*.12+Math.sin(tt*13.7+ph)*.08;});}return sp;}
const SHAFT_FS=`uniform vec3 uCol;uniform float uTime,uOp,uPh,uStrobe;varying vec2 vUv;
float h(vec2 p){return fract(sin(dot(p,vec2(41.3,289.1)))*15731.743);}
void main(){float e=smoothstep(0.,.38,vUv.x)*smoothstep(1.,.62,vUv.x);float a=smoothstep(0.,.3,vUv.y)*(.35+.65*vUv.y);
float f=.8+.2*sin(uTime*.7+uPh+vUv.y*4.);
if(uStrobe>0.)f*=mix(1.,.35,smoothstep(.0,.08,fract(uTime*1.1+uPh))*smoothstep(.22,.14,fract(uTime*1.1+uPh)));
vec2 g=floor(vec2(vUv.x*14.,vUv.y*40.+uTime*1.6+uPh));float m=step(.93,h(g))*.9;
gl_FragColor=vec4(uCol*(e*a*f*uOp*(1.+m)),1.);}`;
function shaft(x,y,z,w,len,ry,rz,col,op,strobe){const m=new THREE.ShaderMaterial({vertexShader:`varying vec2 vUv;void main(){vUv=uv;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}`,fragmentShader:SHAFT_FS,
uniforms:{uCol:{value:new THREE.Color(col)},uTime:{value:0},uOp:{value:op},uPh:{value:Math.random()*9},uStrobe:{value:strobe?1:0}},transparent:true,depthWrite:false,blending:THREE.AdditiveBlending,side:THREE.DoubleSide});
const me=new THREE.Mesh(new THREE.PlaneGeometry(w,len),m);me.position.set(x,y,z);me.rotation.order='YXZ';me.rotation.y=ry;me.rotation.z=rz;world.add(me);hooks.push(()=>{m.uniforms.uTime.value=now();});return me;}
function motes(col){const n=22,pos=new Float32Array(n*3),ph=[];for(let i=0;i<n;i++){pos[i*3]=rr(-7,7);pos[i*3+1]=rr(.3,5);pos[i*3+2]=rr(-7,7);ph.push(R()*6);}
const pg=new THREE.BufferGeometry();pg.setAttribute('position',new THREE.BufferAttribute(pos,3));const pts=new THREE.Points(pg,new THREE.PointsMaterial({color:col,size:.045,transparent:true,opacity:.4,depthWrite:false,blending:THREE.AdditiveBlending}));world.add(pts);
hooks.push(dt=>{const a=pg.attributes.position.array,tt=now();for(let i=0;i<n;i++){a[i*3+1]+=Math.sin(tt*.7+ph[i])*dt*.15;a[i*3]+=Math.cos(tt*.5+ph[i])*dt*.1;}pg.attributes.position.needsUpdate=true;if(P)pts.position.set(P.x,0,P.z);});}
function snowfall(n){const pos=new Float32Array(n*3);for(let i=0;i<n;i++){pos[i*3]=rr(-20,20);pos[i*3+1]=rr(0,12);pos[i*3+2]=rr(-30,15);}
const pg=new THREE.BufferGeometry();pg.setAttribute('position',new THREE.BufferAttribute(pos,3));const pts=new THREE.Points(pg,new THREE.PointsMaterial({color:0xffffff,size:.09}));world.add(pts);
hooks.push(dt=>{const a=pg.attributes.position.array;for(let i=0;i<n;i++){a[i*3+1]-=dt*.6;a[i*3]+=Math.sin((a[i*3+1]+i)*.7)*dt*.1;if(a[i*3+1]<0)a[i*3+1]=12;}pg.attributes.position.needsUpdate=true;if(P){pts.position.x=P.x;pts.position.z=P.z+5;}});}
function snowPrints(){const prints=[],geo=new THREE.CircleGeometry(.09,6);let lx=null,lz=null,side=1;
hooks.push(dt=>{if(P&&P.g.visible){if(lx===null){lx=P.x;lz=P.z;}const dx=P.x-lx,dz=P.z-lz,l=Math.hypot(dx,dz);
if(l>2){lx=P.x;lz=P.z;}else if(l>.45){side*=-1;const m=new THREE.Mesh(geo,new THREE.MeshBasicMaterial({color:0x8a94a8,transparent:true,opacity:.5,depthWrite:false}));m.rotation.x=-Math.PI/2;m.position.set(P.x-dz/l*.1*side,.02,P.z+dx/l*.1*side);world.add(m);prints.push({m,t:0});lx=P.x;lz=P.z;}}
for(let i=prints.length-1;i>=0;i--){const p=prints[i];p.t+=dt;p.m.material.opacity=.5*(1-p.t/6);if(p.t>6){world.remove(p.m);p.m.material.dispose();prints.splice(i,1);}}});}
function breath(){hooks.push(dt=>{for(const a of actors){if(typeof a.def==='string'||!a.g.visible)continue;if(Math.random()<dt*.35){const fl=Math.hypot(a.face.x,a.face.z)||1,fx=a.face.x/fl,fz=a.face.z/fl,h=(a.def.adult?1.85:1.35)*(a.sc||1);puff(a.x+fx*.18,h,a.z+fz*.18,.14,0xffffff,1.1,.25,fx*.35,fz*.35);}}});}
function chatter(rate){hooks.push(dt=>{if(Math.random()<dt*rate){const c=actors.filter(a=>!a.isPlayer&&typeof a.def!=='string'&&a.g.visible&&!a.markFn);if(c.length)emote(c[Math.floor(Math.random()*c.length)],pick(['note','dots','heart']));}});}
function dog(x,z){const a=actor('dog',x,z,{solid:false,watch:false});a.critter=true;let bark=3;
hooks.push(dt=>{if(!P)return;const dx=P.x-a.x,dz=P.z-a.z,d=Math.hypot(dx,dz);
if(d<8&&d>1.7){const s=Math.min(3.8,d*1.3);a.x+=dx/d*s*dt;a.z+=dz/d*s*dt;collide(a,.25);a.face={x:dx,z:dz};a.moving=true;}else{a.moving=false;if(d<=1.7&&d>.01)a.face={x:dx,z:dz};}
bark-=dt;if(bark<=0&&d<6){bark=rr(5,10);tone(380,.07,'square',.04);tone(300,.08,'square',.04,.1);emote(a,'heart');}});return a;}
