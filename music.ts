/**
 * STEAMPlay Music: sound effects, short songs, a band for 2–3 micro:bits,
 * and lights that follow the music.
 *
 * All tunes are original sounds or our own simple versions of out-of-copyright
 * melodies. One sound plays at a time: a new sound replaces the one playing.
 */

/** STEAMPlay sound effects. */
enum SteamplaySound {
    //% block="goal"
    Goal = 0,
    //% block="mission complete"
    MissionComplete = 1,
    //% block="boot-up"
    BootUp = 2,
    //% block="horn"
    Horn = 3,
    //% block="horn 1"
    Horn1 = 4,
    //% block="horn 2"
    Horn2 = 5,
    //% block="countdown"
    Countdown = 6,
    //% block="uh-oh"
    UhOh = 7,
    //% block="yes"
    Yes = 8,
    //% block="alarm"
    Alarm = 9
}

/** STEAMPlay songs (short snippets, 5–10 s). */
enum SteamplaySong {
    //% block="Waltzing Matilda"
    WaltzingMatilda = 0,
    //% block="William Tell gallop"
    WilliamTell = 1,
    //% block="Hall of the Mountain King"
    MountainKing = 2,
    //% block="Can-Can"
    CanCan = 3,
    //% block="Flight of the Bumblebee"
    Bumblebee = 4,
    //% block="When the Saints Go Marching In"
    Saints = 5,
    //% block="anthem: Advance Australia Fair"
    AdvanceAustraliaFair = 6,
    //% block="anthem: God Save the King"
    GodSaveTheKing = 7,
    //% block="anthem: The Star-Spangled Banner"
    StarSpangledBanner = 8,
    //% block="anthem: La Marseillaise"
    Marseillaise = 9,
    //% block="anthem: O Canada"
    OCanada = 10,
    //% block="Halloween: Toccata and Fugue"
    Toccata = 11,
    //% block="Halloween: Funeral March of a Marionette"
    FuneralMarch = 12,
    //% block="Halloween: Danse Macabre"
    DanseMacabre = 13,
    //% block="Christmas: Jingle Bells"
    JingleBells = 14,
    //% block="Christmas: Deck the Halls"
    DeckTheHalls = 15,
    //% block="Christmas: We Wish You a Merry Christmas"
    WeWishYou = 16,
    //% block="Christmas: Silent Night"
    SilentNight = 17,
    //% block="Easter: Hot Cross Buns"
    HotCrossBuns = 18,
    //% block="solstice: Sumer Is Icumen In"
    Sumer = 19
}

/** Songs for the band: each micro:bit plays one part. */
enum SteamplayBandSong {
    //% block="Frère Jacques (round)"
    FrereJacques = 0,
    //% block="Row, Row, Row Your Boat (round)"
    RowRow = 1,
    //% block="Sumer Is Icumen In (round)"
    Sumer = 2,
    //% block="Pachelbel's Canon"
    Canon = 3,
    //% block="Jingle Bells (3 parts)"
    JingleBells = 4
}

/** Keep going straight away, or wait for the sound to finish. */
enum SteamplayPlayMode {
    //% block="in background"
    InBackground = 0,
    //% block="until done"
    UntilDone = 1
}

/** How a light follows the music. */
enum SteamplaySyncMode {
    //% block="beat"
    Beat = 0,
    //% block="every note"
    EveryNote = 1,
    //% block="high notes"
    HighNotes = 2,
    //% block="low notes"
    LowNotes = 3,
    //% block="music energy"
    Energy = 4,
    //% block="microphone (V2)"
    Microphone = 5
}

/**
 * Sound effects, songs, a band and light shows.
 */
//% color="#CB6926" weight=108 icon="" block="STEAMPlay Music"
//% groups=['Sounds', 'Songs', 'Band', 'Light sync']
namespace steamplayMusic {
    // ---------------------------------------------------------------
    // Tune data
    // ---------------------------------------------------------------
    // Each tune is "bpm|sixteenths per bar|notes". A note is NAME:LENGTH, eg "F#5:4".
    // LENGTH is in sixteenth notes (4 = one beat). "R" is a rest. "!" marks a big moment
    // (used by "music energy" lights).

