var React = require("react");
import {ChatRoomList} from "./chat_room_list.jsx";
import {ChatBox} from "./chatbox.jsx";
import {UserStatusTable} from "./user_status_table.jsx";
import {ChatAppStore} from "../stores/ChatAppStore.jsx";
var ChatAppContainer = React.createClass({
  getInitialState: function(){
    return(ChatAppStore.get_current_state());
  },
  getDefaultProps: function(){
    return(
      {
        rooms: {
          1: {roomname: "room:lobby1",
              channel: "channel_object"},
          2: {roomname: "room:lobby2",
              channel: "channel_object2"}
        }
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
export {ChatAppContainer};
