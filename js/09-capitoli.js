"use strict";
async function chGuerra(){
buildNapoli('war');setPlayer(C.piccolo,-.8,1.4,0,.85);setCam(6.5,.62);music(null);
const Q={arrived:false,sat:false};
hud('Ricordo · Napoli, 1943',()=>[['Segui mammà fino al RICOVERO, in piazza',Q.arrived]]);
await card({kick:'UN RICORDO',title:'Le sirene',sub:'Napoli · 1943',body:'<p>Prima del treno c\'è stata la guerra. Amerigo era piccolissimo, ma certe notti non si dimenticano.</p>',
notes:{libro:'Nel romanzo la guerra è appena finita e pesa su tutto: la fame, le case distrutte, gli uomini che non tornano. Questa scena del rifugio è inventata per il gioco, per far vedere da dove arriva Amerigo.',film:'Il film racconta soprattutto il dopoguerra. Questa scena del rifugio è inventata per il gioco, come un ricordo d\'infanzia.'}});
const mamma=actor(C.mamma,-1.4,.2,{name:'Mamma Antonietta',solid:false,speed:3.2});mamma.watch=false;
cineOn();camSet([10,16,-34],[0,6,-12]);await fade(false);ambient('sirena');
await camTo([.4,15,-20],[-1,3,0],1300);await camTo([.4,8,-4],[-1,1.2,0],1100);await camTo([1.2,4.5,6],[-1,1.2,0],1400);   // giù lungo il vicolo, senza toccare i palazzi
await N('Avevo quattro anni. Mi ricordo il suono delle sirene: un lamento lungo, che saliva e scendeva sopra i tetti.','Avevo quattro anni. Ricordo ancora le sirene: un lamento lungo, che saliva e scendeva sopra i tetti.');
emote(mamma,'excl');await say('Mamma Antonietta','Amerì! Scetate! Al ricovero, curre! Stammi dietro e non ti fermare!',C.mamma);
cineOff();toast('Segui mammà ed evita i cerchi rossi!');
mamma.path=[[-.6,-2.5],[.6,-7],[-.4,-11.5],[-3.2,-14.2],[-6.2,-14.4]];mamma.loop=false;
let bt=1.4,hits=0;const bombs=[];let active=true;
hooks.push(dt=>{if(mamma.path)mamma.paused=P.z>mamma.z+1&&Math.hypot(P.x-mamma.x,P.z-mamma.z)>4.2;if(mamma.paused&&Math.random()<dt*.4)emote(mamma,'excl');
if(!active||!canMove()&&!(P.stun>0))return;bt-=dt;
if(bt<=0){bt=rr(.6,1.1);let x,z;if(R()<.35){x=P.x+rr(-.5,.5);z=P.z-rr(0,1.5);}else{z=P.z-rr(2,8);x=(z<-12&&z>-22)?rr(-6,6):rr(-2,2);}
if(z<-23||z>4||(Math.abs(x+6.2)<1.6&&Math.abs(z+14.4)<1.6)){}else{const ring=new THREE.Mesh(new THREE.RingGeometry(.95,1.15,20),new THREE.MeshBasicMaterial({color:0xff3a2a,transparent:true,opacity:.85,depthWrite:false}));ring.rotation.x=-Math.PI/2;ring.position.set(x,.05,z);world.add(ring);
const disk=new THREE.Mesh(new THREE.CircleGeometry(1,20),new THREE.MeshBasicMaterial({color:0xff3a2a,transparent:true,opacity:.3,depthWrite:false}));disk.rotation.x=-Math.PI/2;disk.position.set(x,.04,z);disk.scale.setScalar(.01);world.add(disk);bombs.push({x,z,ring,disk,t:0});whistleFall();}}
for(let i=bombs.length-1;i>=0;i--){const b=bombs[i];b.t+=dt;const k=b.t/1.5;b.disk.scale.setScalar(Math.max(.01,k));b.ring.material.opacity=.5+Math.sin(b.t*20)*.35;
if(k>=1){world.remove(b.ring);world.remove(b.disk);bombs.splice(i,1);explode(b.x,b.z);const d=Math.hypot(P.x-b.x,P.z-b.z);shake=Math.max(shake,.55*clamp(1-d/12,.15,1));
if(d<1.35&&!(P.stun>0)){let dx=P.x-b.x,dz=P.z-b.z,l=Math.hypot(dx,dz)||1;P.x+=dx/l*1.5;P.z+=dz/l*1.5;collide(P,.3);P.stun=.9;hits++;STATS.colpi++;emote(P,'drop');toast(pick(['Attento!','Rialzati, Amerì!','Mammà ti aspetta!']));}
else if(R()<.4&&Math.abs(b.x)>1.3&&d>1.6)box(b.x,0,b.z,.8,.45,.8,mat('#5a5048'));}}});
await waitUntil(()=>Math.hypot(P.x+6.2,P.z+14.4)<1.7&&!mamma.path);
active=false;Q.arrived=true;refresh();stopAmb();await fade(true);
buildShelter();setPlayer(C.piccolo,0,3.2,0,.85);setCam(5.5,.75);
hud('Ricordo · Il ricovero',()=>[['Siediti vicino a mammà',Q.sat]]);
const m2=actor(C.mamma,-1,-1.8,{name:'Mamma Antonietta'});m2.markFn=()=>!Q.sat;
const vic=actor(C.vicinaG,2.6,-1,{name:'Una vicina'});const cr=actor(C.carluccio,3.3,-.6,{name:'',sc:.8});cr.watch=false;
const old=actor(C.nicola,-3.4,1.2,{name:"Zi' Nicola"});
hooks.push(dt=>{if(Math.random()<dt*.15)emote(cr,'drop');});
await fade(false);
await cut(async()=>{await N('Nel ricovero c\'era odore di terra bagnata e di candele. Ogni tanto il soffitto tremava, e la polvere scendeva sulle nostre teste.','Nel ricovero c\'era odore di terra bagnata e di candele. Ogni tanto il soffitto tremava.');});
talk(vic,'Parla con la vicina',async()=>{await say('Una vicina','Zitto, zitto, criatura mia… passa, passa. Mo\' passa.',C.vicinaG);});
talk(old,"Parla con Zi' Nicola",async()=>{await say("Zi' Nicola",'Questa guerra ce la siamo trovata in casa, guagliò. Ma finisce. Tutto finisce, pure le cose brutte.',C.nicola);});
talk(m2,'Siediti vicino a mammà',async()=>{
await say('Amerigo','Mammà… ho paura.',C.amerigo);
const c=await choose('Amerigo','…',['Stringi la mano di mammà','Conta le candele per non pensarci'],C.amerigo);
if(c===1)await N('Una, due, tre candele. Poi ricominciavo. Mammà mi guardava contare.');
music('ninna');emote(m2,'note');
await N('Mia madre non cantava mai. Quella notte cantò, piano piano, solo per me.');
emote(m2,'note');await say('Mamma Antonietta','Duorme, Amerì. Passa tutto.',C.mamma);emote(m2,'heart');
await N('Mi addormentai con la testa sulle sue ginocchia. È l\'unica volta che ricordo le sue mani ferme.');Q.sat=true;});
await waitUntil(()=>Q.sat&&!interacting);
await fade(true);stopMusic();
await cut(async()=>{await N('Quando uscimmo, metà del vicolo non c\'era più. Ma noi c\'eravamo.');});
await fact('Napoli sotto le bombe','Napoli fu una delle città italiane più colpite dai bombardamenti della Seconda guerra mondiale. Nel settembre 1943 la popolazione insorse contro l\'occupazione tedesca: sono le «Quattro giornate di Napoli».');
}
function napoliExtra(Q){
const found=(k,t)=>{if(Q.extra.has(k))return;Q.extra.add(k);STATS.scoperto++;toast((t||'Scoperta')+' · '+Q.extra.size+'/8');refresh();};
box(-5.4,0,-15,.6,.78,2.2,mat(texWood()));box(-5.4,.78,-15.5,.36,.04,.5,mc('#ece4d0'),{collide:false});box(-5.4,.78,-14.6,.1,.12,.1,mc('#3a2a20'),{collide:false});
insegna('COMITATO PER LA SALVEZZA DEI BAMBINI',-6.95,3.3,-15,Math.PI/2,5.2,'#f0e6cc','#b8302a');
const comp=actor(C.comitato,-6.2,-15,{name:'La compagna del Comitato'});comp.face={x:1,z:0};comp.markFn=()=>Q.mamma&&!Q.cart;
const docD=Object.assign({},C.adulto,{coat:'#ece8dc',shirt:'#ece8dc',pants:'#3a3a40',hair:'#8a8278'});const doc=actor(docD,-6.2,-19.2,{name:'Il dottore'});doc.face={x:1,z:0};
for(const [x,z,d] of [[-4.6,-12.8,C.vicinaG],[-3.9,-12.5,C.bimba],[-4.6,-17.4,C.vicinaG],[-3.9,-17.7,C.carluccio]]){const a=actor(poor(d),x,z,{name:''});a.watch=false;a.face={x:-1,z:z<-15?.6:-.6};}
talk(comp,'Parla con la compagna del Comitato',async()=>{
if(!Q.mamma){await say('La compagna del Comitato','Vuoi partire pure tu, guagliò? Prima ci vuole la firma di tua madre.',C.comitato);return;}
if(Q.cart){await say('La compagna del Comitato','Il cartellino tienilo al collo e non lo levare fino a che non arrivi. Mo\' corri alla stazione!',C.comitato);return;}
cineOn();camSet([1.4,4.2,-8.6],[-5,1.2,-15]);{const c=camTo([-2.2,2.3,-12.6],[-6,1.1,-15],4000);
await N('Davanti al tavolo c\'è la fila: mamme col fazzoletto in testa, bambini scalzi. Qualcuno piange, qualcuno ride, qualcuno si fa il segno della croce.');await c;}
await say('La compagna del Comitato','Nome e cognome?',C.comitato);
await choose('Amerigo','…',['Amerigo Speranza.','Speranza Amerigo, figlio di Antonietta.'],C.amerigo);
await say('La compagna del Comitato','Quanti anni tieni?',C.comitato);
const c2=await choose('Amerigo','…',['Sette.','Sette… quasi otto!'],C.amerigo);
await say('La compagna del Comitato',c2===1?'Quasi otto, eh? Allora sei un ometto.':'Sette anni. Bene.',C.comitato);
await say('La compagna del Comitato','La firma di tua madre c\'è. Mo\' fatti guardare un momento dal dottore.',C.comitato);
await camTo([-2.6,2.3,-17],[-6.2,1.2,-19.2],1800);
await say('Il dottore','Vieni qua. Apri la bocca e di\' trentatré.',docD);
await choose('Amerigo','…',['Trentatré!','Trentatré… ma pecché?'],C.amerigo);
await say('Il dottore','Sano come un pesce. Un poco secco, ma al Nord ti rimettono in sesto. Pidocchi? Niente. Bravo.',docD);emote(doc,'heart');
await camTo([-2.2,2.3,-12.6],[-6,1.1,-15],1500);
await say('La compagna del Comitato','Questo è il tuo cartellino, col numero. Te lo appendi al collo e non lo levi fino a che non arrivi.',C.comitato);
sfxGood();emote(P,'excl');toast('Hai ricevuto il cartellino col numero');
await N('Sul cartellino c\'è un numero scritto con la penna. È la prima cosa al mondo che è solo mia.');
cineOff();Q.cart=true;guideFn=()=>[0,-42];refresh();});
const str=actor(poor(C.carluccio),3.6,-13,{name:'Lo strillone'});
talk(str,'Parla con lo strillone',async()=>{await say('Lo strillone','Edizione straordinaria! Partono i treni dei bambini per il Nord! Due lire il giornale!',C.carluccio);
const c=await choose('Amerigo','…',['Che c\'è scritto, di preciso?','Io non lo so leggere bene…'],C.amerigo);
await say('Lo strillone',c===0?'C\'è scritto che al Nord le famiglie degli operai e dei contadini aspettano i bambini di Napoli. A Modena, a Bologna, a Reggio.':'Manco io! Ma lo strillo lo stesso: chi lo compra se lo legge.',C.carluccio);found('strillone','Lo strillone');});
const com=actor(poor(C.vicinaG),-50,-24.5,{name:'La comare'});
talk(com,'Parla con la comare',async()=>{await say('La comare','Guagliò, statte accorto. Quelli del treno i bambini li portano in Russia, e non li vedi più.',C.vicinaG);
const c=await choose('Amerigo','…',['E chi ve l\'ha detto?','Maddalena dice che sono chiacchiere.'],C.amerigo);
await say('La comare',c===0?'Lo dicono tutti! Al mercato le notizie arrivano prima dei giornali.':'Maddalena, Maddalena… quella ha studiato. Ma io la guerra l\'ho vista.',C.vicinaG);
await N('Tutti parlano dei treni. Chi ha paura, chi ci spera. Io ho solo voglia di vedere com\'è fatto il Nord.');found('comare','Le voci del mercato');});
{const fx=9.5,fz=12.4;const g=new THREE.Group();for(const a of [0,2.1,4.2]){const l=new THREE.Mesh(CG.box,mc('#3a2a20'));l.scale.set(.04,1.3,.04);l.position.set(Math.cos(a)*.22,.62,Math.sin(a)*.22);l.rotation.set(Math.sin(a)*.18,0,-Math.cos(a)*.18);g.add(l);}
const cam=new THREE.Mesh(CG.box,mc('#1a1614',{rough:.4}));cam.scale.set(.32,.3,.42);cam.position.y=1.38;g.add(cam);const cl=new THREE.Mesh(CG.box,mc('#141212',{rough:1}));cl.scale.set(.42,.34,.36);cl.position.set(0,1.4,-.32);g.add(cl);g.position.set(fx,0,fz);world.add(g);wall(fx-.3,fz-.3,fx+.3,fz+.3);
const ph=actor(poor(C.castagnaro),fx-.9,fz-.3,{name:'Il fotografo'});
talk(ph,'Parla con il fotografo',async()=>{await say('Il fotografo','Una fotografia per la mamma, prima che parti? Per te è gratis, guagliò: oggi va così.',C.castagnaro);
await choose('Amerigo','…',['Va bene! Mi pettino un poco.','Ma io non so stare fermo…'],C.amerigo);await say('Il fotografo','Fermo… fermo… non respirare…',C.castagnaro);
tone(1500,.05,'square',.04);const fl=document.createElement('div');fl.style.cssText='position:fixed;inset:0;background:#fff;opacity:.9;z-index:50;pointer-events:none;transition:opacity .6s';document.body.appendChild(fl);setTimeout(()=>{fl.style.opacity='0';setTimeout(()=>fl.remove(),700);},60);
await N('Clic. Una fotografia da lasciare a mammà, così la mia faccia non se la scorda.');found('foto','La fotografia');});}
const bor=actor(Object.assign(poor(C.castagnaro),{hat:'#2a2a2e'}),-46,-4,{name:'Il borsaro nero'});
talk(bor,'Parla con il borsaro nero',async()=>{await say('Il borsaro nero','Sigarette americane, cioccolata, scatolette! Roba buona, guagliò, arrivata dal porto.',C.castagnaro);
const c=await choose('Amerigo','…',['Quanto costa la cioccolata?','Mammà dice che è roba rubata.'],C.amerigo);
await say('Il borsaro nero',c===0?'Più di quanto tieni in tasca. Torna quando ti sei fatto ricco.':'Rubata? È commercio! A Napoli, dopo la guerra, o ti arrangi o non mangi.',C.castagnaro);found('borsaro','Il mercato nero');});
const men=actor(poor(C.lavandaia),-12.5,-48.7,{name:'La donna della mensa'});men.face={x:0,z:1};
for(let i=0;i<3;i++){const a=actor(poor(pick([C.vicinaG,C.castagnaro,C.tommasino,C.bimba])),-12.3,-46.4+i*1.05,{name:''});a.watch=false;a.face={x:0,z:-1};}
talk(men,'Parla con la donna della mensa',async()=>{await say('La donna della mensa','Una scodella di minestra al giorno, per chi non ha niente. Oggi fagioli e un pezzo di pane.',C.lavandaia);
const c=await choose('Amerigo','…',['Ne posso avere un poco?','No, grazie… ho già mangiato.'],C.amerigo);
if(c===1)await N('Non è vero. Ma la fila è lunga, e ci sono bambini più piccoli di me.');
await say('La donna della mensa',c===0?'Tie\'. Mangia piano, che ti fa bene.':'Bugiardo. Tie\', piglia almeno il pane.',C.lavandaia);emote(men,'heart');emote(P,'heart');found('mensa','La mensa del popolo');});
const mur=busy(poor(C.castagnaro),-15,-37,'sweep',{fx:1,fz:0,name:'Il muratore'});
talk(mur,'Parla con il muratore',async()=>{await say('Il muratore','Pietra su pietra, guagliò. Le bombe Napoli l\'hanno buttata giù, e noi la rimettiamo in piedi con le mani.',C.castagnaro);
await choose('Amerigo','…',['Posso aiutarvi?','Quando avete finito?'],C.amerigo);await say('Il muratore','Tu pensa a crescere. Quando torni, troverai le case nuove.',C.castagnaro);found('muratore','La ricostruzione');});
ballKids(-22,-42,-16.5,-42);
spot(-21.25,-49.4,'Guarda la chiesa bombardata',async()=>{await N('La chiesa del largo non ha più il tetto. Dentro ci piove, e le rondini entrano dal rosone vuoto. Però la domenica la gente viene lo stesso.');found('chiesa','La chiesa bombardata');},()=>!Q.extra.has('chiesa'),2.4);
{const pd=Object.assign(poor(C.vicinaG),{hair:'#8a8278'});const pa=busy(pd,-1.9,-7.7,'sit',{fx:1,fz:0,seat:.47,name:'Zia Pacchiana'});sedia(-2,-7.7,Math.PI/2);
talk(pa,'Parla con Zia Pacchiana',async()=>{
if(!Q.mamma){await say('Zia Pacchiana','Amerì, ma tu non dovevi cercà le pezze? Mammà tua s\'arrabbia, e quando s\'arrabbia lei tremano pure i muri.',pd);return;}
await say('Zia Pacchiana','Allora è vero, parti col treno. Mammà tua me l\'ha detto stamattina, mentre stendeva i panni.',pd);
const c=await choose('Amerigo','…',['Lei non è contenta?','Mammà non dice mai niente.'],C.amerigo);
await say('Zia Pacchiana',c===0?'Contenta? Ha gli occhi rossi da tre giorni, e dice che è il fumo della cucina. Ma quale cucina, che il fuoco non lo accende da una settimana.':'Mammà tua parla poco perché se parla piange. È fatta così. Ma ti vuole bene più di quanto sa dire.',pd);
await say('Zia Pacchiana','Senti a me: lassù mangia tutto quello che ti danno, di\' sempre grazie, e non ti scordare di chi sei figlio.',pd);
await N('Zia Pacchiana mi mette in tasca un uovo sodo, ancora tiepido. Per il viaggio, dice. E poi si gira dall\'altra parte.');emote(pa,'heart');STATS.uovo=1;found('pacchiana','Zia Pacchiana');});}
const MEND=[["Na monetina, guagliò… pe' carità.","Non tengo niente manco io, nonno.","E allora tie', piglia 'sta benedizione. È gratis."],["Tenevo la casa a Porta Capuana. Mo' tengo 'stu muro.","Mi dispiace.","Non ti dispiacere, guagliò. Tu pensa a crescere."],["Mio marito sta ancora in prigionia, in Russia. Aspetto le lettere.","Arriveranno.","Dio t'ascolti, figlio mio."]];
[[2.15,-11.5,-1,0,C.nicola],[-29.3,-30,1,0,C.vicinaG],[-59.3,-36,1,0,C.castagnaro],[-24.3,-38,1,0,C.carmela],[-36,9.6,0,1,C.vicinaG]].forEach(([x,z,fx,fz,d],i)=>{const a=busy(poor(d),x,z,'sit',{fx,fz,seat:.05,name:i<3?'Un povero':''});
hooks.push(dt=>{if(Math.random()<dt*.06)emote(a,'drop');});
if(i<3){const [l1,c1,l2]=MEND[i];talk(a,'Parla con il povero',async()=>{await say('Un povero',l1,d);await choose('Amerigo','…',[c1],C.amerigo);await say('Un povero',l2,d);});}});
const D=[C.vicinaG,C.lavandaia,C.castagnaro,C.comitato,C.tommasino,C.bimba,C.carluccio];
for(const p of [[[-27.5,6],[-27.5,-48]],[[-56,-40],[-40,-40],[-40,-6],[-56,-6]],[[-24,-34],[-10,-34],[-10,-44],[-24,-44]],[[-62,14],[-42,14]],[[-27.5,-20],[-27.5,4]],[[-44,-36],[-58,-14]],[[-6,-29.2],[-24,-29.2]]]){const a=actor(poor(pick(D)),p[0][0],p[0][1],{name:'',speed:.8+R()*.5});a.path=p.map(q=>[q[0],q[1],1+R()*3]);a.watch=false;}
(async()=>{await waitUntil(()=>P&&P.x<-36&&P.z<-1&&P.z>-45&&!interacting&&!cineMode);
await cut(async()=>{cineOn();camSet([-33,3,-6],[-48,2,-20]);const c=camTo([-38,9,-2],[-50,1.5,-30],5200);
await N('Il mercato. Sui banchi c\'è poco e niente: castagne, qualche cipolla, scarpe vecchie, roba americana che non si sa da dove viene.');await c;
camTo([-44,6,-8],[-48,7,-24],2600);await N('Poi arriva una folata di vento dal mare e strappa tutti i panni stesi sopra il mercato. Le pezze volano dappertutto.');
await say('Una lavandaia (dal balcone)','Guagliò! Acchiappale prima che toccano terra, che sennò si sporcano e non le vende più nessuno!',C.lavandaia);cineOff();});
const got=await giocoPezze([-58,-38,-42,-6],12,55);if(!P)return;const add=Math.min(5-Q.pezze,Math.ceil(got/3));
if(add>0){Q.pezze+=add;STATS.pezze+=add;refresh();}STATS.vento=got;
toast(got+' pezze prese al volo'+(add>0?' · +'+add+' da vendere':''));
await cut(async()=>{await N(got>=9?'Le ho prese quasi tutte. La lavandaia mi tira un bacio dal balcone e me ne lascia qualcuna per mammà.':got>=5?'Qualcuna l\'ho presa, qualcuna è finita nelle pozzanghere. La lavandaia me ne lascia un paio per mammà.':'Il vento è stato più veloce di me. Però la lavandaia ride, e una pezza me la regala lo stesso.');});})();
(async()=>{await waitUntil(()=>P&&P.x>-25&&P.x<-8.5&&P.z<-31&&P.z>-51&&!interacting&&!cineMode);
await cut(async()=>{cineOn();camSet([-10,4.4,-32],[-18,3,-50]);const c=camTo([-22,7,-33],[-15,4,-52],5200);
await N('Il largo delle macerie. Qui una bomba ha preso la chiesa e mezza strada. Adesso ci giochiamo a pallone, e la mensa del popolo dà da mangiare a chi non ha niente.');await c;cineOff();});})();
}
async function chNapoli(){
buildNapoli('day');setPlayer(C.amerigo,0,13,0);setCam(7,.45);music('napoli');
const Q={pezze:0,seen:new Set(),tommy:false,stones:false,madda:false,mamma:false,cart:false,extra:new Set()};
const ready=()=>Q.pezze>=5&&Q.seen.size>=4;
hud('Capitolo 1 · Napoli, 1946',()=>[
['Raccogli le pezze da vendere ('+Q.pezze+'/5)',Q.pezze>=5],
['Gioco delle scarpe: guarda le scarpe di 4 persone ('+Math.min(4,Q.seen.size)+'/4)',Q.seen.size>=4],
...(ready()?[['Raggiungi Tommasino sugli scogli',Q.stones]]:[]),
...(Q.stones?[['Vai alla sezione del Partito, in piazza, e parla con Maddalena',Q.madda]]:[]),
...(Q.madda?[['Torna da mamma Antonietta, nel vicolo',Q.mamma]]:[]),
...(Q.mamma?[['Vai al tavolo del Comitato, nella piazzetta della fontana: fatti dare il cartellino',Q.cart]]:[]),
...(Q.cart?[['Raggiungi la stazione in fondo al vicolo',false]]:[]),
['Facoltativo: scopri la Napoli del dopoguerra ('+Q.extra.size+'/8)',Q.extra.size>=8]]);
await card({kick:'CAPITOLO 1',title:'Il vicolo e il mare',sub:'Napoli · autunno 1946',body:'<p>La guerra è finita, ma a Napoli manca ancora tutto: il lavoro, il pane, le scarpe. Il mare, invece, c\'è sempre.</p>',
notes:{libro:'Il romanzo è raccontato da Amerigo bambino, con la sua voce e i suoi modi di dire. Il «gioco delle scarpe» è una sua fissazione.',film:'Nel film questa infanzia è raccontata come un ricordo: Amerigo corre tra i vicoli dei Quartieri Spagnoli.'}});
const mamma=actor(C.mamma,-1.5,1.6,{name:'Mamma Antonietta'});
const tommy=actor(C.tommasino,5.6,21.6,{name:'Tommasino'});
const madda=actor(C.maddalena,6.2,-16,{name:'Maddalena'});
const acq=actor(C.acqua,-12,15.4,{name:"L'acquafrescaio"});
mamma.markFn=()=>Q.madda&&!Q.mamma;tommy.markFn=()=>ready()&&!Q.stones;miniMark(tommy);madda.markFn=()=>Q.stones&&!Q.madda;
ballKids(-22,12.5,-17,12.5);dog(-3,-10);
const walker=actor(C.vicinaG,-20,11,{name:'',speed:1});walker.path=[[-20,11,2],[20,11,2]];walker.watch=false;
const walker2=actor(C.comitato,1,-30,{name:'',speed:1.1});walker2.path=[[1,-30,1],[-1,-6,1]];walker2.watch=false;
cineOn();camSet([-18,46,74],[-26,2,-30]);await fade(false);
{const c=camTo([-38,34,40],[-22,2,-44],6500);await N('Napoli, autunno 1946. La guerra è finita da un anno, ma la città porta ancora addosso le bombe.');await c;}
{const c=camTo([-14,9,26],[-6,2,-10],5000);await N('Case sventrate, muri puntellati, macerie. Eppure nei vicoli si lava, si vende, si canta.');await c;}
await camTo([-6,5,30],[0,2,5],3600);await camTo(behind(0,13,0,7,4.5)[0],[0,1.1,13],1800);
await N('Mi chiamo Amerigo Speranza, ho sette anni e conosco tutte le scarpe del vicolo.','Mi chiamavo Amerigo Speranza, avevo sette anni, e conoscevo tutte le scarpe del vicolo.');
await N('Mio padre è andato in America a fare fortuna. Così dice mammà. Io non me lo ricordo, ma ogni tanto mi immagino le sue scarpe: nuove, lucide, da un punto.');
await N('Il mio gioco è semplice: scarpe buone, un punto. Scarpe rotte, zero. Io, con le mie, non ho mai fatto un punto.','Il mio gioco era semplice: scarpe buone, un punto. Scarpe rotte, zero. Io, con le mie, non facevo mai punti.');
await say('Voce di mamma (dal vicolo)','Amerì! Muoviti, va\' a cercare pezze. Se non vendiamo le pezze, stasera non si mangia.',C.mamma);
cineOff();
toast(isTouch?'Muoviti con il joystick':'Muoviti con WASD o le frecce');
[[-27.5,-14],[-56,-38],[-14.5,-29.2],[-20,-46],[-50,14]].forEach(([x,z])=>item(x,z,()=>{if(Q.pezze<5){Q.pezze++;STATS.pezze++;}toast('Pezza trovata '+Q.pezze+'/5');}));
setTimeout(()=>toast('Le pezze sono sparse a ovest del vicolo: la strada del porto, il mercato, il largo'),4500);
napoliExtra(Q);
const SH=[
{d:C.nicola,x:1.6,z:-5.6,n:"Zi' Nicola",good:false,intro:"Zi' Nicola aggiusta le scarpe di tutto il vicolo.",ok:"«Il ciabattino con le scarpe rotte, guagliò. È la regola del mestiere.»"},
{d:C.signora,x:-1.6,z:-9,n:'La signora',good:true,intro:'La signora del secondo piano esce per la messa.',ok:'«Che guardi, scugnizzo? Queste vengono da Roma.»'},
{d:C.soldato,x:-16,z:15.5,n:'Il soldato',good:true,intro:'Un soldato americano guarda il mare con le mani in tasca.',ok:'«Hey, kid! Chewing gum?» Non so cosa vuol dire, ma sorrido lo stesso.'},
{d:C.prete,x:-1.6,z:-25,n:'Don Gennaro',good:true,intro:'Don Gennaro cammina di fretta, con la tonaca che svolazza.',ok:'«Benedetto figliolo, che hai da fissare?»'},
{d:C.pesce,x:14,z:16.5,n:'Il pescivendolo',good:false,intro:'Il pescivendolo grida «Alici fresche!» con i piedi nell\'acqua del secchio.',ok:'«Le scarpe? E chi le ha mai avute, guagliò!»'}];
for(const s of SH){const a=actor(s.d,s.x,s.z,{name:s.n});a.markFn=()=>!Q.seen.has(s.n)&&Q.seen.size<4;
talk(a,'Guarda le scarpe: '+s.n,async()=>{
if(Q.seen.has(s.n)){await say(s.n,s.ok,s.d);return;}
await N(s.intro);
const c=await choose('Amerigo','Che scarpe sono?',['Scarpe buone: un punto!','Scarpe rotte, o niente scarpe: zero.'],C.amerigo);
if((c===0)===s.good){sfxGood();STATS.scarpe++;toast('Hai indovinato!');emote(P,'heart');}else{sfxBad();emote(P,'ask');await N('Guardo meglio… no, mi sbagliavo. '+(s.good?'Sono scarpe buonissime.':'Altro che scarpe buone.'));}
Q.seen.add(s.n);await say(s.n,s.ok,s.d);refresh();});}
talk(acq,"Parla con l'acquafrescaio",async()=>{await say("L'acquafrescaio",'Acqua e limone, fresca fresca! Mezza lira il bicchiere!',C.acqua);await choose('Amerigo','…',['Non ho soldi, signò.','Posso guardare i limoni?'],C.amerigo);await say("L'acquafrescaio",'Tie\', bevi. Per i guagliuni oggi è gratis. Ma non lo dire a nessuno!',C.acqua);emote(acq,'heart');emote(P,'heart');});
talk(tommy,'Parla con Tommasino',async()=>{
if(!ready()){await say('Tommasino','Amerì, prima finisci con le pezze e con le scarpe. Poi ti sfido ai rimbalzi!',C.tommasino);return;}
if(Q.stones){await say('Tommasino','Vai da Maddalena, in piazza! Se ci vai tu, ci vengo pure io.',C.tommasino);return;}
await say('Tommasino','Amerì! Hai sentito? Maddalena della sezione dice che portano i bambini al Nord. Col treno!',C.tommasino);
await choose('Amerigo','…',['E che ci andiamo a fare al Nord?','Al Nord? E chi ci conosce lassù?'],C.amerigo);
await say('Tommasino','Per mangiare! Dicono che lassù ti danno il latte, il pane bianco e pure le scarpe.',C.tommasino);
await say('Tommasino','Però la vicina del terzo piano dice che i comunisti ai bambini tagliano le mani. E poi li mandano in Russia.',C.tommasino);
const c=await choose('Amerigo','…',['E tu ci credi?','Io senza mani non ci vado!'],C.amerigo);
await say('Tommasino',c===0?'Io? Mah… Maddalena è comunista e le mani ce l\'ha tutte e due.':'Ahahah! Manco io. Però le scarpe nuove…',C.tommasino);
await say('Tommasino','Mo\' però facciamo a chi fa più rimbalzi coi sassi. Io ne ho fatti cinque!',C.tommasino);
const best=await miniGame('Rimbalzi sul mare','Premi SPAZIO (o tocca) per fermare la FORZA, poi di nuovo per l\'ANGOLO. Cerca le zone verdi!',320,190,stonesGame);
STATS.rimbalzi=best;emote(tommy,best>5?'excl':'heart');
await say('Tommasino',best>5?'Mannaggia! '+best+' rimbalzi! Va bene, hai vinto tu.':'Ahah, ho vinto io! Ma sei forte, eh.',C.tommasino);
await say('Tommasino','Vai a sentire da Maddalena, in piazza. Se ci vai tu, ci vengo pure io.',C.tommasino);Q.stones=true;refresh();});
talk(madda,'Parla con Maddalena',async()=>{
if(!Q.stones){await say('Maddalena','Ciao Amerigo. Hai visto che bella giornata? Salutami tua madre.',C.maddalena);return;}
if(Q.madda){await say('Maddalena','Vai da tua madre. Serve il suo permesso.',C.maddalena);return;}
await say('Maddalena','Amerigo Speranza! Ti stavo aspettando. Tua madre ti ha detto del treno?',C.maddalena);
const c=await choose('Amerigo','…',['Mi ha detto solo di cercare pezze.','È vero che tagliate le mani ai bambini?'],C.amerigo);
if(c===1){emote(madda,'heart');await say('Maddalena','Le mani? Guarda le mie: tutte e due al loro posto. Sono chiacchiere di chi ha paura.',C.maddalena);}
await say('Maddalena','Ci sono famiglie al Nord, in Emilia, che vi ospitano per l\'inverno. Vi danno da mangiare, vi mandano a scuola.',C.maddalena);
await say('Maddalena','Non è carità, Amerigo. È solidarietà: oggi aiutano loro, domani aiuterai tu qualcun altro.',C.maddalena);
await say('Amerigo','E… le scarpe? Mi danno pure le scarpe?',C.amerigo);
await say('Maddalena','Pure le scarpe. Nuove, e della tua misura.',C.maddalena);emote(P,'excl');
await N('Scarpe nuove. Della mia misura. Tutti i punti del mondo.','Scarpe nuove, della mia misura. Mi sembravano tutti i punti del mondo.');
await say('Maddalena','Però serve il permesso di tua madre. Vai da lei.',C.maddalena);Q.madda=true;});
talk(mamma,'Parla con mammà',async()=>{
if(!Q.madda){await say('Mamma Antonietta',Q.pezze<5?'Le pezze, Amerì. Le pezze non vengono da sole.':'Bravo. Mo\' lasciami lavorare.',C.mamma);return;}
if(Q.mamma){await say('Mamma Antonietta','Che aspetti? Il treno non aspetta a te.',C.mamma);return;}
await say('Amerigo','Mammà, Maddalena dice che col treno vado al Nord e mi danno le scarpe nuove.',C.amerigo);
await say('Mamma Antonietta','Lo so. Me l\'ha detto.',C.mamma);emote(mamma,'dots');
const c=await choose('Amerigo','…',['Mammà, io ci voglio andare.','Se non vuoi, io resto qua con te.'],C.amerigo);
await say('Mamma Antonietta',c===0?'E vai. Qua l\'inverno è lungo e la pentola è vuota.':'Restare a fare che? A morire di freddo? Tu parti.',C.mamma);
await N('Mia madre non mi abbraccia. Ha sempre le mani occupate: a lavare, a cucire, a contare i soldi che non ci sono.','Mia madre non mi abbracciò. Aveva sempre le mani occupate: a lavare, a cucire, a contare i soldi che non c\'erano.');
await say('Mamma Antonietta','Io ho già firmato. Mo\' vai al tavolo del Comitato, nella piazzetta della fontana: ti danno il cartellino col numero.',C.mamma);
Q.mamma=true;guideFn=()=>[-4.6,-15];refresh();});
await waitUntil(()=>Q.cart&&!interacting);refresh();guideFn=()=>[0,-42];
await waitUntil(()=>P.z<-40.5&&Math.abs(P.x)<3.5);
await fade(true);
buildStation('day','NAPOLI CENTRALE');setPlayer(C.amerigo,6,0,Math.PI/2);setCam(6.5,.4);
const tr=makeTrain(4);tr.g.position.set(14,-.5,5.6);
const QS={saluto:false,board:false};
hud('Capitolo 1 · Il binario',()=>[['Saluta mammà',QS.saluto],...(QS.saluto?[['Sali sul treno con gli altri bambini',QS.board]]:[])]);
const m3=actor(C.mamma,3.6,-.6,{name:'Mamma Antonietta'});m3.markFn=()=>!QS.saluto;
const mad=actor(C.maddalena,-3,1.4,{name:'Maddalena'});
for(let i=0;i<7;i++){const k=actor(vary(pick([C.mariuccia,C.carluccio,C.tommasino,C.bimba])),rr(-12,10),rr(-1.5,2.2),{name:''});k.watch=false;const mm=actor(vary(pick([C.vicinaG,C.signora,C.mamma,C.lavandaia])),k.x+rr(-1,1),k.z-.8,{name:''});mm.watch=false;if(R()<.5)hooks.push(dt=>{if(Math.random()<dt*.2)emote(R()<.5?k:mm,pick(['heart','drop','dots']));});}
cineOn();camSet([-10,5,11],[0,1.5,4]);await fade(false);steamWhistle();await camTo(behind(6,0,Math.PI/2,6.5,4)[0],[6,1.1,0],3500);
await N('La stazione è piena di gente: mamme che piangono, bambini col cartellino al collo, il treno che sbuffa come un drago.','La stazione era piena: mamme che piangevano, bambini col cartellino al collo, il treno che sbuffava come un drago.');
cineOff();
talk(mad,'Parla con Maddalena',async()=>{await say('Maddalena',QS.saluto?'Su, Amerigo, sali! Il tuo posto è nel quarto vagone.':'Saluta tua madre, Amerigo. Poi sali.',C.maddalena);});
talk(m3,'Saluta mammà',async()=>{if(QS.saluto){await say('Mamma Antonietta','Vai, Amerì.',C.mamma);return;}
await say('Mamma Antonietta','Tieni. Un pezzo di pane, pe\' \'o viaggio.',C.mamma);
const c=await choose('Amerigo','…',['Abbraccia mammà','Salutala con la mano'],C.amerigo);
if(c===0){await N('La abbraccio. Lei resta ferma, rigida come un palo. Poi, per un secondo, mi tocca i capelli.','La abbracciai. Lei restò ferma, rigida come un palo. Poi, per un secondo, mi toccò i capelli.');emote(m3,'heart');}
else{await N('Le faccio ciao con la mano. Lei annuisce, come si fa con i grandi.','Le feci ciao con la mano. Lei annuì, come si fa con i grandi.');}
await say('Mamma Antonietta','Fatti onore, Amerì.',C.mamma);QS.saluto=true;});
spot(-6.5,2.3,'Sali sul treno',async()=>{QS.board=true;},()=>QS.saluto&&!QS.board,1.8);
await waitUntil(()=>QS.board&&!interacting);
P.g.visible=false;cineOn();camSet([-2,2.4,-2.4],[8,1.4,4]);steamWhistle();
const go=trainTo(tr,80,10000);await sleep(1200);
await camTo([1,3,-3],[3.6,1.2,-.6],3000);emote(m3,'dots');
await N('Dal finestrino la vedo diventare piccola. Non si muove. Non saluta. Ma resta lì finché il treno non sparisce.','Dal finestrino la vidi diventare piccola. Non si muoveva. Non salutava. Ma restò lì finché il treno non sparì.');
await go;await fade(true);cineOff();
await fact('I treni della felicità','Tra il 1945 e il 1952 circa 70.000 bambini del Sud e delle zone più colpite dalla guerra furono ospitati da famiglie del Centro-Nord. L\'iniziativa fu organizzata dal Partito Comunista Italiano e dall\'Unione Donne Italiane (UDI).');
}
let poemSkip=null;
addEventListener('pointerdown',e=>{if(poemSkip&&e.target.id!=='cend')poemSkip();});
function poemWait(ms){return new Promise(r=>{const done=()=>{clearTimeout(t);poemSkip=null;r();};const t=setTimeout(done,ms);poemSkip=done;});}
async function poem(stanzas,o){o=o||{};const el=$('#poem'),tk=TOKEN;el.hidden=false;el.className=o.black?'black':'';
for(const st of stanzas){el.classList.remove('out');el.innerHTML='';
for(const t of st){if(tk!==TOKEN)return;const p=document.createElement('p');p.textContent=t;el.appendChild(p);void p.offsetWidth;p.classList.add('on');await poemWait(o.hold||2400+t.length*48);}
await poemWait(1800);el.classList.add('out');await sleep(2700);}
el.hidden=true;el.className='';el.innerHTML='';}
function musicFade(sec){if(!AC||!MUSG){stopMusic();return sleep(sec*1000);}const g=MUSG.gain,t=AC.currentTime;g.cancelScheduledValues(t);g.setValueAtTime(g.value,t);g.linearRampToValueAtTime(0,t+sec);
return sleep(sec*1000).then(()=>{stopMusic();g.cancelScheduledValues(AC.currentTime);g.setValueAtTime(1,AC.currentTime);});}
const GRUPPO=['Edoardo Masciantonio','Dieng Penda','Andrea Fallucchi','Manuel Aliberti'];
function credits(){return new Promise(res=>{const tk=TOKEN,el=$('#credits'),roll=$('#croll'),end=$('#cend');
roll.innerHTML='<h3>Il Treno di Amerigo</h3><div id="crmap"></div>'+
'<small>un gioco di</small><p>'+GRUPPO.join('<br>')+'</p>'+
'<small>liberamente ispirato a</small><p>«Il treno dei bambini» di Viola Ardone (Einaudi, 2019)<br>e al film di Cristina Comencini (2024)</p>'+
'<small>una nota</small><p>Il gioco si ferma a metà strada, ed è una scelta. Quello che succede dopo, ad Amerigo e alle persone che gli vogliono bene, è scritto nel libro. Andate a leggerlo.</p>'+
'<small>dedicato</small><p>Ai circa settantamila bambini che tra il 1945 e il 1952 salirono su quei treni,<br>e alle famiglie che li aspettavano dall\'altra parte.</p>'+
'<small>avvertenza</small><p>Progetto scolastico non ufficiale. Disegni, musiche e testi sono nostri; alcune scene sono semplificate o inventate per il gioco.</p>';
el.hidden=false;journey($('#crmap'),[...JSTOPS,'Il libro'],4,{delay:2.5,dur:6});end.classList.remove('on');roll.style.transition='none';roll.style.transform='none';roll.style.top='';roll.style.opacity=1;void roll.offsetHeight;
const dist=innerHeight+roll.offsetHeight,dur=Math.max(34,dist/30);
roll.style.transition='transform '+dur+'s linear';roll.style.transform='translateY('+(-dist)+'px)';
let shown=false;const show=()=>{if(shown)return;shown=true;poemSkip=null;roll.style.transition='opacity 1.2s ease';roll.style.opacity=0;
setTimeout(()=>{if(tk!==TOKEN)return;roll.innerHTML='<h3>Il Treno di Amerigo</h3><p>'+GRUPPO.join(' · ')+'</p><small>grazie per aver viaggiato con noi</small>';roll.style.transition='none';roll.style.top='50%';roll.style.transform='translateY(-60%)';void roll.offsetHeight;roll.style.transition='opacity 2.2s ease';roll.style.opacity=1;end.classList.add('on');end.focus();},1300);};
const tm=setTimeout(show,dur*1000);poemSkip=show;
end.onclick=()=>{clearTimeout(tm);poemSkip=null;el.hidden=true;end.classList.remove('on');if(tk===TOKEN)res();};});}
async function shot(build,p0,l0,p1,l1,ms){build();cineOn();camSet(p0,l0);camTo(p1,l1,ms);await fade(false);}
async function finale(){
$('#hud').hidden=true;$('#topbtns').hidden=true;hudFn=null;music('ninna');
await shot(()=>buildNapoli('sunset'),[1,3.1,6],[-.6,3,-8],[-.4,3,-12],[.4,3.2,-30],30000);
await poem([
['Questa storia l\'abbiamo letta in classe, una pagina alla volta.','All\'inizio ci sembrava lontana: un altro secolo, un\'altra fame, un\'altra Napoli.','Poi, senza accorgercene, Amerigo ha smesso di essere un personaggio.']]);
await fade(true);
let tr=buildCampagna();tr.g.position.x=-40;trainTo(tr,60,28000);cineOn();const t0=now();
hooks.push(()=>{const x=tr.g.position.x,k=Math.min(1,(now()-t0)/28);camera.position.set(x-9+k*5,1.9+k*.9,5.2);lookT.set(x-3,1.7,0);});
await fade(false);
await poem([['È diventato un bambino che conta le scarpe degli altri per non guardare le sue.','Che sale su un treno senza sapere dove porta, perché qualcuno ha deciso che era meglio così.','Che scopre che si può avere fame anche di carezze.']]);
await fade(true);
await shot(()=>buildPiazza(),[-6,3.2,10],[0,1.6,-4],[5,2.6,7],[0,1.8,-6],34000);
await poem([
['Ci siamo chiesti cosa vuol dire essere di un posto.','Se casa è dove nasci, o dove qualcuno ti aspetta con la luce accesa.','Se si può voler bene a due persone senza toglierne a nessuna.']]);
await fade(true);
await shot(()=>{const T=buildTrain();T.phase('trainNight');Object.assign(T.cur,{lamp:1.5,em:1.4,out:.55,glass:.32,sh:[0,0]});T.cur.col.set(0xffd8a0);
T.seats.forEach((s,i)=>{if(i%3||(s.k===7&&s.s>0))return;const d=vary(pick([C.bimba,C.carluccio,C.tommasino,C.mariuccia]));if(d.hair==='#8a8278')d.hair='#3a2a20';const a=actor(d,s.x,s.z,{name:'',fx:0,fz:s.f});sitDown(a,.44);a.doze=1;a.watch=false;});},
[0,1.55,-.6],[0,1.15,-12],[.15,1.4,-3.6],[-.5,1.1,-14],26000);
await poem([['Una risposta non l\'abbiamo trovata. Forse il libro non vuole darcela.','Vuole che ce la portiamo dietro, come un cappotto troppo grande che un giorno andrà bene.']]);
await fade(true);
await shot(()=>{buildStation('dusk','MODENA');box(-2.4,0,1.2,.62,.42,.28,mat('#6a4a30'),{collide:false});box(-2.4,.42,1.2,.2,.06,.06,mat('#3a2a1c'),{collide:false});tr=makeTrain(4,true);tr.g.position.set(10,-.5,5.6);
for(const x of [-8,8])lampione(x,2.7,3.2);
for(const [x,z] of [[-4.2,2.2],[-1,2.5],[2.2,2.1],[4.6,2.6]]){const a=actor(vary(pick([C.mamma,C.adulto,C.rosa,C.signora])),x,z,{name:'',fx:.25,fz:1});a.watch=false;hooks.push(()=>{if(!a.waveT&&Math.random()<.025)wave(a,2.2);});}},
[-9,2.4,-1.6],[4,1.4,4],[-6.5,2,-1],[9,1.5,5],26000);
await sleep(1200);steamWhistle();trainTo(tr,150,30000);
const mf=musicFade(12);
await poem([['Come va a finire, non ve lo diciamo.','Il treno è partito. Il resto è nelle pagine.']]);
await mf;await fade(true);cineOff();stopAmb();
await sleep(3000);
await poem([['Ci sono treni che partono una volta sola, e poi non smettono mai di partire.']],{black:true,hold:7000});
await sleep(1500);
await credits();
toTitle();
}
