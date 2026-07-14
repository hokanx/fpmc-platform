# EP01 — The Day Gaming Died (The Crash of 1983)

**Status:** production-ready · **Format:** 16:9, faceless, EN, subtitles ON (`anton`)
**Length:** 5 min = 30 blocks (a defined 3-minute cut is marked at the end)
**Working title options:** see `07_UPLOAD-PACKAGE-TEMPLATES.md` §EP01

## Sources (verified 2026-07)

- US video game industry revenue: ~$3.2B (1983) → ~$100M (1985), a ~97% drop
- Atari VCS launch Sept 1977 at $199; Atari widely cited as the fastest-growing US company of its era
- Activision founded 1979 by four ex-Atari programmers; Atari's lawsuit failed, opening third-party development
- Atari 2600 *Pac-Man* (1982): ~12M cartridges manufactured vs. ~10M consoles in homes
- *E.T.* (1982): movie rights reported at $20–25M; Howard Scott Warshaw built the game in ~5 weeks
- Dec 7, 1982: Warner Communications earnings warning; stock fell roughly a third
- Atari's 1983 losses: ~$536M; Sept 1983 burial of cartridges at Alamogordo, NM (excavated & confirmed April 2014)
- NES test launch: New York City, Oct 18, 1985, with R.O.B. and retailer buy-back guarantees

---

## Style key (Phase 1 — generate ONCE, reuse for every episode)

`generate_image`, model `nano_banana_pro`, aspect_ratio `16:9`:

```
Abstract style swatch, no characters, no objects, no letters: cinematic
painterly documentary illustration style. Muted palette of CRT phosphor
teal, warm amber, and deep charcoal. Soft film grain, gentle volumetric
light, subtle scanline texture, dramatic chiaroscuro contrast, matte
painterly brushwork. Non-photorealistic, no live-action, no realism,
no 3D render.
```

**STYLE tokens** (used verbatim in every block prompt below as `{STYLE}`):
`cinematic painterly documentary illustration, CRT phosphor teal / warm
amber / deep charcoal palette, soft film grain, volumetric light, subtle
scanline texture, non-photorealistic`

**NEGATIVE tokens** (every block, as `{NEG}`):
`color drift, photorealism, 3D render, live-action, lip-sync, captions,
on-screen text, watermark, readable logos or trademarks, recognizable
copyrighted game characters`

---

## Narration blocks (Phase 2 — voice each with the channel `voice_id`, plain text, ≤9.5 s)

```
Block 1
Nineteen eighty-three. Video games are a three point two billion dollar industry. Within two years, ninety-seven percent of it will be gone.
Block 2
Millions of cartridges will be buried in a desert landfill. Giants will collapse overnight. And America will decide that video games are dead.
Block 3
But this collapse was no accident. It was built into the boom itself. This is the story of gaming's first extinction.
Block 4
Rewind to nineteen seventy-seven. Atari ships the Video Computer System, a wood-paneled box that brings the arcade into the living room.
Block 5
It costs under two hundred dollars. Within five years, Atari becomes the fastest growing company in American history.
Block 6
By nineteen eighty-two, a games console sits in one of every three American homes with children. Wall Street calls it unstoppable.
Block 7
The rocket fuel was a single cartridge. Space Invaders, licensed from Japan, quadrupled console sales and invented the killer app.
Block 8
Then came the maze craze. One yellow circle earned billions in quarters, and spawned hit records, cereals, and Saturday morning cartoons.
Block 9
Atari's parent company, Warner, watched profits triple. By nineteen eighty-two, this single division earned half of Warner's entire income.
Block 10
Then four Atari programmers asked for royalties. Refused, they walked out and founded Activision, the world's first third-party game studio.
Block 11
Atari sued, and lost. The courts ruled that anyone could make cartridges for the console. The gates were now wide open.
Block 12
By late nineteen eighty-two, more than fifty companies were flooding the shelves. Even a cereal maker. Even a dog food brand.
Block 13
Quality collapsed. Stores could not tell the treasures from the trash, so they stocked everything. And almost everything was trash.
Block 14
Atari manufactured twelve million cartridges of its Pac-Man port, for a market of ten million consoles. The game was rushed, and it showed.
Block 15
Next, Atari paid over twenty million dollars for the E.T. movie license, and gave one programmer just five weeks to build the game.
Block 16
E.T. reached stores that Christmas. Within weeks, mountains of returned cartridges were piling up in Atari's warehouses.
Block 17
On December seventh, nineteen eighty-two, Warner admitted sales were collapsing. Its stock lost a third of its value almost overnight.
Block 18
At the same time, home computers attacked. The Commodore sixty-four crashed below three hundred dollars, and it did far more than play games.
Block 19
Desperate retailers dumped cartridges into bargain bins at five dollars each. Why would anyone pay forty for a new game again?
Block 20
The shelves that once fought over video games now refused to restock them. The toy buyers had moved on to the next fad.
Block 21
In nineteen eighty-three alone, Atari lost five hundred thirty-six million dollars. The fastest growing company in history was bleeding out.
Block 22
That September, trucks rolled out of Atari's Texas plant by night, heading for a landfill outside Alamogordo, New Mexico.
Block 23
Millions of unsold cartridges were crushed, buried, and sealed under concrete. Atari denied everything. A legend was born.
Block 24
By nineteen eighty-five, industry revenue had fallen from three point two billion to barely one hundred million. The fad, they said, was over.
Block 25
But across the Pacific, nobody had told Japan. In Tokyo, a playing card company's little red and white console was selling millions.
Block 26
Nintendo knew American stores would never touch a video game again. So it built a disguise: a toy robot, and a new name. The Entertainment System.
Block 27
In October nineteen eighty-five, Nintendo test-launched in New York City, promising skeptical retailers full refunds on anything unsold.
Block 28
Inside that gray box was a plumber in red overalls. Word spread from playground to playground. The dead industry was breathing again.
Block 29
And the buried cartridges? In twenty fourteen, excavators opened the Alamogordo landfill, and pulled E.T. out of the desert floor. The legend was true.
Block 30
Gaming's first empire died of its own greed, and a better one grew from its grave. Next time: the puzzle game that escaped the Iron Curtain.
```

