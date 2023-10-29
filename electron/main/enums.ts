export enum ipcErrorCodes {
    ENoAccessToken,
    EMissingConfigField,
    EInvalidConfigField,
    EOperationCancelled,
    EInstallError,
    EServerError,
    EUnkownError,
}

export enum launchArgs {
    SERVER = "--server",
    USERNAME = "--username",
    ACCESS_TOKEN = "--steam_id",
    STEAM = "--steam",
    FACTIONS = "--factions",
    DEVELOPER = "--developer",
}

export const enum InstallProgress {
    DOWNLOADING = "downloading",
    VERIFYING = "verifying",
    INSTALLING = "installing",
}
