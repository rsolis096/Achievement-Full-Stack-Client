//Mounted by App.tsx

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
  Accordion,
  AccordionItem,
} from "@nextui-org/react";
import SearchIcon from "@mui/icons-material/Search";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

//Components
import GameItem from "../GameItem.tsx";

//Passed back up to App.tsx, used to display game achievement list
interface UserGamesListProps {
  setSelectedGame: (game: OwnedGame) => void;
}

function UserGamesList(props: UserGamesListProps) {
  // State and hooks
  const [userGames, setUserGames] = useState<OwnedGame[]>([]);
  const [userGamesSearch, setUserGamesSearch] = useState<OwnedGame[]>([]);
  const [gameCount, setGamesCount] = useState<number>(10);
  const [gameSearch, setGameSearch] = useState<string>("");
  const [selectedKeys, setSelectedKeys] = useState<Selection>(new Set());
  const debouncedSearchTerm = useDebounce(gameSearch, 200);
  const demoMode = useContext(DemoContext);
  const [isMobile, setIsMobile] = useState<boolean>(false);
  const [accordionOpen, setAccordionOpen] = useState<boolean>(true);
  const [selectedKeysAccordion, setSelectedKeysAccordion] = useState<Selection>(
    new Set(["main"])
  );

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768); // Set breakpoint for mobile
    };
    window.addEventListener("resize", handleResize);
    handleResize();
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response: AxiosResponse<OwnedGame[]> = await axios.post(
          `${import.meta.env.VITE_SERVER_DOMAIN}/api/games/getUserGames`,
          { count: gameCount, demo: demoMode.demoModeOn },
          {
            withCredentials: !demoMode.demoModeOn,
            headers: { "Content-Type": "application/json" },
          }
        );
        setUserGames(response.data.length ? response.data : []);
      } catch (error) {
        console.error("Error fetching data:", error);
        setUserGames([]);
      }
    };
    fetchData();
  }, [gameCount, demoMode.demoModeOn]);

  useEffect(() => {
    if (debouncedSearchTerm) {
      const fetchData = async () => {
        try {
          const response: AxiosResponse<OwnedGame[]> = await axios.post(
            `${
              import.meta.env.VITE_SERVER_DOMAIN
            }/api/games/getUserGames/search`,
            {
              demo: demoMode.demoModeOn,
              lookup: gameSearch,
              headers: { "Content-Type": "application/json" },
            },
            { withCredentials: !demoMode.demoModeOn }
          );
          setUserGamesSearch(response.data);
        } catch (error) {
          console.error("Error fetching data:", error);
          setUserGamesSearch([]);
        }
      };
      debouncedSearchTerm === "" ? setUserGamesSearch([]) : fetchData();
    } else {
      setUserGamesSearch([]);
    }
  }, [debouncedSearchTerm]);

  const handleSearchBoxChange = (e: ChangeEvent<HTMLInputElement>) => {
    //If the accordion was closed when text was input, open it
    setSelectedKeysAccordion(!accordionOpen ? new Set() : new Set(["main"]));
    !accordionOpen && setAccordionOpen(true);
    setGameSearch(e.target.value);
  };

  const handleExpandButton = () => {
    setGamesCount((prevState) => prevState + 5);
  };

  const handleGameClick = (game: OwnedGame) => {
    props.setSelectedGame(game);
  };

  const handleSelectionChange = (keys: Selection) => {
    setSelectedKeys(keys);
  };

  const handleAccordionToggle = () => {
    setSelectedKeysAccordion(accordionOpen ? new Set() : new Set(["main"]));
    setAccordionOpen(!accordionOpen);
  };

  const renderGameItems = (games: OwnedGame[]) =>
    games.map((item) => (
      <ListboxItem
        key={item.appid}
        classNames={{ selectedIcon: "text-white" }}
        textValue={item.name}
        onPress={() => handleGameClick(item)}
      >
        <GameItem
          key={item.appid}
          game={{ name: item.name, type: "game", appid: item.appid } as App}
        />
      </ListboxItem>
    ));

  return (
    <div className="flex flex-col h-full">
      <div style={{ color: "white" }}>
        <Input
          id="input-with-icon-adornment"
          classNames={{ inputWrapper: "border-white/20" }}
          placeholder="Search your library"
          variant="bordered"
          onChange={handleSearchBoxChange}
          isClearable
          onClear={() => setGameSearch("")}
          startContent={<SearchIcon sx={{ color: "white" }} />}
        />
      </div>
      <div className="bg-foregroundColor/40 mt-2 shadow-lg rounded-lg p-1 overflow-y-auto custom-scrollbar border-white/20 border-2 flex-grow">
        {isMobile ? (
          <Accordion selectedKeys={selectedKeysAccordion} isCompact>
            <AccordionItem
              title={
                accordionOpen ? "Your Library" : "Expand to view your library"
              }
              onPress={handleAccordionToggle}
              key="main"
            >
              <div className="overflow-y-auto max-h-72">
                {userGames.length > 0 && (
                  <Listbox
                    selectedKeys={selectedKeys}
                    onSelectionChange={handleSelectionChange}
                    className="p-0"
                    disallowEmptySelection
                    variant="bordered"
                    color="default"
                    label="Selected Game"
                    selectionMode="single"
                    bottomContent={
                      <div>
                        {gameSearch.length === 0 && (
                          <Button
                            className={
                              "w-full mt-1 " + (isMobile ? "h-10" : "h-6")
                            }
                            isIconOnly
                            variant="bordered"
                            aria-label="Expand"
                            onClick={handleExpandButton}
                          >
                            <ExpandMoreIcon className="text-white" />
                          </Button>
                        )}
                      </div>
                    }
                  >
                    {renderGameItems(
                      userGamesSearch.length > 0 ? userGamesSearch : userGames
                    )}
                  </Listbox>
                )}
              </div>
            </AccordionItem>
          </Accordion>
        ) : (
          <div>
            {userGames.length > 0 && (
              <Listbox
                selectedKeys={selectedKeys}
                onSelectionChange={handleSelectionChange}
                className="p-0"
                disallowEmptySelection
                variant="bordered"
                color="default"
                label="Selected Game"
                selectionMode="single"
              >
                {renderGameItems(
                  userGamesSearch.length > 0 ? userGamesSearch : userGames
                )}
              </Listbox>
            )}
            {gameSearch.length === 0 ? (
              <Button
                className={"w-full mt-1 " + (isMobile ? "h-10" : "h-6")}
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
          </div>
        )}
      </div>
    </div>
  );
}

export default UserGamesList;
