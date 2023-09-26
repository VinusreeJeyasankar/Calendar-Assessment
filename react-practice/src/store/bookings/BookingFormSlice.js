import { createSlice } from "@reduxjs/toolkit";

export const bookingFormSlice = createSlice({
  name: "bookingForm", // slice name in store
  initialState: {
    userName: "",
    selectedRecruiter: null,
    selectedDate: new Date(),
    title: "",
    message: "",
    slotTime: null,
  },
  reducers: {
    setFormField: (state, action) => {
      const { field, value } = action.payload; // username and its value 'John Patterson'
      state[field] = value; // state - all initailstates, field is username, message, title, slotTime,....
    },
  },
});

export const { setFormField } = bookingFormSlice.actions;
export const selectFormField = (field) => (state) => state.bookingForm[field];
export default bookingFormSlice.reducer;
