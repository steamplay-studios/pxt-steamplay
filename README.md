# pxt-steamplay

Blocks from **STEAMplay Studios** for the BBC micro:bit, made for kids who build with cardboard and code.
Four tabs: **STEAMplay Inputs** (smarter buttons, secret codes, emergency stops, fast pin contacts,
temperature change, sync checkpoints), **STEAMplay Music** (sounds, songs, band, light sync),
**STEAMplay Servos** and **STEAMplay Motors** (Kitronik 16-servo board and motor driver board).

Works best on **micro:bit V2**. Button blocks also work on V1. Logo blocks need V2 (the gold logo).

## Add it to MakeCode

1. Open [makecode.microbit.org](https://makecode.microbit.org) and start a project.
2. Click **Extensions** (at the bottom of the block list).
3. Paste `https://github.com/steamplay-studios/pxt-steamplay` and pick the STEAMplay card.

## Buttons

Watch **A**, **B**, **A+B** or the **logo**.

| Block | What you do | When it runs |
| --- | --- | --- |
| single pressed | Tap (under 1 s) | 0.4 s after you let go if you also use double press for that input, otherwise straight away |
| double pressed | Two quick taps (A, B or A+B) | When you let go of the second tap |
| long pressed | Hold 1 to 3 s, then let go | When you let go |
| (cancel) | Hold 3 s or more | Nothing runs |

```blocks
steamplayInputs.onSinglePressed(SteamplayInput.A, function () {
    basic.showNumber(1)
})
steamplayInputs.onDoublePressed(SteamplayDoubleInput.A, function () {
    basic.showNumber(2)
})
steamplayInputs.onLongPressed(SteamplayInput.A, function () {
    basic.showIcon(IconNames.Heart)
})
```

These blocks check the buttons in the background, so they never switch off MakeCode's own button blocks.
If you use double press, use the STEAMplay single press block for that input too, because MakeCode's own
"on button pressed" runs on every tap.

## Sequences (secret codes)

Run code when 3 or 4 quick taps are entered in order, like an arcade cheat code.

* The **first tap is the code key**: the logo (V2) or a pin (P0, P1, P2, P8, P12, P16). It tells the
  micro:bit a code is coming, so the taps after it don't run their own blocks.
* The other taps can be A, B, the logo or a pin. Choose "–" in the last slot for a 3-tap code.
* Taps must be less than 1.5 s apart. A wrong tap or a long press ends the code.
* If a code starts with the logo, a logo tap starts the code, so "on logo single pressed" won't run in
  that project.
* If a pin is in a code, don't also use it in an "on pin contact" block, or the contact block will run on
  every press while you type the code.
* A pin counts when it is connected to GND, such as by an arcade button or switch.

```blocks
steamplayInputs.onSequence(SteamplayFirstTap.Logo, SteamplayTap.A, SteamplayTap.B, SteamplayLastTap.B, function () {
    basic.showIcon(IconNames.Diamond)
})
```

## Button with the logo

Choose **A+logo** or **B+logo** in the single press or long press block to run code when a button
and the gold logo are pressed together (micro:bit V2). There's no double press for these.

```blocks
steamplayInputs.onSinglePressed(SteamplayInput.ALogo, function () {
    basic.showIcon(IconNames.Yes)
})
```

## Sync checkpoints

Several micro:bits wait for each other at a checkpoint, then all carry on together, eg cars in a dance
or lights across several builds. Put **join sync group** in on start on every micro:bit (same group and
number of micro:bits), then put **sync checkpoint** blocks at the safe points in your routine.

```blocks
steamplayInputs.joinSync(1, 3)
input.onButtonPressed(Button.A, function () {
    steamplayInputs.syncCheckpoint(1)
    basic.showIcon(IconNames.Yes)
})
```

Everyone leaves a checkpoint within a few thousandths of a second. If a micro:bit never arrives (switched off
or out of range), the others carry on after 5 s. Sync uses the radio, so don't add your own radio blocks;
a band can share the same radio group.

## Emergency stop

Put this in **on start**. Holding the chosen input for 3 seconds stops all STEAMplay motors and servos,
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

Sounds: goal, mission complete, boot-up, horn, horn 1, countdown, uh-oh, yes, alarm, siren 1 (wail), siren 2 (hi-lo), siren 3 (yelp).
Songs include classics, anthems, sea shanties, nursery rhymes, and Halloween, Christmas, Easter and solstice tunes.

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

Lights on pins follow STEAMplay music: on the beat, on every note, high or low notes, music energy
(bright at big moments) or the microphone (V2). Wire an LED with a resistor from the pin to GND, or switch a
bigger light through a transistor with its own power (share GND).

```blocks
steamplayMusic.syncPin(SteamplayPin.P1, SteamplayMusicPick.AnySong, SteamplaySyncMode.Beat)
steamplayMusic.syncPin(SteamplayPin.P2, SteamplayMusicPick.SongCanCan, SteamplaySyncMode.HighNotes)
```

Each light follows the music you choose: any song, any sound, any music, or one song or sound by name.
"unsync pin" turns a light off and stops it following.

For your own light show or a servo dance, "on music [song] note beat" gives each note's pitch (**note**, how
high it sounds) and the **beat** (the steady count 1, 2, 3 … you'd clap along to). Pick any song, any sound or
one by name. **Sync servo** (Servos tab) and **sync motor** (Motors tab) put the servo or motor back to how it
was before the music once the music ends:

```blocks
steamplayServos.syncServo(SteamplayServo.S1, SteamplayMusicPick.SongCanCan)
steamplayMusic.playSong(SteamplaySong.CanCan, SteamplayPlayMode.InBackground)
steamplayMusic.onMusicNote(SteamplayMusicPick.SongCanCan, function (note, beat) {
    if (beat % 2 == 0) {
        steamplayServos.servoWrite(SteamplayServo.S1, 120)
    } else {
        steamplayServos.servoWrite(SteamplayServo.S1, 60)
    }
})
```

## Servos (Kitronik 16-servo board)

Every servo starts at 90° (the middle) the first time a servo block runs. Give the board its own 4×AA
battery pack: servos won't move on USB power alone.

```blocks
steamplayServos.limitServo(SteamplayServo.S1, 20, 160)
steamplayServos.servoWrite(SteamplayServo.S1, 45)
steamplayServos.moveServo(SteamplayServo.S1, 150, 2)
steamplayServos.wiggleServo(SteamplayServo.S1, 20, 3, 0.5)
```

Micro motors (continuous-rotation servos) plug into the same channels:

```blocks
steamplayServos.calibrateMicroMotor(SteamplayServo.S2, 0)
steamplayServos.setMicroMotor(SteamplayServo.S2, 50)
steamplayServos.rampMicroMotorOff(SteamplayServo.S2, 1)
```

A car with two micro motors drives the same way as the motor board car (see Driving a car), using the
**micro drive** blocks in STEAMplay Servos. The setup picks the left and right wheel channels:

```blocks
steamplayServos.setupMicroDrive(SteamplayServo.S1, SteamplayTurn.Forwards, SteamplayServo.S2, SteamplayTurn.Backwards)
steamplayServos.rampMicroDrive(SteamplayDrive.Forward, 80, 50, 1)
steamplayServos.microDrive(SteamplayDrive.Left, 50, 0)
```

**Mirror** makes one servo do the opposite of another: "mirror servo 2 to servo 1" makes servo 2 follow servo 1 (30° becomes 150°, speed 50 becomes −50), **copy** makes it
do the same. Ramps, moves and wiggles wait until they finish, unless you open the block's "+" and choose
"don't wait".

## Motors (Kitronik motor driver board)

Motor 1 uses P8 and P12, Motor 2 uses P0 and P16 (sound on P0 is turned off; the V2 speaker still plays).

```blocks
steamplayMotors.setMotor(SteamplayMotor.M1, 50)
steamplayMotors.rampMotor(SteamplayMotor.M1, -80, 2)
steamplayMotors.rampMotorOff(SteamplayMotor.M1, 1)
```

## Driving a car

Tell the micro:bit which motor is the left wheel and which is the right, and which way each turns for forward, then drive. Radius 0 spins on the spot, 50 pivots on one wheel,
100 makes a wide curve.

```blocks
steamplayMotors.setupDrive(SteamplayMotor.M1, SteamplayTurn.Forwards, SteamplayMotor.M2, SteamplayTurn.Forwards)
steamplayMotors.rampDrive(SteamplayDrive.Forward, 80, 50, 1)
steamplayMotors.drive(SteamplayDrive.Left, 50, 0)
```

| Car does on "drive forward" | Fix |
| --- | --- |
| Goes backward | Flip both directions in the drive setup |
| Spins in a circle | Flip the direction of the wheel going the wrong way |
| Turns the wrong way on "left" | Swap the left and right wheel motors in the setup |

"stop all motors and servos" stops everything but keeps your program running. The emergency stop also turns
off both boards.

## Licence

MIT. Copyright (c) 2026 STEAMplay Studios.

Includes code from Kitronik's pxt-kitronik-I2C-16-servo and pxt-kitronik-motor-driver extensions,
MIT licence, Copyright (c) 2017 Kitronik Ltd.

## Supported targets

* for PXT/microbit
