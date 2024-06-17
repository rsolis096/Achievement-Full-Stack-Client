export interface Game {
  appid: number;
  name: string;
  playtime_forever: number;
  has_community_visible_stats: boolean;
}

export interface GlobalAchievement{
  name : string;
  percent: number;
}

export interface GameAchievement {
  name: string;
  displayName: string;
  hidden: number
  description: string;
  icon: string;
  icongray: string;
}

export interface UserAchievement {
  apiname: string;
  achieved: number;
  unlocktime: number;
}

export interface TotalAchievement {
  apiname: string;
  achieved: number;
  unlocktime: number;

  globalData?: GlobalAchievement
  gameData? : GameAchievement
}


export interface SteamUser {
  authenticated: boolean,
  id: string;
  displayName: string;
  photos: Photo[];
}

export interface Photo{
  value: string
}
