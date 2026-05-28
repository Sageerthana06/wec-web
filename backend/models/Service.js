const mongoose = require('mongoose');

const ServiceSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Please add a service title'],
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Please add a service description'],
    },
    icon: {
      type: String,
      default: 'Activity', // Default Lucide icon name
    },
    image: {
      type: String,
      default: '',
    },
    status: {
      type: String,
      enum: ['active', 'inactive'],
      default: 'active',
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Service', ServiceSchema);
