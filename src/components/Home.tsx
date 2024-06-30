//Utility
import { useEffect, useState } from "react";
import axios, { AxiosResponse } from "axios";
import { useNavigate } from "react-router-dom";

//Types
import { WeeklyGame } from "../interfaces/types";

//Components
import HomeDescription from "./HomeDescription";

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
  const navigate = useNavigate();

  //Fetch homescreen game info
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

  const handleCardPressed = (appid: number) => {
    navigate("/view/" + appid);
  };

  const drawWeeklyGames = weeklyGames.map((item: WeeklyGame) => (
    <ListboxItem key={item.appid}>
      <Card
        isFooterBlurred
        isPressable
        key={item.appid}
        onPress={() => handleCardPressed(item.appid)}
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
        onPress={() => handleCardPressed(item.appid)}
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
      <div className="flex flex-col gap-4 mx-auto p-2">
        <div id="description" className="w-full text-white">
          <HomeDescription />
        </div>
        <div id="list-box-grid" className="grid grid-cols-2 mt-4 gap-10 w-1/2 ">
          <div className=" mt-2 shadow-lg rounded-lg  p-1 bg-foregroundColor/40  border-white/20 border-2 ">
            <p className="text-white">Top Games by Concurrent Players</p>
            {mostPlayedGames.length > 0 ? (
              <Listbox
                className="divide-y rounded-medium overflow-auto custom-scrollbar h-screen "
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
          <div className=" mt-2 shadow-lg rounded-lg  p-1 bg-foregroundColor/40  border-white/20 border-2 ">
            <p className="text-white">Top Games of the Week</p>
            {drawWeeklyGames.length > 0 ? (
              <Listbox
                className="divide-y rounded-medium overflow-auto custom-scrollbar h-screen "
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
    </>
  );
}

export default Home;
