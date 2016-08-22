//---------------------------------------------------------------------------------------
// GH: Selector Data
//---------------------------------------------------------------------------------------

var Selector = {};

Selector.DoughSelector = function(game) 
{
    Phaser.Group.call(this, game, game.world, 'DoughSelector', false, true, Phaser.Physics.ARCADE);
    this.game = game;
    var i = 0;
    this.fillWithCategory('doughs', game);
    
    return this;
};

Selector.DoughSelector.prototype = Object.create(Phaser.Group.prototype);
Selector.DoughSelector.prototype.constructor = Selector.DoughSelector;

Selector.DoughSelector.prototype.fillWithCategory = function(category, game)
{
    this.removeAll();
    var bkg = game.make.sprite(game.world.width * 0.4, game.world.height * 0.1 , 'dough_container');
    this.add(bkg, true);
    var xy = {x:game.world.width * 0.4, y:0};
    
    var key = {};
    var i = 0;
    switch(category)
    {
        case 'doughs':
            
            for(i = 0 ; i < game.inventory.doughs.length ;i++)
            {
             
                key = game.inventory.doughs[i];
                if(key.count > 0)
                {
                    xy.y = game.world.height * 0.1 + (60 * i);
                    this.setupButtons('dough_test', xy, key.name);
                }
            }
            break;
        case 'gems':
            for(i = 0 ; i < game.inventory.gems.length ;i++)
            {
                key = game.inventory.gems[i];
              
                if(key.count > 0)
                {
                    xy.y = game.world.height * 0.1 + (60 * i);
                    this.setupButtons('gems', xy, key.name);
                }
            }
            break;
    }
};

Selector.DoughSelector.prototype.setupButtons = function(spriteID, xy, type)
{
    var d = new UIBaseDough.Dough(this.game, xy,spriteID, type);
    this.add(d, true);
    this.add(this.game.make.button(xy.x, xy.y,spriteID, function() { this.game.useType(this.type);}, d, 0, 1, 2,3));
};

//---------------------------------------------------------------------------------------
// GH: UIDough data
//---------------------------------------------------------------------------------------

var UIBaseDough = 
{
    
};

UIBaseDough.Dough = function(game, xy, sprite, type)
{
    Phaser.Sprite.call(this, game, xy.x, xy.y, 'circle_container');
    
    this.game = game;
    this.type = type;
    this.text = game.make.text(0, 0, 'x1');
    this.addChild(this.text);
};

UIBaseDough.Dough.prototype = Object.create(Phaser.Sprite.prototype);
UIBaseDough.Dough.prototype.constructor = UIBaseDough.Dough;

//---------------------------------------------------------------------------------------
// GH: Real Dough Data
//---------------------------------------------------------------------------------------

var GameDough = 
{
};

GameDough.Dough = function(game, xy, sprite, type, id)
{
    Phaser.Sprite.call(this, game, xy.x, xy.y, sprite);
    console.log("Dough: " + this.toString());
    console.log("DoughSprite: " + sprite);
    this.game = game;
    this.type = type;
    
    this.id = id;
    
    // GH: Data dependant from type
    this.maxCookTime = 5000;
    this.currentCookTime = 0;
    this.cookStarted = false;
    this.flipped = false;
    this.storedTween = null;
    this.state = 0;
    
    this.swordData = {durability:10, type:'sword', ingredients:''};
    
    var bmd = game.make.bitmapData(500, 200);
    bmd.alphaMask('peppermint', 'dough_grill');
    this.visual = game.make.sprite(xy.x + 160, xy.y, bmd);
    
    // GH: States:
    // 0 = IDLE / 1 = COOK_SIDE_A / 2 = COOK_SIDE_B / 3 = READY
};

GameDough.Dough.prototype = Object.create(Phaser.Sprite.prototype);
GameDough.Dough.prototype.constructor = GameDough.Dough;

GameDough.Dough.prototype.update = function()
{
    if(this.cookStarted)
    {
        this.currentCookTime += this.game.time.elapsed;
        var delta = this.currentCookTime / this.maxCookTime;
        if(delta >= 1)
        {
            delta = 1;
        }
        this.visual.tint = Phaser.Color.interpolateColor(0xFFFFFF, 0xFF3700, 100, 100 * delta);
     }
};

