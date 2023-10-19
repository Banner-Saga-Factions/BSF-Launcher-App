/// <reference types="" />

export interface IElectronAPI {
    getCurrentUser: () => Promise<ipcResponse>;
    startLogin: () => Promise<ipcResponse>;
    loginHandler: (callback: any) => void;
}

declare global {
    interface Window {
        accountsAPI: IElectronAPI;
    }
}
