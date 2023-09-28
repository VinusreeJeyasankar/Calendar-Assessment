import React, { useState } from "react";
import { Modal, Toast } from "react-bootstrap";
import BookingForm from "./BookingForm";

function BookModal({
  show,
  handleClose,
  eventData,
  isBookSlotModal,
  eventDetailsMode,
  setEventDetailsMode,
  clickedDate,
}) {
  const [isToastVisible, setIsToastVisible] = useState(false);

  const handleBook = (formData) => {
    // Show the toast after booking
    setIsToastVisible(true);
  };

  return (
    <>
      <Modal show={show} onHide={handleClose} dialogClassName="custom-modal">
        <Modal.Header closeButton>
          <Modal.Title>
            {eventDetailsMode ? "Event Details" : "Book Slot"}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {eventDetailsMode ? (
            // Display event details and all booked details
            <div className="booked-details">
              <h4>{eventData.title}</h4>
              <p>Starts: {eventData.start.toDateString()}</p>
              {eventData.bookings.map((booking, index) => (
                <div key={index}>
                  <h5 className="booking-index">Booking {index + 1}</h5>
                  <p className="booking-info">
                    <span className="label1">User's Name:</span>
                    <span className="value">{booking.userName}</span>
                  </p>
                  <p className="booking-info">
                    <span className="label1">Recruiter:</span>
                    <span className="value1">{booking.recruiter}</span>
                  </p>
                  <p className="booking-info">
                    <span className="label1">Title:</span>
                    <span className="value">{booking.title}</span>
                  </p>
                  <p className="booking-info">
                    <span className="label1">Message:</span>
                    <span className="value">{booking.message}</span>
                  </p>
                  <p className="booking-info">
                    <span className="label1">Time Slot:</span>
                    <span className="value">
                      {new Date(booking.slotTime).toLocaleString()}
                    </span>
                  </p>
                </div>
              ))}
              <button className="btn btn-danger" onClick={handleClose}>
                Close
              </button>
            </div>
          ) : (
            // Display booking form for booking slots
            // Conditionally render BookingForm based on isBookSlotModal
            isBookSlotModal && (
              <BookingForm
                selectedDate={clickedDate}
                onSubmit={handleBook}
                onClose={handleClose}
              />
            )
          )}
        </Modal.Body>

        <Modal.Footer>
          {!eventDetailsMode && !isBookSlotModal && (
            <button
              className="btn btn-primary"
              onClick={() => setEventDetailsMode(true)}
            >
              Show Event Details
            </button>
          )}
        </Modal.Footer>
      </Modal>

      <Toast
        show={isToastVisible}
        onClose={() => setIsToastVisible(false)}
        delay={4000}
        autohide
        style={{
          position: "fixed",
          top: "20px",
          right: "20px",
        }}
      >
        <Toast.Header>
          <strong className="me-auto">Booking Status</strong>
        </Toast.Header>
        <Toast.Body className="btn btn-success w-100">
          Booked successfully
        </Toast.Body>
      </Toast>
    </>
  );
}

export default BookModal;
