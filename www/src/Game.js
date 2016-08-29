//---------------------------------------------------------------------------------------
// GH: Globals Data
//---------------------------------------------------------------------------------------


var dicon = ['dough_barro', 'dough_bodoque', 'dough_caramelo', 'dough_grumosa', 'dough_legamo'];
var gicon = ['gem_caramelo', 'gem_isotopo', 'gem_ojo', 'gem_piedra', 'gem_power'];
var itemid = ["Barro","Caramelo", "Legamo", "Grumosa", "Ancestral", "Alambre", "HojasdeHierro", "DientesdeObsidiana", "CalzoncillosdeAcero", "EscamasdeDragon"];


//---------------------------------------------------------------------------------------
// GH: Selector Data
//---------------------------------------------------------------------------------------


// GH: This is the ui component that shows the gems & doughs on the side
var Selector = {};

Selector.DoughSelector = function(game) 
{
    // GH: Phaser inheritance
    Phaser.Group.call(this, game, game.world, 'DoughSelector', false, true, Phaser.Physics.ARCADE);
    // GH: Set the game here for ease of use
    this.game = game;
    
    // GH: Set a starting category
    this.fillWithCategory('doughs', game);
    
    return this;
};

// GH: Phaser inheritance
Selector.DoughSelector.prototype = Object.create(Phaser.Group.prototype);
Selector.DoughSelector.prototype.constructor = Selector.DoughSelector;

// GH: Cleanups the selector
Selector.DoughSelector.prototype.killPrevious = function()
{
    this.callAll('kill');
    this.removeAll();
};

// GH: Sets the buttons for this component
Selector.DoughSelector.prototype.fillWithCategory = function(category, game)
{
    // GH: Cleanup
    this.killPrevious();
    // GH: Rebuild everything
    var bkg = game.make.sprite(0, 0, 'dough_container');
    this.add(bkg, true);
    var xy = {x:0, y:0};
    
    // GH: 
    var key = {};
    var i = 0;
    switch(category)
    {
        case 'doughs':
            
            for(i = 0 ; i < game.inventory.doughs.length ;i++)
            {
             
                key = game.inventory.doughs[i];
                xy.y =  (60 * i);
                this.setupButtons(dicon[i], xy, key.name, i, category);
            }
            break;
        case 'gems':
            for(i = 0 ; i < game.inventory.gems.length ;i++)
            {
                key = game.inventory.gems[i];
                xy.y =  (60 * i);
                this.setupButtons(gicon[i], xy, key.name, i, category);
            }
            break;
    }
};

Selector.DoughSelector.prototype.setupButtons = function(spriteID, xy, type, id, category)
{
    var d = new UIBaseDough.Dough(this.game, xy,spriteID, type, id, category);
    this.add(d, true);    
};

//---------------------------------------------------------------------------------------
// GH: UIDough data
//---------------------------------------------------------------------------------------

var UIBaseDough = 
{
    
};

UIBaseDough.Dough = function(game, xy, sprite, type, id, category)
{
    Phaser.Sprite.call(this, game, xy.x, xy.y, 'circle_container');
    
    this.game = game;
    
    this.btn = game.make.button(0, 0,sprite, function() { this.game.useType(this.type);}, this, 0, 1, 2,3);
    this.addChild(this.btn);
    
    this.type = type;
    this.text = game.make.text(0, 0, 'x1');
    this.addChild(this.text);
    this.id = id;
    this.category = category;
};

UIBaseDough.Dough.prototype = Object.create(Phaser.Sprite.prototype);
UIBaseDough.Dough.prototype.constructor = UIBaseDough.Dough;

UIBaseDough.Dough.prototype.update = function()
{
    switch(this.category)
    {
        case 'doughs':
            this.checkEnabled(this.game.inventory.doughs);
            break;
        case 'gems':
            this.checkEnabled(this.game.inventory.gems);
            break;
    }
};

UIBaseDough.Dough.prototype.checkEnabled = function(array)
{
    var key = array[this.id];
    
    this.btn.inputEnabled = key.count > 0 === true ? true : false;
    this.text.text = "x"+key.count;
        
};

