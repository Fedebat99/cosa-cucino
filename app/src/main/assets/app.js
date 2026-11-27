{
/* Se l'app è solo tua, puoi scrivere qui la tua chiave Gemini tra le virgolette:
   così non dovrai inserirla nell'app. Attenzione: chi vede il codice può leggerla. */
const CHIAVE_PREDEFINITA="";

const $=s=>document.querySelector(s);
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const store={get(k,d){try{const v=localStorage.getItem(k);return v==null?d:JSON.parse(v)}catch(e){return d}},set(k,v){try{localStorage.setItem(k,JSON.stringify(v))}catch(e){}}};
const num=v=>{const n=parseFloat(String(v??'').replace(',','.'));return isFinite(n)?n:0};
const norm=s=>String(s||'').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g,'').replace(/\s+/g,' ').trim();
const fmt=n=>{const r=Math.round(n*10)/10;return String(r).replace('.',',')};
const PLATE='<svg aria-hidden="true" viewBox="540 200 1500 1040"><g class="fork" fill="#FFFFFF"><rect x="597" y="334" width="124" height="256" rx="24"/><rect x="635" y="560" width="48" height="545" rx="24"/></g><g fill="#0A0A0A"><rect x="621" y="300" width="14" height="190" rx="7"/><rect x="683" y="300" width="14" height="190" rx="7"/></g><path class="knife" d="M1980 360 V1081 a24 24 0 0 1 -48 0 V765 h-19 a24 24 0 0 1 -24 -24 V405 a71 71 0 0 1 67 -71 a24 24 0 0 1 24 26 Z" fill="#FFFFFF"/><circle cx="1288" cy="719" r="477" fill="#FFFFFF"/><circle cx="1288" cy="719" r="279" fill="#E3E3E3"/><g class="orbit"><circle cx="1608" cy="356" r="119" fill="#0A0A0A"/><circle cx="1608" cy="356" r="99" fill="#F4B6C6"/></g></svg>';
const POT='<svg aria-hidden="true" class="potsvg" viewBox="780 160 1016 1110"><path d="M966 896 H1610 A322 322 0 0 1 966 896 Z" fill="#E3170A"/><rect x="836" y="896" width="110" height="67" rx="14" fill="#E3170A"/><rect x="1630" y="896" width="110" height="67" rx="14" fill="#E3170A"/><circle class="b b1" cx="1288" cy="724" r="129" fill="#FFD900"/><circle class="b b2" cx="1288" cy="455" r="86" fill="#F0A21A"/><circle class="b b3" cx="1288" cy="263" r="54" fill="#F4B6C6"/></svg>';
const ARTS={magazzino:'<svg viewBox="0 0 200 200" aria-hidden="true"><rect x="22" y="96" width="156" height="9" rx="4.5" fill="#FFFFFF"/><rect x="22" y="166" width="156" height="9" rx="4.5" fill="#FFFFFF"/><g class="j1"><rect x="34" y="46" width="34" height="50" rx="9" fill="#FFD900"/><rect x="38" y="38" width="26" height="10" rx="5" fill="#FFFFFF"/></g><g class="j2"><circle cx="96" cy="78" r="18" fill="#F0A21A"/></g><g class="j3"><rect x="126" y="56" width="40" height="40" rx="10" fill="#F4B6C6"/><rect x="132" y="48" width="28" height="10" rx="5" fill="#FFFFFF"/></g><g class="j4"><rect x="36" y="124" width="46" height="42" rx="10" fill="#E3170A"/><rect x="44" y="116" width="30" height="10" rx="5" fill="#FFFFFF"/></g><g class="j5"><circle cx="108" cy="151" r="15" fill="#FFD900"/><circle cx="138" cy="151" r="15" fill="#F0A21A"/></g><g class="j6"><circle cx="165" cy="155" r="10" fill="#F4B6C6"/></g></svg>',crea:'<svg aria-hidden="true" viewBox="780 160 1016 1110"><path d="M966 896 H1610 A322 322 0 0 1 966 896 Z" fill="#E3170A"/><rect x="836" y="896" width="110" height="67" rx="14" fill="#E3170A"/><rect x="1630" y="896" width="110" height="67" rx="14" fill="#E3170A"/><circle class="b b1" cx="1288" cy="724" r="129" fill="#FFD900"/><circle class="b b2" cx="1288" cy="455" r="86" fill="#F0A21A"/><circle class="b b3" cx="1288" cy="263" r="54" fill="#F4B6C6"/></svg>',salvate:'<svg aria-hidden="true" viewBox="900 340 780 760"><rect class="pg1" x="946" y="596" width="320" height="462" rx="40" fill="#FFFFFF"/><rect class="pg2" x="1310" y="596" width="321" height="462" rx="40" fill="#FFFFFF"/><path class="heart" d="M1157 704 L1010 505 A88 88 0 0 1 1157 420 A88 88 0 0 1 1304 505 Z" fill="#F4B6C6"/><circle class="d1" cx="1417" cy="520" r="44" fill="#E3170A"/><circle class="d2" cx="1524" cy="467" r="42" fill="#FFD900"/></svg>'};
const TITLES={magazzino:'Il mio magazzino',crea:'Crea ricette',salvate:'Ricette salvate'};
const emptyArt=t=>`<div class="emptyart"><div class="pl">${PLATE}</div><p>${t}</p></div>`;
const uid=()=>Date.now().toString(36)+Math.random().toString(36).slice(2,7);

