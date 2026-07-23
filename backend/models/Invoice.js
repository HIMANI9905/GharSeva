const mongoose = require('mongoose');

const invoiceSchema = new mongoose.Schema(
  {
    invoiceNumber: {
      type: String,
      unique: true
    },
    booking: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Booking',
      required: true
    },
    customer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    provider: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    serviceName: String,
    basePrice: Number,
    taxAmount: Number,
    discountAmount: Number,
    totalAmount: Number,
    paymentStatus: String,
    issueDate: {
      type: Date,
      default: Date.now
    }
  },
  { timestamps: true }
);

invoiceSchema.pre('save', function (next) {
  if (!this.invoiceNumber) {
    this.invoiceNumber = 'INV-' + Date.now().toString().slice(-6) + '-' + Math.floor(100 + Math.random() * 900);
  }
  next();
});

module.exports = mongoose.model('Invoice', invoiceSchema);
