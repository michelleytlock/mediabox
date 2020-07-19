import React, { Component } from "react";
import { Switch, Route } from "react-router-dom";
import { withRouter } from "react-router-dom";
import config from "./config";
import axios from "axios";

// STYLES 
import 'bulma/css/bulma.css';
import "./sass/mystyles.scss";
import './styles/App.css';

// COMPONENTS
import PrivateRoute from "./components/PrivateRoute";
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
    searchResults: {}, // Default state for search results
    usernameExists: 'undefined', // Default state for username input field verification in sign up form
    emailExists: 'undefined', // Default state for email input field verification in sign up form
    signUpError: false, // Default state to toggle error visibility on sign up form
    logInError: false // Default state to toggle error visibility on log in form
  }

  // This method handles the sign up form
  handleSignUp = (e) => {
    e.preventDefault();
    const { username, email, password } = e.target // Information from sign up form input fields

    // Call to server route that creates user in database
    axios.post(`${config.API_URL}/signup`, { username: username.value, email: email.value, password: password.value }, { withCredentials: true })
      .then(() => {
        this.props.history.push('/home') // Redirect to homepage
      })
      .catch((err) => {
        this.setState({
          signUpError: true
        })
      });
  }
  
  // This method handles the log in form
  handleLogin = (e) => {
    e.preventDefault();
    const { username, password } = e.target // Information from log in form input fields

    // Call to server route that checks if user is in database
    axios.post(`${config.API_URL}/login`, { username: username.value, password: password.value }, { withCredentials: true })
      .then(() => {
        this.props.history.push('/home') // Redirect to homepage
      })
      .catch((err) => {
        this.setState({
          logInError: true
        })
      });
  }

  // This method handles the search functionality on the homepage
  handleSearch = (results) => {
    this.setState({
      searchResults: results
    }, () => {
      this.props.history.push('/search') // Redirect to search result page
    })
  }

  // This method handles the username verification on the sign up form
  checkUsername = (e) => {
    e.preventDefault()
    let username = e.target.value

    // If no username in input field
    if (!username) {
      this.setState({
        usernameExists: 'undefined'
      })
    }
    // If there is a username in input field
    else {
      // Call to server to verify username exists or not
      axios.post(`${config.API_URL}/checkUsername`, { username }, { withCredentials: true })
      .then((response) => {
        this.setState({
          usernameExists: response.data // true or false based on whether username exists or not
        })
      })
      .catch((err) => {
        console.log(err)
      });
    }
  }

  // This method handles the email verification on teh sign up form
  checkEmail = (e) => {
    e.preventDefault()
    let email = e.target.value

    // If no email in input field
    if (!email) {
      this.setState({
        emailExists: 'undefined'
      })
    }
    // If there is a email in input field
    else {
      // Call to server to verify email exists or not
      axios.post(`${config.API_URL}/checkEmail`, { email }, { withCredentials: true })
      .then((response) => {
        this.setState({
          emailExists: response.data // true or false based on whether username exists or not
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
