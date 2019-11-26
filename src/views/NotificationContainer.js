import ConsumerDecorator from '@enact/agate/data/ConsumerDecorator';
import Transition from '@enact/ui/Transition';
import PropTypes from 'prop-types';
import compose from 'ramda/src/compose';
import React from 'react';

import NotificationControl from '../components/NotificationControl';

import css from './NotificationContainer.module.less';

const delayTohide = 1500;

class NotificationContainerBase extends React.Component {
	static propTypes = {
		index: PropTypes.string,
		onHideNotification: PropTypes.func,
		onPopNotification: PropTypes.func,
		onShowNotification: PropTypes.func,
		text: PropTypes.string,
		visible: PropTypes.bool
	}

	componentDidMount () {
		this.props.onShowNotification({index: this.props.index});
		this.hideTimerId = setTimeout(this.hideNotificationContainer, delayTohide);
	}

	componentWillUnmount () {
		if (this.hideTimerId) {
			clearTimeout(this.hideTimerId);
		}
	}

	hideTimerId = null

	hideNotificationContainer = () => {
		this.props.onHideNotification({index: this.props.index});
	}

	handleHide = () => {
		this.props.onPopNotification({index: this.props.index});
	}

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
			<Transition css={css} direction="up" timingFunction="ease-out" className={css.notificationContainerTransition} visible={visible} onHide={this.handleHide}>
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
			onHideNotification: ({index}, props, {update}) => {
				update(state => {
					state.app.notification[index].visible = false;
				});
			},
			onPopNotification: ({index}, props, {update}) => {
				update(state => {
					delete state.app.notification[index];

					if (typeof state.app.notification.length === 'undefined') {
						// The following code is commented to test easily
						// because no {keepAlive: true } option could be for a test app.
						// We need to activate it later.
						// window.close();
					}
				});
			},
			onShowNotification: ({index}, props, {update}) => {
				update(state => {
					state.app.notification[index].visible = true;
				});
			}
		},
		mapStateToProps: ({app}, props) => ({
			text: app.notification[props.index].text,
			visible: app.notification[props.index].visible
		})
	})
);

const NotificationContainer = NotificationContainerDecorator(NotificationContainerBase);

export default NotificationContainer;
export {
	NotificationContainer
};
