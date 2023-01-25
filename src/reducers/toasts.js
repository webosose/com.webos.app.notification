import { ADD_TOAST, REMOVE_TOAST, SHOW_TOAST, REMOVE_ALL_TOAST, HIDE_TOAST } from "../actions/actionNames";

const toasts = (state = [], action) => {
	switch (action.type) {
		case ADD_TOAST:
			return [...state, { ...action.payload }];
		case REMOVE_TOAST:
			return state.filter((v) => action.id !== v.id);
		case REMOVE_ALL_TOAST:
			return [];
		case SHOW_TOAST:
			return state.map((v) => {
				v.visible = false;
				if (action.id === v.id) {
					v.visible = true;
				}
				return v;
			});
		case HIDE_TOAST:
			return state.map((v) => {
				v.visible = false;
				return v;
			});
		default:
			return state;
	}
}
export default toasts;