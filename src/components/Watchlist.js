import React, { Component } from "react";
import config from "../config";
import axios from "axios";

import Navbar from "./Navbar";
import MediaFilter from "./MediaFilter";
import List from "./List";

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

    // console.log(filterByMediaType)

    return (
      <>
        <MediaFilter
          onMovieChange={this.handleToggleMovie}
          onTVChange={this.handleToggleTV}
        />
        {filterByMediaType.length === 0 ? (
          <h1>Start adding to your Watchlist!</h1>
        ) : (
          <List list={filterByMediaType} type={this.state.mediaPage} />
        )}
        <Navbar />
      </>
    );
  }
}

export default Watchlist;
