import React from "react";
import { format } from "date-fns";
import { shuffleGameData } from "../../lib/game-helpers";
import GameGrid from "../GameGrid";
import NumberOfMistakesDisplay from "../NumberOfMistakesDisplay";
import GameLostModal from "../modals/GameLostModal";
import GameWonModal from "../modals/GameWonModal";
import NoPuzzleMessage from "../NoPuzzleMessage";

import { Separator } from "../ui/separator";
import ConfettiExplosion from "react-confetti-explosion";

import { PuzzleDataContext } from "../../providers/PuzzleDataProvider";
import { GameStatusContext } from "../../providers/GameStatusProvider";
import GameControlButtonsPanel from "../GameControlButtonsPanel";

import ViewResultsModal from "../modals/ViewResultsModal";
import { Link } from "react-router-dom";
import { useLocation } from "react-router-dom";

function Game() {
  const { gameData, categorySize, numCategories, puzzleDate } =
    React.useContext(PuzzleDataContext);
  const { submittedGuesses, solvedGameData, isGameOver, isGameWon } =
    React.useContext(GameStatusContext);

  const [shuffledRows, setShuffledRows] = React.useState(
    gameData ? shuffleGameData({ gameData }) : []
  );
  const [isEndGameModalOpen, setisEndGameModalOpen] = React.useState(false);
  const [gridShake, setGridShake] = React.useState(false);
  const [showConfetti, setShowConfetti] = React.useState(false);

  const location = useLocation();

  // Format the puzzle date for display
  const formattedDate = React.useMemo(() => {
    try {
      return format(new Date(puzzleDate), "MMMM d, yyyy");
    } catch (e) {
      return puzzleDate;
    }
  }, [puzzleDate]);

  // use effect to update Game Grid after a row has been correctly solved
  React.useEffect(() => {
    if (!gameData) return;
    
    const categoriesToRemoveFromRows = solvedGameData.map(
      (data) => data.category
    );
    const dataLeftForRows = gameData.filter((data) => {
      return !categoriesToRemoveFromRows.includes(data.category);
    });
    if (dataLeftForRows.length > 0) {
      setShuffledRows(shuffleGameData({ gameData: dataLeftForRows }));
    }
  }, [solvedGameData, gameData]);

  // Handle End Game!
  React.useEffect(() => {
    if (!isGameOver) {
      return;
    }
    // extra delay for game won to allow confetti to show
    const modalDelay = isGameWon ? 2000 : 250;
    const delayModalOpen = window.setTimeout(() => {
      setisEndGameModalOpen(true);
      //unmount confetti after modal opens
      setShowConfetti(false);
    }, modalDelay);

    if (isGameWon) {
      setShowConfetti(true);
    }

    return () => window.clearTimeout(delayModalOpen);
  }, [isGameOver]);

  // If there's no puzzle data, show the message
  if (!gameData) {
    return (
      <div className="game-wrapper">
        <NoPuzzleMessage />
      </div>
    );
  }

  return (
    <>
      <div className="text-center mt-4 mb-2">
        <h3 className="text-xl">
          Create {numCategories} groups of {categorySize}
        </h3>
      </div>

      <div className={`game-wrapper`}>
        {isGameOver && isGameWon ? (
          <GameWonModal
            open={isEndGameModalOpen}
            submittedGuesses={submittedGuesses}
          />
        ) : (
          <GameLostModal
            open={isEndGameModalOpen}
            submittedGuesses={submittedGuesses}
          />
        )}
        <GameGrid
          gameRows={shuffledRows}
          shouldGridShake={gridShake}
          setShouldGridShake={setGridShake}
        />
        {showConfetti && isGameOver && (
          <div className="grid place-content-center">
            <ConfettiExplosion
              particleCount={100}
              force={0.8}
              duration={2500}
            />
          </div>
        )}
        <Separator />

        {!isGameOver ? (
          <>
            <NumberOfMistakesDisplay />
            <GameControlButtonsPanel
              shuffledRows={shuffledRows}
              setShuffledRows={setShuffledRows}
              setGridShake={setGridShake}
            />
          </>
        ) : (
          <ViewResultsModal />
        )}
        
        <div className="mt-8 text-center">
          <p className="text-gray-500 text-sm mb-4">Puzzle for {formattedDate}</p>
          <nav className="flex justify-center gap-8">
            <Link 
              to="/" 
              className={`text-sm ${location.pathname === '/' ? 'text-blue-500 font-medium' : 'text-gray-500 hover:text-gray-900'}`}
            >
              Today's Puzzle
            </Link>
            <Link 
              to="/archive" 
              className={`text-sm ${location.pathname === '/archive' ? 'text-blue-500 font-medium' : 'text-gray-500 hover:text-gray-900'}`}
            >
              Puzzle Archive
            </Link>
          </nav>
        </div>
      </div>
    </>
  );
}

export default Game;
