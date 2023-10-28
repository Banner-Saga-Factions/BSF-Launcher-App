import { app, ipcMain, dialog } from "electron";
import { execFile } from "node:child_process";
import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { ipcResponse, responseStatus } from "../../models/ipcTypes";
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
            let gamePath = await getGamePath(FACTIONS_APP_ID);
            if (gamePath?.game?.path) {
                currentConfig.setConfigField(
                    "gamePath",
                    path.join(gamePath.game.path, "win32", "The Banner Saga Factions.exe")
                );
            } else {
                return {
                    status: responseStatus.error,
                    data: null,
                };
            }
        }
        return {
            status: responseStatus.success,
            data: null,
        };
    });

    ipcMain.handle("installGame", async (): Promise<ipcResponse> => {
        await dialog.showOpenDialog({
            properties: ["openDirectory"],
            title: "Select Banner Saga Factions Install Location",
        });
        let accessToken: string | null = await getAccessToken();
        if (!accessToken) {
            return {
                status: responseStatus.error,
                data: null,
            };
        }

        await fetch(`${host}/getFactions`, {
            method: "GET",
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        });
        return {
            status: responseStatus.success,
            data: null,
        };
    });

    ipcMain.handle("launchGame", async (): Promise<ipcResponse> => {
        let accessToken: string | null = await getAccessToken();
        if (!accessToken) {
            return {
                status: responseStatus.error,
                data: null,
            };
        }

        execFile(currentConfig.getConfigField("gamePath"), [
            "--server",
            "http://localhost:8082/",
            "--username",
            "Pieloaf",
            "--developer",
            "--steam_id",
            accessToken,
            "--steam",
            "false",
            "--factions",
        ]);
        return {
            status: responseStatus.success,
            data: null,
        };
    });
};

// const getGamePath = async (): Promise<string> => {
//     let config = path.join(app.getPath("appData"), "config.json");
//     let configData = JSON.parse((await readFile(config)).toString());
//     return configData.gamePath || "";
// };

const setGamePath = async (gamePath: string): Promise<void> => {
    getGamePath(219340);
    let config = path.join(app.getPath("appData"), "config.json");
    let configData = JSON.parse((await readFile(config)).toString());
    configData.gamePath = gamePath;
    await writeFile(config, JSON.stringify(configData));
};
