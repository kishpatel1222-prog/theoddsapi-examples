# TheOddsAPI Examples

Minimal, copy-paste quickstarts for [TheOddsAPI](https://theoddsapi.com), a real-time sports odds API that returns normalized betting lines from 50+ sportsbooks across 26 sports in one JSON response.

Get a free API key in under a minute at [theoddsapi.com/start.html](https://theoddsapi.com/start.html). No credit card. The free tier covers NBA and MLB moneylines, 25 requests per day, which is exactly what these examples use.

## The API in three lines

```
Base URL:  https://api.theoddsapi.com        (no /v4/ prefix)
Auth:      x-api-key: YOUR_API_KEY           (one header, every request)
Try it:    GET /odds/?sport_key=baseball_mlb&markets=h2h&bookmakers=draftkings,fanduel
```

Full endpoint reference: [Swagger UI](https://api.theoddsapi.com/docs) · [OpenAPI spec](https://api.theoddsapi.com/openapi.json) · [Quickstart guide](https://theoddsapi.com/quickstart.html)

## Examples in this repo

| File | Runtime | What it does |
|---|---|---|
| `python/quickstart.py` | Python 3.8+ (`pip install requests`) | List sports, pull MLB moneylines, print the best available price per team |
| `javascript/quickstart.js` | Any modern JS runtime with `fetch` (Node 18+, Deno, Bun) | Same flow in ESM JavaScript |
| `node/quickstart.cjs` | Node 18+ (CommonJS, zero dependencies) | Same flow for CommonJS projects |

Each script does the same three things so you can diff them across languages:

1. `GET /sports/` to list every supported sport and its `sport_key`
2. `GET /odds/?sport_key=baseball_mlb&markets=h2h&bookmakers=draftkings,fanduel` to pull live moneylines
3. Convert American odds to decimal and print the best available price per team across books

## Run them

```bash
export ODDS_API_KEY=your_key_here

python3 python/quickstart.py
node javascript/quickstart.js
node node/quickstart.cjs
```

## Going further

- **Official SDKs**: prefer these over raw HTTP for a new project. Python: [theoddsapi-python](https://github.com/theoddsapi/theoddsapi-python) (`pip install theoddsapi-client`). JavaScript: [theoddsapi-js](https://github.com/theoddsapi/theoddsapi-js) (`npm install @theoddsapi/client`). Both wrap every endpoint below as one method call with built-in retries and a single error type.
- **All markets and sports** (spreads, totals, player props, 25+ sports): see [pricing tiers](https://theoddsapi.com/#pricing). Professional is $29/mo, Business is $99/mo.
- **Edge detection**: the Business tier includes `GET /edges/` with Pinnacle-anchored sharp-line comparison. How it works: [Pinnacle sharp lines guide](https://theoddsapi.com/guides/sharp-lines-pinnacle).
- **Historical odds for backtesting**: `GET /historical/odds` on Business. [Backtesting guide](https://theoddsapi.com/guides/historical-odds-backtesting).
- **Use it inside Claude with no code**: TheOddsAPI has an official MCP connector. Setup: [theoddsapi.com/connector.html](https://theoddsapi.com/connector.html).
- **Hand this API to an AI coding assistant**: copy-paste spec at [theoddsapi.com/build-with-ai.html](https://theoddsapi.com/build-with-ai.html).

## Common mistakes

- Wrong auth header. It is `x-api-key`, not `Authorization` or `Bearer`.
- Adding a `/v4/` path prefix. There is none. The hyphenated domain with `/v4/` paths is a different service.
- Dropping the trailing slash. Use `/odds/` and `/sports/`, not `/odds` and `/sports`.
- Requesting Pinnacle on the free tier. Pinnacle and international books are Business-tier.

## License

MIT. Use these snippets in anything. Independently developed against the published TheOddsAPI OpenAPI specification.
