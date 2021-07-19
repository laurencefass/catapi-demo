import * as React  from "react";
import { render } from "react-dom";
import { Provider } from "react-redux";
import { createStore, applyMiddleware } from 'redux'
import { catReducer } from "./catReducer";
import { CatUI } from "./CatUI";
import thunk from 'redux-thunk'

import "./styles.scss";

const store = createStore(catReducer ,applyMiddleware(thunk));

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
