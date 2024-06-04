async function json(url) {
  const response = await fetch(url);
  if (!response.ok) throw new Error(`fetch failed: ${response.status}`);
  return await response.json();
}

const members = await json(`https://api.oireachtas.ie/v1/members?date_start=1900-01-01&chamber_id=&chamber=dail&house_no=33&date_end=2099-01-01&limit=5000`);
const membersData = members.results.map((d) => ({
  Name: d.member.fullName,
  memberCode: d.member.memberCode,
  constituency: d.member.memberships[0].membership.represents[0].represent.showAs,
  Code: d.member.memberships[0].membership.represents[0].represent.representCode
}));

process.stdout.write(JSON.stringify(membersData));