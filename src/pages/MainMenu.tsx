import { useEffect, useState } from "react";
import { ipcResponse, responseStatus } from "@/models/ipc";
import { useInstalledStore } from "@/store/config";
import { installedStates } from "@/models/states";

const MainMenu = () => {
    const { state } = useInstalledStore();

    useEffect(() => {
        window.gameAPI.installHandler(
            (_evt: Electron.IpcRendererEvent, res: ipcResponse) => {
                if (res.status === responseStatus.success) {
                    useInstalledStore.setState({
                        state: res.data as installedStates,
                    });
                }
            }
        );
    }, []);

    useEffect(() => {
        switch (state) {
            case installedStates.installed:
                window.gameAPI.checkForGame().then((res: any) => {
                    if (res.status === responseStatus.success) {
                        useInstalledStore.setState({
                            state: installedStates.installed,
                        });
                    }
                });
                break;
            default:
                break;
        }
    }, [state]);

    const tryInstall = () => {
        useInstalledStore.setState({ state: installedStates.installPending });
        window.gameAPI.installGame().then((res: any) => {
            if (res.status === responseStatus.success) {
                useInstalledStore.setState({
                    state: installedStates.installed,
                });
            } else {
                useInstalledStore.setState({
                    state: installedStates.notInstalled,
                });
            }
        });
    };

    return (
        <div>
            <h2>You made it! :D</h2>
            {state === installedStates.installed ? (
                <button onClick={window.gameAPI.launchGame}>Play Game</button>
            ) : (
                <button
                    disabled={state === installedStates.installPending}
                    onClick={tryInstall}
                >
                    Install/Find Game
                </button>
            )}
        </div>
    );
};

export default MainMenu;
