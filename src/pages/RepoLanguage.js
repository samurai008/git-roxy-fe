import React, { Component } from 'react'
import { bypass_limit } from '../credentials';

export default class RepoLanguage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      languages: []
    }
  }

  componentWillMount() {
    fetch(this.props.languagesUrl + bypass_limit)
      .then(res => res.json())
      .then(data => this.setState({ languages: Object.keys(data) }));
  }

  render() {
    const languages = this.state.languages.map(
      language => <span class="badge badge-dark mr-1">{language}</span>
    );

    return (
      <div className="float-right">
        {languages}
      </div>
    )
  }
}
