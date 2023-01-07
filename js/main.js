/* ==============================================================
	Wilderness
=============================================================== */


//============================================================= Game

var wilderness_server = true;
var wilderness_round  = 1;

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
			console.log(c);
			$("#items_list").append("<div id=\"item-" + c.id + "\" class=\"card item_use\" data-amount=" + c.amount + " data-type=\"" + c.category + "\" data-id=" + c.id + "><div class=\"card-header\"><div>"
				+ c.title + ' ' + "ID: " + c.id + "</div><div class=\"amount\">"
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
		})

		$('.item_use').on('click', function () {
			game.itemClick(this);
		} );
	}

	itemClick(el) {
		var target = el;

		var cardId = parseInt($(target).attr('data-id'));
		var amount = $(target).attr('data-amount');
		var type = $(target).attr('data-type');

		console.log('clicked on Id ' + cardId + 'with type ' + type + ' and amount ' + amount);

		switch(type){
			case "Drink":
				wilderness_player.thirst += 3;
				break;

			case "Food":
				wilderness_player.hunger += 3;
				break;
		}

		amount--;

		if (amount > 0) {
			this.updateCard(cardId, amount);
			console.log('items left')
		} else {
			$(target).remove();
		}
		console.log(this.cards);
		game.endTurn();
	}

	updateCard(cardId, amount) {
		console.log('Looking for id ' + cardId);
		var i = this.cards.findIndex(card => card.id === cardId);

		if (i > -1) {
			this.cards[i].amount = amount;
			this.createCardElems(this.cards);
			console.log(this.cards[i]);
		} else {
			console.log('Card not found');
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
	}
}


//Create Game Element
	var game = new Wilderness();

//============================================================= EOF