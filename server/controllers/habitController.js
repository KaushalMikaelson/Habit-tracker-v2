const Habit = require('../models/Habit');

// GET /api/habits
exports.getHabits = async (req, res) => {
  try {
    const habits = await Habit.find({ userId: req.user._id, isArchived: false }).sort({ order: 1 });
    res.json({ success: true, habits });
  } catch (err) {
    console.error('getHabits error:', err.message);
    res.status(500).json({ error: 'Failed to fetch habits' });
  }
};

// POST /api/habits
exports.createHabit = async (req, res) => {
  try {
    // get order based on existing active habits length
    const habitsCount = await Habit.countDocuments({ userId: req.user._id, isArchived: false });
    const habit = await Habit.create({ ...req.body, userId: req.user._id, order: habitsCount });
    res.status(201).json({ success: true, habit });
  } catch (err) {
    if (err.name === 'ValidationError') {
      const message = Object.values(err.errors).map((e) => e.message).join('. ');
      return res.status(400).json({ error: message });
    }
    console.error('createHabit error:', err.message);
    res.status(500).json({ error: 'Failed to create habit' });
  }
};

// PUT /api/habits/:id
exports.updateHabit = async (req, res) => {
  try {
    const habit = await Habit.findOneAndUpdate(
      { _id: req.params.id, userId: req.user._id },
      req.body,
      { new: true, runValidators: true }
    );
    if (!habit) {
      return res.status(404).json({ error: 'Habit not found' });
    }
    res.json({ success: true, habit });
  } catch (err) {
    if (err.name === 'ValidationError') {
      const message = Object.values(err.errors).map((e) => e.message).join('. ');
      return res.status(400).json({ error: message });
    }
    console.error('updateHabit error:', err.message);
    res.status(500).json({ error: 'Failed to update habit' });
  }
};

// DELETE /api/habits/:id
exports.deleteHabit = async (req, res) => {
  try {
    const habit = await Habit.findOneAndUpdate(
      { _id: req.params.id, userId: req.user._id },
      { isArchived: true },
      { new: true }
    );
    if (!habit) {
      return res.status(404).json({ error: 'Habit not found' });
    }
    res.json({ success: true, habit });
  } catch (err) {
    console.error('deleteHabit error:', err.message);
    res.status(500).json({ error: 'Failed to delete habit' });
  }
};

// PUT /api/habits/reorder
exports.reorderHabits = async (req, res) => {
  try {
    const { orderedIds } = req.body; // array of { id, order }
    if (!orderedIds || !Array.isArray(orderedIds)) {
      return res.status(400).json({ error: 'Invalid data format' });
    }

    const updates = orderedIds.map(({ id, order }) => 
      Habit.updateOne({ _id: id, userId: req.user._id }, { $set: { order } })
    );

    await Promise.all(updates);

    res.json({ success: true });
  } catch (err) {
    console.error('reorderHabits error:', err.message);
    res.status(500).json({ error: 'Failed to reorder habits' });
  }
};
