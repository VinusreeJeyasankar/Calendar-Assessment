import React, { useState } from "react";
import { Modal, Toast } from "react-bootstrap";
import BookingForm from "./BookingForm";

function BookModal({ show, handleClose, eventData, isBookSlotModal, eventDetailsMode, setEventDetailsMode, clickedDate}) {
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
            <div>
              <h4>{eventData.title}</h4>
              <p>Starts: {eventData.start.toDateString()}</p>
              {eventData.bookings.map((booking, index) => (
                <div key={index}>
                  <h5>Booking {index + 1}</h5>
                  <p>User's Name: {booking.userName}</p>
                  <p>Recruiter: {booking.recruiter}</p>
                  <p>Title: {booking.title}</p>
                  <p>Message: {booking.message}</p>
                  <p>
                    Time Slot: {new Date(booking.slotTime).toLocaleString()}
                  </p>
                </div>
              ))}
              <button className="btn btn-danger" onClick={handleClose}>
                Close
              </button>
            </div>
          ) : (
            // Display booking form for booking slots
            <BookingForm selectedDate={clickedDate} onSubmit={handleBook} onClose={handleClose} />
          )}
        </Modal.Body>

        <Modal.Footer>
        {!eventDetailsMode &&
            !isBookSlotModal && (
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
