/* ==============================================================
	Wilderness
=============================================================== */
	// Setup Pixi Renderer


	var app = new PIXI.Application({width:960, height:540});
	var sprite = PIXI.Sprite.from('data/gfx/test.jpg');
	var hexagon = PIXI.Texture.from('data/gfx/hex.png');
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