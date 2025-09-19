const axios = require('axios');
const { sendEmail } = require('./email'); // Import sendEmail

// Read config directly from environment variables
const GOOGLE_SHEETS_WEBHOOK_URL = process.env.GOOGLE_SHEETS_WEBHOOK_URL;
const TWILIO_ACCOUNT_SID = process.env.TWILIO_ACCOUNT_SID;
const TWILIO_AUTH_TOKEN = process.env.TWILIO_AUTH_TOKEN;
const TWILIO_WHATSAPP_NUMBER = process.env.TWILIO_WHATSAPP_NUMBER;
const TWILIO_SMS_NUMBER = process.env.TWILIO_SMS_NUMBER;
const OWNER_WHATSAPP_NUMBER = process.env.OWNER_WHATSAPP_NUMBER;
const ADMIN_NOTIFICATION_PHONE = process.env.ADMIN_NOTIFICATION_PHONE;
const OWNER_EMAIL = process.env.OWNER_EMAIL; // Owner's email
const EMAIL_USER = process.env.EMAIL_USER; // Email user for 'from' address

const twilio = require('twilio')(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN);

// Helper function to format phone numbers to E.164 format
const formatToE164 = (phoneNumber, countryCode = '+91') => {
  if (!phoneNumber) return null;
  const digitsOnly = phoneNumber.replace(/\D/g, '');
  if (phoneNumber.startsWith('+')) {
    return phoneNumber;
  }
  if (!digitsOnly.startsWith(countryCode.replace('+', ''))) {
    return countryCode + digitsOnly;
  }
  return '+' + digitsOnly;
};

// Function to send data to Google Sheets via Webhook
const sendToGoogleSheets = async (applicationData) => {
  try {
    console.log('Attempting to send data to Google Sheets webhook...');
    await axios.post(GOOGLE_SHEETS_WEBHOOK_URL, applicationData);
    console.log('Data sent to Google Sheets webhook successfully.');
  } catch (error) {
    console.error('Error sending data to Google Sheets webhook:', error.message);
    if (error.response) {
      console.error('Google Sheets Webhook Error Response:', error.response.data);
    }
  }
};

// Generic function to send WhatsApp messages
const sendWhatsAppMessage = async (to, body = null, templateName = null, templateParams = {}) => {
  try {
    console.log(`Attempting to send WhatsApp to ${to}...`);
    const messageOptions = {
      from: TWILIO_WHATSAPP_NUMBER,
      to: to,
    };

    if (templateName) {
      messageOptions.contentSid = templateName;
      messageOptions.contentVariables = JSON.stringify(templateParams);
    } else if (body) {
      messageOptions.body = body;
    } else {
      throw new Error('Either body or templateName must be provided.');
    }

    await twilio.messages.create(messageOptions);
    console.log('WhatsApp message sent successfully.');
  } catch (error) {
    console.error('Error sending WhatsApp message:', error.message);
    throw error;
  }
};

// Generic function to send SMS messages
const sendSMSMessage = async (to, body) => {
  try {
    console.log(`Attempting to send SMS to ${to}...`);
    await twilio.messages.create({
      from: TWILIO_SMS_NUMBER,
      to: to,
      body: body,
    });
    console.log('SMS message sent successfully.');
  } catch (error) {
    console.error('Error sending SMS message:', error.message);
  }
};

// Function to send WhatsApp, SMS and Email messages to applicant
const sendApplicantNotification = async (applicantPhone, applicantName, applicationId, applicantEmail) => {
  const formattedApplicantPhone = formatToE164(applicantPhone);
  const whatsappTo = `whatsapp:${formattedApplicantPhone}`;
  const smsTo = formattedApplicantPhone;
  const whatsappTemplateName = 'HXb5b62575e6e4ff6129ad7c8efe1f983e';
  const whatsappTemplateParams = {
    1: applicantName,
    2: applicationId,
  };
  const smsBody = `Hi ${applicantName}, your application (ID: ${applicationId}) has been received. We'll message you within 24-48 hours with next steps.`;
  const emailSubject = `Loan Application Received - ID: ${applicationId}`;
  const emailBody = `Dear ${applicantName},

Your loan application with ID: ${applicationId} has been successfully received. We are currently reviewing your application and will get back to you within 24-48 hours with the next steps.

Thank you for choosing SRI KARUPPASAMY FINANCE.

Sincerely,
SRI KARUPPASAMY FINANCE Team`;

  // Temporarily disabled WhatsApp notification for applicant as per user request
  // try {
  //   await sendWhatsAppMessage(whatsappTo, null, whatsappTemplateName, whatsappTemplateParams);
  // } catch (error) {
  //   console.error('Failed to send WhatsApp notification to applicant:', error.message);
  // }

  try {
    if (smsTo) {
      await sendSMSMessage(smsTo, smsBody);
    }
  } catch (error) {
    console.error('Failed to send SMS notification to applicant:', error.message);
  }

  // Temporarily disabled email notification for applicant as per user request
  // try {
  //   if (applicantEmail) {
  //     await sendEmail(applicantEmail, emailSubject, emailBody);
  //     console.log('Email notification sent to applicant successfully.');
  //   }
  // } catch (error) {
  //   console.error('Failed to send email notification to applicant:', error.message);
  // }
};

