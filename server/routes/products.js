const express = require('express');
const router = express.Router();
const catalog = require('../lib/catalog');

// GET /api/products?category=&search=&featured=1
router.get('/', (req, res) => {
  const { category, search, featured } = req.query;
  res.json(catalog.list({ category, search, featured: featured === '1' || featured === 'true' }));
});

// GET /api/products/categories — ordered categories with counts and hero imagery
router.get('/categories', (req, res) => {
  res.json(catalog.categories());
});

// GET /api/products/:slug — full product; legacy slugs resolve with canonicalSlug set
router.get('/:slug', (req, res) => {
  const found = catalog.find(req.params.slug);
  if (!found) return res.status(404).json({ error: 'Product not found' });
  res.json({ ...found.product, canonicalSlug: found.canonicalSlug });
});

module.exports = router;
