defmodule ChatApp.MethodAuthenticationPlug do
  import Phoenix.Controller, only: [put_flash: 3, redirect: 2]
  import ChatApp.Router.Helpers
  def authenticate_method(conn, _args) do
    if conn.assigns[:current_user] == nil do
      conn
      |> put_flash(:error, "You need to login.")
      |> redirect(to: session_path(conn, :new))
    else
      conn
    end
  end
end
