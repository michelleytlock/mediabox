import React from "react";

export default function Profile(props) {
  return (
    <>
      <h1>{props.loggedInUser.email}</h1>
    </>
  );
}