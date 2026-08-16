import { ipcMain } from "electron";
import { db } from "./database.js";

/* ELECTRICITY HANDLERS */
ipcMain.handle("addElectricity", (event, data) => {
  const stmt = db.prepare(
    "INSERT INTO electricity(amount, date, note) VALUES(?, ?, ?)",
  );
  const result = stmt.run(data.amount, data.date, data.note);
  return result;
});
ipcMain.handle("deleteElectricity", (event, id) => {
  const stmt = db.prepare("DELETE FROM electricity WHERE id=?");
  const result = stmt.run(id);
  return result;
});

/* GROCERIES HANDLERS */
ipcMain.handle("addGrocery", (event, data) => {
  const stmt = db.prepare(
    "INSERT INTO groceries(amount, date, note) VALUES(?, ?, ?)",
  );
  const result = stmt.run(data.amount, data.date, data.note);
  return result;
});
ipcMain.handle("deleteGrocery", (event, id) => {
  const stmt = db.prepare("DELETE FROM groceries WHERE id=?");
  const result = stmt.run(id);
  return result;
});

/* GET HANDLERS LOGIC */
ipcMain.handle("getElectricity", () => {
  const stmt = db.prepare("SELECT * FROM electricity ORDER BY date DESC");
  const result = stmt.all();
  return result;
});
ipcMain.handle("getGrocery", () => {
  const stmt = db.prepare("SELECT * FROM groceries ORDER BY date DESC");
  const result = stmt.all();
  return result;
});
