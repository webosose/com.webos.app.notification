import { SET_POWER_STATE } from "../actions/actionNames";

const powerState = (state = 'Active', action) => {
	switch (action.type) {
		case SET_POWER_STATE:
			return action.payload
		default:
			return state;
	}
}
export default powerState;