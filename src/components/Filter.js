import React from "react";

export default function Filter(props) {
  let button = {
    marginTop: "10px",
    marginRight: "10px"
  }

  let placeholder;
  props.type == "movie" ? placeholder = "Search movies..." : placeholder = "Search tv shows..."

  return (
    <div className="main-filter">
      <div className="search-filter">
        <input
          className="input searchbar"
          type="text"
          placeholder={placeholder}
        />
        <button onClick={props.trending} style={button} className="button is-info is-light">Trending</button>
        <button onClick={props.recommended} style={button} className="button is-success is-light">Recommended</button>
      </div>
    </div>
  );
}
