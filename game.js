var config = {
    type: Phaser.AUTO,
    width: 1000,
    height: 600,
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
var bird;
var walls;
var coins;
var enemies;
var scoreText;
var score = 0;

function preload() {
    // This function will be executed at the beginning     
    // That's where we load the images and sounds
    this.load.image('bird', 'assets/bird.png');
    this.load.image('wall', 'assets/wall.png');
    this.load.image('coin', 'assets/coin.png');
    this.load.image('lava', 'assets/lava.png');
}

function create() {
    // This function is called after the preload function     
    // Here we set up the game, display sprites, etc.  

    // Variable to store the arrow keypresses + shift + space
    this.cursor = this.input.keyboard.createCursorKeys();


    // Create the player in the middle of the game
    bird = this.physics.add.sprite(75, 105, 'bird');
    bird.setCollideWorldBounds(true);
    bird.body.gravity.y = 600;

    //score 
    scoreText = this.add.text(16, 16, 'Score: 0', { fontSize: '32px', fill: '#000' });

    //Camera to follow player movements
    // camera = this.cameras.main;
    // camera.setDeadzone(700, 0);
    // camera.startFollow(bird);

    // Create 3 groups that will contain our objects
    walls = this.add.group();
    coins = this.add.group();
    lavas = this.add.group();

    //Colliders
    this.physics.add.collider(bird, walls);
    this.physics.add.overlap(bird, lavas, restartGame, null, this);
    this.physics.add.overlap(bird, coins, collectCoin, null, this);


    // Design the level. x = wall, o = coin, ! = lava.
    var level = [
        '                         ',
        '                         ',
        '                         ',
        '                         ',
        '   xxxxxxxxxxxxxxxxxxxxxx',
        '   x         !          x',
        '   x                 o  x',
        '   x         o          x',
        '   x                    x',
        '   x     o   !          x',
        '   xxxxxxxxxxxxxxxx     x',
        '                  x     x',
        '                  x     x',
        '                  x     x',
        '                  x     x',
        '                  x     x',
        '                  x     x',
        '                  xxxxxxx',
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
        bird.body.velocity.x = -200;
    }
    //right
    else if (this.cursor.right.isDown) {
        bird.body.velocity.x = 200;
    }
    //up
    else if (this.cursor.up.isDown) {
        bird.body.velocity.y = -250;
    }
    //stil
    else {
        bird.body.velocity.x = 0;
    }

    //--------------------------------------------------------------------------//

    //----------------//
    //    Logic       //
    //----------------//


}


function createLevel(level, scope) {
    // Create the level by going through the array
    for (var i = 0; i < level.length; i++) {
        for (var j = 0; j < level[i].length; j++) {

            // Create a wall and add it to the 'walls' group
            if (level[i][j] == 'x') {
                var wall = scope.physics.add.sprite(20 * j, 20 * i, 'wall');
                walls.add(wall);
                wall.body.immovable = true;
            }

            //Create a coin and add it to the 'coins' group
            else if (level[i][j] == 'o') {
                var coin = scope.physics.add.sprite(20 * j, 20 * i, 'coin');
                coins.add(coin);
            }

            //Create a lava and add it to the 'enemies' group
            else if (level[i][j] == '!') {
                var lava = scope.physics.add.sprite(30 * j, 30 * i, 'lava');
                lavas.add(lava);
                lava.body.immovable = true;
            }
        }
    }
}

function collectCoin(bird, coin) {
    coin.disableBody(true, true);
    score += 10;
    scoreText.setText('Score: ' + score);
}

function restartGame(bird, lava) {
    this.scene.restart();
}