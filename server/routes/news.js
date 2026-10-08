const express = require('express');
const router = express.Router();
const news = require('../data/news.json');

/** Pick the right translation from an article, fallback to 'en' */
function localise(article, lang) {
  const supported = ['en', 'ja', 'fr', 'zh', 'ko'];
  const l = supported.includes(lang) ? lang : 'en';
  const t = (article.translations && article.translations[l])
    ? article.translations[l]
    : (article.translations && article.translations['en'])
    ? article.translations['en']
    : {};

  return {
    id:       article.id,
    slug:     article.slug,
    category: article.category,
    date:     article.date,
    author:   article.author,
    image:    article.image,
    tags:     article.tags,
    title:    t.title   || article.title   || '',
    excerpt:  t.excerpt || article.excerpt || '',
    body:     t.body    || article.body    || '',
  };
}

// GET /api/news?lang=en&category=...&search=...
router.get('/', (req, res) => {
  const { category, search, lang = 'en' } = req.query;
  let result = [...news].sort((a, b) => new Date(b.date) - new Date(a.date));

  if (category) {
    result = result.filter(n => n.category === category);
  }
  if (search) {
    const q = search.toLowerCase();
    result = result.filter(n => {
      const t = n.translations?.[lang] || n.translations?.en || {};
      return (
        (t.title   || '').toLowerCase().includes(q) ||
        (t.excerpt || '').toLowerCase().includes(q)
      );
    });
  }

  res.json(result.map(n => localise(n, lang)));
});

// GET /api/news/:slug?lang=en
router.get('/:slug', (req, res) => {
  const { lang = 'en' } = req.query;
  const article = news.find(n => n.slug === req.params.slug);
  if (!article) return res.status(404).json({ error: 'Article not found' });

  const related = news
    .filter(n => n.id !== article.id && n.category === article.category)
    .slice(0, 2)
    .map(n => localise(n, lang));

  res.json({ ...localise(article, lang), related });
});

module.exports = router;
