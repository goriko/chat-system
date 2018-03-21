$(function(){
   	//make connection
	var socket = io.connect()

	//buttons and inputs
	var message = $("#message")
	var username = $("#user")
	var send_message = $("#send_message")
	var send_username = $("#send_username")
	var chatroom = $("#chatroom")
	var feedback = $("#feedback")
	var ye = $("#yee")
  //Emit message


	send_message.click(function(){
		socket.emit('change_username', {username : username.val()})
		socket.emit('new_message', {message : message.val()})
	})

message.on('keydown', function(event){
	if (event.key === "Enter") {
		socket.emit('change_username', {username : username.val()})
		socket.emit('new_message', {message : message.val()})
	}
});
	//Listen on new_message
	socket.on("new_message", (data) => {
		feedback.html('');
		message.val('');
		chatroom.append("<p class='message'>" + data.username + ": " + data.message + "</p>")
	})

	//Emit a username
	send_username.click(function(){

	})

	//Emit typing
	message.bind("keypress", () => {
		socket.emit('typing')
	})

	//Listen on typing
	socket.on('typing', (data) => {
		feedback.html("<p><i>" + data.username + " is typing a message..." + "</i></p>")
	})
});

var modal = document.getElementById('modal');
var modalBtn = document.getElementById('modalBtn');
var closeBtn = document.getElementsByClassName('closeBtn')[0];
modalBtn.addEventListener('click', openModal);
closeBtn.addEventListener('click', closeModal);


function openModal(){
	modal.style.display = 'inline-block';
}

function closeModal(){
	modal.style.display = 'none';
}

var modal2 = document.getElementById('modal2');
var modalBtn2 = document.getElementById('modalBtn2');
var closeBtn2 = document.getElementsByClassName('closeBtn2')[0];
modalBtn2.addEventListener('click', openModal2);
closeBtn2.addEventListener('click', closeModal2);


function openModal2(){
	modal2.style.display = 'inline-block';
}

function closeModal2(){
	modal2.style.display = 'none';
}
