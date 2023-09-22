import { BrowserView } from "electron";

/**
 * Slackのサイドバーが既に閉じているかどうかをチェックする関数
 */
async function checkIfSidebarIsCollapsed(view: BrowserView): Promise<boolean> {
  const script = `document.querySelector('.p-workspace__sidebar--collapsed') !== null;`;
  return await view.webContents.executeJavaScript(script);
}
/**
 * Slackのサイドバーを閉じるためのショートカットを送信する関数
 */
export async function sendShortcutToCloseSlackSidebar(view: BrowserView) {
  const isSidebarCollapsed = await checkIfSidebarIsCollapsed(view);

  // サイドバーがすでに折りたたまれている場合は、ショートカットを送信しない
  if (isSidebarCollapsed) return;

  const isMac = process.platform === "darwin";
  const modifiers: ("command" | "control" | "shift")[] = isMac
    ? ["command", "shift"]
    : ["control", "shift"];

  await view.webContents.sendInputEvent({
    type: "keyDown",
    keyCode: "D",
    modifiers: modifiers,
  });

  await view.webContents.sendInputEvent({
    type: "keyUp",
    keyCode: "D",
    modifiers: modifiers,
  });
}

/**
 * Slackの新UIのサイドバーをCSSで非表示にする関数
 */
export async function hideSlackSidebar(view: BrowserView) {
  // slack新UIの不要箇所を非表示にする
  const cssToInsert = `
      .p-ia4_channel_list,
      .p-control_strip,
      .p-tab_rail {
        display: none !important;
      }
    `;
  view.webContents.insertCSS(cssToInsert);

  //新UIのクラス名
  // .p-ia4_top_nav  // ヘッダー
  // .p-ia4_channel_list // チャンネル一覧
  // .p-control_strip // ユーザーアイコン
  // .p-tab_rail // ワークスペース
}
