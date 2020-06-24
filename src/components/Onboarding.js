import React, { Component } from "react";

import Rater from "./Rater";

export default class Onboarding extends Component {
  state = {
    ratedList: this.props.ratedList,
  };
  render() {
    const { ratedList } = this.state
    
    return (
      <>
        {ratedList.length < 10 ? (
          <div>
            <h4 className="subtitle is-4">
              {ratedList.length / 10 * 100 + "%"}
            </h4>
            <progress
              className="progress is-primary"
              value={(ratedList.length / 10) * 100}
              max="100"
            >
              {ratedList.length / 10 + "%"}
            </progress>
          </div>
        ) : (
          <div>
            <h4 className="subtitle is-4">100%</h4>
            <progress className="progress is-primary" value="100" max="100">
              100%
            </progress>
          </div>
        )}
          <br />
        <Rater random={this.props.random} onRate={this.props.onRate} onSkip={this.props.onSkip} />
      </>
    );
  }
}
