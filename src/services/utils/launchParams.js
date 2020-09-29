/* eslint-disable no-undefined */

const getLaunchParams = () => {
	try {
		const params = JSON.parse(window.webOSSystem.launchParams);
		return (typeof params !== 'undefined') ? params : undefined;
	} catch (e) {
		return undefined;
	}
};

export default getLaunchParams;
export {getLaunchParams};