tweenTint = function(obj, parent, startColor, endColor, time) {    
    // create an object to tween with our step value at 0    
    var colorBlend = {step: 0};    
    // create the tween on this object and tween its step property to 100    
    var colorTween = obj.game.add.tween(colorBlend).to({step: 100}, time);        
    // run the interpolateColor function every time the tween updates, feeding it the    
    // updated value of our tween each time, and set the result as our tint   
    colorTween.onUpdateCallback(function() {      
        obj.tint = Phaser.Color.interpolateColor(startColor, endColor, 100, colorBlend.step);      
    });
    // set the object to the start color straight away    
    obj.tint = startColor;            
    // start the tween    
    colorTween.start();
    parent.storedTween = colorTween;
    
};

GameDough.Dough.prototype.onFillEnd = function()
{  
    this.state = 1;
    this.game.showSelector(this.id, false);
};

GameDough.Dough.prototype.startCooking = function()
{
    this.cookStarted = true;  
    this.state = 2;
    this.currentCookTime = 0;
};

GameDough.Dough.prototype.onFlip = function()
{
    if(this.flipped === false)
    {
        this.currentCookTime = 0;
        console.log("AT DOUGH FLIPs");
        this.flipped = true;  
        this.visual.tint = 0xFFFFFF;
    }         
};

GameDough.Dough.prototype.onTakeout = function()
{
    this.game.inventory.addSword(this.swordData);
    this.reset();
};

GameDough.Dough.prototype.reset = function()
{
    this.currentCookTime = 0;
    this.cookStarted = false;
    this.flipped = false;
    this.storedTween = null;
    this.state = 0;
    this.swordData = {durability:10, type:'sword', ingredients:''};
};

//---------------------------------------------------------------------------------------
// GH: GameScreens Data
//---------------------------------------------------------------------------------------

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
    
    // GH: Create position data for doughs.
    var xy = {x:game.world.centerX * 0.75 , y:game.world.height * 0.23 };
    // GH: Create & setup doughs;
    
    this.dough = [ new GameDough.Dough(game, xy, 'dough_grill', 'bs', 0), new GameDough.Dough(game, xy, 'dough_grill', 'bs', 1), new GameDough.Dough(game, xy, 'dough_grill', 'bs', 2)];
    
    var i = 0;
    for(i = 0; i < this.dough.length ; i++)
    {
        this.add(this.dough[i]);
        this.add(this.dough[i].visual);
        this.dough[i].visual.scale.setTo(0, 0);
        this.dough[i].visual.anchor.setTo(0.5, 0.5);
        this.dough[i].scale.setTo(0,0);
        this.dough[i].anchor.setTo(0.5,0.5);
    }
    
    // GH: Create the different grills
    // GH: Sword
    this.moldid = ['sword_mold', 'axe_mold', 'axe_mold_b'];
    this.molds = [];
    for(i = 0; i < this.moldid.length; i++)
    {
        this.molds[i] = game.make.sprite(0,  game.world.height * 0.0151, this.moldid[i]);
        this.add(this.molds[i]);
        this.molds[i].visible = false;
    }
  
    this.game = game;
};


GameScreen.GrillScreen.prototype = Object.create(Phaser.Group.prototype);
GameScreen.GrillScreen.constructor = GameScreen.GrillScreen;

GameScreen.GrillScreen.prototype.fillMold = function(type)
{
    var i = this.game.grillPick;
    
    this.dough[i].visual.visible = true;
    var tween = this.game.add.tween(  this.dough[i].visual.scale);
    console.log(this.dough[i].visual);
    tween.to({x:1, y:1}, 500, Phaser.Easing.Linear.None);
    
    if(this.dough[i].state === 0)
    {
        tween.onComplete.add(this.dough[i].onFillEnd, this.dough[i]);
        tween.start();
    }
    
    if(this.dough[i].state === 1)
    {
        this.dough[i].startCooking();
    }
    
};

