import { app, ipcMain, dialog } from "electron";
import { execFile } from "node:child_process";
import { existsSync, createWriteStream } from "node:fs";

import path from "node:path";
import { ipcResponse, ipcErrorCodes } from "../ipcTypes";
import { getAccessToken } from "./account";
import { currentConfig } from "./config";
import { getGamePath } from "steam-game-path";

const FACTIONS_APP_ID = 219340;

let host = "http://localhost:8082";

if (process.env.NODE_ENV === "production") {
    host = "https://bsf.pieloaf.com";
}

export const gameManager = (mainWin: Electron.BrowserWindow) => {
    ipcMain.handle("checkForGame", async (): Promise<ipcResponse> => {
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
    });

    ipcMain.handle("installGame", async (): Promise<ipcResponse> => {
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

        // if directory already has game installed
        let gamePath = dialogResult.filePaths[0];
        setGamePath(gamePath);
        if (existsSync(gamePath)) {
            return {
                data: null,
            };
        }

        let access_token = await getAccessToken();
        if (!access_token) {
            return {
                data: null,
                error: {
                    message: "No access token found",
                    errorCode: ipcErrorCodes.ENoAccessToken,
                },
            };
        }
        try {
            await download(new URL(`${host}/download`), app.getPath("temp"), {
                Authorization: `Bearer ${access_token}`,
            });
        } catch (error) {
            return {
                data: null,
                error: {
                    message: "Failed to download game",
                    errorCode: ipcErrorCodes.EServerError,
                },
            };
        }
        return {
            data: null,
        };
    });

    ipcMain.handle("launchGame", async (): Promise<ipcResponse> => {
        let accessToken: string | null = await getAccessToken();
        let exePath = currentConfig.getConfigField("gamePath");
        let username = currentConfig.getConfigField("username");

        if (!(accessToken && exePath && username)) {
            return {
                data: null,
                error: {
                    message: `Missing config field: ${
                        !exePath ? "gamePath" : "username"
                    }`,
                    errorCode: ipcErrorCodes.EMissingConfigField,
                },
            };
        }

        execFile(exePath, [
            "--server",
            "http://localhost:8082/",
            "--username",
            username,
            "--developer",
            "--steam_id",
            accessToken,
            "--steam",
            "false",
            "--factions",
        ]);

        return {
            data: null,
        };
    });
};

const setGamePath = async (gamePath: string): Promise<string> => {
    let gameExePath = path.join(gamePath, "win32", "The Banner Saga Factions.exe");
    currentConfig.setConfigField("gamePath", gameExePath);
    return gameExePath;
};

const download = async (url: URL, path: string, headers?: { [key: string]: string }) => {
    try {
        Readable.fromWeb(
            (await fetch(url, { method: "GET", headers: headers }))
                .body as ReadableStream<any>
        ).pipe(createWriteStream(path));
    } catch (error) {
        throw error;
    }
};
