import { globalShortcut, BrowserWindow } from "electron";

/**
 * ショートカットの定義
 */
const shortcuts: Array<{ accelerator: string; callback: () => void }> = [
  // リロード用のショートカット
  {
    accelerator: "CommandOrControl+R",
    callback: () => {
      const mainWindow = BrowserWindow.getFocusedWindow();
      if (mainWindow) {
        mainWindow.webContents.reload();
      }
    },
  },
  // 開発ツールを開くためのショートカット
  {
    accelerator: "CommandOrControl+Option+I",
    callback: () => {
      const mainWindow = BrowserWindow.getFocusedWindow();
      if (mainWindow) {
        mainWindow.webContents.openDevTools({ mode: "detach" });
      }
    },
  },
];

/**
 * ショートカットを登録する関数
 */
export const registerShortcuts = () => {
  for (const { accelerator, callback } of shortcuts) {
    globalShortcut.register(accelerator, callback);
  }
};

/**
 * ショートカットを解除する関数
 */
export const unregisterShortcuts = () => {
  for (const { accelerator } of shortcuts) {
    globalShortcut.unregister(accelerator);
  }
};
