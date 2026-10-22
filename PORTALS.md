# Getting paid: game-portal submission guide

Portals such as **CrazyGames, Poki, GameDistribution, itch.io and Newgrounds** host your game, show ads around it and share the revenue with you. Each portal has its own rules and SDK, so treat this as a checklist, not a guarantee. Always read the portal's current developer terms.

## Best 10 games to submit first
Chosen because they are the most original, polished and replayable in this collection (portals mostly reject copies of famous games):

| # | Game | File | Why |
|---|------|------|-----|
| 1 | Sky Hop Words | `sky-hop.html` | Original idea, kids + typing audience |
| 2 | Sky Hop Math | `sky-hop-math.html` | Same hook, math audience |
| 3 | Dragon Keys: The Lost Fort | `dragon-keys-quest.html` | 25-chapter 3D story, strong standout |
| 4 | Fruit Merge | `fruit-merge.html` | Addictive physics merge loop |
| 5 | Stack Tower | `stack-tower.html` | One-tap, instantly understood |
| 6 | Candy Match | `candy-match.html` | Casual match-3 audience |
| 7 | Tower Defense | `tower-defense.html` | Longer sessions = more ad revenue |
| 8 | Space Shooter | `space-shooter.html` | Action audience |
| 9 | Cat Runner | `dino-runner.html` | Endless runner, short sessions |
| 10 | Brick Breaker | `brick-breaker.html` | Classic with power-ups |

## What each game needs before you submit
1. **Remove the "Home" link** (portals do not allow links out of the game) and the privacy/footer links.
2. **No outside files.** Portals usually require the game to work without loading anything from other sites. The 3D story game (`dragon-keys-quest.html`) loads three.js from a CDN, and every game links `dragon-theme.css` / `dragon-theme.js`. For a portal build, download `three.min.js` into the game folder and point to it, and inline or remove the theme files.
3. **One folder per game** with `index.html` as the entry (rename the game file) plus any assets. Zip it (most portals want a zip under 50 MB; these are tiny).
4. **Add the portal's SDK** (ads between rounds, "gameplay start/stop" events). Each portal documents this. I have not added any SDK yet.
5. **Thumbnails and screenshots** (usually 1280x720 and square). Take them from the game.
6. **Test** on phone and desktop. All games already resize to fit.

## Do not submit
- The play-money games (slots, wheel, scratch cards, peg drop, coin pusher, treasure chests). Most portals and ad networks restrict simulated gambling.
- Anything that still resembles a famous brand's game too closely (the renamed ones are better, but portals judge by look and feel too).

## Other money routes (see the main chat for details)
Your own domain with AdSense (set `ads-config.js`), a school / parent edition, mobile apps, donations (Buy Me a Coffee), and custom game work.
