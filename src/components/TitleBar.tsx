import {AppBar, Toolbar, Typography} from "@mui/material";
import {Game} from "../interfaces/types.tsx"
import "../styles/TitleBar.css"

interface TitleBarProps {
    currentGame : Game;
}

const imageURL: string = "https://cdn.akamai.steamstatic.com/steam/apps/";
const imageURLEnd: string = "/header.jpg";

//Get the id numbers for each image (better suited for item)
function getImageURL(id: string) {
    return imageURL + id + imageURLEnd;
}

function TitleBar(props : TitleBarProps) {
    return(
        <AppBar className = "title-toolbar" position="static">
            <Toolbar >
            <img className = "title-image" src = {getImageURL(String(props.currentGame.appid))} alt = {'Image for appid ' + props.currentGame.appid}/>
            <Typography className = "title-name" variant = "h5">{props.currentGame ? props.currentGame.title : "No Game Selected"}</Typography>
            <Typography className = "title-playtime" variant="h6">Playtime: {(props.currentGame.playtime / 60).toFixed(1)} hours</Typography>
            <Typography className = "title-unlocked" variant="h6">Percentage Unlocked: </Typography> {/*Look up context or just lift it from AchievementList*/}

            </Toolbar>
        </AppBar>
    )
}

export default TitleBar;