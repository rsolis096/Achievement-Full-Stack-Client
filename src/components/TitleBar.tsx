// Style
import { Image } from "@nextui-org/react";

// Utility
import { Game } from "../interfaces/types.tsx";

interface TitleBarProps {
  game: Game;
  achievementsSize: number;
  achievementsEarned: number;
}
const imageURL: string = "https://cdn.akamai.steamstatic.com/steam/apps/";
const imageURLEnd: string = "/header.jpg";

//Get the id numbers for each image (better suited for item)
function getImageURL(id: string) {
  return imageURL + id + imageURLEnd;
}

function TitleBar(props: TitleBarProps) {
  return (
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
        <div>
          <h1 className="text-lg" style={{ color: "white" }}>
            Total Playtime: {props.game.playtime_forever / 60} hours
          </h1>
        </div>
        <div>
          <h1 className="text-lg" style={{ color: "white" }}>
            Achievements Earned: {props.achievementsEarned} /{" "}
            {props.achievementsSize}
          </h1>
        </div>
      </div>
    </div>
  );
}

export default TitleBar;
