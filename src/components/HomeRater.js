import React from "react";
import { Link } from "react-router-dom";
import FadeIn from "react-fade-in";
import Lottie from "react-lottie";
import loadingData from "../pageLoadingAnimation.json";

let photoPath = "https://image.tmdb.org/t/p/w500/";

export default function HomeRater(props) {
  let imageSrc = photoPath + props.random.poster_path;

  //Animation options:
  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: loadingData,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };

  return (
    <div className="rater">
      <Link
        to={{
          pathname: `/${props.type}/${props.random.id}`,
          state: { fromPage: "home" },
        }}
      >
        {!props.random.poster_path ? (
          <div className="loading-media-image">
            <FadeIn className="loading-animation">
              <Lottie options={defaultOptions} height={250} width={250} />
            </FadeIn>
          </div>
        ) : (
          <img
            className="media-image"
            src={props.random.poster_path && imageSrc}
            alt={props.random.title}
          />
        )}
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
        <button onClick={props.onSave} className="button is-rounded">
          Save to Watchlist
        </button>
        <button onClick={props.onSkip} className="button is-rounded">
          Skip
        </button>
      </div>
    </div>
  );
}
