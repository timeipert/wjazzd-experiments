import * as sqlite3 from 'sqlite3';
const db = new sqlite3.Database('wjazzd.db');


export default class Database {
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
                })
            });
        }
    }

    static getMelody = Database.getData("SELECT eventid, pitch, bar, beat, tatum, subtatum FROM `melody` WHERE melid = ?");
    static getBeats = Database.getData("SELECT bar, beat, chord, bass_pitch FROM `beats` WHERE melid = ?");
    static getMeta = Database.getData("SELECT key, style, tempoclass, instrument, rhythmfeel FROM `solo_info` WHERE melid = ?");
}