import {
    app,
    ipcMain,
    BrowserWindow,
    WebContentsWillRedirectEventParams,
} from "electron";
import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { ipcResponse, responseStatus } from "../../ipcTypes";

const DISCORD_LOGIN_URL = "http://localhost:8082/auth/discord-login";
let loginWin: BrowserWindow | null = null;

export const account = (mainWin: Electron.BrowserWindow) => {
    ipcMain.handle("getCurrentUser", async (): Promise<ipcResponse> => {
        let accessToken: string | null = await getAccessToken();

        if (!accessToken) {
            return {
                status: responseStatus.success,
                data: null,
            };
        }

        let accountData = await fetch(`https://bsf.pieloaf.com/account/me`, {
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
                webPreferences: {
                    // preload: path.join(__dirname, "login.js"),
                },
            });

            loginWin.loadURL("http://localhost:8082/auth/discord-oauth-callback");
            loginWin.webContents.on("will-redirect", handleLoginRedirect);

            return {
                status: responseStatus.success,
                data: null,
            };
        });

    const handleLoginRedirect = async (
        details: Electron.Event<WebContentsWillRedirectEventParams>
    ) => {
        console.log(details);
        let loginRedirect = new URL(details.url);
        if (loginRedirect.protocol !== "bsf:") return;

        loginWin?.close();
        let jwt = loginRedirect.searchParams.get("jwt");
        if (!jwt) return mainWin?.webContents.send("login-error");
        await setAccessToken(jwt);
        mainWin?.webContents.send("login-success");

        // TODO: renderer should call getCurrentUser on login-success
    };
};

// probably should have some global variable for the access token
// idk yet
export const getAccessToken = async (): Promise<string | null> => {
    try {
        return readFile(path.join(app.getPath("userData"), "access_token"), "utf8");
    } catch (error) {
        return null;
    }
};

const setAccessToken = async (accessToken: string): Promise<void> => {
    console.log(app.getPath("userData"))
    // return writeFile(
    //     path.join(app.getPath("userData"), "access_token"),
    //     accessToken,
    //     "utf8"
    // );
};
