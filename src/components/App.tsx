//Utility
import { useEffect, useState } from "react";
import { SteamUser } from "../interfaces/types.tsx";
import { Routes, Route, useNavigate, useLocation } from "react-router-dom";

//Styling

import "../styles/CustomScrollbar.css";

//Components
import { DemoContext } from "../context/DemoModeContext.tsx";
import { SteamUserContext } from "../context/SteamUserContext.tsx";
import UpperNavBar from "./UpperNavBar.tsx";
import Library from "./Library.tsx";

function App() {
  //Define state variables

  const [demoModeOn, setDemoMode] = useState<boolean>(false);
  const navigate = useNavigate();

  const [user, setUser] = useState<SteamUser>({
    authenticated: false,
    id: "none",
    displayName: "none",
    photos: [],
  });

  useEffect(() => {
    if (demoModeOn) {
      navigate("/library/demo");
    } else if (user.authenticated) {
      navigate("/library/" + user.id);
    } else {
      navigate("/home");
    }
  }, [demoModeOn, user.authenticated, navigate]);

  //Main Logged in screen
  return (
    <>
      <DemoContext.Provider value={{ demoModeOn, setDemoMode }}>
        <SteamUserContext.Provider value={{ user, setUser }}>
          <div className="flex flex-col bg-backgroundColor min-h-screen ">
            {/* Upper Navbar - Contains the login and demo mode code*/}
            <UpperNavBar />

            <Routes>
              <Route
                path="/home"
                element={<p style={{ color: "white" }}>Not Signed in.</p>}
              />
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
