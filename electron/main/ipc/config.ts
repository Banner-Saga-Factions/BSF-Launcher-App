import { app, ipcMain } from "electron";
import { readFileSync, writeFileSync, existsSync } from "node:fs";
import path from "node:path";

import { ipcResponse } from "../ipcTypes";

export const configManager = (mainWin: Electron.BrowserWindow) => {
    ipcMain.handle("getConfig", async (): Promise<ipcResponse> => {
        return {
            data: currentConfig.getConfig(),
        };
    });
};

const loadConfig = (): Config => {
    let configFile = path.join(app.getPath("userData"), "config.json");
    if (!existsSync(configFile)) {
        console.log(configFile);
        saveConfig({
            gamePath: "",
            gameVersion: "",
            username: "",
            richPresence: false,
        });
    }
    let configData = JSON.parse(readFileSync(configFile).toString());
    return configData;
};

const saveConfig = (config: Config) => {
    let configFile = path.join(app.getPath("userData"), "config.json");
    writeFileSync(configFile, JSON.stringify(config));
    console.log("Config saved");
};

const config: Config = loadConfig();

export const currentConfig = {
    getConfigField: <k extends keyof Config>(key: k): Config[k] => config[key],
    getConfig: () => config,

    setConfigField: <k extends keyof Config>(key: k, value: Config[k]) => {
        config[key] = value;
        saveConfig(config);
    },
};
