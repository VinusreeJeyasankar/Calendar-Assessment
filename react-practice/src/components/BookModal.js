import React, { useState } from "react";
import { Modal, Toast, Carousel } from "react-bootstrap";
import BookingForm from "./BookingForm";
import BookingDetail from "./BookingDetails";

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
              {/* Carousel for displaying multiple events */}
              {filteredBookings.length > 1 ? (
                <Carousel>
                  {filteredBookings.map((booking, index) => (
                    <Carousel.Item key={index}>
                      <BookingDetail booking={booking} index={index} />
                    </Carousel.Item>
                  ))}
                </Carousel>
              ) : (
                filteredBookings.map((booking, index) => (
                  <BookingDetail key={index} booking={booking} index={index} />
                ))
              )}
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
