// Utility
import { GameAchievement, App } from "../../interfaces/types";

// Styles
import { Card, Image, CardBody } from "@nextui-org/react";
import "../../styles/UserAchievementItem.css";

interface GlobalAchievementItemProps {
  data: GameAchievement;
  game: App;
}

const iconURL =
  "https://steamcdn-a.akamaihd.net/steamcommunity/public/images/apps/"; //  +appid/icon

function GlobalAchievementItem(props: GlobalAchievementItemProps) {
  /*
  //Save this for a global stats page
  const clampedProgress = Math.min(
    Math.max(props.data.globalData ? props.data.globalData.percent : 0, 0),
    100
  );

  // Define the gradient background style
  const backgroundStyle = {
    background: `linear-gradient(to right, rgba(209, 213, 219, 0.8) ${clampedProgress}%, rgba(255, 255, 255, 0) ${clampedProgress}%)`,
  };
  */

  return (
    <>
      <Card isBlurred className={"border-none bg-background/80"} shadow="sm">
        <CardBody>
          <div className="flex flex-cols-6 gap-2">
            <Image
              alt="Album cover"
              className="max-w-20"
              src={iconURL + props.game.appid + "/" + props.data.icon}
            />
            <div className="flex flex-col justify-start">
              <h1 className="text-large font-medium mt-2">
                {props.data.localized_name}
              </h1>
              <h3 className="font-semibold text-foreground/90">
                {props.data.localized_desc}
              </h3>
            </div>
          </div>
        </CardBody>
      </Card>
    </>
  );
}

export default GlobalAchievementItem;
