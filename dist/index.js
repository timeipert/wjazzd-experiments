"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const db_1 = require("./db");
const musicTheory_1 = require("./musicTheory");
const statistics_1 = require("./statistics");
const main = () => __awaiter(void 0, void 0, void 0, function* () {
    const melody1 = yield db_1.default.getMelody(1);
    const beats1 = yield db_1.default.getBeats(1);
    const meta1 = yield db_1.default.getMeta(1);
    console.log(melody1[0], beats1[0]);
    const notesWithinChord = musicTheory_1.default.getNotesWithinChord(melody1, beats1);
    const d = musicTheory_1.default.computeRepresentations(notesWithinChord, meta1[0]['key']);
    console.log(statistics_1.default.pitchDistributionPerChord(d, 'chordRTK', 'melodyRTK'));
    console.log(statistics_1.default.pitchDistributionPerChord(d, 'chordPC', 'melodyRTC'));
    console.log(statistics_1.default.pitchDistributionPerChord(d, 'chordPC', 'melodyPC'));
});
main();
//# sourceMappingURL=index.js.map