export interface IConfigAPI {
    getConfig: () => Promise<ipcResponse>;
}

export interface IElectronAccountsAPI {
    getCurrentUser: () => Promise<ipcResponse>;
    updateUser: () => Promise<ipcResponse>;
    startLogin: () => Promise<ipcResponse>;
    loginHandler: (callback: any) => void;
    updateUser: () => Promise<ipcResponse>;
}

export interface IElectronGameAPI {
    launchGame: () => Promise<ipcResponse>;
    checkGameIsInstalled: () => Promise<ipcResponse>;
    installGame: () => Promise<ipcResponse>;
    gameSetHandler: (callback: any) => void;
    installHandler: (callback: any) => void;
}

declare global {
    interface Window {
        configAPI: IConfigAPI;
        accountsAPI: IElectronAccountsAPI;
        gameAPI: IElectronGameAPI;
    }
}
