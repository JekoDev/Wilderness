// (A) INIT + CREATE WEBSOCKET SERVER AT PORT port
var _port = 412;
var ws = require("ws"),
    wss = new ws.Server({ port: _port }),
    rooms = {},
    users = {};
 
class room{
	name = "";
	users = [];
}

// (B) ON CLIENT CONNECT
wss.on("connection", (socket, req) => {
  // (B1) REGISTER CLIENT
  let id = 0;
  while (true) {
    if (!users.hasOwnProperty(id)) { users[id] = socket; break; }
    id++;
  }
 
  // (B2) DEREGISTER CLIENT ON DISCONNECT
  socket.on("close", () => delete users[id]);
 
  // (B3) FORWARD MESSAGE TO ALL ON RECEIVING MESSAGE
  socket.on("message", msg => {
    let message = msg.toString();


    let order = msg.split("$")[0];
    let param = msg.split("$")[1];


    switch(order){
    	case "CR":  //Create Room
    		var r = new Room();
    		r.name = param;
    		r.users.push(users[u]);
    		users[u].send("YES$");
    		break;
    	case "ED":  //exchange Data
    		break;
    	case "RR":  //Refresh Rooms
    		for (let r in rooms){
    			var s = "RR$";
    			if (r.users.length == 1){
    				s += r.name + "$";
    			}
    			users[u].send("YES$");
    		}
    		break;
    	case "JR": 	//Join Room
    		for (let r in rooms){
    			if(r.name == param){
    				if (r.users.length == 1){
	    				r.users.push(users[u]);
						users[u].send("YES$");
					}
    				break;
    			}
    		}
    		break;
    	case "DC":  //Disconnect
    		for (let r in rooms){
    			if(r.name == param){
    				r.users = [];
    				r.users.push(users[u]);
    			}
    		}
    		break;
    	case "DR":  //Destroy Room
    		   for (let r in rooms){
    				if(r.name == param){
    					rooms.remove(r);
    					users[u].send("YES$");
    					break;
    				}
    			}
    		break;
    			
    }


    //for (let u in users) { users[u].send(message); }
  });
});