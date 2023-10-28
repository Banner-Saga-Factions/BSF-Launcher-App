import {
    app,
    ipcMain,
    BrowserWindow,
    WebContentsWillRedirectEventParams,
    safeStorage,
} from "electron";
import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { ipcResponse, responseStatus } from "../../models/ipcTypes";

let host = "http://localhost:8082";
if (process.env.NODE_ENV === "production") {
    host = "https://bsf.pieloaf.com";
}
const DISCORD_LOGIN_URL = `${host}/auth/discord-login`;
let loginWin: BrowserWindow | null = null;

export const account = (mainWin: Electron.BrowserWindow) => {
    ipcMain.handle("getCurrentUser", async (): Promise<ipcResponse> => {
        let accessToken: string | null = await getAccessToken();

        if (accessToken) {
            return {
                status: responseStatus.success,
                data: null,
            };
        }

        let accountData = await fetch(`${host}/account/info`, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        });

        if (accountData.status === 200) {
            return {
                status: responseStatus.success,
                data: await accountData.json(),
            };
        } else {
            // TODO: log error somewhere
            return {
                status: responseStatus.error,
                data: null,
            };
        }
    }),
        ipcMain.handle("startLogin", async (): Promise<ipcResponse> => {
            loginWin = new BrowserWindow({
                title: "Discord Login",
                width: 650,
                height: 1000,
                frame: false,
                resizable: false,
            });
            loginWin.once("ready-to-show", () => loginWin?.show());
            loginWin.loadURL(DISCORD_LOGIN_URL);
            loginWin.webContents.on("will-redirect", handleLoginRedirect);

            return {
                status: responseStatus.success,
                data: null,
            };
        });

    const handleLoginRedirect = async (
        details: Electron.Event<WebContentsWillRedirectEventParams>
    ) => {
        let loginRedirect = new URL(details.url);
        if (loginRedirect.protocol !== "bsf:") return;

        loginWin?.close();

        let access_token = loginRedirect.searchParams.get("access_token");
        console.log(loginRedirect);
        if (!access_token) {
            return mainWin?.webContents.send("login-complete", {
                status: responseStatus.error,
                data: null,
            } as ipcResponse);
        }
        await setAccessToken(access_token);
        console.log(access_token);
        mainWin?.webContents.send("login-complete", {
            status: responseStatus.success,
            data: access_token,
        } as ipcResponse);
    };
};

// probably should have some global variable for the access token
// idk yet
export const getAccessToken = async (): Promise<string | null> => {
    try {
        let encrypted_token: Buffer = await readFile(
            path.join(app.getPath("userData"), "access_token")
        );
        return safeStorage.decryptString(encrypted_token);
    } catch (error) {
        return null;
    }
};

const setAccessToken = async (accessToken: string): Promise<void> => {
    let encrypted_token = safeStorage.encryptString(accessToken);
    return writeFile(path.join(app.getPath("userData"), "access_token"), encrypted_token);
};
