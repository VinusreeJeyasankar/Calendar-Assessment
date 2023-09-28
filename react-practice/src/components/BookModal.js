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
  onDelete,
}) {
  const [searchQuery, setSearchQuery] = useState("");
  const [isToastVisible, setIsToastVisible] = useState(false);

  const handleBook = (formData) => {
    // Show the toast after booking
    setIsToastVisible(true);
  };

  const filteredBookings = eventData.bookings.filter((booking) => {
    const searchValue = searchQuery.toLowerCase();
    return (
      booking.userName.toLowerCase().includes(searchValue) ||
      booking.recruiter.toLowerCase().includes(searchValue) ||
      booking.title.toLowerCase().includes(searchValue) ||
      booking.message.toLowerCase().includes(searchValue) ||
      new Date(booking.slotTime)
        .toLocaleString()
        .toLowerCase()
        .includes(searchValue)
    );
  });

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
            <div className="booked-details">
              <h4>{eventData.title}</h4>
              <p>Starts: {eventData.start.toDateString()}</p>
              {filteredBookings.length > 2 && (
                <>
                  {/* search field */}
                  <div className="mb-3">
                    <label
                      htmlFor="search-box"
                      className="form-label search-field"
                    >
                      Search Field:
                    </label>
                    <input
                      id="search-box"
                      className="form-control search-field"
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search..."
                      autoComplete="on"
                    />
                  </div>
                </>
              )}
              {filteredBookings.map((booking, index) => (
                // Rendering booking details
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
              <hr />
              {eventData && eventData.bookings.length === 1 && (
                <button
                  className="btn btn-danger delete mb-4"
                  onClick={onDelete}
                >
                  Delete
                </button>
              )}
              <button
                className="btn bg-black text-white float-end close"
                onClick={handleClose}
              >
                Close
              </button>
            </div>
          ) : (
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

      {/* Toaster added */}
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
