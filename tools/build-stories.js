#!/usr/bin/env node
/*
  Builds one static page per impact story, plus sitemap.xml and robots.txt.

  The story text lives in site.js (the `stories` object). This script reads it from there,
  so the pop-up on the home page and the stand-alone pages always say the same thing.

  Run from the repository root:   node tools/build-stories.js
  Output:                         stories/<id>/index.html, sitemap.xml, robots.txt
*/
'use strict';
// Any failed read, write or parse stops the build with one clear line and a non-zero exit code.
process.on('uncaughtException', err => {
  console.error('build-stories failed: ' + err.message);
  process.exit(1);
});
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const SITE = 'https://pankajsabhlock.github.io';
const STYLES_V = '20261116-stories';
const THEME_V = '202611112300';

// ---- read the stories out of site.js -------------------------------------------------
const src = fs.readFileSync(path.join(ROOT, 'site.js'), 'utf8').replace(/\r\n/g, '\n');
const start = src.indexOf('const stories = {');
const assign = src.indexOf('Object.assign(stories,');
if (start < 0 || assign < 0) throw new Error('Could not find the stories object in site.js');
const lineEnd = src.indexOf('\n', assign);
const stories = new Function(src.slice(start, lineEnd < 0 ? src.length : lineEnd) + '\nreturn stories;')();
const ids = Object.keys(stories);
if (ids.length < 10) throw new Error('Expected at least 10 stories, found ' + ids.length);

// ---- helpers -------------------------------------------------------------------------
const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const signature = t => t.replace(/\b(intelligence|impact)\b/g, w => w.charAt(0).toUpperCase() + w.slice(1));
const NUM = /((?<!\w)(?:3,600|950|200|700\+|80\+|12\+|93%|34%|18%|30%|22%|100%|80%|122|40)(?!\w))/g;
const withNumbers = text => {
  const v = signature(text);
  let out = '', last = 0;
  for (const m of v.matchAll(NUM)) {
    out += esc(v.slice(last, m.index)) + '<span class="number-highlight">' + esc(m[0]) + '</span>';
    last = m.index + m[0].length;
  }
  return out + esc(v.slice(last));
};
const trimTo = (text, n) => {
  if (text.length <= n) return text;
  const cut = text.slice(0, n - 1);
  return cut.slice(0, cut.lastIndexOf(' ')).replace(/[ ,;:.\-–]+$/, '') + '…';
};
const today = new Date().toISOString().slice(0, 10);

const FAVICON = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 64 64'%3E%3Crect width='64' height='64' rx='16' fill='%23101a2c'/%3E%3Ctext x='32' y='41' text-anchor='middle' font-family='Arial,sans-serif' font-size='25' font-weight='600' fill='white'%3EPS%3C/text%3E%3C/svg%3E";
const SUN = '<svg class="theme-icon theme-icon-sun" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><circle cx="12" cy="12" r="4"></circle><path d="M12 2v2M12 20v2M4.93 4.93l1.42 1.42M17.65 17.65l1.42 1.42M2 12h2M20 12h2M4.93 19.07l1.42-1.42M17.65 6.35l1.42-1.42"></path></svg>';
const MOON = '<svg class="theme-icon theme-icon-moon" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M20.5 15.2A8.5 8.5 0 0 1 8.8 3.5 8.5 8.5 0 1 0 20.5 15.2Z"></path></svg>';
const IDENTITY = '<a class="identity" href="../../#home" aria-label="Pankaj Sabhlock, home"><span class="identity-copy"><span class="name-line"><span class="person-name">Pankaj Sabhlock</span><span class="honorific">C.Eng. (IEI)</span></span><span class="fellow-caption">Fellow · IEI, IETE</span></span></a>';

const THEME_HEAD = "<script>(function(){try{var t=localStorage.getItem('portfolio-theme');if(t!=='light'&&t!=='dark'){t=window.matchMedia('(prefers-color-scheme: light)').matches?'light':'dark'}document.documentElement.dataset.theme=t}catch(e){document.documentElement.dataset.theme='dark'}})();</script>";
const THEME_BODY = "<script>(function(){var b=document.getElementById('theme-toggle');if(!b)return;function label(){var l=document.documentElement.dataset.theme==='light';b.setAttribute('aria-label',l?'Switch to dark mode':'Switch to light mode');b.setAttribute('title',l?'Switch to dark mode':'Switch to light mode')}label();b.addEventListener('click',function(){var n=document.documentElement.dataset.theme==='light'?'dark':'light';document.documentElement.dataset.theme=n;try{localStorage.setItem('portfolio-theme',n)}catch(e){}label()})})();</script>";

