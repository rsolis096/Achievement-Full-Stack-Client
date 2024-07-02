//Utility
import { useState, useEffect } from "react";
import { SteamUser } from "../interfaces/types.tsx";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

//Styling

import "../styles/CustomScrollbar.css";

//Components
import { DemoContext } from "../context/DemoModeContext.tsx";
import { SteamUserContext } from "../context/SteamUserContext.tsx";
import UpperNavBar from "./UpperNavBar.tsx";
import Library from "./Library.tsx";
import Home from "./Home.tsx";
import About from "./About.tsx";
import GameView from "./GameView.tsx";

function App() {
  //Define state variables

  //const [demoModeOn, setDemoMode] = useState<boolean>(false);
  const initialDemoMode = JSON.parse(
    localStorage.getItem("demoModeOn") || "false"
  );
  const [demoModeOn, setDemoMode] = useState<boolean>(initialDemoMode);

  const [user, setUser] = useState<SteamUser>({
    authenticated: false,
    id: "none",
    displayName: "none",
    photos: [],
  });

  // Save demo mode state to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("demoModeOn", JSON.stringify(demoModeOn));
  }, [demoModeOn]);

  //Main Logged in screen
  return (
    <>
      <Router>
        <DemoContext.Provider value={{ demoModeOn, setDemoMode }}>
          <SteamUserContext.Provider value={{ user, setUser }}>
            <div className=" dark text-foreground bg-backgroundColor flex flex-col min-h-screen ">
              {/* Upper Navbar - Contains the login and demo mode code*/}
              <UpperNavBar />
              <Routes>
                <Route path="/home" element={<Home />} />
                <Route path="/" element={<Home />} />
                <Route path="/view/:appid" element={<GameView />} />
                <Route path="/about" element={<About />} />
                <Route path="/library/demo" element={<Library />} />
                <Route path="/library/:userId" element={<Library />} />
              </Routes>
            </div>
          </SteamUserContext.Provider>
        </DemoContext.Provider>
      </Router>
    </>
  );
}

export default App;
