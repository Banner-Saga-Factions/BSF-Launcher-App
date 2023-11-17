import { create } from "zustand";
import { LoginStates, InstallStates, UpdateStates } from "@/models/states";

// TODO: define user interface
type User = any;

interface StateTemplate<T> {
    state: T;
    error?: Error;
    setState: (state: T, error?: Error) => void;
}

// ==== STATE TYPES ====
type LoginState = StateTemplate<LoginStates>;
type InstallState = StateTemplate<InstallStates>;
type UpdateState = StateTemplate<UpdateStates>;

interface UserState {
    user: User | null;
    setState: (user: User | null) => void;
}

// ==== STORES ====
export const useLoginStore = create<LoginState>((set) => ({
    state: LoginStates.CheckingLogin,
    error: undefined,
    setState: (newState, newError?) => {
        set({ state: newState, error: newError });
    },
}));

export const useInstalledStore = create<InstallState>((set) => ({
    state: InstallStates.NotInstalled,
    error: undefined,
    setState: (newState, newError?) => {
        set({ state: newState, error: newError });
    },
}));

export const useUserStore = create<UserState>((set) => ({
    user: null,
    setState: (newUser) => {
        set({ user: newUser });
    },
}));
