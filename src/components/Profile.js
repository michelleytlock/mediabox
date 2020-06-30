import React, { Component } from "react";
import config from "../config";
import axios from "axios";
import Chart from "chart.js";

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
            let movieGenres = movies.map((movie) => {
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
            let tvGenres = tvShows.map((tv) => {
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
              "rgba(255, 99, 132, 0.2)",
              "rgba(54, 162, 235, 0.2)",
              "rgba(255, 206, 86, 0.2)",
              "rgba(75, 192, 192, 0.2)",
              "rgba(153, 102, 255, 0.2)",
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
          text: "Rated Medias",
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
              display: true,
              gridLines: {
                drawBorder: false,
                drawOnChartArea: false,
              },
              ticks: {
                display: false,
              },
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

    var ctx2 = document.getElementById("myDoughnutChart");
    new Chart(ctx2, {
      type: "doughnut",
      data: {
        datasets: [
          {
            data: genreData,
            backgroundColor: [
              "rgba(255, 99, 132, 0.2)",
              "rgba(54, 162, 235, 0.2)",
              "rgba(255, 206, 86, 0.2)",
              "rgba(255, 206, 86, 0.2)",
              "rgba(255, 206, 86, 0.2)",
              "rgba(255, 206, 86, 0.2)",
              "rgba(255, 206, 86, 0.2)",
            ],
            borderColor: [
              "rgba(255, 99, 132, 1)",
              "rgba(54, 162, 235, 1)",
              "rgba(255, 206, 86, 1)",
              "rgba(255, 206, 86, 1)",
              "rgba(255, 206, 86, 1)",
              "rgba(255, 206, 86, 1)",
              "rgba(255, 206, 86, 1)",
            ],
          },
        ],
        labels: genreLabels,
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
        <div className="user-info">
          <img src="" />
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
          onMovieChange={this.handleToggleMovie}
          onTVChange={this.handleToggleTV}
        />
        <canvas id="myChart" width="400" height="400"></canvas>
        <h1>Top Genres</h1>
        {this.state.mediaPage === "movie"
          ? this.state.topMovieGenres.map((genre) => {
              return <p key={genre.id}>{genre.name}</p>;
            })
          : this.state.topTVGenres.map((genre) => {
              return <p key={genre.id}>{genre.name}</p>;
            })}
        <canvas id="myDoughnutChart" width="400" height="400"></canvas>
        <div className="control">
          <label className="radio">
            <input
              type="radio"
              name="sort"
              value="alpha"
              onClick={this.handleSort}
            />
            Sort by Alphabetical
          </label>
          <label className="radio">
            <input
              type="radio"
              name="sort"
              value="rating"
              onClick={this.handleSort}
            />
            Sort by Rating
          </label>
        </div>
        <List
          list={
            this.state.mediaPage === "movie"
              ? this.state.ratedMovies
              : this.state.ratedTVShows
          }
          type={this.state.mediaPage}
        />
        <Navbar />
      </div>
    );
  }
}

export default Profile;
