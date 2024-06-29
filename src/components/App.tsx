//Utility
import { useState, useEffect } from "react";
import { SteamUser } from "../interfaces/types.tsx";
import { Routes, Route } from "react-router-dom";

//Styling

import "../styles/CustomScrollbar.css";

//Components
import { DemoContext } from "../context/DemoModeContext.tsx";
import { SteamUserContext } from "../context/SteamUserContext.tsx";
import UpperNavBar from "./UpperNavBar.tsx";
import Library from "./Library.tsx";
import Home from "./Home.tsx";
import About from "./About.tsx";

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
      <DemoContext.Provider value={{ demoModeOn, setDemoMode }}>
        <SteamUserContext.Provider value={{ user, setUser }}>
          <div className="flex flex-col bg-backgroundColor min-h-screen ">
            {/* Upper Navbar - Contains the login and demo mode code*/}
            <UpperNavBar />

            <Routes>
              <Route path="/home" element={<Home />} />
              <Route path="/" element={<Home />} />
              <Route path="/about" element={<About />} />
              <Route path="/library/demo" element={<Library />} />
              <Route path="/library/:userId" element={<Library />} />
            </Routes>
          </div>
        </SteamUserContext.Provider>
      </DemoContext.Provider>
    </>
  );
}

export default App;
