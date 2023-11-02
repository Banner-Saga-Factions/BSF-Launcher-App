import { InstallProgress } from "../util/installer";

export interface IElectronAccountsAPI {
    getCurrentUser: () => Promise<any>;
    updateUser: () => Promise<void>;
    startLogin: () => Promise<void>;
    updateUser: () => Promise<void>;
    loginHandler: (
        callback: (_evt: Electron.IpcRendererEvent, newUser: boolean, error?: Error) => void
    ) => void;
}

export interface IElectronGameAPI {
    launchGame: () => Promise<void>;
    checkGameIsInstalled: () => Promise<boolean>;
    installGame: () => Promise<void>;
    installHandler: (
        callback: (_evt: Electron.IpcRendererEvent, res: InstallProgress) => void
    ) => void;
}

declare global {
    interface Window {
        accountsAPI: IElectronAccountsAPI;
        gameAPI: IElectronGameAPI;
    }
}
