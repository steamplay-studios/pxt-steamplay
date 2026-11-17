# pxt-steamplay

Blocks from **STEAMPlay Studios** for the BBC micro:bit, made for kids who build with cardboard and code.
This first version adds **STEAMPlay Inputs**: smarter buttons, buttons pressed together with the logo,
an emergency stop and fast pin contacts and temperature change. Servos, motors, music and light shows are coming next.

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

## Sequences (secret codes)

Run code when 3 or 4 quick taps are entered in order, like an arcade cheat code. Pick each tap from
A, B, logo (V2) and pins P0, P1, P2, P8, P12 and P16; choose "–" in the last slot for a 3-tap code. A pin counts when it is
connected to GND, such as by an arcade button or switch. Taps must be less than 1.5 s apart; a long press
starts over. Each tap still runs your other button blocks too.

```blocks
steamplayInputs.onSequence(SteamplayTap.A, SteamplayTap.B, SteamplayTap.B, SteamplayLastTap.P2, function () {
    basic.showIcon(IconNames.Diamond)
})
```

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

You can add a second stop on a pin, such as a big red button, pull-cord or crash wire between the pin and GND.
Choose how long it must stay connected; 0 stops straight away (a spark under about 20 ms is ignored).
Give that pin its own job, because any contact on it will stop the build.

```blocks
steamplayInputs.emergencyStopPin(SteamplayPin.P2, 0)
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

## Temperature change

Run code when the temperature rises, falls or changes by a number of degrees. After it runs it measures
again from the new temperature, so it can keep running as things warm up or cool down.

```blocks
steamplayInputs.onTemperatureChange(SteamplayTempChange.Rises, 2, function () {
    basic.showArrow(ArrowNames.North)
})
```

The micro:bit measures the temperature of its own chip, so it reads close to room temperature but a little
warm when it has been busy.

## Music

Sound effects and short songs (5–10 s). All tunes are original or our own simple versions of
out-of-copyright melodies. One sound plays at a time: a new one replaces the one playing.
"in background" keeps your code going; "until done" waits for the sound to finish.

```blocks
steamplayMusic.playSound(SteamplaySound.Goal, SteamplayPlayMode.InBackground)
steamplayMusic.playSong(SteamplaySong.WaltzingMatilda, SteamplayPlayMode.UntilDone)
```

Sounds: goal, mission complete, boot-up, horn, horn 1, horn 2, countdown, uh-oh, yes, alarm.
Songs include classics, anthems, and Halloween, Christmas, Easter and solstice tunes.

## Band

Two or three micro:bits play one song together, each playing its own part. Use the same song and radio
group on every micro:bit, with a different part number. Part 1 keeps time for the whole band.

```blocks
steamplayMusic.joinBand(SteamplayBandSong.FrereJacques, 1, 1)
input.onButtonPressed(Button.A, function () {
    steamplayMusic.startBand()
})
```

The band uses the radio, so a band project can't also use its own radio blocks.

## Light sync

Lights on pins follow STEAMPlay music: on the beat, on every note, high or low notes, music energy
(bright at big moments) or the microphone (V2). Wire an LED with a resistor from the pin to GND, or switch a
bigger light through a transistor with its own power (share GND).

```blocks
steamplayMusic.syncPin(SteamplayPin.P1, SteamplaySyncMode.Beat)
steamplayMusic.syncPin(SteamplayPin.P2, SteamplaySyncMode.HighNotes)
```

For your own light show, "on music note" gives each note's pitch and the beat number.

## Licence

MIT. Copyright (c) 2026 STEAMPlay Studios.

## Supported targets

* for PXT/microbit
