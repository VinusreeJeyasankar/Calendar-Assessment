// store.js
import { configureStore } from '@reduxjs/toolkit';
import calendarReducer from './CalendarSlice.js';

const store = configureStore({
  reducer: {
    calendar: calendarReducer,
  },
});

export default store;
