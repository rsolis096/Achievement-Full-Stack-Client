//Utility
import { useEffect, useContext, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { DemoContext } from "../context/DemoModeContext.tsx";
import { SteamUserContext } from "../context/SteamUserContext.tsx";

//Types
import { SteamUser, SteamUserContextType } from "../interfaces/types.tsx";

//Styling
import {
  Avatar,
  Switch,
  Button,
  Image,
  Navbar,
  NavbarContent,
  NavbarItem,
  Link,
  NavbarMenu,
  NavbarMenuItem,
  NavbarMenuToggle,
} from "@nextui-org/react";
//import HomeIcon from "@mui/icons-material/Home";

//Props
interface UpperNavBar {}

function UpperNavBar() {
  //const { demoModeOn, setDemoMode } = useContext<DemoContextType>(DemoContext);
  const { user, setUser } = useContext<SteamUserContextType>(SteamUserContext);
  const [isMobile, setIsMobile] = useState<boolean>(false);
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);
  const [selectedLink, setSelectedLink] = useState<string>("/home"); // Default selected link
  const demoMode = useContext(DemoContext);
  const navigate = useNavigate();
  const location = useLocation();

  //Extract steam user data from req.user
  //Returns object of type SteamUser
  const extractSteamUser = (user: never): SteamUser => {
    const { authenticated, id, displayName, photos } = user;
    return { authenticated, id, displayName, photos };
  };

  //Used to add a menu button for small screens
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768); // Set breakpoint for mobile
    };

    window.addEventListener("resize", handleResize);
    handleResize();

    return () => window.removeEventListener("resize", handleResize);
  }, []);

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
          demoMode.setDemoMode(false);
          setUser(extractedUser);
        } else {
          console.log("Authentication Failed");
          demoMode.setDemoMode(false);
          setUser({
            authenticated: false,
            id: "none",
            displayName: "none",
            photos: [],
          });
        }
      } catch (error) {
        console.error("Error checking authentication:", error);
        demoMode.setDemoMode(false);
        setUser({
          authenticated: false,
          id: "none",
          displayName: "none",
          photos: [],
        });
      }
    };
    console.log("upper navbar demo mode:", demoMode.demoModeOn);
    if (!demoMode.demoModeOn) {
      checkAuthentication();
    }
  }, []);

  //Check url for navbar highlighting
  useEffect(() => {
    // Set selected link based on current URL
    const path = location.pathname;
    if (path.includes("/library")) {
      setSelectedLink("library");
    } else if (path.includes("/about")) {
      setSelectedLink("about");
    } else {
      setSelectedLink("home");
    }
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
      navigate("/");
    } else {
      console.log("Logout Failed");
    }
  };

  const handleDemoToggle = () => {
    demoMode.setDemoMode(!demoMode.demoModeOn);
    if (!demoMode.demoModeOn) {
      navigate("/library/demo");
    } else {
      navigate("/home");
    }
  };

  //Define menu item type?
  const menuItems = [
    { key: "home", label: "Home", href: "/" },
    {
      key: "library",
      label: "Library",
      href: `/library/${demoMode.demoModeOn ? "demo" : user.id}`,
      authRequired: true,
    },
    { key: "about", label: "About", href: "/about" },
  ];

  //Used for desktop navbar

  interface NavItemProp {
    href: string;
    isActive: boolean;
    label: string;
  }

  const NavItem = (prop: NavItemProp) => (
    <NavbarItem isActive>
      <Link underline="hover" size="lg" href={prop.href} aria-current="page">
        <p className={prop.isActive ? "text-orange-400" : "text-white"}>
          {prop.label}
        </p>
      </Link>
    </NavbarItem>
  );

  return (
    <Navbar
      className="bg-white/10 rounded-b-lg overflow-x-auto"
      classNames={{
        menu: "bg-transparent",
      }}
      maxWidth={"full"}
      isBordered
      onMenuOpenChange={setIsMenuOpen}
    >
      <NavbarContent justify="start">
        {/*Menu Dropdown (small screens only)*/}

        {isMobile && (
          <NavbarMenuToggle
            aria-label={isMenuOpen ? "Close menu" : "Open menu"}
            className="sm:hidden"
          />
        )}

        {/* Profile Picture */}
        <NavbarItem>
          <Avatar
            alt="steam-pfp"
            src={!demoMode.demoModeOn ? user.photos[2]?.value : ""}
            className="text-white bg-white/10"
            onClick={() => {
              if (!user.authenticated) {
                handleLogin();
              }
            }}
          />
        </NavbarItem>

        {/* Username */}
        <NavbarItem>
          {demoMode.demoModeOn || user.authenticated ? (
            <div className="display-name text-white">
              {demoMode.demoModeOn ? "DEMO" : user.displayName}
            </div>
          ) : (
            <>
              <Button
                isIconOnly
                className="w-fit"
                variant="light"
                onPress={handleLogin}
              >
                <Image
                  src="https://community.akamai.steamstatic.com/public/images/signinthroughsteam/sits_01.png"
                  alt="Sign in with Steam"
                />
              </Button>
            </>
          )}
        </NavbarItem>
      </NavbarContent>

      {/*Navbar Links */}
      {isMobile ? (
        <>
          {/*Draw navbar links in menu for small screens*/}
          <NavbarMenu>
            {menuItems.map((item) => (
              <NavbarMenuItem key={item.label}>
                <Link href={item.href} size="lg" underline="hover">
                  <p
                    className={
                      selectedLink.includes(item.label.toLowerCase())
                        ? "text-orange-400"
                        : "text-white"
                    }
                  >
                    {item.label}
                  </p>
                </Link>
              </NavbarMenuItem>
            ))}
          </NavbarMenu>
        </>
      ) : (
        <>
          {/*Draw navbar links as is for large screens*/}
          <NavbarContent justify="center" className="font-bold">
            {menuItems.map(
              (item) =>
                (!item.authRequired ||
                  user.authenticated ||
                  demoMode.demoModeOn) && (
                  <NavItem
                    key={item.key}
                    href={item.href}
                    isActive={selectedLink.includes(item.key)}
                    label={item.label}
                  />
                )
            )}
          </NavbarContent>
        </>
      )}

      {/*Demo Mode Toggle Switch */}
      <NavbarContent justify="end">
        <NavbarItem>
          {!demoMode.demoModeOn && user.authenticated ? (
            <Button className="logout-button" onPress={handleLogout}>
              Logout
            </Button>
          ) : (
            <Switch
              isSelected={demoMode.demoModeOn}
              onValueChange={handleDemoToggle}
              classNames={{ label: "text-white" }}
              color="warning"
            >
              Demo Mode
            </Switch>
          )}
        </NavbarItem>
      </NavbarContent>
    </Navbar>
  );
}

export default UpperNavBar;
