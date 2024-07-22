import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import AlertProvider from './context/AlertContext'

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <AlertProvider>
      <App />
    </AlertProvider>
  </React.StrictMode>,
)
