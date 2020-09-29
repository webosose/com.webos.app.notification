export function isValidSSID (ssid) {
	return (typeof ssid === 'string' && (ssid.length >= 1) && (ssid.length <= 32));
}

export function isValidPassKey (type, key) {
	let asciiPattern = new RegExp('^[\x00-\x7F]*$'),
		hexPattern = new RegExp('^[A-Fa-f0-9]*$');

	if (type === 'none') {
		return true;
	} else if (type === 'wep') {
		if ([5, 13].includes(key.length)) { // 40-bit or 104-bit ASCII
			return asciiPattern.test(key);
		} else if ([10, 26].includes(key.length)) { // 40-bit or 104-bit HEX
			return hexPattern.test(key);
		}
	} else if (['wpa-personal', 'psk'].includes(type)) {
		return (key.length >= 8 && key.length <= 63) ||
				(key.length === 64 && hexPattern.test(key));
	} else if (type === 'wapi-psk') {
		return ((hexPattern.test(key) && key.length > 0 && !(key.length % 2)) ||
			(8 <= key.length && 63 >= key.length));
	}
	return (type === 'none');
}

export const regExps = {
	ipv4: new RegExp('^([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])\\.([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])\\.([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])\\.([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])$'),
	subnetMask: new RegExp('^(((128|192|224|240|248|252|254)\\.0\\.0\\.0)|(255\\.(0|128|192|224|240|248|252|254)\\.0\\.0)|(255\\.255\\.(0|128|192|224|240|248|252|254)\\.0)|(255\\.255\\.255\\.(0|128|192|224|240|248|252|254|255)))$'),
	ipv6: new RegExp('^(([0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,7}:|([0-9a-fA-F]{1,4}:){1,6}:[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,5}(:[0-9a-fA-F]{1,4}){1,2}|([0-9a-fA-F]{1,4}:){1,4}(:[0-9a-fA-F]{1,4}){1,3}|([0-9a-fA-F]{1,4}:){1,3}(:[0-9a-fA-F]{1,4}){1,4}|([0-9a-fA-F]{1,4}:){1,2}(:[0-9a-fA-F]{1,4}){1,5}|[0-9a-fA-F]{1,4}:((:[0-9a-fA-F]{1,4}){1,6})|:((:[0-9a-fA-F]{1,4}){1,7}|:)|::(ffff(:0{1,4}){0,1}:){0,1}([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])\\.([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])\\.([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])\\.([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5]))$'),
	subnetPrefixLength: new RegExp('^([1-9]|[1-9][0-9]|1[0-1][0-9]|12[0-7])$')
};

export function getDNSs (info, mode) {
	let i, dns, dnss = [];
	const reg = regExps[mode];
	const maxCount = 16;
	if (reg) {
		for (i = 1; i <= maxCount; i++) {
			dns = info['dns' + i];
			if (reg.test(dns) === true) {
				dnss.push(dns);
			}
		}
	}

	return dnss;
}

export function getIpInformation (info, mode, supportIPv6) {
	let dnss = [];
	const ipInformation = {ipv6: false, method: '', ipAddress: '', subnet: '', gateway: '', dns: ''};

	if (!info) {
		return ipInformation;
	}

	if ((mode !== 'ipv4') && (mode !== 'ipv6')) {
		mode = (supportIPv6 && (info.ipv6)) ? 'ipv6' : 'ipv4';
	}

	if (mode === 'ipv6') {
		ipInformation.ipv6 = true;
		if (info.ipv6) {
			ipInformation.method = info.ipv6.method;
			ipInformation.ipAddress = info.ipv6.ipAddress;	// e.g. 'fd89:ae1e:9544:1:d82a:7c1d:f69b:4300'
			ipInformation.subnet = info.ipv6.prefixLength;
			ipInformation.gateway = info.ipv6.gateway;

			if (!Array.isArray(ipInformation.subnet) &&
					(ipInformation.subnet - parseFloat(ipInformation.subnet) + 1) >= 0) {
				ipInformation.subnet = ipInformation.subnet.toString();
			}
		}
	} else		/*	if(mode == "ipv4")*/ {
		ipInformation.ipv6 = false;
		ipInformation.method = info.method;
		ipInformation.ipAddress = info.ipAddress;
		ipInformation.subnet = info.netmask;
		ipInformation.gateway = info.gateway;
	}

	// find dns address
	ipInformation.dns = '';
	dnss = getDNSs(info, mode);
	if (dnss.length > 0) {
		ipInformation.dns = dnss[0];
	}

	if (ipInformation.method === 'auto')	{
		ipInformation.method = 'dhcp';	// ipv4 : 'dhcp' or 'manual', ipv6 : 'auto' or 'manual'
	}

	return ipInformation;
}
