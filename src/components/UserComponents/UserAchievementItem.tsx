// Utility
import { TotalAchievement } from "../../interfaces/types";

// Styles
import { Card, Image, CardBody } from "@nextui-org/react";
import "../../styles/UserAchievementItem.css";

interface UserAchievementItemProps {
  achievementData: TotalAchievement;
  appid: number;
}

const iconURL =
  "https://steamcdn-a.akamaihd.net/steamcommunity/public/images/apps/"; //  +appid/icon

function UserAchievementItem(props: UserAchievementItemProps) {
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
      <Card
        isBlurred
        className={
          "border-none " +
          (props.achievementData.userData?.achieved === 1
            ? "bg-background/80"
            : "bg-background/40")
        }
        shadow="sm"
      >
        <CardBody>
          <div className="flex flex-cols-6 gap-2">
            <Image
              alt="Album cover"
              className="max-w-20"
              src={
                iconURL +
                props.appid +
                "/" +
                (props.achievementData.userData?.achieved === 1
                  ? props.achievementData.gameData?.icon
                  : props.achievementData.gameData?.icon_gray)
              }
            />
            <div className="flex flex-col justify-start">
              <h1 className="text-large font-medium mt-2">
                {props.achievementData.gameData?.localized_name}
              </h1>
              <h3 className="font-semibold text-foreground/90">
                {props.achievementData.gameData?.localized_desc}
              </h3>
            </div>
          </div>
        </CardBody>
      </Card>
    </>
  );
}

export default UserAchievementItem;
