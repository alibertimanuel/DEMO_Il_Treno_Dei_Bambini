"use strict";
const $=s=>document.querySelector(s);
if(!window.THREE){oops('Non riesco a scaricare la grafica 3D. Il gioco ha bisogno di internet: controlla la connessione e ricarica.','La libreria three.js non si è caricata.');throw new Error('three.js mancante');}
{const t=document.createElement('canvas');if(!(t.getContext('webgl2')||t.getContext('webgl'))){oops('Questo browser o questo computer non supporta la grafica 3D (WebGL). Prova con Chrome o Edge aggiornati, e controlla che l\'accelerazione hardware sia attiva nelle impostazioni del browser.','WebGL non disponibile.');throw new Error('WebGL non disponibile');}}
function mulberry(a){return function(){a|=0;a=a+0x6D2B79F5|0;let t=Math.imul(a^a>>>15,1|a);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296;};}
let R=mulberry(7);
const rr=(a,b)=>a+R()*(b-a);
const pick=a=>a[Math.floor(R()*a.length)];
const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
const TAU=Math.PI*2;
const now=()=>performance.now()/1000;
function shade(hex,amt){const c=parseInt(hex.slice(1),16);const f=v=>Math.max(0,Math.min(255,Math.round(amt<0?v*(1+amt):v+(255-v)*amt)));return '#'+((1<<24)|(f(c>>16)<<16)|(f(c>>8&255)<<8)|f(c&255)).toString(16).slice(1);}
const MODE='libro';   // si racconta sempre come nel libro: Amerigo bambino, in prima persona, al presente
let TOKEN=0;
const sleep=ms=>{const tk=TOKEN;return new Promise(r=>setTimeout(()=>{if(tk===TOKEN)r();},ms));};
let AC=null,MASTER=null,MUSG=null,muted=false,musicTimer=null,NOISE=null;
const AMBS=[];
const midi=n=>440*Math.pow(2,(n-69)/12);
function audioInit(){if(AC){if(AC.state==='suspended')AC.resume();return;}try{AC=new (window.AudioContext||window.webkitAudioContext)();MASTER=AC.createGain();MASTER.gain.value=.6;MASTER.connect(AC.destination);MUSG=AC.createGain();MUSG.gain.value=1;MUSG.connect(MASTER);
const dl=AC.createDelay(1),fb=AC.createGain(),lp=AC.createBiquadFilter(),wet=AC.createGain();dl.delayTime.value=.34;fb.gain.value=.34;lp.type='lowpass';lp.frequency.value=1600;wet.gain.value=.3;
MUSG.connect(dl);dl.connect(lp);lp.connect(fb);fb.connect(dl);lp.connect(wet);wet.connect(MASTER);}catch(e){AC=null;}}
function tone(f,dur,type,vol,when,dest){if(!AC||muted)return;const t=AC.currentTime+(when||0);const o=AC.createOscillator(),g=AC.createGain();o.type=type||'square';o.frequency.value=f;g.gain.setValueAtTime(.0001,t);g.gain.exponentialRampToValueAtTime(vol||.1,t+.01);g.gain.exponentialRampToValueAtTime(.0001,t+dur);o.connect(g);g.connect(dest||MASTER);o.start(t);o.stop(t+dur+.05);}
function noiseBuf(){if(NOISE)return NOISE;const b=AC.createBuffer(1,AC.sampleRate*2,AC.sampleRate);const d=b.getChannelData(0);for(let i=0;i<d.length;i++)d[i]=Math.random()*2-1;return NOISE=b;}
function noise(dur,freq,vol,type){if(!AC||muted)return;const t=AC.currentTime;const s=AC.createBufferSource();s.buffer=noiseBuf();const f=AC.createBiquadFilter();f.type=type||'lowpass';f.frequency.value=freq;const g=AC.createGain();g.gain.setValueAtTime(vol,t);g.gain.exponentialRampToValueAtTime(.0001,t+dur);s.connect(f);f.connect(g);g.connect(MASTER);s.start(t);s.stop(t+dur+.05);}
function violin(f,dur,vol){if(!AC||muted)return;dur=dur||.5;vol=vol||.16;const t=AC.currentTime;const o=AC.createOscillator();o.type='sawtooth';o.frequency.value=f;const l=AC.createOscillator();l.frequency.value=5.5;const lg=AC.createGain();lg.gain.value=f*.012;l.connect(lg);lg.connect(o.frequency);const fl=AC.createBiquadFilter();fl.type='lowpass';fl.frequency.value=2300;const g=AC.createGain();g.gain.setValueAtTime(.0001,t);g.gain.linearRampToValueAtTime(vol,t+.06);g.gain.setValueAtTime(vol,t+dur*.7);g.gain.exponentialRampToValueAtTime(.0001,t+dur+.25);o.connect(fl);fl.connect(g);g.connect(MASTER);o.start(t);l.start(t);o.stop(t+dur+.3);l.stop(t+dur+.3);}
const blip=()=>tone(520+Math.random()*80,.03,'square',.022);
function flashMini(k){if(!miniOn)return;const c=$('#mc');c.classList.remove('ok','ko');void c.offsetWidth;c.classList.add(k);}
const sfxGood=()=>{tone(660,.08,'triangle',.06);tone(990,.14,'triangle',.06,.08);flashMini('ok');};
const sfxBad=()=>{tone(220,.12,'triangle',.05);tone(165,.18,'triangle',.05,.1);flashMini('ko');};
const sfxPick=()=>{tone(880,.06,'triangle',.08);tone(1320,.1,'triangle',.08,.06);};
function boom(v){v=v||1;noise(1.4,320,.55*v);tone(58,.9,'sine',.35*v);}
function whistleFall(){if(!AC||muted)return;const t=AC.currentTime;const o=AC.createOscillator(),g=AC.createGain();o.type='sine';o.frequency.setValueAtTime(1500,t);o.frequency.exponentialRampToValueAtTime(380,t+1.3);g.gain.setValueAtTime(.0001,t);g.gain.exponentialRampToValueAtTime(.035,t+.1);g.gain.exponentialRampToValueAtTime(.0001,t+1.35);o.connect(g);g.connect(MASTER);o.start(t);o.stop(t+1.4);}
function steamWhistle(){tone(523,1.1,'sine',.07);tone(659,1.1,'sine',.06);tone(784,1.1,'sine',.04);}
function ambient(kind){if(!AC)return;try{const t=AC.currentTime;const s=AC.createBufferSource();s.buffer=noiseBuf();s.loop=true;const f=AC.createBiquadFilter();const g=AC.createGain();const l=AC.createOscillator();const lg=AC.createGain();const nodes=[s,l];
if(kind==='mare'){f.type='lowpass';f.frequency.value=520;g.gain.value=.05;l.frequency.value=.11;lg.gain.value=.04;}
else if(kind==='treno'){f.type='lowpass';f.frequency.value=220;g.gain.value=.06;l.frequency.value=1.6;lg.gain.value=.04;}
else if(kind==='vento'){f.type='bandpass';f.frequency.value=700;g.gain.value=.025;l.frequency.value=.07;lg.gain.value=.02;}
else if(kind==='sirena'){const o=AC.createOscillator();o.type='sawtooth';o.frequency.value=560;const so=AC.createOscillator();so.frequency.value=.2;const sg=AC.createGain();sg.gain.value=200;so.connect(sg);sg.connect(o.frequency);const sf=AC.createBiquadFilter();sf.type='lowpass';sf.frequency.value=1400;const og=AC.createGain();og.gain.value=muted?0:.035;o.connect(sf);sf.connect(og);og.connect(MASTER);o.start(t);so.start(t);AMBS.push(()=>{try{o.stop();so.stop();}catch(e){}});return;}
l.connect(lg);lg.connect(g.gain);s.connect(f);f.connect(g);g.connect(MASTER);s.start(t);l.start(t);AMBS.push(()=>{nodes.forEach(n=>{try{n.stop();}catch(e){}});});}catch(e){}}
function stopAmb(){while(AMBS.length)AMBS.pop()();}
let TERRAIN='stone',TZ=[];   // TZ: zone con un terreno diverso [x0,x1,z0,z1,tipo]
function terrainAt(x,z){for(const r of TZ)if(x>=r[0]&&x<=r[1]&&z>=r[2]&&z<=r[3])return r[4];return TERRAIN;}
function footstep(k){if(!AC||muted)return;const v=.9+Math.random()*.2;
if(k==='snow'){noise(.12,1500*v,.05,'bandpass');noise(.07,3800*v,.016,'highpass');}
else if(k==='wood'){tone(118*v,.08,'triangle',.05);noise(.05,700*v,.03,'lowpass');}
else if(k==='dirt'){noise(.08,900*v,.035,'lowpass');}
else{noise(.035,2600*v,.03,'highpass');tone(170*v,.03,'triangle',.022);}}   // pietra, mattonelle
function panAt(x,y,z,ref){const p=AC.createPanner();p.panningModel='HRTF';p.distanceModel='inverse';p.refDistance=ref||2;p.rolloffFactor=1.3;p.maxDistance=60;
if(p.positionX){p.positionX.value=x;p.positionY.value=y;p.positionZ.value=z;}else p.setPosition(x,y,z);p.connect(MASTER);return p;}
function sweep(p,f0,f1,dur,vol,when,type){if(!AC||muted)return;const t=AC.currentTime+(when||0),o=AC.createOscillator(),g=AC.createGain();o.type=type||'sine';o.frequency.setValueAtTime(f0,t);o.frequency.exponentialRampToValueAtTime(f1,t+dur);
g.gain.setValueAtTime(.0001,t);g.gain.exponentialRampToValueAtTime(vol,t+.015);g.gain.exponentialRampToValueAtTime(.0001,t+dur);o.connect(g);g.connect(p);o.start(t);o.stop(t+dur+.05);}
function popAt(p){if(!AC||muted)return;const t=AC.currentTime,s=AC.createBufferSource();s.buffer=noiseBuf();const f=AC.createBiquadFilter();f.type='highpass';f.frequency.value=1800+Math.random()*2200;const g=AC.createGain();g.gain.setValueAtTime(.02+Math.random()*.05,t);g.gain.exponentialRampToValueAtTime(.0001,t+.03);s.connect(f);f.connect(g);g.connect(p);s.start(t,Math.random());s.stop(t+.05);}
function loopAt(x,y,z,kind){if(!AC)return;try{const t=AC.currentTime,p=panAt(x,y,z,kind==='fire'?1.5:2.5),s=AC.createBufferSource();s.buffer=noiseBuf();s.loop=true;s.playbackRate.value=.7+Math.random()*.6;
const f=AC.createBiquadFilter(),g=AC.createGain(),l=AC.createOscillator(),lg=AC.createGain();
if(kind==='water'){f.type='bandpass';f.frequency.value=1400;f.Q.value=.6;g.gain.value=.06;l.frequency.value=3.1;lg.gain.value=.015;}
else if(kind==='fire'){f.type='lowpass';f.frequency.value=480;g.gain.value=.06;l.frequency.value=7;lg.gain.value=.03;}
else{f.type='bandpass';f.frequency.value=520;f.Q.value=1.2;g.gain.value=.05;l.frequency.value=.4;lg.gain.value=.03;}
l.connect(lg);lg.connect(g.gain);s.connect(f);f.connect(g);g.connect(p);s.start(t);l.start(t);AMBS.push(()=>{try{s.stop();l.stop();}catch(e){}p.disconnect();});
if(kind==='fire')hooks.push(dt=>{if(Math.random()<dt*6)popAt(p);});}catch(e){}}
const SND={gull:p=>{sweep(p,1400,900,.25,.03,0,'triangle');sweep(p,1500,950,.3,.03,.3,'triangle');},
bird:p=>{for(let i=0;i<3;i++)sweep(p,3200+Math.random()*900,4300,.07,.012,i*.11);},
crow:p=>{sweep(p,420,300,.22,.016,0,'sawtooth');sweep(p,410,290,.22,.016,.32,'sawtooth');},
hen:p=>{const f=650+Math.random()*250;tone(f,.05,'square',.012,0,p);tone(f*.8,.07,'square',.012,.09,p);if(Math.random()<.3)tone(f*1.2,.12,'square',.012,.2,p);},
bell:p=>{for(let i=0;i<3;i++)for(const [k,v] of [[1,.05],[2,.025],[2.76,.018],[5.4,.008]])tone(196*k,3.2/k+1,'sine',v,i*1.6,p);},
choir:p=>{pick([[60,64,67],[57,60,64],[55,59,62],[53,57,60]]).forEach(n=>tone(midi(n),2.2,'sine',.012,0,p));},
tick:p=>tone(2300,.015,'square',.008,0,p)};
function soundscape(list){if(!AC)return;const fixed=list.map(s=>s.at?panAt(s.at[0],s.at[1],s.at[2],s.ref||3):null);AMBS.push(()=>fixed.forEach(p=>p&&p.disconnect()));
hooks.push(dt=>{if(muted)return;list.forEach((s,i)=>{if(Math.random()<dt*s.r){let p=fixed[i];if(!p){const a=Math.random()*TAU,d=7+Math.random()*9,c=camera.position;p=panAt(c.x+Math.cos(a)*d,c.y+2+Math.random()*4,c.z+Math.sin(a)*d,3);}SND[s.k](p);}});});}
const _ld=new THREE.Vector3();
function updateListener(){if(!AC)return;const L=AC.listener,c=camera.position;camera.getWorldDirection(_ld);
if(L.positionX){L.positionX.value=c.x;L.positionY.value=c.y;L.positionZ.value=c.z;L.forwardX.value=_ld.x;L.forwardY.value=_ld.y;L.forwardZ.value=_ld.z;L.upX.value=0;L.upY.value=1;L.upZ.value=0;}
else{L.setPosition(c.x,c.y,c.z);L.setOrientation(_ld.x,_ld.y,_ld.z,0,1,0);}}
const SONGS={
napoli:{bpm:116,wave:'triangle',vol:.04,seq:[57,60,64,60,57,60,64,60,55,59,62,59,55,59,62,59,53,57,60,57,53,57,60,57,52,56,59,56,52,56,59,64],bass:[45,43,41,40]},
treno:{bpm:150,wave:'square',vol:.02,seq:[50,0,57,0,50,0,57,0,48,0,55,0,48,0,55,0,47,0,55,0,47,0,55,0,45,0,52,0,45,0,57,0],bass:[38,36,35,33]},
modena:{bpm:88,wave:'sine',vol:.05,seq:[72,0,76,0,79,0,76,0,74,0,77,0,81,0,77,0,72,0,76,0,79,0,84,0,83,0,79,0,74,0,0,0],bass:[48,53,48,55]},
notte:{bpm:70,wave:'triangle',vol:.04,seq:[57,0,0,0,60,0,0,0,59,0,0,0,55,0,0,0],bass:[45,0,43,0]},
ninna:{bpm:66,wave:'triangle',vol:.05,seq:[64,0,67,0,69,0,67,0,64,0,62,0,64,0,0,0,62,0,64,0,67,0,64,0,62,0,60,0,62,0,0,0],bass:[45,43,41,40]},
natale:{bpm:100,wave:'triangle',vol:.045,seq:[67,0,67,69,67,0,64,0,67,0,67,69,67,0,64,0,74,0,74,0,71,0,0,0,72,0,72,0,67,0,0,0],bass:[48,43,45,43]},
y1994:{bpm:80,wave:'sine',vol:.05,seq:[64,0,67,0,71,0,72,0,71,0,67,0,64,0,62,0,60,0,64,0,67,0,69,0,67,0,0,0,0,0,0,0],bass:[48,45,41,43]},
};
function music(name){stopMusic();const s=SONGS[name];if(!s||!AC)return;let step=0;const spb=60/s.bpm/2;musicTimer=setInterval(()=>{if(!muted){const n=s.seq[step%s.seq.length];if(n)tone(midi(n),spb*1.7,s.wave,s.vol,0,MUSG);if(s.bass&&step%8===0){const b=s.bass[Math.floor(step/8)%s.bass.length];if(b)tone(midi(b),spb*7,'triangle',s.vol*1.3,0,MUSG);}}step++;},spb*1000);}
function stopMusic(){if(musicTimer)clearInterval(musicTimer);musicTimer=null;}
let ringTimer=null;
const cvs=$('#gl');
let renderer;
try{renderer=new THREE.WebGLRenderer({canvas:cvs,antialias:false});}catch(e){oops('Questo browser non riesce ad avviare la grafica 3D (WebGL). Prova con Chrome o Edge aggiornati.',String(e&&e.message||e));throw e;}
cvs.addEventListener('webglcontextlost',()=>oops('La scheda grafica ha interrotto il gioco. Ricarica la pagina.','WebGL context lost.'));
const scene=new THREE.Scene();
const camera=new THREE.PerspectiveCamera(50,1,.1,400);
const AMB=new THREE.AmbientLight(0xffffff,.4);scene.add(AMB);
const HEMI=new THREE.HemisphereLight(0xbfe3ff,0xc99a5a,.5);scene.add(HEMI);
const SUN=new THREE.DirectionalLight(0xffffff,1);scene.add(SUN);scene.add(SUN.target);
const FILL=new THREE.DirectionalLight(0xbfd0ff,.2);scene.add(FILL);
let DYN=1;   // fattore della risoluzione dinamica (vedi fpsTick)
const QUAL={basso:{scale:.6,shadow:1024,soft:false,ao:false,bloom:false,aa:false},medio:{scale:.85,shadow:2048,soft:true,ao:true,bloom:true,aa:true},alto:{scale:1,shadow:2048,soft:true,ao:true,bloom:true,aa:true}};
let QK='alto';try{QK=localStorage.getItem('treno-qual2')||'alto';}catch(e){}if(QK!=='alto'&&QK!=='medio')QK='alto';
renderer.shadowMap.enabled=true;renderer.shadowMap.autoUpdate=false;
Object.assign(SUN.shadow.camera,{left:-26,right:26,top:26,bottom:-26,near:1,far:120});SUN.shadow.camera.updateProjectionMatrix();SUN.shadow.bias=-.0006;SUN.shadow.normalBias=.035;SUN.shadow.radius=3;
const SHADOW_ENV=new Set(['day','dusk','sunset','dawn','title','y1994','train','trainDusk','trainOut','nebbia','night','snowNight','war']);   // di notte fa ombra la luna
let shTick=0;
function shadowize(){world.traverse(o=>{if(!o.isMesh||o.userData.sh)return;o.userData.sh=1;const ms=Array.isArray(o.material)?o.material:[o.material];
{let p=o.parent;while(p&&p!==world){if(p.userData.actor){o.castShadow=false;o.receiveShadow=true;return;}p=p.parent;}}
if(!ms.every(m=>m&&(m.isMeshStandardMaterial||m.isMeshLambertMaterial)))return;o.receiveShadow=true;
const flat=o.geometry&&o.geometry.type==='PlaneGeometry'&&Math.abs(o.rotation.x+Math.PI/2)<.01;o.castShadow=!flat&&!ms.some(m=>m.transparent||m.alphaTest>0)&&!o.userData.noCast;
if(o.castShadow&&!o.isInstancedMesh&&o.geometry){if(!o.geometry.boundingSphere)o.geometry.computeBoundingSphere();o.castShadow=o.geometry.boundingSphere.radius*o.matrixWorld.getMaxScaleOnAxis()>.09;}});}
const _sr=new THREE.Vector3(),_su=new THREE.Vector3(),_sf=new THREE.Vector3(),_sp=new THREE.Vector3();
function placeSun(c){const tex=(SUN.shadow.camera.right-SUN.shadow.camera.left)/SUN.shadow.mapSize.x;_sf.copy(sunDir).negate();_su.set(0,1,0);_sr.crossVectors(_su,_sf).normalize();_su.crossVectors(_sf,_sr);
const x=Math.round(c.dot(_sr)/tex)*tex,y=Math.round(c.dot(_su)/tex)*tex,z=c.dot(_sf);_sp.copy(_sr).multiplyScalar(x).addScaledVector(_su,y).addScaledVector(_sf,z);
SUN.target.position.copy(_sp);SUN.position.copy(_sp).addScaledVector(sunDir,60);SUN.target.updateMatrixWorld();}
const POST=(()=>{const VS='varying vec2 vUv;void main(){vUv=uv;gl_Position=vec4(position.xy,0.,1.);}';
const sm=(fs,u)=>new THREE.ShaderMaterial({uniforms:u,vertexShader:VS,fragmentShader:fs,depthTest:false,depthWrite:false});
const bright=sm(`uniform sampler2D tDiffuse;uniform float uTh;varying vec2 vUv;void main(){vec3 c=texture2D(tDiffuse,vUv).rgb;float l=dot(c,vec3(.299,.587,.114));gl_FragColor=vec4(c*smoothstep(uTh,1.,l),1.);}`,{tDiffuse:{value:null},uTh:{value:.88}});
const blur=sm(`uniform sampler2D tDiffuse;uniform vec2 uDir;varying vec2 vUv;void main(){vec3 c=texture2D(tDiffuse,vUv).rgb*.227;c+=(texture2D(tDiffuse,vUv+uDir*1.385).rgb+texture2D(tDiffuse,vUv-uDir*1.385).rgb)*.316;c+=(texture2D(tDiffuse,vUv+uDir*3.231).rgb+texture2D(tDiffuse,vUv-uDir*3.231).rgb)*.07;gl_FragColor=vec4(c,1.);}`,{tDiffuse:{value:null},uDir:{value:new THREE.Vector2()}});
const fin=sm(`uniform sampler2D tDiffuse,tDepth,tBloom;uniform vec2 uRes;uniform float uTime,uNear,uFar,uAO,uBloom,uAA,uDof,uFocus,uSepia,uSat,uGrain,uVig,uLift;uniform vec3 uTint;varying vec2 vUv;
float lin(float d){float z=d*2.-1.;return 2.*uNear*uFar/(uFar+uNear-z*(uFar-uNear));}
float h(vec2 p){return fract(sin(dot(p,vec2(12.9898,78.233)))*43758.5453);}
vec3 tex(vec2 uv){return texture2D(tDiffuse,uv).rgb;}
vec3 aa(vec2 uv){vec2 px=1./uRes;vec3 c=tex(uv),n=tex(uv+vec2(0.,px.y)),s=tex(uv-vec2(0.,px.y)),e=tex(uv+vec2(px.x,0.)),w=tex(uv-vec2(px.x,0.));vec3 L=vec3(.299,.587,.114);
float ln=dot(n,L),ls=dot(s,L),le=dot(e,L),lw=dot(w,L),lc=dot(c,L);float mx=max(lc,max(max(ln,ls),max(le,lw))),mn=min(lc,min(min(ln,ls),min(le,lw)));
if(mx-mn<.06)return c;vec2 d=normalize(vec2(-(ln-ls),le-lw)+1e-5)*px;return (c*2.+tex(uv+d)+tex(uv-d)+tex(uv+d*.5)+tex(uv-d*.5))/6.;}
float ao(vec2 uv,float d){if(d>uFar*.5)return 1.;float occ=0.,r=clamp(1.2/d,.002,.045),j=h(uv*uRes)*6.283;
for(int i=0;i<10;i++){float a=float(i)*2.39996+j,k=(float(i)+.5)/10.;vec2 o=vec2(cos(a),sin(a))*r*sqrt(k);o.x*=uRes.y/uRes.x;
float df=d-lin(texture2D(tDepth,uv+o).r);occ+=smoothstep(.03,.35,df)*(1.-smoothstep(.6,2.2,df));}
return 1.-occ/10.*.7;}
void main(){vec2 uv=vUv;float d=lin(texture2D(tDepth,uv).r);vec3 c=uAA>0.?aa(uv):tex(uv);
if(uDof>0.){float coc=clamp(abs(d-uFocus)/max(uFocus,1.)*uDof,0.,1.);if(coc>.02){vec3 b=vec3(0.);float j=h(uv*uRes)*6.283;for(int i=0;i<12;i++){float a=float(i)*2.39996+j,k=sqrt((float(i)+.5)/12.);b+=tex(uv+vec2(cos(a),sin(a))*k*coc*vec2(9./uRes.x,9./uRes.y));}c=mix(c,b/12.,smoothstep(.0,.35,coc));}}
if(uAO>0.)c*=ao(uv,d);
c+=texture2D(tBloom,uv).rgb*uBloom*.4;
c=mix(c,c*c*(3.-2.*c),.22);
float l=dot(c,vec3(.299,.587,.114));c=mix(vec3(l),c,uSat);
vec3 sep=vec3(l*1.08+.035,l*.94+.022,l*.74+.01);c=mix(c,sep,uSepia)*uTint;
c=uLift*vec3(1.,.82,.62)+c*(1.-uLift);
vec2 q=(uv-.5)*vec2(uRes.x/uRes.y,1.);c*=mix(1.-uVig,1.,smoothstep(.98,.28,length(q)));
gl_FragColor=vec4(clamp(c,0.,1.),1.);}`,
{tDiffuse:{value:null},tDepth:{value:null},tBloom:{value:null},uRes:{value:new THREE.Vector2()},uTime:{value:0},uNear:{value:camera.near},uFar:{value:camera.far},uAO:{value:1},uBloom:{value:1},uAA:{value:1},
uDof:{value:0},uFocus:{value:8},uSepia:{value:.3},uSat:{value:.9},uGrain:{value:0},uVig:{value:.42},uLift:{value:.06},uTint:{value:new THREE.Color(1,1,1)}});
const qs=new THREE.Scene(),qc=new THREE.OrthographicCamera(-1,1,1,-1,0,1),quad=new THREE.Mesh(new THREE.PlaneGeometry(2,2),fin);quad.frustumCulled=false;qs.add(quad);
let main=null,ra=null,rb=null;
const pass=(m,src,dst)=>{quad.material=m;if(m.uniforms.tDiffuse)m.uniforms.tDiffuse.value=src;renderer.setRenderTarget(dst);renderer.render(qs,qc);};
return{fin,rts:()=>({main,ra,rb,bright,blur}),
size(w,h){[main,ra,rb].forEach(r=>r&&r.dispose());main=new THREE.WebGLRenderTarget(w,h,{minFilter:THREE.LinearFilter,magFilter:THREE.LinearFilter});main.depthTexture=new THREE.DepthTexture(w,h);main.depthTexture.type=THREE.UnsignedIntType;
const bw=Math.max(1,w>>2),bh=Math.max(1,h>>2);ra=new THREE.WebGLRenderTarget(bw,bh,{minFilter:THREE.LinearFilter,magFilter:THREE.LinearFilter});rb=ra.clone();fin.uniforms.uRes.value.set(w,h);blur.userData={bw,bh};},
render(t){const q=QUAL[QK];renderer.setRenderTarget(main);renderer.render(scene,camera);
if(q.bloom){pass(bright,main.texture,ra);const {bw,bh}=blur.userData;for(let i=0;i<2;i++){blur.uniforms.uDir.value.set((1+i)/bw,0);pass(blur,ra.texture,rb);blur.uniforms.uDir.value.set(0,(1+i)/bh);pass(blur,rb.texture,ra);}}
const u=fin.uniforms;u.tDepth.value=main.depthTexture;u.tBloom.value=ra.texture;u.uTime.value=t;u.uAO.value=q.ao?1:0;u.uBloom.value=q.bloom?1:0;u.uAA.value=q.aa?1:0;
pass(fin,main.texture,null);}};})();
function applyQuality(){const q=QUAL[QK];renderer.shadowMap.type=q.soft?THREE.PCFSoftShadowMap:THREE.PCFShadowMap;SUN.shadow.mapSize.set(q.shadow,q.shadow);if(SUN.shadow.map){SUN.shadow.map.dispose();SUN.shadow.map=null;}
scene.traverse(o=>{if(o.material){(Array.isArray(o.material)?o.material:[o.material]).forEach(m=>m.needsUpdate=true);}});resize();}
function resize(){const W=innerWidth,H=innerHeight,s=QUAL[QK].scale*DYN;renderer.setPixelRatio(1);const w=Math.max(2,Math.round(W*s)),h=Math.max(2,Math.round(H*s));renderer.setSize(w,h,false);POST.size(w,h);camera.aspect=W/H;camera.updateProjectionMatrix();}
addEventListener('resize',resize);applyQuality();
const SKY_VS=`varying vec3 vDir;void main(){vDir=position;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}`;
const SKY_FS=`uniform vec3 uTop,uHor,uLow,uSun,uSunCol;uniform float uTime,uCloud,uStars,uNight;varying vec3 vDir;
float h(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}
float n(vec2 p){vec2 i=floor(p),f=fract(p);f=f*f*(3.-2.*f);return mix(mix(h(i),h(i+vec2(1.,0.)),f.x),mix(h(i+vec2(0.,1.)),h(i+1.),f.x),f.y);}
float fbm(vec2 p){float v=0.,a=.5;for(int i=0;i<5;i++){v+=a*n(p);p=p*2.03+vec2(1.7,9.2);a*=.5;}return v;}
void main(){vec3 d=normalize(vDir);float y=d.y;
vec3 c=y>=0.?mix(uHor,uTop,pow(y,.55)):mix(uHor,uLow,min(1.,-y*4.));
float s=max(dot(d,normalize(uSun)),0.);
c+=uSunCol*(pow(s,8.)*.22+pow(s,90.)*.3)*(1.-uNight);
if(y>0.){vec2 uv=d.xz/(y+.15)*1.3+vec2(uTime*.012,uTime*.005);
float cl=smoothstep(1.-uCloud*.75,1.06-uCloud*.36,fbm(uv))*smoothstep(0.,.22,y);
vec3 cc=mix(uHor,vec3(1.),.5)*(1.-uNight*.72)+uSunCol*pow(s,3.)*.55*(1.-uNight);
cc*=.8+.3*fbm(uv*1.9+3.1);
if(uStars>0.){vec2 g=floor(d.xz/(y+.35)*110.);float st=step(.9965,h(g))*uStars*(1.-cl)*smoothstep(.05,.3,y);c+=vec3(st*(.55+.45*sin(uTime*2.5+h(g+7.)*40.)));}
c=mix(c,cc,cl*.92);}
gl_FragColor=linearToOutputTexel(vec4(c,1.));}`;
const SKY=(()=>{const g=new THREE.SphereGeometry(180,32,20);
const m=new THREE.ShaderMaterial({vertexShader:SKY_VS,fragmentShader:SKY_FS,side:THREE.BackSide,depthWrite:false,fog:false,
uniforms:{uTop:{value:new THREE.Color()},uHor:{value:new THREE.Color()},uLow:{value:new THREE.Color()},uSun:{value:new THREE.Vector3(.5,.4,.75)},uSunCol:{value:new THREE.Color()},uTime:{value:0},uCloud:{value:.4},uStars:{value:0},uNight:{value:0}}});
const me=new THREE.Mesh(g,m);me.renderOrder=-10;scene.add(me);return me;})();
function paintSky(top,hor,low){const u=SKY.material.uniforms;u.uTop.value.set(top);u.uHor.value.set(hor);u.uLow.value.set(low||hor);}
const glowTex=(()=>{const c=document.createElement('canvas');c.width=c.height=64;const g=c.getContext('2d');const gr=g.createRadialGradient(32,32,1,32,32,32);gr.addColorStop(0,'rgba(255,252,236,1)');gr.addColorStop(.16,'rgba(255,240,190,.95)');gr.addColorStop(.38,'rgba(255,205,130,.35)');gr.addColorStop(1,'rgba(255,180,100,0)');g.fillStyle=gr;g.fillRect(0,0,64,64);return new THREE.CanvasTexture(c);})();
const SUNSP=new THREE.Sprite(new THREE.SpriteMaterial({map:glowTex,transparent:true,depthWrite:false,fog:false,blending:THREE.AdditiveBlending}));SUNSP.scale.set(70,70,1);scene.add(SUNSP);
const sunDir=new THREE.Vector3(.5,.4,.75).normalize();
const ENV={
day:{top:'#6f93b4',hor:'#cfcac0',low:'#bdb6aa',fog:[45,230],fogCol:'#c6c0b4',amb:['#f2ebe0',.5],hemi:['#c8d4e0','#9a8a72',.62],sun:['#fbe8cc',.92],dir:[.5,.42,.75],glow:1,tint:'#ffffff'},   // dopo le bombe: cielo velato di polvere, luce morbida, ombre leggibili
dusk:{top:'#34508f',hor:'#ff9a5a',low:'#c06a40',fog:[30,170],amb:['#ffcfaa',.3],hemi:['#8fa0d8','#a05a3a',.5],sun:['#ff8a4a',1],dir:[.3,.14,.95],glow:1,tint:'#ffe0c8'},
sunset:{top:'#2a3c7a',hor:'#ffae6a',low:'#ff8a50',fog:[40,220],amb:['#ffc8a0',.32],hemi:['#9aa8e0','#a0603a',.5],sun:['#ffa860',1.15],dir:[.15,.09,1],glow:1,tint:'#ffe4cc'},
dawn:{top:'#5a78c0',hor:'#ffc8a8',low:'#d8a090',fog:[25,150],amb:['#ffd8c8',.36],hemi:['#a8b8e8','#906050',.5],sun:['#ffb890',.85],dir:[-.6,.15,.7],glow:1,tint:'#fde6dc'},
night:{top:'#060a1c',hor:'#1d2a55',low:'#10142a',fog:[8,42],amb:['#6a78b8',.36],hemi:['#5060a0','#201828',.32],sun:['#8fa0d8',.25],dir:[-.4,.6,.5],glow:0,tint:'#a2abdc'},
war:{top:'#120a14',hor:'#b8441e',low:'#3a1408',fog:[10,60],fogCol:'#4a1c12',amb:['#ff9a6a',.32],hemi:['#ff6a3a','#200a08',.42],sun:['#ff7040',.4],dir:[.2,.3,.9],glow:0,tint:'#ffbb99'},
y1994:{top:'#2f8fe0',hor:'#d8ecff',low:'#c8b8a0',fog:[45,230],amb:['#ffffff',.4],hemi:['#cfe8ff','#b0905a',.55],sun:['#fff0d0',1],dir:[.35,.75,.55],glow:1,tint:'#ffffff'},
nebbia:{top:'#aab4be',hor:'#d6d8d8',low:'#cfd0cc',fog:[14,70],fogCol:'#d2d4d2',amb:['#f0f0ec',.48],hemi:['#e6eaee','#a4a098',.55],sun:['#f8ecd8',.72],dir:[.55,.32,-.6],glow:1,tint:'#fff4e6'},   // nebbia del Nord con un sole basso e dorato
train:{top:'#8fa4b8',hor:'#dcd8cc',low:'#b8b0a0',fog:[30,150],fogCol:'#cdd0cc',amb:['#f4ecdc',.66],hemi:['#d8e0ec','#7a6a50',.6],sun:['#fff0d8',.75],dir:[.45,.62,-.3],glow:0,tint:'#ffffff'},
trainDusk:{top:'#2c3c78',hor:'#ffa060',low:'#d07848',fog:[30,160],fogCol:'#e0a07a',amb:['#ffcaa0',.52],hemi:['#a0a8d8','#7a4a30',.48],sun:['#ff9850',1.3],dir:[.95,.12,-.25],glow:1,tint:'#ffe4cc'},
trainNight:{top:'#060a1c',hor:'#18224a',low:'#0e1228',fog:[12,70],fogCol:'#141a34',amb:['#ffcf98',.42],hemi:['#4858a0','#2a1e14',.3],sun:['#8090c8',.15],dir:[-.4,.6,.5],glow:0,tint:'#f4e6d8'},
trainOut:{top:'#9cbad8',hor:'#eadfcc',low:'#d2c4a8',fog:[10,80],fogCol:'#e2d8c6',amb:['#fff0dc',.6],hemi:['#dce8f4','#7a6a4a',.5],sun:['#ffe4b8',.6],dir:[.5,.4,.6],glow:0,tint:'#fffaf2'},
basso:{top:'#0e0a08',hor:'#0e0a08',low:'#0e0a08',fog:[6,24],amb:['#c8b090',.32],hemi:['#ffe0b0','#201410',.25],sun:['#fff0c8',.9],dir:[.7,.6,-.3],glow:0,tint:'#f6e8d4'},
theater:{top:'#140c12',hor:'#140c12',low:'#140c12',fog:[9,30],amb:['#ffcf9a',.45],hemi:['#ffb070','#201010',.3],sun:['#ffd6a0',.5],dir:[.3,.8,.4],glow:0,tint:'#ffe6cc'},
shelter:{top:'#0c0808',hor:'#0c0808',low:'#0c0808',fog:[5,18],amb:['#ffb070',.28],hemi:['#ff9a50','#100808',.22],sun:['#ffb070',.1],dir:[.3,.8,.4],glow:0,tint:'#ffd0a0'},
snowNight:{top:'#0a1028',hor:'#3a3c6a',low:'#20203a',fog:[14,70],fogCol:'#2a2c4a',amb:['#8a90c8',.34],hemi:['#7080c0','#403040',.3],sun:['#a0b0e8',.3],dir:[.3,.7,.5],glow:0,tint:'#dcdcf2'},
kitchen:{top:'#1a1210',hor:'#1a1210',low:'#1a1210',fog:[7,22],amb:['#ffc890',.5],hemi:['#ffb070','#201010',.35],sun:['#ffd0a0',.2],dir:[.3,.8,.4],glow:0,tint:'#ffeedd'},
title:{top:'#3c5c9e',hor:'#ffb878',low:'#d08a50',fog:[25,120],amb:['#ffd8b0',.4],hemi:['#a8b8e8','#b07040',.5],sun:['#ffa860',1.1],dir:[.25,.14,-1],glow:1,tint:'#ffffff'},
};
let tint='#ffffff',curEnv='day';
const SKYFX={day:[.5,0,0],dusk:[.55,.15,.2],sunset:[.6,0,0],dawn:[.45,.1,.1],night:[.3,1,1],war:[.85,0,.7],y1994:[.35,0,0],nebbia:[.9,0,0],train:[.75,0,0],trainDusk:[.5,0,0],trainNight:[.3,1,1],trainOut:[.8,0,0],snowNight:[.35,.9,.85],title:[.55,0,0]};
const GRADE={day:[.16,.8,'#f8f4ee',.04],dusk:[.3,.9,'#ffeedd',.06],sunset:[.26,.95,'#fff0e0',.05],dawn:[.3,.88,'#fdeee6',.06],night:[.2,.8,'#e6ebff',.05],war:[.46,.74,'#ffe4d2',.07],
train:[.18,.74,'#f1f1ee',.07],trainDusk:[.2,.95,'#fff0e2',.05],trainNight:[.16,.88,'#fff0e0',.05],trainOut:[.16,.6,'#f3f2ee',.09],nebbia:[.08,.9,'#f8f8f6',.03],snowNight:[.1,1,'#f2efff',.04],kitchen:[.16,1.04,'#fff0de',.05],shelter:[.42,.78,'#ffe8d6',.07],title:[.3,.92,'#fff2e2',.05]};
const PMREM=new THREE.PMREMGenerator(renderer),envScene=new THREE.Scene();envScene.add(new THREE.Mesh(SKY.geometry,SKY.material));let envRT=null;
function updateEnvMap(){const old=envRT;envRT=PMREM.fromScene(envScene,.03,.1,400);scene.environment=envRT.texture;if(old)old.dispose();}
scene.fog=new THREE.Fog(0x000000,10,100);scene.background=new THREE.Color();
function envState(k){const e=ENV[k],g=GRADE[k]||[.3,.9,'#ffffff',.06],sf=SKYFX[k]||[0,0,1],C=x=>new THREE.Color(x);
return{top:C(e.top),hor:C(e.hor),low:C(e.low||e.hor),fog:C(e.fogCol||e.hor),f0:e.fog[0],f1:e.fog[1],amb:C(e.amb[0]),ai:e.amb[1]*.48,hs:C(e.hemi[0]),hg:C(e.hemi[1]),hi:e.hemi[2]*.72,sun:C(e.sun[0]),si:e.sun[1]*1.12,
dir:new THREE.Vector3(...e.dir).normalize(),cl:sf[0],st:sf[1],ni:sf[2],sep:g[0]*.65,sat:Math.min(1.12,g[1]+.12),tint:C(g[2]),lift:g[3]*.8};}   // seppia leggera: colori un po' più vivi
function mixState(a,b,k){const o={};for(const n in a){const x=a[n],y=b[n];o[n]=x.isColor?x.clone().lerp(y,k):x.isVector3?x.clone().lerp(y,k).normalize():x+(y-x)*k;}return o;}
function plight(c,i,d){return new THREE.PointLight(c,i*.55,d*1.25,2);}
let envNow=null,envTw=null;
function applyEnvState(s){envNow=s;const su=SKY.material.uniforms;su.uTop.value.copy(s.top);su.uHor.value.copy(s.hor);su.uLow.value.copy(s.low);su.uCloud.value=s.cl;su.uStars.value=s.st;su.uNight.value=s.ni;su.uSunCol.value.copy(s.sun);su.uSun.value.copy(s.dir);
scene.background.copy(s.fog);scene.fog.color.copy(s.fog);scene.fog.near=s.f0;scene.fog.far=s.f1;AMB.color.copy(s.amb);AMB.intensity=s.ai;HEMI.color.copy(s.hs);HEMI.groundColor.copy(s.hg);HEMI.intensity=s.hi;
SUN.color.copy(s.sun);SUN.intensity=s.si;sunDir.copy(s.dir);FILL.color.copy(s.hs);FILL.intensity=.12+s.hi*.22;FILL.position.set(-s.dir.x,.45,-s.dir.z);SUNSP.material.color.copy(s.sun);const u=POST.fin.uniforms;u.uSepia.value=s.sep;u.uSat.value=s.sat;u.uTint.value.copy(s.tint);u.uLift.value=s.lift;}
function setEnv(k,dur){const e=ENV[k];curEnv=k;SUN.castShadow=SHADOW_ENV.has(k);SUNSP.visible=!!e.glow;tint=e.tint;const target=envState(k);
if(dur&&envNow){envTw={a:envNow,b:target,t0:performance.now(),dur};}else{envTw=null;applyEnvState(target);updateEnvMap();}}
function stepEnv(){if(!envTw)return;const k=Math.min(1,(performance.now()-envTw.t0)/envTw.dur),e=k*k*(3-2*k);applyEnvState(mixState(envTw.a,envTw.b,e));if(k>=1){envTw=null;updateEnvMap();}}
const ANISO=Math.min(8,renderer.capabilities.getMaxAnisotropy());
function ctex(w,h,draw,rep){const c=document.createElement('canvas');c.width=w;c.height=h;const g=c.getContext('2d');draw(g,w,h);const t=new THREE.CanvasTexture(c);t.magFilter=THREE.LinearFilter;t.minFilter=THREE.LinearMipmapLinearFilter;t.generateMipmaps=true;t.anisotropy=ANISO;if(rep!==false){t.wrapS=t.wrapT=THREE.RepeatWrapping;}return t;}
const TEX={};const T=(k,f)=>TEX[k]||(TEX[k]=f());
function wrapDraw(w,h,x,y,r,fn){for(const ox of [0,-w,w])for(const oy of [0,-h,h]){const X=x+ox,Y=y+oy;if(X+r<0||X-r>w||Y+r<0||Y-r>h)continue;fn(X,Y);}}
function blot(g,w,h,rnd,n,rgb,r0,r1,a0){for(let i=0;i<n;i++){const x=rnd()*w,y=rnd()*h,r=r0+rnd()*(r1-r0),al=a0*(.4+rnd()*.6);wrapDraw(w,h,x,y,r,(X,Y)=>{const gr=g.createRadialGradient(X,Y,0,X,Y,r);gr.addColorStop(0,'rgba('+rgb+','+al+')');gr.addColorStop(1,'rgba('+rgb+',0)');g.fillStyle=gr;g.fillRect(X-r,Y-r,r*2,r*2);});}}
function grainPx(g,w,h,amt,rnd){const d=g.getImageData(0,0,w,h),a=d.data;for(let i=0;i<a.length;i+=4){const n=(rnd()-.5)*amt;a[i]+=n;a[i+1]+=n;a[i+2]+=n;}g.putImageData(d,0,0);}
function rrect(g,x,y,w,h,r){r=Math.min(r,w/2,h/2);g.beginPath();g.moveTo(x+r,y);g.lineTo(x+w-r,y);g.quadraticCurveTo(x+w,y,x+w,y+r);g.lineTo(x+w,y+h-r);g.quadraticCurveTo(x+w,y+h,x+w-r,y+h);g.lineTo(x+r,y+h);g.quadraticCurveTo(x,y+h,x,y+h-r);g.lineTo(x,y+r);g.quadraticCurveTo(x,y,x+r,y);g.closePath();}
const rgbOf=hex=>{const c=parseInt(hex.slice(1),16);return (c>>16)+','+(c>>8&255)+','+(c&255);};
const rpick=(rnd,a)=>a[Math.floor(rnd()*a.length)];
let HDN=0;
function hd(w,h,draw,bs,rep){const c=document.createElement('canvas');c.width=w;c.height=h;const b=document.createElement('canvas');b.width=w;b.height=h;const g=c.getContext('2d'),gb=b.getContext('2d');gb.fillStyle='#808080';gb.fillRect(0,0,w,h);
draw(g,gb,w,h,mulberry(9001+(++HDN)*7919));c.__bump=b;c.__bs=bs||.04;const t=new THREE.CanvasTexture(c);if(rep!==false)t.wrapS=t.wrapT=THREE.RepeatWrapping;t.anisotropy=ANISO;return t;}
function bumpFor(t){const c=t&&t.image;if(!c||!c.__bump)return null;if(!c.__bt){const b=c.__bt=new THREE.CanvasTexture(c.__bump);b.wrapS=b.wrapT=THREE.RepeatWrapping;b.anisotropy=ANISO;}return c.__bt;}
function courses(g,gb,w,h,rnd,o){g.fillStyle=o.mortar;g.fillRect(0,0,w,h);gb.fillStyle='#1c1c1c';gb.fillRect(0,0,w,h);const rh=h/o.rows,gp=o.gap;
for(let r=0;r<o.rows;r++){const start=o.stagger?(r%2)*o.wmax*.5:rnd()*o.wmax;let x=start;const y=r*rh;
while(x<start+w-1){let bw=o.wmin+rnd()*(o.wmax-o.wmin);if(start+w-(x+bw)<o.wmin*.6)bw=start+w-x;const col=rpick(rnd,o.cols),j=o.jit?rnd()*o.jit:0;
for(const ox of [0,-w]){const X=x+ox+gp/2,Y=y+gp/2+j,W=bw-gp,H=rh-gp-j*1.5;if(X+W<0||X>w)continue;
rrect(g,X,Y,W,H,o.rad);g.fillStyle=col;g.fill();const lg=g.createLinearGradient(X,Y,X+W*.3,Y+H);lg.addColorStop(0,'rgba(255,250,240,.16)');lg.addColorStop(.5,'rgba(255,255,255,0)');lg.addColorStop(1,'rgba(0,0,0,.2)');g.fillStyle=lg;g.fill();
g.save();rrect(g,X,Y,W,H,o.rad);g.clip();for(let k=0;k<o.spk;k++){g.fillStyle=rnd()<.5?'rgba(0,0,0,.18)':'rgba(255,255,255,.12)';g.fillRect(X+rnd()*W,Y+rnd()*H,1+rnd()*2.5,1+rnd()*2.5);}
if(o.wear){const cx=X+W*(.3+rnd()*.4),cy=Y+H*(.3+rnd()*.4),rg=g.createRadialGradient(cx,cy,0,cx,cy,W*.5);rg.addColorStop(0,'rgba(255,255,255,'+o.wear+')');rg.addColorStop(1,'rgba(255,255,255,0)');g.fillStyle=rg;g.fillRect(X,Y,W,H);}g.restore();
rrect(gb,X,Y,W,H,o.rad);const bg=gb.createRadialGradient(X+W/2,Y+H/2,Math.min(W,H)*.15,X+W/2,Y+H/2,Math.max(W,H)*.62);bg.addColorStop(0,'#f0f0f0');bg.addColorStop(1,'#8a8a8a');gb.fillStyle=bg;gb.fill();}
x+=bw;}}}
const texBasoli=()=>T('basoli',()=>hd(512,512,(g,gb,w,h,rnd)=>{courses(g,gb,w,h,rnd,{rows:6,wmin:95,wmax:175,gap:7,rad:12,mortar:'#26242a',cols:['#5a5760','#524f58','#615d66','#4b4851','#57535c','#5e5964'],spk:120,wear:.07,jit:3});
blot(g,w,h,rnd,14,'40,34,30',20,70,.18);blot(g,w,h,rnd,8,'255,240,220',20,50,.06);grainPx(g,w,h,14,rnd);},.09));
const texSlabs=()=>T('slabs',()=>hd(512,512,(g,gb,w,h,rnd)=>{courses(g,gb,w,h,rnd,{rows:4,wmin:190,wmax:290,gap:4,rad:5,mortar:'#9c907c',cols:['#d8ccb4','#cfc3ab','#e0d4bc','#c8bca4','#d4c6aa'],spk:160,wear:.08});
blot(g,w,h,rnd,16,'120,100,80',20,80,.12);grainPx(g,w,h,10,rnd);},.05));
const texConcrete=()=>T('conc',()=>hd(256,256,(g,gb,w,h,rnd)=>{g.fillStyle='#b4ada2';g.fillRect(0,0,w,h);blot(g,w,h,rnd,30,'90,84,76',10,50,.12);blot(g,w,h,rnd,20,'230,226,218',8,40,.12);
for(let i=0;i<3;i++){let x=rnd()*w,y=rnd()*h;g.strokeStyle='rgba(60,54,48,.5)';gb.strokeStyle='#303030';g.lineWidth=gb.lineWidth=1.2;g.beginPath();gb.beginPath();g.moveTo(x,y);gb.moveTo(x,y);for(let k=0;k<14;k++){x+=rnd()*14-7;y+=rnd()*12;g.lineTo(x,y);gb.lineTo(x,y);}g.stroke();gb.stroke();}
g.fillStyle='rgba(80,74,66,.6)';g.fillRect(0,h-2,w,2);g.fillRect(w-2,0,2,h);gb.fillStyle='#303030';gb.fillRect(0,h-2,w,2);gb.fillRect(w-2,0,2,h);blot(gb,w,h,rnd,60,'255,255,255',2,8,.3);grainPx(g,w,h,16,rnd);},.03));
function planks(g,gb,w,h,rnd,n,base,vertical){const ph=(vertical?w:h)/n;for(let i=0;i<n;i++){const c=shade(base,(rnd()-.5)*.25);g.save();if(vertical){g.translate(i*ph,0);}else g.translate(0,i*ph);
const L=vertical?h:w;g.fillStyle=c;vertical?g.fillRect(0,0,ph,L):g.fillRect(0,0,L,ph);
for(let k=0;k<26;k++){const off=rnd()*ph,amp=1+rnd()*3,fr=.01+rnd()*.03,p=rnd()*6;g.strokeStyle=rnd()<.5?'rgba(40,24,12,'+(.1+rnd()*.18)+')':'rgba(255,220,170,'+(.05+rnd()*.08)+')';g.lineWidth=.6+rnd()*1.4;g.beginPath();
for(let s=0;s<=L;s+=8){const q=off+Math.sin(s*fr+p)*amp;vertical?(s?g.lineTo(q,s):g.moveTo(q,s)):(s?g.lineTo(s,q):g.moveTo(s,q));}g.stroke();}
if(rnd()<.6){const kx=rnd()*L,ky=ph*(.3+rnd()*.4);g.fillStyle='rgba(60,34,16,.55)';g.beginPath();vertical?g.ellipse(ky,kx,ph*.08,ph*.16,0,0,TAU):g.ellipse(kx,ky,ph*.16,ph*.08,0,0,TAU);g.fill();}
g.fillStyle='rgba(20,10,4,.75)';vertical?g.fillRect(ph-2,0,2,L):g.fillRect(0,ph-2,L,2);g.fillStyle='rgba(255,230,190,.12)';vertical?g.fillRect(0,0,1.5,L):g.fillRect(0,0,L,1.5);
for(const e of [12,L-12]){g.fillStyle='#2a2420';const a=ph*.25,b=ph*.75;vertical?(g.fillRect(a,e,3,3),g.fillRect(b,e,3,3)):(g.fillRect(e,a,3,3),g.fillRect(e,b,3,3));}
g.restore();gb.fillStyle='#c8c8c8';vertical?gb.fillRect(i*ph,0,ph-2,h):gb.fillRect(0,i*ph,w,ph-2);gb.fillStyle='#202020';vertical?gb.fillRect(i*ph+ph-2,0,2,h):gb.fillRect(0,i*ph+ph-2,w,2);}}
const texWood=()=>T('wood',()=>hd(512,512,(g,gb,w,h,rnd)=>{planks(g,gb,w,h,rnd,8,'#7a5634',false);blot(g,w,h,rnd,10,'30,18,8',30,90,.12);grainPx(g,w,h,12,rnd);},.05));
const texBrick=()=>T('brick',()=>hd(512,256,(g,gb,w,h,rnd)=>{courses(g,gb,w,h,rnd,{rows:4,wmin:128,wmax:128,gap:8,rad:4,mortar:'#bdb19c',cols:['#a4503a','#9a4834','#b05a40','#8e4230','#a85840'],spk:140,stagger:1});blot(g,w,h,rnd,10,'40,20,10',20,60,.12);grainPx(g,w,h,14,rnd);},.08));
const texRoof=()=>T('roof',()=>hd(256,256,(g,gb,w,h,rnd)=>{g.fillStyle='#5a2a1a';g.fillRect(0,0,w,h);gb.fillStyle='#202020';gb.fillRect(0,0,w,h);const cw=w/4,rh=h/4;
for(let r=-1;r<4;r++)for(let c=0;c<4;c++){const x=c*cw+(r%2?cw*.5:0),y=r*rh,col=rpick(rnd,['#b05a38','#a4502e','#bc6440','#9a4a2c','#c06a42']);
for(const ox of [0,-w]){const X=x+ox+2,W=cw-4,H=rh*1.25;const lg=g.createLinearGradient(X,0,X+W,0);lg.addColorStop(0,shade(col,-.45));lg.addColorStop(.45,shade(col,.18));lg.addColorStop(1,shade(col,-.5));rrect(g,X,y,W,H,W*.45);g.fillStyle=lg;g.fill();
const bg=gb.createLinearGradient(X,0,X+W,0);bg.addColorStop(0,'#404040');bg.addColorStop(.5,'#f0f0f0');bg.addColorStop(1,'#404040');rrect(gb,X,y,W,H,W*.45);gb.fillStyle=bg;gb.fill();
g.fillStyle='rgba(0,0,0,.25)';g.fillRect(X,y+H-4,W,4);}}
blot(g,w,h,rnd,12,'60,70,40',10,40,.15);grainPx(g,w,h,14,rnd);},.1));
const texSnow=()=>T('snow',()=>hd(512,512,(g,gb,w,h,rnd)=>{g.fillStyle='#c6ced8';g.fillRect(0,0,w,h);blot(g,w,h,rnd,40,'170,185,205',20,90,.16);blot(g,w,h,rnd,40,'225,230,238',15,70,.3);
blot(gb,w,h,rnd,50,'255,255,255',20,90,.3);blot(gb,w,h,rnd,40,'0,0,0',15,70,.2);for(let i=0;i<500;i++){g.fillStyle='rgba(255,255,255,'+(.5+rnd()*.5)+')';g.fillRect(rnd()*w,rnd()*h,1,1);}
for(let i=0;i<40;i++){g.fillStyle='rgba(120,130,110,.35)';g.fillRect(rnd()*w,rnd()*h,1+rnd()*2,1+rnd()*2);}grainPx(g,w,h,6,rnd);},.05));
const texDirt=()=>T('dirt',()=>hd(256,256,(g,gb,w,h,rnd)=>{g.fillStyle='#958a78';g.fillRect(0,0,w,h);blot(g,w,h,rnd,30,'110,96,76',10,40,.25);blot(g,w,h,rnd,24,'190,178,158',8,30,.2);blot(gb,w,h,rnd,40,'0,0,0',6,30,.25);
for(let i=0;i<90;i++){const x=rnd()*w,y=rnd()*h,r=1+rnd()*3.5,c=rpick(rnd,['#7a6e5c','#b0a490','#6a6050','#c4bcae']);wrapDraw(w,h,x,y,r,(X,Y)=>{g.fillStyle=c;g.beginPath();g.ellipse(X,Y,r,r*.7,rnd()*3,0,TAU);g.fill();g.fillStyle='rgba(255,255,255,.25)';g.fillRect(X-r*.4,Y-r*.5,r*.6,r*.3);gb.fillStyle='#e8e8e8';gb.beginPath();gb.ellipse(X,Y,r,r*.7,0,0,TAU);gb.fill();});}
for(let i=0;i<160;i++){g.fillStyle='rgba(225,228,232,.7)';g.fillRect(rnd()*w,rnd()*h,1,1);}grainPx(g,w,h,16,rnd);},.07));
const texInside=()=>T('inside',()=>hd(256,256,(g,gb,w,h,rnd)=>{g.fillStyle='#4a5a46';g.fillRect(0,0,w,h/2);for(let i=0;i<80;i++){g.fillStyle='rgba('+(rnd()<.5?'0,0,0':'255,255,255')+','+(.03+rnd()*.04)+')';g.fillRect(0,rnd()*h/2,w,1+rnd()*3);}blot(g,w,h/2,rnd,10,'30,40,28',10,40,.15);
g.save();gb.save();g.translate(0,h/2);gb.translate(0,h/2);planks(g,gb,w,h/2,rnd,8,'#6a4a2e',true);g.restore();gb.restore();
g.fillStyle='#2e3a2c';g.fillRect(0,h/2-6,w,6);g.fillStyle='rgba(255,255,255,.12)';g.fillRect(0,h/2-6,w,1.5);gb.fillStyle='#f0f0f0';gb.fillRect(0,h/2-6,w,6);grainPx(g,w,h,10,rnd);},.04));
function texFacade(base,night){return T('f'+base+(night?'n':''),()=>hd(256,304,(g,gb,w,h,rnd)=>{
g.fillStyle=base;g.fillRect(0,0,w,h);blot(g,w,h,rnd,26,rgbOf(shade(base,-.25)),12,60,.22);blot(g,w,h,rnd,16,rgbOf(shade(base,.3)),10,40,.2);
const dg=g.createLinearGradient(0,h*.8,0,h);dg.addColorStop(0,'rgba(60,40,30,0)');dg.addColorStop(1,'rgba(60,40,30,.22)');g.fillStyle=dg;g.fillRect(0,0,w,h);blot(gb,w,h,rnd,80,'0,0,0',3,14,.25);
const sx=w/32,sy=h/32;const R=(x,y,ww,hh,c,b)=>{g.fillStyle=c;g.fillRect(x*sx,y*sy,ww*sx,hh*sy);if(b){gb.fillStyle=b;gb.fillRect(x*sx,y*sy,ww*sx,hh*sy);}};
const sur=shade(base,.32);R(8.6,4.4,14.8,20.2,sur,'#d8d8d8');g.fillStyle='rgba(0,0,0,.2)';g.fillRect(8.6*sx,24.2*sy,14.8*sx,.6*sy);
const glass=g.createLinearGradient(0,7*sy,0,22*sy);glass.addColorStop(0,night?'#3a3450':'#2a2e38');glass.addColorStop(.5,night?'#262236':'#181a22');glass.addColorStop(1,night?'#1e1a2a':'#121218');g.fillStyle=glass;g.fillRect(11*sx,7*sy,10*sx,15*sy);
if(!night){g.fillStyle='rgba(200,220,255,.16)';g.beginPath();g.moveTo(11*sx,7*sy);g.lineTo(15*sx,7*sy);g.lineTo(11*sx,13*sy);g.fill();}
gb.fillStyle='#303030';gb.fillRect(11*sx,7*sy,10*sx,15*sy);R(15.5,7,1,15,'#3a3228','#a0a0a0');R(11,14.2,10,.6,'#3a3228','#a0a0a0');
if(!night&&rnd()<.5){g.fillStyle='rgba(240,236,226,.85)';g.beginPath();g.moveTo(11*sx,7*sy);g.quadraticCurveTo(13*sx,14*sy,11.5*sx,21*sy);g.lineTo(11*sx,21*sy);g.fill();}
const shc=rpick(rnd,['#3f6e55','#4a6e8a','#6a4a36','#3f6e55','#5a7a4a']);
for(const x0 of [5.6,21.4]){R(x0,7,5,15,shade(shc,-.1),'#c0c0c0');for(let y=7.4;y<21.8;y+=1.1){g.fillStyle=shade(shc,.12);g.fillRect(x0*sx+2,y*sy,5*sx-4,.55*sy);g.fillStyle=shade(shc,-.35);g.fillRect(x0*sx+2,(y+.55)*sy,5*sx-4,.3*sy);gb.fillStyle='#f0f0f0';gb.fillRect(x0*sx,y*sy,5*sx,.55*sy);gb.fillStyle='#505050';gb.fillRect(x0*sx,(y+.55)*sy,5*sx,.3*sy);}
g.strokeStyle=shade(shc,-.45);g.lineWidth=2;g.strokeRect(x0*sx+1,7*sy+1,5*sx-2,15*sy-2);}
R(7,28.4,18,2.2,shade(base,-.2),'#e0e0e0');g.fillStyle='rgba(255,255,255,.18)';g.fillRect(7*sx,28.4*sy,18*sx,.4*sy);g.fillStyle='rgba(0,0,0,.3)';g.fillRect(7*sx,30.6*sy,18*sx,.8*sy);
g.fillStyle='#211d22';gb.fillStyle='#e8e8e8';g.fillRect(8*sx,23.6*sy,16*sx,.6*sy);g.fillRect(8*sx,27.6*sy,16*sx,.5*sy);gb.fillRect(8*sx,23.6*sy,16*sx,.6*sy);
for(let x=8;x<=24;x+=1.33){g.fillRect(x*sx,23.6*sy,.35*sx,4.6*sy);gb.fillRect(x*sx,23.6*sy,.35*sx,4.6*sy);}
for(let x=9;x<23;x+=2.66){g.strokeStyle='#211d22';g.lineWidth=1.5;g.beginPath();g.arc((x+.66)*sx,25.8*sy,.6*sx,0,TAU);g.stroke();}
if(!night&&rnd()<.6)for(const px of [10,19.5]){R(px,26.4,2.6,1.4,'#b0603a','#d0d0d0');for(let k=0;k<6;k++){g.fillStyle=rpick(rnd,['#d83a48','#e8506a','#c82a3a']);g.beginPath();g.arc((px+.3+rnd()*2)*sx,(25.2+rnd()*1.2)*sy,1.6+rnd()*1.6,0,TAU);g.fill();}g.fillStyle='#4a8a3a';for(let k=0;k<6;k++)g.fillRect((px+rnd()*2.4)*sx,(25.6+rnd())*sy,4,3);}
blot(g,w,h,rnd,6,'50,40,30',10,30,.1);grainPx(g,w,h,12,rnd);},.05));}
const texCotto=()=>T('cotto',()=>hd(512,512,(g,gb,w,h,rnd)=>{courses(g,gb,w,h,rnd,{rows:4,wmin:128,wmax:128,gap:5,rad:3,mortar:'#8a7a68',cols:['#b8643e','#ac5a36','#c26e46','#a8583a','#b46a44'],spk:200,stagger:0,wear:.1});blot(g,w,h,rnd,12,'60,30,20',20,60,.12);grainPx(g,w,h,12,rnd);},.05));
const texMajolica=()=>T('majol',()=>hd(512,512,(g,gb,w,h,rnd)=>{const n=4,s=w/n;g.fillStyle='#efe6d2';g.fillRect(0,0,w,h);gb.fillStyle='#e0e0e0';gb.fillRect(0,0,w,h);
for(let i=0;i<n;i++)for(let j=0;j<n;j++){g.save();g.translate(i*s+s/2,j*s+s/2);
g.fillStyle='#e9dfc8';g.fillRect(-s/2,-s/2,s,s);
for(let q=0;q<4;q++){g.save();g.rotate(q*Math.PI/2);g.fillStyle='#2f5f9a';g.beginPath();g.moveTo(0,0);g.quadraticCurveTo(s*.22,-s*.08,s*.3,-s*.3);g.quadraticCurveTo(s*.08,-s*.22,0,0);g.fill();
g.fillStyle='#e0b23a';g.beginPath();g.arc(s*.5,s*.5,s*.17,0,TAU);g.fill();g.fillStyle='#3f7a4a';g.beginPath();g.ellipse(s*.2,s*.2,s*.05,s*.11,-Math.PI/4,0,TAU);g.fill();g.restore();}
g.fillStyle='#e0b23a';g.beginPath();g.arc(0,0,s*.07,0,TAU);g.fill();g.strokeStyle='#2f5f9a';g.lineWidth=2;g.strokeRect(-s/2+3,-s/2+3,s-6,s-6);g.restore();
gb.fillStyle='#606060';gb.fillRect(i*s,j*s,s,3);gb.fillRect(i*s,j*s,3,s);g.fillStyle='rgba(120,110,95,.8)';g.fillRect(i*s,j*s,s,2.5);g.fillRect(i*s,j*s,2.5,s);}
blot(g,w,h,rnd,10,'255,255,255',20,60,.12);blot(g,w,h,rnd,8,'90,70,50',20,50,.08);grainPx(g,w,h,8,rnd);},.03));
const texGrassGround=()=>T('gground',()=>hd(512,512,(g,gb,w,h,rnd)=>{g.fillStyle='#7f8c52';g.fillRect(0,0,w,h);blot(g,w,h,rnd,40,'90,110,50',20,90,.25);blot(g,w,h,rnd,30,'170,160,100',20,70,.22);
for(let i=0;i<5000;i++){const x=rnd()*w,y=rnd()*h,l=3+rnd()*7;g.strokeStyle=rpick(rnd,['rgba(70,96,40,.6)','rgba(140,150,80,.5)','rgba(110,128,60,.6)','rgba(180,170,110,.4)']);g.lineWidth=1;g.beginPath();g.moveTo(x,y);g.lineTo(x+rnd()*3-1.5,y-l);g.stroke();}
blot(gb,w,h,rnd,80,'255,255,255',4,16,.3);grainPx(g,w,h,12,rnd);},.05));
const texWater=()=>T('water',()=>hd(256,256,(g,gb,w,h,rnd)=>{g.fillStyle='#ffffff';g.fillRect(0,0,w,h);for(let i=0;i<140;i++){const x=rnd()*w,y=rnd()*h,l=10+rnd()*40;wrapDraw(w,h,x,y,l,(X,Y)=>{gb.strokeStyle='rgba(255,255,255,.5)';gb.lineWidth=2;gb.beginPath();gb.moveTo(X-l/2,Y);gb.quadraticCurveTo(X,Y-3,X+l/2,Y);gb.stroke();gb.strokeStyle='rgba(0,0,0,.4)';gb.beginPath();gb.moveTo(X-l/2,Y+2);gb.quadraticCurveTo(X,Y-1,X+l/2,Y+2);gb.stroke();});}},.06));
const WIND={value:0};
const TUFT=(()=>{const pos=[],col=[],c0=new THREE.Color(),c1=new THREE.Color();for(let i=0;i<12;i++){const a=i/12*TAU+Math.random()*.5,r=.02+Math.random()*.09,lean=.1+Math.random()*.25,h=.45+Math.random()*.55,wd=.045;
const bx=Math.cos(a)*r,bz=Math.sin(a)*r,px=-Math.sin(a)*wd,pz=Math.cos(a)*wd,tx=bx+Math.cos(a)*lean,tz=bz+Math.sin(a)*lean;
pos.push(bx-px,0,bz-pz, bx+px,0,bz+pz, tx,h,tz);for(const k of [0,0,1]){c0.set('#3e5a26');c1.set('#a8b45a');const c=c0.clone().lerp(c1,k);col.push(c.r,c.g,c.b);}}
const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(pos,3));g.setAttribute('color',new THREE.Float32BufferAttribute(col,3));g.computeVertexNormals();return g;})();
const GRASSMAT=(()=>{const m=new THREE.MeshStandardMaterial({vertexColors:true,side:THREE.DoubleSide,roughness:.9,envMapIntensity:.3});
m.onBeforeCompile=s=>{s.uniforms.uWind=WIND;s.vertexShader='uniform float uWind;\n'+s.vertexShader.replace('#include <begin_vertex>',
'#include <begin_vertex>\n#ifdef USE_INSTANCING\nvec2 ip=instanceMatrix[3].xz;\n#else\nvec2 ip=vec2(0.);\n#endif\nfloat hh=position.y*position.y;float wv=sin(uWind*1.6+ip.x*.45+ip.y*.3)*.6+sin(uWind*3.1+ip.x*1.3)*.25;transformed.x+=wv*hh*.22;transformed.z+=wv*hh*.12;');
s.vertexShader=s.vertexShader.replace('#include <beginnormal_vertex>','#include <beginnormal_vertex>\nobjectNormal=normalize(objectNormal+vec3(0.,1.5,0.));');};return m;})();
function grass(rects,n,o){o=o||{};const im=new THREE.InstancedMesh(TUFT,GRASSMAT,n);const m4=new THREE.Matrix4(),q=new THREE.Quaternion(),e=new THREE.Euler(),v=new THREE.Vector3(),s=new THREE.Vector3(),c=new THREE.Color();
const area=rects.map(r=>(r[2]-r[0])*(r[3]-r[1])),tot=area.reduce((a,b)=>a+b,0);
for(let i=0;i<n;i++){let k=Math.random()*tot,j=0;while(k>area[j]&&j<area.length-1){k-=area[j];j++;}const r=rects[j];v.set(r[0]+Math.random()*(r[2]-r[0]),o.y||0,r[1]+Math.random()*(r[3]-r[1]));
e.set(0,Math.random()*TAU,0);q.setFromEuler(e);const sc=(o.h||.35)*(.6+Math.random()*.8);s.set(sc,sc*(.8+Math.random()*.5),sc);m4.compose(v,q,s);im.setMatrixAt(i,m4);
c.setHSL((o.hue||.22)+Math.random()*.06,.3,.78+Math.random()*.2);im.setColorAt(i,c);}
im.userData.noCast=true;im.frustumCulled=false;world.add(im);return im;}
function speck(g,w,h,cols,n){for(let i=0;i<n;i++){g.fillStyle=pick(cols);g.fillRect(Math.floor(R()*w),Math.floor(R()*h),1,1);}}
function outline(g,w,h){const d=g.getImageData(0,0,w,h),a=d.data,o=new Uint8ClampedArray(a);for(let y=0;y<h;y++)for(let x=0;x<w;x++){const i=(y*w+x)*4;if(a[i+3]!==0)continue;const n=(xx,yy)=>xx>=0&&yy>=0&&xx<w&&yy<h&&a[(yy*w+xx)*4+3]>0;if(n(x-1,y)||n(x+1,y)||n(x,y-1)||n(x,y+1)){o[i]=22;o[i+1]=15;o[i+2]=26;o[i+3]=255;}}g.putImageData(new ImageData(o,w,h),0,0);}
function texSign(text,bg,fg,w){return T('s'+text,()=>ctex(w||96,16,(g,W)=>{g.fillStyle=bg;g.fillRect(0,0,W,16);g.fillStyle=shade(bg,-.3);g.fillRect(0,14,W,2);g.fillStyle=fg;g.font='bold 10px monospace';g.textAlign='center';g.textBaseline='middle';g.fillText(text,W/2,8);},false));}
const texDoor=()=>T('door',()=>ctex(16,24,g=>{g.fillStyle='#5a3a24';g.fillRect(0,0,16,24);g.fillStyle='#120c10';g.fillRect(2,2,12,22);g.fillStyle='#e6dccb';for(let x=2;x<14;x+=2){g.fillRect(x,2,1,12);}g.fillStyle='#b84a3a';g.fillRect(2,2,12,2);g.fillStyle='#6a4a30';g.fillRect(9,16,3,2);g.fillRect(9,18,1,6);g.fillRect(11,18,1,6);},false));
const texDoorPCI=()=>T('doorp',()=>ctex(16,24,g=>{g.fillStyle='#3a2a20';g.fillRect(0,0,16,24);g.fillStyle='#6b4a2e';g.fillRect(2,2,5,22);g.fillRect(9,2,5,22);g.fillStyle='#4a3220';g.fillRect(3,4,3,8);g.fillRect(10,4,3,8);g.fillRect(3,14,3,8);g.fillRect(10,14,3,8);g.fillStyle='#d6b04a';g.fillRect(7,13,2,1);},false));
const texEdicola=()=>T('edic',()=>ctex(16,24,g=>{g.fillStyle='#f0ece2';g.fillRect(0,0,16,24);g.fillStyle='#3a5a9a';g.fillRect(3,4,10,13);g.fillRect(4,3,8,1);g.fillStyle='#f0e0c0';g.fillRect(7,6,2,2);g.fillStyle='#e8e8f4';g.fillRect(6,8,4,7);g.fillStyle='#ffd23a';g.fillRect(6,5,4,1);g.fillStyle='#b8a890';g.fillRect(2,17,12,2);g.fillStyle='#d23a30';g.fillRect(4,19,1,3);g.fillRect(11,19,1,3);g.fillStyle='#ffd36a';g.fillRect(4,18,1,1);g.fillRect(11,18,1,1);g.fillStyle='#e05080';g.fillRect(6,19,4,2);},false));
function texLaundry(i){return T('l'+i,()=>ctex(64,16,g=>{g.fillStyle='#2a2228';g.fillRect(0,1,64,1);let x=2;while(x<60){const w=4+Math.floor(R()*7),h=5+Math.floor(R()*9),c=pick(['#f2f0ea','#e8e4d8','#6a8ac8','#d24a3a','#e8c84a','#f2f0ea','#8ab07a','#e8a0b0']);g.fillStyle=c;g.fillRect(x,2,w,h);g.fillStyle=shade(c,-.15);g.fillRect(x,2+h-1,w,1);g.fillStyle='#8a6a4a';g.fillRect(x,1,1,2);g.fillRect(x+w-1,1,1,2);x+=w+1+Math.floor(R()*4);}}));}
const texLand=()=>T('land',()=>ctex(128,32,g=>{const gr=g.createLinearGradient(0,0,0,32);gr.addColorStop(0,'#8fc0e8');gr.addColorStop(1,'#f0e0c0');g.fillStyle=gr;g.fillRect(0,0,128,32);g.fillStyle='#7d9a6a';for(let x=0;x<128;x++){const h=14+Math.round(4*Math.sin(x/9)+3*Math.sin(x/4.3));g.fillRect(x,h,1,32-h);}g.fillStyle='#62804e';for(let x=0;x<128;x++){const h=20+Math.round(2*Math.sin(x/5+1));g.fillRect(x,h,1,32-h);}g.fillStyle='#d8b860';for(let x=0;x<128;x+=3)g.fillRect(x,26+(x%2),2,1);g.fillStyle='#3a3028';for(let x=6;x<128;x+=32){g.fillRect(x,8,1,16);g.fillRect(x-2,9,5,1);}}));
const texFar=()=>T('lfar',()=>ctex(128,48,g=>{const gr=g.createLinearGradient(0,0,0,48);gr.addColorStop(0,'#8fc0e8');gr.addColorStop(.6,'#f0e0c0');gr.addColorStop(1,'#e8d4b0');g.fillStyle=gr;g.fillRect(0,0,128,48);
g.fillStyle='#a8b8a0';for(let x=0;x<128;x++){const h=20+Math.round(5*Math.sin(x/128*TAU*2)+3*Math.sin(x/128*TAU*5+1));g.fillRect(x,h,1,48-h);}
g.fillStyle='#7d9a6a';for(let x=0;x<128;x++){const h=27+Math.round(3*Math.sin(x/128*TAU*3+2)+2*Math.sin(x/128*TAU*7));g.fillRect(x,h,1,48-h);}
g.fillStyle='#62804e';g.fillRect(0,36,128,12);g.fillStyle='#d8b860';for(let x=0;x<128;x+=4)g.fillRect(x,38+(x%8?1:0),3,1);}));
const texMid=()=>T('lmid',()=>ctex(128,48,g=>{g.clearRect(0,0,128,48);
for(let x=4;x<128;x+=11){const h=10+(x*7%9);g.fillStyle='#5a4636';g.fillRect(x,40-h,1,h);g.fillStyle='#4e6e3a';for(let y=0;y<h-3;y+=2){const w=Math.round(3-y/h*2);g.fillRect(x-w,40-h+y,w*2+1,1);}}
g.fillStyle='#d8ccb0';g.fillRect(70,30,12,8);g.fillStyle='#8a4a3a';g.fillRect(68,27,16,3);g.fillStyle='#4a4038';g.fillRect(74,33,2,3);g.fillStyle='#ffd27a';g.fillRect(78,32,2,2);
g.fillStyle='#6a8a52';g.fillRect(0,40,128,8);g.fillStyle='#d8b860';for(let x=0;x<128;x+=6)g.fillRect(x,41,4,1);}));
const texNear=()=>T('lnear',()=>ctex(128,48,g=>{g.clearRect(0,0,128,48);
g.fillStyle='#3a342c';for(const x of [10,74]){g.fillRect(x,2,2,46);g.fillRect(x-4,6,10,1);g.fillRect(x-4,10,10,1);}
g.fillStyle='rgba(40,36,30,.7)';for(let x=0;x<128;x++){g.fillRect(x,7+Math.round(Math.sin((x-10)/64*Math.PI)*2),1,1);}
g.fillStyle='#4a4a3e';for(let x=0;x<128;x+=2){const h=4+Math.round(3*Math.abs(Math.sin(x*.37))+2*Math.sin(x*.11));g.fillRect(x,48-h,2,h);}}));
const texLeafBit=()=>T('leafb',()=>ctex(6,4,g=>{g.fillStyle='#b8743a';g.fillRect(1,0,4,4);g.fillRect(0,1,6,2);g.fillStyle='#8a4e26';g.fillRect(1,2,4,1);},false));
const texWagonSide=()=>T('wside',()=>hd(512,256,(g,gb,w,h,rnd)=>{planks(g,gb,w,h,rnd,26,'#5e3626',true);
g.fillStyle='#3e2418';g.fillRect(0,0,w,14);g.fillRect(0,h-34,w,34);gb.fillStyle='#e0e0e0';gb.fillRect(0,12,w,3);gb.fillRect(0,h-36,w,3);
for(const u of [.125,.3125,.5,.6875]){const cx=u*w,cy=80,ww=60,hh=62;g.fillStyle='#2a1810';rrect(g,cx-ww/2-6,cy-hh/2-6,ww+12,hh+12,8);g.fill();
const gr=g.createLinearGradient(0,cy-hh/2,0,cy+hh/2);gr.addColorStop(0,'#ffe2a0');gr.addColorStop(1,'#e8a050');g.fillStyle=gr;rrect(g,cx-ww/2,cy-hh/2,ww,hh,6);g.fill();
g.fillStyle='#2a1810';g.fillRect(cx-ww/2,cy-2,ww,4);gb.fillStyle='#202020';rrect(gb,cx-ww/2,cy-hh/2,ww,hh,6);gb.fill();}
g.fillStyle='#3a2014';rrect(g,w*.84,24,w*.1,h-62,6);g.fill();g.fillStyle='#ffd27a';g.fillRect(w*.855,40,w*.07,40);g.fillStyle='#c8a040';g.fillRect(w*.925,120,6,12);
g.fillStyle='#e9c46a';g.textAlign='center';g.font='bold 40px Georgia, serif';g.fillText('III',w*.41,190);g.font='bold 18px Georgia, serif';g.fillText('F S',w*.22,186);g.fillText('36412',w*.62,186);
for(let x=8;x<w;x+=16){g.fillStyle='rgba(20,10,6,.55)';g.beginPath();g.arc(x,7,2,0,TAU);g.fill();g.beginPath();g.arc(x,h-17,2,0,TAU);g.fill();}
grainPx(g,w,h,10,rnd);},.05,false));
const texCurtain=()=>T('curt',()=>ctex(16,32,g=>{for(let x=0;x<16;x++){g.fillStyle=x%4<2?'#9a1e26':'#781620';g.fillRect(x,0,1,32);}g.fillStyle='#d6a83a';g.fillRect(0,0,16,2);}));
const texSparkle=()=>T('spark',()=>ctex(64,64,g=>{g.clearRect(0,0,64,64);for(let i=0;i<22;i++){g.fillStyle='rgba(255,255,255,.95)';const x=Math.floor(R()*64),y=Math.floor(R()*64);g.fillRect(x,y,3,1);g.fillRect(x+1,y-1,1,3);}}));
const texFoam=()=>T('foam',()=>ctex(32,8,g=>{g.clearRect(0,0,32,8);for(let x=0;x<32;x++){const h=2+Math.round(Math.sin(x*.7)*1.5+R()*1.5);g.fillStyle='rgba(255,255,255,.9)';g.fillRect(x,0,1,h);}}));
const texLeaf=()=>T('leaf',()=>ctex(32,8,g=>{g.clearRect(0,0,32,8);g.fillStyle='#3a6a30';g.fillRect(0,3,32,2);for(let x=1;x<31;x+=2){const h=3-Math.floor(x/12);g.fillStyle=x%4?'#5aa048':'#3f7a36';g.fillRect(x,3-h,1,h);g.fillRect(x,5,1,h);}},false));
const texAwning=()=>T('awn',()=>ctex(16,8,g=>{for(let x=0;x<16;x++){g.fillStyle=x%4<2?'#3a6ab0':'#f2f0ea';g.fillRect(x,0,1,8);}g.fillStyle='#ffd23a';g.fillRect(0,7,16,1);}));
const texPuff=()=>T('puff',()=>ctex(128,128,g=>{g.clearRect(0,0,128,128);const rnd=mulberry(77);for(let i=0;i<9;i++){const a=rnd()*TAU,d=rnd()*24,x=64+Math.cos(a)*d,y=64+Math.sin(a)*d,r=20+rnd()*18;const gr=g.createRadialGradient(x,y,0,x,y,r);gr.addColorStop(0,'rgba(255,255,255,.5)');gr.addColorStop(.6,'rgba(255,255,255,.22)');gr.addColorStop(1,'rgba(255,255,255,0)');g.fillStyle=gr;g.fillRect(0,0,128,128);}},false));   // sbuffi morbidi di vapore e fumo
function drawPerson(g,o,f){
const P=(x,y,w,h,c)=>{if(!c)return;g.fillStyle=c;g.fillRect(x,y,w,h);};
const ad=!!o.adult,legH=ad?10:6,torH=ad?9:7,hH=6,legTop=32-legH,torTop=legTop-torH,hT=torTop-hH,skin=o.skin,skD=shade(skin,-.2);
const legs=[[5,f===1?1:0],[9,f===2?1:0]];
for(const [lx,lift] of legs){const h=legH-lift;P(lx,legTop,2,h,skin);const ph=(o.longPants||o.robe)?h-1:Math.ceil(h*.5);P(lx,legTop,2,ph,o.pants||o.shirt);const fx=lx<8?lx-1:lx;
if(o.shoes){P(lx,legTop+h-2,2,1,o.shoes);P(fx,legTop+h-1,3,1,o.shoes);if(o.holes)P(lx<8?lx:lx+1,legTop+h-1,1,1,skD);}else P(fx,legTop+h-1,3,1,skD);}
if(o.skirt){const sh=Math.ceil(legH*(ad?.7:.6));P(4,legTop,8,sh-2,o.skirt);P(3,legTop+sh-2,10,2,o.skirt);P(3,legTop+sh-1,10,1,shade(o.skirt,-.2));}
if(o.robe){P(4,legTop,8,legH-1,o.robe);P(3,legTop+legH-3,10,2,o.robe);}
const sh=o.coat||o.shirt;
P(4,torTop,8,torH,sh);P(10,torTop,2,torH,shade(sh,-.15));
if(o.coat){P(4,torTop+torH,8,2,o.coat);P(7,torTop,1,torH+2,shade(o.coat,-.2));P(6,torTop+2,1,1,shade(o.coat,.3));P(6,torTop+5,1,1,shade(o.coat,.3));}
if(o.vest){P(4,torTop,2,torH,o.vest);P(10,torTop,2,torH,o.vest);}
if(o.apron)P(5,torTop+3,6,torH-3+(o.skirt?Math.ceil(legH*.6):2),o.apron);
if(o.scarf){P(4,torTop,8,2,o.scarf);P(9,torTop+2,2,3,o.scarf);}
const aL=f===1?1:0,aR=f===2?1:0;
P(3,torTop+1+aL,1,torH-2,sh);P(3,torTop+torH-1+aL,1,1,skin);
P(12,torTop+1+aR,1,torH-2,shade(sh,-.15));P(12,torTop+torH-1+aR,1,1,skin);
if(o.lantern){P(13,torTop+torH-1+aR,2,1,'#3a3030');P(13,torTop+torH+aR,2,3,'#ffd36a');}
if(o.violin){P(12,torTop-1,2,6,'#8a4a20');P(13,torTop-2,1,1,'#3a2010');}
if(o.bag){P(2,torTop+3,3,4,o.bag);}
P(5,hT,6,hH,skin);P(10,hT+1,1,hH-1,skD);
P(6,hT+3,1,1,'#1b1216');P(9,hT+3,1,1,'#1b1216');P(7,hT+5,2,1,shade(skin,-.3));
if(!ad)P(6,hT+4,1,1,shade(skin,.08));
if(o.mustache)P(6,hT+4,4,1,o.mustache);
const hc=o.hair,hs=o.hs;
if(hs==='bald'){P(5,hT+1,1,2,hc);P(10,hT+1,1,2,hc);}
else{P(5,hT-1,6,2,hc);P(5,hT+1,1,2,hc);P(10,hT+1,1,1,hc);
if(hs==='curly'){P(4,hT,1,3,hc);P(11,hT,1,3,hc);P(5,hT-2,2,1,hc);P(8,hT-2,2,1,hc);}
if(hs==='long'){P(4,hT,1,hH+3,hc);P(11,hT,1,hH+3,hc);}
if(hs==='bun')P(6,hT-3,4,2,hc);}
if(o.cap){P(4,hT-2,8,2,o.cap);P(4,hT,9,1,shade(o.cap,-.25));}
if(o.hat){P(3,hT,10,1,o.hat);P(5,hT-2,6,2,o.hat);}
if(o.kerchief){P(4,hT-2,8,3,o.kerchief);P(4,hT+1,1,4,o.kerchief);P(11,hT+1,1,4,o.kerchief);}
}
function mkTex(c){const t=new THREE.CanvasTexture(c);t.magFilter=t.minFilter=THREE.NearestFilter;t.generateMipmaps=false;return t;}
function frameSet(w,h,drawFn,n){const r=[],l=[],cs=[];for(let f=0;f<n;f++){const c=document.createElement('canvas');c.width=w;c.height=h;const g=c.getContext('2d');drawFn(g,f);outline(g,w,h);const m=document.createElement('canvas');m.width=w;m.height=h;const mg=m.getContext('2d');mg.scale(-1,1);mg.drawImage(c,-w,0);r.push(mkTex(c));l.push(mkTex(m));cs.push(c);}return {r,l,c:cs[0],cs};}
const FCACHE={};
function personFrames(def){const k=JSON.stringify(def);return FCACHE[k]||(FCACHE[k]=frameSet(16,32,(g,f)=>drawPerson(g,def,f),3));}
const PX=g=>(x,y,w,h,c)=>{g.fillStyle=c;g.fillRect(x,y,w,h);};
const chickenFrames=()=>FCACHE.chick||(FCACHE.chick=frameSet(12,12,(g,f)=>{const P=PX(g);P(1,3,2,2,'#e2dccd');P(3,4,7,5,'#f4f0e6');P(2,5,1,3,'#f4f0e6');P(7,2,3,4,'#f4f0e6');P(8,1,2,1,'#d23a30');P(10,3,1,1,'#e8a020');P(8,3,1,1,'#111');P(9,5,1,1,'#d23a30');P(4,6,4,2,'#d8d0c0');P(5,9,1,f===1?1:2,'#e8a020');P(7,9,1,f===2?1:2,'#e8a020');},3));
const pigeonFrames=()=>FCACHE.pig||(FCACHE.pig=frameSet(12,10,(g,f)=>{const P=PX(g);if(f<2){const hy=f?4:2;P(2,4,6,4,'#8a8a9a');P(1,5,2,2,'#6a6a7a');P(7,hy,3,3,'#7a7a8a');P(7,hy+2,2,1,'#4a9a7a');P(10,hy+1,1,1,'#d8a070');P(8,hy+1,1,1,'#111');P(4,8,1,2,'#e08080');P(6,8,1,2,'#e08080');P(3,5,4,1,'#9a9aaa');}else{const up=f===2;P(3,4,6,3,'#8a8a9a');P(8,3,3,3,'#7a7a8a');P(10,4,1,1,'#d8a070');if(up){P(1,0,4,4,'#a0a0b0');P(6,0,3,4,'#a0a0b0');}else{P(0,6,4,3,'#a0a0b0');P(6,6,4,3,'#a0a0b0');}}},4));
const dogFrames=()=>FCACHE.dog||(FCACHE.dog=frameSet(14,10,(g,f)=>{const P=PX(g);P(2,3,9,4,'#9a6a3a');P(3,5,7,2,'#b8884e');P(10,1,3,4,'#9a6a3a');P(13,3,1,1,'#1a1010');P(10,0,1,2,'#6a4220');P(11,2,1,1,'#111');P(f===1?0:1,f===1?1:2,2,1,'#9a6a3a');const L='#6a4220';if(f===0){P(3,7,1,3,L);P(5,7,1,3,L);P(8,7,1,3,L);P(10,7,1,3,L);}else if(f===1){P(2,7,1,3,L);P(6,7,1,2,L);P(9,7,1,3,L);P(10,7,1,2,L);}else{P(4,7,1,2,L);P(5,7,1,3,L);P(7,7,1,2,L);P(11,7,1,3,L);}},3));
const gullFrames=()=>FCACHE.gull||(FCACHE.gull=frameSet(14,8,(g,f)=>{const P=PX(g);P(5,3,5,2,'#f4f4f4');P(10,3,2,1,'#f4f4f4');P(12,3,1,1,'#f0b030');if(f){P(0,0,5,2,'#e8e8ee');P(0,0,1,1,'#222');P(9,0,4,2,'#e8e8ee');P(12,0,1,1,'#222');P(3,2,3,1,'#e8e8ee');P(8,2,2,1,'#e8e8ee');}else{P(0,5,5,1,'#e8e8ee');P(0,5,1,1,'#222');P(9,5,4,1,'#e8e8ee');P(3,4,3,1,'#e8e8ee');P(8,4,2,1,'#e8e8ee');}},2));
const rugFrames=()=>frameSet(10,10,(g)=>{const c=pick(['#c84a3a','#3a6ea8','#e0b040','#7a9a5a']);g.fillStyle=c;g.fillRect(1,2,8,6);g.fillRect(2,1,5,1);g.fillRect(3,8,6,1);g.fillStyle=shade(c,.35);g.fillRect(1,4,8,1);g.fillRect(1,6,8,1);},1);
const markTex=()=>T('mark',()=>{const c=document.createElement('canvas');c.width=6;c.height=11;const g=c.getContext('2d');g.fillStyle='#ffd23a';g.fillRect(2,1,2,6);g.fillRect(2,8,2,2);outline(g,6,11);return mkTex(c);});
const EMO={heart:['.##.##.','#######','#######','.#####.','..###..','...#...'],note:['...###.','...#.##','...#...','...#...','.###...','####...','.##....'],excl:['.##.','.##.','.##.','.##.','....','.##.'],ask:['.###.','#...#','...#.','..#..','.....','..#..'],drop:['..#..','.###.','#####','#####','.###.'],dots:['.......','.......','#.#.#..']};
const EMOCOL={heart:'#e8344a',note:'#f2ecdf',excl:'#ffd23a',ask:'#f2ecdf',drop:'#7ac8f0',dots:'#f2ecdf'};
const emoteTex=k=>T('emo'+k,()=>{const p=EMO[k];const w=p[0].length+2,h=p.length+2;const c=document.createElement('canvas');c.width=w;c.height=h;const g=c.getContext('2d');g.fillStyle=EMOCOL[k];p.forEach((row,y)=>[...row].forEach((ch,x)=>{if(ch==='#')g.fillRect(x+1,y+1,1,1);}));outline(g,w,h);return mkTex(c);});
const C={
amerigo:{skin:'#d8a07a',hair:'#22150f',hs:'curly',shirt:'#cfc6a6',pants:'#5b4a3a',shoes:'#4a3a30',holes:1},
adulto:{adult:1,skin:'#d8a07a',hair:'#3a2a20',hs:'curly',shirt:'#2c2c3a',coat:'#2c2c3a',longPants:1,pants:'#24242e',shoes:'#141014'},
mamma:{adult:1,skin:'#cf9672',hair:'#1a120e',hs:'bun',shirt:'#34303c',skirt:'#2a2630',apron:'#8c8170',shoes:'#2a2020'},
tommasino:{skin:'#e0aa82',hair:'#6b4a2a',hs:'short',cap:'#4f4436',shirt:'#7d8a5c',pants:'#3d3a35'},
mariuccia:{skin:'#e3b08a',hair:'#2b1b12',hs:'long',shirt:'#b4607a',skirt:'#b4607a',shoes:'#5a3a2a'},
carluccio:{skin:'#dba67e',hair:'#4a3020',hs:'curly',shirt:'#8aa0b8',pants:'#4a4a52',shoes:'#3a2a20'},
bimba:{skin:'#e8b890',hair:'#5a3a22',hs:'long',shirt:'#e0c050',skirt:'#e0c050'},
maddalena:{adult:1,skin:'#e0ae8c',hair:'#4a2a1a',hs:'long',shirt:'#e8e0d0',skirt:'#384868',scarf:'#d23a30',shoes:'#2a1a14',bag:'#6a4a2a'},
nicola:{adult:1,skin:'#c98e6a',hair:'#bbb6ae',hs:'bald',mustache:'#d8d2c8',shirt:'#7a6a58',longPants:1,pants:'#4a4038',apron:'#5a3a24',shoes:'#4a3a30',holes:1},
signora:{adult:1,skin:'#ecc0a0',hair:'#3a2018',hs:'bun',hat:'#6a2a4a',coat:'#7a3a5a',skirt:'#7a3a5a',shoes:'#c02a2a'},
soldato:{adult:1,skin:'#e8b898',hair:'#c8a060',hs:'short',cap:'#7a7048',shirt:'#8a7d4c',longPants:1,pants:'#7a6e44',shoes:'#5a3a20'},
prete:{adult:1,skin:'#e0b090',hair:'#333333',hs:'short',hat:'#16141a',shirt:'#1a181e',robe:'#1a181e',shoes:'#0e0c10'},
pesce:{adult:1,skin:'#b87a52',hair:'#1a120e',hs:'curly',shirt:'#5a7aa0',longPants:1,pants:'#c8bfa8'},
acqua:{adult:1,skin:'#c88e68',hair:'#2a1a12',hs:'short',mustache:'#2a1a12',shirt:'#f2f0ea',apron:'#3a6ab0',longPants:1,pants:'#3a3a44',shoes:'#2a1a14'},
castagnaro:{adult:1,skin:'#d8a080',hair:'#3a2a20',hs:'short',cap:'#3a3a40',mustache:'#3a2a20',coat:'#5a4a3a',longPants:1,pants:'#3a3a44',apron:'#8a7a60',shoes:'#2a1a14'},
comitato:{adult:1,skin:'#e8b898',hair:'#5a3a2a',hs:'bun',coat:'#4a5a4a',skirt:'#3a3a3a',scarf:'#d23a30',shoes:'#2a1a14'},
derna:{adult:1,skin:'#ecc4a4',hair:'#7a4a2a',hs:'short',coat:'#6a5c40',skirt:'#3a3a42',scarf:'#d23a30',shoes:'#2a1a14'},
rosa:{adult:1,skin:'#efc0a0',hair:'#5a3a22',hs:'bun',kerchief:'#9a6a3a',shirt:'#a8584a',skirt:'#4a3a3a',apron:'#e6e0d4',shoes:'#3a2a20'},
alcide:{adult:1,skin:'#e4b090',hair:'#8a8278',hs:'short',cap:'#4a4a50',mustache:'#a09a90',shirt:'#c8c0b0',vest:'#5a4030',longPants:1,pants:'#3a3a44',shoes:'#2a1a14'},
rivo:{skin:'#f0c4a0',hair:'#b58a4a',hs:'short',shirt:'#8c3a3a',longPants:1,pants:'#3a3a48',shoes:'#2a1a14'},
maestra:{adult:1,skin:'#f0c8a8',hair:'#3a2a20',hs:'bun',shirt:'#e8e4d8',skirt:'#2a3a5a',shoes:'#2a1a14'},
vicina:{adult:1,skin:'#d49a76',hair:'#2a1a12',hs:'bun',kerchief:'#4a4058',shirt:'#3c3848',skirt:'#2e2a36',shoes:'#2a2020',lantern:1},
vicinaG:{adult:1,skin:'#d49a76',hair:'#2a1a12',hs:'bun',kerchief:'#6a3a3a',shirt:'#4c4048',skirt:'#2e2a36',shoes:'#2a2020'},
carmela:{adult:1,skin:'#d8a888',hair:'#e8e4de',hs:'bun',shirt:'#24222a',skirt:'#24222a',shoes:'#1a1818'},
ragazzo94:{adult:1,skin:'#e0aa82',hair:'#2a1a12',hs:'short',shirt:'#e85a3a',longPants:1,pants:'#3a5a9a',shoes:'#f2f0ea'},
};
C.lavandaia={adult:1,skin:'#d4a07c',hair:'#3a2418',hs:'bun',kerchief:'#e2d8c6',shirt:'#8a7a6a',skirt:'#4a3e3a',apron:'#e6e0d4',shoes:'#2a2020'};
C.pescatore={adult:1,skin:'#b47a54',hair:'#9a948a',hs:'short',cap:'#2e3446',mustache:'#bab4aa',shirt:'#6a7a8c',vest:'#4a3a2a',longPants:1,pants:'#4a4a3a'};
const PAL={cloth:['#34303c','#4a3e36','#5a4a42','#3a4a5a','#6a5a48','#7a3a3a','#4a5a4a','#8a7a6a','#2e3446','#6a4a5a','#9a8a6a','#5a6a7a'],light:['#e8e0d0','#d8ccb6','#c8d0d8','#e0c8b0','#cfc6a6'],hair:['#1a120e','#2a1a12','#3a2a20','#5a3a22','#7a5a3a','#8a8278','#2b1b12']};
function vary(d){const o=Object.assign({},d),p=a=>a[Math.floor(R()*a.length)];for(const k of ['coat','skirt','pants','vest','hat','cap','kerchief'])if(o[k])o[k]=p(PAL.cloth);if(o.shirt)o.shirt=R()<.5?p(PAL.light):p(PAL.cloth);if(o.apron)o.apron=p(PAL.light);if(o.hair&&o.hs!=='bald')o.hair=p(PAL.hair);if(R()<.3&&o.adult&&!o.kerchief&&!o.hat)o.kerchief=p(PAL.cloth);return o;}
C.amerigoN=Object.assign({},C.amerigo,{shoes:'#1e1612',holes:0,coat:'#45577a'});
C.amerigoV=Object.assign({},C.amerigoN,{violin:1});
C.amerigoS=Object.assign({},C.amerigoV,{shoes:null});
C.piccolo=Object.assign({},C.amerigo,{shoes:null,holes:0});
C.adultoV=Object.assign({},C.adulto,{violin:1});
let world=new THREE.Group();scene.add(world);
let obstacles=[],occluders=[],actors=[],items=[],interacts=[],hooks=[];
const FX=[];const waiters=[];
const SHGEO=new THREE.CircleGeometry(.34,10),SHMAT=new THREE.MeshBasicMaterial({color:0x000000,transparent:true,opacity:.28,depthWrite:false});
function clearWorld(){scene.remove(world);world.traverse(o=>{if(o.geometry&&o.geometry!==SHGEO)o.geometry.dispose();});world=new THREE.Group();scene.add(world);obstacles=[];occluders=[];actors=[];items=[];interacts=[];hooks=[];FX.length=0;P=null;ramps=[];guideFn=null;TZ=[];TERRAIN='stone';WINQ=[];NOWIN=[];CURBQ=[];ICEQ=[];CITYSTYLE='napoli';MERGEQ=true;stopAmb();}
function mat(map,o){o=o||{};const M=o.basic?THREE.MeshBasicMaterial:THREE.MeshStandardMaterial;const p={};if(map&&map.isTexture)p.map=map;else p.color=new THREE.Color(map||'#888');if(o.alpha){p.transparent=true;p.alphaTest=.5;}if(o.double)p.side=THREE.DoubleSide;if(o.fog===false)p.fog=false;
if(!o.basic){p.roughness=o.rough!==undefined?o.rough:.9;p.metalness=o.metal||0;p.envMapIntensity=o.env!==undefined?o.env:.25;const bm=o.bump||bumpFor(p.map);if(bm){p.bumpMap=bm;p.bumpScale=o.bumpScale||(p.map&&p.map.image.__bs)||.02;}}return new M(p);}
function box(x,y,z,w,h,d,m,o){o=o||{};const me=new THREE.Mesh(new THREE.BoxGeometry(w,h,d),m);me.position.set(x,y+h/2,z);world.add(me);if(o.collide!==false)obstacles.push({x0:x-w/2,x1:x+w/2,z0:z-d/2,z1:z+d/2});if(o.occlude)occluders.push(me);return me;}
function plane(w,h,m,x,y,z,ry){const me=new THREE.Mesh(new THREE.PlaneGeometry(w,h),m);me.position.set(x,y,z);me.rotation.y=ry||0;world.add(me);return me;}
const GND_POM=`
float gHash(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}
float gNoise(vec2 p){vec2 i=floor(p),f=fract(p);f=f*f*(3.-2.*f);return mix(mix(gHash(i),gHash(i+vec2(1,0)),f.x),mix(gHash(i+vec2(0,1)),gHash(i+vec2(1,1)),f.x),f.y);}
#ifdef USE_BUMPMAP
vec2 gPom(vec2 uv,vec3 V){
#ifdef G_POM
vec2 dx=dFdx(uv),dy=dFdy(uv);const int N=10;float ls=1./float(N);vec2 P=V.xy/max(V.z,.3)*uPS;vec2 d=P*ls;float cur=0.;vec2 c=uv;
float dep=1.-textureGrad(bumpMap,c,dx,dy).r;
for(int i=0;i<N;i++){if(cur>=dep)break;c-=d;dep=1.-textureGrad(bumpMap,c,dx,dy).r;cur+=ls;}
vec2 pr=c+d;float af=dep-cur,bf=(1.-textureGrad(bumpMap,pr,dx,dy).r)-cur+ls;return mix(c,pr,af/(af-bf+1e-5));
#else
return uv;
#endif
}
#endif
`;
let GNDN=0;
function groundFx(m,rect,margin,tile,pom){const k=(GNDN++%8)+1;m.polygonOffset=true;m.polygonOffsetFactor=-k*.25;m.polygonOffsetUnits=-k;
m.onBeforeCompile=s=>{s.uniforms.uRect={value:new THREE.Vector4(...rect)};s.uniforms.uM={value:margin};s.uniforms.uPS={value:.08/tile};
s.vertexShader='varying vec3 vWPos;\n'+s.vertexShader.replace('#include <begin_vertex>','#include <begin_vertex>\nvWPos=(modelMatrix*vec4(transformed,1.)).xyz;');
let f='varying vec3 vWPos;\nuniform vec4 uRect;\nuniform float uM;\nuniform float uPS;\nvec2 pUv;\n'+(pom?'#define G_POM\n':'')+s.fragmentShader;
f=f.replace('#include <bumpmap_pars_fragment>',THREE.ShaderChunk.bumpmap_pars_fragment.replace(/vUv/g,'pUv')+GND_POM).replace('#include <map_fragment>',THREE.ShaderChunk.map_fragment.replace(/vUv/g,'pUv'));
f=f.replace('void main() {','void main() {\n  pUv=vUv;\n  #ifdef USE_BUMPMAP\n  {vec3 V=normalize(cameraPosition-vWPos);pUv=gPom(vUv,vec3(V.x,-V.z,V.y));}\n  #endif\n'+
'  {float ex=max(max(uRect.x-vWPos.x,vWPos.x-uRect.z),0.),ez=max(max(uRect.y-vWPos.z,vWPos.z-uRect.w),0.),e=max(ex,ez);\n'+
'   if(uM>0.&&e>0.){float n=gNoise(vWPos.xz*1.3)*.6+gNoise(vWPos.xz*4.1)*.4;if(n<e/uM)discard;}}\n');
f=f.replace('#include <map_fragment>','#include <map_fragment>');
f=f.replace('vec4 diffuseColor = vec4( diffuse, opacity );','vec4 diffuseColor = vec4( diffuse, opacity );\n  {float inr=min(min(vWPos.x-uRect.x,uRect.z-vWPos.x),min(vWPos.z-uRect.y,uRect.w-vWPos.z));if(uM>0.)diffuseColor.rgb*=mix(.8,1.,smoothstep(-.7,.9,inr+(gNoise(vWPos.xz*2.7)-.5)*.8));}');
s.fragmentShader=f;};
m.customProgramCacheKey=()=>'gnd'+(pom?1:0);}
let CURBQ=[];
function curbFlush(){const q=CURBQ;CURBQ=[];if(!q.length)return;const seen=new Set(),L=[];
const blocked=(x,z)=>{for(const b of obstacles)if(x>b.x0-.05&&x<b.x1+.05&&z>b.z0-.05&&z<b.z1+.05&&(b.x1-b.x0)*(b.z1-b.z0)>1.5)return true;return false;};
for(const g of q){const [x0,z0,x1,z1]=g.r,H=g.H,y=g.y;const edges=[[x0,z0,x1,z0],[x1,z0,x1,z1],[x1,z1,x0,z1],[x0,z1,x0,z0]];
for(const [ax,az,bx,bz] of edges){const len=Math.hypot(bx-ax,bz-az),n=Math.max(1,Math.round(len/.56)),ry=Math.atan2(-(bz-az),bx-ax);
for(let i=0;i<n;i++){const t=(i+.5)/n,x=ax+(bx-ax)*t,z=az+(bz-az)*t,k=Math.round(x*4)+','+Math.round(z*4);if(seen.has(k))continue;seen.add(k);if(blocked(x,z))continue;
const r=gHashJ(x,z);L.push([x,(H?H(x,z):0)+y+.04+r*.025,z,ry+(r-.5)*.08,.5+r*.04]);}}}
if(!L.length)return;const t=texSlabs().clone();t.needsUpdate=true;t.repeat.set(.25,.12);const m=mat(t,{rough:.85});m.color.set('#cfc6b4');
const im=new THREE.InstancedMesh(new THREE.BoxGeometry(1,.14,.24),m,L.length),m4=new THREE.Matrix4(),q4=new THREE.Quaternion(),v=new THREE.Vector3(),s=new THREE.Vector3(),Y=new THREE.Vector3(0,1,0);
L.forEach((e,i)=>{q4.setFromAxisAngle(Y,e[3]);m4.compose(v.set(e[0],e[1],e[2]),q4,s.set(e[4],1,1));im.setMatrixAt(i,m4);});im.castShadow=im.receiveShadow=true;im.userData.noMerge=true;world.add(im);}
const gHashJ=(x,z)=>{const s=Math.sin(x*12.9898+z*78.233)*43758.5453;return s-Math.floor(s);};
const bumpy=(x,z)=>(Math.sin(x*1.7+z*.6)*.5+Math.sin(z*2.3-x*.9)*.35+Math.sin(x*4.1+z*3.7)*.15)*.008-.009;
function ground(w,d,tex,cx,cz,rx,rz,y,H){const big=w>=5&&d>=2.4,mg=big?.25:0,W=w+2*mg,D=d+2*mg;if(big&&tex!==texSnow()&&tex!==texDirt())CURBQ.push({r:[cx-w/2,cz-d/2,cx+w/2,cz+d/2],H,y:y||0});const H0=H;if(big&&tex!==texSnow()&&tex!==texDirt())H=(x,z)=>(H0?H0(x,z):0)+bumpy(x,z);const t=tex.clone();t.needsUpdate=true;t.repeat.set(rx*W/w,rz*D/d);const m=mat(t);
const pom=!!m.bumpMap&&renderer.capabilities.isWebGL2&&QK!=='basso';groundFx(m,[cx-w/2,cz-d/2,cx+w/2,cz+d/2],mg,(w/rx+d/rz)/2,pom);
const g=H?new THREE.PlaneGeometry(W,D,Math.max(1,Math.round(W/1.5)),Math.max(1,Math.round(D/1.5))):new THREE.PlaneGeometry(W,D);
if(H){const p=g.attributes.position;for(let i=0;i<p.count;i++)p.setZ(i,H(cx+p.getX(i),cz-p.getY(i)));g.computeVertexNormals();}
const me=new THREE.Mesh(g,m);me.rotation.x=-Math.PI/2;me.position.set(cx,y||0,cz);if(H)me.userData.noLift=true;world.add(me);return me;}
function wall(x0,z0,x1,z1){obstacles.push({x0:Math.min(x0,x1),x1:Math.max(x0,x1),z0:Math.min(z0,z1),z1:Math.max(z0,z1)});}
let AUTOY=false;
function building(cx,cz,w,d,h,base,night,bo){const y0=bo&&bo.y0!==undefined?bo.y0:(AUTOY?heightAt(cx,cz):0);
if(WREC&&!(bo&&(bo.stone||bo.part||bo.noCollapse))&&Math.max(w,d)>=6&&h>=9){const rc=mulberry(Math.round(cx*91+cz*37+h*13+5));const r1=rc();if(r1<.3)return collapsedBuilding(cx,cz,w,d,h,base,night,Object.assign({},bo||{},{y0}),y0,rc);
if(r1<.37&&typeof ruin==='function'&&!night){ruin(cx-w/2,cz-d/2,cx+w/2,cz+d/2,h*.85,base,rc);return null;}}   // sventrato: restano i muri, dentro le macerie
if(CITYSTYLE==='napoli'&&!(bo&&(bo.stone||bo.part||bo.noSplit||bo.noWin))&&h>=8){const rv=mulberry(Math.round(cx*53+cz*19+h*3+77)),kind=rv(),alongX=w>=d,L=alongX?w:d,D=alongX?d:w;
if(kind<.5&&L>=8&&D>=4){const cut=L*(.38+rv()*.24),back=.6+rv()*.7,h2=Math.max(6,h+(rv()<.45?-1:1)*2.9*(1+Math.floor(rv()*2))),b2=Object.assign({},bo||{},{part:true,y0}),recA=rv()<.5;
const mk=(off,len,dep,hh)=>alongX?building(cx+off,cz,len,dep,hh,base,night,b2):building(cx,cz+off,dep,len,hh,base,night,b2);
const A=mk(-L/2+cut/2,cut,recA?D-2*back:D,recA?h2:h);mk(L/2-(L-cut)/2,L-cut,recA?D:D-2*back,recA?h:h2);return A;}
if(kind>.78&&L>=6){const me=building(cx,cz,w,d,h,base,night,Object.assign({},bo||{},{part:true,y0})),tw=Math.min(3.4,w*.45),td=Math.min(3.4,d*.45),sx=rv()<.5?1:-1,sz=rv()<.5?1:-1;
building(cx+sx*(w/2-tw/2+.15),cz+sz*(d/2-td/2+.15),tw,td,h+3.3,base,night,Object.assign({},bo||{},{part:true,y0,first:h+.5,noGround:true}));return me;}}
const src=()=>bo&&bo.stone?texSlabs():texPlaster(base,!!WREC);   // stone: pietra a vista (chiese, torri); altrimenti intonaco liscio: le finestre sono vere, in 3D
if(!(bo&&bo.stone)&&!(bo&&bo.noWin))WINQ.push({cx,cz,w,d,h,base,night:!!night,y0,poor:!!WREC,first:bo&&bo.first,noGround:bo&&bo.noGround});
const ma=kmat('bld'+base+(bo&&bo.stone?'s':'')+(night?'n':'')+(WREC?'p':''),()=>{const m=mat(src());if(night)m.emissive=new THREE.Color('#1a1626');return m;}),top=mc(shade(base,-.35));
const geo=new THREE.BoxGeometry(w,h+y0,d),uv=geo.attributes.uv;
for(let i=0;i<uv.count;i++){const f=Math.floor(i/4),fw=f<2?d:w,fh=f===2||f===3?d:h+y0;uv.setXY(i,uv.getX(i)*Math.max(1,Math.round(fw/2.2)),uv.getY(i)*Math.max(1,Math.round(fh/2.6)));}
const me=new THREE.Mesh(geo,[ma,ma,top,top,ma,ma]);me.position.set(cx,(h+y0)/2,cz);me.userData.noLift=true;world.add(me);
obstacles.push({x0:cx-w/2,x1:cx+w/2,z0:cz-d/2,z1:cz+d/2});occluders.push(me);if(WREC&&!(bo&&bo.stone))WREC.push([cx-w/2,cz-d/2,cx+w/2,cz+d/2,h,y0,base]);const f0=world.children.length;buildingDetail(cx,cz,w,d,h,base,y0,bo);for(const o of world.children.slice(f0))o.userData.noLift=true;return me;}
