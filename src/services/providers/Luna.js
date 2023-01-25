import LS2Request from '@enact/webos/LS2Request';

const fwd = res => res;

const handler = (callback, map = fwd) => callback && (res => {
	if ((res.errorCode || res.returnValue === false)) {
		const err = new Error(res.errorText);
		err.code = res.errorCode;
		callback(err);
	} else {
		callback(map(res));
	}
});

const luna = (
	service,
	method,
	{ subscribe = false, timeout = 0, ...params } = {},
	map
) => (
	({ onSuccess, onFailure, onTimeout, onComplete, ...additionalParams } = {}) => {
		const req = new LS2Request();
		req.send({
			service: 'luna://' + service,
			method,
			parameters: Object.assign({}, params, additionalParams),
			onSuccess: handler(onSuccess, map),
			onFailure: handler(onFailure),
			onTimeout: handler(onTimeout),
			onComplete: handler(onComplete, map),
			subscribe,
			timeout
		});
		return req;
	}
);

const LunaProvider = {

	getAlertNotification: luna('com.webos.notification', 'getAlertNotification'),
	getToastNotification: luna('com.webos.notification', 'getToastNotification'),

	// Application Handling
	launch: luna('com.webos.service.applicationmanager', 'launch')
};

export default LunaProvider;
export { LunaProvider };
