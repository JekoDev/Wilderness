/* ==============================================================
	Wilderness
=============================================================== */


class Tile{

	type = 0;
	detailsdummy = 0;
	hexagon = 0;
	hex = null;
	fog = null;

	water = null;
	sleep = null;
	berry = null;

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


		app.stage.addChild(_wilderness_mapcontainer);
		_wilderness_mapcontainer.addChild(_wilderness_container_tiles);
		_wilderness_mapcontainer.addChild(_wilderness_container_items);
		_wilderness_mapcontainer.addChild(_wilderness_container_fog);


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

	clearFog(x,y){
		if (this.tiles[x][y].fog != null){
			gsap.to(this.tiles[x][y].fog, {alpha:0, duration:1});
		}
	}

	clearFogR1(x,y){
		var triggerX = 0;
		if(x%2 == 1) triggerX = 1;

		this.clearFog(x,y);

		if(triggerX==1){
			this.clearFog(x+1,y);
			this.clearFog(x+1,y+1);
			this.clearFog(x-1,y+1);
			this.clearFog(x-1,y);
			this.clearFog(x,y+1);
			this.clearFog(x,y-1);
		}else{
			this.clearFog(x+1,y);
			this.clearFog(x-1,y-1);
			this.clearFog(x+1,y-1);
			this.clearFog(x,y+1);
			this.clearFog(x-1,y);
			this.clearFog(x,y-1);
		}
	}


	//Set MapData Json
	setData(data){
		this.tiles = data;
		for (var i = _wilderness_container_tiles.children.length - 1; i >= 0; i--) {_wilderness_container_tiles.removeChild(_wilderness_container_tiles.children[i]);};
		for (var i = _wilderness_container_items.children.length - 1; i >= 0; i--) {_wilderness_container_items.removeChild(_wilderness_container_items.children[i]);};
		for (var i = _wilderness_container_fog.children.length - 1; i >= 0; i--) {_wilderness_container_fog.removeChild(_wilderness_container_fog.children[i]);};
		var counter = 1;

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

				var fog = new PIXI.Sprite(hexagon_fog);


				if (triggerx == 0){
					hex.transform.position.y = y*90 - 45;
					fog.transform.position.y = y*90 - 45;
				}else{
					hex.transform.position.y = y*90;
					fog.transform.position.y = y*90;
				}

				hex.transform.position.x = x*80;
				fog.transform.position.x = x*80;
				hex.transform.scale.x = 0.15;
				fog.transform.scale.x = 0.15;
				hex.transform.scale.y = 0.15;
				fog.transform.scale.y = 0.15;

				//hex.alpha = Math.random();
				_wilderness_container_tiles.addChild(hex);



				

				var randomize = Math.floor(Math.random()*3);
				//0 = Sleep
				//1 = Sleep & Berry
				//2 = Sleep & Water
				//3 = Sleep & Berry & Water

				//y>60 && x<40 because we do not need the whole Map and it fastens it up drastically
				if (this.tiles[x][y].type != 3 && this.tiles[x][y].type != 6 && y>60 && x<40){
					var sleep = new PIXI.Sprite(icon_sleep);
					sleep.transform.scale.x = 0.1;
					sleep.transform.scale.y = 0.1;

					sleep.transform.position.x = hex.transform.position.x + 40;
					sleep.transform.position.y = hex.transform.position.y + 60;
					_wilderness_container_items.addChild(sleep);
					sleep.interactive = true;
					sleep.buttonMode = true;
					sleep.on("pointerup", _itemclick_sleep)
					this.tiles[x][y].sleep = sleep;

					if (randomize == 1 || randomize == 3){
						var berry = new PIXI.Sprite(icon_berry);
						berry.transform.scale.x = 0.1;
						berry.transform.scale.y = 0.1;
						berry.transform.position.x = hex.transform.position.x + 20;
						berry.transform.position.y = hex.transform.position.y + 10;
						_wilderness_container_items.addChild(berry);
						berry.interactive = true;
						berry.buttonMode = true;
						berry.on("pointerup", _itemclick_berry)
						this.tiles[x][y].berry = berry;
					}

					if (randomize == 2 || randomize == 3){
						var water = new PIXI.Sprite(icon_water);
						water.transform.scale.x = 0.08;
						water.transform.scale.y = 0.08;
						water.transform.position.x = hex.transform.position.x + 60;
						water.transform.position.y = hex.transform.position.y + 10;
						_wilderness_container_items.addChild(water);
						water.interactive = true;
						water.buttonMode = true;
						water.on("pointerup", _itemclick_water)
						this.tiles[x][y].water = water;
					}
				}

				_wilderness_container_fog.addChild(fog);

				this.tiles[x][y].fog = fog;


				hex.interactive = true;
				hex.buttonMode = true;
				hex.on("pointerup", _hexclick_MoveAction);
				
				//Generation goes here
			}
		}

	}
}
	
//============================================================= Hexagon Move Functions

	wilderness_map = new Map(wilderness_width, wilderness_height);
	wilderness_map.setData(wilderness_map_data);

	function _itemclick_sleep(event){
		for(var y=0; y<wilderness_height; y++){
			for(var x=0; x<wilderness_width; x++){
				if (wilderness_map.tiles[x][y].sleep == this){
					if (wilderness_player.x == x && wilderness_player.y == y){
						wilderness_player.energy += 4;
						game.endTurn();
						return;
					}
				}
			}
		}
	}

	function _itemclick_berry(event){
		for(var y=0; y<wilderness_height; y++){
			for(var x=0; x<wilderness_width; x++){
				if (wilderness_map.tiles[x][y].berry == this){
					if (wilderness_player.x == x && wilderness_player.y == y){
						_wilderness_container_items.removeChild(this);
						//Add Berry Card
						game.addCard(1);
						game.endTurn();
						return;
					}
				}
			}
		}
	}

	function _itemclick_water(event){
		for(var y=0; y<wilderness_height; y++){
			for(var x=0; x<wilderness_width; x++){
				if (wilderness_map.tiles[x][y].water == this){
					if (wilderness_player.x == x && wilderness_player.y == y){
						_wilderness_container_items.removeChild(this);
						//Add Water Card
						game.addCard(2);
						game.endTurn();
						return;
					}
				}
			}
		}
	}


	function _hexclick_MoveAction(event) {
		for(var y=0; y<wilderness_height; y++){
			for(var x=0; x<wilderness_width; x++){
				if (wilderness_map.tiles[x][y].hex == this){
					x -= 1; //This confuses me...
					var tx = 0;
					if(x%2 == 1) tx = 1;
					if (wilderness_map.tiles[x][y].type == 3) return; //water
					if (wilderness_map.tiles[x][y].type == 6) return; //highmountain
					var px = wilderness_player.x;
					var py = wilderness_player.y;
					if (((px+1 == x || px-1 == x) && (y==py || (y+1==py && tx==1) || (y-1==py && tx==0))) || (py+1 == y && px == x)  ||  (py-1 == y && px == x)){
						wilderness_player.setPosEase(x,y);
						wilderness_camera.centerTileEase(x,y);
					}else{
						return;
					}
					wilderness_map.clearFogR1(x,y);
					if (wilderness_map.tiles[x][y].type == 4) game.triggerEnd(); //Win
					game.endTurn();
					return;
				}
			}
		}  
	}


	var containerscale = 2.5;

	_wilderness_mapcontainer.scale.x = containerscale;
	_wilderness_mapcontainer.scale.y = containerscale;


	$(document).ready(function(){
		$("#game_output").html(app.view);
	});




//============================================================= EOF