// TheOddsAPI quickstart (CommonJS, Node 18+, zero dependencies).
//
// Get a free key at https://theoddsapi.com/start.html then:
//   export ODDS_API_KEY=your_key_here
//   node quickstart.cjs

const BASE_URL = "https://api.theoddsapi.com";
const API_KEY = process.env.ODDS_API_KEY;

if (!API_KEY) {
  console.error("Set ODDS_API_KEY first: export ODDS_API_KEY=your_key_here");
  process.exit(1);
}

async function getJson(path, params = {}) {
  const url = new URL(path, BASE_URL);
  for (const [k, v] of Object.entries(params)) url.searchParams.set(k, v);
  const res = await fetch(url, { headers: { "x-api-key": API_KEY } });
  if (!res.ok) throw new Error(`${res.status} ${res.statusText} for ${url}`);
  return res.json();
}

async function main() {
  // 1. List every supported sport and its sport_key
  const sports = await getJson("/sports/");
  console.log(`${sports.length} sports available. Sample:`);
  sports.slice(0, 5).forEach((s) => console.log(`  ${s.sport_key}`));

  // 2. Live MLB moneylines from two US books (free-tier friendly)
  const events = await getJson("/odds/", {
    sport_key: "baseball_mlb",
    markets: "h2h",
    bookmakers: "draftkings,fanduel",
  });
  console.log(`\n${events.length} upcoming MLB games`);

  // 3. Best available moneyline per team across books.
  //    Best price = highest American odds value. Each entry in
  //    event.books is one bookmaker+market pair with its outcomes.
  for (const event of events.slice(0, 5)) {
    const best = new Map();
    for (const entry of event.books || []) {
      if (entry.market !== "h2h") continue;
      for (const o of entry.outcomes || []) {
        if (o.name == null || o.price == null) continue;
        if (!best.has(o.name) || o.price > best.get(o.name).price) {
          best.set(o.name, { price: o.price, book: entry.book });
        }
      }
    }
    console.log(`\n${event.away_team} at ${event.home_team}`);
    for (const [team, { price, book }] of best) {
      console.log(`  best ${team}: ${price > 0 ? "+" : ""}${price} at ${book}`);
    }
  }
}

main().catch((err) => {
  console.error(err.message);
  process.exit(1);
});
