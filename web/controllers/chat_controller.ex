defmodule ChatApp.ChatController do
  use ChatApp.Web, :controller
  def index(conn, _params) do
    render(conn, "index.html")
  end

end
