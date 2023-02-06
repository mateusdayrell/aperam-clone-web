import React from 'react';
import { Router, Switch } from 'react-router-dom';
import { ToastContainer } from 'react-toastify'; // toasts
import 'react-toastify/dist/ReactToastify.css';
import { Provider } from 'react-redux'; // redux
import { PersistGate } from 'redux-persist/integration/react'; // redux

import store, { persistor } from './store'; // redux
import history from './services/history';
import Routes from './routes';
import './styles/global.css';
import './styles/modal.css';

function App() {
  return (
    <Provider store={store}>
      <PersistGate persistor={persistor}>
        <Router history={history}>
          <Switch>
            <Routes />
          </Switch>
          <ToastContainer autoClose={3000} className="toast-container" />
        </Router>
      </PersistGate>
    </Provider>
  );
}

export default App;
