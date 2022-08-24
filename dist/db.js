"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sqlite3 = require("sqlite3");
const db = new sqlite3.Database('wjazzd.db');
class Database {
    constructor() {
    }
    /**
     * Curried auxiliary function for asynchronous database query
     * @param query
     * @returns {function(*=): Promise<unknown>}
     */
    static getData(query) {
        return (melid) => {
            return new Promise((resolve, reject) => {
                db.all(query, melid, (err, data) => {
                    if (err) {
                        reject(err);
                    }
                    resolve(data);
                });
            });
        };
    }
}
exports.default = Database;
Database.getMelody = Database.getData("SELECT eventid, pitch, bar, beat, tatum, subtatum FROM `melody` WHERE melid = ?");
Database.getBeats = Database.getData("SELECT bar, beat, chord, bass_pitch FROM `beats` WHERE melid = ?");
Database.getMeta = Database.getData("SELECT key, style, tempoclass, instrument, rhythmfeel FROM `solo_info` WHERE melid = ?");
//# sourceMappingURL=db.js.map