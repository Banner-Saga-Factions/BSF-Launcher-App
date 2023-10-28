export type Config = {
    gamePath: string;
    gameVersion: string;
    username: string;
    richPresence: boolean;
};

declare global {
    type Config = {
        gamePath?: string;
        gameVersion?: string;
        username?: string;
        richPresence?: boolean;
    };
}
