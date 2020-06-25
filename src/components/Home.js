import React, { Component } from "react";
import config from "../config";
import axios from "axios";

import Filter from "./Filter";
import Navbar from "./Navbar";
import HomeRater from "./HomeRater";

class Home extends Component {
  state = {
    user: this.props.loggedInUser,
    randomMedia: "",
    randomMediaType: "",
    list: [],
    mediaPage: 'movies'
  };

  // componentDidMount() {
  //   axios
  //     .get(`${config.API_URL}/user`, { withCredentials: true })
  //     .then((res) => {
  //       this.setState({
  //         list: res.data.list
  //       }, () => {
  //         this.getRandomMedia();
  //       })
  //     })
  // }

  // getRandomMovie = () => {
  //   console.log('get random media console log')
  //   let random = Math.floor(Math.random() * 2);
  //   let mediaType;

  //   random === 1 ? (mediaType = "movie") : (mediaType = "tv");

  //   axios
  //     .get(
  //       `https://api.themoviedb.org/3/${mediaType}/popular?api_key=${process.env.REACT_APP_API_KEY}&language=en-US&page=1`
  //     )
  //     .then((res) => {
  //       let results = res.data.results.filter((media) => {
  //         return media.poster_path
  //       })

  //       let randomNum = Math.floor(Math.random() * results.length);
        
  //       this.setState({
  //         randomMedia: results[randomNum],
  //         randomMediaType: mediaType,
  //       });
  //     });
  // };

  handleSave = () => {
    axios
      .post(
        `${config.API_URL}/create`,
        {
          mediaType: this.state.randomMediaType,
          apiId: this.state.randomMedia.id,
          listType: "watchlist",
          description: this.state.randomMedia.overview,
          image: this.state.randomMedia.poster_path,
          title: this.state.randomMediaType === "movie"
          ? this.state.randomMedia.title
          : this.state.randomMedia.name,
        },
        { withCredentials: true }
      )
      .then((response) => {
        console.log(response.data.list)
        this.setState({
          list: response.data.list,
          randomMedia: "",
          randomMediaType: "",
        }, () => {
          this.getRandomMedia();
        });
      });
  }

  handleToggleMovie = () => {
    this.setState({
      mediaPage: "tvshows"
    })
  }

  handleToggleTV = () => {
    this.setState({
      mediaPage: "movies"
    })
  }

  render() {
    return (
      <>
        <Filter onMovieChange={this.handleToggleMovie} onTVChange={this.handleToggleTV} />
        <HomeRater onRate={this.props.onRate} onSkip={this.props.onSkip} onSave={this.props.onSave} />
        <Navbar />
      </>
    );
  }
}

export default Home;
