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
var head = document.getElementsByTagName('head')[0];
var script = document.createElement('script');
script.type = 'text/javascript';
script.onload = function() {
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'UA-17874504-3');
}
script.src = 'https://www.googletagmanager.com/gtag/js?id=UA-17874504-3';
head.appendChild(script);