import React, { Component } from "react";
import axios from "axios";
import { withRouter } from "react-router-dom";
import "../style/style.css";
import qs from "qs";

class Signup extends Component {
  state = {
    name: "",
    email: "",
    password: "",
    cpassword: "",
    nameError: ""
  };

  handleChange = event => {
    this.setState({ [event.target.name]: event.target.value });
  };

  handleSubmit = event => {
    event.preventDefault();

    const user = {
      name: this.state.name,
      email: this.state.email,
      password: this.state.password
    };

    const { password, cpassword } = this.state;
    // perform all neccassary validations
    if (password !== cpassword) {
      alert("Passwords don't match");
    } else {
      axios
        .post("/api/signup", qs.stringify(user), {
          headers: {
            "Content-type": "application/x-www-form-urlencoded",
            "Access-Control-Allow-Origin": "*"
          }
        })
        .then(res => {
          if (res.data.success) this.props.history.push("/home");
          else alert("Sign up failed");
        });
    }
  };

  render() {
    return (
      <div className="container">
        <div className="card bg-light">
          <article className="card-body mx-auto" style={{ maxWidth: 400 }}>
            <h4 className="card-title mt-3 text-center">Create Account</h4>
            <p className="text-center">Login with: </p>
            <p>
              <a
                href=""
                className="btn btn-block"
                style={{ backgroundColor: "#D44638", color: "#fff" }}
              >
                {" "}
                Gmail
              </a>
              <a
                href=""
                className="btn btn-block"
                style={{ backgroundColor: "#405D9D", color: "#fff" }}
              >
                Facebook
              </a>
            </p>
            <form onSubmit={this.handleSubmit}>
              <div className="form-group input-group">
                <div className="input-group-prepend">
                  <span className="input-group-text">
                    {" "}
                    <i className="fa fa-user" />{" "}
                  </span>
                </div>
                <input
                  name="name"
                  className="form-control"
                  placeholder="Full Name"
                  type="text"
                  value={this.state.name}
                  onChange={this.handleChange}
                />
                {this.state.nameError && <div>{this.state.nameError}</div>}
              </div>
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
                  placeholder="Create password"
                  type="password"
                  value={this.state.password}
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
                  name="cpassword"
                  className="form-control"
                  placeholder="Repeat password"
                  type="password"
                  value={this.state.cpassword}
                  onChange={this.handleChange}
                />
              </div>
              <div className="form-group">
                <button type="submit" className="btn btn-primary btn-block">
                  {" "}
                  Create Account{" "}
                </button>
              </div>
              <p className="text-center">Have an account?</p>
            </form>
          </article>
        </div>
      </div>
    );
  }
}

export default withRouter(Signup);
