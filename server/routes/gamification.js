const express = require('express');
const router = express.Router();
const { getGamificationData } = require('../utils/gamificationCore');
const { protect } = require('../middleware/auth');

router.use(protect);

router.get('/data', getGamificationData);

module.exports = router;
