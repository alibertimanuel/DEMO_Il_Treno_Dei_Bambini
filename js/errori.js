function oops(msg,tech){var o=document.getElementById('oops');if(!o||!o.hidden)return;document.getElementById('oopsMsg').textContent=msg;document.getElementById('oopsTech').textContent=tech||'';o.hidden=false;}
window.addEventListener('error',function(e){oops('Si è verificato un errore. Prova a ricaricare la pagina, oppure aprila con Chrome o Edge aggiornati.','Dettaglio: '+(e.message||'risorsa non caricata'));});
window.addEventListener('unhandledrejection',function(e){oops('Si è verificato un errore. Prova a ricaricare la pagina.','Dettaglio: '+(e.reason&&e.reason.message||e.reason));});
