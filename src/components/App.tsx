import {useEffect, useState} from "react";

import {
    Grid,
    Typography,
    Box, AppBar, Toolbar, Button, Avatar
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
    const [steamUser, setSteamUser] = useState<SteamUser>({authenticated : false, id: "none", displayName: 'none', photos: []});

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
            console.log("Logout Successful ", response.data)
            setSteamUser({authenticated : false, id: "none", displayName: 'none', photos: []})
        } else{
            console.log("Logout Failed")
        }
    }



    //Render different screen if not logged in
    if (!steamUser.authenticated) {
        return (
            <>
                <Grid container spacing={0.5} >
                    <AppBar position="static" style={{ marginBottom: '10px' }}>
                        <Toolbar>
                            <Button variant = "contained" onClick = {() => {handleLogin()}}>Login</Button>
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

          {/*Top Bar With user info and logout button*/}
          <AppBar position="static" style={{ marginBottom: '10px' }}>
              <Toolbar>
                  <Grid alignItems="center" container direction = "row"  justifyContent = "flex-start">

                      {steamUser.authenticated && (
                          <>
                                  <Grid className = "profile-picture" item xs = {0}>
                                      <Avatar   alt="steam-pfp"   sx={{ width: 50, height: 50}} src={steamUser.photos[2].value} />
                                  </Grid>
                                  <Grid item className = "display-name" xs = {2}>
                                    <Typography variant ="h6" >Signed in as: {steamUser.displayName}</Typography>
                                  </Grid>
                          </>
                      ) }

                      <Grid  item xs = {1}>
                        <Button  className = "logout-button" variant = "contained" onClick = { () => {handleLogout()} }>Logout</Button>
                      </Grid>
                  </Grid>
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
                  <Typography style ={{"color" : "white"}} variant="body1">Select a game to see achievements.</Typography>
              )}
            </Box>

        </Grid>

      </Grid>

    </>
  );
}

export default App;
