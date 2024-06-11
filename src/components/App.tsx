import {useState} from "react";

import {
  Grid,
  Typography,
  Box
} from "@mui/material";

import AchievementList from "./AchievementList.tsx";

import "../styles/App.css";

import FilterBar from "./FilterBar.tsx";
import GamesList from "./GamesList.tsx";
import {Game} from "../interfaces/types.tsx";
import TitleBar from "./TitleBar.tsx";

function App() {

  //Define state variables
  const [sortFilter, setSortFilter] = useState<number>(0)
  const [visibleFilter, setVisibleFilter] = useState<boolean[]>([false, false]);
  const [selectedGame, setSelectedGame] = useState<Game>();


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

  /* Helper Functions */

  return (
    <>

      {/* Main Body Content */}
      <Grid container spacing={0.5} style={{ marginTop: '20px' }}>

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
