/**
 * STEAMPlay Inputs: smarter buttons, logo, pressed-together blocks,
 * emergency stop and fast pin contacts.
 * Copyright (c) 2026 STEAMPlay Studios. MIT licence.
 */

/** A button, both buttons, or the micro:bit logo. */
enum SteamplayInput {
    //% block="A"
    A = 0,
    //% block="B"
    B = 1,
    //% block="A+B"
    AB = 2,
    //% block="logo"
    Logo = 3
}

/** A button pressed together with the logo. */
enum SteamplayCombo {
    //% block="A+logo"
    ALogo = 4,
    //% block="B+logo"
    BLogo = 5
}

/** Inputs that can be used as the emergency stop. */
enum SteamplayStopInput {
    //% block="logo"
    Logo = 3,
    //% block="A"
    A = 0,
    //% block="B"
    B = 1,
    //% block="A+B"
    AB = 2,
    //% block="A+logo"
    ALogo = 4,
    //% block="B+logo"
    BLogo = 5
}

/** The six general-purpose pins. */
enum SteamplayPin {
    //% block="P0"
    P0 = 100,
    //% block="P1"
    P1 = 101,
    //% block="P2"
    P2 = 102,
    //% block="P8"
    P8 = 108,
    //% block="P12"
    P12 = 112,
    //% block="P16"
    P16 = 116
}

/**
 * Smarter buttons, fast pin contacts and an emergency stop.
 */
//% color="#CB6926" weight=109 icon="" block="STEAMPlay Inputs"
//% groups=['Buttons', 'Pressed together', 'Contacts', 'Safety']
namespace steamplayInputs {
    // ---------------------------------------------------------------
    // Timing rules (milliseconds)
    // ---------------------------------------------------------------
    const TICK_MS = 20             // check inputs 50 times a second
    const DOUBLE_WINDOW_MS = 400   // second tap must start within this time of the first release
    const LONG_MS = 1000           // a press this long or longer is a long press
    const CANCEL_MS = 3000         // a press this long or longer is cancelled
    const STOP_HOLD_MS = 3000      // emergency stop hold time

    // Gesture kinds (used in event values)
    const KIND_SINGLE = 1
    const KIND_DOUBLE = 2
    const KIND_LONG = 3
    const KIND_TOGETHER = 4

    // Input ids (match the enum values above)
    const IN_NONE = -1
    const IN_A = 0
    const IN_B = 1
    const IN_AB = 2
    const IN_LOGO = 3
    const IN_ALOGO = 4
    const IN_BLOGO = 5

    // Gesture states
    const ST_IDLE = 0
    const ST_DOWN1 = 1      // first press is down
    const ST_WAIT = 2       // first short press released, waiting for a possible second
    const ST_DOWN2 = 3      // second press is down
    const ST_CANCELLED = 4  // held too long; ignore until released

    let started = false
    let needLogo = false      // poll the logo at all
    let logoCombos = false    // A+logo / B+logo blocks are used
    let hasDouble: boolean[] = [false, false, false, false]

    function eventValue(kind: number, inp: number): number {
        return kind * 10 + inp + 1   // never 0 (0 means "any event")
    }

    function isCombo(inp: number): boolean {
        return inp == IN_ALOGO || inp == IN_BLOGO
    }

    function fire(kind: number, inp: number) {
        control.raiseEvent(steamplayCore.EVENT_SRC_INPUTS, eventValue(kind, inp), EventCreationMode.CreateAndFire)
    }

    /**
     * One gesture tracker. Buttons use one tracker. The logo uses its own
     * tracker unless A+logo / B+logo blocks are used, then it joins the buttons.
     */
    class Tracker {
        state: number
        inp: number        // input of the press that is down now
        first: number      // input of a first tap waiting for a possible double
        downAt: number
        releasedAt: number

        constructor() {
            this.state = ST_IDLE
            this.inp = IN_NONE
            this.first = IN_NONE
            this.downAt = 0
            this.releasedAt = 0
        }

