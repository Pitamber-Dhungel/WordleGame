import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './assets/css/global.css'
import Wordle from './Pages/Wordle'


createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Wordle />
  </StrictMode>,
  // <Wordle />
)
