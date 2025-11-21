const mongoose = require('mongoose');

const taskSchema = mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    status: {
      type: String,
      enum: ['todo', 'in-progress', 'done'],
      default: 'todo',
    },
    priority: {
      type: String,
      enum: ['low', 'medium', 'high'],
      default: 'medium',
    },
    dueDate: {
      type: Date,
    },
    // Reference to the User model who owns the task
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
  },
  { timestamps: true }
);

// Compound index: owner + status (fast queries for a user's tasks by status)
taskSchema.index({ owner: 1, status: 1 });

// Text index: title + description (enables text search on tasks)
taskSchema.index({ title: 'text', description: 'text' });

// Virtual property: short summary of the task
taskSchema.virtual('shortSummary').get(function () {
  return `${this.title} - ${this.status}`;
});

// Ensure virtual fields are serialized
taskSchema.set('toObject', { virtuals: true });
taskSchema.set('toJSON', { virtuals: true });

module.exports = mongoose.model('Task', taskSchema);
