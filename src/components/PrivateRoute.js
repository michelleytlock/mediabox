import React, { Component } from "react";
import { Route } from "react-router-dom";
import { withRouter } from "react-router-dom";
import config from "../config";
import axios from "axios";

// Component for all private routes
class PrivateRoute extends Component {

  state = {
    loggedInUser: '',
  };

  componentDidMount() {
    //Check if there is a logged in user from session
    if (!this.state.loggedInUser) {
      this.getUser();
    }
  }

  // This method checks if there is a logged in user from the session
  getUser = () => {
    //get user from session from server
    axios
      .get(`${config.API_URL}/user`, { withCredentials: true })
      .then((res) => {
        if (res.data) {
          this.setState({
            loggedInUser: res.data,
          });
        } else {
          // Redirect to log in form
          this.props.history.push("/login");
        }
      })
      .catch((err) => {
        console.log(err);
        if (err.response.status === 401) {
          this.props.history.push("/");
        }
      });
  };

  render() {
    let MyComponent = this.props.component
    if (!this.state.loggedInUser) {
      return null
    }
    
    return (
      <Route
        render={() => {
          return <MyComponent loggedInUser={this.state.loggedInUser} {...this.props} />;
        }}
      />
    );
  }
}

export default withRouter(PrivateRoute);