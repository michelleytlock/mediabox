import React from "react";

import Navbar from "./Navbar";

export default function Profile(props) {
  return (
    <>
      <h1>{props.loggedInUser.email}</h1>
      <Navbar />
    </>
  );
}
