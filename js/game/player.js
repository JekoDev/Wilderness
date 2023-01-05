/* ==============================================================
	Wilderness
=============================================================== */

class Player{
	x = 0;
	y = 0;

	thirst = 10;
	hunger = 10;
	energy = 10;

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

	setPosEase(x,y){
		this.x = x;
		this.y = y;
		
		player.transform.scale.x = 0.1;
		player.transform.scale.y = 0.1;

		var toX = x * 80   + 45 -5;
		var toY = y * 90  - 10 ;

		if (x%2 == 1){
			toY += 45 ;
		}

		gsap.to(player.transform.position, {duration:1.5, x:toX, y:toY});
	}
}


wilderness_player = new Player(0,1);


//============================================================= EOF