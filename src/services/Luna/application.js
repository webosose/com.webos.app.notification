import luna from './request';

const ApplicationService = {
	// Launch Point
	addLaunchPoint: luna('com.webos.service.applicationmanager', 'addLaunchPoint'),
	moveLaunchPoint: luna('com.webos.service.applicationmanager', 'moveLaunchPoint'),
	updateLaunchPoint: luna('com.webos.service.applicationmanager', 'updateLaunchPoint'),
	removeLaunchPoint: luna('com.webos.service.applicationmanager', 'removeLaunchPoint'),
	listLaunchPoints: luna('com.webos.service.applicationmanager', 'listLaunchPoints'), // subscribable

	// app download & install
	downloadApp: luna('com.webos.service.downloadmanager', 'download'),
	installApp: luna('com.webos.appInstallService', 'install'),
	removeApp: luna('com.webos.appInstallService', 'remove'),

	// Application
	listApps: luna('com.webos.service.applicationmanager', 'listApps'), // subscribable
	running: luna('com.webos.service.applicationmanager', 'running'), // subscribable,
	getForegroundAppInfo: luna('com.webos.service.applicationmanager', 'getForegroundAppInfo'),  // subscribable
	setOrder: luna('com.webos.service.applicationmanager', 'setOrder'),

	// Application Handling
	launch: luna('com.webos.service.applicationmanager', 'launch'),
	pause: luna('com.webos.service.applicationmanager', 'pause'),
	close: luna('com.webos.service.applicationmanager', 'close'),
	closeByAppId: luna('com.webos.service.applicationmanager', 'closeByAppId'),

	// Application Specific
	getAppInfo: luna('com.webos.service.applicationmanager', 'getAppInfo'),
	getAppLifeStatus: luna('com.webos.service.applicationmanager', 'getAppLifeStatus'),  // subscribable
	getAppLifeEvents: luna('com.webos.service.applicationmanager', 'getAppLifeEvents'), // subscribable
	getAppStatus: luna('com.webos.service.applicationmanager', 'getAppStatus') // subscribable
};

export default ApplicationService;
export {ApplicationService};
