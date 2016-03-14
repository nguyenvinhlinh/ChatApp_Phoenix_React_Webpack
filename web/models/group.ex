defmodule ChatApp.Group do
  use ChatApp.Web, :model
  alias ChatApp.GroupsUsers
  schema "groups" do
    field :name, :string
    timestamps
    has_many(:groups_users, GroupsUsers,
             foreign_key: :group_id,
             references: :id)
  end

  @required_fields ["name"]
  @optional_fields []

  def changeset(model, params \\ :empty) do
    model
    |> cast(params, @required_fields, @optional_fields)
  end
end
