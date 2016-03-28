import {EventEmitter} from "events";
import {ChatAppConstants} from "../constants/ChatAppConstants.js";
import {ChatAppDispatcher} from "../dispatchers/ChatAppDispatcher.jsx";

var ChatAppState = {};

function click_on_chat_room_row(room_id){
  ChatAppState["current_room_id"] = room_id;
}

function update_state_message(room_id, payload){
  
}

function update_state_user_status(room_id, payload){
  
}

function insert_state_user_status(room_id, payload){
  
}
