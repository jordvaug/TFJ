import React, { Component } from "react";
import axios from "axios";
import auth from "../Auth";
import "../style/style.css";

class Home extends Component {
  state = {
    users: []
  };

  //I use a local storage approach, which is vulnerable to XSS, but XSS must be secured against anyway and the cookies is temporary
  componentDidMount() {
    if (!auth.isAuthenticated()) this.props.history.push("/login");
    else {
      axios.defaults.headers.common["Authorization"] =
        "Bearer " + auth.getToken();

      axios
        .get(`/api/users`, {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            Accept: "application/json"
          }
        })
        .then(res => {
          const users = res.data;
          this.setState({ users });
        })
        .catch(err => console.log(err));
    }
  }

  render() {
    return (
      <div className="container">
        <div className="card bg-light">
          <article className="card-body mx-auto" style={{ maxWidth: 400 }}>
            <h1>Users</h1>
            <ul>
              {this.state.users.map(user => (
                <li>{user.name}</li>
              ))}
            </ul>
          </article>
        </div>
      </div>
    );
  }
}

export default Home;
