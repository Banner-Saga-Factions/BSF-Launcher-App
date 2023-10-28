import { app, ipcMain } from "electron";
import { execFile } from "node:child_process";
import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { ipcResponse, responseStatus } from "../../models/ipcTypes";
import { getAccessToken } from "./account";

export const gameManager = (mainWin: Electron.BrowserWindow) => {
    ipcMain.handle("launchGame", async (): Promise<ipcResponse> => {
        let accessToken: string | null = await getAccessToken();
        if (!accessToken) {
            return {
                status: responseStatus.error,
                data: null,
            };
        }

        execFile(
            "E:\\SteamLibrary\\steamapps\\common\\the banner saga factions\\win32\\The Banner Saga Factions.exe",
            ["--server", "http://localhost:8082/",
                "--username",
                "Pieloaf",
                "--factions",
                "--developer",
                "--steam_id",
                accessToken,
                "--steam",
                "false",
            ]
        );
        return {
            status: responseStatus.success,
            data: null,
        }
    });
};
