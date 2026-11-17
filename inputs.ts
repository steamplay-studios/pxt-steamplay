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

/** One tap in a sequence. */
enum SteamplayTap {
    //% block="A"
    A = 1,
    //% block="B"
    B = 2,
    //% block="logo"
    Logo = 3,
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

/** The last tap in a sequence, or none for a 3-tap code. */
enum SteamplayLastTap {
    //% block="–"
    None = 0,
    //% block="A"
    A = 1,
    //% block="B"
    B = 2,
    //% block="logo"
    Logo = 3,
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

/** Which way the temperature moves. */
enum SteamplayTempChange {
    //% block="rises"
    Rises = 1,
    //% block="falls"
    Falls = 2,
    //% block="changes"
    Changes = 3
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
//% color="#CB6926" weight=109 icon="\uf011" block="STEAMPlay Inputs"
//% groups=['Buttons', 'Pressed together', 'Contacts', 'Sensors', 'Safety']
namespace steamplayInputs {
    // ---------------------------------------------------------------
    // Timing rules (milliseconds)
    // ---------------------------------------------------------------
    const TICK_MS = 20             // check inputs 50 times a second
    const DOUBLE_WINDOW_MS = 400   // second tap must start within this time of the first release
    const LONG_MS = 1000           // a press this long or longer is a long press
    const CANCEL_MS = 3000         // a press this long or longer is cancelled

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
            recordTap(inp, held, now)
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
                        recordTap(this.inp, held, now)
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

    // ---------------------------------------------------------------
    // Sequences ("cheat codes" such as ABBA). Every short tap of A, B or the
    // logo is remembered; a gap longer than SEQ_GAP_MS or a long press starts over.
    // ---------------------------------------------------------------
    const SEQ_GAP_MS = 1500
    const SEQ_MAX = 4
    let seqCodes: string[] = []
    let seqTaps = ""
    let seqLastTap = 0

    function recordTap(inp: number, held: number, now: number) {
        if (seqCodes.length == 0) return
        if (held >= LONG_MS || (inp != IN_A && inp != IN_B && inp != IN_LOGO)) {
            seqTaps = ""
            return
        }
        recordSymbol(inp == IN_A ? "A" : (inp == IN_B ? "B" : "L"), now)
    }

    /** Each tap is stored as one character: A, B, L (logo) or 0 1 2 8 C G for pins P0 P1 P2 P8 P12 P16. */
    function pinSymbol(pin: number): string {
        const n = pin - DigitalPin.P0
        if (n == 12) return "C"
        if (n == 16) return "G"
        return "" + n
    }

    function recordSymbol(sym: string, now: number) {
        if (now - seqLastTap > SEQ_GAP_MS) seqTaps = ""
        seqLastTap = now
        seqTaps += sym
        if (seqTaps.length > SEQ_MAX) seqTaps = seqTaps.substr(seqTaps.length - SEQ_MAX, SEQ_MAX)
        // If several codes end here (ABBA and BBA), only the longest one runs.
        let best = -1
        for (let i = 0; i < seqCodes.length; i++) {
            const code = seqCodes[i]
            if (code.length > 0 && seqTaps.length >= code.length &&
                seqTaps.substr(seqTaps.length - code.length, code.length) == code) {
                if (best < 0 || code.length > seqCodes[best].length) best = i
            }
        }
        if (best >= 0) {
            seqTaps = ""   // start fresh, so the same taps can't count towards another code
            control.raiseEvent(steamplayCore.EVENT_SRC_SEQUENCE, best + 1, EventCreationMode.CreateAndFire)
        }
    }

    /** One character per tap: A, B, L (logo) or a pin symbol. "" for none. */
    function tapSymbol(t: number): string {
        if (t == SteamplayTap.A) return "A"
        if (t == SteamplayTap.B) return "B"
        if (t == SteamplayTap.Logo) return "L"
        if (t >= DigitalPin.P0) return pinSymbol(t)
        return ""
    }

    /** Pins used in a code, as DigitalPin values. */
    function pinsInCode(clean: string): number[] {
        const result: number[] = []
        for (let i = 0; i < clean.length; i++) {
            const ch = clean.charAt(i)
            let n = -1
            if (ch == "0") n = 0
            else if (ch == "1") n = 1
            else if (ch == "2") n = 2
            else if (ch == "8") n = 8
            else if (ch == "C") n = 12
            else if (ch == "G") n = 16
            if (n >= 0 && result.indexOf(DigitalPin.P0 + n) < 0) result.push(DigitalPin.P0 + n)
        }
        return result
    }

