/* ==============================================================
	Wilderness
=============================================================== */

class Network{

	mode = 0;
	//0=Client | 1=Server

	rooms = [];

	//connected room name
	croom = {
		users: [],
		roomKey: ""
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
    		console.log(event);
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

				// get JSON user object
				this.croom.users.push(paramArray[0]);
				this.croom.roomKey = paramArray[0];
				$('#user-list').append("<div>" + this.croom.users + "</div>");
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

	createRoom(username){
		let roomname = this.genKey(4);
		this.socket.send("CR$"+roomname+"$"+username+"$");
		console.log(roomname, username);
		this.server = true;
	}

	joinRoom(playerName, roomKey) {
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