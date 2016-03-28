var React = require("react");
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
  render: function(){
    var rows = [];
    for(var key in this.props.users){
      rows.push(
        <UserStatusRow username={this.props.users[key].username} status={this.props.users[key].status} key={key}/>
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
export {UserStatusTable};
