const express = require('express');
const router = express.Router();
const { readSheetData } = require('../utils/googleSheets');

// Endpoint to fetch dynamic configuration data from Google Sheets
router.get('/dynamic', async (req, res) => {
  try {
    // Assuming you have a specific sheet and range for dynamic configurations
    // For example, 'Configurations!A1:B10' where A is key and B is value
    const { success, data, error } = await readSheetData('Configurations!A1:B10');

    if (!success) {
      console.error('Failed to fetch dynamic config data:', error);
      return res.status(500).json({ message: 'Failed to fetch dynamic configurations' });
    }

    // Convert the 2D array data into a more usable object format
    const config = {};
    if (data && data.length > 0) {
      data.forEach(row => {
        if (row.length >= 2) {
          config[row[0]] = row[1];
        }
      });
    }

    res.json(config);
  } catch (err) {
    console.error('Error fetching dynamic config:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;