/**
 * STEAMplay Servos: the Kitronik Compact 16-Servo Driver Board (5694), plus micro motors
 * (continuous-rotation servos), smooth moves, wiggles, range limits and mirroring.
 *
 * Includes the original Kitronik servo code (pxt-kitronik-I2C-16-servo,
 * MIT licence, Copyright (c) 2017 Kitronik Ltd), with one change: every channel
 * starts at 90 degrees instead of 0.
 */

/** Servo channels on the 16-servo board. */
enum SteamplayServo {
    //% block="1"
    S1 = 1,
    //% block="2"
    S2 = 2,
    //% block="3"
    S3 = 3,
    //% block="4"
    S4 = 4,
    //% block="5"
    S5 = 5,
    //% block="6"
    S6 = 6,
    //% block="7"
    S7 = 7,
    //% block="8"
    S8 = 8,
    //% block="9"
    S9 = 9,
    //% block="10"
    S10 = 10,
    //% block="11"
    S11 = 11,
    //% block="12"
    S12 = 12,
    //% block="13"
    S13 = 13,
    //% block="14"
    S14 = 14,
    //% block="15"
    S15 = 15,
    //% block="16"
    S16 = 16
}

/** Follow another servo the same way, or the opposite way. */
enum SteamplayFollow {
    //% block="mirror"
    Mirror = 0,
    //% block="copy"
    Copy = 1
}

/**
 * Kitronik 16-servo board, micro motors, smooth moves and mirroring.
 */
//% color="#CB6926" weight=100 icon="\uf085" block="STEAMplay Servos"
//% groups=['Servos', 'Micro motors', 'Mirror', 'Wait and stop', 'Settings']
namespace steamplayServos {
    // ---------------------------------------------------------------
    // Kitronik's board code (I2C PCA9685 at address 0x6A, 50 Hz)
    // ---------------------------------------------------------------
    let ChipAddress = 0x6A
    let PrescaleReg = 0xFE
    let PrescaleVal = 0x7D   // 50 Hz
    let Mode1Reg = 0x00
    let Servo1RegBase = 0x08
    let ServoRegDistance = 4
    let ServoMultiplier = 226
    let ServoZeroOffset = 0x66
    let initalised = false

    function reg(servo: number): number {
        return Servo1RegBase + (servo - 1) * ServoRegDistance
    }

    function pwmFor(degrees: number): number {
        return Math.floor(degrees * 100 * ServoMultiplier / 10000) + ServoZeroOffset
    }

    /** Kitronik's start-up routine, changed to start every channel at 90 degrees. */
    function secretIncantation(): void {
        let buf = pins.createBuffer(2)
        let reset = pins.createBuffer(1)
        reset[0] = 0x06
        pins.i2cWriteBuffer(0x00, reset, false)   // soft reset
        buf[0] = PrescaleReg
        buf[1] = PrescaleVal
        pins.i2cWriteBuffer(ChipAddress, buf, false)
        // All channels to 90 degrees (Kitronik's original used 0 degrees, which makes micro motors spin).
        const mid = pwmFor(90)
        buf[0] = 0xFA; buf[1] = 0x00; pins.i2cWriteBuffer(ChipAddress, buf, false)
        buf[0] = 0xFB; buf[1] = 0x00; pins.i2cWriteBuffer(ChipAddress, buf, false)
        buf[0] = 0xFC; buf[1] = mid & 0xFF; pins.i2cWriteBuffer(ChipAddress, buf, false)
        buf[0] = 0xFD; buf[1] = (mid >> 8) & 0xFF; pins.i2cWriteBuffer(ChipAddress, buf, false)
        buf[0] = Mode1Reg
        buf[1] = 0x01
        pins.i2cWriteBuffer(ChipAddress, buf, false)   // wake up
        initalised = true
        for (let i = 0; i < 16; i++) angle[i] = 90
    }

    function writePwm(servo: number, degrees: number) {
        if (!initalised) secretIncantation()
        let buf = pins.createBuffer(2)
        const v = pwmFor(Math.max(0, Math.min(180, degrees)))
        buf[0] = reg(servo)
        buf[1] = v & 0xFF
        pins.i2cWriteBuffer(ChipAddress, buf, false)
        buf[0] = reg(servo) + 1
        buf[1] = (v >> 8) & 0x01
        pins.i2cWriteBuffer(ChipAddress, buf, false)
    }

