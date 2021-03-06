// Initialize the socket.io-client server for bi-directional communicaiton
var socket = io();
const msgContainer = document.querySelector('.chat-messages');

// Get the user name
let { username } = Qs.parse(location.search, {
  ignoreQueryPrefix: true
});

// console.log(username);

// Complete the loading page
$(document).ready(function() {
  // show user when connected to the group
  socket.emit('welcome', 'Welcome to All');

  // Send the username to server
  socket.emit('getUser', username);

  // To show the online users slide effect
  $('#online').click(function() {
    $('#online-users').animate({
      width: 'toggle'
    });
  });

  // Listen all onlie users
  socket.on('online', users => {
    console.log('Online users are :');

    // create a new div element
    var ul = document.createElement('ul');
    let onlineUsers = document.getElementById('online-users');

    users.forEach(user => {
      let li = document.createElement('li');
      var newUser = document.createTextNode(user.username);
      li.append(newUser);
      ul.appendChild(li);
      console.log(user);

      // Remove All exited users
      while (onlineUsers.firstChild) {
        onlineUsers.removeChild(onlineUsers.firstChild);
      }
    });

    // show the updated online users
    onlineUsers.append(ul);
  });

  // Listen when the server send by broadcast
  socket.on('init', info => {
    $('.chat-messages').append(
      '<div class = "message">' + `<p class="notify"> ${info} </p>`
    );
  });

  // Listen when the user is connected
  socket.on('welcome', info => {
    $('.chat-messages').append(
      '<div class = "message">' +
        '<p class="text">' +
        `<p class="meta">${info.username}</p>` +
        `${info.msg} </p>`
    );

    // scroll down
    msgContainer.scrollTop = msgContainer.scrollHeight;
  });

   // Submit the form
  $('form').submit(e => {
    e.preventDefault();

    // Get time interms of 12 hours with am or pm
    const time = new Date().toLocaleString('en-US', {
      hour: 'numeric',
      minute: 'numeric',
      hour12: true
    });
    socket.emit('brodcast', putUserMsg($('#msg').val(), time));

    $('#msg').val('');
    return false;
  });

  // Listen broadcast images
  socket.on('brodcast', msg => {
    // When the page corrupted to send the  username(bug)
    if (0) {
      // location.reload();
    } // Else normally fetch from storage
    else {
      $('.chat-messages').append(
        '<div class = "message">' +
          `<p class="meta"> ${msg.username} <span> ${msg.time} </span> </p>` +
          '<p class="text">' +
          `${msg.message} </p> </div>`
      );
    }

    // scroll down
    msgContainer.scrollTop = msgContainer.scrollHeight + 500;

    // Focus into type msg
    $('#msg').focus();
  });

  // Show msg when the user is disconnected
  socket.on('end', user => {
    console.log(user);
    if (user === undefined) {
      $('.chat-messages').append(
        '<div class = "message">' + `<p class="notify">User is Disconnected</p>`
      );
    } else {
      $('.chat-messages').append(
        '<div class = "message">' +
          `<p class="notify">${user} is Disconnected</p>`
      );
    }

    // scroll down
    msgContainer.scrollTop = msgContainer.scrollHeight + 20;
  });
});


// Return object
function putUserMsg(msg, time) {
  return {
    msg,
    time
  };
}
