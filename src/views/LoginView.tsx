import { useEffect } from "react";
import { useLoginStore } from "@/store/config";
import { LoginStates } from "@/models/states";
import { TextButton } from "@/components/TextButton";

import background from "@/assets/background.png";
import loadingRing from "@/assets/loading-ring.png";
import logo from "@/assets/logo.png";

export const LoginView = () => {
    const loginState = useLoginStore((s) => s.state);
    const loginError = useLoginStore((s) => s.error);

    useEffect(() => {
        window.accountsAPI.loginHandler(
            (_evt: Electron.IpcRendererEvent, newUser: boolean, error?: Error) => {
                if (error) {
                    useLoginStore.setState({ state: LoginStates.LoggedOut, error });
                } else {
                    useLoginStore.setState({ state: LoginStates.LoggedIn });
                }
            }
        );
    }, []);

    useEffect(() => {
        // TODO: notify user of error
    }, [loginError]);

    const startLogin = () => {
        useLoginStore.setState({ state: LoginStates.LoginPending });
        window.accountsAPI.startLogin();
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
            /* placeholder */
            {loginError ? <p className="error-message"> 🔴 {loginError.message}</p> : null}
        </div>
    );
};
