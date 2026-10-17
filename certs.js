(function(){
var DATA=[{"issuer":"Google","title":"Introduction to Responsible AI","date":"2025-08-15","img":"assets/certs/c01.jpg"},{"issuer":"Google","title":"Use AI Responsibly","date":"2025-08-17","img":"assets/certs/c02.jpg"},{"issuer":"Google","title":"Stay Ahead of the AI Curve","date":"2025-08-17","img":"assets/certs/c03.jpg"},{"issuer":"Microsoft","title":"Unlock the Power of Data with Power BI","date":"2025-08-10","img":"assets/certs/c04.jpg"},{"issuer":"Microsoft","title":"Azure AI Fundamentals (AI-900) Cert Prep: Conversational AI","date":"2024-07-14","img":"assets/certs/c05.jpg"},{"issuer":"Power BI Workshop","title":"Power BI Beginner to Pro Workshop","date":"2024-09-04","img":"assets/certs/c06.jpg"},{"issuer":"IBM","title":"Product Management: An Introduction","date":"2025-08-14","img":"assets/certs/c07.jpg"},{"issuer":"Rutgers","title":"AI Ethics in Business","date":"2025-08-15","img":"assets/certs/c08.jpg"},{"issuer":"AWS","title":"Developing Generative AI Applications on AWS","date":"2026-09-11","img":"assets/certs/c09.jpg"},{"issuer":"AWS","title":"AWS Cloud Practitioner Essentials","date":"2026-09-04","img":"assets/certs/c10.jpg"},{"issuer":"AWS","title":"Architecting on AWS","date":"2026-05-28","img":"assets/certs/c11.jpg"},{"issuer":"AWS","title":"Machine Learning Engineering on AWS","date":"2026-05-20","img":"assets/certs/c12.jpg"},{"issuer":"Adobe","title":"Adobe Education Institute Fellow","date":"2025-11-20","img":"assets/certs/c13.jpg"},{"issuer":"Adobe","title":"Pathway: Adobe Express Foundations","date":"2026-06-24","img":"assets/certs/c14.jpg"},{"issuer":"Adobe","title":"Pathway: Advanced Adobe Express","date":"2026-06-21","img":"assets/certs/c15.jpg"},{"issuer":"Adobe","title":"Pathway: Empowered Workflows with Acrobat","date":"2026-06-24","img":"assets/certs/c16.jpg"},{"issuer":"MathWorks","title":"Deep Learning Onramp","date":"2024-05-07","img":"assets/certs/c17.jpg"},{"issuer":"MathWorks","title":"Machine Learning Onramp","date":"2024-05-07","img":"assets/certs/c18.jpg"},{"issuer":"MathWorks","title":"Computer Vision Onramp","date":"2024-05-06","img":"assets/certs/c19.jpg"},{"issuer":"MathWorks","title":"Image Processing Onramp","date":"2024-03-10","img":"assets/certs/c20.jpg"},{"issuer":"MathWorks","title":"MATLAB Onramp","date":"2024-02-03","img":"assets/certs/c21.jpg"},{"issuer":"MathWorks","title":"App Building Onramp","date":"2024","img":"assets/certs/c22.jpg"},{"issuer":"LinkedIn Learning","title":"Human-First AI: Building AI Products That People Actually Use","date":"2026-07-02","img":"assets/certs/c23.jpg"},{"issuer":"LinkedIn Learning","title":"Run AI Locally with Gemma and Ollama","date":"2026-07-02","img":"assets/certs/c24.jpg"},{"issuer":"LinkedIn Learning","title":"How to Speak Smarter When Put on the Spot","date":"2025-11-04","img":"assets/certs/c25.jpg"},{"issuer":"UEL","title":"Stress Management for Managers","date":"2026-05-26","img":"assets/certs/c26.jpg"},{"issuer":"UEL","title":"Cyber Security Awareness","date":"2026-05-26","img":"assets/certs/c27.jpg"},{"issuer":"Ericsson","title":"Anti-Corruption 2.0","date":"2013-05-31","img":"assets/certs/c28.jpg"},{"issuer":"Ericsson","title":"WCDMA RAN Functionality","date":"2013-05-29","img":"assets/certs/c29.jpg"},{"issuer":"Ericsson","title":"MSDP Ways of Working Assessment","date":"2013-06-25","img":"assets/certs/c30.jpg"},{"issuer":"Ericsson","title":"An Introduction to Trade Compliance","date":"2012-10-16","img":"assets/certs/c31.jpg"},{"issuer":"Ericsson","title":"General Trade Compliance Training","date":"2012","img":"assets/certs/c32.jpg"},{"issuer":"Ericsson","title":"LTE L11 Performance Management and Optimization","date":"2012","img":"assets/certs/c33.jpg"},{"issuer":"Ericsson","title":"LTE Air Interface","date":"2012-02-27","img":"assets/certs/c34.jpg"},{"issuer":"Ericsson","title":"LTE TDD Air Interface","date":"2012-02-27","img":"assets/certs/c35.jpg"},{"issuer":"Ericsson","title":"LTE/SAE in a Nutshell","date":"2012-02-27","img":"assets/certs/c36.jpg"}];
var root=document.getElementById('album'); if(!root||!DATA.length) return;
var track=root.querySelector('.album-track'),tabs=root.querySelector('.album-tabs'),count=root.querySelector('.album-count'),prev=root.querySelector('[data-dir="-1"]'),next=root.querySelector('[data-dir="1"]'),modes=root.querySelectorAll('[data-mode]'),play=root.querySelector('.album-play');
var box=document.getElementById('album-box'),boxImg=box.querySelector('img'),boxCap=box.querySelector('figcaption');
var reduce=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
var mode='company',group='All',cards=[],idx=0,tick=false,timer=null,paused=reduce,visible=false;
function yr(d){return d.slice(0,4);}
function fmt(d){if(d.length>=10){return new Date(d+'T00:00:00Z').toLocaleDateString('en-GB',{day:'numeric',month:'short',year:'numeric',timeZone:'UTC'});}return d;}
function topicOf(c){
  var t=c.title,i=c.issuer;
  if(i==='Ericsson'&&/LTE|WCDMA/.test(t)) return 'Telecommunications';
  if(i==='Ericsson'||i==='UEL'||i==='Rutgers'&&false) return 'Compliance and Leadership';
  if(/Speak Smarter/.test(t)) return 'Compliance and Leadership';
  if(i==='Adobe') return 'Adobe Education Institute';
  if(i==='Google'||i==='Rutgers'||/Human-First/.test(t)) return 'Responsible AI';
  if(/Power BI|Product Management/.test(t)) return 'Data and Product';
  return 'Cloud and Applied AI';
}
function keyOf(c){return mode==='company'?c.issuer:(mode==='year'?yr(c.date):topicOf(c));}
function sorted(){return DATA.slice().sort(function(a,b){return b.date.localeCompare(a.date);});}
function render(){
  var all=sorted(),m=new Map();
  all.forEach(function(c){var k=keyOf(c);m.set(k,(m.get(k)||0)+1);});
  if(group!=='All'&&!m.has(group)) group='All';
  tabs.textContent='';
  [['All',all.length]].concat(Array.from(m.entries())).forEach(function(e){
    var b=document.createElement('button');b.type='button';b.setAttribute('aria-pressed',String(e[0]===group));
    b.textContent=e[0];var s=document.createElement('span');s.textContent=e[1];b.appendChild(s);
    b.addEventListener('click',function(){group=e[0];render();});tabs.appendChild(b);
  });
  var list=all.filter(function(c){return group==='All'||keyOf(c)===group;});
  track.textContent='';
  list.forEach(function(c){
    var f=document.createElement('figure');f.className='album-card';
    var b=document.createElement('button');b.type='button';b.setAttribute('aria-label','Open '+c.title);
    var i=document.createElement('img');i.src=c.img;i.alt=c.title+', '+c.issuer;i.loading='lazy';i.decoding='async';
    b.appendChild(i);b.addEventListener('click',function(){open(c);});
    var cap=document.createElement('figcaption');var h=document.createElement('h3');h.textContent=c.title;
    var p=document.createElement('p');p.textContent=c.issuer+'  |  '+fmt(c.date);
    cap.appendChild(h);cap.appendChild(p);f.appendChild(b);f.appendChild(cap);track.appendChild(f);
  });
  cards=Array.prototype.slice.call(track.children);idx=0;track.scrollLeft=0;update();
}
function update(){
  var mid=track.scrollLeft+track.clientWidth/2,best=0,bd=1e9;
  cards.forEach(function(c,i){
    var w=c.offsetWidth,d=(c.offsetLeft+w/2-mid)/(w*0.78),a=Math.min(Math.abs(d),1.4),sgn=d<0?-1:1;
    var s=1-Math.min(a,1)*0.42,o=1-Math.min(a,1.2)*0.62,r=reduce?0:-sgn*Math.min(a,1)*24;
    c.style.setProperty('--s',s.toFixed(3));c.style.setProperty('--o',o.toFixed(3));c.style.setProperty('--r',r.toFixed(1)+'deg');
    c.style.zIndex=String(100-Math.round(a*10));
    if(Math.abs(d)<bd){bd=Math.abs(d);best=i;}
  });
  idx=best;
  cards.forEach(function(c,i){c.classList.toggle('is-active',i===idx);});
  count.textContent=cards.length?(idx+1)+' / '+cards.length:'';
  prev.disabled=idx<=0;next.disabled=idx>=cards.length-1;
}
function go(i){
  i=Math.max(0,Math.min(cards.length-1,i));var c=cards[i];if(!c)return;
  track.scrollTo({left:c.offsetLeft-(track.clientWidth-c.offsetWidth)/2,behavior:reduce?'auto':'smooth'});
}
function stop(){if(timer){clearInterval(timer);timer=null;}}
function start(){stop();if(paused||!visible||cards.length<2)return;timer=setInterval(function(){go(idx>=cards.length-1?0:idx+1);},4800);}
function setPaused(v){paused=v;play.setAttribute('aria-pressed',String(!v));play.textContent=v?'Play':'Pause';start();}
track.addEventListener('scroll',function(){if(tick)return;tick=true;requestAnimationFrame(function(){tick=false;update();});},{passive:true});
prev.addEventListener('click',function(){setPaused(true);go(idx-1);});
next.addEventListener('click',function(){setPaused(true);go(idx+1);});
play.addEventListener('click',function(){setPaused(!paused);});
track.addEventListener('keydown',function(e){if(e.key==='ArrowRight'){e.preventDefault();setPaused(true);go(idx+1);}else if(e.key==='ArrowLeft'){e.preventDefault();setPaused(true);go(idx-1);}});
['pointerdown','mouseenter','focusin'].forEach(function(n){track.addEventListener(n,stop);});
['mouseleave','focusout'].forEach(function(n){track.addEventListener(n,start);});
cardsClick();
function cardsClick(){track.addEventListener('click',function(e){var f=e.target.closest('.album-card');if(!f||f.classList.contains('is-active'))return;var i=cards.indexOf(f);if(i>=0){e.stopPropagation();go(i);}},true);}
modes.forEach(function(b){b.addEventListener('click',function(){mode=b.getAttribute('data-mode');group='All';modes.forEach(function(x){x.setAttribute('aria-pressed',String(x===b));});render();});});
function open(c){stop();boxImg.src=c.img;boxImg.alt=c.title;boxCap.textContent=c.title+'  |  '+c.issuer+'  |  '+fmt(c.date);if(box.showModal){box.showModal();}else{box.setAttribute('open','');}}
box.querySelector('.album-close').addEventListener('click',function(){box.close();});
box.addEventListener('click',function(e){if(e.target===box)box.close();});
box.addEventListener('close',start);
document.addEventListener('visibilitychange',function(){if(document.hidden)stop();else start();});
if('IntersectionObserver' in window){new IntersectionObserver(function(en){visible=en[0].isIntersecting;start();},{threshold:0.35}).observe(root);}else{visible=true;}
window.addEventListener('resize',update);
setPaused(paused);
render();
})();