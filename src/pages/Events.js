import React, { Component } from 'react'
import { Link } from "react-router-dom";

export default class Events extends Component {
  constructor(props) {
    super(props);
    this.state = {
      events: []
    };
    this.payload = {};
  }

  componentWillMount() {
    console.log('props', this.props);
    const events_url = JSON.parse(localStorage.getItem('auth')).userData.events_url.replace(/{\/\w+}/g, '');
    fetch(events_url)
    .then(res => res.json())
    .then(events => {
      this.setState({
        events: events
      })
    })
  }

  componentWillUpdate(props, state) {
    this.payload = state.events.filter(
      event => event.id === props.match.params.id
    )[0].payload;
  }

  render() {
    const eventListDOM = this.state.events.map(
      event => (
        <Link to={"/events/"+event.id} className="list-group-item list-group-item-action flex-column align-items-start" key={event.id}>
          <div className="d-flex w-100 justify-content-between">
            <h5 className="mb-1">{event.repo.name}</h5>
            <small>{event.created_at}</small>
          </div>
          <p className="mb-1">
            {event.type}
          </p>
          <small>Donec id elit non mi porta.</small>
        </Link>
      )
    )
    
    if (this.props.match.params.id && this.state.events.length > 0) {
      console.log(this.payload)
      return (
        <div class="row">
          {this.payload.before}
        </div>
      )
    }

    return (
      <div className="list-group">
        {eventListDOM}
      </div>
    )
  }
}
