/* Prototype Lab: renders project cards from projects.json.
   To add or hide a project, edit projects.json only. */
(function(){
var root=document.getElementById('lab-grid');if(!root)return;
var chips=document.querySelectorAll('.lab-filter button');
var status=document.getElementById('lab-status');
var items=[];
function el(tag,cls,text){var n=document.createElement(tag);if(cls)n.className=cls;if(text!=null)n.textContent=text;return n}
function card(p,i){
  var a=el('a','lab-card rv');a.href=p.url;a.target='_blank';a.rel='noopener noreferrer';
  a.setAttribute('data-group',p.group);a.style.setProperty('--i',String(i%4));
  a.setAttribute('aria-label',p.title+', open live demo in a new tab');
  var fig=el('div','lab-shot');var img=new Image();img.src=p.image;img.alt='';img.loading='lazy';img.width=720;img.height=450;fig.appendChild(img);
  fig.appendChild(el('span','lab-open','Open live'));
  var body=el('div','lab-body');
  body.appendChild(el('span','lab-kind',p.group==='product'?'DATA AND PRODUCT':'CREATIVE CODING'));
  body.appendChild(el('h3',null,p.title));
  body.appendChild(el('p','lab-line',p.line));
  body.appendChild(el('p','lab-why',p.why));
  var tags=el('div','lab-tags');(p.tags||[]).forEach(function(t){tags.appendChild(el('span',null,t))});body.appendChild(tags);
  a.appendChild(fig);a.appendChild(body);return a}
var dlg=null;
function dialogBox(){
  if(dlg)return dlg;
  dlg=el('dialog','lab-dialog');dlg.setAttribute('aria-label','Project details');
  dlg.addEventListener('click',function(e){if(e.target===dlg)dlg.close()});
  document.body.appendChild(dlg);return dlg}
function openDialog(p){
  var d=dialogBox();d.textContent='';
  var close=el('button','lab-dialog-close','×');close.type='button';close.setAttribute('aria-label','Close');
  close.addEventListener('click',function(){d.close()});
  var img=new Image();img.src=p.image;img.alt='';img.className='lab-dialog-shot';
  var body=el('div','lab-dialog-body');
  body.appendChild(el('span','lab-kind',p.group==='product'?'DATA AND PRODUCT':'CREATIVE CODING'));
  body.appendChild(el('h3',null,p.title));
  body.appendChild(el('p','lab-line',p.line));
  if(p.why)body.appendChild(el('p','lab-why',p.why));
  var tags=el('div','lab-tags');(p.tags||[]).forEach(function(t){tags.appendChild(el('span',null,t))});body.appendChild(tags);
  var acts=el('div','lab-dialog-actions');
  var live=el('a','button button-primary','Open live');live.href=p.url;live.target='_blank';live.rel='noopener noreferrer';acts.appendChild(live);
  if(p.repo){var gh=el('a','button button-secondary','Source on GitHub');gh.href='https://github.com/PankajSabhlock/'+p.repo;gh.target='_blank';gh.rel='noopener noreferrer';acts.appendChild(gh)}
  body.appendChild(acts);
  d.appendChild(close);d.appendChild(img);d.appendChild(body);
  d.showModal()}
function miniCard(p,i){
  var b=el('button','lab-card lab-mini rv');b.type='button';
  b.setAttribute('data-group',p.group);b.style.setProperty('--i',String(i%4));
  b.setAttribute('aria-haspopup','dialog');b.setAttribute('aria-label',p.title+', show details');
  var fig=el('span','lab-mini-shot');var img=new Image();img.src=p.image;img.alt='';img.loading='lazy';img.width=240;img.height=150;fig.appendChild(img);
  var body=el('span','lab-mini-body');
  body.appendChild(el('span','lab-kind',p.group==='product'?'DATA AND PRODUCT':'CREATIVE CODING'));
  body.appendChild(el('strong',null,p.title));
  b.appendChild(fig);b.appendChild(body);b.appendChild(el('span','lab-mini-plus','+'));
  b.addEventListener('click',function(){openDialog(p)});return b}
var groups={product:'Data and product',creative:'Creative coding'};var boxes={};
function apply(g){
  var n=0;Object.keys(boxes).forEach(function(k){var on=g==='all'||g===k;boxes[k].hidden=!on;if(on)n+=boxes[k].querySelectorAll('.lab-card').length});
  chips.forEach(function(b){b.setAttribute('aria-pressed',String(b.getAttribute('data-g')===g))});
  if(status)status.textContent=n+' projects shown'}
function render(list){
  root.textContent='';
  Object.keys(groups).forEach(function(k){
    var shown=list.filter(function(p){return p.show!==false&&p.group===k});if(!shown.length)return;
    var box=el('div','lab-group lab-group-'+k);box.setAttribute('data-group',k);
    var head=el('div','lab-group-head');head.appendChild(el('h3',null,groups[k]));head.appendChild(el('span',null,shown.length+(shown.length===1?' project':' projects')));box.appendChild(head);
    var big=shown.filter(function(p){return p.size!=='small'}),small=shown.filter(function(p){return p.size==='small'});
    var grid=el('div','lab-grid');big.forEach(function(p,i){var c=card(p,i);items.push(c);grid.appendChild(c)});box.appendChild(grid);
    if(small.length){var g2=el('div','lab-grid lab-grid-compact');small.forEach(function(p,i){var c=miniCard(p,i);items.push(c);g2.appendChild(c)});box.appendChild(g2)}
    boxes[k]=box;root.appendChild(box)});
  if('IntersectionObserver' in window){var io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target)}})},{rootMargin:'0px 0px -8% 0px'});items.forEach(function(c){io.observe(c)})}
  else items.forEach(function(c){c.classList.add('in')});
  apply('all')}
chips.forEach(function(b){b.addEventListener('click',function(){apply(b.getAttribute('data-g'))})});
fetch('projects.json?v=20261116').then(function(r){if(!r.ok)throw 0;return r.json()}).then(function(d){render(d.projects||[])}).catch(function(){
  root.textContent='';var p=el('p','lab-fallback');p.appendChild(document.createTextNode('The project list could not load. See the work on '));
  var a=el('a',null,'GitHub');a.href='https://github.com/PankajSabhlock';a.target='_blank';a.rel='noopener noreferrer';p.appendChild(a);p.appendChild(document.createTextNode('.'));root.appendChild(p)});
})();
