import React from "react";
import { withRouter } from "react-router-dom";

function Welcome() {
  return (
    <div>
      <h1>Welcome to TFJ!</h1>
    </div>
  );
}

export default withRouter(Welcome);
