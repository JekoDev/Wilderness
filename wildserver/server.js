// (A) INIT + CREATE WEBSOCKET SERVER AT PORT port
var _port = 412;
var ws = require("ws"),
    wss = new ws.Server({ port: _port }),
    rooms = [],
    users = {};
 
class Room {
	name = "";
	users = [];
}

class User {
	name = "";
	id = -1;
}

extractParams = function (message) {
	let params = [];

	// regex to split params at dollar sign, first param is the order
	message = message.substring(3);
	var count = (message.match(/\$/g) || []).length;

	for (let i = 0; i < count; i++) {
		params.push(message.split("$")[i]);
	}

	return params;
}


// (B) ON CLIENT CONNECT
wss.on("connection", (socket, req) => {
  // (B1) REGISTER CLIENT
  let id = 0;
  while (true) {
    if (!users.hasOwnProperty(id)) { users[id] = socket; break; }
    id++;
  }

  let currentUser = new User();
  currentUser.id = id;

  socket.on("rn", () => {
  	console.log('room created');
  })


 
  // (B2) DEREGISTER CLIENT ON DISCONNECT
  socket.on("close", () => delete users[id]);

  // (B3) FORWARD MESSAGE TO ALL ON RECEIVING MESSAGE
  socket.on("message", msg => {
    let message = msg.toString();

    let order = message.split("$")[0];
    let param = message.split("$")[1];
    let paramArray = extractParams(message);

	  switch(order){
		  case "CR":  //Create Room
			// params:
			// [0]: key
			// [1]: users
    		var r = new Room();
			r.name = paramArray[0];
			currentUser.name = paramArray[1];
			r.users.push(currentUser);
			socket.send('RC$' + r.name + '$' + JSON.stringify(r.users) + '$');
			rooms.push(r);
    		break;
    	case "ED":  //exchange Data
    		break;
		  case "UN":
		  	//r.users.push(msg);
		  	console.log('new user');
			  break;
    	case "RR":  //Refresh Rooms
    		for (let r in rooms){
    			var s = "RR$";
    			if (r.users.length == 1){
    				s += r.name + "$";
    			}
    			//users[u].send("YES$");
    		}

    		socket.send(s);
    		break;
		  case "JR": // Join room
		  	//let roomToFind = rooms.filter( room => room.name === paramArray[1]);
		  	let roomToFind = rooms.find(room => room.name === paramArray[1]);

		  	if (roomToFind === undefined) {
		  		socket.send('error');
			} else {
				currentUser.name = paramArray[0];
				roomToFind.users.push(currentUser);
				console.log(roomToFind);
			}

    		break;
    	case "DC":  //Disconnect
    		for (let r in rooms){
    			if(r.name == param){
    				r.users = [];
    				//r.users.push(users[u]);
    			}
    		}
    		break;
    	case "DR":  //Destroy Room
    		   for (let r in rooms){
    				if(r.name == param){
    					rooms.remove(r);
    					//users[u].send("YES$");
    					break;
    				}
    			}
    		break;

    }

    //for (let u in users) { users[u].send(message); }
  });
});