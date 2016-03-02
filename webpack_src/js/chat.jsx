var React = require("react");
var ReactDom = require("react-dom");

import {Socket} from "phoenix";
let socket = new Socket("/socket", {params: {token: window.userToken}});
socket.connect();
var MessageRow = React.createClass({
  render: function(){
    return(
      <p><b>{this.props.user}:</b> {this.props.message}</p>
    )
  }
});

var MessageDisplay = React.createClass({
  render: function(){
    var rows = [];
    for(var index in this.props.messages){
      rows.push(
        <MessageRow user={this.props.messages[index].user} message={this.props.messages[index].message} key={index}/>
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
    var user = this.refs.user.value;
    var message = this.refs.message.value;
    this.props.channel.push("new_message_event", {user: user, message: message});
  },
  render: function(){
    return(
      <div id="input_message">
        <div className="input-group">
          <span className="input-group-addon">User</span>
          <input ref="user"type="text" className="form-control" placeholder="username" aria-describedby="basic-addon1"></input>
        </div>
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
      messages: []
    }
  },
  render: function(){
    return (
      <div className="col-md-8 col-md-offset-2">
        <MessageDisplay messages={this.state.messages}/>
        <InputMessage channel={this.props.channel}/>
      </div>
    );
  }
});
var channel =  socket.channel("rooms:lobby", {});
var chatbox_react = ReactDom.render(<ChatBox channel={channel}/>, document.getElementById('chatbox-container'));

channel.on("new_message_event",
           payload => {
             chatbox_react.updateState(payload)
           });
channel.join()
       .receive("ok", () => {console.log("Client joined the socket server")})
       .receive("error", () => {console.log("Client cannot join the socket server")});
