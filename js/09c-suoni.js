"use strict";
const SND_PATH='suoni/',SBED=[];
const SND_DEMO=['mare','mercato','fuoco','campana','fischio'];function sndEl(name,loop){if(!SND_DEMO.includes(name))return new Audio();const a=new Audio(SND_PATH+name+'.ogg');a.loop=!!loop;a.preload='auto';return a;}
function bedPlay(name,vol,pos,ref){const a=sndEl(name,true),b={el:a,vol,pos,ref:ref||6,cur:0,dead:false};a.volume=0;SBED.push(b);if(AC)a.play().catch(()=>{});AMBS.push(()=>{b.dead=true;});return b;}
function sndOnce(name,vol){if(muted||!AC)return;const a=sndEl(name,false);a.volume=Math.min(1,vol);a.play().catch(()=>{});}
setInterval(()=>{const lx=P?P.x:camera.position.x,lz=P?P.z:camera.position.z;
for(let i=SBED.length-1;i>=0;i--){const b=SBED[i];let tv=b.dead?0:b.vol;if(b.pos){const d=Math.hypot(b.pos[0]-lx,b.pos[1]-lz);tv*=Math.pow(Math.min(1,b.ref/Math.max(b.ref,d)),1.5);}
if(muted||!AC)tv=0;b.cur+=(tv-b.cur)*.22;b.el.volume=Math.max(0,Math.min(1,b.cur));
if(b.dead&&b.cur<.01){b.el.pause();b.el.removeAttribute('src');b.el.load();SBED.splice(i,1);}else if(!b.dead&&AC&&b.el.paused)b.el.play().catch(()=>{});}},100);
const _ambSynth=ambient;
ambient=function(kind){const map={mare:[['mare',.42],['mercato',.12]],vento:[['vento',.3]],treno:[['treno-dentro',.36]]}[kind];if(!map)return _ambSynth(kind);for(const [n,v] of map)bedPlay(n,v);};
const _loopSynth=loopAt;
loopAt=function(x,y,z,kind){if(kind==='fire'){bedPlay('fuoco',.55,[x,z],2.5);return;}return _loopSynth(x,y,z,kind);};
const _scape=soundscape;
soundscape=function(list){const rest=[];for(const s of list){if(s.k==='hen'&&s.at)bedPlay('galline',.38,[s.at[0],s.at[2]],7);
else if(s.k==='bell'){const t=setInterval(()=>{if(Math.random()<.3)sndOnce('campana',.22);},15000);AMBS.push(()=>clearInterval(t));}else rest.push(s);}return _scape(rest);};
steamWhistle=function(){if(!AC||muted)return;sndOnce('fischio',.5);};
for(const k in SONGS){const s=SONGS[k];if(s.wave==='square'||s.wave==='sawtooth')s.wave='triangle';s.vol*=.7;}
