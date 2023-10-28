import { useState, useEffect } from "react";
import { ipcResponse, responseStatus } from "@/models/ipc";
import { useLoginStore } from "@/store/config";
import { loginStates } from "@/models/states";
import { TextButton } from "@/components/TextButton";

import background from "@/assets/background.png";
import loadingRing from "@/assets/loading-ring.png";
import logo from "@/assets/logo.png";

const LoginPage = () => {
    // TODO: notify on error
    const [loginError, setLoginError] = useState(false);
    const loginState = useLoginStore((s) => s.state);

    useEffect(() => {
        window.accountsAPI.loginHandler(
            (_evt: Electron.IpcRendererEvent, res: ipcResponse) => {
                if (res.status === responseStatus.success) {
                    useLoginStore.setState({ state: loginStates.loggedIn });
                }
                if (res.status === responseStatus.error) {
                    setLoginError(true);
                    useLoginStore.setState({ state: loginStates.loggedOut });
                }
            }
        );
    }, []);

    const startLogin = () => {
        useLoginStore.setState({ state: loginStates.loginPending });
        window.accountsAPI.startLogin();
    };

    const isLoading = (): string => {
        if (loginState === loginStates.loginPending) {
            return "is-loading";
        }
        return "";
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
        </div>
    );
};

export default LoginPage;
