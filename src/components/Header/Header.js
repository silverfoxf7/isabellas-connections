import React from "react";
import InfoModal from "../modals/InfoModal";

function Header() {
  return (
    <header className="flex flex-col items-center py-4">
      <div className="flex items-center justify-between w-full max-w-xl px-4">
        <h1 className="font-space-mono text-lg md:text-xl font-bold">Isa's Connections</h1>
        <div className="flex items-center gap-3">
          <InfoModal />
        </div>
      </div>
    </header>
  );
}

export default Header;
