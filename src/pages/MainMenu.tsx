import { useState } from 'react'

const MainMenu = (props: any) => {
    const launchGame = () => {
        window.gameAPI.launchGame()
    }
    return (<div>You made it! :D<br/><br/><button onClick={launchGame}>Play Game</button></div>)
}

export default MainMenu