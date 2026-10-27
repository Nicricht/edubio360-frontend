import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import './styles.css';
import './styles-extra.css';
import { App } from './App';
import { DatosProvider } from './context/DatosContext';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <DatosProvider>
        <App />
      </DatosProvider>
    </BrowserRouter>
  </React.StrictMode>,
);
