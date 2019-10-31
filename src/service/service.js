let provider = require('./providers/' + process.env.REACT_APP_SERVICE_PROVIDER);
provider = provider.default || provider;

const __MOCK__ = (process.env.REACT_APP_SERVICE_PROVIDER === 'Mock');

export default provider;
export {
	provider,
	__MOCK__
};
