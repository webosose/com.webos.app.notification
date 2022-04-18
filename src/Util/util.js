export default function checkPopupStatus(app) {
    const popupTypes = ['notification', 'alertInfo'];
    const closeApp = popupTypes.every(v => {
        return Object.keys(app[v]).length === 0;
    });
    if (closeApp) {
        window.close();
    }
}
