import {AppBar, Grid, Toolbar, Typography} from "@mui/material";
import {Game} from "../interfaces/types.tsx"
import "../styles/TitleBar.css"

//TODO: Make it so game percent complete shows up
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
                <Grid container alignItems = {"center"} justifyItems={"flex-start"}>

                    <Grid item xs>
                        <img className = "title-image" src = {getImageURL(String(props.currentGame.appid))} alt = {'Image for appid ' + props.currentGame.appid}/>
                    </Grid>

                    <Grid item xs>
                        <Typography className = "title-name" variant = "h5">{props.currentGame ? props.currentGame.name : "No Game Selected"}</Typography>
                    </Grid>

                    <Grid item xs>
                        <Typography className = "title-playtime" variant="h6">Playtime: {(props.currentGame.playtime_forever / 60).toFixed(1)} hours</Typography>
                    </Grid>

                </Grid>
            </Toolbar>
        </AppBar>
    )
}

export default TitleBar;