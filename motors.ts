/**
 * STEAMplay Motors: the Kitronik Compact Motor Driver Board (5698), plus signed speeds,
 * ramps, mirroring and simple car driving.
 *
 * Includes the original Kitronik motor driver code (pxt-kitronik-motor-driver,
 * MIT licence, Copyright (c) 2017 Kitronik Ltd).
 * Motor 1 uses P8 and P12, Motor 2 uses P0 and P16.
 */

/** Motors on the motor driver board. */
enum SteamplayMotor {
    //% block="1"
    M1 = 1,
    //% block="2"
    M2 = 2
}

/** Kitronik's motor directions. */
enum SteamplayMotorDirection {
    //% block="forward"
    Forward = 0,
    //% block="reverse"
    Reverse = 1
}

/** Which way a motor spins in the drive setup: + speed or - speed. */
enum SteamplayTurn {
    //% block="clockwise (+)"
    Forwards = 1,
    //% block="anticlockwise (-)"
    Backwards = -1
}

/** Where to drive. */
enum SteamplayDrive {
    //% block="forward"
    Forward = 0,
    //% block="backward"
    Backward = 1,
    //% block="left"
    Left = 2,
    //% block="right"
    Right = 3
}

/**
 * Kitronik motor board, ramps, mirroring and car driving.
 */
//% color="#CB6926" weight=99 icon="\uf1b9" block="STEAMplay Motors"
//% groups=['Motors', 'Driving', 'Mirror', 'Stepper', 'Wait and stop', 'Settings']
namespace steamplayMotors {
    // ---------------------------------------------------------------
    // Kitronik's motor code
    // ---------------------------------------------------------------
    let stepperState = 0
    let stepSequence: SteamplayMotorDirection[] = [SteamplayMotorDirection.Forward, SteamplayMotorDirection.Reverse, SteamplayMotorDirection.Reverse, SteamplayMotorDirection.Forward]
    export let stepperSteps = 200

    function kOn(motor: number, dir: number, percent: number) {
        const out = Math.clamp(0, 100, percent) * 10
        if (motor == 1) {
            if (dir == SteamplayMotorDirection.Forward) {
                pins.analogWritePin(AnalogPin.P8, out)
                pins.digitalWritePin(DigitalPin.P12, 0)
            } else {
                pins.analogWritePin(AnalogPin.P12, out)
                pins.digitalWritePin(DigitalPin.P8, 0)
            }
        } else {
            if (dir == SteamplayMotorDirection.Forward) {
                pins.analogWritePin(AnalogPin.P0, out)
                pins.digitalWritePin(DigitalPin.P16, 0)
            } else {
                pins.analogWritePin(AnalogPin.P16, out)
                pins.digitalWritePin(DigitalPin.P0, 0)
            }
        }
    }

    function kOff(motor: number) {
        if (motor == 1) {
            pins.digitalWritePin(DigitalPin.P8, 0)
            pins.digitalWritePin(DigitalPin.P12, 0)
        } else {
            pins.digitalWritePin(DigitalPin.P0, 0)
            pins.digitalWritePin(DigitalPin.P16, 0)
        }
    }

    // ---------------------------------------------------------------
    // STEAMplay state (index 0 = motor 1, 1 = motor 2)
    // ---------------------------------------------------------------
    let speed = [0, 0]
    let flip = [1, 1]
    let follows = [0, 0]       // the motor this one follows, or 0
    let followMode = [0, 0]
    let forwardDir = [1, 1]    // drive setup: which way each motor turns for "forward"
    let leftDir = [-1, 1]      // drive setup: which way each motor turns to spin left
    let setUp = false
    let auto = [false, false]  // moved by an "on music" block: put back when the music ends
    let autoSpeed = [0, 0]

    function musicGuard(i: number): boolean {
        if (!steamplayCore.inMusicMove()) return true
        if (steamplayCore.musicNow() == 0) return false
        if (!auto[i]) { auto[i] = true; autoSpeed[i] = speed[i] }
        return true
    }

