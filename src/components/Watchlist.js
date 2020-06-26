import React, { Component } from "react";
import { Link } from "react-router-dom";
import config from "../config";
import axios from "axios";

import Navbar from "./Navbar";
import MediaFilter from "./MediaFilter";
import List from "./List";

let photoPath = 'https://image.tmdb.org/t/p/w500/'

class Watchlist extends Component {
  state = {
    user: this.props.loggedInUser,
    list: [],
    mediaPage: 'movie'
  }

  componentDidMount() {    
    axios
      .get(`${config.API_URL}/watchlist`, { withCredentials: true })
      .then((res) => {
        this.setState({
          list: res.data
        })
      })
  }

  handleToggleMovie = () => {
    window.localStorage.setItem('mediaPage', 'movie')
    this.setState({
      mediaPage: "movie"
    })
  }

  handleToggleTV = () => {
    window.localStorage.setItem('mediaPage', 'tv')
    this.setState({
      mediaPage: "tv"
    })
  }

  render() {
    let mediaPage = this.state.mediaPage
    if (window.localStorage.getItem('mediaPage')) {
        mediaPage = window.localStorage.getItem('mediaPage')
    }

    let filterByMediaType = this.state.list.filter((media) => {
      return media.mediaType === mediaPage
    })
  
    return (
      <>
        <MediaFilter onMovieChange={this.handleToggleMovie} onTVChange={this.handleToggleTV} />
        <List list={filterByMediaType} type={this.state.mediaPage}/>
        {/* <div className="list">
          {filterByMediaType.map((media, index) => {
            return <div key={index} className="list-item"><Link to={`/${this.state.mediaPage}/${media.apiId}`}><img src={photoPath + media.mediaId.image} alt={media.mediaId.title} /><h5 className="subtitle is-5">{media.mediaId.title}</h5></Link></div>
          })}
        </div> */}
        <Navbar />
      </>
    );
  }
}

export default Watchlist;