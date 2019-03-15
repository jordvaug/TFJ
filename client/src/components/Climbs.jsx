import React, { Component } from "react";
import qs from "qs";
import axios from "axios";
import auth from "../Auth";
import "../style/style.css";

class Climbs extends Component {
  state = { climbs: [], showResults: false };

  onClickHandler = () => {
    if (this.state.showResults) this.setState({ showResults: false });
    this.setState({ showResults: true });
  };

  componentDidMount() {
    let data = {
      lat: 39.740845,
      long: -105.310402
    };
    axios.defaults.headers.common["Authorization"] =
      "Bearer " + auth.getToken();

    axios
      .post(`/api/mtp/routes`, qs.stringify(data), {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          Accept: "application/json"
        }
      })
      .then(res => {
        this.setState({ climbs: res.data.routes });
      })
      .catch(err => console.log(err));
  }
  render() {
    return (
      <div className="climbsContainer">
        <h1>Areas</h1>
        <button className="customButton" onClick={this.onClickHandler}>
          Clear Creek
        </button>

        <div className="collapsibleMenu">
          {this.state.showResults
            ? this.state.climbs.map(climb => (
                <ul>
                  <li>
                    {climb.name}: {climb.rating}
                  </li>
                </ul>
              ))
            : null}
        </div>
      </div>
    );
  }
}

export default Climbs;
