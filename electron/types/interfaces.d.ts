export {};
declare global {
    interface Window {
        accountsApi: IElectronAccountsApi;
        gameAPI: IElectronGameAPI;
    }

    declare enum InstallState {
        Downloading = "downloading",
        Verifying = "verifying",
        Installing = "installing",
    }

    export type InstallProgress = InstallState | number;

    interface ipcResponse<T> {
        data?: T;
        error?: Error;
    }

    interface IElectronAccountsApi {
        isLoggedIn: () => Promise<ipcResponse<boolean>>;
        getCurrentUser: () => Promise<ipcResponse<any>>;
        startLogin: () => Promise<ipcResponse<void>>;
        // TODO: define user type
        updateUser: ({ username: string }) => Promise<ipcResponse<void>>;
        loginHandler: (
            callback: (
                _evt: Electron.IpcRendererEvent,
                username: string,
                newUser: boolean,
                error?: Error
            ) => void
        ) => void;
    }

    interface IElectronGameAPI {
        launchGame: () => Promise<ipcResponse<void>>;
        checkGameIsInstalled: () => Promise<ipcResponse<boolean>>;
        installGame: () => Promise<ipcResponse<void>>;
        installHandler: (
            callback: (_evt: Electron.IpcRendererEvent, res: InstallProgress, error?: Error) => void
        ) => void;
    }
}
