const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Task = require('../models/Task');
const { protect, admin } = require('../middleware/authMiddleware');

// --- Employee Management ---

// @route   GET /api/admin/employees
// @desc    Get all employees
// @access  Private/Admin
router.get('/employees', protect, admin, async (req, res) => {
  try {
    const employees = await User.find({ role: 'employee' }).select('-password');
    res.json(employees);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   PUT /api/admin/employees/:id/approve
// @desc    Approve an employee
// @access  Private/Admin
router.put('/employees/:id/approve', protect, admin, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (user && user.role === 'employee') {
      user.isApproved = true;
      const updatedUser = await user.save();
      res.json({ message: 'Employee approved successfully', user: updatedUser });
    } else {
      res.status(404).json({ message: 'Employee not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// --- Task Management ---

// @route   POST /api/admin/tasks
// @desc    Create a task and assign to employee
// @access  Private/Admin
router.post('/tasks', protect, admin, async (req, res) => {
  const { title, description, assignedTo, dueDate } = req.body;
  try {
    const employee = await User.findById(assignedTo);
    if (!employee || employee.role !== 'employee') {
      return res.status(400).json({ message: 'Invalid employee ID' });
    }

    const task = await Task.create({
      title,
      description,
      assignedTo,
      assignedBy: req.user._id,
      dueDate,
      status: 'Pending'
    });

    res.status(201).json(task);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   GET /api/admin/tasks
// @desc    Get all tasks
// @access  Private/Admin
router.get('/tasks', protect, admin, async (req, res) => {
  try {
    const tasks = await Task.find({}).populate('assignedTo', 'name email').populate('assignedBy', 'name email').sort('-createdAt');
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
