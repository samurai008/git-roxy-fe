import React, { Component } from 'react'
// import { auth } from './auth';

export default class Login extends Component {
  constructor(props) {
    super(props);
    this.client_id = "88efe41258e8359922be";
    this.github_uri =
      "https://github.com/login/oauth/authorize?client_id=";
  }

  render() {
    const redirect_uri = this.github_uri + this.client_id;
    const loginDivWrapperStyle = {
      margin: "1rem 0",
      textAlign: "center",
      padding: "1rem"
    }

    return (
      <div style={loginDivWrapperStyle}>
        <a href={redirect_uri} className="btn btn-success">
          Login with github
        </a>
      </div>
    )
  }
}
