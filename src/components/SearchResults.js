import React, { Component } from "react";

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
        <button
          onClick={this.handleBack}
          className="button is-primary is-light"
        >
          Back
        </button>
        <List list={this.props.list}/>
      </>
    );
  }
}

export default SearchResults;
