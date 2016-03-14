defmodule ChatApp.Message do
  use ChatApp.Web, :model
  alias ChatApp.User
  alias ChatApp.Group
  schema "messages" do
    field :message, :string
    timestamps
    
    belongs_to(:user, User,
               foreign_key: :user_id,
               references: :id)
    belongs_to(:group, Group,
               foreign_key: :group_id,
               references: :id)
  end

  @required_fields ["user_id", "group_id", "message"]
  @optional_fields []

  def changeset(model, params \\ :empty) do
    model
    |> cast(params, @required_fields, @optional_fields)
  end
end
