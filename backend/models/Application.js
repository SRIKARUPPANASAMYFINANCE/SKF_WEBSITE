const mongoose = require('mongoose');
const { customAlphabet } = require('nanoid');

// Generate a custom ID like APP-XXXX
const nanoid = customAlphabet('0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ', 4);

const ApplicationSchema = new mongoose.Schema(
  {
    applicationId: {
      type: String,
      default: () => `APP-${nanoid()}`,
      unique: true,
      required: true,
    },
    fullName: {
      type: String,
      required: true,
    },
    mobile: {
      type: String,
      required: true,
    },
    isWhatsApp: {
      type: Boolean,
      default: true,
    },
    email: {
      type: String,
      required: false,
    },
    amountRequested: {
      type: Number,
      required: true,
    },
    purpose: {
      type: String,
      enum: ['Personal', 'Business', 'Emergency', 'Educational', 'Other'],
      required: false,
    },
    loanType: {
      type: String,
      enum: ['weekly', 'monthly'],
      required: true,
    },
    tenure: {
      type: Number,
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected'],
      default: 'pending',
    },
    assignedAgentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
    documents: {
      type: [String], // Array of file URLs
      default: [],
    },
  },
  { timestamps: true } // Adds createdAt and updatedAt fields
);

module.exports = mongoose.model('Application', ApplicationSchema);