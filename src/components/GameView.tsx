import { useParams } from "react-router-dom";

//Components
import GlobalAchievementList from "./GlobalComponents/GlobalAchievementList";

function GameView() {
  const { appid } = useParams<string>();

  return (
    <>
      {/* Main Content Area */}
      <div className="flex flex-row gap-2 w-full h-screen p-2 overflow-hidden">
        {/*Achievements List Area*/}
        <div className="bg-foregroundColor  md:w-8/12 lg:w-9/12 xl:w-11/12 shadow-lg p-2  rounded-lg	border-white/20	 border-2 h-dvh">
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
