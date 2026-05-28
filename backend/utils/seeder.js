require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/User');
const CompanyDetails = require('../models/CompanyDetails');
const Service = require('../models/Service');
const Product = require('../models/Product');
const Gallery = require('../models/Gallery');

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/business_website');
    console.log('MongoDB Connected for seeding...');
  } catch (error) {
    console.error(`Error connecting to DB: ${error.message}`);
    process.exit(1);
  }
};

const seedData = async () => {
  try {
    await connectDB();

    // 1. Seed Admin User
    const adminExists = await User.findOne({ username: 'admin' });
    if (!adminExists) {
      await User.create({
        username: 'admin',
        email: 'admin@example.com',
        password: 'adminpassword123', // Will be hashed automatically by pre-save hook
      });
      console.log('Admin account created: admin / adminpassword123');
    } else {
      console.log('Admin account already exists.');
    }

    // 2. Seed Company Details
    const companyExists = await CompanyDetails.findOne();
    if (!companyExists) {
      await CompanyDetails.create({
        name: 'World Entrepreneurs Company',
        logo: '',
        description: 'World Entrepreneurs Export & Import (PVT) LTD is a leading international trading firm based in Jaffna, Sri Lanka. We specialize in connecting local manufacturers and premium regional products with global markets, while importing high-quality essential goods to meet domestic demands with excellence and trust',
        mission: 'To engineer cutting-edge, high-performance digital products that solve complex real-world problems and drive long-term business growth.',
        vision: 'To be the global benchmark for technical excellence, inspiring progress and digital transformation across industries.',
        address: 'No,348, Stanly Road, Jaffna.',
        phone: '0217223317',
        email: 'Worldentrepreneurs78@gmail.com',
        whatsapp: '0770287429',
        socialLinks: {

          facebook: 'https://facebook.com/apextech',
          twitter: 'https://twitter.com/apextech',
          instagram: 'https://instagram.com/apextech',
          linkedin: 'https://linkedin.com/company/apextech',
          youtube: 'https://youtube.com/apextech',
        },
        mapEmbedUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3153.0642455823126!2d-122.40137568468205!3d37.785089979757644!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8085807d4b47ea5b%3A0xcd50567e4113264b!2sSilicon%20Valley!5e0!3m2!1sen!2sus!4v1633000000000!5m2!1sen!2sus',
      });
      console.log('Default company details seeded.');
    } else {
      console.log('Company details already exist.');
    }

    // 3. Seed Services
    await Service.deleteMany({});
    const services = [
      {
        title: 'Custom Web Applications',
        description: 'High-performance, secure, and SEO-friendly single-page and multi-page web applications custom tailored to your business rules and database designs.',
        icon: 'Globe',
        status: 'active',
      },
      {
        title: 'Mobile App Development',
        description: 'Immersive cross-platform native iOS & Android applications built with React Native or Flutter, featuring offline-first storage and real-time syncing.',
        icon: 'Smartphone',
        status: 'active',
      },
      {
        title: 'UI/UX Design Systems',
        description: 'Vibrant, accessible user interface mockups and prototype wireframes built using modern typography, sleek gradients, and micro-interactions.',
        icon: 'Figma',
        status: 'active',
      },
      {
        title: 'Cloud & DevOps Architecture',
        description: 'Secure infrastructure management, containerization with Docker, Kubernetes clustering, CI/CD automated deployments, and AWS cloud migrations.',
        icon: 'Cloud',
        status: 'active',
      },
    ];
    await Service.insertMany(services);
    console.log('Sample services seeded.');

    // 4. Seed Products
    await Product.deleteMany({});
    const products = [
      {
        name: 'Veloce UI Kit',
        description: 'A comprehensive, modern React component library built with Tailwind CSS, featuring dark mode, floating Glassmorphism states, and pre-built responsive layout blocks.',
        price: 49.00,
        category: 'UI Components',
        image: 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&w=600&q=80',
        status: 'active',
      },
      {
        name: 'ExpressJS SaaS Boilerplate',
        description: 'The ultimate backend starter package equipped with JWT auth, password resets, file upload helpers, MongoDB configuration, Stripe subscription APIs, and unit test suites.',
        price: 129.00,
        category: 'Boilerplates',
        image: 'https://images.unsplash.com/photo-1618401471353-b98aedd07871?auto=format&fit=crop&w=600&q=80',
        status: 'active',
      },
      {
        name: 'Aether Task Planner',
        description: 'A ready-to-deploy agile sprint planning board application featuring real-time drag-and-drop task items, team collaboration tools, and automatic charts generator.',
        price: 79.00,
        category: 'Applications',
        image: 'https://images.unsplash.com/photo-1542744094-3a31f103e35f?auto=format&fit=crop&w=600&q=80',
        status: 'active',
      },
      {
        name: 'Nexus E-Commerce Engine',
        description: 'A scalable ecommerce core system complete with headless shopping cart, payment checkouts, dynamic inventory tracker, and powerful sales reports dashboard.',
        price: 199.00,
        category: 'E-Commerce',
        image: 'https://images.unsplash.com/photo-1563013544-824ae1d704d3?auto=format&fit=crop&w=600&q=80',
        status: 'active',
      },
    ];
    await Product.insertMany(products);
    console.log('Sample products seeded.');

    // 5. Seed Gallery
    await Gallery.deleteMany({});
    const galleryItems = [
      {
        imageUrl: '/uploads/chairman.jpg', // PLEASE UPDATE THIS PATH OR RE-UPLOAD IN ADMIN PANEL
        title: 'Chairman',
        category: 'Promotion',
        description: 'Boss means power, power means us. World Entrepreneurs Company.',
      },
      {
        imageUrl: '/uploads/hr.jpg', // PLEASE UPDATE THIS PATH OR RE-UPLOAD IN ADMIN PANEL
        title: 'HR ',
        category: 'Promotion',
        description: 'Empowering people. Building leaders. Creating legacies. The heart of our success.',
      },

      {
        imageUrl: '/uploads/2.jpg', // PLEASE UPDATE THIS PATH OR RE-UPLOAD IN ADMIN PANEL
        title: 'Manager',
        category: 'Promotion',
        description: 'Empowering people. Building leaders. Creating legacies. The heart of our success.',
      },

      {
        imageUrl: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=800&q=80',
        title: 'Collaborative Meeting Spaces',
        category: 'Office',
        description: 'Our open glass meeting rooms designed to foster creativity and brainstorming.',
      },
      {
        imageUrl: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=800&q=80',
        title: 'Creative Hackathon 2026',
        category: 'Events',
        description: 'Engineering teams collaborating to build web and mobile application prototypes.',
      },
      {
        imageUrl: 'https://images.unsplash.com/photo-1581291518633-83b4ebd1d83e?auto=format&fit=crop&w=800&q=80',
        title: 'Interactive Design Lab',
        category: 'Design',
        description: 'Sleek dark themes and wireframe designs reviewed by our product designers.',
      },
      {
        imageUrl: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=800&q=80',
        title: 'Enterprise Server Operations',
        category: 'Technology',
        description: 'Our high-speed secure cloud server integrations and DevOps deployment setups.',
      },
    ];
    await Gallery.insertMany(galleryItems);
    console.log('Sample gallery seeded.');

    console.log('Database Seeding Completed Successfully!');
    process.exit(0);
  } catch (error) {
    console.error(`Error seeding data: ${error.message}`);
    process.exit(1);
  }
};

seedData();
