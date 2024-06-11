import {ChangeEvent, useEffect, useState} from "react";

import axios, {AxiosResponse} from "axios";

import useDebounce from '../hooks/useDebounce.tsx';

import {
  AppBar,
  Tabs,
  Tab,
  Grid,
  Paper,
  Typography,
  List,
  Box,
  ListItemButton,
  IconButton, FormControl, Input, InputAdornment,
} from "@mui/material";

import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';

import AchievementList from "./AchievementList.tsx";

import "../styles/App.css";
import {Game} from "../interfaces/types.tsx";
import GameItem from "./GameItem.tsx";
import SearchIcon from "@mui/icons-material/Search";
import FilterBar from "./FilterBar.tsx";

function App() {

  //Define state variables
  const [sortFilter, setSortFilter] = useState<number>(0)
  const [visibleFilter, setVisibleFilter] = useState<boolean[]>([false, false]);
  const [userLibraryState, setUserLibraryState] = useState<Game[]>([]);
  const [selectedGame, setSelectedGame] = useState<Game>();
  const [gameCount, setGamesCount] = useState<number>(10)
  const [gameSearch, setGameSearch] = useState<string>("")
  const [gameSearchList, setGameSearchList] = useState<Game[]>([])

  //Fetch the game data from the server (API or Database determined by server)
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response: AxiosResponse<Game[]> = await axios.post(
            "http://localhost:3000/api/games/getGames",
            {
              count: gameCount,
              headers: {
                "Content-Type": "application/json",
              }
            }
        );
        setUserLibraryState(response.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, [gameCount]);

  //Used by useEffect hook to fetch user data
  const fetchData = async () => {
    try {
      const response: AxiosResponse<Game[]> = await axios.post(
          "http://localhost:3000/api/games/getGames/search",
          {
            lookup: gameSearch,
            headers: {
              "Content-Type": "application/json",
            }
          }
      );
      //YOU MUST DO SOMETHING WITH THE RESPONSE
      setGameSearchList(response.data);
      console.log(gameSearchList)
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  // Debounce when gameSearch input value is changed (see custom hook)
  const debouncedSearchTerm = useDebounce(gameSearch, 200);

  //Post request for game lookup
  useEffect(() => {
    if (debouncedSearchTerm) {
      fetchData();
    } else {
      setGameSearchList([]); // Clear the search list if the search term is empty
    }
  }, [debouncedSearchTerm]);

  //Handles when the user clock
  const handleExpandButton = () => {
    setGamesCount( (prevState) => {
      return prevState + 5
    })
  }

  //What happens when an item on the game list is clicked
  const handleGameClick = (game  : Game) => {
    //Load up the achievements for the game
    setSelectedGame(game);
  };

  //Handle changes to the search Input box
  const handleSearchBoxChange = (e: ChangeEvent<HTMLInputElement>) =>{
    //Making individual calls to the server per change doesn't work well. Need to find out what's going on or take a different approach
    setGameSearch(e.target.value);
  };

  //Handlers for Filter bar state updates
  const updateSortFilterState = (n : number) => {
    if(n != -1){
      setSortFilter(n);
    }

  };

  const updateVisibleFilterState = (index : number) => {
    setVisibleFilter(prevState => prevState.map((item, idx) => idx === index ? !item : item))
  };

  /* Helper Functions */

  //Display the selectable games for the left column
  const gameItems = userLibraryState.map((item) => (
      <ListItemButton key={item.appid} onClick={() => handleGameClick(item)}>
        <GameItem key={item.appid} game={item} />
      </ListItemButton>
  ));

  return (
    <>
      {/* Main Tabs Navigation */}
      <AppBar position="static">
        <Tabs value = {0} onChange = {() => {"button pressed"}}>
          <Tab label="Steam"/>
          <Tab label="PlayStation" />
        </Tabs>
      </AppBar>

      {/* Main Body Content */}
      <Grid container spacing={0.5} style={{ marginTop: '20px' }}>

        {/*Games Bar*/}
        <Grid item xs={12} sm={4} md={3} >
          <Paper elevation = {3} className="game-list-container">
            <Typography style = {{color : "white"}} variant="h5">Games</Typography>

            {/*Game Search */}
            <FormControl variant="standard">

              <Input
                  id="input-with-icon-adornment"
                  sx={{ color: 'white' }}
                  onChange = {handleSearchBoxChange}
                  startAdornment={
                    <InputAdornment position="start">
                      <SearchIcon sx={{ color: 'white' }}/>
                    </InputAdornment>
                  }
              />
            </FormControl>

            {/*Game List*/}
            <List>{gameItems}</List>
            <IconButton
                className = "expand-game-list-button"
                style = {{color: "white"}}
                size = "large"
                onClick = {handleExpandButton}
            >
              <AddCircleOutlineIcon />
            </IconButton>
          </Paper>
        </Grid>

        {/*Achievements Bar*/}
        <Grid item xs={12} sm={8} md={9} className="achievement-list-container" >

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
                      sort = {sortFilter}
                      visibleItems = {visibleFilter}
                  />
              ) : (
                  <Typography variant="body1">Select a game to see achievements.</Typography>
              )}

              {gameSearchList.length > 0 ? (
                  <ul>
                    {gameSearchList.map((game, index) => (
                        <li key={index}>{game.name}</li>
                    ))}
                  </ul>
              ) : (<p>nothing</p>)
              }

            </Box>

        </Grid>

      </Grid>

    </>
  );
}

export default App;
