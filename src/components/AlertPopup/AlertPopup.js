import LabeledIconButton from '@enact/agate/LabeledIconButton';
import PopupMenu from '@enact/agate/PopupMenu';
import ConsumerDecorator from '@enact/agate/data/ConsumerDecorator';
import $L from '@enact/i18n/$L/$L';
import Group from '@enact/ui/Group';
import kind from '@enact/core/kind';
import ri from '@enact/ui/resolution';
import React from 'react';
import PropTypes from 'prop-types';

import css from './AlertPopup.module.less';

const SharedIconButtonProps = {backgroundOpacity: 'lightOpaque', inline: true, size: 'huge'};

const AlertPopupBase = kind({
	name: 'AlertPopup',

	propTypes: {
		alertId: PropTypes.string,
		buttons: PropTypes.array,
		message: PropTypes.string,
		onClickButton: PropTypes.func,
		visible: PropTypes.bool
	},

	styles: {
		css,
		className: 'alertPopup'
	},

	computed: {
		buttonList: ({buttons, alertId}) => {
			return buttons.map(
				(btn, index) => ({
					key: alertId + '-btn-' + index,
					children: btn.label,
					icon: (index === 0) ? 'accept' : 'decline'
				})
			);
		},
		selectedButton: ({buttons}) => {
			return buttons.findIndex(btn => btn.focus);
		}
	},

	render: ({buttonList, selectedButton, onClickButton, message, ...rest}) => {

		const msgStyle = {
			color: '#ffffff',
			width: ri.scale(1300),
			height: ri.scale(221),
			textAlign: 'center',
			margin: '0 auto',
			fontSize: ri.scale(42)
		};

		return (
			<PopupMenu skinVariants="night" open {...rest} css={css} className={css.title} title={$L('Alert')}>
				<Group
					childComponent={LabeledIconButton}
					itemProps={SharedIconButtonProps}
					selected={selectedButton}
					selectedProp="selected"
					onSelect={onClickButton}
				>
					{buttonList}
				</Group>
				<div style={msgStyle}>
					<p>{message}</p>
				</div>
			</PopupMenu>

		);
	}
});

const AlertPopupDecorator = ConsumerDecorator({
	handlers: {
		onClickButton: (ev, {alertId}, {state, update}) => {
			if (typeof ev.selected !== 'number') {
				// console.error('type error : ev.selected is not number');
				return;
			}
			let action = state.app.alertInfo[alertId].buttons[ev.selected].action;
			if (typeof action === 'object' && action.Object.prototype.hasOwnProperty.call('serviceURI') && action.Object.prototype.hasOwnProperty.call('serviceMethod')) {
				/* eslint-disable-next-line no-console */
				console.log('api call: ' + action.serviceURI + action.serviceMethod);
			}
			// close & delete popup
			update((updateState) => {
				delete updateState.app.alertInfo[alertId];
				if (typeof updateState.app.alertInfo.length === 'undefined') {
					window.close();
				}
			});
		}
	},
	mapStateToProps: ({app}, {alertId}) => ({
		message: app.alertInfo[alertId].message,
		buttons: app.alertInfo[alertId].buttons,
		visible: app.alertInfo[alertId].visible
	})
}
);

const AlertPopup = AlertPopupDecorator(AlertPopupBase);

export default AlertPopup;
export {
	AlertPopup,
	AlertPopupBase
};
