let app = new PIXI.Application({ resizeTo: window, background: "black", antialias: true });
window.app = app;
const gamemanager = new GameManager();
function onLoad() {
   
    AddClickFunction(document.getElementById('status'),Setup);
}
function Setup() {
    gamemanager.Setup();
}