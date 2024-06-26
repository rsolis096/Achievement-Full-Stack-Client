import { createContext } from "react";
import { DemoContextType } from "../interfaces/types";

//Demo mode context
export const DemoContext = createContext<DemoContextType>({
  demoModeOn: false,
  setDemoMode: () => {},
});
