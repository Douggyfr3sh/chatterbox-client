// YOUR CODE HERE:
//$(document).ready(function() {
  var app = {
    send: function(message) {
      $.ajax({
        url: 'http://parse.hrr.hackreactor.com/chatterbox/classes/messages',
        type: 'POST',
        data: JSON.stringify(message),
        contentType: 'application/json',
        success: function (data) {
          console.log('chatterbox: Message sent');
        },

        error: function (data) {
          // See: https://developer.mozilla.org/en-US/docs/Web/API/console.error
          console.error('chatterbox: Failed to send message', data);
        }
      });
    },

    init: function() {
      $('.room-display').text('hrr24');
    },

    fetch: function() {
      $.ajax({
        //url: 'http://parse.hrr.hackreactor.com/chatterbox/classes/messages',
        type: 'GET',
        //data: JSON.stringify(message),
        contentType: 'application/json',
        success: function (data) {
          console.log('chatterbox: Message sent');
        },
        error: function (data) {
          // See: https://developer.mozilla.org/en-US/docs/Web/API/console.error
          console.error('chatterbox: Failed to send message', data);
        }
      });
    },

    clearMessages: function() {
      $('#chats').children().remove();
    },

    renderMessage: function(message) {
      var $newMsg = $('<div></div>');
      var newMsgUser = 'user-' + message.username;
      $newMsg.addClass(newMsgUser);
      $newMsg.text(message.user + ': ' + message.text);
      $('#chats').prepend($newMsg);
    },

    renderRoom: function (roomName) {
      $newRoom = $('<li><a href="#"></a></li>');
      $newRoom.children().text(roomName);
      $('#roomSelect').prepend($newRoom);
      $('.room-display').text(roomName);

    }
  };

  $(document).ready( function () {
    var $submitBtn = $('.submit'); //submit button
    var $messageBox = $('.form-control'); //message box
    var $messageFeed = $('#chats'); //message Feed
    var $testRoom = $('.room-test'); //Room Pattern
    var $createRoom = $('.create-room'); //create a new room dropdown button
    var $currentRoom = $('.dropdown-toggle'); //dropdown menu button denoting the current room
    var $roomDisplay = $('.room-display'); //displays room name
    var message = undefined;
    var username = window.location.search.slice(10);
    $submitBtn.on('click', function() {
      message = {
        username: username,
        text: $messageBox[0].value,
        roomname: $roomDisplay.text()
      };
      app.send(message);
    });
    $('.create-room').on('click', function() {
      console.log('click got there.');
      app.renderRoom(prompt('Enter room name'));
    });
  });




