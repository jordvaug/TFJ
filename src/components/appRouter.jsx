import React, { Component } from "react";
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import "../App.css";
import Login from "./login";
import Signup from "./signup";
import Home from "./home";

class AppRouter extends Component {
  state = {};
  render() {
    return (
      <Router>
        <div>
          <nav className="navbar navbar-expand-lg navbar-light bg-light">
            <div
              className="collapse navbar-collapse"
              id="navbarSupportedContent"
            >
              <ul className="navbar-nav mr-auto">
                <li className="nav-item active">
                  <div className="nav-link">
                    <Link to="/home/">Home</Link>
                  </div>
                </li>
                <li className="nav-item active">
                  <a className="nav-link" href="">
                    About
                  </a>
                </li>
                <li className="nav-item active">
                  <div className="nav-link">
                    <Link to="/login/">Login</Link>
                  </div>
                </li>
                <li className="nav-item active">
                  <div className="nav-link">
                    <Link to="/signup/">Sign Up</Link>
                  </div>
                </li>
              </ul>
            </div>
          </nav>
          <Route path="/home/" component={Home} />
          <Route path="/login/" component={Login} />
          <Route path="/signup/" component={Signup} />
        </div>
      </Router>
    );
  }
}

export default AppRouter;
