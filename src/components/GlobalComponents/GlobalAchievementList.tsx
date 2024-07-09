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
import GlobalTitleBar from "../GlobalComponents/GlobalTitleBar.tsx";

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

  //Post request to the server to get global achievement info
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

  //Post request to the server to get the app info
  const postAppInfo = async (): Promise<App> => {
    try {
      const response: AxiosResponse<App> = await axios.post(
        import.meta.env.VITE_SERVER_DOMAIN + "/api/games/getAppInfo",
        {
          appid: props.appid,
          headers: { "Content-Type": "application/json" },
        }
      );
      return response.data as App;
    } catch (err) {
      console.log(err);
    }
    return { name: "null", type: "null", appid: 0 } as App;
  };

  //Make the post requests to the server upon mount
  useEffect(() => {
    const fetchData = async () => {
      //fetch user and global achievement data
      const gameAchievements: GameAchievement[] =
        await postGameAchievementData();
      //Fetch App Info
      const app: App = await postAppInfo();
      console.log(app);
      //Turn off loading
      setLoading(false);
      //Save game to state variable
      setAppInfo(app);
      setGameAchievementData(gameAchievements);
    };

    fetchData();
  }, []);

  //Wait until totalData has been completed
  if (loading) {
    return <div style={{ color: "white" }}>Loading...</div>;
  } else if (gameAchievementData.length == 0) {
    if (appInfo.type != "game") {
      return (
        <p>
          {appInfo.name} with appid: {appInfo.appid} is not a game.
        </p>
      );
    }

    return (
      <div style={{ color: "white" }}>
        No achievements associated with this title.
      </div>
    );
  }

  //Render achievement list
  return (
    <>
      {appInfo.name != "null" ? (
        <>
          <div>
            {/*Game Title*/}
            <GlobalTitleBar app={appInfo} />
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
                classNames={{ list: "w-full " }}
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
        <p>AppID : {appInfo.appid} is not a valid app.</p>
      )}
    </>
  );
}

export default GlobalAchievementList;
