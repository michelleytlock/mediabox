import React, { Component } from "react";
import Icon from "@mdi/react";
import { mdiKeyboardBackspace } from "@mdi/js";
import config from "../config";
import axios from "axios";
import { withRouter } from "react-router-dom";

let photoPath = "https://image.tmdb.org/t/p/w500/";

class MediaDetails extends Component {
  state = {
    id: "",
    mediaType: "",
    media: "",
    credits: "",
  };

  componentDidMount() {
    let id = this.props.computedMatch.params.id;
    let mediaType = this.props.computedMatch.params.mediaType;

    // Call to server to get details about media
    axios
      .get(`${config.API_URL}/getDetails/${mediaType}/${id}`, {
        withCredentials: true,
      })
      .then((res) => {
        this.setState({
          id,
          mediaType,
          media: res.data.media,
          credits: res.data.credits,
        });
      })
      .catch((err) => {
        console.log("CDM err" + err);
      });
  }

  // This method handles the back button
  handleBack = () => {
    this.props.history.goBack();
  };

  // This method handles the rating functionality
  handleRate = (e) => {
    let rating = e.target.innerHTML; // Rating of 1, 2, 3, 4, or 5

    // Call to server that handles media (adds to database, adds to user's list with listType = "rated" and a rating)
    axios
      .post(
        `${config.API_URL}/create`,
        {
          mediaType: this.state.mediaType,
          apiId: this.state.media.id,
          listType: "rated",
          rating,
          description: this.state.media.overview,
          image: this.state.media.poster_path,
          title:
            this.state.mediaType === "movie"
              ? this.state.media.title
              : this.state.media.name, // Different due to external API calling it different based on whether media is movie or tv show
        },
        { withCredentials: true }
      )
      .then((response) => {
        if (this.props.location.state.fromPage === "search") {
          this.props.history.push("/home");
        } else {
          this.props.history.goBack();
        }
      })
      .catch((err) => {
        console.log("create media err" + err);
      });
  };

  // This method handles the add to watchlist functionality
  handleSave = () => {
    // Call to server that handles media (adds to database, adds to user's list with listType = "watchlist")
    axios
      .post(
        `${config.API_URL}/create`,
        {
          mediaType: this.state.mediaType,
          apiId: this.state.media.id,
          listType: "watchlist",
          description: this.state.media.overview,
          image: this.state.media.poster_path,
          title:
            this.state.mediaType === "movie"
              ? this.state.media.title
              : this.state.media.name, // Different due to external API calling it different based on whether media is movie or tv show
        },
        { withCredentials: true }
      )
      .then((response) => {
        this.props.history.goBack();
      })
      .catch((err) => {
        console.log("skip err" + err);
      });
  };

  // This method handles the skipping functionality
  handleSkip = () => {
    // Call to server that handles media (adds to database, adds to user's list with listType = "skipped")
    axios
      .post(
        `${config.API_URL}/create`,
        {
          mediaType: this.state.mediaType,
          apiId: this.state.media.id,
          listType: "skipped",
          description: this.state.media.overview,
          image: this.state.media.poster_path,
          title:
            this.state.mediaType === "movie"
              ? this.state.media.title
              : this.state.media.name, // Different due to external API calling it different based on whether media is movie or tv show
        },
        { withCredentials: true }
      )
      .then((response) => {
        this.props.history.goBack();
      })
      .catch((err) => {
        console.log("create media err" + err);
      });
  };

