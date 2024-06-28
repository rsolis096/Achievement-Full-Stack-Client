//Utility
import { useEffect, useContext } from "react";
import axios from "axios";
import { DemoContext } from "../context/DemoModeContext.tsx";
import { SteamUserContext } from "../context/SteamUserContext.tsx";

//Types
import {
  SteamUser,
  SteamUserContextType,
  DemoContextType,
} from "../interfaces/types.tsx";

//Styling
import {
  Avatar,
  Switch,
  Button,
  Image,
  Navbar,
  NavbarContent,
  NavbarItem,
} from "@nextui-org/react";

//Props
interface UpperNavBar {}

function UpperNavBar() {
  const { demoModeOn, setDemoMode } = useContext<DemoContextType>(DemoContext);
  const { user, setUser } = useContext<SteamUserContextType>(SteamUserContext);

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
        //Authenticated Successfully
        if (response.data.authenticated) {
          const extractedUser: SteamUser = extractSteamUser(
            response.data.user as never
          );
          extractedUser.authenticated = true;
          console.log(
            "Authenticated successfully, Logged in as : ",
            extractedUser
          );
          setDemoMode(false);
          setUser(extractedUser);
        } else {
          console.log("Authentication Failed");
          setDemoMode(false);
          setUser({
            authenticated: false,
            id: "none",
            displayName: "none",
            photos: [],
          });
        }
      } catch (error) {
        console.error("Error checking authentication:", error);
        setDemoMode(false);
        setUser({
          authenticated: false,
          id: "none",
          displayName: "none",
          photos: [],
        });
      }
    };
    checkAuthentication();
  }, []);

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
      setUser({
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
    setDemoMode(!demoModeOn);
  };

  return (
    <Navbar className="bg-white/10 rounded-b-lg" maxWidth={"full"} isBordered>
      {/* Upper Navbar */}
      <NavbarContent justify="start">
        {/*Profile Picture*/}
        <NavbarItem>
          {/* TODO: Wait for NextUI update, known bug causes disableAnimations error */}
          <Avatar
            alt="steam-pfp"
            src={!demoModeOn ? user.photos[2]?.value : ""}
            className="text-white"
            classNames={{
              base: "bg-white/10",
            }}
          />
        </NavbarItem>

        <NavbarItem>
          {/*Display UserName*/}
          {demoModeOn ? (
            <div className="display-name text-white">
              Signed in as: {demoModeOn ? "DEMO" : user.displayName}
            </div>
          ) : (
            <div>
              <Button
                variant="light"
                onPress={() => {
                  handleLogin();
                }}
              >
                <Image
                  src="https://community.akamai.steamstatic.com/public/images/signinthroughsteam/sits_01.png"
                  alt="Sign in with Steam"
                />
              </Button>
            </div>
          )}
        </NavbarItem>
      </NavbarContent>
      <NavbarContent justify="end">
        {/*Logout Button*/}
        <NavbarItem>
          {!demoModeOn && user.authenticated ? (
            <Button
              className="logout-button"
              onPress={() => {
                handleLogout();
              }}
            >
              Logout
            </Button>
          ) : (
            <Switch
              isSelected={demoModeOn}
              onValueChange={handleDemoToggle}
              classNames={{
                label: "text-white",
              }}
              color="warning"
            >
              Turn Off Demo Mode
            </Switch>
          )}
        </NavbarItem>
      </NavbarContent>
    </Navbar>
  );
}

export default UpperNavBar;
