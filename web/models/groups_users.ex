defmodule ChatApp.GroupsUsers do
  use ChatApp.Web, :model
  alias ChatApp.User
  alias ChatApp.Group
  schema "groups_users" do
    timestamps

    belongs_to(:user, User,
               foreign_key: :user_id,
               references: :id)

    belongs_to(:group, Group,
               foreign_key: :group_id,
               references: :id)
  end

  @required_fields ["group_id", "user_id"]
  @optional_fields []

  def changeset(model, params \\ :empty) do
    model
    |> cast(params, @required_fields, @optional_fields)
  end
end
