---
title: Example interactive report | Constituency Profiles for the 33rd Dáil

---
# Constituency Profiles for the 33rd Dáil
## Explore how each part of Ireland is represented in the 33rd Dáil

The [Oireachtas Library and Research Service (L&RS)](https://www.oireachtas.ie/en/how-parliament-is-run/houses-of-the-oireachtas-service/library-and-research-service/) **constituency profiles** series is a dynamic and interactive online resource where users can find the most up-to-date information on where they live and the people representing their area.

Each constituency profile holds information, resources and data relating to the Dáil constituencies as set out in the [Electoral (Amendment) (Dáil Constituencies) Act 2017](https://www.irishstatutebook.ie/eli/2017/act/39/enacted/en/html).

Our constituency profiles are based on a wide range of inputs but primarily the [Small Area Population Statistics (SAPS)](https://www.cso.ie/en/census/census2016reports/census2016smallareapopulationstatistics/) from the Central Statistics Office (CSO) [Census 2016](https://www.cso.ie/en/census/) releases.

## Themes

Each constituency profile is structured under the following **six themes**:
- **Demographics**
- **Economic status and work**
- **Households and housing**
- **Transport**
- **Education**
- **Families**

The themes and indicators included in this profile reflect a selection of those used in the interactive constituency dashboards. A description of terms used by the CSO in the Census is set out in footnotes where relevant.

## Overview | How your area is represented

```js

const membersData = await FileAttachment("./data/members.json").json();
const constituencies = await FileAttachment("./data/boundaries.geojson").json();
const constituencyNames = await FileAttachment("./data/constituencyNames.json").json();
const recentQuestionsData = await FileAttachment("./data/recentQuestions.json").json();
const constWithProfile = await FileAttachment("./data/constituencieswithprofilesConstituencytds.json").json();
const questions = await FileAttachment("./data/Questions.json").json();

```
### Members
There are **161** public representatives in **39** constituencies for the 33rd Dáil. Explore them below or search for specific Members or constituencies.

```js
const membersTable = membersData.map((d) => ({Name: d.Name, Constituency: d.constituency}));
const search = view(Inputs.search(membersTable, {placeholder: "Search for Members or constituencies"}));

```
```js

display(Inputs.table(search))
```
### Constituencies
The 39 constituencies for the 33rd Dáil can be explored below.

```js

const div = display(document.createElement("div"));
div.style = "height: 400px;";
const map = L.map(div, {scrollWheelZoom: false}).setView([43.342686, 25.267118], 4);
const constituencylayer = L.geoJSON(constituencies).addTo(map);
  function onEachFeature(feature, layer) {
    // does this feature have a property named popupContent?
    if (feature.properties && feature.properties.CON_SEAT_) {
        layer.bindTooltip(feature.properties.CON_SEAT_);
    }
}
L.geoJSON(constituencies, {
  onEachFeature: onEachFeature,
  filter: function(feature, layer){return feature.properties.CON_SEAT_}
}).addTo(map);
map.fitBounds(constituencylayer.getBounds(), {maxZoom: 19});
L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  attribution: "© <a href=https://www.openstreetmap.org/copyright>OpenStreetMap</a> contributors"
}).addTo(map);

```
## Choose a constituency to explore
The constituencies of the 33rd Dáil were set out in the [Electoral (Amendment) (Dáil Constituencies) Act 2017](https://www.irishstatutebook.ie/eli/2017/act/39/enacted/en/html). Each constituency comprises many electoral districts.

```js
const constituencyPicker = view(Inputs.select(constituencyNames, {sort: true, unique: true, label: "Pick a constituency"}))
```
```js
const filteredMembers = membersData.filter(d => d.constituency == `${constituencyPicker}`)

```
```js
const filteredConstituencyMap = constituencies.features.filter(d => d.properties.CON_SEAT_ == `${constituencyPicker}`)

```

```js

const div = display(document.createElement("div"));
div.style = "height: 400px;";
const map = L.map(div, {scrollWheelZoom: false}).setView([43.342686, 25.267118], 4);
const constituencylayer = L.geoJSON(filteredConstituencyMap).addTo(map);
  function onEachFeature(feature, layer) {
    // does this feature have a property named popupContent?
    if (feature.properties && feature.properties.CON_SEAT_) {
        layer.bindTooltip(feature.properties.CON_SEAT_);
    }
}
L.geoJSON(filteredConstituencyMap, {
  onEachFeature: onEachFeature,
  filter: function(feature, layer){return feature.properties.CON_SEAT_}
}).addTo(map);
map.fitBounds(constituencylayer.getBounds(), {maxZoom: 19});
L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  attribution: "© <a href=https://www.openstreetmap.org/copyright>OpenStreetMap</a> contributors"
}).addTo(map);

```
```js
const list1 = filteredMembers.slice(0, -2).map(d =>d.Name+", ");
const list3 = filteredMembers.slice(-1).map(d =>d.Name+".");
const list2 = filteredMembers.slice(-2, -1).map(d =>d.Name+" and ")

```

[**${constituencyPicker}**](https://www.oireachtas.ie/en/members/tds/?tab=constituency&constituency=%2Fie%2Foireachtas%2Fhouse%2Fdail%2F33%2Fconstituency%2F${TDs[0].representCode}) is represented by **${filteredMembers.length} TDs**. These are **Deputies ${list1} ${list2} ${list3}**

Explore the topics that Members representing this constituency have asked about through parliamentary questions that have recently been submitted to Departments.

```js


const questionTopics = filteredQuestions.map((d) => ({Date: new Date(d.Date).toLocaleString("en-IE", {
    dateStyle: 'full'
  }), Department: d.Department, Heading: d.Heading, Deputy: d.Deputy}));
  const topicSearch = view(Inputs.search(questionTopics, {placeholder: "Search for question topics or TDs"}));
  

```


```js
  display(Inputs.table(topicSearch))
  const topicNumbers = Array.from(Array.from(d3.rollup(questionTopics, v => v.length, d => d.Heading)).slice().sort((a, b) => d3.descending(a[1], b[1])).slice(0,30),
  ([heading, numbers]) => ({heading, numbers}));
```
Some topics are asked about multiple times and this can indicate a popular issue for discussion in a constituency.

Take a look at the top 30 question topics in this constituency this year.
```js
function questionsChart(data, {width} = {}) {
  return Plot.plot({
  subtitle: "Most popular question topics in this constituency",
width: 1000,
  marginLeft: 200,
  marginBottom: 50,
  x: {label: "Number of questions"},
  y: {label: "Topics"},
  marks: [
    Plot.barX(topicNumbers, {x: "numbers", y: "heading", fill: "heading", sort: {y: "x", reverse: true}, tip: true}),
    Plot.ruleY([0])
  ]
});
}
```
```js
    questionsChart(topicNumbers)
```

```js
const profiles = constWithProfile.filter(d => d.constituency == `${constituencyPicker}`)

```

### Constituency profiles

The Library & Research Service has produced printable versions of this interactive online resource compiled from the same data, albeit as a snapshot in time. These resources were produced in 2019. Take a look at the [constituency profile for ${constituencyPicker}](${profiles[0].constProfile}).

## Demographics
### Population
The population of the constituency at the time of the 2016 Census was 150,804. This represents a 3.2% increase from 2011. This rate of increase is lower than the corresponding national rate of change for the same period.

### Age Cohorts
```js
const arrayOfNumbersByHeading = Array.from(Array.from(d3.rollup(questions, v => v.length, d => d.Heading)).slice().sort((a, b) => d3.descending(a[1], b[1])).slice(0,30),
  ([heading, numbers]) => ({heading, numbers}));
  const arrayOfNumbersByDepartment = Array.from(d3.rollup(questions, v => v.length, d => d.Department), 
                                       ([Department, numbers]) => ({Department, numbers}))

```
The age cohorts as distribution of male and female are set out below.
```js
function departmentChart(data, {width} = {}) {
  return Plot.plot({
  subtitle: "Population age",
width: 1000,
  marginLeft: 50,
  marginBottom: 50,
  x: {tickRotate: 10, label: "Cohort"},
  y: {label: "Metric"},
  marks: [
    Plot.barY(arrayOfNumbersByDepartment, {x: "Department", y: "numbers", fill: "Department", tip: true}),
    Plot.ruleY([0])
  ]
});
}
```
```js
    departmentChart(questions)
```


```js
  const index = d3.index(membersData, d => d.memberCode);
  const questionsWithConstituency = questions.map(({memberCode, ...values}) => ({memberCode, constituency: index.get(memberCode)?.constituency, ...values}));
  const filteredQuestions = questionsWithConstituency.filter(d => d.constituency == `${constituencyPicker}`).slice().sort((a, b) => d3.descending(a.Date, b.Date));
  const filteredByConstituency = Array.from(d3.rollup(questionsWithConstituency.filter(d => d.constituency == `${constituencyPicker}`), v => v.length, d => d.Heading));


```


