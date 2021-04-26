import luna from './request';

const BluetoothService = {
	setDeviceToSettingsService: ({address, name, displayId, ...rest}) => {
		let inputParam = {};
		inputParam[address] = name;

		let params = {
			category: 'Session' + displayId,
			settings: {
				BTDevices: inputParam
			}
		};
		return luna('com.webos.settingsservice', 'setSystemSettings', params)(rest);

	},
	getDevicesFromSettingsService: ({displayId, subscribe, ...rest}) => {
		let params = {
			category: 'Session' + displayId,
			key: 'BTDevices',
			subscribe: subscribe
		};
		return luna('com.webos.settingsservice', 'getSystemSettings', params)(rest);
	},
	setBluetoothAdapter: ({enable = true, ...rest} = {}) => {
		return luna('com.webos.service.bluetooth2', 'adapter/setState', {
			powered: enable
		})(rest);
	},
	queryAdapters: luna('com.webos.service.bluetooth2', 'adapter/queryAvailable'), // subscribable
	getBluetoothAdapter: luna('com.webos.service.bluetooth2', 'adapter/getStatus'), // subscribable
	getKnownBluetoothDevices: luna('com.webos.service.bluetooth2', 'device/getStatus'), // subscribable
	getRemoteVolume: luna('com.webos.service.bluetooth2', 'avrcp/getRemoteVolume'), // subscribable
	setAbsoluteVolume: luna('com.webos.service.bluetooth2', 'avrcp/setAbsoluteVolume'),
	cancelBluetoothDiscovery: luna('com.webos.service.bluetooth2', 'adapter/cancelDiscovery'),
	startBluetoothDiscovery: luna('com.webos.service.bluetooth2', 'adapter/startDiscovery'),
	pairBluetoothDevice: luna('com.webos.service.bluetooth2', 'adapter/pair'), // subscribable
	unpairBluetoothDevice: luna('com.webos.service.bluetooth2', 'adapter/unpair'),
	connectA2DP: luna('com.webos.service.bluetooth2', 'a2dp/connect'), // subscribable
	disconnectA2DP: luna('com.webos.service.bluetooth2', 'a2dp/disconnect'),
	connectHFP: luna('com.webos.service.bluetooth2', 'hfp/connect'), // subscribable
	disconnectHFP: luna('com.webos.service.bluetooth2', 'hfp/disconnect')
};

export default BluetoothService;
export {BluetoothService};
