// calendarSlice.js

import { createSlice } from "@reduxjs/toolkit";

const updateState = (key) => (state, action) => {
  state[key] = action.payload;
};

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
    setEvents: updateState('events'),
    setIsModalOpen: updateState('isModalOpen'),
    setIsEventModal: updateState('isEventModal'),
    setEventDetailsMode: updateState('eventDetailsMode'),
    setView: updateState('view'),
  },
});

export const {
  setEvents,
  setIsModalOpen,
  setIsEventModal,
  setEventDetailsMode,
  setView,
} = calendarSlice.actions;
export const calendarReducer = calendarSlice.reducer;
