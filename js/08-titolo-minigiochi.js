"use strict";
let titleTrain=null;
function buildTitle(){clearWorld();R=mulberry(3);setEnv('title');onTitle=true;
const gt=ctex(32,32,g=>{g.fillStyle='#9a9a52';g.fillRect(0,0,32,32);speck(g,32,32,['#aaa45a','#86864a','#c0b068','#d8c070'],170);});ground(260,140,gt,0,-30,60,32);
for(let i=0;i<10;i++){const h=new THREE.Mesh(new THREE.ConeGeometry(rr(10,20),rr(5,11),6),mat(pick(['#7e7a50','#8a7650','#6e7050'])));h.position.set(rr(-80,80),2,rr(-80,-35));world.add(h);}
box(0,-.1,0,260,.12,2.4,mat('#5a4a3a'),{collide:false});box(0,.02,-.6,260,.08,.12,mat('#9a9aa2'),{collide:false});box(0,.02,.6,260,.08,.12,mat('#9a9aa2'),{collide:false});
for(let x=-70;x<70;x+=9)tree(x+rr(-2,2),rr(-14,-6),rr(5,8),pick(['#5e6c40','#6a7048','#4e5a38']));
titleTrain=makeTrain(3,true);titleTrain.g.position.set(-45,0,0);titleTrain.idle=false;titleTrain.speed=4;
gulls(0,-10,3,12);
camera.position.set(3,3.2,13);camera.lookAt(0,2.2,0);music(null);}
function titleUpdate(dt){for(const h of hooks)h(dt);if(!titleTrain)return;titleTrain.g.position.x+=dt*4;titleTrain.speed=4;if(titleTrain.g.position.x>55)titleTrain.g.position.x=-55;
const t=now();camera.position.set(3+Math.sin(t*.1)*2,3.2,13);camera.lookAt(0,2.2,0);}
let splashOn=false;
function steamWhistle(){if(!AC||muted)return;const t=AC.currentTime;for(const [f,v] of [[587,.05],[740,.04],[880,.025]]){const o=AC.createOscillator(),g=AC.createGain();o.type='triangle';o.frequency.setValueAtTime(f*.97,t);o.frequency.linearRampToValueAtTime(f,t+.15);
g.gain.setValueAtTime(.0001,t);g.gain.exponentialRampToValueAtTime(v,t+.12);g.gain.setValueAtTime(v,t+1.1);g.gain.exponentialRampToValueAtTime(.0001,t+1.6);o.connect(g);g.connect(MASTER);o.start(t);o.stop(t+1.7);}noise(.9,2200,.03,'bandpass');}
function buildSplash(){const tk=++TOKEN;const tr=buildCampagna();tr.g.position.x=6;setEnv('sunset');onTitle=true;titleTrain=null;splashOn=true;
const am=actor(C.amerigoN,-4.15,6.2,{fx:.75,fz:-1,watch:false}),ma=actor(C.mariuccia,-3.3,6.5,{fx:.5,fz:-1,watch:false});
const cam0=new THREE.Vector3(-5.2,.8,9.4),look0=new THREE.Vector3(1.2,2.15,0),cp=cam0.clone(),lk=look0.clone();let go=0;
hooks.push(dt=>{updateActors(dt);const t=now();
if(go){const k=Math.min(1,(t-go)/6.5),e=k*k*(3-2*k);cp.set(cam0.x+e*3.5,cam0.y+e*1.6,cam0.z+e*2.2);lk.set(Math.max(look0.x,tr.g.position.x-7)+e*6,look0.y+e*.4,0);}
camera.position.set(cp.x+Math.sin(t*.37)*.05,cp.y+Math.sin(t*.53)*.035,cp.z+Math.sin(t*.29)*.04);camera.lookAt(lk);});
const sp=$('#splash');sp.hidden=false;sp.classList.remove('out');$('#menu').hidden=true;
sp.onclick=async()=>{if(go||tk!==TOKEN)return;audioInit();go=now();sp.classList.add('out');steamWhistle();wave(am,3);wave(ma,2.5);
trainTo(tr,80,9000);await sleep(5600);if(tk!==TOKEN)return;$('#fade').classList.add('on');await sleep(1100);if(tk!==TOKEN)return;
splashOn=false;sp.hidden=true;buildTitle();$('#menu').hidden=false;showPanel('mMain');refreshCont();$('#fade').classList.remove('on');};}
function hideSplash(){splashOn=false;const sp=$('#splash');if(sp){sp.hidden=true;sp.onclick=null;}}
addEventListener('keydown',e=>{if(splashOn&&(e.code==='Enter'||e.code==='Space')){const f=$('#splash').onclick;if(f)f();}});
let MG=null;
function miniGame(title,help,w,h,make){return new Promise(res=>{const tk=TOKEN;$('#mkick').textContent=($('#chap').textContent||'').toUpperCase();$('#mc').classList.remove('ok','ko');$('#mtitle').textContent=title;$('#mhelp').textContent=help;const cv=$('#mc');cv.width=w;cv.height=h;cv.style.setProperty('--ar',w/h);const g=cv.getContext('2d');g.imageSmoothingEnabled=false;$('#mini').hidden=false;$('#prompt').hidden=true;miniOn=true;
let done=false;const finish=r=>{if(done)return;done=true;setTimeout(()=>{if(tk!==TOKEN)return;$('#mini').hidden=true;miniOn=false;MG=null;res(r);},1300);};
MG=make(g,finish,w,h);MG.tk=tk;
cv.onpointerdown=e=>{audioInit();const r=cv.getBoundingClientRect();if(MG&&MG.pointer)MG.pointer((e.clientX-r.left)/r.width*w,(e.clientY-r.top)/r.height*h);};
(function fr(){if(!MG||MG.tk!==TOKEN)return;MG.frame(now());requestAnimationFrame(fr);})();});}
function txt(g,s,x,y,size,col,align){g.font='bold '+size+'px "Courier Prime","Courier New",monospace';g.textAlign=align||'center';g.textBaseline='middle';g.fillStyle='#000';g.fillText(s,x+1,y+1);g.fillStyle=col;g.fillText(s,x,y);}
const SONG=[[0,62],[1,66],[2,69],[3,66],[4,67],[5,71],[6,69],[8,66],[9,69],[10,74],[11,73],[12,71],[13,69],[14,66],[16,64],[17,67],[18,71],[19,69],[20,67],[21,66],[22,64],[24,62],[25,66],[26,69],[27,71],[28,69],[29,66],[30,62]];
const laneOf=m=>m<=66?0:m<=69?1:2;
function rhythmGame(song,bpm){return (g,finish,W,H)=>{const spb=60/bpm,t0=now()+2.4,HY=255,TRAVEL=1.6,LX=[40,120,200],COL=['#e9c46a','#d6e2c0','#d63a2f'];
const notes=song.map(([b,m])=>({t:t0+b*spb,lane:laneOf(m),m,hit:0,miss:0}));const S={score:0,max:song.length*2,judg:'',jt:0,flash:[0,0,0],nb:0,ended:false,parts:[]};
function hit(l){if(S.ended)return;const t=now();S.flash[l]=t+.12;let best=null,bd=1;for(const n of notes){if(n.hit||n.miss||n.lane!==l)continue;const d=Math.abs(t-n.t);if(d<.2&&d<bd){bd=d;best=n;}}
if(best){best.hit=1;const p=bd<.08;S.score+=p?2:1;S.judg=p?'Perfetto!':'Bene';S.jt=t;violin(midi(best.m),spb*.9);for(let i=0;i<6;i++)S.parts.push({x:LX[l],y:HY,vx:(Math.random()-.5)*80,vy:-40-Math.random()*60,t:t,c:COL[l]});}else tone(140,.08,'sawtooth',.03);}
return{key(c){const l={ArrowLeft:0,KeyA:0,ArrowDown:1,KeyS:1,ArrowUp:1,KeyW:1,ArrowRight:2,KeyD:2}[c];if(l!==undefined)hit(l);},pointer(x){hit(clamp(Math.floor(x/W*3),0,2));},
frame(t){while(t>=t0+S.nb*spb-.02&&S.nb<song[song.length-1][0]+3){if(S.nb%2===0)tone(midi(50),spb*2,'triangle',.05);S.nb++;}
for(const n of notes)if(!n.hit&&!n.miss&&t-n.t>.2){n.miss=1;S.judg='Persa';S.jt=t;}
g.fillStyle='#1e1828';g.fillRect(0,0,W,H);
for(let i=0;i<3;i++){g.fillStyle=S.flash[i]>t?'#3a3048':'#262034';g.fillRect(LX[i]-30,0,60,H);g.fillStyle='#120e18';g.fillRect(LX[i]+30,0,2,H);}
g.fillStyle='#e9c46a';g.fillRect(0,HY,W,2);
for(let i=0;i<3;i++){g.strokeStyle=COL[i];g.lineWidth=2;g.strokeRect(LX[i]-14,HY-8,28,18);}
for(const n of notes){if(n.hit||n.miss)continue;const y=HY-(n.t-t)/TRAVEL*HY;if(y<-20||y>H+10)continue;const x=LX[n.lane];g.fillStyle='#000';g.fillRect(x-12,y-6,26,14);g.fillStyle=COL[n.lane];g.fillRect(x-13,y-7,26,14);g.fillStyle='#15111d';g.fillRect(x-4,y-3,8,6);}
S.parts=S.parts.filter(p=>t-p.t<.6);for(const p of S.parts){const k=t-p.t;g.fillStyle=p.c;g.fillRect(p.x+p.vx*k,p.y+p.vy*k+120*k*k,3,3);}
['← A','↓ S','→ D'].forEach((s,i)=>txt(g,s,LX[i],290,10,'#f2ecdf'));
if(t<t0)txt(g,String(Math.ceil(t0-t)),120,130,24,'#e9c46a');
if(t-S.jt<.6&&S.judg)txt(g,S.judg,120,110,16,S.judg==='Perfetto!'?'#e9c46a':S.judg==='Bene'?'#d6e2c0':'#d63a2f');
txt(g,'PUNTI '+S.score,8,14,10,'#f2ecdf','left');
if(t>notes[notes.length-1].t+1&&!S.ended){S.ended=true;const pct=S.score/S.max;finish(pct);}
if(S.ended)txt(g,Math.round(S.score/S.max*100)+'% delle note',120,150,15,'#e9c46a');}};};}
const rhythm=(title,song,bpm)=>miniGame(title,'Premi quando la nota arriva sulla linea: ← ↓ → oppure A S D. Sul telefono tocca le corsie.',240,300,rhythmGame(song,bpm||96));
function stonesGame(g,finish,W,H){const am=personFrames(C.amerigo).cs[2];const tri=(t,s)=>1-Math.abs(((t*s)%2)-1);
const S={ph:'power',tp:now(),n:0,best:0,msg:'Tommasino ha fatto 5 rimbalzi. Tocca a te: 3 tiri!',anim:null,power:0,angle:0,ta:0,ts:0};
const sky=g.createLinearGradient(0,0,0,100);sky.addColorStop(0,'#3f9de0');sky.addColorStop(1,'#ffe2b0');const sea=g.createLinearGradient(0,100,0,H);sea.addColorStop(0,'#1d70c0');sea.addColorStop(1,'#4ad8d8');
function press(){const t=now();
if(S.ph==='power'){S.power=tri(t-S.tp,.9);S.ph='angle';S.ta=t;tone(500,.05,'square',.04);}
else if(S.ph==='angle'){S.angle=tri(t-S.ta,1.2);const pq=clamp(1-Math.abs(S.power-.9)/.55,0,1),aq=clamp(1-Math.abs(S.angle-.2)/.5,0,1);const b=Math.round(9*pq*aq+(pq*aq>.8?1:0));
const xs=[56],ys=[112],hs=[];let x=56,len=50*S.power+40;if(b===0){xs.push(56+len*.8);ys.push(150);hs.push(30);}else{for(let i=0;i<b;i++){x+=len;xs.push(x);ys.push(138);hs.push(i===0?28:14*Math.pow(.8,i));len*=.72;}xs.push(x+len*.5);ys.push(146);hs.push(6);}
S.anim={t0:t,b,xs,ys,hs};S.ph='fly';noise(.15,1200,.04,'highpass');}}
return{key(c){if(c==='Space'||c==='Enter'||c==='KeyE')press();},pointer(){press();},
frame(t){g.fillStyle=sky;g.fillRect(0,0,W,100);g.fillStyle='#fff3c0';g.fillRect(250,30,14,14);g.fillStyle='rgba(255,240,190,.4)';g.fillRect(244,24,26,26);
g.fillStyle='#8a8fba';g.beginPath();g.moveTo(180,100);g.lineTo(230,66);g.lineTo(245,66);g.lineTo(300,100);g.fill();
g.fillStyle=sea;g.fillRect(0,100,W,H-100);for(let i=0;i<30;i++){const y=104+(i*7)%70,x=((i*53+t*20*(i%3+1))%(W+20))-10;g.fillStyle=i%2?'rgba(255,255,255,.7)':'rgba(255,255,255,.35)';g.fillRect(x,y,6+(i%4)*2,1);}
g.fillStyle='#6a6660';g.fillRect(0,118,60,H-118);g.fillStyle='#857e74';g.fillRect(0,118,60,3);g.drawImage(am,18,82,32,64);
if(S.anim){const a=S.anim,per=.3,k=(t-a.t0)/per,si=Math.min(a.xs.length-2,Math.floor(k)),u=clamp(k-si,0,1);
for(let i=1;i<a.xs.length-1;i++){if(k>i){const age=t-a.t0-i*per;if(age<1.2){g.strokeStyle='rgba(255,255,255,'+(1-age/1.2)+')';g.lineWidth=1;g.beginPath();g.ellipse(a.xs[i],a.ys[i]+2,4+age*16,1+age*4,0,0,TAU);g.stroke();}}}
if(k<a.xs.length-1){const x=a.xs[si]+(a.xs[si+1]-a.xs[si])*u,y=a.ys[si]+(a.ys[si+1]-a.ys[si])*u-Math.sin(u*Math.PI)*a.hs[si];g.fillStyle='#2a2a30';g.fillRect(x-2,y-1,5,3);}
if(S.ph==='fly'&&k>=a.xs.length-1){S.n++;S.best=Math.max(S.best,a.b);S.ph='shown';S.ts=t;S.msg=a.b===0?'Plof! Affondato subito.':a.b+(a.b===1?' rimbalzo!':' rimbalzi!')+(a.b>5?' Più di Tommasino!':'');if(a.b>5)sfxGood();else tone(240,.15,'triangle',.05);}}
if(S.ph==='shown'&&t-S.ts>1.4){if(S.n>=3){S.ph='end';S.msg='Il tuo record: '+S.best+' rimbalzi';finish(S.best);}else{S.ph='power';S.tp=t;S.anim=null;S.msg='Tiro '+(S.n+1)+' di 3';}}
txt(g,S.msg,W/2,14,11,'#ffffff');
if(S.ph==='power'||S.ph==='angle'){const pv=S.ph==='power'?tri(t-S.tp,.9):S.power;g.fillStyle='#15111d';g.fillRect(90,154,140,10);g.fillStyle='#3a8a5a';g.fillRect(90+140*.68,154,140*.32,10);g.fillStyle='#e9c46a';g.fillRect(90,156,140*pv,6);txt(g,'FORZA',70,159,9,'#fff','right');
if(S.ph==='angle'){const av=tri(t-S.ta,1.2);g.fillStyle='#15111d';g.fillRect(90,168,140,9);g.fillStyle='#3a8a5a';g.fillRect(90,168,140*.4,9);g.fillStyle='#d63a2f';g.fillRect(90+140*av-2,166,4,13);txt(g,'ANGOLO',70,172,9,'#fff','right');txt(g,'(basso = piatto)',236,172,8,'#fff','left');}
txt(g,'Premi SPAZIO o tocca',W/2,30,9,'#fff');}}};}
function danceGame(g,finish,W,H){const ROUNDS=[3,4,5,6],ARW=['↑','←','→','↓'],RECT=[[90,14,60,46],[14,94,60,46],[166,94,60,46],[90,178,60,46]],NOTE=[72,67,76,64],COL=['#e9c46a','#d63a2f','#3a8ad0','#5ab04a'];
const am=personFrames(C.amerigoN).cs,ro=personFrames(C.rosa).cs;const seq=[];while(seq.length<6)seq.push(Math.floor(Math.random()*4));
const S={round:0,ph:'wait',t:now()+1.2,idx:0,lit:-1,litT:-9,miss:0,clean:0,msg:'Guarda Rosa e ripeti i passi!',bA:-9,bR:-9,ended:false};
const len=()=>ROUNDS[Math.min(S.round,3)];
function light(i){S.lit=i;S.litT=now();tone(midi(NOTE[i]),.25,'triangle',.08);}
function input(i){if(S.ph!=='input'||S.ended)return;light(i);
if(seq[S.idx]===i){S.idx++;S.bA=now();if(S.idx>=len()){if(!S.miss)S.clean++;S.round++;S.ph='ok';S.t=now()+.9;S.msg=['Brava!','Bravo!','Che ballerino!','Olé!'][S.round%4];sfxGood();}}
else{sfxBad();S.miss++;if(S.miss>=2){S.msg='Va bene, andiamo avanti!';S.round++;S.ph='ok';S.t=now()+1.2;}else{S.msg='Ops! Riguarda i passi.';S.ph='wait';S.t=now()+1.2;}}}
return{key(c){const i={ArrowUp:0,KeyW:0,ArrowLeft:1,KeyA:1,ArrowRight:2,KeyD:2,ArrowDown:3,KeyS:3}[c];if(i!==undefined)input(i);},
pointer(x,y){RECT.forEach((r,i)=>{if(x>=r[0]&&x<=r[0]+r[2]&&y>=r[1]&&y<=r[1]+r[3])input(i);});},
frame(t){if(!S.ended){
if(S.ph==='ok'&&t>S.t){S.miss=0;if(S.round>=ROUNDS.length){S.ended=true;S.msg=S.clean+' giri su 4 senza errori!';finish(S.clean);}else{S.ph='wait';S.t=t+.4;}}
if(S.ph==='wait'&&t>S.t){S.ph='show';S.idx=0;S.t=t+.3;S.msg='Guarda Rosa…';}
if(S.ph==='show'&&t>S.t){if(S.idx<len()){light(seq[S.idx]);S.bR=t;S.idx++;S.t=t+.62;}else{S.ph='input';S.idx=0;S.msg='Tocca a te! ('+len()+' passi)';}}}
g.fillStyle='#5a3a24';g.fillRect(0,0,W,H);for(let y=0;y<H;y+=10){g.fillStyle='#4a2e1c';g.fillRect(0,y,W,1);}
const gr=g.createRadialGradient(W/2,120,10,W/2,120,150);gr.addColorStop(0,'rgba(255,200,120,.35)');gr.addColorStop(1,'rgba(0,0,0,.35)');g.fillStyle=gr;g.fillRect(0,0,W,H);
RECT.forEach((r,i)=>{const on=S.lit===i&&t-S.litT<.3;g.fillStyle='#000';g.fillRect(r[0]+3,r[1]+3,r[2],r[3]);g.fillStyle=on?COL[i]:'#2a2030';g.fillRect(r[0],r[1],r[2],r[3]);g.strokeStyle=COL[i];g.lineWidth=2;g.strokeRect(r[0]+1,r[1]+1,r[2]-2,r[3]-2);txt(g,ARW[i],r[0]+r[2]/2,r[1]+r[3]/2,22,on?'#15111d':COL[i]);});
const fr=(bt,arr)=>t-bt<.3?arr[1+(Math.floor(bt*10)%2)]:arr[0];
g.drawImage(fr(S.bR,ro),0,0,16,32,94,70+(t-S.bR<.15?-4:0),24,48);g.drawImage(fr(S.bA,am),0,0,16,32,122,70+(t-S.bA<.15?-4:0),24,48);
txt(g,'Giro '+Math.min(S.round+1,4)+'/4',8,8,9,'#ffe8b0','left');
txt(g,S.msg,W/2,242,11,'#ffe8b0');}};}
