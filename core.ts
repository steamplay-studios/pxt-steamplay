/**
 * STEAMplay Studios MakeCode extension - shared helpers.
 * These functions have no blocks. Other STEAMplay files use them.
 * Copyright (c) 2026 STEAMplay Studios. MIT licence.
 */
namespace steamplayCore {
    /** STEAMplay orange, sampled from the logo. */
    export const ORANGE = 0xCB6926

    /** Custom event source IDs used to run kids' handlers (one per category). */
    export const EVENT_SRC_INPUTS = 0x5350   // "SP"
    export const EVENT_SRC_CONTACTS = 0x5351
    export const EVENT_SRC_SEQUENCE = 0x5352
    export const EVENT_SRC_MUSIC = 0x5353

    // ---------------------------------------------------------------
    // Hardware version
    // ---------------------------------------------------------------
    let _isV2: number = -1   // -1 = not checked yet, 0 = V1, 1 = V2

    /** True on a micro:bit V2 (and in the simulator). */
    export function isV2(): boolean {
        if (_isV2 < 0) {
            const v = control.hardwareVersion()
            _isV2 = (v.length > 0 && v.charAt(0) == "1") ? 0 : 1
        }
        return _isV2 == 1
    }

    // ---------------------------------------------------------------
    // Pin claims: which STEAMplay feature is using each general-purpose pin
    // ---------------------------------------------------------------
    // Owner names: "motor", "contact", "light". Stored as parallel arrays.
    let _claimPins: number[] = []
    let _claimOwners: string[] = []

    /**
     * Claim a pin for a STEAMplay feature. If another feature already uses it,
     * show a cross and the pin name on the LED screen.
     * Also turns off sound on P0 when P0 is claimed, so music can't disturb it.
     * Returns true if the pin was free (or already ours).
     */
    export function claimPin(pin: number, owner: string): boolean {
        for (let i = 0; i < _claimPins.length; i++) {
            if (_claimPins[i] == pin) {
                if (_claimOwners[i] == owner) return true
                showPinClash(pin)
                return false
            }
        }
        _claimPins.push(pin)
        _claimOwners.push(owner)
        if (pin == DigitalPin.P0) {
            // V2 copies all sound to P0 by default. Turn that off; the speaker keeps playing.
            pins.setAudioPinEnabled(false)
        }
        return true
    }

    /** Short name such as "P1" for a DigitalPin value. */
    export function pinName(pin: number): string {
        return "P" + (pin - DigitalPin.P0)
    }

    function showPinClash(pin: number) {
        control.inBackground(function () {
            basic.showIcon(IconNames.No)
            basic.showString(pinName(pin))
        })
    }

    // ---------------------------------------------------------------
    // Stop-all registry (used by the emergency stop and "stop all")
    // Servo and motor code (stage 2) registers a function here.
    // ---------------------------------------------------------------
    let _stopHandlers: (() => void)[] = []

    export function addStopHandler(h: () => void) {
        _stopHandlers.push(h)
    }

    // "stop all motors and servos": like the emergency stop for motion only (music keeps going,
    // the program keeps running).
    let _motionStopHandlers: (() => void)[] = []
    export function addMotionStopHandler(h: () => void) {
        _motionStopHandlers.push(h)
    }
    export function stopAllMotion() {
        for (let i = 0; i < _motionStopHandlers.length; i++) _motionStopHandlers[i]()
    }

    /** Turn off every motor and servo that STEAMplay knows about. */
    export function stopEverything() {
        for (let i = 0; i < _stopHandlers.length; i++) {
            _stopHandlers[i]()
        }
    }

    // ---------------------------------------------------------------
    // Music now playing, so servos, motors and lights can follow one song or sound.
    // Music ids: 100 + song, 200 + sound, 300 + band song. 0 = nothing playing.
    // A choice is one of those, or 1 = any song, 2 = any sound, 3 = any music.
    // ---------------------------------------------------------------
    let _musicNow = 0
    let _musicListeners: ((started: boolean, music: number) => void)[] = []

    /** h(true, music) when music starts, h(false, music) when it ends, is stopped or replaced. */
    export function onMusicChange(h: (started: boolean, music: number) => void) {
        _musicListeners.push(h)
    }

    export function musicNow(): number {
        return _musicNow
    }

    export function musicStarted(music: number) {
        musicEnded()
        _musicNow = music
        for (let i = 0; i < _musicListeners.length; i++) _musicListeners[i](true, music)
    }

    export function musicEnded() {
        const m = _musicNow
        if (m == 0) return
        _musicNow = 0
        for (let i = 0; i < _musicListeners.length; i++) _musicListeners[i](false, m)
    }

    /** Does this music (an id) belong to this choice? */
    export function musicMatches(choice: number, music: number): boolean {
        if (music <= 0 || choice <= 0) return false
        if (choice == 3) return true
        const isSound = music >= 200 && music < 300
        if (choice == 1) return !isSound
        if (choice == 2) return isSound
        return choice == music
    }

    // ---------------------------------------------------------------
    // Shared radio: MakeCode allows only one "on radio received" handler, so the band
    // and sync blocks share this one and get the messages that start with their prefix.
    // ---------------------------------------------------------------
    let _radioPrefixes: string[] = []
    let _radioHandlers: ((name: string, value: number) => void)[] = []
    let _radioListening = false
    let _radioGroup = -1

    /** Run handler for every radio value whose name starts with prefix. */
    export function onRadio(prefix: string, handler: (name: string, value: number) => void) {
        _radioPrefixes.push(prefix)
        _radioHandlers.push(handler)
        if (_radioListening) return
        _radioListening = true
        radio.onReceivedValue(function (name: string, value: number) {
            for (let i = 0; i < _radioPrefixes.length; i++) {
                const p = _radioPrefixes[i]
                if (name.length >= p.length && name.substr(0, p.length) == p) _radioHandlers[i](name, value)
            }
        })
    }

    /** Set the radio group once (the band and sync must use the same group). */
    export function useRadioGroup(group: number) {
        if (group == _radioGroup) return
        _radioGroup = group
        radio.setGroup(group)
    }
}
