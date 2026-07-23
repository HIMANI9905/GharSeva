const express = require('express');
const { estimatePrice, recommendProviders, chatbotQuery } = require('../controllers/aiController');

const router = express.Router();

router.post('/estimate-price', estimatePrice);
router.post('/recommend-providers', recommendProviders);
router.post('/chatbot', chatbotQuery);

module.exports = router;
