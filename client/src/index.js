import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import { persistor, store } from "./redux/store.js";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { ContextProvider } from "./redux/ContextProvider.js";

ReactDOM.render(
  <Provider store={store}>
    <PersistGate persistor={persistor} loading={null}>
      <ContextProvider>
        <App />
      </ContextProvider>
    </PersistGate>
  </Provider>,
  document.getElementById("root")
);
