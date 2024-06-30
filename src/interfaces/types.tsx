export interface OwnedGame {
  appid: number;
  name: string;
  playtime_forever: number;
  has_community_visible_stats: boolean;
}

export interface App {
  appid: number;
  name: string;
  type: string;
  ownerData?: OwnedGame;
}

export interface GameAchievement {
  internal_name: string;
  localized_name: string;
  localized_desc: string;
  icon: string;
  icon_gray: string;
  hidden: boolean;
  player_percent_unlocked: string;
}

export interface UserAchievement {
  apiname: string;
  achieved: number;
  unlocktime: number;
}

export interface TotalAchievement {
  userData: UserAchievement;
  gameData?: GameAchievement;
}

export interface SteamUser {
  authenticated: boolean;
  id: string;
  displayName: string;
  photos: Photo[];
}

export interface Photo {
  value: string;
}

export interface SteamUserContextType {
  user: SteamUser;
  setUser: (user: SteamUser) => void;
}

export interface DemoContextType {
  demoModeOn: boolean;
  setDemoMode: (value: boolean) => void;
}

export interface WeeklyGame {
  appid: number;
  name: string;
  rank: number;
}
