import AgateDecorator from '@enact/agate/AgateDecorator';
import ConsumerDecorator from '@enact/agate/data/ConsumerDecorator';
import ProviderDecorator from '@enact/agate/data/ProviderDecorator';
import Transition from '@enact/ui/Transition';
import PropTypes from 'prop-types';
import compose from 'ramda/src/compose';
import React from 'react';
import getDisplayAffinity from '../services/utils/displayAffinity';

import {
	Application,
	Notification,
	cancelRequest,
	requests
} from '../services';
import NotificationContainer from '../views/NotificationContainer';

import initialState from './initialState';

import css from './App.module.less';
import AlertPopup from '../components/AlertPopup';

const subscribedLunaServiceList = [
	{method: 'getToastNotification', keyValue: 'message'}
];

const delayToHideForFirstNotification = 5000; // ms
const delayToHide = 1000; // ms

class AppBase extends React.Component {
	static propTypes = {
		alertInfo: PropTypes.object,
		notification: PropTypes.object,
		onHideAllNotification: PropTypes.func,
		onHideNotification: PropTypes.func,
		onPushAlertNotification: PropTypes.func,
		onPushNotification: PropTypes.func,
		onTimer: PropTypes.func
	};

	componentDidMount () {
		// console.log('display - ' + getDisplayAffinity());
		subscribedLunaServiceList.forEach(service => {
			const method = Notification[service.method];

			if (!requests[service.method]) {
				requests[service.method] = method({
					onSuccess: (param) => {
						if (getDisplayAffinity() !== ((param && Object.prototype.hasOwnProperty.call(param,'displayId')) ? param['displayId'] : 0)) {
							return;
						}
						const text = param && param[service.keyValue] || '';

						if (text !== '') {
							return this.handleSuccess({text});
						} else {
							return true;
						}
					},
					onFailure: this.handleFailure,
					subscribe: true
				});
			}
		});
		/* getAlertNotification response sample
		{
			"alertInfo": {
				"displayId": 0,
				"message": "hello world",
				"sourceId": "com.webos.lunasend-2782",
				"isNotiSave": false,
				"modal": false,
				"isSysReq": false,
				"onFailAction": {},
				"buttons": [
					{
						"focus": false,
						"action": {
							"launchParams": {
								"id": "com.webos.app.enactbrowser"
							},
							"serviceMethod": "launch",
							"serviceURI": "luna://com.webos.service.applicationmanager/"
						},
						"label": "launch"
					},
					{
						"focus": false,
						"label": "close"
					}
				],
				"onCloseAction": {},
				"alertId": "com.webos.lunasend-2782-1581573178555"
			},
			"timestamp": "1581573178555",
			"returnValue": true,
			"alertAction": "open" or "close"
		}
		*/
		if (!requests['getAlertNotification']) {
			requests['getAlertNotification'] = Notification.getAlertNotification({
				subscribe: true,
				onSuccess: (response) => {
					if (!(response.returnValue) || !(Object.prototype.hasOwnProperty.call(response,'alertInfo'))) {
						return;
					}
					const alertInfo = response.alertInfo;
					if (getDisplayAffinity() !== ((alertInfo && Object.prototype.hasOwnProperty.call(alertInfo,'displayId')) ? alertInfo['displayId'] : 0)) {
						return;
					}
					if (document.hidden) {
						Application.launch({id: 'com.webos.app.notification', params:{displayAffinity: getDisplayAffinity()}});
					}
					// handle alert action - close
					// update state to hidden and delete for matched alertId

					this.props.onPushAlertNotification({
						alertId: alertInfo.alertId,
						message: alertInfo.message,
						buttons: alertInfo.buttons
					});
				},
				onFailure: this.handleFailure
			});
		}
	}

	componentWillUnmount () {
		// Notification.cancelAllRequests();
		// console.log('componentWillUnmount');
		subscribedLunaServiceList.forEach(service => {
			cancelRequest(service.method);
		});
		cancelRequest('getAlertNotification');
	}

