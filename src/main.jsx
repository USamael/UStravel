import React from "react";
import ReactDOM from "react-dom/client";
import { registerSW } from "virtual:pwa-register";
import App from "./App";
import "./index.css";

if (!Object.hasOwn) {
  Object.hasOwn = function hasOwn(target, property) {
    return Object.prototype.hasOwnProperty.call(target, property);
  };
}

registerSW({ immediate: true });

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