        /** A chord (A+B, A+logo, B+logo) wins over a single input seen in the same press. */
        merge(prev: number, cur: number): number {
            if (cur == IN_NONE) return prev
            if (prev == IN_NONE) return cur
            const curChord = cur == IN_AB || isCombo(cur)
            const prevChord = prev == IN_AB || isCombo(prev)
            if (curChord && !prevChord) return cur
            return prev
        }

        /** Decide what a finished press (not part of a double) means. */
        finishPress(inp: number, held: number, now: number) {
            if (isCombo(inp)) {
                fire(KIND_TOGETHER, inp)
                this.state = ST_IDLE
            } else if (held >= LONG_MS) {
                fire(KIND_LONG, inp)
                this.state = ST_IDLE
            } else if (hasDouble[inp]) {
                this.first = inp
                this.releasedAt = now
                this.state = ST_WAIT
            } else {
                // No double press block for this input: no need to wait.
                fire(KIND_SINGLE, inp)
                this.state = ST_IDLE
            }
        }

        tick(cur: number, now: number) {
            if (this.state == ST_IDLE) {
                if (cur != IN_NONE) {
                    this.inp = cur
                    this.downAt = now
                    this.state = ST_DOWN1
                }
            } else if (this.state == ST_DOWN1) {
                if (cur != IN_NONE) {
                    this.inp = this.merge(this.inp, cur)
                    if (now - this.downAt >= CANCEL_MS) this.state = ST_CANCELLED
                } else {
                    this.finishPress(this.inp, now - this.downAt, now)
                }
            } else if (this.state == ST_WAIT) {
                if (cur != IN_NONE) {
                    this.inp = cur
                    this.downAt = now
                    this.state = ST_DOWN2
                } else if (now - this.releasedAt > DOUBLE_WINDOW_MS) {
                    fire(KIND_SINGLE, this.first)
                    this.state = ST_IDLE
                }
            } else if (this.state == ST_DOWN2) {
                if (cur != IN_NONE) {
                    this.inp = this.merge(this.inp, cur)
                    // Cancel throws away the waiting first tap as well.
                    if (now - this.downAt >= CANCEL_MS) this.state = ST_CANCELLED
                } else {
                    const held = now - this.downAt
                    if (this.inp == this.first && held < LONG_MS) {
                        fire(KIND_DOUBLE, this.first)
                        this.state = ST_IDLE
                    } else {
                        // Different input, or the second press became long:
                        // the first tap counts as a single press on its own.
                        fire(KIND_SINGLE, this.first)
                        this.finishPress(this.inp, held, now)
                    }
                }
            } else if (this.state == ST_CANCELLED) {
                if (cur == IN_NONE) this.state = ST_IDLE
            }
        }
    }

    let buttonTracker: Tracker = null
    let logoTracker: Tracker = null

    // Emergency stop state
    let stopInput = IN_NONE
    let stopHeldSince = -1
    let stopTriggered = false

    function rawHeld(inp: number, a: boolean, b: boolean, l: boolean): boolean {
        if (inp == IN_A) return a
        if (inp == IN_B) return b
        if (inp == IN_AB) return a && b
        if (inp == IN_LOGO) return l
        if (inp == IN_ALOGO) return a && l
        if (inp == IN_BLOGO) return b && l
        return false
    }

    function checkEmergencyStop(a: boolean, b: boolean, l: boolean, now: number) {
        if (stopInput == IN_NONE) return
        const held = rawHeld(stopInput, a, b, l)
        if (!stopTriggered) {
            if (held) {
                if (stopHeldSince < 0) stopHeldSince = now
                else if (now - stopHeldSince >= STOP_HOLD_MS) {
                    stopTriggered = true
                    steamplayCore.stopEverything()
                    led.stopAnimation()
                    basic.showIcon(IconNames.No, 0)
                }
            } else {
                stopHeldSince = -1
            }
        } else {
            // Keep everything stopped while the input is still held,
            // then restart once it is released (this avoids Bluetooth pairing mode for A+B).
            steamplayCore.stopEverything()
            if (!held) control.reset()
        }
    }

