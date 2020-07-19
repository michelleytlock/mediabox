import React, { Component } from "react";
import config from "../config";
import axios from "axios";
import FadeIn from "react-fade-in";
import Lottie from "react-lottie";
import loadingData from "../pageLoadingAnimation.json";

import Onboarding from "./Onboarding";
import Home from "./Home";

// This component makes user go through onboarding flow or skip straight to homepage
class Intro extends Component {

  state = {
    user: this.props.loggedInUser, // Session user
    randomMedia: "",
    randomMediaType: "",
    list: [], // User's list
    dataFetched: false,
  };

  componentDidMount() {
    // Call to server to get most updated user list
    axios
      .get(`${config.API_URL}/userData`, { withCredentials: true })
      .then((res) => {
        this.setState({
          list: res.data.list,
          dataFetched: true,
        });

        let rated = [];

        // If user's list is not empty
        if (this.state.list.length !== 0) {
          // Filter only rated medias
          rated = this.state.list.filter((media) => {
            return (media.listType = "rated");
          });
        }

        // If there are less than 10 rated movies or tv shows, get another random media for the onboarding flow
        if (rated.length < 10) {
          this.getRandomMedia();
        }
      })
      .catch((err) => {
        console.log("CDM err" + err);
        this.setState({
          dataFetched: true,
        });
      });
  }

  // This method generates a random recommended movie or tv show
  getRandomMedia = () => {
    // Random Number to randomize media type
    let random = Math.floor(Math.random() * 2);
    let mediaType;

    random === 1 ? (mediaType = "movie") : (mediaType = "tv");

    // External API call to get list of popular movies or tv shows
    axios
      .get(
        `https://api.themoviedb.org/3/${mediaType}/popular?api_key=${process.env.REACT_APP_API_KEY}&language=en-US&page=1`
      )
      .then((res) => {
        // Only return results with a poster image
        let results = res.data.results.filter((media) => {
          return media.poster_path;
        });

        // Only return new results that haven't already been rated, skipped or watchlisted
        let filterForRepeats = results.filter((media) => {
          let check = true;
          this.state.list.forEach((element) => {
            if (media.id === element.apiId) {
              check = false;
            }
          });
          return check;
        });

        // Random index number
        let randomNum = Math.floor(Math.random() * filterForRepeats.length);

        this.setState({
          randomMedia: filterForRepeats[randomNum],
          randomMediaType: mediaType,
        });
      })
      .catch((err) => {
        console.log("getrandom err" + err);
      });
  };

  // This method handles the rating functionality
  handleRate = (e) => {
    e.preventDefault();
    let rating = e.target.innerHTML; // Rating of 1, 2, 3, 4, or 5

    const { randomMediaType, randomMedia } = this.state;

    // Call to server that handles media (adds to database, adds to user's list with listType = "rated" and a rating)
    axios
      .post(
        `${config.API_URL}/create`,
        {
          mediaType: randomMediaType,
          apiId: randomMedia.id,
          listType: "rated",
          rating,
          description: randomMedia.overview,
          image: randomMedia.poster_path,
          title:
            randomMediaType === "movie" ? randomMedia.title : randomMedia.name, // Different due to external API calling it different based on whether media is movie or tv show
          genres: randomMedia.genre_ids,
        },
        { withCredentials: true }
      )
      .then((response) => {

        this.setState({
          list: response.data.list,
          randomMedia: "",
          randomMediaType: "",
        });

        // Filter only rated medias
        let rated = this.state.list.filter((media) => {
          return media.listType === "rated";
        });

        // If there are less than 10 rated movies or tv shows, get another random media for the onboarding flow
        if (rated.length < 10) {
          this.getRandomMedia();
        }
      })
      .catch((err) => {
        console.log("create media err" + err);
      });
  };

  // This method handles the skipping functionality
  handleSkip = () => {
    const { randomMediaType, randomMedia } = this.state;

    // Call to server that handles media (adds to database, adds to user's list with listType = "skipped")
    axios
      .post(
        `${config.API_URL}/create`,
        {
          mediaType: randomMediaType,
          apiId: randomMedia.id,
          listType: "skipped",
          description: randomMedia.overview,
          image: randomMedia.poster_path,
          title:
            randomMediaType === "movie" ? randomMedia.title : randomMedia.name, // Different due to external API calling it different based on whether media is movie or tv show
          genres: randomMedia.genre_ids,
        },
        { withCredentials: true }
      )
      .then((response1) => {
        this.setState(
          {
            list: response1.data.list,
            randomMedia: "",
            randomMediaType: "",
          },
          () => {
            // Filter only rated medias
            let rated = this.state.list.filter((media) => {
              return media.listType === "rated";
            });

            // If there are less than 10 rated movies or tv shows, get another random media for the onboarding flow
            if (rated.length < 10) {
              this.getRandomMedia();
            }
          }
        );
      })
      .catch((err) => {
        console.log("skip err" + err);
      });
  };

  render() {
    const { list, dataFetched } = this.state;

    // Filter only rated medias
    let rated = list.filter((media) => {
      return media.listType === "rated";
    });

    // Animation options
    const defaultOptions = {
      loop: true,
      autoplay: true,
      animationData: loadingData,
      rendererSettings: {
        preserveAspectRatio: "xMidYMid slice",
      },
    };

    // Load animation
    if (!dataFetched) {
      return (
        <div className="loading">
          <FadeIn className="loading-animation">
            <Lottie options={defaultOptions} height={250} width={250} />
          </FadeIn>
        </div>
      );
    }

    return (
      <>
        {/* If there are less than 10 rated medias, then user should go through onboarding flow */}
        {rated.length < 10 ? (
          <Onboarding
            ratedList={rated}
            random={this.state.randomMedia}
            onRate={this.handleRate}
            onSkip={this.handleSkip}
          />
        ) : (
          <Home {...this.props} />
        )}
      </>
    );
  }
}
export default Intro;
