import React from "react";

import { Link } from "react-router-dom";

export default function Filter(props) {
  let button = {
    marginTop: "10px",
    marginRight: "10px"
  }
  return (
    <div className="main-filter">
      <div className="media-filter">
        <button onClick={props.onMovieChange}><h5 className="title is-5">MOVIES</h5></button>
        <button onClick={props.onTVChange}><h5 className="title is-5">TV SHOWS</h5></button>
      </div>
      <div className="search-filter">
        <input
          className="input searchbar"
          type="text"
          placeholder={`Search...`}
        />
        <button style={button} className="button is-info is-light">Trending</button>
        <button style={button} className="button is-success is-light">Recommended</button>
      </div>
    </div>
  );
}
