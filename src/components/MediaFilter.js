import React from "react";

export default function MediaFilter(props) {
  console.log(props.mediaType)
  
  return (
    <div className="media-filter">
      <button className="button is-white is-small" onClick={props.onMovieChange}>
        <h5 id="movie" className={props.mediaType === 'movie' ? "title is-5 active" : "title is-5"}>MOVIES</h5>
      </button>
      <button className="button is-white is-small" onClick={props.onTVChange}>
        <h5 id="tv" className={props.mediaType === 'movie' ? "title is-5" : "title is-5 active"}>TV SHOWS</h5>
      </button>
    </div>
  );
}
