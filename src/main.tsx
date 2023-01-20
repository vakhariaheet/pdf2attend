import React from 'react';
import ReactDOM from 'react-dom/client';
import { PersistGate } from 'redux-persist/integration/react';
import { persistStore } from 'redux-persist';
import { BrowserRouter as Router } from 'react-router-dom';
import { Provider } from 'react-redux';
import App from './App';
import './index.scss';
import store from './Slices/store';

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
	<React.StrictMode>
		<Router>
			<PersistGate persistor={persistStore(store)}>
				<Provider store={store}>
					<App />
				</Provider>
			</PersistGate>
		</Router>
	</React.StrictMode>,
);
