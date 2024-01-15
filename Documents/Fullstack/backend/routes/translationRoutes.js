const express = require('express');
const router = express.Router();
const TranslationController = require('../controllers/TranslationController');

router.get('/translation/:key', TranslationController.getTranslationByKey);

module.exports = router;
