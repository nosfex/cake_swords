//---------------------------------------------------------------------------------------
// GH: Mold programming
//---------------------------------------------------------------------------------------
var BaseMold = 
{
    
};

BaseMold.Sword = function(game, sprite)
{
    Phaser.Sprite.call(this, game, 0, 0, sprite );
    this.type = 'Sword';
    this.selected = false;
};

BaseMold.Sword.prototype = Object.create(Phaser.Sprite.prototype);
BaseMold.Sword.prototype.constructor = BaseMold.Sword;

BaseMold.Axe = function(game, sprite)
{
    Phaser.Sprite.call(this, game, 0, 0, sprite );
    this.type = 'Axe';
    this.selected = false;
};

BaseMold.Axe.prototype = Object.create(Phaser.Sprite.prototype);
BaseMold.Axe.prototype.constructor = BaseMold.Axe;

BaseMold.Sabre = function(game, sprite)
{
    Phaser.Sprite.call(this, game, 0, 0, sprite );
    this.type = 'Sabre';
    this.selected = false;
};

BaseMold.Sabre.prototype = Object.create(Phaser.Sprite.prototype);
BaseMold.Sabre.prototype.constructor = BaseMold.Sabre;
/*
var Heater = {};

Heater.MoldGroup = function(game)
{
    Phaser.Group.call(this, game, game.world, 'Heater', false, true, Phaser.Physics.ARCADE);
    
    this.game = game;
    this.add(new BaseMold.Sword(game, 'sword_mold'), true);
    this.add(new BaseMold.Axe(game, 'axe_mold'), true);
    this.add(new BaseMold.Sabre(game, 'axe_mold_b'), true);
    
    this.childrenPositionY = [ game.world.height * 0, game.world.height * 0.25, game.world.height * 0.5];
    
    for(var i = 0; i < 3; i++)
    {
        this.getChildAt(i).position.y = this.childrenPositionY[i];
        this.setTweens(this.getChildAt(i), i);
    }
    
    // GH: Swipe controls
    this.swipe = new Swipe(this.game);
    this.selectedType = this.getChildAt(1).type;
    return this;
};

Heater.MoldGroup.prototype = Object.create(Phaser.Group.prototype);
Heater.MoldGroup.prototype.constructor = Heater.MoldGroup;

Heater.MoldGroup.prototype.update = function()
{
    var direction = this.swipe.check();
    if(direction !== null)
    {
        switch(direction.direction)
        {
            case this.swipe.DIRECTION_UP:           
                this.changeSelection(1);
                break;
            case this.swipe.DIRECTION_DOWN:
                this.changeSelection(-1);
                break;
        }
    }
    
    var i = this.children.length;

    while (i--)
    {
        this.children[i].update();
    }
};

Heater.MoldGroup.prototype.setTweens = function(child, newPosY)
{
    var tween = this.game.add.tween(child.position);
    var tweenScale = this.game.add.tween(child.scale);
    var upscale = 1;
    if(newPosY == 1)
    {
        upscale = 1.4;
    }
    else this.moveDown(child);
    
    tweenScale.to({x:upscale, y:upscale}, 100, Phaser.Easing.Linear.None);
    tweenScale.start();

    tween.to({x:0 , y:this.childrenPositionY[ newPosY] }, 100, Phaser.Easing.Linear.None);
    tween.start();
    
    //this.customSort(function(a,b){ if(a.scale < b.scale)return-1; else { return 1;}}, this);
};

Heater.MoldGroup.prototype.changeSelection = function (direction)
{
    var i = 0;
    var j = 0;
    if(direction == 1)
    {
        //this.getChildAt(0).position.y = this.childrenPositionY[2];
        i = 0;
        j = 0;
        for(i = 0; i < this.children.length; i++)
        {
            for(j = 0; j < this.childrenPositionY.length; j++)
            {
                if(this.getChildAt(i).position.y == this.childrenPositionY[j])
                {
                    
                    var newPos = j - direction;
                    if (newPos < 0 )
                    {
                        newPos = this.childrenPositionY.length - 1;
                    }
                    this.setTweens(this.getChildAt(i),newPos);
                    
                    break;
                }
            }
        }
    }
    else
    {
        i = 0;
        j = this.childrenPositionY.length - 1;
        for(i = 0; i < this.children.length; i++)
        {
            for(j = this.childrenPositionY.length - 1; j >= 0; j--)
            {
                if(this.getChildAt(i).position.y == this.childrenPositionY[j])
                {
                    
                    var newPos = j + 1;
                    if (newPos > this.childrenPositionY.length - 1)
                    {
                        newPos = 0;
                    }
                    this.setTweens(this.getChildAt(i),newPos);
                    break;
                }
            }
        }    
        
    }
    i = 0;
    for(i = 0; i < this.children.length; i++)
    {
        if(this.getChildAt(i).position.y == this.childrenPositionY[1])
        {
            this.selectedType = this.getChildAt(i).type;
            break;
        }
    }
};*/
//---------------------------------------------------------------------------------------