    function writeOff(servo: number) {
        if (!initalised) secretIncantation()
        let buf = pins.createBuffer(2)
        buf[0] = reg(servo); buf[1] = 0x00
        pins.i2cWriteBuffer(ChipAddress, buf, false)
        buf[0] = reg(servo) + 1; buf[1] = 0x00
        pins.i2cWriteBuffer(ChipAddress, buf, false)
    }

    // ---------------------------------------------------------------
    // STEAMplay state for each channel (index 0..15 = servo 1..16)
    // ---------------------------------------------------------------
    let angle: number[] = []        // last angle sent
    let speed: number[] = []        // last micro motor speed
    let limitLo: number[] = []
    let limitHi: number[] = []
    let trim: number[] = []         // micro motor stop point (degrees from 90)
    let flip: number[] = []         // 1 or -1 (reverse micro motor)
    let follows: number[] = []      // the servo this one follows, or 0
    let followMode: number[] = []
    let isMicro: boolean[] = []
    let setUp = false

    function setup() {
        if (setUp) return
        setUp = true
        for (let i = 0; i < 16; i++) {
            angle.push(90); speed.push(0); limitLo.push(0); limitHi.push(180)
            trim.push(0); flip.push(1); follows.push(0); followMode.push(0); isMicro.push(false)
        }
        steamplayMotion.setApplier(steamplayMotion.KIND_SERVO, applyAngle, applyOff)
        steamplayMotion.setApplier(steamplayMotion.KIND_MICRO, applySpeed, applyOff)
        steamplayCore.addStopHandler(function () { allOff() })
        steamplayCore.addMotionStopHandler(function () { allOff() })
    }

    function ch(servo: number): number {
        return Math.max(1, Math.min(16, servo)) - 1
    }

    /** Set an angle, respecting the range limit, and update any followers. */
    function applyAngle(servo: number, degrees: number) {
        const i = ch(servo)
        const d = Math.max(limitLo[i], Math.min(limitHi[i], degrees))
        isMicro[i] = false
        angle[i] = d
        writePwm(servo, d)
        for (let j = 0; j < 16; j++) {
            if (follows[j] == servo) {
                const fd = followMode[j] == SteamplayFollow.Mirror ? 180 - d : d
                const k = Math.max(limitLo[j], Math.min(limitHi[j], fd))
                angle[j] = k
                isMicro[j] = false
                writePwm(j + 1, k)
            }
        }
    }

    function microAngle(i: number, s: number): number {
        return 90 + trim[i] + flip[i] * Math.max(-100, Math.min(100, s)) * 0.9
    }

    /** Set a micro motor speed, and update any followers. */
    function applySpeed(servo: number, s: number) {
        const i = ch(servo)
        isMicro[i] = true
        speed[i] = s
        writePwm(servo, microAngle(i, s))
        for (let j = 0; j < 16; j++) {
            if (follows[j] == servo) {
                const fs = followMode[j] == SteamplayFollow.Mirror ? -s : s
                isMicro[j] = true
                speed[j] = fs
                writePwm(j + 1, microAngle(j, fs))
            }
        }
    }

    function applyOff(servo: number) {
        const i = ch(servo)
        speed[i] = 0
        writeOff(servo)
        for (let j = 0; j < 16; j++) if (follows[j] == servo) { speed[j] = 0; writeOff(j + 1) }
    }

    function allOff() {
        steamplayMotion.cancelAll()
        if (!initalised) return
        for (let s = 1; s <= 16; s++) writeOff(s)
        for (let i = 0; i < speed.length; i++) speed[i] = 0
    }

    /** A follower ignores its own commands until "stop mirroring". */
    function isFollower(servo: number): boolean {
        return follows[ch(servo)] != 0
    }

    // ---------------------------------------------------------------
    // Blocks: servos
    // ---------------------------------------------------------------

