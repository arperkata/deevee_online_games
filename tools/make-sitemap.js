// node tools/make-sitemap.js https://your-domain.com/   -> writes sitemap.xml + robots.txt (play-money games are left out)
const fs=require('fs');
const base=(process.argv[2]||'https://arperkata.github.io/deevee_online_games/').replace(/\/?$/,'/');
const src=fs.readFileSync('index.html','utf8');
const G=new Function('return '+src.match(/const G=(\[[\s\S]*?\n\]);/)[1])();
const pages=['index.html','privacy.html',...G.filter(g=>g[5]!=='slots').map(g=>g[0])];
const today=new Date().toISOString().slice(0,10);
fs.writeFileSync('sitemap.xml','<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n'+pages.map(p=>'  <url><loc>'+base+(p==='index.html'?'':p)+'</loc><lastmod>'+today+'</lastmod></url>').join('\n')+'\n</urlset>\n');
fs.writeFileSync('robots.txt','User-agent: *\nAllow: /\nSitemap: '+base+'sitemap.xml\n');
console.log('sitemap.xml with',pages.length,'pages for',base);
