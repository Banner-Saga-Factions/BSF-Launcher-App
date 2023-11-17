export enum LoginStates {
    CheckingLogin,
    LoggedOut,
    LoginPending,
    FirstLogin,
    LoggedIn,
}

export enum InstallStates {
    NotInstalled = "NotInstalled",
    InstallPending = "InstallPending",
    Downloading = "Downloading",
    Verifying = "Verifying",
    Installing = "Installing",
    Installed = "Installed",
}

export enum UpdateStates {
    NoUpdate,
    CheckingForUpdate,
    UpdateAvailable,
    UpdateNotAvailable,
}