/* ---------- stato ---------- */
let mag=store.get('cc-mag',null);
if(!Array.isArray(mag))mag=[{id:uid(),n:'uova',q:6,u:'pz'},{id:uid(),n:'zucchine',q:400,u:'g'},{id:uid(),n:'parmigiano',q:150,u:'g'},{id:uid(),n:'pasta',q:500,u:'g'},{id:uid(),n:'latte',q:1,u:'l'}];
let saved=store.get('cc-saved',[]);if(!Array.isArray(saved))saved=[];
const saveMag=()=>{store.set('cc-mag',mag);$('#c-mag').textContent=mag.length;usesLine()};
const saveSaved=()=>{store.set('cc-saved',saved);$('#c-sav').textContent=saved.length};

/* ---------- schede ---------- */
const VIEWS=['magazzino','crea','salvate'];
let firstRoute=true,tx='50%',ty='10%';
document.addEventListener('click',e=>{const a=e.target.closest('a[href^="#"]');if(a){const r=a.getBoundingClientRect();tx=Math.round(r.left+r.width/2)+'px';ty=Math.round(r.top+r.height/2)+'px'}},true);
function showTrans(v){
  if(matchMedia('(prefers-reduced-motion: reduce)').matches)return;
  const t=$('#trans');t.classList.remove('on');void t.offsetWidth;
  t.style.setProperty('--x',tx);t.style.setProperty('--y',ty);
  t.querySelector('.tart').innerHTML=`<span class="art-${v==='magazzino'?'dispensa':v==='crea'?'pentola':'libro'}" style="display:block;width:100%;height:100%">${ARTS[v]}</span>`;
  t.querySelector('.tname').textContent=TITLES[v];
  t.classList.add('on');clearTimeout(showTrans.tm);showTrans.tm=setTimeout(()=>t.classList.remove('on'),950);
  tx='50%';ty='10%';
}
function route(){
  const h=location.hash.slice(1),v=VIEWS.includes(h)?h:'magazzino';
  if(!firstRoute)showTrans(v);firstRoute=false;
  scrollTo(0,0);
  VIEWS.forEach(x=>{$('#v-'+x).hidden=x!==v;const a=document.querySelector(`.tabs a[data-t="${x}"]`);if(x===v)a.setAttribute('aria-current','page');else a.removeAttribute('aria-current')});
  if(v==='salvate')renderSaved();
  if(v==='crea')usesLine();
}
addEventListener('hashchange',route);

/* ---------- magazzino ---------- */
const QUICK=[['uova',6,'pz'],['pasta',500,'g'],['riso',500,'g'],['pomodori',500,'g'],['cipolla',2,'pz'],['aglio',1,'pz'],['patate',1,'kg'],['petto di pollo',400,'g'],['tonno',2,'pz'],['mozzarella',125,'g'],['yogurt greco',500,'g'],['latte',1,'l'],['avena',500,'g'],['ceci',400,'g'],['pane',300,'g'],['limone',2,'pz']];
function renderMag(){
  const q=norm($('#cerca-mag').value);
  const list=mag.filter(x=>!q||norm(x.n).includes(q));
  $('#inv').innerHTML=mag.length?(list.length?list.map(x=>{
    const low=(x.u==='pz'&&x.q<=1)||((x.u==='g'||x.u==='ml')&&x.q<=50)||((x.u==='kg'||x.u==='l')&&x.q<=0.05);
    return `<div class="item${low?' low':''}" data-id="${esc(x.id)}">
      <span class="nm">${esc(x.n)}</span>
      <input type="number" inputmode="decimal" min="0" step="any" value="${esc(x.q)}" aria-label="Quantità di ${esc(x.n)}" data-f="q">
      <select aria-label="Unità di ${esc(x.n)}" data-f="u">${['g','kg','ml','l','pz'].map(u=>`<option${u===x.u?' selected':''}>${u}</option>`).join('')}</select>
      <button type="button" class="del" aria-label="Togli ${esc(x.n)}">×</button>
    </div>`}).join(''):'<div class="emptybox">Nessun ingrediente con questo nome.</div>'):emptyArt('Il magazzino è vuoto. Aggiungi qui sopra quello che hai in casa.');
  const have=new Set(mag.map(x=>norm(x.n)));
  $('#sugg').innerHTML=QUICK.filter(([n])=>!have.has(n)).slice(0,10).map(([n,q,u])=>`<button type="button" data-n="${esc(n)}" data-q="${q}" data-u="${u}">+ ${esc(n)} ${esc(fmt(q))} ${esc(u)}</button>`).join('');
  saveMag();
}
function addItem(n,q,u){
  n=n.trim().toLowerCase();if(!n)return;
  const ex=mag.find(x=>norm(x.n)===norm(n));
  if(ex){
    const b=conv(q,u,ex.u);
    if(b!=null)ex.q=Math.round((num(ex.q)+b)*100)/100;else{ex.q=q;ex.u=u}
  }else mag.unshift({id:uid(),n,q,u});
  renderMag();
}
$('#fadd').addEventListener('submit',e=>{
  e.preventDefault();
  const names=$('#nome').value.split(/[,;]/).map(s=>s.trim()).filter(Boolean);
  const q=num($('#qta').value)||( $('#unita').value==='pz'?1:0),u=$('#unita').value;
  names.forEach(n=>addItem(n,q,u));
  $('#nome').value='';$('#qta').value='';$('#nome').focus();
});
$('#sugg').addEventListener('click',e=>{const b=e.target.closest('button[data-n]');if(b)addItem(b.dataset.n,num(b.dataset.q),b.dataset.u)});
$('#inv').addEventListener('change',e=>{
  const row=e.target.closest('.item');if(!row)return;const it=mag.find(x=>x.id===row.dataset.id);if(!it)return;
  if(e.target.dataset.f==='q')it.q=Math.max(0,num(e.target.value));
  if(e.target.dataset.f==='u')it.u=e.target.value;
  renderMag();
});
$('#inv').addEventListener('click',e=>{
  const b=e.target.closest('.del');if(!b)return;const id=b.closest('.item').dataset.id;
  const prev=JSON.parse(JSON.stringify(mag));const it=mag.find(x=>x.id===id);
  mag=mag.filter(x=>x.id!==id);renderMag();toast(`Tolto ${it?it.n:''}`,()=>{mag=prev;renderMag()});
});
$('#cerca-mag').addEventListener('input',renderMag);
$('#svuota-mag').addEventListener('click',()=>{if(!mag.length)return;const prev=mag;mag=[];renderMag();toast('Magazzino svuotato',()=>{mag=prev;renderMag()})});

