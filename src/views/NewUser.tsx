import { theme } from "@/styles/theme";
import { Modal, styles as modalStyles } from "@/components/Modal";
import { BannerButton } from "@/components/Buttons";
import { useNewUserStore, useLoginStore } from "@/store/config";
import { LoginStates } from "@/models/states";

export const NewUserPrompt = () => {
    const [username, setIsNewUser, setUsername] = useNewUserStore((s) => [
        s.username,
        s.setIsNewUser,
        s.setUsername,
    ]);

    return (
        <Modal className="new-user-modal">
            <modalStyles.ModalTitle>🔰 Welcome to Banner Saga Factions! 🔰</modalStyles.ModalTitle>
            <modalStyles.ModalContent style={{ justifyContent: "flex-start", marginTop: "3%" }}>
                <h2> Looks like you're new here!</h2>
                <h2 style={{ marginTop: "25%" }}>Enter a Username</h2>
                <input
                    onChange={(e) => {
                        setUsername(e.target.value);
                    }}
                    style={{
                        fontSize: "36px",
                        borderRadius: "10px",
                        width: "60%",
                    }}
                    type="text"
                    defaultValue={username}
                />
            </modalStyles.ModalContent>
            <BannerButton
                onClick={async () => {
                    if (!username.match(/^[a-zA-Z0-9_]+$/) || username.length < 3) {
                        useLoginStore.setState({
                            state: LoginStates.LoggedOut,
                            error: new Error("Invalid username"),
                        });
                        return;
                    }
                    let res = await window.accountsApi.updateUser({
                        username: username,
                    });
                    if (!res.error) {
                        setIsNewUser(false);
                        useLoginStore.setState({ state: LoginStates.LoggedIn });
                    } else {
                        console.error("Error updating user:", res.error);
                        useLoginStore.setState({
                            state: LoginStates.LoggedOut,
                            error: res.error,
                        });
                    }
                }}
                textStyle={{
                    fontSize: "64px",
                    color: theme.colors.beige,
                    textShadow: "0px 0px 15px black",
                    bottom: "20px",
                }}
            >
                Submit
            </BannerButton>
        </Modal>
    );
};
