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
import PersonDetails from "./components/PersonDetails";

class App extends Component {

  state = {
    searchResults: {},
    usernameExists: undefined,
    emailExists: undefined,
    signUpError: false,
    logInError: false
  }

  handleSignUp = (e) => {
    e.preventDefault();
    const { username, email, password } = e.target

    axios.post(`${config.API_URL}/signup`, { username: username.value, email: email.value, password: password.value }, { withCredentials: true })
      .then(() => {
        this.props.history.push('/home')
      })
      .catch((err) => {
        this.setState({
          signUpError: true
        })
      });
  }

  handleLogin = (e) => {
    e.preventDefault();
    const { username, password } = e.target

    axios.post(`${config.API_URL}/login`, { username: username.value, password: password.value }, { withCredentials: true })
      .then(() => {
        this.props.history.push('/home')
      })
      .catch((err) => {
        this.setState({
          logInError: true
        })
      });
  }

  handleSearch = (results) => {
    console.log('handle search', results)
    this.setState({
      searchResults: results
    }, () => {
      this.props.history.push('/search')
    })
  }

  checkUsername = (e) => {
    e.preventDefault()
    let username = e.target.value
    console.log(username)
    if (!username) {
      this.setState({
        usernameExists: undefined
      })
    } else {
      axios.post(`${config.API_URL}/checkUsername`, { username }, { withCredentials: true })
      .then((response) => {
        console.log(response)
        this.setState({
          usernameExists: response.data
        })
      })
      .catch((err) => {
        console.log(err)
      });
    }
  }

  checkEmail = (e) => {
    e.preventDefault()
    let email = e.target.value
    console.log(email)
    if (!email) {
      this.setState({
        emailExists: undefined
      })
    } else {
      axios.post(`${config.API_URL}/checkEmail`, { email }, { withCredentials: true })
      .then((response) => {
        console.log(response)
        this.setState({
          emailExists: response.data
        })
      })
      .catch((err) => {
        console.log(err)
      });
    }
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
              return <SignupPage onSignup={this.handleSignUp} checkUsername={this.checkUsername} checkEmail={this.checkEmail} usernameStatus={this.state.usernameExists} emailStatus={this.state.emailExists} signUpStatus={this.state.signUpError} {...routeProps} />;
            }}
          />
          <Route
            path="/login"
            render={(routeProps) => {
              return <LoginPage onLogin={this.handleLogin} logInStatus={this.state.logInError} {...routeProps} />;
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
          <PrivateRoute
            exact path="/person"
            component={PersonDetails}
          />
        </Switch>
      </div>
    );
  }
}

export default withRouter(App);