/* unità */
const BASE={g:['g',1],kg:['g',1000],ml:['ml',1],l:['ml',1000],pz:['pz',1]};
function conv(q,from,to){const a=BASE[from],b=BASE[to];if(!a||!b)return null;
  if(a[0]===b[0])return q*a[1]/b[1];
  if((a[0]==='g'&&b[0]==='ml')||(a[0]==='ml'&&b[0]==='g'))return q*a[1]/b[1];
  return null}

/* ---------- toast con annulla ---------- */
let undoFn=null,tt=null;
function toast(msg,undo){
  $('#toastmsg').textContent=msg;undoFn=undo||null;$('#undo').hidden=!undo;$('#toast').hidden=false;
  clearTimeout(tt);tt=setTimeout(()=>{$('#toast').hidden=true;undoFn=null},6000);
}
$('#undo').addEventListener('click',()=>{if(undoFn)undoFn();undoFn=null;$('#toast').hidden=true});

/* ---------- calorie e filtri ---------- */
const kc=$('#kcal');
function showK(){$('#kcalv').textContent=kc.value;document.querySelectorAll('#presets button').forEach(b=>b.setAttribute('aria-pressed',b.dataset.k===kc.value?'true':'false'));store.set('cc-kcal',kc.value)}
kc.value=store.get('cc-kcal','600');kc.addEventListener('input',showK);
$('#presets').addEventListener('click',e=>{const b=e.target.closest('button[data-k]');if(b){kc.value=b.dataset.k;showK()}});
showK();
['pasto','tempo','dieta','manca','stile'].forEach(id=>{const el=$('#'+id),v=store.get('cc-'+id,null);if(v!=null)el.value=v;el.addEventListener('change',()=>store.set('cc-'+id,el.value))});
function syncMeals(){document.querySelectorAll('#meals button').forEach(b=>b.setAttribute('aria-pressed',b.dataset.p===$('#pasto').value?'true':'false'))}
$('#meals').addEventListener('click',e=>{const b=e.target.closest('button[data-p]');if(!b)return;const s=$('#pasto');s.value=b.dataset.p;s.dispatchEvent(new Event('change'));syncMeals()});
syncMeals();
function burst(el,cols){
  if(matchMedia('(prefers-reduced-motion: reduce)').matches)return;
  const r=el.getBoundingClientRect(),cx=r.left+r.width/2,cy=r.top+r.height/2;
  for(let i=0;i<12;i++){const d=document.createElement('span');d.className='burst';const s=6+Math.random()*8;d.style.cssText=`left:${cx-s/2}px;top:${cy-s/2}px;width:${s}px;height:${s}px;background:${cols[i%cols.length]}`;document.body.appendChild(d);
    const a=Math.PI*2*i/12+Math.random()*.4,dist=40+Math.random()*40;
    d.animate([{transform:'translate(0,0) scale(1)',opacity:1},{transform:`translate(${Math.cos(a)*dist}px,${Math.sin(a)*dist}px) scale(.3)`,opacity:0}],{duration:650,easing:'cubic-bezier(.2,.8,.4,1)'}).onfinish=()=>d.remove()}
}
function usesLine(){
  const avail=mag.filter(x=>num(x.q)>0);
  $('#uses').innerHTML=avail.length?`Userò il tuo magazzino: ${avail.length} ingredienti (${esc(avail.slice(0,6).map(x=>x.n).join(', '))}${avail.length>6?'…':''}). <a href="#magazzino">Modifica</a>`:'Il magazzino è vuoto: <a href="#magazzino">aggiungi i tuoi ingredienti</a> prima di creare le ricette.';
}

/* ---------- motore AI ---------- */
let claudeSample=null;
try{if(window.claude&&window.claude.use)window.claude.use('sample').then(s=>{claudeSample=s;badge()}).catch(()=>{})}catch(e){}
const getKey=()=>store.get('cc-key','')||CHIAVE_PREDEFINITA;
function badge(){
  const ok=!!(claudeSample||getKey());const b=$('#badge');
  b.textContent=ok?(claudeSample&&!getKey()?'attivo in Claude':'attivo'):'da impostare';b.className='badge '+(ok?'ok':'no');
  if(!ok)$('#set').open=true;return ok;
}
$('#key').value=store.get('cc-key','');
$('#savekey').addEventListener('click',()=>{
  const k=$('#key').value.trim();store.set('cc-key',k);store.set('cc-models',null);
  $('#keymsg').textContent=k?'Chiave salvata su questo dispositivo. Ora premi “Crea ricette”.':'Chiave rimossa.';
  if(badge()&&k)$('#set').open=false;
});
badge();

