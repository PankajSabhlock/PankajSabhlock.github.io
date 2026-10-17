(function(){
if(window.matchMedia('(prefers-reduced-motion: reduce)').matches||!('IntersectionObserver' in window)) return;
var root=document.documentElement; root.classList.add('motion');
function ready(fn){if(document.readyState!=='loading')fn();else document.addEventListener('DOMContentLoaded',fn);}
ready(function(){
  /* 1. scroll progress and header shadow */
  var bar=document.createElement('div');bar.id='scroll-progress';bar.setAttribute('aria-hidden','true');document.body.appendChild(bar);
  var header=document.querySelector('.site-header'),tick=false;
  function onScroll(){tick=false;var h=root.scrollHeight-innerHeight;bar.style.transform='scaleX('+(h>0?Math.min(1,scrollY/h):0).toFixed(4)+')';if(header)header.classList.toggle('is-scrolled',scrollY>8);}
  addEventListener('scroll',function(){if(!tick){tick=true;requestAnimationFrame(onScroll);}},{passive:true});onScroll();
  /* 2. hero headline: words rise in */
  var h1=document.querySelector('.hero h1'),hero=document.querySelector('.hero'),n=0;
  if(h1){
    Array.prototype.slice.call(h1.childNodes).forEach(function(node){
      if(node.nodeType===3){
        var frag=document.createDocumentFragment();
        node.textContent.split(/(\s+)/).forEach(function(tok){
          if(!tok)return;
          if(/^\s+$/.test(tok)){frag.appendChild(document.createTextNode(' '));return;}
          var w=document.createElement('span');w.className='w';var wi=document.createElement('span');wi.className='wi';wi.style.setProperty('--i',n++);wi.textContent=tok;w.appendChild(wi);frag.appendChild(w);
        });
        h1.replaceChild(frag,node);
      }else if(node.nodeType===1&&node.tagName==='SPAN'){node.classList.add('imp');node.style.setProperty('--i',n++);}
    });
    requestAnimationFrame(function(){requestAnimationFrame(function(){h1.classList.add('go');if(hero)hero.classList.add('go');});});
  }
  /* 3. reveal on scroll with stagger */
  var rvSel='.impact-card,.learning-card,.credential-list article,.recognition-grid>*,.responsible-layout>*,.research-section .section-heading~*,.speaking-section>*,.connect-section>*,.education-foundation,.album-section .album-head,.album-section .album-stage';
  var groups=new Map();
  document.querySelectorAll(rvSel).forEach(function(el){
    if(el.closest('.hero'))return;
    el.classList.add('rv');var p=el.parentElement;var i=groups.get(p)||0;groups.set(p,i+1);el.style.setProperty('--i',Math.min(i,6));
  });
  var rv=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){e.target.classList.add('in');rv.unobserve(e.target);}});},{threshold:.1,rootMargin:'0px 0px -6% 0px'});
  document.querySelectorAll('.rv').forEach(function(el){rv.observe(el);});
  /* 4. heading underline */
  var hv=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){e.target.classList.add('in');hv.unobserve(e.target);}});},{threshold:.6});
  document.querySelectorAll('main section h2').forEach(function(el){hv.observe(el);});
  /* 5. count up numbers */
  var cu=new IntersectionObserver(function(es){es.forEach(function(e){if(!e.isIntersecting)return;cu.unobserve(e.target);run(e.target);});},{threshold:.6});
  document.querySelectorAll('.journey-years strong,.number-highlight,.report-metric span').forEach(function(el){
    var m=/^(\D*)(\d[\d,]*)(\D*)$/.exec(el.textContent.trim());if(!m)return;
    el._cu={pre:m[1],num:parseInt(m[2].replace(/,/g,''),10),post:m[3],comma:m[2].indexOf(',')>-1};cu.observe(el);
  });
  function run(el){
    var d=el._cu,t0=null,dur=1100;if(!d||d.num<2)return;
    function f(v){var s=String(Math.round(v));if(d.comma)s=s.replace(/\B(?=(\d{3})+(?!\d))/g,',');return d.pre+s+d.post;}
    el.style.display=el.style.display||'';el.style.minWidth=el.offsetWidth+'px';
    function step(t){if(t0===null)t0=t;var p=Math.min(1,(t-t0)/dur),e=1-Math.pow(1-p,3);el.textContent=f(d.num*e);if(p<1)requestAnimationFrame(step);else{el.textContent=f(d.num);el.style.minWidth='';}}
    el.textContent=f(0);requestAnimationFrame(step);
  }
  /* 6. journey: dots light up as you reach each role */
  var jr=new IntersectionObserver(function(es){es.forEach(function(e){e.target.classList.toggle('is-reached',e.isIntersecting||e.boundingClientRect.top<0);});},{threshold:0,rootMargin:'-35% 0px -35% 0px'});
  document.querySelectorAll('.timeline-item').forEach(function(el){jr.observe(el);});
});
})();