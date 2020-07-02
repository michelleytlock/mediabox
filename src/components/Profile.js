import React, { Component } from "react";
import config from "../config";
import axios from "axios";
import Chart from "chart.js";
import Icon from "@mdi/react";
import { mdiAccount } from "@mdi/js";

import Navbar from "./Navbar";
import MediaFilter from "./MediaFilter";
import List from "./List";

import "../styles/Profile.css";

class Profile extends Component {
  state = {
    ratedMovies: [],
    ratedTVShows: [],
    topMovieGenres: [],
    topTVGenres: [],
    mediaPage: "movie",
    allMovieGenres: [],
    allTVGenres: [],
    listView: false,
    showModal: false,
  };

  componentDidMount() {
    axios
      .get(`${config.API_URL}/userData`, { withCredentials: true })
      .then((res) => {
        axios
          .get(`${config.API_URL}/getGenres`, { withCredentials: true })
          .then((genres) => {
            //FILTER ONLY RATED MEDIAS
            let rated = res.data.list.filter((media) => {
              return media.listType === "rated";
            });

            //FILTER BY MEDIA TYPE
            let movies = rated.filter((media) => {
              return media.mediaType === "movie";
            });

            let tvShows = rated.filter((media) => {
              return media.mediaType === "tv";
            });

            //FIND MOST WATCHED MOVIE GENRES
            let listOfMovieGenres = {};
            movies.forEach((movie) => {
              for (let i = 0; i < movie.mediaId.genres.length; i++) {
                let genreId = movie.mediaId.genres[i];
                if (!listOfMovieGenres[genreId]) {
                  listOfMovieGenres[genreId] = 1;
                } else {
                  listOfMovieGenres[genreId]++;
                }
              }
            });
            let movieGenresArr = [];
            for (let id in listOfMovieGenres) {
              movieGenresArr.push([id, listOfMovieGenres[id]]);
            }
            movieGenresArr.sort((a, b) => {
              return b[1] - a[1];
            });
            let newMovieGenresArr = movieGenresArr.slice(0, 3).map((id) => {
              return Number(id[0]);
            });

            let topMovieGenres = genres.data.movie.genres.filter((genre) => {
              return newMovieGenresArr.includes(genre.id);
            });

            let chartMovieGenres = genres.data.movie.genres.reduce(
              (filtered, elem) => {
                for (let i = 0; i < movieGenresArr.length; i++) {
                  if (elem.id === Number(movieGenresArr[i][0])) {
                    movieGenresArr[i][0] = elem.name;
                    filtered.push(movieGenresArr[i]);
                  }
                }
                return filtered;
              },
              []
            );

            //FIND MOST WATCHED TV GENRES
            let listOfTVGenres = {};
            tvShows.forEach((tv) => {
              for (let i = 0; i < tv.mediaId.genres.length; i++) {
                let genreId = tv.mediaId.genres[i];
                if (!listOfTVGenres[genreId]) {
                  listOfTVGenres[genreId] = 1;
                } else {
                  listOfTVGenres[genreId]++;
                }
              }
            });
            let tvGenresArr = [];
            for (let id in listOfTVGenres) {
              tvGenresArr.push([id, listOfTVGenres[id]]);
            }
            tvGenresArr.sort((a, b) => {
              return b[1] - a[1];
            });

            let newTvGenresArr = tvGenresArr.slice(0, 3).map((id) => {
              return Number(id[0]);
            });

            let topTVGenres = genres.data.tv.genres.filter((genre) => {
              return newTvGenresArr.includes(genre.id);
            });

            let chartTVGenres = genres.data.tv.genres.reduce(
              (filtered, elem) => {
                for (let i = 0; i < tvGenresArr.length; i++) {
                  if (elem.id === Number(tvGenresArr[i][0])) {
                    tvGenresArr[i][0] = elem.name;
                    filtered.push(tvGenresArr[i]);
                  }
                }
                return filtered;
              },
              []
            );

            // console.log(genres.data.movie);
            // console.log(newMovieGenresArr);
            // console.log(topMovieGenres);
            // console.log(topTVGenres);
            // console.log(genres.data.movie.genres)

            this.setState(
              {
                profileImg: res.data.profileImg,
                ratedMovies: movies,
                ratedTVShows: tvShows,
                topMovieGenres,
                topTVGenres,
                allMovieGenres: chartMovieGenres,
                allTVGenres: chartTVGenres,
              },
              () => {
                this.renderChart();
              }
            );
          })
          .catch((err) => {
            console.log(err);
          });
      })
      .catch((err) => {
        console.log(err);
      });
  }

