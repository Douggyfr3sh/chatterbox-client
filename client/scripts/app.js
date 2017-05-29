// YOUR CODE HERE:
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


      setInterval( () => {
        app.fetch();
      }, 300);
    },

    fetch: function() {
      var fetchObj = $.ajax({
        url: app.server,
        type: 'GET',
        data: {order: '-createdAt'},
        success: function (data) {
          if (!data) {
            return;
          }
          app.messages = data.results.slice();
          app.renderMessages(data.results, app.roomName);
          app.renderRoomList(app.messages);

        },
        error: function (data) {
          // See: https://developer.mozilla.org/en-US/docs/Web/API/console.error
          console.error('chatterbox: Failed to fetch', data);
        }
      });
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
      var $newMsg = $(
        `<div class="panel panel-info">
          <div class="panel-heading username">
          </div>
          <div class="panel-body"></div>
        </div>
        `);
      //Use jquery.text method to escape user input to prevent XSS attacks!
      $newMsg.find('.panel-heading').text(message.username);
      $newMsg.find('.panel-body').text(message.text);

      var $usernameTxt = $newMsg.find('.panel-heading').text();
      console.log($usernameTxt);
      if (app.friends.hasOwnProperty($usernameTxt)) {
        $newMsg.find('.panel-heading').addClass('friend');
      }

      $newMsg.text();
      $('#chats').prepend($newMsg);

      $newMsg.find('.username').on('click', () => {
        app.handleUsernameClick($newMsg.find('.username').text());
      });
    },

    renderRoom: function (roomName) {
      $newRoom = $(`<li><a href="#"></a></li>`);
      $newRoom.children().text(roomName);
      $newRoom.on('click', () => {
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
      $('#message')[0].value = '';
    }




  };

  $(document).ready( function () {
    app.init();

    //Use ES6 arrow functions for anonymous click event handler functions.

    $('.submit').on('click', () => {
      if ($('#message')[0].value !== undefined) {
        app.handleSubmit();
      }

    });

    $('.create-room').on('click', () => {
      var newRoom = prompt('Enter room name');
      if (!app.roomList.hasOwnProperty(newRoom)) {
        app.renderRoom(newRoom);
        app.roomList[newRoom] = true;
      }
    });

  });






