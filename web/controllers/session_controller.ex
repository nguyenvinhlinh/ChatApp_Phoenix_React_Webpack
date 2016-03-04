defmodule ChatApp.SessionController do
  use ChatApp.Web, :controller
  alias ChatApp.User
  def new(conn, _args) do
    render(conn, "new.html")
  end

  def create(conn, %{"login" => %{"username" => username, "password" => password, "remember_me" => remember_me}}) do
    encrypted_password  = :crypto.hash(:sha, password)
    |> Base.encode64
    user = Repo.get_by(User, username: username)
    if user != nil && user.encrypted_password == encrypted_password do
      conn
      |> put_flash(:info, "Login successfully.")
      |> put_session(:user_id, user.id)
      |> redirect(to: page_path(conn, :index))
    else
      conn
      |> put_flash(:error, "Invalid username or password")
      |> redirect(to: session_path(conn, :new))
    end
  end

  def delete(conn, _args) do
    conn
  end
end