//---------------------------------------------------------------------------------------
// GH: Real Dough Data
//---------------------------------------------------------------------------------------

var GameDough = 
{
};

GameDough.Dough = function(game, xy, sprite, type, id)
{
    Phaser.Sprite.call(this, game, xy.x, xy.y, sprite);
    
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
    
    var bmd = game.make.bitmapData(600, 256);
    bmd.alphaMask('mask_' + itemid[id], 'dough_grill');
    this.visual = game.make.sprite(xy.x +150 , xy.y + 130, bmd);
    this.visual.anchor.setTo(0.5, 0.5);
    this.burnt = false;
    
    this.readyToTakeout = false;
    
    this.gems = game.make.sprite(xy.x + 50, xy.y +130, 'mask_'+itemid[id +5]);
    this.gems.visible = false;
    this.gems.anchor.setTo(0.5, 0.5);
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
            if(this.flipped)
            {
                this.readyToTakeout = true;
            }
            else this.burnt = true;
            delta = 1;
        }
        this.visual.tint = Phaser.Color.interpolateColor(0xFFFFFF, 0xFF3700, 100, 100 * delta);
    }    
    else
    {
        
    }
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
        
        this.flipped = true;  
        this.visual.tint = 0xFFFFFF;
    }         
};

GameDough.Dough.prototype.onTakeout = function()
{
    if(this.readyToTakeout)
    {
        if(this.burnt) 
        {
            this.swordData.durability /=2;
        }
        this.game.inventory.addSword(this.swordData);
        this.reset();
    }
};

GameDough.Dough.prototype.reset = function()
{
    this.currentCookTime = 0;
    this.cookStarted = false;
    this.flipped = false;
    this.storedTween = null;
    this.burnt = false;
    this.readyToTakeout = false;
    this.state = 0;
    this.visual.color = 0xFFFFFF;
    this.visual.tint = 0xFFFFFF;
    this.visual.scale.setTo(0,0);
    this.swordData = {durability:10, type:'sword', ingredients:''};
    
    this.gems.visible = false;
};

//---------------------------------------------------------------------------------------
// GH: Item Data
//---------------------------------------------------------------------------------------

var Item = {};

Item = function(game, xy, sprite, type)
{
    Phaser.Sprite.call(this, game, xy.x, xy.y, sprite);
    // GH: basic duration of item in screen
    this.maxLifespan = 3000;
    this.curLifespan = 0;
    this.game = game;
    this.type = type;
    
    this.lockTillGround = true;
    this.events.onInputDown.add(this.onDown, this);
    
    this.posTween = this.game.add.tween(this.position);
    this.posTween.to({x:game.rnd.integerInRange(100, 400), y:this.game.world.height * 0.62 }, 300, Phaser.Easing.Quadratic.In);
    this.posTween.onComplete.add(this.onGround , this);   
    this.posTween.start();
    
    this.anchor.setTo(0.5, 0.5);
    this.inputEnabled = true;
};


Item.prototype = Object.create(Phaser.Sprite.prototype);
Item.constructor = Item;

Item.prototype.onGround = function()
{
     this.lockTillGround = false; 
};

Item.prototype.update = function()
{
    if(this.lockTillGround)
        return;
    var delta = this.curLifespan / this.maxLifespan;
    this.curLifespan += this.game.time.elapsed;
    
    this.alpha =1 -  delta;

    if(this.alpha === 0)
    {   
    //    this.destroy();
    }
    
    if(this.inputEnabled === false)
    {
        this.angle += 10 * this.game.time.elapsed;
        
        if(this.angle === 360)
        {
            this.angle = 0;
        }  
    }
};

Item.prototype.onDown = function()
{
    if(this.alpha === 0)
        return;
    
    this.game.inventory.addItem(this.type);
    this.inputEnabled = false;
    var posTween = this.game.add.tween(this.position);
    posTween.to({x:this.game.world.width *0.9, y:this.game.world.height * 0.2 }, 200, Phaser.Easing.Linear.None);
    posTween.onComplete.add(this.alphaNull , this);    
    posTween.start();
};

