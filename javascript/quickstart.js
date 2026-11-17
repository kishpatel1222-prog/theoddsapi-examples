// TheOddsAPI quickstart (ESM, works in Node 18+, Deno, Bun).
//
// Get a free key at https://bettingdataapi.com/start.html then:
//   export ODDS_API_KEY=your_key_here
//   node quickstart.js
//
// Response shape for GET /odds/: each event has a flat `books` array where
// each entry is one bookmaker+market pair:
//   { book: "draftkings", market: "h2h", outcomes: [{ name, price }] }

const BASE_URL = "https://api.bettingdataapi.com";
const API_KEY = process.env.ODDS_API_KEY;

if (!API_KEY) {
  console.error("Set ODDS_API_KEY first: export ODDS_API_KEY=your_key_here");
  process.exit(1);
}

const headers = { "x-api-key": API_KEY };

async function getJson(path, params = {}) {
  const url = new URL(path, BASE_URL);
  for (const [k, v] of Object.entries(params)) url.searchParams.set(k, v);
  const res = await fetch(url, { headers });
  if (!res.ok) throw new Error(`${res.status} ${res.statusText} for ${url}`);
  return res.json();
}

// 1. List every supported sport and its sport_key
const sports = await getJson("/sports/");
console.log(`${sports.length} sports available. Sample:`);
for (const s of sports.slice(0, 5)) console.log(`  ${s.sport_key}`);

// 2. Live MLB moneylines from two US books (free-tier friendly)
const events = await getJson("/odds/", {
  sport_key: "baseball_mlb",
  markets: "h2h",
  bookmakers: "draftkings,fanduel",
});
console.log(`\n${events.length} upcoming MLB games`);

// 3. Best available moneyline per team across books.
//    Best price = highest American odds value.
for (const event of events.slice(0, 5)) {
  const best = new Map(); // team -> { price, book }
  for (const entry of event.books ?? []) {
    if (entry.market !== "h2h") continue;
    for (const { name, price } of entry.outcomes ?? []) {
      if (name == null || price == null) continue;
      if (!best.has(name) || price > best.get(name).price) {
        best.set(name, { price, book: entry.book });
      }
    }
  }
  console.log(`\n${event.away_team} at ${event.home_team}`);
  for (const [team, { price, book }] of best) {
    console.log(`  best ${team}: ${price > 0 ? "+" : ""}${price} at ${book}`);
  }
}
