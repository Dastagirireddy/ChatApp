var express = require('express'), 
	mongoose = require('mongoose'),
	mongodbURL = "mongodb://localhost/Chat",
	mongodbOptions = {};

var app = express();
var http = require('http').Server(app);
var client = require('socket.io')(http);

// MongoDB connection
mongoose.connect(mongodbURL, mongodbOptions, function (err, res) {

    if(err){ 

        console.log('Connection refused to ' + mongodbURL);
        console.log(err);
    }else{

        console.log('Connection successful to: ' + mongodbURL);
    }
});

app.use(express.static(__dirname));


// Displaying chat.html page as the home page here
app.get('/', function(req, res){

	res.sendfile('chat.html');
});

var Schema = mongoose.Schema;

// Defining Schemas
var Message = new Schema({
	username: { type: String },
	message: { type: String }
});

var User = new Schema({
	username: { type: String, unique: true }
});

var emptyPattern = /^\s*$/;

var messageModel = mongoose.model('Message', Message);
var userModel = mongoose.model('User', User);

var users = [];

client.on('connection', function(socket){


	users.push(socket.id);

	// var onlineUsers = userModel.find(function(error, sucess){

	// 	if(sucess){
	// 		//console.log(sucess);
	// 		socket.emit('online', sucess);
	// 	}
	// });

	socket.emit('online', users);

	socket.on('users', function(data){

		if(!emptyPattern.test(data)){
			users.push(socket.id);
			// var user = new userModel();
			// user.username = data;
			// user.save(function(error, sucess){

			// 	if(sucess){
					
			// 	}
			// });
			client.emit('online', [socket.id]);
		}
	});
	var cientMessages = messageModel.find(function(error, sucess){

		if(sucess){
			//console.log(sucess);
			socket.emit('chatter', sucess);
		}
	});
	
	socket.on('input', function(data){
		if(!emptyPattern.test(data)){
			//console.log(data);
			var chat = new messageModel();
			chat.message = data;
			chat.save(function(error, sucess){

				if(sucess){
					client.emit('chatter', [sucess]);
				}
			});			
		}
		else{
			console.log("Enter some text to store");
		}
	});

	socket.on('disconnect', function(data){
		console.log("Clinet has disconnected");
		var index = users.indexOf(socket.id);
		if (index > -1) {
			users.splice(index, 1);
		}
	});

});

http.listen(3000);

console.log("Server is running on port 3000");