    /**
     * Turns the servo to an angle (0 to 180 degrees). Servos start at 90.
     * @param servo the servo channel, eg: SteamplayServo.S1
     * @param degrees the angle, eg: 90
     */
    //% blockId=steamplay_servo_write
    //% block="set servo $servo to $degrees °"
    //% degrees.min=0 degrees.max=180 degrees.defl=90
    //% group="Servos" weight=100
    export function servoWrite(servo: SteamplayServo, degrees: number): void {
        setup()
        if (isFollower(servo)) return
        steamplayMotion.cancel(steamplayMotion.KIND_SERVO, servo)
        applyAngle(servo, degrees)
    }

    /**
     * Turns the servo off (it goes floppy). Micro motors stop.
     * @param servo the servo channel, eg: SteamplayServo.S1
     */
    //% blockId=steamplay_servo_off
    //% block="turn off servo $servo"
    //% group="Servos" weight=95
    export function servoOff(servo: SteamplayServo): void {
        setup()
        steamplayMotion.cancel(steamplayMotion.KIND_SERVO, servo)
        applyOff(servo)
    }

    /**
     * Moves the servo smoothly to an angle over this many seconds.
     * @param servo the servo channel, eg: SteamplayServo.S1
     * @param degrees the angle to move to, eg: 90
     * @param seconds how long the move takes, eg: 2
     * @param dontWait let the code carry on while it moves, eg: false
     */
    //% blockId=steamplay_servo_move
    //% block="move servo $servo to $degrees ° over $seconds s||and don't wait $dontWait"
    //% degrees.min=0 degrees.max=180 degrees.defl=90 seconds.min=0 seconds.max=60 seconds.defl=2
    //% dontWait.shadow="toggleYesNo"
    //% expandableArgumentMode="toggle"
    //% group="Servos" weight=90
    export function moveServo(servo: SteamplayServo, degrees: number, seconds: number, dontWait?: boolean): void {
        setup()
        if (isFollower(servo)) return
        const i = ch(servo)
        const id = steamplayMotion.start(steamplayMotion.KIND_SERVO, servo, angle[i], degrees, seconds, 0, 0, false)
        if (!dontWait) steamplayMotion.waitFor(id)
    }

    /**
     * Wiggles the servo either side of where it is, then back. Very short times make
     * a smaller wiggle, because the servo can't move that fast.
     * @param servo the servo channel, eg: SteamplayServo.S1
     * @param degrees how far each side, eg: 20
     * @param times how many wiggles, eg: 3
     * @param seconds how long each wiggle takes, eg: 0.5
     * @param dontWait let the code carry on while it wiggles, eg: false
     */
    //% blockId=steamplay_servo_wiggle
    //% block="wiggle servo $servo by $degrees ° $times times, each wiggle $seconds s||and don't wait $dontWait"
    //% degrees.min=0 degrees.max=90 degrees.defl=20 times.min=1 times.max=50 times.defl=3
    //% seconds.min=0.1 seconds.max=10 seconds.defl=0.5
    //% dontWait.shadow="toggleYesNo"
    //% expandableArgumentMode="toggle"
    //% group="Servos" weight=85
    export function wiggleServo(servo: SteamplayServo, degrees: number, times: number, seconds: number, dontWait?: boolean): void {
        setup()
        if (isFollower(servo)) return
        const i = ch(servo)
        const n = Math.max(1, Math.round(times))
        const id = steamplayMotion.start(steamplayMotion.KIND_WIGGLE, servo, angle[i], angle[i], n * seconds, degrees, n, false)
        if (!dontWait) steamplayMotion.waitFor(id)
    }

    /**
     * Keeps this servo between two angles, to protect your build. Every block for
     * this servo stays inside the range. Put in on start.
     * @param servo the servo channel, eg: SteamplayServo.S1
     * @param low smallest angle, eg: 20
     * @param high biggest angle, eg: 160
     */
    //% blockId=steamplay_servo_limit
    //% block="limit servo $servo to $low - $high °"
    //% low.min=0 low.max=180 low.defl=20 high.min=0 high.max=180 high.defl=160
    //% group="Servos" weight=80
    export function limitServo(servo: SteamplayServo, low: number, high: number): void {
        setup()
        const i = ch(servo)
        limitLo[i] = Math.max(0, Math.min(low, high))
        limitHi[i] = Math.min(180, Math.max(low, high))
    }

