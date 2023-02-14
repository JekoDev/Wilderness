/* ==============================================================
	Wilderness
=============================================================== */

class Network{

	mode = 0;
	//0=Client | 1=Server

	rooms = [];

	// current user
	cuser = {
		username: "",
		playerNr: 0,
		yourTurn: 0
	}

	//connected room name
	// playerTurn 1 means player 1 can take a turn etc.
	croom = {
		users: [],
		roomKey: "",
		roomData: {
			mapData: [],
			playerTurn: 2
		}
	};
	ip = "127.0.0.1";
	port = wilderness_port;
	server = false;
	socket = null;
	connected = false;

	//Functions ===============================================

	constructor(){

		this.socket = new WebSocket('ws://localhost:' + this.port);

		this.socket.addEventListener("open", () => {
  			this.connected = true;
		});

		this.socket.addEventListener('message', (event) => {
    		this._thread_network(event);
		});

		this.socket.addEventListener('error', (event) => {
			console.log('WebSocket error: ', event);
		});

		var that = this;
		setTimeout(function(){
			if (that.connected != true){
				alert("Warning: No Server connection possible! " + that.connected);
			}

		},2000, that);
	}

	extractParams = function (message) {
		let params = [];

		message = message.substring(3);
		var count = (message.match(/\$/g) || []).length;

		for (let i = 0; i < count; i++) {
			params.push(message.split("$")[i]);
		}

		return params;
	}

	_thread_network(msg){

		let message = msg.data.toString();

		let order = message.split("$")[0];
		let param = message.split("$")[1];
		let paramArray = this.extractParams(message);
		var _data = msg.data;

		switch(order){
			case "RC":
				// add room key to rooms
				this.rooms.push(paramArray[0]);

				// get JSON room object
				let receivedUsers = JSON.parse(paramArray[1]);

				receivedUsers.forEach(u => {
					this.croom.users.push(u);
				})
				//this.croom.users.push(JSON.parse(paramArray[1]));
				this.croom.roomKey = paramArray[0];
				// hypothetical "last players turn" was the second player's
				this.croom.roomData.playerTurn = 2;

				// update GUI
				this.croom.users.forEach( u => {
					$('#user-list').append("<div>" + u.name + "</div>");
				})
				$('#display-room-key').append("<div>" + this.croom.roomKey + "</div>");
				break;
			case "RJ": // Room joined
				let receivedRoom = JSON.parse(paramArray[0]);

				// have to do check on client side, which is worse performance-wise
				if (this.isUserInRoom(receivedRoom)) {
					console.log('Room was joined')
					this.croom.roomKey = receivedRoom.name;
					this.croom.roomData.mapData = receivedRoom.roomData.mapData;
					// havent been able to pass the exact map data
					// items are generated on "setData" so theyre not identical
					// needs fixing
					this.initSprites()
					this.setStartingPosition(1, 1);

					// update GUI
					this.croom.users.forEach( u => {
						$('#user-list').append("<div>" + u.name + "</div>");
					})
					$('#display-room-key').empty();
					$('#display-room-key').append("<div>" + this.croom.roomKey + "</div>");
				}

				break;
			case "RR":
				//Refresh Rooms
				break;
			case "YT":
				// Receives last turn data
				// if you're not the last user who took a turn, it becomes your turn
				let userTurn = paramArray[0];
				let turnData = JSON.parse(paramArray[1]);

				if (parseInt(userTurn) === this.cuser.playerNr) {
					this.cuser.yourTurn = true;
					this.evaluateTurnData(turnData);
					$('#main-game').removeClass('pointer-event-none');
					$('#turn-modal').addClass('hiddenelement');
					console.log('Your turn!');
				} else {
					this.cuser.yourTurn = false;
					$('#main-game').addClass('pointer-event-none');
					$('#turn-modal').removeClass('hiddenelement');
					console.log('Not your turn!');
				}

				this.croom.roomData.playerTurn = userTurn;

				break;
			case "DC":
				//Server has ended
				console.log('disconnecting from ' + JSON.parse(paramArray[0]));
				if (this.isUserInRoom(JSON.parse(paramArray[0]))) {
					$('#main-game').addClass('hiddenelement');
					$('#network-menu').removeClass('hiddenelement');
					$('#main-game').removeClass('pointer-event-none');
					$('#turn-modal').addClass('hiddenelement');
					this.socket.close();
				}

				break;
		}
	}

	setStartingPosition(x, y) {
	}

	evaluateTurnData(data) {
		switch (data.type) {
			case 'move':
				wilderness_player2.setPosEase(data.x, data.y)
				break;
		}
	}

	isUserInRoom (room) {
		this.croom.users = room.users;
		let userNamesInRoom = [];
		this.croom.users.forEach(user => {
			userNamesInRoom.push(user.name)
		})

		if (userNamesInRoom.includes(this.cuser.username)) {
			return true
		} else {
			return false
		}

	}

	endTurn(turnData) {
		// send which user in which room took a turn
		this.socket.send('TT$' + JSON.stringify(turnData) + '$' + this.croom.roomData.playerTurn + '$' + this.croom.roomKey + '$');
		// thing that signifies that it's not your turn happens
		// maybe no pointer events on game possible? something like that
	}

	createRoom(username){
		let roomname = this.genKey(4);
		this.cuser.username = username;

		// if you create, youre player 1
		this.cuser.playerNr = 1;
		this.cuser.yourTurn = true;
		console.log('Your turn!');

		// init map and players
		this.initSprites();
		let mapData = JSON.stringify(wilderness_map_data);
		this.setStartingPosition(0, 1);
		this.socket.send("CR$"+roomname+"$"+username+"$"+mapData+"$");
		console.log(roomname, username);
		this.server = true;
	}

	initSprites() {
		wilderness_map = new Map(wilderness_width, wilderness_height);
		wilderness_map.setData(wilderness_map_data);
		wilderness_player2 = new Player(1, 1, player2);
		wilderness_player = new Player(1, 1, player);
		wilderness_camera = new Camera(1, 1);
		// center second player
		wilderness_player2.setPosEase(wilderness_player.x, wilderness_player.y);
	}

	joinRoom(playerName, roomKey) {
		this.cuser.username = playerName;

		// if you join, youre player 2
		this.cuser.playerNr = 2;
		this.cuser.yourTurn = false;
		console.log('Not your turn!');
		$('#main-game').addClass('pointer-event-none');
		$('#turn-modal').removeClass('hiddenelement');
		this.socket.send('JR$' + playerName + '$' + roomKey + '$')
	}

	refreshRooms(){
		this.socket.send("RR$");
	}

	disconnect(){
		this.socket.send("DC$"+ JSON.stringify(this.croom) + "$");
		this.socket.close();
	}

	connect(roomname){
		this.socket.send("JR$"+roomname+"$");
		this.server = true;
	}

	exchange(data){
		this.socket.send("ED$"+data+"$");
	}

	roomExists() {
		return true;
	}

	genKey(length) {
		let result = '';
		const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
		for (let i = 0; i < length; i++) {
			result += characters.charAt(
				Math.floor(Math.random() * characters.length));
		}
		return result;
	}
}

var wilderness_network = new Network();


//============================================================= EOF