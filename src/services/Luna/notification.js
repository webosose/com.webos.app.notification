import luna from './request';

const NotificationService = {
	getAlertNotification: luna('com.webos.notification', 'getAlertNotification'),
	getInputAlertNotification: luna('com.webos.notification', 'getInputAlertNotification'),
	getPincodePromptNotification: luna('com.webos.notification', 'getPincodePromptNotification'),
	getToastNotification: luna('com.webos.notification', 'getToastNotification'),
	createToast: (params) => luna('com.webos.notification', 'createToast')(params)
};

export default NotificationService;
export {NotificationService};
