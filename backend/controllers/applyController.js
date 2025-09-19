const Application = require('../models/Application');
const Customer = require('../models/Customer'); // Keep Customer import for now, though not directly used in createApplication
const automationService = require('../utils/automationService');
const { appendToSheet } = require('../utils/googleSheets');

// @desc    Create a new loan application
// @route   POST /api/apply
// @access  Public
const createApplication = async (req, res) => {
  try {
    console.log('Backend received req.body:', req.body); // Added console.log
    const {
      fullName,
      mobile,
      isWhatsApp,
      email,
      loanAmount, // Changed from amountRequested
      purpose,
      loanType,
      tenure,
      address,
    } = req.body;

    // Explicitly convert to Number before creating the Mongoose document
    let parsedAmountRequested = parseFloat(loanAmount);
    let parsedTenure = parseInt(tenure);

    // If parsing results in NaN, set to 0 to avoid Mongoose validation error
    if (isNaN(parsedAmountRequested)) {
      parsedAmountRequested = 0;
    }
    if (isNaN(parsedTenure)) {
      parsedTenure = 0;
    }

    console.log('Parsed amountRequested (after NaN check):', parsedAmountRequested, 'Parsed tenure (after NaN check):', parsedTenure);

    // --- 1. Create Application ---
    const application = new Application({
      fullName,
      mobile,
      isWhatsApp,
      email,
      amountRequested: parsedAmountRequested, // Use the parsed value
      purpose,
      loanType,
      tenure: parsedTenure, // Use the parsed value
      address,
    });

    await application.save();

    // --- 2. Automations (Google Sheets, WhatsApp, etc.) ---
    // Trigger these asynchronously so they don't block the response

    // Send to Google Sheets directly using googleSheets.js
    appendToSheet([
      application.applicationId,
      application.fullName,
      application.mobile,
      application.email || '', // Use empty string if email is not provided
      application.amountRequested,
      application.purpose || '', // Use empty string if purpose is not provided
      application.status,
      application.createdAt.toISOString(), // Convert Date to ISO string for sheet
      application.loanType,
      application.tenure,
      application.address,
      application.isWhatsApp ? 'Yes' : 'No', // Convert boolean to Yes/No for sheet
    ]);

    automationService.sendApplicantNotification(application.mobile, application.fullName, application.applicationId, application.email);
    automationService.sendOwnerNotification(application); // Pass the entire application object
    automationService.sendAdminNotification({
      applicationId: application.applicationId,
      fullName: application.fullName, // Changed 'name' to 'fullName' for consistency
      amountRequested: application.amountRequested,
    });

    res.status(201).json({
      message: 'Application submitted successfully.',
      applicationId: application.applicationId,
    });

  } catch (error) {
    console.error('Error creating application:', error);
    res.status(500).json({ message: 'Server error while creating application.', error: error.message });
  }
};

// @desc    Get all loan applications
// @route   GET /api/apply
// @access  Private (Admin/Agent only)
const getApplications = async (req, res) => {
  try {
    // Populate customerId is no longer relevant as it's removed from Application schema
    const applications = await Application.find().sort({ createdAt: -1 });
    res.status(200).json({ applications });
  } catch (error) {
    console.error('Error fetching applications:', error);
    res.status(500).json({ message: 'Server error while fetching applications.', error: error.message });
  }
};

module.exports = {
  createApplication,
  getApplications,
};