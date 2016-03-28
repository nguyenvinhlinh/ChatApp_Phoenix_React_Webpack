var React = require("react");
import {ChatAppActions} from "../actions/ChatAppActions.js";
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
    ChatAppActions.post_message(this.props.channel, message);
    this.refs.message.value = "";
  },
  componentDidMount: function(){
    var channel = this.props.channel;
    var pushMessageFn = this._pushMessage;
    this.refs.message.addEventListener("keypress", function(e){
      var key = e.which || e.keyCode;
      if(key === 13 && this.value != ""){
        pushMessageFn();
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

export {ChatBox};