// ---- one page per story --------------------------------------------------------------
function page(id) {
  const s = stories[id];
  const title = signature(s.title);
  const url = SITE + '/stories/' + id + '/';
  const lead = s.sections && s.sections[0] ? s.sections[0][1] : s.context;
  const description = trimTo(signature(lead), 158);
  const sections = s.sections.map(([h, t]) =>
    '      <section class="story-section"><h2>' + withNumbers(h) + '</h2><p>' + withNumbers(t) + '</p></section>').join('\n');
  const chart = s.chart
    ? '\n      <div class="story-chart" aria-label="Programme outcome comparison">' + s.chart.map(([label, value, width, style]) =>
        '<div class="chart-row"><div class="chart-label"><span>' + withNumbers(label) + '</span><strong>' + withNumbers(value) +
        '</strong></div><div class="chart-track" aria-hidden="true"><div class="chart-fill' + (style ? ' ' + esc(style) : '') +
        '" style="width:' + Number(width) + '%"></div></div></div>').join('') + '</div>'
    : '';
  const more = ids.filter(o => o !== id).map(o =>
    '<li><a href="../' + o + '/"><span>' + esc(stories[o].category) + '</span><strong>' + esc(signature(stories[o].title)) + '</strong></a></li>').join('\n          ');
  const ld = {
    '@context': 'https://schema.org', '@type': 'Article', headline: title, description, url,
    mainEntityOfPage: url, image: SITE + '/assets/share.jpg', inLanguage: 'en-GB',
    author: { '@type': 'Person', name: 'Pankaj Sabhlock', url: SITE + '/' },
    isPartOf: { '@type': 'WebSite', name: 'Pankaj Sabhlock', url: SITE + '/' }
  };
  return `<!doctype html>
<html lang="en-GB">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta name="theme-color" content="#0f1b33">
  <title>${esc(title)} | Pankaj Sabhlock</title>
  <meta name="description" content="${esc(description)}">
  <link rel="canonical" href="${url}">
  <meta property="og:title" content="${esc(title)} | Pankaj Sabhlock">
  <meta property="og:description" content="${esc(description)}">
  <meta property="og:type" content="article"><meta property="og:url" content="${url}">
  <meta property="og:image" content="${SITE}/assets/share.jpg"><meta property="og:image:width" content="1200"><meta property="og:image:height" content="630">
  <meta property="og:image:alt" content="Pankaj Sabhlock, Head of Data Products. I turn messy data into decisions people trust.">
  <meta name="twitter:card" content="summary_large_image"><meta name="twitter:image" content="${SITE}/assets/share.jpg">
  <link rel="icon" type="image/svg+xml" href="${FAVICON}">
  ${THEME_HEAD}
  <link rel="stylesheet" href="../../styles.css?v=${STYLES_V}">
  <link rel="stylesheet" href="../../theme.css?v=${THEME_V}">
  <link rel="stylesheet" href="../../story-page.css?v=${STYLES_V}">
  <script type="application/ld+json">${JSON.stringify(ld)}</script>
</head>
<body class="story-page">
  <a class="skip-link" href="#main">Skip to content</a>
  <header class="sp-header">
    <div class="sp-header-inner">
      ${IDENTITY}
      <div class="sp-header-actions">
        <a class="sp-back-link" href="../../#impact">All outcomes</a>
        <button type="button" class="theme-toggle" id="theme-toggle" aria-label="Switch to light mode" title="Switch to light mode">${SUN}${MOON}</button>
      </div>
    </div>
  </header>
  <main id="main" class="sp-main">
    <article class="sp-story">
      <p class="eyebrow">${esc(s.category)}</p>
      <h1>${esc(title)}</h1>
      <p class="dialog-context">${esc(s.context)}</p>
${sections}${chart}
      <p class="dialog-source">Source: Master Career CV, 2026 · Outcomes stated with their original context.</p>
      <div class="sp-actions"><a class="button button-primary" href="../../#impact">See all outcomes</a><a class="text-link" href="../../#connect">Let’s connect</a></div>
    </article>
    <aside class="sp-more" aria-labelledby="more-title">
      <h2 id="more-title">More outcomes</h2>
      <ul>
          ${more}
      </ul>
    </aside>
  </main>
  <footer class="sp-footer"><a href="../../#home">pankajsabhlock.github.io</a><span>© 2026 Pankaj Sabhlock</span></footer>
  ${THEME_BODY}
</body>
</html>
`;
}

for (const id of ids) {
  const dir = path.join(ROOT, 'stories', id);
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(path.join(dir, 'index.html'), page(id));
}

// ---- sitemap.xml and robots.txt ------------------------------------------------------
const urls = [SITE + '/'].concat(ids.map(id => SITE + '/stories/' + id + '/'));
fs.writeFileSync(path.join(ROOT, 'sitemap.xml'),
  '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n' +
  urls.map(u => '  <url><loc>' + u + '</loc><lastmod>' + today + '</lastmod></url>').join('\n') + '\n</urlset>\n');
fs.writeFileSync(path.join(ROOT, 'robots.txt'), 'User-agent: *\nAllow: /\n\nSitemap: ' + SITE + '/sitemap.xml\n');

console.log('Built ' + ids.length + ' story pages, sitemap.xml and robots.txt');
