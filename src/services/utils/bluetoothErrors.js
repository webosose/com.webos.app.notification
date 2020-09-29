import $L from '@enact/i18n/$L';

export function findMsgByErrorCode (code, message = '') {
	return {
		code,
		error: $L('Your Display failed to connect the device.'),
		reason: message,
		suggestion: $L('Please check the status and try again')
	};
}
