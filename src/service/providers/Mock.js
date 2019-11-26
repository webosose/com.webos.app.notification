const noop = function () {};

const mock = action => ({onSuccess = noop, subscribe = false} = {}) => {
	let id, cancelled = false;
	action().then(res => {
		if (cancelled) return;
		setTimeout(() => {
			if (subscribe) {
				id = setInterval(() => onSuccess(res), Math.random() * 60000 + 5000);
			}
			onSuccess(res);
		}, 20);
	});

	return {
		cancel: () => {
			if (id) clearInterval(id);
			cancelled = true;
		}
	};
};

const MockProvider = {
	// com.webos.notification
	getAlertNotification: mock(() => import('./mockdata/getAlertNotification.json')), // subscribable
	getInputAlertNotification: mock(() => import('./mockdata/getInputAlertNotification.json')), // subscribable
	getPincodePromptNotification: mock(() => import('./mockdata/getPincodePromptNotification.json')), // subscribable
	getToastNotification: mock(() => import('./mockdata/getToastNotification.json')), // subscribable

	// com.webos.service.applicationmanager
	// FIXME: Remove the `getForegroundAppInfo` method if the others could be subscribed.
	// getForegroundAppInfo: mock(() => import('./mockdata/getForegroundAppInfo.json')), // subscribable
	launch: mock(() => import('./mockdata/launch.json'))
};

export default MockProvider;
export {MockProvider};