    function soundData(s: number): string {
        switch (s) {
            case 0: return "150|16|C5:1 E5:1 G5:1 !C6:3 R:1 G5:1 !C6:8"
            case 1: return "140|16|G4:2 C5:2 E5:2 G5:4 E5:2 !G5:4 !C6:8"
            case 2: return "240|16|C4:1 E4:1 G4:1 C5:1 E5:1 G5:1 !C6:6"
            case 3: return "120|16|!A4:3 R:1 !A4:6"
            case 4: return "150|16|C5:1 C5:1 C5:1 F5:2 R:1 !A5:3 R:3 C5:1 C5:1 C5:1 F5:2 R:1 !A5:6"
            case 5: return "150|16|G5:2 E5:2 C5:4 C5:4 C5:2 D5:2 E5:2 F5:2 G5:4 G5:4 G5:4 !E5:6"
            case 6: return "120|16|C5:2 R:6 C5:2 R:6 C5:2 R:6 !C6:8"
            case 7: return "120|16|E5:3 R:1 !C5:6"
            case 8: return "120|16|C5:2 R:1 !G5:5"
            case 9: return "120|16|!A5:4 E5:4 !A5:4 E5:4 !A5:4 E5:4"
        }
        return ""
    }

    function songData(s: number): string {
        switch (s) {
            case 0: return "100|16|C5:4 C5:2 B4:2 A4:4 G4:4 A4:4 A4:2 G4:2 F4:4 E4:4 G4:2 G4:2 A4:2 G4:2 F4:2 E4:2 D4:2 C4:2 D4:4 E4:4 !C4:8"
            case 1: return "130|16|G4:1 G4:1 G4:2 G4:1 G4:1 G4:2 G4:1 G4:1 C5:2 D5:2 !E5:2 G4:1 G4:1 G4:2 G4:1 G4:1 G4:2 G4:1 G4:1 C5:2 E5:2 D5:2 G4:1 G4:1 G4:2 G4:1 G4:1 G4:2 G4:1 G4:1 C5:2 D5:2 E5:2 C5:2 E5:2 !G5:2 !C6:4"
            case 2: return "120|16|A4:2 B4:2 C5:2 D5:2 E5:2 C5:2 E5:4 D#5:2 B4:2 D#5:4 D5:2 A#4:2 D5:4 A4:2 B4:2 C5:2 D5:2 E5:2 C5:2 E5:2 A5:2 G5:2 E5:2 C5:2 E5:2 !G5:8"
            case 3: return "150|16|C5:4 D5:2 F5:2 E5:2 D5:2 G5:4 G5:4 G5:2 A5:2 E5:2 F5:2 D5:4 D5:4 D5:2 F5:2 E5:2 D5:2 C5:2 !C6:2 B5:2 A5:2 G5:2 F5:2 E5:2 D5:2 !C5:4"
            case 4: return "150|16|E5:1 D#5:1 D5:1 C#5:1 D5:1 C#5:1 C5:1 B4:1 C5:1 B4:1 A#4:1 A4:1 G#4:1 G4:1 F#4:1 F4:1 E4:1 D#4:1 D4:1 C#4:1 D4:1 C#4:1 C4:1 B3:1 C4:1 B3:1 A#3:1 A3:1 G#3:1 G3:1 F#3:1 F3:1 E4:1 F4:1 E4:1 D#4:1 E4:1 F4:1 E4:1 D#4:1 E4:1 F4:1 F#4:1 G4:1 G#4:1 A4:1 A#4:1 B4:1 !E5:8"
            case 5: return "140|16|R:4 C5:4 E5:4 F5:4 !G5:16 R:4 C5:4 E5:4 F5:4 !G5:16 R:4 C5:4 E5:4 F5:4 G5:8 E5:8 C5:8 E5:8 !D5:16"
            case 6: return "100|16|D4:4 G4:4 D4:4 B4:4 G4:4 A4:4 B4:2 C5:2 !D5:8 E5:4 D5:4 C5:4 B4:4 !A4:12"
            case 7: return "90|12|G4:4 G4:4 A4:4 F#4:6 G4:2 A4:4 B4:4 B4:4 C5:4 B4:6 A4:2 G4:4 A4:4 G4:4 F#4:4 !G4:12"
            case 8: return "90|12|G4:3 E4:1 C4:4 E4:4 G4:4 !C5:8 E5:3 D5:1 C5:4 E4:4 F#4:4 !G4:8"
            case 9: return "110|16|D4:3 D4:1 G4:4 G4:4 A4:4 A4:4 !D5:6 B4:2 G4:3 G4:1 B4:3 G4:1 E4:8 C5:6 A4:2 F#4:4 !G4:12"
            case 10: return "90|16|E4:8 G4:6 G4:2 !C4:12 R:4 D4:4 E4:4 F4:4 G4:4 A4:4 !D4:12"
            case 11: return "100|16|A5:1 G5:1 !A5:10 R:4 G5:1 F5:1 E5:1 D5:1 C#5:4 !D5:12 R:4 A4:1 G4:1 A4:10 R:4 E4:4 F4:4 C#4:4 !D4:12"
            case 12: return "120|12|A4:2 D5:4 D5:2 C#5:4 D5:2 E5:4 F5:2 E5:4 D5:2 C#5:4 D5:2 E5:6 !A4:6 D5:4 D5:2 C#5:4 D5:2 E5:4 F5:2 G5:4 F5:2 E5:4 C#5:2 !D5:12"
            case 13: return "130|12|A4:4 !D#5:8 A4:4 !D#5:8 D5:4 D5:4 D5:4 D5:4 C5:2 A#4:2 C5:4 D5:4 D5:4 D5:4 D5:4 C5:2 A#4:2 C5:4 D5:4 F5:4 D5:4 C5:4 A#4:4 A4:4 !G4:12"
            case 14: return "180|16|E5:4 E5:4 E5:8 E5:4 E5:4 E5:8 E5:4 G5:4 C5:6 D5:2 !E5:16 F5:4 F5:4 F5:6 F5:2 F5:4 E5:4 E5:4 E5:2 E5:2 G5:4 G5:4 F5:4 D5:4 !C5:16"
            case 15: return "130|16|G5:6 F5:2 E5:4 D5:4 C5:4 D5:4 E5:4 C5:4 D5:2 E5:2 F5:2 D5:2 E5:6 D5:2 C5:4 B4:4 !C5:8"
            case 16: return "150|12|D4:4 G4:4 G4:2 A4:2 G4:2 F#4:2 E4:4 E4:4 E4:4 A4:4 A4:2 B4:2 A4:2 G4:2 F#4:4 D4:4 D4:4 B4:4 B4:2 C5:2 B4:2 A4:2 G4:4 E4:4 D4:2 D4:2 E4:4 A4:4 F#4:4 !G4:12"
            case 17: return "110|12|G4:6 A4:2 G4:4 E4:12 G4:6 A4:2 G4:4 E4:12 !D5:8 D5:4 B4:12 C5:8 C5:4 !G4:12"
            case 18: return "110|16|E5:4 D5:4 C5:8 E5:4 D5:4 C5:8 C5:2 C5:2 C5:2 C5:2 D5:2 D5:2 D5:2 D5:2 E5:4 D5:4 !C5:8"
            case 19: return "120|12|" + sumerMelody()
        }
        return ""
    }