const API='https://generativelanguage.googleapis.com/v1beta/';
let ctl=null;
async function fetchT(url,opts,ms){
  const own=new AbortController();const t=setTimeout(()=>own.abort('timeout'),ms);
  const onStop=()=>own.abort('stop');if(ctl)ctl.signal.addEventListener('abort',onStop);
  try{return await fetch(url,{...opts,signal:own.signal})}
  catch(e){const err=new Error(own.signal.reason==='stop'?'stop':own.signal.reason==='timeout'?'timeout':'rete');err.kind=err.message;throw err}
  finally{clearTimeout(t);if(ctl)ctl.signal.removeEventListener('abort',onStop)}
}
async function gErr(r){try{const j=await r.json();return (j.error&&j.error.message)||''}catch(e){return ''}}
const keyBad=(s,msg)=>s===401||s===403||(s===400&&/api key|api_key/i.test(msg||''));
async function models(){
  const cached=store.get('cc-models',null);if(Array.isArray(cached)&&cached.length)return cached;
  let list=[];
  try{
    const r=await fetchT(API+'models?pageSize=200',{headers:{'x-goog-api-key':getKey()}},20000);
    if(!r.ok){const msg=await gErr(r);if(keyBad(r.status,msg)){const e=new Error('key');e.status=r.status;e.detail=msg;throw e}}
    const j=await r.json();
    list=(j.models||[]).filter(m=>(m.supportedGenerationMethods||[]).includes('generateContent'))
      .map(m=>m.name.replace('models/','')).filter(n=>/^gemini-\d+(\.\d+)?-flash(-lite)?$/.test(n))
      .sort((a,b)=>{const la=a.endsWith('lite'),lb=b.endsWith('lite');if(la!==lb)return la?1:-1;return parseFloat(b.split('-')[1])-parseFloat(a.split('-')[1])});
  }catch(e){if(e.message==='key'||e.message==='stop')throw e}
  list=[...new Set([...list,'gemini-2.5-flash','gemini-2.5-flash-lite'])];
  store.set('cc-models',list);return list;
}
/* ordine: prima il modello che ha funzionato l'ultima volta, poi i modelli leggeri e quelli stabili (meno affollati), per ultimi i più nuovi */
function ordered(list){
  const ok=store.get('cc-okmodel','');
  const lite=list.filter(x=>x.endsWith('-lite')),full=list.filter(x=>!x.endsWith('-lite'));
  const stable=full.filter(x=>x==='gemini-2.5-flash');
  const others=full.filter(x=>x!=='gemini-2.5-flash');
  const seq=[ok,lite[0],...stable,lite[1],...others.slice().reverse(),...lite.slice(2)].filter(Boolean);
  return [...new Set(seq)].filter(x=>list.includes(x)||x===ok);
}
async function askGemini(prompt,onTry){
  const list=ordered(await models());let last=null;const log=[];
  for(const m of list.slice(0,7)){
    if(onTry)onTry(m);
    const t0=Date.now();
    try{
      const r=await fetchT(API+'models/'+encodeURIComponent(m)+':generateContent',{method:'POST',headers:{'Content-Type':'application/json','x-goog-api-key':getKey()},
        body:JSON.stringify({contents:[{parts:[{text:prompt}]}],generationConfig:{responseMimeType:'application/json',temperature:1}})},100000);
      const secs=Math.round((Date.now()-t0)/1000);
      if(r.ok){
        const j=await r.json();const c=j.candidates&&j.candidates[0];
        const t=((c&&c.content&&c.content.parts)||[]).map(p=>p.text||'').join('');
        if(t){store.set('cc-okmodel',m);return t}
        const why=(c&&c.finishReason)||(j.promptFeedback&&j.promptFeedback.blockReason)||'risposta vuota';
        log.push(`${m}: ${why} (${secs} s)`);last={status:0};continue;
      }
      const msg=await gErr(r);log.push(`${m}: errore ${r.status} ${msg.slice(0,120)} (${secs} s)`);last={status:r.status,detail:msg};
      if(keyBad(r.status,msg))break;
      if(r.status===404)store.set('cc-models',list.filter(x=>x!==m));
      if(r.status===503||r.status===429)await new Promise(res=>setTimeout(res,800));
    }catch(e){
      if(e.kind==='stop')throw e;
      log.push(`${m}: ${e.kind==='timeout'?'nessuna risposta in 100 s':'connessione non riuscita'}`);last={status:e.kind==='timeout'?'timeout':'rete'};
    }
  }
  const e=new Error('gemini');e.status=last&&last.status;e.detail=(last&&last.detail)||'';e.log=log;throw e;
}
async function diagnose(){
  const out=$('#diag');out.textContent='Controllo in corso…';
  if(!getKey()){out.textContent='Nessuna chiave salvata.';return}
  const lines=[];ctl=new AbortController();
  try{
    store.set('cc-models',null);
    const t0=Date.now();const list=await models();
    lines.push(`Chiave valida. Modelli disponibili: ${list.slice(0,4).join(', ')} (${Math.round((Date.now()-t0)/1000)} s)`);
    out.textContent=lines.join('\n')+'\nProvo una risposta breve…';
    const t1=Date.now();
    const txt=await askGemini('Rispondi solo con questo JSON: {"ok":true}',m=>{out.textContent=lines.join('\n')+`\nProvo ${m}…`});
    lines.push(`Risposta ricevuta da ${store.get('cc-okmodel','?')} in ${Math.round((Date.now()-t1)/1000)} s: ${txt.slice(0,40)}`);
    lines.push('Tutto funziona.');
  }catch(e){
    if(e.message==='key')lines.push('La chiave non è valida o non è abilitata: '+(e.detail||''));
    else{lines.push('Problema: '+explain(e));if(e.log)lines.push(...e.log)}
  }finally{ctl=null}
  out.textContent=lines.join('\n');
}
function explain(e){
  const s=e&&e.status;
  if(e&&e.kind==='stop')return 'richiesta annullata.';
  if(e&&e.message==='key'||keyBad(s,e&&e.detail))return 'la chiave Gemini non funziona. Controlla di averla copiata tutta in “Collegamento AI”.';
  if(s===429)return 'hai superato il limite gratuito di Google per ora: aspetta qualche minuto (a volte fino a domani) e riprova.';
  if(s==='timeout')return 'Google non ha risposto in tempo. Riprova: spesso alla seconda volta va.';
  if(s==='rete')return 'il telefono non riesce a raggiungere Google. Controlla la connessione internet.';
  if(s===500||s===503)return 'i server di Google sono molto occupati in questo momento: riprova tra qualche minuto.';
  if(e&&e.message==='json')return 'la risposta dell\'AI era incompleta. Riprova.';
  if(e&&e.message==='vuoto')return 'l\'AI non ha trovato ricette con questi vincoli. Prova ad ammettere qualche ingrediente da comprare o ad alzare le calorie.';
  return 'non sono riuscito a creare le ricette. Riprova tra poco.';
}

