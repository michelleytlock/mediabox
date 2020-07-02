import React, { Component } from "react";
import config from "../config";
import axios from "axios";
import Lottie from "react-lottie";
import * as loadingData from "../loadingAnimation.json";

import Navbar from "./Navbar";
import MediaFilter from "./MediaFilter";
import List from "./List";

const defaultOptions = {
  loop: true,
  autoplay: true,
  animationDate: loadingData.default,
  rendererSettings: {
    preserveAspectRatio: "xMidYMid slice",
  },
};

class Watchlist extends Component {
  state = {
    user: this.props.loggedInUser,
    list: [],
    mediaPage: "movie",
  };

  componentDidMount() {
    axios
      .get(`${config.API_URL}/watchlist`, { withCredentials: true })
      .then((res) => {
        this.setState({
          list: res.data,
        });
      })
      .catch((err) => {
        console.log("get watchlist err" + err);
      });
  }

  handleToggleMovie = () => {
    window.localStorage.setItem("mediaPage", "movie");
    this.setState({
      mediaPage: "movie",
    });
  };

  handleToggleTV = () => {
    window.localStorage.setItem("mediaPage", "tv");
    this.setState({
      mediaPage: "tv",
    });
  };

  render() {
    let mediaPage = this.state.mediaPage;

    if (window.localStorage.getItem("mediaPage")) {
      mediaPage = window.localStorage.getItem("mediaPage");
    }

    let filterByMediaType = this.state.list.filter((media) => {
      return media.mediaType === mediaPage;
    });

    return (
      <div className="watchlist-page">
        <MediaFilter mediaType={this.state.mediaPage} 
          onMovieChange={this.handleToggleMovie}
          onTVChange={this.handleToggleTV}
        />
        {filterByMediaType.length === 0 ? (
          <div className="watchlist-placeholder">
            <Lottie options={defaultOptions} height={120} width={120} />
            <h3 className="subtitle is-3">Start adding to <br/> your watchlist!</h3>
          </div>
        ) : (
            <List list={filterByMediaType} type={this.state.mediaPage} fromPage="watchlist"/>
        )}
        <Navbar />
      </div>
    );
  }
}

export default Watchlist;
