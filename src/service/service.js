let provider = require('./providers/' + process.env.REACT_APP_SERVICE_PROVIDER);
provider = provider.default || provider;
const requests = {};

const __MOCK__ = (process.env.REACT_APP_SERVICE_PROVIDER === 'Mock');

// Cancel an active request by name and remove from mapping
const cancelRequest = name => {
	if (requests[name]) {
		requests[name].cancel();
		requests[name] = null;
	}
};
// Cancel all active requests of all categories
const cancelAllRequests = () =>
	Object.keys(requests).forEach(cancelRequest);

export default provider;
export {
	__MOCK__,
	provider,
	requests,
	cancelRequest,
	cancelAllRequests
};
