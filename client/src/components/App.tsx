import React, { useEffect, useState } from "react";

import {
  AppBar,
  Tabs,
  Tab,
  Grid,
  Paper,
  Button,
  Typography,
  List,
  Box,
  ListItemButton,
  Menu,
  MenuItem,
  FormControlLabel,
  Checkbox,

} from "@mui/material";

import SortIcon from '@mui/icons-material/Sort';

import AchievementList from "./AchievementList.tsx";

import "../styles/App.css";
import {Game} from "../interfaces/types.tsx";
import GameItem from "./GameItem.tsx";

function App() {

  //Used to anchor the filter dropdown to the button
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  //Used to determine if filter menu is open
  const open = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };


  const [sortFilter, setSortFilter] = useState<number>(0)
  const [currentSort, setCurrentSort] = useState<string>("Most to Least Rare")

  //Close when an Item is selected and do stuff
  const handleClose = (n : number) => {
    const labels = ["Most to Least Rare", "Least To Most Rare"];
    setAnchorEl(null);
    if(n != -1){
      setSortFilter(n)
      setCurrentSort(labels[n])
    }
  };


  const [visibleFilter, setVisibleFilter] = useState<boolean[]>([false, false]);
  //Handle Checkbox stuff
  const handleCheckBox = (index : number) => {
    setVisibleFilter(prevState => prevState.map((item, idx) => idx === index ? !item : item))
  }

  const [userLibraryState, setUserLibraryState] = useState<Game[]>([]);
  const [selectedGame, setSelectedGame] = useState<Game>();



  const handleGameClick = (game  : Game) => {
    setSelectedGame(game);
  };

  //Fetch the game data from the server (API or Database determined by server)
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          "http://localhost:3000/api/games/getGames"
        );
        const data = await response.json();
        setUserLibraryState(data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, []);

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

      {/* Side Navigation and Content */}
      <Grid container spacing={2} style={{ marginTop: '20px' }}>

        {/*Games Bar*/}
        <Grid item xs={12} sm={4} md={3}>
          <Paper style={{ padding: '16px' }}>
            <Typography variant="h6">Games</Typography>
            <List>{gameItems}</List>
            <Button variant="contained" color="primary">Expand Games</Button>
          </Paper>
        </Grid>

        {/*Achievements Bar*/}
        <Grid item xs={12} sm={8} md={9}>
          <Paper style={{ padding: '16px' }}>

            {/*Achievement List Filter Bar*/}
            <AppBar position="static">
              <Box display="flex" alignItems="center" mb={1}>

                {/*Filter Button*/}
                <Button
                    id="basic-button"
                    onClick={handleClick}
                    variant="contained"
                    startIcon = {<SortIcon />}
                >
                  {currentSort}
                </Button>

                {/*Sort Button Dropdown menu*/}
                <Menu
                    id="basic-menu"
                    anchorEl={anchorEl}
                    open={open}
                    onClose={() => handleClose(-1)}
                >
                  <MenuItem onClick={() =>handleClose(0)}>Most to Least Rare</MenuItem>
                  <MenuItem onClick={() =>handleClose(1)}>Least to Most Rare</MenuItem>
                </Menu>

                {/*Hide Locked Checkbox*/}
                <FormControlLabel
                    control={
                      <Checkbox
                          name="Show Locked"
                          color="secondary"
                          onChange = {() => handleCheckBox(0)}
                      />
                    }
                    label="Hide Locked"
                    style={{ marginLeft: '10px' }} // Adjust spacing as needed
                />

                <FormControlLabel
                    control={
                      <Checkbox
                          name="Show Locked"
                          color="secondary"
                          onChange = {() => handleCheckBox(1)}
                      />
                    }
                    label="Hide Unlocked"
                    style={{ marginLeft: '10px' }} // Adjust spacing as needed
                />



              </Box>
            </AppBar>

            {/*Achievement List Display Box*/}
            <Box className="achievement-list-box">
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
            </Box>

          </Paper>
        </Grid>
      </Grid>

    </>
  );
}

export default App;