    function sumerMelody(): string {
        return "C5:4 A#4:2 A4:4 A#4:2 C5:4 C5:2 C5:4 A4:2 A#4:4 G4:2 A4:4 F4:2 G4:4 E4:2 !F4:6 R:6"
    }

    // Band parts: a part list, separated by "/". Rounds use one melody and staggered entries.
    function bandData(s: number): string {
        switch (s) {
            case 0: return round("110|16|C5:4 D5:4 E5:4 C5:4 C5:4 D5:4 E5:4 C5:4 E5:4 F5:4 G5:8 E5:4 F5:4 G5:8 G5:2 A5:2 G5:2 F5:2 E5:4 C5:4 G5:2 A5:2 G5:2 F5:2 E5:4 C5:4 C5:4 G4:4 C5:8 C5:4 G4:4 !C5:8", 2, 3)
            case 1: return round("100|12|C5:6 C5:6 C5:4 D5:2 E5:6 E5:4 D5:2 E5:4 F5:2 G5:12 C6:2 C6:2 C6:2 G5:2 G5:2 G5:2 E5:2 E5:2 E5:2 C5:2 C5:2 C5:2 G5:4 F5:2 E5:4 D5:2 !C5:12", 2, 3)
            case 2: return round("120|12|" + sumerMelody(), 2, 3)
            case 3: return "80|16|F#5:4 E5:4 D5:4 C#5:4 B4:4 A4:4 B4:4 C#5:4 D5:4 C#5:4 B4:4 A4:4 G4:4 F#4:4 G4:4 E4:4 D5:2 F#5:2 A5:2 G5:2 F#5:2 D5:2 F#5:2 E5:2 D5:2 B4:2 D5:2 A5:2 G5:2 B5:2 A5:2 G5:2 R:32" +
                "/R:32 F#5:4 E5:4 D5:4 C#5:4 B4:4 A4:4 B4:4 C#5:4 D5:4 C#5:4 B4:4 A4:4 G4:4 F#4:4 G4:4 E4:4 D5:2 F#5:2 A5:2 G5:2 F#5:2 D5:2 F#5:2 E5:2 D5:2 B4:2 D5:2 A5:2 G5:2 B5:2 A5:2 G5:2" +
                "/" + repeatText("D4:4 A3:4 B3:4 F#3:4 G3:4 D3:4 G3:4 A3:4 ", 4)
            case 4: return "180|16|E5:4 E5:4 E5:8 E5:4 E5:4 E5:8 E5:4 G5:4 C5:6 D5:2 !E5:16 F5:4 F5:4 F5:6 F5:2 F5:4 E5:4 E5:4 E5:2 E5:2 E5:4 D5:4 D5:4 E5:4 D5:8 !G5:8" +
                "/C5:4 C5:4 C5:8 C5:4 C5:4 C5:8 C5:4 E5:4 G4:6 B4:2 C5:16 A4:4 A4:4 A4:6 A4:2 A4:4 G4:4 G4:4 G4:2 G4:2 G4:4 B4:4 B4:4 C5:4 B4:8 B4:8" +
                "/C4:8 G3:8 C4:8 G3:8 C4:8 G3:8 C4:8 E4:8 F3:8 C4:8 C4:8 G3:8 G3:8 D4:8 G3:8 B3:8"
        }
        return ""
    }

