const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');

dotenv.config();

const User = require('../models/User');
const Provider = require('../models/Provider');
const Service = require('../models/Service');
const Booking = require('../models/Booking');

const connectDB = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI || process.env.MONGO_URI;
    if (!mongoUri || mongoUri === '<NEW_CONNECTION_STRING>') {
      throw new Error('MONGODB_URI is not configured in environment variables. Please update backend/.env with a valid database connection string.');
    }
    await mongoose.connect(mongoUri);
    console.log('MongoDB Connected for Seeding...');
  } catch (err) {
    console.error('MongoDB connection error:', err.message);
    process.exit(1);
  }
};

const sampleServices = [
  {
    name: 'Electrical Repairs & Switchboard Fix',
    category: 'Electrician',
    icon: 'Zap',
    description: 'Diagnosis and fixing of short circuits, faulty wiring, light switches, MCB tripping, and fan installation.',
    basePrice: 349,
    priceUnit: 'per visit',
    estimatedDuration: '45 - 60 mins',
    popularTags: ['Short Circuit', 'Wiring', 'MCB Box', 'Fan Installation', 'Lighting'],
    image: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&q=80&w=600'
  },
  {
    name: 'Kitchen & Bathroom Plumbing Leak Fix',
    category: 'Plumber',
    icon: 'Droplet',
    description: 'Expert repair for leaking taps, clogged drain pipes, flush tank malfunction, and water heater pipe fittings.',
    basePrice: 399,
    priceUnit: 'per fix',
    estimatedDuration: '60 mins',
    popularTags: ['Pipe Leakage', 'Tap Repair', 'Clogged Drain', 'Sanitaryware'],
    image: 'https://images.unsplash.com/photo-1585704032915-c3400ca199e7?auto=format&fit=crop&q=80&w=600'
  },
  {
    name: 'Furniture Repair & Custom Carpentry',
    category: 'Carpenter',
    icon: 'Hammer',
    description: 'Door lock replacement, hinge repair, bed assembly, wardrobe repairs, and custom shelving work.',
    basePrice: 499,
    priceUnit: 'per job',
    estimatedDuration: '60 - 120 mins',
    popularTags: ['Door Repair', 'Furniture Assembly', 'Lock Change', 'Cabinet Fix'],
    image: 'https://images.unsplash.com/photo-1533090161767-e6ffed986c88?auto=format&fit=crop&q=80&w=600'
  },
  {
    name: 'Full Home Deep Cleaning',
    category: 'Home Cleaning',
    icon: 'Sparkles',
    description: 'Comprehensive sanitization and deep cleaning of living area, bedrooms, kitchen degreasing, and scrubbed bathrooms.',
    basePrice: 1499,
    priceUnit: 'per flat',
    estimatedDuration: '3 - 4 hours',
    popularTags: ['Sanitization', 'Deep Clean', 'Kitchen Degreasing', 'Bathroom Scrubbing'],
    image: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&q=80&w=600'
  },
  {
    name: 'AC Gas Charging & Jet Service',
    category: 'AC Repair',
    icon: 'Wind',
    description: 'High-pressure foam jet pump washing, gas top-up, cooling optimization, and filter replacement.',
    basePrice: 599,
    priceUnit: 'per unit',
    estimatedDuration: '60 - 90 mins',
    popularTags: ['Gas Refill', 'Jet Wash', 'AC Servicing', 'Cooling Fix'],
    image: 'https://images.unsplash.com/photo-1621905252507-b35492cc74b4?auto=format&fit=crop&q=80&w=600'
  },
  {
    name: 'RO Water Purifier Servicing & Filter Change',
    category: 'RO Repair',
    icon: 'ShieldCheck',
    description: 'Complete RO membrane cleaning, sediment filter check, TDS measurement, and leak fix.',
    basePrice: 299,
    priceUnit: 'per service',
    estimatedDuration: '45 mins',
    popularTags: ['Filter Change', 'TDS Balancing', 'RO Membrane', 'Water Purifier'],
    image: 'https://images.unsplash.com/photo-1548839140-29a749e1bc4e?auto=format&fit=crop&q=80&w=600'
  },
  {
    name: 'Complete Herbal Pest Control',
    category: 'Pest Control',
    icon: 'Shield',
    description: 'Odorless, pet-safe gel treatment for cockroaches, bedbugs, termites, and ants with 6-month warranty.',
    basePrice: 899,
    priceUnit: 'per treatment',
    estimatedDuration: '60 mins',
    popularTags: ['Cockroach Gel', 'Bedbug Control', 'Termite Treatment', 'Pet Safe'],
    image: 'https://images.unsplash.com/photo-1584467735871-8e85353a8413?auto=format&fit=crop&q=80&w=600'
  },
  {
    name: 'Wall Painting & Texture Touchup',
    category: 'Painter',
    icon: 'Paintbrush',
    description: 'Interior wall repainting, waterproof damp check, accent wall texturing, and door enamel painting.',
    basePrice: 1999,
    priceUnit: 'per room',
    estimatedDuration: '1 - 2 days',
    popularTags: ['Interior Paint', 'Waterproofing', 'Accent Wall', 'Primer'],
    image: 'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?auto=format&fit=crop&q=80&w=600'
  }
];

