import Icon from '@enact/agate/Icon';
import Skinnable from '@enact/agate/Skinnable';
import kind from '@enact/core/kind';
import {Row, Cell} from '@enact/ui/Layout';
import PropTypes from 'prop-types';
// import React from 'react';

import css from './NotificationControl.module.less';

const Text = ({children}) => {
	return (
		<div className={css.textArea}>
			<div>
				<div aria-live="off" role="alert">{children}</div>
			</div>
		</div>
	);
};

const NotificationControlBase = kind({
	name: 'NotificationControl',

	propTypes: {
		text: PropTypes.string
	},

	styles: {
		css,
		className: 'notificationControl'
	},

	render: ({text, ...rest}) => {
		return (
			<Row {...rest}>
				<Cell className={css.iconContainer} shrink>
					<Icon size="large">notification</Icon>
				</Cell>
				<Cell className={css.dividerContainer} shrink />
				<Cell className={css.textContainer}>
					<Text>{text}</Text>
				</Cell>
			</Row>
		);
	}
});

const NotificationControl = Skinnable(NotificationControlBase);

export default NotificationControl;
export {
	NotificationControl,
	NotificationControlBase
};
