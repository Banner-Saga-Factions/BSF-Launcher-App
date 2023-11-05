import { useEffect, useState } from "react";
import { useLoginStore } from "@/store/config";
import { LoginStates } from "@/models/states";
import { TextButton } from "@/components/TextButton";

import background from "@/assets/background.png";
import loadingRing from "@/assets/loading-ring.png";
import logo from "@/assets/logo.png";

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
        </div>
    );
};
