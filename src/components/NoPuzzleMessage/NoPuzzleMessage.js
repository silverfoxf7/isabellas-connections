import React from "react";
import { Link } from "react-router-dom";
import { Card } from "../../components/ui/card";

function NoPuzzleMessage() {
  return (
    <Card className="p-8 bg-gray-50 flex flex-col items-center justify-center min-h-[300px] text-center">
      <p className="text-lg text-gray-700 mb-4">
        There's no puzzle today. <br /> Please visit the archive to see more puzzles.
      </p>
      <Link 
        to="/archive" 
        className="text-blue-500 hover:text-blue-700 font-medium"
      >
        View Puzzle Archive →
      </Link>
    </Card>
  );
}

export default NoPuzzleMessage; 