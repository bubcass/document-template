async function json(url) {
  const response = await fetch(url);
  if (!response.ok) throw new Error(`fetch failed: ${response.status}`);
  return await response.json();
}

const questions = await json(`https://api.oireachtas.ie/v1/questions?date_start=2024-01-01&date_end=2025-01-31&limit=9999&qtype=oral,written`);
const recentQuestionsData = questions.results.map((d) => ({
  Date: new Date (d.question.date).toLocaleString("en-IE", {
    dateStyle: 'full'
  }),
  Department: d.question.to.showAs,
  Heading: d.question.debateSection.showAs,
  Deputy: d.question.by.showAs,
  Text: d.question.showAs,
  Type: d.question.questionType
}));

process.stdout.write(JSON.stringify(recentQuestionsData));