Item.prototype.alphaNull = function()
{
    this.alpha = 0;
};



//---------------------------------------------------------------------------------------
// GH: GameScreens Data
//---------------------------------------------------------------------------------------

var GameScreen = {};

GameScreen.BattleScreen = function(game)
{
    Phaser.Group.call(this, game, game.world, 'BattleScreen', false, true, Phaser.Physics.ARCADE);
    this.itemDrop = 0;
     this.inputEnabled = true;
    this.game = game;    
};

GameScreen.BattleScreen.prototype = Object.create(Phaser.Group.prototype);
GameScreen.BattleScreen.constructor = GameScreen.BattleScreen;

GameScreen.BattleScreen.prototype.spawnItems = function()
{  
    // GH: Generate the items at random
    var megazord = [];
    for(var i = 0 ; i < 5; i++)
    {
        megazord[i] = dicon[i];
        megazord[5 + i] = gicon[i];
    }
    
    
   
    var rnd = this.game.rnd.integerInRange(0, 9);
    var icon = megazord[rnd];
    var data = itemid[rnd];
    
    var item = new Item(this.game, {x:this.game.world.width * 0.57, y:this.game.world.height * 0.37}, icon, data);
    this.add(item);
};

GameScreen.BattleScreen.prototype.update = function()
{
    // GH: Clear stuff if we are not in this screen
    this.forEachAlive(function(obj){ obj.update(); obj.visible = this.game.gameScreen.atScreen === "battle" ? true : false; }, this);
    // GH: Spawn items nonetheless
    if(this.itemDrop >= 3000)
    {
        var max = this.game.rnd.integerInRange(1, 3);
        for (var i = 0; i < max; i++)
            this.spawnItems();
        this.itemDrop = 0;
    }
    
    this.itemDrop += this.game.time.elapsed;
};

GameScreen.GrillScreen = function(game)
{
    Phaser.Group.call(this, game, game.world, 'GrillScreen', false, true, Phaser.Physics.ARCADE);
    // Gh: Background settings
    var bkg = game.make.sprite(0, game.world.height , 'grill_screen_bkg');
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
        
        // GH: Add the grills + the different visuals for them
        this.add(this.dough[i]);
        this.add(this.dough[i].visual); // GH: Layer de masa
        this.add(this.dough[i].gems);   // GH: Layer de piedras
        this.dough[i].visual.scale.setTo(0, 0);
        this.dough[i].visual.anchor.setTo(0.5, 0.5);
        this.dough[i].scale.setTo(0,0);
        this.dough[i].anchor.setTo(0.5,0.5);
    }
    
    // GH: Create the different grills
    this.moldid = ['sword_mold', 'axe_mold', 'axe_mold_b'];
    this.molds = [];
    for(i = 0; i < this.moldid.length; i++)
    {
        this.molds[i] = game.make.sprite(0,  game.world.height * 0, this.moldid[i]);
        this.add(this.molds[i]);
        this.molds[i].visible = false;
    }
  
    this.game = game;
};

GameScreen.GrillScreen.prototype = Object.create(Phaser.Group.prototype);
GameScreen.GrillScreen.constructor = GameScreen.GrillScreen;

GameScreen.GrillScreen.prototype.fillMold = function(type)
{
    
    if(this.game.gameScreen.atScreen === "battle")
        return;
    var i = this.game.grillPick;
    console.log("TYPE: " + type);
    
    if(this.dough[i].visual.scale.x <= 0)
    {
        // GH: Change the mask for the dough
        var bmd =this.game.make.bitmapData(600, 256);
        bmd.alphaMask('mask_' + type, 'dough_grill');
        this.dough[i].visual.loadTexture(bmd);
    
    }
    else
    { 
        // GH: change the mask for the gems
        this.dough[i].gems.loadTexture('mask_' + type);
        this.dough[i].gems.visible = true;
    }

    
    this.dough[i].visual.visible = true;
    var tween = this.game.add.tween(  this.dough[i].visual.scale);
    
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
        this.dough[i].gems.visible = false;
    }
    if(this.game.grillPick >= 0)
    {
        this.dough[this.game.grillPick].visual.visible = true;
        if(this.dough[this.game.grillPick].visual.scale.x > 0)
            this.dough[this.game.grillPick].gems.visible = true;
    }
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

