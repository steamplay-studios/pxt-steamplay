# STEAMplay - bench test sheet (v0.5.0)

Load the extension's test project (`test.ts`) onto a micro:bit V2.
The screen shows **S** (single), **D** (double), **L** (long). A+logo / B+logo show S or L with the centre dot.
The top-row dot shows the input: left = A, middle = A+B, right = B, centre dot added = logo.
Contacts: wire P1 to GND through a switch or swinging contact; the bottom row counts contacts.
Pin stop: a push button between P2 and GND. Beat light: an LED and resistor from P8 to GND.
Rows 1–27 are from v0.1.0; rows 28–50 from v0.2.0; rows 51–64 from v0.3.0; rows with letters (eg 41b) are newer.

**New in v0.5.0, test these first:**
- Drive setup is now one block: "drive setup: left wheel motor [1] … right wheel motor [2] …" (Motors) and
  "micro drive setup: left wheel [S1] … right wheel [S2] …" (Servos). Old two-block setups still work but are hidden. Rows 57b, 63.
- One music menu (any song / any sound / any music / each song or sound by name) in "on music [ ] note beat"
  and "sync pin [P1] to [ ] [mode]" (+ "unsync pin"). Old "sync pin" and "on music note" blocks need the menu set. Rows 41b, 41c, 41f.
- "sync servo [1] to [ ]" / "unsync servo" (top of Servos) and "sync motor [1] to [ ]" / "unsync motor" (top of Motors):
  when the music ends they go back to how they were before it. Rows 41d, 41e.
- New sounds: siren 1 (wail), siren 2 (hi-lo), siren 3 (yelp). Ear-check list rows 9–11 (songs now start at 12).
- "on music note" no longer skips notes. "[beat] is even" / "is odd" blocks in Music → Light sync. Row 41c.

**From v0.4.0 (test if not done yet):**
- Secret code: tap logo, A, B, B quickly - the code runs (no A+logo, no lost A). Rows 30–31b.
- A+logo / B+logo are now in the single and long press menus (no "pressed together" block). Rows 14–16, 15b.
  Old "pressed together" blocks in your v0.3.0 project show as broken: swap in "on A+logo single pressed".
- Mirror: "mirror servo 2 to servo 1" = servo 2 follows servo 1 (swapped). Same for motors. Rows 56, 56b.
- Micro driving (two micro motors as a car) in STEAMplay Servos. Row 57b.
- Long "over ... s" blocks stay on one line. Row 57c.
- Songs redone: Waltzing Matilda, William Tell, Advance Australia Fair, Blow the Man Down, Hey Diddle Diddle,
  Wellerman; Chopin and Dies irae end at the long pause. Sounds: horn (higher), horn 1 (full ending). Ear-check list.
- Still to check: Little Bo Peep (no source found yet), logo lag.

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
| 12 | Touch the logo once | Nothing (in this project the logo is the code key). In a new project with only "on logo single pressed": runs straight away | | |
| 13 | Hold the logo about 1.5 s, let go | L with centre dot | | |
| 14 | Hold A, touch logo, let go | S, top-left + centre dot | | |
| 15 | Hold B, touch logo, let go | S, top-right + centre dot | | |
| 15b | Hold A and the logo together for 1.5 s, let go | L, top-left + centre dot | | |
| 16 | Press A normally while holding the micro:bit by its top edge | S for A, no centre dot | | |

## Emergency stop

