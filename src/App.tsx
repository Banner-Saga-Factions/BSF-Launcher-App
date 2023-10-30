import { useEffect } from "react";
import { LoginView } from "@/views/LoginView";
import { MainMenu } from "@/views/MainMenu";
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
            {loginState !== loginStates.loggedIn ? <LoginView /> : <MainMenu />}
        </div>
    );
};

export default App;
