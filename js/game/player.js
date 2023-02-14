/* ==============================================================
	Wilderness
=============================================================== */

class Player{
	x = 0;
	y = 0;

	playerSprite;

	thirst = 10;
	hunger = 10;
	energy = 20;

	constructor(x,y, playerSprite){

		this.playerSprite = playerSprite;

		this.x = x;
		this.y = y;
		_wilderness_mapcontainer.addChild(this.playerSprite);
	}

	setPos(x, y){
		this.x = x;
		this.y = y;
		
		this.playerSprite.transform.scale.x = 0.1;
		this.playerSprite.transform.scale.y = 0.1;
		this.playerSprite.transform.position.x =  x * 80   + 45 -5;
		this.playerSprite.transform.position.y =  y * 90  - 10 ;
		if (x%2 == 1){
			this.playerSprite.transform.position.y += 45 ;
		}
	}

	setPosEase(x,y){
		this.x = x;
		this.y = y;

		this.playerSprite.transform.scale.x = 0.1;
		this.playerSprite.transform.scale.y = 0.1;

		var toX = x * 80   + 45 -5;
		var toY = y * 90  - 10 ;

		if (x%2 == 1){
			toY += 45 ;
		}

		gsap.to(this.playerSprite.transform.position, {duration:1.5, x:toX, y:toY});
	}
}

//============================================================= EOF