import React, { useState, useEffect } from "react";
import { ResponsiveBar } from "@nivo/bar";
import classnames from "classnames";

const colors = {
  happy: "rgb(105,181,86)",
  sad: "rgb(47,98,169)",
  anger: "rgb(90,51,140)",
  hate: "rgb(212,56,49)",
  neutral: "rgb(122,122,122)"
};

function Bar(props) {
  return (
    <ResponsiveBar
      keys={["sad", "neutral", "hate", "happy", "anger"]}
      indexBy="word"
      margin={{ top: 0, right: 130, bottom: 50, left: 60 }}
      padding={0.3}
      valueScale={{ type: "linear" }}
      indexScale={{ type: "band", round: true }}
      colors={({ id }) => colors[id]}
      defs={[
        {
          id: "dots",
          type: "patternDots",
          background: "inherit",
          color: "#38bcb2",
          size: 4,
          padding: 1,
          stagger: true
        },
        {
          id: "lines",
          type: "patternLines",
          background: "inherit",
          color: "#eed312",
          rotation: -45,
          lineWidth: 6,
          spacing: 10
        }
      ]}
      borderColor={{ from: "color", modifiers: [["darker", 1.6]] }}
      axisTop={null}
      axisRight={null}
      axisBottom={{
        tickSize: 5,
        tickPadding: 5,
        tickRotation: 0,
        legend: "word",
        legendPosition: "middle",
        legendOffset: 36
      }}
      axisLeft={{
        tickSize: 5,
        tickPadding: 5,
        tickRotation: 0,
        legend: "share of tweets",
        legendPosition: "middle",
        legendOffset: -40
      }}
      label={({ value }) => Math.round(value * 100) + "%"}
      labelSkipWidth={12}
      labelSkipHeight={12}
      labelTextColor={{ from: "color", modifiers: [["brighter", 3]] }}
      legends={[
        {
          dataFrom: "keys",
          anchor: "bottom-right",
          direction: "column",
          justify: false,
          translateX: 120,
          translateY: 0,
          itemsSpacing: 2,
          itemWidth: 100,
          itemHeight: 20,
          itemDirection: "left-to-right",
          itemOpacity: 0.85,
          symbolSize: 20,
          effects: [
            {
              on: "hover",
              style: {
                itemOpacity: 1
              }
            }
          ]
        }
      ]}
      animate={true}
      motionStiffness={90}
      motionDamping={15}
      {...props}
    />
  );
}

function Tab({ name, isActive, onClick }) {
  return (
    <li className={classnames(isActive && "is-active")}>
      <a onClick={() => onClick(name)}>{name}</a>
    </li>
  );
}

export default function WordSentiments() {
  const tabs = [{ name: "Word Sentiments" }, { name: "Country Sentiments" }];
  const [activeTabName, setActiveTabName] = useState(tabs[0].name);

  const [generalData, setGeneralData] = useState([]);
  const [countryData, setCountryData] = useState([]);

  useEffect(() => {
    let mounted = true;
    Promise.all([
      fetch(process.env.PUBLIC_URL + "/json/09-radar-general.json"),
      fetch(process.env.PUBLIC_URL + "/json/09-radar-countries.json")
    ])
      .then(data => Promise.all(data.map(d => d.json())))
      .then(([general, country]) => {
        if (mounted) {
          general.sort((w1, w2) => w1.sad - w2.sad);
          country.sort((w1, w2) => w1.sad - w2.sad);
          setGeneralData(general);
          setCountryData(country);
        }
      });
    return () => (mounted = false);
  }, []);

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
        <h2 className="title is-2">Word sentiments</h2>
        <p>
          This plot contains Twitter users' overall attitude to some of the{" "}
          {activeTabName === tabs[0].name ? "most popular topics" : "countries"}
          . We have calculated the proportions of different sentiments for the
          tweets that <b>contain</b> a certain{" "}
          {activeTabName === tabs[0].name ? "word" : "name of the country"} (
          <i>substring match</i>) to build this plot.
        </p>
      </div>
      {activeTabName === tabs[0].name && (
        <>
          <div className="content is-medium">
            {/*<h2 className="has-text-centered">Word sentiments</h2>*/}
            {/*<p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Autem, exercitationem.</p>*/}
          </div>
          <div style={{ height: "500px" }}>
            <Bar data={generalData} />
          </div>
        </>
      )}
      {activeTabName === tabs[1].name && (
        <>
          <div className="content is-medium">
            {/*<h2 className="has-text-centered">Countries</h2>*/}
            {/*<p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Autem, exercitationem.</p>*/}
          </div>
          <div style={{ height: "500px" }}>
            <Bar
              data={countryData}
              axisBottom={{
                tickSize: 5,
                tickPadding: 5,
                tickRotation: 0,
                legend: "country",
                legendPosition: "middle",
                legendOffset: 36
              }}
            />
          </div>
        </>
      )}
    </React.Fragment>
  );
}
