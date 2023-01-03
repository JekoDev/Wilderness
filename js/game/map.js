/* ==============================================================
	Wilderness
=============================================================== */


class Tile{

	type = 0;
	detailsdummy = 0;
	hexagon = 0;
	hex = null;

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

		if (this.tiles.count == null){
			for (this.tiles=[]; this.tiles.push([])<this.height;);
			//randomness function for details goes heeeeere
			//later share over network
		}

		app.stage.addChild(_wilderness_mapcontainer);

		for(var y=0; y<wilderness_height; y++){
			for(var x=0; x<wilderness_width; x++){
				var triggerx = 0;
				if(x%2 == 1) triggerx = 1;

				if(this.tiles[x][y] == null){
	 			
	 				this.tiles[x][y] = new Tile(0);
					this.tiles[x][y].hex = hex;
				
				}

				switch(this.tiles[x][y].type){
					case 0: //Flat
						var hex = new PIXI.Sprite(hexagon_flat);
						this.tiles[x][y].type = 0;
						break;

					case 1: //Mountain
						var hex = new PIXI.Sprite(hexagon_mountain);
						this.tiles[x][y].type = 1;
						break;

					case 2: //Forest
						var hex = new PIXI.Sprite(hexagon_forest);
						this.tiles[x][y].type = 2;
						break;

					case 3: //Water
						var hex = new PIXI.Sprite(hexagon_water);
						this.tiles[x][y].type = 3;
						break;

					case 4: //End
						var hex = new PIXI.Sprite(hexagon_end);
						this.tiles[x][y].type = 4;
						break;

					case 5: //Start
						var hex = new PIXI.Sprite(hexagon_start);
						this.tiles[x][y].type = 5;
						break;

					case 6: //Mountain_Dead
						var hex = new PIXI.Sprite(hexagon_mountain_dead);
						this.tiles[x][y].type = 6;
						break;
				}


				if (triggerx == 0){
					hex.transform.position.y = y*90 - 45;
				}else{
					hex.transform.position.y = y*90;
				}

				hex.transform.position.x = x*80;
				hex.transform.scale.x = 0.15;
				hex.transform.scale.y = 0.15;
				//hex.alpha = Math.random();
				_wilderness_mapcontainer.addChild(hex);


				hex.interactive = true;
				hex.buttonMode = true;
				hex.on("pointerup", _hexclick_onDragStart);
				
				//Generation goes here
			}
		}

		_wilderness_mapcontainer.interactive = true;
		_wilderness_mapcontainer.buttonMode = true;
		_wilderness_mapcontainer.position.x = -20;
		_wilderness_mapcontainer.position.y = -20;

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

	//Get MapData JSON
	getData(){
		var ret = [];
		ret.push(0);
		for(var y=0; y<this.height; y++){
			for(var x=0; x<this.width; x++){
				ret.push(this.tiles[x][y].type);
			}
		}
		return ret;
	}


	//Set MapData Json
	setData(data){
		this.tiles = data;
		for (var i = _wilderness_mapcontainer.children.length - 1; i >= 0; i--) {	_wilderness_mapcontainer.removeChild(_wilderness_mapcontainer.children[i]);};
		var counter = 1;
		console.log(data);

		this.tiles = [];
		if (this.tiles.count == null){
			for (this.tiles=[]; this.tiles.push([])<this.height;);
			//randomness function for details goes heeeeere
			//later share over network
		}


		for(var y=0; y<this.height; y++){
			for(var x=0; x<this.width; x++){
				var triggerx = 0;
				if(x%2 == 1) triggerx = 1;



				if(this.tiles[x][y] == null){
	 			
	 				this.tiles[x][y] = new Tile(0);
					this.tiles[x][y].hex = hex;
				
				}

				this.tiles[x][y].type = data[counter];
				counter++;
				


				switch(this.tiles[x][y].type){
					case 0: //Flat
						var hex = new PIXI.Sprite(hexagon_flat);
						this.tiles[x][y].type = 0;
						break;

					case 1: //Mountain
						var hex = new PIXI.Sprite(hexagon_mountain);
						this.tiles[x][y].type = 1;
						break;

					case 2: //Forest
						var hex = new PIXI.Sprite(hexagon_forest);
						this.tiles[x][y].type = 2;
						break;

					case 3: //Water
						var hex = new PIXI.Sprite(hexagon_water);
						this.tiles[x][y].type = 3;
						break;

					case 4: //End
						var hex = new PIXI.Sprite(hexagon_end);
						this.tiles[x][y].type = 4;
						break;

					case 5: //Start
						var hex = new PIXI.Sprite(hexagon_start);
						this.tiles[x][y].type = 5;
						break;

					case 6: //Mountain_Dead
						var hex = new PIXI.Sprite(hexagon_mountain_dead);
						this.tiles[x][y].type = 6;
						break;
				}


				if (triggerx == 0){
					hex.transform.position.y = y*90 - 45;
				}else{
					hex.transform.position.y = y*90;
				}

				hex.transform.position.x = x*80;
				hex.transform.scale.x = 0.15;
				hex.transform.scale.y = 0.15;
				//hex.alpha = Math.random();
				_wilderness_mapcontainer.addChild(hex);


				hex.interactive = true;
				hex.buttonMode = true;
				hex.on("pointerup", _hexclick_onDragStart);
				
				//Generation goes here
			}
		}

	}
}
	
//============================================================= Hexagon Move Functions

	function _hexclick_onDragStart(event) {
		for(var y=0; y<wilderness_height; y++){
			for(var x=0; x<wilderness_width; x++){
				if (wilderness_map.tiles[x][y].hex == this){
		//			wilderness_player.setPos(x,y);
					var hextype = parseInt($(".devtool_bttn.mla.active").first().attr("data"));
					_wilderness_mapcontainer.removeChild(wilderness_map.tiles[x][y].hex);
					x=x-1;
					wilderness_map.tiles[x][y].type = hextype;
					$("#programming_debug").val(JSON.stringify(wilderness_map.getData()));
					wilderness_map.setData(wilderness_map.getData());
					return;
				}
			}
		}
	    
	  
	}


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


	wilderness_map = new Map(wilderness_width, wilderness_height);

//============================================================= EOF