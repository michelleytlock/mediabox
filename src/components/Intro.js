import React, { Component } from "react";
import config from "../config";
import axios from "axios";

import Onboarding from "./Onboarding";
import Home from "./Home";

class Intro extends Component {
  state = {
    user: this.props.loggedInUser,
    randomMedia: "",
    randomMediaType: "",
    list: [],
  };

  componentDidMount() {
    axios
      .get(`${config.API_URL}/userData`, { withCredentials: true })
      .then((res) => {
        this.setState({
          list: res.data.list,
        });

        let rated = this.state.list.filter((media) => {
          return (media.listType = "rated");
        });

        if (rated.length < 10) {
          this.getRandomMedia();
        }
      })
      .catch((err) => {
        console.log("CDM err" + err);
      });
  }

  getRandomMedia = () => {
    console.log("get random media console log");
    let random = Math.floor(Math.random() * 2);
    let mediaType;

    random === 1 ? (mediaType = "movie") : (mediaType = "tv");

    axios
      .get(
        `https://api.themoviedb.org/3/${mediaType}/popular?api_key=${process.env.REACT_APP_API_KEY}&language=en-US&page=1`
      )
      .then((res) => {
        let results = res.data.results.filter((media) => {
          return media.poster_path;
        });

        let randomNum = Math.floor(Math.random() * results.length);

        // console.log(randomNum);
        // console.log(results);
        console.log(results[randomNum]);

        //FIX DUPLICATE MEDIAS

        // for (let i = 0; i < results.length; i++) {
        //   if (this.state.list && this.state.list.some(
        //     e => { return e.apiId === results[i].id }
        //   )) {
        //     randomNum = i;
        //   }
        // }

        this.setState({
          randomMedia: results[randomNum],
          randomMediaType: mediaType,
        });
      })
      .catch((err) => {
        console.log("getrandom err" + err);
      });
  };

  handleRate = (e) => {
    let rating = e.target.innerHTML;
    console.log(this.state.randomMedia.genre_ids);
    // console.log(this.state.randomMediaType);
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
          genres: this.state.randomMedia.genre_ids,
        },
        { withCredentials: true }
      )
      .then((response) => {
        console.log(response.data.list);
        this.setState({
          list: response.data.list,
          randomMedia: "",
          randomMediaType: "",
        });

        let rated = this.state.list.filter((media) => {
          return media.listType === "rated";
        });

        if (rated.length < 10) {
          this.getRandomMedia();
        }
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
          genres: this.state.randomMedia.genre_ids,
        },
        { withCredentials: true }
      )
      .then((response) => {
        console.log(response.data.list);
        this.setState({
          list: response.data.list,
          randomMedia: "",
          randomMediaType: "",
        });

        let rated = this.state.list.filter((media) => {
          return media.listType === "rated";
        });

        if (rated.length < 10) {
          this.getRandomMedia();
        }
      })
      .catch((err) => {
        console.log("skip err" + err);
      });
  };

  render() {
    const { list } = this.state;
    // console.log(list)
    let rated = list.filter((media) => {
      return (media.listType = "rated");
    });

    // console.log(rated)
    return (
      <>
        {rated.length < 10 ? (
          <Onboarding
            ratedList={rated}
            random={this.state.randomMedia}
            onRate={this.handleRate}
            onSkip={this.handleSkip}
          />
        ) : (
          <Home />
        )}
      </>
    );
  }
}
export default Intro;
