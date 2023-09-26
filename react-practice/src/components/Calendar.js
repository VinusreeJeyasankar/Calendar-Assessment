import React, { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  setEvents,
  setIsModalOpen,
  setIsEventModal,
  setEventDetailsMode,
  setView
} from "../store/calendar/CalendarSlice";
import { formatDate } from "../utils/helper/dateHelper";
import "bootstrap/dist/css/bootstrap.min.css";
import "../assets/css/calendar.css";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import BookModal from "./BookModal";


const currentDate = formatDate(new Date());
currentDate.setDate(currentDate.getDate() - 1); // Subtract one day

function Calendar() {
  const dispatch = useDispatch();
  const events = useSelector((state) => state.calendar.events);
  const isModalOpen = useSelector((state) => state.calendar.isModalOpen);
  const isEventModal = useSelector((state) => state.calendar.isEventModal);
  const eventDetailsMode = useSelector(
    (state) => state.calendar.eventDetailsMode
  );
  const view = useSelector((state) => state.calendar.view);

  const [selectedEvent, setSelectedEvent] = useState(null);
  const [clickedDate, setClickedDate] = useState(currentDate); // Add state for clicked date
  const calendarRef = useRef(null);

  useEffect(() => {
    const storedBookings = JSON.parse(localStorage.getItem("bookings")) || [];
    const formattedEvents = storedBookings.map((booking) => ({
      title: booking.title,
      start: formatDate(booking.slotTime),
    }));
    dispatch(setEvents(formattedEvents));
    console.log("formattedEvents: ", formattedEvents);
  }, [dispatch]);

  const handleBookSlotClick = () => {
    dispatch(setIsModalOpen(true));
    dispatch(setIsEventModal(false));
    dispatch(setEventDetailsMode(false)); // Automatically show event details mode
  };

  const handleCloseModal = () => {
    dispatch(setIsModalOpen(false));
  };

  // Click event - for selected Dates
  const handleDateClick = (arg) => {
    const clickedDate = formatDate(arg.date);
    // Check if the clicked date is a Friday (day 5)
    if (clickedDate.getDay() === 5) {
      return; // Do nothing if it's a Friday
    }
    const today = new Date();
    today.setDate(today.getDate() - 1); // Subtract one day

    // Check if the clicked date is in the past
    if (clickedDate < today) {
      // If it's in the past, prevent further actions
      return;
    }

    setClickedDate(clickedDate); // Update clicked date

    // Remove background from previously selected date
    const prevSelectedDateEl = document.querySelector(".clicked-date");
    if (prevSelectedDateEl) {
      prevSelectedDateEl.classList.remove("clicked-date");
    }

    // Check if there are no bookings scheduled for the clicked date
    const hasNoBookings = events.every(
      (event) =>
        new Date(event.start).toISOString() !== clickedDate.toISOString()
    );

    if (hasNoBookings) {
      // If there are no bookings, display a message in the modal

      setSelectedEvent({
        title: "No booking is scheduled for today!!",
        start: clickedDate,
        bookings: [],
        slotTime: new Date(), // Set a default slot time (you may adjust this as needed)
      });

      dispatch(setIsEventModal(true));
      dispatch(setIsModalOpen(true));
      dispatch(setEventDetailsMode(true)); // Automatically show event details mode

      // Set the default slotTime to the selected date and time
      const defaultSlotTime = new Date();

      setSelectedEvent((prevEvent) => ({
        ...prevEvent,
        slotTime: defaultSlotTime,
      }));

      // Add a class to the clicked date's element
      arg.dayEl.classList.add("clicked-date");
    }
  };

  const handleDayCellDidMount = (arg) => {
    const cellDate = arg.date;

    // Disable Fridays (day 5)
    if (cellDate.getDay() === 5) {
      arg.el.classList.add("fc-read-only");
      arg.el.innerHTML = "Holiday";
      arg.el.classList.add("holiday-msg");
      arg.el.title = "Holiday";
    }

    // Disable past dates (except current date)
    if (cellDate < currentDate) {
      arg.el.classList.add("fc-past");
      arg.el.classList.add("fc-past-bg");
      arg.el.title = "Past Date";
    }
  };

  const handleEventClick = (arg) => {
    const clickedEvent = arg.event;

    if (!clickedEvent) {
      console.error("Event data not found");
      return;
    }

    // Retrieve all the booked details for the clicked event from local storage
    const storedBookings = JSON.parse(localStorage.getItem("bookings")) || [];
    const matchingBookings = storedBookings.filter((booking) => {
      return (
        booking.title === clickedEvent.title &&
        formatDate(new Date(booking.slotTime)).getTime() === clickedEvent.start.getTime()
      );
    });

    // Set the selected event data with all the booked details
    setSelectedEvent({
      title: clickedEvent.title,
      start: clickedEvent.start,
      bookings: matchingBookings,
    });
    dispatch(setIsEventModal(true));
    dispatch(setIsModalOpen(true));
    dispatch(setEventDetailsMode(true)); // Automatically show event details mode
  };

  //function to update eventDetailsMode
  const updateEventDetailsMode = (mode) => {
    dispatch(setEventDetailsMode(mode));
  };

  const handleViewToggle = () => {
    const newView = view === "dayGridMonth" ? "dayGridWeek" : "dayGridMonth";
    dispatch(setView(newView));
    calendarRef.current.getApi().changeView(newView);
  };

  function getCustomTitle() {
    // Create a new Date object for yesterday's date
    const today = new Date();
    // Check if the clickedDate is earlier than today's date
    if (clickedDate < today) {
      const day = today.getDate().toString().padStart(2, "0");
      const month = (today.getMonth() + 1).toString().padStart(2, "0"); // Month is 0-indexed
      const year = today.getFullYear();
      return `${day}-${month}-${year}`;
    } else {
      const day = clickedDate.getDate().toString().padStart(2, "0");
      const month = (clickedDate.getMonth() + 1).toString().padStart(2, "0"); // Month is 0-indexed
      const year = clickedDate.getFullYear();
      return `${day}-${month}-${year}`;
    }
  }

  // console.log("selectedEvent", selectedEvent);
  return (
    <div>
      <h2 className="heading">Appointment Booking</h2>
      <div className="row">
        <div id="calendarArea" className="col-md-12 justify-content-center">
          <FullCalendar
            ref={calendarRef}
            plugins={[dayGridPlugin, interactionPlugin]}
            initialView={view}
            headerToolbar={{
              left: "prev,next today",
              center: "title customTitle", // Use custom title format
              right: "bookSlotButton viewToggle", // Add viewToggle button
            }}
            customButtons={{
              bookSlotButton: {
                text: "Book Slot",
                className: "btn btn-primary",
                click: handleBookSlotClick,
              },
              viewToggle: {
                text: "Toggle View",
                click: handleViewToggle, // Toggle view on click
              },
              customTitle: {
                text: getCustomTitle(), // Use a function to generate the title
              },
            }}
            dateClick={handleDateClick}
            dayCellDidMount={handleDayCellDidMount}
            events={events}
            eventClick={handleEventClick}
          />
        </div>
      </div>
      {selectedEvent && (
        <BookModal
          show={isModalOpen}
          handleClose={handleCloseModal}
          eventData={selectedEvent}
          isBookSlotModal={!isEventModal}
          clickedDate={clickedDate}
          eventDetailsMode={eventDetailsMode}
          setEventDetailsMode={setEventDetailsMode}
          updateEventDetailsMode={updateEventDetailsMode}
        />
      )}
    </div>
  );
}

export default Calendar;
