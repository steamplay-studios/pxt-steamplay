/**
 * STEAMPlay Studios MakeCode extension - shared helpers.
 * These functions have no blocks. Other STEAMPlay files use them.
 * Copyright (c) 2026 STEAMPlay Studios. MIT licence.
 */
namespace steamplayCore {
    /** STEAMPlay orange, sampled from the logo. */
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
    // Pin claims: which STEAMPlay feature is using each general-purpose pin
    // ---------------------------------------------------------------
    // Owner names: "motor", "contact", "light". Stored as parallel arrays.
    let _claimPins: number[] = []
    let _claimOwners: string[] = []

    /**
     * Claim a pin for a STEAMPlay feature. If another feature already uses it,
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

    /** Turn off every motor and servo that STEAMPlay knows about. */
    export function stopEverything() {
        for (let i = 0; i < _stopHandlers.length; i++) {
            _stopHandlers[i]()
        }
    }
}
