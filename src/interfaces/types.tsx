export interface OwnedGame {
  appid: number;
  name: string;
  playtime_forever: number;
  has_community_visible_stats: boolean;
  tracking?: boolean;
}

export interface App {
  appid: number;
  name: string;
  type: string;
  detailed_app?: {
    legal_notice: string;
    publishers: string[];
    developers: string[];
    release_date: string;
    price_overview?: {
      currency: string;
      final_formatted: string;
      initial_formatted: string;
    };
    achievements?: {
      total: number;
    };
  };
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

export interface RankedGame {
  appid: number;
  name: string;
  rank: number;
}
