/* ==============================================================
	Wilderness
=============================================================== */

class Network{

	mode = 0;
	//0=Client | 1=Server

	rooms = [];

	// current user name
	cuser = ""

	//connected room name
	croom = {
		users: [],
		roomKey: "",
		roomData: {
			mapData: []
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

				// update GUI
				this.croom.users.forEach( u => {
					$('#user-list').append("<div>" + u.name + "</div>");
				})
				$('#display-room-key').append("<div>" + this.croom.roomKey + "</div>");
				break;
			case "RJ": // Room joined
				let receivedRoom = JSON.parse(paramArray[0]);
				this.croom.users = receivedRoom.users;
				let usersNamesInRoom = []
				this.croom.users.forEach(user => {
					usersNamesInRoom.push(user.name)
				})

				// have to do check on client side, which is worse performance-wise
				if (usersNamesInRoom.includes(this.cuser)) {
					console.log('Room was joined')
					this.croom.roomKey = receivedRoom.name;
					this.croom.roomData.mapData = receivedRoom.roomData.mapData;
					// havent been able to pass the exact map data
					// items are generated on "setData" so theyre not identical
					// needs fixing
					wilderness_map = new Map(wilderness_width, wilderness_height);
					wilderness_map.setData(this.croom.roomData.mapData);
					wilderness_player = new Player(1, 1);
					wilderness_camera = new Camera(1, 1);
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
			case "ED":
				//Exchange Data
				switch(param){
					case "MD": //Mapdata
						break;
					case "TN": //Turn
						break;
				}
				break;
			case "DC":
				//Server has ended
				break;
		}
	}

	setStartingPosition(x, y) {
	}

	createRoom(username){
		let roomname = this.genKey(4);
		this.cuser = username;
		wilderness_map = new Map(wilderness_width, wilderness_height);
		wilderness_map.setData(wilderness_map_data);
		wilderness_player = new Player(1, 1);
		wilderness_camera = new Camera(1, 1);
		let mapData = JSON.stringify(wilderness_map_data);
		this.setStartingPosition(0, 1);
		this.socket.send("CR$"+roomname+"$"+username+"$"+mapData+"$");
		console.log(roomname, username);
		this.server = true;
	}

	joinRoom(playerName, roomKey) {
		this.cuser = playerName;
		this.socket.send('JR$' + playerName + '$' + roomKey + '$')
	}

	refreshRooms(){
		this.socket.send("RR$");
	}

	disconnect(){
		this.socket.send("DC$"+this.croom);
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