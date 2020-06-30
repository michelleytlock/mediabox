import React from "react";
import FadeIn from "react-fade-in";
import Lottie from "react-lottie";
import ReactLoading from "react-loading";
import loadingData from "../loadingAnimation.json";
import { Link } from "react-router-dom";

export default class LandingPage extends React.Component {
  state = {
    done: undefined,
  };

  componentDidMount() {
    setTimeout(() => {
      this.setState({ done: true });
    }, 50000);
  }

  render() {
    console.log(loadingData)
    const defaultOptions = {
      loop: true,
      autoplay: true,
      animationData: loadingData,
      rendererSettings: {
        preserveAspectRatio: "xMidYMid slice",
      },
    };

    return (
      <>
        {!this.state.done ? (
          <div className="loading">
            <FadeIn>
              <h1 className="logo">MediaBox</h1>
              <Lottie options={defaultOptions} height={120} width={120} />
            </FadeIn>
            <ReactLoading type={"spin"} color={"white"} />
          </div>
        ) : (
          <div className="landing">
              <div className="landing-content">
              <Link to={"/login"}>
                <button className="button is-rounded login-button">Log In</button>
                </Link>
                <div><h1 className="logo">MediaBox</h1>
                <h2 className="intro-text">Rate movies & tv shows you've watched and get recommendations based on your ratings</h2></div>
                
              <Link to={"/signup"}>
                <button className="button is-rounded is-primary is-fullwidth is-medium signup-button">
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
