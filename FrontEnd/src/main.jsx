import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter as Router } from "react-router-dom";
import "./index.css";
import App from "./App.jsx";
import { NotificationProvider } from "./utils/NotificationContext";

createRoot(document.getElementById("root")).render(
  <NotificationProvider>
    <StrictMode>
      <Router>
        <App />
      </Router>
    </StrictMode>
  </NotificationProvider>
);
