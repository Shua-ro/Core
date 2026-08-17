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

/* ALLOWANCE HANDLERS */
ipcMain.handle("addAllowance", (event, data) => {
  const stmt = db.prepare(
    "INSERT INTO allowance(amount, date, child) VALUES(?, ?, ?)",
  );
  const result = stmt.run(data.amount, data.date, data.child);
  return result;
});
ipcMain.handle("deleteAllowance", (event, id) => {
  const stmt = db.prepare("DELETE FROM allowance WHERE id=?");
  const result = stmt.run(id);
  return result;
});

/*========================================================================================= 
  SAVINGS HANDLERS 
  =========================================================================================*/

/* savingCategory */
ipcMain.handle("addCategory", (event, name) => {
  const stmt = db.prepare("INSERT INTO savingsCategory(category) VALUES(?)");
  const result = stmt.run(name);
  return result;
});
ipcMain.handle("DeleteCategory", (event, id) => {
  const stmt = db.prepapre("DELETE FROM savingsCategory WHERE id=?");
  const result = stmt.run(id.category);
  return result;
});

/* savings */
ipcMain.handle("addSavings", (event, data) => {
  const stmt = db.prepare(
    "INSERT INTO savings(category, amount, date, note) VALUES(?,?,?,?)",
  );
  const result = stmt.run(data.category, data.amount, data.date, data.note);
  return result;
});
ipcMain.handle("deleteSavings", (event, id) => {
  const stmt = db.prepare("DELETE FROM savings WHERE id=?");
  const result = stmt.run(id);
  return result;
});

/*============================================================================================
   GET HANDLERS LOGIC 
  ==================================================================================================*/
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
ipcMain.handle("getAllowance", () => {
  const stmt = db.prepare("SELECT * FROM allowance ORDER BY date DESC");
  const result = stmt.all();
  return result;
});
ipcMain.handle("getCategory", () => {
  const stmt = db.prepare("SELECT * FROM savingsCategory");
  const result = stmt.all();
  return result;
});
ipcMain.handle("getSavings", () => {
  const stmt = db.prepare("SELECT * FROM savings ORDER BY date DESC");
  const result = stmt.all();
  return result;
});
