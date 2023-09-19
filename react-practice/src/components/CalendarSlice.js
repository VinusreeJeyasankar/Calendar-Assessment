// calendarSlice.js
import { createSlice } from '@reduxjs/toolkit';

const calendarSlice = createSlice({
  name: 'calendar',
  initialState: {
    isModalOpen: false,
    events: [],
    selectedEvent: null,
    isEventModal: false,
    view: 'dayGridMonth',
  },
  reducers: {
    setModalOpen: (state, action) => {
      state.isModalOpen = action.payload;
    },
    setEvents: (state, action) => {
      state.events = action.payload;
    },
    setSelectedEvent: (state, action) => {
      state.selectedEvent = action.payload;
    },
    setEventModal: (state, action) => {
      state.isEventModal = action.payload;
    },
    setView: (state, action) => {
      state.view = action.payload;
    },
  },
});

export const {
  setModalOpen,
  setEvents,
  setSelectedEvent,
  setEventModal,
  setView,
} = calendarSlice.actions;
export default calendarSlice.reducer;
