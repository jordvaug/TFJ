import React, { Component } from "react";
import axios from "axios";

class Home extends Component {
  state = {
    users: []
  };

  componentDidMount() {
    axios
      .get(`http://localhost:5000/api/users`, {
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
