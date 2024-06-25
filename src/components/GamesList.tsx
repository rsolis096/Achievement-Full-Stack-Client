//Mounter by App.tsx

//Utility
import { ChangeEvent, useContext, useEffect, useState } from "react";
import { DemoContext } from "../context/DemoModeContext.tsx";
import useDebounce from "../hooks/useDebounce.tsx";
import axios, { AxiosResponse } from "axios";
import { Game } from "../interfaces/types.tsx";

//Styles
import {
  Input,
  Selection,
  Listbox,
  ListboxItem,
  Button,
} from "@nextui-org/react";
import SearchIcon from "@mui/icons-material/Search";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

//Components
import GameItem from "./GameItem.tsx";

//Passed back up to App.tsx, used to display game achievement list
interface GamesListProps {
  setSelectedGame: (game: Game) => void;
}

function GamesList(props: GamesListProps): JSX.Element {
  const [userGames, setUserGames] = useState<Game[]>([]);
  const [userGamesSearch, setUserGamesSearch] = useState<Game[]>([]);
  const [gameCount, setGamesCount] = useState<number>(10);
  const [gameSearch, setGameSearch] = useState<string>("");
  const [selectedKeys, setSelectedKeys] = useState<Selection>(new Set());

  // Debounce when gameSearch input value is changed (see custom hook)
  const debouncedSearchTerm = useDebounce(gameSearch, 200);

  const demoModeOn = useContext(DemoContext);

  //Post All User Games from server
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response: AxiosResponse<Game[]> = await axios.post(
          import.meta.env.VITE_SERVER_DOMAIN +
            "/api/games/getUserGames?demo=" +
            demoModeOn,
          {
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
            import.meta.env.VITE_SERVER_DOMAIN +
              "/api/games/getUserGames/search?demo=" +
              demoModeOn,
            {
              lookup: gameSearch,
              headers: {
                "Content-Type": "application/json",
              },
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
      if (debouncedSearchTerm == "") {
        setUserGamesSearch([]);
      } else {
        fetchData();
      }
    } else {
      setUserGamesSearch([]); // Clear the search list if the search term is empty
    }
  }, [debouncedSearchTerm]);

  //Handle changes to the search Input box
  const handleSearchBoxChange = (e: ChangeEvent<HTMLInputElement>) => {
    //Making individual calls to the server per change doesn't work well. Need to find out what's going on or take a different approach
    setGameSearch(e.target.value);
  };

  //Handles when the user clicks expand button
  const handleExpandButton = () => {
    setGamesCount((prevState) => {
      return prevState + 5;
    });
  };

  //When a game is selected, send this game back to App.tsx, it will then be used by AchievementList
  const handleGameClick = (game: Game) => {
    props.setSelectedGame(game);
  };

  // Handle selection change
  const handleSelectionChange = (keys: Selection) => {
    console.log("Selection Changed");
    setSelectedKeys(keys);
  };

  //Render the default games list to the screen
  const gameItemsDefault = userGames
    .filter((item) => {
      if (item.has_community_visible_stats) {
        return item;
      }
    })
    .map((item) => (
      <ListboxItem
        key={item.appid}
        textValue={item.name}
        onPress={() => handleGameClick(item)}
      >
        <GameItem key={item.appid} game={item} />
      </ListboxItem>
    ));

  //Render the Search result games list to the screen
  const gameItemsSearch = userGamesSearch.map((item) => (
    <ListboxItem
      key={item.appid}
      textValue={item.name}
      onClick={() => handleGameClick(item)}
    >
      <GameItem key={item.appid} game={item} />
    </ListboxItem>
  ));

  return (
    <>
      {/*Search Bar*/}
      <Input
        id="input-with-icon-adornment"
        placeholder="Search for a game in your library"
        onChange={handleSearchBoxChange}
        startContent={<SearchIcon sx={{ color: "grey" }} />}
      />
      {/*Game List*/}
      <div className="bg-foregroundColor mt-2 h-5/6 shadow-lg rounded-lg overflow-auto p-1 custom-scrollbar rounded-lg	border-gray-500	 border-2 ">
        <Listbox
          selectedKeys={selectedKeys}
          onSelectionChange={handleSelectionChange}
          classNames={{
            list: "overflow-auto",
          }}
          defaultSelectedKeys={["1"]}
          variant="shadow"
          color="danger"
          label="Selected Game"
          selectionMode="single"
        >
          {/*List Items*/}
          {userGamesSearch.length > 0 ? gameItemsSearch : gameItemsDefault}
        </Listbox>
      </div>

      {/*Expand Button*/}
      {gameSearch.length == 0 ? (
        <Button
          className="w-full h-8 py-1"
          isIconOnly
          aria-label="Expand"
          onClick={handleExpandButton}
        >
          <ExpandMoreIcon />
        </Button>
      ) : (
        <p style={{ color: "white" }}>End of Results</p>
      )}
    </>
  );
}

export default GamesList;
