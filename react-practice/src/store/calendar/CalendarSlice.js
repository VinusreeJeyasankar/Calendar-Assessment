// calendarSlice.js

import { createSlice } from "@reduxjs/toolkit";

const calendarSlice = createSlice({
  name: "calendar",
  initialState: {
    events: [], // Initial state for events
    isModalOpen: false,
    isEventModal: false,
    eventDetailsMode: false,
    view: "dayGridMonth",
  },
  reducers: {
    setEvents: (state, action) => {
      // Convert dates to strings before setting in state
      console.log("Setting events:", action.payload);
      state.events = action.payload;
    },
    setIsModalOpen: (state, action) => {
      state.isModalOpen = action.payload; // Set the events in the state
    },
    setIsEventModal: (state, action) => {
      state.isEventModal = action.payload; // Set the events in the state
    },
    setEventDetailsMode: (state, action) => {
      state.eventDetailsMode = action.payload; // Set the events in the state
    },
    setView: (state, action) => {
      state.view = action.payload; // Set the events in the state
    }
  },
});

export const { setEvents, setIsModalOpen, setIsEventModal, setEventDetailsMode, setView } = calendarSlice.actions;
export default calendarSlice.reducer;
