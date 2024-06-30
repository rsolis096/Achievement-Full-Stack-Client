import { useState } from "react";
import { OwnedGame } from "../interfaces/types.tsx";

import UserAchievementList from "./UserComponents/UserAchievementList.tsx";
import UserGamesList from "./UserComponents/UserGamesList.tsx";

function Library() {
  const [selectedGame, setSelectedGame] = useState<OwnedGame>();
  //Used by UserGamesList to set which game should be rendered in the achievement list
  const updateSelectedGameState = (game: OwnedGame) => {
    setSelectedGame(game);
  };

  return (
    <>
      {/* Main Content Area */}
      <div className="flex flex-row gap-2 w-full h-screen p-2 overflow-hidden">
        {/*Games Bar (Left Hand Side) */}
        <div className="h-full md:w-4/12 lg:w-3/12 xl:w-2/12  ">
          <UserGamesList setSelectedGame={updateSelectedGameState} />
        </div>

        {/*Achievements List Area*/}
        <div className="bg-foregroundColor  md:w-8/12 lg:w-9/12 xl:w-11/12 shadow-lg p-2  rounded-lg	border-white/20	 border-2 h-dvh">
          {/*Actual Achievement List*/}
          {selectedGame ? (
            <UserAchievementList key={selectedGame.appid} game={selectedGame} />
          ) : (
            <p style={{ color: "white" }}>Select a game to see achievements.</p>
          )}
        </div>
      </div>
    </>
  );
}

export default Library;