    function poll() {
        const now = control.millis()
        const a = input.buttonIsPressed(Button.A)
        const b = input.buttonIsPressed(Button.B)
        // The logo only exists on V2, and reading it on V1 would show error 927.
        const l = needLogo && steamplayCore.isV2() ? input.logoIsPressed() : false

        checkEmergencyStop(a, b, l, now)

        let cur = IN_NONE
        if (a && b) cur = IN_AB
        else if (logoCombos && a && l) cur = IN_ALOGO
        else if (logoCombos && b && l) cur = IN_BLOGO
        else if (a) cur = IN_A
        else if (b) cur = IN_B
        else if (logoCombos && l) cur = IN_LOGO
        buttonTracker.tick(cur, now)

        if (!logoCombos) logoTracker.tick(l ? IN_LOGO : IN_NONE, now)
    }

    function start() {
        if (started) return
        started = true
        buttonTracker = new Tracker()
        logoTracker = new Tracker()
        control.inBackground(function () {
            while (true) {
                poll()
                basic.pause(TICK_MS)
            }
        })
    }

    function register(kind: number, inp: number, handler: () => void) {
        if (inp == IN_LOGO || isCombo(inp)) needLogo = true
        if (isCombo(inp)) logoCombos = true
        control.onEvent(steamplayCore.EVENT_SRC_INPUTS, eventValue(kind, inp), handler)
        start()
    }

    // ---------------------------------------------------------------
    // Buttons
    // ---------------------------------------------------------------

    /**
     * Run code when a button or the logo is tapped once.
     * If you also use a double press block for the same input, it waits 0.4 s
     * to make sure a second tap isn't coming. Otherwise it runs straight away.
     * @param input the button or logo to watch, eg: SteamplayInput.A
     */
    //% blockId=steamplay_on_single_pressed
    //% block="on $input single pressed"
    //% input.fieldEditor="gridpicker" input.fieldOptions.columns=4
    //% group="Buttons" weight=100 blockGap=8
    export function onSinglePressed(input: SteamplayInput, handler: () => void) {
        register(KIND_SINGLE, input, handler)
    }

    /**
     * Run code when a button or the logo is tapped twice quickly.
     * The second tap must start within 0.4 s of letting go of the first.
     * It runs when you let go of the second tap.
     * @param input the button or logo to watch, eg: SteamplayInput.A
     */
    //% blockId=steamplay_on_double_pressed
    //% block="on $input double pressed"
    //% input.fieldEditor="gridpicker" input.fieldOptions.columns=4
    //% group="Buttons" weight=90 blockGap=8
    export function onDoublePressed(input: SteamplayInput, handler: () => void) {
        hasDouble[input] = true
        register(KIND_DOUBLE, input, handler)
    }

    /**
     * Run code when a button or the logo is held for 1 to 3 seconds, then let go.
     * Holding for 3 seconds or more cancels the press, so nothing runs.
     * @param input the button or logo to watch, eg: SteamplayInput.A
     */
    //% blockId=steamplay_on_long_pressed
    //% block="on $input long pressed"
    //% input.fieldEditor="gridpicker" input.fieldOptions.columns=4
    //% group="Buttons" weight=80
    export function onLongPressed(input: SteamplayInput, handler: () => void) {
        register(KIND_LONG, input, handler)
    }

    // ---------------------------------------------------------------
    // Pressed together
    // ---------------------------------------------------------------

    /**
     * Run code when a button and the gold logo are pressed together, then let go.
     * Needs a micro:bit V2 (the one with the gold logo).
     * @param combo the button and logo pair, eg: SteamplayCombo.ALogo
     */
    //% blockId=steamplay_on_pressed_together
    //% block="on $combo pressed together"
    //% group="Pressed together" weight=70
    export function onPressedTogether(combo: SteamplayCombo, handler: () => void) {
        register(KIND_TOGETHER, combo, handler)
    }

    // ---------------------------------------------------------------
    // Safety
    // ---------------------------------------------------------------

