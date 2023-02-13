/* ==============================================================
	Wilderness
=============================================================== */

class Camera{
	x = 0;
	y = 0;
	zoom = 2.5;

	constructor(x, y){

		this.x = x;
		this.y = y;
		var b = 0;

		wilderness_player.setPos(x,y);
		wilderness_map.clearFogR1(x,y);

		for(var y=0; y<wilderness_height; y++){
			for(var x=0; x<wilderness_width; x++){
				// find tile named "start"
				if (wilderness_map.tiles[x][y].type == 5){
					this.centerTile(x,y);
					wilderness_player.setPos(x,y);
					wilderness_map.clearFogR1(x,y);
				}
			}
		}
	}


	centerTile(x,y){

		var triggerx = 0;
		if(x%2 == 1) triggerx = 1;

		this.x = x*80 * this.zoom - (app.renderer.width-(80*this.zoom) -50)/2;
		this.y = y*90 * this.zoom - (app.renderer.height-(90*this.zoom) +240)/2;
		//Do not know why there has to be this weird numbers (50,240) to correct the center, but it works...

		if (triggerx==1) this.y += 45 * this.zoom;

		_wilderness_mapcontainer.transform.position.x = -this.x;
		_wilderness_mapcontainer.transform.position.y = -this.y;
	}

	centerTileEase(x,y){
		var triggerx = 0;
		if(x%2 == 1) triggerx = 1;

		this.x = x*80 * this.zoom - (app.renderer.width-(80*this.zoom) -50)/2;
		this.y = y*90 * this.zoom - (app.renderer.height-(90*this.zoom) +240)/2;
		//Do not know why there has to be this weird numbers (50,240) to correct the center, but it works...

		if (triggerx==1) this.y += 45 * this.zoom;

		gsap.to(_wilderness_mapcontainer.transform.position, {duration:1, x:-this.x, y:-this.y});
	}
}

//============================================================= EOF