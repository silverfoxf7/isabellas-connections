import React from "react";
import { getTodaysPuzzle } from "../../lib/data";

export const PuzzleDataContext = React.createContext();

function PuzzleDataProvider({ children }) {
  const [gameData, setGameData] = React.useState(null);
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState(null);

  React.useEffect(() => {
    async function fetchPuzzle() {
      try {
        console.log('Fetching puzzle data...');
        const puzzle = await getTodaysPuzzle();
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
  }, []);

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

  return (
    <PuzzleDataContext.Provider
      value={{ gameData, numCategories, categorySize }}
    >
      {children}
    </PuzzleDataContext.Provider>
  );
}

export default PuzzleDataProvider;
