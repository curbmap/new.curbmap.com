import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";
import "./index.css";
import App from "./App";
import registerServiceWorker from "./registerServiceWorker";
import { createStore, combineReducers } from "redux";
import { auth } from "./Reducers/auth.reducers";
import { updateLabels } from "./Reducers/label.reducers";
let store = createStore(combineReducers({ auth, updateLabels }));
const unsubscribe = store.subscribe(() => console.log(store.getState()));

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById("root")
);
registerServiceWorker();
