const asyncHandler = require('../middlewares/asyncHandler');
const User = require('../models/userModel');
const { hashPassword, comparePassword } = require('../utils/hash');
const { generateAccessToken, generateRefreshToken } = require('../utils/token');
const jwt = require('jsonwebtoken');
const cloudinary = require('../config/cloudinary');

// Upload avatar for logged-in user
exports.uploadAvatar = asyncHandler(async (req, res) => {
  if (!req.file) {
    res.status(400);
    throw new Error('No file uploaded');
  }

  // If user already has an avatar, delete it from Cloudinary
  if (req.user.avatar && req.user.avatar.publicId) {
    try {
      await cloudinary.uploader.destroy(req.user.avatar.publicId);
    } catch (err) {
      // log but don't block
      console.error('Failed to delete old avatar: ', err.message);
    }
  }

  // Upload new file (buffer) to Cloudinary
  const result = await cloudinary.uploader.upload_stream(
    {
      folder: 'avatars',
      resource_type: 'image',
    },
    async (error, uploaded) => {
      if (error) {
        throw new Error('Cloudinary upload failed');
      }

      req.user.avatar = {
        url: uploaded.secure_url,
        publicId: uploaded.public_id,
      };

      await req.user.save();

      res.json({
        message: 'Avatar uploaded successfully',
        avatar: req.user.avatar,
      });
    }
  );
  // Pipe buffer to Cloudinary stream
  result.end(req.file.buffer);
});

// Delete avatar for logged-in user
exports.deleteAvatar = asyncHandler(async (req, res) => {
  if (!req.user.avatar || !req.user.avatar.publicId) {
    res.status(400);
    throw new Error('No avatar to delete');
  }

  await cloudinary.uploader.destroy(req.user.avatar.publicId);

  req.user.avatar = undefined;
  await req.user.save();

  res.json({
    message: 'Avatar deleted successfully',
  });
});

// Refresh Access Token
exports.refreshAccessToken = asyncHandler(async (req, res) => {
  const tokenFromCookie = req.cookies.refreshToken;

  if (!tokenFromCookie) {
    res.status(401);
    throw new Error('No refresh token');
  }

  try {
    // Verify the refresh token and decode it to get user ID
    const decoded = jwt.verify(
      tokenFromCookie,
      process.env.JWT_REFRESH_SECRET || 'refreshsecretkey'
    );

    // Find the user associated with the token
    const user = await User.findById(decoded.id);
    if (!user) {
      res.status(401);
      throw new Error('User not found');
    }

    // Check if the refresh token is still valid for the user
    if (!user.refreshTokens || !user.refreshTokens.includes(tokenFromCookie)) {
      res.status(401);
      throw new Error('Refresh token is not valid anymore');
    }

    // Generate new access token
    const newAccessToken = generateAccessToken(user._id);
    res.json({ accessToken: newAccessToken });
  } catch (err) {
    res.status(401);
    throw new Error('Invalid or expired refresh token');
  }
});

// Register User
exports.registerUser = asyncHandler(async (req, res) => {
  // Extract data from request body
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    res.status(400);
    throw new Error('Name, email, and password are required');
  }

  try {
    // Hash password and create user
    const hashedPassword = await hashPassword(password);
    const user = await User.create({ name, email, password: hashedPassword });

    const accessToken = generateAccessToken(user._id);
    const refreshToken = generateRefreshToken(user._id);

    user.refreshTokens = [...(user.refreshTokens || []), refreshToken];
    await user.save();

    // Set refresh token in HTTP-only cookie
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: false, // Set to true in production with HTTPS
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    // Respond with user data and token
    res.status(201).json({
      id: user._id,
      name: user.name,
      email: user.email,
      accessToken,
    });
  } catch (err) {
    // Handle duplicate email error
    if (err.code && err.code === 11000) {
      res.status(400);
      throw new Error('Email already exists');
    }
    throw err;
  }
});

// Login User
exports.loginUser = asyncHandler(async (req, res) => {
  // Extract data from request body
  const { email, password } = req.body;

  // Find user and validate password
  const user = await User.findOne({ email });
  if (!user) {
    res.status(401);
    throw new Error('Invalid email or password');
  }
  // Compare passwords
  const match = await comparePassword(password, user.password);
  if (!match) {
    res.status(401);
    throw new Error('Invalid email or password');
  }

  const accessToken = generateAccessToken(user._id);
  const refreshToken = generateRefreshToken(user._id);

  user.refreshTokens = [...(user.refreshTokens || []), refreshToken];
  await user.save();

  // Set refresh token in HTTP-only cookie
  res.cookie('refreshToken', refreshToken, {
    httpOnly: true,
    secure: false, // Set to true in production with HTTPS
    sameSite: 'lax',
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  // Respond with user data and token
  res.json({
    id: user._id,
    name: user.name,
    email: user.email,
    accessToken,
  });
});

// Logout User
exports.logoutUser = asyncHandler(async (req, res) => {
  const tokenFromCookie = req.cookies.refreshToken;

  // Clear the refresh token cookie
  if (tokenFromCookie) {
    // no verify; we just want id if present
    const decoded = jwt.decode(tokenFromCookie);

    // no verify; we just want id if present
    // Remove the refresh token from user's refreshTokens array
    if (decoded && decoded.id) {
      const user = await User.findById(decoded.id);
      if (user && user.refreshTokens) {
        user.refreshTokens = user.refreshTokens.filter((t) => t !== tokenFromCookie);
      }
    }

    // Clear cookie
    res.clearCookie('refreshToken', {
      httpOnly: true,
      secure: false, // Set to true in production with HTTPS
      sameSite: 'lax',
    });

    // Respond with success message
    res.json({
      message: 'Logged out successfully',
    });
  }
});
