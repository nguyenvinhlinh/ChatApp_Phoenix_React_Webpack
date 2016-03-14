defmodule ChatApp.ChatController do
  use ChatApp.Web, :controller
  import ChatApp.MethodAuthenticationPlug
  plug :authenticate_method when action in [:index]
  
  def index(conn, _params) do
    render(conn, "index.html")
  end

end
