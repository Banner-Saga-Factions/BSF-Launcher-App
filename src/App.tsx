import { ipcResponse } from "@/models/ipc";
import { useEffect } from "react";
import LoginPage from "@/pages/LoginPage";
import MainMenu from "@/pages/MainMenu";
import "@/App.css";
import { useLoginStore } from "@/store/config";
import { loginStates } from "@/models/states";

const App = (_: any) => {
    const loginState = useLoginStore((loginState) => loginState.state);

    useEffect(() => {
        window.accountsAPI.getCurrentUser().then((res: ipcResponse) => {
            console.log(res);
            if (res.error) {
                useLoginStore.setState({ state: loginStates.loggedOut });
                console.error(
                    `Login Failed: ${res.error.message} [${res.error.errorCode}]`
                );
            } else {
                useLoginStore.setState({ state: loginStates.loggedIn });
            }
        });
    }, []);

    return (
        <div className="App">
            {loginState !== loginStates.loggedIn ? <LoginPage /> : <MainMenu />}
        </div>
    );
};

export default App;
