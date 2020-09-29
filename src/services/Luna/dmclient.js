import luna from './request';

const DMClientService = {
	getStatus: luna('com.lge.service.dmclient', 'getStatus'), // subscribable
	userInit: luna('com.lge.service.dmclient','userInit'), 
};

export default DMClientService;
export {DMClientService};
