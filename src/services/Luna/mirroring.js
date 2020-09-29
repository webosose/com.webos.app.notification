import luna from './request';

const MirroringService = {
	setAppMirroring: luna('com.webos.surfacemanager', 'setAppMirroring'),
	getAppMirroring: luna('com.webos.surfacemanager', 'getAppMirroring'), // subscribable
    setAudioMirroring: luna('com.webos.service.audio', 'auto/setMirrorMode')
};

export default MirroringService;
export {MirroringService};
