import React, { Component } from "react";
import Icon from "@mdi/react";
import { mdiKeyboardBackspace } from "@mdi/js";
import FadeIn from "react-fade-in";
import Lottie from "react-lottie";
import errorData from "../error.json";

import { Link } from "react-router-dom";
import List from "./List";

let photoPath = "https://image.tmdb.org/t/p/w500/";

class SearchResults extends Component {
  componentDidMount() {
    console.log(this.props.list.people);
    console.log(this.props.list.movies);
    console.log(this.props.list.tv);
  }

  handleBack = () => {
    this.props.history.goBack();
  };

  render() {
    const defaultOptions = {
      loop: true,
      autoplay: true,
      animationData: errorData,
      rendererSettings: {
        preserveAspectRatio: "xMidYMid slice",
      },
    };

    return (
      <>
        <div className="header">
          <button onClick={this.handleBack} className="back-button">
            <Icon path={mdiKeyboardBackspace} size={1.5} color="#e20f0f" />
          </button>
          <h5 className="subtitle is-5 header-type">Search Results</h5>
        </div>

        {this.props.list.people.length === 0 &&
        this.props.list.movies.length === 0 &&
        this.props.list.tv.length === 0 ? (
          <div className="no-results-page">
            <FadeIn className="loading-animation">
              <Lottie options={defaultOptions} height={150} width={150} />
            </FadeIn>
            <h5 className="is-5 title">No available results, <br />search again!</h5>
          </div>
        ) : (
          <div className="search-results-page">
            {this.props.list.people.length === 0 ? (
              ""
            ) : (
              <div>
                <h5 className="is-5 search-subhead">People</h5>
                <div className="search-people">
                  {this.props.list.people.map((person, index) => {
                    return (
                      <div className="search-person" key={index}>
                        <Link
                          to={{
                            pathname: "/person",
                            state: {
                              name: person.name,
                              photo: person.profile_path,
                              known_for: person.known_for,
                            },
                          }}
                        >
                          <img
                            src={photoPath + person.profile_path}
                            alt={person.name}
                          />
                        </Link>
                        <p className="media-details-text">
                          <strong>{person.name}</strong>
                        </p>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
            {this.props.list.movies.length === 0 ? (
              ""
            ) : (
              <div>
                <h5 className="is-5 search-subhead">Movies</h5>
                <List list={this.props.list.movies} fromPage="search" />
              </div>
            )}
            {this.props.list.tv.length === 0 ? (
              ""
            ) : (
              <div>
                <h5 className="is-5 search-subhead">TV Shows</h5>
                <List list={this.props.list.tv} fromPage="search" />
              </div>
            )}
          </div>
        )}
      </>
    );
  }
}

export default SearchResults;
