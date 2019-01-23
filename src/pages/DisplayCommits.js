import React, { Component } from 'react'

export default class DisplayCommits extends Component {
  render() {
    console.log(this.props.commits);
    const commits = this.props.commits.length > 0 ? this.props.commits.map(
      commit => (
        <ul className="list-unstyled">
          <li>
            <strong>Author: </strong>
            {commit.author.name} ({commit.author.email})
          </li>
          <li>
            <strong>Message: </strong>
            {commit.message}
          </li>
          <li>{commit.sha}</li>
        </ul> 
      )
    ) : 'No commits for this repo'

    return (
      <div className="mb-2">
        {commits}
      </div>
    )
  }
}
