/* ==============================================================
	Wilderness
=============================================================== */
	// Setup Pixi Renderer


	var app = new PIXI.Application({width:960, height:540});
	var sprite = PIXI.Sprite.from('data/gfx/test.jpg');

	var hexagon_flat = PIXI.Texture.from('data/gfx/hex_flat.png');
	var hexagon_water = PIXI.Texture.from('data/gfx/hex_water.png');
	var hexagon_start = PIXI.Texture.from('data/gfx/hex_start.png');
	var hexagon_end = PIXI.Texture.from('data/gfx/hex_end.png');
	var hexagon_forest = PIXI.Texture.from('data/gfx/hex_forest.png');
	var hexagon_mountain = PIXI.Texture.from('data/gfx/hex_mountain.png');
	var hexagon_mountain_dead = PIXI.Texture.from('data/gfx/hex_mountain_dead.png');

	var player = PIXI.Sprite.from('data/gfx/player.png');
	app.stage.addChild(sprite);
	sprite.transform.position.x = 100;



//============================================================= Game

var wilderness_server = true;

class Wilderness{

	gamestate = "init";

	constructor(gamestate="init"){
		this.gamestate = gamestate;
	}

	//::::::::::::::::::::::::::::::::::::::: GameLoop
	IDLE(){
		switch(this.gamestate){
			case "init": //::::::::::::::: Init
				console.log("Idle");
				break;
			case "exit": //::::::::::::::: END
				break;
		}
		console.log(this.gamestate);
	}

	//:::::::::::::::::::::::::::::::::::::: Game End?
	triggerEnd(){
		if(this.gamestate == "exit") return true;
	}
}


//Create Game Element
	var game = new Wilderness();

//============================================================= EOF