/**
 * STEAMplay shared motion engine (no blocks).
 * Ramps, smooth moves and wiggles for servos, micro motors and motors all run
 * on one background timer, so several things can move together.
 * Copyright (c) 2026 STEAMplay Studios. MIT licence.
 */
namespace steamplayMotion {
    export const KIND_SERVO = 1     // positional servo angle (degrees)
    export const KIND_MICRO = 2     // micro motor speed (-100..100)
    export const KIND_MOTOR = 3     // motor driver speed (-100..100)
    export const KIND_WIGGLE = 4    // servo wiggle around an angle

    const TICK_MS = 20

    // One entry per thing that is moving.
    let mvKind: number[] = []
    let mvIndex: number[] = []
    let mvFrom: number[] = []
    let mvTo: number[] = []
    let mvStart: number[] = []
    let mvDur: number[] = []
    let mvAmp: number[] = []        // wiggle size (degrees)
    let mvTimes: number[] = []      // wiggle count
    let mvOffAtEnd: boolean[] = []  // cut the signal / turn off when finished
    let mvId: number[] = []
    let nextId = 1
    let running = false

    // How each kind sets a value, and how it turns off.
    let appliers: ((index: number, value: number) => void)[] = [null, null, null, null, null]
    let offers: ((index: number) => void)[] = [null, null, null, null, null]

    export function setApplier(kind: number, apply: (index: number, value: number) => void, off: (index: number) => void) {
        appliers[kind] = apply
        offers[kind] = off
    }

    function group(kind: number): number {
        // Servo angle, micro motor and wiggle all use a servo channel.
        return kind == KIND_MOTOR ? 2 : 1
    }

    /** Stop any movement of this channel (a new command replaces a ramp in progress). */
    export function cancel(kind: number, index: number) {
        for (let i = mvKind.length - 1; i >= 0; i--) {
            if (group(mvKind[i]) == group(kind) && mvIndex[i] == index) remove(i)
        }
    }

    function remove(i: number) {
        mvKind.removeAt(i); mvIndex.removeAt(i); mvFrom.removeAt(i); mvTo.removeAt(i)
        mvStart.removeAt(i); mvDur.removeAt(i); mvAmp.removeAt(i); mvTimes.removeAt(i)
        mvOffAtEnd.removeAt(i); mvId.removeAt(i)
    }

    /** Start a movement. Returns its id (used to wait for it). */
    export function start(kind: number, index: number, from: number, to: number, seconds: number,
        amp: number, times: number, offAtEnd: boolean): number {
        cancel(kind, index)
        const id = nextId++
        mvKind.push(kind); mvIndex.push(index); mvFrom.push(from); mvTo.push(to)
        mvStart.push(control.millis()); mvDur.push(Math.max(0, seconds) * 1000)
        mvAmp.push(amp); mvTimes.push(times); mvOffAtEnd.push(offAtEnd); mvId.push(id)
        if (!running) {
            running = true
            control.inBackground(loop)
        }
        tick()   // apply the first step straight away
        return id
    }

    /** True while the movement with this id is still going. */
    export function isMoving(id: number): boolean {
        return mvId.indexOf(id) >= 0
    }

    /** True while this channel is moving. */
    export function channelMoving(kind: number, index: number): boolean {
        for (let i = 0; i < mvKind.length; i++) {
            if (group(mvKind[i]) == group(kind) && mvIndex[i] == index) return true
        }
        return false
    }

    export function anyMoving(): boolean {
        return mvKind.length > 0
    }

    export function waitFor(id: number) {
        while (isMoving(id)) basic.pause(TICK_MS)
    }

    export function waitForChannel(kind: number, index: number) {
        while (channelMoving(kind, index)) basic.pause(TICK_MS)
    }

    export function waitForAll() {
        while (anyMoving()) basic.pause(TICK_MS)
    }

    /** Stop every movement (does not turn anything off). */
    export function cancelAll() {
        while (mvKind.length > 0) remove(0)
    }

    function tick() {
        const now = control.millis()
        for (let i = mvKind.length - 1; i >= 0; i--) {
            const kind = mvKind[i]
            const t = mvDur[i] <= 0 ? 1 : Math.min(1, (now - mvStart[i]) / mvDur[i])
            let value: number
            if (kind == KIND_WIGGLE) {
                // Swing either side of the angle, then return to it.
                value = t >= 1 ? mvFrom[i] : mvFrom[i] + mvAmp[i] * Math.sin(2 * Math.PI * mvTimes[i] * t)
                appliers[KIND_SERVO](mvIndex[i], value)
            } else {
                value = t >= 1 ? mvTo[i] : mvFrom[i] + (mvTo[i] - mvFrom[i]) * t
                appliers[kind](mvIndex[i], value)
            }
            if (t >= 1) {
                const off = mvOffAtEnd[i]
                const idx = mvIndex[i]
                remove(i)
                if (off) offers[kind == KIND_WIGGLE ? KIND_SERVO : kind](idx)
            }
        }
    }

    function loop() {
        while (true) {
            if (mvKind.length > 0) tick()
            basic.pause(TICK_MS)
        }
    }
}
