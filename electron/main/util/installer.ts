import { createHash } from "node:crypto";
import { createWriteStream, createReadStream } from "node:fs";
import { readFile, rm } from "node:fs/promises";
import path from "node:path";
import { Readable } from "node:stream";
import { ReadableStream } from "node:stream/web";

import { app } from "electron";
import { parseXml } from "@rgrove/parse-xml";
import { x } from "tar";
const tar = { x };

import { currentConfig } from "../ipcModules/config";
import { InstallProgress } from "../enums";

const host =
    process.env.NODE_ENV === "production"
        ? "https://bsf.pieloaf.com"
        : "http://localhost:8082";

const download = async (url: URL, out: string, headers?: { [key: string]: string }) => {
    // Source: https://stackoverflow.com/a/74722818
    try {
        Readable.fromWeb(
            (await fetch(url, { method: "GET", headers: headers }))
                .body as ReadableStream<any>
        ).pipe(createWriteStream(out));
    } catch (error) {
        throw error;
    }
};

const generateChecksum = async (path: string): Promise<string> => {
    // Source: https://stackoverflow.com/a/18658613
    let fd = createReadStream(path);
    let hash = createHash("md5");

    hash.setEncoding("hex");

    fd.pipe(hash);
    return new Promise((resolve, reject) => {
        hash.on("finish", () => {
            resolve(hash.read());
        });
    });
};

const verifyChecksum = async (path: string): Promise<boolean> => {
    let checksum = (await fetch(`${host}/download/checksum`)).text();
    let localChecksum = await generateChecksum(path);

    return localChecksum === (await checksum);
};

const getGameVersion = async (gamePath: string): Promise<string> => {
    let manifestPath = path.join(gamePath, "win32", "META-INF", "AIR", "application.xml");
    let metaData = parseXml(await readFile(manifestPath, "utf8")).root;
    if (!metaData) {
        throw new Error("Failed to parse application.xml");
    }

    // ts-ignore because ts doesn't pick up the `node.type` check to ensure XmlElement
    let versionNode = metaData.children.find((node) => {
        return (
            node.type === "element" &&
            // @ts-ignore
            node.name === "versionNumber" &&
            // @ts-ignore
            node.text
        );
    });

    if (!versionNode) {
        throw new Error("Failed to find versionNumber in application.xml");
    }

    // @ts-ignore
    return versionNode.text;
};

const sendProgress = (window: Electron.WebContents, data: InstallProgress) => {
    window.send("install-progress", {
        data,
    } as ipcResponse);
};

export const installGame = async (
    accessToken: string,
    installDir: string,
    window: Electron.WebContents
): Promise<string> => {
    let downloadPath = path.join(app.getPath("temp"), "factions.tar.gz");

    try {
        sendProgress(window, InstallProgress.DOWNLOADING);
        // Download
        await download(new URL(`${host}/download`), downloadPath, {
            Authorization: `Bearer ${accessToken}`,
        });

        sendProgress(window, InstallProgress.VERIFYING);
        if (!(await verifyChecksum(downloadPath))) {
            throw new Error("Failed to verify checksum");
        }

        sendProgress(window, InstallProgress.INSTALLING);

        tar.x({
            file: downloadPath,
            cwd: installDir,
        });
        let gamePath = path.join(installDir, "the banner saga factions");
        // Get game version
        let version = await getGameVersion(gamePath);
        currentConfig.setConfigField("gameVersion", version);
        // Cleanup
        rm(downloadPath);
        return gamePath;
    } catch (error) {
        throw error;
    }
};