    function setup() {
        if (setUp) return
        setUp = true
        steamplayCore.onMusicChange(function (started: boolean, m: number) {
            if (!started) for (let i = 0; i < 2; i++) {
                if (!auto[i]) continue
                auto[i] = false
                steamplayMotion.cancel(steamplayMotion.KIND_MOTOR, i + 1)
                if (autoSpeed[i] == 0) applyOff(i + 1)
                else applySpeed(i + 1, autoSpeed[i])
            }
        })
        // Motor pins: sound on P0 is switched off so music can't twitch Motor 2.
        steamplayCore.claimPin(DigitalPin.P8, "motors")
        steamplayCore.claimPin(DigitalPin.P12, "motors")
        steamplayCore.claimPin(DigitalPin.P0, "motors")
        steamplayCore.claimPin(DigitalPin.P16, "motors")
        steamplayMotion.setApplier(steamplayMotion.KIND_MOTOR, applySpeed, applyOff)
        steamplayCore.addStopHandler(function () { allOff() })
        steamplayCore.addMotionStopHandler(function () { allOff() })
    }

    function writeSpeed(motor: number, s: number) {
        const i = motor - 1
        const v = Math.max(-100, Math.min(100, s)) * flip[i]
        if (v == 0) kOff(motor)
        else kOn(motor, v > 0 ? SteamplayMotorDirection.Forward : SteamplayMotorDirection.Reverse, Math.abs(v))
    }

    function applySpeed(motor: number, s: number) {
        if (!musicGuard(motor - 1)) return
        speed[motor - 1] = s
        writeSpeed(motor, s)
        const other = motor == 1 ? 2 : 1
        if (follows[other - 1] == motor) {
            const fs = followMode[other - 1] == SteamplayFollow.Mirror ? -s : s
            speed[other - 1] = fs
            writeSpeed(other, fs)
        }
    }

    function applyOff(motor: number) {
        if (!musicGuard(motor - 1)) return
        speed[motor - 1] = 0
        kOff(motor)
        const other = motor == 1 ? 2 : 1
        if (follows[other - 1] == motor) { speed[other - 1] = 0; kOff(other) }
    }

    function allOff() {
        steamplayMotion.cancelAll()
        if (!setUp) return
        speed[0] = 0; speed[1] = 0
        kOff(1); kOff(2)
    }

    function isFollower(motor: number): boolean {
        return follows[motor - 1] != 0
    }

    // ---------------------------------------------------------------
    // Blocks: motors
    // ---------------------------------------------------------------

    /**
     * Sets a motor's speed: 100 full forward, 0 stop, -100 full reverse.
     * @param motor the motor, eg: SteamplayMotor.M1
     * @param percent the speed, eg: 50
     */
    //% blockId=steamplay_motor_speed
    //% block="set motor $motor speed $percent \\%"
    //% percent.min=-100 percent.max=100 percent.defl=50
    //% group="Motors" weight=100
    export function setMotor(motor: SteamplayMotor, percent: number): void {
        setup()
        if (isFollower(motor)) return
        steamplayMotion.cancel(steamplayMotion.KIND_MOTOR, motor)
        applySpeed(motor, percent)
    }

    /**
     * Turns a motor on in a direction at a speed (0 to 100). (Kitronik's block.)
     * @param motor the motor, eg: SteamplayMotor.M1
     * @param dir which way, eg: SteamplayMotorDirection.Forward
     * @param percent how fast, eg: 50
     */
    //% blockId=steamplay_motor_on
    //% block="motor $motor on direction $dir speed $percent"
    //% percent.min=0 percent.max=100 percent.defl=50
    //% group="Motors" weight=98
    export function motorOn(motor: SteamplayMotor, dir: SteamplayMotorDirection, percent: number): void {
        setMotor(motor, dir == SteamplayMotorDirection.Forward ? Math.abs(percent) : -Math.abs(percent))
    }

    /**
     * Turns a motor off. (Kitronik's block.)
     * @param motor the motor, eg: SteamplayMotor.M1
     */
    //% blockId=steamplay_motor_off
    //% block="turn off motor $motor"
    //% group="Motors" weight=96
    export function motorOff(motor: SteamplayMotor): void {
        setup()
        steamplayMotion.cancel(steamplayMotion.KIND_MOTOR, motor)
        applyOff(motor)
    }

    /**
     * Ramps a motor to a speed over this many seconds (passes through stop if it changes direction).
     * @param motor the motor, eg: SteamplayMotor.M1
     * @param percent the speed to reach, eg: 80
     * @param seconds how long the ramp takes, eg: 1
     * @param wait yes = wait until it finishes (the default), no = carry on straight away, eg: true
     */
    //% blockId=steamplay_motor_ramp
    //% inlineInputMode=inline
    //% block="ramp motor $motor to speed $percent \\% over $seconds s||and wait $wait"
    //% percent.min=-100 percent.max=100 percent.defl=80 seconds.min=0 seconds.max=60 seconds.defl=1
    //% wait.shadow="toggleYesNo" wait.defl=true
    //% expandableArgumentMode="toggle"
    //% group="Motors" weight=94
    export function rampMotor(motor: SteamplayMotor, percent: number, seconds: number, wait?: boolean): void {
        setup()
        if (!musicGuard(motor - 1)) return
        if (isFollower(motor)) return
        const id = steamplayMotion.start(steamplayMotion.KIND_MOTOR, motor, speed[motor - 1], percent, seconds, 0, 0, false)
        if (wait !== false) steamplayMotion.waitFor(id)
    }

