
appconfig = {
    title: 'EasyWar',
    apptype:'htmlset',
    screenMode: 'auto',
    linux: 'css/devices/linux.css',
    windows: 'css/devices/windows.css',
    mac: 'css/devices/mac.css',
    android: 'css/devices/android.css',
    iphone: 'css/devices/iphone.css',
    ipad: 'css/devices/ipad.css',
    default: 'css/devices/default.css'
};
var app = new AppX(appconfig);
app.Setup();