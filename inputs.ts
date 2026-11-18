/**
 * STEAMplay Inputs: smarter buttons, logo, button+logo presses,
 * emergency stop and fast pin contacts.
 * Copyright (c) 2026 STEAMplay Studios. MIT licence.
 */

/** A button, both buttons, the micro:bit logo, or a button with the logo. */
enum SteamplayInput {
    //% block="A"
    A = 0,
    //% block="B"
    B = 1,
    //% block="A+B"
    AB = 2,
    //% block="logo"
    Logo = 3,
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

/** Buttons that can use double press (the logo can't: it is kept for single press and codes). */
enum SteamplayDoubleInput {
    //% block="A"
    A = 0,
    //% block="B"
    B = 1,
    //% block="A+B"
    AB = 2
}

/** The first tap of a sequence: the "code key" that tells the micro:bit a code is coming. */
enum SteamplayFirstTap {
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
//% color="#CB6926" weight=109 icon="\uf011" block="STEAMplay Inputs"
//% groups=['Buttons', 'Contacts', 'Sensors', 'Sync', 'Safety']
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
            if (recordTap(inp, held, now)) {
                // This tap finished a secret code: the code runs instead of this tap's own block.
                this.state = ST_IDLE
                return
            }
            if (isCombo(inp)) {
                // A+logo / B+logo: single or long press only (no double press).
                fire(held >= LONG_MS ? KIND_LONG : KIND_SINGLE, inp)
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
                        if (!recordTap(this.inp, held, now)) fire(KIND_DOUBLE, this.first)
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
    // Sequences ("cheat codes"). Each code starts with a code key (logo or pin).
    // After the key, taps that fit a code belong to the code and don't run their own
    // blocks. A wrong tap, a long press, a chord, or a gap over SEQ_GAP_MS ends the code.
    // ---------------------------------------------------------------
    const SEQ_GAP_MS = 1500
    let seqCodes: string[] = []
    let seqActive = false
    let seqTaps = ""
    let seqLastTap = 0
    let seqPending = -1   // a finished code that is also the start of a longer code

    function startsAny(t: string): boolean {
        for (let i = 0; i < seqCodes.length; i++) {
            const c = seqCodes[i]
            if (c.length >= t.length && c.substr(0, t.length) == t) return true
        }
        return false
    }

    function exactCode(t: string): number {
        for (let i = 0; i < seqCodes.length; i++) if (seqCodes[i] == t) return i
        return -1
    }

    function longerCode(t: string): boolean {
        for (let i = 0; i < seqCodes.length; i++) {
            const c = seqCodes[i]
            if (c.length > t.length && c.substr(0, t.length) == t) return true
        }
        return false
    }

    function fireCode(i: number) {
        control.raiseEvent(steamplayCore.EVENT_SRC_SEQUENCE, i + 1, EventCreationMode.CreateAndFire)
    }

    /** End the code being typed. A finished shorter code (eg LAB when LABB also exists) runs now. */
    function endCode() {
        const p = seqPending
        seqActive = false
        seqTaps = ""
        seqPending = -1
        if (p >= 0) fireCode(p)
    }

    function checkCodeTimeout(now: number) {
        if (seqActive && now - seqLastTap > SEQ_GAP_MS) endCode()
    }

    /** One tap (A, B, L or a pin symbol). Returns true if the tap belongs to a code. */
    function recordSymbol(sym: string, now: number): boolean {
        if (seqCodes.length == 0) return false
        checkCodeTimeout(now)
        if (seqActive) {
            const t = seqTaps + sym
            if (startsAny(t)) {
                seqTaps = t
                seqLastTap = now
                seqPending = -1
                const i = exactCode(t)
                if (i >= 0) {
                    if (longerCode(t)) {
                        seqPending = i          // wait to see if the longer code is coming
                    } else {
                        seqActive = false
                        seqTaps = ""
                        fireCode(i)
                    }
                }
                return true
            }
            endCode()   // this tap doesn't fit: it works normally (or starts a new code)
        }
        if (startsAny(sym)) {
            seqActive = true
            seqTaps = sym
            seqLastTap = now
            seqPending = -1
            return true
        }
        return false
    }

    /** A finished button or logo press. Returns true if it belongs to a code. */
    function recordTap(inp: number, held: number, now: number): boolean {
        if (seqCodes.length == 0) return false
        if (held >= LONG_MS || (inp != IN_A && inp != IN_B && inp != IN_LOGO)) {
            if (seqActive) endCode()
            return false
        }
        return recordSymbol(inp == IN_A ? "A" : (inp == IN_B ? "B" : "L"), now)
    }

    /** Each tap is stored as one character: A, B, L (logo) or 0 1 2 8 C G for pins P0 P1 P2 P8 P12 P16. */
    function pinSymbol(pin: number): string {
        const n = pin - DigitalPin.P0
        if (n == 12) return "C"
        if (n == 16) return "G"
        return "" + n
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
    let stopLastHeld: number[] = []
    const STOP_GAP_MS = 200         // a gap shorter than this doesn't restart the hold count
    let stopTriggered = -1          // index of the stop that fired, or -1
    let stopAt = 0                  // when it fired
    const STOP_MAX_WAIT_MS = 5000   // restart after this even if the input still reads held

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
                    stopLastHeld[i] = now
                    if (stopHeldSince[i] < 0) stopHeldSince[i] = now
                    // "0 s" still needs the input down on two checks in a row (about 20 ms),
                    // so a crackly wire or a stray spark doesn't stop the build.
                    else if (now - stopHeldSince[i] >= Math.max(stopHoldMs[i], TICK_MS)) {
                        stopTriggered = i
                        stopAt = now
                        steamplayCore.stopEverything()
                        led.stopAnimation()
                        basic.showIcon(IconNames.No, 0)
                        return
                    }
                } else if (now - stopLastHeld[i] > STOP_GAP_MS) {
                    // Let go for longer than a flicker: start counting again next time.
                    stopHeldSince[i] = -1
                }
            }
        } else {
            // Keep everything stopped while the input is still held,
            // then restart once it is released (this avoids Bluetooth pairing mode for A+B).
            // Safety net: the logo or a pin can keep reading "held" (eg the board is held by its
            // edges), so restart anyway after STOP_MAX_WAIT_MS. A+B always waits for release.
            steamplayCore.stopEverything()
            const inp = stopInputs[stopTriggered]
            if (!stopHeld(inp, a, b, l)) control.reset()
            else if (inp != IN_AB && now - stopAt >= STOP_MAX_WAIT_MS) control.reset()
        }
    }

    // The logo is a touch sensor: a resting finger can read "not touched" for a moment.
    // Only count the logo as let go after it has read "not touched" for LOGO_RELEASE_MS.
    const LOGO_RELEASE_MS = 60
    let logoHeld = false
    let logoOffAt = -1

    let logoRaw = false

    function readLogo(now: number): boolean {
        logoRaw = input.logoIsPressed()
        if (logoRaw) {
            logoHeld = true
            logoOffAt = -1
        } else if (logoHeld) {
            if (logoOffAt < 0) logoOffAt = now
            else if (now - logoOffAt >= LOGO_RELEASE_MS) logoHeld = false
        }
        return logoHeld
    }

    function poll() {
        const now = control.millis()
        const a = input.buttonIsPressed(Button.A)
        const b = input.buttonIsPressed(Button.B)
        // The logo only exists on V2, and reading it on V1 would show error 927.
        let l = needLogo && steamplayCore.isV2() ? readLogo(now) : false
        // A or B pressed while the finger has just left the logo: the logo tap is over now,
        // so the button starts its own tap instead of being swallowed into the logo tap.
        let logoEnded = false
        if (l && !logoRaw && (a || b)) {
            logoHeld = false
            l = false
            logoEnded = true
        }

        checkEmergencyStop(a, b, l, now)
        checkTemperature(now)
        checkCodeTimeout(now)

        // "Pressed together" needs the finger really on the logo right now (not the
        // 60 ms release allowance), so a quick "logo, then A" is two taps, not A+logo.
        const together = logoCombos && l && logoRaw
        let cur = IN_NONE
        if (a && b) cur = IN_AB
        else if (together && a) cur = IN_ALOGO
        else if (together && b) cur = IN_BLOGO
        else if (a) cur = IN_A
        else if (b) cur = IN_B
        else if (logoCombos && l) cur = IN_LOGO
        if (logoEnded && logoCombos) buttonTracker.tick(IN_NONE, now)
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
     * Runs when you tap once. If the same input also has a double press block, it waits 0.4 s first. Use this instead of MakeCode's own block when you use double press.
     * @param input the button or logo to watch, eg: SteamplayInput.A
     */
    //% blockId=steamplay_on_single_pressed
    //% block="on $input single pressed"
    //% group="Buttons" weight=100 blockGap=8
    export function onSinglePressed(input: SteamplayInput, handler: () => void) {
        register(KIND_SINGLE, input, handler)
    }

    /**
     * Runs when you tap twice quickly (the second tap within 0.4 s).
     * @param input the button to watch, eg: SteamplayDoubleInput.A
     */
    //% blockId=steamplay_on_double_pressed
    //% block="on $input double pressed"
    //% group="Buttons" weight=90 blockGap=8
    export function onDoublePressed(input: SteamplayDoubleInput, handler: () => void) {
        hasDouble[input] = true
        register(KIND_DOUBLE, input, handler)
    }

    /**
     * Runs when you hold for 1 to 3 s, then let go. Holding 3 s or more cancels it.
     * @param input the button or logo to watch, eg: SteamplayInput.A
     */
    //% blockId=steamplay_on_long_pressed
    //% block="on $input long pressed"
    //% group="Buttons" weight=80
    export function onLongPressed(input: SteamplayInput, handler: () => void) {
        register(KIND_LONG, input, handler)
    }

    /**
     * Secret code: tap these in order, less than 1.5 s apart. The first tap (logo or pin) is the code key: its own single press won't run, and the taps after it don't run their own blocks.
     * Don't use a code pin in an "on pin contact" block.
     */
    //% blockId=steamplay_on_sequence
    //% block="on sequence $tap1 $tap2 $tap3 $tap4 entered"
    //% tap1.defl=SteamplayFirstTap.Logo tap2.defl=SteamplayTap.A tap3.defl=SteamplayTap.B tap4.defl=SteamplayLastTap.B
    //% group="Buttons" weight=75
    export function onSequence(tap1: SteamplayFirstTap, tap2: SteamplayTap, tap3: SteamplayTap, tap4: SteamplayLastTap, handler: () => void) {
        const clean = tapSymbol(tap1) + tapSymbol(tap2) + tapSymbol(tap3) + tapSymbol(tap4)
        if (clean.length < 3) return
        // The first tap must be the logo or a pin (A and B are left free for normal presses).
        if (clean.charAt(0) == "A" || clean.charAt(0) == "B") return
        if (clean.indexOf("L") >= 0) needLogo = true
        seqCodes.push(clean)
        const ps = pinsInCode(clean)
        for (let i = 0; i < ps.length; i++) slotFor(ps[i])
        control.onEvent(steamplayCore.EVENT_SRC_SEQUENCE, seqCodes.length, handler)
        start()
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
     * Runs when the micro:bit gets warmer or cooler by this many degrees, then measures again from there.
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
            stopLastHeld.push(-1000)
        } else if (stopHoldMs[i] != ms) {
            // Only a real change resets the count, so the block still works if it is
            // run again and again (eg put in "forever" instead of "on start").
            stopHoldMs[i] = ms
            stopHeldSince[i] = -1
        }
        start()
    }

    /**
     * Hold for 3 s to stop all motors, servos and music. Shows a cross, then restarts when you let go. Put in on start.
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
     * A second stop, using a button wired from the pin to GND. 0 s stops straight away. Put in on start.
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
    // Sync checkpoints: several micro:bits wait for each other at checkpoint n,
    // then all carry on together. Each one repeats "I'm at checkpoint n" over the
    // radio while it waits, so a lost message doesn't matter.
    // ---------------------------------------------------------------
    const SYNC_SEND_MS = 100        // how often a waiting micro:bit says it has arrived
    const SYNC_CHECK_MS = 5         // how often it checks whether everyone is here
    const SYNC_TIMEOUT_MS = 5000    // carry on after this if someone never arrives
    const SYNC_LINGER_MS = 600      // keep saying "arrived" a little after leaving
    const SYNC_KEEP = 60            // how many arrival records to remember
    let syncSize = 0
    let syncId = 0
    let syncListening = false
    let syncRecName: string[] = []  // eg "sy1r0" = checkpoint 1, first time through
    let syncRecId: number[] = []
    let syncRounds: number[] = []   // how many times this micro:bit has passed each checkpoint
    let syncRoundCp: number[] = []

    function syncRecord(name: string, id: number) {
        for (let i = 0; i < syncRecName.length; i++) {
            if (syncRecName[i] == name && syncRecId[i] == id) return
        }
        syncRecName.push(name)
        syncRecId.push(id)
        if (syncRecName.length > SYNC_KEEP) {
            syncRecName.shift()
            syncRecId.shift()
        }
    }

    function syncCount(name: string): number {
        let n = 0
        for (let i = 0; i < syncRecName.length; i++) if (syncRecName[i] == name) n++
        return n
    }

    function syncRound(cp: number): number {
        const i = syncRoundCp.indexOf(cp)
        if (i < 0) {
            syncRoundCp.push(cp)
            syncRounds.push(0)
            return 0
        }
        return syncRounds[i]
    }

    function syncNextRound(cp: number) {
        const i = syncRoundCp.indexOf(cp)
        syncRounds[i] = (syncRounds[i] + 1) % 1000
    }

    /**
     * Put in on start on each micro:bit: same group and number of micro:bits.
     * Uses the radio, so don't add your own radio blocks (a band can share the group).
     * @param group radio group shared by all the micro:bits, eg: 1
     * @param count how many micro:bits are in the group, eg: 2
     */
    //% blockId=steamplay_join_sync
    //% block="join sync group $group with $count micro:bits"
    //% group.min=0 group.max=255 group.defl=1 count.min=2 count.max=20 count.defl=2
    //% group="Sync" weight=40
    export function joinSync(group: number, count: number) {
        syncSize = Math.max(1, count)
        steamplayCore.useRadioGroup(group)
        if (syncListening) return   // already set up (eg the block is in "forever")
        syncListening = true
        syncId = control.deviceSerialNumber() & 0x3fffffff
        steamplayCore.onRadio("sy", function (name: string, value: number) {
            syncRecord(name, value)
        })
    }

    /**
     * Waits here until every micro:bit in the sync group reaches this checkpoint,
     * then all carry on together. Carries on after 5 s if one never arrives.
     * @param checkpoint the checkpoint number, eg: 1
     */
    //% blockId=steamplay_sync_checkpoint
    //% block="sync checkpoint $checkpoint"
    //% checkpoint.min=1 checkpoint.max=99 checkpoint.defl=1
    //% group="Sync" weight=39
    export function syncCheckpoint(checkpoint: number) {
        if (!syncListening) return
        const name = "sy" + checkpoint + "r" + syncRound(checkpoint)
        syncNextRound(checkpoint)
        syncRecord(name, syncId)
        const started = control.millis()
        // Always announce on arrival, even if everyone else is already here.
        radio.sendValue(name, syncId)
        let lastSend = started
        while (syncCount(name) < syncSize && control.millis() - started < SYNC_TIMEOUT_MS) {
            // Check often (so everyone leaves within a few ms), but only send every 100 ms.
            basic.pause(SYNC_CHECK_MS)
            if (control.millis() - lastSend >= SYNC_SEND_MS) {
                radio.sendValue(name, syncId)
                lastSend = control.millis()
            }
        }
        // Keep saying "arrived" for a moment, in case someone missed our last message.
        control.inBackground(function () {
            const until = control.millis() + SYNC_LINGER_MS
            while (control.millis() < until) {
                radio.sendValue(name, syncId)
                basic.pause(SYNC_SEND_MS)
            }
        })
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
     * Fast contact: runs the instant the pin touches GND, even a very quick touch. Ignores repeats for this many seconds.
     * Don't use a pin that is in a secret code.
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
     * How long the last contact lasted, in ms. A faster hit makes a shorter contact.
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
