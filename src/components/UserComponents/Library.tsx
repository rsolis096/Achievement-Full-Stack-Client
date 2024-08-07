import { useState } from "react";
import { OwnedGame } from "../../interfaces/types.tsx";

import UserAchievementList from "./UserAchievementList.tsx";
import UserGamesList from "./UserGamesList.tsx";

function Library() {
  const [selectedGame, setSelectedGame] = useState<OwnedGame>();

  //Used by UserGamesList to set which game should be rendered in the achievement list
  const updateSelectedGameState = (game: OwnedGame) => {
    setSelectedGame(game);
  };

  return (
    <div className="h-screen">
      {/* Main Content Area */}
      <div className="flex flex-col sm:flex-row h-full">
        {/* Games Bar (Left Hand Side) */}
        <div className="sm:w-5/12 md:w-4/12 lg:w-3/12 xl:w-3/12 sm:h-11/12">
          <UserGamesList setSelectedGame={updateSelectedGameState} />
        </div>
        {/* Achievements List Area */}
        <div className="w-full bg-foregroundColor shadow-lg p-2 rounded-lg border-white/20 border-2 h-11/12">
          {/* Actual Achievement List */}
          {selectedGame ? (
            <UserAchievementList key={selectedGame.appid} game={selectedGame} />
          ) : (
            <p style={{ color: "white" }}>Select a game to see achievements.</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default Library;