  render() {
    const {
      genres,
      overview,
      backdrop_path,
      release_date,
      runtime,
      tagline,
      title,
      created_by,
      first_air_date,
      last_air_date,
      number_of_episodes,
      number_of_seasons,
      status,
      name,
    } = this.state.media;

    const { cast, crew } = this.state.credits;
    
    let director;
    if (crew) {
      director = crew.filter((crewMem) => {
        return crewMem.job === "Director";
      });
    }

    let createdBy = Array.isArray(created_by) ? !!created_by.length : !!created_by
    
    return (
      <div className="media-details-page">
        <div className="media-details-header">
          <button onClick={this.handleBack} className="back-button">
            <Icon path={mdiKeyboardBackspace} size={1.5} color="#e20f0f" />
          </button>
          <h5 className="subtitle is-5 header-type">Details</h5>
        </div>

        {this.state.mediaType === "movie" ? (
          <>
            <img
              className="backdrop-image"
              src={photoPath + backdrop_path}
              alt={title}
            />
            <div className="media-details">
              <h2 className="title is-2">{title}</h2>
              <h5 className="subtitle is-5">{tagline}</h5>
              <p className="media-details-text">
                <strong>Release Date:</strong> {release_date}
              </p>
              <p className="media-details-text">
                <strong>Runtime: </strong> {runtime}
              </p>
              <p className="media-details-text">
                <strong>Overview:</strong>
                <br />
                {overview}
              </p>

              <p className="media-details-text">
                <strong>Genres:</strong>
              </p>
              {genres &&
                genres.map((genre, index) => {
                  return (
                    <p key={index} className="media-details-text">
                      {genre.name}
                    </p>
                  );
                })}

              <div className="cast">
                <h5 className="title is-5">Director</h5>
                {crew && (
                  <div className="cast-details">
                    <img
                      className="cast-image"
                      src={photoPath + director[0].profile_path}
                      alt={title}
                    />
                    <p className="media-details-text">{director[0].name}</p>
                  </div>
                )}
              </div>
              <div className="cast">
                <h5 className="title is-5">Cast</h5>
                {cast &&
                  cast.slice(0, 4).map((castMem, index) => {
                    return (
                      <div className="cast-details" key={index}>
                        <img
                          className="cast-image"
                          src={photoPath + castMem.profile_path}
                          alt={title}
                        />
                        <p className="media-details-text">
                          <strong>{castMem.name}</strong> as {castMem.character}
                        </p>
                      </div>
                    );
                  })}
              </div>
            </div>
          </>
        ) : (
          <>
            <img
              className="backdrop-image"
              src={photoPath + backdrop_path}
              alt={name}
            />
            <div className="media-details">
              <h2 className="title is-2">{name}</h2>
              <p className="media-details-text">
                <strong>Number of Episodes: </strong>
                {number_of_episodes}
              </p>
              <p className="media-details-text">
                <strong>Number of Seasons: </strong>
                {number_of_seasons}
              </p>
              <p className="media-details-text">
                <strong>Current Status: </strong>
                {status}
              </p>
              <p className="media-details-text">
                <strong>First Air Date: </strong>
                {first_air_date}
              </p>
              <p className="media-details-text">
                <strong>Last Air Date: </strong>
                {last_air_date}
              </p>
              <p className="media-details-text">
                <strong>Overview: </strong>
                <br />
                {overview}
              </p>

              <p className="media-details-text">
                <strong>Genres:</strong>
              </p>
              {genres &&
                genres.map((genre, index) => {
                  return (
                    <p key={index} className="media-details-text">
                      {genre.name}
                    </p>
                  );
                })}
              <div className="cast">
                <h5 className="title is-5">Created By:</h5>
                {createdBy && (
                  <div className="cast-details">
                    {created_by[0].profile_path && (
                      <img
                        className="cast-image"
                        src={photoPath + created_by[0].profile_path}
                        alt={created_by[0].name}
                      />
                    )}
                    <p className="media-details-text">{created_by[0].name}</p>
                  </div>
                )}
              </div>

              <div className="cast">
                <h5 className="title is-5">Cast</h5>
                {cast &&
                  cast.slice(0, 4).map((castMem, index) => {
                    return (
                      <div className="cast-details" key={index}>
                        <img
                          className="cast-image"
                          src={photoPath + castMem.profile_path}
                          alt={title}
                        />
                        <p className="media-details-text">
                          <strong>{castMem.name}</strong> as {castMem.character}
                        </p>
                      </div>
                    );
                  })}
              </div>
            </div>
          </>
        )}

        <div className="media-details-control">
          {this.props.location.state.fromPage === "home" ||
          this.props.location.state.fromPage === "search" ? (
            <h4 className="title is-4">Rate or Add to Watchlist</h4>
          ) : this.props.location.state.fromPage === "watchlist" ? (
            <h4 className="title is-4">Rate or Remove from Watchlist</h4>
          ) : (
            ""
          )}
          {this.props.location.state.fromPage === "home" ||
          this.props.location.state.fromPage === "search" ||
          this.props.location.state.fromPage === "watchlist" ? (
            <div className="rating-buttons">
              <button
                onClick={this.handleRate}
                className="button is-primary circle-buttons"
              >
                1
              </button>
              <button
                onClick={this.handleRate}
                className="button is-primary circle-buttons"
              >
                2
              </button>
              <button
                onClick={this.handleRate}
                className="button is-primary circle-buttons"
              >
                3
              </button>
              <button
                onClick={this.handleRate}
                className="button is-primary circle-buttons"
              >
                4
              </button>
              <button
                onClick={this.handleRate}
                className="button is-primary circle-buttons"
              >
                5
              </button>
            </div>
          ) : (
            ""
          )}
          {this.props.location.state.fromPage === "home" ||
          this.props.location.state.fromPage === "search" ? (
            <button
              onClick={this.handleSave}
              className="button is-rounded is-fullwidth"
            >
              Add to Watchlist
            </button>
          ) : this.props.location.state.fromPage === "watchlist" ? (
            <button
              onClick={this.handleSkip}
              className="button is-rounded is-fullwidth"
            >
              Remove from Watchlist
            </button>
          ) : (
            ""
          )}
        </div>
      </div>
    );
  }
}

export default withRouter(MediaDetails);
