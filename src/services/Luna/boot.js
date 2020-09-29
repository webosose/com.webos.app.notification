import luna from './request';

const BootService = {
	notifyFirstUseDone: luna('com.webos.bootManager', 'firstUseDone'),
	factoryReset : luna('com.webos.bootManager', 'factoryReset')
};

export default BootService;
export {BootService};
