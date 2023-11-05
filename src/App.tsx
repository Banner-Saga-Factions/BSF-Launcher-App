import { useEffect } from "react";
import { LoginView } from "@/views/LoginView";
import { MainMenu } from "@/views/MainMenu";
import "@/App.css";
import { useLoginStore, useUserStore } from "@/store/config";
import { LoginStates } from "@/models/states";

const App = (_: any) => {
    const loginState = useLoginStore((loginState) => loginState.state);

    useEffect(() => {
        window.accountsApi.getCurrentUser().then((res) => {
            if (res.error) {
                useLoginStore.setState({ state: LoginStates.LoggedOut, error: res.error });
            } else if (res.data) {
                useLoginStore.setState({ state: LoginStates.LoggedIn });
                useUserStore.setState({ user: res });
            } else {
                useLoginStore.setState({ state: LoginStates.LoggedOut });
            }
        });
    }, []);

    return (
        <div className="App">
            {loginState !== LoginStates.LoggedIn ? <LoginView /> : <MainMenu />}
        </div>
    );
};

export default App;