    let buttonTracker: Tracker = null
    let logoTracker: Tracker = null

    // Emergency stop state: one entry per stop block (an input can only be used once).
    let stopInputs: number[] = []
    let stopHoldMs: number[] = []
    let stopHeldSince: number[] = []
    let stopTriggered = -1          // index of the stop that fired, or -1

    function rawHeld(inp: number, a: boolean, b: boolean, l: boolean): boolean {
        if (inp == IN_A) return a
        if (inp == IN_B) return b
        if (inp == IN_AB) return a && b
        if (inp == IN_LOGO) return l
        if (inp == IN_ALOGO) return a && l
        if (inp == IN_BLOGO) return b && l
        return false
    }

    function stopHeld(inp: number, a: boolean, b: boolean, l: boolean): boolean {
        if (inp >= 100) return pinDown[slotFor(inp)]   // a pin (DigitalPin id)
        return rawHeld(inp, a, b, l)
    }

    function checkEmergencyStop(a: boolean, b: boolean, l: boolean, now: number) {
        if (stopInputs.length == 0) return
        if (stopTriggered < 0) {
            for (let i = 0; i < stopInputs.length; i++) {
                if (stopHeld(stopInputs[i], a, b, l)) {
                    if (stopHeldSince[i] < 0) stopHeldSince[i] = now
                    // "0 s" still needs the input down on two checks in a row (about 20 ms),
                    // so a crackly wire or a stray spark doesn't stop the build.
                    else if (now - stopHeldSince[i] >= Math.max(stopHoldMs[i], TICK_MS)) {
                        stopTriggered = i
                        steamplayCore.stopEverything()
                        led.stopAnimation()
                        basic.showIcon(IconNames.No, 0)
                        return
                    }
                } else {
                    stopHeldSince[i] = -1
                }
            }
        } else {
            // Keep everything stopped while the input is still held,
            // then restart once it is released (this avoids Bluetooth pairing mode for A+B).
            steamplayCore.stopEverything()
            if (!stopHeld(stopInputs[stopTriggered], a, b, l)) control.reset()
        }
    }

