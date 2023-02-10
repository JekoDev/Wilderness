/* ==============================================================
	Wilderness
=============================================================== */

class Network{

	mode = 0;
	//0=Client | 1=Server

	rooms = [];
	croom = ""; //connected room name
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
			this.createRoom('Testroom', 'Tester');
		});

		this.socket.addEventListener('message', (event) => {
    		this._thread_network(event);
    		console.log(event);
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
				//On Room Created
				console.log('Room created')
				$('#network_rooms').append("<div>" + paramArray[0] + "</div>");
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

	createRoom(roomname, username){
		this.socket.send("CR$"+roomname+"$"+username+"$");
		this.server = true;
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
}

var wilderness_network = new Network();


//============================================================= EOF