import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getPuzzlesByDate } from "../../lib/data";
import { format, parse } from "date-fns";
import { getAllCompletedPuzzles } from "../../lib/local-storage";

function PuzzleArchive() {
  const [puzzles, setPuzzles] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [completedPuzzles, setCompletedPuzzles] = useState({});
  
  // Load all puzzles on component mount
  useEffect(() => {
    async function loadPuzzles() {
      try {
        setIsLoading(true);
        const allPuzzles = await getPuzzlesByDate();
        setPuzzles(allPuzzles);
        
        // Get completion status for all puzzles
        const completedStatus = getAllCompletedPuzzles();
        setCompletedPuzzles(completedStatus);
      } catch (err) {
        console.error("Error loading puzzles:", err);
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    }
    
    loadPuzzles();
  }, []);
  
  // Check if a puzzle has been completed by checking the completedPuzzles state
  const getPuzzleStatus = (date) => {
    if (!completedPuzzles[date]) return null;
    return completedPuzzles[date].completed ? "completed" : completedPuzzles[date].failed ? "failed" : null;
  };
  
  // Format date to URL-safe format
  const formatDateForURL = (dateStr) => {
    try {
      // Parse the date from US format (M/D/YYYY)
      const date = new Date(dateStr);
      // Format as YYYY-MM-DD for URL
      return format(date, "yyyy-MM-dd");
    } catch (e) {
      console.error("Date formatting error:", e);
      return dateStr;
    }
  };
  
  if (isLoading) {
    return <div className="text-center p-8">Loading puzzle archive...</div>;
  }
  
  if (error) {
    return <div className="text-center p-8 text-red-500">Error: {error}</div>;
  }
  
  if (Object.keys(puzzles).length === 0) {
    return <div className="text-center p-8">No puzzles available yet.</div>;
  }
  
  // Sort dates from newest to oldest
  const sortedDates = Object.keys(puzzles).sort((a, b) => {
    return new Date(b) - new Date(a);
  });

  return (
    <div className="p-4 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-6 text-center">Puzzle Archive</h1>
      
      <div className="grid gap-3">
        {sortedDates.map(dateStr => {
          const date = new Date(dateStr);
          const formattedDate = format(date, "MMMM d, yyyy");
          const urlSafeDate = formatDateForURL(dateStr);
          const isToday = new Date().toLocaleDateString('en-US') === dateStr;
          const status = getPuzzleStatus(dateStr);
          
          return (
            <Link 
              key={dateStr}
              to={`/puzzles/${urlSafeDate}`}
              className={`
                p-4 rounded-md border flex justify-between items-center
                hover:bg-gray-50 transition-colors
                ${isToday ? 'border-blue-500 bg-blue-50' : 'border-gray-200'}
              `}
            >
              <div>
                <span className="font-medium">{formattedDate}</span>
                {isToday && <span className="ml-2 text-sm bg-blue-500 text-white px-2 py-0.5 rounded-full">Today</span>}
              </div>
              
              {status && (
                <div className={`
                  text-sm px-3 py-1 rounded-full
                  ${status === 'completed' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}
                `}>
                  {status === 'completed' ? 'Completed' : 'Failed'}
                </div>
              )}
            </Link>
          );
        })}
      </div>
    </div>
  );
}

export default PuzzleArchive; 