import service from '../services/service';
import { ADD_TOAST, ACTIVE } from './actionNames';

export const getToast = () => (dispatch, getState) => {
    const displayAffinity = JSON.parse(window.PalmSystem.launchParams).displayAffinity;
    service.getToastNotification({
        subscribe: true,
        onSuccess: (res) => {
            if (getState().powerState === ACTIVE && res.message && res.displayId === displayAffinity) {
                if (document.hidden) {
                    service.launch({
                        id: 'com.webos.app.notification',
                        params: { displayAffinity }
                    });
                }
                dispatch({
                    type: ADD_TOAST,
                    payload: {
                        message: res.message,
                        id: window.performance.now(),
                        visible: false,
                    }
                });
            }
        }
    });
}



