//Utility
import { useEffect, useState } from "react";
import axios, { AxiosResponse } from "axios";

//Types
import { WeeklyGame } from "../interfaces/types";

//Components
import HomeDescription from "./HomeDescription";
import GameView from "./GameView";

//Styles
import {
  Image,
  Card,
  CardFooter,
  Listbox,
  ListboxItem,
} from "@nextui-org/react";

const imageURL: string = "https://cdn.akamai.steamstatic.com/steam/apps/";
const imageURLEnd: string = "/header.jpg";

//Get the id numbers for each image (better suited for item)
function getImageURL(id: string) {
  return imageURL + id + imageURLEnd;
}

function Home() {
  const [mostPlayedGames, setMostPlayedGames] = useState<WeeklyGame[]>([]);
  const [weeklyGames, setWeeklyGames] = useState<WeeklyGame[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      //Most Played Games
      try {
        const response: AxiosResponse<WeeklyGame[]> = await axios.get(
          import.meta.env.VITE_SERVER_DOMAIN + "/api/games/getMostPlayedGames"
        );
        setMostPlayedGames(response.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }

      //Best Selling Weekly Games
      try {
        const response: AxiosResponse<WeeklyGame[]> = await axios.get(
          import.meta.env.VITE_SERVER_DOMAIN + "/api/games/getTopWeekly"
        );
        setWeeklyGames(response.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, []);

  const drawWeeklyGames = weeklyGames.map((item: WeeklyGame) => (
    <ListboxItem key={item.appid}>
      <Card
        isFooterBlurred
        isPressable
        key={item.appid}
        onPress={() => console.log("Card Pressed")}
      >
        <Image
          removeWrapper
          alt={item.name}
          className="z-0 w-full h-full object-cover"
          src={getImageURL(String(item.appid))}
        />

        <CardFooter className="justify-start bg-black/40 py-1 absolute before:rounded-xl rounded-small bottom-1 w-[calc(100%_-_10px)] ml-1 ">
          <p className="text-small text-white">{item.name}</p>
        </CardFooter>
      </Card>
    </ListboxItem>
  ));

  const drawTopGames = mostPlayedGames.map((item: WeeklyGame) => (
    <ListboxItem key={item.appid}>
      <Card
        isFooterBlurred
        isPressable
        key={item.appid}
        onPress={() => console.log("Card Pressed")}
      >
        <Image
          removeWrapper
          alt={item.name}
          className="z-0 w-full h-full object-cover"
          src={getImageURL(String(item.appid))}
        />

        <CardFooter className="justify-start bg-black/40 py-1 absolute before:rounded-xl rounded-small bottom-1 w-[calc(100%_-_10px)] ml-1 ">
          <p className="text-small text-white">{item.name}</p>
        </CardFooter>
      </Card>
    </ListboxItem>
  ));

  return (
    <>
      <div className="grid grid-cols-1 gap-4 mx-auto p-2">
        <div id="description" className="w-full text-white">
          <HomeDescription />
        </div>
        <div id="game-view" className="w-full">
          <GameView />
        </div>
        <div id="games">
          <div className="flex flex-rows mt-4 w-full">
            <div>
              {mostPlayedGames.length > 0 ? (
                <Listbox
                  //selectedKeys={selectedKeys}
                  //onSelectionChange={handleSelectionChange}
                  topContent={
                    <p className="text-white">
                      Top Games by Concurrent Players
                    </p>
                  }
                  className="p-0 gap-0 divide-y overflow-visible shadow-small rounded-medium w-1/2"
                  disallowEmptySelection
                  hideSelectedIcon
                  variant="bordered"
                  color="default"
                  label="Selected Game"
                  selectionMode="single"
                >
                  {/*List Items*/}
                  {drawTopGames}
                </Listbox>
              ) : (
                <p>No Top Games</p>
              )}
            </div>
            <div>
              {drawWeeklyGames.length > 0 ? (
                <Listbox
                  //selectedKeys={selectedKeys}
                  //onSelectionChange={handleSelectionChange}
                  topContent={
                    <p className="text-white">Top Games of the Week</p>
                  }
                  className="p-0 gap-0 divide-y overflow-visible shadow-small rounded-medium w-1/2"
                  disallowEmptySelection
                  hideSelectedIcon
                  variant="bordered"
                  color="default"
                  label="Selected Game"
                  selectionMode="single"
                >
                  {/*List Items*/}
                  {drawWeeklyGames}
                </Listbox>
              ) : (
                <p>No Weekly Games</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Home;