    /**
     * Slows a motor to a stop over this many seconds.
     * @param motor the motor, eg: SteamplayMotor.M1
     * @param seconds how long the ramp takes, eg: 1
     * @param wait yes = wait until it finishes (the default), no = carry on straight away, eg: true
     */
    //% blockId=steamplay_motor_ramp_off
    //% inlineInputMode=inline
    //% block="ramp motor $motor off over $seconds s||and wait $wait"
    //% seconds.min=0 seconds.max=60 seconds.defl=1
    //% wait.shadow="toggleYesNo" wait.defl=true
    //% expandableArgumentMode="toggle"
    //% group="Motors" weight=92
    export function rampMotorOff(motor: SteamplayMotor, seconds: number, wait?: boolean): void {
        setup()
        if (!musicGuard(motor - 1)) return
        if (isFollower(motor)) return
        const id = steamplayMotion.start(steamplayMotion.KIND_MOTOR, motor, speed[motor - 1], 0, seconds, 0, 0, true)
        if (wait !== false) steamplayMotion.waitFor(id)
    }

    /**
     * Swaps forwards and backwards for this motor (instead of swapping its wires).
     * @param motor the motor, eg: SteamplayMotor.M1
     */
    //% blockId=steamplay_motor_reverse
    //% block="reverse motor $motor direction"
    //% group="Motors" weight=90
    export function reverseMotor(motor: SteamplayMotor): void {
        setup()
        flip[motor - 1] = -flip[motor - 1]
        if (speed[motor - 1] != 0) writeSpeed(motor, speed[motor - 1])
    }

    // ---------------------------------------------------------------
    // Blocks: driving a car
    // ---------------------------------------------------------------

    /**
     * Put in on start. Which motor is each wheel, and which way it spins (+ or -) to make the car go forward.
     * Wheels on opposite sides usually need one + and one -. Goes backward? Flip both. Spins in a circle? Flip one.
     * @param left the left wheel's motor, eg: SteamplayMotor.M1
     * @param dl its direction for forward, eg: SteamplayTurn.Forwards
     * @param right the right wheel's motor, eg: SteamplayMotor.M2
     * @param dr its direction for forward, eg: SteamplayTurn.Forwards
     */
    //% blockId=steamplay_drive_setup
    //% block="drive setup: to go forward, left wheel motor $left spins $dl and right wheel motor $right spins $dr"
    //% left.defl=SteamplayMotor.M1 right.defl=SteamplayMotor.M2
    //% inlineInputMode=inline
    //% group="Driving" weight=81
    export function setupDrive(left: SteamplayMotor, dl: SteamplayTurn, right: SteamplayMotor, dr: SteamplayTurn): void {
        if (left == right) return
        forwardDir[left - 1] = dl
        forwardDir[right - 1] = dr
        // Spinning left = the left wheel goes backwards, the right wheel forwards.
        leftDir[left - 1] = -dl
        leftDir[right - 1] = dr
    }

    /**
     * Drive setup, part 1: which way each motor turns to drive your car forward.
     * Test your car and change these until "drive forward" goes forward. Put in on start.
     * @param m1 motor 1, eg: SteamplayTurn.Forwards
     * @param m2 motor 2, eg: SteamplayTurn.Forwards
     */
    //% blockId=steamplay_drive_setup_forward
    //% deprecated=true
    //% block="drive setup: forward is motor 1 $m1 motor 2 $m2"
    //% group="Driving" weight=80
    export function setupForward(m1: SteamplayTurn, m2: SteamplayTurn): void {
        forwardDir[0] = m1
        forwardDir[1] = m2
    }

