"use strict";
const CH={guerra:chGuerra,napoli:chNapoli};
const DEMO=!!window.TRENO_DEMO;   // demo.html mette TRENO_DEMO=true: solo il primo capitolo
const SEQ=DEMO?['guerra','napoli']:['guerra','napoli','treno','modena','natale'];
async function demoEnd(){$('#hud').hidden=true;$('#topbtns').hidden=true;hudFn=null;curChapter='finale';
const tk=TOKEN;await trailerDemoFinale();if(tk===TOKEN)toTitle();}
const SCENES=[
{id:'guerra',t:'Ricordo · Le sirene',y:'Napoli, 1943 · il rifugio sotto le bombe',tags:['gioco']},
{id:'napoli',t:'1 · Il vicolo e il mare',y:'Napoli, 1946 · le pezze nel vento, le scarpe, la partenza',tags:['libro','film']},
{id:'treno',t:'2 · Il treno',y:'Verso il Nord · memory delle parole',tags:['libro','film']},
{id:'modena',t:'3 · La nebbia e il pane',y:'Modena · galline, slittino, violino',tags:['libro','film']},
{id:'natale',t:'3b · Il Natale al Nord',y:'Modena · battaglia di neve, la mazurka, la casa di Derna',tags:['gioco']},
{id:'finale',t:'Finale · La nostra riflessione',y:'Una stazione al tramonto · senza spoiler',tags:['gioco']}];
async function runFrom(id){const tk=TOKEN;let i=id==='finale'?SEQ.length:Math.max(0,SEQ.indexOf(id));
await fade(true);if(tk!==TOKEN)return;
for(;i<SEQ.length;i++){curChapter=SEQ[i];saveAt(SEQ[i]);await CH[SEQ[i]]();if(tk!==TOKEN)return;}
if(DEMO){await demoEnd();return;}
curChapter='finale';saveAt('finale');await finale();saveAt(null);}
function saveAt(id){if(DEMO)return;try{if(id)localStorage.setItem('treno-save',id);else localStorage.removeItem('treno-save');}catch(e){}refreshCont();}
function savedAt(){if(DEMO)return null;try{const s=localStorage.getItem('treno-save');return SCENES.some(x=>x.id===s)?s:null;}catch(e){return null;}}
function refreshCont(){const s=savedAt(),b=$('#mCont');b.hidden=!s;if(s){const sc=SCENES.find(x=>x.id===s);b.textContent='Continua · '+sc.t.replace(/^[^·]*·\s*/,'')+' ▸';$('#mStart').className='ghost';}else $('#mStart').className='big';}
function startFrom(id){audioInit();hideSplash();TOKEN++;resetRun();resetStats();$('#menu').hidden=true;playing=true;$('#touch').hidden=!isTouch;runFrom(id);}
function resetRun(){dq=Promise.resolve();fading=false;clearInterval(D.timer);D.typing=false;D.resolve=null;D.choices=null;D.open=false;dlg.hidden=true;cardRes=null;$('#card').hidden=true;$('#pause').hidden=true;$('#mini').hidden=true;miniOn=false;MG=null;interacting=false;locked=0;clearInterval(ringTimer);waiters.length=0;cineOff();stopAmb();shake=0;lastHud='';curChapter=null;poemSkip=null;$('#poem').hidden=true;$('#credits').hidden=true;}
function toTitle(){hideSplash();TOKEN++;resetRun();playing=false;hudFn=null;$('#hud').hidden=true;$('#topbtns').hidden=true;$('#prompt').hidden=true;$('#touch').hidden=true;buildTitle();$('#menu').hidden=false;showPanel('mMain');refreshCont();$('#fade').classList.remove('on');}
function togglePause(){const p=$('#pause');p.hidden=!p.hidden;if(!p.hidden&&!isTouch)$('#pResume').focus();}
function toggleMute(){muted=!muted;$('#bMusic').textContent='Audio: '+(muted?'no':'sì');if(MASTER)MASTER.gain.value=muted?0:.6;}
$('#bMusic').onclick=toggleMute;$('#bView').onclick=e=>{toggleFP();e.currentTarget.blur();};$('#bMenu').onclick=togglePause;
$('#pResume').onclick=togglePause;$('#pRestart').onclick=()=>{const c=curChapter;TOKEN++;resetRun();runFrom(c);};
$('#pTitle').onclick=toTitle;
function setQual(k){QK=k;DYN=1;try{localStorage.setItem('treno-qual2',k);}catch(e){}document.querySelectorAll('[data-q]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.q===k)));applyQuality();}
function openSettings(){$('#settings').hidden=false;$('#sFps').checked=fpsOn;$('#sGuide').checked=guideOn;setQual(QK);$('#sClose').focus();}
document.querySelectorAll('[data-q]').forEach(b=>b.onclick=()=>setQual(b.dataset.q));
$('#sFps').onchange=e=>{fpsOn=e.target.checked;$('#fps').hidden=!fpsOn;try{localStorage.setItem('treno-fps',fpsOn?'1':'0');}catch(x){}};
$('#sGuide').onchange=e=>{guideOn=e.target.checked;try{localStorage.setItem('treno-guide',guideOn?'1':'0');}catch(x){}};
$('#sClose').onclick=()=>{$('#settings').hidden=true;};$('#mSet').onclick=openSettings;$('#pSet').onclick=openSettings;
$('#mCont').onclick=()=>{const s=savedAt();if(s)startFrom(s);};
function showPanel(id){for(const p of ['mMain','mScenesP','mHelpP'])$('#'+p).hidden=p!==id;}
function setMode(m){
}
document.querySelectorAll('[data-back]').forEach(b=>b.onclick=()=>showPanel('mMain'));
$('#mStart').onclick=()=>{audioInit();const t=$('.tk');t.classList.remove('stamped');void t.offsetWidth;t.classList.add('stamped');noise(.14,260,.2,'lowpass');tone(90,.12,'sine',.12);setTimeout(()=>startFrom(SEQ[0]),800);};
{let i=0;const h=$('#menu h1');for(const node of [...h.childNodes])if(node.nodeType===3){const f=document.createDocumentFragment();for(const ch of node.textContent){const s=document.createElement('span');s.className='ch';s.style.setProperty('--i',i++);s.textContent=ch===' '?' ':ch;f.appendChild(s);}h.replaceChild(f,node);}}
journey($('#mmap'),JSTOPS,0,{loop:true,delay:1.2,dur:3.2});
if(DEMO){$('#mScenes').hidden=true;$('#menu h1').insertAdjacentHTML('afterend','<p class="credit" style="letter-spacing:.2em">VERSIONE DEMO · SOLO IL PRIMO CAPITOLO</p>');document.title+=' · Demo';}
$('#mScenes').onclick=()=>{audioInit();showPanel('mScenesP');};$('#mHelp').onclick=()=>showPanel('mHelpP');
$('#sceneList').innerHTML=SCENES.map(s=>'<button type="button" class="scene" data-scene="'+s.id+'"><span>'+s.t+'<small>'+s.y+'</small></span><span class="tags">'+s.tags.map(t=>'<i class="'+t+'">'+(t==='gioco'?'INVENTATA':t.toUpperCase())+'</i>').join('')+'</span></button>').join('');
document.querySelectorAll('[data-scene]').forEach(b=>b.onclick=()=>startFrom(b.dataset.scene));
setMode(MODE);refreshCont();requestAnimationFrame(loop);trailer();   // appena aperto: prima il trailer, poi la copertina
window.__dbg=()=>({act:actors.filter(a=>a.name||(a.chicken&&!a.caught)).map(a=>[a.name||'hen',+a.x.toFixed(1),+a.z.toFixed(1)]),n:interacts.length,locked,interacting,cine:cineMode,mini:miniOn,P:P&&[+P.x.toFixed(2),+P.z.toFixed(2)],it:interacts.map(i=>[i.label,+i.x.toFixed(1),+i.z.toFixed(1),i.active()]),cm:canMove(),D:D.open,hud:$('#objs').textContent});
