import { useEffect, useState } from "react";
import { useInstalledStore } from "@/store/config";
import { InstallStates } from "@/models/states";
import logo from "@/assets/logo.png";
import background from "@/assets/main/background.png";
import styled from "styled-components";
import { TextButton } from "@/components/Buttons/TextButton";
import { BackgroundContainer } from "@/components/BackgroundContainer";

export const MainMenu = () => {
    const { state, error } = useInstalledStore();
    const [downloadProgress, setDownloadProgress] = useState(0);

    useEffect(() => {
        window.gameAPI.installHandler((_evt: Electron.IpcRendererEvent, res: InstallProgress) => {
            if (res == "downloading") {
                useInstalledStore.setState({ state: InstallStates.Downloading });
            } else if (res === "verifying") {
                useInstalledStore.setState({ state: InstallStates.Verifying });
            } else if (res === "installing") {
                useInstalledStore.setState({ state: InstallStates.Installing });
            } else if (Number(res)) {
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
            return (
                <TextButton
                    textStyle={{
                        fontSize: "48px",
                        width: "100%",
                        padding: "48px 28px 51px 42px",
                    }}
                    onClick={window.gameAPI.launchGame}
                >
                    Play Game
                </TextButton>
            );
        } else if (state === InstallStates.NotInstalled || state === InstallStates.InstallPending) {
            return <TextButton onClick={tryInstall}>Install/Find Game</TextButton>;
        } else {
            return (
                <div>
                    <span style={{ fontWeight: "bold", fontSize: "48px" }}>
                        {" "}
                        {state.replace(/([a-z])([A-Z])/g, "$1 $2")}{" "}
                    </span>
                    {state === InstallStates.Downloading && (
                        <progress
                            style={{ width: "350px", height: "30px" }}
                            value={downloadProgress}
                            max={100}
                        />
                    )}
                </div>
            );
        }
    };

    return (
        <div className="main-menu view">
            <BackgroundContainer>
                <Background src={background} alt="Banner Saga Factions Main Menu Background" />
            </BackgroundContainer>
            <div className="main-stack">
                <img className="logo" src={logo} alt="Banner Saga Factions Logo" />
                <div
                    style={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        width: "100%",
                    }}
                >
                    {mainButton()}
                    <MenuItems>
                        <li> Account </li>
                        <li> Settings </li>
                        <li> Help </li>
                        <li> About </li>
                    </MenuItems>
                </div>
            </div>
            {error && <span> 🔴 Error Installing Game: {error.message}</span>}
        </div>
    );
};

const MenuItems = styled.ul`
    list-style: none;
    display: flex;
    flex-direction: row;
    justify-content: space-evenly;
    width: 100%;
    font-size: 48px;
    font-weight: 600;
    color: ${(props) => props.theme.colors.beige};
    text-shadow: 0px 0px 15px ${(props) => props.theme.colors.blue};
    padding: 0;
    box-shadow: #00000042 0px 0 6px 15px;
    background-color: #00000042;
    border-radius: 29px;
    > li {
        transition: transform 0.2s;
        &:hover {
            cursor: pointer;
            transform: scale(1.1);
        }
    }
`;

const Background = styled.img`
    height: 100vh;
    filter: brightness(0.9);
`;
