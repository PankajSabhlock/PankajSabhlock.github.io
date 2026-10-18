/* Hero flow animation, version 5 engine (ported from anim-preview-5.html).
   Site default: option 6 "Insight Feed" with panel 7 "3-ring donut + bars + trend", plus pixel keywords.
   Settings come from DEFAULTS <- hero-config.json <- this browser's admin preview (localStorage).
   hero:"orbit" switches back to the original orbit visual (git tag hero-orbit-be3dfaa).
   Pauses with the site's motion toggle (body[data-motion="paused"]) and with prefers-reduced-motion. */
(function(){
var hero=document.getElementById('home'),vis=hero&&hero.querySelector('.intelligence-visual');
if(!hero||!vis)return;
var cv=document.createElement('canvas');cv.className='hero-flow';cv.setAttribute('aria-hidden','true');hero.insertBefore(cv,hero.firstChild);
var ctx=cv.getContext('2d');if(!ctx){cv.remove();return}
var DEFAULTS={hero:'flow',mode:6,panel:7,burst:20,density:25,speed:50,opacity:45,size:39,gran:4,kw:true,
 words:['LEADERSHIP','DATA','AI GOVERNANCE','STRATEGIC INSIGHTS','MENTORING','RESPONSIBLE AI','DATA PRODUCTS','DECISION INTELLIGENCE','DATA STRATEGY']};
var LS_KEY='heroFlowPreview';
var HF_CFG=JSON.parse(JSON.stringify(DEFAULTS)),FILE_CFG={};
var W=0,H=0,dpr=1,t=0,last=0,mode=6,mouse={x:-999,y:-999,a:0},bursts=[],bt=0,visible=true,drawnPaused=false,ready=false,VB={x:0,y:0,w:0,h:0};
var reduce=window.matchMedia('(prefers-reduced-motion: reduce)');
var COL=['8,102,220','8,141,147','23,129,87'];
function rnd(a,b){return a+Math.random()*(b-a)}
function pick(){return COL[Math.floor(Math.random()*3)]}
function dot(x,y,r,col,a){if(r<=0||a<=0)return;ctx.fillStyle='rgba('+col+','+a+')';ctx.beginPath();ctx.arc(x,y,r,0,6.2832);ctx.fill()}
function warp(x,y){if(mouse.a>.02){var dx=x-mouse.x,dy=y-mouse.y,d=Math.hypot(dx,dy);if(d<200&&d>1){var k=1-d/200;k=k*k*60*mouse.a;x+=dx/d*k;y+=dy/d*k}}return[x,y]}
var S={};
/* ---------- one BI visual, six selectable styles ---------- */
var CFG=HF_CFG;
var NB=7;
function DEN(){return CFG.density/100}
var P={};
function pInit(){P.c=[];for(var i=0;i<NB;i++)P.c.push({v:.3+Math.random()*.35,st:2+Math.floor(Math.random()*3),fl:0,ring:.5,tr:.35,lt:.35});P.dec=0}
function geo(){var D=Math.min(Math.min(VB.w,VB.h*1.1)*CFG.size/39,H*.92),R=D/2,cx=VB.x+VB.w/2,cy=Math.max(R+4,Math.min(H-R-4,VB.y+VB.h/2)),p=CFG.panel,wide=(p===2||p===4||p===5),iw=wide?D:R*1.35,ih=wide?R*1.3:R*.95;
 if(p===7){iw=R*1.0;ih=R*.6;var b7=cy+R*.42;return{cx:cx,cy:cy,R:R,iw:iw,ih:ih,base:b7,bx:cx-iw/2,bs:iw/NB,p:p,bw:.5,tbMin:cy-R*.2,th:R*.22}}
 return{cx:cx,cy:cy,R:R,iw:iw,ih:ih,base:cy+(wide?ih/2:R*.5),bx:cx-iw/2,bs:iw/NB,p:p}}
function barX(i,g){return g.bx+g.bs*(i+.5)}
function stackMode(){return S[mode]&&S[mode].panel==='stack'}
function capFor(g){return (g.p===1||g.p===2||g.p===7)?Math.max(4,Math.floor(g.ih/(CFG.gran+2))):12}
function val(c,g){return stackMode()?Math.min(1,c.st/capFor(g)):c.v}
function slot(i){var g=geo(),c=P.c[i],p=g.p,vl=val(c,g);
 if(p===3){var an=-1.5708+i*6.2832/NB,L=g.R*.3+g.R*.62*vl+g.R*.04;return{x:g.cx+Math.cos(an)*L,y:g.cy+Math.sin(an)*L}}
 if(p===6){var rr=g.R*(.96-i*.105),a2=-1.5708+c.ring*6.2832;return{x:g.cx+Math.cos(a2)*rr,y:g.cy+Math.sin(a2)*rr}}
 if(p===5){var ch=g.ih/8,lit=Math.max(1,Math.round(vl*8));return{x:barX(i,g),y:g.base-lit*ch-ch/2}}
 if(p===4)return{x:barX(i,g),y:g.base-vl*g.ih};
 return{x:barX(i,g),y:stackMode()?g.base-6-c.st*(CFG.gran+2):g.base-c.v*g.ih}}
function land(i){var c=P.c[i],g=geo();c.fl=1;if(stackMode())c.st=Math.min(capFor(g),c.st+1);else c.v=Math.min(1,c.v+.07)}
function hash(x,y){var n=Math.sin(x*12.9898+y*78.233)*43758.5453;return n-Math.floor(n)}
function px(x,y,sz,col,a){if(a<=0)return;ctx.fillStyle='rgba('+col+','+a+')';ctx.fillRect(Math.round(x),Math.round(y),sz,sz)}
function dLine(g,pt,sq,n){for(var k=1;k<=n;k++){var y=g.base-g.ih*k/n;for(var x=g.bx;x<g.bx+g.iw;x+=pt*3)px(x,y,Math.max(1,sq-2),'8,102,220',.12)}}
function dBars(g,pt,sq,tw){var st=stackMode(),nx=Math.max(1,Math.floor(g.bs*(g.bw||.62)/pt)),i;
 for(i=0;i<NB;i++){var c=P.c[i],col=COL[i%3],left=barX(i,g)-nx*pt/2;
  if(st){for(var k=0;k<c.st;k++){var by=g.base-6-k*(pt+2);for(var u=0;u<nx;u++)px(left+u*pt,by,sq,col,.45+.4*hash(i*7+k+u,tw))}}
  else{var ny=Math.floor(c.v*g.ih/pt);for(var cc=0;cc<nx;cc++)for(var rw=0;rw<ny;rw++){var al=(.22+.45*rw/Math.max(1,ny))*(.7+.3*hash(i*31+cc*3+rw,tw));if(rw>=ny-1)al=.85;px(left+cc*pt,g.base-(rw+1)*pt,sq,col,Math.min(1,al+c.fl*.15))}}}
 for(var x=g.bx-pt;x<g.bx+g.iw+pt;x+=pt*2)px(x,g.base,Math.max(1,sq-1),'8,102,220',.25)}
function dDonut(g,pt,sq,tw){var seg=6.2832/NB,gap=.07,i;
 for(i=0;i<NB;i++){var c=P.c[i],col=COL[i%3],a0=i*seg+gap-1.5708,span=seg-gap*2;
  for(var ring=0;ring<3;ring++){var rad=g.R-ring*(pt+1),step=Math.max(.012,pt*1.15/Math.max(rad,8));
   for(var a=0;a<span;a+=step){var on=(a/span)<=c.ring,an=a0+a;px(g.cx+Math.cos(an)*rad,g.cy+Math.sin(an)*rad,sq,on?col:'8,102,220',on?Math.min(1,.5+.35*hash(Math.floor(a*40)+i*13,tw)+c.fl*.3):.12)}}}}
function dRadial(g,pt,sq,tw){var i,r0=g.R*.3;
 for(var a=0;a<6.2832;a+=.05){px(g.cx+Math.cos(a)*r0,g.cy+Math.sin(a)*r0,2,'8,102,220',.16);px(g.cx+Math.cos(a)*g.R*.96,g.cy+Math.sin(a)*g.R*.96,2,'8,102,220',.12)}
 for(i=0;i<NB;i++){var c=P.c[i],col=COL[i%3],an=-1.5708+i*6.2832/NB,ca=Math.cos(an),sa=Math.sin(an),L=g.R*.62*val(c,g);
  for(var r=r0;r<g.R*.92;r+=pt*2)px(g.cx+ca*r,g.cy+sa*r,2,col,.08);
  for(var r2=r0;r2<=r0+L;r2+=pt){var k=(r2-r0)/(L+1);for(var o=-1;o<=1;o++)px(g.cx+ca*r2-sa*o*pt,g.cy+sa*r2+ca*o*pt,sq,col,Math.min(1,(.25+.5*k)*(.75+.25*hash(r2+i,tw))+c.fl*.2))}}}
function dTrend(g,pt,sq,tw){var xs=[],ys=[],i;for(i=0;i<NB;i++){xs.push(barX(i,g));ys.push(g.base-val(P.c[i],g)*g.ih)}
 dLine(g,pt,sq,3);
 for(var x=xs[0];x<=xs[NB-1];x+=pt){var j=0;while(j<NB-2&&x>xs[j+1])j++;var u=(x-xs[j])/(xs[j+1]-xs[j]),m=(1-Math.cos(u*3.1416))/2,y=ys[j]+(ys[j+1]-ys[j])*m,col=COL[j%3];
  px(x,y,sq,col,.9);for(var yy=y+pt;yy<g.base;yy+=pt)px(x,yy,sq,col,Math.max(.04,.4*(1-(yy-y)/(g.base-y+1))*(.7+.3*hash(x,yy+tw))))}
 for(i=0;i<NB;i++){var c=P.c[i];for(var a=0;a<2;a++)for(var b=0;b<2;b++)px(xs[i]-pt+a*pt,ys[i]-pt+b*pt,sq,COL[i%3],Math.min(1,.7+c.fl*.3));
  if(c.fl>0)for(var q=0;q<10;q++){var an=q*.628;px(xs[i]+Math.cos(an)*(6+(1-c.fl)*18),ys[i]+Math.sin(an)*(6+(1-c.fl)*18),2,COL[i%3],c.fl*.7)}}
 for(var x2=g.bx;x2<g.bx+g.iw;x2+=pt*2)px(x2,g.base,Math.max(1,sq-1),'8,102,220',.25)}
function dHeat(g,pt,sq,tw){var nr=8,cw=g.bs*.86,chh=g.ih/nr,nxg=Math.max(1,Math.floor(cw/pt)),nyg=Math.max(1,Math.floor(chh*.82/pt));
 for(var i=0;i<NB;i++){var c=P.c[i],col=COL[i%3],lit=Math.max(1,Math.round(val(c,g)*nr)),cx0=barX(i,g)-nxg*pt/2;
  for(var r=0;r<nr;r++){var on=r<lit,top=g.base-(r+1)*chh+(chh-nyg*pt)/2;
   for(var a=0;a<nxg;a++)for(var b=0;b<nyg;b++){var h=hash(i*17+a+r*5+b,tw);px(cx0+a*pt,top+b*pt,sq,on?col:'8,102,220',on?Math.min(1,(.28+.5*r/nr)*(.75+.25*h)+(r===lit-1?c.fl*.3:0)):.06)}}}}
function dRings(g,pt,sq,tw){for(var i=0;i<NB;i++){var c=P.c[i],col=COL[i%3],rr=g.R*(.96-i*.105);
  for(var row=0;row<2;row++){var rad=rr-row*(pt+1),step=Math.max(.012,pt*1.15/Math.max(rad,8));
   for(var a=0;a<6.2832;a+=step){var on=(a/6.2832)<=c.ring,an=a-1.5708;px(g.cx+Math.cos(an)*rad,g.cy+Math.sin(an)*rad,sq,on?col:'8,102,220',on?Math.min(1,.5+.35*hash(Math.floor(a*30)+i*11,tw)+c.fl*.3):.1)}}}}
/* panel 7: three rings (now / short trend / long trend) + bars + trend area above the bars */
function dDonut3(g,pt,sq,tw){var seg=6.2832/NB,gap=.06,rs=[1,.87,.74],fade=[1,.8,.62],i,ri;
 for(ri=0;ri<3;ri++){var r0=g.R*rs[ri];
  for(i=0;i<NB;i++){var c=P.c[i],col=COL[i%3],f=ri===0?c.ring:.15+(ri===1?c.tr:c.lt)*.8,a0=i*seg+gap-1.5708,span=seg-gap*2;
   for(var row=0;row<2;row++){var rad=r0-row*(pt+1),step=Math.max(.012,pt*1.15/Math.max(rad,8));
    for(var a=0;a<span;a+=step){var on=(a/span)<=f,an=a0+a;px(g.cx+Math.cos(an)*rad,g.cy+Math.sin(an)*rad,sq,on?col:'8,102,220',on?Math.min(1,(.5+.35*hash(Math.floor(a*40)+i*13+ri*7,tw))*fade[ri]+c.fl*.3*(ri===0?1:.4)):.1)}}}}}
function dTrendTop(g,pt,sq,tw){var mt=g.base,k0;for(k0=0;k0<NB;k0++)mt=Math.min(mt,g.base-val(P.c[k0],g)*g.ih);var tg=Math.max(g.tbMin,mt-g.R*.07);P.tbS=(P.tbS==null||Math.abs(P.tbS-tg)>g.R)?tg:P.tbS+(tg-P.tbS)*.05;var tb=P.tbS,th=g.th,xs=[],ys=[],i,lo=1,hi=0,TC='8,141,147';
 for(i=0;i<NB;i++){lo=Math.min(lo,P.c[i].tr);hi=Math.max(hi,P.c[i].tr)}var spn=Math.max(hi-lo,.08);
 for(i=0;i<NB;i++){xs.push(barX(i,g));ys.push(tb-pt*2-(.3+.6*(P.c[i].tr-lo)/spn)*(th-pt*2))}
 for(var xb=g.bx;xb<g.bx+g.iw;xb+=pt*3)px(xb,tb,Math.max(1,sq-2),TC,.12);
 for(i=0;i<NB;i++){var top=g.base-val(P.c[i],g)*g.ih-pt*2;for(var yc=tb+pt*2;yc<top;yc+=pt*2)px(xs[i]-1,yc,2,COL[i%3],.16)}
 for(var x2=g.bx;x2<=g.bx+g.iw;x2+=pt){var y;
  if(x2<=xs[0])y=ys[0];else if(x2>=xs[NB-1])y=ys[NB-1];else{var j=0;while(j<NB-2&&x2>xs[j+1])j++;var u=(x2-xs[j])/(xs[j+1]-xs[j]),m=(1-Math.cos(u*3.1416))/2;y=ys[j]+(ys[j+1]-ys[j])*m}
  var edge=Math.max(0,Math.min(1,(x2-g.bx)/(g.bs*.6),(g.bx+g.iw-x2)/(g.bs*.6)));
  px(x2,y,sq,TC,.92*edge);
  for(var yy=y+pt;yy<tb-pt;yy+=pt){var f=(yy-y)/(tb-y),h=hash(x2,yy+tw);if(h>1-f*.6)continue;px(x2,yy,sq,TC,.36*(1-f)*(1-f)*edge*(.7+.3*h))}}
 for(i=0;i<NB;i++){var c2=P.c[i],cl=COL[i%3];
  for(var a=-1;a<=1;a++)for(var b=-1;b<=1;b++)if(a||b)px(xs[i]+a*pt-pt/2,ys[i]+b*pt-pt/2,sq,cl,.28+c2.fl*.3);
  px(xs[i]-pt/2,ys[i]-pt/2,sq,cl,Math.min(1,.9+c2.fl*.1));
  if(c2.fl>0)for(var q=0;q<8;q++){var an=q*.785;px(xs[i]+Math.cos(an)*(6+(1-c2.fl)*14),ys[i]+Math.sin(an)*(6+(1-c2.fl)*14),2,cl,c2.fl*.6)}}}
function pDraw(dt){if(W<200||H<200)return;var g=geo(),pt=CFG.gran,sq=Math.max(2,pt-1),tw=Math.floor(t*2),i,x,y;
 for(i=0;i<NB;i++){var c=P.c[i];if(!stackMode())c.v+=(.3-c.v)*dt*.3;c.fl=Math.max(0,c.fl-dt*2);c.ring+=((.15+val(c,g)*.8)-c.ring)*Math.min(1,dt*2.5);c.tr+=(val(c,g)-c.tr)*Math.min(1,dt*.8);c.lt+=(val(c,g)-c.lt)*Math.min(1,dt*.22)}
 P.dec-=dt;if(P.dec<=0){var r=Math.floor(Math.random()*NB);if(P.c[r].st>2)P.c[r].st--;P.dec=.6}
 var dp=pt*3;for(x=g.cx-g.R;x<g.cx+g.R;x+=dp)for(y=g.cy-g.R;y<g.cy+g.R;y+=dp){if(Math.hypot(x-g.cx,y-g.cy)<g.R*.82&&hash(x,y)>.94)px(x,y,2,'8,102,220',.09)}
 if(g.p===1){dDonut(g,pt,sq,tw);dBars(g,pt,sq,tw)}
 else if(g.p===7){dDonut3(g,pt,sq,tw);dBars(g,pt,sq,tw);dTrendTop(g,pt,sq,tw)}
 else if(g.p===2){dLine(g,pt,sq,4);dBars(g,pt,sq,tw)}
 else if(g.p===3)dRadial(g,pt,sq,tw);
 else if(g.p===4)dTrend(g,pt,sq,tw);
 else if(g.p===5)dHeat(g,pt,sq,tw);
 else dRings(g,pt,sq,tw)}/* ---------- cursor burst: nearest dots bloom, strength is adjustable ---------- */
function doBurst(){var s=S[mode];if(!s||!s.pts||mouse.a<.05||CFG.burst<=0)return;var ps=s.pts(),arr=[],cnt=Math.max(1,Math.round(5*CFG.burst/100));
 for(var i=0;i<ps.length;i++){var d=Math.hypot(ps[i].x-mouse.x,ps[i].y-mouse.y);if(d<260)arr.push({o:ps[i],d:d})}
 arr.sort(function(a,b){return a.d-b.d});arr.slice(0,cnt).forEach(function(e){bursts.push({x:e.o.x,y:e.o.y,t:0,c:pick()});if(s.onBurst)s.onBurst(e.o)})}
function bDraw(dt){var BS=CFG.burst/100,sc=Math.max(.4,Math.min(2.5,BS)),n=Math.round(10+6*Math.min(BS,2)),m=Math.round(6*Math.max(1,Math.min(BS,2)));
 bursts=bursts.filter(function(b){b.t+=dt*1.1;if(b.t>=1)return false;var f=1-b.t,R=5+b.t*38*sc,i;
 for(i=0;i<n;i++){var a=i/n*6.2832+b.x;px(b.x+Math.cos(a)*R,b.y+Math.sin(a)*R,2,b.c,Math.min(1,.55*f*Math.max(.6,BS)))}
 for(i=0;i<m;i++){var a2=i/m*6.2832+b.x;px(b.x+Math.cos(a2)*b.t*30*sc,b.y+Math.sin(a2)*b.t*30*sc,3,b.c,Math.min(1,.85*f))}return true})}/* ---------- 1 to 5: refined originals ---------- */
S[1]={name:'1  Signal Flow: signals hop node to node, cursor makes the nearest five bloom',
init:function(){var n=Math.max(26,Math.min(60,Math.round(W*H/17000)));this.nodes=[];for(var i=0;i<n;i++)this.nodes.push({x:rnd(20,W-20),y:rnd(20,H-20),ph:rnd(0,6.28),adj:[],i:i});
var N=this.nodes,seen={};N.forEach(function(a,i){N.map(function(b,j){return{j:j,d:(a.x-b.x)*(a.x-b.x)+(a.y-b.y)*(a.y-b.y)}}).filter(function(o){return o.j!==i}).sort(function(p,q){return p.d-q.d}).slice(0,3).forEach(function(o){var k=i<o.j?i+'-'+o.j:o.j+'-'+i;if(!seen[k]){seen[k]=1;a.adj.push(o.j);N[o.j].adj.push(i)}})});
this.pulses=[];this.spawn=0},
pts:function(){return this.nodes},
onBurst:function(n){if(n.adj.length&&this.pulses.length<40)this.pulses.push({from:n.i,to:n.adj[Math.floor(Math.random()*n.adj.length)],p:0,hops:0,sp:.6,c:'8,141,147'})},
draw:function(dt){var N=this.nodes;ctx.lineWidth=1;
N.forEach(function(a,i){a.adj.forEach(function(j){if(j>i){ctx.strokeStyle='rgba(8,102,220,.15)';ctx.beginPath();ctx.moveTo(a.x,a.y);ctx.lineTo(N[j].x,N[j].y);ctx.stroke()}})});
N.forEach(function(a){dot(a.x,a.y,2+Math.sin(t*.8+a.ph)*.6,'8,102,220',.35)});
this.spawn-=dt;if(this.spawn<=0&&this.pulses.length<22){var i=Math.floor(Math.random()*N.length);if(N[i].adj.length){this.pulses.push({from:i,to:N[i].adj[Math.floor(Math.random()*N[i].adj.length)],p:0,hops:0,sp:rnd(.35,.6),c:pick()})}this.spawn=rnd(.15,.4)}
this.pulses=this.pulses.filter(function(q){q.p+=dt*q.sp;if(q.p>=1){var nx=N[q.to];var opts=nx.adj.filter(function(k){return k!==q.from});q.hops++;if(q.hops>4||!opts.length)return false;q.from=q.to;q.to=opts[Math.floor(Math.random()*opts.length)];q.p=0}
var a=N[q.from],b=N[q.to],life=1-q.hops/5;
for(var k=0;k<7;k++){var pp=Math.max(0,q.p-k*.035);dot(a.x+(b.x-a.x)*pp,a.y+(b.y-a.y)*pp,3.2-k*.38,q.c,(.8-k*.11)*life)}
ctx.strokeStyle='rgba('+q.c+','+(.28*life)+')';ctx.beginPath();ctx.moveTo(a.x,a.y);ctx.lineTo(a.x+(b.x-a.x)*q.p,a.y+(b.y-a.y)*q.p);ctx.stroke();return true})}};
S[2]={name:'2  Constellation: dots drift and step aside for the cursor, lines reach to it',
init:function(){var n=Math.max(40,Math.min(100,Math.round(W*H/13000)));this.p=[];for(var i=0;i<n;i++)this.p.push({x:rnd(0,W),y:rnd(0,H),vx:rnd(-.18,.18),vy:rnd(-.18,.18),c:COL[i%3],r:rnd(1.4,2.6)})},
pts:function(){return this.p},
draw:function(dt){var P2=this.p;P2.forEach(function(a){a.x+=a.vx*dt*60;a.y+=a.vy*dt*60;var dx=a.x-mouse.x,dy=a.y-mouse.y,dd=Math.hypot(dx,dy);if(dd<130&&dd>1&&mouse.a>.05){a.x+=dx/dd*(1-dd/130)*1.6*mouse.a;a.y+=dy/dd*(1-dd/130)*1.6*mouse.a}
if(a.x<-10)a.x=W+10;if(a.x>W+10)a.x=-10;if(a.y<-10)a.y=H+10;if(a.y>H+10)a.y=-10});
ctx.lineWidth=1;for(var i=0;i<P2.length;i++){var a=P2[i];for(var j=i+1;j<P2.length;j++){var b=P2[j],d=Math.hypot(a.x-b.x,a.y-b.y);if(d<140){ctx.strokeStyle='rgba(8,102,220,'+(1-d/140)*.3+')';ctx.beginPath();ctx.moveTo(a.x,a.y);ctx.lineTo(b.x,b.y);ctx.stroke()}}
var dm=Math.hypot(a.x-mouse.x,a.y-mouse.y);if(dm<170){ctx.strokeStyle='rgba(8,141,147,'+(1-dm/170)*.5*mouse.a+')';ctx.beginPath();ctx.moveTo(a.x,a.y);ctx.lineTo(mouse.x,mouse.y);ctx.stroke()}
dot(a.x,a.y,a.r,a.c,.55)}}};
function mkCurve(){var y0=rnd(.1,.9)*H;return{p0:[-20,y0],p1:[W*.3,y0+rnd(-1,1)*H*.35],p2:[W*.7,y0+rnd(-1,1)*H*.35],p3:[W+20,y0+rnd(-.4,.4)*H],life:rnd(0,1),dur:rnd(8,13),c:pick(),dots:[rnd(0,1),rnd(0,1),rnd(0,1)],sp:rnd(.07,.14)}}
function bz(c,u){var m=1-u;function f(i){return m*m*m*c.p0[i]+3*m*m*u*c.p1[i]+3*m*u*u*c.p2[i]+u*u*u*c.p3[i]}return warp(f(0),f(1))}
S[3]={name:'3  Data Streams: flowing curves bend around the cursor, bloom when it nears',
init:function(){this.c=[];this.cur=[];for(var i=0;i<9;i++)this.c.push(mkCurve())},
pts:function(){return this.cur},
draw:function(dt){var self=this;this.cur=[];this.c.forEach(function(c,i){c.life+=dt/c.dur;if(c.life>=1){self.c[i]=mkCurve();self.c[i].life=0;return}var al=Math.sin(Math.PI*c.life);ctx.lineWidth=1;ctx.strokeStyle='rgba('+c.c+','+(.2*al)+')';ctx.beginPath();for(var k=0;k<=40;k++){var q=bz(c,k/40);k?ctx.lineTo(q[0],q[1]):ctx.moveTo(q[0],q[1])}ctx.stroke();
c.dots=c.dots.map(function(u){u+=dt*c.sp;return u>1?u-1:u});c.dots.forEach(function(u){for(var k=0;k<6;k++){var uu=u-k*.012;if(uu<0)continue;var q2=bz(c,uu);dot(q2[0],q2[1],3-k*.4,c.c,(.85-k*.13)*al);if(k===0)self.cur.push({x:q2[0],y:q2[1]})}})})}};
S[4]={name:'4  Wave Rows: nine soft dotted waves, the cursor lifts them like a hand under cloth',
init:function(){this.d=[]},
pts:function(){return this.d},
draw:function(dt){var n=9,d=this.d=[];ctx.lineWidth=1;
for(var r=0;r<n;r++){var y0=H*(.1+.8*r/(n-1)),pp=[];
for(var x=-10;x<=W+10;x+=22){var s1=Math.sin(x*.006+t*.8+r*.7),y=y0+s1*16+Math.sin(x*.013-t*.5+r*1.3)*7,dx=x-mouse.x,dy=y0-mouse.y;
y-=mouse.a*55*Math.exp(-(dx*dx)/(2*130*130))*Math.exp(-(dy*dy)/(2*120*120));pp.push([x,y,(s1+1)/2]);d.push({x:x,y:y})}
ctx.strokeStyle='rgba('+COL[r%3]+',.1)';ctx.beginPath();pp.forEach(function(p,i){i?ctx.lineTo(p[0],p[1]):ctx.moveTo(p[0],p[1])});ctx.stroke();
pp.forEach(function(p){dot(p[0],p[1],.9+p[2]*1.3,COL[r%3],.18+p[2]*.42)})}}};
S[5]={name:'5  Neural Layers: signals cross a layered network, cursor lights the nodes it touches',
init:function(){var cols=[4,6,7,6,4];this.L=[];this.flat=[];var x0=W*.08,x1=W*.92,self=this;cols.forEach(function(n,i){var l=[];for(var k=0;k<n;k++){var o={x:x0+(x1-x0)*i/(cols.length-1),y:H*.14+(H*.72)*(k/(n-1)),g:0};l.push(o);self.flat.push(o)}self.L.push(l)});this.s=[];this.sp=0},
pts:function(){return this.flat},
onBurst:function(n){n.g=1},
draw:function(dt){var L=this.L;ctx.lineWidth=1;for(var i=0;i<L.length-1;i++)L[i].forEach(function(a){L[i+1].forEach(function(b){ctx.strokeStyle='rgba(8,102,220,.07)';ctx.beginPath();ctx.moveTo(a.x,a.y);ctx.lineTo(b.x,b.y);ctx.stroke()})});
this.sp-=dt;if(this.sp<=0&&this.s.length<16){var a0=L[0][Math.floor(Math.random()*L[0].length)];this.s.push({l:0,a:a0,b:L[1][Math.floor(Math.random()*L[1].length)],p:0,c:pick(),sp:rnd(.5,.8)});this.sp=rnd(.2,.45)}
this.s=this.s.filter(function(q){q.p+=dt*q.sp;if(q.p>=1){q.b.g=1;q.l++;if(q.l>=L.length-1)return false;q.a=q.b;q.b=L[q.l+1][Math.floor(Math.random()*L[q.l+1].length)];q.p=0}
var e=q.p*q.p*(3-2*q.p);for(var k=0;k<6;k++){var pp=Math.max(0,e-k*.05);dot(q.a.x+(q.b.x-q.a.x)*pp,q.a.y+(q.b.y-q.a.y)*pp,3-k*.4,q.c,.85-k*.13)}
ctx.strokeStyle='rgba('+q.c+',.3)';ctx.beginPath();ctx.moveTo(q.a.x,q.a.y);ctx.lineTo(q.a.x+(q.b.x-q.a.x)*e,q.a.y+(q.b.y-q.a.y)*e);ctx.stroke();return true});
L.forEach(function(l){l.forEach(function(n){n.g=Math.max(0,n.g-dt*1.4);dot(n.x,n.y,5+n.g*5,'8,141,147',.05+n.g*.18);dot(n.x,n.y,2.4,'8,102,220',.4+n.g*.5)})})}};
/* ---------- 6 to 10: dots feed the BI panel ---------- */
function mkFlow(name,o){return{name:name,panel:o.stack?'stack':'bars',
init:function(){this.d=[];this.sp=0;this.gl=[]},
pts:function(){return this.d},
draw:function(dt){var self=this,d=this.d,gx=W*.42;
 if(o.gate){ctx.strokeStyle='rgba(8,102,220,.22)';ctx.lineWidth=1;ctx.setLineDash([4,7]);ctx.beginPath();ctx.moveTo(gx,H*.1);ctx.lineTo(gx,H*.9);ctx.stroke();ctx.setLineDash([]);ctx.fillStyle='rgba(15,27,45,.5)';ctx.font='600 10px system-ui,sans-serif';ctx.fillText('GOVERNANCE CHECK',gx+8,H*.1+4)}
 this.gl=this.gl.filter(function(g){g.t+=dt*1.2;dot(gx,g.y,5+g.t*26,g.c,.35*(1-g.t));return g.t<1});
 this.sp-=dt;if(this.sp<=0&&d.length<80*DEN()){var yy=rnd(.1,.9)*H,i=Math.max(0,Math.min(NB-1,Math.floor(yy/H*NB)));d.push({x:-8,y:yy,vx:rnd(45,75),vy:rnd(-10,10),i:i,c:COL[i%3],st:0,al:1,tr:[]});this.sp=rnd(.1,.2)/DEN()}
 this.d=d.filter(function(q){
  var tg=slot(q.i),dx=tg.x-q.x,dy=tg.y-q.y,dist=Math.hypot(dx,dy)||1;
  if(q.st===2){q.vy+=30*dt;q.al-=dt*.45}else{var k=o.gate&&q.x<gx?.35:1;q.vx+=dx/dist*42*dt*k;q.vy+=dy/dist*42*dt*k;if(dist<70){q.vx*=1-2*dt;q.vy*=1-2*dt}}
  q.vy+=Math.sin(t*1.6+q.y*.012)*7*dt;
  if(mouse.a>.05){var mx=mouse.x-q.x,my=mouse.y-q.y,md=Math.hypot(mx,my);if(md<240&&md>4){var f=(1-md/240)*170*mouse.a*dt;q.vx+=mx/md*f;q.vy+=my/md*f}}
  var sp=Math.hypot(q.vx,q.vy);if(sp>115){q.vx*=115/sp;q.vy*=115/sp}
  q.x+=q.vx*dt;q.y+=q.vy*dt;
  if(o.gate&&q.st===0&&q.x>gx){if(Math.random()<.25){q.st=2;q.c='214,140,20'}else{q.st=1;q.c='23,129,87'}self.gl.push({y:q.y,t:0,c:q.c})}
  if(q.st!==2&&dist<10){land(q.i);return false}
  if(q.al<=0||q.y>H+20)return false;
  q.tr.push([q.x,q.y]);if(q.tr.length>8)q.tr.shift();
  for(var k2=0;k2<q.tr.length;k2++){var p=q.tr[q.tr.length-1-k2];dot(p[0],p[1],2.8-k2*.3,q.c,(.85-k2*.1)*q.al)}
  return true})}}}
S[6]=mkFlow('6  Insight Feed: dots stream in slowly from the left, the cursor steers them, the panel grows as they land',{});
S[7]=mkFlow('7  Governance Gate: raw dots pass a check, trusted ones turn green and feed the panel, flagged ones drop out',{gate:true});
S[8]={name:'8  Decision Tree: signals branch left to right, the cursor picks the branch, outcomes land in the panel',panel:'bars',
init:function(){var r={x:W*.07,y:H*.5,g:0},l1=[],l2=[];[.27,.5,.73].forEach(function(f){l1.push({x:W*.21,y:H*f,g:0})});for(var k=0;k<NB;k++)l2.push({x:W*.36,y:H*(.14+.12*k),g:0,par:Math.min(2,Math.floor(k*3/NB))});this.r=r;this.l1=l1;this.l2=l2;this.s=[];this.sp=0},
pts:function(){return [this.r].concat(this.l1,this.l2)},
onBurst:function(n){n.g=1},
draw:function(dt){var r=this.r,l1=this.l1,l2=this.l2;ctx.lineWidth=1;
function edge(a,b){ctx.strokeStyle='rgba(8,102,220,.14)';ctx.beginPath();ctx.moveTo(a.x,a.y);ctx.lineTo(b.x,b.y);ctx.stroke()}
l1.forEach(function(a){edge(r,a)});l2.forEach(function(b){edge(l1[b.par],b)});
this.sp-=dt;if(this.sp<=0&&this.s.length<16*DEN()){var k=Math.floor(Math.random()*NB);if(mouse.a>.2&&Math.random()<.65){var bd=1e9;l2.forEach(function(b,i){var d=Math.abs(b.y-mouse.y);if(d<bd){bd=d;k=i}})}this.s.push({k:k,h:0,p:0,c:COL[k%3]});this.sp=rnd(.25,.5)/DEN()}
this.s=this.s.filter(function(q){var path=[r,l1[l2[q.k].par],l2[q.k],slot(q.k)];q.p+=dt*(q.h===2?.4:.85);
 if(q.p>=1){path[q.h+1].g=1;q.h++;q.p=0;if(q.h>=3){land(q.k);return false}}
 var a=path[q.h],b=path[q.h+1],e=q.p*q.p*(3-2*q.p);
 for(var k2=0;k2<6;k2++){var pp=Math.max(0,e-k2*.05);dot(a.x+(b.x-a.x)*pp,a.y+(b.y-a.y)*pp,3-k2*.4,q.c,.85-k2*.13)}
 ctx.strokeStyle='rgba('+q.c+',.3)';ctx.beginPath();ctx.moveTo(a.x,a.y);ctx.lineTo(a.x+(b.x-a.x)*e,a.y+(b.y-a.y)*e);ctx.stroke();return true});
[r].concat(l1,l2).forEach(function(n){n.g=Math.max(0,n.g-dt*1.4);dot(n.x,n.y,5+n.g*5,'8,141,147',.05+n.g*.18);dot(n.x,n.y,2.6,'8,102,220',.4+n.g*.5)})}};
S[9]=mkFlow('9  Dot Histogram: the dots become the chart, stacking into bars that rise and settle',{stack:true});
S[10]={name:'10  Converging Streams: nine curves bend around the cursor and converge into the panel bars',panel:'bars',
init:function(){this.c=[];for(var k=0;k<9;k++)this.c.push({y0:H*(.1+.8*k/8),b:k%NB,c:COL[k%3],u:[rnd(0,1),rnd(0,1),rnd(0,1)],sp:rnd(.07,.11),w:rnd(-.3,.3)});this.cur=[]},
pts:function(){return this.cur},
draw:function(dt){var self=this;this.cur=[];this.c.forEach(function(c){var tg=slot(c.b),p0=[-20,c.y0],p1=[W*.22,c.y0+c.w*H*.3],p2=[W*.45,tg.y+(c.y0-tg.y)*.2+c.w*H*.2],p3=[tg.x,tg.y];
 function B(u){var m=1-u;return warp(m*m*m*p0[0]+3*m*m*u*p1[0]+3*m*u*u*p2[0]+u*u*u*p3[0],m*m*m*p0[1]+3*m*m*u*p1[1]+3*m*u*u*p2[1]+u*u*u*p3[1])}
 ctx.lineWidth=1;ctx.strokeStyle='rgba('+c.c+',.17)';ctx.beginPath();for(var k=0;k<=48;k++){var q=B(k/48);k?ctx.lineTo(q[0],q[1]):ctx.moveTo(q[0],q[1])}ctx.stroke();
 var nd=Math.max(1,Math.min(3,Math.round(3*DEN())));c.u=c.u.map(function(u,ui){if(ui>=nd)return u;u+=dt*c.sp;if(u>=1){land(c.b);u-=1}return u});
 c.u.forEach(function(u,ui){if(ui>=nd)return;for(var k=0;k<6;k++){var uu=u-k*.012;if(uu<0)continue;var q2=B(uu);dot(q2[0],q2[1],3-k*.4,c.c,.85-k*.13);if(k===0)self.cur.push({x:q2[0],y:q2[1]})}})})}};
/* ---------- pixel keywords: words assemble from granules, hold, then dissolve ---------- */
var KW={i:-1,ph:99,cells:[],key:''},KOC=document.createElement('canvas'),KOX=KOC.getContext('2d',{willReadFrequently:true});
var KW_IN=.9,KW_HOLD=3.4,KW_END=4.2;
function kwBox(g){var p=g.p;
 if(p===7||p===1)return{x:g.cx,y:g.cy-g.R*.5,w:g.R*.78,h:g.R*.13};
 if(p===2||p===4||p===5)return{x:g.cx,y:g.cy-g.R*.85,w:g.R*1.3,h:g.R*.15};
 return{x:g.cx,y:g.cy,w:g.R*.5,h:g.R*.1}}
function kwBuild(word,b){var cells=[];if(!KOX)return cells;var kp=Math.max(2,Math.round(CFG.gran*.75)),fs=Math.max(10,Math.floor(b.h));
 KOX.font='700 '+fs+'px system-ui,-apple-system,"Segoe UI",sans-serif';var w=KOX.measureText(word).width;if(w>b.w)fs=Math.max(8,Math.floor(fs*b.w/w));
 KOC.width=Math.ceil(b.w)+8;KOC.height=Math.ceil(fs*1.4)+8;KOX.clearRect(0,0,KOC.width,KOC.height);
 KOX.font='700 '+fs+'px system-ui,-apple-system,"Segoe UI",sans-serif';KOX.textAlign='center';KOX.textBaseline='middle';KOX.fillStyle='#000';KOX.fillText(word,KOC.width/2,KOC.height/2);
 var data;try{data=KOX.getImageData(0,0,KOC.width,KOC.height).data}catch(e){return cells}
 for(var y=0;y<KOC.height;y+=kp)for(var x=0;x<KOC.width;x+=kp){var a=data[((y+(kp>>1))*KOC.width+x+(kp>>1))*4+3];
  if(a>110){var cx=x-KOC.width/2,cy=y-KOC.height/2,f=(cx/b.w)+.5;cells.push({x:cx,y:cy,sx:cx+rnd(-1,1)*b.w*.45,sy:cy+rnd(-1,1)*b.h*2.2,d:Math.random(),c:COL[Math.max(0,Math.min(2,Math.floor(f*3)))]})}}
 cells.kp=kp;return cells}
function kwDraw(dt,g){var list=(CFG.words||[]).filter(function(s){return s&&String(s).trim()});if(!CFG.kw||!list.length)return;
 KW.ph+=dt;if(KW.ph>=KW_END){KW.i=(KW.i+1)%list.length;KW.ph=0;KW.key=''}
 var b=kwBox(g),word=String(list[KW.i%list.length]).toUpperCase().trim(),key=word+'|'+Math.round(b.w)+'|'+CFG.gran;
 if(KW.key!==key){KW.cells=kwBuild(word,b);KW.key=key}
 var kp=KW.cells.kp||2,sq=Math.max(2,kp-1),ph=KW.ph,tw=Math.floor(t*3);
 for(var i=0;i<KW.cells.length;i++){var c=KW.cells[i],x,y,a;
  if(ph<KW_IN){var k=Math.max(0,Math.min(1,(ph-c.d*.35)/.55));k=k*k*(3-2*k);x=c.sx+(c.x-c.sx)*k;y=c.sy+(c.y-c.sy)*k;a=.75*k}
  else if(ph<KW_HOLD){x=c.x;y=c.y;a=.55+.3*hash(i,tw)}
  else{var k2=Math.max(0,Math.min(1,(ph-KW_HOLD-c.d*.3)/.5));x=c.x+(c.sx-c.x)*k2*.3;y=c.y+k2*k2*16;a=.75*(1-k2)}
  px(b.x+x,b.y+y,sq,c.c,a)}}

/* ---------- wiring ---------- */
function measure(){var r=cv.getBoundingClientRect(),v=vis.getBoundingClientRect();W=r.width;H=r.height;VB={x:v.left-r.left,y:v.top-r.top,w:v.width,h:v.height}}
function resize(){measure();dpr=Math.min(window.devicePixelRatio||1,2);cv.width=Math.round(W*dpr);cv.height=Math.round(H*dpr);ctx.setTransform(dpr,0,0,dpr,0,0);
 if(!ready)return;pInit();if(S[mode])S[mode].init();KW.key='';drawnPaused=false}
function applyHero(){var flow=CFG.hero!=='orbit';document.documentElement.classList.toggle('has-hero-flow',flow);cv.style.display=flow?'':'none';cv.style.opacity=(CFG.opacity/100).toString();drawnPaused=false}
function isPaused(){return reduce.matches||document.hidden||document.body.dataset.motion==='paused'}
function render(d,raw){ctx.clearRect(0,0,W,H);var s=S[mode];if(s.panel){pDraw(d);kwDraw(d,geo())}s.draw(d);bDraw(raw)}
function frame(ts){requestAnimationFrame(frame);var raw=Math.min((ts-last)/1000||0,.05);last=ts;if(!ready||!visible||W<1||CFG.hero==='orbit')return;
 if(isPaused()){if(!drawnPaused){render(0,0);drawnPaused=true}return}
 drawnPaused=false;mouse.a+=((mouse.x>-900?1:0)-mouse.a)*Math.min(1,raw*5);var dt=raw*CFG.speed/100;t+=dt;render(dt,raw)}
function merge(base,patch){var o=JSON.parse(JSON.stringify(base));if(patch&&typeof patch==='object')Object.keys(DEFAULTS).forEach(function(k){if(patch[k]!==undefined)o[k]=patch[k]});return o}
function setConfig(patch){var oldMode=mode,oldPanel=CFG.panel;var n=merge(CFG,patch);Object.keys(n).forEach(function(k){CFG[k]=n[k]});
 mode=S[+CFG.mode]?+CFG.mode:6;CFG.mode=mode;CFG.panel=Math.max(1,Math.min(7,+CFG.panel||7));
 ['burst','density','speed','opacity','size','gran'].forEach(function(k){CFG[k]=+CFG[k]});
 if(mode!==oldMode||CFG.panel!==oldPanel){bursts=[];pInit();S[mode].init()}KW.key='';applyHero()}
function readLocal(){try{var s=localStorage.getItem(LS_KEY);return s?JSON.parse(s):null}catch(e){return null}}
window.HeroFlow={
 get:function(){return JSON.parse(JSON.stringify(CFG))},
 set:setConfig,
 siteDefaults:function(){return merge(DEFAULTS,FILE_CFG)},
 names:function(){var o={};for(var k=1;k<=10;k++)o[k]=S[k].name;return o},
 saveLocal:function(){try{localStorage.setItem(LS_KEY,JSON.stringify(CFG));return true}catch(e){return false}},
 clearLocal:function(){try{localStorage.removeItem(LS_KEY)}catch(e){}setConfig(merge(DEFAULTS,FILE_CFG))},
 hasLocal:function(){return !!readLocal()}
};
function start(fileCfg){if(ready)return;FILE_CFG=fileCfg||{};var c=merge(merge(DEFAULTS,FILE_CFG),readLocal());Object.keys(c).forEach(function(k){CFG[k]=c[k]});
 mode=S[+CFG.mode]?+CFG.mode:6;ready=true;measure();pInit();S[mode].init();applyHero();
 document.dispatchEvent(new CustomEvent('heroflow:ready'))}
hero.addEventListener('mousemove',function(e){var r=cv.getBoundingClientRect();mouse.x=e.clientX-r.left;mouse.y=e.clientY-r.top;var now=performance.now();if(now-bt>130){bt=now;doBurst()}});
hero.addEventListener('mouseleave',function(){mouse.x=mouse.y=-999});
if('ResizeObserver' in window)new ResizeObserver(resize).observe(hero);else window.addEventListener('resize',resize);
if('IntersectionObserver' in window)new IntersectionObserver(function(en){visible=en[0].isIntersecting;drawnPaused=false},{threshold:.01}).observe(hero);
document.documentElement.classList.add('has-hero-flow');resize();requestAnimationFrame(frame);
var done=false,timer=setTimeout(function(){if(!done){done=true;start({})}},1200);
try{fetch('hero-config.json?t='+Date.now(),{cache:'no-store'}).then(function(r){if(!r.ok)throw new Error('HTTP '+r.status);return r.json()})
 .then(function(j){if(!done){done=true;clearTimeout(timer);start(j)}})
 .catch(function(){if(!done){done=true;clearTimeout(timer);start({})}})}
catch(e){if(!done){done=true;clearTimeout(timer);start({})}}
})();
