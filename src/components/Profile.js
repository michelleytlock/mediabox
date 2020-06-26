import React, { Component } from "react";
import { Link } from "react-router-dom";
import config from "../config";
import axios from "axios";
import Chart from 'chart.js';

import Navbar from "./Navbar";

class Profile extends Component {
  state = {
    list: [],
  };

  renderChart = () => {
    var ctx = document.getElementById('myChart');
var myChart = new Chart(ctx, {
    type: 'bar',
    data: {
        labels: ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange'],
        datasets: [{
            label: '# of Votes',
            data: [12, 19, 3, 5, 2, 3],
            backgroundColor: [
                'rgba(255, 99, 132, 0.2)',
                'rgba(54, 162, 235, 0.2)',
                'rgba(255, 206, 86, 0.2)',
                'rgba(75, 192, 192, 0.2)',
                'rgba(153, 102, 255, 0.2)',
                'rgba(255, 159, 64, 0.2)'
            ],
            borderColor: [
                'rgba(255, 99, 132, 1)',
                'rgba(54, 162, 235, 1)',
                'rgba(255, 206, 86, 1)',
                'rgba(75, 192, 192, 1)',
                'rgba(153, 102, 255, 1)',
                'rgba(255, 159, 64, 1)'
            ],
            borderWidth: 1
        }]
    },
    options: {
        scales: {
            yAxes: [{
                ticks: {
                    beginAtZero: true
                }
            }]
        }
    }
});
  }

  componentDidMount() {
    axios
      .get(`${config.API_URL}/userData`, { withCredentials: true })
      .then((res) => {
        this.setState({
          list: res.data.list,
        }, () => {
          this.renderChart()
        });
        
      });
  }

  render() {
    console.log(this.state.list);
    let date = new Date(this.props.loggedInUser.createdAt);

    const monthNames = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];

    let year = date.getFullYear();
    let month = monthNames[date.getMonth()];

    return (
      <>
        <h1>{this.props.loggedInUser.username}</h1>
        <h1>{this.props.loggedInUser.email}</h1>
        <h1>
          Joined in {month} {year}
        </h1>
        <canvas id="myChart" width="400" height="400"></canvas>
        <Navbar />
      </>
    );
  }
}

export default Profile;
