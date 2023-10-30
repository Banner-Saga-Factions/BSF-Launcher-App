# 🔰 Factions Community Edition Client

Electron based react app, for managing and interfacing with Banner Saga Factions game client using custom game server implementation.

*Project based on [Electron Vite React](https://github.com/electron-vite/electron-vite-react) template.*

## 📂 Directory structure

```tree
├── electron                                 Backend code
│   ├── main/                                Main-process
│   │  ├── ipcModules/                              IPC modules
│   │  └── index.ts                          Main-process
│   ├── preload                              Preload-scripts source code
│   └── *.d.ts                               Typescript definitions
├── public/                                  Static assets
├── src/                                     Frontend source code
│   ├── App.tsx                              Base frontend component
│   ├── components/                          React components
│   ├── views/                               Views    
│   ├── types/                               Types
│   └── store/                               State management (Zustand)
│   
└── release                                  Generated after production build, contains executables
    └── {version}
        ├── {os}-{os_arch}                   Contains unpacked application executable
        └── {app_name}_{version}.{ext}       Installer for the application
```

## 🔄️ Start Up Process

```mermaid
stateDiagram-v2

    state f_has_access_token <<choice>>
    state f_login_attempt <<choice>>
    state f_has_game_installed <<choice>>
    state f_install_attempt <<choice>>
    state f_logged_in <<fork>>

    s_client_start : Client Start
    s_main_menu: Main Menu
    s_login_screen: Login Screen
    s_install_screen: Install Screen
    

    [*] --> s_client_start
    s_client_start --> f_has_access_token : Access Token?
    f_has_access_token --> s_login_screen: No
        s_login_screen --> f_login_attempt : Do Login
        f_login_attempt --> s_login_screen : Failed
        f_login_attempt --> f_logged_in : Success
    f_has_access_token --> f_logged_in : Yes
    f_logged_in --> f_has_game_installed : Game Installed?
    f_has_game_installed --> s_main_menu : Yes 
    f_has_game_installed --> s_install_screen : No
        s_install_screen --> f_install_attempt: Try Install 
        f_install_attempt --> s_main_menu : Success
        f_install_attempt --> s_install_screen : Failed
    
```