    /**
     * Holding the chosen input for 3 seconds stops all STEAMPlay motors and
     * servos, shows a cross, and restarts your program when you let go.
     * Put this in "on start". Tip: the logo is hard to press by accident.
     * @param holdThis the input to hold, eg: SteamplayStopInput.Logo
     */
    //% blockId=steamplay_emergency_stop
    //% block="emergency stop when $holdThis held for 3 s"
    //% group="Safety" weight=60
    export function emergencyStop(holdThis: SteamplayStopInput) {
        if (holdThis == IN_LOGO || isCombo(holdThis)) needLogo = true
        stopInput = holdThis
        stopHeldSince = -1
        start()
    }

    // ---------------------------------------------------------------
    // Contacts (fast pin touches)
    // ---------------------------------------------------------------
    // Per-pin state, stored by pin slot 0..5
    let contactPins: number[] = []
    let lockoutUs: number[] = []
    let acceptedAt: number[] = []   // µs timestamp of the last contact that counted
    let contactUs: number[] = []    // µs length of the last contact

    function slotFor(pin: number): number {
        for (let i = 0; i < contactPins.length; i++) {
            if (contactPins[i] == pin) return i
        }
        contactPins.push(pin)
        lockoutUs.push(1000000)
        acceptedAt.push(-1)
        contactUs.push(0)
        return contactPins.length - 1
    }

    /**
     * Run code the instant a pin touches GND (ground), even for a very short touch.
     * Great for swinging contacts, goals and switches. After a contact counts,
     * more touches are ignored for the lockout time, so bounces only count once.
     * A pin used here can't also use the built-in "on pin pressed" block.
     * @param pin the pin wired to the contact, eg: SteamplayPin.P1
     * @param lockout seconds to ignore repeat touches, eg: 1
     */
    //% blockId=steamplay_on_pin_contact
    //% block="on pin $pin contact, ignore repeats for $lockout s"
    //% lockout.min=0 lockout.max=10 lockout.defl=1
    //% group="Contacts" weight=50 blockGap=8
    export function onPinContact(pin: SteamplayPin, lockout: number, handler: () => void) {
        const slot = slotFor(pin)
        lockoutUs[slot] = Math.max(0, lockout) * 1000000
        steamplayCore.claimPin(pin, "contact")
        pins.setPull(pin, PinPullMode.PullUp)
        pins.setEvents(pin, PinEventType.Edge)

        // Contact made (pin pulled to ground).
        control.onEvent(pin, DAL.MICROBIT_PIN_EVT_FALL, function () {
            const ts = control.eventTimestamp()
            const last = acceptedAt[slot]
            if (last >= 0 && ts - last >= 0 && ts - last < lockoutUs[slot]) return
            acceptedAt[slot] = ts
            contactUs[slot] = 0
            control.raiseEvent(steamplayCore.EVENT_SRC_CONTACTS, pin, EventCreationMode.CreateAndFire)
        })
        // Contact broken. Keep the latest release inside the lockout window,
        // so a bouncy contact reports roughly its whole length.
        control.onEvent(pin, DAL.MICROBIT_PIN_EVT_RISE, function () {
            const ts = control.eventTimestamp()
            const d = ts - acceptedAt[slot]
            if (acceptedAt[slot] >= 0 && d >= 0 && d < lockoutUs[slot]) contactUs[slot] = d
        })

        control.onEvent(steamplayCore.EVENT_SRC_CONTACTS, pin, handler)
    }

    /**
     * How long the last contact on this pin lasted, in milliseconds.
     * Bouncy contacts give an approximate time.
     * @param pin the pin wired to the contact, eg: SteamplayPin.P1
     */
    //% blockId=steamplay_contact_time
    //% block="contact time on pin $pin (ms)"
    //% group="Contacts" weight=40
    export function contactTime(pin: SteamplayPin): number {
        for (let i = 0; i < contactPins.length; i++) {
            if (contactPins[i] == pin) return contactUs[i] / 1000
        }
        return 0
    }
}
