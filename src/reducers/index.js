import { combineReducers } from 'redux';
import alerts from './alerts';
import powerState from './powerState';
import toasts from './toasts';

const rootReducer = combineReducers({
    alerts,
    powerState,
    toasts
});

export default rootReducer;