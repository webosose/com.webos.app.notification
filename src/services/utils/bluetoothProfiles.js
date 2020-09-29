const PROFILES = [
	// https://www.bluetooth.com/specifications/profiles-overview/
	'3dsp',	 // 3D Synchronization Profile	1.0.3	Active	15 Dec 2015	N/A
	'a2dp',  // Advanced Audio Distribution Profile	1.3.2	Active	21 Jan 2019	A2DP_1.3.2_showing_changes_from_A2DP_1.3.1
	'avrcp', // A/V Remote Control Profile	1.6.2	Active	21 Jan 2019	AVRCP_1.6.2_showing_changes_from_AVRCP_1.6.1
	'bip',   // Basic Imaging Profile	1.2.1	Active	21 Jan 2019	BIP_1.2.1_showing_changes_from_BIP_1.2.0
	'bpp',   // Basic Printing Profile	1.2	Active	27 Apr 2006	N/A
	'ctn',   // Calendar Tasks and Notes Profiles	1.0.1	Active	21 Jan 2019	CTN_1.0.1_showing_changes_from_CTN_1.0.0
	'di',    // Device ID Profile	1.3	Active	26 Mar 2007	N/A
	'dun',   // Dial-Up Networking Profile	1.2	Active	06 Nov 2012	N/A
	'ftp',   // File Transfer Profile	1.3.1	Active	15 Dec 2015	N/A
	'gavdp', // Generic A/V Distribution Profile	1.3	Active	24 Jul 2012	N/A
	'gnss',  // Global Navigation Satellite System Profile	1.0	Active	13 Mar 2012	N/A
	'goep',  // Generic Object Exchange Profile	2.1.1	Active	15 Dec 2015	N/A
	'gpp',   // Generic PIM Profile	1.0.1	Active	15 Dec 2015	N/A
	'hcrp',  // Hardcopy Cable Replacement Profile	1.2	Active	27 Apr 2006	N/A
	'hdp',   // Health Device Profile	1.1	Active	24 Jul 2012	N/A
	'hfp',   // Hands-Free Profile	1.7.2	Active	21 Jan 2019	HFP_1.7.2_showing_changes_from_HFP_1.7.1
	'hid',   // Human Interface Device Profile	1.1.1	Active	15 Dec 2015	N/A
	'hsp',   // Headset Profile	1.2	Active	18 Dec 2008	N/A
	'map',   // Message Access Profile	1.4.2	Active	13 Aug 2019	MAP_1.4.2_showing_changes_from_MAP_1.4.1
	'mps',   // Multi Profile Specification	1.0	Active	02 Jul 2013	N/A
	'opp',   // Object Push Profile	1.2.1	Active	15 Dec 2015	N/A
	'pan',   // Personal Area Networking Profile	1.0	Active	20 Feb 2003	N/A
	'pbap',  // Phone Book Access Profile	1.2.3	Active	21 Jan 2019	PBAP_1.2.3_showing_changes_from_PBAP_1.2.1
	'sap',   // SIM Access Profile	1.1.1	Active	15 Dec 2015	N/A
	'spp',   // Serial Port Profile	1.2	Active	24 Jul 2012	N/A
	'synch', // Synchronization Profile	1.2.1	Active	15 Dec 2015	N/A
	'vdp',   // Video Distribution Profile	1.1	Active	24 Jul 2012	N/A

	// https://www.bluetooth.com/specifications/gatt/
	'gatt'   // Generic BLE profile
];

const PROFILE_ICONS = {
	a2dp: 'speaker',
	hsp: 'earphone',
	hid: 'bluetooth',
	vdp: 'rearscreen',
	pbap: 'mobile'
};

// https://www.bluetooth.com/specifications/assigned-numbers/baseband/
const DEVICE_CLASSES = {
	// Major Service Classes
	POSITIONING: 65536,
	NETWORKING: 131072,
	RENDERING: 262144,
	CAPTURING: 524288,
	OBJECT_TRANSFER: 1048576,
	AUDIO: 2097152,
	TELEPHONY: 4194304,
	INFORMATION: 8388608,

	// Major Device Classes
	MINOR: 2048 + 1024 + 512 + 256,
	COMPUTER: 256,
	PHONE: 512,
	LAN: 512 + 256,
	AUDIO_VIDEO: 1024,
	PERIPHERAL: 1024 + 256,
	IMAGING: 1024 + 512,
	TOY: 2048,
	HEALTH: 2048 + 256
};

const matchClass = (a, b) => (a ^ b) === 0;

const isMinorDevice = (deviceClass, minorClasses) => {
	const minor = deviceClass & DEVICE_CLASSES.MINOR;

	if (Array.isArray(minorClasses)) {
		return minorClasses.findIndex(c => matchClass(minor, c)) !== -1;
	}

	return matchClass(minor, minorClasses);
};

const isAudioDevice = (deviceClass) => {
	return isMinorDevice(deviceClass, DEVICE_CLASSES.AUDIO_VIDEO);
};

const getProfileIcon = (profile) => PROFILE_ICONS[profile];

const canConnectDevice = (profile) => {
	// This centralizes all checks for if we support connecting to a bluetooth device
	return profile && profile.paired && isAudioDevice(profile.classOfDevice);
};

export {
	DEVICE_CLASSES,
	PROFILES,
	canConnectDevice,
	getProfileIcon,
	isAudioDevice
};
