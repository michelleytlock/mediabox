import React from "react";

let photoPath = "https://image.tmdb.org/t/p/w500/";

export default function OnboardingRater(props) {
  let imageSrc = photoPath + props.random.poster_path;

  return (
    <div className="rater">
      <img className="media-image"
        src={props.random.poster_path ? imageSrc : ""}
        alt={props.random.title}
      />

      <div className="rating-buttons">
        <button onClick={props.onRate} className="button is-primary circle-buttons">
          1
        </button>
        <button onClick={props.onRate} className="button is-primary circle-buttons">
          2
        </button>
        <button onClick={props.onRate} className="button is-primary circle-buttons">
          3
        </button>
        <button onClick={props.onRate} className="button is-primary circle-buttons">
          4
        </button>
        <button onClick={props.onRate} className="button is-primary circle-buttons">
          5
        </button>
      </div>

      <button
        onClick={props.onSkip}
        className="button is-rounded is-primary is-fullwidth is-medium"
      >
        Skip
      </button>
    </div>
  );
}
