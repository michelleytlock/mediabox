import React, { Component } from "react";
import Icon from "@mdi/react";
import { mdiKeyboardBackspace } from "@mdi/js";

import List from "./List";

class SearchResults extends Component {
  componentDidMount() {
    console.log(this.props);
  }

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
          <h5 className="subtitle is-5 header-type">Search Results</h5>
        </div>
        <div className="search-results-page">
          <List list={this.props.list} fromPage="search"/>
        </div>
      </>
    );
  }
}

export default SearchResults;
