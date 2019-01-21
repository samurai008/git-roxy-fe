import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter as Router,
  Route,
  Link,
  NavLink,
  Redirect,
  withRouter } from 'react-router-dom';

import "../node_modules/bootstrap/dist/css/bootstrap.css";
import "./styles.css";
import Login from "./pages/Login";
import User from './pages/User';
import Events from './pages/Events';
import {auth} from './store/auth';

function getUrlVars() {
  var vars = {};
  var parts = window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, function(
    m,
    key,
    value
  ) {
    vars[key] = value;
  });
  return vars;
}

function getAccessToken(response) {
  var vars = {};
  var parts = response.replace(/([^=&]+)=([^&]*)/gi, function(m, key, value) {
    vars[key] = value;
  });
  return vars;
}

const client_id = "88efe41258e8359922be";
const github_uri =
  "https://github.com/login/oauth/authorize?client_id=" + client_id;

class App extends React.Component {
  constructor() {
    super();
  }

  componentWillMount() {
    if (!localStorage.getItem('auth')) {
      localStorage.setItem('auth', JSON.stringify(auth));
    }

    if (getUrlVars()["code"] && !JSON.parse(localStorage.getItem('auth')).isAuthenticated) {
      fetch(
        "https://git-roxy.herokuapp.com/fetchToken?code=" + getUrlVars()["code"]
      )
        .then(res => res.json())
        .then(token => {
          token = getAccessToken(token["access_token"])["access_token"];
          console.log("urlvars", token);
          return fetch("https://api.github.com/user?access_token=" + token);
        })
        .then(res => res.json())
        .then(data => {
          console.log(data);
          if (!data['message']) {
            let authObj = JSON.parse(localStorage.getItem('auth'));
            authObj.isAuthenticated = true;
            authObj.userData = data;
            console.log(authObj);
            localStorage.setItem('auth', JSON.stringify(authObj));
            window.location.pathname = "/user";
          }
        });
    }
  }

  render() {
    const protectedMenuItems = JSON.parse(localStorage.getItem('auth')).isAuthenticated ?
      (
        <ul className="list-inline">
          <li className="list-inline-item">
            <NavLink to="/user" className="btn" activeClassName="btn-primary">Your repositories</NavLink>
          </li>
          <li className="list-inline-item">
            <NavLink to="/events" className="btn" activeClassName="btn-primary">Your events</NavLink>
          </li>
          <li className="list-inline-item">
            {window.location.pathname}
          </li>
        </ul>
      ) : '';

    return (
      <Router>
        <div className="container">
          <AuthButton />
          {protectedMenuItems}
          <Route path="/" render={props => (
            <Redirect to={{pathname: "/login"}}/>
          )} />
          <Route path="/login" component={Login} />
          <PrivateRoute path="/user" component={User} />
          <PrivateRoute path="/events" component={Events} />
        </div>
      </Router>
      );
  }
}

const AuthButton = withRouter(
  ({ history }) =>
    JSON.parse(localStorage.getItem('auth')).isAuthenticated ? (
      <p className="mt-2">
        Welcome!{" " + JSON.parse(localStorage.getItem('auth')).userData['name']}
        <button
          onClick={() => {
            localStorage.clear();
            localStorage.setItem('auth', JSON.stringify(auth));
            history.replace('/');
          }}
          className="btn btn-sm btn-danger float-right"
        >
          Sign out
        </button>
      </p>
    ) : (
      <Login />
    )
);

function PrivateRoute({ component: Component, ...rest }) {
  return (
    <Route
      {...rest}
      render={props =>
        JSON.parse(localStorage.getItem('auth')).isAuthenticated ? (
          <Component {...props} />
        ) : (
          <Redirect
            to={{
              pathname: "/login",
              state: { from: props.location }
            }}
          />
        )
      }
    />
  );
}

const rootElement = document.getElementById("root");
ReactDOM.render(<App />, rootElement);
