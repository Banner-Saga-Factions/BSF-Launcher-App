export enum loginStates {
    loggedOut,
    loginPending,
    loggedIn,
}

export enum installedStates {
    notInstalled,
    installPending,
    downloading,
    installing,
    installed,
}

export enum updateStates {
    noUpdate,
    checkingForUpdate,
    updateAvailable,
    updateNotAvailable,
}
