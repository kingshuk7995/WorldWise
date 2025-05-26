import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

const Theme = {
  Light: 0,
  Dark: 1,
} as const;

type Theme = typeof Theme[keyof typeof Theme];

interface ThemeState {
  theme: Theme;
}

const initialState: ThemeState = {
  theme: Theme.Dark,
};

const themeSlice = createSlice({
  name: 'theme',
  initialState,
  reducers: {
    toggleTheme: (state) => {
      state.theme = state.theme === Theme.Dark ? Theme.Light : Theme.Dark;
    },
    setTheme: (state, action: PayloadAction<Theme>) => {
      state.theme = action.payload;
    },
  },
});

export const { toggleTheme, setTheme } = themeSlice.actions;
export { Theme };
export default themeSlice.reducer;
