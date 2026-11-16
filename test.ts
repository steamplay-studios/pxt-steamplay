// STEAMPlay Inputs - bench test project.
// Shows a letter for each gesture so you can see exactly what was detected.
//   S = single press   D = double press   L = long press   T = pressed together
// The top row shows which input: left = A, middle = A+B, right = B, centre dot = logo.
// A 3 s hold shows nothing (cancelled). Holding the logo 3 s is the emergency stop.
// Touch P1 to GND: the bottom row counts contacts, and serial shows the contact time.

let contacts = 0

function show(letter: string, x: number) {
    basic.clearScreen()
    basic.showString(letter, 0)
    led.plot(x, 0)
}

steamplayInputs.emergencyStop(SteamplayStopInput.Logo)

steamplayInputs.onSinglePressed(SteamplayInput.A, function () { show("S", 0) })
steamplayInputs.onDoublePressed(SteamplayInput.A, function () { show("D", 0) })
steamplayInputs.onLongPressed(SteamplayInput.A, function () { show("L", 0) })

steamplayInputs.onSinglePressed(SteamplayInput.B, function () { show("S", 4) })
steamplayInputs.onDoublePressed(SteamplayInput.B, function () { show("D", 4) })
steamplayInputs.onLongPressed(SteamplayInput.B, function () { show("L", 4) })

steamplayInputs.onSinglePressed(SteamplayInput.AB, function () { show("S", 2) })
steamplayInputs.onDoublePressed(SteamplayInput.AB, function () { show("D", 2) })
steamplayInputs.onLongPressed(SteamplayInput.AB, function () { show("L", 2) })

steamplayInputs.onSinglePressed(SteamplayInput.Logo, function () { show("S", 2); led.plot(2, 2) })
steamplayInputs.onDoublePressed(SteamplayInput.Logo, function () { show("D", 2); led.plot(2, 2) })

steamplayInputs.onPressedTogether(SteamplayCombo.ALogo, function () { show("T", 0) })
steamplayInputs.onPressedTogether(SteamplayCombo.BLogo, function () { show("T", 4) })

steamplayInputs.onPinContact(SteamplayPin.P1, 1, function () {
    contacts += 1
    led.plot((contacts - 1) % 5, 4)
    serial.writeValue("contact ms", steamplayInputs.contactTime(SteamplayPin.P1))
})

basic.showIcon(IconNames.Happy)
