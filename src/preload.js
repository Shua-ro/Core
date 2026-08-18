// See the Electron documentation for details on how to use preload scripts:
// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts
import { contextBridge, ipcRenderer } from "electron";

contextBridge.exposeInMainWorld("electronAPI", {
  addElectricity: (data) => ipcRenderer.invoke("addElectricity", data),
  getElectricity: () => ipcRenderer.invoke("getElectricity"),
  deleteElectricity: (id) => ipcRenderer.invoke("deleteElectricity", id),
  addGrocery: (data) => ipcRenderer.invoke("addGrocery", data),
  getGrocery: () => ipcRenderer.invoke("getGrocery"),
  deleteGrocery: (id) => ipcRenderer.invoke("deleteGrocery", id),
  addAllowance: (data) => ipcRenderer.invoke("addAllowance", data),
  getAllowance: () => ipcRenderer.invoke("getAllowance"),
  deleteAllowance: (id) => ipcRenderer.invoke("deleteAllowance", id),
  addCategory: (name) => ipcRenderer.invoke("addCategory", name),
  deleteCategory: (id) => ipcRenderer.invoke("deleteCategory", id),
  getCategory: () => ipcRenderer.invoke("getCategory"),
  addSavings: (data) => ipcRenderer.invoke("addSavings", data),
  deleteSavings: (id) => ipcRenderer.invoke("deleteSavings", id),
  getSavings: () => ipcRenderer.invoke("getSavings"),
});
