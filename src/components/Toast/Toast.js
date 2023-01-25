import { useEffect, useCallback } from "react";
import { useSelector } from "react-redux";
import Transition from '@enact/ui/Transition';
import css from './Toast.module.less';
import AlertText from '../AlertText/AlertText';
import { useDispatch } from "react-redux";
import { REMOVE_ALL_TOAST, REMOVE_TOAST, SHOW_TOAST } from "../../actions/actionNames";
import closeApp from "../../Util/util";
const Toast = ({ toastid }) => {
    const toastData = useSelector(state => state.toasts).find(v => toastid === v.id);
    const toasts = useSelector(state => state.toasts);
    const alerts = useSelector(state => state.alerts);
    // console.log(toastid+'toastData',toastData)
    const dispatch = useDispatch();
    useEffect(() => {
        dispatch({ type: SHOW_TOAST, id: toastid });
    }, [toastid, dispatch])
    const handleHide = useCallback(() => {
        dispatch({ type: REMOVE_TOAST, id: toastid });
        if (toasts.length > 0 && toasts[toasts.length - 1].id === toastid) {
            dispatch({ type: REMOVE_ALL_TOAST });
            if (alerts.length === 0) {
                closeApp()
            }
        }
    }, [toasts, toastid, dispatch, alerts]);
    return <Transition
        className={css.notificationContainerTransition}
        css={css}
        direction="up"
        onHide={handleHide}
        timingFunction="ease-out"
        type={toastData.visible ? 'slide' : 'fade'}
        visible={toastData.visible}
    >
        <div className={css.notificationContainer}>
            <AlertText text={toastData.message} />
        </div>
    </Transition>
}
export default Toast;