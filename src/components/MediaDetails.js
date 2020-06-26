import React, { Component } from "react";
import config from "../config";
import axios from "axios";

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

    axios
      .get(`${config.API_URL}/getDetails/${mediaType}/${id}`, {
        withCredentials: true,
      })
      .then((res) => {
        console.log(res.data);
        this.setState({
          id,
          mediaType,
          media: res.data.media,
          credits: res.data.credits,
        });
      });
  }

  handleBack = () => {
    this.props.history.goBack();
  };

  handleRate = (e) => {
    let rating = e.target.innerHTML;

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
              : this.state.media.name,
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

  handleSkip = () => {
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
              : this.state.media.name,
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

    console.log(this.state.media);

    return (
      <>
        <button
          onClick={this.handleBack}
          className="button is-primary is-light"
        >
          Back
        </button>
        <div className="columns is-mobile">
          <div className="column">
            <button
              onClick={this.handleRate}
              className="button is-primary is-rounded"
            >
              1
            </button>
          </div>
          <div className="column">
            <button
              onClick={this.handleRate}
              className="button is-primary is-rounded"
            >
              2
            </button>
          </div>
          <div className="column">
            <button
              onClick={this.handleRate}
              className="button is-primary is-rounded"
            >
              3
            </button>
          </div>
          <div className="column">
            <button
              onClick={this.handleRate}
              className="button is-primary is-rounded"
            >
              4
            </button>
          </div>
          <div className="column">
            <button
              onClick={this.handleRate}
              className="button is-primary is-rounded"
            >
              5
            </button>
          </div>
        </div>
        <button
          onClick={this.handleSkip}
          className="button is-primary is-rounded"
        >
          Remove from Watchlist
        </button>
        {this.state.mediaType === "movie" ? (
          <div>
            <img src={photoPath + backdrop_path} alt={title} />
            <h2 className="title is-2">{title}</h2>
            <p>{tagline}</p>
            <p>{release_date}</p>
            <p>{runtime}</p>
            <p>{overview}</p>

            {genres &&
              genres.map((genre, index) => {
                return (
                  <h5 key={index} className="subtitle is-5">
                    {genre.name}
                  </h5>
                );
              })}

            <h3 className="subtitle is-3">Details</h3>
            <div>
              {cast &&
                cast.slice(0, 4).map((castMem, index) => {
                  return (
                    <div key={index}>
                      <img src={photoPath + castMem.profile_path} alt={title} />
                      <h5 className="subtitle is-5">
                        {castMem.name} as {castMem.character}
                      </h5>
                    </div>
                  );
                })}
            </div>
            <div>
              {crew && (
                <div>
                  <img src={photoPath + director[0].profile_path} alt={title} />
                  <h5 className="subtitle is-5">
                    Director: {director[0].name}
                  </h5>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div>
            <img src={photoPath + backdrop_path} alt={name} />
            <h2 className="title is-2">{name}</h2>
            <p>{number_of_episodes}</p>
            <p>{number_of_seasons}</p>
            <p>{status}</p>
            <p>{overview}</p>
            <p>{first_air_date}</p>
            <p>{last_air_date}</p>
            {genres &&
              genres.map((genre, index) => {
                return (
                  <h5 key={index} className="subtitle is-5">
                    {genre.name}
                  </h5>
                );
              })}
            <h3 className="subtitle is-3">Details</h3>
            {created_by && (
              <div>
                {created_by[0].profile_path && (
                  <img
                    src={photoPath + created_by[0].profile_path}
                    alt={created_by[0].name}
                  />
                )}
                <h5 className="subtitle is-5">
                  Created By: {created_by[0].name}
                </h5>
              </div>
            )}
            <div>
              {cast &&
                cast.slice(0, 4).map((castMem, index) => {
                  return (
                    <div key={index}>
                      <img src={photoPath + castMem.profile_path} alt={title} />
                      <h5 className="subtitle is-5">
                        {castMem.name} as {castMem.character}
                      </h5>
                    </div>
                  );
                })}
            </div>
          </div>
        )}
      </>
    );
  }
}

export default MediaDetails;
