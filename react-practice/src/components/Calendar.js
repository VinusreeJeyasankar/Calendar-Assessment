import React, { useState, useEffect, useRef } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../css/calendar.css';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import BookModal from './BookModal';

const currentDate = new Date();

function Calendar() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [events, setEvents] = useState([]); 
  const [selectedEvent, setSelectedEvent] = useState(null); 
  const [isEventModal, setIsEventModal] = useState(false); 
  const [view, setView] = useState('dayGridMonth'); // Default view is 'dayGridMonth'
  const calendarRef = useRef(null);

  useEffect(() => {
    const storedBookings = JSON.parse(localStorage.getItem('bookings')) || [];
    const formattedEvents = storedBookings.map((booking) => ({
      title: booking.title, 
      start: booking.slotTime, 
    }));
    setEvents(formattedEvents);
  }, []);

  const handleBookSlotClick = () => {
    setIsModalOpen(true);
    setIsEventModal(false); 
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleDateClick = (arg) => {
    if (arg.date.getDay() === 5) {
      return;
    }
  
    const clickedDate = arg.date;
  
    // Check if the clicked date is in the future
    if (clickedDate > currentDate) {
      // Check if there are no bookings scheduled for the clicked date
      const hasNoBookings = events.every((event) => (
        new Date(event.start).toISOString() !== clickedDate.toISOString()
      ));
  
      if (hasNoBookings) {
        // If there are no bookings, display a message in the modal
        setSelectedEvent({
          title: "No booking is scheduled for today!!",
          start: clickedDate,
          bookings: [],
        });
  
        setIsEventModal(true);
        setIsModalOpen(true);
      }
    }
  };  

  const handleDayCellDidMount = (arg) => {
    const cellDate = arg.date;
  
    // Disable Fridays (day 5)
    if (cellDate.getDay() === 5) {
      arg.el.classList.add('fc-read-only');
      arg.el.title = 'Holiday';
    }
  
    // Disable past dates (except current date)
    if (cellDate < currentDate && !isSameDay(cellDate, currentDate)) {
      arg.el.classList.add('fc-past');
      arg.el.title = 'Past Date';
    }
  };
  
  function isSameDay(date1, date2) {
    return (
      date1.getFullYear() === date2.getFullYear() &&
      date1.getMonth() === date2.getMonth() &&
      date1.getDate() === date2.getDate()
    );
  }  

  const handleEventClick = (arg) => {
    const clickedEvent = arg.event;
  
    if (!clickedEvent) {
      console.error('Event data not found');
      return;
    }
  
    // Retrieve all the booked details for the clicked event from local storage
    const storedBookings = JSON.parse(localStorage.getItem('bookings')) || [];
    const matchingBookings = storedBookings.filter((booking) => {
      return (
        booking.title === clickedEvent.title &&
        new Date(booking.slotTime).getTime() === clickedEvent.start.getTime()
      );
    });
  
    // Set the selected event data with all the booked details
    setSelectedEvent({
      title: clickedEvent.title,
      start: clickedEvent.start,
      bookings: matchingBookings,
    });
    setIsEventModal(true);
    setIsModalOpen(true);
  };
  
  const handleViewToggle = () => {
    const newView = view === 'dayGridMonth' ? 'dayGridWeek' : 'dayGridMonth';
    setView(newView);
    calendarRef.current.getApi().changeView(newView);
  };
  
  return (
    <div className="m-5">
      <h2 className='heading'>Appointment Booking</h2>
      <div className='m-5'>
        <FullCalendar
          ref={calendarRef}
          plugins={[dayGridPlugin, interactionPlugin]}
          initialView={view} 
          headerToolbar={{
            left: 'prev,next today',
            center: 'title',
            right: 'bookSlotButton viewToggle', // Add viewToggle button
          }}
          customButtons={{
            bookSlotButton: {
              text: 'Book Slot',
              className: 'btn btn-primary',
              click: handleBookSlotClick,
            },
            viewToggle: {
              text: 'Toggle View',
              click: handleViewToggle, // Toggle view on click
            },
          }}
          dateClick={handleDateClick}
          dayCellDidMount={handleDayCellDidMount}
          events={events}
          eventClick={handleEventClick}
        />
      </div>
      <BookModal show={isModalOpen} handleClose={handleCloseModal} eventData={selectedEvent} isBookSlotModal={!isEventModal} />
    </div>
  );
}

export default Calendar;
