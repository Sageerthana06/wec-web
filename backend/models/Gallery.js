const mongoose = require('mongoose');

const GallerySchema = new mongoose.Schema(
  {
    imageUrl: {
      type: String,
      required: [true, 'Please add a gallery image URL'],
    },
    title: {
      type: String,
      trim: true,
      default: '',
    },
    category: {
      type: String,
      required: [true, 'Please add a gallery category'],
      default: 'General',
      trim: true,
    },
    description: {
      type: String,
      default: '',
    },
    order: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Gallery', GallerySchema);
