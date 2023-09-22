import { contextBridge, ipcRenderer } from "electron";

//ブラウザを閉じる
const closeBrowserView = () => {
  return ipcRenderer.invoke("close-browserview");
};

// ブラウザを表示する
const openBrowserView = (message: {
  teamId: string;
  channelId: string;
  messageId: string;
}) => {
  return ipcRenderer.send("open-browserview", { message: message });
};

const getAssetPath = (assetName: string) => {
  return ipcRenderer.invoke("get-asset-path", assetName);
};

// For communication with Next.js
const sendMessage = (message: any) => {
  ipcRenderer.send("message", message);
};

const addMessageListener = (listener: (event: any, ...args: any[]) => void) => {
  ipcRenderer.on("message", listener);
};

const removeMessageListener = (
  listener: (event: any, ...args: any[]) => void
) => {
  ipcRenderer.removeListener("message", listener);
};

// contextBridgeを使用して、安全にmainプロセスとの通信を行うAPIを公開
contextBridge.exposeInMainWorld("myAPI", {
  closeBrowserView,
  openBrowserView,
  getAssetPath,
  sendMessage,
  addMessageListener,
  removeMessageListener,
});
