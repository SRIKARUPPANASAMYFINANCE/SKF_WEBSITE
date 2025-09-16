const axios = require('axios');

// Read config directly from environment variables
const GOOGLE_SHEETS_WEBHOOK_URL = process.env.GOOGLE_SHEETS_WEBHOOK_URL;
const TWILIO_ACCOUNT_SID = process.env.TWILIO_ACCOUNT_SID;
const TWILIO_AUTH_TOKEN = process.env.TWILIO_AUTH_TOKEN;
const TWILIO_WHATSAPP_NUMBER = process.env.TWILIO_WHATSAPP_NUMBER;
const TWILIO_SMS_NUMBER = process.env.TWILIO_SMS_NUMBER;
const OWNER_WHATSAPP_NUMBER = process.env.OWNER_WHATSAPP_NUMBER;
const ADMIN_NOTIFICATION_PHONE = process.env.ADMIN_NOTIFICATION_PHONE;

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

// Function to send WhatsApp and SMS messages to applicant
const sendWhatsAppNotification = async (applicantPhone, applicantName, applicationId) => {
  const formattedApplicantPhone = formatToE164(applicantPhone);
  const whatsappTo = `whatsapp:${formattedApplicantPhone}`;
  const smsTo = formattedApplicantPhone;
  const whatsappTemplateName = 'HXb5b62575e6e4ff6129ad7c8efe1f983e';
  const whatsappTemplateParams = {
    1: applicantName,
    2: applicationId,
  };
  const smsBody = `Hi ${applicantName}, your application (ID: ${applicationId}) has been received. We'll message you within 24-48 hours with next steps.`;

  try {
    await sendWhatsAppMessage(whatsappTo, null, whatsappTemplateName, whatsappTemplateParams);
  } catch (error) {
    console.error('Failed to send WhatsApp notification:', error.message);
  }

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
  const formattedOwnerPhone = formatToE164(ADMIN_NOTIFICATION_PHONE);
  const whatsappTo = OWNER_WHATSAPP_NUMBER;
  const smsTo = formattedOwnerPhone;

  const whatsappTemplateName = 'HXxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx';
  const whatsappTemplateParams = {
    1: name,
    2: phone,
    3: email,
    4: city,
    5: amountRequested,
    6: purpose,
  };
  const smsBody = `New Loan Application:\nName: ${name}\nPhone: ${phone}\nEmail: ${email}\nCity: ${city}\nAmount: ${amountRequested}\nPurpose: ${purpose}`;

  try {
    await sendWhatsAppMessage(whatsappTo, null, whatsappTemplateName, whatsappTemplateParams);
  } catch (error) {
    console.error('Failed to send WhatsApp owner notification:', error.message);
  }

  try {
    if (smsTo) {
      await sendSMSMessage(smsTo, smsBody);
    }
  } catch (error) {
    console.error('Failed to send SMS owner notification:', error.message);
  }
};

const sendAdminNotification = async (applicationData) => {
  try {
    console.log('Attempting to send admin notification...');
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