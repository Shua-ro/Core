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
    
    CREATE TABLE IF NOT EXISTS savingsCategory (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        category TEXT DEFAULT '--'
    );
    CREATE TABLE IF NOT EXISTS savings (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        category TEXT DEFAULT '--',
        amount INTEGER NOT NULL DEFAULT 0,
        date DATE NOT NULL,
        note TEXT DEFAULT '--'
    );
    `);

export { db };
