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
import {ChangeEvent, useEffect, useState} from "react";
import GameItem from "./GameItem.tsx";
import {Game} from "../interfaces/types.tsx";
import axios, {AxiosResponse} from "axios";
import useDebounce from "../hooks/useDebounce.tsx";

//Passed back up to App.tsx, used to display game achievement list
interface GamesListProps {
    setSelectedGame: (game:Game) => void
}

function GamesList(props : GamesListProps): JSX.Element {

    const [userLibraryState, setUserLibraryState] = useState<Game[]>([]);
    const [gameCount, setGamesCount] = useState<number>(10)
    const [gameSearch, setGameSearch] = useState<string>("")
    const [gameSearchList, setGameSearchList] = useState<Game[]>([])
    const [gameDisplayType, setGameDisplayType] = useState<string>("default");

    //Fetch the game data from the server (API or Database determined by server)
    useEffect(() => {
        const fetchData = async () => {
            try {
                const response: AxiosResponse<Game[]> = await axios.post(
                    "http://localhost:3000/api/games/getUserLibrary",{
                        count: gameCount,

                    },
                    {
                        withCredentials: true,
                        headers: {
                            "Content-Type": "application/json",
                        },
                    }
                );
                setUserLibraryState(response.data);
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };
        fetchData();
    }, [gameCount]);

    //SEARCH FUNCTIONALITY Used by useEffect hook to fetch user data
    const fetchData = async () => {
        try {
            const response: AxiosResponse<Game[]> = await axios.post(
                'http://localhost:3000/api/games/getGames/search',
                {
                    withCredentials: true,
                    lookup: gameSearch,
                    headers: {
                        "Content-Type": "application/json",
                    }
                }
            );
            //YOU MUST DO SOMETHING WITH THE RESPONSE
            setGameSearchList(response.data);
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
            setGameDisplayType("search")
        } else {
            setGameSearchList([]); // Clear the search list if the search term is empty
            setGameDisplayType("default")
        }
    }, [debouncedSearchTerm]);

    //Handle changes to the search Input box
    const handleSearchBoxChange = (e: ChangeEvent<HTMLInputElement>) =>{
        //Making individual calls to the server per change doesn't work well. Need to find out what's going on or take a different approach
        setGameSearch(e.target.value);
    };

    //Handles when the user clock
    const handleExpandButton = () => {
        setGamesCount( (prevState) => {
            return prevState + 5
        })
    }

    //What happens when an item on the game list is clicked
    const handleGameClick = (game  : Game) => {
        //Load up the achievements for the game
        props.setSelectedGame(game);
    };

    //Iterate over default order of user library, display it on games list
    const gameItemsDefault  = userLibraryState.filter((item) =>{
        if(item.has_community_visible_stats){
            return item;
        }
    }).map((item) => (
            <ListItemButton key={item.appid} onClick={() => handleGameClick(item)}>
                <GameItem key={item.appid} game={item}/>
            </ListItemButton>
    ));

    //Iterate over search results, display it on games list
    const gameItemsSearch  = gameSearchList.map((item) => (
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
                <List>{gameDisplayType == "default" ? gameItemsDefault : gameItemsSearch}</List>

                {/*Expand List Button*/}
                {gameDisplayType == "default" &&
                    <IconButton
                        className = "expand-game-list-button"
                        style = {{color: "white"}}
                        size = "large"
                        onClick = {handleExpandButton}
                    >
                        <AddCircleOutlineIcon />
                    </IconButton>
                }

            </Paper>

        </Grid>
    )
}

export default GamesList;