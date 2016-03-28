var React = require("react");
var ReactDom = require("react-dom");
var idleTimer = require("idle-timer");
import {Socket} from "phoenix";
import {ChatRoomList} from "./components/chat_room_list.js";
import {ChatBox} from "./components/chatbox.js";
import {UserStatusTable} from "./components/user_status_table.js";
let socket = new Socket("/socket", {params: window.user_chatting_info});
socket.connect();

var ChatAppContainer = React.createClass({
  getInitialState: function(){
    return({
      messages: {
        // 1: [
        //   {username: "nguyenvinhlinh",
        //    message: "Hello world"},
        //   {username: "admin",
        //    message: "Hi"}
        // ],
        // 2: [
        //   {username: "nguyenvinhlinh",
        //    message: "Hello world, room2"},
        //   {username: "admin",
        //    message: "Hi room2"}
        // ]
      },
      users: {
        // 1: {username: "Halo",
        //      status: "online"},
        // 2: {username: "Linh",
        //     status: "away"},
        // 3: {username: "Admin",
        //      status: "offline"}
      },
      current_room_id: 1
    })
  },
  getDefaultProps: function(){
    return(
      rooms: {
        1: {roomname: "room:lobby1",
            channel: "channel_object"},
        2: {roomname: "room:lobby2",
            channel: "channel_object2"}
      }
    )
  },
  onClickChatRoomRow: function(chatroomrow_id){
    this.setState({
      current_room_id: chatroomrow_id
    });
  },
  updateStateMessage: function(room_id, payload){
    if(this.state.messages[room_id] == null){
      this.state.messages[room_id] = [payload];
    } else {
      this.state.messages[room_id].push(payload);
    }
    this.setState({
      messages: this.state.messages
    });
  },
  updateStateUserStatus: function(room_id, payload){
    var user = {
      username: payload.username,
      status: payload.status
    }
    this.state.users[payload.user_id] = user
    this.setState({
      users: this.state.users
    });
  },
  insertStateUserStatus: function(room_id, payload){
    for(var key in payload){
      this.state.users[key] = payload[key];
    }
    this.setState({
      users: this.state.users
    });
  },
  render: function(){
    var current_room_id = this.state.current_room_id;
    return(
      <div>
        <ChatRoomList rooms={this.props.rooms} current_room_id={this.state.current_room_id} onClickChatRoomRow={this.onClickChatRoomRow}/>
        <ChatBox rooms={this.props.rooms} current_room_id={this.state.current_room_id}
                 messages={this.state.messages} channel={this.props.rooms[current_room_id]["channel"]}/>
        <UserStatusTable users={this.state.users}/>
      </div>
    )
  }
});


var room_lobby_channel =  socket.channel("rooms:lobby", {});
var room_lobby2_channel =  socket.channel("rooms:lobby2", {});
var rooms = {
  1: {roomname: "room:lobby1",
      channel: room_lobby_channel},
  2: {roomname: "room:lobby2",
      channel: room_lobby2_channel}
};
var chat_container = ReactDom.render(<ChatAppContainer rooms={rooms}/>, document.getElementById("container"));
// Handling the return event from server
room_lobby_channel.on("new_message_event", payload => {
  chat_container.updateStateMessage(1, payload);
});
room_lobby2_channel.on("new_message_event", payload => {
  chat_container.updateStateMessage(2, payload);
});
room_lobby_channel.on("single_user_status_change_event",
           payload => {
             chat_container.updateStateUserStatus(1, payload);
           });
room_lobby2_channel.on("single_user_status_change_event",
           payload => {
             chat_container.updateStateUserStatus(2, payload);
           });
room_lobby2_channel.on("fetch_channel_users_status_event",
           payload => {
             chat_container.insertStateUserStatus(1, payload);
           });
// End of events handling

room_lobby_channel.join()
                  .receive("ok", () => {console.log("Client joined the socket server")})
                  .receive("error", () => {console.log("Client cannot join the socket server")});

room_lobby2_channel.join()
                    .receive("ok", () => {console.log("Client joined the socket server")})
                    .receive("error", () => {console.log("Client cannot join the socket server")});

idleTimer({
  callback: idleFn,
  idleTime: 5000
});
var user_idle = false;
window.addEventListener("load", activeFn);
document.addEventListener("mousemove", activeFn);
document.addEventListener("scroll", activeFn);
document.addEventListener("keypress", activeFn);
function idleFn() {
  room_lobby_channel.push("user_change_status_event", {status: "away"});
  user_idle = true;
}
function activeFn() {
  if(user_idle == true){
    room_lobby_channel.push("user_change_status_event", {status: "online"});
    user_idle = false;
  }
}
