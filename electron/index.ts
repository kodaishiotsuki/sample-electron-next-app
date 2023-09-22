// モジュールのインポート
import { join } from "path";
import { format } from "url";
import {
  BrowserWindow,
  app,
  ipcMain,
  IpcMainEvent,
  BrowserView,
} from "electron";
import isDev from "electron-is-dev";
import prepareNext from "electron-next";
import { setBrowserViewBounds } from "./utils/browserView";
import { registerShortcuts, unregisterShortcuts } from "./utils/shortcuts";
import {
  hideSlackSidebar,
  sendShortcutToCloseSlackSidebar,
} from "./utils/slackSidebar";

// グローバル変数
let browserView: BrowserView | null = null;

/**
 * アプリが準備完了したときの処理
 */
app.on("ready", async () => {
  // Next.js の準備
  await prepareNext("./renderer");

  // メインウィンドウの作成
  const mainWindow = new BrowserWindow({
    fullscreen: true,
    title: "Zenmtry",
    webPreferences: {
      preload: join(__dirname, "preload.js"),
    },
  });

  // 開発モードと本番モードでロードするURLを変更
  const url = isDev
    ? "http://localhost:8000/"
    : format({
        pathname: join(__dirname, "../renderer/out/index.html"),
        protocol: "file:",
        slashes: true,
      });

  mainWindow.loadURL(url);

  // BrowserViewの初期化
  if (!browserView) {
    browserView = new BrowserView();
    mainWindow.setBrowserView(browserView);
    setBrowserViewBounds(mainWindow, browserView);
    browserView.setAutoResize({ width: true, height: true });
    mainWindow.setBrowserView(null);
    browserView.webContents.on("did-finish-load", () => {
      // 1秒遅らせてからショートカットを送信
      setTimeout(() => {
        if (browserView) {
          sendShortcutToCloseSlackSidebar(browserView);
          hideSlackSidebar(browserView);
        }
      }, 1000);
    });
  }

  // メインウィンドウがリサイズされたときにBrowserViewのサイズも変更
  mainWindow.on("resize", () => {
    if (browserView) {
      setBrowserViewBounds(mainWindow, browserView);
    }
  });

  // ショートカットの登録
  registerShortcuts();
});

/**
 * アプリが終了する前にショートカットを解除
 */
app.on("will-quit", () => {
  unregisterShortcuts();
});

/**
 * BrowserViewを開くための処理
 */
ipcMain.on(
  "open-browserview",
  async (
    _event,
    {
      message,
    }: { message: { teamId: string; channelId: string; messageId: string } }
  ) => {
    const mainWindow = BrowserWindow.getFocusedWindow();
    if (!mainWindow || !browserView) return;

    if (!mainWindow.getBrowserView()) {
      mainWindow.setBrowserView(browserView);
    }

    const baseUrl = "https://app.slack.com/client/";
    const url = `${baseUrl}${message.teamId}/${message.channelId}/thread/${message.channelId}-${message.messageId}`;
    // const url2 = `${baseUrl}${message.teamId}/${message.channelId}`

    // 現在のURLを取得
    const currentUrl = browserView.webContents.getURL();

    // 現在のURLがurl1またはurl2のいずれとも一致しない場合
    if (currentUrl !== url) {
      await browserView.webContents.loadURL(url);
    }

    // まず、既存のイベントリスナーを削除
    browserView.webContents.removeAllListeners("did-finish-load");

    // did-finish-load イベントが発火した際のリスナーを定義
    browserView.webContents.on("did-finish-load", () => {
      // 1秒遅らせてからショートカットを送信
      setTimeout(() => {
        if (browserView) {
          sendShortcutToCloseSlackSidebar(browserView);
          hideSlackSidebar(browserView);
        }
      }, 1000);
    });
  }
);

/**
 * BrowserViewを閉じるための処理
 */
ipcMain.handle("close-browserview", async () => {
  const mainWindow = BrowserWindow.getFocusedWindow();
  if (!mainWindow || !browserView) return;

  // BrowserViewの内容をクリア
  await browserView.webContents.loadURL("about:blank");

  mainWindow.setBrowserView(null);
});

//publicフォルダの画像パスを取得する
ipcMain.handle("get-asset-path", (_event, assetName) => {
  const assetPath = join(__dirname, "../renderer/public", assetName); // パスを適切に修正
  return assetPath;
});

// すべてのウィンドウが閉じた場合、アプリを終了
app.on("window-all-closed", app.quit);

/**
 * メッセージイベントの処理
 */
ipcMain.on("message", (event: IpcMainEvent, message: any) => {
  console.log(message);
  setTimeout(() => event.sender.send("message", "hi from electron"), 500);
});
