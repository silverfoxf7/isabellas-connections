import { getGoogleSheetsData } from './googleSheets';

export const CONNECTION_GAMES = [
  [
    {
      category: "Common Backyard Birds",
      words: ["Robin", "Sparrow", "Blue Jay", "Cardinal"],
      difficulty: 1,
    },
    {
      category: "Birds That Are Also Verbs",
      words: ["Duck", "Swallow", "Hawk", "Crane"],
      difficulty: 2,
    },
    {
      category: "Bird or Bird-Inspired Anime Characters",
      words: ["Tokoyami", "The Heron", "Yubaba", "Karasu"],
      difficulty: 3,
    },
    {
      category: "Traits Shared by Birds and Anime Characters",
      words: ["Migratory", "Territorial", "Observant", "Graceful"],
      difficulty: 4,
    },
  ],
  [
    {
      category: "Continents",
      words: ["Asia", "Europe", "Africa", "Australia"],
      difficulty: 1,
    },
    {
      category: "Objects in the Solar System",
      words: ["Asteroid", "Planet", "Comet", "Moon"],
      difficulty: 2,
    },
    {
      category: "U.S. Towns Named After Planets",
      words: ["Venus", "Mars", "Saturn", "Jupiter"],
      difficulty: 3,
    },
    {
      category: "Geographical and Astronomical Features",
      words: ["Basin", "Ridge", "Valley", "Crater"],
      difficulty: 4,
    },
  ],
  [
    {
      category: "Language Families",
      words: ["Germanic", "Romance", "Slavic", "Sino-Tibetan"],
      difficulty: 1,
    },
    {
      category: "Ways to Say 'Hello'",
      words: ["Hola", "Bonjour", "Konnichiwa", "Ciao"],
      difficulty: 2,
    },
    {
      category: "Endangered or Constructed Languages",
      words: ["Esperanto", "Elvish", "Yiddish", "Navajo"],
      difficulty: 3,
    },
    {
      category: "Language Terms Ending in '-Lingual'",
      words: ["Mono", "Bi", "Tri", "Multi"],
      difficulty: 4,
    },
  ],
];

export async function getTodaysPuzzle() {
  try {
    const today = new Date();
    const puzzles = await getPuzzleForDate(today);
    return puzzles || CONNECTION_GAMES[0]; // Fallback to first static puzzle if no data
  } catch (error) {
    console.error('Failed to fetch puzzle from Google Sheets:', error);
    return CONNECTION_GAMES[0]; // Fallback to first static puzzle
  }
}

export async function getPuzzleForDate(targetDate) {
  try {
    console.log('Getting puzzle for date:', targetDate);
    const allPuzzles = await getGoogleSheetsData();
    
    // Format target date to match the format in spreadsheet (MM/DD/YYYY)
    const formattedDate = new Date(targetDate).toLocaleDateString('en-US');
    console.log('Looking for puzzle on date:', formattedDate);
    
    // Find puzzles for the target date
    const puzzlesForDate = allPuzzles[formattedDate];
    console.log('Found puzzles for date:', puzzlesForDate);
    
    if (!puzzlesForDate || puzzlesForDate.length === 0) {
      console.log('No puzzles found for date, using fallback');
      return CONNECTION_GAMES[0];
    }
    
    return puzzlesForDate;
  } catch (error) {
    console.error('Error getting puzzle for date:', error);
    return CONNECTION_GAMES[0]; // Fallback to first static puzzle
  }
}

export async function getPuzzlesByDate() {
  try {
    return await getGoogleSheetsData();
  } catch (error) {
    console.error('Failed to fetch puzzles from Google Sheets:', error);
    // Return static puzzles in a similar format for compatibility
    return {
      [new Date().toLocaleDateString('en-US')]: CONNECTION_GAMES[0],
      // Add more dates if needed
    };
  }
}
