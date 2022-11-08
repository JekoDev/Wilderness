/* ==============================================================
	Wilderness
=============================================================== */
	// Setup Pixi Renderer


	var app = new PIXI.Application({width:960, height:540});
	var sprite = PIXI.Sprite.from('data/gfx/test.jpg');
	var hexagon = PIXI.Texture.from('data/gfx/hex.png');
	app.stage.addChild(sprite);
	sprite.transform.position.x = 100;

	var hexcontainer = new PIXI.Container();
	app.stage.addChild(hexcontainer);

	var wilderness_width = 100;
	var wilderness_height = 100;

	for(var y=0; y<wilderness_height; y++){
		for(var x=0; x<wilderness_width; x++){
			var triggerx = 0;
			if(x%2 == 1) triggerx = 1;

			var hex = new PIXI.Sprite(hexagon);
			if (triggerx == 0){
				hex.transform.position.y = y*90 - 45;
			}else{
				hex.transform.position.y = y*90;
			}

			hex.transform.position.x = x*80;
			hex.transform.scale.x = 0.15;
			hex.transform.scale.y = 0.15;
			hex.alpha = Math.random();
			hexcontainer.addChild(hex);
		}
	}

	hexcontainer.interactive = true;
	hexcontainer.buttonMode = true;

	hexcontainer
        .on('pointerdown', onDragStart)
        .on('pointerup', onDragEnd)
        .on('pointerupoutside', onDragEnd)
        .on('pointermove', onDragMove);


	function onDragStart(event) {
  
	  if (this.tween) {
	    this.tween.kill();
	  }
	  
	  this.data = event.data;  
	  this.lastPosition = this.data.getLocalPosition(this.parent); 
	}

	var vx, vy;
	var containerscale = 3.0;

	function onDragMove() {
	  
	  if (this.lastPosition) {
	    
	    var newPosition = this.data.getLocalPosition(this.parent);    
	    this.position.x += (newPosition.x - this.lastPosition.x);
	    this.position.y += (newPosition.y - this.lastPosition.y);
	    if (this.position.x > 0) this.position.x = 0;
	    if (this.position.y > 0) this.position.y = 0;
	    if (this.position.x < -(wilderness_width  * 80 * containerscale - 960)) this.position.x = -(wilderness_width  * 80 * containerscale - 960);
	    if (this.position.y < -(wilderness_height * 90 * containerscale - 540)) this.position.y = -(wilderness_height * 90 * containerscale - 540);
	    vx = (newPosition.x - this.lastPosition.x);
	    vy = (newPosition.y - this.lastPosition.y);
	    this.lastPosition = newPosition;

	  }
	}

	function onDragEnd() {
	  
	  this.data = null;
	  this.lastPosition = null;

	 this.tween = gsap.to(this, {
	    x: this.position.x + vx,
	    y: this.position.y + vy,
	    
	    duration:0.5,
	    ease: "slow",
	    onComplete: () => {
	      this.tween = null;
	    },
	    onUpdate: () => {
	    	if (this.position.x > 0) this.position.x = 0;
	    	if (this.position.y > 0) this.position.y = 0;
	    	
	    }
	  });
	}

	
	hexcontainer.scale.x = containerscale;
	hexcontainer.scale.y = containerscale;



	$(document).ready(function(){
		$("#game_output").html(app.view);

		$("#game_output").bind("mousewheel DOMMouseScroll", function(event){
			if (event.originalEvent.wheelDelta > 0 || event.originalEvent.detail < 0) {
				containerscale += 0.1;
			}else {
			    containerscale -= 0.1;
			}

			if(containerscale < 0.4) containerscale = 0.4;
			if(containerscale > 5)   containerscale = 5;

			hexcontainer.scale.x = containerscale;
			hexcontainer.scale.y = containerscale;
		});
	});


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