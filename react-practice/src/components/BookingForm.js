import React from "react";
import { useDispatch } from "react-redux";
import { setEvents } from "../store/calendar/CalendarSlice";
import { setFormField } from "../store/bookings/BookingFormSlice";
import { formatDate } from "../utils/helper/dateHelper";
import moment from "moment";
import setHours from "date-fns/setHours";
import setMinutes from "date-fns/setMinutes";
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

function BookingForm({ onSubmit, onClose, selectedDate }) {
  const dispatch = useDispatch();
  const today = formatDate(new Date());
  console.log("Today - ", today)

  const minTime = new Date();
  minTime.setHours(9, 30);

  // updating field values in redux store
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    formik.handleChange(e); // Let formik handle the change event
    dispatch(setFormField({ field: name, value })); // Update Redux store
    // Log the current formik values before dispatching
    console.log("After dispatch:", formik.values);
  };
  const maxRecruiterCount = 5;

  const getRecruiterCount = (recruiterName, selectedDate) => {
    const existingBookings = JSON.parse(localStorage.getItem("bookings")) || [];
    return existingBookings.filter(
      (booking) =>
        moment(booking.selectedDate).isSame(selectedDate, "day") &&
        booking.recruiter === recruiterName
    ).length;
  };
  // Displaying time slot based on the recruiters availabilty
  const filterBookedTimes = (time, selectedRecruiter) => {
    const selectedDate = formatDate(formik.values.selectedDate);
    const existingBookings = JSON.parse(localStorage.getItem("bookings")) || [];

    // Filter out the booked times for the selected date and recruiter
    const bookedTimes = existingBookings
      .filter(
        (booking) =>
          moment(booking.selectedDate).isSame(selectedDate, "day") &&
          booking.recruiter === selectedRecruiter
      )
      .map((booking) => moment(booking.slotTime).format("HH:mm"));

    // Disable the time if it's in the bookedTimes array
    return !bookedTimes.includes(moment(time).format("HH:mm"));
  };

  const formik = useFormik({
    initialValues: {
      userName: "",
      selectedRecruiter: null,
      selectedDate: setHours(setMinutes(new Date(selectedDate), 30), 9),
      title: "", // Add title field
      message: "", // Add message field
      slotTime: moment().format("HH:mm"), // Set slotTime to current time
    },
    validationSchema: validationSchema, // Apply the validation schema
    onSubmit: (values) => {
      // Format the selected date and time using moment
      console.log("values.selectedDate:", values.selectedDate);
      const formattedSlotTime = moment(values.selectedDate).format();

      // Store the booking with slot information
      const booking = {
        ...values,
        selectedDate: formatDate(values.selectedDate.toISOString()), // Format selectedDate
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
            moment(values.selectedDate).format("HH:mm") &&
          booking.recruiter === values.selectedRecruiter.value
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

      // Create a new array with only title and slotTime
      const titlesAndSlotTimes = updatedBookings.map((booking) => ({
        title: booking.title,
        start: booking.slotTime,
      }));

      dispatch(setEvents(titlesAndSlotTimes));
      // dispatch(setEvents(updatedBookings)); // Dispatch setEvents action with updated bookings
      console.log("LocalStorage updation:", updatedBookings);
      onSubmit(values);
      onClose();
    },
  });
  console.log("selectedDate : ", selectedDate)
  // Check if all recruiters have reached their limit for the selected day
  const isAllRecruitersFull = recruiterOptions.every((recruiter) => {
    const selectedDate = formik.values.selectedDate;
    return (
      getRecruiterCount(recruiter.value, selectedDate) >= maxRecruiterCount
    );
  });

  if (isAllRecruitersFull) {
    return (
      <>
        <div className="noBookings mb-3">
          No Recruiters or bookings available for this day,
          {moment(formik.values.selectedDate).format("MMMM D, YYYY")}.
        </div>
        <button className="btn btn-danger" onClick={onClose}>
          Close
        </button>
      </>
    );
  }
  //move to next day if the current day is friday
  // const isFriday = today.getDay() === 5;

  // const defaultSelectedDate = isFriday
  //   ? moment(today).add(1, "day").valueOf() // Convert to timestamp
  //   : selectedDate || today;
  // console.log("defaultSelected Date: ", defaultSelectedDate);

  console.log("slotTime: ", formik.values.slotTime)
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
          onChange={handleInputChange}
          onBlur={formik.handleBlur} // Add onBlur event handler
          value={formik.values.userName}
          autoComplete="ON"
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
          inputId="selectedRecruiter" // Add this line to specify the id
          name="selectedRecruiter"
          className="form-control form-control-lg"
          options={recruiterOptions.map((recruiter) => ({
            ...recruiter,
            isDisabled:
              getRecruiterCount(recruiter.value, formik.values.selectedDate) >=
              maxRecruiterCount,
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
            selected={formik.values.selectedDate} // Use selectedDate and slotTime
            onChange={(date) => formik.setFieldValue("selectedDate", date)}
            onBlur={formik.handleBlur} // Add onBlur event handler
            showTimeSelect={true}
            timeFormat="HH:mm"
            timeIntervals={30}
            dateFormat="MMMM d, yyyy h:mm aa"
            timeCaption="Time"
            minDate={new Date()} // Set minDate to the current date
            minTime={minTime} // Set minTime to 9:30 AM
            maxTime={new Date().setHours(19, 0)} // Set maxTime to 7:00 PM
            filterDate={(date) => date.getDay() !== 5} // Disable Fridays
            filterTime={(time) =>
              formik.values.selectedRecruiter?.value
                ? filterBookedTimes(time, formik.values.selectedRecruiter.value)
                : true
            }
            // Pass selected recruiter value to filterBookedTimes
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
          onChange={handleInputChange}
          onBlur={formik.handleBlur} // Add onBlur event handler
          value={formik.values.title}
          autoComplete="ON"
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
          onChange={handleInputChange}
          onBlur={formik.handleBlur} // Add onBlur event handler
          value={formik.values.message}
          autoComplete="on"
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
