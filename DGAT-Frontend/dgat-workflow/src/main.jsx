// src/main.jsx
import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom' // NEW IMPORT
import App from './App.jsx'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter> {/* WRAP APP IN BROWSERROUTER */}
      <App />
    </BrowserRouter>
  </React.StrictMode>,
)