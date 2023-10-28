import { create } from "zustand";
import { loginStates } from "@/models/states";
import { produce } from "immer";

interface LoginState {
    state: loginStates;
    setState: (state: loginStates) => void;
}

export const useLoginStore = create<LoginState>((set) => ({
    state: loginStates.loggedOut,
    setState: (newState) => {
        set(produce((state) => {
            state = newState;
        }));
    },
}));