//---------------------------------------------------------------------------------------
// GH: Dough programming
//---------------------------------------------------------------------------------------

var Selector = {};

Selector.DoughSelector = function(game) 
{
    Phaser.Group.call(this, game, game.world, 'DoughSelector', false, true, Phaser.Physics.ARCADE);
    this.game = game;
    var i = 0;
    
    var bkg = game.make.sprite(game.world.width * 0.4, game.world.height * 0.1 , 'dough_container');
    this.add(bkg, true);
    for(i = 0 ; i < game.inventory.doughs.length ; i++)
    {
        var xy = {x:game.world.width * 0.4, y:game.world.height * 0.1 + (60 * i)};
        console.log("xy: " + xy.x + " " + xy.y);
        var d = new BaseDough.Dough(game, xy, 'dough_test', game.inventory.doughs[i]);
        console.log(d.type + " " + game.inventory.doughs[i] );
        this.add(d, true);
        this.add(game.make.button(xy.x, xy.y, 'dough_test', function() { this.game.useType(this.type);}, d, 0, 1, 2,3));
    }
    return this;
};

Selector.DoughSelector.prototype = Object.create(Phaser.Group.prototype);
Selector.DoughSelector.prototype.constructor = Selector.DoughSelector;


var BaseDough = 
{
    
};


BaseDough.Dough = function(game, xy, sprite, type)
{
    Phaser.Sprite.call(this, game, xy.x, xy.y, 'circle_container');
    
    this.game = game;
    this.type = type;
    this.text = game.make.text(0, 0, 'x1');
    this.addChild(this.text);
};

BaseDough.Dough.prototype = Object.create(Phaser.Sprite.prototype);
BaseDough.Dough.prototype.constructor = BaseDough.Dough;

var GameScreen = {};

GameScreen.BattleScreen = function(game)
{
    Phaser.Group.call(this, game, game.world, 'BattleScreen', false, true, Phaser.Physics.ARCADE);
    
    this.add(game.make.sprite(0, game.world.height * 0.0151, 'battle_screen_bkg'));
};

GameScreen.BattleScreen.prototype = Object.create(Phaser.Group.prototype);
GameScreen.BattleScreen.constructor = GameScreen.BattleScreen;


GameScreen.GrillScreen = function(game)
{
    Phaser.Group.call(this, game, game.world, 'GrillScreen', false, true, Phaser.Physics.ARCADE);
    
    var bkg = game.make.sprite(0, game.world.height * 0.43, 'grill_screen_bkg');
    this.add(bkg);
    this.bkg = bkg; 
    bkg.anchor.y = 1;
    this.enabled = false;
    
    this.dough = [ game.make.sprite(game.world.centerX * 0.75, game.world.height * 0.23, 'dough_grill'), game.make.sprite(game.world.centerX * 0.75, game.world.height * 0.23, 'dough_grill'), game.make.sprite(game.world.centerX * 0.75, game.world.height * 0.23, 'dough_grill')];
    var i = 0;
    for(i = 0; i < this.dough.length ; i++)
    {
        this.add(this.dough[i]);
        this.dough[i].scale.setTo(0, 0);
        this.dough[i].anchor.setTo(0.5, 0.5);    
    }
    
    this.swordMold = game.make.sprite(0,  game.world.height * 0.0151, 'sword_mold');
    this.add(this.swordMold);
    
    this.axeMoldA = game.make.sprite(0,  game.world.height * 0.0151, 'axe_mold');
    this.add(this.axeMoldA);
    
    this.axeMoldB = game.make.sprite(0,  game.world.height * 0.0151, 'axe_mold_b');
    this.add(this.axeMoldB);
    
    this.swordMold.visible = false;
    this.axeMoldA.visible = false;
    this.axeMoldB.visible = false;
    
    this.game = game;
};



