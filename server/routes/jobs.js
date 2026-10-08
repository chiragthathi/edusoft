const express = require('express');
const router = express.Router();
const jobs = require('../data/jobs.json');

router.get('/', (req, res) => {
  const { department, location } = req.query;
  let result = [...jobs].sort((a, b) => new Date(b.posted) - new Date(a.posted));
  if (department) result = result.filter(j => j.department === department);
  if (location) result = result.filter(j => j.location.toLowerCase().includes(location.toLowerCase()));
  res.json(result);
});

router.get('/departments', (req, res) => {
  const depts = [...new Set(jobs.map(j => j.department))];
  res.json(depts);
});

router.get('/:slug', (req, res) => {
  const job = jobs.find(j => j.slug === req.params.slug);
  if (!job) return res.status(404).json({ error: 'Job not found' });
  res.json(job);
});

module.exports = router;
