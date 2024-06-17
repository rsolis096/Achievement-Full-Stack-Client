//Mounter by App.tsx
import {
    FormControl,
    Grid,
    IconButton,
    Input,
    InputAdornment,
    List,
    ListItemButton,
    Paper,
    Typography
} from "@mui/material";

import "../styles/GamesList.css"
import SearchIcon from "@mui/icons-material/Search";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import {ChangeEvent, useContext, useEffect, useState} from "react";
import GameItem from "./GameItem.tsx";
import {Game} from "../interfaces/types.tsx";
import axios, {AxiosResponse} from "axios";
import useDebounce from "../hooks/useDebounce.tsx";
import {DemoContext} from "../context/DemoModeContext.tsx";

//Passed back up to App.tsx, used to display game achievement list
interface GamesListProps {
    setSelectedGame: (game:Game) => void
}


function GamesList(props : GamesListProps): JSX.Element {

    const [userGames, setUserGames] = useState<Game[]>([]);
    const [userGamesSearch, setUserGamesSearch] = useState<Game[]>([])
    const [gameCount, setGamesCount] = useState<number>(10)
    const [gameSearch, setGameSearch] = useState<string>("")

    // Debounce when gameSearch input value is changed (see custom hook)
    const debouncedSearchTerm = useDebounce(gameSearch, 200);

    const demoModeOn = useContext(DemoContext);

    //Post All User Games from server
    useEffect(() => {
        const fetchData = async () => {
            try {
                const response: AxiosResponse<Game[]> = await axios.post(
                    import.meta.env.VITE_SERVER_DOMAIN +"/api/games/getUserGames?demo=" + demoModeOn,{
                        count: gameCount,
                    },
                    {
                        withCredentials: !demoModeOn,
                        headers: {
                            "Content-Type": "application/json",
                        },
                    }
                );
                setUserGames(response.data);
            } catch (error) {
                console.error("Error fetching data:", error);
                setUserGames([]);
            }
        };
        fetchData();
    }, [gameCount, demoModeOn]);

    //Fetch the game data from the server with search restrictions
    useEffect(() => {
        if (debouncedSearchTerm) {
            const fetchData = async () => {
                try {
                    const response: AxiosResponse<Game[]> = await axios.post(
                        import.meta.env.VITE_SERVER_DOMAIN+'/api/games/getUserGames/search?demo=' + demoModeOn,{
                            lookup: gameSearch,
                            headers: {
                                "Content-Type": "application/json",
                            }
                        },
                        {
                            withCredentials: !demoModeOn,
                        }
                    );
                    setUserGamesSearch(response.data);
                } catch (error) {
                    console.error("Error fetching data:", error);
                    setUserGamesSearch([]);
                }
            };
            if(debouncedSearchTerm == ""){
                setUserGamesSearch([])
            } else{
            fetchData();
            }
        } else {
            setUserGamesSearch([]); // Clear the search list if the search term is empty
        }
    }, [debouncedSearchTerm]);

    //Handle changes to the search Input box
    const handleSearchBoxChange = (e: ChangeEvent<HTMLInputElement>) =>{
        //Making individual calls to the server per change doesn't work well. Need to find out what's going on or take a different approach
        setGameSearch(e.target.value);
    };

    //Handles when the user clicks expand button
    const handleExpandButton = () => {
        setGamesCount( (prevState) => {
            return prevState + 5
        })
    }

    //When a game is selected, send this game back to App.tsx, it will then be used by AchievementList
    const handleGameClick = (game  : Game) => {
        props.setSelectedGame(game);
    };

    //Render the default games list to the screen
    const gameItemsDefault  = userGames.filter((item) =>{
        if(item.has_community_visible_stats){
            return item;
        }
    }).map((item) => (
        <ListItemButton key={item.appid} onClick={() => handleGameClick(item)}>
            <GameItem key={item.appid} game={item}/>
        </ListItemButton>
    ));

    //Render the Search result games list to the screen
    const gameItemsSearch = userGamesSearch.map((item) => (
        <ListItemButton key={item.appid} onClick={() => handleGameClick(item)}>
            <GameItem key={item.appid} game={item}/>
        </ListItemButton>
    ));

    return (
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

                {/*Game List (differentiate between search results and default results*/}
                <List>{userGamesSearch.length > 0 ? gameItemsSearch : gameItemsDefault}</List>

                {/*Expand List Button (Doesn't do anything atm)*/}
                {gameSearch.length == 0 ? (
                <IconButton
                    className = "expand-game-list-button"
                    style = {{color: "white"}}
                    size = "large"
                    onClick = {handleExpandButton}
                >
                    <AddCircleOutlineIcon />
                </IconButton>
                    ) : <Typography style = {{"color" : "white"}}>End of Results</Typography>}


            </Paper>

        </Grid>
    )
}

export default GamesList;