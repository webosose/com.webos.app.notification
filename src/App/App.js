import AgateDecorator from '@enact/agate/AgateDecorator';
import Button from '@enact/agate/Button';
import ConsumerDecorator from '@enact/agate/data/ConsumerDecorator';
import ProviderDecorator from '@enact/agate/data/ProviderDecorator';
import Transition from '@enact/ui/Transition';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import compose from 'ramda/src/compose';
import React from 'react';
import getDisplayAffinity from 'webos-auto-service/utils/displayAffinity';

import {
	__MOCK__,
	Application,
	Notification,
	cancelRequest,
	requests
} from 'webos-auto-service';
import NotificationContainer from '../views/NotificationContainer';

import initialState from './initialState';

import css from './App.module.less';
import AlertPopup from '../components/AlertPopup';

const subscribedLunaServiceList = [
	{method: 'getToastNotification', keyValue: 'message'}
];

class AppBase extends React.Component {
	static propTypes = {
		alertInfo: PropTypes.object,
		notification: PropTypes.object,
		onHideAllNotification: PropTypes.func,
		onPushNotification: PropTypes.func,
		onPushAlertNotification: PropTypes.func
	}

	componentDidMount () {
		console.log("display - " + getDisplayAffinity());
		subscribedLunaServiceList.forEach(service => {
			const method = Notification[service.method];

			requests[service.method] = method({
				onSuccess: (param) => {
					if (getDisplayAffinity() !== ((param && param.hasOwnProperty('displayId')) ? param['displayId'] : 0)) {
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
		requests['getAlertNotification'] = Notification.getAlertNotification({
			subscribe: true,
			onSuccess: (response) => {
				if (!(response.returnValue) || !(response.hasOwnProperty('alertInfo'))) {
					return;
				}
				const alertInfo = response.alertInfo;
				if (getDisplayAffinity() !== ((alertInfo && alertInfo.hasOwnProperty('displayId')) ? alertInfo['displayId'] : 0)) {
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

	componentWillUnmount () {
		Notification.cancelAllRequests();
	}

	handleSuccess = ({text}) => {
		if (document.hidden) {
			Application.launch({id: 'com.webos.app.notification', params:{displayAffinity: getDisplayAffinity()}});
		}

		if (text) {
			this.props.onPushNotification({text});
		} else {
			console.error('The luna service data is not valid.'); // eslint-disable-line no-console
		}
	}

	handleFailure = (err) => {
		console.error(err); // eslint-disable-line no-console
	}

	// for develop
	handlePushNotification = () => {
		this.props.onPushNotification({text: 'Hello !'});
	}

	// for develop
	handlePushAlertNotification = () => {
		console.log("handlePushAlertNotification");
		this.props.onPushAlertNotification({
			alertId: 'test sample',
			message: 'alert test message',
			buttons: [
				{
					focus: false,
					action: {
						launchParams: {
							"id": "com.webos.app.enactbrowser"
						},
						serviceMethod: "launch",
						serviceURI: "luna://com.webos.service.applicationmanager/"
					},
					label: "launch"
				},
				{
					focus: false,
					label: "close"
				}
			]
		});
	}

	render () {
		const
			{
				className,
				notification,
				alertInfo,
				onHideAllNotification,
				...rest
			} = this.props,
			notificationControls = [],
			alertInfoList = [];

		delete rest.onPushNotification;
		delete rest.onPushAlertNotification;

		for (const key in notification) {
			notificationControls.push(
				<NotificationContainer key={notification[key].key} index={notification[key].key}/>
			);
		}

		for (const key in alertInfo) {
			alertInfoList.push(
				<AlertPopup key={alertInfo[key].alertId} alertId={alertInfo[key].alertId}/>
			);
			console.log("alertInfoList length = " + alertInfoList.length);
		}

		return (
			/* If this is running Mock data, remove the background, so this becomes an overlay app */
			<div {...rest} className={classNames(className, css.app, __MOCK__ ? css.withBackground : null)}>
				<Transition css={css} type="fade" className={css.notificationContainerTransition} visible={Boolean(Object.keys(notification).length)}>
					<div className={css.basement} onClick={onHideAllNotification} />
				</Transition>
				{__MOCK__ && (
					<div className={css.controls}>
						{/* These are just for a development aid */}
						<Button onClick={this.handlePushNotification}>Subscribe Notification</Button>
						{/* End dev aids */}
						<Button onClick={this.handlePushAlertNotification}>Show Alert</Button>
					</div>
				)}
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
			onPushNotification: ({text}, props,  {update}) => {
				update(state => {
					const key = window.performance.now() + '';
					state.app.notification[key] = {key, visible: false, text};
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
