export interface ipcResponse {
    status: responseStatus;
    data: any;
}

export enum responseStatus {
    success = 0,
    error = 1,
}
