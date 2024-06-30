//Mounter by App.tsx

//Utility
import { ChangeEvent, useContext, useEffect, useState } from "react";
import { DemoContext } from "../../context/DemoModeContext.tsx";
import useDebounce from "../../hooks/useDebounce.tsx";
import axios, { AxiosResponse } from "axios";
import { OwnedGame, App } from "../../interfaces/types.tsx";

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
import GameItem from "../GameItem.tsx";

//Passed back up to App.tsx, used to display game achievement list
interface UserGamesListProps {
  setSelectedGame: (game: OwnedGame) => void;
}

function UserGamesList(props: UserGamesListProps): JSX.Element {
  const [userGames, setUserGames] = useState<OwnedGame[]>([]);
  const [userGamesSearch, setUserGamesSearch] = useState<OwnedGame[]>([]);
  const [gameCount, setGamesCount] = useState<number>(10);
  const [gameSearch, setGameSearch] = useState<string>("");
  const [selectedKeys, setSelectedKeys] = useState<Selection>(new Set());

  // Debounce when gameSearch input value is changed (see custom hook)
  const debouncedSearchTerm = useDebounce(gameSearch, 200);

  const demoMode = useContext(DemoContext);
  //Post All User Games from server
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response: AxiosResponse<OwnedGame[]> = await axios.post(
          import.meta.env.VITE_SERVER_DOMAIN + "/api/games/getUserGames",
          {
            count: gameCount,
            demo: demoMode.demoModeOn,
          },
          {
            withCredentials: !demoMode.demoModeOn,
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        if (response.data.length) {
          setUserGames(response.data);
        } else {
          console.log(response.data);
          console.log("authentication issue");
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        setUserGames([]);
      }
    };
    fetchData();
  }, [gameCount, demoMode.demoModeOn]);

  //Fetch the game data from the server with search restrictions
  useEffect(() => {
    if (debouncedSearchTerm) {
      const fetchData = async () => {
        try {
          const response: AxiosResponse<OwnedGame[]> = await axios.post(
            import.meta.env.VITE_SERVER_DOMAIN +
              "/api/games/getUserGames/search",
            {
              demo: demoMode.demoModeOn,
              lookup: gameSearch,
              headers: {
                "Content-Type": "application/json",
              },
            },
            {
              withCredentials: !demoMode.demoModeOn,
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
    console.log("current search: ", e.target.value);
    setGameSearch(e.target.value);
  };

  //Handles when the user clicks expand button
  const handleExpandButton = () => {
    setGamesCount((prevState) => {
      return prevState + 5;
    });
  };

  //When a game is selected, send this game back to App.tsx, it will then be used by AchievementList
  const handleGameClick = (game: OwnedGame) => {
    props.setSelectedGame(game);
  };

  // Handle selection change
  const handleSelectionChange = (keys: Selection) => {
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
        classNames={{
          selectedIcon: "text-white",
        }}
        textValue={item.name}
        onPress={() => handleGameClick(item)}
      >
        <GameItem
          key={item.appid}
          game={{ name: item.name, type: "game", appid: item.appid } as App}
        />
      </ListboxItem>
    ));

  //Render the Search result games list to the screen
  const gameItemsSearch = userGamesSearch.map((item) => (
    <ListboxItem
      key={item.appid}
      textValue={item.name}
      onClick={() => handleGameClick(item)}
    >
      <GameItem
        key={item.appid}
        game={{ name: item.name, type: "game", appid: item.appid } as App}
      />
    </ListboxItem>
  ));

  return (
    <>
      {/*Search Bar*/}
      <div style={{ color: "white" }}>
        <Input
          id="input-with-icon-adornment"
          classNames={{
            inputWrapper: "border-white/20",
          }}
          placeholder="Search for a game in your library"
          variant="bordered"
          onChange={handleSearchBoxChange}
          isClearable={true}
          onClear={() => setGameSearch("")}
          startContent={<SearchIcon sx={{ color: "white" }} />}
        />
      </div>
      {/*Game List*/}
      <div className="bg-foregroundColor/40 mt-2 h-4/6 shadow-lg rounded-lg overflow-auto p-1 custom-scrollbar border-white/20	 border-2 ">
        {userGames.length > 0 && (
          <Listbox
            selectedKeys={selectedKeys}
            onSelectionChange={handleSelectionChange}
            className="p-0 gap-0 divide-y   overflow-visible shadow-small rounded-medium"
            disallowEmptySelection
            variant="bordered"
            color="default"
            label="Selected Game"
            selectionMode="single"
          >
            {/*List Items*/}
            {userGamesSearch.length > 0 ? gameItemsSearch : gameItemsDefault}
          </Listbox>
        )}
      </div>

      {/*Expand Button*/}
      {gameSearch.length == 0 ? (
        <Button
          className="w-full h-6 py-1 mt-1"
          isIconOnly
          variant="bordered"
          aria-label="Expand"
          onClick={handleExpandButton}
        >
          <ExpandMoreIcon className="text-white" />
        </Button>
      ) : (
        <p style={{ color: "white" }}>End of Results</p>
      )}
    </>
  );
}

export default UserGamesList;
