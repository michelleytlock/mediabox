import React from "react";

export default function Filter(props) {
  let placeholder =
    props.type === "movie" ? "Search movies..." : "Search tv shows...";

  return (
    <div className="main-filter">
      <form className="search-filter" onSubmit={props.onSearch}>
        <input
          className="input searchbar"
          name="search"
          type="text"
          placeholder={placeholder}
        />
        <button className="button is-primary is-rounded" type="submit">
          Search
        </button>
      </form>
      <div className="random-medias-toggler">
        <button
          onClick={props.recommended}
          className={
            props.recommendedState
              ? "button is-rounded active-button"
              : "button is-rounded"
          }
        >
          Recommended
        </button>
        <button
          onClick={props.trending}
          className={
            !props.recommendedState
              ? "button is-rounded active-button"
              : "button is-rounded"
          }
        >
          Trending
        </button>
      </div>
    </div>
  );
}
