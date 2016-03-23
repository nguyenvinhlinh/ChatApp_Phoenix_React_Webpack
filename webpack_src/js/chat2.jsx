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
  getInitialState: function(){
    return {
      messages: [],
      roomname: "lobby:room1"
    }
  },
  render: function(){
    var current_room_id = this.props.current_room_id;
    return (
      <div className="col-md-6">
        <RoomHeader roomname={this.props.rooms[current_room_id]["roomname"]} />
        <MessageDisplay messages={this.props.messages[this.props.current_room_id]}/>
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
        1: {username: "Halo",
            status: "online"},
        2: {username: "Linh",
            status: "away"},
        3: {username: "Admin",
            status: "offline"}
      }
    }
  },
  render: function(){
    var rows = [];
    for(var key in this.state.users){
      rows.push(
        <UserStatusRow username={this.state.users[key].username} status={this.state.users[key].status} key={key}/>
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
    var className = "";
    if(this.props.roomid == this.props.current_room_id){
      className = "active"
    }
    return(
      <li className={className} role="presentation" >
        <a href="#" data-roomid={this.props.roomid}
           key={this.props.roomid} onClick={this.props.onClickMessageRow.bind(null, this.props.roomid)} >
          {this.props.roomname}
        </a>
      </li>
    )
  }
});

var ChatRoomList = React.createClass({
  getDefaultProps: function(){
    return {
      rooms: {
        1: {roomname: "room:lobby1",
            channel: "channel_object"},
        2: {roomname: "room:lobby2",
            channel: "channel_object2"}
      }
    }
  },
  render: function(){
    var rows = [];
    for(let index in this.props.rooms){
      rows.push(
        <ChatRoomRow roomid={index} roomname={this.props.rooms[index]["roomname"]}
                     key={index} onClickMessageRow={this.props.onClickMessageRow}
                     current_room_id={this.props.current_room_id} />
      );
    }
    return(
      <div className="col-md-2 col-md-offset-1">
        <ul className="nav nav-pills nav-stacked">
          {rows}
        </ul>
      </div>
    )
  }
});
// The end of ChatRoomTable

// The beginning of container
// ##################################
// # ChatRoomList                   #
// #                                #
// # ChatBox prop: channel          #
// #                                #
// # UserStatusTable                #
// #                                #
// ##################################
var ChatAppContainer = React.createClass({
  
  getInitialState: function(){
    return({
      messages: {
        1: [
          {username: "nguyenvinhlinh",
           message: "Hello world"},
          {username: "admin",
           message: "Hi"}
        ],
        2: [
          {username: "nguyenvinhlinh",
           message: "Hello world, room2"},
          {username: "admin",
           message: "Hi room2"}
        ]
      },
      users: {
        1: {username: "Halo",
             status: "online"},
        2: {username: "Linh",
            status: "away"},
        3: {username: "Admin",
             status: "offline"}
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
  onClickMessageRow: function(chatroomrow_id){
    this.setState({
      current_room_id: chatroomrow_id
    });
  },
  render: function(){
    var current_room_id = this.state.current_room_id;
    return(
      <div>
        <ChatRoomList rooms={this.props.rooms} current_room_id={this.state.current_room_id} onClickMessageRow={this.onClickMessageRow}/>
        <ChatBox rooms={this.props.rooms} current_room_id={this.state.current_room_id}
                 messages={this.state.messages} channel={this.props.rooms[current_room_id]["channel"]}/>
        <UserStatusTable users={this.state.users}/>
      </div>
    )
  }
});
// The and of container
var rooms_lobby_channel =  socket.channel("rooms:lobby", {});
var rooms_lobby2_channel =  socket.channel("rooms:lobby2", {});
var rooms = {
  1: {roomname: "room:lobby1",
      channel: rooms_lobby_channel},
  2: {roomname: "room:lobby2",
      channel: rooms_lobby2_channel}
};

var chat_container = ReactDom.render(<ChatAppContainer rooms={rooms}/>, document.getElementById("container"));

rooms_lobby_channel.join()
       .receive("ok", () => {console.log("Client joined the socket server")})
                     .receive("error", () => {console.log("Client cannot join the socket server")});

rooms_lobby2_channel.join()
       .receive("ok", () => {console.log("Client joined the socket server")})
       .receive("error", () => {console.log("Client cannot join the socket server")});
