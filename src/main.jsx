import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import ContextProvider from './context/GlobalContext.jsx'

import BlackBoardLogin from './components/BlackBoardLogin.jsx'
import Callback from './components/Callback.jsx'
import Home from './components/Home.jsx'


createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ContextProvider>
    <App />
    </ContextProvider>
  </StrictMode>,
)