    function repeatText(t: string, n: number): string {
        let out = ""
        for (let i = 0; i < n; i++) out += t
        return out
    }

    /** Build a round: part k starts (k-1)*entryBars later, and all parts end together. */
    function round(tune: string, entryBars: number, parts: number): string {
        const p = tune.split("|")
        const bar = parseInt(p[1])
        let out = p[0] + "|" + p[1] + "|"
        for (let k = 0; k < parts; k++) {
            if (k > 0) out += "/"
            const before = k * entryBars * bar
            const after = (parts - 1 - k) * entryBars * bar
            if (before > 0) out += "R:" + before + " "
            out += p[2]
            if (after > 0) out += " R:" + after
        }
        return out
    }

    // ---------------------------------------------------------------
    // Parsing
    // ---------------------------------------------------------------
    // Octave 4 frequencies, C to B.
    const OCT4 = [261.63, 277.18, 293.66, 311.13, 329.63, 349.23, 369.99, 392.00, 415.30, 440.00, 466.16, 493.88]

    let tFreq: number[] = []
    let tLen: number[] = []
    let tBig: boolean[] = []
    let tBpm = 120
    let tBar = 16
    let tLow = 0
    let tHigh = 0

    function noteFreq(name: string): number {
        if (name == "R") return 0
        const letters = "C D EF G A B"
        let semi = letters.indexOf(name.charAt(0))
        if (semi < 0) return 0
        let i = 1
        if (name.charAt(1) == "#") { semi++; i = 2 }
        else if (name.charAt(1) == "b") { semi--; i = 2 }
        const octave = parseInt(name.substr(i))
        let f = OCT4[(semi + 12) % 12]
        if (semi < 0) f = f / 2
        if (semi > 11) f = f * 2
        for (let o = octave; o > 4; o--) f = f * 2
        for (let o = octave; o < 4; o++) f = f / 2
        return Math.round(f)
    }

