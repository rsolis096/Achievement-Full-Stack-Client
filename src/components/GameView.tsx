import { useParams } from "react-router-dom";

//Components
import GlobalAchievementList from "./GlobalComponents/GlobalAchievementList";

function GameView() {
  const { appid } = useParams<string>();

  return (
    <>
      {/* Main Content Area */}
      <div className="flex flex-row gap-2 w-full h-screen p-2 justify-center">
        {/*Achievements List Area*/}
        <div className="bg-foregroundColor  w-full shadow-lg p-2  rounded-lg	border-white/20	 border-2 ">
          {/*Actual Achievement List*/}
          {appid && (
            <GlobalAchievementList key={appid} appid={parseInt(appid)} />
          )}
        </div>
      </div>
      ;
    </>
  );
}

export default GameView;
