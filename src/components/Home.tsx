//Utility
import { useEffect, useState } from "react";
import axios, { AxiosResponse } from "axios";

//Types
import { RankedGame } from "../interfaces/types";

//Components
import HomeDescription from "./HomeDescription";
import HomePageTable from "./HomePageTable";

function Home() {
  const [mostPlayedGames, setMostPlayedGames] = useState<RankedGame[]>([]);
  const [weeklyGames, setWeeklyGames] = useState<RankedGame[]>([]);

  //Fetch homescreen game info
  useEffect(() => {
    const fetchData = async () => {
      //Most Played Games
      try {
        const response: AxiosResponse<RankedGame[]> = await axios.get(
          import.meta.env.VITE_SERVER_DOMAIN + "/api/games/getMostPlayedGames"
        );
        setMostPlayedGames(response.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }

      //Best Selling Weekly Games
      try {
        const response: AxiosResponse<RankedGame[]> = await axios.get(
          import.meta.env.VITE_SERVER_DOMAIN + "/api/games/getTopWeekly"
        );
        setWeeklyGames(response.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, []);

  return (
    <>
      <div className="flex flex-col gap-4 mx-auto p-2 w-screen">
        <div id="description" className=" text-white text-center">
          <HomeDescription />
        </div>

        <div className="flex flex-col 2xl:flex-row lg:flex-row sm:flex-row md:flex-row gap-4 ">
          <HomePageTable rows={weeklyGames} title="Top Games of the Week" />
          <HomePageTable
            rows={mostPlayedGames}
            title="Top Games by Concurrent Players"
          />
        </div>
      </div>
    </>
  );
}

export default Home;
