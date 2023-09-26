// calendarSlice.js

import { createSlice } from "@reduxjs/toolkit";
import { formatDate } from "../../utils/helper/dateHelper";

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
      state.events = action.payload.map(event => ({
        ...event,
        start: formatDate(event.start), // Assuming event.start is a Date object
      }));
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
    },
  },
});

export const { setEvents, setIsModalOpen, setIsEventModal, setEventDetailsMode, setView } = calendarSlice.actions;
export default calendarSlice.reducer;
