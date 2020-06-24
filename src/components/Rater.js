import React from "react";

let photoPath = 'https://image.tmdb.org/t/p/w500/'

export default function Rater(props) {
  return (
    <>
      <img src={photoPath + props.random.poster_path} alt={props.random.title} />
      
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

      <button onClick={props.onSkip} className="button is-primary is-rounded">Skip</button>
    </>
  );
}