    /**
     * Drive setup, part 2: which way each motor turns to spin your car left.
     * Change these until "drive left" turns left. Put in on start.
     * @param m1 motor 1, eg: SteamplayTurn.Backwards
     * @param m2 motor 2, eg: SteamplayTurn.Forwards
     */
    //% blockId=steamplay_drive_setup_left
    //% deprecated=true
    //% block="drive setup: left is motor 1 $m1 motor 2 $m2"
    //% group="Driving" weight=79
    export function setupLeft(m1: SteamplayTurn, m2: SteamplayTurn): void {
        leftDir[0] = m1
        leftDir[1] = m2
    }

    /** The two motor speeds for a drive command. */
    function driveSpeeds(dir: SteamplayDrive, percent: number, radius: number): number[] {
        const p = Math.max(0, Math.min(100, Math.abs(percent)))
        if (dir == SteamplayDrive.Forward) return [p * forwardDir[0], p * forwardDir[1]]
        if (dir == SteamplayDrive.Backward) return [-p * forwardDir[0], -p * forwardDir[1]]
        // Turning: the inner motor is the one that goes the other way when spinning left.
        let innerLeft = 0
        if (leftDir[0] == forwardDir[0] && leftDir[1] != forwardDir[1]) innerLeft = 1
        const inner = dir == SteamplayDrive.Left ? innerLeft : 1 - innerLeft
        const outer = 1 - inner
        // radius 0 = spin on the spot, 50 = pivot on the inner wheel, 100 = wide curve
        const r = Math.max(0, Math.min(100, radius))
        const innerFactor = r <= 50 ? (r - 50) / 50 : 0.8 * (r - 50) / 50
        const out = [0, 0]
        out[outer] = p * forwardDir[outer]
        out[inner] = p * innerFactor * forwardDir[inner]
        return out
    }

    /**
     * Drives your car. Radius: 0 spins on the spot, 50 pivots on one wheel, 100 makes a wide curve.
     * Uses the drive setup block.
     * @param dir where to drive, eg: SteamplayDrive.Forward
     * @param percent how fast, eg: 50
     * @param radius how wide the turn is, eg: 50
     */
    //% blockId=steamplay_drive
    //% block="drive $dir $percent \\% radius $radius"
    //% percent.min=0 percent.max=100 percent.defl=50 radius.min=0 radius.max=100 radius.defl=50
    //% group="Driving" weight=78
    export function drive(dir: SteamplayDrive, percent: number, radius: number): void {
        setup()
        const sp = driveSpeeds(dir, percent, radius)
        steamplayMotion.cancel(steamplayMotion.KIND_MOTOR, 1)
        steamplayMotion.cancel(steamplayMotion.KIND_MOTOR, 2)
        applySpeed(1, sp[0])
        if (!isFollower(2)) applySpeed(2, sp[1])
    }

    /**
     * Ramps your car smoothly into a drive over this many seconds.
     * @param dir where to drive, eg: SteamplayDrive.Forward
     * @param percent how fast, eg: 80
     * @param radius how wide the turn is, eg: 50
     * @param seconds how long the ramp takes, eg: 1
     * @param wait yes = wait until it finishes (the default), no = carry on straight away, eg: true
     */
    //% blockId=steamplay_drive_ramp
    //% inlineInputMode=inline
    //% block="ramp drive $dir to $percent \\% radius $radius over $seconds s||and wait $wait"
    //% percent.min=0 percent.max=100 percent.defl=80 radius.min=0 radius.max=100 radius.defl=50
    //% seconds.min=0 seconds.max=60 seconds.defl=1
    //% wait.shadow="toggleYesNo" wait.defl=true
    //% expandableArgumentMode="toggle"
    //% group="Driving" weight=77
    export function rampDrive(dir: SteamplayDrive, percent: number, radius: number, seconds: number, wait?: boolean): void {
        setup()
        if (!musicGuard(0) || !musicGuard(1)) return
        const sp = driveSpeeds(dir, percent, radius)
        const a = steamplayMotion.start(steamplayMotion.KIND_MOTOR, 1, speed[0], sp[0], seconds, 0, 0, false)
        let b = -1
        if (!isFollower(2)) b = steamplayMotion.start(steamplayMotion.KIND_MOTOR, 2, speed[1], sp[1], seconds, 0, 0, false)
        if (wait !== false) {
            steamplayMotion.waitFor(a)
            if (b >= 0) steamplayMotion.waitFor(b)
        }
    }

    // ---------------------------------------------------------------
    // Blocks: mirroring
    // ---------------------------------------------------------------

