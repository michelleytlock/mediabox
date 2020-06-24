import React from "react";
import {Link} from 'react-router-dom'

export default function LandingPage() {
  return (
    <div className="columns">
      <div className="column">
        <h1 className="title">MEDIA BOX</h1>

        <Link to={'/signup'}><button className="button is-primary">Sign Up</button></Link>
        
        <Link to={'/login'}><button className="button is-primary">Log In</button></Link>
      </div>
    </div>
  );
}
