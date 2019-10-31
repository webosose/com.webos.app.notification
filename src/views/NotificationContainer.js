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
		onHideNotification: PropTypes.func,
		onPopNotification: PropTypes.func,
		onShowNotification: PropTypes.func,
		text: PropTypes.string,
		visible: PropTypes.bool
	}

	componentDidMount () {
		this.props.onShowNotification();
		this.hideTimerId = setTimeout(this.hideNotificationContainer, delayTohide);
	}

	componentWillUnmount () {
		if (this.hideTimerId) {
			clearTimeout(this.hideNotificationContainer);
		}
	}

	hideTimerId = null

	hideNotificationContainer = () => {
		this.props.onHideNotification();
	}

	handleHide = () => {
		this.props.onPopNotification();
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
			onHideNotification: (ev, props, {update}) => {
				update(state => {
					state.app.notification[props.index].visible = false;
				});
			},
			onPopNotification: (ev, props, {update}) => {
				update(state => {
					delete state.app.notification[props.index];
				});
			},
			onShowNotification: (ev, props, {update}) => {
				update(state => {
					state.app.notification[props.index].visible = true;
				});
			}
		},
		mapStateToProps: ({app}, props) => ({
			index: props.index,
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
