import { useEffect } from "react";
import "@/App.css";

import { Login } from "@/pages/Login";
import { MainMenu } from "@/pages/MainMenu";

import { useLoginStore, useUserStore } from "@/store/config";
import { LoginStates } from "@/models/states";

const App = () => {
    const loginState = useLoginStore((loginState) => loginState.state);

    const getCurrentUser = async () => {
        let { data, error } = await window.accountsApi.getCurrentUser();
        if (data) {
            useUserStore.setState({ user: data });
        } else {
            useLoginStore.setState({ state: LoginStates.LoggedOut, error: error });
        }
    };

    // Fetch current user on initial component load
    useEffect(() => {
        window.accountsApi.isLoggedIn().then((res) => {
            if (res.data) {
                useLoginStore.setState({ state: LoginStates.LoggedIn });
            } else {
                useLoginStore.setState({ state: LoginStates.LoggedOut });
            }
        });
    }, []);

    // Fetch current user when the loggedInState changes to LoggedIn
    useEffect(() => {
        if (loginState === LoginStates.LoggedIn) {
            getCurrentUser();
        }
    }, [loginState]);

    const pageToRender = () => {
        switch (loginState) {
            case LoginStates.LoggedIn:
                return <MainMenu />;
            case LoginStates.LoggedOut:
            case LoginStates.LoginPending:
                return <Login />;
            case LoginStates.CheckingLogin:
            default: {
                return <Login />; // TODO: making a loading screen
            }
        }
    };

    return <div className="App">{pageToRender()}</div>;
};

export default App;
