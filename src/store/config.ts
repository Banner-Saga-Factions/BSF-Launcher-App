import { create } from "zustand";
import { loginStates, installedStates, updateStates } from "@/models/states";
import { produce } from "immer";

interface LoginState {
    state: loginStates;
    setState: (state: loginStates) => void;
}

interface InstalledState {
    state: installedStates;
    setState: (state: installedStates) => void;
}

export const useLoginStore = create<LoginState>((set) => ({
    state: loginStates.loggedOut,
    setState: (newState) => {
        set(
            produce((state) => {
                state = newState;
            })
        );
    },
}));

export const useInstalledStore = create<InstalledState>((set) => ({
    state: installedStates.notInstalled,
    setState: (newState) => {
        set(
            produce((state) => {
                state = newState;
            })
        );
    },
}));
