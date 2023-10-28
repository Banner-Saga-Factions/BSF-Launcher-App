export interface IElectronAccountsAPI {
    getCurrentUser: () => Promise<ipcResponse>;
    startLogin: () => Promise<ipcResponse>;
    loginHandler: (callback: any) => void;
}

export interface IElectronGameAPI {
    launchGame: () => Promise<ipcResponse>;
}

declare global {
    interface Window {
        accountsAPI: IElectronAccountsAPI;
        gameAPI: IElectronGameAPI;
    }
}
