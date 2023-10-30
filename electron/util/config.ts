import { readFileSync, writeFileSync, existsSync } from "node:fs";
import path from "node:path";

import { app } from "electron";

class ConfigManager implements IConfigManager {
    private _config: Config;

    constructor() {
        this._config = this.loadConfig();
    }

    get config(): Config {
        return this._config;
    }

    getConfigField = <k extends keyof Config>(key: k): Config[k] => this.config[key];
    getConfig = (): Config => this.config;
    setConfigField = <k extends keyof Config>(key: k, value: Config[k]) => {
        this.config[key] = value;
        this.saveConfig(this.config);
    };

    private saveConfig = (config: Config) => {
        let configFile = path.join(app.getPath("userData"), "config.json");
        writeFileSync(configFile, JSON.stringify(config));
    };

    private loadConfig = (): Config => {
        let configFile = path.join(app.getPath("userData"), "config.json");
        if (!existsSync(configFile)) {
            console.log(configFile);
            this.saveConfig({
                gamePath: "",
                gameVersion: "",
                username: "",
                richPresence: false,
            });
        }
        let configData = JSON.parse(readFileSync(configFile).toString());
        return configData;
    };
}

export const configManager = new ConfigManager();