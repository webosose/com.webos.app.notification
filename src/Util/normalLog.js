const LogLevelInfo = 6;

function log (level, messageId, keyVals, freeText) {
	if (keyVals) {
		keyVals = JSON.stringify(keyVals);
	}

	if (typeof window === 'object' && window.PalmSystem.PmLogString) {
		window.PalmSystem.PmLogString(level, messageId, keyVals, freeText.toString());
	}
}

export default function normalLog () {
	const messageId = arguments[0];
	const keyVals = arguments[1];
	const freeText = '';

	if (typeof window === 'object' && window.PalmSystem) {
		log(LogLevelInfo, messageId, keyVals, freeText);
	}
	/* istanbul ignore if */
	if (process.env.NODE_ENV === 'development') {
		// eslint-disable-next-line no-console
		console.log(LogLevelInfo, messageId, keyVals, freeText);
	}
}