let shown=[],recs=[];
function prompt(){
  const t=$('#tempo').value,k=kc.value,m=$('#manca').value,wish=$('#desiderio').value.trim();
  const inv=mag.filter(x=>num(x.q)>0).map(x=>`${x.n}: ${fmt(num(x.q))} ${x.u}`).join('; ');
  const pasto=$('#pasto').value,dieta=$('#dieta').value,stile=$('#stile').value;
  return `Sei un cuoco italiano e nutrizionista pratico. Inventa 3 ricette NUOVE e diverse tra loro, per UNA SOLA PERSONA (una porzione).

IL MIO MAGAZZINO (ingrediente: quantità disponibile): ${inv}.
Ho sempre anche sale, pepe, olio extravergine d'oliva e acqua.

REGOLE OBBLIGATORIE, da rispettare tutte:
1. CALORIE: ogni ricetta deve dare in totale ${k} kcal (tra ${Math.round(k*0.95)} e ${Math.round(k*1.05)}). Scegli i grammi di ogni ingrediente per arrivarci. Conta anche l'olio.
2. TIPO DI PIATTO: ${pasto==='qualsiasi'?'qualsiasi':pasto==='dolce'?'un DOLCE (dessert)':pasto}.
3. TEMPO: ${t==='qualsiasi'?'nessun limite':`al massimo ${t} minuti in tutto, cottura compresa`}.
4. ESIGENZE ALIMENTARI: ${dieta==='nessuna'?'nessuna':dieta+'. Non usare nessun ingrediente che non la rispetti, anche se è nel magazzino'}.
5. DA COMPRARE: ${m==='0'?'NESSUN ingrediente: usa solo il magazzino più sale, pepe, olio e acqua':`al massimo ${m} ingredienti che non sono nel magazzino, segnati con "da_comprare": true`}.
6. QUANTITÀ: non usare mai più della quantità che ho di un ingrediente. Non serve usare tutto il magazzino.
7. STILE: ${stile}.${wish?`\n8. RICHIESTA PARTICOLARE: ${wish}.`:''}
${shown.length?`Non ripetere queste ricette già proposte e cambia tipo di piatto: ${shown.join('; ')}.\n`:''}
Se le regole insieme rendono impossibile una ricetta (per esempio un dolce vegano senza ingredienti adatti), proponi comunque la soluzione più vicina e spiega cosa non hai potuto rispettare nel campo "nota". Altrimenti lascia "nota" vuota.
Procedimento in massimo 6 passaggi brevi e chiari.
Per ogni ingrediente indica quantità a crudo come numero "q" e unità "u" tra "g", "ml" o "pz", e le kcal di quella quantità con valori realistici. Per sale, pepe e spezie usa q 0 e u "q.b.". Usa per "nome" lo stesso nome del mio magazzino quando l'ingrediente viene da lì.
Rispondi SOLO con JSON valido, senza testo e senza blocchi di codice:
{"ricette":[{"nome":"","descrizione":"una frase invitante","tempo":"20 min","difficolta":"facile","ingredienti":[{"nome":"","q":0,"u":"g","kcal":0,"da_comprare":false}],"proteine_g":0,"carboidrati_g":0,"grassi_g":0,"passaggi":["passo 1"],"consiglio":"un trucco utile","nota":""}]}
Tutto in italiano.`;
}

