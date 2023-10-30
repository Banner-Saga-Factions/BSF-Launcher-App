export declare global {
    interface Config {
        gamePath?: string;
        gameVersion?: string;
        richPresence?: boolean;
    };

    interface IConfigManager {
        get config(): Config;
        setConfigField: <k extends keyof Config>(key: k, value: Config[k]) => void;
        getConfigField: <k extends keyof Config>(key: k) => Config[k];
    }
}
