import ConsumerDecorator from '@enact/agate/data/ConsumerDecorator';
import Transition from '@enact/ui/Transition';
import PropTypes from 'prop-types';
import compose from 'ramda/src/compose';
import React from 'react';

import NotificationControl from '../components/NotificationControl';

import css from './NotificationContainer.module.less';

class NotificationContainerBase extends React.Component {
	static propTypes = {
		index: PropTypes.string,
		onHideNotification: PropTypes.func,
		onPopNotification: PropTypes.func,
		onShowNotification: PropTypes.func,
		text: PropTypes.string,
		visible: PropTypes.bool
	};
	componentDidMount () {
		this.props.onShowNotification({index: this.props.index});
	}

	handleHide = () => {
		this.props.onPopNotification({index: this.props.index});
	};

	render () {
		const {
			text,
			visible,
			...rest
		} = this.props;

		delete rest.index;
		delete rest.onHideNotification;
		delete rest.onPopNotification;
		delete rest.onShowNotification;

		return (
			<Transition
				className={css.notificationContainerTransition}
				css={css}
				direction="up"
				onHide={this.handleHide}
				timingFunction="ease-out"
				type={visible ? 'slide' : 'fade'}
				visible={visible}
			>
				<div {...rest} className={css.notificationContainer}>
					<NotificationControl text={text} />
				</div>
			</Transition>
		);
	}
}

const NotificationContainerDecorator = compose(
	ConsumerDecorator({
		handlers: {
			onPopNotification: ({index}, props, {update}) => {
				update(state => {
					delete state.app.notification[index];

					let cntNotificationLeft = 0;

					// eslint-disable-next-line no-unused-vars
					for (const key in state.app.notification) {
						cntNotificationLeft++;
					}

					if (cntNotificationLeft === 0) {
						update(updateState => {
							if (state.app.timerId) {
								// console.log('clearTimeout & make timerId null');
								clearTimeout(updateState.app.timerId);
								updateState.app.timerId = null;
							}
						});
						window.close();
					}
				});
			},
			onShowNotification: ({index}, props, {update}) => {
				update(state => {
					state.app.notification[index].visible = true;
				});
			}
		},
		mapStateToProps: ({app}, {index}) => ({
			text: app.notification[index].text,
			visible: app.notification[index].visible
		})
	})
);

const NotificationContainer = NotificationContainerDecorator(NotificationContainerBase);

export default NotificationContainer;
export {
	NotificationContainer
};
