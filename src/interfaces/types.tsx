export interface Achievement {
  name: string;
  icon: string;
  icongray: string;
  description: string;
  displayName: string;
}

export interface TotalAchievement {
  apiname: string;
  achieved: number;
  unlocktime: number;

  globaldata?: GlobalAchievement
  achievementinfo? : Achievement
}

export interface GlobalAchievement {
  name: string;
  percent: number;
}

//global_achievements is not included on the initial call and needs to be added when the game is selected
export interface Game {
  appid: number;
  title: string;
  playtime: number;
  has_community_visible_stats: boolean;
  global_achievements?: GlobalAchievement[];
}

export interface SteamUser {
  id: string;
  displayName: string;
  photos: string[];
}
