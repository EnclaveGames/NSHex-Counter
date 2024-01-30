class Boot extends Phaser.Scene {
    constructor() {
        super('Boot');
    }
    preload() {
        this.load.image('loading-background', 'img/loading-background.png');
        this.load.image('background-black', 'img/background-black.png');
        this.load.spritesheet('logo-counter', 'img/logo-counter.png', {frameWidth:446,frameHeight:123});
        this.load.spritesheet('logo-enclave', 'img/logo-enclave.png', {frameWidth:253,frameHeight:89});

        WebFont.load({ custom: { families: ['montserratbold'], urls: ['fonts/montserrat-bold.css'] } });
    }
    create() {
        EPT.world = {
            width: this.cameras.main.width,
            height: this.cameras.main.height,
            centerX: this.cameras.main.centerX,
            centerY: this.cameras.main.centerY
        };
        EPT.Lang.updateLanguage();
        EPT.text = EPT.Lang.text[EPT.Lang.current];
        EPT._player = [];
        EPT._armies = [
            'moloch','borgo','outpost','hegemony','newyork','neojungle',
            'smart','vegas','steelpolice','dancer','sharrash','mephisto',
            'doomsday','mississippi','uranopolis','deathbreath','irongang','sandrunners',
            'troglodytes', 'beasts', 'pirates', 'merchantsguild', 'partisans'
        ];
        EPT._armyCounts = [22, 13, 15, 18, 20, 17, 16, 15, 18, 4, 17, 17, 16, 17, 20, 15, 9, 16, 12, 15, 16, 19, 16];
        EPT._tileCounts = [
            [4, 1, 5, 1, 2, 2, 1, 1, 1, 2, 1, 2, 1, 1, 1, 1, 1, 1, 1, 1, 2, 1], // moloch
            [6, 4, 1, 6, 4, 2, 1, 2, 2, 1, 2, 1, 2], // borgo
            [6, 7, 1, 2, 1, 5, 2, 1, 1, 1, 1, 2, 1, 1, 2], // outpost
            [5, 3, 2, 1, 3, 1, 4, 1, 2, 1, 1, 3, 1, 1, 2, 1, 1, 1], // hegemony
            [5, 2, 1, 1, 1, 2, 1, 2, 1, 2, 2, 2, 1, 1, 1, 1, 2, 2, 2, 2], // newyork
            [4, 2, 1, 1, 1, 4, 2, 3, 1, 3, 2, 1, 3, 1, 1, 2, 2], // neojungle
            [4, 3, 1, 1, 2, 1, 1, 2, 3, 2, 2, 3, 1, 4, 2, 2], // smart
            [5, 3, 3, 2, 3, 1, 2, 2, 2, 2, 3, 1, 1, 2, 2], // vegas
            [5, 1, 1, 1, 1, 2, 1, 1, 2, 3, 2, 1, 3, 3, 2, 2, 2, 1], // steelpolice
            [7, 8, 7, 10], // dancer
            [5, 2, 1, 2, 1, 3, 3, 3, 4, 1, 1, 1, 2, 1, 2, 1, 1], // sharrash
            [2, 3, 2, 3, 1, 2, 2, 1, 1, 2, 2, 1, 2, 2, 1, 4, 3], // mephisto
            [4, 1, 1, 2, 2, 1, 2, 1, 4, 2, 2, 1, 5, 2, 2, 2], // doomsday
            [4, 1, 1, 1, 3, 2, 3, 2, 4, 1, 1, 2, 2, 2, 1, 3, 1], // mississippi
            [1, 4, 3, 1, 2, 3, 4, 1, 2, 1, 1, 1, 1, 1, 2, 1, 1, 1, 2, 1], // uranopolis
            [1, 2, 3, 8, 3, 3, 1, 2, 1, 1, 1, 1, 2, 2, 3], // deathbreath
            [2, 9, 3, 3, 5, 3, 4, 4, 1], // irongang
            [3, 5, 2, 1, 3, 2, 3, 1, 1, 2, 2, 2, 2, 1, 2, 2], // sandrunners
            [7, 3, 1, 1, 2, 2, 4, 5, 3, 2, 2, 2], // troglodytes
            [2, 6, 1, 3, 1, 2, 4, 2, 2, 2, 2, 1, 3, 2, 1], // beasts
            [5, 3, 1, 2, 1, 2, 2, 3, 3, 1, 1, 2, 2, 3, 2, 1], // pirates
            [1, 1, 5, 2, 1, 1, 3, 2, 2, 1, 2, 1, 1, 2, 1, 1, 1, 2, 4], // merchants guild
            [1, 4, 3, 5, 1, 2, 2, 1, 4, 3, 2, 1, 1, 2, 1, 1] // partisans
        ];
        this.scene.start('Preloader');
    }
}