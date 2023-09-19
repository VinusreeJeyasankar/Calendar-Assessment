import * as Yup from "yup";

const validationSchema = Yup.object().shape({
  userName: Yup.string()
    .matches(/^[A-Za-z]+$/, "Username can only contain alphabets")
    .min(6, "Too Short, Atleast 6 characters")
    .max(25, "Must be 25 characters or less")
    .required("User name is required"),
  selectedRecruiter: Yup.object().nullable().required("Select a recruiter"),
  selectedDate: Yup.date().required("Select a date and time"),
  title: Yup.string().required("Title is required"),
  message: Yup.string().required("Message is required"),
});

export default validationSchema;
