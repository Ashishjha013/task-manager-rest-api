const asyncHandler = require('../middlewares/asyncHandler');
const Task = require('../models/taskModel');
const mongoose = require('mongoose');
const { setCache, getCache, delCache } = require('../utils/cache');
const { x } = require('joi');

// Create task (owner = req.user._id)
exports.createTask = asyncHandler(async (req, res) => {
  const { title, description, status, priority, dueDate } = req.body;
  const owner = req.user._id;

  const task = await Task.create({ title, description, status, priority, dueDate, owner });

  // invalidate stats cache for this user
  await delCache(`tasks:stats:${owner}`);
  res.status(201).json({ success: true, data: task });
});

// Get single task (ensure ownership OR admin)
exports.getTask = asyncHandler(async (req, res) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    res.status(400);
    throw new Error('Invalid task ID');
  }
  const task = await Task.findById(id).populate('owner', 'name email role');
  if (!task) {
    res.status(404);
    throw new Error('Task not found');
  }

  // allow owner or admin
  const ownerIdStr = (task.owner._id || task.owner).toString();
  if (ownerIdStr !== req.user._id.toString() && req.user.role !== 'admin') {
    res.status(403);
    throw new Error('Forbidden: You do not have access to this task');
  }

  res.json({ success: true, data: task });
});

// List tasks with pagination, filter, sort, text search
exports.listTasks = asyncHandler(async (req, res) => {
  const { page = 1, limit = 10, status, priority, q, sort = '-createdAt' } = req.query || {};
  const skip = (Number(page) - 1) * Number(limit);

  // by default user sees own tasks
  const filter = { owner: req.user._id };
  if (status) filter.status = status;
  if (priority) filter.priority = priority;
  // text search
  if (q) {
    filter.$text = { $search: q };
  }

  // allow only known sort values
  const ALLOWED_SORT = ['-createdAt', 'createdAt', '-dueDate', 'dueDate'];
  const sortVal = ALLOWED_SORT.includes(sort) ? sort : '-createdAt';

  // build a unique cache key per user + filters
  const cacheKey = `tasks:${req.user._id}:p=${page}:l=${limit}:s=${status || ''}:pr=${
    priority || ''
  }:q=${encodeURIComponent(q || '')}:sort=${sortVal}`;

  // 1) Try cache first
  const cached = await getCache(cacheKey);
  if (cached) {
    return res.json({
      success: true,
      meta: cached.meta,
      data: cached.data,
      cached: true,
    });
  }

  // 2) If no cache → hit DB
  const taskPromise = Task.find(filter)
    .sort(sortVal)
    .skip(skip)
    .limit(Number(limit))
    .select('-__v');

  const countPromise = Task.countDocuments(filter);

  const [tasks, total] = await Promise.all([taskPromise, countPromise]);

  const responseData = {
    meta: {
      total,
      page: Number(page),
      limit: Number(limit),
      pages: Math.ceil(total / limit),
    },
    data: tasks,
  };

  // 3) Save in cache
  await setCache(cacheKey, responseData);

  res.json({
    success: true,
    ...responseData,
  });
});

// Update task (ensure ownership OR admin)
exports.updateTask = asyncHandler(async (req, res) => {
  const { id } = req.params;

  // validate id
  if (!mongoose.Types.ObjectId.isValid(id)) {
    res.status(400);
    throw new Error('Invalid task ID');
  }
  // find task
  const task = await Task.findById(id);
  // check existence
  if (!task) {
    res.status(404);
    throw new Error('Task not found');
  }
  // allow owner or admin
  if (task.owner.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
    res.status(403);
    throw new Error('Forbidden: You do not have permission to update this task');
  }

  // update fields
  Object.assign(task, req.body);
  const updated = await task.save();

  // invalidate stats cache for this user
  await delCache(`tasks:stats:${task.owner}`);

  res.json({ success: true, data: updated });
});

// Delete task (ensure ownership OR admin)
exports.deleteTask = asyncHandler(async (req, res) => {
  const { id } = req.params;

  // validate id
  if (!mongoose.Types.ObjectId.isValid(id)) {
    res.status(400);
    throw new Error('Invalid task ID');
  }
  // find task
  const task = await Task.findById(id);
  // check existence
  if (!task) {
    res.status(404);
    throw new Error('Task not found');
  }
  // allow owner or admin
  if (task.owner.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
    res.status(403);
    throw new Error('Forbidden: You do not have permission to delete this task');
  }

  const ownerId = task.owner;
  await Task.findByIdAndDelete(id);

  // invalidate stats cache for this user
  await delCache(`tasks:stats:${ownerId}`);

  res.json({
    success: true,
    message: 'Task deleted successfully',
  });
});

// Aggregation example: stats for logged-in user (count per status)
exports.taskStats = asyncHandler(async (req, res) => {
  const ownerId = req.user._id;
  const cacheKey = `tasks:stats:${ownerId}`;

  // 1) Try cache
  const cached = await getCache(cacheKey);
  if (cached) {
    return res.json({
      stats: cached,
      cached: true,
    });
  }

  // 2) Compute from DB
  const stats = await Task.aggregate([
    { $match: { owner: new mongoose.Types.ObjectId(ownerId) } },
    { $group: { _id: '$status', count: { $sum: 1 } } },
    { $project: { status: '$_id', count: 1, _id: 0 } },
  ]);

  // 3) Store in cache
  await setCache(cacheKey, stats);

  return res.json({ success: true, stats });
});
