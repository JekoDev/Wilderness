/* ==============================================================
	Wilderness
=============================================================== */

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

	//Create Map in these dimensions.
	constructor(width, height){
		this.width  = width;
		this.height = height;
		for (this.tiles=[]; this.tiles.push([])<this.height;);
		//randomness function for details goes heeeeere
		//later share over network
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


//============================================================= EOF