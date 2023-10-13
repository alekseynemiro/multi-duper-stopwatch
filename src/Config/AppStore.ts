import { useDispatch } from "react-redux";
import { ColorPalette, LayoutMode } from "@data";
import { configureStore, createSlice, PayloadAction } from "@reduxjs/toolkit";

export type AppCommonState = {

  showConfigButton: boolean;

  showConfigModal: boolean;

  layoutMode: LayoutMode;

  colorized: boolean;

  color: ColorPalette | null;

};

const appCommonInitialState: AppCommonState = {
  showConfigButton: false,
  showConfigModal: false,
  layoutMode: LayoutMode.Default,
  colorized: false,
  color: null,
};

const appCommonSlice = createSlice({
  name: "common",
  initialState: appCommonInitialState,
  reducers: {
    showConfigButton: (state: AppCommonState): void => {
      state.showConfigButton = true;
    },
    hideConfigButton: (state: AppCommonState): void => {
      state.showConfigButton = false;
    },
    showConfigModal: (state: AppCommonState): void => {
      state.showConfigModal = true;
    },
    hideConfigModal: (state: AppCommonState): void => {
      state.showConfigModal = false;
    },
    setLayoutModeToDefault: (state: AppCommonState): void => {
      state.layoutMode = LayoutMode.Default;
    },
    setLayoutModeToTiles: (state: AppCommonState): void => {
      state.layoutMode = LayoutMode.Tiles;
    },
    setLayoutModeToStack: (state: AppCommonState): void => {
      state.layoutMode = LayoutMode.Stack;
    },
    setColor: (state: AppCommonState, action: PayloadAction<ColorPalette>): void => {
      state.color = action.payload;
    },
    resetColor: (state: AppCommonState): void => {
      state.color = null;
    },
    enableColorizedMode: (state: AppCommonState): void => {
      state.colorized = true;
    },
    disableColorizedMode: (state: AppCommonState): void => {
      state.colorized = false;
    },
  },
});

export const appStore = configureStore({
  reducer: {
    common: appCommonSlice.reducer,
  },
});

export type AppState = ReturnType<typeof appStore.getState>;
export type AppDispatch = typeof appStore.dispatch;
export type AppActions = typeof appCommonSlice.actions;
export const useAppDispatch = useDispatch;
export const useAppActions = (): AppActions => appCommonSlice.actions;
