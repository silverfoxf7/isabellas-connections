const { google } = require('googleapis');

module.exports = async (req, res) => {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }
  
  // Get date parameter from request
  const { date } = req.query;
  if (!date) {
    return res.status(400).json({ error: 'Date parameter is required' });
  }
  
  try {
    // Use environment variables for credentials in production
    const credentials = process.env.GOOGLE_CREDENTIALS
      ? JSON.parse(process.env.GOOGLE_CREDENTIALS)
      : require('../../key.json');
      
    const sheets = google.sheets({ 
      version: 'v4', 
      auth: new google.auth.JWT(
        credentials.client_email,
        null,
        credentials.private_key,
        ['https://www.googleapis.com/auth/spreadsheets.readonly']
      )
    });
    
    // Google Sheet ID from environment variable or hardcoded for development
    const spreadsheetId = process.env.SHEET_ID || '1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms';
    
    // Get data from sheet
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range: 'Sheet1', // Adjust as needed
    });
    
    const rows = response.data.values;
    if (!rows || rows.length === 0) {
      return res.status(404).json({ error: 'No data found' });
    }
    
    // Process the data to find the puzzle for the requested date
    const headers = rows[0];
    const puzzlesForDate = [];
    
    // Convert date parameter to match your date format if needed
    // This depends on how dates are stored in your sheet
    const targetDate = date;
    
    for (let i = 1; i < rows.length; i++) {
      const row = rows[i];
      if (row.length > 0) {
        const rowData = {};
        headers.forEach((header, index) => {
          rowData[header] = row[index] || '';
        });
        
        // If this row matches the target date
        if (rowData.releaseDate === targetDate) {
          puzzlesForDate.push({
            category: rowData.category,
            words: [rowData.word1, rowData.word2, rowData.word3, rowData.word4].filter(Boolean),
            difficulty: parseInt(rowData.difficulty) || 1
          });
        }
      }
    }
    
    if (puzzlesForDate.length === 0) {
      return res.status(404).json({ error: 'No puzzle found for the specified date' });
    }
    
    return res.status(200).json(puzzlesForDate);
  } catch (error) {
    console.error('API Error:', error);
    return res.status(500).json({ 
      error: 'Failed to fetch data', 
      message: error.message 
    });
  }
}; 