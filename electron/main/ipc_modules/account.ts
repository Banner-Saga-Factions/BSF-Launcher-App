import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";

import { app, ipcMain, BrowserWindow, safeStorage } from "electron";
import { configManager } from "../../util/config";

type redirectDetails = Electron.Event<Electron.WebContentsWillRedirectEventParams>;

let host = "http://localhost:8082";
if (process.env.NODE_ENV === "production") {
    host = "https://bsf.pieloaf.com";
}
const DISCORD_LOGIN_URL = `${host}/auth/discord-login`;
let loginWin: BrowserWindow | null = null;

export const accountIpcInit = () => {
    ipcMain.handle("getCurrentUser", getCurrentUser);
    ipcMain.handle("startLogin", handleLogin);
    ipcMain.handle("updateUser", updateUser);
};

export const getAccessToken = async (): Promise<string | null> => {
    try {
        let encryptedToken: Buffer = await readFile(
            path.join(app.getPath("userData"), "access_token")
        );
        return safeStorage.decryptString(encryptedToken);
    } catch (error) {
        return null;
    }
};

const setAccessToken = async (accessToken: string): Promise<void> => {
    let encryptedToken = safeStorage.encryptString(accessToken);
    return writeFile(path.join(app.getPath("userData"), "access_token"), encryptedToken);
};

const getCurrentUser = async (): Promise</*User */ any | null> => {
    let accessToken: string | null = await getAccessToken();

    if (!accessToken) {
        return null;
    }

    let accountData;
    try {
        const requestOptions: RequestInit = {
            method: "GET",
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        };

        accountData = await fetch(`${host}/account/info`, requestOptions);

        if (!accountData.ok) {
            throw new Error(
                `Failed to fetch user data: ${accountData.status} ${accountData.statusText}`
            );
        }
    } catch (error) {
        throw (error as Error).cause;
    }

    return await accountData.json();
};

const createLoginWindow = (redirectHandler: (details: redirectDetails) => Promise<void>) => {
    loginWin = new BrowserWindow({
        title: "Discord Login",
        width: 650 * 0.75,
        height: 1000 * 0.75,
        frame: false,
        resizable: false,
    });
    loginWin.once("ready-to-show", () => loginWin?.show());
    loginWin.loadURL(DISCORD_LOGIN_URL);
    loginWin.webContents.on("will-redirect", redirectHandler);
};

const handleLogin = async (event: Electron.IpcMainInvokeEvent): Promise<void> => {
    const handleLoginRedirect = async (details: redirectDetails) => {
        let loginRedirect = new URL(details.url);
        if (loginRedirect.protocol !== "bsf:") return;

        loginWin?.close();
        let accessToken = loginRedirect.searchParams.get("access_token");
        let error = loginRedirect.searchParams.get("error");

        let isNewUser = loginRedirect.searchParams.get("new_user");
        let username = loginRedirect.searchParams.get("username");

        if (!accessToken) {
            let errorMsg = error ? error : "An unknown error occurred";
            return event.sender.send("login-error", "", false, new Error(errorMsg));
        }

        await setAccessToken(accessToken);

        event.sender.send("login-complete", username, isNewUser === "true");
    };

    createLoginWindow(handleLoginRedirect);
    return;
};

const updateUser = async (
    event: Electron.IpcMainInvokeEvent,
    { username }: { username: string }
) => {
    let accessToken = await getAccessToken();
    if (!accessToken) {
        return;
    }

    let requestOptions: RequestInit = {
        method: "POST",
        headers: {
            Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
            username: username,
        }),
    };

    let response = await fetch(`${host}/account/update`, requestOptions);

    if (!response.ok) {
        throw new Error(`Failed to update user data: ${response.status} ${response.statusText}`);
    }

    configManager.setConfigField("username", username);
    return;
};
