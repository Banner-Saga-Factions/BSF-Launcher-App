import { useEffect } from "react";
import { LoginView } from "@/views/LoginView";
import { MainMenu } from "@/views/MainMenu";
import "@/App.css";
import { useLoginStore, useUserStore } from "@/store/config";
import { LoginStates } from "@/models/states";

const App = (_: any) => {
    const loginState = useLoginStore((loginState) => loginState.state);

    useEffect(() => {
        window.accountsAPI
            .getCurrentUser()
            .then((res) => {
                if (res) {
                    useLoginStore.setState({ state: LoginStates.LoggedIn });
                    useUserStore.setState({ user: res });
                } else {
                    useLoginStore.setState({ state: LoginStates.LoggedOut });
                }
            })
            .catch((err) => {
                // pass error to LoginView
                useLoginStore.setState({ state: LoginStates.LoggedOut, error: err });
            });
    }, []);

    return (
        <div className="App">
            {loginState !== LoginStates.LoggedIn ? <LoginView/> : <MainMenu />}
        </div>
    );
};

export default App;
