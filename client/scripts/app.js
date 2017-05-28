// YOUR CODE HERE:
//$(document).ready(function() {
  var app = {
    friends: {},
    server: 'http://parse.hrr.hackreactor.com/chatterbox/classes/messages',
    roomName: 'lobby',
    messages: [],
    roomList: {},

    send: function(message) {
      $.ajax({
        url: app.server,
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
      $('.room-display').text(app.roomName);
      app.fetch();


      setInterval(function() {
        app.fetch();
      }, 3000);
    },

    fetch: function() {
      var fetchObj = $.ajax({
        url: app.server,
        type: 'GET',
        data: {order: '-createdAt'},
        //data: JSON.stringify(message),
        //contentType: 'application/json',
        success: function (data) {
          // if (!data || !data[0]) {
          //   return;
          // }
          //update dom if new messages are available
          //if (mostRecentMessage.objectId !== app.lastMessageId)
          app.messages = data.results.slice();
          app.renderMessages(data.results, app.roomName);
          app.renderRoomList(app.messages);

        },
        error: function (data) {
          // See: https://developer.mozilla.org/en-US/docs/Web/API/console.error
          console.error('chatterbox: Failed to fetch', data);
        }
      });

      //return fetchObj;
      //grab the array of messages  ---> return it
      //iterate over the array of messages
        //call app.renderMessage(messages[i])
    },

    clearMessages: function() {
      $('#chats').children().remove();
    },

    renderMessages: function(messages, roomName) {
      $('#chats').html('');

      messages.forEach(function(message) {

        app.renderMessage(message, roomName);
      });
    },

    renderMessage: function(message, roomName) {
      //app.messages.unshift(message);
      if (message.roomname !== roomName) {
        return;
      }
      // if (app.messages.length > 100) {
      //   app.messages.pop();
      // }
      var $newMsg = $(
        `<div class="panel panel-default">
          <div class="panel-heading username">
          </div>
          <div class="panel-body"></div>
        </div>
        `);
      $newMsg.find('.panel-heading').text(message.username);
      $newMsg.find('.panel-body').text(message.text);

      var $usernameTxt = $newMsg.find('.panel-heading').text();
      console.log($usernameTxt);
      if (app.friends.hasOwnProperty($usernameTxt)) {
        $newMsg.find('.panel-heading').addClass('friend');
      }

      $newMsg.text();
      $('#chats').prepend($newMsg);

      $newMsg.find('.username').on('click', function () {
        console.log('username was clicked');
        app.handleUsernameClick($newMsg.find('.username').text());
      });
    },

    renderRoom: function (roomName) {
      $newRoom = $('<li><a href="#"></a></li>');
      $newRoom.children().text(roomName);
      $newRoom.on('click', function() {
        app.roomName = roomName;
        $('.room-display').text(app.roomName);
        app.renderMessages(app.messages, app.roomName);
      });

      $('#roomSelect').prepend($newRoom);

    },

    renderRoomList: function(messages) {
      if (messages.length > 0) {
        messages.forEach(function(message) {
          if (!app.roomList.hasOwnProperty(message.roomname)) {
            app.roomList[message.roomname] = true;
            app.renderRoom(message.roomname);
          }
        });
      }
    },

    handleUsernameClick: function(username) {
      var friends = this.friends;
      if (!friends.hasOwnProperty(username)) {
        friends[username] = true;
      } else {
        delete friends[username];
      }
    },

    handleSubmit: function() {
      var message = {};
      message.username = window.location.search.slice(10);
      message.text = $('#message')[0].value;
      message.roomname = app.roomName;

      this.send(message);
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
    app.init();
    $submitBtn.on('click', function() {
      console.log('submit button clicked, message is:', $('#message')[0].value);
      if ($('#message')[0].value !== undefined) {
        app.handleSubmit();
      }

    });

    $('.create-room').on('click', function() {
      console.log('click got there.');
      var newRoom = prompt('Enter room name');
      if (!app.roomList.hasOwnProperty(newRoom)) {
        app.renderRoom(newRoom);
        app.roomList[newRoom] = true;
      }


    });

  });






