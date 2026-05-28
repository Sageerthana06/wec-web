const CompanyDetails = require('../models/CompanyDetails');

// @desc    Get company details
// @route   GET /api/company
// @access  Public
const getCompanyDetails = async (req, res, next) => {
  try {
    let company = await CompanyDetails.findOne();
    if (!company) {
      // Create defaults
      company = await CompanyDetails.create({});
    }
    res.status(200).json({
      success: true,
      data: company,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update company details
// @route   PUT /api/company
// @access  Private
const updateCompanyDetails = async (req, res, next) => {
  try {
    let company = await CompanyDetails.findOne();
    if (!company) {
      company = new CompanyDetails({});
    }

    const {
      name,
      description,
      mission,
      vision,
      address,
      phone,
      email,
      whatsapp,
      socialLinks,
      mapEmbedUrl,
    } = req.body;

    if (name) company.name = name;
    if (description) company.description = description;
    if (mission) company.mission = mission;
    if (vision) company.vision = vision;
    if (address) company.address = address;
    if (phone) company.phone = phone;
    if (email) company.email = email;
    if (whatsapp) company.whatsapp = whatsapp;
    if (mapEmbedUrl) company.mapEmbedUrl = mapEmbedUrl;

    if (socialLinks) {
      // Parse social links if passed as string (from multipart form data)
      const parsedLinks = typeof socialLinks === 'string' ? JSON.parse(socialLinks) : socialLinks;
      company.socialLinks = {
        ...company.socialLinks,
        ...parsedLinks,
      };
    }

    // Handle logo if uploaded
    if (req.file) {
      company.logo = req.file.uploadUrl;
    }

    await company.save();

    res.status(200).json({
      success: true,
      data: company,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getCompanyDetails,
  updateCompanyDetails,
};
