const getDisplayAffinity = () => {
	try {
		const {displayAffinity} = JSON.parse(window.PalmSystem.launchParams);
		return (typeof displayAffinity !== 'undefined') ? displayAffinity : 0;
	} catch (e) {
		return 0;
	}
};

export default getDisplayAffinity;
export {getDisplayAffinity};
