/* istanbul ignore file */
import { render } from 'react-dom';
import {Provider} from 'react-redux';
import configureStore from './store';

import App from './App';

const store = configureStore();
let appElement = (<Provider store={store}><App highContrast textSize={'large'} /></Provider>);

// In a browser environment, render instead of exporting
if (typeof window === 'object') {
	// window.store = store;
	render(
		appElement,
		document.getElementById('root')
	);

	appElement = null;
}

export default appElement;
