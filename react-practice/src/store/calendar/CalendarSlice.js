// calendarSlice.js

import { createSlice } from "@reduxjs/toolkit";

const updateState = (key) => (state, action) => {
  state[key] = action.payload;
};

const calendarSlice = createSlice({
  name: "calendar",
  initialState: {
    events: [], // Initial state for events
    // groupedEvents: {}, // New state to store grouped events
    isModalOpen: false,
    isEventModal: false,
    eventDetailsMode: false,
    view: "dayGridMonth",
  },
  reducers: {
    setEvents: updateState('events'),
    // setGroupedEvents: updateState('groupedEvents'),
    setIsModalOpen: updateState('isModalOpen'),
    setIsEventModal: updateState('isEventModal'),
    setEventDetailsMode: updateState('eventDetailsMode'),
    setView: updateState('view'),
  },
});

export const {
  setEvents,
  // setGroupedEvents,
  setIsModalOpen,
  setIsEventModal,
  setEventDetailsMode,
  setView,
} = calendarSlice.actions;
export const calendarReducer = calendarSlice.reducer;
