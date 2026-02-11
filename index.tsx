
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { registerSW } from './pwa/registerSW';

const rootElement = document.getElementById('root');
if (!rootElement) throw new Error("Root element not found");

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

registerSW();

window.addEventListener('pwa-update-available', () => {
  if (confirm("Nueva versión disponible del sistema maestro. ¿Reiniciar ahora para actualizar?")) {
    window.location.reload();
  }
});
