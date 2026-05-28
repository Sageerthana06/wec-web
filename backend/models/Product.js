const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please add a product name'],
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Please add a product description'],
    },
    price: {
      type: Number,
      required: [true, 'Please add a product price'],
      default: 0,
    },
    category: {
      type: String,
      required: [true, 'Please add a product category'],
      default: 'General',
      trim: true,
    },
    image: {
      type: String,
      required: [true, 'Please add a product image'],
    },
    status: {
      type: String,
      enum: ['active', 'inactive'],
      default: 'active',
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Product', ProductSchema);
