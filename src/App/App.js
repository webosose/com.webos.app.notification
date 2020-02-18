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

const subscribedLunaServiceList = [
	{method: 'getToastNotification', keyValue: 'message'}
];

class AppBase extends React.Component {
	static propTypes = {
		notification: PropTypes.object,
		onHideAllNotification: PropTypes.func,
		onPushNotification: PropTypes.func
	}

	componentDidMount () {
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

	handlePushNotification = () => {
		this.props.onPushNotification({text: 'Hello !'});
	}

	render () {
		const
			{
				className,
				notification,
				onHideAllNotification,
				...rest
			} = this.props,
			notificationControls = [];

		delete rest.onPushNotification;

		for (const key in notification) {
			notificationControls.push(
				<NotificationContainer key={notification[key].key} index={notification[key].key} text={notification[key].text} visible={notification[key].visible} />
			);
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
					</div>
				)}
				<React.Fragment>
					{notificationControls}
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
			}
		},
		mapStateToProps: ({app}) => ({
			notification: app.notification
		})
	})
);

const App = AppDecorator(AppBase);

export default App;
