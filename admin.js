/* Site admin panel (owner only, this browser).
   Open: Ctrl+Shift+A (Cmd+Shift+A on Mac), five quick clicks on the name in the header, or the #admin link.
   The password is set on first use and stored only as a hash in this browser. It hides the panel from casual
   visitors; it is not server security. Changes preview on this browser only. To publish them for everyone,
   download the settings file and replace hero-config.json in the repository. */
(function(){
var HASH_KEY='siteAdminHash',SESSION_KEY='siteAdminOn',panel=null,modal=null;
function store(k,v){try{v===null?localStorage.removeItem(k):localStorage.setItem(k,v);return true}catch(e){return false}}
function load(k){try{return localStorage.getItem(k)}catch(e){return null}}
function sess(v){try{if(v===undefined)return sessionStorage.getItem(SESSION_KEY)==='1';v?sessionStorage.setItem(SESSION_KEY,'1'):sessionStorage.removeItem(SESSION_KEY)}catch(e){return false}}
function hashText(txt){
 try{if(window.crypto&&crypto.subtle&&window.TextEncoder)return crypto.subtle.digest('SHA-256',new TextEncoder().encode('pankaj-site|'+txt)).then(function(b){return 'sha256:'+Array.prototype.map.call(new Uint8Array(b),function(x){return('0'+x.toString(16)).slice(-2)}).join('')})}catch(e){}
 var h=5381;for(var i=0;i<txt.length;i++)h=((h<<5)+h+txt.charCodeAt(i))|0;return Promise.resolve('djb2:'+(h>>>0).toString(16))}
function el(tag,attrs,kids){var n=document.createElement(tag);if(attrs)Object.keys(attrs).forEach(function(k){if(k==='text')n.textContent=attrs[k];else if(k==='on')Object.keys(attrs.on).forEach(function(ev){n.addEventListener(ev,attrs.on[ev])});else n.setAttribute(k,attrs[k])});(kids||[]).forEach(function(c){if(c)n.appendChild(c)});return n}

var css='.sa-modal{position:fixed;inset:0;z-index:9999;background:rgba(15,27,45,.35);display:flex;align-items:center;justify-content:center;font-family:system-ui,-apple-system,"Segoe UI",sans-serif}'+
'.sa-card{background:#fff;color:#0f1b2d;border-radius:16px;box-shadow:0 20px 60px #0f1b2d33;padding:22px;width:min(340px,92vw)}.sa-card h3{margin:0 0 6px;font-size:1.05rem;letter-spacing:-.02em}.sa-card p{margin:0 0 14px;font-size:.8rem;color:#5c6b80;line-height:1.5}'+
'.sa-card input[type=password]{width:100%;box-sizing:border-box;font:inherit;padding:9px 12px;border:1px solid #d5dce6;border-radius:10px;margin-bottom:10px}.sa-err{color:#b4232a;font-size:.78rem;min-height:1.1em;margin-bottom:8px}'+
'.sa-btn{font:inherit;font-size:.78rem;padding:7px 12px;border:1px solid #d5dce6;background:#fff;border-radius:999px;cursor:pointer;color:#0f1b2d}.sa-btn[aria-pressed=true],.sa-btn.sa-main{background:#0f1b2d;color:#fff;border-color:#0f1b2d}'+
'.sa-panel{position:fixed;top:90px;right:16px;z-index:9998;width:min(360px,calc(100vw - 32px));max-height:calc(100vh - 110px);overflow:auto;background:#fff;color:#0f1b2d;border:1px solid #e3e8ef;border-radius:16px;box-shadow:0 18px 50px #0f1b2d29;padding:16px 16px 18px;font-family:system-ui,-apple-system,"Segoe UI",sans-serif;font-size:.8rem}'+
'.sa-head{display:flex;align-items:center;justify-content:space-between;margin-bottom:10px}.sa-head strong{font-size:.95rem}.sa-sec{border-top:1px solid #eef1f5;padding-top:10px;margin-top:10px}.sa-sec>b{display:block;font-size:.7rem;letter-spacing:.1em;color:#5c6b80;margin-bottom:8px}'+
'.sa-row{display:flex;flex-wrap:wrap;gap:6px}.sa-row .sa-btn{padding:5px 10px}.sa-name{margin-top:6px;color:#5c6b80;line-height:1.4}.sa-sl{display:grid;grid-template-columns:96px 1fr 44px;align-items:center;gap:8px;margin:6px 0}.sa-sl input{width:100%;accent-color:#0866dc}.sa-sl output{font-weight:600;text-align:right}'+
'.sa-panel textarea{width:100%;box-sizing:border-box;min-height:120px;font:inherit;padding:8px 10px;border:1px solid #d5dce6;border-radius:10px;resize:vertical}.sa-note{color:#5c6b80;line-height:1.5;margin-top:8px}.sa-status{color:#178157;min-height:1.2em;margin-top:8px}';
function addStyle(){if(document.getElementById('sa-style'))return;var s=el('style',{id:'sa-style'});s.textContent=css;document.head.appendChild(s)}

function closeModal(){if(modal){modal.remove();modal=null}}
function askPassword(){addStyle();if(modal)return;var stored=load(HASH_KEY),first=!stored;
 var p1=el('input',{type:'password',placeholder:first?'New password':'Password','aria-label':'Password',autocomplete:first?'new-password':'current-password'}),
     p2=first?el('input',{type:'password',placeholder:'Repeat password','aria-label':'Repeat password',autocomplete:'new-password'}):null,
     err=el('div',{class:'sa-err'});
 function submit(){var a=p1.value;if(a.length<6){err.textContent='Use at least 6 characters.';return}
  if(first&&a!==p2.value){err.textContent='The two passwords do not match.';return}
  hashText(a).then(function(h){if(first){if(!store(HASH_KEY,h)){err.textContent='This browser blocks storage, so admin cannot be saved here.';return}openPanel();closeModal()}
   else if(h===stored){openPanel();closeModal()}else{err.textContent='Wrong password.';p1.value='';p1.focus()}})
  .catch(function(){err.textContent='Could not check the password in this browser.'})}
 [p1,p2].forEach(function(i){if(i)i.addEventListener('keydown',function(e){if(e.key==='Enter')submit();if(e.key==='Escape')closeModal()})});
 modal=el('div',{class:'sa-modal',role:'dialog','aria-modal':'true','aria-label':'Admin sign in'},[el('div',{class:'sa-card'},[
  el('h3',{text:first?'Set admin password':'Admin'}),
  el('p',{text:first?'Pick a password for this browser. Only a hash is kept here. Clearing site data resets it.':'Enter your admin password.'}),
  p1,p2,err,el('div',{class:'sa-row'},[el('button',{type:'button',class:'sa-btn sa-main',text:first?'Save and open':'Open',on:{click:submit}}),el('button',{type:'button',class:'sa-btn',text:'Cancel',on:{click:closeModal}})])])]);
 modal.addEventListener('click',function(e){if(e.target===modal)closeModal()});document.body.appendChild(modal);p1.focus()}

function openPanel(){sess(true);addStyle();if(panel){panel.hidden=false;refresh();return}
 var HF=window.HeroFlow;if(!HF){alertMsg('The hero animation is not loaded on this page.');return}
 var status=el('div',{class:'sa-status','aria-live':'polite'});
 function say(m){status.textContent=m;clearTimeout(say.t);say.t=setTimeout(function(){status.textContent=''},4000)}
 function group(label,items,key,onPick){var row=el('div',{class:'sa-row'});items.forEach(function(it){row.appendChild(el('button',{type:'button',class:'sa-btn','data-k':key,'data-v':String(it.v),title:it.title||'',text:it.label,on:{click:function(){onPick(it.v)}}}))});return el('div',{class:'sa-sec'},[el('b',{text:label}),row])}
 var names=HF.names(),modeName=el('div',{class:'sa-name'});
 var heroSec=group('HERO',[{v:'flow',label:'Flow animation (v5)'},{v:'orbit',label:'Orbit visual (old)'}],'hero',function(v){HF.set({hero:v});refresh()});
 var modeItems=[];for(var k=1;k<=11;k++)modeItems.push({v:k,label:String(k),title:names[k]});
 var modeSec=group('ANIMATION',modeItems,'mode',function(v){HF.set({mode:v});refresh()});modeSec.appendChild(modeName);
 var panSec=group('CHART STYLE (options 6 to 11)',[{v:1,label:'Donut + bars'},{v:2,label:'Bars'},{v:3,label:'Radial'},{v:4,label:'Trend'},{v:5,label:'Heat'},{v:6,label:'Rings'},{v:7,label:'3 rings + bars + trend'}],'panel',function(v){HF.set({panel:v});refresh()});
 var SL=[['burst','Burst',0,200,10,'%'],['density','Dot density',20,150,5,'%'],['speed','Speed',30,200,5,'%'],['opacity','Visibility',20,100,5,'%'],['size','Visual size',25,60,1,''],['gran','Granule',3,8,1,'px'],['ringGap','Ring opening',0,50,5,'%']],sliders={};
 var slSec=el('div',{class:'sa-sec'},[el('b',{text:'SETTINGS'})]);
 SL.forEach(function(c){var o=el('output'),i=el('input',{type:'range',min:c[2],max:c[3],step:c[4],'aria-label':c[1]});
  i.addEventListener('input',function(){o.textContent=i.value+c[5];var p={};p[c[0]]=+i.value;HF.set(p)});sliders[c[0]]={i:i,o:o,u:c[5]};slSec.appendChild(el('label',{class:'sa-sl'},[el('span',{text:c[1]}),i,o]))});
 var kwOn=el('input',{type:'checkbox'}),kwText=el('textarea',{'aria-label':'Keywords, one per line'});
 kwOn.addEventListener('change',function(){HF.set({kw:kwOn.checked})});
 kwText.addEventListener('input',function(){HF.set({words:kwText.value.split('\n').map(function(s){return s.trim()}).filter(Boolean)})});
 var kwSec=el('div',{class:'sa-sec'},[el('b',{text:'KEYWORDS (one per line)'}),el('label',{class:'sa-row'},[kwOn,el('span',{text:'Show pixel keywords in the chart'})]),kwText]);
 function download(){var cfg=HF.get(),txt=JSON.stringify(cfg,null,2)+'\n';try{var a=el('a',{href:URL.createObjectURL(new Blob([txt],{type:'application/json'})),download:'hero-config.json'});document.body.appendChild(a);a.click();setTimeout(function(){URL.revokeObjectURL(a.href);a.remove()},500);say('Downloaded hero-config.json. Replace the one in the repository to publish.')}catch(e){say('Download failed in this browser.')}}
 var actions=el('div',{class:'sa-sec'},[el('b',{text:'SAVE'}),el('div',{class:'sa-row'},[
  el('button',{type:'button',class:'sa-btn sa-main',text:'Save on this browser',on:{click:function(){say(HF.saveLocal()?'Saved for this browser.':'This browser blocks storage.')}}}),
  el('button',{type:'button',class:'sa-btn',text:'Download settings file',on:{click:download}}),
  el('button',{type:'button',class:'sa-btn',text:'Reset to site settings',on:{click:function(){HF.clearLocal();refresh();say('Back to the published settings.')}}})]),
  el('p',{class:'sa-note',text:'Changes show only on this browser. Visitors see hero-config.json from GitHub.'}),status]);
 var head=el('div',{class:'sa-head'},[el('strong',{text:'Site admin'}),el('div',{class:'sa-row'},[
  el('button',{type:'button',class:'sa-btn',text:'Lock',title:'Close and require the password again',on:{click:function(){sess(false);panel.hidden=true}}}),
  el('button',{type:'button',class:'sa-btn','aria-label':'Close panel',text:'Close',on:{click:function(){panel.hidden=true}}})])]);
 panel=el('aside',{class:'sa-panel','aria-label':'Site admin'},[head,heroSec,modeSec,panSec,slSec,kwSec,actions]);document.body.appendChild(panel);
 function refresh(){var c=HF.get();panel.querySelectorAll('[data-k]').forEach(function(b){b.setAttribute('aria-pressed',String(c[b.getAttribute('data-k')])===b.getAttribute('data-v')?'true':'false')});
  modeName.textContent=names[c.mode]||'';Object.keys(sliders).forEach(function(k){sliders[k].i.value=c[k];sliders[k].o.textContent=c[k]+sliders[k].u});
  kwOn.checked=!!c.kw;if(document.activeElement!==kwText)kwText.value=(c.words||[]).join('\n')}
 openPanel.refresh=refresh;refresh()}
function refresh(){if(openPanel.refresh)openPanel.refresh()}
function alertMsg(m){addStyle();var n=el('div',{class:'sa-panel',role:'status',text:m});document.body.appendChild(n);setTimeout(function(){n.remove()},3500)}
function enter(){if(sess())openPanel();else askPassword()}

document.addEventListener('keydown',function(e){if((e.ctrlKey||e.metaKey)&&e.shiftKey&&(e.key==='A'||e.key==='a')){e.preventDefault();enter()}});
var clicks=[],idn=document.querySelector('.identity');
if(idn)idn.addEventListener('click',function(){var now=Date.now();clicks=clicks.filter(function(t){return now-t<2000});clicks.push(now);if(clicks.length>=5){clicks=[];enter()}});
function fromHash(){if(location.hash==='#admin'){try{history.replaceState(null,'',location.pathname+location.search)}catch(e){}enter()}}
window.addEventListener('hashchange',fromHash);
document.addEventListener('heroflow:ready',function(){if(sess())openPanel();fromHash()});
if(window.HeroFlow&&document.readyState!=='loading'){fromHash()}
})();
