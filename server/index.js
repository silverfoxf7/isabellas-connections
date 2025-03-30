const express = require('express');
const cors = require('cors');
const { google } = require('googleapis');
const credentials = require('../key.json');

const app = express();
const port = process.env.PORT || 3001;

// Enable CORS for all routes
app.use(cors());

// Constants
const SPREADSHEET_ID = '1XUsdngW_isSV6uUFoYlte4hHflTS6wzSQx024h3xwQo';

// Helper function to format date consistently
function formatDate(date) {
  const d = new Date(date);
  return `${d.getMonth() + 1}/${d.getDate()}/${d.getFullYear()}`;
}

async function getGoogleSheetClient() {
  const auth = new google.auth.GoogleAuth({
    credentials: credentials,
    scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly'],
  });
  const authClient = await auth.getClient();
  return google.sheets({
    version: 'v4',
    auth: authClient,
  });
}

// Route to get all puzzles
app.get('/api/puzzles', async (req, res) => {
  try {
    const sheetsClient = await getGoogleSheetClient();
    const response = await sheetsClient.spreadsheets.values.get({
      spreadsheetId: SPREADSHEET_ID,
      range: 'PuzzleData!A2:G',
    });

    if (!response.data?.values || !Array.isArray(response.data.values)) {
      throw new Error('Invalid data format received from Google Sheets');
    }

    const rows = response.data.values;
    const puzzles = rows
      .map(row => {
        if (!row || row.length < 7) return null;
        return {
          category: row[0],
          words: [row[1], row[2], row[3], row[4]],
          difficulty: parseInt(row[5]),
          releaseDate: formatDate(row[6]) // Format the date consistently
        };
      })
      .filter(Boolean);

    // Group puzzles by releaseDate
    const groupedPuzzles = puzzles.reduce((acc, puzzle) => {
      const date = puzzle.releaseDate;
      if (!acc[date]) {
        acc[date] = [];
      }
      acc[date].push(puzzle);
      return acc;
    }, {});

    res.json(groupedPuzzles);
  } catch (error) {
    console.error('Error fetching puzzles:', error);
    res.status(500).json({ error: 'Failed to fetch puzzles' });
  }
});

// Route to get puzzle for a specific date
app.get('/api/puzzles/:date', async (req, res) => {
  try {
    const targetDate = req.params.date;
    const sheetsClient = await getGoogleSheetClient();
    const response = await sheetsClient.spreadsheets.values.get({
      spreadsheetId: SPREADSHEET_ID,
      range: 'PuzzleData!A2:G',
    });

    if (!response.data?.values || !Array.isArray(response.data.values)) {
      throw new Error('Invalid data format received from Google Sheets');
    }

    const rows = response.data.values;
    const puzzles = rows
      .map(row => {
        if (!row || row.length < 7) return null;
        return {
          category: row[0],
          words: [row[1], row[2], row[3], row[4]],
          difficulty: parseInt(row[5]),
          releaseDate: formatDate(row[6]) // Format the date consistently
        };
      })
      .filter(Boolean);

    // Group puzzles by releaseDate
    const groupedPuzzles = puzzles.reduce((acc, puzzle) => {
      const date = puzzle.releaseDate;
      if (!acc[date]) {
        acc[date] = [];
      }
      acc[date].push(puzzle);
      return acc;
    }, {});

    // Format target date to match our consistent format
    const formattedDate = formatDate(targetDate);
    
    // Try to get puzzles for the target date
    let datePuzzles = groupedPuzzles[formattedDate];
    
    // If no puzzles found for target date, find the next available date
    if (!datePuzzles) {
      const availableDates = Object.keys(groupedPuzzles)
        .sort((a, b) => new Date(b) - new Date(a)); // Sort in descending order
        
      for (const date of availableDates) {
        if (new Date(date) <= new Date(targetDate)) {
          datePuzzles = groupedPuzzles[date];
          break;
        }
      }
    }

    res.json(datePuzzles || null);
  } catch (error) {
    console.error('Error fetching puzzle for date:', error);
    res.status(500).json({ error: 'Failed to fetch puzzle for date' });
  }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
}); 