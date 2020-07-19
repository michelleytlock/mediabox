import React, { Component } from "react";
import config from "../config";
import axios from "axios";
import FadeIn from "react-fade-in";
import Lottie from "react-lottie";
import loadingData from "../pageLoadingAnimation.json";

import Onboarding from "./Onboarding";
import Home from "./Home";

class Intro extends Component {
  
  state = {
    user: this.props.loggedInUser,
    randomMedia: "",
    randomMediaType: "",
    list: [],
    dataFetched: false,
  };

  componentDidMount() {
    axios
      .get(`${config.API_URL}/userData`, { withCredentials: true })
      .then((res) => {
        // console.log(this.props)
        this.setState({
          list: res.data.list,
          dataFetched: true,
        });

        let rated = [];

        if (this.state.list.length !== 0) {
          rated = this.state.list.filter((media) => {
            return (media.listType = "rated");
          });
        }

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
        console.log(res.data.results);
        let results = res.data.results.filter((media) => {
          return media.poster_path;
        });

        let filterForRepeats = results.filter((media) => {
          let check = true;
          this.state.list.forEach((element) => {
            if (media.id === element.apiId) {
              check = false;
            }
          });
          return check;
        });

        console.log(filterForRepeats);
        console.log(this.state.list);

        let randomNum = Math.floor(Math.random() * filterForRepeats.length);

        console.log(filterForRepeats[randomNum]);

        this.setState({
          randomMedia: filterForRepeats[randomNum],
          randomMediaType: mediaType,
        });
      })
      .catch((err) => {
        console.log("getrandom err" + err);
      });
  };

  handleRate = (e) => {
    e.preventDefault();
    let rating = e.target.innerHTML;
    console.log("rating ", rating);
    // console.log(this.state.randomMediaType);
    const { randomMediaType, randomMedia } = this.state;
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
            randomMediaType === "movie" ? randomMedia.title : randomMedia.name,
          genres: randomMedia.genre_ids,
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
    console.log("skipping");
    const { randomMediaType, randomMedia } = this.state;
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
            randomMediaType === "movie" ? randomMedia.title : randomMedia.name,
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
            let rated = this.state.list.filter((media) => {
              return media.listType === "rated";
            });

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

    let rated = list.filter((media) => {
      return media.listType === "rated";
    });

    const defaultOptions = {
      loop: true,
      autoplay: true,
      animationData: loadingData,
      rendererSettings: {
        preserveAspectRatio: "xMidYMid slice",
      },
    };

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
