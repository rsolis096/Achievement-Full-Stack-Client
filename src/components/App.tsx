import {useEffect, useState} from "react";

import {
    Grid,
    Typography,
    Box, AppBar, Toolbar, Button
} from "@mui/material";

import AchievementList from "./AchievementList.tsx";

import "../styles/App.css";

import FilterBar from "./FilterBar.tsx";
import GamesList from "./GamesList.tsx";
import {Game, SteamUser} from "../interfaces/types.tsx";
import TitleBar from "./TitleBar.tsx";
import axios from "axios";

function App() {

    //Define state variables
    const [sortFilter, setSortFilter] = useState<number>(0)
    const [visibleFilter, setVisibleFilter] = useState<boolean[]>([false, false]);
    const [selectedGame, setSelectedGame] = useState<Game>( );
    const [isAuthenticated, setIsAuthenticated] = useState(false); // null indicates loading state
    const [userData, setUserData] = useState(null);


    //Checks If user is logged in upon page load
    useEffect(() => {
        const checkAuthentication = async () => {
            try {
                console.log("Page loaded, checking server for authentication")
                const response = await axios.get(import.meta.env.VITE_SERVER_DOMAIN+'/auth/steam/checkAuthenticated', {
                    withCredentials: true, // Important to include credentials
                });
                //The User was verified successfully
                if (response.data.authenticated) {
                    console.log("Authenticated successfully.");
                    setIsAuthenticated(true);
                    setUserData(response.data.user);
                    console.log("Logged in as: ", response.data.user);
                } else {
                    console.log("Authentication Failed")
                    setIsAuthenticated(false);
                }
            } catch (error) {
                console.error('Error checking authentication:', error);
                setIsAuthenticated(false);
            }
        };
        checkAuthentication();
    }, []);

    //Component Handlers

    //GamesList Handlers
    const updateSelectedGameState = (game : Game) =>{
        setSelectedGame(game)
    }

    //FilterBar Handlers
    const updateSortFilterState = (n : number) => {
        if(n != -1){
          setSortFilter(n);
        }
    };

    const updateVisibleFilterState = (index : number) => {
        setVisibleFilter(prevState => prevState.map((item, idx) => idx === index ? !item : item))
    };

    //Handle when the user hits login button
    const handleLogin = () => {
        // Redirect to backend route for Steam login
        window.location.href = import.meta.env.VITE_SERVER_DOMAIN+'/auth/steam/login';
    }

    //handle when the user hits the logout button
    const handleLogout = async () => {
        window.location.href = import.meta.env.VITE_SERVER_DOMAIN+'/auth/steam/logout';

        const response = await axios.get(import.meta.env.VITE_SERVER_DOMAIN+'/auth/steam/checkAuthenticated/', {
            withCredentials: true, // Important to include credentials
        });

        if (!response.data.authenticated) {
            setIsAuthenticated(false)
        } else {
            setIsAuthenticated(true)
            console.log("Failed to Logout");
        }
    }

    //Extract steam user data from req.user
    const extractSteamUser = (user: never): SteamUser => {
        const { id, displayName, photos } = user;
        return { id, displayName, photos };
    };

    //Render different screen if not logged in
    if (!isAuthenticated) {
        return (
            <>
                <Grid container spacing={0.5} >
                    <AppBar position="static" style={{ marginBottom: '10px' }}>
                        <Toolbar>
                            <Button variant = "contained" onClick = {() => {handleLogin()}}>Login</Button>
                            <Typography>Upon returning to this page, please wait a few seconds</Typography>
                        </Toolbar>
                    </AppBar>
                </Grid>
            </>
        )
    }


  /* Helper Functions */

  return (
    <>

      {/* Main Body Content */}
      <Grid container spacing={0.5} >

          <AppBar position="static" style={{ marginBottom: '10px' }}>
              <Toolbar>
                  <Button variant = "contained" onClick = { () => {handleLogout()} }>Logout</Button>
                  {userData && (<Typography>Logged in as {extractSteamUser(userData).displayName}</Typography>) }
              </Toolbar>
          </AppBar>

        {/*Games Bar*/}
        <GamesList
            setSelectedGame= {updateSelectedGameState}
        />

        {/*Achievements*/}
        <Grid item xs={12} sm={8} md={9} className="achievement-list-container" >

            {/*Game Title*/}
            {selectedGame && (<TitleBar currentGame = {selectedGame}/>)}

            {/*Achievement List Filter Bar*/}
            <FilterBar
                setSortFilterP={updateSortFilterState}
                setVisibleFilterP= {updateVisibleFilterState}
            />

            {/*Achievement List Display Box*/}
            <Box >

              {/*Achievement List Items*/}
              {selectedGame ? (
                  <AchievementList
                      key={selectedGame.appid}
                      game={selectedGame}
                      sort = {sortFilter}
                      visibleItems = {visibleFilter}
                  />
              ) : (
                  <Typography variant="body1">Select a game to see achievements.</Typography>
              )}
            </Box>

        </Grid>

      </Grid>

    </>
  );
}

export default App;
