defmodule ChatApp.AuthenticationPlug do
  import Plug.Conn
  alias ChatApp.Repo
  alias ChatApp.User
  def init(args) do
    args
  end

  def call(conn, _args) do
    user_id = get_session(conn, :user_id)
    cond do
      get_session(conn, :user_id) != nil ->
        user = Repo.get(User, get_session(conn, :user_id))
        assign(conn, :current_user, user)
      true ->
        conn
    end
  end


end
