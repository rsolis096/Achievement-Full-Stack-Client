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
import SearchIcon from "@mui/icons-material/Search";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import {ChangeEvent, useEffect, useState} from "react";
import GameItem from "./GameItem.tsx";
import {Game} from "../interfaces/types.tsx";
import axios, {AxiosResponse} from "axios";
import useDebounce from "../hooks/useDebounce.tsx";

interface GamesListProps {
    setSelectedGame: (game:Game) => void
}


function GamesList(props : GamesListProps): JSX.Element {

    const [userLibraryState, setUserLibraryState] = useState<Game[]>([]);
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
    //SEARCH FUNCTIONALITY Used by useEffect hook to fetch user data
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

    //Display the selectable games for the left column
    const gameItems = userLibraryState.map((item) => (
        <ListItemButton key={item.appid} onClick={() => handleGameClick(item)}>
            <GameItem key={item.appid} game={item} />
        </ListItemButton>
    ));

    return (
        <Grid item xs={12} sm={4} md={3} >

            {gameSearchList.length > 0 ? (
                <ul style={{color: "white"}}>
                    {gameSearchList.map((game, index) => (
                        <li key={index}>{game.name}</li>
                    ))}
                </ul>
            ) : (<p>Game Searches will appear here</p>)
            }

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
    )
}

export default GamesList;