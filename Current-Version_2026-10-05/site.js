(() => {
  'use strict';
  const motionPreference = window.matchMedia('(prefers-reduced-motion: reduce)');
  const menu = document.querySelector('.menu-toggle');
  const mobileNav = document.getElementById('mobile-nav');
  const closeMenu = () => { mobileNav.hidden = true; menu.setAttribute('aria-expanded', 'false'); menu.setAttribute('aria-label', 'Open menu'); };
  menu.addEventListener('click', () => { const open = menu.getAttribute('aria-expanded') === 'true'; menu.setAttribute('aria-expanded', String(!open)); menu.setAttribute('aria-label', open ? 'Open menu' : 'Close menu'); mobileNav.hidden = open; });
  mobileNav.querySelectorAll('a').forEach(link => link.addEventListener('click', closeMenu));
  document.addEventListener('keydown', event => { if (event.key === 'Escape' && !mobileNav.hidden) {closeMenu();menu.focus();} });
  const achievementCards = [...document.querySelectorAll('.impact-card')];
  const moreStories = document.querySelector('.more-stories');
  let achievementFilter = 'all', allStoriesExpanded = false;
  const renderAchievements = () => {
    const matching = achievementCards.filter(card => achievementFilter === 'all' || card.dataset.domain === achievementFilter);
    const limit = achievementFilter === 'all' && !allStoriesExpanded ? 6 : matching.length;
    achievementCards.forEach(card => {card.hidden = !matching.slice(0,limit).includes(card);});
    moreStories.hidden = achievementFilter !== 'all';
    moreStories.setAttribute('aria-expanded',String(allStoriesExpanded));
    moreStories.textContent = allStoriesExpanded ? 'Show Fewer Stories −' : 'More Leadership & Service Stories (4) +';
    document.getElementById('filter-status').textContent = `${Math.min(limit,matching.length)} of ${matching.length} achievement stories shown.`;
  };
  moreStories.addEventListener('click', () => {
    allStoriesExpanded = !allStoriesExpanded;
    renderAchievements();
    if (!allStoriesExpanded) document.querySelector('.impact-filters').scrollIntoView({block:'start',behavior:motionPreference.matches ? 'instant' : 'smooth'});
  });
  document.querySelectorAll('.filter').forEach(button => button.addEventListener('click', () => {
    achievementFilter = button.dataset.filter;
    document.querySelectorAll('.filter').forEach(item => { const active = item === button; item.classList.toggle('active', active); item.setAttribute('aria-pressed', String(active)); });
    renderAchievements();
  }));
  renderAchievements();
  const stories = {
    reporting: {category:'UK higher education · Data-product leadership',title:'A reporting portfolio built around decisions.',context:'University of East London · Head of Data Products · October 2024–present',sections:[['The challenge','A reporting estate of around 950 reports created duplication, maintenance pressure and competing service requests.'],['My contribution','Led portfolio rationalisation, strengthened prioritisation and ownership, improved cross-team coordination and supported executive reporting across institutional KPIs, student information, surveys, admissions and research data.'],['The outcome','Approximately 200 core reports, with effort concentrated on real business needs. Reporting service processes improved from frequent daily escalations in January to none from March 2026.']],chart:[['Reporting estate before','≈950 reports',100,'muted'],['Focused core portfolio','≈200 reports',21,'']]},
    capacity: {category:'Telecom · AI, analytics & automation',title:'Capacity enhancement that improves performance.',context:'ZTE Myanmar · Ooredoo managed services · December 2019–September 2023',sections:[['The challenge','Forecast demand and identify capacity constraints while balancing customer experience, technical risk, cost and rollout feasibility.'],['My contribution','Designed and implemented AI-enabled capacity forecasting, automation and ML-based ranking models. Combined network data with customer impact, utilisation, risk and expected return to prioritise site and node upgrades. Presented recommendations to senior management and mentored 12+ engineers.'],['The outcome','Capacity enhancement and operational improvements contributed to a reported 34% network KPI improvement and 18% monthly revenue improvement. These are reported programme outcomes; KPI terminology follows my clarification of the career record.']]},
    upgrade: {category:'Telecom · Programme co-leadership',title:'3,600 sites. One clear delivery outcome.',context:'Ooredoo network-upgrade programme · 2022–2023',sections:[['The challenge','Deliver a large-scale network upgrade with performance, capacity and business-case outcomes aligned.'],['My contribution','Co-led the programme, with responsibility for performance, capacity and final outcomes against the project business case. Connected customer priorities, engineering interventions and supplier delivery.'],['The outcome','The programme covered approximately 3,600 sites, reached 80% completion in six months and completed delivery in eight months. Customer and service excellence remained the delivery priorities.']],chart:[['Six months','80% complete',80,'muted'],['Eight months','100% complete',100,'']]},
    learning: {category:'Higher education · Teaching & enablement',title:'Connecting applied AI with better learning.',context:'University of East London · Academic development and teaching · 2024 onward',sections:[['The challenge','Make virtual-learning experiences accessible, aligned with objectives and useful to learners, while connecting emerging AI topics with practical industry experience.'],['My contribution','As a TEAL Academic Developer intern, audited 700+ modules and worked with academic colleagues on learner-centred improvements. Taught and mentored master’s students in AI, Big Data and Power BI during my MSc.'],['Continuing impact','Continue invited AI and BI guest lectures alongside data-product leadership, including “AI Across Engineering Disciplines” at UEL on 23 July 2026. Bring industry examples, root-cause analysis and applied decision-making into teaching.']]},
    consulting: {category:'Telecom · Customer experience & investment',title:'From constrained capacity to commercial value.',context:'TEOCO / AIRCOM International · Ooredoo Myanmar · July 2018–December 2019',sections:[['The challenge','Address capacity-constrained sites and improve resilience for changing customer demand, promotions and service launches.'],['My contribution','Advised on RAN performance, capacity and service assurance. Prepared technical designs and investment recommendations, assessed spectrum-refarming risks and provided vendor-validation and acceptance evidence.'],['The outcome','Site improvements contributed to approximately 30% greater traffic and a reported 22% monthly revenue uplift. The work connected operational KPIs with annual operating plans and customer investment decisions.']]},
    ericsson: {category:'Telecom · Global delivery & team enablement',title:'Better tools. Faster team delivery.',context:'Ericsson India / Global Services · Sprint US Network Vision · 2011–2014 appointment',sections:[['The challenge','Coordinate tool-related delivery and resolve issues across offshore engineering resources and US stakeholders.'],['My contribution','Served as tools single point of contact, coordinating activity supporting 80+ offshore resources, liaising with Ericsson US stakeholders and supporting LTE on-air / Network Vision testing.'],['The recognition','Received the Ericsson ACE Award for completing the tools project in half the target timeline. This work complemented 2G/3G RF planning and optimisation for Bharti Airtel in North-East and Assam.']]}
  };
  Object.assign(stories,{"service": {"category": "Customer service · Service assurance", "title": "Customer Trust. Service Accountability.", "context": "S TEL · Assistant Manager, RF Planning & Performance · August 2010–October 2011", "sections": [["The priority", "Connect network performance and planning with the service commitments made to customers."], ["My contribution", "Worked across RF planning, optimisation, regulatory compliance, KPI management and customer-complaint resolution."], ["The outcome", "Achieved 100% of customer-complaint SLA requirements, as recorded in my career CV. This measures delivery against service commitments; it is not a customer-satisfaction survey score."]]}, "stakeholders": {"category": "Leadership · Stakeholder alignment", "title": "Shared Priorities. Clear Ownership.", "context": "University of East London · Reporting service processes · 2026", "sections": [["The challenge", "Frequent daily reporting escalations in January indicated a need for clearer priorities and service ownership."], ["My contribution", "Strengthened prioritisation, cross-team coordination and ownership, connecting technical delivery with executive and academic needs."], ["The outcome", "Reporting service processes moved to no escalations from March 2026. The result is specific to this reporting-service context."]]}, "mentoring": {"category": "Leadership · Team development", "title": "Build Capability. Strengthen Delivery.", "context": "ZTE Myanmar · Ooredoo managed services · 2019–2023", "sections": [["The opportunity", "Make capacity analytics and forecasting useful to the engineers responsible for operational decisions."], ["My contribution", "Mentored 12+ engineers alongside analytical delivery, requirements development and proof-of-concept work. Presented weekly and monthly recommendations to senior management."], ["The value", "Connected technical capability with practical prioritisation and delivery. The mentoring count is documented; a separate percentage improvement in team performance is not claimed."]]}, "research": {"category": "Research · Responsible AI governance · In progress", "title": "Research that Informs Responsible Strategy.", "context": "University of East London · PhD via MPhil · 2026–present", "sections": [["The question", "How can UK higher education translate responsible AI principles into operational evidence, accountability and human oversight?"], ["The work", "Developing a Responsible AI Governance Framework, informed by a 122-source research corpus and 40-source thematic synthesis."], ["The intended contribution", "Connect governance, explainability and transparency with decisions organisations make in practice. Doctoral research remains in progress; these figures describe the research foundation, not a completed or validated outcome."]]}});
  const dialog = document.getElementById('story-dialog');
  let returnFocus = null;
  let selectedCard = null, closingStory = false, storyAnimation = null;
  const allowMotion = () => !motionPreference.matches && document.body.dataset.motion !== 'paused';
  const signatureWords = text => text.replace(/\b(intelligence|impact)\b/g, word => word.charAt(0).toUpperCase() + word.slice(1));
  const element = (tag, className, text) => { const node = document.createElement(tag); if (className) node.className = className; if (text !== undefined) { const value=signatureWords(text); const pattern=/((?<!\w)(?:3,600|950|200|700\+|80\+|12\+|93%|34%|18%|30%|22%|100%|80%|122|40)(?!\w))/g; let last=0; for(const match of value.matchAll(pattern)){node.append(document.createTextNode(value.slice(last,match.index)));const accent=document.createElement('span');accent.className='number-highlight';accent.textContent=match[0];node.append(accent);last=match.index+match[0].length;}node.append(document.createTextNode(value.slice(last))); } return node; };
  document.querySelectorAll('[data-story]').forEach(button => button.addEventListener('click', () => {
    const story = stories[button.dataset.story];
    returnFocus = button;
    selectedCard?.classList.remove('story-selected');
    selectedCard = button.closest('.impact-card');
    selectedCard?.classList.add('story-selected');
    button.setAttribute('aria-expanded', 'true');
    document.getElementById('story-category').textContent = story.category;
    document.getElementById('story-title').textContent = signatureWords(story.title);
    document.getElementById('story-context').textContent = story.context;
    const body = document.getElementById('story-body'); body.replaceChildren();
    story.sections.forEach(([title, text]) => { const section = element('section','story-section');section.append(element('h3','',title),element('p','',text));body.append(section); });
    if (story.chart) {const chart=element('div','story-chart');chart.setAttribute('aria-label','Programme outcome comparison');story.chart.forEach(([label,value,width,style])=>{const row=element('div','chart-row');const caption=element('div','chart-label');caption.append(element('span','',label),element('strong','',value));const track=element('div','chart-track');track.setAttribute('aria-hidden','true');const fill=element('div',`chart-fill ${style}`);fill.style.width=`${width}%`;track.append(fill);row.append(caption,track);chart.append(row);});body.append(chart);}
    dialog.showModal(); dialog.scrollTop=0; document.body.style.overflow='hidden';
    closingStory = false;
    storyAnimation?.cancel();
    if (allowMotion()) storyAnimation = dialog.animate([{opacity:0,transform:'translateY(16px) scale(.98)'},{opacity:1,transform:'translateY(0) scale(1)'}], {duration:300,easing:'cubic-bezier(.2,.7,.3,1)'});
  }));
  document.querySelectorAll('.impact-card').forEach(card => card.addEventListener('click', event => {
    if (!event.target.closest('button, a')) card.querySelector('[data-story]')?.click();
  }));
  const closeStory = async () => {
    if (closingStory || !dialog.open) return;
    closingStory = true;
    storyAnimation?.cancel();
    if (allowMotion()) {
      storyAnimation = dialog.animate([{opacity:1,transform:'translateY(0)'},{opacity:0,transform:'translateY(8px)'}],{duration:150,easing:'ease-in'});
      try {await storyAnimation.finished;} catch {}
    }
    dialog.close();
    closingStory = false;
  };
  dialog.querySelector('.dialog-close').addEventListener('click', closeStory);
  dialog.addEventListener('cancel', event => {event.preventDefault(); closeStory();});
  dialog.addEventListener('click', event => {if(event.target===dialog){const rect=dialog.getBoundingClientRect();if(event.clientX<rect.left||event.clientX>rect.right||event.clientY<rect.top||event.clientY>rect.bottom)closeStory();}});
  dialog.addEventListener('close',()=>{document.body.style.overflow='';selectedCard?.classList.remove('story-selected');returnFocus?.setAttribute('aria-expanded','false');returnFocus?.focus({preventScroll:true});});
  document.querySelectorAll('[data-story]').forEach(button => {button.setAttribute('aria-haspopup','dialog');button.setAttribute('aria-expanded','false');});
  document.querySelectorAll('details').forEach(details => {
    const icon = details.querySelector('summary > [aria-hidden="true"]');
    if (!icon) return;
    const syncDisclosure = () => {icon.textContent = details.open ? '−' : '+';};
    details.addEventListener('toggle', syncDisclosure);
    syncDisclosure();
  });
  const reveal = new IntersectionObserver(entries => entries.forEach(entry=>{if(entry.isIntersecting){if(allowMotion())entry.target.animate([{opacity:.3,transform:'translateY(18px)'},{opacity:1,transform:'translateY(0)'}],{duration:650,easing:'cubic-bezier(.2,.7,.3,1)'});reveal.unobserve(entry.target);}}),{threshold:.08});
  document.querySelectorAll('.section-heading,.expertise-item,.timeline-item,.award-feature,.research-primary,.about-copy').forEach(node=>reveal.observe(node));
  const iconVisibility = new IntersectionObserver(entries => entries.forEach(entry => entry.target.classList.toggle('motion-visible',entry.isIntersecting)),{threshold:.1});
  document.querySelectorAll('.orbit-label,.expertise-item').forEach(node => iconVisibility.observe(node));
  const navLinks = Array.from(document.querySelectorAll('.desktop-nav a, .mobile-nav a'));
  const navTargets = new Set(navLinks.map(link => link.hash.slice(1)));
  const navSections = Array.from(document.querySelectorAll('main > section[id]')).filter(section => navTargets.has(section.id));
  const setActiveNav = id => navLinks.forEach(link => {
    const target = link.closest('.desktop-nav') && id === 'credentials' ? 'recognition' : id;
    if (link.hash === `#${target}`) link.setAttribute('aria-current', 'location');
    else link.removeAttribute('aria-current');
  });
  const titleBar = document.querySelector('.section-title-bar');
  const stickyTitle = titleBar.querySelector('.sticky-section-title');
  const stickyLabel = titleBar.querySelector('.sticky-section-label');
  const titledSections = [...document.querySelectorAll('main > section')].filter(section => section.querySelector('h1,h2'));
  let stickySection = null, titleTransition = null;
  const syncStickyTitle = () => {
    const headerBottom = document.querySelector('.site-header').getBoundingClientRect().bottom;
    let current = titledSections[0];
    for (const section of titledSections) if (section.getBoundingClientRect().top <= headerBottom + 96) current = section;
    const heading = current.querySelector('h1,h2');
    const show = heading.getBoundingClientRect().bottom <= headerBottom + 68;
    titleBar.classList.toggle('is-visible',show);
    titleBar.style.top = `${headerBottom}px`;
    if (current !== stickySection) {
      stickySection = current;
      stickyTitle.textContent = heading.innerText.replace(/\s+/g,' ').trim();
      stickyLabel.textContent = current.querySelector('.eyebrow')?.textContent || 'PANKAJ SABHLOCK';
      titleTransition?.cancel();
      if (show && allowMotion()) titleTransition = stickyTitle.animate([{opacity:0,transform:'translateY(9px)'},{opacity:1,transform:'translateY(0)'}],{duration:280,easing:'cubic-bezier(.2,.7,.3,1)'});
    }
  };
  let navigationLock = '', navigationTimer = 0, scrollFrame = 0;
  const trackNavigation = () => {
    scrollFrame = 0;
    syncStickyTitle();
    if (navigationLock) return;
    const marker = document.querySelector('.site-header').getBoundingClientRect().height + 96;
    let current = '';
    for (const section of navSections) if (section.getBoundingClientRect().top <= marker) current = section.id;
    setActiveNav(current);
  };
  const releaseNavigation = () => {navigationLock = ''; clearTimeout(navigationTimer); trackNavigation();};
  document.querySelectorAll('a[href^="#"]').forEach(link => link.addEventListener('click', () => {
    const id = link.hash.slice(1);
    if (id !== 'home' && !navTargets.has(id)) return;
    navigationLock = id;
    setActiveNav(id === 'home' ? '' : id);
    clearTimeout(navigationTimer);
    navigationTimer = setTimeout(releaseNavigation, 1200);
  }));
  window.addEventListener('scroll', () => {if (!scrollFrame) scrollFrame = requestAnimationFrame(trackNavigation);}, {passive:true});
  window.addEventListener('scrollend', releaseNavigation);
  window.addEventListener('wheel', releaseNavigation, {passive:true});
  window.addEventListener('touchstart', releaseNavigation, {passive:true});
  window.addEventListener('resize', trackNavigation);
  setActiveNav(location.hash.slice(1));
  requestAnimationFrame(trackNavigation);
  // A geometric infographic: three flowing information streams orbit human purpose.
  const canvas=document.getElementById('intelligence-canvas');
  const ctx=canvas.getContext('2d');
  const motionButton=document.querySelector('.motion-toggle');
  if (!ctx) {motionButton.hidden=true;return;}
  let width=0,height=0,frame=0,time=0,last=0,visible=true,paused=motionPreference.matches;
  const point=(angle,ring)=>{const radius=Math.min(width,height)*.375;const tilt=[-.52,.5,1.42][ring];const x=Math.cos(angle)*radius,y=Math.sin(angle)*radius*.53;return{x:width*.5+x*Math.cos(tilt)-y*Math.sin(tilt),y:height*.49+x*Math.sin(tilt)+y*Math.cos(tilt)};};
  const palette=['#0866dc','#088d93','#087c9f'];
  const draw=()=>{
    ctx.clearRect(0,0,width,height);
    for(let ring=0;ring<3;ring++){
      ctx.beginPath();for(let step=0;step<=150;step++){const p=point(step/150*Math.PI*2,ring);step?ctx.lineTo(p.x,p.y):ctx.moveTo(p.x,p.y);}ctx.strokeStyle=palette[ring];ctx.globalAlpha=.38;ctx.lineWidth=1;ctx.stroke();
      for(let node=0;node<28;node++){const angle=node/28*Math.PI*2+time*(.10+ring*.025);const p=point(angle,ring);const pulse=(Math.sin(angle*2+time*.7)+1)/2;ctx.beginPath();ctx.arc(p.x,p.y,node%7===0?3.4:1.4,0,Math.PI*2);ctx.fillStyle=palette[ring];ctx.globalAlpha=.3+pulse*.45;ctx.fill();}
      for(let particle=0;particle<3;particle++){const angle=time*(.31+ring*.07)+particle*2.1;for(let trail=12;trail>=0;trail--){const p=point(angle-trail*.025,ring);ctx.beginPath();ctx.arc(p.x,p.y,trail===0?4:2.2,0,Math.PI*2);ctx.globalAlpha=(1-trail/13)*.85;ctx.fillStyle=palette[ring];ctx.fill();}}
    }
    ctx.globalAlpha=1;
    const halo=ctx.createRadialGradient(width*.5,height*.49,Math.min(width,height)*.12,width*.5,height*.49,Math.min(width,height)*.26);halo.addColorStop(0,'rgba(245,250,252,1)');halo.addColorStop(.4,'rgba(245,250,252,.94)');halo.addColorStop(1,'rgba(245,250,252,0)');ctx.fillStyle=halo;ctx.beginPath();ctx.arc(width*.5,height*.49,Math.min(width,height)*.26,0,Math.PI*2);ctx.fill();
  };
  const resize=()=>{const rect=canvas.getBoundingClientRect();width=rect.width;height=rect.height;const dpr=Math.min(window.devicePixelRatio||1,2);canvas.width=Math.round(width*dpr);canvas.height=Math.round(height*dpr);ctx.setTransform(dpr,0,0,dpr,0,0);draw();};
  const loop=timestamp=>{if(paused||!visible||document.hidden){frame=0;last=0;return;}if(!last)last=timestamp;time+=Math.min((timestamp-last)/1000,.05);last=timestamp;draw();frame=requestAnimationFrame(loop);};
  const sync=()=>{if(frame){cancelAnimationFrame(frame);frame=0;}last=0;document.body.dataset.motion=paused||document.hidden?'paused':'running';motionButton.textContent=paused?'Play animation':'Pause animation';motionButton.title=paused?'Play decorative animations':'Pause decorative animations';motionButton.setAttribute('aria-pressed',String(paused));if(!paused&&visible&&!document.hidden)frame=requestAnimationFrame(loop);else draw();};
  motionButton.addEventListener('click',()=>{paused=!paused;sync();});
  motionPreference.addEventListener('change',()=>{paused=motionPreference.matches;sync();});
  document.addEventListener('visibilitychange',sync);
  new ResizeObserver(resize).observe(canvas);
  new IntersectionObserver(entries=>{visible=entries[0].isIntersecting;sync();},{threshold:.01}).observe(canvas);
  resize();sync();
})();
