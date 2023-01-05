/* ==============================================================
	Wilderness
=============================================================== */


//============================================================= Game

var wilderness_server = true;
var wilderness_round  = 1;

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
		alert("Won");
	}

	updateGUI(){
		$(".game_score").text("Round: "+wilderness_round);
		$("#player_thirst").text(wilderness_player.thirst);
		$("#player_energy").text(wilderness_player.energy);
		$("#player_hunger").text(wilderness_player.hunger);
	}

	isDead(){
		if (wilderness_player.thirst <= 0) return true;
		if (wilderness_player.hunger <= 0) return true;
		if (wilderness_player.energy <= 0) return true;
		return false;
	}

	endTurn(){
		wilderness_round++;
		wilderness_player.thirst--;
		wilderness_player.hunger--;
		wilderness_player.energy--;

		if(this.isDead()) alert("U died!");

		this.updateGUI();
	}
}


//Create Game Element
	var game = new Wilderness();

//============================================================= EOF