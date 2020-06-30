import React from "react";

export default function MediaFilter(props) {
  return (
    <div className="media-filter">
      <button className="button is-white is-small" onClick={props.onMovieChange}>
        <h5 className="title is-5">MOVIES</h5>
      </button>
      <button className="button is-white is-small" onClick={props.onTVChange}>
        <h5 className="title is-5">TV SHOWS</h5>
      </button>
    </div>
  );
}