/* ---------- verifica: la ricetta rispetta le impostazioni? ---------- */
const BASICS=['sale','pepe','olio','acqua','spezie','erbe','cannella','vaniglia','noce moscata','origano','basilico','prezzemolo','rosmarino','peperoncino','aceto','lievito','bicarbonato'];
const NOVEG=['carne','pollo','tacchino','manzo','vitello','maiale','prosciutto','speck','salame','guanciale','pancetta','salsiccia','wurstel','bresaola','tonno','salmone','pesce','merluzzo','gamber','acciugh','alici','vongol','cozz'];
const ANIMAL=['uov','latte','burro','formaggio','parmigiano','grana','pecorino','mozzarella','ricotta','mascarpone','yogurt','panna','miele','stracchino','gelatina'];
const GLUTEN=['pasta','pane','farina','couscous','cous cous','orzo','farro','seitan','biscott','pangrattato','crackers','grissini','piadina','pizza','savoiardi','semola'];
const LACTO=['latte','burro','formaggio','parmigiano','grana','pecorino','mozzarella','ricotta','mascarpone','yogurt','panna','stracchino'];
const hasAny=(n,list)=>list.some(w=>n.includes(w));
function findMag(name){const k=norm(name);return mag.find(m=>norm(m.n)===k)||mag.find(m=>{const n=norm(m.n);return n.length>2&&(k.includes(n)||n.includes(k))})}
function verify(r,set){
  const warns=[];let fixed='';
  const ing=Array.isArray(r.ingredienti)?r.ingredienti:[];
  /* ingredienti non presenti nel magazzino: vanno comprati */
  ing.forEach(x=>{const n=norm(x.nome);if(!x.da_comprare&&!findMag(x.nome)&&!hasAny(n,BASICS)&&num(x.q)>0)x.da_comprare=true});
  /* calorie: se l'AI ha sbagliato di poco, adatto le dosi in proporzione */
  const sum=ing.reduce((a,x)=>a+num(x.kcal),0),target=set.kcal;
  if(sum>0&&Math.abs(sum-target)/target>0.06){
    const f=target/sum;
    if(f>=0.6&&f<=1.6){
      ing.forEach(x=>{if(num(x.q)>0){x.q=x.u==='pz'?Math.max(0.5,Math.round(num(x.q)*f*2)/2):Math.round(num(x.q)*f)}x.kcal=Math.round(num(x.kcal)*f)});
      ['proteine_g','carboidrati_g','grassi_g'].forEach(k=>r[k]=Math.round(num(r[k])*f));
      fixed=`Dosi adattate da ${Math.round(sum)} a circa ${target} kcal`;
    }else warns.push(`${Math.round(sum)} kcal invece di ${target}`);
  }
  /* quantità oltre il magazzino */
  ing.forEach(x=>{if(x.da_comprare||!num(x.q))return;const it=findMag(x.nome);if(!it)return;const d=conv(num(x.q),x.u||'g',it.u);if(d!=null&&d>num(it.q)*1.001)warns.push(`${x.nome}: servono ${qtxt(x)}, ne hai ${fmt(num(it.q))} ${it.u}`)});
  /* ingredienti da comprare */
  const buy=ing.filter(x=>x.da_comprare).length;
  const nomi=ing.filter(x=>x.da_comprare).map(x=>x.nome).join(', ');
  if(buy>set.manca)warns.push(set.manca===0?`da comprare: ${nomi} (avevi scelto solo il magazzino)`:`da comprare: ${nomi} (massimo ${set.manca})`);
  /* tempo */
  const tm=parseInt(String(r.tempo||'').replace(/[^0-9]/g,''))||0,ore=/or[ae]/i.test(r.tempo||'');const mins=ore?tm*60:tm;
  if(set.tempo!=='qualsiasi'&&mins>+set.tempo+5)warns.push(`richiede ${r.tempo} (limite ${set.tempo} min)`);
  /* esigenze */
  const names=ing.map(x=>norm(x.nome));
  const bad=list=>names.filter(n=>hasAny(n,list)&&!/vegetal|vegan|senza lattosio|senza glutine|di riso|di mais|di soia|di avena|di mandorl|di cocco|di ceci/.test(n));
  let viol=[];
  if(set.dieta==='vegetariana')viol=bad(NOVEG);
  if(set.dieta==='vegana')viol=bad([...NOVEG,...ANIMAL]);
  if(set.dieta==='senza glutine')viol=bad(GLUTEN);
  if(set.dieta==='senza lattosio')viol=bad(LACTO);
  if(viol.length)warns.push(`non adatto a dieta ${set.dieta}: ${[...new Set(viol)].join(', ')}`);
  if(r.nota)warns.push(String(r.nota));
  r.check={warns,fixed};
  return r;
}

