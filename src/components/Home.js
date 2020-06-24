import React, { Component } from "react";
import config from "../config";
import axios from "axios";

import Onboarding from "./Onboarding";
import Filter from "./Filter";
import Rater from "./Rater";
import Navbar from "./Navbar";

class Home extends Component {
  state = {
    user: this.props.loggedInUser,
    randomMedia: "",
    randomMediaType: "",
    list: [],
  };

  componentDidMount() {
    this.getRandomMedia();
  }

  getRandomMedia = () => {
    let random = Math.floor(Math.random() * 2);
    let mediaType;

    random === 1 ? (mediaType = "movie") : (mediaType = "tv");

    axios
      .get(
        `https://api.themoviedb.org/3/${mediaType}/popular?api_key=${process.env.REACT_APP_API_KEY}&language=en-US&page=1`
      )
      .then((res) => {
        let randomNum = Math.floor(Math.random() * res.data.results.length);
        
        // console.log(randomNum);
        // console.log(res.data.results);

        console.log(this.state.list)
        
        //FIX DUPLICATE MEDIAS

        for (let i = 0; i < res.data.results.length; i++) {
          if (this.state.list && this.state.list.some(
            e => { return e.apiId === res.data.results[i].id }
          )) {
            randomNum = i;
          }
        }

        this.setState({
          randomMedia: res.data.results[randomNum],
          randomMediaType: mediaType,
        });
      });
  };

  handleRate = (e) => {
    let rating = e.target.innerHTML;
    console.log(this.state.randomMedia);
    console.log(this.state.randomMediaType);
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
            this.state.randomMediaType == "movie"
              ? this.state.randomMedia.title
              : this.state.randomMedia.name,
        },
        { withCredentials: true }
      )
      .then((response) => {
        this.setState({
          list: response.list,
          randomMedia: "",
          randomMediaType: "",
        });
        this.getRandomMedia();
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
          title: this.state.randomMedia.title,
        },
        { withCredentials: true }
      )
      .then(() => {
        this.getRandomMedia();
      });
  };

  render() {
    const { list } = this.state.user;
    let rated = list.filter((media) => {
      return (media.listType = "rated");
    });

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
          <div>
            <Filter />
            <Rater />
            <Navbar />
          </div>
        )}
      </>
    );
  }
}
export default Home;
