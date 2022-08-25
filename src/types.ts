export type Melody = {
    eventid: number;
    pitch: number;
    bar: number;
    beat: number;
    tatum: number;
    subtatum: number;
    pitchPC?: number;
}
export type Beat = {
    bar: number;
    beat: number;
    chord: string;
    bass_pitch: number;
}
export type Metadata = {
    key: string;
    style: string;
    tempoclass: string;
    instrument: string;
    rhythmfeel: string;
}
export type NotesWithinChord =
    Beat &
    {
        melodyEvents: Melody[];
    }
    export type Computed = {
        chordPC: number;
        chordABS: number;
        chordRTK: number;
        chordRTC: number;
    }