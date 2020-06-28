import React from "react";

export default function Filter(props) {
  let button = {
    marginTop: "10px",
    marginRight: "10px",
  };
  
  let placeholder;
  props.type === "movie"
    ? (placeholder = "Search movies...")
    : (placeholder = "Search tv shows...");

  return (
    <div className="main-filter">
      <div>
        <form className="search-filter" onSubmit={props.onSearch}>
          <input
            className="input searchbar"
            name="search"
            type="text"
            placeholder={placeholder}
          />
          <button className="button is-primary is-rounded" type="submit">Search</button>
        </form>

        <button
          onClick={props.recommended}
          style={button}
          className="button is-success is-light"
        >
          Recommended For You
        </button>
        <button
          onClick={props.trending}
          style={button}
          className="button is-info is-light"
        >
          Trending
        </button>
      </div>
    </div>
  );
}
