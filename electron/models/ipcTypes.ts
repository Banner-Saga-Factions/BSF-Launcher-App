export interface ipcResponse {
    status: responseStatus;
    data: any;
}
export enum responseStatus {
    success = 0,
    error = 1,
}

declare global {
    interface ipcResponse {
        status: responseStatus;
        data: any;
    }
    enum responseStatus {
        success = 0,
        error = 1,
    }
}
