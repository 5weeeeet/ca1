import React from 'react'
import ReactDOM from 'react-dom'
import App from './App'
import './styles/globals.css' // Убедитесь, что путь к глобальным стилям правильный

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root') as HTMLElement
)