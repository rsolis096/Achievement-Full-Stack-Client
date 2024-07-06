// Style
import { Image } from "@nextui-org/react";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import SyncIcon from "@mui/icons-material/Sync";

// Utility
import { OwnedGame } from "../interfaces/types.tsx";
import { Button } from "@nextui-org/react";

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
  const handleSyncButton = () => {
    //Call the server to sync the achievements for this game
    props.setSyncAchievements(props.syncAchievements + 1);
  };

  return (
    <div className="flex flex-row ">
      <div className="flex flex-col sm:flex-row gap-2">
        <div className="w-5/6 sm:w-2/5">
          <Image
            removeWrapper
            alt={props.game.name}
            className="z-0 object-cover rounded-lg	border-2 border-white/20"
            src={getImageURL(String(props.game.appid))}
          />
        </div>
        <div className="flex flex-col gap-1">
          <div>
            <h1 className="text-xl" style={{ color: "white" }}>
              {props.game.name}
            </h1>
          </div>

          {/*Everything below is user specific*/}

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
      </div>
      {props.achievementsEarned != -1 && (
        <div className="flex flex-row w-fit gap-4 mr-2 text-white">
          <div>
            {props.lastSync != "null" && (
              <>
                <p>Last Synced: </p>
                <p>{props.lastSync}</p>
              </>
            )}
          </div>
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
  );
}

export default TitleBar;
