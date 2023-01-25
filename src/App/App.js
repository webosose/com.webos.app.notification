import { useCallback, useEffect } from "react";
import ThemeDecorator from "@enact/sandstone/ThemeDecorator";
import css from "./App.module.less";
import Transition from "@enact/ui/Transition";
import { useDispatch, useSelector } from "react-redux";
import Toast from "../components/Toast/Toast";
import { HIDE_TOAST } from "../actions/actionNames";
import { getToast } from "../actions/getToast";
import { getAlert } from "../actions/getAlert";
import AlertCmp from "../components/Alert/AlertCmp";

let timer;
const App = () => {
  const toasts = useSelector(state => state.toasts);
  const alerts = useSelector(state => state.alerts);
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(getToast());
    dispatch(getAlert());
  }, [dispatch]);
  useEffect(() => {
    if (typeof window === 'object') {
      document.addEventListener('webOSLocaleChange', () => {
        window.location.reload();
      });
    }
  }, [])

  useEffect(() => {
    clearTimeout(timer);
    if (toasts.length > 0) {
      timer = setTimeout(() => {
        dispatch({ type: HIDE_TOAST })
      }, 5000)
    }
    return () => {
      clearTimeout(timer);
    }
  }, [toasts, dispatch])
  const onHideAllNotification = useCallback(() => {
    dispatch({ type: HIDE_TOAST })
  }, [dispatch]);

  return (
    <div className={css.app}>
      <Transition css={css} type="fade" visible={toasts.length > 0}>
        <div className={css.basement} onClick={onHideAllNotification} />
      </Transition>
      <>
        {toasts.map((v, index) => {
          return <Toast toastid={v.id} key={index} />
        })}
        {alerts.map((v, index) => {
          return <AlertCmp key={index} {...v} />
        })}
        {/* {notificationControls}
        {alertInfoList} */}
      </>
    </div>
  )
}

export default ThemeDecorator({ overlay: true, noAutoFocus: true }, App);
