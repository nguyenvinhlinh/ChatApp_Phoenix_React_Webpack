defmodule ChatApp.SessionController do
  use ChatApp.Web, :controller
  
  alias ChatApp.User
  alias ChatApp.Utilities
  def new(conn, _args) do
    render(conn, "new.html")
  end

  def create(conn, %{"login" => %{"username" => username, "password" => password, "remember_me" => remember_me}}) do
    encrypted_password  = :crypto.hash(:sha, password)
    |> Base.encode64
    user = Repo.get_by(User, username: username)
    if user != nil && user.encrypted_password == encrypted_password do
      if remember_me == "true" do
        remember_me_token = Utilities.generate_random_token(64)
        user = Ecto.Changeset.change(user, remember_me_token: remember_me_token)
        case Repo.update user do
          {:ok, model} ->
            user = model
          {:error, _changeset} ->
            conn = put_flash(conn, :error, "Cannot use remember me feature")
        end
        conn = conn
        |> put_resp_cookie("remember_me_token", remember_me_token, [max_age: 7*24*60*60])
        |> put_resp_cookie("username", user.username, [max_age: 7*24*60*60])
      end
      
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
    |> put_resp_cookie("remember_me_token", "", [max_age: 0])
    |> put_resp_cookie("username", "", [max_age: 0])
    |> delete_session(:user_id)
    |> redirect(to: page_path(conn, :index))
  end
end
