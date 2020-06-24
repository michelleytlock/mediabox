import React from "react";

export default function SignupPage(props) {
  return (
    <div className="columns">
      <div className="column">
        <h1 className="title">Sign Up</h1>
        <form onSubmit={props.onSignup}>
          {/* USERNAME */}
          <div class="field">
            <label class="label" htmlFor="username">
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
          {/* EMAIL */}
          <div className="field">
            <label className="label" htmlFor="email">
              Email
            </label>
            <input
              className="input"
              type="email"
              id="email"
              name="email"
              placeholder="user@user.com"
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
              <button type="submit" class="button is-link">Submit</button>
            </div>
          </div>

        </form>
      </div>
    </div>
  );
}