    /**
     * The first motor follows the second. Copy: same speed. Mirror: opposite speed.
     * The follower ignores its own blocks until you stop mirroring.
     * @param mode mirror or copy, eg: SteamplayFollow.Mirror
     * @param leader the motor to follow, eg: SteamplayMotor.M1
     * @param follower the motor that follows, eg: SteamplayMotor.M2
     */
    //% blockId=steamplay_motor_mirror
    //% block="$mode motor $follower to motor $leader"
    //% leader.defl=SteamplayMotor.M1 follower.defl=SteamplayMotor.M2
    //% group="Mirror" weight=60
    export function mirrorMotor(mode: SteamplayFollow, leader: SteamplayMotor, follower: SteamplayMotor): void {
        setup()
        if (leader == follower) return
        follows[follower - 1] = leader
        followMode[follower - 1] = mode
        follows[leader - 1] = 0
        applySpeed(leader, speed[leader - 1])
    }

    /**
     * The motor goes back to following its own blocks.
     * @param follower the motor to release, eg: SteamplayMotor.M2
     */
    //% blockId=steamplay_motor_unmirror
    //% block="stop mirroring motor $follower"
    //% follower.defl=SteamplayMotor.M2
    //% group="Mirror" weight=59
    export function stopMirroring(follower: SteamplayMotor): void {
        follows[follower - 1] = 0
    }

    // ---------------------------------------------------------------
    // Blocks: stepper (Kitronik's)
    // ---------------------------------------------------------------

    /**
     * Turns a stepper motor (wired to both motor outputs) by an angle. (Kitronik's block.)
     * @param dir which way, eg: SteamplayMotorDirection.Forward
     * @param angle how far, eg: 90
     */
    //% blockId=steamplay_stepper_angle
    //% block="stepper turn $dir $angle degrees"
    //% angle.min=1 angle.max=360 angle.defl=90
    //% group="Stepper" weight=50
    export function stepperMotorTurnAngle(dir: SteamplayMotorDirection, angle: number): void {
        stepperMotorTurnSteps(dir, pins.map(angle, 1, 360, 1, stepperSteps))
    }

    /**
     * Turns a stepper motor a number of steps. (Kitronik's block.)
     * @param dir which way, eg: SteamplayMotorDirection.Forward
     * @param steps how many steps, eg: 50
     */
    //% blockId=steamplay_stepper_steps
    //% block="stepper turn $dir $steps steps"
    //% steps.defl=50
    //% group="Stepper" weight=49
    export function stepperMotorTurnSteps(dir: SteamplayMotorDirection, steps: number): void {
        setup()
        let stepCount = 0
        while (stepCount < steps) {
            if (dir == SteamplayMotorDirection.Forward) stepperState++
            else stepperState--
            if (stepperState > 3) stepperState = 0
            if (stepperState < 0) stepperState = 3
            if (stepperState % 2 == 0) {
                kOn(1, stepSequence[stepperState], 100)
                kOff(2)
            } else {
                kOn(2, stepSequence[stepperState], 100)
                kOff(1)
            }
            stepCount++
            basic.pause(50)
        }
    }

    /**
     * How many steps your stepper motor takes for one full turn. (Kitronik's block.)
     * @param steps steps per turn, eg: 200
     */
    //% blockId=steamplay_stepper_setup
    //% block="stepper has $steps steps in one full rotation"
    //% steps.defl=200
    //% group="Settings" weight=20
    export function setStepperMotorSteps(steps: number): void {
        stepperSteps = steps
    }

    // ---------------------------------------------------------------
    // Blocks: wait and stop
    // ---------------------------------------------------------------

    /**
     * Waits until this motor finishes its ramp.
     * @param motor the motor, eg: SteamplayMotor.M1
     */
    //% blockId=steamplay_motor_wait
    //% block="wait until motor $motor finishes"
    //% group="Wait and stop" weight=40
    export function waitForMotor(motor: SteamplayMotor): void {
        steamplayMotion.waitForChannel(steamplayMotion.KIND_MOTOR, motor)
    }

    /**
     * Waits until every motor, micro motor and servo has finished moving.
     */
    //% blockId=steamplay_motor_wait_all
    //% block="wait until all motors and servos finish"
    //% group="Wait and stop" weight=39
    export function waitForAll(): void {
        steamplayMotion.waitForAll()
    }

    /**
     * Stops every motor and turns off every servo. Your program keeps running
     * (unlike the emergency stop).
     */
    //% blockId=steamplay_motor_stop_all
    //% block="stop all motors and servos"
    //% group="Wait and stop" weight=38
    export function stopAll(): void {
        steamplayCore.stopAllMotion()
    }
}
