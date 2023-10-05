import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import store from "./store/store";
import { Provider } from "react-redux";
import App from './App';
import 'bootstrap/dist/css/bootstrap.min.css';
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Provider store={store}>
    <App />
    <ToastContainer />
    </Provider>
  </React.StrictMode>
);

