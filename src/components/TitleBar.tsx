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
        <AppBar position="static">
            <Toolbar>
            <img className = "title-image" src = {getImageURL(String(props.currentGame.appid))} alt = {'Image for appid ' + props.currentGame.appid}/>
            <Typography className = "title-name" variant = "h5">{props.currentGame ? props.currentGame.name : "No Game Selected"}</Typography>
            </Toolbar>
        </AppBar>
    )
}

export default TitleBar;