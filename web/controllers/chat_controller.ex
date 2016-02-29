defmodule ChatApp.ChatController do
  use ChatApp.Web, :controller
  plug :put_layout, {ChatApp.ChatView, "layout.html"}
  def index(conn, _params) do
    render(conn, "index.html")
  end

end
