import React, { Component } from "react";
import "./App.css";
import AppRouter from "./components/appRouter";
import { createStore } from "redux";
//https://redux.js.org/introduction/getting-started

class App extends Component {
  render() {
    return (
      <div>
        <AppRouter />
      </div>
    );
  }
}

export default App;
