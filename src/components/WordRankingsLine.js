import React, { useEffect, useState } from "react";
import { useLocation, useHistory } from "react-router-dom";
import classnames from "classnames";

import { ResponsiveLine } from "@nivo/line";
import { ResponsiveBump } from "@nivo/bump";

import Autocomplete from "./Autocomplete";

const MonthDict = {
  3: "March",
  4: "April",
  5: "May",
  6: "June",
  7: "July",
  8: "August",
  9: "September",
  10: "October",
  11: "November",
  12: "December"
};

const top100words = [
  "coronavirus",
  "covid",
  "19",
  "covid19",
  "people",
  "amp",
  "cases",
  "trump",
  "new",
  "pandemic",
  "us",
  "via",
  "virus",
  "deaths",
  "get",
  "news",
  "like",
  "one",
  "health",
  "000",
  "realdonaldtrump",
  "2020",
  "vaccine",
  "time",
  "casos",
  "world",
  "would",
  "positive",
  "lockdown",
  "need",
  "di",
  "help",
  "china",
  "know",
  "day",
  "si",
  "test",
  "please",
  "death",
  "could",
  "many",
  "go",
  "see",
  "da",
  "still",
  "says",
  "today",
  "home",
  "crisis",
  "may",
  "et",
  "government",
  "due",
  "first",
  "going",
  "state",
  "good",
  "even",
  "back",
  "die",
  "10",
  "take",
  "work",
  "corona",
  "testing",
  "il",
  "mask",
  "na",
  "total",
  "care",
  "country",
  "spread",
  "the",
  "pandemia",
  "des",
  "think",
  "president",
  "make",
  "well",
  "re",
  "per",
  "said",
  "uk",
  "right",
  "also",
  "read",
  "patients",
  "india",
  "masks",
  "year",
  "live",
  "want",
  "du",
  "est",
  "say",
  "public",
  "social",
  "tests",
  "let",
  "americans"
];

function Tab({ name, isActive, onClick }) {
  return (
    <li className={classnames(isActive && "is-active")}>
      <a onClick={() => onClick(name)}>{name}</a>
    </li>
  );
}

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

