import React, { Component } from "react";
import Icon from "@mdi/react";
import { mdiKeyboardBackspace } from "@mdi/js";

import List from "./List";

let photoPath = "https://image.tmdb.org/t/p/w500/";

class PersonDetails extends Component {
  // This method handles the back button
  handleBack = () => {
    this.props.history.goBack();
  };

  render() {
    return (
      <>
        <div className="header">
          <button onClick={this.handleBack} className="back-button">
            <Icon path={mdiKeyboardBackspace} size={1.5} color="#e20f0f" />
          </button>
          <h5 className="subtitle is-5 header-type">Details</h5>
        </div>
        <div className="search-results-page">
          <div className="search-person-details">
            <img
              className="search-profile-pic"
              src={photoPath + this.props.location.state.photo}
              alt={this.props.location.state.name}
            />
            <h5 className="is-5 search-subhead">
              {this.props.location.state.name}
            </h5>
            <List
              list={this.props.location.state.known_for}
              fromPage="search"
            />
          </div>
        </div>
      </>
    );
  }
}

export default PersonDetails;