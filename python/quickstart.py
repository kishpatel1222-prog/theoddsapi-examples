#!/usr/bin/env python3
"""TheOddsAPI quickstart: list sports, pull MLB moneylines, find best prices.

Get a free key at https://theoddsapi.com/start.html then:
    export ODDS_API_KEY=your_key_here
    pip install requests
    python3 quickstart.py

Response shape for GET /odds/:
    [
      {
        "event_id": "...", "sport_key": "baseball_mlb",
        "home_team": "...", "away_team": "...", "start_time": "...",
        "books": [
          {"book": "draftkings", "market": "h2h",
           "outcomes": [{"name": "Team", "price": -120}, ...]},
          ...
        ]
      },
      ...
    ]
"""
import os
import sys

import requests

BASE_URL = "https://api.theoddsapi.com"
API_KEY = os.environ.get("ODDS_API_KEY")

if not API_KEY:
    sys.exit("Set ODDS_API_KEY first: export ODDS_API_KEY=your_key_here")

HEADERS = {"x-api-key": API_KEY}

# 1. List every supported sport and its sport_key
resp = requests.get(f"{BASE_URL}/sports/", headers=HEADERS, timeout=30)
resp.raise_for_status()
sports = resp.json()
print(f"{len(sports)} sports available. Sample:")
for s in sports[:5]:
    print(f"  {s.get('sport_key')}")

# 2. Live MLB moneylines from two US books (free-tier friendly)
resp = requests.get(
    f"{BASE_URL}/odds/",
    headers=HEADERS,
    params={
        "sport_key": "baseball_mlb",
        "markets": "h2h",
        "bookmakers": "draftkings,fanduel",
    },
    timeout=30,
)
resp.raise_for_status()
events = resp.json()
print(f"\n{len(events)} upcoming MLB games")

# 3. Best available moneyline per team across books.
#    Best price = highest American odds value (more positive / less
#    negative pays the bettor more).
for event in events[:5]:
    best = {}  # team name -> (price, book)
    for entry in event.get("books", []):
        if entry.get("market") != "h2h":
            continue
        for outcome in entry.get("outcomes", []):
            team, price = outcome.get("name"), outcome.get("price")
            if team is None or price is None:
                continue
            if team not in best or price > best[team][0]:
                best[team] = (price, entry.get("book"))
    print(f"\n{event.get('away_team')} at {event.get('home_team')}")
    for team, (price, book) in best.items():
        print(f"  best {team}: {price:+g} at {book}")
