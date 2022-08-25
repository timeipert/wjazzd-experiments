import Database from "./db";
import MusicTheory from "./musicTheory";
import Statistics from "./statistics";
import {Beat, Melody, Metadata} from "./types";


const main = async () => {

    const melody1 = await Database.getMelody(1) as Melody[];
    const beats1 = await Database.getBeats(1) as Beat[];
    const meta1 = await Database.getMeta(1) as Metadata[];

    console.log(melody1[0], beats1[0])
    const notesWithinChord = MusicTheory.getNotesWithinChord(melody1, beats1);
    const d = MusicTheory.computeRepresentations(notesWithinChord, meta1[0]['key']);

    console.log(Statistics.pitchDistributionPerChord(d, 'chordRTK', 'melodyRTK'))
    console.log(Statistics.pitchDistributionPerChord(d, 'chordPC', 'melodyRTC'))
    console.log(Statistics.pitchDistributionPerChord(d, 'chordPC', 'melodyPC'))
}

main()

