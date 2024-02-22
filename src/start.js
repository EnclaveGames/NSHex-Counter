// var enablePWA = false;
// if(enablePWA) {
// 	// SERVICE WORKER
// 	if('serviceWorker' in navigator) {
// 		navigator.serviceWorker.register('./js/sw.js');
// 	}
// }

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