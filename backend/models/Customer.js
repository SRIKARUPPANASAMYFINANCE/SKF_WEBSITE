const mongoose = require('mongoose');

const CustomerSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: false, // Changed from true to false
    unique: true,
    lowercase: true,
    trim: true,
    sparse: true // Added to allow multiple documents with null email
  },
  phone: {
    type: String,
    required: true
  },
  address: {
    street: String,
    city: String,
    state: String,
    pincode: String
  },
  aadhaarNumber: {
    type: String,
    required: false,
    unique: true
  },
  panNumber: {
    type: String,
    required: false,
    unique: true
  },
  occupation: {
    type: String,
    enum: ['Business', 'Salaried', 'Self-Employed', 'Other']
  },
  monthlyIncome: {
    type: Number,
    min: 0
  },
  creditScore: {
    type: Number,
    min: 0,
    max: 900,
    default: 600
  },
  status: {
    type: String,
    enum: ['active', 'inactive', 'pending'],
    default: 'active'
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  notes: String
}, {
  timestamps: true
});

// Index for better search performance
CustomerSchema.index({ name: 'text', email: 'text', phone: 'text' });

module.exports = mongoose.model('Customer', CustomerSchema);