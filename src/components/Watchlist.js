import React from "react";

import Navbar from "./Navbar";
import Filter from "./Filter";

let photoPath = 'https://image.tmdb.org/t/p/w500/'

export default function Watchlist(props) {
  //unable to get the list from the session
  let watchlist = props.loggedInUser.list.filter((media) => {
    return media.listType === 'watchlist'
  })
  console.log(props.loggedInUser.list)
  console.log(watchlist)

  return (
    <>
      <Filter />
      <div>
        {watchlist.map((media) => {
          return <div><img src={photoPath + media.poster_path} alt={media.title} /><h4>{media.title}</h4></div>
        })}
      </div>
      <Navbar />
    </>
  );
}
