import React from "react";
import { Link } from "react-router-dom";
import Icon from "@mdi/react";
import { mdiClose } from "@mdi/js";
import { mdiCheck } from "@mdi/js";
import { mdiAlertCircle } from "@mdi/js";

export default function SignupPage(props) {
  return (
    <div className="signup-page">
      <button className="close-button">
        <Link to="/">
          <Icon path={mdiClose} size={1.5} color="black" />
        </Link>
      </button>
      <div className="form">
        <h1 className="title">Sign Up</h1>
        <form onSubmit={props.onSignup}>
          {/* USERNAME */}
          <div className="field">
            <label className="label" htmlFor="username">
              Username
            </label>
            <p className="control has-icons-right">
              <input
                onChange={props.checkUsername}
                className="input"
                type="text"
                id="username"
                name="username"
                placeholder="moaningmyrtle"
              />
              {props.usernameStatus === undefined ? (
                ""
              ) : props.usernameStatus === true ? (
                <span className="icon is-small is-right check-icon">
                  <Icon path={mdiAlertCircle} size={1} color="#e20f0f" />
                </span>
              ) : (
                <span className="icon is-small is-right check-icon">
                  <Icon path={mdiCheck} size={1} color="#2ed400" />
                </span>
              )}
            </p>
            {props.usernameStatus === undefined ? (
              ""
            ) : props.usernameStatus === true ? (
              <p class="help is-danger">
                Username is unavailable, please choose another!
              </p>
            ) : (
              <p class="help is-success">Username available!</p>
            )}
          </div>
          {/* EMAIL */}
          <div className="field">
            <label className="label" htmlFor="email">
              Email
            </label>
            <p className="control has-icons-right">
              <input
                onChange={props.checkEmail}
                className="input"
                type="email"
                id="email"
                name="email"
                placeholder="myrtle@girlsbathroom.com"
              />
              {props.emailStatus === undefined ? (
                ""
              ) : props.emailStatus === true ? (
                <span className="icon is-small is-right check-icon">
                  <Icon path={mdiAlertCircle} size={1} color="#e20f0f" />
                </span>
              ) : (
                <span className="icon is-small is-right check-icon">
                  <Icon path={mdiCheck} size={1} color="#2ed400" />
                </span>
              )}
            </p>
            {props.emailStatus === undefined ? (
              ""
            ) : props.emailStatus === true ? (
              <p class="help is-danger">
                Email is already in use, please use another email.
              </p>
            ) : (
              <p class="help is-success">Email is free!</p>
            )}
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

          {props.signUpStatus && (
            <div class="notification is-danger is-light">
              Something went wrong. Please make sure your <strong>email</strong>{" "}
              is correct and your <strong>password</strong> has at least 8
              characters, 1 number and 1 uppercase alphabet.
            </div>
          )}
          {/* BUTTONS */}
          <div className="field">
            <div className="control">
              <button
                type="submit"
                className="button is-rounded is-primary is-fullwidth is-medium signup-button"
              >
                Submit
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
