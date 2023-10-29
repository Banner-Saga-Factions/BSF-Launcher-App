import { execFile } from "node:child_process";
import { existsSync } from "node:fs";
import path from "node:path";

import { app, ipcMain, dialog } from "electron";
import { getGamePath } from "steam-game-path";

import { getAccessToken } from "./account";
import { currentConfig } from "./config";
import { installGame } from "../util/installer";
import { launchArgs, ipcErrorCodes } from "../enums";

const host =
    process.env.NODE_ENV === "production"
        ? "https://bsf.pieloaf.com"
        : "http://localhost:8082";
const FACTIONS_APP_ID = 219340;

export const gameManagerIpcInit = () => {
    ipcMain.handle("checkGameIsInstalled", checkGameIsInstalled);
    ipcMain.handle("installGame", handledInstallGame);
    ipcMain.handle("launchGame", handleLaunchGame);
};

const checkGameIsInstalled = async (): Promise<ipcResponse> => {
    if (!currentConfig.getConfigField("gamePath")) {
        // try get path automatically from steam
        let gamePath = await getGamePath(FACTIONS_APP_ID);
        if (gamePath?.game?.path) {
            setGamePath(gamePath.game.path);
        } else {
            return {
                data: null,
                error: {
                    message: "No game path set",
                    errorCode: ipcErrorCodes.EInvalidConfigField,
                },
            };
        }
    }
    return {
        data: null,
    };
};

const handledInstallGame = async (
    event: Electron.IpcMainInvokeEvent
): Promise<ipcResponse> => {
    let dialogResult = await dialog.showOpenDialog({
        properties: ["openDirectory"],
        title: "Select Banner Saga Factions Install Location",
    });

    // if operation cancelled or no directory selected
    if (dialogResult.canceled || !dialogResult.filePaths.length) {
        return {
            data: null,
            error: {
                message: "No directory selected",
                errorCode: ipcErrorCodes.EOperationCancelled,
            },
        };
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
        return {
            data: null,
        };
    }
    //=== End check ===//

    let accessToken = await getAccessToken();
    if (!accessToken) {
        return {
            data: null,
            error: {
                message: "No access token found",
                errorCode: ipcErrorCodes.ENoAccessToken,
            },
        };
    }

    try {
        let gameDir = await installGame(accessToken, installDir, event.sender);
        setGamePath(gameDir);
    } catch (error) {
        return {
            data: null,
            error: {
                message: (error as Error).message,
                errorCode: ipcErrorCodes.EInstallError,
            },
        };
    }

    return {
        data: null,
    };
};

const handleLaunchGame = async (): Promise<ipcResponse> => {
    let accessToken: string | null = await getAccessToken();
    let exePath = currentConfig.getConfigField("gamePath");
    let username = currentConfig.getConfigField("username");

    if (!(accessToken && exePath && username)) {
        return {
            data: null,
            error: {
                message: `Missing config field: ${!exePath ? "gamePath" : "username"}`,
                errorCode: ipcErrorCodes.EMissingConfigField,
            },
        };
    }

    execFile(exePath, [
        launchArgs.SERVER,
        host,
        launchArgs.USERNAME,
        username,
        launchArgs.ACCESS_TOKEN,
        accessToken,
        launchArgs.STEAM,
        "false",
        process.env.NODE_ENV === "production" ? "" : launchArgs.DEVELOPER,
        launchArgs.FACTIONS,
    ]);

    return {
        data: null,
    };
};

const setGamePath = async (gamePath: string): Promise<string> => {
    if (path.basename(gamePath) !== "win32") {
        gamePath = path.join(gamePath, "win32");
    }
    let gameExePath = path.join(gamePath, "The Banner Saga Factions.exe");
    currentConfig.setConfigField("gamePath", gameExePath);
    return gameExePath;
};
