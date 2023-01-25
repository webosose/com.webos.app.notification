import { ADD_ALERT, REMOVE_ALERT } from "../actions/actionNames";

const alerts = (state = [], action) => {
	switch (action.type) {
		case ADD_ALERT:
			return [...state, { ...action.payload }];
		case REMOVE_ALERT:
			return state.filter((v) => action.alertId !== v.alertId);
		default:
			return state;
	}
}
export default alerts;