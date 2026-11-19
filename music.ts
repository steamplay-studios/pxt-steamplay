/**
 * STEAMplay Music: sound effects, short songs, a band for 2–3 micro:bits,
 * and lights that follow the music.
 *
 * All tunes are original sounds or our own simple versions of out-of-copyright
 * melodies. One sound plays at a time: a new sound replaces the one playing.
 */

/** STEAMplay sound effects. */
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
    //% block="countdown"
    Countdown = 5,
    //% block="uh-oh"
    UhOh = 6,
    //% block="yes"
    Yes = 7,
    //% block="alarm"
    Alarm = 8,
    //% block="siren 1 (wail)"
    Siren1 = 9,
    //% block="siren 2 (hi-lo)"
    Siren2 = 10,
    //% block="siren 3 (yelp)"
    Siren3 = 11
}

/** STEAMplay songs (short snippets, 5–10 s). */
enum SteamplaySong {
    //% block="Waltzing Matilda"
    WaltzingMatilda = 0,
    //% block="William Tell gallop"
    WilliamTell = 1,
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
    //% block="Halloween: Hall of the Mountain King"
    MountainKing = 2,
    //% block="Halloween: Chopin's Funeral March"
    ChopinFuneralMarch = 19,
    //% block="Halloween: Dies irae"
    DiesIrae = 20,
    //% block="Beethoven's 5th"
    Beethoven5 = 21,
    //% block="Sea shanty: Drunken Sailor"
    DrunkenSailor = 22,
    //% block="Sea shanty: The Wellerman"
    Wellerman = 23,
    //% block="Sea shanty: Sailor's Hornpipe"
    SailorsHornpipe = 24,
    //% block="Sea shanty: Blow the Man Down"
    BlowTheManDown = 25,
    //% block="Nursery: Hey Diddle Diddle"
    HeyDiddle = 26,
    //% block="Nursery: Little Bo Peep"
    BoPeep = 27,
    //% block="Nursery: Twinkle Twinkle Little Star"
    Twinkle = 28,
    //% block="Nursery: Mary Had a Little Lamb"
    MaryLamb = 29,
    //% block="Nursery: Old MacDonald"
    OldMacDonald = 30,
    //% block="Nursery: London Bridge"
    LondonBridge = 31,
    //% block="Nursery: Pop Goes the Weasel"
    PopWeasel = 32,
    //% block="Nursery: Itsy Bitsy Spider"
    ItsyBitsy = 33,
    //% block="Nursery: The Grand Old Duke of York"
    GrandOldDuke = 34,
    //% block="Nursery: London's Burning"
    LondonsBurning = 35,
    //% block="Nursery: Hickory Dickory Dock"
    HickoryDickory = 36,
    //% block="Nursery: Humpty Dumpty"
    HumptyDumpty = 37,
    //% block="Christmas: Jingle Bells"
    JingleBells = 13,
    //% block="Christmas: Deck the Halls"
    DeckTheHalls = 14,
    //% block="Christmas: We Wish You a Merry Christmas"
    WeWishYou = 15,
    //% block="Christmas: Silent Night"
    SilentNight = 16,
    //% block="Christmas: The Twelve Days of Christmas"
    TwelveDays = 38,
    //% block="Easter: Hot Cross Buns"
    HotCrossBuns = 17,
    //% block="solstice: Sumer Is Icumen In"
    Sumer = 18
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
    JingleBells = 4,
    //% block="Three Blind Mice (round)"
    ThreeBlindMice = 5,
    //% block="London's Burning (round)"
    LondonsBurning = 6
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
    Microphone = 5,
    //% block="odd notes (1st, 3rd, 5th …)"
    OddNotes = 6,
    //% block="even notes (2nd, 4th, 6th …)"
    EvenNotes = 7,
    //% block="on (stays on while the music plays)"
    On = 8,
    //% block="off"
    Off = 9
}

