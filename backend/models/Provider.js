const mongoose = require('mongoose');

const providerSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true
    },
    servicesOffered: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Service'
      }
    ],
    experienceYears: {
      type: Number,
      default: 3
    },
    bio: {
      type: String,
      default: 'Experienced certified professional serving your neighborhood with quality home repairs and maintenance.'
    },
    hourlyRate: {
      type: Number,
      default: 399
    },
    documents: {
      aadhaarDoc: { type: String, default: '' },
      panDoc: { type: String, default: '' },
      certificates: [{ type: String }]
    },
    availability: {
      isAvailable: { type: Boolean, default: true },
      workingDays: {
        type: [String],
        default: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
      },
      timeSlots: {
        type: [String],
        default: ['09:00 AM', '11:00 AM', '02:00 PM', '04:00 PM', '06:00 PM']
      }
    },
    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected'],
      default: 'approved'
    },
    rating: {
      average: { type: Number, default: 4.8 },
      count: { type: Number, default: 24 }
    },
    completedJobsCount: {
      type: Number,
      default: 38
    },
    serviceRadiusKm: {
      type: Number,
      default: 15
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Provider', providerSchema);
