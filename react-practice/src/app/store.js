import { configureStore } from "@reduxjs/toolkit";
import bookingFormReducer from "../features/bookings/BookingFormSlice";

const store = configureStore({
  reducer: {
    bookingForm: bookingFormReducer,
  },
});

export default store;
