'use strict';
const SCENE = 'mainscene';
class HTMLSet {
    constructor(htmlsetconfig) {
        this.htmlsetconfig = htmlsetconfig;
    }
    scenename;

    BuildNav() {
        let navul = CreateAnchoredUL(this.htmlsetconfig.nav, this.htmlsetconfig.navhref, 'navul');
        document.getElementsByTagName('nav')[0].appendChild(navul);
    }
}