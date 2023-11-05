import { useEffect, useState } from "react";
import { useLoginStore } from "@/store/config";
import { LoginStates } from "@/models/states";
import { TextButton } from "@/components/TextButton";
import { Modal, ModalContent } from "@/components/Modal";

import background from "@/assets/login/background.png";
import loadingRing from "@/assets/login/loading-ring.png";
import logo from "@/assets/logo.png";
import { ModalTitle } from "@/styles/StyledText";
import { BannerButton } from "@/components/BannerButton";
import { theme } from "@/styles/theme";

export const LoginView = () => {
    const [isNewUser, setIsNewUser]: [{ state: boolean; username: string }, any] = useState({
        state: false,
        username: "",
    });
    const loginState = useLoginStore((s) => s.state);
    const loginError = useLoginStore((s) => s.error);

    useEffect(() => {
        window.accountsApi.loginHandler(
            (
                _evt: Electron.IpcRendererEvent,
                username: string,
                newUser: boolean,
                error?: Error
            ) => {
                if (error) {
                    useLoginStore.setState({ state: LoginStates.LoggedOut, error });
                } else if (!newUser) {
                    useLoginStore.setState({ state: LoginStates.LoggedIn });
                } else {
                    setIsNewUser({ state: true, username });
                }
            }
        );
    }, []);

    const startLogin = () => {
        useLoginStore.setState({ state: LoginStates.LoginPending });
        window.accountsApi.startLogin();
    };

    const isLoading = (): string => {
        return loginState === LoginStates.LoginPending ? "is-loading" : "";
    };

    // TODO: clean this the fuck up
    const newUserPrompt = () => {
        return (
            <Modal className="new-user-modal">
                <ModalTitle>🔰 Welcome to Banner Saga Factions! 🔰</ModalTitle>
                <ModalContent style={{ justifyContent: "flex-start", marginTop: "3%" }}>
                    <h2> Looks like you're new here!</h2>
                    <h2 style={{ marginTop: "25%" }}>Enter a Username</h2>
                    <input
                        onChange={(e) => {
                            setIsNewUser({ state: true, username: e.target.value });
                        }}
                        style={{
                            fontSize: "36px",
                            borderRadius: "10px",
                            width: "60%",
                        }}
                        type="text"
                        placeholder={isNewUser.username}
                    />
                </ModalContent>
                <BannerButton
                    text="Submit"
                    onClick={async () => {
                        let res = await window.accountsApi.updateUser({
                            username: isNewUser.username,
                        });
                        if (!res.error) {
                            setIsNewUser({ state: false, username: "" });
                            useLoginStore.setState({ state: LoginStates.LoggedIn });
                        } else {
                            console.error("Error updating user:", res.error);
                            useLoginStore.setState({
                                state: LoginStates.LoggedOut,
                                error: res.error,
                            });
                        }
                    }}
                    textStyle={{
                        fontSize: "64px",
                        color: theme.colors.beige,
                        textShadow: "0px 0px 15px black",
                        bottom: "20px",
                    }}
                />
            </Modal>
        );
    };

    return (
        <div className="login-page">
            <div className="background-container">
                <img
                    className="background"
                    src={background}
                    alt="Banner Saga Factions Loading Background"
                />
                <img
                    className={`loading-ring ${isLoading()}`}
                    src={loadingRing}
                    alt="Loading Indicator Ring"
                />
                <span className={isLoading()} />;
            </div>
            <img className="logo" src={logo} alt="Banner Saga Factions Logo" />
            <TextButton
                text="Login"
                className="login-button"
                onClick={startLogin}
                textStyle={{
                    fontSize: `clamp(72px, 6vw, 130px)`,
                }}
            />
            {loginError && (
                <h1
                    style={{
                        position: "absolute",
                        bottom: "1%",
                        left: "1%",
                        fontFamily: "sans-serif",
                        fontWeight: "lighter",
                    }}
                    className="error-message"
                >
                    🔴 {loginError.name}: {loginError.message}
                </h1>
            )}

            {isNewUser.state && newUserPrompt()}
        </div>
    );
};
