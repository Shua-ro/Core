import { ipcMain } from 'electron';
import { db, getElectricity } from './database.js';

ipcMain.handle('addElectricity', (event, data) =>{
    const stmt = db.prepare('INSERT INTO electricity(amount, date, note) VALUES(?, ?, ?)');
    const result = stmt.run(data.amount, data.date, data.note);
    return result;
});



/* GET HANDLERS LOGIC */
ipcMain.handle('getElectricity', ()=>{
    return getElectricity();
})