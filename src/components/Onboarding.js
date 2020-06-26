import React, { Component } from "react";

import OnboardingRater from "./OnboardingRater";

export default class Onboarding extends Component {
  render() {
    // console.log(this.props.ratedList)
    return (
      <>
        <div>
            <h4 className="subtitle is-4">
              {this.props.ratedList.length / 10 * 100 + "%"}
            </h4>
            <progress
              className="progress is-primary"
              value={(this.props.ratedList.length / 10) * 100}
              max="100"
            >
              {this.props.ratedList.length / 10 + "%"}
            </progress>
          </div>
          <br />
        <OnboardingRater random={this.props.random} onRate={this.props.onRate} onSkip={this.props.onSkip} />
      </>
    );
  }
}
