import React from "react";
import FadeIn from "react-fade-in";
import Lottie from "react-lottie";
import ReactLoading from "react-loading";
import * as loadingData from "../loadingAnimation.json";
import { Link } from "react-router-dom";

const defaultOptions = {
  loop: true,
  autoplay: true,
  animationDate: loadingData.default,
  rendererSettings: {
    preserveAspectRatio: "xMidYMid slice",
  },
};

export default class LandingPage extends React.Component {
  state = {
    done: undefined,
  };

  componentDidMount() {
    setTimeout(() => {
      this.setState({ done: true });
    }, 2000);
  }

  render() {
    return (
      <>
        {!this.state.done ? (
          <div className="loading">
            <FadeIn>
              <h1 className="logo">MediaBox</h1>
              {/* <Lottie options={defaultOptions} height={120} width={120} /> */}
            </FadeIn>
            <ReactLoading type={"spin"} color={"white"} />
          </div>
        ) : (
          <div className="landing">
              <div className="landing-content">
              <Link to={"/login"}>
                <button className="button is-rounded is-primary">Log In</button>
              </Link>
              <Link to={"/signup"}>
                <button className="button is-rounded is-primary is-fullwidth is-medium mainbutton">
                  Get Started
                </button>
              </Link>
              
            </div>
          </div>
        )}
      </>
    );
  }
}
