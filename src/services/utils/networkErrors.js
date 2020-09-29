import $L from '@enact/i18n/$L';

export const NETWORK_ERROR = {
	UNKNOWN_ERROR: 1,
	INVALID_PARAMETERS: 3,
	CONNMAN_UNAVAILABLE: 4,
	WIFI_TECHNOLOGY_UNAVAILABLE: 5,
	WIFI_OFF: 7,
	PASSWORD_ERROR: 10,
	AUTHENTICATION_FAILURE: 11,
	LOGIN_FAILURE: 12,
	CONNECTION_ESTABLISHMENT_FAILURE: 13,
	INVALID_IP_ADDRESS: 14,
	PINCODE_ERROR: 15,
	OUT_OF_RAGE: 16,
	NETWORK_NOT_FOUND: 102,
	WIFI_ALREADY_ENABLED: 103,
	WIFI_ALREADY_DISABLED: 104,
	PROFILE_NOT_FOUND: 105,
	ERROR_SCANNING_NETWORK: 108,
	ALREADY_SCANNING: 160,
	INVALID_SCAN_INTERVAL: 161
};

export function findMsgByErrorCode (code) {
	const msg = {
		code,
		message: $L('Unable to connect to the network.'),
		reason: '',
		suggestion: $L('Please check the status and try again')
	};
	switch (code) {
		case NETWORK_ERROR.UNKNOWN_ERROR:
			msg.reason = $L('Could not indentify the reason for failure.'); // i18n : New exception message of unknown error
			break;
		case NETWORK_ERROR.PASSWORD_ERROR:
			msg.reason = $L('Reason: Entered password is incorrect.'); // i18n : New exception message when the supplied password is incorrect
			break;
		case NETWORK_ERROR.AUTHENTICATION_FAILURE:
			msg.reason = $L('Reason: Authentication with access point failed.'); // i18n : New exception message of authentication failure
			break;
		case NETWORK_ERROR.LOGIN_FAILURE:
			msg.reason = $L('Reason: Unable to login.'); // i18n : New exception message of login failure
			break;
		case NETWORK_ERROR.CONNECTION_ESTABLISHMENT_FAILURE:
			msg.reason = $L('Reason: Could not establish a connection to access point.'); // i18n : New exception message of no internet connection
			break;
		case NETWORK_ERROR.INVALID_IP_ADDRESS:
			msg.reason = $L('Reason: Could not retrieve a valid IP address by using DHCP.'); // i18n : DHCP means dynamic host configuration protocol
			break;
		case NETWORK_ERROR.PINCODE_ERROR:
			msg.reason = $L('Reason: PIN is missing.'); // i18n : New exception message of wrong PIN code
			break;
		case NETWORK_ERROR.OUT_OF_RAGE:
			msg.reason = $L('Reason: The network you selected is out of range.'); // i18n : New exception message of network out of range
			break;
		case NETWORK_ERROR.NETWORK_NOT_FOUND: // Error message: 'Network not found'
			msg.reason = $L('Could not fined available network.'); // i18n : New exception message of network out of range
			break;
		case NETWORK_ERROR.WIFI_TECHNOLOGY_UNAVAILABLE: // 'WiFi technology unavailable'
			msg.reason = $L('Wi-Fi error occurred.'); // i18n : New exception message of network out of range
			break;
		default:
			msg.reason = $L('Please check the network name and password and try again.');
			break;
	}
	return msg;
}
