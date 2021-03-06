defmodule ChatApp.Router do
  use ChatApp.Web, :router
  
  pipeline :browser do
    plug :accepts, ["html"]
    plug :fetch_session
    plug :fetch_flash
    plug :protect_from_forgery
    plug :put_secure_browser_headers
    plug ChatApp.GeneralAuthenticationPlug
  end

  pipeline :api do
    plug :accepts, ["json"]
  end

  scope "/", ChatApp do
    pipe_through :browser # Use the default browser stack
    get "/", PageController, :index
    get "/chat", ChatController, :index
    resources("/users/", UserController, except: [:delete, :index])
    resources("/session/", SessionController, only: [:new, :create, :delete])
  end

  # Other scopes may use custom stacks.
  # scope "/api", ChatApp do
  #   pipe_through :api
  # end
end
