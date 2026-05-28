const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { cloudinary, isCloudinaryConfigured } = require('../config/cloudinary');

// Create local uploads directory if it doesn't exist
const uploadDir = path.join(__dirname, '../public/uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Multer Memory Storage (useful for streaming to Cloudinary)
const storageMemory = multer.memoryStorage();

// Multer Disk Storage (useful for local fallback)
const storageDisk = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  },
});

// File filter
const fileFilter = (req, file, cb) => {
  const filetypes = /jpeg|jpg|png|gif|webp|svg/;
  const mimetype = filetypes.test(file.mimetype);
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());

  if (mimetype && extname) {
    return cb(null, true);
  }
  cb(new Error('Only image files are allowed!'), false);
};

// Define multer uploads
// If Cloudinary is configured, keep in memory. Otherwise write to disk.
const upload = multer({
  storage: isCloudinaryConfigured() ? storageMemory : storageDisk,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: fileFilter,
});

// Middleware to handle Cloudinary upload or local path assignment
const handleImageUpload = async (req, res, next) => {
  if (!req.file) {
    return next();
  }

  try {
    if (isCloudinaryConfigured()) {
      // Stream upload to Cloudinary
      const uploadStream = () => {
        return new Promise((resolve, reject) => {
          const stream = cloudinary.uploader.upload_stream(
            { folder: 'business_website' },
            (error, result) => {
              if (error) return reject(error);
              resolve(result);
            }
          );
          stream.end(req.file.buffer);
        });
      };

      const result = await uploadStream();
      req.file.uploadUrl = result.secure_url;
      req.file.publicId = result.public_id;
    } else {
      // Local fallback - construct URL path
      req.file.uploadUrl = `/uploads/${req.file.filename}`;
    }
    next();
  } catch (error) {
    next(error);
  }
};

module.exports = {
  upload,
  handleImageUpload,
};
