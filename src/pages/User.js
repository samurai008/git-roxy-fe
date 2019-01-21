import React, { Component } from "react";
import RepoLanguage from "./RepoLanguage";
import { bypass_limit } from '../credentials';

export default class User extends Component {
  constructor() {
    super();
    this.state = {
      repos: []
    }
  }

  componentWillMount() {
    const repos_url = JSON.parse(localStorage.getItem('auth')).userData.repos_url;
    fetch(repos_url + bypass_limit)
      .then(res => res.json())
      .then(repos => this.setState({ repos: repos }));
  }

  render() {
    console.log(this.state.repos)
    const repos = this.state.repos.map(
      repo => (
        <li className="list-group-item">
          {repo.name}
          <RepoLanguage languagesUrl={repo.languages_url} />
        </li>
      )
    )

    return (
      <div>
        <ul className="list-group list-group-flush">
          {repos}
        </ul>
      </div>
    );
  }
}
