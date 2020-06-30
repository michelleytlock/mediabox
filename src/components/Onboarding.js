import React, { Component } from "react";

import "../styles/Onboarding.css";

import OnboardingRater from "./OnboardingRater";

export default class Onboarding extends Component {
  render() {
    console.log(this.props.ratedList);
    return (
      <>
        <h5 className="is-5 instructions">
          Rate the movie or tv show that appears to help us figure out what you like.
        </h5>
        <div className="onboarding-page">
          <h6 className="is-6 progress-percentage">
            {(this.props.ratedList.length / 10) * 100 + "%"}
          </h6>
          <div className="progress-bar">
            <progress
              className="progress is-primary is-small"
              value={(this.props.ratedList.length / 10) * 100}
              max="100"
            >
              {this.props.ratedList.length / 10 + "%"}
            </progress>
          </div>

          <OnboardingRater
            random={this.props.random}
            onRate={this.props.onRate}
            onSkip={this.props.onSkip}
          />
        </div>
      </>
    );
  }
}
