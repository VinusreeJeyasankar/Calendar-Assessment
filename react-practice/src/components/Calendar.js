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

// const staticEvents = [
//   {
//     title: "Event 1",
//     start: "2023-09-29T10:00:00", // Format: "YYYY-MM-DDTHH:mm:ss"
//   },
//   {
//     title: "Event 2",
//     start: "2023-09-29T14:00:00",
//   },
//   // Add more events as needed
// ];

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
      start: booking.slotTime,
    }));
    // const formattedEvents = staticEvents;
    dispatch(setEvents(formattedEvents));
    console.log("formattedEvents: ", formattedEvents);

  }, [dispatch]);

  const handleBookSlotClick = () => {
    dispatch(setIsModalOpen(true));
    dispatch(setIsEventModal(false)); 
    dispatch(setEventDetailsMode(false)); // Automatically hide event details mode
  };

  const handleCloseModal = () => {
    dispatch(setIsModalOpen(false));
  };

  // Click event - for selected Dates
  const handleDateClick = (arg) => {
    const clickedDate = new Date(arg.date);
  
    if (clickedDate.getDay() === 5) {
      return; // Do nothing if it's a Friday
    }
  
    const today = new Date();
    today.setDate(today.getDate() - 1); // Subtract one day
  
    if (clickedDate < today) {
      return; // If it's in the past, prevent further actions
    }
    setClickedDate(clickedDate);
    const prevSelectedDateEl = document.querySelector(".clicked-date");
    if (prevSelectedDateEl) {
      prevSelectedDateEl.classList.remove("clicked-date");
    }
  
    const matchingBookings = [];
  
    events.forEach((event) => {
      const eventDate = new Date(event.start);
      if (
        eventDate.getFullYear() === clickedDate.getFullYear() &&
        eventDate.getMonth() === clickedDate.getMonth() &&
        eventDate.getDate() === clickedDate.getDate()
      ) {
        const storedBookings = JSON.parse(localStorage.getItem("bookings")) || [];
        const matchingBooking = storedBookings.find((booking) => {
          return (
            booking.title === event.title &&
            booking.slotTime === event.start
          );
        });
    
        if (matchingBooking) {
          matchingBookings.push({
            title: matchingBooking.title,
            slotTime: matchingBooking.slotTime,
            userName: matchingBooking.userName,
            recruiter: matchingBooking.recruiter,
            message: matchingBooking.message,
          });
        }
      }
    });    
  
    if (matchingBookings.length > 0) {
      setSelectedEvent({
        title: `Booked Slots`,
        start: clickedDate,
        bookings: matchingBookings,
        slotTime: new Date(),
      });
  
      dispatch(setIsModalOpen(true));
      dispatch(setIsEventModal(true));
      dispatch(setEventDetailsMode(true));
  
      const defaultSlotTime = new Date();
  
      setSelectedEvent((prevEvent) => ({
        ...prevEvent,
        slotTime: defaultSlotTime,
      }));
  
      arg.dayEl.classList.add("clicked-date");
    } else {
      setSelectedEvent({
        title: "No booking is scheduled for today!!",
        start: clickedDate,
        bookings: [],
        slotTime: new Date(),
      });
  
      dispatch(setIsModalOpen(true));
      dispatch(setIsEventModal(true));
      dispatch(setEventDetailsMode(true));
  
      const defaultSlotTime = new Date();
  
      setSelectedEvent((prevEvent) => ({
        ...prevEvent,
        slotTime: defaultSlotTime,
      }));
  
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
    dispatch(setIsModalOpen(true));
    dispatch(setIsEventModal(true));
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
            events={events}
            // key={JSON.stringify(events)}
            eventClick={handleEventClick}
            dateClick={handleDateClick}
            dayCellDidMount={handleDayCellDidMount}
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
