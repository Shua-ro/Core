// See the Electron documentation for details on how to use preload scripts:
// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts
import { contextBridge, ipcRenderer } from "electron";

contextBridge.exposeInMainWorld("electronAPI", {
  addElectricity: (data) => ipcRenderer.invoke("addElectricity", data),
  getElectricity: () => ipcRenderer.invoke("getElectricity"),
  deleteElectricity: (id) => ipcRenderer.invoke("deleteElectricity", id)
});
