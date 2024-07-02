//Utility
import { useEffect, useState } from "react";
import axios, { AxiosResponse } from "axios";

//Types
import { GameAchievement, App } from "../../interfaces/types.tsx";

//Styling
import { Listbox, ListboxItem } from "@nextui-org/listbox";
import "../../styles/CustomScrollbar.css";

//Components
import GlobalAchievementItem from "./GlobalAchievementItem.tsx";
//import FilterBar from "../FilterBar.tsx";
import TitleBar from "../TitleBar.tsx";

interface GlobalAchievementListProps {
  //The current selected Game
  appid: number;
}

interface ErrorResponse {
  error: string;
}

const isErrorResponse = (
  response: GameAchievement[] | ErrorResponse
): response is ErrorResponse => {
  return (response as ErrorResponse).error !== undefined;
};

function GlobalAchievementList(props: GlobalAchievementListProps) {
  //This state variable holds all the combined achievement data
  const [gameAchievementData, setGameAchievementData] = useState<
    GameAchievement[]
  >([]);

  const [appInfo, setAppInfo] = useState<App>({
    name: "null",
    type: "null",
    appid: 0,
  } as App);

  const [loading, setLoading] = useState(true);

  //Make a post request to the server to get global achievement info
  const postGameAchievementData = async (): Promise<GameAchievement[]> => {
    try {
      const response: AxiosResponse<GameAchievement[]> = await axios.post(
        import.meta.env.VITE_SERVER_DOMAIN +
          "/api/achievements/getGameAchievements",
        {
          appid: props.appid,
          headers: { "Content-Type": "application/json" },
        }
      );

      if (isErrorResponse(response.data)) {
        setGameAchievementData([] as GameAchievement[]);
        return [] as GameAchievement[];
      } else {
        return response.data;
      }
    } catch (err) {
      console.log(err);
    }
    return [];
  };

  const postAppInfo = async (): Promise<App> => {
    try {
      const response: AxiosResponse<App> = await axios.post(
        import.meta.env.VITE_SERVER_DOMAIN + "/api/games/getAppInfo",
        {
          appid: props.appid,
          headers: { "Content-Type": "application/json" },
        }
      );
      return response.data;
    } catch (err) {
      console.log(err);
    }
    return { name: "null", type: "null", appid: 0 } as App;
  };

  useEffect(() => {
    const fetchData = async () => {
      //fetch user and global achievement data
      const gameAchievements: GameAchievement[] =
        await postGameAchievementData();
      const app: App = await postAppInfo();
      setLoading(false);
      setAppInfo(app);
      setGameAchievementData(gameAchievements);
    };

    fetchData();
  }, []);

  //Wait until totalData has been completed
  if (loading) {
    if (gameAchievementData.length == 0) {
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
      {appInfo.name != "null" ? (
        <>
          <div>
            {/*Game Title*/}
            <TitleBar
              game={{
                name: appInfo.name,
                appid: appInfo.appid,
                playtime_forever: -1,
                has_community_visible_stats: false,
              }}
              achievementsSize={gameAchievementData.length}
              achievementsEarned={-1}
              setSyncAchievements={(val: number) => {
                console.log(val);
              }}
              syncAchievements={0}
              lastSync="null"
            />
          </div>

          {/*Achievement List Filter Bar*/}
          <div className="overflow-auto custom-scrollbar h-5/6 mt-2">
            {/*Draw the achievement List */}
            {gameAchievementData.length > 0 && !loading ? (
              <Listbox
                label="Achievement List"
                aria-label="Achievement List"
                defaultSelectedKeys={["1"]}
                variant="solid"
                selectionMode="none"
              >
                {/*Sort the Achievement Data */}
                {gameAchievementData.map((a: GameAchievement) => (
                  <ListboxItem
                    key={a.internal_name}
                    textValue={a.localized_name}
                  >
                    <GlobalAchievementItem
                      key={a.internal_name}
                      data={a}
                      game={appInfo}
                    />
                  </ListboxItem>
                ))}
              </Listbox>
            ) : (
              <p className="text-white">{appInfo.name} has no achievements</p>
            )}
          </div>
        </>
      ) : (
        <p>{appInfo.name} has no achievements</p>
      )}
    </>
  );
}

export default GlobalAchievementList;

/*
        <FilterBar
          setSortFilterP={updateSortFilterState}
          setVisibleFilterP={updateVisibleFilterState}
        />
        */
