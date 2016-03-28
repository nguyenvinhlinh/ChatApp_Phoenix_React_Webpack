var React = require("react");
import {ChatRoomList} from "./chat_room_list.js";
import {ChatBox} from "./chatbox.js";
import {UserStatusTable} from "./user_status_table.js";
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
export {ChatAppContainer};
