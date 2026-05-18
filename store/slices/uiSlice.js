import { createSlice } from '@reduxjs/toolkit';

const uiSlice = createSlice({
  name: 'ui',
  initialState: {
    language: 'en', // 'en' | 'ta'
    isMobileMenuOpen: false,
    loginModalOpen: false,
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
    openLoginModal(state) {
      state.loginModalOpen = true;
    },
    closeLoginModal(state) {
      state.loginModalOpen = false;
    },
  },
});

export const { setLanguage, toggleMobileMenu, closeMobileMenu, openLoginModal, closeLoginModal } = uiSlice.actions;
export default uiSlice.reducer;
