(function () {
    /* globals Phaser:false, BasicGame:false */
    //  Create your Phaser game and inject it into the game div.
    //  We did it in a window.onload event, but you can do it anywhere (requireJS load, anonymous function, jQuery dom ready, - whatever floats your boat)
    //  We're using a game size of 480 x 640 here, but you can use whatever you feel makes sense for your game of course.
    var game = new Phaser.Game(640, 480, Phaser.AUTO, 'game');
    game.userVolume = 1;
    //  Add the States your game has.
    //  You don't have to do this in the html, it could be done in your Game state too, but for simplicity I'll keep it here.
    game.state.add('Menu', BasicGame.Menu);
    game.state.add('Game', BasicGame.Game);
    game.state.add('EndGame', BasicGame.EndGame);
    //  Now start the Game state.
    game.state.start('Menu');
})();