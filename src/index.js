import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { BrowserRouter as Router } from "react-router-dom";

// Suppress ResizeObserver loop error (known browser issue, harmless)
const originalError = window.onerror;
window.onerror = function (message, ...args) {
  if (typeof message === "string" && message.includes("ResizeObserver")) {
    return true;
  }
  return originalError ? originalError.call(this, message, ...args) : false;
};
window.addEventListener("error", (e) => {
  if (e.message && e.message.includes("ResizeObserver")) {
    e.stopImmediatePropagation();
  }
});

ReactDOM.render(
  <React.StrictMode>
    <Router>
      <App />
    </Router>
  </React.StrictMode>,
  document.getElementById("root")
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
