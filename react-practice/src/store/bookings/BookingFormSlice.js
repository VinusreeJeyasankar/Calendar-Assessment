import { createSlice, createSelector } from "@reduxjs/toolkit";

export const bookingFormSlice = createSlice({
  name: "bookingForm", // slice name in store
  initialState: {
    userName: "",
    selectedRecruiter: null,
    selectedDate: new Date().toISOString(),
    title: "",
    message: "",
    slotTime: new Date().setHours(9, 30),
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
