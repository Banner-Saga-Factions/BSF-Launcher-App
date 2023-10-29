export enum ipcErrorCodes {
    ENoAccessToken,
    EMissingConfigField,
    EInvalidConfigField,
    EOperationCancelled,
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
