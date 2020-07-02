import React from "react";

import { NavLink } from "react-router-dom";

export default function Navbar() {



  return (
    <>
      <nav className="navbar is-primary is-fixed-bottom myNav">
            <NavLink className="navbar-item" activeClassName='is-active' to={`/home`}>
            Discover
            </NavLink>
            <NavLink className="navbar-item" activeClassName='is-active' to={`/watchlist`}>
            Watchlist
            </NavLink>
            <NavLink className="navbar-item" activeClassName='is-active' to={`/profile`}>
            Profile
            </NavLink>
      </nav>
    </>
  );
}
