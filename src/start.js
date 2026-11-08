// var enablePWA = false;
// if(enablePWA) {
// 	// SERVICE WORKER
// 	if('serviceWorker' in navigator) {
// 		navigator.serviceWorker.register('./js/sw.js');
// 	}
// }

// Phaser 3.52 throws when a pointer is released outside the canvas (pointer.camera is unset), which leaves the drag state stuck
Phaser.Input.InputPlugin.prototype.sortGameObjects = function(gameObjects, pointer) {
	if(gameObjects.length < 2) { return gameObjects; }
	var renderList = (pointer.camera || this.cameras.main).renderList;
	return gameObjects.sort(function(a, b) { return renderList.indexOf(b) - renderList.indexOf(a); });
};

// An exception inside a frame would otherwise stop requestAnimationFrame for good and freeze the whole app
(function() {
	var step = Phaser.Core.TimeStep.prototype.step;
	Phaser.Core.TimeStep.prototype.step = function(time) {
		try { step.call(this, time); }
		catch(e) { console.error(e); }
	};
})();

var gameConfig = {
	scale: {
		mode: Phaser.Scale.FIT,
		autoCenter: Phaser.Scale.CENTER_BOTH,
		width: 640,
		height: 960
	},
	scene: [Boot, Preloader, MainMenu, Settings, Game]
}
game = new Phaser.Game(gameConfig);
window.focus();

// Usage tracking
window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', 'G-WCX5YHRP3N');