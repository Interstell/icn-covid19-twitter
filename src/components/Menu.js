import React from "react";
import { NavLink } from "react-router-dom";

export default function Menu() {
  return (
    <React.Fragment>
      <ul className="menu-list">
        <li>
          <NavLink exact to="/" activeClassName="is-active">
            Homepage
          </NavLink>
        </li>
      </ul>
      <p className="menu-label is-hidden-touch">Plots</p>
      <ul className="menu-list">
        <li>
          <NavLink to="/ranks" activeClassName="is-active">
            Ranking
          </NavLink>
        </li>
        <li>
          <NavLink to="/word-clouds" activeClassName="is-active">
            Word Clouds
          </NavLink>
        </li>
        <li>
          <NavLink to="/word-sentiments" activeClassName="is-active">
            Sentiments
          </NavLink>
        </li>
        <li>
          <NavLink to="/map" activeClassName="is-active">
            Map
          </NavLink>
        </li>
      </ul>
    </React.Fragment>
  );
}