---

## Block prompts (Phase 3 — `generate_video`, model `gemini_omni`, duration 10, 720p, style key attached)

Every prompt uses this exact frame — only SCENE / MOTION / AUDIO vary:

```
Block N
STYLE REFERENCE: Match the attached style key EXACTLY — {STYLE}.
SCENE: <below>
MOTION: <below>
AUDIO: <below>
NEGATIVE: {NEG}
```

| # | SCENE | MOTION | AUDIO |
|---|---|---|---|
| 1 | A vast 1980s American electronics store at golden hour, endless shelves of glowing television sets and game cartridges stretching into darkness | Slow forward dolly down the aisle, TVs flickering one by one to static | low synth drone, faint arcade bleeps, electrical hum |
| 2 | A desert landfill at dusk, a bulldozer silhouette pushing a dune of small rectangular boxes, dust clouds glowing amber | Wide slow pan right, dust drifting across frame | wind, distant machinery rumble |
| 3 | A towering house of cards made of game cartridges on a boardroom table, one card mid-fall, dramatic side light | Slow push-in as the structure begins to topple in slow motion | deep bass pulse, single card flick |
| 4 | A cozy 1977 living room, wood-paneled console being connected to a bulky CRT television by unseen hands casting long shadows | Gentle push-in toward the glowing screen as it blinks alive | CRT power-on hum, warm room tone, soft crackle |
| 5 | A line graph made of neon light climbing across a dark wall of a corporate lobby, reflections on polished floor | Camera tracks upward following the rising line | ascending synth arpeggio, cash register chime muffled |
| 6 | Suburban night street, every house window glowing teal from television light, one third of them flickering with game shapes | Slow aerial drift over the rooftops | crickets, muffled arcade sounds from houses |
| 7 | Rows of pixel-style alien shapes descending over a city skyline poster on a bedroom wall, a joystick in foreground | Slow tilt down from poster to joystick, dust motes in light beam | retro laser blips, marching electronic beat |
| 8 | An abstract glowing maze of teal corridors, a luminous circle gliding through it, quarters raining in the dark background | Camera glides through the maze corridor | coin cascade, upbeat chiptune melody |
| 9 | A skyscraper boardroom at night, a giant glowing pie chart on the wall, half of it burning bright amber | Slow orbit around the conference table silhouettes | low corporate drone, ticking clock |
| 10 | Four silhouetted figures walking out of a glass office tower at dawn, carrying boxes, long shadows ahead of them | Tracking shot alongside the walking figures | footsteps echo, hopeful synth swell |
| 11 | A courtroom gavel frozen mid-strike, behind it a floodgate of cartridges bursting open in painterly slow motion | Push-in on the gavel, then cartridges flood past camera | gavel strike reverb, rushing torrent |
| 12 | A supermarket shelf crammed with absurd cartridge boxes — cereal mascots, dog bones, random clip-art art styles | Lateral tracking along the endless shelf | shopping cart rattle, jingle fragments overlapping |
| 13 | A dim warehouse aisle, identical cartridge boxes toppling like dominoes into shadow | Camera pulls back as dominoes fall toward lens | domino clicks accelerating, hollow reverb |
| 14 | A factory conveyor belt over-spilling with cartridges, a small counter display reading far past a mechanical dial's limit, springs popping | Static wide shot, belt accelerating unnaturally | conveyor clatter, machinery straining |
| 15 | A single desk lamp over a programmer's silhouette at a terminal, five calendar pages burning away on the wall | Slow push-in on the glowing terminal | keyboard clatter, ticking clock, low tense drone |
| 16 | A warehouse mountain of returned boxes reaching toward skylights, snow falling outside the windows | Slow tilt up the box mountain to the gray light | wind, sliding cardboard, distant forklift |
| 17 | A stock ticker board in a rainy plaza at night, red numbers cascading downward, umbrellas below | High angle looking down, numbers raining like glass shards | rain, alarm bell muffled, descending tones |
| 18 | A friendly beige home computer glowing on a teenager's desk, homework beside a game, price tag falling in foreground | Slow arc around the desk setup | keyboard clicks, cheerful chiptune vs. dark bass |
| 19 | A wire bargain bin overflowing with cartridges under harsh fluorescent light, a five-dollar sign swinging above | Top-down slow rotate over the bin | fluorescent buzz, cartridges clattering |
| 20 | An empty toy store shelf, faded rectangles where boxes once stood, a lone price gun on the floor | Slow lateral dolly past the empty shelf | hollow room tone, single footstep echo |
| 21 | A CEO's office at night, red ledger lines projected across a man's silhouette staring out at city lights | Slow push past the silhouette toward the window | somber piano note, distant traffic |
| 22 | A convoy of semi-trucks on a desert highway at night, headlights carving through darkness toward distant mesas | Aerial tracking shot following the convoy | diesel engines, night wind, ominous low strings |
| 23 | Wet concrete pouring over a pit of crushed cartridges in moonlight, steam rising | Slow top-down descent toward the pit | concrete sludge, shovel scrapes, deep drone |
| 24 | A dead arcade interior, cabinets dark and draped in dust sheets, one screen still faintly flickering | Slow dolly through the dark arcade | dripping water, faint dying melody |
| 25 | Neon-lit Tokyo street at night, warm light spilling from a toy shop window crowded with silhouettes of children | Push-in toward the glowing shop window | city bustle, cheerful distant jingle |
| 26 | A small toy robot standing in a spotlight on a department store pedestal, gray console box behind it half in shadow | Slow orbit around the robot | servo whirs, curious music-box motif |
| 27 | New York City winter street 1985, a store marquee glowing, breath-fog crowds gathering at the window | Crane down from marquee to the crowd | city traffic, murmur of a crowd, hopeful brass swell |
| 28 | Children crowded around a glowing living-room television, colorful side-scrolling light reflected on their faces | Slow push-in over their shoulders toward the glow | children laughing softly, bright chiptune melody |
| 29 | A desert excavation at dawn, a claw lifting a dusty cartridge from broken concrete, press cameras flashing | Slow rise from the pit revealing the crowd above | wind, camera shutters, awe-struck orchestral swell |
| 30 | Time-lapse: from the buried pit, a neon skyline of modern gaming light grows out of the desert horizon | Slow pull-back from pit to glowing horizon | heartbeat bass into warm full synth theme |

---

## 3-minute launch cut (18 blocks) — if calibration says the 5-min is too expensive

Use blocks **1, 2, 3, 4, 5, 7, 8, 12, 13, 14, 15, 16, 17, 19, 21, 22, 23** (17)
plus this alternate closer as block 18:

```
Block 18 (3-min closer)
Buried under the desert, gaming's first empire was gone. But from that grave, an industry would learn how to be reborn. That story is next.
```

Pair it with block 30's video prompt (the pull-back to the neon horizon).

## QC checklist for this episode

- [ ] No readable text/logos appeared in any clip (regenerate if so)
- [ ] Style consistent across all blocks (key attached to every job?)
- [ ] Numbers in narration match the Sources list above
- [ ] Each voice take ≤ 9.5 s
- [ ] Subtitles synced after assembly
