# STEAMPlay Inputs - bench test sheet (v0.1.0)

Load the extension's test project (`test.ts`) onto a micro:bit V2.
The screen shows **S** (single), **D** (double), **L** (long) or **T** (together).
The top-row dot shows the input: left = A, middle = A+B, right = B, centre dot added = logo.
Contacts: wire P1 to GND through a switch or swinging contact; the bottom row counts contacts.

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