  handleToggleMovie = () => {
    this.setState(
      {
        mediaPage: "movie",
      },
      () => {
        this.renderChart();
      }
    );
  };

  handleToggleTV = () => {
    this.setState(
      {
        mediaPage: "tv",
      },
      () => {
        this.renderChart();
      }
    );
  };

  handleSort = (e) => {
    console.log(e.target.value);
    if (e.target.value === "alpha") {
      let movies = this.state.ratedMovies;
      let tv = this.state.ratedTVShows;

      let alphaMovies = movies.sort((a, b) => {
        if (a.mediaId.title < b.mediaId.title) {
          return -1;
        } else if (a.mediaId.title > b.mediaId.title) {
          return 1;
        }
        return 0;
      });

      console.log(alphaMovies);

      let alphaTV = tv.sort((a, b) => {
        if (a.mediaId.title < b.mediaId.title) {
          return -1;
        } else if (a.mediaId.title > b.mediaId.title) {
          return 1;
        }
        return 0;
      });

      console.log(alphaTV);

      this.setState({
        ratedMovies: alphaMovies,
        ratedTVShows: alphaTV,
      });
    } else {
      let sortRatingMovies = this.state.ratedMovies.sort((a, b) => {
        return b.rating - a.rating;
      });

      let sortRatingTV = this.state.ratedTVShows.sort((a, b) => {
        return b.rating - a.rating;
      });

      this.setState({
        ratedMovies: sortRatingMovies,
        ratedTVShows: sortRatingTV,
      });
    }
  };

  handleProfilePic = (e) => {
    e.preventDefault();
    let imageUrl = e.target.file.files[0];
    console.log(imageUrl);

    let uploadData = new FormData();
    uploadData.append("imageUrl", imageUrl);

    axios
      .post(`${config.API_URL}/upload`, uploadData)
      .then((response) => {
        let profileImg = response.data.secure_url;
        console.log(profileImg);
        axios
          .patch(
            `${config.API_URL}/editProfile`,
            { profileImg },
            { withCredentials: true }
          )
          .then(() => {
            this.setState({
              profileImg: response.data.secure_url,
            });
          })
          .catch((err) => {
            console.log(err);
          });
      })
      .catch((err) => {
        console.log(err);
      });
  };

  handleLogOut = () => {
    axios
      .get(`${config.API_URL}/logout`)
      .then(() => {
        this.props.history.push("/");
      })
      .catch((err) => {
        console.log(err);
      });
  };

  handleDeleteModal = () => {
    this.setState({
      showModal: !this.state.showModal,
    });
  };

  handleDeleteAccount = () => {
    axios
      .delete(`${config.API_URL}/user`, { withCredentials: true })
      .then(() => {
        this.props.history.push("/");
      })
      .catch((err) => {
        console.log(err);
      });
  };

  handleList = () => {
    this.setState({
      listView: !this.state.listView,
    });
  };

