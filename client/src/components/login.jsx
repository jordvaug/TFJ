import React, { Component } from "react";
import axios from "axios";
import qs from "qs";

class Login extends Component {
  state = {
    email: "",
    password: ""
  };

  handleChange = event => {
    this.setState({ [event.target.name]: event.target.value });
  };

  handleSubmit = event => {
    event.preventDefault();

    let user = {
      email: this.state.email,
      password: this.state.password
    };

    axios
      .post("/api/login", qs.stringify(user), {
        headers: {
          "Content-type": "application/x-www-form-urlencoded",
          "Access-Control-Allow-Origin": "*"
        }
      })
      .then(res => {
        console.log(res);
      });
  };

  render() {
    return (
      <div className="container">
        <div className="card bg-light">
          <article className="card-body mx-auto" style={{ maxWidth: 400 }}>
            <h4 className="card-title mt-3 text-center">Login</h4>
            <form onSubmit={this.handleSubmit}>
              <div className="form-group input-group">
                <div className="input-group-prepend">
                  <span className="input-group-text">
                    {" "}
                    <i className="fa fa-envelope" />{" "}
                  </span>
                </div>
                <input
                  name="email"
                  className="form-control"
                  placeholder="Email address"
                  type="email"
                  value={this.state.email}
                  onChange={this.handleChange}
                />
              </div>
              <div className="form-group input-group">
                <div className="input-group-prepend">
                  <span className="input-group-text">
                    {" "}
                    <i className="fa fa-lock" />{" "}
                  </span>
                </div>
                <input
                  name="password"
                  className="form-control"
                  placeholder="Password"
                  type="password"
                  value={this.state.password}
                  onChange={this.handleChange}
                />
              </div>
              <div className="form-group">
                <button type="submit" className="btn btn-primary btn-block">
                  {" "}
                  Login{" "}
                </button>
              </div>
              <p className="text-center">
                Don't have an account? <a href="">Sign Up</a>{" "}
              </p>
            </form>
          </article>
        </div>
      </div>
    );
  }
}

export default Login;
