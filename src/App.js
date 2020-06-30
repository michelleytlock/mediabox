import React, { Component } from "react";
import { Switch, Route } from "react-router-dom";
import { withRouter } from "react-router-dom";
import config from "./config";
import axios from "axios";

import 'bulma/css/bulma.css';
import "./sass/mystyles.scss";
import './styles/App.css';


import PrivateRoute from "./components/PrivateRoute";

//COMPONENTS
import LandingPage from "./components/LandingPage";
import SignupPage from "./components/SignupPage";
import LoginPage from "./components/LoginPage";
import Intro from "./components/Intro";
import Profile from "./components/Profile";
import Watchlist from "./components/Watchlist";
import MediaDetails from "./components/MediaDetails";
import SearchResults from "./components/SearchResults";

class App extends Component {

  state = {
    searchResults: {},
  }

  handleSignUp = (e) => {
    e.preventDefault();
    let username = e.target.username.value
    let email = e.target.email.value
    let password = e.target.password.value

    axios.post(`${config.API_URL}/signup`, { username, email, password }, { withCredentials: true })
      .then(() => {
        this.props.history.push('/home')
      })
      .catch((err) => {
        console.log("sign up error" + err);
      });
  }

  handleLogin = (e) => {
    e.preventDefault();
    let username = e.target.username.value
    let password = e.target.password.value

    axios.post(`${config.API_URL}/login`, { username, password }, { withCredentials: true })
      .then(() => {
        this.props.history.push('/home')
      })
      .catch((err) => {
        console.log("log in err" + err);
      });
  }

  handleSearch = (results) => {
    console.log('handle search', results)
    this.setState({
      searchResults: results
    })
  }

  render() {
    return (
      <div>
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
            path="/home"
            component={Intro}
            handleSearchProps={this.handleSearch}
          />
          <PrivateRoute
            path="/profile"
            component={Profile}
          />
          <PrivateRoute
            path="/watchlist"
            component={Watchlist}
          />
          <PrivateRoute
            path="/:mediaType/:id"
            component={MediaDetails}
          />
          <PrivateRoute
            path="/search"
            component={SearchResults}
            list={this.state.searchResults}
          />
        </Switch>
      </div>
    );
  }
}

export default withRouter(App);
