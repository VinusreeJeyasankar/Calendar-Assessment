import { createSlice } from "@reduxjs/toolkit";

export const bookingFormSlice = createSlice({
  name: "bookingForm",
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
      const { field, value } = action.payload;
      state[field] = value;
    },
  },
});

export const { setFormField } = bookingFormSlice.actions;
export const selectFormField = (field) => (state) => state.bookingForm[field];
export default bookingFormSlice.reducer;