/** Which music to follow: any song, any sound, any song or sound, or one sound or song by name. */
enum SteamplayMusicPick {
    //% block="any song"
    AnySong = 1,
    //% block="any sound"
    AnySound = 2,
    //% block="any song or sound"
    AnyMusic = 3,
    //% block="sound: goal"
    SoundGoal = 200,
    //% block="sound: mission complete"
    SoundMissionComplete = 201,
    //% block="sound: boot-up"
    SoundBootUp = 202,
    //% block="sound: horn"
    SoundHorn = 203,
    //% block="sound: horn 1"
    SoundHorn1 = 204,
    //% block="sound: countdown"
    SoundCountdown = 205,
    //% block="sound: uh-oh"
    SoundUhOh = 206,
    //% block="sound: yes"
    SoundYes = 207,
    //% block="sound: alarm"
    SoundAlarm = 208,
    //% block="sound: siren 1 (wail)"
    SoundSiren1 = 209,
    //% block="sound: siren 2 (hi-lo)"
    SoundSiren2 = 210,
    //% block="sound: siren 3 (yelp)"
    SoundSiren3 = 211,
    //% block="Waltzing Matilda"
    SongWaltzingMatilda = 100,
    //% block="William Tell gallop"
    SongWilliamTell = 101,
    //% block="Can-Can"
    SongCanCan = 103,
    //% block="Flight of the Bumblebee"
    SongBumblebee = 104,
    //% block="When the Saints Go Marching In"
    SongSaints = 105,
    //% block="anthem: Advance Australia Fair"
    SongAdvanceAustraliaFair = 106,
    //% block="anthem: God Save the King"
    SongGodSaveTheKing = 107,
    //% block="anthem: The Star-Spangled Banner"
    SongStarSpangledBanner = 108,
    //% block="anthem: La Marseillaise"
    SongMarseillaise = 109,
    //% block="anthem: O Canada"
    SongOCanada = 110,
    //% block="Halloween: Toccata and Fugue"
    SongToccata = 111,
    //% block="Halloween: Funeral March of a Marionette"
    SongFuneralMarch = 112,
    //% block="Halloween: Hall of the Mountain King"
    SongMountainKing = 102,
    //% block="Halloween: Chopin's Funeral March"
    SongChopinFuneralMarch = 119,
    //% block="Halloween: Dies irae"
    SongDiesIrae = 120,
    //% block="Beethoven's 5th"
    SongBeethoven5 = 121,
    //% block="Sea shanty: Drunken Sailor"
    SongDrunkenSailor = 122,
    //% block="Sea shanty: The Wellerman"
    SongWellerman = 123,
    //% block="Sea shanty: Sailor's Hornpipe"
    SongSailorsHornpipe = 124,
    //% block="Sea shanty: Blow the Man Down"
    SongBlowTheManDown = 125,
    //% block="Nursery: Hey Diddle Diddle"
    SongHeyDiddle = 126,
    //% block="Nursery: Little Bo Peep"
    SongBoPeep = 127,
    //% block="Nursery: Twinkle Twinkle Little Star"
    SongTwinkle = 128,
    //% block="Nursery: Mary Had a Little Lamb"
    SongMaryLamb = 129,
    //% block="Nursery: Old MacDonald"
    SongOldMacDonald = 130,
    //% block="Nursery: London Bridge"
    SongLondonBridge = 131,
    //% block="Nursery: Pop Goes the Weasel"
    SongPopWeasel = 132,
    //% block="Nursery: Itsy Bitsy Spider"
    SongItsyBitsy = 133,
    //% block="Nursery: The Grand Old Duke of York"
    SongGrandOldDuke = 134,
    //% block="Nursery: London's Burning"
    SongLondonsBurning = 135,
    //% block="Nursery: Hickory Dickory Dock"
    SongHickoryDickory = 136,
    //% block="Nursery: Humpty Dumpty"
    SongHumptyDumpty = 137,
    //% block="Christmas: Jingle Bells"
    SongJingleBells = 113,
    //% block="Christmas: Deck the Halls"
    SongDeckTheHalls = 114,
    //% block="Christmas: We Wish You a Merry Christmas"
    SongWeWishYou = 115,
    //% block="Christmas: Silent Night"
    SongSilentNight = 116,
    //% block="Christmas: The Twelve Days of Christmas"
    SongTwelveDays = 138,
    //% block="Easter: Hot Cross Buns"
    SongHotCrossBuns = 117,
    //% block="solstice: Sumer Is Icumen In"
    SongSumer = 118,
    //% block="band: Frère Jacques (round)"
    BandFrereJacques = 300,
    //% block="band: Row, Row, Row Your Boat (round)"
    BandRowRow = 301,
    //% block="band: Sumer Is Icumen In (round)"
    BandSumer = 302,
    //% block="band: Pachelbel's Canon"
    BandCanon = 303,
    //% block="band: Jingle Bells (3 parts)"
    BandJingleBells = 304,
    //% block="band: Three Blind Mice (round)"
    BandThreeBlindMice = 305,
    //% block="band: London's Burning (round)"
    BandLondonsBurning = 306
}

/**
 * Sound effects, songs, a band and light shows.
 */
