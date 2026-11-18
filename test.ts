// STEAMplay Inputs - bench test project.
// Shows a letter for each gesture so you can see exactly what was detected.
//   S = single press   D = double press   L = long press   (A+logo / B+logo show S or L)
// The top row shows which input: left = A, middle = A+B, right = B, centre dot = logo.
// A 3 s hold shows nothing (cancelled). Holding the logo 3 s is the emergency stop.
// Touch P1 to GND: the bottom row counts contacts, and serial shows the contact time.
// Music: boot-up sound at start, goal sound on each contact,
// and an LED on P8 (with a resistor to GND) flashes to the beat.

let contacts = 0

function show(letter: string, x: number) {
    basic.clearScreen()
    basic.showString(letter, 0)
    led.plot(x, 0)
}

steamplayInputs.emergencyStop(SteamplayStopInput.Logo)
// Second stop: a button wired between P2 and GND stops straight away.
steamplayInputs.emergencyStopPin(SteamplayPin.P2, 0)

steamplayInputs.onSinglePressed(SteamplayInput.A, function () { show("S", 0) })
steamplayInputs.onDoublePressed(SteamplayDoubleInput.A, function () { show("D", 0) })
steamplayInputs.onLongPressed(SteamplayInput.A, function () { show("L", 0) })

steamplayInputs.onSinglePressed(SteamplayInput.B, function () { show("S", 4) })
steamplayInputs.onDoublePressed(SteamplayDoubleInput.B, function () { show("D", 4) })
steamplayInputs.onLongPressed(SteamplayInput.B, function () { show("L", 4) })

steamplayInputs.onSinglePressed(SteamplayInput.AB, function () { show("S", 2) })
steamplayInputs.onDoublePressed(SteamplayDoubleInput.AB, function () { show("D", 2) })
steamplayInputs.onLongPressed(SteamplayInput.AB, function () { show("L", 2) })

steamplayInputs.onLongPressed(SteamplayInput.Logo, function () { show("L", 2); led.plot(2, 2) })

steamplayInputs.onSinglePressed(SteamplayInput.ALogo, function () { show("S", 0); led.plot(2, 2) })
steamplayInputs.onSinglePressed(SteamplayInput.BLogo, function () { show("S", 4); led.plot(2, 2) })
steamplayInputs.onLongPressed(SteamplayInput.ALogo, function () { show("L", 0); led.plot(2, 2) })

steamplayInputs.onPinContact(SteamplayPin.P1, 1, function () {
    contacts += 1
    led.plot((contacts - 1) % 5, 4)
    serial.writeValue("contact ms", steamplayInputs.contactTime(SteamplayPin.P1))
    steamplayMusic.playSound(SteamplaySound.Goal, SteamplayPlayMode.InBackground)
})

basic.showIcon(IconNames.Happy)
steamplayMusic.syncPin(SteamplayPin.P8, SteamplayMusicPick.AnySong, SteamplaySyncMode.Beat)
steamplayMusic.playSound(SteamplaySound.BootUp, SteamplayPlayMode.InBackground)

// Temperature: warm the micro:bit with your hand (or use the simulator slider).
steamplayInputs.onTemperatureChange(SteamplayTempChange.Rises, 2, function () { basic.showArrow(ArrowNames.North) })
steamplayInputs.onTemperatureChange(SteamplayTempChange.Falls, 2, function () { basic.showArrow(ArrowNames.South) })

// Sequence: tap logo, A, B, B quickly for a secret code. The logo is the code key,
// so A and B don't show S or D while you type it. (Logo single press is tested in
// TESTING.md with its own project, because the code uses the logo.)
steamplayInputs.onSequence(SteamplayFirstTap.Logo, SteamplayTap.A, SteamplayTap.B, SteamplayLastTap.B, function () { basic.showIcon(IconNames.Diamond) })
