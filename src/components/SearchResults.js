import React, { Component } from "react";
// import config from "../config";
// import axios from "axios";

import List from "./List";

class SearchResults extends Component {

  componentDidMount() {
    console.log(this.props)

  }

  handleBack = () => {
    this.props.history.goBack();
  };


  render() {
    return <>
    <button
          onClick={this.handleBack}
          className="button is-primary is-light"
        >
        Back
        </button>
      <List />
  </>;
  }
  
}

export default SearchResults;


