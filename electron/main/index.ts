import { app, BrowserWindow, shell, ipcMain } from "electron";
import { release } from "node:os";
import { join } from "node:path";
import { update } from "./ipc/update";
import { account } from "./ipc/account";
import { gameManager } from "./ipc/gameManager";
import { configManager } from "./ipc/config";

process.env.DIST_ELECTRON = join(__dirname, "../");
process.env.DIST = join(process.env.DIST_ELECTRON, "../dist");
process.env.VITE_PUBLIC = process.env.VITE_DEV_SERVER_URL
    ? join(process.env.DIST_ELECTRON, "../public")
    : process.env.DIST;

// Disable GPU Acceleration for Windows 7
if (release().startsWith("6.1")) app.disableHardwareAcceleration();

// Set application name for Windows 10+ notifications
if (process.platform === "win32") app.setAppUserModelId("Banner Saga Factions");

if (!app.requestSingleInstanceLock()) {
    app.quit();
    process.exit(0);
}

let mainWin: BrowserWindow | null = null;

const preload = join(__dirname, "../preload/index.js");
const url = process.env.VITE_DEV_SERVER_URL;
const indexHtml = join(process.env.DIST, "index.html");

async function createWindow() {
    mainWin = new BrowserWindow({
        title: "Main window",
        icon: join(process.env.VITE_PUBLIC, "favicon.ico"),
        webPreferences: {
            preload,
        },
    });

    if (url) {
        // electron-vite-vue#298
        mainWin.loadURL(url);
        // Open devTool if the app is not packaged
        mainWin.webContents.openDevTools();
    } else {
        mainWin.loadFile(indexHtml);
    }

    // Test actively push message to the Electron-Renderer
    mainWin.webContents.on("did-finish-load", () => {
        mainWin?.webContents.send("main-process-message", new Date().toLocaleString());
    });

    // Make all links open with the browser, not with the application
    mainWin.webContents.setWindowOpenHandler(({ url }) => {
        if (url.startsWith("https:")) shell.openExternal(url);
        return { action: "deny" };
    });

    // Apply electron-updater
    update(mainWin);
    account(mainWin);
    gameManager(mainWin);
    configManager(mainWin);
}

app.whenReady().then(createWindow);

app.on("window-all-closed", () => {
    mainWin = null;
    if (process.platform !== "darwin") app.quit();
});

app.on("second-instance", () => {
    if (mainWin) {
        // Focus on the main window if the user tried to open another
        if (mainWin.isMinimized()) mainWin.restore();
        mainWin.focus();
    }
});

app.on("activate", () => {
    const allWindows = BrowserWindow.getAllWindows();
    if (allWindows.length) {
        allWindows[0].focus();
    } else {
        createWindow();
    }
});

// New window example arg: new windows url
ipcMain.handle("open-mainWin", (_, arg) => {
    const childWindow = new BrowserWindow({
        webPreferences: {
            preload,
        },
    });

    if (process.env.VITE_DEV_SERVER_URL) {
        childWindow.loadURL(`${url}#${arg}`);
    } else {
        childWindow.loadFile(indexHtml, { hash: arg });
    }
});
