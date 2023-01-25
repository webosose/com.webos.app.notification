import Alert from '@enact/sandstone/Alert';
import LS2Request from '@enact/webos/LS2Request';
import Button from '@enact/sandstone/Button';
import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { REMOVE_ALERT } from '../../actions/actionNames';
import closeApp from '../../Util/util';
import css from './AlertCmp.module.less';
const AlertCmp = ({ alertId, message, buttons }) => {
  const alerts = useSelector(state => state.alerts);
  const toasts = useSelector(state => state.toasts);
  const dispatch = useDispatch();
  const buttonClickHandler = useCallback((event) => {
    let buttonIndex = event.currentTarget.getAttribute("buttonindex");
    if (buttons.length > buttonIndex) {
      const { serviceURI, serviceMethod, launchParams } = buttons[parseInt(buttonIndex)].action;
      const req = new LS2Request();
      req.send({
        service: serviceURI,
        method: serviceMethod,
        parameters: Object.assign({}, launchParams),
        onSuccess: () => {
          // console.log("res ::",res);
        },
        onFailure: (error) => {
          console.log("error ::", error);
        }
      });
      setTimeout(() => {
        dispatch({ type: REMOVE_ALERT, alertId });
        if (alerts.length === 1 && toasts.length === 0) {
          closeApp()
        }
      }, 100)

    }

  }, [buttons, alertId, dispatch, alerts, toasts])
  return <Alert
    open
    type="overlay"
  >
    {message}
    <buttons>
      {buttons.map((v, index) => {
        return <Button size='small' className={css.buttonCell} key={index} buttonindex={index} onClick={buttonClickHandler}>{v.label}</Button>
      })}
    </buttons>
  </Alert>
}
export default AlertCmp;