const express = require('express');
const router = express.Router();
const Task = require('../models/Task');
const { protect } = require('../middleware/authMiddleware');

// @route   GET /api/employee/tasks
// @desc    Get all tasks assigned to logged in employee
// @access  Private/Employee
router.get('/tasks', protect, async (req, res) => {
  try {
    if (req.user.role !== 'employee') {
      return res.status(403).json({ message: 'Access denied: Employees only' });
    }
    const tasks = await Task.find({ assignedTo: req.user._id }).populate('assignedBy', 'name email').sort('-createdAt');
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   PUT /api/employee/tasks/:id
// @desc    Update task status
// @access  Private/Employee
router.put('/tasks/:id', protect, async (req, res) => {
  const { status } = req.body;
  try {
    if (req.user.role !== 'employee') {
      return res.status(403).json({ message: 'Access denied: Employees only' });
    }

    const task = await Task.findById(req.params.id);
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    if (task.assignedTo.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Not authorized to update this task' });
    }

    if (['Pending', 'In Progress', 'Completed'].includes(status)) {
      task.status = status;
      const updatedTask = await task.save();
      res.json(updatedTask);
    } else {
      res.status(400).json({ message: 'Invalid status' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
