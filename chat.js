$(document).ready(function(){

	var socket = io.connect("http://localhost:3000");

	var isOpen = false;
	$('#close').click(function(){

		if(!isOpen){
			$('.toggle-chat').toggleClass('glyphicon-chevron-down');
			isOpen = true;
		}
		else{
			isOpen = false;
			$('.toggle-chat').toggleClass('glyphicon-chevron-down');
		}
		$('#chatbox-content').slideToggle("slow");
		
	});


	// Showing online users
	socket.on('online', function(data){

		if(data.length){
			console.log(data);
			for(var i = 0 ;i<data.length;i++){
				$('#usersOnline').append('<p>'+data[i]+'<span class="chat-online"></span></p>');
			}
		}
	});

	$('#submitUser').click(function(){

		var username = $('#username').val();
		if(username.length > 0){

			socket.emit('users', username);
			sessionStorage.setItem('username',username);
		}
		$('#username').val("");
		$(this).attr('disabled','disabled');
	});


	// Sending chat messages 
	socket.on('chatter', function(data){

		if(data.length){

			for(var i = 0 ;i < data.length; i++){
				console.log(data[i]['message']);
				$('#storeData').append('<p><span class="message-tooltip">'+data[i]['message']+"</span></p>");
			}
			console.log(data);
		}
	});

	var storeData = $('#storeData').val();

	$('#chatData').keydown(function(event){

		if(event.which == 13){

			var input = $(this).val();

			socket.emit('input', input);
			event.preventDefault();
			$(this).val("");
		}
	});

	console.log($('#storeData').height());
	$("#storeData").scrollTop($("#storeData")[0].scrollHeight);
	//$('#storeData').scrollTop($('#storeData').height())
});