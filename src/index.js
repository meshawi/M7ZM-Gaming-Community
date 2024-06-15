// index.js
import React from "react";
import ReactDOM from "react-dom/client";
import { NextUIProvider } from "@nextui-org/react";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import App from "./App";
import "./index.css";
import reportWebVitals from "./reportWebVitals";
import './i18n'; // Import i18n configuration

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <NextUIProvider>
      <NextThemesProvider
        attribute="class"
        defaultTheme="light"
        value={{
          light: "light",
          dark: "dark",
          "purple-dark": "purple-dark",
          "black-orange": "black-orange",
          "blue-pink": "blue-pink",
          "green-yellow": "green-yellow",
          "sunset-glow": "sunset-glow",
          "midnight-blue": "midnight-blue",
          "forest-green": "forest-green",
          "ocean-breeze": "ocean-breeze",
          "sunny-day": "sunny-day",
        }}
      >
        <App />
      </NextThemesProvider>
    </NextUIProvider>
  </React.StrictMode>
);

reportWebVitals();