/* ---------- schede ricetta ---------- */
const qtxt=x=>x.u==='q.b.'||(!num(x.q)&&!x.quantita)?'q.b.':x.quantita&&!num(x.q)?x.quantita:`${fmt(num(x.q))} ${x.u||'g'}`;
const total=r=>Math.round((r.ingredienti||[]).reduce((a,x)=>a+num(x.kcal),0));
const isSaved=r=>saved.some(s=>s.id===r.id);
function card(r,mode){
  const ing=Array.isArray(r.ingredienti)?r.ingredienti:[];
  const sum=total(r),target=num(r.target)||+kc.value,real=Math.round(sum/target*100),pct=Math.min(100,real);
  const sv=isSaved(r);
  return `<article class="rec" data-id="${esc(r.id)}">
    <div class="rtop"><div><h3>${esc(r.nome)}</h3>
    <div class="meta"><span>${esc(r.tempo)}</span><span>${esc(r.difficolta)}</span><span>1 persona</span></div></div>
    <div class="kdisc" aria-label="${esc(sum)} chilocalorie"><div><b>${esc(sum)}</b><small>kcal</small></div></div></div>
    ${mode==='saved'&&r.data?`<div class="date">Salvata il ${esc(new Date(r.data).toLocaleDateString('it-IT',{day:'numeric',month:'long'}))}${r.cucinata?` · cucinata ${esc(r.cucinata)} ${r.cucinata===1?'volta':'volte'}`:''}</div>`:''}
    <p>${esc(r.descrizione)}</p>
    ${r.check?(r.check.warns.length?`<div class="chk warn"><b>Attenzione</b>${r.check.warns.map(w=>`<div>${esc(w)}</div>`).join('')}</div>`:`<div class="chk ok">Rispetta le tue impostazioni${r.check.fixed?` · ${esc(r.check.fixed)}`:''}</div>`):''}
    <div class="goal"><span>${esc(real)}% del tuo obiettivo di ${esc(target)} kcal</span>
    <div class="bar" aria-hidden="true"><i style="width:${pct}%"></i></div></div>
    <div class="macro"><div><span><b>${esc(Math.round(num(r.proteine_g)))} g</b>proteine</span></div><div><span><b>${esc(Math.round(num(r.carboidrati_g)))} g</b>carboidrati</span></div><div><span><b>${esc(Math.round(num(r.grassi_g)))} g</b>grassi</span></div></div>
    <table><tbody>${ing.map(x=>`<tr class="${x.da_comprare?'miss':''}"><td>${esc(x.nome)}</td><td class="g">${esc(qtxt(x))}</td><td class="n">${esc(Math.round(num(x.kcal)))} kcal</td></tr>`).join('')}</tbody></table>
    ${ing.some(x=>x.da_comprare)?'<div class="legend">In rosso: da comprare</div>':''}
    <details class="steps"><summary>Procedimento</summary>
      <ol>${(Array.isArray(r.passaggi)?r.passaggi:[]).map(p=>`<li>${esc(p)}</li>`).join('')}</ol>
      ${r.consiglio?`<div class="tip"><b>Consiglio:</b> ${esc(r.consiglio)}</div>`:''}
    </details>
    <div class="acts">
      ${mode==='saved'?'<button type="button" class="btn-ghost sm" data-a="rimuovi">Rimuovi</button>':`<button type="button" class="sm ${sv?'saved-on':'btn-bas'}" data-a="salva" aria-pressed="${sv}">${sv?'Salvata ✓':'Mi piace, salvala'}</button>`}
      <button type="button" class="btn-ghost sm" data-a="cucinata">L'ho cucinata</button>
      <button type="button" class="btn-ghost sm" data-a="copia">Copia</button>
    </div>
  </article>`;
}
function asText(r){
  const ing=(r.ingredienti||[]).map(x=>`- ${x.nome}: ${qtxt(x)} (${Math.round(num(x.kcal))} kcal)`).join('\n');
  const st=(r.passaggi||[]).map((p,i)=>`${i+1}. ${p}`).join('\n');
  return `${r.nome} (1 persona, circa ${total(r)} kcal)\n\nIngredienti:\n${ing}\n\nProcedimento:\n${st}${r.consiglio?'\n\nConsiglio: '+r.consiglio:''}`;
}
async function copy(txt,b){
  try{await navigator.clipboard.writeText(txt);b.textContent='Copiata'}catch(err){
    const ta=document.createElement('textarea');ta.value=txt;document.body.appendChild(ta);ta.select();
    try{document.execCommand('copy');b.textContent='Copiata'}catch(e2){b.textContent='Non riuscito'}ta.remove()}
  setTimeout(()=>b.textContent='Copia',2000);
}
function cooked(r){
  const prev=JSON.parse(JSON.stringify(mag));const changed=[];
  (r.ingredienti||[]).forEach(x=>{
    if(x.da_comprare||!num(x.q))return;
    const k=norm(x.nome);
    const it=mag.find(m=>norm(m.n)===k)||mag.find(m=>{const n=norm(m.n);return n.length>2&&(k.includes(n)||n.includes(k))});
    if(!it)return;
    const d=conv(num(x.q),x.u||'g',it.u);if(d==null)return;
    it.q=Math.max(0,Math.round((num(it.q)-d)*100)/100);changed.push(it.n);
  });
  const gone=mag.filter(m=>num(m.q)<=0).map(m=>m.n);
  mag=mag.filter(m=>num(m.q)>0);
  const s=saved.find(x=>x.id===r.id);if(s){s.cucinata=(s.cucinata||0)+1;saveSaved()}
  renderMag();
  toast(changed.length?`Magazzino aggiornato: ${changed.length} ingredienti scalati${gone.length?`, finiti: ${gone.join(', ')}`:''}`:'Nessun ingrediente del magazzino da scalare',changed.length?()=>{mag=prev;renderMag()}:null);
  if(!$('#v-salvate').hidden)renderSaved();
}
function onCard(e,list){
  const b=e.target.closest('button[data-a]');if(!b)return;
  const id=b.closest('.rec').dataset.id,r=list().find(x=>x.id===id);if(!r)return;
  const a=b.dataset.a;
  if(a==='copia')copy(asText(r),b);
  if(a==='cucinata'){cooked(r);burst(b,['#F0A21A','#E3170A','#FFD900','#F4B6C6'])}
  if(a==='salva'){
    if(isSaved(r)){saved=saved.filter(x=>x.id!==r.id);b.className='sm btn-bas';b.textContent='Mi piace, salvala';b.setAttribute('aria-pressed','false')}
    else{saved.unshift({...r,data:Date.now(),target:num(r.target)||+kc.value});b.className='sm saved-on';b.textContent='Salvata ✓';b.setAttribute('aria-pressed','true');toast('Aggiunta alle ricette salvate');burst(b,['#F4B6C6','#E3170A','#F4B6C6'])}
    saveSaved();
  }
  if(a==='rimuovi'){const prev=saved.slice();saved=saved.filter(x=>x.id!==r.id);saveSaved();renderSaved();toast('Ricetta rimossa',()=>{saved=prev;saveSaved();renderSaved()})}
}
$('#out').addEventListener('click',e=>onCard(e,()=>recs));
$('#saved').addEventListener('click',e=>onCard(e,()=>saved));
function renderSaved(){
  const q=norm($('#cerca-sav').value);
  const list=saved.filter(r=>!q||norm(r.nome+' '+(r.ingredienti||[]).map(x=>x.nome).join(' ')).includes(q));
  $('#saved').innerHTML=saved.length?(list.length?list.map(r=>card(r,'saved')).join(''):'<div class="emptybox">Nessuna ricetta salvata corrisponde.</div>'):'<div style="grid-column:1/-1">'+emptyArt('Non hai ancora ricette salvate. In <a href="#crea" style="font-weight:600">Crea ricette</a> premi “Mi piace, salvala” su quelle che ti piacciono.')+'</div>';
}
$('#cerca-sav').addEventListener('input',renderSaved);

