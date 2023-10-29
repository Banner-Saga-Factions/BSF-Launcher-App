// Source: https://stackoverflow.com/a/58544618
type EnumPlaceholder = { [s: string | number | symbol]: any };

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
