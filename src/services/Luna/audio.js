import luna from './request';

const AudioService = {
	setSoundToSettingsService: ({name, value, displayId, ...rest}) => {
		let params = {
			category: 'Session' + displayId,
			settings: {}
		};
		params.settings[name] = value;
		return luna('com.webos.settingsservice', 'setSystemSettings', params)(rest);

	},
	getSoundsFromSettingsService: ({displayId, subscribe, ...rest}) => {
		let params = {
			category: 'Session' + displayId,
			keys: ['Volume', 'MediaVolume', 'SoundEffectVolume'],
			subscribe: subscribe
		};
		return luna('com.webos.settingsservice', 'getSystemSettings', params)(rest);
	},
	getSoundFromSettingsService: ({displayId, subscribe, key, ...rest}) => {
		let params = {
			category: 'Session' + displayId,
			key: key,
			subscribe: subscribe
		};
		return luna('com.webos.settingsservice', 'getSystemSettings', params)(rest);
	},
	getEffectVolume: luna('com.webos.service.audio', 'notification/getVolume'),
	setEffectVolume: luna('com.webos.service.audio', 'notification/setVolume'),
	getMediaVolume: luna('com.webos.service.audio', 'media/getVolume'),
	setMediaVolume: luna('com.webos.service.audio', 'media/setVolume'),
	getMasterVolume: luna('com.webos.service.audio', 'master/getVolume'),
	setMasterVolume: luna('com.webos.service.audio', 'master/setVolume', {
		soundOutput:'alsa'
	})
};


export default AudioService;
export {AudioService};