const seedData = async () => {
  try {
    await connectDB();

    await User.deleteMany();
    await Provider.deleteMany();
    await Service.deleteMany();
    await Booking.deleteMany();

    console.log('Cleared old database records.');

    // Seed Services
    const createdServices = await Service.insertMany(sampleServices);
    console.log(`Seeded ${createdServices.length} Services.`);

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('123456', salt);

    // Create Admin User
    const adminUser = await User.create({
      name: 'HomeEase Admin',
      email: 'admin@homeease.ai',
      password: hashedPassword,
      role: 'admin',
      phone: '+91 9876543210',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=300'
    });

    // Create Customer User
    const customerUser = await User.create({
      name: 'Aarav Sharma',
      email: 'customer@demo.com',
      password: hashedPassword,
      role: 'customer',
      phone: '+91 9820011223',
      avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=300',
      address: { street: '402 Sunset Heights', city: 'Mumbai', state: 'Maharashtra', zipCode: '400050' }
    });

    // Create Demo Providers
    const providerUser1 = await User.create({
      name: 'Rajesh Kumar (Master Electrician)',
      email: 'provider1@demo.com',
      password: hashedPassword,
      role: 'provider',
      phone: '+91 9930044556',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=300'
    });

    await Provider.create({
      user: providerUser1._id,
      servicesOffered: [createdServices[0]._id, createdServices[4]._id],
      experienceYears: 7,
      hourlyRate: 399,
      bio: 'Government certified master electrician with 7+ years handling residential wiring, DB boards, and emergency fixes.',
      status: 'approved',
      rating: { average: 4.9, count: 48 },
      completedJobsCount: 82
    });

    const providerUser2 = await User.create({
      name: 'Suresh Patil (Expert Plumber)',
      email: 'provider2@demo.com',
      password: hashedPassword,
      role: 'provider',
      phone: '+91 9870099887',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=300'
    });

    await Provider.create({
      user: providerUser2._id,
      servicesOffered: [createdServices[1]._id, createdServices[5]._id],
      experienceYears: 5,
      hourlyRate: 449,
      bio: 'Specialist in high-pressure leak detection, sanitaryware installation, and kitchen drainage unblocking.',
      status: 'approved',
      rating: { average: 4.8, count: 35 },
      completedJobsCount: 56
    });

    console.log('Seeded Users and Providers successfully!');
    console.log('Demo Credentials:');
    console.log('Admin: admin@homeease.ai | Password: 123456');
    console.log('Customer: customer@demo.com | Password: 123456');
    console.log('Provider: provider1@demo.com | Password: 123456');

    process.exit(0);
  } catch (error) {
    console.error('Seeding error:', error);
    process.exit(1);
  }
};

seedData();
