import { create } from "zustand";
import { LoginStates, InstallStates, UpdateStates } from "@/models/states";
import { produce } from "immer";

// TODO: define user interface
type User = any;

interface StateTemplate<T> {
    state: T;
    error?: Error;
    setState: (state: T, error?: Error) => void;
}

const newStateProducer = <T>(newState: T, newError?: Error) => {
    return produce((state: any, error?: Error) => {
        state = newState;
        error = newError;
    });
};

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
    state: LoginStates.LoggedOut,
    error: undefined,
    setState: (newState, newError?) => {
        set(newStateProducer<LoginStates>(newState, newError));
    },
}));

export const useInstalledStore = create<InstallState>((set) => ({
    state: InstallStates.NotInstalled,
    error: undefined,
    setState: (newState, newError?) => {
        set(newStateProducer<InstallStates>(newState, newError));
    },
}));

export const useUserStore = create<UserState>((set) => ({
    user: null,
    setState: (newUser) => {
        set(
            produce((user) => {
                user = newUser;
            })
        );
    },
}));
