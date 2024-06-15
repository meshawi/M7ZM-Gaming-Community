// src/App.js
import React from "react";
import { Provider } from "react-redux";
import { NextUIProvider } from "@nextui-org/react";
import AppRoutes from "./routes";
import { store, persistor } from './store';
import { PersistGate } from 'redux-persist/integration/react';

function App() {
  return (
    <Provider store={store}>
            <PersistGate loading={null} persistor={persistor}>

      <NextUIProvider>
        <AppRoutes />
      </NextUIProvider>
      </PersistGate>

    </Provider>
  );
}

export default App;
