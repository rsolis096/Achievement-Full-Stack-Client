//Utility
import { useState } from "react";
import { Game, SteamUser } from "../interfaces/types.tsx";

//Styling

import "../styles/CustomScrollbar.css";

//Components
import AchievementList from "./AchievementList.tsx";
import { DemoContext } from "../context/DemoModeContext.tsx";
import { SteamUserContext } from "../context/SteamUserContext.tsx";
import GamesList from "./GamesList.tsx";
import UpperNavBar from "./UpperNavBar.tsx";

function App() {
  //Define state variables

  const [selectedGame, setSelectedGame] = useState<Game>();
  const [demoModeOn, setDemoMode] = useState<boolean>(false);

  const [user, setUser] = useState<SteamUser>({
    authenticated: false,
    id: "none",
    displayName: "none",
    photos: [],
  });

  //Used by GamesList to set which game should be rendered in the achievement list
  const updateSelectedGameState = (game: Game) => {
    setSelectedGame(game);
  };

  //Main Logged in screen
  return (
    <>
      <DemoContext.Provider value={{ demoModeOn, setDemoMode }}>
        <SteamUserContext.Provider value={{ user, setUser }}>
          <div className="flex flex-col bg-backgroundColor min-h-screen ">
            {/* Upper Navbar - Contains the login and demo mode code*/}
            <UpperNavBar />
            {demoModeOn || user.authenticated ? (
              <>
                {/* Main Content Area */}
                <div className="flex flex-row gap-2 w-full h-screen p-2 overflow-hidden">
                  {/*Games Bar (Left Hand Side) */}
                  <div className="h-full md:w-4/12 lg:w-3/12 xl:w-2/12  ">
                    <GamesList setSelectedGame={updateSelectedGameState} />
                  </div>

                  {/*Achievements List Area*/}
                  <div className="bg-foregroundColor  md:w-8/12 lg:w-9/12 xl:w-11/12 shadow-lg overflow-auto p-2 custom-scrollbar rounded-lg	border-white/20	 border-2 h-dvh">
                    {/*Actual Achievement List*/}
                    {selectedGame ? (
                      <AchievementList
                        key={selectedGame.appid}
                        game={selectedGame}
                      />
                    ) : (
                      <p style={{ color: "white" }}>
                        Select a game to see achievements.
                      </p>
                    )}
                  </div>
                </div>
              </>
            ) : (
              <></>
            )}
          </div>
        </SteamUserContext.Provider>
      </DemoContext.Provider>
    </>
  );
}

export default App;
