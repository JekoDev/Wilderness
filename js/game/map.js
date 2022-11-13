/* ==============================================================
	Wilderness
=============================================================== */

var wilderness_width = 100;
var wilderness_height = 100;

var _wilderness_mapcontainer = new PIXI.Container();

class Tile{

	type = 0;
	detailsdummy = 0;

	constructor(type){
		this.type = type;
	}

}

//=============================================================

class Map{
	tiles = [];
	width  = 0;
	height = 0;
	static instance = null;

	//Create Map in these dimensions.
	constructor(width, height){

		if (this.instance == null){
			this.instance = this;
		}else{
			return this.instance;
		}

		this.width  = width;
		this.height = height;
		wilderness_width  = width;
		wilderness_height = height;

		for (this.tiles=[]; this.tiles.push([])<this.height;);
		//randomness function for details goes heeeeere
		//later share over network

		app.stage.addChild(_wilderness_mapcontainer);

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
				_wilderness_mapcontainer.addChild(hex);

				//Generation goes here
			}
		}

		_wilderness_mapcontainer.interactive = true;
		_wilderness_mapcontainer.buttonMode = true;

		_wilderness_mapcontainer
	        .on('pointerdown', _hexmove_onDragStart)
	        .on('pointerup', _hexmove_onDragEnd)
	        .on('pointerupoutside', _hexmove_onDragEnd)
	        .on('pointermove', _hexmove_onDragMove);

	}

	//Set Tile @x,y
	setTile(x,y, tile){
		if (x>=0 && x<this.width && y>=0 && y<this.height){
			this.tiles[x][y] = tile;
			return true;
		}
		return false;
	}

	//Get Tile @x,y
	getTile(x,y){
		if (x>=0 && x<this.width && y>=0 && y<this.height){
			return this.tiles[x][y];
		}

		return null;
	}
}
	
//============================================================= Hexagon Move Functions


	function _hexmove_onDragStart(event) {
  
	  if (this.tween) {
	    this.tween.kill();
	  }
	  
	  this.data = event.data;  
	  this.lastPosition = this.data.getLocalPosition(this.parent); 
	}

	var vx, vy;
	var containerscale = 3.0;

	function _hexmove_onDragMove() {
	  
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

	function _hexmove_onDragEnd() {
	  
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

	
	_wilderness_mapcontainer.scale.x = containerscale;
	_wilderness_mapcontainer.scale.y = containerscale;



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

			_wilderness_mapcontainer.scale.x = containerscale;
			_wilderness_mapcontainer.scale.y = containerscale;
		});
	});


	var wilderness_map = new Map(wilderness_width, wilderness_height);

//============================================================= EOF