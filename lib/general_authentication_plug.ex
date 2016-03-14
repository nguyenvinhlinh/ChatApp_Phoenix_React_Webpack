defmodule ChatApp.GeneralAuthenticationPlug do
  import Plug.Conn
  alias ChatApp.Repo
  alias ChatApp.User
  def init(args) do
    args
  end

  def call(conn, _args) do
    cond do
      get_session(conn, :user_id) != nil ->
        user = Repo.get(User, get_session(conn, :user_id))
        assign(conn, :current_user, user)
      conn.cookies["remember_me_token"] != nil && conn.cookies["username"] != nil ->
        user = Repo.get_by(User, :username, conn.cookies["username"])
        if user.remember_user_token == conn.cookies["remember_me_token"] do
          assign(conn, :current_user, user)
        end
      true ->
        conn
    end
  end
end
