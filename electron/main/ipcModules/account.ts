import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";

import { app, ipcMain, BrowserWindow, safeStorage } from "electron";

import { currentConfig } from "./config";

import { ipcErrorCodes } from "../enums";

type redirectDetails = Electron.Event<Electron.WebContentsWillRedirectEventParams>;

let host = "http://localhost:8082";
if (process.env.NODE_ENV === "production") {
    host = "https://bsf.pieloaf.com";
}
const DISCORD_LOGIN_URL = `${host}/auth/discord-login`;
let loginWin: BrowserWindow | null = null;

export const accountIpcInit = () => {
    ipcMain.handle("getCurrentUser", getCurrentUser);
    ipcMain.handle("handleLogin", handleLogin);
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

const getCurrentUser = async (): Promise<ipcResponse> => {
    let accessToken: string | null = await getAccessToken();

    if (!accessToken) {
        return {
            data: null,
            error: {
                message: "No access token found",
                errorCode: ipcErrorCodes.ENoAccessToken,
            },
        };
    }

    let accountData;
    try {
        accountData = await fetch(`${host}/account/info`, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        });
    } catch (error) {
        return {
            data: null,
            error: {
                message: "Failed to fetch user data",
                errorCode: ipcErrorCodes.EServerError,
            },
        };
    }

    if (accountData.status === 200) {
        return {
            data: await accountData.json(),
        };
    } else {
        // TODO: log error somewhere
        return {
            data: null,
            error: {
                message: await accountData.json(),
                errorCode: ipcErrorCodes.EServerError,
            },
        };
    }
};

const createLoginWindow = (
    redirectHandler: (details: redirectDetails) => Promise<void>
) => {
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

const handleLogin = async (event: Electron.IpcMainInvokeEvent): Promise<ipcResponse> => {
    const handleLoginRedirect = async (details: redirectDetails) => {
        let loginRedirect = new URL(details.url);
        if (loginRedirect.protocol !== "bsf:") return;

        loginWin?.close();
        let accessToken = loginRedirect.searchParams.get("access_token");

        if (!accessToken) {
            return event.sender.send("login-complete", {
                data: null,
                error: {
                    message: "No access token found",
                    errorCode: ipcErrorCodes.ENoAccessToken,
                },
            } as ipcResponse);
        }
        await setAccessToken(accessToken);
        let username = currentConfig.getConfigField("username");

        event.sender.send("login-complete", {
            data: username,
        } as ipcResponse);
    };

    createLoginWindow(handleLoginRedirect);
    return {
        data: null,
    };
};
