import { useEffect, useState } from "react";
import { useInstalledStore } from "@/store/config";
import { InstallStates } from "@/models/states";


export const MainMenu = () => {
    const { state, error } = useInstalledStore();
    const [downloadProgress, setDownloadProgress] = useState(0);

    useEffect(() => {
        window.gameAPI.installHandler((_evt: Electron.IpcRendererEvent, res: InstallProgress) => {
            if (res === "downloading") {
                useInstalledStore.setState({ state: InstallStates.Downloading });
            } else if (res === "verifying") {
                useInstalledStore.setState({ state: InstallStates.Verifying });
            } else if (res === "installing") {
                useInstalledStore.setState({ state: InstallStates.Installing });
            } else if (typeof res === "number" && state === InstallStates.Downloading) {
                setDownloadProgress(res);
            }
        });

        window.gameAPI.checkGameIsInstalled().then((res) => {
            let newState: InstallStates = res.data
                ? InstallStates.Installed
                : InstallStates.NotInstalled;

            useInstalledStore.setState({
                state: newState,
            });
        });
    }, []);

    const tryInstall = () => {
        useInstalledStore.setState({ state: InstallStates.InstallPending });
        window.gameAPI.installGame().then((res) => {
            if (!res.error) {
                useInstalledStore.setState({ state: InstallStates.Installed });
            } else {
                useInstalledStore.setState({
                    state: InstallStates.NotInstalled,
                    error: res.error,
                });
            }
        });
    };

    const mainButton = () => {
        if (state === InstallStates.Installed) {
            return <button onClick={window.gameAPI.launchGame}>Play Game</button>;
        } else if (state === InstallStates.NotInstalled || state === InstallStates.InstallPending) {
            return (
                <button disabled={state === InstallStates.InstallPending} onClick={tryInstall}>
                    Install/Find Game
                </button>
            );
        } else {
            return (
                <div>
                    <span> {state.replace(/([a-z])([A-Z])/g, "$1 $2")} </span>
                    {state === InstallStates.Downloading && (
                        <progress value={downloadProgress} max={100} />
                    )}
                </div>
            );
        }
    };

    return (
        <div>
            <h2>You made it! :D</h2>
            {mainButton()}
            {error && <div> 🔴 Error Installing Game: {error.message}</div>}
        </div>
    );
};
