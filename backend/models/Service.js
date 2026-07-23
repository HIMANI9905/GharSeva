const mongoose = require('mongoose');

const serviceSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Service name is required'],
      trim: true
    },
    category: {
      type: String,
      required: [true, 'Service category is required'],
      enum: [
        'Electrician',
        'Plumber',
        'Carpenter',
        'Painter',
        'Home Cleaning',
        'AC Repair',
        'RO Repair',
        'Pest Control',
        'Beautician',
        'Appliance Repair',
        'Tutors',
        'House Shifting'
      ]
    },
    icon: {
      type: String,
      default: 'Wrench'
    },
    description: {
      type: String,
      required: [true, 'Service description is required']
    },
    basePrice: {
      type: Number,
      required: [true, 'Base price is required']
    },
    priceUnit: {
      type: String,
      default: 'per visit'
    },
    estimatedDuration: {
      type: String,
      default: '60 - 90 mins'
    },
    popularTags: [String],
    image: {
      type: String,
      default: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&q=80&w=600'
    },
    isActive: {
      type: Boolean,
      default: true
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Service', serviceSchema);
