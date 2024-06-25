//Mounted by GamesList
//Utility
import { Game } from "../interfaces/types";

//Styles
import { Card, Image, CardFooter } from "@nextui-org/react";

interface GameItemProps {
  game: Game;
}

const imageURL: string = "https://cdn.akamai.steamstatic.com/steam/apps/";
const imageURLEnd: string = "/header.jpg";

//Get the id numbers for each image (better suited for item)
function getImageURL(id: string) {
  return imageURL + id + imageURLEnd;
}

//Display the game and its image
function GameItem(props: GameItemProps) {
  return (
    <>
      <Card isFooterBlurred className="w-full h-full">
        <Image
          removeWrapper
          alt={props.game.name}
          className="z-0 w-full h-full object-cover"
          src={getImageURL(String(props.game.appid))}
        />

        <CardFooter className="justify-start bg-black/40 py-1 absolute before:rounded-xl rounded-small bottom-1 w-[calc(100%_-_10px)] ml-1 ">
          <p className="text-small text-white">{props.game.name}</p>
        </CardFooter>
      </Card>
    </>
  );
}

export default GameItem;
