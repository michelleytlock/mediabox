import React, { Component } from "react";
import { Link } from "react-router-dom";

let photoPath = "https://image.tmdb.org/t/p/w500/";

export default function List(props) {

  console.log(props.list)

  return (
    <div className="list">
      {props.list.map((media, index) => {
        return (
          <div key={index} className="list-item">
            <Link to={`/${props.type}/${media.apiId}`}>
              <img
                src={photoPath + media.mediaId.image}
                alt={media.mediaId.title}
              />
              <h5 className="subtitle is-5">{media.mediaId.title}</h5>
            </Link>
          </div>
        );
      })}
    </div>
  );
}
