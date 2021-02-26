import React, { useEffect, useState } from "react";
import { ResponsiveChoropleth } from "@nivo/geo";

import classnames from "classnames";

function Tab({ name, isActive, onClick }) {
  return (
    <li className={classnames(isActive && "is-active")}>
      <a onClick={() => onClick(name)}>{name}</a>
    </li>
  );
}

export default function SentimentMap() {
  const tabs = [
    { name: "Neutral", sentiment: "neutral", colors: "greys" },
    { name: "Happy", sentiment: "happy", colors: "greens" },
    { name: "Sad", sentiment: "sad", colors: "blues" },
    { name: "Anger", sentiment: "anger", colors: "purples" },
    { name: "Hate", sentiment: "hate", colors: "reds" }
  ];

  const maxValues = {
    anger: 0.04,
    happy: 0.25,
    hate: 0.2,
    neutral: 0.5,
    sad: 1.0
  };

  const [worldFeatures, setWorldFeatures] = useState([]);
  const [mapData, setMapData] = useState([]);

  useEffect(() => {
    let mounted = true;
    Promise.all([
      fetch(process.env.PUBLIC_URL + "/json/world_countries.json"),
      fetch(process.env.PUBLIC_URL + "/json/04-sentiment-map.json")
    ])
      .then(data => Promise.all(data.map(d => d.json())))
      .then(([features, data]) => {
        if (mounted) {
          setWorldFeatures(features.features);
          setMapData(data);
        }
      });
    return () => (mounted = false);
  }, []);

  const [activeTabName, setActiveTabName] = useState(tabs[0].name);
  const activeTab = tabs.find(t => t.name === activeTabName);

  const sentimentMapData = mapData
    .filter(({ sentiment }) => sentiment === activeTab.sentiment)
    .map(({ country, share }) => ({ id: country, value: share }));

  const exampleData = mapData.find(
    ({ country, sentiment }) =>
      country === "USA" && sentiment === activeTab.sentiment
  );

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
        <h2 className="title is-2">Sentiment maps</h2>
        <p>
          On these maps, you can see the share of tweets with a particular
          sentiment in different countries. To calculate the data for this map,
          we have used the GPS location associated with some of the tweets.
        </p>
        {exampleData && (
          <p>
            For example, the number of {exampleData.share.toFixed(2)} for the
            USA on the plot below means that{" "}
            {Math.round(exampleData.share * 100)}% of tweets posted from the USA
            (in English) were classified as{" "}
            {activeTab.sentiment}.
          </p>
        )}
      </div>
      <div style={{ height: "500px" }}>
        <ResponsiveChoropleth
          data={sentimentMapData}
          features={worldFeatures}
          margin={{ top: 0, right: 0, bottom: 0, left: 0 }}
          colors={activeTab.colors}
          domain={[0.0, maxValues[activeTab.sentiment]]}
          unknownColor="#ffffff"
          label="properties.name"
          valueFormat={value => Number(value.toFixed(2))}
          projectionScale={125}
          projectionTranslation={[0.5, 0.5]}
          projectionRotation={[0, 0, 0]}
          enableGraticule={true}
          graticuleLineColor="#dddddd"
          borderWidth={0.5}
          borderColor="#152538"
          legends={[
            {
              anchor: "bottom-left",
              direction: "column",
              justify: true,
              translateX: 20,
              translateY: -100,
              itemsSpacing: 0,
              itemWidth: 94,
              itemHeight: 18,
              itemDirection: "left-to-right",
              itemTextColor: "#444444",
              itemOpacity: 0.85,
              symbolSize: 18,
              effects: [
                {
                  on: "hover",
                  style: {
                    itemTextColor: "#000000",
                    itemOpacity: 1
                  }
                }
              ]
            }
          ]}
        />
      </div>
    </React.Fragment>
  );
}
