// Style
import { Image } from "@nextui-org/react";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import SyncIcon from "@mui/icons-material/Sync";

// Utility
import { OwnedGame } from "../interfaces/types.tsx";
import { SteamUserContext } from "../context/SteamUserContext.tsx";
import { useContext } from "react";
import { Button } from "@nextui-org/react";
//Types
import { SteamUserContextType } from "../interfaces/types.tsx";

interface TitleBarProps {
  game: OwnedGame;
  achievementsSize: number;
  achievementsEarned: number;
  setSyncAchievements: (val: number) => void;
  syncAchievements: number;
  lastSync: string;
}
const imageURL: string = "https://cdn.akamai.steamstatic.com/steam/apps/";
const imageURLEnd: string = "/header.jpg";

//Get the id numbers for each image (better suited for item)
function getImageURL(id: string) {
  return imageURL + id + imageURLEnd;
}

function TitleBar(props: TitleBarProps) {
  const { user } = useContext<SteamUserContextType>(SteamUserContext);

  const handleSyncButton = () => {
    //Call the server to sync the achievements for this game
    props.setSyncAchievements(props.syncAchievements + 1);
  };

  return (
    <>
      <div className="flex flex-cols px-3 mb-3 8 	">
        <div className="md:w-1/2 lg:w-1/4 xl:w-1/6">
          <Image
            removeWrapper
            alt={props.game.name}
            className="z-0 w-full h-full object-cover rounded-lg	border-2 border-white/20"
            src={getImageURL(String(props.game.appid))}
          />
        </div>
        <div className=" w-3/4 ml-2 justify-center flex-rows">
          <div>
            <h1 className="text-xl" style={{ color: "white" }}>
              {props.game.name}
            </h1>
          </div>
          {props.achievementsEarned != -1 && (
            <div>
              <h1 className="text-lg" style={{ color: "white" }}>
                Total Playtime: {(props.game.playtime_forever / 60).toFixed(1)}{" "}
                hours
              </h1>
            </div>
          )}

          <div>
            <h1 className="text-lg" style={{ color: "white" }}>
              {props.achievementsEarned != -1 ? (
                <>
                  {" "}
                  Achievements Earned: {props.achievementsEarned} /{" "}
                  {props.achievementsSize}
                  {props.achievementsEarned - props.achievementsSize == 0 && (
                    <EmojiEventsIcon />
                  )}
                </>
              ) : (
                <p>Total Achievements: {props.achievementsSize}</p>
              )}
            </h1>
          </div>
        </div>
        {props.achievementsEarned != -1 && (
          <div className="flex flex-cols text-white">
            {props.lastSync != "null" && (
              <div>
                <p>Last Synced: </p>
                <p>{props.lastSync}</p>
              </div>
            )}
            <div>
              <Button
                className="mt-2"
                isIconOnly
                onPress={handleSyncButton}
                endContent={<SyncIcon />}
              />
            </div>
          </div>
        )}
      </div>
    </>
  );
}

export default TitleBar;