GameScreen.GrillScreen.prototype = Object.create(Phaser.Group.prototype);
GameScreen.GrillScreen.constructor = GameScreen.GrillScreen;

GameScreen.GrillScreen.prototype.fillMold = function(type)
{
    
        console.log(type);
    
        var i = this.game.grillPick;
        this.dough[i].visible = true;
        this.game.add.tween(  this.dough[i].scale).to({x:1, y:1}, 500, Phaser.Easing.Linear.None).start();
    
};

GameScreen.GrillScreen.prototype.checkDoughs = function()
{
    var i = 0; 
    for (i = 0 ; i < this.dough.length; i++)
    {
        this.dough[i].visible = false;
    }
    if(this.game.grillPick >= 0)
        this.dough[this.game.grillPick].visible = true;
};

GameScreen.GrillScreen.prototype.initWithMold = function(moldType)
{
    // GH: Select the proper mold ???
    
    this.swordMold.visible = false;
    this.axeMoldA.visible = false;
    this.axeMoldB.visible = false;
    console.log("MOOOOLD: " + moldType);
    switch(moldType)
    {
        case 0:
            this.swordMold.visible = true;
             console.log("swooord");
        break;
            
        case 1:
            this.axeMoldA.visible = true;
            console.log("AXEEEEE");
        break;
        
        case 2:
            this.axeMoldB.visible = true;
            console.log("AXEEEE_B");
        break;
            
    }
};

GameScreen.GameScreen = function(game)
{
    Phaser.Group.call(this, game, game.world, 'GameScreen', false, true, Phaser.Physics.ARCADE);
    this.game = game;
    
    // GH: Screens group
    this.grillScreen    = new GameScreen.GrillScreen(game);
    this.battleScreen   = new GameScreen.BattleScreen(game);
    
    // GH: Screens bkg
    this.add(this.battleScreen);
    this.add(this.grillScreen);
    
    this.game.add.tween(this.grillScreen.bkg.scale).to({x:1, y:0}, 100, Phaser.Easing.Linear.None).start();
    
    this.pendingScreen = "";
};

GameScreen.GameScreen.prototype = Object.create(Phaser.Group.prototype);
GameScreen.GameScreen.constructor = GameScreen.GameScreen;

GameScreen.GameScreen.prototype.swapScreen = function(toScreen)
{
    
    if(this.pendingScreen !== "")
        return;
    this.pendingScreen = toScreen;
    var tween = this.game.add.tween(this.grillScreen.bkg.scale);
    tween.to({x:1, y:0}, 100, Phaser.Easing.Linear.None);
    tween.onComplete.add(this.onExitFinished, this);
    tween.start();
  
};

GameScreen.GameScreen.prototype.checkDoughs = function()
{
    this.grillScreen.checkDoughs();
    
}


GameScreen.GameScreen.prototype.onExitFinished = function()
{
    if(this.pendingScreen == "battle")
    {
        this.grillScreen.enabled = false;
        this.game.add.tween(this.grillScreen.bkg.scale).to({x:1, y:0}, 100, Phaser.Easing.Linear.None).start();
        this.grillScreen.initWithMold("");
        
        this.game.grillPick = -1;
        this.grillScreen.checkDoughs();
    }   
    else
    {
        this.game.add.tween(this.grillScreen.bkg.scale).to({x:1, y:1}, 100, Phaser.Easing.Linear.None).start();
        this.grillScreen.enabled = true;
        this.grillScreen.initWithMold(this.pendingScreen);
    }
    
    this.pendingScreen = "";
};

