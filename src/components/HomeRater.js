import React from "react";
import { Link } from "react-router-dom";

let photoPath = "https://image.tmdb.org/t/p/w500/";

export default function HomeRater(props) {
  let imageSrc = photoPath + props.random.poster_path;

  return (
    <div className="rater">
      <Link to={`/${props.type}/${props.random.id}`}>
        <img
          className="media-image"
          src={props.random.poster_path ? imageSrc : ""}
          alt={props.random.title}
        />
      </Link>

      <div className="rating-buttons">
        <button
          onClick={props.onRate}
          className="button is-primary circle-buttons"
        >
          1
        </button>
        <button
          onClick={props.onRate}
          className="button is-primary circle-buttons"
        >
          2
        </button>
        <button
          onClick={props.onRate}
          className="button is-primary circle-buttons"
        >
          3
        </button>
        <button
          onClick={props.onRate}
          className="button is-primary circle-buttons"
        >
          4
        </button>
        <button
          onClick={props.onRate}
          className="button is-primary circle-buttons"
        >
          5
        </button>
      </div>

      <div className="action-buttons">
        <button
          onClick={props.onSave}
          className="button is-rounded"
        >
          Save to Watchlist
        </button>
        <button
          onClick={props.onSkip}
          className="button is-rounded"
        >
          Skip
        </button>
      </div>

    </div>
  );
}
