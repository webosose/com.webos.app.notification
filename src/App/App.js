import AgateDecorator from '@enact/agate/AgateDecorator';
import Button from '@enact/agate/Button';
import ConsumerDecorator from '@enact/agate/data/ConsumerDecorator';
import ProviderDecorator from '@enact/agate/data/ProviderDecorator';
import Transition from '@enact/ui/Transition';
import kind from '@enact/core/kind';
import PropTypes from 'prop-types';
import compose from 'ramda/src/compose';
import React from 'react';

import Service, {__MOCK__} from '../service';
import NotificationContainer from '../views/NotificationContainer';

import initialState from './initialState';

import css from './App.module.less';

const AppBase = kind({
	name: 'App',

	propTypes: {
		notification: PropTypes.object,
		onHideAllNotification: PropTypes.func,
		onPushNotification: PropTypes.func
	},

	styles: {
		css,
		className: 'app'
	},

	computed: {
		// If this is running Mock data, remove the background, so this becomes an overlay app
		className: ({styler}) => styler.append({withBackground: __MOCK__})
	},

	render: ({
		notification,
		onHideAllNotification,
		onPushNotification,
		...rest
	}) => {
		const notificationControls = [];

		for (const key in notification) {
			notificationControls.push(
				<NotificationContainer key={notification[key].key} index={notification[key].key} text={notification[key].text} visible={notification[key].visible} />
			);
		}

		return (
			<div {...rest}>
				<Transition css={css} type="fade" className={css.notificationContainerTransition} visible={Boolean(Object.keys(notification).length)}>
					<div className={css.basement} onClick={onHideAllNotification} />
				</Transition>
				{__MOCK__ && (
					<div className={css.controls}>
						{/* These are just for a development aid */}
						<Button onClick={onPushNotification}>Subscribe Notification</Button>
						{/* End dev aids */}
					</div>
				)}
				<React.Fragment>
					{notificationControls}
				</React.Fragment>
			</div>
		);
	}
});

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
			onPushNotification: (ev, props, {update}) => {
				Service.getNotification({
					onSuccess: ({message}) => {
						update(state => {
							const key = window.performance.now();
							state.app.notification[key] = {key, visible: false, text: message};
						});
					},
					onFailure: (err) => {
						console.error(err); // eslint-disable-line no-console
					}
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
