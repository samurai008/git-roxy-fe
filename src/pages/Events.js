import React, { Component } from 'react'
import { Link } from "react-router-dom";
import DisplayCommits from "./DisplayCommits";
import { bypass_limit } from "../credentials";

export default class Events extends Component {
  constructor(props) {
    super(props);
    this.state = {
      events: []
    };
    this.payload = {};
  }

  formatEvent = (eventType) => {
    return eventType.replace(/Event/g, '');
  }

  formatDate = (dateStr) => {
    return dateStr.split('T')
      .map(value => value.replace('Z', '')).join(' ');
  }

  componentWillMount() {
    console.log('props', this.props);
    const events_url = JSON.parse(localStorage.getItem('auth')).userData.events_url.replace(/{\/\w+}/g, '');
    fetch(events_url + bypass_limit)
    .then(res => res.json())
    .then(events => {
      this.setState({
        events: events
      })
    })
  }

  render() {
    const eventListDOM = this.state.events.length > 0 ? this.state.events.map(
      event => (
        <div className="list-group-item list-group-item-action flex-column align-items-start" key={event.id}>
          <div className="d-flex w-100 justify-content-between">
            <h5 className="mb-1">{event.repo.name}</h5>
            <small>{this.formatDate(event.created_at)}</small>
          </div>
          <p className="mb-1">
            <em>{this.formatEvent(event.type)}</em>
          </p>
          <small>
            <strong>Commits</strong>
            <DisplayCommits commits={event.payload.commits ? event.payload.commits : []} />
          </small>
        </div>
      )
    ) : 'No events for you.'

    return (
      <div className="list-group">
        {eventListDOM}
      </div>
    )
  }
}