// GH: Proxy functions that go straight to Dough
GameScreen.GrillScreen.prototype.flipDough = function(id)
{
    this.dough[id].onFlip();
};

// GH: Proxy functions that go straight to Dough
GameScreen.GrillScreen.prototype.takeout = function(id)
{
    this.dough[id].onTakeout();
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
    this.atScreen = "";
};

GameScreen.GameScreen.prototype = Object.create(Phaser.Group.prototype);
GameScreen.GameScreen.constructor = GameScreen.GameScreen;

GameScreen.GameScreen.prototype.swapScreen = function(toScreen)
{
    if(this.pendingScreen !== "")
        return;
    
    this.atScreen = this.pendingScreen = toScreen;
    var tween = this.game.add.tween(this.grillScreen.bkg.scale);
    
    this.grillScreen.molds[currentGrill].visible = false;
    tween.to({x:1, y:0}, 100, Phaser.Easing.Linear.None);
    tween.onComplete.add(this.onExitFinished, this);
    tween.start(); 
    
    if(this.atScreen === "battle")
    {
        this.game.hideGrillUI(true);
    }
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
        this.grillScreen.molds[currentGrill].visible = false;
        this.game.tweenBkg(1);
    }   
    else
    {
        this.game.add.tween(this.grillScreen.bkg.scale).to({x:1, y:1}, 100, Phaser.Easing.Linear.None).start();
        this.grillScreen.enabled = true;
        this.grillScreen.initWithMold(this.pendingScreen);
        this.game.tweenBkg(-1);

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
    
    // GH: Inventory, array of doughs, setup from here
    this.doughs = [{name:itemid[0], count:10}, {name:itemid[1], count:0}, {name:itemid[2], count:0}, {name:itemid[3], count:0}, {name:itemid[4], count:0}];
    
    // GH: Inventory, array of gems, setup from here
    this.gems = [{name:itemid[5], count:10}, {name:itemid[6], count:0}, {name:itemid[7], count:0},{name:itemid[8], count:0}, {name:itemid[9], count:10}];
    // GH: Add current swords being made here
    this.currentSword = [{a:'', ad:0 , b:'', bd: 0}, {a:'', ad:0 , b:'', bd: 0},{a:'', ad:0 , b:'', bd: 0},];
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
                this.currentSword[currentGrill].a = key.name;
                this.currentSword[currentGrill].ad = key.count;
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
                    this.currentSword[currentGrill].b    = key.name;
                    this.currentSword[currentGrill].bd   = key.count;
                    this.gems[i].count--;
                    break;
                }
            }
        }
    },
  
    // GH: Adds a sword to the queue
    addSword: function(obj)
    {
        var materials = this.currentSword[currentGrill];
        // GH: Grab materials duration
        var d = materials.ad;
        var g = materials.bd;
        // GH: Final sword duration
        var finalDuration = g + d + obj.durability;    
        
        obj.durability = finalDuration;
        // GH: Add the sword to the queue
        this.game.swordQueue.addSword(obj);   
    },
    
    
    // GH: Add an item from the battleground
    addItem : function(type)
    {
        var i = 0; 
        var key = null;
        // GH: check for doughs
        for(i = 0; i < this.doughs.length ; i++)
        {
            if(this.doughs[i].name === type)
            {
                this.game.showSelector(0, false);
                key = this.doughs[i];
                this.doughs[i].count++;
                break;
            }
        }
        // GH: check for gems
        if(key === null)
        {
            for(i = 0; i < this.doughs.length ; i++)
            {
                if(this.gems[i].name === type)
                {
                    this.game.showSelector(1, false);
                    key = this.gems[i];
                    this.gems[i].count++;
                    break;
                }
            }
        }
    }
};

