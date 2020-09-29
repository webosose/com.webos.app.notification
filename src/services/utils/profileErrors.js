import $L from '@enact/i18n/$L';

export const PROFILE_ERROR = {
	INVALID_NAME: 100,
	INVALID_AVATARURL: 101,
	INVALID_FIRSTNAME: 102,
	INVALID_LASTNAME: 103,
	INVALID_PHONENUM: 104,
	INVALID_AGETYPE: 105,

	INVALID_COUNTRY: 106,
	INVALID_ZIPCODE: 107,
	INVALID_STATE: 108,
	INVALID_CITY: 109,
	INVALID_ADDRESSLINE1: 110,
	INVALID_ADDRESSLINE2: 111,
};
// 'name', 'firstName', 'lastName', 'phoneNum', 'ageType', 'country', 'zipCode, 'state', 'city', 'addressLine1', 'addressLine2',

export function findMsgByErrorCode (code, message) {
	const msg = {
		code,
		message: $L('Unable to create new profile.'),
		reason: '',
		suggestion: $L('Please check the form and try again')
	};
	switch (code) {
		case PROFILE_ERROR.INVALID_AVATARURL:
			msg.reason = $L('Invalid avatar. This field cannot be empty.');
			break;
		case PROFILE_ERROR.INVALID_NAME:
			msg.reason = $L('Invalid display name. This field cannot be empty.');
			break;
		case PROFILE_ERROR.INVALID_FIRSTNAME:
			msg.reason = $L('Invalid first name. This field cannot be empty.');
			break;
		case PROFILE_ERROR.INVALID_LASTNAME:
			msg.reason = $L('Invalid last name. This field cannot be empty.');
			break;
		case PROFILE_ERROR.INVALID_PHONENUM:
			msg.reason = $L('Invalid phone num. This field cannot be empty.');
			break;
		case PROFILE_ERROR.INVALID_AGETYPE:
			msg.reason = $L('Invalid age type. This field cannot be empty.');
			break;

		case PROFILE_ERROR.INVALID_COUNTRY:
			msg.reason = $L('Invalid country. This field cannot be empty.');
			break;
		case PROFILE_ERROR.INVALID_ZIPCODE:
			msg.reason = $L('Invalid zip code. This field cannot be empty.');
			break;
		case PROFILE_ERROR.INVALID_STATE:
			msg.reason = $L('Invalid state. This field cannot be empty.');
			break;
		case PROFILE_ERROR.INVALID_CITY:
			msg.reason = $L('Invalid city. This field cannot be empty.');
			break;
		case PROFILE_ERROR.INVALID_ADDRESSLINE1:
			msg.reason = $L('Invalid street address1. This field cannot be empty.');
			break;
		case PROFILE_ERROR.INVALID_ADDRESSLINE2:
			msg.reason = $L('Invalid street address2. This field cannot be empty.');
			break;
		default:
			msg.reason = message;
			break;
	}
	msg.reason = msg.reason;
	return msg;
}
