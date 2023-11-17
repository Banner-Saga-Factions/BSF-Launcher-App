import { theme } from "@/styles/theme";
import { useState } from "react";
import { Modal, styles as modalStyles } from "@/components/Modal";
import { BannerButton } from "@/components/Buttons";
import { useLoginStore, useUserStore } from "@/store/config";
import { LoginStates } from "@/models/states";

export const NewUserPrompt = () => {
    const [username, setUsername] = useState("");
    const currentUser = useUserStore((s) => s.user);

    // prevent whitespace, control characters, line breaks and paragraph separators
    // allow basic and extended latin-a (supported blocks by Vinque font)
    const userNamePattern = "^(?![sp{Cc}p{Zl}p{Zp}]).*[p{Basic_Latin}p{Latin_Extended-A}].*$";

    const submitUsername = async () => {
        let res = await window.accountsApi.updateUser({
            username: username,
        });
        if (!res.error) {
            useLoginStore.setState({ state: LoginStates.LoggedIn });
        } else {
            console.error("Error updating user:", res.error);
            useLoginStore.setState({
                state: LoginStates.FirstLogin,
                error: res.error,
            });
        }
    };

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
                    required
                    type={"text"}
                    pattern={userNamePattern}
                    minLength={3}
                    maxLength={20}
                    defaultValue={username}
                />
            </modalStyles.ModalContent>
            <BannerButton onClick={submitUsername}>Submit</BannerButton>
        </Modal>
    );
};
