import luna from './request';

const NetworkService = {
	getConnectionInfo: luna('com.webos.service.connectionmanager', 'getStatus'), // subscribable
	getMacAddress: luna('com.webos.service.connectionmanager', 'getinfo',
		res => ({wifi: res.wifiInfo, wired: res.wiredInfo})), // subscribable

	setWifiAdapter: ({enable = true, ...rest} = {}) => {
		return luna('com.webos.service.wifi', 'setstate', {
			state: enable ? 'enabled' : 'disabled'
		}, res => ({returnValue: res.returnValue}))(rest);
	},
	getWifiAdapter: luna('com.webos.service.wifi', 'getstatus'),
	getWifiNetworks: luna('com.webos.service.wifi', 'findnetworks', {},
		res => ({foundNetworks: res.foundNetworks.map(p => p.networkInfo)})), // subscribable
	// Supports one of:
	//    {'profileId':<number>}
	//    {'ssid':<string>,'security':<object>}
	//        Security object has various options; refer to docs.
	//        Eg: {'securityType':'psk','simpleSecurity':{'passKey':<string>}}
	connectWifi: luna('com.webos.service.wifi', 'connect'), // subscribable
	getWifiProfiles: luna('com.webos.service.wifi', 'getprofilelist', {},
		res => ({profileList: res.profileList.map(p => p.wifiProfile)})),
	// Supports: {'profileId':<number>}
	deleteWifiProfile: luna('com.webos.service.wifi', 'deleteprofile'),
	createWPSPIN: luna('com.webos.service.wifi', 'createwpspin', {},
		res => ({pin: res.wpspin})),
	// Supports: {'wpsPin':<number>}
	// Alternately, no pin needed for when PIN-based WPS is not being used.
	startWPS: luna('com.webos.service.wifi', 'startwps'),
	cancelWPS: luna('com.webos.service.wifi', 'cancelwps'),

	// Supports one of:
	//    {'method':'manual','address':'<string>','netmask':'<string>','gateway':'<string>','ssid':'<string>'}
	//    {'method':'dhcp','ssid':'<string>'}
	setIPv4: luna('com.webos.service.connectionmanager', 'setipv4'),
	// Supports one of:
	//    {'dns':['<string>', ...],'ssid':'<string>'}
	//    {'dns':[],'ssid':'<string>'}
	setDNS: luna('com.webos.service.connectionmanager', 'setdns')
};

export default NetworkService;
export {NetworkService};

