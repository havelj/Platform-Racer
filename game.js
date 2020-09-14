//----------------//
//    Constants   //
//----------------//

//board dimensions
const BOARD_WIDTH = 1000;
const BOARD_HEIGHT = 600;
const BUFFER_WIDTH = (BOARD_WIDTH / 2) / 2;     //centers our level on screen
const BUFFER_HEIGHT = (BOARD_HEIGHT / 2) / 2;   //centers our level on screen
//Sprites
const SPRITES_WIDTH = 20;
const SPRITES_HEIGHT = 20;
//bird starting coordinates
const PLAYER_X = BUFFER_WIDTH + SPRITES_WIDTH;
const PLAYER_Y = BUFFER_HEIGHT + SPRITES_HEIGHT;

var config = {
    type: Phaser.AUTO,
    width: BOARD_WIDTH,
    height: BOARD_HEIGHT,
    backgroundColor: '#56CBF9',
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 0 },
            debug: false
        }
    },
    scene: {
        preload: preload,
        create: create,
        update: update,
    }
};

var game = new Phaser.Game(config);

//Sprites
var player;
var walls;
var coins;
var lavas;
var coinsPerLevel = -1;
var myCoinCount = 0;

//Display
var scoreText;
var score = 0;

function preload() {
    // This function will be executed at the beginning     
    // That's where we load the images and sounds
    this.load.image('player', 'assets/bird.png');
    this.load.image('wall', 'assets/wall.png');
    this.load.image('coin', 'assets/coin.png');
    this.load.image('lava', 'assets/lava.png');
}

function create() {
    // This function is called after the preload function     
    // Here we set up the game, display sprites, etc.  

    // Variable to store the arrow keypresses + shift + space
    this.cursor = this.input.keyboard.createCursorKeys();


    // Creates the player inside the level's boundaries
    player = this.physics.add.sprite(PLAYER_X, PLAYER_Y, 'player');
    player.setCollideWorldBounds(true);
    player.body.gravity.y = 600;

    //score 
    scoreText = this.add.text(16, 16, 'Score: 0', { fontSize: '32px', fill: '#000' });

    //Camera to follow player movements
    // camera = this.cameras.main;
    // camera.setDeadzone(700, 0);
    // camera.startFollow(player);

    // Create 3 groups that will contain our objects
    walls = this.add.group();
    coins = this.add.group();
    lavas = this.add.group();

    //Colliders
    this.physics.add.collider(player, walls);
    this.physics.add.overlap(player, lavas, restartGame, null, this);
    this.physics.add.overlap(player, coins, collectCoin, null, this);


    // Design the level. x = wall, o = coin, ! = lava.
    var level = [
        'xxxxxxxxxxxxxxxxxxxxxx',
        'x         !          x',
        'x                    x',
        'x         o          x',
        'x                o   x',
        'x     o   !          x',
        'xxxxxxxxxxxxxxxx     x',
        '               x     x',
        '               x     x',
        '               x     x',
        '               x     x',
        '               x     x',
        '               x     x',
        '               xxxxxxx',
    ];
    createLevel(level, this);

}

function update() {
    // This function is called 60 times per second    
    // It contains the game's logic   

    //----------------//
    //    Controls    //
    //----------------//

    //left
    if (this.cursor.left.isDown) {
        player.body.velocity.x = -200;
    }
    //right
    else if (this.cursor.right.isDown) {
        player.body.velocity.x = 200;
    }
    //up
    else if (this.cursor.up.isDown && player.body.touching.down) {
        player.body.velocity.y = -200;
    }
    //up - left
    else if (this.cursor.up.isDown && this.cursor.left.isDown) {
        player.body.velocity.y = -200;
    }
    //up - right
    else if (this.cursor.up.isDown && this.cursor.right.isDown) {
        player.body.velocity.y = -200;
    }
    //stil
    else {
        player.body.velocity.x = 0;
    }

    //--------------------------------------------------------------------------//

    //----------------//
    //    Logic       //
    //----------------//
    if (coinsPerLevel == myCoinCount) {
        this.scene.restart();
        console.log("Game has restarted");
        document.querySelector("#lastScore").innerHTML += score + ". Player won!<br>";
        myCoinCount = 0;
        coinsPerLevel = -1;
        score = 0;
    }

}


function createLevel(level, scope) {
    // Create the level by going through the array
    for (var i = 0; i < level.length; i++) {
        for (var j = 0; j < level[i].length; j++) {

            // Create a wall and add it to the 'walls' group
            if (level[i][j] == 'x') {
                var wall = scope.physics.add.sprite((SPRITES_WIDTH * j) + BUFFER_WIDTH, (SPRITES_HEIGHT * i) + BUFFER_HEIGHT, 'wall');
                walls.add(wall);
                wall.body.immovable = true;
            }

            //Create a coin and add it to the 'coins' group
            else if (level[i][j] == 'o') {
                var coin = scope.physics.add.sprite((SPRITES_WIDTH * j) + BUFFER_WIDTH, (SPRITES_HEIGHT * i) + BUFFER_HEIGHT, 'coin');
                coins.add(coin);
                if (coinsPerLevel != -1) {
                    coinsPerLevel += 1;
                }
                else {
                    coinsPerLevel += 2;
                }
            }

            //Create a lava and add it to the 'lavas' group
            else if (level[i][j] == '!') {
                var lava = scope.physics.add.sprite((SPRITES_WIDTH * j) + BUFFER_WIDTH, (SPRITES_HEIGHT * i) + BUFFER_HEIGHT, 'lava');
                lavas.add(lava);
                lava.body.immovable = true;
            }
        }
    }
}

function collectCoin(player, coin) {
    coin.disableBody(true, true);
    score += 10;
    scoreText.setText('Score: ' + score);
    myCoinCount++;
}

function restartGame(player, lava) {
    this.scene.restart();
    console.log("Game has restarted");
    document.querySelector("#lastScore").innerHTML += score + ". Player died by lava.<br>";
    myCoinCount = 0;
    coinsPerLevel = -1;
    score = 0;
}