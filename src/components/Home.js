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

  componentDidMount() {    
    axios
      .get(`${config.API_URL}/user`, { withCredentials: true })
      .then((res) => {
        this.setState({
          list: res.data.list
        }, () => {
          this.getRandomMovie();
        })
      })
  }

  getRandomMovie = () => {
    let rated = this.state.list.filter((media) => {
      return media.listType === "rated"
    })

    let randomRatedMovieIndex = Math.floor(Math.random() * rated.length);

    let randomRatedMovie = rated[randomRatedMovieIndex]

    axios
      .get(`https://api.themoviedb.org/3/movie/${randomRatedMovie.apiId}/recommendations?api_key=${process.env.REACT_APP_API_KEY}&language=en-US&page=1`
      )
      .then((res) => {
        // console.log(res.data.total_pages)
        let results = res.data.results.filter((media) => {
          return media.poster_path
        })

        let randomResultsIndex = Math.floor(Math.random() * results.length);
        
        console.log(randomResultsIndex);
        console.log(results[randomResultsIndex]);

        // console.log(this.state.list)
        this.setState({
          randomMedia: results[randomResultsIndex],
          randomMediaType: "movie",
        });
      });
  };

  handleRate = (e) => {
    let rating = e.target.innerHTML;

    axios
      .post(
        `${config.API_URL}/create`,
        {
          mediaType: this.state.randomMediaType,
          apiId: this.state.randomMedia.id,
          listType: "rated",
          rating,
          description: this.state.randomMedia.overview,
          image: this.state.randomMedia.poster_path,
          title:
            this.state.randomMediaType === "movie"
              ? this.state.randomMedia.title
              : this.state.randomMedia.name,
        },
        { withCredentials: true }
      )
      .then((response) => {
        console.log(response.data.list)
        
        // FIX RATED MOVIES RENDERING AGAIN HERE

        this.setState({
          list: response.data.list,
          randomMedia: "",
          randomMediaType: "",
        }, this.getRandomMovie);
        
      })
      .catch((err) => {
        console.log("create media err" + err);
      });
  };

  handleSkip = () => {
    axios
      .post(
        `${config.API_URL}/create`,
        {
          mediaType: this.state.randomMediaType,
          apiId: this.state.randomMedia.id,
          listType: "skipped",
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
        }, this.getRandomMovie);
      });
  };

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
        }, this.getRandomMovie);
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
        <HomeRater random={this.state.randomMedia} onRate={this.handleRate} onSkip={this.handleSkip} onSave={this.handleSave} />
        <Navbar />
      </>
    );
  }
}

export default Home;
