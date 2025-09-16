const { google } = require('googleapis');
const path = require('path');
const fs = require('fs');

let credentials;
let auth;
let sheets;
let isGoogleSheetsEnabled = false;

// In production (like on Render), the secret file is at a specific path.
// In development, it's in the local config folder.
const credentialsPath = process.env.NODE_ENV === 'production' 
  ? '/etc/secrets/credentials.json' 
  : path.join(__dirname, '../config/credentials.json');

try {
  if (fs.existsSync(credentialsPath)) {
    credentials = JSON.parse(fs.readFileSync(credentialsPath, 'utf8'));
    isGoogleSheetsEnabled = true;
    
    auth = new google.auth.GoogleAuth({
      credentials,
      scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    });

    sheets = google.sheets({ version: 'v4', auth });
    console.log('Google Sheets API initialized successfully');
  } else {
    console.warn('Google Sheets credentials not found. Google Sheets integration will be disabled.');
  }
} catch (error) {
  console.error('Error loading Google Sheets credentials:', error.message);
}

const spreadsheetId = process.env.GOOGLE_SHEET_ID;

const appendToSheet = async (data) => {
  if (!isGoogleSheetsEnabled) {
    console.warn('Google Sheets not configured. Data not sent to sheets:', data);
    return { success: false, message: 'Google Sheets not configured' };
  }

  if (!spreadsheetId) {
    console.error('GOOGLE_SHEET_ID environment variable is not set.');
    return { success: false, message: 'Spreadsheet ID not configured' };
  }

  try {
    const response = await sheets.spreadsheets.values.append({
      spreadsheetId,
      range: 'Sheet1!A1',
      valueInputOption: 'USER_ENTERED',
      resource: {
        values: [data],
      },
    });
    
    console.log('Data successfully appended to Google Sheet:', response.data);
    return { success: true, data: response.data };
  } catch (error) {
    console.error('Error appending to sheet:', error.message);
    return { success: false, error: error.message };
  }
};

const readSheetData = async (range) => {
  if (!isGoogleSheetsEnabled) {
    console.warn('Google Sheets not configured. Cannot read data.');
    return { success: false, message: 'Google Sheets not configured' };
  }

  if (!spreadsheetId) {
    console.error('GOOGLE_SHEET_ID environment variable is not set.');
    return { success: false, message: 'Spreadsheet ID not configured' };
  }

  try {
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range,
    });
    console.log(`Data successfully read from Google Sheet range ${range}:`, response.data.values);
    return { success: true, data: response.data.values };
  } catch (error) {
    console.error(`Error reading from sheet range ${range}:`, error.message);
    return { success: false, error: error.message };
  }
};

module.exports = { appendToSheet, readSheetData, isGoogleSheetsEnabled };
