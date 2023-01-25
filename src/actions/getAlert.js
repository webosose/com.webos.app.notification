
import service from '../services/service';
import { ADD_ALERT, ACTIVE } from './actionNames';

export const getAlert = () => (dispatch, getState) => {
    const displayAffinity = JSON.parse(window.PalmSystem.launchParams).displayAffinity;
    service.getAlertNotification({
        subscribe: true,
        onSuccess: (res) => {
            if (getState().powerState === ACTIVE && res.returnValue && res.alertInfo && res.alertInfo.displayId === displayAffinity) {
                const {alertId,message,buttons} = res.alertInfo;
                if (document.hidden) {
                    service.launch({
                        id: 'com.webos.app.notification',
                        params: { displayAffinity }
                    });
                }
                dispatch({
                    type: ADD_ALERT,
                    payload: {
                       alertId,
                       message,
                       buttons
                    }
                });
            }
        }
    });
}



