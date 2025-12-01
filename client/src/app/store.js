import { configureStore } from "@reduxjs/toolkit";
import nhlTeamsReducer from "../features/nhlTeamsSlice";

export const store = configureStore({
  reducer: {
    nhlTeams: nhlTeamsReducer,
  },
});