| # | Do this | Expect | OK? | Notes |
| --- | --- | --- | --- | --- |
| 17 | Hold the logo 2 s, let go | L with centre dot (no restart) | | |
| 18 | Hold the logo 3 s+ | Cross appears while still holding | | |
| 19 | Then let go | Program restarts (happy face) | | |
| 19b | Hold the logo 3 s, then keep holding the board by its edges | Restarts by itself within 5 s | | |

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
| 30 | Tap logo, A, B, B quickly | Diamond only (no S or D while typing) | | |
| 31 | Tap logo, A, wait 2 s, B, B | No diamond; the B B after the gap shows D | | |
| 31b | Tap logo, B | B shows S (B doesn't fit the code, so it works normally) | | |
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
| 41b | Play the horn sound (P8 light synced to "any song") | P8 stays off for the horn, follows songs | | |
| 41c | "on music [Can-Can] note beat" swings servo 1 on even/odd beats; play Can-Can, then another song, then the horn | Servo dances to Can-Can only, on every note change (none skipped) | | |
| 41d | "sync servo 1 to Can-Can" with servo at 90 and "sync motor 1 to any song" stopped; play Can-Can while they move | When the song ends both go back (servo to 90, motor stops) | | |
| 41e | "unsync servo 1" then play Can-Can again | Servo stays wherever the last move left it | | |
| 41f | "unsync pin P8" | Light turns off and stops following | | |

## Every sound and song (ear check)

Make a new project with the extension, open the JavaScript tab and paste this in. Press A for the next sound; the screen shows its number.

```typescript
let n = 0
input.onButtonPressed(Button.A, function () {
    basic.showNumber(n)
    if (n < 12) steamplayMusic.playSound(n, SteamplayPlayMode.InBackground)
    else steamplayMusic.playSong(n - 12, SteamplayPlayMode.InBackground)
    n = (n + 1) % 50
})
```

Mark each one: sounds right / wrong notes / too fast / too slow.

| # | Sound | OK? | Notes |
| --- | --- | --- | --- |
| 0–8 | goal, mission complete, boot-up, horn, horn 1, countdown, uh-oh, yes, alarm | | |
| 9 | siren 1 (wail: slow up and down) | | |
| 10 | siren 2 (hi-lo: two tones) | | |
| 11 | siren 3 (yelp: fast up and down) | | |
| 12 | Waltzing Matilda | | |
| 13 | William Tell gallop (the "da-da-dum" part) | | |
| 14 | Halloween: Hall of the Mountain King | | |
| 15 | Can-Can | | |
| 16 | Flight of the Bumblebee | | |
| 17 | When the Saints Go Marching In | | |
| 18 | Advance Australia Fair (check against the official PM&C sheet music) | | |
| 19 | God Save the King | | |
| 20 | The Star-Spangled Banner | | |
| 21 | La Marseillaise (check the tune) | | |
| 22 | O Canada | | |
| 23 | Toccata and Fugue | | |
| 24 | Funeral March of a Marionette (check the tune) | | |
| 25 | Jingle Bells | | |
| 26 | Deck the Halls | | |
| 27 | We Wish You a Merry Christmas | | |
| 28 | Silent Night | | |
| 29 | Hot Cross Buns | | |
| 30 | Sumer Is Icumen In (check the tune) | | |
| 31 | Halloween: Chopin's Funeral March (check the tune) | | |
| 32 | Halloween: Dies irae | | |
| 33 | Beethoven's 5th | | |
| 34 | Sea shanty: Drunken Sailor | | |
| 35 | Sea shanty: The Wellerman (check the first chorus line) | | |
| 36 | Sea shanty: Sailor's Hornpipe | | |
| 37 | Sea shanty: Blow the Man Down | | |
| 38 | Nursery: Hey Diddle Diddle (check the tune) | | |
| 39 | Nursery: Little Bo Peep (check the tune) | | |
| 40 | Nursery: Twinkle Twinkle Little Star | | |
| 41 | Nursery: Mary Had a Little Lamb | | |
| 42 | Nursery: Old MacDonald | | |
| 43 | Nursery: London Bridge | | |
| 44 | Nursery: Pop Goes the Weasel | | |
| 45 | Nursery: Itsy Bitsy Spider | | |
| 46 | Nursery: The Grand Old Duke of York (check the tune) | | |
| 47 | Nursery: London's Burning | | |
| 48 | Nursery: Hickory Dickory Dock | | |
| 49 | Nursery: Humpty Dumpty | | |

## Band (2–3 micro:bits)

On each micro:bit: "join band to play [song] as part [1/2/3] radio group [1]", and "start the band" in
"on button A pressed".

| # | Do this | Expect | OK? | Notes |
| --- | --- | --- | --- | --- |
| 42 | Frère Jacques, 3 micro:bits, press A on part 1 | All start together; round enters every 2 bars | | |
| 43 | Same, press A on part 3 | All start together | | |
| 44 | Pachelbel's Canon, full length | Still in time at the end | | |
| 45 | Turn part 1 off halfway | Others keep playing | | |
| 46 | Each song: Row Row, Sumer, Canon, Jingle Bells, Three Blind Mice, London's Burning | Sounds right together | | |

## Sync checkpoints (2–3 micro:bits)

On each micro:bit: "join sync group [1] with [3] micro:bits" in on start, and in "on button A pressed":
"sync checkpoint [1]" then "show icon ✓".

| # | Do this | Expect | OK? | Notes |
| --- | --- | --- | --- | --- |
| 47 | Press A on one micro:bit | Nothing yet (waiting) | | |
| 48 | Press A on the other two, a few seconds apart | All three show ✓ together when the last one is pressed | | |
| 49 | Press A on only two of them | Those two show ✓ after 5 s | | |
| 50 | Use with a band on the same radio group | Both work | | |

## Servo board (new project, extension only, board on its own 4×AA pack)

| # | Do this | Expect | OK? | Notes |
| --- | --- | --- | --- | --- |
| 51 | "set servo 1 to 45" in on start | All plugged-in servos jump to 90 first, then servo 1 to 45 | | |
| 52 | Micro motor on channel 2, "set micro motor 2 speed 0" | Stops (if it creeps, try "calibrate stop point") | | |
| 53 | "move servo 1 to 150 over 2 s" | Smooth move, about 2 s | | |
| 54 | "wiggle servo 1 by 20 3 times, each 0.5 s" | Three wiggles, back to start | | |
| 55 | "limit servo 1 to 20–160", then set it to 0 | Stops at 20 | | |
| 56 | "mirror servo 2 to servo 1", move servo 1 | Servo 2 moves the opposite way; servo 2's own blocks do nothing | | |
| 56b | "mirror motor 2 to motor 1", set motor 1 speed 50 | Motor 2 runs at -50 | | |
| 57 | Move 6 servos at once with "don't wait" | Smooth? (and 16 at once?) | | |
| 57b | Car with micro motors on S1/S2: "micro drive setup: left wheel S1 … right wheel S2 …", then micro drive forward / left radius 0 / 50 / 100, and ramp micro drive | Forward, spin, pivot, wide curve, smooth speed-up | | |
| 57c | Look at the long blocks (ramp micro motor, move servo, wiggle, ramps on the motors tab) | Each block stays on one line, "s" at the end of the line | | |
| 58 | Emergency stop while servos move | All servos go floppy, micro motors stop | | |

## Motor board

| # | Do this | Expect | OK? | Notes |
| --- | --- | --- | --- | --- |
| 59 | "set motor 1 speed 50", then -50 | Spins one way, then the other | | |
| 60 | Same for motor 2 | Both directions work (V2) | | |
| 61 | Play music while motor 2 runs | Motor 2 doesn't twitch | | |
| 62 | "ramp motor 1 to 80 over 2 s" | Smooth speed-up | | |
| 63 | Car: "drive setup: left wheel motor 1 … right wheel motor 2 …", then drive forward / left radius 0 / 50 / 100 | Forward, spin, pivot, wide curve | | |
| 64 | "stop all motors and servos" | Everything stops, program keeps running | | |
