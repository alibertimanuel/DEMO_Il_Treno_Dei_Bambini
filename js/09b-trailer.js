"use strict";
let trailerOn=false;
function trailerText(lines,cls){const el=$('#trailer');el.innerHTML='';for(const t of lines){const p=document.createElement('p');p.className=cls||'';p.textContent=t;el.appendChild(p);}
void el.offsetWidth;el.classList.add('on');}
function trailerTextOut(){$('#trailer').classList.remove('on');}
async function tShot(tk,build,p0,l0,p1,l1,ms,lines,cls){if(tk!==TOKEN)return false;$('#fade').classList.add('on');await sleep(700);if(tk!==TOKEN)return false;
build();cineOn();camSet(p0,l0);camTo(p1,l1,ms);$('#fade').classList.remove('on');await sleep(900);if(tk!==TOKEN)return false;
if(lines)trailerText(lines,cls);await sleep(Math.max(1200,ms-2600));if(tk!==TOKEN)return false;trailerTextOut();await sleep(900);return tk===TOKEN;}
function trailerPeople(list){for(const [d,x,z,path,sp] of list){const a=actor(d,x,z,{name:'',speed:sp||1.1});a.watch=false;if(path){a.path=path.map(q=>[q[0],q[1],q[2]||0]);a.loop=false;}}}
async function trailer(){const tk=++TOKEN;trailerOn=true;onTitle=false;$('#menu').hidden=true;$('#splash').hidden=true;$('#tskip').hidden=false;
const skip=()=>{if(!trailerOn)return;trailerOn=false;removeEventListener('pointerdown',skip,true);removeEventListener('keydown',skip,true);audioInit();TOKEN++;
trailerTextOut();$('#trailer').innerHTML='';$('#tskip').hidden=true;cineOff();$('#fade').classList.add('on');
setTimeout(()=>{buildTitle();$('#menu').hidden=false;showPanel('mMain');refreshCont();$('#fade').classList.remove('on');},700);};
addEventListener('pointerdown',skip,true);addEventListener('keydown',skip,true);
const ok=async()=>{
if(!await tShot(tk,()=>buildNapoli('day'),[-18,46,74],[-26,2,-30],[-38,34,40],[-22,2,-44],7600,['Napoli, 1946.','La guerra è finita da un anno.'],'tbig'))return false;
if(!await tShot(tk,()=>{buildNapoli('day');trailerPeople([[C.amerigo,0,6,[[0,6],[0,-22]],1.3],[poor(C.vicinaG),-1.4,-4,[[-1.4,-4],[-1.2,-26]]],[poor(C.tommasino),1.2,2,[[1.2,2],[.8,-20]],1.5],[poor(C.lavandaia),.8,-14]]);},
[0,2.9,11],[0,1.6,-6],[0,3.6,-2],[0,2.4,-24],7600,['Amerigo ha sette anni.','Conta le scarpe della gente: scarpe buone, un punto. Scarpe rotte, zero.']))return false;
if(!await tShot(tk,()=>{buildNapoli('day');trailerPeople([[poor(C.castagnaro),-12.3,-46.4],[poor(C.vicinaG),-12.3,-45.3],[poor(C.bimba),-12.2,-44.2],[poor(C.carluccio),-20,-40,[[-20,-40],[-14,-36]],1.4]]);},
[-9.5,3.6,-31],[-16,4,-50],[-21,6.5,-33.5],[-15,5,-52],7000,['Le case sventrate. La fame.','E le voci: «I bambini li portano in Russia».']))return false;
if(tk!==TOKEN)return false;$('#fade').classList.add('on');await sleep(700);if(tk!==TOKEN)return false;
{const tr=buildCampagna();tr.g.position.x=-40;trainTo(tr,60,9000);cineOn();const t0=now();hooks.push(()=>{const x=tr.g.position.x,k=Math.min(1,(now()-t0)/9);camera.position.set(x-9+k*5,1.9+k*.9,5.2);lookT.set(x-3,1.7,0);camera.lookAt(lookT);});}
$('#fade').classList.remove('on');await sleep(900);if(tk!==TOKEN)return false;trailerText(['Poi, un giorno, un treno.','Settantamila bambini partono verso il Nord.']);await sleep(5400);if(tk!==TOKEN)return false;trailerTextOut();await sleep(900);
if(!await tShot(tk,()=>{buildModena();trailerPeople([[C.derna,-40,5.2,[[-40,5.2],[-60,5.2]],.9],[vary(C.signora),-46,3.6,[[-46,3.6],[-70,3.6]]],[vary(C.alcide),-52,7.2,[[-52,7.2],[-34,7.2]]]]);},
[-31,2.4,5.5],[-50,2.6,4],[-46,6,7.5],[-70,3,0],7600,['Al Nord fa freddo, c\'è la nebbia e nessuno parla napoletano.','Ma una donna con la sciarpa rossa lo sta aspettando.']))return false;
if(!await tShot(tk,()=>{const T=buildTrain();T.phase('trainNight');Object.assign(T.cur,{lamp:1.5,em:1.4,out:.55,glass:.32,sh:[0,0]});T.cur.col.set(0xffd8a0);
T.seats.forEach((s,i)=>{if(i%3)return;const a=actor(vary(pick([C.bimba,C.carluccio,C.tommasino,C.mariuccia])),s.x,s.z,{name:'',fx:0,fz:s.f});sitDown(a,.44);a.doze=1;a.watch=false;});},
[0,1.6,-6],[0,1.2,4],[0,1.7,1],[0,1.2,9],6600,['Che cosa vuol dire essere di un posto?']))return false;
if(tk!==TOKEN)return false;$('#fade').classList.add('on');await sleep(900);if(tk!==TOKEN)return false;cineOff();
trailerText(['Il Treno di Amerigo','liberamente ispirato a «Il treno dei bambini» di Viola Ardone','un gioco di '+GRUPPO.join(', ')],'title');await sleep(5600);if(tk!==TOKEN)return false;trailerTextOut();await sleep(1100);
return tk===TOKEN;};
const done=await ok();if(!done||!trailerOn)return;
trailerOn=false;removeEventListener('pointerdown',skip,true);removeEventListener('keydown',skip,true);$('#tskip').hidden=true;$('#trailer').innerHTML='';$('#fade').classList.remove('on');buildSplash();}
