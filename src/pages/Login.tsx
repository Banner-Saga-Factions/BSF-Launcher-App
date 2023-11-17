import { useEffect, useState} from "react";

import { useLoginStore } from "@/store/config";
import { LoginStates } from "@/models/states";

import { NewUserPrompt } from "@/views/NewUser";
import { TextButton } from "@/components/Buttons";
import { BackgroundContainer } from "@/components/BackgroundContainer";

import background from "@/assets/login/background.png";
import loadingRing from "@/assets/login/loading-ring.png";
import logo from "@/assets/logo.png";
import styled from "styled-components";

export const Login = () => {
    const loginState = useLoginStore((s) => s.state);
    const loginError = useLoginStore((s) => s.error);

    useEffect(() => {
        window.accountsApi.loginHandler((_, username, newUser, error) => {
            if (error) {
                useLoginStore.setState({ state: LoginStates.LoggedOut, error });
            } else if (!newUser) {
                useLoginStore.setState({ state: LoginStates.LoggedIn });
            } else {
                useLoginStore.setState({ state: LoginStates.FirstLogin });
            }
        });
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
            <BackgroundContainer>
                <img className="background" src={background} />
                <img className={`loading-ring ${isLoading()}`} src={loadingRing} />
                <span className={isLoading()} />;
            </BackgroundContainer>
            <img className="logo" src={logo} alt="Banner Saga Factions Logo" />
            <TextButton
                className="login-button"
                onClick={startLogin}
                textStyle={{
                    fontSize: `clamp(72px, 6vw, 100px)`,
                }}
            >
                Login
            </TextButton>
            {loginError && (
                <ErrorMessage>
                    🔴 {loginError.name}: {loginError.message}
                </ErrorMessage>
            )}

            {loginState === LoginStates.FirstLogin && NewUserPrompt()}
        </div>
    );
};

const ErrorMessage = styled.h1`
    position: absolute;
    bottom: 1%;
    left: 1%;
    font-family: sans-serif;
    font-weight: lighter;
`;
