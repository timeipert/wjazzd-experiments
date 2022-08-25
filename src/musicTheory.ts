import {Beat, Melody, NotesWithinChord} from "./types";

export default class MusicTheory {
    static alphabet: string[] = Array.from('ABCDEFG').map(d => [`${d}b`, d, `${d}#`]).flat();
    static pitchClassAlphabet: string[] = ['G#-Ab', 'A', 'A#-Bb', 'B-Cb', 'B#-C', 'C#-Db', 'D', 'D#-Eb', 'E-Fb', 'E#-F', 'F#-Gb', 'G'];
    static midiToPitchClass: any = (midiNumber: number): number => (midiNumber - 20) % 12;
    static getChordBase: any = (chord: string): string => MusicTheory.alphabet.sort().reverse().find(value => new RegExp('.*' + value + '.*').test(chord));
    static diffTo: any = (pitch: number, absolute: number): number => absolute <= pitch ? pitch - absolute : (12 - absolute) + pitch;

    /**
     * Assembles all chord-melody tone combinations from melody and beats table
     * @param melody Data from melody-Table {pitch, bar, beat}
     * @param beats Data from beats-Table {chord, beat, bass_pitch}
     * @returns Records with the chords and the corresponding melody events
     */
    static getNotesWithinChord(melody: Melody[], beats: Beat[]): NotesWithinChord[] {
        const chords = beats.filter(beat => beat['chord'] !== '');
        return chords.map((chord: Beat, chordIndex: number) => {
            const melodyEvents = melody.map(melodyEvent => {
                    if (!melodyEvent) {
                        return undefined;
                    }
                    const melodyEventValue = melodyEvent['bar'] + (melodyEvent['beat'] * 0.1);
                    const chordValue = chord['bar'] + (chord['beat'] * 0.1);
                    const chordAfterValue = chords.length - 1 > chordIndex ?
                        chords[chordIndex + 1]['bar'] + (chords[chordIndex + 1]['beat'] * 0.1) : 10000;
                    if (melodyEventValue >= chordValue && melodyEventValue < chordAfterValue) {
                        return melodyEvent;
                    } else {
                        return undefined;
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
    static chordBasePitchClass(chord: string): number {
        const chordBaseMatch = this.getChordBase(chord);
        return this.pitchClassAlphabet.indexOf(
            this.pitchClassAlphabet.find(value => value.split("-").indexOf(chordBaseMatch) !== -1)
        );

    }

    /**
     * Takes chord-melody combination and calculates different representations:
     * Absolute Pitch: Abs; Pitch Class: PC; Relative To Key: RTK; Relative to Chord: RTC
     * @param chordMelodyCombinations
     * @param key
     * @returns {*}
     */
    static computeRepresentations(chordMelodyCombinations: NotesWithinChord[], key: string): NotesWithinChord[] {
        const keyEnh = this.chordBasePitchClass(key);
        return chordMelodyCombinations.map(row => {
            row['chordABS'] = row['chord'];
            row['chordPC'] = this.chordBasePitchClass(row['chord'])
            row['chordRTK'] = this.diffTo(row['chordPC'], keyEnh);
            row['melodyEvents'] = row['melodyEvents'].map((e) => {
                e.pitchPC = this.midiToPitchClass(e.pitch);
                return e;
            })
            row['melodyRTK'] = row['melodyEvents'].map(d => this.diffTo(d.pitchPC, keyEnh))
            row['melodyRTC'] = row['melodyEvents'].map(d => this.diffTo(d.pitchPC, row['chordPC']))
            row['melodyPC'] = row['melodyEvents'].map(d => d.pitchPC)
            return row;
        })
    }


}