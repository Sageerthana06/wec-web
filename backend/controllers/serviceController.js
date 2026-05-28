const Service = require('../models/Service');

// @desc    Get all services
// @route   GET /api/services
// @access  Public
const getServices = async (req, res, next) => {
  try {
    const query = {};
    // If not admin, only show active
    if (req.query.status !== 'all') {
      query.status = 'active';
    }
    const services = await Service.find(query).sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      count: services.length,
      data: services,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create a service
// @route   POST /api/services
// @access  Private
const createService = async (req, res, next) => {
  try {
    const { title, description, icon, status } = req.body;

    if (!title || !description) {
      res.status(400);
      throw new Error('Please provide title and description');
    }

    let imageUrl = '';
    if (req.file) {
      imageUrl = req.file.uploadUrl;
    }

    const service = await Service.create({
      title,
      description,
      icon: icon || 'Activity',
      image: imageUrl,
      status: status || 'active',
    });

    res.status(201).json({
      success: true,
      data: service,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update a service
// @route   PUT /api/services/:id
// @access  Private
const updateService = async (req, res, next) => {
  try {
    let service = await Service.findById(req.params.id);

    if (!service) {
      res.status(404);
      throw new Error('Service not found');
    }

    const { title, description, icon, status } = req.body;

    if (title) service.title = title;
    if (description) service.description = description;
    if (icon) service.icon = icon;
    if (status) service.status = status;

    if (req.file) {
      service.image = req.file.uploadUrl;
    }

    await service.save();

    res.status(200).json({
      success: true,
      data: service,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a service
// @route   DELETE /api/services/:id
// @access  Private
const deleteService = async (req, res, next) => {
  try {
    const service = await Service.findById(req.params.id);

    if (!service) {
      res.status(404);
      throw new Error('Service not found');
    }

    await service.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Service deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getServices,
  createService,
  updateService,
  deleteService,
};
