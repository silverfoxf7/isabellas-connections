import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Header from "../Header";
import Game from "../Game";
import PuzzleArchive from "../PuzzleArchive";
import { Toaster } from "../ui/toaster";
import PuzzleDataProvider from "../../providers/PuzzleDataProvider";
import GameStatusProvider from "../../providers/GameStatusProvider";

function App() {
  return (
    <Router>
      <div className="wrapper">
        <Toaster />
        <Header />
        
        <Routes>
          <Route 
            path="/" 
            element={
              <PuzzleDataProvider>
                <GameStatusProvider>
                  <Game />
                </GameStatusProvider>
              </PuzzleDataProvider>
            } 
          />
          
          <Route 
            path="/puzzles/:date" 
            element={
              <PuzzleDataProvider>
                <GameStatusProvider>
                  <Game />
                </GameStatusProvider>
              </PuzzleDataProvider>
            } 
          />
          
          <Route 
            path="/archive" 
            element={<PuzzleArchive />} 
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
