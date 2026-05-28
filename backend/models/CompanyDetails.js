const mongoose = require('mongoose');

const CompanyDetailsSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please add a company name'],
      default: 'Business Name',
    },
    logo: {
      type: String,
      default: '',
    },
    description: {
      type: String,
      default: 'Welcome to our company. We provide premium services and products to our clients.',
    },
    mission: {
      type: String,
      default: 'To deliver exceptional quality and innovation to our customers.',
    },
    vision: {
      type: String,
      default: 'To be a global leader in our industry and empower communities.',
    },
    address: {
      type: String,
      default: '123 Business Rd, Suite 100, City, State, Country',
    },
    phone: {
      type: String,
      default: '+1 234 567 8900',
    },
    email: {
      type: String,
      default: 'info@business.com',
    },
    whatsapp: {
      type: String,
      default: '+12345678900',
    },
    socialLinks: {
      facebook: { type: String, default: '' },
      twitter: { type: String, default: '' },
      instagram: { type: String, default: '' },
      linkedin: { type: String, default: '' },
      youtube: { type: String, default: '' },
    },
    mapEmbedUrl: {
      type: String,
      default: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3151.835434509374!2d144.9537353153153!3d-37.81627977975171!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x6ad65d4c2b34f555%3A0x8dd076b3cd1705e4!2sMelbourne%20VIC%2C%20Australia!5e0!3m2!1sen!2sus!4v1633000000000!5m2!1sen!2sus',
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('CompanyDetails', CompanyDetailsSchema);
