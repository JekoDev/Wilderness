// (A) INIT + CREATE WEBSOCKET SERVER AT PORT port
var _port = 412;
var ws = require("ws"),
    wss = new ws.Server({ port: _port }),
    rooms = [],
    users = {};
 
class Room {
	name = "";
	users = [];
	roomData = {
		mapData: "",
		playerTurn: 0
	};
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

defineConnectedUsers = function (roomToFind) {
	let validIds = [];
	roomToFind.users.forEach( u => {
		validIds.push(u.id)
	})
	return validIds
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
  });

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
			// [2]: map data
    		var r = new Room();
			r.name = paramArray[0];
			currentUser.name = paramArray[1];
			r.users.push(currentUser);
			r.roomData.mapData = JSON.parse(paramArray[2]);
			r.roomData.playerTurn = 2;
			socket.send('RC$' + r.name + '$' + JSON.stringify(r.users) + '$' + JSON.stringify(r.roomData.mapData));
			rooms.push(r);
    		break;
    	case "TT":  //take turn
			// find what room a turn was taken in
			let cr = rooms.find(room => room.name = paramArray[1])

			if (cr) {
				if (cr.roomData.playerTurn === 1) {
					wss.clients.forEach(function each(client) {
						client.send('YT$'+ 2 + '$');
					});
					cr.roomData.playerTurn = 2;
				} else {
					wss.clients.forEach(function each(client) {
						client.send('YT$'+ 1 + '$');
					});
					cr.roomData.playerTurn = 1;
				}
			}


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
		  	let connectedUsers;

		  	if (roomToFind === undefined) {
		  		socket.send('error');
			} else {
				currentUser.name = paramArray[0];
				roomToFind.users.push(currentUser);
				connectedUsers = defineConnectedUsers(roomToFind);

				wss.clients.forEach(function each(client) {
					// later on I realized I can send entire objects, didn't do that in "create Room"
					client.send('RJ$'+ JSON.stringify(roomToFind) + '$');
				});


				// only broadcast to users connected to specific room, doesnt really work yet
				// would work better with socket.io instead of node.js websocket
				// socket.io has built in rooms
				/* wss.clients.forEach(client => {
					if(connectedUsers.includes(client.id)) {
					}
				}) */
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