    /** Load "bpm|bar|notes" (one part) into the tune arrays. */
    function load(tune: string) {
        const p = tune.split("|")
        tBpm = parseInt(p[0])
        tBar = parseInt(p[1])
        tFreq = []
        tLen = []
        tBig = []
        tLow = 100000
        tHigh = 0
        const tokens = p[2].split(" ")
        for (let i = 0; i < tokens.length; i++) {
            let t = tokens[i]
            if (t.length == 0) continue
            let big = false
            if (t.charAt(0) == "!") { big = true; t = t.substr(1) }
            const c = t.indexOf(":")
            if (c < 0) continue
            const f = noteFreq(t.substr(0, c))
            tFreq.push(f)
            tLen.push(parseInt(t.substr(c + 1)))
            tBig.push(big)
            if (f > 0) {
                if (f < tLow) tLow = f
                if (f > tHigh) tHigh = f
            }
        }
        if (tHigh == 0) tLow = 0
    }

    // ---------------------------------------------------------------
    // Light sync
    // ---------------------------------------------------------------
    let lightPins: number[] = []
    let lightModes: number[] = []
    let lightPeriodSet: boolean[] = []
    let micRunning = false

    function setLight(i: number, level: number) {
        const pin = lightPins[i]
        pins.analogWritePin(pin, level)
        if (!lightPeriodSet[i]) {
            // 1 kHz instead of the default 50 Hz, so lights don't flicker (or flicker on camera).
            pins.analogSetPeriod(pin, 1000)
            lightPeriodSet[i] = true
        }
    }

    function lightsAllOff() {
        for (let i = 0; i < lightPins.length; i++) {
            if (lightModes[i] != SteamplaySyncMode.Microphone) setLight(i, 0)
        }
    }

    function lightsNoteOn(f: number, big: boolean) {
        const mid = (tLow + tHigh) / 2
        for (let i = 0; i < lightPins.length; i++) {
            const m = lightModes[i]
            if (m == SteamplaySyncMode.EveryNote) setLight(i, f > 0 ? 1023 : 0)
            else if (m == SteamplaySyncMode.HighNotes) setLight(i, f > 0 && f >= mid ? 1023 : 0)
            else if (m == SteamplaySyncMode.LowNotes) setLight(i, f > 0 && f < mid ? 1023 : 0)
            else if (m == SteamplaySyncMode.Energy) {
                let level = 0
                if (big) level = 1023
                else if (f > 0) {
                    const span = tHigh - tLow
                    level = 150 + (span > 0 ? Math.round(450 * (f - tLow) / span) : 300)
                }
                setLight(i, level)
            }
        }
    }

    function lightsNoteOff() {
        for (let i = 0; i < lightPins.length; i++) {
            const m = lightModes[i]
            if (m == SteamplaySyncMode.EveryNote || m == SteamplaySyncMode.HighNotes || m == SteamplaySyncMode.LowNotes) setLight(i, 0)
        }
    }

    function lightsBeat(on: boolean) {
        for (let i = 0; i < lightPins.length; i++) {
            if (lightModes[i] == SteamplaySyncMode.Beat) setLight(i, on ? 1023 : 0)
        }
    }

    function startMicrophone() {
        if (micRunning) return
        micRunning = true
        control.inBackground(function () {
            while (true) {
                const level = input.soundLevel()   // 0–255
                for (let i = 0; i < lightPins.length; i++) {
                    if (lightModes[i] == SteamplaySyncMode.Microphone) setLight(i, Math.min(1023, level * 4))
                }
                basic.pause(20)
            }
        })
    }

    // ---------------------------------------------------------------
    // Player
    // ---------------------------------------------------------------
    let playId = 0        // bumps every time a new sound starts or music stops
    let playing = false
    let lastNote = 0
    let lastBeat = 0
    let started = false

    // Band state
    let bandSong = -1
    let bandPart = 1
    let bandBarNo = -1
    let bandBarAt = 0
    const BAND_START_DELAY_MS = 150
    const BAND_WAIT_MS = 60

    function setup() {
        if (started) return
        started = true
        steamplayCore.addStopHandler(function () { stopNow() })
    }

    function stopNow() {
        playId++
        playing = false
        music.ringTone(0)
        lightsAllOff()
    }

