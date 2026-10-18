/* Hero flow animation (from anim-preview-5, option 6 "Insight Feed" with panel 7 "3-ring donut + bars + trend").
   Dots stream in from the left and land in a dotted BI panel drawn over the hero's right-hand visual area.
   Pauses with the site's motion toggle (body[data-motion="paused"]) and with prefers-reduced-motion. */
(function(){
var hero=document.getElementById('home'),vis=hero&&hero.querySelector('.intelligence-visual');
if(!hero||!vis)return;
var cv=document.createElement('canvas');cv.className='hero-flow';cv.setAttribute('aria-hidden','true');hero.insertBefore(cv,hero.firstChild);
var ctx=cv.getContext('2d');if(!ctx){cv.remove();return}
document.documentElement.classList.add('has-hero-flow');
var W=0,H=0,t=0,last=0,mouse={x:-999,y:-999,a:0},bursts=[],bt=0,visible=true,drawnPaused=false,VB={x:0,y:0,w:0,h:0};
var reduce=window.matchMedia('(prefers-reduced-motion: reduce)');
var COL=['8,102,220','8,141,147','23,129,87'],TC='8,141,147',NB=7;
var CFG={burst:20,density:25,speed:50,gran:4};
function rnd(a,b){return a+Math.random()*(b-a)}
function pick(){return COL[Math.floor(Math.random()*3)]}
function DEN(){return CFG.density/100}
function dot(x,y,r,col,a){if(r<=0||a<=0)return;ctx.fillStyle='rgba('+col+','+a+')';ctx.beginPath();ctx.arc(x,y,r,0,6.2832);ctx.fill()}
function px(x,y,sz,col,a){if(a<=0)return;ctx.fillStyle='rgba('+col+','+a+')';ctx.fillRect(Math.round(x),Math.round(y),sz,sz)}
function hash(x,y){var n=Math.sin(x*12.9898+y*78.233)*43758.5453;return n-Math.floor(n)}

/* ---------- panel: 3 rings + bars + trend ---------- */
var P={};
function pInit(){P.c=[];for(var i=0;i<NB;i++)P.c.push({v:.3+Math.random()*.35,fl:0,ring:.5,tr:.35,lt:.35});P.tbS=null}
function geo(){var D=Math.min(VB.w,VB.h*1.1,H*.86),R=D/2,cx=VB.x+VB.w/2,cy=Math.max(R+4,Math.min(H-R-4,VB.y+VB.h/2)),iw=R,ih=R*.6,b7=cy+R*.42;
 return{cx:cx,cy:cy,R:R,iw:iw,ih:ih,base:b7,bx:cx-iw/2,bs:iw/NB,tbMin:cy-R*.2,th:R*.22}}
function barX(i,g){return g.bx+g.bs*(i+.5)}
function slot(i){var g=geo();return{x:barX(i,g),y:g.base-P.c[i].v*g.ih}}
function land(i){var c=P.c[i];c.fl=1;c.v=Math.min(1,c.v+.07)}
function dBars(g,pt,sq,tw){var nx=Math.max(1,Math.floor(g.bs*.5/pt)),i;
 for(i=0;i<NB;i++){var c=P.c[i],col=COL[i%3],left=barX(i,g)-nx*pt/2,ny=Math.floor(c.v*g.ih/pt);
  for(var cc=0;cc<nx;cc++)for(var rw=0;rw<ny;rw++){var al=(.22+.45*rw/Math.max(1,ny))*(.7+.3*hash(i*31+cc*3+rw,tw));if(rw>=ny-1)al=.85;px(left+cc*pt,g.base-(rw+1)*pt,sq,col,Math.min(1,al+c.fl*.15))}}
 for(var x=g.bx-pt;x<g.bx+g.iw+pt;x+=pt*2)px(x,g.base,Math.max(1,sq-1),'8,102,220',.25)}
function dRings(g,pt,sq,tw){var seg=6.2832/NB,gap=.06,rs=[1,.87,.74],fade=[1,.8,.62],i,ri;
 for(ri=0;ri<3;ri++){var r0=g.R*rs[ri];
  for(i=0;i<NB;i++){var c=P.c[i],col=COL[i%3],f=ri===0?c.ring:.15+(ri===1?c.tr:c.lt)*.8,a0=i*seg+gap-1.5708,span=seg-gap*2;
   for(var row=0;row<2;row++){var rad=r0-row*(pt+1),step=Math.max(.012,pt*1.15/Math.max(rad,8));
    for(var a=0;a<span;a+=step){var on=(a/span)<=f,an=a0+a;px(g.cx+Math.cos(an)*rad,g.cy+Math.sin(an)*rad,sq,on?col:'8,102,220',on?Math.min(1,(.5+.35*hash(Math.floor(a*40)+i*13+ri*7,tw))*fade[ri]+c.fl*.3*(ri===0?1:.4)):.1)}}}}}
function dTrend(g,pt,sq,tw){var mt=g.base,i,lo=1,hi=0,xs=[],ys=[];
 for(i=0;i<NB;i++)mt=Math.min(mt,g.base-P.c[i].v*g.ih);
 var tg=Math.max(g.tbMin,mt-g.R*.07);P.tbS=(P.tbS==null||Math.abs(P.tbS-tg)>g.R)?tg:P.tbS+(tg-P.tbS)*.05;var tb=P.tbS,th=g.th;
 for(i=0;i<NB;i++){lo=Math.min(lo,P.c[i].tr);hi=Math.max(hi,P.c[i].tr)}var spn=Math.max(hi-lo,.08);
 for(i=0;i<NB;i++){xs.push(barX(i,g));ys.push(tb-pt*2-(.3+.6*(P.c[i].tr-lo)/spn)*(th-pt*2))}
 for(var xb=g.bx;xb<g.bx+g.iw;xb+=pt*3)px(xb,tb,Math.max(1,sq-2),TC,.12);
 for(i=0;i<NB;i++){var top=g.base-P.c[i].v*g.ih-pt*2;for(var yc=tb+pt*2;yc<top;yc+=pt*2)px(xs[i]-1,yc,2,COL[i%3],.16)}
 for(var x2=g.bx;x2<=g.bx+g.iw;x2+=pt){var y;
  if(x2<=xs[0])y=ys[0];else if(x2>=xs[NB-1])y=ys[NB-1];else{var j=0;while(j<NB-2&&x2>xs[j+1])j++;var u=(x2-xs[j])/(xs[j+1]-xs[j]),m=(1-Math.cos(u*3.1416))/2;y=ys[j]+(ys[j+1]-ys[j])*m}
  var edge=Math.max(0,Math.min(1,(x2-g.bx)/(g.bs*.6),(g.bx+g.iw-x2)/(g.bs*.6)));
  px(x2,y,sq,TC,.92*edge);
  for(var yy=y+pt;yy<tb-pt;yy+=pt){var f=(yy-y)/(tb-y),h=hash(x2,yy+tw);if(h>1-f*.6)continue;px(x2,yy,sq,TC,.36*(1-f)*(1-f)*edge*(.7+.3*h))}}
 for(i=0;i<NB;i++){var c2=P.c[i],cl=COL[i%3];
  for(var a=-1;a<=1;a++)for(var b=-1;b<=1;b++)if(a||b)px(xs[i]+a*pt-pt/2,ys[i]+b*pt-pt/2,sq,cl,.28+c2.fl*.3);
  px(xs[i]-pt/2,ys[i]-pt/2,sq,cl,Math.min(1,.9+c2.fl*.1));
  if(c2.fl>0)for(var q=0;q<8;q++){var an=q*.785;px(xs[i]+Math.cos(an)*(6+(1-c2.fl)*14),ys[i]+Math.sin(an)*(6+(1-c2.fl)*14),2,cl,c2.fl*.6)}}}
function pDraw(dt){if(VB.w<120||H<200)return;var g=geo(),pt=CFG.gran,sq=Math.max(2,pt-1),tw=Math.floor(t*2),i,x,y;
 for(i=0;i<NB;i++){var c=P.c[i];c.v+=(.3-c.v)*dt*.3;c.fl=Math.max(0,c.fl-dt*2);c.ring+=((.15+c.v*.8)-c.ring)*Math.min(1,dt*2.5);c.tr+=(c.v-c.tr)*Math.min(1,dt*.8);c.lt+=(c.v-c.lt)*Math.min(1,dt*.22)}
 var dp=pt*3;for(x=g.cx-g.R;x<g.cx+g.R;x+=dp)for(y=g.cy-g.R;y<g.cy+g.R;y+=dp){if(Math.hypot(x-g.cx,y-g.cy)<g.R*.82&&hash(x,y)>.94)px(x,y,2,'8,102,220',.09)}
 dRings(g,pt,sq,tw);dBars(g,pt,sq,tw);dTrend(g,pt,sq,tw)}

/* ---------- dots: stream in from the left, the cursor steers them, they land in the bars ---------- */
var F={d:[],sp:0};
function fInit(){F.d=[];F.sp=0}
function fDraw(dt){var d=F.d;
 F.sp-=dt;if(F.sp<=0&&d.length<80*DEN()){var yy=rnd(.1,.9)*H,i=Math.max(0,Math.min(NB-1,Math.floor(yy/H*NB)));d.push({x:-8,y:yy,vx:rnd(45,75),vy:rnd(-10,10),i:i,c:COL[i%3],tr:[]});F.sp=rnd(.1,.2)/DEN()}
 F.d=d.filter(function(q){
  var tg=slot(q.i),dx=tg.x-q.x,dy=tg.y-q.y,dist=Math.hypot(dx,dy)||1;
  q.vx+=dx/dist*42*dt;q.vy+=dy/dist*42*dt;if(dist<70){q.vx*=1-2*dt;q.vy*=1-2*dt}
  q.vy+=Math.sin(t*1.6+q.y*.012)*7*dt;
  if(mouse.a>.05){var mx=mouse.x-q.x,my=mouse.y-q.y,md=Math.hypot(mx,my);if(md<240&&md>4){var f=(1-md/240)*170*mouse.a*dt;q.vx+=mx/md*f;q.vy+=my/md*f}}
  var sp=Math.hypot(q.vx,q.vy);if(sp>115){q.vx*=115/sp;q.vy*=115/sp}
  q.x+=q.vx*dt;q.y+=q.vy*dt;
  if(dist<10){land(q.i);return false}
  if(q.y>H+20||q.y<-40)return false;
  if(dt>0){q.tr.push([q.x,q.y]);if(q.tr.length>8)q.tr.shift()}
  for(var k=0;k<q.tr.length;k++){var p=q.tr[q.tr.length-1-k];dot(p[0],p[1],2.8-k*.3,q.c,.85-k*.1)}
  return true})}

/* ---------- cursor burst ---------- */
function doBurst(){if(mouse.a<.05||CFG.burst<=0)return;var arr=[],cnt=Math.max(1,Math.round(5*CFG.burst/100));
 F.d.forEach(function(o){var d=Math.hypot(o.x-mouse.x,o.y-mouse.y);if(d<260)arr.push({o:o,d:d})});
 arr.sort(function(a,b){return a.d-b.d});arr.slice(0,cnt).forEach(function(e){bursts.push({x:e.o.x,y:e.o.y,t:0,c:pick()})})}
function bDraw(dt){var BS=CFG.burst/100,sc=Math.max(.4,Math.min(2.5,BS)),n=Math.round(10+6*Math.min(BS,2)),m=Math.round(6*Math.max(1,Math.min(BS,2)));
 bursts=bursts.filter(function(b){b.t+=dt*1.1;if(b.t>=1)return false;var f=1-b.t,R=5+b.t*38*sc,i;
  for(i=0;i<n;i++){var a=i/n*6.2832+b.x;px(b.x+Math.cos(a)*R,b.y+Math.sin(a)*R,2,b.c,Math.min(1,.55*f*Math.max(.6,BS)))}
  for(i=0;i<m;i++){var a2=i/m*6.2832+b.x;px(b.x+Math.cos(a2)*b.t*30*sc,b.y+Math.sin(a2)*b.t*30*sc,3,b.c,Math.min(1,.85*f))}return true})}

/* ---------- wiring ---------- */
function isPaused(){return reduce.matches||document.hidden||document.body.dataset.motion==='paused'}
function render(d,raw){ctx.clearRect(0,0,W,H);pDraw(d);fDraw(d);bDraw(raw)}
function resize(){var r=cv.getBoundingClientRect(),v=vis.getBoundingClientRect();W=r.width;H=r.height;VB={x:v.left-r.left,y:v.top-r.top,w:v.width,h:v.height};
 var dpr=Math.min(window.devicePixelRatio||1,2);cv.width=Math.round(W*dpr);cv.height=Math.round(H*dpr);ctx.setTransform(dpr,0,0,dpr,0,0);pInit();fInit();drawnPaused=false}
function frame(ts){requestAnimationFrame(frame);var raw=Math.min((ts-last)/1000||0,.05);last=ts;if(!visible||W<1)return;
 if(isPaused()){if(!drawnPaused){render(0,0);drawnPaused=true}return}
 drawnPaused=false;mouse.a+=((mouse.x>-900?1:0)-mouse.a)*Math.min(1,raw*5);var dt=raw*CFG.speed/100;t+=dt;render(dt,raw)}
hero.addEventListener('mousemove',function(e){var r=cv.getBoundingClientRect();mouse.x=e.clientX-r.left;mouse.y=e.clientY-r.top;var now=performance.now();if(now-bt>130){bt=now;doBurst()}});
hero.addEventListener('mouseleave',function(){mouse.x=mouse.y=-999});
if('ResizeObserver' in window)new ResizeObserver(resize).observe(hero);else window.addEventListener('resize',resize);
if('IntersectionObserver' in window)new IntersectionObserver(function(en){visible=en[0].isIntersecting;drawnPaused=false},{threshold:.01}).observe(hero);
resize();requestAnimationFrame(frame);
})();
