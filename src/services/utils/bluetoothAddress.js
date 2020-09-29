import {getDisplayAffinity} from './displayAffinity';

const findAdapterAddress = (adapters) => {
	let active;

	if (getDisplayAffinity() === 1) {
		// secondary display, use first non-default adapter
		active = adapters.find(a => !a['default']);
	} else {
		// use default adapter
		active = adapters.find(a => a['default']);
	}

	return active && active.adapterAddress;
};

export {
	findAdapterAddress
};
