const express = require('express');
const router = express.Router();
const faqs = require('../data/faqs.json');

router.get('/', (req, res) => {
  const { category, search } = req.query;
  let result = faqs;
  if (category) result = result.filter(f => f.category === category);
  if (search) {
    const q = search.toLowerCase();
    result = result.filter(f => f.question.toLowerCase().includes(q) || f.answer.toLowerCase().includes(q));
  }
  res.json(result);
});

module.exports = router;