//% color="#CB6926" weight=108 icon="\uf001" block="STEAMplay Music"
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
            case 3: return "120|16|!B4:3 R:1 !B4:6"
            case 4: return "150|16|C5:1 C5:1 C5:1 F5:2 R:1 !A5:3 R:3 C5:1 C5:1 C5:1 F5:2 R:1 !A5:3 R:1 F5:1 F5:1 E5:1 E5:1 D5:1 D5:1 !C5:6"
            case 5: return "120|16|C5:2 R:6 C5:2 R:6 C5:2 R:6 !C6:8"
            case 6: return "120|16|E5:3 R:1 !C5:6"
            case 7: return "120|16|C5:2 R:1 !G5:5"
            case 8: return "120|16|!A5:4 E5:4 !A5:4 E5:4 !A5:4 E5:4"
            case 9: return "600|16|~650:2 ~688:2 ~725:2 ~762:2 ~800:2 ~838:2 ~875:2 ~912:2 ~950:2 ~988:2 ~1025:2 ~1062:2 ~1100:2 ~1138:2 ~1175:2 ~1212:2 ~1250:2 ~1288:2 ~1325:2 ~1362:2 !~1400:2 ~1362:2 ~1325:2 ~1288:2 ~1250:2 ~1212:2 ~1175:2 ~1138:2 ~1100:2 ~1062:2 ~1025:2 ~988:2 ~950:2 ~912:2 ~875:2 ~838:2 ~800:2 ~762:2 ~725:2 ~688:2 ~650:2 ~650:2 ~688:2 ~725:2 ~762:2 ~800:2 ~838:2 ~875:2 ~912:2 ~950:2 ~988:2 ~1025:2 ~1062:2 ~1100:2 ~1138:2 ~1175:2 ~1212:2 ~1250:2 ~1288:2 ~1325:2 ~1362:2 !~1400:2 ~1362:2 ~1325:2 ~1288:2 ~1250:2 ~1212:2 ~1175:2 ~1138:2 ~1100:2 ~1062:2 ~1025:2 ~988:2 ~950:2 ~912:2 ~875:2 ~838:2 ~800:2 ~762:2 ~725:2 ~688:2 650:2"
            case 10: return "600|16|!~960:20 ~770:20 !~960:20 ~770:20 !~960:20 ~770:20 !~960:20 770:20"
            case 11: return "600|16|~650:1 ~775:1 ~900:1 ~1025:1 ~1150:1 ~1275:1 ~1400:1 ~1275:1 ~1150:1 ~1025:1 ~900:1 ~775:1 ~650:1 ~775:1 ~900:1 ~1025:1 ~1150:1 ~1275:1 ~1400:1 ~1275:1 ~1150:1 ~1025:1 ~900:1 ~775:1 ~650:1 ~775:1 ~900:1 ~1025:1 ~1150:1 ~1275:1 ~1400:1 ~1275:1 ~1150:1 ~1025:1 ~900:1 ~775:1 ~650:1 ~775:1 ~900:1 ~1025:1 ~1150:1 ~1275:1 ~1400:1 ~1275:1 ~1150:1 ~1025:1 ~900:1 ~775:1 ~650:1 ~775:1 ~900:1 ~1025:1 ~1150:1 ~1275:1 ~1400:1 ~1275:1 ~1150:1 ~1025:1 ~900:1 ~775:1 ~650:1 ~775:1 ~900:1 ~1025:1 ~1150:1 ~1275:1 ~1400:1 ~1275:1 ~1150:1 ~1025:1 ~900:1 ~775:1 ~650:1 ~775:1 ~900:1 ~1025:1 ~1150:1 ~1275:1 ~1400:1 ~1275:1 ~1150:1 ~1025:1 ~900:1 ~775:1 ~650:1 ~775:1 ~900:1 ~1025:1 ~1150:1 ~1275:1 ~1400:1 ~1275:1 ~1150:1 ~1025:1 ~900:1 775:1"
        }
        return ""
    }

    function songData(s: number): string {
        switch (s) {
            case 0: return "140|16|G5:4 G5:2 G5:2 G5:4 E5:4 C6:4 C6:2 C6:2 B5:4 A5:4 G5:4 G5:2 G5:2 A5:4 G5:2 G5:2 G5:4 F5:2 E5:2 D5:4 C5:2 D5:2 E5:4 E5:2 E5:2 D5:4 D5:4 C5:2 D5:2 E5:2 C5:2 A4:2 B4:2 C5:4 G4:4 C5:2 E5:2 G5:4 F5:2 E5:2 D5:4 D5:2 D5:2 !C5:8"
            case 1: return "280|16|G4:2 G4:2 G4:4 G4:2 G4:2 G4:4 G4:2 G4:2 C5:4 D5:4 !E5:4 G4:2 G4:2 G4:4 G4:2 G4:2 C5:4 E5:4 D5:4 B4:4 G4:4 G4:2 G4:2 G4:4 G4:2 G4:2 G4:4 G4:2 G4:2 C5:4 D5:4 E5:4 C5:2 E5:2 !G5:10 F5:2 E5:2 D5:2 C5:4 E5:4 !C5:8"
            case 2: return "120|16|A4:2 B4:2 C5:2 D5:2 E5:2 C5:2 E5:4 D#5:2 B4:2 D#5:4 D5:2 A#4:2 D5:4 A4:2 B4:2 C5:2 D5:2 E5:2 C5:2 E5:2 A5:2 G5:2 E5:2 C5:2 E5:2 !G5:8"
            case 3: return "150|16|C5:4 D5:2 F5:2 E5:2 D5:2 G5:4 G5:4 G5:2 A5:2 E5:2 F5:2 D5:4 D5:4 D5:2 F5:2 E5:2 D5:2 C5:2 !C6:2 B5:2 A5:2 G5:2 F5:2 E5:2 D5:2 !C5:4"
            case 4: return "150|16|E5:1 D#5:1 D5:1 C#5:1 D5:1 C#5:1 C5:1 B4:1 C5:1 B4:1 A#4:1 A4:1 G#4:1 G4:1 F#4:1 F4:1 E4:1 D#4:1 D4:1 C#4:1 D4:1 C#4:1 C4:1 B3:1 C4:1 B3:1 A#3:1 A3:1 G#3:1 G3:1 F#3:1 F3:1 E4:1 F4:1 E4:1 D#4:1 E4:1 F4:1 E4:1 D#4:1 E4:1 F4:1 F#4:1 G4:1 G#4:1 A4:1 A#4:1 B4:1 !E5:8"
            case 5: return "140|16|R:4 C5:4 E5:4 F5:4 !G5:16 R:4 C5:4 E5:4 F5:4 !G5:16 R:4 C5:4 E5:4 F5:4 G5:8 E5:8 C5:8 E5:8 !D5:16"
            case 6: return "104|16|G4:4 C5:4 G4:4 E4:4 G4:4 !C5:8 C5:4 C5:3 R:1 E5:4 D5:4 C5:4 B4:4 C5:4 !D5:8 G4:4 C5:4 G4:4 E4:4 C5:4 !G5:8 G5:4 G5:3 R:1 E5:4 D5:4 C5:4 B4:4 A4:4 !G4:12"
            case 7: return "90|12|G4:4 G4:4 A4:4 F#4:6 G4:2 A4:4 B4:4 B4:4 C5:4 B4:6 A4:2 G4:4 A4:4 G4:4 F#4:4 !G4:12"
            case 8: return "90|12|G4:3 E4:1 C4:4 E4:4 G4:4 !C5:8 E5:3 D5:1 C5:4 E4:4 F#4:4 !G4:8"
            case 9: return "110|16|D4:3 D4:1 G4:4 G4:4 A4:4 A4:4 !D5:6 B4:2 G4:3 G4:1 B4:3 G4:1 E4:8 C5:6 A4:2 F#4:4 !G4:12"
            case 10: return "90|16|E4:8 G4:6 G4:2 !C4:12 R:4 D4:4 E4:4 F4:4 G4:4 A4:4 !D4:12"
            case 11: return "100|16|A5:1 G5:1 !A5:10 R:4 G5:1 F5:1 E5:1 D5:1 C#5:4 !D5:12 R:4 A4:1 G4:1 A4:10 R:4 E4:4 F4:4 C#4:4 !D4:12"
            case 12: return "100|12|A4:4 C5:2 C5:2 B4:2 A4:2 B4:4 C5:2 !D5:6 A4:4 C5:2 C5:2 B4:2 A4:2 B4:4 G#4:2 !A4:6"
            case 13: return "180|16|E5:4 E5:4 E5:8 E5:4 E5:4 E5:8 E5:4 G5:4 C5:6 D5:2 !E5:16 F5:4 F5:4 F5:6 F5:2 F5:4 E5:4 E5:4 E5:2 E5:2 G5:4 G5:4 F5:4 D5:4 !C5:16"
            case 14: return "130|16|G5:6 F5:2 E5:4 D5:4 C5:4 D5:4 E5:4 C5:4 D5:2 E5:2 F5:2 D5:2 E5:6 D5:2 C5:4 B4:4 !C5:8"
            case 15: return "150|12|D4:4 G4:4 G4:2 A4:2 G4:2 F#4:2 E4:4 E4:4 E4:4 A4:4 A4:2 B4:2 A4:2 G4:2 F#4:4 D4:4 D4:4 B4:4 B4:2 C5:2 B4:2 A4:2 G4:4 E4:4 D4:2 D4:2 E4:4 A4:4 F#4:4 !G4:12"
            case 16: return "110|12|G4:6 A4:2 G4:4 E4:12 G4:6 A4:2 G4:4 E4:12 !D5:8 D5:4 B4:12 C5:8 C5:4 !G4:12"
            case 17: return "110|16|E5:4 D5:4 C5:8 E5:4 D5:4 C5:8 C5:2 C5:2 C5:2 C5:2 D5:2 D5:2 D5:2 D5:2 E5:4 D5:4 !C5:8"
            case 18: return "120|12|" + sumerMelody()
            case 19: return "60|16|A#4:4 A#4:3 A#4:1 A#4:8 C#5:3 C5:1 C5:3 A#4:1 A#4:3 A4:1 !A#4:8"
            case 20: return "80|16|F4:4 E4:4 F4:4 D4:4 E4:4 C4:4 D4:4 !D4:12"
            case 21: return "108|16|R:2 G4:2 G4:2 G4:2 !D#4:12 R:2 F4:2 F4:2 F4:2 !D4:16"
            case 22: return "145|16|A4:4 A4:2 A4:2 A4:4 A4:2 A4:2 A4:4 D4:4 F4:4 A4:4 G4:4 G4:2 G4:2 G4:4 G4:2 G4:2 G4:4 C4:4 E4:4 G4:4 A4:4 A4:2 A4:2 A4:4 A4:2 A4:2 A4:4 B4:4 C5:4 D5:4 C5:4 A4:4 G4:4 E4:4 !D4:8 D4:8"
            case 23: return "135|16|C6:4 C6:2 G#5:2 A#5:4 A#5:2 G5:2 !G5:8 R:4 G5:2 G#5:4 F5:2 F5:4 F5:2 G#5:2 C6:4 G5:2 G5:8 R:4 C6:4 C6:4 G#5:2 G#5:2 A#5:4 A#5:2 G5:2 G5:8 R:4 G5:2 G5:2 F5:4 D#5:4 D5:4 !C5:12"
            case 24: return "150|16|G5:2 F#5:2 G5:4 G4:4 G4:4 D5:2 C5:2 B4:2 D5:2 G5:2 F#5:2 G5:2 B5:2 A5:2 G5:2 A5:4 A4:4 A4:4 A4:2 G4:2 F#4:2 A4:2 D5:4 D5:4 E5:2 F#5:2 G5:2 F#5:2 E5:2 D5:2 E5:2 D5:2 C5:2 B4:2 C5:2 B4:2 A4:2 G4:2 G4:2 F#4:2 E4:2 D4:2 E4:2 G4:2 F#4:2 A4:2 G4:2 B4:2 A4:2 C5:2 B4:4 G4:4 !G4:8"
            case 25: return "180|12|C5:2 E5:2 G5:6 A5:2 G5:4 E5:4 C5:4 E5:4 G5:6 A5:2 G5:4 E5:8 E5:2 F5:2 !G5:12 !A5:12 F5:6 E5:2 F5:4 D5:8 E5:4 F5:6 E5:2 F5:4 D5:4 B4:4 D5:4 F5:6 E5:2 D5:4 A5:8 C6:4 G5:4 G5:4 G5:4 G5:8 F5:4 E5:6 D5:2 E5:4 !C5:12"
            case 26: return "160|12|G5:4 F5:2 E5:4 D5:2 C5:6 R:4 D5:2 E5:4 F5:2 E5:4 D5:2 C5:6 R:4 D5:2 E5:4 E5:2 G5:4 F5:2 E5:2 !D5:8 E5:2 F5:4 F5:2 E5:4 F5:2 E5:2 F5:4 G5:2 A5:4 C6:2 C6:2 !C6:6 G5:2 F5:2 E5:6 G5:2 D5:2 !C5:12"
            case 27: return "120|12|C5:2 E5:2 G5:2 A5:2 G5:2 E5:2 C5:2 C5:2 E5:2 G5:2 A5:4 G5:2 E5:2 C5:2 D5:2 F5:4 A5:2 C6:2 A5:2 F5:2 D5:4 C5:2 E5:2 G5:2 A5:2 G5:2 E5:2 !C5:12"
            case 28: return "110|16|C5:4 C5:4 G5:4 G5:4 A5:4 A5:4 G5:8 F5:4 F5:4 E5:4 E5:4 D5:4 D5:4 !C5:8"
            case 29: return "150|16|E5:4 D5:4 C5:4 D5:4 E5:4 E5:4 E5:8 D5:4 D5:4 D5:8 E5:4 G5:4 G5:8 E5:4 D5:4 C5:4 D5:4 E5:4 E5:4 E5:4 E5:4 D5:4 D5:4 E5:4 D5:4 !C5:16"
            case 30: return "145|16|C5:4 C5:4 C5:4 G4:4 A4:4 A4:4 G4:8 E5:4 E5:4 D5:4 D5:4 !C5:12 G4:4 C5:4 C5:4 C5:4 G4:4 A4:4 A4:4 G4:8 E5:4 E5:4 D5:4 D5:4 !C5:12"
            case 31: return "130|16|G5:3 A5:1 G5:2 F5:2 E5:4 F5:4 G5:8 D5:4 E5:4 F5:8 E5:4 F5:4 G5:8 G5:3 A5:1 G5:2 F5:2 E5:4 F5:4 G5:8 D5:8 G5:8 E5:4 !C5:12"
            case 32: return "140|12|G4:4 G4:2 A4:4 A4:2 B4:2 D5:2 B4:2 G4:4 D4:2 G4:4 G4:2 A4:4 A4:2 B4:6 G4:4 D4:2 G4:4 G4:2 A4:4 A4:2 B4:2 D5:2 B4:2 G4:6 !E5:6 A4:4 C5:2 B4:6 !G4:6"
            case 33: return "130|12|G4:2 C5:4 C5:2 C5:4 D5:2 E5:6 E5:4 E5:2 D5:4 C5:2 D5:4 E5:2 C5:12 E5:6 E5:4 F5:2 G5:6 G5:6 F5:4 E5:2 F5:4 G5:2 !E5:12"
            case 34: return "140|16|F#5:2 E5:2 D5:4 A4:4 F#4:4 A4:4 D5:6 D5:2 D5:4 D5:4 C#5:4 E5:4 E5:4 E5:4 E5:6 A4:2 B4:2 C#5:2 D5:2 E5:2 F#5:6 F#5:2 F#5:4 A5:4 G5:4 F#5:4 E5:4 D5:4 C#5:4 A4:4 D5:2 C#5:2 B4:2 C#5:2 !D5:12"
            case 35: return "120|8|D4:2 D4:2 G4:4 D4:2 D4:2 G4:4 A4:2 A4:2 B4:4 A4:2 A4:2 B4:4 !D5:4 D4:4 !D5:4 D4:4 D5:2 C5:2 B4:4 D5:2 C5:2 !B4:4"
            case 36: return "120|12|E4:2 F4:2 G4:2 G4:2 A4:2 B4:2 C5:6 G4:2 E4:2 F4:2 G4:2 G4:2 A4:2 B4:2 C5:6 G4:2 C5:2 C5:2 B4:2 B4:2 A4:2 A4:2 G4:6 G4:2 A4:2 G4:2 F4:2 E4:2 D4:2 !C4:6"
            case 37: return "120|12|E4:4 G4:2 F4:4 A4:2 G4:2 A4:2 B4:2 C5:6 E4:4 G4:2 F4:4 A4:2 G4:2 E4:2 C4:2 D4:6 E4:2 E4:2 G4:2 F4:2 F4:2 A4:2 G4:2 A4:2 B4:2 C5:6 E5:2 E5:2 C5:2 F5:2 F5:2 E5:2 D5:2 C5:2 B4:2 !C5:6"
            case 38: return "110|16|C5:2 C5:2 C5:2 F5:2 F5:2 F5:4 E5:2 F5:2 G5:2 A5:2 A#5:2 G5:2 A5:8 C6:4 G5:4 A5:8 C6:4 G5:2 A5:2 A#5:4 A5:2 A#5:2 C6:4 D6:2 A#5:2 A5:2 F5:2 G5:4 !F5:12"
        }
        return ""
    }

    function sumerMelody(): string {
        return "C5:4 B4:2 A4:4 B4:2 C5:4 C5:2 B4:1 A4:1 G4:2 E4:4 E4:2 F4:4 D4:2 E4:6 R:6 C4:4 E4:2 D4:4 F4:2 E4:4 E4:2 D4:4 C4:2 E4:4 G4:2 A4:4 A4:2 !G4:12"
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
            case 5: return round("160|12|E5:6 D5:6 C5:12 E5:6 D5:6 C5:12 G5:6 F5:4 F5:2 E5:12 G5:6 F5:4 F5:2 E5:10 G5:2 C6:4 C6:2 B5:2 A5:2 B5:2 C6:4 G5:2 G5:4 G5:2 C6:4 C6:2 B5:2 A5:2 B5:2 C6:4 G5:2 G5:4 G5:2 C6:4 C6:2 B5:2 A5:2 B5:2 C6:4 G5:2 G5:4 F5:2 E5:6 D5:6 !C5:12", 4, 3)
            case 6: return round("120|8|D4:2 D4:2 G4:4 D4:2 D4:2 G4:4 A4:2 A4:2 B4:4 A4:2 A4:2 B4:4 !D5:4 D4:4 !D5:4 D4:4 D5:2 C5:2 B4:4 D5:2 C5:2 !B4:4 D4:2 D4:2 G4:4 D4:2 D4:2 G4:4 A4:2 A4:2 B4:4 A4:2 A4:2 B4:4 !D5:4 D4:4 !D5:4 D4:4 D5:2 C5:2 B4:4 D5:2 C5:2 !B4:4", 2, 3)
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
    let tSmooth: boolean[] = []   // "~": no gap after this note (smooth sirens)
    let tBpm = 120
    let tBar = 16
    let tLow = 0
    let tHigh = 0

    function noteFreq(name: string): number {
        if (name == "R") return 0
        const c0 = name.charCodeAt(0)
        if (c0 >= 48 && c0 <= 57) return parseInt(name)   // a number is a pitch in Hz (sirens)
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
        tSmooth = []
        tLow = 100000
        tHigh = 0
        const tokens = p[2].split(" ")
        for (let i = 0; i < tokens.length; i++) {
            let t = tokens[i]
            if (t.length == 0) continue
            let big = false
            let smooth = false
            if (t.charAt(0) == "!") { big = true; t = t.substr(1) }
            if (t.charAt(0) == "~") { smooth = true; t = t.substr(1) }
            const c = t.indexOf(":")
            if (c < 0) continue
            const f = noteFreq(t.substr(0, c))
            tFreq.push(f)
            tLen.push(parseInt(t.substr(c + 1)))
            tBig.push(big)
            tSmooth.push(smooth)
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
    let lightPick: number[] = []   // which music each light follows (SteamplayMusicPick)
    let lightSplit: number[] = []  // high/low split in Hz (0 = halfway through the song's range)
    // Lights changed inside an "on music" block go back to how they were when the music ends.
    let backPins: number[] = []
    let backWas: boolean[] = []    // was synced before
    let backPick: number[] = []
    let backMode: number[] = []
    let backSplit: number[] = []
    let nowMusic = 0               // id of the music playing now (see steamplayCore)

    function follows(pick: number): boolean {
        return steamplayCore.musicMatches(pick, nowMusic)
    }

    // "on music … note" blocks. Each note number are handed over straight away in their
    // own fiber, so a busy handler never misses a note or reads the next note's values.
    let notePicks: number[] = []
    let noteFns: ((note: number) => void)[] = []

    let endPicks: number[] = []
    let endFns: (() => void)[] = []

    function finishedHandlers(m: number) {
        for (let i = 0; i < endFns.length; i++) {
            if (!steamplayCore.musicMatches(endPicks[i], m)) continue
            control.runInParallel(endFns[i])
        }
    }

    function noteHandlers(noteNo: number) {
        for (let i = 0; i < noteFns.length; i++) {
            if (!follows(notePicks[i])) continue
            const h = noteFns[i]
            control.runInParallel(function () {
                steamplayCore.musicMoveBegin()
                h(noteNo)
                steamplayCore.musicMoveEnd()
            })
        }
    }

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

    /** Lights in "on" mode stay fully on while their music plays. */
    function lightsOnMode() {
        for (let i = 0; i < lightPins.length; i++) {
            if (lightModes[i] == SteamplaySyncMode.On && follows(lightPick[i])) setLight(i, 1023)
        }
    }

    function lightsAllOff() {
        nowF = 0
        for (let i = 0; i < lightPins.length; i++) {
            if (lightModes[i] != SteamplaySyncMode.Microphone) setLight(i, 0)
        }
    }

    /** A note starts: lights in note modes turn on for this note (and off at the end of it). */
    // The note sounding now, so a light switched on mid-note (eg from "on music") lights for it straight away.
    let nowF = 0
    let nowBig = false
    let nowNoteNo = 0

    function lightsNoteOn(f: number, big: boolean, noteNo: number) {
        nowF = f; nowBig = big; nowNoteNo = noteNo
        for (let i = 0; i < lightPins.length; i++) noteLight(i, f, big, noteNo)
    }

    function noteLight(i: number, f: number, big: boolean, noteNo: number) {
        const autoMid = (tLow + tHigh) / 2
        {
            const m = lightModes[i]
            const mid = lightSplit[i] > 0 ? lightSplit[i] : autoMid
            if (!follows(lightPick[i])) return
            if (m == SteamplaySyncMode.EveryNote) setLight(i, f > 0 ? 1023 : 0)
            else if (m == SteamplaySyncMode.HighNotes) setLight(i, f > 0 && f >= mid ? 1023 : 0)
            else if (m == SteamplaySyncMode.LowNotes) setLight(i, f > 0 && (lightSplit[i] > 0 ? f <= mid : f < mid) ? 1023 : 0)
            else if (m == SteamplaySyncMode.OddNotes) setLight(i, f > 0 && noteNo % 2 == 1 ? 1023 : 0)
            else if (m == SteamplaySyncMode.EvenNotes) setLight(i, f > 0 && noteNo % 2 == 0 ? 1023 : 0)
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
        nowF = 0
        for (let i = 0; i < lightPins.length; i++) {
            const m = lightModes[i]
            if (m == SteamplaySyncMode.EveryNote || m == SteamplaySyncMode.HighNotes || m == SteamplaySyncMode.LowNotes
                || m == SteamplaySyncMode.OddNotes || m == SteamplaySyncMode.EvenNotes) setLight(i, 0)
        }
    }

    function lightsBeat(on: boolean) {
        for (let i = 0; i < lightPins.length; i++) {
            if (lightModes[i] == SteamplaySyncMode.Beat && follows(lightPick[i])) setLight(i, on ? 1023 : 0)
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
    let started = false

    // Band state
    let bandSong = -1
    let bandListening = false
    let bandPart = 1
    let bandBarNo = -1
    let bandBarAt = 0
    const BAND_START_DELAY_MS = 150
    const BAND_WAIT_MS = 60

    function setup() {
        if (started) return
        started = true
        steamplayCore.addStopHandler(function () { stopNow() })
        // After servos and motors have been put back, run any "on music … finished" blocks.
        steamplayCore.onMusicChange(function (st: boolean, m: number) {
            if (st) return
            putLightsBack()        // lights changed inside "on music" go back first
            finishedHandlers(m)    // then any "on music … finished" blocks
        })
    }

    function stopNow() {
        playId++
        playing = false
        music.ringTone(0)
        lightsAllOff()
        nowMusic = 0
        steamplayCore.musicEnded()
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
        let noteNo = 0      // counts the notes played (rests don't count)
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
                    if (f > 0) noteNo++
                    music.ringTone(f)
                    lightsNoteOn(f, tBig[n], noteNo)
                    if (f > 0) noteHandlers(noteNo)
                }
                if (step % 4 == 0) lightsBeat(true)
                else if (step % 4 == 2) lightsBeat(false)
                const end = t0 + (step + 1) * stepMs
                if (s == len - 1) {
                    if (!tSmooth[n]) {
                        waitUntil(end - gap)
                        if (id != playId) return
                        music.ringTone(0)
                        lightsNoteOff()
                    }
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
            nowMusic = 0
            steamplayCore.musicEnded()
        }
    }

    function play(tune: string, mode: number, band: number, musicId: number) {
        setup()
        if (tune.length == 0) return
        playId++
        const id = playId
        music.ringTone(0)
        lightsAllOff()
        nowMusic = musicId
        steamplayCore.musicStarted(musicId)   // ends the music that was playing, then starts this one
        lightsOnMode()
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
     * Plays a STEAMplay sound. A new sound replaces the one playing.
     * @param sound the sound to play, eg: SteamplaySound.Goal
     * @param mode keep going or wait, eg: SteamplayPlayMode.InBackground
     */
    //% blockId=steamplay_play_sound
    //% block="play sound $sound $mode"
    //% group="Sounds" weight=100
    export function playSound(sound: SteamplaySound, mode: SteamplayPlayMode) {
        play(soundData(sound), mode, 0, 200 + sound)
    }

    /**
     * Plays a short song. A new sound replaces the one playing.
     * @param song the song to play, eg: SteamplaySong.WaltzingMatilda
     * @param mode keep going or wait, eg: SteamplayPlayMode.InBackground
     */
    //% blockId=steamplay_play_song
    //% block="play song $song $mode"
    //% group="Songs" weight=90
    export function playSong(song: SteamplaySong, mode: SteamplayPlayMode) {
        play(songData(song), mode, 0, 100 + song)
    }

    /**
     * Stops STEAMplay music and turns music lights off.
     */
    //% blockId=steamplay_stop_music
    //% block="stop STEAMplay music"
    //% group="Songs" weight=85
    export function stopMusic() {
        setup()
        stopNow()
    }

    /**
     * True while a STEAMplay sound or song is playing.
     */
    //% blockId=steamplay_music_playing
    //% block="STEAMplay music is playing"
    //% group="Songs" weight=84
    export function isPlaying(): boolean {
        return playing
    }

    /**
     * Runs on every note of the music you choose. Note counts the notes: 1, 2, 3 ...
     * Servos, motors and sync pin lights changed here go back to how they were when the music ends.
     * @param pick which music to follow, eg: SteamplayMusicPick.AnySong
     */
    //% blockId=steamplay_on_music_note
    //% block="on music $pick note $note"
    //% draggableParameters="reporter"
    //% pick.defl=SteamplayMusicPick.AnySong
    //% group="Light sync" weight=60
    export function onMusicNote(pick: SteamplayMusicPick, handler: (note: number) => void) {
        setup()
        notePicks.push(pick)
        noteFns.push(handler)
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
            play(partOf(song, part), SteamplayPlayMode.UntilDone, part, 300 + song)
        })
    }

    /**
     * Put in on start on each micro:bit: same song and group, a different part (1, 2 or 3). Part 1 keeps time. Don't add your own radio blocks.
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
        steamplayCore.useRadioGroup(group)
        if (bandListening) return   // already set up (eg the block is in "forever")
        bandListening = true
        steamplayCore.onRadio("spgo", function (name: string, value: number) { startBandHere() })
        steamplayCore.onRadio("spbar", function (name: string, value: number) {
            bandBarNo = value
            bandBarAt = control.millis()
        })
    }

    /**
     * Starts the whole band together. Put it in a button block (eg on button A pressed) on any band micro:bit, not in forever.
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
     * A light on this pin follows the music, from now on. Usually goes in on start. Inside "on music" it changes
     * the light for that song only. + split: only for high and low notes. Wire an LED and resistor from the pin to GND.
     * @param pin the pin for the light, eg: SteamplayPin.P1
     * @param pick which music the light follows, eg: SteamplayMusicPick.AnySong
     * @param mode how the light follows the music, eg: SteamplaySyncMode.Beat
     * @param split for high and low notes: high = this note and higher, low = this note and lower (+ to choose), eg: 262
     */
    //% blockId=steamplay_sync_pin
    //% block="sync pin $pin to $pick $mode||split at $split"
    //% pin.defl=SteamplayPin.P1 pick.defl=SteamplayMusicPick.AnySong
    //% split.shadow="device_note"
    //% expandableArgumentMode="toggle"
    //% inlineInputMode=inline
    //% group="Light sync" weight=70
    export function syncPin(pin: SteamplayPin, pick: SteamplayMusicPick, mode: SteamplaySyncMode, split?: number) {
        setup()
        if (!steamplayCore.claimPin(pin, "lights")) return
        if (steamplayCore.inMusicMove()) {
            if (steamplayCore.musicNow() == 0) return   // that music has ended: ignore a late change
            rememberLight(pin)
        }
        applySync(pin, pick, mode, split ? split : 0)
    }

    function applySync(pin: number, pick: number, mode: number, split: number) {
        let i = lightPins.indexOf(pin)
        if (i < 0) {
            lightPins.push(pin)
            lightModes.push(mode)
            lightPeriodSet.push(false)
            lightPick.push(pick)
            lightSplit.push(split)
            i = lightPins.length - 1
            setLight(i, 0)
        } else if (lightModes[i] != mode || lightPick[i] != pick || lightSplit[i] != split) {
            // Only a real change resets the light, so the block is safe in "forever" too.
            lightPick[i] = pick
            lightModes[i] = mode
            lightSplit[i] = split
            setLight(i, 0)
        }
        if (mode == SteamplaySyncMode.On && follows(pick)) setLight(i, 1023)
        else if (playing && nowF > 0) noteLight(i, nowF, nowBig, nowNoteNo)
        if (mode == SteamplaySyncMode.Microphone && steamplayCore.isV2()) startMicrophone()
    }

    function removeLight(pin: number) {
        const i = lightPins.indexOf(pin)
        if (i < 0) return
        setLight(i, 0)
        lightPins.removeAt(i)
        lightModes.removeAt(i)
        lightPeriodSet.removeAt(i)
        lightPick.removeAt(i)
        lightSplit.removeAt(i)
    }

    /** Inside "on music": remember how this light was, the first time it changes. */
    function rememberLight(pin: number) {
        if (backPins.indexOf(pin) >= 0) return
        const i = lightPins.indexOf(pin)
        backPins.push(pin)
        backWas.push(i >= 0)
        backPick.push(i >= 0 ? lightPick[i] : 0)
        backMode.push(i >= 0 ? lightModes[i] : 0)
        backSplit.push(i >= 0 ? lightSplit[i] : 0)
    }

    function putLightsBack() {
        for (let k = 0; k < backPins.length; k++) {
            if (backWas[k]) applySync(backPins[k], backPick[k], backMode[k], backSplit[k])
            else removeLight(backPins[k])
        }
        backPins = []; backWas = []; backPick = []; backMode = []; backSplit = []
    }

    /**
     * Runs once when the music you choose finishes or is stopped. Put your end settings here, eg servos to 90, lights off.
     * @param pick which music, eg: SteamplayMusicPick.AnySong
     */
    //% blockId=steamplay_on_music_finished
    //% block="on music $pick finished"
    //% pick.defl=SteamplayMusicPick.AnySong
    //% group="Light sync" weight=59
    export function onMusicFinished(pick: SteamplayMusicPick, handler: () => void) {
        setup()
        endPicks.push(pick)
        endFns.push(handler)
    }

    /**
     * True for 2, 4, 6 … Handy with note: do one move on even notes, another on odd notes.
     * @param n the number to check, eg: 2
     */
    //% blockId=steamplay_is_even
    //% block="$n is even"
    //% group="Light sync" weight=58 blockGap=8
    export function isEven(n: number): boolean {
        return Math.abs(Math.round(n)) % 2 == 0
    }

    /**
     * True for 1, 3, 5 …
     * @param n the number to check, eg: 1
     */
    //% blockId=steamplay_is_odd
    //% block="$n is odd"
    //% group="Light sync" weight=57
    export function isOdd(n: number): boolean {
        return Math.abs(Math.round(n)) % 2 == 1
    }

    /**
     * The light on this pin stops following the music and turns off. Inside "on music", it goes back when the music ends.
     * @param pin the pin, eg: SteamplayPin.P1
     */
    //% blockId=steamplay_unsync_pin
    //% block="unsync pin $pin"
    //% pin.defl=SteamplayPin.P1
    //% group="Light sync" weight=69
    export function unsyncPin(pin: SteamplayPin) {
        if (steamplayCore.inMusicMove()) {
            if (steamplayCore.musicNow() == 0) return
            rememberLight(pin)
        }
        removeLight(pin)
    }
}
