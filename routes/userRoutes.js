const express = require('express');
const router = express.Router();

const userController = require('../controllers/userControllers');
const validate = require('../middlewares/validate');
const { registerSchema, loginSchema } = require('../validation/userValidation');
const { protect, adminOnly } = require('../middlewares/authMiddleware');
const upload = require('../middlewares/uploadMiddleware');
const { uploadAvatar } = require('../controllers/userControllers');

// Routes
router.post('/avatar', protect, upload.single('avatar'), uploadAvatar);
router.delete('/avatar', protect, userController.deleteAvatar);
router.post('/register', validate(registerSchema), userController.registerUser);
router.post('/login', validate(loginSchema), userController.loginUser);
router.post('/refresh', userController.refreshAccessToken);
router.post('/logout', userController.logoutUser);

// Protected profile route
router.get('/profile', protect, (req, res) => {
  // Assuming req.user is set by the protect middleware
  res.json({
    id: req.user._id,
    name: req.user.name,
    email: req.user.email,
    role: req.user.role,
    avatar: req.user.avatar || null,
  });
});

// Admin-only test route

router.get('/admin', protect, adminOnly, (req, res) => {
  res.json({
    message: 'Welcome, Admin!',
    user: {
      id: req.user._id,
      email: req.user.email,
    },
  });
});

module.exports = router;
