import Icon from '@enact/sandstone/Icon';
import kind from '@enact/core/kind';
import {Row, Cell} from '@enact/ui/Layout';
import PropTypes from 'prop-types';
import css from './AlertText.module.less';

const Text = ({children}) => {
	return (
		<div className={css.textArea}>
			<div>
				<div aria-live="off" role="alert">{children}</div>
			</div>
		</div>
	);
};

const AlertText = kind({
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
export default AlertText;