import React from "react";
import { Link, useLocation } from "react-router-dom";

import InfoModal from "../modals/InfoModal";

function Header() {
  const location = useLocation();
  
  return (
    <header className="flex flex-col items-center py-4">
      <div className="flex items-center justify-between w-full max-w-xl px-4">
        <h1 className="font-space-mono text-lg md:text-xl font-bold">Isa's Connections</h1>
        <div className="flex items-center gap-3">
          <InfoModal />
        </div>
      </div>
      
      <nav className="mt-4 border-b w-full max-w-xl pb-1">
        <ul className="flex justify-center gap-8">
          <li>
            <Link 
              to="/" 
              className={`pb-2 px-1 ${location.pathname === '/' ? 'border-b-2 border-blue-500 font-medium' : 'text-gray-500 hover:text-gray-900'}`}
            >
              Today's Puzzle
            </Link>
          </li>
          <li>
            <Link 
              to="/archive" 
              className={`pb-2 px-1 ${location.pathname === '/archive' ? 'border-b-2 border-blue-500 font-medium' : 'text-gray-500 hover:text-gray-900'}`}
            >
              Puzzle Archive
            </Link>
          </li>
        </ul>
      </nav>
    </header>
  );
}

export default Header;