    function waitUntil(t: number) {
        const d = t - control.millis()
        if (d > 0) basic.pause(d)
    }

    /** Play the loaded tune. Runs in the caller's fiber. band: 0 = not a band, else part number. */
    function playLoaded(id: number, band: number) {
        playing = true
        const stepMs = 15000 / tBpm          // one sixteenth note
        const gap = Math.min(30, stepMs / 3)  // a short silence between notes
        const barMs = stepMs * tBar
        let t0 = control.millis()
        let pos = 0
        for (let n = 0; n < tFreq.length; n++) {
            if (id != playId) return
            const f = tFreq[n]
            const len = tLen[n]
            for (let s = 0; s < len; s++) {
                const step = pos + s
                // Band: keep the parts in time once per bar.
                if (band > 0 && step % tBar == 0) {
                    const barNo = step / tBar
                    if (band == 1) {
                        radio.sendValue("spbar", barNo)
                    } else if (barNo > 0) {
                        const deadline = control.millis() + BAND_WAIT_MS
                        while (bandBarNo < barNo && control.millis() < deadline) basic.pause(2)
                        if (id != playId) return
                        if (bandBarNo == barNo) t0 = bandBarAt - barNo * barMs
                    }
                }
                if (s == 0) {
                    music.ringTone(f)
                    lightsNoteOn(f, tBig[n])
                    lastNote = f
                    lastBeat = Math.idiv(step, 4) + 1
                    if (f > 0) control.raiseEvent(steamplayCore.EVENT_SRC_MUSIC, 1, EventCreationMode.CreateAndFire)
                }
                if (step % 4 == 0) lightsBeat(true)
                else if (step % 4 == 2) lightsBeat(false)
                const end = t0 + (step + 1) * stepMs
                if (s == len - 1) {
                    waitUntil(end - gap)
                    if (id != playId) return
                    music.ringTone(0)
                    lightsNoteOff()
                }
                waitUntil(end)
                if (id != playId) return
            }
            pos += len
        }
        if (id == playId) {
            playing = false
            music.ringTone(0)
            lightsAllOff()
        }
    }

    function play(tune: string, mode: number, band: number) {
        setup()
        if (tune.length == 0) return
        playId++
        const id = playId
        music.ringTone(0)
        load(tune)
        if (mode == SteamplayPlayMode.UntilDone) {
            playLoaded(id, band)
        } else {
            control.inBackground(function () { playLoaded(id, band) })
        }
    }

    // ---------------------------------------------------------------
    // Blocks: sounds and songs
    // ---------------------------------------------------------------

    /**
     * Play a STEAMPlay sound effect. A new sound replaces any sound that is playing.
     * "in background" lets your code keep going; "until done" waits for the sound to end.
     * @param sound the sound to play, eg: SteamplaySound.Goal
     * @param mode keep going or wait, eg: SteamplayPlayMode.InBackground
     */
    //% blockId=steamplay_play_sound
    //% block="play sound $sound $mode"
    //% group="Sounds" weight=100
    export function playSound(sound: SteamplaySound, mode: SteamplayPlayMode) {
        play(soundData(sound), mode, 0)
    }

    /**
     * Play a short song (5–10 s). These are our own simple versions of tunes that are
     * free to use. A new sound replaces any sound that is playing.
     * Lights set with "sync pin to music" follow the song.
     * @param song the song to play, eg: SteamplaySong.WaltzingMatilda
     * @param mode keep going or wait, eg: SteamplayPlayMode.InBackground
     */
    //% blockId=steamplay_play_song
    //% block="play song $song $mode"
    //% group="Songs" weight=90
    export function playSong(song: SteamplaySong, mode: SteamplayPlayMode) {
        play(songData(song), mode, 0)
    }

    /**
     * Stop the STEAMPlay sound or song that is playing, and turn music lights off.
     */
    //% blockId=steamplay_stop_music
    //% block="stop STEAMPlay music"
    //% group="Songs" weight=85
    export function stopMusic() {
        setup()
        stopNow()
    }

    /**
     * True while a STEAMPlay sound or song is playing.
     */
    //% blockId=steamplay_music_playing
    //% block="STEAMPlay music is playing"
    //% group="Songs" weight=84
    export function isPlaying(): boolean {
        return playing
    }

