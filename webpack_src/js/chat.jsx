var React = require("react");
var ReactDom = require("react-dom");
var idleTimer = require("idle-timer");
import {Socket} from "phoenix";
let socket = new Socket("/socket",
                        {params: window.user_chatting_info});
socket.connect();
/// The beginning of ChatBox
//  #########################
//  # ChatBox               #
//  #  #RoomHeader#         # 
//  #  #MessageDisplay      #
//  #   #MessageRow         #
//  #  #InputMessage        #
//  #########################
var RoomHeader = React.createClass({
  render: function(){
    return(
      <p>
        <span className="label label-success">{this.props.roomname}</span>
      </p>
    )
  }
});
var MessageRow = React.createClass({
  render: function(){
    return(
      <p><b>{this.props.username}:</b> {this.props.message}</p>
    )
  }
});

var MessageDisplay = React.createClass({
  render: function(){
    var rows = [];
    for(var index in this.props.messages){
      rows.push(
        <MessageRow username={this.props.messages[index].username} message={this.props.messages[index].message} key={index}/>
      );
    }
    return(
      <div>
        {rows}
      </div>
    )
  }
});

var InputMessage = React.createClass({
  _pushMessage: function(){
    var message = this.refs.message.value;
    this.props.channel.push("new_message_event", {message: message});
  },
  componentDidMount: function(){
    var channel = this.props.channel;
    this.refs.message.addEventListener("keypress", function(e){
      var key = e.which || e.keyCode;
      if(key === 13 && this.value != ""){
        channel.push("new_message_event", {message: this.value});
        this.value = "";
      }
    });
  },
  render: function(){
    return(
      <div id="input_message">
        <div className="input-group">
          <span className="input-group-addon">Message</span>
          <input ref="message" type="text" className="form-control" placeholder="message" aria-describedby="basic-addon1"></input>
          <span className="input-group-btn">
            <button className="btn btn-default" type="button" onClick={this._pushMessage}>Go!</button>
          </span>
        </div>
      </div>
    )
  }
});

var ChatBox = React.createClass({
  updateState: function(payload){
    this.state.messages.push(payload);
    this.setState({
      messages: this.state.messages
    });
  },
  getInitialState: function(){
    return {
      messages: [],
      roomname: "lobby:room1"
    }
  },
  render: function(){
    return (
      <div className="col-md-12">
        <RoomHeader roomname={this.state.roomname} />
        <MessageDisplay messages={this.state.messages}/>
        <InputMessage channel={this.props.channel}/>
      </div>
    );
  }
});
// The end of ChatBox

// The Beginning of UserStatusTable
//  ###########################
//  # UserStatusTable         #
//  #  #UserStatusRow         #
//  #  #UserStatusRow         #
//  ###########################

var UserStatusRow = React.createClass({
  render: function(){
    var style = {};
    switch(this.props.status){
      case "online":
        style["color"] = "green";
        break;
      case "away":
        style["color"] = "yellow";
        break;
      case "offline":
        style["color"] = "grey";
        break;
    }
    return (
      <tr>
        <td><span className="glyphicon glyphicon-user" aria-hidden="true" style={style}></span></td>
        <td>{this.props.username}</td>
      </tr>
    );
  }
});

var UserStatusTable = React.createClass({
  update_state_single_user: function(payload){
    var user = {
      username: payload.username,
      status: payload.status
    }
    this.state.users[payload.user_id] = user
    this.setState({
      users: this.state.users
    });
  },
  update_state_users: function(payload){ 
    for(var key in payload){
      this.state.users[key] = payload[key];
    }
    this.setState({
      users: this.state.users
    });
  },
  getInitialState: function(){
    return {
      users: {
        // 1: {username: "Halo",
        //     status: "online"},
        // 2: {username: "Linh",
        //     status: "away"},
        // 3: {username: "Admin",
        //     status: "offline"}
      }
    }
  },
  render: function(){
    var rows = [];
    for(var key in this.state.users){
      rows.push(
        <UserStatusRow username={this.state.users[key].username} status={this.state.users[key].status}   key={key}/>
      );
    }
    return (
      <table>
        <tbody>{rows}</tbody>
      </table>
    );
  }
});
// The end of UserStatusTable

// The beginning of ChatRoomList
// ##############################
// # ChatRoomList               #
// #  #ChatRoomRow              #
// #  #ChatRoomRow              #
// ##############################
var ChatRoomRow = React.createClass({
  render: function(){
    return(
      <li className="active" role="presentation" >
        <a href="#" data-roomid={this.props.roomid}>{this.props.roomname}</a>
      </li>
    )
  }
});

var ChatRoomList = React.createClass({
  getInitialState: function(){
    return {
      rooms: {
        1: "room:lobby1",
        2: "room:lobby2"
      }
    }
  },
  render: function(){
    var rows = [];
    for(let index in this.state.rooms){
      rows.push(
        <ChatRoomRow roomid={index} roomname={this.state.rooms[index]} key={index}/>
      );
    }
    return(
      <ul className="nav nav-pills nav-stacked">
       {rows}
      </ul>
    )
  }
});
// The end of ChatRoomTable

var channel =  socket.channel("rooms:lobby", {});
var chatbox_centre = ReactDom.render(<ChatBox channel={channel}/>, document.getElementById('chatbox-container'));
var chatbox_user_table = ReactDom.render(<UserStatusTable />, document.getElementById('chatbox-user-table'));
var chatroom_list = ReactDom.render(<ChatRoomList />, document.getElementById('chat_room_list_container'));
channel.on("new_message_event",
           payload => {
             chatbox_centre.updateState(payload)
           });
channel.on("single_user_status_change_event",
           payload => {
             chatbox_user_table.update_state_single_user(payload);
           });
channel.on("fetch_channel_users_status_event",
           payload => {
             chatbox_user_table.update_state_users(payload);
           });

channel.join()
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
  channel.push("user_change_status_event", {status: "away"});
  user_idle = true;
}
function activeFn() {
  if(user_idle == true){
    channel.push("user_change_status_event", {status: "online"});
    user_idle = false;
  }
}
