import React, {useEffect, useState} from "react";

import {
    Grid,
    Typography,
    Box, AppBar, Toolbar, Button, Avatar, Switch, FormGroup, FormControlLabel
} from "@mui/material";

import AccountCircleIcon from '@mui/icons-material/AccountCircle';

import AchievementList from "./AchievementList.tsx";
import {DemoContext} from "../context/DemoModeContext.tsx"
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
    const [steamUser, setSteamUser] = useState<SteamUser>({authenticated : false, id: "none", displayName: 'none', photos: []});
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
                const response = await axios.get(import.meta.env.VITE_SERVER_DOMAIN+'/auth/steam/checkAuthenticated', {
                    withCredentials: true, // Important to include credentials
                });

                if (response.data.authenticated) {
                    const extractedUser:SteamUser = extractSteamUser(response.data.user as never);
                    extractedUser.authenticated = true;
                    console.log("Authenticated successfully, Logged in as : ", extractedUser);
                    setDemoModeOn(false);
                    setSteamUser(extractedUser);
                } else {
                    console.log("Authentication Failed")
                    setSteamUser({authenticated : false, id: "none", displayName: 'none', photos: []});
                }
            } catch (error) {
                console.error('Error checking authentication:', error);
                setSteamUser({authenticated : false, id: "none", displayName: 'none', photos: []});
            }
        };
        checkAuthentication();
    }, []);

    //Used by GamesList to set which game should be rendered in the achievement list
    const updateSelectedGameState = (game : Game) =>{
        setSelectedGame(game)
    }

    //Handles sorting order filter
    const updateSortFilterState = (n : number) => {
        if(n != -1){
          setSortFilter(n);
        }
    };

    //Handles checkboxes used to filter certain types of achievements
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

        const response = await axios.post(import.meta.env.VITE_SERVER_DOMAIN+'/auth/steam/logout', {}, {withCredentials: true})

        if (!response.data.authenticated) {
            console.log("Logout Successful ")
            setSteamUser({authenticated : false, id: "none", displayName: 'none', photos: []})
        } else{
            console.log("Logout Failed")
        }
    }

    const handleDemoToggle = (event: React.ChangeEvent<HTMLInputElement>) => {
        setDemoModeOn(event.target.checked);
    }

    //Render different screen if not logged in
    if (!steamUser.authenticated && !demoModeOn) {
        return (
            <>
                <DemoContext.Provider value={demoModeOn}>

                    <AppBar position="static" style={{ marginBottom: '10px' }}>
                        <Toolbar>
                            <Grid alignItems="center" container direction = "row">

                                <Grid alignItems="center" item container xs = {6} justifyContent="flex-start">
                                        <Grid item xs = {8.5}>
                                            <Button variant = "contained" onClick = {() => {handleLogin()}}>Login with Steam</Button>
                                        </Grid>
                                </Grid>

                                <Grid alignItems="center" container xs = {6} item justifyContent="flex-end">
                                    <Grid alignItems="center" item xs ={0}>
                                    </Grid>

                                    <Grid alignItems="center" item xs ={0}>
                                        <FormGroup>
                                            <FormControlLabel  control={<Switch checked = {demoModeOn} onChange={handleDemoToggle} color="secondary"/>}  label="Turn on Demo Mode" />
                                        </FormGroup>
                                    </Grid>
                                </Grid>

                            </Grid>
                        </Toolbar>
                    </AppBar>

                </DemoContext.Provider>
            </>
        )
    }

    //Main Logged in screen
  return (
    <>
        <DemoContext.Provider value = {demoModeOn}>
            {/* Main Body Content */}
          <Grid container>

              {/*Top Bar With user info and logout button*/}
              <AppBar position="static" style={{ marginBottom: '10px' }}>
                  <Toolbar>
                      <Grid alignItems="center" container direction = "row">

                          <Grid alignItems="center" item container xs = {6} justifyContent="flex-start">

                              <Grid alignItems="center" item container justifyContent="flex-start">

                                  {!demoModeOn &&(
                                      <Grid  item xs = {2}>
                                          <Button  className = "logout-button" variant = "contained" onClick = { () => {handleLogout()} }>Logout</Button>
                                      </Grid>
                                  )}

                                  <Grid className = "profile-picture" item xs = {0}>
                                      {demoModeOn ? (
                                      <Avatar>
                                          <AccountCircleIcon/>
                                      </Avatar>
                                      ) :
                                      (
                                        <Avatar   alt="steam-pfp"   sx={{ width: 50, height: 50}} src={steamUser.photos[2].value} />
                                      )}
                                  </Grid>

                                  <Grid item className = "display-name" xs = {6}>
                                      <Typography variant ="h6" >Signed in as: {demoModeOn ? "rsolis096 (DEMO)": steamUser.displayName}</Typography>
                                  </Grid>
                              </Grid>





                          </Grid>

                          <Grid alignItems="center" container xs = {6} item justifyContent="flex-end">
                              {(!steamUser.authenticated && demoModeOn) && (
                                  <Grid alignItems="center" item xs ={0}>
                                      <FormGroup>
                                          <FormControlLabel  control={<Switch checked = {demoModeOn} onChange={handleDemoToggle} color="secondary"/>}  label="Turn Off Demo Mode" />
                                      </FormGroup>
                                  </Grid>
                              )}
                          </Grid>


                      </Grid>
                  </Toolbar>
              </AppBar>

            {/*Games Bar (Left Hand Side) */}
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
                      <Typography style ={{"color" : "white"}} variant="body1">Select a game to see achievements.</Typography>
                  )}
                </Box>

            </Grid>

          </Grid>
        </DemoContext.Provider>
    </>
  );
}

export default App;
