$(function(){
   	//make connection
	var socket = io.connect('192.168.2.104:3000')

	//buttons and inputs
	var message = $("#message")
	var username = $("#user")
	var send_message = $("#send_message")
	var send_username = $("#send_username")
	var chatroom = $("#chatroom")
	var feedback = $("#feedback")
	var ye = $("#yee")
  //Emit message
socket.emit('change_username', {username : username.val()})

	send_message.click(function(){
		socket.emit('new_message', {message : message.val()})
	})

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
