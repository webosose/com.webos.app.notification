import luna from './request';

const DeveloperService = {
	getDeveloperMode: luna('com.webos.service.devmode', 'getDevMode'),
	setDeveloperMode: luna('com.webos.service.devmode', 'setDevMode')
};

export default DeveloperService;
export {DeveloperService};
