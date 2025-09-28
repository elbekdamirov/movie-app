import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './shared/style/index.css'
import App from './app'
import "./app/i18n"

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
