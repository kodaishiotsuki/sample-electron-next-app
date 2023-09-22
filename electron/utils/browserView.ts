import { BrowserView, BrowserWindow } from "electron";

/**
 * BrowserViewのサイズと位置をメインウィンドウに合わせて調整する
 */
export const setBrowserViewBounds = (
  mainWindow: BrowserWindow,
  view: BrowserView
) => {
  const mainWindowSize = mainWindow.getSize();
  const x = Math.round(mainWindowSize[0] * 0.43);
  const y = 64;
  const width = Math.round(mainWindowSize[0] * 0.57);
  const height = mainWindowSize[1] - y;

  view.setBounds({ x, y, width, height });
};
