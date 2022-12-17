'use strict';
const LINUX = 0;
const WINDOWS = 1;
const MAC = 2;
const ANDROID = 3;
const IPHONE = 4;
const IPAD = 5;
class AppX {
    constructor(appconfig) {
        this.appconfig = appconfig;
        this.games = [];
    }
    isFirstStartup = false;
    Setup() {
        document.title = appconfig.title;
        this.AppendMainCss(this.GetDevice());
        window.addEventListener("load", this.GetOrientation);
        window.addEventListener("resize", this.GetOrientation);
    }
    Start() {
        let htmlsetconfig = {
            nav: ['Игра'],
            navhref: ['index.html'],
        };
        switch (this.appconfig.apptype) {
            case 'htmlset': {
                var apptype = new HTMLSet(htmlsetconfig);
                apptype.BuildNav();
            }
                break;
            case 'cms': {
                console.log();
            }
                break;
            case 'canvas': {
                console.log();
            }
                break;
            case '3d': {
                console.log();
            }
                break;
            default: {
                console.log();
            }
                break;
        }
    }
    Stop() {

    }
    Restart() {

    }
    DefaultAppSetup() {

    }
    CookieProc() {
        if (this.isFirstStartup == false) {
            var expires = 60 * 60 * 24;
            setCookie('user', 'visitor', { expires });
        }
        else {
            getCookie('user');
        }
    }
    GetDevice() {
        let userstring = navigator.userAgent;
        let devicenumber = -1;
        if (userstring.indexOf("Linux") != -1) {
            devicenumber = LINUX;
        }
        if (userstring.indexOf("Windows") != -1) {
            devicenumber = WINDOWS;
        }
        if (userstring.indexOf("Macintosh") != -1) {
            devicenumber = MAC;
        }
        if (userstring.indexOf("Android") != -1) {
            devicenumber = ANDROID;
        }
        if (userstring.indexOf("iPhone") != -1) {
            devicenumber = IPHONE;
        }
        if (userstring.indexOf("iPad") != -1) {
            devicenumber = IPAD;
        }
        return devicenumber;
    }
    AppendMainCss(devicenumber) {
        switch (devicenumber) {
            case LINUX:
                loadCss(this.appconfig.linux);
                break;
            case WINDOWS:
                loadCss(this.appconfig.windows);
                break;
            case MAC:
                loadCss(this.appconfig.mac);
                break;
            case ANDROID:
                loadCss(this.appconfig.android);
                break;
            case IPHONE:
                loadCss(this.appconfig.iphone);
                break;
            case IPAD:
                loadCss(this.appconfig.ipad);
                break;
            default:
                loadCss(this.appconfig.default);
        }
    }
    GetOrientation() {
        let currentorientation = "";
        switch (window.orientation) {
            case 0:
                currentorientation = 'P';
                break;
            case -90:
                currentorientation = 'L';
                break;

            case 90:
                currentorientation = 'L';
                break;
            case 180:
                currentorientation = 'P';
                break;
        }
        return currentorientation;
    }
}

