"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class MusicTheory {
    /**
     * Assembles all chord-melody tone combinations from melody and beats table
     * @param melody Data from melody-Table {pitch, bar, beat}
     * @param beats Data from beats-Table {chord, beat, bass_pitch}
     * @returns Records with the chords and the corresponding melody events
     */
    static getNotesWithinChord(melody, beats) {
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
                }
                else {
                    return false;
                }
            }).filter(el => !!el);
            return Object.assign({ melodyEvents }, chord);
        });
    }
    /**
     * Finds chord base and returns its pitch class
     * @param chord
     * @returns {number} pitch class
     */
    static chordBasePitchClass(chord) {
        const chordBaseMatch = this.getChordBase(chord);
        return this.pitchClassAlphabet.indexOf(this.pitchClassAlphabet.find(value => value.split("-").indexOf(chordBaseMatch) !== -1));
    }
    /**
     * Takes chord-melody combination and calculates different representations:
     * Absolute Pitch: Abs; Pitch Class: PC; Relative To Key: RTK; Relative to Chord: RTC
     * @param CMCombinations chord-melody combination
     * @param key
     * @returns {*}
     */
    static computeRepresentations(CMCombinations, key) {
        const keyEnh = this.chordBasePitchClass(key);
        return CMCombinations.map(row => {
            row['chordABS'] = row['chord'];
            row['chordPC'] = this.chordBasePitchClass(row['chord']);
            row['chordRTK'] = this.diffTo(row['chordPC'], keyEnh);
            row['melodyEvents'] = row['melodyEvents'].map((e) => {
                e.pitchPC = this.midiToPitchClass(e.pitch);
                return e;
            });
            row['melodyRTK'] = row['melodyEvents'].map(d => this.diffTo(d.pitchPC, keyEnh));
            row['melodyRTC'] = row['melodyEvents'].map(d => this.diffTo(d.pitchPC, row['chordPC']));
            row['melodyPC'] = row['melodyEvents'].map(d => d.pitchPC);
            return row;
        });
    }
}
exports.default = MusicTheory;
MusicTheory.alphabet = Array.from('ABCDEFG').map(d => [`${d}b`, d, `${d}#`]).flat();
MusicTheory.pitchClassAlphabet = ['G#-Ab', 'A', 'A#-Bb', 'B-Cb', 'B#-C', 'C#-Db', 'D', 'D#-Eb', 'E-Fb', 'E#-F', 'F#-Gb', 'G'];
MusicTheory.midiToPitchClass = (midiNumber) => (midiNumber - 20) % 12;
MusicTheory.getChordBase = (chord) => MusicTheory.alphabet.sort().reverse().find(value => new RegExp('.*' + value + '.*').test(chord));
MusicTheory.diffTo = (pitch, absolute) => absolute <= pitch ? pitch - absolute : (12 - absolute) + pitch;
//# sourceMappingURL=musicTheory.js.map