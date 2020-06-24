import React from "react";

export default function LoginPage(props) {
  return (
    <div className="columns">
      <div className="column">
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
              placeholder="Username"
            />
          </div>
          {/* PASSWORD */}
          <div className="field">
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
              <button type="submit" className="button is-link">Continue</button>
            </div>
          </div>

        </form>
      </div>
    </div>
  );
}