GameScreen.GameScreen.prototype.fillWithDough = function(type)
{
    this.grillScreen.fillMold(type);
};

//---------------------------------------------------------------------------------------
//  GH: Inventory
//---------------------------------------------------------------------------------------

var Inventory = {};
Inventory = function(game)
{
    this.game = game;
    this.doughs = ["Barro", "Caramelo", "Legamo", "Grumosa", "Ancestral"];
    
};

Inventory.prototype = {
    useType: function(type)
    {
        
    }
    
};
Inventory.prototype.constructor = Inventory;


//---------------------------------------------------------------------------------------
//  GH: Game menus & flow
//---------------------------------------------------------------------------------------

// create BasicGame Class
var BasicGame = {

};


BasicGame.Game = function(game)
{
    this.game = game;
};

BasicGame.Game.prototype = {

    init: function () 
    {
        // set up input max pointers
        this.input.maxPointers = 1;
        // set up stage disable visibility change
        this.stage.disableVisibilityChange = true;
        // Set up the scaling method used by the ScaleManager
        // Valid values for scaleMode are:
        // * EXACT_FIT
        // * NO_SCALE
        // * SHOW_ALL
        // * RESIZE
        // See http://docs.phaser.io/Phaser.ScaleManager.html for full document
        this.scale.scaleMode = Phaser.ScaleManager.EXACT_FIT;
        // If you wish to align your game in the middle of the page then you can
        // set this value to true. It will place a re-calculated margin-left
        // pixel value onto the canvas element which is updated on orientation /
        // resizing events. It doesn't care about any other DOM element that may
        // be on the page, it literally just sets the margin.
        this.scale.pageAlignHorizontally = true;
        this.scale.pageAlignVertically = true;
        // Force the orientation in landscape or portrait.
        // * Set first to true to force landscape. 
        // * Set second to true to force portrait.
        this.scale.forceOrientation(true, false);
        // Sets the callback that will be called when the window resize event
        // occurs, or if set the parent container changes dimensions. Use this 
        // to handle responsive game layout options. Note that the callback will
        // only be called if the ScaleManager.scaleMode is set to RESIZE.
        this.scale.setResizeCallback(this.gameResized, this);
        // Set screen size automatically based on the scaleMode. This is only
        // needed if ScaleMode is not set to RESIZE.
        this.scale.updateLayout(true);
        // Re-calculate scale mode and update screen size. This only applies if
        // ScaleMode is not set to RESIZE.
        this.scale.refresh();
    },

    preload: function () 
    {
        this.load.spritesheet('button', 'assets/button_sprite_sheet_crapped.png', 193, 71);
        this.load.json('gamedata', 'assets/gamedata.json');
        
        // GH: Grill mold
        this.load.image('sword_mold', 'assets/espada_molde.png');
        this.load.image('axe_mold', 'assets/hacha_molde.png');
        this.load.image('axe_mold_b', 'assets/hacha_molde_b.png');
        
        // GH: Grill dough
        this.load.image('dough_grill', 'assets/circle_dough.png');
        
        // GH: Selector
        this.load.image('circle_container', 'assets/circle_container.png');
        this.load.image('dough_container', 'assets/dough_container.png');
        this.load.spritesheet('dough_test', 'assets/masa_1.png', 64,64);
        
        // GH: Grills
        this.load.image('grill', 'assets/grill.png');
        
        // GH: Screens
        this.load.image('battle_screen_bkg', 'assets/battle_screen.png');
        this.load.image('grill_screen_bkg', 'assets/grill_screen.png');
        
        // GH: Battle screen return
        this.load.image('sword_btn', 'assets/sword.png');
    },

    create: function () 
    {
        var phaserJSON = this.cache.getJSON('gamedata');
         
        this.time.events.add(Phaser.Timer.SECOND * 4, this.backToMain, this);    
      //  this.mold = new Heater.MoldGroup(this);
        this.add.group(this.mold);
        
        this.inventory = new Inventory(this);
        
        this.doughContainer = new Selector.DoughSelector(this);
        this.add.group(this.doughContainer);
        this.doughContainer.position.x = this.world.centerX;
        
        this.add.tween(this.doughContainer.position).to({x:this.world.centerX, y:this.world.height }, 100, Phaser.Easing.Linear.None).start();
        
        this.grills = [null, null, null];
        var i = 0;
        for(i = 0 ; i < 3 ; i++)
        {
            this.grills[i] = this.add.button(i * 160, this.world.centerY * 0.8, 'grill', this.grillSelected, this.grills[i]);
            this.grills[i].id = i;
            this.grills[i].game = this;
        }
        
        this.gameScreen = new GameScreen.GameScreen(this);
        this.add.group(this.gameScreen);
        this.lastGridId = ""; 
        
        this.add.button(this.world.width * 0.7, 0, 'sword_btn', this.showBattleScreen, this);
    },
    
    showBattleScreen : function()
    {
        this.gameScreen.swapScreen("battle");
    },
    
    grillSelected :function()
    {
        
        if(  this.game.lastGridId == "")
        {
            console.log(this.id + "id");
            this.game.lastGridId = this.id;
            this.game.grillPick  = this.id;
            
            this.game.gameScreen.checkDoughs();
            this.game.showSelector();
        }
        
    },
    
    showSelector : function()
    {
        this.add.tween(this.doughContainer.position).to({x:this.world.centerX, y:0}, 100, Phaser.Easing.Linear.None).start();
        
        this.gameScreen.swapScreen(  this.lastGridId );
        this.lastGridId = "";
    },
    
    useType: function(type)
    {
        this.inventory.useType(type);
        console.log("TYPE: " + type);
        this.gameScreen.fillWithDough(type);
    },
    
    update: function()
    {
    //    this.mold.update();  
    },
    
    
    backToMain :function()
    {
     ///   this.game.state.start("EndGame");    
    },
    
    gameResized: function (width, height) 
    {
    }

};



