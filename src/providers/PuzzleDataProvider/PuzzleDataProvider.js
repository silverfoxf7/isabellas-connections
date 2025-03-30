import React from "react";
import { useParams } from "react-router-dom";
import { getTodaysPuzzle, getPuzzleForDate } from "../../lib/data";
import { parse, format } from "date-fns";

export const PuzzleDataContext = React.createContext();

function PuzzleDataProvider({ children }) {
  const [gameData, setGameData] = React.useState(null);
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState(null);
  
  // Get date parameter from URL if available
  const { date: dateParam } = useParams();

  // Convert URL-formatted date to native format for storage/lookup
  const getNativeDateString = (urlDate) => {
    if (!urlDate) return null;
    
    try {
      // Try to parse as YYYY-MM-DD format
      const parsedDate = parse(urlDate, "yyyy-MM-dd", new Date());
      // Return date in M/D/YYYY format for storage/lookup
      return parsedDate.toLocaleDateString('en-US');
    } catch (e) {
      console.error("Error parsing date:", e);
      return urlDate; // Fallback to original string
    }
  };

  React.useEffect(() => {
    async function fetchPuzzle() {
      try {
        setIsLoading(true);
        
        let puzzle;
        if (dateParam) {
          console.log('Fetching puzzle for date parameter:', dateParam);
          
          // Convert URL-format date to Date object
          let targetDate;
          try {
            targetDate = parse(dateParam, "yyyy-MM-dd", new Date());
            console.log('Parsed date:', targetDate);
          } catch (e) {
            console.error("Error parsing date:", e);
            targetDate = new Date(dateParam);
          }
          
          puzzle = await getPuzzleForDate(targetDate);
        } else {
          console.log('Fetching today\'s puzzle');
          puzzle = await getTodaysPuzzle();
        }
        
        console.log('Received puzzle data:', puzzle);
        setGameData(puzzle);
      } catch (err) {
        console.error('Error fetching puzzle:', err);
        setError(err);
      } finally {
        setIsLoading(false);
      }
    }

    fetchPuzzle();
  }, [dateParam]); // Re-fetch when date parameter changes

  if (isLoading) {
    return <div>Loading puzzle...</div>;
  }

  if (error) {
    return <div>Error loading puzzle: {error.message}</div>;
  }

  if (!gameData) {
    return <div>No puzzle available</div>;
  }

  const categorySize = gameData[0].words.length;
  const numCategories = gameData.length;
  
  // Convert URL date param to native date format for storage
  const nativeDateString = getNativeDateString(dateParam) || new Date().toLocaleDateString('en-US');

  return (
    <PuzzleDataContext.Provider
      value={{ 
        gameData, 
        numCategories, 
        categorySize,
        puzzleDate: nativeDateString
      }}
    >
      {children}
    </PuzzleDataContext.Provider>
  );
}

export default PuzzleDataProvider;
