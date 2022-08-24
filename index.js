const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('wjazzd.db');

const alphabet = Array.from('ABCDEFG').map(d => [`${d}b`, d, `${d}#`]).flat();
const pitchClassAlphabet = ['G#-Ab', 'A', 'A#-Bb', 'B-Cb', 'B#-C', 'C#-Db', 'D', 'D#-Eb', 'E-Fb', 'E#-F', 'F#-Gb', 'G'];
const midiToPitchClass = (midiNumber) => (midiNumber - 20) % 12;
const getChordBase = (chord) => alphabet.sort().reverse().find(value => new RegExp('.*' + value + '.*').test(chord));
const diffTo = (pitch, absolute) => absolute <= pitch ? pitch - absolute : (12 - absolute) + pitch;


/**
 * Curried auxiliary function for asynchronous database query
 * @param query
 * @returns {function(*=): Promise<unknown>}
 */
const getData = (query) => {
    return (melid) => {
        return new Promise((resolve, reject) => {
            db.all(query, melid, (err, data) => {
                if (err) {
                    reject(err);
                }
                resolve(data);
            })
        });
    }
}

const getMelody = getData("SELECT eventid, pitch, bar, beat, tatum, subtatum FROM `melody` WHERE melid = ?");
const getBeats = getData("SELECT bar, beat, chord, bass_pitch FROM `beats` WHERE melid = ?");
const getMeta = getData("SELECT key, style, tempoclass, instrument, rhythmfeel FROM `solo_info` WHERE melid = ?");

/**
 * Assembles all chord-melody tone combinations from melody and beats table
 * @param melody Data from melody-Table {pitch, bar, beat}
 * @param beats Data from beats-Table {chord, beat, bass_pitch}
 * @returns Records with the chords and the corresponding melody events
 */
const getNotesWithinChord = (melody, beats) => {
    const chords = beats.filter(beat => beat['chord'] !== '');
    return chords.map((chord, chordIndex) => {
        const melodyEvents = melody.map(melodyEvent => {
                if (!melodyEvent) {
                    return false;
                }
                const melodyEventValue = melodyEvent['bar'] + (melodyEvent['beat'] * 0.1);
                const chordValue = chord['bar'] + (chord['beat'] * 0.1);
                const chordAfterValue = chords.length - 1 > chordIndex ?
                    chords[chordIndex + 1]['bar'] + (chords[chordIndex + 1]['beat'] * 0.1) : 10000;
                if (melodyEventValue >= chordValue && melodyEventValue < chordAfterValue) {
                    return melodyEvent;
                } else {
                    return false;
                }
            }
        ).filter(el => !!el);
        return {melodyEvents, ...chord};
    })
}



/**
 * Finds chord base and returns its pitch class
 * @param chord
 * @returns {number} pitch class
 */
const chordBasePitchClass = (chord) => {
    const chordBaseMatch = getChordBase(chord);
    return pitchClassAlphabet.indexOf(
        pitchClassAlphabet.find(value => value.split("-").indexOf(chordBaseMatch) !== -1)
    );

}

/**
 * Takes chord-melody combination and calculates different representations: 
 * Absolute Pitch: Abs; Pitch Class: PC; Relative To Key: RTK; Relative to Chord: RTC
 * @param CMCombinations chord-melody combination
 * @param key
 * @returns {*}
 */
const computeRepresentations = (CMCombinations, key) => {
    const keyEnh = chordBasePitchClass(key);
    return CMCombinations.map(row => {
        row['chordABS'] = row['chord'];
        row['chordPC'] = chordBasePitchClass(row['chord'])
        row['chordRTK'] = diffTo(row['chordPC'], keyEnh);
        row['melodyEvents'] = row['melodyEvents'].map((e) => {
            e.pitchPC = midiToPitchClass(e.pitch);
            return e;
        })
        row['melodyRTK'] = row['melodyEvents'].map(d => diffTo(d.pitchPC, keyEnh))
        row['melodyRTC'] = row['melodyEvents'].map(d => diffTo(d.pitchPC, row['chordPC']))
        row['melodyPC'] = row['melodyEvents'].map(d => d.pitchPC)
        return row;
    })
}

/**
 * Computes pitch distribution
 * @param data
 * @param attrChord
 * @param attrMelody
 * @returns {*}
 */
const pitchDistributionPerChord = (data, attrChord, attrMelody) => {
    return data.reduce((chords, next) => {
        if (!(next[attrChord] in chords)) {
            chords[next[attrChord]] = {};
        }
        next[attrMelody].forEach(note => {
            if (note in chords[next[attrChord]]) {
                chords[next[attrChord]][note] += 1;
            } else {
                chords[next[attrChord]][note] = 1;
            }
        })
        return chords;
    }, {})
}

const main = async () => {
    const melody1 = await getMelody(1);
    const beats1 = await getBeats(1);
    const meta1 = await getMeta(1);

    console.log(melody1[0], beats1[0])
    const notesWithinChord = getNotesWithinChord(melody1, beats1);
    const d = computeRepresentations(notesWithinChord, meta1[0]['key']);

    console.log(pitchDistributionPerChord(d, 'chordRTK', 'melodyRTK'))
    console.log(pitchDistributionPerChord(d, 'chordPC', 'melodyRTC'))
    console.log(pitchDistributionPerChord(d, 'chordPC', 'melodyPC'))
}

main()