BasicGame.Options = function(game)
{
    this.game = game;
    
    this.leftArrow  = null;
    this.rightArrow = null;
    this.playButton = null;
    this.audioText  = null;
};

BasicGame.Options.prototype = {

    init: function () {
        // set up input max pointers
        this.input.maxPointers = 1;
        // set up stage disable visibility change
        this.stage.disableVisibilityChange = true;
        // Set up the scaling method used by the ScaleManager
        // Valid values for scaleMode are:
        // * EXACT_FIT
        // * NO_SCALE
        // * SHOW_ALL
        // * RESIZE
        // See http://docs.phaser.io/Phaser.ScaleManager.html for full document
        this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
        // If you wish to align your game in the middle of the page then you can
        // set this value to true. It will place a re-calculated margin-left
        // pixel value onto the canvas element which is updated on orientation /
        // resizing events. It doesn't care about any other DOM element that may
        // be on the page, it literally just sets the margin.
        this.scale.pageAlignHorizontally = true;
        this.scale.pageAlignVertically = true;
        // Force the orientation in landscape or portrait.
        // * Set first to true to force landscape. 
        // * Set second to true to force portrait.
        this.scale.forceOrientation(true, false);
        // Sets the callback that will be called when the window resize event
        // occurs, or if set the parent container changes dimensions. Use this 
        // to handle responsive game layout options. Note that the callback will
        // only be called if the ScaleManager.scaleMode is set to RESIZE.
        this.scale.setResizeCallback(this.gameResized, this);
        // Set screen size automatically based on the scaleMode. This is only
        // needed if ScaleMode is not set to RESIZE.
        this.scale.updateLayout(true);
        // Re-calculate scale mode and update screen size. This only applies if
        // ScaleMode is not set to RESIZE.
        this.scale.refresh();
    },

    preload: function () 
    {
        this.load.spritesheet('button', 'assets/button_sprite_sheet_crapped.png', 193, 71);
        this.load.spritesheet('arrow', 'assets/arrow-button.png', 112, 95);
    },

    create: function () 
    {
        this.leftArrow = this.add.button(this.world.centerX * 0.3, this.world.centerY * 0.5, 'arrow', this.onLeftArrow, this, 0, 0, 0);
        this.leftArrow.onInputDown.add(this.onLeftArrow, this); 
        this.leftArrow.onInputUp.add(this.onLeftArrowUp, this); 
        
        
        this.rightArrow = this.add.button(this.world.centerX * 1.2, this.world.centerY * 0.5, 'arrow', this.onRightArrow, this, 1, 1, 1);
        this.rightArrow.onInputDown.add(this.onRightArrow, this);
        this.rightArrow.onInputUp.add(this.onRightArrowUp, this); 
        
        var style = { font: "32px Arial", fill: "#ff0044", wordWrap: true, wordWrapWidth: 200, align: "center", backgroundColor: "#ffff00" };
        this.audioText = this.add.text(this.world.centerX * 0.95, this.world.centerY * 0.5, "10", style);
        
        this.playButton = this.add.button(this.world.centerX, this.world.centerY * 1.05, 'button', this.onPlayButton, this, 2, 1, 0);
        
        this.playButton.position.x -= this.playButton.width * 0.5;        
    },
    
    onPlayButton : function() 
    {
        this.game.state.start("Game");
    },
    
    onLeftArrow : function() {},     
    onRightArrow : function() {},     
    
    // GH: We substract half because phaser double dips
    onLeftArrowUp :function()
    {
        this.game.userVolume -= 0.05;  
        if(this.game.userVolume <= 0)
        {
            this.game.userVolume = 0;
        }
        this.audioText.text =  (Math.ceil(this.game.userVolume * 10 )).toString();
    },
    
    // GH: We substract half because phaser double dips
    onRightArrowUp :function()
    {
        this.game.userVolume += 0.05;  
        if(this.game.userVolume >= 1)
        {
            this.game.userVolume = 1;
        }
        this.audioText.text = (Math.ceil(this.game.userVolume * 10 )).toString();
    },
    
    
    gameResized: function (width, height) 
    {
        // This could be handy if you need to do any extra processing if the 
        // game resizes. A resize could happen if for example swapping 
        // orientation on a device or resizing the browser window. Note that 
        // this callback is only really useful if you use a ScaleMode of RESIZE 
        // and place it inside your main game state.

    }

};

