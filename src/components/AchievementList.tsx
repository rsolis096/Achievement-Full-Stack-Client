import {useEffect, useState} from "react";

import AchievementItem from "./AchievementItem";

import axios, {AxiosResponse} from "axios";

import {Game, GameAchievement, GlobalAchievement, TotalAchievement, UserAchievement,} from "../interfaces/types";

import "../styles/AchievementList.css";


interface AchievementListProps {
    //The current selected Game
    game: Game;
    //Some Filter properties
    visibleItems: boolean[];
    sort: number;
}

function AchievementList(props: AchievementListProps) {

    //This state variable holds all the combined achievement data
    const [totalAchievementData, setTotalAchievementData] = useState<
    TotalAchievement[]
    >([]);


    const [loading, setLoading] = useState(true);

    //Make a post request to the server to get user achievement info
    const postUserAchievementData = async () : Promise<UserAchievement[]>  => {
        try{
            const response: AxiosResponse<TotalAchievement[]> = await axios.post(
                import.meta.env.VITE_SERVER_DOMAIN+"/api/achievements/getUserAchievements",
                {
                    appid: props.game.appid,
                    headers: {"Content-Type": "application/json"}
                },
                {
                    withCredentials : true
                }
            );
            return response.data
        } catch(err) {
        console.log(err)
    }
    return [];
    };

    //Make a post request to the server to get global achievement info
    const postGlobalAchievementData = async () : Promise<GlobalAchievement[]>  => {
        try {
            const response: AxiosResponse<GlobalAchievement[]> = await axios.post(
                import.meta.env.VITE_SERVER_DOMAIN + "/api/achievements/getGlobalAchievements",
                {
                    appid: props.game.appid,
                    headers: {"Content-Type": "application/json"}
                },
                {
                    withCredentials : true
                }
            );
            return response.data;
        } catch(err) {
            console.log(err)
        }
        return [];
    };

    //Gets general achievement info. Includes stuff like icons and hidden type
    const postGameAchievementData = async () : Promise<GameAchievement[]>  => {
        try {
            const response: AxiosResponse<GameAchievement[]> = await axios.post(
                import.meta.env.VITE_SERVER_DOMAIN + "/api/achievements/getGameAchievements",
                {
                    appid: props.game.appid,
                    headers: {"Content-Type": "application/json"}
                },
                {
                    withCredentials : true
                }
            );
            return response.data;
        } catch(err) {
            console.log(err)
        }
        return [];
    };

    useEffect(() => {
        const fetchData = async () => {
            //fetch user and global achievement data
            const userAchievements: UserAchievement[] = await postUserAchievementData();
            const globalAchievements: GlobalAchievement[] = await postGlobalAchievementData();
            const gameAchievements: GameAchievement[] = await postGameAchievementData()

            //Set loading to false once everything has been fetched and set
            setLoading(false);

            // Combine data after all fetches are complete (needed to properly render
            if (userAchievements.length > 0 && globalAchievements.length > 0) {
                const combinedData: TotalAchievement[] = userAchievements.map((userAchievement) => {

                    const globalAchievement = globalAchievements.find(
                        (ga) => (ga.name == userAchievement.apiname)
                    );

                    return {
                        ...userAchievement,
                        globalData: globalAchievement,
                        gameData: gameAchievements.find(item => item.name == userAchievement.apiname)
                    };
                });
                setTotalAchievementData(combinedData);
            }

        };

        fetchData();
    }, []);

    //Wait until totalData has been completed
    if (loading) {
        if(!props.game.has_community_visible_stats){
            return <div style ={{"color" : "white"}}>No achievements associated with this title.</div>;
        }
        else{
            return <div style ={{"color" : "white"}}>Loading...</div>;
        }
    }


    //Render achievement list
    return (
        <>
            {totalAchievementData.length > 0 && !loading ? (
                <div>
                    {/*Sort the Achievement Data */}
                    {totalAchievementData
                        .sort((a, b) => {

                            if (props.sort == -1 || props.sort == 0){
                                return (a.globalData?.percent ?? 0) - (b.globalData?.percent ?? 0)
                            }
                            if (props.sort == 1){
                                return (b.globalData?.percent ?? 0) - (a.globalData?.percent ?? 0)
                            }
                            return 0;
                        })
                        //hide locked achievements
                        .filter((item) => {
                            //If the item is unlocked, check if it should be returned
                            if (item.achieved == 1 ){
                                return !props.visibleItems[1]
                            }
                            if (item.achieved == 0 ){
                                return !props.visibleItems[0]
                            }

                        })
                        .map((a) => <AchievementItem key={a.apiname} data={a} game = {props.game}/>)
                    }
                </div>
            ) : <div>No user achievements found.</div>}
        </>
    );
}

export default AchievementList;

