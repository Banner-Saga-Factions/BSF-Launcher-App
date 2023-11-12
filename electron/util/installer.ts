import { createHash } from "node:crypto";
import { createWriteStream, createReadStream, readFileSync } from "node:fs";
import { readFile, rm } from "node:fs/promises";
import path from "node:path";
import { Readable } from "node:stream";
import { ReadableStream } from "node:stream/web";

import { app } from "electron";
import { XmlElement, parseXml } from "@rgrove/parse-xml";
import { x } from "tar";
const tar = { x };

// enum InstallState {
//     Downloading = "downloading",
//     Verifying = "verifying",
//     Installing = "installing",
// }

// type InstallProgress = InstallState | number;

import { configManager } from "./config";

const host =
    process.env.NODE_ENV === "production" ? "https://bsf.pieloaf.com" : "http://localhost:8082";

export class GameInstaller {
    private requestOptions: RequestInit;
    private installDir: string;
    private window: Electron.WebContents;

    constructor(accessToken: string, installDir: string, window: Electron.WebContents) {
        this.requestOptions = {
            method: "GET",
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        };
        this.installDir = installDir;
        this.window = window;
    }

    private sendProgress = async (data: InstallProgress) => {
        this.window.send("install-progress", data);
    };

    private async downloadGame(outputFile: string) {
        try {
            const response = await fetch(`${host}/download`, this.requestOptions);

            if (!response.ok) {
                throw new Error(
                    `Failed to download file: ${response.status} ${response.statusText}`
                );
            }

            const totalLength = Number(response.headers.get("Content-Length"));
            const readStream = Readable.fromWeb(response.body as ReadableStream<any>);

            let bytesRead = 0;
            readStream.forEach((chunk) => {
                bytesRead += chunk.length;
                this.sendProgress(Math.round((bytesRead / totalLength) * 100));
            });

            return new Promise((resolve, reject) => {
                readStream
                    .pipe(createWriteStream(outputFile))
                    .on("finish", () => resolve(null))
                    .on("error", (error) => reject(error));
            });
        } catch (error) {
            throw error;
        }
    }

    private generateChecksum = (filePath: string): string => {
        let fileData = readFileSync(filePath, { encoding: null });
        return createHash("md5").update(fileData).digest("hex");
    };

    private verifyChecksum = async (filePath: string): Promise<boolean> => {
        const checksumResponse = await fetch(`${host}/download/checksum`, this.requestOptions);
        if (!checksumResponse.ok) {
            throw new Error(
                `Failed to get remote checksum: ${checksumResponse.status} ${checksumResponse.statusText}`
            );
        }
        let checksum = await checksumResponse.text();
        let localChecksum = this.generateChecksum(filePath);

        return localChecksum === checksum;
    };

    private getGameVersion = async (gamePath: string): Promise<string> => {
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

        return (versionNode as XmlElement).text;
    };

    public installGame = async (): Promise<string> => {
        let downloadPath = path.join(app.getPath("temp"), "factions.tar.gz");

        try {
            this.sendProgress(InstallState.Downloading);
            await this.downloadGame(downloadPath);

            // wait until readstream is done
            this.sendProgress(InstallState.Verifying);
            if (!(await this.verifyChecksum(downloadPath))) {
                throw new Error("Failed to verify checksum");
            }

            this.sendProgress(InstallState.Installing);

            await tar.x({
                file: downloadPath,
                cwd: this.installDir,
            });
            let gamePath = path.join(this.installDir, "the banner saga factions");
            // Get game version
            let version = await this.getGameVersion(gamePath);
            configManager.setConfigField("gameVersion", version);
            // Cleanup
            rm(downloadPath);
            return gamePath;
        } catch (error) {
            throw error;
        }
    };
}
