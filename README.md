# pxt-steamplay

Blocks from **STEAMPlay Studios** for the BBC micro:bit, made for kids who build with cardboard and code.
This first version adds **STEAMPlay Inputs**: smarter buttons, buttons pressed together with the logo,
an emergency stop and fast pin contacts. Servos, motors, music and light shows are coming next.

Works best on **micro:bit V2**. Button blocks also work on V1. Logo blocks need V2 (the gold logo).

## Add it to MakeCode

1. Open [makecode.microbit.org](https://makecode.microbit.org) and start a project.
2. Click **Extensions** (at the bottom of the block list).
3. Paste `https://github.com/steamplay-studios/pxt-steamplay` and pick the STEAMPlay card.

## Buttons

Watch **A**, **B**, **A+B** or the **logo**.

| Block | What you do | When it runs |
| --- | --- | --- |
| single pressed | Tap (under 1 s) | 0.4 s after you let go if you also use double press for that input, otherwise straight away |
| double pressed | Two quick taps | When you let go of the second tap |
| long pressed | Hold 1 to 3 s, then let go | When you let go |
| (cancel) | Hold 3 s or more | Nothing runs |

```blocks
steamplayInputs.onSinglePressed(SteamplayInput.A, function () {
    basic.showNumber(1)
})
steamplayInputs.onDoublePressed(SteamplayInput.A, function () {
    basic.showNumber(2)
})
steamplayInputs.onLongPressed(SteamplayInput.A, function () {
    basic.showIcon(IconNames.Heart)
})
```

These blocks check the buttons in the background, so they never switch off MakeCode's own button blocks.
If you use double press, use the STEAMPlay single press block for that input too, because MakeCode's own
"on button pressed" runs on every tap.

## Pressed together

Run code when a button and the gold logo are pressed together (micro:bit V2).

```blocks
steamplayInputs.onPressedTogether(SteamplayCombo.ALogo, function () {
    basic.showIcon(IconNames.Yes)
})
```

## Emergency stop

Put this in **on start**. Holding the chosen input for 3 seconds stops all STEAMPlay motors and servos,
shows a cross, and restarts the program when you let go. The logo is a good choice because it is hard to
press by accident.

```blocks
steamplayInputs.emergencyStop(SteamplayStopInput.Logo)
```

It works on the same micro:bit only. A loop that never pauses can stop it from running; normal
"forever" loops are fine.

## Contacts

Run code the instant a pin touches GND, even for a very short touch, such as a swinging contact or a goal sensor.
After a contact counts, repeats are ignored for the lockout time so bounces count once.

```blocks
let goals = 0
steamplayInputs.onPinContact(SteamplayPin.P1, 1, function () {
    goals += 1
    basic.showNumber(goals)
})
```

`contact time on pin (ms)` reports how long the last contact lasted.

Pins: P0, P1, P2, P8, P12 and P16. A pin used here can't also use MakeCode's "on pin pressed" block.
Using P0 turns off sound on P0 (the V2 speaker still plays).

## Licence

MIT. Copyright (c) 2026 STEAMPlay Studios.

## Supported targets

* for PXT/microbit
