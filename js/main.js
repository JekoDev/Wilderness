/* ==============================================================
	Wilderness
=============================================================== */


//============================================================= Game

var wilderness_port = 412;
var wilderness_round  = 1;

/*

Berry ID: 1, Water ID: 2
Items could be arranged in a JSON with base amount 0 and set at the beginning of the game

*/

var testCardData = [
	{
		id: 1,
		title: 'Berry',
		description: 'Eat this to gain hunger + 3 ',
		category: 'Food',
		amount: 3
	},
	{
		id: 2,
		title: 'Water',
		description: 'Eat this to gain water level + 3 ',
		category: 'Drink',
		amount: 2
	}
]


class Wilderness{

	cards = [];
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

	initCards() {
		testCardData.forEach( c => {
			var card = new Card();
			card.id = c.id;
			card.title = c.title;
			card.description = c.description;
			card.amount = c.amount;
			card.category = c.category;
			this.cards.push(card);
		});

		this.createCardElems(this.cards);
	}

	createCardElems(arr) {
		$('#items_list').empty();

		arr.forEach(c => {
			if(c.amount > 0) {
				$("#items_list").append("<div id=\"item-" + c.id + "\" class=\"card item_use\" data-amount=" + c.amount + " data-type=\"" + c.category + "\" data-id=" + c.id + "><div class=\"card-header\"><div>"
					+ c.title + "</div><div class=\"amount\">"
					+ c.amount + "</div></div><div>"
					+ c.description + "</div></div>");
				switch (c.category) {
					case "Drink":
						$("#item-" + c.id).addClass('drink-card')
						break;

					case "Food":
						$("#item-" + c.id).addClass('food-card')
						break;
				}
			}
		})

		$('.item_use').on('click', function () {
			game.itemClick(this);
		} );
	}


	itemClick(el) {
		var target = el;

		var cardId = parseInt($(target).attr('data-id'));
		var amount = parseInt($(target).attr('data-amount'));
		var type = $(target).attr('data-type');

		switch(type){
			case "Drink":
				wilderness_player.thirst += 3;
				break;

			case "Food":
				wilderness_player.hunger += 3;
				break;
		}

		amount--;
		console.log(amount);
		this.updateCard(cardId, amount);

		if (amount == 0) {
			$(target).remove();
		}

		game.endTurn();
	}

	updateCard(cardId, amount) {
		var i = this.cards.findIndex(card => card.id === cardId);

		if (i > -1) {
			this.cards[i].amount = amount;
			this.createCardElems(this.cards);
		} else {
			console.log('Card not found');
		}
	}

	addCard(cardId) {
		var i = this.cards.findIndex(card => card.id === cardId);

		if (i > -1) {
			// if item exists
			this.cards[i].amount++
			this.createCardElems(this.cards);
		} else {
			console.error('Invalid ID');
		}
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
		wilderness_network.endTurn();
	}
}


//Create Game Element
	var game = new Wilderness();

//============================================================= EOF