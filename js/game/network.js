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
		});

		this.socket.addEventListener('message', (event) => {
    		this._thread_network(event);
		});

		var that = this;
		setTimeout(function(){
			if (that.connected != true){
				alert("Warning: No Server connection possible!" + that.connected);
			}

		},2000, that);
	}


	createRoom(roomname){
		this.socket.send("CR$"+roomname+"$");
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

	_thread_network(data){
		var event = data.data.split("$")[0];
		var param = data.data.split("$")[1];
		var _data = data.data;

		switch(data){
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
}

var wilderness_network = new Network();


//============================================================= EOF