# Notification Application for webOS Auto
Provides system notifications to the user

This app is based on the EnactJS theme [Agate](https://github.com/enactjs/agate) and requires the [Enact CLI](https://github.com/enactjs/cli) tool to be installed, along with NodeJS and NPM.

## Installation
Generally, the app should be easy to run, once the related repos are cloned and linked.
The process should be as follows:

* Install enact/cli globally: `npm install -g @enact/cli`
* Clone Agate: `git clone https://github.com/enactjs/agate.git`
 * Switch to the new agate directory: `cd agate`
 * Link it: `npm link`
 * Return to the previous directory: `cd ..`
* Clone this repo `https://github.com/enyojs/webos-auto-notification.git`
 * Switch to the new "webos-auto-notification" directory: `cd webos-auto-notification`
 * Install Home: `npm install`
 * Link Agate: `npm link @enact/agate`
* Serve the app: `npm run serve`
