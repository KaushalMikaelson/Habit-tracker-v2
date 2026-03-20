const express = require('express');
const router = express.Router();
const { getItems, createItem, toggleItem, deleteItem } = require('../controllers/reminderController');
const { protect } = require('../middleware/auth');

router.use(protect);

router.get('/', getItems);
router.post('/', createItem);
router.put('/:id', toggleItem);
router.delete('/:id', deleteItem);

module.exports = router;
