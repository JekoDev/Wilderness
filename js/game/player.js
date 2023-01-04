/* ==============================================================
	Wilderness
=============================================================== */

class Player{
	x = 0;
	y = 0;

	constructor(x,y){
		this.x = x;
		this.y = y;
		_wilderness_mapcontainer.addChild(player);
	}

	setPos(x, y){
		this.x = x;
		this.y = y;
		
		player.transform.scale.x = 0.1;
		player.transform.scale.y = 0.1;
		player.transform.position.x =  x * 80   + 45 -5;
		player.transform.position.y =  y * 90  - 10 ;
		if (x%2 == 1){
			player.transform.position.y += 45 ;
		}
	}
}


wilderness_player = new Player(0,1);


//============================================================= EOF