import { execFile } from "node:child_process";
import { existsSync } from "node:fs";
import path from "node:path";

import { app, ipcMain, dialog } from "electron";
import { getGamePath } from "steam-game-path";

import { getAccessToken } from "./account";
import { configManager } from "../../util/config";
import { GameInstaller } from "../../util/installer";

const host =
    process.env.NODE_ENV === "production" ? "https://bsf.pieloaf.com" : "http://localhost:8082";

const FACTIONS_APP_ID = 219340;

enum launchArgs {
    SERVER = "--server",
    USERNAME = "--username",
    ACCESS_TOKEN = "--steam_id",
    STEAM = "--steam",
    FACTIONS = "--factions",
    DEVELOPER = "--developer",
    DEBUG = "--debug",
    VS_COUNTDOWN = "--versus_countdown",
    VS_START = "--versus_start",
}

export const gameManagerIpcInit = () => {
    ipcMain.handle("checkGameIsInstalled", checkGameIsInstalled);
    ipcMain.handle("installGame", handleInstall);
    ipcMain.handle("launchGame", handleLaunchGame);
};

const checkGameIsInstalled = async (): Promise<boolean> => {
    // return false;
    if (!configManager.getConfigField("gamePath")) {
        // try get path automatically from steam
        let gamePath = await getGamePath(FACTIONS_APP_ID);
        if (gamePath?.game?.path) {
            setGamePath(gamePath.game.path);
        } else {
            return false;
        }
    }
    return true;
};

const handleInstall = async (event: Electron.IpcMainInvokeEvent): Promise<void> => {
    let dialogResult = await dialog.showOpenDialog({
        properties: ["openDirectory"],
        title: "Select Banner Saga Factions Install Location",
    });

    // if operation cancelled or no directory selected
    if (dialogResult.canceled || !dialogResult.filePaths.length) {
        throw new Error("Unable to install game: No directory selected");
    }

    // User selected path
    let installDir = dialogResult.filePaths[0];

    //=== Check if pointing to existing game install ===//
    // check if executable directory chosen
    if (path.basename(installDir) === "win32") {
        // go up one level to game directory
        installDir = path.resolve(installDir, "..");
    }

    // if user selected directory of existing game install
    if (existsSync(path.join(installDir, "win32", "The Banner Saga Factions.exe"))) {
        // name change for readability
        let gameDir = installDir;
        // set path
        setGamePath(gameDir);
        return;
    }
    //=== End check ===//

    let accessToken = await getAccessToken();
    if (!accessToken) {
        throw new Error("Unable to install game: Missing access token");
    }

    try {
        let gameDir = await new GameInstaller(accessToken, installDir, event.sender).installGame();

        setGamePath(gameDir);
    } catch (error) {
        throw new Error(`Failed to install game: ${error}`, { cause: error });
    }

    return;
};

const handleLaunchGame = async (): Promise<void> => {
    let accessToken: string | null = await getAccessToken();
    let exePath = configManager.getConfigField("gamePath");

    if (!accessToken) {
        throw new Error("Unable to launch game: Missing accessToken");
    } else if (!exePath) {
        throw new Error("Unable to launch game: Missing gamePath");
    }

    execFile(exePath, [
        launchArgs.SERVER,
        host,
        launchArgs.USERNAME,
        "_default_",
        launchArgs.ACCESS_TOKEN,
        accessToken,
        launchArgs.STEAM,
        "false",
        process.env.NODE_ENV === "production" ? "" : launchArgs.DEVELOPER,
        launchArgs.FACTIONS,
    ]);

    return;
};

const setGamePath = async (gamePath: string): Promise<string> => {
    if (path.basename(gamePath) !== "win32") {
        gamePath = path.join(gamePath, "win32");
    }
    let gameExePath = path.join(gamePath, "The Banner Saga Factions.exe");
    configManager.setConfigField("gamePath", gameExePath);
    return gameExePath;
};