	handleSuccess = ({text}) => {
		if (document.hidden) {
			Application.launch({id: 'com.webos.app.notification', params:{displayAffinity: getDisplayAffinity()}});
		}

		if (text) {
			this.props.onPushNotification({text, cbTimeout: this.cbTimeout});
		} else {
			console.error('The luna service data is not valid.'); // eslint-disable-line no-console
		}
	};

	handleFailure = (err) => {
		console.error(err); // eslint-disable-line no-console
	};

	cbTimeout = () => {
		this.props.onHideNotification();

		this.props.onTimer({cbTimeout: this.cbTimeout});
	};

	render () {
		const
			{
				notification,
				alertInfo,
				onHideAllNotification,
				...rest
			} = this.props,
			notificationControls = [],
			alertInfoList = [];

		delete rest.onHideNotification;
		delete rest.onPushNotification;
		delete rest.onPushAlertNotification;
		delete rest.onTimer;

		for (const key in notification) {
			notificationControls.push(
				<NotificationContainer key={notification[key].key} index={notification[key].key} />
			);
		}

		for (const key in alertInfo) {
			alertInfoList.push(
				<AlertPopup key={alertInfo[key].alertId} alertId={alertInfo[key].alertId} />
			);
			// console.log('alertInfoList length = ' + alertInfoList.length);
		}

		return (
			<div {...rest} className={css.app}>
				<Transition css={css} type="fade" className={css.notificationContainerTransition} visible={Boolean(Object.keys(notification).length)}>
					<div className={css.basement} onClick={onHideAllNotification} />
				</Transition>
				<React.Fragment>
					{notificationControls}
					{alertInfoList}
				</React.Fragment>
			</div>
		);
	}
}

const AppDecorator = compose(
	AgateDecorator({
		noAutoFocus: true,
		overlay: true
	}),
	ProviderDecorator({
		state: initialState()
	}),
	ConsumerDecorator({
		mount: () => {
			const currentDisplayId = getDisplayAffinity();
			document.title = `${document.title} - Display ${currentDisplayId}`;
			document.addEventListener('webOSLocaleChange', () => {
				window.location.reload();
			});
		},
		handlers: {
			onHideAllNotification: (ev, props, {update}) => {
				update(state => {
					for (const key in state.app.notification) {
						state.app.notification[key].visible = false;
					}
				});
			},
			onPushNotification: ({text, cbTimeout}, props,  {update}) => {
				update(state => {
					const key = window.performance.now() + '';
					state.app.notification[key] = {key, visible: false, text};

					if (state.app.timerId) {
						clearTimeout(state.app.timerId);
						state.app.timerId = null;
					}

					state.app.timerId = setTimeout(cbTimeout, delayToHideForFirstNotification);
				});
			},
			onHideNotification: (context, props, {update}) => {
				update(state => {
					let cntNotificationLeft = 0;

					// eslint-disable-next-line no-unused-vars
					for (const key in state.app.notification) {
						cntNotificationLeft++;
					}

					if (cntNotificationLeft === 0) {
						return;
					}

					let keyToHide = null;

					for (const key in state.app.notification) {
						if (keyToHide === null || state.app.notification[keyToHide].key < state.app.notification[key].key) {
							keyToHide = key;
						}
					}

					if (keyToHide) {
						state.app.notification[keyToHide].visible = false;
					}
				});
			},
			onTimer: ({cbTimeout}, props, {update}) => {
				update(state => {
					state.app.timerId = setTimeout(cbTimeout, delayToHide);
				});
			},
			onPushAlertNotification: (ev, props, {update}) => {
				let {alertId, message, buttons} = ev;
				update(state => {
					state.app.alertInfo[alertId] = {alertId, message, buttons, visible: true};
				});
			}
		},
		mapStateToProps: ({app}) => ({
			notification: app.notification,
			alertInfo: app.alertInfo
		})
	})
);

const App = AppDecorator(AppBase);

export default App;
