import { useState, useEffect } from 'react'
import './App.css'

function App() {
  const [count, setCount] = useState(0)
  useEffect(() => {
    window.accountsAPI.loginHandler((_evt: string) => {
      if (_evt === "login-success")
      console.log('login complete!', _evt);
    else console.log('error')
    })
  })
  return (
    <div className='App'>
      <div className='logo-box'>
        <a href='https://avatars.githubusercontent.com/u/124500905?s=200&v=4' target='_blank'>
        </a>
      </div>
      <h1>Banner Saga Factions: Community Edition</h1>
      <div className='card'>
        <button onClick={() => setCount((count) => {window.accountsAPI.startLogin(); return count + 1})}>
          count is {count}
        </button>
        <p>
          Edit <code>src/App.tsx</code> and save to test HMR123
        </p>
      </div>
      <p className='read-the-docs'>
        Click on the Electron + Vite logo to learn more
      </p>
      <div className='flex-center'>
        Place static files into the<code>/public</code> folder <img style={{ width: '5em' }} src='./node.svg' alt='Node logo' />
      </div>

    </div>
  )
}

export default App