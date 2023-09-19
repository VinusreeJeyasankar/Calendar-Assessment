import React from "react";
import moment from "moment";
import { useFormik } from "formik";
import Select from "react-select";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { Button } from "react-bootstrap";
import validationSchema from "./ValidationSchema";

const recruiterOptions = [
  { value: "Mark Collins", label: "Mark Collins" },
  { value: "Tom Kelly", label: "Tom Kelly" },
  { value: "Joseph Liberator", label: "Joseph Liberator" },
  { value: "Jim Rogers", label: "Jim Rogers" },
  { value: "Eric Goodwin", label: "Eric Goodwin" },
];

function BookingForm({ onSubmit, onClose }) {
  const maxRecruiterCount = 5;
  
  const getRecruiterCount = (recruiterName) => {
    const existingBookings = JSON.parse(localStorage.getItem("bookings")) || [];
    return existingBookings.filter(booking => booking.recruiter === recruiterName).length;
  };
  
  const formik = useFormik({
    initialValues: {
      userName: "",
      selectedRecruiter: null,
      selectedDate: null,
      title: "", // Add title field
      message: "", // Add message field
      slotTime: null,
    },
    validationSchema: validationSchema, // Apply the validation schema
    onSubmit: (values) => {
      // Format the selected date and time using moment
      const formattedSlotTime = moment(values.selectedDate).format();

      // Store the booking with slot information
      const booking = {
        ...values,
        selectedDate: values.selectedDate.toISOString(), // Format selectedDate
        slotTime: formattedSlotTime, // Store formatted date and time
        recruiter: values.selectedRecruiter.value, // Store recruiter value
      };

      // Retrieve existing bookings from local storage or initialize an empty array
      const existingBookings =
        JSON.parse(localStorage.getItem("bookings")) || [];

      // Check if the selected time slot is already booked
      const isTimeSlotBooked = existingBookings.some((booking) => {
        return (
          moment(booking.selectedDate).isSame(values.selectedDate, "day") &&
          moment(booking.slotTime).format("HH:mm") ===
            moment(values.selectedDate).format("HH:mm")
        );
      });

      if (isTimeSlotBooked) {
        alert(
          "The selected time slot is already booked. Please choose a different time."
        );
        return;
      }
      // Append the new booking to the existing bookings
      const updatedBookings = [...existingBookings, booking];

      // Store the updated bookings in local storage
      localStorage.setItem("bookings", JSON.stringify(updatedBookings));

      onSubmit(values);
      onClose();
    },

  });

  // Filtering Booked times of the day
  const filterBookedTimes = (time) => {
    const selectedDate = formik.values.selectedDate;
    const existingBookings = JSON.parse(localStorage.getItem("bookings")) || [];

    // Filter out the booked times for the selected date
    const bookedTimes = existingBookings
      .filter((booking) =>
        moment(booking.selectedDate).isSame(selectedDate, "day")
      )
      .map((booking) => moment(booking.slotTime).format("HH:mm"));

    // Disable the time if it's in the bookedTimes array
    return !bookedTimes.includes(moment(time).format("HH:mm"));
  };

  return (
    <form onSubmit={formik.handleSubmit}>
      <div className="mb-3">
        <label htmlFor="userName" className="form-label">
          User Name
        </label>
        <input
          type="text"
          className="form-control form-control-lg"
          id="userName"
          name="userName"
          onChange={formik.handleChange}
          value={formik.values.userName}
        />
        {formik.touched.userName && formik.errors.userName ? (
          <div className="text-danger">{formik.errors.userName}</div>
        ) : null}
      </div>
      <div className="mb-3">
        <label htmlFor="selectedRecruiter" className="form-label">
          Select Recruiter
        </label>
        <Select
          id="selectedRecruiter"
          name="selectedRecruiter"
          className="form-control form-control-lg"
          options={recruiterOptions.map((recruiter) => ({
            ...recruiter,
            isDisabled: getRecruiterCount(recruiter.value) >= maxRecruiterCount,
          }))}
          value={formik.values.selectedRecruiter}
          onChange={(selectedOption) =>
            formik.setFieldValue("selectedRecruiter", selectedOption)
          }
          isSearchable
        />

        {formik.touched.selectedRecruiter && formik.errors.selectedRecruiter ? (
          <div className="text-danger">{formik.errors.selectedRecruiter}</div>
        ) : null}
      </div>
      <div className="mb-3">
        <div>
          <label htmlFor="selectedDate" className="form-label">
            Select Date and Time
          </label>
        </div>
        <div>
          <DatePicker
            id="selectedDate"
            name="selectedDate"
            className="form-control form-control-lg"
            selected={formik.values.selectedDate}
            onChange={(date) => formik.setFieldValue("selectedDate", date)}
            showTimeSelect
            timeFormat="HH:mm"
            timeIntervals={30}
            dateFormat="MMMM d, yyyy h:mm aa"
            timeCaption="Time"
            minDate={new Date()} // Set minDate to the current date
            minTime={new Date().setHours(9, 30)} // Set minTime to 9:30 AM
            maxTime={new Date().setHours(19, 0)} // Set maxTime to 7:00 PM
            filterDate={(date) => date.getDay() !== 5} // Disable Fridays
            filterTime={(time) => filterBookedTimes(time)}
            autoComplete="off"
          />
          {formik.touched.selectedDate && formik.errors.selectedDate ? (
            <div className="text-danger">{formik.errors.selectedDate}</div>
          ) : null}
        </div>
      </div>
      <div className="mb-3">
        <label htmlFor="title" className="form-label">
          Title
        </label>
        <input
          type="text"
          className="form-control form-control-lg"
          id="title"
          name="title"
          onChange={formik.handleChange}
          value={formik.values.title}
        />
        {formik.touched.title && formik.errors.title ? (
          <div className="text-danger">{formik.errors.title}</div>
        ) : null}
      </div>
      <div className="mb-3">
        <label htmlFor="message" className="form-label">
          Message
        </label>
        <textarea
          className="form-control form-control-lg"
          id="message"
          name="message"
          onChange={formik.handleChange}
          value={formik.values.message}
        />
        {formik.touched.message && formik.errors.message ? (
          <div className="text-danger">{formik.errors.message}</div>
        ) : null}
      </div>
      <Button type="submit" variant="primary" disabled={!formik.isValid}>
        Book Appointment
      </Button>
    </form>
  );
}

export default BookingForm;