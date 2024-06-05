---
toc: false
---

<style>

.hero {
  display: flex;
  flex-direction: column;
  align-items: center;
  font-family: var(--IBM-Plex-Sans);
  margin: 4rem 0 8rem;
  text-wrap: balance;
  text-align: center;
}

.hero h1 {
  margin: 2rem 0;
  max-width: none;
  font-size: 14vw;
  font-weight: 900;
  line-height: 1;
  background: linear-gradient(30deg, var(--theme-foreground-focus), currentColor);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.hero h2 {
  margin: 0;
  max-width: 34em;
  font-size: 20px;
  font-style: initial;
  font-weight: 500;
  line-height: 1.5;
  color: var(--theme-foreground-muted);
}

@media (min-width: 640px) {
  .hero h1 {
    font-size: 90px;
  }
}

</style>

<div class="hero">
  <h1>PQ Dashboards</h1>
  <h2>Find out more about what your TDs are asking</h2>
  <a href="https://www.oireachtas.ie/en/how-parliament-is-run/houses-of-the-oireachtas-service/library-and-research-service/">Produced by the Houses of the Oireachtas Library & Research Service<span style="display: inline-block; margin-left: 0.25rem;">↗︎</span></a>
</div>

```js
const aapl = FileAttachment("aapl.csv").csv({typed: true});
const penguins = FileAttachment("penguins.csv").csv({typed: true});
const questions = await FileAttachment("./data/Questions.json").json();
const rolled = Array.from(d3.flatRollup(questions, v => v.length, d => d.Heading), 
([id, value]) => ({id, value})
);
```

<div class="grid grid-cols-4">
  <div class="card">
    <h2>The Department of <strong>Health</strong> 🚑 has replied to</h2>
    <span class="big">${questions.filter((d) => d.Department === "Health").length.toLocaleString("en-US")} questions</span>
  </div>
   <div class="card">
    <h2>The Department of <strong>Education</strong> 🎓 has replied to</h2>
    <span class="big">${questions.filter((d) => d.Department === "Education").length.toLocaleString("en-US")} questions</span>
  </div>
  <div class="card">
    <h2>The Department dealing with <strong>Housing</strong> 🏠 has replied to<span class="muted"></span></h2>
    <span class="big">${questions.filter((d) => d.Department === "Housing").length.toLocaleString("en-US")} questions</span>
  </div>
  <div class="card">
    <h2>The Department dealing with <strong>Children</strong>'s matters 👶 has replied to</h2>
    <span class="big">${questions.filter((d) => d.Department === "Children").length.toLocaleString("en-US")} questions</span>
  </div>
  <div class="card">
    <h2>The Department dealing with <strong>Justice</strong> 👮 has replied to</h2>
    <span class="big">${questions.filter((d) => d.Department === "Justice").length.toLocaleString("en-US")} questions</span>
  </div>
  <div class="card">
    <h2>The Department dealing with <strong>Transport</strong> 🚉 has replied to</h2>
    <span class="big">${questions.filter((d) => d.Department === "Transport").length.toLocaleString("en-US")} questions</span>
  </div>
  <div class="card">
    <h2>The Department dealing with <strong>Social</strong> matters 🤱 has replied to</h2>
    <span class="big">${questions.filter((d) => d.Department === "Social").length.toLocaleString("en-US")} questions</span>
  </div>
  <div class="card">
    <h2>The Department dealing with <strong>Agriculture</strong> matters 🚜 has replied to</h2>
    <span class="big">${questions.filter((d) => d.Department === "Agriculture").length.toLocaleString("en-US")} questions</span>
  </div>
</div>

```js
const arrayOfNumbersByHeading = Array.from(Array.from(d3.rollup(questions, v => v.length, d => d.Heading)).slice().sort((a, b) => d3.descending(a[1], b[1])).slice(0,30),
  ([heading, numbers]) => ({heading, numbers}));
  const arrayOfNumbersByDepartment = Array.from(d3.rollup(questions, v => v.length, d => d.Department), 
                                       ([Department, numbers]) => ({Department, numbers}))
```


## Who provides the replies...

The Department of Health deals with the majority of questions asked by TDs but thousands of questions each year are asked of all 18 Government Departments.
```js
function departmentChart(data, {width} = {}) {
  return Plot.plot({
  title: "Questions to all Departments",
width: 1000,
  marginLeft: 50,
  marginBottom: 50,
  x: {tickRotate: 10, label: "Departments"},
  y: {label: "Number of Questions asked"},
  marks: [
    Plot.barY(arrayOfNumbersByDepartment, {x: "Department", y: "numbers", fill: "Department", tip: true}),
    Plot.ruleY([0])
  ]
});
}
```

<div class="grid grid-cols-1">
  <div class="card">
    ${resize((width) => departmentChart(questions, {width}))}
  </div>
</div>

## Hot-button topics
Looking at the Departments dealing with questions cannot tell the entire story. The many thousands of parliamentary questions asked each year can take in hundreds of topics. Take a look at the most popular question headings.

```js
function topicChart(data, {width}) {
  return Plot.plot({
  marginLeft: 200,
  x: {label: "Number of questions asked"},
  y: {label: "question topics"},
  title: "Top 30 question topics this year",
  marks: [
    Plot.barX(arrayOfNumbersByHeading, {x: "numbers", y: "heading", fill: "numbers", tip: true, sort: {y: "x", reverse: true}}),
    Plot.ruleX([0])
  ]
});
}
```

<div class="grid grid-cols-1">
  <div class="card">
    ${resize((width) => topicChart(arrayOfNumbersByHeading, {width}))}
  </div>
</div>

```js
const arrayOfNumbersByDeputy = Array.from(d3.flatRollup(questions, v => v.length, d => d.Deputy, d => d.memberCode),
                                   ([deputy, id, numbers]) => ({deputy, id, numbers}));
                                  
```

## Asking the questions...
There is a wide variation in the number of questions asked by Deputies. Take a look at how many questions have been asked by your public representative.

```js
function deputyChart(data, {width}) {
  return Plot.plot({
    marginBottom: 50,
    width: 1000,
  x: {axis: null},
  y: {label: "Number of questions asked"},
  marks: [
    Plot.image(arrayOfNumbersByDeputy, {x: "deputy", y: "numbers",
                                        src: (d) => (`https://data.oireachtas.ie/ie/oireachtas/member/id/${d.id}/image/thumb`),
                                        r: 18,       title:  (d) =>
        (`${d.deputy} asked ${(d.numbers).toLocaleString("en-US")} questions this year`)})
  ]
});
}
```

<div class="grid grid-cols-1">
  <div class="card">
    ${resize((width) => deputyChart(arrayOfNumbersByDeputy, {width}))}
  </div>
</div>

Parliamentary questions are published on the Oireachtas website. [Take a deep dive](https://www.oireachtas.ie/en/debates/questions) and see what you can learn from this rich resource.

Data: [PQ Explorer](https://www.oireachtas.ie/pq-explorer)

---
