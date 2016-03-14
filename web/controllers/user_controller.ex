defmodule ChatApp.UserController do
  use ChatApp.Web, :controller
  alias ChatApp.User
  alias ChatApp.Utilities
  def new(conn, _params) do
    changeset = User.changeset(%User{})
    render(conn, "new.html", changeset: changeset)
  end

  def create(conn, %{"user" => changeset}) do
    user = User.changeset(%User{}, changeset)
    case Repo.insert(user) do
      {:ok, _model} ->
        conn
        |> put_flash(:info, "Created new user account.")
        |> redirect(to: page_path(conn, :index))
      {:error, changeset} ->
        
        errors = Utilities.convert_keyword_to_map(changeset.errors)
        err_mess = Enum.reduce(errors, "", fn(x, acc) ->
          {k,v} = x
          acc <> "#{k} #{v}. "
        end)
        
        conn
        |> put_flash(:error, err_mess)
        |> redirect(to: user_path(conn, :new))
    end
  end
end