    /**
     * Run code each time a new note starts in a STEAMPlay sound, song or band part.
     * Drag out "note" (the pitch in Hz, higher = higher note) and "beat"
     * (counts 1, 2, 3… from the start) to make your own light show.
     */
    //% blockId=steamplay_on_music_note
    //% block="on music note $note beat $beat"
    //% draggableParameters="reporter"
    //% group="Light sync" weight=60
    export function onMusicNote(handler: (note: number, beat: number) => void) {
        setup()
        control.onEvent(steamplayCore.EVENT_SRC_MUSIC, 1, function () {
            handler(lastNote, lastBeat)
        })
    }

    // ---------------------------------------------------------------
    // Blocks: band
    // ---------------------------------------------------------------

    function partOf(song: number, part: number): string {
        const data = bandData(song)
        const p = data.split("|")
        const parts = p.slice(2).join("|").split("/")
        let k = Math.max(1, Math.min(parts.length, part)) - 1
        return p[0] + "|" + p[1] + "|" + parts[k]
    }

    function startBandHere() {
        if (bandSong < 0) return
        const song = bandSong
        const part = bandPart
        bandBarNo = -1
        control.inBackground(function () {
            basic.pause(BAND_START_DELAY_MS)
            play(partOf(song, part), SteamplayPlayMode.UntilDone, part)
        })
    }

    /**
     * Put this micro:bit in a band. Use it in "on start" on each micro:bit, with the
     * same song and radio group but a different part (1, 2 or 3).
     * Part 1 keeps time for everyone. The band uses the radio, so don't add your own
     * radio blocks to a band project.
     * @param song the band song, eg: SteamplayBandSong.FrereJacques
     * @param part which part this micro:bit plays, eg: 1
     * @param group radio group shared by the whole band, eg: 1
     */
    //% blockId=steamplay_join_band
    //% block="join band to play $song as part $part radio group $group"
    //% part.min=1 part.max=3 part.defl=1
    //% group.min=0 group.max=255 group.defl=1
    //% group="Band" weight=80
    export function joinBand(song: SteamplayBandSong, part: number, group: number) {
        setup()
        bandSong = song
        bandPart = Math.max(1, Math.min(3, part))
        radio.setGroup(group)
        radio.onReceivedValue(function (name: string, value: number) {
            if (name == "spgo") {
                startBandHere()
            } else if (name == "spbar") {
                bandBarNo = value
                bandBarAt = control.millis()
            }
        })
    }

    /**
     * Start the whole band playing together. Use it on any one band micro:bit,
     * eg in "on button A pressed".
     */
    //% blockId=steamplay_start_band
    //% block="start the band"
    //% group="Band" weight=79
    export function startBand() {
        setup()
        if (bandSong < 0) return
        radio.sendValue("spgo", 0)
        startBandHere()
    }

    // ---------------------------------------------------------------
    // Blocks: light sync
    // ---------------------------------------------------------------

    /**
     * Make a light on a pin follow STEAMPlay music. Wire an LED (with a resistor)
     * from the pin to GND, or switch a bigger light through a transistor (share GND).
     * Modes: beat, every note, high notes, low notes, music energy (bright at big moments),
     * or microphone (follows the room's sound, micro:bit V2).
     * Use a different pin for each light. Put this in "on start".
     * @param pin the pin for the light, eg: SteamplayPin.P1
     * @param mode how the light follows the music, eg: SteamplaySyncMode.Beat
     */
    //% blockId=steamplay_sync_pin
    //% block="sync pin $pin to music $mode"
    //% pin.defl=SteamplayPin.P1
    //% group="Light sync" weight=70
    export function syncPin(pin: SteamplayPin, mode: SteamplaySyncMode) {
        setup()
        if (!steamplayCore.claimPin(pin, "lights")) return
        let i = lightPins.indexOf(pin)
        if (i < 0) {
            lightPins.push(pin)
            lightModes.push(mode)
            lightPeriodSet.push(false)
            i = lightPins.length - 1
        } else {
            lightModes[i] = mode
        }
        setLight(i, 0)
        if (mode == SteamplaySyncMode.Microphone && steamplayCore.isV2()) startMicrophone()
    }
}
