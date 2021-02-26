
import React from "react";
import { BrowserRouter as Router, Switch, Route, useLocation } from "react-router-dom";

import Menu from "./components/Menu.js";
import WordClouds from "./components/WordClouds.js";

import "./App.scss";
import WordSentiments from "./components/WordSentiments";
import SentimentMap from "./components/SentimentMap";
import WordRankingsLine from "./components/WordRankingsLine";
import MainPage from "./components/MainPage";

export default function App() {
  return (
    <Router>
      <div className="columns is-centered">
        <div className="container">
          <h1 className="title is-2 main-title">Analysis of human emotions during the global pandemic using Twitter data</h1>
        </div>
      </div>
      <section className="main-content columns is-fullheight">
        <aside className="column is-3 is-narrow-mobile is-fullheight section is-hidden-mobile">
          <div className="card">
            <div className="card-content">
              <Menu />
            </div>
          </div>
        </aside>

        <div className="container column is-9">
          <div className="section">
            {/*<div className="card">*/}
            {/*  <div className="card-header">*/}
            {/*    <p className="card-header-title">Header</p>*/}
            {/*  </div>*/}
            {/*  <div className="card-content">*/}
            {/*    <div className="content">Content</div>*/}
            {/*  </div>*/}
            {/*</div>*/}
            {/*<br />*/}
            <div className="card main-card">
              <div className="card-content">
                <Switch>
                  <Route exact path="/">
                    <MainPage />
                  </Route>
                  <Route path="/ranks">
                    <WordRankingsLine />
                  </Route>
                  <Route path="/word-clouds">
                    <WordClouds />
                  </Route>
                  <Route path="/word-sentiments">
                    <WordSentiments />
                  </Route>
                  <Route path="/map">
                    <SentimentMap />
                  </Route>
                </Switch>
              </div>
            </div>
          </div>
        </div>
      </section>
    </Router>
  );
}

// You can think of these components as "pages"
// in your app.

