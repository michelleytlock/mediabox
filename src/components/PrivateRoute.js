import React, { Component } from "react";
import { Route } from "react-router-dom";
import { withRouter } from "react-router-dom";
import config from "../config";
import axios from "axios";

class PrivateRoute extends Component {
  state = {
    loggedInUser: '',
  };

  componentDidMount() {
    //check if there is a logged in user
    if (!this.state.loggedInUser) {
      this.getUser();
    }
  }

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
    if (!this.state.loggedInUser) {
      return null
      //loading
    }

    let MyComponent = this.props.component
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