import React from "react";

export default function Filter(props) {
  
  return (
    <div className="main-filter">
      {/* SEARCH BAR */}
      <form className="search-filter" onSubmit={props.onSearch}>
        <input
          className="input searchbar"
          name="search"
          type="text"
          placeholder="Search..."
        />
        <button className="button is-primary is-rounded" type="submit">
          Search
        </button>
      </form>

      {/* RECOMMENDED BUTTON */}
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
        
        {/* TRENDING BUTTON */}
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
