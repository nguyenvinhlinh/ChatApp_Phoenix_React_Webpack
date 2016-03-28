var React = require("react");
var ReactDom = require("react-dom");
var idleTimer = require("idle-timer");
import {ChatAppActions} from "./actions/ChatAppActions.js";
import {Socket} from "phoenix";

import {ChatAppContainer} from "./components/chat_app_container.jsx";
let socket = new Socket("/socket", {params: window.user_chatting_info});
socket.connect();
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
  ChatAppActions.update_state_message(1, payload);
});
room_lobby2_channel.on("new_message_event", payload => {
  ChatAppActions.update_state_message(2, payload);
});
room_lobby_channel.on("user_status_change_event",
                      payload => {
                        ChatAppActions.update_state_user_status(1, payload);
                      });
room_lobby2_channel.on("user_status_change_event",
                       payload => {
                         ChatAppActions.update_state_user_status(2, payload);
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
