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
		{timeout = 0, ...params} = {},
		map
) => (
	({onSuccess, onFailure, onTimeout, onComplete, subscribe = false, ...additionalParams} = {}) => {
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

// For full spec and accepted options, see:
// https://wiki.lgsvl.com/display/webOSDocs/com.webos.service.applicationmanager+v4.1
const LunaProvider = {
	// com.webos.notification
	getAlertNotification: luna('com.webos.notification', 'getAlertNotification'), // subscribable
	getInputAlertNotification: luna('com.webos.notification', 'getInputAlertNotification'), // subscribable
	getPincodePromptNotification: luna('com.webos.notification', 'getPincodePromptNotification'), // subscribable
	getToastNotification: luna('com.webos.notification', 'getToastNotification'), // subscribable

	// com.webos.service.applicationmanager
	// FIXME: Remove the `getForegroundAppInfo` method if the others could be subscribed.
	// getForegroundAppInfo: luna('com.webos.service.applicationmanager', 'getForegroundAppInfo'), // subscribable
	launch: luna('com.webos.service.applicationmanager', 'launch', {id: 'com.webos.app.enactsampler'})
};

export default LunaProvider;
export {LunaProvider};
