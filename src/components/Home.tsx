//Utility
import { useEffect, useState } from "react";
import axios, { AxiosResponse } from "axios";

//Types
import { WeeklyGame } from "../interfaces/types";

//Styles
import { Image, Card, CardFooter } from "@nextui-org/react";

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
    <Card
      isFooterBlurred
      isPressable
      key={item.appid}
      className="flex-none w-1/4"
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
  ));

  const drawTopGames = mostPlayedGames.map((item: WeeklyGame) => (
    <Card
      isFooterBlurred
      isPressable
      key={item.appid}
      className="flex-none w-1/4"
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
  ));

  return (
    <>
      <p className="text-white">Popular Right Now</p>
      <div
        id="slider"
        className="overflow-x-auto flex w-full gap-2 custom-scrollbar mt-1"
      >
        {mostPlayedGames.length > 0 && drawTopGames}
      </div>

      <p className="text-white">Top 20 Weekly</p>
      <div
        id="slider"
        className="overflow-x-auto flex w-full gap-2 custom-scrollbar mt-1"
      >
        {weeklyGames.length > 0 && drawWeeklyGames}
      </div>
    </>
  );
}

export default Home;
