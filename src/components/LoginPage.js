import React from "react";
import { Link } from "react-router-dom";
import Icon from "@mdi/react";
import { mdiClose } from "@mdi/js";

export default function LoginPage(props) {
  return (
    <div className="signup-page">
      <button className="close-button">
        <Link to="/">
          <Icon path={mdiClose} size={1.5} color="black" />
        </Link>
      </button>
      <div className="form">
        <h1 className="title">Log In</h1>
        <form onSubmit={props.onLogin}>
          {/* USERNAME */}
          <div className="field">
            <label className="label" htmlFor="username">
              Username
            </label>
            <input
              className="input"
              type="text"
              id="username"
              name="username"
              placeholder="moaningmyrtle"
            />
          </div>
          {/* PASSWORD */}
          <div className="field last-field">
            <label className="label" htmlFor="password">
              Password
            </label>
            <input
              className="input"
              type="password"
              id="password"
              name="password"
              placeholder="***********"
            />
          </div>
          {/* BUTTONS */}
          <div className="field">
            <div className="control">
              <button type="submit" className="button is-rounded is-primary is-fullwidth is-medium signup-button">
                Continue
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
