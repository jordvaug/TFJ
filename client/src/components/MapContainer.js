import React, { Component } from "react";
import { Map, InfoWindow, Marker, GoogleApiWrapper } from "google-maps-react";
import Climbs from "./Climbs";
//https://www.npmjs.com/package/google-maps-react

export class MapContainer extends Component {
  state = {
    selectedPlace: {
      name: "Denver"
    },
    currentLocation: {
      lat: "",
      lng: ""
    }
  };

  componentDidMount() {
    if (this.props.centerAroundCurrentLocation) {
      if (navigator && navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(pos => {
          const coords = pos.coords;
          this.setState({
            currentLocation: {
              lat: coords.latitude,
              lng: coords.longitude
            }
          });
          console.log(this.state.currentLocation);
        });
      }
    }
  }

  render() {
    return (
      <Map
        google={this.props.google}
        initialCenter={this.state.currentLocation}
        zoom={14}
      >
        <Marker onClick={this.onMarkerClick} name={"Current location"} />

        <Climbs />
      </Map>
    );
  }
}

export default GoogleApiWrapper({
  apiKey: process.env.GMAPSKEY
})(MapContainer);
