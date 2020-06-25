import React from "react";

let photoPath = 'https://image.tmdb.org/t/p/w500/'

export default function HomeRater(props) {
  let imageSrc = photoPath + props.random.poster_path;

  // {props.random.poster_path ? imageSrc : ''}

  return (
    <>
      <img src={props.random.poster_path ? imageSrc : ''} alt={props.random.title} />
      
      <div className="columns is-mobile">
        <div className="column">
          <button onClick={props.onRate} className="button is-primary is-rounded">1</button>
        </div>
        <div className="column">
        <button onClick={props.onRate} className="button is-primary is-rounded">2</button>
        </div>
        <div className="column">
        <button onClick={props.onRate} className="button is-primary is-rounded">3</button>
        </div>
        <div className="column">
        <button onClick={props.onRate} className="button is-primary is-rounded">4</button>
        </div>
        <div className="column">
          <button onClick={props.onRate} className="button is-primary is-rounded">5</button>
        </div>
      </div>
      <button onClick={props.onSave} className="button is-primary is-rounded">Save to Watchlist</button>
      <button onClick={props.onSkip} className="button is-primary is-rounded">Skip</button>
    </>
  );
}
