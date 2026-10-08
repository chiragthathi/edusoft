const express = require('express');
const router = express.Router();
const offices = require('../data/offices.json');

router.get('/', (req, res) => res.json(offices));

module.exports = router;
