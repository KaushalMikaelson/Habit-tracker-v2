const express = require('express');
const router = express.Router();
const { toggleLog, getMonthLogs, getStreaks, getCompletionStats } = require('../controllers/logController');
const { protect } = require('../middleware/auth');

router.use(protect);

router.post('/toggle', toggleLog);
router.get('/month', getMonthLogs);
router.get('/streaks', getStreaks);
router.get('/stats', getCompletionStats);

module.exports = router;
