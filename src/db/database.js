import Database from "better-sqlite3";
import { app } from "electron";
import path from "node:path";

const dbLocation = path.join(app.getPath("userData"), "coreApp.db");

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

export { db };
