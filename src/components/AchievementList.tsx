import { useContext, useEffect, useState } from "react";

import AchievementItem from "./AchievementItem";

import axios, { AxiosResponse } from "axios";
import { Listbox, ListboxItem } from "@nextui-org/listbox";

import {
  Game,
  GameAchievement,
  GlobalAchievement,
  TotalAchievement,
  UserAchievement,
} from "../interfaces/types";

import FilterBar from "../components/FilterBar.tsx";
import TitleBar from "../components/TitleBar.tsx";
import { DemoContext } from "../context/DemoModeContext.tsx";

interface AchievementListProps {
  //The current selected Game
  game: Game;
}

function AchievementList(props: AchievementListProps) {
  //This state variable holds all the combined achievement data
  const [totalAchievementData, setTotalAchievementData] = useState<
    TotalAchievement[]
  >([]);

  const [sortFilter, setSortFilter] = useState<string>("ltm");
  const [visibleFilter, setVisibleFilter] = useState<string>("default");

  const [loading, setLoading] = useState(true);

  const demoModeOn = useContext(DemoContext);

  //Make a post request to the server to get user achievement info
  const postUserAchievementData = async (): Promise<UserAchievement[]> => {
    try {
      const response: AxiosResponse<TotalAchievement[]> = await axios.post(
        import.meta.env.VITE_SERVER_DOMAIN +
          "/api/achievements/getUserAchievements?demo=" +
          demoModeOn,
        {
          appid: props.game.appid,
          headers: { "Content-Type": "application/json" },
        },
        {
          withCredentials: !demoModeOn,
        }
      );
      return response.data;
    } catch (err) {
      console.log(err);
    }
    return [];
  };

  //Make a post request to the server to get global achievement info
  const postGlobalAchievementData = async (): Promise<GlobalAchievement[]> => {
    try {
      const response: AxiosResponse<GlobalAchievement[]> = await axios.post(
        import.meta.env.VITE_SERVER_DOMAIN +
          "/api/achievements/getGlobalAchievements?demo=" +
          demoModeOn,
        {
          appid: props.game.appid,
          headers: { "Content-Type": "application/json" },
        },
        {
          withCredentials: !demoModeOn,
        }
      );
      return response.data;
    } catch (err) {
      console.log(err);
    }
    return [];
  };

  //Gets general achievement info. Includes stuff like icons and hidden type
  const postGameAchievementData = async (): Promise<GameAchievement[]> => {
    try {
      const response: AxiosResponse<GameAchievement[]> = await axios.post(
        import.meta.env.VITE_SERVER_DOMAIN +
          "/api/achievements/getGameAchievements?demo=" +
          demoModeOn,
        {
          appid: props.game.appid,
          headers: { "Content-Type": "application/json" },
        },
        {
          withCredentials: !demoModeOn,
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
      const globalAchievements: GlobalAchievement[] =
        await postGlobalAchievementData();
      const gameAchievements: GameAchievement[] =
        await postGameAchievementData();

      //Set loading to false once everything has been fetched and set
      setLoading(false);

      // Combine data after all fetches are complete (needed to properly render
      if (userAchievements.length > 0 && globalAchievements.length > 0) {
        const combinedData: TotalAchievement[] = userAchievements.map(
          (userAchievement) => {
            const globalAchievement = globalAchievements.find(
              (ga) => ga.name == userAchievement.apiname
            );

            return {
              ...userAchievement,
              globalData: globalAchievement,
              gameData: gameAchievements.find(
                (item) => item.name == userAchievement.apiname
              ),
            };
          }
        );
        setTotalAchievementData(combinedData);
      }
    };

    fetchData();
  }, []);

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
    if (!props.game.has_community_visible_stats) {
      return (
        <div style={{ color: "white" }}>
          No achievements associated with this title.
        </div>
      );
    } else {
      return <div style={{ color: "white" }}>Loading...</div>;
    }
  }

  //Render achievement list
  return (
    <>
      {/*Game Title*/}
      {props.game && (
        <TitleBar
          game={props.game}
          achievementsSize={totalAchievementData.length}
          achievementsEarned={
            totalAchievementData.filter(
              (achievement: TotalAchievement) => achievement.achieved
            ).length
          }
        />
      )}
      {/*Achievement List Filter Bar*/}
      <FilterBar
        setSortFilterP={updateSortFilterState}
        setVisibleFilterP={updateVisibleFilterState}
      />
      {/*Draw the achievement List */}
      {totalAchievementData.length > 0 && !loading ? (
        <Listbox
          classNames={{
            list: "overflow-auto",
          }}
          label="Achievement List"
          aria-label="Achievement List"
          defaultSelectedKeys={["1"]}
          variant="solid"
          selectionMode="none"
        >
          {/*Sort the Achievement Data */}
          {totalAchievementData
            .sort((a, b) => {
              //Most to Least Rare
              if (sortFilter == "mtl") {
                return (
                  (a.globalData?.percent ?? 0) - (b.globalData?.percent ?? 0)
                );
              }
              //Least to most rare
              else if (sortFilter == "ltm") {
                return (
                  (b.globalData?.percent ?? 0) - (a.globalData?.percent ?? 0)
                );
              }
              return 0;
            })
            //hide locked achievements
            .filter((item) => {
              //If the item is unlocked, check if it should be returned
              //Show Locked
              if (visibleFilter == "default") {
                return item.achieved == 1 || item.achieved == 0;
              } else if (visibleFilter == "unlocked") {
                return item.achieved == 1;
              } else if (visibleFilter == "locked") {
                return item.achieved == 0;
              } else {
                return item.achieved == 1 || item.achieved == 0;
              }
            })
            .map((a) => (
              <ListboxItem key={a.apiname} textValue={a.apiname}>
                <AchievementItem key={a.apiname} data={a} game={props.game} />
              </ListboxItem>
            ))}
        </Listbox>
      ) : (
        <div>No user achievements found.</div>
      )}
    </>
  );
}

export default AchievementList;
