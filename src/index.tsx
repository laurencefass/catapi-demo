import * as React from "react";
import { render } from "react-dom";
import { Provider } from "react-redux";
import { createStore } from 'redux';
import { catReducer } from "./catReducer";
import { CatUI } from "./CatUI";

import "./styles.scss";

const store = createStore(catReducer);

function App() {
  return (
    <Provider store={store}>
      <div className="App">
        <CatUI />
      </div>
    </Provider>
  );
}

const rootElement = document.getElementById("root");
render(<App />, rootElement);
