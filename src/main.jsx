import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import ContextProvider from './context/GlobalContext.jsx'
import { SnackbarProvider } from 'notistack'

import BlackBoardLogin from './components/BlackBoardLogin.jsx'
import Callback from './components/Callback.jsx'
import Home from './components/Home.jsx'


createRoot(document.getElementById('root')).render(
  <StrictMode>
    <SnackbarProvider 
      maxSnack={3}
      anchorOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
      autoHideDuration={4000}
    >
      <ContextProvider>
        <App />
      </ContextProvider>
    </SnackbarProvider>
  </StrictMode>,
)
