import React from "react";

function BookingDetail({ booking, index }) {
  return (
    <div>
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
  );
}

export default BookingDetail;