    // ---------------------------------------------------------------
    // Blocks: micro motors (continuous-rotation servos)
    // ---------------------------------------------------------------

    /**
     * Sets a micro motor's speed: 100 full forward, 0 stop, -100 full reverse.
     * @param servo the servo channel, eg: SteamplayServo.S1
     * @param percent the speed, eg: 50
     */
    //% blockId=steamplay_micro_speed
    //% block="set micro motor $servo speed $percent \\%"
    //% percent.min=-100 percent.max=100 percent.defl=50
    //% group="Micro motors" weight=70
    export function setMicroMotor(servo: SteamplayServo, percent: number): void {
        setup()
        if (isFollower(servo)) return
        steamplayMotion.cancel(steamplayMotion.KIND_MICRO, servo)
        applySpeed(servo, percent)
    }

    /**
     * Stops a micro motor by cutting its signal, which reliably stops most motors.
     * @param servo the servo channel, eg: SteamplayServo.S1
     */
    //% blockId=steamplay_micro_stop
    //% block="stop micro motor $servo"
    //% group="Micro motors" weight=68
    export function stopMicroMotor(servo: SteamplayServo): void {
        servoOff(servo)
    }

    /**
     * Ramps a micro motor to a speed over this many seconds.
     * @param servo the servo channel, eg: SteamplayServo.S1
     * @param percent the speed to reach, eg: 80
     * @param seconds how long the ramp takes, eg: 1
     * @param dontWait let the code carry on during the ramp, eg: false
     */
    //% blockId=steamplay_micro_ramp
    //% block="ramp micro motor $servo to speed $percent \\% over $seconds s||and don't wait $dontWait"
    //% percent.min=-100 percent.max=100 percent.defl=80 seconds.min=0 seconds.max=60 seconds.defl=1
    //% dontWait.shadow="toggleYesNo"
    //% expandableArgumentMode="toggle"
    //% group="Micro motors" weight=66
    export function rampMicroMotor(servo: SteamplayServo, percent: number, seconds: number, dontWait?: boolean): void {
        setup()
        if (isFollower(servo)) return
        const id = steamplayMotion.start(steamplayMotion.KIND_MICRO, servo, speed[ch(servo)], percent, seconds, 0, 0, false)
        if (!dontWait) steamplayMotion.waitFor(id)
    }

    /**
     * Slows a micro motor to a stop over this many seconds, then cuts its signal.
     * @param servo the servo channel, eg: SteamplayServo.S1
     * @param seconds how long the ramp takes, eg: 1
     * @param dontWait let the code carry on during the ramp, eg: false
     */
    //% blockId=steamplay_micro_ramp_off
    //% block="ramp micro motor $servo off over $seconds s||and don't wait $dontWait"
    //% seconds.min=0 seconds.max=60 seconds.defl=1
    //% dontWait.shadow="toggleYesNo"
    //% expandableArgumentMode="toggle"
    //% group="Micro motors" weight=64
    export function rampMicroMotorOff(servo: SteamplayServo, seconds: number, dontWait?: boolean): void {
        setup()
        if (isFollower(servo)) return
        const id = steamplayMotion.start(steamplayMotion.KIND_MICRO, servo, speed[ch(servo)], 0, seconds, 0, 0, true)
        if (!dontWait) steamplayMotion.waitFor(id)
    }

    /**
     * Swaps forwards and backwards for this micro motor.
     * @param servo the servo channel, eg: SteamplayServo.S1
     */
    //% blockId=steamplay_micro_reverse
    //% block="reverse micro motor $servo direction"
    //% group="Micro motors" weight=62
    export function reverseMicroMotor(servo: SteamplayServo): void {
        setup()
        const i = ch(servo)
        flip[i] = -flip[i]
        if (isMicro[i] && speed[i] != 0) applySpeed(servo, speed[i])
    }

