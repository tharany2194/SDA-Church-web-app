import { createSlice } from '@reduxjs/toolkit';

const uiSlice = createSlice({
  name: 'ui',
  initialState: {
    language: 'en', // 'en' | 'ta'
    isMobileMenuOpen: false,
  },
  reducers: {
    setLanguage(state, action) {
      state.language = action.payload;
    },
    toggleMobileMenu(state) {
      state.isMobileMenuOpen = !state.isMobileMenuOpen;
    },
    closeMobileMenu(state) {
      state.isMobileMenuOpen = false;
    },
  },
});

export const { setLanguage, toggleMobileMenu, closeMobileMenu } = uiSlice.actions;
export default uiSlice.reducer;
