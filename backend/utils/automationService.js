const axios = require('axios');
const automationConfig = require('../config/automationConfig');
const twilio = require('twilio')(automationConfig.TWILIO_ACCOUNT_SID, automationConfig.TWILIO_AUTH_TOKEN); // Uncommented // Uncommented

// Helper function to format phone numbers to E.164 format
const formatToE164 = (phoneNumber, countryCode = '+91') => {
  if (!phoneNumber) return null;
  // Remove any non-digit characters
  const digitsOnly = phoneNumber.replace(/\D/g, '');
  // If it already starts with a '+', assume it's E.164
  if (phoneNumber.startsWith('+')) {
    return phoneNumber;
  }
  // If it doesn't start with country code, prepend it
  if (!digitsOnly.startsWith(countryCode.replace('+', ''))) {
    return countryCode + digitsOnly;
  }
  return '+' + digitsOnly;
};

// Function to send data to Google Sheets via Webhook
const sendToGoogleSheets = async (applicationData) => {
  try {
    console.log('Attempting to send data to Google Sheets webhook...');
    // In a real app, ensure your webhook URL is secure and correctly configured
    await axios.post(automationConfig.GOOGLE_SHEETS_WEBHOOK_URL, applicationData);
    console.log('Data sent to Google Sheets webhook successfully.');
  } catch (error) {
    console.error('Error sending data to Google Sheets webhook:', error.message);
    // Log full error response if available
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
      from: automationConfig.TWILIO_WHATSAPP_NUMBER,
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
    throw error; // Re-throw the error so calling functions can handle it
  }
};

// Generic function to send SMS messages
const sendSMSMessage = async (to, body) => {
  try {
    console.log(`Attempting to send SMS to ${to}...`);
    await twilio.messages.create({
      from: automationConfig.TWILIO_SMS_NUMBER,
      to: to,
      body: body,
    });
    console.log('SMS message sent successfully.');
  } catch (error) {
    console.error('Error sending SMS message:', error.message);
  }
};

// Function to send WhatsApp and SMS messages to applicant
const sendWhatsAppNotification = async (applicantPhone, applicantName, applicationId) => {
  const formattedApplicantPhone = formatToE164(applicantPhone);
  const whatsappTo = `whatsapp:${formattedApplicantPhone}`;
  const smsTo = formattedApplicantPhone; // SMS numbers don't need 'whatsapp:' prefix
  const whatsappTemplateName = 'HXb5b62575e6e4ff6129ad7c8efe1f983e';
  const whatsappTemplateParams = {
    1: applicantName,
    2: applicationId,
  };
  const smsBody = `Hi ${applicantName}, your application (ID: ${applicationId}) has been received. We'll message you within 24-48 hours with next steps.`;

  // Send WhatsApp message (handle its own errors)
  try {
    await sendWhatsAppMessage(whatsappTo, null, whatsappTemplateName, whatsappTemplateParams);
  } catch (error) {
    console.error('Failed to send WhatsApp notification:', error.message);
  }

  // Send SMS message (handle its own errors)
  try {
    if (smsTo) {
      await sendSMSMessage(smsTo, smsBody);
    }
  } catch (error) {
    console.error('Failed to send SMS notification:', error.message);
  }
};

// Function to send WhatsApp and SMS messages to owner
const sendOwnerWhatsApp = async (applicationData) => {
  const { name, phone, email, city, amountRequested, purpose } = applicationData;
  const formattedOwnerPhone = formatToE164(automationConfig.ADMIN_NOTIFICATION_PHONE);
  const whatsappTo = automationConfig.OWNER_WHATSAPP_NUMBER;
  const smsTo = formattedOwnerPhone; // Assuming ADMIN_NOTIFICATION_PHONE is the owner's SMS number

  const whatsappTemplateName = 'HXxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx'; // Placeholder for owner notification template
  const whatsappTemplateParams = {
    1: name,
    2: phone,
    3: email,
    4: city,
    5: amountRequested,
    6: purpose,
  };
  const smsBody = `New Loan Application:
Name: ${name}
Phone: ${phone}
Email: ${email}
City: ${city}
Amount: ${amountRequested}
Purpose: ${purpose}`;

  // Send WhatsApp message (handle its own errors)
  try {
    await sendWhatsAppMessage(whatsappTo, null, whatsappTemplateName, whatsappTemplateParams);
  } catch (error) {
    console.error('Failed to send WhatsApp owner notification:', error.message);
  }

  // Send SMS message (handle its own errors)
  try {
    if (smsTo) {
      await sendSMSMessage(smsTo, smsBody);
    }
  } catch (error) {
    console.error('Failed to send SMS owner notification:', error.message);
  }
};



// Function to send admin notification (e.g., email or internal chat)
const sendAdminNotification = async (applicationData) => {
  try {
    console.log('Attempting to send admin notification...');
    // This would typically involve sending an email via Nodemailer or a Slack/Teams message
    console.log(`New application received: ${applicationData.applicationId} from ${applicationData.name}. Check dashboard.`);
    console.log('Admin notification sent successfully (placeholder).');
  } catch (error) {
    console.error('Error sending admin notification:', error.message);
  }
};

module.exports = {
  sendToGoogleSheets,
  sendWhatsAppNotification,
  sendAdminNotification,
  sendOwnerWhatsApp,
};
