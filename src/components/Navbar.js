import React from "react";

import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <>
      <nav className="navbar is-primary is-fixed-bottom myNav">
            <Link className="navbar-item" to={`/home/movies`}>
            Discover
            </Link>
            <Link className="navbar-item" to={`/watchlist`}>
            Watchlist
            </Link>
            <Link className="navbar-item" to={`/profile`}>
            Profile
            </Link>
      </nav>
    </>
  );
}