BasicGame.EndGame = function(game)
{
    this.game = game;
    this.menuButton = null;
};

BasicGame.EndGame.prototype = {

    init: function () {
        // set up input max pointers
        this.input.maxPointers = 1;
        // set up stage disable visibility change
        this.stage.disableVisibilityChange = true;
        // Set up the scaling method used by the ScaleManager
        // Valid values for scaleMode are:
        // * EXACT_FIT
        // * NO_SCALE
        // * SHOW_ALL
        // * RESIZE
        // See http://docs.phaser.io/Phaser.ScaleManager.html for full document
        this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
        // If you wish to align your game in the middle of the page then you can
        // set this value to true. It will place a re-calculated margin-left
        // pixel value onto the canvas element which is updated on orientation /
        // resizing events. It doesn't care about any other DOM element that may
        // be on the page, it literally just sets the margin.
        this.scale.pageAlignHorizontally = true;
        this.scale.pageAlignVertically = true;
        // Force the orientation in landscape or portrait.
        // * Set first to true to force landscape. 
        // * Set second to true to force portrait.
        this.scale.forceOrientation(true, false);
        // Sets the callback that will be called when the window resize event
        // occurs, or if set the parent container changes dimensions. Use this 
        // to handle responsive game layout options. Note that the callback will
        // only be called if the ScaleManager.scaleMode is set to RESIZE.
        this.scale.setResizeCallback(this.gameResized, this);
        // Set screen size automatically based on the scaleMode. This is only
        // needed if ScaleMode is not set to RESIZE.
        this.scale.updateLayout(true);
        // Re-calculate scale mode and update screen size. This only applies if
        // ScaleMode is not set to RESIZE.
        this.scale.refresh();
    },

    preload: function () 
    {
        this.load.spritesheet('button', 'assets/button_sprite_sheet_crapped.png', 193, 71);
    },

    create: function () 
    {
        this.menuButton = this.add.button(this.world.centerX, this.world.centerY * 0.8, 'button', this.onMenuButton, this, 2, 1, 0);
        
        this.menuButton.position.x -= this.menuButton.width * 0.5;
    },
    
    onMenuButton :function()
    {
        this.game.state.start("Menu");
    },
    
    gameResized: function (width, height) 
    {
        // This could be handy if you need to do any extra processing if the 
        // game resizes. A resize could happen if for example swapping 
        // orientation on a device or resizing the browser window. Note that 
        // this callback is only really useful if you use a ScaleMode of RESIZE 
        // and place it inside your main game state.

    }

};


