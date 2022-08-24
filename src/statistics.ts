export default class Statistics {
    constructor() {
    }

    /**
     * Computes pitch distribution
     * @param data
     * @param attrChord
     * @param attrMelody
     * @returns {*}
     */
    static pitchDistributionPerChord(data, attrChord, attrMelody) {
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
}