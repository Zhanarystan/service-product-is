import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import 'semantic-ui-css/semantic.min.css';
import { store, StoreContext } from './app/stores/store';
import { BrowserRouter, Router } from 'react-router-dom';
import 'react-toastify/dist/ReactToastify.min.css';
import 'react-toastify/dist/react-toastify';
import {createBrowserHistory} from 'history'; 

export const history = createBrowserHistory();
const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <StoreContext.Provider value={store}>
    <Router history={history}>
      <App />
    </Router>
  </StoreContext.Provider>
);