    /**
     * Fixes a micro motor that creeps when it should stop. Change the number a little
     * at a time until speed 0 stops it. Tip: put in on start.
     * @param servo the servo channel, eg: SteamplayServo.S1
     * @param offset stop point adjustment, eg: 0
     */
    //% blockId=steamplay_micro_calibrate
    //% block="calibrate micro motor $servo stop point $offset"
    //% offset.min=-20 offset.max=20 offset.defl=0
    //% group="Micro motors" weight=60
    export function calibrateMicroMotor(servo: SteamplayServo, offset: number): void {
        setup()
        const i = ch(servo)
        trim[i] = Math.max(-20, Math.min(20, offset))
        if (isMicro[i]) applySpeed(servo, speed[i])
    }

    // ---------------------------------------------------------------
    // Blocks: mirroring
    // ---------------------------------------------------------------

    /**
     * Makes servo B follow servo A. Copy: same angle or speed. Mirror: the opposite
     * (30° becomes 150°, speed 50 becomes -50). B ignores its own blocks until you stop mirroring.
     * @param mode mirror or copy, eg: SteamplayFollow.Mirror
     * @param leader the servo to follow, eg: SteamplayServo.S1
     * @param follower the servo that follows, eg: SteamplayServo.S2
     */
    //% blockId=steamplay_servo_mirror
    //% block="$mode servo $leader to servo $follower"
    //% leader.defl=SteamplayServo.S1 follower.defl=SteamplayServo.S2
    //% group="Mirror" weight=50
    export function mirrorServo(mode: SteamplayFollow, leader: SteamplayServo, follower: SteamplayServo): void {
        setup()
        if (leader == follower) return
        const j = ch(follower)
        follows[j] = leader
        followMode[j] = mode
        // Jump to match the leader now.
        const i = ch(leader)
        if (isMicro[i]) applySpeed(leader, speed[i])
        else applyAngle(leader, angle[i])
    }

    /**
     * Servo goes back to following its own blocks.
     * @param follower the servo to release, eg: SteamplayServo.S2
     */
    //% blockId=steamplay_servo_unmirror
    //% block="stop mirroring servo $follower"
    //% follower.defl=SteamplayServo.S2
    //% group="Mirror" weight=49
    export function stopMirroring(follower: SteamplayServo): void {
        setup()
        follows[ch(follower)] = 0
    }

    // ---------------------------------------------------------------
    // Blocks: wait and stop
    // ---------------------------------------------------------------

    /**
     * Waits until this servo or micro motor finishes its move, wiggle or ramp.
     * @param servo the servo channel, eg: SteamplayServo.S1
     */
    //% blockId=steamplay_servo_wait
    //% block="wait until servo $servo finishes"
    //% group="Wait and stop" weight=40
    export function waitForServo(servo: SteamplayServo): void {
        steamplayMotion.waitForChannel(steamplayMotion.KIND_SERVO, servo)
    }

    /**
     * Waits until every motor, micro motor and servo has finished moving.
     */
    //% blockId=steamplay_servo_wait_all
    //% block="wait until all motors and servos finish"
    //% group="Wait and stop" weight=39
    export function waitForAll(): void {
        steamplayMotion.waitForAll()
    }

    /**
     * Stops every motor and turns off every servo. Your program keeps running
     * (unlike the emergency stop).
     */
    //% blockId=steamplay_servo_stop_all
    //% block="stop all motors and servos"
    //% group="Wait and stop" weight=38
    export function stopAll(): void {
        steamplayCore.stopAllMotion()
    }

    // ---------------------------------------------------------------
    // Blocks: settings (Kitronik's)
    // ---------------------------------------------------------------

    /**
     * Use if your servos don't reach the right angles: try small changes until
     * 90 is really the middle. (Kitronik's block.)
     * @param change, eg: -13
     */
    //% blockId=steamplay_servo_adjust
    //% block="adjust servos by $change"
    //% change.min=-25 change.max=25
    //% group="Settings" weight=20
    export function adjustServos(change: number): void {
        setup()
        PrescaleVal = 0x7D + change
        secretIncantation()
    }

    /** Kitronik's pulse trims, for advanced users (no blocks). */
    export function TrimServoMultiplier(value: number) {
        ServoMultiplier = Math.max(113, Math.min(226, value))
    }
    export function TrimServoZeroOffset(value: number) {
        ServoZeroOffset = Math.max(0x66, Math.min(0xCC, value))
    }

    /** Used by "stop all": turn every servo off. */
    export function _allOff() {
        allOff()
    }
}
