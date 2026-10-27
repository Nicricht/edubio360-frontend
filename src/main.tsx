import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, HashRouter } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import './styles.css';
import './styles-extra.css';
import { App } from './App';
import { DatosProvider } from './context/DatosContext';

const Router = import.meta.env.BASE_URL === '/edubio360-frontend/' ? HashRouter : BrowserRouter;

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Router>
      <DatosProvider>
        <App />
      </DatosProvider>
    </Router>
  </React.StrictMode>,
);