  renderChart = () => {
    const {
      ratedMovies,
      ratedTVShows,
      allMovieGenres,
      allTVGenres,
    } = this.state;

    let ones = 0,
      twos = 0,
      threes = 0,
      fours = 0,
      fives = 0;

    if (this.state.mediaPage === "movie") {
      for (let i = 0; i < ratedMovies.length; i++) {
        switch (ratedMovies[i].rating) {
          case 1:
            ones++;
            break;
          case 2:
            twos++;
            break;
          case 3:
            threes++;
            break;
          case 4:
            fours++;
            break;
          case 5:
            fives++;
            break;
          default:
            console.log(ratedMovies[i].apiId + "missing rating");
            break;
        }
      }
    } else {
      for (let i = 0; i < ratedTVShows.length; i++) {
        switch (ratedTVShows[i].rating) {
          case 1:
            ones++;
            break;
          case 2:
            twos++;
            break;
          case 3:
            threes++;
            break;
          case 4:
            fours++;
            break;
          case 5:
            fives++;
            break;
          default:
            console.log(ratedTVShows[i].apiId + "missing rating");
            break;
        }
      }
    }

    var ctx = document.getElementById("myChart");
    new Chart(ctx, {
      type: "bar",
      data: {
        labels: ["1", "2", "3", "4", "5"],
        datasets: [
          {
            label: "ratings",
            data: [ones, twos, threes, fours, fives],
            backgroundColor: [
              "rgba(255, 64, 0, 1)",
              "rgba(255, 213, 0, 1)",
              "rgba(14, 173, 0, 1)",
              "rgba(0, 110, 255, 1)",
              "rgba(114, 0, 245, 1)",
            ],
            borderColor: [
              "rgba(255, 99, 132, 1)",
              "rgba(54, 162, 235, 1)",
              "rgba(255, 206, 86, 1)",
              "rgba(75, 192, 192, 1)",
              "rgba(153, 102, 255, 1)",
            ],
            borderWidth: 0,
          },
        ],
      },
      options: {
        title: {
          display: true,
          text: `Rated ${
            this.state.mediaPage.substring(0, 1).toUpperCase() +
            this.state.mediaPage.substring(1)
          }s`,
        },
        legend: {
          display: false,
        },
        tooltips: {
          enabled: false,
        },
        scales: {
          xAxes: [
            {
              gridLines: {
                drawBorder: true,
                drawOnChartArea: false,
              },
            },
          ],
          yAxes: [
            {
              display: false,
            },
          ],
        },
      },
    });

    let genreLabels = [];
    let genreData = [];

    // console.log(allMovieGenres)
    if (this.state.mediaPage === "movie") {
      genreLabels = allMovieGenres.map((elem) => {
        return elem[0];
      });

      genreData = allMovieGenres.map((elem) => {
        return elem[1];
      });
    } else {
      genreLabels = allTVGenres.map((elem) => {
        return elem[0];
      });

      genreData = allTVGenres.map((elem) => {
        return elem[1];
      });
    }

    let num = genreLabels.length;
    console.log(num);

    let colors = [
      "rgba(255, 99, 132, 1)",
      "rgba(255, 154, 3, 1)",
      "rgba(255, 206, 86, 1)",
      "rgba(255, 64, 0, 1)",
      "rgba(14, 173, 0, 1)",
      "rgba(0, 110, 255, 1)",
      "rgba(114, 0, 245, 1)",
      "rgba(0, 185, 227, 1)",
      "rgba(255, 209, 84, 1)",
      "rgba(200, 255, 20, 1)",
      "rgba(115, 115, 115 1)",
    ];

    let genreColors = colors.slice(0, num);

    var ctx2 = document.getElementById("myDoughnutChart");
    new Chart(ctx2, {
      type: "doughnut",
      data: {
        datasets: [
          {
            data: genreData,
            backgroundColor: genreColors,
            borderColor: genreColors,
          },
        ],
        labels: genreLabels,
      },
      options: {
        tooltips: {
          enabled: false,
        },
        legend: {},
      },
    });
  };

  render() {
    // console.log(this.state.mediaPage);
    let date = new Date(this.props.loggedInUser.createdAt);

    const monthNames = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];

    let year = date.getFullYear();
    let month = monthNames[date.getMonth()];