Inventory.prototype.constructor = Inventory;

//---------------------------------------------------------------------------------------
//  GH: Clock 
//---------------------------------------------------------------------------------------

var Clock = {};

Clock.Clock = function(game, id, xy, sprite, needle, green)
{
    Phaser.Sprite.call(this, game, xy.x, xy.y, sprite);
    this.game = game;
    
    this.needle = game.make.sprite(this.width * 0.5, this.height * 0.5, needle);
    this.greenCorner = game.make.sprite(this.width * 0.5, this.height * 0.5, green);
    this.needle.anchor.setTo(0.5, 0.65);
    this.greenCorner.anchor.setTo(0, 1);
    this.addChild(this.greenCorner);
    this.addChild(this.needle);
    
    this.timeToCook = 0;
    this.maxTime =  12000;
    this.currentTime = 0;
    this.id = id;
};

Clock.Clock.prototype = Object.create(Phaser.Sprite.prototype);
Clock.Clock.prototype.constructor = Clock.Clock;

Clock.Clock.prototype.update = function()
{
    var dough = this.game.gameScreen.grillScreen.dough[this.id];
    if(dough.cookStarted)
    {
        this.timeToCook = dough.maxCookTime;
        this.currentTime = dough.currentCookTime;
        this.needle.angle = (this.currentTime / this.timeToCook) * 360;
        this.greenCorner.angle = (this.timeToCook / this.maxTime) * 360;
        this.greenCorner.visible = true;
    }
    else
    {
        this.greenCorner.visible = false;
        this.needle.angle = 0;
    }
};

Clock.ClockGroup = function(game) 
{
    Phaser.Group.call(this, game, game.world, 'Clock', false, true, Phaser.Physics.ARCADE);
    this.game = game;
    
    var i = 0; 
    var xy = {x:0, y:0};
    for(i = 0 ; i < 3 ; i ++)   
    {
        xy.x = 135 + i * 190;
        xy.y = game.world.height * 0.8;
        var clock = new Clock.Clock(game, i, xy, 'clock_canvas', 'clock_needle', 'clock_green');
        this.add(clock);
    }
};

Clock.ClockGroup.prototype = Object.create(Phaser.Group.prototype);
Clock.ClockGroup.prototype.constructor = Clock.ClockGroup;
    

//---------------------------------------------------------------------------------------
//  GH: Sword Queue
//---------------------------------------------------------------------------------------

var SwordQueue = {};

SwordQueue = function(game)
{
    Phaser.Group.call(this, game, game.world, 'SwordQueue', false, true, Phaser.Physics.ARCADE);
    this.swords = 0;
    this.game = game;
    
    this.currentIndex = 0;
    this.currentElapsed = 0;
    this.currentDelta = 0;
    
    // GH: Initial sword setup
    this.addSword({durability:10, ingredients:'', type:'sword'});
};

SwordQueue.prototype =  Object.create(Phaser.Group.prototype);
SwordQueue.prototype.constructor = SwordQueue;


var sQueue = [];
var currentIndex = 0;
SwordQueue.prototype.addSword = function(obj)
{
    sQueue[this.swords] = obj;
    this.swords++;
    
};


// GH: LOSS CONDITION GOES HERE
SwordQueue.prototype.update = function()
{
    // GH: Advance sword usage here
    if((sQueue[currentIndex] !== undefined))
    {
        var curDur = sQueue[currentIndex].durability;
        this.currentDelta = this.currentElapsed / (curDur * 1000);
        this.currentElapsed += this.game.time.elapsed;
        
        if(this.currentDelta  >= 1)
        {
            this.currentElapsed = 0;
            currentIndex++;
            if(sQueue[currentIndex] === undefined)
            {
                // GH: GAME LOSS    
            }
        }
    }
};

//---------------------------------------------------------------------------------------
//  GH: Fiona's sword life bar
//---------------------------------------------------------------------------------------

var LifeBar = {};

