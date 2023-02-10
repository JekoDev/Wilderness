// (A) INIT + CREATE WEBSOCKET SERVER AT PORT port
var _port = 412;
var ws = require("ws"),
    wss = new ws.Server({ port: _port }),
    rooms = {},
    users = {};
 
class Room {
	name = "";
	users = [];
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


// (B) ON CLIENT CONNECT
wss.on("connection", (socket, req) => {
  // (B1) REGISTER CLIENT
  let id = 0;
  while (true) {
    if (!users.hasOwnProperty(id)) { users[id] = socket; break; }
    id++;
  }

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

    //console.log(params)


	  switch(order){
    	case "CR":  //Create Room
    		var r = new Room();
			r.name = paramArray[0];
			r.users.push(paramArray[1]);
			console.log('Room: ' + r.name + ' by: ' + r.users);
			socket.send('RC$' + r.name + '$');
			//users[u].send("YES$");
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
    		break;
    	case "JR": 	//Join Room
    		for (let r in rooms){
    			if(r.name == param){
    				if (r.users.length == 1){
	    				//r.users.push(users[u]);
						//users[u].send("YES$");
					}
    				break;
    			}
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