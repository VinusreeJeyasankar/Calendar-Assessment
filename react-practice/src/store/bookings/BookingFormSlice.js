import { createSlice, createSelector } from "@reduxjs/toolkit";
import moment from "moment";

export const bookingFormSlice = createSlice({
  name: "bookingForm", // slice name in store
  initialState: {
    userName: "",
    selectedRecruiter: null,
    selectedDate: new Date().toISOString(),
    title: "",
    message: "",
    slotTime: moment().format("HH:mm"), // Set slotTime to current time
  },
  reducers: {
    setFormField: (state, action) => {
      const { field, value } = action.payload; // username and its value 'John Patterson'
      state[field] = value; // state - all initailstates, field is username, message, title, slotTime,....
    },
  },
});

export const { setFormField } = bookingFormSlice.actions;
export const selectFormField = (field) => createSelector(
  state => state.bookingForm[field],
  fieldValue => fieldValue
);
export default bookingFormSlice.reducer;