LifeBar = function(game)
{
    Phaser.Group.call(this, game, game.world, 'SwordQueue', false, true, Phaser.Physics.ARCADE);
    this.game = game;
    
    this.redline = game.make.sprite(game.world.width * 0.15, 0, 'lifebar_red');
    this.add(this.redline);
    this.greenline = game.make.sprite(game.world.width * 0.15 + 85, 20, 'lifebar_green');
    this.add(this.greenline);
    this.container = game.make.sprite(game.world.width * 0.15, 0, 'lifebar_frame');
    this.add(this.container);
    this.greenline.anchor.setTo(0, 0);
};

LifeBar.prototype = Object.create(Phaser.Group.prototype);
LifeBar.prototype.constructor = LifeBar;

LifeBar.prototype.update = function()
{
    var delta = 1-this.game.swordQueue.currentDelta;
    this.greenline.scale.setTo(delta, 1);
};
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
        
        //console.log("ACTIVEPOINTERS: " + this.input.pointer); 
    },

    preload: function () 
    {
        
        this.load.json('gamedata', 'assets/gamedata.json');
        // GH: Grill mold
        this.load.image('sword_mold', 'assets/molde_sword.png');
        this.load.image('axe_mold', 'assets/molde_axe.png');
        this.load.image('axe_mold_b', 'assets/molde_mace.png');
        // GH: Grill dough
        this.load.image('dough_grill', 'assets/circle_dough.png');
        // GH: Selector
        this.load.image('circle_container', 'assets/circle_container.png');
        this.load.image('dough_container', 'assets/gui_itemsbar_container.png');
        this.load.spritesheet('dough_test', 'assets/masa_1.png', 64,64);
        // GH: Grills
        this.load.image('grill_sword', 'assets/grillicon_sword.png');
        this.load.image('grill_axe', 'assets/grillicon_axe.png');
        this.load.image('grill_mace', 'assets/grillicon_mace.png');
        // GH: Screens
        this.load.image('battle_screen_bkg', 'assets/grill_whole.png');
        this.load.image('grill_screen_bkg', 'assets/grill_whole.png');
        // GH: Battle screen return
        this.load.image('sword_btn', 'assets/Up_Button.png');
        // GH: gems
        this.load.spritesheet('gems', 'assets/gems_test.png', 32, 32);
        this.load.spritesheet('takeout', 'assets/icons_spritesheet_ready.png',128, 128);
        // GH: Flip 
        this.load.spritesheet('flip', 'assets/icons_spritesheet_flip.png', 128, 128);
        
        // GH: FOKKEN MASKS dough
        this.load.image('mask_' + itemid[0], 'assets/masks/mask_dough_barro.png');
        this.load.image('mask_' + itemid[1], 'assets/masks/mask_dough_bodoqueancestral.png');
        this.load.image('mask_' + itemid[2], 'assets/masks/mask_dough_caramelo.png');
        this.load.image('mask_' + itemid[3], 'assets/masks/mask_dough_grumosa.png');
        this.load.image('mask_' + itemid[4], 'assets/masks/mask_dough_legamo.png');
        
        // GH: Fokken masks gem
        this.load.image('mask_' + itemid[5], 'assets/masks/mask_gem_caramelosdelimon.png');
        this.load.image('mask_' + itemid[6], 'assets/masks/mask_gem_isotoposdepoder.png');
        this.load.image('mask_' + itemid[7], 'assets/masks/mask_gem_ojosdegato.png');
        this.load.image('mask_' + itemid[8], 'assets/masks/mask_gem_piedras.png');
        this.load.image('mask_' + itemid[9], 'assets/masks/mask_gem_gemasdepoder.png');
                
        // GH: Clock
        this.load.image('clock_canvas', 'assets/clock_canvas.png');
        this.load.image('clock_green', 'assets/clock_green.png');
        this.load.image('clock_needle', 'assets/clock_needle.png');
        
        // GH: Weaponstack
        this.load.image('weaponstack_icon', 'assets/weaponstack_swordplaceholder.png');
        this.load.image('weaponstack_container', 'assets/weaponstack_container.png');
        
        // GH: lifebar
        this.load.image('lifebar_frame', 'assets/lifebar_frame.png');
        this.load.image('lifebar_green', 'assets/lifebar_green.png');
        this.load.image('lifebar_red', 'assets/lifebar_red.png');
        
        // GH: Icon Dough
        
        this.load.image('dough_barro', 'assets/items/icon_dough_barro.png');
        this.load.image('dough_bodoque', 'assets/items/icon_dough_bodoqueancestral.png');
        this.load.image('dough_caramelo', 'assets/items/icon_dough_caramelo.png');
        this.load.image('dough_grumosa', 'assets/items/icon_dough_grumosa.png');
        this.load.image('dough_legamo', 'assets/items/icon_dough_legamo.png');
        
        this.load.image('gem_caramelo', 'assets/items/icon_stone_caramelodelimon.png');
        this.load.image('gem_isotopo', 'assets/items/icon_stone_isotoporadioactivo.png');
        this.load.image('gem_ojo', 'assets/items/icon_stone_ojodegato.png');
        this.load.image('gem_piedra', 'assets/items/icon_stone_piedra.png');
        this.load.image('gem_power', 'assets/items/icon_stone_piedrasdepoder.png');
        
        this.load.image('smoke_1', 'assets/smoke/smoke_1.png');
        this.load.image('smoke_2', 'assets/smoke/smoke_2.png');
        this.load.image('smoke_3', 'assets/smoke/smoke_3.png');
        
        this.load.image('bkg', 'assets/at_bg.png');
    },
    
    tweenBkg :function(direction)
    {
        var dir = direction > 0 ? 0 : -480;
        this.add.tween(this.bkg.position).to({x:0, y:dir}, 500, Phaser.Easing.Linear.None).start();
    },
    
    hideGrillUI :function(hide)
    {
        if(hide)  
        {
            this.add.tween(this.doughContainer.position).to({x:this.world.width, y:this.world.height * 0.2 }, 100, Phaser.Easing.Linear.None).start();
        }
    },

    // GH: Create all stuff
    create: function()
    {
        // GH: Grab the json
        var phaserJSON = this.cache.getJSON('gamedata');
        this.add.group(this.mold);
        this.inventory = new Inventory(this);
        this.bkg = this.add.sprite(0, -480, 'bkg');
        
        // GH: Dough container
        this.doughContainer = new Selector.DoughSelector(this);
        this.add.group(this.doughContainer);
        //this.doughContainer.position.x = this.world.centerX;
        this.add.tween(this.doughContainer.position).to({x:this.world.width * 0.7, y:this.world.height * 0.2}, 100, Phaser.Easing.Linear.None).start();
        // GH: Grills setup
            
        // GH: GameScreen setup
        this.gameScreen = new GameScreen.GameScreen(this);
        this.add.group(this.gameScreen);
        this.lastGridId = ""; 
        // GH: ui buttons / battle
        this.battleBtn = this.add.button(this.world.width * 0.76, 0, 'sword_btn', this.showBattleScreen, this);
        // GH: Flip
        this.flipButton = this.add.button(this.world.width * 0.7, this.world.height * 0.23, 'flip', this.flipDough, this, 2, 1, 0);
        this.takeoutButton = this.add.button(this.world.width * 0.7, this.world.height * 0.23, 'takeout', this.takeout, this, 2, 1, 0);
        this.takeoutButton.visible = false;
        
        this.swordQueue = new SwordQueue(this);
        this.add.group(this.swordQueue);
        
        this.add.sprite(this.world.width * 0.87,  this.world.height * 0, 'weaponstack_container' );
        this.add.sprite(this.world.width * 0.91,  this.world.height * 0.05, 'weaponstack_icon' );
        var style = { font: "32px Arial", fill: "#ffffff", wordWrap: true, wordWrapWidth: 200, align: "center", backgroundColor: "#000000"};
        this.stackText = this.add.text(this.world.width * 0.9,  this.world.height * 0, "0", style);
        
        this.grills = [null, null, null];
        var grillid = ['grill_sword', 'grill_axe', 'grill_mace'];
        var i = 0;
        for(i = 0 ; i < 3 ; i++)
        {
            this.grills[i] = this.add.button((80) + i * 190, this.world.height * 0.8, grillid[i], this.grillSelected, this.grills[i]);
            this.grills[i].id = i;
            this.grills[i].game = this;
        }
        
        this.clockGroup = new Clock.ClockGroup(this);
        this.add.group(this.clockGroup);
      
        
        this.add.group(new LifeBar(this));
        
        this.emitter = this.add.emitter(this.world.centerX, 200, 200);

        //  Here we're passing an array of image keys. It will pick one at random when emitting a new particle.
        this.emitter.makeParticles(['smoke_1', 'smoke_2', 'smoke_3']);

       
    },
    

    takeout : function()
    {
        // GH: set up the fucking doughs to be taken out
        this.gameScreen.grillScreen.takeout(currentGrill);
         this.emitter.start(true, 1000, null, 20);
    },
    
    flipDough : function()
    {
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
            this.game.lastGridId = this.id.toString();
            this.game.grillPick  = this.id;
            this.game.gameScreen.checkDoughs();
            // GH: Show the selector
            
            currentGrill = this.id;
            this.game.showSelector(this.id, true);
        }
    },
    
    showSelector : function(id, swapScreen)
    {       
        var grillState = this.gameScreen.grillScreen.isGrillBeingUsed(id);
        
        switch(grillState)
        {
            case 0:
                this.doughContainer.fillWithCategory("doughs", this);
                this.add.tween(this.doughContainer.position).to({x:this.world.width * 0.89, y:this.world.height * 0.2}, 100, Phaser.Easing.Linear.None).start();
                break;
            case 1:
                this.doughContainer.fillWithCategory("gems", this);
                this.add.tween(this.doughContainer.position).to({x:this.world.width * 0.89, y:this.world.height * 0.2}, 100, Phaser.Easing.Linear.None).start();
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
        this.add.tween(this.doughContainer.position).to({x:this.world.width , y:this.world.height  * 0.2}, 100, Phaser.Easing.Linear.None).start();
        this.doughContainer.killPrevious();
    
        this.gameScreen.fillWithDough(type);
    },
    
    update: function()
    {
     
        if(this.gameScreen.atScreen !== "battle")
        {
            this.takeoutButton.visible = this.gameScreen.grillScreen.dough[currentGrill].readyToTakeout;
            this.flipButton.visible = this.gameScreen.grillScreen.dough[currentGrill].state >= 2;
        }
       
        this.flipButton.InputEnabled = !this.takeoutButton.visible;
        
        this.battleBtn.visible = this.gameScreen.atScreen === "battle" ? false : true ; 
        
        this.stackText.text = this.swordQueue.swords.toString();

    },
    
    gameResized: function (width, height) 
    {
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
        this.load.spritesheet('button', 'assets/icons_spritesheet_play.png', 193, 71);
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
        this.load.image('logo', 'assets/main_scr_bkg.png');
        this.load.spritesheet('play_button', 'assets/icons_spritesheet_play.png', 128, 128);
        this.load.spritesheet('music_button', 'assets/icons_spritesheet_musicon.png', 128, 128);
        
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
        this.playButton = this.add.button(this.world.width * 0.35, this.world.centerY * 1.1, 'play_button', this.onPlayButton, this, 2, 1, 0);
        
        this.playButton.position.x -= this.playButton.width * 0.5;
    
        // GH: optionsButton setup
        this.optionsButton = this.add.button(this.world.width * 0.7, this.world.centerY * 1.1, 'music_button', this.onOptionsButton, this, 2, 1, 0);
        
        this.optionsButton.position.x -= this.optionsButton.width * 0.5;
    },
      
    onOptionsButton : function()
    {
        this.game.userVolume = this.game.userVolume === 0 ? 1  : 0;
    },
    
    onPlayButton :function()
    {
        this.game.state.start("Game");
    },

    gameResized: function (width, height) 
    {
    }
};