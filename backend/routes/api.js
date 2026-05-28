const express = require('express');
const router = express.Router();

// Middlewares
const { protect } = require('../middleware/auth');
const { upload, handleImageUpload } = require('../middleware/upload');

// Controllers
const { loginUser, getMe, updatePassword } = require('../controllers/authController');
const { getCompanyDetails, updateCompanyDetails } = require('../controllers/companyController');
const { getServices, createService, updateService, deleteService } = require('../controllers/serviceController');
const { getProducts, createProduct, updateProduct, deleteProduct } = require('../controllers/productController');
const { getGallery, createGalleryItem, updateGalleryItem, deleteGalleryItem } = require('../controllers/galleryController');
const { sendMessage, getMessages, updateMessageStatus, deleteMessage } = require('../controllers/messageController');

// Auth Routes
router.post('/auth/login', loginUser);
router.get('/auth/me', protect, getMe);
router.put('/auth/updatepassword', protect, updatePassword);

// Company Details Routes
router.get('/company', getCompanyDetails);
router.put('/company', protect, upload.single('logo'), handleImageUpload, updateCompanyDetails);

// Services Routes
router.get('/services', getServices);
router.post('/services', protect, upload.single('image'), handleImageUpload, createService);
router.put('/services/:id', protect, upload.single('image'), handleImageUpload, updateService);
router.delete('/services/:id', protect, deleteService);

// Products Routes
router.get('/products', getProducts);
router.post('/products', protect, upload.single('image'), handleImageUpload, createProduct);
router.put('/products/:id', protect, upload.single('image'), handleImageUpload, updateProduct);
router.delete('/products/:id', protect, deleteProduct);

// Gallery Routes
router.get('/gallery', getGallery);
router.post('/gallery', protect, upload.single('image'), handleImageUpload, createGalleryItem);
router.put('/gallery/:id', protect, upload.single('image'), handleImageUpload, updateGalleryItem);
router.delete('/gallery/:id', protect, deleteGalleryItem);

// Messages Routes
router.post('/messages', sendMessage);
router.get('/messages', protect, getMessages);
router.put('/messages/:id', protect, updateMessageStatus);
router.delete('/messages/:id', protect, deleteMessage);

module.exports = router;
