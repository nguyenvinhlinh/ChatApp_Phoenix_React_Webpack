var React = require("react");
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
           key={this.props.roomid} onClick={this.props.onClickChatRoomRow.bind(null, this.props.roomid)} >
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
                     key={index} onClickChatRoomRow={this.props.onClickChatRoomRow}
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
export {ChatRoomList};
