import React, { Component } from "react";
import config from "../config";
import axios from "axios";

// COMPONENTS
import MediaFilter from "./MediaFilter";
import Navbar from "./Navbar";
import HomeRater from "./HomeRater";
import Filter from "./Filter";

// STYLES 
import "../styles/Home.css";

class Home extends Component {

  state = {
    user: this.props.loggedInUser, // Session user
    randomMedia: "",
    randomMediaType: "",
    list: [], // User's list
    mediaPage: "movie", // Default is movie
    recommendedState: true, // Default will show recommended movies
  };

  componentDidMount() {
    // Call to server to get most updated user list
    axios
      .get(`${config.API_URL}/userData`, { withCredentials: true })
      .then((res) => {
        this.setState(
          {
            list: res.data.list,
          },
          () => {
            // if (!window.localStorage.getItem("media")) {
            //   this.getRandomMedia();
            // }
            this.getRandomMedia(); // Get random media immediately during component mounting
          }
        );
      })
      .catch((err) => {
        console.log("userData err" + err);
      });
  }

  // This method handles the search functionality
  handleSearch = (e) => {
    e.preventDefault();
    
    // Sends search input to server to handle the external API search call (external api call does not work on client side so have to do from server side)
    axios
      .get(`${config.API_URL}/${e.target.search.value}/searchresults`, {
        withCredentials: true,
      })
      .then((res) => {
        // res.data might include people, movies and/or tv

        let people = res.data.filter((result) => {
          return result.media_type === "person" && result.profile_path
        })

        let movies = res.data.filter((media) => {
          return media.media_type === "movie" && media.poster_path
        });

        let tv = res.data.filter((media) => {
          return media.media_type === "tv" && media.poster_path
        })

        // Combine all into one results object
        let objResults = {
          people, movies, tv
        }

        // Send to App component to pass to /search route
        this.props.handleSearchProps(objResults)
      })
      .catch((err) => {
        console.log("search err" + err);
      });
  };

  // This method generates a random recommended movie or tv show
  getRandomMedia = () => {
    // Filter through list to get media already rated (so that something random based on rated movies/tv shows can be called)
    let allRated = this.state.list.filter((media) => {
      return media.listType === "rated";
    });

    // Filter for correct media type
    let ratedMediaType = allRated.filter((media) => {
      return media.mediaType === this.state.mediaPage;
    });

    // Filter to find only 3, 4, 5 ratings
    let likedMedia = ratedMediaType.filter((media) => {
      return media.rating === 3 || media.rating === 4 || media.rating === 5
    })

    // Random index number
    let randomRatedMediaIndex = Math.floor(
      Math.random() * likedMedia.length
    );

    // Random rated movie/tv show
    let randomRatedMedia = likedMedia[randomRatedMediaIndex];

    // Call to external API to get media related to randomRatedMedia
    axios
      .get(
        `https://api.themoviedb.org/3/${this.state.mediaPage}/${randomRatedMedia.apiId}/recommendations?api_key=${process.env.REACT_APP_API_KEY}&language=en-US&page=1`
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
              check = false
            }
          })
          return check
        })

        // Random index number
        let randomResultsIndex = Math.floor(Math.random() * filterForRepeats.length);

        // window.localStorage.setItem("media", JSON.stringify(results[randomResultsIndex]));
        // window.localStorage.setItem("type", this.state.mediaPage);

        this.setState({
          recommendedState: true,
          randomMedia: filterForRepeats[randomResultsIndex],
          randomMediaType: this.state.mediaPage,
        });
      })
      .catch((err) => {
        console.log("getRandom err" + err);
      });
  };

  // This method generates a random trending movie or tv show
  getTrendingMedia = () => {
    // External API call to get list of trending movies or tv shows
    axios
      .get(
        `https://api.themoviedb.org/3/trending/${this.state.mediaPage}/day?api_key=${process.env.REACT_APP_API_KEY}`
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
              check = false
            }
          })
          return check
        })

        // Random index number
        let randomResultsIndex = Math.floor(Math.random() * results.length);

        this.setState({
          recommendedState: false,
          randomMedia: filterForRepeats[randomResultsIndex],
          randomMediaType: this.state.mediaPage,
        });
      })
      .catch((err) => {
        console.log("get trending err" + err);
      });
  };

  // This method handles the rating functionality
  handleRate = (e) => {
    let rating = e.target.innerHTML; // Rating of 1, 2, 3, 4, or 5
    
    // Call to server that handles media (adds to database, adds to user's list with listType = "rated" and a rating)
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
              : this.state.randomMedia.name, // Different due to external API calling it different based on whether media is movie or tv show
          genres: this.state.randomMedia.genres
        },
        { withCredentials: true }
      )
      .then((response) => {
        // window.localStorage.removeItem("media");
        this.setState(
          {
            list: response.data.list,
            randomMedia: "",
            randomMediaType: "",
          },
          () => {
            this.state.recommendedState
              ? this.getRandomMedia()
              : this.getTrendingMedia();
          }
        );
      })
      .catch((err) => {
        console.log("create media err" + err);
      });
  };

  // This method handles the skipping functionality
  handleSkip = () => {
    // Call to server that handles media (adds to database, adds to user's list with listType = "skipped") 
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
              : this.state.randomMedia.name, // Different due to external API calling it different based on whether media is movie or tv show
        },
        { withCredentials: true }
      )
      .then((response) => {
        this.setState(
          {
            list: response.data.list,
            randomMedia: "",
            randomMediaType: "",
          },
          () => {
            this.state.recommendedState
              ? this.getRandomMedia()
              : this.getTrendingMedia();
          }
        );
      })
      .catch((err) => {
        console.log("skip err" + err);
      });
  };

  // This method handles the watchlist functionality
  handleSave = () => {
    // Call to server that handles media (adds to database, adds to user's list with listType = "watchlist") 
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
              : this.state.randomMedia.name, // Different due to external API calling it different based on whether media is movie or tv show
        },
        { withCredentials: true }
      )
      .then((response) => {
        this.setState(
          {
            list: response.data.list,
            randomMedia: "",
            randomMediaType: "",
          },
          () => {
            this.state.recommendedState
              ? this.getRandomMedia()
              : this.getTrendingMedia();
          }
        );
      })
      .catch((err) => {
        console.log("save to watchlist err" + err);
      });
  };

  // This method toggles the mediaPage state to "movie"
  handleToggleMovie = (e) => {

    this.setState(
      {
        mediaPage: "movie",
      },
      this.getRandomMedia
    );
  };

  // This method toggles the mediaPage state to "tv"
  handleToggleTV = (e) => {

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
        <MediaFilter mediaType={this.state.mediaPage} 
          onMovieChange={this.handleToggleMovie}
          onTVChange={this.handleToggleTV}
        />
        <Filter recommendedState={this.state.recommendedState}
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
