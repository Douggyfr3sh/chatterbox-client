// YOUR CODE HERE:
//$(document).ready(function() {
  var app = {
    friends: [],

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
      var fetchObj = $.ajax({
        url: 'http://parse.hrr.hackreactor.com/chatterbox/classes/messages',
        type: 'GET',
        //data: JSON.stringify(message),
        contentType: 'application/json',
        success: function (data) {
          console.log('chatterbox: Fetch executed');
        },
        error: function (data) {
          // See: https://developer.mozilla.org/en-US/docs/Web/API/console.error
          console.error('chatterbox: Failed to fetch', data);
        }
      });

      return fetchObj.responseJSON;
      //grab the array of messages  ---> return it
      //iterate over the array of messages
        //call app.renderMessage(messages[i])
    },

    clearMessages: function() {
      $('#chats').children().remove();
    },

    renderMessage: function(message) {
      var $newMsg = $(
        `<div class="panel panel-default">
          <div class="panel-heading username">${message.username}
          </div>
          <div class="panel-body">${message.text}</div>
        </div>
        `);

      var $usernameTxt = $('.username').text();
      if (app.friends.includes($usernameTxt)) {
        $newMsg.find('.panel-heading').addClass('friend');
      }

      $('#chats').prepend($newMsg);

      $('.username').on('click', function () {
        console.log('username was clicked');
        app.handleUsernameClick($('.username').text());
      });
    },

    renderRoom: function (roomName) {
      $newRoom = $('<li><a href="#"></a></li>');
      $newRoom.children().text(roomName);
      $('#roomSelect').prepend($newRoom);
      $('.room-display').text(roomName);

    },

    handleUsernameClick: function(username) {
      var friends = this.friends;
      if (!friends.includes(username)) {
        friends.push(username);
      }
    },

    handleSubmit: function() {
      var message = {};
      message.username = window.location.search.slice(10);
      message.text = $('#message')[0].value;
      message.roomname = $('.room-display').text();

      //this.send(message);
      console.log('handleSubmit was called: ', message);

      $('#message')[0].value = '';
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
    //var username = window.location.search.slice(10);
    $submitBtn.on('click', function() {
      console.log('submit button clicked, message is:', $('#message')[0].value);
      if ($('#message')[0].value !== undefined) {
        app.handleSubmit();
      }

    });

    $('.create-room').on('click', function() {
      console.log('click got there.');
      app.renderRoom(prompt('Enter room name'));
    });

  });






