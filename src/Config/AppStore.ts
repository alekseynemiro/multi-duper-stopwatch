import { useDispatch } from "react-redux";
import { LayoutMode } from "@data";
import { configureStore, createSlice } from "@reduxjs/toolkit";

export type AppHeaderState = {

  showConfigButton: boolean;

  layoutMode: LayoutMode;

};

const headerInitialState: AppHeaderState = {
  showConfigButton: false,
  layoutMode: LayoutMode.Default,
};

const headerSlice = createSlice({
  name: "header",
  initialState: headerInitialState,
  reducers: {
    showConfigButton: (state: AppHeaderState): void => {
      state.showConfigButton = true;
    },
    hideConfigButton: (state: AppHeaderState): void => {
      state.showConfigButton = false;
    },
    setLayoutModeToDefault: (state: AppHeaderState): void => {
      state.layoutMode = LayoutMode.Default;
    },
    setLayoutModeToTiles: (state: AppHeaderState): void => {
      state.layoutMode = LayoutMode.Tiles;
    },
    setLayoutModeToStack: (state: AppHeaderState): void => {
      state.layoutMode = LayoutMode.Stack;
    },
  },
});

export const appStore = configureStore({
  reducer: {
    header: headerSlice.reducer,
  },
});

export type AppState = ReturnType<typeof appStore.getState>;
export type AppDispatch = typeof appStore.dispatch;
export type AppHeaderActions = typeof headerSlice.actions;
export const useAppDispatch = useDispatch;
export const useAppHeaderActions = (): AppHeaderActions => headerSlice.actions;