GameScreen.GrillScreen.prototype.isGrillBeingUsed = function(id)
{
    if(this.dough[id].visible)
    {
        return this.dough[id].state;
    }
};

// GH: Clear the doughs, then get the id and set it up
GameScreen.GrillScreen.prototype.checkDoughs = function()
{
    var i = 0; 
    for (i = 0 ; i < this.dough.length; i++)
    {
        this.dough[i].visual.visible = false;
    }
    if(this.game.grillPick >= 0)
        this.dough[this.game.grillPick].visual.visible = true;
};

GameScreen.GrillScreen.prototype.initWithMold = function(moldType)
{
    // GH: Select the proper mold ???
    var i = 0;
    for(i = 0;  i < this.molds.length; i++)
    {
        this.molds[i].visible = false;
    }
    this.molds[currentGrill].visible = true;
};

GameScreen.GrillScreen.prototype.flipDough = function(id)
{
    console.log('flip shit: ' + id );
    this.dough[id].onFlip();
};

GameScreen.GrillScreen.prototype.takeout = function(id)
{
    console.log('take out this grill: ' + id );
    this.dough[id].onFlip();
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
    
    this.pendingScreen = "";
    this.atScreen = "battle";
};

GameScreen.GameScreen.prototype = Object.create(Phaser.Group.prototype);
GameScreen.GameScreen.constructor = GameScreen.GameScreen;

GameScreen.GameScreen.prototype.swapScreen = function(toScreen)
{
    if(this.pendingScreen !== "")
        return;
    this.atScreen = this.pendingScreen = toScreen;
    var tween = this.game.add.tween(this.grillScreen.bkg.scale);
    tween.to({x:1, y:0}, 100, Phaser.Easing.Linear.None);
    tween.onComplete.add(this.onExitFinished, this);
    tween.start(); 
};

GameScreen.GameScreen.prototype.checkDoughs = function()
{
    this.grillScreen.checkDoughs();  
};

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
    this.game   = game;
    this.doughs = [{name:"Barro", count:10}, {name:"Caramelo", count:0}, {name:"Legamo", count:0}, {name:"Grumosa", count:0}, {name:"Ancestral", count:0}];
    
    this.gems = [{name:"Alambre", count:10}, {name:"HojasdeHierro", count:0}, {name:"DientesdeObsidiana", count:0},{name:"CalzoncillosdeAcero", count:0}, {name:"EscamasdeDragon", count:10}];
    this.currentSword = ['','', ''];
};

Inventory.prototype =
{
    useType: function(type)
    {
        var i = 0; 
        var key = null;
        for(i = 0; i < this.doughs.length ; i++)
        {
            if(this.doughs[i].name === type)
            {
                key = this.doughs[i];
                this.currentSword[currentGrill] += key.name;
                this.doughs[i].count--;
                break;
            }
        }
        
        if(key === null)
        {
            for(i = 0; i < this.doughs.length ; i++)
            {
                if(this.gems[i].name === type)
                {
                    key = this.gems[i];
                    this.currentSword[currentGrill] += " , " + skey.name;
                    this.gems[i].count--;
                    break;
                }
            }
        }
    },
    
    addSword: function(obj)
    {
        
        var materials = this.currentSword[currentGrill];
        var d = this.getDuration(materials.split(" , ")[0]);
        var g = this.getDuration(materials.split(" , ")[1]);
        
        var finalDuration = g + d + obj.durability;    
        
        obj.durability = finalDuration;
        this.game.swordQueue.addSword(obj);
    }
};

Inventory.prototype.constructor = Inventory;

//---------------------------------------------------------------------------------------
//  GH: Sword Queue
//---------------------------------------------------------------------------------------

var SwordQueue = {};

SwordQueue = function()
{
    
};

SwordQueue.prototype =  Object.create(Phaser.Group.prototype);
SwordQueue.prototype.constructor = SwordQueue;




//---------------------------------------------------------------------------------------
//  GH: Game menus & flow
//---------------------------------------------------------------------------------------
var currentGrill  = 0;
// create BasicGame Class
var BasicGame = {};

BasicGame.Game = function(game)
{    
    this.game = game;
};

