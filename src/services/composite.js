/* eslint-disable no-console, no-undefined */

import {forward} from '@enact/core/handle';

// import {findAdapterAddress} from './utils/bluetoothAddress';
import {canConnectDevice, isAudioDevice} from './utils/bluetoothProfiles';

class RequestProxy {
	constructor () {
		this._req = null;
		this.proxy = new Proxy({}, {
			get: (target, name) => {
				if (this._req) return this._req[name];
			},
			set: (target, name, value) => {
				if (this._req) this._req[name] = value;

				return value;
			}
		});
	}
	set req (value)  {
		this._req = value;
	}
	get req () {
		return this.proxy;
	}
}

function composite (Service, requests) {

	// `Service` will not be fully populated when passed so it should only be accessed *within* a
	// composite service method and not directly within this function.

	const getAdapter = ({subscribe, name, ...params}) => {
		if (!subscribe) {
			console.error('getAdapter requires subscription mode');
			return;
		}

		Service.cancelRequest('getBluetoothAdapter');
		requests.getBluetoothAdapter = Service.Bluetooth.getBluetoothAdapter({
			...params,
			subscribe: true,
			onSuccess: ({adapters = []}) => {
				const adapter = adapters.find(a => a.name === name);
				const address = adapter ? adapter.adapterAddress : '';
				const enabled = adapter ? adapter.powered : false;
				const discovering = adapter ? adapter.discovering : false;
				const discoverable = adapter ? adapter.discoverable : false;
				const pairing = adapter ? adapter.pairing : false;

				forward('onSuccess', {
					address,
					enabled,
					discovering,
					discoverable,
					pairing
				}, params);
			}
		});

		return {
			cancel: () => {
				Service.cancelRequest('getBluetoothAdapter');
			}
		};
	};

	const connectDevice = ({profile, ...params}) => {
		let req;
		if (isAudioDevice(profile.classOfDevice)) {
			req = requests.connectA2DP = Service.Bluetooth.connectA2DP({
				...params,
				address: profile.address
			});
		}

		return req;
	};

	const toggleAdapter = ({profiles, subscribe, ...params}) => {
		if (!subscribe) {
			console.error('toggleAdapter requires subscription mode');
			return;
		}

		const proxy = new RequestProxy();

		let onComplete = params.onComplete;
		let profile;

		proxy.req = requests.setBluetoothAdapter = Service.Bluetooth.setBluetoothAdapter({
			...params,
			onSuccess: () => {
				const enable = params.enable;

				// Find the paired device with the strongest signal
				profile = profiles
					.filter(canConnectDevice)
					.sort((a, b) => b.rssi - a.rssi)
					.shift();

				// we can't connect so bail out now
				if (!enable || !profile) {
					forward('onSuccess', {
						connected: false,
						enable,
						profile,
						request: 'endToggle',
						subscribed: false
					}, params);

					return;
				}

				forward('onSuccess', {
					connected: false,
					enable,
					profile,
					request: 'connect',
					subscribed: true
				}, params);

				// we don't want to call onComplete until the composite action completes
				// if we're trying to connect
				onComplete = null;

				// cache the event forwarder which is used in two places below
				const forwardSuccess = forward('onSuccess', {
					connected: true,
					enable,
					profile,
					request: 'endToggle',
					subscribed: false
				});

				proxy.req = connectDevice({
					profile,
					adapterAddress: params.adapterAddress,
					onFailure: (ev) => {
						const {code} = ev;
						if (code === 128 || code === 131) {
							// "Succeed" for trying to connect or already connected codes
							forwardSuccess(params);
						} else {
							ev.profile = profile;
							ev.request = 'connect';
							forward('onFailure', ev, params);
						}
					},
					onSuccess: () => {
						forwardSuccess(params);
					},
					onComplete: params.onComplete
				});
			},
			onFailure: (err) => {
				err.request = 'enable';
				forward('onFailure', err, params);
			},
			onComplete: () => {
				// Only forward onComplete if we didn't attempt to connect
				if (onComplete) onComplete();
			}
		});

		return proxy.req;
	};

	return {
		Bluetooth: {
			connectDevice,
			getAdapter,
			toggleAdapter
		}
	};
}

export default composite;
export {
	composite
};
