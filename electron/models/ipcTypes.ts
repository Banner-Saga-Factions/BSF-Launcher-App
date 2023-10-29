export enum ipcErrorCodes {
    ENoAccessToken,
    EMissingConfigField,
    EInvalidConfigField,
    EOperationCancelled,
    EInstallError,
    EServerError,
    EUnkownError,
}

export type responseError = {
    message: string;
    errorCode: ipcErrorCodes;
};

export type ipcResponse = {
    data: any;
    error?: responseError;
};

declare global {
    type ipcResponse = {
        data: any;
        error?: responseError;
    };
}
