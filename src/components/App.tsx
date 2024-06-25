//Utility
import { useEffect, useState } from "react";
import axios from "axios";

//Styling
import { Avatar, Switch, Button } from "@nextui-org/react";
import { Navbar, NavbarContent, NavbarItem } from "@nextui-org/navbar";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import "../styles/CustomScrollbar.css";

//Components
import AchievementList from "./AchievementList.tsx";
import { DemoContext } from "../context/DemoModeContext.tsx";
import GamesList from "./GamesList.tsx";
import { Game, SteamUser } from "../interfaces/types.tsx";

function App() {
  //Define state variables

  const [steamUser, setSteamUser] = useState<SteamUser>({
    authenticated: false,
    id: "none",
    displayName: "none",
    photos: [],
  });
  const [demoModeOn, setDemoModeOn] = useState<boolean>(false);
  const [selectedGame, setSelectedGame] = useState<Game>();

  //Extract steam user data from req.user
  //Returns object of type SteamUser
  const extractSteamUser = (user: never): SteamUser => {
    const { authenticated, id, displayName, photos } = user;
    return { authenticated, id, displayName, photos };
  };

  //Checks If user is logged in upon page load
  useEffect(() => {
    const checkAuthentication = async () => {
      try {
        //Check user for authentication
        const response = await axios.get(
          import.meta.env.VITE_SERVER_DOMAIN + "/auth/steam/checkAuthenticated",
          {
            withCredentials: true, // Important to include credentials
          }
        );

        if (response.data.authenticated) {
          const extractedUser: SteamUser = extractSteamUser(
            response.data.user as never
          );
          extractedUser.authenticated = true;
          console.log(
            "Authenticated successfully, Logged in as : ",
            extractedUser
          );
          setDemoModeOn(false);
          setSteamUser(extractedUser);
        } else {
          console.log("Authentication Failed");
          setSteamUser({
            authenticated: false,
            id: "none",
            displayName: "none",
            photos: [],
          });
        }
      } catch (error) {
        console.error("Error checking authentication:", error);
        setSteamUser({
          authenticated: false,
          id: "none",
          displayName: "none",
          photos: [],
        });
      }
    };
    checkAuthentication();
  }, []);

  //Used by GamesList to set which game should be rendered in the achievement list
  const updateSelectedGameState = (game: Game) => {
    setSelectedGame(game);
  };

  //Handle when the user hits login button
  const handleLogin = () => {
    // Redirect to backend route for Steam login
    window.location.href =
      import.meta.env.VITE_SERVER_DOMAIN + "/auth/steam/login";
  };

  //handle when the user hits the logout button
  const handleLogout = async () => {
    const response = await axios.post(
      import.meta.env.VITE_SERVER_DOMAIN + "/auth/steam/logout",
      {},
      { withCredentials: true }
    );

    if (!response.data.authenticated) {
      console.log("Logout Successful ");
      setSteamUser({
        authenticated: false,
        id: "none",
        displayName: "none",
        photos: [],
      });
    } else {
      console.log("Logout Failed");
    }
  };

  const handleDemoToggle = () => {
    setDemoModeOn(!demoModeOn);
  };

  //Render different screen if not logged in
  if (!steamUser.authenticated && !demoModeOn) {
    return (
      <>
        <DemoContext.Provider value={demoModeOn}>
          <Navbar
            position="static"
            maxWidth={"full"}
            isBordered={true}
            className="bg-zinc-600"
          >
            {/*Main Nav Items*/}
            <NavbarContent justify="start">
              <NavbarItem>
                <Avatar>
                  <AccountCircleIcon />
                </Avatar>
              </NavbarItem>

              <NavbarItem>
                <Button
                  variant="light"
                  onClick={() => {
                    handleLogin();
                  }}
                >
                  <img
                    src="https://community.akamai.steamstatic.com/public/images/signinthroughsteam/sits_01.png"
                    alt="Sign in with Steam"
                  ></img>
                </Button>
              </NavbarItem>
            </NavbarContent>
            <NavbarContent justify="end">
              <NavbarItem>
                <Switch
                  isSelected={demoModeOn}
                  onValueChange={handleDemoToggle}
                  color="secondary"
                >
                  Demo Mode
                </Switch>
              </NavbarItem>
            </NavbarContent>
          </Navbar>
        </DemoContext.Provider>
      </>
    );
  }

  //Main Logged in screen
  return (
    <>
      <DemoContext.Provider value={demoModeOn}>
        <div className="flex flex-col bg-backgroundColor min-h-screen ">
          {/* Upper Navbar */}
          <Navbar
            position="static"
            maxWidth={"full"}
            isBordered={true}
            className="bg-zinc-600"
          >
            <NavbarContent justify="start">
              {/*Profile Picture*/}
              <NavbarItem>
                {demoModeOn ? (
                  <Avatar>
                    <AccountCircleIcon />
                  </Avatar>
                ) : (
                  <Avatar alt="steam-pfp" src={steamUser.photos[2].value} />
                )}
              </NavbarItem>

              {/*User name Button*/}
              <NavbarItem>
                <div className="display-name">
                  Signed in as:{" "}
                  {demoModeOn ? "rsolis096 (DEMO)" : steamUser.displayName}
                </div>
              </NavbarItem>
            </NavbarContent>
            <NavbarContent justify="end">
              {/*Logout Button*/}
              <NavbarItem>
                {!demoModeOn ? (
                  <Button
                    className="logout-button"
                    onClick={() => {
                      handleLogout();
                    }}
                  >
                    Logout
                  </Button>
                ) : (
                  <Switch
                    isSelected={demoModeOn}
                    onValueChange={handleDemoToggle}
                    color="secondary"
                  >
                    Turn Off Demo Mode
                  </Switch>
                )}
              </NavbarItem>
            </NavbarContent>
          </Navbar>

          {/* Main Content Area */}
          <div className="flex flex-row gap-2 w-full h-screen p-2 overflow-hidden">
            {/*Games Bar (Left Hand Side) */}
            <div className="h-full md:w-4/12 lg:w-3/12 xl:w-2/12  ">
              <GamesList setSelectedGame={updateSelectedGameState} />
            </div>

            {/*Achievements List Area*/}
            <div className="bg-foregroundColor  md:w-8/12 lg:w-9/12 xl:w-11/12 shadow-lg overflow-auto p-2 custom-scrollbar rounded-lg	border-gray-500	 border-2 h-dvh">
              {/*Actual Achievement List*/}
              {selectedGame ? (
                <AchievementList key={selectedGame.appid} game={selectedGame} />
              ) : (
                <p style={{ color: "white" }}>
                  Select a game to see achievements.
                </p>
              )}
            </div>
          </div>
        </div>
      </DemoContext.Provider>
    </>
  );
}

export default App;
