import React, { Component } from "react";
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import "../App.css";
import Login from "./login";
import Signup from "./signup";
import Home from "./home";
import auth from "../Auth";
import user from "../User";
import MapContainer from "./MapContainer";
import Welcome from "./welcome";

class AppRouter extends Component {
  state = { auth: true };

  signOut = () => {
    auth.signOut();
    this.setState({ auth: !this.state.auth });
  };

  render() {
    return (
      <Router>
        <div>
          <nav className="navbar navbar-expand-lg navbar-light bg-light">
            <ul className="navbar-nav mr-auto">
              <li className="nav-item active">
                <div className="nav-link">
                  {auth.isAuthenticated && <Link to="/home/"> Home</Link>}
                </div>
              </li>
              <li className="nav-item active">
                <div className="nav-link">
                  {auth.isAuthenticated && <Link to="/map/"> Map</Link>}
                </div>
              </li>
              <li className="nav-item active">
                <div className="nav-link">
                  {!auth.isAuthenticated && <Link to="/login/">Login</Link>}
                </div>
              </li>
              <li className="nav-item active">
                <div className="nav-link">
                  {!auth.isAuthenticated && <Link to="/signup/">Sign Up</Link>}
                </div>
              </li>
              <li className="nav-item active">
                <div className="nav-link">
                  {auth.isAuthenticated && this.state.auth && (
                    <button
                      className="btn btn-dark"
                      onClick={() => {
                        this.signOut();
                      }}
                    >
                      Sign Out
                    </button>
                  )}
                </div>
              </li>
            </ul>
            {user.name}
          </nav>
          <Route path="/home/" component={Home} />
          <Route path="/login/" component={Login} />
          <Route path="/signup/" component={Signup} />
          <Route path="/map/" component={MapContainer} />
          <Route path="/welcome/" component={Welcome} />
        </div>
      </Router>
    );
  }
}

export default AppRouter;
