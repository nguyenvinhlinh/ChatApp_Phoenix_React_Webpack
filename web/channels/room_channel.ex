defmodule ChatApp.RoomChannel do
  use Phoenix.Channel
  import Exredis

  def join("rooms:lobby", _auth_message, socket) do
    current_user = socket.assigns.current_user
    socket = Phoenix.Socket.assign(socket, :status, "online")
    start_link
    |> elem(1)
    |> query(["SET", "#{current_user.id}:#{current_user.username}", "online"])
    send(self, :broadcast_current_user_status)
    send(self, :send_channel_users_status)
    {:ok, socket}
  end

  def join("rooms:" <> r_id, _auth_message, socket) do
    {:error, %{reason: "invalid room"}}
  end

  def handle_in("new_message_event", %{"message" => message}, socket) do
    broadcast(socket, "new_message_event", %{"username" => socket.assigns.current_user.username, "message" => message})
    {:noreply, socket}
  end

  def handle_in("user_change_status_event", %{"status" => status}, socket) do
    current_user = socket.assigns.current_user
    socket = Phoenix.Socket.assign(socket, :status, status)
    start_link
    |> elem(1)
    |> query(["SET", "#{current_user.id}:#{current_user.username}", status])
    send(self, :broadcast_current_user_status)
    {:noreply, socket}
  end

  def handle_info(:broadcast_current_user_status, socket) do
    user = socket.assigns.current_user
    broadcast(socket, "single_user_status_change_event", %{"username" => user.username,
                                                     "user_id" => user.id,
                                                     "status" => socket.assigns.status})
    {:noreply, socket}
  end

  def handle_info(:send_channel_users_status, socket) do
    users = get_all_user_status
    push(socket, "fetch_channel_users_status_event", users)
    {:noreply, socket}
  end

  defp get_all_user_status do
    {:ok, client} = start_link
    [cursor, redis_keys] = query(client, ["SCAN", 0])
    statuses = query(client, ["MGET" | redis_keys]) #=> ["online", "offline", "away"]
    Enum.reduce(Enum.zip(redis_keys, statuses), %{},
      fn(elem, acc) ->
        {id_username, status} = elem
        [id, username] = String.split(id_username, ":")
        Map.put(acc, id, %{username: username, status: status})
      end)#=> %{1 => %{username => "halo", status => "online"}, 2=> %{}}
  end
end
