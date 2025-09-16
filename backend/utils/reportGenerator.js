const { readSheetData } = require('./googleSheets');
const { sendEmail } = require('./email');
const ADMIN_NOTIFICATION_EMAIL = process.env.ADMIN_NOTIFICATION_EMAIL;

const generateDailyReport = async () => {
  try {
    // Example: Read data from 'LoanApplications!A1:Z100'
    // You might want to make the range configurable or dynamic based on your needs
    const { success, data, error } = await readSheetData('LoanApplications!A1:Z100');

    if (!success) {
      console.error('Failed to read data for daily report:', error);
      return;
    }

    // Process data into a report
    let reportContent = 'Daily Loan Application Report:\n\n';
    if (data && data.length > 0) {
      reportContent += `Total applications: ${data.length}\n`;
      // Add more sophisticated processing here, e.g., count new applications, approved, rejected, etc.
      // For now, just list the first few rows as an example
      reportContent += '\nRecent Applications:\n';
      data.slice(0, 5).forEach((row, index) => {
        reportContent += `${index + 1}. ${row.join(', ')}\n`;
      });
    } else {
      reportContent += 'No new loan applications today.\n';
    }

    // Send report via email
    await sendEmail(
      ADMIN_NOTIFICATION_EMAIL,
      'Daily Loan Application Report',
      reportContent
    );
    console.log('Daily report sent via email.');

    // Optionally, send a summary via WhatsApp
    // This would require a Twilio utility for sending WhatsApp messages
    // For example: sendWhatsAppMessage(OWNER_WHATSAPP_NUMBER, 'Daily Report Summary: ' + reportContent.substring(0, 100) + '...');
    // console.log('Daily report summary sent via WhatsApp.');

  } catch (err) {
    console.error('Error generating daily report:', err);
  }
};

module.exports = { generateDailyReport };
