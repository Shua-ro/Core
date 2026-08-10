import Database from 'better-sqlite3';
import { app, BrowserWindow, Menu } from "electron";
import path from "node:path";

const dbLocation = path.join(app.getPath('userData'), "coreApp.db");

const db = new Database(dbLocation); 
console.log(dbLocation);


db.exec(`
    CREATE TABLE IF NOT EXISTS electricity (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        amount INTEGER NOT NULL DEFAULT 0,
        date DATE NOT NULL,
        note TEXT DEFAULT '--'
    );

    CREATE TABLE IF NOT EXISTS groceries (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        amount INTEGER NOT NULL DEFAULT 0,
        date DATE NOT NULL,
        note TEXT DEFAULT '--'
    );

    CREATE TABLE IF NOT EXISTS allowance (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        amount INTEGER NOT NULL DEFAULT 0,
        date DATE NOT NULL,
        child TEXT DEFAULT '--'
    );

    `);

function getElectricity() {
    const stmt = db.prepare('SELECT * FROM electricity ORDER BY date DESC');
    return stmt.all();
}
export { db, getElectricity};