BasicGame.Game.prototype = {
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
        // GH: gems
        this.load.spritesheet('gems', 'assets/gems_test.png', 32, 32);
        this.load.image('takeout', 'assets/takeout.png');
        // GH: Flip 
        this.load.image('flip', 'assets/flip.png');
        this.load.image('peppermint', 'assets/peppermint.jpg');
    },

    // GH: Create all stuff
    create: function () 
    {
        // GH: Grab the json
        var phaserJSON = this.cache.getJSON('gamedata');
        this.add.group(this.mold);
        this.inventory = new Inventory(this);
        // GH: Dough container
        this.doughContainer = new Selector.DoughSelector(this);
        this.add.group(this.doughContainer);
        this.doughContainer.position.x = this.world.centerX;
        this.add.tween(this.doughContainer.position).to({x:this.world.centerX, y:this.world.height }, 100, Phaser.Easing.Linear.None).start();
        // GH: Grills setup
        this.grills = [null, null, null];
        var i = 0;
        for(i = 0 ; i < 3 ; i++)
        {
            this.grills[i] = this.add.button(i * 160, this.world.centerY * 0.8, 'grill', this.grillSelected, this.grills[i]);
            this.grills[i].id = i;
            this.grills[i].game = this;
        }
        // GH: GameScreen setup
        this.gameScreen = new GameScreen.GameScreen(this);
        this.add.group(this.gameScreen);
        this.lastGridId = ""; 
        // GH: ui buttons / battle
        this.add.button(this.world.width * 0.7, 0, 'sword_btn', this.showBattleScreen, this);
        // GH: Flip
        this.flipButton = this.add.button(this.world.width * 0.7, this.world.height * 0.3, 'flip', this.flipDough, this);
        this.takeoutButton = this.add.button(this.world.width * 0.7, this.world.height * 0.5, 'takeout', this.takeout, this);
    },
    
    takeout : function()
    {
        // GH: set up the fucking doughs to be taken out
        this.gameScreen.grillScreen.takeout(currentGrill);
    },
    
    flipDough : function()
    {
        console.log("FLIPDOUGHID; " + currentGrill);
        this.gameScreen.grillScreen.flipDough(currentGrill);
    },
    
    // GH: Just swap screens to battle
    showBattleScreen : function()
    {
        this.gameScreen.swapScreen("battle");
    },
    
    // GH: Select grid
    grillSelected :function()
    {
        // GH: Are we clear to use a grid?
        if(this.game.lastGridId === "")
        {
            // GH: Set the ids
            this.game.lastGridId = this.id;
            this.game.grillPick  = this.id;
            this.game.gameScreen.checkDoughs();
            // GH: Show the selector
            console.log(this.id + " GRILL ID" );
            currentGrill = this.id;
            this.game.showSelector(this.id, true);
        }
    },
    
    showSelector : function(id, swapScreen)
    {       
        var grillState = this.gameScreen.grillScreen.isGrillBeingUsed(id);
        console.log("GRILLSTATE: " + grillState);
        switch(grillState)
        {
            case 0:
                this.doughContainer.fillWithCategory("doughs", this);
                this.add.tween(this.doughContainer.position).to({x:this.world.centerX, y:0}, 100, Phaser.Easing.Linear.None).start();
                break;
            case 1:
                this.doughContainer.fillWithCategory("gems", this);
                this.add.tween(this.doughContainer.position).to({x:this.world.centerX, y:0}, 100, Phaser.Easing.Linear.None).start();
                break;
            case 2:
                // GH: Actual cooking begins
                break;
            case 3:
                break;
        }
        if(swapScreen)
            this.gameScreen.swapScreen(this.lastGridId);
        this.lastGridId = "";
    },
    
    useType: function(type)
    {
        this.inventory.useType(type);  
        this.add.tween(this.doughContainer.position).to({x:this.world.centerX, y:this.world.height }, 100, Phaser.Easing.Linear.None).start();
        this.gameScreen.fillWithDough(type);
    },
    
    update: function()
    {
        this.flipButton.visible = this.gameScreen.atScreen === "battle" ? false : true ; 
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