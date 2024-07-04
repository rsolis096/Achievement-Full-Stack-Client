//Utility
import { useContext, useEffect, useState } from "react";
import axios, { AxiosResponse } from "axios";

//Types
import {
  OwnedGame,
  GameAchievement,
  TotalAchievement,
  UserAchievement,
} from "../../interfaces/types.tsx";

//Styling
import { Listbox, ListboxItem } from "@nextui-org/listbox";
import "../../styles/CustomScrollbar.css";

//Components
import UserAchievementItem from "./UserAchievementItem.tsx";
import UserFilterBar from "../UserComponents/UserFilterBar.tsx";
import TitleBar from "../TitleBar.tsx";
import { DemoContext } from "../../context/DemoModeContext.tsx";

interface UserAchievementListProps {
  //The current selected Game
  game: OwnedGame;
}

interface Result {
  userAchievements: UserAchievement[];
  time: number;
  last_sync: string;
}

function UserAchievementList(props: UserAchievementListProps) {
  //This state variable holds all the combined achievement data
  const [totalAchievementData, setTotalAchievementData] = useState<
    TotalAchievement[]
  >([]);

  const [sortFilter, setSortFilter] = useState<string>("ltm");
  const [visibleFilter, setVisibleFilter] = useState<string>("default");
  const [syncRequested, setSyncRequested] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [lastSync, setLastSync] = useState<string>("null");

  const demoMode = useContext(DemoContext);

  //Make a post request to the server to get user achievement info
  const postUserAchievementData = async (): Promise<UserAchievement[]> => {
    try {
      const response: AxiosResponse<Result> = await axios.post(
        import.meta.env.VITE_SERVER_DOMAIN +
          "/api/achievements/getUserAchievements",
        {
          demo: demoMode.demoModeOn,
          appid: props.game.appid,
          sync: syncRequested != 0,
          headers: { "Content-Type": "application/json" },
        },
        {
          withCredentials: !demoMode.demoModeOn,
        }
      );
      const result: Result = response.data;
      setLastSync(result.last_sync);
      return result.userAchievements;
    } catch (err) {
      console.log(err);
    }
    return [];
  };

  //Make a post request to the server to get global achievement info
  const postGameAchievementData = async (): Promise<GameAchievement[]> => {
    try {
      const response: AxiosResponse<GameAchievement[]> = await axios.post(
        import.meta.env.VITE_SERVER_DOMAIN +
          "/api/achievements/getGameAchievements",
        {
          appid: props.game.appid,
          headers: { "Content-Type": "application/json" },
        }
      );
      return response.data;
    } catch (err) {
      console.log(err);
    }
    return [];
  };

  useEffect(() => {
    const fetchData = async () => {
      //fetch user and global achievement data
      const userAchievements: UserAchievement[] =
        await postUserAchievementData();
      const gameAchievements: GameAchievement[] =
        await postGameAchievementData();

      //Set loading to false once everything has been fetched and set
      setLoading(false);

      // Combine data after all fetches are complete (needed to properly render
      if (userAchievements.length > 0 && gameAchievements.length > 0) {
        const combinedData: TotalAchievement[] = userAchievements.map(
          (userAchievement) => {
            const gameAchievement = gameAchievements.find(
              (ga) => ga.internal_name == userAchievement.apiname
            );

            return {
              userData: userAchievement,
              gameData: gameAchievement,
            };
          }
        );
        setTotalAchievementData(combinedData);
      }
    };

    fetchData();
  }, [syncRequested]);

  //Handles sorting order filter
  const updateSortFilterState = (sortType: string) => {
    setSortFilter(sortType);
  };

  //Handles checkboxes used to filter certain types of achievements
  const updateVisibleFilterState = (type: string) => {
    setVisibleFilter(type);
  };

  //Wait until totalData has been completed
  if (loading) {
    return <div style={{ color: "white" }}>Loading...</div>;
  }

  //Render achievement list
  return (
    <div className="flex flex-col gap-2 h-full">
      {/* Game Title */}
      <div className="ml-3">
        {props.game && (
          <TitleBar
            game={props.game}
            achievementsSize={totalAchievementData.length}
            setSyncAchievements={setSyncRequested}
            syncAchievements={syncRequested}
            lastSync={lastSync}
            achievementsEarned={
              totalAchievementData.filter(
                (achievement) => achievement.userData?.achieved
              ).length
            }
          />
        )}
      </div>
      {/* Achievement List Filter Bar */}
      <div>
        <UserFilterBar
          setSortFilterP={updateSortFilterState}
          setVisibleFilterP={updateVisibleFilterState}
        />
      </div>
      {/* Achievement List */}
      <div className="custom-scrollbar overflow-y-auto flex-grow">
        {totalAchievementData.length > 0 && !loading ? (
          <Listbox
            label="Achievement List"
            aria-label="Achievement List"
            defaultSelectedKeys={["1"]}
            variant="solid"
            selectionMode="none"
          >
            {/* Sort and Filter Achievement Data */}
            {totalAchievementData
              .sort((a, b) => {
                // Most to Least Rare
                if (sortFilter === "mtl" && a.gameData && b.gameData) {
                  return (
                    (parseFloat(a.gameData?.player_percent_unlocked) ?? 0) -
                    parseFloat(b.gameData?.player_percent_unlocked ?? 0)
                  );
                }
                // Least to Most Rare
                else if (sortFilter === "ltm" && a.gameData && b.gameData) {
                  return (
                    (parseFloat(b.gameData?.player_percent_unlocked) ?? 0) -
                    parseFloat(a.gameData?.player_percent_unlocked ?? 0)
                  );
                }
                return 0;
              })
              // Hide Locked Achievements
              .filter((item) => {
                if (visibleFilter === "default") {
                  return (
                    item.userData?.achieved === 1 ||
                    item.userData?.achieved === 0
                  );
                } else if (visibleFilter === "unlocked") {
                  return item.userData?.achieved === 1;
                } else if (visibleFilter === "locked") {
                  return item.userData?.achieved === 0;
                } else {
                  return (
                    item.userData?.achieved === 1 ||
                    item.userData?.achieved === 0
                  );
                }
              })
              .map((a) => (
                <ListboxItem
                  key={a.userData.apiname}
                  textValue={a.gameData?.internal_name}
                >
                  <UserAchievementItem
                    key={a.gameData?.internal_name}
                    achievementData={a}
                    appid={props.game.appid}
                  />
                </ListboxItem>
              ))}
          </Listbox>
        ) : (
          <div>No user achievements found.</div>
        )}
      </div>
    </div>
  );
}

export default UserAchievementList;
