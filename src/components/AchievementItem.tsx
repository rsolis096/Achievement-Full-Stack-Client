import { TotalAchievement, Game } from "../interfaces/types";
import {Grid, Paper, Typography} from "@mui/material";
import "../styles/AchievementItem.css";


interface AchievementItemProps {
  data: TotalAchievement;
  game: Game;
}

function AchievementItem(props: AchievementItemProps) {
  return (
    <>
        {/* Entire Card */}
        <Paper elevation={3} className="achievement-card" style={{ padding: '16px', marginBottom: '16px' }} key={props.data.apiname}>
            {/* Image Section */}
            <Grid item xs={12} sm={2} >
              <img className="ach-image"
                  src={props.data.achieved === 1 ? props.data.gameData?.icon : props.data.gameData?.icongray}
                  alt={props.data.gameData?.displayName}
              />
            </Grid>

            {/* Body Section */}
            <Grid item xs={12} sm={6} className="achievement-description">
              <Typography variant="h6">{props.data.gameData?.displayName}</Typography>
              <Typography variant="body1">{props.data.gameData?.description}</Typography>
            </Grid>

            {/* Unlock Info Section */}
            <Grid item xs={12} sm={4} className="achievement-unlock-info">
                <Typography variant="body2">Unlocked: {props.data.achieved === 1 ? "True" : "False"}</Typography>
                <Typography variant="body2">Percentage: {props.data.globalData?.percent}</Typography>
                <Typography variant="body2">Game: {props.data.gameData?.name}</Typography>
                <Typography variant="body2">User: {props.data.apiname}</Typography>
                <Typography variant="body2">Global: {props.data.globalData?.name}</Typography>

            </Grid>
      </Paper>
    </>
  );
}

export default AchievementItem;
