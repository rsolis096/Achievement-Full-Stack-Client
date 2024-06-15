import React from "react";
import ReactDOM from "react-dom/client";

import env from 'dotenv'
env.config()

import App from "./components/App.tsx";

import "./styles/index.css";

// Import all of Bootstrap's JS
//import * as bootstrap from "bootstrap";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
