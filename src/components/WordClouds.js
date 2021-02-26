import React, { useState } from "react";
import classnames from "classnames";

import wordCloudOverall from "../images/word-clouds/wordCloud_overall.png";
import wordCloudNeutral from "../images/word-clouds/wordCloud_neutral.png";
import wordCloudAnger from "../images/word-clouds/wordCloud_anger.png";
import wordCloudHappy from "../images/word-clouds/wordCloud_happy.png";
import wordCloudHate from "../images/word-clouds/wordCloud_hate.png";
import wordCloudSad from "../images/word-clouds/wordCloud_sad.png";

function Tab({ name, isActive, onClick }) {
  return (
    <li className={classnames(isActive && "is-active")}>
      <a onClick={() => onClick(name)}>{name}</a>
    </li>
  );
}

export default function WordClouds() {
  const tabs = [
    { name: "Overall", image: wordCloudOverall },
    { name: "Neutral", image: wordCloudNeutral },
    { name: "Happy", image: wordCloudHappy },
    { name: "Sad", image: wordCloudSad },
    { name: "Anger", image: wordCloudAnger },
    { name: "Hate", image: wordCloudHate }
  ];

  const [activeTabName, setActiveTabName] = useState(tabs[0].name);
  const activeImage = tabs.find(t => t.name === activeTabName).image;

  return (
    <React.Fragment>
      <div className="tabs is-centered is-toggle is-medium is-fullwidth">
        <ul>
          {tabs.map(({ name }) => (
            <Tab
              name={name}
              key={name}
              onClick={setActiveTabName}
              isActive={activeTabName === name}
            />
          ))}
        </ul>
      </div>
      <div className="content">
        <h2 className="title is-2">Word clouds</h2>
        <p>
          The size of the word on the word cloud below indicates how frequently
          the word was used{" "}
          <b>{activeTabName === "Overall"
            ? "in the whole dataset"
            : `in the tweets classified as "${activeTabName.toLowerCase()}"`}</b>{". "}
        </p>
      </div>
      <div className="word-cloud-block">
        <img src={activeImage} alt="word cloud" />
      </div>
    </React.Fragment>
  );
}
