const express = require('express');
const router = express.Router();
const {
  getHabits,
  createHabit,
  updateHabit,
  deleteHabit,
  reorderHabits,
} = require('../controllers/habitController');
const { protect } = require('../middleware/auth');

// All habit routes require authentication
router.use(protect);

router.route('/')
  .get(getHabits)
  .post(createHabit);

router.put('/reorder', reorderHabits);

router.route('/:id')
  .put(updateHabit)
  .delete(deleteHabit);

module.exports = router;
