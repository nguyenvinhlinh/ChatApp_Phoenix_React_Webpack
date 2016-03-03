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

  def changset(model, params \\ :empty) do
    model
    |> cast(params, @required_fields, @optional_fields)
    |> validate_length(:username, [min: 5, max: 25])
    |> validate_length(:password, [min: 5, max: 25])
    |> put_change(:encrypted_password, hash_encrypt_password(params.password))
    |> unique_constraint(:username)
  end
  
  defp hash_encrypt_password(password) when is_binary(password) do
    :crypto.hash(:sha, password)
    |> Base.encode64
  end

end