// Function to send WhatsApp, SMS and Email messages to owner
const sendOwnerNotification = async (applicationData) => {
  const {
    applicationId,
    fullName,
    mobile,
    isWhatsApp,
    email,
    amountRequested,
    purpose,
    loanType,
    tenure,
    address,
    status,
    createdAt,
  } = applicationData;

  const formattedOwnerPhone = formatToE164(ADMIN_NOTIFICATION_PHONE);
  const whatsappTo = OWNER_WHATSAPP_NUMBER;
  const smsTo = formattedOwnerPhone;

  const whatsappTemplateName = 'HXxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx'; // This might need to be a generic template or a direct message
  const whatsappTemplateParams = {
    1: fullName,
    2: mobile,
    3: email || 'N/A',
    4: amountRequested.toString(),
    5: purpose || 'N/A',
    6: loanType,
    7: tenure.toString(),
    8: address,
    9: status,
    10: applicationId,
    11: isWhatsApp ? 'Yes' : 'No',
    12: new Date(createdAt).toLocaleString(),
  };

  const notificationDetails = `New Loan Application (ID: ${applicationId}):
Name: ${fullName}
Mobile: ${mobile} (WhatsApp: ${isWhatsApp ? 'Yes' : 'No'})
Email: ${email || 'N/A'}
Amount: ${amountRequested}
Purpose: ${purpose || 'N/A'}
Loan Type: ${loanType}
Tenure: ${tenure} months
Address: ${address}
Status: ${status}
Applied On: ${new Date(createdAt).toLocaleString()}`;

  const smsBody = notificationDetails;
  const emailSubject = `New Loan Application Received - ID: ${applicationId}`;
  const emailBody = `Dear Owner,

A new loan application has been submitted. Here are the details:

${notificationDetails}

Please log in to the admin dashboard for more details and to process the application.

Sincerely,
SRI KARUPPASAMY FINANCE System`;

  try {
    await sendWhatsAppMessage(whatsappTo, null, whatsappTemplateName, whatsappTemplateParams);
  } catch (error) {
    console.error('Failed to send WhatsApp owner notification:', error.message);
    try {
      await sendWhatsAppMessage(whatsappTo, smsBody);
      console.log('Sent direct WhatsApp message to owner as fallback.');
    } catch (fallbackError) {
      console.error('Failed to send direct WhatsApp message to owner as fallback:', fallbackError.message);
    }
  }

  try {
    if (smsTo) {
      await sendSMSMessage(smsTo, smsBody);
    }
  } catch (error) {
    console.error('Failed to send SMS owner notification:', error.message);
  }

  // Temporarily disabled email notification for owner as per user request
  // try {
  //   if (OWNER_EMAIL) {
  //     await sendEmail(OWNER_EMAIL, emailSubject, emailBody);
  //     console.log('Email notification sent to owner successfully.');
  //   }
  // } catch (error) {
  //   console.error('Failed to send email notification to owner:', error.message);
  // }
};

const sendAdminNotification = async (applicationData) => {
  try {
    console.log('Attempting to send admin notification...');
    console.log(`New application received: ${applicationData.applicationId} from ${applicationData.fullName}. Check dashboard.`);
    console.log('Admin notification sent successfully (placeholder).');
  } catch (error) {
    console.error('Error sending admin notification:', error.message);
  }
};

module.exports = {
  sendToGoogleSheets,
  sendApplicantNotification, // Renamed from sendWhatsAppNotification
  sendAdminNotification,
  sendOwnerNotification, // Renamed from sendOwnerWhatsApp
};
