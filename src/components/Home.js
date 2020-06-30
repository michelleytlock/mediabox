import React, { Component } from "react";
import config from "../config";
import axios from "axios";

import MediaFilter from "./MediaFilter";
import Navbar from "./Navbar";
import HomeRater from "./HomeRater";
import Filter from "./Filter";

import "../styles/Home.css";

class Home extends Component {
  state = {
    user: this.props.loggedInUser,
    randomMedia: "",
    randomMediaType: "",
    list: [],
    mediaPage: "movie",
    recommendedState: true
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
            // console.log("CDM");
            // if (!window.localStorage.getItem("media")) {
            //   this.getRandomMedia();
            // }
            this.getRandomMedia();
          }
        );
      })
      .catch((err) => {
        console.log("userData err" + err);
      });
  }

  handleSearch = (e) => {
    e.preventDefault();
    
    console.log(e.target.search.value);
    console.log(this.props.history)

    axios
      .get(`${config.API_URL}/${this.state.mediaPage}/${e.target.search.value}/searchresults`, {
        withCredentials: true,
      })
      .then((res) => {
        console.log(res.data)

        let results = res.data.filter((media) => {
          return media.poster_path;
        });

        let objResults = {
          results: results,
          mediaPage: this.state.mediaPage
        }

        console.log(objResults)
        this.props.handleSearchProps(objResults)
        this.props.history.push('/search')
      })
      .catch((err) => {
        console.log("search err" + err);
      });
  };

  getRandomMedia = () => {
    // FILTER THROUGH LIST TO FIND "RATED" MEDIAS
    let allRated = this.state.list.filter((media) => {
      return media.listType === "rated";
    });

    // FILTER THROUGH LIST TO FIND THE CORRECT TYPE (MOVIE/TV)
    let ratedMediaType = allRated.filter((media) => {
      return media.mediaType === this.state.mediaPage;
    });

    // console.log(this.state.mediaPage);
    // console.log(ratedMediaType);
    // console.log(this.state.recommendedState);

    let randomRatedMediaIndex = Math.floor(
      Math.random() * ratedMediaType.length
    );

    let randomRatedMedia = ratedMediaType[randomRatedMediaIndex];

    console.log(randomRatedMedia)

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

        // console.log(randomResultsIndex);
        console.log(
          "This is recommended random media ",
          results[randomResultsIndex]
        );

        // window.localStorage.setItem("media", JSON.stringify(results[randomResultsIndex]));
        // window.localStorage.setItem("type", this.state.mediaPage);
        this.setState({
          recommendedState: true,
          randomMedia: results[randomResultsIndex],
          randomMediaType: this.state.mediaPage,
        });
      })
      .catch((err) => {
        console.log("getRandom err" + err);
      });
  };

  getTrendingMedia = () => {
    console.log(this.state.recommendedState);
    axios
      .get(
        `https://api.themoviedb.org/3/trending/${this.state.mediaPage}/day?api_key=${process.env.REACT_APP_API_KEY}`
      )
      .then((res) => {
        let results = res.data.results.filter((media) => {
          return media.poster_path;
        });

        let randomResultsIndex = Math.floor(Math.random() * results.length);
        console.log("This is trending media ", results[randomResultsIndex]);
        this.setState({
          recommendedState: false,
          randomMedia: results[randomResultsIndex],
          randomMediaType: this.state.mediaPage,
        });
      })
      .catch((err) => {
        console.log("gettrending err" + err);
      });
  };

  handleRate = (e) => {
    let rating = e.target.innerHTML;
    console.log(this.state.recommendedState);
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
          genres: this.state.randomMedia.genres
        },
        { withCredentials: true }
      )
      .then((response) => {
        console.log(response.data.list);

        // FIX RATED MOVIES RENDERING AGAIN HERE

        // window.localStorage.removeItem("media");
        this.setState(
          {
            list: response.data.list,
            randomMedia: "",
            randomMediaType: "",
          },
          () => {
            this.recommendedState
              ? this.getRandomMedia()
              : this.getTrendingMedia();
          }
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
          () => {
            this.recommendedState
              ? this.getRandomMedia()
              : this.getTrendingMedia();
          }
        );
      })
      .catch((err) => {
        console.log("skip err" + err);
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
          () => {
            this.recommendedState
              ? this.getRandomMedia()
              : this.getTrendingMedia();
          }
        );
      })
      .catch((err) => {
        console.log("save to watchlist err" + err);
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
    let media = this.state.randomMedia;
    let type = this.state.randomMediaType;

    // if (window.localStorage.getItem("media")) {
    //   media = JSON.parse(window.localStorage.getItem("media"));
    //   type = window.localStorage.getItem("type")
    // }

    return (
      <div className="home-page">
        <MediaFilter
          onMovieChange={this.handleToggleMovie}
          onTVChange={this.handleToggleTV}
        />
        <Filter
          type={type}
          trending={this.getTrendingMedia}
          recommended={this.getRandomMedia}
          onSearch={this.handleSearch}
        />
        <HomeRater
          random={media}
          type={type}
          onRate={this.handleRate}
          onSkip={this.handleSkip}
          onSave={this.handleSave}
        />
        <Navbar />
      </div>
    );
  }
}

export default Home;
