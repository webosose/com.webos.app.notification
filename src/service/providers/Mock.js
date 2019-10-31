const noop = function () {};

const mock = action => ({onSuccess = noop, subscribe = false} = {}) => {
	let id, cancelled = false;
	action().then(res => {
		if (cancelled) return;
		setTimeout(() => {
			if (subscribe) {
				id = setInterval(() => onSuccess(res), Math.random() * 5000 + 5000);
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
	getNotification: mock(() => import('./mockdata/notification.json')) // subscribable
};

export default MockProvider;
export {MockProvider};
