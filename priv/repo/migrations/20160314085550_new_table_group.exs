defmodule ChatApp.Repo.Migrations.NewTableGroup do
  use Ecto.Migration

  def change do
    create table(:groups) do
      add(:name, :string)
      timestamps
    end

    create table(:groups_users) do
      add(:group_id, :integer, null: false)
      add(:user_id,  :integer, null: false)
      timestamps
    end
  end

  def down do
    drop table(:groups)
    drop table(:groups_users)
  end
end