    function poll() {
        const now = control.millis()
        const a = input.buttonIsPressed(Button.A)
        const b = input.buttonIsPressed(Button.B)
        // The logo only exists on V2, and reading it on V1 would show error 927.
        const l = needLogo && steamplayCore.isV2() ? input.logoIsPressed() : false

        checkEmergencyStop(a, b, l, now)
        checkTemperature(now)

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
     * Use this instead of MakeCode's "on button pressed" when you also use double press:
     * MakeCode's block runs on every tap, so a double tap would run it twice.
     * With a double press block for the same input, it waits 0.4 s to make sure
     * a second tap isn't coming. Otherwise it runs straight away.
     * @param input the button or logo to watch, eg: SteamplayInput.A
     */
    //% blockId=steamplay_on_single_pressed
    //% block="on $input single pressed"
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
    //% group="Buttons" weight=80
    export function onLongPressed(input: SteamplayInput, handler: () => void) {
        register(KIND_LONG, input, handler)
    }

    /**
     * Run code when a secret sequence of quick taps is entered, like an arcade cheat code.
     * Pick 3 or 4 taps; choose "–" in the last slot for a 3-tap code.
     * Logo needs a micro:bit V2. A pin counts when it is connected to GND, for example
     * by an arcade button or switch (a finger alone is not enough).
     * Taps must be less than 1.5 s apart; a long press starts over.
     * Each tap still runs your other button and contact blocks too.
     */
    //% blockId=steamplay_on_sequence
    //% block="on sequence $tap1 $tap2 $tap3 $tap4 entered"
    //% tap1.defl=SteamplayTap.A tap2.defl=SteamplayTap.B tap3.defl=SteamplayTap.B tap4.defl=SteamplayLastTap.A
    //% group="Buttons" weight=75
    export function onSequence(tap1: SteamplayTap, tap2: SteamplayTap, tap3: SteamplayTap, tap4: SteamplayLastTap, handler: () => void) {
        const clean = tapSymbol(tap1) + tapSymbol(tap2) + tapSymbol(tap3) + tapSymbol(tap4)
        if (clean.length < 3) return
        if (clean.indexOf("L") >= 0) needLogo = true
        seqCodes.push(clean)
        const ps = pinsInCode(clean)
        for (let i = 0; i < ps.length; i++) slotFor(ps[i])
        control.onEvent(steamplayCore.EVENT_SRC_SEQUENCE, seqCodes.length, handler)
        start()
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
    // Sensors: temperature change
    // ---------------------------------------------------------------
    const TEMP_CHECK_MS = 1000
    const EVENT_TEMP = 90             // event values 91..93 = rises / falls / changes
    let tempWatching = false
    let tempStep: number[] = [0, 0, 0, 0]   // degrees per direction (index = SteamplayTempChange)
    let tempRef: number[] = [0, 0, 0, 0]    // temperature each direction is measured from
    let tempCheckedAt = -TEMP_CHECK_MS

    function checkTemperature(now: number) {
        if (!tempWatching || now - tempCheckedAt < TEMP_CHECK_MS) return
        tempCheckedAt = now
        const t = input.temperature()
        for (let dir = 1; dir <= 3; dir++) {
            const step = tempStep[dir]
            if (step <= 0) continue
            const diff = t - tempRef[dir]
            let hit = false
            if (dir == SteamplayTempChange.Rises) {
                if (diff >= step) hit = true
                else if (diff < 0) tempRef[dir] = t   // follow the temperature down, so a rise is measured from the lowest point
            } else if (dir == SteamplayTempChange.Falls) {
                if (-diff >= step) hit = true
                else if (diff > 0) tempRef[dir] = t   // follow it up, so a fall is measured from the highest point
            } else {
                if (Math.abs(diff) >= step) hit = true
            }
            if (hit) {
                tempRef[dir] = t
                control.raiseEvent(steamplayCore.EVENT_SRC_INPUTS, EVENT_TEMP + dir, EventCreationMode.CreateAndFire)
            }
        }
    }

    /**
     * Run code when the temperature goes up, goes down, or changes by this many degrees.
     * After it runs, it measures again from the new temperature, so it can run again.
     * The micro:bit measures the temperature of its own chip, which is close to
     * room temperature but can read a little warm when the micro:bit has been busy.
     * @param direction rises, falls or changes, eg: SteamplayTempChange.Rises
     * @param degrees how many °C it must change by, eg: 2
     */
    //% blockId=steamplay_on_temperature_change
    //% block="on temperature $direction by $degrees °C"
    //% degrees.min=1 degrees.max=20 degrees.defl=2
    //% group="Sensors" weight=45
    export function onTemperatureChange(direction: SteamplayTempChange, degrees: number, handler: () => void) {
        const t = input.temperature()
        tempStep[direction] = Math.max(1, Math.abs(degrees))
        tempRef[direction] = t
        tempWatching = true
        control.onEvent(steamplayCore.EVENT_SRC_INPUTS, EVENT_TEMP + direction, handler)
        start()
    }

    // ---------------------------------------------------------------
    // Safety
    // ---------------------------------------------------------------

    function addStop(inp: number, ms: number) {
        const i = stopInputs.indexOf(inp)
        if (i < 0) {
            stopInputs.push(inp)
            stopHoldMs.push(ms)
            stopHeldSince.push(-1)
        } else {
            stopHoldMs[i] = ms
            stopHeldSince[i] = -1
        }
        start()
    }

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
        addStop(holdThis, 3000)
    }

    /**
     * A second emergency stop, using a pin: connect the pin to GND, eg with a
     * big red button, a pull-cord switch or a crash wire, and hold it for this long.
     * Use 0 to stop straight away (it still ignores a spark shorter than about 20 ms).
     * Works alongside the button stop. Give this pin its own job:
     * with 0 s, any contact on it will stop the build.
     * Put this in "on start".
     * @param pin the pin wired to the stop switch, eg: SteamplayPin.P2
     * @param seconds how long it must stay connected; 0 stops straight away, eg: 0
     */
    //% blockId=steamplay_emergency_stop_pin
    //% block="emergency stop when pin $pin connected for $seconds s"
    //% pin.defl=SteamplayPin.P2 seconds.min=0 seconds.max=10 seconds.defl=0
    //% group="Safety" weight=59
    export function emergencyStopPin(pin: SteamplayPin, seconds: number) {
        slotFor(pin)
        addStop(pin, Math.max(0, Math.min(10, seconds)) * 1000)
    }

    // ---------------------------------------------------------------
    // Contacts (fast pin touches)
    // ---------------------------------------------------------------
    // Per-pin state, stored by pin slot 0..5. One FALL/RISE listener per pin is
    // shared by the contact block and sequences (MakeCode allows one handler per event).
    const SEQ_PIN_DEBOUNCE_US = 150000   // one press of a button on a pin counts once in a sequence
    let contactPins: number[] = []
    let contactOn: boolean[] = []   // a contact block uses this pin
    let lockoutUs: number[] = []
    let acceptedAt: number[] = []   // µs timestamp of the last contact that counted
    let contactUs: number[] = []    // µs length of the last contact
    let seqPinAt: number[] = []     // µs timestamp of the last sequence tap on this pin
    let pinDown: boolean[] = []     // pin is connected to GND right now (for the emergency stop)

    function slotFor(pin: number): number {
        for (let i = 0; i < contactPins.length; i++) {
            if (contactPins[i] == pin) return i
        }
        contactPins.push(pin)
        contactOn.push(false)
        lockoutUs.push(1000000)
        acceptedAt.push(-1)
        contactUs.push(0)
        seqPinAt.push(-1)
        pinDown.push(false)
        const slot = contactPins.length - 1

        steamplayCore.claimPin(pin, "contact")
        pins.setPull(pin, PinPullMode.PullUp)
        pins.setEvents(pin, PinEventType.Edge)

        // Contact made (pin pulled to ground).
        control.onEvent(pin, DAL.MICROBIT_PIN_EVT_FALL, function () {
            const ts = control.eventTimestamp()
            pinDown[slot] = true
            pinFall(slot, ts)
        })
        // Contact broken. Keep the latest release inside the lockout window,
        // so a bouncy contact reports roughly its whole length.
        control.onEvent(pin, DAL.MICROBIT_PIN_EVT_RISE, function () {
            const ts = control.eventTimestamp()
            pinDown[slot] = false
            const d = ts - acceptedAt[slot]
            if (acceptedAt[slot] >= 0 && d >= 0 && d < lockoutUs[slot]) contactUs[slot] = d
        })
        return slot
    }

    function pinFall(slot: number, ts: number) {
        const pin = contactPins[slot]
        // Sequences: a short debounce so one button press counts once.
        if (seqCodes.length > 0) {
            const lastSeq = seqPinAt[slot]
            if (lastSeq < 0 || ts - lastSeq < 0 || ts - lastSeq >= SEQ_PIN_DEBOUNCE_US) {
                seqPinAt[slot] = ts
                recordSymbol(pinSymbol(pin), control.millis())
            }
        }
        // Contact block: its own lockout.
        if (contactOn[slot]) {
            const last = acceptedAt[slot]
            if (last >= 0 && ts - last >= 0 && ts - last < lockoutUs[slot]) return
            acceptedAt[slot] = ts
            contactUs[slot] = 0
            control.raiseEvent(steamplayCore.EVENT_SRC_CONTACTS, pin, EventCreationMode.CreateAndFire)
        }
    }

    /**
     * A fast contact: runs code the instant a pin touches GND (ground), even for a very
     * short touch that MakeCode's "on pin pressed" would miss. Great for swinging
     * contacts, goals and switches. Metal contacts bounce, so after a contact counts,
     * more touches are ignored for this many seconds: one hit counts once.
     * A pin used here can't also use the built-in "on pin pressed" block.
     * @param pin the pin wired to the contact, eg: SteamplayPin.P1
     * @param lockout seconds to ignore repeat touches, eg: 1
     */
    //% blockId=steamplay_on_pin_contact
    //% block="on pin $pin contact, ignore repeats for $lockout s"
    //% lockout.min=0 lockout.max=10 lockout.defl=1
    //% pin.defl=SteamplayPin.P1
    //% group="Contacts" weight=50 blockGap=8
    export function onPinContact(pin: SteamplayPin, lockout: number, handler: () => void) {
        const slot = slotFor(pin)
        contactOn[slot] = true
        lockoutUs[slot] = Math.max(0, lockout) * 1000000
        control.onEvent(steamplayCore.EVENT_SRC_CONTACTS, pin, handler)
    }

    /**
     * How long the last contact on this pin lasted, in milliseconds.
     * A faster swing or a lighter hit makes a shorter contact, so you can compare hits.
     * It measures from the first touch to the last bounce, so bouncy contacts give a close guess.
     * @param pin the pin wired to the contact, eg: SteamplayPin.P1
     */
    //% blockId=steamplay_contact_time
    //% block="contact time on pin $pin (ms)"
    //% pin.defl=SteamplayPin.P1
    //% group="Contacts" weight=40
    export function contactTime(pin: SteamplayPin): number {
        for (let i = 0; i < contactPins.length; i++) {
            if (contactPins[i] == pin) return contactUs[i] / 1000
        }
        return 0
    }
}
