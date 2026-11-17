# STEAMPlay - bench test sheet (v0.2.0)

Load the extension's test project (`test.ts`) onto a micro:bit V2.
The screen shows **S** (single), **D** (double), **L** (long) or **T** (together).
The top-row dot shows the input: left = A, middle = A+B, right = B, centre dot added = logo.
Contacts: wire P1 to GND through a switch or swinging contact; the bottom row counts contacts.
Pin stop: a push button between P2 and GND. Beat light: an LED and resistor from P8 to GND.
Rows 1–27 are from v0.1.0; rows 28 onwards are new in v0.2.0.

Tick each row and note anything odd in the last column.

## Buttons

| # | Do this | Expect | OK? | Notes |
| --- | --- | --- | --- | --- |
| 1 | Tap A once | S, top-left, about 0.4 s after letting go | | |
| 2 | Tap A twice quickly | D, top-left (no S first) | | |
| 3 | Tap A twice, slowly (about 1 s apart) | S, then S again | | |
| 4 | Hold A about 1.5 s, let go | L, top-left | | |
| 5 | Hold A 4 s, let go | Nothing changes | | |
| 6 | Tap A, then hold A 1.5 s | S, then L | | |
| 7 | Repeat 1-6 on B | Same, top-right | | |
| 8 | Press A and B together, let go | S, top-middle (never A or B) | | |
| 9 | Press A, then B a moment later, let go | S, top-middle | | |
| 10 | Double tap A+B | D, top-middle | | |
| 11 | Ask a few kids to double tap A | Most get D, not S S | | Window feels: too short / right / too long |

## Logo (V2 only)

| # | Do this | Expect | OK? | Notes |
| --- | --- | --- | --- | --- |
| 12 | Touch the logo once | S with centre dot | | |
| 13 | Double touch the logo | D with centre dot | | How reliable? __ / 10 |
| 14 | Hold A, touch logo, let go | T, top-left | | |
| 15 | Hold B, touch logo, let go | T, top-right | | |
| 16 | Press A normally while holding the micro:bit by its top edge | S for A, not T | | |

## Emergency stop

| # | Do this | Expect | OK? | Notes |
| --- | --- | --- | --- | --- |
| 17 | Hold the logo 2 s, let go | Nothing (no restart) | | |
| 18 | Hold the logo 3 s+ | Cross appears while still holding | | |
| 19 | Then let go | Program restarts (happy face) | | |

## Contacts (P1 to GND)

| # | Do this | Expect | OK? | Notes |
| --- | --- | --- | --- | --- |
| 20 | Touch P1 to GND briefly | One new dot on the bottom row | | |
| 21 | Swing a contact through quickly | Counts once per swing | | |
| 22 | Touch twice within 1 s | Counts once | | |
| 23 | Touch twice more than 1 s apart | Counts twice | | |
| 24 | Check the contact time (Show data / serial) | A sensible number of ms | | |
| 25 | Shortest swing that still counts | | | |

## Simulator

| # | Do this | Expect | OK? | Notes |
| --- | --- | --- | --- | --- |
| 26 | Rows 1-10 in the MakeCode simulator | Same results | | |
| 27 | Toggle P1 in the simulator | Counts (may not work in the simulator) | | |

## Compare with MakeCode's own button block

| # | Do this | Expect | OK? | Notes |
| --- | --- | --- | --- | --- |
| 28 | In a new project, add MakeCode's "on button A pressed" (show 1) and our double press on A (show 2). Double tap A | MakeCode's block runs twice, then ours shows 2 | | |
| 29 | Swap MakeCode's block for our single press on A (show 1). Double tap A | Only 2 | | |

## Secret code and temperature (test project)

| # | Do this | Expect | OK? | Notes |
| --- | --- | --- | --- | --- |
| 30 | Tap A, B, B, A quickly | Diamond and the "yes" sound | | |
| 31 | Tap A, B, wait 2 s, B, A | Nothing (too slow) | | |
| 32 | Warm the micro:bit with your hand | Up arrow after about 2 °C | | |
| 33 | Let it cool | Down arrow after about 2 °C | | |

## Pin emergency stop (button between P2 and GND)

| # | Do this | Expect | OK? | Notes |
| --- | --- | --- | --- | --- |
| 34 | Press the P2 button briefly | Cross straight away, restarts on release | | |
| 35 | Hold it, then let go | Cross while held, restarts on release | | |
| 36 | Logo stop (rows 17–19) still works with the pin stop added | Same as before | | |
| 37 | Wiggle a loose P2 wire without pressing | No stop (brief sparks are ignored) | | |

## Music and lights (test project)

| # | Do this | Expect | OK? | Notes |
| --- | --- | --- | --- | --- |
| 38 | Start the program | Boot-up sound; P8 LED flashes to the beat | | |
| 39 | Touch P1 to GND | Goal sound | | |
| 40 | Touch P1 again while the goal sound plays (after 1 s) | Sound starts again, not two sounds at once | | |
| 41 | Is the P8 LED steady when filmed on a phone? | No flicker | | |

## Every sound and song (ear check)

Make a new project with the extension, open the JavaScript tab and paste this in. Press A for the next sound; the screen shows its number.

```typescript
let n = 0
input.onButtonPressed(Button.A, function () {
    basic.showNumber(n)
    if (n < 10) steamplayMusic.playSound(n, SteamplayPlayMode.InBackground)
    else steamplayMusic.playSong(n - 10, SteamplayPlayMode.InBackground)
    n = (n + 1) % 30
})
```

Mark each one: sounds right / wrong notes / too fast / too slow.

| # | Sound | OK? | Notes |
| --- | --- | --- | --- |
| 0–9 | goal, mission complete, boot-up, horn, horn 1, horn 2, countdown, uh-oh, yes, alarm | | |
| 10 | Waltzing Matilda (check the tune carefully) | | |
| 11 | William Tell gallop | | |
| 12 | Hall of the Mountain King | | |
| 13 | Can-Can | | |
| 14 | Flight of the Bumblebee | | |
| 15 | When the Saints Go Marching In | | |
| 16 | Advance Australia Fair (check against the official PM&C sheet music) | | |
| 17 | God Save the King | | |
| 18 | The Star-Spangled Banner | | |
| 19 | La Marseillaise (check the tune carefully) | | |
| 20 | O Canada | | |
| 21 | Toccata and Fugue | | |
| 22 | Funeral March of a Marionette (check the tune carefully) | | |
| 23 | Danse Macabre (check the tune carefully) | | |
| 24 | Jingle Bells | | |
| 25 | Deck the Halls | | |
| 26 | We Wish You a Merry Christmas | | |
| 27 | Silent Night | | |
| 28 | Hot Cross Buns | | |
| 29 | Sumer Is Icumen In (check the tune carefully) | | |

## Band (2–3 micro:bits)

On each micro:bit: "join band to play [song] as part [1/2/3] radio group [1]", and "start the band" in
"on button A pressed".

| # | Do this | Expect | OK? | Notes |
| --- | --- | --- | --- | --- |
| 42 | Frère Jacques, 3 micro:bits, press A on part 1 | All start together; round enters every 2 bars | | |
| 43 | Same, press A on part 3 | All start together | | |
| 44 | Pachelbel's Canon, full length | Still in time at the end | | |
| 45 | Turn part 1 off halfway | Others keep playing | | |
| 46 | Each song: Row Row, Sumer, Canon, Jingle Bells | Sounds right together | | |