export default function WordRankingsLine() {
  const tabs = [{ name: "Absolute Ranks" }, { name: "Relative Ranks" }];
  const [activeTabName, setActiveTabName] = useState(tabs[0].name);

  const query = useQuery();
  const history = useHistory();

  const [worldRankingDict, setWorldRankingDict] = useState(null);
  const [displayedWords, setDisplayedWords] = useState([
    "distancing",
    "vaccine",
    "isolation",
    // "trump",
    // "family",
    // "china",
    // "us"
    // "lockdown",
    "mask"
  ]);

  useEffect(() => {
    let mounted = true;
    fetch(process.env.PUBLIC_URL + "/json/01-rank-dict.json")
      .then(data => data.json())
      .then(data => {
        if (mounted) {
          setWorldRankingDict(data);
          const queryWords = query.get("words");
          if (queryWords) {
            setDisplayedWords(
              queryWords
                .split(",")
                .map(w => w.trim())
                .filter(w => w)
            );
          }
        }
      });
    return () => (mounted = false);
  }, []);

  let data = [];
  if (worldRankingDict) {
    data = [...new Set(displayedWords)]
      .filter(word => worldRankingDict[word])
      .map(word => ({
        id: word,
        data: worldRankingDict[word].map((rank, index) => ({
          x: MonthDict[index + 3],
          y: rank
        }))
      }));
  }
  const relData = JSON.parse(JSON.stringify(data));
  for (let month of [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]) {
    const monthValues = data.map(serie => serie.data[month].y);
    const sorted = monthValues.slice().sort((a, b) => a - b);
    const relRanks = monthValues.map(v => sorted.indexOf(v) + 1);
    relRanks.forEach((relRank, wordIndex) => {
      relData[wordIndex].data[month].y = relRank;
    });
  }

  const onWordChosen = word => {
    const newDisplayedWords = [...displayedWords, word];
    setDisplayedWords(newDisplayedWords);
    history.push({
      search:
        "?" +
        new URLSearchParams({ words: newDisplayedWords.join(",") }).toString()
    });
  };

  const onTopWordClicked = word => {
    const newDisplayedWords = [...displayedWords, word];
    setDisplayedWords(newDisplayedWords);
  };

  return (
    <div>
      <div className="content">
        <h2 className="title is-2">Word ranking</h2>
        <p>Here you can observe the changes in the frequency of some of the words from March to December 2020. The number indicates the rank (relative frequency) of a word compared to other words used in tweets during each month.</p>
        <p>You can add words to the plot by using the input below.</p>
        <p>You can delete words from the plot by clicking on them in the legend of the plot.</p>
      </div>
      <div className="section" style={{ paddingBottom: "20px", marginTop:'-40px' }}>
        <div className="container">
          <div className="columns">
            <div className="column">
              <Autocomplete
                name="fruit"
                label="Add new word:"
                placeholder=""
                data={worldRankingDict ? Object.keys(worldRankingDict) : []}
                onWordChosen={onWordChosen}
              />
            </div>
          </div>
        </div>
      </div>

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

      {activeTabName === tabs[0].name && (
        <div style={{ height: "500px" }}>
          <ResponsiveLine
            data={data}
            colors={{ scheme: "set1" }}
            margin={{ top: 50, right: 110, bottom: 50, left: 60 }}
            xScale={{ type: "point" }}
            yScale={{
              type: "linear",
              min: 0,
              max: "auto",
              stacked: false,
              reverse: true
            }}
            yFormat=">-.2d"
            enableSlices="x"
            axisTop={null}
            axisRight={null}
            axisBottom={{
              orient: "bottom",
              tickSize: 5,
              tickPadding: 5,
              tickRotation: 0,
              legend: "",
              legendOffset: 36,
              legendPosition: "middle"
            }}
            axisLeft={{
              orient: "left",
              tickSize: 5,
              tickPadding: 5,
              tickRotation: 0,
              legend: "absolute rank",
              legendOffset: -40,
              legendPosition: "middle"
            }}
            pointColor={{ theme: "background" }}
            pointBorderWidth={5}
            pointBorderColor={{ from: "serieColor" }}
            pointLabelYOffset={-12}
            useMesh={true}
            legends={[
              {
                anchor: "bottom-right",
                direction: "column",
                justify: false,
                translateX: 100,
                translateY: 0,
                itemsSpacing: 0,
                itemDirection: "left-to-right",
                itemWidth: 80,
                itemHeight: 20,
                itemOpacity: 0.75,
                symbolSize: 12,
                symbolShape: "circle",
                symbolBorderColor: "rgba(0, 0, 0, .5)",
                onClick: ({ id }) =>
                  setDisplayedWords(displayedWords.filter(w => w !== id)),
                effects: [
                  {
                    on: "hover",
                    style: {
                      itemBackground: "rgba(0, 0, 0, .03)",
                      itemOpacity: 1
                    }
                  }
                ]
              }
            ]}
          />
        </div>
      )}
      {activeTabName === tabs[1].name && (
        <div style={{ height: "500px" }}>
          <ResponsiveBump
            data={relData}
            margin={{ top: 40, right: 100, bottom: 40, left: 60 }}
            colors={{ scheme: "set1" }}
            lineWidth={3}
            activeLineWidth={6}
            inactiveLineWidth={3}
            inactiveOpacity={0.15}
            pointSize={10}
            activePointSize={16}
            inactivePointSize={0}
            pointColor={{ theme: "background" }}
            pointBorderWidth={3}
            activePointBorderWidth={3}
            pointBorderColor={{ from: "serie.color" }}
            axisTop={{
              tickSize: 5,
              tickPadding: 5,
              tickRotation: 0,
              legend: "",
              legendPosition: "middle",
              legendOffset: -36
            }}
            axisRight={null}
            axisBottom={{
              tickSize: 5,
              tickPadding: 5,
              tickRotation: 0,
              legend: "",
              legendPosition: "middle",
              legendOffset: 32
            }}
            axisLeft={{
              tickSize: 5,
              tickPadding: 5,
              tickRotation: 0,
              legend: "relative rank",
              legendPosition: "middle",
              legendOffset: -40
            }}
          />
        </div>
      )}
      <div className="content" style={{ marginTop: "10px" }}>
        <h2 className="subtitle">Top 100 words:</h2>
        <div className="columns">
          <div className="column">
            <ol type="1">
              {top100words.slice(0, 25).map(w => (
                <li key={w} style={{ cursor: "pointer" }} onClick={() => onTopWordClicked(w)}>{w}</li>
              ))}
            </ol>
          </div>
          <div className="column">
            <ol type="1" start="26" style={{ cursor: "pointer" }}>
              {top100words.slice(25, 50).map(w => (
                <li key={w} style={{ cursor: "pointer" }} onClick={() => onTopWordClicked(w)}>{w}</li>
              ))}
            </ol>
          </div>
          <div className="column">
            <ol type="1" start="51" style={{ cursor: "pointer" }}>
              {top100words.slice(50, 75).map(w => (
                <li key={w} style={{ cursor: "pointer" }} onClick={() => onTopWordClicked(w)}>{w}</li>
              ))}
            </ol>
          </div>
          <div className="column">
            <ol type="1" start="76" style={{ cursor: "pointer" }}>
              {top100words.slice(75, 100).map(w => (
                <li key={w} style={{ cursor: "pointer" }} onClick={() => onTopWordClicked(w)}>{w}</li>
              ))}
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
}
