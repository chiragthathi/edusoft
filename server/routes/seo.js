const express = require('express');
const router = express.Router();
const catalog = require('../lib/catalog');
const news = require('../data/news.json');
const jobs = require('../data/jobs.json');

const ORIGIN = process.env.SITE_ORIGIN || 'https://edusofthealth.com';

router.get('/robots.txt', (req, res) => {
  res.type('text/plain').send(`User-agent: *\nAllow: /\nDisallow: /api/\n\nSitemap: ${ORIGIN}/sitemap.xml\n`);
});

router.get('/sitemap.xml', (req, res) => {
  const statics = ['/', '/portfolio', '/about', '/services', '/support', '/news', '/careers', '/contact', '/privacy', '/terms', '/cookies'];
  const urls = [
    ...statics.map(p => ({ loc: p, priority: p === '/' ? '1.0' : '0.8' })),
    ...catalog.categories().map(c => ({ loc: `/portfolio?category=${c.id}`, priority: '0.7' })),
    ...catalog.allSlugs().map(s => ({ loc: `/portfolio/${s}`, priority: '0.9' })),
    ...news.map(n => ({ loc: `/news/${n.slug}`, lastmod: n.date, priority: '0.6' })),
    ...jobs.map(j => ({ loc: `/careers/${j.slug}`, lastmod: j.posted, priority: '0.5' })),
  ];
  const esc = s => s.replace(/&/g, '&amp;');
  const body = urls.map(u =>
    `  <url><loc>${esc(ORIGIN + u.loc)}</loc>${u.lastmod ? `<lastmod>${u.lastmod}</lastmod>` : ''}<priority>${u.priority}</priority></url>`
  ).join('\n');
  res.type('application/xml').send(`<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${body}\n</urlset>\n`);
});

module.exports = router;
