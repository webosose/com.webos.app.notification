import luna from './request';

const GeneralService = {
	getDeviceName: luna('com.webos.settingsservice', 'getSystemSettings', {
		category:'network',
		keys:['deviceName'],
		subscribe:true
	}, res => ({deviceName: res.settings.deviceName})), // subscribable
	// Supports: {'deviceName':<string>}
	setDeviceName: luna('com.webos.settingsservice', 'setSystemSettings', {
		category:'network'
	}),
	getOSInfo: luna('com.webos.service.systemservice/osInfo', 'query', {
		parameters: ['webos_release', 'webos_build_id']
	}, res => ({version: res.webos_release, build: res.webos_build_id})),
	getLocaleInfo: luna('com.webos.settingsservice', 'getSystemSettings', {
		key: 'localeInfo'
	}, res => res.settings.localeInfo), // subscribable
	// luna-send -n 1 luna://com.webos.settingsservice/setSystemSettings '{ "settings": { "localeInfo": { "locales": { "UI": "en-US" } } } }'
	setLocaleInfo: ({locale, keyboards, ...rest}) => {
		console.log('locale',locale,'keyboards',keyboards);
		const param = {
			settings: {
				localeInfo: {
					locales: {},
				}
			}
		};
		if (locale) param.settings.localeInfo['locales'] = {UI:locale};
		if (keyboards) param.settings.localeInfo['keyboards'] = keyboards;
		console.log('param',param);

		return luna('com.webos.settingsservice', 'setSystemSettings', param)(rest);
	},
	getFromSettingsService: ({subscribe, category, key, ...rest}) => {
		let params = {
			category: category || "",
			key: key,
			subscribe: subscribe
		};
		return luna('com.webos.settingsservice', 'getSystemSettings', params)(rest);
	},
	setToSettingsService: ({name, category, value, ...rest}) => {
		let params = {
			category: category || "",
			settings: {}
		};
		params.settings[name] = value;
		return luna('com.webos.settingsservice', 'setSystemSettings', params)(rest);
	},

	getSystemTime: luna('com.webos.service.systemservice/time', 'getSystemTime'), // subscribable
	setSystemTime: luna('com.webos.service.systemservice/time', 'setSystemTime'),
	getTimePrefs: luna('com.webos.service.systemservice', 'getPreferences', {
		keys: ['useNetworkTime', 'useNetworkTimeZone', 'timeZone', 'timeFormat']
	}), // subscribable
	// Supports: {'enable':<boolean>}
	setAutoClock: ({enable = true, ...rest} = {}) => {
		const setting = {autoClock: (enable ? 'on' : 'off')};
		return luna('com.webos.settingsservice', 'setSystemSettings', {
			category: 'time',
			setting
		})(rest);
	},
	// Supports: {'useNetworkTime':<boolean>}
	setNetworkTime: luna('com.webos.service.systemservice', 'setPreferences'),
	
	// support params
	// {
	// 	useNetworkTime: <boolean>,
	// 	timeZone: { ZoneID: <string>},
	// 	timeFormat: <string>
	// }
	setPreferences: luna('com.webos.service.systemservice', 'setPreferences'),

	getSystemCountry: luna('com.webos.settingsservice', 'getSystemSettings', {
		category: 'option',
		keys: ['country', 'countryRegion']
	}, res => ({
		country: res.settings.country,
		countryRegion: res.settings.countryRegion
	})), // subscribable
	setSystemCountry: ({country, ...rest}) => {
		const settings = {country};
		luna('com.webos.settingsservice', 'setSystemSettings', {
			category: 'option',
			settings
		})(rest);
	},
	getSystemLocaleList: luna('com.webos.settingsservice', 'getSystemSettingValues', {
		key: 'locale'
	}),
	getSystemCountryList: luna('com.webos.settingsservice', 'getSystemSettingValues', {
		category: 'option',
		key: 'country'
	}),
	getSystemRegionList: luna('com.webos.settingsservice', 'getSystemSettingValues', {
		category: 'option',
		key: 'countryRegion'
	}),
	getSystemTimezoneList: luna('com.webos.service.systemservice', 'getPreferenceValues', {
		key: 'timeZone'
	}),
	createToast: luna('com.webos.notification', 'createToast'),
    setAutomaticUpdate: ({flag, ...rest}) => {
        const settings = {AutoSWUpdate: (flag)?"On":"Off"};
        luna('com.webos.settingsservice', 'setSystemSettings', {
            settings
        })(rest);
    },
    getAutomaticUpdate: luna('com.webos.settingsservice', 'getSystemSettings', {
        key: 'AutoSWUpdate'
    }, res => ({
        returnValue: true,
        AutoSWUpdate: (res.settings.AutoSWUpdate == 'On')? true: false
    }))
};

export default GeneralService;
export {GeneralService};