    return (
      <div className="profile-page">
        {this.state.showModal && (
          <div class="modal is-active">
            <div className="modal-background"></div>
            <div className="modal-content">
              <h5 className="title is-5">Are You Sure?</h5>
              <p>All of your user data will be deleted <strong>permanently</strong>.</p>
              <div className="profile-page-footer">
                <button className="button is-rounded" onClick={this.handleDeleteAccount}>Yes</button>
                <button className="button is-rounded" onClick={this.handleDeleteModal}>No</button>
              </div>
            </div>
            <button
              className="modal-close is-large"
              aria-label="close"
              onClick={this.handleDeleteModal}
            ></button>
          </div>
        )}

        <div className="user-info">
          {!this.state.profileImg ? (
            <div className="placeholder-profile">
              <Icon path={mdiAccount} size={3} color="white" />
            </div>
          ) : (
            <div className="real-profile">
              <img
                className="profile-pic"
                src={this.state.profileImg}
                alt="profile pic"
              />
            </div>
          )}
          <form
            className="profile-pic-uploader"
            onSubmit={this.handleProfilePic}
          >
            <input type="file" id="file" name="file" accept="image/*" />
            <label htmlFor="file">Upload Profile Picture...</label>
            <button
              className="button is-primary is-rounded is-small"
              type="submit"
            >
              Save
            </button>
          </form>
          <h5 className="user-info-text">
            <strong>Name:</strong>{" "}
            {this.props.loggedInUser.username.substring(0, 1).toUpperCase() +
              this.props.loggedInUser.username.substring(1)}
          </h5>
          <h5 className="user-info-text">
            <strong>Email:</strong> {this.props.loggedInUser.email}
          </h5>
          <h5 className="user-info-text">
            <strong>Joined:</strong> {month} {year}
          </h5>
        </div>

        <MediaFilter
          mediaType={this.state.mediaPage}
          onMovieChange={this.handleToggleMovie}
          onTVChange={this.handleToggleTV}
        />

        <div>
          <canvas id="myChart" width="400" height="400"></canvas>
          <div className="rated-list">
            {!this.state.listView ? (
              <button onClick={this.handleList} className="button is-rounded">
                View All
              </button>
            ) : (
              <>
                <button onClick={this.handleList} className="button is-rounded">
                  Hide All
                </button>
                <div className="control sorting-controls">
                  <div>
                    <input
                      type="radio"
                      name="sort"
                      value="alpha"
                      onClick={this.handleSort}
                    />
                    <label className="radio">Sort by Alphabetical</label>
                  </div>
                  <div>
                    <input
                      type="radio"
                      name="sort"
                      value="rating"
                      onClick={this.handleSort}
                    />
                    <label className="radio">Sort by Rating</label>
                  </div>
                </div>
                <List
                  list={
                    this.state.mediaPage === "movie"
                      ? this.state.ratedMovies
                      : this.state.ratedTVShows
                  }
                  type={this.state.mediaPage}
                />
              </>
            )}
          </div>
        </div>

        <div className="genres-section">
          <h5 className="title is-5">Top Genres</h5>
          <div className="top-genres">
            {this.state.mediaPage === "movie"
              ? this.state.topMovieGenres.map((genre) => {
                  return (
                    <h6 className="subtitle is-6" key={genre.id}>
                      {genre.name}
                    </h6>
                  );
                })
              : this.state.topTVGenres.map((genre) => {
                  return (
                    <h6 className="subtitle is-6" key={genre.id}>
                      {genre.name}
                    </h6>
                  );
                })}
          </div>
          <canvas id="myDoughnutChart" width="400" height="400"></canvas>
        </div>

        <div className="profile-page-footer">
          <button onClick={this.handleLogOut} className="button is-rounded">
            Log Out
          </button>
          <button
            onClick={this.handleDeleteModal}
            className="button is-rounded"
          >
            Delete Account
          </button>
        </div>

        <Navbar />
      </div>
    );
  }
}

export default Profile;
