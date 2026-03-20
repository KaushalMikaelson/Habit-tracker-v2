const Reminder = require('../models/Reminder');

exports.getItems = async (req, res) => {
  try {
    const { type } = req.query; // 'focus' or 'reminder'
    const query = { userId: req.user._id };
    if (type) query.type = type;
    
    const items = await Reminder.find(query).sort({ createdAt: 1 });
    res.json({ success: true, items });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch items' });
  }
};

exports.createItem = async (req, res) => {
  try {
    const { text, type } = req.body;
    if (!text) return res.status(400).json({ error: 'Text is required' });

    // Enforce limits (max 10 items for focus/reminder for simplicity)
    const count = await Reminder.countDocuments({ userId: req.user._id, type: type || 'reminder', done: false });
    if (count >= 10) {
      return res.status(400).json({ error: 'Maximum limit of 10 active items reached' });
    }

    const item = await Reminder.create({ userId: req.user._id, text, type: type || 'reminder' });
    res.status(201).json({ success: true, item });
  } catch (err) {
    res.status(400).json({ error: 'Failed to create item' });
  }
};

exports.toggleItem = async (req, res) => {
  try {
    const item = await Reminder.findOne({ _id: req.params.id, userId: req.user._id });
    if (!item) return res.status(404).json({ error: 'Not found' });
    
    item.done = !item.done;
    await item.save();
    
    res.json({ success: true, item });
  } catch (err) {
    res.status(400).json({ error: 'Failed to toggle item' });
  }
};

exports.deleteItem = async (req, res) => {
  try {
    const item = await Reminder.findOneAndDelete({ _id: req.params.id, userId: req.user._id });
    if (!item) return res.status(404).json({ error: 'Not found' });
    
    res.json({ success: true });
  } catch (err) {
    res.status(400).json({ error: 'Failed to delete item' });
  }
};