/* ---------- crea ---------- */
const parseJSON=t=>{const s=t.indexOf('{'),e=t.lastIndexOf('}');return JSON.parse(t.slice(s,e+1))};
let busy=false;
async function crea(more){
  if(busy)return;
  const st=$('#status'),out=$('#out'),eb=$('#err');eb.innerHTML='';
  if(!mag.some(x=>num(x.q)>0)){st.innerHTML='Il magazzino è vuoto: <a href="#magazzino" style="font-weight:600">aggiungi i tuoi ingredienti</a>.';return}
  if(!badge()){st.textContent='Prima collega l\'AI: bastano due minuti, segui i passaggi qui sopra.';$('#key').focus();return}
  if(!more){shown=[];recs=[];out.innerHTML=''}
  busy=true;['#crea','#altre'].forEach(s=>$(s).disabled=true);$('#crea').textContent='Sto cucinando le idee…';
  out.insertAdjacentHTML('beforeend',`<div class="skel cook">${POT}<p>Sto mescolando gli ingredienti…</p></div>`);
  ctl=new AbortController();const t0=Date.now();let cur='';
  const tick=()=>{st.textContent=`Sto inventando 3 ricette da circa ${kc.value} kcal… ${Math.round((Date.now()-t0)/1000)} s${cur?` · ${cur}`:''}`};
  tick();const iv=setInterval(tick,1000);$('#stop').hidden=false;
  try{
    const text=getKey()?await askGemini(prompt(),m=>{cur=m;tick()}):(await claudeSample(prompt(),{cache:false,signal:ctl.signal})).text;
    let data;try{data=parseJSON(text||'')}catch(x){const e=new Error('json');throw e}
    const set={kcal:+kc.value,manca:+$('#manca').value,tempo:$('#tempo').value,dieta:$('#dieta').value};
    const rs=(data.ricette||[]).filter(r=>r&&r.nome).map(r=>verify({...r,id:uid(),target:+kc.value},set));
    if(!rs.length)throw new Error('vuoto');
    out.querySelectorAll('.skel').forEach(s=>s.remove());
    recs.push(...rs);shown.push(...rs.map(r=>r.nome));
    out.insertAdjacentHTML('beforeend',rs.map(r=>card(r,'new')).join(''));
    st.textContent=`${recs.length} ricette per 1 persona, circa ${kc.value} kcal ciascuna (in ${Math.round((Date.now()-t0)/1000)} s). Salva quelle che ti piacciono.`;
    $('#more').hidden=false;
  }catch(e){
    out.querySelectorAll('.skel').forEach(s=>s.remove());
    st.textContent=recs.length?`${recs.length} ricette per 1 persona.`:'';
    const msg=explain(e);
    eb.innerHTML=`<div class="err">${esc(msg.charAt(0).toUpperCase()+msg.slice(1))}${e&&e.log&&e.log.length?`<details style="margin-top:6px;font-size:13px"><summary>Dettagli tecnici</summary>${e.log.map(l=>`<div>${esc(l)}</div>`).join('')}</details>`:''}</div>`;
    if(e&&(e.message==='key'||keyBad(e.status,e.detail)))$('#set').open=true;
  }finally{clearInterval(iv);ctl=null;$('#stop').hidden=true;busy=false;['#crea','#altre'].forEach(s=>$(s).disabled=false);$('#crea').textContent='Crea ricette'}
}
$('#crea').addEventListener('click',()=>crea(false));
$('#stop').addEventListener('click',()=>{if(ctl)ctl.abort()});
$('#diagbtn').addEventListener('click',diagnose);
$('#altre').addEventListener('click',()=>crea(true));

renderMag();saveSaved();route();
setTimeout(()=>{const s=$('#splash');if(s)s.remove()},2000);
if(matchMedia('(prefers-reduced-motion: reduce)').matches){const s=$('#splash');if(s)s.remove()}
}
