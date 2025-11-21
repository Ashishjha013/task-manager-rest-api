const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ['user', 'admin'],
      default: 'user',
    },

    // Refresh Tokens for maintaining sessions
    refreshTokens: [{ type: String }],

    // avatar URL from Cloudinary
    avatar: {
      url: { type: String },
      publicId: { type: String },
    },
  },
  { timestamps: true }
);

// Virtual property: tasks owned by the user
userSchema.virtual('task', {
  ref: 'Task',
  localField: '_id',
  foreignField: 'owner',
  justOne: false,
});

userSchema.set('toObject', { virtuals: true });
userSchema.set('toJSON', { virtuals: true });

module.exports = mongoose.model('User', userSchema);
