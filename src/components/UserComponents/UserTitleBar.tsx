// Style
import { Image } from "@nextui-org/react";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import SyncIcon from "@mui/icons-material/Sync";
import RemoveIcon from "@mui/icons-material/Remove";
import AddIcon from "@mui/icons-material/Add";

// Utility
import { useLocation } from "react-router-dom";
import { OwnedGame } from "../../interfaces/types.tsx";
import { Button } from "@nextui-org/react";
import { useContext, useEffect, useState } from "react";
import { DemoContext } from "../../context/DemoModeContext.tsx";
import axios from "axios";

interface UserTitleBarProps {
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
const getImageURL = (id: string) => {
  return imageURL + id + imageURLEnd;
};

function UserUserTitleBar(props: UserTitleBarProps) {
  const demoMode = useContext(DemoContext);
  const location = useLocation();

  const [isTracked, setIsTracked] = useState<boolean>(
    props.game.tracking ? props.game.tracking : false
  );

  const handleSyncButton = () => {
    //Call the server to sync the achievements for this game
    props.setSyncAchievements(props.syncAchievements + 1);
  };

  useEffect(() => {
    console.log(props.game);
    if (props.game.tracking) setIsTracked(props.game.tracking);
  }, [props.game]);

  const handleTrackingButton = async () => {
    //Check url for navbar highlighting
    await axios.post(
      `${import.meta.env.VITE_SERVER_DOMAIN}/api/games/updateTrackedItem`,
      {
        appid: props.game.appid,
        demo: demoMode.demoModeOn,
        value: !isTracked,
      },
      {
        withCredentials: !demoMode.demoModeOn,
        headers: { "Content-Type": "application/json" },
      }
    );
    setIsTracked(!isTracked);
    //Refresh when something is removed from the list
    if (location.pathname.includes("tracklist")) {
      window.location.reload();
    }
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
          <div>
            <h1 className="text-lg" style={{ color: "white" }}>
              Total Playtime: {(props.game.playtime_forever / 60).toFixed(1)}{" "}
              hours
            </h1>
          </div>

          <div>
            <h1 className="text-lg" style={{ color: "white" }}>
              <p>
                Achievements Earned: {props.achievementsEarned} /{" "}
                {props.achievementsSize}
                {props.achievementsEarned - props.achievementsSize == 0 && (
                  <EmojiEventsIcon />
                )}
              </p>
              <p>Total Achievements: {props.achievementsSize}</p>
            </h1>
          </div>
        </div>
      </div>
      <div className="flex flex-col w-fit gap-4 mr-2 text-white">
        <div className="flex flex-row gap-3">
          <div>
            <Button
              className="mt-2"
              onPress={handleSyncButton}
              endContent={<SyncIcon />}
            >
              Last Sync: {props.lastSync}
            </Button>
          </div>
        </div>

        {/*Handle # cases, null, true, false. null and false act the same*/}
        <div className="flex flex-row gap-3 justify-end">
          <Button
            className="mt-2"
            onPress={handleTrackingButton}
            endContent={isTracked ? <RemoveIcon /> : <AddIcon />}
          >
            {isTracked ? "Remove From Track List" : "Add To Track List"}
          </Button>
        </div>
      </div>
    </div>
  );
}

export default UserUserTitleBar;
