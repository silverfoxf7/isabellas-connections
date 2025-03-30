import React from "react";
import { MAX_MISTAKES } from "../../lib/constants";
import { PuzzleDataContext } from "../PuzzleDataProvider";
import {
  loadGameStateFromLocalStorage,
  saveGameStateToLocalStorage,
} from "../../lib/local-storage";
import {
  isGameDataEquivalent,
  isGuessesFromGame,
} from "../../lib/game-helpers";
export const GameStatusContext = React.createContext();

function GameStatusProvider({ children }) {
  const { gameData, puzzleDate } = React.useContext(PuzzleDataContext);
  const [submittedGuesses, setSubmittedGuesses] = React.useState([]);
  const [solvedGameData, setSolvedGameData] = React.useState([]);
  const [isGameOver, setIsGameOver] = React.useState(false);
  const [isGameWon, setIsGameWon] = React.useState(false);
  const [guessCandidate, setGuessCandidate] = React.useState([]);

  // Load saved game state when component mounts or when puzzle date changes
  React.useEffect(() => {
    const loadedState = loadGameStateFromLocalStorage(puzzleDate);
    console.log("Loading game state for date:", puzzleDate, {
      loadedState: loadedState,
      gd1: gameData,
      gd2: loadedState?.gameData,
    });
    
    // Reset state
    setSubmittedGuesses([]);
    setSolvedGameData([]);
    setIsGameOver(false);
    setIsGameWon(false);
    setGuessCandidate([]);
    
    // If we have valid saved state, restore it
    if (isGameDataEquivalent({ gd1: gameData, gd2: loadedState?.gameData })) {
      if (
        isGuessesFromGame({
          gameData,
          submittedGuesses: loadedState?.submittedGuesses,
        })
      ) {
        if (Array.isArray(loadedState?.submittedGuesses)) {
          setSubmittedGuesses(loadedState.submittedGuesses);
        }

        if (Array.isArray(loadedState?.solvedGameData)) {
          setSolvedGameData(loadedState.solvedGameData);
        }
        
        // Check if game was already won or lost
        if (loadedState?.solvedGameData?.length === gameData.length) {
          setIsGameOver(true);
          setIsGameWon(true);
        } else if ((loadedState?.submittedGuesses?.length - loadedState?.solvedGameData?.length) >= MAX_MISTAKES) {
          setIsGameOver(true);
          setIsGameWon(false);
        }
      }
    }
  }, [gameData, puzzleDate]);

  const numMistakesUsed = submittedGuesses.length - solvedGameData.length;

  // use effect to check if game is won
  React.useEffect(() => {
    if (solvedGameData.length === gameData.length) {
      setIsGameOver(true);
      setIsGameWon(true);
    }
    const gameState = { submittedGuesses, solvedGameData, gameData };
    saveGameStateToLocalStorage(gameState, puzzleDate);
  }, [solvedGameData, puzzleDate]);

  // use effect to check if all mistakes have been used and end the game accordingly
  React.useEffect(() => {
    if (numMistakesUsed >= MAX_MISTAKES) {
      setIsGameOver(true);
      setIsGameWon(false);
    }
    const gameState = { submittedGuesses, solvedGameData, gameData };
    saveGameStateToLocalStorage(gameState, puzzleDate);
  }, [submittedGuesses, puzzleDate]);

  return (
    <GameStatusContext.Provider
      value={{
        isGameOver,
        isGameWon,
        numMistakesUsed,
        solvedGameData,
        setSolvedGameData,
        submittedGuesses,
        setSubmittedGuesses,
        guessCandidate,
        setGuessCandidate,
      }}
    >
      {children}
    </GameStatusContext.Provider>
  );
}

export default GameStatusProvider;
