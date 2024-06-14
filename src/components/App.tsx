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
import {Game} from "../interfaces/types.tsx";
import TitleBar from "./TitleBar.tsx";
import axios from "axios";

function App() {

    //Define state variables
    const [sortFilter, setSortFilter] = useState<number>(0)
    const [visibleFilter, setVisibleFilter] = useState<boolean[]>([false, false]);
    const [selectedGame, setSelectedGame] = useState<Game>();
    const [isAuthenticated, setIsAuthenticated] = useState(false); // null indicates loading state
    const [userData, setUserData] = useState(null);

    //Helper function used to get user info from server
    const fetchUserData = async () => {
        try {
            console.log("Fetching user data!")
            const response = await axios.get('https://achievement-full-stack-server.onrender.com/auth/steam/user',{
                withCredentials: true,
            });

            setUserData(response.data);
            console.log(response.data)
        } catch (error) {
            console.error('Error fetching user data:', error);
        }
    };

    //Checks If user is logged in upon page load
    useEffect(() => {
        const checkAuthentication = async () => {
            try {
                console.log("Page loaded, checking server for authentication")
                const response = await axios.get('https://achievement-full-stack-server.onrender.com/auth/steam/checkAuthenticated', {
                    withCredentials: true, // Important to include credentials
                });
                console.log("Authentication Response: ", response.data);
                if (!response.data.authenticated) {
                    //window.location.href = 'http://localhost:3000/auth/steam/login'; // Redirect to backend route for Steam login
                    setIsAuthenticated(false);
                    console.log("First Load Failure: ", userData)
                } else {
                    setIsAuthenticated(true);
                    await fetchUserData();
                    console.log("First Load  success: ", userData)
                }
            } catch (error) {
                console.error('Error checking authentication:', error);
                setIsAuthenticated(false);
            }
        };
        checkAuthentication();
        /*
        //Delay 3 seconds to give the user time to read redirect message
        const delayCheck = setTimeout(() => {
        }, 3000);
        // Cleanup the timeout if the component is unmounted
        return () => clearTimeout(delayCheck);
        */
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
    const handleLogin = async () => {

        const checkAuthentication = async () => {
            try {
                if (!isAuthenticated) {
                    window.location.href = 'https://achievement-full-stack-server.onrender.com/auth/steam/login'; // Redirect to backend route for Steam login

                    //This forces a return back to the main page, calling useEffect
                    await axios.get('https://achievement-full-stack-server.onrender.com/auth/steam/checkAuthenticated', {
                        withCredentials: true, // Important to include credentials
                    });

                }
            } catch (error) {
                console.error('Error checking authentication:', error);
                setIsAuthenticated(false);
            }
        };
        checkAuthentication()
    }

    //handle when the user hits the logout button
    const handleLogout = async () => {
        window.location.href = 'https://achievement-full-stack-server.onrender.com/auth/steam/logout';

        const response = await axios.get('https://achievement-full-stack-server.onrender.com/auth/steam/checkAuthenticated/', {
            withCredentials: true, // Important to include credentials
        });

        if (!response.data.authenticated) {
            setIsAuthenticated(false)
        } else {
            setIsAuthenticated(true)
            console.log("Failed to Logout");
        }
    }

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
                      name={selectedGame.name}
                      appid={selectedGame.appid}
                      items={selectedGame.achievements}
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
