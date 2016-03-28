import {ChatAppDispatcher} from "../dispatchers/ChatAppDispatcher.jsx";
import {ChatAppConstants} from "../constants/ChatAppConstants.js";
var ChatAppActions = {
  post_message: function(channel, message){
    channel.push("new_message_event", {message: message});
  },
  click_on_chat_row: function(room_id){
    ChatAppDispatcher.dispatch({
      actionType: ChatAppConstants.ChatApp_click_on_chat_row,
      room_id: room_id
    });
  },
  update_state_message: function(room_id, payload){
    ChatAppDispatcher.dispatch({
      actionType: ChatAppConstants.ChatApp_update_state_message,
      room_id: room_id,
      payload: payload
    });
  },
  update_state_user_status: function(channel, payload){
    ChatAppDispatcher.dispatch({
      actionType: ChatAppConstants.ChatApp_update_state_user_status,
      room_id: room_id,
      payload: payload
    });
  },
  insert_state_user_status: function(room_id, payload){
    ChatAppDispatcher.dispatch({
      
      room_id: room_id,
      payload: payload
    });
  }
};
