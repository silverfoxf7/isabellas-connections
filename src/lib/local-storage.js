const getGameStateKey = (date) => {
  return `connections_puzzle_${date || new Date().toLocaleDateString('en-US')}`;
};

export const saveGameStateToLocalStorage = (gameState, date) => {
  const key = getGameStateKey(date);
  localStorage.setItem(key, JSON.stringify({
    ...gameState,
    completed: gameState.solvedGameData.length === gameState.gameData.length,
    failed: (gameState.submittedGuesses.length - gameState.solvedGameData.length) >= 4,
    timestamp: Date.now()
  }));
};

export const loadGameStateFromLocalStorage = (date) => {
  const key = getGameStateKey(date);
  const state = localStorage.getItem(key);
  return state ? JSON.parse(state) : null;
};

const gameStatKey = "connections_game_stats";

export const saveStatsToLocalStorage = (gameStats) => {
  localStorage.setItem(gameStatKey, JSON.stringify(gameStats));
};

export const loadStatsFromLocalStorage = () => {
  const stats = localStorage.getItem(gameStatKey);
  return stats ? JSON.parse(stats) : null;
};

// Get all completed puzzles
export const getAllCompletedPuzzles = () => {
  const results = {};
  // Iterate through all localStorage items
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key.startsWith('connections_puzzle_')) {
      try {
        const data = JSON.parse(localStorage.getItem(key));
        const date = key.replace('connections_puzzle_', '');
        results[date] = {
          completed: data.completed,
          failed: data.failed,
          timestamp: data.timestamp
        };
      } catch (e) {
        console.error('Error parsing localStorage item:', e);
      }
    }
  }
  return results;
}; 