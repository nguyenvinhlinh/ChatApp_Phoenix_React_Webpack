import {EventEmitter} from "events";
import {ChatAppConstants} from "../constants/ChatAppConstants.js";
import {ChatAppDispatcher} from "../dispatchers/ChatAppDispatcher.jsx";
var assign = require("object-assign");

var CHANGE_EVENT = "change";
var ChatAppState = {
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
};

function click_on_chat_room_row(room_id){
  ChatAppState["current_room_id"] = room_id;
}
function update_state_message(room_id, payload){
  if(ChatAppState.messages[room_id] == null){
    ChatAppState.messages[room_id] = [payload];
  }else {
    ChatAppState.messages[room_id].push(payload);
  }
}
function insert_state_user_status(room_id, payload){
  for(var key in payload){
    ChatAppState[key] = payload[key];
  }
}

var ChatAppStore = assign({}, EventEmitter.prototype, {
  get_current_state: function(){
    return ChatAppState;
  },
  emitChange: function(){
    this.emit(CHANGE_EVENT);
  },
  addChangeListener: function(callback){
    this.on(CHANGE_EVENT, callback);
  },
  removeChangeListener: function(callback){
    this.removeListener(CHANGE_EVENT, callback);
  }
});

ChatAppDispatcher.register(function(action){
  console.log(action);
});

export {ChatAppStore};
