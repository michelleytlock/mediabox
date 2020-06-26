import React, { Component } from "react";
import config from "../config";
import axios from "axios";

import MediaFilter from "./MediaFilter";
import Navbar from "./Navbar";
import HomeRater from "./HomeRater";
import Filter from "./Filter";

class Home extends Component {
  state = {
    user: this.props.loggedInUser,
    randomMedia: "",
    randomMediaType: "",
    list: [],
    mediaPage: "movie",
  };

  componentDidMount() {
    axios
      .get(`${config.API_URL}/userData`, { withCredentials: true })
      .then((res) => {
        this.setState(
          {
            list: res.data.list,
          },
          () => {
            console.log('CDM')
            if (!window.localStorage.getItem("media")) {
              this.getRandomMedia();
            }
          }
        );
      });
  }

  getRandomMedia = () => {
    // FILTER THROUGH LIST TO FIND "RATED" MEDIAS
    let allRated = this.state.list.filter((media) => {
      return media.listType === "rated";
    });

    // FILTER THROUGH LIST TO FIND THE CORRECT TYPE (MOVIE/TV)
    let ratedMediaType = allRated.filter((media) => {
      return media.mediaType === this.state.mediaPage;
    });

    console.log(this.state.mediaPage);
    console.log(ratedMediaType);

    let randomRatedMediaIndex = Math.floor(
      Math.random() * ratedMediaType.length
    );

    let randomRatedMedia = ratedMediaType[randomRatedMediaIndex];

    axios
      .get(
        `https://api.themoviedb.org/3/${this.state.mediaPage}/${randomRatedMedia.apiId}/recommendations?api_key=${process.env.REACT_APP_API_KEY}&language=en-US&page=1`
      )
      .then((res) => {
        // console.log(res.data.total_pages)
        let results = res.data.results.filter((media) => {
          return media.poster_path;
        });

        let randomResultsIndex = Math.floor(Math.random() * results.length);

        console.log(randomResultsIndex);
        console.log('This is set ',results[randomResultsIndex]);
        window.localStorage.setItem("media", JSON.stringify(results[randomResultsIndex]));
        window.localStorage.setItem("type", this.state.mediaPage);
        this.setState({
          randomMedia: results[randomResultsIndex],
          randomMediaType: this.state.mediaPage,
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
        console.log(response.data.list);

        // FIX RATED MOVIES RENDERING AGAIN HERE

        this.setState(
          {
            list: response.data.list,
            randomMedia: "",
            randomMediaType: "",
          },
          this.getRandomMedia
        );
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
          title:
            this.state.randomMediaType === "movie"
              ? this.state.randomMedia.title
              : this.state.randomMedia.name,
        },
        { withCredentials: true }
      )
      .then((response) => {
        console.log(response.data.list);
        this.setState(
          {
            list: response.data.list,
            randomMedia: "",
            randomMediaType: "",
          },
          this.getRandomMedia
        );
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
          title:
            this.state.randomMediaType === "movie"
              ? this.state.randomMedia.title
              : this.state.randomMedia.name,
        },
        { withCredentials: true }
      )
      .then((response) => {
        console.log(response.data.list);
        this.setState(
          {
            list: response.data.list,
            randomMedia: "",
            randomMediaType: "",
          },
          this.getRandomMedia
        );
      });
  };

  handleToggleMovie = () => {
    this.setState(
      {
        mediaPage: "movie",
      },
      this.getRandomMedia
    );
  };

  handleToggleTV = () => {
    this.setState(
      {
        mediaPage: "tv",
      },
      this.getRandomMedia
    );
  };

  render() {
    let media = this.state.randomMedia
    let type = this.state.randomMediaType;

    if (window.localStorage.getItem("media")) {
      media = JSON.parse(window.localStorage.getItem("media"));
      type = window.localStorage.getItem("type")
    }

    return (
      <>
        <MediaFilter
          onMovieChange={this.handleToggleMovie}
          onTVChange={this.handleToggleTV}
        />
        <Filter type={type}/>
        <HomeRater
          random={media}
          type={type}
          onRate={this.handleRate}
          onSkip={this.handleSkip}
          onSave={this.handleSave}
        />
        <Navbar />
      </>
    );
  }
}

export default Home;
