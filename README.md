## 📂 Directory structure

Familiar React application structure, just with `electron` folder on the top :wink:  
*Files in this folder will be separated from your React application and built into `dist-electron`*  

```tree
├── electron                                 Electron-related code
│   ├── main                                 Main-process source code
│   └── preload                              Preload-scripts source code
│
├── release                                  Generated after production build, contains executables
│   └── {version}
│       ├── {os}-{os_arch}                   Contains unpacked application executable
│       └── {app_name}_{version}.{ext}       Installer for the application
│
├── public                                   Static assets
└── src                                      Renderer source code
```


```mermaid
---
title: BSF Client Startup
---
stateDiagram-v2

    state f_has_access_token <<choice>>
    state f_login_attempt <<choice>>
    state f_has_session_token <<choice>>

    s_client_start : Client Start
    s_main_menu: Main Menu
    s_logged_in: Logged In
    s_logged_out: Logged Out
    s_session_start : Session Start
    s_session_end : Session End
    s_client_sleep : Client Sleep
    s_account_manager : Account Manager
    

    [*] --> s_client_start
    s_client_start --> f_has_access_token : Has Access Token
    f_has_access_token --> s_logged_out: No
        s_logged_out --> f_login_attempt : Try Login
        f_login_attempt --> s_logged_out : Failed
        f_login_attempt --> s_logged_in : Success
        s_logged_in --> f_has_session_token : Has Session Token
    f_has_access_token --> s_logged_in : Yes
    f_has_session_token --> s_session_start : No
        s_session_start --> f_has_session_token : Has session_token
    f_has_session_token --> s_main_menu : Yes

    s_main_menu --> s_client_sleep : Game Start
        s_client_sleep --> s_main_menu : Game End ||\nWindow Focus
    s_main_menu --> s_account_manager : Open Menu
        s_account_manager --> s_main_menu : Close Menu
        s_account_manager --> s_logged_out : Do Logout
    s_main_menu --> s_
    s_main_menu --> s_session_end : Exit
    s_session_end --> [*]
    
```

