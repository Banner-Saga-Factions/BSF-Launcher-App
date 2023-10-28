import { ipcResponse, responseStatus } from "@/models/ipc";
import { useEffect } from "react";
import LoginPage from "@/pages/LoginPage";
import MainMenu from "@/pages/MainMenu";
import "@/App.css";
import { useLoginStore } from "@/store/config";
import { loginStates } from "@/models/states";

const App = (_: any) => {
    const loginState = useLoginStore((loginState) => loginState.state);

    // Only on initial load...
    useEffect(() => {
        // Get current user
        window.accountsAPI.getCurrentUser().then((res: ipcResponse) => {
            console.log(res);
            if (res.status === responseStatus.success) {
                useLoginStore.setState({ state: loginStates.loggedIn });
                console.log(res.data);
            } else {
                useLoginStore.setState({ state: loginStates.loggedOut });
                console.log("login failed");
            }
        });
    }, []);

    useEffect(() => {
        console.log(loginState);
    }, [loginState]);

    return (
        <div className="App">
            {loginState !== loginStates.loggedIn ? <LoginPage /> : <MainMenu />}
        </div>
    );
};

export default App;
