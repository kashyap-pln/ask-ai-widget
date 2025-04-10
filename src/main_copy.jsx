import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import 'antd/dist/reset.css'

// Web Component version
class ReactButton extends HTMLElement {
  connectedCallback() {
    const shadowRoot = this.attachShadow({ mode: 'open' })
    const root = createRoot(shadowRoot)
    root.render(
      <StrictMode>
        <App />
      </StrictMode>
    )
  }
}

// Register the web component
customElements.define('react-button', ReactButton)

// Regular DOM mounting (for your original app)
if (document.getElementById('root')) {
  createRoot(document.getElementById('root')).render(
    <StrictMode>
      <App />
    </StrictMode>
  )
}