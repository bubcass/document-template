async function json(url) {
  const response = await fetch(url);
  if (!response.ok) throw new Error(`fetch failed: ${response.status}`);
  return await response.json();
}

const jan = await json(`https://api.oireachtas.ie/v1/questions?date_start=2024-01-01&date_end=2024-01-31&limit=9999&qtype=oral,written`);
const feb = await json(`https://api.oireachtas.ie/v1/questions?date_start=2024-02-01&date_end=2024-02-28&limit=9999&qtype=oral,written`)
const leap = await json(`https://api.oireachtas.ie/v1/questions?date_start=2024-02-29&date_end=2024-02-29&limit=9999&qtype=oral,written`)
const mar = await json(`https://api.oireachtas.ie/v1/questions?date_start=2024-03-01&date_end=2024-03-31&limit=9999&qtype=oral,written`)
const apr = await json(`https://api.oireachtas.ie/v1/questions?date_start=2024-04-01&date_end=2024-04-30&limit=9999&qtype=oral,written`)
const may = await json(`https://api.oireachtas.ie/v1/questions?date_start=2024-05-01&date_end=2024-05-31&limit=9999&qtype=oral,written`)
const jun = await json(`https://api.oireachtas.ie/v1/questions?date_start=2024-06-01&date_end=2024-06-30&limit=9999&qtype=oral,written`)
const jul = await json(`https://api.oireachtas.ie/v1/questions?date_start=2024-07-01&date_end=2024-07-31&limit=9999&qtype=oral,written`)
const aug = await json(`https://api.oireachtas.ie/v1/questions?date_start=2024-08-01&date_end=2024-08-31&limit=9999&qtype=oral,written`)
const sep = await json(`https://api.oireachtas.ie/v1/questions?date_start=2024-09-01&date_end=2024-09-30&limit=9999&qtype=oral,written`)
const oct = await json(`https://api.oireachtas.ie/v1/questions?date_start=2024-10-01&date_end=2024-10-31&limit=9999&qtype=oral,written`)
const nov = await json(`https://api.oireachtas.ie/v1/questions?date_start=2024-11-01&date_end=2024-11-30&limit=9999&qtype=oral,written`)
const dec = await json(`https://api.oireachtas.ie/v1/questions?date_start=2024-12-01&date_end=2024-12-31&limit=9999&qtype=oral,written`) 
const questions = ([...jan.results, ...feb.results, ...leap.results, ...mar.results, ...apr.results, ...may.results, ...jun.results, ...jul.results, ...aug.results, ...sep.results, ...oct.results, ...nov.results, ...dec.results]).filter(d => d.question.by.showAs != null);
const QuestionsData = questions.map((d) => ({
  Date: d.question.date,
  Department: d.question.to.showAs,
  Heading: d.question.debateSection.showAs,
  Deputy: d.question.by.showAs,
  Text: d.question.showAs,
  Type: d.question.questionType,
  memberCode: d.question.by.memberCode 
}));
const rolled =    Array.from(
  d3.flatRollup(QuestionsData, v => v.length, d => d.Heading), 
([id, value]) => ({id, value})
);

process.stdout.write(JSON.stringify(rolled));