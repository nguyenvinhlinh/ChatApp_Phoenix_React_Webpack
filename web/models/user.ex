defmodule ChatApp.User do
  use ChatApp.Web, :model

  schema "users" do
    field :username, :string
    field :password, :string, virtual: true
    field :encrypted_password, :string

    timestamps
  end

  @required_fields ["username", "password"]
  @optional_fields []

  def changeset(model, params \\ %{"username": "", "password": ""}) do
    model
    |> cast(params, @required_fields, @optional_fields)
    |> validate_length(:username, [min: 5, max: 25])
    |> validate_length(:password, [min: 5, max: 25])
    |> hash_model_password
    |> unique_constraint(:username)
  end

  defp hash_model_password(model) do
    encrypted_password = :crypto.hash(:sha, get_change(model, :password))
    |> Base.encode64

    put_change(model, :encrypted_password, encrypted_password)
  end
end
