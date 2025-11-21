const express = require('express');
const router = express.Router();
const taskController = require('../controllers/taskController');
const { protect } = require('../middlewares/authMiddleware');

// protect all task routes
router.use(protect);

router.post('/', taskController.createTask);
router.get('/', taskController.listTasks);
router.get('/stats', taskController.taskStats);
router.get('/:id', taskController.getTask);
router.put('/:id', taskController.updateTask);
router.delete('/:id', taskController.deleteTask);

module.exports = router;
