import React from "react";

export default function MediaFilter(props) {
  let button = {
    marginTop: "10px",
    marginRight: "10px",
  };
  return (
    <div className="media-filter">
      <button className="button is-white" onClick={props.onMovieChange}>
        <h5 className="title is-5">MOVIES</h5>
      </button>
      <button className="button is-white" onClick={props.onTVChange}>
        <h5 className="title is-5">TV SHOWS</h5>
      </button>
    </div>
  );
}
