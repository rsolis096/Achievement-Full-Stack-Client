// Style
import { Image } from "@nextui-org/react";

// Utility
import { App } from "../../interfaces/types.tsx";

interface GlobalTitleBarProps {
  app: App;
}
const imageURL: string = "https://cdn.akamai.steamstatic.com/steam/apps/";
const imageURLEnd: string = "/header.jpg";

//Get the id numbers for each image (better suited for item)
function getImageURL(id: string) {
  return imageURL + id + imageURLEnd;
}

function GlobalTitleBar(props: GlobalTitleBarProps) {
  return (
    <div className="flex flex-row ">
      <div className="flex flex-col sm:flex-row gap-2">
        <div className="w-5/6 sm:w-2/5">
          <Image
            removeWrapper
            alt={props.app.name}
            className="z-0 object-cover rounded-lg	border-2 border-white/20"
            src={getImageURL(String(props.app.appid))}
          />
        </div>
        <div className="flex flex-col gap-1">
          <div>
            <h1 className="text-xl" style={{ color: "white" }}>
              {props.app.name}
            </h1>
          </div>
        </div>
      </div>
      <div className="flex flex-row w-fit gap-4 mr-2 text-white"></div>
    </div>
  );
}

export default GlobalTitleBar;