// create Menu function in BasicGame
BasicGame.Menu = function (game)
{
    this.playButton = null;
    this.optionsButton = null;  
    this.game = game;
};

// set Menu function prototype
BasicGame.Menu.prototype = {

    init: function () {
        // set up input max pointers
        this.input.maxPointers = 1;
        // set up stage disable visibility change
        this.stage.disableVisibilityChange = true;
        // Set up the scaling method used by the ScaleManager
        // Valid values for scaleMode are:
        // * EXACT_FIT
        // * NO_SCALE
        // * SHOW_ALL
        // * RESIZE
        // See http://docs.phaser.io/Phaser.ScaleManager.html for full document
        this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
        // If you wish to align your game in the middle of the page then you can
        // set this value to true. It will place a re-calculated margin-left
        // pixel value onto the canvas element which is updated on orientation /
        // resizing events. It doesn't care about any other DOM element that may
        // be on the page, it literally just sets the margin.
        this.scale.pageAlignHorizontally = true;
        this.scale.pageAlignVertically = true;
        // Force the orientation in landscape or portrait.
        // * Set first to true to force landscape. 
        // * Set second to true to force portrait.
        this.scale.forceOrientation(true, false);
        // Sets the callback that will be called when the window resize event
        // occurs, or if set the parent container changes dimensions. Use this 
        // to handle responsive game layout options. Note that the callback will
        // only be called if the ScaleManager.scaleMode is set to RESIZE.
        this.scale.setResizeCallback(this.gameResized, this);
        // Set screen size automatically based on the scaleMode. This is only
        // needed if ScaleMode is not set to RESIZE.
        this.scale.updateLayout(true);
        // Re-calculate scale mode and update screen size. This only applies if
        // ScaleMode is not set to RESIZE.
        this.scale.refresh();

    },

    preload: function () 
    {

        // Here we load the assets required for our preloader (in this case a 
        // background and a loading bar)
        this.load.image('logo', 'assets/fionna_cake.png');
        this.load.spritesheet('button', 'assets/button_sprite_sheet_crapped.png', 193, 71);
        
    },

    create: function () 
    {
        // Add logo to the center of the stage
        this.logo = this.add.sprite(
            this.world.centerX, // (centerX, centerY) is the center coordination
            this.world.centerY,
            'logo');
        // Set the anchor to the center of the sprite
        this.logo.anchor.setTo(0.5, 0.5);
        
        // GH: Play button setup
        this.playButton = this.add.button(this.world.centerX, this.world.centerY * 0.8, 'button', this.onPlayButton, this, 2, 1, 0);
        
        this.playButton.position.x -= this.playButton.width * 0.5;
    
        // GH: optionsButton setup
        this.optionsButton = this.add.button(this.world.centerX, this.world.centerY * 1.1, 'button', this.onOptionsButton, this, 2, 1, 0);
        
        this.optionsButton.position.x -= this.optionsButton.width * 0.5;
    },
      
    onOptionsButton : function()
    {
        this.game.state.start("Options");
    },
    
    onPlayButton :function()
    {
        this.game.state.start("Game");
    },

    gameResized: function (width, height) 
    {
    }
};