import React from "react";
import { Link } from "react-router-dom";

let photoPath = "https://image.tmdb.org/t/p/w500/";

export default function List(props) {
  console.log(props.list);
  let list = [];
  let type = '';

  props.list.results ? list = props.list.results : list = props.list

  props.list.mediaPage ? type = props.list.mediaPage : type = props.type

  return (
      <div className="list">
      {list.map((media, index) => {
        let image = '';
        let title = '';
        let id = 0;

        media.poster_path ? image = media.poster_path : image = media.mediaId.image
        
        media.title ? title = media.title : title = media.name

        media.title || media.name ? title = title : title = media.mediaId.title

        media.id ? id = media.id : id = media.apiId

          return (
            <div key={index} className="list-item">
              <Link to={{pathname: `/${type}/${id}`, state: {fromPage: `${props.fromPage}`}}}>
                <img
                  src={photoPath + image}
                  alt={title}
                />
                <p className="list-item-title">{title}</p>
                {media.rating && <p className="list-item-rating">{media.rating}</p>}
              </Link>
            </div>
          );
        })}
      </div>
  );
}
