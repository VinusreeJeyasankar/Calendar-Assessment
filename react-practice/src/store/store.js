import { configureStore } from "@reduxjs/toolkit";
import bookingFormReducer from "./bookings/BookingFormSlice";
import { calendarReducer } from "./calendar/CalendarSlice";

const store = configureStore({
  reducer: {
    bookingForm: bookingFormReducer,
    calendar: calendarReducer,
  },
});

export default store;
