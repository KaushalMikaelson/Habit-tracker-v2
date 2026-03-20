const express = require('express');
const router = express.Router();
const { getHabitStats, getOverallStats } = require('../controllers/statsController');
const { protect } = require('../middleware/auth');

router.use(protect);

router.get('/habit/:habitId', getHabitStats);
router.get('/overall', getOverallStats);

module.exports = router;
