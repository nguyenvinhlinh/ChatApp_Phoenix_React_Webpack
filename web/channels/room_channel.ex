defmodule ChatApp.RoomChannel do
  use Phoenix.Channel

  def join("rooms:lobby", _auth_message, socket) do
    {:ok, socket}
  end

  def join("rooms:" <> r_id, _auth_message, socket) do
    {:error, %{reason: "invalid room"}}
  end

  def handle_in("new_message_event", %{"user" => user, "message" => message}, socket) do
    broadcast(socket, "new_message_event", %{"user" => user, "message" => message})
    {:noreply, socket}
  end
end
