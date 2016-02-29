var React = require("react");
var ReactDom = require("react-dom");

var Message = React.createClass({
  render: function(){
    return(
      <div id="message-container">
        <p><b>Linh:</b> Hello Son</p>
        <p><b>Son:</b> Hello Linh</p>
      </div>
    )
  }
});

var InputMessage = React.createClass({
  render: function(){
    return(
      <div id="input_message">
        <div className="input-group">
          <span className="input-group-addon">User</span>
          <input type="text" className="form-control" placeholder="username" aria-describedby="basic-addon1"></input>
        </div>
        <div className="input-group">
          <span className="input-group-addon">Message</span>
          <input type="text" className="form-control" placeholder="message" aria-describedby="basic-addon1"></input>
          <span className="input-group-btn">
            <button className="btn btn-default" type="button">Go!</button>
          </span>
          
        </div>
      </div>
    )
  }
});

var ChatBox = React.createClass({
  render: function(){
    return (
      <div id="chatbox" className="col-md-8 col-md-offset-2">
        <Message />
        <InputMessage />
      </div>
    );
  }
});

ReactDom.render(<ChatBox />, document.getElementById('chatbox-container'));
