// store.js
import { configureStore } from '@reduxjs/toolkit';
import calendarReducer from './CalendarSlice';

const store = configureStore({
  reducer: {
    calendar: calendarReducer,
  },
});

export default store;
