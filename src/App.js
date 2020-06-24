import React, { Component } from "react";
import { Switch, Route } from "react-router-dom";
import { withRouter } from "react-router-dom";
import config from "./config";
import axios from "axios";

import 'bulma/css/bulma.css';
import "./App.css";

import PrivateRoute from "./components/PrivateRoute";

//COMPONENTS
import LandingPage from "./components/LandingPage";
import SignupPage from "./components/SignupPage";
import LoginPage from "./components/LoginPage";
import Home from "./components/Home";
import Profile from "./components/Profile";

class App extends Component {

  handleSignUp = (e) => {
    e.preventDefault();
    let username = e.target.username.value
    let email = e.target.email.value
    let password = e.target.password.value

    axios.post(`${config.API_URL}/signup`, { username, email, password }, { withCredentials: true })
      .then(() => {
        this.props.history.push('/home/movies')
      })
  }

  handleLogin = (e) => {
    e.preventDefault();
    let username = e.target.username.value
    let password = e.target.password.value

    axios.post(`${config.API_URL}/login`, { username, password }, { withCredentials: true })
      .then(() => {
        this.props.history.push('/home/movies')
      })
  }

  render() {
    return (
      <div className="App">
        <Switch>
          {/* Auth Routes */}
          <Route
            exact
            path="/"
            render={() => {
              return <LandingPage />;
            }}
          />
          <Route
            path="/signup"
            render={(routeProps) => {
              return <SignupPage onSignup={this.handleSignUp} {...routeProps} />;
            }}
          />
          <Route
            path="/login"
            render={(routeProps) => {
              return <LoginPage onLogin={this.handleLogin} {...routeProps} />;
            }}
          />

          {/* App Routes */}
          <PrivateRoute
            path="/profile"
            component={Profile}
          />
          <PrivateRoute
            path="/home/movies"
            component={Home}
          />
        </Switch>
      </div>
    );
  }
}

export default withRouter(App);
