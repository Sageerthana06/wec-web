const Gallery = require('../models/Gallery');

// @desc    Get all gallery items
// @route   GET /api/gallery
// @access  Public
const getGallery = async (req, res, next) => {
  try {
    const { category } = req.query;
    const query = {};

    if (category && category !== 'All') {
      query.category = { $regex: new RegExp(`^${category}$`, 'i') };
    }

    const items = await Gallery.find(query).sort({ order: 1, createdAt: -1 });

    res.status(200).json({
      success: true,
      count: items.length,
      data: items,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Add a photo to gallery
// @route   POST /api/gallery
// @access  Private
const createGalleryItem = async (req, res, next) => {
  try {
    const { title, category, description, order } = req.body;

    if (!req.file) {
      res.status(400);
      throw new Error('Please upload an image');
    }

    const galleryItem = await Gallery.create({
      imageUrl: req.file.uploadUrl,
      title: title || '',
      category: category || 'General',
      description: description || '',
      order: order ? Number(order) : 0,
    });

    res.status(201).json({
      success: true,
      data: galleryItem,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update gallery item
// @route   PUT /api/gallery/:id
// @access  Private
const updateGalleryItem = async (req, res, next) => {
  try {
    const { title, category, description, order } = req.body;

    let item = await Gallery.findById(req.params.id);

    if (!item) {
      res.status(404);
      throw new Error('Gallery item not found');
    }

    const updateData = {
      title: title || item.title,
      category: category || item.category,
      description: description !== undefined ? description : item.description,
      order: order !== undefined ? Number(order) : item.order,
    };

    if (req.file) {
      updateData.imageUrl = req.file.uploadUrl;
    }

    item = await Gallery.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      success: true,
      data: item,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete gallery item
// @route   DELETE /api/gallery/:id
// @access  Private
const deleteGalleryItem = async (req, res, next) => {
  try {
    const item = await Gallery.findById(req.params.id);

    if (!item) {
      res.status(404);
      throw new Error('Gallery item not found');
    }

    await item.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Gallery item deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getGallery,
  createGalleryItem,
  updateGalleryItem,
  deleteGalleryItem,
};
