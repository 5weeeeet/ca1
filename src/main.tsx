import React from 'react'
import './index.css'
import App from './App'
import ReactDOM from 'react-dom'
import VideoChatApp from './video-chat-app'

// const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement)
// root.render(
//   <React.StrictMode>
//     <App />
//   </React.StrictMode>
// )

ReactDOM.render(
  <React.StrictMode>
    <VideoChatApp />
  </React.StrictMode>,
  document.getElementById('root')
)