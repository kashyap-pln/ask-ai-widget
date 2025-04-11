import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';
import 'antd/dist/reset.css';

// Web Component version
class AskAIButton extends HTMLElement {
  connectedCallback() {
    const shadowRoot = this.attachShadow({ mode: 'open' });

    // Inject your styles here
    const style = document.createElement('style');
    style.textContent = `
      .ask-ai-btn {
        background-color: #F4F4F4;
        border: none;
        padding:6px;
        width:100px
        border-radius: 4px;
        outline: none;
        z-index: 9999;
      }
    `;
    shadowRoot.appendChild(style);

    const container = document.createElement('div');
    shadowRoot.appendChild(container);

    const root = createRoot(container);
    root.render(
      <StrictMode>
        <App />
      </StrictMode>
    );
  }
}

// Register the web component
customElements.define('ask-ai-button', AskAIButton);

// Regular DOM mounting (for your original app)
if (document.getElementById('root')) {
  createRoot(document.getElementById('root')).render(
    <StrictMode>
      <App />
    </StrictMode>
  );
}
