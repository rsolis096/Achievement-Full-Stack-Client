import { createContext } from "react";

import { SteamUserContextType } from "../interfaces/types";

// Create the context with default values
export const SteamUserContext = createContext<SteamUserContextType>({
  user: {
    authenticated: false,
    id: "none",
    displayName: "none",
    photos: [],
  },
  setUser: () => {},
});
