import React, { Component } from "react";
import config from "../config";
import axios from "axios";

import Navbar from "./Navbar";
import Filter from "./Filter";

let photoPath = 'https://image.tmdb.org/t/p/w500/'

class Watchlist extends Component {
  state = {
    user: this.props.loggedInUser,
    list: [],
  }

  componentDidMount() {    
    axios
      .get(`${config.API_URL}/userData`, { withCredentials: true })
      .then((res) => {
        this.setState({
          list: res.data.list
        })
      })
  }

  render() {

    console.log(this.state.list)
    
    let watchlist = this.state.list.filter((media) => {
      return media.listType === 'watchlist'
    })

    console.log(watchlist)
  
    return (
      <>
        <Filter />
        <div class="list">
          {watchlist.map((media, index) => {
            return <div key={index} className="list-item"><img  src={photoPath + media.mediaId.image} alt={media.mediaId.title} /><h4>{media.mediaId.title}</h4></div>
          })}
        </div>
        <Navbar />
      </>
    );
  }
}

export default Watchlist;